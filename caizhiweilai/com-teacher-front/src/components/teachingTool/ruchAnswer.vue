<template>
  <div class="draw-lottery">
    <div class="draw-lottery-cont">
      <i class="close-turntable iconfont" @click="closeLottery">&#xe60e;</i>
      <div class="bgCover">
        <!-- 按钮 -->
        <div class="race-answer">
          <div class="race-answer-box" @click='answerHandler'>
            <img src='./images/startAnswer.png' v-show='rushIng' alt="">
            <img src='./images/endAnswer.png' v-show='!rushIng' alt="">
          </div>
        </div>
        <!-- 列表 -->
        <div class="answer-table">
          <div class="answer-part answer-part-head">
            <div class="part-answer-rank">排名</div>
            <div class="part-answer-student">学生</div>
            <div class="part-answer-time">用时<span class='refresh' @click='refreshHandler'>刷新</span></div>
          </div>
          <ul class='answer-part'>
            <li v-for='(item,index) in studentList' :key="item.id">
              <!-- {{item.state}} -->
              <div class="part-answer-rank">
                <img src="./images/getFirst.png" alt="" v-if='index=="0"'>
                <img src="./images/getSecond.png" alt="" v-else-if='index=="1"'>
                <img src="./images/getThird.png" alt="" v-else-if='index=="2"'>
                <span v-else class='ranking'>{{index+1}}</span>
              </div>
              <div class="part-answer-student">
                <img :src="item.photo" alt="" v-if='item.photo'>
                <img src="./images/people.png" alt="" v-else>
                <span>{{item.studentName}}</span>
              </div>
              <div class="part-answer-time">{{item.timeSpent>60?'一分钟以上':item.timeSpent+'s'}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
import {
  startAnswer,
  endAnswer,
  answerList,
  isAnswer
} from '@/api/teacherTools.js'
// var timer = ''
export default {
  name: 'turntable',
  data() {
    return {
      rushIng: true,
      studentList: [],
      timer: null
    }
  },
  mounted() {
    isAnswer({
      classId: localStorage.getItem('classId')
    }).then(res => {
      if (res.code == 101) {
        this.rushIng = false
        this.refreshHandler()
        setTimeout(() => {
          this.refreshHandler()
        }, 5000, this.timerHandler())
      } else {
        this.rushIng = true
      }
    })
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  computed: {
    ...mapState(['answerStatus'])

  },
  methods: {
    timerHandler() {
      this.timer = setInterval(() => {
        this.refreshHandler()
      }, 10000)
    },
    answerHandler() {
      const classId = localStorage.getItem('classId')
      const creator = localStorage.getItem('customerId')
      if (this.rushIng) {
        const data = {
          classId,
          creator
        }
        startAnswer(data).then(res => {
          if (res.code == 0) {
            const rushId = res.result
            const message = {
              type: 'com', // 综合实训平台
              messageType: 'startRush', // 开始抢答
              receiverId: classId, // 接收人id
              sessionType: 'p2c', // p2p p2c p2t people to people  people to class  people team
              content: {
                classId,
                rushId
              }
            }
            this.rushIng = false
            this.refreshHandler()
            this.timerHandler()
            this.sendWspush(JSON.stringify(message))
            this.$store.commit('setAnswerStatus', false)
          }
        })
      } else {
        const data = {
          classId
        }
        this.$confirm('确认结束抢答吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          // clearInterval(timer)
          endAnswer(data).then(res => {
            if (res.code == '0') {
              this.rushIng = true
              this.$store.commit('setAnswerStatus', true)
              this.studentList = []
              clearInterval(this.timer)
            }
          })
        }).catch(() => {
        })
      }
    },
    // 关闭弹窗按钮
    closeLottery() {
      this.$store.commit('setHeight', true)
      this.$store.commit('setRushAnswerShow', false)
      clearInterval(this.timer)
      this.timer = null
    },
    // 刷新按钮
    refreshHandler() {
      const that = this
      answerList({
        classId: localStorage.getItem('classId')
      }).then(res => {
        if (res.code == 0) {
          this.studentList = res.result
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .draw-lottery {
    @include maskLayer($num: 0.3, $z: 1002);
    overflow-y: auto;

    .draw-lottery-cont {
      width: 540px;
      height: 802px;
      background: url("images/ruchAnswer_bg.png") no-repeat center/100% 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -401px;
      margin-left: -270px;

      .close-turntable {
        background: #D6D6D6;
        border-radius: 100%;
        width: 24px;
        height: 24px;
        position: absolute;
        right: 40px;
        top: 80px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.3);
      }

      .bgCover {
        width: 100%;
        height: 802px;
        box-sizing: border-box;
        padding-left: 12px;
        padding-right: 2px;
      }

      .race-answer {
        width: 100%;
        height: 200px;
        margin-top: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
        // height: 30px;
        img {
          display: block;
          width: 170px;
          height: 131px;
          cursor: pointer;

        }
      }

      .answer-table {
        width: 100%;
        height: auto;
        overflow: hidden;
        margin-top: 89px;
        line-height: 1;
        box-sizing: border-box;
        padding: 0 25px;

        .answer-part {
          width: 100%;
          height: auto;
          overflow: hidden;
          font-size: 12px;

          &.answer-part-head {
            color: #BDA498;
            height: 40px;
            line-height: 40px;
          }

          .part-answer-rank {
            width: 120px;
            box-sizing: border-box;
            margin-left: 20px;
            float: left;

            img {
              display: block;
              margin-top: 5px;
            }
          }

          .part-answer-student {
            width: 160px;
            box-sizing: border-box;
            float: left;

            img {
              width: 32px;
              height: 32px;
              display: block;
              border-radius: 100%;
              float: left;
              margin-top: 6px;
              margin-right: 10px;
              // border: 1px solid #FCAB75;
            }

            .ranking {
              color: #fff;
              background: #A4B2E5;
              padding: 2px 6px;
              border-radius: 100%;
              font-size: 12px;
            }
          }

          .part-answer-time {
            width: 160px;
            box-sizing: border-box;
            float: left;
            color: #707070;

            .refresh {
              padding: 5px 10px;
              background: #FC950D;
              color: #fff;
              float: right;
              line-height: 1;
              margin-top: 10px;
              border-radius: 3px;
              cursor: pointer;
            }
          }

          li {
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #F5F5F5;
          }
        }
      }
    }
  }
</style>
