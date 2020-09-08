<template>
  <div class="app-container my-team-page-main">
    <!-- 我的团队头部 -->
    <div class="my-team-header">
      <div class="team-inner">
        <div class="team-intro">
          <div class="my-team">我的团队</div>
          <!-- <div class="text-underline"></div> -->
          <!-- <div class="my-team-intro">教学管理教学管理教学管理教学管理教学管理</div> -->
        </div>
        <img class="team-img" src="./images/team-img.png" alt />
      </div>
    </div>
    <!-- isLeader=0 有团队不是组长
      isLeader=1 有团队是组长
      isLeader=2 没有团队
      isLeader=3 报错
      status=1 申请中
      status=0 被拒绝
      status没有值 没有申请过
    -->
    <!-- <div class="my-team-page-content" v-show="(isLeader === 0 || 1) && studentList.length > 0"> -->
    <div class="my-team-page-content">
      <!-- 组长查看申请人员  isLeader===1 是组长 -->
      <div class="leader-view-apply" v-show="isLeader === 1 && applyList.length > 0">
        <h1 class="common-title-css">申请人员</h1>
        <ul>
          <li v-for="(item, index) in applyList" :key="index" class="apply-li">
            <div class="box">
              <div class="apply-bar">申请加入</div>
              <div class="img">
                <img v-if="item.photo" :src="item.photo" alt />
                <img v-else src="../../common/images/avatar.jpg" alt />
                <!-- <div v-else class='default-img'></div> -->
                <!-- <div v-else class='default-img' :style="{'background-position-x': (Math.ceil(Math.random()*8) === 1 && '0px') || (Math.ceil(Math.random()*8) === 2 && '-80px') || (Math.ceil(Math.random()*8) === 3 && '-160px') || (Math.ceil(Math.random()*8) === 4 && '-240px') || (Math.ceil(Math.random()*8) === 5 && '-320px') || (Math.ceil(Math.random()*8) === 6 && '-400px') || (Math.ceil(Math.random()*8) === 7 && '-480px') || (Math.ceil(Math.random()*8) === 8 && '-560px') }"></div> -->
              </div>
              <div class="zuzhangName">
                <p class="name" style="text-align:center">{{ item.name }}</p>
              </div>
              <div class="requestJoin">
                <div class="agree" @click="leaderAgree(item.classId, item.teamId, item.userId)">通过申请</div>
                <div
                  class="jvjue"
                  @click="leaderRefuse(item.classId, item.teamId, item.userId)"
                >拒绝申请</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 申请加入团队列表, isLeader=2 没有团队; requestList.length 有可申请的团队 展示该列表-->
      <div class="apply-join-team" v-show="isLeader === 2 && requestList.length > 0">
        <h1 class="common-title-css">申请加入团队</h1>
        <ul>
          <li v-for="(item, index) in requestList" :key="index">
            <p class="teamName">{{ item.teamName }}</p>
            <div
              class="box"
              :class="(!noClicking) ? (item.status === 1 ? 'color-orange' : 'color-green') : (item.status === 1 ? 'color-orange' : 'color-gary')"
            >
              <div
                class="zuZhang"
                :class="(!noClicking) ? (item.status === 1 ? 'color-orange' : 'color-green') : (item.status === 1 ? 'color-orange' : 'color-gary')"
              >组长</div>
              <div class="img">
                <img v-if="item.photo" :src="item.photo" alt />
                <img v-else src="../../common/images/avatar.jpg" alt />
                <!-- <div v-else class='default-img'></div> -->
              </div>
              <div class="leader-name">{{ item.name }}</div>
              <template v-if="!noClicking">
                <div
                  v-if="item.status === undefined || item.status === 0"
                  class="requestJoin"
                  @click="studentRelteamapply(item.leaderId,item.classId,item.teamId)"
                >申请加入</div>
                <div v-else-if="item.status === 1" class="color-orange">已申请</div>
              </template>
              <template v-else>
                <div v-if="item.status === 1" class="requestJoin color-orange">已申请</div>
                <div v-else class="unableApply requestJoin" title="一次只能申请加入一个团队">无法申请</div>
              </template>
            </div>
          </li>
        </ul>
      </div>
      <!-- 团队列表 -->
      <div class="teamList" v-show="(isLeader === 0 || 1) && studentList.length > 0">
        <p>
          {{ teamName }}
          <i class="iconfont" @click="updataTeamName()" v-if="isLeader === 1">&#xe639;</i>
        </p>
        <ul>
          <li
            v-for="(item, index) in studentList"
            :key="index"
            :class="item.userId === userId ? (index===0 ? 'orange-bg' : 'green-bj') : ''"
          >
            <div :class="index === 0 ? 'zuZhang' : ''">{{ index === 0 ? "组长" : "组员" }}</div>
            <img v-if="item.photo" :src="item.photo" alt />
            <img v-else src="../../common/images/avatar.jpg" alt />
            <!-- <div v-else class='default-img'></div> -->
            <div class="group">{{ item.name }}</div>
            <div class="progress" @click="clickProgress(item)">查看任务进度</div>
          </li>
        </ul>
      </div>
      <div
        class="space-sex"
        v-show="(isLeader === 0 || 1) && (studentList.length > 0 || applyList.length)"
      ></div>
      <!-- 团队空间 -->
      <div class="teamSpace" v-if="(isLeader === 0 || 1) && studentList.length > 0">
        <div class="space">
          <div>
            <span class="chain-space">团队空间</span>
            <span class="english-space">TEAM SPACE</span>
          </div>
          <div class="right-input">
            <div class="search-box">
              <input
                type="text"
                @keyup.enter="searchKeyWords"
                placeholder="输入搜索关键词"
                v-model="searchTerm"
              />
              <div class="search-btn" @click="searchKeyWords">搜索</div>
            </div>
            <el-upload
              action="#"
              :show-file-list="false"
              :http-request="uploadFile"
              :before-upload="beforeUpload"
              :accept="updayaType"
            >
              <div class="upload">
                <img src="./images/pubDocument.png" alt />上传文件
              </div>
            </el-upload>
          </div>
        </div>
        <ul class="tdkj-ul" v-show="teamFileList.length > 0">
          <li ref="lis" v-for="(item, index) in teamFileList" :key="index">
            <img v-if="item.resType === 'PIC'" src="./images/img.png" />
            <img v-else-if="item.resType === 'EXCEL'" src="./images/excel.png" />
            <img v-else-if="item.resType === 'PDF'" src="./images/pdf.png" />
            <img v-else-if="item.resType === 'PPT'" src="./images/ppt.png" />
            <img v-else-if="item.resType === 'TXT'" src="./images/txt.png" />
            <img v-else-if="item.resType === 'WORD'" src="./images/word.png" />
            <img v-else-if="item.resType === 'MP3'" src="./images/audio.png" />
            <img v-else-if="item.resType === 'VIDEO'" src="./images/video.png" />
            <img v-else-if="item.resType === 'AUTOWORK'" src="./images/autowork.png" />
            <img v-else-if="item.resType === 'EXE'" src="./images/exe.png" />
            <img v-else-if="item.resType === 'SQL'" src="./images/sql.png" />
            <img v-else-if="item.resType === 'PY'" src="./images/py.png" />
            <img v-else-if="item.resType === 'PBIX'" src="./images/pbix.png" />
            <div class="tdkj-ul-li-content">
              <!-- 文件名称 -->
              <!-- <el-tooltip effect="dark" :content="item.resName" placement="top"> -->
              <div class="pd_2">{{ item.resName }}</div>
              <!-- </el-tooltip> -->
              <!-- 查看下载数量 -->
              <div class="pd_3">
                <span>查看: {{ item.preNum }}</span>
                <span>下载: {{ item.downloadNum }}</span>
              </div>
              <!-- 查看下载删除按钮 -->
              <div class="pd_4">
                <span
                  class="del-res"
                  v-if="item.creator === userId || isLeader === 1"
                  size="mini"
                  type="danger"
                  @click="deleteRes(item)"
                >删除</span>
                <el-button
                  size="mini"
                  type="info"
                  @click="CKData(item)"
                  class="fixed-right-view"
                  v-show="
                    !(
                      item.resType === 'EXE' ||
                      item.resType === 'AUTOWORK' ||
                      item.resType === 'SQL' ||
                      item.resType === 'PY' ||
                      item.resType === 'PBIX'
                    )
                  "
                >查看</el-button>
                <el-button size="mini" type="info" @click="download(item)" class="fixed-right">下载</el-button>
              </div>
            </div>
            <div v-if="item.creator === userId">
              <div class="myDir"></div>
              <div class="myText">我的</div>
            </div>
          </li>
        </ul>
        <div class="ziyuannodata" v-show="!(teamFileList.length > 0)">
          <img src="./images/myteamNodata.png" alt />
          <div class="nodata-title">暂无内容，点击上传文件新增内容~</div>
        </div>
        <pagin
          :total="pageTatal"
          :pageSizes="[12, 24, 48, 96]"
          @pagination="monitorPagin"
          :limit="tableSize"
          :page="tablePage"
          v-show="pageTatal > 12"
        ></pagin>
      </div>
      <!-- 暂无数据 -->
      <div class="nodata" v-show="isLeader === 3 || (isLeader === 2 && requestList.length === 0)">
        <img src="./images/myteamNodata.png" alt />
        <div class="nodata-title">暂无数据~</div>
      </div>
    </div>
    <!-- 点击查看任务进入弹框 -->
    <viewTaskProgress
      @viewProgressClose="viewProgressClose"
      v-if="viewProgressShow"
      :tableData="tableData"
    ></viewTaskProgress>
    <!-- 修改团队名称弹框 -->
    <updateTeamName :teamId="teamId" @closeDia="updateTeamNameClose" v-if="inputShow"></updateTeamName>

    <!-- 上传进度条 -->
    <showProgress
      v-show="progressIsshow"
      :percentageNum="percentageNum"
      :fileInfo="fileInfo"
      @closeProg="progressClose"
    ></showProgress>
    <showPrevFile
      :previewData="previewData"
      @closePreview="isShowPrevFileClose"
      v-if="isShowPrevFile"
    ></showPrevFile>
  </div>
