<template>
  <div class="creat-team-dialog">
    <div class="cont" :style="{width:(creatTeamData.type == '1'?'930':'520')+'px'}">
      <p class="title">{{creatTeamData.text}} <i @click="closeCreat" class="iconfont">&#xe60e;</i></p>
      <div v-if="creatTeamData.type == '1'" class="content-box">
        <div class="condition-list">
          <span><i>*</i>团队名称</span>
          <input type="text" placeholder="请输入团队名称" v-model="setTeamName">
          <strong class="choose-people">已选择 <em>{{choosePeople}}</em> 人</strong>
        </div>
        <div class="table-box">
          <table class="ungroup-list">
            <tr>
              <th><i class="iconfont" @click="checkAll" :class="{active:isHasCheckAll}"
                     :data-check="isHasCheckAll? '1':'0'" v-html="isHasCheckAll? '&#xe715;':'&#xe714;'">&#xe714;</i>
              </th>
              <th>学生姓名</th>
              <th>性别</th>
              <th>手机号</th>
              <th>账号</th>
              <th>操作</th>
            </tr>
            <tr v-if="creatTeamData.studyData.length==0">
              <td colspan="6" style="text-align: center;">暂无数据~~~</td>
            </tr>
            <tr v-for="item in creatTeamData.studyData" :key="item.userId">
              <td><i class="iconfont" @click="singleChoose" :data-id="item.userId" :class="{active:item.isCheck}"
                     :data-check="item.isCheck? '1':'0'" v-html="item.isCheck ? '&#xe715;':'&#xe714;'"></i></td>
              <td>{{item.name}}</td>
              <td v-html="item.gender == 0?'女':(item.gender == 1 ? '男' : '保密')"></td>
              <td>{{item.phone}}</td>
              <td>{{item.phone}}</td>
              <td>
                <button class="set-leader" :data-id="item.userId" :class="{'is-leader':item.isLeader}"
                        @click="setLeader" v-html="item.isLeader? '已设为组长':'设为组长'">
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="creatTeamData.type == '2'" class="content-box autoCreat">
        <div class="condition-list">
          <span>当前实训人数</span>
          <p v-html="creatTeamData.studyData.length+'人'"></p>
        </div>
        <div class="condition-list">
          <span>分组名称</span>
          <input type="text" placeholder="请输入分组名称" v-model="setTeamName">
        </div>
        <div class="condition-list">
          <span><i>*</i>分组数</span>
          <input type="text" placeholder="请输入分组数量" v-model="setTeamNum" @keyup="inputNumber">
          <p class="becarefull-tips">建议每组人数不超过10人</p>
        </div>
        <div class="tips-text" v-show="tipsShow">组数不能大于实训人数</div>
      </div>
      <div class="btn-box">
        <button class="cancel" @click="closeCreat">取 消</button>
        <button class="hold" @click="holdCreat" :data-type="creatTeamData.type">确 定</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  creatManually,
  creatAuto
} from '@/api/teamAdmin'

