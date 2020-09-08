<template>
<div class="paper-box" :style="{overflow:showStyduList ? 'hidden':'auto',height:showStyduList ? 'calc(100vh - 140px)':'100%'}">
  <div class="paper-title">
    <router-link to="/jxgl/index" tag="button"><i class="iconfont">&#xe641;</i>返回任务列表</router-link>
    <button @click="lookStudyResult">查看学生提交结果</button>
    <p>{{paperName}}</p>
    <div class="statistics-title">正确率(答对人数 / 答题人数)</div>
  </div>
  <ul class="list-box">
    <li class="test-list" v-for="(item,index) in paperData" :key="item.id">
      <div class="test-title">
        <span class="test-num">{{serialNum+(index+1)}}：</span>
        <div class="test-type">
          <p>{{item.questionBankDTO.questionContent}}</p>
          <i v-if="item.questionBankDTO.questionType == 0">单选题</i>
          <i v-if="item.questionBankDTO.questionType == 1">多选题</i>
          <i v-if="item.questionBankDTO.questionType == 2">判断题</i>
        </div>
        <div class="test-statistics">
          <i>{{item.questionExamDTO.accuracy+'%'}}</i>（{{item.questionExamDTO.successNum}} / {{item.questionExamDTO.count}}）
        </div>
      </div>
      <dl v-if="item.questionBankDTO.questionType == 2" class="judge-test">
        <dd v-for="ele in item.questionBankDTO.questionOptionDTOList" :key="ele.id">
          <p v-html="ele.optionCode == 'A' ? '正确':'错误'"></p>
        </dd>
      </dl>
      <dl v-else>
        <dd v-for="ele in item.questionBankDTO.questionOptionDTOList" :key="ele.id"><span>{{ele.optionCode}}：</span>
          <p>{{ele.optionContent}}</p>
        </dd>
      </dl>
      <div class="test-analysis" v-if="item.questionBankDTO.questionType == 2">
        <div><span>正确答案：<i></i></span><em v-html="item.questionBankDTO.answer == 'A'?'正确':'错误'"></em></div>
        <p><span>答案解析：<i></i></span>{{item.questionBankDTO.answerAnalysis}}</p>
      </div>
      <div class="test-analysis" v-else>
        <div><span>正确答案：<i></i></span><em v-for='(k , indexs) in item.questionBankDTO.answer' :key='indexs' :style="{display:k == ',' ? 'none' : ''}">{{k}}</em></div>
        <p><span>答案解析：<i></i></span>{{item.questionBankDTO.answerAnalysis}}</p>
      </div>
    </li>
  </ul>
  <Pagination v-if="paperTotal>10" @pagination="monitorPagin" :total="paperTotal" :page.sync="paperPage" :limit.sync="paperSize"></Pagination>
  <exam-stydu v-if="showStyduList" :sendToChild="sendToChild" @closeListDialog="closeListDialog" @pageChange="pageChange"></exam-stydu>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import {
  lookExamDetail,
  getExamStudy
} from '@/api/teamAdmin'
import ExamStydu from './components/ExamStydu'

