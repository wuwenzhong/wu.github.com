<template>
  <div class="yzf">
    <p class="time">
      <span v-if="taskType == 6">{{timeTitle}}：{{showTaskTime}}</span>
      <button @click="btnClose">退出</button>
    </p>
    <iframe
      :src="url"
      id="parentFrame"
      width="100%"
      height="100%"
      frameborder="0"
      scrolling="no"
      marginheight="0"
    ></iframe>
    <div
      class="Robot"
      ref="kongtiao"
      @mousedown="mouseDownHandleelse($event)"
      @mouseup="mouseUpHandleelse($event)"
      @mousemove.prevent="mouseMoveHandleelse"
      @mouseleave="mouseleaveHandleelse"
      v-show="taskType == 6 && (trainState == '1' || trainState == '0')"
    >
      <div
        class="RobotImg"
        :class="[beginMove?'move':'',beginTransform?'isTransform':'']"
      >
        <div class="robotleft" @click.stop="Recurrence"></div>
        <div class="roborRight" v-show="hiddenstepindex">
          <!-- 第一步 -->
          <div class="step stepOne">
            <div class="vip-control-header">
              <div class="gain">
                <span class="gainLeft">获取操作</span>
                <span class="gainClose" @click="Recurrence">x</span>
              </div>
              <div class="PointMe">点击我获取操作</div>
              <div class="next" @click="achieve">获取操作</div>
            </div>
          </div>
          <!-- 第二步 -->
          <div class="stepTwo" v-for="(item,index) in stepArr" :key="index">
            <div class="step">
              <div class="vip-control-header">
                <div class="PointMeTow gain">
                  <span>{{item.stepPosName}}</span>
                  <span>{{ item.stepName }}</span>
                  <p v-show="finsh" @click.stop="checkfile(item.resIds)">查看文件</p>
                  <span class="gainClose" @click="Recurrence">x</span>
                </div>
                <div class="stepscontent">{{item.description==''?'暂无描述':item.description}}</div>
                <div class="nextTow" v-show="finsh">
                  <span @click.stop="prev(item)" :class="stepxs?'bclick':''">上一步</span>
                  <span @click.stop="next(item)">下一步</span>
                </div>
                <div class="nextTow wcContent" v-show="!finsh">
                  <p>本轮任务已完成，将于{{djs}}s后自动返回首页</p>
                  <span @click="btnClose">已完成</span>
                </div>
              </div>
            </div>
            <div class="step steopRight" v-show="ckfile">
              <div class="vip-control-headerr">
                <div class="gain">
                  <span class="gainLeft">查看文件</span>
                  <!-- <span class="gainClose">x</span> -->
                </div>
                <div class="PointMeTow">
                  <el-table
                    :data="ckfileArr"
                    stripe
                    style="width: 100%"
                    border
                    :cell-style="tableCellStyle"
                    :header-cell-style="tableHeaderColor"
                  >
                    <el-table-column prop="resName" label="文件名称" width="300" align="center"></el-table-column>
                    <el-table-column prop="caozuo" label="操作" width="120" align="center">
                      <template slot-scope="scope">
                        <div class="operation">
                          {{item.pdfUrl}}
                          <span
                            @click="preview(scope.$index, scope.row)"
                            class="look"
                          >查看</span>
                          <span @click="dowmload(scope.$index, scope.row)">下载</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFileClose"
                    v-if="isShowPrevFile"></show-prev-file>
  </div>
