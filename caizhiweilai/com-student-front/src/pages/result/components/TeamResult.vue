<template>
  <div class="team-result-box">
    <div class="cont" v-if='lookCurrentResult'>
      <div class="left-bg">
        <p>
          <span class="sp-t">团队成员成绩</span>
          <span class="sp-e"><i>VIEW&nbsp;</i><em>RESULTS</em></span>
        </p>
      </div>
      <div class="right-content">
        <p class="dialog-title"> <i class="iconfont" @click="closeTeamDialog">&#xe6a5;</i></p>
        <div class="table-box">
          <table class="base-table team-table">
            <thead>
            <tr>
              <th width="40%">姓名</th>
              <th width="20%">成绩</th>
              <th width="40%">操作</th>
            </tr>
            </thead>
            <tbody v-if="teamData.teamList.length>0">
            <tr v-for="item in teamData.teamList" :key="item.id">
              <td>{{item.studentName}}</td>
              <td>{{item.score}}</td>
              <td>
                <span class="opear-td" @click="lookTeamStudy(item)">成绩详情</span>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="3">暂无数据~~</td>
            </tr>
            </tbody>
          </table>
        </div>
        <pagin :total="teamData.total" v-show="teamData.total > 10" @pagination="paginChange" :page.sync="currentPage" :autoScroll="autoScroll" :limit.sync="currentSize" :pager-count="5"></pagin>
      </div>
    </div>
    <div class="cont detail" v-else>
      <div class="left-bg">
        <p>
          <span class="sp-t">成绩详情</span>
          <span class="sp-e"><i>VIEW&nbsp;</i><em>RESULTS</em></span>
        </p>
      </div>
      <div class="right-content">
        <p class="dialog-title"><i class="iconfont" @click="closeDetail">&#xe6a5;</i></p>
        <div class="table-box">
          <table class="base-table team-table">
            <thead>
            <tr>
              <th width="40%">大纲名称</th>
              <th width="40%">试卷名称</th>
              <th width="20%">成绩</th>
            </tr>
            </thead>
            <tbody v-if="currenStudentData.length>0">
            <tr v-for="item in currenStudentData" :key="item.id">
              <td>{{item.outlineName}}</td>
              <td v-html="item.status==3?'-----':item.paperName"></td>
              <td v-html="item.status==3?'-----':item.avgScore"></td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="3">暂无数据~~</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { teamStudyDetail } from '@/api/examResult'
import pagin from '@/components/pagination/index'

export default {
  name: 'TeamResult',
  data() {
    return {
      currentSizeChange: 10,
      currentPage: 1, // 当前分页页码
      currentSize: 10, // 当前页分页限制条数
      autoScroll: false, // 是否显示页面滑动到顶部动效
      lookCurrentResult: true, // 查看当前学员的成绩
      currenStudentData: [] // 当前学生的考试成绩列表
    }
  },
  props: {
    teamData: {
      type: Object
    }
  },
  components: {
    pagin
  },
  methods: {
    // 分页组件触发事件
    paginChange(obj) {
      this.currentPage = obj.page
      this.currentSize = obj.limit
      this.$emit('paginChange', obj)
    },
    // 关闭团队成员成绩列表
    closeTeamDialog() {
      this.$emit('closeTeamDialog')
    },
    // 查看学员的考试详情
    closeDetail() {
      this.lookCurrentResult = true
    },
    // 查看当前团队成员的成绩详情
    lookTeamStudy(obj) {
      const _this = this
      const postData = {
        classId: localStorage.getItem('classId'),
        userId: obj.studentId
      }
      const _formData = new FormData()
      Object.keys(postData).forEach(key => {
        _formData.append(key, postData[key])
      })
      teamStudyDetail(_formData).then(res => {
        if (res.code == 0) {
          _this.lookCurrentResult = false
          this.currenStudentData = res.result
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .team-result-box {
    @include maskLayer;

    .cont {
      width: 930px;
      max-height: 685px;
      background: #fff;
      border-radius: 21px;
      overflow: hidden;
      display: flex;
      .left-bg{
        width: 287px;
        height: 685px;
        background: url('../../../common/images/dialog-bg.png') no-repeat;
        background-size:100%;
        p{
          margin-top: 149px;
          margin-left: 43px;
          span{
            display: block;
          }
          .sp-t{
            font-size:28px;
            color: #1F1F1E;
          }
          .sp-e{
            i{
              color: #0324FD;
              font-size:16px;
              font-style: normal;
            }
            em{
              color: #37C153;
              font-size:16px;
              font-style: normal;
            }
          }
        }
      }
      .right-content{
        width: 643px;
        .dialog-title {
          height: 37px;
          position: relative;
          i {
            color: #BEC2C6;
            position: absolute;
            top: 20px;
            right: 23px;
            cursor: pointer;
            font-style: normal;
          }
        }
        .table-box {
          width: 556px;
          max-height: 536px;
          min-height: 100px;
          margin: 28px 35px 0;
          border-left: 1px solid #EDEDED;
          border-right: 1px solid #EDEDED;
          border-top: 1px solid #EDEDED;
          border-radius: 12px 12px 0 0;
          overflow: auto;
          .team-table {
            width: 100%;
            thead{
              border: none;
            }
            tr {
              border-bottom: 1px solid #EDEDED;
              height: 60px;
              &:nth-child(even) {
                background-color: #F9F9F9;
              }

              th {
                height: 50px;
                background: #FAFCFE;
              }

              td, th {
                border: 0;
                line-height: 20px;
                padding: 10px;
              }

              td {
                color: #333;
                &.opera-box {
                  color: #36CEA9;
                  cursor: pointer;
                }

                span.opear-td {
                  cursor: pointer;
                  color: $color-theme;

                  &:hover {
                    color: $color-theme-hover;
                  }
                }
              }
            }
          }
        }
        &.detail {
          .dialog-title {
            height: 40px;
            border-bottom: 0;
            i {
              font-style: normal;
              height: 40px;
            }
          }
          .table-box {
            padding-bottom: 30px;
            max-height: 470px;
            min-height: 200px;
          }
        }
      }
    }
  }
</style>
