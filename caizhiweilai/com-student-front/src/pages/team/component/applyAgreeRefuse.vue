<template>
  <div class='apply-agree-refuse'>
    <div class='content'>
      申请同意拒绝弹框
    </div>
    <div class="foot">
      <el-button @click="close" >取消</el-button>
      <el-button type="info" @click="sure" class="Determine">确定</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import {  } from '@/api/myTeam'
export default {
  name: "applyAgreeRefuse",
  props: ['type'],
  methods: {
     sure() {
      this.$refs.form.validate(async isTure => {
        if(isTure){

        }
      })
    },
    close() {
      this.$emit("closeDia", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.apply-agree-refuse {
  .content{
	  margin-bottom: 30px;
  }
  .foot {
	display: flex;
	justify-content: center;
	align-items: center;
    .Determine {
	  background:#36cea9;
	  border-color:#36cea9;
	}
  }
}
</style>