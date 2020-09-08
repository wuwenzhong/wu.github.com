<template>
  <div class="training-box">
    <div class="top-bg"></div>
    <div class="training-content">
      <div class="training-head">
        <p class="module-title">实训中心</p>
        <!-- <p class="module-describe">这里是实训中心，最长是20个字</p> -->
      </div>
      <div class="outline-box">
        <div class="outline-list">
          <img src="./images/person_1.png" alt="" class="person_pic">
          <div class="list-content">
            <ul ref="moveBox">
              <li v-for="(item,index) in outlineList"
                  :key="index"
                  :class="currentOutlineIndex==index?'checked':''"
                  @click="point(item,index)" :title="item.outlineName">
                <i class="list-sign">模块{{item.number}}</i>
                <i class="iconfont type-icon">&#xe605;</i>
                <p>{{item.outlineName}}</p>
              </li>
            </ul>
          </div>
          <div class="switch-list" v-show="showSwitchBtn">
            <button class="left-btn" :class="{'active':moveLeft}" @click="moveOutline(0)"><i class="iconfont">&#xe61a;</i></button>
            <button class="right-btn" :class="{'active':moveRight}" @click="moveOutline(1)"><i class="iconfont">&#xe601;</i></button>
          </div>
          <div class="bg-mask"></div>
        </div>
        <ul class="task-list" v-if="taskList.length">
          <li v-for="(item,index) in taskList"
              :key="index"
              :class="{'no-drop':item.isunlock==0,
              'off-line':(networkState == 'off' && item.taskType == 3) ||
              (networkState == 'off' && item.taskType == 6) ||
              (networkState == 'off' && item.taskType == 7)
              }"
              @click="entertraining(item,(Number(currentOutlineIndex)+1) + '.'+(index+1))">
            <div class="title-num"
                 :class="{'hands-on': item.taskType ==3 || item.taskType ==4,
                  'person': item.taskType ==1 || item.taskType ==2 || item.taskType==101,
                  'function':item.taskType ==7,
                  'knowledge': item.taskType ==5 || item.taskType ==6}">
              <i class="iconfont" :class="{'team-icon':item.taskType == 2}" v-html="item.taskType == 101 ? iconTypeData[0] : iconTypeData[item.taskType-1]"></i>
              <span v-if="item.taskType==1 || item.taskType==101">个人</span>
              <span v-if="item.taskType==2">团队</span>
              <span v-if="item.taskType==3" >实操</span>
              <span v-if="item.taskType==4">考试</span>
              <span v-if="item.taskType==5">知识点</span>
              <span v-if="item.taskType==6">账套</span>
              <span v-if="item.taskType==7">功能</span>
            </div>
            <div class="num-list">{{Number(currentOutlineIndex)+1}}.{{index+1}}</div>
            <div class="task-name">{{ item.taskName }}</div>
            <div class="unlock" :class="{'active':item.isunlock!=0}">
              <i class="iconfont" v-html="finishState[item.isunlock]"></i>
              <span v-show="item.isunlock === 0">未解锁</span>
              <span v-show="item.isunlock === 1 ">已解锁</span>
              <span v-show="item.isunlock === 2 ">已完成</span>
            </div>
          </li>
        </ul>
        <div v-else  style="line-height: 100px;text-align: center;font-size: 14px;color: #666">暂无数据~~~~</div>
      </div>
    </div>
  </div>
