<template>
  <div class="initialization-wrapper">
    <span class="tem-skip" v-if="path == 1" @click="closeDialogInit()">暂时跳过</span>
    <el-row :gutter="28" class="search-container">
      <el-col :span="1.5" class="fr">
        <el-button type="primary" size="small" class="fr" @click="handleSearch()">搜 索</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <el-input size="small" v-model="lessonCode" placeholder="请输入教案编码"></el-input>
      </el-col>
    </el-row>
    <div class="steps-container" v-if="path == 1">
      <div class="steps" :class="actived == item.key ? 'steps-actived' : ''" v-for="item in stepList" :key="item.key">
        <span class="steps-circle">{{item.key + 1}}</span>
        <span>{{item.name}}</span>
        <div class="triangle" v-show="actived === item.key">
          <span></span>
        </div>
      </div>
    </div>
    <div class="card-container" :class="path == 1 ? 'heightoverflow' : ''">
      <el-card shadow="hover" :class="[{ checked: item.isMe == 1 && path == 2 }, {dialog: path == 1 }]" v-for="(item, index) in cardList" :key="index">
        <div class="card-type" :class="item.lessonType == 2 ? 'person' : ''">{{ item.lessonType == 2 ? '个性教案' : '标准教案'}}</div>
        <div class="card-title">{{ item.lessonName }}</div>
        <div class="card-infor">
          <div>版本：{{ item.version }}</div>
          <div>总课时：{{ item. sumPeriod}}h</div>
          <div v-if="item.lessonCode">教案编码：{{ item.lessonCode}}</div>
          <div v-if="item.lessonPwd">
            教案密码：{{ item.openStatus == false ? '******' : item.lessonPwd }}
            <i class="iconfont" :class="item.openStatus == false ? 'iconclose_eye' : 'iconopen_eye'" @click="starToString(item)"></i>
          </div>
        </div>
        <div class="card-btn">
           <el-button type="primary" size="small" @click="handleCopy(item.id, item.lessonName)">复制</el-button>
           <el-button type="primary" size="small" @click="handleNext(item.id)">查看</el-button>
           <el-button type="primary" size="small" v-if="!item.isChecked && path == 1" @click="handleChose(index)">选择</el-button>
           <el-button type="warning" size="small" v-if="item.isChecked && path == 1">已选择</el-button>
        </div>
      </el-card>
    </div>
    <el-row class="next-btn">
      <el-button type="primary" class="fr" size="small" v-if="path == 1" @click="handleNext(lessonCourseId)">下一步</el-button>
    </el-row>

    <!-- 搜索教案弹窗 -->
    <el-dialog title="搜索教案" width="560px"
      :visible.sync="dialogSearch"
      @close='closeDialogSearch()'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body>
      <el-form :model="searchForm" :rules="rulesPwd" ref="searchForm" label-width="90px">
        <el-form-item label="搜索编码">
          <el-input disabled v-model="lessonCode"></el-input>
        </el-form-item>
        <el-form-item label="教案名称">
          <el-input disabled v-model="searchForm.lessonName"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input disabled v-model="searchForm.version"></el-input>
        </el-form-item>
        <el-form-item label="总课时">
          <el-input disabled v-model="searchForm.sumPeriod"></el-input>
        </el-form-item>
        <el-form-item label="教案创始人">
          <el-input disabled v-model="searchForm.createName"></el-input>
        </el-form-item>
        <el-form-item label="教案密码" prop="lessonPwd">
          <el-input placeholder="请输入该教案的密码" v-model="searchForm.lessonPwd" maxlength="10" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogSearch = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleOpenCopy('searchForm', searchForm.id, searchForm.lessonName)">复制教案</el-button>
      </div>
    </el-dialog>

    <!-- 复制教案弹窗 -->
    <el-dialog title="复制教案" width="560px"
      :visible.sync="dialogCopy"
      @close='closeDialogCopy()'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
        <el-form-item label="原教案名称">
          <el-input disabled v-model="ruleForm.oldName"></el-input>
        </el-form-item>
        <el-form-item label="教案名称" prop="lessonName">
          <el-input placeholder="请输入教案名称" clearable v-model="ruleForm.lessonName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input placeholder="请输入版本号" clearable v-model="ruleForm.version"></el-input>
        </el-form-item>
        <el-form-item label="教案编码">
          <el-input disabled v-model="ruleForm.lessonCode"></el-input>
        </el-form-item>
        <el-form-item label="教案密码" prop="lessonPwd">
          <el-input placeholder="请设置教案密码" v-model="ruleForm.lessonPwd" maxlength="10" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogCopy = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleCopySubmit('ruleForm')">定制内容</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { _debounce } from '@/common/js/utils.js'
import { lessonCourseList, lessonCourseCopy, lessonCourseRandom, lessonCheckPwd } from '@/api/initialization.js'

