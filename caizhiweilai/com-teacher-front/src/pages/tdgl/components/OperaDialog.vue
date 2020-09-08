<template>
  <div class="dialog-box">
    <div class="cont" :style="{width:dialogBaseSet[activity.fun]._width+'px'}">
      <p class="title">{{dialogBaseSet[activity.fun].text}} <i
        @click="closeDialog(activity.fun == 'editMember' ? 'edits':'')" class="iconfont">&#xe60e;</i></p>
      <div class="content-box look-study" v-if="activity.fun == 'look'">
        <div class="tab-box">
          <table>
            <thead>
            <tr>
              <th width="10%">学号</th>
              <th width="20%">学员名称</th>
              <th width="10%">性别</th>
              <th width="20%">账号</th>
              <th width="20%">手机号</th>
              <th width="20%">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in activity.memberList" :key="item.id">
              <td>{{item.identityCode}}</td>
              <td>{{item.name}}</td>
              <td v-html="item.gender == 0 ? '女' : (item.gender == 1 ?'男':'保密')">{{item.name}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.phone}}</td>
              <td v-if="item.isleader == 1"> —</td>
              <td v-else>
                <em @click="removeOrSetMember($event,0)" :data-classid="item.classId" :data-teamid="item.teamId"
                    :data-userid="item.userId">移出</em>
                <span @click="removeOrSetMember($event,1)" :data-classid="item.classId" :data-teamid="item.teamId"
                      :data-userid="item.userId">任命组长</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <Pagination v-if="activity.total>10" @pagination="monitorPagin" :total="activity.total"
                    :page.sync="activity.lookPage" :limit.sync="activity.lookSize"></Pagination>
        <div class="btn-box">
          <button class="hold" @click="closeDialog">确定</button>
        </div>
      </div>
      <div class="content-box" v-if="activity.fun == 'editTeam'">
        <div class="edit-team-list">
          <span>团队名称</span>
          <input type="text" placeholder="请输入团队名称" v-model="activity.name">
        </div>
        <div class="btn-box">
          <button class="cancel" @click="closeDialog">取 消</button>
          <button class="hold" @click="holdOpera" data-type="editTeam" :data-id="activity.id">提 交</button>
        </div>
      </div>
      <div class="content-box" v-if="activity.fun == 'editMember'">
        <div class="shuttle-box">
          <div class="left">
            <p class="module-name">现有成员</p>
            <div class="module-box">
              <el-scrollbar>
                <ul class="member-list">
                  <li v-for="item in activity._data.groupedData" :key="item.id">
                    <p>{{item.name}}</p>
                    <span v-if="item.isleader == 1">组长</span>
                    <span v-else class="move-btn iconfont" :data-userid="item.userId" :data-teamid="item.teamId"
                          :data-classid="item.classId" @click="moveOut($event,'0')">&#xe6ce;</span>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
          <div class="shuttle-btn">
            <i class="iconfont del" @click="operationAll($event,0)">&#xe646;</i>
            <br>
            <i class="iconfont add" @click="operationAll($event,1)">&#xe64e;</i>
          </div>
          <div class="right">
            <p class="module-name">未分组成员</p>
            <div class="module-box">
              <el-scrollbar>
                <ul class="member-list">
                  <li v-for="item in activity._data.ungroupData" :key="item.id">
                    <span class="move-btn iconfont" :data-userid="item.userId"
                          @click="moveOut($event,'1')">&#xe6cc;</span>
                    <p>{{item.name}}</p>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="btn-box">
          <button class="hold" @click="holdEditMember" data-type="editMember">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reviseTeamName,
  appointLeader,
  delMember
} from '@/api/teamAdmin'

