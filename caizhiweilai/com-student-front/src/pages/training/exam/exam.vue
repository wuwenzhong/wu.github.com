<template>
<div class="student-exam">
  <div class="exam-message">
    <div class="goBack-box">
      <div class='goBack'
           @click='backHandler'>返回实训中心</div>
    </div>
    <h3>{{paperName}}</h3>
  </div>
  <div class="examination">
    <div class="exam-subject">
      <span class='exam-num'>剩余题数：<b>{{examList.length-currentExam-1}}</b></span>
      <ul class='exam-time'
          v-if='timeStatus'>
        <li>剩余时间：</li>
        <li v-for='(item,index) in timeStatus.split(":")'
            :key='index'
            class='time'>{{item}}</li>
      </ul>
    </div>
    <div class="exam-title">
      <i v-if="currentPaper['chose']"
         :class="currentPaper['chose']['class']">{{currentPaper['chose']['text']}}</i>
      {{currentExam+1}}、
      <span class="exam-text">{{currentPaper.questionContent}}</span>
    </div>
    <ul v-if='currentPaper.questionType!=3'>
      <li class='exam-content'
          v-for='(item,i) of currentPaper["questionOptionDTOList"]'
          :key='i'
          @click='optHandler(i)'>
        <div :class='{iconfontChose:true,iconfont:true,on:item.xuan.on}'
             v-if='currentPaper.questionType==1'>{{item.xuan.on?'&#xe635;':'&#xe714;'}}</div>
        <div :class='{iconfontChose:true,iconfont:true,on:item.xuan.on}'
             v-else>{{item.xuan.on?'&#xe6d1;':'&#xe713;'}}</div>
        <div :class='[item.xuan,"iconfont","judje-type"]'
             v-if='currentPaper.questionType==2'>{{item.optionCode=='A'?'&#xe6af;':'&#xe678;'}}</div>
        <div :class='item.xuan'
             v-else>{{item.optionCode}}</div>
        <span class='exam-main'
              v-if='currentPaper.questionType==2'>{{item.optionContent}}</span>
        <span class='exam-main'
              v-else>答案{{item.optionCode}}：{{item.optionContent}}</span>
      </li>
    </ul>
    <div class=""
         v-else>
      <el-input type="textarea"
                placeholder="请输入内容"
                v-model="llala"
                maxlength="500"
                class='quesTion'
                show-word-limit>
      </el-input>
    </div>
    <div class="exam-save">
      <span :class='currentExam+1==1?"forbid":""'
            @click='prveHandler'>上一题</span>
      <span @click.stop='nextHandler'>{{currentExam>examList.length-2?"完 成":"下 一 题"}}</span>
    </div>
  </div>
</div>
</template>

