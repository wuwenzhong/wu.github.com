<template>
<div class="summarize-wrapper"
     :class="isShowPrevFile == true ? 'isDialog' : '' ">
  <div class="banner-wrapper">
    <div class="container">
      <div class="title">实训总结</div>
      <!-- <div class="content">建议有一段20字左右的说明文字，说明本页功能</div> -->
      <div class="export-btn"
           @click="toImage()">导出</div>
    </div>
  </div>
  <div class="image-dom-wrapper"
       ref="imageDom">
    <div class="content-wrapper">
      <div class="card-wrapper">
        <div class="card-title">我的能力项分布</div>
        <div class="card-content">
          <div class="chart-wrapper">
            <div class="title">个人能力雷达图</div>
            <div class="max-content common-border">
              <div class="radar-box"
                   ref="myChart"
                   style="width: 100%; height: 450px"></div>
            </div>
          </div>
          <div class="chart-wrapper">
            <div class="title">团队能力雷达图</div>
            <div class="max-content common-border">
              <div class="radar-box"
                   ref="myChartTwo"
                   style="width: 100%; height: 450px"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-wrapper">
        <div class="card-title">我的任务进度</div>
        <div class="card-content">
          <div class="chart-wrapper">
            <div class="title">个人任务进度</div>
            <div class="min-content common-border">
              <el-progress type="circle"
                           class="circle-task"
                           :stroke-width="2"
                           color="#FFF110"
                           :percentage="result.personalProgress"></el-progress>
            </div>
          </div>
          <div class="chart-wrapper">
            <div class="title">团队任务进度</div>
            <div class="min-content common-border">
              <el-progress type="circle"
                           class="circle-task"
                           :stroke-width="2"
                           color="#FFF110"
                           :percentage="result.teamProgress"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div class="card-wrapper">
        <div class="card-title">我的考试成绩</div>
        <div class="card-content">
          <el-table border
                    :data="result.examStuStatisticsDTOList"
                    style="width: 80%; margin: 0 auto 45px; border-radius: 4px">
            <el-table-column prop="paperName"
                             label="考试名称"
                             width="360"
                             align="center"></el-table-column>
            <el-table-column prop="useTime"
                             label="总用时"
                             align="center"></el-table-column>
            <el-table-column label="正确率"
                             align="center">
              <template slot-scope="scope">
                {{ scope.row.accuracy ? scope.row.accuracy : '---' }}
              </template>
            </el-table-column>
            <el-table-column label="成绩"
                             align="center">
              <template slot-scope="scope">
                {{ scope.row.score ? scope.row.score : '---' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
  <div class="content-wrapper other">
    <div class="card-wrapper">
      <div class="card-title">我的个人总结</div>
      <div class="card-content long">
        <div class="chart-wrapper no-back">
          <div class="title">下载一个自己擅长的模板</div>
          <div class="download-content common-border">
            <div class="file pptx">
              <i class="pptx"></i>
              <div class="file-title">实训总结模板.pptx</div>
              <a class="down-btn"
                 href="/model/实训总结模板.pptx"
                 download="实训总结模板.pptx">下载</a>
            </div>
            <div class="file docx">
              <i class="docx"></i>
              <div class="file-title">实训总结模板.docx</div>
              <a class="down-btn"
                 href="/model/实训总结模板.docx"
                 download="实训总结模板.docx">下载</a>
            </div>
            <div class="file xlsx">
              <i class="xlsx"></i>
              <div class="file-title">实训总结模板.xlsx</div>
              <a class="down-btn"
                 href="/model/实训总结模板.xlsx"
                 download="实训总结模板.xlsx">下载</a>
            </div>
          </div>
        </div>
        <div class="chart-wrapper no-back">
          <div class="title">上传制作好的模板<span> ( * 上传文件的大小最大为 20MB )</span></div>
          <div class="upload-content common-border">
            <el-upload action="#"
                       ref="upload"
                       :limit="1"
                       accept=".xlsx,.xls,.pptx,.ppt,.doc,.docx"
                       :show-file-list="false"
                       :http-request="fileUpload"
                       :on-success="upFileSuccess"
                       :on-exceed="handleExceed"
                       :before-upload="beforeUpload">
              <div class="upload-box">
                <div class="upload-txt">{{ result.pubResDTO ? '更改文档' : '上传文档'}}</div>
              </div>
            </el-upload>
            <!--  -->
            <div class="already"
                 v-if="result.pubResDTO">已上传的个人总结：<a @click="previewFile(result.pubResDTO)">{{ result.pubResDTO.resName }}</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 预览文件 -->
  <show-prev-file :previewData="previewData"
                  @closePreview="isShowPrevFile = false"
                  v-if="isShowPrevFile"></show-prev-file>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  studentExport,
  pubResSave,
  studentSave,
  studentSummary
} from '@/api/summarize.js'
import {
  getFileType
} from '@/common/js/tools'
import html2canvas from 'html2canvas'
import showPrevFile from '@/components/showPrevFile/index'
import {
  longConnection
} from '@/api/myTeam.js'
export default {
  data() {
    return {
      userId: localStorage.getItem('userId'), // userId
      classId: localStorage.getItem('classId'), // 班级id
      result: {}, // 详情
      uploadParams: {}, // 上传参数
      RadarMapNameArr: [], // 雷达图各项名字
      RadarMapClassScoreArr: [], // 雷达图班级平均分
      RadarMapPersonScoreArr: [], // 雷达图院校平均

      RadarMapNameArrTwo: [], // 雷达图各项名字
      RadarMapClassScoreArrTwo: [], // 雷达图班级平均分
      RadarMapTeamScoreArr: [], // 雷达图院校平均

      isShowPrevFile: false, // 预览文件遮罩
      previewData: {} // 预览url
    }
  },
  components: {
    showPrevFile
  },
  computed: {
    ...mapGetters([
      'userName'
    ])
  },
  mounted() {
    // this.longConnection()
    this.getRadarMapFun()
  },
  methods: {
    // 是否长连接
    async longConnection() {
      const res = await longConnection({
        classId: localStorage.getItem('classId'),
        teamId: localStorage.getItem('teamId')
      })
      if (res.code === '0') {
        // this.initWebSocket()
        this.createSocket()
      }
    },
    // 获取数据
    getRadarMapFun() {
      studentSummary({
        classId: this.classId
      }).then(res => {
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
            this.RadarMapNameArrTwo = [{
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
          this.loading = false
          this.$message.warning(res.message)
        }
      })
    },
    // 雷达图
    drawPie() {
      const flag = this.$refs.myChart
      const flagTwo = this.$refs.myChartTwo
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
                value: this.RadarMapClassScoreArr,
                name: '班级平均能力项成绩',
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
      if (flagTwo) {
        const myChartTwo = this.$echarts.init(flagTwo)
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
                value: this.RadarMapClassScoreArrTwo,
                name: '班级平均能力项成绩',
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
        myChartTwo.setOption(option)
      }
    },
    // Dom转图片
    async toImage() {
      // 解决截图不完整问题
      window.pageYOffset = 265
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      const canvas = await html2canvas(this.$refs.imageDom, {
        backgroundColor: '#fff'
      })
      if (canvas) {
        var context = canvas.getContext('2d')

        // 去除抗锯齿，增加清晰度
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false

        var src64 = canvas.toDataURL('image/jpeg')
        var imgFile = this.dataURLtoFile(canvas.toDataURL(), this.userName + '-实训总结.jpeg')

        var param = new FormData() // FormData 对象
        param.append('classId', this.classId)
        param.append('imgFile', imgFile)

        const res = await studentExport(param)
        if (res) {
          const url = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.userName + '-实训总结.zip')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {
        type: mime
      })
    },
    // 上传成功
    upFileSuccess(response, file, fileList) {
      if (this.uploadParams.filePath === '') {
        this.$message.warning('请先选取文件')
        return false
      }

      studentSave(this.uploadParams).then(res => {
        if (res.code === '0') {
          // 导入成功
          this.$message.success(res.message)
          this.$refs.upload.clearFiles()
          this.getRadarMapFun()
        } else if (res.code === '101') {
          this.$message.warning(res.message)
          this.$refs.upload.clearFiles()
        }
      })
    },
    // 上传文件超出个数
    handleExceed(files, fileList) {
      this.$message.warning('当前只能选择上传 1 个文件')
    },
    // 文件校验
    beforeUpload(file) {
      // 文件类型限制
      const FileExt = file.name.replace(/.+\./, '')
      if (['xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx'].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message.warning('请上传正确格式的文件！')
        return false
      }
      // 文件大小限制
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 20MB!')
        return false
      }
    },
    // 上传图片
    async fileUpload(e) {
      const url = await this.cos(e)
      // this.$forceUpdate()
      const name = e.file.name
      const resName = name
      // const resName = name.substring(0, name.lastIndexOf('.'))
      const resExt = name.substring(name.lastIndexOf('.') + 1)
      const resType = getFileType(resExt)

      const res = await pubResSave({
        resName: resName,
        downloadUrl: url,
        resType: resType,
        resExt: resExt,
        resSize: e.file.size,
        creator: this.userId
      })
      if (res.code === '0') {
        this.uploadParams.resId = res.result
        this.uploadParams.classId = this.classId
      } else {
        this.$message.warning(res.message)
      }
    },
    // 文件预览
    previewFile(item) {
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      if (item.converUrl) {
        this.previewData.imgUrl = item.converUrl
      } else {
        this.previewData.imgUrl = item.downloadUrl
      }
      this.isShowPrevFile = true
    }
  }
}
</script>

<style lang="scss">
.summarize-wrapper {
    width: 100%;
    &.isDialog {
        height: 0;
    }
    .banner-wrapper {
        max-width: 1600px;
        height: 355px;
        margin: 0 auto;
        background: linear-gradient(226deg,rgba(115,215,102,1) 0%,rgba(61,212,113,1) 100%);
        box-shadow: 0 10px 40px 0 rgba(33,80,67,0.2);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        .container {
            position: relative;
            width: 1200px;
            height: calc(100% - 150px);
            margin: 0 auto;
            padding-top: 87px;
            color: #fff;
            background: url("./images/child.png") no-repeat right 7px top 18px;
            background-size: 668px;
            .title {
                font-size: 30px;
                font-weight: 500;
                line-height: 48px;
            }
            .content {
                font-size: 14px;
                line-height: 30px;
            }
            .export-btn {
                z-index: 10;
                position: absolute;
                top: 240px;
                right: 58px;
                width: 130px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                background: url("../../common/images/default_sprit.png") no-repeat -2px -230px;
                cursor: pointer;
            }
        }
    }
    .content-wrapper {
        width: 1200px;
        margin: -150px auto 0;
        &.other {
            margin: 0 auto;
        }
        .card-wrapper {
            width: 100%;
            padding: 0 58px;
            margin-bottom: 30px;
            box-shadow: 0 2px 20px 0 rgba(35,35,35,0.11);
            border-radius: 8px;
            background: #fff;
            .card-title {
                line-height: 108px;
                color: #40D36F;
                font-size: 24px;
                font-weight: 500;
            }
            .card-content {
                display: flex;
                justify-content: space-between;
                &.long {
                    flex-wrap: wrap;
                }
                .chart-wrapper {
                    width: 520px;
                    margin-bottom: 45px;
                    background: url("./images/back-chart.png") no-repeat center bottom;
                    border-radius: 8px;
                    .title {
                        height: 64px;
                        line-height: 64px;
                        color: #fff;
                        font-size: 20px;
                        font-weight: 500;
                        background: url("./images/back-title.png") no-repeat;
                        background-size: 100%;
                        padding-left: 65px;
                        span {
                            font-size: 14px;
                        }
                    }
                    &.no-back {
                        width: 100%;
                        background: none;
                        .title {
                            background: url("./images/back-title-long.png") no-repeat;
                            background-size: 100%;
                        }
                    }
                    .common-border {
                        border: 2px solid rgba(236,236,236,1);
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        border-top: none;
                    }
                    .min-content {
                        height: 333px;
                        background: url("./images/back-progress.png") no-repeat center center;
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
                    .max-content {
                        height: 506px;
                        padding: 15px 35px;
                        opacity: 0.86;
                    }
                    .download-content {
                        height: 202px;
                        padding: 30px 35px 0;
                        display: flex;
                        justify-content: space-between;
                        .file {
                            position: relative;
                            width: 323px;
                            height: 132px;
                            padding: 16px;
                            box-shadow: 0 2px 20px 0 rgba(35,35,35,0.11);
                            border-radius: 8px;
                            font-size: 14px;
                            color: #303133;
                            i {
                                display: block;
                                width: 100px;
                                height: 100px;
                                float: left;
                                background: url("../../common/images/default_sprit.png") no-repeat;
                                &.pptx {
                                    background-position: -114px 0;
                                }
                                &.docx {
                                    background-position: 0 0;
                                }
                                &.xlsx {
                                    background-position: -228px 0;
                                }
                            }
                            .file-title {
                                float: left;
                                margin-top: 10px;
                                margin-left: 17px;
                            }
                            .down-btn {
                                position: absolute;
                                right: 20px;
                                bottom: 18px;
                                cursor: pointer;
                                width: 60px;
                                height: 28px;
                                line-height: 28px;
                                text-align: center;
                                color: #fff;
                                border-radius: 14px;
                                background: linear-gradient(93deg,rgba(64,212,112,1) 0%,rgba(113,215,102,1) 100%);
                            }
                        }
                    }
                    .upload-content {
                        display: flex;
                        height: 282px;
                        padding: 30px 35px 0;
                        .upload-box {
                            width: 220px;
                            height: 220px;
                            text-align: center;
                            font-size: 14px;
                            color: #323937;
                            padding-top: 145px;
                            background: url("./images/add-btn.png") no-repeat center 50px;
                            box-shadow: 0 2px 20px 0 rgba(35,35,35,0.11);
                            border-radius: 8px;
                        }
                        .already {
                            margin: 20px 30px;
                            font-size: 16px;
                            a {
                                text-decoration: underline;
                                color: #3dd471;
                                margin-left: 5px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
