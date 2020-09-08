<template>
  <!-- 记账凭证 -->
  <div class="jz-card-wrapper">
    <img src="./images/back-four.png" class="back-image" alt="">

    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input1" class="input"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input2" class="input input-year"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input3" class="input input-month"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input4" class="input input-day"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input1" @blur="blurText('input1')" class="input"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input2" @blur="blurText('input2')" class="input input-year"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input3" @blur="blurText('input3')" class="input input-month"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input4" @blur="blurText('input4')" class="input input-day"></el-input>

    <div v-for="(item, index) in tablesInput" :key="index">
      <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" @blur="blurText('input'+item1.sort, item1.maxNum)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
    </div>

    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input10" class="input-list-jz line0 child0"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input11" class="input-list-jz line0 child1"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input12" class="input-list-jz line0 child2"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input13" class="input-list-jz line0 child3"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input14" class="input-list-jz line0 child4"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input15" class="input-list-jz line0 child5"></el-input>

    <el-select v-show="queryParams.setType != '2'" @change="selectSubject('input22', 'input16')" v-model="formParams.input16" class="input-list-jz line1 child0" placeholder="">
      <el-option v-for="item in selectArray.input" :key="item.code" :label="item.name" :value="item.code"></el-option>
    </el-select>
    <el-select v-show="queryParams.setType != '2'" @change="selectSubject('input23', 'input17')" v-model="formParams.input17" class="input-list-jz line1 child1" placeholder="">
      <el-option v-for="item in selectArray.input" :key="item.code" :label="item.name" :value="item.code"></el-option>
    </el-select>
    <el-select v-show="queryParams.setType != '2'" @change="selectSubject('input24', 'input18')" v-model="formParams.input18" class="input-list-jz line1 child2" placeholder="">
      <el-option v-for="item in selectArray.input" :key="item.code" :label="item.name" :value="item.code"></el-option>
    </el-select>
    <el-select v-show="queryParams.setType != '2'" @change="selectSubject('input25', 'input19')" v-model="formParams.input19" class="input-list-jz line1 child3" placeholder="">
      <el-option v-for="item in selectArray.input" :key="item.code" :label="item.name" :value="item.code"></el-option>
    </el-select>
    <el-select v-show="queryParams.setType != '2'" @change="selectSubject('input26', 'input20')" v-model="formParams.input20" class="input-list-jz line1 child4" placeholder="">
      <el-option v-for="item in selectArray.input" :key="item.code" :label="item.name" :value="item.code"></el-option>
    </el-select>
    <el-select v-show="queryParams.setType != '2'" @change="selectSubject('input27', 'input21')" v-model="formParams.input21" class="input-list-jz line1 child5" placeholder="">
      <el-option v-for="item in selectArray.input" :key="item.code" :label="item.name" :value="item.code"></el-option>
    </el-select>

    <el-cascader
      v-model="selectedArray.input22"
      v-show="queryParams.setType != '2'"
      :key="selectArray.keyinput22"
      :options="selectArray.input22"
      :props="{expandTrigger: 'hover',value: 'code',label: 'name',children: 'sonList'}"
      :show-all-levels="false"
      class="input-list-jz line2 child0"
      placeholder=""
      @change="handleChangeSelect('input22')"
    ></el-cascader>
    <el-cascader
      v-model="selectedArray.input23"
      v-show="queryParams.setType != '2'"
      :key="selectArray.keyinput23"
      :options="selectArray.input23"
      :props="{expandTrigger: 'hover',value: 'code',label: 'name',children: 'sonList'}"
      :show-all-levels="false"
      class="input-list-jz line2 child1"
      placeholder=""
      @change="handleChangeSelect('input23')"
    ></el-cascader>
    <el-cascader
      v-model="selectedArray.input24"
      v-show="queryParams.setType != '2'"
      :key="selectArray.keyinput24"
      :options="selectArray.input24"
      :props="{expandTrigger: 'hover',value: 'code',label: 'name',children: 'sonList'}"
      :show-all-levels="false"
      class="input-list-jz line2 child2"
      placeholder=""
      @change="handleChangeSelect('input24')"
    ></el-cascader>
    <el-cascader
      v-model="selectedArray.input25"
      v-show="queryParams.setType != '2'"
      :key="selectArray.keyinput25"
      :options="selectArray.input25"
      :props="{expandTrigger: 'hover',value: 'code',label: 'name',children: 'sonList'}"
      :show-all-levels="false"
      class="input-list-jz line2 child3"
      placeholder=""
      @change="handleChangeSelect('input25')"
    ></el-cascader>
    <el-cascader
      v-model="selectedArray.input26"
      v-show="queryParams.setType != '2'"
      :key="selectArray.keyinput26"
      :options="selectArray.input26"
      :props="{expandTrigger: 'hover',value: 'code',label: 'name',children: 'sonList'}"
      :show-all-levels="false"
      class="input-list-jz line2 child4"
      placeholder=""
      @change="handleChangeSelect('input25')"
    ></el-cascader>
    <el-cascader
      v-model="selectedArray.input27"
      v-show="queryParams.setType != '2'"
      :key="selectArray.keyinput27"
      :options="selectArray.input27"
      :props="{expandTrigger: 'hover',value: 'code',label: 'name',children: 'sonList'}"
      :show-all-levels="false"
      class="input-list-jz line2 child5"
      placeholder=""
      @change="handleChangeSelect('input27')"
    ></el-cascader>

    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input182"
      class="input-list-jz line25 child0"
      @change="handleChangeCheck('input182')"
    ></el-checkbox>
    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input183"
      class="input-list-jz line25 child1"
      @change="handleChangeCheck('input183')"
    ></el-checkbox>
    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input184"
      class="input-list-jz line25 child2"
      @change="handleChangeCheck('input184')"
    ></el-checkbox>
    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input185"
      class="input-list-jz line25 child3"
      @change="handleChangeCheck('input185')"
    ></el-checkbox>
    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input186"
      class="input-list-jz line25 child4"
      @change="handleChangeCheck('input186')"
    ></el-checkbox>
    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input187"
      class="input-list-jz line25 child5"
      @change="handleChangeCheck('input187')"
    ></el-checkbox>
    <el-checkbox
      v-show="queryParams.setType != '2'"
      v-model="selectedArray.input188"
      class="input-list-jz line25 child6"
      @change="handleChangeCheck('input188')"
    ></el-checkbox>

    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input5" class="input-person"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input6" class="input-person jizhang"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input7" class="input-person chuna"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input8" class="input-person fuhe"></el-input>
    <el-input v-show="queryParams.setType != '2'" v-model="formParams.input9" class="input-person zhidan"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input5" @blur="blurText('input5')" class="input-person"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input6" @blur="blurText('input6')" class="input-person jizhang"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input7" @blur="blurText('input7')" class="input-person chuna"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input8" @blur="blurText('input8')" class="input-person fuhe"></el-input>
    <el-input v-show="queryParams.setType == '2'" v-model="formParams.input9" @blur="blurText('input9')" class="input-person zhidan"></el-input>
  </div>
