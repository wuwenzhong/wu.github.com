<template>
  <section class="app-main">
    <!-- <keep-alive> -->
      <router-view :key="key"></router-view>
    <!-- </keep-alive> -->
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppMain',
  data() {
    return {}
  },
  computed: {
    key() {
      return this.$route.path + new Date()
    },
    ...mapState({
      boxHeight: state => state.windowHeight
    })
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    width: 100%;
    height: 100%;
    padding: 60px 0 20px;
    min-width: 1200px;
    overflow-x: auto;
  }
</style>
