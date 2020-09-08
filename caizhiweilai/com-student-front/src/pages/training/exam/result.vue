<template>
<div class="exam-result">
  <div class="exam-result-mian">
    <!-- 得分 -->
    <div class="exam-fraction">
      <p class='goBack' @click='backHandler'>返回{{returnName}}</p>
      <div class="exam-fraction-num">
        <span class="exam-mark">{{resultData.score}}</span>
        <span class="exam-branch">分</span>
      </div>
      <div class="exam-type">
        <div class="examType correct">正确：{{resultData.currrentQuestion}}题</div>
        <div class="examType error">错误：{{resultData.woringQuestion}}题</div>
        <div class="examType unanswered">未答：{{resultData.unanswered}}题</div>
      </div>
    </div>
    <!-- 试题 -->
    <ul class='exam-resolve'>
      <li v-for='(item,index) in resultList.questionList' :key='item.id'>
        <div class="exam-resolve-box">
          <div class="resolve-title">
            <span class='resolve-type single' v-if='item.questionType=="0"'>单选题</span>
            <span class='resolve-type multiple' v-else-if='item.questionType=="1"'>多选题</span>
            <span class='resolve-type judge' v-else>判断题</span>

            <i :class='["resolve-judge",item.success?"current":"error"]'>{{item.success?'正确':'错误'}}</i>
          </div>
          <div class="resolve-choseBox">
            <p class='resolve-text' :title="item.questionContent">{{index+1}}、{{item.questionContent}}</p>
            <div class='exam-content' v-for='(html,index) of item.questionOptionDTOList' :key="index" :title='html.optionContent'>
              <i class='exam-icon iconfont' v-if='item.questionType=="2"'>{{html.optionCode=='A'?'&#xe6af;':'&#xe678;'}}</i>
              <i class='exam-icon' v-else>{{html.optionCode}}</i>
              <span class='exam-main'>{{html.optionContent}}</span>
            </div>
          </div>
          <div :class='["you-answer",item.success?"current":"error"]'>
            <div class="you-answer-choseBox">
              <div class='you-answer-text'>
                <b></b>
                <span>你的答案</span>
              </div>
              <div>
                <div :class='["you-answer-chose",item.success?"current":"error"]' v-for='(bb,index) of item.submitAnswer' :key='index'>
                  {{bb}}
                </div>
                <div class="" v-if='item.submitAnswer.length==0'>
                  未答
                </div>
              </div>
            </div>
            <div class="exam-analysisBox current" v-show='item.answerAnalysis'>
              <div class='you-answer-text'>
                <b></b>
                <span>正确答案</span>
              </div>
              <div>
                <div class="you-answer-chose current" v-for='(html,index) of item.answer' :key='index'>{{html}}</div>
              </div>
            </div>
            <div class="exam-analysisBox dajx" v-show='item.answerAnalysis'>
              <div class='you-answer-text'>
                <b></b>
                <span>答案解析</span>
              </div>
              <div class='exam-analysis'>
                <span :title='item.answerAnalysis'>{{item.answerAnalysis}}</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import {
  examResult
} from '@/api/auth.js'

