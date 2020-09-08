<template>
  <div>
    <el-form :model="form">
      <el-form-item label="任务名称：" :label-width="formLabelWidth">
        <el-input v-model="form.taskName" autocomplete="off" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="课时：" :label-width="formLabelWidth">
        <el-input v-model="form.period" autocomplete="off" placeholder="请输入课时" type="number" @mousewheel.native.prevent></el-input>
      </el-form-item>
      <el-form-item label="任务类型：" :label-width="formLabelWidth">
        <el-select v-model="form.taskType" placeholder="请选择任务类型" @change="selectTastType">
          <el-option
            :label="item.name"
            :value="item.code"
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
        ></el-input>
      </el-form-item>
      <el-form-item label="任务资源:" :label-width="formLabelWidth">
        <span @click="yxz" class="rwzywj">
          已选择
          <span class="zy">{{ziyuanNumber}}</span>个文件
        </span>
        <span class="xzwj" @click="yxzdwj">选择</span>
      </el-form-item>
      <el-divider></el-divider>
      <!-- 知识点任务 -->
      <div class="zsdxzrw" v-show="whichType == '5'" @click="zsdyzwj">选择文件</div>
      <el-table :data="knowledgeFileArrTb" style="width: 100%" border v-show="whichType == '5'">
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)" style="margin-right:10px">预览</el-link>
            <el-link
              type="warning"
              @click.native.prevent="handleDelete(scope.$index, knowledgeFileArrTb)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 账套任务 -->
      <div class="zsdxzrw" v-show="whichType == '6'" @click="ztCheck">选择账套</div>
      <el-table :data="dutiesArr" style="width: 100%" border v-show="whichType == '6'">
        <el-table-column prop="caseName" label="账套名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click.native.prevent="zTdel(scope.$index, dutiesArr)">移除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 账套任务资源文件 -->
      <el-dialog width="50%" title="选择账套" :visible.sync="ztFile" append-to-body :close-on-click-modal="false">
        <div class="zsFile">
          <div>已选择{{ztNumber}}个文件</div>
          <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="searckKey"
            @input="ztcs"
            class="ssnr"
          ></el-input>
        </div>
        <el-table
          :data="ztArrData"
          style="width: 100%"
          border
          @selection-change="ztCheckData"
          @select-all="ztCheckData"
          ref="multipleTable3"
          :row-key="bingRowkeys"
        >
          <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
          <el-table-column prop="caseName" label="账套名称"></el-table-column>
        </el-table>
        <paging
          :total="debtTotal"
          @pagination="monitorPaginZt"
          :pager-count="5"
          v-if="debtTotal>10"
          :pageSizes="[10,25,50,100]"
          :page.sync="pageParamsGxh"
          style="display: flex;justify-content: flex-end;"
        ></paging>
        <span slot="footer" style="display:block;text-align: center;margin-top:15px">
          <el-button @click="ztFile=false" class='el-button--small'>取 消</el-button>
          <el-button class='Determine el-button--small'  type="primary" @click="sureZt">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 功能实训 -->
      <el-form-item label="功能实训：" :label-width="formLabelWidth" v-show="whichType == '7'">
        <el-select v-model="practicalTraining" placeholder="请选择功能实训" @change="practicalTra" filterable>
          <el-option
            :label="item.funcName"
            :value="item.funcCode"
            v-for="(item,index) in practicalTrainingArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 功能实训  横线下内容 -->
      <div class="zsdxzrw" v-show="bdCode == 'bd'&&whichType == '7'" @click="gnsxTrain">选择表单</div>
      <el-table :data="practicalTraData" style="width: 100%" v-show="bdCode == 'bd'&&whichType == '7'">
        <el-table-column prop="name" label="表单名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click.native.prevent="deletesx(scope.$index, practicalTraData)">移除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 功能实训资源文件 -->
      <el-dialog width="50%" title="选择表单" :visible.sync="gnFlag" append-to-body :close-on-click-modal="false">
        <div class="zsFile">
          <div>已选择{{gnNumber}}个文件</div>
        </div>
        <el-table
          :data="gnsxData"
          style="width: 100%"
          border
          @selection-change="gnSelect"
          @select-all="gnSelect"
          ref="multipleTablegn"
          :row-key="bingRowkeys"
        >
          <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
          <el-table-column prop="name" label="表单名称"></el-table-column>
        </el-table>
        <span slot="footer" style="display:block;text-align: center;margin-top:15px">
          <el-button @click="cancelGn" class='el-button--small'>取 消</el-button>
          <el-button class='Determine el-button--small'  type="primary" @click="sureGn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 考试任务 -->
      <el-form-item label="选择试卷：" :label-width="formLabelWidth" v-show="whichType == '4'">
        <el-select v-model="xzsj" placeholder="请选择考试试卷" @change="testPaperFunction">
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
        <el-select v-model="scrw" placeholder="请选择实操任务" @change="shicaoTast">
          <el-option
            :label="item.systemName"
            :value="item.id"
            v-for="(item,index) in scrwArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 企业信息下拉框 -->
        <el-form-item label="企业名称：" :label-width="formLabelWidth" prop="orgName" v-show="tjbb && whichType=='3'">
          <el-select v-model="aptionArr" filterable placeholder="请选择企业名称" multiple @change='qyId'>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <span slot="footer" style="display:block;text-align: center;margin-top:15px">
      <el-button class='el-button--small' @click="calloff">取 消</el-button>
      <el-button class='Determine el-button--small' type="primary" @click="qdData">确 定</el-button>
    </span>
    <!-- =================================================已选择文件===================================================== -->
    <el-dialog width="50%" title="选择文件" :visible.sync="innerVisibleYxz" append-to-body :close-on-click-modal="false">
      <el-table :data="ziyuanNumberArr" style="width: 100%"  border>
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)" style="margin-right:10px">预览</el-link>
            <el-link type="warning" @click="delYxz(scope.$index, ziyuanNumberArr)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- =================================================选择资源文件===================================================== -->
    <el-dialog
      width="50%"
      title="选择文件"
      :visible.sync="innerVisible"
      append-to-body
      :before-close="sureQ"
      v-if="innerVisible"
      :close-on-click-modal="false"
    >
      <div class="ziUpdata">
        <el-upload class="upload-demo" action="#" accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .txt, .mp4, .rmvb, .jpg, .jpeg, .gif, .png, .avi, .pdf,.mp3" :show-file-list="false" :http-request="updataPic" multiple :before-upload="uploadBefore" size='small'>
            <el-button style="background:#414d65;color:#fff" ref="sjsc">本地上传</el-button>
          </el-upload>
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="searckKey"
          @input="searchContent"
          class="ssnr"
        ></el-input>
      </div>
      <el-table
        :data="xzFile"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        @select-all="handleSelectionChange"
        ref="multipleTable0"
        :row-key="bingRowkeys"
      >
        <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)">预览</el-link>
          </template>
        </el-table-column>
      </el-table>
      <paging
        :total="pagTotal"
        :pager-count="5"
        @pagination="monitorPagin"
        v-if="pagTotal>10"
        :pageSizes="[10,25,50,100]"
        :page.sync="pageParamsGxh"
        style="display: flex;justify-content: flex-end;"
      ></paging>
      <!-- 上传进度条 progressIsshow-->
      <showProgress v-show="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button class='el-button--small' @click="sureQ">取 消</el-button>
        <el-button class='Determine el-button--small' type="primary" @click="sureQ">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ======================知识点文件=========================== -->
    <el-dialog
      width="50%"
      title="选择文件"
      :visible.sync="innerVisibleZs"
      append-to-body
      :before-close="sureQ"
      :close-on-click-modal="false"
    >
      <div class="zsFile">
        <div>已选择{{numberFile}}个文件</div>
        <div class="ziUpdata">
          <el-upload class="upload-demo" action="#" accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .txt, .mp4, .rmvb, .jpg, .jpeg, .gif, .png, .avi, .pdf,.mp3" :show-file-list="false" :http-request="updataPic" multiple :before-upload="uploadBefore" size='small'>
            <el-button style="background:#414d65;color:#fff" ref="sjsc">本地上传</el-button>
          </el-upload>
          <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="searckKey"
            @input="searchContent(2)"
            class="ssnr addUpdata"
          ></el-input>
        </div>
      </div>
      <el-table
        :data="xzFileZh"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        @select-all="handleSelectionChange"
        ref="multipleTable1"
        :row-key="bingRowkeys"
      >
        <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)">预览</el-link>
          </template>
        </el-table-column>
      </el-table>
      <paging
        :total="pagTotal"
        :pager-count="5"
        @pagination="monitorPagin"
        v-if="pagTotal>10"
        :page.sync="pageParamsGxh"
        :pageSizes="[10,25,50,100]"
        style="display: flex;justify-content: flex-end;"
      ></paging>
      <!-- 上传进度条 progressIsshow-->
      <showProgress v-show="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button class='el-button--small' @click="innerVisibleZs=false">取 消</el-button>
        <el-button class='Determine el-button--small' type="primary" @click="sureQ">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览文件 -->
    <el-dialog width="95%" :visible.sync="isShowPrevFile" append-to-body :close-on-click-modal="false">
      <show-prev-file append-to-body :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>
    </el-dialog>
  </div>
