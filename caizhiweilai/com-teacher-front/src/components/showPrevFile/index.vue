<template>
  <div class="preview-box">
    <div class="cont" v-if="type == 0">
      <p class="arrow">
        <span @click="changePdfPage(0)" class="turn-page" :class="{noleft: currentPage==1}"></span>
        <span class="page">{{currentPage}} / {{pageCount}}</span>
        <span
          @click="changePdfPage(1)"
          class="turn-page right"
          :class="{noright: currentPage==pageCount}"
        ></span>
        <el-input type="number" min="1" :max="pageCount" v-model="inputPage" placeholder="输入页码"></el-input>
        <el-button class="sure-btn" @click="toPage()">前往</el-button>
        <i class="close-btn el-icon-close" @click="closePreview"></i>
      </p>
      <div class="mask-layer" v-if="showLoadingMask">
        <span style="color: #ccc">加载进度</span>
        <el-progress :percentage="parseInt(loadedRatio * 100)" class="load-progress"></el-progress>
      </div>
      <pdf
        class="pdf-box"
        :src="pdfUrl"
        :page="currentPage"
        @num-pages="pageCount = $event"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded($event)"
        @loaded="loadPdfHandler"
      ></pdf>
    </div>
    <div class="cont contimg" v-if="type == 1">
      <p class="arrow">
        <i class="close-btn el-icon-close" @click="closePreview"></i>
      </p>
      <div class="img-content">
        <img class="prev-img" :src="previewData.imgUrl" alt />
      </div>
    </div>
    <div class="cont" v-if="type == 2">
      <p class="arrow">
        <i class="close-btn el-icon-close" @click="closePreview"></i>
      </p>
      <div id="xgplayer"></div>
    </div>
    <div class="cont" v-if="type == 3">
      <p class="arrow">
        <i class="close-btn el-icon-close" @click="closePreview"></i>
      </p>
      <audio class="prev-mp3" controls :src="previewData.imgUrl" alt>
        <source :src="previewData.imgUrl" type="video/mp3" />
      </audio>
    </div>
    <div class="cont" v-if="type == undefined">
      <p class="arrow">
        <i class="close-btn el-icon-close" @click="closePreview"></i>
      </p>
      <p style="text-align: center">数据出错了</p>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
import Player from 'xgplayer'

export default {
  name: 'previewDialog',
  props: {
    previewData: {
      type: Object
    }
  },
  components: {
    pdf
  },
  data() {
    return {
      currentPage: 0, // pdf文件页码
      inputPage: null, // 跳转页码
      pageCount: 0, // pdf文件总页数
      loadedRatio: 0, // 加载进度
      curPageNum: 0,
      showLoadingMask: false, // 显示加载遮罩
      type: undefined, // 预览类型
      player: null, // 视频播放
      pdfUrl: '' // pdf
    }
  },
  created() {},
  mounted() {
    document.documentElement.style.overflowY = 'hidden'
    switch (this.previewData.resExt) {
      case 'ppt':
      case 'pptx':
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'txt':
      case 'pdf':
        this.type = 0
        // TODO: 处理特殊字体不能展示的问题
        // this.pdfUrl = pdf.createLoadingTask({
        //   url: this.previewData.imgUrl,
        //   CMapReaderFactory
        // })
        this.pdfUrl = this.previewData.imgUrl
        break
      case 'png':
      case 'jpeg':
      case 'gif':
      case 'jpg':
        this.type = 1
        break
      case 'mp4':
      case 'rmvb':
      case 'avi':
        this.type = 2
        this.$nextTick(() => {
          this.player = new Player({
            id: 'xgplayer',
            width: '',
            height: '90%',
            closeVideoClick: true,
            poster: '', // 封面图
            url: this.previewData.imgUrl, // 视频地址
            lang: 'zh-cn', // 国际化
            volume: 1, // 默认音量
            cssFullscreen: false, // 网页样式全屏
            autoplay: false, // 自动播放
            videoInit: true, // 初始化显示视频首帧动画
            playbackRate: [0.5, 0.75, 1, 1.5, 2],
            defaultPlaybackRate: 1
          })
        })
        break
      case 'mp3':
        this.type = 3
        break
      default:
        break
    }
  },
  destroyed() {
    document.documentElement.style.overflowY = 'auto'
  },
  watch: {
    loadedRatio(newVal) {
      if (newVal == 1) {
        this.showLoadingMask = false
      } else {
        this.showLoadingMask = true
      }
    }
  },
  methods: {
    closePreview() {
      this.$emit('closePreview')
    },
    loadPdfHandler(e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    pageLoaded(e) {
      this.curPageNum = e
    },
    changePdfPage(val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    toPage() {
      if (this.inputPage > 0 && this.inputPage <= this.pageCount) {
        this.currentPage = Number(this.inputPage)
      }
    }
  }
}
</script>

<style lang="scss">
  .preview-box {
    @include maskLayer($z: 30002);
    .cont {
      width: 95%;
      height: 95%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      .mask-layer {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        padding: 0 30px;
        z-index: 1;
        display: flex;
        align-items: center;
        .load-progress {
          flex: 1;
          margin-left: 20px;
        }
      }
      .arrow {
        width: 100%;
        height: 60px;
        color: #fff;
        font-size: 14px;
        background: #36CEA9;
        display: flex;
        justify-content: center;
        align-items: center;
        .turn-page {
          display: inline-block;
          width: 40px;
          height: 34px;
          padding: 0 20px 17px;
          background: url('./images/left-icon.png') no-repeat;
          margin: 0 17px;
          &.noleft {
            background: url('./images/no-left-icon.png') no-repeat;
          }
          &.right {
            background: url('./images/right-icon.png') no-repeat;
            &.noright {
              background: url('./images/no-right-icon.png') no-repeat;
            }
          }
        }
        .el-input {
          width: 88px;
          height: 34px;
          margin-left: 10px;
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
              -webkit-appearance: none;
          }
          input[type="number"]{
              -moz-appearance: textfield;
          }
          .el-input__inner {
            height: 34px;
            line-height: 34px;
            padding: 0 15px;
          }
        }
        .sure-btn {
          padding: 9px 12px;
          margin-left: 15px;;
        }
        .page {
          line-height: 60px;
          letter-spacing: 1px;
        }
        .close-btn {
          width: 26px;
          height: 26px;
          position: absolute;
          right: 17px;
          top: 17px;
          font-size: 20px;
          color: #fff;
          line-height: 26px;
          text-align: center;
          cursor: pointer;
          z-index: 2;
        }
      }
      .pdf-box {
        height: calc(100% - 60px);
        overflow: auto;
      }
      .img-content {
        height: calc(100% - 60px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .prev-img {
        max-width: 100%;
        max-height: 100%;
      }
      .prev-mp3 {
        display: block;
        margin: 200px auto 0;
      }
    }
  }
</style>
