<template>
<div class="app-container question-bank-wrapper">
  <div class="title">
    <el-input
      placeholder="请输入题目编号或题干"
      suffix-icon="el-icon-search"
      size="small"
      class="searchtkKey"
      v-model.trim="searchtk"
      @input="searchContent"
    ></el-input>
    <el-dropdown trigger="click">
      <el-button type="primary" size="small">
        导入题目<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <a href="/model/导入题库模板.xlsx" download="导入题库模板.xlsx">下载模板</a>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-upload action="#" ref="upload" accept=".xlsx,.xls" :show-file-list=false :http-request="fileHandler">
            导入
          </el-upload>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <div class="titlename">题库</div> -->
    <div class="xztm" @click="newTm">新增题目</div>
  </div>
  <el-table :height="pagTotal > 10 ? 'calc(100% - 103px)' : 'calc(100% - 50px)'" :data="tableData" border style="width: 100%">
    <el-table-column prop="questionNo" label="题目编号"></el-table-column>
    <el-table-column prop="questionContent" label="题干"></el-table-column>
    <el-table-column prop="questionTypeName" label="题目类型"></el-table-column>
    <el-table-column prop="firstCapabilityName" label="一级能力项"></el-table-column>
    <el-table-column prop="createTime" label="更新时间"></el-table-column>
    <el-table-column prop="cz" label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">预览题目</el-button>
        <el-button @click="editTm(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)" type="text" size="small">移除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <paging :total="pagTotal" @pagination="monitorPagin" :page.sync="pageParams.page" :pageSizes="[10,25,50,100]" :limit.sync="pageParams.size" v-if="pagTotal>10" style="display: flex;justify-content: flex-end;"></paging>
  <!-- 新增题目 -->
  <el-dialog width="40%" title="新增题目" :visible.sync="selectFile" append-to-body :close-on-click-modal="false">
    <newTopic v-if="selectFile" @xzTopic="xzTopic"></newTopic>
  </el-dialog>
  <!-- 编辑 -->
  <el-dialog width="40%" title="编辑题目" :visible.sync="editFile" append-to-body :close-on-click-modal="false">
    <edit v-if="editFile" @bjTopic="bjTopic" :bjObject="bjObject"></edit>
  </el-dialog>
  <!-- 题目预览 -->
  <el-dialog title="题目预览" :visible.sync="tmyl" width="40%" :close-on-click-modal="false">
    <div class="questionType">
      <span>（ {{preview.questionTypeName}} ）</span>
      {{preview.questionContent}}
    </div>
    <div class="optionAll">
      <div v-for="(item,index) in preview.questionOptionDTOList" :key="index">
        <span>{{item.optionCode}}</span>
        <p>{{item.optionContent}}</p>
      </div>
    </div>
    <div class="zcda">
      <div>正确答案</div>
      <span>{{preview.answer}}</span>
    </div>
    <div class="jx">
      <div>解析</div>
      <span>{{preview.answerAnalysis}}</span>
    </div>
  </el-dialog>
</div>
</template>

