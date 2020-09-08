<template>
  <div class="app-container home-backGround">
    <div class="school" v-if="result.customerName">
      <img :src="result.coverUrl" alt="">
      <p>{{result.customerName}}</p>
    </div>
    <ul class="personNum">
      <li><p><span>{{result.teacherNum}}</span><br>实训教师人数</p></li>
      <li><p><span>{{result.sutdentNum}}</span><br>实训学生人数</p></li>
      <li><p><span>{{result.courseNum}}</span><br>已购课程数</p></li>
      <li class="onlinestu"><p><span>{{result.onlineNum}}</span><br>当前在线学生人数</p></li>
    </ul>

    <!-- 展示更多 -->
    <el-row>
      <el-button type="primary" v-if="summarizesData.length > 0" style="float: right" @click="handleMore()">查看更多 》</el-button>
    </el-row>

    <!-- 雷达图 -->
    <el-row :gutter="18">
      <el-col :xs="24" :sm="12" :lg="8" v-for="(item, index) in summarizesData" :key="index">
        <div class="common-card">
          <div class="common-title">{{ item.courseName }}</div>
          <div class="radar-box" :ref="`myChart${index}`" style="width: 100%; height: 485px"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 全部雷达图弹窗 -->
    <el-dialog :show-close="true" :visible.sync="dialogRadar" custom-class="radar-dialog" @close="closeDialogRadar" :close-on-click-modal="false" class='common-big'>
      <el-row :gutter="18">
        <el-col :xs="24" :sm="12" :lg="12" v-for="(item, index) in summarizesData" :key="index">
          <div class="common-card">
            <div class="common-title">{{ item.courseName }}</div>
            <div class="radar-box" :ref="`myChartDia${index}`" style="width: 100%; height: 485px"></div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import { queryTaaIndex, schoolIndexData } from '@/api/tdb'
  export default {
    data() {
      return {
        schoolId: localStorage.getItem('customerId'),
        summarizesData: [], // 雷达图
        summarizesDataSlice: [], // 三条雷达图
        dialogRadar: false,
        result: {
          courseNum: 0,
          coverUrl: '',
          customerName: '',
          sutdentNum: 0,
          teacherNum: 0
        }
      }
    },
    mounted() {
      this.queryTaaIndex()
      // 获取雷达图
      this.getRadarMapFun()
    },
    methods: {
      // 获取数据
      async queryTaaIndex() {
        const res = await queryTaaIndex({
          customerId: localStorage.getItem('customerId')
        })
        if (res.code === '101') {
          this.$message.warning(res.message)
        } else {
          this.result = res.result
        }
      },
      // 获取更多
      handleMore() {
        this.getRadarMapFun('1')
        this.dialogRadar = true
      },
      // 关闭弹窗
      closeDialogRadar() {
        this.getRadarMapFun()
      },
      // 获取雷达图
      getRadarMapFun(isDialog) {
        schoolIndexData({ schoolId: this.schoolId }).then(async(res) => {
          if (res.code === '0') {
            if (isDialog) {
              this.summarizesData = res.result
            } else {
              this.summarizesData = res.result.slice(0, 3)
            }

            for (let i = 0; i < this.summarizesData.length; i++) {
              // 雷达图
              if (this.summarizesData[i].indicator && this.summarizesData[i].indicator.length > 0) {
                this.currentShArr = this.summarizesData[i].indicator.map(item => item.currentSh)
                this.allShArr = this.summarizesData[i].indicator.map(item => item.allSch)
                const classScoreMax = Math.max(...this.currentShArr)
                const personScoreMax = Math.max(...this.allShArr)
                const scoreMax = classScoreMax > personScoreMax ? Math.ceil(classScoreMax) : Math.ceil(personScoreMax)
                this.oneArr = this.summarizesData[i].indicator.map(item => {
                  return {
                    name: item.name,
                    max: scoreMax === 0 ? 1 : scoreMax
                  }
                })
              } else {
                this.currentShArr = [0, 0, 0, 0, 0]
                this.allShArr = [0, 0, 0, 0, 0]
                this.oneArr = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
              }
              // 获取数据
              await this.$nextTick(() => {})

              if (isDialog) {
                await this.drawPie(this.$refs[`myChartDia${i}`][0], this.currentShArr, this.allShArr, this.oneArr)
              } else {
                await this.drawPie(this.$refs[`myChart${i}`][0], this.currentShArr, this.allShArr, this.oneArr)
              }
            }
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      // 雷达图
      drawPie(myChart, currentShArr, allShArr, oneArr) {
        const flag = myChart
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
                color: '#333',
                fontSize: 14
              },
              data: ['本校', '全国']
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
              indicator: oneArr,
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
                  value: currentShArr,
                  name: '本校',
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
                  value: allShArr,
                  name: '全国',
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
  .home-backGround{
    background: url('./images/bg.png') no-repeat center;
    min-height: calc(100vh - 114px);
    background-size: cover;
    padding-left: 50px;
    padding-right: 50px;
  }
  .app-container{
    .common-card {
      width: 100%;
      height: 498px;
      background: rgba(255,255,255,0.5);
      background-size: 100%;
      margin-top: 18px;
      position: relative;
      padding: 20px;
      .common-title {
        font-size: 18px;
        color: #333;
        line-height: 25px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .radar-box {
        margin-top: 18px;
      }
    }
    .radar-dialog{
      width: 80%;
      margin: 10vh auto !important;
      background: #f7f7f7;
      .el-dialog__header {
        padding-bottom: 36px;
      }
      .el-dialog__body {
        padding: 0 18px 18px;
        .common-card{
          background: #fff url('../../common/images/back.png') no-repeat bottom;
          background-size: 100%;
        }
      }
    }
  }
  // 大弹框样式
  .el-dialog__wrapper.common-big{
    .radar-dialog.el-dialog{
      width: 930px;
      height: 640px;
      border-radius: 4px;
      overflow: hidden;
      .el-dialog__header{
        padding-bottom: 30px;
      }
      .el-dialog__body{
        overflow-y: auto;
        height: 590px;
        // padding: 30px 20px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .school{
      width: 100%;
      height: 130px;
      padding: 20px 100px 0;
      display: flex;
      align-items: center;
      img{
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      p{
        margin-left:30px;
        font-size: 30px;
      }
  }
  .personNum{
    list-style: none;
    padding-left: 50px;
    padding: 20px 0px;
    margin: 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    li{
      // width: 420px;
      // height: 160px;
      width: 280px;
      height: 112px;
      padding-top:10px;
      // margin:50px 100px 50px 0;
      // padding-right: 80px;
      background-image: url('./images/sy1.png');
      // transform: scale(0.7);
      background-size: 100% 100%;
      p{
        display: block;
        white-space: nowrap;
        padding-top:5px;
        padding-right:60px;
        margin: 0;
        height: 100%;
        line-height: 40px;
        text-align: center;
        color:#fff;
        font-size:20px;
      }
      span{
        font-size:40px;
      }
    }
    li:nth-child(2){
      background-image: url('./images/sy2.png');
    }
    li:nth-child(3){
      background-image: url('./images/sy3.png');
    }
    li:last-child{
      background-image: url('./images/sy2.png');
    }
  }
</style>
