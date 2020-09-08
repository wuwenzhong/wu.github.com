<template>
  <div style="height: 100%">
    <account v-show="status1" v-if="status1" @clickAccountSetNode="clickAccountSetNode" @setSteps="setSteps" @setWeightAnswer="setWeightAnswer" />
    <accountNode v-show="!status2" @accountList="accountList"/>
    <caseStep v-if="!status3" @goAccountList="goAccountList" />
    <setWeight v-if="!WeightShow" :WeightData="WeightData" @goAccountList="goAccountList" />
    <setAnswer v-if="!AnswerShow" :AnswerData="AnswerData" @goAccountList="goAccountList" />
  </div>
</template>
<script>
import account from './account'
import accountNode from './accountNode'
import caseStep from './caseStep'
import setWeight from './setWeight'
import setAnswer from './setAnswer'
export default {
  components: {
    account,
    accountNode,
    caseStep,
    setWeight,
    setAnswer
  },
  data() {
    return {
      status1: true,
      status2: true,
      status3: true,
      AnswerShow: true,
      WeightShow: true,
      AnswerData: {},
      WeightData: {}
    }
  },
  methods: {
    clickAccountSetNode() {
      this.status1 = false
      this.status2 = false
    },
    accountList() {
      this.status1 = true
      this.status2 = !this.status2
    },
    setSteps(val) {
      this.status1 = false
      this.status3 = !this.status3
    },
    goAccountList() {
      this.status1 = true
      this.status3 = true
      this.WeightShow = true
      this.AnswerShow = true
    },
    setWeightAnswer(val, data) {
      // console.log(data)
      if (val === 'Answer') {
        this.AnswerData = data
        this.status1 = false
        this.AnswerShow = !this.AnswerShow
      } else if (val === 'weight') {
        this.WeightData = data
        this.status1 = false
        this.WeightShow = !this.WeightShow
      }
    }
  }
}
</script>