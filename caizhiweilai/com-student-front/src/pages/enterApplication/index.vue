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
      // url: this.$route.query.url,
      // oldTaskId: '',
      // titleIndex: '',
      // rpaCode: '',
      loadObj: {}, // 遮罩对象
      url: ''
    }
  },
  mounted() {
    // this.oldTaskId = this.$route.query._classTaskId
    // this.titleIndex = this.$route.query.index
    // this.rpaCode = this.$route.query.rpaCode
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
      // this.$router.push({ path: '/semtast', query: { classTaskId: this.oldTaskId, index: this.titleIndex, rpaCode: this.rpaCode } })
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
      bottom: 40px;
      right: 10px;
      border-radius: 100%;
      font-size: 14px;
      color:#fff;
      cursor: pointer;
    }
  }
</style>
