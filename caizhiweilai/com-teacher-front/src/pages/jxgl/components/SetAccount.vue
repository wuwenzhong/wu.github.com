<template>
  <div class="set-accout-box">
    <div class="cont">
      <p class="title">设置账套<i @click="closeConfirm" class="iconfont">&#xe60e;</i></p>
      <div class="set-title">
        批量设置：
        <span @click="switchType(1)" :class="{active:defaultType==1}"><i class="iconfont" v-html="defaultType==1 ? '&#xe692;':'&#xe60b;'"></i>企业模式</span>
        <span @click="switchType(2)" :class="{active:defaultType==2}"><i class="iconfont" v-html="defaultType==2 ? '&#xe692;':'&#xe60b;'"></i>财务公司模式</span>
      </div>
      <el-table
        class="table-account"
        max-height="500px"
        :data="listData"
        border
        style="width: 100%">
        <el-table-column
          prop="caseName"
          label="账套名称">
        </el-table-column>
        <el-table-column
          width="320"
          label="设置模式">
          <template slot-scope="scope">
            <span @click="singleClick(0,scope.row)" :class="{active:scope.row.model==0}"><i class="iconfont" v-html="scope.row.model==0 ? '&#xe692;':'&#xe60b;'"></i>禁用</span>
            <span @click="singleClick(1,scope.row)" :class="{active:scope.row.model==1}"><i class="iconfont" v-html="scope.row.model==1 ? '&#xe692;':'&#xe60b;'">&#xe692;</i>企业</span>
            <span @click="singleClick(2,scope.row)" :class="{active:scope.row.model==2}"><i class="iconfont" v-html="scope.row.model==2 ? '&#xe692;':'&#xe60b;'">&#xe692;</i>财务公司</span>
          </template>
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
import { getAccountList, setBusinessModel } from '@/api/teamAdmin'
export default {
  name: 'SetAccount',
  data() {
    return {
      listData: [], // 企业数据
      defaultType: 0 // 默认企业模式
    }
  },
  props: {
    cuurentAccountId: {
      type: Object
    }
  },
  mounted() {
    this.ajaxAccountData()
  },
  methods: {
    // 关闭弹窗
    closeConfirm() {
      this.$emit('closeConfirm')
    },
    // 保存更改
    holdChoose() {
      const postData = {
        classTaskId: this.cuurentAccountId.id,
        accountDTOList: this.listData
      }
      setBusinessModel(postData).then(res => {
        if (res.code == 0) {
          this.$message.success('设置成功')
          this.$emit('closeConfirm')
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 单独操作
    singleClick(num, item) {
      const _id = item.caseId
      for (let i = 0, size = this.listData.length; i < size; i++) {
        if (_id == this.listData[i].caseId) {
          this.listData[i].model = num
        }
      }
      this.listData = [...this.listData]
      console.log(this.listData)
    },
    // 切换公司模式
    switchType(num) {
      this.defaultType = num
      for (let i = 0, size = this.listData.length; i < size; i++) {
        this.listData[i].model = num
      }
    },
    // 加载套账数据
    ajaxAccountData() {
      const _this = this
      const postData = '?classTaskId=' + this.cuurentAccountId.id
      getAccountList(postData).then(res => {
        if (res.code == 0) {
          _this.listData = res.result
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.set-accout-box{
  @include maskLayer($z: 1002);
  .cont {
    width: 930px;
    background: #fff;
    padding:0 20px 70px;
    position: relative;
    border-radius: 4px;
    min-height: 340px;
    @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));
    .title {
      line-height: 44px;
      color: #444444;
      font-size: 16px;
      position: relative;
      border-radius: 4px 4px 0 0;
      i {
        position: absolute;
        right: 20px;
        top: 0;
        padding: 0 10px;
        color: #929292;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .set-title{
      text-align: right;
      line-height: 30px;
      margin:10px 0;
      span{
        margin-right: 10px;
        cursor: pointer;
        &.active{
          color: $color-theme;
        }
      }
    }
    .table-account{
      /*height: 200px;*/
      /deep/.el-table__header-wrapper{
        /deep/th{
          height: 40px;
          padding:6px 0;
          font-size: 14px;
        }
      }
      /deep/.el-table__body-wrapper{
        td{
          padding:6px 0;
          font-size: 14px;
          span{
            &.active{
              color:$color-theme;
            }
            margin-right: 10px;
            cursor: pointer;
          }
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
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
