<template>
<div class="ranking-box">
  <div class="cont" ref="rankingCont">
    <img :src="titleImgData[currentIndex]" alt="" class="title">
    <i class="close-ranking" @click="closeRanking"></i>
    <div class="switch-btn">
      <span v-for="(item,index) in typeData" :title="index==0?'学生类型':'团队类型'" :class="{'active':currentIndex == index}" :key="index" @click="switchLook(index)">
        <img :src="item" alt="">
      </span>
    </div>
    <div class="operation-box">
      <span class="add-btn" @click="batchModifu"><i></i>批量设置</span>
      <div class="search-box">
        <i></i>
        <input type="text" :placeholder="placeholderText[currentIndex]" v-model="searchText">
        <b>搜索</b>
      </div>
    </div>
    <ul class="top-three" v-if="currentIndex == 0">
      <li v-for="(item,index) in topThreeData" :key="item.id">
        <div class="person-pic">
          <img :src="item.photo == '' ? (item.gender == 2?defaultPic[0]:defaultPic[1]) : item.photo" alt="">
          <b>{{item.rank}}</b>
        </div>
        <i v-if="index == 0" class="first"></i>
        <p class="name">{{item.userName}}</p>
        <div class="top-three-opera">
          <div class="rank-num"><i class="iconfont">&#xe60d;</i>{{item.score}}</div>
          <div :data-id="item.id" class="input-change">
            <div class="iconfont">&#xe680;
              <dl class="num-list">
                <dd v-for="(vals , size) in fractionList" :key="size" :data-id="item.id" @click="operaIntegral($event,'del','stud', vals)">
                  -{{vals}}
                </dd>
              </dl>
            </div>
            <input type="text" :value="item.score" @blur="inputChange($event, item)" onkeyup="value=value.replace(/[^\d]/g, '')">
            <span class="iconfont sign-icon">&#xe60d;</span>
            <div class="iconfont">&#xe72c;
              <dl class="num-list">
                <dd v-for="(worth , len) in fractionList" :key="len" :data-id="item.id" @click="operaIntegral($event,'add','stud', worth)">
                  +{{worth}}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <ul class="top-three" v-if="currentIndex == 1">
      <li v-for="(item,index) in topThreeData" :key="item.id">
        <div class="person-pic">
          <img :src=" item.gender == 2?defaultPic[0]:defaultPic[1]" alt="">
          <b>{{item.rank}}</b>
        </div>
        <i v-if="index == 0" class="first"></i>
        <p class="name">{{item.teamName}}</p>
        <div class="top-three-opera">
          <div class="rank-num"><i class="iconfont">&#xe60d;</i>{{item.score}}</div>
          <div :data-id="item.id" class="input-change">
            <div class="iconfont">&#xe680;
              <dl class="num-list">
                <dd v-for="(vals , size) in fractionList" :key="size" :data-id="item.id" @click="operaIntegral($event,'del','stud', vals)">
                  -{{vals}}
                </dd>
              </dl>
            </div>
            <input type="text" :value="item.score" @blur="inputChange($event, item)" onkeyup="value=value.replace(/[^\d]/g, '')">
            <span class="iconfont sign-icon">&#xe60d;</span>
            <div class="iconfont">&#xe72c;
              <dl class="num-list">
                <dd v-for="(worth , len) in fractionList" :key="len" :data-id="item.id" @click="operaIntegral($event,'add','stud', worth)">
                  +{{worth}}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="scroll-box" ref="scrollBoxParent">
      <el-scrollbar style="height: 100%" ref="scrollBox">
        <ul v-if="currentIndex == 0 && studyRankingData.length > 0">
          <li v-for="(item,i) in studyRankingData" :key="item.id">
            <span class="rank-index">{{item.rank}}</span>
            <p class="name"><img :src="item.photo == '' ? (item.gender == 0?defaultPic[0]:defaultPic[1]) : item.photo" alt=""><span>{{item.userName}}</span></p>
            <p class="poll-num"><i class="iconfont">&#xe60d;</i><span>{{item.score}}</span></p>
            <div :data-id="item.id" class="input-change">
              <div class="iconfont">&#xe680;
                <ul class="num-list" :class="{'change-dircect':(i>studyRankingData.length-4 && studyRankingData.length >= 5)}">
                  <li v-for="(vals , size) in fractionList" :key="size" :data-id="item.id" @click="operaIntegral($event,'del','stud', vals)">
                    -{{vals}}
                  </li>
                </ul>
              </div>
              <input type="text" :value="item.score" @blur="inputChange($event, item)" onkeyup="value=value.replace(/[^\d]/g, '')">
              <span class="iconfont sign-icon">&#xe60d;</span>
              <div class="iconfont">&#xe72c;
                <ul class="num-list" :class="{'change-dircect':(i>studyRankingData.length-4 && studyRankingData.length >= 5)}">
                  <li v-for="(worth , len) in fractionList" :key="len" :data-id="item.id" @click="operaIntegral($event,'add','stud', worth)">
                    +{{worth}}
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <ul v-if="currentIndex == 0 && studyRankingData.length == 0">
          <li style="text-align: center;display:block;color:#666;font-size:14px;">暂无数据~~</li>
        </ul>
        <ul v-if="currentIndex == 1">
          <li v-for="(item,i) in teamRankingData" :key="item.id">
            <span class="rank-index">{{item.rank}}</span>
            <p class="name"><img :src="defaultPic[1]" alt=""><span>{{item.teamName}}</span></p>
            <p class="poll-num"><i class="iconfont">&#xe60d;</i><span>{{item.score}}</span></p>
            <div :data-id="item.id" class="input-change">
              <div class="iconfont">&#xe680;
                <ul class="num-list" :class="{'change-dircect':(i>teamRankingData.length-4 && teamRankingData.length >= 5)}">
                  <li v-for="(vals , size) in fractionList" :key="size" :data-id="item.id" @click="operaIntegral($event,'del','team', vals)">
                    -{{vals}}
                  </li>
                </ul>
              </div>
              <input type="text" :value="item.score" @blur="inputChange($event, item)" onkeyup="value=value.replace(/[^\d]/g, '')">
              <span class="iconfont sign-icon">&#xe60d;</span>
              <div class="iconfont">&#xe72c;
                <ul class="num-list" :class="{'change-dircect':(i>teamRankingData.length-4 && teamRankingData.length >= 5)}">
                  <li v-for="(worth , len) in fractionList" :key="len" :data-id="item.id" @click="operaIntegral($event,'add','team', worth)">
                    +{{worth}}
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <ul v-if="currentIndex == 1 && teamRankingData.length == 0">
          <li style="text-align: center;display:block;color:#666;font-size:14px;">暂无数据~~</li>
        </ul>
      </el-scrollbar>
      <div class="current-ranking" :class="{show:isShowRankPerpeo}" v-if="currentIndex == 0 && !currentLoginObj.isNone">
        <span>{{currentLoginObj.index}}</span>
        <p><img :src="currentLoginObj.photo == '' ? (item.gender == 2?defaultPic[0]:defaultPic[1]): currentLoginObj.photo" alt=""><b>{{currentLoginObj.userName}}</b></p>
        <strong><i class="iconfont">&#xe60d;</i>{{currentLoginObj.score}}</strong>
      </div>
      <div class="current-ranking" :class="{show:isShowRankPerpeo}" v-if="currentIndex == 1 && !currentLoginObj.isNone">
        <span>{{currentLoginObj.index}}</span>
        <p><img :src="currentLoginObj.photo == '' ? (item.gender == 2?defaultPic[0]:defaultPic[1]) : currentLoginObj.photo" alt=""><b>{{currentLoginObj.teamName}}</b></p>
        <strong><i class="iconfont">&#xe60d;</i>{{currentLoginObj.score}}</strong>
      </div>
    </div>
  </div>
  <!--    批量修改弹窗-->
  <batch-change v-if="batchShow" :componentData="componentData" @closeChange="closeChange"></batch-change>
