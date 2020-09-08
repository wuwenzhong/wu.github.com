<template>
  <div class='fileProgress'>
    <div class='content'>
      <iframe :src="PrevFileUrl" frameborder="0" v-if="imgT"></iframe>
      <!-- <div v-else>
        <img :src="PrevFileUrl" alt="">
      </div> -->
      <i class= "el-icon-close" @click="close"></i>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  props: ['PrevFileUrl'],
  data(){
    return {
      imgT:true
    }
  },
  mounted() {
    console.log(this.PrevFileUrl)
    // if(this.getUrlParam('resExt')=='png'||this.getUrlParam('resExt')=='jpg'||this.getUrlParam('resExt')=='gif'||this.getUrlParam('resExt')=='jpeg'||this.getUrlParam('resExt')=='svg'||this.getUrlParam('resExt')=='bmp'){
    //   this.imgT=false
    // }
  },
  methods: {
    close() {
      this.$emit("quxiao")
    },
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) // 匹配目标参数
      if (r != null) return unescape(r[2])
      return null // 返回参数值
    }
  },
};
</script>
<style lang="scss" scoped>
  .fileProgress{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    position: absolute;
    top:0;
    left:0;
    z-index: 9999;
    
    .content{
      position: fixed;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      z-index: 200;
      // padding: 0px 0px 10px 20px;
      border-radius: 5px;
      // overflow-y: auto;
      width: 90%;
      height: 90%;
      background-color: #fff;
      iframe{
        width: 100%;
        height: 100%;
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
      }
      .el-icon-close {
        position: absolute;
        background-color: rgba(0,0,0,.5);
        top:0px;
        right:-30px;
        font-size:25px;
        display: block;
        width: 30px;
        height: 30px;
        color:#fff;
        z-index: 1000;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: rgba(0,0,0,.8);
          // color: #000;
        }
      }
    }
    
  }
</style>