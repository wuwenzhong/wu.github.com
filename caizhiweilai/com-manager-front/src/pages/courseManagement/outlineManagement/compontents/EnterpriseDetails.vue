<template>
  <div>
    <el-form :model="form" label-width="120px" :rules="rules">
      <el-form-item label="企业名称：" prop="company" :label-width="formLabelWidth">
        <el-input size="small" placeholder="请输入企业名称" v-model="form.company" @change="Enterprise"></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号：" prop="taxLayerNo">
          <el-input v-model.trim="form.taxLayerNo" :label-width="formLabelInput" placeholder="请输入纳税人识别号"></el-input>
      </el-form-item>
      <el-form-item label="纳税性质：" prop="taxLayerType">
        <el-radio-group v-model="form.taxLayerType" @change="NSpeople">
          <el-radio :label="'001'">增值税一般纳税人</el-radio>
          <el-radio :label="101">小规模纳税人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所在地区：" prop="finalAddress">
        <el-cascader v-model="form.finalAddress" :options="options" clearable @change="Add" class="wd400"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址：" prop="addressDetail">
        <el-input type="textarea" v-model="form.addressDetail" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="经营范围：" prop="businessScope" :label-width="formLabelName">
          <el-input type="textarea" v-model="form.businessScope" placeholder="请输入经营范围"
                    :label-width="formLabelInput"></el-input>
      </el-form-item>
      <el-form-item label="所属行业：" prop="industry" class="industry_box">
          <el-select v-model="firstLevelIndustry" class="industry1" placeholder="请选择" @change="chooseFirstIndut($event,1)">
              <el-option :label="item.name" :value="item.code" v-for="item in firstIndutryData" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="twoLevelIndustry" class="industry2" placeholder="请选择" @change="chooseFirstIndut($event,2)">
              <el-option :label="item.name" :value="item.code" v-for="item in twoIndutryDta" :key="item.code"></el-option>
          </el-select>
          <el-select v-model="threeLevelIndustry" class="industry3" placeholder="请选择" @change="chooseLastIndutry">
              <el-option :label="item.name" :value="item.code" v-for="item in threeIndutry" :key="item.code"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="人员规模：" prop="scales" :label-width="formLabelName">
          <el-select v-model="form.scales" placeholder="请选择人员数量">
              <el-option label="0~20人" value="20"></el-option>
              <el-option label="21~50人" value="50"></el-option>
              <el-option label="51~100人" value="100"></el-option>
              <el-option label="101~200人" value="200"></el-option>
              <el-option label="200人以上" value="201"></el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" style="display:block;text-align: center;margin-top:15px">
      <el-button @click="cancel" class='el-button--small'>取 消</el-button>
      <el-button class="Determine el-button--small" type="primary" @click="sure">确 定</el-button>
    </span>
  </div>
