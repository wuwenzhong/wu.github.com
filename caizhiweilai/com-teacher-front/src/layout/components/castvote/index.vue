<template>
<div class="vote">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="按学生" name="first">
      <div class="searchjg">
        <div class="titlevote">
          <span>请输入标题：</span>
          <el-input
            type="text"
            placeholder="请输入标题"
            v-model="teachVoteTitle"
            maxlength="20"
            show-word-limit
            size="small"
          >
          </el-input>
        </div>
        <el-input placeholder="请您输入需要搜索的内容" suffix-icon="el-icon-search" size="small" v-model.trim="search" @input="searchContent"></el-input>
      </div>
      <el-checkbox-group v-model="checkedCitiesxs" @change="handleCheckedCitiesChangexs">
        <el-checkbox v-for="(city,index) in cities" :label="city" :key="index" :title="city.studentName">{{city.studentName}}</el-checkbox>
      </el-checkbox-group>
      <div style="margin: 15px 0;"></div>
      <div class="voteBottom">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllxs" @change="handleCheckAllChangexs">全选</el-checkbox>
        <div>
          每人最多投
          <el-input-number v-model="ticket" @change="inputgr" :min="1" :max="3" style="height:100%;margin: 0 5px;" size='mini'></el-input-number>
          票
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="按团队" name="second">
      <div class="searchjg">
        <div class="titlevote">
          <span>请输入标题：</span>
          <el-input
            type="text"
            placeholder="请输入标题"
            v-model="teachVoteTitle"
            maxlength="20"
            show-word-limit
            size="small"
          >
          </el-input>
        </div>
        <el-input placeholder="请您输入需要搜索的内容" suffix-icon="el-icon-search" size="small" v-model.trim="search" @input="searchContent"></el-input>
      </div>
      <el-checkbox-group v-model="checkedCitiestd" @change="handleCheckedCitiesChangetd">
        <el-checkbox v-for="(city,index) in citiestd" :label="city" :key="index" :title="city.teamName">{{city.teamName}}</el-checkbox>
      </el-checkbox-group>
      <div style="margin: 15px 0;"></div>
      <div class="voteBottom">
        <el-checkbox :indeterminate="isIndeterminatetd" v-model="checkAlltd" @change="handleCheckAllChangetd">全选</el-checkbox>
        <div>
          每人最多投
          <el-input-number v-model="ticket" @change="inputgr" :min="1" :max="3" style="height:100%;margin: 0 5px;" size='mini'></el-input-number>
          票
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="自定义" name="third">
      <div class="zdyTitke">
        <div class="titlevote">
          <span>请输入标题：</span>
          <el-input
            type="text"
            placeholder="请输入标题"
            v-model="teachVoteTitle"
            maxlength="20"
            show-word-limit
            size="small"
          >
          </el-input>
        </div>
        <div class="increase" @click="add">添加</div>
      </div>
      <el-checkbox-group v-model="checkedCitieszdy" @change="handleCheckedCitiesChangezdy" style="margin-top:15px">
        <el-checkbox v-for="(city,index) in citieszdy" :label="city" :key="index" class="zdyName" :title="city">
          <p>{{city}}</p>
          <span @click="delName(index)">X</span>
        </el-checkbox>
      </el-checkbox-group>
      <div style="margin: 15px 0;"></div>
      <div class="voteBottom">
        <el-checkbox :indeterminate="isIndeterminatezdy" v-model="checkAllzdy" @change="handleCheckAllChangezdy">全选</el-checkbox>
        <div>
          每人最多投
          <el-input-number v-model="ticket" @change="inputgr" :min="1" :max="3" style="height:100%;margin: 0 5px;" size='mini'></el-input-number>
          票
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <div class="result" @click="oldResult">查看往期结果</div>
  <!-- 查看往期结果 -->
  <el-dialog width="930px" title="往期结果" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
    <div class="outline">
      <div class="titleResult">
        <div class="lx">类型</div>
        <div class="fist">第一名</div>
        <div class="startTime">发起时间</div>
        <div class="voteRes reslst">投票结果</div>
      </div>
      <div v-show="total == 0" class="noData">暂无数据</div>
      <div class="titleResult" v-for="(item,index) in tableData" :key="index">
        <div class="lx">{{item.voteTypeName}}</div>
        <div class="fist">{{item.name}}</div>
        <div class="startTime">{{item.createTime}}</div>
        <div class="voteRes overlook" @mouseenter="handleClicklook(item,'true')" @mouseleave="handleClicklook(item,'false')">
          <span v-show="item.status=='0'" @click="over(item)">结束</span>
          <span class="lookSpan">查看</span>
          <!--  -->
        </div>
        <ul v-show="grId ==item.id">
          <li>参与项</li>
          <li v-for="(item,index) in item.voteUserDTOList" :key="index">
            <span>{{item.name}}</span>（{{item.voteNum}} 票）
          </li>
        </ul>
      </div>
    </div>
    <!-- 分页 -->
    <pagination :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.size" @pagination="oldResult" v-show="total>10"/>
    <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = false">确 定</el-button>
      </div> -->
  </el-dialog>
  <!-- 添加 -->
  <el-dialog title="添加自定义" :visible.sync="addStudent" width="520px" append-to-body :close-on-click-modal="false">
    <template>
      <div class="addContent">
        <span>自定义名称</span>
        <el-input v-model="student" placeholder="请输入自定义名称"></el-input>
      </div>
      <span slot="footer" class="dialog-footer" style="display:block;text-alint:center">
        <el-button @click="addStudent = false">取 消</el-button>
        <el-button type="primary" @click="addPeople">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <span slot="footer" class="dialog-footer" style="display:block;text-align: center;">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="define">确 定</el-button>
  </span>
