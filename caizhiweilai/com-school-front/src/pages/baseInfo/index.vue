<template>
  <div class="app-container">
    <div class="baseInfoPage">
      <div class="school">
        <img :src="form.headPic" alt=""/>
        <p>{{form.collegeName}}</p>
      </div>

      <div class="content">
        <div class="baseInfo">
          <div class="common">
            <div class="icon"></div>
            <div class="text">院校基本信息</div>
          </div>
          <el-form
            :model="form"
            ref="form"
            label-position="right"
            class="schoolForm"
            :rules="rules"
          >
            <el-form-item
              label="院校头像 "
              prop="headPic"
              label-width="100px"
              required
            >
              <el-upload
                action="#"
                :show-file-list="false"
                :http-request="uploadFile"
                :before-upload="beforeUpload"
              >
                <div class="headimg">
                  <img v-if="form.headPic" :src="form.headPic" alt />
                  <img v-else src="@/common/images/default-avatar.png" alt />
                  <div class="cover">修改头像</div>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item
              label="院校名称 "
              prop="collegeName"
              label-width="100px"
            >
              <el-input
                type="text"
                v-model="form.collegeName"
                placeholder="请输入院校名称"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="所在地区 "
              prop="addressCode"
              label-width="100px"
            >
              <el-cascader
                v-model="form.addressCode"
                ref="selectOption"
                :options="options"
                @change="selectAddress"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址 " prop="address" label-width="100px">
              <el-input
                v-model="form.address"
                placeholder="请输入地址"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="学校描述 "
              prop="description"
              label-width="100px"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 14 }"
                v-model="form.description"
                placeholder="请输入描述"
                autocomplete="off"
                maxlength="500"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="submit">
            <button @click="confirmUpdateEdu()">提交</button>
          </div>
        </div>
        <div class="password">
          <button @click="clickPassword">修改密码</button>
        </div>
      </div>
      <!-- 修改密码弹框 -->
      <el-dialog
        title="修改密码"
        :close-on-click-modal="false"
        :visible.sync="updatePasswordShow"
        class='common-small'
      >
        <updatePassword @quxiao="updatePasswordClose"></updatePassword>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryBaseInfo, updateBaseInfo } from '@/api/tdb'
