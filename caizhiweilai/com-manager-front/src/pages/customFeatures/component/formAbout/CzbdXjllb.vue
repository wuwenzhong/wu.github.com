<template>
  <!-- 资产负债表 -->
  <div class="xj-card-wrapper">
    <img src="./images/back-seven.png" class="back-image" alt="">
    <!-- setType  1-答案   2-权重   3-默认数据源 -->

    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input81" @blur="blurText('input81')" class="input-time"></el-input>
    <el-date-picker
      v-show="queryParams.setType != '2'"
      format="yyyy 年 MM 月 dd 日 "
      class="input-time"
      v-model="choseTime.time"
      @blur="handleChangeCheck('input81')"
      :clearable="false"
      type="date"
      align="right"
      size="small"></el-date-picker>

    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input82" class="input-company"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input82" @blur="blurText('input82')" class="input-company"></el-input>

    <template v-if="queryParams.setType != '2'">
      <div  iv v-for="(item, index) in tablesInput2" :key="index">
        <el-input v-for="(item1, index1) in item.children" :key="index1" :disabled="queryParams.setType == '3' ? item1.disable : false" v-model="formParams['input'+item1.sort]" @blur="handleComputed(item1.sort, 'line'+index)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
      </div>
    </template>
    <template v-else>
      <div  iv v-for="(item, index) in tablesInput2" :key="index">
        <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" @blur="blurText('input'+item1.sort)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
      </div>
    </template>
  </div>
</template>