</template>
<script>
// 三级联动的地址
/* eslint-disable */
import { saveInfo,getInfo,getFirstIndustry,getOtherIndustry } from "@/api/course";
import areaJs from "@/common/js/select_area";
export default {
  props:['addData'],
  name: "EnterpriseDetails",
  data() {
    return {
      labelPosition: 'right',
      options: areajson,
      formLabelWidth:'120px',
      formLabelName:'120px',
      formLabelInput:'120px',
      firstLevelIndustry:'',//所属行业一级
      twoLevelIndustry:'',//所属行业二级
      threeLevelIndustry:'',//所属行业三级
      firstIndutryData:[],//行业一级
      twoIndutryDta:[],//行业二级
      threeIndutry:[],//行业三级
      // 表单上传内容
      form: {
        id:"",
        company: "",
        taxLayerNo: "",
        finalAddress: [],
        taxLayerType: '001',
        businessScope:'',
        addressDetail:'',
        scales:'',
        industryCode:'', //一级
        industrySecondCode:'', //二级
        industryThirdCode:'' //三级
      },
      // 表单验证 
      rules: {
        company: [
          { required: true, trigger: "blur",validator: company }
        ],
        taxLayerNo: [
          { required: true, message: "请输入纳税人识别号", trigger: "blur" }
        ],
        finalAddress: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ],
        taxLayerType: [
          { required: true, message: "请输入纳税性质", trigger: "blur" }
        ],
        addressDetail: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        businessScope: [
          { required: true, message: "请输入经营范围", trigger: "blur" }
        ],
        scales:[
          { required: true, message: "请输入人员规模", trigger: "blur" }
        ],
        industry:[
          { required: true, message: "请输入所属行业", trigger: "blur" }
        ]
      },
      kjoptions: []
    };
  },
  created() {
    this.getFirstIndustryData();//请求行业一级数据
  },
  mounted() {
    const that = this;
    // 默认是   VAT:增值税一般纳税人
    const addnode = ["32", "3201", "320101"];
    this.form.finalAddress = addnode;
    if(this.addData.company){
      // 企业id
      this.form.id = this.addData.id
      // 企业名称
      this.form.company = this.addData.company
      // 纳税性质
      this.form.taxLayerType = this.addData.taxLayerType
      // 纳税人识别号 taxLayerType
      this.form.taxLayerNo =  this.addData.taxLayerNo
      // 所在地区
      this.form.finalAddress = this.addData.finalAddress?this.addData.finalAddress:this.addData.address
      // this.form.finalAddress = this.form.finalAddress.join(',')
      // 详细地址
      this.form.addressDetail = this.addData.addressDetail
      // 经营范围
      this.form.businessScope = this.addData.businessScope
      // 所属行业 一级行业
      this.firstLevelIndustry = this.addData.industryCode
      this.form.industryCode = this.addData.industryCode
      // 二级行业
      getOtherIndustry(this.addData.industryCode).then(res=>{
        this.twoIndutryDta=res.result;
        for (let index = 0; index < res.result.length; index++) {
          if(res.result[index].code == this.addData.industrySecondCode){
            this.twoLevelIndustry = res.result[index].name
          }
        }
      })
      this.form.industrySecondCode = this.addData.industrySecondCode
      // 三级行业
      getOtherIndustry(this.addData.industrySecondCode).then(res=>{
          this.threeIndutry=res.result;
          for (let index = 0; index < res.result.length; index++) {
            if(res.result[index].code == this.addData.industryThirdCode){
              this.threeLevelIndustry = res.result[index].name
            }
          }
      });
      this.form.industryThirdCode = this.addData.industryThirdCode
      // 人员规模
      if (this.addData.scales=='20') {
        this.form.scales = '0~20人'
      } else if(this.addData.scales=='50'){
        this.form.scales = '21~50人'
      } else if(this.addData.scales=='100'){
        this.form.scales = '51~100人'
      } else if(this.addData.scales=='200'){
        this.form.scales = '101~200人'
      } else{
        this.form.scales = '200人以上'
      }
    }
  },
  methods: {
    Enterprise(val) {
      // 企业名称
    },
    Paragraph(val) {
      const that = this;
      // 税号
      if (val.length != 15 && val.length != 18) {
        that.$message({
          type: "error",
          message: "您输入的税号不正确！"
        });
      }
    },
    Add(val) {
      // 地址
    },
    NSpeople: function(val) {
      this.form.taxLayerType = val
    },
    //请求行业一级
    getFirstIndustryData(){
        let _this=this;
        getFirstIndustry().then(res=>{
            if(res.code == '0'){
                _this.firstIndutryData=res.result
            }
        })
    },
    //选择一级行业,选择二级行业
    chooseFirstIndut(e,level){
        let _val=e;
        if(level == 1){
            this.firstLevelIndustry=_val;
            this.twoLevelIndustry='';
            this.threeLevelIndustry='';
            this.form.industryCode = this.firstLevelIndustry
            this.form.industrySecondCode = ''
            this.form.industryThirdCode = ''

        }
        if(level == 2){
            this.twoLevelIndustry=_val;
            this.threeLevelIndustry='';
            this.form.industrySecondCode = _val
            this.form.industryThirdCode = ''
        }
        this.getTwoThreeIndutry(_val,level,);
    },
    //选择三级行业
    chooseLastIndutry(val){
        this.form.industryThirdCode = val
    },
    //获取二级行业
    getTwoThreeIndutry(id,level){
        let _this=this;
        getOtherIndustry(id).then(res=>{
            if(level == 1){
                _this.twoIndutryDta=res.result;
            }
            if(level == 2){
                _this.threeIndutry=res.result;
            }
        });
    },
    sure(){
      // 点击确定
      if (this.form.company=='') {
        this.$message({
          type:'warning',
          message:'请输入企业名称！'
        })
        return false
      }
      if(this.form.taxLayerNo == ''){
        this.$message({
          type:'warning',
          message:'请输入纳税人识别号！'
        })
        return false
      }
      if (!(this.form.taxLayerNo.length==15||this.form.taxLayerNo.length==18)) {
        this.$message({
          type:'warning',
          message:'纳税人识别号必须是15位或18位！'
        })
        return false
      }
      if(this.form.addressDetail == ''){
        this.$message({
          type:'warning',
          message:'请输入详细地址！'
        })
        return false
      }
      if(this.form.businessScope == ''){
        this.$message({
          type:'warning',
          message:'请输入经营范围！'
        })
        return false
      }
      if(this.firstLevelIndustry == ''){
        this.$message({
          type:'warning',
          message:'请填写一级行业！'
        })
        return false
      }
      if(this.twoLevelIndustry == ''){
        this.$message({
          type:'warning',
          message:'请填写二级行业！'
        })
        return false
      }
      if(this.threeIndutry == ''){
        this.$message({
          type:'warning',
          message:'请填写三级行业！'
        })
        return false
      }
      if(this.form.scales == ''){
        this.$message({
          type:'warning',
          message:'请输入人员规模！'
        })
        return false
      }
      // 人员规模
      if (this.form.scales == '0~20人') {
        this.form.scales = '20'
      } else if(this.form.scales == '21~50人'){
        this.form.scales = '50'
      } else if(this.addData.scales=='51~100人'){
        this.form.scales = '100'
      } else if(this.form.scales == '101~200人'){
        this.form.scales = '200'
      } else if(this.form.scales == '200人以上'){
        this.form.scales = '201'
      }
      this.$emit('addpt',this.form)
    },
    cancel(){
      this.$emit('addpt','cancel')
    }
  }
};
</script>

<style lang="scss" scoped>
.industry_box{
  display: flex;
  .industry1{
    width: 31%;
    margin-left: -120px;
  }
  .industry2{
    width: 31%;
    margin-left: 20px;
  }
  .industry3{
    width: 31%;
    margin-left: 20px;
  }
}
</style>
