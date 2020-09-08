<template>
  <div class="preview-file-box  ql-container ql-snow">
    <div v-if="!noFile" style="width:100%">
      <div class="left-box" ref="leftBox" v-if="fileLeft">
        <el-scrollbar style="height: 100%">
          <ul class="file-list" ref="listBox">
            <li v-for="(item,index) in fileList" :class="{active:currentIndex == index}" :key="index"
                @click="anchor(item.jumpId, index)">
              <i class="dian"></i>
              <span class="poin iconfont">&#xe606;</span>
              {{item.text}}
            </li>
          </ul>
        </el-scrollbar>
        <div class="line-box" ref="listLine">
          <span class="begin"></span>
          <span class="end"></span>
        </div>
      </div>
      <div class="show-area ql-editor" v-if="fileRight" v-html="fileContent"></div>
    </div>
    <div class="no-data-tips" v-if="noFile">暂无文档~~</div>
  </div>
</template>

<script>
import {
  getFile
} from '@/api/user'

export default {
  name: 'index',
  data() {
    return {
      fileList: [], // 侧边栏数据
      fileContent: '', // 文档内容
      noFile: 0, // 如果暂无文档
      fileLeft: 0, // 文档侧边栏
      fileRight: 0, // 文档内容
      currentIndex: 0 // 当前所在位置
    }
  },
  mounted() {
    // 加载文档数据
    this.getFileData()
  },
  methods: {
    // 锚点跳转
    anchor(str, num) {
      this.currentIndex = num
      document.querySelector('#' + str).scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    // 获取帮助文档数据
    getFileData() {
      const _this = this
      const postData = '?type=1&courseId=0'
      getFile(postData).then(res => {
        if (res.code == 0) {
          _this.fileList = JSON.parse(res.result.navigation)
          _this.fileContent = res.result.content
          _this.fileLeft = _this.fileList.length ? 1 : 0
          _this.fileRight = _this.fileContent == '' ? 0 : 1
          _this.noFile = (res.result.id && _this.fileList.length) ? 0 : 1
          _this.$nextTick(function() {
            // 如果有侧边栏内容
            if (_this.fileLeft) {
              const _refs = _this.$refs.listBox
              const _windowHeight = document.documentElement.clientHeight
              const lisHeight = _refs.clientHeight
              if (lisHeight < 600) {
                _this.$refs.listLine.style.height = lisHeight + 20 + 'px'
              } else {
                _this.$refs.listLine.style.height = 600 + 'px'
              }
            }
          })
        } else {
          _this.$message.warning({
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .preview-file-box {
    display: flex;
    padding: 20px 40px;
    li, ul {
      list-style: none;
    }
    &.ql-container.ql-snow{
     border-bottom:0;
    }
    .left-box {
      width: 280px;
      height: 600px;
      position: fixed;
      left: 40px;
      top: 20px;
      padding: 10px 0;
      .el-scrollbar{
        /deep/.el-scrollbar__wrap{
          overflow-x: hidden;
        }
      }
      .file-list {
        margin: 0;
        padding: 0;
        width: 100%;
        box-sizing: border-box;

        li {
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          padding: 0 10px 0 28px;
          position: relative;

          .dian {
            position: absolute;
            left: 6px;
            top: 10px;
            width: 10px;
            height: 10px;
            border: 2px solid #fff;
            background: #d8d8d8;
            border-radius: 100%;
            z-index: 1;
          }

          .poin {
            position: absolute;
            left: 6px;
            top: 0;
            color: $color-theme;
            z-index: 2;
            display: none;
          }

          &.active {
            background: #f3f3f3;

            .poin {
              display: block;
            }
          }

          &:hover {
            background: #f3f3f3;

            .dian {
              background: $color-theme;
            }
          }
        }
      }

      .line-box {
        position: absolute;
        left: 10px;
        top: 0;
        border: 1px solid #d8d8d8;
        height: 100%;

        .begin,
        .end {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 10px;
          height: 10px;
          border-radius: 100%;
          border: 2px solid #d8d8d8;
          background: #fff;
          z-index: 2;
        }

        .end {
          top: initial;
          bottom: -5px;
        }
      }
    }

    .show-area {
      padding: 0 50px;
      flex: 1;
      margin-left: 300px;
      box-shadow: 0 0 12px 0 rgba(0, 0, 0, .1);
      -webkit-box-shadow: 0 0 12px 0 rgba(0, 0, 0, .1);
      -moz-box-shadow: 0 0 12px 0 rgba(0, 0, 0, .1);
    }
    .no-data-tips{
      position: fixed;
      top:100px;
      left: 50%;
      text-align: center;
      font-size: 16px;
      color:#666;
    }
  }
</style>
