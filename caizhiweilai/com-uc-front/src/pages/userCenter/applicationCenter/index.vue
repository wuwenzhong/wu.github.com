<template>
  <div class="application_box">
    <section class="person_message" v-show="moreApp">
      <div class="person_pic">
        <img src="./../images/woman.png" alt="" v-if="photo ==''">
        <img :src="photo" alt="" v-else>
      </div>
      <ul class="message_list">
        <li>
          <span class="email_icon"></span>
          <p>邮箱：{{email}}</p>
        </li>
        <li>
          <span class="phone_icon"></span>
          <p>手机号：{{phone}}</p>
        </li>
        <li>
          <span class="apply_icon"></span>
          <p v-html="'拥有应用个数：'+AppNumber+'个'"></p>
        </li>
      </ul>
    </section>
    <div class="role_box" v-show="moreApp">
      <a
        v-for="(item,index) in SupermarketArr"
        :key="index"
        class="SupermarketItem"
        @click="Jump(item)"
      >
        <div class="role_list">
          <span class="default_pic">
            <img v-if="item.schoolLogoUrl" :src="item.schoolLogoUrl" alt="">
            <img v-else :src="item.roleDTO.applicationsDTO.logo" alt />
          </span>
          <ul>
            <li>{{shoolName[index]}}</li>
            <li class="teacher_name">当前角色：{{item.roleDTO.applicationsDTO.appName.slice('3')}}</li>
          </ul>
          <button>进入</button>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
import { mapGetters, mapActions } from 'vuex'
import { Loading } from "element-ui"
import { application,khInfo } from './../../../api/user'
import Cookies from 'js-cookie' // 引入cookie
export default {
  computed: {
    ...mapGetters([
      'userName',
      'avatar',
      'birthday',
      'email',
      'gender',
      'phone',
      'photo'
    ])
  },
  name: "index",
  data() {
    return {
      Phone:'',
      AppNumber:'',
      SupermarketArr:[],
      userId:'',
      access_token: localStorage.getItem("access_token"),
      refresh_token: localStorage.getItem("refresh_token"),
      shoolName:[],
      moreApp: false
    };
  },
  created(){
  },
  mounted(){
    let that = this;
    that.init()
  },
  methods:{
    init: function() {
      // 用户信息
      let that = this;
      // 当前用户应用
      application({appTypes:2}).then(res => {
          if (res.code == '0') {
            that.AppNumber = res.result.length;
            that.SupermarketArr = res.result;
            let ynFistLogin=this.getUrlParam('flag')
            Cookies.set('czwlflag','')
            if(that.AppNumber == 1 && !ynFistLogin){
              if (res.result[0].roleDTO.applicationsDTO.appName.slice('3') == '学生端') {
                Cookies.set('czwlflag', '学生端')
              } else if (res.result[0].roleDTO.applicationsDTO.appName.slice('3') == '教务端'){
                Cookies.set('czwlflag', '教务端')
              }else if (res.result[0].roleDTO.applicationsDTO.appName.slice('3') == '教师端'){
                Cookies.set('czwlflag', '教师端')
              }else{
                Cookies.set('czwlflag', '管理端')
              }
              this.moreApp = false
              window.location.href = res.result[0].roleDTO.applicationsDTO.url +'?orgId=' + res.result[0].orgId
            }else{
              this.moreApp = true
            }
            for (let index = 0; index < that.AppNumber; index++) {
              // 请求学校名称
               khInfo({customerId:res.result[index].orgId}).then(res=>{
                if (res.code == 0) {
                    this.shoolName.push('')
                    try {
                      this.shoolName[index] = res.result.customerName
                    } catch (error) {}
                    try {
                      that.SupermarketArr[index].schoolLogoUrl = res.result.coverUrl
                    } catch (error) {}
                }
              })
            }
          }
        }).catch(error => {
          // reject(error)
        })
    },
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) // 匹配目标参数
      if (r != null) return unescape(r[2])
      return null // 返回参数值
    },
    Jump(item){
      if (item.roleDTO.applicationsDTO.appName.slice('3') == '学生端') {
        Cookies.set('czwlflag', '学生端')
      } else if (item.roleDTO.applicationsDTO.appName.slice('3') == '教务端'){
        Cookies.set('czwlflag', '教务端')
      }else if (item.roleDTO.applicationsDTO.appName.slice('3') == '教师端'){
        Cookies.set('czwlflag', '教师端')
      }else{
        Cookies.set('czwlflag', '管理端')
      }
      window.location.href = item.roleDTO.applicationsDTO.url+"?orgId="+item.orgId
    }
  }
};
</script>

<style scoped lang="scss">
.application_box {
  width: 100%;
  height: 100%;
  background: #ffffff;
  padding: 41px 34px 30px;
  box-sizing: border-box;
  display: flex;
  .person_message {
    height: 100%;
    min-width: 300px;
    margin-right: 30px;
    box-shadow: 0 0 29px 0 rgba(0, 80, 66, 0.08);
    .person_pic {
      width: 98px;
      height: 98px;
      border-radius: 100%;
      margin: 41px auto 34px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .message_list {
      li {
        color: #333333;
        padding: 0 22px 0 29px;
        display: flex;
        font-size: 15px;
        margin-bottom: 14px;
        span {
          width: 18px;
          height: 18px;
          color: #36cea9;
          margin: 2px 8px 0 0;
          line-height: 18px;
          background-repeat: no-repeat;
          background-size: 100%;
          background-position: center;
          &.email_icon {
            background-image: url("./../images/emial_pic.png");
          }
          &.phone_icon {
            background-image: url("./../images/phone_icon.png");
          }
          &.apply_icon {
            background-image: url("./../images/application_pic.png");
          }
        }
        p {
          line-height: 20px;
          margin: 0;
        }
      }
    }
  }
  .role_box {
    overflow: scroll;
    .SupermarketItemnone{
      visibility: hidden;
    }
    .role_list {
      padding: 40px 17px 40px 25px;
      position: relative;
      box-shadow: 0 0 22px 0 rgba(0, 80, 66, 0.04);
      border: 1px solid #e7fffa; /*no*/
      float: left;
      display: flex;
      margin: 0 20px 20px 0;
      box-sizing: border-box;
      position: relative;
      background: url("./../images/role_list.png") no-repeat bottom
        right/158px 80px;
      .default_pic {
        width: 100px;
        height: 100px;
        border-radius: 3px;
        // border: 1px solid #e7fffa;
        box-shadow: 0 0 22px 0 rgba(0, 80, 66, 0.04);
        background: url("./../images/woman.png") no-repeat center/100%;
        img{
          width: 100%;
          height: 100%;
        }
      }
      ul {
        width: 180px;
        flex: 1;
        margin: 0;
        li {
          width: 100%;
          color: #333333;
          font-size: 16px;
          line-height: 30px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &.teacher_name {
            line-height: 22px;
            font-size: 15px;
            margin-top: 6px;
          }
        }
      }
      button {
        position: absolute;
        bottom: 10px;
        right: 15px;
        height: 24px;
        line-height: 24px;
        border: 0;
        outline: none;
        background: #36cea9;
        border-radius: 11px;
        color: #fff;
        font-size: 12px;
        font-style: normal;
        padding: 0 17px;
        cursor: pointer;
      }
    }
  }
}
</style>