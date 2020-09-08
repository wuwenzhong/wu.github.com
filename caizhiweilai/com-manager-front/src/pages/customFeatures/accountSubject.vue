<template>
  <div class="account-subject-wrapper">
    <!-- <el-tabs v-model="queryParams.queryType" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tableTabs" :key="index" :label="item.name" :name="item.code"> -->
        <el-col class="btn-box">
          <el-button v-for='(item,index) in tableTabs' :key='index' :type="courseIndex == index ? 'primary' : ''" size="medium" @click='courseType(index)'>{{item.name}}</el-button>
        </el-col>
        <el-col :span="4" class="fr mb20 mt5">
          <el-input
            v-model="keyWord"
            :disabled="loading"
            suffix-icon="el-icon-search"
            placeholder="请输入科目编码或名称"
            @focus="searchFocus()"
            @blur="searchBlur()"
          ></el-input>
          <div class="vague-wrapper" v-show="isShowVague">
            <div class="vague-list" v-for="(item, index) in vagueList" :key="index" @click="vagueClick(item.code, item.name)">{{ item.code }}-{{ item.name }}</div>
            <div v-show="keyWord && vagueList.length == 0">{{ isEmpty ? '暂无数据' : '拼命加载中...' }}</div>
          </div>
        </el-col>
        <el-table
          v-loading="loading"
          height="calc(100% - 100px)"
          :data="tableData" ref="treeTable" border row-key="id" style="width: 100%"
          :indent="32"
          :tree-props="{children: 'sonList', hasNext: 'hasChildren'}"
        >
          <el-table-column label="科目编码" width="230" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- 判断是否打开加号 -->
              <span class="need-open" v-if="scope.row.sonList" style="display: none">{{ scope.row.needOpen }}</span>
              <span v-html="scope.row.specialCode"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="科目分类">
            <template slot-scope="scope">
              <span v-if="scope.row.type == '1'">资产类</span>
              <span v-if="scope.row.type == '2'">负债类</span>
              <span v-if="scope.row.type == '3'">共同类</span>
              <span v-if="scope.row.type == '4'">所有者权益类</span>
              <span v-if="scope.row.type == '5'">成本类</span>
              <span v-if="scope.row.type == '6'">损益类</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="科目名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.level == '1'" v-html="scope.row.specialName"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="二级科目" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.level == '2'" v-html="scope.row.specialName"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="三级科目" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.level == '3'" v-html="scope.row.specialName"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="四级科目" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.level == '4'" v-html="scope.row.specialName"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="borrow" label="借方" ></el-table-column>
          <el-table-column align="center" prop="lent" label="贷方"></el-table-column>
          <el-table-column align="center" label="操作" width="210">
            <template slot-scope="scope">
              <el-link type="warning" v-show="scope.row.level != '4'" style="margin-right:5px;" @click="handleEditOpera(scope.row, 1)">添加下级</el-link>
              <el-link type="warning" style="margin-right:5px;" @click="handleEditOpera(scope.row)">编辑</el-link>
              <el-link type="warning" v-show="scope.row.hasNext == '0'" @click="handleDelete(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      <!-- </el-tab-pane>
    </el-tabs> -->

    <!-- 添加下级、编辑弹窗 -->
    <el-dialog :title="isAddChild ? '添加下级科目' : '修改科目'" :visible.sync="dialogEditOpera" width="600px" custom-class="addchild-dialog" @close="closeDialog()" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="上级科目编码" v-if="isAddChild">
          <el-input v-model="ruleForm.pcode" disabled></el-input>
        </el-form-item>
        <el-form-item label="上级科目名称" v-if="isAddChild">
          <el-input v-model="ruleForm.pname" disabled></el-input>
        </el-form-item>
        <el-form-item label="科目编码" prop="simcode">
          <el-input placeholder="请输入编码"
            v-model="ruleForm.simcode"
            :disabled="!isAddChild"
            :maxlength="ruleForm.level == '1' ? 4 : 3"
          >
            <template v-if="ruleForm.pcode != 0" slot="prepend">{{ruleForm.pcode}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="科目名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item label="借贷性质" prop="borrowlent">
          <el-checkbox true-label="借" v-model="ruleForm.borrow">借</el-checkbox>
          <el-checkbox true-label="贷" v-model="ruleForm.lent">贷</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogEditOpera = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { accountSubjectList, accountsubjectSave, accountsubjectUpdate, accountsubjectDel, getVagueList } from '@/api/formAbout.js'
import { _vueDebounce, numberMul, numberAdd, convertCurrency } from '@/common/js/utils.js'

export default {
  data() {
    const authNumber = (rule, value, callback) => {
      const teamNum = /^[0-9]*$/
      if (!teamNum.test(value)) {
        callback(new Error('编码只能为正整数'))
      } else if (this.ruleForm.level == 1 && value.length != 4) {
        callback(new Error('一级编码只能为4位数的正整数'))
      } else {
        callback()
      }
    }
    const checkBorrow = (rule, value, callback) => {
      if (!this.ruleForm.borrow && !this.ruleForm.lent) {
        return callback(new Error('请选择借贷性质'))
      } else {
        callback()
      }
    }
    return {
      tableTabs: [
        { name: '全部分类', code: '0' },
        { name: '资产类', code: '1' },
        { name: '负债类', code: '2' },
        { name: '共同类', code: '3' },
        { name: '所有者权益类', code: '4' },
        { name: '成本类', code: '5' },
        { name: '损益类', code: '6' }
      ], // 分类列表
      courseIndex: 0, // 选择tab下标
      keyWord: '', // 模糊关键词
      vagueList: [], // 模糊搜索列表
      isShowVague: false, // 是否展示模糊列表
      isEmpty: false, // 搜索结果是否为空
      // 请求参数
      queryParams: {
        keyWrods: '',
        queryType: '0' // 表单分类编码
      },
      loading: true, // table loading
      tableData: [], // 列表数据
      dialogEditOpera: false, // 添加下级弹窗
      isAddChild: false, // 是否添加下级标识
      ruleForm: {}, // 添加下级参数
      rules: {
        simcode: [
          { required: true, message: '请输入新增科目编码', trigger: 'blur' },
          { type: 'number', validator: authNumber, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入新增科目名称', trigger: 'blur' }],
        borrowlent: [{ required: true, validator: checkBorrow, trigger: 'change' }]
      }
    }
  },
  created() {
    // 获取列表
    this.getSubjectList()
  },
  watch: {
    // 监听输入框内容
    keyWord(newVal) {
      if (this.keyWord != '') {
        this.isEmpty = false
        this.getSearchList()
      }
    }
  },
  methods: {
    // 切换选项卡
    // handleClick(tab, event) {
    //   this.getSubjectList()
    // },
    courseType(index) {
      this.courseIndex = index
      this.queryParams.queryType = this.tableTabs[index].code
      this.getSubjectList()
    },
    // 获取table数据
    getSubjectList() {
      this.loading = true
      accountSubjectList(this.queryParams).then(res => {
        if (res.code === '0') {
          // 高亮字段特殊处
          this.tableData = this.formatData(res.result)
          this.loading = false

          // 打开与折叠
          this.$nextTick(() => {
            this.expandAll()
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 高亮字段处理
    formatData(tableArr) {
      const arr = []
      tableArr.forEach(item => {
        const tmp = { ...item }
        const name = tmp.name
        const code = tmp.code
        const wrods = this.queryParams.keyWrods
        if (wrods && name.indexOf(wrods) != -1) {
          const index = name.lastIndexOf(wrods)
          const prev = name.substring(0, index)
          const next = name.substring(index + wrods.length, name.length)
          tmp.specialName = prev + '<span class="search-check">' + wrods + '</span>' + next
        } else {
          tmp.specialName = tmp.name
        }
        if (wrods && code.indexOf(wrods) != -1) {
          const index = code.lastIndexOf(wrods)
          const prev = code.substring(0, index)
          const next = code.substring(index + wrods.length, code.length)
          tmp.specialCode = prev + '<span class="search-check">' + wrods + '</span>' + next
        } else {
          tmp.specialCode = tmp.code
        }
        if (tmp.sonList) {
          tmp.sonList = this.formatData(tmp.sonList)
        }
        arr.push(tmp)
      })
      return arr
    },
    // 键盘抬起搜索
    getSearchList: _vueDebounce('getVagueList', 500),
    // 科目模糊搜索下拉列表
    getVagueList() {
      if (this.keyWord != '') {
        getVagueList({ keyWord: this.keyWord }).then(res => {
          if (res.code === '0') {
            this.vagueList = res.result
            if (res.result.length == 0) {
              this.isEmpty = true
            } else {
              this.isEmpty = false
            }
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 模糊搜索列表
    vagueClick(code, name) {
      this.keyWord = code + '-' + name
      this.queryParams.keyWrods = name
      this.getSubjectList()
    },
    // 聚焦 无搜索条件时清空列表
    searchFocus() {
      if (this.keyWord == '') {
        this.vagueList = []
      }
      this.isShowVague = true
    },
    // 失焦 没有搜索条件并且参数值不为空时 请求而接口
    searchBlur() {
      var _this = this
      if (_this.keyWord == '' && this.queryParams.keyWrods != '') {
        this.queryParams.keyWrods = ''
        this.getSubjectList()
      }
      setTimeout(function() {
        _this.isShowVague = false
      }, 300)
    },
    // 默认打开子级
    expandAll() {
      const els = this.$el.getElementsByClassName('el-table__expand-icon')
      const els1 = this.$el.getElementsByClassName('need-open')
      const els2 = this.$el.getElementsByClassName('el-table__expand-icon--expanded')

      // 先全部合并
      const elsLen2 = els2.length
      if (elsLen2 > 0) {
        for (let i = 0; i < elsLen2; i++) {
          els2[i].click()
        }
      }

      // 再按需打开
      const elsLen1 = els1.length
      if (elsLen1 > 0) {
        for (let i = 0; i < elsLen1; i++) {
          if (els1[i].innerText == '1') {
            els[i].click()
          }
        }
      }

      // 处理高度滑动
      this.$nextTick(() => {
        const search = this.$el.getElementsByClassName('search-check')
        const searchLen = search.length
        if (searchLen > 0) {
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
          var top = this.$el.getElementsByClassName('search-check')[0].getBoundingClientRect().top
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = top - 388
        }
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    // 添加下级、编辑
    handleEditOpera(row, type) {
      if (type == '1') {
        // 添加下级
        this.isAddChild = true
        this.ruleForm = {
          pcode: row.code,
          pname: row.name,
          type: row.type,
          level: Number(row.level) + 1,
          borrow: '',
          lent: ''
        }
      } else {
        // 编辑
        this.isAddChild = false
        let simcode
        if (row.code.indexOf(row.pcode) == '0') {
          simcode = row.code.substr(row.pcode.length)
        } else {
          simcode = row.code
        }
        this.ruleForm = {
          simcode: simcode,
          pcode: row.pcode,
          type: row.type,
          level: row.level,
          name: row.name,
          borrow: row.borrow ? row.borrow : '',
          lent: row.lent ? row.lent : '',
          id: row.id
        }
      }
      // 打开弹窗
      this.dialogEditOpera = true
    },
    // 确定
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 拼接code值
          this.ruleForm.code = this.ruleForm.pcode + this.ruleForm.simcode
          // 根据参数判断 添加下级 还是 编辑
          if (!this.ruleForm.id) {
            // 添加下
            accountsubjectSave(this.ruleForm).then(res => {
              if (res.code === '0') {
                this.getSubjectList()
                this.dialogEditOpera = false
                this.$message.success(res.message)
              } else {
                this.$message.warning(res.message)
              }
            })
          } else {
            // 编辑
            accountsubjectUpdate(this.ruleForm).then(res => {
              if (res.code === '0') {
                this.getSubjectList()
                this.dialogEditOpera = false
                this.$message.success(res.message)
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否删除该会计科目?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        accountsubjectDel({ id: row.id }).then(res => {
          if (res.code === '0') {
            this.getSubjectList()
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.account-subject-wrapper {
  height: 100%;
  overflow: hidden;
  padding: 15px 0;
  .btn-box {
    .el-button--primary {
      background: #414D65;
      border-color: #414D65;
    }
  }
  .fr {
    position: relative;
    .vague-wrapper {
      width: 194px;
      max-height: 320px;
      overflow: auto;
      background: #fff;
      border: 1px solid #DCDFE6;
      border-top: none;
      border-radius: 4px;
      position: absolute;
      cursor: pointer;
      z-index: 100;
      div {
        line-height: 40px;
        padding: 0 15px;
        color: #606266;
        font-size: 14px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        &.vague-list:hover {
          background: #E5EAF4;
        }
      }
    }
  }
  .el-table{
    // th {
    //   .cell{
    //     text-align: center;
    //   }
    // }
    .search-check {
      color: #fff;
      background: orange;
    }
    .el-button--mini {
      margin-top: 2px;
      margin-bottom: 2px;
    }
    .el-icon-arrow-right:before {
      content: "\e6d9";
    }
    .el-table__expand-icon--expanded .el-icon-arrow-right:before{
      content: "\e6d8"!important;
    }
    .el-table__expand-icon--expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    .el-table__placeholder {
      width: 26px;
    }
    .el-table__expand-icon {
      border: 1px solid #bbb;
      border-radius: 3px;
      margin-right: 6px;
    }
  }
  .addchild-dialog {
    .el-dialog__footer {
      text-align: center;
      .el-button--primary {
        background: #414d65;
      }
    }
  }
}
</style>
