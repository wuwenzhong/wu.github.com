<template>
<div class="home-wrapper">
  <div class="card-wrapper">
    <el-card shadow="hover">
      <div class="card-title">实训人数</div>
      <div class="card-number">{{ result.userNum }}</div>
    </el-card>
    <el-card shadow="hover">
      <div class="card-title">团队数</div>
      <div class="card-number">{{ result.teamNum }}</div>
    </el-card>
    <el-card shadow="hover">
      <div class="card-title">当前在线学生人数</div>
      <div class="card-number">{{ result.onlineNum }}</div>
    </el-card>
  </div>
  <el-row :gutter="18">
    <el-col :xs="24" :sm="12" :lg="8" v-if="result.sign">
      <div class="common-card attendance">
        <div class="common-title">签到统计</div>
        <div class="common-tip">
          <div><span></span>已签到</div>
          <div><span></span>未签到</div>
        </div>
        <div class="attendance-box">
          <el-progress type="circle" :stroke-width="12" :percentage="result.sign.attendance" color="#36CEA9"></el-progress>
          <div class="pending-box">
            <div class="card-number"><span>{{ result.sign.realCount }}</span>人</div>
            <div class="card-title" :class="result.sign.status === 1 ? 'pending' : ''">{{ result.sign.status == 1 ?
                '签到进行中' : result.sign.status === 2 ? '签到已结束' : '签到未开始' }}
            </div>
          </div>
        </div>
        <el-button type="primary" size="medium" v-show="result.sign.status === 1" @click="handleDetail()">查看详情</el-button>
        <el-button type="primary" size="medium" v-show="result.sign.status !== 1" @click="pagePush()">发起签到</el-button>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8">
      <div class="common-card">
        <div class="common-title">任务进度</div>
        <div class="progress-box">
          <el-card shadow="hover">
            <div class="flag-box">
              <el-progress type="circle" :stroke-width="12" :percentage="result.teamProgress" color="#36CEA9"></el-progress>
            </div>
            <div class="flag-content">
              <div class="card-number"><span>{{ result.teamProgress }}</span>%</div>
              <div class="card-title">团队进度</div>
            </div>
          </el-card>
          <el-card shadow="hover">
            <div class="flag-box">
              <el-progress type="circle" :stroke-width="12" :percentage="result.perosonProgress" color="#FF9D6A"></el-progress>
            </div>
            <div class="flag-content">
              <div class="card-number"><span>{{ result.perosonProgress }}</span>%</div>
              <div class="card-title">个人进度</div>
            </div>
          </el-card>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8">
      <div class="common-card">
        <div class="common-title">班级能力雷达图</div>
        <!-- <div class="common-tip">
            <div><span></span>本班</div>
            <div><span></span>学校</div>
          </div> -->
        <div class="radar-box" ref="myChart" style="width: 100%; height: 550px"></div>
      </div>
    </el-col>
  </el-row>

  <!-- 签到详情 -->
  <el-dialog :show-close="false" :visible.sync="dialogDetail" width="516px" custom-class="sign-dialog" @close="closeDialogDetail" :close-on-click-modal="false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已签到" name="first">
        <el-table stripe :data="recordDetails">
          <el-table-column property="studentName" label="学生姓名" align="center"></el-table-column>
          <el-table-column property="signInTime" label="签到时间" align="center"></el-table-column>
        </el-table>
        <pagination :hidden="totalItem <= 10" :total="totalItem" :layout="'total, prev, pager, next'" :page.sync="queryItemParams.page" :limit.sync="queryItemParams.size" @pagination="signItemListFun(queryItemParams)" />
      </el-tab-pane>
      <el-tab-pane label="未签到" name="second">
        <el-table stripe :data="recordDetails">
          <el-table-column property="studentName" label="学生姓名" align="center"></el-table-column>
          <el-table-column label="所属团队" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.teamName">{{ scope.row.teamName }}</span>
              <span v-else><span style="color: #E6A23C">*</span> 暂未分组</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :hidden="totalItem <= 10" :total="totalItem" :layout="'total, prev, pager, next'" :page.sync="queryItemParams.page" :limit.sync="queryItemParams.size" @pagination="signItemListFun(queryItemParams)" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="dialogDetail = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  getClassAvgScoreRadarMap
} from '@/api/home.js'
import {
  signItemList
} from '@/api/sxgk.js'
import store from '@/store'

