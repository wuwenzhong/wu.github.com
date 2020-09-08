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
      <div class="app-name fl">教师端</div>
      <!-- 学生信息 -->
      <div class="app-user fr">
        <el-popover placement="top-start"
          width="150"
          trigger="hover">
          <div class="user-operation">
            <div class="operation-item"
              v-for="item in operation"
              :key="item.id"
              @click="handleOperation(item.id)">
              <i class="iconfont"
                :class="item.icon"></i>
              <span class="menuText">{{item.name}}</span>
            </div>
          </div>
          <div class="user-info"
            slot="reference">
            <span class="user-img">
              <img :src="avatar"
                alt />
            </span>
            <span class="username">
              {{userName}}
              <i class="iconfont iconsanjiao"></i>
            </span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
  <!-- nav -->
  <div class="app-nav">
    <div class="main-center">
      <div class="app-school-msg fl"
        v-show='schoolMsg.address'>
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
          v-model="searchClass"
          @keyup.enter.native='searchClassHandler'>
          <template slot="append">
            <el-button icon="el-icon-search"
              @click='searchClassHandler'></el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
  <!-- tab -->
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
              <span>进行中（{{classNums.startClassCount}}）</span>
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
              <span>未开始（{{classNums.noStartClassCount}}）</span>
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
              <span>已结束（{{classNums.endClassCount}}）</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <!-- list -->
  <div class="app-class-list"
    ref='appMian'>
    <div class="app-class-list-center">
      <div class="app-class-list-main app-class-list-part">
        <div class="app-class-list-part-add">
          <img src="@/common/images/add-class.png"
            alt=""
            @click="cjbj(1)" />
          <p>创建班级</p>
        </div>
      </div>
      <div :class="['app-class-list-main',tabActive=='nostart'?'class-edit-status':'']"
        v-for='item of classArr'
        :key='item.id'>
        <div class="class-bg">
          <img :src="item.cover==''?coverImgArr[0]:coverImgArr[Number(item.cover)]"
            alt="" />
        </div>
        <div class="class-mian">
          <div class="class-edit">
            <div class="class-edit-box">
              <img src="@/common/images/index-edit.png"
                alt=""
                @click='cjbj(2,item)'
                title="编辑" />
              <img src="@/common/images/index-delete.png"
                alt=""
                title='删除'
                @click='deleteClass(item)' />
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
            <span>{{userName}}</span>
          </div>
          <div class="class-enter">
            <span @click="jrBj(item)">进入</span>
          </div>
        </div>
      </div>
    </div>
    <div class="page"
      v-show='classPage.total>8'>
      <el-pagination layout="prev, pager, next"
        :total="classPage.total"
        @current-change='pageHandler'
        :pageSize='classPage.size'
        :current-page.sync='classPage.page'>
      </el-pagination>
    </div>
  </div>
  <!-- 创建班级dialog -->
  <el-dialog custom-class="create-class"
    :before-close="closeDialog"
    :title="dialogType+'班级'"
    :close-on-click-modal="false"
    width="520px"
    :visible.sync="cjbj_dialogFormVisible">
    <el-form :model="cjbjForm"
      ref="cjbjForm"
      :rules="rules">
      <el-form-item label="选择课程"
        prop="courseName"
        :label-width="formLabelWidth">
        <el-select v-model="cjbjForm.courseName"
          @change="selVal"
          style="width:100%;"
          placeholder="请选择课程">
          <el-option v-for="item in bjlbData"
            :key="item.id"
            :label="item.courseName"
            :value="item.courseName">{{item.courseName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称"
        prop="className"
        :label-width="formLabelWidth">
        <el-input v-model="cjbjForm.className"
          autocomplete="off"
          maxlength="20"
          show-word-limit
          placeholder="请输入班级名称,限制20个字"></el-input>
      </el-form-item>
      <el-form-item label="上课时间"
        required
        :label-width="formLabelWidth">
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-date-picker type="date"
              placeholder="选择日期"
              :picker-options="startTime"
              v-model="cjbjForm.startTime"
              format="yyyy 年 MM 月 dd 日 "
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              @focus="focusStart"
              @change="changeStart">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line"
          :span="2"
          style="text-align: center;line-height: 40px;">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-date-picker type="date"
              placeholder="选择日期"
              v-model="cjbjForm.endTime"
              :picker-options="endTime"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              @focus="focusEnd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="班级描述"
        :label-width="formLabelWidth"
        prop="description">
        <el-input type="textarea"
          maxlength="200"
          show-word-limit
          v-model="cjbjForm.description"></el-input>
      </el-form-item>
      <el-form-item label="主讲教师"
        :label-width="formLabelWidth">
        <el-input type="text"
          disabled
          :value="userName"></el-input>
      </el-form-item>
      <el-form-item label="封面图片"
        :label-width="formLabelWidth">
        <div class="cover-photo">
          <i :class="['el-icon-arrow-left','fl',iconStatus.left?'':'active']"
            @click='bannerImgChose(0)'></i>
          <div class="cover-photo-box fl">
            <ul class=''
              ref='fenBox'
              :style='styleObj'>
              <li v-for='(item,index) of coverImgArr'
                @click='chosrFen(index)'
                :key='index'
                :class='index==cover?"active":""'>
                <img :src="item"
                  alt="" />
              </li>
            </ul>
          </div>
          <i :class="['el-icon-arrow-right','fl',iconStatus.right?'':'active']"
            @click='bannerImgChose(1)'></i>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer"
      class="dialog-footer">
      <el-button type="default"
        @click="closeDialog">取 消</el-button>
      <el-button type="primary"
        v-preventReClick
        @click="submitForm('cjbjForm')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  classNum,
  addClass,
  buyCourse,
  classList,
  editClass,
  schoolMessage,
  deleteClass
} from '@/api/createdClass'
import {
  getInfo
} from '@/api/user'
import {
  deepClone
} from '@/common/js/utils.js'
import {
  trainStatus
} from '@/api/sxgk.js'
var imgData = [require('../common/images/fengmian0.png'), require('../common/images/fengmian1.png'), require('../common/images/fengmian2.png'), require('../common/images/fengmian3.png'), require('../common/images/fengmian4.png'), require(
  '../common/images/fengmian5.jpg'), require('../common/images/fengmian6.png'), require('../common/images/fengmian7.png')]
export default {
  data() {
    return {
      styleObj: {
        left: 0,
        width: imgData.length * 139 + 'px'
      },
      // 用户id
      currentUserId: '',
      // 封面图片
      coverImgArr: imgData,
      // 封面图片默认选中
      cover: 0,
      // 默认选中进行中
      tabActive: 'ongoing',
      // 搜索班级
      searchClass: '',
      //  列表
      classArr: [],
      // 列表页数
      classPage: {
        page: 1, // 当前页
        size: 8, // 每页显示条数
        total: 0
      },
      // 学校信息
      schoolMsg: {},
      // 存储班级数量
      classNums: {},
      // 弹窗title
      dialogType: '创建',
      // 弹窗展示
      cjbj_dialogFormVisible: false,
      // 弹窗信息
      cjbjForm: {
        className: '',
        courseId: '',
        startTime: '',
        endTime: '',
        description: '',
        courseName: '',
        courseUrl: ''
      },
      // 弹窗下拉框数据
      bjlbData: [],
      // 弹窗label宽度
      formLabelWidth: '78px',
      // 弹窗验证规则
      rules: {
        courseName: [
          {
            required: true,
            message: '请选择课程',
            trigger: 'blur'
          }
        ],
        className: [
          {
            required: true,
            message: '请输入班级名称',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择上课结束时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择上课开始时间',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入班级描述',
            trigger: 'blur'
          }
        ]
      },
      // 开始时间不能大于结束时间
      startTime: {
        disabledDate: time => {
          const endTime = this.cjbjForm.endTime
          if (endTime) {
            return time.getTime() > new Date(endTime).getTime()
          } else {
            // 还没有选择结束时间的时候，让他只能选择今天以后的时间包括今天
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      endTime: {
        disabledDate: time => {
          const startTime = this.cjbjForm.startTime
          if (startTime) {
            return (
              time.getTime() > Date.now ||
              time.getTime() < new Date(startTime).getTime()
            )
          } else {
            return time.getTime() < Date.now()
          }
        }
      },
      operation: [
        {
          id: 1,
          name: '用户中心',
          icon: 'iconyonghu'
        },
        {
          id: 2,
          name: '退出登录',
          icon: 'icontuichu'
        }
      ],
      num: 1,
      id: '',
      customid: '',
      iconStatus: {
        left: true,
        right: true
      }
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName', 'userId'])
  },
  created() {
    if (this.$route.query.orgId) {
      localStorage.setItem('customerId', this.$route.query.orgId)
    }
    this.customid = localStorage.getItem('customerId')
    // 获取用户信息
    this.getInfo()
  },
  methods: {
    ...mapActions(['Logout']),
    // 封面图片选择
    bannerImgChose(num) {
      const len = this.coverImgArr.length * 139
      const lef = this.$refs.fenBox.style.left
      // 剩余的宽度
      const wid = len - Math.abs(parseInt(lef)) - 360 - 10
      if (num) {
        // 右边
        if (wid > 139) {
          this.$refs.fenBox.style.left = parseInt(lef) - 139 + 'px'
          this.iconStatus.left = true
        } else {
          if (Math.abs(parseInt(lef)) > len - 360) {
            return false
          }
          this.$refs.fenBox.style.left = 0 - (len - 360 - 10) + 'px'
          this.iconStatus.right = false
        }
      } else {
        // 左边
        if (parseInt(lef) == 0) {
          return false
        }
        if (Math.abs(parseInt(lef)) < 139) {
          this.$refs.fenBox.style.left = '0px'
          this.iconStatus.left = false
        } else {
          this.$refs.fenBox.style.left = parseInt(lef) + 139 + 'px'
          this.iconStatus.right = true
        }
      }
    },
    // 分页
    pageHandler(page) {
      this.classPage.page = page
      this.searchClassHandler()
    },
    // 选择封面图片
    chosrFen(num) {
      this.cover = num
    },
    // 删除班级
    async deleteClass(item) {
      this.$confirm('是否删除该班级?', '删除', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        deleteClass({
          trainClassId: item.id
        }).then(res => {
          if (Number(res.code) == 0) {
            this.$message.success('删除成功')
            // 分页如果是大于1且那也只有一条
            if (this.classPage.total % 8 == 1 && this.classPage.page != 1) {
              this.classPage.page--
            }
            this.searchClassHandler()
            // 重新赋值班级数量
            this.queryClassNum()
          } else {
            // 错误提示
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {})
    },
    // 获取学校信息
    schoolInfo() {
      schoolMessage({
        customerId: this.customid
      }).then(res => {
        if (Number(res.code == 0)) {
          this.schoolMsg = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
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
    // tab点击
    tabHandler(tab, event) {
      this.searchClass = ''
      this.classPage.page = 1
      this.searchClassHandler(tab.name)
      // 滚动条回到顶部
      const mian = this.$refs.appMian
      mian.scrollTo(0, 0)
    },
    // 改变开始时间时
    changeStart() {
      // 当改变开始日期时，如果结束时间小于开始时间则清空结束日期
      if (this.cjbjForm.startTime > this.cjbjForm.endTime) this.cjbjForm.endTime = ''
    },
    // 打开结束时间时
    focusEnd() {
      // 如果直接选择结束日期(此时还没选择开始日期) 则在这之前应该先禁用当前之前的时间
      this.endTime = {
        disabledDate: time => {
          if (!this.cjbjForm.startTime) {
            return time.getTime() < Date.now() - 8.64e7
          } else {
            return time.getTime() < new Date(this.cjbjForm.startTime).getTime()
          }
        }
      }
    },
    // 打开开始时间时
    focusStart() {
      // 再次点击开始时间时禁用当日之前的日期
      this.startTime = {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    // 获取用户id接口
    getInfo() {
      getInfo().then(res => {
        if (Number(res.code) == 0) {
          localStorage.setItem('userId', res.result.id)
          this.currentUserId = localStorage.getItem('userId')
          this.classList(1)
          this.schoolInfo()
          // 班级数量
          this.queryClassNum()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 弹窗下拉框方法
    selVal(selVal) {
      this.bjlbData.forEach(item => {
        if (item.courseName == selVal) {
          this.cjbjForm.courseId = item.id
          this.cjbjForm.courseName = item.courseName
          this.cjbjForm.courseUrl = item.courseUrl
        }
      })
    },
    // 查询班级数量
    async queryClassNum() {
      const res = await classNum(
        this.currentUserId,
        this.customid
      )
      parseInt(res.code) == 0 ? this.classNums = res.result : this.$message.warning(res.message)
    },

    // 创建班级_查询已购买课程
    cjbj(num, item) {
      if (this.$refs.cjbjForm) {
      this.$refs.cjbjForm.resetFields()
      }
      // 传入客户id
      buyCourse(this.customid).then(res => {
        this.bjlbData = res.result
      })
      // 创建1 编辑2
      if (num == 1) {
        // 封面图片 默认选第一张
        this.cover = 0
        this.dialogType = '创建'
        this.cover = ''
      } else if (num == 2) {
        this.id = item.id
        this.dialogType = '编辑'
        this.cjbjForm = deepClone(item)
        this.cover = Number(item.cover)
      }
      this.cjbj_dialogFormVisible = true

      this.$nextTick(() => {
        // 按钮状态
        if (parseInt(this.$refs.fenBox.style.left) == 0) {
          this.iconStatus.left = false
        }
        if (parseInt(this.coverImgArr.length * 139 - 360 - 10 < this.$refs.fenBox.style.left)) {
          this.iconStatus.right = false
        }
      })
    },
    // 获取当天时间进行判断
    currentTimes() {
      const date = new Date()
      const [Y, M, myDate, Zero] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), '00']
      return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (myDate < 10 ? '0' + myDate : myDate) + ' ' + Zero + ':' + Zero + ':' + Zero
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const times = this.currentTimes()
          if (this.cjbjForm.startTime < times) {
            this.$message.warning('开始日期不能小于当天时间')
            return
          }
          if (this.dialogType === '编辑') {
            const {
              className,
              courseId,
              startTime,
              endTime,
              description
            } = this.cjbjForm
            editClass({
              className,
              courseId,
              startTime,
              endTime,
              description,
              id: this.id,
              cover: this.cover
            }).then(res => {
              if (Number(res.code) == 0) {
                this.$message.success('修改成功')
                this.searchClassHandler()
                this.queryClassNum()
                this.cjbj_dialogFormVisible = false
              } else {
                this.$message.warning(res.message)
              }
            })
          } else {
            const teacherIdAndCustomerId = {
              teacherId: this.currentUserId,
              customerId: this.customid,
              cover: this.cover
            }
            Object.assign(this.cjbjForm, teacherIdAndCustomerId)
            const res = await addClass(this.cjbjForm)
            if (Number(res.code) == 0) {
              this.$message.success('创建班级成功')
              this.queryClassNum()
              this.searchClassHandler()
              this.cjbj_dialogFormVisible = false
            } else {
              this.$message.warning(res.message)
            }
          }
        }
      })
    },
    closeDialog() {
      this.cjbj_dialogFormVisible = false
    },
    // 查询班级列表
    async classList(stu) {
      // queryType 1学生 2教师 、userId登陆用户id 、classStatus 0 未开始 1 进行中 2 已结束 、 page当前页 、 size每页条数 、 customerId客户id
      const res = await classList(
        2,
        this.currentUserId,
        stu,
        this.classPage.page,
        this.classPage.size,
        this.customid,
        this.searchClass
      )
      if (Number(res.code) == 0) {
        this.classArr = res.result.data
        this.classPage.total = Number(res.result.total)
      } else {
        this.$message.warning(res.message)
      }
    },
    // 进入班级
    jrBj(item) {
      localStorage.setItem('CLASSNAME', item.courseName)
      // 进入班级时清空存储的大纲数据
      localStorage.removeItem('teachIndex')
      localStorage.removeItem('teachLine')
      // 进入班级查询实训状态
      trainStatus(item.id).then((res) => {
        if (res.result.startStatus != 2) {
          // 如果不是结束实训那么就开启长连接
          this.createSocket()
        }
      })
      localStorage.setItem('classId', item.id)
      localStorage.setItem('className', item.className)
      localStorage.setItem('courseId', item.courseId)
      localStorage.setItem('customerId', item.customerId)
      localStorage.setItem('startStatus', item.startStatus)
      this.$router.push({
        path: '/home/index'
      })
    },
    // 退出登陆
    handleOperation(id) {
      if (id === 2) {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.Logout()
        }).catch(() => {})
      } else if (id === 1) {
        this.$confirm('确定返回用户中心吗？', '提示', {
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          location.href = localStorage.getItem('centerUrl') + '?flag=1'
        }).catch(() => {})
      }
    }
  }
}
</script>
<style scope lang="scss">
.app-mian {
    width: 100%;
    height: 100vh;
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
        $height: 70px;
        width: 100%;
        height: $height;
        line-height: $height;
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
            .user-info {
                float: right;
                height: 74px;
                line-height: 74px;
                font-size: 14px;
                color: $color-text-ll;
                cursor: pointer;
                margin-right: 50px;
                .user-img {
                    display: inline-block;
                    vertical-align: -11px;
                    width: 40px;
                    height: 40px;
                    margin-right: 11px;
                    border-radius: 50% !important;
                    overflow: hidden;
                    > img {
                        width: 100%;
                        height: 100%;
                        vertical-align: 10px;
                    }
                }
            }

        }
    }
    // nav
    .app-nav {
        width: 100%;
        height: 246px;
        background: url("../assets/images/index-nav.png") no-repeat center center;
        background-size: cover;
        .main-center {
            display: flex;
            .app-school-msg {
                width: auto;
                height: auto;
                overflow: hidden;
                margin-top: 85px;
                flex: 1;
                .school-img {
                    width: 103px;
                    height: 103px;
                    border-radius: 3px;
                    > img {
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
                        display: flex;
                        > img {
                            margin-right: 10px;
                            display: flex;
                        }
                    }
                }
            }
            .app-class-search {
                margin-top: 104px;
                width: 30%;
                .el-input-group__append {
                    background: $color-theme;
                    border: 1px solid $color-theme;
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
    .create-class {
        border-radius: 4px;
    }
    .app-class-list {
        width: 100%;
        padding-top: 20px;
        box-sizing: border-box;
        display: flex;
        @extend %display-flex;
        height: calc(100vh - 70px - 246px - 60px - 20px);
        background: url("../assets/images/banner-bg.png") no-repeat center center;
        background-size: cover;
        overflow: auto;
        &-center {
            width: 1200px;
            height: auto;
            margin: 0 auto;
            @extend %display-flex;
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
            .app-class-list-part-add {
                border-radius: 6px;
                border: 1px dashed #BABABA;
                width: 100%;
                height: 100%;
                display: flex;
                @extend %text-center;
                flex-direction: column;
                > p {
                    color: #323937;
                    font-size: 16px;
                }
            }
        }
        .class-edit-status {
            &:hover {
                .class-mian {
                    .class-edit {
                        &-box {
                            display: block;
                        }
                    }
                }
            }
        }
        &-main {
            min-width: 352px;
            max-width: 352px;
            height: 430px;
            margin-top: 15px;
            margin-bottom: 25px;
            margin-left: 10px;
            border-radius: 10px;
            @include setBoxShadow(0,2px,12px,0,rgba(0,0,0,.1));
            transition: all 0.2s;
            border-radius: 3px;
            display: flex;
            flex: 3;
            flex-direction: column;
            border-radius: 13px;
            background: #fff;
            &:hover {
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
                        background: $color-theme;
                        color: #FFF;
                        display: flex;
                        @extend %text-center;
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
}
.user-operation {
    padding-left: 10px;
    > i {
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
.cover-photo {
    display: flex;
    [class^="el-icon-"] {
        margin-top: 22px;
        cursor: pointer;
        &.active{
          color:#ccc;
        }
    }
    &-box {
        width: 360px;
        margin: 0 5px;
        height: 62px;
        overflow: hidden;
        ul {
            height: 62px;
            position: relative;
            transition:.5s;
        }
        li {
            float: left;
            border: 1px solid #C0C4CC;
            margin-right: 10px;
            border-radius: 5px;
            height: 62px;
            cursor: pointer;
            img {
                width: 117px;
                height: 50px;
                margin: 5px;
            }
            &.active {
                border-color: $color-theme;
            }
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
