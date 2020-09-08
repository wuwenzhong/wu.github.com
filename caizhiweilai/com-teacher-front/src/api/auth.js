import request from 'common/js/request'
import { U_C } from './constants'

// 获取token
export function ssoGetToken(params) {
  return request({
    url: U_C + '/sso/get/token',
    method: 'post',
    params
  })
}

// 登陆
export function userLogin(phone, pwd) {
  return request({
    url: U_C + '/user/login',
    method: 'post',
    params: {
      phone: phone,
      password: pwd,
      redirectUrl: '',
      remember: 0
    }
  })
}
// 查询该用户所有的应用
export const application = (data) => {
  return request({
    url: U_C + '/reluserrole/list/roleandappurl',
    method: 'post',
    params: data
  })
}