<script>
/* eslint-disable */
import {
  topicList,
  delQuestion,
  exportFile
} from './../../api/questionBank.js'
import newTopic from './components/newTopic'
import edit from './components/edit'
import paging from '../../components/pagination/index'
export default {
  components: {
    newTopic,
    edit,
    paging
  },
  data() {
    return {
      tableData: [],
      form: {
        tgnr: '',
        dajx: '',
        a: '',
        domains: [{
          value: ''
        }]
      },
      dialogImport: false, // 导出
      selectFile: false,
      tmyl: false,
      editFile: false,
      preview: {},
      bjObject: {},
      pagTotal: '', // 数据总条数
      pageParams: {
        page: 1, // 当前页
        size: 10, // 每页显示条数
        keyWrods: '' // 搜索的词
      },
      fileUrl: '',
      searchtk: '',
      pageFlag: 10
    }
  },
  computed:{
    newChild(){
      return this.pageParams.size
    }
  },
  watch:{
    newChild(newV,oldV){
      alert(newV)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async fileHandler(event) {
      this.fileUrl = await this.cos(event)
    },
    init() {
      topicList({
        page: this.pageParams.page,
        size: this.pageParams.size,
        keyWrods: this.pageParams.keyWrods
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.result.data
          this.pagTotal = parseInt(res.result.total)
          // 回table顶部
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    monitorPagin(item) {
      let pageFlag = 0
      if(this.pageFlag != item.limit){
        pageFlag = 1
        this.pageFlag = item.limit
        this.pageParams.page = 1
      }
      localStorage.setItem('page', item.page)
      localStorage.setItem('size', item.limit)
      // 分页组件
      topicList({
        page: pageFlag == 1 ? '1' : item.page,
        size: item.limit,
        keyWrods: ''
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.result.data
          this.pagTotal = parseInt(res.result.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    deleteRow(index, rows, questionBankId) {
      this.$confirm('此操作将永久删除该试题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        delQuestion({
          questionBankId: questionBankId.id
        }).then(res => {
          if (res.code == 0) {
            rows.splice(index, 1)
            this.$message({
              type: 'success',
              message: res.message
            })
            // 请求页面数据
            topicList({
              page: localStorage.getItem('page'),
              size: localStorage.getItem('size'),
              keyWrods: ''
            }).then(res => {
              if (res.code == 0) {
                if ((parseInt(localStorage.getItem('page')) - 1) > 0 && res.result.data.length == 0) {
                  topicList({
                    page: parseInt(localStorage.getItem('page')) - 1,
                    size: localStorage.getItem('size'),
                    keyWrods: ''
                  }).then(res => {
                    this.tableData = res.result.data
                    this.pagTotal = parseInt(res.result.total)
                  })
                }
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClick(row) {
      this.preview = row
      this.tmyl = true
    },
    newTm() {
      // 新增题目
      this.selectFile = true
    },
    editTm(item) {
      // 编辑题目
      this.bjObject = item
      this.editFile = true
    },
    xzTopic() {
      // 关闭新增题目弹框
      this.selectFile = false
      this.init()
    },
    bjTopic() {
      // 关闭编辑题目弹框
      this.editFile = false
      this.init()
    },
    searchContent(val) {
      clearTimeout(this.searchTime)
      this.searchTime = setTimeout(() => {
        topicList({
          page: '1',
          size: '10',
          keyWrods: val
        }).then(res => {
          if (res.code == 0) {
            this.tableData = res.result.data
            this.pagTotal = parseInt(res.result.total)
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }, 500)
    }
  },
  watch: {
    fileUrl(now, old) {
      const path = now
      const pos = path.lastIndexOf('/')
      const url = path.substr(0, pos + 1)
      const str = path.substr(pos + 1)
      const dian = str.lastIndexOf('.')
      const fileName = str.substr(0, dian)
      const end = str.substr(dian)
      const jm = decodeURI(fileName) // 解码
      exportFile({
        filePath: url + jm + end
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          // 分页插件显示第一页
          this.pageParams.page = 1
          // 重新刷新数据
          topicList({
            page: 1,
            size: this.pageParams.size,
            keyWrods: ''
          }).then(res => {
            if (res.code == 0) {
              this.tableData = res.result.data
              this.pagTotal = parseInt(res.result.total)
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-bank-wrapper {
  .el-upload-list {
    display: none;
  }
  .exportFile {
    display: none;
  }
  .el-form-item__content {
    display: flex;
  }
  .delxuanx {
    margin-left: 10px;
  }
  .title {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    .searchtkKey{
      width: 200px;
      margin-right: 20px;
    }
    .el-dropdown {
      margin-right: 10px;
      .el-button--primary {
        background: #414d65;
        border-color: #414d65;
      }
    }
    .titlename {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(145, 145, 145, 1);
      line-height: 22px;
    }
    .xztm {
      width: 88px;
      height: 32px;
      background: rgba(65, 77, 101, 1);
      border-radius: 2px;
      line-height: 32px;
      font-size: 15px;
      text-align: center;
      color: white;
      cursor: pointer;
    }
  }
  .optionAll {
    margin: 10px 0;
    div {
      margin-bottom: 13px;
      color: rgba(95, 98, 102, 1);
      line-height: 20px;
      display: flex;
      align-items: center;
      span {
        width: 18px;
        height: 18px;
        background: rgba(180, 197, 230, 1);
        border-radius: 2px;
        line-height: 18px;
        text-align: center;
        color: white;
        display: inline-block;
        margin-right: 15px;
      }
    }
  }
  .zcda {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    div {
      width: 70px;
      height: 26px;
      background: rgba(65, 214, 107, 1);
      border-radius: 2px;
      line-height: 26px;
      text-align: center;
      color: white;
    }
    span {
      padding: 0 5px;
      height: 18px;
      background: rgba(180, 197, 230, 1);
      border-radius: 2px;
      line-height: 18px;
      text-align: center;
      color: white;
      display: inline-block;
      margin-left: 15px;
    }
  }
  .jx {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
    div {
      width: 70px;
      height: 26px;
      background: rgba(79, 185, 255, 1);
      border-radius: 2px;
      line-height: 26px;
      text-align: center;
      color: white;
    }
    span {
      margin-left: 18px;
      display: block;
    }
  }
  .pagination-container {
    padding: 20px 0;
  }
}
</style>
