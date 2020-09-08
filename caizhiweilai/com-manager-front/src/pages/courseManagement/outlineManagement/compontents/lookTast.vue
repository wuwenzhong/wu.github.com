<template>
  <div>
    <el-form :model="form">
      <el-form-item label="任务名称：" :label-width="formLabelWidth">
        <el-input
          v-model="form.taskName"
          autocomplete="off"
          placeholder="请输入任务名称"
          disabled="disabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="课时：" :label-width="formLabelWidth">
        <el-input v-model="form.period" autocomplete="off" placeholder="请输入课时" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="任务类型：" :label-width="formLabelWidth">
        <el-select
          v-model="form.taskType"
          placeholder="请选择任务类型"
          @change="tastType"
          disabled="disabled"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in tastTypeArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述:" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="form.introduce"
          maxlength="300"
          show-word-limit
          autocomplete="on"
          :autosize="{ minRows: 4}"
          disabled="disabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务资源:" :label-width="formLabelWidth">
        <span @click="yxz" class="rwzywj">
          已选择
          <span class="zy">{{ziyuanNumber}}</span>个文件
        </span>
        <!-- <span class="xzwj" @click="innerVisible = true">选择</span> -->
      </el-form-item>
      <el-divider></el-divider>
      <!-- 知识点任务 -->
      <!-- <div class="zsdxzrw" v-show="whichType == '5'" @click="innerVisible = true">选择文件</div> -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-show="whichType == '5'"
        disabled="disabled"
      >
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)">预览</el-link>
            <!-- <el-link type="warning" @click.native.prevent="handleDelete(scope.$index, tableData)">删除</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="zsdxzrw" v-show="whichType == '6'">选择账套</div> -->
      <el-table :data="dutiesArr" style="width: 100%" border v-show="whichType == '6'">
        <el-table-column prop="caseName" label="账套名称"></el-table-column>
        <!-- <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click.native.prevent="zTdel(scope.$index, dutiesArr)">移除</el-link>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 账套任务资源文件 -->
      <el-dialog width="50%" title="选择账套" :visible.sync="ztFile" append-to-body :close-on-click-modal="false">
        <div class="zsFile">
          <div>已选择{{ztNumber}}个文件</div>
          <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="searckKey"
            class="ssnr"
          ></el-input>
        </div>
        <el-table
          :data="ztArrData"
          style="width: 100%"
          border
          ref="multipleTable1"
        >
          <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
          <el-table-column prop="caseName" label="账套名称"></el-table-column>
        </el-table>
        <paging
          :total="debtTotal"
          :pager-count="5"
          @pagination="monitorPaginZt"
          v-if="debtTotal>10"
          :pageSizes="[10,25,50,100]"
          style="display: flex;justify-content: flex-end;"
        ></paging>
        <span slot="footer" style="display:block;text-align: center;margin-top:15px">
          <el-button class='el-button--small' @click="ztFile=false">取 消</el-button>
          <el-button class='Determine el-button--small'  type="primary" @click="ztFile=false">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 功能实训 -->
      <el-form-item label="功能实训：" :label-width="formLabelWidth" v-show="whichType == '7'">
        <el-select v-model="practicalTraining" placeholder="请选择功能实训" filterable disabled>
          <el-option
            :label="item.funcName"
            :value="item.funcCode"
            v-for="(item,index) in practicalTrainingArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 功能实训  横线下内容 -->
      <!-- <div class="zsdxzrw" v-show="bdCode == 'bd'&&whichType == '7'" @click="gnsxTrain">选择表单</div> -->
      <el-table :data="practicalTraData" style="width: 100%" v-show="bdCode == 'bd'&&whichType == '7'">
        <el-table-column prop="name" label="表单名称"></el-table-column>
        <!-- <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click.native.prevent="handleDelete(scope.$index, practicalTraData)">移除</el-link>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 考试任务 -->
      <el-form-item label="选择试卷：" :label-width="formLabelWidth" v-show="whichType == '4'">
        <el-select v-model="xzsj" placeholder="请选择考试试卷：" disabled="disabled">
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in kssjArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 实操任务 -->
      <el-form-item label="实操任务：" :label-width="formLabelWidth" v-show="whichType == '3'">
        <el-select v-model="scrw" placeholder="请选择实操任务：" disabled="disabled">
          <el-option
            :label="item.systemName"
            :value="item.id"
            v-for="(item,index) in scrwArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- =================================================选择资源文件===================================================== -->
    <el-dialog width="40%" title="选择文件" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="searckKey"
        @input="searchContent"
        class="ssnr"
      ></el-input>
      <el-table :data="xzFile" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column prop="filename" label="文件名称"></el-table-column>
        <el-table-column type="selection" width="66"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- =================================================已选择文件===================================================== -->
    <el-dialog width="40%" title="选择文件" :visible.sync="innerVisibleYxz" append-to-body :close-on-click-modal="false">
      <el-table
        :data="ziyuanNumberArr"
        style="width: 100%"
        border
      >
        <el-table-column type="selection" width="66"></el-table-column>
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)">预览</el-link>
            <!-- <el-link type="warning" @click="delYxz(scope.$index, knowledgeFileArrTb)">删除</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button class='el-button--small' @click="innerVisibleYxz = false">取 消</el-button>
        <el-button class='Determine el-button--small' type="primary" @click="innerVisibleYxz = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预览文件 -->
    <el-dialog width="95%" :visible.sync="isShowPrevFile" append-to-body :close-on-click-modal="false">
      <show-prev-file append-to-body :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { tjNumber, obtainmc, querySjList } from '@/api/course'
