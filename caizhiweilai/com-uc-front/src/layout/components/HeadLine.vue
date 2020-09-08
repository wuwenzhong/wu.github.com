<template>
  <div class="headline">
      <router-link to="/courseManagement" tag="li" :class="routerPath === '/outlineManagement'?'router-link-exact-active':''">课程管理<i></i></router-link>
      <router-link :class="routerPath === '/customerDetail' ? 'active' : ''"  to="/customerManagement" tag="li">客户管理<i></i></router-link>
      <router-link to="/customFeatures" tag="li">定制功能<i></i></router-link>
      <router-link to="/questionBank" tag="li">题库<i></i></router-link>
      <router-link to="/resourceBase" tag="li">资源库<i></i></router-link>
  </div>
</template>

<script>
export default {
  data() {
      return {
        routerPath: ''
      }
  },
  watch: {
      $route(e, from) {
        this.routerPath = e.path
        // console.log(e.path)
      }
  },
  created() {
    // console.log(window.location.href)
    if (this.getUrlParam('orgId')) {
      this.routerPath = 'first'
    }
  },
  methods: {
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) // 匹配目标参数
      if (r != null) return unescape(r[2])
      return null // 返回参数值
    }
  }
}
</script>

<style lang="scss" scoped>
.headline{
    height: 60px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 10px 0px rgba(0,0,0,0.05);
    height: 52px;
    line-height: 52px;
    padding: 0 70px;
    display: flex;
    li {
        list-style: none;
        margin-right: 104px;
        padding: 0 6px;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        i{
          display: block;
          height: 2px;
          width: 0;
          background:#414d65;
          margin:0 auto ;
          transition:0.5s width ease
        }
        &:hover{
          i{
            width: 100%;
          }
        }
        &.active {
          i{
            width: 100%;
          }
        }

        &.router-link-exact-active {
          i{
            width: 100%;
          }
        }
      }
}
</style>
