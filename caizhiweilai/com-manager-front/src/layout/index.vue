<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="main-container">
      <div>
        <navbar />
        <HeadLine />
        <!-- 导航 -->
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, HeadLine } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { application, getCommonInfo } from '@/api/user.js'
const Base64 = require('js-base64').Base64
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    HeadLine
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  data() {
    return {
      flagBack: 0
    }
  },
  mounted() {
    // application({ appTypes: 2 }).then(res => {
    //   for (let index = 0; index < res.result.length; index++) {
    //     if (res.result.roleDTO[index] == 16) {
    //       this.flagBack = 1
    //     }
    //   }
    // })
    // this.$nextTick(function() {
    //   if (this.flagBack == 1) {
    //     this.backUrl()
    //   }
    // })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
    // backUrl() {
    //   // 返回用户中心地址
    //   getCommonInfo().then(res => {
    //     // 保存返回用户中心地址
    //     location.href = res.data.result + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