import showPrevFile from '@/components/showPrevFile/index'

export default {
  name: 'addTast',
  props: ['lookTastData'],
  computed: {
    ...mapGetters(['userId'])
  },
  components: {
    showPrevFile
  },
  data() {
    return {
      innerVisible: false,
      innerVisibleYxz: false,
      formLabelWidth: '120px',
      tableData: [],
      ziyuanNumber: '',
      ziyuanNumberArr: [],
      whichType: '',
      xzsj: '',
      scrw: '',
      xzFile: [],
      searckKey: '',
      tastTypeArr: [],
      scrwArr: [],
      form: {
        taskName: '',
        period: '',
        taskType: '',
        introduce: '',
        operationId: '',
        paperId: '',
        courseId: this.$route.query.courseId,
        outlineId: sessionStorage.getItem('dgId'),
        KnowledgeFile: '',
        creator: '',
        flieId: ''
      },
      kssjArr: [],
      zsdOrzywj: '',
      flieIdArr: [],
      isShowPrevFile: false, // 预览
      previewData: {}, // 预览参数
      aptionArr: [],
      dutiesArr: [],
      practicalTraining: '',
      practicalTrainingArr: [],
      practicalTraData: [],
      ztArrData: [],
      debtTotal: 0,
      ztListArr: [],
      ztNumber: 0,
      ztSize: '10',
      ztPage: '1',
      ztKeyword: '',
      bdCode: '',
      gnFlag: false,
      ztFile: false,
      gnNumber: 0, // 功能实训个数
      gnsxData: [], // 功能实训数组
      newngArr: []
    }
  },
  mounted() {
    this.init()
    // 用户id
    this.form.creator = this.userId
    // 数据回显
    this.form.taskName = this.lookTastData.taskName
    this.form.period = this.lookTastData.period
    this.form.introduce = this.lookTastData.introduce
    this.form.operationId = this.lookTastData.operationId
    this.form.paperId = this.lookTastData.paperId
    this.scrw = this.lookTastData.taskTypeName
    this.form.KnowledgeFile = this.lookTastData.KnowledgeFile
    this.form.flieId = this.lookTastData.flieId
    this.form.taskType = this.lookTastData.taskName
    // 横下下面
    this.whichType = this.lookTastData.taskType
    // 账套任务
    if (this.lookTastData.casesDTOList) {
      this.dutiesArr = this.lookTastData.casesDTOList
      this.form.accountId = this.lookTastData.accountId
    }
    // 功能实训
    this.bdCode = this.lookTastData.funcId
    // 功能实训下拉框
    if (this.lookTastData.funcName) {
      this.practicalTraining = this.lookTastData.funcName
      this.form.funcId = this.lookTastData.funcId
    }
    // 表单文件集合
    this.practicalTraData = this.lookTastData.formInfoDTOS
    this.form.formId = this.lookTastData.formId
    // 选择试卷
    this.xzsj = this.lookTastData.paperId
    // 已选择多少个文件
    tjNumber({ taskId: this.lookTastData.id }).then(res => {
      this.ziyuanNumber = res.result.length
      this.ziyuanNumberArr = res.result
      for (let index = 0; index < this.ziyuanNumberArr.length; index++) {
        this.flieIdArr.push(this.ziyuanNumberArr[index].resId ? this.ziyuanNumberArr[index].resId : this.ziyuanNumberArr[index].id)
      }
    })
    // 查询试卷列表
      querySjList({
        page: '1',
        size: '99',
        keyWrods: ''
      }).then(res => {
        this.kssjArr = res.result.data
      })
    // 知识文件集合
    if (!this.lookTastData.knowledgeFile) {
      return false
    }
    if (this.lookTastData.knowledgeFile.indexOf(',') == -1) {
      if (!this.lookTastData.knowledgeFile) {
        return false
      }
      obtainmc(this.lookTastData.knowledgeFile).then(res => {
        if (res.code == 0) {
          this.tableData = res.result
        } else {
          const zsArr = this.lookTastData.knowledgeFile.split(',')
            obtainmc([zsArr]).then(res => {
            if (res.code == 0) {
              this.tableData = res.result
            }
          })
        }
      })
    } else {
      const stringArr = this.lookTastData.knowledgeFile.split(',')
      obtainmc(stringArr).then(res => {
        if (res.code == '0') {
          this.tableData = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  },
  methods: {
    init() {
      // 知识文件集合
      if (!this.lookTastData.knowledgeFile) {
        return false
      }
      const zsArr = this.lookTastData.knowledgeFile.split(',')
      if (zsArr.length > 0) {
        obtainmc(zsArr).then(res => {
          if (res.code == 0) {
            this.tableData = res.result
          }
        })
      }
    },
    testPaperFunction(val) {
      // 选择试卷内容
      this.form.paperId = val
    },
    // 文件预览
    previewFile(item) {
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      if (item.converUrl) {
        this.previewData.imgUrl = item.converUrl
      } else {
        this.previewData.imgUrl = item.downloadUrl
      }
      this.isShowPrevFile = true
    },
    // 删除
    handleDelete(index, row) {
      row.splice(index, 1)
      this.$message({
        message: '已删除!',
        type: 'success'
      })
    },
    tastType(value) {
      this.whichType = value
      this.form.taskType = value
    },
    shicaoTast(val) {
      // 实操任务
      this.from.operationId = val
    },
    handleSelectionChange(val) {
      // 已选择的资源文件总数
      this.ziyuanNumber = val.length
      // 选中的资源文件
      this.tableData = val
      const addData = val[val.length - 1].resId
      // 判断是知识点文件还是资源文件
      if (this.zsdOrzywj == 1) {
        this.form.flieId = ''
        this.flieIdArr.push(addData)
        this.form.flieId = this.flieIdArr.join(',')
      } else if (this.zsdOrzywj == 2) {
        this.form.knowledgeFile = ''
        this.knowledgeFileArr.push(addData)
        this.form.knowledgeFile = this.knowledgeFileArr.join(',')
      }
    },
    searchContent(val) {
      // 搜索内容
    },
    yxz() {
      // 已选择文件数组
      this.innerVisibleYxz = true
    }
  }
}
</script>

<style>
.dialog-footer {
  margin-top: 20px;
}
.el-form .el-select {
  width: 100%;
}
.Determine{
  background: #414d65;
}
.zy {
  font-size: 16px;
  padding-bottom: 5px;
  border-bottom: 2px solid rgb(80, 200, 218);
  color: rgb(80, 200, 218);
  margin: 0 5px;
}
.xzwj {
  font-size: 16px;
  padding-bottom: 5px;
  border-bottom: 2px solid rgb(80, 200, 218);
  color: rgb(80, 200, 218);
  margin-left: 20px;
  cursor: pointer;
}
.ssnr {
  width: 40%;
  float: right;
  margin-bottom: 20px;
}
.zsdxzrw {
  width: 76px;
  height: 28px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 221, 221, 1);
  text-align: center;
  line-height: 28px;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>