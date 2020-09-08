<template>
  <div class="select-file">
    <el-input placeholder="请输入您要搜索的资源名称" suffix-icon="el-icon-search" size="small" v-model.trim="searchKeyWord" @input="searchContent"></el-input>
    <div class="content">
      <el-table
        :data="tableData"
        border
        width="100%"
        highlight-current-row
        @current-change="handleCurrentChange"
        @select="checkSelect"
        @select-all="checkSelect"
        :row-key="bingRowkeys"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="80" align="center" :reserve-selection='true'></el-table-column>
        <el-table-column prop="resName" label="文件名称" ></el-table-column>
      </el-table>
    </div>
    <!-- 分页设置 -->
    <paging
        :total="pagTotal"
        :page.sync="pageParams"
        @pagination="monitorPagin"
        v-if="pagTotal>10"
        :pageSizes="[10,25,50,100]"
        style="display: flex;justify-content: flex-end;"
    ></paging>
    <div class="footer" style="text-align: center;display: block;">
      <el-button size="small" @click="close" style="background: rgb(65, 77, 101); color: rgb(255, 255, 255);">取 消</el-button>
      <el-button type="info" size="small" @click="confirmDel" style="background: rgb(65, 77, 101); color: rgb(255, 255, 255);">确 认</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { listType } from '@/api/step.js'
import paging from '@/components/pagination/index'
// state中取数据
export default {
  name:'SelectResourceFile',
  props:['SelectResourceFile'],
  components:{
    paging
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      AccountDate: '',
      tableData: [],
      SelectResources: [],
      row: [],
      arr:[],
      options:[],
      value:'',
      DeletionArr:[],
      pagTotal:0,
      pageParams: 1,
      selePage:1,
      seleSize:10,
      searchKeyWord:''
    };
  },
  mounted(){
    let that =this;
    this.init()
    console.log(this.SelectResourceFile)
  },
  methods: {
    init(){
      // 资源文件
      listType({
        'page':this.selePage,
        'size':this.seleSize,
        'keyWrods':this.searchKeyWord
      }).then(res=>{
        console.log(res.result)
        if (res.code=='0') {
          this.tableData = res.result.data
          this.pagTotal = parseInt(res.result.total)
          // 反选
          this.SelectResourceFile.forEach
          this.SelectResourceFile.forEach(item => {
            this.tableData.forEach(self => {
              if (item == self.resName) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData[this.tableData.indexOf(self)],true)
              }
            })
          })
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
    bingRowkeys(row) {
      return row.id
    },
    close(){
      let that = this;
      that.$emit('close')
    },
    handleCurrentChange (val) {
      this.SelectResources = val
    },
    checkSelect(data) {
      let that = this;
      that.DeletionArr=[]
      data.forEach((item,index,arr)=>{
        that.DeletionArr.push(item)
      })
    },
    /* 确认添加资源文件 */
    confirmDel(){
      let that = this
      that.$emit("close",that.DeletionArr)
    },
    Invoice(){
      let that = this;
      if (that.value!='') {
        let stepyear = that.value.split('-')[0];
        // store.commit('stepyear', stepyear)
        let year = that.value.split('-')[1]
        // store.commit('tallyMonthMove', year)
        // YMCaseId({caseId:store.state.state.caseId,tallyMonth:that.value,size: 999,page: 1}).then(res=>{
        //     if (res.data.code=="0") {
        //       let CodeSuccess = res.data.result.data;
        //       that.tableData = CodeSuccess;
        //     }
        // })
      }
    },
    monitorPagin(item) {
      console.log('页码：' + item.page)
      console.log('每页个数：' + item.limit)
      this.selePage = item.page
      this.seleSize = item.limit
      this.init()
    },
    searchContent(val) {
      // 页码变为第一页
      this.selePage = 1
      // 搜索的文字
      this.searchKeyWord = val
      // 保存搜索内容
      this.init()
    },
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 30px;
  padding-bottom: 20px;
  &:after {
    content: '';
    width: 100%;
    height: 1px;
    // background-color: #f1f3f4;
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
