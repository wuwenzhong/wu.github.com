<template>
<div id="app">
  <router-view :key="key"></router-view>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  computed: {
    key() {
      return this.$route.path + new Date()
    },
    ...mapState(['height'])
  },
  created() {
    const str = window.location.href
    const path = str.lastIndexOf('/')
    const pathSplice = str.slice(path)
    if (pathSplice.includes('/index') || pathSplice.includes('/?') || pathSplice.includes('/applicatAdmin') || pathSplice.includes('/accountExercise')) {
      return false
    } else {
      // this.oncloseWs()
      this.createSocket()
    }
  }

}
</script>
<style lang='scss'>
#app {
  @import './common/font/font.css';
  min-width: 1200px;
  height: 100%;
  &.hidden {
    overflow: hidden;
  }
  &.auto {
    overflow: auto;
  }
}
</style>
