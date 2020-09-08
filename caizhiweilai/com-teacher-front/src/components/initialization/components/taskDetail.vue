<template>
  <div class="task-detail-wrapper">
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
              <a v-if="(activeState == 1 || item.isAllow == 0) && lessonType == 2" @click.prevent="downLoad(item)" href="javascript:;">下载</a>
              <a v-if="activeState == 1 && lessonType == 2" @click.prevent="replacefile(item.id, 1)" href="javascript:;">替换</a>
            </div>
          </div>
        </div>
      </dd>
    </dl>
    <!--知识点任务-->
    <dl class="dl-list" :class="{'know-task':currentLookType == 5}" v-if="currentLookType == 5">
      <dd class="files-box resouce-list asdasdsa">
        <div v-for="item in resouceFill" :key="item.id" class="file-list">
          <img :src="defaultIcon['img'+item.resExt]" alt="">
          <div class="btn-box">
            <p>{{item.resName}}</p>
            <div>
              <a @click.prevent="previewFile(item)" href="javascript:;">查看</a>
              <a v-if="activeState == 1" @click.prevent="downLoad(item)" href="javascript:;">下载</a>
              <a v-if="activeState == 1" @click.prevent="replacefile(item.id, 2)" href="javascript:;">替换</a>
            </div>
          </div>
        </div>
      </dd>
    </dl>

    <!-- 替换 -->
    <el-upload
      v-show="false"
      class="upload-demo" action="#"
      accept=".ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix"
      :show-file-list="false"
      :http-request="updataPic"
      multiple
      :before-upload="uploadBefore">
      <el-button size="small" type="primary" ref="sjsc" style="line-height:0">上传</el-button>
    </el-upload>

    <!--  预览文件-->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>

    <!-- 上传进度条 -->
    <showProgress v-if="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>
  </div>
</template>

<script>
import showPrevFile from '@/components/showPrevFile/index'
import showProgress from '@/components/showProgress/index'

import { lessonTaskDetail } from '@/api/initialization.js'
import { xiazaifilie, editwjUp, lessonTaskReplaceFile } from '@/api/teamAdmin'

export default {
  props: {
    currentTaskId: String, // 查看的大纲id
    currentLookType: Number, // 大纲所属实训类型
    lessonType: Number, // 教案类型
    activeState: Number // 学校是否激活
  },
  components: {
    showPrevFile,
    showProgress
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
        imgdoc: require('../../../pages/jxgl/images/word.png'),
        imgdocx: require('../../../pages/jxgl/images/word.png'),
        imgmp4: require('../../../pages/jxgl/images/mp4.png'),
        imgmp3: require('../../../pages/jxgl/images/mp3.png'),
        imgvideo: require('../../../pages/jxgl/images/mp4.png'),
        imgtxt: require('../../../pages/jxgl/images/txt.png'),
        imgpptx: require('../../../pages/jxgl/images/ppt.png'),
        imgppt: require('../../../pages/jxgl/images/ppt.png'),
        imgpdf: require('../../../pages/jxgl/images/pdf.png'),
        imggif: require('../../../pages/jxgl/images/gif.png'),
        imgpic: require('../../../pages/jxgl/images/jpg.png'),
        imgjpeg: require('../../../pages/jxgl/images/jpg.png'),
        imgjpg: require('../../../pages/jxgl/images/jpg.png'),
        imgpng: require('../../../pages/jxgl/images/jpg.png'),
        imgexcel: require('../../../pages/jxgl/images/excel.png'),
        imgxls: require('../../../pages/jxgl/images/excel.png'),
        imgxlsx: require('../../../pages/jxgl/images/excel.png'),
        imgexe: require('@/common/images/exe.png'),
        imgsql: require('@/common/images/sql.png'),
        imgautowork: require('@/common/images/autowork.png')
      },
      customerId: localStorage.getItem('customerId'),
      currentTaskIntroduce: '', // 当前任务描述
      currentTaskFile: [], // 当前任务文件
      resouceFill: [], // 知识点任务时，显示资源文件
      fileInfo: [], // 上传文件信息
      percentageNum: 0, // 上传进度
      isShowPrevFile: false, // 是否显示预览弹窗
      previewData: {}, // 预览的图片路径
      progressIsshow: false, // 进度条显示
      thwj: '', // 替换类型 1 任务资源 2 知识点资源
      thwjId: '' // 旧的资源id
    }
  },
  created() {
    this.ajaxTaskDetail(this.currentTaskId)
  },
  methods: {
    //  加载任务数据
    ajaxTaskDetail(id) {
      lessonTaskDetail({
        lessonTaskId: id
      }).then(res => {
        if (res.code === '0') {
          this.currentTaskIntroduce = res.result.introduce
          if (this.currentLookType == 5) {
            this.resouceFill = res.result.knowledgeFileRes
          }
          // 获取资源列表
          this.currentTaskFile = res.result.fileRes

          if (res.result.personalizeFileRes) {
            this.currentTaskFile = res.result.personalizeFileRes.concat(this.currentTaskFile)
          }
        } else {
          this.$message.warning(res.message)
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
      editwjUp({
        resName: e.file.name,
        downloadUrl: res,
        resType: wjType,
        resExt: wjType,
        resSize: e.file.size,
        creator: this.userId,
        id: this.thwjId
      }).then(res => {
        lessonTaskReplaceFile({
          lessonTaskId: this.currentTaskId,
          oldFileId: this.thwjId,
          newFileId: res.result,
          type: this.thwj
        }).then(res => {
          if (res.code === '0') {
            // 请求资源文件
            this.ajaxTaskDetail(this.currentTaskId)
          } else {
            this.$message.warning(res.message)
          }
        })
      })
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
      this.percentageNum = 0
    },
    // 替换文件
    replacefile(id, type) {
      this.thwj = type
      this.thwjId = id
      this.$refs.sjsc.$el.click()
    }
  }
}
</script>

<style lang="scss">
  .task-detail-wrapper {
    .dl-list {
      margin-top: 20px;
      color: #333333;
      border: 1px solid #dedede;
      position: relative;
      padding-top: 10px;
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
            // width: calc(25% - 20px);
            width: 428px;
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
                  &:last-child {
                    margin-right: 0;
                  }
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
      }
    }
  }
</style>