<template>
  <div class="distribu-box">
    <div class="cont">
      <p class="title">分配给组员<i @click="closeConfirm" class="iconfont">&#xe6a5;</i></p>
      <el-table
        ref="multipleTable"
        :data="distributeStudy"
        border
        style="width: 100%"
        @selection-change="chooseChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="260">
        </el-table-column>
        <el-table-column
          label="已分配案例">
          <template>1</template>
        </el-table-column>
      </el-table>
      <div class="btn-box">
        <button class="cancel" @click="closeConfirm">取消</button>
        <button class="hold" @click="holdChoose">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccountStudy, setDistribut } from '@/api/trainingCenter'
export default {
  name: 'DistribuStudy',
  props: {
    distribuData: {
      type: String
    }
  },
  data() {
    return {
      hasChooseData: [], // 已经选择的学员
      distributeStudy: [], // 企业数据
      currentTaskId: this.$route.query.classTaskId // 当前的任务id
    }
  },
  mounted() {
    // 获取当前组的学员信息
    this.getCurrentTeam()
  },
  updated() {
    // 回显
    this.toggleSelection(this.distributeStudy)
  },
  methods: {
    // 关闭弹窗
    closeConfirm() {
      this.$emit('closeConfirm')
    },
    // 确定选择分配给选择的学员
    holdChoose() {
      const _this = this
      const postData = {}
      const userList = []
      for (let i = 0, size = this.hasChooseData.length; i < size; i++) {
        userList.push(this.hasChooseData[i].userId)
      }
      postData.classTaskId = this.currentTaskId
      postData.caseId = this.distribuData
      postData.userIds = userList
      setDistribut(postData).then(res => {
        if (res.code == 0) {
          _this.$message.success('分配成功')
          _this.$emit('closeConfirm', '1')
        } else {
          _this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 获取当前组的学员信息
    getCurrentTeam() {
      const _this = this
      const postData = '?classTaskId=' + this.currentTaskId + '&caseId=' + this.distribuData
      getAccountStudy(postData).then(res => {
        if (res.code == 0) {
          _this.distributeStudy = res.result
        } else {
          _this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 渲染时判断是都已经选中
    toggleSelection (rows) {
      rows.forEach(row => {
        if (row.allot == 1) {
          // toggleRowSelection  这个方法是用来选中某一行（打勾）
          // row 是要选中的那一行  true 是为选中
          this.$refs.multipleTable.toggleRowSelection(row, true)
        }
      })
    },
    // 选择学员改变
    chooseChange(obj) {
      this.hasChooseData = obj
    }
  }
}
</script>

<style scoped lang="scss">
  .distribu-box{
    @include maskLayer($z: 1002);
    .cont {
      width: 500px;
      background: #fff;
      padding:0 20px 70px;
      position: relative;
      border-radius: 4px;
      .title {
        line-height: 44px;
        color: #444444;
        font-size: 16px;
        position: relative;
        border-radius: 4px 4px 0 0;
        i {
          position: absolute;
          right: 0;
          top: 0;
          padding: 0 10px;
          color: #929292;
          font-size: 18px;
          cursor: pointer;
        }
      }
      .el-table {
        /deep/.el-table__header-wrapper {
          /deep/th{
            height: 40px;
            padding:7px 0;
          }
        }
      }
      .el-table--enable-row-transition {
        /deep/.el-table__body {
          /deep/td{
            padding:7px 0;
          }
        }
      }
      .btn-box {
        position: absolute;
        bottom: 20px;
        left: 0;
        width: 100%;
        text-align: center;
        button {
          height: 34px;
          padding: 0 32px;
          font-size: 14px;
          color: #fff;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          &.cancel {
            border: 1px solid #dedede;
            color: #666;
            background: #fff;
            &:hover {
              background: #f3f3f3;
            }
          }
          &.hold {
            border: 1px solid $color-theme;
            background-color: $color-theme;
            color: #fff;
            margin: 0 0 0 10px;
            &:hover {
              background-color: $color-theme-hover;
              border: 1px solid $color-theme-hover;
            }
          }
        }
      }
      .tips-text {
        padding: 40px 0;
        color: #666666;
        font-size:16px;
        text-align: center;
      }
    }
  }
</style>
