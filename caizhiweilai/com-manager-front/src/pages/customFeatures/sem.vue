<template>
<div class="exam clearfloat">
  <div class="examBtn clearfloat">
    <el-button type="" size="medium" style="background: #414D65;color: #fff;float: right" @click="addSem(0)">新增实操系统</el-button>
  </div>
  <div class="table">
    <el-table :data="semData"
              border
              style="width: 100%">
      <el-table-column prop="systemName"
                        align="center"
                        label="系统名称">
      </el-table-column>
      <el-table-column prop="jumpAddress"
                       align="center"
                       label="跳转网址">
      </el-table-column>
      <el-table-column prop="address"
                       label="操作"
                       align="center"
                       width="180">
        <template slot-scope="scope">
            <el-link style="padding-right:5px;" type="warning"
                     @click='addSem(1,scope.row)'>编辑</el-link>
            <el-link type="warning"
                     @click='deleteSem(scope.row)'>删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 弹窗 -->
  <el-dialog :title="semDialog.title"
             :visible.sync="semDialog.taskStatus"
             v-if="semDialog.taskStatus"
             :close-on-click-modal="false"
             width='500px'>
    <el-form :model="semForm"
             :rules="semRules"
             ref="semForm"
             class='semForm'
             label-width="100px">
      <el-form-item label="系统名称"
                    prop='name'>
        <el-input v-model.trim='semForm.name'></el-input>
      </el-form-item>
      <el-form-item label="跳转网址"
                    prop='website'>
        <el-input v-model.trim='semForm.website'></el-input>
      </el-form-item>
      <el-form-item label="系统封面"
                    required
                    prop="coverUrl">
        <!-- <el-checkbox-group v-model="semForm.coverUrl[0]"></el-checkbox-group> -->
        <el-upload ref="upload"
                   :before-upload="beforeUpload"
                   action="#"
                   :on-change="change"
                   :on-remove="remove"
                   :file-list="semForm.coverUrl"
                   list-type="picture-card"
                   :http-request="PicUpload"
                   accept=".png, .jpg, .gif, .jpeg, .PNG, .JPG, .GIF, .JPEG">
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="wzgs">图片宽高比为2:1,且大小不超过1M</div>
      </el-form-item>
    </el-form>
    <div class="dialog-foot clearfloat"
         style="text-align: center;">
      <span class='cancel'
            @click.stop="cancelHandler()">取消</span>
      <span class='confirm'
            @click.stop='confrimHandler("semForm")'>确认</span>
    </div>
  </el-dialog>
</div>
</template>

