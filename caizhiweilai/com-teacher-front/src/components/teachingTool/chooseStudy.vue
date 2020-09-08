<template>
<div class="study-dialog">
  <div class="cont">
    <p class="title">{{titleText}}<i class="iconfont" @click="cancleChoose">&#xe60e;</i></p>
    <div class="tab-switch">
      <span v-for="(item, i) in switchBtn" :key="i" @click="switchClick(i)" :class="{'active':i == currentIndex}">{{item}}</span>
      <button @click="lookLotteryResult">查看往期结果</button>
    </div>
    <div class="tab-cont">
      <div class="search-box" v-if="show0 || show1">
        <input type="text" placeholder="请输入您要搜索的内容" v-model="searchText">
        <i class="iconfont">&#xe642;</i>
        <span class="static">已选择 <em>{{chooseNum}} 个</em></span>
      </div>
      <div class="custom-opera" v-if="show2">
        <span class="add-btn" @click="addNewStudy">添加</span>
        <span class="add-num">已添加 <em>{{chooseNum}} 个</em></span>
      </div>
      <div class="list-cont" v-if="show0">
        <p v-for="(item, index) in dataJson.data1" :key="item.showStudentId" :class="{active:index%10<5}" :title="item.studentName">
          <i class="iconfont" v-html="item.isCheck ? '&#xe715;' : '&#xe714;'" @click="clickChoose(item,0)" :class="{active:item.isCheck}"></i>
          <span>{{item.studentName}}</span>
        </p>
        <div v-if="dataJson.data1.length == 0" class="nodata-tips">暂无数据</div>
      </div>
      <div class="list-cont" v-if="show1">
        <p v-for="(item, index) in dataJson.data2" :key="item.showTeamId" :class="{active:index%10<5}" :title="item.teamName">
          <i class="iconfont" v-html="item.isCheck ? '&#xe715;' : '&#xe714;'" @click="clickChoose(item,1)" :class="{active:item.isCheck}"></i>
          <span>{{item.teamName}}</span>
        </p>
        <div v-if="dataJson.data2.length == 0" class="nodata-tips">暂无数据</div>
      </div>
      <div class="list-cont" v-if="show2">
        <p v-for="(item, index) in dataJson.data3" :key="item.id" :class="{active:index%10<5}" :title="item.name">
          <i class="iconfont" v-html="item.isCheck ? '&#xe715;' : '&#xe714;'" @click="clickChoose(item,2)" :class="{active:item.isCheck}"></i>
          <span>{{item.name}}</span>
          <em class="iconfont" @click="delAddStudy(item)">&#xe60e;</em>
        </p>
        <div v-if="dataJson.data3.length == 0" class="nodata-tips">暂无数据</div>
      </div>
      <div class="check-all" v-if="show0 || show1" @click="checkAll">
        <i class="iconfont" v-html="isCheckall ? '&#xe715;' : '&#xe714;'" :class="{active:isCheckall}"></i>全选
      </div>
      <div class="btn-box" :class="{'no-top':show0 || show1}">
        <button class="cancel" @click="cancleChoose">取消</button>
        <button class="hold" @click="starLottery">开始</button>
      </div>
    </div>
  </div>
  <!-- 新增自定义学生 -->
  <add-study v-if="showAdd" @closeAdd="closeAdd" @addStudy="addStudy"></add-study>
</div>
</template>