</template>
<script>
import { isEnter } from '@/api/auth.js'
import {
  classidtask,
  classoutlineidtask
} from '@/api/trainingCenter'
export default {
  name: 'training',
  data() {
    return {
      iconTypeData: ['&#xe60e;', '&#xe60c;', '&#xe611;', '&#xe610;', '&#xe60b;', '&#xe609;', '&#xe60f;'], // 类型icon数组
      finishState: ['&#xe607;', '&#xe608;', '&#xe606;'], // 完成状态
      currentOutlineIndex: 0, // 当前大纲列表下班
      outlineList: [], // 大纲列表数据
      taskList: [], // 大纲下的任务列表
      currentOutlineId: '', // 当前大纲id
      outlineLength: 0, // 大纲数据长度
      showSwitchBtn: false, // 是否显示切换大纲列表按钮
			starNum: 0, // 移动的次数
      moveLeft: false, // 控制向左移动按钮
      moveRight: false, // 控制向右移动按钮
      networkState: localStorage.getItem('networkState') // 获取网络状态
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 实训中心加载数据
    init() {
      const _this = this
      this.currentOutlineIndex = localStorage.getItem('currentINDEX') ? localStorage.getItem('currentINDEX') : 0
      // 大纲列表
      classidtask({
        classId: localStorage.getItem('classId')
      }).then(res => {
        if (res.code == 0 || res.code == '0') {
          _this.outlineList = res.result
          _this.outlineLength = _this.outlineList.length
          if (_this.outlineList.length > 5) {
            _this.showSwitchBtn = true
          }
          for (let index = 0; index < this.outlineList.length; index++) {
            _this.outlineList[index].number = this.numTransform(index)
          }
          if (res.result[0]) {
            // 首次进入展示第一个大纲的列表
            _this.currentOutlineId = localStorage.getItem('currentOUT') ? localStorage.getItem('currentOUT') : res.result[0].id
            const _id = {
              id: _this.currentOutlineId
            }
            _this.point(_id, _this.currentOutlineIndex)
          }
          _this.$nextTick(() => {
						_this.initOutlineClick()
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 大纲切换
    point(item, val) {
      const _this = this
      this.currentOutlineIndex = val
      _this.currentOutlineId = item.id
      _this.storeData()
      classoutlineidtask({
        classOutlineId: _this.currentOutlineId
      }).then(res => {
        if (res.code == 0 || res.code == '0') {
          this.taskList = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 初始化大纲左右切换
    initOutlineClick() {
			const _moveBox = this.$refs.moveBox // 要移动的盒子
			const nowIndex = parseInt(localStorage.getItem('currentINDEX')) + 1 // 当前所在的大纲下标
			const quotient = parseInt(this.outlineLength / 5) // 大纲长度取商，正整数
			const nowIndexRemain = nowIndex % 5 // 当前大纲下标取余
			const nowIndexQuot = parseInt(nowIndex / 5)// 当前大纲下标取商
			if (nowIndex > 5) {
				this.starNum = nowIndexQuot
			}
			if (nowIndex == 5 && this.outlineLength > 5) {
				this.moveLeft = false
				this.moveRight = true
      }
			if (nowIndexQuot + 1 > quotient && nowIndex != 5) {
				this.moveLeft = true
      }
			if (nowIndexQuot < quotient) {
				this.moveRight = true
      }
			_moveBox.style.left = -this.starNum * 5 * 166 + 'px'
		},
    // 左右移动大纲展示更多
		moveOutline(num) {
      const _moveBox = this.$refs.moveBox // 要移动的盒子
      const remainder = this.outlineLength % 5 // 大纲长度取余数
      const quotient = parseInt(this.outlineLength / 5) // 大纲长度取商，正整数
      if (num) {
        this.starNum < quotient ? this.starNum++ : this.starNum
        _moveBox.style.left = -this.starNum * 5 * 166 + 'px'
        this.starNum == quotient ? [this.moveRight = false, this.moveLeft = true] : ''
      } else {
        this.starNum <= 0 ? 0 : this.starNum--
        _moveBox.style.left = -this.starNum * 5 * 166 + 'px'
        this.starNum == 0 ? [this.moveRight = true, this.moveLeft = false] : ''
      }
    },
    // 存储教学大纲的数据
    storeData() {
      localStorage.setItem('currentOUT', this.currentOutlineId)
      localStorage.setItem('currentINDEX', this.currentOutlineIndex)
    },
    // 转化数字为中文
    numTransform(index) {
      index = index + 1
      const number = parseInt(index, 0)
      const singleWord = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '零']
      const unit = ['十', '百']
      const indexFirstNum = parseInt(number.toString().substr(0, 1), 0)
      const indexSecondNum = parseInt(number.toString().substr(1, 1), 0)
      const indexThirdNum = parseInt(number.toString().substr(2, 1), 0)
      if (number < 10) {
        return singleWord[number]
      } else if (number < 100) {
        if (indexFirstNum === 1 && indexSecondNum === 0) { // 10为特殊情况
          return unit[0]
        }
        return singleWord[indexFirstNum] + unit[0] + singleWord[indexSecondNum]
      } else {
        if (indexThirdNum === 0 && indexSecondNum === 0) { // 109 和 190 两种类型的特殊情况
          return singleWord[indexFirstNum] + unit[1]
        } else if (indexSecondNum === 0) {
          return singleWord[indexFirstNum] + unit[1] + singleWord[10] + singleWord[indexThirdNum]
        }
        return singleWord[indexFirstNum] + unit[1] + singleWord[indexSecondNum] + unit[0] + singleWord[indexThirdNum]
      }
    },
    // 开始考试
    examHandler(obj) {
      const id = obj.id
      isEnter({
        classTaskId: obj.id
      }).then((res) => {
        if (res.code == 0) {
          if (res.result.examStudentInfo != null) {
            this.$router.push({
              path: '/training/exam',
              query: {
                id
              }
            })
          } else {
            this.$router.push({
              path: '/entrance',
              query: {
                id
              }
            })
          }
        } else if (res.code == 'ES1001') {
          this.$router.push({
            path: '/training/analysis',
            query: {
              id: obj.id,
              myResult: 0
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 进入任务
    entertraining(item, index) {
      const _this = this
      if (this.networkState == 'off' && (item.taskType == 3 || item.taskType == 6 || item.taskType == 7)) {
        this.$message.error('当前系统部署模式为无网络状态，不支持此任务！')
        return false
      }
      if (item.isunlock == 0) {
        this.$message({
          type: 'warning',
          message: '任务没有解锁哦~'
        })
        return false
      }
      if (item.taskType == 4) {
        // 4 考试任务
        _this.examHandler(item)
      } else {
        localStorage.setItem('jumpAddress', item.operationUrl)
				this.$router.push({
					path: '/trainLevel',
					query: {
						classTaskId: item.id,
						index: index,
						editPy: item.funcId,
						rpaCode: item.operationCode,
						taskType: item.taskType
					}
				})
      }
    }
  }
}
</script>
<style scoped lang='scss'>
  .training-box{
    position: relative;
    overflow-x: hidden;
    .top-bg{
      width: 1600px;
      height: 355px;
      position: absolute;
      top:0;
      left: 50%;
      margin-left: -800px;
      border-radius:0 0 12px 12px;
      @include setShadow(0px,0px,20px,1px,rgba(33, 80, 67, 0.2));
      background: linear-gradient(226deg, #73d766 0%, #3dd471 100%);
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    /*内容区*/
    .training-content{
      width: 1200px;
      margin:0 auto;
      position: relative;
      z-index: 1;
      /*模块头部*/
      .training-head{
        height: 206px;
        background-image: url("../../common/images/train_top.png");
        background-repeat: no-repeat;
        background-size: 671px 435px;
        background-position: right 10px;
        color:#fff;
        padding-top: 87px;
        .module-title{
          font-size: 30px;
          font-weight: 500;
          line-height: 48px;
        }
        .module-describe{
          font-size:14px;
          line-height: 20px;
          margin-top:8px;
        }
      }
      /*实训首页内容*/
      .outline-box{
        background: #fff;
        padding:0 60px 90px;
        border-radius:8px;
        @include setShadow(0px,2px,40px,2px,rgba(0, 36, 255, 0.1));
        /*大纲列表*/
        .outline-list{
          padding-top:38px;
          height: 236px;
          position: relative;
          .person_pic{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 190px;
            height: 216px;
            z-index: 1;
          }
          .list-content{
            width: calc(100% - 245px);
            height: 160px;
            margin-left: 245px;
            clear: both;
            overflow: hidden;
            position: relative;
            z-index: 1;
            position: relative;
            ul{
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              transition:0.3s ease;
              li{
                width:134px;
                height: 160px;
                float: left;
                margin-right: 32px;
                border:1px solid $color-theme;
                border-radius: 8px 20px 8px 20px;
                position: relative;
                background-color: #fff;
                cursor: pointer;
                &.checked{
                  background-color: $color-theme;
                  .list-sign{
                    background-color:#fff;
                    color: $color-theme;
                    border-radius: 8px 0 8px 0;
                  }
                  .type-icon{
                    color: #fff;
                  }
                  P{
                    color:#fff;
                  }
                }
                .list-sign{
                  position: absolute;
                  top:0;
                  left: 0;
                  line-height: 24px;
                  padding:0 12px;
                  background-color: $color-theme;
                  border-radius: 5px 0 8px 0;
                  font-style: normal;
                  color:#fff;
                  font-size: 12px;
                }
                .type-icon{
                  font-size: 36px;
                  color:$color-theme;
                  display: block;
                  margin-top:46px;
                  text-align: center;
                }
                p{
                  line-height: 20px;
                  font-size: 14px;
                  color: #3D4046;
                  text-align: center;
                  margin-top:12px;
                }
              }
            }
          }
          .switch-list{
            z-index: 1;
            position: absolute;
            bottom:-14px;
            right: 36px;
            overflow: hidden;
            clear: both;
            button{
              float: left;
              width:40px;
              height: 34px;
              border:0;
              color: #fff;
              cursor: no-drop;
              background-color: rgba(98, 214, 106, 0.5);
              &.active{
                background-color: $color-theme;
                cursor: pointer;
              }
              &.right-btn{
                border-radius: 0 8px 8px 0;
              }
              &.left-btn{
                border-radius:8px 0 0 8px;
              }
            }
            ul{
              height: 34px;
              float: left;
              li{
                float: left;

              }
            }
          }
          .bg-mask{
            width: 100%;
            height: 150px;
            border-radius: 8px 30px 8px 30px;
            background-color: #EAF9EE;
            position: absolute;
            bottom:0;
            left: 0;
          }
        }
        /*任务列表*/
        .task-list{
          margin-top:42px;
          li{
            line-height: 65px;
            display: flex;
            margin-bottom:2px;
            font-size:12px;
            cursor: pointer;
            @include setLinearGradient(#F6FDF8,#F0FFF4);
            &.no-drop{
              background:#F8F8F8;
              cursor: no-drop;
            }
            &.off-line{
              position: relative;
              &:after{
                z-index:1;
                width: 100%;
                text-align: center;
                opacity: 1;
                color: rgba(214,214,214,.5);
                position: absolute;
                top: 4px;
                font-size: 18px;
                transform: rotate(-4deg);
                -ms-transform: rotate(-4deg);
                -o-tranform: rotate(-4deg);
                -webkit-transform: rotate(-4deg);
                -moz-transform: rotate(-4deg);
                content: '当前系统部署模式为无网络状态，不支持此任务！';
                filter: progid:DXImageTransform.Microsoft.Alpha(opacity=10) progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.866025404, M12=0.5, M21=-0.5, M22=0.866025404);
              }
            }
            &:first-child{
              .title-num{
                border-radius: 8px 0 0 0;
              }
            }
            &:last-child{
              .title-num{
                border-radius: 0 0 0 8px;
              }
            }
            .title-num{
              width:66px;
              height: 66px;
              &.hands-on{
                background-color: #62D66A;
              }
              &.person{
                background-color:#5687FF;
              }
              &.function{
                background-color:#FFB800;
              }
              &.knowledge{
                background-color:#FF8C57;
              }
              i{
                display: block;
                font-size:14px;
                color:#fff;
                height: 16px;
                text-align: center;
                line-height: 22px;
                margin:16px 0 6px 0;
              }
              span{
                display: block;
                line-height: 18px;
                font-size:12px;
                color:#fff;
                text-align: center;
              }
            }
            .num-list{
              background:rgba(98, 214, 106, 0.2);
              border-radius: 12px;
              height: 18px;
              line-height: 18px;
              color:#2A9D51;
              padding:0 10px;
              margin:23px 10px 0 23px;
            }
            .task-name{
              flex: 1;
              color:#303133;
            }
            .unlock{
              margin-right: 30px;
              color:#303133;
              span{
                margin-left: 12px;
              }
              i{
                color: #C0C0C0;
              }
              &.active{
                i{
                  color:$color-theme;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