export default {
  name: 'OperaDialog',
  props: {
    activity: {
      type: Object
    }
  },
  data() {
    return {
      reviseName: '', // 修改团队名字
      dialogBaseSet: {
        look: {
          text: '查看成员',
          _width: 930
        },
        editTeam: {
          text: '编辑班级',
          _width: 520
        },
        editMember: {
          text: '编辑成员',
          _width: 930
        },
        intervalTime: 0 // 连续点击的间隔时间
      }
    }
  },
  mounted() {
  },
  methods: {
    //  关闭对话框
    closeDialog(str) {
      if (str == 'refresh') {
        this.$emit('closeDialog', str)
      } else if (str == 'edits') {
        this.$emit('closeDialog', str)
      } else {
        this.$emit('closeDialog')
      }
    },
    // 监听分页操作
    monitorPagin(obj) {
      this.$emit('lookPageChange', obj)
    },
    // 保存操作
    holdOpera(e) {
      const _type = e.srcElement.dataset.type
      const _id = e.srcElement.dataset.id
      let postData = {}
      if (_type == 'editTeam') {
        if (this.activity.name == '') {
          this.$message.warning('团队名字必须填写')
          return false
        }
        postData = {
          teamName: this.activity.name,
          id: _id
        }
        reviseTeamName(postData).then(res => {
          if (res.code == 0) {
            this.closeDialog('refresh')
          } else {
            this.$message.warning({
              message: res.message
            })
          }
        })
      }
    },
    // 移除学员或者设置组长
    removeOrSetMember(e, i) {
      const _teamId = e.srcElement.dataset.teamid
      const _classId = e.srcElement.dataset.classid
      const _userId = e.srcElement.dataset.userid
      let postData = {}
      if (i == 0) {
        postData = {
          teamId: _teamId,
          classId: _classId,
          userIds: [_userId]
        }
        delMember(postData).then(res => {
          if (res.code == 0) {
            this.$message.success({
              message: res.message
            })
            this.$emit('refreshOpera', _teamId)
          } else {
            this.$message.warning({
              message: res.message
            })
          }
        })
      }
      if (i == 1) {
        postData = {
          teamId: _teamId,
          classId: _classId,
          userId: _userId
        }
        appointLeader(postData).then(res => {
          if (res.code == 0) {
            this.$message.success({
              message: res.message
            })
            this.$emit('refreshOpera', _teamId)
          } else {
            this.$message.warning({
              message: res.message
            })
          }
        })
      }
    },
    // 单个移除或者添加，0为删除1为添加
    moveOut(e, val) {
      const _this = this
      const _userId = e.srcElement.dataset.userid
      // 防止连续点击出现重复提交
      if (new Date() - this.intervalTime < 2000) {
        return false
      }
      // val为0时吧学员移出团队
      if (val == 0) {
        _this.$emit('operaMemberRefresh', [0, [_userId]])
      }
      // val为1时向团队中添加学员
      if (val == 1) {
        _this.$emit('operaMemberRefresh', [1, [_userId]])
      }
    },
    //	全部移除或者添加，0为删除1为添加
    operationAll(e, val) {
      const tempArr = []
      // 防止连续点击出现重复提交
      if (new Date() - this.intervalTime < 2000) {
        return false
      }
      // val为2，是删除除了组长以外的所有学员
      if (val == 0) {
        const _groupData = this.activity._data.groupedData
        // 临时存储学员
        for (let i = 1, len = _groupData.length; i < len; i++) {
          tempArr.push(_groupData[i].userId)
        }
        this.$emit('operaMemberRefresh', [2, tempArr])
      }
      // val为1，是所有的未分组学员到团队
      if (val == 1) {
        const _ungroup = this.activity._data.ungroupData
        for (let j = 0, size = _ungroup.length; j < size; j++) {
          tempArr.push(_ungroup[j].userId)
        }
        if (_ungroup.length) {
          this.$emit('operaMemberRefresh', [3, tempArr])
        }
      }
    },
    // 确定保存编辑学员
    holdEditMember() {
      const tempArr = []
      const _teamId = this.activity._data.groupedData[0].teamId
      const _classId = this.activity._data.groupedData[0].classId
      for (let i = 0, len = this.activity._data.groupedData.length; i < len; i++) {
        tempArr.push(this.activity._data.groupedData[i].userId)
      }
      const tempJson = {
        teamId: _teamId,
        classId: _classId,
        userIds: tempArr
      }
      // 防止连续点击出现重复提交
      if (new Date() - this.intervalTime < 2000) {
        return false
      }
      this.$emit('holdEditTeamMember', tempJson)
    }
  }
}
</script>

