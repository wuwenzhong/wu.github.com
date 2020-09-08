<template>
<div class="customer">
  <div class="CustomerList">
    <div class="Crumbs">
      <div class="case-crumbs">
        客户管理
        <router-link to="/customerManagement">/ 客户列表</router-link>
        <span>
          /
          <i class="el-icon-caret-left"></i>
          {{ customerName }}
        </span>
      </div>
    </div>
    <div class="Screen">
      <div class="text">筛选：</div>
      <el-select v-model="valueD" @change="screenAl(valueD)" placeholder="请选择" clearable size="small">
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-button class="NewCustomers" @click="glzh()" size="small">账号管理</el-button>
      <el-button class="NewCustomers" @click="xzkc()" size="small">新增课程</el-button>
    </div>
  </div>
  <!-- 列表详情 -->
  <div class="InstitutionsList">
    <div :class="'CampusList' + ' ' + 'CampusList' + index" :style="{height:(index==nums?'auto':'180px')}" :key="index" v-for="(item, index) in CampusListArr" @click="showDetail(index)">
      <div class="Platform">
        <div class="UeseImg">
          <img v-if="item.courseCoverUrl" :src="item.courseCoverUrl" alt />
          <img v-else src="../../common/images/Headportrait.png" alt />
        </div>
        <div class="UserSubstance">
          <div>
            <div class="CollegeName">
              <!-- 课程名称 -->
              <p>{{ item.courseName }}</p>
              <span style="display:inline-block;width:50px;height:19px;background:#DCEFFF;border-radius:12px;color:#53B1FF;font-size:10px;text-align: center;line-height:19px;" v-if="item.buyModel === 1">
                已购买
              </span>
              <span style="display:inline-block;width:50px;height:19px;background:#FFF7DC;border-radius:12px;color:#FF9800;font-size:10px;text-align: center;line-height:19px;" v-else-if="item.buyModel === 2">
                试用
              </span>
              <span style="display:inline-block;width:50px;height:19px;background:#EAEAEA;border-radius:12px;color:#9D9D9D;font-size:10px;text-align: center;line-height:19px;" v-else-if="item.buyModel === 3">
                已过期
              </span>
            </div>
            <div class="CollegeDetails" v-if="item.buyModel != 3">
              <el-button v-if="item.status === 0" type="button" size="small">已停用</el-button>
              <el-button v-else-if="item.status === 1" type="button" size="small">已启用</el-button>
              <el-button ref="btn1" type="button" size="small" class="Recovery" :class="{ active: item.status === 0 }" @click="Recovery(item)">恢复使用</el-button>
              <el-button ref="btn2" type="button" size="small" class="StopUsing" :class="{ active: item.status === 1 }" @click="StopUsing(item)">强制停用</el-button>
            </div>
            <span class="dueTime">到期时间：{{ item.endTime }}</span>
          </div>
        </div>
      </div>
      <!-- 恢复使用 -->
      <div :class="'Info' + ' ' + 'Info' + index" v-if="index == nums">
        <div>
          <p>购买时长 :&nbsp;</p>
          <span>{{ item.buyLen>300?'长期授权':item.buyLen+'个月' }}</span>
        </div>
        <div>
          <p>起始日期 :&nbsp;</p>
          <span>{{ item.startTime }}</span>
        </div>
        <div>
          <p>站&nbsp;&nbsp;点&nbsp;&nbsp;数 :&nbsp;</p>
          <span>{{ item.authNum }}</span>
        </div>
        <div class="renewAndupgrade" v-if="item.buyModel != 3">
          <el-button type="button" size="small" :disabled='item.buyLen>300||item.status === 0?true:false' @click="Renewal(index, item)">续费</el-button>
          <el-button type="button" :disabled="item.status === 0" size="small" @click="Promotion(index,item)">升级</el-button>
        </div>
      </div>
    </div>
    <div class="defaultPic" ref="defaultPic"><img src="@/common/images/noDataPic.png" alt="" /></div>
  </div>
  <!-- 账号管理 -->
  <el-dialog title="账号管理" :visible.sync="zhglDialog" width="40%" :close-on-click-modal="false">
    <el-table v-loading="loading1" height="200" border :data="zhglData" width="100%">
      <el-table-column prop="managerPhone" label="账号"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="resetPwd(scope)" type="text">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="addNewAccount()" style="background:#414D65;color:#fff;">添加新账号</el-button>
      <el-button size="small" @click="zhglDialog = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- 新增账号 -->
  <el-dialog title="添加新账号" :visible.sync="addAccountDialog" width="30%" :close-on-click-modal="false">
    <el-form label-width="120px" :model="act" ref="act" class="el-form--label-left" :rules="rules">
      <el-form-item label="请输入账号 : " prop="phone">
        <el-input v-model.trim="act.phone" placeholder="请输入账号" size="small" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="验证码 : ">
        <el-input style="width:57%;" placeholder="1111" disabled size="small"></el-input>
        <el-button style="margin-left:10px;" size="small">发送验证码</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="addZh('act')" style="background:#414D65;color:#fff;">确 定</el-button>
      <el-button size="small" @click="addAccountDialog = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- 新增课程 -->
  <el-dialog title="新增课程" :close-on-click-modal="false" :visible.sync="addCourseDialog" width="40%" >
    <el-form :model="courseForm" ref="courseForm" :rules="rules" label-width="120px" class="el-form--label-left">
      <el-form-item label="购买课程" prop="courseId">
        <!--  @change="selCourse" -->
        <el-select v-model="courseForm.courseId" placeholder="请选择课程" style="width:100%;" size="small">
          <el-option v-for="(item, index) in kcSelecOption" :key="index" :label="item.courseName" :value="item.id">{{ item.courseName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购买模式" prop="buyModel">
        <el-radio-group v-model="courseForm.buyModel">
          <el-radio label="1">购买</el-radio>
          <el-radio label="2">试用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="购买时间" prop="buyLen">
        <el-select v-model="courseForm.buyLen" placeholder="请选择购买时间" style="width:100%;" size="small">
          <el-option v-for="item in optionTime" :key="item.value" :label="item.label + '个月'" :value="item.label">{{ item.label }}个月</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点数" prop="authNum">
        <el-input v-model="courseForm.authNum" placeholder="输入站点数" size="small"></el-input>
      </el-form-item>
      <el-form-item label="起始时间" prop="startTime">
        <el-date-picker format="yyyy 年 MM 月 dd 日 " value-format="yyyy-MM-dd HH:mm:ss" style="width:100%;" v-model="courseForm.startTime" type="date" :picker-options="pickerOptions0" placeholder="选择起始时间日期" size="small"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- v-preventReClick -->
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="addCourseF('courseForm')" style="background:#414D65;color:#fff;">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 续费 -->
  <el-dialog :title="courseNameTitle" :visible.sync="xufeiDialog" width="20%" :close-on-click-modal="false">
    <el-form :model="courseForm" ref="courseForm" :rules="rules" label-width="120px">
      <el-form-item label="续费时间" prop="buyLen">
        <el-select v-model="courseForm.buyLen" placeholder="请选择购买时间" style="width:100%;" size="small">
          <el-option v-for="item in optionTime" :key="item.value" :label="item.label + '个月'" :value="item.label">{{ item.label }}个月</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="xufeiDialog = false">取 消</el-button>
      <el-button size="small" @click="ConfirmRenewal('courseForm')" style="background:#414D65;color:#fff;">确定</el-button>
    </span>
  </el-dialog>
  <!-- 升级 -->
  <el-dialog :title="courseNameTitle" :visible.sync="shengjiDialog" width="20%" :close-on-click-modal="false">
    <el-form :model="courseForm" ref="courseForm" :rules="rules" label-width="120px">
      <el-form-item label="站点数" prop="authNum">
        <el-input v-model="courseForm.authNum" placeholder="输入站点数" size="small"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="shengjiDialog = false">取 消</el-button>
      <el-button size="small" @click="upgrade('courseForm')" style="background:#414D65;color:#fff;">确定</el-button>
    </span>
  </el-dialog>
  <!-- 启用 -->

  <!-- 禁用 -->
  <el-dialog :title="courseNameTitle" :visible.sync="stopDialog" width="20%" :close-on-click-modal="false">
    <p>停用后该客户：</p>
    <br />
    <p>教师端禁止创建该课程的实训班级</p>
    <p>学生端禁止禁止进入该课程的实训班</p>
    <p>您确定要停用该客户的授权吗？</p>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="stopDialog = false">取 消</el-button>
      <el-button size="small" @click="stopCourse" style="background:#414D65;color:#fff;">确定</el-button>
    </span>
  </el-dialog>
  <!-- 分页 -->
  <pagination v-show="total > 1" :total="total" :page.sync="pageParams.page" :limit.sync="pageParams.size" @pagination="cusDetailList" />
</div>
</template>
<script>
import {
  customerDetailList,
  acountList,
  addAcount,
  restPassWord,
  addCourse,
  queryCouseList,
  licenseUpdate
} from '@/api/customer'
export default {
  data() {
    // 管理员账号校验
    const codecheck = (rule, value, callback) => {
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
        callback(new Error('手机号输入错误'))
      } else {
        callback()
      }
    }
    const authNumber = (rule, value, callback) => {
      const teamNum = /^[0-9]*$/
      if (value <= 0) {
        callback(new Error('数量必须是大于0的正整数'))
      } else if (value.indexOf('.') > -1) {
        callback(new Error('数量不能为小数'))
      } else if (!teamNum.test(value)) {
        callback(new Error('站点数量只能为数字'))
      } else {
        callback()
      }
    }
    return {
      customerName: this.$route.query.customerName,
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '已购买'
      }, {
        value: '2',
        label: '试用'
      }, {
        value: '3',
        label: '已过期'
      }],
      optionTime: [
        {
          value: '选项1',
          label: '1'
        },
        {
          value: '选项2',
          label: '3'
        },
        {
          value: '选项3',
          label: '6'
        },
        {
          value: '选项4',
          label: '12'
        },
        {
          value: '选项5',
          label: '24'
        },
        {
          value: '选项6',
          label: '36'
        }
      ],
      act: {
        phone: ''
      },
      rules: {
        phone: [
          {
            required: true,
            message: '请输入管理员账号只能为手机号',
            trigger: 'blur'
          },
          {
            required: true,
            type: 'number',
            validator: codecheck,
            trigger: 'blur'
          }
        ],
        courseId: [{
          required: true,
          message: '请选择购买课程',
          trigger: 'blur'
        }],
        buyModel: [{
          required: true,
          message: '请选择购买模式',
          trigger: 'blur'
        }],
        buyLen: [{
          required: true,
          message: '请选择购买时间',
          trigger: 'blur'
        }],
        authNum: [{
          required: true,
          message: '请输入站点数',
          trigger: 'blur'
        }, {
          type: 'number',
          validator: authNumber,
          trigger: 'blur'
        }],
        startTime: [{
          required: true,
          message: '请选择购买时间',
          trigger: 'blur'
        }]
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      valueD: '',
      CampusListArr: [],
      zhglData: [],
      nums: 0,
      total: 0,
      pageParams: {
        page: 1, // 当前页
        size: 10, // 每页显示条数
        customerId: this.$route.query.id, // 客户id
        condition: '' // 购买条件条件 1 购买 2 试用 3 过期
      },
      zhglDialog: false,
      loading1: true,
      addAccountDialog: false,
      addCourseDialog: false,
      xufeiDialog: false,
      shengjiDialog: false,
      satarDialog: false,
      stopDialog: false,
      kcSelecOption: [],
      courseForm: {
        buyModel: '1',
        customerId: this.$route.query.id,
        courseId: '',
        buyType: '',
        authNum: '',
        startTime: '',
        buyLen: ''
      },
      courseNameTitle: '',
      buyCourseId: ''
    }
  },
  created() {
    this.cusDetailList()
  },
  mounted() {

  },
  activated() {
    this.pageParams.customerId = this.$route.query.id
    this.courseForm.customerId = this.$route.query.id
    this.customerName = this.$route.query.customerName
    this.cusDetailList()
  },
  methods: {
    // 筛选
    screenAl(val) {
      this.pageParams.condition = val
      this.cusDetailList(Number(val))
    },
    // 客户详情列表
    cusDetailList() {
      customerDetailList(this.pageParams).then((res) => {
        if (res.code === '0') {
          this.total = Number(res.result.total)
          if (res.result === undefined) {
            this.CampusListArr = []
            this.$refs.defaultPic.style.display = 'block'
            return false
          } else {
            if (res.result.data.length === 0) {
              this.CampusListArr = res.result.data
              this.$refs.defaultPic.style.display = 'block'
            } else {
              this.CampusListArr = res.result.data
              this.$refs.defaultPic.style.display = 'none'
            }
          }
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 账号管理
    glzh() {
      this.zhglDialog = true
      this.acountList()
    },
    async acountList() {
      const res = await acountList({
        customerId: this.pageParams.customerId
      })
      if (res.code === '0') {
        this.zhglData = res.result.data
        this.loading1 = false
      }
    },
    // 新增账号
    addNewAccount() {
      this.addAccountDialog = true
      this.act.phone = ''
    },
    addZh(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await addAcount({
            customerId: this.pageParams.customerId,
            managerPhone: this.act.phone
          })
          if (res.code === '0') {
            this.acountList()
            this.$message({
              message: `新增${res.message},密码为手机号码后六位!`,
              type: 'success'
            })
            this.addAccountDialog = false
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        }
      })
    },
    // 重置密码
    resetPwd(scope) {
      this.$confirm('确定重置吗?', '重置', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          // const res = await restPassWord({
          //   userId: scope.row.userId,
          //   newPwd: scope.row.managerPhone.substring(scope.row.managerPhone.length - 6)
          // })
          // console.log('scope', scope)
          const res = await restPassWord({
            userIds: scope.row.userId
          })
          // console.log(res)
          if (res.code === '0') {
            this.$message({
              message: '密码重置成功，重置密码为手机号后六位',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
    },
    // 新增课程
    xzkc() {
      queryCouseList().then(res => {
        this.kcSelecOption = res.result
      })
      this.addCourseDialog = true
      this.courseForm.buyType = ''
      this.courseForm.authNum = ''
      this.courseForm.startTime = ''
      this.courseForm.courseId = ''
      this.courseForm.buyLen = ''
    },
    addCourseF(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await addCourse(this.courseForm)
          if (res.code === '0') {
            this.$message({
              message: '新增' + res.message,
              type: 'success'
            })
            this.cusDetailList()
            this.addCourseDialog = false
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        }
      })
    },
    showDetail(index) {
      this.nums = index
    },
    selCourse() {

    },
    // 续费、升级、启用、禁用方法
    async licenseUpdate(params1, params2) {
      const res = await licenseUpdate(params1)
      if (res.code === '0') {
        this.$message({
          message: params2 + res.message,
          type: 'success'
        })
        this.cusDetailList()
        this.shengjiDialog = false
        this.courseForm.authNum = ''
        this.xufeiDialog = false
        this.courseForm.buyLen = ''
        this.stopDialog = false
      } else {
        this.$message({
          message: res.message,
          type: 'warning'
        })
      }
    },
    // 启用
    Recovery(item) {
      this.buyCourseId = item.id
      this.$confirm('确定启用吗?', '启用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          const status = {
            status: 1,
            id: this.buyCourseId
          }
          const titDialog = '启用'
          this.licenseUpdate(status, titDialog)
        })
    },
    // 禁用
    StopUsing(item) {
      this.stopDialog = true
      this.courseNameTitle = item.courseName
      this.buyCourseId = item.id
    },
    // 禁用确定
    stopCourse() {
      const status = {
        status: 0,
        id: this.buyCourseId
      }
      const titDialog = '禁用'
      this.licenseUpdate(status, titDialog)
    },
    // 续费
    Renewal(index, item) {
      this.xufeiDialog = true
      this.courseNameTitle = item.courseName
      this.buyCourseId = item.id
    },
    ConfirmRenewal(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const buyLen = {
            buyLen: this.courseForm.buyLen,
            id: this.buyCourseId
          }
          const titDialog = '续费'
          this.licenseUpdate(buyLen, titDialog)
        }
      })
    },
    // 升级
    Promotion(index, item) {
      this.shengjiDialog = true
      this.courseNameTitle = item.courseName
      this.buyCourseId = item.id
    },
    // 确认升级
    upgrade(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const authNum = {
            authNum: this.courseForm.authNum,
            id: this.buyCourseId
          }
          const titDialog = '升级'
          this.licenseUpdate(authNum, titDialog)
        }
      })
    },
    // 隐藏dialog
    cancel() {
      this.addCourseDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.customer {
    flex: 1;
    // margin: 15px 12px;
    background: white;
    padding: 8px 20px;
    position: relative;
    // height: 100%;
    height: calc(100% - 22px);
    .pagination-container {
      padding: 20px 0;
    }
    .CustomerList {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .case-crumbs {
            font-size: 14px;
        }
        span {
            color: #414d65;
            font-weight: 600;
        }
        .Screen {
            display: flex;
            justify-content: center;
            align-items: center;
            .text {
                width: 50px;
                font-size: 14px;
            }
            .NewCustomers {
                background: #414d65;
                color: white;
            }
        }
        .el-select {
            width: 120px;
            margin-right: 20px;
        }
    }
    .InstitutionsList {
        width:100%;
        height: calc(100% - 106px);
        // height: 650px;
        overflow: auto;
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        // display: block;
        .CampusList {
            width: 45%;
            // height: 180px;
            box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
            display: flex;
            padding: 20px;
            margin: 10px 0;
            flex-direction: column;
            // float: left;
            .Platform {
                display: flex;
                margin-bottom: 15px;
                min-height: 110px;
            }
            .Info {
                border-top: 1px solid #e4e4e4;
                position: relative;
                // display: none;
                .renewAndupgrade {
                    position: absolute;
                    right: 0;
                    bottom: 14px;
                }
                div {
                    p {
                        width: 80px;
                        font-size: 14px;
                        color: #303030;
                        font-weight: 600;
                        display: inline-block;
                    }
                    span {
                        color: #919191;
                        font-size: 13px;
                    }
                }
            }
            .AccountNumber {
                display: none;
                justify-content: space-between;
                align-items: center;
                margin-top: 11px;
                div p {
                    color: #303030;
                    font-weight: 600;
                    display: inline;
                }
                div span {
                    color: #919191;
                }
            }
            .UeseImg {
                width: 200px;
                height: 100px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .UserSubstance {
                position: relative;
                margin-left: 15px;
                flex: 1;
                .CollegeName {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    p {
                        font-size: 14px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 600;
                        color: rgba(48, 48, 48, 1);
                        line-height: 20px;
                    }
                    span {
                        text-align: center;
                        height: 15px;
                        line-height: 15pxm;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(174, 174, 174, 1);
                    }
                }
                .CollegeDetails {
                    display: flex;
                    align-items: center;
                    line-height: 20px;
                    margin-top: 10px;
                    color: white;
                }
                button {
                    background: #414d65;
                    color: white;
                }
                .StopUsing {
                    background: white;
                    color: #333333;
                    display: none;
                }
                .Recovery {
                    display: none;
                }
                .active {
                    display: block;
                }
            }
            .dueTime {
                position: absolute;
                color: #aeaeae;
                right: 0;
                bottom: 0;
                font-size: 12px;
            }
            // &:nth-child(2n){
            //   float: right;
            // }
        }
    }
    .CampusList:hover {
        transition: all 0.4s;
        transform: scale(1.02);
    }
    .Renew {
        width: 430px;
        height: 80px;
    }
    .defaultPic {
        width: 96%;
        height: auto;
        position: relative;
        position: absolute;
        display: none;
        img {
            width: 303px;
            height: 315px;
            position: absolute;
            left: 50%;
            // top:50%;
            margin-left: -151.5px;
            margin-top: 80px;
        }
    }
}
</style>
<style>
.el-dialog__footer {
  text-align: center;
}
</style>
