<template>
  <div class="accountWarper">
    <div class="accountNav">
        <el-input
            class="accountInput"
            placeholder="搜索账套"
            prefix-icon="el-icon-search"
            v-model="pageParams.keyWrods">
        </el-input>
        <button @click="clickAccountNodeSet" class="btn">账套节点设置</button>
        <button @click="addAcount" class="btn">添加账套</button>
        <button @click="delAcount('delAny')" class="btn">删除账套</button>
        <button @click="showWeight('set')" class="btn">设置权重</button>
        <button @click="showWeight('get')" class="btn">获取权重</button>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      :height="total > 10 ? 'calc(100% - 135px)' : 'calc(100% - 87px)'"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @filter-change="filterChange"
      @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
      align="center"
      width="180"
      prop="caseName"
      label="账套名称">
      </el-table-column>
      <el-table-column
      align="center"
      width="200"
      prop="taxLayerNo"
      label="税号">
      </el-table-column>
      <el-table-column
      align="center"
      prop="taxLayerType"
      label="纳税人资格">
      <template slot-scope="scope">
          <div v-if="scope.row.taxLayerType=='001'">增值税一般纳税人</div>
          <div v-if="scope.row.taxLayerType=='101'">小规模纳税人</div>
      </template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="industry"
      label="所属行业">
      </el-table-column>
      <el-table-column
      align="center"
      prop="nodeNum"
      label="任务数量">
      </el-table-column>
      <el-table-column
      align="center"
      prop="monthNum"
      label="账期跨度(单位:月)">
      </el-table-column>
      <!-- 账套难度 -->
      <el-table-column
      align="center"
      label="账套难度"
      prop="difficulty"
      :filter-multiple="false"
      :column-key="'difficulty'"
      :filters="[{ text: '初级', value: 'SIMPLE' }, { text: '中级', value: 'MIDDLE' }, { text: '高级', value: 'SENIOR' }]">
      <template slot-scope="scope">
          <div v-if="scope.row.difficulty=='SIMPLE'">初级</div>
          <div v-if="scope.row.difficulty=='MIDDLE'">中级</div>
          <div v-if="scope.row.difficulty=='SENIOR'">高级</div>
      </template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="caseModel"
      :filter-multiple="false"
      :column-key="'caseModel'"
      :filters="[{ text: '单人全岗', value: 'SINGLE' }, { text: '多人多岗', value: 'MULTI' }]"
      label="账套类型">
      <template slot-scope="scope">
        <div v-if="scope.row.caseModel=='SINGLE'">单人全岗</div>
        <div v-if="scope.row.caseModel=='MULTI'">多人多岗</div>
      </template>
      </el-table-column>
      <el-table-column
      width="173"
      align="center"
      label="操作">
      <!-- slot-scope="scope" -->
        <template slot-scope="scope">
          <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
            <el-link type="warning" size="small" @click="editCase(scope.row)">编辑账套</el-link>
            <el-link type="warning" size="small" @click="delAcount('delOne', scope.row.id)" >删除账套</el-link>
            <el-link type="warning" size="small" @click="setstep(scope.row)">设置步骤</el-link>
            <el-link type="warning" size="small" @click="allFunction('setAnswer', scope.row)">设置答案</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :total="total"
      v-show="total > 10"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.size"
      :pageSizes="[10,25,50,100]"
      @pagination="accountList"
    />
    <!-- 添加账套/修改账套弹框 -->
    <el-dialog :title="dialogType==='编辑'?'编辑账套':'添加账套'" :close-on-click-modal='false' :before-close="handleDialogClose" :modal-append-to-body='false' :visible.sync="addAccountDialog" width="40%">
      <el-form :model="accountForm" ref="accountForm" :rules="rules" class="el-form--label-left contents" label-width="110px">
        <el-form-item label="账套名称:" prop="caseName">
          <el-input autocomplete="off" v-model.trim="accountForm.caseName" placeholder="请输入账套名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="岗位模式" prop="caseModel">
          <el-checkbox label="单人全岗" @change="action(0)" v-model="single"></el-checkbox>
          <el-checkbox label="多人多岗" @change="action(1)" v-model="many"></el-checkbox>
        </el-form-item>
        <el-form-item label="案例难度:" prop="difficulty">
          <el-radio-group v-model="difficultyRadio">
            <el-radio :label="item.name" v-for="(item,index) in radio" :key="index" @change="level(item.name)">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="foot">
        <!--  v-preventReClick -->
        <el-button @click="closes" size="small">取消</el-button>
        <el-button type="info" @click="determine('accountForm')" class="Determine" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加设置/获取权重弹框 -->
    <el-dialog :title="weightType==='set'?'设置权重':'获取权重'" :before-close="closeWeight" :close-on-click-modal='false' :modal-append-to-body='false' :visible.sync="weightDialog" width="30%">
      <el-form :model="weightForm" label-width="120px">
        <el-form-item label="纳税性质：">
          <el-radio-group v-model="weightForm.taxLayerType" @change="NSpeople">
            <el-radio :label="'001'">增值税一般纳税人</el-radio>
            <el-radio :label="'101'">小规模纳税人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会计制度：">
            <el-select v-model="weightForm.accountingSystem" label-width="120px" v-show="weightForm.taxLayerType == '001'">
              <el-option label="企业会计准则2017版" value="2017"></el-option>
              <el-option label="小企业会计准则2013版" value="2013"></el-option>
            </el-select>
            <el-select v-model="weightForm.accountingSystem" label-width="120px" v-show="weightForm.taxLayerType != '001'">
              <el-option label="小企业会计准则2013版" value="2013"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div class="foot" >
        <el-button @click="closeWeight" size='medium'>取消</el-button>
        <el-button type="info" class="Determine" size='medium' @click='allFunction(weightType)'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { accountList, addAccount, editAccount, deleteAccount } from '@/api/accountNode'