export default {
  props: {
    path: String // 引入组件 1 弹窗 2 我的教案
  },
  data () {
    return {
      customerId: localStorage.getItem('customerId'),
      classId: localStorage.getItem('classId'),
      courseId: localStorage.getItem('courseId'),
      lessonCode: '', // 搜索 教案编码
      actived: 0, // 选择步骤
      // 步骤列表
      stepList: [
        { key: 0, name: '选择教案' },
        { key: 1, name: '定制大纲' }
      ],
      cardList: [], // 教案列表
      lessonCourseId: '', // 选中的教案id
      dialogSearch: false, // 搜索教案弹窗
      dialogCopy: false, // 复制教案弹窗
      searchForm: {}, // 搜索教案结果
      ruleForm: {}, // 复制教案参数
      // 校验规则
      rules: {
        lessonName: [{ required: true, message: '请输入教案名称', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        lessonPwd: [{ required: true, message: '请输入教案密码', trigger: 'blur' }]
      },
      rulesPwd: {
        lessonPwd: [{ required: true, message: '请输入教案密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getLessonCourseList()
  },
  methods: {
    // 获取教案列表
    getLessonCourseList() {
      lessonCourseList({
        customerId: this.customerId,
        classId: this.classId,
        courseId: this.courseId
      }).then(res => {
        if (res.code === '0') {
          res.result.map(item => {
            item.isChecked = false
            item.openStatus = false
          })
          res.result[0].isChecked = true
          this.cardList = res.result
          this.lessonCourseId = this.cardList[0].id
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // ** 变明文
    starToString(item) {
      item.openStatus = !item.openStatus
    },
    // 搜索
    handleSearch() {
      if (this.lessonCode != '') {
        lessonCourseList({
          courseId: this.courseId,
          lessonCode: this.lessonCode
        }).then(res => {
          if (res.code === '0') {
            if (res.result) {
              this.dialogSearch = true
              this.searchForm = res.result[0]
            } else {
              this.$message.warning(res.message)
            }
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.warning('请输入教案编码')
      }
    },
    // 复制教案
    handleOpenCopy: _debounce(function (formName, id, name) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          lessonCheckPwd({
            lessonCourseId: this.searchForm.id,
            lessonPwd: this.searchForm.lessonPwd
          }).then(res => {
            if (res.code === '0') {
              if (res.result == true) {
                this.dialogSearch = false
                this.handleCopy(id, name)
              } else {
                this.$message.warning('教案密码错误，请重新输入')
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          return false
        }
      })
    }),
    // 复制
    handleCopy(id, name) {
      this.ruleForm = {
        id: id,
        oldName: name,
        customerId: this.customerId
      }
      lessonCourseRandom().then(res => {
        if (res.code === '0') {
          this.ruleForm.lessonCode = res.result
          this.dialogCopy = true
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 关闭搜索弹窗
    closeDialogSearch() {
      this.lessonCode = ''
    },
    // 关闭复制弹窗
    closeDialogCopy() {
      this.$refs.ruleForm.resetFields()
    },
    // 定制内容
    handleCopySubmit: _debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          lessonCourseCopy(this.ruleForm).then(res => {
            if (res.code === '0') {
              this.dialogCopy = false
              // 清空搜素编码
              this.lessonCode = ''
              this.$message.success(res.message)
              this.getLessonCourseList()
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          return false
        }
      })
    }),
    // 选择
    handleChose(i) {
      var isChecked = this.cardList[i].isChecked
      this.lessonCourseId = this.cardList[i].id
      for (let j = 0; j < this.cardList.length; j++) {
        if (j == i) {
          this.cardList[i].isChecked = true
        } else {
          this.cardList[j].isChecked = false
        }
      }
    },
    // 暂时跳过
    closeDialogInit() {
      this.$store.state.dialogInit = false
    },
    // 下一步
    handleNext(id) {
      localStorage.setItem('path', this.path)
      this.$store.state.dialogInit = false
      this.$store.state.dialogInitList = true
      this.$store.commit('setLessonId', id)
    }
  }
}
</script>

<style lang="scss">
  .initialization-wrapper {
    padding: 5px 18px;
    .tem-skip {
      color: #36CEA9;
      font-size: 13px;
      padding: 10px;
      position: absolute;
      top: 8px;
      right: 20px;
      cursor: pointer;
    }
    .search-container {
      margin-bottom: 20px;
      .el-input__inner {
        width: 230px;
      }
      .el-button--small {
        width: 100px;
      }
    }
    .steps-container {
      height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
      cursor: pointer;
      .steps-circle {
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        display: inline-block;
        border-radius: 50%;
        background: #fff;
        color: #36CEA9;
        font-size: 12px;
        margin-right: 5px;
      }
      .steps {
        width: 50%;
        font-size:13px;
        height: 36px;
        color: #36CEA9;
        background: #E4E4E4;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .steps-actived {
        color: #fff;
        background-color: #36CEA9;
      }
      .triangle {
        span {
          display: block;
          width: 0;
          height: 0;
          border-width: 10px 10px 0;
          border-style: solid;
          border-color: #36CEA9 transparent transparent;
          position: absolute;
          bottom: -8px;
          left: 49%;
        }
      }
    }
    .card-container {
      width: 100%;
      overflow: auto;
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      &.heightoverflow {
        height: 445px;
        overflow: auto;
      }
      .el-card {
        width: 284px;
        height: 206px;
        margin-bottom: 24px;
        margin-right: 15px;
        &.checked {
          background: #fff url('../../common/images/teachplan-checked.png') no-repeat right bottom;
          background-size: 106px;
        }
        &.dialog:nth-child(3n) {
          margin-right: 0;
        }
        position: relative;
        .el-card__body {
          padding: 20px 18px;
          .card-type {
            position: absolute;
            top: 0;
            right: 0;
            width: 70px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            color: #fff;
            font-size: 12px;
            border-bottom-left-radius: 10px;
            background: #36CEA9;
            &.person {
              background: #FF9D6A;
            }
          }
          .card-title {
            font-size: 16px;
            color: #333;
            line-height: 44px;
            // padding-top: 4px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .card-infor {
            height: 92px;
            div {
              font-size: 13px;
              color: #777;
              line-height: 23px;
            }
            .iconfont {
              position: absolute;
              right: 105px;

            }
          }
          .card-btn {
            margin-top: 6px;
            .el-button--small {
              width: 75px;
            }
          }
        }
      }
    }
    .next-btn {
      // margin-bottom: 16px;
      .el-button--small {
        width: 120px;
      }
    }
  }
</style>