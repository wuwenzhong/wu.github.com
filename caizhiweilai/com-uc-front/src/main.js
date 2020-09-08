import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import directive from './directive/base'
import ElementUi from 'element-ui'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import 'quill/dist/quill.snow.css'

import '@/common/css/index.scss'
import '@/common/fonts/iconfont.js'
import '@/common/fonts/iconfont.css'

import { cos } from '@/common/js/cos' // 文件上传

// 引入遮罩弹层
import Toast from '@/components/toast'
// 防止连续点击按钮
import preventReClick from './common/js/plugins.js'
Vue.use(Toast)
Vue.use(preventReClick)

// 全局方法挂载
Vue.prototype.cos = cos

Vue.use(ElementUi)
Vue.use(directive)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
