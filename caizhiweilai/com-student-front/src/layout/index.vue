<template>
  <div class="app-wrapper">
    <NavAssembly v-if="this.$route.path != '/applicatAdmin'"/>
    <AppMain/>
    <ruch-answers v-if="rushAnswerShow"></ruch-answers>
    <!-- 教学资源检索 -->
    <teach-search v-if="teachSearchShow"></teach-search>
    <!-- 红旗榜单-->
    <ranking-list v-if="rankingIsShow"></ranking-list>
    <!-- 教学工具 -->
    <div class="teach-tool" v-if="this.$route.path != '/toExercise' && this.$route.path != '/applicatAdmin' &&  this.$route.path != '/accountExercise'">
      <div class="teach-title" @click="toggleMenu()">
        <div class="tool-icon">
          <i class="el-icon-plus" :class="{'icon-toggle': menuSpread}"></i>
        </div>
        <div ref="toolTxt" class="tool-txt">教学工具</div>
      </div>
      <ul class="teach-tool-list" :class="{'close': !menuSpread}">
        <li
          class="list-item"
          v-for="(item, index) in menuList"
          :class="menuSpread ? 'list-item-animate1' : ''"
          :key="index"
          @click="addTask(item)"
        >
          <div class="tool-icon">
            <img :src="item.icon" alt/>
          </div>
          <div class="tool-txt">{{item.label}}</div>
        </li>
      </ul>
    </div>
    <!-- 投票 -->
    <el-dialog title="投票" :visible.sync="dialogVisible" width="930px" :close-on-click-modal="false">
      <vote v-if="dialogVisible" @votehidden="votehidden" :voteStartData="voteStartData"></vote>
    </el-dialog>
    <!-- 投票结果 -->
    <voteAnswer v-show="votejg" :voteRes="voteRes" @voteresult="voteresult" v-if="votejg"></voteAnswer>
    <!-- 教学资源中收取 -->
    <el-dialog custom-class="search-dialog" :visible.sync="collectShow" width="930px" :close-on-click-modal="false">
      <gather v-if="collectShow" @cancelsq="cancelsq" :refresh="refresh" @reserRefresh="reserRefresh"></gather>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { NavAssembly, AppMain } from './components'
