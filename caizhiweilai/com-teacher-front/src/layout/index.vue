<template>
<div :class="classObj" class="app-wrapper">
  <sidebar class="sidebar-container"></sidebar>
  <div class="main-container">
    <div class="navbar-wrapper">
      <navbar></navbar>
      <tags-view />
    </div>
    <app-main></app-main>
  </div>
  <!-- 转盘 -->
  <turntabl-dialog v-if="turnLottery"></turntabl-dialog>
  <!-- 投票 -->
  <ruch-answers v-if="rushAnswerShow"></ruch-answers>
  <!-- 转盘选择学生 -->
  <choose-study v-if="turntableShow"></choose-study>
  <!-- 查看往期结果 -->
  <lottery-result v-if="lotteryResult"></lottery-result>
  <!-- 教学资源检索 -->
  <teach-search v-if="teachSearchShow"></teach-search>
  <!-- 红旗排行榜-->
  <ranking-list v-if="isShowRanking"></ranking-list>

  <!-- 初始化弹窗 -->
  <el-dialog title="课程初始化" width="980px"
    custom-class="init-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :visible.sync="dialogInit">
    <initialization v-if="dialogInit" path="1"></initialization>
  </el-dialog>

  <!-- 初始化列表 -->
  <el-dialog  width="980px"
    custom-class="init-list-dialog"
    :close-on-click-modal="false"
    :show-close="false"
    :visible.sync="dialogInitList">
    <initList v-if="dialogInitList"></initList>
  </el-dialog>

</div>
</template>

<script>
import AppMain from './components/app-main'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import TagsView from './components/tags-view'
import ChooseStudy from '@/components/teachingTool/chooseStudy' // 转盘使用选择学生弹窗
import TurntablDialog from '@/components/teachingTool/turntable' // 转盘
import LotteryResult from '@/components/teachingTool/lotteryResult' // 抽奖结果
import ruchAnswers from '@/components/teachingTool/ruchAnswer' // 投票
import teachSearch from './components/teach-tool/teach-search' // 教学资源检索
import rankingList from '@/components/teachingTool/rankingList' // 红旗排行榜
// 初始化
import initialization from '@/components/initialization/index'
import initList from '@/components/initialization/list'

import {
  mapGetters,
  mapState
} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    ...mapState([
      'turntableShow',
      'rushAnswerShow',
      'teachSearchShow',
      'turnLottery',
      'lotteryResult',
      'isShowRanking',
      'dialogInit',
      'dialogInitList'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    TurntablDialog,
    ruchAnswers,
    ChooseStudy,
    teachSearch,
    LotteryResult,
    rankingList,
    initialization,
    initList
  },
  mounted() {
    this.getWindowHeight()
  },
  methods: {
    // 获取屏幕高度设置全局高度
    getWindowHeight() {
      this.$store.state.windowHeight = window.innerHeight
    }
  }
}
</script>

<style lang="scss">
.app-wrapper {
    position: relative;
    min-height: 100vh;
    .main-container {
        transition: margin-left 0.28s;
        margin-left: 180px;
    }
    // .fixed-header {
    //   position: fixed;
    //   top: 0;
    //   right: 0;
    //   z-index: 9;
    //   width: calc(100% - #{$sideBarWidth});
    //   transition: width 0.28s;
    // }
    // .hideSidebar .fixed-header {
    //   width: calc(100% - 54px)
    // }

    .init-dialog {
      border-radius: 4px;
      .el-dialog__body {
        height: 635px;
        overflow: auto;
      }
    }
    .init-list-dialog {
      border-radius: 4px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        height: 685px;
        padding: 0;
      }
    }
}
</style>
