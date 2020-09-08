<template>
<div>
  <div class='cj-container'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人成绩" name="first">
        <el-table
        :data="personData"
        border="border"
        style="width: 100%"
        :cell-style="tableCellStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="checkSelect"
        @sort-change="sortChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center">
              <template slot-scope="scope">
                  <span>{{(tablePage - 1) * tableSize + scope.$index + 1}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="identityCode" label="学号" align="center"></el-table-column>
          <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="teamName" label="所在团队" align="center"></el-table-column>
          <el-table-column prop="score" label="考试成绩" align="center"></el-table-column>
          <template v-if="isHaveAccountTack">
            <el-table-column  prop="financeScore" label="财务报表" align="center"></el-table-column>
            <el-table-column  prop="taxaScore" label="税务报表" align="center"></el-table-column>
            <el-table-column  prop="efficiencyScore" label="效率值" align="center"></el-table-column>
          </template>
          <el-table-column label="出勤率" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attendance*100}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="红旗榜排名"
                           align="center"
                           sortable="custom">
            <template slot-scope="scope">
                <span style="marginRight:7px">{{scope.row.redFlagRank}}</span>
                <span>( <i class='el-icon-s-flag' style="color:red;marginRight:1px"></i>{{scope.row.redFlagScore}} )</span>
            </template>
          </el-table-column>
          <el-table-column label="教师评分" align="center">
            <template slot-scope="scope">
              <input :value="scope.row.teacherScore" class='score-input' maxlength="3" @blur='clickInput(scope.$index, scope.row)'>
            </template>
          </el-table-column>
          <el-table-column prop="allScore" label="总成绩" align="center"></el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="isHaveAccountTack" class='resultDetail' @click="clickAccuntDetail('person', scope.row.studentId)">查看账套详情</div>
              <div class='resultDetail' @click="clickResultDetail('person', scope.row.studentId)">查看考试详情</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="团队成绩" name="second">
        <el-table
        :data="teamData"
        border
        style="width: 100%"
        :cell-style="tableCellStyle"
        :header-cell-style="tableHeaderColor"
        >
          <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center">
            <template slot-scope="scope">
                <span>{{(tablePage - 1) * tableSize + scope.$index + 1}}</span>
            </template>
        </el-table-column>
          <el-table-column prop="teamName" label="团队名称" align="center"></el-table-column>
          <el-table-column prop="num" label="团队人数" align="center"></el-table-column>
          <el-table-column prop="score" label="平均成绩" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div v-if="isHaveAccountTack" class='resultDetail' @click="clickAccuntDetail('team', scope.row.teamId)">查看账套详情</div>
              <span class='resultDetail' @click="clickResultDetail('team', scope.row.teamId)">查看成绩详情</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <button v-show="this.activeName === 'first'" class="batch-score export-result" @click="batchBcore">批量评分</button>
    <button v-show="this.activeName === 'first'" class="export-result" @click="downloadeExcelUrl">导出成绩</button>

    <!-- 成绩详情弹框 -->
    <el-dialog class='common-big-dialog' :close-on-click-modal="false" destroy-on-close title="考试详情" :visible.sync="resultShow" @close="()=>{ this.resultShow=false }">
      <el-table
        :data="detailData"
        border="border"
        style="width: 100%"
        :cell-style="tableCellStyle"
        :header-cell-style="tableHeaderColor"
        max-height="550px"
        >
          <el-table-column prop="outlineName" label="章节" align="center"></el-table-column>
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.status == 1">{{scope.row.paperName}}</p>
              <p v-if="scope.row.status == 2">{{scope.row.paperName}}</p>
              <p v-if="scope.row.status == 3">--</p>
            </template>
          </el-table-column>
          <el-table-column label="分数" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.status == 1">{{scope.row.avgScore}}</p>
              <p v-else-if="scope.row.status == 2">--</p>
              <p v-else-if="scope.row.status == 3">--</p>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
    <!-- 账套成绩弹框 -->
    <el-dialog class='common-big-dialog' :close-on-click-modal="false" destroy-on-close title="账套详情" :visible.sync="accuntShow">
      <el-table
        :data="accuntDetailData"
        border="border"
        style="width: 100%"
        :cell-style="tableCellStyle"
        :header-cell-style="tableHeaderColor"
        max-height="550px"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center">
          </el-table-column>
          <el-table-column prop="caseName" label="账套名称" align="center"></el-table-column>
          <el-table-column prop="totalTimeStr" label="总用时" align="center"></el-table-column>
          <el-table-column  prop="financeScore" label="财务报表" align="center"></el-table-column>
          <el-table-column  prop="taxaScore" label="税务报表" align="center"></el-table-column>
          <el-table-column  prop="totalScore" label="总成绩" align="center"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
  <!-- 分页组件 -->
  <!-- <div class="pagination"> -->
    <pagination :total="pageTotal" @pagination="monitorPagin" v-if="pageTotal>10" :limit='tableSize' :page='tablePage'></pagination>
  <!-- </div> -->
</div>

