<template>
  <div class="preview-box">
    <div class="cont" v-if="previewData._type == 0">
      <p class="arrow">
        <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
        {{currentPage}} / {{pageCount}}
        <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">下一页</span>
        <i class="close-btn iconfont" @click="closePreview">&#xe60e;</i>
      </p>
      <div class="mask-layer" v-if="showLoadingMask">
        加载进度
        <el-progress :percentage="loadedRatio" class="load-progress"></el-progress>
      </div>
      <pdf class="pdf-box"
        :src="previewData.imgUrl"
        :page="currentPage"
        @num-pages="pageCount=$event"
        @progress="loadedRatio = $event"
        @page-loaded="currentPage=$event"
        @loaded="loadPdfHandler">
      </pdf>
    </div>
    <div class="cont contImg" v-if="previewData._type == 1">
      <p class="arrow">
        <i class="close-btn iconfont" @click="closePreview">&#xe60e;</i>
      </p>
      <img class="prev-img" :src="previewData.imgUrl" alt="">
    </div>
    <div class="cont" v-if="previewData._type == 2">
      <p class="arrow">
        <i class="close-btn iconfont" @click="closePreview">&#xe60e;</i>
      </p>
      <video class="prev-video" controls :src="previewData.imgUrl" alt="">
        <source :src="previewData.imgUrl" type="video/mp4">
      </video>
    </div>
    <div class="cont" v-if="previewData._type == 3">
      <p class="arrow">
        <i class="close-btn iconfont" @click="closePreview">&#xe60e;</i>
      </p>
      <audio class="prev-mp3" controls :src="previewData.imgUrl" alt="">
        <source :src="previewData.imgUrl" type="video/mp3">
      </audio>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
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
      pageCount: 0, // pdf文件总页数
      loadedRatio: 0, // 加载进度
      showLoadingMask: false // 显示加载遮罩
    }
  },
  mounted() {

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
    loadPdfHandler (e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    changePdfPage (val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .preview-box{
    @include maskLayer($z: 1002);
    .cont{
      width:95%;
      height:95%;
      background:#fff;
      position: relative;
      overflow: hidden;
      .mask-layer{
        width:100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
        background:rgba(0,0,0,.3);
        padding:0 30px;
        z-index: 1;
        display: flex;
        align-items: center;
        .load-progress{
          flex: 1;
          margin-left:20px;
        }
      }
      .arrow{
        // margin: 0 auto;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        border-bottom:1px solid #ededed;
        .close-btn{
          width: 26px;
          height: 26px;
          position: absolute;
          right:16px;
          top:10px;
          font-size: 20px;
          color: #666;
          line-height: 26px;
          text-align: center;
          cursor: pointer;
          z-index: 2;
        }

        .turn {
          background: #36cea9;
          padding: 5px;
          border-radius: 5px;
          margin: 0 10px;
          font-size:14px;
          color: white;
        }
      }
      .pdf-box{
        height: 100%;
        overflow: auto;
      }
      .prev-img{
        max-width: 100%;
      }
      .prev-video{
        display: block;
        max-width: 100%;
        max-height: 85%;
        margin:0 auto;
      }
      .prev-mp3{
        display: block;
        margin:200px auto 0;
      }
    }
    .contImg{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
