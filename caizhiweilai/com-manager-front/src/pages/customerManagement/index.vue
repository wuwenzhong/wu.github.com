<template>
<div class="app-container customer-wrapper">
  <div class="InstitutionsList">
    <!-- 面包导航以及搜索和新增 -->
    <div class="CustomerLists">
      <div class="Navigation">
        客户管理
        <span>
          /
          <i class="el-icon-caret-left"></i>客户列表
        </span>
      </div>
      <div class="Screen">
        <el-input placeholder="请输入客户名称"
          v-model="pageParams.keyWrods"
          suffix-icon="el-icon-search"
          size="small"></el-input>
        <el-button class="NewCustomers"
          size="small"
          @click="AddUsers">新增客户</el-button>
      </div>
    </div>
    <div class="bigBox">
      <div class="CampusList"
        :key="index"
        v-for="(item,index) in CampusListArr">
        <div class="UeseImg">
          <img v-if="item.coverUrl!= ''"
            :src="item.coverUrl"
            alt />
          <img v-else
            src="@/common/images/defaultPic.png"
            alt />
        </div>
        <div class="UserSubstance">
          <div class="CollegeName">
            <p>{{item.customerName}}</p>
          </div>
          <div class="CollegeContent"
            :title="item.description">{{item.description}}</div>
          <div class="CollegeDetails">
            <div>
              <el-button @click="detail(item)"
                type="button"
                size="small">详情</el-button>
              <el-button @click="editList(item)"
                size="small">修改</el-button>
              <el-button type="button"
                size="small"
                @click='activationHandler(item)'>生成激活码</el-button>
            </div>
            <span>{{item.province}}-{{item.city}}-{{item.county}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="defaultPic"
      ref="defaultPic">
      <img src="@/common/images/noDataPic.png"
        alt="">
    </div>
    <router-view></router-view>
    <!-- 新增/编辑客户 -->
    <el-dialog :title="dialogType==='修改'?'修改客户':'新增客户'"
      :close-on-click-modal='false'
      :before-close="handleDialogClose"
      :modal-append-to-body='false'
      :visible.sync="AddUserShow"
      width="40%">
      <el-form :model="addCustomerData"
        ref="addCustomerData"
        :rules="rules"
        class="el-form--label-left"
        label-width="110px">
        <el-form-item label="客户名称:"
          prop="customerName">
          <el-input autocomplete="off"
            maxlength="50"
            readonly="readonly"
            v-model.trim="addCustomerData.customerName"
            @click.native="selectSchool"
            placeholder="请选择所属院校"
            size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户编码:"
          prop="customerCode">
          <el-input autocomplete="off"
            v-model.trim="addCustomerData.customerCode"
            placeholder="请输入客户编码"
            size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户简介："
          prop="description">
          <el-input type="textarea"
            maxlength="500"
            show-word-limit
            v-model="addCustomerData.description"
            autocomplete="off"
            rows="2"
            placeholder="请输入课程简介"></el-input>
        </el-form-item>
        <el-form-item label="所在地区："
          prop="selectCitys">
          <el-cascader v-model="selectCity"
            ref="selectOption"
            :options="options"
            @change="selectAddress"
            class="wd400">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input autocomplete="off" maxlength="150" show-word-limit size="small" v-model="addCustomerData.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="客户LOGO：" prop="fileList">
            <!-- <el-checkbox-group v-model="addCustomerData.coverUrl"></el-checkbox-group> -->
            <!-- list-type="picture-card" :file-list="addCustomerData.fileList"-->
            <el-upload action="#"
            class="avatar-uploader"
            ref="upload"
            :show-file-list="false"
            :on-change="change"
            :on-remove="remove"
            :http-request="PicUpload"
            :before-upload="beforeUpload"
            accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG">
            <img v-if="addCustomerData.coverUrl"
              :src="addCustomerData.coverUrl"
              class="avatar">
            <i v-else
              class="el-icon-plus avatar-uploader-icon"></i>
            <!-- <i class="el-icon-plus"></i> -->
          </el-upload>
          <span style="position: absolute;left: 106px;bottom: 8px;color:#f57474;">图片宽高比为1:1,且大小不超过2M</span>
        </el-form-item>
        <el-form-item label="客户类型：">
          <el-radio-group v-model="radioArr">
            <el-radio label="0"
              disabled>企业</el-radio>
            <el-radio label="1">院校</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="管理员账号：" prop="managerPhone">
          <el-input autocomplete="off" :disabled="disabled" v-model.trim="addCustomerData.managerPhone" maxlength="11" placeholder="请输入管理员账号" size="small" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item> -->
      </el-form>
      <div class="foot" style='text-align:center'>
        <!--  v-preventReClick -->
        <el-button @click="closes"
          size="small">取消</el-button>
        <el-button type="info"
          @click="determine('addCustomerData')"
          class="Determine"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <!-- 选择所属院校 -->
    <el-dialog title=""
      :modal-append-to-body='false'
      :close-on-click-modal='false'
      :visible.sync="centerDialogVisible"
      center>
      <div class="provice-list">
        <el-form :inline="true"
          :model="schoolData"
          class="demo-form-inline"
          @submit.native.prevent>
          <el-form-item>
            <el-input v-model="schoolData.name"
              placeholder="请输入学校名称"
              @keyup.enter.native="enterSelect"></el-input>
            <i class="iconfont icon-sousuo"
              style="position:absolute;right:7px;"
              @click="search"></i>
          </el-form-item>
        </el-form>
        <ul>
          <li v-for="(item,index) in provinceList"
            :key="index"
            @click="searchSchool(item.name,index)"
            :class="{'addColor':index == itemIndex}">{{ item.name }}</li>
        </ul>
      </div>
      <div class="school-list">
        <p style="color:rgba(102, 102, 102, 1);font-size:14px;"
          v-show="schoolList.length != 0">{{schoolData.province}}地区院校</p>
        <div class="showList">
          <ul v-show="schoolList.length != 0">
            <li v-for="(item,index) in schoolList"
              :key="index"
              @click="sureSchool(item,index)"
              :class="{'highColor':schoolIndex == index}">{{ item.name }}</li>
          </ul>
        </div>
        <p style="text-align: center;font-size: 20px;margin: 40px;color: rgba(153, 153, 153, 1);"
          v-show="schoolList.length == 0">暂未查询到相关信息</p>
      </div>
    </el-dialog>
    <!-- 生成激活码 -->
    <el-dialog
      title="生成激活码"
      :modal-append-to-body='false'
      :close-on-click-modal='false'
      :visible.sync="dialogCode"
      width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="激活码：" class='jihuo'>
    <span>{{activation}}</span>
  </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCode = false" size='mini'>取 消</el-button>
        <el-button type="primary" @click="dialogCode = false" size='mini'>确 定</el-button>
      </span> -->
    </el-dialog>
    <!-- 分页 -->
  <pagination v-show="total > 10"
    :total="total"
    :page.sync="pageParams.page"
    :limit.sync="pageParams.size"
    @pagination="customerListt" />
  </div>

</div>
</template>
<script>
import areaJs from '@/common/js/select_areaAll'
import {
  addCustomer,
  editCustomer,
  customerList,
  getSchoolList,
  queryCustomerInfo,
  getActivationCode
} from '@/api/customer'
import {
  deepClone,
  _vueDebounce
} from '@/common/js/utils.js'
export default {
  data() {
    // 客户编码校验
    const customerCode = (rule, value, callback) => {
      const phone = /^[0-9]*$/
      if (value.length > 20) {
        callback(new Error('编码不能超过20个数字'))
      } else if (value.indexOf('.') > -1) {
        callback(new Error('编码不能为小数'))
      } else {
        callback()
      }
    }
    // 管理员账号校验
    const codecheck = (rule, value, callback) => {
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
        callback(new Error('手机号输入错误'))
      } else {
        callback()
      }
    }

    return {
      CampusListArr: [],
      pageParams: {
        page: 1, // 当前页
        size: 10, // 每页显示条数
        keyWrods: '' // 搜索的词
      },
      total: 0, // 总条数
      dialogType: '新增',
      AddUserShow: false,
      centerDialogVisible: false,
      options: areaJs,
      radioArr: '1',
      selectText: [],
      selectCity: [],
      addCustomerData: {
        customerName: '', // 客户名称
        customerCode: '', // 客户编码
        coverUrl: '', // 学校图片路径
        description: '', // 学校描述	客户简介
        province: '', // 省
        city: '', // 市
        county: '', // 区县
        addressCode: '', // 区域编码
        address: '', // 地址
        fileList: ''
      },
      rules: {
        customerName: [{
          required: true,
          message: '请选择客户名称',
          trigger: 'click'
        }],
        customerCode: [{
          required: true,
          message: '请输入客户编码',
          trigger: 'blur'
        }, {
          required: true,
          validator: customerCode,
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入客户简介',
          trigger: 'blur'
        }]
      },
      schoolList: [],
      schoolData: {
        province: '北京',
        name: ''
      },
      provinceList: [
        {
          name: '北京'
        },
        {
          name: '天津'
        },
        {
          name: '河北'
        },
        {
          name: '山西'
        },
        {
          name: '内蒙古'
        },
        {
          name: '辽宁'
        },
        {
          name: '吉林'
        },
        {
          name: '黑龙江'
        },
        {
          name: '上海'
        },
        {
          name: '江苏'
        },
        {
          name: '浙江'
        },
        {
          name: '安徽'
        },
        {
          name: '福建'
        },
        {
          name: '江西'
        },
        {
          name: '山东'
        },
        {
          name: '河南'
        },
        {
          name: '湖北'
        },
        {
          name: '湖南'
        },
        {
          name: '广东'
        },
        {
          name: '广西'
        },
        {
          name: '海南'
        },
        {
          name: '重庆'
        },
        {
          name: '四川'
        },
        {
          name: '贵州'
        },
        {
          name: '云南'
        },
        {
          name: '西藏'
        },
        {
          name: '陕西'
        },
        {
          name: '甘肃'
        },
        {
          name: '青海'
        },
        {
          name: '宁夏'
        },
        {
          name: '新疆'
        },
        {
          name: '台湾'
        },
        {
          name: '香港'
        },
        {
          name: '澳门'
        },
        {
          name: '海外'
        }
      ],
      itemIndex: 0, // 记录当前省份高亮
      schoolIndex: -1, // 院校高亮
      editData: {},
      disabled: false,
      customerId: '',
      flag: '',
      pageFlag: 10,
      // 激活码弹窗
      dialogCode: false,
      // 激活码
      activation: ''
    }
  },
  created() {
    // this.CampusListArr = this.aa.result.data
  },
  mounted() {
    this.customerListt()
  },
  watch: {
    'pageParams.keyWrods': {
      handler(newVal, oldVal) {
        this.getSearchList()
      },
      deep: true
    }
  },
  methods: {
    // 生成激活码
    activationHandler(item) {
      getActivationCode(item.customerName).then(res => {
        if (Number(res.code) == 0) {
          this.dialogCode = true
          this.activation = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 键盘抬起搜索客户
    getSearchList: _vueDebounce('customerListt', 500),
    // 客户列表
    customerListt() {
      if (this.pageFlag != this.pageParams.size) {
        this.pageFlag = this.pageParams.size
        this.pageParams.page = 1
      }
      customerList(this.pageParams).then((res) => {
        if (res.code === '0') {
          if (res.result.data.length === 0) {
            this.$refs.defaultPic.style.display = 'block'
            this.CampusListArr = []
            this.total = 0
          } else {
            this.$refs.defaultPic.style.display = 'none'
            this.CampusListArr = res.result.data
            this.total = Number(res.result.total)
            // 回table顶部
            this.$el.getElementsByClassName('bigBox')[0].scrollTop = 0
          }
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 新增客户
    AddUsers() {
      if (this.$refs.addCustomerData != undefined) {
        this.$nextTick(() => {
          this.$refs.addCustomerData.resetFields()
        })
      }
      this.selectCity = []
      this.dialogType = '新增'
      this.disabled = false
      this.AddUserShow = true
      this.addCustomerData = {
        coverUrl: ''
      }
    },
    // 修改客户
    async editList(item) {
      this.dialogType = '修改'
      this.customerId = item.id
      const res = await queryCustomerInfo(item.id)
      this.addCustomerData = res.result
      this.editData = res.result
      this.selectCity = res.result.addressCode.split(',')
      if (res.result.coverUrl === '') {
        // this.addCustomerData.fileList = []
        this.addCustomerData.fileList = ''
      } else {
        // this.addCustomerData.fileList = [{ url: res.result.coverUrl }]
        this.addCustomerData.fileList = 'url: res.result.coverUrl'
      }
      this.AddUserShow = true
      this.disabled = true
    },
    // 选择院校
    selectSchool() {
      this.centerDialogVisible = true
      this.schoolData.province = '北京'
      this.itemIndex = 0
      this.schoolData.name = ''
      this.schoolIndex = -1
      this.getSchoolList()
    },
    // 获取院校列表
    async getSchoolList() {
      const res = await getSchoolList(this.schoolData)
      if (res.code === '0') {
        this.schoolList = res.result
      }
    },
    // 搜索院校
    searchSchool(name, _index) {
      this.itemIndex = _index
      this.schoolData.province = name
      this.getSchoolList()
    },
    queryContent() {
      if (this.schoolData.name === '' && this.schoolData.province !== '') {
        this.getSchoolList()
      } else {
        this.itemIndex = -1
        this.schoolData.province = ''
        this.getSchoolList()
      }
    },
    search() {
      this.queryContent()
    },
    sureSchool(item, index) {
      this.addCustomerData.customerName = item.name
      this.centerDialogVisible = false
      this.schoolIndex = index
    },
    // enter搜索
    enterSelect() {
      this.queryContent()
    },
    // 确定新增/修改客户
    determine(formName) {
      console.log(this.addCustomerData)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const isEdit = this.dialogType == '修改'
          if (isEdit) {
            if (this.addCustomerData.coverUrl === '' || this.addCustomerData.coverUrl === undefined || this.addCustomerData.fileList === []) {
              this.$message({
                message: '客户LOGO不能为空',
                type: 'warning'
              })
              return
            }
            if (this.selectCity.length == 0) {
              this.$message({
                message: '地区不能为空',
                type: 'warning'
              })
              return
            }
            const res = await editCustomer(this.editData)
            if (res.code === '0') {
              this.$message({
                message: '修改' + res.message,
                type: 'success'
              })
              this.customerListt()
              this.AddUserShow = false
              // this.addCustomerData = {}
              this.selectCity = []
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          } else {
            if (this.addCustomerData.coverUrl === '' || this.addCustomerData.coverUrl === undefined || this.addCustomerData.fileList === []) {
              this.$message({
                message: '客户LOGO不能为空',
                type: 'warning'
              })
              return
            }
            if (this.selectCity.length == 0) {
              this.$message({
                message: '地区不能为空',
                type: 'warning'
              })
              return
            }
            const res = await addCustomer(this.addCustomerData)
            if (res.code === '0') {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.customerListt()
              this.AddUserShow = false
              this.selectCity = []
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          }
        }
      })
    },
    // 选择地址
    selectAddress(e, form) {
      // console.log(e)
      this.addCustomerData.addressCode = e.join(',')
      this.selectText = this.$refs.selectOption.getCheckedNodes()[0].pathLabels
      // console.log(this.selectText)
      // 北京市 天津市 重庆市 上海市
      if (e[0] === '110000' || e[0] === '120000' || e[0] === '500000' || e[0] === '310000') {
        this.addCustomerData.province = this.selectText[0]
        this.addCustomerData.city = this.selectText[0]
        this.addCustomerData.county = this.selectText[2]
      } else if (e[0] === '820000' || e[0] === '810000' || e[0] === '710000') { // 香港 澳门 台湾
        this.addCustomerData.province = this.selectText[0]
        this.addCustomerData.city = this.selectText[0]
        this.addCustomerData.county = this.selectText[0]
      } else {
        this.addCustomerData.province = this.selectText[0]
        this.addCustomerData.city = this.selectText[1]
        this.addCustomerData.county = this.selectText[2]
      }
    },
    // lolo上传
    async PicUpload(e) {
      const res = await this.cos(e)
      this.addCustomerData.coverUrl = res
    },
    // 客户logo的修改
    change(file, fileList) {
      const FileExt = file.name.replace(/.+\./, '')
      if (['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'].indexOf(FileExt.toLowerCase()) === -1) {
        return false
      }
      // console.log(this.editData.coverUrl)
      if (fileList.length > 1) {
        // console.log(fileList)
        fileList.splice(0, 1)
      }
    },
    // 移除logo
    remove(file) {
      // console.log(file)
      if (file && file.status === 'success') {
        if (this.dialogType === '新增') {
          const path = this.addCustomerData.coverUrl
          const schoolId = ''
          // this.delLogo(path,schoolId)
        }
        if (this.dialogType === '修改') {
          const path = this.editData.coverUrl
          const schoolId = this.editSchoolId
          // this.delLogo(path,schoolId)
        }
        this.addCustomerData.fileList = []
        this.editData.coverUrl = ''
        this.addCustomerData.coverUrl = ''
      }
    },
    // 上传的图片做校验
    beforeUpload(file) {
      const isMatch = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isMatch) {
        this.$message.error('图片格式不匹配,请上传后缀名为jpg,jpeg,png结尾的图片！')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      const isSize = new Promise((resolve, reject) => {
        const Url = window.URL || window.webkitURL
        const img = new Image()
        img.onload = () => {
          const valid = img.width === img.height
          valid ? resolve(true) : reject(img)
        }
        img.src = Url.createObjectURL(file)
      }).then(() => {
        return file
      }, (img) => {
        this.$message.error(`上传图片分辨率要求为1:1比例,当前图片宽为${img.width}高为${img.height}`)
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject()
      })
      return isSize
    },
    // 弹框隐藏
    closes() {
      this.AddUserShow = false
    },
    handleDialogClose() {
      this.AddUserShow = false
    },
    // 详情
    detail(item) {
      this.$router.push({
        path: '/customerDetail',
        query: {
          id: item.id,
          customerName: item.customerName
        }
      })
    }
  }
}
</script>

<style scope lang="scss">
.jihuo{
  .el-form-item__label{
    font-weight:bold;
  }
}
.customer-wrapper {
    .InstitutionsList {
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        // flex-wrap: wrap;
        position: relative;
        z-index: 10;
        // height: 650px;
        height: calc(100% - 52px);
        .CustomerLists {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 0 5px 10px;
            .Navigation {
                color: #999999;
                font-size: 14px;
                span {
                    font-size: 14px;
                    color: #414d65;
                    font-weight: 600;
                }
            }
            .Screen {
                display: flex;
                justify-content: center;
                align-items: center;
                .el-input {
                    width: 200px;
                    margin: 0 15px;
                }
                .NewCustomers {
                    background: #414d65;
                    color: white;
                }
            }
        }
        .bigBox {
            width: 100%;
            height: calc(100% - 40px);
            // height: 650px;
            overflow: auto;
            display: float;
            // display: flex;
            // justify-content: space-between;
            // flex-wrap: wrap;
            padding: 0 10px;
            .CampusList {
                float: left;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 45%;
                height: 160px;
                box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
                padding: 0 15px;
                // margin: 10px 0;
                margin-top: 10px;
                margin-bottom: 10px;
                .UeseImg {
                    width: 100px;
                    height: 100px;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .UserSubstance {
                    margin-left: 15px;
                    flex: 1;
                    .CollegeName {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 18px;
                        p {
                            font-size: 16px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 600;
                            color: rgba(48, 48, 48, 1);
                            line-height: 20px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            width: 400px;
                        }
                    }
                    .CollegeContent {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(145, 145, 145, 1);
                        line-height: 0.2rem;
                        width: 90%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        line-height: 18px;
                        margin: 8px 0;
                    }
                    .CollegeDetails {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        line-height: 20px;
                        margin-top: 10px;
                        button {
                            background: #414d65;
                            color: white;
                        }
                        span {
                            font-size: 12px;
                        }
                    }
                }
                &:hover {
                    box-shadow: 0 1px 8px 0 rgb(156, 154, 154);
                    // transform: scale(1.02);
                }
                &:nth-child(2n){
                  float: right;
                }
            }

        }

        .defaultPic {
            width: 96%;
            height: 100%;
            position: relative;
            position: absolute;
            top: 42px;
            display: none;
            img {
                width: 303px;
                height: 315px;
                position: absolute;
                left: 50%;
                // top:165%;
                margin-left: -151.5px;
                margin-top: 80px;
            }
        }
    }
    .foot {
        // margin: 0.111rem 0;
        // display: flex;
        // justify-content: flex-end;
        // align-items: center;
        text-align: center;
        .Determine {
            background: #414d65;
        }
    }
    .Code {
        width: 72%;
    }
    // .SchoolHide {
    //   // display: none;
    // }
    .el-form-item {
        margin-bottom: 18px;
    }
    // 弹出框

    // .el-upload{
    //   width: 100px;
    //   height: 100px;
    //   line-height: 100px;
    // }
    // .el-upload-list--picture-card .el-upload-list__item{
    //   width:100px;
    //   height:100px;
    // }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .pagination-container {
        padding: 20px 10px;
    }
}
.provice-list {
    border-bottom: 1px dotted rgba(153, 153, 153, 1);
    padding-bottom: 18px;
    ul {
        li {
            display: inline;
            margin-right: 12px;
            line-height: 24px;
            &:hover {
                color: rgb(0, 104, 214);
                cursor: pointer;
            }
        }
        .addColor {
            background: rgba(0, 104, 214, 1);
            color: #fff;
            padding: 3px 12px;
            cursor: pointer;
            &:hover {
                color: #fff;
                cursor: pointer;
            }
        }
        .icon-sousuo {
            &:hover {
                color: rgba(0, 104, 214, 1);
                cursor: pointer;
            }
        }
    }
}
.school-list {
    margin-top: 15px;
    .demo-form-inline {
        text-align: right;
    }
    .showList {
        max-height: 300px;
        overflow-y: scroll;
        margin-top: 20px;
    }
    ul {
        li {
            display: inline-block;
            padding-right: 12px;
            line-height: 24px;
            color: rgba(153, 153, 153, 1);
            font-size: 13px;
            width: 223px;
            &:hover {
                color: rgba(0, 104, 214, 1);
                cursor: pointer;
            }
            &:before {
                content: '·';
                font-size: 28px;
                position: relative;
                left: -3px;
                top: 6px;
                color: rgb(0, 104, 214);
            }
        }
    }
    .highColor {
        color: rgba(0, 104, 214, 1);
    }

}
</style>