export default {
  name: 'analysis',
  data() {
    return {
      opt: ['A', 'B', 'C', 'D'],
      // 结果
      resultData: {
        score: '',
        unanswered: 0,
        woringQuestion: 0,
        currrentQuestion: 0
      },
      resultList: [],
      isResultDateil: 0 // 判断是学员查看成绩跳转的还是实训里面进来的
    }
  },
  methods: {
    backHandler() {
      // 返回实训中心
      const num = Number(this.isResultDateil)
      switch (num) {
      case 0:
        this.$router.push('/training')
        break
      default:
        this.$router.push('/result')
      }
    },
    resultExam() {
      const classTaskId = this.$route.query.id
      examResult({
        classTaskId
      }).then(res => {
        const arr = []
        if (res.code == 0) {
          const data = res.result
          this.resultData = {
            score: data.score,
            unanswered: data.ignoreNum,
            woringQuestion: data.errorNum,
            currrentQuestion: data.successNum
          }
          this.resultList = data
          const {
            questionList
          } = this.resultList
          for (const i in questionList) {
            if (questionList[i].submitAnswer.indexOf(',') > 0) {
              questionList[i].submitAnswer = questionList[i].submitAnswer.split(',')
            } else {
              arr.push(questionList[i].submitAnswer)
            }
            if (questionList[i].answerAnalysis) {
              questionList[i].answer.indexOf(',') > 0 ? questionList[i].answer = questionList[i].answer.split(',') : arr.push(questionList[i].answer)
            }
            const obj = questionList[i]
            if (obj.questionType == 2) {
              obj.questionOptionDTOList[0].optionContent = '正确'
              obj.questionOptionDTOList[1].optionContent = '错误'
            }
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  },
  computed: {
    returnName() {
      const [num] = [Number(this.isResultDateil)]
      let [name] = ['']
      switch (num) {
      case 0:
        name = '实训中心'
        break
      default:
        name = '我的成绩'
      }
      return name
    }
  },
  filters: {},
  created() {
    // 初始化
    this.resultExam()
    // 从地址栏获取是从哪里跳转过来的
    this.isResultDateil = Number(this.$route.query.myResult)
  }
}
</script>

<style lang="scss" scoped>
.exam-result {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    background: url("./images/examBg.png");
    overflow-y: auto;
    .exam-result-mian {
        width: 1200px;
        min-height: calc(100% - 40px);
        margin: 40px auto;
    }
    // 得分
    .exam-fraction {
        background: #FFF;
        width: 100%;
        height: auto;
        overflow: hidden;
        padding-bottom: 25px;
        margin: 0 auto;
        border-radius: 10px;
        position: relative;
        .goBack {
            position: absolute;
            top: 15px;
            left: 15px;
            cursor: pointer;
            color: #5F6266;
            font-size: 14px;
            padding-left: 20px;
            &:before {
                font-size: 16px;
                content: '\e61a';
                font-family: 'iconfont';
                position: absolute;
                left: 0;
                top: 0;
            }
        }
        .exam-fraction-num {
            box-sizing: border-box;
            padding: 52px 0 0;
            width: 210px;
            height: 186px;
            margin: 20px auto;
            text-align: center;
            background: url("./images/score.png") no-repeat center center;
            color: #fff;
            position: relative;

            .exam-mark {
                font-size: 36px;
                display: inline-block;
                text-align: center;
            }
            .exam-branch {
                position: absolute;
                right: 38px;
                bottom: 89px;
            }
        }

        .exam-type {
            width: 100%;
            height: auto;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            justify-content: center;

            .examType {
                margin: 0 10px;

                &.correct {
                    color: #36CEA9;
                }

                &.error {
                    color: #FF9D6A;
                }

                &.unanswered {
                    color: #999999;
                }
            }
        }
    }

    // 解析
    .exam-resolve {
        width: 100%;
        background: #FFFFFF;
        display: -webkit-flex;
        flex-wrap: wrap;
        margin-top: 13px;
        border-radius: 10px;
        padding: 30px 44px 0;
        li {
            width: 540px;
            display: flex;
            border-radius: 3px;
            background: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            margin-bottom: 30px;
            &:nth-child(odd) {
                margin-right: 31px;
            }
            .exam-resolve-box {
                width: 100%;
                .resolve-title {
                    border-bottom: 1px solid #CBCBCB;
                    box-sizing: border-box;
                    padding: 16px 20px 10px 28px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    .resolve-type {
                        height: 28px;
                        line-height: 28px;
                        padding: 0 8px;
                        border-radius: 3px;
                        color: #fff;
                        margin-right: 8px;
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

                    .resolve-judge {
                        font-style: normal;
                        &.current {
                            color: #36CEA9;
                        }
                        &.error {
                            color: #ff0000;
                        }
                    }
                }
                .resolve-choseBox {
                    padding-bottom: 10px;
                    height: 180px;
                    width: 100%;
                    box-sizing: border-box;
                    padding-left: 30px;
                    .resolve-text {
                        color: #333;
                        line-height: 20px;
                        flex: 1;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                }
                // 考试内容
                .exam-content {
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                    margin-top: 10px;
                    position: relative;
                    padding-left: 30px;
                    padding-right: 20px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    .exam-icon {
                        width: 20px;
                        height: 20px;
                        font-style: normal;
                        background: #b4c5e6;
                        color: #fff;
                        border-radius: 3px;
                        display: inline-block;
                        font-size: 12px;
                        margin-right: 4px;
                        cursor: pointer;
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        &.on {
                            background: rgba(54, 206, 169, 1);
                        }
                    }

                    .exam-main {
                        color: #5F6266;
                        width: 100%;

                    }
                }

                .you-answer {
                    margin: 0 20px;
                    border-top: 1px solid rgba(0, 0, 0, .08);
                    position: relative;
                    height: auto;
                    overflow: hidden;
                    padding: 8px 0;

                    &.current {
                        color: #41d66b;
                        .you-answer-text {
                            b {
                                background: #d9f7e1;
                            }
                        }
                    }

                    &.error {
                        color: #ff5c5c;

                        .you-answer-text {
                            b {
                                background: #ffdede;
                            }
                        }
                    }

                    .you-answer-text {
                        width: 90px;
                        height: 23px;
                        display: inline-block;
                        position: relative;
                        float: left;
                        b {
                            width: 75px;
                            height: 10px;
                            display: inline-block;
                            position: absolute;
                            top: 12px;
                            border-radius: 3px;
                        }

                        span {
                            position: absolute;
                            z-index: 2;
                            margin-left: 6px;
                        }
                    }

                    .you-answer-chose {
                        padding: 1px 8px;
                        margin-right: 8px;
                        color: #fff;
                        border-radius: 3px;
                        float: left;

                        &.current {
                            background: #41d66b;
                        }

                        &.error {
                            background: #ff5c5c;
                        }
                    }

                    .you-answer-choseBox {
                        width: 100%;
                        height: auto;
                        overflow: hidden;
                    }

                    .exam-analysisBox {
                        width: 100%;
                        height: auto;
                        overflow: hidden;
                        margin: 5px 0 10px;
                        &.dajx {
                            .you-answer-text {
                                b {
                                    background: #dcf1ff!important;
                                }

                                span {
                                    color: #4fb9ff!important;
                                }
                            }
                        }
                        .you-answer-text {
                            b {
                                background: rgba(65, 214, 107, 0.2);
                            }

                            span {
                                color: #36CEA9;
                            }
                        }

                        .exam-analysis {
                            width: calc(100% - 90px);
                            height: auto;
                            color: #5F6266;
                            font-size: 12px;
                            float: left;
                            box-sizing: border-box;
                            padding-right: 10px;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                        }

                    }

                }
            }

            &:nth-child(2n) {
                // .exam-resolve-box {
                //     width: calc(100% - 10px);
                //     float: right;
                // }
            }

        }
    }
}
</style>
