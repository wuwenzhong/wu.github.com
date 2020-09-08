<template>
<div class="inner draw" @mousemove="beginPath($event)">
  <div class="wrap">
    <div id="control">
      <!--画笔颜色-->
      <div id="canvas-color">
        <el-divider content-position="center">画笔颜色</el-divider>
        <colorPicker v-model="color" v-on:change="setColor" />
      </div>
      <!--画笔-->
      <div id="canvas-brush">
        <el-divider content-position="center">画笔粗细</el-divider>
        <el-select v-model="config.lineWidth" placeholder="请选择" size='mini'>
          <el-option v-for="item in brushs" :key="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <!--操作-->
      <div id="canvas-control">
        <el-divider content-position="center">操作</el-divider>
        <span v-for="(control,index) in controls" :title="control.title" class="iconfont" :class="control.className" @click="controlCanvas(control.action)" v-html="control.text" :key="index"></span>
      </div>
      <!--形状-->
      <div id="canvas-shape">
        <el-divider content-position="center">形状</el-divider>
        <span @click="brushHandler" class="iconfont" :class="{active:shapeStatus==0}" title='画笔'>&#xe676;</span>
        <span @click="strightLine" class="iconfont" :class="{active:shapeStatus==1}" title='直线'>&#xe68d;</span>
        <span @click="rectangle" class="iconfont" :class="{active:shapeStatus==2}" title='矩形'>&#xe790;</span>
        <span @click="circular" class="iconfont" :class="{active:shapeStatus==3}" title='圆'>&#xe80c;</span>
      </div>
      <!--填充色-->
      <div id="canvas-bgColor">
        <el-divider content-position="center">填充色</el-divider>
        <p>
          <input type="color" name value="config.bgColo" @input="bgHandler" ref="bgColor" />
          <i class="iconfont" @click="clearBg" title="清除填充色">&#xe621;</i>
        </p>
      </div>
      <!-- 生成图像-->
      <div id="canvas-drawImage" @click.stop="getImage()">
        <span>保存</span>
        <!-- <el-divider direction="vertical"></el-divider> -->
        <i class="iconfont" title="生成图片">&#xe694;</i>
      </div>
    </div>
    <div class="canvasBox">
      <canvas id="canvas" class="fl" width="1200" height="600" style="cursor:url('./PencilToolCursor.ico'), auto;" @mousedown="canvasDown($event)" @mouseup="canvasUp($event)" @mousemove="canvasMove($event)" @touchstart="canvasDown($event)"
        @touchend="canvasUp($event)" @touchmove="canvasMove($event)"></canvas>
    </div>
  </div>
  <!--存放图片-->
  <!-- <div id="img-box" v-show="imgUrl.length">
    <div class="img-item" v-for="(src,index) in imgUrl" :key="index">
      <img :src="src" />
      <span class="fa fa-close iconfont" @click="removeImg(src)">&#xe628;</span>
    </div>
  </div> -->
</div>
</template>

