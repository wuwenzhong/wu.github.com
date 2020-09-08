<template>
  <!-- 上传进度条弹框 -->
  <div class='fileProgress'>
    <div class='content'>
      <p class='title'>上传进度</p>
      <ul>
        <li v-for="(item, index) in fileInfo" :key="index">
          <div class='common pic' v-if="item.type === 'PIC'"></div>
          <div class='common excel' v-else-if="item.type === 'EXCEL'"></div>
          <div class='common pdf' v-else-if="item.type === 'PDF'"></div>
          <div class='common ppt' v-else-if="item.type === 'PPT'"></div>
          <div class='common txt' v-else-if="item.type === 'TXT'"></div>
          <div class='common mp3' v-else-if="item.type === 'MP3'"></div>
          <div class='common word' v-else-if="item.type === 'WORD'"></div>
          <div class='common video' v-else-if="item.type === 'VIDEO'"></div>
          <div class='common autowork' v-else-if="item.type === 'AUTOWORK'"></div>
          <div class='common exe' v-else-if="item.type === 'EXE'"></div>
          <div class='common sql' v-else-if="item.type === 'SQL'"></div>
          <div class='common py' v-else-if="item.type === 'PY'"></div>
          <div class='common pbix' v-else-if="item.type === 'PBIX'"></div>
          <!-- <i class="iconfont iconPython py-css" v-else-if="item.type === 'PY'"></i>
          <i class="iconfont iconpower_bi pbix-css" v-else-if="item.type === 'PBIX'"></i> -->
          <p :title="item.name">{{item.name}}</p>
          <el-progress class="progressCss" :percentage="percentageNum" color="#36CEA9"></el-progress>
          <!-- <el-progress v-if="percentageNum == 100 ? false : true" class="progressCss" :percentage="percentageNum" color="#36CEA9"></el-progress> -->
          <!-- <el-progress v-else class="progressCss" :percentage="100" status="success" color="#36CEA9"></el-progress> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { modifyTeamName } from '@/api/myTeam'
export default {
  props: ['fileInfo', 'percentageNum'],
  data(){
    return {
      num:0,
    }
  },
  watch: {
    'percentageNum'(newVal) {
      if (newVal === 100) {
        const timer = setTimeout(() => {
          this.$emit("closeProg", false)
          this.$message.success("上传成功")
          clearTimeout(timer)
        }, 500)

      }
    }
  },
  methods: {
    close() {
      this.$emit("closeDia", false)
    }
  },
  mounted () {

  }
};
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
    z-index: 10;
    .content{
      position: fixed;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      z-index: 200;
      padding: 0px 0px 10px 20px;
      border-radius: 5px;
      // box-sizing: border-box;
      overflow-y: auto;
      width: 500px;
      max-height: 400px;
      background-color: #fff;
      // margin:50% auto;
      .title {
        height: 60px;
        line-height: 60px;
        font-size:15px;
      }
      ul {
        li {
          display: flex;
          margin-bottom: 20px;
          align-items: center;
          .py{
            width: 100px;
            height: 100px;
            margin-right: 20px;
          }
          .pbix{
            width: 100px;
            height: 100px;
            margin-right: 20px;
          }
          div.common {
            width: 100px;
            height: 100px;
            background-image: url('../../../common/images/default_sprit.png');
            margin-right: 20px;
          }
          .py-css{
            margin-right: 20px;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            font-size: 50px;
            background-color: $color-theme;
          }
          .pbix-css{
            margin-right: 20px;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            font-size: 50px;
            background-color: #f2c811;
          }
          .pic{
            background-position: (-114px * 7) 0;
          }
          .excel{
            background-position: (-114px * 2) 0;
          }
          .pdf{
            background-position: (-114px * 4) 0;
          }
          .ppt{
            background-position: (-114px * 1) 0;
          }
          .txt{
            background-position: (-114px * 5) 0;
          }
          .mp3{
            background-position: 0 -115px;
          }
          .word{
            background-position: 0 0;
          }
          .video{
            background-position: (-114px * 6) 0;
          }
          .autowork{
            background-position: -114px -115px;
          }
          .exe{
            background-position: (-114px * 3) -115px;
          }
          .sql{
            background-position: (-114px * 2) -115px;
          }
          .py{
            background-position: (-114px * 5) -115px;
          }
          .pbix{
            background-position: (-114px * 4) -115px;
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
