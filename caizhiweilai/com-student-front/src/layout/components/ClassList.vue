<template>
<div class="app-mian">
  <div class="app-header">
    <div class="main-center">
      <!-- logo -->
      <div class="app-logo fl">
        <img src="@/common/images/app-logo.png"
             alt />
      </div>
      <!-- 学生名字 -->
      <div class="app-title fl">财智未来综合实训平台</div>
      <div class="app-name fl">学生端</div>
      <!-- 学生信息 -->
      <div class="app-user fr">
        <el-dropdown :show-timeout="100"
                     class="drop-box">
          <span class="el-dropdown-link">
            <img :src="avatar"
                 alt
                 v-if="avatar!=''" />
            <img src="../../common/images/default_head.png"
                 alt
                 v-else />
            <span class='app-user-name'>{{userName}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="usercenter"><span class="iconfont iconyonghu"
                    style="margin-right: 10px;"></span>用户中心</el-dropdown-item>
            <el-dropdown-item @click.native="logOut"><span class="iconfont icontuichu"
                    style="margin-right: 10px;"></span>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
  <!-- nav -->
  <div class="app-nav">
    <div class="main-center">
      <div class="app-school-msg fl">
        <div class="fl school-img">
          <img :src="schoolMsg.coverUrl"
               alt="">
        </div>
        <dl>
          <dt>{{schoolMsg.customerName}}</dt>
          <dd>
            <img src="@/common/images/address.png"
                 alt="">
            <span>{{schoolMsg.province+' '+schoolMsg.city}}</span>
          </dd>
        </dl>
      </div>
      <div class="app-class-search fr">
        <el-input placeholder="请输入班级名称"
                  v-model.trim="searchClass"
                  @keyup.enter.native='searchClassHandler'>
          <template slot="append">
            <el-button icon="el-icon-search"
                       @click='searchClassHandler'></el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
  <div class="app-tab">
    <div class="main-center">
      <el-tabs v-model="tabActive"
               @tab-click="tabHandler">
        <el-tab-pane name="ongoing">
          <div slot="label">
            <div class="tab-text">
              <img src="@/common/images/ongoingActive.png"
                   alt=""
                   v-show='tabActive=="ongoing"'>
              <img src="@/common/images/ongoing.png"
                   alt=""
                   v-show='tabActive!="ongoing"'>
              <span>进行中（{{stuClassNums.startClassCount}}）</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="nostart">
          <div slot="label">
            <div class="tab-text">
              <img src="@/common/images/nostartActive.png"
                   alt=""
                   v-show='tabActive=="nostart"'>
              <img src="@/common/images/nostart.png"
                   alt=""
                   v-show='tabActive!="nostart"'>
              <span>未开始（{{stuClassNums.noStartClassCount}}）</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="finisheds">
          <div slot="label">
            <div class="tab-text">
              <img src="@/common/images/finishedsActive.png"
                   alt=""
                   v-show='tabActive=="finisheds"'>
              <img src="@/common/images/finisheds.png"
                   alt=""
                   v-show='tabActive!="finisheds"'>
              <span>已结束（{{stuClassNums.endClassCount}}）</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div class="app-class-list"
       ref='appMian'>
    <div class="noData"
         ref="noCont"
         v-show='classArr.length==0'>
      <img src="@/common/images/noData.png"
           alt="" />
    </div>
    <div class="app-class-list-center"
         v-show='classArr.length!=0'>
      <div :class="['app-class-list-main',tabActive=='nostart'?'class-edit-status':'']"
           v-for='item of classArr'
           :key='item.id'>
        <div class="class-bg">
          <img :src="item.cover==''?coverImgArr[0]:coverImgArr[Number(item.cover)]"
               alt="">
        </div>
        <div class="class-mian">
          <div class="class-edit">
            <div class="class-edit-box">
            </div>
          </div>
          <div class="class-title class-part">{{item.className}}</div>
          <div class="class-curriculun  class-part">
            <label for="">所属课程：</label>
            <span>{{item.courseName}}</span>
          </div>
          <div class="class-time class-part">
            <label for="">上课时间：</label>
            <span>{{item.startTime}}</span>
          </div>
          <div class="class-count class-part">
            <label for="">学生数量：</label>
            <span>{{item.joinedNum>0?item.joinedNum:0}}人</span>
          </div>
          <div class="class-teacher class-part">
            <label for="">主讲老师：</label>
            <span>{{item.teacherName}}</span>
          </div>
          <div class="class-enter">
            <span @click="toDetail(item)">进入</span>
          </div>
        </div>
      </div>
    </div>
    <div class="page"
         v-show='classPage.total>9'>
      <el-pagination layout="prev, pager, next"
                     :total="classPage.total"
                     @current-change='pageHandler'
                     :pageSize='classPage.size'
                     :current-page.sync='classPage.page'>
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  stuClassNum,
  classList,
  classCheck,
  schoolMessage
} from '@/api/classListHome'
import {
  getInfo
} from '@/api/user'
var imgData = [require('../../common/images/fengmian0.png'), require('../../common/images/fengmian1.png'), require('../../common/images/fengmian2.png'), require('../../common/images/fengmian3.png'), require('../../common/images/fengmian4.png'), require(
  '../../common/images/fengmian5.jpg'), require('../../common/images/fengmian6.png'), require('../../common/images/fengmian7.png')]
