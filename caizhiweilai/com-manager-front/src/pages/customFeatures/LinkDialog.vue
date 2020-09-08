<template>
  <div class="Upload">
    <!-- {{courseResData}} -->
    <el-form class="el-form--label-left" label-width="120px">
      <el-form-item label="操作说明：">
        <el-input type="textarea" autocomplete="off" rows="6" resize="none" v-model="ResourceNote"></el-input>
      </el-form-item>
      <el-form-item label="操作视频：">
        <el-button size="small" type="info" @click="resources">从资源库选择</el-button>
      </el-form-item>
      <!-- {{this.backShowData}} -->
      <el-form-item v-show="this.backShowData.id">
        <div class="backShow">
          <span class='sp1'>{{this.backShowData.resName}}</span>
          <span class='sp2' @click="() => {this.backShowData={};this.$message.success('删除成功')}">删除</span>
        </div>
      </el-form-item>
    </el-form>
    <span class="footer" style="display:block;textAlign:center">
      <el-button @click="CancelAdd" size="small">取消</el-button>
      <el-button type="info" @click="confirmUpload" size="small">保存</el-button>
    </span>
    <!-- 从资源文件选择 -->
    <el-dialog class="secoundDialog" width="50%" title="选择视频" :visible.sync="innerVisibleZs" v-if="innerVisibleZs" append-to-body :close-on-click-modal="false">
      <!-- <div class="zsFile">
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="searckKey"
          @input="searchContent"
        ></el-input>
      </div> -->
      <!-- {{this.checkFileArr}} -->
      <el-table
        class="clearAllselection"
        :data="checkFile"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :row-key="bingRowkeys"
      >
        <el-table-column type="selection" width="66" :reserve-selection="true"></el-table-column>
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewfile(scope.row)">预览</el-link>
          </template>
        </el-table-column>
      </el-table>
      <paging
        :total="pagTotal"
        @pagination="monitorPagin"
        :pageSizes="[10, 20, 50, 100]"
        :limit="10"
        v-if="pagTotal>10"
        style="display: flex;justify-content: flex-end;"
      ></paging>
      <span slot="footer" style="display:block;text-align:center;margin-top:15px;margin-bottom:10px">
        <el-button class="el-button--small" @click="innerVisibleZs=false">取 消</el-button>
        <el-button class="Determine el-button--small" type="primary" @click="sureQ">确 定</el-button>
      </span>
      <showPrevFile :PrevFileUrl="PrevFileUrl" @quxiao="isShowPrevFileClose" v-if="isShowPrevFile" class="showFile" :class="isShowPrevFile==true?'isDialog':''"></showPrevFile>
    </el-dialog>
    <!-- 预览文件 -->
  </div>
</template>

