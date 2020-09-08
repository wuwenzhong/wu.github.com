<template>
  <div class="preview-box ql-container ql-snow">
    <div class="left-box" ref="leftBox">
      <el-scrollbar style="height: 100%">
        <ul class="file-list" ref="listBox">
          <li v-for="(item,index) in fileData.list" :class="{active:currentIndex == index}" :key="index" @click="anchor(item.jumpId, index)">
            <i class="dian"></i>
            <span class="poin iconfont">&#xe606;</span>
            {{item.text}}
          </li>
        </ul>
      </el-scrollbar>
      <div class="line-box" ref="listLine" >
        <span class="begin"></span>
        <span class="end"></span>
      </div>
    </div>
    <div class="show-area ql-editor" v-html="fileData.content"></div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      fileData: {},
      currentIndex: 0 // 当前所在位置
    }
  },
  mounted() {
    const _this = this
    this.fileData = JSON.parse(localStorage.getItem('fileData'))
    this.$nextTick(function() {
      const _refs = _this.$refs.listBox
      const _windowHeight = document.documentElement.clientHeight
      const lisHeight = _refs.clientHeight
      if (lisHeight < 600) {
        this.$refs.listLine.style.height = lisHeight + 20 + 'px'
      } else {
        this.$refs.listLine.style.height = 600 + 'px'
      }
    })
  },
  methods: {
    // 锚点跳转
    anchor(str, num) {
      this.currentIndex = num
      document.querySelector('#' + str).scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }
}
</script>

<style scoped lang="scss">
  h1,h2,h3,h4,h5,h6{
    margin: 0;
  }
.preview-box{
  display: flex;
  padding:20px 40px;
  ul,li{
    list-style: none;
  }
  .left-box{
    width: 280px;
    height: 600px;
    position: fixed;
    left: 40px;
    top:20px;
    padding: 10px 0;
    .file-list{
      margin:0;
      padding:0 0 0 0;
      width: 100%;
      box-sizing: border-box;
      li{
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        padding:0 10px 0 28px;
        position: relative;
        .dian{
          position: absolute;
          left: 6px;
          top:10px;
          width: 10px;
          height: 10px;
          border:2px solid #fff;
          background:#d8d8d8;
          border-radius:100%;
          z-index: 1;
        }
        .poin{
          position: absolute;
          left: 6px;
          top:0;
          color: $color-theme;
          z-index: 2;
          display: none;
        }
        &.active{
          background:#f3f3f3;
          .poin{
            display: block;
          }
        }
        &:hover{
          background:#f3f3f3;
          .dian{
            background:$color-theme;
          }
        }
      }
    }
    .line-box{
      position: absolute;
      left: 10px;
      top:0;
      border:1px solid #d8d8d8;
      height: 100%;
      .begin,.end{
        position: absolute;
        top:-5px;
        left: -5px;
        width: 10px;
        height: 10px;
        border-radius:100%;
        border:2px solid #d8d8d8;
        background: #fff;
        z-index: 2;
      }
      .end{
        top:initial;
        bottom:-5px;
      }
    }
  }
  .show-area{
    padding:0 50px;
    flex: 1;
    margin-left: 300px;
    box-shadow: 0 0 12px 0 rgba(0,0,0,.1);
    -webkit-box-shadow: 0 0 12px 0 rgba(0,0,0,.1);
    -moz-box-shadow: 0 0 12px 0 rgba(0,0,0,.1);
  }
}
</style>
