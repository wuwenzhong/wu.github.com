<template>
  <div class="sign-manager-wrapper">
    <el-row :gutter="10" class="mb24">
      <el-col :span="1.5">
        <el-button type="primary" size="small" @click="handleExportRecord()">导出签到记录</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="small" @click="handleSign()">发起签到</el-button>
      </el-col>
    </el-row>
    <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="startTime" label="签到开始时间" width="240" align="center"></el-table-column>
      <el-table-column prop="endTime" label="签到结束时间" width="240" align="center"></el-table-column>
      <el-table-column prop="realCount" label="实际签到人数" align="center"></el-table-column>
      <el-table-column prop="mastCount" label="应签到人数" align="center"></el-table-column>
      <el-table-column prop="attendance" label="出勤率（%）" align="center"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.status == '1'" style="color: #36CEA9" @click="handleClose(scope.row)">结束签到</el-button>
          <el-button type="text" size="small" v-else style="color: #ccc" disabled>签到已结束</el-button>
          <el-button type="text" size="small" style="color: #36CEA9" @click="handleDetail(scope.row)">查看签到详情</el-button>
          <el-button type="text" size="small" style="color: #FF9D6A" @click="handleDelete(scope.row)">删除记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      :hidden="total <= 10"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getSignList"
    />

    <!-- 发起签到 -->
    <el-dialog title="发起签到" :visible.sync="dialogSign" width="464px" @close='closeDialogSign' :close-on-click-modal="false">
      <el-form :model="ruleForm" label-width="110px">
        <el-form-item label="当前时间">
          <el-input disabled v-model="ruleForm.startTime"></el-input>
        </el-form-item>
        <el-form-item label="自动结束时间">
          <el-select v-model="ruleForm.time" placeholder="请选择活动区域">
            <el-option
              v-for="dict in timeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogSign = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 签到警告 -->
    <el-dialog title="发起签到" :visible.sync="dialogSignWarning" width="464px" :close-on-click-modal="false">
      <span>当前有未结束的签到，签到率为 {{attendance}} % ，是否结束？</span>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogSignWarning = false">否</el-button>
        <el-button type="primary" size="medium" @click="handleStopSign()">是</el-button>
      </div>
    </el-dialog>

    <!-- 签到失败 -->
    <el-dialog title="发起签到" :visible.sync="dialogSignError" width="464px" :close-on-click-modal="false">
      <span>{{ dialogSignErrorMsg }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogSignError = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="dialogSignError = false">我知道了</el-button>
      </div>
    </el-dialog>

    <!-- 签到详情 -->
    <el-dialog :show-close="false" :visible.sync="dialogDetail" width="470px" custom-class="sign-dialog" @close="closeDialogDetail" :close-on-click-modal="false">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="已签到" name="first">
          <el-table stripe :data="recordDetails">
            <el-table-column property="studentName" label="学生姓名"></el-table-column>
            <el-table-column property="signInTime" label="签到时间"></el-table-column>
          </el-table>
          <pagination
            :hidden="totalItem <= 10"
            :total="totalItem"
            :pager-count="5"
            :layout="'total, prev, pager, next'"
            :page.sync="queryItemParams.page"
            :limit.sync="queryItemParams.size"
            @pagination="signItemListFun(queryItemParams)"
          />
        </el-tab-pane>
        <el-tab-pane label="未签到" name="second">
          <el-table style="max-height:500px;overflow:auto;" stripe  :data="recordDetails">
            <el-table-column property="studentName" label="学生姓名"></el-table-column>
            <el-table-column label="所属团队">
              <template slot-scope="scope">
                <span v-if="scope.row.teamName">{{ scope.row.teamName }}</span>
                <span v-else><span style="color: #E6A23C">*</span> 暂未加入团队</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :hidden="totalItem <= 10"
            :total="totalItem"
            :pager-count="5"
            :layout="'total, prev, pager, next'"
            :page.sync="queryItemParams.page"
            :limit.sync="queryItemParams.size"
            @pagination="signItemListFun(queryItemParams)"
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="dialogDetail = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { signList, signValid, signSave, signStop, signDel, signItemList, signExport } from '@/api/sxgk.js'
import { formatDate, _debounce } from '@/common/js/utils.js'

export default {
  name: 'SignInManPage',
  data() {
    return {
      // 数据字典
      timeOptions: [
        { dictValue: 300000, dictLabel: '5分钟后' },
        { dictValue: 600000, dictLabel: '10分钟后' },
        { dictValue: 900000, dictLabel: '15分钟后' },
        { dictValue: 1200000, dictLabel: '20分钟后' },
        { dictValue: 1500000, dictLabel: '25分钟后' },
        { dictValue: 1800000, dictLabel: '30分钟后' }
      ],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        classId: localStorage.getItem('classId') // 班级id
      },
      className: localStorage.getItem('className'), // 班级名
      recordIds: [], // 签到Id数组
      multipleSelection: [], // 选中数组
      total: 0, // 总条数
      totalItem: 0, // 详情总条数
      dialogSign: false, // 发起签到
      dialogSignWarning: false, // 签到提示
      recordId: '', // 要结束的记录
      attendance: '', // 要结束的记录出勤率
      dialogSignError: false, // 签到失败
      dialogSignErrorMsg: '', // 失败文案
      dialogDetail: false, // 签到详情
      activeName: 'first', // 选项卡
      // 发起签到参数
      ruleForm: {
        classId: localStorage.getItem('classId'), // 班级id
        startTime: '',
        endTime: '',
        startTimeLong: '',
        time: 900000
      },
      // loading: true, // table loading
      // loadingDetail: true, // 详情 loading
      tableData: [], // table数据
      // 查看详情参数
      queryItemParams: {
        page: 1,
        size: 10,
        status: 1,
        signInId: ''
      },
      recordDetails: [], // 签到数据
      timer: '' // 定时器
    }
  },
  created() {
    this.getSignList()
  },
  beforeRouteEnter (to, from, next) {
    if (from.fullPath == '/home/index' && to.query.flag === 1) {
      next(vm => {
        // 执行发起签到
        vm.handleSign()
      })
    } else {
      next()
    }
  },
  methods: {
    // 获取列表
    getSignList() {
      signList(this.queryParams).then(res => {
        if (res.code === '0') {
          // this.loading = false
          this.tableData = res.result.data
          this.total = Number(res.result.total)
        } else {
          // this.loading = false
          this.$message.warning(res.message)
        }
      })
    },
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
    // 导出签到记录
    handleExportRecord() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选中要导出的记录')
        return false
      }
      this.recordIds.length = 0 // 每次都清空为0 避免选中以后 在删除选中 下面数组不变的情况
      this.multipleSelection.forEach((item) => {
        this.recordIds.push(item.id)
      })
      const newArr = [...new Set(this.recordIds)]// 去重
      this.$confirm('确定要批量导出记录吗?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
      .then(() => {
        // 导出记录
        signExport(newArr).then(res => {
          const url = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.className + '_签到记录.zip')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 查看详情
    signItemListFun(params) {
      // this.loadingDetail = true
      signItemList(params).then(res => {
        if (res.code === '0') {
          // this.loadingDetail = false
          this.recordDetails = res.result.data
          this.totalItem = Number(res.result.total)
        } else {
          // this.loadingDetail = false
          this.$message.warning(res.message)
        }
      })
    },
    // time定时器
    getTime() {
      this.ruleForm.startTimeLong = Number(this.ruleForm.startTimeLong) + 1000
      this.ruleForm.startTime = formatDate(this.ruleForm.startTimeLong)
    },
    // 发起签到
    handleSign: _debounce(function() {
      // 获取当前时间
      signValid({ classId: this.queryParams.classId }).then(res => {
        if (res.code === '0') {
          this.ruleForm.startTimeLong = res.result.startTimeLong
          this.ruleForm.startTime = res.result.startTime
          this.timer = setInterval(this.getTime, 1000)
          this.dialogSign = true
        } else if (res.code === 'S1001') {
          this.recordId = res.result.id
          this.attendance = res.result.attendance
          this.dialogSignWarning = true
        } else {
          this.dialogSignError = true
          this.dialogSignErrorMsg = res.message
        }
      })
    }),
    // 关闭发起签到弹窗
    closeDialogSign() {
      clearInterval(this.timer)
    },
    // 发起签到
    handleSubmit: _debounce(function() {
      this.dialogSign = false
      // 二次弹窗消失
      this.dialogSignWarning = false
      this.ruleForm.endTime = formatDate(Number(this.ruleForm.startTimeLong) + this.ruleForm.time)
      signSave(this.ruleForm).then(res => {
        if (res.code === '0') {
          this.$message.success(res.message)
          this.getSignList()
        } else {
          this.$message.warning(res.message)
        }
      })
    }),
    // 结束签到
    handleStopSign: _debounce(function() {
      signStop({ id: this.recordId }).then(res => {
        if (res.code === '0') {
          // this.$message.success('签到已结束')
          this.$message.success(res.message)
          this.ruleForm.startTimeLong = res.result.startTimeLong
          this.ruleForm.startTime = res.result.startTime
          this.timer = setInterval(this.getTime, 1000)
          this.dialogSign = true
        } else {
          this.$message.warning(res.message)
        }
      })
    }),
    // 结束签到
    handleClose(row) {
      this.$confirm('确定要结束签到吗?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
      .then(() => {
        // 结束签到
        signStop({ id: row.id }).then(res => {
          if (res.code === '0') {
            // this.$message.success('签到已结束')
            this.$message.success(res.message)
            this.getSignList()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 签到详情
    handleDetail(row) {
      this.queryItemParams = {
        page: 1,
        size: 10,
        status: 1,
        signInId: row.id
      }
      this.signItemListFun(this.queryItemParams)
      this.dialogDetail = true
    },
    // 关闭详情
    closeDialogDetail() {
      this.activeName = 'first'
      this.recordDetails = []
      this.totalItem = 0
    },
    // 切换选项
    handleClick(tab, event) {
      this.queryItemParams.page = 1
      if (tab.paneName === 'first') {
        this.queryItemParams.status = 1
        this.signItemListFun(this.queryItemParams)
      } else {
        this.queryItemParams.status = 0
        this.signItemListFun(this.queryItemParams)
      }
    },
    // 删除记录
    handleDelete(row) {
      this.$confirm('确定要删除此条记录吗?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
      .then(() => {
        // 删除记录
        signDel({ id: row.id }).then(res => {
          if (res.code === '0') {
            // this.$message.success('删除成功')
            this.$message.success(res.message)
            this.getSignList()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss">
  .sign-manager-wrapper {
    padding: 26px 20px 0;
    .sign-dialog {
      max-height: 685px;
      margin-top: 10vh !important;
      .el-dialog__header {
        padding: 0;
        border: none;
      }
      .el-dialog__body {
        padding-top: 10px;
        .pagination-container {
          padding: 10px 0 0;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
      background-color: #cccccc;
      border-radius: 10px;
  }
  ::-webkit-scrollbar-track-piece {
      background-color: transparent;
      border-radius: 10px;
  }
</style>
