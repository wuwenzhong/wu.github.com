<template>
<div class="student-manager-wrapper">
  <el-row :gutter="10" class="mb24">
    <el-col :span="1.5">
      <el-dropdown trigger="click">
        <el-button type="primary" size="small">
          导入学生<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <a href="/model/导入学生模板.xlsx" download="导入学生模板.xlsx">下载模板</a>
          </el-dropdown-item>
          <el-dropdown-item>
            <!-- @click.native="handleImport()" -->
            <el-upload action="#" ref="upload" :file-list="fileList" :limit="1" accept=".xlsx,.xls" :show-file-list="false" :http-request="fileUpload" :on-success="upFileSuccess" :on-remove="handleRemove" :on-exceed="handleExceed"
              :before-upload="beforeUpload">
              <div>点击上传</div>
            </el-upload>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col :span="1.5">
      <el-button type="primary" size="small" @click="handleAdd()">新增学生</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="primary" size="small" @click="handleOperaAny('重置密码')">重置密码</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="primary" size="small" class="icon-other" @click="handleOperaAny('强制下线')">强制下线</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="primary" size="small" class="icon-other" @click="handleOperaAny('移出班级')">移出班级</el-button>
    </el-col>
    <el-col :span="3" class="fr">
      <el-input size="small" v-model="queryParams.keywords" suffix-icon="el-icon-search" placeholder="请输入姓名、学号或手机号"></el-input>
    </el-col>
  </el-row>
  <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center"></el-table-column>
    <el-table-column label="序号" type="index" width="60" align="center">
      <template slot-scope="scope">
        <span>{{(queryParams.page - 1) * queryParams.size + scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="identityCode" label="学号" align="center"></el-table-column>
    <el-table-column prop="name" label="姓名" align="center"></el-table-column>
    <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
    <el-table-column label="性别" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.gender === 1">男</span>
        <span v-if="scope.row.gender === 0">女</span>
        <span v-if="scope.row.gender === 2">保密</span>
      </template>
    </el-table-column>
    <el-table-column label="小组名称" align="center">
      <template slot-scope="scope">
        {{ scope.row.teamName ? scope.row.teamName : '未分组' }}
      </template>
    </el-table-column>
    <el-table-column label="在线状态" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.onlineStatus === 1">在线</span>
        <span v-if="scope.row.onlineStatus === 0">离线</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="small" style="color: #36CEA9" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button type="text" size="small" style="color: #FF9D6A" :disabled="scope.row.onlineStatus !== 1" @click="handleOpera(scope.row, '强制下线')">强制下线</el-button>
        <br>
        <el-button type="text" size="small" style="color: #36CEA9" @click="handleOpera(scope.row, '重置密码')">重置密码</el-button>
        <el-button type="text" size="small" style="color: #FF9D6A" @click="handleOpera(scope.row, '移出班级')">移出实训班级</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <!-- <pagination :hidden="total <= 10" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.size" @pagination="getStudentList" /> -->
  <pagination :hidden="total <= 10" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.size" @pagination="changePage" />

  <!-- 导入对话框 -->
  <!-- <el-dialog title="批量导入" :visible.sync="dialogImport" width="560px" @close='closeDialogImport()'>
      <div style="margin-bottom: 8px">1、<span>学员导入模板.xlsx</span></div>
      <div style="margin-bottom: 8px">2、单次导入不要超过1000条</div>
      <div style="margin-bottom: 8px">3、导入学员数量不能超过实训班级最大人数</div>
      <el-form name="uplodForm">
        <el-form-item>
          <el-upload
            action="#"
            ref="upload"
            :limit="1"
            accept=".xlsx,.xls"
            :http-request="fileUpload"
            :on-success="upFileSuccess"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button style="display:none;" size="small" ref="btns" type="primary">查看重复学号</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="fileCancle()">取 消</el-button>
        <el-button type="primary" size="medium" :loading="loadingImport" :disabled="disabled" @click="fileClick()">确定导入</el-button>
      </span>
    </el-dialog> -->

  <!-- 手机号格式错误弹窗 -->
  <el-dialog title="警告" :visible.sync="dialogPhoneError" width="560px" :close-on-click-modal="false">
    <div style="line-height: 30px;">{{errorMsg}}</div>

    <div style="line-height: 30px; color: rgb(255, 0, 0);"><span v-for='(item,index) in errorPhone' :key='index'>{{item}}</span></div>
  </el-dialog>

  <!-- 新增、编辑对话框 -->
  <el-dialog :title="dialogTitle" custom-class="addStu-editStu-dialog" :visible.sync="dialogEdit" width="520px" @close='closeDialogEdit()' :close-on-click-modal="false">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px">
      <el-form-item label="学号" prop="identityCode">
        <el-input clearable v-model.trim="ruleForm.identityCode" maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input clearable v-model="ruleForm.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="学号" prop="number">
          <el-input clearable v-model="ruleForm.number"></el-input>
        </el-form-item> -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" maxlength="11" :disabled="disabledPhone"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="ruleForm.password" maxlength="10" type="password" placeholder="选填，默认为手机号后六位"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio v-for="dict in genderOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancle('ruleForm')">取 消</el-button>
      <el-button type="primary" size="medium" @click="handleSubmit('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  studentList,
  studentSave,
  studentImport,
  studentUpdate,
  studentDelete,
  passwordAnyReset,
  studentLogout
} from '@/api/xsgl.js'
import {
  deepClone,
  _debounce,
  _vueDebounce
} from '@/common/js/utils.js'

export default {
  name: 'StudentManPage',
  data() {
    const studentNum = (rule, value, callback) => {
      if (value != '') {
        const text = /^[0-9a-zA-Z]+$/.test(value)
        if (!text) {
          callback(new Error('只能为数字和字母'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const phoneNumber = (rule, value, callback) => {
      const phone = /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/
      if (!phone.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      classId: localStorage.getItem('classId'), // 班级id
      courseId: localStorage.getItem('courseId'),
      customerId: localStorage.getItem('customerId'), // 客户id
      // 数据字典
      genderOptions: [
        {
          dictValue: 1,
          dictLabel: '男'
        },
        {
          dictValue: 0,
          dictLabel: '女'
        },
        {
          dictValue: 2,
          dictLabel: '保密'
        }
      ],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        keywords: '',
        classId: localStorage.getItem('classId')
      },
      currentSizeChange: 10, // 备份每页多少条数据
      fileList: [], // 选择的模板文件
      uploadParams: {}, // 上传参数
      studentUserIds: [], // 学生Id数组
      multipleSelection: [], // 选中数组
      dialogTitle: '', // 弹窗标题
      dialogEdit: false, // 新增 编辑
      // dialogImport: false, // 导出
      dialogPhoneError: false, // 手机号格式错误
      errorMsg: '',
      errorPhone: '', // 格式错误手机号
      // loadingImport: false, // 导入loading
      // disabled: true, // 是否可导入
      disabledPhone: false, // 是否可输入手机号
      total: 1, // 总条数
      tableData: [], // table数据
      ruleForm: {
        password: ''
      }, // 新增 编辑参数
      // 校验规则
      rules: {
        identityCode: [{
            validator: studentNum
          }],
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            type: 'number',
            validator: phoneNumber,
            trigger: 'blur'
          }],
        gender: [{
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }]
      },
      str: ''
    }
  },
  computed: {
    computeValue: {
      get() {
        return this.ruleForm.password.replace(/./g, '*')
      },
      set(val) {
        console.log(val)
        this.ruleForm.password = val
      }
    }
  },
  created() {
    // this.getStudentList()
  },
  mounted() {
    this.getStudentList()
  },
  watch: {
    'queryParams.keywords': {
      handler(newVal, oldVal) {
        this.queryParams.page = 1
        this.getSearchList()
      },
      deep: true
    }
  },
  methods: {
    // 切换分页
    changePage(obj) {
      if (this.currentSizeChange !== obj.limit) {
        this.queryParams.page = 1
        this.currentSizeChange = obj.limit
      } else {
        this.queryParams.page = obj.page
      }
      this.queryParams.size = obj.limit
      this.getStudentList()
    },
    // 获取列表
    getStudentList() {
      const that = this
      studentList(this.queryParams).then(res => {
        if (res.code === '0') {
          this.tableData = res.result.data
          this.total = Number(res.result.total)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 键盘抬起搜索
    getSearchList: _vueDebounce('getStudentList', 500),
    // 多选框
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 重置表单
    reset() {
      this.ruleForm = {
        gender: 1,
        classId: this.classId,
        customerId: this.customerId
      }
    },
    // 导入
    // handleImport() {
    //   this.dialogImport = true
    // },
    // 上传成功
    upFileSuccess(response, file, fileList) {
      if (this.uploadParams.filePath === '') {
        this.$message.warning('请先选取文件')
        return
      }
      // this.loadingImport = true
      const path = this.uploadParams.filePath
      const pos = path.lastIndexOf('/')
      const url = path.substr(0, pos + 1)
      const str = path.substr(pos + 1)
      const dian = str.lastIndexOf('.')
      const fileName = str.substr(0, dian)
      const end = str.substr(dian)
      const jm = decodeURI(fileName) // 解码
      this.uploadParams = {
        filePath: url + jm + end,
        classId: this.classId,
        customerId: this.customerId
      }
      studentImport(this.uploadParams).then(res => {
        if (res.code === '0') {
          this.$refs.upload.clearFiles()
          // 导入成功
          this.$message.success(res.message)
          this.getStudentList()
          // this.dialogImport = false
          // this.loadingImport = false
        } else if (res.code === '101') {
          this.$refs.upload.clearFiles()
          if (res.result) {
            // 手机号格式错误
            this.errorPhone = res.result.substring(1, res.result.length - 1).split(',')
            // this.errorPhone = res.result
            this.errorMsg = res.message
            this.dialogPhoneError = true
            // this.loadingImport = false
          } else {
            // 开小差
            // this.loadingImport = false
            this.$message.warning(res.message)
          }
        }
      })
    },
    // 上传文件超出个数
    handleExceed(files, fileList) {
      this.$message.warning('当前只能选择上传 1 个文件')
    },
    // 移除文件
    handleRemove(file, fileList) {
      // this.disabled = true
    },
    // 文件校验
    beforeUpload(file) {
      const FileExt = file.name.replace(/.+\./, '')
      if (['xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message.warning('请上传后缀名为xlsx或xls的文件！')
        return false
      }
    },
    // 上传图片
    async fileUpload(e) {
      this.uploadParams.filePath = await this.cos(e, e.file, '', '')
      // this.disabled = false
      // this.$forceUpdate()
    },
    // 关闭导入弹窗
    closeDialogImport() {
      this.$refs.upload.clearFiles()
    },
    // 取消上传
    // fileCancle() {
    //   this.dialogImport = false
    //   this.$refs.upload.clearFiles()
    // },
    // 批量导入确定上传
    // fileClick: _debounce(function() {
    //   if (this.uploadParams.filePath === '') {
    //     this.$message.warning('请先选取文件')
    //     return
    //   }
    //   this.loadingImport = true
    //   const path = this.uploadParams.filePath
    //   const pos = path.lastIndexOf('/')
    //   const url = path.substr(0, pos + 1)
    //   const str = path.substr(pos + 1)
    //   const dian = str.lastIndexOf('.')
    //   const fileName = str.substr(0, dian)
    //   const end = str.substr(dian)
    //   const jm = decodeURI(fileName)// 解码
    //   this.uploadParams = {
    //     filePath: url + jm + end,
    //     classId: this.classId,
    //     customerId: this.customerId
    //   }
    //   studentImport(this.uploadParams).then(res => {
    //     if (res.code === '0') {
    //       // 导入成功
    //       // this.$message.success('导入成功')
    //       this.$message.success(res.message)
    //       this.getStudentList()
    //       this.dialogImport = false
    //       this.loadingImport = false
    //     } else if (res.code === '101') {
    //       if (res.result) {
    //         // 手机号格式错误
    //         this.errorPhone = res.result
    //         this.dialogPhoneError = true
    //         this.loadingImport = false
    //       } else {
    //         // 开小差
    //         this.loadingImport = false
    //         this.$message.warning(res.message)
    //       }
    //     }
    //   })
    // }),
    // 强制下线
    studentLogoutFun(data, name) {
      console.log(data, name)
      const arr = []
      this.multipleSelection.forEach(key => {
        if (key.onlineStatus == 1) {
          arr.push(key.id)
        }
      })
      const datas = data
      if (arr.length != 0) {
        datas.userIds = arr
      } else if (arr.length === 0 && name === '强制下线') {
        datas.userIds = data.userIds
      } else {
       this.$message.warning('已经全部离线无需强制下线')
        return
      }
      if (datas.userIds.length == 0) {
        this.$message.success('强制下线成功')
      } else {
        studentLogout(datas).then(res => {
          if (res.code === '0') {
            this.$message.success(res.message)
            this.getStudentList()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 重置密码
    passwordResetFun(data) {
      passwordAnyReset({ userIds: data.userId.toString() }).then(res => {
        if (res.code === '0') {
          // this.$message.success('重置成功，默认为手机号后六位！')
          this.$message.success('密码已重置为手机号后六位！')
          this.getStudentList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 批量重置密码
    passwordAnyResetFun(data) {
      passwordAnyReset({
        userIds: data.toString()
      }).then(res => {
        if (res.code === '0') {
          this.$message.success(res.message)
          this.getStudentList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 移出接口
    studentDeleteFun(data) {
      studentDelete({
        userIds: data,
        classId: this.classId,
        customerId: this.customerId
      }).then(res => {
        if (res.code === '0') {
          // this.$message.success('移出成功')
          this.$message.success(res.message)
          if (this.multipleSelection.length === 0) {
            const dataLen = this.tableData.length
            const dataLens = dataLen - 1
            if (dataLens === 0) {
              this.queryParams.page -= 1
              this.getStudentList()
            } else {
              this.getStudentList()
            }
          } else {
            if (this.total % this.queryParams.size === this.multipleSelection.length % this.queryParams.size) {
              if (this.queryParams.page === 1) {
                this.getStudentList()
              } else {
                this.queryParams.page -= 1
                this.getStudentList()
              }
            } else {
              this.getStudentList()
            }
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 强制下线 重置密码 移除班级
    handleOpera(row, name) {
      this.studentUserIds.length = 0
      this.studentUserIds.push(row.id)
      const newArr = [...new Set(this.studentUserIds)]
      const userInfor = {
        userIds: newArr,
        classId: this.classId,
        courseId: this.courseId,
        customerId: this.customerId
      }
      const resetData = {
        userId: row.id,
        newPwd: row.phone.substring(row.phone.length - 6)
      }
      this.$confirm('确定要' + name + '吗?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        confirmButtonClass: 'el-button--medium',
        cancelButtonClass: 'el-button--medium',
        type: 'warning'
      }).then(() => {
        switch (name) {
        case '强制下线':
          this.studentLogoutFun(userInfor, name)
          break
        case '重置密码':
          this.passwordResetFun(resetData)
          break
        case '移出班级':
          this.studentDeleteFun(newArr)
          break
        default:
          break
        }
      }).catch(() => {
        // this.$message.info('已取消')
      })
    },
    // 批量下线 批量重置 批量移除
    handleOperaAny(name) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选中要' + name + '的学生')
        return false
      }
      this.studentUserIds.length = 0 // 每次都清空为0 避免选中以后 在删除选中 下面数组不变的情况
      this.multipleSelection.forEach((item) => {
        this.studentUserIds.push(item.id)
      })
      const newArr = [...new Set(this.studentUserIds)] // 去重
      const userInfor = {
        userIds: newArr,
        classId: this.classId,
        courseId: this.courseId,
        customerId: this.customerId
      }
      this.$confirm('确定要批量' + name + '吗?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        confirmButtonClass: 'el-button--medium',
        cancelButtonClass: 'el-button--medium',
        type: 'warning'
      }).then(() => {
        switch (name) {
        case '强制下线':
          this.studentLogoutFun(userInfor)
          break
        case '重置密码':
          // 暂未开放
          this.passwordAnyResetFun(newArr)
          break
        case '移出班级':
          this.studentDeleteFun(newArr)
          break
        default:
          break
        }
      }).catch(() => {
        // this.$message.info('已取消')
      })
    },
    // 新增
    handleAdd() {
      this.reset()
      this.disabledPhone = false
      this.dialogEdit = true
      this.dialogTitle = '新增学生'
    },
    // 编辑
    handleUpdate(row) {
      this.reset()
      this.disabledPhone = true
      this.ruleForm = deepClone(row)
      this.dialogEdit = true
      this.dialogTitle = '编辑学生'
    },
    // 关闭新增弹窗
    closeDialogEdit() {
      this.$refs.ruleForm.resetFields()
    },
    // 确定
    handleSubmit: _debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            // 编辑
            studentUpdate({
              classId: this.classId,
              identityCode: this.ruleForm.identityCode,
              customerId: this.customerId,
              name: this.ruleForm.name,
              password: this.ruleForm.password,
              age: this.ruleForm.age,
              gender: this.ruleForm.gender,
              // email: this.ruleForm.email,
              id: this.ruleForm.id
            }).then(res => {
              if (res.code === '0') {
                this.$message.success(res.message)
                this.dialogEdit = false
                this.getStudentList()
              } else {
                this.$message.warning(res.message)
              }
            })
          } else {
            // 新增
            studentSave(this.ruleForm).then(res => {
              if (res.code === '0') {
                this.$message.success(res.message)
                this.dialogEdit = false
                this.getStudentList()
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
    }),
    // 取消
    handleCancle(formName) {
      this.dialogEdit = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
// 下拉
.el-dropdown-menu {
    padding: 5px 0;
    .el-dropdown-menu__item {
        font-size: 12px;
        padding: 0 29px;
    }
}
</style>
<style lang="scss">
.student-manager-wrapper {
    padding: 26px 20px;
    // icon修改
    .icon-other {
        background: #FF9D6A;
        border-color: #FF9D6A;
        color: #fff;
        &:active {
            background: #FFBC7D;
            border-color: #FFBC7D;
            color: #fff;
        }
        &:hover {
            background: #FFBC7D;
            border-color: #FFBC7D;
            color: #fff;
        }
    }
}
.addStu-editStu-dialog{
  border-radius: 4px;
}
</style>
