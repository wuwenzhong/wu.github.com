<template>
  <div class="sidebar-logo-container">
  <!-- <div class="sidebar-logo-container" :class="{'collapse':collapse}"> -->
    <!-- <transition name="sidebarLogoFade"> -->
      <!-- <router-link key="collapse" class="sidebar-logo-link" to="/">
        <img :src="logo" class="sidebar-logo-one">
      </router-link> -->
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img :src="logoOne" class="sidebar-logo-one">
      </router-link> -->
      <router-link key="expand" class="sidebar-logo-link" to="/">
        <img :src="logo" class="sidebar-logo">
      </router-link>
    <!-- </transition> -->
  </div>
</template>

<script>
import logo from '@/common/images/logo.png'
// import logoOne from '@/common/images/logo-one.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: logo
      // logoOne: logoOne
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 74px;
  line-height: 74px;
  background: #36CEA9;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo-one {
      width: 32px;
      // height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    & .sidebar-logo {
      width: 250px;
      // height: 32px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo-one {
      margin-right: 0px;
    }
  }
}
</style>
