<template>
  <div class="pre-task">
    <div class="content">
      <el-table :data="tableData" border highlight-current-row
        @select="handleCurrentChange"
        @select-all="handleCurrentChange">
        <el-table-column prop="nodeName" label="步骤节点"></el-table-column>
        <el-table-column type="selection" width="120" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="footer" style="text-align: center;display: block;">
      <el-button size="small" @click="close" style="background: rgb(65, 77, 101); color: rgb(255, 255, 255);">取 消</el-button>
      <el-button type="info" size="small" @click="sure" style="background: rgb(65, 77, 101); color: rgb(255, 255, 255);">确 认</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { bycaseidName } from '@/api/step.js'
export default {
  name:'PreTask',
  data () {
    return {
      tableData: [],
      casename:{
      },
      qzrwArr:[]
    }
  },
  mounted(){
    let that= this;
    that.caselist()
  },
  methods:{
    caselist(){
      let that= this;
      bycaseidName({
        caseId:localStorage.getItem('caseId')
      }).then(res=>{
        if (res.code=='0') {
          that.tableData=res.result;
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
    handleCurrentChange (val) {
      this.qzrwArr = val
    },
    // checkSelect(data) {
    //   let that = this;
    //   data.forEach((item,index,arr)=>{
    //     that.qzrwArr.push(item)
    //   })
    // },
    close(){
      let that = this;
      this.$emit('qzrwclose')
    },
    sure(){
      let that = this;
      this.$emit('qzrwclose',that.qzrwArr)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 30px;
  padding-bottom: 20px;
  &:after {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    bottom: 68px;
  }
  >>> .el-table__header-wrapper {
    thead.has-gutter th {
      background-color: #e5eaf4;
      color: #333;
      font-weight: normal;
    }
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 20px;
  .el-button {
    margin-left: 0;
  }
  .el-button:nth-of-type(1) {
    margin-right: 16px;
  }
}
</style>
