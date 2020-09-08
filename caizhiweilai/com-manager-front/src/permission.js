import router from './router'
import store from './store'
import { getToken, setToken, getQueryString, urlDelParams } from 'common/js/utils'
import { ssoGetToken, userLogin } from 'api/auth'
import { getCommonInfo } from '@/api/base'
import { USER_NAME, PASSWORD } from 'api/config'
import { application } from '@/api/user.js'
import appContext from './common/js/context'
import md5 from 'js-md5'
const Base64 = require('js-base64').Base64
function _getUserInfo() {
  store.dispatch('GetUserInfo')
}

router.beforeEach(async (to, from, next) => {
  if (appContext.getItemInCookieBase64SliceValue('userToken')) {
    setToken(appContext.getItemInCookieBase64SliceValue('userToken', 2))
  }
  const param = {
    ticket: getQueryString('ticket')
  }
  // 开发环境获取token
  if (process.env.NODE_ENV === 'development') {
    if (store.getters.permissionRoutes.length === 0) {
      const res = await userLogin(USER_NAME, md5(PASSWORD))
      if (res.code === '0') {
        setToken(res.result.access_token)
        // _getroutes(to, from, next)
        _getUserInfo()
        next()
      }
    } else {
      next()
    }
  } else {
    if (param.ticket && param.ticket !== localStorage.getItem('ticket')) {
      const res = await ssoGetToken(param)
      if (res.code === '0') {
        setToken(res.result)
        localStorage.setItem('ticket', param.ticket)
      } else {
        const res = await getCommonInfo()
        if (res.code === '0') {
          location.href = `${res.result.ucLoginUrl}/login?redirectUrl=${Base64.encode(window.location)}`
        }
      }
      // _getroutes(to, from, next)
      _getUserInfo()
      next()
    } else if (!getToken()) {
      const res = await getCommonInfo()
      if (res.code === '0') {
        location.href = `${res.result.ucLoginUrl}/login?redirectUrl=${Base64.encode(window.location)}`
      }
    } else {
      if (!store.getters.userId) {
        // _getroutes(to, from, next)
        _getUserInfo()
        next()
      } else {
        next()
      }
    }
  }

  // 处理登录权限不是管理员跳转到用户中心
  const res = await application({ appTypes: 2 })
  if (res.code === '0') {
    var newArr = []
    res.result.map(item => {
      newArr.push(item.roleId)
    })
    if (newArr.indexOf('16') == -1) {
      location.href = localStorage.getItem('centerUrl') + '?flag=1'
    } else {
      next()
    }
  }
})
router.beforeResolve((to, from, next) => {
  next()
  if (to.query.ticket) {
    history.replaceState(null, null, urlDelParams(to.fullPath, 'ticket'))
  }
})
