<template>
  <div class="study-list-dialog">
    <div class="cont">
      <p class="title">学员列表 <i class='iconfont' @click="closeListDialog">&#xe60e;</i></p>
      <div class="table-box">
        <table>
          <thead>
            <tr>
              <th width="20%">学生名称</th>
              <th width="20%">所在团队</th>
              <th width="15%">提交状态</th>
              <th width="15%">正确率</th>
              <th width="15%">得分</th>
              <th width="15%">操作</th>
            </tr>
          </thead>
          <tbody v-if="sendToChild.list.length > 0">
            <tr v-for="item in sendToChild.list" :key="item.id">
              <td>{{item.userName}}</td>
              <td v-html="item.teamName ? item.teamName :'------'">{{}}</td>
              <td v-html="item.status == 0 ? '未提交':'已提交'"></td>
              <td v-html="item.status == 0 ? '-----':parseInt(100*item.successNum/(item.ignoreNum + item.errorNum + item.successNum))+'%'"></td>
              <td v-html="item.status == 0 ? '-----':item.score"></td>
              <td v-if="item.status == 0">-----</td>
              <td v-else ><router-link :to="{path:'/jxgl/ResultDetail',query:{classTaskId:item.classTaskId,studentId:item.studentId}}">查看详情</router-link></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td rowspan="6">暂无数据~~</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination v-if="sendToChild.total>10" @pagination="pageChange" :total="sendToChild.total" :page.sync="sendToChild.page" :limit.sync="sendToChild.size"></Pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ExamStydu',
  data() {
    return {}
  },
  props: {
    sendToChild: {
      type: Object
    }
  },
  mounted() {},
  methods: {
  //  关闭学员列表弹窗
    closeListDialog() {
      this.$emit('closeListDialog')
    },
		// 监听分页组件触发事件
		pageChange(obj) {
      this.$emit('pageChange', { page: obj.page, size: obj.limit })
		}
  }
}
</script>

<style scoped lang="scss">
  .study-list-dialog{
    overflow-y: auto;
    @include maskLayer($z: 1002);
    .cont{
      width:900px;
      background: #fff;
      @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));
      .title {
        line-height: 48px;
        border: 1px solid #F3F4F5;
        padding: 0 30px;
        color: #444444;
        font-size: 18px;
        position: relative;

        i {
          position: absolute;
          right: 20px;
          top: 0;
          padding: 0 10px;
          color: #929292;
          font-size: 18px;
          cursor: pointer;
        }
      }
      .table-box{
        max-height: 400px;
        overflow-y: auto;
        margin:20px 30px;
        table {
          width: 100%;
          border-collapse: collapse;
          border-right: 1px solid #EDEDED;
          border-left: 1px solid #EDEDED;
          background: #fff;
          text-align: left;
          color: #333333;
          thead {
            tr {
              border-bottom: 1px solid #EDEDED;
              border-top: 1px solid #EDEDED;
              th {
                background: #FAFCFE;
                font-weight: normal;
                height: 40px;
                padding-left: 30px;
                font-size: 14px;
              }
            }
          }
          tbody {
            tr {
              border-bottom: 1px solid #EDEDED;
              border-top: 1px solid #EDEDED;

              &:hover {
                background-color: #F8F8F8;
              }

              td {
                line-height: 20px;
                padding: 10px 0 10px 30px;
                font-size: 12px;
                em {
                  color: #FF9D6A;
                  margin-right: 10px;
                  cursor: pointer;
                }
                span {
                  color: $color-theme;
                  cursor: pointer;
                }
                a{
                  color:$color-theme;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
