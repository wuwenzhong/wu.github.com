<template>
  <div class="second-level">
    <div class="top-bg"></div>
    <div class="task-head">
      <!--      <div class="link-box">-->
      <!--        <router-link to="/training">实训中心 <i class="iconfont">&#xe601;</i></router-link>-->
      <!--      </div>-->
<!--      <p class="module-title">实训中心</p>-->
<!--      <p class="module-describe">这里是实训中心，最长是20个字</p>-->
    </div>
    <div class="task-title">
      <router-link to="/training" class="iconfont return-link">&#xe61a;</router-link>
      <div class="name">{{currentTaskIndex}}：{{tainerName}}</div>
      <p class="describe">{{introduce}}</p>
    </div>
    <div class="task-content">
      <!-- 任务资源文件 -->
      <div class="task-resource">
        <p class="title">任务资源<span>TASK RESOURCE</span></p>
        <i class="pre" @click="moveOutline(0)" v-if="fileArr.length"></i>
        <div class="resource-parent" v-if="fileArr.length">
          <div class="resource-box" ref="moveBox">
            <div class="itemImg" v-for="(item,index) in fileArr" :key="index">
              <i :class="{'type-mp4':item.resExt == 'mp4' || item.resExt == 'mkv',
              'type-mp3': item.resExt == 'mp3' || item.resExt == 'wma',
              'type-xls': item.resExt == 'xlsx' || item.resExt == 'xls',
              'type-pic': item.resExt == 'jpg' || item.resExt == 'gif' || item.resExt == 'jpeg',
              'type-ppt': item.resExt == 'ppt' || item.resExt == 'pptx' || item.resExt == 'potm' || item.resExt == 'potx' || item.resExt == 'png' || item.resExt == 'svg' || item.resExt == 'bmp',
              'type-txt': item.resExt == 'txt' || item.resExt == 'text',
              'type-pdf': item.resExt == 'pdf',
              'type-doc': item.resExt == 'docx' || item.resExt == 'doc',
              'type-exe': item.resExt == 'exe',
              'type-autowork': item.resExt == 'autowork',
              'type-sql': item.resExt == 'sql'
              }"></i>
              <div class="souce-name">
                <p>{{item.resName}}</p>
                <strong class="down-btn">
                  <span @click="downLoad(item)" v-if="item.isAllow == 0">下载</span>
                  <span @click="previewFile(item)"
                        :class="(item.resExt=='autowork'||item.resExt=='sql'||item.resExt=='exe')?'grayclick':''">查看</span>
                </strong>
              </div>
            </div>
          </div>
        </div>
        <i class="nex" @click="moveOutline(1)" v-if="fileArr.length"></i>
      </div>
      <!-- 任务类型为团队2和个人1 -->
      <div class="task-edit" v-if="(taskType == '1' || taskType == '2')
                                    && ((taskType == '1' && isLeader == 1) || (taskType == '2' && isLeader == 1)
                                    || (taskType == '1' && isLeader == 0) || (taskType == '2' && isLeader == 0))">
        <ul class="tab-list">
          <li v-for="(item,i) in functionBtn"
              :key="i"
              :class="{'active':currentFunIndex == i}"
              @click="switchEdit(i)"
          >{{item}}
          </li>
        </ul>
        <div class="function-box">
          <div class="list" v-if="currentFunIndex == 0">
            <div class="quill-assembly">
              <div class="quill-mask" v-show="finishedTaskState != 0"></div>
              <textHbWord v-model="textContent" @quillChange="quillChange" :isDisable="finishedTaskState ? true : false"></textHbWord>
            </div>
          </div>
          <div class="list drawing-box" v-if="currentFunIndex == 1">
            <div class="draw-btn" @click="boardTp" v-show="finishedTaskState == 0">
              <i class="iconfont">&#xe72c;</i>
              <p>打开画板</p>
            </div>
            <!--存放图片-->
            <div class="img-box" v-show="drawAnswerRes.length">
              <div class="img-item" v-for="(src,index) in drawAnswerRes" :key="index">
                <img :src="src.converUrl"/>
                <span class="iconfont" v-show="finishedTaskState == 0" @click="removeImg(src.id)">&#xe678;</span>
              </div>
            </div>
            <div class="img-box" v-show="!drawAnswerRes.length && finishedTaskState != 0">
              <p class="no-data-tips">没有上传文件</p>
            </div>
            <el-dialog title :visible.sync="dialogVisible" width="80%" height="40%" :fullscreen="true" class="drawing-board">
              <drawingBoard :imgUrl="drawAnswerRes" @cancel="hiddenDraw" v-if="dialogVisible"></drawingBoard>
            </el-dialog>
          </div>
          <div class="list drawing-box" v-if="currentFunIndex == 2">
            <el-upload
              v-show="finishedTaskState == 0"
              class="draw-btn"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :file-list="fileList"
              :http-request="updataPic"
              :on-change="handleChange"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
            >
              <i class="iconfont">&#xe72c;</i>
              <span class="upload-text">上传文档</span>
            </el-upload>
            <ul class="show-file-box" v-show="fileList.length>0">
              <li v-for="item in fileList" :key="item.uid">
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'jpg'">&#xe617;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'jpeg'">&#xe617;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'png'">&#xe617;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'gif'">&#xe617;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'mp4'">&#xe613;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'mp3'">&#xe600;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'rmvb'">&#xe613;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'avi'">&#xe613;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'ppt'">&#xe618;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'pptx'">&#xe618;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'doc'">&#xe615;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'docx'">&#xe615;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'xls'">&#xe612;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'xlsx'">&#xe612;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'txt'">&#xe616;</span>
                <span class="iconfont type-icon"
                      v-if="item.name.substr(item.name.lastIndexOf('.')+1) == 'pdf'">&#xe614;</span>
                <p>{{item.name}}</p>
                <span class="iconfont del" v-show="finishedTaskState == 0" @click="delCurrent(item)" :data-id="item.uid">&#xe678;</span>
              </li>
            </ul>
            <div class="show-file-box" v-show="!fileList.length && finishedTaskState != 0">
              <p class="no-data-tips">没有上传文件</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 知识点任务资源 -->
      <div class="task-knowledge" v-if="knowledgeData.length">
        <div class="know-list" v-for="(item,index) in knowledgeData" :key="index" @click="previewFile(item, 1)">
          <b :class="{'know-mp4':item.resExt == 'mp4' || item.resExt == 'mkv',
                'know-xls':item.resExt == 'xlsx' || item.resExt == 'xls',
                'know-pic':item.resExt == 'jpg' || item.resExt == 'gif' || item.resExt == 'jpeg' || item.resExt == 'png' || item.resExt == 'svg' || item.resExt == 'bmp',
                'know-ppt':item.resExt == 'ppt' || item.resExt == 'pptx' || item.resExt == 'potm' || item.resExt == 'potx',
                'know-mp3':item.resExt == 'mp3' || item.resExt == 'wma',
                'know-txt':item.resExt == 'txt' || item.resExt == 'text',
                'know-pdf':item.resExt == 'pdf',
                'know-exe':item.resExt == 'exe',
                'know-autowork':item.resExt == 'autowork',
                'know-sql':item.resExt == 'sql',
                'know-doc':item.resExt == 'docx' || item.resExt == 'doc'
          }"></b>
          <p>{{item.resName}}</p>
          <span :class="{'over-look':item.state != 0}">{{item.state==0?'查看':'已查看'}}</span>
        </div>
      </div>
      <!-- 实操任务 -->
      <ul class="operate-account" v-if="accountCaseList.length > 0">
        <li v-for="item in accountCaseList" :key="item.id">
          <i class="iconfont">&#xe61b;</i>
          <div class="account-detail">
            <p>{{item.company}}</p>
            <div class="btn-box" v-if="rpaCode == 'RISK_TAX' || rpaCode == 'RISK_BD'">
              <span class="add" @click="addNewqyContent(item)" v-html="item.companyId ? '已新增' : '新增企业'"
                    :class="{active:item.companyId}"></span>
              <span class="into" @click="enterClass($event,item)" v-html="item.companyId ? '进入实训' : '请先新增企业'"
                    :class="{active:!item.companyId}">进入实训
              </span>
            </div>
            <div class="btn-box" v-if="rpaCode == 'RPA'">
              <span class="add" @click="addNewqyContent(item)" v-html="item.companyId ? '已新增' : '新增企业'"
                    :class="{active:item.companyId}"></span>
              <span class="rpa-btn" @click="enterAdmin(item)" v-html="item.companyId ? '进入管理端' : '请先增加企业'"
                    :class="{active:!item.companyId}"></span>
            </div>
            <div class="btn-box" v-if="rpaCode == 'RPA_DES'">
              <span class="rpa-btn" @click="arouseApplication(item, 1)" :class="{active:!item.companyId}">进入设计端</span>
            </div>
            <div class="btn-box" v-if="rpaCode == 'RPA_EXE'">
              <span class="rpa-btn" @click="arouseApplication(item, 2)" :class="{active:!item.companyId}">进入执行端</span>
            </div>
          </div>
        </li>
      </ul>
      <!--账套任务-->
      <ul v-if="taskType == 6 && accountModeData.length" class="operate-account">
        <li v-for="item in accountModeData" :key="item.caseId">
          <i class="iconfont">&#xe61b;</i>
          <div class="account-detail">
            <p>{{item.caseName}}</p>
            <div class="btn-box splic">
              <span class="" @click="distribuStudy(item)" v-if="isLeader == 1 && item.model == 2">分配给组员</span>
            </div>
            <div class="btn-box">
              <span class="add" @click="addCoverAccount(item)" v-html="item.companyId ? '已新增' : '新增账套'"
                    :class="{active:item.companyId}"></span>
              <span class="into" @click="enterClass($event,item)" v-html="item.companyId ? '进入账套' : '请先新增账套'"
                    :class="{active:!item.companyId}">进入实训</span>
            </div>
          </div>
        </li>
      </ul>
      <!-- 代码编辑 -->
      <edit-code v-if="taskType == '7' && isShowPython == 'py'"></edit-code>
      <!-- 完成任务按钮 -->
      <div class="finsh-btn" v-show="finishedTaskState == 0 && taskType != 1 && taskType != 2">
        <span @click="overTask">完成任务</span>
      </div>
      <!-- 提交任务 -->
      <div class="task-over" v-if="(taskType == '1' || taskType == '2') && finishedTaskState == 0
                                    && ((taskType == '1' && isLeader == 1) || (taskType == '2' && isLeader == 1)
                                    || (taskType == '1' && isLeader == 0) || (taskType == '2' && isLeader == 0))">
        <span class="storage-btn" @click="handleOperation('0')">暂存</span>
        <span class="submit-btn" @click="handleOperation('1')">提交任务</span>
      </div>
      <!-- 企业信息 -->
      <el-dialog class="account-dialog"
        :close-on-click-modal="false"
        :visible.sync="addNewqy">
        <newAdd v-if="addNewqy" :addFormData=addFormData></newAdd>
        <span slot="footer" style="display:block;text-align: center;margin-top:15px">
          <el-button class="el-button--small" @click="addNewqy=false">取 消</el-button>
          <el-button class="Determine el-button--small" type="primary" @click="sure">确 定</el-button>
        </span>
      </el-dialog>
      <!--新增账套-->
      <el-dialog :show-close="false" :visible.sync="accountMode" :close-on-click-modal="false" class="account-dialog">
        <addAccount v-if="accountMode" :accountDialogData=accountDialogData></addAccount>
        <span slot="footer" style="display:block;text-align: center;margin-top:15px">
          <el-button class="el-button--small" @click="accountMode=false">取 消</el-button>
          <el-button class="Determine el-button--small" type="primary" @click="holdSetAccount()">确 定</el-button>
        </span>
      </el-dialog>
      <!--分配给学生-->
      <distribu-study v-if="showDistribu" @closeConfirm="closeConfirm" :distribuData="distribuData"></distribu-study>
    </div>
    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFileClose"
                    v-if="isShowPrevFile"></show-prev-file>
  </div>