//新提交的
export default {
  name: 'classList',
  data() {
    return {
      // 封面图片
      coverImgArr: imgData,
      tabActive: 'ongoing', // table 默认选中
      classArr: [], //  列表
      classPage: { // 列表页数
        page: 1, // 当前页
        size: 9, // 每页显示条数
        total: 0
      },
      searchClass: '', // 搜索班级
      schoolMsg: {}, // 学校信息
      num: 1,
      stuClassNums: {},
      dataList: [],
      userId: '',
      customid: '' // 用户id
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName'])
  },
  created() {
    if (this.$route.query.orgId) {
      localStorage.setItem('customerId', this.$route.query.orgId)
    }
    this.customid = localStorage.getItem('customerId')
  },
  mounted() {
    this.getInfo()
    // 学生端每次进入到列表页清除缓存
    localStorage.removeItem('currentOUT')
    localStorage.removeItem('currentINDEX')
  },
  methods: {
    ...mapActions(['Logout']),
    // 分页
    pageHandler(page) {
      this.classPage.page = page
      this.searchClassHandler()
    },
    logOut() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
          type: 'warning'
        })
        .then(() => {
          this.Logout()
        })
        .catch(() => {})
    },
    // 用户中心
    usercenter() {
      this.$confirm('确定返回用户中心吗？', '提示', {
          type: 'warning'
        })
        .then(() => {
          location.href = localStorage.getItem('centerUrl') + '?flag=1'
        })
        .catch(() => {})
    },
    // 搜索班级
    searchClassHandler(obj) {
      // 0 未开始 1 进行中 2 已结束
      let status = ''
      obj ? status = obj : status = this.tabActive
      switch (status) {
      case 'ongoing':
        this.num = 1
        break
      case 'nostart':
        this.num = 0
        break
      case 'finisheds':
        this.num = 2
        break
      default:
      }
      this.classList(this.num)
    },
    // 获取学校信息
    schoolInfo() {
      schoolMessage({
        customerId: this.customid
      }).then(res => {
        if (Number(res.code == 0)) {
          this.schoolMsg = res.result
        }
      })
    },
    // tab点击
    tabHandler(tab, event) {
      this.searchClass = ''
      this.classPage.page = 1
      this.searchClassHandler(tab.name)
      // 滚动条回到顶部
      const mian = this.$refs.appMian
      mian.scrollTo(0, 0)
    },
    // 获取用户id接口
    getInfo() {
      const _this = this
      getInfo().then(res => {
        if (res.code === '0') {
          _this.userId = res.result.id
          localStorage.setItem('userId', res.result.id)
          localStorage.setItem('userName', res.result.name)
          _this.schoolInfo()
          _this.stuClassNum()
          _this.classList(1)
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 查询出该学生加入或者未加入的班级状态
    stuClassNum() {
      stuClassNum(this.userId, this.customid).then(res => {
        if (res.code === '0') {
          this.stuClassNums = res.result
        } else if (res.code === '101') {
          this.$message.warning(res.message)
        }
      })
    },
    // 查询不同状态下的班级列表
    async classList(stu) {
      // queryType 1学生 2教师 、userId登陆用户id 、classStatus 0 未开始 1 进行中 2 已结束 、 page当前页 、 size每页条数 、customerId客户id
      const res = await classList(1, this.userId, stu, this.classPage.page, this.classPage.size, this.customid, this.searchClass)
      if (res.code === '0') {
        if (parseInt(res.code) == 0) {
          this.classArr = res.result.data
          this.classPage.total = Number(res.result.total)
        } else {
          this.$message.warning(res.message)
        }
      }
    },
    // 进入班级
    toDetail(item) {
      localStorage.setItem('CLASSNAME', item.courseName)
      localStorage.setItem('classId', item.id)
      localStorage.setItem('courseId', item.courseId)
      localStorage.setItem('teacherId', item.teacherId)
      classCheck({
        userId: localStorage.getItem('userId'),
        classId: item.id,
        customerId: this.customid,
        courseId: item.courseId
      }).then(res => {
        if (parseInt(res.code) == 0) {
          localStorage.setItem('classId', item.id)
          this.$router.push({
            path: '/home'
          })
          // 实训开始了建立长连接
          this.createSocket()
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style scope lang="scss">
.app-mian {
    width: 100%;
    height: 100vh;
    background: #f7f8fa;
    overflow: hidden;
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .main-center {
        width: 1200px;
        height: auto;
        overflow: hidden;
        margin: 0 auto;
    }
    // head
    .app-header {
        width: 100%;
        height: 70px;
        line-height: 70px;
        overflow: hidden;
        display: flex;
        .app-logo {
            position: relative;
            margin-right: 35px;
            img {
                margin-top: 18px;
            }
        }
        .app-title {
            position: relative;
            margin-right: 35px;
            &:after {
                content: '|';
                position: absolute;
                right: -20px;
                color: #D8D8D8;
            }
        }
        .app-user {
            display: flex;
            margin-right: 40px;
            cursor: pointer;
            img {
                width: 42px;
                height: 42px;
                border-radius: 100%;
                margin-top: 14px;
                display: block;
                float: left;
            }
            .app-user-name {
                margin: 0 8px;
                color: #909398;
            }
        }
    }
    // nav
    .app-nav {
        width: 100%;
        height: 246px;
        background: url("../../common/images/index-nav.png") no-repeat center center;
        background-size: cover;
        .main-center {
            display: flex;
            .app-school-msg {
                flex: 1;
                width: auto;
                height: auto;
                overflow: hidden;
                margin-top: 85px;
                .school-img {
                    width: 103px;
                    height: 103px;
                    border-radius: 3px;
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                        margin-right: 25px;
                    }
                }
                > dl {
                    float: left;
                    margin-left: 25px;
                    > dt {
                        color: #fff;
                        font-size: 28px;
                        margin: 18px 0 10px;
                    }
                    > dd {
                        color: #fff;
                        > img {
                            vertical-align: sub;
                            margin-right: 5px;
                        }
                    }
                }
            }
            .app-class-search {
                margin-top: 104px;
                width: 30%;
                .el-input-group__append {
                    background: #00B38A!important;
                    border: 1px solid #00B38A;
                    color: #fff;
                }
            }
        }
    }
    // app-tab
    .app-tab {
        height: 60px;
        .tab-text {
            text-align: center;
            > img {
                margin-top: 20px;
                margin-right: 10px;
                vertical-align: middle;
            }
            > span {
                margin-top: 10px;
                vertical-align: text-top;
            }
        }
        .el-tabs__nav-wrap::after {
            background: none;
        }
        .el-tabs__nav {
            width: 100%;
        }
        .el-tabs__item {
            height: 60px;
            width: 33.33%;
            div {
                height: 60px;
            }
        }
    }
    .app-class-list {
        width: 100%;
        display: flex;
        height: calc(100vh - 70px - 246px - 60px - 20px);
        background: url("../../common/images/banner-bg.png") no-repeat center center;
        background-size: cover;
        flex-wrap: wrap;
        overflow: auto;
        &-center {
            width: 1200px;
            height: auto;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            &:after {
                content: "";
                height: 0;
                width: 32%;
            }
        }
        &-part {
            box-sizing: border-box;
            padding: 24px;
            &-part-add {
                border-radius: 6px;
                border: 1px dashed #BABABA;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                p {
                    color: #323937;
                    font-size: 16px;
                }
            }
        }
        .class-edit-status {
            &:hover {
                .class-mian {
                    .class-edit {
                        .class-edit-box {
                            display: block;
                        }
                    }
                }
            }
        }
        .app-class-list-main {
            min-width: 352px;
            max-width: 352px;
            height: 440px;
            margin-top: 15px;
            margin-bottom: 25px;
            margin-left: 10px;
            border-radius: 10px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            transition: all 0.2s;
            display: flex;
            flex: 3;
            flex-direction: column;
            border-radius: 20px;
            background: #fff;
            &:hover {
                box-shadow: 0 1px 8px 0 #ccc;
                transform: scale(1.02);
                cursor: pointer;
                .class-mian {
                    .class-enter {
                        display: block;
                    }
                }
            }
            .class-bg {
                width: 352px;
                height: 152px;
                > img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .class-mian {
                width: 350px;
                height: auto;
                overflow: hidden;
                box-sizing: border-box;
                font-size: 12px;
                color: #7A7A7A;
                .class-part {
                    margin-bottom: 20px;
                    padding-left: 20px;
                    padding-right: 10px;
                }
                .class-title {
                    font-size: 16px;
                    color: #323937;
                }
                .class-edit {
                    margin-top: 20px;
                    box-sizing: border-box;
                    padding-right: 10px;
                    text-align: right;
                    height: 20px;
                    .class-edit-box {
                        display: none;
                        > img {
                            margin-right: 10px;
                        }
                    }
                }
                .class-enter {
                    display: none;
                    > span {
                        display: block;
                        width: 270px;
                        height: 36px;
                        border-radius: 30px;
                        background: #00B38A;
                        color: #FFF;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        letter-spacing: 4px;
                        margin: 0 auto;
                    }
                }
            }
        }
        .page {
            width: 1200px;
            margin: 0 auto;
            text-align: center;
            height: 70px;
            border-radius: 4px;
            padding-top: 10px;
            .el-pagination {
                background: #fff;
                color: #7A7A7A;
                padding: 8px 5px;
            }
            .el-pagination .btn-next,
            .el-pagination .btn-prev {
                border-radius: 100%;
                border-radius: 100%;
                padding: 0;
                min-width: 20px;
                max-height: 20px;
                line-height: 20px;
                margin-top: 3px;
                border: 1px solid #7A7A7A;
            }
            .el-pagination button:disabled {
                border-color: #C0C4CC;
            }
        }
    }
    .noData {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
}
.user-operation {
    padding-left: 10px;
    i {
        margin-right: 10px;
    }
    .operation-item {
        margin: 10px 0;
        font-size: $font-size-medium;
        cursor: pointer;
        &:hover {
            transition: color 0.3s ease;
            color: $color-theme;
        }
        .menuText {
            font-size: 14px;
        }
    }
}
@media screen and (max-width: 1600px) {
    .app-mian {
        width: 100%;
        overflow: auto;
        .main-center {
            width: 90%;
        }
        .app-class-list-center {
            width: 90%;
        }
        .app-class-list {
            height: auto;
            overflow-y: auto;
        }
        .noData {
            img {
                margin: 60px 0;
            }
        }
        .app-class-search {
            width: 300px;
        }
    }
}
</style>