</template>
<script>
import {
  tastrw,
  nexttast,
  returnTask,
  finishTask,
  getTaskRes,
  xycaseTime,
  xiazaifilie,
  getAccountTime,
  holdAccountTime
} from '@/api/praTraining'
import showPrevFile from '@/components/showPrevFile/index'
export default {
  name: 'Catenation',
  components: {
    showPrevFile
  },
  data() {
    return {
      url: this.$route.query.url, // 打开的iframe地址
      oldTaskId: this.$route.query._classTaskId, // 传过来的任务id
      titleIndex: this.$route.query.index, // 传发过来的任务标题序列号
      rpaCode: this.$route.query.rpaCode, // 判断rpa类型码
      taskType: this.$route.query.taskType, // 任务类型
      trainState: this.$route.query.trainState, // 实训状态
      caseId: this.$route.query.caseId, // 案例id
      isGetTime: false, // 是否请求到完成任务的时间
      starTimer: null, // 计时器
      taskTime: 0, // 任务完成的时间
      showTaskTime: '', // 用来展示的任务时间
      timeTitle: '已用时', // 任务时间标题
      // 机器人移动
      moveDataelse: {
        x: null,
        y: null
      },
      previewData: {}, // 预览参数
      isShowPrevFile: false, // 预览弹窗显示隐藏
      hiddenstepindex: true,
      stepArr: [], // 存储步骤数据
      screenWidth: '', // 屏幕的宽度
      screenHeight: '', // 屏幕的高度
      beginMove: false, // 开始移动
      beginTransform: false, // 右边翻转
      moveflag: false, // 移动到两边的操作标识
      moveclickflag: false,
      djs: 3, // 倒计时3秒跳转页面
      caselist: {
        teamId: '',
        userId: '',
        classId: '',
        caseId: '',
        classTaskId: ''
      },
      finsh: true,
      ckfile: false,
      ckfileArr: []
    }
  },
  computed: {
    needSendSunc: function () {
      return this.sendSync
    }
  },
  mounted() {
    debugger
    // 页面加载获取当前账套任务的操作时间
    this.getOverPregress()
    // 加载完iframe以后开始计时
    this.iframeWaite()
    // 进入页面先清除定时器
    clearInterval(this.starTimer)
    this.starTimer = null
  },

  methods: {
    // 关闭账簿返回到案例页面
    btnClose() {
      // 退出时判断任务状态，是否保存时间
      this.holdOperaTime()
      this.$router.push({
        path: '/trainLevel',
        query: {
          classTaskId: this.oldTaskId,
          index: this.titleIndex,
          rpaCode: this.rpaCode,
          taskType: this.taskType
        }
      })
      this.djs = 3
    },
    mouseDownHandleelse(event) {
      const that = this
      that.mousemove = true
      that.screenWidth = document.body.clientWidth // 获取屏幕宽度
      that.screenHeight = document.body.clientHeight // 获取屏幕高度
      that.moveDataelse.x = event.pageX - that.$refs.kongtiao.offsetLeft
      that.moveDataelse.y = event.pageY - that.$refs.kongtiao.offsetTop
      that.beginMove = true
      // 移动标识
      that.moveclickflag = false
    },
    mouseMoveHandleelse(event) {
      const that = this
      if (that.mousemove) {
        let moveLeft = event.pageX - this.moveDataelse.x
        let moveTop = event.pageY - this.moveDataelse.y
        if (moveLeft <= 0) {
          // 移动到左侧标识
          that.moveflag = false
          // 如果左侧的距离小于0，就让距离等于0.不能超出屏幕左侧
          moveLeft = 0
          that.beginTransform = false
          // this.$refs.kongtiao.style.transform='rotate(0deg)';
        } else if (
          moveLeft >
          that.screenWidth - this.$refs.kongtiao.offsetWidth
        ) {
          // 移动到左侧标识
          that.moveflag = true
          // 如果左侧的距离>屏幕的宽度-元素的宽度。也就是说元素的右侧超出屏幕的右侧，就让元素的右侧在屏幕的右侧上
          moveLeft = that.screenWidth - this.$refs.kongtiao.offsetWidth
          that.beginTransform = true
          // this.$refs.kongtiao.style.transform='rotateX(180deg)';
          // this.$refs.kongtiao.style.transform='rotateY(180deg)';
        }
        if (moveTop <= 0) {
          // 和左右距离同理
          moveTop = 0
        } else if (
          moveTop >
          that.screenHeight - this.$refs.kongtiao.offsetHeight
        ) {
          moveTop = that.screenHeight - this.$refs.kongtiao.offsetHeight
        }
        this.$refs.kongtiao.style.left = moveLeft + 'px'
        this.$refs.kongtiao.style.top = moveTop + 'px'
        if (moveLeft >= 60) {
          // 移动标识  移动超过10像素
          that.moveclickflag = true
        } else {
          that.moveclickflag = false
        }
      } else {
        return false
      }
    },
    mouseUpHandleelse(event) {
      const that = this
      that.mousemove = false
      window.onmousemove = null
      that.beginMove = false
    },
    mouseleaveHandleelse() {
      const that = this
      that.mousemove = false
    },
    // 修改table tr行的背景色
    tableRowStyle({ row, rowIndex }) {
      return 'background-color: pink'
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: rgba(229,234,244,1);color: #333;font-weight: 600;border-color:#cccccc;'
      }
    },
    // 修改 table cell边框的背景色
    tableCellStyle() {
      return 'border-color:#cccccc;'
    },
    // 查看文件
    async checkfile(resIds) {
      const that = this
      const stepzywj = { resIds: resIds }
      const formData = new FormData()
      Object.keys(stepzywj).forEach((key) => {
        formData.append(key, stepzywj[key])
      })
      const zywj = await getTaskRes(formData)
      // 显示文件
      that.ckfile = !that.ckfile
      that.ckfileArr = zywj.result
      // 获取查看文件宽度 left减去该宽度
      if (that.moveflag) {
        that.$nextTick(function () {
          const leftstring = document.getElementsByClassName('Robot')[0].style
            .left
          const divleft = leftstring.substring(0, leftstring.length - 2)
          document.getElementsByClassName('Robot')[0].style.left =
            parseInt(divleft) -
            parseInt(
              document.getElementsByClassName('steopRight')[0].clientWidth
            ) +
            'px'
        })
      }
    },
    // 点击获取操作步骤
    async achieve() {
      const that = this
      // 移动标识
      that.hiddenstepindex = true
      if (this.caseId) {
        that.caselist.teamId = localStorage.getItem('teamId')
        that.caselist.userId = localStorage.getItem('userId')
        that.caselist.classId = localStorage.getItem('classId')
        that.caselist.caseId = this.caseId
        // 班级任务id
        that.caselist.classTaskId = this.oldTaskId
        localStorage.setItem('caselistx', JSON.stringify(that.caselist))
      } else {
        that.caselist.teamId = JSON.parse(
          localStorage.getItem('caselistx')
        ).teamId
        that.caselist.userId = JSON.parse(
          localStorage.getItem('caselistx')
        ).userId
        that.caselist.classId = JSON.parse(
          localStorage.getItem('caselistx')
        ).classId
        that.caselist.caseId = JSON.parse(
          localStorage.getItem('caselistx')
        ).caseId
        that.caselist.classTaskId = JSON.parse(
          localStorage.getItem('caselistx')
        ).classTaskId
      }
      tastrw(that.caselist).then(res => {
        if (res.code == '101') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        } else {
          // 判断是否是最后一步
          if (res.result.lastTask == 1) {
            that.lastTask = res.result.lastTask
          } else {
            that.lastTask = ''
          }
          // 第一步
          document.getElementsByClassName('stepOne')[0].style.display = 'none'
          that.stepArr = []
          that.stepArr.push(res.result)
          if (res.result.stepNum == 1) {
            that.stepxs = true
            return false
          } else {
            that.stepxs = false
          }
          if (res.result.id) {
            that.finsh = true
          } else {
            that.finsh = false
          }
        }
      })
    },
    // 上一步
    prev(stepsid) {
      const that = this
      // 隐藏文件
      that.ckfile = false
      that.caselist.id = stepsid.id
      returnTask(that.caselist).then((res) => {
        that.achieve()
        if (res.message == '参数缺失') {
          document.getElementsByClassName('stepOne')[0].style.display = 'block'
        }
      })
    },
    // 下一步
    next(stepsid) {
      // 下一步
      const that = this
      // 隐藏文件
      that.ckfile = false
      if (that.lastTask == 1) {
        this.$confirm('这已经是最后一步了，确认是否完成任务?', '提示', {}).then(
          () => {
            // 调用完成任务接口
            finishTask(that.caselist).then((finishTask) => {
              if (finishTask.code == 0) {
                const time = setInterval(function () {
                  that.djs = parseInt(that.djs) - 1
                  if (parseInt(that.djs) == 0) {
                    clearInterval(time)
                    // 调用完成按钮
                    that.btnClose()
                  }
                }, 1000)
              }
            })
            // 确定
            const nextinfo = {
              id: stepsid.id
            }
            const formData = new FormData()
            Object.keys(nextinfo).forEach((key) => {
              formData.append(key, nextinfo[key])
            })
            nexttast(formData).then((res) => {
              if (res.code == 0) {
                that.achieve()
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
            })
          }
        )
      } else {
        const nextinfo = {
          id: stepsid.id
        }
        const formData = new FormData()
        Object.keys(nextinfo).forEach((key) => {
          formData.append(key, nextinfo[key])
        })
        nexttast(formData).then(res => {
          if (res.code == 0) {
            that.achieve()
          } else {
            this.$message({
            type: 'warning',
            message: res.message
          })
          }
        })
      }
    },
    // 下载
    async dowmload(item, itemcontent) {
      const that = this
      // 下载文件
      xiazaifilie(itemcontent.downloadUrl).then(res => {
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', itemcontent.resName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 预览
    preview(isRefresh, item) {
      if (item.resExt == 'sql' || item.resExt == 'autowork' || item.resExt == 'exe') {
        this.$message({
          type: 'warning',
          message: '此文件暂不支持预览！'
        })
        return false
      }
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      this.previewData.imgUrl = item.converUrl ? item.converUrl : item.downloadUrl
      console.log(this.previewData)
      this.isShowPrevFile = true
    },
    isShowPrevFileClose() {
      // 关闭预览文件
      this.isShowPrevFile = false
    },
    // 立即返回
    Recurrence() {
      const that = this
      that.hiddenstepindex = !that.hiddenstepindex
    },
    // 等待iframe加载完成以后在执行
    iframeWaite() {
      const _this = this
      const iframe = document.querySelector('#parentFrame')
      // 处理兼容行问题
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', function() {
          clearInterval(_this.starTimer)
          _this.starTimer = null
          if (_this.isGetTime && _this.trainState != 2) {
            _this.storeWorkTime()
            // 开启监听刷新，关闭页面
            window.onbeforeunload = function (e) {
              _this.holdOperaTime()
              return '即将离开页面'
            }
          }
          if (_this.trainState == 2) {
            _this.timeTitle = '完成用时'
            _this.showTaskTime = _this.dateConversion(_this.taskTime) == '' ? '0秒' : _this.dateConversion(_this.taskTime)
          }
        })
      } else {
        iframe.onload = function() {
          clearInterval(_this.starTimer)
          _this.starTimer = null
          if (_this.isGetTime && _this.trainState != 2) {
            _this.storeWorkTime()
            // 开启监听刷新，关闭页面
            window.onbeforeunload = function (e) {
              _this.holdOperaTime()
              return '即将离开页面'
            }
          }
          if (_this.trainState == 2) {
            _this.timeTitle = '完成用时'
            _this.showTaskTime = _this.dateConversion(_this.taskTime) == '' ? '0秒' : _this.dateConversion(_this.taskTime)
          }
        }
      }
    },
    // 获取时间
    getOverPregress() {
      const _this = this
      const postData = {
        userId: localStorage.getItem('userId'),
        classTaskId: this.oldTaskId,
        caseId: this.$route.query.caseId
      }
      getAccountTime(postData).then(res => {
        if (res.code == 0) {
          console.log(res, '请求的时间==========')
          _this.taskTime = res.result
          _this.isGetTime = true
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 开始计时存储时间
    storeWorkTime() {
      const _this = this
      this.starTimer = setInterval(() => {
        _this.taskTime++
        _this.showTaskTime = _this.dateConversion(_this.taskTime)
      }, 1000)
    },
    // 保存在页面操作的时间
    holdOperaTime() {
      const postData = {
        userId: localStorage.getItem('userId'),
        classTaskId: this.oldTaskId,
        caseId: this.$route.query.caseId,
        useTime: this.taskTime
      }
      holdAccountTime(postData).then(res => {
        console.log(res, '保存时间===')
      })
    },
    // 时间转化格式
    dateConversion(timeStr) {
      let theTime = parseInt(timeStr)// 需要转换的时间秒
      let theTime1 = 0// 分
      let theTime2 = 0// 小时
      let theTime3 = 0// 天
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
          if (theTime2 > 24) {
            // 大于24小时
            theTime3 = parseInt(theTime2 / 24)
            theTime2 = parseInt(theTime2 % 24)
          }
        }
      }
      let result = ''
      if (theTime > 0) {
        result = '' + parseInt(theTime) + '秒'
      }
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      if (theTime3 > 0) {
        result = '' + parseInt(theTime3) + '天' + result
      }
      return result
    }
  },
  destroyed() {
    clearInterval(this.starTimer)
    this.starTimer = null
    window.onbeforeunload = ''
  }
}
</script>
<style lang="scss" scoped>
.yzf {
  display: flex;
  flex: 1;
  position: relative;
  margin-top: 0.1rem;
  background: white;
  .time {
    position: fixed;
    z-index: 1100;
    right: 20px;
    top: 20px;
    color: #fff;
    width: auto;
    padding: 0 10px;
    height: 23px;
    font-size: 14px;
    text-align: center;
    span{
      margin-right: 16px;
      line-height: 24px;
      display: inline-block;
    }
    button{
      cursor: pointer;
      background: #60c7d0;
      border: none;
      color: #fff;
      width: 50px;
      height: 24px;
      border-radius: 3px;
      font-size: 12px;
      outline: none;
    }
  }
  iframe {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    right: 0;
  }
  .operation {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  .Robot {
    position: fixed;
    z-index: 99;
    left: 80px;
    top: 60%;

    .stepTwo {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .RobotImg {
      display: flex;
      justify-content: center;
      align-items: center;

      &.move {
        .robotleft {
          cursor: move;
        }

        .roborRight {
          .step {
            cursor: move;
          }
        }
      }

      &.isTransform {
        transform: rotateX(180deg);
        transform: rotateY(180deg);

        .step {
          transform: rotateX(180deg);
          transform: rotateY(180deg);

          .vip-control-header:before,
          .vip-control-header:after {
            border-color: transparent transparent transparent
              rgba(102, 102, 102, 0.3);
            left: initial;
            right: -0.194rem;
          }
        }
      }

      .robotleft {
        width: 110px;
        height: 120px;
        margin-right: 0.139rem;
        background: url("../../common/images/Robot.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .step {
      cursor: pointer;

      .vip-control-header {
        width: 360px;
        height: auto;
        min-height: 120px;
        background: rgba(102, 102, 102, 0.6);
        position: relative;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-content: space-around;
        flex-wrap: wrap;
        padding: 10px;

        .stepscontent {
            color: white;
            margin: 10px 0;
            font-size: 14px;
            width: 100%;
            text-align: justify;
            text-indent: 20px;
            line-height: 23px;
        }

        .gain {
          width: 100%;

          .gainLeft {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
          }

          .gainClose {
            width: 10px;
            height: 10px;
            float: right;
            color: white;
            line-height: 20px;
            text-align: center;
            font-size: 16px ;
          }
        }

        .PointMe {
            width: 100%;
            height: auto;
            margin: 10px;
            text-align: center;
            color: white;
            font-size: 14px;
            line-height: 28px;
        }

        .PointMeTow {
          width: 100%;
          color: white;
          font-size: 15px;
          display: flex;
          justify-content: space-between;

          p {
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(134, 239, 255, 1);
          }
        }

        .next {
              width: 80px;
            height: 30px;
            background: #67c3d1;
            border-radius: 6px;
            text-align: center;
            line-height: 30px;
            color: white;
        }

        .nextTow {
          display: flex;
          justify-content: flex-end;

          .bclick {
            background: #cccccc;
          }

          span {
                width: 100px;
            height: 30px;
            background: #67c3d1;
            border-radius: 2px;
            text-align: center;
            line-height: 30px;
            color: white;
            display: inline-block;
            margin-right: 10px;
          }
        }

        .wcContent {
          flex-wrap: wrap;
          justify-content: center;

          p {
            margin-bottom: 20px;
            color: white;
            font-size: 20px;
          }
        }
      }

      .vip-control-header:before,
      .vip-control-header:after {
        position: absolute;
        content: " ";
        top: 0.2rem;
        left: -0.194rem;
        display: block;
        width: 0;
        height: 0;
        border: 0.097rem solid rgba(102, 102, 102, 0.3);
        border-color: transparent rgba(102, 102, 102, 0.3) transparent
          transparent;
        z-index: 111;
      }

      .vip-control-header:after {
        z-index: 11;
      }
    }

    .steopRight {
      margin-left: 0.111rem;
      .vip-control-headerr {
        width: auto;
        height: auto;
        min-height: 120px;
        background: rgba(102, 102, 102, 0.6);
        position: relative;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-content: space-around;
        flex-wrap: wrap;
        padding: 10px;
        flex-direction: column;
        .gain{
          color: white;
          font-size: 15px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
