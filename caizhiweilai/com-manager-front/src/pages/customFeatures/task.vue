<template>
<div class="exam clearfloat">
  <div class="examBtn clearfloat">
    <el-button type=""
      size="medium"
      style="background: #414D65;color: #fff;float: right"
      @click="addTask(0)">新增任务类型</el-button>
  </div>
  <div class="table">
    <el-table :data="taskData"
      border
      style="width: 100%">
      <el-table-column label="编号"
        align="center">
        <template slot-scope="scope">
          {{scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column prop="name"
        align="center"
        label="任务类型名称">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width='180'>
        <template slot-scope="scope">
          <el-link style="padding-right:5px;"
            type="warning"
            @click.stop='addTask(1,scope.row)'>编辑</el-link>
          <el-link type="warning"
            @click.delete='deleteTask(scope.row)'>删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 弹窗 -->
  <el-dialog :title="taskDialog.title"
    :visible.sync="taskDialog.taskStatus"
    :close-on-click-modal="false"
    width='500px'>
    <el-form :model="taskForm"
      :rules="taskRules"
      ref="taskForm"
      class='taskForm'
      label-width="120px">
      <el-form-item label="编号"
        prop='code'>
        <el-input v-model.trim='taskForm.code'></el-input>
      </el-form-item>
      <el-form-item label="任务类型名称"
        prop='name'>
        <el-input v-model.trim='taskForm.name'></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-foot clearfloat">
      <span class='cancel'
        @click='taskDialog.taskStatus=false'>取消</span>
      <span class='confirm'
        @click.stop='saveTask("taskForm")'>确认</span>
    </div>
  </el-dialog>
</div>
</template>

<script>
// 接口文件
import {
  addTask,
  editTask,
  deleteTask,
  listTask
} from '@/api/auth.js'

export default {
  name: 'exam',
  data() {
    return {
      taskData: [],
      // 弹窗状态
      taskDialog: {
        taskStatus: false,
        title: '新增实操系统'
      },
      editTaskId: '',
      // 弹窗验证
      taskForm: {
        name: '',
        code: ''
      },
      taskRules: {
        name: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入编号',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 删除实操
    deleteTask(row) {
      const that = this
      this.$confirm('是否删除该任务类型维护?', '删除', {
        type: 'warning'
      }).then(() => {
        deleteTask({
          taskTypeId: row.id
        }).then((res) => {
          if (Number(res.code) == 0) {
            this.taskList()
            this.$message.warning('删除成功！')
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {})
    },
    // 获取用户信息
    getUser(obj) {
      const user = JSON.parse(localStorage.getItem('userMsg'))
      return user[obj]
    },
    // 新增任务类型
    addTask(num, row) {
      const that = this
      if (that.$refs.taskForm) {
        that.$refs.taskForm.resetFields()
      }
      switch (num) {
      case 0:
        Object.assign(that.taskDialog, {
          title: '新增任务类型',
          type: 1
        })
        break
      default:
        that.taskForm = {
          name: row.name,
          code: row.code
        }
        that.editTaskId = row.id
        Object.assign(that.taskDialog, {
          title: '编辑任务类型',
          type: 2
        })
      }
      Object.assign(that.taskDialog, {
        taskStatus: true
      })
    },
    // 保存任务
    saveTask(taskForm) {
      const {
        code,
        name
      } = this.taskForm
      const that = this
      const data = {
        code,
        name,
        creator: that.getUser('id')
      }
      this.$refs[taskForm].validate((valid) => {
        if (valid) {
          if (this.taskDialog.type == 2) {
            Object.assign(data, {
              id: this.editTaskId
            })
            editTask(data).then((res) => {
              if (res.code == 0) {
                this.taskList()
                that.taskDialog.taskStatus = false
                this.$message.success('编辑成功！')
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            addTask(data).then((res) => {
              if (res.code == 0) {
                this.taskList()
                that.taskDialog.taskStatus = false
                this.$message.success('新增成功！')
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
    // 任务列表
    taskList() {
      listTask().then(res => {
        res.code == 0 ? this.taskData = res.result : this.$message.error(res.message)
      })
    }
  },
  created() {
    // 任务列表
    this.taskList()
  }
}
</script>
<style lang="scss" scoped>
</style>