import { deepClone, _vueDebounce } from '@/common/js/utils'
import { yzfweightdata } from '@/api/weightAnswer'
export default {
    data() {
      return {
        pageParams: {
          page: 1,
          size: 10,
          keyWrods: '',
          difficulty: '', // 账套难度
          caseModel: ''// 账套类型
        },
        total: 0,
        addAccountDialog: false,
        accountForm: {
          caseName: '',
          caseModel: 'SINGLE',
          difficulty: 'SIMPLE'
        },
        // multipleSelection: [],
        single: true,
        many: false,
        difficultyRadio: 'SIMPLE',
        radio: [
          {
            name: 'SIMPLE',
            label: '初级'
          },
          {
            name: 'MIDDLE',
            label: '中级'
          },
          {
            name: 'SENIOR',
            label: '高级'
          }
        ],
        rules: { caseName: [{ required: true, message: '请输入账套名称', trigger: 'blur' }] },
        dialogType: '新增',
        tableData: [],
        accountId: '',
        weightType: 'set', // 根据weightType类型，打开弹框
        weightDialog: false, // 判断权重弹框是否打开
        weightForm: {
          taxLayerType: '001',
          accountingSystem: '2017'
        },
        deleteAccountId: '' // 用来存储删除账套的ids
      }
    },
    watch: {
      'pageParams.keyWrods': {
        handler(newVal, oldVal) {
          this.pageParams.page = 1
          this.getSearchList()
        },
        deep: true
      }
    },
    mounted() {
      this.accountList()
    },
    methods: {
      // 删除账套
      delAcount(type, id) {
        // type为delOne说明是单个删除
        if (type === 'delOne') {
          // 将id放到数组中
          this.deleteAccountId = id
        } else {
        // 批量删除
          if (this.deleteAccountId.length === 0) {
            this.$message.warning('请先选择要删除的账套')
            return
          }
        }
        this.$confirm('确定要删除吗?', '警告', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          confirmButtonClass: 'el-button--medium',
          cancelButtonClass: 'el-button--medium',
          type: 'warning'
        }).then(async() => {
          // 执行删除账套接口
          const res = await deleteAccount('ids=' + this.deleteAccountId)
          if (res.code === '0') {
            this.$message.success('删除账套成功')
            this.deleteAccountId = ''
            this.accountList()
          } else {
            this.$message.warning(res.message)
          }
        }).catch(() => {})
      },
      // 设置权重、设置答案、获取权重的处理都在这里
      async allFunction(type, data) {
        if (type === 'set') {
          // 设置权重
          this.$emit('setWeightAnswer', 'weight', this.weightForm)
        } else if (type === 'setAnswer') {
          // 设置答案
          this.$emit('setWeightAnswer', 'Answer', data)
        } else if (type === 'get') {
          // 获取权重
          const formDataStr = 'taxLayerType=' + this.weightForm.taxLayerType + '&accountingSystem=' + this.weightForm.accountingSystem
          const res = await yzfweightdata(formDataStr)
          if (res.code === '0') {
            this.$message.success('获取权重成功')
            this.weightDialog = false
          } else {
            this.$message.warning(res.message)
          }
        }
      },
      // 切换纳税人性质
      NSpeople() {
        if (this.weightForm.taxLayerType === '101') {
          this.weightForm.accountingSystem = '2013'
        } else if (this.weightForm.taxLayerType === '001') {
          this.weightForm.accountingSystem = '2017'
        }
      },
      // 点击设置权重和获取权重按钮
      showWeight(weightType) {
        this.weightType = weightType
        this.weightDialog = true
      },
      // 关闭权重弹框
      closeWeight() {
        this.weightDialog = false
        this.weightForm = {
          taxLayerType: '001',
          accountingSystem: '2017'
        }
      },
      // 键盘抬起搜索客户
      getSearchList: _vueDebounce('accountList', 500),
      // 列表根据选项进行筛选
      filterChange(filters) {
        if (filters.difficulty) {
          // this.pageParams.caseModel = ''
          this.pageParams.page = 1
          this.pageParams.difficulty = filters.difficulty[0]
          this.accountList()
          return false
        }
        if (filters.caseModel) {
          // this.pageParams.difficulty = ''
          this.pageParams.page = 1
          this.pageParams.caseModel = filters.caseModel[0]
          this.accountList()
        }
      },
      // 查询账套
      accountList() {
        accountList(this.pageParams).then(res => {
          if (res.code === '0') {
            this.tableData = res.result.data
            this.total = Number(res.result.total)
            // 回table顶部
            this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
      },
      // 账套节点设置
      clickAccountNodeSet() {
        this.$emit('clickAccountSetNode')
      },
      // 添加账套
      addAcount() {
        this.dialogType = '新增'
        this.addAccountDialog = true
      },
      // 编辑案例
      editCase(item) {
        if (this.$refs.accountForm != undefined) {
          this.$nextTick(() => {
            this.$refs.accountForm.resetFields()
          })
        }
        if (item.difficulty === 'SIMPLE') {
          this.difficultyRadio = 'SIMPLE'
        }
        if (item.difficulty === 'MIDDLE') {
          this.difficultyRadio = 'MIDDLE'
        }
        if (item.difficulty === 'SENIOR') {
          this.difficultyRadio = 'SENIOR'
        }
        if (item.caseModel === 'SINGLE') {
          this.single = true
          this.many = false
        }
        if (item.caseModel === 'MULTI') {
          this.single = false
          this.many = true
        }
        this.accountId = item.id
        this.dialogType = '编辑'
        this.addAccountDialog = true
        this.accountForm = deepClone(item)
      },
      determine(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const isEdit = this.dialogType == '编辑'
            if (isEdit) {
              editAccount({
                id: this.accountId,
                caseName: this.accountForm.caseName,
                caseModel: this.accountForm.caseModel,
                difficulty: this.accountForm.difficulty
              }).then(res => {
                if (res.code === '0') {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.addAccountDialog = false
                  this.accountList()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  })
                }
              })
            } else {
              addAccount(this.accountForm).then(res => {
                if (res.code === '0') {
                  this.addAccountDialog = false
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.accountList()
                  // 清空账套名称
                  this.accountForm.caseName = ''
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
      // 设置步骤
      setstep(item) {
        // 账套节点id
        localStorage.setItem('caseId', item.id)
        localStorage.setItem('caseName', item.caseName)
        this.$emit('setSteps', '设置步骤')
      },
      // 关闭弹框
      closes() {
        this.accountForm = {
          caseName: '',
          caseModel: 'SINGLE',
          difficulty: 'SIMPLE'
        }
        this.single = true
        this.many = false
        this.difficultyRadio = 'SIMPLE'
        this.addAccountDialog = false
      },
      handleDialogClose() {
        this.accountForm = {
          caseName: '',
          caseModel: 'SINGLE',
          difficulty: 'SIMPLE'
        }
        this.single = true
        this.many = false
        this.difficultyRadio = 'SIMPLE'
        this.addAccountDialog = false
      },
      // 改变单选框
      action (type) {
        if (type === 0) {
          this.many = false
          // 单人全岗
          this.accountForm.caseModel = 'SINGLE'
        } else {
          this.single = false
          // 多人多岗
          this.accountForm.caseModel = 'MULTI'
        }
      },
      level(leve) {
        this.accountForm.difficulty = leve
      },
      // 操作复选框
      handleSelectionChange(val) {
        // this.multipleSelection = val
        // 选择的所有账套，过滤成一个只有id的数组
        this.deleteAccountId = val.map(item => item.id).join(',')
      }
    }
}
</script>
<style scoped lang="scss">
.accountNav{
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
// .el-row{
//   margin-top: 20px;
// }
.btn{
    background: #414D65;
    border: none;
    color:#fff;
    border-radius: 2px;
    height: 32px;
    cursor: pointer;
    font-size:14px;
    outline: none;
    margin-left:15px;
}
.foot {
  text-align: center;
  .Determine {
    background: #414d65;
  }
}

</style>
<style lang="scss">
.accountWarper {
  height: 100%;
  overflow: hidden;
  .el-table{
    border-collapse:collapse;
    border-spacing:1;
    border-spacing:0;
    margin-top: 20px;
    th{
      // background:#E5EAF4;
      .highlight{
        color: #333;
      }
    }
  }
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
  .contents{
    .el-radio__inner{
      border-radius:2px;
      &::after{
        background:none;
      }
    }
    //✓
  .el-radio__input.is-checked{
      .el-radio__inner::after{
        content:"✓";
        color:#fff;
        position: static;
      }
    }
  }
  .el-table-filter > .el-table-filter__list{
    text-align: center;
  }
  // .el-table{
  //   .cell{
  //     display: inherit;
  //   }
  // }
}
</style>