<template>
  <div class="exercise-box" :style="{minHeight:boxHeight+'px'}">
    <button class="return-btn" @click="gotoHome"><i class="iconfont">&#xe641;</i>返回任务列表</button>
    <p class="exam-title">{{currentTaskName}}</p>
    <!--任务描述区域-->
    <dl class="dl-list">
      <dt>任务描述</dt>
      <dd>
        <p class="describe-text" :class="{'no-data-tips':currentTaskIntroduce == ''}"
           v-html="currentTaskIntroduce == ''? '<i class=iconfont style=font-size:18px;color:#f28e23;margin-right:10px;vertical-align: top;>&#xe677;</i>暂无描述内容~~~~':currentTaskIntroduce">
        </p>
      </dd>
    </dl>
    <!--资源文件展示区域-->
    <dl class="dl-list" v-if="currentTaskFile.length > 0">
      <dt>资源文件</dt>
      <dd class="files-box">
        <div v-for="item in currentTaskFile" :key="item.id" class="file-list">
          <img v-if="!(item.resExt == 'pbix' || item.resExt == 'py')" :src="defaultIcon['src'+item.resExt]" alt="">
          <i v-else class="iconfont iconImg" :class="'icon-' + item.resExt"
             v-html="item.resExt == 'pbix' ? '&#xe601;' : (item.resExt == 'py' ? '&#xe703;' : '')"></i>
          <div class="btn-box">
            <p>{{item.resName}}</p>
            <div>
              <a @click.prevent="previewFile(item)" href="javascript:;"
                 v-if="!(item.resExt == 'autowork' || item.resExt == 'sql' || item.resExt == 'exe' || item.resExt == 'pbix' || item.resExt == 'py')">查看</a>
              <a v-if="item.isAllow == 0" @click.prevent="downLoad(item)" href="javascript:;">下载</a>
            </div>
          </div>
        </div>
      </dd>
    </dl>
    <!--个人团队内容区-->
    <dl class="dl-list" v-if="currentLookType == 1 || currentLookType == 2">
      <dt class="submit-study">{{titleText}}</dt>
      <dd class="look-study-submit">
        <div class="student-search">
          <div class="condition-search">
            <input type="text" :placeholder="'请输入'+titleText" v-model="searchStudy">
            <i class="iconfont">&#xe642;</i>
          </div>
          <div class="student-box" v-if="currentLookType == 2">
            <el-scrollbar>
              <ul v-if="studentData.length>0">
                <li v-for="(item , i) in studentData" :key="item.id" :class="{active:i==currentLook}"
                    class="student-list" @click="studySubmit(item, i)">{{item.teamName}}
                </li>
              </ul>
              <ul v-else>
                <li class="student-list no-data">暂无数据~~~~</li>
              </ul>
            </el-scrollbar>
          </div>
          <div class="student-box" v-if="currentLookType == 1">
            <el-scrollbar>
              <ul v-if="studentData.length>0">
                <li v-for="(item , i) in studentData" :key="item.id" :class="{active:i==currentLook}"
                    class="student-list" @click="studySubmit(item, i)">{{item.userName}}
                </li>
              </ul>
              <ul v-else>
                <li class="student-list no-data">暂无数据~~~~</li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
        <div class="echo-cont" v-if="currentLookType == 1 || currentLookType == 2">
          <div class="switch-box">
            <button :class="{active:defaultLookType == 0}" @click="switchLookStype(0)">文本工具</button>
            <button :class="{active:defaultLookType == 1}" @click="switchLookStype(1)">画板工具</button>
            <button :class="{active:defaultLookType == 2}" @click="switchLookStype(2)">文件上传</button>
          </div>
          <div class="show-box" v-if="defaultLookType == 0">
            <p class="text-spread" v-if="fileData.textAnswer != '' && fileData.textAnswer"
               v-html="fileData.textAnswer"></p>
            <p class="text-spread" v-else>暂无数据~~~~</p>
          </div>
          <div class="show-box" v-if="defaultLookType == 1">
            <ul class="pic-spread" v-if="fileData.drawAnswerRes && fileData.drawAnswerRes.length > 0">
              <li v-for="item in fileData.drawAnswerRes" :key="item.id">
                <img :src="item.converUrl" alt="" @click.prevent="previewFile(item)"/>
              </li>
            </ul>
            <ul v-else class="pic-spread">
              <li class="no-data">暂无数据~~~~</li>
            </ul>
          </div>
          <div class="show-box" v-if="defaultLookType == 2">
            <ul class="file-spread" v-if="fileData.fileAnswerRes && fileData.fileAnswerRes.length>0">
              <li v-for="item in fileData.fileAnswerRes" :key="item.id">
                <img :src="defaultIcon['src'+item.resExt]" alt="">
                <div class="btn-box">
                  <p>{{item.resName}}</p>
                  <div>
                    <a @click.prevent="previewFile(item)" href="javascript:;">查看</a>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="file-spread" v-else>
              <li class="no-data">暂无数据~~~~</li>
            </ul>
          </div>
        </div>
      </dd>
    </dl>
    <!--实操任务集合-->
    <div v-if="currentLookType == 3 && accountCaseList.length" class="business-list">
      <div v-for="item in accountCaseList" :key="item.id" class="itemList">
        <div class="case_name">
          <p>{{item.company}}</p>
        </div>
        <div class="btn_box" v-if="rpaCode == 'RISK_TAX' || rpaCode == 'RISK_BD'">
          <div class="add" @click="addNewqyContent(item)" v-html="item.companyId ? '已新增' : '新增企业'"
               :class="{active:item.companyId}"></div>
          <div class="join" @click="enterClass($event,item)" v-html="item.companyId ? '进入实训' : '请先新增企业'"
               :class="{active:!item.companyId}">进入实训
          </div>
        </div>
        <div class="btn_box" v-if="rpaCode == 'RPA'">
          <div class="add" @click="addNewqyContent(item)" v-html="item.companyId ? '已新增' : '新增企业'" :class="{active:item.companyId}"></div>
          <div class="rpa-btn" @click="enterAdmin(item)" :class="{active:!item.companyId}">进入管理端</div>
        </div>
        <div class="btn_box" v-if="rpaCode == 'RPA_DES'">
          <span class="rpa-btn" @click="arouseApplication(item, 1)" :class="{active:!item.companyId}">进入设计端</span>
        </div>
        <div class="btn_box" v-if="rpaCode == 'RPA_EXE'">
          <span class="rpa-btn" @click="arouseApplication(item, 2)" :class="{active:!item.companyId}">进入执行端</span>
        </div>
      </div>
    </div>
    <!--知识点任务-->
    <dl class="dl-list" :class="{'know-task':currentLookType == 5}" v-if="currentLookType == 5">
      <dd class="files-box resouce-list asdasdsa">
        <div v-for="item in resouceFill" :key="item.id" class="file-list">
          <img :src="defaultIcon['img'+item.resExt]" alt="">
          <div class="btn-box">
            <p>{{item.resName}}</p>
            <div>
              <a @click.prevent="previewFile(item)" href="javascript:;">查看</a>
            </div>
          </div>
        </div>
      </dd>
    </dl>
    <!--账套任务-->
    <div v-if="currentLookType == 6 && accountModeData.length" class="business-list">
      <div v-for="item in accountModeData" :key="item.caseId" class="itemList">
        <div class="case_name">
          <p>{{item.caseName}}</p>
        </div>
        <div class="btn_box">
          <div class="add" @click="addCoverAccount(item)" v-html="item.companyId ? '已新增' : '新增账套'"
               :class="{active:item.companyId}"></div>
          <div class="join" @click="enterClass($event,item)" v-html="item.companyId ? '进入账套' : '请先新增账套'"
               :class="{active:!item.companyId}">进入实训
          </div>
        </div>
      </div>
    </div>
    <!--python 编辑区-->
    <edit-code v-if="currentLookType == 7 && isShowPython == 'py'"></edit-code>
    <!--  预览文件-->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false"
                    v-if="isShowPrevFile"></show-prev-file>
    <!-- 企业信息 -->
    <el-dialog title="新增企业信息" :visible.sync="addNewqy" width="930px" :close-on-click-modal="false">
      <newAdd v-if="addNewqy" :addFormData=addFormData></newAdd>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button class="el-button--small" @click="addNewqy=false">取 消</el-button>
        <el-button class="Determine el-button--small" type="primary" @click="sure(currentLookType)">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增账套-->
    <el-dialog title="新增账套" :visible.sync="accountMode" width="930px" :close-on-click-modal="false">
      <addAccount v-if="accountMode" :accountDialogData=accountDialogData></addAccount>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
      <el-button class="el-button--small" @click="accountMode=false">取 消</el-button>
      <el-button class="Determine el-button--small" type="primary" @click="sure(currentLookType)">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  mapState
} from 'vuex'
import {
  _debounce,
  formatDate
} from '@/common/js/utils'
import {
  getTaskDetail,
  taskStudy,
  queryCurrentStudy,
  xiazaifilie,
  savecompany,
  classtaskidList,
  getAccountBusiness,
  newAddAccount
} from '@/api/teamAdmin'
import customProtocolCheck from 'custom-protocol-check'
import showPrevFile from '@/components/showPrevFile/index'
import md5 from 'js-md5'
import newAdd from './components/newAdd'
import addAccount from './components/AddAccount'
import EditCode from '@/components/editCode/index'

