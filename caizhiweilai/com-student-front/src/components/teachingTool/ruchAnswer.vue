<template>
<div class="draw-lottery">
  <div class="draw-lottery-cont">
    <i class="close-turntable iconfont"
       @click="closeLottery">&#xe628;</i>
    <div class="bgCover">
      <!-- 按钮 -->
      <div class="race-answer">
        <div class="race-answer-box"
             @click='answerHandler'>
          <img src='./images/startAnswer.png'
               v-show='!rushIng'
               alt="">
          <img src='./images/alreadyAnswer.png'
               v-show='rushIng'
               alt="">
        </div>
      </div>
      <!-- 列表 -->
      <div class="answer-table">
        <div class="answer-part answer-part-head">
          <div class="part-answer-rank">排名</div>
          <div class="part-answer-student">学生</div>
          <div class="part-answer-time">用时<span class='refresh'
                  @click='answerList'>刷新</span></div>
        </div>
        <ul class='answer-part'>
          <li v-for='(item,index) of alreadtStudents'
              :key='item.id'>
            <div class="part-answer-rank">
              <img src="./images/getFirst.png"
                   alt=""
                   v-if='index==0'>
              <img src="./images/getSecond.png"
                   alt=""
                   v-else-if='index==1'>
              <img src="./images/getThird.png"
                   alt=""
                   v-else-if='index==2'>
              <span v-else
                    class='ranking'>{{index+1}}</span>
            </div>
            <div class="part-answer-student">
              <img :src="item.photo"
                   alt=""
                   v-if='item.photo'>
              <img src="./images/people.png"
                   alt=""
                   v-else>
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
  answerList
} from '@/api/teacherTools.js'

export default {
  name: 'turntable',
  data() {
    return {
      rushIng: false,
      alreadtStudents: [],
      timers: null,
      firstTimes: null,
      count: 0
    }
  },
  mounted() {
    if (this.answerStatus) {
      this.rushIng = false
    } else {
      this.rushIng = true
    }
    this.answerList()
    this.firstTimes = setTimeout(() => {
      this.answerList()
      this.timers = setInterval(() => {
        this.answerList()
      }, 10000)
    }, 5000)
  },
  computed: {
    ...mapState(['answerStatus'])
  },
  watch: {
    answerStatus: {
      handler: function (now, old) {
        if (now) {
          this.rushIng = false
        } else {
          this.rushIng = true
        }
      },
      deep: true
    }
  },
  destroyed() {
    if (this.timers != null) {
      clearTimeout(this.timers)
    }
    if (this.firstTimes != null) {
      clearTimeout(this.firstTimes)
    }
    clearInterval(this.timers)
    this.timers = null
    this.firstTimes = null
  },
  methods: {
    timerHandler() {

    },
    answerHandler() {
      const classId = localStorage.getItem('classId')
      const creator = localStorage.getItem('customerId')
      const studentId = localStorage.getItem('userId')
      const data = {
        classId,
        creator,
        studentId
      }
      if (!this.rushIng) {
        startAnswer(data).then(res => {
          if (res.code == '0') {
            this.timerHandler()
            this.$message({
              message: '抢答成功',
              type: 'success'
            })
            this.rushIng = !this.rushIng
            this.$store.commit('setAnswerStatus', false)
            // 刷新抢答列表
            this.answerList()
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'warning'
            })
            this.alreadtStudents = []
          }
        })
      } else {
        return false
      }
    },
    // 枪答过的学生列表
    answerList() {
      answerList({
        classId: localStorage.getItem('classId')
      }).then((res) => {
        if (res.code == 0) {
          this.alreadtStudents = res.result
        }
      })
    },
    // 关闭抢答器弹窗
    closeLottery() {
      clearInterval(this.timers)
      clearTimeout(this.firstTimes)
      this.timers = null
      this.firstTimes = null
      this.$store.commit('setRushAnswerShow', false)
      this.$store.commit('setHeight', true)
    }
  }
}
</script>

<style scoped lang="scss">
.draw-lottery {
    @include maskLayer($num: 0.3, $z: 3002);
    overflow-y: auto;
    .draw-lottery-cont {
        width: 540px;
        height: 802px;
        background: url("images/ruchAnswer_bg.png") no-repeat center/100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -270px;
        margin-left: -401px;

        .close-turntable {
            // background: #D6D6D6;
            border-radius: 100%;
            width: 24px;
            height: 24px;
            position: absolute;
            right: 40px;
            top: 75px;
            text-align: center;
            line-height: 28px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.5);
            font-size: 32px;
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

                    .ranking {
                        color: #fff;
                        background: #A4B2E5;
                        padding: 2px 6px;
                        border-radius: 100%;
                        font-size: 12px;
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