<script>
import {
  getLotteryStudy,
  beginLottery,
  lookOldResult
} from '@/api/teamAdmin'
import addStudy from '@/components/teachingTool/addStudy'
import {
  _debounce
} from '@/common/js/utils'
import {
  mapState
} from 'vuex'
export default {
  name: 'chooseStudy',
  data() {
    return {
      switchBtn: ['按学生', '按团队', '自定义'],
      isCheckall: false, // 是否全选反选
      showAdd: false, // 新增弹窗显示
      show0: true, // 显示学生内容
      show1: false, // 显示团队内容
      show2: false, // 显示自定义内容
      currentIndex: 0, // 选中状态
      defaultType: 1, // 默认加载学生端数据2是团队数据
      searchText: '', // 模糊搜素关键词
      titleText: '选取抽取目标',
      chooseNum: 0, // 已选择多少条
      dataJson: {
        data1: [], // 抽奖的学生数据
        data2: [], // 抽奖的团队数据
        data3: [], // 自定义学生数据
        choose1: [], // 已选择的抽奖学生
        choose2: [], // 已选择的抽奖团队
        choose3: [] // 已选择的自定义数据
      }
    }
  },
  components: {
    addStudy
  },
  mounted() {
    // 唤起弹窗判断需不需要加载数据
    if (this.dataJson.data1.length == 0) {
      this.getLotteryData()
    }
  },
  watch: {
    searchText(newVal, oldVal) {
      const _this = this
      this.searchs(newVal, _this)
    }
  },
  methods: {
    // 模糊搜索学生或团队
    searchs: _debounce((val, that) => {
      that.getLotteryData()
    }, 400),
    // 点击切换显示内容
    switchClick(i) {
      this.show0 = false
      this.show1 = false
      this.show2 = false
      this.currentIndex = i
      this.searchText = ''
      this['show' + i] = true
      this.defaultType = i + 1
      const _data = this.dataJson['data' + this.defaultType]
      const _chooseData = this.dataJson['choose' + this.defaultType]
      this.chooseNum = _chooseData.length
      // 切换时判断是不是已经全选
      if (_data.length == _chooseData.length) {
        this.isCheckall = true
      } else {
        this.isCheckall = false
      }
      // 自定义时不用请求接口
      if (i != 2) {
        // 当按学生或团队时判断当前是不是已经请求了数据
        if (_data.length == 0) {
          this.getLotteryData()
        }
      }
    },
    // 获取抽奖学生
    getLotteryData() {
      const _this = this
      const postData = {
        classId: localStorage.getItem('classId'),
        carouselType: this.defaultType,
        keywords: this.searchText
      }
      getLotteryStudy(postData).then(res => {
        if (res.code == 0) {
          const _choosedData = _this.dataJson['choose' + _this.defaultType]
          const _choosedId = _choosedData.map(item => {
            if (_this.defaultType == 1) {
              return item.showStudentId
            }
            if (_this.defaultType == 2) {
              return item.showTeamId
            }
          })
          if (_this.defaultType == 1) {
            _this.dataJson.data1 = res.result
            for (let i = 0, size = _this.dataJson.data1.length; i < size; i++) {
              if (_choosedId.includes(_this.dataJson.data1[i].showStudentId)) {
                _this.dataJson.data1[i].isCheck = true
              } else {
                _this.dataJson.data1[i].isCheck = false
              }
            }
          }
          if (this.defaultType == 2) {
            _this.dataJson.data2 = res.result
            for (let i = 0, size = _this.dataJson.data2.length; i < size; i++) {
              if (_choosedId.includes(_this.dataJson.data2[i].showTeamId)) {
                _this.dataJson.data2[i].isCheck = true
              } else {
                _this.dataJson.data2[i].isCheck = false
              }
            }
          }
          // 判断当前是不是全选状态
          if (_this.dataJson['choose' + _this.defaultType].length == _this.dataJson['data' + _this.defaultType].length) {
            _this.isCheckall = true
          } else {
            _this.isCheckall = false
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 全选反选
    checkAll() {
      const _currentDta = this.dataJson['data' + this.defaultType]
      if (this.isCheckall) {
        this.isCheckall = false
        for (let i = 0, size = _currentDta.length; i < size; i++) {
          _currentDta[i].isCheck = false
        }
        this.dataJson['choose' + this.defaultType] = []
      } else {
        this.isCheckall = true
        for (let i = 0, size = _currentDta.length; i < size; i++) {
          _currentDta[i].isCheck = true
        }
        this.dataJson['choose' + this.defaultType] = []
        this.dataJson['choose' + this.defaultType] = _currentDta
      }
      this.chooseNum = this.dataJson['choose' + this.defaultType].length
      this.dataJson['data' + this.defaultType] = JSON.parse(JSON.stringify(_currentDta))
    },
    // 点击选择
    clickChoose(obj, _type) {
      let isOpen = false
      if (obj.isCheck) {
        isOpen = true
      }
      const num = _type + 1
      const idName = ['showStudentId', 'showTeamId', 'id']
      const currentData = this.dataJson['data' + num]
      for (let i = 0, size = currentData.length; i < size; i++) {
        if (obj[idName[_type]] == currentData[i][idName[_type]]) {
          if (isOpen) {
            currentData[i].isCheck = false
            this.handleData(obj, 'del', _type)
          } else {
            currentData[i].isCheck = true
            this.handleData(obj, 'add', _type)
          }
        }
      }
      this.dataJson['data' + num] = [...currentData]
    },
    // 处理已经选择的
    handleData(str, _type, dataName) {
      const _data = this.dataJson['choose' + (dataName + 1)]
      const idName = ['showStudentId', 'showTeamId', 'id']
      if (_type == 'del') {
        for (let i = 0, size = _data.length; i < size; i++) {
          if (str[idName[dataName]] == _data[i][idName[dataName]]) {
            _data.splice(i, 1)
            this.isCheckall = false
            break
          }
        }
      }
      if (_type == 'add') {
        _data.push(str)
      }
      this.dataJson['choose' + (dataName + 1)] = [..._data]
      this.chooseNum = this.dataJson['choose' + (dataName + 1)].length
    },
    // 唤起添加新学生弹窗
    addNewStudy() {
      this.showAdd = true
    },
    // 关闭添加学生弹窗
    closeAdd() {
      this.showAdd = false
    },
    // 添加学生
    addStudy(obj) {
      this.showAdd = false
      this.dataJson.data3.push(obj)
      this.handleData(obj, 'add', 2)
    },
    // 开始摇奖
    starLottery() {
      const _this = this
      let sendStudent = []
      let sendTeam = []
      let sendCustom = []
      const num = this.defaultType
      const currentChoose = this.dataJson['choose' + num]
      // 判断当前
      if (currentChoose.length < 3) {
        this.$message({
          type: 'warning',
          message: '请选择学生或者团队的数量最少是3个'
        })
        return false
      }
      // 学生类型
      if (this.defaultType == 1) {
        for (let i = 0, size = currentChoose.length; i < size; i++) {
          sendStudent.push(currentChoose[i].showStudentId)
        }
        sendStudent = sendStudent.join(',')
        sendTeam = ''
        sendCustom = ''
      }
      // 团队类型
      if (this.defaultType == 2) {
        for (let j = 0, size = currentChoose.length; j < size; j++) {
          sendTeam.push(currentChoose[j].showTeamId)
        }
        sendTeam = sendTeam.join(',')
        sendCustom = ''
        sendStudent = ''
      }
      // 自定义类型
      if (this.defaultType == 3) {
        for (let k = 0, size = currentChoose.length; k < size; k++) {
          sendCustom.push(currentChoose[k].name)
        }
        sendCustom = sendCustom.join(',')
        sendStudent = ''
        sendTeam = ''
      }
      // 请求参数
      const postData = {
        classId: localStorage.getItem('classId'),
        carouselType: this.defaultType,
        teamId: sendTeam,
        studentId: sendStudent,
        customId: sendCustom,
        creator: localStorage.getItem('userId')
      }
      beginLottery(postData).then(res => {
        if (res.code == 0) {
          console.log(res)
          // 关闭选择学生
          _this.$store.commit('setTurntableShow', false)
          // 显示转盘
          _this.$store.commit('setTurnLottery', true)
          // 把当前抽奖的id传递给抽奖组件
          _this.$store.commit('setLotteryId', res.result)
          // 把选中的学生或者团队传递给抽奖组件
          _this.$store.commit('setLotteryPerson', currentChoose)
          // 设置摇奖类型
          _this.$store.commit('setLotteryType', num)
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 查看往期结果
    lookLotteryResult() {
      const _this = this
      const posData = {
        classId: localStorage.getItem('classId'),
        page: 1,
        size: 10
      }
      lookOldResult(posData).then(res => {
        if (res.code) {
          const resultData = res.result ? res.result : {
            total: 0,
            page: 1,
            size: 10,
            data: []
          }
          _this.$store.commit('setOldLottery', resultData)
          this.$store.commit('setLookLotteryResult', true)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 关闭选择学生弹窗
    cancleChoose() {
      this.$store.commit('setTurntableShow', false)
    },
    // 删除新增的学生
    delAddStudy(obj) {
      const _id = obj.id
      const _oldChoose = this.dataJson.choose3
      const _oldCustorm = this.dataJson.data3
      for (let i = 0, size = _oldChoose.length; i < size; i++) {
        if (_id == _oldChoose[i].id) {
          this.dataJson.choose3.splice(i, 1)
          break
        }
      }
      for (let j = 0, num = _oldCustorm.length; j < num; j++) {
        if (_id == _oldCustorm[j].id) {
          this.dataJson.data3.splice(j, 1)
          break
        }
      }
      this.chooseNum = this.dataJson.data3.length
    }
  }
}
</script>

<style scoped lang="scss">
.study-dialog {
    @include maskLayer($z:2000);
    .cont {
        background: #fff;
        width: 930px;
        border-radius: 4px;
        .title {
            font-size: 18px;
            color: #444;
            line-height: 20px;
            position: relative;
            padding: 20px 30px;
            i {
                position: absolute;
                right: 0;
                top: 0;
                padding: 20px;
                cursor: pointer;
                color: #929292;
            }
        }
        .tab-switch {
            line-height: 40px;
            border-bottom: 1px solid #F3F4F5;
            display: flex;
            box-sizing: border-box;
            padding:0 30px;
            position: relative;
            span {
                padding: 0 16px;
                line-height: 40px;
                box-sizing: border-box;
                cursor: pointer;
                font-size: 13px;
                color: #666666;
                &.active {
                    margin-bottom: -1px;
                    border-bottom: 2px solid $color-theme;
                }
            }
            button {
                background: $color-theme;
                border: 0;
                font-size: 12px;
                line-height: 32px;
                border-radius: 2px;
                padding: 0 14px;
                color: #fff;
                outline: none;
                cursor: pointer;
                text-align: center;
                position: absolute;
                right: 38px;
                top: 3px;
            }
        }
        .tab-cont {
            margin: 30px 30px 20px;
            .custom-opera {
                .add-btn {
                    width: 100px;
                    height: 32px;
                    display: inline-block;
                    line-height: 32px;
                    text-align: center;
                    font-size: 12px;
                    border-radius: 3px;
                    background: $color-theme;
                    color: #fff;
                    cursor: pointer;
                }
                .add-num {
                    display: inline-block;
                    line-height: 32px;
                    font-size: 14px;
                    margin-left: 12px;
                    em {
                        font-style: normal;
                        color: $color-theme;
                    }
                }
            }
            .search-box {
                height: 32px;
                text-align: right;
                position: relative;
                font-size: 12px;
                color: #666;
                @include setInput;
                input {
                    height: 100%;
                    box-sizing: border-box;
                    border: 1px solid #DCDFE6;
                    border-radius: 3px;
                    width: 170px;
                    padding: 0 26px 0 12px;
                    outline: none;
                }
                i {
                    position: absolute;
                    top: 0;
                    right: 8px;
                    cursor: pointer;
                    height: 100%;
                    line-height: 34px;
                    color: #DCDFE6;
                    font-size: 16px;
                }
                .static {
                    position: absolute;
                    left: 0;
                    line-height: 32px;
                    font-size: 14px;
                    em {
                        font-style: normal;
                        color: $color-theme;
                    }
                }
            }
            .list-cont {
                border: 1px solid #EDEDED;
                margin-top: 20px;
                display: flex;
                flex-wrap: wrap;
                max-height: 400px;
                overflow-y: auto;
                .nodata-tips {
                    line-height: 60px;
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                    width: 100%;
                }
                p {
                    width: 20%;
                    display: flex;
                    line-height: 40px;
                    font-size: 13px;
                    &.active {
                        background: #F8F8F8;
                    }
                    i {
                        margin: 0 20px 0 24px;
                        color: #999;
                        font-size: 14px;
                        cursor: pointer;
                        &.active {
                            color: $color-theme;
                        }
                    }
                    span {
                        flex: 1;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        padding-right: 12px;
                        color: #333333;
                    }
                    em {
                        font-style: normal;
                        color: #999999;
                        font-size: 14px;
                        margin-right: 6px;
                        cursor: pointer;
                    }
                }
            }
            .check-all {
                display: inline-block;
                font-size: 14px;
                color: #666;
                line-height: 32px;
                cursor: pointer;
                margin-top:10px;
                i {
                    font-size: 14px;
                    color: #666;
                    margin-right: 6px;
                    &.active {
                        color: $color-theme;
                    }
                }
            }
            .btn-box {
                text-align: center;
                margin-top: 32px;
                &.no-top {
                    margin-top: 0;
                }
                button {
                    width: 120px;
                    height: 36px;
                    border: 1px solid #E8E9ED;
                    border-radius: 3px;
                    font-size: 14px;
                    color: #8993AB;
                    text-align: center;
                    outline: none;
                    background: #fff;
                    cursor: pointer;
                    &.cancel {
                        margin-right: 10px;
                        &:hover {
                            background: #f3f3f3;
                        }
                    }
                    &.hold {
                        background: $color-theme;
                        border: 1px solid $color-theme;
                        color: #fff;
                        &:hover {
                            background: $color-theme-hover;
                            border: 1px solid $color-theme-hover;
                        }
                    }
                }
            }
        }
    }
}
</style>
