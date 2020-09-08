<template>
  <div class="dialogDivBox">
    <div class="dialog-left">
      <p>新增企业信息</p>
      <strong>NEWLY <i>INCREASED</i> </strong>
    </div>
    <el-form :model="addFormData" ref="addFormData" class="dialog-right" :rules="rules">
      <div class="list">
        <el-form-item label="企业名称:" prop="companyName" :label-width="formLabelName">
          <el-input
            v-model="addFormData.company"
            disabled
            placeholder="请输入企业名称"
          ></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="纳税人识别号:" prop="taxlayerNo" :label-width="formLabelName">
          <el-input
            v-model="addFormData.taxLayerNo"
            disabled
            placeholder="请输入纳税人识别号"
          ></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item
          label="所在地区:"
          prop="areaScope"
          :label-width="formLabelName"
          class="region_choose"
        >
          <el-cascader v-model="dizhi" :options="options" clearable disabled></el-cascader>
          —
          <el-input
            class="detail-address"
            v-model="addFormData.addressDetail"
            placeholder="请输入详细地址"
            disabled
          ></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="纳税性质:" prop="taxLayerType" :label-width="formLabelName">
          <el-radio-group
            v-model="addFormData.taxLayerType"
            disabled
            class="radio_check"
          >
            <el-radio :label="`001`">一般纳税人</el-radio>
            <el-radio :label="`101`">小规模纳税人</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="经营范围:" prop="business" :label-width="formLabelName">
          <el-input
            v-model="addFormData.businessScope"
            placeholder="请输入经营范围"
            disabled
          ></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item
          label="所属行业:"
          prop="industry"
          :label-width="formLabelName"
          class="industry_box"
        >
          <el-select
            v-model="addFormData.industryName"
            class="industry"
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
          </el-select> —
          <el-select
            v-model="addFormData.industrySecondName"
            class="industry"
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
          </el-select> —
          <el-select
            v-model="addFormData.industryThirdName"
            class="industry"
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
      <div class="list">
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
    </el-form>
  </div>
</template>
<script>
/* eslint-disable */
import { getFirstIndustry, getOtherIndustry } from '@/api/trainingCenter'
import areaJs from '@/common/js/select_area'
export default {
  name: 'newAdd',
  props: {
    addFormData: {
      type: Object
    }
  },
  data() {
    return {
      options: areajson,
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
        taxLayerType: [
          { required: true, message: '请选择纳税性质', trigger: 'change' }
        ],
        business: [
          { required: true, message: '请输入经营范围', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'blur' }
        ],
        taxlayerNo: [
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
      formLabelName: '110px',
      dizhi:[]
    }
  },
  created() {
    this.getFirstIndustryData() // 请求行业一级数据
    this.dizhi = this.addFormData.address.split(',')  // 地址
  },
  mounted() {},
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
  width: 100%;
  height: 100%;
  display: flex;
  border-radius:20px;
  .dialog-left{
    width: 286px;
    height: 100%;
    text-align: center;
    background: url("../../../common/images/dialog-pic1.png")no-repeat center / 100% 100%;
    p{
      font-size: 28px;
      line-height: 48px;
      color: #1F1F1E;
      margin-top:150px;
    }
    strong{
      font-size: 16px;
      line-height: 24px;
      color: #0324FD;
      font-weight: normal;
      i{
        font-style: normal;
        color: $color-theme;
      }
    }
  }
  .dialog-right{
    flex: 1;
    padding:60px 30px 40px 30px;
    .list{
      margin-bottom: 30px;
      line-height: 40px;
      /deep/.el-form-item__label{
        font-size: 14px;
        color:#2E323D;
        width: 110px;
        text-align: left;
      }
      /deep/.detail-address{
        width:240px;
      }
      /deep/.industry{
        width: 130px;
      }
      /deep/.el-form-item__content{
        color:#C0C4CC;
      }
    }
  }
}
</style>
