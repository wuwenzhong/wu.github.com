<template>
  <div class="lr-card-wrapper">
    <img src="./images/back-six.png" class="back-image" alt="">

    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input55" @blur="blurText('input55')" class="input-time"></el-input>
    <el-date-picker
      v-show="queryParams.setType != '2'"
      format="yyyy 年 MM 月 dd 日 "
      class="input-time"
      v-model="choseTime.time"
      @blur="handleChangeCheck('input55')"
      :clearable="false"
      type="date"
      align="right"
      size="small"></el-date-picker>

    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input56" @blur="blurText('input56')" class="input-company"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input56" class="input-company"></el-input>

    <template v-if="queryParams.setType != '2'">
      <div v-for="(item, index) in tablesInputLr" :key="index">
        <el-input v-for="(item1, index1) in item.children" :key="index1" :disabled="queryParams.setType == '3' ? item1.disable : false" v-model="formParams['input'+item1.sort]" @blur="handleComputed(index1, index)" class="input-list-lr" :class="['line'+index,'child'+index1]"></el-input>
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in tablesInputLr" :key="index">
        <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" @blur="blurText('input'+item1.sort)" class="input-list-lr" :class="['line'+index,'child'+index1]"></el-input>
      </div>
    </template>
  </div>
</template>

<script>
import { formatDate } from '@/common/js/utils.js'

