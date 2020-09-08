<template>
  <!-- 修改团队名称弹框 -->
  <div class='updateTeamName'>
    <div class="content">
      <p class="dialog-title"> <i class="iconfont" @click="close">&#xe6a5;</i></p>
      <div class="update-title">修改团队名称</div>
      <el-form class='form' :rules="rules" ref="form" :model="form">
        <el-form-item  prop="teamName" class='teamName'>
          <el-input placeholder="请输入团队名称" v-model="form.teamName" autocomplete="off" class="update-input"></el-input>
        </el-form-item>
      </el-form>
      <div class="foot">
        <div @click="close" class="cancel">取消</div>
        <div @click="sure" class="Determine">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { modifyTeamName } from '@/api/myTeam'
export default {
  name: "Password",
  props: ['teamId'],
  data(){
    return {
      form:{
        teamName:''
      },
      rules: {
        teamName: [{ required: true, message: "请输入团队名称", trigger: "blur" }]
      }
    }
  },
  methods: {
     sure() {
      this.$refs.form.validate(async isTure => {
        if(isTure){
          const res = await modifyTeamName({
            teamName:this.form.teamName,
            id: this.teamId
          })
          if (res.code === '0') {
            this.$message.success(res.result)
            this.$emit('closeDia', true, this.form.teamName)
          } else {
            this.$message.warning(res.message)
            this.$emit('closeDia', false)
          }
          
        }
      })
    },
    close() {
      this.$emit("closeDia", false);
    }
  },
  mounted(){
    document.documentElement.style.overflowY = 'hidden'
  },
  destroyed() {
    document.documentElement.style.overflowY = 'auto'
  }
};
</script>
<style lang="scss" scoped>
.updateTeamName {
  @include maskLayer;
  .content{
    width: 520px;
    height: 336px;
    background: url('../images/updateTeamName.png') no-repeat;
    background-size: 100%;
    border-radius: 21px;
    overflow: hidden;
    position: relative;
    padding-top: 40px;
    padding-left: 40px;
    .dialog-title {
      i {
        font-size:15px;
        z-index: 9999;
        color: #BEC2C6;
        position: absolute;
        top: 26px;
        right: 33px;
        cursor: pointer;
        font-style: normal;
      }
    }
    .update-title{
      width:144px;
      height:33px;
      font-size:24px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:33px;
      margin-bottom: 16px;
    }
    .form{
      margin-bottom:35px;
      .teamName{
        .update-input{
          width:288px;
          height:40px;
          border-radius:8px;
        }
      }
    }
  }
  .foot {
    display: flex;
    .cancel{
      width:130px;
      height:40px;
      line-height: 40px;
      text-align: center;
      color:rgba(92,213,106,1);
      border-radius:20px;
      border:1px solid rgba(92,213,106,1);
      margin-right: 28px;
      cursor: pointer;
      &:hover{
        background: rgba(92,213,106,0.1);
      }
    }
    .Determine {
      cursor: pointer;
      width:130px;
      height:40px;
      line-height: 40px;
      text-align: center;
      color:#fff;
      border-radius:20px;
      background: url('../images/sureUpdate.png') no-repeat 100%;
	  }
  }
}
</style>