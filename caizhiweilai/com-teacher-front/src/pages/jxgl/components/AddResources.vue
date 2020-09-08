<template>
  <div class="resources-dialog">
    <div class="cont">
      <p class="title">个性化资源 <i class="iconfont" @click="closeBusinessDialog">&#xe60e;</i></p>
      <div class="add-btn">
        <el-upload class="upload-demo" action="#"
                   accept=".ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix"
                   :show-file-list="false"
                   :http-request="updataPic"
                   multiple
                   :before-upload="uploadBefore">
          <el-button size="small" type="primary" ref="sjsc" style="line-height:0">上传</el-button>
        </el-upload>
      </div>
      <el-table :data="resouceList" class="busniess-table" border>
        <el-table-column prop="name" label="资源名称" min-width="70%">
        </el-table-column>
        <el-table-column label="操作" min-width="30%">
          <template slot-scope="scope">
            <div class="opera-box">
              <span @click="previewFile(scope.row)"
                    v-if="!(scope.row.resExt == 'autowork' || scope.row.resExt == 'sql'  || scope.row.resExt == 'py'  || scope.row.resExt == 'pbix' || scope.row.resExt == 'exe')">预览</span>
              <span v-if="path == '教学管理'" @click="setStatu(scope.row,'0')">
                <i class="iconfont" v-html="scope.row.status == 1 ? '&#xe715;' : '&#xe714;'"
                  :class="{active:scope.row.status == 1}"></i>启用
              </span>
              <span v-if="path == '我的教案' && lessonType == 2 && activeState == 1" @click="replacefile(scope.row)">替换</span>
              <!--3指的是管理端不允许下载，不为3的时候允许老师操作-->
              <span v-if="(path == '教学管理') && ((scope.row.type == 1 && scope.row.isAllow != 3) || scope.row.type == 2)" @click="setStatu(scope.row,'1')">
                <i class="iconfont" v-html="scope.row.isAllow == 0 ? '&#xe715;' : '&#xe714;'"
                  :class="{active:scope.row.isAllow == 0}"></i>
                允许下载
              </span>
              <span v-if="path == '我的教案' && lessonType == 2" @click="setStatu(scope.row,'1')">
                <i class="iconfont" v-html="scope.row.isAllow == 0 ? '&#xe715;' : '&#xe714;'"
                  :class="{active:scope.row.isAllow == 0}"></i>
                允许下载
              </span>
              <span @click="delect(scope.row)" v-show="path == '教学管理' && scope.row.type == 2">删除</span>
              <span @click="delect(scope.row)" v-show="path == '我的教案' && scope.row.type == 2 && lessonType == 2">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false"
                    v-if="isShowPrevFile"></show-prev-file>
    <!-- 上传进度条 -->
    <showProgress v-if="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo"
                  @quxiao="progressClose"></showProgress>
  </div>
</template>

<script>
import {
  adddFile,
  lessonTaskUpdateFile,
  lessonTaskReplaceFile,
  wjUp,
  editwjUp,
  delpersonfile,
  lessonTaskDelFile,
  teafile,
  getManResources,
  getTeaResources
} from '@/api/teamAdmin'
import showPrevFile from '@/components/showPrevFile/index'
import showProgress from '@/components/showProgress/index'

