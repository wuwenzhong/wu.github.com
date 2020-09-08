<template>
  <div class="dialogDivBox">
    <div class="dialog-left">
      <p>新增企业信息</p>
      <strong>NEWLY <i>INCREASED</i> </strong>
    </div>
    <el-form :model="accountDialogData" class="dialog-right" ref="accountDialogData" :rules="rules">
      <div class="list">
        <el-form-item label="企业名称:" prop="companyName" :label-width="formLabelName">
          <el-input v-model="accountDialogData.companyName" disabled placeholder="请输入企业名称"></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="纳税人识别号:" prop="taxlayerNo" :label-width="formLabelName">
          <el-input v-model="accountDialogData.taxlayerNo" disabled placeholder="请输入纳税人识别号"></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="所在地区:" prop="areaScope" :label-width="formLabelName" class="region_choose">
          <el-cascader v-model="dizhi" :options="options" clearable class="wd400" disabled></el-cascader>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="纳税性质:" prop="taxlayerType" :label-width="formLabelName">
          <el-radio-group v-model="accountDialogData.taxlayerType" disabled class="radio_check">
            <el-radio :label="`001`">一般纳税人</el-radio>
            <el-radio :label="`101`">小规模纳税人</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="会计制度:" prop="companyName" :label-width="formLabelName">
          <el-input v-model="system" disabled placeholder="请选择会计准则"></el-input>
        </el-form-item>
      </div>
      <div class="list">
        <el-form-item label="启用期间:" required :label-width="formLabelName">
          <div style="display:flex">
            <el-form-item prop="ztStartYear" style="width:100px;margin-right:30px;">
              <el-date-picker
                disabled
                style="width:103px"
                v-model="accountDialogData.ztStartYear"
                format="yyyy"
                value-format="yyyy"
                type="year"
                placeholder="选择年">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="ztStartMonth" style="width:112px;">
              <el-date-picker
                disabled
                style="width:112px;"
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
      <div class="list login-list">
        <el-form-item label="登录方式:" prop="companyName" :label-width="formLabelName">
          <el-input disabled placeholder="CA登录"></el-input>
        </el-form-item>
        <el-form-item label="个税登录方式:" prop="companyName" :label-width="formLabelName" class="second">
          <el-input disabled placeholder="实名登录"></el-input>
        </el-form-item>
      </div>
      <div class="list login-list">
        <el-form-item label="用户名:" prop="companyName" :label-width="formLabelName">
          <el-input disabled placeholder="admin"></el-input>
        </el-form-item>
        <el-form-item label="个税申报密码:" prop="taxLayerNo" :label-width="formLabelName" class="second">
          <el-input disabled placeholder="" type="password" :value="12223123"></el-input>
        </el-form-item>
      </div>
      <div class="list login-list">
        <el-form-item label="密码:" prop="taxLayerNo" :label-width="formLabelName">
          <el-input disabled placeholder="" type="password" :value="123123"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import aeraData from '@/common/js/area'

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
      formLabelName: '110px',
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
        margin-bottom: 20px;
        line-height: 40px;
        &.login-list{
          display: flex;
          /deep/.el-form-item{
            margin-bottom:0;
          }
          .second{
            padding-left: 15px;
          }
        }
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