export default {
  name: 'TaskDetail',
  components: {
    newAdd,
    EditCode,
    showPrevFile,
    addAccount
  },
  data() {
    return {
      defaultIcon: {
        srcexcel: require('@/common/images/excel.png'),
        srcxlsx: require('@/common/images/excel.png'),
        srcxls: require('@/common/images/excel.png'),
        srcmp3: require('@/common/images/mp3_icon.png'),
        srcpic: require('@/common/images/img_icon.png'),
        srcjpeg: require('@/common/images/img_icon.png'),
        srcpng: require('@/common/images/img_icon.png'),
        srcjpg: require('@/common/images/img_icon.png'),
        srcgif: require('@/common/images/img_icon.png'),
        srcpdf: require('@/common/images/pdf_icon.png'),
        srcppt: require('@/common/images/ppt_icon.png'),
        srcpptx: require('@/common/images/ppt_icon.png'),
        srctxt: require('@/common/images/txt_icon.png'),
        srcvideo: require('@/common/images/video_icon.png'),
        srcmp4: require('@/common/images/video_icon.png'),
        srcdocx: require('@/common/images/word_icon.png'),
        srcdoc: require('@/common/images/word_icon.png'),
        srcexe: require('@/common/images/exe.png'),
        srcsql: require('@/common/images/sql.png'),
        srcautowork: require('@/common/images/autowork.png'),
        imgdoc: require('../images/word.png'),
        imgdocx: require('../images/word.png'),
        imgmp4: require('../images/mp4.png'),
        imgmp3: require('../images/mp3.png'),
        imgvideo: require('../images/mp4.png'),
        imgtxt: require('../images/txt.png'),
        imgpptx: require('../images/ppt.png'),
        imgppt: require('../images/ppt.png'),
        imgpdf: require('../images/pdf.png'),
        imggif: require('../images/gif.png'),
        imgpic: require('../images/jpg.png'),
        imgjpeg: require('../images/jpg.png'),
        imgjpg: require('../images/jpg.png'),
        imgpng: require('../images/jpg.png'),
        imgexcel: require('../images/excel.png'),
        imgxls: require('../images/excel.png'),
        imgxlsx: require('../images/excel.png'),
        imgexe: require('@/common/images/exe.png'),
        imgsql: require('@/common/images/sql.png'),
        imgautowork: require('@/common/images/autowork.png')
      },
      searchStudy: '', // 输入搜索学生姓名或团队姓名
      titleText: '', // 不同的任务类型展示不同的标题
      studentData: [], // 学生数据
      currentTaskId: this.$route.query.id, // 当前任务id
      currentLookType: this.$route.query.currentType, // 当前查看的是那种类型
      rpaCode: this.$route.query.rpaCode, // 判断是那种实操类型
      isShowPython: this.$route.query.editPy, // 是否显示编辑Python组件
      currentTaskName: '', // 当前任务名字
      currentTaskIntroduce: '', // 当前任务描述
      currentTaskFile: [], // 当前任务文件
      resouceFill: [], // 知识点任务时，显示资源文件
      currentLook: 0, // 团队任务和个人任务时，默认查看第一个学生或者团队
      defaultLookType: 0, // 团队任务和个人任务时，默认查看的文件类型
      fileData: [], // 团队任务和个人任务时，查看文件类型的数据
      isShowPrevFile: false, // 是否显示预览弹窗
      previewData: {}, // 预览的图片路径
      accountCaseList: [], // 建账企业列表
      accountModeData: [], // 账套企业列表
      accountMode: false, // 新增套账弹窗
      addNewqy: false, // 显示建账弹窗
      addFormData: {}, // 新增企业的信息，这个是给弹窗用的
      accountDialogData: {}, // 新增套账弹窗需要的数据
      nowqy: {}, // 这个建账时使用
      setAccoountUse: {}, // 套账使用
      loadObj: {} // 遮罩对象
    }
  },
  computed: {
    ...mapState({
      boxHeight: state => state.windowHeight - 170 // 这里的220指的是头部高度70+二级导航高度50+内容去的上下margin40
    })
  },
  mounted() {
    this.ajaxTaskDetail(this.currentTaskId)
    if (this.currentLookType == 1 || this.currentLookType == 2) {
      this.ajaxTaskStudy()
      if (this.currentLookType == 1) {
        this.titleText = '提交学生'
      }
      if (this.currentLookType == 2) {
        this.titleText = '提交团队'
      }
    }
    if (this.currentLookType == 6) {
      this.getAccountMode()
    }
    this.getAccountData()
  },
  watch: {
    searchStudy(newVal, oldVal) {
      const _this = this
      _this.currentLook = 0
      this.searchStudent(newVal, _this)
    }
  },
  methods: {
    // 条转回列表页
    gotoHome() {
      this.$router.push('/jxgl/index')
    },
    // 模糊搜索学生
    searchStudent: _debounce((val, that) => {
      that.ajaxTaskStudy()
    }, 400),
    //  加载任务数据
    ajaxTaskDetail(id) {
      const _this = this
      const postData = '?classTaskId=' + id
      getTaskDetail(postData).then(res => {
        if (res.code == 0) {
          this.currentTaskName = res.result.taskName
          this.currentTaskIntroduce = res.result.introduce
          if (_this.$route.query.currentType == 5) {
            this.currentTaskFile = res.result.fileRes
            this.resouceFill = res.result.knowledgeFileRes
          } else {
            this.currentTaskFile = res.result.fileRes
          }
          if (res.result.personalizeFileRes) {
            this.currentTaskFile = res.result.personalizeFileRes.concat(this.currentTaskFile)
          }
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 获取账套任务中企业列表
    getAccountMode() {
      const _this = this
      const postData = '?classTaskId=' + this.currentTaskId
      getAccountBusiness(postData).then(res => {
        if (res.code == 0) {
          _this.accountModeData = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 获取当前任务回答的学生
    ajaxTaskStudy() {
      const _this = this
      const postData = '?classTaskId=' + this.currentTaskId + '&keyWrods=' + this.searchStudy
      taskStudy(postData).then(res => {
        if (res.code == 0) {
          _this.studentData = res.result
          if (_this.studentData.length == 0) {
            return false
          } else {
            const firstStudyId = _this.studentData[0].id
            _this.ajaxCurrentResult(firstStudyId)
          }
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 查看对应学生提交结果
    studySubmit(obj, i) {
      const currentStudyId = obj.id
      if (this.currentLook == i) {
        return false
      } else {
        this.currentLook = i
      }
      this.ajaxCurrentResult(currentStudyId)
    },
    // 根据学生id请求当前学生提交的结果
    ajaxCurrentResult(id) {
      const _this = this
      const postData = '?userTaskRecordId=' + id
      queryCurrentStudy(postData).then(res => {
        if (res.code == 0) {
          _this.fileData = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
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
    // 切换查看文件类型
    switchLookStype(i) {
      this.defaultLookType = i
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
    // 企业建账
    addNewqyContent(item) {
      if (item.companyId) {
        return false
      }
      this.addFormData = item
      this.nowqy = item
      this.nowqy.userType = 1
      this.addNewqy = true
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
    // 进入账簿
    async enterClass(e, item) {
      if (!item.companyId) {
        return false
      }
      const _userId = localStorage.getItem('userId')
      const _userName = localStorage.getItem('userName')
      const currentTime = Date.parse(new Date()) / 1000
      let _linkUrl = ''
      let _url = ''
      if (this.currentLookType == 6) {
        _url = localStorage.getItem('jumpAddress') + '?qyid=' + item.companyId
        /* 路由跳转时使用 */
        this.$router.push({
          path: '/TrainIframe',
          query: {
            url: _url,
            id: this.currentTaskId,
            currentType: this.currentLookType,
            rpaCode: this.rpaCode,
            caseId: item.caseId,
            trainState: item.setAccount
          }
        })
      } else {
        debugger
        _linkUrl = item.jumpAddress
        const _id = _userId + '14599166648729e47f954a63c76524117769be89d5455' + currentTime
        const _md5 = md5(_id)
        const _schoolid = item.schoolId
        if (this.rpaCode == 'RISK_TAX') {
          _url = _linkUrl + '/edurisk?schoolId=' + _schoolid + '&userId=' + _userId + '&userName=' + _userName + '&companyId=' + item.companyId + '&version=1&appId=1459916664872&token=' + _md5 + '&time=' + currentTime
        }
        if (this.rpaCode == 'RISK_BD') {
          _url = _linkUrl + '/edufinancial?schoolId=' + _schoolid + '&userId=' + _userId + '&userName=' + _userName + '&companyId=' + item.companyId + '&version=1&appId=1459916664872&token=' + _md5 + '&time=' + currentTime
        }
        const queryData = encodeURIComponent(_url)
        window.open('/accountExercise?queryData=' + queryData, '_blank')
      }
    },
    // 确定建账
    sure(num) {
      const _this = this
      if (num == 6) {
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
      } else {
        savecompany(this.nowqy).then(res => {
          if (res.code == 0) {
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
      }
    },
    // 获取企业列表
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
    // RPA进入管理端
    enterAdmin(item) {
      debugger
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
      customProtocolCheck(
        _url,
        () => {
          fetch(
            'http://edulicense.autoworkrpa.com//api/rpa/version/v1/queryNewVersion?type=1&currentVersion=1.0.0'
          )
            .then((response) => response.json())
            .then((data) => window.open(data.result.packageDownloadUrl))
        },
        () => {
          // 协议成功拉起无需处理
        },
        1000
      )
      // window.open(_src + '?companyId=' + item.companyId + '&caiZhiToken=' + manageToken + '&time=' + currentTime)
      const _this = this
      this.loadObj = this.$loading({
        text: '正在唤起本地应用~~~'
      })
      setTimeout(function() {
        _this.loadObj.close()
      }, 4000)
    }
  }
}
</script>

<style scoped lang="scss">
  .exercise-box {
    margin: 20px 34px 0 20px;
    padding: 0 30px 34px;
    background: #fff;
    /*修改建账弹窗*/
    /deep/.el-dialog{
      border-radius:4px;
      /deep/.el-dialog__header{
        padding:15px 30px;
      }
      /deep/.el-dialog__body{
        padding:15px 30px;
      }
      /deep/.el-cascader{
        width: 100%;
      }
    }
    .return-btn {
      height: 30px;
      outline: none;
      cursor: pointer;
      border: 0;
      white-space: nowrap;
      background: #36CEA9;
      font-size: 12px;
      padding: 0 10px;
      border-radius: 3px;
      color: #fff;
      margin: 20px 0 0;

      &:hover {
        background: $color-theme-hover;
      }
    }

    .exam-title {
      padding: 22px 0 10px;
      border-bottom: 1px solid #D9D9D9;
      font-size: 18px;
      color: #333333;
      font-weight: bold;
      line-height: 28px;
      padding-left: 20px;
    }

    .dl-list {
      margin-top: 30px;
      color: #333333;
      border: 1px solid #dedede;
      position: relative;
      padding-top: 10px;

      dt {
        font-size: 16px;
        line-height: 22px;
        font-weight: bold;
        position: absolute;
        top: -12px;
        left: 40px;
        background: #fff;
        padding: 0 10px;

        &.submit-study {
          font-size: 20px;
        }
      }

      &.know-task {
        dd {
          &.files-box {
            .file-list {
              width: 40%;
              float: none;
              margin: 0 auto 20px;

              &:nth-child(4n) {
                margin: 0 auto;
              }
            }
          }
        }
      }

      dd {
        .describe-text {
          font-size: 14px;
          line-height: 24px;
          padding: 20px;

          &.no-data-tips {
            text-align: center;
          }
        }

        &.files-box {
          clear: both;
          overflow: hidden;
          margin-top: 20px;
          padding-right: 20px;

          .no-data-tips {
            text-align: center;
            font-size: 14px;
            padding: 10px 0 20px;

            i {
              font-size: 18px;
              color: #f28e23;
              margin-right: 10px;
              vertical-align: baseline;
            }
          }

          .file-list {
            width: calc(25% - 20px);
            min-width: 300px;
            float: left;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            margin: 0 0 20px 20px;
            display: flex;
            border: 1px solid #EBEEF5;
            padding: 12px;
            border-radius: 4px;
            transition: all 0.3s;

            &:hover {
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }

            &:nth-child(4n) {
              margin-right: 0;
            }

            img,.iconImg {
              width: 100px;
              height: 80px;
            }
            .iconImg{
              text-align: center;
              line-height: 80px;
              font-size: 48px;
              color: $color-theme;
              background: #eafffa;
            }
            .btn-box {
              flex: 1;
              position: relative;
              margin-left: 14px;

              p {
                font-size: 14px;
                line-height: 20px;
                max-height: 40px;
                overflow: hidden;
                word-break: break-all;
              }

              div {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;

                a {
                  display: inline-block;
                  width: 60px;
                  height: 24px;
                  line-height: 24px;
                  text-align: center;
                  background: $color-theme;
                  margin-right: 10px;
                  color: #fff;
                  border-radius: 3px;
                  font-size: 12px;
                  cursor: pointer;

                  &:hover {
                    background: $color-theme-hover;
                  }
                }
              }
            }
          }

          .resouce-list {
            border-top: 1px solid #ededed;
          }
        }

        &.look-study-submit {
          display: flex;
          height: 336px;
          color: #333333;
          margin-top: 20px;

          .student-search {
            height: 336px;
            border: 1px solid #D9D9D9;
            border-left: 0;
            border-bottom: 0;

            .condition-search {
              font-size: 12px;
              height: 38px;
              border-bottom: 1px solid #D9D9D9;
              margin: 0;
              padding: 0 20px;
              width: 100%;
              position: relative;

              input {
                width: 100%;
                border: 0;
                outline: none;
                height: 100%;
              }

              i {
                position: absolute;
                right: 10px;
                color: #666;
                top: 10px;
                cursor: pointer;
              }
            }
          }

          .student-box {
            width: 220px;
            height: 300px;

            .student-list {
              font-size: 14px;
              line-height: 40px;
              padding: 0 20px;
              cursor: pointer;

              &.no-data {
                cursor: default;

                &:hover {
                  background: #fff;
                }
              }

              &.active {
                background: rgba(54, 206, 169, 0.1);
              }

              &:hover {
                background: rgba(54, 206, 169, 0.1);
              }
            }
          }

          .echo-cont {
            flex: 1;
            margin-left: 16px;
            border: 1px solid #D9D9D9;
            border-right: 0;
            border-bottom: 0;
            display: flex;

            .switch-box {
              width: 180px;
              border-right: 1px solid #D9D9D9;
              align-items: center;
              display: -webkit-flex;
              /* Safari */
              display: flex;
              flex-flow: column nowrap;

              button {
                width: 100px;
                height: 36px;
                border: 0;
                border-radius: 3px;
                background: $color-theme;
                color: #fff;
                font-size: 14px;
                outline: none;
                cursor: pointer;
                margin-top: 30px;

                &.active {
                  background: #0f7d62;

                  &:hover {
                    background: #0f7d62;
                  }
                }

                &:hover {
                  background: $color-theme-hover;
                }
              }
            }

            .show-box {
              flex: 1;
              padding: 20px;
              overflow: auto;

              .no-data {
                font-size: 14px;
                color: #666;
              }

              .text-spread {
                line-height: 20px;
                font-size: 14px;
                color: #666;
                word-break: break-all;
              }

              .pic-spread {
                width: 100%;

                li {
                  width: 200px;
                  height: 200px;
                  display: inline-block;
                  margin-right: 20px;

                  img {
                    width: 100%;
                    cursor: pointer;
                  }
                }
              }

              .file-spread {
                width: 100%;
                clear: both;
                overflow: hidden;

                li {
                  width: 300px;
                  height: 100px;
                  float: left;
                  margin-right: 20px;
                  display: flex;

                  img {
                    width: 100px;
                    height: 100px;
                  }

                  .btn-box {
                    flex: 1;
                    position: relative;
                    margin-left: 14px;

                    p {
                      font-size: 14px;
                      line-height: 20px;
                      max-height: 40px;
                      overflow: hidden;
                      word-break: break-all;
                    }

                    div {
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      width: 100%;

                      a {
                        display: inline-block;
                        width: 60px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        background: $color-theme;
                        margin-right: 10px;
                        color: #fff;
                        border-radius: 3px;
                        font-size: 12px;
                        cursor: pointer;

                        &:hover {
                          background: $color-theme-hover;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    /*实操任务样式*/
    .business-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: #fff;
      padding: 20px;
      margin-top: 30px;
      border: 1px solid #D9D9D9;
      flex-wrap: wrap;

      .itemList {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        height: 100px;
        max-width: 400px;
        border: 1px solid #EBEEF5;
        padding: 10px;
        border-radius: 6px;
        margin-right: 20px;
        margin-bottom: 14px;
        background: #fff;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }

        .case_name {
          width: 250px;

          p {
            text-align: left;
            margin-top: 0;
            max-height: 80px;
            overflow: hidden;
          }
        }

        .btn_box {
          width: 100px;
          flex-wrap: wrap;
          justify-items: center;
          align-items: center;
          .add {
            width: 100px;
            height: 28px;
            display: inline-block;
            background: #36cea9;
            color: #fff;
            font-size: 14px;
            border-radius: 3px;
            border: 0;
            cursor: pointer;
            text-align: center;
            line-height: 28px;
            margin-bottom:10px;
            &.active {
              background: #ccc;
              cursor: no-drop;
            }
          }

          .join {
            margin-bottom:0;
            @extend .add
          }

          .changeHui {
            background-color: #9c9c9c;
            cursor: no-drop;
          }

          .rpa-btn {
            margin-bottom:0;
            @extend .add
          }
        }
      }
    }
  }
</style>