</template>
<script>
import {
  tastType,
  newTast,
  scxtList,
  testPaper,
  tjNumber,
  obtainmc,
  zywj,
  querySjList,
  editTast,
  delFiles,
  bycourseidInfo,
  endList,
  infoFrom,
  alllistFunc,
  delFrom,
  delAccount
} from '@/api/course'
import { wjUp, newResource } from '@/api/resource'
import paging from '@/components/pagination/index'
import showPrevFile from '@/components/showPrevFile/index'
import showProgress from '@/pages/resourceBase/component/showProgress'
import addition from '@/pages/courseManagement/outlineManagement/compontents/EnterpriseDetails'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['reviseTastData'],
  name: 'addTast',
  components: {
    paging,
    showPrevFile,
    showProgress
    // addition
  },
  computed: {
    ...mapGetters(['userId'])
  },
  watch: {
  },
  data() {
    return {
      innerVisible: false,
      innerVisibleZs: false,
      innerVisibleYxz: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        taskName: '',
        period: '',
        taskType: '',
        introduce: '',
        operationId: '',
        paperId: '',
        courseId: this.$route.query.courseId,
        outlineId: sessionStorage.getItem('dgId'),
        knowledgeFile: '',
        creator: '',
        flieId: '',
        operationCode: '',
        companyId: '',
        accountId: '', // 账套ID
        formId: '', // 表单Code
        funcId: '' // 实训功能code
      },
      tableData: [],
      ziyuanNumber: '',
      ziyuanNumberArr: [],
      whichType: '',
      xzsj: '',
      scrw: '',
      searckKey: '',
      tastTypeArr: [],
      scrwArr: [],
      xzFile: [],
      xzFileZh: [],
      pagTotal: '',
      kssjArr: [],
      taskNumber: '',
      flag: false,
      flieIdArr: [],
      knowledgeFileArr: [],
      knowledgeFileArrTb: [],
      taskIdold: '',
      zywjflag: '',
      bczy: [],
      bczsd: [],
      numberFile: '0',
      isShowPrevFile: false, // 预览
      previewData: {}, // 预览参数
      tjbb: false,
      addData: '编辑',
      RISK_BD: '',
      scCode: '',
      indexqy: '',
      options: [],
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
      newngArr: [],
      pageParamsGxh: 1,
      hxzsdArr: [],
      zsdtabledata: [],
      fileInfo: [],
      progressIsshow: false,
      percentageNum: 0,
      knownNumber: 0
    }
  },
  mounted() {
    this.init()
    // 用户id
    this.form.creator = this.userId
    // 数据回显
    // console.log(this.reviseTastData)
    // 回显实操系统文件名
    this.form.eiList = this.reviseTastData.eiList
    this.form.id = this.reviseTastData.id
    this.form.taskName = this.reviseTastData.taskName
    this.form.period = this.reviseTastData.period
    this.form.introduce = this.reviseTastData.introduce
    this.form.operationId = this.reviseTastData.operationId
    this.form.paperId = this.reviseTastData.paperId
    this.scrw = this.reviseTastData.taskTypeName
    // 知识点任务文件字符串
    this.form.KnowledgeFile = this.reviseTastData.KnowledgeFile
    // 资源文件
    this.form.flieId = this.reviseTastData.flieId
    this.form.taskType = this.reviseTastData.taskType
    // 文件的taskId
    this.taskIdold = this.reviseTastData.id
    // 横下下面
    this.whichType = this.reviseTastData.taskType
    if (this.reviseTastData.companyId != '') {
      // 显示企业信息
      this.tjbb = true
      // 如果是实操任务 请求企业信息
      this.options = this.reviseTastData.allCompanyList
      if (this.reviseTastData.companyList) {
        const arrAll = []
        for (let index = 0; index < this.reviseTastData.companyList.length; index++) {
          this.aptionArr.push(this.reviseTastData.companyList[index].id)
          arrAll.push(this.reviseTastData.companyList[index].id)
        }
        this.form.companyId = arrAll.join(',')
      }
    }
    // 账套任务
    this.dutiesArr = this.reviseTastData.casesDTOList ? this.reviseTastData.casesDTOList : []
    this.form.accountId = this.reviseTastData.accountId
    // 功能实训
    this.bdCode = this.reviseTastData.funcId
    // 功能实训下拉框
    if (this.reviseTastData.funcName) {
      this.practicalTraining = this.reviseTastData.funcName
      this.form.funcId = this.reviseTastData.funcId
    }
    // 表单文件集合
    if (this.reviseTastData.formInfoDTOS) {
      this.practicalTraData = this.reviseTastData.formInfoDTOS
      this.form.formId = this.reviseTastData.formId
    }
    // 选择试卷
    // this.xzsj = this.reviseTastData.paperName
    this.form.paperId = this.reviseTastData.paperId
    // 已选择多少个文件 资源文件集合
    tjNumber({ taskId: this.reviseTastData.id }).then(res => {
      this.ziyuanNumber = res.result.length ? res.result.length : '0'
      this.ziyuanNumberArr = res.result
      // 保存一个资源文件的数组
      this.bczy = res.result
      for (let index = 0; index < this.ziyuanNumberArr.length; index++) {
        this.flieIdArr.push(
          this.ziyuanNumberArr[index].resId
            ? this.ziyuanNumberArr[index].resId
            : this.ziyuanNumberArr[index].id
        )
      }
    })
    // 知识文件集合
    if (!this.reviseTastData.knowledgeFile) {
      return false
    }
    if (this.reviseTastData.knowledgeFile.indexOf(',') == -1) {
      obtainmc([this.reviseTastData.knowledgeFile]).then(res => {
        if (res.code == 0) {
          this.knowledgeFileArrTb = res.result
          // 保存一个知识点文件的数组
          this.bczsd = res.result
          // this.xzFileZh = res.result
          for (let index = 0; index < this.knowledgeFileArrTb.length; index++) {
            this.knowledgeFileArr.push(
              this.knowledgeFileArrTb[index].id
                ? this.knowledgeFileArrTb[index].id
                : this.knowledgeFileArrTb[index].resId
            )
            this.form.knowledgeFile = this.knowledgeFileArr.join(',')
          }
        }
      })
    } else {
      const stringArr = this.reviseTastData.knowledgeFile.split(',')
      obtainmc(stringArr).then(res => {
        if (res.code == 0) {
          this.knowledgeFileArrTb = res.result
          // 保存一个知识点文件的数组
          this.bczsd = res.result
          // this.xzFileZh = res.result
          for (let index = 0; index < this.knowledgeFileArrTb.length; index++) {
            this.knowledgeFileArr.push(
              this.knowledgeFileArrTb[index].id
                ? this.knowledgeFileArrTb[index].id
                : this.knowledgeFileArrTb[index].resId
            )
            this.form.knowledgeFile = this.knowledgeFileArr.join(',')
          }
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
      // 判断是那个类型 加载对应数据
      // console.log(this.reviseTastData.taskName)
      // 任务列表
      tastType().then(res => {
        if (res.code == 0) {
          this.tastTypeArr = res.result
        }
      })
      if (this.reviseTastData.taskType == '3') {
        // 实操任务
        scxtList().then(scres => {
          if (scres.code == 0) {
            // 考试列表
            this.scrwArr = scres.result
            for (let index = 0; index < this.scrwArr.length; index++) {
              if (this.scrwArr[index].systemName == this.scrw) {
                if (this.scrwArr[index].code == 'RISK_TAX') {
                  this.scCode = 'RISK_TAX'
                  this.form.operationCode = 'RISK_TAX'
                } else {
                  this.scCode = ''
                  this.form.operationCode = ''
                  this.form.taxpayer = ''
                  this.form.company = ''
                  this.form.dutyParagraph = ''
                  this.form.finalAddress = []
                }
              }
            }
          }
        })
      } else if (this.reviseTastData.taskType == '4') {
        // 考试任务
        // 查询试卷列表
        querySjList({
          page: '1',
          size: '99',
          keyWrods: ''
        }).then(res => {
          if (res.code == '0') {
            this.kssjArr = res.result.data
            this.$nextTick(function() {
              this.xzsj = this.reviseTastData.paperId
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      } else if (this.reviseTastData.taskType == '7') {
        // 功能实训
        this.gnsx()
        // 实训功能列表
        this.sxList()
      }
      // 任务资源
      // this.fileData(1)
      // // 知识点文件
      // this.fileData(2)
       // 账套列表
      // this.ztFun()
      // 实训功能列表
      // this.sxList()
    },
    // 资源上传之前钩子
    uploadBefore(file) {
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
      let type = ''
      if (this.publicres == '3') {
        type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3'
      } else {
        type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3'
      }
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确类型的文件！')
        return !isExt
      }
      if (ext != 'exe' && ext != 'autowork' && ext != 'sql') {
        // 文件大小限制
        const specialType = '.mp4,.rmvb,.avi,.mp3'
        const specialExt = specialType.indexOf(ext) < 0
        const maxSize = file.size / 1024 / 1024 > 100
        const isLtSize = file.size / 1024 / 1024 > 20

        if (maxSize) {
          this.$message.warning('文件最大不能超过 100MB！')
          return false
        } else if (specialExt && isLtSize) {
          this.$message.warning('除mp4、rmvb、avi文件外，文件不能超过 20MB！')
          return false
        }
      }
    },
    async updataPic(e) {
      const fileType = e.file.name.substring(e.file.name.lastIndexOf('.') + 1)
      let wjType = ''
      if (fileType == 'ppt' || fileType == 'pptx') {
        wjType = 'PPT'
      } else if (fileType == 'doc' || fileType == 'docx') {
        wjType = 'WORD'
      } else if (fileType == 'xls' || fileType == 'xlsx') {
        wjType = 'EXCEL'
      } else if (fileType == 'txt') {
        wjType = 'TXT'
      } else if (fileType == 'mp4' || fileType == 'rmvb') {
        wjType = 'VIDEO'
      } else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'png') {
        wjType = 'PIC'
      } else if (fileType == 'pdf') {
        wjType = 'PDF'
      } else if (fileType == 'mp3' || fileType == 'avi') {
        wjType = 'AUDIO'
      } else if (fileType == 'autowork') {
        wjType = 'AUTOWORK'
      } else if (fileType == 'exe') {
        wjType = 'EXE'
      } else if (fileType == 'sql') {
        wjType = 'SQL'
      }
      this.resType = ''
      const fileItem = {
        name: e.file.name,
        type: fileType,
        allNumber: this.fileInfo.length + 1,
        percentageNum: 0
      }
      this.fileInfo.push(fileItem)
      localStorage.setItem('flagProcess', this.fileInfo.length)
      this.progressIsshow = true
      const res = await this.cos(e, this, 'percentageNum', function (cb) {
        fileItem.percentageNum = cb.percent * 100
      })
      const downloadUrl = res
      // 新增
      wjUp({
        resName: e.file.name,
        downloadUrl: res,
        resType: fileType,
        resExt: fileType,
        resSize: e.file.size,
        creator: this.userId
      }).then(res => {
        const fileId = res.result
        newResource({
          resId: res.result,
          resName: e.file.name,
          resUseType: '1',
          fileType: wjType
        }).then(res => {
          if (res.code == '0') {
            // 上传成功刷新表格列表
            const currutdata = {
                converUrl: downloadUrl,
                downloadUrl: downloadUrl,
                fileType: fileType,
                id: fileId,
                isAllow: '0',
                resExt: fileType,
                resId: fileId,
                resName: e.file.name,
                resUseType: 1
            }
            if (this.zsdOrzywj == 2) {
              this.knowledgeFileArrTb.push(currutdata)
            } else {
              this.ziyuanNumberArr.push(currutdata)
            }
            this.fileData(1)
            this.$message({
              type: 'success',
              message: '上传成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      })
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
    },
    fileData(index) {
      const that = this
      this.zywjflag = index
      // 资源文件列表
      zywj({
        page: '1',
        size: '10',
        keyWrods: this.searckKey,
        taskId: this.reviseTastData.id,
        type: index
      }).then(res => {
        if (this.zsdOrzywj == 2 && index == 1) {
          this.xzFileZh = res.result.data
          this.$nextTick(function() {
            // 知识点文件反显
            this.knowledgeFileArrTb[this.knowledgeFileArrTb.length - 1].converUrl = res.result.data[0].converUrl
            this.knowledgeFileArrTb.forEach(item => {
              this.xzFileZh.forEach(self => {
                if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                  this.$refs.multipleTable1.toggleRowSelection(this.xzFileZh[this.xzFileZh.indexOf(self)], true)
                }
              })
            })
            this.numberFile = this.knowledgeFileArrTb.length
          })
        } else if (index == 1) {
          this.xzFile = res.result.data
          // 任务资源反显
          that.ziyuanNumberArr.forEach(item => {
            that.xzFile.forEach(self => {
              if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                that.$refs.multipleTable0.toggleRowSelection(that.xzFile[that.xzFile.indexOf(self)], true)
              }
            })
          })
        } else {
          this.xzFileZh = res.result.data
          this.knowledgeFileArrTb[this.knowledgeFileArrTb.length - 1].converUrl = res.result.data[0].converUrl
          // 知识点文件反显
          this.knowledgeFileArrTb.forEach(item => {
            this.xzFileZh.forEach(self => {
              if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                this.$refs.multipleTable1.toggleRowSelection(this.xzFileZh[this.xzFileZh.indexOf(self)], true)
              }
            })
          })
          this.numberFile = this.knowledgeFileArrTb.length
        }
        this.pagTotal = parseInt(res.result.total)
      })
    },
    // 文件预览
    previewFile(item) {
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      console.log(this.previewData)
      if (item.converUrl) {
        this.previewData.imgUrl = item.converUrl
      } else {
        this.previewData.imgUrl = item.downloadUrl
      }
      this.isShowPrevFile = true
    },
    testPaperFunction(val) {
      // 选择试卷内容
      this.form.paperId = val
    },
    monitorPagin(item) {
      // 分页组件
      zywj({
        page: item.page,
        size: item.limit,
        keyWrods: this.searckKey,
        taskId: this.reviseTastData.id,
        type: this.zsdOrzywj
      }).then(res => {
        if (this.zsdOrzywj == 1) {
          this.xzFile = []
          this.xzFile = res.result.data
          // 任务资源文件反显
          this.ziyuanNumberArr.forEach(item => {
            this.xzFile.forEach(self => {
              if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                console.log(self)
                this.$refs.multipleTable0.toggleRowSelection(this.xzFile[this.xzFile.indexOf(self)], true)
              }
            })
          })
        } else {
          this.xzFileZh = []
          this.xzFileZh = res.result.data
          // 知识点文件反显
          this.knowledgeFileArrTb.forEach(item => {
            this.xzFileZh.forEach(self => {
              if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                this.$refs.multipleTable1.toggleRowSelection(this.xzFileZh[this.xzFileZh.indexOf(self)], true)
              }
            })
          })
        }
        this.pagTotal = parseInt(res.result.total)
      })
    },
    bingRowkeys(row) {
      return row.id
    },
    handleDelete(index, row) {
      const zsdItem = row[index]
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
            // 删除成功更新弹框选中的数据 knowledgeFileArrTb
            if (this.tableData.length > 0) {
              this.$refs.multipleTable1.clearSelection()
            }
            row.splice(index, 1)
            this.knowledgeFileArr = []
            for (
              let index = 0;
              index < this.knowledgeFileArrTb.length;
              index++
            ) {
              this.knowledgeFileArr.push(
                this.knowledgeFileArrTb[index].resId
                  ? this.knowledgeFileArrTb[index].resId
                  : this.knowledgeFileArrTb[index].id
              )
            }
            this.form.knowledgeFile = this.knowledgeFileArr.join(',')
            // 删除判断是否是已保存的数组中移除的
            for (let index = 0; index < this.bczsd.length; index++) {
              const ynId = zsdItem.resId ? zsdItem.resId : zsdItem.id
              const bjId = this.bczsd[index].resId
                ? this.bczsd[index].resId
                : this.bczsd[index].id
              if (ynId == bjId) {
                this.bczsd.splice(index, 1)
              }
            }
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    deletesx(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // delFrom({
          //   taskId: this.reviseTastData.id,
          //   formCode: row[index].code
          // }).then(res => {
          //   if (res.code == 0) {
              row.splice(index, 1)
              const bdarr = []
              for (let i = 0; i < row.length; i++) {
                bdarr.push(row[i].code)
              }
              this.form.formId = bdarr.join()
          //   } else {
          //     this.$message({
          //       message: res.message,
          //       type: 'warning'
          //     })
          //   }
          // })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    delYxz(index, row) {
      const thisItem = row[index]
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // delFiles({
          //   taskId: this.reviseTastData.id,
          //   fileId: row[index].resId ? row[index].resId : row[index].id,
          //   type: 1
          // }).then(res => {
            // if (res.code == 0) {
              // 删除成功  清空已选择的文件名
              if (this.tableData.length > 0) {
                this.$refs.multipleTable0.clearSelection()
              }
              row.splice(index, 1)
              const wjArr = []
              this.flieIdArr = []
              for (
                let index = 0;
                index < this.ziyuanNumberArr.length;
                index++
              ) {
                wjArr.push(
                  this.ziyuanNumberArr[index].resId
                    ? this.ziyuanNumberArr[index].resId
                    : this.ziyuanNumberArr[index].id
                )
                this.flieIdArr.push(
                  this.ziyuanNumberArr[index].resId
                    ? this.ziyuanNumberArr[index].resId
                    : this.ziyuanNumberArr[index].id
                )
              }
              // 已选择多少个文件
              this.ziyuanNumber = this.ziyuanNumberArr.length ? this.ziyuanNumberArr.length : '0'
              this.form.flieId = wjArr.join(',')
              // 删除判断是否是已保存的数组中移除的
              for (let index = 0; index < this.bczy.length; index++) {
                const ynId = thisItem.resId ? thisItem.resId : thisItem.id
                const bjId = this.bczy[index].resId
                  ? this.bczy[index].resId
                  : this.bczy[index].id
                if (ynId == bjId) {
                  this.bczy.splice(index, 1)
                }
              }
              // 删除成功 刷新任务文件列表
              // this.fileData(1)
            // } else {
            //   this.$message({
            //     message: res.message,
            //     type: 'warning'
            //   })
            // }
          // })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    selectTastType(value) {
      // 标识
      this.whichType = value
      this.form.taskType = value
      // 实操任务
      this.scrw = ''
      // 考试任务
      this.xzsj = ''
      if (this.whichType == 4) {
        // 查询试卷列表
        querySjList({
          page: '1',
          size: '99',
          keyWrods: ''
        }).then(res => {
          this.kssjArr = res.result.data
        })
      } else if (this.whichType == 5) {
        // 知识点文件
        this.fileData(2)
      } else if (this.whichType == 6) {
         // 账套列表
          this.ztFun()
      } else if (this.whichType == 3) {
        this.tjbb = false
        // 实操列表
          scxtList().then(scres => {
            if (scres.code == 0) {
              // 考试列表
              this.scrwArr = scres.result
            }
          })
      } else if (this.whichType == 7) {
        // 功能实训
        this.gnsx()
        // 实训功能列表
        this.sxList()
      }
    },
    testPaper(val) {
      // 选择试卷内容
      this.from.paperId = val
    },
    shicaoTast(val) {
      // 实操任务
      this.tjbb = true
      this.form.operationId = val
      // 判断选中的code是什么
      for (let index = 0; index < this.scrwArr.length; index++) {
        if (this.scrwArr[index].id == val) {
          this.scCode = this.scrwArr[index].code
        }
      }
      // 企业信息
      bycourseidInfo({
        taskId: this.reviseTastData.id ? this.reviseTastData.id : ''
      }).then(res => {
        if (res.code == '0') {
          this.options = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    qyId(val) {
      this.form.companyId = val.join(',')
    },
    handleSelectionChange(val) {
      this.zsdtabledata = val
      if (this.zsdOrzywj == 1) {
        // 资源文件
        this.flieIdArr = []
        const zywjfArr = []
        if (this.reviseTastData.id) {
          for (let index = 0; index < this.bczy.length; index++) {
            this.flieIdArr.push(
              this.bczy[index].resId
                ? this.bczy[index].resId
                : this.bczy[index].id
            )
            zywjfArr.push(this.bczy[index])
          }
        }
        // 如果选择为空 删除本页已选择的数据
        if (val.length == 0) {
          this.flieIdArr = []
          // this.xzFile 本页资源数组 删除两个对象数组中相同的对象
          var set = this.xzFile.map(item => item.resId)
          var resArr = zywjfArr.filter(item => !set.includes(item.resId))
          this.ziyuanNumberArr = resArr
          for (let index = 0; index < resArr.length; index++) {
            this.flieIdArr.push(
              resArr[index].resId ? resArr[index].resId : resArr[index].id
            )
          }
          // 任务资源文件id集合
          this.form.flieId = this.flieIdArr.join(',')
        } else {
          for (let index = 0; index < val.length; index++) {
            this.flieIdArr.push(
              val[index].resId ? val[index].resId : val[index].id
            )
            this.flieIdArr = [...new Set(this.flieIdArr)]
            // 资源文件数组
            zywjfArr.push(val[index])
            this.ziyuanNumberArr = this.unique(zywjfArr)
            // 任务资源文件id集合
            this.form.flieId = this.flieIdArr.join(',')
          }
        }
        // 已选择的资源文件总数
        this.ziyuanNumber = this.flieIdArr.length
      } else if (this.zsdOrzywj == 2) {
        // 选择文件数量
        this.numberFile = val.length
        // 选中的资源文件
        this.tableData = val
        // 知识点文件
        const zsdwjArr = []
        if (this.reviseTastData.knowledgeFile) {
          for (let index = 0; index < this.bczsd.length; index++) {
            this.knowledgeFileArr.push(
              this.bczsd[index].resId
                ? this.bczsd[index].resId
                : this.bczsd[index].id
            )
            zsdwjArr.push(this.bczsd[index])
          }
        }
        for (let index = 0; index < val.length; index++) {
          this.knowledgeFileArr.push(
            val[index].resId ? val[index].resId : val[index].id
          )
          this.knowledgeFileArr = [...new Set(this.knowledgeFileArr)]
          // 知识点文件数组
          zsdwjArr.push(val[index])
          this.hxzsdArr = zsdwjArr
          // this.knowledgeFileArrTb = zsdwjArr
          // this.form.knowledgeFile = this.knowledgeFileArr.join(',')
        }
      }
    },
    searchContent() {
      const that = this
      // 搜索内容
      const taskIdnew = this.reviseTastData.id
      const keyfount = this.searckKey
      const type = this.zsdOrzywj
      // 页码变成1
      this.pageParamsGxh = 1
      // clearTimeout(this.searchh)
      // this.searchh = setTimeout(function() {
        zywj({
          page: '1',
          size: '10',
          keyWrods: keyfount,
          taskId: taskIdnew,
          type: type
        }).then(res => {
          if (res.code == '0') {
            if (this.zsdOrzywj == 1) {
              this.xzFile = []
              this.xzFile = res.result.data
              that.ziyuanNumberArr.forEach(item => {
                  that.xzFile.forEach(self => {
                    if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                      that.$refs.multipleTable0.toggleRowSelection(that.xzFile[that.xzFile.indexOf(self)], true)
                    }
                  })
              })
            } else {
              this.xzFileZh = []
              this.xzFileZh = res.result.data
              // 知识点文件反显
              this.knowledgeFileArrTb.forEach(item => {
                this.xzFileZh.forEach(self => {
                  if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                    this.$refs.multipleTable1.toggleRowSelection(this.xzFileZh[this.xzFileZh.indexOf(self)], true)
                  }
                })
              })
            }
            this.pagTotal = parseInt(res.result.total)
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      // }, 500)
    },
    calloff() {
      // 取消
      this.$emit('revissxtast')
    },
    qdData() {
      if (this.form.taskName == '') {
        this.$message.warning('任务名称不能为空！')
        return false
      }
      if (this.form.period == '') {
        this.$message.warning('课时不能为空！')
        return false
      }
      if (Number(this.form.period) <= Number(0)) {
        this.$message.warning('课时必须大于0！')
        return false
      }
      if (this.form.taskType == '') {
        this.$message.warning('任务类型不能为空！')
        return false
      }
      if (this.form.introduce == '') {
        this.$message.warning('任务描述不能为空！')
        return false
      }
      // 功能实训选择的是pythone 清空表单甄别数据
      if (this.form.funcId == 'py') {
            this.form.formId = ''
      }
      // 任务资源文件id集合
      this.form.flieId = this.flieIdArr.join(',')
      // 知识点数组去重
      const newArr = []
      const len = this.knowledgeFileArr
      for (let i = 0; i < len.length; i++) {
          if (newArr.indexOf(len[i]) == -1) {
              newArr.push(len[i])
          }
      }
      // 知识点
      this.form.knowledgeFile = newArr.join(',')
      // 企业名称
      const qymcArr = this.form.companyId.split(',')
      if (this.reviseTastData.companyList) {
        for (let index = 0; index < this.reviseTastData.companyList.length; index++) {
          for (let i = 0; i < qymcArr.length; i++) {
            if (qymcArr[i] == this.reviseTastData.companyList[index].name) {
              this.$set(qymcArr, i, this.reviseTastData.companyList[index].id)
            }
          }
        }
      }
      this.form.companyId = qymcArr.join(',')
      editTast(this.form).then(res => {
        if (res.code == '0') {
          this.$emit('revissxtast')
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    yxzdwj() {
      this.zsdOrzywj = 1
      // 页码变为1
      this.pageParamsGxh = 1
      // if (parseInt(this.ziyuanNumber) > 0) {
      //   this.$refs.multipleTable0.clearSelection()
      // }
      console.log(this.ziyuanNumberArr)
      this.innerVisible = true
      // 任务资源请求数据
      this.fileData(1)
    },
    zsdyzwj() {
      this.zsdOrzywj = 2
      // if (this.tableData.length > 0) {
      //   this.$refs.multipleTable0.clearSelection()
      // }
      // 页码变为1
      this.pageParamsGxh = 1
      // 知识点文件
      this.fileData(2)
      this.innerVisibleZs = true
    },
    sureQ() {
      // this.searckKey = ''
      this.innerVisible = false
      this.innerVisibleZs = false
      // 点击确定将文件添加到航线下面
      if (this.hxzsdArr.length != 0) {
        this.knowledgeFileArrTb = this.unique(this.hxzsdArr)
        this.form.knowledgeFile = this.knowledgeFileArr.join(',')
      }
    },
    yxz() {
      // 已选择文件数组
      this.innerVisibleYxz = true
    },
    addEnterprise() {
      this.tjbb = true
      this.addData = {}
      this.indexqy = '-1'
    },
    addpt(val) {
      this.tjbb = false
      if (val == 'cancel') {
        return false
      } else if (this.indexqy == '-1') {
        this.form.eiList.push(val)
      } else {
        this.$set(this.form.eiList[this.indexqy], 'company', val.company)
        this.$set(this.form.eiList[this.indexqy], 'taxLayerNo', val.taxLayerNo)
        this.$set(this.form.eiList[this.indexqy], 'finalAddress', val.finalAddress)
        this.$set(this.form.eiList[this.indexqy], 'taxLayerType', val.taxLayerType)
        this.$set(this.form.eiList[this.indexqy], 'businessScope', val.businessScope)
        this.$set(this.form.eiList[this.indexqy], 'addressDetail', val.addressDetail)
        this.$set(this.form.eiList[this.indexqy], 'scales', val.scales)
        this.$set(this.form.eiList[this.indexqy], 'industryCode', val.industryCode)
        this.$set(this.form.eiList[this.indexqy], 'industrySecondCode', val.industrySecondCode)
        this.$set(this.form.eiList[this.indexqy], 'industryThirdCode', val.industryThirdCode)
        this.form.eiList[this.indexqy] = val
      }
    },
    editqy(item, index) {
      // 需要修改的索引
      this.indexqy = index
      // 打开企业信息
      this.tjbb = true
      this.addData = item
    },
    ztCheckData(val) {
      // 已选择的账套个数
      this.ztNumber = val.length
      // 选中的整套列表
      this.ztListArr = val
    },
    ztCheck() {
      // 账套列表
      this.ztFun()
      this.ztFile = true
    },
    ztcs(val) {
      this.ztKeyword = val
      this.pageParamsGxh = 1
      this.ztPage = 1
      // 更新账套列表
      this.ztFun()
    },
    // 账套列表
    ztFun() {
      const that = this
      endList({
        page: this.ztPage,
        size: this.ztSize,
        keyWrods: this.ztKeyword,
        taskId: this.reviseTastData.id
      }).then(res => {
        if (res.code == '0') {
          this.ztArrData = res.result.data
          // 账套分页数据
          this.debtTotal = parseInt(res.result.total)
          // 显示选中的账套
          that.dutiesArr.forEach(item => {
            that.ztArrData.forEach(self => {
              if (item.id == self.id || item.resId == self.resId) {
                that.$refs.multipleTable3.toggleRowSelection(item, true)
              }
            })
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    sureZt() {
      this.ztFile = false
      // 点击确定更新账套
      if (this.dutiesArr.length > 0) {
        this.dutiesArr = this.dutiesArr.concat(this.ztListArr)
      } else {
        this.dutiesArr = this.ztListArr
      }
      // 数组去重
      this.dutiesArr = this.uniquezt(this.dutiesArr)
      // =====
      const ztArr = []
      // 提交表单账套数据
      for (let index = 0; index < this.dutiesArr.length; index++) {
        ztArr.push(this.dutiesArr[index].id)
      }
      this.form.accountId = ztArr.join()
    },
    cancelGn() {
      this.gnFlag = false
      // 清空所有的选择
      this.$refs.multipleTablegn.clearSelection()
    },
    sureGn() {
      this.gnFlag = false
      // 点击确定更新
      if (this.practicalTraData.length > 0) {
        this.practicalTraData = this.practicalTraData.concat(this.newngArr)
      } else {
        this.practicalTraData = this.newngArr
      }
      // 数组去重
      this.practicalTraData = this.uniquecode(this.practicalTraData)
      // 表单id
      const bdArr = []
      for (let index = 0; index < this.practicalTraData.length; index++) {
        bdArr.push(this.practicalTraData[index].code)
      }
      this.form.formId = bdArr.join()
       // 清空所有的选择
      this.$refs.multipleTablegn.clearSelection()
    },
    // 实训功能列表
    sxList() {
      const that = this
      infoFrom({
        // taskId: this.reviseTastData.id
        taskId: ''
      }).then(res => {
        if (res.code == '0') {
          this.gnsxData = res.result
          if (this.gnFlag) {
            // 表单选择的文件反显
            this.$nextTick(function() {
              that.practicalTraData.forEach(item => {
                that.gnsxData.forEach(self => {
                  if (item.id == self.id) {
                    that.$refs.multipleTablegn.toggleRowSelection(that.gnsxData[that.gnsxData.indexOf(self)], true)
                  }
                })
              })
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    monitorPaginZt(item) {
      this.ztSize = item.limit
      this.ztPage = item.page
      // 更新账套列表
      this.ztFun()
    },
    // 功能实训
    gnsx() {
      alllistFunc().then(res => {
        if (res.code == '0') {
          this.practicalTrainingArr = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 数组去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.resId) && res.set(arr.resId, 1))
    },
    uniquezt(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    // 表单去重
    uniquecode(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.code) && res.set(arr.code, 1))
    },
    // 账套列表删除
    zTdel(index, row) {
      this.$confirm('此操作将永久删除该账套, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          // 删除成功更新弹框选中的数据 knowledgeFileArrTb
          if (this.ztListArr.length > 0) {
            this.$refs.multipleTable3.clearSelection()
          }
          // 删除
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          row.splice(index, 1)
          const ztarr = []
          for (let i = 0; i < row.length; i++) {
            ztarr.push(row[i].id)
          }
          this.form.accountId = ztarr.join()
      }).catch(() => {})
    },
    // 功能实训 选择文件
    gnsxTrain(val) {
      const that = this
      this.sxList()
      this.gnFlag = true
    },
    // 选择的文件
    gnSelect(val) {
      // 选择的功能文件
      this.newngArr = val
      // 文件个数
      // this.gnNumber = val.length
    },
    practicalTra(val) {
      // 赋值code
      this.bdCode = val
      // 功能实训
      this.form.funcId = val
    }
  }
}
</script>

<style>
.ziUpdata{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-input__inner{
  line-height: 0;
}
.zsFile{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.Determine{
  background: #414d65;
}
.dialog-footer {
  margin-top: 20px;
}
.el-form .el-select {
  width: 100%;
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
}
.addUpdata{
  margin: 0;
  width: 60%;
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
.rwzywj {
  cursor: pointer;
}
</style>