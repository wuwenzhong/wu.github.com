<template>
  <div class="teach-search">
    <el-dialog :visible.sync="dialogTeachSearch" custom-class="search-dialog" @close="closeTeachSearch()" :close-on-click-modal="false">
      <div class="file-left-pic">
        <p>
          <span class="sp-t">资源检索</span>
          <span class="sp-e"><i>RESOURCE </i><em>RETRIEVAL</em></span>
        </p>
      </div>
      <div class="file-wrapper">
         <el-input
        class="search-input"
        size="small"
        suffix-icon="el-icon-search"
        v-model="queryParams.keyWrods"
        placeholder="请输入您要搜索的文件名称或关键字"
      ></el-input>
        <ul class="file-line">
          <li v-for="(item, index) in teachList" :key="index" @click="previewFile(item)">
            <div class='common pic' v-if="item.resExt == 'jpg' || item.resExt == 'gif' || item.resExt == 'jpeg' || item.resExt == 'png' || item.resExt == 'svg' || item.resExt == 'bmp'"></div>
            <div class='common excel' v-else-if="item.resExt === 'xlsx' || item.resExt === 'xls'"></div>
            <div class='common pdf' v-else-if="item.resExt === 'pdf'"></div>
            <div class='common ppt' v-else-if="item.resExt == 'ppt' || item.resExt == 'pptx' || item.resExt == 'potm' || item.resExt == 'potx'"></div>
            <div class='common txt' v-else-if="item.resExt === 'txt' || item.resExt === 'text'"></div>
            <div class='common mp3' v-else-if="item.resExt === 'mp3' || item.resExt === 'wma'"></div>
            <div class='common word' v-else-if="item.resExt === 'docx' || item.resExt === 'doc'"></div>
            <div class='common video' v-else-if="item.resExt === 'mp4' || item.resExt === 'mkv'"></div>
            <div class='common autowork' v-else-if="item.resExt === 'autowork'"></div>
            <div class='common exe' v-else-if="item.resExt === 'exe'"></div>
            <div class='common sql' v-else-if="item.resExt === 'sql'"></div>
            <!-- <i class="iconfont" :class="'icon'+item.resIcon"></i> -->
            <div class="file-info">
              <div class="file-title" :title="item.resName">{{ item.resName }}</div>
              <div class="file-describe" :title=" item.outlineName + '-' + item.taskName">{{ item.outlineName }} - {{ item.taskName }}</div>
            </div>
          </li>
        </ul>
        <div class="empty-line" v-if="teachList.length === 0">
          <i class="iconfont iconjingshimian"></i><span>暂无教学资源</span>
        </div>
        <!-- 分页 -->
        <pagination
          :hidden="total <= 7"
          :total="total"
          :pager-count="5"
          :pageSizes="[8,16,32,64]"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          @pagination="changePage"
        />
      </div>
    </el-dialog>

    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>

  </div>
</template>

<script>
import { teachList } from '@/api/teacherTools'
import { _vueDebounce, getFileType } from '@/common/js/utils'
import showPrevFile from '@/components/showPrevFile/index'