</template>

<script>
import { accountSubjectListBy } from '@/api/formAbout.js'
import { deepClone } from '@/common/js/utils.js'

export default {
  props: {
    queryParams: {
      type: Object
    },
    formParams: {
      type: Object
    },
    selectedArray: {
      type: Object
    }
  },
  data() {
    return {
      selectArray: {
        input: [], // 科目下拉
        input22: [],
        input23: [],
        input24: [],
        input25: [],
        input26: [],
        input27: [],
        keyinput22: 2000, // 用于更新下拉框
        keyinput23: 3000,
        keyinput24: 4000,
        keyinput25: 5000,
        keyinput26: 6000,
        keyinput27: 7000
      },
      tablesInput: [
        { children: [{ sort: 10 }, { sort: 11 }, { sort: 12 }, { sort: 13 }, { sort: 14 }, { sort: 15 }] },
        { children: [{ sort: 16 }, { sort: 17 }, { sort: 18 }, { sort: 19 }, { sort: 20 }, { sort: 21 }] },
        { children: [{ sort: 22 }, { sort: 23 }, { sort: 24 }, { sort: 25 }, { sort: 26 }, { sort: 27 }] },
        { children: [{ sort: 28, maxNum: 10 }, { sort: 29, maxNum: 10 }, { sort: 30, maxNum: 10 }, { sort: 31, maxNum: 10 }, { sort: 32, maxNum: 10 }, { sort: 33 }, { sort: 34, maxNum: 10 }] },
        { children: [{ sort: 35, maxNum: 10 }, { sort: 36, maxNum: 10 }, { sort: 37, maxNum: 10 }, { sort: 38, maxNum: 10 }, { sort: 39, maxNum: 10 }, { sort: 40, maxNum: 10 }, { sort: 41, maxNum: 10 }] },
        { children: [{ sort: 42, maxNum: 10 }, { sort: 43, maxNum: 10 }, { sort: 44, maxNum: 10 }, { sort: 45, maxNum: 10 }, { sort: 46, maxNum: 10 }, { sort: 47, maxNum: 10 }, { sort: 48, maxNum: 10 }] },
        { children: [{ sort: 49, maxNum: 10 }, { sort: 50, maxNum: 10 }, { sort: 51, maxNum: 10 }, { sort: 52, maxNum: 10 }, { sort: 53, maxNum: 10 }, { sort: 54, maxNum: 10 }, { sort: 55, maxNum: 10 }] },
        { children: [{ sort: 56, maxNum: 10 }, { sort: 57, maxNum: 10 }, { sort: 58, maxNum: 10 }, { sort: 59, maxNum: 10 }, { sort: 60, maxNum: 10 }, { sort: 61, maxNum: 10 }, { sort: 62, maxNum: 10 }] },
        { children: [{ sort: 63, maxNum: 10 }, { sort: 64, maxNum: 10 }, { sort: 65, maxNum: 10 }, { sort: 66, maxNum: 10 }, { sort: 67, maxNum: 10 }, { sort: 68, maxNum: 10 }, { sort: 69, maxNum: 10 }] },
        { children: [{ sort: 70, maxNum: 10 }, { sort: 71, maxNum: 10 }, { sort: 72, maxNum: 10 }, { sort: 73, maxNum: 10 }, { sort: 74, maxNum: 10 }, { sort: 75, maxNum: 10 }, { sort: 76, maxNum: 10 }] },
        { children: [{ sort: 77, maxNum: 10 }, { sort: 78, maxNum: 10 }, { sort: 79, maxNum: 10 }, { sort: 80, maxNum: 10 }, { sort: 81, maxNum: 10 }, { sort: 82, maxNum: 10 }, { sort: 83, maxNum: 10 }] },
        { children: [{ sort: 84, maxNum: 10 }, { sort: 85, maxNum: 10 }, { sort: 86, maxNum: 10 }, { sort: 87, maxNum: 10 }, { sort: 88, maxNum: 10 }, { sort: 89, maxNum: 10 }, { sort: 90, maxNum: 10 }] },
        { children: [{ sort: 91, maxNum: 10 }, { sort: 92, maxNum: 10 }, { sort: 93, maxNum: 10 }, { sort: 94, maxNum: 10 }, { sort: 95, maxNum: 10 }, { sort: 96, maxNum: 10 }, { sort: 97, maxNum: 10 }] },
        { children: [{ sort: 98, maxNum: 10 }, { sort: 99, maxNum: 10 }, { sort: 100, maxNum: 10 }, { sort: 102, maxNum: 10 }, { sort: 102, maxNum: 10 }, { sort: 103, maxNum: 10 }, { sort: 104, maxNum: 10 }] },
        { children: [{ sort: 105, maxNum: 10 }, { sort: 106, maxNum: 10 }, { sort: 107, maxNum: 10 }, { sort: 108, maxNum: 10 }, { sort: 109, maxNum: 10 }, { sort: 110, maxNum: 10 }, { sort: 111, maxNum: 10 }] },
        { children: [{ sort: 112, maxNum: 10 }, { sort: 113, maxNum: 10 }, { sort: 114, maxNum: 10 }, { sort: 115, maxNum: 10 }, { sort: 116, maxNum: 10 }, { sort: 117, maxNum: 10 }, { sort: 118, maxNum: 10 }] },
        { children: [{ sort: 119, maxNum: 10 }, { sort: 120, maxNum: 10 }, { sort: 121, maxNum: 10 }, { sort: 122, maxNum: 10 }, { sort: 123, maxNum: 10 }, { sort: 124, maxNum: 10 }, { sort: 125, maxNum: 10 }] },
        { children: [{ sort: 126, maxNum: 10 }, { sort: 127, maxNum: 10 }, { sort: 128, maxNum: 10 }, { sort: 129, maxNum: 10 }, { sort: 130, maxNum: 10 }, { sort: 131, maxNum: 10 }, { sort: 132, maxNum: 10 }] },
        { children: [{ sort: 133, maxNum: 10 }, { sort: 134, maxNum: 10 }, { sort: 135, maxNum: 10 }, { sort: 136, maxNum: 10 }, { sort: 137, maxNum: 10 }, { sort: 138, maxNum: 10 }, { sort: 139, maxNum: 10 }] },
        { children: [{ sort: 140, maxNum: 10 }, { sort: 141, maxNum: 10 }, { sort: 142, maxNum: 10 }, { sort: 143, maxNum: 10 }, { sort: 144, maxNum: 10 }, { sort: 145, maxNum: 10 }, { sort: 146, maxNum: 10 }] },
        { children: [{ sort: 147, maxNum: 10 }, { sort: 148, maxNum: 10 }, { sort: 149, maxNum: 10 }, { sort: 150, maxNum: 10 }, { sort: 151, maxNum: 10 }, { sort: 152, maxNum: 10 }, { sort: 153, maxNum: 10 }] },
        { children: [{ sort: 154, maxNum: 10 }, { sort: 155, maxNum: 10 }, { sort: 156, maxNum: 10 }, { sort: 157, maxNum: 10 }, { sort: 158, maxNum: 10 }, { sort: 159, maxNum: 10 }, { sort: 160, maxNum: 10 }] },
        { children: [{ sort: 161, maxNum: 10 }, { sort: 162, maxNum: 10 }, { sort: 163, maxNum: 10 }, { sort: 164, maxNum: 10 }, { sort: 165, maxNum: 10 }, { sort: 166, maxNum: 10 }, { sort: 167, maxNum: 10 }] },
        { children: [{ sort: 168, maxNum: 10 }, { sort: 169, maxNum: 10 }, { sort: 170, maxNum: 10 }, { sort: 171, maxNum: 10 }, { sort: 172, maxNum: 10 }, { sort: 173, maxNum: 10 }, { sort: 174, maxNum: 10 }] },
        { children: [{ sort: 175, maxNum: 10 }, { sort: 176, maxNum: 10 }, { sort: 177, maxNum: 10 }, { sort: 178, maxNum: 10 }, { sort: 179, maxNum: 10 }, { sort: 180, maxNum: 10 }, { sort: 181, maxNum: 10 }] },
        { children: [{ sort: 182 }, { sort: 183 }, { sort: 184 }, { sort: 185 }, { sort: 186 }, { sort: 187 }, { sort: 188 }] }
      ]
    }
  },
  created() {
    // 获取科目列表
    this.getSelectList('input')
  },
  methods: {
    // 选择下拉科目
    selectSubject(val, params) {
      // 获取会计科目
      this.getSelectList(val, this.formParams[params])
    },
    // 下拉框选中转换
    handleChangeSelect(val) {
      // 数组转字符串
      this.formParams[val] = this.selectedArray[val].join(',')
    },
    // 多选框选中转换
    handleChangeCheck(val) {
      this.formParams[val] = this.selectedArray[val] + ''
    },
    // 调用父组件失去焦点事件
    blurText(input, num) {
      this.$emit('blur-event', input, num)
    },
    // 获取会计科目列表
    getSelectList(val, pcode) {
      if (val != 'input') {
        this.selectParams.queryType = 'son'
        // 改变key值 重新加载下拉联动
        // fix: Cannot read property 'level' of null"
        ++this.selectArray['key' + val]
        if (pcode == '' || pcode == undefined) {
          this.selectedArray[val] = []
          this.selectArray[val] = []
        } else {
          // 深拷贝防止对象被改变
          const newParams = deepClone(this.selectParams)
          newParams.pcode = pcode
          accountSubjectListBy(newParams).then(res => {
            if (res.code === '0') {
              if (res.result.length > 0) {
                if (this.selectedArray[val][0] && this.selectedArray[val][0].indexOf(res.result[0].pcode) == -1) {
                  // 下拉列表 不包含 选中数组
                  ++this.selectArray['key' + val]
                  this.selectedArray[val] = []
                  this.formParams[val] = ''
                }
              } else {
                // 下拉列表为空 置空选中数组
                this.selectedArray[val] = []
                this.formParams[val] = ''
              }
              // 获取下拉列表
              this.selectArray[val] = res.result
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      } else {
        this.selectParams = {
          queryType: 'parent'
        }
        accountSubjectListBy(this.selectParams).then(res => {
          if (res.code === '0') {
            this.selectArray[val] = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .jz-card-wrapper {
    position: relative;
    .back-image {
      width: 1180px;
      position: absolute;
      top: 0;
    }
    input {
      padding: 0;
      border: none;
      background: #fff;
    }
    .input {
      width: 38px;
      position: absolute;
      top: 41px;
      left: 985px;
      input {
        height: 22px !important;
      }
      &.input-year {
        width: 56px;
        top: 73px;
        left: 514px;
      }
      &.input-month {
        width: 26px;
        top: 73px;
        left: 600px;
      }
      &.input-day {
        width: 26px;
        top: 73px;
        left: 664px;
      }
    }
    .input-person {
      width: 68px;
      position: absolute;
      top: 460px;
      left: 312px;
      input {
        height: 26px;
        // text-align: center;
        // color: red;
        // border: 3px solid red;
      }
      &.jizhang {
        left: 468px;
      }
      &.chuna {
        left: 634px;
      }
      &.fuhe {
        left: 780px;
      }
      &.zhidan {
        left: 962px;
      }
    }
    .input-list-jz {
      width: 177px;
      position: absolute;
      top: 151px;
      left: 46px;
      input {
        height: 40px !important;
      }
      &.child1 {
        top: 195px;
      }
      &.child2 {
        top: 238px;
      }
      &.child3 {
        top: 282px;
      }
      &.child4 {
        top: 325px;
      }
      &.child5 {
        top: 369px;
      }
      &.child6 {
        top: 412px;
      }
      &.line1 {
        width: 165px;
        left: 227px;
      }
      &.line2 {
        width: 260px;
        left: 396px;
      }
      &.line3 {
        width: 15px;
        left: 661px;
      }
      &.line4 {
        width: 15px;
        left: 680px;
      }
      // &.line3 {
      //   width: 205px;
      //   left: 661px;
      // }
      // &.line4 {
      //   width: 206px;
      //   left: 871px;
      // }
      &.line5 {
        width: 15px;
        left: 699px;
      }
      &.line6 {
        width: 15px;
        left: 718px;
      }
      &.line7 {
        width: 15px;
        left: 737px;
      }
      &.line8 {
        width: 15px;
        left: 756px;
      }
      &.line9 {
        width: 15px;
        left: 775px;
      }
      &.line10 {
        width: 15px;
        left: 794px;
      }
      &.line11 {
        width: 15px;
        left: 813px;
      }
      &.line12 {
        width: 15px;
        left: 832px;
      }
      &.line13 {
        width: 15px;
        left: 851px;
      }
      &.line14 {
        width: 15px;
        left: 871px;
      }
      &.line15 {
        width: 15px;
        left: 890px;
      }
      &.line16 {
        width: 15px;
        left: 909px;
      }
      &.line17 {
        width: 15px;
        left: 928px;
      }
      &.line18 {
        width: 15px;
        left: 947px;
      }
      &.line19 {
        width: 15px;
        left: 966px;
      }
      &.line20 {
        width: 15px;
        left: 986px;
      }
      &.line21 {
        width: 15px;
        left: 1005px;
      }
      &.line22 {
        width: 15px;
        left: 1024px;
      }
      &.line23 {
        width: 15px;
        left: 1043px;
      }
      &.line24 {
        width: 15px;
        left: 1062px;
      }
      &.line25 {
        width: 24px;
        left: 1087px;
        top: 160px;
        input {
          height: 25px !important;
          // border-color: #000;
        }
        // 选中框css
        .el-checkbox__inner {
          width: 24px;
          height: 25px;
          &::after {
            border: 1px solid #000;
            border-left: 0;
            border-top: 0;
            width: 6px;
            height: 14px;
            top: 2px;
            left: 8px;
          }
        }
        .el-checkbox__inner {
          background-color: #fff;
          border-color: #000;
        }
        &.child1 {
          top: 203px;
        }
        &.child2 {
          top: 247px;
        }
        &.child3 {
          top: 290px;
        }
        &.child4 {
          top: 334px;
        }
        &.child5 {
          top: 377px;
        }
        &.child6 {
          top: 421px;
        }
      }
    }
  }
</style>