<template>
<div class="set-exam-box">
  <div class="cont">
    <p class="title">{{confirmData.text}} <i @click="closeConfirm" class="iconfont">&#xe60e;</i></p>
    <div v-if="confirmData.func==0">
      <ul class="set-exam-list">
        <li>
          <span>试卷名称</span>
          <input type="text" class="disabled-input" disabled="disable" v-model="confirmData.examData.name">
        </li>
        <li>
          <span>题目总数</span>
          <input type="text" class="disabled-input" disabled="disable" v-model="confirmData.examData.num">
        </li>
        <li>
          <span>题目总分</span>
          <input type="text" class="disabled-input" disabled="disable" v-model="paperMark">
        </li>
        <li>
          <span>抽取题目数</span>
          <input type="text" v-model="questionsNum" data-name="questionsNum" @keyup="testInput($event ,1)" placeholder="请输入试卷试题数量">
          <p v-show="tipsShow1" class="tips-text">抽取题目数不能大于总题目数</p>
        </li>
        <li>
          <span>单人答题时间</span>
          <input type="text" v-model="singleTime" data-name="singleTime" @keyup="testInput($event ,2)" placeholder="请输入单人答题时间">
          <p v-show="tipsShow2" class="tips-text">单人答题时间不能大于总答题时间</p>
        </li>
        <li>
          <span>总答题时间</span>
          <input type="text" v-model="totalTime" data-name="totalTime" @keyup="testInput($event ,3)" placeholder="请输入总的答题时间">
          <p v-show="tipsShow3" class="tips-text">总答题时间必须大于单人答题时间</p>
        </li>
      </ul>
    </div>
    <div v-if="confirmData.func==1">
      <p class="tips-text">确认开放答案吗？</p>
    </div>
    <div class="btn-box">
      <button class="cancel" @click="closeConfirm">取 消</button>
      <button class="hold" @click="openExam($event,confirmData.func)" v-html="confirmData.func==0?'确定开始':'确 定'"></button>
    </div>
  </div>
</div>
</template>

<script>
import {
  openAnswer,
  setBeginExam
} from '@/api/teamAdmin'

export default {
  name: 'SetExam',
  props: {
    confirmData: {
      type: Object
    }
  },
  data() {
    return {
      questionsNum: '', // 抽取试题数量
      singleTime: '', // 单人答题时间
      totalTime: '', // 总答题时间
      paperMark: 100, // 试卷总分
      tipsShow1: false, // 错误提示
      tipsShow2: false, // 错误提示
      tipsShow3: false, // 错误提示
      answerTips: '' // 答题时间设置错误提示
    }
  },
  mounted() {

  },
  methods: {
    //  关闭对话框
    closeConfirm() {
      this.$emit('closeConfirm', 0)
    },
    //  开始考试
    openExam(e, i) {
      let postData = {}
      // i=0设置开始考试
      if (i == 0) {
        postData = {
          classTaskId: this.confirmData.id,
          questionNum: this.questionsNum,
          quizTime: this.singleTime,
          examTime: this.totalTime
        }
        setBeginExam(postData).then(res => {
          if (res.code == 0) {
            this.$message.success('考试已开始！')
            this.$emit('closeConfirm', 1)
          } else {
            this.$message.warning({
              message: res.message
            })
          }
        })
      }
      // i=1设置是否开放答案
      if (i == 1) {
        postData = {
          classTaskId: this.confirmData.id
        }
        openAnswer(postData).then(res => {
          if (res.code == 0) {
            this.$message.success('开放答案成功~~')
            this.$emit('closeConfirm', 1)
          } else {
            this.$message.warning({
              message: res.message
            })
          }
        })
      }
    },
    //  检测输入的题目数是否大于总题目数
    testInput(e, i) {
      const _name = e.srcElement.dataset.name
      this[_name] = this[_name].replace(/[^\d]/g, '')
      // i=1检测题目数量
      if (i == 1) {
        if (this[_name] > this.confirmData.examData.num) {
          this['tipsShow' + i] = true
        } else {
          this['tipsShow' + i] = false
        }
      }
      // i=2检测单人答题时间
      if (i == 2) {
        if (Number(this.totalTime) > 0) {
          if (Number(this[_name]) > Number(this.totalTime)) {
            this['tipsShow' + i] = true
          } else {
            this['tipsShow' + i] = false
          }
        }
      }
      // i=3检总答题时间
      if (i == 3) {
        if (Number(this[_name]) < Number(this.singleTime)) {
          this['tipsShow' + i] = true
        } else {
          this['tipsShow' + i] = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.set-exam-box {
    @include maskLayer($z: 1002);

    .cont {
        width: 520px;
        background: #fff;
        padding-bottom: 70px;
        position: relative;
        border-radius: 4px;
        @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));
        .title {
            line-height: 44px;
            border: 1px solid #F3F4F5;
            padding: 0 30px;
            color: #444444;
            font-size: 16px;
            position: relative;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #dedede;
            i {
                position: absolute;
                right: 20px;
                top: 0;
                padding: 0 10px;
                color: #929292;
                font-size: 18px;
                cursor: pointer;
            }
        }
        .set-exam-list {
            padding: 0 30px;
            li {
                display: flex;
                margin-top: 20px;
                position: relative;
                span {
                    width: 120px;
                    text-align: right;
                    margin-right: 20px;
                    line-height: 38px;
                    font-size: 14px;
                    color: #666666;
                }
                input {
                    flex: 1;
                    border: 1px solid #DCDFE6;
                    border-radius: 3px;
                    font-size: 12px;
                    height: 36px;
                    color: #333333;
                    padding-left: 14px;
                    background: #fff;
                    outline: none;
                    &.disabled-input {
                        background: #F7F8FA;
                    }
                }
                .tips-text {
                    font-size: 12px;
                    color: red;
                    position: absolute;
                    top: 40px;
                    left: 110px;
                    padding: 0;
                }
            }
        }
        .btn-box {
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            text-align: center;
            button {
                height: 34px;
                padding: 0 32px;
                font-size: 14px;
                color: #fff;
                border-radius: 3px;
                outline: none;
                cursor: pointer;
                &.cancel {
                    border: 1px solid #dedede;
                    color: #666;
                    background: #fff;
                    &:hover {
                        background: #f3f3f3;
                    }
                }
                &.hold {
                    border: 1px solid $color-theme;
                    background-color: $color-theme;
                    color: #fff;
                    margin: 0 0 0 10px;
                    &:hover {
                        background-color: $color-theme-hover;
                        border: 1px solid $color-theme-hover;
                    }
                }
            }
        }
        .tips-text {
            padding: 100px 0;
            color: #666666;
            font-size: 16px;
            text-align: center;
        }
    }
}
</style>
