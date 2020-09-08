<template>
<div class="app-container app-container-teacher-manage">
  <div class="teacherList">
    <div class="nav">
      <div class="left">
        <input @keyup.enter="clickSearch"
               placeholder="请输入教师姓名或手机号"
               v-model='search'>
      </div>
      <div class="right">
        <button @click="addTeacher">新增教师</button>
        <el-dropdown trigger="click">
          <el-button type="primary"
                     size="small"
                     class='exportTeacher'>
            导入教师<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="/data/导入教师模板.xlsx"
                 download="导入教师模板.xlsx">下载模板</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-upload action="#"
                         :http-request="uploadFile"
                         :show-file-list="false"
                         :before-upload="beforeUpload"
                         accept=".xlsx, .xls">
                导入教师
              </el-upload>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button class="anyOperation"
                @click="anyOperation()">重置密码</button>
        <el-dropdown trigger="click">
          <el-button type="primary"
                     size="small"
                     class='exportTeacher'>
            禁用/启用<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a @click="anyResetAccunt()">批量禁用</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="anyQiyongAccunt()">批量启用</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <div class="box">
        <el-table :data="tableData"
                  stripe
                  border
                  @selection-change="checkSelect"
                  :cell-style="tableCellStyle"
                  :header-cell-style="tableHeaderColor"
                  :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(tablePage-1)*tableSize+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="teacherName"
                           label="姓名"
                           min-width="100"
                           align="left"></el-table-column>
          <el-table-column prop="phone"
                           label="手机号"
                           align="left"></el-table-column>
          <el-table-column prop="startClassNum"
                           label="授课班级数"
                           min-width="90"
                           align="center"></el-table-column>
          <el-table-column prop="avgScore"
                           label="实训班级平均成绩"
                           width="200"
                           align="center"></el-table-column>
          <el-table-column prop="operation"
                           label="账号状态"
                           min-width="110"
                           align="center">
            <template slot-scope="scope">
              <div :class="{operation: true, tesu: scope.row.status ? true : false}">
                <span style='margin-left:18px;'
                      class='notPoint'
                      :class='scope.row.status == 0 ?"":"red"'>{{scope.row.status == 0 ? '正常' : '已禁用' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operation"
                           label="操作"
                           align="center"
                           width="260">
            <template slot-scope="scope">
              <div :class="{operation: true, curpstatus: true, tesu: scope.row.status ? false : true}">
                <!-- <span @click="teacherEdit(scope.$index, scope.row)">编辑</span> -->
                <span @click="teacherEdit(scope.$index, scope.row)">编辑</span>
                <span @click="disableAccunt(scope.$index, scope.row)"
                      :class='scope.row.status == 0 ?"red":""'>{{scope.row.status == 0 ? '禁用账号' : '启用账号' }}</span>
                <span @click="operation(scope.$index, scope.row)">重置密码</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="teacher-mange-pagin" v-if="personTotal > 10">
        <Pagination :total="personTotal"
              :pageSizes="[10,25,50,100]"
              @pagination="monitorPagin"
              :limit='tableSize'
              :page='tablePage'
              v-show='personTotal>10'></Pagination>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog :close-on-click-modal="false"
               class='common-small'
               title="新增教师"
               destroy-on-close
               :visible.sync="addTeacherShow"
              >
      <Newpop @quxiao="addTeacherClose"></Newpop>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog :close-on-click-modal="false"
               class='common-small'
               destroy-on-close
               title="编辑教师"
               :visible.sync="editTeacherShow"
              >
      <TeacherEdit @quxiao="editTeacherClose"
                   :teacherData="teacherData"></TeacherEdit>
    </el-dialog>
    <!-- 重复教师账号弹框 -->
    <el-dialog title="以下手机号已存在"
               :close-on-click-modal="false"
               :visible.sync="teacherListShow"
               width="25%"
               destroy-on-close>
      <ul class="reTeacherAccunt">
        <li v-for="(item, index) in reTeacherAccunt"
            :key="index">{{item}}</li>
      </ul>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {
  disableAccunt,
  banch,
  forceOff
} from '@/api/student'
import Newpop from '../teacherManage/component/Newpop'
import TeacherEdit from '../teacherManage/component/TeacherEdit'
import {
  queryTeacherList,
  importTeacher,
  resetPassword,
  passwordAnyReset
} from '@/api/tdb'

import {
  cos
} from '@/common/js/cos.js'
import {
  _debounce,
  _throttle
} from '@/common/js/utils.js'
export default {
  name: 'TeacherManPage',
  components: {
    Newpop,
    TeacherEdit
  },
  data() {
    return {
      tableData: [],
      teacherIdArr: [],
      teacherIdStr: '',
      teacherId: '', // 用来存储教师ID
      teacherData: {}, // 用来存储某一个教师的数据
      addTeacherShow: false, // 是否展示新增教师弹窗
      editTeacherShow: false, // 是否展示编辑教师弹窗
      resetPassWordShow: false, // 是否展示重置密码弹框
      teacherListShow: false, // 是否展示重复的教师账号
      fileUrl: '',
      search: '', // 搜索词
      oldSearch: '', // 存储老的搜索词
      pageShow: false,
      personTotal: 0, // 个人成绩数据总条数
      reTeacherAccunt: [], // 存储重复教师账号
      // newPwd: '', // 存储手机后六位密码
      objData: {},
      tableSize: 10,
      tablePage: 1
    }
  },
  watch: {
    'search'(newVal) {
      this.tablePage = 1
      // this.tableSize = 10
      this.queryTeacherList()
    }
  },
  methods: {
    // 导入模板之前
    beforeUpload(e) {
      const extension = e.name.split('.')[1]
      if ('xls/xlsx'.includes(extension)) {
        return true
      } else {
        this.$message.warning('请上传xls/xlsx文件')
        return false
      }
    },
    // 提示消息
    msgTotal(msg, type) {
      this.$message({
        message: msg,
        type: type
      })
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
      if (obj.limit !== this.tableSize) {
        this.tablePage = 1
        this.tableSize = obj.limit
        this.queryTeacherList(this.search, this.tablePage, this.tableSize)
        return
      }
      this.tableSize = obj.limit
      this.tablePage = obj.page
      this.queryTeacherList(this.search, this.tablePage, this.tableSize)
    },
    // 导入模板
    async uploadFile(e) {
      const self = this
      const res = await cos(e, self, '', function() {})
      this.importTeacher(res)
    },
    // 导入教师
    async importTeacher(url) {
      const res = await importTeacher({
        customerId: localStorage.getItem('customerId'),
        filePath: url
      })
      if (res.code !== '0') {
        this.$message.warning(res.message)
        if (res.message === '下列手机号已存在') {
          this.reTeacherAccunt = res.result
          this.teacherListShow = true
        }
      } else {
        this.$message.success(res.message)
      }
      this.queryTeacherList()
    },
    // 点击搜索按钮
    clickSearch() {
      // if (this.search !== '') {
      //   this.queryTeacherList(this.search)
      //   this.oldSearch = this.search
      // }
      // if (this.search === '' && this.oldSearch !== '') {
      //   this.queryTeacherList(this.search)
      //   this.oldSearch = this.search
      // }
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
    // 点击复选框
    checkSelect(data) {
      // console.log(data)
      this.teacherId = data.map((item, index) => {
        return item.teacherId
      }).join(',')
    },
    // 教师列表查询
    queryTeacherList: _debounce(
      async function (search, page, size) {
          const res = await queryTeacherList({
            page: this.tablePage || 1,
            size: this.tableSize || 10,
            keyWrods: this.search || '',
            customerId: localStorage.getItem('customerId')
          })
          if (res.code === '101') {
            this.$message.warning(res.message)
          } else {
            this.personTotal = Number(res.result.total)
            this.tableData = res.result.data
          }
        },
        500),
    // 点击新增教师显示弹框
    addTeacher() {
      this.addTeacherShow = true
    },
    // 关闭新增教师弹框
    addTeacherClose(isTrue) {
      this.addTeacherShow = false
      if (isTrue) {
        this.queryTeacherList()
      }
    },
    // 点击编辑执行的方法，显示弹框
    teacherEdit(index, data) {
      this.teacherData = Object.assign({}, data)
      this.editTeacherShow = true
    },
    // 关闭编辑教师弹框
    editTeacherClose(isTrue) {
      this.editTeacherShow = false
      if (isTrue) {
        this.queryTeacherList()
      }
    },
    // 重置密码
    operation(index, row) {
      // this.newPwd = row.phone.slice(5)
      this.teacherId = row.teacherId
      this.$confirm('确认重置密码？重置后密码为手机号后六位？', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await resetPassword({
        //   userId: this.teacherId,
        //   newPwd: this.newPwd
        // })
        const res = await passwordAnyReset({
          userIds: this.teacherId
        })
        if (res.code !== '0') {
          this.$message.warning(res.message)
        } else {
          this.$message.success('密码已重置为手机号后六位！')
        }
      }).catch(() => {})
    },
    // 批量重置密码
    anyOperation() {
      if (this.teacherId === '') {
        this.$message.warning('请先选择教师')
        return
      }
      this.$confirm('确认批量重置密码？重置后密码为手机号后六位？', '批量重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await passwordAnyReset({
          userIds: this.teacherId
        })
        if (res.code !== '0') {
          this.$message.warning(res.message)
        } else {
          this.$message.success('批量重置密码成功')
          this.queryTeacherList()
        }
      }).catch(() => {})
    },
    // 批量禁用
    anyResetAccunt() {
      if (this.teacherId === '') {
        this.$message.warning('请先选择教师')
        return
      }
      this.$confirm('确认批量禁用账号? 禁用后无法登录', '批量禁用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          userIds: this.teacherId,
          flag: 2
        }
        if ((this.teacherId.split(',')).length == 0) {
          this.msgTotal('批量禁用成功', 'success')
          return false
        } else {
          banch(data).then(res => {
            if (res.code == 0) {
              this.msgTotal('批量禁用成功', 'success')
              this.queryTeacherList()
            } else {
              this.$message.error(res.message)
            }
          })
          this.studentList()
        }
      }).catch(() => {})
    },
    // 批量启用
    anyQiyongAccunt() {
      if (this.teacherId === '') {
        this.$message.warning('请先选择教师')
        return
      }
      this.$confirm('确认批量启用账号?', '批量启用账号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.teacherId.length == 0) {
          this.msgTotal('批量启用成功', 'success')
          return false
        } else {
          const data = {
            userIds: this.teacherId,
            flag: 0
          }
          banch(data).then(res => {
            if (res.code == 0) {
              this.msgTotal('批量启用成功', 'success')
              this.queryTeacherList()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }).catch(() => {})
    },
    // 单个禁用/启用
    async disableAccunt(index, row) {
      this.teacherId = row.teacherId
      // console.log(row)
      this.$confirm(row.status === 2 ? '确认启用此账号？' : '确认禁用此账号？禁用后无法登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.status == 2) {
          disableAccunt({
            userId: this.teacherId
          }).then(res => {
            this.msgTotal('启用成功', 'success')
            row.status = 0
          })
        } else {
          disableAccunt({
            userId: this.teacherId
          }).then(res => {
            this.msgTotal('禁用成功', 'success')
            row.status = 2
          })
        }
      }).catch(() => {})
    }
  },
  created() {
    this.queryTeacherList()
  }
}
</script>
<style lang="scss" scoped>
.app-container.app-container-teacher-manage{
  height: calc(100vh - 74px - 40px);
  padding: 0 20px;
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
            background: #36CEA9;
            border-radius: 3px;
            border: 1px solid #36CEA9;
            outline: none;
            color: #fff;
            align-self: center;
            margin-right: 16px;
            cursor: pointer;
            font-size: 14px;
        }

        button.tesu {
            background: rgba(255, 255, 255, 1);
            color: #36CEA9;
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
                border: 1px solid #36CEA9;
                transition: 0.5s all linear;
            }
            &:focus {
                border: 1px solid #36CEA9;
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
                    color: #36CEA9;
                    margin-right: 20px;
                    font-size: 14px;
                    &.notPoint {
                        cursor: default;
                    }
                    &.red {
                        color: red!important;
                    }
                }
            }
            .curpstatus {
              span{
                cursor: pointer;
              }
            }
            .tesu {
                .red {
                    color: red!important;
                }
            }
        }
        .teacher-mange-pagin{
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
}
</style>