</template>

<script>
/* eslint-disable */
import updateTeamName from "./component/updateTeamName";
import showProgress from "./component/showProgress";
import showPrevFile from "@/components/showPrevFile/index";
import viewTaskProgress from "./component/viewTaskProgress";
import {
  teamList,
  teamidandisleader,
  saveTeamRes,
  teamResList,
  wjUp,
  deleteTeamRes,
  queryprogress,
  xzfilie,
  ylfilieNum,
  xzfilieNum,
  queryTeamApply,
  queryClassTeamLeader,
  studentRelteamapply,
  leaderAgree,
  leaderRefuse,
  longConnection,
} from "@/api/myTeam";
import { cos } from "@/common/js/cos";
import { getFileType, downloadByBlob } from "@/common/js/tools";
import pagin from "@/components/pagination";
import { _debounce } from "@/common/js/utils.js";
import { mapGetters } from "vuex";
// import { createSocket, sendWspush } from '@/common/js/socket'
// createSocket()

export default {
  name: "index",
  components: {
    viewTaskProgress,
    showPrevFile,
    showProgress,
    updateTeamName,
    pagin,
  },
  data() {
    return {
      noClicking: false, // 判断当前是否有人申请加入团队，false代表没有
      previewData: {}, // 存储Url
      pageTatal: 0, // 数据总条数
      userId: "", // 用户id
      teamId: "", // 团队id
      studentList: [], // 学生列表
      teamFileList: [], // 团队文件列表
      teamName: "", // 团队名称
      isLeader: false, // 是否是组长
      searchTerm: "", // 搜索词
      tableSize: 12,
      tablePage: 1,
      oldSearchTerm: "", // 老的搜索词
      viewProgressShow: false, // 是否关闭进度弹框
      inputShow: false, // 是否关闭修改团队名称弹框
      tableData: [],
      resType: "", // 文件类型
      isZiyuankongkong: true, // 资源是否为空
      progressIsshow: false, // 进度条弹框是否显示
      isShowPrevFile: false, // 预览弹框
      fileInfo: [],
      requestList: [], // 申请列表
      applyList: [], // 组长查看申请列表
      percentageNum: 0, // 上传进度的百分数
      websock: null,
      jsonParams: {},
      updayaType:
        ".mp4,.rmvb,.avi,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.jpg,.gif,.png,.jpeg,.pdf,.mp3,.exe,.autowork,.sql,.py,.pbix",
    };
  },
  computed: {
    ...mapGetters(["userName"]),
    // styleObject(){
    //   let randomNum = (Math.ceil(Math.random()*8) - 1) * 80 + 'px'
    //   console.log(randomNum)
    //   return {
    //     "background-position-x": randomNum
    //   }
    // }
  },
  watch: {
    // searchTerm(newVal) {
    //   const that = this;
    //   this.realTimeSearch(newVal, that);
    // }
  },
  created() {
    // console.log(this.userName)
  },
  methods: {
    // 组长获取申请加入团队的人员信息
    async queryTeamApply() {
      const res = await queryTeamApply({
        classId: localStorage.getItem("classId"),
        teamId: localStorage.getItem("teamId"),
        userId: localStorage.getItem("userId"),
      });
      // console.log('组长获取申请加入团队的人员信息', res)
      if (res.code === "0") {
        this.applyList = res.result;
      }
    },
    // 未加入团队获取团队相关信息
    async queryClassTeamLeader() {
      const res = await queryClassTeamLeader({
        classId: localStorage.getItem("classId"),
        userId: localStorage.getItem("userId"),
      });
      // console.log('未加入团队获取团队相关信息', res)
      if (res.code === "0") {
        this.requestList = res.result;
        console.log(this.requestList);
        this.noClicking = this.requestList.some((item) => {
          return item.status === 1;
        });
      }
    },
    // 学生申请加入团队
    studentRelteamapply(leaderId, classId, teamId) {
      this.$confirm("确定加入该团队吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--medium",
        cancelButtonClass: "el-button--medium",
        type: "success",
      })
        .then(async () => {
          const res = await studentRelteamapply({
            classId: classId,
            teamId: teamId,
            userId: localStorage.getItem("userId"),
            leaderId: leaderId,
          });
          if (res.code === "0") {
            this.$message.success(res.message);
            this.queryClassTeamLeader();
            // this.initWebSocket()
            // this.createSocket()
            // setTimeout(() => {
            const msg = {
              classId: classId,
              teamId: teamId,
              msg: `${this.userName}申请加入团队`,
            };
            // receiverId为接收人id，也就是组长id
            const actions = {
              type: "com",
              messageType: "applyTeam",
              receiverId: leaderId,
              sessionType: "p2p",
              content: msg,
            };
            this.sendWspush(actions);
            // }, 2000)
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {});
    },
    // 组长同意申请
    leaderAgree(classId, teamId, userId) {
      this.$confirm("确定同意吗？", "通知", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--medium",
        cancelButtonClass: "el-button--medium",
        type: "success",
      })
        .then(async () => {
          const res = await leaderAgree({
            classId: classId,
            teamId: teamId,
            userId: userId,
          });
          // console.log('组长同意申请', res)
          if (res.code === "0") {
            const msg = {
              classId: classId,
              teamId: teamId,
              msg: `${this.userName}同意了你的申请`,
            };
            // receiverId为接收人id，也就是组员id
            const actions = {
              type: "com",
              messageType: "agreeTeam",
              receiverId: userId,
              sessionType: "p2p",
              content: msg,
            };
            this.sendWspush(actions);
            this.queryTeamApply();
            this.queryTeamList();
          }
        })
        .catch(() => {});
    },
    // 组长拒绝申请
    leaderRefuse(classId, teamId, userId) {
      this.$confirm("确定拒绝吗？", "通知", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--medium",
        cancelButtonClass: "el-button--medium",
        type: "success",
      })
        .then(async () => {
          const res = await leaderRefuse({
            classId: classId,
            teamId: teamId,
            userId: userId,
          });
          // console.log('组长拒绝申请', res)
          if (res.code === "0") {
            const msg = {
              classId: classId,
              teamId: teamId,
              msg: `${this.userName}拒绝了你的申请`,
            };
            // receiverId为接收人id，也就是组员id
            const actions = {
              type: "com",
              messageType: "refuseTeam",
              receiverId: userId,
              sessionType: "p2p",
              content: msg,
            };
            this.sendWspush(actions);
            this.queryTeamApply();
          }
        })
        .catch(() => {});
    },
    // 实时搜索并防抖
    realTimeSearch: _debounce((val, that) => {
      that.queryTeamResList(val);
    }, 1000),
    // 分页触发的方法
    monitorPagin(obj) {
      if (obj.limit !== this.tableSize) {
        this.tablePage = 1;
        this.tableSize = obj.limit;
        this.queryTeamResList(this.search, this.tablePage, this.tableSize);
        return;
      }
      this.tableSize = obj.limit;
      this.tablePage = obj.page;
      this.queryTeamResList(this.search, this.tablePage, this.tableSize);
    },
    // 查询团队列表
    async queryTeamList() {
      const res = await teamList({
        classId: localStorage.getItem("classId"),
        teamId: localStorage.getItem("teamId"),
        page: 1,
        size: 10000,
      });
      if (res.code === "0") {
        this.studentList = res.result.data;
      } else {
        this.$message.warning(res.message);
      }
    },
    // 学生进入班级获取teamId、teamName、是否是组长
    async getTeamName() {
      this.userId = localStorage.getItem("userId"); // 备份用户id
      const res = await teamidandisleader({
        userId: this.userId || localStorage.getItem("userId"),
        classId: localStorage.getItem("classId"),
      });
      if (res.code === "0") {
        this.teamName = res.result.teamName;
        this.isLeader = res.result.isleader;
        this.teamId = res.result.teamId;
        localStorage.setItem("teamId", res.result.teamId);
        this.queryTeamList(); // 查询团队列表
        this.queryTeamResList(); // 获取团队资源列表
        if (this.isLeader === 1) {
          this.queryTeamApply();
        }
      } else if (res.code === "101" && res.message === "未查询到团队") {
        this.isLeader = 2;
        this.queryClassTeamLeader();
      } else {
        this.isLeader = 3;
        this.$message.warning(res.message);
      }
    },
    // 修改团队名称
    updataTeamName() {
      // this.$store.commit('setHeight', false)
      this.inputShow = true;
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: rgba(250,252,254,1);color: #333;font-weight: 600;border-right-color:transparent;";
      }
    },
    // 修改 table cell边框的背景色
    tableCellStyle() {
      return "border-color:rgba(237,237,237,1);border-right-color:transparent";
    },
    // 查看进度
    async clickProgress(item) {
      this.viewProgressShow = true;
      const res = await queryprogress({
        classId: item.classId,
        userId: item.userId,
      });
      // console.log(res)
      if (res.code === "0") {
        this.tableData = res.result;
      } else {
        this.$message.warning(res.message);
      }
    },
    // 关闭进度
    viewProgressClose() {
      this.viewProgressShow = false;
    },
    // 关闭修改团队名称弹框
    updateTeamNameClose(type, name) {
      this.inputShow = false;
      if (type) {
        this.teamName = name;
      }
    },
    // 关闭进度条弹框弹框
    progressClose() {
      this.fileInfo = [];
      this.progressIsshow = false;
      this.percentageNum = 0;
    },
    isShowPrevFileClose() {
      this.isShowPrevFile = false;
    },
    // 按下回车搜索
    searchKeyWords() {
      // 如果新的搜索词和上一次搜索的一样，直接return
      if (this.searchTerm === this.oldSearchTerm) {
        return;
      }
      // 新的搜索词和上次不一样，执行搜索功能
      this.queryTeamResList(this.searchTerm);
      // 然后将这次的搜索词赋给老的搜索词
      this.oldSearchTerm = this.searchTerm;
    },
    // 上传之前
    beforeUpload(e) {
      const extension = e.name.split(".").pop();
      if (
        !"mp4/rmvb/avi/ppt/pptx/doc/docx/xls/xlsx/txt/jpg/gif/png/jpeg/pdf/mp3/exe/autowork/sql/py/pbix".includes(
          extension
        )
      ) {
        this.$message.warning("请上传正确的格式类型");
        return false;
      }
      if ("/exe/autowork/sql/py/pbix".includes(extension)) {
        // 如果是这三个文件不限制大小
        return true;
      }
      if ("mp4/rmvb/avi".includes(extension) && e.size < 100 * 1024 * 1024) {
        return true;
      } else if (
        "ppt/pptx/doc/docx/xls/xlsx/txt/jpg/gif/png/jpeg/pdf/mp3/exe/autowork/py/pbix".includes(
          extension
        ) &&
        e.size < 20 * 1024 * 1024
      ) {
        return true;
      } else {
        if ("mp4/rmvb/avi".includes(extension)) {
          this.$message.warning("文件最大不能超过 100MB！");
        } else {
          this.$message.warning("除mp4、rmvb、avi文件外，文件不能超过 20MB！");
        }
        return false;
      }
    },
    // 上传团队资源
    async uploadFile(e) {
      const _this = this;
      // 获取文件类型
      const wjType = e.file.name.split(".").pop();
      this.resType = getFileType(wjType);
      this.fileInfo.push({ name: e.file.name, type: this.resType });
      this.progressIsshow = true;
      // 获取上传文件地址
      const self = this;
      const url = await cos(e, self, "percentageNum", function (cb) {
        // _this.percentageNum = cb.percent * 100
        _this.percentageNum = parseInt(cb.percent * 100);
      });
      // 资源上传
      const res = await wjUp({
        resName: e.file.name,
        downloadUrl: url,
        resType: this.resType,
        resExt: wjType,
        resSize: e.file.size,
        creator: this.userId,
      });
      if (res.code === "0") {
        this.saveTeamRes(res.result); // res.result 就是资源id
      }
    },
    // 将资源文件存到数据库
    async saveTeamRes(resId) {
      const res = await saveTeamRes({
        resId,
        teamId: this.teamId || localStorage.getItem("teamId"),
        classId: localStorage.getItem("classId"),
      });
      if (res.code === "0") {
        // this.$message.success(res.message)
        this.queryTeamResList();
      } else {
        this.$message.warning(res.message);
      }
    },
    // 查看资源列表
    async queryTeamResList(keyWrods, page, size) {
      const res = await teamResList({
        page: page || 1,
        size: size || 12,
        classId: localStorage.getItem("classId"),
        teamId: this.teamId || localStorage.getItem("teamId"),
        keyWrods: keyWrods || "",
      });
      if (res.code === "0") {
        this.teamFileList = res.result.data;
        this.pageTatal = +res.result.total;
        if (this.teamFileList.length === 0) {
          this.isZiyuankongkong = false;
        } else {
          this.isZiyuankongkong = true;
        }
      } else {
        this.$message.warning(res.message);
      }
    },
    // 查看资源
    async CKData(item) {
      // 预览次数
      ylfilieNum({ pubResId: item.id }).then((res) => {
        if (res.code == 0) {
          this.queryTeamResList();
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
      this.previewData = {
        imgUrl: "",
        resExt: item.resExt,
      };
      if (
        item.resType === "EXCEL" ||
        item.resType == "PPT" ||
        item.resType == "TXT" ||
        item.resType == "WORD"
      ) {
        this.previewData.imgUrl = item.converUrl;
      } else {
        this.previewData.imgUrl = item.downloadUrl;
      }
      this.isShowPrevFile = true;
    },
    // 下载资源
    async download(item) {
      // 下载次数
      xzfilieNum({ pubResId: item.id }).then((res) => {
        if (res.code == 0) {
          this.queryTeamResList();
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
      xzfilie(item.downloadUrl).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", item.resName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 删除资源
    deleteRes(item) {
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteTeamRes({
            resId: item.id,
          });
          if (res.code === "0") {
            this.$message.success("删除成功");
            this.queryTeamResList();
          } else {
            this.$message.warning("删除失败，请重试！");
          }
        })
        .catch(() => {});
    },
    // // 是否长连接
    async longConnection() {
      const res = await longConnection({
        classId: localStorage.getItem("classId"),
        teamId: localStorage.getItem("teamId"),
      });
      if (res.code === "0") {
        this.createSocket();
      }
    },
  },
  mounted() {
    this.getTeamName(); // 获取团队名称 teamID
    // this.longConnection() // 是否需要长连接
  },
};
</script>
<style scoped lang="scss">
i,
em {
  font-style: normal;
}

.my-team-page-main {
  width: 1600px;
  min-width: 1200px;
  margin: 0 auto;
  // overflow: hidden;
  min-height: -webkit-fill-available;
  background-color: transparent;
  // 我的团队头部
  .my-team-header {
    width: 100%;
    height: 357px;
    border-radius: 12px;
    // padding-top: 30px;
    background-image: linear-gradient(
      to right,
      rgb(64, 212, 112),
      rgb(113, 215, 102)
    );
    display: float;
    overflow: hidden;
    .team-inner {
      width: 1200px;
      margin: 0 auto;
    }
    .team-intro {
      float: left;
      width: 500px;
      height: 357px;
      padding-top: 87px;
      color: #fff;
      .my-team {
        font-size: 30px;
        font-weight: 500;
        line-height: 48px;
      }
      .text-underline {
        width: 40px;
        height: 5px;
        background: rgba(255, 194, 163, 1);
        border-radius: 3px;
        margin: 20px 0 16px;
      }
      .my-team-intro {
        height: 21px;
        font-size: 15px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 21px;
      }
    }
    .team-img {
      float: right;
      width: 629px;
      height: 462px;
      margin-top: -22px;
      margin-right: -20px;
    }
  }
  .my-team-page-content {
    background-color: #fff;
    width: 1200px;
    position: relative;
    margin: -150px auto 0;
    border-radius: 12px;
    overflow: hidden;
    // 组长查看申请人员
    .leader-view-apply {
      margin-top: 36px;
      padding-left: 40px;
      overflow: hidden;
      background-color: #fff;
      ul {
        height: 175px;
        display: float;
        .apply-li {
          &:hover {
            background: rgba(64, 211, 111, 0.1);
          }
          cursor: pointer;
          overflow: hidden;
          float: left;
          position: relative;
          width: 160px;
          height: 220px;
          // background:rgba(64,211,111,0.05);
          margin-right: 32px;
          margin-bottom: 16px;
          box-shadow: 0px 10px 20px 0px rgba(64, 211, 111, 0.11);
          border-radius: 8px;
          border: 1px solid rgba(64, 211, 111, 1);
          .apply-bar {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 67px;
            height: 27px;
            color: #fff;
            line-height: 27px;
            text-align: center;
            margin-bottom: 7px;
            border-radius: 0px 0 8px 0;
            // background:rgba(255,157,107,1);
            background: rgba(64, 211, 111, 1);
          }
          img,
          .default-img {
            display: block;
            margin: 34px auto 0;
            width: 72px;
            height: 72px;
            border-radius: 50%;
          }
          .default-img {
            background: url("../../common/images/default_sprit.png") no-repeat;
            background-position: 0 -410px;
          }
          .zuzhangName {
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin: 17px 0 21px;
          }
          .requestJoin {
            display: flex;
            justify-content: center;
            width: 100%;
            color: #fff;
            text-align: center;
            line-height: 28px;
            position: absolute;
            cursor: pointer;
            font-size: 12px;
            .agree {
              width: 70px;
              height: 28px;
              margin: 0 5px;
              border-radius: 14px;
              background-color: rgba(64, 211, 111, 1);
            }
            .jvjue {
              width: 70px;
              height: 28px;
              margin: 0 5px 0 0;
              border-radius: 14px;
              background-color: rgba(255, 157, 107, 1);
            }
          }
          .unableApply {
            background-color: rgba(0, 0, 0, 0.8);
          }
        }
      }
    }
    // 组员申请加入团队
    .apply-join-team {
      margin-top: 36px;
      padding-left: 40px;
      overflow: hidden;
      background-color: #fff;
      margin-bottom: 20px;
      ul {
        height: 175px;
        display: float;
        li {
          float: left;
          .teamName {
            width: 160px;
            height: 38px;
            font-weight: 500;
            text-align: center;
            line-height: 38px;
          }
          div.box.color-orange {
            border: 1px solid rgba(255, 157, 107, 1);
          }
          div.box.color-green {
            border: 1px solid rgba(64, 211, 111, 1);
          }
          div.box.color-gary {
            border: 1px solid #b0b0b0;
          }

          .box {
            overflow: hidden;
            position: relative;
            cursor: pointer;
            width: 160px;
            height: 206px;
            margin-right: 32px;
            margin-bottom: 16px;
            box-shadow: 0px 10px 20px 0px rgba(64, 211, 111, 0.11);
            border-radius: 8px;
            border: 1px solid rgba(255, 157, 107, 1);
            // border:1px solid rgba(64,211,111,1);
            div.zuZhang.color-orange {
              background-color: rgba(255, 157, 107, 1);
            }
            div.zuZhang.color-green {
              background-color: rgba(64, 211, 111, 1);
            }
            div.zuZhang.color-gary {
              background-color: #b0b0b0;
            }
            div.zuZhang {
              position: absolute;
              top: 0px;
              left: 0px;
              width: 67px;
              height: 27px;
              color: #fff;
              line-height: 27px;
              text-align: center;
              margin-bottom: 7px;
              border-radius: 0px 0 8px 0;
              background: rgba(255, 157, 107, 1);
              // background:rgba(64,211,111,1);
            }
            img,
            .default-img {
              display: block;
              margin: 34px auto 0;
              width: 72px;
              height: 72px;
              border-radius: 50%;
            }
            .default-img {
              background: url("../../common/images/default_sprit.png") no-repeat;
              background-position: 0 -410px;
            }
            .leader-name {
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin: 11px 0 20px 0;
            }
            .requestJoin {
              margin: 0 auto;
              width: 130px;
              height: 30px;
              border-radius: 15px;
              // background-color: rgba(64,211,111,1);
              background-image: linear-gradient(to right, #40d470, #71d766);
              color: #fff;
              text-align: center;
              line-height: 30px;
              font-size: 16px;
            }
            .color-orange {
              // background-color: rgba(255,157,107,1);
              background-image: linear-gradient(to right, #ff9d6b, #ff7732);
            }
            .unableApply {
              // background-color: #B0B0B0;
              background-image: linear-gradient(to right, #b0b0b0, #b0b0b0);
            }
          }
        }
      }
    }
    .teamList {
      margin-top: 36px;
      padding-left: 40px;
      overflow: hidden;
      background-color: #fff;
      // max-height: 570px;
      // overflow-y: auto;
      p {
        height: 24px;
        font-size: 24px;
        font-weight: 500;
        color: rgba(0, 197, 127, 1);
        line-height: 24px;
        margin-bottom: 30px;
        .iconfont {
          color: rgba(0, 197, 127, 1);
          font-size: 24px;
          font-weight: 700;
          margin-left: 5px;
          margin-right: 15px;
          cursor: pointer;
        }
      }
      ul {
        height: 220px;
        display: float;
        li {
          cursor: pointer;
          overflow: hidden;
          float: left;
          position: relative;
          width: 160px;
          height: 220px;
          background: rgba(255, 255, 255, 1);
          // background:rgba(64,211,111,0.05);
          margin-right: 32px;
          margin-bottom: 16px;
          box-shadow: 0px 10px 20px 0px rgba(64, 211, 111, 0.11);
          border-radius: 8px;
          border: 1px solid rgba(64, 211, 111, 1);
          &:first-child {
            border: 1px solid rgba(255, 157, 107, 1);
          }
          &:nth-child(6n) {
            margin-right: 0px;
          }
          &:hover {
            background-color: rgba(64, 211, 111, 0.1);
          }
          &:first-child:hover {
            background-color: rgba(255, 157, 107, 0.1);
          }
          div:first-child {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 67px;
            height: 27px;
            color: #fff;
            background-color: #36cea9;
            line-height: 27px;
            text-align: center;
            margin-bottom: 7px;
            border-radius: 0px 0 8px 0;
          }
          div.zuZhang {
            // background-color: #ff9d6a;
            background: rgba(255, 157, 107, 1);
          }
          div.myself {
            overflow: hidden;
            width: 50px;
            height: 50px;
            color: #fff;
            background-color: rgba(255, 0, 0, 0.7);
            text-align: center;
            line-height: 80px;
            position: absolute;
            right: -25px;
            top: -25px;
            transform: rotate(45deg);
            border-radius: 50%;
            font-weight: 400;
          }
          img,
          .default-img {
            display: block;
            margin: 34px auto 0;
            width: 72px;
            height: 72px;
            border-radius: 50%;
          }
          .default-img {
            background: url("../../common/images/default_sprit.png") no-repeat;
            background-position: 0 -410px;
          }
          div.group {
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin: 7px 0 21px;
          }
          div.progress {
            width: 130px;
            height: 42px;
            background: url("../../common/images/default_sprit.png") -2px -229px;
            line-height: 42px;
            text-align: center;
            margin: 0 auto;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
          }
        }
        .orange-bg {
          background-color: rgba(255, 157, 107, 0.1);
        }
        .green-bg {
          background-color: rgba(64, 211, 111, 0.1);
        }
      }
    }
    .space-sex {
      width: 100%;
      height: 6px;
      background: rgba(248, 248, 248, 1);
    }
    .teamSpace {
      height: 100%;
      overflow: hidden;
      padding: 0 40px 0 40px;
      background-color: #fff;
      div.space {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100px;
        margin-bottom: 10px;
        .chain-space {
          height: 24px;
          font-size: 24px;
          font-weight: 500;
          color: rgba(0, 197, 127, 1);
          line-height: 24px;
        }
        .english-space {
          margin-left: 12px;
          height: 20px;
          font-size: 20px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.2);
          line-height: 20px;
        }
        .right-input {
          display: flex;
          .search-box {
            width: 277px;
            height: 38px;
            position: relative;
            margin-right: 32px;
            input {
              width: 250px;
              height: 38px;
              box-sizing: border-box;
              padding-left: 12px;
              padding-right: 50px;
              outline: none;
              margin-right: 20px;
              background: rgba(255, 255, 255, 1);
              border-radius: 19px;
              border: 1px solid rgba(228, 231, 237, 1);
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
            .search-btn {
              position: absolute;
              width: 70px;
              height: 38px;
              background: rgba(0, 197, 127, 1);
              border-radius: 19px;
              top: 0;
              right: 0;
              line-height: 38px;
              text-align: center;
              font-size: 13px;
              color: #fff;
              cursor: pointer;
            }
          }
        }
        .upload {
          padding-left: 52px;
          width: 132px;
          height: 38px;
          background: rgba(0, 197, 127, 1);
          border-radius: 19px;
          line-height: 38px;
          color: #fff;
          cursor: pointer;
          text-align: left;
          position: relative;
          img {
            position: absolute;
            width: 18px;
            height: 22px;
            left: 24px;
            top: 8px;
          }
        }
      }
      .tdkj-ul {
        // display: -webkit-box;
        display: -webkit-flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        li {
          cursor: pointer;
          width: 353px;
          height: 172px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 2px 20px 0px rgba(35, 35, 35, 0.11);
          border-radius: 8px;
          overflow: hidden;
          padding: 16px 20px 16px 16px;
          margin-bottom: 25px;
          margin-right: 30px;
          display: -webkit-flex;
          position: relative;
          transition: all 0.4s;
          &:nth-child(3n) {
            margin-right: 0px;
          }
          &:hover {
            box-shadow: 0 1px 8px 0 #ccc;
            // transform: scale(1.02);
            transform: translateY(-1px);
            transition: all 0.4s;
            box-shadow: 0px 3px 30px 0px rgba(35, 35, 35, 0.41);
          }
          img {
            width: 100px;
            height: 140px;
            margin-right: 16px;
          }
          .tdkj-ul-li-content {
            width: 201px;
            height: 140px;
            .pd_2 {
              margin-top: 6px;
              width: 187px;
              height: 60px;
              font-size: 13px;
              font-weight: 400;
              color: rgba(48, 49, 51, 1);
              line-height: 20px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              word-wrap: break-word;
              word-break: normal;
            }
            .pd_3 {
              margin-top: 6px;
              width: 201px;
              font-size: 14px;
              color: rgba(64, 211, 111, 1);
              white-space: nowrap;
              span {
                display: inline-block;
                max-width: 90px;
                text-overflow: ellipsis;
                overflow: hidden;
                &:first-child {
                  margin-right: 24px;
                }
              }
            }
            .pd_4 {
              position: relative;
              margin-top: 14px;
              .del-res {
                color: rgba(255, 157, 107, 1);
                font-size: 12px;
                font-weight: 500;
              }
              .el-button--info {
                width: 60px;
                height: 28px;
                background: linear-gradient(
                  94deg,
                  rgba(64, 212, 112, 1) 0%,
                  rgba(113, 215, 102, 1) 100%
                );
                border-radius: 14px;
                border: none;
              }
              // .el-button + .el-button {
              //   margin-right: 10px;
              // }
              .fixed-right {
                position: absolute;
                right: 0;
              }
              .fixed-right-view {
                position: absolute;
                right: 70px;
              }
            }
          }

          .myDir {
            position: absolute;
            border: 23px solid #ff9d6a;
            border-bottom-color: transparent;
            border-left-color: transparent;
            top: 0;
            right: 0;
          }
          .myText {
            position: absolute;
            color: #fff;
            font-size: 12px;
            top: 6px;
            right: 2px;
            transform: rotate(45deg);
          }
        }
      }
      .ziyuannodata {
        width: 100%;
        text-align: center;
        img {
          margin: 50px 0 0;
          width: 230px;
          height: 230px;
        }
        .nodata-title {
          margin: 0 auto;
          width: 230px;
          text-align: right;
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(63, 212, 112, 1);
          line-height: 20px;
          margin-bottom: 60px;
        }
      }
    }
    .nodata {
      width: 100%;
      text-align: center;
      img {
        margin-top: 100px;
      }
      .nodata-title {
        margin: 0 auto;
        height: 20px;
        font-size: 15px;
        color: rgba(63, 212, 112, 1);
        margin-bottom: 100px;
      }
    }
    // 公共标题样式
    .common-title-css {
      height: 24px;
      font-size: 24px;
      font-weight: 500;
      color: rgba(0, 197, 127, 1);
      line-height: 24px;
      margin-bottom: 30px;
    }
  }
}
@media screen and (max-width: 1610px) {
  .my-team-page-main {
    width: 100%;
  }
}
</style>