<script>
/* eslint-disable */
import { commonPreserve, conserveMenuResource, queryResource } from '@/api/sempost.js';
import { wjUp, delfilie, newResource, resourceList, preRes, courseidList } from '@/api/resource'
import { mapGetters } from 'vuex'
import paging from '@/components/pagination/index'
import showPrevFile from '@/pages/resourceBase/component/showPrevFile'
export default {
  name: 'LinkDialog',
  props: ['firstMenuId', 'menuId', 'courseNote', 'courseResData', 'fileList',],
  computed: {
    ...mapGetters(['userId'])
  },
  components: {
    paging,
    showPrevFile
  },
  data() {
    return {
      ResourceNote:this.courseNote,
      fileResource:this.fileList,
      uploadLoading: false,
      commonSave: {
        downloadUrl: '',
        resType: '',
        resExt: '',
        resSize: '',
        resultId: '',
        resName: ''
      },
      id: '',
      innerVisibleZs: false,
      checkFile: [],
      pagTotal: 0,
      isShowPrevFile: false, // 预览弹框是否打开
      checkFileArr:[], // 选中数据
      backShowData:{}, // 回显数据
      searckKey:'',   // 搜索词
      limit:'',
      videoList: {
        page: '1',
        size: '10'
      }
    };
  },
  mounted(){
    this.backShowData = this.courseResData || {}
  },
  methods: {
    resources() {
      // 从资源文件库选择
      this.innerVisibleZs = true
      // mp4 rmvb avi
      resourceList({
        page: this.videoList.page,
        size: this.videoList.size,
        resUseType: '3',
        fileType: 'VIDEO',
        keyWrods: this.searckKey
      }).then(res => {
        if (res.code == 0) {
          this.checkFile = res.result.data
          this.pagTotal = parseInt(res.result.total)
          // 回显数据
          this.checkFile.forEach((item) => {
            if(item.resId ===  this.backShowData.id){
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    handleSelectionChange(val) {
      if(val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.checkFileArr = val.pop()
      }
    },
    bingRowkeys(row) {
      return row.id
    },
    sureQ() {
      this.innerVisibleZs = false
      this.backShowData = this.checkFileArr
    },
    searchContent() {
      // const pageSize = this.limit == '' ? '10' : this.limit
      // const keyWrods = this.searckKey
      console.log('搜索')
    },
    monitorPagin(item) {
      this.limit = item.limit
      this.videoList.page = item.page
      this.videoList.size = item.limit
      this.resources()
    },
    // 预览
    async previewfile(item) {
      // console.log(item)
      preRes({ id: item.id }).then(res => {
        if (res.code == '0') {
           // 课程列表
            // const listId = this.courseId == '' ? '0' : this.courseId
            // 预览弹窗
            this.isShowPrevFile = true
            if (item.converUrl) {
                this.PrevFileUrl = item.converUrl + '?resExt=' + item.resExt
            } else {
                this.PrevFileUrl = item.downloadUrl + '?resExt=' + item.resExt
            }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 关闭预览文件
    isShowPrevFileClose() {
      this.isShowPrevFile = false
    },


    // 保存菜单资源
    async confirmUpload() {
      let id = this.menuId ? this.menuId : this.firstMenuId;
      // console.log(this.backShowData)
      let resId = this.backShowData.resId ? this.backShowData.resId : '-1'
      // console.log(resId)
      const res = await conserveMenuResource({
          menuId: id,
          resId: resId,
          note: this.ResourceNote
        })
      if (res.code === "0") {
        this.fileResource = [];
        this.note = '';
        this.$message.success(res.message);
        this.$emit('Close', false);
      }
    },
    // 取消关联操作说明弹框
    CancelAdd() {
      this.$emit('Close', false);
    },
    /* 视频上传 */
    async videoUpload(e){
      const that = this
      const wjType = e.file.name.substring(e.file.name.lastIndexOf('.') + 1)
      const url = await this.cos(e)
      this.commonSave.downloadUrl = url
      wjUp({
        resName: e.file.name,
        downloadUrl: url,
        resType: wjType,
        resExt: wjType,
        resSize: e.file.size,
        creator: this.userId
      }).then(res => {
        if (res.code == 0) {
          // newResource({
          //   resId: res.result,
          //   resName: e.file.name
          // }).then(res => {
          // })
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.zsFile {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  div {
    width: 200px;
    margin-bottom: 20px;
  }
}
.Upload{
  .backShow{
    .sp1{
      cursor: pointer;
      &:hover{
        color:#3271FF;
      }
    }
    .sp2{
      margin-left:10px;
      color:#ebb563;
      cursor: pointer;
    }
  }
  
}
.mask-wrap {
  .el-form-item {
    margin-bottom: 12px;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
  // padding-bottom: 20px;
  .el-button {
    margin-left: 0;
  }
  .el-button:not(:last-child) {
    margin-right: 16px;
  }
}
</style>
<style lang="scss">
  .clearAllselection{
    .el-table__header-wrapper  .el-checkbox{//找到表头那一行，然后把里面的复选框隐藏掉
      display:none
    }
  }
  .secoundDialog{
    .el-dialog__body{
      padding-bottom:0px;
      // padding-top:10px;
    }
    .pagination-container{
      padding-bottom:0px;
    }
  }
</style>
