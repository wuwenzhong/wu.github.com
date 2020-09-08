<template>
  <div class="issueContent">
    <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="searckKey" @input="searchContent"
              style="width:35%"></el-input>
    <div class="resourceContent">
      <div class="resourceItem" v-for="(item,index) in resourceArr" :key="index">
        <div class="ynDel myFile" v-show="item.resType==1">我的</div>
        <div class="ynDel" v-show="item.resType!=1">系统</div>
        <div class="resourceLeft">
          <img src="../../../common/images/visio.png" v-if="item.resPubType == 'mp4' || item.resPubType == 'mkv'"/>
          <img src="../../../common/images/EXCELN.png"
               v-else-if="item.resPubType == 'xlsx' || item.resPubType == 'xls'"/>
          <img src="../../../common/images/JPG.jpg"
               v-else-if="item.resPubType == 'jpg' || item.resPubType == 'gif' || item.resPubType == 'jpeg' || item.resPubType == 'png' || item.resPubType == 'svg' || item.resPubType == 'bmp'"/>
          <img src="../../../common/images/PPT.png"
               v-else-if="item.resPubType == 'ppt' || item.resPubType == 'pptx' || item.resPubType == 'potm' || item.resPubType == 'potx'"/>
          <img src="../../../common/images/mp3.png" v-else-if="item.resPubType == 'mp3' || item.resPubType == 'wma'"/>
          <img src="../../../common/images/txt.png" v-else-if="item.resPubType == 'txt' || item.resPubType == 'text'"/>
          <img src="../../../common/images/autowork.png"
               v-else-if="item.resPubType == 'autowork' || item.resPubType == 'autowork'"/>
          <img src="../../../common/images/sql.png" v-else-if="item.resPubType == 'sql' || item.resPubType == 'sql'"/>
          <img src="../../../common/images/exe.png" v-else-if="item.resPubType == 'exe' || item.resPubType == 'exe'"/>
          <img src="../../../common/images/yasuo.png" v-else-if="item.resPubType == 'rar' || item.resPubType == 'zip'"/>
          <img src="../../../common/images/project.png" v-else-if="item.resPubType == 'pdf'"/>
          <div class="icon-py" v-else-if="item.resPubType == 'py'">
            <i class="iconfont ">&#xe703;</i>
          </div>
          <div class="icon-pbix" v-else-if="item.resPubType == 'pbix'">
            <i class="iconfont">&#xe601;</i>
          </div>
          <img src="../../../common/images/WORD.png" v-else-if="item.resPubType == 'docx' || item.resPubType == 'doc'"/>
          <img src="../../../common/images/qita.png" v-else/>
        </div>
        <div class="resourceRight">
          <div class="title" :title="item.resName">{{item.resName}}</div>
          <div class="preNummber">
            预览次数：{{item.preNum}}次
            <span></span>
            <span v-show="item.resType==1">下载次数：{{item.downloadNum}}次</span>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="clickPreview(item)"
                       v-if="!(item.resExt == 'autowork' || item.resExt == 'py' || item.resExt == 'pbix' || item.resExt == 'sql' || item.resExt == 'exe')">
              查看
            </el-button>
            <el-button type="primary" size="mini" @click="downFile(item)" :disabled="item.sendStatus=='1'">下发
            </el-button>
            <el-button type="primary" size="mini" @click="recover(item)" :disabled="item.sendStatus=='0'">收回</el-button>
            <el-button type="primary" size="mini" @click="delFile(item)" v-show="item.resType==1">删除</el-button>
          </div>
        </div>
      </div>
      <div v-show="resourceArr.length==0" class="zwFile">暂无资源</div>
    </div>
    <!-- 分页 -->
    <pagination :total="pageTotal" @pagination="monitorPagin" v-if="pageTotal>8" :limit="tableSize"
                :page="tablePage"></pagination>
    <span slot="footer" class="dialog-footer" style="display:flex;justify-content: center;">
    <el-button @click="cancel" style="margin-right:20px">关 闭</el-button>
    <el-upload class="upload-demo" action="#"
               accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .txt, .mp4, .rmvb, .jpg, .jpeg, .gif, .png, .avi, .pdf, .mp3,.sql,.exe,.autowork,.py,.pbix"
               :show-file-list="false" :http-request="updataPic" :before-upload="uploadBefore">
      <el-button type="primary" ref="sjsc">本地上传</el-button>
    </el-upload>
  </span>

    <!--  预览文件图片-->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false"
                    v-if="isShowPrevFile"></show-prev-file>
    <!-- 上传进度条 -->
    <showProgress v-if="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo"
                  @quxiao="progressClose"></showProgress>
  </div>
