<template>
  <div class="detail">
    <div class="content">
      <div class="img">
        <img :src="CampusListItem.courseCoverUrl" alt="" />
      </div>
      <div class="text">
        <div class="courseName">{{ CampusListItem.courseName }}</div>
        <div class="CampusListItem">
          有效期至: {{ CampusListItem.startTime.split(" ")[0] }}—{{
            CampusListItem.endTime.split(" ")[0]
          }}
        </div>
        <div class="CampusListItem">
          在线人数:<span style="color:rgba(0, 184, 139, 1)">{{
            CampusListItem.onlineNum || 0
          }}</span
          >/{{ CampusListItem.authNum }}
        </div>
      </div>
      <div class="buy-status">
        <div class="topBtn stopBtn" v-if="CampusListItem.status == 0">停用</div>
        <div class="topBtn buyBtn" v-else-if="CampusListItem.buyModel == 1">已购</div>
        <div class="topBtn" v-else>试用</div>
      </div>
      <!-- <div class="topBtn">试用</div> -->
      
    </div>
    <div class="center">
      <div class="useTime">
        <h3>使用期限</h3>
        <p>
          {{ CampusListItem.startTime.split(" ")[0] }}—{{
            CampusListItem.endTime.split(" ")[0]
          }}
        </p>
      </div>
      <div class="stepNum">
        <h3>站点数</h3>
        <p>{{ CampusListItem.authNum }}</p>
      </div>
    </div>
    <div class="footer">
      <h3>课程简介</h3>
      <div :title="CampusListItem.courseDesc">
        {{ CampusListItem.courseDesc }}
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import {updateTeacherInfo} from '@/request/api.js'
export default {
  name: "TeacherEdit",
  props: ["CampusListItem"]
};
</script>
<style lang="scss" scoped>
.detail {
  overflow: hidden;
  // margin:0 auto;
  width: 99%;
  background-color: #fff;
  .content {
    display: flex;
    position: relative;
    width: 100%;
    height: 152px;
    // padding: 0 10px 16px 20px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
    .img {
      width: 246px;
      height: 123px;
      margin-right: 15px;
      img {
        width: 100%;
        height: 100%;
        // height: 123px;
      }
    }
    .text {
      // flex: 1;
      width: 280px;
      .courseName{
        color: rgba(51, 51, 51, 1);
        width: 280px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
        margin-bottom:20px;
        line-height: 24px;
      }
      .CampusListItem {
        width: 280px;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
        margin-bottom: 19px;
        white-space: nowrap;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        span {
          color: #36cea9;
        }
      }
    }
    .buy-status{
      flex:1;
      display: float;
      .topBtn {
        float:right;
        width: 30px;
        font-size: 15px;
        font-weight: 600;
        color: rgba(255, 120, 0, 1);
        text-align: center;
      }
      .buyBtn {
        color: rgba(0, 184, 139, 1);
      }
      .stopBtn {
        background-color: #999;
        color: #efefef;
      }
    }

  }
  .center {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 110px;
    // padding: 20px 22px 0 30px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
    div {
      h3 {
        height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
        margin-bottom: 9px;
      }
      p {
        height: 18px;
        font-size: 13px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 18px;
        margin-top: 6px;
      }
    }
  }
  .footer {
    // padding: 20px 0 0 30px;
    width: 100%;
    overflow: hidden;
    h3 {
      height: 22px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
      margin-bottom: 9px;
    }
    div {
      width: 100%;
      font-size: 13px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 18px;
      margin-top: 6px;
    }
  }
}
</style>