</template>
<script>
import pagination from '@/components/pagination'
import { studentScoreList, studentScoreInfo, exportStudentScore, teamScoreList, teamtScoreInfo, teacherScoreSave, isHaveAccountTack, viewAccountTackDetail, viewTeamAccountTackDetail } from '@/api/cjgl'
export default {
  // name: 'ScoreManPage',
  components: {
    pagination
  },
  data() {
    return {
      exportExcelUrl: '', // 存储excell表路径
      pageTotal: 0, // 总共多少条
      resultShow: false,
      accuntShow: false,
      isHaveAccountTack: false,
      activeName: 'first',
      personData: [],
      teamData: [],
      detailData: [],
      accuntDetailData: [],
      tablePage: 1,
      tableSize: 10,
      studentListData: [],
      asc: '',
      orderBy: ''
    }
  },
  methods: {
    // 查询是否有账套成绩
    isHaveAccountTackHandler() {
      isHaveAccountTack({ classId: localStorage.getItem('classId') }).then(res => {
        if (res.code === '0') {
          this.isHaveAccountTack = res.result
        }
      })
    },
    checkSelect(data) {
      this.studentListData = data
    },
    // 红旗榜排序
    sortChange(column) {
      if (column.order == 'ascending') {
        this.asc = 'true'
        this.orderBy = 'redFlagScore'
      } else if (column.order == 'descending') {
        this.asc = 'false'
        this.orderBy = 'redFlagScore'
      } else {
        this.asc = ''
        this.orderBy = ''
      }
      this.personData.length === 0 || this.queryStudentScoreList()
    },
    // 点击评分
    async clickInput(index, objData) {
      const inputVal = document.getElementsByClassName('score-input')[index].value
      if (objData.teacherScore == inputVal) {
        return
      }
      if (inputVal <= 100 && inputVal >= 0 && inputVal !== '') {
        const obj = {
          classId: localStorage.getItem('classId'),
          teamId: objData.teamId,
          userId: objData.studentId,
          teacherScore: inputVal
        }
        const res = await teacherScoreSave([obj])
        if (res.code === '0') {
           this.queryStudentScoreList()
           this.$message.success(res.result)
         } else {
           this.$message.warning(res.message)
         }
      } else {
        this.$message.warning('请输入0-100的数字')
        // this.queryStudentScoreList()
      }
    },
    // 批量评分
    batchBcore() {
      if (this.studentListData.length === 0) {
        this.$message.warning('请先选择学生')
        return
      }

      this.$prompt('', '批量评分', {
          closeOnClickModal: false,
          customClass: 'batchBcore-dialog-style',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?:[1-9]?\d|100)$/,
          inputErrorMessage: '请输入0到100的数字'
        }).then(async ({ value }) => {
        const objArr = this.studentListData.map((item, index) => {
          return {
            classId: localStorage.getItem('classId'),
            teamId: item.teamId,
            userId: item.studentId,
            teacherScore: value
          }
        })
         const res = await teacherScoreSave(objArr)
         if (res.code === '0') {
           this.queryStudentScoreList()
           this.$message.success(res.result)
         } else {
           this.$message.warning(res.message)
         }
        }).catch(() => {})
    },
    // 切换页面
    handleClick(tab) {
      if (tab.label === '团队成绩') {
        this.activeName = 'second'
        this.queryTeamScoreList()
        this.tablePage = 1
      } else {
        this.tablePage = 1
        this.queryStudentScoreList()
      }
    },
    // 切换分页触发
    monitorPagin(obj) {
      if (obj.limit !== this.tableSize) {
        this.tablePage = 1
        this.tableSize = obj.limit
        if (this.activeName === 'first') {
          this.queryStudentScoreList()
        } else {
          this.queryTeamScoreList()
        }
        return
      }
      this.tableSize = obj.limit
      this.tablePage = obj.page
      if (this.activeName === 'first') {
        this.queryStudentScoreList()
      } else {
        this.queryTeamScoreList()
      }
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: rgba(250,252,254,1);color: #333;font-weight: 600;border-right-color:transparent;'
      }
    },
    // 修改 table cell边框的背景色
    tableCellStyle() {
      return 'border-color:rgba(237,237,237,1);border-right-color:transparent;'
    },
    // 点击查看成绩详情
    clickResultDetail(type, id) {
        this.resultShow = true
        if (type === 'person') {
          this.queryStudentScoreInfo(id)
        } else {
          this.queryTeamScoreInfo(id)
        }
    },
    // 点击查看账套详情
    clickAccuntDetail(type, id) {
        this.accuntShow = true
        if (type === 'person') {
          const viewAccuntDetialStr = 'classId=' + localStorage.getItem('classId') + '&userId=' + id
          viewAccountTackDetail(viewAccuntDetialStr).then(res => {
            if (res.code === '0') {
              this.accuntDetailData = res.result
            }
          })
        } else if (type === 'team') {
          const viewTeamAccuntDetialStr = 'classId=' + localStorage.getItem('classId') + '&teamId=' + id
          viewTeamAccountTackDetail(viewTeamAccuntDetialStr).then(res => {
            if (res.code === '0') {
              this.accuntDetailData = res.result
            }
          })
        }
    },
    // 查询个人成绩列表
    async queryStudentScoreList() {
      const res = await studentScoreList({
        page: this.tablePage,
        size: this.tableSize,
        keyWords: '',
        classId: localStorage.getItem('classId'),
        asc: this.asc,
        orderBy: this.orderBy
      })
      if (res.code === '0') {
        this.personData = res.result.data
        this.pageTotal = +res.result.total
      } else {
        this.$message.warning(res.message)
      }
    },
    // 查询团队成绩列表
    async queryTeamScoreList() {
      const res = await teamScoreList({
        page: this.tablePage,
        size: this.tableSize,
        keyWords: '',
        classId: localStorage.getItem('classId')
      })
      if (res.code === '0') {
        this.teamData = res.result.data
        this.pageTotal = +res.result.total
      } else {
        this.$message.warning(res.message)
      }
    },
    // 查询教师端个人成绩详情
    async queryStudentScoreInfo(id) {
      const res = await studentScoreInfo({
        classId: localStorage.getItem('classId'),
        userId: id
      })
      if (res.code === '0') {
        this.detailData = res.result
      } else {
        this.$message.warning(res.message)
      }
    },
    // 查询教师端团队成绩详情
    async queryTeamScoreInfo(id) {
      const res = await teamtScoreInfo({
        classId: localStorage.getItem('classId'),
        teamId: id
      })
      if (res.code === '0') {
        this.detailData = res.result
      } else {
        this.$message.warning(res.message)
      }
    },
    // 导出学生成绩
    async exportExcelStudentScore() {
      if (this.personData.length === 0) {
        this.$message.warning('该班级暂无学生')
        return
      }
      const res = await exportStudentScore({
        classId: localStorage.getItem('classId')
      })
      if (res.code === '0') {
        this.exportExcelUrl = res.result
        const a = document.createElement('a') // 创建a标签
        if ('download' in a) {
          a.download = '学生成绩表.xlsx' // 设置下载文件的文件名
        }
        (document.body || document.documentElement).appendChild(a)
        a.href = this.exportExcelUrl
        a.target = '_parent'
        a.click() // 设置点击事件
        a.remove() // 移除a标签
        } else {
          this.$message.warning(res.message)
        }
    },
    // 下载成绩表
    downloadeExcelUrl() {
      this.exportExcelStudentScore() // 导出个人成绩表
    }
  },
  created() {
    this.isHaveAccountTackHandler()
  },
  mounted() {
    this.queryStudentScoreList() //  学生个人成绩列表
  },
  activated() {
    this.queryStudentScoreList() // 学生个人成绩列表
  }
}
</script>
<style lang="scss" >
  .cj-container{
    // height: 100%;
    position: relative;
    padding: 26px 20px;
    padding-bottom: 0;
    .score-input{
      -webkit-appearance: none;
      background-color: #FFFFFF;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 30px;
      line-height: 40px;
      outline: none;
      padding: 0 13px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size:14px;
      width: 55px;
      &:focus {
        outline: none;
        border-color: #36CEA9;
      }
    }
    // 导入成绩按钮
    button.export-result{
      position: absolute;
      right:20px;
      top:20px;
      // bottom: 0;
      width: 100px;
      height: 30px;
      background: #36CEA9;
      border-radius: 2px;
      font-size: 14px;
      outline: none;
      border: none;
      color: #fff;
      cursor: pointer;
    }
    // 批量评分
    button.export-result.batch-score{
      right:140px;
    }
    // 成绩详情按钮
    .resultDetail{
      color: #36CEA9;
      cursor: pointer;
    }

    .el-tabs__item:hover {
      color: #36CEA9;
    }
    .el-tabs__item.is-active {
      color: #36CEA9;
    }
    .el-tabs__item{
      padding: 0;
      width: 100px;
      text-align: center;
    }
    .el-tabs__active-bar {
      background-color:#36CEA9;
    }
    // 滚动条样式
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
  }
  .pagination{
      position: absolute;
      bottom: 0px;
      .pagination-container{
        background-color: transparent;
      }
    }
    // 成绩
  .common-big-dialog.el-dialog__wrapper{
    .el-dialog{
      width: 930px;
      height: 660px;
      border-radius: 4px;
      .el-dialog__body{
        height: 610px;
        padding: 30px 20px;
      }
    }
  }
  // 评分
  .el-message-box.batchBcore-dialog-style{
    width: 520px;
    min-height: 340px;
    max-height: 680px;
    border-radius: 4px;
    padding: 0;
    .el-message-box__content{
      height: 215px;
      padding: 30px 30px 0;
      display: flex;
      align-items: center;
      width: 100%;
      .el-message-box__input{
        width: 100%;
      }
    }
    .el-message-box__btns{
      .el-button {
        width: 70px;
        height: 40px;
      }
    }
  }
</style>
