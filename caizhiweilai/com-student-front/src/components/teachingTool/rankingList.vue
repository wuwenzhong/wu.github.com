<template>
  <div class="teach-tool-box">
    <div class="cont" ref="rankingCont">
      <div class="switch-box">
        <span :class="{'active':!currentIndex}" @click="switchLook(0)">个人红旗榜</span>
        <span :class="{'active':currentIndex}" @click="switchLook(1)">团队红旗榜</span>
      </div>
      <div class="left">
        <p>{{functionText}}</p>
        <span>CELEBRITY <i>LIST</i></span>
      </div>
      <div class="right">
        <div class="close-box"><i class="iconfont" @click="closeRanking">&#xe6a5;</i></div>
        <div class="content">
          <div class="search-box">
            <input type="text" v-model="searchText" placeholder="请输入内容">
            <span>搜索</span>
          </div>
          <div class="scroll-box" ref="scrollBoxParent">
            <el-scrollbar style="height: 100%" ref="scrollBox">
              <ul v-if="currentIndex == 0 && studyRankingData.length > 0">
                <li v-for="item in studyRankingData" :key="item.id">
                  <span class="rank-index" :class="'rank-index'+item.rank"><i v-show="item.rank>3">{{item.rank}}</i></span>
                  <p class="name">
                    <img :src="item.photo == '' ? (item.gender == 0 ? defaultPic[1] : defaultPic[0]) : item.photo" alt="">
                    <span>{{item.userName}}</span>
                  </p>
                  <p class="poll-num"><i class="iconfont">&#xe60d;</i><span>{{item.score}}</span></p>
                </li>
              </ul>
              <div v-if="currentIndex == 0 && studyRankingData.length == 0" class="no-data">
                <div>
                  <img src="../../common/images/rank_nodata.png" alt="">
                  <p>还没有内容可查看，稍后再试试吧～</p>
                </div>
              </div>
              <ul v-if="currentIndex == 1">
                <li v-for="item in teamRankingData" :key="item.id">
                  <span class="rank-index" :class="'rank-index'+item.rank"><i v-show="item.rank>3">{{item.rank}}</i></span>
                  <p class="name"><img :src="defaultPic[0]" alt=""><span>{{item.teamName}}</span></p>
                  <p class="poll-num"><i class="iconfont">&#xe60d;</i><span>{{item.score}}</span></p>
                </li>
              </ul>
              <div v-if="currentIndex == 1 && teamRankingData.length == 0" class="no-data">
                <div>
                  <img src="../../common/images/rank_nodata.png" alt="">
                  <p>还没有内容可查看，稍后再试试吧～</p>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { studentRanking, teamRanking } from '@/api/teacherTools'
