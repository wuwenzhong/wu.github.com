import request from 'common/js/request'
import { U_C, RES, CUS, CLS } from './constants'

// 获取用户信息
export const getInfo = () => {
  return request({
    url: U_C + '/user/get/byaccesstoken',
    method: 'get'
  })
}
// 获取用户基本信息
// export const getInfo = () => {
//   return request({
//     url: U_C + '/user/get',
//     method: 'get'
//   })
// }

// 查询该用户所有的应用
export const application = (data) => {
  return request({
    url: U_C + '/reluserrole/list/roleandappurl',
    method: 'post',
    params: data
  })
}

// 获取信息
export const getCommonInfo = (id) => {
  return request({
    url: U_C + '/getcommoninfo',
    method: 'get'
  })
}
// 修改密码
export const changePassword = (data) => {
  return request({
    url: U_C + '/user/update/password',
    method: 'post',
    params: data
  })
}
// export const changePassword = (data) => {
//   return request({
//     url: U_C + '/user/pwd/update/bytea',
//     method: 'post',
//     params: data
//   })
// }
// 退出登录
export const queit = () => {
  return request({
    url: U_C + '/user/logout',
    method: 'get'
  })
}

// 修改用户信息
export const changeUserInfo = (data) => {
  return request({
    url: U_C + '/user/update/self',
    method: 'post',
    params: data
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: U_C + '/user/logout',
    method: 'get'
  })
}

// 上传文件至腾讯云
export function putObj() {
  return request({
    url: RES + '/cos/temp.secret',
    method: 'get'
  })
}

// 离线使用时上传文件至本地
export function uploadLocal(data, config) {
  const axiosConfig = {
    url: RES + '/pubRes/uploadFile',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params: data
  }
  if (config instanceof Object) {
    for (const key in config) {
      axiosConfig[key] = config[key]
    }
  }
  return request(axiosConfig)
}

// 教务端基本信息展示/根据客户id查询客户信息
export function khInfo(data) {
  return request({
    url: CUS + '/front/customer/get',
    method: 'get',
    params: data
  })
}

// 保存编辑文档
export function saveEditFile(data) {
  return request({
    url: CLS + '/front/help/doc/save',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    params: data
  })
}
// 查看帮助文档
export function getFile(data) {
  return request({
    url: CLS + '/front/help/doc/get/by/type' + data,
    method: 'get'
  })
}
