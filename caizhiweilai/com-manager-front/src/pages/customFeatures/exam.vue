<template>
<div class="examBox">
  <div class="exam" v-if='isShow'>
    <div class="title">
      <el-input v-model="searchExam" placeholder="请输入试卷名称" suffix-icon='el-icon-search'></el-input>
      <el-button type="" size="medium" style="background: #414D65;color: #fff;" @click="addHandler">创建试卷</el-button>
    </div>

    <el-table :height="examTotal > 10 ? 'calc(100% - 143px)' : 'calc(100% - 77px)'" :data="examTable" border style="width: 100%">
      <el-table-column prop="name" align="center" label="试卷名称">
      </el-table-column>
      <el-table-column prop="num" align="center" label="题目数">
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间">
      </el-table-column>
      <el-table-column label="操作" align="center" width='180'>
        <template slot-scope="scope">
          <el-link style="padding-right:5px;" type="warning" @click='addHandler(scope.row)'>编辑</el-link>
          <el-link type="warning" @click='deleteExam(scope.row)'>删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total=examTotal v-show='examTotal>10' :pageSizes='[10,25,50,100]' @pagination='currentHandler' :limit='examSize' />
  </div>
  <!-- 试题 -->
  <div class="addExamBox clearfloat" v-else>
    <h6 class='paper-title' @click.stop='backExam'>返回试卷列表</h6>
    <div class="paper-name clearfloat">
      <label for="" class='fl'>试卷名称：</label>
      <el-input v-model="paperName" placeholder="请输入内容" size='mini' class='fl'></el-input>
      <span class='choseSubject fl' @click.stop='subjectHandler'>选择题目</span>
      <span class='choseSubject fl' @click='addExam'>保存</span>
    </div>
    <ul class='examinationMain'>
      <li class='examinationPart' v-for='(item,index) of AssociatedData' :key="item.id">
        <div class="examinationTitle">
          <h5 v-html="item.questionType==0?'单选题':(item.questionType == 1? '多选题': '判断题')"></h5>
          <span @click='removeExamHandler(item.id,index)'>移除</span>
        </div>
        <div class="examinationContent">{{1+index}}、{{item.questionContent}}</div>
        <div class="examinationOpt">
          <div class="examinationPart" v-for='i in item.questionOptionDTOList' :key='i.id'>
            <i>{{i.optionCode}}</i>
            <span>{{i.optionContent}}</span>
          </div>
        </div>
        <div class="examinationAnswer">
          <strong>答案 <b></b></strong>
          <span class='answer' v-for='(k , indexs) in item.answer' :key='indexs' :style="{display:k == ',' ? 'none' : ''}">{{k}}</span>
        </div>
        <div class="examinationAnswer examinationAnalysis">
          <strong>解析 <b></b></strong>
          <p class="examinationSpan">{{item.answerAnalysis}}</p>
        </div>
      </li>
    </ul>
    <!-- <div class="examDetialSave">
        <span @click='addExam'>保存</span>
      </div> -->
  </div>
  <!-- 添加试题弹窗 -->
  <el-dialog title="选择试题" :visible.sync="paperDialog" @close="saveCancel" width='800px' :close-on-click-modal="false">
    <div class="searchTopic">
      <div class="">
        <p class='fl'>已选{{chooseDialogData.length}}题</p>
        <el-input placeholder="请输入编号或内容" v-model='paperTitle' @keyup.enter.native="handleIconClick" size='mini'>
          <!-- <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick">
            </i> -->
        </el-input>
      </div>
    </div>
    <div class="table-test">
      <table>
        <thead>
          <tr>
            <th width="6%"><i class="iconfont" @click="checkAll" :class="{active:checkAllSingle}" v-html="checkAllSingle?'&#xe615;':'&#xe6e1;'"></i></th>
            <th width="14%">编号</th>
            <th width="80%">题目</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in questionData" :key="item.id">
            <td><i class="iconfont" @click="singleCheck(item)" :class="{active:item.isHasCheck}" v-html="item.isHasCheck?'&#xe615;':'&#xe6e1;'"></i></td>
            <td>{{item.questionNo}}</td>
            <td>{{item.questionContent}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination v-if="dialogPag.total > 10" style="text-align: center" :page.sync="dialogPag.current" :limit.sync="dialogPag.size" :pageSizes='[10,25,50,100]' :total=Number(dialogPag.total) @pagination='dialogPagin'></pagination>
    <div class="dialog-foot clearfloat" style="text-align: center;">
      <span class='cancel' @click='saveCancel'>取消</span>
      <span class='confirm' @click='saveConfrim'>确认</span>
    </div>
  </el-dialog>
</div>
</template>

<script>
// 接口文件
import {
  addExam,
  editExam,
  detialExam,
  keywrods,
  listExam,
  deleteExam
} from '@/api/auth.js'
// 加载公共样式
import './css/index.css'
// import paging from '@/components/pagination/index'
import {
  _debounce
} from '@/common/js/utils'

export default {
  name: 'exam',
  data() {
    return {
      searchExam: '',
      type: true, // 新增-true 编辑-false
      isShow: true, // 是否显示添加编辑试卷
      paperId: '', // 试卷id
      paperName: '', // 试卷名称
      paperDialog: false, // 试题弹窗
      detailId: '',
      paperTitle: '', // 搜索试题的名字或编号
      examTable: [], // 试卷数据列表
      examPage: 1, // 试卷列表分页页码
      examSize: 10, // 试卷列表分页当前页数量
      examTotal: 0, // 试卷列表总数
      AssociatedData: [], // 试卷已关联试题数据
      chooseDialogData: [], // 弹窗中选中的数据
      questionData: [], // 试题的数据
      isTestSerch: false, // 是否是搜索试题
      checkAllSingle: false, // 是全选还是未全选
      dialogPag: { // 试题弹窗的数据
        current: 1,
        total: 0,
        size: 10
      }
    }
  },
  components: {
    // paging
  },
  created() {
    // 页面加载获试卷列表
    this.ajaxExamList()
  },
  mounted() {},
  watch: {
    paperTitle(newVal, oldVal) {
      const _this = this
      this.searchTest(newVal, _this)
    },
    searchExam(newVal, oldVal) {
      const _this = this
      this.searchPaper(newVal, _this)
    }
  },
  methods: {
    // 模糊搜试题
    searchTest: _debounce((val, that) => {
      that.handleIconClick()
    }, 400),
    // 模糊搜试卷
    searchPaper: _debounce((val, that) => {
      that.ajaxExamList()
    }, 400),
    // 切换分页
    currentHandler(val) {
      this.examPage = val.page
      this.examSize = val.limit
      this.ajaxExamList()
    },
    // 获取试卷列表
    ajaxExamList() {
      const data = {
        size: this.examSize,
        page: this.examPage,
        keyWrods: this.searchExam
      }
      listExam(data).then(res => {
        if (res.code == 0) {
          this.examTable = res.result.data
          this.examTotal = parseInt(res.result.total)
          // 回table顶部
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 获取弹窗表格数据
    dialaoTable() {
      const that = this
      const data = {
        page: this.dialogPag.current,
        size: this.dialogPag.size
      }
      if (this.isTestSerch) {
        Object.assign(data, {
          keyWrods: this.paperTitle
        })
      } else {
        Object.assign(data, {
          keyWrods: ''
        })
      }
      keywrods(data).then((res) => {
        if (res.code == 0) {
          const assciateId = that.chooseDialogData.map(item => {
            return item.id
          })
          that.dialogPag.total = res.result.total
          if (that.isTestSerch) {
            that.questionData = res.result.data
            for (let j = 0, size = that.questionData.length; j < size; j++) {
              if (assciateId.includes(that.questionData[j].id)) {
                that.questionData[j].isHasCheck = true
              } else {
                that.questionData[j].isHasCheck = false
              }
            }
            that.questionData = [...res.result.data]
          } else {
            if (that.checkAllSingle) {
              for (let i = 0, len = res.result.data.length; i < len; i++) {
                res.result.data[i].isHasCheck = true
                if (!assciateId.includes(res.result.data[i].id)) {
                  that.chooseDialogData.push(res.result.data[i])
                }
              }
              that.questionData = [...res.result.data]
            } else {
              res.result.data.forEach(ele => {
                if (assciateId.includes(ele.id)) {
                  ele.isHasCheck = true
                } else {
                  ele.isHasCheck = false
                }
              })
              that.questionData = [...res.result.data]
            }
          }
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 创建,编辑试卷
    addHandler(obj) {
      this.paperName = ''
      this.AssociatedData = [] // 清空已关联试题数据
      this.chooseDialogData = [] // 清空临时存储已关联试题数据
      if (obj.id != undefined) {
        this.type = false
        this.paperName = obj.name
        this.detailId = obj.id
        this.paperId = obj.id
        this.pagDetial()
      } else {
        // 新增 - 0  编辑 - 1
        this.type = true
      }
      this.isShow = false
    },
    // 获取当前试卷绑定的试题数
    pagDetial() {
      const _this = this
      const data = {
        paperId: this.detailId
      }
      detialExam(data).then(res => {
        if (res.code == 0) {
          const tempArr = res.result.data
          tempArr.filter(item => {
            _this.AssociatedData.push(item.questionBankDTO)
          })
          // 获取试题数据
          this.dialaoTable()
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 选择题目弹窗
    subjectHandler() {
      this.paperTitle = ''
      // 存储一份用来做弹框选择使用
      for (let i = 0, len = this.AssociatedData.length; i < len; i++) {
        this.chooseDialogData.push(this.AssociatedData[i])
      }
      this.paperDialog = true
      this.dialaoTable()
    },
    // 试题弹窗中的分页变化
    dialogPagin(obj) {
      this.dialogPag.current = obj.page
      this.dialogPag.size = obj.limit
      this.dialaoTable()
    },
    // 返回试卷页面
    backExam() {
      this.isShow = true
      this.AssociatedData = [] // 清空已关联试题数据
      this.questionData = [] // 清空试题数据
      this.isTestSerch = false // 是否是搜索试题
      this.checkAllSingle = false // 是全选还是未全选
      this.dialogPag = { // 试题弹窗的数据
        current: 1,
        total: 0,
        size: 10
      }
    },
    // 全选反选
    checkAll() {
      const _this = this
      if (this.checkAllSingle) {
        this.checkAllSingle = false
        operaCheck(0)
      } else {
        this.checkAllSingle = true
        operaCheck(1)
      }

      function operaCheck(str) {
        if (str == 0) {
          for (let i = 0, len = _this.questionData.length; i < len; i++) {
            _this.questionData[i].isHasCheck = false
          }
          _this.chooseDialogData = []
        } else {
          for (let k = 0, size = _this.questionData.length; k < size; k++) {
            if (!_this.questionData[k].isHasCheck) {
              _this.chooseDialogData.push(_this.questionData[k])
            }
            _this.questionData[k].isHasCheck = true
          }
        }
      }
    },
    // 单选
    singleCheck(obj) {
      if (obj.isHasCheck) {
        this.questionData.forEach(item => {
          if (obj.id.includes(item.id)) {
            item.isHasCheck = false
          }
        })
        this.checkAllSingle = false
        for (let i = 0, len = this.chooseDialogData.length; i < len; i++) {
          if (obj.id == this.chooseDialogData[i].id) {
            this.chooseDialogData.splice(i, 1)
            break
          }
        }
      } else {
        this.questionData.forEach(item => {
          if (obj.id.includes(item.id)) {
            item.isHasCheck = true
            this.chooseDialogData.push(item)
          }
        })
        if (this.chooseDialogData.length == this.dialogPag.total) {
          this.checkAllSingle = true
        }
      }
    },
    // 试卷搜索
    examSearch() {
      this.examSize = 10
      this.examPage = 1
      this.ajaxExamList()
    },
    // 新增试题，保存试卷
    addExam() {
      const that = this
      const arr = []
      for (const i in this.AssociatedData) {
        arr.push(this.AssociatedData[i].id)
      }
      if (this.paperName == '') {
        this.$message.warning('试卷名称不能为空')
        return false
      } else if (arr.length == 0) {
        this.$message.warning('请选择题目')
        return false
      }
      const data = {
        name: this.paperName,
        questionIds: arr
      }
      if (this.type) {
        addExam(data).then(res => {
          if (res.code == 0) {
            that.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.isShow = true
            this.ajaxExamList()
            this.paperName = ''
            this.AssociatedData = []
          } else {
            that.$message.warning(res.message)
          }
        })
      } else {
        Object.assign(data, {
          id: this.paperId
        })
        editExam(data).then(res => {
          if (res.code == 0) {
            that.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.isShow = true
            this.ajaxExamList()
            this.paperName = ''
            this.AssociatedData = []
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    // 移除试题
    removeExamHandler(id, j) {
      let index = 0
      for (const i in this.AssociatedData) {
        if (id == this.AssociatedData[i].id) {
          index = i
        }
      }
      this.$confirm('确认是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.AssociatedData.splice(index, 1)
        this.$message.success('移除成功！')
      })
    },
    // 弹窗保存
    saveConfrim() {
      this.paperDialog = false
      for (let j = 0, size = this.chooseDialogData; j < size; j++) {
        this.chooseDialogData[j].mark = this.chooseDialogData[j].id
      }
      this.AssociatedData = this.chooseDialogData
    },
    // 弹窗取消
    saveCancel() {
      this.isTestSerch = false
      this.paperTitle = ''
      // 关闭的时候清空当前选择的试题
      this.chooseDialogData = []
      this.paperDialog = false
      this.isTestSerch = false // 是否是搜索试题
      this.checkAllSingle = false // 是全选还是未全选
      this.dialogPag = { // 试题弹窗的数据
        current: 1,
        total: 0,
        size: 10
      }
    },
    // 搜索科目
    handleIconClick() {
      this.checkAllSingle = false // 搜索时去掉全选
      if (this.paperTitle == '') {
        this.isTestSerch = false // 搜索内容为空为false
      } else {
        this.isTestSerch = true // 当有搜索内容时为true
      }
      this.questionData = [] // 搜索清空试题数
      this.dialogPag.current = 1
      this.dialaoTable()
    },
    // 删除考试
    deleteExam(id) {
      this.$confirm('是否删除该试卷?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deleteExam({
          paperId: id.id
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.ajaxExamList()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;
  .el-input{
    width: 300px;
    margin-right: 20px;
  }
}
.examBox {
    height: 100%;
    overflow: hidden;
    .el-dialog {
        height: 75%;
    }
    .exam {
      height: 100%;
      overflow: hidden;
    }
}
// 试卷管理-创建试卷
.addExamBox {
    .paper-title {
        position: relative;
        padding-left: 20px;
        font-size: 16px;
        color: #919191;
        font-weight: normal;
        cursor: pointer;
        margin: 20px 0;
        &:before {
            content: '\e67e';
            font-family: 'iconfont'!important;
            position: absolute;
            left: 2px;
            top: 2px;
            font-size: 12px;
            color: #64707D;
        }
    }
    .paper-name {
        label {
            font-weight: normal;
            line-height: 28px;
            color: #333;
        }
        .el-input {
            width: 400px;
            .el-input__inner {
                height: 32px;
            }
        }
        .choseSubject {
            width: 140px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #414D65;
            color: #fff;
            border-radius: 3px;
            margin-left: 18px;
            cursor: pointer;
        }
    }
    .examinationMain {
        padding: 0;
        height: calc(100vh - 365px);
        overflow: auto;
        li {
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            border: 1px solid rgba(0,0,0,.1);
            border-radius: 3px;
            list-style: none;
            margin-bottom: 20px;
            padding-bottom: 10px;
            .examinationTitle {
                height: 40px;
                color: #414D65;
                position: relative;
                border-bottom: 1px solid #CBCBCB;
                cursor: pointer;
                h5 {
                    margin-left: 30px;
                    font-weight: normal;
                    float: left;
                    line-height: 40px;
                    &:before {
                        content: '';
                        width: 3px;
                        height: 16px;
                        background: #414D65;
                        position: absolute;
                        top: 14px;
                        left: 14px;
                    }
                }
                span {
                    float: right;
                    width: 70px;
                    height: 26px;
                    display: block;
                    border: 1px solid #CC6649;
                    border-radius: 3px;
                    font-size: 12px;
                    color: #CC6649;
                    line-height: 26px;
                    text-align: center;
                    border-radius: 3px;
                    margin-top: 6px;
                    margin-right: 9px;
                }
            }
            .examinationContent {
                margin: 15px 0 0;
                color: #303032;
                padding-left: 20px;
            }
            .examinationOpt {
                height: auto;
                overflow: hidden;
                box-sizing: border-box;
                padding-bottom: 20px;
                border-bottom: 1px solid #CBCBCB;
                width: calc(100% - 30px);
                margin: 0 15px;
                .examinationPart {
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                    margin-top: 15px;
                    i {
                        font-style: normal;
                        display: block;
                        float: left;
                        width: 18px;
                        height: 18px;
                        color: #fff;
                        background: #B4C5E6;
                        line-height: 16px;
                        text-align: center;
                        font-size: 12px;
                        border-radius: 3px;
                        margin-left: 7px;
                        margin-right: 5px;
                    }
                    span {
                        display: block;
                        float: left;
                        width: calc(100% - 30px);
                        line-height: 20px;
                    }
                }
            }
            .examinationAnswer {
                width: 100%;
                height: auto;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
                padding-left: 20px;
                display: flex;
                strong {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    display: inline-block;
                    text-align: center;
                    color: #41D66B;
                    font-weight: normal;
                    white-space: nowrap;
                    font-size: 15px;
                    b {
                        width: 40px;
                        height: 10px;
                        background: rgba(65,214,107,.2);
                        display: block;
                        position: absolute;
                        top: 22px;
                        left: 0;
                    }
                }
                span {
                    color: #fff;
                    background: #41D66B;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 3px;
                    padding: 0 6px;
                    margin: 12px 0 0 16px;
                }
                &.examinationAnalysis {
                    strong {
                        color: #4FB9FF;
                        b {
                            background: rgba(220, 241, 255,.4);
                        }
                    }
                    span {
                        color: #4FB9FF;
                    }
                }
                p {
                    font-size: 14px;
                    color: #5F6266;
                    margin-left: 16px;
                    line-height: 20px;
                }
            }
        }
    }
}
.searchTopic {
    clear: both;
    overflow: hidden;
    p {
        margin: 0;
        line-height: 28px;
        color: #4A4A4A;
        font-size: 12px;
        margin-bottom: 28px;
    }
    .el-input {
        float: right;
        width: 200px;
        height: 32px;
    }
}
.table-test {
    padding-bottom: 20px;
    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        th {
            background: #fafcfe;
            padding: 14px;
            line-height: 20px;
            font-size: 14px;
            color: #333;
        }
        tr {
            i {
                cursor: pointer;
                color: #bbb;
                &.active {
                    color: #3271FF;
                }
            }
        }
        td,
        th {
            border: 1px solid #EBEEF5;
            padding: 10px 0;
            line-height: 20px;
            font-weight: normal;
        }
        td {
            color: #666;
            font-size: 14px;
        }
    }
}
</style>