<script>
import {
  enterExam,
  answerHandler,
  submitText
} from '@/api/auth.js'
export default {
  name: 'exam',
  data() {
    return {
      llala: '',
      // 总数据
      examList: [],
      // 记录第几题
      currentExam: 0,
      // 倒计时
      starttime: 0,
      // 已选的答案
      alreadyList: [],
      // 当前的题目
      currentPaper: [],
      timeStatus: null,
      // 试卷名称
      paperName: ''
    }
  },
  methods: {
    backHandler() {
      // 返回实训中心
      this.$router.push('/training')
    },
    // 选项点击事件
    optHandler(i) {
      const {
        questionType,
        questionOptionDTOList
      } = this.currentPaper
      const current = questionOptionDTOList[i].xuan
      if (questionType != 1) {
        questionOptionDTOList.forEach((item) => {
          item.xuan.on = false
        })
      }
      current.on ? current.on = false : current.on = true
    },
    // 下一题
    nextHandler() {
      const arr = []
      const {
        questionType,
        questionOptionDTOList
      } = this.currentPaper
      questionOptionDTOList.forEach((item, i) => {
        if (questionOptionDTOList[i].xuan.on) arr.push(questionOptionDTOList[i].optionCode)
      })
      const data = {
        id: this.currentPaper.id,
        options: arr.toString()
      }
      let onOff = false
      let currentAlready = this.alreadyList[this.currentExam]
      // 判断当前是不是多选
      if (questionType == '1') {
        // debugger;
        if (arr.length < 2) {
          if (arr.length == 1) {
            this.$alert('多选题至少选两个选项', '提示', {
              confirmButtonText: '确定'
            })
            return false
          } else {
            onOff = true
            currentAlready = arr.toString()
          }
        } else {
          onOff = true
          currentAlready = arr.toString()
        }
      } else {
        // 其他类型的题
        onOff = true
        currentAlready = arr.toString()
      }
      this.alreadyList[this.currentExam] = currentAlready
      if (onOff) {
        // 提交答案
        answerHandler(data)
          .then(res => {
            if (res.code != '0') {
              this.$message.warning(res.message)
            } else {
              if (this.currentExam != this.examList.length - 1) {
                this.currentExam++
              }
            }
          })
      }
      // 最后一题提交
      if (this.currentExam == this.examList.length - 1) {
        const answerHadler = []
        for (const i in this.alreadyList) {
          if (this.alreadyList[i] == '') {
            answerHadler.push(parseInt(i) + 1)
          }
        }
        if (answerHadler.length != 0) {
          this.$confirm(answerHadler.toString() + '题还未答完，确定提交么？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              this.submitHandler()
            })
            .catch(() => {})
        } else {
          this.$confirm('确认提交试卷么', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              this.submitHandler()
            })
            .catch(() => {})
        }
      }
    },
    submitHandler() {
      submitText({
          classTaskId: this.$route.query.id
        })
        .then(res => {
          if (res.code == 0) {
            this.$router.push({
              path: '/training/analysis',
              query: {
                id: this.$route.query.id,
                myResult: 0
              }
            })
          }
        })
        .cancel(() => {})
    },
    // 上一题
    prveHandler() {
      const arr = []
      const currentAlready = this.alreadyList[this.currentExam]
      const {
        questionOptionDTOList
      } = this.currentPaper
      for (const i in questionOptionDTOList) {
        if (questionOptionDTOList[i].xuan.on) {
          arr.push(questionOptionDTOList[i].optionCode)
        }
      }
      if (currentAlready != arr.toString()) {
        const data = {
          id: this.examList[this.currentExam].id,
          options: arr.toString()
        }
        answerHandler(data)
          .then(res => {
            this.alreadyList[this.currentExam] = arr.toString()
            if (res.code != 0) {
              this.$alert(res.message, '标题名称', {
                confirmButtonText: '确定'
              })
              return false
            }
          })
      }
      if (this.currentExam != 0) {
        if (this.currentExam != this.examList.length) {
          this.currentExam--
        }
      }
    },
    paperList() {
      // 进入考试
      enterExam({
        classTaskId: this.$route.query.id
      }).then(res => {
        this.$forceUpdate()
        console.log(res.result.paperName)
        if (res.code == 0) {
          this.paperName = res.result.paperName
          for (const i in res.result.questionList) {
            if (res.result.questionList[i].submitAnswer.includes(',')) {
              res.result.questionList[i].submitAnswer = res.result.questionList[i].submitAnswer.split(',')
            }
            const chosedOpt = res.result.questionList[i].submitAnswer
            if (res.result.questionList[i].questionType == 0) {
              res.result.questionList[i].chose = {
                text: '单选题',
                class: {
                  single: true,
                    'exam-type': true
                }
              }
            } else if (res.result.questionList[i].questionType == 1) {
              res.result.questionList[i].chose = {
                text: '多选题',
                class: {
                  multiple: true,
                    'exam-type': true
                }
              }
            } else if (res.result.questionList[i].questionType == 2) {
              res.result.questionList[i].chose = {
                text: '判断题',
                class: {
                  judge: true,
                    'exam-type': true
                }
              }
            } else if (res.result.questionList[i].questionType == 3) {
              res.result.questionList[i].chose = {
                text: '问答题',
                class: {
                  quesanswer: true,
                    'exam-type': true
                }
              }
            }
            const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
            for (const k in res.result.questionList[i].questionOptionDTOList) {
              res.result.questionList[i].questionOptionDTOList[k].xuan = {
                'exam-icon': true,
                on: false
              }
            }
            for (const k in res.result.questionList[i].questionOptionDTOList) {
              const panduan = false
              for (const h in arr) {
                for (const f in chosedOpt[k]) {
                  if (arr[h] == chosedOpt[k][f]) {
                    res.result.questionList[i].questionOptionDTOList[h].xuan.on = true
                  }
                }
              }
            }
          }
          // 存储已答选项
          this.alreadyList = res.result.alreadyList
          // 存储所有选题
          this.examList = res.result.questionList
          // 存储当前下标
          this.currentExam = res.result.currentIndex - 1
          // 倒计时
          this.starttime = res.result.diffSecondTime
          console.log(res.result.diffSecondTime)
          // 存储当前题目
          this.currentPaper = this.examList[this.currentExam]
        }
      })
    }
  },
  watch: {
    // 监测路由
    '$route.path'(now, old) {
      if (now.endsWith('exam')) {
        this.paperList()
      }
    },
    // 监测倒计时
    starttime(now, old) {
      if (now == 0) {
        this.submitHandler()
      }
    },
    // 监测当前页
    currentExam(now, old) {
      if (now != 'NaN') {
        this.currentPaper = this.examList[now]
      }
    }
  },
  created() {
    this.currentExam = 0
    // 进来之后初始化倒计时
    const timer = setInterval(() => {
      this.starttime -= 1
      this.timeStatus = hourtime(this.starttime)
      if (this.starttime <= 0) {
        clearTimeout(timer)
      }
    }, 1000)
  },
  mounted() {
    // 初始化方法
    this.paperList()
  }
}
// 补零
function buZero(val) {
  return val < 10 ? '0' + val : val
}

