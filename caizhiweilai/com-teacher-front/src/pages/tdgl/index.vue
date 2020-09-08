<template>
  <div class="team-manager-wrapper">
    <ul class="function-btn">
      <li @click="creatTeam(1)">创建团队</li>
      <li @click="creatTeam(2)">自动生成团队</li>
      <li class="ungroup-btn">未分组成员{{ungroupMember.length}}人
        <div class="ungroup-list">
          <i class="triangle-pic iconfont">&#xe66b;</i>
          <div v-if='ungroupMember.length > 0'>
            <span v-for="item in ungroupMember" :key="item.id">{{item.name}}</span>
          </div>
          <div v-else class="aaaa">
            <span>暂无未分配学员~~~~</span>
          </div>
        </div>
      </li>
    </ul>
    <table class="team-table">
      <thead>
      <tr>
        <th width="6%">序号</th>
        <th width="30%">团队名称</th>
        <th width="30%">组长名称</th>
        <th width="20%">团队人数</th>
        <th width="20%">操作</th>
      </tr>
      </thead>
      <tbody v-if="currentTotal > 0">
      <tr v-for="(item,index) in teamData" :key="index">
        <td>{{(currentPage - 1) * currentSize + index + 1}}</td>
        <td>{{item.teamName}}</td>
        <td>{{item.leaderName}}</td>
        <td>{{item.num}}</td>
        <td>
          <span @click="lookOrEditMember($event,0)" :data-teamid="item.id">查看成员</span>
          <span @click="viewTeamRes(item)" class="different">查看团队资源</span>
          <br>
          <span @click="editTeam" class="different" :data-teamid="item.id" :data-name="item.teamName">编辑</span>
          <span @click="lookOrEditMember($event,1)" class="different" :data-teamid="item.id">编辑成员</span>
          <span @click="dismissTeam" class="dismiss-btn different" :data-teamid="item.id">解散</span>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td colspan="5" style="text-align: center;padding:14px 0;">暂无数据</td>
      </tr>
      </tbody>
    </table>
    <Pagination v-if="currentTotal>10" @pagination="monitorPagin" :total="Number(currentTotal)" :page.sync="currentPage"
                :limit.sync="currentSize"></Pagination>
    <opera-dialog v-if="callDialog" :activity="currentFunc" @closeDialog="closeDialog"
                  @operaMemberRefresh="operaMemberRefresh" @refreshOpera="refreshOpera"
                  @holdEditTeamMember='holdEditTeamMember' @lookPageChange='lookPageChange'></opera-dialog>
    <creat-team v-if="creatTeamDialog" :creatTeamData="creatTeamData" @closeCreatDialog="closeCreatDialog"
                @setLeader="setleader" @chooseStudy="chooseStudy" @checkAll="checkAll"></creat-team>
    <el-dialog  class='teamspace-dialog' title="查看团队资源" :visible.sync="teamSpaceDialog" top="10vh" :close='closeTeamSpace'
               :close-on-click-modal="false">
      <teamSpace :teamSpaceData="teamSpaceData"></teamSpace>
    </el-dialog>
  </div>
</template>
<script>
import OperaDialog from './components/OperaDialog'
import CreatTeam from './components/CreatTeam'
import teamSpace from './components/teamSpace'
import {
  teamList,
  ungroupList,
  getMember,
  getTeamMember,
  addMemberTeam,
  dismissTeam
} from '@/api/teamAdmin'

