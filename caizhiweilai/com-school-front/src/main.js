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

import Pagination from '@/components/pagination' // 分页
import { cos } from '@/common/js/cos' // 文件上传
import echarts from 'echarts' // echarts

router.beforeEach((to, from, next) => {
  if (to.query.orgId) {
    localStorage.setItem('customerId', to.query.orgId)
  }
  next()
})
// 全局方法挂载
Vue.prototype.cos = cos
Vue.prototype.$echarts = echarts

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(ElementUi)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
