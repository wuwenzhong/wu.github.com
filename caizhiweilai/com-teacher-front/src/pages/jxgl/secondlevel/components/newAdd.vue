<template>
  <div class="dialogDivBox">
    <el-form :model="addFormData" ref="addFormData" :rules="rules">
      <p class="title1">
        <span>基本信息</span>
      </p>
      <div class="form_cont">
        <div class="row1">
          <el-form-item label="企业名称:" prop="companyName" :label-width="formLabelName">
            <el-input
              v-model="addFormData.company"
              :label-width="formLabelInput"
              disabled
              placeholder="请输入企业名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="纳税性质:" prop="taxLayerTypes" :label-width="formLabelName">
            <el-radio-group
              v-model="addFormData.taxLayerType"
              :label-width="formLabelInput"
              disabled
              class="radio_check"
            >
              <el-radio :label="`001`">一般纳税人</el-radio>
              <el-radio :label="`101`">小规模纳税人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="经营范围:" prop="business" :label-width="formLabelName">
            <el-input
              type="textarea"
              v-model="addFormData.businessScope"
              placeholder="请输入经营范围"
              :label-width="formLabelInput"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所属行业:"
            prop="industry"
            :label-width="formLabelName"
            class="industry_box"
          >
            <el-select
              v-model="addFormData.industryName"
              class="industry1"
              placeholder="请选择"
              @change="chooseFirstIndut($event,1)"
              disabled
            >
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="item in firstIndutryData"
                :key="item.code"
              ></el-option>
            </el-select>
            <el-select
              v-model="addFormData.industrySecondName"
              class="industry2"
              placeholder="请选择"
              @change="chooseFirstIndut($event,2)"
              disabled
            >
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="item in twoIndutryDta"
                :key="item.code"
              ></el-option>
            </el-select>
            <el-select
              v-model="addFormData.industryThirdName"
              class="industry3"
              placeholder="请选择"
              @change="chooseLastIndutry"
              disabled
            >
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="item in threeIndutry"
                :key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row1">
          <el-form-item label="纳税人识别号:" prop="taxLayerNo" :label-width="formLabelName">
            <el-input
              v-model="addFormData.taxLayerNo"
              :label-width="formLabelInput"
              disabled
              placeholder="请输入纳税人识别号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所在地区:"
            prop="areaScope"
            :label-width="formLabelName"
            class="region_choose"
          >
            <el-cascader v-model="dizhi" :options="options" clearable disabled></el-cascader>
          </el-form-item>
          <el-form-item prop="detailAddress" class="detail_box">
            <el-input
              type="textarea"
              v-model="addFormData.addressDetail"
              placeholder="请输入详细地址"
              :label-width="formLabelInput"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="人员规模:" prop="personSize" :label-width="formLabelName">
            <el-select v-model="addFormData.scales" placeholder="请选择人员数量" disabled>
              <el-option label="0~20人" value="20"></el-option>
              <el-option label="21~50人" value="50"></el-option>
              <el-option label="51~100人" value="100"></el-option>
              <el-option label="100~200" value="200"></el-option>
              <el-option label="200人以上" value="201"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getFirstIndustry, getOtherIndustry } from '@/api/teamAdmin'
import aeraData from '../../../../common/js/area'

export default {
  name: 'newAdd',
  props: {
    addFormData: {
      type: Object
    }
  },
  data() {
    return {
      options: aeraData,
      firstLevelIndustry: '', // 所属行业一级
      twoLevelIndustry: '', // 所属行业二级
      threeLevelIndustry: '', // 所属行业三级
      firstIndutryData: [], // 行业一级
      twoIndutryDta: [], // 行业耳机
      threeIndutry: [], // 行业三级
      rules: {
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        taxLayerTypes: [
          { required: true, message: '请选择纳税性质', trigger: 'change' }
        ],
        business: [
          { required: true, message: '请输入经营范围', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'blur' }
        ],
        taxLayerNo: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
        ],
        areaScope: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        personSize: [
          { required: true, message: '请选择人员数量', trigger: 'change' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      formLabelInput: '260px',
      formLabelName: '120px',
      dizhi: []
    }
  },
  created() {
    this.getFirstIndustryData() // 请求行业一级数据
    // 地址
    this.dizhi = this.addFormData.address.split(',')
  },
  mounted() {
  },
  methods: {
    // 请求行业一级
    getFirstIndustryData() {
      const _this = this
      getFirstIndustry().then(res => {
        if (res.code == 0) {
          _this.firstIndutryData = res.result
        }
      })
    },
    // 选择一级行业,选择二级行业
    chooseFirstIndut(e, level) {
      const _val = e
      if (level == 1) {
        this.firstLevelIndustry = _val
        this.twoLevelIndustry = ''
        this.threeLevelIndustry = ''
        this.addFormData.industry = ''
        this.addFormData.industryCode = _val
        this.addFormData.industrySecondCode = ''
        this.addFormData.industryThirdCode = ''
      }
      if (level == 2) {
        this.twoLevelIndustry = _val
        this.threeLevelIndustry = ''
        this.addFormData.industry = ''
        this.addFormData.industrySecondCode = _val
        this.addFormData.industryThirdCode = ''
      }
      this.getTwoThreeIndutry(_val, level)
    },
    // 选择三级行业
    chooseLastIndutry(_val) {
      this.addFormData.industry = _val
      this.addFormData.industryThirdCode = _val
    },
    // 获取二三级行业
    getTwoThreeIndutry(id, level) {
      const _this = this
      const getParameter = '?pid=' + id
      getOtherIndustry(getParameter).then(res => {
        if (res.data.code == 0) {
          if (level == 1) {
            _this.twoIndutryDta = res.data.result
          }
          if (level == 2) {
            _this.threeIndutry = res.data.result
          }
        }
      })
    },
    //    清除行业选择的状态
    clearOldData() {
      this.firstLevelIndustry = '' // 所属行业一级
      this.twoLevelIndustry = '' // 所属行业二级
      this.threeLevelIndustry = '' // 所属行业三级
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialogDivBox {
    .title1 {
      width: 100%;
      color: #444444;
      margin-bottom: 20px;
      font-size: 15px;

      span {
        font-size: 15px;
      }

      em {
        color: red;
        font-size: 15px;
        font-style: normal;
        margin-left: 20px;
      }
    }

    .form_cont {
      display: flex;

      .row1 {
        width: 50%;
        display: block;

        /deep/ .el-form-item {
          width: 100%;

          /deep/ .radio_check {
            display: flex;

            /deep/ .el-radio__input {
              line-height: 40px;
            }
          }

          /deep/ .el-textarea__inner {
            resize: none;
          }

          /deep/ .el-select {
            width: 100%;
          }

          /deep/ .el-input__suffix {
            right: 0;
          }

          /deep/ .el-input--suffix .el-input__inner {
            padding-left: 10px;
            padding-right: 25px;
          }
        }

        /deep/ .detail_box {
          width: calc(100% - 120px);
          margin-left: 120px;
        }

        /deep/ .industry_box,
        .region_choose {
          /deep/ .el-form-item__content {
            display: flex;

            .industry1,
            .industry2,
            .industry3,
            .address1,
            .address2,
            .address3 {
              margin-right: 12px;
            }

            .industry3,
            .address3 {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>
