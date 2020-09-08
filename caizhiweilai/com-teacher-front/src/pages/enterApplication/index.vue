<template>
  <div class="rpa-box">
    <iframe
      :src="url"
      id="parentFrame"
      frameborder="0"
      scrolling="no"
      marginheight="0"
    ></iframe>
    <div class="return-applicat" @click="returnApp">退出</div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      /* 路由跳转时使用 */
      // url: this.$route.query.url, // iframe的地址
      // currentTaskId: this.$route.query.id, // 当前的任务id
      // currentLookType: this.$route.query.currentType, // 当前查看的类型
      // practicalTrainType: this.$route.query.rpaCode, // 判断是那种实操类型
      // isShowPython: this.$route.query.editPy, // 是否显示Python编辑框
      loadObj: {}, // 遮罩对象
      /* 打开新窗口时使用 */
      url: ''
    }
  },
  mounted() {
    debugger
    const _this = this
    const _token = localStorage.getItem('manageToken')
    const _time = localStorage.getItem('manageTime')
    const _companyId = localStorage.getItem('enterCompanyId')
    const iframeUrl = localStorage.getItem('jumpAddress')
    this.loadObj = this.$loading({ text: '正在加载~~~' })
    this.url = iframeUrl + '?' + 'companyId=' + _companyId + '&caiZhiToken=' + _token + '&time=' + _time
    const iframe = document.getElementById('parentFrame')
    iframe.onload = function() {
      _this.loadObj.close()
    }
  },
  methods: {
    // 关闭账簿返回到案例页面
    returnApp () {
      window.close()
      // 路由跳转时使用
      // this.$router.push({ path: '/jxgl/TaskDetail', query: { id: this.currentTaskId, currentType: this.currentLookType, rpaCode: this.practicalTrainType, editPy: this.isShowPython } })
    }
  }
}
</script>

<style scoped lang="scss">
  .rpa-box{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    #parentFrame{
      width: 100%;
      height: calc(100% - 6px);
    }
    .return-applicat{
      width:48px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: rgba(36, 50, 98, 1);
      position: fixed;
      bottom:40px;
      right: 10px;
      border-radius: 100%;
      font-size: 14px;
      color:#fff;
      cursor: pointer;
    }
  }
</style>