</template>

<script>
import {
  querytask,
  wjUp,
  zcgrtd,
  xiazaifilie,
  fnish,
  zczsd,
  newAddAccount,
  classtaskidList,
  getAccountList,
  savecompany
} from '@/api/trainingCenter'
import drawingBoard from '@/components/printer/printTemp'
import textHbWord from '@/components/editor'
import showPrevFile from '@/components/showPrevFile/index'
import EditCode from '@/components/editCode/index'
import { formatDate } from '@/common/js/utils'
import newAdd from '../components/newAdd'
import addAccount from '../components/AddAccount'
import DistribuStudy from '../components/DistribuStudy'
import md5 from 'js-md5'
import customProtocolCheck from 'custom-protocol-check'

export default {
  name: 'taskShow',
  data() {
    return {
      previewData: {}, // 预览参数
      tainerName: '', // 任务名称
      introduce: '', // 任务描述
      fileArr: [], // 资源文件数据
      isLeader: 0, // 登录账号的权限 0 是学员1是组长
      finishedTaskState: 0, // 任务状态，是否完成任务0未完成，1已完成
      fileList: [], // 上传文件数据
      userTaskRecordId: '', // 学生完任务记录id
      taskId: '', // taskAnswerId已经完成任务的数据id
      textContent: '', // editor 富文本编辑区的内容
      drawAnswerRes: [], // 画板数据
      dialogVisible: false, // 画板组件显示
      isShowPrevFile: false, // 预览弹窗显示隐藏
      taskType: '', // 当前的任务类型
      currentTaskIndex: this.$route.query.index, // 当前任务序列号
      isShowPython: '', // 是否显示编辑Python组件
      currentTaskId: this.$route.query.classTaskId, // 上级传递过来的当前任务id
      functionBtn: ['文字', '画板', '文件'], // 功能按钮
      knowledgeData: [], // 知识点任务资源数据数据
      currentFunIndex: 0, // 当前所在功能下表
      previewRefresh: false, // 知识点任务预览以后是否刷新
      accountCaseList: [], // 实操任务企业数据
      addNewqy: false,
      addFormData: {}, // 新增企业的信息，这个是给弹窗用的
      nowqy: {}, // 这个建账时使用
      rpaCode: this.$route.query.rpaCode, // 判断进入实训的是RPA的那种类型
      accountModeData: [], // 账套企业列表
      accountMode: false, // 新增套账弹窗
      accountDialogData: {}, // 新增套账弹窗需要的数据
      setAccoountUse: {}, // 套账使用
      distribuData: {}, // 传递给分配弹窗的数据
      showDistribu: false, // 显示分配给组员弹窗

      taskDataWidth: 0, // 大纲数据长度
      starNum: 0 // 移动的次数
    }
  },
  components: {
    drawingBoard,
    textHbWord,
    showPrevFile,
    EditCode,
    newAdd,
    addAccount,
    DistribuStudy
  },
  mounted() {
    const _this = this
    this.isShowPython = this.$route.query.editPy
    this.taskType = this.$route.query.taskType
    this.init()
    // 获取实操企业数据
    if (this.taskType == 3) {
      this.getAccountData()
    }
    // 获取账套企业数据
    if (this.taskType == 6) {
      this.getAccountMode()
    }
  },
  methods: {
    // 初始化获取页面数据
    init() {
      querytask({ classTaskId: this.currentTaskId }).then(res => {
        this.tainerName = res.result.taskName
        this.introduce = res.result.introduce
        /* 资源文件 */
        this.fileArr = res.result.fileRes
        /* 个性化文件 */
        if (res.result.personalizeFileRes) {
          this.fileArr = res.result.personalizeFileRes.concat(res.result.fileRes)
        }
        // 获取账号权限
        this.isLeader = res.result.isLeader
        // 任务完成状态
        this.finishedTaskState = res.result.finishedTaskState
        /* 知识点任务资源 */
        this.knowledgeData = res.result.knowledgeFileRes ? res.result.knowledgeFileRes : []
        // 完成或者暂存需要传的参数
        if (res.result.taskAnswerDTO) {
          this.userTaskRecordId = res.result.taskAnswerDTO.userTaskRecordId
          this.taskId = res.result.taskAnswerDTO.id
          this.textContent = res.result.taskAnswerDTO.textAnswer
          if (res.result.taskAnswerDTO.drawAnswerRes) {
            this.drawAnswerRes = res.result.taskAnswerDTO.drawAnswerRes
          }
          this.fileList = res.result.taskAnswerDTO.fileAnswerRes
        }
        this.getResourceWidth()
      })
    },
    // 实操任务获取企业列表
    getAccountData() {
      classtaskidList({
        classTaskId: this.currentTaskId
      }).then(res => {
        if (res.code == 0) {
          this.accountCaseList = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 获取账套任务中企业列表
    getAccountMode() {
      const _this = this
      const postData = '?classTaskId=' + this.currentTaskId
      getAccountList(postData).then(res => {
        if (res.code == 0) {
          _this.accountModeData = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 实操建账
    sure() {
      const _this = this
      savecompany(this.nowqy).then(res => {
        if (res.code == '0' || res.code == 0) {
          this.addNewqy = false
          _this.getAccountData()
          this.$message({
            type: 'success',
            message: '新增成功！'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 账套任务确定建账
    holdSetAccount() {
      const _this = this
      newAddAccount(this.setAccoountUse).then(res => {
        if (res.code == 0) {
          this.accountMode = false
          _this.getAccountMode()
          this.$message({
            type: 'success',
            message: '新增成功！'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 唤起新增企业弹窗
    addNewqyContent(item) {
      if (item.companyId) {
        return false
      }
      this.addFormData = item
      this.nowqy = item
      this.nowqy.userType = 0
      this.addNewqy = true
    },
    // 进入账簿
    enterClass(e, item) {
      const _this = this
      if (!item.companyId) {
        return false
      }
      const _userId = localStorage.getItem('userId')
      const _userName = localStorage.getItem('userName')
      const currentTime = Date.parse(new Date()) / 1000
      const _linkUrl = item.jumpAddress
      let _url = ''
      if (this.taskType == 6) {
        _url = localStorage.getItem('jumpAddress') + '?qyid=' + item.companyId
        _this.$router.push({
          path: '/toExercise',
          query: {
            url: _url,
            _classTaskId: this.currentTaskId,
            index: this.currentTaskIndex,
            rpaCode: this.rpaCode,
            taskType: this.taskType,
            caseId: item.caseId,
            trainState: item.setAccount
          }
        })
      } else {
        const _id = _userId + '14599166648729e47f954a63c76524117769be89d5455' + currentTime
        const _md5 = md5(_id)
        const _schoolid = item.schoolId
        if (this.rpaCode == 'RISK_TAX') {
          _url = _linkUrl + '/edurisk?schoolId=' + _schoolid + '&userId=' + _userId + '&userName=' + _userName + '&companyId=' + item.companyId + '&version=1&appId=1459916664872&token=' + _md5 + '&time=' + currentTime
        }
        if (this.rpaCode == 'RISK_BD') {
          _url = _linkUrl + '/edufinancial?schoolId=' + _schoolid + '&userId=' + _userId + '&userName=' + _userName + '&companyId=' + item.companyId + '&version=1&appId=1459916664872&token=' + _md5 + '&time=' + currentTime
        }
        const queryData = encodeURIComponent(_url + '&&_classTaskId=' + this.currentTaskId + '&&index=' + this.currentTaskIndex + '&&rpaCode=' + this.rpaCode +
          '&&taskType=' + this.taskType + '&&caseId=' + item.caseId + '&&trainState=' + item.setAccount)
        window.open('/accountExercise?queryData=' + queryData, '_blank')
      }
    },
    // RPA进入管理端
    enterAdmin(item) {
      if (!item.companyId) {
        return false
      }
      const currentTime = formatDate(new Date().getTime())
      const _userId = localStorage.getItem('userId')
      const _classId = localStorage.getItem('classId')
      const _companyName = item.company
      const manageToken = md5(_classId + '_' + _userId + '_' + _companyName + '_' + currentTime)
      localStorage.setItem('manageToken', manageToken)
      localStorage.setItem('manageTime', currentTime)
      localStorage.setItem('enterCompanyId', item.companyId)
      window.open('/applicatAdmin', '_blank')
    },
    // 调用本地应用
    arouseApplication(item, num) {
      if (!item.companyId) {
        return false
      }
      const currentTime = formatDate(new Date().getTime())
      const _userId = localStorage.getItem('userId')
      const _classId = localStorage.getItem('classId')
      const _companyName = item.company
      const manageToken = md5(_classId + '_' + _userId + '_' + _companyName + '_' + currentTime)
      const _src = num == 1 ? 'AutoWorkDesigner://' : 'AutoWorkRunner://'
      const _url = _src + '?companyId=' + item.companyId + '&caiZhiToken=' + manageToken + '&time=' + currentTime
      customProtocolCheck(_url, () => {
          fetch('http://edulicense.autoworkrpa.com//api/rpa/version/v1/queryNewVersion?type=1&currentVersion=1.0.0')
            .then((response) => response.json())
            .then((data) => window.open(data.result.packageDownloadUrl))
        },
        () => {
          // 协议成功拉起无需处理
        }, 1000
      )
      window.open(_src + '?companyId=' + item.companyId + '&caiZhiToken=' + manageToken + '&time=' + currentTime)
      const _this = this
      this.loadObj = this.$loading({ text: '正在唤起本地应用~~~' })
      setTimeout(function() {
        _this.loadObj.close()
      }, 7000)
    },
    // 分配企业到学员
    distribuStudy(obj) {
      this.showDistribu = true
      this.distribuData = obj.caseId
    },
    // 套账简章弹窗
    addCoverAccount(item) {
      if (item.companyId) {
        return false
      }
      this.setAccoountUse = item
      this.accountDialogData = item
      this.accountMode = true
    },
    // 关闭分配学员弹窗
    closeConfirm(num) {
      if (num == 1) {
        this.getAccountMode()
      }
      this.showDistribu = false
    },
    // element上传组件赋值
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 删除上传的文档
    delCurrent(obj) {
      for (let i = 0, size = this.fileList.length; i < size; i++) {
        if (obj.uid == this.fileList[i].uid) {
          this.fileList.splice(i, 1)
          break
        }
      }
    },
    // 功能切换
    switchEdit(num) {
      this.currentFunIndex = num
    },
    // 上传之前
    beforeUpload(e) {
      if (this.fileList.length > 5) {
        this.$message({
          type: 'warning',
          message: '最多只能上传五个文件'
        })
        return false
      }
      const extension = e.name.substring(e.name.lastIndexOf('.') + 1)
      if (!'mp4/rmvb/avi/ppt/pptx/doc/docx/xls/xlsx/txt/jpg/gif/png/jpeg/pdf/mp3'.includes(extension)) {
        this.$message.warning('请上传正确的格式类型')
        return false
      }
      if ('mp4/rmvb/avi'.includes(extension) && e.size < 100 * 1024 * 1024) {
        return true
      } else if ('ppt/pptx/doc/docx/xls/xlsx/txt/jpg/gif/png/jpeg/pdf/mp3'.includes(extension) && e.size < 20 * 1024 * 1024) {
        return true
      } else {
        if ('mp4/rmvb/avi'.includes(extension)) {
          this.$message.warning('文件最大不能超过 100MB！')
        } else {
          this.$message.warning('除mp4、rmvb、avi文件外，文件不能超过 20MB！')
        }
        return false
      }
    },
    // 富文本编辑器内容改变
    quillChange(str) {
      this.textContent = str
    },
    // element上传删除监听
    beforeRemove(file, fileList) {
      this.fileList = fileList
    },
    // 上传图片
    async updataPic(e) {
      const _this = this
      const wjType = e.file.name.substring(e.file.name.lastIndexOf('.') + 1)
      // 文件类型
      if (wjType == 'jpg' || wjType == 'gif' || wjType == 'JPG' || wjType == 'GIF' || wjType == 'jpeg' || wjType == 'png' || wjType == 'PNG') {
        this.resType = 'PIC'
      } else if (wjType == 'doc' || wjType == 'docx' || wjType == 'txt' || wjType == 'xlsx' || wjType == 'xls' || wjType == 'ppt' || wjType == 'pptx') {
        this.resType = 'WORD'
      } else if (wjType == 'mp3') {
        this.resType = 'MP3'
      } else {
        this.resType = 'VIDEO'
      }
      const res = await this.cos(e)
      // 资源保存
      wjUp({
        resName: e.file.name,
        downloadUrl: res,
        resType: this.resType,
        resExt: wjType,
        resSize: e.file.size,
        creator: localStorage.getItem('userId')
      }).then(res => {
        if (res.code == 0) {
          // 在数组中加入此文件的腾讯云id
          _this.fileList[parseInt(_this.fileList.length) - 1].id = res.result
        }
      })
    },
    // 文件预览,isRefresh带表是不是知识点资料查看
    previewFile(item, isRefresh) {
      if (item.resExt == 'sql' || item.resExt == 'autowork' || item.resExt == 'exe') {
        this.$message({
          type: 'warning',
          message: '此文件暂不支持预览！'
        })
        return false
      }
      // 知识点任务记录是否查看
      if (isRefresh && item.state == 0) {
        this.previewRefresh = true
        zczsd({
          knowledgeFileId: item.id,
          classId: localStorage.getItem('classId'),
          classTaskId: this.currentTaskId
        }).then(res => {
          if (res.code == 0 || res.code == '0') {
            this.previewData = {
              imgUrl: '',
              resExt: item.resExt
            }
            this.previewData.imgUrl = item.converUrl ? item.converUrl : item.downloadUrl
            this.isShowPrevFile = true
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      } else {
        this.previewData = {
          imgUrl: '',
          resExt: item.resExt
        }
        this.previewData.imgUrl = item.converUrl ? item.converUrl : item.downloadUrl
        this.isShowPrevFile = true
      }
    },
    // 提交任务
    handleOperation(state) {
      const _this = this
      this.$confirm('是否完成任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arrSting = []
        let fileListId = ''
        for (let i = 0; i < this.fileList.length; i++) {
          arrSting.push(this.fileList[i].id)
          fileListId = arrSting.join(',')
        }
        const drawPrinterId = this.drawAnswerRes.map(item => {
          return item.id
        })
        zcgrtd({
          userId: localStorage.getItem('userId'),
          classId: localStorage.getItem('classId'),
          classTaskId: _this.currentTaskId,
          textAnswer: this.textContent,
          drawAnswer: drawPrinterId.join(','),
          fileAnswer: fileListId,
          userTaskRecordId: this.userTaskRecordId,
          id: this.taskId,
          state: state
        }).then(res => {
          if (res.code === '0') {
            _this.$router.push('/training')
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
      })
    },
    // 完成任务
    overTask() {
      const _this = this
      this.$confirm('是否完成任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 完成任务
        fnish({
          userId: localStorage.getItem('userId'),
          classId: localStorage.getItem('classId'),
          classTaskId: this.currentTaskId
        }).then(res => {
          if (res.code == 0) {
            this.$router.push({ path: '/training' })
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }).catch(e => e)
    },
    // 打开画板
    boardTp() {
      this.dialogVisible = true
    },
    // 隐藏画板
    hiddenDraw(item) {
      this.drawAnswerRes = item
      this.dialogVisible = false
    },
    // 删除已画的图片
    removeImg(_id) {
      this.drawAnswerRes = this.drawAnswerRes.filter(item => item.id !== _id)
    },
    // 知识点关闭预览
    isShowPrevFileClose() {
      // 关闭预览文件
      this.isShowPrevFile = false
      if (this.previewRefresh) {
        this.init()
      }
      this.previewRefresh = false
    },
    // 下载内容
    downLoad(str) {
      xiazaifilie(str.downloadUrl).then(res => {
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', str.resName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 左右移动大纲展示更多
    moveOutline(num) {
      const _moveBox = this.$refs.moveBox // 要移动的盒子
      const remain = this.taskDataWidth % 1000 // 取余数
      const quotient = parseInt(this.taskDataWidth / 1000) // 大纲长度取商，正整数
      if (num) {
        if (this.starNum + 1 < quotient) {
          this.starNum = this.starNum + 1
          _moveBox.style.left = -this.starNum * 1000 + 'px'
        } else {
          if (this.starNum + 1 == quotient && remain > 0) {
            _moveBox.style.left = -(this.starNum * 1000 + remain) + 'px'
          }
        }
      } else {
        if (this.starNum <= 0) {
          this.starNum = 0
          _moveBox.style.left = 0
        } else {
          if (this.starNum + 1 == quotient) {
            _moveBox.style.left = -this.starNum * 1000 + 'px'
            this.starNum--
          } else {
            _moveBox.style.left = -this.starNum * 1000 + 'px'
            this.starNum--
          }
        }
      }
    },
    // 获取资源文件的宽度
    getResourceWidth() {
      const _this = this
      // 获取资源文件宽度
      this.$nextTick(function() {
        _this.taskDataWidth = _this.$refs.moveBox.clientWidth
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .public-flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
  }
  /*去掉简章对话框头*/
  .el-dialog__wrapper.account-dialog{
    /deep/.el-dialog{
      width:930px;
      height: 685px;
      border-radius:20px;
      /deep/.el-dialog__header{
        display: none;
      }
      /deep/.el-dialog__body{
        height: 100%;
        padding:0;
        border-radius:0 20px 0 0;
      }
      /deep/.el-dialog__footer{
        width: 500px;
        position: absolute;
        right: 0;
        bottom:20px;
      }
    }
  }
  .second-level {
    position: relative;
    overflow-x: hidden;
    .top-bg {
      width: 1600px;
      height: 350px;
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -800px;
      border-radius: 0 0 12px 12px;
      @include setLinearGradient(#73D766, #3DD471);
      @include setShadow(0px, 0px, 20px, 1px, rgba(33, 80, 67, 0.2));
    }

    /*模块头部*/
    .task-head {
      width: 1200px;
      height: 206px;
      margin: 0 auto;
      background-image: url("../../../common/images/train_top.png");
      background-repeat: no-repeat;
      background-size: 671px 435px;
      background-position: right 10px;
      color: #fff;
      position: relative;
      z-index: 1;

      .link-box {
        padding-top: 30px;
        font-size: 14px;
        line-height: 14px;
      }

      .module-title {
        font-size: 30px;
        padding-top: 90px;
      }

      .module-describe {
        display: none;
        font-size: 14px;
        line-height: 20px;
        margin-top: 8px;
      }
    }

    /*任务标题描述*/
    .task-title {
      width: 1200px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 12px;
      padding: 30px 40px;
      color: #333;
      position: relative;
      z-index: 1;
      @include setShadow(0px, 0px, 14px, 2px, rgba(0, 0, 0, 0.07));

      .return-link {
        font-size: 20px;
        height: 20px;
        display: inline-block;
        line-height: 20px;
        margin-left: -4px;
      }

      .name {
        font-size: 20px;
        font-weight: bold;
        margin: 4px 0;
        line-height: 30px;
      }

      .describe {
        min-height: 40px;
        line-height: 20px;
        overflow: hidden;
        font-size: 12px;
      }
    }

    .task-content {
      width: 1200px;
      margin: 0 auto;
      background-color: #fff;
      padding: 0 40px 45px;
      border-radius: 8px;
      @include setShadow(0px, 0px, 14px, 2px, rgba(0, 0, 0, 0.07));
      /*资源文件*/
      .task-resource {
        background-color: #fff;
        margin-top: 30px;
        position: relative;
        .pre{
          width: 30px;
          height: 34px;
          position: absolute;
          top:144px;
          left: 0;
          cursor: pointer;
          background: url("../images/move_left.png")no-repeat center/100% 100%;
        }
        .nex{
          width: 30px;
          height: 34px;
          position: absolute;
          top:144px;
          right: 0;
          cursor: pointer;
          background: url("../images/move_ri.png")no-repeat center/100% 100%;
        }
        .title {
          font-size: 24px;
          color: #40D36F;
          font-weight: bold;
          line-height: 84px;

          span {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.07);
            margin-left: 14px;
          }
        }
        .resource-parent{
          position: relative;
          width:1000px;
          height: 150px;
          margin-left: 60px;
          overflow: hidden;
          .resource-box {
            @extend .public-flex;
            flex-wrap: nowrap;
            background: #fff;
            position: absolute;
            left: 0;
            top:0;
            transition: 0.5s ease-in-out;
            .itemImg {
              width: 364px;
              display: flex;
              padding: 16px;
              flex-shrink: 0;
              border-radius: 8px;
              margin: 0 36px 20px 0;
              border:1px solid #e9e9e9;
              &:last-child{
                margin-right: 0;
              }
              &:hover {
                @include setShadow(0px, 0px, 20px, 2px, rgba(35, 35, 35, 0.22));
              }
              i {
                width: 100px;
                height: 100px;
                display: block;
                background-image: url("../../../common/images/default_sprit.png");
                background-repeat: no-repeat;

                &.type-mp4 {
                  background-position: -684px 0;
                }

                &.type-mp3 {
                  background-position: 0 -116px;
                }

                &.type-xls {
                  background-position: -228px 0;
                }

                &.type-pic {
                  background-position: -798px 0;
                }

                &.type-ppt {
                  background-position: -114px 0;
                }

                &.type-txt {
                  background-position: -570px 0;
                }

                &.type-pdf {
                  background-position: -456px 0;
                }

                &.type-doc {
                  background-position: 0 0;
                }

                &.type-exe {
                  background-position: -342px -116px;
                }

                &.type-autowork {
                  background-position: -116px -116px;
                }

                &.type-sql {
                  background-position: -230px -116px;
                }
              }

              .souce-name {
                flex: 1;
                margin-left: 16px;
                font-size: 13px;
                color: #303133;
                position: relative;

                p {
                  line-height: 20px;
                }

                .down-btn {
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  text-align: right;
                  padding-right: 4px;

                  span {
                    background-color: $color-theme;
                    height: 28px;
                    line-height: 28px;
                    color: #fff;
                    border-radius: 14px;
                    font-size: 12px;
                    padding: 0 18px;
                    margin-left: 10px;
                    display: inline-block;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }

      /*个人任务团队任务编辑区*/
      .task-edit {
        margin-top: 20px;
        border-radius: 8px;
        border: 1px solid #ECECEC;
        position: relative;
        box-sizing: border-box;

        .tab-list {
          height: 36px;
          border-radius: 8px 8px 0 0;
          border: 2px solid $color-theme;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;

          li {
            flex: 1;
            line-height: 36px;
            text-align: center;
            color: $color-theme;
            border-right: 1px solid $color-theme;
            cursor: pointer;

            &:last-child {
              border-right: 0;
            }

            &.active {
              background-color: $color-theme;
              color: #fff;
            }
          }
        }

        .function-box {
          margin-top: 40px;
          .no-data-tips{
            width: 100%;
            height: 100%;
            display: flex;
            align-items:center;
            justify-content:center;
          }
          .quill-assembly {
            padding: 20px;
            height: 320px;
            position: relative;
            .quill-mask{
              width: calc(100% - 40px);
              height: 42px;
              position: absolute;
              top:20px;
              left: 20px;
              background-color:rgba(0,0,0,0) ;
              z-index: 1;
            }
          }

          .drawing-box {
            padding: 20px;
            display: flex;
            /deep/.drawing-board{
              /deep/.el-dialog{
                /deep/.el-dialog__header{
                  /deep/.el-dialog__headerbtn{
                    top:4px;
                    right: 22px;
                  }
                }
              }
            }
            .draw-btn {
              width: 220px;
              height: 280px;
              flex-shrink: 0;
              border-radius: 8px;
              padding-top: 86px;
              cursor: pointer;
              text-align: center;
              @include setShadow(0px, 2px, 20px, 2px, rgba(35, 35, 35, 0.11));

              i {
                width: 76px;
                height: 76px;
                line-height: 76px;
                display: inline-block;
                background-color: $color-theme;
                font-size: 30px;
                color: #fff;
                border-radius: 100%;
              }

              p {
                font-size: 16px;
                color: #323937;
                margin-top: 22px;
                line-height: 18px;
              }

              .el-upload {
                .upload-text {
                  display: block;
                  margin-top: 20px;
                  font-size: 16px;
                  color: #323937;
                }
              }
            }

            .img-box {
              flex: 1;
              width: 0;
              margin-left: 30px;
              height: 280px;
              overflow-y: auto;
              clear: both;
              overflow-x: hidden;
              .img-item {
                width: 120px;
                height: 80px;
                float: left;
                position: relative;
                border: 1px solid #ECECEC;
                border-radius: 8px;
                margin:0 20px 20px 0;
                &:nth-child(6n){
                  margin-right: 0;
                }
                img {
                  width: calc(100% - 28px);
                }

                span {
                  height: 24px;
                  line-height: 15px;
                  position: absolute;
                  top: 0;
                  right: 0;
                  padding: 6px;
                  cursor: pointer;
                  color: $color-theme;
                }
              }
            }

            .show-file-box {
              flex: 1;
              height: 280px;
              overflow-y: auto;
              display: flex;
              flex-flow: wrap;
              margin-left: 30px;

              li {
                width: 260px;
                height: 80px;
                display: flex;
                border: 1px solid #ECECEC;
                justify-items: center;
                align-items: center;
                position: relative;
                margin: 0 20px 20px 0;
                padding: 16px 24px;
                border-radius: 8px;
                &:nth-child(3n){
                  margin-right: 0;
                }
                .type-icon {
                  font-size: 46px;
                  color: $color-theme;
                  width: 70px;
                }

                p {
                  flex: 1;
                  line-height: 18px;
                  font-size: 12px;
                  color: #333;
                  height: 54px;
                  overflow: hidden;
                }

                .del {
                  color: $color-theme;
                  font-size: 14px;
                  padding: 4px;
                  position: absolute;
                  top: 0;
                  right: 0;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }

      /*知识点任务*/
      .task-knowledge {
        margin-top: 30px;
        @extend .public-flex;

        .know-list {
          width: 352px;
          height: 80px;
          padding: 0 20px;
          border: 1px solid #ECECEC;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 32px 30px 0;

          &:nth-child(3n) {
            margin-right: 0;
          }

          b {
            width: 66px;
            height: 66px;
            background-image: url("../../../common/images/default_sprit.png");
            background-repeat: no-repeat;

            &.know-mp4 {
              background-position: -481px -295px;
            }

            &.know-mp3 {
              background-position: -808px -295px;
            }

            &.know-xls {
              background-position: -81px -295px;
            }

            &.know-pic {
              background-position: -405px -295px;
            }

            &.know-ppt {
              background-position: 0 -295px;
            }

            &.know-txt {
              background-position: -326px -295px;
            }

            &.know-pdf {
              background-position: -245px -295px;
            }

            &.know-doc {
              background-position: -160px -295px;
            }

            &.know-exe {
              background-position: -563px -295px;
            }

            &.know-autowork {
              background-position: -727px -295px;
            }

            &.know-sql {
              background-position: -645px -295px;
            }
          }

          p {
            flex: 1;
            line-height: 18px;
            margin: 0 24px 0 12px;
            word-break: break-all;
          }

          span {
            width: 60px;
            height: 28px;
            line-height: 28px;
            background-color: $color-theme;
            font-size: 12px;
            color: #fff;
            border-radius: 20px;
            text-align: center;
            cursor: pointer;

            &.over-look {
              @include setLinearGradient(#FF9D6B, #FF7732);
              @include setShadow(0px, 2px, 10px, 2px, rgba(255, 157, 107, 0.3));
            }
          }
        }
      }

      /*实操企业样式*/
      .operate-account {
        margin-top: 30px;
        @extend .public-flex;

        li {
          display: flex;
          padding: 20px 16px;
          width: 352px;
          height: 150px;
          background: #fff;
          border-radius: 8px;
          margin: 0 30px 20px 0;
          @include setShadow(0px, 2px, 20px, 0px, rgba(35, 35, 35, 0.11));

          &:nth-child(3n) {
            margin-right: 0;
          }

          i {
            width: 100px;
            height: 110px;
            background-color: #F4FEF7;
            border-radius: 8px;
            font-size: 40px;
            line-height: 110px;
            text-align: center;
            color: $color-theme;
          }

          .account-detail {
            margin-left: 25px;
            position: relative;
            flex: 1;

            p {
              line-height: 18px;
              font-size: 13px;
              color: #333;
              max-height: 36px;
              overflow: hidden;
            }

            .btn-box {
              width: 100%;
              position: absolute;
              bottom: 0;
              right: 0;
              text-align: right;

              &.splic {
                bottom: 34px;
              }

              span {
                height: 26px;
                line-height: 24px;
                display: inline-block;
                padding: 0 10px;
                border: 1px solid $color-theme;
                background-color: #fff;
                font-size: 12px;
                border-radius: 20px;
                margin-left: 10px;
                color: $color-theme;
                cursor: pointer;

                &:hover {
                  background-color: $color-theme;
                  color: #fff;
                }

                &.active {
                  cursor: no-drop;
                  color: #e0e0e0;
                  background-color: #bdbcbc;
                  border: 1px solid #bdbcbc;
                }
              }
            }
          }
        }
      }

      /*提交按钮*/
      .task-over {
        height: 40px;
        text-align: right;
        margin-top: 30px;

        span {
          width: 130px;
          height: 40px;
          box-sizing: border-box;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: $color-theme;
          display: inline-block;
          border-radius: 20px;
          cursor: pointer;
          margin-left: 10px;
        }

        .submit-btn {
          background-image: url("../../../common/images/default_sprit.png");
          background-repeat: no-repeat;
          background-position: 0 -230px;
          color: #ffff;
        }

        .storage-btn {
          border: 1px solid $color-theme;
        }
      }

      .finsh-btn {
        height: 40px;
        text-align: right;
        margin-top: 30px;

        span {
          width: 130px;
          height: 40px;
          box-sizing: border-box;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          display: inline-block;
          border-radius: 20px;
          cursor: pointer;
          background-image: url("../../../common/images/default_sprit.png");
          background-repeat: no-repeat;
          background-position: 0 -230px;
          color: #ffff;
        }
      }
    }
  }
</style>
