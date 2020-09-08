<template>
  <div>
    <el-form :model="form" label-width="140px" :rules="rules">
      <el-form-item label="企业名称：" prop="name" :label-width="formLabelWidth">
        <el-input size="small" placeholder="请输入企业名称" v-model="form.name" @change="Enterprise" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号：" prop="taxLayerNo">
          <el-input v-model.trim="form.taxLayerNo" :label-width="formLabelInput" placeholder="请输入纳税人识别号"  onKeyUp="value=value.replace(/[\W]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="启用期间：" prop="openingPeriod">
          <el-date-picker
          v-model="form.openingPeriod"
          type="month"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="纳税性质：" prop="taxLayerType">
        <el-radio-group v-model="form.taxLayerType" @change="NSpeople">
          <el-radio :label="'001'">增值税一般纳税人</el-radio>
          <el-radio :label="'101'">小规模纳税人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="会计制度：" prop="accountingSystem">
          <el-select v-model="form.accountingSystem" placeholder="请选择会计制度" :label-width="formLabelInput">
            <el-option label="企业会计准则2017版" :value="2017" v-show="form.taxLayerType == '001'"></el-option>
            <el-option label="小企业会计准则2013版" :value="2013"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="所在地区：" prop="address">
        <el-cascader v-model="form.address" :options="options" clearable @change="Add" class="wd400"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址：" prop="addressDetail">
        <el-input type="textarea" v-model="form.addressDetail" placeholder="请输入详细地址" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="经营范围：" prop="businessScope" :label-width="formLabelName">
          <el-input type="textarea" v-model="form.businessScope" placeholder="请输入经营范围"
                    :label-width="formLabelInput" maxlength="200" show-word-limit></el-input>
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
      <el-button size='small' @click="cancel">取 消</el-button>
      <el-button class="Determine el-button--small" style="border:none" type="primary" @click="sure">确 定</el-button>
    </span>
  </div>
