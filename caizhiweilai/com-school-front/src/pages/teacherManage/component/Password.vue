<template>
  <div class='resetPassWord'>
    <div class="content">
      {{objData.text}}
    </div>
    <div class="foot">
      <el-button @click="close">取消</el-button>
      <el-button type="info" @click="sure" class="Determine">确定</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { resetPassword, passwordAnyReset, anyDisableAccunt, disableAccunt } from '@/api/tdb'
export default {
  name: "Password",
  props: ["teacherId", "newPwd" , "objData"],
  methods: {
    // 弹出消息通知
    popupMessage(res){
      if(res.code !== '0'){
        this.$message.warning(res.message)
      }else{
        this.$message.success(this.objData.title + "成功")
      }
      this.$emit('quxiao', true)
    },
    async sure() {
      //  type 1 重置密码
      //  type 2 批量重置密码
      //  type 3 批量禁用
      //  type 4 批量启用
      //  type 5 禁用
      //  type 6 启用
      let res
			if (this.objData.type === 1) {
        res = await resetPassword({
          userId:this.teacherId,
          newPwd:this.newPwd
        })
      } else if (this.objData.type === 2) {
        res = await passwordAnyReset({
          userIds:this.teacherId,
        })
      } else if (this.objData.type === 3 || this.objData.type === 4) {
        res = await anyDisableAccunt({
          userIds:this.teacherId,
          flag:this.objData.type === 3 ? 2 : 0
        })
      } else if (this.objData.type === 5 || this.objData.type === 6) {
        res = await disableAccunt({
          userId:this.teacherId,
        })
      }
      this.popupMessage(res)
    },
    close() {
      this.$emit("quxiao",false);
    }
  }
};
</script>
<style lang="scss" scoped>
.resetPassWord {
  .content{
	  margin-bottom: 30px;
    display: flex;
    align-items: center;
    .el-icon-warning-outline{
      font-size:20px;
      color:red;
    }
  }
  .foot {
	display: flex;
	justify-content: center;
  align-items: center;
    .Determine {
	  background: #36cea9;
	  border-color: #36cea9;
	}
  }
}
</style>