<template>
<div class="navbar">
  <div class="navbar-max-wrapper">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- 导航栏 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="title"><b>{{classNames}}</b><span>教师端</span></div>
    <!-- <div class="title"><span>当前班级：班级2</span></div> -->
    <user-info></user-info>
    <el-dropdown class="teaching-tool"
                 :show-timeout="100">
      <span class="el-dropdown-link">
        教学工具<i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown"
                        class="teaching-tool-list">
        <el-dropdown-item @click.native="showRanking">红旗榜</el-dropdown-item>
        <el-dropdown-item @click.native="showTushAnswer">抢答器</el-dropdown-item>
        <el-dropdown-item @click.native="ruchAnswer">投票</el-dropdown-item>
        <el-dropdown-item @click.native="showTurntable">转盘</el-dropdown-item>
        <el-dropdown-item @click.native="teachSearch">课程资源检索</el-dropdown-item>
        <el-dropdown-item @click.native="issueDown">教学资源下发</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="help-file"
          @click="previewFile"><i class="iconfont">&#xe64a;</i>操作指引</span>
  </div>
  <!-- 投票 -->
  <el-dialog title="选择投票目标"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="930px"
             @touchmove.prevent>
    <vote @hiddentp='hiddentp'
          v-if="dialogVisible"
          :wqjg='wqjg'></vote>
  </el-dialog>
  <!-- 投票结果 -->
  <voteAnswer v-show="votejg"
              @voteresult=voteresult
              width="930px"
              v-if="votejg"
              @touchmove.prevent></voteAnswer>
  <!-- 教学资源下发 -->
  <el-dialog title="教学资源下发"
             :visible.sync="issueShow"
             :close-on-click-modal="false"
             width="930px">
    <issue @issueback=issueback
           v-if="issueShow"></issue>
  </el-dialog>
</div>
</template>

<script>
import {
  mapGetters,
  mapState
} from 'vuex'
import Breadcrumb from '@/components/breadcrumb'
import Hamburger from '@/components/hamburger'
import UserInfo from './user-info'
import {
  checkvote
} from '@/api/vote'
// 投票
import vote from '../castvote/index'
// 投票结果
import voteAnswer from '../castvote/castvoteAns'
// 教学资源下发
import issue from '../issue/issue'

export default {
  name: 'navbar',
  data() {
    return {
      vote: false,
      dialogVisible: false,
      votejg: false,
      issueShow: false,
      wqjg: ''
    }
  },
  components: {
    UserInfo,
    vote,
    voteAnswer,
    issue
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    ...mapState(['rushAnswerShow']),
    classNames() {
      return localStorage.getItem('CLASSNAME')
    }
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    // 显示转盘
    showTurntable() {
      if (this.turntableShow) {
        this.$store.commit('setTurntableShow', false)
      } else {
        this.$store.commit('setTurntableShow', true)
      }
    },
    // 显示抢答器
    showTushAnswer() {
      this.$store.commit('setHeight', false)
      if (this.rushAnswerShow) {
        this.$store.commit('setRushAnswerShow', false)
      } else {
        this.$store.commit('setRushAnswerShow', true)
      }
    },
    // 投票
    ruchAnswer() {
      checkvote({
        classId: localStorage.getItem('classId'),
        teacherId: localStorage.getItem('userId')
      }).then(res => {
        if (res.code == '0') {
          this.dialogVisible = !res.result
          this.votejg = res.result
          this.wqjg = '1'
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 教学资源检索
    teachSearch() {
      if (this.teachSearchShow) {
        this.$store.commit('setTeachSearchShow', false)
      } else {
        this.$store.commit('setTeachSearchShow', true)
      }
    },
    // 教学资源下发
    issueDown() {
      this.issueShow = true
    },
    issueback() {
      this.issueShow = false
    },
    //
    hiddentp(val) {
      if (val == '1') {
        // 投票结果显示
        this.votejg = false
        // 投票隐藏
        this.dialogVisible = false
      } else {
        // 投票结果显示
        this.votejg = true
        // 投票隐藏
        this.dialogVisible = false
      }
    },
    voteresult(index) {
      if (index == '0') {
        this.votejg = false
      } else if (index == '3') {
        this.votejg = false
        this.dialogVisible = false
      } else {
        this.votejg = false
        this.dialogVisible = true
        this.wqjg = '2'
      }
    },
    // 预览编辑文档
    previewFile() {
      window.open('/filePreview', '_blank')
    },
    // 显示红旗榜
    showRanking() {
      if (this.isShowRanking) {
        this.$store.commit('setRankingShow', false)
      } else {
        this.$store.commit('setRankingShow', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
  scrollbar-width: none; /* Firefox */
}
.navbar {
    height: 74px;

    .navbar-max-wrapper {
        height: 74px;
        // max-width: $width-content-max;
        padding-right: 56px;

        .hamburger-container {
            line-height: 66px;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background 0.3s;
            -webkit-tap-highlight-color: transparent;

            &:hover {
                background: rgba(0, 0, 0, .025);
            }
        }

        .breadcrumb-container {
            float: left;
        }

        // title
        .title {
            float: left;
            height: 74px;
            margin-left: 32px;
            display: flex;
            align-items: center;

            &:first-of-type {
                span {
                    border-left: 1px solid #333;
                    padding-left: 10px;

                }
            }
            &:first-of-type {
                b {
                    font-size: 18px;
                    margin-right: 10px;
                    font-weight: normal;
                }
            }

            // title
            .title {
                float: left;
                height: 74px;
                margin-left: 32px;
                display: flex;
                align-items: center;
                &:first-of-type {
                    b {
                        font-weight: normal;
                        margin-right: 8px;
                        font-size: 18px;
                    }
                }
                &:first-of-type {
                    span {
                        border-left: 1px solid #333;
                    }
                }

                span {
                    display: inline-block;
                    height: 22px;
                    line-height: 20px;
                    font-size: 18px;
                    padding-left: 12px;
                }
            }
        }

        /*  教学工具*/
        .teaching-tool {
            height: 100%;
            float: right;
        }

        /*操作指引*/
        .help-file {
            float: right;
            font-size: 12px;
            line-height: 70px;
            color: #666;
            margin-right: 20px;
            cursor: pointer;
            position: relative;
            padding-left: 30px;

            i {
                font-size: 28px;
                color: $color-theme;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}
</style>
