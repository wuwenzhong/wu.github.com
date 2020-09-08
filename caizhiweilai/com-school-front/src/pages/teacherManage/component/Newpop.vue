<template>
  <div class="addTeacherContent">
    <div class="content">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="手机号：" prop="account">
          <el-input
            v-model="form.account"
            maxlength="11"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <label slot="label"
            >姓<i style="display: inline-block;width:14px;"></i>名：</label
          >
          <el-input
            v-model="form.name"
            placeholder="请输入姓名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label slot="label"
            >密<i style="display: inline-block;width:14px;"></i>码：</label
          >
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
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
import { newaddTeacher } from '@/api/tdb'
export default {
  name: "Newpop",
  props: ["NewAdd"],
  data() {
    let jyaccount = (relus, value, cb) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        cb(new Error("请正确输入手机号"));
        return;
      }
      if (this.form.password === '') {
        this.form.password = value.slice(5)
      }
      cb();
    };
    return {
      form: {
        account: "",
        name: "",
        password: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { required: true, validator: jyaccount, trigger: "blur" }
        ],
        name: [{ required: true, trigger: "blur", message: "请输入姓名" }],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" },
          { pattern: /^.{6,15}$/, message: "密码需要在6-15位" }
        ]
      }
    };
  },
  methods: {
    //点击取消关闭弹窗
    async close() {
      //触发父组件的取消方法
      this.$emit("quxiao", false);
    },
    //点击确认保存新增教师，并关闭弹窗
    sure() {
      let that = this;
       this.$refs.form.validate(async valid => {
          if(valid){
              const res = await newaddTeacher({
                password: that.form.password,
                phone: that.form.account,
                name: that.form.name,
                customerId: localStorage.getItem("customerId")
              });
              (res)
              if (res.code !== "0") {
                that.$message.warning(res.message);
              } else {
                that.$message.success(res.message);
                that.$emit("quxiao",true);
              }
          }
       })
    }
  }
};
</script>
<style lang="scss">
.addTeacherContent {
  .content {
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