</template>

<script>
/* eslint-disable */
import {
  wjUp,
  newResource,
  saveres,
  conditionteach,
  sendUpdate,
  receiveUpdate,
  delIds,
  preupdate
} from '@/api/teamAdmin'
import pagination from '@/components/pagination/indexstu'
import showPrevFile from '@/components/showPrevFile/index'
import showProgress from '@/components/showProgress/index'

export default {
  components: {
    pagination,
    showPrevFile,
    showProgress
  },
  data() {
    return {
      pageTotal: 0, // 总共多少条
      tablePage: 1,
      isShowPrevFile: false, // 是否显示预览弹窗
      tableSize: 8,
      searckKey: '',
      previewData: {}, // 预览参数
      resourceArr: [],
      progressIsshow: false,
      fileInfo: [],
      percentageNum: 0
    }
  },
  mounted() {
    this.init('1', '8', '')
  },
  methods: {
    init(page, size, keyword) {
      conditionteach({
        schoolId: localStorage.getItem('customerId'),
        courseId: localStorage.getItem('courseId'),
        page: page,
        size: size,
        creator: localStorage.getItem('userId'),
        resName: keyword
      }).then(res => {
        if (res.code == '0') {
          this.resourceArr = res.result.data
          this.pageTotal = parseInt(res.result.total)
          if (res.result.data.length == 0 && parseInt(page) > 1) {
            this.init(parseInt(page) - 1, size, keyword)
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 切换分页触发
    monitorPagin(obj) {
      if (obj.limit !== this.tableSize) {
        this.tablePage = 1
        this.tableSize = obj.limit
        this.init(this.tablePage, this.tableSize, this.searckKey)
        return
      }
      this.tableSize = obj.limit
      this.tablePage = obj.page
      this.init(this.tablePage, this.tableSize, this.searckKey)
    },
    // 搜索
    searchContent() {
      this.init('1', '8', this.searckKey)
    },
    cancel() {
      this.$emit('issueback')
    },
    // 资源上传之前钩子
    uploadBefore(file) {
      // 清空搜索框
      debugger
      this.searckKey = ''
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ?
        name.substr(name.lastIndexOf('.') + 1, name.length) :
        true
      const type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf, .mp3,.exe,.autowork,.sql,.py,.pbix'
      const appointType = '.exe,.autowork,.sql'.indexOf(ext) < 0
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确的格式类型')
        return !isExt
      }
      // 文件大小限制
      const specialType = '.mp4,.rmvb,.avi,.mp3'
      const specialExt = specialType.indexOf(ext) < 0
      const maxSize = file.size / 1024 / 1024 > 100
      const isLtSize = file.size / 1024 / 1024 > 20

      if (maxSize && appointType) {
        this.$message.warning('文件最大不能超过 100MB！')
        return false
      } else if (specialExt && isLtSize && appointType) {
        this.$message.warning('除mp4、rmvb、avi文件外，文件不能超过 20MB！')
        return false
      }
    },
    async updataPic(e) {
      const _this = this
      const wjType = e.file.name.substring(e.file.name.lastIndexOf('.') + 1)
      // 进度条
      const fileItem = {
        name: e.file.name,
        type: wjType,
        allNumber: this.fileInfo.length + 1,
        percentageNum: 0
      }
      this.fileInfo.push(fileItem)
      this.progressIsshow = true
      const res = await this.cos(e, e.file, '', '', this, 'percentageNum', function(cb) {
        fileItem.percentageNum = cb.percent * 100
        _this.percentageNum = cb.percent * 100
      })
      // 资源保存
      wjUp({
        resName: e.file.name,
        downloadUrl: res,
        resType: wjType,
        resExt: wjType,
        resSize: e.file.size,
        creator: localStorage.getItem('userId')
      }).then(res => {
        const fileId = res.result
        if (res.code == 0) {
          // newResource({
          //       resId: res.result,
          //       resName: e.file.name
          //   }).then(res => {
          //       if (res.code == '0') {
          // 课程上传
          saveres({
            courseId: localStorage.getItem('courseId'),
            resIds: fileId.split(','),
            resType: '1',
            creator: localStorage.getItem('userId'),
            schoolId: localStorage.getItem('customerId'),
            refResPubId: ''
          }).then(res => {
            if (res.code == '0') {
              // 成功之后刷新资源列表
              this.searckKey = ''
              // 切换到第一页
              this.init(this.tablePage, this.tableSize, '')
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 打开查看预览弹窗
    clickPreview(obj) {
      console.log(obj)
      // 当前分页的页码和页面个数
      const pageSize = this.tableSize
      const pageNumber = this.tablePage
      preupdate({
        id: obj.id
      }).then(res => {
        if (res.code == '0') {
          // 成功之后刷新资源列表
          this.searckKey = ''
          this.init(pageNumber, pageSize, this.searckKey)
          this.previewData = {
            imgUrl: '',
            resExt: obj.resPubType
          }
          if (this.previewData) {
            this.previewData.imgUrl = obj.converUrl
          } else {
            this.previewData.imgUrl = obj.downloadUrl
          }
          this.isShowPrevFile = true
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 下发
    downFile(item) {
      console.log(item)
      this.$confirm('确定下发此资源吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(async() => {
          // 当前分页的页码和页面个数
          const pageSize = this.tableSize
          const pageNumber = this.tablePage
          sendUpdate({
            id: item.id
          }).then(res => {
            if (res.code == '0') {
              this.$message({
                type: 'success',
                message: '下发成功！'
              })
              this.init(pageNumber, pageSize, this.searckKey)
              // 通知本班人 接受下发文件消息
              const socketJson = {
                type: 'com', // 综合实训平台
                messageType: 'issue', // 下发
                receiverId: localStorage.getItem('classId'), // 接收人id
                sessionType: 'p2c', // p2p p2c p2t people to people  people to class  people team
                content: {
                  classId: localStorage.getItem('classId'),
                  issue: res.result,
                  flag: '下发'
                }
              }
              this.sendWspush(JSON.stringify(socketJson))
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(arr => {
          // this.$message.info('稍后查看')
        })
    },
    // 收回
    recover(item) {
      this.$confirm('确认回收此资源吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(async() => {
          const pageSize = this.tableSize
          const pageNumber = this.tablePage
          receiveUpdate({
            id: item.id
          }).then(res => {
            if (res.code == '0') {
              this.$message({
                type: 'success',
                message: '收回成功！'
              })
              this.init(pageNumber, pageSize, this.searckKey)
              // 通知本班人 接受下发文件消息
              const socketJson = {
                type: 'com', // 综合实训平台
                messageType: 'issue', // 下发
                receiverId: localStorage.getItem('classId'), // 接收人id
                sessionType: 'p2c', // p2p p2c p2t people to people  people to class  people team
                content: {
                  classId: localStorage.getItem('classId'),
                  issue: res.result,
                  name: item.resName,
                  flag: '回收'
                }
              }
              this.sendWspush(JSON.stringify(socketJson))
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(arr => {
          // this.$message.info('稍后查看')
        })
    },
    // 删除
    delFile(item) {
      this.$confirm('删除后不可修复，确认是否删除此资源？', '提示：', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(async() => {
          const pageSize = this.tableSize
          const pageNumber = this.tablePage
          delIds({
            ids: item.id
          }).then(res => {
            if (res.code == '0') {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.init(pageNumber, pageSize, this.searckKey)
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(arr => {
          // this.$message.info('稍后查看')
        })
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
      this.percentageNum = 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .issueContent {
    padding: 0 15px;
  }

  .resourceContent {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    padding: 30px 20px 50px;
    overflow: auto;
    height: 700px;

    .resourceItem {
      width: 48%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px 15px 15px;
      box-shadow: 0 0 9px #888888;
      margin-bottom: 20px;
      position: relative;

      .ynDel {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 30px;
        line-height: 30px;
        background: #c7c7c7;
        text-align: center;
      }

      .myFile {
        background: #ff9d6a;
        color: white;
      }

      .resourceLeft {
        width: 33%;

        img {
          width: 100%;
        }
        .icon-py,.icon-pbix{
          i{
            font-size:72px;
          }
        }
        .icon-pbix {
          i{
            background: #f2c811;
            color: #212121;
            font-size: 60px;
            border-radius: 4px;
            font-size:54px;
            padding:10px;
          }
        }
        .icon-py{
          color: $color-theme;
          text-align: center;
        }
      }

      .resourceRight {
        min-width: 260px;

        .title {
          font-size: 16px;
          font-weight: 500;
          color: #303030;
          margin-bottom: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .preNummber {
          font-size: 14px;
          margin: 20px 0;

          span:first-child {
            display: inline-block;
            width: 10px;
          }
        }
      }
    }

    .zwFile {
      width: 100%;
      font-size: 16px;
      line-height: 30px;
      text-align: center;
    }

    .resourceItem:hover {
      transition: all 0.3s;
      transform: scale(1.04);
      cursor: pointer;
    }
  }
</style>
