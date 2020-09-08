<template>
  <div class="dialogDivBox">
    <el-form :model="accountDialogData" ref="accountDialogData" :rules="rules">
      <p class="title1">
        <span>基本信息</span>
      </p>
      <div class="form_cont">
        <div class="row1">
          <el-form-item label="企业名称:" prop="companyName" :label-width="formLabelName">
            <el-input v-model="accountDialogData.companyName" :label-width="formLabelInput" disabled placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="纳税性质:" prop="taxlayerType" :label-width="formLabelName">
            <el-radio-group v-model="accountDialogData.taxlayerType" :label-width="formLabelInput" disabled class="radio_check">
              <el-radio :label="`001`">一般纳税人</el-radio>
              <el-radio :label="`101`">小规模纳税人</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="row1">
          <el-form-item label="纳税人识别号:" prop="taxlayerNo" :label-width="formLabelName">
            <el-input v-model="accountDialogData.taxlayerNo" :label-width="formLabelInput" disabled placeholder="请输入纳税人识别号"></el-input>
          </el-form-item>
          <el-form-item label="所在地区:" prop="areaScope" :label-width="formLabelName" class="region_choose">
            <el-cascader v-model="dizhi" :options="options" clearable disabled></el-cascader>
          </el-form-item>
        </div>
      </div>
      <p class="title1">
        <span>账套信息</span>
      </p>
      <div class="form_cont">
        <div class="row1">
          <el-form-item label="会计制度:" prop="companyName" :label-width="formLabelName">
            <el-input v-model="system" disabled placeholder="请选择会计准则"></el-input>
          </el-form-item>
        </div>
        <div class="row1">
          <el-form-item label="启用期间:" required :label-width="formLabelName">
            <div style="display:flex">
              <el-form-item prop="ztStartYear" style="width:150px;margin-right:20px;">
                <el-date-picker
                  disabled
                  style="width:150px;"
                  v-model="accountDialogData.ztStartYear"
                  format="yyyy"
                  value-format="yyyy"
                  type="year"
                  placeholder="选择年">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="ztStartMonth" style="width:150px;">
                <el-date-picker
                  disabled
                  style="width:150px;"
                  v-model="accountDialogData.ztStartMonth"
                  format="MM"
                  value-format="MM"
                  type="month"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
      </div>
      <p class="title1">
        <span>国税登录信息</span>
      </p>
      <div class="form_cont">
        <div class="row1">
          <el-form-item label="登录方式:" prop="companyName" :label-width="formLabelName">
            <el-input :label-width="formLabelInput" disabled placeholder="CA登录"></el-input>
          </el-form-item>
          <el-form-item label="个税登录方式:" prop="companyName" :label-width="formLabelName">
            <el-input :label-width="formLabelInput" disabled placeholder="实名登录"></el-input>
          </el-form-item>
          <el-form-item label="用户名:" prop="companyName" :label-width="formLabelName">
            <el-input :label-width="formLabelInput" disabled placeholder="admin"></el-input>
          </el-form-item>
        </div>
        <div class="row1">
          <el-form-item label="个税申报密码:" prop="taxLayerNo" :label-width="formLabelName">
            <el-input :label-width="formLabelInput" disabled placeholder="" type="password" :value="12223123"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="taxLayerNo" :label-width="formLabelName">
            <el-input :label-width="formLabelInput" disabled placeholder="" type="password" :value="123123"></el-input>
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
  name: 'AddAccount',
  props: {
    accountDialogData: {
      type: Object
    }
  },
  data() {
    return {
      options: aeraData,
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
      system: '', // 会计制度
      formLabelInput: '260px',
      formLabelName: '120px',
      dizhi: []
    }
  },
  created() {
    // 地址
    this.dizhi.push(this.accountDialogData.provinceId)
    this.dizhi.push(this.accountDialogData.cityId)
    this.dizhi.push(this.accountDialogData.areaId)
    switch (this.accountDialogData.kjzzId) {
      case '1':
        this.system = '小企业会计准则2013版'
        break
      case '3':
        this.system = '企业会计准则2007版'
        break
      case '4':
        this.system = '企业会计准则2017版'
        break
      case '6':
        this.system = '民间非营利组织会计制度'
        break
    }
  },
  mounted() {
  },
  methods: {
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
            padding-left: 30px;
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
