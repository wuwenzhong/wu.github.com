<template>
<div class="draw-lottery">
  <div class="draw-lottery-cont">
    <div @click="closejg"
         class="gbps">
      <i class="close-turntable iconfont">&#xe628;</i>
    </div>
    <div class="bgCover">
      <div class="top">
        <div class="low"
             v-for="(item,index) in rankArr"
             :key="item.id + index"
             v-show="index == 1">
          <div class="headimg">
            <img class="tximg"
                 src="./images/default.png"
                 alt
                 v-if="item.photo=='' || !item.photo" />
            <img class="tximg"
                 :src="item.photo"
                 alt
                 v-else />
            <img src="../vote/images/secound.png"
                 alt />
          </div>
          <span class="people"
                :title="item?item.name:'暂无'">
            <p>{{item?item.name:'暂无'}}</p>
            （{{item?item.voteNum:'0'}}票）
          </span>
        </div>
        <div class="middle"
             v-for="(item,index) in rankArr"
             :key="index"
             v-show="index == 0">
          <div class="headimg">
            <img class="imgtx"
                 src="./images/default.png"
                 alt
                 v-if="item.photo=='' || !item.photo" />
            <img class="imgtx"
                 :src="item.photo"
                 alt
                 v-else />
            <img src="../vote/images/first.png"
                 alt />
          </div>
          <span class="people"
                :title="item?item.name:'暂无'">
            <p>{{item?item.name:'暂无'}}</p>
            （{{item?item.voteNum:'0'}}票）
          </span>
        </div>
        <div class="low"
             v-for="(item,index) in rankArr"
             :key="item.name + index"
             v-show="index ==2">
          <div class="headimg">
            <img class="tximgth"
                 src="./images/default.png"
                 alt
                 v-if="item.photo=='' || !item.photo" />
            <img class="tximgth"
                 :src="item.photo"
                 alt
                 v-else />
            <img src="../vote/images/third.png"
                 alt />
          </div>
          <span class="people"
                :title="item?item.name:'暂无'">
            <p>{{item?item.name:'暂无'}}</p>
            （{{item?item.voteNum:'0'}}票）
          </span>
          <div @click="init"
               class="refer">刷新</div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="answer-table" v-show="rankArr.length>3">
        <div class="answer-part answer-part-head">
          <div class="part-answer-rank">排名</div>
          <div class="part-answer-student">学生</div>
          <div class="part-answer-time">票数</div>
        </div>
        <ul class='answer-part'>
          <li v-for="(item,index) in rankArr"
              :key="index"
              v-show="index>=3 && index<=7">
            <div class="part-answer-rank">
              {{index+1}}
            </div>
            <div class="part-answer-student">
              <img src="./images/default.png"
                   alt=""
                   v-if="item.photo=='' || !item.photo">
              <img :src="item.photo"
                   alt=""
                   v-else>
              <span :title="item.name">{{item.name}}</span>
            </div>
            <div class="part-answer-time pnumber">{{item.voteNum}}票</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {
  currentVote
} from '@/api/vote'
var timer = ''
export default {
  name: 'turntable',
  props: ['voteRes'],
  data() {
    return {
      rushIng: false,
      rankArr: [],
      count: 0
    }
  },
  mounted() {
    this.init()
    clearTimeout(this.firstTime)
    this.firstTime = setTimeout(() => {
      clearTimeout(this.firstTime)
      this.timer = setInterval(() => {
        if (this.count < 1) {
          this.init()
        }
      }, 10000)
    }, 5000)

    document.documentElement.style.overflowY = 'hidden'
  },
  beforeDestroy() { // 页面关闭时清除定时器
    clearTimeout(this.firstTime)
  },
  methods: {
    init() {
      currentVote({
        classId: localStorage.getItem('classId'),
        teacherId: localStorage.getItem('teacherId')
      }).then(res => {
        if (res.code == 0) {
          this.rankArr = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
      // if (this.voteRes == '') {
      //   currentVote({
      //     classId: localStorage.getItem('classId'),
      //     teacherId: localStorage.getItem('teacherId')
      //   }).then(res => {
      //     if (res.code == 0) {
      //       this.rankArr = res.result
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: res.message
      //       })
      //     }
      //   })
      // } else {
      //   this.rankArr = this.voteRes
      // }
    },
    closejg() {
      clearInterval(this.timer)
      clearTimeout(this.firstTime)
      document.documentElement.style.overflowY = 'scroll'
      this.$emit('voteresult')
    }
  }
}
</script>
<style scoped lang="scss">
.draw-lottery {
    @include maskLayer($num: 0.3, $z: 1500);
    overflow-y: auto;

    .draw-lottery-cont {
        width: 540px;
        height: 802px;
        background: url("images/cjjg.png") no-repeat center/100% 100%;
        position: relative;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -270px;
        margin-left: -270px;
        .gbps {
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;

            i {
                text-align: center;
                line-height: 28px;
                cursor: pointer;
                // color: rgba(0, 0, 0, 0.5);
                font-size: 32px;
                color: orange;
            }
        }

        .bgCover {
            width: 100%;
            height: 802px;
            box-sizing: border-box;
            padding-left: 12px;
            padding-right: 2px;

            .top {
                margin-top: 365px;
                display: flex;
                justify-content: space-around;
                flex-direction: row;

                div {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    span {
                        color: #fc950d;
                    }

                    img {
                        width: 73px;
                        height: 89px;
                    }

                    span {
                        margin-top: 10px;
                    }
                }

                .low {
                    margin-top: 40px;
                    position: relative;

                    .headimg {
                        position: relative;

                        .tximg {
                            position: absolute;
                            border-radius: 50%;
                            width: 36px;
                            height: 36px;
                            bottom: 7px;
                            right: 7px;
                        }

                        .tximgth {
                            position: absolute;
                            border-radius: 50%;
                            width: 37px;
                            height: 37px;
                            bottom: 7px;
                            right: 7px;
                        }

                        img {
                            width: 51px;
                            height: 63px;
                        }
                    }

                    .refer {
                        position: absolute;
                        right: -10px;
                        top: -66px;
                        width: 74px;
                        height: 26px;
                        background: rgba(252, 149, 13, 1);
                        border-radius: 2px;
                        text-align: center;
                        line-height: 26px;
                        color: white;
                        cursor: pointer;
                    }

                    .over {
                        position: absolute;
                        right: 60px;
                        top: -66px;
                        width: 74px;
                        height: 26px;
                        background: rgba(252, 149, 13, 1);
                        border-radius: 2px;
                        text-align: center;
                        line-height: 26px;
                        color: white;
                        cursor: pointer;
                    }

                    .last {
                        position: absolute;
                        right: 150px;
                        top: -66px;
                        width: 74px;
                        height: 26px;
                        background: rgba(252, 149, 13, 1);
                        border-radius: 2px;
                        text-align: center;
                        line-height: 26px;
                        color: white;
                        cursor: pointer;
                    }
                }

                .middle {
                    position: relative;

                    .headimg {
                        position: relative;

                        .imgtx {
                            position: absolute;
                            width: 52px;
                            height: 53px;
                            border-radius: 50%;
                            bottom: 11px;
                            right: 11px;
                        }
                    }
                }
            }
        }

        .answer-table {
            width: 100%;
            height: auto;
            overflow: hidden;
            margin-top: 20px;
            line-height: 1;
            box-sizing: border-box;
            padding: 0 25px;

            .answer-part {
                width: 100%;
                height: auto;
                overflow: hidden;
                font-size: 12px;

                .pnumber {
                    color: #fc950d !important;
                }

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
                    width: 220px;
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
                        border: 1px solid #FCAB75;
                    }
                }

                .part-answer-time {
                    width: 100px;
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
                    // border-bottom: 1px solid #F5F5F5;
                }
            }
        }
    }
}

.people {
    display: flex;

    p {
        display: inline-block;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
    }
}
</style>
