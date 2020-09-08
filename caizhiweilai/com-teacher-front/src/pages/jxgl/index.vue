<template>
  <div class="edu-manage" :style="{minHeight:boxHeight+'px'}">
    <i class="iconfont pack-up" @click="packUp" v-html="this.showHide? '&#xe632;' : '&#xe672;'"></i>
    <div class="left" :class="{'active':showHide}">
      <p class="title">实训大纲</p>
<!--      <div class="outline-box" :style="{height:elScrollHeight+'px'}">-->
      <div class="outline-box">
        <el-scrollbar>
          <ul class="outline-list">
            <li v-for="(item,i) in oulineDta" :key="item.id" :data-id="item.id" :class="{active:i == currentTrain}"
                @click="switchTask(item.id,i)" :title="item.outlineName">
              <p :title="item.outlineName">模块{{item.lableNum}}、{{item.outlineName}}</p>
              <el-progress v-if="item.taskProgress" :percentage="Number(item.taskProgress)"></el-progress>
              <el-progress v-else :percentage="Number(0)"></el-progress>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="right" ref="tableHeight" :class="{'active':showHide}">
      <div class="btn-box">
        <button @click="unlockTaskList()">解锁任务</button>
        <button @click="lessonCourseSyncFun()">同步教案</button>
      </div>
      <el-table ref="multipleTable" :data="taskListData" class="task-table"
                :row-class-name="tableRowClass"
                :header-cell-style="{background:'#FAFCFE',color:'#000'}"
                @row-click="clickRow"
                tooltip-effect="dark" @selection-change="choiceClear" empty-text="暂无数据~~">
        <el-table-column type="selection" min-width="10%" :selectable="checkboxInit"></el-table-column>
        <el-table-column label="序号" type="index" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="实训类型" min-width="16%">
          <template slot-scope="scope">
            <span v-if="scope.row.taskType == 1 || scope.row.taskType == 101">个人练习任务</span>
            <span v-if="scope.row.taskType == 2">团队练习任务</span>
            <span v-if="scope.row.taskType == 3">实操任务</span>
            <span v-if="scope.row.taskType == 4">考试任务</span>
            <span v-if="scope.row.taskType == 5">知识点任务</span>
            <span v-if="scope.row.taskType == 6">账套任务</span>
            <span v-if="scope.row.taskType == 7">功能实训</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="实训任务" min-width="22%"></el-table-column>
        <el-table-column prop="period" label="课时" min-width="10%">
          <template slot-scope="scope">
            <span style="display: block;padding-left: 4px;">{{scope.row.period}}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" min-width="10%">
          <template slot-scope="scope">
            {{scope.row.isunlock== 0?'未解锁':'已解锁'}}
          </template>
        </el-table-column>
        <el-table-column prop="taskProgress" label="任务进度" min-width="20%">
          <template slot-scope="scope">
            <span v-if="scope.row.isunlock == 0">----</span>
            <el-progress v-if="scope.row.isunlock == 1" :percentage="Number(scope.row.taskProgress)"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="22%">
          <template slot-scope="scope">
            <span class="exam-opera-btn" @click.prevent="lookExam(scope.$index, taskListData)">查看</span>
            <span class="exam-opera-btn" @click.prevent="openAccout(scope.row)"
                  v-if="scope.row.taskType == 6">设置账套</span>
            <span class="exam-opera-btn" @click.prevent="lookResuoces(scope.row)"
                  v-if="scope.row.taskType != 4">个性化资源</span>
            <span class="exam-opera-btn"
                  v-if="scope.row.taskType == 3 && scope.row.operationCode == 'RISK_TAX' || scope.row.operationCode == 'RISK_BD'"
                  @click="setBusiness(taskListData[scope.$index])">设置企业</span>
            <span class="exam-opera-btn" :class="{prohibit:scope.row.state != 0}" data-fun="exam"
                  v-if="taskListData[scope.$index].isunlock == '1' && taskListData[scope.$index].taskType == 4"
                  @click.prevent="beginExam($event, scope.$index,taskListData)"
                  v-html="scope.row.state == 0 ? '开始考试': '已开始'"></span>
            <span class="exam-opera-btn" :class="{prohibit:scope.row.state == 2}" data-fun="answer"
                  v-if="taskListData[scope.$index].isunlock == '1' && taskListData[scope.$index].taskType == 4"
                  @click.prevent="beginExam($event, scope.$index,taskListData)"
                  v-html="scope.row.state == 2 ? '已开放': '开放答案'">开放答案</span>
          </template>
        </el-table-column>
      </el-table>
      <set-exam @closeConfirm="closeConfirm" v-if="showConfirm" :confirmData="confirmData"></set-exam>
      <!-- 设置企业-->
      <business-list v-if="showSetBusiness" :busniessData="busniessData" @updateList="updateList"
                     @closeBusinessDialog="closeBusinessDialog"></business-list>
      <!-- 个性化资源-->
      <add-resources v-if="showResource" :resourceData="resourceData" :commonTaskId='classTaskId' path="教学管理"
                     @closeBusinessDialog="closeBusinessDialog"></add-resources>
      <!--设置账套-->
      <set-account v-if="showSetAccount" @closeConfirm="closeConfirm" :cuurentAccountId="cuurentAccountId"></set-account>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
