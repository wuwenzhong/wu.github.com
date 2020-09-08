<template>
<div class="draw-lottery">
  <div class="draw-lottery-cont">
    <i class="close-turntable iconfont" @click="closeLottery">&#xe60e;</i>
    <span @click="drawStart" class="star-btn" ref="starBtn" v-if="changeBtn"></span>
    <span class="star-btn active" v-else></span>
    <p class="lottery-text">教学转盘</p>
    <div class="name-list-box" v-if="lotteryType == 1">
      <ul class="name-list" ref="lotteryBox">
        <li class="list-item" v-for="(opts,index) in lotteryData" :data-index="index" :data-id="opts.showStudentId" :data-name="opts.studentName" :key="index">{{opts.studentName}}
        </li>
      </ul>
    </div>
    <div class="name-list-box" v-if="lotteryType==2">
      <ul class="name-list" ref="lotteryBox" :style="{transform:'translate(0px,'+(-moveHeight)+'px)',transitionDuration:animateTime+'ms'}">
        <li class="list-item" v-for="(opts,index) in lotteryData" :data-index="index" :data-id="opts.showTeamId" :data-name="opts.teamName" :key="index">{{opts.teamName}}
        </li>
      </ul>
    </div>
    <div class="name-list-box" v-if="lotteryType==3">
      <ul class="name-list" ref="lotteryBox" :style="{transform:'translate(0px,'+(-moveHeight)+'px)',transitionDuration:animateTime+'ms'}">
        <li class="list-item" v-for="(opts,index) in lotteryData" :data-index="index" :data-id="opts.id" :data-name="opts.name" :key="index">{{opts.name}}
        </li>
      </ul>
    </div>
  </div>
  <div class="show-result" v-if="dialogVisible">
    <div class="cont">
      <p class="title">抽奖结果 <i class="iconfont" @click="handleClose">&#xe60e;</i></p>
      <p class="result-name">本次抽中了 <span style="color: red;font-size:16px;font-style: normal">{{winners}}</span> </p>
      <button @click="handleClose">关闭</button>
    </div>
  </div>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
