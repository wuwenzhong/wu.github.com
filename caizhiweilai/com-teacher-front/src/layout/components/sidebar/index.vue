<template>
  <div>
    <logo :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permissionRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './logo'
import SidebarItem from './sidebar-item'
// import variable from '@/common/css/variable.scss'

export default {
  name: 'Sidebar',
  data() {
    return {
      routes: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissionRoutes',
      'sidebar'
    ]),
    // variable() {
    //   return variable
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  components: {
    Logo,
    SidebarItem
  }
}
</script>
<style lang="scss">
.scrollbar-wrapper {
  margin-top: 29px;
  a {
    margin: 0 12px;
    height: 45px;
    width: 226px !important;
  }
  .el-menu {
    div {
      margin-bottom: 25px;
    }
  }
  .el-menu-item {
    height: 45px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 60px !important;
  }
}
</style>