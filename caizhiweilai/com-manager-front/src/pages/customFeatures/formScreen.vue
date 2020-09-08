<template>
  <div class="form-screen-wrapper">
    <div class="left-container">
      <div class="chose-course">
        <span>选择课程: </span>
        <el-select v-model="noConserve.id" @change="selectCourseBefore()" class="fr" placeholder="请选择课程">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-input v-model="courseParams.keyWrods" suffix-icon="el-icon-search" placeholder="请输入任务名称"></el-input>
      <div class="task-wrapper">
        <div class="outline-list" v-for="(item, index) in taskList" :key="index">
          <div
            class="task-list"
            v-for="(item1,index1) in item.taskDTOList" :key="index1"
            @click='handleChoseTaskBofore(item1.formInfoDTOS, item1.courseId, item.outlineId, item1.id)'
            :class="{ active : noConserve.taskId == item1.id }"
          >{{item.sort}}.{{item1.sort}}、{{item1.taskName}}</div>
        </div>
        <div class="outline-list" v-show="taskList.length == 0">
          <div class="task-list">暂无数据~~~</div>
        </div>
      </div>
    </div>
    <div class="right-container">
      <!-- <div style="width: 1246px"> -->
      <div style="width: 1216px">
        <div class="header-tabs">
          <el-radio-group @change="selectInfoCodeBefore()" v-model="noConserve.formInfoCode" size="medium">
            <el-radio-button v-for="(item, index) in formInfoDTOS" :key="index" :label="item.code">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="left-tabs"
          v-show="queryParams.formInfoCode == 'CZBDZZSZYFP' || queryParams.formInfoCode == 'CZBDJZPZ' || queryParams.formInfoCode == 'CZBDZCFZB' || queryParams.formInfoCode == 'CZBDXJLLB' || queryParams.formInfoCode == 'CZBDLRB'"
        >
          <el-radio-group @change="selectSetTypeBefore()" v-model="noConserve.setType" size="medium">
            <el-radio-button label="1">设置答案</el-radio-button>
            <el-radio-button label="2">设置权重</el-radio-button>
            <el-radio-button label="3">默认数据</el-radio-button>
          </el-radio-group>

          <el-button type="primary" size="medium"
            style="float: right; background-color: #414D65; margin-right: 4%"
            @click="handleConserve()"
          >保存</el-button>
        </div>

        <!-- 增值税发票 -->
        <CzbdZzszyfp
          ref="zzszyfp"
          v-if="queryParams.formInfoCode == 'CZBDZZSZYFP'"
          :queryParams='queryParams'
          :formParams='formParams'
          :choseTime='choseTime'
          @blur-event="blurText"
        ></CzbdZzszyfp>

        <!-- 记账凭证 -->
        <CzbdJzpz
          ref="jzpz"
          v-if="queryParams.formInfoCode == 'CZBDJZPZ'"
          :queryParams='queryParams'
          :formParams='formParams'
          :selectedArray='selectedArray'
          :choseTime='choseTime'
          @blur-event="blurText"
        ></CzbdJzpz>

        <!-- 资产负债表 -->
        <CzbdZcfzb
          ref="zcfzb"
          v-if="queryParams.formInfoCode == 'CZBDZCFZB'"
          :queryParams='queryParams'
          :formParams='formParams'
          :choseTime='choseTime'
          @blur-event="blurText"
        ></CzbdZcfzb>

        <!-- 现金流量表 -->
        <CzbdXjllb
          ref="xjllb"
          v-if="queryParams.formInfoCode == 'CZBDXJLLB'"
          :queryParams='queryParams'
          :formParams='formParams'
          :choseTime='choseTime'
          @blur-event="blurText"
        ></CzbdXjllb>

        <!-- 利润表 -->
        <CzbdLrb
          ref="lrb"
          v-if="queryParams.formInfoCode == 'CZBDLRB'"
          :queryParams='queryParams'
          :formParams='formParams'
          :choseTime='choseTime'
          @blur-event="blurText"
        ></CzbdLrb>

      </div>
    </div>
  </div>