export default {
  name: 'addResources',

  data() {
    return {
      resouceList: [], // 资源列表
      fileInfo: [],
      percentageNum: 0,
      isShowPrevFile: false, // 预览文件遮罩
      previewData: {}, // 预览参数
      progressIsshow: false, // 进度条显示
      saas: localStorage.getItem('saas'), // 是否有网
      thwj: '',
      thwjItem: {}
    }
  },
  props: {
    commonTaskId: String, // 查看的任务id
    resourceData: String, // 任务数据
    path: String, // 引入的组件
    lessonType: Number, // 教案类型
    activeState: Number // 学校是否激活
  },
  components: {
    showPrevFile,
    showProgress
  },
  mounted() {
    // 刷新资源文件
    this.refreshResouce()
  },
  methods: {
    // 刷新资源弹窗
    refreshResouce() {
      const _this = this
      if (this.path == '教学管理') {
        getManResources({
          classTaskId: this.resourceData
        }).then(res => {
          if (res.code == 0) {
            _this.resouceList = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      } else if (this.path == '我的教案') {
        getTeaResources({
          lessonTaskId: this.resourceData
        }).then(res => {
          if (res.code == 0) {
            _this.resouceList = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 关闭弹窗
    closeBusinessDialog() {
      this.$emit('closeBusinessDialog')
    },
    // 资源上传之前钩子
    uploadBefore(file) {
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
      const type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix'
      const appointType = '.exe,.autowork,.sql'.indexOf(ext) < 0
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确的格式类型')
        return !isExt
      }
      // 文件大小限制
      const specialType = '.mp4,.rmvb,.avi'
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

      // 替换
      if (this.thwj == 2) {
        editwjUp({
          resName: e.file.name,
          downloadUrl: res,
          resType: wjType,
          resExt: wjType,
          resSize: e.file.size,
          creator: this.userId,
          id: this.thwjItem.id
        }).then(res => {
          lessonTaskReplaceFile({
            lessonTaskId: this.commonTaskId,
            oldFileId: this.thwjItem.id,
            newFileId: res.result,
            type: 3
          }).then(res => {
            if (res.code === '0') {
              this.thwj = 1
              // 请求资源文件
              _this.refreshResouce()
            } else {
              this.$message.warning(res.message)
            }
          })
        })
      } else {
        wjUp({
          resName: e.file.name,
          downloadUrl: res,
          resType: wjType,
          resExt: wjType,
          resSize: e.file.size,
          creator: this.userId
        }).then(res => {
            if (this.path == '教学管理') {
              // 新增资源文件
              adddFile({
                classTaskId: this.commonTaskId,
                resId: res.result
              }).then(res => {
                if (res.code == 0) {
                  // 请求资源文件
                  _this.refreshResouce()
                } else {
                  this.$message.warning(res.message)
                }
              })
            } else if (this.path == '我的教案') {
              lessonTaskUpdateFile({
                lessonTaskId: this.commonTaskId,
                perFileId: res.result
              }).then(res => {
                if (res.code === '0') {
                  // 请求资源文件
                  _this.refreshResouce()
                } else {
                  this.$message.warning(res.message)
                }
              })
            }
        })
      }
    },
    delect(item) {
      const _this = this
      this.$confirm('删除后学生将无法查看该资源，确认是否删除？', '删除', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.path == '教学管理') {
          delpersonfile({
            classTaskId: this.commonTaskId,
            resId: item.resId
          }).then(res => {
            if (res.code == 0 || res.code == '0') {
              // 请求资源文件
              _this.refreshResouce()
              _this.$message({
                type: 'success',
                message: '删除成功！'
              })
            } else {
              _this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        } else if (this.path == '我的教案') {
          lessonTaskDelFile({
            lessonTaskId: this.commonTaskId,
            perFileId: item.id
          }).then(res => {
            if (res.code == 0 || res.code == '0') {
              // 请求资源文件
              _this.refreshResouce()
              _this.$message({
                type: 'success',
                message: '删除成功！'
              })
            } else {
              _this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        }
      }).catch(() => {
      })
    },
    setStatu(item, index) {
      const _this = this
      const statu = item.status == 1 ? '0' : '1'
      const isAllow = item.isAllow == 1 ? '0' : '1'
      let postData
      if (this.path == '教学管理') {
        postData = {
          classTaskId: this.commonTaskId,
          resId: item.resId
        }
      } else if (this.path == '我的教案') {
        postData = {
          lessonTaskId: this.commonTaskId,
          perFileId: item.id
        }
      }
      if (index == 0) {
        postData.status = statu
      } else {
        postData.isAllow = isAllow
      }
      if (this.path == '教学管理') {
        // 禁用
        teafile(postData).then(res => {
          if (res.code == 0 || res.code == '0') {
            if (index == 0) {
              _this.$message({
                type: 'success',
                message: item.status == 1 ? '已禁用！' : '已启用！'
              })
            }
            if (index == 1) {
              _this.$message({
                type: 'success',
                message: item.isAllow == 1 ? '已允许！' : '已禁止！'
              })
            }
            // 请求资源文件
            _this.refreshResouce()
          } else {
            _this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      } else if (this.path == '我的教案') {
        lessonTaskUpdateFile(postData).then(res => {
          if (res.code === '0') {
            _this.$message({
              type: 'success',
              message: item.isAllow == 1 ? '已允许！' : '已禁止！'
            })
            // 请求资源文件
            _this.refreshResouce()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
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
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
      this.percentageNum = 0
    },
    // 替换文件
    replacefile(item) {
      this.thwj = 2
      this.thwjItem = item
      this.$refs.sjsc.$el.click()
    }
  }
}
</script>

<style scoped lang="scss">
  .resources-dialog {
    overflow-y: auto;
    @include maskLayer($z: 1002);

    .cont {
      width: 980px;
      min-height: 320px;
      background: #fff;
      padding-bottom: 30px;
      position: relative;
      border-radius: 4px;
      @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));

      .title {
        line-height: 44px;
        border: 1px solid #F3F4F5;
        padding: 0 20px;
        color: #444444;
        font-size: 16px;
        position: relative;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid #dedede;

        i {
          position: absolute;
          right: 20px;
          top: 0;
          padding: 0 10px;
          color: #929292;
          font-size: 18px;
          cursor: pointer;
        }
      }

      .add-btn {
        text-align: right;
        margin-top: 10px;

        button {
          width: 80px;
          height: 30px;
          font-size: 12px;
          color: #fff;
          background: $color-theme;
          border: 0;
          outline: none;
          margin-right: 30px;
          display: inline-block;
          border-radius: 3px;
          cursor: pointer;
          line-height: 30px;
        }
      }

      .busniess-table {
        width: calc(100% - 60px);
        margin: 10px 30px 0;
        // max-height: 500px;
        max-height: 510px;
        overflow-y: auto;

        .opera-box {
          display: flex;
          justify-content: center;

          span {
            cursor: pointer;
            color: $color-theme;
            text-align: center;
            margin: 0 4px;

            i {
              color: #999;
              font-size: 14px;

              &.active {
                color: $color-theme;
              }
            }
          }
        }
      }
    }
  }
</style>
