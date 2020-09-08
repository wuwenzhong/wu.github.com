<template>
  <div class="add-step">
    <div class="content">
      <el-form
        class="el-form--label-left"
        :model="stapForm"
        ref="stapForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="步骤序号：" prop="default" :class="hiddentitle?'hiddentitle':''">
          <el-input disabled :placeholder="stapForm.default" size="small"></el-input>
        </el-form-item>
        <el-form-item label="活动性质：" prop="stepType" :class="hiddentitle?'hiddentitle':''" class="stepTitle">
          <div class="step-list">
            <el-radio-group v-model="componentTab" @change="changeTheme" :disabled="stepFlag=='2'">
              <el-radio
                :label="item.name"
                v-for="(item,index) in checkbox"
                :key="index"
                v-model="stapForm.stepType"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <div class="router-box">
        <component :is="componentTab" :clientDetails="clientDetails"></component>
      </div>
    </div>
    <div :class="hiddentitle?'footerhidden':'footer'">
      <div class="confirm">
        <el-button size="small" @click="close" style="background:#414d65;color:#fff">取消</el-button>
        <el-button type="" size="small" @click="Determine(0)" style="background:#414d65;color:#fff">确认</el-button>
      </div>
      <div class="next" :class="hiddentitle?'hiddentitle':''">
        <el-button type="info" size="small" @click="Determine(1)" style="background:#414d65;color:#fff">{{nextstep}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { CaseSteps, Allstep, getStep,modifyalStep,saveStep,updateStep } from "@/api/step.js";
// 步骤组件
import Start from "./component/Start";
import EnterpriseDetails from "./component/EnterpriseDetailsQy";
import AccountPeriod from "./component/AccountPeriod";
import AssociatedNode from "./component/AssociatedNode";
import End from "./component/End";
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ["AddStep", "stepnumberid"],
  components: {
    Start,
    EnterpriseDetails,
    AccountPeriod,
    AssociatedNode,
    End
  },
  computed: {
    ...mapGetters([
      'stepIdFlag',
      'stepType',
      'companyId',
      'nodeId',
      'posId',
      'preStepIds',
      'relRes',
      'tallyMonth',
      'tallyMonthType',
      'description',
      'tallyYear',
      'stepFlag'
    ])
  },
  data() {
    return {
      nextstep: "保存并添加下一步",
      componentTab: "Start",
      stapForm: {
        default: "第一步",
        stepType: "1"
      },
      // 表单验证
      rules: {
        default: [
          { required: true, message: "请输入课程编码", trigger: "blur" }
        ]
      },
      checkbox: [
        {
          label: "开始",
          name: "Start",
          step: "第一步"
        },
        {
          label: "企业信息",
          name: "EnterpriseDetails",
          step: "第二步"
        },
        {
          label: "账期",
          name: "AccountPeriod",
          step: "第三步"
        },
        {
          label: "关联节点",
          name: "AssociatedNode",
          step: "第四步"
        },
        {
          label: "结束",
          name: "End",
          step: "第五步"
        }
      ],
      StepArr: {
        stepType: "1",
        caseId: "",
        creator: "",
        orgName: "",
        addr: "",
        taxNo: "",
        taxQua: "VAT",
        nodeId: "",
        posId: "",
        preStepIds: "",
        description: "",
        relRes: "",
        tallyMonth: "",
        tallyMonthType: "",
        id:"",
        orginfoId:'',
      },
      hiddentitle: false,
      buzhouid:'',
      clientDetails:{},
      saveUpdata:'',
      is_click: false
    };
  },
  beforeCreate() {
  },
  mounted() {
    this.nextstep = "保存并添加下一步";
  },
  methods: {
    getSrcList(stepnumberid, number) {
      // 清空第四步 步骤id
      localStorage.setItem('bzIdFrour','')
      //这个就是子组件的函数 参数是父组件调用时传过来的
      let that = this;
      if(parseInt(number)>5){
        that.hiddentitle = false;
        return false;
      }
      if(stepnumberid==undefined || stepnumberid==''){
        return false
      }
      that.hiddentitle = true;
      that.buzhouid = stepnumberid;
      if (stepnumberid==''||stepnumberid==undefined) {
        return false
      }
      // 当前步数
      this.$store.commit('STEP_stepType', number)
      // 步骤的详细信息
      let stepAllStep = {}
      getStep({
        id:stepnumberid
      }).then(res=>{
        if (res.code=='0') {
          stepAllStep = res.result
          if(number==1){
            // 第一步
            that.stapForm.default = "第一步";
          }else if(number==2){
            // 第二步
            that.stapForm.default = "第二步";
            that.componentTab='EnterpriseDetails';
            // 企业信息  更新公司名称id
            this.$store.commit('STEP_companyId',stepAllStep.companyId)
          }else if(number==3){
            // 第三步
            that.stapForm.default = "第三步";
            that.componentTab='AccountPeriod';
            // 年份 月份 步骤id
            localStorage.setItem('bzIdFrour',stepnumberid)
            // 更新年份
            this.$store.commit('STEP_tallyYear',stepAllStep.tallyMonth.split('-')[0])
            //更新月份
            this.$store.commit('STEP_tallyMonth',stepAllStep.tallyMonth.split('-')[1])
          }else if(number==4){
            that.stapForm.default = "第四步";
            // 第四步
            that.componentTab='AssociatedNode';
            // 更新选择节点
            this.$store.commit('STEP_nodeId',stepAllStep.nodeId)
            // 更新选择节点名称
            this.$store.commit('STEP_nodeIdName',stepAllStep.nodeName)
            // 更新关联岗位
            this.$store.commit('STEP_posId',stepAllStep.posId)
            // 更新关联岗位名称
            this.$store.commit('STEP_posIdName',stepAllStep.posName)
            // 更新资源文件
            this.$store.commit('STEP_relRes',stepAllStep.relRes)
            // 更新资源文件名称
            if (stepAllStep.resNames) {
              this.$store.commit('STEP_relResName',stepAllStep.resNames)
            } else {
              this.$store.commit('STEP_relResName','')
            }
            // 更新设置前置任务
            if (stepAllStep.preStepIds) {
              this.$store.commit('STEP_preStepIds',stepAllStep.preStepIds)
            } else {
              this.$store.commit('STEP_preStepIds','')
            }
            // 更新设置前置任务名称
            this.$store.commit('STEP_preStepIdsName',stepAllStep.preNodeName)
            // 描述
            this.$store.commit('STEP_description',stepAllStep.description)
          }
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
    close() {
      let that = this;
      that.$emit("close");
    },
    changeTheme(val) {
      console.log(val)
      let that = this;
      if (val == "Start") {
        that.stapForm.default = "第一步";
        // 当前步数
        this.$store.commit('STEP_stepType', '1')
        that.nextstep = "保存并添加下一步";
      } else if (val == "EnterpriseDetails") {
        that.stapForm.default = "第二步";
        // 当前步数
        this.$store.commit('STEP_stepType', '2')
        that.nextstep = "保存并添加下一步";
      } else if (val == "AccountPeriod") {
        that.stapForm.default = "第三步";
        // 当前步数
        this.$store.commit('STEP_stepType', '3')
        that.nextstep = "保存并添加下一步";
      } else if (val == "AssociatedNode") {
        that.stapForm.default = "第四步";
        // ========================清空第四步信息============================
        // 更新选择节点
        this.$store.commit('STEP_nodeId','')
        // 更新选择节点名称
        this.$store.commit('STEP_nodeIdName','')
        // 更新关联岗位
        this.$store.commit('STEP_posId','')
        // 更新关联岗位名称
        this.$store.commit('STEP_posIdName','')
        // 更新资源文件
        this.$store.commit('STEP_relRes','')
        // 更新资源文件名称
        this.$store.commit('STEP_relResName','')
        // 更新设置前置任务
        this.$store.commit('STEP_preStepIds','')
        // 更新设置前置任务名称
        this.$store.commit('STEP_preStepIdsName','')
        // 当前步数
        this.$store.commit('STEP_stepType', '4')
        that.nextstep = "保存并添加下一步";
      } else if (val == "End") {
        that.stapForm.default = "第五步";
        // 当前步数
        this.$store.commit('STEP_stepType', '5')
        that.nextstep = "保存";
      }
    },
    Determine(fix) { 
      let that = this;
      if(this.is_click){
        return false;
      }
      this.is_click=true;
      setTimeout(()=>{
        this.is_click=false;
      },2000)
      let bzId = this.stepIdFlag
      if (this.stepType == '2' && this.companyId == '') {
        this.$message({
          type:'error',
          message:'企业信息不能为空！'
        })
        return false
      }
      // 同步是否有步骤id来确定是修改还是新增 stepFlag==1 新增   stepFlag==2 修改
      let reldata = (this.relRes.substr(0,1)==',')?this.relRes.substr(1):this.relRes
      if (this.stepFlag == 1) {
        // 添加步骤
        saveStep({
          caseId:localStorage.getItem('caseId'),//账套ID
          stepType:this.stepType,//第几步
          companyId:this.companyId,//企业ID
          nodeId:this.nodeId,//节点ID
          posId:this.posId,//岗位ID
          // description:this.description,//描述
          preStepIds:this.preStepIds,//前置任务步骤ID
          relRes:reldata,//资源IDs
          tallyYear:this.tallyYear,//账期	年份
          tallyMonth:this.tallyMonth,//账期	月份
          tallyMonthType:this.tallyMonthType//账期类型	
        }).then(res=>{
          if (res.code=='0') {
            this.$message({
              type:'success',
              message:res.message
            })
            // 更改右下角文案
            this.nextstep = (parseInt(this.stepType)==4)?'保存':'保存并添加下一步'
            // 如果点击确定 保存数据并关闭弹窗
            if (fix=='0') {
              that.$emit("close",'lastone');
              return false
            }
            if (that.stapForm.default == "第一步") {
              that.componentTab = "EnterpriseDetails";
              that.stapForm.default = "第二步";
              // 当前步数
              this.$store.commit('STEP_stepType', '2')
              // 请求成功之后 每次点击保存并下一步 或者保存的时候 刷新步骤 
              that.$emit("close", "更新步骤");
            } else if (that.stapForm.default == "第二步") {
              that.componentTab = "AccountPeriod";
              that.stapForm.default = "第三步";
              // 当前步数
              this.$store.commit('STEP_stepType', '3')
              // 请求成功之后 每次点击保存并下一步 或者保存的时候 刷新步骤 
              that.$emit("close", "更新步骤");
            } else if (that.stapForm.default == "第三步") {
              that.componentTab = "AssociatedNode";
              that.stapForm.default = "第四步";
              // ========================清空第四步信息============================
              // 更新选择节点
              this.$store.commit('STEP_nodeId','')
              // 更新选择节点名称
              this.$store.commit('STEP_nodeIdName','')
              // 更新关联岗位
              this.$store.commit('STEP_posId','')
              // 更新关联岗位名称
              this.$store.commit('STEP_posIdName','')
              // 更新资源文件
              this.$store.commit('STEP_relRes','')
              // 更新资源文件名称
              this.$store.commit('STEP_relResName','')
              // 更新设置前置任务
              this.$store.commit('STEP_preStepIds','')
              // 更新设置前置任务名称
              this.$store.commit('STEP_preStepIdsName','')
              // 当前步数
              this.$store.commit('STEP_stepType', '4')
              // 请求成功之后 每次点击保存并下一步 或者保存的时候 刷新步骤 
              that.$emit("close", "更新步骤");
            } else if (that.stapForm.default == "第四步") {
              that.componentTab = "End";
              that.stapForm.default = "第五步";
              // 当前步数
              this.$store.commit('STEP_stepType', '5')
              // 请求成功之后 每次点击保存并下一步 或者保存的时候 刷新步骤 
              that.$emit("close", "更新步骤");
            }else if(that.stapForm.default == "第五步"){
              // 请求成功之后 每次点击保存并下一步 或者保存的时候 刷新步骤 
              that.$emit("close", "lastone");
            }
          } else {
            this.$message({
              type:'error',
              message:res.message
            })
          }
        })
      } else {
        // 修改步骤之后清空步骤id的值
        // 更新步骤id
        // this.$store.commit('STEP_stepIdFlag','')
        // 修改步骤
        updateStep({
          id:bzId,//步骤id
          caseId:localStorage.getItem('caseId'),//账套ID
          stepType:this.stepType,//第几步
          companyId:this.companyId,//企业ID
          nodeId:this.nodeId,//节点ID
          posId:this.posId,//岗位ID
          // description:this.description,//描述
          preStepIds:this.preStepIds,//前置任务步骤ID
          relRes:this.relRes.substr(0,1)==','?this.relRes.substr(1):this.relRes,//资源IDs
          tallyYear:this.tallyYear,//账期	年份
          tallyMonth:this.tallyMonth,//账期	月份
          tallyMonthType:this.tallyMonthType//账期类型	
        }).then(res=>{
          if (res.code=='0') {
            this.$message({
              type:'success',
              message:res.message
            })
            // 请求成功关闭弹窗
            that.$emit("close", "lastone");
          } else {
            this.$message({
              type:'error',
              message:res.message
            })
          }
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hiddentitle {
  display: none;
}
.content {
  .router-box {
    padding: 5px 0;
    border-top: 1px solid #f1f3f4;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 20px;
  .el-button {
    margin-left: 0;
  }
  .confirm {
    button {
      padding-left: 30px;
      padding-right: 30px;
      &:first-child {
        margin-right: 16px;
      }
    }
  }
}
.footerhidden{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 20px;
  .el-button {
    margin-left: 0;
  }
  .confirm {
    button {
      padding-left: 30px;
      padding-right: 30px;
      &:first-child {
        margin-right: 16px;
      }
    }
  }
}
.step-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  >>> .el-radio {
    width: 116px;
    margin-right: 0;
    &:first-child,
    &:nth-child(2),
    &:nth-child(3) {
      margin-bottom: 26px;
    }
  }
  >>> .el-radio__inner {
    border-radius: 2px;
    &::after {
      background: none;
    }
  }
  >>> .el-radio__input.is-checked {
    .el-radio__inner::after {
      content: "\2714";
      color: #fff;
      position: static;
    }
  }
}
.stepTitle{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .step-list{
    margin-left: -120px;
  }
}
</style>