<script>
import {
  wjUp
} from '@/api/trainingCenter'
export default {
  props: {
    imgUrl: {
      type: Array
    }
  },
  data() {
    return {
      color: '#000000',
      colors: [
        // '#fef4ac',
        // '#0018ba',
        // '#ffc200',
        // '#f32f15',
        // '#cccccc',
        // '#5ab639',
        // '#000000',
        // '#eeeeee'
      ],
      brushs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      context: {},
      canvasMoveUse: true,
      // 存储当前表面状态数组-上一步
      preDrawAry: [],
      // 存储当前表面状态数组-下一步
      nextDrawAry: [],
      // 中间数组
      middleAry: [],
      // 配置参数
      config: {
        lineWidth: 1,
        lineColor: '#fffff',
        shadowBlur: 2,
        bgColor: '#fffff'
      },
      // 记录形状
      shapeStatus: 0,
      squarBiao: [],
      // 直线坐标
      lineBiao: [],
      // 圆坐标
      criculBiao: [],
      // 记录画笔状态，禁止mouseMove之后就开始画
      printStatus: false,
      drawFileId: '' // 上传画图以后返回图片id
    }
  },
  created() {
    this.$emit('setNav', '在线涂鸦画板')
  },
  mounted() {
    const canvas = document.querySelector('#canvas')
    this.context = canvas.getContext('2d')
    this.initDraw()
    this.setCanvasStyle()
  },
  destroyed() {},
  computed: {
    controls() {
      return [{
          title: '上一步',
          action: 'prev',
          className: this.preDrawAry.length
            ? 'active fa fa-reply' : 'fa fa-reply',
          text: '&#xe656;'
        },
        {
          title: '下一步',
          action: 'next',
          className: this.nextDrawAry.length
            ? 'active fa fa-share' : 'fa fa-share',
          text: '&#xe654;'
        },
        {
          title: '清除',
          action: 'clear',
          className: this.preDrawAry.length || this.nextDrawAry.length
            ? 'active fa fa-trash' : 'fa fa-trash',
          text: '&#xe65b;'
        }
      ]
    }
  },
  methods: {
    isPc() {
      const userAgentInfo = navigator.userAgent
      const Agents = [
        'Android',
        'iPhone',
        'SymbianOS',
        'Windows Phone',
        'iPad',
        'iPod'
      ]
      let flag = true
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    },
    removeImg(src) {
      this.imgUrl = this.imgUrl.filter(item => item !== src)
    },
    initDraw() {
      const preData = this.context.getImageData(0, 0, 600, 400)
      // 空绘图表面进栈
      this.middleAry.push(preData)
    },
    canvasMove(e) {
      if (this.canvasMoveUse) {
        const t = e.target
        let canvasX
        let canvasY
        if (this.isPc()) {
          canvasX = e.clientX - t.parentNode.offsetLeft
          canvasY = e.clientY - t.parentNode.offsetTop
        } else {
          canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft
          canvasY = e.changedTouches[0].clientY - t.parentNode.offsetTop
        }
        if (this.shapeStatus == 0) {
          if (this.printStatus) {
            this.context.lineTo(canvasX, canvasY)
            this.context.stroke()
          }
        }
      }
    },
    beginPath(e) {
      const canvas = document.querySelector('#canvas')
      if (e.target !== canvas) {
        this.context.beginPath()
      }
    },
    // 清除填充色
    clearBg() {
      this.config.bgColor = ''
    },
    // 背景颜色填充
    bgHandler() {
      console.log(this.$refs.bgColor.value)
      this.config.bgColor = this.$refs.bgColor.value
    },
    // 画笔绘制
    brushHandler() {
      // 关闭其他
      this.shapeStatus = 0
    },
    // 绘制直线
    strightLine() {
      this.shapeStatus = 1
    },
    // 绘制矩形
    rectangle() {
      this.shapeStatus = 2
    },
    // 绘制圆
    circular() {
      this.shapeStatus = 3
    },
    // mouseup
    canvasUp(e) {
      const preData = this.context.getImageData(0, 0, 600, 400)
      if (!this.nextDrawAry.length) {
        // 当前绘图表面进栈
        this.middleAry.push(preData)
      } else {
        this.middleAry = []
        this.middleAry = this.middleAry.concat(this.preDrawAry)
        this.middleAry.push(preData)
        this.nextDrawAry = []
      }
      const t = e.target
      if (this.shapeStatus == 0) {
        this.printStatus = false
      } else if (this.shapeStatus == 1) {
        this.context.lineWidth = 1
        // 记录结束坐标
        this.lineBiao[2] = e.clientX - t.parentNode.offsetLeft
        this.lineBiao[3] = e.clientY - t.parentNode.offsetTop
        // 绘制直线
        this.context.moveTo(this.lineBiao[0], this.lineBiao[1])
        this.context.lineTo(this.lineBiao[2], this.lineBiao[3])
        this.context.stroke() // 进
      } else if (this.shapeStatus == 2) {
        this.context.lineWidth = 0
        this.squarBiao[2] =
          e.clientX - t.parentNode.offsetLeft - this.squarBiao[0]
        this.squarBiao[3] =
          e.clientY - t.parentNode.offsetTop - this.squarBiao[1]
        // 填充颜色
        this.context.fillStyle = this.config.bgColor
        // 绘制矩形
        this.context.rect(...this.squarBiao)
        this.context.stroke()
        if (this.config.bgColor != '') {
          this.context.fill()
        }
      } else if (this.shapeStatus == 3) {
        this.context.lineWidth = 0
        this.criculBiao[2] = e.clientX - t.parentNode.offsetLeft
        this.criculBiao[3] = e.clientY - t.parentNode.offsetTop
        // 填充颜色
        this.context.fillStyle = this.config.bgColor
        // 求两个点之间的距离
        const numX = Math.pow(this.criculBiao[0] - this.criculBiao[2], 2)
        const numY = Math.pow(this.criculBiao[1] - this.criculBiao[3], 2)
        const redius = Math.ceil(Math.sqrt(numX + numY))
        // 绘制圆
        this.context.arc(
          this.criculBiao[0],
          this.criculBiao[1],
          redius,
          0,
          2 * Math.PI
        )
        this.context.stroke()
        if (this.config.bgColor != '') {
          this.context.fill()
        }
      }
      this.canvasMoveUse = false
    },
    // mousedown
    canvasDown(e) {
      this.canvasMoveUse = true
      // client是基于整个页面的坐标
      // offset是cavas距离顶部以及左边的距离
      const canvasX = e.clientX - e.target.parentNode.offsetLeft
      const canvasY = e.clientY - e.target.parentNode.offsetTop
      this.setCanvasStyle()
      // 清除子路径
      if (this.shapeStatus == 0) {
        // 开启画笔状态
        this.printStatus = true
      } else if (this.shapeStatus == 1) {
        // 绘制直线
        this.lineBiao[0] = canvasX
        this.lineBiao[1] = canvasY
      } else if (this.shapeStatus == 2) {
        // 记录矩形的坐标
        this.squarBiao[0] = canvasX
        this.squarBiao[1] = canvasY
      } else if (this.shapeStatus == 3) {
        // 记录圆坐标
        this.criculBiao[0] = canvasX
        this.criculBiao[1] = canvasY
      } else {
        this.context.moveTo(canvasX, canvasY)
      }
      this.context.beginPath()
      // 当前绘图表面状态
      const preData = this.context.getImageData(0, 0, 600, 400)
      // 当前绘图表面进栈
      this.preDrawAry.push(preData)
    },
    // 设置颜色
    setColor(color) {
      // this.config.lineColor = color
      console.log(color)
    },
    // 操作
    controlCanvas(action) {
      switch (action) {
        case 'prev':
          if (this.preDrawAry.length) {
            const popData = this.preDrawAry.pop()
            const midData = this.middleAry[this.preDrawAry.length + 1]
            this.nextDrawAry.push(midData)
            this.context.putImageData(popData, 0, 0)
          }
          break
        case 'next':
          if (this.nextDrawAry.length) {
            const popData = this.nextDrawAry.pop()
            const midData = this.middleAry[
              this.middleAry.length - this.nextDrawAry.length - 2
            ]
            this.preDrawAry.push(midData)
            this.context.putImageData(popData, 0, 0)
          }
          break
        case 'clear':
          this.context.clearRect(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
          )
          this.preDrawAry = []
          this.nextDrawAry = []
          this.middleAry = [this.middleAry[0]]
          break
      }
    },
    // 生成图片
    getImage() {
      const _this = this
      const canvas = document.querySelector('#canvas')
      const src = this.dataURLtoBlob(canvas.toDataURL('image/png'))
      const files = this.blobToFile(src, 'caizhiweilai')
      // 上传腾讯云
      this.cos(files).then(res => {
        // 资源保存
        wjUp({
          resName: files.name,
          downloadUrl: res,
          resType: this.resType,
          resExt: 'png',
          resSize: files.size,
          creator: localStorage.getItem('userId')
        }).then(res => {
          if (res.code == 0) {
            const tempObject = {}
            // 画的图片上传成功以后把返回的id传递个父组件
            tempObject.id = res.result
            tempObject.converUrl = canvas.toDataURL('image/png')
            _this.imgUrl.push(tempObject)
            // 关闭会话框
            _this.$emit('cancel', _this.imgUrl)
          }
        })
      })
      if (!this.isPc()) {
        window.location.href = canvas.toDataURL('image/png')
      }
    },
    // base64转blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    // boble转化为对象
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },
    // 设置绘画配置
    setCanvasStyle() {
      this.context.lineWidth = this.config.lineWidth
      this.context.shadowBlur = this.config.shadowBlur
      this.context.shadowColor = this.config.lineColor
      this.context.strokeStyle = this.color
    }
  }
}
</script>