import { resultVote } from '@/api/vote'
import ruchAnswers from '@/components/teachingTool/ruchAnswer'
import rankingList from '@/components/teachingTool/rankingList'
import teachSearch from './components/teach-tool/teach-search' // 教学资源检索
import vote from '@/components/vote'
import voteAnswer from '@//components/vote/castvoteAns'
import { activeAnswer } from '@/api/teacherTools.js'
import gather from './components/gather' // 教学资源收取
export default {
  name: 'Layout',
  components: {
    NavAssembly,
    AppMain,
    ruchAnswers,
    teachSearch,
    rankingList,
    vote,
    voteAnswer,
    gather
  },
  data() {
    return {
      menuList: [
        { type: 1, label: '红旗榜', icon: require('@/common/images/hongqi.png') },
        { type: 2, label: '抢答器', icon: require('@/common/images/qiangda.png') },
        { type: 3, label: '投票', icon: require('@/common/images/toupiao.png') },
        { type: 4, label: '课程资源检索', icon: require('@/common/images/jiansuo.png') },
        { type: 5, label: '教学资源收取', icon: require('@/common/images/jiexi.png') }
      ],
      menuSpread: false, // 教学作业开启关闭
      voteShow: false,
      dialogVisible: false,
      votejg: false,
      voteStartData: {},
      voteRes: {},
      collectShow: false,
      refresh: 0 // 是否刷新
    }
  },
  mounted() {
    this.getWindowHeight()
    // /training/analysis
    if (this.$route.path === '/training/analysis' || this.$route.path === '/entrance' || this.$route.path === '/training/exam') {
      this.$refs.toolTxt.style.color = '#fff'
    }
  },
  methods: {
    // 获取屏幕高度设置全局高度
    getWindowHeight() {
      this.$store.state.windowHeight = window.innerHeight
    },
    // 教学工具
    toggleMenu() {
      this.menuSpread = !this.menuSpread
    },
    votehidden(val) {
      // 关闭投票弹窗
      if (val == 1) {
        this.dialogVisible = false
      } else {
        this.vote('1')
      }
    },
    voteresult() {
      this.votejg = false
    },
    // 投票
    vote(checkId) {
      const voteId = checkId == 1 ? '' : checkId
      resultVote({
        voteId: voteId,
        creator: localStorage.getItem('userId'),
        classId: localStorage.getItem('classId')
      }).then((res) => {
        this.dialogVisible = false
        if (res.code == 0) {
          // 投票页
          this.dialogVisible = true
          this.voteStartData = res.result
        } else if (res.code == '1' || res.code == 1) {
          // 投票结果页
          this.dialogVisible = false
          this.votejg = true
          this.voteRes = res.result
        } else if (res.code == '101' || res.code == 101) {
          // 老师没有发起投票
          this.$message({
            type: 'warning',
            message: '老师还没有发起投票！'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 下发
    issueFc(val) {
      if (val.content.flag == '下发') {
        this.collectShow = false
        this.refresh = 0
        this.$confirm('你收到了老师新下发的教学资源，是否去查看？', '提示', {
          confirmButtonText: '立即查看',
          cancelButtonText: '稍后查看',
          type: 'warning'
        }).then(async () => {
            this.collectShow = true
          }).catch((arr) => {
            // this.$message.info('稍后查看')
          })
      } else {
        if (this.collectShow) {
          this.refresh = 1
        }
        // this.$confirm('老师回收了' + val.content.name + '这条教学资源，是否去查看？', '提示', {
        //   confirmButtonText: '立即查看',
        //   cancelButtonText: '稍后查看',
        //   type: 'warning'
        // }).then(async () => {
        //   this.collectShow = true
        // }).catch(arr => {
          // this.$message.info('稍后查看')
        // })
      }
    },
    // 重置收取资源的刷新值
    reserRefresh() {
      this.refresh = 0
    },
    // 教学资源检索
    addTask(item) {
      switch (item.type) {
        case 1:
          this.$store.commit('setRanking', true)
          break
        case 2:
          this.showTushAnswer()
          break
        case 3:
          this.vote('1')
          break
        case 4:
          // 教学资源检索
          if (this.teachSearchShow) {
            this.$store.commit('setTeachSearchShow', false)
          } else {
            this.$store.commit('setTeachSearchShow', true)
          }
          break
        case 5:
          // 教学资源解析
          this.collectShow = true
      }
    },
    // 显示抢答器
    showTushAnswer() {
      this.$store.commit('setHeight', false)
      const classId = localStorage.getItem('classId')
      const studentId = localStorage.getItem('userId')
      activeAnswer({
        classId,
        studentId
      }).then((res) => {
        if (res.code == 0) {
          // 抢答中
          this.$store.commit('setRushAnswerShow', true)
          if (res.result) {
            this.$store.commit('setAnswerStatus', true)
          }
        } else {
          if (res.message == '001') {
            this.$store.commit('setHeight', true)
            this.$message.warning('暂未开启抢答！')
          } else if (res.message == '002') {
            this.$store.commit('setRushAnswerShow', true)
            this.$store.commit('setAnswerStatus', false)
          }
        }
      })
    },
    cancelsq() {
      this.collectShow = false
    }
  },
  computed: {
    ...mapState(['rushAnswerShow', 'teachSearchShow', 'rankingIsShow']),
    voteData() {
      return this.$store.state.voteId
    },
    issueData() {
      return this.$store.state.issue
    }
  },
  watch: {
    issueData: function (a, b) {
      this.issueFc(a)
    },
    voteData: function (a, b) {
      // 如果教师端传递过来数据 则弹窗显示
      this.vote(a)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../common/css/mixin";

.app-wrapper {
  position: relative;
  width: 100%;
  min-height: 100%;
  color: #333;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(228, 250, 235, 1) 100%
  );
  .teach-tool {
    width: 100px;
    height: 100px;
    position: fixed;
    bottom: 50px;
    right: 116px;
    z-index: 200;
    .teach-title {
      position: absolute;
      width: 150px;
      height: 100px;
      border-radius: 10px;
      text-align: center;
      padding-top: 5px;
      cursor: pointer;
      z-index: 100;
      // background: #effcf4;
      .tool-icon {
        width: 68px;
        height: 68px;
        padding-top: 12px;
        background: #63d569;
        border-radius: 50%;
        .el-icon-plus {
          font-size: 40px;
          font-weight: 600;
          color: #fff;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
      .tool-txt {
        width: 68px;
        color: #30302f;
        font-size: 12px;
        margin-top: 10px;
      }
      .icon-toggle {
        transform: rotate(45deg);
      }
    }
    .teach-tool-list {
      position: absolute;
      width: 150px;
      height: 48px;
      bottom: 38px;
      left: 0;
      &.close {
        opacity: 0;
      }
      .list-item {
        border-top-left-radius: 24px;
        border-bottom-left-radius: 24px;
        position: absolute;
        bottom: 0;
        left: 10px;
        color: #30302f;
        cursor: pointer;
        // background: linear-gradient(142deg, rgba(95, 169, 255, 1) 0%, rgba(49, 112, 255, 1) 100%);
        transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.5s 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.85;
        display: flex;
        align-items: center;
        &:hover {
          // box-shadow: 0 5px 20px 10px #e8fbee;
          opacity: 1;
        }
        .tool-icon {
          width: 48px;
          height: 48px;
          img {
            width: 100%;
            border-radius: 50%;
            transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
        .tool-txt {
          width: 96px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          padding-left: 12px;
          background: linear-gradient(90deg, #fff 0%, #d4facf 100%);
          border-radius: 2px;
        }
      }
      @for $i from 1 through 5 {
        .list-item-animate1:nth-child(#{$i}) {
          transition-delay: 0.03s * $i;
          transform: translate(0, -312px + (($i - 1) * 60));
        }
      }
    }
  }
}
</style>
<style lang="scss">
.search-dialog {
  width: 930px !important;
  height: 685px;
  border-radius: 21px !important;
  // margin-top: 4vh !important;
  .el-dialog__header {
    padding: 0 !important;
    border: none !important;
    .el-dialog__headerbtn .el-dialog__close {
      font-size: 20px;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
    height: 685px !important;
  }
}
</style>
