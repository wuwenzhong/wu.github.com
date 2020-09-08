<template>
  <div class="sxgkBox">
    <ul class="startTrain">
      <!-- 设置考核方案 -->
      <li class="li2" @click="setProgramme()"></li>
      <!-- 开始实训 -->
      <li class="li3" v-if="startBtnisShow" @click="startTrain()"></li>
      <!-- 结束实训 -->
      <li class="li4" v-if="EndBtnisShow" @click="endTrain()"></li>
      <!-- 已结束 -->
      <li class="li6" v-if="Finished" @click="finished()"><span>已结束</span></li>
      <!-- 签到管理 -->
      <li class="li1" @click="pagePush()"></li>
      <!-- 重置实训 -->
      <li class="li5" @click="resetPrograme()"></li>
    </ul>
    <el-dialog title="设置考核方案" :visible.sync="dialogSetProgramme" custom-class="set-programe-dialog" :close-on-click-modal='false' width="520px">
      <ul class="programmeList">
        <li v-for="(item,index) in khTableData" :key="index">
          <span class="textSpan">{{item.capabilityName || item.attendance || '教师评分'}}</span>
          <input ref="val" class="textInput"
                 @blur="unFouse($event)" :id="item.capabilityId"
                 :value="(item.capabilityId==='1'&&item.teacherRating)||(item.capabilityId==='2'&&item.attendance)||(item.percentage)" type="text"><span class="sps">%</span>
        </li>
      </ul>
      <p class="numSum">*各项之和为100</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleCancle=dialogSetProgramme=false">取 消</el-button>
        <el-button type="primary" :disabled="disabled" size="medium" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重置实训 -->
  </div>
</template>

<script>
import {
  setProgrammeList,
  setProgramme,
  trainStatus,
  startAndEndTrain,
  checkTrain,
  resetTrain,
  isCreatTeam
} from '@/api/sxgk'
import { validInput } from '@/common/js/utils'

