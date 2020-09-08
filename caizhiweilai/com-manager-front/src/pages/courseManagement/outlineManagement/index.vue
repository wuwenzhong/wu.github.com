<template>
  <div class="app-container">
    <div class="back">
      <router-link to="/courseManagement">
        <i data-v-18dd9633 class="el-icon-caret-left"></i>
        <span class="backlist">返回课程列表</span>
      </router-link>
    </div>
    <div class="kccontent">
      <div class="contentLeft">
        <ul
         @dragstart="onDragStart"
          @dragover="onDragOver"
          @dragend="onDragEnd"
          ref="parentNode">
          <li
            v-for="(item,index) in dgArr"
            :key="index"
            :data-item="JSON.stringify(item)"
            :class="colorItem == index? 'colorItem' :''"
            @click="itemindex(item.id,index)"
            @mouseenter="enter(index)"
            @mouseleave="leave(index)"
            :title="item.outlineName"
            draggable="true">
            <span></span>
            <p>模块{{item.number}}、{{item.outlineName}}</p>
            <div class="operationDg">
              <div class="bjdg" v-show="hoverContent == index" @click.stop="bianji(item)">编辑</div>
              <div class="deldg" v-show="hoverContent == index" @click.stop="delDg(item.id)">删除</div>
            </div>
          </li>
        </ul>
        <div class="adddagang" @click="rough()">
          <span>+</span>
          <span>添加大纲</span>
        </div>
      </div>
      <div class="contentRight" :style="{width: scrollerHeight}">
        <div class="rightTitle" @click="SimulationTasks">添加实训任务</div>
        <div class="case-table">
          <el-table height="calc(100% - 20px)" :data="tableData" ref="drapTable" border row-key="id" style="cursor:move;">
            <el-table-column prop="taskName" label="任务名称" align="left"></el-table-column>
            <el-table-column prop="taskTypeName" label="任务类型" align="left"></el-table-column>
            <el-table-column prop="period" label="课时" align="left"></el-table-column>
            <el-table-column prop="cz" label="操作" align="center">
                <template slot-scope="scope">
                  <!-- <div > -->
                    <el-link type="warning" @click="individuation(scope.row)" v-show="scope.row.taskTypeName!='考试任务'">个性化资源</el-link>
                    <el-link type="warning" @click="individuation(scope.row)" v-show="scope.row.taskTypeName=='考试任务'" style="visibility: hidden;">个性化资源</el-link>
                    <el-link type="warning" @click="edidcase(scope.row.id)">修改</el-link>
                    <el-link type="warning" @click="looktast(scope.row.id)">查看</el-link>
                    <el-link type="warning" @click="handleDelete(scope.$index, tableData)">删除</el-link>
                  <!-- </div> -->
                </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 添加实训任务 -->
    <el-dialog width="40%" title="添加实训任务" :visible.sync="outerVisible" :close-on-click-modal="false">
      <addTast @sxtast="sxtast" v-if="outerVisible"></addTast>
    </el-dialog>
    <!-- 查看实训任务 -->
    <el-dialog width="40%" title="查看实训任务" :visible.sync="lookouterVisible" :close-on-click-modal="false">
      <lookTast @looksxtast="looksxtast" :lookTastData="lookTastData" v-if="lookouterVisible"></lookTast>
    </el-dialog>
    <!-- 修改实训任务 -->
    <el-dialog width="46%" title="修改实训任务" :visible.sync="reviseouterVisible" :close-on-click-modal="false">
      <reviseTast
        @revissxtast="revissxtast"
        :reviseTastData="reviseTastData"
        v-if="reviseouterVisible"
      ></reviseTast>
    </el-dialog>
    <!-- 添加大纲 -->
    <el-dialog width="46%" title="添加大纲" :visible.sync="addDaGang" v-if="addDaGang" :close-on-click-modal="false">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item label="大纲名称：" :label-width="formLabelWidth">
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:block;text-align: center">
        <el-button @click="addDaGang = false" class='el-button--small'>取 消</el-button>
        <el-button
          class='Determine el-button--small'
          type="primary"
          @keyup.enter.native="dgsuerKey"
          @click="dgsuer"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑大纲 -->
    <el-dialog width="46%" title="编辑大纲" :visible.sync="editDaGang" v-if="editDaGang" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="大纲名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:block;text-align: center">
        <el-button class='el-button--small' @click="cancels">取 消</el-button>
        <el-button class='Determine el-button--small' type="primary" @click="editdgsuer">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 个性化资源 -->
    <el-dialog width="46%" title="个性化资源" :visible.sync="gxhFile" v-if="gxhFile" :close-on-click-modal="false">
      <div class="checkFile">
        <div class="zsdxzrw" @click="zsdyzwj" style="margin-bottom:0px">选择文件</div>
        <el-upload class="upload-demo" action="#" accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx, .txt, .mp4, .rmvb, .jpg, .jpeg, .gif, .png, .avi, .pdf,.mp3,.exe,.autowork,.sql,.py,.pbix" :show-file-list="false" :http-request="updataPic" multiple :before-upload="uploadBefore" size='small'>
          <el-button style="background:#414d65;color:#fff" ref="sjsc">本地上传</el-button>
        </el-upload>
      </div>
      <div class="tableScoll">
        <el-table :data="zywjArr" style="width: 100%" border>
          <el-table-column prop="resName" label="文件名称" ></el-table-column>
          <el-table-column prop="name" label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-link type="warning" @click="previewFile(scope.row)" :class="(scope.row.resExt=='autowork'||scope.row.resExt=='sql'||scope.row.resExt=='exe'||scope.row.resExt=='py'||scope.row.resExt=='pbix')?'grayclick':''">预览</el-link>
              <el-link type="warning" @click.native.prevent="gxhDelete(scope.$index, zywjArr)" style="margin:0 10px">删除</el-link>
              <el-checkbox v-model="arrRadion[scope.$index].down" @click.native="allowDown(arrRadion[scope.$index].down,scope.$index)"></el-checkbox>
              <div type="warning" style="color: #E6A23C;display:inline">
                允许下载
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" style="display:block;text-align: center">
        <el-button class='el-button--small' @click="gxhFile=false">取 消</el-button>
        <el-button class='Determine el-button--small' type="primary" @click="gxhsuer">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择文件 -->
    <el-dialog width="50%" title="选择文件" :visible.sync="innerVisibleZs" append-to-body :before-close='qxGxh' v-if="innerVisibleZs" :close-on-click-modal="false">
      <div class="zsFile">
        <div>已选择{{numberFile}}个文件</div>
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="searckKey"
          @input="searchContent"
          class="ssnr"
        ></el-input>
      </div>
      <el-table
        :data="gxhArr"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        @select-all="handleSelectionChange"
        ref="multipleTable"
        :row-key="bingRowkeys"
      >
        <el-table-column type="selection" width="66" :reserve-selection='true'></el-table-column>
        <el-table-column prop="resName" label="文件名称"></el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="warning" @click="previewFile(scope.row)" :class="(scope.row.resExt=='autowork'||scope.row.resExt=='sql'||scope.row.resExt=='exe')?'grayclick':''">预览</el-link>
          </template>
        </el-table-column>
      </el-table>
      <paging
        :total="pagTotal"
        :pager-count="5"
        :page.sync="pageParamsGxh"
        @pagination="monitorPagin"
        v-if="pagTotal>10"
        :pageSizes="[10,25,50,100]"
        style="display: flex;justify-content: flex-end;"
      ></paging>
      <span slot="footer" style="display:block;text-align: center;margin-top:15px">
        <el-button class='el-button--small' @click="qxGxh">取 消</el-button>
        <el-button class='Determine el-button--small'  type="primary" @click="sureQ">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预览文件 -->
    <show-prev-file :previewData="previewData" @closePreview="isShowPrevFile = false" v-if="isShowPrevFile"></show-prev-file>
    <!-- 上传进度条 -->
    <showProgress v-show="progressIsshow" :percentageNum="percentageNum" :fileInfo="fileInfo" @quxiao="progressClose"></showProgress>
  </div>