<script>
import { numberAdd, numberSub, formatDate } from '@/common/js/utils.js'

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
      tablesInput2: [{
        children: [
          {}, { sort: 1 }, { sort: 2 }, { sort: 3 }, { sort: 4, disable: true }, { sort: 5 }, { sort: 6 },
          { sort: 7 }, { sort: 8 }, { sort: 9, disable: true }, { sort: 10, disable: true }, { sort: 11 },
          { sort: 12 }, { sort: 13 }, { sort: 14 }, { sort: 15 }, { sort: 16, disable: true }, { sort: 17 },
          { sort: 18 }, { sort: 19 }, { sort: 20 }, { sort: 21, disable: true }, { sort: 22, disable: true }, { sort: 23 },
          { sort: 24 }, { sort: 25 }, { sort: 26 }, { sort: 27 }, { sort: 28, disable: true }, { sort: 29 }, { sort: 30 },
          { sort: 31 }, { sort: 32 }, { sort: 33, disable: true }, { sort: 34, disable: true }, { sort: 35 }, { sort: 36 }, { sort: 37, disable: true }, { sort: 38, disable: true }, { sort: 39 }, { sort: 40, disable: true }
        ]
      },
      {
        children: [
          {}, { sort: 41 }, { sort: 42 }, { sort: 43 }, { sort: 44, disable: true }, { sort: 45 }, { sort: 46 },
          { sort: 47 }, { sort: 48 }, { sort: 49, disable: true }, { sort: 50, disable: true }, { sort: 51 },
          { sort: 52 }, { sort: 53 }, { sort: 54 }, { sort: 55 }, { sort: 56, disable: true }, { sort: 57 },
          { sort: 58 }, { sort: 59 }, { sort: 60 }, { sort: 61, disable: true }, { sort: 62, disable: true }, { sort: 63 },
          { sort: 64 }, { sort: 65 }, { sort: 66 }, { sort: 67 }, { sort: 68, disable: true }, { sort: 69 }, { sort: 70 },
          { sort: 71 }, { sort: 72 }, { sort: 73, disable: true }, { sort: 74, disable: true }, { sort: 75 }, { sort: 76 }, { sort: 77, disable: true }, { sort: 78, disable: true }, { sort: 79 }, { sort: 80, disable: true }
        ]
      }
    ]
    }
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
    // 计算
    handleComputed(index, line) {
      const boolean = /[1-9]\d*.?|0.[1-9]\d*$/.test(this.formParams['input' + index])
      if (!boolean && this.formParams['input' + index] != undefined) {
        this.$message.warning('只能输入数字！')
        this.formParams['input' + index] = ''
      } else if (boolean) {
        this.formParams['input' + index] = parseFloat(this.formParams['input' + index]).toFixed(2)
      }
      if (this.queryParams.setType == '3') {
        if (line == 'line0') {
          // 经营活动现金流入小计
          if (index == 1 || index == 2 || index == 3) {
            this.formParams.input4 = numberAdd(this.formParams.input1, this.formParams.input2, this.formParams.input3)
            this.formParams.input10 = numberSub(this.formParams.input4, this.formParams.input9).toFixed(2)
            this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          // 经营活动现金流入小计
          if (index == 5 || index == 6 || index == 7 || index == 8) {
            this.formParams.input9 = numberAdd(this.formParams.input5, this.formParams.input6, this.formParams.input7, this.formParams.input8)
            this.formParams.input10 = numberSub(this.formParams.input4, this.formParams.input9).toFixed(2)
            this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          // 投资活动现金流入小计
          if (index == 11 || index == 12 || index == 13 || index == 14 || index == 15) {
            this.formParams.input16 = numberAdd(this.formParams.input11, this.formParams.input12, this.formParams.input13, this.formParams.input14, this.formParams.input15)
            this.formParams.input22 = numberSub(this.formParams.input16, this.formParams.input21).toFixed(2)
            this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          // 投资活动现金流出小计
          if (index == 17 || index == 18 || index == 19 || index == 20) {
            this.formParams.input21 = numberAdd(this.formParams.input17, this.formParams.input18, this.formParams.input19, this.formParams.input20)
            this.formParams.input22 = numberSub(this.formParams.input16, this.formParams.input21).toFixed(2)
            this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          // 筹资活动现金流入小计
          if (index == 23 || index == 25 || index == 26 || index == 27 || index == 24) {
            this.formParams.input28 = numberAdd(this.formParams.input23, this.formParams.input25, this.formParams.input26, this.formParams.input27)
            this.formParams.input34 = numberSub(this.formParams.input28, this.formParams.input33).toFixed(2)
            this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          // 筹资活动现金流出小计
          if (index == 29 || index == 30 || index == 31 || index == 32) {
              this.formParams.input33 = numberAdd(this.formParams.input29, this.formParams.input30, this.formParams.input32)
              this.formParams.input34 = numberSub(this.formParams.input28, this.formParams.input33).toFixed(2)
              this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
              this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          if (index == 35 || index == 36) {
            this.formParams.input37 = numberSub(this.formParams.input35, this.formParams.input36).toFixed(2)
            this.formParams.input38 = numberAdd(this.formParams.input10, this.formParams.input22, this.formParams.input34, this.formParams.input37)
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
          if (index == 39) {
            this.formParams.input40 = numberAdd(this.formParams.input38, this.formParams.input39)
          }
        } else {
          // 经营活动现金流入小计
          if (index == 41 || index == 42 || index == 43) {
            this.formParams.input44 = numberAdd(this.formParams.input41, this.formParams.input42, this.formParams.input43)
            this.formParams.input50 = numberSub(this.formParams.input44, this.formParams.input49).toFixed(2)
            this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          // 经营活动现金流入小计
          if (index == 45 || index == 46 || index == 47 || index == 48) {
            this.formParams.input49 = numberAdd(this.formParams.input45, this.formParams.input46, this.formParams.input47, this.formParams.input48)
            this.formParams.input50 = numberSub(this.formParams.input44, this.formParams.input49).toFixed(2)
            this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          // 投资活动现金流入小计
          if (index == 51 || index == 52 || index == 53 || index == 54 || index == 55) {
            this.formParams.input56 = numberAdd(this.formParams.input51, this.formParams.input52, this.formParams.input53, this.formParams.input54, this.formParams.input55)
            this.formParams.input62 = numberSub(this.formParams.input56, this.formParams.input61).toFixed(2)
            this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          // 投资活动现金流出小计
          if (index == 57 || index == 58 || index == 59 || index == 60) {
            this.formParams.input61 = numberAdd(this.formParams.input57, this.formParams.input58, this.formParams.input59, this.formParams.input60)
            this.formParams.input62 = numberSub(this.formParams.input56, this.formParams.input61).toFixed(2)
            this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          // 筹资活动现金流入小计
          if (index == 63 || index == 65 || index == 66 || index == 67 || index == 64) {
            this.formParams.input68 = numberAdd(this.formParams.input63, this.formParams.input65, this.formParams.input66, this.formParams.input67)
            this.formParams.input34 = numberSub(this.formParams.input68, this.formParams.input73).toFixed(2)
            this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          // 筹资活动现金流出小计
          if (index == 69 || index == 70 || index == 71 || index == 72) {
              this.formParams.input73 = numberAdd(this.formParams.input69, this.formParams.input70, this.formParams.input72)
              this.formParams.input74 = numberSub(this.formParams.input68, this.formParams.input73).toFixed(2)
              this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
              this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          if (index == 75 || index == 76) {
            this.formParams.input77 = numberSub(this.formParams.input75, this.formParams.input76).toFixed(2)
            this.formParams.input78 = numberAdd(this.formParams.input50, this.formParams.input62, this.formParams.input74, this.formParams.input77)
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
          if (index == 79) {
            this.formParams.input80 = numberAdd(this.formParams.input78, this.formParams.input79)
          }
        }
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style lang="scss">
.xj-card-wrapper {
  position: relative;
  .back-image {
    width: 1180px;
    position: absolute;
    top: 0;
  }
  input {
    padding: 0;
    text-align: right;
    font-size: 18px;
    border: none;
    background: #fff;
  }
  .input-time {
    width: 170px;
    position: absolute;
    top: 47px;
    left: 508px;
    input {
      height: 26px;
      text-align: center;
      font-size: 14px;
      padding: 0 20px;
    }
    .el-input__prefix {
      display: none;
    }
  }
  .input-company {
    width: 330px;
    font-size: 22px;
    position: absolute;
    top: 75px;
    left: 100px;
    input {
      height: 30px;
      text-align: left;
    }
  }
   .input-list-jz {
    width: 152px;
    position: absolute;
    top: 136px;
    &.is-disabled {
      input {
        font-weight: bold;
      }
    }
    input {
      height: 35px !important;
    }
    &.child0 {
      display: none;
    }
    &.child1 {
      top: 186px;
    }
    &.child2 {
      top: 225px;
    }
    &.child3 {
      top: 263px;
    }
    &.child4 {
      top: 301px;
    }
    &.child5 {
      top: 340px
    }
    &.child6 {
      top: 378px;
    }
    &.child7 {
      top: 416px;
    }
    &.child8 {
      top: 454px;
    }
    &.child9 {
      top: 493px;
    }
    &.child10 {
      top: 530px;
    }
    &.child11 {
      top: 607px;
    }
    &.child12 {
      top: 645px;
    }
    &.child13 {
      top: 684px;
    }
    &.child14 {
      top: 722px;
    }
    &.child15 {
      top: 760px;
    }
    &.child16 {
      top: 799px;
    }
    &.child17 {
      top: 837px;
    }
    &.child18 {
      top: 875px;
    }
    &.child19 {
      top: 913px;
    }
    &.child20 {
      top: 952px;
    }
    &.child21 {
      top: 990px;
    }
    &.child22 {
      top: 1028px;
    }
    &.child23 {
      top: 1105px;
    }
    &.child24 {
      top: 1144px;
    }
    &.child25 {
      top: 1182px;
    }
    &.child26 {
      top: 1220px;
    }
    &.child27 {
      top: 1259px;
    }
    &.child28 {
      top: 1297px;
    }
    &.child29 {
      top: 1335px;
    }
    &.child30 {
      top: 1373px;
    }
    &.child31 {
      top: 1412px;
    }
    &.child32 {
      top: 1450px;
    }
    &.child33 {
      top: 1488px;
    }
    &.child34 {
      top: 1527px;
    }
    &.child35 {
      top: 1602px;
    }
    &.child36 {
      top: 1641px;
    }
    &.child37 {
      top: 1680px;
    }
    &.child38 {
      top: 1718px;
    }
    &.child39 {
      top: 1756px;
    }
    &.child40 {
      top: 1795px;
    }
    &.line0 {
      left: 660px;
      width:242px;
    }
    &.line1 {
      left: 908px;
      width:264px;
    }
  }
}
</style>
