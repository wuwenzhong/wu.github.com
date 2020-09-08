<template>
<div id="app"
     :class='height?"auto":"hidden"'>
<router-view ></router-view>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['height'])
  },
  created() {
    // console.log(window.location.href)
    // const str = window.location.href
    // const path = str.lastIndexOf(':')
    // const pathSplice = str.slice(path)
    // const path1 = pathSplice.indexOf('/')
    // const path2 = pathSplice.substr(path1)
    // // console.log(path2)
    // if (path2 === '/classListHome') {
    //   return false
    // } else {
    //   this.createSocket()
    // }
    const str = window.location.href
    const path = str.lastIndexOf('/')
    const pathSplice = str.slice(path)
    if (pathSplice.includes('/classListHome') || pathSplice.includes('/?') || pathSplice.includes('/applicatAdmin') || pathSplice.includes('/accountExercise')) {
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
    max-height: 100%;
    &.hidden {
        overflow: hidden;
    }
    &.auto {
        overflow: auto;
    }
}
</style>
