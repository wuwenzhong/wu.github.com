<template>
  <!-- 资产负债表 -->
  <div class="fz-card-wrapper">
    <img src="./images/back-five.png" class="back-image" alt="">

    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input121" @blur="blurText('input121')" class="input-time"></el-input>
    <el-date-picker
      v-show="queryParams.setType != '2'"
      format="yyyy 年 MM 月 dd 日 "
      class="input-time"
      v-model="choseTime.time"
      @blur="handleChangeCheck('input121')"
      :clearable="false"
      type="date"
      align="right"
      size="small"></el-date-picker>

    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input122" class="input-company"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input122" @blur="blurText('input122')" class="input-company"></el-input>

    <template v-if="queryParams.setType != '2'">
      <div v-for="(item, index) in tablesInput2" :key="index">
        <el-input v-for="(item1, index1) in item.children" :key="index1" :disabled="queryParams.setType == '3' ? item1.disable : false" v-model="formParams['input'+item1.sort]" @blur="handleComputed(item1.sort, 'line'+index)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in tablesInput2" :key="index">
        <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" @blur="blurText('input'+item1.sort)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
      </div>
    </template>
  </div>
</template>

<script>
import { numberAdd, formatDate } from '@/common/js/utils.js'
import { obtainmc } from '../../../../api/course'

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
          {}, { sort: 2 }, { sort: 3 }, { sort: 4 }, { sort: 5 }, { sort: 6 },
          { sort: 7 }, { sort: 8 }, { sort: 9 }, { sort: 10 }, { sort: 11, disable: true }, {},
          { sort: 12 }, { sort: 13 }, { sort: 14 }, { sort: 15 }, { sort: 16 }, { sort: 17 },
          { sort: 18 }, { sort: 19 }, { sort: 20 }, { sort: 21 }, { sort: 22 }, { sort: 23 },
          { sort: 24 }, { sort: 25, disable: true }, {}, {}, {}, {}, {}, {}, {}, { sort: 26, disable: true }
        ]
      }, {
        children: [
          {}, { sort: 28 }, { sort: 29 }, { sort: 30 }, { sort: 31 }, { sort: 32 },
          { sort: 33 }, { sort: 34 }, { sort: 35 }, { sort: 36 }, { sort: 37, disable: true }, {},
          { sort: 38 }, { sort: 39 }, { sort: 40 }, { sort: 41 }, { sort: 42 }, { sort: 43 },
          { sort: 44 }, { sort: 45 }, { sort: 46 }, { sort: 47 }, { sort: 48 }, { sort: 49 },
          { sort: 50 }, { sort: 51, disable: true }, {}, {}, {}, {}, {}, {}, {}, { sort: 52, disable: true }
        ]
      }, {
        children: [
          {}, { sort: 54 }, { sort: 55 }, { sort: 56 }, { sort: 57 }, { sort: 58 },
          { sort: 59 }, { sort: 60 }, { sort: 61 }, { sort: 62 }, { sort: 63 }, { sort: 64, disable: true },
          { sort: 65 }, { sort: 66 }, { sort: 67 }, { sort: 68 }, { sort: 69 }, { sort: 70 },
          { sort: 71 }, { sort: 72 }, { sort: 73, disable: true }, { sort: 74, disable: true }, { sort: 75 }, { sort: 76 },
          { sort: 77 }, { sort: 78 }, { sort: 79 }, { sort: 80 }, { sort: 81 }, { sort: 82 },
          { sort: 83, disable: true }, { sort: 84 }, { sort: 85, disable: true }, { sort: 86, disable: true }
        ]
      }, {
        children: [
          {}, { sort: 88 }, { sort: 89 }, { sort: 90 }, { sort: 91 }, { sort: 92 },
          { sort: 93 }, { sort: 94 }, { sort: 95 }, { sort: 96 }, { sort: 97 }, { sort: 98, disable: true },
          { sort: 99 }, { sort: 100 }, { sort: 101 }, { sort: 102 }, { sort: 103 }, { sort: 104 },
          { sort: 105 }, { sort: 106 }, { sort: 107, disable: true }, { sort: 108, disable: true }, { sort: 109 }, { sort: 110 },
          { sort: 111 }, { sort: 112 }, { sort: 113 }, { sort: 114 }, { sort: 115 }, { sort: 116 },
          { sort: 117, disable: true }, { sort: 118 }, { sort: 119, disable: true }, { sort: 120, disable: true }
        ]
      }]
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
        let areaSum = 0
        let lineSum = 0
        let lineSumTwo = 0
        let sumZero, sumOne, sumTwo, sumThree, sumFour, sumFive, sumSix
        if (line == 'line0' || line == 'line1') {
          if (line == 'line0') {
            sumZero = 2
            sumOne = 11
            sumTwo = 25
            sumThree = 26
          } else if (line == 'line1') {
            sumZero = 28
            sumOne = 37
            sumTwo = 51
            sumThree = 52
          }
          if (index < sumOne) {
            for (let i = sumZero; i < sumOne; i++) {
              areaSum = numberAdd(areaSum, this.formParams['input' + i])
            }
            this.$set(this.formParams, 'input' + sumOne, areaSum == 0 ? '' : areaSum) // 设置单个属性

            lineSum = numberAdd(this.formParams['input' + sumOne], this.formParams['input' + sumTwo])
            this.$set(this.formParams, 'input' + sumThree, lineSum == 0 ? '' : lineSum)
          } else {
            for (let i = sumOne + 1; i < sumTwo; i++) {
              areaSum = numberAdd(areaSum, this.formParams['input' + i])
            }
            this.$set(this.formParams, 'input' + sumTwo, areaSum == 0 ? '' : areaSum)

            lineSum = numberAdd(this.formParams['input' + sumOne], this.formParams['input' + sumTwo])
            this.$set(this.formParams, 'input' + sumThree, lineSum == 0 ? '' : lineSum)
          }
        } else {
          if (line == 'line2') {
            sumZero = 54
            sumOne = 64
            sumTwo = 73
            sumThree = 74
            sumFour = 83
            sumFive = 85
            sumSix = 86
          } else if (line == 'line3') {
            sumZero = 88
            sumOne = 98
            sumTwo = 107
            sumThree = 108
            sumFour = 117
            sumFive = 119
            sumSix = 120
          }
          if (index < sumOne) {
            for (let i = sumZero; i < sumOne; i++) {
              areaSum = numberAdd(areaSum, this.formParams['input' + i])
            }
            this.$set(this.formParams, 'input' + sumOne, areaSum == 0 ? '' : areaSum) // 设置单个属性

            lineSum = numberAdd(this.formParams['input' + sumOne], this.formParams['input' + sumTwo])
            this.$set(this.formParams, 'input' + sumThree, lineSum == 0 ? '' : lineSum)

            lineSumTwo = numberAdd(lineSum, this.formParams['input' + sumFive])
            this.$set(this.formParams, 'input' + sumSix, lineSumTwo == 0 ? '' : lineSumTwo)
          } else if (index < sumTwo) {
            for (let i = sumOne + 1; i < sumTwo; i++) {
              areaSum = numberAdd(areaSum, this.formParams['input' + i])
            }
            this.$set(this.formParams, 'input' + sumTwo, areaSum == 0 ? '' : areaSum)

            lineSum = numberAdd(this.formParams['input' + sumOne], this.formParams['input' + sumTwo])
            this.$set(this.formParams, 'input' + sumThree, lineSum == 0 ? '' : lineSum)

            lineSumTwo = numberAdd(lineSum, this.formParams['input' + sumFive])
            this.$set(this.formParams, 'input' + sumSix, lineSumTwo == 0 ? '' : lineSumTwo)
          } else if (index < sumFour) {
            for (let i = sumThree + 2; i < sumFour; i++) {
              areaSum = numberAdd(areaSum, this.formParams['input' + i])
            }
            this.$set(this.formParams, 'input' + sumFour, areaSum == 0 ? '' : areaSum)

            lineSum = numberAdd(this.formParams['input' + sumFour], this.formParams['input' + (sumFour + 1)])
            this.$set(this.formParams, 'input' + sumFive, lineSum == 0 ? '' : lineSum)

            lineSumTwo = numberAdd(this.formParams['input' + sumFive], this.formParams['input' + sumThree])
            this.$set(this.formParams, 'input' + sumSix, lineSumTwo == 0 ? '' : lineSumTwo)
          } else {
            lineSum = numberAdd(this.formParams['input' + sumFour], this.formParams['input' + (sumFour + 1)])
            this.$set(this.formParams, 'input' + sumFive, lineSum == 0 ? '' : lineSum)

            lineSumTwo = numberAdd(this.formParams['input' + sumFive], this.formParams['input' + sumThree])
            this.$set(this.formParams, 'input' + sumSix, lineSumTwo == 0 ? '' : lineSumTwo)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.fz-card-wrapper {
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
    top: 40px;
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
    top: 65px;
    left: 95px;
    input {
      height: 30px;
      text-align: left;
    }
  }
   .input-list-jz {
    width: 152px;
    position: absolute;
    top: 136px;
    left: 273px;
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
      top: 174px;
    }
    &.child2 {
      top: 238px;
    }
    &.child3 {
      top: 301px;
    }
    &.child4 {
      top: 338px;
    }
    &.child5 {
      top: 377px
    }
    &.child6 {
      top: 415px;
    }
    &.child7 {
      top: 454px;
    }
    &.child8 {
      top: 492px;
    }
    &.child9 {
      top: 530px;
    }
    &.child10 {
      top: 569px;
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
      top: 1067px;
    }
    &.child24 {
      top: 1105px;
    }
    &.child25 {
      top: 1143px;
    }
    &.child26 {
      top: 1181px;
    }
    &.child27 {
      top: 1220px;
    }
    &.child28 {
      top: 1258px;
    }
    &.child29 {
      top: 1297px;
    }
    &.child30 {
      top: 1335px;
    }
    &.child31 {
      top: 1373px;
    }
    &.child32 {
      top: 1411px;
    }
    &.child33 {
      top: 1450px;
    }
    &.line0, &.line1 {
      &.child11,&.child26,&.child27,&.child28,&.child29,&.child30,&.child31,&.child32 {
        display: none;
      }
    }
    &.line2,&.line3 {
      &.child12,&.child22 {
        display: none;
      }
    }
    &.line1 {
      left: 431px;
    }
    &.line2 {
      left: 864px;
    }
    &.line3 {
      left: 1022px;
    }
  }
}
</style>