export default {
  name: 'PaperDetailPage',
  data() {
    return {
      paperData: [], // 试卷的试题列表
      showStyduList: false, // 显示当前考试学员列表
      page: 1, // 学员列表页码
      size: 10, // 学员列表每页数据
      currentTaskId: '', // 当前考试任务的id
      currentPaperId: '', // 当前试卷id
      sendToChild: {}, // 学员列表弹窗需要的数据
      paperPage: 1, // 试卷试题的分页页码
      paperSize: 10, // 试卷试题的页面条数
      paperTotal: '', // 试卷总条数
      paperName: '', // 试卷名称
      serialNum: 0 // 序列号
    }
  },
  components: {
    ExamStydu
  },
  computed: {
    ...mapState({
      boxHeight: state => state.windowHeight - 310 // 这里的220指的是头部高度70+二级导航高度50+内容去的上下margin40
    })
  },
  mounted() {
    this.currentPaperId = this.$route.query.id
    this.currentTaskId = this.$route.query.classTaskId
    this.ajaxExamDetail(this.currentPaperId)
  },
  methods: {
    //  加载试卷数据
    ajaxExamDetail(id) {
      const _this = this
      const postData = {
        paperId: id,
        classId: localStorage.getItem('classId'),
        page: this.paperPage,
        size: this.paperSize
      }
      lookExamDetail(postData).then(res => {
        if (res.code == 0) {
          _this.paperName = res.result.paper.name
          _this.paperData = res.result.pageResult.data
          _this.paperPage = res.result.pageResult.page
          _this.serialNum = (res.result.pageResult.page - 1) * res.result.pageResult.size
          _this.paperSize = res.result.pageResult.size
          _this.paperTotal = Number(res.result.pageResult.total)
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    //  查看试卷的学员列表
    lookStudyResult(e) {
      const _this = this
      const postData = {
        classTaskId: this.currentTaskId,
        classId: localStorage.getItem('classId'),
        page: this.page,
        size: this.size
      }
      getExamStudy(postData).then(res => {
        if (res.code == 0) {
          if (res.result.data === undefined) {
            _this.sendToChild.list = []
            this.$message({
              message: '当前班级还未添加学生',
              type: 'warning'
            })
            return false
          } else {
            _this.showStyduList = true
            _this.sendToChild = {
              list: res.result.data,
              page: res.result.page,
              size: res.result.size,
              total: Number(res.result.total),
              taskId: _this.currentExamId
            }
            _this.examStudyData = res.result.data
            _this.page = res.result.page
            _this.size = res.result.size
          }
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    //  关闭学员列表弹窗
    closeListDialog() {
      this.showStyduList = false
    },
    // 监听分页组件触发事件
    monitorPagin(obj) {
      this.paperPage = obj.page
      this.paperSize = obj.limit
      this.ajaxExamDetail(this.currentPaperId)
    },
    // 学员弹窗列表分页切换
    pageChange(obj) {
      const _this = this
      this.page = obj.page
      this.size = obj.size
      const postData = {
        classTaskId: this.currentTaskId,
        classId: localStorage.getItem('classId'),
        page: this.page,
        size: this.size
      }
      getExamStudy(postData).then(res => {
        if (res.code == 0) {
          _this.showStyduList = true
          _this.sendToChild = {
            list: res.result.data,
            page: res.result.page,
            size: res.result.size,
            total: Number(res.result.total),
            taskId: _this.currentPaperId
          }
          _this.examStudyData = res.result.data
          _this.page = res.result.page
          _this.size = res.result.size
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.paper-box {
    margin: 20px 34px 0 20px;
    padding-bottom: 30px;
    background: #fff;
    /*去掉em,i,b,strong的默认样式*/
    em,
    i {
        font-style: normal;
    }
    b,
    strong {
        font-weight: normal;
    }
    .paper-title {
        display: flex;
        padding: 20px 0;
        line-height: 30px;
        button {
            height: 30px;
            outline: none;
            cursor: pointer;
            border: 0;
            white-space: nowrap;
            background: $color-theme;
            font-size: 12px;
            padding: 0 10px;
            border-radius: 3px;
            color: #fff;
            margin-left: 20px;

            &:hover {
                background: $color-theme-hover;
            }
        }
        p {
            flex: 1;
            margin-left: 16px;
            margin-right: 80px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
        .statistics-title {
            padding-right: 80px;
            font-size: 14px;
        }
    }
    .list-box {
        padding: 0 80px;
        .test-list {
            .test-title {
                font-size: 16px;
                color: #5F6266;
                display: flex;
                line-height: 26px;
                padding: 10px 0;
                border-bottom: 1px solid #eaeaea;

                span.test-num {
                    color: #000;
                }
                .test-type {
                    flex: 1;
                    display: flex;
                    i {
                        margin-left: 10px;
                        font-size: 14px;
                        color: #fff;
                        border-radius: 3px;
                        background: $color-theme;
                        white-space: nowrap;
                        height: 26px;
                        line-height: 26px;
                        padding: 0 12px;
                        font-style: normal;
                    }
                }
                .test-statistics {
                    margin-left: 20px;
                    text-align: right;
                    font-size: 14px;
                    line-height: 18px;
                    i {
                        color: red;
                    }
                }
            }
            dl {
                border-bottom: 1px solid #eaeaea;
                padding: 10px 0;
                dd {
                    font-size: 14px;
                    line-height: 20px;
                    display: flex;
                    padding: 6px 0;
                    span {
                        line-height: 22px;
                        margin-right: 12px;
                    }
                    p {
                        flex: 1;
                        line-height: 20px;
                    }
                }
                &.judge-test {
                    text-align: center;
                    dd {
                        display: inline-block;
                        p {
                            padding: 0 100px;
                        }
                    }
                }
            }
            .test-analysis {
                padding-bottom: 14px;
                div {
                    display: flex;
                    margin-top: 14px;
                    line-height: 22px;
                }
                p {
                    line-height: 22px;
                    font-size: 13px;
                    color: #5F6266;
                    margin-top: 10px;
                }
                span {
                    display: block;
                    color: $color-theme;
                    font-size: 14px;
                    display: inline-block;
                    position: relative;
                    margin-right: 14px;
                    padding: 0 5px;
                    i {
                        width: 100%;
                        height: 10px;
                        background-color: rgba(65, 214, 107, .2);
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        border-radius: 0 0 3px 3px;
                    }
                }
                em {
                    display: inline-block;
                    height: 22px;
                    padding: 0 6px;
                    border-radius: 3px;
                    font-size: 13px;
                    color: #fff;
                    background: $color-theme;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
