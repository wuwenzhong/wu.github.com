import axios from 'axios'
import { MessageBox, Loading } from 'element-ui'
import { getToken, removeToken } from 'common/js/utils'
import { getInfo, logout } from 'api/user'
import { getCommonInfo } from '@/api/base'
import qs from 'qs'
import Cookies from 'js-cookie' // 引入cookie
const Base64 = require('js-base64').Base64
// 开始加载动画
let loading
function startLoading() {
  loading = Loading.service({
    lock: true, // 是否锁定
    text: '拼命加载中...', // 加载中需要显示的文字
    background: 'transparent' // 背景颜色
  })
}
// 结束加载动画
function endLoading() {
  loading.close()
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  withCredentials: true,
  timeout: 200000 // 请求超时时间
})
// request 拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.accessToken = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    startLoading() // 请求时的加载动画
    return config
  },
  error => {
    //  这里处理一些请求出错的情况
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  res => {
    endLoading() // 如果错误也结束动画
    // 是否退出标识
    if (decodeURI(Cookies.get('czwlflag')) != '学生端' && Cookies.get('czwlflag')) {
      getCommonInfo().then(res => {
        // 保存返回用户中心地址 redirectUrl
        if (res.code == 0 || res.code == '0') {
          location.href = res.result.redirectUrl
        }
      })
    }
    if (res.data.code === '0005') {
      MessageBox.alert(res.data.message, '登录失效', {
        confirmButtonText: '跳转到登录页面',
        callback: action => {
          removeToken()
          getCommonInfo().then(res => {
            // 保存返回用户中心地址
            localStorage.setItem('centerUrl', res.result.redirectUrl)
            location.href = res.data.result + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
          })
        }
      })
    }
    if (res.data.code === '0006') {
      MessageBox.alert('登录信息超时,请重新登录!', '登录超时', {
        confirmButtonText: '跳转到登录页面',
        callback: action => {
          removeToken()
          location.href = res.data.result + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
        }
      })
    }
    if (res.data.code === '0007') {
      MessageBox.alert('您的账号已在其他地方登录!', '登录失效', {
        confirmButtonText: '跳转到登录页面',
        callback: action => {
          removeToken()
          location.href = res.data.result + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
        }
      })
    }
    if (res.data.code === '0008') {
      removeToken()
      location.href = res.data.result + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
    }
    return res.data
  },
  error => {
    // 这里处理一些response 出错时的逻辑
    endLoading() // 如果错误也结束动画
    return Promise.reject(error)
  }
)

async function request (opts) {
  // 参数opts不是一个对象
  if (Object.prototype.toString.call({}).slice(8, -1) !== 'Object') {
    return console.error('参数不正确！')
  }

  opts.method = opts.method || 'get'

  if (['post', 'put', 'patch'].includes(opts.method.toLocaleLowerCase())) {
    const { url, method, params, headers, responseType, onUploadProgress } = opts
    try {
      if (opts.headers) {
        const res = await service({
          url,
          method,
          data: params,
          headers,
          responseType,
          onUploadProgress
        })
        return res
      } else {
        const res = await service({
          url,
          method,
          data: qs.stringify(params),
          responseType,
          onUploadProgress
        })
        return res
      }
    } catch (err) {
      return err
    }
  } else {
    try {
      const res = await service(opts)
      return res
    } catch (err) {
      return err
    }
  }
}

export default request