export default {
  name: 'home',
  beforeRouteEnter(to, from, next) {
    if (from.path === '/classListHome') {
      store.dispatch('tagsView/delAllViews')
      next()
    } else {
      next()
    }
  },
  data() {
    return {
      queryParams: {
        schoolId: localStorage.getItem('customerId'), // 学校id
        classId: localStorage.getItem('classId') // 班级id
      },
      result: {},
      dialogDetail: false, // 签到详情
      recordDetails: [], // 详情数据
      activeName: 'first', // 选项卡
      totalItem: 0, // 总条数
      // 查询参数
      queryItemParams: {
        page: 1,
        size: 10,
        status: 1,
        signInId: ''
      },
      RadarMapNameArr: [], // 雷达图各项名字
      RadarMapClassScoreArr: [], // 雷达图班级平均分
      RadarMapSchoolScoreArr: [] // 雷达图院校平均分
    }
  },
  mounted() {
    this.getClassAvgScoreRadarMapFun()
  },
  created() {},
  methods: {
    // 获取数据
    getClassAvgScoreRadarMapFun() {
      getClassAvgScoreRadarMap(this.queryParams).then(res => {
        if (res.code === '0') {
          this.result = res.result
          if (this.result.indicator) {
            this.RadarMapClassScoreArr = this.result.indicator.map(item => item.classScore)
            this.RadarMapSchoolScoreArr = this.result.indicator.map(item => item.schoolScore)
            const ClassScoreMax = Math.max(...this.RadarMapClassScoreArr)
            const SchoolScoreMax = Math.max(...this.RadarMapSchoolScoreArr)
            const scoreMax = ClassScoreMax > SchoolScoreMax ? Math.ceil(ClassScoreMax) : Math.ceil(SchoolScoreMax)
            this.RadarMapNameArr = this.result.indicator.map(item => {
              return {
                name: item.name,
                max: scoreMax === 0 ? 1 : scoreMax
              }
            })
          } else {
            this.RadarMapClassScoreArr = [0, 0, 0, 0, 0]
            this.RadarMapSchoolScoreArr = [0, 0, 0, 0, 0]
            this.RadarMapNameArr = [{
              name: '暂无数据',
              max: 1
            }, {
              name: '暂无数据',
              max: 1
            }, {
              name: '暂无数据',
              max: 1
            }, {
              name: '暂无数据',
              max: 1
            }, {
              name: '暂无数据',
              max: 1
            }]
          }

          this.drawPie()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 签到详情
    handleDetail() {
      this.queryItemParams = {
        page: 1,
        size: 10,
        status: 1,
        signInId: this.result.sign.id
      }
      this.signItemListFun(this.queryItemParams)
      this.dialogDetail = true
    },
    // 跳转页面
    pagePush() {
      this.$router.push({ path: '/sxgk/qdgl', query: { flag: 1 } })
    },
    // 签到弹窗关闭
    closeDialogDetail() {
      this.activeName = 'first'
      this.recordDetails = []
      this.totalItem = 0
    },
    // 切换选项
    handleClick(tab, event) {
      this.queryItemParams.page = 1
      if (tab.paneName === 'first') {
        this.queryItemParams.status = 1
        this.signItemListFun(this.queryItemParams)
      } else {
        this.queryItemParams.status = 0
        this.signItemListFun(this.queryItemParams)
      }
    },
    // 查看详情
    signItemListFun(params) {
      signItemList(params).then(res => {
        if (res.code === '0') {
          this.recordDetails = res.result.data
          this.totalItem = Number(res.result.total)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 雷达图
    drawPie() {
      const flag = this.$refs.myChart
      if (flag) {
        const myChart = this.$echarts.init(flag)
        const option = {
          tooltip: {
            trigger: 'item',
            position: function (p) { // 其中p为当前鼠标的位置
              return [p[0], p[1]]
            }
          },
          legend: {
            orient: 'vertical', // 'horizontal'为横向,'vertical'为纵向.
            icon: 'circle',
            left: '0',
            textStyle: {
              color: '#333',
              fontSize: 14
            },
            data: ['本班', '学校']
          },
          radar: {
            splitNumber: 5, // 雷达图圈数设置
            center: ['50%', '50%'],
            radius: '70%',
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
            // name: '本班 vs 学校',
            type: 'radar',
            data: [
              {
                value: this.RadarMapClassScoreArr,
                name: '本班',
                itemStyle: {
                  normal: {
                    color: '#36CEA9' // 显示颜色与填充颜色对应
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#36CEA9' // 填充的颜色
                  }
                }
              },
              {
                value: this.RadarMapSchoolScoreArr,
                name: '学校',
                itemStyle: {
                  normal: {
                    color: '#FF7800'
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#FF7800'
                  }
                }
              }
            ]
          }]
        }
        myChart.setOption(option)
      }
    }
  }
}
</script>
<style lang="scss">
.home-wrapper {
    padding: 20px 40px;
    .card-wrapper {
        width: 100%;
        height: 160px;
        background: #fff;
        display: flex;
        align-items: center;
        padding-right: 20px;
        .el-card {
            width: 300px;
            height: 120px;
            margin-left: 20px;
            border-left: 8px solid #36CEA9;
            &:nth-of-type(2) {
                .el-card__body {
                    background: url("../../common/images/tuandui-icon.png") no-repeat 40px center;
                    background-size: 85px;
                }
            }
            &:nth-of-type(3) {
                .el-card__body {
                    background: url("../../common/images/singPeople.png") no-repeat 40px center;
                    background-size: 85px;
                }
            }
            .el-card__body {
                height: 100%;
                padding: 28px 0 0 147px;
                background: url("../../common/images/shixun-icon.png") no-repeat 40px center;
                background-size: 85px;
                .card-title {
                    font-size: 16px;
                    color: #999;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .card-number {
                    font-size: 44px;
                    line-height: 62px;
                    color: #333;
                }
            }
        }
    }
    .common-card {
        width: 100%;
        height: 648px;
        background: #fff url("../../common/images/back.png") no-repeat bottom;
        background-size: 100%;
        margin-top: 18px;
        position: relative;
        &.attendance:hover {
            background: #fff url("../../common/images/back-hover.png") no-repeat bottom;
            background-size: 100%;
            .el-button {
                display: block;
            }
        }
        padding: 20px;
        .common-title {
            font-size: 18px;
            color: #333;
            line-height: 25px;
        }
        .common-tip {
            margin-top: 18px;
            font-size: 14px;
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
        .el-button {
            display: none;
            background: #36CEA9;
            border-color: #36CEA9;
            color: #fff;
            position: absolute;
            left: 50%;
            bottom: 45px;
            transform: translate(-50%);
        }
        .attendance-box {
            text-align: center;
            margin-top: 46px;
            position: relative;
            .el-progress-circle {
                width: 236px !important;
                height: 236px !important;
            }
            .el-progress__text {
                display: none !important;
            }
            .pending-box {
                position: absolute;
                top: 25%;
                left: 50%;
                transform: translate(-50%);
                .card-number {
                    font-size: 20px;
                    color: #333;
                    span {
                        font-size: 70px;
                        line-height: 82px;
                        color: #36CEA9;
                    }
                }
                .card-title {
                    font-size: 16px;
                    color: #999;
                    margin-top: 5px;
                    &.pending {
                        color: #36CEA9;
                    }
                }
            }
        }
        .progress-box {
            .el-card {
                height: 200px;
                margin-top: 24px;
                &:nth-of-type(2) {
                    .el-card__body {
                        .flag-box {
                            .el-progress-circle {
                                background: url("../../common/images/geren.png") no-repeat center;
                                background-size: 30px;
                            }
                        }
                        .card-number {
                            span {
                                color: #FF9D6A;
                            }
                        }
                    }
                }
                .el-card__body {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding: 30px 15px;
                    .flag-box {
                        margin-right: 36px;
                        .el-progress-circle {
                            width: 136px !important;
                            height: 136px !important;
                            background: url("../../common/images/tuandui.png") no-repeat center;
                            background-size: 37px;
                        }
                        .el-progress__text {
                            display: none !important;
                        }
                    }
                    .card-number {
                        font-size: 20px;
                        color: #333;
                        span {
                            font-size: 70px;
                            line-height: 82px;
                            color: #36CEA9;
                        }
                    }
                    .card-title {
                        font-size: 16px;
                        color: #999;
                        padding-left: 10px;
                    }
                }
            }
        }
        .radar-box {
            margin-top: 18px;
        }
    }
    .sign-dialog {
        margin-top: 10vh !important;
        .el-dialog__header {
            padding: 0;
        }
        .el-dialog__body {
            padding-top: 10px;
            .pagination-container {
                padding: 10px 0 0;
            }
        }
    }
    .init-dialog {
      border-radius: 4px;
      .el-dialog__body {
        height: 635px;
        overflow: auto;
      }
    }
    .init-list-dialog {
      border-radius: 4px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        height: 685px;
        padding: 0;
      }
    }
}
</style>
