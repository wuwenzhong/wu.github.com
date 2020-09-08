<template>
  <div class="teach-search">
    <el-dialog title="课程资源检索" :visible.sync="dialogTeachSearch" custom-class="search-dialog" @close="closeTeachSearch()" :close-on-click-modal="false">
      <el-input
        size="small"
        suffix-icon="el-icon-search"
        v-model="queryParams.keyWrods"
        placeholder="请输入您要搜索的文件名称或关键字"
      ></el-input>
      <div class="file-wrapper">
        <el-scrollbar style="height: 100%" v-if="teachList.length != 0">
          <div class="file-line" v-for="(item, index) in teachList" :key="index" @click="previewFile(item)">
            <i class="iconfont" :class="'icon'+item.resIcon"></i>
            <div class="file-info">
              <div class="file-title">{{ item.resName }}</div>
              <div class="file-describe">{{ item.outlineName }} - {{ item.taskName }}</div>
            </div>
          </div>
        </el-scrollbar>
        <div class="file-line empty-line" v-if="teachList.length === 0">
          <i class="iconfont iconjingshimian"></i>
          <div class="file-info">
            <div class="tips">暂无课程资源</div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <pagination
        :hidden="total <= 10"
        :total="total"
        :pager-count="5"
        :layout="'total, prev, pager, next'"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getTeachList"
      />
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
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
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
          result.map(item => {
            item.resIcon = getFileType(item.resExt)
          })
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
    width: 480px;
    .file-wrapper{
      height: 500px;
      position: relative;
      /deep/.el-scrollbar{
        /deep/.el-scrollbar__wrap{
          overflow-x: hidden;
          width: 110%;
        }
      }
    }
    .file-line {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #F5F5F5;
      cursor: pointer;
      &.empty-line {
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:last-child {
        border-bottom: none;
      }
      .iconfont {
        font-size: 32px;
        color: #00BA8C;
        &.iconjingshimian {
          color: #E6A23C;
        }
      }
      .file-info {
        padding-left: 18px;
        div {
          width: 386px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .file-title {
          font-size: 14px;
          line-height: 24px;
          color: #333;
        }
        .tips{
          width: auto;
          display: inline-block;
        }
        .file-describe {
          font-size: 12px;
          line-height: 24px;
          color: #666;
        }
      }
    }
    .pagination-container {
      padding: 10px 0 0;
    }
  }
}
</style>
