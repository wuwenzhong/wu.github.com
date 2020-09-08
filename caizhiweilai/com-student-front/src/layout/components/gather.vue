<template>
  <div class="gatherContent">
    <div class="gatherContent-left">
      <p>
        <span class="sp-t">教学资源收取</span>
        <span class="sp-e"><i>ANALYSIS OF TEACHING</i><br><em>RESOURSE </em></span>
      </p>
    </div>
    <div class="gatherContent-right">
      <div class="gatherContent-box">
        <div class="gatherItem" v-for="(item,index) in garthArr" :key="index">
          <div class="gatherLeft">
            <div class='common pic'
                 v-if="item.resPubType == 'jpg' || item.resPubType == 'gif' || item.resPubType == 'jpeg' || item.resPubType == 'png' || item.resPubType == 'svg' || item.resPubType == 'bmp'"></div>
            <div class='common excel' v-else-if="item.resPubType == 'xlsx' || item.resPubType == 'xls'"></div>
            <div class='common pdf' v-else-if="item.resPubType == 'pdf'"></div>
            <div class='common ppt'
                 v-else-if="item.resPubType == 'ppt' || item.resPubType == 'pptx' || item.resPubType == 'potm' || item.resPubType == 'potx'"></div>
            <div class='common txt' v-else-if="item.resPubType == 'txt' || item.resPubType == 'text'"></div>
            <div class='common mp3' v-else-if="item.resPubType == 'mp3' || item.resPubType == 'wma'"></div>
            <div class='common word' v-else-if="item.resPubType == 'docx' || item.resPubType == 'doc'"></div>
            <div class='common video' v-if="item.resPubType == 'mp4' || item.resPubType == 'mkv'"></div>
            <div class='common autowork' v-else-if="item.resExt == 'autowork'"></div>
            <div class='common exe' v-else-if="item.resExt == 'exe'"></div>
            <div class='common sql' v-else-if="item.resExt == 'sql'"></div>
          </div>
          <div class="gatherRight">
            <div class="fileName" :title="item.resName">{{item.resName}}</div>
            <div class="fileMiddle">
              <span>预览次数：{{item.preNum}}次</span>
              <span v-show="item.resType == '1'">下载次数：{{item.downloadNum}}次</span>
              <span v-show="item.resType != '1'" style="visibility: hidden;">下载次数：{{item.downloadNum}}次</span>
            </div>
            <div class="czFile">
              <div class="clickL btn-ck" @click="previewFile(item)"
                   :class="(item.resExt=='autowork'||item.resExt=='sql'||item.resExt=='exe')?'grayclick':''">查看
              </div>
              <!--  style="visibility: hidden;" -->
              <div class="clickL" @click="downFile(item)" v-show="item.resType == '1'">下载</div>
            </div>
          </div>
        </div>
        <div v-show="garthArr.length==0" class="nonezy">暂无教学资源~~</div>
      </div>
      <!-- 分页插件 -->
      <pagination
        :hidden="total <= 7"
        :total="total"
        :pager-count="5"
        :pageSizes="[8,16,32,64]"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="init"
      />
      <!-- <div class="close-btn">
        <p @click="cancel">关闭</p>
      </div> -->
    </div>
    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false"
                    v-if="isShowPrevFile"></show-prev-file>
  </div>
</template>

<script>
import { signInSave, downloadres, preupdate, xiazaifilie } from '@/api/gath'
import showPrevFile from '@/components/showPrevFile/index'

