<template>
<div class="app-container app-container-course">
  <div :class="['app-container-box',activeState==1?'activeBg':'']">
    <div class="productList">
      <div class="exportBox">
        <div class="check-update"
          @click='checkHandler'
          v-if='updateStatus'>
          <el-button type="primary"
            size="mini">检查更新</el-button>
        </div>

        <el-upload class="upload-demo"
          action="#"
          accept=".zip"
          :http-request="uploadFile"
          :show-file-list="false"
          :before-upload="beforeUpload">
          <el-button type="primary"
            size="mini">导入课程</el-button>
        </el-upload>

      </div>
      <div class="productItem">
        <div class="box"
          v-for="(item, index) in CampusListArr"
          :key="index">
          <div class="img">
            <img :src="item.courseCoverUrl"
              alt="" />
          </div>
          <div class="text">
            <div class="courseName">{{ item.courseName }}</div>
            <p>
              有效期至:{{ item.startTime.split(" ")[0] }}—{{
                item.endTime.split(" ")[0]
              }}
            </p>
            <p>
              在线人数:<span style="color:rgba(0, 184, 139, 1)">{{
                item.onlineNum || 0
              }}</span>/{{ item.authNum }}
            </p>
          </div>
          <div class="topBtn stopBtn"
            v-if="item.status == 0">停用</div>
          <div class="topBtn buyBtn"
            v-else-if="item.buyModel == 1">已购</div>
          <div class="topBtn"
            v-else>试用</div>
          <div class="detailBtn"
            @click="seeDetail(item)">
            <el-button type="primary"
              size="mini">查看详情</el-button>
          </div>
        </div>
        <div class="nodeDate"
          v-if="isNodeDate">
          <img src="../../common/images/noDataPic.png"
            alt="" />
        </div>
      </div>
      <!-- 分页组件 -->
      <div class="buy-course-pagin" v-if="personTotal > 12">
        <pagination :total="personTotal"
          @pagination="monitorPagin"
          :limit="12"
          :pageSizes="[12, 24, 48, 96]"
          v-if="personTotal > 12"></pagination>
      </div>

      <!-- 查看详情 -->
      <el-dialog class="view-detail common-small"
        :close-on-click-modal="false"
        :visible.sync="ProductDetailShow">
        <ProductDetail :CampusListItem="CampusListItem"></ProductDetail>
      </el-dialog>
      <el-dialog title="导入进程"
        :visible.sync="dialogProcess"
        :close-on-click-modal="false"
        width="30%">
        <div class="processMain">
          <i class="iconfont zipIcon">&#xe625;</i>
          <div class="processcontent">
            <p class="fileName">{{ filename }}</p>
            <el-progress :percentage="percentage"
              :color="customColors"></el-progress>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="检查更新"
        class='common-small'
        :visible.sync="checkDialog"
        :close-on-click-modal="false"
        id='checkClass'>
        <el-form :model="checkFrom"
          :rules="checkrules"
          ref="checkFrom"
          size='mini'
          label-width="140px">
          <el-form-item label="服务器IP："
            prop="ip">
            <el-input v-model="checkFrom.ip"
              placeholder='请输入服务器IP'></el-input>
          </el-form-item>
          <el-form-item label="服务器登录名："
            prop="username">
            <el-input v-model="checkFrom.username"
              placeholder='请输入服务器登录名'></el-input>
          </el-form-item>
          <el-form-item label="登录密码："
            prop="pwd">
            <el-input v-model="checkFrom.pwd"
              type='password'
              placeholder='请输入登录密码'></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
          class="dialog-footer">
          <el-button size='mini'
            @click='checkDialog = false'>取 消</el-button>
          <el-button type="primary"
            size='mini'
            @click='checkSureHandler("checkFrom")'>更 新</el-button>
        </span>
      </el-dialog>
      <el-dialog title="检查更新"
        :visible.sync="checkfircomDialog"
        :close-on-click-modal="false"
        width="30%">
        <span>正在更新中,请等待……</span>
        <span slot="footer"
          class="dialog-footer">
          <el-button :type="timeStatus==1?'primary':'info'"
            @click="dialogVisible = false"
            :disabled="timeStatus==0"
            size='mini'>刷新页面（ {{checkConfirmText | formates}}）</el-button>
        </span>
      </el-dialog>
      <!-- 激活码 -->
      <el-dialog title="激活码"
        :visible.sync="showCodeDialog"
        :close-on-click-modal='false'
        class='common-small'>
        <el-form :model="codeForm"
          size='mini'
          :rules="coderule"
          ref="codeForm"
          label-width="100px">
          <el-form-item label="院校名称："
            class='jihuo'>
            <span>{{codeForm.name}}</span>
          </el-form-item>
          <el-form-item label="激活码："
            prop="code"
            class='jihuo'>
            <el-input v-model="codeForm.code"
              placeholder='请输入激活码'
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
          class="dialog-footer">
          <div class="foot">
            <el-button size='mini'
              @click="showCodeDialog = false">取 消</el-button>
            <el-button size='mini'
              type="primary"
              @click="codeSureHandler('codeForm')">确 定</el-button>
          </div>
        </span>
      </el-dialog>
      <!-- <div class="dialogBox" v-show='showCodeDialog'>
        <div class="">
          <label for="">激活码：</label>
          <input type="text" name="" value="" placeholder='请输入激活码' >
        </div>
        <span @click='showCodeDialog=false'>取消</span>
        <span @click='showCodeDialog=false'>确定</span>
      </div> -->
    </div>
  </div>
