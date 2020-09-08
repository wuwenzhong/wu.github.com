<template>
  <div class="baseInfo">
    <div class="common">
      <div class="icon"></div>
      <div class="text">头像</div>
    </div>
    <!-- 上传头像 -->
    <el-upload
    class="avatar-uploader"
    action="#"
    :http-request="updataPic"
    :show-file-list='false'
    :before-upload="uploadBefore"
    accept=".jpg,.jpeg,.png"
    >
    <img v-if="form.photo != ''" :src="form.photo" class="avatar headPic">
    <img v-else src="./../../images/woman.png" alt  class="avatar headPic"/>
  </el-upload>
    <div class="common">
      <div class="icon"></div>
      <div class="text">个人信息</div>
    </div>
    <el-form ref="form" :model="form" label-position="right" class="elForm" :rules="rules">
      <div class="left">
        <el-form-item label="姓名:" prop="userName" label-width="150px">
          <el-input v-model="form.userName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <!-- <el-form-item label="年龄:" prop="age" label-width="150px">
          <el-input
            v-model="form.age"
            placeholder="请输入内容"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
            maxlength="3"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="手机号:" prop="phone" label-width="150px">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email" label-width="150px">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item label="性别:" label-width="150px" required>
          <el-radio-group v-model="form.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期:" prop="date" label-width="150px">
          <el-date-picker type="date" placeholder="请选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <div class="xiugai">
      <button @click="modify" class="btn">保存</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import { changeUserInfo } from './../../../../api/user'
export default {
  computed: {
    ...mapGetters([
      'userName',
      'avatar',
      'birthday',
      'email',
      'gender',
      'phone',
      'age',
      'photo',
      'userId'
    ])
  },
  name: 'baseInfo',
  data() {
    const jyEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (reg.test(value) || value == '') {
        this.yzflag = 1
        callback()
      } else {
        this.yzflag = 0
        callback(new Error('请输入正确格式'))
      }
    }
    const jyaccunt = (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/
      if (reg.test(value)) {
        // callback('账号中不能有中文');
      } else {
        callback()
      }
    }
    const jyphone = (rule, value, callback) => {
      // let reg = /[0-9]{11}/;
      const reg = /^1[3456789]\d{9}$/
      if (reg.test(value)) {
        callback()
      } else {
        // callback('请输入11位手机号')
      }
    }
    return {
      fileUrl: '',
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        age: [
          {
            required: true,
            // validator: jyAge,
            message: '请输入年龄',
            trigger: 'blur'
          }
        ],
        date: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            validator: jyEmail,
            trigger: 'blur'
          }
        ],
        accunt: [
          {
            required: true,
            validator: jyaccunt,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            validator: jyphone,
            trigger: 'blur'
          }
        ]
      },
      form: {
        userName: '',
        age: '',
        phone: '',
        date: '',
        email: '',
        gender: '',
        photo: ''
      },
      yzflag: 1
    }
  },
  mounted() {
    const that = this
    if (!that.userName) {
      this.$router.push({ path: '/usercenter/applicationCenter?flag=1' })
    }
    that.form.userName = that.userName
    that.form.age = that.age
    that.form.phone = that.phone
    that.form.date = that.birthday
    that.form.email = that.email
    that.form.gender = that.gender == 1 ? '男' : '女'
    that.form.photo = that.photo
  },
  methods: {
    uploadBefore(file) {
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
      const type = '.jpg,.jpeg,.png'
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确的格式类型')
        return false
      }
    },
    // 修改头像
    async updataPic(e) {
      const res = await this.cos(e)
      if (res) {
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
        console.log(res)
        this.form.photo = res
      } else {
        this.$message({
          type: 'warning',
          message: '上传失败！'
        })
      }
    },
    // 修改个人信息
    modify() {
      // 修改信息
      var that = this
      if (that.yzflag == 0) {
        this.$message({
          type: 'warning',
          message: '邮箱格式错误！'
        })
        return false
      }
      if (that.form.email == '') {
        this.$message({
          type: 'warning',
          message: '邮箱不能为空！'
        })
        return false
      }
      // 出生日期
      const dateb = new Date(that.form.date)
      const csrq = dateb.getFullYear() + '-' + (dateb.getMonth() + 1 < 10 ? '0' + (dateb.getMonth() + 1) : dateb.getMonth() + 1) + '-' + ((dateb.getDate() + 1 < 10) ? '0' + dateb.getDate() : dateb.getDate())
      const headPortrait = {
        account: '',
        name: that.form.userName,
        age: that.form.age,
        areaCode: '',
        birthday: csrq,
        email: that.form.email,
        gender: that.form.gender == '男' ? '1' : '0',
        photo: this.form.photo
      }
      changeUserInfo(headPortrait).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          this.$store.commit('SET_EMAIL', that.form.email)
          this.$store.commit('SET_PHOTO', that.form.photo)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.baseInfo {
  .headPic {
    margin: 18px 0 23px 7px;
    width: 98px;
    height: 98px;
    background-color: #999;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    img {
      width: 98px;
      height: 98px;
    }

    .cover {
      width: 98px;
      height: 98px;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      color: #fff;
      line-height: 98px;
      text-align: center;
      font-size: 18px;
      display: none;
    }
  }

  .headPic:hover .cover {
    display: block;
    cursor: pointer;
  }

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
    font-weight: 500;
    font-size: 20px;
    color: #333333;
    display: flex;
    margin-top: 30px;

    .left {
      flex: 1;
      margin-right: 100px;
    }

    .right {
      flex: 1;
      margin-right: 100px;
    }
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
