import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import ElementUi from 'element-ui'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import 'quill/dist/quill.snow.css'

import '@/common/css/index.scss'
import '@/common/fonts/iconfont.js'
import '@/common/fonts/iconfont.css'
import { createSocket, sendWspush, oncloseWs } from '@/common/js/socket' // 封装socket挂载全局
import Pagination from '@/components/pagination' // 分页
import { cos } from '@/common/js/cos' // 文件上传
import echarts from 'echarts' // echarts
import { message } from './common/js/setMessage' // 重写$message
import vcolorpicker from 'vcolorpicker' // 颜色卡

// 防止连续点击按钮
import preventReClick from '@/common/js/plugins.js'
// 引入遮罩弹层
import Toast from '@/components/toast'
Vue.use(preventReClick)
Vue.use(Toast)
Vue.use(vcolorpicker)

router.beforeEach((to, from, next) => {
  if (to.path == '/index') {
    localStorage.removeItem('CLASSNAME')
  }
  /* 路由发生变化修改页面title */
  const name = localStorage.getItem('CLASSNAME')
  if (name) {
    document.title = name
  } else {
    document.title = '财智未来综合实训平台'
  }
  next()
})

// 全局方法挂载
Vue.prototype.cos = cos
Vue.prototype.$echarts = echarts
Vue.prototype.createSocket = createSocket
Vue.prototype.sendWspush = sendWspush
Vue.prototype.oncloseWs = oncloseWs
Vue.prototype.$set = Vue.set
// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(ElementUi)
Vue.prototype.$message = message

window.globalVariable = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
