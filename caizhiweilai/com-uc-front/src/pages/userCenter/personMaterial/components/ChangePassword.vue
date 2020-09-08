<template>
  <div class="changePassword">
    <div class="common">
      <div class="icon"></div>
      <div class="text">修改密码</div>
    </div>
    <el-form
      :model="form"
      ref="form"
      label-position="right"
      class="elForm"
      :rules="rules"
    >
      <el-form-item label="原始密码：" prop="oldPwd" label-width="150px">
        <el-input
          type="password"
          v-model="form.oldPwd"
          placeholder="请输入原始密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd" label-width="150px">
        <el-input
          type="password"
          v-model="form.newPwd"
          placeholder="请输入新密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirm" label-width="150px">
        <el-input
          type="password"
          v-model="form.confirm"
          placeholder="请再次输入新密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="xiugai">
      <button @click="submit" class="btn">保存</button>
    </div>
  </div>
</template>
<script>
import { changePassword } from './../../../../api/user'
import { mapGetters, mapActions } from 'vuex'
import md5 from 'js-md5'
export default {
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  name: '',
  created() {
  },
  data() {
    const NewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value !== this.form.confirm && this.form.confirm != '') {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const ConfirmNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPwd: '',
        newPwd: '',
        confirm: ''
      },
      rules: {
        oldPwd: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }
        ],
        newPwd: [
          {
            validator: NewPassword,
            required: true,
            trigger: 'blur'
          },
          {
            pattern: /^.{8,20}$/,
            message: '密码长度不小于8位且至少3种类型（大写字母、小写字母、数字、特殊字符）！'
          }
        ],
        confirm: [
          {
            validator: ConfirmNewPassword,
            required: true,
            trigger: 'blur'
          },
          {
            pattern: /^.{8,20}$/,
            message: '密码长度不小于8位且至少3种类型（大写字母、小写字母、数字、特殊字符）！'
          }
        ]
      }
    }
  },
  methods: {
    submit: function() {
      const that = this
      that.$refs.form.validate(async (valid) => {
        if (valid) {
          if (that.form.oldPwd !== that.form.newPwd) {
            const mima = {
              oldPwd: that.form.oldPwd,
              newPwd: that.form.newPwd
            }
            const mimadata = new FormData()
            Object.keys(mima).forEach((key) => {
              mimadata.append(key, mima[key])
            })
            changePassword({
              // userId: this.userId,
              // newPwd: that.form.newPwd
              oldPassword: md5(that.form.oldPwd),
              newPassword: md5(that.form.newPwd)
            }).then((res) => {
              if (res.code == 0) {
                that.form.confirm = ''
                that.form.newPwd = ''
                that.form.oldPwd = ''
                that.$message({
                  type: 'success',
                  message: '密码修改成功,请重新登陆！'
                })
                // 修改成功 返回登录页
                const timer = setTimeout(() => {
                  this.Logout()
                  clearTimeout(timer)
                }, 500)
              } else {
                that.$message({
                  type: 'warning',
                  message: res.message
                })
              }
            })
          } else {
            that.$message({
              type: 'warning',
              message: '新密码和老密码相同'
            })
          }
        }
      })
    },
    ...mapActions([
      'Logout'
    ])
  }
}
</script>
<style lang="scss" scoped>
.changePassword {
  .common {
    display: flex;
    width: 200px;
    height: 28px;

    .icon {
      width: 12px;
      height: 16px;
      margin-top: 6px;
      border-left: 2px solid #36cea9;
    }

    .text {
      color: #333333;
      font-size: 20px;
      line-height: 28px;
      font-weight: 400;
    }
  }

  .elForm {
    width: 50%;
    padding-right: 100px;
    box-sizing: border-box;
    font-weight: 500;
    font-size: 20px;
    color: #333333;
    margin-top: 30px;
  }

  .xiugai {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      display: float;
      float: right;
      margin-right: 40px;
      width: 269px;
      height: 44px;
      background: rgba(54, 206, 169, 1);
      border-radius: 4px;
      outline: none;
      border: none;
      font-size: 20px;
      color: #fff;
    }
    .btn:hover {
      cursor: pointer;
    }
  }
}
</style>