export default {
  name: 'rankingDialog',
  data() {
    return {
      isShowRankPerpeo: true, // 是否显示当前账号的排行定位
      currentIndex: 0, // 当前显示的是学生或者团队，0位学生1位团队
      defaultPic: [require('./images/default_boy.png'), require('./images/avatar.jpg')], // 默认头像
      searchText: '', // 团队或者学生榜关键次
      oldStudyRankingData: [], // 存储旧的学生数据
      oldTeamRankingData: [], // 存储旧的团队数据
      studyRankingData: [], // 排行榜数据
      teamRankingData: [], // 排行榜数据
      functionText: '个人红旗榜' // 弹窗功能描述
    }
  },
  watch: {
    searchText(nice, old) {
      if (nice != '') {
        if (this.currentIndex == 0) {
          // 每次搜索从新复制个gridData
          this.studyRankingData = JSON.parse(JSON.stringify(this.oldStudyRankingData))
          this.studyRankingData = this.studyRankingData.filter(function(product) {
            return product.userName.search(nice.toLowerCase()) > -1
          })
        }
        if (this.currentIndex == 1) {
          // 每次搜索从新复制个gridData
          this.teamRankingData = JSON.parse(JSON.stringify(this.oldTeamRankingData))
          this.teamRankingData = this.teamRankingData.filter(function(product) {
            return product.teamName.search(nice.toLowerCase()) > -1
          })
        }
      } else {
        if (this.currentIndex == 0) {
          this.studyRankingData = JSON.parse(JSON.stringify(this.oldStudyRankingData))
        }
        if (this.currentIndex == 1) {
          this.teamRankingData = JSON.parse(JSON.stringify(this.oldTeamRankingData))
        }
      }
    }
  },
  mounted() {
    const _this = this
    this.getRankingData(this.currentIndex)
  },
  methods: {
    // 获取学生或者团队红旗榜的数据
    getRankingData(num) {
      const _this = this
      const ajaxName = (num == 0 ? studentRanking : teamRanking)
      const _classId = localStorage.getItem('classId')
      const postData = '?classId=' + _classId + '&keyWords=' + this.searchText
      ajaxName(postData).then(res => {
        if (res.code == 0) {
          if (_this.currentIndex == 0) {
            _this.oldStudyRankingData = JSON.parse(JSON.stringify(res.result))
            _this.studyRankingData = res.result
          } else {
            _this.teamRankingData = res.result
            _this.oldTeamRankingData = JSON.parse(JSON.stringify(res.result))
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 切换查看类型
    switchLook(num) {
      this.currentIndex = num
      this.searchText = ''
      this.functionText = num ? '团队红旗榜' : '个人红旗榜'
      this.getRankingData(this.currentIndex)
    },
    // 关闭红旗榜
    closeRanking() {
      this.$store.commit('setRanking', false)
    }
  }
}
</script>

<style scoped lang="scss">
  .teach-tool-box {
    @include maskLayer($num: .3, $z: 2002);
    overflow-y: auto;
    strong, b {
      font-weight: normal;
    }
    em, i {
      font-style: normal;
    }
    .cont {
      width:930px;
      height: 685px;
      border-radius: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -465px;
      margin-top: -343px;
      background:#fff;
      display: flex;
      .switch-box{
        width: 86px;
        position: absolute;
        left: -86px;
        top:100px;
        font-size: 12px;
        color: $color-theme;
        span{
          display: block;
          margin-bottom: 20px;
          height: 32px;
          line-height: 32px;
          border:1px solid $color-theme;
          border-radius: 8px 0 0 8px;
          background: #fff;
          text-align: center;
          cursor: pointer;
          &.active{
            background: $color-theme;
            color: #fff;
          }
        }
      }
      .left{
        width: 287px;
        height: 100%;
        text-align: left;
        background: url("../../common/images/dialog-bg.png")no-repeat center/100% 100%;
        p{
          font-size: 28px;
          color: #1F1F1E;
          line-height: 48px;
          padding-left: 42px;
          margin-top: 150px;
        }
        span{
          color:#0324FD;
          font-size:16px;
          display: block;
          line-height: 24px;
          padding-left: 42px;
          i{
            font-style: normal;
            color:$color-theme;
          }
        }
      }
      .right{
        flex: 1;
        .close-box{
          height: 38px;
          padding-top:20px;
          text-align: right;
          i{
            display: inline-block;
            height: 18px;
            line-height: 18px;
            color:#BEC2C6;
            margin-right: 24px;
            cursor: pointer;
          }
        }
        .content{
          height: calc(100% - 38px);
          padding:0 46px;
          .search-box{
            height: 38px;
            display: flex;
            border-radius:2px 0 0 2px;
            input{
              flex: 1;
              border:1px solid #E4E7ED;
              font-size:12px;
              color: #666;
              padding-left: 16px;
              border-radius:2px 0 0 2px;
              @include setInput(#909398);
            }
            span{
              width:70px;
              height: 38px;
              background: $color-theme;
              color:#fff;
              font-size:13px;
              border-radius:0 2px 2px 0;
              line-height: 38px;
              text-align: center;
            }
          }
        }
        .scroll-box{
          height: 540px;
          margin-top:30px;
          /deep/.el-scrollbar__view{
            height: 100%;
          }
          .no-data{
            display: flex;
            justify-items: center;
            align-items: center;
            flex-direction: row;
            height: 100%;
            div{
              margin:0 auto;
              img{
                display: block;
                margin: 0 auto;
              }
              p{
                font-size:14px;
                color: $color-theme;
                width: 100%;
              }
            }
          }
          ul{
            li{
              height: 60px;
              line-height: 60px;
              padding:0 35px;
              display: flex;
              align-items: center;
              &:nth-child(odd){
                background: #F9F9F9;
              }
              .rank-index{
                font-size:12px;
                color:#666;
                width: 33px;
                height: 33px;
                line-height: 28px;
                text-align: center;
                background-image:url("../../common/images/default_sprit.png") ;
                background-repeat:no-repeat ;
                background-position: -432px -242px;
                &.rank-index1{
                  background-position: -306px -236px;
                }
                &.rank-index2{
                  background-position: -347px -236px;
                }
                &.rank-index3{
                  background-position: -390px -236px;
                }
                i{
                  transform: scale(0.8);
                  display: block;
                }
              }
              .name{
                flex: 1;
                display: flex;
                font-size:12px;
                color: #303133;
                margin: 0 20px 0 50px;
                img{
                  width:33px;
                  height: 33px;
                  border:1px solid $color-theme;
                  border-radius: 100%;
                  margin:14px 16px 0 0;
                }
              }
              .poll-num{
                color:#D90600;
                display: flex;
                i{
                  font-size:30px;
                  margin-right: 10px;
                }
              }
            }
          }
        }
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
              bottom: -42px
            }

            .rank-num {
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
              bottom: -42px
            }

            .rank-num {
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
              bottom: -44px
            }

            .rank-num {
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

          .rank-num {
            width: 100px;
            height: 20px;
            line-height: 20px;
            background: #F27516;
            color: #FFEEDD;
            text-align: center;
            border-radius: 12px;
            position: absolute;

            i {
              margin-right: 3px;
            }
          }
        }
      }
    }
  }
</style>