</div>
</template>

<script>
import {
  showusers,
  sureVote,
  allVote,
  singVote,
  stopVote
} from '@/api/vote'
export default {
  props: ['wqjg'],
  data() {
    return {
      activeName: 'first',
      checkAllxs: false,
      checkAlltd: false,
      checkAllzdy: false,
      checkedCitiesxs: [], // 默认选中的多选框
      checkedCitiestd: [], // 默认选中的多选框
      checkedCitieszdy: [], // 默认选中的多选框
      cities: [],
      citiestd: [],
      citieszdy: [],
      isIndeterminate: true,
      isIndeterminatetd: true,
      isIndeterminatezdy: true,
      search: '',
      ticket: '1',
      innerVisible: false,
      tableData: [],
      addStudent: false,
      student: '',
      voteLast: false,
      personalxs: [],
      personaltd: [],
      clicktitle: '1',
      voteType: '',
      grId: '',
      queryParams: {
        page: 1,
        size: 10
      },
      total: 0,
      teachVoteTitle: ''
    }
  },
  created() {
    if (this.wqjg == '2') {
      this.oldResult()
    }
  },
  mounted() {
    this.init()
    document.documentElement.style.overflowY = 'hidden'
  },
  methods: {
    init() {
      // 学生
      showusers({
        classId: localStorage.getItem('classId'),
        // classId: '719879497055399936',
        carouselType: '1',
        keywords: ''
      }).then(res => {
        console.log(res)
        if (res.code == '0' || res.code == 0) {
          this.cities = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
      // 团队
      showusers({
        classId: localStorage.getItem('classId'),
        // classId: '719879497055399936',
        carouselType: '2',
        keywords: ''
      }).then(res => {
        console.log(res)
        if (res.code == '0' || res.code == 0) {
          this.citiestd = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    inputgr(val) {
      if (val < 1) {
        this.ticket = 1
        this.$message({
          type: 'warning',
          message: '所投票数不能小于1'
        })
      } else if (val >= 5) {
        this.ticket = 5
        this.$message({
          type: 'warning',
          message: '所投票数最大不能大于5哦'
        })
      }
    },
    handleClick(tab, event) {
      // 搜索内容为空
      this.search = ''
      // 判断点击的哪个
      if (tab.label == '按学生') {
        this.clicktitle = '1'
      } else if (tab.label == '按团队') {
        this.clicktitle = '2'
      } else {
        this.clicktitle = '3'
      }
    },
    handleClicklook(rowid, buer) {
      if (buer == 'true') {
        this.grId = rowid.id
      } else {
        this.grId = ''
      }
    },
    over(item) {
      this.$confirm('此操作将结束投票, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        // 需要结束投票的id
        localStorage.setItem('overtp', item.id)
        stopVote({
          id: item.id
        }).then(res => {
          if (res.code == '0' || res.code == 0) {
            // 刷新往期结果
            this.oldResult()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消结束投票'
        })
      })
    },
    handleCheckAllChangexs(val) {
      this.checkedCitiesxs = val ? this.cities : []
      this.isIndeterminate = this.checkedCitiesxs.length > 0 && this.checkedCitiesxs.length < this.cities.length
    },
    handleCheckedCitiesChangexs(value) {
      console.log(value)
      this.isIndeterminate = value.length > 0 && value.length < this.cities.length
      // 个人选择的数组
      this.personalxs = value
    },
    handleCheckAllChangetd(val) {
      console.log(val)
      this.checkedCitiestd = val ? this.citiestd : []
      this.isIndeterminatetd = this.checkedCitiestd.length > 0 && this.checkedCitiestd.length < this.citiestd.length
    },
    handleCheckedCitiesChangetd(value) {
      this.isIndeterminatetd = value.length > 0 && value.length < this.citiestd.length
      // 团队选择的数组
      this.checkedCitiestd = value
    },
    handleCheckAllChangezdy(val) {
      this.checkedCitieszdy = val ? this.citieszdy : []
      this.isIndeterminatezdy = this.checkedCitieszdy.length > 0 && this.checkedCitieszdy.length < this.citieszdy.length
    },
    handleCheckedCitiesChangezdy(value) {
      this.isIndeterminatezdy = value.length > 0 && value.length < this.citieszdy.length
      this.checkedCitieszdy = value
    },
    searchContent(val) {
      // 搜索内容
      clearTimeout(this.searchTime)
      this.searchTime = setTimeout(() => {
        showusers({
          classId: localStorage.getItem('classId'),
          carouselType: this.clicktitle,
          keywords: val
        }).then(res => {
          if (res.code == '0' || res.code == 0) {
            if (this.clicktitle == '1') {
              this.cities = res.result
            } else {
              this.citiestd = res.result
            }
          } else if (this.clicktitle == '2') {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }, 500)
    },
    oldResult() {
      allVote({
        classId: localStorage.getItem('classId'),
        teacherId: localStorage.getItem('userId'),
        page: this.queryParams.page,
        size: this.queryParams.size
      }).then(res => {
        if (res.code == '0' || res.code == 0) {
          this.innerVisible = true
          this.tableData = res.result.data
          this.total = Number(res.result.total)
          // console.log(this.tableData)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    add() {
      // 添加
      this.addStudent = true
    },
    cancel() {
      this.$emit('hiddentp', '1')
    },
    addPeople() {
      this.addStudent = false
      this.citieszdy.push(this.student)
      // 清空添加框中的数据
      this.student = ''
    },
    delName(index) {
      // 删除数组中的某一个值
      this.$nextTick(function () {
        this.citieszdy.splice(index, 1)
      })
    },
    define() {
      const checkArr = []
      if (this.clicktitle == '1') {
        for (let index = 0; index < this.checkedCitiesxs.length; index++) {
          checkArr.push(this.checkedCitiesxs[index].showStudentId)
        }
        this.voteType = '0'
      } else if (this.clicktitle == '2') {
        for (let index = 0; index < this.checkedCitiestd.length; index++) {
          checkArr.push(this.checkedCitiestd[index].showTeamId)
        }
        this.voteType = '1'
      } else {
        for (let index = 0; index < this.checkedCitieszdy.length; index++) {
          checkArr.push(this.checkedCitieszdy[index])
        }
        this.voteType = '2'
      }
      if (this.teachVoteTitle == '') {
        this.$message({
          type: 'warning',
          message: '标题不能为空！'
        })
        return false
      }
      if (checkArr.length < 3) {
        this.$message({
          type: 'warning',
          message: '学生投票至少是三个！'
        })
        return false
      }
      sureVote({
        classId: localStorage.getItem('classId'),
        teacherId: localStorage.getItem('userId'),
        voteType: this.voteType,
        voteNum: this.ticket,
        values: checkArr,
        title: this.teachVoteTitle
      }).then(res => {
        if (res.code == 0) {
          this.$emit('hiddentp', '2')
          const socketJson = {
            type: 'com', // 综合实训平台
            messageType: 'startVote', // 投票
            receiverId: localStorage.getItem('classId'), // 接收人id
            sessionType: 'p2c', // p2p p2c p2t people to people  people to class  people team
            content: {
              classId: localStorage.getItem('classId'),
              voteId: res.result,
              title: this.teachVoteTitle
            }
          }
          this.sendWspush(JSON.stringify(socketJson))
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
  scrollbar-width: none; /* Firefox */
}
.noData{
  line-height: 100px;
  text-align: center;
  font-size: 16px;
}
.el-checkbox-group {
    overflow-y: scroll;
    height: 200px;
}
.outline {
    border: 1px solid #c7c7c7;
    // border-bottom: none;
    margin-bottom: 20px;
    height: 350px;
    overflow-y: scroll;
    margin: 0 15px;
}
.titlevote{
  display: flex;
  justify-content: center;
  align-items: center;
}
.zdyTitke{
  display: flex;
  justify-content: space-between;
}
.titleResult {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #c7c7c7;
    // position: relative;
    div {
        padding: 5px;
        text-align: left;
        cursor: pointer;
        border-right: 1px solid #c7c7c7;
        height: 30px;
    }
    .lx {
        width: 100px;
    }
    .fist {
        width: 100px;
    }
    .startTime {
        width: 180px;
    }
    .voteRes {
        width: 100px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .reslst {
        border-right: none;
    }
    .overlook {
        position: relative;
        border-right: none;
        .lookSpan:hover {
            color: #36CEA9;
        }
    }
    ul {
        position: absolute;
        background: white;
        z-index: 999;
        top: 62px;
        right: -150px;
        padding: 10px;
        box-shadow: 0 2px 8px 0 rgba(224,226,232,1);
        li {
            padding: 5px;
            text-align: center;
            width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
                display: inline-block;
                width: 60px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
.el-checkbox-group {
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    .el-checkbox {
        width: 17%;
    }
}
.zdyName {
    position: relative;
    p {
        width: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
    }
    span {
        position: absolute;
        top: 0;
        right: 5px;
    }
}
.vote {
    position: relative;
    padding: 0 15px;
    .searchjg {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .result {
        position: absolute;
        right: 15px;
        top: 0;
        width: 100px;
        height: 32px;
        background: rgba(54, 206, 169, 1);
        border-radius: 2px;
        text-align: center;
        color: white;
        line-height: 32px;
        cursor: pointer;
    }
    .el-input {
        width: 220px;
        height: 32px;
        border-radius: 2px;
    }
    .el-checkbox {
        margin: 10px;
    }
    .voteBottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
            position: relative;
            .el-input {
                width: 80px;
                .el-input__inner {
                    width: 100%;
                }
            }
        }
    }
}
.addContent {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
        width: 100px;
    }
}
.el-table .cell {
    position: relative;
    .namelist {
        position: absolute;
        right: 0;
        top: 0;
    }
}
.increase {
    width: 100px;
    height: 32px;
    background: rgba(54,206,169,1);
    border-radius: 2px;
    text-align: center;
    line-height: 32px;
    color: white;
    cursor: pointer;
}
</style>
