<template>
<div class="course-wrapper">
  <div class="courseTitle">
    <div class="courseName">课程名称：</div>
    <el-select v-model="value" placeholder="请选择课程" @change='curriculum' filterable>
      <el-option v-for="item in options" :key="item.id" :label="item.courseName" :value="item.id"></el-option>
    </el-select>
    <el-button style="background:#414d65;color:#fff" @click="resources">从资源库选择</el-button>
    <el-upload class="upload-demo" action="#" accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .txt, .mp4, .rmvb, .jpg, .jpeg, .gif, .png, .avi, .pdf,.mp3,.exe,.autowork,.sql,.py,.pbix" :show-file-list="false" :http-request="updataPic" multiple :before-upload="uploadBefore">
      <el-button style="background:#414d65;color:#fff" ref="sjsc">本地上传</el-button>
    </el-upload>
  </div>

  <!-- 文件列表 -->
  <el-table :height="AllpagTotal > 10 ? 'calc(100% - 143px)' : 'calc(100% - 95px)'" :data="courseFile" style="width: 100%" border>
    <el-table-column prop="resName" label="序号" width="100" align="center">
      <template slot-scope="scope">
        <span type @click="preview(scope.row)">{{allSize*(allPage - 1)+(scope.$index + 1)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="resName" label="文件名称" align="center"></el-table-column>
    <el-table-column prop="resPubType" label="文件类型" align="center" width="150"></el-table-column>
    <el-table-column prop="resName" label="使用情况" align="center">
      <template slot-scope="scope" style="dis">
        <span style="margin-right:20px">下发次数：{{scope.row.sendNum}}次</span>
        <span>预览次数：{{scope.row.preNum}}次</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="操作" width="200" align="center">
      <template slot-scope="scope">
        <el-link type="warning" @click="replacefile(scope.row)" class="handle">替换</el-link>
        <el-link type="warning" @click="previewfile(scope.row)" class="handle" :class="(scope.row.resPubType=='autowork'||scope.row.resPubType=='sql'||scope.row.resPubType=='exe'||scope.row.resPubType=='py'||scope.row.resPubType=='pbix')?'grayclick':''">预览</el-link>
        <el-link type="warning" @click="disable(scope.row)" class="handle">{{scope.row.enableStatus=='0'?'禁用':'启用'}}</el-link>
        <el-link type="warning" @click.native.prevent="gxhDelete(scope.row)" class="handle">删除</el-link>
      </template>
    </el-table-column>
  </el-table>
  <Pagination :total="AllpagTotal" @pagination="monitorPaginOut" v-if="AllpagTotal>10" style="display: flex;justify-content: flex-end;"></Pagination>

  <!-- 从资源文件选择 -->
  <el-dialog width="50%" title="选择文件" :visible.sync="innerVisibleZs" v-if="innerVisibleZs" :close-on-click-modal="false">
    <div class="zsFile">
      <div>已选择{{numberFile}}个文件</div>
      <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="searckKey" @input="searchContent"></el-input>
    </div>
    <el-table :data="checkFile" style="width: 100%" border @selection-change="handleSelectionChange" @select-all="handleSelectionChange" ref="multipleTable" :row-key="bingRowkeys">
      <el-table-column type="selection" width="66" :reserve-selection="true"></el-table-column>
      <el-table-column prop="resName" label="文件名称"></el-table-column>
      <el-table-column prop="name" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-link type="warning" @click="previewfile(scope.row)" :class="(scope.row.resType=='autowork'||scope.row.resType=='sql'||scope.row.resType=='exe')?'grayclick':''">预览</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pager-count="5" :total="pagTotal" @pagination="monitorPagin" v-if="pagTotal>10" style="display: flex;justify-content: flex-end;"></pagination>
    <span slot="footer" style="display:block;text-align: center;margin-top:15px">
      <el-button size="small" @click="cancelfx" class='el-button--small'>取 消</el-button>
      <el-button style="border:none" class="Determine el-button--small" type="primary" @click="sureQ">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 上传进度条 -->
  <showProgress v-show="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>

  <!-- 预览文件 -->
  <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>

</div>
</template>

<script>
import {
  resourceListt,
  wjUp,
  newResource,
  thfilie,
  saveres,
  courseidList,
  delIds,
  statusEnable,
  updateRes,
  preRes,
  savebatch,
  editwjUp
} from './../../api/resource'
import {
  courseList
} from './../../api/course'
// import paging from '@/components/pagination/index'
import showProgress from '../resourceBase/component/showProgress'
import showPrevFile from '@/components/showPrevFile/index'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  components: {
    showProgress,
    showPrevFile
  },
  computed: {
    ...mapGetters(['userId'])
  },
  data() {
    return {
      allPage: 1,
      allSize: 10,
      value: '',
      options: [],
      courseFile: [],
      checkFile: [],
      innerVisibleZs: false,
      progressIsshow: false,
      isShowPrevFile: false, // 预览
      previewData: {}, // 预览参数
      percentageNum: 0,
      numberFile: 0,
      searckKey: '',
      pagTotal: 0,
      AllpagTotal: 0,
      limit: '',
      fileInfo: [],
      courseId: '',
      checkFileArr: [],
      thwj: '',
      thwjItem: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      courseList({
        page: 1,
        size: 10000
      }).then(res => {
        if (res.code == '0') {
          this.options = res.result.data
          this.value = res.result.data[0].id
          this.courseId = res.result.data[0].id
          // 课程列表
          this.kcList(this.courseId)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    kcList(item) {
      this.allPage = 1
      //   课程列表
      courseidList({
        page: '1',
        size: this.limit == '' ? '10' : this.limit,
        courseId: item == '0' ? '' : item
      }).then(res => {
        if (res.code == '0') {
          this.courseFile = res.result.data
          this.AllpagTotal = parseInt(res.result.total)
          // 回table顶部
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    searchContent() {
      const pageSize = this.limit == '' ? '10' : this.limit
      const keyWrods = this.searckKey
      //   模糊搜索
      resourceListt({
        page: 1,
        size: pageSize,
        courseId: this.courseId == '' ? '' : this.courseId,
        resName: keyWrods
      }).then(res => {
        if (res.code == '0') {
          this.checkFile = res.result.data
          this.pagTotal = parseInt(res.result.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    handleSelectionChange(val) {
      // 已选择多少个文件
      this.numberFile = val.length
      this.checkFileArr = val
    },
    bingRowkeys(row) {
      return row.id
    },
    monitorPagin(item) {
      this.limit = item.limit
      // 分页组件
      resourceListt({
        page: item.page,
        size: item.limit,
        courseId: this.courseId == '' ? '' : this.courseId,
        resName: this.searckKey == '' ? '' : this.searckKey
      }).then(res => {
        if (res.code == '0') {
          this.checkFile = res.result.data
          this.pagTotal = parseInt(res.result.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    monitorPaginOut(item) {
      // 课程列表id
      const listId = this.courseId == '' ? '' : this.courseId
      this.limit = item.limit
      // 保存点击的每页个数和页码
      this.allPage = item.page
      this.allSize = item.limit
      //   课程列表
      courseidList({
        page: item.page,
        size: item.limit,
        courseId: listId
      }).then(res => {
        if (res.code == '0') {
          this.courseFile = res.result.data
          this.AllpagTotal = parseInt(res.result.total)
          // 回table顶部
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    resources() {
      if (!this.courseId) {
        this.$message({
          type: 'warning',
          message: '请先选择课程！'
        })
        return false
      }
      // 从资源文件库选择
      this.innerVisibleZs = true
      resourceListt({
        page: '1',
        size: '10',
        courseId: this.courseId == '' ? '' : this.courseId,
        resName: ''
      }).then(res => {
        if (res.code == 0) {
          this.checkFile = res.result.data
          this.pagTotal = parseInt(res.result.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    cancelfx() {
      this.innerVisibleZs = false
    },
    sureQ() {
      if (this.checkFileArr.length == 0) {
        // 文件个数为0
        this.numberFile = 0
        // 关闭弹窗
        this.innerVisibleZs = false
      } else {
        const resIdArr = []
        for (let index = 0; index < this.checkFileArr.length; index++) {
          const dxNew = {
            resId: this.checkFileArr[index].resId,
            refResPubId: this.checkFileArr[index].id
          }
          resIdArr.push(dxNew)
        }
        // 课程上传
        savebatch({
          courseId: this.courseId,
          refCoursePubResDTOList: resIdArr,
          resType: '0',
          creator: this.userId,
          shcoolId: '0'
        }).then(res => {
          if (res.code == '0') {
            // 课程列表
            const listId = this.courseId == '' ? '0' : this.courseId
            this.kcList(listId)
            this.checkFileArr = []
            // 关闭弹窗
            this.innerVisibleZs = false
            // 清空搜索框
            this.searckKey = ''
            // 文件个数为0
            this.numberFile = 0
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }
    },
    // 资源上传之前钩子
    uploadBefore(file) {
      if (!this.courseId && this.thwj != 2) {
        this.$message({
          type: 'warning',
          message: '请先选择课程！'
        })
        return false
      }
      // 清空搜索框
      this.searckKey = ''
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
      const type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix'
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确的格式类型!')
        return !isExt
      }
      if (ext != 'exe' && ext != 'autowork' && ext != 'sql') {
        // 文件大小限制
        const specialType = '.mp4,.rmvb,.avi'
        const specialExt = specialType.indexOf(ext) < 0
        const maxSize = file.size / 1024 / 1024 > 100
        const isLtSize = file.size / 1024 / 1024 > 20

        if (maxSize) {
          this.$message.warning('文件最大不能超过 100MB！')
          return false
        } else if (specialExt && isLtSize) {
          this.$message.warning('除mp4、rmvb、avi文件外，文件不能超过 20MB！')
          return false
        }
      }
    },
    async updataPic(e) {
      const fileType = e.file.name.substring(e.file.name.lastIndexOf('.') + 1)
      let wjType = ''
      if (fileType == 'ppt' || fileType == 'pptx') {
        wjType = 'PPT'
      } else if (fileType == 'doc' || fileType == 'docx') {
        wjType = 'WORD'
      } else if (fileType == 'xls' || fileType == 'xlsx') {
        wjType = 'EXCEL'
      } else if (fileType == 'txt') {
        wjType = 'TXT'
      } else if (fileType == 'mp4' || fileType == 'rmvb') {
        wjType = 'VIDEO'
      } else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'png') {
        wjType = 'PIC'
      } else if (fileType == 'pdf') {
        wjType = 'PDF'
      } else if (fileType == 'mp3' || fileType == 'avi') {
        wjType = 'AUDIO'
      } else if (fileType == 'autowork') {
        wjType = 'AUTOWORK'
      } else if (fileType == 'exe') {
        wjType = 'EXE'
      } else if (fileType == 'sql') {
        wjType = 'SQL'
      } else if (fileType == 'py') {
        wjType = 'PY'
      } else if (fileType == 'pbix') {
        wjType = 'PBIX'
      }
      this.resType = ''
      const fileItem = {
        name: e.file.name,
        type: fileType,
        allNumber: this.fileInfo.length + 1,
        percentageNum: 0
      }
      this.fileInfo.push(fileItem)
      localStorage.setItem('flagProcess', this.fileInfo.length)
      this.progressIsshow = true
      const res = await this.cos(e, this, 'percentageNum', function (cb) {
        fileItem.percentageNum = cb.percent * 100
      })
      // 替换
      if (this.thwj == 2) {
        editwjUp({
          resName: e.file.name,
          downloadUrl: res,
          resType: fileType,
          resExt: fileType,
          resSize: e.file.size,
          creator: this.userId,
          id: this.thwjItem.resId
        }).then(res => {
          if (parseInt(res.code) == 0) {
            // 课程资源替换
            updateRes({
              resId: this.thwjItem.resId,
              id: this.thwjItem.id,
              resUseType: '3',
              fileType: wjType,
              refResPubId: this.thwjItem.refResPubId
            }).then(res => {
              if (res.code == '0') {
                this.$message({
                  type: 'success',
                  message: '替换成功！'
                })
                // 课程列表
                const listId = this.courseId == '' ? '0' : this.courseId
                this.kcList(listId)
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
            })
          }
        })
      } else {
        // 新增
        wjUp({
          resName: e.file.name,
          downloadUrl: res,
          resType: fileType,
          resExt: fileType,
          resSize: e.file.size,
          creator: this.userId
        }).then(res => {
          const fileId = res.result
          newResource({
            resId: res.result,
            resName: e.file.name,
            resUseType: '3',
            fileType: wjType
          }).then(res => {
            if (res.code == '0') {
              // 课程上传
              saveres({
                courseId: this.courseId,
                resIds: fileId.split(','),
                resType: '0',
                creator: this.userId,
                shcoolId: '0',
                refResPubId: res.result
              }).then(res => {
                if (res.code == '0') {
                  this.$message.success('新增成功')
                  // 课程列表
                  const listId = this.courseId == '' ? '0' : this.courseId
                  this.kcList(listId)
                } else {
                  this.$message({
                    type: 'warning',
                    message: res.message
                  })
                }
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
      }
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
    },
    curriculum(item) {
      this.courseId = item
      // 课程列表
      this.kcList(item)
    },
    gxhDelete(val) {
      this.$confirm('删除此文件后将不可修复，是否确认删除？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          // 删除
          delIds({
            ids: val.id
          }).then(res => {
            if (res.code == '0') {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              // 删除之后刷新课程列表
              const listId = this.courseId == '' ? '0' : this.courseId
              this.kcList(listId)
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(action => {})
    },
    disable(val) {
      this.$confirm('您正在进行启用/禁用文件操作，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        statusEnable({
          id: val.id,
          enableStatus: val.enableStatus == '0' ? '1' : '0'
        }).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: val.enableStatus == '0' ? '禁用成功！' : '启用成功！'
            })
            // 课程列表
            const listId = this.courseId == '' ? '0' : this.courseId
            this.kcList(listId)
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      })
    },
    // 预览
    async previewfile(item) {
      console.log(item)
      if (item.resPubType == 'sql' || item.resPubType == 'autowork' || item.resPubType == 'exe' || item.resType == 'sql' || item.resType == 'autowork' || item.resType == 'exe' || item.resPubType == 'py' || item.resPubType == 'pbix') {
        this.$message({
          type: 'warning',
          message: '此文件暂不支持预览！'
        })
        return false
      }
      preRes({
        id: item.id
      }).then(res => {
        if (res.code == '0') {
          // 课程列表
          const listId = this.courseId == '' ? '0' : this.courseId
          this.kcList(listId)
          // 预览弹窗
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
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 替换
    replacefile(item) {
      this.thwj = 2
      this.thwjItem = item
      this.$refs.sjsc.$el.click()
    }
  }
}
</script>

<style lang="scss">
.course-wrapper {
  height: 100%;
  overflow: hidden;
  .el-table {
    border-collapse: collapse;
    border-spacing: 1;
    border-spacing: 0;
    margin-top: 20px;
    th {
      background: #E5EAF4;
    }
  }
  .courseTitle {
    display: flex;
    justify-content: flex-start;
    margin: 20px 0;
    .courseName {
      display: flex;
      align-items: center;
    }
    button {
      margin-left: 20px;
    }
    // .upload-demo {
    //   width: 100%;
    //   height: 100%;
    //   button {
    //     width: 100%;
    //     height: 100%;
    //   }
    // }
  }
  .handle {
    margin-right: 10px;
  }
  .zsFile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      width: 200px;
      margin-bottom: 20px;
    }
  }
}
.grayclick{
  color: #c7c7c7 !important;
}
</style>