export default {
  data() {
    return {
      classId: localStorage.getItem('classId'), // 班级id
      dialogTeachSearch: true, // 展示
       currentSizeChange: 8, // 备份每页多少条数据
      // 查询参数
      queryParams: {
        page: 1,
        size: 8,
        keyWrods: ''
      },
      teachList: [], // 资源数组
      total: 0, // 总条数
      isShowPrevFile: false, // 预览
      previewData: {} // 预览参数
    }
  },
  created() {
    this.getTeachList()
  },
  watch: {
    'queryParams.keyWrods': {
      handler(newVal, oldVal) {
        this.getSearchList()
      },
      deep: true
    }
  },
  components: {
    showPrevFile
  },
  methods: {
    // 切换分页条数
    changePage(obj) {
      if (this.currentSizeChange !== obj.limit) {
        this.queryParams.page = 1
        this.currentSizeChange = obj.limit
      } else {
        this.queryParams.page = obj.page
      }
      this.queryParams.size = obj.limit
      this.getTeachList()
    },
    // 关闭页面
    closeTeachSearch() {
      this.$store.commit('setTeachSearchShow', false)
    },
    // 获取资源列表
    getTeachList() {
      this.queryParams.classId = this.classId
      teachList(this.queryParams).then(res => {
        if (res.code === '0') {
          const result = res.result.data
          // result.map(item => {
          //   item.resIcon = getFileType(item.resExt)
          // })
          this.teachList = result
          this.total = Number(res.result.total)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 键盘抬起搜索
    getSearchList: _vueDebounce('getTeachList', 500),
    // 文件预览
    previewFile(item) {
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      if (item.converUrl) {
        this.previewData.imgUrl = item.converUrl
      } else {
        this.previewData.imgUrl = item.downloadUrl
      }
      this.isShowPrevFile = true
    }
  }
}
</script>

<style lang="scss">
.teach-search {
  .search-dialog {
    width: 930px;
    height: 685px;
    border-radius: 21px;
    // margin-top: 4vh !important;
    .el-dialog__header{
      padding:0;
      border: none;
      .el-dialog__headerbtn .el-dialog__close{
        font-size: 20px;
      }
    }
    .el-dialog__body{
      padding:0;
      height: 685px;
    }
    .file-left-pic{
      width: 287px;
      height: 685px;
      background: url('../../../common/images/dialog-bg.png') no-repeat;
      background-size:100%;
      float: left;
      p{
          margin-top: 149px;
          margin-left: 43px;
          span{
            display: block;
          }
          .sp-t{
            font-size:28px;
            color: #1F1F1E;
          }
          .sp-e{
            i{
              color: #0324FD;
              font-size:16px;
              font-style: normal;
            }
            em{
              color: #37C153;
              font-size:16px;
              font-style: normal;
            }
          }
        }
    }
    .file-wrapper{
      width: 643px;
      float: right;
      padding:45px;
      .search-input{
        margin-bottom: 30px;
      }
      .file-line {
        width: 100%;
        height: 480px;
        overflow: auto;
        cursor: pointer;
        li{
          display: flex;
           height: 60px;
          &.empty-line {
            padding-left: 150px;
          }
          &:last-child {
            border-bottom: none;
          }
          .common {
            width: 44px;
            height: 44px;
            margin-top: 7px;
            margin-left: 40px;
          }
          .pic{
            background: url('./img/pic.png') no-repeat;
            background-size: 100%;
          }
          .excel{
            background: url('./img/excel.png') no-repeat 6px 2px;
            background-size: 100%;
          }
          .pdf{
            background: url('./img/pdf.png') no-repeat 6px 2px;
            background-size: 100%;
          }
          .ppt{
            background: url('./img/ppt.png') no-repeat 6px 2px;
            background-size: 100%;
          }
          .txt{
            background: url('./img/txt.png') no-repeat 6px 2px;
            background-size: 100%;
          }
          .mp3{
            background: url('./img/mp3.png') no-repeat;
            background-size: 100%;
          }
          .word{
            background: url('./img/word.png') no-repeat 6px 2px;
            background-size: 100%;
          }
          .video{
            background: url('./img/video.png') no-repeat;
          }
          .autowork{
            background: url('./img/autowork.png') no-repeat;
          }
          .exe{
            background: url('./img/exe.png') no-repeat;
          }
          .sql{
            background: url('./img/sql.png') no-repeat;
          }
          // .iconfont {
          //   font-size: 32px;
          //   color: #00BA8C;
          //   padding-left: 31px;
          //   padding-top: 6px;
          // }
          .file-info {
            width: 100%;
            display: flex;
            padding-left: 18px;
            justify-content: space-between;
            div {
              width: 202px;
              height: 60px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .file-title {
              font-size: 14px;
              line-height: 24px;
              color: #303133;
              line-height: 60px;
            }
            .file-describe {
              font-size: 12px;
              line-height: 24px;
              color: #C4C4C4;
              line-height: 60px;
            }
          }
        }
        li:nth-of-type(odd){
          background: #F9F9F9;
        }
        li:nth-of-type(even){
          background: #ffffff;
        }
      }
      .empty-line{
        text-align: center;
        .iconjingshimian {
          color: #E6A23C;
          padding-right: 10px;
        }
      }
    }
    .pagination-container {
      // margin-top: 52px;
      padding: 10px 0 0;
      margin-left: -30px;
      .el-pagination .el-pagination__jump{
        // margin-left: -12px;
        .el-pagination__editor.el-input{
          width: 40px;
        }
      }
    }
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
