<template>
  <div></div>
</template>

<script>
/* eslint-disable */
export default {
  name:'Start',
  data () {
    return {}
  },
  mounted(){
    // 当前步数
    this.$store.commit('STEP_stepType', '1')
  },
  methods:{}
}
</script>

<style>
</style>
