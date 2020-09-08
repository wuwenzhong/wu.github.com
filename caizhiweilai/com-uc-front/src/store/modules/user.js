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
    userId: '',
    birthday: '',
    email: '',
    gender: '',
    phone: '',
    photo: '',
    age: '',
    stepFlag: '1', // 步骤标识
    stepIdFlag: '', // 步骤id标识
    stepType: '1', // 第几步
    companyId: '', // 企业ID
    nodeId: '', // 节点ID
    nodeIdName: '', // 节点ID名称
    description: '', // 描述
    posId: '', // 岗位ID
    posIdName: '', // 岗位ID名称
    preStepIds: '', // 前置任务步骤ID
    preStepIdsName: [], // 前置任务步骤ID名称
    relRes: '', // 资源IDs
    relResName: [], // 资源IDs名称
    tallyMonth: '', // 账期 月份
    tallyYear: '', // 年份
    tallyMonthType: 'AUTO'// 账期类型
  },
  mutations: {
    STEP_stepFlag: (state, stepFlag) => {
      state.stepFlag = stepFlag
    },
    STEP_stepType: (state, stepType) => {
      state.stepType = stepType
    },
    STEP_stepIdFlag: (state, stepIdFlag) => {
      state.stepIdFlag = stepIdFlag
    },
    STEP_companyId: (state, companyId) => {
      state.companyId = companyId
    },
    STEP_nodeId: (state, nodeId) => {
      state.nodeId = nodeId
    },
    STEP_nodeIdName: (state, nodeIdName) => {
      state.nodeIdName = nodeIdName
    },
    STEP_posId: (state, posId) => {
      state.posId = posId
    },
    STEP_posIdName: (state, posIdName) => {
      state.posIdName = posIdName
    },
    STEP_description: (state, description) => {
      state.description = description
    },
    STEP_preStepIds: (state, preStepIds) => {
      state.preStepIds = preStepIds
    },
    STEP_preStepIdsName: (state, preStepIdsName) => {
      state.preStepIdsName = preStepIdsName
    },
    STEP_relRes: (state, relRes) => {
      state.relRes = relRes
    },
    STEP_relResName: (state, relResName) => {
      state.relResName = relResName
    },
    STEP_tallyYear: (state, tallyYear) => {
      state.tallyYear = tallyYear
    },
    STEP_tallyMonth: (state, tallyMonth) => {
      state.tallyMonth = tallyMonth
    },
    STEP_tallyMonthType: (state, tallyMonthType) => {
      state.tallyMonthType = tallyMonthType
    },
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
    },
    SET_BIRTHDAY: (state, birthday) => {
      state.birthday = birthday
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_GENDER: (state, gender) => {
      state.gender = gender
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_PHOTO: (state, photo) => {
      state.photo = photo
    },
    SET_AGE: (state, age) => {
      state.age = age
    }
  },
  actions: {
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          if (res.code === '0') {
            localStorage.setItem('userMsg', JSON.stringify(res.result))
            getCommonInfo().then(res => {
              // 保存返回用户中心地址
              localStorage.setItem('centerUrl', res.result.redirectUrl)
              localStorage.setItem('saas', res.result.saas)
              localStorage.setItem('networkState', res.result.network)
            })
            const userInfo = res.result
            commit('SET_NAME', userInfo.name)
            commit('SET_AVATAR', userInfo.photo || require('common/images/avatar.jpg'))
            commit('SET_ID', userInfo.id)
            commit('SET_URL', userInfo.ucUrl)
            commit('SET_BIRTHDAY', userInfo.birthday)
            commit('SET_EMAIL', userInfo.email)
            commit('SET_GENDER', userInfo.gender)
            commit('SET_PHONE', userInfo.phone)
            commit('SET_PHOTO', userInfo.photo)
            commit('SET_AGE', userInfo.age)
          }
        }).catch(error => {
          reject(error)
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
            getCommonInfo().then(res => {
              // 保存返回用户中心地址
              localStorage.setItem('centerUrl', res.result.redirectUrl)
              location.href = state.userCenterUrl + '?redirectUrl=' + Base64.encode(localStorage.getItem('centerUrl'))
            })
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
