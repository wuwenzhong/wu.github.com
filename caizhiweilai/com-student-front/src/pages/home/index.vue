<template>
  <div class="home-wrapper">
    <div class="banner-wrapper">
      <div class="container">
        <div class="title">首页</div>
        <!-- <div class="text-underline"></div> -->
        <!-- <div class="content">建议有一段20字左右的说明文字，说明本页功能</div> -->
      </div>
    </div>
    <div class="content-wrapper">
      <div class="card-wrapper number">
        <div class="num-wrapper team">
          <span class="wrapper-num">{{ result.teamUserNum ? result.teamUserNum : 0 }}</span>
          <span class="wrapper-txt">团队人数</span>
        </div>
        <div class="num-wrapper person">
          <span class="wrapper-num">{{ result.score ? result.score : 0 }}</span>
          <span class="wrapper-txt">个人成绩</span>
        </div>
      </div>
      <div class="card-wrapper chart">
        <div class="chart-wrapper">
          <div class="title">任务进度</div>
          <div class="min-content task">
            <el-progress type="circle" class="circle-task" :stroke-width="2  " color="#FFF110" :percentage="result.progress"></el-progress>
          </div>
        </div>
        <div class="chart-wrapper" v-if="result.sign">
          <div class="title">签到统计</div>
          <div class="min-content sign">
            <div class="content-tip">
              <div><span></span>已签到</div>
              <div><span></span>未签到</div>
            </div>
            <el-progress type="circle" class="circle-sign" :stroke-width="12" color="#52C865" :percentage="result.sign.attendance"></el-progress>
            <div class="pending-box">
              <div class="card-number"><span>{{ result.sign.realCount }}</span>人</div>
              <div class="card-title" :class="result.sign.status == 1 ? 'pending' : ''">{{ result.sign.status == 1 ? '签到进行中' : result.sign.status == 2 ? '签到已结束' : '签到未开始' }}</div>
            </div>
            <el-button type="primary" size="medium" v-show="result.sign.signId" :disabled="result.sign.userSignStatus == 1" @click="signInSaveFun()">{{ result.sign.userSignStatus == 1 ? '已签到' : '签到' }}</el-button>
          </div>
        </div>
        <div class="chart-wrapper">
          <div class="title">个人能力雷达图</div>
          <div class="max-content">
            <div class="radar-box" ref="myChart" style="width: 100%; height: 450px"></div>
          </div>
        </div>
        <div class="chart-wrapper">
          <div class="title">团队能力雷达图</div>
          <div class="max-content">
            <div class="radar-box" ref="myChartTwo" style="width: 100%; height: 450px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { signInSave, studentData } from '@/api/home.js'
import { teamidandisleader, longConnection } from '@/api/myTeam.js'
import { _debounce } from '@/common/js/utils.js'