export default {
  name: 'TrainConPage',
  data() {
    return {
      dialogSetProgramme: false,
      resetDialog: false,
      khTableData: [],
      arr: [],
      startBtnisShow: true,
      EndBtnisShow: false,
      Finished: false,
      trainTextStatus: '',
      disabled: false
    }
  },
  created() {
    this.queryTrainStatus()
  },
  methods: {
    // 设置考核方案  列表查询
    setProgramme() {
      this.dialogSetProgramme = true
      setProgrammeList(localStorage.getItem('classId')).then((res) => {
        if (res.code === '0') {
          this.khTableData = res.result
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 失去焦点针对input的校验
    unFouse(e) {
      if (e.target.value === '') {
        this.$message({
          message: '值不能为空',
          type: 'warning'
        })
        return
      }
      if (!e.target.value.replace(/[^\d]/g, '')) {
        this.$message({
          message: '只能输入数字',
          type: 'warning'
        })
        return
      }

      const val = e.target.value
      if (validInput(val)) {
        this.$message({
          message: '不能有特殊字符',
          type: 'warning'
        })
        return
      }

      if (e.target.value < 0) {
        this.$message({
          message: '值不能为负数',
          type: 'warning'
        })
      }
    },
    // 保存权重值
    handleSubmit() {
      this.arr.length = 0
      let sum = 0
      let temp
      for (const key in this.$refs.val) {
        if (this.$refs.val[key].id === '1') {
          temp = {
            capabilityId: this.$refs.val[key].id,
            teacherRating: this.$refs.val[key].value,
            classId: localStorage.getItem('classId')
          }
        } else if (this.$refs.val[key].id === '2') {
          temp = {
            capabilityId: this.$refs.val[key].id,
            attendance: this.$refs.val[key].value,
            classId: localStorage.getItem('classId')
          }
        } else {
          temp = {
            capabilityId: this.$refs.val[key].id,
            percentage: this.$refs.val[key].value,
            classId: localStorage.getItem('classId')
          }
        }
        this.arr.push(temp)
        if (this.$refs.val[key].value === undefined) {
          continue
        } else if (this.$refs.val[key].value < 0) {
          this.$message({
            message: '能力项值不能小于0',
            type: 'warning'
          })
          return
        } else {
          sum += Number(this.$refs.val[key].value)
        }
      }
      if (sum != 100) {
        this.$message({
          message: '项目占比总值必须为100,目前总值为' + sum + '请进行修改',
          type: 'warning'
        })
        return false
      }
      // console.log(this.arr)
      setProgramme(this.arr).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.dialogSetProgramme = false
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 重置实训
    resetPrograme() {
      this.$confirm('重置实训后，会清空选择过的教案、会清空考核方案、所有学生数据及考试成绩、任务记录及进度、所有任务变为未解锁，确定重置吗？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        confirmButtonClass: 'el-button--medium',
        cancelButtonClass: 'el-button--medium',
        type: 'warning'
      }).then(async () => {
        const res = await resetTrain(localStorage.getItem('classId'))
        if (res.code === '0') {
          this.$message({
            message: '重置成功',
            type: 'success'
          })
          // this.resetDialog = false
          // this.queryTrainStatus()
          localStorage.removeItem('teachIndex')
          localStorage.removeItem('teachLine')
          localStorage.setItem('startStatus', '3') // 修改教案设置状态
          // 跳转到首页
          this.$router.push('/home/index')
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(() => { })
    },
    // 签到管理
    pagePush() {
      this.$router.push('/sxgk/qdgl')
    },
    // 查询实训状态
    queryTrainStatus() {
      // this.$toast.show()
      trainStatus(localStorage.getItem('classId')).then(res => {
        if (res.code === '0') {
          // this.$toast.hide()
          if (res.result.startStatus === 0) {
            this.trainTextStatus = res.result.startStatus
            this.startBtnisShow = true
            this.EndBtnisShow = false
            this.Finished = false
            this.disabled = false
          }
          if (res.result.startStatus === 1) {
            this.trainTextStatus = res.result.startStatus
            this.startBtnisShow = false
            this.EndBtnisShow = true
            this.Finished = false
            this.disabled = true
          }
          if (res.result.startStatus === 2) {
            this.trainTextStatus = res.result.startStatus
            this.startBtnisShow = false
            this.EndBtnisShow = false
            this.Finished = true
            this.disabled = false
          }
        } else {
          // this.$toast.hide()
        }
      })
    },
    // 开始结束实训方法
    async startAndEndTrainFun(id, status) {
      // this.$toast.show()
      const res = await startAndEndTrain(id, status)
      if (res.code === '0') {
        // this.$toast.hide()
        if (res.result === 1) {
          this.$message({
            message: '实训已开始',
            type: 'success'
          })
        }
        if (res.result === 2) {
          this.$message({
            message: '实训已结束',
            type: 'success'
          })
        }
        this.queryTrainStatus()
      }
      if (res.code === '101') {
        this.$message({
          message: res.message,
          type: 'warning'
        })
        // this.$toast.hide()
      }
    },
    // 开始实训
    startTrain() {
      this.$confirm('确定开始实训吗?', '开始实训', {
        closeOnClickModal: false,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
      .then(async() => {
        // 进行校验 是否设置了考核方案权重值
        checkTrain(localStorage.getItem('classId')).then(res => {
          if (res.code === '0') {
            // 开始实训前验证是否建立团队
            isCreatTeam(localStorage.getItem('classId')).then(res1 => {
              if (res1.code === '0') {
                // 成功则调用开始实训接口
                this.startAndEndTrainFun(localStorage.getItem('classId'), 1)
                // 开始实训发送消息给学生
                const msg = { classId: localStorage.getItem('classId'), msg: '同学们实训开始了请做好准备哦~' }
                const actions = { type: 'com', messageType: 'startTrain', receiverId: localStorage.getItem('classId'), sessionType: 'p2c', content: msg }
                this.sendWspush(JSON.stringify(actions))
              } else {
                if (res1.code === '3002') {
                  this.$confirm(`还有${res1.result}人未分配团队,不能开始实训`, '开始实训', {
                    closeOnClickModal: false,
                    confirmButtonText: '去分配',
                    cancelButtonText: '我知道了',
                    type: 'warning'
                  })
                  .then(async() => {
                    this.$router.push({ path: '/tdgl/index' })
                  })
                } else {
                  this.$message({
                    message: res1.message,
                    type: 'warning'
                  })
                }
              }
            })
          } else {
            this.$confirm('考核方案未设置，不能开始实训!', '开始实训', {
              closeOnClickModal: false,
              confirmButtonText: '去设置',
              cancelButtonText: '我知道了',
              type: 'warning'
            })
            .then(async() => {
              this.setProgramme()
            })
          }
        })
      })
      .catch((res) => {
        console.log(res)
      })
    },
    // 结束实训
    endTrain() {
      this.$confirm('确定结束实训吗?', '结束实训', {
        closeOnClickModal: false,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
      .then(async() => {
        // 结束实训关闭长连接
        this.oncloseWs(1)
        this.startAndEndTrainFun(localStorage.getItem('classId'), 2)
      }).catch(() => { })
    },
    // 已结束
    finished() {
      if (this.trainTextStatus === 2) {
        this.$message({
          message: '该班级实训学习已结束!',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .sxgkBox {
    width: 100%;
    min-height: calc(100vh - 114px);
    background: url('../../common/images/bg.png') no-repeat center;
    background-size: cover;

    .startTrain {
      padding: 40px;
      margin: 0;
      display: flex;
      flex-wrap: wrap;

      li {
        list-style: none;
        width: 420px;
        height: 160px;
        background: pink;
        margin-right: 40px;
        margin-bottom: 40px;
        cursor: pointer;
        &:hover{
          transition: 0.5s all;
          transform: scale(1.02);
        }
      }

      .li1 {
        background: url('../../common/images/qdgl.png') no-repeat center;
      }

      .li2 {
        background: url('../../common/images/khfa.png') no-repeat center;
      }

      .li3 {
        background: url('../../common/images/kssx.png') no-repeat center;
      }

      .li4 {
        background: url('../../common/images/jssx.png') no-repeat center;
      }
      .li6 {
        background: url('../../common/images/finished.png') no-repeat center;
        span{
          font-size: 30px;
          line-height: 160px;
          color: #fff;
          margin-left: 72px;
          letter-spacing: 3px;
        }
      }

      .li5 {
        background: url('../../common/images/czsx.png') no-repeat center;
      }
    }
    .set-programe-dialog{
      max-height: 685px;
      border-radius: 4px;
      .programmeList {
        max-height: 518px;
        overflow: auto;
        li {
          line-height: 50px;
          position: relative;
          .textSpan {
            font-size: 14px;
            color: #666666;
            margin-right: 8px;
            display: inline-block;
            width: 100px;
            overflow: hidden;
            height: 33px;
          }
          .textInput {
            width: 65%;
            height: 38px;
            border-radius: 2px;
            border: 1px solid rgba(220, 223, 230, 1);
            border-radius: 3px;
            font-size: 12px;
            padding-left: 10px;
            outline-width: 0;
            vertical-align: super;
          }
          .sps{
            position: absolute;
            right: 62px;
          }
        }
      }
    }

    .numSum {
      font-size: 12px;
      color: #E02020;
      margin-top: 13px;
      text-align: right;
    }

    .resetText {
      // text-align: center;
      line-height: 26px;
      font-size: 16px;
      font-family: 'PingFangSC-Regular,PingFang SC';
    }
  }
  ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
  }
  ::-webkit-scrollbar-thumb {
      background-color: #cccccc;
      border-radius: 10px;
  }
  ::-webkit-scrollbar-track-piece {
      background-color: transparent;
      border-radius: 10px;
  }
</style>
