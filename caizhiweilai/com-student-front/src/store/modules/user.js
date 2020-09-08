import { getInfo, logout } from 'api/user'
import { removeToken } from 'common/js/utils'
import { message } from 'element-ui'
import { getCommonInfo } from '@/api/base'
const Base64 = require('js-base64').Base64
const user = {
  state: {
    userName: '',
    avatar: '',
    userCenterUrl: '',
    userId: ''
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.userName = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_URL: (state, url) => {
      state.userCenterUrl = url
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ID: (state, id) => {
      state.userId = id
    }
  },
  actions: {
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          if (res.code === '0') {
            const userInfo = res.result
            commit('SET_NAME', userInfo.name)
            commit('SET_AVATAR', userInfo.photo || require('common/images/avatar.jpg'))
            commit('SET_ID', userInfo.id)
            commit('SET_URL', userInfo.ucUrl)
          }
        }).catch(error => {
          reject(error)
        })
        getCommonInfo().then(res => {
          // console.log(res)
          // 保存返回用户中心地址
          localStorage.setItem('centerUrl', res.result.redirectUrl)
          localStorage.setItem('saas', res.result.saas)
          localStorage.setItem('networkState', res.result.network)
        })
      })
    },
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          if (res.code === '0') {
            removeToken()
            localStorage.removeItem('ticket')
            localStorage.setItem('userCenterUrl', state.userCenterUrl)
            location.href = localStorage.getItem('userCenterUrl') + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
          } else {
            message({
              type: 'warning',
              message: res.message
            })
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