export default {
  data() {
    return {
      classId: localStorage.getItem('classId'), // 班级id
      result: {},
      RadarMapNameArr: [], // 雷达图各项名字
			RadarMapClassScoreArr: [], // 雷达图班级平均分
      RadarMapPersonScoreArr: [], // 雷达图院校平均

      RadarMapNameArrTwo: [], // 雷达图各项名字
			RadarMapClassScoreArrTwo: [], // 雷达图班级平均分
			RadarMapTeamScoreArr: [] // 雷达图院校平均
    }
  },
  mounted() {
    this.getClassAvgScoreRadarMapFun()
    // 获取团队id
    const postData = {
      userId: this.userId || localStorage.getItem('userId'),
      classId: localStorage.getItem('classId')
    }
    teamidandisleader(postData).then((res) => {
      if (res.code == 101) {
        localStorage.removeItem('teamId')
      } else {
        localStorage.setItem('teamId', res.result.teamId)
      }
    })
  },
  methods: {
    // 获取数据
    getClassAvgScoreRadarMapFun() {
      studentData({ classId: this.classId }).then(res => {
        if (res.code === '0') {
          this.result = res.result
          // 雷达图
          if (this.result.personAndClass) {
            this.RadarMapClassScoreArr = this.result.personAndClass.indicator.map(item => item.classScore)
            this.RadarMapPersonScoreArr = this.result.personAndClass.indicator.map(item => item.personScore)
            const classScoreMax = Math.max(...this.RadarMapClassScoreArr)
            const personScoreMax = Math.max(...this.RadarMapPersonScoreArr)
            const scoreMax = classScoreMax > personScoreMax ? Math.ceil(classScoreMax) : Math.ceil(personScoreMax)
            this.RadarMapNameArr = this.result.personAndClass.indicator.map(item => {
              return {
                name: item.name,
                max: scoreMax === 0 ? 1 : scoreMax
              }
            })
          } else {
            this.RadarMapClassScoreArr = [0, 0, 0, 0, 0]
            this.RadarMapPersonScoreArr = [0, 0, 0, 0, 0]
            this.RadarMapNameArr = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
          }

          // 雷达图
          if (this.result.teamAndClass) {
            this.RadarMapClassScoreArrTwo = this.result.teamAndClass.indicator.map(item => item.classScore)
            this.RadarMapTeamScoreArr = this.result.teamAndClass.indicator.map(item => item.teamScore)
            const classScoreMaxTwo = Math.max(...this.RadarMapClassScoreArrTwo)
            const teamScoreMax = Math.max(...this.RadarMapTeamScoreArr)
            const scoreMaxTwo = classScoreMaxTwo > teamScoreMax ? Math.ceil(classScoreMaxTwo) : Math.ceil(teamScoreMax)
            this.RadarMapNameArrTwo = this.result.teamAndClass.indicator.map(item => {
              return {
                name: item.name,
                max: scoreMaxTwo === 0 ? 1 : scoreMaxTwo
              }
            })
          } else {
            this.RadarMapClassScoreArrTwo = [0, 0, 0, 0, 0]
            this.RadarMapTeamScoreArr = [0, 0, 0, 0, 0]
            this.RadarMapNameArrTwo = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
          }

					this.drawPie()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 签到
    signInSaveFun: _debounce(function() {
      signInSave({ signInId: this.result.sign.signId }).then(res => {
        if (res.code === '0') {
          this.$message.success(res.message)
          this.result.sign.realCount = this.result.sign.realCount + 1
          this.result.sign.attendance = (this.result.sign.realCount / this.result.sign.mastCount) * 100
          this.result.sign.userSignStatus = 1
        } else {
          this.$message.warning(res.message)
        }
      })
    }),
    // 雷达图
    drawPie() {
      const flag = this.$refs.myChart
      const flagTwo = this.$refs.myChartTwo
      if (flag) {
        const myChart = this.$echarts.init(flag)
        const option = {
          tooltip: {
            trigger: 'item',
            position: function(p) { // 其中p为当前鼠标的位置
              return [p[0], p[1]]
            }
          },
          legend: {
            orient: 'vertical', // 'horizontal'为横向,'vertical'为纵向.
            icon: 'circle',
            left: '0',
            textStyle: {
              color: '#6C789A',
              fontSize: 14
            },
            data: ['个人能力项成绩', '班级平均能力项成绩']
          },
          radar: {
            splitNumber: 5, // 雷达图圈数设置
            center: ['50%', '50%'],
            radius: '56%',
            name: {
              textStyle: {
                color: '#666',
                fontSize: '14px'
              }
            },
            indicator: this.RadarMapNameArr,
            splitArea: {
              show: true,
              areaStyle: {
                // color: 'rgba(255,0,0,0)', // 图表背景的颜色
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
              }
            }
          },
          series: [{
            type: 'radar',
            data: [
              {
                value: this.RadarMapPersonScoreArr,
                name: '个人能力项成绩',
                itemStyle: {
                  normal: {
                    color: '#6BD768' // 显示颜色与填充颜色对应
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#6BD768' // 填充的颜色
                  }
                }
              },
              {
                value: this.RadarMapClassScoreArr,
                name: '班级平均能力项成绩',
                itemStyle: {
                  normal: {
                    color: '#FFA00A'
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#FFA00A'
                  }
                }
              }
            ]
          }]
        }
        myChart.setOption(option)
      }
      if (flagTwo) {
        const myChartTwo = this.$echarts.init(flagTwo)
        const option = {
          tooltip: {
            trigger: 'item',
            position: function(p) { // 其中p为当前鼠标的位置
              return [p[0], p[1]]
            }
          },
          legend: {
            orient: 'vertical', // 'horizontal'为横向,'vertical'为纵向.
            icon: 'circle',
            left: '0',
            textStyle: {
              color: '#6C789A',
              fontSize: 14
            },
            data: ['本团队平均能力项成绩', '班级平均能力项成绩']
          },
          radar: {
            splitNumber: 5, // 雷达图圈数设置
            center: ['50%', '50%'],
            radius: '56%',
            name: {
              textStyle: {
                color: '#666',
                fontSize: '14px'
              }
            },
            indicator: this.RadarMapNameArrTwo,
            splitArea: {
              show: true,
              areaStyle: {
                // color: 'rgba(255,0,0,0)', // 图表背景的颜色
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
              }
            }
          },
          series: [{
            type: 'radar',
            data: [
              {
                value: this.RadarMapTeamScoreArr,
                name: '本团队平均能力项成绩',
                itemStyle: {
                  normal: {
                    color: '#6BD768' // 显示颜色与填充颜色对应
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#6BD768' // 填充的颜色
                  }
                }
              },
              {
                value: this.RadarMapClassScoreArrTwo,
                name: '班级平均能力项成绩',
                itemStyle: {
                  normal: {
                    color: '#FFA00A'
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#FFA00A'
                  }
                }
              }
            ]
          }]
        }
        myChartTwo.setOption(option)
      }
    }
  }
}
</script>
<style lang="scss">
  .home-wrapper {
    .banner-wrapper {
      max-width: 1600px;
      height: 355px;
      margin: 0 auto;
      background: linear-gradient(226deg,rgba(115,215,102,1) 0%,rgba(61,212,113,1) 100%);
      box-shadow: 0px 10px 40px 0px rgba(33,80,67,0.2);
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      .container {
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        padding-top: 87px;
        color: #fff;
        background: url('./images/child.png') no-repeat right 7px top 18px;
        background-size: 518px;
        .title {
          font-size: 30px;
          font-weight: 500;
          line-height: 48px;
        }
        .text-underline {
          width: 40px;
          height: 5px;
          background: #ffc2a3;
          border-radius: 3px;
          margin: 11px 0 7px;
        }
        .content {
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
    .content-wrapper {
      width: 1200px;
      margin: -150px auto 0;
      .card-wrapper {
        width: 100%;
        display: flex;
        margin-bottom: 30px;
        box-shadow: 0px 2px 20px 0px rgba(35,35,35,0.11);
        border-radius: 8px;
        &.number {
          height: 254px;
          background: #fff url('./images/back-card.png') no-repeat 58px 104px;
          .num-wrapper {
            width: 564px;
            height: 195px;
            padding: 42px 94px 0 0;
            margin-top: 20px;
            color: #fff;
            display: flex;
            justify-content: flex-end;
            &.team {
              background: url('./images/back-team.png');
              background-size: 100%;
              margin-left: 55px;
            }
            &.person {
              background: url('./images/back-person.png');
              background-size: 100%;
              margin-left: -37px;
            }
            .wrapper-num {
              font-size: 70px;
              font-family: 'ZIDINGYI';
              font-weight: 500;
            }
            .wrapper-txt {
              font-size: 14px;
              margin-left: 8px;
              line-height: 136px;
            }
          }
        }
        &.chart {
          flex-wrap: wrap;
          padding: 48px 58px 2px;
          background: #fff;
          .chart-wrapper {
            width: 520px;
            margin: 0 44px 46px 0;
            background: url('./images/back-chart.png') no-repeat center bottom;
            border-radius: 8px;
            &:nth-child(2n) {
              margin-right: 0;
            }
            .title {
              height: 64px;
              line-height: 64px;
              color: #fff;
              font-size: 20px;
              font-weight: 500;
              background: url('./images/back-title.png') no-repeat;
              background-size: 100%;
              padding-left: 65px;
            }
            .min-content {
              height: 333px;
              border: 2px solid rgba(236,236,236,1);
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              border-top: none;
              &.task {
                background: url('./images/back-progress.png') no-repeat center center;
                .circle-task {
                  margin: 88px 0 0 176px;
                  .el-progress-circle {
                    width: 168px !important;
                    height: 168px !important;
                  }
                  .el-progress__text {
                    color: #fff;
                    font-size: 58px!important;
                    font-family: 'ZIDINGYI';
                    font-weight: 500;
                  }
                }
              }
              &.sign {
                position: relative;
                .content-tip {
                  color: #90969B;
                  position: absolute;
                  top: 15px;
                  left: 35px;
                  div {
                    display: flex;
                    align-items: center;
                    height: 26px;
                    line-height: 26px;
                    span {
                      display: inline-block;
                      width: 14px;
                      height: 14px;
                      border-radius: 50%;
                      background: #36CEA9;
                      margin-right: 10px;
                    }
                    &:nth-of-type(2) {
                      span {
                        background: #ddd;
                      }
                    }
                  }
                }
                .circle-sign {
                  margin: 46px 0 0 142px;
                  .el-progress-circle {
                    width: 236px !important;
                    height: 236px !important;
                  }
                  .el-progress__text {
                    display: none !important;
                  }
                }
                .pending-box {
                  position: absolute;
                  top: 100px;
                  left: 266px;
                  transform: translate(-50%);
                  .card-number {
                    font-size: 20px;
                    color: #6C789A;
                    text-align: center;
                    span {
                      font-size: 70px;
                      line-height: 82px;
                      color: #36CEA9;
                      &:first-child {
                        margin-right: 5px;
                        font-family: 'ZIDINGYI';
                      }
                    }
                  }
                  .card-title {
                    font-size: 16px;
                    color: #90969B;
                    margin-top: 5px;
                    &.pending {
                      color: #36CEA9;
                    }
                  }
                }
                .el-button {
                  position: absolute;
                  bottom: 20px;
                  right: 20px;
                }
              }
            }
            .max-content {
              height: 506px;
              border: 2px solid rgba(236,236,236,1);
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              border-top: none;
              padding: 15px 35px;
              opacity: 0.86;
            }
          }
        }
      }
    }
  }
</style>
