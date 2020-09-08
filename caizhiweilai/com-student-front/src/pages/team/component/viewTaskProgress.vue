<template>
  <!-- 查看任务进度 -->
  <div class="team-progress-box">
    <div class="cont">
      <div class="left-bg">
        <p>
          <span class="sp-t">查看进度</span>
          <span class="sp-e"><i>VIEW&nbsp;</i><em>PROGRESS</em></span>
        </p>
      </div>
      <div class="right-content">
        <p class="dialog-title"> <i class="iconfont" @click="closeTeamDialog">&#xe6a5;</i></p>
        <div class="table-box">
          <table class="base-table team-table">
            <thead>
              <tr>
                <th width="50%">大纲列表</th>
                <th width="50%">任务进度</th>
              </tr>
            </thead>
            <tbody v-if="this.tableData.length > 0">
              <tr v-for="item in this.tableData" :key="item.id">
                <td>{{item.classOutlineName}}</td>
                <td>
                  <div style="width:80%;margin:0 auto;">
                    <el-progress
                      :percentage="Math.round(item.taskProgress)"
                      :stroke-width="12"
                      color="#37C153"
                    ></el-progress>
                  </div>
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
        <!-- <pagin :total="teamData.total" @pagination="paginChange" :page.sync="currentPage" :autoScroll="autoScroll" :limit.sync="currentSize"></pagin> -->
      </div>
    </div>
  </div>
</template>

<script>
// import pagin from '@/components/pagination/index'

export default {
  name: 'TeamProgress',
  data() {
    return {
    }
  },
  props: {
    tableData: {
      type: Array
    }
  },
  components: {
    // pagin
  },
  methods: {
    // 分页组件触发事件
    // paginChange(obj) {
    //   this.currentPage = obj.page
    //   this.currentSize = obj.limit
    //   this.$emit('paginChange', obj)
    // },
    // 关闭弹框
    closeTeamDialog() {
      this.$emit('viewProgressClose')
    }
  },
  mounted() {
    document.documentElement.style.overflowY = 'hidden'
  },
  destroyed() {
    document.documentElement.style.overflowY = 'auto'
  }
}
</script>

<style lang="scss" scoped>
  .team-progress-box {
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
        background: url('../images/progress-bg.png') no-repeat;
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
          max-height: 580px;
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
      }
    }
  }
</style>
