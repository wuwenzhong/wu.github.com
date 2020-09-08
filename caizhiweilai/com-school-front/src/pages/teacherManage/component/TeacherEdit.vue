<template>
  <div class="editTeacherContent">
    <div class="content">
      <el-form :model="teacherData" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="手机号：" prop="phone">
            <el-input :disabled="true" maxlength="11" placeholder="请输入手机号" v-model="teacherData.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="teacherName">
              <label slot="label">姓<i style="display: inline-block;width:14px;"></i>名：</label>
            <el-input placeholder="请输入姓名" v-model="teacherData.teacherName" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="password" size="small">
              <label slot="label">密<i style="display: inline-block;width:14px;"></i>码：</label>
            <el-input  v-model="teacherData.password" placeholder="请输入密码" autocomplete="off"></el-input>
          </el-form-item> -->
        </el-form>
    </div>
    <!-- {{teacherData}} -->
    <div class="foot">
      <el-button @click="close">取消</el-button>
      <el-button type="info" @click="sure" class="Determine">确定</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { updateTeacherInfo } from '@/api/tdb'
export default {
  name: "TeacherEdit",
  props: ["teacherData"],
  data() {
    let jyaccount = (relus, value, cb) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
            cb(new Error('请正确输入手机号'));
            return;
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
            { required: true, validator: jyaccount, trigger: "blur" },
        ],
        teacherName: [{ required: true, trigger: "blur", message: "请输入姓名" }],
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
      this.$emit("quxiao",false);
	},
	//点击确认保存修改教师，并关闭弹窗
    async sure() {
      let that = this;
      // 修改教师
      that.$refs.form.validate(async valid => {
          if(valid){
              // 修改教师信息
              const res = await updateTeacherInfo({
                id: that.teacherData.teacherId,
                name: that.teacherData.teacherName
                // password:that.teacherData.password,
                // phone:that.teacherData.account,
                // name:that.teacherData.teacherName,
                // id:that.teacherData.teacherId
              })
              if(res.code !== '0') {
                that.$message.warning(res.message);
              }else {
                that.$message.success(res.message)
                that.$nextTick(() => {
                	that.$refs["form"].resetFields()
                })
                this.$emit("quxiao",true);
              }
          }
      })
    }
  }
};
</script>
<style lang="scss">
.editTeacherContent {
  .content{
	  margin-bottom: 30px;
  }
  .foot {
    margin-top:84px;
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