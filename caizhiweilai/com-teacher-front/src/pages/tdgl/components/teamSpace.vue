<template>
  <div class="dialog-box">
    <div class="cont">
      <!-- 团队空间 -->
      <!-- <div class="teamSpace" :style="{height: (this.teamFileList.length <= 12 && this.pageTatal <= 12 ) ? '600px' : ''}"> -->
      <div class="teamSpace" style='height:498px'>
        <!-- <div class="space">
        <div class="right">
          <input
            type="text"
            @keyup.enter="searchKeyWords"
            placeholder="输入搜索关键词"
            v-model="searchTerm"
          />
          <el-upload
            action="#"
            :show-file-list="false"
            :http-request="uploadFile"
            :before-upload="beforeUpload"
          >
            <div class="upload">上传文件</div>
          </el-upload>
        </div>
      </div> -->
        <ul class="tdkj-ul" v-if="this.teamFileList.length > 0">
          <li ref="lis" v-for="(item, index) in teamFileList" :key="index">
            <img v-if="item.resType === 'PIC'" src="../images/img_icon.png" />
            <img
              v-else-if="item.resType === 'EXCEL'"
              src="../images/excel.png"
            />
            <img
              v-else-if="item.resType === 'PDF'"
              src="../images/pdf_icon.png"
            />
            <img
              v-else-if="item.resType === 'PPT'"
              src="../images/ppt_icon.png"
            />
            <img
              v-else-if="item.resType === 'TXT'"
              src="../images/txt_icon.png"
            />
            <img
              v-else-if="item.resType === 'WORD'"
              src="../images/word_icon.png"
            />
            <img
              v-else-if="item.resType === 'MP3'"
              src="../images/mp3_icon.png"
            />
            <img
              v-else-if="item.resType === 'VIDEO'"
              src="../images/video_icon.png"
            />
            <img
              v-else-if="item.resType === 'AUTOWORK'"
              src="../images/autowork.png"
            />
            <img v-else-if="item.resType === 'EXE'" src="../images/exe.png" />
            <img v-else-if="item.resType === 'SQL'" src="../images/sql.png" />
            <i v-else-if="item.resType === 'PY'" class="iconfont icon-pic">&#xe703;</i>
            <i v-else-if="item.resType === 'PBIX'" class="iconfont icon-pic">&#xe601;</i>
            <el-tooltip effect="dark" :content="item.resName" placement="top">
              <div class="pd_2">
                {{ item.resName }}
              </div>
            </el-tooltip>
            <p class="pd_3">
              <el-button
                size="mini"
                type="info"
                @click="CKData(item)"
                v-show="
                  !(
                    item.resType === 'EXE' ||
                    item.resType === 'AUTOWORK' ||
                    item.resType === 'SQL'
                  )
                "
                >查看</el-button
              >
              <el-button size="mini" type="danger" @click="deleteRes(item)"
                >删除</el-button
              >
              <el-button size="mini" type="info" @click="download(item)"
                >下载</el-button
              >
            </p>
            <div class="pd_4">
              <span
                >查看: <i>{{ item.preNum }}</i></span
              ><span
                >下载: <i>{{ item.downloadNum }}</i></span
              >
            </div>
            <!-- <div v-if="item.creator === userId">
            <div class="myDir"></div>
            <div class="myText">我的</div>
          </div> -->
          </li>
        </ul>
        <!-- 暂无数据 -->
        <div class="nodata" v-else>
          <img src="../images/noDataPic.png" alt="" />
        </div>
      </div>
      <pagin
          :total="pageTatal"
          :pageSizes="[12, 24, 48, 96]"
          @pagination="monitorPagin"
          :limit="tableSize"
          :page="tablePage"
          v-if="pageTatal > 12"
        ></pagin>
      <showPrevFile
        :previewData="previewData"
        @closePreview="isShowPrevFileClose"
        v-if="isShowPrevFile"
      ></showPrevFile>
    </div>
  </div>
