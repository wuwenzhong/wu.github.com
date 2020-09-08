<template>
<div class="clear-bg-color">
  <!-- 绿色背景图 -->
  <div class="result-bg">
    <div class="result-text">
      <p class="p-result">我的成绩</p>
      <div class="bg-bg">
        <img src="./img/bg.png"
             alt="">
      </div>
    </div>
  </div>
  <!-- 表格内容 -->
  <div class="result-content">
    <div class="total-score">
      <span>我的总成绩： <strong>{{achievement}}分</strong></span>
      <button @click="ajaxTeamStudent">团队成员成绩</button>
    </div>
    <table class="base-table result-table">
      <thead>
        <tr>
          <th width="5%">序号</th>
          <th width="40%">试卷名称</th>
          <th width="20%">总用时</th>
          <th width="20%">成绩</th>
          <th width="20%">操作</th>
        </tr>
      </thead>
      <tbody v-if="personResultData.length>0">
        <tr v-for="(item,index) in personResultData"
            :key="index">
          <td>{{(teamPage - 1) * teamSize + index + 1}}</td>
          <td>{{item.paperName}}</td>
          <td v-html="item.status == 2 ? item.useTime : '----'"></td>
          <td v-html="item.status == 2 ? item.score : '----'"></td>
          <td>
            <span v-if="item.status == 2"
                  class="opera-box"
                  @click="gotoLookDetail(item)">成绩详情</span>
            <span v-else>----</span>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4">暂无数据~~</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!--    团队成绩-->
  <team-dialog @closeTeamDialog="closeDialog"
               v-if="showDialog"
               :teamData="teamData"
               @paginChange="paginChange"></team-dialog>
  <!--    <pagin :total="personTotal" @pagination="monitorPagin" v-if="personTotal>10"></pagin>-->
</div>
</template>

<script>
import {
  getStudyResult,
  getStudyTotalScore,
  getCurrentTeam
} from '@/api/examResult'
import TeamDialog from './components/TeamResult'
import {
  longConnection
} from '@/api/myTeam.js'
export default {
  name: 'index',
  data() {
    return {
      teamPage: 1, // 团队中学员分页
      teamSize: 10, // 团队学员分页size
      teamTotal: 0, // 团队中成员总数
      achievement: 0, // 成绩
      personResultData: [], // 个人成绩数据
      personTotal: 18, // 个人成绩数据总条数
      showDialog: false, // 显示隐藏团队成员对话框
      teamData: {} // 传给团队的数据
    }
  },
  components: {
    // pagin,
    TeamDialog
  },
  mounted() {
    this.getStudentData()
  },
  methods: {
    // 监听分页组件触发事件
    monitorPagin(obj) {},
    // 关闭团队成绩弹窗
    closeDialog() {
      this.showDialog = false
    },
    // 获取学生成绩列表数据,总成绩
    getStudentData() {
      const _this = this
      const postData = {
        classId: localStorage.getItem('classId'),
        userId: localStorage.getItem('userId')
      }
      const _formData = new FormData()
      Object.keys(postData).forEach(key => {
        _formData.append(key, postData[key])
      })
      getStudyResult(_formData).then(res => {
        if (res.code == 0) {
          _this.personResultData = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
      getStudyTotalScore(_formData).then(res => {
        if (res.code == 0) {
          _this.achievement = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 查看考试详情
    gotoLookDetail(obj) {
      this.$router.push({
        path: '/training/analysis',
        query: {
          id: obj.classTaskId,
          myResult: 1
        }
      })
    },
    // 查询当前学员所在团队成员列表
    ajaxTeamStudent() {
      const _this = this
      if (localStorage.getItem('teamId') == '' || !localStorage.getItem('teamId')) {
        this.$message.warning('暂未加入团队')
        return false
      }
      const postData = {
        classId: localStorage.getItem('classId'),
        teamId: localStorage.getItem('teamId'),
        page: this.teamPage,
        size: this.teamSize,
        keyWords: ''
      }
      getCurrentTeam(postData).then(res => {
        if (res.code == 0) {
          _this.showDialog = true
          _this.teamPage = res.result.page
          _this.teamSize = res.result.size
          _this.teamTotal = res.result.total
          _this.teamData = {
            teamList: res.result.data,
            total: Number(_this.teamTotal)
          }
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 弹窗分页切换
    paginChange(obj) {
      this.teamPage = obj.page
      this.teamSize = obj.limit
      this.ajaxTeamStudent()
    }
  }
}
</script>

<style scoped lang="scss">
.result-bg {
    max-width: 1600px;
    height: 355px;
    background: linear-gradient(94deg,rgba(64,212,112,1) 0%,rgba(113,215,102,1) 100%);
    margin: 0 auto;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    .result-text {
        width: 1200px;
        margin: 0 auto;
        padding-top: 87px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        .p-result {
            font-size: 30px;
            font-weight: 500;
            line-height: 48px;
        }
        .bg-bg img {
            width: 629px;
            height: 462px;
            margin-top: -108px;
        }
    }
}
.clear-bg-color {
    margin-bottom: 20px;
    .result-content {
        width: 1200px;
        margin: -146px auto 0;
        background: #fff;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        .total-score {
            background-color: #FAFCFE;
            line-height: 90px;
            color: #333333;
            padding: 0 20px;
            display: flex;
            span {
                flex: 1;
                color: $color-theme;
                font-size: 24px;
                font-weight: 500;
                padding-left: 20px;
                strong {
                    font-weight: normal;
                    font-style: normal;
                    color: $color-theme;
                }
            }
            button {
                width: 130px;
                border: 0;
                width: 130px;
                height: 40px;
                line-height: 40px;
                background: url("../../common/images/default_sprit.png") no-repeat -2px -230px;
                font-size: 14px;
                color: #fff;
                margin-top: 25px;
                margin-right: 20px;
            }
        }
        .result-table {
            margin: 0 auto 30px;
            tr {
                border-bottom: 1px solid #EDEDED;
                border-top: 1px solid #EDEDED;
                &:nth-child(even) {
                    background-color: #F9F9F9;
                }
                td,
                th {
                    border: 0;
                }
                td {
                    .opera-box {
                        color: $color-theme;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
