<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="navbar-wrapper">
        <navbar></navbar>
        <tags-view />
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import AppMain from './components/app-main'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import TagsView from './components/tags-view'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  }
}
</script>

<style lang="scss" scoped>
  .app-wrapper {
    position: relative;
    min-height: 100vh;
    .main-container {
      transition: margin-left .28s;
      margin-left: 180px;
    }
    // .fixed-header {
    //   position: fixed;
    //   top: 0;
    //   right: 0;
    //   z-index: 9;
    //   width: calc(100% - #{$sideBarWidth});
    //   transition: width 0.28s;
    // }
    // .hideSidebar .fixed-header {
    //   width: calc(100% - 54px)
    // }
  }
</style>