</template>
<script>
import {
  teamResList,
  deleteTeamRes,
  xzfilieNum,
  xzfilie,
  ylfilieNum
} from '@/api/teamAdmin'
import showPrevFile from '@/components/showPrevFile/index'
import pagin from '@/components/pagination'
export default {
  name: 'teamSpace',
  props: ['teamSpaceData'],
  components: {
    showPrevFile,
    pagin
  },
  data() {
    return {
      pageTatal: 0, // 数据总条数
      tableSize: 12,
      tablePage: 1,
      teamFileList: [], // 团队文件列表
      previewData: {}, // 存储Url
      isShowPrevFile: false, // 预览弹框
      search: ''
    }
  },
  watch: {
    teamSpaceData() {
      this.queryTeamResList()
    }
  },
  methods: {
    // 分页触发的方法
    monitorPagin(obj) {
      if (obj.limit !== this.tableSize) {
        this.tablePage = 1
        this.tableSize = obj.limit
        this.queryTeamResList()
        return
      }
      this.tableSize = obj.limit
      this.tablePage = obj.page
      this.queryTeamResList()
    },
    // 关闭预览弹框
    isShowPrevFileClose() {
      this.isShowPrevFile = false
    },
    // 查看资源列表
    async queryTeamResList() {
      const res = await teamResList({
        page: this.tablePage || 1,
        size: this.tableSize || 12,
        classId: this.teamSpaceData.classId,
        teamId: this.teamSpaceData.id || localStorage.getItem('teamId'),
        keyWrods: this.search || ''
      })
      if (res.code === '0') {
        this.teamFileList = res.result.data
        this.pageTatal = +res.result.total
        // if (this.teamFileList.length > 0 && this.teamFileList.length < 12) {
        //   const addArr = new Array(12 - this.teamFileList.length).fill({})
        //   this.teamFileList = this.teamFileList.concat(addArr)
        //   console.log(this.teamFileList)
        // }
      } else {
        this.$message.warning(res.message)
      }
    },
    // 删除资源
    deleteRes(item) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteTeamRes({
            resId: item.id
          })
          if (res.code === '0') {
            this.$message.success('删除成功')
            this.tablePage = 1
            this.queryTeamResList()
          } else {
            this.$message.warning('删除失败，请重试！')
          }
        })
        .catch(() => {})
    },
    // 下载资源
    async download(item) {
      // 下载次数
      xzfilieNum({ pubResId: item.id }).then(res => {
        if (res.code == 0) {
          this.queryTeamResList()
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
      xzfilie(item.downloadUrl).then(res => {
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.resName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 查看资源
    async CKData(item) {
      // 预览次数
      ylfilieNum({ pubResId: item.id }).then(res => {
        if (res.code == 0) {
          this.queryTeamResList()
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
      this.previewData = {
        imgUrl: '',
        resExt: item.resExt
      }
      if (
        item.resType === 'EXCEL' ||
        item.resType == 'PPT' ||
        item.resType == 'TXT' ||
        item.resType == 'WORD'
      ) {
        this.previewData.imgUrl = item.converUrl
      } else {
        this.previewData.imgUrl = item.downloadUrl
      }
      this.isShowPrevFile = true
    }
  },
  mounted() {
    this.queryTeamResList()
  }
}
</script>

<style scoped lang="scss">
.dialog-box {
  // height: 600px;
  // overflow: hidden;
  .teamSpace {
    i{
      font-style: normal;
    }
    // height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding: 0 10px 0 10px;
    // background-color: #fff;
    div.space {
      display: flex;
      justify-content: space-between;
      height: 60px;
      p {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        color: rgba(95, 98, 102, 1);
      }
      .right {
        display: flex;
        input {
          width: 230px;
          height: 29px;
          border: 1px solid #dcdfe6;
          box-sizing: border-box;
          padding-left: 12px;
          outline: none;
          border-radius: 6px;
          margin-top: 16px;
          margin-right: 20px;
          &:hover {
            border: 1px solid #36cea9;
            transition: 0.5s all linear;
          }
          &:focus {
            border: 1px solid #36cea9;
            transition: 0.5s all linear;
          }
          &::-webkit-input-placeholder {
            font-size: 13px;
            line-height: 30px;
            color: #aaa;
          }
        }
      }
      .upload {
        width: 87px;
        height: 28px;
        line-height: 28px;
        color: #fff;
        border-radius: 3px;
        background-color: #36cea9;
        cursor: pointer;
        text-align: center;
        margin-top: 16px;
      }
    }
    .tdkj-ul {
      padding-top: 10px;
      // display: -webkit-box;
      display: -webkit-flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      li {
        overflow: hidden;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.09);
        // box-shadow: 1px 1px 8px 0 #ccc;
        width: 380px;
        padding: 20px;
        list-style: none;
        margin-bottom: 20px;
        margin-right: 16px;
        display: -webkit-flex;
        position: relative;
        transition: all 0.4s;
        &:hover {
          box-shadow: 0 1px 8px 0 #ccc;
          transform: scale(1.02);
          transition: all 0.4s;
        }
        img {
          width: 140px;
          height: 140px;
          margin-right: 16px;
        }
        i.icon-pic{
          width: 140px;
          height: 140px;
          background-color: #eafffa;
          line-height: 140px;
          text-align:center;
          font-size: 66px;
          color: $color-theme;
        }
        .pd_2 {
          margin-bottom: 70px;
          font-size: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          word-break: normal;
        }
        .pd_3 {
          padding-top: 26px;
          margin-left: auto;
          margin-right: 20px;
          position: absolute;
          bottom: 20px;
          right: 0;
          .el-button--info {
            background: #36cea9;
            border-color: #36cea9;
          }
          .el-button + .el-button {
            margin-left: 10px;
          }
        }
        .pd_4 {
          margin-right: 20px;
          position: absolute;
          bottom: 60px;
          left: 177px;
          font-size: 14px;
          color: #666;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          span {
            margin-right: 10px;
            i {
              color: #36cea9;
            }
          }
        }
        .myDir {
          position: absolute;
          border: 20px solid #ff9d6a;
          border-bottom-color: transparent;
          border-left-color: transparent;
          top: 0;
          right: 0;
        }
        .myText {
          position: absolute;
          color: #fff;
          font-size: 12px;
          top: 4px;
          right: 0;
          transform: rotate(45deg);
        }
      }
    }
    .nodata {
      width: 100%;
      height: 400px;
      text-align: center;
      img {
        margin: 100px 0;
        width: 250px;
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