<script>
/* eslint-disable */
// 接口文件
import {
  SemList,
  addSem,
  editSem,
  deleteSem
} from '@/api/auth.js'
export default {
  name: 'exam',
  data() {
    return {
      semData: [],
      // 弹窗状态
      semDialog: {
        taskStatus: false,
        title: '新增实操系统'
      },
      // 弹窗验证
      semForm: {
        name: '',
        website: '',
        coverUrl: [],
        operationType: ''
      },
      semRules: {
        name: [{
          required: true,
          message: '请输入系统名称',
          trigger: 'blur'
        }],
        website: [{
          required: true,
          message: '请输入跳转网址',
          trigger: 'blur'
        }],
        coverUrl: [{
          required: true,
          message: "请上传图片",
          trigger: "change"
        }],
        operationType: [{
          required: true,
          message: '建账类型',
          trigger: 'blur'
        }]
      },
      // 新增 0  编辑 1
      distinguishType: '',
      operationId: ''
    }
  },
  methods: {
    // 封装提示框
    prompt(msg, type) {
      return this.$message({
        type: type,
        message: msg
      })
    },
    // 获取用户信息
    getUser(obj) {
      const user = JSON.parse(localStorage.getItem('userMsg'))
      return user[obj]
    },
    // 删除实操
    deleteSem(scope) {
      const data = {
        operationId: scope.id
      }
      const that = this
      this.$confirm('是否删除该实操系统?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSem(data).then((res) => {
          this.semList()
          this.prompt(res.code == 0 ? '删除成功!' : res.message, res.code == 0 ? 'success' : 'error')
        })
        this.semList()
        // that
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭弹窗
    cancelHandler() {
      const that = this
      that.semDialog.taskStatus = false
    },
    // 新建实操保存
    confrimHandler(semForm) {
      this.$refs[semForm].validate((valid) => {
        if (valid) {
          // operationType:String(this.semForm.operationType)
          const data = {
            systemName: this.semForm.name,
            jumpAddress: this.semForm.website,
            coverUrl: this.semForm.coverUrl[0].url,
            operationType: ''
          }
          // 编辑保存
          if (this.distinguishType) {
            Object.assign(data, {
              id: this.operationId,
              modifier: this.getUser('id')
            })
            editSem(data).then((res) => {
              if (res.code == 0) {
                this.semList()
                this.semDialog.taskStatus = false
                this.$message({
                  message: '编辑成功！',
                  type: 'success'
                })
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            Object.assign(data, {
              creator: this.getUser('id')
            })
            addSem(data).then((res) => {
              const that = this
              if (res.code == 0) {
                this.semList()
                that.semDialog.taskStatus = false
                this.$message({
                  message: '新增实操成功！',
                  type: 'success'
                })
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 实操列表
    semList() {
      SemList().then((res) => {
        const that = this
        if (res.code == 0) {
          that.semData = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 新增实操
    addSem(num, id) {
      // 清除表单校验的提示
      if (this.$refs.semForm) {
        this.$refs.semForm.resetFields()
      };
      // 判断是新增还是编辑
      switch (num) {
      case 0:
        this.semDialog.title = '新增实操系统'
        this.semForm.coverUrl = []
        this.semForm.name = ''
        this.semForm.website = ''
        break
      default:
        this.semForm.name = num.systemName
        this.semForm.website = num.jumpAddress
        this.semDialog.title = '编辑实操系统'
      }
      const that = this
      that.semDialog.taskStatus = true
      this.distinguishType = 0
      // 编辑状态
      if (id) {
        // 返回图片url
        this.semForm.coverUrl = [{
          url: id.coverUrl
        }]
        this.distinguishType = 1
        this.semForm.name = id.systemName
        this.semForm.website = id.jumpAddress
        // this.semForm.operationType = id.operationType
        this.semForm.operationType = ''
        this.operationId = id.id
      }
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
      const is1M = file.size / 1024 / 1024 < 1 // 限制小于3M
      if (!is1M) {
        this.$message.error('图片宽高比为2:1,且大小不超过1M')
        return false
      } else {
        const isSize = new Promise((resolve, reject) => {
          const width = 200
          const height = 100
          const _URL = window.URL || window.webkitURL
          const img = new Image()
          img.onload = () => {
            const valid = img.width >= width && img.height >= height && (img.width / img.height == 2)
            valid ? resolve() : reject()
          }
          img.src = _URL.createObjectURL(file)
        }).then(
          () => {
            return file
          },
          () => {
            this.$message.error('图片宽高比为2:1,且大小不超过1M')
            return Promise.reject()
          }
        )
        return isSize
      }
    },
    // 图片上传
    async PicUpload(e) {
      const res = await this.cos(e)
      if (res) {
        // this.$message({
        //   type: 'success',
        //   message: '上传成功！'
        // })
        this.semForm.coverUrl = [{
          url: res
        }]
      } else {
        this.$message({
          type: 'warning',
          message: '上传失败！'
        })
      }
    },
    change(file) {
      this.semForm.coverUrl = []
      const houZuiMing = file.name.replace(/.+\./, '')
      if (
        ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'].indexOf(
          houZuiMing.toLowerCase()
        ) === -1 ||
        file.size > 1024 * 1024
      ) {
        return;
      }
    },
    remove(file) {}
  },
  created() {
    const that = this
    const url = this.$route.path

    const urlPart = url.endsWith('exam')
    if (urlPart) {
      this.$emit('barIndex')
    }
  },
  mounted() {
    // 实操列表
    this.semList()
  }
}
</script>
<style lang="scss" scoped>
.semForm {
    .el-input {
        width: 308px;
        height: 32px;
    }
}
.wzgs {
    color: #f57474;
}
.costomized {
    width: 100%;
    height: auto;
    overflow: hidden;
    font-size: 14px;
    background: #fff;
    // 标题
    .costomized-title {
        width: 100%;
        height: auto;
        overflow: hidden;
        h4 {
            color: #414D65;
            font-weight: normal;
        }
    }
    //中间内容区
    .costomized-content {
        display: flex;
        // 左侧导航
        .costomized-bar {
            width: 280px;
            height: auto;
            overflow: hidden;
        }
        // 右侧内容
        .costomized-main {
            flex: 1;
            // border:1px solid red;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            box-sizing: border-box;
            padding: 30px 28px;
        }
    }
}
</style>