</template>

<script>
import { screenTaxRate, accountSubjectListBy, screenSaveWeight, screenGetWeight, screenGetValue, screenSaveValue, screenSaveAnswer, screenGetAnswer, getCourseList, getTaskList } from '@/api/formAbout.js'
import { _vueDebounce, numberAdd, deepClone, isObjectValueEqual } from '@/common/js/utils.js'

import CzbdZzszyfp from './component/formAbout/CzbdZzszyfp'
import CzbdJzpz from './component/formAbout/CzbdJzpz'
import CzbdZcfzb from './component/formAbout/CzbdZcfzb'
import CzbdXjllb from './component/formAbout/CzbdXjllb'
import CzbdLrb from './component/formAbout/CzbdLrb'

export default {
  components: {
    CzbdZzszyfp,
    CzbdJzpz,
    CzbdZcfzb,
    CzbdXjllb,
    CzbdLrb
  },
  data() {
    return {
      courseOptions: [], // 课程列表
      courseParams: {
        id: '', // 已选课程
        keyWrods: '' // 搜索任务名称
      },
      taskList: [], // 任务列表
      formInfoDTOS: [], // tabs列表 记账凭证-增值税-资产负债
      // 保存参数
      queryParams: {
        number: 76, // 输入框数量
        formInfoCode: '', // tab选项
        setType: '1', // tab选项
        taskId: '' // 任务id
      }, // 保存参数
      noConserve: {
        formInfoCode: '', // tab选项
        setType: '1', // tab选项
        taskId: '' // 任务id
      }, // 未保存参数
      formParams: {}, // json串
      formParamsCopy: {}, // 拷贝json串
      formParamsAll: {}, // 保存参数
      selectedArray: {
        input22: [], // 选中的科目下拉
        input23: [],
        input24: [],
        input25: [],
        input26: [],
        input27: [],
        input182: false, // 选中的多选框
        input183: false,
        input184: false,
        input185: false,
        input186: false,
        input187: false,
        input188: false
      },
      choseTime: {} // 选择时间
    }
  },
  created() {
    // 获取课程列表
    this.init()
  },
  watch: {
    'courseParams.keyWrods': {
      handler(newVal, oldVal) {
        this.getSearchList()
      },
      deep: true
    },
    queryParams: {
      async handler(newVal, oldVal) {
        // console.log(newVal)
        if (newVal.setType == '2') {
          // 获取权重
          const res = await screenGetWeight(this.queryParams)
          if (res.code === '0') {
            if (res.result == undefined) {
              this.formParams = {}
              this.formParamsCopy = {}
            } else {
              this.formParams = JSON.parse(res.result.weightValue)
              this.formParamsCopy = deepClone(JSON.parse(res.result.weightValue))
            }
          } else {
            this.$message.warning(res.message)
          }
        } else {
          // 获取答案及默认数据
          let res
          if (newVal.setType == '1') {
            // 设计答案
            res = await screenGetAnswer(this.queryParams)
          } else {
            // 默认数据
            res = await screenGetValue(this.queryParams)
          }
          if (res.code === '0') {
            if (res.result == undefined) {
              this.formParams = {}
              this.formParamsCopy = {}
              this.selectedArray = {
                input22: [], // 选中的科目下拉
                input23: [],
                input24: [],
                input25: [],
                input26: [],
                input27: [],
                input182: false, // 选中的多选框
                input183: false,
                input184: false,
                input185: false,
                input186: false,
                input187: false,
                input188: false
              }
              this.choseTime = {}
            } else {
              this.formParams = JSON.parse(res.result.answerValue)
              this.formParamsCopy = deepClone(JSON.parse(res.result.answerValue))
              if (this.queryParams.formInfoCode == 'CZBDJZPZ') {
                for (let i = 22; i <= 27; i++) {
                  if (this.formParams['input' + i] != '' && this.formParams['input' + i] != undefined) {
                    this.selectedArray['input' + i] = this.formParams['input' + i].split(',')
                  }
                  // 根据联动的值获取数组
                  this.$refs.jzpz.getSelectList('input' + i, this.formParams['input' + (i - 6)])
                }
                for (let i = 182; i <= 188; i++) {
                  if (this.formParams['input' + i] != '' && this.formParams['input' + i] != undefined) {
                    // this.selectedArray['input' + i] = Boolean(this.formParams['input' + i])
                    // 字符串转boolean
                    const flag = this.formParams['input' + i] !== 'false'
                    this.selectedArray['input' + i] = flag
                  } else {
                    this.selectedArray['input' + i] = false
                  }
                  // console.log(this.selectedArray['input' + i])
                }
              }
              //  向子组件传输时间值
              if (this.queryParams.formInfoCode == 'CZBDZZSZYFP' && this.formParams.input4) {
                this.choseTime.time = new Date(this.formParams.input4)
              } else if (this.queryParams.formInfoCode == 'CZBDZCFZB' && this.formParams.input121) {
                this.choseTime.time = new Date(this.formParams.input121)
              } else if (this.queryParams.formInfoCode == 'CZBDXJLLB' && this.formParams.input81) {
                this.choseTime.time = new Date(this.formParams.input81)
              } else if (this.queryParams.formInfoCode == 'CZBDLRB' && this.formParams.input55) {
                this.choseTime.time = new Date(this.formParams.input55)
              }
            }
          } else {
            this.$message.warning(res.message)
          }
        }

        // if (newVal.formInfoCode == 'CZBDJZPZ') {
        //   // 记账凭证
        //   newVal.number = 76
        // } else if (newVal.formInfoCode == 'CZBDZZSZYFP') {
        //   // 增值税专用发票
        //   newVal.number = 188
        // } else if (newVal.formInfoCode == 'CZBDZCFZB') {
        //   // 资产负债表
        //   newVal.number = 122
        // }
      },
      deep: true
    }
  },
  methods: {
    // 课程列表
    init() {
      getCourseList().then(res => {
        if (res.code == '0') {
          this.courseOptions = res.result
          if (res.result.length > 0) {
            this.noConserve.id = res.result[0].id

            // 获取任务列表
            this.selectCourseBefore()
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 切换 课程列表
    selectCourseBefore() {
      if (!this.queryParams.taskId) {
        this.selectCourse()
      } else if (!isObjectValueEqual(this.formParams, this.formParamsCopy)) {
        this.$confirm('您有修改未保存的数据，是否保存?', '删除', {
          confirmButtonText: '保存',
          cancelButtonText: '取消'
        }).then(() => {
          // TODO: 保存不成功时及时制止下一步操作
          this.handleConserve()
          // 置空搜索条件及选中任务
          this.courseParams.keyWrods = ''
          this.noConserve.taskId = ''
          this.selectCourse()
        }).catch(() => {
          this.$message('已取消')

          // 置空搜索条件及选中任务
          this.courseParams.keyWrods = ''
          this.noConserve.taskId = ''
          this.selectCourse()
        })
      } else {
        // 置空搜索条件及选中任务
        this.courseParams.keyWrods = ''
        this.noConserve.taskId = ''
        this.selectCourse()
      }
    },
    // 任务列表
    selectCourse() {
      // 根据课程id获取任务列表
      this.courseParams.id = this.noConserve.id
      getTaskList(this.courseParams).then(res => {
        if (res.code === '0') {
          this.taskList = res.result
          if (res.result.length > 0) {
            // 没有关键字并且已有选中任务时  搜索不自动选中
            if (!this.courseParams.keyWrods && !this.noConserve.taskId) {
              this.formInfoDTOS = res.result[0].taskDTOList[0].formInfoDTOS
              this.noConserve.formInfoCode = this.formInfoDTOS[0].code
              this.queryParams.formInfoCode = this.formInfoDTOS[0].code
              this.queryParams.courseId = res.result[0].taskDTOList[0].courseId
              this.queryParams.outlineId = res.result[0].taskDTOList[0].outlineId
              this.queryParams.taskId = res.result[0].taskDTOList[0].id
              this.noConserve.taskId = res.result[0].taskDTOList[0].id
            }
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 切换 记账凭证 增值税发票
    selectInfoCodeBefore() {
      if (!isObjectValueEqual(this.formParams, this.formParamsCopy)) {
        this.$confirm('您有修改未保存的数据，是否保存?', '删除', {
          confirmButtonText: '保存',
          cancelButtonText: '取消'
        }).then(() => {
          this.handleConserve()
          this.selectInfoCode()
        }).catch(() => {
          this.$message('已取消')
          this.selectInfoCode()
        })
      } else {
        this.selectInfoCode()
      }
    },
    // 更换绑定code
    selectInfoCode() {
      this.queryParams.formInfoCode = this.noConserve.formInfoCode
      if (this.queryParams.formInfoCode == 'CZBDJZPZ') {
        // 记账凭证
        this.queryParams.number = 76
      } else if (this.queryParams.formInfoCode == 'CZBDZZSZYFP') {
        // 增值税专用发票
        this.queryParams.number = 188
      } else if (this.queryParams.formInfoCode == 'CZBDZCFZB') {
        // 资产负债表
        this.queryParams.number = 122
      } else if (this.queryParams.formInfoCode == 'CZBDLRB') {
        // 利润表
        this.queryParams.number = 56
      } else if (this.queryParams.formInfoCode == 'CZBDXJLLB') {
        // 现金流量表
        this.queryParams.number = 82
      }
    },
    // 切换 设置答案 设置权重
    selectSetTypeBefore() {
      if (!isObjectValueEqual(this.formParams, this.formParamsCopy)) {
        this.$confirm('您有修改未保存的数据，是否保存?', '删除', {
          confirmButtonText: '保存',
          cancelButtonText: '取消'
        }).then(() => {
          this.handleConserve()
          this.selectSetType()
        }).catch(() => {
          this.$message('已取消')
          this.selectSetType()
        })
      } else {
        this.selectSetType()
      }
    },
    selectSetType() {
      this.queryParams.setType = this.noConserve.setType
    },
    // 键盘抬起搜索
    getSearchList: _vueDebounce('selectCourse', 500),
    // 选择任务
    handleChoseTaskBofore(formInfoDTOS, courseId, outlineId, taskId) {
      if (!isObjectValueEqual(this.formParams, this.formParamsCopy)) {
        this.$confirm('您有修改未保存的数据，是否保存?', '删除', {
          confirmButtonText: '保存',
          cancelButtonText: '取消'
        }).then(() => {
          this.handleConserve()

          this.handleChoseTask(formInfoDTOS, courseId, outlineId, taskId)
        }).catch(() => {
          this.$message('已取消')
          this.handleChoseTask(formInfoDTOS, courseId, outlineId, taskId)
        })
      } else {
        this.handleChoseTask(formInfoDTOS, courseId, outlineId, taskId)
      }
    },
    handleChoseTask(formInfoDTOS, courseId, outlineId, taskId) {
      this.formInfoDTOS = formInfoDTOS
      this.noConserve.formInfoCode = this.formInfoDTOS[0].code
      this.queryParams.formInfoCode = this.formInfoDTOS[0].code
      this.queryParams.courseId = courseId
      this.queryParams.outlineId = outlineId
      this.queryParams.taskId = taskId
      this.noConserve.taskId = taskId
    },
    // 输入正整数
    blurText(input, num = 100) {
      const boolean = new RegExp('^[0-9][0-9]*$').test(this.formParams[input])
      if (!boolean && this.formParams[input] != '' && this.formParams[input] != undefined) {
        this.$message.warning('请输入0或正整数！')
        this.formParams[input] = ''
      } else if (Number(this.formParams[input]) > num) {
        this.$message.warning('单个数据不能超过' + num)
        if (num > 10) {
          this.formParams[input] = 100
        } else {
          this.formParams[input] = 1
        }
      }
    },
    // 保存
    handleConserve() {
      if (isObjectValueEqual(this.formParams, this.formParamsCopy)) {
        this.$message.warning('您未修改数据，无需保存')
        return
      }
      const type = this.queryParams.setType
      const number = this.queryParams.number
      if (type == '1') {
        // 设置答案
        // 生成保存参数
        this.formParamsAll = deepClone(this.queryParams)
        this.formParamsAll.answerValue = JSON.stringify(this.formParams)
        screenSaveAnswer(this.formParamsAll).then(res => {
          if (res.code === '0') {
            this.$message.success(res.message)
            // 保存之后copy的数据更新
            this.formParamsCopy = deepClone(this.formParams)
            // 保存之后删掉参数
            // this.$delete(this.queryParams, 'answerValue')
            return true
          } else {
            this.$message.warning(res.message)
            return false
          }
        })
      } else if (type == '2') {
        // 设置权重
        let totalNum = 0
        for (let i = 1; i <= number; i++) {
          if (this.formParams['input' + i] != undefined) {
            totalNum = numberAdd(totalNum, this.formParams['input' + i])
          }
        }
        if (100 % totalNum != '0') {
          this.$message.warning('权重值之和必须是100的整除数！')
          return false
        } else {
          // 生成保存参数
          this.formParamsAll = deepClone(this.queryParams)
          this.formParamsAll.weightValue = JSON.stringify(this.formParams)
          screenSaveWeight(this.formParamsAll).then(res => {
            if (res.code === '0') {
              this.$message.success(res.message)
              // 保存之后copy的数据更新
              this.formParamsCopy = deepClone(this.formParams)
              // 保存之后删掉参数
              // this.$delete(this.queryParams, 'weightValue')
              return true
            } else {
              this.$message.warning(res.message)
              return false
            }
          })
        }
      } else if (type == '3') {
        // 设置默认数据
        // 生成保存参数
        this.formParamsAll = deepClone(this.queryParams)
        this.formParamsAll.answerValue = JSON.stringify(this.formParams)
        // this.queryParams.answerValue = JSON.stringify(this.formParams)
        screenSaveValue(this.formParamsAll).then(res => {
          if (res.code === '0') {
            this.$message.success(res.message)
            // 保存之后copy的数据更新
            this.formParamsCopy = deepClone(this.formParams)

            console.log(this.formParams)
            console.log(this.formParamsCopy)
            // 保存之后删掉参数
            // this.$delete(this.queryParams, 'answerValue')
            return true
          } else {
            this.$message.warning(res.message)
            return false
          }
        })
      } else {
        this.$message.warning('请您选择合适的类型！')
      }
    }
  }
}
</script>

<style lang="scss">
  .form-screen-wrapper {
    width: 100%;
    height: 100%;
    padding: 15px 0;
    display: flex;
    .left-container {
      width: 290px;
      padding-right: 16px;
      .chose-course {
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
      }
      .task-wrapper {
        border: 1px solid #DCDCDC;
        border-radius: 3px;
        margin-top: 15px;
        height: calc(100vh - 378px);
        overflow: auto;
        .outline-list {
          .task-list {
            height: 36px;
            line-height: 36px;
            padding-left: 10px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            cursor: pointer;
            &:hover,
            &.active {
              background-color: #f1f6ff;
            }
          }
        }
      }
    }
    .right-container {
      flex: 1;
      overflow: auto;
      // background: #eee;
      // padding: 10px;
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #414D65;
        border-color: #414D65;
      }
      .el-input.is-disabled {
        .el-input__inner {
          color: #606266;
          // background: #fff;
          // border-color: #fff;
        }
      }
      // .el-radio-button__inner:hover {
      //   color: #414D65;
      // }
      .header-tabs {
        text-align: center;
      }
      .left-tabs {
        margin: 10px 0;
      }
    }
  }
</style>