export default {
  props: {
    queryParams: {
      type: Object
    },
    formParams: {
      type: Object
    },
    choseTime: {
      type: Object
    }
  },
  data() {
    return {
      tablesInputLr: [
        {
          children: [
            { sort: 1 }, { sort: 2 }, { sort: 3 }, { sort: 4 }, { sort: 5 }, { sort: 6 },
            { sort: 7 }, { sort: 8 }, { sort: 9 }, { sort: 10 }, { sort: 11 }, { sort: 12 },
            { sort: 13 }, { sort: 14 }, { sort: 15 }, { sort: 16, disable: true }, { sort: 17 },
            { sort: 18 }, { sort: 19, disable: true }, { sort: 20 }, { sort: 21, disable: true },
            { sort: 22 }, { sort: 23 }, { sort: 24 }, { sort: 25 }, { sort: 26 }, { sort: 27 }
          ]
        },
        {
          children: [
            { sort: 28 }, { sort: 29 }, { sort: 30 }, { sort: 31 }, { sort: 32 }, { sort: 33 },
            { sort: 34 }, { sort: 35 }, { sort: 36 }, { sort: 37 }, { sort: 38 }, { sort: 39 },
            { sort: 40 }, { sort: 41 }, { sort: 42 }, { sort: 43, disable: true }, { sort: 44 },
            { sort: 45 }, { sort: 46, disable: true }, { sort: 47 }, { sort: 48, disable: true },
            { sort: 49 }, { sort: 50 }, { sort: 51 }, { sort: 52 }, { sort: 53 }, { sort: 54 }
          ]
        }
      ]
    }
  },
  created() {
    console.log(this.choseTime)
  },
  methods: {
    // 调用父组件失去焦点事件
    blurText(input, num) {
      this.$emit('blur-event', input, num)
    },
    // 选择时间
    handleChangeCheck(val) {
      if (this.choseTime.time) {
        this.formParams[val] = formatDate(this.choseTime.time)
      }
    },
    handleComputed(index, line) {
      // 定义当前是哪一个input失去聚焦点
      const howMany = index + 1 + line * 27
      const boolean = /[1-9]\d*.?|0.[1-9]\d*$/.test(this.formParams['input' + howMany])
      if (!boolean && this.formParams['input' + howMany] != undefined) {
        this.$message.warning('只能输入数字！')
        this.formParams['input' + howMany] = ''
      } else if (boolean) {
        this.formParams['input' + howMany] = parseFloat(this.formParams['input' + howMany]).toFixed(2)
      }
      if (this.queryParams.setType == 3) {
        // 定义变量,依次对应 本月营业利润 本月利润总额 本月净利润 本年营业利润 本年利润总额 本年净利润
        let computeOne, computeTwo, computeThree, computeFour, computeFive, computeSix
        // console.log(index, line, this.formParams, index + 1 + line * 27)
        switch (howMany) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 10:
          case 11:
          case 12:
          case 14:
          case 15:
          case 17:
          case 18:
          case 20:
            // 计算本月营业利润
            computeOne = (+this.formParams.input1 || 0) - (+this.formParams.input2 || 0) - (+this.formParams.input3 || 0) - (+this.formParams.input4 || 0) -
            (+this.formParams.input5 || 0) - (+this.formParams.input6 || 0) - (+this.formParams.input7 || 0) - (+this.formParams.input10 || 0) +
            (+this.formParams.input11 || 0) + (+this.formParams.input12 || 0) + (+this.formParams.input14 || 0) + (+this.formParams.input15 || 0)
            // 计算本月利润总额
            computeTwo = (+computeOne || 0) + (+this.formParams.input17 || 0) - (+this.formParams.input18 || 0)
            // 计算本月本月净利润
            computeThree = (+computeTwo || 0) - (+this.formParams.input20 || 0)
            this.$set(this.formParams, 'input16', parseFloat(computeOne).toFixed(2))
            this.$set(this.formParams, 'input19', parseFloat(computeTwo).toFixed(2))
            this.$set(this.formParams, 'input21', parseFloat(computeThree).toFixed(2))
            break
          case 28:
          case 29:
          case 30:
          case 31:
          case 32:
          case 33:
          case 34:
          case 37:
          case 38:
          case 39:
          case 41:
          case 42:
          case 44:
          case 45:
          case 47:
            // 计算本月营业利润
            computeFour = (+this.formParams.input28 || 0) - (+this.formParams.input29 || 0) - (+this.formParams.input30 || 0) - (+this.formParams.input31 || 0) -
            (+this.formParams.input32 || 0) - (+this.formParams.input33 || 0) - (+this.formParams.input34 || 0) - (+this.formParams.input37 || 0) +
            (+this.formParams.input38 || 0) + (+this.formParams.input39 || 0) + (+this.formParams.input41 || 0) + (+this.formParams.input42 || 0)
            // 计算本月利润总额
            computeFive = (+computeFour || 0) + (+this.formParams.input44 || 0) - (+this.formParams.input45 || 0)
            // 计算本月本月净利润
            computeSix = (+computeFive || 0) - (+this.formParams.input47 || 0)
            this.$set(this.formParams, 'input43', parseFloat(computeFour).toFixed(2))
            this.$set(this.formParams, 'input46', parseFloat(computeFive).toFixed(2))
            this.$set(this.formParams, 'input48', parseFloat(computeSix).toFixed(2))
            break
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.lr-card-wrapper {
  position: relative;
  .back-image {
    width: 1180px;
    position: absolute;
    top: 0;
  }
  input {
    padding: 0;
    border: none;
    background: transparent;
    text-align: right;
    color: #606266;
    font-size:20px;
  }
  .input-time {
    width: 170px;
    height: 30px;
    background-color: #fff;
    position: absolute;
    top: 63px;
    left: 504px;
    input {
      height: 30px;
      text-align: center;
      font-size: 14px;
      padding: 0 20px;
    }
    .el-input__prefix {
      display: none;
    }
  }
  .input-company {
    // background-color: #000;
    width: 330px;
    font-size: 22px;
    position: absolute;
    top: 110px;
    left: 127px;
    input {
      height: 30px;
      text-align: left;
    }
  }
  .input-list-lr{
    width: 269px;
    height: 50px;
    position: absolute;
    top: 203.1px;
    left: 628px;
    &.line1 {
      left: 902px;
    }
    input {
      height: 51px !important;
    }
    &.child1 {
      top: 203 + 53.6px;
    }
    &.child2 {
      top: 203 + 53.6px * 2;
    }
    &.child3 {
      top: 203 + 53.6px * 3;
    }
    &.child4 {
      top: 203 + 53.6px * 4;
    }
    &.child5 {
      top: 203 + 53.6px * 5;
    }
    &.child6 {
      top: 203 + 53.6px * 6;
    }
    &.child7 {
      top: 203 + 53.6px * 7;
    }
    &.child8 {
      top: 203 + 53.6px * 8;
    }
    &.child9 {
      top: 203 + 53.6px * 9;
    }
    &.child10 {
      top: 203 + 53.6px * 10;
    }
    &.child11 {
      top: 203 + 53.6px * 11;
    }
    &.child12 {
      top: 203 + 53.6px * 12;
    }
    &.child13 {
      top: 203 + 53.6px * 13;
    }
    &.child14 {
      top: 203 + 53.6px * 14;
    }
    &.child15 {
      top: 203 + 53.6px * 15;
      background-color: #fff;
    }
    &.child16 {
      top: 203 + 53.6px * 16;
    }
    &.child17 {
      top: 203 + 53.6px * 17;
    }
    &.child18 {
      top: 203 + 53.6px * 18;
      background-color: #fff;
    }
    &.child19 {
      top: 203 + 53.6px * 19;
    }
    &.child20 {
      top: 203 + 53.6px * 20;
      background-color: #fff;
    }
    &.child21 {
      top: 203 + 53.6px * 21;
    }
    &.child22 {
      top: 203 + 53.6px * 22;
    }
    &.child23 {
      top: 203 + 53.6px * 23;
    }
    &.child24 {
      top: 203 + 53.6px * 24;
    }
    &.child25 {
      top: 203 + 53.6px * 25;
    }
    &.child26 {
      top: 203 + 53.6px * 26;
    }
  }

}
</style>