import areaJs from '@/common/js/select_area.js'
import { cos } from '@/common/js/cos.js'
import updatePassword from './component/updatePassword'
export default {
  name: 'BaseInfoPage',
  components: {
    updatePassword
  },
  data() {
    return {
      updatePasswordShow: false, // 是否显示修改密码弹框
      options: areaJs, // 引入三级联动文件
      form: {
        headPic: '',
        collegeName: '',
        addressCode: '',
        address: '',
        description: '',
        province: '', // 省
        city: '', // 市
        county: '' // 区县
      },
      selectText: '', // 存储三级联动地址
      rules: {
        collegeName: [
          {
            required: true,
            message: '请输入院校名称',
            trigger: 'blur'
          }
        ],
        addressCode: [
          {
            required: true,
            message: '请选择所在地区',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入学院描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 选择地址
    selectAddress(e, form) {
      this.selectText = this.$refs.selectOption.getCheckedNodes()[0].pathLabels
      this.form.addressCode = e.join(',')
      // 北京市 天津市 重庆市 上海市
      if (
        e[0] === '110000' ||
        e[0] === '120000' ||
        e[0] === '500000' ||
        e[0] === '310000'
      ) {
        this.form.province = this.selectText[0]
        this.form.city = this.selectText[0]
        this.form.county = this.selectText[2]
      } else {
        this.form.province = this.selectText[0]
        this.form.city = this.selectText[1]
        this.form.county = this.selectText[2]
      }
    },
    // 查询学院信息
    async queryBaseInfo() {
      const res = await queryBaseInfo({
        customerId: localStorage.getItem('customerId')
      })
      if (res.code === '101') {
        this.$message.warning(res.message)
      } else {
        this.form.headPic = res.result.coverUrl
        this.form.collegeName = res.result.customerName
        this.form.address = res.result.address
        this.form.description = res.result.description
        this.form.province = res.result.province
        this.form.city = res.result.city
        this.form.county = res.result.county
        this.form.addressCode = res.result.addressCode.split(',')
      }
    },
    // 修改学校信息
    confirmUpdateEdu() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await updateBaseInfo({
            customerName: this.form.collegeName,
            coverUrl: this.form.headPic,
            description: this.form.description,
            province: this.form.province,
            address: this.form.address,
            city: this.form.city,
            county: this.form.county,
            addressCode: this.form.addressCode.toString(),
            id: localStorage.getItem('customerId')
          })
          // 修改成功的反馈
          if (res.code === '0') {
            this.$message.success(res.message)
            this.queryBaseInfo()
          } else {
            // 修改失败的反馈
            this.$message.warning(res.message)
          }
        }
      })
    },
    // 上传的图片做校验
    beforeUpload(file) {
      const FileExt = file.name.replace(/.+\./, '')
      if (
        ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'].indexOf(
          FileExt.toLowerCase()
        ) === -1
      ) {
        this.$message({
          type: 'warning',
          message: '请上传后缀名为jpg,jpeg,png结尾的图片！'
        })
        return false
      }
      if (file.size > 1024 * 1024) {
        this.$message({
          type: 'warning',
          message: '你上传的图片大小超过1M,请重新上传！'
        })
        return false
      }
    },
    // 上传图片
    async uploadFile(e) {
      const self = this
      const res = await cos(e, self, '', function() {})
      this.form.headPic = res
    },
    // 点击修改密码
    clickPassword() {
      this.updatePasswordShow = true
    },
    // 关闭修改密码弹框
    updatePasswordClose(isTrue) {
      this.updatePasswordShow = false
      if (isTrue) {
      }
    }
  },
  mounted() {
    this.queryBaseInfo()
  }
}
</script>

<style lang="scss" scoped>
.baseInfoPage {
  height: 100%;
  .school {
    margin-top:15px;
    width: 100%;
    height: 80px;
    padding: 0 100px;
    display: flex;
    align-items: center;
    img {
      width: 70px;
      height: 70px;
      display: block;
      border-radius: 50%;
    }
    p {
      margin-left: 30px;
      font-size: 30px;
    }
  }

  .content {
    height: calc(100% - 80px);
    // box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    .baseInfo {
      width: 60%;
      //   height: 100%;
      .schoolForm {
        margin-left: 160px;
        .headimg {
          width: 63px;
          height: 63px;
          position: relative;
          // border-radius: 50%;
          overflow: hidden;
        }
        img {
          width: 63px;
          height: 63px;
          border-radius: 50%;
        }
        .cover {
          width: 63px;
          height: 63px;
          background-color: rgba(0, 0, 0, 0.4);
          position: absolute;
          left: 0;
          top: 0;
          color: #fff;
          line-height: 63px;
          text-align: center;
          font-size: 10px;
          display: none;
        }

        .headimg:hover .cover {
          display: block;
          cursor: pointer;
        }
        .el-cascader {
          width: 100%;
        }
      }
    }
    .password {
      margin: 25px auto;
      button {
        float: right;
        width: 100px;
        height: 32px;
        background: rgba(54, 206, 169, 1);
        border-radius: 2px;
        border: none;
        outline: none;
        color: #fff;
        align-self: center;
        cursor: pointer;
      }
    }
    .common {
      display: flex;
      height: 30px;
      margin: 25px 0 30px 160px;
      .icon {
        width: 12px;
        height: 30px;
        border-left: 2px solid #36cea9;
      }
      .text {
        color: #333333;
        font-size: 20px;
        line-height: 30px;
        font-weight: 400;
      }
    }
    .submit {
      display: float;
      button {
        float: right;
        width: 100px;
        height: 32px;
        background: rgba(54, 206, 169, 1);
        border-radius: 2px;
        border: none;
        outline: none;
        color: #fff;
        align-self: center;
        cursor: pointer;
      }
    }
  }
}
</style>
