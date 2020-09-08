<template>
  <div class="addTeacherContent">
    <div class="content">
        <el-form :model="form" ref="form" label-position="right" class="schoolForm" :rules="rules">
            <el-form-item label="旧密码 " prop="oldPassword" label-width="100px">
              <el-input
                type="password"
                v-model="form.oldPassword"
                placeholder="请输入原始密码"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码 " prop="newPwd" label-width="100px">
              <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码 " prop="confirmNewPwd" label-width="100px">
              <el-input
                type="password"
                v-model="form.confirmNewPwd"
                placeholder="请再次输入新密码"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
    </div>
    <div class="foot">
      <el-button @click="close">取消</el-button>
      <el-button type="info" @click="sure" class="Determine">确定</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import {updatePassword} from '@/api/tdb'
export default {
  name: "updatePassword",
  data() {
    let NewPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.newPwd !== "") {
          this.$refs.form.validateField("confirmNewPwd");
        }
        callback();
      }
    };
    let ConfirmNewPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.form.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        oldPassword: "",
        newPwd: "",
        confirmNewPwd: ""
      },
           rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            validator: NewPassword,
            required: true,
            trigger: "blur"
          },
          {
            pattern: /^.{6,15}$/,
            message: "密码需要在6-15位"
          }
        ],
        confirmNewPwd: [
          {
            validator: ConfirmNewPassword,
            required: true,
            trigger: "blur"
          },
          {
            pattern: /^.{6,15}$/,
            message: "密码需要在6-15位"
          }
        ]
      }
    };
  },
  methods: {
	//点击取消关闭弹窗
    async close() {
		//触发父组件的取消方法
      this.$emit("quxiao",false);
	},
	//点击确认保存新增教师，并关闭弹窗
    sure() {
      let that = this;
       this.$refs.form.validate(async valid => {
          if(valid){
            const res = await updatePassword({
              oldPassword:that.form.oldPassword,
              newPassword:that.form.newPwd
            })
            if (res.code === "0") {
              this.$message.success('密码修改成功');
              //跳转到登录页面并清除本地存储和cookie
              // let timer = setTimeout(() => {
              //     window.location.href = localStorage.getItem('url');
              //     localStorage.clear();
              //     clearTimeout(timer);
              // },1000)
            } else {
              this.$message.warning(res.message);
            }
            this.$emit("quxiao",false);
          }
       })
      
      
    }
  }
};
</script>
<style lang="scss">
.addTeacherContent {
  .content{
	  margin-bottom: 30px;
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