function hourtime(val) {
  let theTime = parseInt(val) // 秒
  let middle = 0 // 分
  let hour = 0 // 小时
  if (theTime > 60) {
    middle = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (middle > 60) {
      hour = parseInt(middle / 60)
      middle = parseInt(middle % 60)
    }
  }
  return buZero(parseInt(hour)) + ':' + buZero(parseInt(middle)) + ':' + buZero(parseInt(theTime))
}
</script>
<style lang="scss" scoped>
.student-exam {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    background: url("./images/examBg.png");
    .exam-message {
        width: 1200px;
        height: 100px;
        overflow: hidden;
        margin: 0 auto;
        position: relative;
        .goBack-box {
            width: 100%;
            height: 50px;
            overflow: hidden;
            .goBack {
                position: absolute;
                top: 15px;
                left: 15px;
                cursor: pointer;
                color: #5F6266;
                font-size: 14px;
                padding-left: 20px;
                color: #fff;
                &:before {
                    font-size: 16px;
                    content: '\e61a';
                    font-family: 'iconfont';
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
        }
        h3 {
            color: #fff;
            font-size: 20px;
            text-indent: 1em;
        }
    }
    .examination {
        width: 1200px;
        min-height: calc(100% - 130px);
        box-sizing: border-box;
        padding: 0 40px;
        overflow: hidden;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 10px;
        .exam-subject {
            width: 100%;
            height: 70px;
            font-size: 16px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            border-bottom: 1px solid #D9D9D9;
            .exam-time {
                display: inline-block;
                display: flex;
                align-items: baseline;
                li.time {
                    width: 30px;
                    height: 38px;
                    display: flex;
                    background: #00c57f;
                    color: #fff;
                    margin-left: 10px;
                    border-radius: 3px;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
            }
            .exam-num {
                float: right;
                margin-right: 38px;
                b {
                    color: #00c57f;
                    font-size: 30px;
                    line-height: 0;
                    &:after {
                        content: '题';
                        font-size: 12px;
                        font-weight: normal;
                        margin-left: 10px;
                    }
                }
            }
        }
        .exam-title {
            width: 1200;
            vertical-align: middle;
            box-sizing: border-box;
            padding: 30px 0 0 24px;
            .exam-type {
                padding: 5px 10px;
                border-radius: 3px;
                color: #fff;
                font-style: normal;
                margin-right: 10px;
                &.single {
                    background: #4c82ff;
                }
                &.multiple {
                    background: #ffb54c;
                }
                &.judge {
                    background: #c04cff;
                }
                &.quesanswer {
                    background: #1fac82;
                }
            }
            .exam-text {
                color: #333;
                font-size: 16px;
            }

        }
        > ul {
            width: 100%;
            height: auto;
            overflow: hidden;
            li {
                cursor: pointer;
                .iconfont {
                    color: #e2e3e8;
                    &.on {
                        color: #36CEA9;
                    }
                }
                .iconfontChose {
                    margin-right: 5px;
                    display: flex;
                    align-items: center;
                }
            }
            // 考试内容
            .exam-content {
                width: 100%;
                height: auto;
                overflow: hidden;
                padding-left: 24px;
                margin-top: 20px;
                min-height: 30px;
                display: flex;
                .exam-icon {
                    padding: 2px 10px;
                    background: #b4c5e6;
                    color: #fff;
                    border-radius: 3px 0 0 3px;
                    display: inline-block;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    &.on {
                        background: #12c589;
                    }
                    &.judje-type {
                        background: #12c589;
                        color: #fff;
                    }
                }
                .exam-main {
                    color: #5F6266;
                    background: #f8fafd;
                    border-radius: 0 3px 3px 0;
                    flex: 1;
                    padding-left: 18px;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
    .exam-save {
        width: 100%;
        height: auto;
        overflow: hidden;
        display: flex;
        justify-content: center;
        margin: 70px 0;
        span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 130px;
            height: 41px;
            background: url("../../../common/images/default_sprit.png") no-repeat -2px -229px;
            color: #fff;
            cursor: pointer;
            border-radius: 30px;
            margin: 0 8px;
            &.forbid {
                background: #BEBEBE;
            }
        }
    }
    .quesTion {
        width: 1114px;
        height: 25px;
    }
}
</style>