import {
  sendLotteryResult
} from '@/api/teamAdmin'
export default {
  name: 'turntable',
  data() {
    return {
      lotteryData: [], // 展示的摇奖数据
      upsetData: [], // 存储打乱的摇奖数据
      rawData: [], // 传递过来的原始数据
      moveHeight: 0, // 移动的距离
      animateTime: 0, // 动画时间
      initNum: 10, // 默认复制多少份数据
      isFirst: false, // 是不是第一次抽奖,不是第一次抽奖要从新初始化数据
      typeId: ['showStudentId', 'showTeamId', 'id'], // 字段id
      winners: '', // 中奖的人
      dialogVisible: false, // 抽奖结果弹窗
      changeBtn: true // 改变启动按钮背景图
    }
  },
  computed: {
    lotteryPerson: {
      get: function () {
        return this.$store.state.lotteryPerson
      },
      set: function (newValue) {
        this.$store.state.lotteryPerson = newValue
      }
    },
    ...mapState({
      currentLotteryId: state => state.currentLotteryId,
      lotteryType: state => state.lotteryType
    })
  },
  mounted() {
    this.rawData = JSON.parse(JSON.stringify(this.lotteryPerson))
    const _dataLength = this.rawData.length
    this.upsetData = this.getRandomArrayElements(this.rawData, _dataLength)
    this.copyData(this.upsetData)
  },
  methods: {
    // 把数据随机复制
    copyData(data) {
      this.lotteryData = []
      for (let i = 1; i < this.initNum; i++) {
        for (let j = 0, size = data.length; j < size; j++) {
          this.lotteryData.push(data[j])
        }
      }
    },
    // 开始抽奖
    drawStart: function () {
      const _obj = this.$refs.lotteryBox
      const _this = this
      if (this.isFirst) {
        _obj.removeAttribute('style')
        this.initData()
      }
      this.changeBtn = false
      if (this.rawData.length < 3) {
        this.$message.warning('抽奖人数必须大于3人')
        return false
      }
      this.animateTime = 8000
      // 没次从新开始就要获取高度
      this.$nextTick(function () {
        this.moveHeight = _obj.clientHeight - 3 * 54
        _obj.setAttribute('style', 'transition-duration:' + this.animateTime + 'ms;transform:translate(0px,' + -this.moveHeight + 'px)')
      })
      _obj.addEventListener('webkitTransitionEnd', () => {
        const selectObj = _obj.lastChild.previousElementSibling
        const postData = {
          id: this.currentLotteryId,
          classId: localStorage.getItem('classId'),
          carouselType: _this.lotteryType
        }
        if (this.lotteryType == 1) {
          postData.choiceStudentId = selectObj.dataset.id
        }
        if (this.lotteryType == 2) {
          postData.choiceTeamId = selectObj.dataset.id
        }
        if (this.lotteryType == 3) {
          postData.choiceCustomId = selectObj.dataset.name
        }
        _this.isFirst = true // 抽过奖以后这里就变为真
        this.changeBtn = true
        _this.winners = selectObj.dataset.name
        sendLotteryResult(postData).then(res => {
          // 抽奖成功以后，暂时不知道干啥
          if (res.code == 0) {
            _this.dialogVisible = true
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      })
    },
    // 随机抽取几个元素
    getRandomArrayElements(arr, count) {
      const shuffled = arr.slice(0)
      let i = arr.length
      const min = i - count
      let index
      let temp
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random())
        temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
      }
      return shuffled.slice(min)
    },
    // 关闭得奖结果提示框，清空已经选中的
    handleClose() {
      this.winners = ''
      this.dialogVisible = false
    },
    // 从新初始化数据
    initData() {
      const selectObj = this.$refs.lotteryBox.lastChild.previousElementSibling
      const comparisonId = selectObj.dataset.id
      for (let i = 0, len = this.rawData.length; i < len; i++) {
        if (this.rawData[i][this.typeId[this.lotteryType - 1]] == comparisonId) {
          this.rawData.splice(i, 1)
          break
        }
      }
      if (this.rawData.length < 3) {
        this.lotteryData = []
        this.lotteryData = JSON.parse(JSON.stringify(this.rawData))
      } else {
        this.lotteryData = this.getRandomArrayElements(this.rawData, this.rawData.length)
        this.copyData(this.lotteryData)
      }
    },
    // 关闭抽奖
    closeLottery() {
      this.$store.commit('setTurnLottery', false)
    }
  }
}
</script>

<style scoped lang="scss">
.draw-lottery {
    @include maskLayer($num:.3, $z: 2002);
    .show-result {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,.3);
        z-index: 2003;
        .cont {
            width: 420px;
            height: 220px;
            border-radius: 4px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -110px;
            margin-left: -210px;
            background: #fff;
            .title {
                line-height: 48px;
                border-bottom: 1px solid #ededed;
                padding: 0 20px;
                font-size: 18px;
                color: #333;
                position: relative;
                i {
                    cursor: pointer;
                    position: absolute;
                    right: 20px;
                    top: 0;
                    height: 100%;
                    padding: 0 10px;
                }
            }
            .result-name {
                line-height: 120px;
                text-align: center;
                font-size: 16px;
                color: #666;
            }
            button {
                width: 100px;
                height: 32px;
                font-size: 14px;
                color: #fff;
                border-radius: 3px;
                outline: none;
                border: 0;
                display: block;
                background: $color-theme;
                margin: 0 auto;
                cursor: pointer;
                &:hover {
                    background: $color-theme-hover;
                }
            }
        }
    }
    .draw-lottery-cont {
        width: 672px;
        height: 513px;
        background: url("images/turntable-bg.png")no-repeat center/100% 100%;
        position: relative;
        .close-turntable {
            background: #D6D6D6;
            border-radius: 100%;
            width: 24px;
            height: 24px;
            position: absolute;
            right: 40px;
            top: -30px;
            text-align: center;
            line-height: 24px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.3);
        }
        .star-btn {
            width: 300px;
            height: 50px;
            position: absolute;
            bottom: 80px;
            left: 180px;
            cursor: pointer;
            background: url("images/star-lottery.png")no-repeat center/100% 100%;
            &.active {
                background: url("images/beginning.png")no-repeat center/100% 100%;
            }
        }
        .lottery-text {
            position: absolute;
            top: 140px;
            left: 140px;
            line-height: 34px;
            z-index: 1;
            font-size: 20px;
            color: #FA9755;
            letter-spacing: 10px;
            background: #fff2ec;
            width: 400px;
            text-align: center;
        }
        .cover-box {
            width: 360px;
            position: absolute;
            top: 264px;
            left: 156px;
            background: #32203c;
            line-height: 54px;
            height: 54px;
            font-size: 24px;
            color: #fff;
            text-align: center;
            z-index: 1;
        }
        .name-list-box {
            width: 400px;
            height: 168px;
            padding-top: 4px;
            overflow: hidden;
            position: absolute;
            top: 206px;
            left: 50%;
            margin-left: -200px;
            color: #fff;
            background: url("images/turntable-bg1.png")no-repeat center/100% 100%;
            .name-list {
                position: relative;
                top: 0;
                font-size: 0;
                z-index: 10;
                .list-item {
                    line-height: 54px;
                    text-align: center;
                    color: #fff;
                    font-size: 16px;
                    transform: translateZ(0px);
                }
            }
        }
    }
}
</style>