<style lang="scss" scoped>
.fix-body {
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}

.inner.draw {
  display: flex;
  flex-direction: row;
  height: 800px;
}

.draw h5 {
  margin-top: 10px;
}

#img-box {
  flex: 1;
  padding-left: 10px;
}

#img-box .img-item {
  position: relative;
  display: inline-block;
}

#img-box .img-item .fa {
  position: absolute;
  cursor: pointer;
  right: 1px;
  top: -1px;
  font-size: 12px;
  font-weight: 1;
  display: none;
  color: #ccc;
}

#img-box .img-item:hover .fa {
  display: block;
}

#img-box .img-item .fa:hover {
  color: #0af;
}

#img-box img {
  border: 1px #ccc solid;
  width: 90px;
  height: 60px;
  margin: 5px;
}

.wrap {
  width: 100%;
  height: 100%;
  border: 1px #999 solid;
  overflow: hidden;
  border-radius:3px;
  box-sizing: border-box;
  padding:20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.fl {
  float: left;
  display: block;
}

.canvasBox {
  height: 400px;
  margin: 0 auto;
}

#canvas {
  /* display: none; */
  border: 1px #585858 dashed;
  /* cursor: url('src/assets/gg.png') 4 12,auto; */
}

#control {
  padding-left: 25px;
  height: auto;
  display: flex;
  margin-bottom: 20px;
  div{
    min-width: 210px;
    text-align: center;
    padding: 5px 10px;
  }
}

#canvas-color ul {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#canvas-color ul li {
  float: left;
  display: inherit;
  width: 13px;
  height: 13px;
  border: 3px #fff solid;
  margin: 8px;
  cursor: pointer;
}

#canvas-bgColor .active,
#canvas-color .active {
  border: 1px solid #f2849e;
}

#canvas-control span {
  display: inline-block;
  width: 20px;
  height: 15px;
  margin-left: 10px;
  cursor: pointer;
}

#canvas-control span.iconfont {
  font-size: 16px;
  /* color:#999; */
}

#canvas-control span.iconfont.active {
  color: #0af;
}

#canvas-shape span {
  cursor: pointer;
  margin-right: 20px;
}

#canvas-bgColor p .iconfont {
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px;
}

#canvas-shape span.iconfont.active {
  color: #0af;
}

#canvas-brush .active {
  color: #0af;
}

#canvas-drawImage {
  cursor: pointer;
}

#canvas-drawImage i.iconfont {
  color: #0af;
  margin-left: 5px;
  text-align: justify;
}

.m-colorPicker .box.open {
  z-index: 4;
}

.m-colorPicker .colorBtn {
  width: 100%;
}
</style>
