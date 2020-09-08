
<template>
<div class="enter">
  <div class="examMain">
    <div class="examCover">
      <h2>实训考试</h2>
      <el-form :model="enterExam"
               ref="enterExam"
               label-position='left'
               label-width="100px">
        <el-form-item label="试卷名称"
                      prop='papername'>
          <el-input v-model.trim="enterExam.papername"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="考试时间"
                      prop='quizTime'>
          <el-input v-model.trim="enterExam.quizTime"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="答题数"
                      prop='answernumber'>
          <el-input v-model.trim="enterExam.answernumber"
                    :disabled="true"></el-input>
        </el-form-item>
        <div class="enter-btn">
          <span class='cancel'
                @click='backHandler'>取消</span>
          <span class='sure'
                @click="enterExamHandler('enterExam')">确认</span>
        </div>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import {
  isEnter,
  enterExam
} from '@/api/auth.js'
export default {
  name: 'enter',
  data() {
    return {
      enterExam: {
        papername: '',
        answertime: '暂无',
        answernumber: ''
      }
    }
  },
  methods: {
    backHandler() {
      // 返回实训中心
      this.$router.push('/training')
    },
    enterExamHandler(enterExam) {
      this.$router.push({
        path: '/training/exam',
        query: {
          id: this.$route.query.id
        }
      })
    },
    examHandler() {
      const id = this.$route.query.id
      const classTaskId = id
      // 进入考试
      isEnter({
          classTaskId
        })
        .then((res) => {
          if (res.code == 0) {
            this.enterExam = {
              papername: res.result.paperName,
              quizTime: res.result.quizTime + '分钟',
              answernumber: res.result.questionNum
            }
          }
        })
    }
  },
  created() {
    this.examHandler()
  }
}
// 补零
function buZero(val) {
  return val < 10 ? '0' + val : val
}
</script>
<style media="screen" lang='scss'>
.examMain {
    .el-form-item__label {
        font-weight: normal;
        line-height: 36px;
        color: #333;
        &:before {
            content: '';
            width: 7px;
            height: 7px;
            display: inline-block!important;
            border-radius: 100%;
            background: #000;
            margin-right: 8px;
        }
    }
}
</style>
<style lang="scss" scoped>
.examMain {
    position: relative;
    width: 100%;
    height: calc(100vh - 60px);
    background: url("./images/examBg.png") 80% 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    .examCover {
        width: 520px;
        height: 540px;
        padding-left: 43px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 3px;
        // background: url("./images/enter-exam-bg.png") no-repeat;
        // background: url("@/common/images/default_sprit") no-repeat;
        h2 {
            font-weight: normal;
            color: #333;
            margin-top: 25px;
            margin-bottom: 20px;
            font-weight: 600;
            font-size: 26px;
        }
        .el-input {
            width: 320px;
            height: 32px;
        }
        .el-form-item {
            margin-bottom: 30px;
        }
        .enter-btn {
            width: 100%;
            height: auto;
            overflow: hidden;
            margin-top: 65px;
            span {
                width: 130px;
                height: 41px;
                line-height: 40px;
                display: inline-block;
                text-align: center;
                box-sizing: border-box;
                font-size: 14px;
                cursor: pointer;
            }
            .sure {
                color: #fff;
                background: url("../../../common/images/default_sprit.png") no-repeat -2px -229px;
                margin-left: 8px;
            }
            .cancel {
                color: #62d66f;
                border: 1px solid #62d66f;
                border-radius: 20px;
                margin-right: 8px;
            }
        }
    }
}
</style>