import SetExam from './components/SetExam'
import BusinessList from './components/BusinessList'
import AddResources from './components/AddResources'
import SetAccount from './components/SetAccount'
import {
  getPaperMessage,
  getOutlineList,
  getTaskState,
  unlockTask,
  getBusinessList,
  lessonCourseSync
} from '@/api/teamAdmin'

export default {
  // name: 'TeachManPage',
  data() {
    return {
      currentTrain: 0, // 当前所在实训
      oulineDta: [], // 大纲列表数据
      taskListData: [], // 大纲下的任务数据列表
      unlockData: [], // 解锁数据
      showConfirm: false, // 确认弹框显示隐藏
      confirmData: {}, // 考试弹窗需要的数据
      elScrollHeight: 0, // element中的scroll的高度
      defaultShowIndex: 0, // 默认展示第一条大纲数据
      showSetBusiness: false, // 显示隐藏设置企业
      busniessData: [], // 企业列表数据
      resourceData: {}, // 个性化资源文件数据
      showResource: false, // 显示个性化资源弹窗
      classTaskId: '', // 班级任务id
      currentOutlineId: '', // 当前大纲的id
      resouceId: '', // 当前查看的资源id
      showSetAccount: false, // 设置账套弹窗
      cuurentAccountId: {}, // 当前账套任务的id
      showHide: 0, // 大纲列表展开收起
      networkState: localStorage.getItem('networkState') // 获取网络状态
    }
  },
  components: {
    SetExam,
    BusinessList,
    AddResources,
    SetAccount
  },
  computed: {
    ...mapState({
      boxHeight: state => state.windowHeight - 220 // 这里的220指的是头部高度70+二级导航高度50+内容去的上下margin40
    })
  },
  mounted() {
    const _this = this
    // 去掉计算大纲列表高度，现在固定展示十个超过出滚动条
    // this.$nextTick(() => {
    //   _this.calculationHeight()
    // })
    this.getTrainData()
  },
  methods: {
    // 获取教学大纲
    getTrainData() {
      const _this = this
      const postData = '?classId=' + localStorage.getItem('classId')
      getOutlineList(postData).then(res => {
        if (res.code == 0) {
          _this.oulineDta = res.result
          for (let i = 0, len = _this.oulineDta.length; i < len; i++) {
            _this.oulineDta[i].lableNum = _this.numTransform(i)
          }
          // _this.currentOutlineId = _this.oulineDta[0].id
          _this.currentTrain = localStorage.getItem('teachIndex') ? localStorage.getItem('teachIndex') : 0
          _this.currentOutlineId = localStorage.getItem('teachLine') ? localStorage.getItem('teachLine') : _this.oulineDta[_this.currentTrain].id
          _this.getCurrentTask()
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 根据大纲id获取大纲下的任务
    getCurrentTask() {
      const _this = this
      const postData = '?classOutlineId=' + _this.currentOutlineId
      getTaskState(postData).then(res => {
        if (res.code == 0) {
          _this.taskListData = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 转化数字为中文
    numTransform(index) {
      index = index + 1
      const number = parseInt(index, 0)
      const singleWord = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '零']
      const unit = ['十', '百']
      const indexFirstNum = parseInt(number.toString().substr(0, 1), 0)
      const indexSecondNum = parseInt(number.toString().substr(1, 1), 0)
      const indexThirdNum = parseInt(number.toString().substr(2, 1), 0)
      if (number < 10) {
        return singleWord[number]
      } else if (number < 100) {
        if (indexFirstNum === 1) { // 10为特殊情况
          return unit[0] + singleWord[indexSecondNum]
        }
        return singleWord[indexFirstNum] + unit[0] + singleWord[indexSecondNum]
      } else {
        if (indexThirdNum === 0 && indexSecondNum === 0) { // 109 和 190 两种类型的特殊情况
          return singleWord[indexFirstNum] + unit[1]
        } else if (indexSecondNum === 0) {
          return singleWord[indexFirstNum] + unit[1] + singleWord[10] + singleWord[indexThirdNum]
        }
        return singleWord[indexFirstNum] + unit[1] + singleWord[indexSecondNum] + unit[0] + singleWord[indexThirdNum]
      }
    },
    // 解锁任务
    unlockTaskList() {
      const _this = this
      if (this.unlockData.length == 0) {
        this.$message.warning('请选择要解锁的任务~~')
        return false
      } else {
        let taskIdArr = this.unlockData.map(item => {
          return item.id
        })
        taskIdArr = taskIdArr.join(',')
        this.$confirm('确定解锁吗？', '解锁任务', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          unlockTask('?classTaskIds=' + taskIdArr).then(res => {
            if (res.code == 0) {
              _this.$message.success('解锁成功~~')
              _this.closeConfirm('1')
            } else {
              this.$message.warning({
                message: res.message
              })
              _this.closeConfirm()
            }
          })
        })
      }
    },
    // 同步
    lessonCourseSyncFun() {
      this.$confirm('确定同步最新教案数据到当前班级内吗？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        const classId = localStorage.getItem('classId')
        lessonCourseSync({
          classId: classId
        }).then(res => {
          if (res.code === '0') {
            this.$message.success('同步成功')
            // 刷新
            this.getTrainData()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        // 取消
      })
    },
    // 设置企业
    setBusiness(obj) {
      const _this = this
      const _thisType = obj.taskType
      if (this.networkState == 'off' && (_thisType == 3 || _thisType == 6 || _thisType == 7)) {
        return false
      }
      const postData = '?classTaskId=' + obj.id
      getBusinessList(postData).then(res => {
        if (res.code == 0) {
          _this.busniessData = res.result
          _this.showSetBusiness = true
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 关闭设置企业弹窗
    closeBusinessDialog() {
      this.busniessData = []
      this.showSetBusiness = false
      this.showResource = false
    },
    // 查看个性化资源文件
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
    // 禁用以后更新企业列表
    updateList(num, str) {
      this.busniessData[num].status = str
      this.busniessData = [...this.busniessData]
    },
    // 切换显示大纲
    switchTask(id, i) {
      this.currentTrain = i
      this.defaultShowIndex = i
      this.currentOutlineId = id
      localStorage.setItem('teachIndex', this.currentTrain)
      this.getCurrentTask()
    },
    // 全选反选
    choiceClear(val) {
      this.unlockData = val
    },
    // 跳转查看
    lookExam(i, arrData) {
      const _thisType = arrData[i].taskType
      if (this.networkState == 'off' && (_thisType == 3 || _thisType == 6 || _thisType == 7)) {
        return false
      }
      // const _parentClass =
      // 考试任务类型跳转到考试详情，其他的任务跳转到任务详情
      if (arrData[i].taskType == 4) {
        // this.$router.push({ path: '/jxgl/ResultDetail', query: { id: arrData[i].paperId } })
        this.$router.push({
          path: '/jxgl/PaperDetail',
          query: {
            id: arrData[i].paperId,
            classTaskId: arrData[i].id
          }
        })
      } else {
        localStorage.setItem('jumpAddress', arrData[i].operationUrl)
        this.$router.push({
          path: '/jxgl/TaskDetail',
          query: {
            id: arrData[i].id,
            currentType: arrData[i].taskType,
            rpaCode: arrData[i].operationCode,
            editPy: arrData[i].funcId
          }
        })
      }
    },
    // 初始化表格已解禁的不能勾选
    checkboxInit(row, index) {
      if (this.networkState == 'off') {
        let _class = true
        if (row.isunlock == '1' || row.taskType == 6 || row.taskType == 7 || row.taskType == 3) {
          _class = false
        } else {
          _class = true
        }
        return _class
      } else {
        if (row.isunlock == '1') {
          return false
        } else {
          return true
        }
      }
    },
    // 开始考试，设置答案
    beginExam(e, i, arrData) {
      const _function = e.srcElement.dataset.fun
      if (_function == 'exam') {
        // 点击开始考试判断是否已经开始，已经开始禁止点击
        if (arrData[i].state == 1 || arrData[i].state == 2) {
          return false
        }
        const postData = {
          paperId: arrData[i].paperId
        }
        // 获取试卷信息
        getPaperMessage(postData).then(res => {
          if (res.code == 0) {
            this.showConfirm = true
            this.confirmData = {
              text: '开始考试',
              func: 0,
              id: arrData[i].id,
              examData: res.result
            }
          } else {
            this.$message.warning(res.message)
          }
        })
      }
      if (_function == 'answer') {
        // 点击开放答案当状态为1时，已经开始考试的才可以设置开放答案
        if (arrData[i].state == 0) {
          this.$message.warning('请先开始考试，未开始考试不能操作开放答案功能')
          return false
        }
        if (arrData[i].state == 2) {
          return false
        }
        this.showConfirm = true
        this.confirmData = {
          text: '开放答案',
          func: 1,
          id: arrData[i].id
        }
      }
    },
    // 关闭确认对话框
    closeConfirm(i) {
      this.showConfirm = false
      this.showSetAccount = false
      if (i == 1) {
        // 刷新大纲下的任务
        this.getCurrentTask()
      }
    },
    // 动态计算高度
    calculationHeight() {
      this.elScrollHeight = this.$refs.tableHeight.clientHeight
    },
    // 设置表格行类名
    tableRowClass(row) {
      if (this.networkState == 'off') {
        let _class = ''
        switch (row.row.taskType) {
          case 6:
          case 7:
          case 3:
            _class = 'offLine'
            break
        }
        return _class
      }
    },
    // 任务列表整行点击
    clickRow(row) {
      if (this.networkState == 'off' && (row.taskType == 3 || row.taskType == 6 || row.taskType == 7)) {
        this.$message.warning('当前系统部署模式为无网络状态，不支持此任务！')
        return false
      }
    },
    // 设置账套
    openAccout(item) {
      this.cuurentAccountId.id = item.id
      this.showSetAccount = true
    },
    // 大纲列表展开收起
    packUp() {
      if (this.showHide) {
        this.showHide = 0
      } else {
        this.showHide = 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .edu-manage {
    margin: 20px 34px 20px 20px;
    position: relative;
    clear: both;
    .pack-up{
      width: 26px;
      height: 50px;
      color:#fff;
      font-size: 14px;
      line-height: 50px;
      text-align: right;
      border-radius: 0 4px 4px 0;
      padding-right: 4px;
      position: absolute;
      top:200px;
      left: -22px;
      z-index:1;
      cursor: pointer;
      background-color:rgba(54,206,169,1);
    }
    .left {
      width: 346px;
      height: 100%;
      background: #fff;
      margin-right: 20px;
      transition: 0.3s ease;
      float: left;
      margin-left: 0;
      &.active{
        margin-left: -368px;
      }
      .title {
        font-size: 20px;
        color: $color-theme;
        text-align: center;
        border: 1px solid #36CEA9;
        line-height: 64px;
        background-color: rgba(54, 206, 169, 0.1);
      }

      .outline-box {
        height: 520px;
        .outline-list {
          li {
            line-height: 54px;
            text-align: center;
            font-size: 16px;
            color: #595959;
            cursor: pointer;
            text-align: left;

            p {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding: 10px 20px 0;
              line-height: 24px;
            }

            .el-progress {
              line-height: 16px;
              padding: 0 20px 4px;
            }

            &.active {
              background-color: #f3f3f3;
            }

            &:hover {
              background-color: #f3f3f3;
            }
          }
        }
      }
    }

    .right {
      width:calc(100% - 370px);
      background: #fff;
      padding: 20px;
      float: left;
      &.active{
        width: 100%;
        transition: 0.3s ease;
      }
      .btn-box {
        text-align: right;
        margin-bottom: 20px;

        button {
          border: 0;
          background: $color-theme;
          outline: none;
          font-size: 12px;
          height: 32px;
          padding: 0 26px;
          margin-left: 10px;
          border-radius: 2px;
          color: #fff;
          cursor: pointer;

          &:hover {
            background: $color-theme-hover;
          }
        }
      }
      .exam-opera-btn {
        color: $color-theme;
        margin-right: 6px;
        cursor: pointer;
        white-space: nowrap;
        &.prohibit {
          color: #999;
          cursor: no-drop;
        }
      }
    }
  }
</style>
