<template>
<div class="index_box">
  <div class="head_box">
    <img src="./../images/logon_2.png"
         alt
         class="logo_pic" />
    <div class="sign_out">
      <span @click="signOut">
        <i class="iconfont">&#xe65a;</i>退出登录
      </span>
    </div>
  </div>
  <ul class="clear tab_btn" @click="jump($event)">
    <router-link to="/applicationCenter?flag=1"
                 tag="li" :class="flagIndex==1?'router-link-exact-active':''">我的应用超市</router-link>
    <router-link to="/personMaterial"
                 tag="li" :class="flagIndex==2?'router-link-exact-active':''">我的个人资料</router-link>
  </ul>
  <div class='router_content'>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import {
  queit,
  application
} from '../../../api/user'
import {
  mapActions
} from 'vuex'
export default {
  name: '',
  data() {
    return {
      widowsHeight: '', // 屏幕高度
      linkyn: false,
      // moreApp: false,
      flagIndex: 1
    }
  },
  created() {},
  mounted() {
    // 登录之后一个角色直接跳走页面处于加载动态 反之在此页面停留
    // const ynFistLogin = this.getUrlParam('flag')
    // application({ appTypes: 2 }).then(res => {
    //   // 拥有的应用数量
    //   if (res.result.length == 1 && !ynFistLogin) {
    //     this.moreApp = false
    //   } else {
    //     this.moreApp = true
    //   }
    // })
  },
  methods: {
    signOut() {
      // 返回登录界面
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Logout()
      })
    },
    jump(e) {
      if (e.path[0].innerText == '我的应用超市') {
        this.flagIndex = 1
      } else {
        this.flagIndex = 2
      }
    },
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) // 匹配目标参数
      if (r != null) return unescape(r[2])
      return null // 返回参数值
    },
    ...mapActions([
      'Logout'
    ])
  }
}
</script>

<style scoped lang="scss">
.index_box {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    // min-width: $min_width;
    // background: $theme_color;
    padding: 0 23px 0 29px;
    box-sizing: border-box;
    background: #E4FFF8;
    .head_box {
        height: 74px;
        display: flex;
        .logo_pic {
            width: 251px;
            height: 31px;
            margin-top: 16px;
        }
        .sign_out {
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: #333333;
            line-height: 22px;
            margin-top: 31px;
            span {
                cursor: pointer;
                i {
                    margin-right: 4px;
                    font-weight: bold;
                    color: #36cea9;
                }
            }
        }
    }
    .tab_btn {
        color: #333333;
        padding: 0;
        li {
            float: left;
            width: 200px;
            height: 66px;
            background: url("../images/no_choose.png") no-repeat;
            text-align: left;
            text-indent: 36px;
            line-height: 66px;
            font-size: 17px;
            position: relative;
            cursor: pointer;
            list-style: none;
            background-size: contain;
            color: #999999;
            &:last-child {
                margin-left: -16px;
            }
            &.router-link-exact-active {
                color: black;
                background: url("../images/choose_bg.png") no-repeat;
                background-size: contain;
                z-index: 1;
            }
        }
    }
    .router_content {
        height: calc(100% - 170px);
    }
}
</style>