export default {
  components: {
    showPrevFile
  },
  data() {
    return {
      previewData: {}, // 预览参数
      garthArr: [],
      isShowPrevFile: false,
      total: 1,
      currentSizeChange: 8,
      queryParams: {
        page: 1,
        size: 8,
        keyWrods: ''
      },
      everNumberFlag: 8
    }
  },
  props: {
    refresh: {
      type: Number
    }
  },
  watch: {
    refresh: {
      handler(news, old) {
        if (news == 1) {
          this.init()
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 资源列表
    init() {
      if (this.everNumberFlag != this.queryParams.size) {
        this.queryParams.page = 1
        this.everNumberFlag = this.queryParams.size
      }
      signInSave({
        schoolId: localStorage.getItem('customerId'),
        courseId: localStorage.getItem('courseId'),
        page: this.queryParams.page,
        size: this.queryParams.size,
        creator: localStorage.getItem('teacherId')
      }).then(res => {
        if (res.code == '0') {
          this.garthArr = res.result.data
          this.total = parseInt(res.result.total)
          this.$emit('reserRefresh')
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 文件预览
    previewFile(item) {
      if (item.resExt == 'sql' || item.resExt == 'autowork' || item.resExt == 'exe') {
        this.$message({
          type: 'warning',
          message: '此文件暂不支持预览！'
        })
        return false
      }
      preupdate({
        id: item.id
      }).then(res => {
        if (res.code == '0') {
          this.init()
          this.previewData = {
            imgUrl: '',
            resExt: item.resPubType
          }
          if (item.converUrl) {
            this.previewData.imgUrl = item.converUrl
          } else {
            this.previewData.imgUrl = item.downloadUrl
          }
          this.isShowPrevFile = true
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 下载文件
    downFile(item) {
      downloadres({
        id: item.id
      }).then(res => {
        if (res.code == '0') {
          this.init(this.pageSize, this.pageNumber)
          // 下载文件
          xiazaifilie(item.downloadUrl).then(res => {
            const url = window.URL.createObjectURL(new Blob([res]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', item.resName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
          this.init(this.pageSize, this.pageNumber)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 关闭
    cancel() {
      this.$emit('cancelsq')
    }
  }
}
</script>

<style lang="scss" scoped>
  .gatherContent {
    display: flex;

    .gatherContent-left {
      width: 287px;
      height: 685px;
      background: url('../../common/images/dialog-bg.png') no-repeat;
      background-size: 100%;

      p {
        margin-top: 149px;
        margin-left: 43px;

        span {
          display: block;
        }

        .sp-t {
          font-size: 28px;
          color: #1F1F1E;
        }

        .sp-e {
          i {
            color: #0324FD;
            font-size: 16px;
            font-style: normal;
          }

          em {
            color: #37C153;
            font-size: 16px;
            font-style: normal;
          }
        }
      }
    }

    .gatherContent-right {
      width: 643px;
      // height: 535px;
      padding-top: 48px;

      .gatherContent-box {
        width: 643px;
        height: 553px;
        overflow: auto;
        padding-top: 3px;

        .gatherItem {
          width: 298px;
          height: 122px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          border-radius: 8px;
          // padding: 15px 30px 15px 15px;
          box-shadow: 0px 2px 20px 0px rgba(35, 35, 35, 0.11);
          margin-bottom: 15px;
          float: left;
          margin-left: 14px;

          .gatherLeft {
            width: 100px;
            height: 100px;
            margin-left: 10px;
            // img{
            //     width: 100px;
            //     height: 100px;
            // }
            div.common {
              width: 100px;
              height: 100px;
              background-image: url('../../common/images/default_sprit.png');
              margin-right: 20px;
            }

            .pic {
              background-position: (-114px * 7) 0;
            }

            .excel {
              background-position: (-114px * 2) 0;
            }

            .pdf {
              background-position: (-114px * 4) 0;
            }

            .ppt {
              background-position: (-114px * 1) 0;
            }

            .txt {
              background-position: (-114px * 5) 0;
            }

            .mp3 {
              background-position: 0 -115px;
            }

            .word {
              background-position: 0 0;
            }

            .video {
              background-position: (-114px * 6) 0;
            }

            .autowork {
              background-position: -114px -115px;
            }

            .exe {
              background-position: (-114px * 3) -115px;
            }

            .sql {
              background-position: (-114px * 2) -115px;
            }
          }

          .gatherRight {
            margin-left: 10px;

            .fileName {
              font-size: 13px;
              font-weight: 500;
              color: #303133;
              margin-bottom: 5px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              max-width: 175px;
            }

            .fileMiddle {
              font-size: 13px;

              span {
                display: block;
              }

              span:nth-child(1) {
                margin-bottom: 6px;
              }
            }

            .czFile {
              display: flex;
              justify-content: flex-start;
              margin-top: 8px;

              .clickL {
                width: 60px;
                height: 28px;
                border-radius: 14px;
                background: linear-gradient(94deg, rgba(64, 212, 112, 1) 0%, rgba(113, 215, 102, 1) 100%);
                margin-right: 10px;
                cursor: pointer;
                text-align: center;
                line-height: 28px;
                color: #fff;
              }

              .btn-ck {
                margin-left: 40px;
              }
            }
          }
        }
      }

      .close-btn {
        clear: both;
        float: right;
        padding-right: 30px;
        padding-top: 10px;

        p {
          width: 130px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          background: url('../../common/images/btn-bg.png') no-repeat;
          background-size: 100%;
          color: #fff;
          cursor: pointer;
        }
      }

      .gatherItem:hover {
        transition: all 0.3s;
        transform: scale(1.04);
        cursor: pointer;
        border: 1px #40D36F solid;
      }

      .page-handel {
        clear: both;
      }
    }

    .nonezy {
      width: 100%;
      height: 530px;
      line-height: 530px;
      text-align: center;
      font-size: 16px;
    }
  }

  .grayclick {
    color: #c7c7c7 !important;
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
