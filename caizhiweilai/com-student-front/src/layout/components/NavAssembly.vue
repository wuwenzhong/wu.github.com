<template>
  <div class="header-wrapper" :class="{'header-wrapper-hide': !visible}">
    <img src="@/common/images/logo.png" alt class="header-logo" @click="returnHome()" />
    <div class="header-center">
      <el-menu
        :default-active="$route.path"
        align="center"
        mode="horizontal"
        text-color="#6C789A"
        active-text-color="#3DD471"
      >
        <template v-for="(item, index) in routers" class="menu-items">
          <template>
            <el-menu-item :index="item.url" @click="toPage(item)" :key="index">{{item.name}}</el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
    <span class="help-file" @click="previewLook()">操作指引</span>
    <div class="head-right">
      <img :src="avatar" alt v-if="avatar != ''" />
      <img src="../../common/images/default_head.png" alt v-else />
      <el-dropdown :show-timeout="100" class="drop-box">
        <span class="el-dropdown-link">
          <em>{{ userName }}</em>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu>
          <el-dropdown-item
            @click.native="signOutClass"
            v-if="this.$route.path != '/index'"
            ><span
              class="iconfont icontuichu"
              style="margin-right: 10px;"
            ></span
            >退出实训班级
          </el-dropdown-item>
          <el-dropdown-item @click.native="usercenter"
            ><span
              class="iconfont iconyonghu"
              style="margin-right: 10px;"
            ></span
            >用户中心
          </el-dropdown-item>
          <el-dropdown-item @click.native="logOut"
            ><span
              class="iconfont icontuichu"
              style="margin-right: 10px;"
            ></span
            >退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { activeAnswer, studentRanking, teamRanking } from '@/api/teacherTools.js'
import { mapGetters, mapActions } from 'vuex'
import { delClassRecord } from '@/api/classListHome'
import { resultVote } from '@/api/vote'
import vote from '@/components/vote'
import voteAnswer from '../../components/vote/castvoteAns'
import gather from '../components/gather'

