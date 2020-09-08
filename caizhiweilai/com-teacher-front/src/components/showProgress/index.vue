<template>
  <div class='fileProgress'>
    <div class='content'>
      <ul>
      <li v-for="(item, index) in fileInfo" :key="index">
        <img src="@/common/images/visio.jpg" v-if="item.type == 'mp4' || item.type == 'mkv'" />
        <img src="@/common/images/EXCELN.png" v-else-if="item.type == 'xlsx' || item.type == 'xls'" />
        <img src="@/common/images/JPG.jpg" v-else-if="item.type == 'jpg' || item.type == 'gif' || item.type == 'jpeg' || item.type == 'png' || item.type == 'svg' || item.type == 'bmp'" />
        <img src="@/common/images/PPT.png" v-else-if="item.type == 'ppt' || item.type == 'pptx' || item.type == 'potm' || item.type == 'potx'" />
        <img src="@/common/images/mp3.png" v-else-if="item.type == 'mp3' || item.type == 'wma'" />
        <img src="@/common/images/txt.png" v-else-if="item.type == 'txt' || item.type == 'text'" />
        <img src="@/common/images/sql.png" v-else-if="item.type == 'sql' || item.type == 'sql'" />
        <img src="@/common/images/exe.png" v-else-if="item.type == 'exe' || item.type == 'exe'" />
        <img src="@/common/images/autowork.png" v-else-if="item.type == 'autowork' || item.type == 'autowork'" />
        <img src="@/common/images/yasuo.png" v-else-if="item.type == 'rar' || item.type == 'zip'" />
        <img src="@/common/images/project.png" v-else-if="item.type == 'pdf'" />
        <div class="icon-py" v-else-if="item.type == 'py'">
          <i class="iconfont">&#xe703;</i>
        </div>
        <div class="icon-pbix" v-else-if="item.type == 'pbix'">
          <i class="iconfont">&#xe601;</i>
        </div>
        <img src="@/common/images/WORD.png" v-else-if="item.type == 'docx' || item.type == 'doc'" />
        <img src="@/common/images/qita.png" v-else />
        <p :title="item.name">{{item.name}}</p>
        <el-progress class="progressCss" :percentage="item.percentageNum" :status="item.percentageNum== 100?'success':'exception'"></el-progress>
      </li>
    </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['fileInfo', 'percentageNum'],
  data() {
    return {
      num: 0,
      statusPross: 'exception'
    }
  },
  watch: {
    percentageNum: {
      deep: true,
      handler: function(newV, oldV) {
        // debugger
        const that = this
        if (newV == 100) {
          const quxiao = setTimeout(function() {
            // 判断总共有几个上传文件
            that.$emit('quxiao', false)
            clearTimeout('quxiao')
          }, 800)
          // if (this.fileInfo.length == parseInt(localStorage.getItem('flagProcess'))) {
          //   const quxiao = setTimeout(function() {
          //     // 判断总共有几个上传文件
          //     that.$emit('quxiao', false)
          //     clearTimeout('quxiao')
          //   }, 800)
          // }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .fileProgress{
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #cccccc;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-track-piece {
      background-color: transparent;
      border-radius: 10px;
    }
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    position: absolute;
    top:0;
    left:0;
    z-index: 9000;
    .content{
      overflow-y: auto;
      width: 500px;
      max-height: 400px;
      background-color: #fff;
      margin:200px auto;
      border-radius: 4px;
      ul {
        li {
          display: flex;
          margin: 20px;
          align-items: center;
          img {
            width: 100px;
            margin-right: 20px;
          }
          .icon-py,.icon-pbix{
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
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
            font-size:88px;
          }
          p {
            width: 120px;
            // text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space :nowrap;
          }
          .progressCss {
            flex: 1;
          }
        }
      }
      .close{
        width: 100%;
        display: float;
        p {
          width:40px;
          height: 20px;
          float:right;
          background-color: #36CEA9;
          color:#fff;
          text-align: center;
          line-height: 20px;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }

  }
</style>
