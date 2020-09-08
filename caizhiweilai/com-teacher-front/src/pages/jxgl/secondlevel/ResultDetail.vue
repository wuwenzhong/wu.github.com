<template>
<div class="exam-result">
  <!-- 得分 -->
  <div class="exam-fraction">
    <div class="exam-fraction-num">
      <span class="exam-mark">{{getScore}}</span>
      <span class="exam-branch">分</span>
    </div>
    <div class="exam-type">
      <div class="examType correct">正确：{{answerCorrect}}题</div>
      <div class="examType error">错误：{{answerError}}题</div>
      <div class="examType unanswered">未答：{{noAnswer}}题</div>
    </div>
  </div>
  <!-- 试题 -->
  <ul class='exam-resolve'>
    <li v-for="item in testList" :key="item.id">
      <div class="exam-resolve-box">
        <div class="resolve-title">
          <span class='resolve-type single' v-html="item.questionType== '0' ? '单选题' : (item.questionType== '1'?'多选题':'判断题')"></span>
          <span class='resolve-text'>{{item.questionContent}}</span>
          <i class='resolve-judge ' v-html="item.answer == item.submitAnswer ? '正确' :'错误'" :class="item.answer == item.submitAnswer ? 'current':'error'">正确</i>
        </div>
        <div class="resolve-choseBox">
          <div class='exam-content' v-for=" ele in item.questionOptionDTOList" :key="ele.id">
            <i class='exam-icon'>{{ele.optionCode}}</i>
            <span class='exam-main'>{{ele.optionContent}}</span>
          </div>
        </div>
        <div class="you-answer current">
          <div class="you-answer-choseBox">
            <div class='you-answer-text'>
              <b></b>
              <span>你的答案</span>
            </div>
            <div class='you-answer-chose current' :style="{display:item.submitAnswer == '' || q == ','?'none':''}" v-for='(q , x) in item.submitAnswer' :key='x'>{{q}}
            </div>
          </div>
          <div class="you-answer-choseBox">
            <div class='you-answer-text'>
              <b></b>
              <span>正确答案</span>
            </div>
            <div class='you-answer-chose current' v-for='(k , indexs) in item.answer' :key='indexs' :style="{display:k == ',' ? 'none' : ''}">{{k}}</div>
          </div>
          <div class="exam-analysisBox">
            <div class='you-answer-text'>
              <b></b>
              <span>答案解析</span>
            </div>
            <div class='exam-analysis'>
              <span>{{item.answerAnalysis}}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
import {
  queryStudyResult
} from '@/api/teamAdmin'
export default {
  name: 'ResultDetailPage',
  data() {
    return {
      answerError: '', // 答错题数
      answerCorrect: '', // 答正确题数
      noAnswer: '', // 未回答题数
      getScore: '', // 得分
      testList: [] // 试题列表
    }
  },
  mounted() {
    this.ajaxExamDetail(this.$route.query.classTaskId, this.$route.query.studentId)
  },
  methods: {
    //  加载试卷数据
    ajaxExamDetail(classTaskId, studentId) {
      const _this = this
      const postData = {
        classTaskId: classTaskId,
        userId: studentId
      }
      queryStudyResult(postData).then(res => {
        if (res.code == 0) {
          _this.answerError = res.result.errorNum
          _this.answerCorrect = res.result.successNum
          _this.noAnswer = res.result.ignoreNum
          _this.getScore = res.result.score
          _this.testList = res.result.questionList
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.exam-result {
    margin: 20px 34px 20px 20px;
    /*去掉em,i,b,strong的默认样式*/
    em,
    i {
        font-style: normal;
    }
    b,
    strong {
        font-weight: normal;
    }
    // 得分
    .exam-fraction {
        background: #FFF;
        width: 100%;
        height: 256px;
        overflow: hidden;
        .exam-fraction-num {
            box-sizing: border-box;
            padding: 52px 0 0;
            width: 210px;
            height: 186px;
            margin: 20px auto 10px;
            text-align: center;
            background: url("../../../common/images/score.png") no-repeat center center;
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
        li {
            width: 50%;
            margin-top: 20px;
            display: inline-block;
            .exam-resolve-box {
                border-radius: 3px;
                background: #fff;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                height: auto;
                min-height: 246px;
                .resolve-title {
                    border-bottom: 1px solid #CBCBCB;
                    height: 55px;
                    vertical-align: middle;
                    box-sizing: border-box;
                    padding: 16px 27px 0 15px;
                    margin-bottom: 10px;
                    .resolve-type {
                        padding: 4px 8px;
                        border-radius: 3px;
                        color: #fff;
                        margin-right: 8px;
                        &.single {
                            background: #36CEA9;
                        }
                        &.multiple {
                            background: #FF9D6A;
                        }
                    }
                    .resolve-text {
                        color: #5F6266;
                    }
                    .resolve-judge {
                        float: right;
                        &.current {
                            color: #36CEA9;
                        }
                        &.error {
                            color: #ff0000;
                        }
                    }
                }
                // 考试内容
                .exam-content {
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                    padding: 0 0 14px 24px;
                    margin-top: 10px;
                    .exam-icon {
                        padding: 2px 6px;
                        // background:#36CEA9;
                        background: rgba(54,206,169,.4);
                        color: #fff;
                        border-radius: 3px;
                        display: inline-block;
                        font-size: 12px;
                        margin-right: 4px;
                        cursor: pointer;
                        &.on {
                            background: rgba(54,206,169,1);
                        }
                    }
                    .exam-main {
                        color: #5F6266;
                    }
                }
                .you-answer {
                    margin-left: 20px;
                    border-top: 1px solid rgba(0,0,0,.08);
                    position: relative;
                    height: auto;
                    overflow: hidden;
                    padding-top: 15px;
                    &.current {
                        color: #36CEA9;
                        .you-answer-text {
                            b {
                                background: rgba(65,214,107,.2);
                            }
                        }
                    }
                    &.error {
                        color: #FF0000;
                        .you-answer-text {
                            b {
                                background: rgba(255,0,0,.2);
                            }
                        }
                    }
                    .you-answer-text {
                        width: 90px;
                        height: 26px;
                        display: inline-block;
                        position: relative;
                        float: left;
                        b {
                            width: 75px;
                            height: 10px;
                            display: inline-block;
                            position: absolute;
                            top: 10px;
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
                        margin-right: 10px;
                        color: #fff;
                        border-radius: 3px;
                        float: left;
                        &.current {
                            background: #36CEA9;
                        }
                        &.error {
                            background: #FF0000;
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
                            padding-top: 6px;
                            box-sizing: border-box;
                            padding-right: 10px;
                        }

                    }

                }
            }
            &:nth-child(2n) {
                .exam-resolve-box {
                    width: calc(100% - 10px);
                }
            }
            &:nth-child(1n) {
                .exam-resolve-box {
                    width: calc(100% - 10px);
                }
            }
        }
    }
}
</style>
