import Vue from 'vue'
import toast from './toast.vue'

const ToastConstructor = Vue.extend(toast)

const instance = new ToastConstructor({
  el: document.createElement('div')
})

instance.show = false // 默认隐藏
const Toast = {
  show() { // 显示方法
    instance.show = true
    document.body.appendChild(instance.$el)
  },
  hide() { // 隐藏方法
    instance.show = false
  }
}

export default {
  install() {
    if (!Vue.$toast) {
      Vue.$toast = Toast
    }
    Vue.mixin({
      created() {
        this.$toast = Vue.$toast
      }
    })
  }
}
