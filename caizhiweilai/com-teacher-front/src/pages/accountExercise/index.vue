<template>
  <div class="exercise-assembly">
    <p class="time">
      <button @click="btnClose" class="return-btn">退出</button>
    </p>
    <iframe
      :src="url"
      id="parentFrame"
      width="100%"
      height="100%"
      frameborder="0"
      scrolling="no"
      marginheight="0"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: 'accountExercise',
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    const queryObj = location.search.substring(1)
    const queryData = decodeURIComponent(queryObj).split('&&')
    this.url = queryData[0].substring(queryData[0].indexOf('=') + 1)
  },

  methods: {
    // 关闭账簿返回到案例页面
    btnClose() {
      window.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.exercise-assembly {
  display: flex;
  flex: 1;
  position: relative;
  margin-top: 0.1rem;
  background: white;
  .time {
    position: fixed;
    z-index: 1100;
    right: 20px;
    top: 12px;
    color: #fff;
    width: auto;
    padding: 0 10px;
    height: 23px;
    font-size: 14px;
    text-align: center;
    .return-btn {
      cursor: pointer;
      background: #60c7d0;
      border: none;
      color: #fff;
      width: 50px;
      height: 23px;
      border-radius: 3px;
      font-size: 12px;
    }
  }
  iframe {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    right: 0;
  }
}
</style>
