<template>
<div class="app-container app-container-student-manage">
  <div class="teacherList">
    <div class="nav">
      <div class="left">
        <input @keyup.enter="searchHandler"
               placeholder="请输入学生姓名、学号或手机号"
               v-model="search" />
      </div>
      <div class="right">
        <button @click="offLine">强制下线</button>
        <button @click="resetPassword('all')">重置密码</button>
        <!-- <button @click="banchHandler(1)">批量启用</button>
          <button @click="banchHandler(2)">批量禁用</button>-->
        <el-dropdown trigger="click">
          <el-button type="primary"
                     size="small"
                     class="exportTeacher">
            禁用/启用
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a @click="banchHandler(2)">批量禁用</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="banchHandler(1)">批量启用</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <div class="box">
        <el-table :data="tableData.list"
                  ref="multipleTable"
                  stripe
                  border
                  :cell-style="tableCellStyle"
                  @sort-change="sortChange"
                  @selection-change="checkHandler"
                  :header-cell-style="tableHeaderColor"
                  :row-class-name="tableRowClassName">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(tableData.page-1)*tableData.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="identityCode" label="学号" align="center"></el-table-column>
          <el-table-column prop="name"
                           label="姓名"
                           min-width="90"
                           align="left"></el-table-column>
          <el-table-column prop="phone"
                           label="手机号"
                           min-width="112"
                           align="left"></el-table-column>
          <el-table-column prop="joinClassNum"
                           label="加入班级数"
                           min-width="88"
                           align="center"></el-table-column>
          <el-table-column prop="avgScore"
                           label="实训班级平均成绩"
                           min-width="150"
                           sortable="custom"
                           align="center"></el-table-column>
          <el-table-column prop="onlineStatus"
                           min-width="100"
                           align='center'>
            <template slot="header">
              <el-dropdown trigger="click"
                           @command="stateStatus">
                <span class="el-dropdown-link"
                      style='cursor:pointer'> 在线状态<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command='2'
                                    :class='active==2?"active":""'>全部</el-dropdown-item>
                  <el-dropdown-item command='0'
                                    :class='active==0?"active":""'>离线</el-dropdown-item>
                  <el-dropdown-item command='1'
                                    :class='active==1?"active":""'>在线</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <span style='align:center'
                    :class='scope.row.onlineStatus==0?"":"onLine"'>{{scope.row.onlineStatus==0?'离线':'在线'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后登录时间"
                           align="center"
                           sortable="custom"
                           min-width="180"
                           prop="date">
            <template slot-scope="scope">
              <span>{{scope.row.lastLoginTime|timeFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operation"
                           label="账号状态"
                           min-width="110"
                           align="center">
            <template slot-scope="scope">
              <div :class="{operation: true, tesu: scope.row.status ? true : false}">
                <span style='margin-left:25px;'
                      class='notPoint'>{{scope.row.status != 0 ? '已禁用' : '正常' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operation"
                           label="操作"
                           min-width="175"
                           align="center">
            <template slot-scope="scope">
              <div :class="{operation: true, tesu: scope.row.status ? false : true}">
                <span @click="editor(scope,1)">{{scope.row.status == 0 ? '禁用账号' : '启用账号' }}</span>
                <span @click="editor(scope,2)">重置密码</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="student-mange-pagin" v-show="tableData.total>10">
        <Pagination :total="tableData.total"
                    :pageSizes="[10,25,50,100]"
                    @pagination="monitorPagin"
                    :limit="tableData.size"
                    :page="tableData.page"
                    v-show="tableData.total>10"></Pagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  _debounce,
  _throttle
} from '@/common/js/utils.js'
import {
  studentList,
  disableAccunt,
  resetPassword,
  forceOff,
  banch
} from '@/api/student'
export default {
  name: 'StudentManPage',
  data() {
    return {
      tableData: {
        total: 0,
        page: 1,
        size: 10,
        list: [],
        tableData: [],
        orderBy: '',
        asc: '',
        onlineStatus: ''
      },
      search: '',
      oldSearch: '', // 存储老的搜索词
      active: 2
    }
  },
  watch: {
    'search'(newVal) {
      this.tableData.page = 1
      // this.tableSize = 10
      this.studentList()
    }
  },
  methods: {
    searchHandler() {
      if (this.search !== '') {
        this.studentList()
      }
      if (this.search === '' && this.oldSearch !== '') {
        this.studentList()
      }
    },
    // 提示消息
    msgTotal(msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    },
    banchHandler(num) {
      if (this.tableData.tableData.length == 0) {
        this.msgTotal('请先选择学生', 'warning')
        return false
      }
      const passArr = []
      switch (num) {
      case 1:
        this.tableData.tableData.forEach((item, i) => {
          if (item.status == 2) {
            passArr.push(item.id)
          }
        })
        this.$confirm('确认批量启用账号?', '批量启用账号', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            if (passArr.length == 0) {
              this.msgTotal('批量启用成功', 'success')
              return false
            } else {
              const data = {
                userIds: passArr.toString(),
                flag: 0
              }
              banch(data).then(res => {
                if (res.code == 0) {
                  this.msgTotal('批量启用成功', 'success')
                  this.studentList()
                } else {
                  this.$message.error(res.message)
                }
              })
            }
          })
          .catch(() => {})
        break
      default:
        this.$confirm('确认批量禁用账号？禁用后无法登录', '批量禁用', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            this.tableData.tableData.forEach((item, i) => {
              if (item.status == 0) {
                passArr.push(item.id)
              }
            })
            const data = {
              userIds: passArr.toString(),
              flag: 2
            }
            if (passArr.length == 0) {
              this.msgTotal('批量禁用成功', 'success')
              return false
            } else {
              banch(data).then(res => {
                if (res.code == 0) {
                  this.msgTotal('批量禁用成功', 'success')
                  // 禁用成功下线
                  const passArr = {
                    userIds: [],
                    recordIds: []
                  }
                  this.tableData.tableData.forEach((item, i) => {
                    if (item.onlineStatus == 1) {
                      passArr.userIds.push(item.id)
                      passArr.recordIds.push(item.recordId)
                    }
                  })
                  if (passArr.userIds.length !== 0) {
                    forceOff(passArr)
                  }
                  this.studentList()
                } else {
                  this.$message.error(res.message)
                }
              })
              this.studentList()
            }
          })
          .catch(() => {})
      }
    },
    // 点击checkbox事件
    checkHandler(selection) {
      this.tableData.tableData = selection
    },
    // 点击禁用账号
    async disableAccunt(scope) {
      const status = scope.status
      if (status == '0') {
        this.$confirm('确认禁用此账号？禁用后无法登录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            disableAccunt({
              userId: scope.id
            }).then(res => {
              this.msgTotal('禁用成功', 'success')
              scope.status = 2
              // 禁用成功下线
              if (scope.onlineStatus == 1) {
                const passArr = {
                  userIds: [scope.id],
                  recordIds: [scope.recordId]
                }
                forceOff(passArr)
              }
            })
          })
          .catch(() => {})
      } else {
        this.$confirm('确认启用此账号？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            disableAccunt({
              userId: scope.id
            }).then(res => {
              this.msgTotal('启用成功', 'success')
              scope.status = 0
            })
          })
          .catch(() => {})
      }
    },
    // 重置密码
    resetPassword(scope) {
      const passArr = []
      if (scope == 'all') {
        if (this.tableData.tableData.length == 0) {
          this.msgTotal('请先选择学生', 'warning')
          return false
        }
        this.tableData.tableData.forEach((item, i) => {
          passArr.push(item.id)
        })
      } else {
        passArr.push(scope.row.id)
      }
      this.$confirm('确认重置密码？重置后密码为手机号后六位?', '批量重置密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          resetPassword({
            userIds: passArr.toString()
          }).then(res => {
            this.$message({
              type: 'success',
              message: passArr.length > 1 ? '批量重置密码成功' : '重置密码成功!'
            })
            this.$refs.multipleTable.clearSelection()
          })
        })
        .catch(() => {})
    },
    // 表格编辑
    editor(scope, num) {
      const row = scope.row
      switch (num) {
      case 1:
        // 启用账号
        this.disableAccunt(scope.row)
        break
      case 2:
        // 重置密码
        this.resetPassword(scope)
        break
      }
    },
    // 日期排序
    sortChange(column) {
      if (column.prop == 'date') {
        this.tableData.orderBy = 'time'
        if (column.order == 'ascending') {
          this.tableData.asc = 'true'
        } else if (column.order == 'descending') {
          this.tableData.asc = 'false'
        } else {
          this.tableData.asc = ''
          this.tableData.orderBy = ''
        }
      } else {
        this.tableData.orderBy = 'score'
        if (column.order == 'ascending') {
          this.tableData.asc = 'true'
        } else if (column.order == 'descending') {
          this.tableData.asc = 'false'
        } else {
          this.tableData.asc = ''
          this.tableData.orderBy = ''
        }
      }
      this.search = ''
      this.studentList()
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // 监听分页组件触发事件
    monitorPagin(obj) {
      if (obj.limit !== this.tableData.size) {
        this.tableData.page = 1
      } else {
        this.tableData.page = obj.page
      }
      this.tableData.size = obj.limit
      this.studentList()
    },
    // 在线离线状态切换
    stateStatus(command) {
      this.tableData.page = 1
      this.active = command
      let booleanStatus = command
      if (booleanStatus == 2) {
        booleanStatus = ''
      }
      this.tableData.onlineStatus = booleanStatus
      this.search = ''
      this.studentList()
    },
    // 修改table header的背景色
    tableHeaderColor({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (rowIndex === 0) {
        return 'background-color: rgba(250,252,254,1);color: #333;font-weight: 600;border-right-color:transparent;'
      }
    },
    // 修改 table cell边框的背景色
    tableCellStyle() {
      return 'border-color:rgba(237,237,237,1);border-right-color:transparent;'
    },
    // 强制下线
    offLine() {
      if (this.tableData.tableData.length == 0) {
        this.msgTotal('请先选择学生', 'warning')
        return false
      }
      const passArr = {
        userIds: [],
        recordId: []
      }
      this.tableData.tableData.forEach((item, i) => {
        if (item.onlineStatus == 1) {
          passArr.userIds.push(item.id)
          passArr.recordId.push(item.recordId)
        }
      })
      const data = {
        userIds: passArr.userIds,
        recordIds: passArr.recordId
      }
      this.$confirm('确定下线这些学生, 是否继续?', '强制下线', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          if (passArr.userIds.length == 0) {
            this.msgTotal('批量强制下线成功', 'success')
          } else {
            forceOff(data).then(res => {
              if (res.code == 0) {
                this.msgTotal('批量强制下线成功', 'success')
                this.studentList()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
        .catch(() => {})
    },
    studentList: _debounce(function () {
        const {
          page,
          size,
          asc,
          orderBy,
          onlineStatus
        } = this.tableData
        const data = {
          customerId: localStorage.getItem('customerId'),
          page,
          size,
          asc,
          orderBy,
          onlineStatus,
          keyWrods: this.search
        }
        studentList(data).then(res => {
          if (res.code == '0') {
            const dataList = res.result
            this.tableData.total = parseInt(dataList.total)
            this.tableData.size = dataList.size
            this.tableData.list = dataList.data
          } else {
            this.msgTotal(res.message, 'error')
          }
        })
      },
      500)
  },
  filters: {
    timeFormat: function (ts) {
      if (ts == 0) {
        return '-'
      } else {
        const time = new Date(Number(ts))
        const y = time.getFullYear()
        const m = time.getMonth() + 1
        const d = time.getDate()
        const h = time.getHours()
        const mm = time.getMinutes()
        const s = time.getSeconds()
        return (
          buZero(y) +
          '-' +
          buZero(m) +
          '-' +
          buZero(d) +
          ' ' +
          buZero(h) +
          ':' +
          buZero(mm) +
          ':' +
          buZero(s)
        )
      }
    }
  },
  mounted() {
    this.studentList()
  }
}

function buZero(num) {
  return num > 9 ? num : '0' + num
}
</script>

<style lang="scss" scoped>
.app-container.app-container-student-manage{
  height: calc(100vh - 74px - 40px);
  padding: 0 20px;
}
.active {
    color: #36CEA9;
}
.teacherList {
    height: 100%;
    .nav {
        display: flex;
        justify-content: space-between;
        height: 80px;
        line-height: 80px;
        padding: 0 0 0 26px;
        box-sizing: border-box;
        color: rgba(51, 51, 51, 1);
        font-size: 16px;

        .left {
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .right {
            display: flex;
            align-items: center;
            padding-right: 25px;
            .exportTeacher {
                font-size: 13px;
                position: absolute;
            }
            .el-dropdown {
                font-size: 15px;
                width: 100px;
                height: 33px;
                margin-right: 16px;
            }
        }
        button {
            width: 100px;
            height: 32px;
            background: #36cea9;
            border-radius: 3px;
            border: 1px solid #36cea9;
            outline: none;
            color: #fff;
            align-self: center;
            margin-right: 16px;
            cursor: pointer;
            font-size: 14px;
        }

        button.tesu {
            background: rgba(255, 255, 255, 1);
            color: #36cea9;
        }
        button.download {
            margin-right: 0;
        }

        input {
            margin-right: 28px;
            padding-left: 10px;
            width: 230px;
            height: 33px;
            outline: none;
            border-radius: 6px;
            border: 1px solid #bbb;
            &:hover {
                border: 1px solid #36cea9;
                transition: 0.5s all linear;
            }
            &:focus {
                border: 1px solid #36cea9;
                transition: 0.5s all linear;
            }
            &::-webkit-input-placeholder {
                font-size: 13px;
                line-height: 30px;
                color: #aaa;
            }
        }
    }
    .content {
        height: calc(100% - 150px);
        // padding: 0 26px 112px ;
        .box {
            height: 100%;
            padding: 0 0 0 26px;
            margin-right: 25px;
            overflow: auto;

            .operation {

                span {
                    cursor: pointer;
                    color: #36cea9;
                    margin-right: 20px;
                    font-size: 14px;
                    &.notPoint {
                        cursor: default;
                    }
                }
            }
            .tesu {
                span:nth-child(1) {
                    color: red;
                }
            }
        }
        .student-mange-pagin{
          .pagination-container{
            padding: 10px 16px 10px;
          }
        }
    }
    .reTeacherAccunt {
        margin: 0;
        padding: 0;
        list-style: none;
        overflow: hidden;
        display: float;
        li {
            float: left;
            margin-right: 15px;
            margin-bottom: 10px;
        }
    }
    .publicPaging {
        width: 100%;
        position: absolute;
        bottom: 0;
    }
    /deep/.el-table .el-table__header-wrapper th {
        height: auto;
    }
}
.onLine {
    color: #36cea9;
}
</style>
