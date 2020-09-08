<template>
  <div class="initialization-list-wrapper">
    <div class="left-wrapper">
      <div class="wrapper-title">
        <div class="chinese">实训大纲</div>
        <div class="english">SHIXUNDAGANG</div>
      </div>
      <div class="wrapper-content">
        <div id="drapOutline">
          <div class="list-line" :class="[{ actived: item.id == lessonOutlineId }, {deleted : item.isDeleted}]" v-for="(item, index) in outlineList" :key="index" @click="handleCheck(item.id, item.isDeleted)">
            <el-tooltip :disabled="item.outlineName.length < 12" class="item" effect="dark" :content="item.outlineName" placement="top">
              <div class="name">模块{{item.number}} {{item.outlineName}}</div>
            </el-tooltip>
            <div class="opera-content" v-if="lessonType == 2">
              <span class="opera-btn edit" v-if="item.type == 2" @click.stop="handleOperaOutline(item.id, item.outlineName)">编辑</span>
              <span class="opera-btn delete" v-if="!item.isDeleted" @click.stop="handleOperaLine(item.id, item.isDeleted, '删除', '大纲')">删除</span>
              <span class="opera-btn cover" v-else @click.stop="handleOperaLine(item.id, item.isDeleted, '恢复', '大纲')">恢复</span>
            </div>
          </div>
        </div>
        <div class="list-line add-line" v-show="lessonType == 2" @click="handleOperaOutline()">
          <i class="el-icon-plus add-icon"></i>
        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="add-btn">
        <el-button type="primary" size="small" icon="iconfont icontianjia" v-show="lessonType == 2" @click="handleOperaTask()"> 添加任务</el-button>
        <el-button type="primary" size="small" v-show="lessonType == 1" @click="handleOneSync()">同步最新课程</el-button>
      </div>
      <el-table ref="drapTable" style="width: 100%" border
        height="calc(100% - 106px)"
        :data="tableData"
        row-key="id"
        :row-class-name="tableRowClassName">
        <el-table-column label="序号" type="index" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="实训任务" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column label="实训类型" align="center">
          <template slot-scope="scope">
            <span>{{ typeChange(scope.row.taskType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课时" width="100" align="center">
          <template slot-scope="scope">
            <template v-if="lessonType == 2">
              <div class="opera-btn edit" v-if="scope.row.taskType == 101" @click="handleOperaTask(scope.row.id, scope.row)">编辑</div>
              <div class="opera-btn delete" v-if="!scope.row.isDeleted" @click="handleOperaLine(scope.row.id, scope.row.isDeleted, '删除', '任务')">删除</div>
              <div class="opera-btn recover" v-else @click="handleOperaLine(scope.row.id, scope.row.isDeleted, '恢复', '任务')">恢复</div>
            </template>
            <span>{{ scope.row.period }}h</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color: #36CEA9" @click="handleLook(scope.row, scope.row.taskType)">查看</el-button>
            <el-button type="text" size="small" style="color: #36CEA9" @click="lookResuoces(scope.row)" v-if="scope.row.taskType != 4">个性化资源</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- sure-btn -->
      <div class="sure-btn">
        <el-button size="medium" v-if="path == 1"  @click="handleBack()">返回上一步</el-button>
        <el-button type="primary" v-else  size="medium" @click="handleClose()">关闭</el-button>
        <el-button type="primary" v-if="path == 1"  size="medium" @click="handleSure()">设置好了</el-button>
      </div>
    </div>

    <!-- 添加大纲弹窗 -->
    <el-dialog :title="dialogOutlineTitle" width="560px"
      :visible.sync="dialogOutline"
      @close="closeDialog('ruleFormOutline')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body>
      <el-form :model="ruleFormOutline" :rules="rulesOutline" ref="ruleFormOutline" label-width="90px">
        <el-form-item label="大纲名称" prop="outlineName">
          <el-input placeholder="请输入大纲名称" v-model="ruleFormOutline.outlineName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogOutline = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleSubmit('ruleFormOutline')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加任务弹窗 -->
    <el-dialog :title="dialogTaskTitle" width="560px"
      :visible.sync="dialogTask"
      @close="closeDialog('ruleFormTask')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body>
      <el-form :model="ruleFormTask" :rules="rulesTask" ref="ruleFormTask" label-width="90px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input placeholder="请输入任务名称" v-model="ruleFormTask.taskName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="课时" prop="period">
          <el-input placeholder="请输入课时（最多一位小数）" v-model="ruleFormTask.period"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="introduce">
          <el-input
            type="textarea"
            placeholder="请输入任务描述"
            v-model="ruleFormTask.introduce"
            maxlength="300"
            show-word-limit
            autocomplete="on"
            :autosize="{ minRows: 4}">
          </el-input>
        </el-form-item>
        <el-form-item label="任务资源" ref="expandFileResDTOList" prop="expandFileResDTOList">
          <el-upload
            action="#"
            multiple
            accept=".ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :http-request="fileUpload"
            :before-upload="beforeUpload"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" style="height:30px;line-height: 30px;font-size: 12px;color: #606266;"></div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogTask = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleSubmit('ruleFormTask')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 初始化弹窗 -->
    <el-dialog :title="dialogLookTitle" width="980px"
      custom-class="look-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogLook">
      <task-detail v-if="dialogLook && currentLookType != 4" :activeState="activeState" :lessonType="lessonType" :currentTaskId="currentTaskId" :currentLookType="currentLookType"></task-detail>
      <paper-list v-if="dialogLook && currentLookType == 4" :currentPaperId="currentTaskId" ></paper-list>
    </el-dialog>

    <!-- 个性化资源-->
    <add-resources v-if="showResource" :activeState="activeState" :lessonType="lessonType" :resourceData="resourceData" :commonTaskId='classTaskId' path="我的教案" @closeBusinessDialog="closeBusinessDialog"></add-resources>
  </div>
</template>

<script>
import taskDetail from './components/taskDetail'
import paperList from './components/paperList'
import AddResources from '@/pages/jxgl/components/AddResources'
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import { _debounce, getFileType } from '@/common/js/utils.js'
import { wjUp } from '@/api/teamAdmin'
import { testActivation } from '@/api/base.js'
import {
  lessonOutlineList,
  lessonOutlineSort,
  lessonOutlineUpdate,
  lessonCourseSave,
  lessonTaskList,
  lessonTaskStatus,
  lessonTaskSort,
  lessonOutlineStatus,
  lessonTaskUpdate,
  lessonCourseMana
} from '@/api/initialization.js'

export default {
  data() {
    var checkFile = (rule, value, callback) => {
      if (!this.ruleFormTask.expandFileResDTOList.length) {
        return callback(new Error('请至少上传一个文件'))
      } else {
        callback()
      }
    }
    var checkPeriod = (rule, value, callback) => {
      const period = /^\d*\.{0,1}\d{0,1}$/
      if (value == 0) {
        callback(new Error('请输入正确的课时'))
      } else if (!period.test(value)) {
        callback(new Error('请输入正确的课时'))
      } else {
        callback()
      }
    }
    return {
      userId: localStorage.getItem('userId'), // userId
      customerId: localStorage.getItem('customerId'),
      classId: localStorage.getItem('classId'), // classId
      path: localStorage.getItem('path'), // 1 弹窗调用 2 我的教案调用
      outlineList: [],
      lessonType: '', // 1 标准教案 2 个性教案
      lessonOutlineId: '', // 选中的大纲id
      tableData: [], // 任务列表
      // 分页参数
      total: 1,
      fileList: [], // 编辑列表
      dialogOutline: false, // 大纲弹窗
      dialogOutlineTitle: '', // 大纲弹窗标题
      dialogTask: false, // 任务弹窗
      dialogTaskTitle: '', // 任务弹窗标题
      ruleFormOutline: {}, // 添加大纲参数
      ruleFormTask: {}, // 添加任务参数
      // 校验规则
      rulesOutline: {
        outlineName: [{ required: true, message: '请输入大纲名称', trigger: 'blur' }]
      },
      rulesTask: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        introduce: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
        period: [{ required: true, message: '请输入任务课时', trigger: 'blur' }, { type: 'number', validator: checkPeriod, trigger: 'blur' }],
        expandFileResDTOList: [{ validator: checkFile, required: true, trigger: 'blur' }]
      },
      dialogLook: false, // 查看弹窗
      dialogLookTitle: '', // 查看弹窗标题
      currentTaskId: '', // 选中查看的任务id
      currentLookType: '', // 选中查看的任务类型
      showResource: false, // 显示个性化资源弹窗
      classTaskId: '', // 班级任务id
      activeState: '', // 学习是否激活
      networkState: localStorage.getItem('networkState') // 获取网络状态
    }
  },
  components: {
    taskDetail,
    paperList,
    AddResources
  },
  computed: {
    ...mapState(['lessonCourseId'])
  },
  created() {
    this.testSchoolActivation()
    this.getLessonOutlineList()
  },
  mounted() {
    // 拖拽列表
    this.dragSetOutlineSort()
    this.dragSetTableSort()
  },
  methods: {
    // row className
    tableRowClassName({ row, rowIndex }) {
      if (row.isDeleted) {
        return 'deleted-row'
      }
      return ''
    },
    // 验证当前学校是否激活
    testSchoolActivation() {
      testActivation({
        customerId: this.customerId
      }).then(res => {
        if (res.code == 0) {
          //  this.activeState  1-已激活  0-未激活
          this.activeState = res.result.activate
        }
      })
    },
    // 获取大纲列表
    getLessonOutlineList() {
      lessonOutlineList({ lessonCourseId: this.lessonCourseId }).then(res => {
        if (res.code === '0') {
          for (let index = 0; index < res.result.length; index++) {
            res.result[index].number = this.numTransform(index)
          }
          this.outlineList = res.result
          this.lessonType = this.outlineList[0].lessonType
          this.lessonOutlineId = this.outlineList[0].id
          this.getLessonTaskList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 实训类型转换
    typeChange(type) {
      return type == 1 ? '个人练习任务'
        : type == 2 ? '团队练习任务'
        : type == 3 ? '实操任务'
        : type == 4 ? '考试任务'
        : type == 5 ? '知识点任务'
        : type == 6 ? '账套任务'
        : type == 7 ? '功能实训'
        : type == 101 ? '拓展任务'
        : ''
    },
    // 选择大纲
    handleCheck(id, status) {
      if (this.lessonOutlineId != id && !status) {
        this.lessonOutlineId = id
        this.getLessonTaskList()
      }
    },
    // 获取任务列表
    getLessonTaskList() {
      lessonTaskList({ lessonOutlineId: this.lessonOutlineId }).then(res => {
        if (res.code === '0') {
          this.tableData = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 返回上一步
    handleBack() {
      this.$store.state.dialogInitList = false
      this.$store.state.dialogInit = true
    },
    // 关闭
    handleClose() {
      this.$store.state.dialogInitList = false
      localStorage.removeItem('path')
    },
    // 设置好了
    handleSure() {
      this.$confirm('确认提交此设置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
      .then(async () => {
        lessonCourseSave({ id: this.lessonCourseId, classId: this.classId }).then(res => {
          if (res.code === '0') {
            this.$store.state.dialogInitList = false
            localStorage.setItem('startStatus', 0)
            this.$message.success('设置成功')
            // 刷新
            this.$router.go(0)
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        // 取消
      })
    },
    // 拖拽大纲排序
    dragSetOutlineSort() {
      const el = document.getElementById('drapOutline')
      var that = this
      this.sortable = Sortable.create(el, {
        animation: 180,
        delay: 0,
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onUpdate: function(event) {
          var newIndex = event.newIndex
          var oldIndex = event.oldIndex
          var $li = el.children[newIndex]
          var $oldLi = el.children[oldIndex]
          // 先删除移动的节点
          el.removeChild($li)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            el.insertBefore($li, $oldLi)
          } else {
            el.insertBefore($li, $oldLi.nextSibling)
          }
          // 更新items数组
          var item = that.outlineList.splice(oldIndex, 1)
          that.outlineList.splice(newIndex, 0, item[0])
          // 下一个tick就会走patch更新
        },
        onEnd: evt => {
          // 调用接口
          lessonOutlineSort({ lessonOutlineDTOList: this.outlineList }).then(res => {
            if (res.code === '0') {
              // 排序成功
              // this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 拖拽排序
    dragSetTableSort() {
      const el = this.$refs.drapTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        animation: 180,
        delay: 0,
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const tragetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, tragetRow)
          // 调用接口
          lessonTaskSort({ lessonTaskDTOList: this.tableData }).then(res => {
            if (res.code === '0') {
              // 排序成功
              // this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    handleOneSync() {
      this.$confirm('确认同步最新课程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
      .then(async () => {
        lessonCourseMana({ id: this.lessonCourseId }).then(res => {
          if (res.code === '0') {
            this.$message.success('同步成功')
            this.getLessonOutlineList()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        // 取消
      })
    },
    // 大纲 添加、编辑
    handleOperaOutline(id, outlineName) {
      this.dialogOutline = true
      if (id) {
        this.dialogOutlineTitle = '编辑大纲'
        this.ruleFormOutline = {
          id: id,
          outlineName: outlineName
        }
      } else {
        this.dialogOutlineTitle = '添加大纲'
      }
    },
    // 任务 添加、编辑
    handleOperaTask(id, row) {
      this.dialogTask = true
      if (id) {
        this.dialogTaskTitle = '编辑任务'
        this.fileList = row.expandFileResDTOList
        this.ruleFormTask = {
          id: id,
          lessonCourseId: this.lessonCourseId,
          lessonOutlineId: this.lessonOutlineId,
          taskName: row.taskName,
          period: row.period,
          introduce: row.introduce,
          expandFileResDTOList: row.expandFileResDTOList
        }
      } else {
        this.dialogTaskTitle = '添加任务'
        this.ruleFormTask = {
          lessonCourseId: this.lessonCourseId,
          lessonOutlineId: this.lessonOutlineId,
          expandFileResDTOList: []
        }
      }
    },
    // 大纲、任务 删除 恢复
    handleOperaLine(id, status, txt, type) {
      this.$confirm('确认' + txt + '此' + type + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
      .then(async () => {
        if (type == '大纲') {
          lessonOutlineStatus({
            lessonOutlineId: id,
            isDeleted: !status
          }).then(res => {
            if (res.code === '0') {
              this.$message.success(txt + '成功')
              this.getLessonOutlineList()
            } else {
              this.$message.warning(res.message)
            }
          })
        } else if (type == '任务') {
          lessonTaskStatus({
            lessonTaskId: id,
            isDeleted: !status
          }).then(res => {
            if (res.code === '0') {
              this.$message.success(txt + '成功')
              this.getLessonTaskList()
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      }).catch(() => {
        // 取消
      })
    },
    // 关闭复制弹窗
    closeDialog(formName) {
      this.$refs[formName].resetFields()
      this[formName] = {}
      this.fileList = []
    },
    // 定制内容
    handleSubmit: _debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this[formName].lessonCourseId = this.lessonCourseId
          if (formName == 'ruleFormOutline') {
            // 大纲编辑
            lessonOutlineUpdate(this.ruleFormOutline).then(res => {
              if (res.code === '0') {
                this.dialogOutline = false
                // this.$message.success(res.message)
                this.getLessonOutlineList()
              } else {
                this.$message.warning(res.message)
              }
            })
          } else if (formName == 'ruleFormTask') {
            // 任务编辑
            lessonTaskUpdate(this.ruleFormTask).then(res => {
              if (res.code === '0') {
                this.dialogTask = false
                // this.$message.success(res.message)
                this.getLessonTaskList()
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
    }),
    // 文件校验
    beforeUpload(file) {
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
      const type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix'
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确类型的文件！')
        return !isExt
      }
      if (ext != 'exe' && ext != 'autowork' && ext != 'sql') {
        // 文件大小限制
        const specialType = '.mp4,.rmvb,.avi,.mp3'
        const specialExt = specialType.indexOf(ext) < 0
        const maxSize = file.size / 1024 / 1024 > 100
        const isLtSize = file.size / 1024 / 1024 > 20

        if (maxSize) {
          this.$message.warning('文件最大不能超过 100MB！')
          return false
        } else if (specialExt && isLtSize) {
          this.$message.warning('除mp4、rmvb、avi文件外，文件不能超过 20MB！')
          return false
        }
      }
    },
    // 上传文件
    async fileUpload(e) {
      const url = await this.cos(e, e.file)
      // this.$forceUpdate()
      const name = e.file.name
      const resName = name
      const resExt = name.substring(name.lastIndexOf('.') + 1)
      const resType = getFileType(resExt)

      const res = await wjUp({
        resName: resName,
        downloadUrl: url,
        resType: resType,
        resExt: resExt,
        resSize: e.file.size,
        creator: this.userId
      })
      if (res.code === '0') {
        const obj = {
          name: resName,
          pubResId: res.result
        }
        this.ruleFormTask.expandFileResDTOList.push(obj)
      } else {
        this.$message.warning(res.message)
      }
    },
    handleSuccess() {
      this.$refs.expandFileResDTOList.clearValidate()
    },
    // 删除
    handleRemove(file, fileList) {
      const arr = this.ruleFormTask.expandFileResDTOList
      for (var i in arr) {
        if (arr[i].name == file.name) {
          arr.splice(i, 1)
        }
      }
    },
    // 转化数字为中文
    numTransform(index) {
      index = index + 1
      const number = parseInt(index, 0)
      const singleWord = [
        '',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '零'
      ]
      const unit = ['十', '百']
      const indexFirstNum = parseInt(number.toString().substr(0, 1), 0)
      const indexSecondNum = parseInt(number.toString().substr(1, 1), 0)
      const indexThirdNum = parseInt(number.toString().substr(2, 1), 0)
      if (number < 10) {
        return singleWord[number]
      } else if (number < 100) {
        if (indexFirstNum === 1) {
          // 10为特殊情况
          return unit[0] + singleWord[indexSecondNum]
        } else {
          return singleWord[indexFirstNum] + unit[0] + singleWord[indexSecondNum]
        }
      } else {
        if (indexThirdNum === 0 && indexSecondNum === 0) {
          // 109 和 190 两种类型的特殊情况
          return singleWord[indexFirstNum] + unit[1]
        } else if (indexSecondNum === 0) {
          return (
            singleWord[indexFirstNum] +
            unit[1] +
            singleWord[10] +
            singleWord[indexThirdNum]
          )
        }
        return (
          singleWord[indexFirstNum] +
          unit[1] +
          singleWord[indexSecondNum] +
          unit[0] +
          singleWord[indexThirdNum]
        )
      }
    },
    // 查看
    handleLook(row, type) {
      if (type == 4) {
        // 考试任务
        this.currentTaskId = row.paperId
      } else {
        this.currentTaskId = row.id
      }
      this.currentLookType = row.taskType
      this.dialogLookTitle = row.taskName
      this.dialogLook = true
    },
    // 个性化资源
    lookResuoces(obj) {
      const _this = this
      const _thisType = obj.taskType
      if (this.networkState == 'off' && (_thisType == 3 || _thisType == 6 || _thisType == 7)) {
        return false
      }
      _this.classTaskId = obj.id
      _this.resourceData = obj.id
      _this.showResource = true
    },
    // 关闭弹窗
    closeBusinessDialog() {
      this.showResource = false
    }
  }
}
</script>
<style lang="scss">
  .initialization-list-wrapper {
    display: flex;
    height: 100%;
    position: relative;
    .left-wrapper {
      width: 273px;
      .wrapper-title {
        width: 100%;
        height: 67px;
        padding: 18px 0 0 23px;
        color: #fff;
        font-weight: 500;
        border-radius: 2px 0 2px 0;
        background: #36CEA9 url('./image/dagang.png') no-repeat top 17px right 30px;
        .chinese {
          font-size: 18px;
          line-height: 21px;
        }
        .english {
          font-size: 12px;
          line-height: 13px;
          opacity: 25%;
        }
      }
      .wrapper-content {
        padding-top: 4px;
        height: calc(100% - 67px);
        overflow: auto;
        .list-line {
          width: 100%;
          height: 56px;
          background: #F3FCFA;
          margin-bottom: 4px;
          padding: 0 16px;
          cursor: pointer;
          border-radius: 0 2px 2px 0;
          border-right: 4px solid transparent;
          position: relative;
          &.actived {
            background: #36CEA9;
            .name {
              color: #fff;
            }
            .el-progress-bar__inner {
              background: #fff;
            }
            .el-progress__text {
              color: #fff;
            }
          }
          &:hover {
            border-right: 4px solid #36CEA9;
            .opera-content {
              display: block;
            }
          }
          // &.myself:hover {
          //   .opera-content {
          //     display: block;
          //   }
          // }
          &.deleted {
            background: #eee;
          }
          .name {
            color: #333;
            font-size: 14px;
            line-height: 56px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space :nowrap;
          }
          .el-progress-bar__outer {
            height: 8px!important;
          }
          .el-progress__text {
            color: #36CEA9;
            font-size: 12px!important;
          }
          .opera-content {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.2);
            text-align: right;
            line-height: 56px;
            .opera-btn {
              display: inline-block;
              width: 40px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              border-radius: 50%;
              color: #fff;
              margin-right: 5px;
              &.edit, &.cover {
                background: #36CEA9;
              }
              &.delete {
                background: #FF9D6A;
              }

            }
          }
          &.add-line {
            // margin-bottom: 0;
            &:hover {
              border-right: 4px solid transparent;
            }
            .add-icon {
              display: block;
              font-size: 42px;
              line-height: 56px;
              text-align: center;
            }
          }

        }
      }
    }
    .right-wrapper {
      flex: 1;
      overflow: hidden;
      padding: 20px;
      .add-btn {
        text-align: right;
        margin-bottom: 12px;
        .el-button--small {
          width: 132px;
        }
      }
      .el-table {
        cursor: pointer;
        .el-table__header-wrapper th {
          background: #F3FCFA;
        }

        .el-table__body tr {
          position: relative;
          .opera-btn {
            display: none;
            position: absolute;
            top: 2px;
            left: -50px;
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            background: #36CEA9;
            &.edit {
              left: -105px;
            }
            &.delete {
              background: #FF9D6A;
            }
          }
          &.deleted-row {
            background: #eee;
          }
          &:hover {
            &.deleted-row {
              .el-button {
                display: none;
              }
            }
            td {
              background: #ccc;
              // opacity: 0.6;
              border-right: none;
            }
            .opera-btn {
              display: block;
            }
          }
        }
      }
      .pagination-container {
        padding: 10px 20px 0;
      }
      .sure-btn {
        text-align: right;
        margin-top: 18px;
        .el-button--medium {
          width: 120px;
        }
      }
    }
  }
  .look-dialog {
     .el-dialog__body {
      height: 635px;
      overflow: auto;
    }
  }
</style>