<template>
  <div>
    <el-form :model="form" :rules="rules">
      <el-form-item label="任务名称：" :label-width="formLabelWidth" prop="taskName">
        <el-input v-model="form.taskName" autocomplete="off" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="课时：" :label-width="formLabelWidth" prop="period">
        <el-input v-model="form.period" autocomplete="off" placeholder="请输入课时" type="number" @mousewheel.native.prevent></el-input>
      </el-form-item>
      <el-form-item label="任务类型：" :label-width="formLabelWidth" prop="taskType">
        <el-select v-model="form.taskType" placeholder="请选择任务类型" @change="tastType">
          <el-option
            :label="item.name"
            :value="item.code"
            v-for="(item,index) in tastTypeArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述:" :label-width="formLabelWidth" prop="introduce">
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
        <span @click="yxz">
          已选择
          <span class="zy">{{cancelNumber==''?ziyuanNumber:'0'}}</span>个文件
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
            <el-link type="warning" @click="preview(scope.row)">预览</el-link>
            <el-link type="warning" @click.native.prevent="handleDelete(scope.$index, knowledgeFileArrTb)">删除</el-link>
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
          ref="multipleTablezt"
          :row-key="bingRowkeys"
        >
          <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
          <el-table-column prop="caseName" label="账套名称"></el-table-column>
        </el-table>
        <paging
          :total="debtTotal"
          :pager-count="5"
          @pagination="monitorPaginZt"
          v-if="debtTotal>10"
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
        <el-table-column prop="name" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click.native.prevent="handleDeletebd(scope.$index, practicalTraData)">移除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 功能实训资源文件 -->
      <el-dialog width="50%" title="选择表单" :visible.sync="gnFlag" append-to-body :before-close="cancelGn" :close-on-click-modal="false">
        <div class="zsFile">
          <div>已选择{{gnNumber}}个文件</div>
        </div>
        <el-table
          :data="gnsxData"
          style="width: 100%"
          border
          @selection-change="gnSelect"
          @select-all="gnSelect"
          ref="multipleTablebd"
        >
          <el-table-column type="selection" width="66"></el-table-column>
          <el-table-column prop="name" label="表单名称"></el-table-column>
        </el-table>
        <span slot="footer" style="display:block;text-align: center;margin-top:15px">
          <el-button @click="cancelGn" class='el-button--small'>取 消</el-button>
          <el-button class='Determine el-button--small'  type="primary" @click="sureGn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 考试任务 -->
      <el-form-item label="选择试卷：" :label-width="formLabelWidth" v-show="whichType == '4'">
        <el-select v-model="xzsj" placeholder="请选择考试试卷" @change="testPaperFunction" filterable>
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in kssjArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 实操任务  -->
      <el-form-item label="实操任务：" :label-width="formLabelWidth" v-show="whichType == '3'">
        <el-select v-model="scrw" placeholder="请选择实操任务：" @change="shicaoTast">
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
    <!-- =================================================选择资源文件===================================================== -->
    <el-dialog width="50%" title="选择文件" :visible.sync="innerVisible" append-to-body :before-close="sureQ" :close-on-click-modal="false">
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
            <el-link type="warning" @click="preview(scope.row)">预览</el-link>
          </template>
        </el-table-column>
      </el-table>
      <paging
        :total="pagTotal"
        :page.sync="pageParamsGxh"
        :pager-count="5"
        @pagination="monitorPagin"
        v-if="pagTotal>10"
        :pageSizes="[10,25,50,100]"
        style="display: flex;justify-content: flex-end;"
      ></paging>
      <!-- 上传进度条 progressIsshow-->
      <showProgress v-show="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button class="el-button--small" @click="cancelqx">取 消</el-button>
        <el-button class='Determine el-button--small' type="primary" @click="sureQ">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ======================知识点文件=========================== -->
    <el-dialog width="50%" title="选择文件" :visible.sync="innerVisibleZs" append-to-body :before-close="sureQ" :close-on-click-modal="false">
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
            @input="searchContent"
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
            <el-link type="warning" @click="preview(scope.row)">预览</el-link>
          </template>
        </el-table-column>
      </el-table>
      <paging
        :total="pagTotal"
        :page.sync="pageParamsGxh"
        :pager-count="5"
        @pagination="monitorPagin"
        v-if="pagTotal>10"
        :pageSizes="[10,25,50,100]"
        style="display: flex;justify-content: flex-end;"
      ></paging>
      <!-- 上传进度条 progressIsshow-->
      <showProgress v-show="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button @click="sureQ" class='el-button--small'>取 消</el-button>
        <el-button class='Determine el-button--small'  type="primary" @click="surezsd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览文件 -->
    <el-dialog width="50%" title="预览文件" :visible.sync="isShowPrevFile" append-to-body :before-close="sureQ" :close-on-click-modal="false">
      <showPrevFile :PrevFileUrl="PrevFileUrl" @quxiao="isShowPrevFileClose" v-if="isShowPrevFile" class="showFile" :class="isShowPrevFile==true?'isDialog':''"></showPrevFile>
    </el-dialog>
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
            <el-link type="warning" @click="preview(scope.row)" style="margin-right:10px">预览</el-link>
            <el-link type="warning" @click="delYxz(scope.$index, ziyuanNumberArr)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  tastType,
  newTast,
  scxtList,
  testPaper,
  zywj,
  delFiles,
  querySjList,
  bycourseidInfo,
  endList,
  alllistFunc,
  infoFrom
} from '@/api/course'
import { wjUp, newResource } from '@/api/resource'
import { mapGetters, mapActions } from 'vuex'
import paging from '@/components/pagination'
import showPrevFile from '@/pages/resourceBase/component/showPrevFile'
import showProgress from '@/pages/resourceBase/component/showProgress'
import addition from '@/pages/courseManagement/outlineManagement/compontents/EnterpriseDetails'
export default {
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
    newngArr(val) {
      this.newngArr.forEach(item => {
        this.gnsxData.forEach(self => {
          if (item.id == self.id) {
            this.$refs.multipleTablebd.toggleRowSelection(item, true)
          }
        })
      })
    },
    dutiesArr() {
      // 清空选择
      this.$refs.multipleTablezt.clearSelection()
      this.dutiesArr.forEach(item => {
        this.ztArrData.forEach(self => {
          if (item.id == self.id) {
            this.$refs.multipleTablezt.toggleRowSelection(item, true)
          }
        })
      })
    }
  },
  data() {
    return {
      innerVisible: false,
      innerVisibleZs: false,
      innerVisibleYxz: false,
      formLabelWidth: '120px',
      ziyuanNumberArr: [],
      form: {
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
      // 表单验证
      rules: {
          taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          period: [
            { required: true, message: '请输入课时', trigger: 'blur' }
          ],
          taskType: [
            { required: true, message: '请输入任务类型', trigger: 'blur' }
          ],
          introduce: [
            { required: true, message: '请输入任务描述', trigger: 'blur' }
          ]
      },
      flieIdArr: [],
      flieIdArrflag: [],
      flieIdArrTb: [],
      knowledgeFileArr: [],
      knowledgeFileArrTb: [],
      tableData: [],
      ziyuanNumber: 0,
      whichType: '',
      xzsj: '',
      scrw: '',
      xzFile: [],
      xzFileZh: [],
      searckKey: '',
      tastTypeArr: [],
      scrwArr: [],
      kssjArr: [],
      zsdOrzywj: '',
      pagTotal: '',
      zywjflag: '',
      numberFile: '0',
      isShowPrevFile: false,
      tjbb: false,
      ztFile: false,
      addData: {},
      scCode: '',
      indexqy: '',
      cancelNumber: '',
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
      gnNumber: 0, // 功能实训个数
      gnsxData: [], // 功能实训数组
      newngArr: [],
      newzsd: [],
      pageParamsGxh: 1,
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
  },
  methods: {
    init() {
      // 任务列表
      tastType().then(res => {
        if (res.code == 0) {
          this.tastTypeArr = res.result
        }
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
          row.splice(index, 1)
          this.flieIdArrflag = row
          console.log(this.flieIdArrflag)
          // 已选择多少个文件
          this.ziyuanNumber = this.ziyuanNumberArr.length ? this.ziyuanNumberArr.length : '0'
        })
        .catch(() => {})
    },
    yxz() {
      // 已选择文件数组
      this.innerVisibleYxz = true
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
              this.flieIdArr.push(currutdata)
            }
            // 上传成功刷新表格列表
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
      // 资源文件列表
      zywj({
        page: '1',
        size: '10',
        keyWrods: this.searckKey,
        taskId: '',
        type: this.zsdOrzywj ? this.zsdOrzywj : index
      }).then(res => {
        if (this.zsdOrzywj == 2 && index == 1) {
          this.xzFileZh = res.result.data
          this.$nextTick(function() {
            // 知识点文件反显
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
          this.flieIdArr = this.flieIdArrflag
          console.log(this.flieIdArr)
          this.flieIdArr.forEach(item => {
            this.xzFile.forEach(self => {
              if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                console.log(this.xzFile[this.xzFile.indexOf(self)])
                this.$refs.multipleTable0.toggleRowSelection(this.xzFile[this.xzFile.indexOf(self)], true)
              }
            })
          })
        } else {
          this.xzFileZh = res.result.data
          this.$nextTick(function() {
            // 知识点文件反显
            this.knowledgeFileArrTb.forEach(item => {
              this.xzFileZh.forEach(self => {
                if (item.id == self.resId || item.id == self.id || item.resId == self.resId) {
                  this.$refs.multipleTable1.toggleRowSelection(this.xzFileZh[this.xzFileZh.indexOf(self)], true)
                }
              })
            })
            this.numberFile = this.knowledgeFileArrTb.length
          })
        }
        this.pagTotal = parseInt(res.result.total)
      })
    },
    // 账套列表
    ztFun() {
      endList({
        page: this.ztPage,
        size: this.ztSize,
        keyWrods: this.ztKeyword,
        taskId: ''
      }).then(res => {
        if (res.code == '0') {
          this.ztArrData = res.result.data
          // 账套分页数据
          this.debtTotal = parseInt(res.result.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
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
    // 实训功能列表
    sxList() {
      infoFrom({
        taskId: ''
      }).then(res => {
        if (res.code == '0') {
          this.gnsxData = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    monitorPagin(item) {
      // 分页组件
      zywj({
        page: item.page,
        size: item.limit,
        keyWrods: this.searckKey,
        taskId: '',
        type: this.zsdOrzywj
      }).then(res => {
        if (this.zsdOrzywj == 1) {
          this.xzFile = []
          this.xzFile = res.result.data
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
    monitorPaginZt(item) {
      this.ztSize = item.limit
      this.ztPage = item.page
      // 更新账套列表
      this.ztFun()
    },
    // 删除
    handleDelete(index, row) {
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        row.splice(index, 1)
        this.newzsd = row
        const arrk = []
        for (let index = 0; index < row.length; index++) {
          arrk.push(row[index].resId ? row[index].resId : row[index].id)
        }
        this.form.knowledgeFile = arrk.join()
      }).catch(() => {})
    },
    // 表单删除
    handleDeletebd(index, row) {
       this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        row.splice(index, 1)
        this.practicalTraData = row
        const arrkbd = []
        for (let index = 0; index < row.length; index++) {
          arrkbd.push(row[index].code)
        }
        this.form.formId = arrkbd.join()
      }).catch(() => {})
    },
    // 账套列表删除
    zTdel(index, row) {
      this.$confirm('此操作将永久删除该账套, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        row.splice(index, 1)
        const ztarr = []
        for (let index = 0; index < row.length; index++) {
          ztarr.push(row[index].resId ? row[index].resId : row[index].id)
        }
        this.form.accountId = ztarr.join()
      }).catch(() => {})
    },
    tastType(value) {
      this.whichType = value
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
      this.form.taskType = value
    },
    testPaperFunction(val) {
      // 选择试卷内容
      this.form.paperId = val
    },
    shicaoTast(val) {
      // 如果val不为空 显示企业信息
      if (val) {
        this.tjbb = true
        // 企业信息
        bycourseidInfo({
          // courseId: this.$route.query.courseId
          taskId: ''
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
      }
      // 实操任务
      this.form.operationId = val
      // 判断选中的code是什么
      for (let index = 0; index < this.scrwArr.length; index++) {
        if (this.scrwArr[index].id == val) {
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
    },
    qyId(val) {
      this.form.companyId = val.join(',')
    },
    bingRowkeys(row) {
      return row.id
    },
    handleSelectionChange(val) {
      console.log(val)
      // 判断是知识点文件还是资源文件
      if (this.zsdOrzywj == 1) {
        this.flieIdArr = []
        this.ziyuanNumberArr = []
        this.flieIdArrTb = val
        for (let index = 0; index < val.length; index++) {
          this.flieIdArr.push(val[index].resId)
          this.ziyuanNumberArr.push(val[index])
          this.form.flieId = this.flieIdArr.join(',')
        }
        // 已选择的资源文件总数
        this.ziyuanNumber = this.flieIdArr.length
      } else if (this.zsdOrzywj == 2) {
        // 选中的资源文件
        this.tableData = val
        // 文件个数
        const kNumber = this.uniquezt(val)
        this.numberFile = kNumber.length
        // this.knowledgeFileArr = []
        // this.knowledgeFileArrTb = val
        // // 数组去重
        // this.knowledgeFileArrTb = this.uniquezt(this.knowledgeFileArrTb)
        // for (let index = 0; index < val.length; index++) {
        //   this.knowledgeFileArr.push(val[index].resId)
        //   this.form.knowledgeFile = this.knowledgeFileArr.join(',')
        // }
      }
    },
    uniquezt(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    ztCheckData(val) {
      if (val.length == 0) {
        var set = this.ztArrData.map(item => item.id)
        this.ztListArr = this.ztListArr.filter(item => !set.includes(item.id))
      } else {
        // 已选择的账套个数
        this.ztNumber = val.length
        // 选中的整套列表
        this.ztListArr = val
      }
    },
    searchContent(val) {
      // 搜索内容
      this.pageParamsGxh = 1
      zywj({
        page: '1',
        size: '10',
        keyWrods: val,
        type: this.zsdOrzywj,
        taskId: ''
      }).then(res => {
        if (this.zsdOrzywj == 1) {
          this.xzFile = []
          this.xzFile = res.result.data
        } else {
          this.xzFileZh = []
          this.xzFileZh = res.result.data
        }
        this.pagTotal = parseInt(res.result.total)
      })
    },
    calloff() {
      // 取消
      this.$emit('sxtast')
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
      // 确定
      newTast(this.form).then(res => {
        if (res.code == '0') {
          this.$emit('sxtast')
          this.$message({
            message: '添加成功！',
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
      console.log(this.flieIdArrflag)
      if (this.flieIdArr.length > 0) {
        this.$refs.multipleTable0.clearSelection()
      }
      this.innerVisible = true
      // 任务资源
      this.fileData(1)
    },
    zsdyzwj() {
      this.zsdOrzywj = 2
      // 情况选择
      if (this.newzsd.length > 0) {
        this.$refs.multipleTable1.clearSelection()
      }
      this.fileData(2)
      this.innerVisibleZs = true
    },
    ztCheck() {
      // 显示选中的账套
      this.dutiesArr.forEach(item => {
        this.ztArrData.forEach(self => {
          if (item.id == self.id || item.resId == self.resId) {
            this.$refs.multipleTablezt.toggleRowSelection(item, true)
          }
        })
      })
      this.ztFile = true
    },
    sureZt() {
      this.ztFile = false
      // 点击确定更新账套
      this.dutiesArr = this.ztListArr
      const ztArr = []
      // 提交表单账套数据
      for (let index = 0; index < this.dutiesArr.length; index++) {
        ztArr.push(this.dutiesArr[index].id)
      }
      this.form.accountId = ztArr.join()
    },
    ztcs(val) {
      this.ztKeyword = val
      this.pageParamsGxh = 1
      this.ztPage = 1
      // 更新账套列表
      this.ztFun()
    },
    sureQ() {
      // 分页个数变为1
      this.pageParamsGxh = 1
      this.cancelNumber = ''
      this.searckKey = ''
      this.innerVisible = false
      this.innerVisibleZs = false
      this.gnFlag = false
    },
    surezsd() {
      // 分页个数变为1
      this.pageParamsGxh = 1
      this.innerVisibleZs = false
      // 点击确定 添加数据
      this.knowledgeFileArr = []
      this.knowledgeFileArrTb = this.tableData
      // 数组去重
      this.knowledgeFileArrTb = this.uniquezt(this.knowledgeFileArrTb)
      for (let index = 0; index < this.tableData.length; index++) {
        this.knowledgeFileArr.push(this.tableData[index].resId)
        this.form.knowledgeFile = this.knowledgeFileArr.join(',')
      }
    },
    cancelqx() {
      this.cancelNumber = ''
      this.searckKey = ''
      this.innerVisible = false
      this.innerVisibleZs = false
    },
    isShowPrevFileClose() {
      // 关闭预览文件
      this.isShowPrevFile = false
    },
    addEnterprise() {
      this.addData = {}
      this.indexqy = '-1'
    },
    editqy(item, index) {
      // 需要修改的索引
      this.indexqy = index
      // 打开企业信息
      // this.tjbb = true
      this.addData = item
    },
    addpt(val) {
      // this.tjbb = false
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
    preview(item) {
      // 预览弹窗
      this.isShowPrevFile = true
      if (item.converUrl) {
        this.PrevFileUrl = item.converUrl + '?resExt=' + item.resExt
      } else {
        this.PrevFileUrl = item.downloadUrl + '?resExt=' + item.resExt
      }
    },
    practicalTra(val) {
      // 赋值code
      this.bdCode = val
      // 功能实训
      this.form.funcId = val
    },
    // 功能实训 选择文件
    gnsxTrain(val) {
      this.gnFlag = true
    },
    // 选择的文件
    gnSelect(val) {
      // 选择的功能文件
      this.newngArr = val
      // 文件个数
      // this.gnNumber = val.length
    },
    sureGn() {
      this.practicalTraData = this.newngArr
      this.gnFlag = false
      // 表单id
      const bdArr = []
      for (let index = 0; index < this.practicalTraData.length; index++) {
        bdArr.push(this.practicalTraData[index].code)
      }
      this.form.formId = bdArr.join()
    },
    cancelGn() {
      this.gnFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.ziUpdata{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-input__inner{
  line-height: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.el-link.el-link--warning {
  margin-right: 20px;
}
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
  cursor: pointer;
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
.addqyxx{
  text-align: center;
  width: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 150px;
  margin-left: 25%;
}
</style>
