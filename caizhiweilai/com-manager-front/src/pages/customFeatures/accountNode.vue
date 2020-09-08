<template>
    <div class="accountNodeWarper">
      <div class="accountNodeTop">
         <div class="clickNodeList" @click="clickNodeList">
            <i class="el-icon-caret-left"></i><span>返回账套列表</span>
          </div>
          <div class="queryBtn">
              <el-input
                  class="accountInput"
                  placeholder="搜索节点"
                  prefix-icon="el-icon-search"
                  v-model="pageParams.keyWrods">
              </el-input>
              <button @click="addAccountNode" class="btn addNode">新增节点</button>
              <button @click="batchdelAccountDel" class="btn batchDel" >批量删除</button>
          </div>
      </div>
      <!-- 列表 -->
      <el-table
      border
      highlight-current-row
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top:20px;"
      @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
      width="60"
      type="index"
      align="center"
      label="序号">
        <template slot-scope="scope">
          <span>{{(pageParams.page - 1) * pageParams.size + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
      width="160"
      align="center"
      prop="nodeName"
      label="节点名称">
      </el-table-column>
      <el-table-column
      align="center"
      prop="description"
      label="描述">
      </el-table-column>
      <el-table-column
      align="center"
      prop="nodeUrl"
      label="跳转路径">
      </el-table-column>
      <el-table-column
      width="100"
      align="center"
      label="操作">
        <template slot-scope="scope">
          <el-link type="warning" @click="editAccountNode(scope.row)" style="padding-right:5px;" size="small">编辑</el-link>
          <el-link type="warning" @click="delAccountNode(scope.row)" size="small">删除</el-link>
        </template>
      </el-table-column>
      </el-table>
      <pagination
      :total="total"
      v-show="total > 10"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.size"
      :pageSizes="[10,25,50,100]"
      @pagination="accountNodeListt"
    />
     <!-- 新增节点/修改节点 -->
    <el-dialog :title="dialogType==='编辑'?'编辑节点':'新增节点'" :close-on-click-modal='false' :before-close="handleDialogClose" :modal-append-to-body='false' :visible.sync="addAccountNodeDialog" width="40%">
        <el-form :model="accountNodeForm" ref="accountNodeForm" :rules="rules" class="el-form--label-left" label-width="110px">
          <el-form-item label="节点名称:" prop="nodeName">
            <el-input autocomplete="off" v-model.trim="accountNodeForm.nodeName" placeholder="请输入节点名称" size="small"></el-input>
          </el-form-item>
          <el-form-item label="跳转地址" prop="nodeUrl">
            <el-input autocomplete="off" v-model.trim="accountNodeForm.nodeUrl" placeholder="请输入跳转地址" size="small"></el-input>
          </el-form-item>
          <el-form-item label="详细描述:" prop="description">
            <el-input type="textarea" autocomplete="off" maxlength="500"  show-word-limit size="small" rows="2" v-model="accountNodeForm.description" placeholder="请输入节点描述"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot">
          <!--  v-preventReClick -->
          <el-button @click="closes" size="small">取消</el-button>
          <el-button type="info" @click="determine('accountNodeForm')" class="Determine" size="small">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { accountNodeList, addAccountNode, editAccountNode, delAccountNode, batchDel } from '@/api/accountNode'
import { deepClone, _vueDebounce } from '@/common/js/utils'
export default {
  data() {
    return {
      pageParams: {
        page: 1,
        size: 10,
        keyWrods: ''
      },
      total: 0,
      tableData: [],
      accountNodeForm: {
        nodeName: '',
        description: '',
        nodeUrl: ''
      },
      dialogType: '新增',
      addAccountNodeDialog: false,
      multipleSelection: [],
      nodeId: '',
      ids: [],
       rules: {
        nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
        nodeUrl: [{ required: true, message: '请输入跳转地址', trigger: 'blur' }],
        description: [{ required: true, message: '请输入节点描述', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.accountNodeListt()
  },
  watch: {
    'pageParams.keyWrods': {
       handler(newVal, oldVal) {
         this.getSearchList()
      },
      deep: true
    }
  },
  methods: {
    // 键盘抬起搜索客户
    getSearchList: _vueDebounce('accountNodeListt', 500),
    // 返回账套列表
    clickNodeList() {
      this.$emit('accountList')
    },
    // 账套节点列表
    accountNodeListt() {
      accountNodeList(this.pageParams).then(res => {
        if (res.code === '0') {
          this.tableData = res.result.data
          this.total = Number(res.result.total)
        } else {
          this.$message({
              message: res.message,
              type: 'warning'
          })
        }
      })
    },
    // 新增账套节点
    addAccountNode() {
      if (this.$refs.accountNodeForm != undefined) {
        this.$nextTick(() => {
          this.$refs.accountNodeForm.resetFields()
        })
      }
      this.dialogType = '新增'
      this.addAccountNodeDialog = true
    },
    // 编辑节点
    editAccountNode(item) {
      // console.log(item)
      this.nodeId = item.id
      this.dialogType = '编辑'
      this.addAccountNodeDialog = true
      this.accountNodeForm = deepClone(item)
    },
    determine(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const isEdit = this.dialogType == '编辑'
          if (isEdit) {
            editAccountNode({
              id: this.nodeId,
              nodeName: this.accountNodeForm.nodeName,
              description: this.accountNodeForm.description,
              nodeUrl: this.accountNodeForm.nodeUrl
            }).then(res => {
              if (res.code === '0') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.accountNodeListt()
                this.addAccountNodeDialog = false
              } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
              }
            })
          } else {
            addAccountNode(this.accountNodeForm).then(res => {
              if (res.code === '0') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.accountNodeListt()
                this.addAccountNodeDialog = false
              } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
              }
            })
          }
        }
      })
    },
    // 删除节点
    delAccountNode(item) {
      this.$confirm('确定要删除吗?', '警告', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        confirmButtonClass: 'el-button--medium',
        cancelButtonClass: 'el-button--medium',
        type: 'warning'
      }).then(async() => {
        const res = await delAccountNode({ id: item.id })
        if (res.code === '0') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.accountNodeListt()
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 批量删除
    batchdelAccountDel() {
      if (this.multipleSelection.length === 0) {
          this.$message({
              message: '请先选中要删除的节点',
              type: 'warning'
          })
          return
      }
      this.ids.length = 0
      this.multipleSelection.forEach((item, index) => {
        this.ids.push(item.id)
      })
      // console.log(this.ids)
      this.$confirm('确定要删除吗?', '警告', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        confirmButtonClass: 'el-button--medium',
        cancelButtonClass: 'el-button--medium',
        type: 'warning'
      }).then(async () => {
        const id = this.ids.join(',')
        const res = await batchDel({ ids: id })
        if (res.code === '0') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.accountNodeListt()
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 关闭dialog
    handleDialogClose() {
      this.addAccountNodeDialog = false
    },
    closes() {
      this.addAccountNodeDialog = false
    },
    // 操作复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
.accountNodeWarper{
  .accountNodeTop{
    display: -webkit-flex;
    justify-content: space-between;
    margin-top: 20px;
    .clickNodeList{
      cursor: pointer;
    }
    .queryBtn{
      .btn{
        border-radius: 2px;
        height: 32px;
        cursor: pointer;
        font-size:14px;
        outline: none;
      }
      .addNode{
        margin-left: 10px;
        margin-right: 10px;
        background: #414D65;
        color: #fff;
        border: none;
      }
      .batchDel{
        color: #333;
        background: #fff;
        border: 1px #ccc solid;
      }
    }
  }
  .foot {
    text-align: center;
    .Determine {
      background: #414d65;
    }
  }
}
</style>
<style lang="scss">
.accountNodeWarper .el-table{
  border-collapse:collapse;
  border-spacing:1;
  border-spacing:0;
  margin-top: 20px;
}
// .accountNodeWarper .el-table th{
//   background:#E5EAF4;
// }
.accountInput{
    width: 300px;
    height: 32px;
    .el-input__inner{
        height:32px;
    }
    .el-input__icon{
        line-height: 32px;
    }
}
</style>