export default {
  data() {
    return {
      className: '',
      userIds: [],
      voteShow: true,
      dialogVisible: false,
      votejg: false,
      collectShow: false,
      voteStartData: {},
      voteRes: {},
      visible: true,
      HIDE_HEIGHT: 100,
      routers: [
        {
          name: '首页',
          url: '/home',
          index: '1'
        }, {
          name: '实训中心',
          url: '/training',
          index: '2'
        }, {
          name: '我的团队',
          url: '/team',
          index: '3'
        }, {
          name: '我的成绩',
          url: '/result',
          index: '4'
        }, {
          name: '实训总结',
          url: '/summarize',
          index: '5'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userCenterUrl', 'userName', 'userId'])
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    returnHome() {
      if (this.$route.name === 'home') return
      this.$router.push({ name: 'home' })
    },
    handleScroll() {
      if (window.scrollY < this.scrollY) {
        if (!this.visible) {
          this.visible = true
        }
      }
      if (window.scrollY >= this.HIDE_HEIGHT && window.scrollY > this.scrollY) {
        if (this.visible) {
          this.visible = false
        }
      }
      this.scrollY = window.scrollY
    },
    toPage(val) {
      if (this.$route.fullPath === val.url) {
        return false
      }
      this.$router.push(val.url)
    },
    // 预览编辑文档
    previewLook() {
      window.open('/filePreview', '_blank')
    },
    // 删除进班记录方法
    delClassRecordFun(staus) {
      this.userIds.length = [] // 清除内容
      const userId = localStorage.getItem('userId')
      this.userIds.push(userId)
      delClassRecord({
        userIds: this.userIds,
        classId: localStorage.getItem('classId'),
        customerId: localStorage.getItem('customerId'),
        courseId: localStorage.getItem('courseId')
      }).then(res => {
        if (res.code === '0') {
          if (staus === 1) {
            this.$router.push('/')
          }
          if (staus === 2) {
            this.Logout()
          }
          if (staus === 3) {
            location.href =
              localStorage.getItem('centerUrl') +
              '?flag=1'
          }
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 监听回退
    watchHistory() {
      if (this.$route.path === '/index') {
        this.delClassRecordFun()
        // 清除掉store中存储的大纲id和当前所在下标
        localStorage.removeItem('currentOUT')
        localStorage.removeItem('currentINDEX')
      }
    },
    // 退出实训班级
    signOutClass() {
      this.$confirm('确定退出实训班级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除掉store中存储的大纲id和当前所在下标
          localStorage.removeItem('currentOUT')
          localStorage.removeItem('currentINDEX')
          localStorage.removeItem('teamId')
          // 删除进班记录
          this.delClassRecordFun(1)
          // 退出实训班级关闭连接
          this.oncloseWs(1)
        })
        .catch(() => {})
    },
    // 退出登陆
    logOut() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除掉store中存储的大纲id和当前所在下标
          localStorage.removeItem('currentOUT')
          localStorage.removeItem('currentINDEX')
          localStorage.removeItem('teamId')
          if (this.$route.path === '/index') {
            this.Logout()
          } else {
            // this.Logout()
            this.delClassRecordFun(2)
            // 退出登录关闭连接
            this.oncloseWs(1)
          }
        })
        .catch(() => {})
    },
    // 用户中心
    usercenter() {
      this.$confirm('确定返回用户中心吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除掉store中存储的大纲id和当前所在下标
          localStorage.removeItem('currentOUT')
          localStorage.removeItem('currentINDEX')
          localStorage.removeItem('teamId')
          if (this.$route.path === '/index') {
            location.href =
              localStorage.getItem('centerUrl') +
              '?flag=1'
          } else {
            // 进入关闭连接
            this.oncloseWs(1)
            this.delClassRecordFun(3)
          }
        })
        .catch(() => {})
    },
    ...mapActions(['Logout']),
    // 显示抢答器
    showTushAnswer() {
      this.$store.commit('setHeight', false)
      const classId = localStorage.getItem('classId')
      const studentId = localStorage.getItem('userId')
      activeAnswer({
        classId,
        studentId
      }).then(res => {
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
    // 显示红旗榜
    showRanking() {
      this.$store.commit('setRanking', true)
    },
    // 投票
    vote(checkId) {
      const voteId = checkId == 1 ? '' : checkId
      resultVote({
        voteId: voteId,
        creator: localStorage.getItem('userId'),
        classId: localStorage.getItem('classId')
      }).then(res => {
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
      this.collectShow = false
      if (val.content.flag == '下发') {
        this.$confirm('你收到了老师新下发的教学资源，是否去查看？', '提示', {
          confirmButtonText: '立即查看',
          cancelButtonText: '稍后查看',
          type: 'warning'
        })
          .then(async () => {
            this.collectShow = true
          })
          .catch(arr => {
            // this.$message.info('稍后查看')
          })
      } else {
        // this.$confirm('老师回收了' + val.content.name + '这条教学资源，是否去查看？', '提示', {
        //   confirmButtonText: '立即查看',
        //   cancelButtonText: '稍后查看',
        //   type: 'warning'
        // })
        //   .then(async () => {
        this.collectShow = true
        // }).catch(arr => {
        //   // this.$message.info('稍后查看')
        // })
      }
    },
    votehidden(val) {
      // 关闭投票弹窗
      if (val == 1) {
        this.dialogVisible = false
      } else {
        this.vote('1')
      }
    },
    // 教学资源检索
    teachSearch() {
      if (this.teachSearchShow) {
        this.$store.commit('setTeachSearchShow', false)
      } else {
        this.$store.commit('setTeachSearchShow', true)
      }
    },
    voteresult() {
      this.votejg = false
    },
    collectsq() {
      this.collectShow = true
    },
    cancelsq() {
      this.collectShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-wrapper {
    display: flex;
    position: fixed;
    top: 0;
    z-index: 99;
    width: 100%;
    min-width: 1200px;
    height: 60px;
    padding: 0 110px;
    background: #fff;
    transition: transform 0.3s ease;
    box-shadow: 0px 4px 4px 0px rgba(55, 72 , 60, 0.1);
    &-hide {
      transform: translateY(-100%);
    }
    em, i {
      font-style: normal;
    }
    .header-logo {
      display: inline-block;
      width: 270px;
      cursor: pointer;
    }
    .header-center {
      flex: 1;
      text-align: center;
      .el-menu--horizontal {
        display: inline-block;
        border-bottom: none;
        .el-menu-item {
          height: 58px;
          line-height: 62px;
          padding: 0 5px;
          margin: 0 16px;
          font-size: 16px;
          &.is-active {
            border-bottom: 4px solid #3DD471;
            border-radius: 2px;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .help-file {
      font-size: 14px;
      line-height: 60px;
      margin-right: 44px;
      padding-left: 30px;
      cursor: pointer;
    }
    .head-right {
      display: flex;
      img {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        margin-top: 18px;
      }
      .drop-box {
        font-size: 14px;
        line-height: 60px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
</style>