</template>

<script>
import addTast from './compontents/addTast.vue'
import lookTast from './compontents/lookTast.vue'
import reviseTast from './compontents/reviseTast.vue'
import Sortable from 'sortablejs'
import paging from '@/components/pagination/index'
import showPrevFile from '@/components/showPrevFile/index'
import {
  dgList,
  define,
  syllabus,
  byIdDetails,
  editGg,
  delGg,
  delTast,
  dragSortTable,
  zywj,
  fileInfo,
  personaupdate,
  delFiles,
  outlineSort
} from './../../../api/course'
import { wjUp, newResource } from '@/api/resource'
import { mapGetters, mapActions } from 'vuex'
import showProgress from '@/pages/resourceBase/component/showProgress'
// 拖拽
// import VueDragResize from 'vue-drag-resize'
export default {
  name: 'tast',
  computed: {
    ...mapGetters(['userId']),
    scrollerHeight: function() {
      return (window.innerWidth - 72 - 400) + 'px'
    }
  },
  components: {
    addTast,
    lookTast,
    reviseTast,
    showPrevFile,
    paging,
    showProgress
  },
  watch: {
    // gxhArr(val) {
    //   if (val) {
    //     val.forEach(item => {
    //       this.newArr.forEach(self => {
    //         if (item.id == self.if) {
    //           this.$refs.multipleTable.toggleRowSelection(item)
    //         }
    //       })
    //     })
    //   }
    // },
    // zywjArr(val) {
    //   const that = this
    //   val.forEach(item => {
    //     that.gxhArr.forEach(self => {
    //       if (item.resId == self.resId || item.id == self.id) {
    //         that.$refs.multipleTable.toggleRowSelection(item, true)
    //       }
    //     })
    //   })
    // }
  },
  data() {
    return {
      colorItem: 0,
      dgArr: [],
      tableData: [],
      outerVisible: false,
      addDaGang: false,
      formLabelWidth: '120px',
      form: {
        name: ''
      },
      lookTastData: {},
      reviseTastData: {},
      lookouterVisible: false,
      reviseouterVisible: false,
      editDaGang: false,
      hoverContent: '999',
      bjdgId: '',
      hideenShow: false,
      clickIndex: 0,
      draging: null, // 被拖拽的对象
      target: null, // 目标对象
      gxhFile: false,
      zywjArr: [],
      innerVisibleZs: false,
      pagTotal: '',
      numberFile: 0,
      searckKey: '',
      gxhArr: [],
      gxhzyTaskId: '',
      isShowPrevFile: false, // 预览
      previewData: {}, // 预览参数
      newArr: [],
      pageParamsGxh: 1,
      arrRadion: [],
      fileInfo: [],
      progressIsshow: false,
      percentageNum: 0,
      knownNumber: 0
    }
  },
  mounted() {
    this.init(0)
    this.dragSetTableSort()
  },
  methods: {
    init(val) {
      // 左侧大纲列表
      dgList({ coursrId: this.$route.query.courseId }).then(res => {
        this.dgArr = res.result
        for (let index = 0; index < res.result.length; index++) {
          this.dgArr[index].number = this.numTransform(index)
        }
        if (res.result.length == 0) {
          sessionStorage.setItem('dgId', '')
          this.tableData = []
          return false
        } else {
          // 大纲列表为空 隐藏
          this.hideenShow = true
          const index = this.dgArr.length > val ? val : this.dgArr.length - 1
          this.colorItem = index
          sessionStorage.setItem('dgId', this.dgArr[index].id)
          localStorage.setItem('outlineId', this.dgArr[index].id)
          syllabus({ outlineId: this.dgArr[index].id }).then(res => {
            this.tableData = res.result
          })
        }
      })
    },
    // 资源上传之前钩子
    uploadBefore(file) {
      // 文件类型限制
      const name = file.name ? file.name : ''
      const ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
      let type = ''
      type = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.mp4,.rmvb,.jpg,.jpeg,.gif,.png,.avi,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix'
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
      const converUrl = res
      const resExt = fileType
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
            //  zywjArr
            zywj({
              page: '1',
              size: '10',
              keyWrods: '',
              taskId: this.gxhzyTaskId,
              type: '3'
            }).then(res => {
              if (res.code == 0) {
                this.zywjArr.unshift({
                  converUrl: res.result.data[0].converUrl,
                  downloadUrl: converUrl,
                  isAllow: '0',
                  resExt: resExt,
                  resId: fileId,
                  resName: e.file.name
                })
                this.arrRadion.unshift({ down: true })
                this.$message({
                  type: 'success',
                  message: '上传成功'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '上传成功'
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
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = []
      localStorage.setItem('flagProcess', 0)
      this.progressIsshow = false
    },
    allowDown(bfix, index) {
      // fix 0 是 1 否
      this.zywjArr[index].isAllow = bfix
    },
    // 转化数字为中文
    numTransform(index) {
      index = index + 1
      const number = parseInt(index, 0)
      const singleWord = [
        '',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '零'
      ]
      const unit = ['十', '百']
      const indexFirstNum = parseInt(number.toString().substr(0, 1), 0)
      const indexSecondNum = parseInt(number.toString().substr(1, 1), 0)
      const indexThirdNum = parseInt(number.toString().substr(2, 1), 0)
      if (number < 10) {
        return singleWord[number]
      } else if (number < 100) {
        if (indexFirstNum === 1) {
          // 10为特殊情况
          return unit[0] + singleWord[indexSecondNum]
        } else {
          return singleWord[indexFirstNum] + unit[0] + singleWord[indexSecondNum]
        }
      } else {
        if (indexThirdNum === 0 && indexSecondNum === 0) {
          // 109 和 190 两种类型的特殊情况
          return singleWord[indexFirstNum] + unit[1]
        } else if (indexSecondNum === 0) {
          return (
            singleWord[indexFirstNum] +
            unit[1] +
            singleWord[10] +
            singleWord[indexThirdNum]
          )
        }
        return (
          singleWord[indexFirstNum] +
          unit[1] +
          singleWord[indexSecondNum] +
          unit[0] +
          singleWord[indexThirdNum]
        )
      }
    },
    itemindex(itemId, value) {
      localStorage.setItem('outlineId', itemId)
      this.clickIndex = value
      sessionStorage.setItem('dgId', itemId)
      this.colorItem = value
      syllabus({ outlineId: itemId }).then(res => {
        this.tableData = res.result
      })
    },
    edidcase(value) {
      // 修改
      byIdDetails({ taskId: value }).then(res => {
        if (res.code == '0') {
          this.reviseTastData = res.result
          if (res.result.enterpriseInformationId) {
            localStorage.setItem('qyIdcode', res.result.enterpriseInformationId)
          }
          if (this.reviseTastData) {
            this.reviseouterVisible = true
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    looktast(val) {
      // 查看
      byIdDetails({ taskId: val }).then(res => {
        if (res.code == 0) {
          this.lookouterVisible = true
          this.lookTastData = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    bingRowkeys(row) {
      return row.id
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该实训任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除
          delTast({ id: row[index].id }).then(res => {
            if (res.code == 0) {
              row.splice(index, 1)
              this.init(this.clickIndex)
              this.$message({
                type: 'success',
                message: res.message
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    SimulationTasks() {
      // 实训任务
      this.outerVisible = true
      localStorage.setItem('qyIdcode', '')
    },
    rough() {
      // 添加大纲
      this.addDaGang = true
    },
    dgsuerKey() {
      // 点击enter
    },
    dgsuer() {
      // 确定
      if (this.form.name == '') {
        this.$message({
          type: 'warning',
          message: '大纲名称不能为空!'
        })
        return false
      } else if (this.form.name.length > 20) {
        this.$message({
          type: 'warning',
          message: '大纲名称不能超过20个字!'
        })
        return false
      }
      define({
        outlineName: this.form.name,
        courseId: this.$route.query.courseId,
        creator: this.userId
      }).then(res => {
        if (parseInt(res.code) == 0) {
          this.addDaGang = false
          // 清空大纲内容
          this.form.name = ''
          // 更新左侧大纲列表
          dgList({ coursrId: this.$route.query.courseId }).then(res => {
            if (res.code == 0) {
              this.dgArr = res.result
              for (let index = 0; index < res.result.length; index++) {
                this.dgArr[index].number = this.numTransform(index)
              }
              if (res.result.length == 1) {
                sessionStorage.setItem('dgId', res.result[0].id)
              }
              this.hideenShow = true
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
    cancels() {
      this.editDaGang = false
      // 清空大纲内容
      this.form.name = ''
    },
    editdgsuer() {
      // 编辑大纲
      editGg({
        outlineName: this.form.name,
        id: this.bjdgId,
        modifier: this.userId
      }).then(res => {
        if (parseInt(res.code) == 0) {
          // 更新左侧大纲列表
          dgList({ coursrId: this.$route.query.courseId }).then(res => {
            // 清空大纲内容
            this.form.name = ''
            this.dgArr = res.result
            for (let index = 0; index < res.result.length; index++) {
              this.dgArr[index].number = this.numTransform(index)
            }
            this.editDaGang = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    sxtast() {
      // 实训任务子组件回调
      this.outerVisible = false
      this.init(this.clickIndex)
    },
    looksxtast() {
      // 查看
      this.lookouterVisible = false
    },
    revissxtast() {
      // 修改
      this.init(this.clickIndex)
      this.reviseouterVisible = false
    },
    leave() {
      this.hoverContent = '999'
    },
    enter(val) {
      this.hoverContent = val
    },
    bianji(item) {
      // 编辑
      this.editDaGang = true
      this.form.name = item.outlineName
      this.bjdgId = item.id
    },
    delDg(val) {
      // 删除
      this.$confirm('此操作将永久删除该大纲模块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        // 删除
        delGg({ id: val }).then(res => {
          if (res.code == 0) {
            this.init(this.clickIndex)
          } else {
            this.$message({
              type: 'warning',
              message: '大纲所属课程已被使用，不允许被删除'
            })
          }
        })
      })
      .catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    onDragStart(event) {
      this.draging = event.target
    },
    onDragOver(event) {
      this.target = event.target
      const targetTop = event.target.getBoundingClientRect().top
      const dragingTop = this.draging.getBoundingClientRect().top
      if (this.target.nodeName === 'LI' && this.target !== this.draging) {
        if (this.target) {
          if (this.target.animated) {
            return
          }
        }
        if (this._index(this.draging) < this._index(this.target)) {
          this.target.parentNode.insertBefore(
            this.draging,
            this.target.nextSibling
          )
        } else {
          this.target.parentNode.insertBefore(this.draging, this.target)
        }
        this._anim(targetTop, this.target)
        this._anim(dragingTop, this.draging)
      }
    },
    _anim(startPos, dom) {
      const offset = startPos - dom.getBoundingClientRect().top
      dom.style.transition = 'none'
      dom.style.transform = `translateY(${offset}px)`
      // 触发重绘
      // eslint-disable-next-line no-unused-expressions
      dom.offsetWidth
      dom.style.transition = 'transform .3s'
      dom.style.transform = ''
      clearTimeout(dom.animated)
      dom.animated = setTimeout(() => {
        dom.style.transition = ''
        dom.style.transform = ''
        dom.animated = false
      }, 300)
    },
    onDragEnd(event) {
      const currentNodes = Array.from(this.$refs.parentNode.childNodes)
      const data = currentNodes.map(item => {
        return JSON.parse(item.dataset.item)
      })
      outlineSort({ id: this.$route.query.courseId, outlineDTO: data }).then(res => {
        if (res.code === '0') {

        } else {
          this.$message({
            message: '排序出错',
            type: 'warning'
          })
        }
      })
    },
    _index(el) {
      const domData = Array.from(this.$refs.parentNode.childNodes)
      return domData.findIndex(i => i.innerText == el.innerText)
    },
    // 拖拽排序
    dragSetTableSort() {
      const el = this.$refs.drapTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        animation: 180,
        delay: 0,
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const tragetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, tragetRow)
          const temp = {
            id: localStorage.getItem('outlineId'),
            taskDTOList: this.tableData
          }
          dragSortTable(temp).then((res) => {
            if (res.code === '0') {

            } else {
              this.$message({
                message: '排序出错',
                type: 'warning'
              })
            }
          })
        }
      })
    },
    zsdyzwj() {
      const that = this
      this.innerVisibleZs = true
      // 清空table选中的数据
      if (this.newArr.length > 0) {
        // this.$refs.multipleTable.clearSelection()
      }
      zywj({
        page: '1',
        size: '10',
        keyWrods: '',
        taskId: this.gxhzyTaskId,
        type: '3'
      }).then(res => {
        this.gxhArr = res.result ? res.result.data : []
        this.pagTotal = parseInt(res.result.total)
        this.$nextTick(function() {
          that.zywjArr.forEach(item => {
            that.gxhArr.forEach(self => {
              if (item.resId == self.resId || item.id == self.id) {
                that.$refs.multipleTable.toggleRowSelection(that.gxhArr[that.gxhArr.indexOf(self)], true)
              }
            })
          })
        })
      })
    },
    monitorPagin(item) {
      const that = this
      // 分页组件
      this.pageParamsGxh = item.page
      zywj({
        page: item.page,
        size: item.limit,
        keyWrods: this.searckKey,
        taskId: this.gxhzyTaskId,
        type: '3'
      }).then(res => {
        this.gxhArr = res.result.data
        this.pagTotal = parseInt(res.result.total)
        that.zywjArr.forEach(item => {
          that.gxhArr.forEach(self => {
            if (item.resId == self.resId || item.id == self.id) {
              that.$refs.multipleTable.toggleRowSelection(that.gxhArr[that.gxhArr.indexOf(self)], true)
            }
          })
        })
      })
    },
    individuation(item) {
      // 更新个性化资源数组
      this.gxhzyTaskId = item.id
      this.gxhFc()
      // 个性化资源
      this.gxhFile = true
    },
    gxhFc() {
      // 个性化数组
      this.arrRadion = []
      this.zywjArr = []
      fileInfo({
        taskId: this.gxhzyTaskId
      }).then(res => {
        if (res.code == 0 || res.code == '0') {
          // 允许下载
          this.$nextTick(function() {
            for (let index = 0; index < res.result.length; index++) {
              this.arrRadion.push({ down: res.result[index].isAllow == '0' || res.result[index].isAllow == 'true' })
            }
            this.zywjArr = res.result
            console.log(this.arrRadion)
            console.log(this.zywjArr)
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    qxGxh() {
      this.searckKey = ''
      this.innerVisibleZs = false
      this.numberFile = 0
    },
    // 数组去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.resId) && res.set(arr.resId, 1))
    },
    sureQ() {
      const resIds = []
      this.arrRadion = []
      this.searckKey = ''
      // 文件个数置为0
      this.numberFile = 0
      // 组合一个新的个性化资源数组 并去重
      // 原数组 this.zywjArr  新数组 this.newArr
      this.zywjArr = this.unique(this.zywjArr.concat(this.newArr))
      for (let index = 0; index < this.zywjArr.length; index++) {
        this.arrRadion.push({ down: this.zywjArr[index].isAllow == '0' || this.zywjArr[index].isAllow == 'true' })
      }
      this.innerVisibleZs = false
      // for (let index = 0; index < this.newArr.length; index++) {
      //   resIds.push({ resId: this.newArr[index].resId, isAllow: '0' })
      // }
      // personaupdate({
      //   taskId: this.gxhzyTaskId,
      //   personalizeVOS: JSON.parse(JSON.stringify(resIds))
      // }).then(res => {
      //   if (res.code == '0' || res.code == 0) {
      //     this.searckKey = ''
      //     this.innerVisibleZs = false
      //     // 文件个数置为0
      //     this.numberFile = 0
      //     // 个性化数组
      //     this.gxhFc()
      //   } else {
      //     this.$message({
      //       type: 'warning',
      //       message: res.message
      //     })
      //   }
      // })
    },
    searchContent(val) {
      // 搜索内容
      this.pageParamsGxh = 1
      zywj({
        page: '1',
        size: '10',
        keyWrods: this.searckKey,
        type: '3',
        taskId: this.gxhzyTaskId
      }).then(res => {
        if (res.code == 0 || res.code == '0') {
          this.gxhArr = res.result ? res.result.data : ''
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
      // 已选择文件数目
      this.numberFile = val.length
      this.newArr = val
    },
    isShowPrevFileClose() {
      // 关闭预览文件
      this.isShowPrevFile = false
    },
    gxhsuer() {
      // 数组对象 {resId: "717352525719924736", isAllow: "true"}
      const gxhszArr = []
      for (let index = 0; index < this.zywjArr.length; index++) {
        gxhszArr.push({
          resId: this.zywjArr[index].resId,
          isAllow: (this.zywjArr[index].isAllow == 'true' || this.zywjArr[index].isAllow == '0') ? '0' : '1'
        })
      }
      // 更新个性化资源文件状态
      personaupdate({
        taskId: this.gxhzyTaskId,
        personalizeVOS: gxhszArr
      }).then(res => {
        if (res.code == '0' || res.code == 0) {
          this.gxhFile = false
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          // 成功之后数组清空
          this.zywjArr = []
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
    gxhDelete(index, row) {
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.splice(index, 1)
        this.arrRadion = []
        for (let index = 0; index < row.length; index++) {
          this.arrRadion.push({ down: row[index].isAllow })
        }
        // 删除
        // delFiles({
        //   taskId: this.gxhzyTaskId,
        //   fileId: item.resId,
        //   type: 3
        // }).then(res => {
        //   if (res.code == 0) {
        //     this.$message({
        //       message: '已删除!',
        //       type: 'success'
        //     })
        //     this.gxhFc()
        //   } else {
        //     this.$message({
        //       message: res.message,
        //       type: 'warning'
        //     })
        //   }
        // })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.checkFile{
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
  .zsdxzrw{
    margin: 0;
    margin-right: 20px;
    width: 98px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
}
.el-radio{
  margin-right: 5px !important;
}
.grayclick{
  color: #c7c7c7 !important;
}
.Determine{
  background: #414d65;
}
.tableScoll{
  max-height: 450px;
  overflow-y: scroll;
}
.app-container {
  display: flex;
  flex-wrap: wrap;
  .back {
    width: 100%;
    a {
      .backlist {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(145, 145, 145, 1);
        line-height: 22px;
        margin-left: 6px;
      }
    }
  }
  .kccontent {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    margin-top: 20px;
    .contentLeft {
      width: 400px;
      // display: flex;
      justify-content: center;
      flex-wrap: wrap;
      overflow: auto;
      ul {
        width: 100%;
        list-style: none;
        padding: 0;
        margin: 0;
        .colorBg {
          background: #c7c7c7;
        }
        li {
          width: 100%;
          height: 45px;
          padding: 0;
          display: flex;
          align-items: center;
          padding: 0 90px 0 20px;
          color: black;
          background: white;
          cursor: pointer;
          position: relative;
          span {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: white;
            margin-right: 10px;
          }
          p {
            width: 250px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .operationDg {
            position: absolute;
            right: 0;
            height: 45px;
            line-height: 45px;
            z-index: 999;
            div {
              display: inline-block;
              padding: 0 10px;
            }
          }
        }
        li:hover {
          background: #c7c7c7;
        }
        .colorItem {
          background: #414d65;
          color: white;
        }
        .colorItem:hover {
          background: #414d65;
        }
      }
      .adddagang {
        width: 195px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px -1px 0px 0px rgba(205, 210, 228, 1),
          1px 0px 0px 0px rgba(235, 238, 250, 1);
        border-radius: 2px;
        border: 1px solid rgba(221, 221, 221, 1);
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 35px;
      }
    }
    .contentRight {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      .rightTitle {
        width: 141px;
        height: 32px;
        background: rgba(65, 77, 101, 1);
        border-radius: 5px;
        line-height: 32px;
        color: white;
        text-align: center;
        float: right;
        cursor: pointer;
      }
      .case-table {
        margin-top: 60px;
        height: calc(100% - 60px);
        .el-link.el-link--warning {
          margin: 0 5px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-table tbody .sortable-ghost {
  td{
    /*#EBEEF5  */
    border: 1px #EBEEF5 solid;
    background: #F5F7FA;
  }
}
</style>