</template>
<script>
// 三级联动的地址
/* eslint-disable */
import { getInfo,getFirstIndustry,getOtherIndustry } from "@/api/course";
import { saveInfo,updateInfo } from '@/api/business'
import areaJs from "@/common/js/select_area";
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userId'])
  },
  props:['addData'],
  name: "EnterpriseDetails",
  data() {
    let name = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入企业名称"));
      }else{
        callback();
      }
    };
    return {
      labelPosition: 'right',
      options: areajson,
      formLabelWidth:'140px',
      formLabelName:'140px',
      formLabelInput:'140px',
      firstLevelIndustry:'',//所属行业一级
      twoLevelIndustry:'',//所属行业二级
      threeLevelIndustry:'',//所属行业三级
      firstIndutryData:[],//行业一级
      twoIndutryDta:[],//行业二级
      threeIndutry:[],//行业三级
      // 表单上传内容
      form: {
        creator: this.userId,//创建人
        name: "",
        taxLayerNo: "",//企业纳税性质(
        address: [],//所属地区
        taxLayerType: '001',//纳税人识别号
        businessScope:'',//经营范围
        addressDetail:'',//详细地址	
        accountingSystem:"",//会计制度
        scales:'',//人员规模
        industryCode:'', //一级
        industrySecondCode:'', //二级
        industryThirdCode:'', //三级
        openingPeriod:''//启用期间
      },
      // 表单验证
      rules: {
        name: [
          { required: true, trigger: "blur",validator: name }
        ],
        taxLayerNo: [
          { required: true, message: "请输入纳税人识别号", trigger: "blur" }
        ],
        address: [
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
        accountingSystem:[
          { required: true, message: "请输入会计制度", trigger: "blur" }
        ],
        scales:[
          { required: true, message: "请输入人员规模", trigger: "blur" }
        ],
        industry:[
          { required: true, message: "请输入所属行业", trigger: "blur" }
        ],
        openingPeriod:[
          { required: true, message: "请输入启用期间", trigger: "blur" }
        ]
      },
      kjoptions: []
    };
  },
  watch:{
    'form.taxLayerType'(val){
      if(val === '101'){
        this.form.accountingSystem = 2013
      } else if (val === '001'){
        this.form.accountingSystem = 2017
      }
    }
  },
  created() {
    this.getFirstIndustryData();//请求行业一级数据
  },
  mounted() {
    const that = this;
    // 默认是   VAT:增值税一般纳税人
    const addnode = ["32", "3201", "320101"];
    this.form.address = addnode;
    console.log(this.addData)
    if(this.addData.name){
      // 企业id
      this.form.id = this.addData.id
      // 企业名称
      this.form.name = this.addData.name
      // 纳税性质
      this.form.taxLayerType = this.addData.taxLayerType
      // 纳税人识别号 taxLayerType
      this.form.taxLayerNo =  this.addData.taxLayerNo
      // 启用期间
      this.form.openingPeriod = this.addData.openingPeriod
      // 所在地区
      this.form.address = this.addData.address.split(',')
      // 详细地址
      this.form.addressDetail = this.addData.addressDetail
      // 经营范围
      this.form.businessScope = this.addData.businessScope
      // 会计制度
      this.form.accountingSystem = this.addData.accountingSystem=='2017'?'企业会计准则2017版':'小企业会计准则2013版'
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
      if (this.form.name=='') {
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
      if(!this.form.openingPeriod){
        this.$message({
          type:'warning',
          message:'请选择启用时间！'
        })
        return false
      }
      let yearqd = new Date(this.form.openingPeriod).getFullYear()
      let mouthqd = new Date(this.form.openingPeriod).getMonth()+1
      let timeQd = yearqd + '-' + (parseInt(mouthqd)<10?('0'+mouthqd):mouthqd)
      console.log(timeQd)
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
      if(this.form.accountingSystem == ''){
        this.$message({
          type:'warning',
          message:'请输入会计制度！'
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
      } else if(this.form.scales=='51~100人'){
        this.form.scales = '100'
      } else if(this.form.scales == '101~200人'){
        this.form.scales = '200'
      } else if(this.form.scales == '200人以上'){
        this.form.scales = '201'
      }
      this.form.creator = this.userId
      if (this.form.accountingSystem=='企业会计准则2017版') {
        this.form.accountingSystem='2017'
      } else if (this.form.accountingSystem=='小企业会计准则2013版'){
        this.form.accountingSystem='2013'
      }
      if (this.addData.name) {
        // 编辑
        updateInfo({
          id:this.addData.id,
          modifier: this.userId,//创建人
          name: this.form.name,
          taxLayerNo: this.form.taxLayerNo,//企业纳税性质
          address: this.form.address.join(','),//所属地区
          taxLayerType: this.form.taxLayerType,//纳税人识别号
          openingPeriod: timeQd,//启用期间
          businessScope:this.form.businessScope,//经营范围
          addressDetail:this.form.addressDetail,//详细地址	
          accountingSystem:this.form.accountingSystem,//会计制度
          scales:this.form.scales,//人员规模
          industryCode:this.form.industryCode, //一级
          industrySecondCode:this.form.industrySecondCode, //二级
          industryThirdCode:this.form.industryThirdCode //三级
        }).then(res=>{
          if (res.code=='0') {
            this.$message({
              type:'success',
              message:res.message
            })
            this.$emit('addpt')
          } else {
            this.$message({
              type:'error',
              message:res.message
            })
          }
        })
      } else {
        // 新增
        saveInfo({
          creator: this.userId,//创建人
          name: this.form.name,
          taxLayerNo: this.form.taxLayerNo,//企业纳税性质(
          address: this.form.address.join(','),//所属地区
          taxLayerType: this.form.taxLayerType,//纳税人识别号
          openingPeriod: timeQd,//启用期间
          businessScope:this.form.businessScope,//经营范围
          addressDetail:this.form.addressDetail,//详细地址	
          accountingSystem:this.form.accountingSystem,//会计制度
          scales:this.form.scales,//人员规模
          industryCode:this.form.industryCode, //一级
          industrySecondCode:this.form.industrySecondCode, //二级
          industryThirdCode:this.form.industryThirdCode //三级
        }).then(res=>{
          if (res.code=='0') {
            this.$message({
              type:'success',
              message:res.message
            })
            this.$emit('addpt')
          } else {
            this.$message({
              type:'error',
              message:res.message
            })
          }
        })
      }
    },
    cancel(){
      this.$emit('addpt')
    }
  }
};
</script>

<style lang="scss" scoped>
.industry_box{
  display: flex;
  .industry1{
    width: 31%;
    margin-left: -140px;
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
