<template>
  <div class="app-container course-management-wrapper">
    <div class="creatButton" @click="CreateCourse">创建课程</div>
    <div class="case">
      <div class="caseList" v-for="(item,index) in courseArr" :key="index">
        <div class="imgitem">
          <img :src="item.coverUrl" alt srcset />
        </div>
        <div class="itemContent">
          <div class="itemTitle">
            <span class="kc">{{item.courseName}}</span>
            <span class="banben">版本号：{{item.courseVersion}}</span>
          </div>
          <div
            class="itemMiddlecontent"
            :title="item.courseIntroduction"
          >{{item.courseIntroduction}}</div>
          <div class="itemBottom">
            <div>
              <div class="dggl" @click="dggl(item.id)">大纲管理</div>
              <div class="bj" @click="EditCourse(item.id)">编辑</div>
              <div class="sckc" @click="delkc(item.id)">删除课程</div>
              <div class="sckc" @click="exportHandler(item)">导出课程</div>
            </div>
            <div class="totalHours">总课时:{{item.period}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 创建课程 -->
    <el-dialog
      title="创建课程"
      :visible.sync="Create"
      width="40%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <CourseCreate create="创建课程" @createClose="createClose"></CourseCreate>
    </el-dialog>
    <!-- 编辑课程 -->
    <el-dialog
      title="编辑课程"
      :visible.sync="Edit"
      width="40%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="CourseEditClose"
    >
      <div v-if="Edit">
        <CourseEdit edit="编辑课程" :bjck="edidKc" @editClose="editClose"></CourseEdit>
      </div>
    </el-dialog>
    <div class="defaultPic" ref="defaultPic">
      <img src="@/common/images/noDataPic.png" alt />
    </div>
    <!-- 新增课程 -->
    <el-dialog title="导出课程" :close-on-click-modal="false" :visible.sync="warrantDialog" width="40%">
      <el-form
        :model="courseForm"
        ref="courseForm"
        :rules="rules"
        label-width="120px"
        class="el-form--label-left"
      >
        <el-form-item label="购买模式" prop="buyModel">
          <el-radio-group v-model="courseForm.buyModel">
            <el-radio label="1">购买</el-radio>
            <el-radio label="2">试用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="购买时间" prop="buyLen">
          <el-select
            v-model="courseForm.buyLen"
            placeholder="请选择购买时间"
            style="width:100%;"
            size="small"
          >
            <el-option
              v-for="item in optionTime"
              :key="item.value"
              :label="item.label=='长期授权'?item.label:item.label+'个月'"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点数" prop="authNum">
          <el-input v-model="courseForm.authNum" placeholder="输入站点数" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <!-- v-preventReClick -->
        <el-button size="small" @click="warrantDialog = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="exportCourse('courseForm')"
          style="background:#414D65;color:#fff;border:1px solid #414D65
                 "
        >导 出</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <pagination
      v-show="total > 10"
      :total="total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.size"
      @pagination="init"
    />
  </div>
</template>

<script>
import CourseCreate from './components/CourseCreate'
import CourseEdit from './components/CourseEdit.vue'
import {
  courseList,
  delcourse,
  editcourse,
  coursedetails,
  exportCourse
} from './../../api/course'
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userId'])
  },
  components: {
    CourseCreate,
    CourseEdit
  },
  data() {
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
    // 管理员账号校验
    const codecheck = (rule, value, callback) => {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error('手机号输入错误'))
      } else {
        callback()
      }
    }
    return {
      Code: '',
      Create: false,
      Edit: false,
      courseArr: [],
      edidKc: {},
      pageParams: {
        page: 1,
        size: 10
      },
      total: 0,
      // 授权框
      warrantDialog: false,
      courseForm: {
        buyModel: '1',
        authNum: '',
        buyLen: ''
      },
      rules: {
        buyModel: [
          {
            required: true,
            message: '请选择购买模式',
            trigger: 'blur'
          }
        ],
        buyLen: [
          {
            required: true,
            message: '请选择购买时间',
            trigger: 'blur'
          }
        ],
        authNum: [
          {
            required: true,
            message: '请输入站点数',
            trigger: 'blur'
          },
          {
            type: 'number',
            validator: authNumber,
            trigger: 'blur'
          }
        ]
      },
      optionTime: [
        {
          value: '999',
          label: '长期授权'
        },
        {
          value: '1',
          label: '1'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '6',
          label: '6'
        },
        {
          value: '12',
          label: '12'
        },
        {
          value: '24',
          label: '24'
        },
        {
          value: '36',
          label: '36'
        }
      ],
      courseId: '',
      courseName: '',
      pageFlag: 10
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 导出确认
    exportCourse(formName) {
      const sureHandler = Object.assign({}, this.courseForm, {
        courseId: this.courseId
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          exportCourse(sureHandler).then((res) => {
            if (res.code == '101') {
              this.$message.warning(res.message)
              return false
            } else if (res.status == 500) {
              return false
            } else if (res != '') {
              this.warrantDialog = false
              this.downloadFile(res.result)
            }
          })
        } else {
          return false
        }
      })
    },
    // 导出
    downloadFile(data) {
      const blob = new Blob([data])
      const link = document.createElement('a') // 创建a标签
      link.href = data
      link.click()
    },
    // 导出课程
    exportHandler(id) {
      this.courseName = id.courseName + '.zip'
      this.courseId = id.id
      this.warrantDialog = true
      if (this.$refs.courseForm != undefined) {
        this.$refs.courseForm.resetFields()
      }
    },
    // 获取课程列表
    init() {
      if (this.pageFlag != this.pageParams.size) {
        this.pageFlag = this.pageParams.size
        this.pageParams.page = 1
      }
      courseList({
        page: this.pageParams.page,
        size: this.pageParams.size
      }).then((res) => {
        console.log(res)
        if (res.code == 0) {
          if (res.result.data.length === 0) {
            this.$refs.defaultPic.style.display = 'block'
            this.courseArr = []
            this.total = 0
          } else {
            this.$refs.defaultPic.style.display = 'none'
            this.courseArr = res.result.data
            this.total = Number(res.result.total)
            // 回顶部
            this.$el.getElementsByClassName('case')[0].scrollTop = 0
          }
        } else {
          this.$message({
            type: 'warning',
            message: '网络更新失败！'
          })
        }
      })
    },
    // 点击编辑课程弹框的X关闭
    CourseEditClose(done) {
      done()
    },
    // 创建课程
    CreateCourse() {
      const that = this
      that.Create = true
    },
    // 关闭创建课程
    createClose() {
      const that = this
      this.$nextTick(function () {
        this.init()
        that.Create = false
      })
    },
    // 编辑课程
    EditCourse(editId) {
      const that = this
      // 获取课程详情
      coursedetails({
        courseId: editId
      }).then((res) => {
        this.edidKc = res.result
        that.Edit = true
      })
    },
    // 关闭编辑课程
    editClose() {
      const that = this
      that.Edit = false
      that.init()
    },
    // 删除课程
    delkc(valid) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          delcourse({
            id: valid
          }).then((res) => {
            if (res.code == 0) {
              this.init()
              this.$message({
                type: 'success',
                message: res.message
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch((arr) => {
          this.$message.info('取消删除')
        })
    },
    // 大纲管理
    dggl(val) {
      this.$router.push({
        path: '/outlineManagement',
        query: {
          courseId: val
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.course-management-wrapper {
  .creatButton {
    width: 88px;
    height: 32px;
    background: rgba(65, 77, 101, 1);
    border-radius: 2px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;
    text-align: center;
    color: white;
    cursor: pointer;
    margin: 0 0 5px 10px;
  }
  .case {
    height: calc(100% - 94px);
    padding: 0 10px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .caseList {
      cursor: pointer;
      width: 48%;
      min-width: 680px;
      min-height: 200px;
      max-height: 250px;
      margin: 15px 0;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 1);
      // box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1); //统一
      padding: 15px;
      .imgitem {
        min-height: 100px;
        min-width: 200px;
        width: 200px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .itemContent {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 15px;
        .itemTitle {
          line-height: 30px;
          .kc {
            font-weight: 500;
            color: rgba(48, 48, 48, 1);
            line-height: 22px;
            font-size: 16px;
          }
          .banben {
            font-weight: 400;
            color: rgba(174, 174, 174, 1);
            line-height: 17px;
            font-size: 12px;
            margin-left: 15px;
          }
        }
        .totalHours {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(174, 174, 174, 1);
          line-height: 17px;
          white-space: nowrap;
        }
      }
      .itemMiddlecontent {
        font-size: 14px;
        word-break: break-all;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(145, 145, 145, 1);
        line-height: 30px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        margin: 10px 0;
      }
      .itemBottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          display: flex;
          justify-content: center;
          .dggl {
            width: 76px;
            height: 28px;
            background: rgba(65, 77, 101, 1);
            border-radius: 2px;
            line-height: 28px;
            text-align: center;
            color: white;
            font-size: 15px;
            cursor: pointer;
          }
          .bj {
            width: 76px;
            height: 28px;
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
            border: 1px solid rgba(221, 221, 221, 1);
            line-height: 28px;
            text-align: center;
            margin-left: 8px;
            cursor: pointer;
          }
          .sckc {
            width: 76px;
            height: 28px;
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
            border: 1px solid rgba(221, 221, 221, 1);
            line-height: 28px;
            text-align: center;
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }
      // &:nth-child(odd) {
      //     margin-right: 12px;
      // }
      // &:nth-child(even) {
      //     margin-left: 12px;
      // }
    }
    .caseList:hover {
      // box-shadow: 3px 1px 17px #c7c7c7;
      box-shadow: 0 1px 8px 0 rgb(156, 154, 154); // 统一
    }
  }
  .defaultPic {
    width: 303px;
    height: 90%;
    display: none;
    margin: 0 auto;
    img {
      width: 303px;
      height: 315px;
      margin-top: 155px;
    }
  }
  /deep/.el-dialog__footer {
    text-align: center;
  }
  .pagination-container {
    padding: 20px 10px;
  }
}
</style>