</div>
</template>

<script>
import {
  studentRanking,
  teamRanking,
  alonChangeScore
} from '@/api/teamAdmin'
import BatchChange from './batchChange'
import {
  _debounce
} from '@/common/js/utils'
export default {
  name: 'rankingDialog',
  data() {
    return {
      dialogHeight: '', // 弹窗的实际高度
      isShowRankPerpeo: true, // 是否显示当前账号的排行定位
      currentIndex: 0, // 当前显示的是学生或者团队，0位学生1位团队
      titleImgData: [require('./images/title_pic1.png'), require('./images/title_pic2.png')], // 标题图片路径
      typeData: [require('./images/study_rank.png'), require('./images/team_rank.png')], // 类型数据，学生和团队
      defaultPic: [require('../../common/images/avatar.jpg'), require('../../common/images/default_boy.png')], // 默认头像
      placeholderText: ['输入学生姓名', '输入团队名称'], // 搜索框提示语
      fractionList: ['5', '10', '15', '20'], // 可以添加的分数
      searchText: '', // 团队或者学生榜关键次
      componentData: {}, // 传给修改弹窗的数据
      currentLoginObj: {}, // 当前登录的对象
      batchShow: false, // 是否显示批量修改弹窗
      topThreeData: [], // 前三名数据
      oldStudyRankingData: [], // 存储旧的学生数据
      oldTeamRankingData: [], // 存储旧的团队数据
      studyRankingData: [], // 排行榜数据
      teamRankingData: [], // 排行榜数据
      currentOperaId: '' // 当前编辑的id
    }
  },
  watch: {
    searchText(nice, old) {
      if (nice != '') {
        if (this.currentIndex == 0) {
          // 每次搜索从新复制个gridData
          this.studyRankingData = JSON.parse(JSON.stringify(this.oldStudyRankingData))
          this.studyRankingData = this.studyRankingData.filter(function (product) {
            return product.userName.search(nice.toLowerCase()) > -1
          })
        }
        if (this.currentIndex == 1) {
          // 每次搜索从新复制个gridData
          this.teamRankingData = JSON.parse(JSON.stringify(this.oldTeamRankingData))
          this.teamRankingData = this.teamRankingData.filter(function (product) {
            return product.teamName.search(nice.toLowerCase()) > -1
          })
        }
      } else {
        this.topThreeData = []
        if (this.currentIndex == 0) {
          this.studyRankingData = JSON.parse(JSON.stringify(this.oldStudyRankingData))
          this.topThreeData = this.studyRankingData.splice(0, 3)
        }
        if (this.currentIndex == 1) {
          this.teamRankingData = JSON.parse(JSON.stringify(this.oldTeamRankingData))
          this.topThreeData = this.teamRankingData.splice(0, 3)
        }
      }
    }
  },
  components: {
    BatchChange
  },
  mounted() {
    const _this = this
    this.getRankingData(this.currentIndex)
  },
  methods: {
    // 内容区滚动监听
    handleScroll() {
      const _this = this
      const scrollbarEl = this.$refs.scrollBox.wrap
      // 获取当前账号所在排行位置到滚动区顶部的高度
      const topHeight = (this.currentLoginObj.index - 3) * 50
      scrollbarEl.onscroll = function () {
        if (scrollbarEl.scrollTop > topHeight - 300) {
          _this.isShowRankPerpeo = false
        } else {
          _this.isShowRankPerpeo = true
        }
      }
    },
    // 分数操作
    operaIntegral(e, str, _type, num) {
      const _this = this
      const _id = e.srcElement.dataset.id
      this.searchText = ''
      let computedResult = ''
      let getInputVal = '' // 当前行的分数
      if (str == 'del') {
        getInputVal = e.srcElement.parentElement.parentElement.nextSibling.value
        computedResult = Number(getInputVal) - Number(num)
      }
      if (str == 'add') {
        getInputVal = e.srcElement.parentElement.parentElement.parentElement.childNodes[1].value
        computedResult = Number(getInputVal) + Number(num)
      }
      // 如果计算结果小于0，就传0过去
      if (computedResult < 0) {
        computedResult = 0
      }
      const postDta = {
        id: _id,
        score: computedResult
      }
      alonChangeScore(postDta).then(res => {
        if (res.code == 0) {
          _this.getRankingData(this.currentIndex)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message()
          })
        }
      })
    },
    // 获取学生或者团队红旗榜的数据
    getRankingData(num) {
      const _this = this
      const ajaxName = (num == 0 ? studentRanking : teamRanking)
      const _classId = localStorage.getItem('classId')
      const postData = '?classId=' + _classId + '&keyWords=' + this.searchText
      ajaxName(postData).then(res => {
        if (res.code == 0) {
          _this.currentLoginObj = {} // 清空当前账号对象数据
          if (_this.currentIndex == 0) {
            _this.oldStudyRankingData = JSON.parse(JSON.stringify(res.result))
            _this.studyRankingData = res.result
            _this.getCurrentInfoMessage(_this.studyRankingData)
          } else {
            _this.teamRankingData = res.result
            _this.oldTeamRankingData = JSON.parse(JSON.stringify(res.result))
            _this.getCurrentInfoMessage(_this.teamRankingData)
          }
          // 判断当前登录人员信息对象
          _this.currentLoginObj.isNone = JSON.stringify(_this.currentLoginObj) === '{}'
          // 请求完成以后计算具体位置
          _this.$nextTick(function () {
            _this.handleScroll()
          })
        } else {
          _this.$message.warning({
            message: res.message
          })
        }
      })
    },
    // 提取当前查看类型的，当前对象信息
    getCurrentInfoMessage(_data) {
      this.currentLoginObj = {}
      for (let i = 0, len = _data.length; i < len; i++) {
        if (_data[i].isMe == 1 && this.currentIndex == 0) {
          this.currentLoginObj.userName = _data[i].userName
          this.currentLoginObj.photo = _data[i].photo
          this.currentLoginObj.score = _data[i].score
          this.currentLoginObj.index = i
        }
        if (_data[i].isMe == 1 && this.currentIndex == 1) {
          this.currentLoginObj.userName = _data[i].teamName
          this.currentLoginObj.photo = ''
          this.currentLoginObj.score = _data[i].score
          this.currentLoginObj.index = i
        }
      }
      this.topThreeData = []
      this.topThreeData = _data.splice(0, 3)
      console.log(this.topThreeData, '231231231231')
      // 判断是否需要显示固定当前账号排行位置
      if (_data.length <= 9) {
        this.isShowRankPerpeo = false
      } else {
        this.isShowRankPerpeo = true
      }
    },
    // 切换查看类型
    switchLook(num) {
      this.currentIndex = num
      this.searchText = ''
      this.getRankingData(this.currentIndex)
      // 切换的时候要从新计算
      this.handleScroll()
    },
    // 关闭红旗榜
    closeRanking() {
      this.$store.commit('setRankingShow', false)
    },
    // 批量修改当前的数据
    batchModifu() {
      if (this.currentIndex == 0) {
        this.componentData.currentType = 0
        this.componentData.data = this.oldStudyRankingData
      }
      if (this.currentIndex == 1) {
        this.componentData.currentType = 1
        this.componentData.data = this.oldTeamRankingData
      }
      // 改变当前操作this指向
      this.componentData.data = JSON.parse(JSON.stringify(this.componentData.data))
      this.batchShow = true
    },
    // 关闭批量修改弹窗
    closeChange(str) {
      this.batchShow = false
      this.componentData = {}
      if (str == '1') {
        this.getRankingData(this.currentIndex)
      }
    },
    // 输入框节流改变
    inputUpdate: _debounce((val, that) => {
      const postData = {
        id: that.currentOperaId,
        score: val
      }
      alonChangeScore(postData).then(res => {
        if (res.code == 0) {
          that.getRankingData(that.currentIndex)
          that.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          that.$message({
            type: 'warning',
            message: res.message()
          })
        }
      })
    }, 500),
    // 输入框输入
    inputChange(e, obj) {
      const _this = this
      this.searchText = ''
      // let _times = null
      // 如果按下的不是数字键的时候阻止往下执行
      if (e.srcElement.value == e.srcElement._value) {
        return false
      }
      const _val = e.srcElement.value
      this.currentOperaId = obj.id
      // this.inputUpdate(_val, _this)
      const postData = {
        id: _this.currentOperaId,
        score: _val
      }
      alonChangeScore(postData).then(res => {
        if (res.code == 0) {
          _this.getRankingData(_this.currentIndex)
          _this.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          _this.$message({
            type: 'warning',
            message: res.message()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ranking-box {
    @include maskLayer($num: 0.3, $z: 2002);
    overflow-y: auto;
    b,
    strong {
        font-weight: normal;
    }
    em,
    i {
        font-style: normal;
    }
    .cont {
        width: 560px;
        height: 670px;
        background: url("images/ranking_bg.png") no-repeat center/100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -280px;
        margin-top: -335px;
        border-radius: 6px;
        .title {
            width: 160px;
            height: 40px;
            position: absolute;
            top: 77px;
            left: 198px;
        }
        .close-ranking {
            width: 33px;
            height: 33px;
            border-radius: 100%;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            background: url("images/close_pic.png") no-repeat center / 100% 100%;
        }
        .switch-btn {
            position: absolute;
            left: -44px;
            top: 206px;
            width: 60px;

            span {
                height: 48px;
                display: block;
                cursor: pointer;
                background: url("./images/title_bg_no.png") no-repeat center / 100% 100%;

                &:nth-child(1) {
                    margin-bottom: 12px;

                    img {
                        margin: 9px 0 0 15px;
                    }
                }

                img {
                    margin: 6px 0 0 13px;
                }

                &.active {
                    background: url("./images/title_bg_choose.png") no-repeat center / 100% 100%;
                }
            }
        }
        .operation-box {
            position: absolute;
            top: 148px;
            left: 0;
            width: 100%;

            .add-btn {
                font-size: 14px;
                color: #FFF2C7;
                line-height: 32px;
                display: inline-block;
                position: relative;
                padding-left: 30px;
                margin-left: 44px;
                cursor: pointer;

                &:hover {
                    color: #fff;

                    i {
                        background: url("images/add_icon.png") no-repeat center center / 100% 100%;
                    }
                }

                i {
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    position: absolute;
                    left: 0;
                    top: 6px;
                    background: url("images/add_icon2.png") no-repeat center center / 100% 100%;
                }
            }

            .search-box {
                position: absolute;
                left: 200px;
                top: 0;
                width: 220px;
                height: 32px;
                line-height: 32px;
                background: #fff;
                border-radius: 24px;

                i {
                    position: absolute;
                    left: 12px;
                    top: 7px;
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    background: url("images/search_icon.png") no-repeat center center / 100% 100%;
                }

                input {
                    width: 148px;
                    height: 30px;
                    border: 0;
                    margin-left: 30px;
                    padding: 0 12px;
                    outline: none;
                    color: #FD9C4B;
                    font-size: 13px;
                }

                @include setInput($cr: #FFCF9E);

                b {
                    font-size: 13px;
                    color: #FD9C4B;
                }
            }
        }
        .top-three {
            width: 100%;
            position: absolute;
            top: 200px;
            left: 0;
            font-size: 12px;
            li {
                flex: 1;
                text-align: center;
                color: #222222;
                padding: 10px 0;
                position: absolute;
                top: 3px;
                &:nth-child(2) {
                    width: 150px;
                    left: 30px;
                    .person-pic {
                        b {
                            left: 62px;
                            top: 52px;
                        }
                    }
                    .name {
                        bottom: -42px;
                    }
                    .top-three-opera {
                        bottom: -62px;
                        left: 24px;
                    }
                }
                &:nth-child(1) {
                    left: 182px;
                    width: 200px;
                    top: -6px;
                    .person-pic {
                        b {
                            left: 86px;
                            top: 52px;
                        }
                    }
                    .name {
                        bottom: -42px;
                    }
                    .top-three-opera {
                        bottom: -62px;
                        left: 49px;
                    }
                }

                &:nth-child(3) {
                    width: 150px;
                    right: 28px;

                    .person-pic {
                        b {
                            left: 63px;
                            top: 52px;
                        }
                    }

                    .name {
                        bottom: -44px;
                    }

                    .top-three-opera {
                        bottom: -63px;
                        left: 26px;
                    }
                }

                .first {
                    width: 28px;
                    height: 17px;
                    position: absolute;
                    top: -4px;
                    left: 85px;
                    background: url("images/champion.png") no-repeat center center/100% 100%;
                }

                .person-pic {
                    position: relative;

                    img {
                        width: 64px;
                        height: 64px;
                        border-radius: 100%;
                        border: 2px solid #fff;
                    }

                    b {
                        width: 26px;
                        height: 26px;
                        border-radius: 100%;
                        background: #FFC65A;
                        line-height: 28px;
                        text-align: center;
                        font-size: 16px;
                        color: #fff;
                        position: absolute;
                    }
                }
                .name {
                    color: #FFEEDD;
                    position: absolute;
                    width: 100%;
                    left: 0;
                    line-height: 20px;
                }
                .top-three-opera {
                    position: absolute;
                    &:hover {
                        .input-change {
                            display: block;
                        }
                        .rank-num {
                            display: none;
                        }
                    }
                    .rank-num {
                        width: 100px;
                        height: 20px;
                        line-height: 20px;
                        background: #F27516;
                        color: #FFEEDD;
                        text-align: center;
                        border-radius: 12px;
                        i {
                            margin-right: 3px;
                        }
                    }
                    .input-change {
                        width: 130px;
                        height: 20px;
                        border: 1px solid #FFC65A;
                        border-radius: 2px;
                        position: relative;
                        margin: 12px 0 0;
                        background: #fff;
                        z-index: 1;
                        display: none;
                        input {
                            width: 88px;
                            border: 0;
                            line-height: 18px;
                            padding: 0 0 0 26px;
                            border-left: 1px solid #FFC65A;
                            border-right: 1px solid #FFC65A;
                            outline: none;
                            color: #EF6420;
                        }
                        .iconfont {
                            width: 20px;
                            display: inline-block;
                            text-align: center;
                            line-height: 18px;
                            font-size: 13px;
                            color: #FE914C;
                            cursor: pointer;
                            &:hover {
                                .num-list {
                                    display: block;
                                }
                            }
                        }
                        .sign-icon {
                            width: 12px;
                            height: 18px;
                            line-height: 18px;
                            position: absolute;
                            left: 28px;
                            top: 0;
                            color: #F76735;
                            font-size: 14px;
                        }
                        .num-list {
                            width: 64px;
                            height: 140px;
                            padding: 4px 0;
                            border: 1px solid #FFC65A;
                            border-radius: 2px;
                            background: #FFF5E9;
                            display: none;
                            margin-left: -42px;
                            position: absolute;
                            dd {
                                width: 44px;
                                height: 20px;
                                line-height: 20px;
                                text-align: center;
                                display: block;
                                border: 1px solid #FFC65A;
                                background: #fff;
                                color: #EF6420;
                                margin: 10px auto 0;
                                cursor: pointer;
                                @include setBoxShadow($y: 2px, $w: 4px, $r: rgba(255, 139, 73, 0.2));
                            }
                        }
                    }
                }
            }
        }

        .scroll-box {
            width: 500px;
            height: 300px;
            border-radius: 4px;
            position: absolute;
            bottom: 12px;
            left: 30px;

            ul {
                li {
                    height: 50px;
                    display: flex;
                    line-height: 50px;
                    font-size: 12px;
                    text-align: left;
                    border-bottom: 1px solid #F5F5F5;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;

                    &:last-child {
                        border-bottom: 0;
                    }

                    &:hover {
                        background: #daf0ff;

                        .input-change {
                            display: flex;
                        }

                        p.poll-num {
                            display: none;
                        }
                    }

                    span.rank-index {
                        min-width: 20px;
                        text-align: center;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        margin: 14px 0 14px 20px;
                        padding: 0 2px;
                        border-radius: 100%;
                        background: #A4B2E5;
                        color: #fff;
                    }

                    p.name {
                        flex: 1;
                        font-size: 12px;
                        color: #333;
                        margin-left: 100px;
                        display: flex;
                        max-width: 214px;

                        img {
                            width: 32px;
                            height: 32px;
                            border-radius: 100%;
                            border: 1px solid #FCAB75;
                            margin: 8px 10px 8px 0;
                        }

                        span {
                            flex: 1;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }

                    p.poll-num {
                        width: 130px;
                        color: #EF6420;
                        margin-right: 16px;

                        i {
                            margin-right: 6px;
                        }
                    }

                    .input-change {
                        width: 130px;
                        height: 24px;
                        border: 1px solid #FFC65A;
                        border-radius: 2px;
                        position: relative;
                        margin: 12px 0 0;
                        display: none;

                        input {
                            width: 88px;
                            border: 0;
                            line-height: 24px;
                            padding: 0 0 0 26px;
                            border-left: 1px solid #FFC65A;
                            border-right: 1px solid #FFC65A;
                            outline: none;
                            color: #EF6420;
                        }

                        .iconfont {
                            width: 20px;
                            display: inline-block;
                            text-align: center;
                            line-height: 24px;
                            font-size: 13px;
                            color: #FE914C;
                            cursor: pointer;

                            &:hover {
                                .num-list {
                                    display: block;
                                }
                            }
                        }

                        .sign-icon {
                            width: 12px;
                            height: 22px;
                            line-height: 22px;
                            position: absolute;
                            left: 28px;
                            top: 0;
                            color: #F76735;
                            font-size: 14px;
                        }

                        .num-list {
                            width: 64px;
                            height: 140px;
                            padding: 4px 0;
                            border: 1px solid #FFC65A;
                            border-radius: 2px;
                            background: #FFF5E9;
                            display: none;
                            margin-left: -42px;

                            &.change-dircect {
                                margin-top: -160px;
                            }

                            li {
                                width: 44px;
                                height: 20px;
                                line-height: 20px;
                                text-align: center;
                                display: block;
                                border: 1px solid #FFC65A;
                                background: #fff;
                                color: #EF6420;
                                margin: 10px auto 0;
                                cursor: pointer;
                                @include setBoxShadow($y: 2px, $w: 4px, $r: rgba(255, 139, 73, 0.2));
                            }
                        }
                    }
                }
            }

            .current-ranking {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 50px;
                width: 500px;
                line-height: 50px;
                background: #daf0ff;
                display: none;
                box-sizing: border-box;

                &.show {
                    display: flex;
                }

                span {
                    min-width: 20px;
                    text-align: center;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    margin: 14px 0 14px 20px;
                    padding: 0 2px;
                    font-size: 12px;
                    border-radius: 100%;
                    background: #A4B2E5;
                    color: #fff;
                }

                p {
                    font-size: 12px;
                    color: #333;
                    margin-left: 100px;
                    display: flex;
                    flex: 1;
                    max-width: 214px;

                    img {
                        width: 32px;
                        height: 32px;
                        border-radius: 100%;
                        border: 1px solid #FCAB75;
                        margin: 8px 10px 8px 0;
                    }
                }

                strong {
                    width: 120px;
                    color: #F76735;
                    font-size: 12px;

                    i {
                        margin-right: 6px;
                    }
                }
            }
        }
    }
}
</style>
