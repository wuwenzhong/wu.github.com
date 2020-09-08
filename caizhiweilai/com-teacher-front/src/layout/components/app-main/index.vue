<template>
<div class="app-main">
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
  </transition>
</div>
</template>

<script>
export default {
  name: 'app-main',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
    min-height: calc(100vh - 114px);
    background: $color-background-base;
    overflow: hidden;
}
</style>