export default {
  name: 'CreatTeam',
  data() {
    return {
      isHasCheckAll: false, // 是否已经全选
      chooseData: [], // 选择的学员
      tipsShow: false, // 是否显示错误提示
      setLeaderId: '', // 创建团队时设置的组长的id
      setTeamName: '', // 创建团队的名字
      setTeamNum: '', // 自动创建团队的个数
      choosePeople: 0 // 已选择的人数
    }
  },
  props: {
    creatTeamData: {
      type: Object
    }
  },
  mounted() {

  },
  methods: {
    // 关闭创建弹窗
    closeCreat(str) {
      this.setLeaderId = ''
      this.setTeamName = ''
      this.setTeamNum = ''
      this.chooseData = []
      this.isHasCheckAll = false
      this.tipsShow = false
      if (str == 'refresh') {
        this.$emit('closeCreatDialog', str)
      } else {
        this.$emit('closeCreatDialog')
      }
    },
    // 保存创建
    holdCreat(e) {
      const _classId = localStorage.getItem('classId')
      const _type = e.srcElement.dataset.type
      if (_type == 1) {
        if (this.chooseData.length == 0) {
          this.$message.warning('请选择学员')
          return false
        }
        if (this.setLeaderId == '') {
          this.$message.warning('请先设置组长')
          return false
        }
        if (this.setTeamName == '') {
          this.$message.warning('团队名称不能为空')
          return false
        }
        // 判断选择的组长是不是已选择的里面
        if (this.chooseData.indexOf(this.setLeaderId) < 0) {
          this.$message.warning('请设置在已经选择的学员中选择组长')
          return false
        }
        const postData = {
          teamName: this.setTeamName,
          leaderId: this.setLeaderId,
          classId: _classId,
          userIds: this.chooseData
        }
        creatManually(postData).then(res => {
          if (res.code == 0) {
            this.closeCreat('refresh')
          } else {
            this.$message({
              message: res.data
            })
          }
        })
      }
      if (_type == 2) {
        if (this.setTeamNum > this.creatTeamData.studyData.length || this.setTeamNum == '' || this.setTeamNum == 0) {
          this.$message.warning({
            message: '请输入分组数'
          })
          return false
        }
        const postData = {
          teamName: this.setTeamName,
          classId: _classId,
          teamNum: this.setTeamNum
        }
        creatAuto(postData).then(res => {
          if (res.code == 0) {
            this.closeCreat('refresh')
          } else {
            this.$message.warning({
              message: res.message
            })
          }
        })
      }
    },
    // 设为组长
    setLeader(e) {
      const _id = e.srcElement.dataset.id
      this.setLeaderId = _id
      let index = 0
      for (let j = 0, len = this.creatTeamData.studyData.length; j < len; j++) {
        if (this.creatTeamData.studyData[j].userId == _id) {
          index = j
          break
        }
      }
      this.$emit('setLeader', index)
    },
    // 单选
    singleChoose(e) {
      const _element = e.srcElement
      const _id = _element.dataset.id
      const _check = _element.dataset.check
      if (_check == 0) {
        this.chooseData.push(_id)
        if (this.chooseData.length == this.creatTeamData.studyData.length) {
          this.isHasCheckAll = true
        }
        this.choosePeople = this.chooseData.length
        this.$emit('chooseStudy', [_id, 0])
      }
      if (_check == 1) {
        const i = this.chooseData.indexOf(_id)
        this.chooseData.splice(i, 1)
        if (this.chooseData.length != this.creatTeamData.studyData.length) {
          this.isHasCheckAll = false
        }
        this.choosePeople = this.chooseData.length
        this.$emit('chooseStudy', [_id, 1])
      }
    },
    // 限制输入框只能输入数字,检测分组数量是不是大于未分组人数
    inputNumber() {
      this.setTeamNum = this.setTeamNum.replace(/[^\d]/g, '')
      if (this.setTeamNum > this.creatTeamData.studyData.length) {
        this.tipsShow = true
      } else {
        this.tipsShow = false
      }
    },
    // 全选
    checkAll(e) {
      const _element = e.srcElement
      const _check = _element.dataset.check
      if (_check == 0) {
        this.chooseData = []
        for (let j = 0, len = this.creatTeamData.studyData.length; j < len; j++) {
          this.chooseData.push(this.creatTeamData.studyData[j].userId)
        }
        this.isHasCheckAll = true
        this.choosePeople = this.chooseData.length
        this.$emit('checkAll', 0)
      }
      if (_check == 1) {
        this.chooseData = []
        this.isHasCheckAll = false
        this.choosePeople = this.chooseData.length
        this.$emit('checkAll', 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .creat-team-dialog {
    overflow-y: auto;
    @include maskLayer($z: 1002);

    .cont {
      background: #fff;
      position: relative;
      border-radius: 4px;
      @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));

      .title {
        line-height: 52px;
        border: 1px solid #F3F4F5;
        padding: 0 30px;
        color: #444444;
        font-size: 18px;
        position: relative;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid #dedede;

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
        padding: 0 30px 28px;

        .condition-list {
          font-size: 14px;
          display: flex;
          margin-top: 20px;
          flex-wrap: wrap;
          position: relative;

          P {
            line-height: 32px;

            &.becarefull-tips {
              width: 100%;
              color: red;
              text-indent: 120px;
            }
          }

          input {
            border-radius: 3px;
            border: 1px solid #dedede;
            width: 300px;
            height: 32px;
            padding: 0 0 0 12px;
            outline: none;
          }

          span {
            height: 32px;
            overflow: hidden;
            line-height: 32px;
            margin-right: 12px;
            display: flex;
            justify-content: flex-end;
            i {
              color: red;
              margin-right: 4px;
              font-style: normal;
              height: 32px;
              line-height: 38px;
            }
          }

          .choose-people {
            font-weight: normal;
            line-height: 32px;
            display: inline-block;
            position: absolute;
            right: 0;
            top: 0;

            em {
              font-style: normal;
              color: $color-theme;
              text-decoration: underline;
            }
          }
        }

        .set-leader {
          border: 0;
          background: transparent;
          cursor: pointer;
          outline: none;
          color: $color-theme;

          &.is-leader {
            color: #999;
            cursor: no-drop;
          }
        }

        &.autoCreat {
          .condition-list {
            span {
              width: 100px;
              margin-right: 20px;
            }
          }
        }

        .table-box {
          max-height: 420px;
          overflow-y: auto;
          margin-top: 20px;

          .ungroup-list {
            width: 100%;
            border-collapse: collapse;
            text-align: left;

            tr {
              td,
              th {
                border: 1px solid #EBEEF5;

                i {
                  cursor: pointer;
                  color: #999;

                  &.active {
                    color: $color-theme;
                  }
                }
              }

              th {
                font-size: 14px;
                color: #333;
                line-height: 20px;
                padding: 10px 0 10px 20px;
                font-weight: normal;
                background: #FAFCFE;
              }

              td {
                font-size: 12px;
                line-height: 18px;
                padding: 10px 0 10px 20px;
              }
            }
          }
        }
      }

      .tips-text {
        font-size: 13px;
        color: red;
        margin-left: 120px;
        line-height: 26px;
      }

      .btn-box {
        width: 100%;
        text-align: center;
        padding: 20px 0;

        button {
          width: 70px;
          height: 30px;
          font-size: 14px;
          color: #fff;
          border-radius: 3px;
          outline: none;
          cursor: pointer;

          &.cancel {
            border: 1px solid #dedede;
            color: #666;
            background: #fff;

            &:hover {
              background: #f3f3f3;
            }
          }

          &.hold {
            border: 1px solid $color-theme;
            background-color: $color-theme;
            color: #fff;
            margin: 0 0 0 10px;

            &:hover {
              background-color: $color-theme-hover;
              border: 1px solid $color-theme-hover;
            }
          }
        }
      }
    }
  }
</style>