<style scoped lang="scss">
  .dialog-box {
    @include maskLayer($z: 1002);

    em,
    i {
      font-style: normal;
    }

    .cont {
      background: #fff;
      border-radius: 4px;
      @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));

      .title {
        line-height: 52px;
        border: 1px solid #F3F4F5;
        padding: 0 20px;
        color: #444444;
        font-size: 18px;
        position: relative;
        border-radius: 4px 4px 0 0;

        i {
          position: absolute;
          right: 20px;
          top: 0;
          padding: 0 10px;
          color: #929292;
          font-size: 18px;
          cursor: pointer;
        }
      }

      .content-box {
        min-height: 260px;
        margin: 20px 35px 0;
        padding-bottom: 70px;
        position: relative;

        &.look-study {
          padding-bottom: 70px;
        }

        .tab-box {
          max-height: 300px;
          overflow-y: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border-right: 1px solid #EDEDED;
          border-left: 1px solid #EDEDED;
          background: #fff;
          text-align: left;
          color: #333333;

          thead {
            tr {
              border-bottom: 1px solid #EDEDED;
              border-top: 1px solid #EDEDED;

              th {
                background: #FAFCFE;
                font-weight: normal;
                height: 40px;
                padding-left: 30px;
                font-size: 14px;
              }
            }
          }

          tbody {
            tr {
              border-bottom: 1px solid #EDEDED;
              border-top: 1px solid #EDEDED;

              &:hover {
                background-color: #F8F8F8;
              }

              td {
                line-height: 20px;
                padding: 10px 0 10px 30px;
                font-size: 12px;

                em {
                  color: #FF9D6A;
                  margin-right: 10px;
                  cursor: pointer;
                }

                span {
                  color: $color-theme;
                  cursor: pointer;
                }
              }
            }
          }
        }

        .btn-box {
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 20px;
          left: 0;

          button {
            width: 100px;
            height: 32px;
            font-size: 15px;
            border: 0;
            border-radius: 3px;
            color: #fff;
            outline: none;
            background: #fff;
            cursor: pointer;

            &.hold {
              background: $color-theme;

              &:hover {
                background: $color-theme-hover;
              }
            }

            &.cancel {
              border: 1px solid #E8E9ED;
              color: #8993AB;
              margin-right: 10px;

              &:hover {
                background: #f3f3f3;
              }
            }
          }
        }

        .edit-team-list {
          display: flex;
          font-size: 14px;
          color: #666666;
          line-height: 38px;

          input {
            height: 38px;
            border: 1px solid #DCDFE6;
            border-radius: 2px;
            padding-left: 10px;
            flex: 1;
            margin-left: 10px;
            outline: none;
            font-size: 12px;
            color: #333;

            &::placeholder {
              color: #C5C5C5;
            }
          }
        }

        .shuttle-box {
          height: 440px;
          display: flex;
          display: -webkit-flex;
          justify-content: center;

          .left,
          .right {
            width: 300px;
            border: 1px solid #DCDEE3;
            border-radius: 4px;
          }

          .right {
            .move-btn {
              margin-right: 16px;
            }
          }

          .shuttle-btn {
            width: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            i {
              width: 56px;
              height: 40px;
              font-size: 18px;
              border-radius: 4px;
              text-align: center;
              line-height: 40px;
              cursor: pointer;

              &.del {
                background: $color-theme;
                color: #fff;

                &:hover {
                  background: $color-theme-hover;
                }
              }

              &.add {
                border: 1px solid #E6E7EB;
                background-color: #F7F8FA;
                color: #CCCCCC;

                &:hover {
                  background-color: #e8e8e8;
                }
              }
            }
          }

          .module-name {
            font-size: 16px;
            color: #333;
            line-height: 44px;
            text-align: left;
            padding-left: 30px;
            background-color: #F7F8FA;
            border-botTom: 1px solid #DCDEE3;
          }

          .module-box {
            height: 270px;

            .member-list {
              padding: 8px 0;

              li {
                padding: 0 14px 0 16px;
                font-size: 16px;
                line-height: 36px;
                display: flex;

                &:hover {
                  background: #e2f9f3;
                }

                p {
                  display: inline-block;
                  max-width: 180px;
                  word-break: break-all;
                  line-height: 36px;
                  flex: 1;
                }

                span {
                  display: inline-block;
                  font-size: 14px;
                  color: $color-theme;
                  font-weight: bold;

                  &.move-btn {
                    font-size: 16px;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
