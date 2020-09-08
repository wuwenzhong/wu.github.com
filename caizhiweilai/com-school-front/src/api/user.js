import request from 'common/js/request'
import { U_C, RES, CLS } from './constants'

// 获取用户信息
export const getInfo = () => {
  return request({
    url: U_C + '/user/get/byaccesstoken',
    method: 'get'
  })
}

// 获取用户信息
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
export function uploadLocal(data) {
  return request({
    url: RES + '/pubRes/uploadFile',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
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
