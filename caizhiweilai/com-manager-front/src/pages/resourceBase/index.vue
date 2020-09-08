<template>
  <div class="account-node app-container">
    <div class="navbar">
      <div class="tabBox" type="card">
        <el-tabs v-model="activeName" @tab-click="tabHandler">
          <el-tab-pane label="课程资源" name="1"></el-tab-pane>
          <el-tab-pane label="账套资源" name="2"></el-tab-pane>
          <el-tab-pane label="公共资源" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="search">
        <el-input
          placeholder="请输入您要搜索的资源名称"
          suffix-icon="el-icon-search"
          size="small"
          v-model.trim="params.search"
          @input="searchContent"
        ></el-input>
        <el-upload
          class="upload-demo"
          action="#"
          :accept="updayaType"
          :show-file-list="false"
          :http-request="updataPic"
          multiple
          :before-upload="uploadBefore"
          :on-exceed="handleExceed"
          :limit="upSizeNumber"
          ref="updatabutton"
        >
          <el-button size="small" type ref="sjsc" style="background:#414d65;color:#fff">点击上传</el-button>
        </el-upload>
      </div>
    </div>
    <div class="searchBox">
      <div v-show="activeName==1">
        <el-form ref="form" label-width="140px" class="searchForm">
          <el-form-item label="按课程资源筛选：">
            <div class style="float:left">
              <el-select
                v-model="allCourse"
                size="mini"
                filterable
                @change="optionHandler"
                placeholder="请选择活动区域"
              >
                <el-option
                  v-for="item in courseArr"
                  :label="item.courseName"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
        <div class="areaBoxMian">
          <div class="areaBox">
            <el-button
              v-for="(item,index) in typeArr"
              :key="index"
              :type="courseIndex==index?'primary':''"
              size="mini"
              @click="courseType(index)"
            >{{item.name}}</el-button>
          </div>
        </div>
      </div>
      <div v-show="activeName==2">
        <el-form ref="form" label-width="140px" class="searchForm">
          <el-form-item label="按账套资源筛选：">
            <div class style="float:left">
              <el-select
                v-model="allsetBook"
                size="mini"
                filterable
                @change="optionHandler"
                placeholder="请选择活动区域"
              >
                <el-option
                  v-for="item in setBookArr"
                  :label="item.caseName"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
        <div class="areaBoxMian">
          <div class="areaBox">
            <el-button
              v-for="(item,index) in typeArr"
              :key="index"
              :type="setbookIndex==index?'primary':''"
              size="mini"
              @click="setBookType(index)"
            >{{item.name}}</el-button>
          </div>
        </div>
      </div>
      <div class v-show="activeName==3">
        <div style="width:100%;height:auto;overflow:hidden;display:flex;position:absolute;">
          <div class="areaBox">
            <el-button
              v-for="(item,index) in typeArr"
              :key="index"
              :type="publicIndex==index?'primary':''"
              size="mini"
              @click="publicType(index)"
            >{{item.name}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- cesource-data  -->
    <div class="cesource-wrap" v-show="searchArr.length>0">
      <div class="cesource-item" v-for="(item, index) in searchArr" :key="index">
        <img src="./images/visio.jpg" v-if="item.fileType == 'VIDEO'" />
        <img src="./images/EXCEL.png" v-else-if="item.fileType == 'EXCEL'" />
        <img src="./images/JPG.jpg" v-else-if="item.fileType== 'PIC'" />
        <img src="./images/PPT.png" v-else-if="item.fileType== 'PPT'" />
        <img src="./images/mp3.png" v-else-if="item.fileType== 'AUDIO'" />
        <img src="./images/txt.png" v-else-if="item.fileType=='TXT'" />
        <img src="./images/project.png" v-else-if="item.fileType == 'PDF'" />
        <img src="./images/WORD.png" v-else-if="item.fileType == 'WORD'" />
        <img src="./images/autowork.png" v-else-if="item.fileType == 'AUTOWORK'" />
        <img src="./images/exe.png" v-else-if="item.fileType == 'EXE'" />
        <img src="./images/sql.png" v-else-if="item.fileType == 'SQL'" />
        <img src="./images/iconPython.png" v-else-if="item.fileType == 'PY'" />
        <img src="./images/power_bi.png" v-else-if="item.fileType == 'PBIX'" />
        <img src="./images/qita.png" v-else />
        <div class="item-detail">
          <el-tooltip :content="item.resName" placement="top-start">
            <h3 class="detail-title" v-if="item.resName === '' || item.resName === null">
              <i class="el-icon-warning"></i>未命名文件
            </h3>
            <h3 class="detail-title" v-else>{{ item.resName }}</h3>
          </el-tooltip>
          <p>
            <span>预览次数：{{ item.preNum }}</span>
            <span>下载次数：{{ item.downloadNum }}</span>
          </p>
          <div class="icon-box">
              <span @click="dowmload(item)">
                <img src="./images/xiazai.png" alt title="下载" />
              </span>
            <span
              @click="previewFile(item)"
              aria-disabled
              :class="(item.resType !='autowork' && item.resType !='exe' &&item.resType !='sql'&&item.resType !='py'&&item.resType !='pbix')?'':'grayz'"
            >
                <img src="./images/yulan.png" alt title="预览" />
              </span>
            <span @click="replacefile(item)">
                <img src="./images/tihuantupian.png" alt title="替换" />
              </span>
            <span @click="delfile(item.id)">
                <img src="./images/shanchu.png" alt title="删除" />
              </span>
          </div>
        </div>
      </div>
    </div>
    <paging
      :total="pagTotal"
      :page.sync="pageParams.page"
      :pageSizes="[12,24,36,48]"
      :limit.sync="pageParams.size"
      @pagination="monitorPagin"
      v-if="pagTotal>12"
      style="display: flex;justify-content: flex-end;"
      v-show="searchArr.length>0"
    ></paging>
    <a href id="testImg" style="display:none"></a>
    <!-- 上传进度条 -->
    <showProgress
      v-show="progressIsshow"
      :percentageNum="percentageNum"
      :fileInfo="fileInfo"
      @quxiao="progressClose"
    ></showProgress>

    <!-- 预览文件 -->
    <show-prev-file
      :previewData="previewData"
      @closePreview="isShowPrevFile = false"
      v-if="isShowPrevFile"
    ></show-prev-file>

    <!-- 没有数据时展示空数据 -->
    <div class="defaultPic" v-show="searchArr.length==0">
      <img src="@/common/images/noDataPic.png" alt />
    </div>
  </div>
</template>

<script>
import {
  resourceList,
  wjUp,
  newResource,
  thfilie,
  delfilie,
  ylfilie,
  xzfilie,
  xiazaifilie,
  allCourse,
  allSetBook,
  editwjUp
} from './../../api/resource'
import { mapGetters, mapActions } from 'vuex'
import paging from '@/components/pagination/index'
import downloadByBlob from '@/common/js/b64Encode.js'
import showProgress from './component/showProgress'
import showPrevFile from '@/components/showPrevFile/index'
export default {
  computed: {
    ...mapGetters(['userId'])
  },
  components: {
    paging,
    showProgress,
    showPrevFile
  },
  name: 'PublCesource',
  data() {
    return {
      params: {
        search: ''
      },
      cesourceData: [],
      searchArr: [],
      resTypeArr: [],
      filesJh: [],
      resType: '',
      thwj: '',
      thwjItem: {},
      pagTotal: 0, // 数据总条数
      pageParams: {
        page: 1,
        size: 12,
        keyWrods: ''
      },
      valNumber: '',
      percentageNum: 0,
      progressIsshow: false,
      fileInfo: [],
      lastfinsh: '',
      searchVal: '',
      timer: '',
      isShowPrevFile: false, // 预览
      previewData: {}, // 预览参数
      activeName: '1',
      allCourse: '全部',
      allsetBook: '全部',
      courseArr: [],
      setBookArr: [],
      typeArr: [
        {
          name: '全部类型',
          value: ''
        },
        {
          name: 'Excel',
          value: 'EXCEL'
        },
        {
          name: 'Word',
          value: 'WORD'
        },
        {
          name: 'PDF',
          value: 'PDF'
        },
        {
          name: 'PPT',
          value: 'PPT'
        },
        {
          name: '图片',
          value: 'PIC'
        },
        {
          name: '视频',
          value: 'VIDEO'
        },
        {
          name: '音频',
          value: 'AUDIO'
        },
        {
          name: 'TXT',
          value: 'TXT'
        }
      ],
      courseIndex: 0,
      setbookIndex: 0,
      publicIndex: 0,
      fileType: '',
      courseId: '',
      upSizeNumber: 10,
      publicres: 1,
      updayaType: '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3',
      knownNumber: 0,
      fileNumberFlag: 0
    }
  },
  mounted() {
    const that = this
    that.init()
    // 进入文件先把替换标识为空
    localStorage.setItem('casefileId', '')
    // 进来页码为1xx
    localStorage.setItem('page', '1')
    // 上传文件个数
    localStorage.setItem('flagProcess', 0)
    // 课程资源下拉框
    this.courseSelect()
    // 账套资源下拉框
    this.setbookSelect()
  },
  methods: {
    // 限制资源上传个数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 10 个文件，本次选择了 ${files.length} 个文件`
      )
    },
    // 课程资源下拉框
    courseSelect() {
      allCourse().then((res) => {
        if (res.code == '0') {
          const arr = [
            {
              courseName: '全部',
              id: ''
            },
            {
              courseName: '未被关联的资源',
              id: '0'
            }
          ]
          this.courseArr = arr.concat(res.result)
        }
      })
    },
    // 账套资源下拉框
    setbookSelect() {
      allSetBook().then((res) => {
        if (res.code == '0') {
          const arr = [
            {
              caseName: '全部',
              id: ''
            },
            {
              caseName: '未被关联的资源',
              id: '0'
            }
          ]
          this.setBookArr = arr.concat(res.result)
        }
      })
    },
    // tab切换
    tabHandler(num) {
      // 公共资源标识
      this.pageParams.page = 1
      this.publicres = num.name
      if (num.name == 1) {
        if (this.typeArr[9]) {
          console.log(this.typeArr.splice(9, 1))
          this.typeArr.splice(9, 1)
        }
        this.updayaType =
          '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3'
        this.fileType = this.typeArr[this.courseIndex].value
        this.courseId = this.allCourse == '全部' ? '' : this.allCourse
      } else if (num.name == 2) {
        if (this.typeArr[9]) {
          console.log(this.typeArr.splice(9, 1))
          this.typeArr.splice(9, 1)
        }
        this.updayaType =
          '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3'
        this.fileType = this.typeArr[this.setbookIndex].value
        this.courseId = this.allsetBook == '全部' ? '' : this.allsetBook
      } else if (num.name == 3) {
        if (!this.typeArr[9]) {
          this.typeArr.push({
            name: '其他',
            value: 'OTHER'
          })
        }
        this.updayaType =
          '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix'
        this.fileType = this.typeArr[this.publicIndex].value
      }
      this.init()
    },
    setBookType(index) {
      this.pageParams.page = 1
      this.setbookIndex = index
      this.fileType = this.typeArr[index].value
      this.init()
    },
    courseType(index) {
      this.pageParams.page = 1
      this.courseIndex = index
      this.fileType = this.typeArr[index].value
      this.init()
    },
    publicType(index) {
      this.pageParams.page = 1
      this.publicIndex = index
      this.fileType = this.typeArr[index].value
      this.init()
    },
    // option点击
    optionHandler(row) {
      this.courseId = row
      this.pageParams.page = 1
      this.init()
    },
    init(type) {
      resourceList({
        courseId: this.courseId,
        page: this.pageParams.page,
        size: this.pageParams.size,
        resUseType: this.activeName,
        fileType: this.fileType,
        keyWrods: this.searchVal == '' ? '' : this.searchVal
      }).then((res) => {
        if (res.code == 0) {
          this.searchArr = res.result.data
          this.pagTotal = parseInt(res.result.total)
          // 回顶部
          this.$el.getElementsByClassName('cesource-wrap')[0].scrollTop = 0

          if (type == 'del') {
            if (this.pageParams.page != 1 && this.searchArr.length == 0) {
              this.pageParams.page--
              this.init()
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 资源上传之前钩子
    uploadBefore(file) {
      console.log(this.upSizeNumber)
      // 清空搜索框
      this.params.search = ''
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name
        ? name.substr(name.lastIndexOf('.') + 1, name.length)
        : true
      let type = ''
      if (this.publicres == '3') {
        type =
          '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix'
      } else {
        type =
          '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3'
      }
      const isExt = type.indexOf(ext) < 0
      if (isExt) {
        this.$message.warning('请上传正确类型的文件！')
        return !isExt
      }
      if (ext != 'exe' && ext != 'autowork' && ext != 'sql') {
        // 文件大小限制
        const specialType = '.mp4,.rmvb,.avi,.mp3'
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
      this.fileNumberFlag = 1
      const _this = this
      const wjType = e.file.name.substring(e.file.name.lastIndexOf('.') + 1)
      this.resType = ''
      const fileItem = {
        name: e.file.name,
        type: wjType,
        allNumber: this.fileInfo.length + 1,
        percentageNum: 0
      }
      this.fileInfo.push(fileItem)
      localStorage.setItem('flagProcess', this.fileInfo.length)
      this.knownNumber = this.knownNumber + 1
      this.upSizeNumber = this.knownNumber + 10
      console.log(this.upSizeNumber)
      this.progressIsshow = true
      const res = await this.cos(e, this, 'percentageNum', function (cb) {
        fileItem.percentageNum = cb.percent * 100
        _this.percentageNum = cb.percent * 100
      })
      let fileType = ''
      if (wjType == 'ppt' || wjType == 'pptx') {
        fileType = 'PPT'
      } else if (wjType == 'doc' || wjType == 'docx') {
        fileType = 'WORD'
      } else if (wjType == 'xls' || wjType == 'xlsx') {
        fileType = 'EXCEL'
      } else if (wjType == 'txt') {
        fileType = 'TXT'
      } else if (wjType == 'mp4' || wjType == 'rmvb' || wjType == 'avi') {
        fileType = 'VIDEO'
      } else if (
        wjType == 'jpg' ||
        wjType == 'jpeg' ||
        wjType == 'gif' ||
        wjType == 'png'
      ) {
        fileType = 'PIC'
      } else if (wjType == 'pdf') {
        fileType = 'PDF'
      } else if (wjType == 'mp3') {
        fileType = 'AUDIO'
      } else if (wjType == 'autowork') {
        fileType = 'AUTOWORK'
      } else if (wjType == 'exe') {
        fileType = 'EXE'
      } else if (wjType == 'sql') {
        fileType = 'SQL'
      } else if (fileType == 'py') {
        fileType = 'PY'
      } else if (fileType == 'pbix') {
        fileType = 'PBIX'
      }
      // 替换
      if (this.thwj == 2) {
        editwjUp({
          resName: e.file.name,
          downloadUrl: res,
          resType: wjType,
          resExt: wjType,
          resSize: e.file.size,
          creator: this.userId,
          id: this.thwjItem.resId
        }).then((res) => {
          if (parseInt(res.code) == 0) {
            this.thwj = ''
            // 替换文件
            thfilie({
              resId: this.thwjItem.resId,
              id: this.thwjItem.id,
              fileType: fileType,
              resUseType: this.activeName
            }).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '上传成功!'
                })
                this.init()
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
          resType: wjType,
          resExt: wjType,
          resSize: e.file.size,
          creator: this.userId
        }).then((res) => {
          if (parseInt(res.code) == 0) {
            let fileType = ''
            if (wjType == 'ppt' || wjType == 'pptx') {
              fileType = 'PPT'
            } else if (wjType == 'doc' || wjType == 'docx') {
              fileType = 'WORD'
            } else if (wjType == 'xls' || wjType == 'xlsx') {
              fileType = 'EXCEL'
            } else if (wjType == 'txt') {
              fileType = 'TXT'
            } else if (wjType == 'mp4' || wjType == 'rmvb' || wjType == 'avi') {
              fileType = 'VIDEO'
            } else if (
              wjType == 'jpg' ||
              wjType == 'jpeg' ||
              wjType == 'gif' ||
              wjType == 'png'
            ) {
              fileType = 'PIC'
            } else if (wjType == 'pdf') {
              fileType = 'PDF'
            } else if (wjType == 'mp3') {
              fileType = 'AUDIO'
            } else if (wjType == 'autowork') {
              fileType = 'AUTOWORK'
            } else if (wjType == 'exe') {
              fileType = 'EXE'
            } else if (wjType == 'sql') {
              fileType = 'SQL'
            } else if (wjType == 'py') {
              fileType = 'PY'
            } else if (wjType == 'pbix') {
              fileType = 'PBIX'
            }
            newResource({
              resId: res.result,
              resName: e.file.name,
              resUseType: this.activeName,
              fileType: fileType,
              courseId: this.courseId,
              keyWrods: this.valNumber == '' ? '' : this.valNumber
            }).then((res) => {
              if (res.code == '0') {
                this.init()
              } else if (this.lastfinsh == 1) {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
            })
          }
        })
      }
    },
    // 根据关键字实现数组的过滤
    search(keywords) {
      return this.cesourceData.filter((item) => {
        if (item.resName.includes(keywords)) return item
      })
    },
    // 下载
    async dowmload(item) {
      const that = this
      // 下载次数
      xzfilie({
        pubResId: item.resId
      }).then((res) => {
        if (res.code == 0) {
          this.init()
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
      // 下载文件
      xiazaifilie(item.downloadUrl).then((res) => {
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
    // 替换
    replacefile(item) {
      // 资源保存
      this.thwj = 2
      this.thwjItem = item
      this.$refs.sjsc.$el.click()
    },
    // 预览
    async previewFile(item) {
      if (
        item.resType == 'autowork' ||
        item.resType == 'exe' ||
        item.resType == 'sql' ||
        item.resType == 'py' ||
        item.resType == 'pbix'
      ) {
        this.$message({
          type: 'warning',
          message: '此文件暂不支持预览！'
        })
        return false
      }
      ylfilie({
        pubResId: item.resId
      }).then((res) => {
        if (res.code == 0) {
          this.init()
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
      if (item.converUrl) {
        this.previewData.imgUrl = item.converUrl
      } else {
        this.previewData.imgUrl = item.downloadUrl
      }
      this.isShowPrevFile = true
    },
    // 删除
    delfile(id) {
      const that = this
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          delfilie({
            ids: id
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.init('del')
            } else {
              this.$message.warning(res.message)
            }
          })
        })
        .catch((arr) => {
          // this.$message.info('取消删除');
        })
    },
    monitorPagin(item) {
      // 分页组件
      resourceList({
        resUseType: this.activeName,
        courseId: this.courseId,
        fileType: this.fileType,
        page: item.page,
        size: item.limit,
        keyWrods: this.valNumber == '' ? '' : this.valNumber
      }).then((res) => {
        if (res.code === '0') {
          this.searchArr = res.result.data
          this.pagTotal = parseInt(res.result.total)

          // 回顶部
          this.$el.getElementsByClassName('cesource-wrap')[0].scrollTop = 0
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    searchContent(val) {
      // console.log('搜索框的数据：' + val)
      // 页码变为第一页
      this.pageParams.page = 1
      // 保存搜索内容
      this.searchVal = val
      this.valNumber = val
      this.init()
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      this.percentageNum = 0
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
      // this.$message({
      //   type: 'success',
      //   message: '上传成功！'
      // })
      this.lastfinsh = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  .tabBox {
    /deep/.el-tabs__active-bar {
      background: none;
      height: 0;
    }
    /deep/.el-tabs__item {
      padding: 0 10px;
      font-size: 12px;
      height: 30px;
      line-height: 30px;
      border: 1px solid rgb(65, 77, 101);
    }
    /deep/.el-tabs__item:nth-child(2) {
      border-radius: 3px 0 0 3px;
    }
    /deep/.el-tabs__item:nth-child(3) {
      border-left: none;
      border-right: none;
    }
    /deep/.el-tabs__item:nth-child(4) {
      border-radius: 0 3px 3px 0;
    }
    /deep/.el-tabs__item.is-active {
      color: #fff;
      background: rgb(65, 77, 101);
      border: 1px solid rgb(65, 77, 101);
    }
    /deep/.el-tabs__item:hover {
      color: rgb(65, 77, 101);
    }
    /deep/.el-tabs__item.is-active:hover {
      color: #fff;
    }
  }
}
.account-node {
  margin: 0.139rem 0.104rem;
  background: white;
  padding: 20px;
  .pagination-container {
    padding: 10px 20px;
  }
}
.account-table {
  margin-top: 20px;
}
.el-table__header-wrapper {
  thead.has-gutter th {
    background-color: #e5eaf4;
    color: #333;
  }
}
.cesource-wrap {
  display: flex;
  /*justify-content: space-between;*/
  flex-wrap: wrap;
  height: calc(100% - 124px);
  overflow: auto;
  padding: 0 10px 10px;
  .cesource-item {
    display: flex;
    margin: 20px 22px 0 0;
    box-sizing: border-box;
    width: 31%;
    height: 160px;
    min-width: 350px;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1); //统一
    padding: 20px;
    margin-right: 22px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 1px 8px 0 rgb(156, 154, 154); // 统一
    }
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    img {
      display: block;
      width: 120px;
      flex-shrink: 0;
      margin-right: 30px;
    }
    .item-detail {
      width: calc(100% - 150px);
      flex: 1;
      .detail-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(48, 48, 48, 1);
        margin-bottom: 18px;
        height: 44px;
        line-height: 22px;
        word-break: break-all;
        @include setEllipsis(2);
      }
      p {
        font-size: 12px;
        color: rgba(174, 174, 174, 1);
        margin-bottom: 14px;
        display: flex;
        span {
          flex: 1;
        }
      }
      .icon-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        span {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 0.069rem;
          img {
            width: 20px;
            height: 20px;
            cursor: pointer;
            margin-right: 0.069rem;
          }
        }
      }
    }
  }
}
.search {
  display: flex;
  justify-content: flex-end;
  .el-input {
    width: 230px;
    margin-right: 20px;
  }
}
.navbar {
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
}
.defaultPic {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  min-height: 500px;
}
.areaBox {
  margin: 0 auto;
  /deep/.el-button--primary {
    background: #414d65;
    border-color: #414d65;
  }
}
.areaBoxMian {
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  position: absolute;
  top: 0;
}
.searchBox {
  width: 100%;
  height: 40px;
  overflow: hidden;
  position: relative;
}
.searchForm {
  width: 320px;
  position: relative;
  z-index: 2;
  /deep/.el-form-item{
    /deep/.el-form-item__label{
      line-height: 28px;
    }
    /deep/.el-form-item__content{
      line-height: 28px;
    }
  }
}
.grayz {
  background: #c7c7c7;
  opacity: 0.4;
}
</style>
