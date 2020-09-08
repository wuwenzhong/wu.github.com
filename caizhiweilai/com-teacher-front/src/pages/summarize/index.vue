<template>
  <div class="summarize-wrapper" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中..." element-loading-background="rgba(255, 255, 255, 0.5)">
    <el-row class="mb24">
      <el-col :span="1.5" class="fr">
        <el-button type="primary" size="small" @click="handleExport()">导出</el-button>
      </el-col>

      <el-col :span="1.5" class="fr mr15">
        <el-input size="small" v-model="queryParams.keywords" suffix-icon="el-icon-search" @keyup.native="getSearchList(this)" placeholder="请输入姓名或手机号"></el-input>
      </el-col>
    </el-row>

    <el-table ref="multipleTable" :data="studentList" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center">
            <template slot-scope="scope">
                <span>{{(queryParams.page - 1) * queryParams.size + scope.$index + 1}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="identityCode" label="学号" align="center"></el-table-column>
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === 1">男</span>
          <span v-if="scope.row.gender === 0">女</span>
          <span v-if="scope.row.gender === 2">保密</span>
        </template>
      </el-table-column>
      <el-table-column label="小组名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.teamName ? scope.row.teamName : '未分组' }}
        </template>
      </el-table-column>
      <el-table-column label="提交状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">已提交</span>
          <span v-if="scope.row.state === 0">未提交</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" style="color: #36CEA9" @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      :hidden="total <= 10"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="changePage"
    />

    <!-- 批量隐藏元素 -->
    <div class="summarize-dialog hidden-wrapper" v-for="(item, index) in summarizesData" :key="index">
      <div class="export-wrapper" :ref="`imageDom${index}`">
        <div class="area-title">我的能力项分布</div>
        <el-row :gutter="18">
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="common-card">
              <div class="common-title">个人能力雷达图</div>
              <div class="radar-box" :ref="`myChart${index}`" style="width: 100%; height: 550px"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="common-card">
              <div class="common-title">团队能力雷达图</div>
              <div class="radar-box" :ref="`myChartTwo${index}`" style="width: 100%; height: 550px"></div>
            </div>
          </el-col>
        </el-row>
        <div class="area-title">我的任务进度</div>
        <div class="task-progress">
          <span>个人任务进度：</span>
          <div class="progress"><el-progress :text-inside="true" :stroke-width="20" :percentage="item.personalProgress"></el-progress></div>
        </div>
        <div class="task-progress">
          <span>团队任务进度：</span>
          <div class="progress"><el-progress :text-inside="true" :stroke-width="20" :percentage="item.teamProgress"></el-progress></div>
        </div>
        <div class="area-title">我的考试成绩</div>
        <el-table :data="item.examStuStatisticsDTOList" style="width: 80%; margin: 0 auto">
          <el-table-column prop="paperName" label="考试名称" align="center"></el-table-column>
          <el-table-column prop="useTime" label="总用时" align="center"></el-table-column>
          <el-table-column label="正确率" align="center">
            <template slot-scope="scope">
              {{ scope.row.accuracy ? scope.row.accuracy : '---' }}
            </template>
          </el-table-column>
          <el-table-column label="成绩" align="center">
            <template slot-scope="scope">
              {{ scope.row.score ? scope.row.score : '---' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog :show-close="false" :visible.sync="dialogDetail" custom-class="summarize-dialog" :close-on-click-modal="false">
      <el-button type="primary" size="small" class="export-btn" @click="dialogDetail = false">关闭</el-button>
      <el-button type="primary" size="small" class="export-btn" @click="toImage('1', '')">导出</el-button>
      <div class="export-wrapper" ref="imageDom">
        <div class="area-title">我的能力项分布</div>
        <el-row :gutter="18">
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="common-card">
              <div class="common-title">个人能力雷达图</div>
              <div class="radar-box" ref="myChart" style="width: 100%; height: 550px"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="common-card">
              <div class="common-title">团队能力雷达图</div>
              <div class="radar-box" ref="myChartTwo" style="width: 100%; height: 550px"></div>
            </div>
          </el-col>
        </el-row>
        <div class="area-title">我的任务进度</div>
        <div class="task-progress">
          <span>个人任务进度：</span>
          <div class="progress"><el-progress :text-inside="true" :stroke-width="20" :percentage="result.personalProgress"></el-progress></div>
        </div>
        <div class="task-progress">
          <span>团队任务进度：</span>
          <div class="progress"><el-progress :text-inside="true" :stroke-width="20" :percentage="result.teamProgress"></el-progress></div>
        </div>
        <div class="area-title">我的考试成绩</div>
        <el-table :data="result.examStuStatisticsDTOList" style="width: 80%; margin: 0 auto">
          <el-table-column prop="paperName" label="考试名称" align="center"></el-table-column>
          <el-table-column prop="useTime" label="总用时" align="center"></el-table-column>
          <el-table-column label="正确率" align="center">
            <template slot-scope="scope">
              {{ scope.row.accuracy ? scope.row.accuracy : '---' }}
            </template>
          </el-table-column>
          <el-table-column label="成绩" align="center">
            <template slot-scope="scope">
              {{ scope.row.score ? scope.row.score : '---' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="export-wrapper">
        <div class="area-title">我的个人总结</div>
        <div class="template-wrapper">
          <div class="template-list">
            <div class="already" v-if="result.pubResDTO">已上传的个人总结：<a @click="previewFile(result.pubResDTO)">{{ result.pubResDTO.resName }}</a></div>
            <div class="already" v-else>暂未上传个人总结</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>

    <!-- 团队弹窗 -->
    <el-dialog :show-close="false" :visible.sync="dialogTeam" width="516px" custom-class="team-dialog" :close-on-click-modal="false">
      <el-table stripe :data="teamList">
        <el-table-column property="teamName" label="团队名称" align="center"></el-table-column>
        <el-table-column property="num" label="团队人数" align="center"></el-table-column>
        <el-table-column property="summaryNum" label="已提交" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleExportTeam(scope.row.id, scope.row.teamName)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :hidden="totalTeam <= 10"
        :total="totalTeam"
        :layout="'total, prev, pager, next'"
        :page.sync="queryTeamParams.page"
        :limit.sync="queryTeamParams.size"
        @pagination="teamListFun"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="dialogTeam = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { _vueDebounce } from '@/common/js/utils.js'
import { teacherSummaryusers, studentExport, stuSummaryDetail, statisticsList, teacherExport, teamList, teamInteam, downloadFile } from '@/api/summarize'
import html2canvas from 'html2canvas'
import showPrevFile from '@/components/showPrevFile/index'

export default {
  name: 'SummarizePage',
  data() {
    return {
      classId: localStorage.getItem('classId'), // 班级id
      // 学生查询参数
      queryParams: {
        page: 1,
        size: 10,
        keywords: ''
      },
      currentSizeChange: 10,
      result: {}, // 查看实训详情
      studentId: '', // 学生id
      studentName: '', // 学生姓名
      studentUserIds: [], // 选中学生Id数组
      // paramData: new FormData(), // dom文件参数
      imgUrls: [], // dom生成图片数组
      studentUserNames: [], // 选中学生姓名数组
      multipleSelection: [], // 选中数组
      total: 0, // 总条数
      studentList: [], // 学生列表
      summarizesData: [], // 批量元素数据
      dialogDetail: false, // 实训详情
      fullscreenLoading: false, // 全局遮罩 用于下载
      isShowPrevFile: false, // 预览文件遮罩
      previewData: {}, // 预览参数
      dialogTeam: false, // 团队列表弹窗
      teamList: [], // 团队列表
      totalTeam: 0, // 团队总条数
      // 团队查询参数
      queryTeamParams: {
        page: 1,
        size: 10
      },
      oneClassArr: [],
      onePersonArr: [],
      oneArr: [],
      twoClassArr: [],
      twoTeamArr: [],
      twoArr: []
    }
  },
  components: {
    showPrevFile
  },
  created() {
    this.getStudentList()
  },
  watch: {
    'queryParams.keywords': {
      handler(newVal, oldVal) {
        this.queryParams.page = 1
        this.getSearchList()
      },
      deep: true
    }
  },
  methods: {
    // 切换分页
    changePage(obj) {
      if (this.currentSizeChange !== obj.limit) {
        this.queryParams.page = 1
        this.currentSizeChange = obj.limit
      } else {
        this.queryParams.page = obj.page
      }
      this.queryParams.size = obj.limit
      this.getStudentList()
    },
    // 获取列表
    getStudentList() {
      this.queryParams.classId = this.classId
      teacherSummaryusers(this.queryParams).then(res => {
        if (res.code === '0') {
          this.studentList = res.result.data
          this.total = Number(res.result.total)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 键盘抬起搜索
    getSearchList: _vueDebounce('getStudentList', 500),
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导出弹窗
    handleExport() {
      this.teamListFun()
      this.dialogTeam = true
    },
    // 团队列表
    teamListFun() {
      this.queryTeamParams.classId = this.classId
      teamList(this.queryTeamParams).then(res => {
        if (res.code === '0') {
          this.teamList = res.result.data
          this.totalTeam = Number(res.result.total)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 导出
    handleExportTeam(id, teamName) {
      // if (this.multipleSelection.length === 0) {
      //   this.$message.warning('请先选中要 导出 的学生')
      //   return false
      // } else if (this.multipleSelection.length > 10) {
      //   this.$message.warning('最多一次导出 10条 学生实训')
      //   return false
      // }

      this.$confirm('确定要导出 “' + teamName + '” 的实训成果吗？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        confirmButtonClass: 'el-button--medium',
        cancelButtonClass: 'el-button--medium',
        type: 'warning'
      }).then(() => {
        // 获取团队成员信息
        teamInteam({ teamId: id }).then(res => {
          if (res.code === '0') {
            this.studentUserIds.length = 0 // 每次都清空为0
            this.studentUserNames.length = 0
            res.result.forEach((item) => {
              this.studentUserIds.push(item.userId)
              this.studentUserNames.push(item.name)
            })

            // 获取数据
            statisticsList({ classId: this.classId, userIds: this.studentUserIds.toString() }).then(async(res) => {
              if (res.code === '0') {
                // 加载动画
                this.fullscreenLoading = true
                // 获取雷达图等数据
                this.summarizesData = res.result
                this.imgUrls.length = 0 // 清空图片数组

                for (let i = 0; i < this.summarizesData.length; i++) {
                  // 雷达图
                  if (this.summarizesData[i].personAndClass) {
                    this.oneClassArr = this.summarizesData[i].personAndClass.indicator.map(item => item.classScore)
                    this.onePersonArr = this.summarizesData[i].personAndClass.indicator.map(item => item.personScore)
                    const classScoreMax = Math.max(...this.oneClassArr)
                    const personScoreMax = Math.max(...this.onePersonArr)
                    const scoreMax = classScoreMax > personScoreMax ? Math.ceil(classScoreMax) : Math.ceil(personScoreMax)
                    this.oneArr = this.summarizesData[i].personAndClass.indicator.map(item => {
                      return {
                        name: item.name,
                        max: scoreMax === 0 ? 1 : scoreMax
                      }
                    })
                  } else {
                    this.oneClassArr = [0, 0, 0, 0, 0]
                    this.onePersonArr = [0, 0, 0, 0, 0]
                    this.oneArr = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
                  }

                  // 雷达图
                  if (this.summarizesData[i].teamAndClass) {
                    this.twoClassArr = this.summarizesData[i].teamAndClass.indicator.map(item => item.classScore)
                    this.twoTeamArr = this.summarizesData[i].teamAndClass.indicator.map(item => item.teamScore)
                    const classScoreMaxTwo = Math.max(...this.twoClassArr)
                    const teamScoreMax = Math.max(...this.twoTeamArr)
                    const scoreMaxTwo = classScoreMaxTwo > teamScoreMax ? Math.ceil(classScoreMaxTwo) : Math.ceil(teamScoreMax)
                    this.twoArr = this.summarizesData[i].teamAndClass.indicator.map(item => {
                      return {
                        name: item.name,
                        max: scoreMaxTwo === 0 ? 1 : scoreMaxTwo
                      }
                    })
                  } else {
                    this.twoClassArr = [0, 0, 0, 0, 0]
                    this.twoTeamArr = [0, 0, 0, 0, 0]
                    this.twoArr = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
                  }
                  // 获取数据
                  await this.$nextTick(() => {})
                  await this.drawPie(this.$refs[`myChart${i}`][0], this.oneClassArr, this.onePersonArr, this.oneArr, this.$refs[`myChartTwo${i}`][0], this.twoClassArr, this.twoTeamArr, this.twoArr)
                  // Dom转图片
                  await this.toImage('', i)
                }

                // 结束动画
                this.fullscreenLoading = false

                const resData = await teacherExport({
                  classId: this.classId,
                  userIds: this.studentUserIds,
                  imgUrls: this.imgUrls
                })
                if (resData.code == '0') {
                  window.location.href = resData.result.url

                  // downloadFile(resData.result.url).then(res => {
                  //   const url = window.URL.createObjectURL(new Blob([res]))
                  //   const link = document.createElement('a')
                  //   link.style.display = 'none'
                  //   link.href = url
                  //   link.setAttribute('download', resData.result.zipName)
                  //   document.body.appendChild(link)
                  //   link.click()
                  //   document.body.removeChild(link)
                  // })
                } else {
                  this.$message.warning(resData.message)
                }

                // var form = document.createElement('form')
                // document.getElementsByTagName('body')[0].appendChild(form)
                // form.setAttribute('style', 'display:none')
                // // form.setAttribute('target', '_blank')
                // form.setAttribute('method', 'post')
                // form.setAttribute('enctype', 'multipart/form-data')
                // form.setAttribute('action', '/api/cls/front/summary/teacher/export')// 下载文件的请求路径

                // for (var key of paramData.keys()) {
                //   var input = document.createElement('input')
                //   input.setAttribute('type', 'hidden')
                //   input.setAttribute('name', key)
                //   input.setAttribute('value', paramData.get(key))
                //   form.appendChild(input)
                // }

                // form.submit()
                // document.body.removeChild(form)
              } else {
                this.fullscreenLoading = false
                this.$message.warning(res.message)
              }
            })
          } else {
            this.fullscreenLoading = false
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        // this.$message.info('已取消')
      })
    },
    // 查看
    handleDetail(row) {
      this.getRadarMapFun(row.id)
      this.studentId = row.id
      this.studentName = row.name
      this.dialogDetail = true
    },
    // 获取数据
    getRadarMapFun(id) {
      stuSummaryDetail({ classId: this.classId, userId: id }).then(res => {
        if (res.code === '0') {
          this.result = res.result

          // 雷达图
          if (this.result.personAndClass) {
            this.oneClassArr = this.result.personAndClass.indicator.map(item => item.classScore)
            this.onePersonArr = this.result.personAndClass.indicator.map(item => item.personScore)
            const classScoreMax = Math.max(...this.oneClassArr)
            const personScoreMax = Math.max(...this.onePersonArr)
            const scoreMax = classScoreMax > personScoreMax ? Math.ceil(classScoreMax) : Math.ceil(personScoreMax)
            this.oneArr = this.result.personAndClass.indicator.map(item => {
              return {
                name: item.name,
                max: scoreMax === 0 ? 1 : scoreMax
              }
            })
          } else {
            this.oneClassArr = [0, 0, 0, 0, 0]
            this.onePersonArr = [0, 0, 0, 0, 0]
            this.oneArr = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
          }

          // 雷达图
          if (this.result.teamAndClass) {
            this.twoClassArr = this.result.teamAndClass.indicator.map(item => item.classScore)
            this.twoTeamArr = this.result.teamAndClass.indicator.map(item => item.teamScore)
            const classScoreMaxTwo = Math.max(...this.twoClassArr)
            const teamScoreMax = Math.max(...this.twoTeamArr)
            const scoreMaxTwo = classScoreMaxTwo > teamScoreMax ? Math.ceil(classScoreMaxTwo) : Math.ceil(teamScoreMax)
            this.twoArr = this.result.teamAndClass.indicator.map(item => {
              return {
                name: item.name,
                max: scoreMaxTwo === 0 ? 1 : scoreMaxTwo
              }
            })
          } else {
            this.twoClassArr = [0, 0, 0, 0, 0]
            this.twoTeamArr = [0, 0, 0, 0, 0]
            this.twoArr = [{ name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }, { name: '暂无数据', max: 1 }]
          }

					this.drawPie(this.$refs.myChart, this.oneClassArr, this.onePersonArr, this.oneArr, this.$refs.myChartTwo, this.twoClassArr, this.twoTeamArr, this.twoArr)
        } else {
          this.loading = false
          this.$message.warning(res.message)
        }
      })
    },
    // 雷达图
    drawPie(myChart, oneClassArr, onePersonArr, oneArr, myChartTwo, twoClassArr, twoTeamArr, twoArr) {
      const flag = myChart
      const flagTwo = myChartTwo

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
            animation: false,
            data: [
              {
                value: onePersonArr,
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
                value: oneClassArr,
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
            indicator: twoArr,
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
            animation: false,
            data: [
              {
                value: twoTeamArr,
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
                value: twoClassArr,
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
    async toImage(exportOne, index) {
      // 解决截图不完整问题
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      if (exportOne) {
        html2canvas(this.$refs.imageDom).then(canvas => {
          if (canvas) {
            var context = canvas.getContext('2d')

            // 去除抗锯齿，增加清晰度
            context.mozImageSmoothingEnabled = false
            context.webkitImageSmoothingEnabled = false
            context.msImageSmoothingEnabled = false
            context.imageSmoothingEnabled = false

            var src64 = canvas.toDataURL('image/jpeg')
            var imgFile = this.dataURLtoFile(canvas.toDataURL(), this.studentName + '-实训统计.jpeg')

            var param = new FormData() // FormData 对象
            param.append('classId', this.classId)
            param.append('userId', this.studentId)
            param.append('imgFile', imgFile)

            studentExport(param).then(res => {
              if (res) {
                const url = window.URL.createObjectURL(new Blob([res]))
                const link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', this.studentName + '-实训总结.zip')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })
          }
        })
      } else {
        const canvas = await html2canvas(this.$refs[`imageDom${index}`][0])
        if (canvas) {
          var context = canvas.getContext('2d')

          // 去除抗锯齿，增加清晰度
          context.mozImageSmoothingEnabled = false
          context.webkitImageSmoothingEnabled = false
          context.msImageSmoothingEnabled = false
          context.imageSmoothingEnabled = false

          var src64 = canvas.toDataURL('image/jpeg').split(';base64,')[1]
          // var imgFile = this.studentUserNames[index] + '|' + src64
          var imgFile = this.dataURLtoFile(canvas.toDataURL('image/jpeg'), this.studentUserNames[index] + '-实训统计.jpeg')

          var filePath = await this.cos('', imgFile, 'summary/', '_' + this.studentUserNames[index] + '-实训统计')
          // this.paramData.set('classId', this.classId)
          // this.paramData.set('userIds', this.studentUserIds)
          // this.paramData.append('imgFiles', imgFile)

          this.imgUrls.push(this.studentUserNames[index] + '-' + filePath)
        }
      }
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','); var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 文件预览
    previewFile(item) {
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      if (item.resType === 'EXCEL' || item.resType == 'PPT' || item.resType == 'TXT' || item.resType == 'WORD') {
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
.summarize-wrapper{
  padding: 26px 20px;
  height: 100%;
  .summarize-dialog {
    width: 1140px;
    height: 88vh;
    overflow: auto;
    margin: 6vh auto !important;
    &.hidden-wrapper {
      // position: absolute;
      // top: -9999px;
      // left: -9999px;
      .export-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        width: 1140px;
        z-index: -1000;
      }
    }
    .el-dialog__header {
      // padding: 0;
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
    .export-btn {
      float: right;
      margin-top: 20px;
      margin-right: 20px;
    }
    .export-wrapper {
      padding: 20px;
      background: #fff;
      border-radius: 4px;
      .area-title {
        font-size: 22px;
        font-weight: 500;
        margin: 20px 0;
        &:first-of-type{
          margin-top: 0;
        }
      }
      .task-progress {
        width: 80%;
        display: flex;
        margin: 0 auto 30px;
        span {
          display: block;
          width: 155px;
          line-height: 20px;
          font-size: 16px;
          color: #333;
        }
        .progress {
          width: 100%;
          .el-progress-bar__innerText {
            color: #333;
          }
        }
      }
      .common-card {
        width: 100%;
        height: 648px;
        background: #fff url('../../common/images/back.png') no-repeat bottom;
        background-size: 100%;
        position: relative;
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
        .radar-box {
          margin-top: 18px;
        }
      }
      .template-wrapper {
        width: 80%;
        margin: 0 auto;
        font-size: 16px;
        color: #333;
        div{
          margin-bottom: 15px;
        }
        .template-list {
          display: flex;
          height: 36px;
          line-height: 36px;
          margin-bottom: 25px;
          &:last-of-type{
            margin-bottom: 10px;
          }
          .already {
            height: 100%;
          }
        }
        a {
          display: inline-block;
          padding-right: 50px;
          color: #36CEA9;
          text-decoration: underline;
        }
      }
    }
  }
  .team-dialog {
    margin-top: 10vh !important;
    .el-dialog__header {
      // padding: 0;
      display: none;
    }
    .el-dialog__body {
      padding-top: 10px;
      .pagination-container {
        padding: 10px 0 0;
      }
    }
  }
}
</style>