</div>
</template>

<script>
import {
  cos
} from '@/common/js/cos.js'
import {
  mapGetters
} from 'vuex'
import {
  queryProductList,
  exportClass,
  exportClassResult,
  checkUpdate,
  updateHandler,
  testActivation,
  onlineActivation,
  offlineActivation
} from '@/api/tdb'
import ProductDetail from './component/ProductDetail.vue'
import pagination from '@/components/pagination/index.vue'

export default {
  name: 'BuyCoursesPage',
  computed: {
    ...mapGetters(['userId']),
    // 检查导入课程按钮状态
    updateStatus: function () {
      return localStorage.getItem('saas') == 'off'
    }
  },
  components: {
    ProductDetail,
    pagination
  },
  inject: ['reload'],
  data() {
    var checkServer = (rule, value, callback) => {
      const rightStatus = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(value)
      if (value == '') {
        return callback(new Error('服务器IP不能为空'))
      } else if (!rightStatus) {
        return callback(new Error('服务器IP格式错误'))
      } else {
        callback()
      }
    }
    return {
      CampusListArr: [],
      CampusListItem: {},
      ProductDetailShow: false,
      pageData: {
        total: 0, // 总条数
        current: 1, // 当前页
        pageSize: 12, // 每页显示多少条
        showTotal: true, // 显示隐藏左侧总条数
        dataList: [10, 20, 50, 100]
      },
      pageShow: false,
      isNodeDate: false,
      personTotal: 0, // 分页数据
      // 进度条
      percentage: 30,
      // 进度条颜色
      customColors: '',
      dialogProcess: false,
      filename: '',
      checkFrom: {
        ip: '',
        username: '',
        pwd: ''
      },
      checkrules: {
        ip: [
          {
            required: true,
            validator: checkServer,
            trigger: 'blur'
          }
          ],
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'change'
          }
          ],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
          ]
      },
      checkDialog: false,
      checkTime: 60 * 1000 * 10,
      checkfircomDialog: false,
      checkConfirmText: '',
      timer: null,
      timeStatus: 1,
      activeState: 0, // 激活状态(0未激活，1已激活)
      starKeyClick: null, // 第一次开始按下键盘开始计时
      storeKeyCode: [], // 存储页面上10秒内点击的键盘
      codeStr: '', // 请求到的激活码
      showCodeDialog: false, // 输入激活码弹窗
      lineState: localStorage.getItem('saas'),
      codeForm: {
        code: '',
        name: ''
      },
      coderule: {
        code: [
          {
            required: true,
            message: '请填写激活码',
            trigger: 'change'
          }
        ]
      }
    }
  },
  filters: {
    formates(time) {
      const minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = parseInt((time % (1000 * 60)) / 1000)
      return (minutes > 9 ? minutes : '0' + minutes) + ' 分钟 ' + (seconds > 9 ? seconds : '0' + seconds) + ' 秒 '
    }
  },
  methods: {
    codeSureHandler(formName) {
      this.$refs[formName].validate((valid) => {
        const sendData = {
          cipher: this.codeForm.code,
          customerId: localStorage.getItem('customerId')
        }
        if (valid) {
          if (this.lineState == 'on') {
            onlineActivation(sendData).then(activeRes => {
              if (activeRes.code == 0) {
                this.showCodeDialog = false
                this.activeState = 1
                this.$message.success('激活成功')
              } else {
                this.$message.error({
                  message: activeRes.message
                })
              }
            })
          } else {
            offlineActivation(sendData).then(activeRes => {
              if (activeRes.code == 0) {
                this.showCodeDialog = false
                this.activeState = 1
                this.$message.success('激活成功')
              } else {
                this.$message.error({
                  message: activeRes.message
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 弹窗确定按钮
    checkSureHandler(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkDialog = false
          updateHandler(this.checkFrom).then(res => {
            if (Number(res.code) == 0) {
              this.checkfircomDialog = true
              this.timeStatus = 0
              this.timer = setInterval(function () {
                if (_this.checkTime == 0) {
                  clearInterval(this.timer)
                  setTimeout(function () {
                    // 刷新页面
                    _this.reload()
                  }, 0)
                  _this.timeStatus = 1
                } else {
                  _this.checkTime -= 1000
                  _this.checkConfirmText = _this.checkTime
                }
              }, 1000)
            } else {
              this.$alert(res.message, '检查更新', {
                confirmButtonText: '我知道了',
                callback: action => {}
              })
            }
          })
        }
      })
    },
    // 检查更新
    checkHandler() {
      this.$confirm('检查更新前，请先确认本系统所在的服务器开放了Internet，并已取得该服务器的内网IP地址。', '检查更新', {
        confirmButtonText: '已取得内网IP',
        cancelButtonText: '我再确认下',
        type: 'warning'
      }).then(() => {
        clearInterval(this.timer)
        if (this.$refs.checkFrom) {
          this.$refs.checkFrom.resetFields()
        }
        checkUpdate().then(res => {
          if (Number(res.code) == 0) {
            this.checkDialog = true
          } else if (Number(res.code) == 101) {
            this.$alert('当前已是最新版本！', '检查更新', {
              confirmButtonText: '我知道了',
              callback: action => {}
            })
          } else {
            this.message.warning(res.message)
          }
        })
      }).catch(() => {})
    },
    // 导入模板之前
    beforeUpload(e) {
      this.percentage = 0
    },
    // 导入模板
    async uploadFile(e) {
      this.filename = e.file.name
      this.dialogProcess = true
      const self = this
      const res = await cos(e, self, 'percentage', function (cb) {
        self.percentage = cb.percent * 100
      })
      this.exportHandler(res)
    },
    async exportHandler(res) {
      const data = await exportClass({
        userId: this.userId,
        customerId: localStorage.getItem('customerId'),
        filePath: res
      })
      if (data.code == '0') {
        exportClassResult(data.result).then(res => {
          if (res.code == '0') {
            this.$message.success(res.message)
            this.queryProductList()
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.warning(data.message)
      }
      this.dialogProcess = false
    },
    // 分页执行
    monitorPagin(data) {
      this.queryProductList(data.page, data.limit)
    },
    // 查看详情
    seeDetail(data) {
      this.CampusListItem = Object.assign({}, data)
      this.ProductDetailShow = true
    },
    // 查询产品列表
    async queryProductList(page, size) {
      const res = await queryProductList({
        page: page || 1,
        size: size || 12,
        customerId: localStorage.getItem('customerId')
      })
      if (res.code === '101') {
        this.$message.warning(res.message)
        this.personTotal = 0
        this.pageShow = false
        this.isNodeDate = true
      } else if (res.code === '0') {
        this.CampusListArr = res.result.data
        this.personTotal = +res.result.total
        // 如果没有数据显示暂无数据
        if (this.CampusListArr.length === 0) {
          this.isNodeDate = true
        } else {
          this.isNodeDate = false
        }
      }
    },
    // 验证当前学校是否激活
    testSchoolActivation() {
      const _this = this
      const schoolId = localStorage.getItem('customerId')
      testActivation({
        customerId: schoolId
      }).then(res => {
        if (res.code == 0) {
          //  this.activeState  1-已激活  0-未激活
          _this.activeState = res.result.activate
          _this.codeForm.name = res.result.customerName
          if (_this.activeState == 0) {
            // 添加键盘事件
            document.addEventListener('keydown', function (e) {
              if (!_this.starKeyClick) {
                _this.starKeyClick = setTimeout(() => {
                  clearTimeout(_this.starKeyClick)
                  _this.starKeyClick = null
                  _this.storeKeyCode = []
                }, 10000)
              }
              const el = e || event || window.event
              const _keyCode = el.key
              _this.storeKeyCode.push(_keyCode)
              const tempStr = _this.storeKeyCode.join('')
              if (tempStr == 'caizhiweilai') {
                if (_this.lineState == 'off') {
                  if (_this.$route.name == 'BuyCoursesPage') {
                    if (parseInt(_this.activeState) != 1) {
                      _this.showCodeDialog = true
                      if (_this.$refs.codeForm) {
                        _this.$refs.codeForm.resetFields()
                      }
                    }
                  }
                }
              }
            })
          }
        } else {
          _this.$message.error({
            message: res.message
          })
        }
      })
    }
  },
  watch: {
    checkTime: {
      handler: function (now, old) {
        this.checkTime = now
      },
      deep: true
    }
  },
  destroyed() {
    clearInterval(this.timer) // 清除定时器
    clearTimeout(this.starKeyClick)
    this.timer = null
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  created() {},
  mounted() {
    const _this = this
    this.queryProductList()
    // 验证学校是否是激活状态
    this.testSchoolActivation()
  }
}
</script>
<style lang="scss">
#checkClass {
    .el-dialog__footer {
        text-align: center !important;
    }
}
</style>
<style lang="scss" scoped>
.app-container.app-container-course{
  height: calc(100vh - 74px - 40px - 36px);
}
.app-container-box {
    padding: 0;
    height: 100%;
    &.activeBg {
        background: url("../../common/images/ccc2.png");
    }
}
.processMain {
    display: flex;
    .zipIcon {
        font-size: 40px;
        color: #36cea9;
    }
    .processcontent {
        .fileName {
            margin: 0;
            line-height: 26px;
        }
        flex: 1;
        margin-left: 10px;
    }
}
.activation-btn {
    position: fixed;
    bottom: 10px;
    left: 50%;
    margin-left: -40px;
    font-size: 14px;
    color: #fff;
    background: $color-theme;
    border-radius: 3px;
    border: none;
    outline: none;
    height: 30px;
    padding: 0 10px;
    cursor: pointer;
    z-index: 1;
    &.active {
        background: #ccc;
        color: #999;
        cursor: no-drop;
    }
}
.productList {
    height: 100%;
    margin-top: 15px;
    padding: 0 0 70px;
    box-sizing: border-box;
    .check-update {
        float: right;
        margin-right: 15px;
    }
    .productItem {
        height: 100%;
        display: float;
        overflow-y: auto;
        .box {
            float: left;
            display: flex;
            cursor: pointer;
            background-color: #fff;
            position: relative;
            /*no*/
            width: 500px;
            /*no*/
            height: 193px;
            // margin: 24px 0 0 24px;
            margin-bottom: 10px;
            box-sizing: border-box;
            border: 1px solid rgba(54, 206, 169, 0.11);
            transform: scale(0.95);
            transition: all 0.4s;
            &:hover {
                box-shadow: 0 1px 8px 0 #ccc;
                transform: scale(1);
            }
            .img {
                float: left;
                width: 270px;
                // padding: 32px 30px 32px 24px;
                padding: 30px 15px;
                box-sizing: border-box;

                img {
                    width: 240px;
                    height: 120px;
                }
            }

            .text {
                flex: 1;
                width: calc(100% - 150px);
                position: relative;
                padding-top: 30px;
                .courseName {
                    // height: 22px;
                    font-size: 16px;
                    color: rgba(51, 51, 51, 1);
                    line-height: 22px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    font-weight: 700;
                    padding-right: 5px;
                }

                p {
                    overflow: hidden;
                    font-size: 13px;
                    color: rgba(51, 51, 51, 1);
                    line-height: 18px;
                    margin-top: 10px;
                    margin-right: 5px;
                }
            }

            .detailBtn {
                position: absolute;
                cursor: pointer;
                color: #fff;
                width: 80px;
                height: 28px;
                // text-align: center;
                // line-height: 28px;
                // background: rgba(54, 206, 169, 1);
                font-size: 12px;
                bottom: 10px;
                right: 10px;
            }
            .stopdetailBtn {
                background-color: #999;
                color: #efefef;
            }

            .topBtn {
                position: absolute;
                width: 61px;
                height: 20px;
                font-size: 12px;
                line-height: 20px;
                /* opacity:0.5; */
                color: rgba(255, 120, 0, 1);
                text-align: center;
                background: rgba(247, 181, 0, 0.6);
                top: 0;
                right: 0;
            }
            .buyBtn {
                background: rgba(54, 206, 169, 0.4);
                color: rgba(0, 184, 139, 1);
            }
            .stopBtn {
                background-color: #999;
                color: #efefef;
            }

            .topBtn::after {
                content: "";
                display: block;
                position: absolute;
                width: 0;
                height: 0;
                border: 11px solid transparent;
                border-left-color: rgba(255, 255, 255, 1);
                top: -1px;
                left: -1px;
            }
        }
    }
    // 分页样式
    .buy-course-pagin{
      .pagination-container{
        padding: 10px 16px 10px;
      }
    }
    .nodeDate {
        font-size: 30px;
        margin: 150px auto;
        color: #909399;
        text-align: center;
    }
}
// 导入课程
.exportBox {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}
// 查看详情
// .view-detail {
// width: 800px!important;
// }
.foot {
    text-align: center;
}

.dialogBox {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000000;
    text-align: center;
    span {
        color: #fff;
    }
}
</style>