export default {
  name: 'TeamManPage',
  data() {
    return {
      currentPage: 1, // 默认页码
      currentSize: 10, // 默认每页条数
      currentTotal: 0, // 团队列表总条数
      currentSizeChange: 10, // 备份每页多少条数据
      teamData: [], // 团队列表数据
      storageUngroup: [], // 存储未分组的学生用来做编辑团队的时候从新赋值用
      ungroupMember: [], // 未分组人员
      classId: '', // 当前班级的classid
      currentTeamData: [], // 当前团队成员
      currentTeamName: '', // 当前团队名字
      currentFunc: {}, // 传递给弹窗组件的数据
      callDialog: false, // 唤起对话框
      creatTeamDialog: false, // 创建团队
      teamSpaceDialog: false, // 团队空间
      creatTeamData: {}, // 创建团队传递个子组件的数据
      lookPage: 1, // 查看成员分页
      lookSize: 10, // 查看成员当前页多少数据
      lookTotal: 0, // 查看成员总数
      currentTeamId: '', // 当前的teamId
      teamSpaceData: {} // 团队数据
    }
  },
  components: {
    OperaDialog,
    CreatTeam,
    teamSpace
  },
  mounted() {
    // 加载团列表数据
    this.getTeamData()
    // 加载未分组成员数据
    this.getUngroupData()
  },
  methods: {
    // 关闭弹框
    closeTeamSpace(done) {
      // console.log('1111')
      this.teamSpaceData = {}
    },
    // 分页切换
    monitorPagin(obj) {
      if (this.currentSizeChange !== obj.limit) {
        this.currentPage = 1
        this.currentSizeChange = obj.limit
      } else {
        this.currentPage = obj.page
      }
      this.currentSize = obj.limit
      this.getTeamData()
    },
    // 获取团队列表
    getTeamData() {
      const _this = this
      const postData = {
        page: this.currentPage,
        size: this.currentSize,
        keyWrods: '',
        classId: localStorage.getItem('classId')
      }
      teamList(postData).then((res) => {
        if (res.code == 0) {
          _this.teamData = res.result.data
          _this.currentTotal = res.result.total
          _this.currentPage = res.result.page
          _this.currentSize = res.result.size
          if (_this.teamData.length == 0 && this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.getTeamData()
          }
        }
      })
    },
    // 获取未分组学员数据
    getUngroupData() {
      const _this = this
      const postData = {
        classId: localStorage.getItem('classId')
      }
      const _formData = new FormData()
      Object.keys(postData).forEach(key => {
        _formData.append(key, postData[key])
      })
      ungroupList(_formData).then((res) => {
        if (res.code == 0) {
          _this.storageUngroup = JSON.parse(JSON.stringify(res.result))
          _this.ungroupMember = res.result
          // localStorage.setItem('unGroupMemberNum', _this.ungroupMember.length)
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 查看团队资源
    viewTeamRes(item) {
      // console.log(item)
      this.teamSpaceData = item
      this.teamSpaceDialog = true
    },
    // 编辑团队
    editTeam(e) {
      const _name = e.srcElement.dataset.name
      const teamId = e.srcElement.dataset.teamid
      this.currentFunc = {
        fun: 'editTeam',
        name: _name,
        id: teamId,
        _data: this.currentTeamName
      }
      this.callDialog = true
    },
    // 查看成员和编辑成员
    lookOrEditMember(e, i) {
      this.currentTeamId = e.srcElement.dataset.teamid
      const postData = {
        teamId: this.currentTeamId
      }
      this.ajaxTeamMember(postData, i)
    },
    // 请求团队成员数据
    ajaxTeamMember(postData, i) {
      const _this = this
      //  0代表着查看---查看的时候使用有分页的接口
      if (i == 0) {
        postData.classId = localStorage.getItem('classId')
        postData.page = this.lookPage
        postData.size = this.lookSize
        const _formData = new FormData()
        Object.keys(postData).forEach(key => {
          _formData.append(key, postData[key])
        })
        getMember(postData).then(res => {
          if (res.code == 0) {
            _this.currentTeamData = []
            _this.currentTeamData = res.result.data
            _this.lookPage = res.result.page
            _this.lookSize = res.result.size
            _this.lookTotal = Number(res.result.total)
            _this.currentFunc = {
              fun: 'look',
              memberList: _this.currentTeamData,
              total: _this.lookTotal,
              lookPage: _this.lookPage,
              lookSize: _this.lookSize
            }
            _this.callDialog = true
          } else {
            this.$message.warning({
              message: res.message
            })
            return false
          }
        })
      }
      //  1代表着编辑学员
      if (i == 1) {
        // console.log(_this.ungroupMember)
        const _formData = new FormData()
        Object.keys(postData).forEach(key => {
          _formData.append(key, postData[key])
        })
        getTeamMember(_formData).then(res => {
          if (res.code == 0) {
            _this.currentTeamData = res.result
            _this.currentFunc = {
              fun: 'editMember',
              _data: {
                groupedData: _this.currentTeamData,
                ungroupData: _this.ungroupMember
              }
            }
            _this.callDialog = true
          } else {
            this.$message.warning({
              message: res.message
            })
            return false
          }
        })
      }
    },
    // 解散
    dismissTeam(e) {
      const _this = this
      const teamId = e.srcElement.dataset.teamid
      this.$confirm('确定要解散团队吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        dismissTeam({ teamIds: [teamId] }).then(res => {
          if (res.code == '0') {
            _this.callDialog = false
            _this.$message.success({
              message: res.message
            })
            _this.closeDialog('refresh')
          } else {
            _this.$message.warning({
              message: res.message
            })
          }
        })
      }).catch(() => {})
      // this.currentFunc = {
      //   fun: 'dismiss',
      //   _data: this.currentTeamName,
      //   id: teamId
      // }
      // this.callDialog = true
    },
    // 刷新删除任命组长
    refreshOpera(teamid) {
      const _this = this
      const postData = {
        teamId: teamid,
        classId: localStorage.getItem('classId'),
        page: _this.lookPage,
        size: _this.lookSize
      }
      // 刷新未分组成员
      this.getUngroupData()
      // 加载团列表数据
      this.getTeamData()
      getMember(postData).then(res => {
        if (res.code == 0) {
          _this.currentTeamData = res.result.data
          this.currentFunc = {
            fun: 'look',
            memberList: _this.currentTeamData,
            total: Number(res.result.total)
          }
          this.callDialog = true
        } else {
          this.$message.warning({
            message: res.message
          })
          return false
        }
      })
    },
    // 查看成员分页改变
    lookPageChange(obj) {
      this.lookPage = obj.page
      this.lookSize = obj.limit
      const postData = {
        teamId: this.currentTeamId
      }
      this.ajaxTeamMember(postData, 0)
    },
    // 创建团队
    creatTeam(str) {
      if (this.ungroupMember.length == 0) {
        this.$message.warning('暂无未分组成员，无法创建团队')
        return false
      } else {
        this.creatTeamDialog = true
      }
      if (str == 1) {
        this.creatTeamData = {
          text: '创建团队',
          type: '1',
          studyData: this.ungroupMember
        }
      } else {
        this.creatTeamData = {
          text: '自动生成团队',
          type: '2',
          studyData: this.ungroupMember
        }
      }
    },
    // 创建团队设置组长
    setleader(i) {
      for (let j = 0, len = this.ungroupMember.length; j < len; j++) {
        this.ungroupMember[j].isLeader = false
      }
      this.ungroupMember[i].isLeader = true
      this.ungroupMember = [...this.ungroupMember]
      this.creatTeamData = {
        text: '创建团队',
        type: '1',
        studyData: this.ungroupMember
      }
    },
    // 单选
    chooseStudy(val) {
      if (val[1] == 0) {
        for (let j = 0, len = this.ungroupMember.length; j < len; j++) {
          if (this.ungroupMember[j].userId == val[0]) {
            this.ungroupMember[j].isCheck = true
            break
          }
        }
      }
      if (val[1] == 1) {
        for (let j = 0, len = this.ungroupMember.length; j < len; j++) {
          if (this.ungroupMember[j].userId == val[0]) {
            this.ungroupMember[j].isCheck = false
            break
          }
        }
      }
      this.creatTeamData = {
        text: '创建团队',
        type: '1',
        studyData: this.ungroupMember
      }
    },
    // 全选学生
    checkAll(val) {
      if (val == 0) {
        for (let j = 0, len = this.ungroupMember.length; j < len; j++) {
          this.ungroupMember[j].isCheck = true
        }
      }
      if (val == 1) {
        for (let j = 0, len = this.ungroupMember.length; j < len; j++) {
          this.ungroupMember[j].isCheck = false
        }
      }
      this.creatTeamData = {
        text: '创建团队',
        type: '1',
        studyData: this.ungroupMember
      }
    },
    // 关闭对话框
    closeDialog(str) {
      this.currentFunc = ''
      this.callDialog = false
      if (str == 'refresh') {
        // 加载团列表数据
        this.getTeamData()
        // 加载未分组成员数据
        this.getUngroupData()
      }
      if (str == 'edits') {
        this.ungroupMember = JSON.parse(JSON.stringify(this.storageUngroup))
      }
    },
    // 编辑团队成员操作以后刷新，使用队列的方式请求
    operaMemberRefresh(val) {
      // 为0时，是单个删除
      if (val[0] == 0) {
        this.handlerData(val[1], 0)
      }
      // 为1时，是单个添加
      if (val[0] == 1) {
        this.handlerData(val[1], 1)
      }
      // 为2时，是全部删除
      if (val[0] == 2) {
        this.handlerData(val[1], 0)
      }
      // 为3时，是全部添加
      if (val[0] == 3) {
        this.handlerData(val[1], 1)
      }
    },
    // 编辑时先操作本地数据
    handlerData(dataArr, str) {
      const _this = this
      // 0操作的是删除，包含单个删除全部删除
      const tempArr = []
      if (str == 0) {
        _this.currentTeamData.forEach((item, index) => {
          if (!dataArr.includes(item.userId)) {
            tempArr.push(_this.currentTeamData[index])
          } else {
            _this.ungroupMember.push(item)
          }
        })
        _this.currentTeamData = []
        _this.currentTeamData = tempArr
        _this.currentFunc.fun = 'editMember'
      }
      // 1操作的是添加，包含单个添加和全部添加
      if (str == 1) {
        _this.ungroupMember.forEach((item, index) => {
          if (dataArr.includes(item.userId)) {
            _this.currentTeamData.push(_this.ungroupMember[index])
          } else {
            tempArr.push(_this.ungroupMember[index])
          }
        })
        _this.ungroupMember = []
        _this.ungroupMember = tempArr
        _this.currentFunc.fun = 'editMember'
      }
      _this.currentFunc._data = {
        groupedData: _this.currentTeamData,
        ungroupData: _this.ungroupMember
      }
    },
    // 关闭创建团队弹窗
    closeCreatDialog(str) {
      for (let j = 0, len = this.ungroupMember.length; j < len; j++) {
        this.ungroupMember[j].isCheck = false
        this.ungroupMember[j].isLeader = false
      }
      this.creatTeamDialog = false
      if (str == 'refresh') {
        // 加载团列表数据
        this.getTeamData()
        // 加载未分组成员数据
        this.getUngroupData()
      }
    },
    //  保存编辑团队成员
    holdEditTeamMember(obj) {
      const _this = this
      addMemberTeam(obj).then(res => {
        if (res.code == 0) {
          _this.callDialog = false
          // 加载团列表数据
          _this.getTeamData()
          // 加载未分组成员数据
          _this.getUngroupData()
        } else {
          this.$message.warning({
            message: res.message
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .team-manager-wrapper {
    padding: 20px;
    .function-btn {
      display: flex;
      margin-top: 6px;

      li {
        height: 32px;
        line-height: 32px;
        padding: 0 26px;
        font-size: 12px;
        color: #fff;
        background-color: $color-theme;
        border-radius: 2px;
        margin-right: 16px;
        cursor: pointer;

        &.ungroup-btn {
          background-color: #FF9D6A;
          position: relative;

          &:hover {
            .ungroup-list {
              display: block;
            }
          }

          .ungroup-list {
            padding: 10px 0;
            position: absolute;
            top: 12px;
            left: 0;
            display: none;

            i.triangle-pic {
              font-size: 14px;
              color: #FF9D6A;
              display: block;
              height: 19px;
            }

            div {
              background: #FF9D6A;
              border-radius: 4px;
              color: #fff;
              display: flex;
              flex-wrap: wrap;
              padding: 10px 0;
              min-width: 240px;
              cursor: default;

              span {
                display: inline-block;
                line-height: 22px;
                font-size: 13px;
                margin: 0 10px;
                white-space: nowrap;
                cursor: default;
              }
            }
          }
        }
      }
    }

    .team-table {
      width: 100%;
      border-collapse: collapse;
      border-left: 1px solid #EDEDED;
      border-right: 1px solid #EDEDED;
      margin-top: 24px;
      background: #fff;
      text-align: center;

      tr {
        /*border-top: 1px solid #EDEDED;*/
        /*border-bottom: 1px solid #EDEDED;*/
        &:hover {
          background: #FAFCFE;
        }

        th {
          line-height: 20px;
          font-size: 14px;
          color: #333333;
          padding: 14px 20px;
          background-color: #FAFCFE;
          border: 1px solid #EDEDED;
        }

        td {
          padding: 6px 20px;
          font-weight: normal;
          font-size: 12px;
          color: #595959;
          border: 1px solid #EDEDED;

          span {
            font-size: 12px;
            color: $color-theme;
            cursor: pointer;
            display: inline-block;
            line-height: 20px;

            &.dismiss-btn {
              color: #FF9D6A;
            }

            &:not(.dismiss-btn):hover {
              color: $color-theme-hover;
            }

            &.different {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
  .el-dialog__wrapper.teamspace-dialog {
    .el-dialog{
      width: 930px;
      height: 660px;
      border-radius: 4px;
      .el-dialog__body{
        padding: 20px 20px;
      }
    }
  }
</style>
