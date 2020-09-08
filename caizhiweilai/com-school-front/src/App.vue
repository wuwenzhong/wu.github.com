<template>
<div id="app">
  <router-view v-if="isRouterAlive"></router-view>
</div>
</template>
<script>
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  beforeCreate() {
    if (this.$route.query.orgId) {
      localStorage.setItem('customerId', this.$route.query.orgId)
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
