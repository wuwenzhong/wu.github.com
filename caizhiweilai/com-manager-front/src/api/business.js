import request from 'common/js/request'
import { COS } from './constants'

// 分页查询定制功能企业信息
export function listInfo(data) {
  return request({
    url: COS + '/front/company/info/list',
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    params: data
  })
}
// 删除企业信息
export function delInfo(data) {
    return request({
      url: COS + '/front/company/info/del',
      method: 'post',
      params: data
    })
  }
//   新增企业信息
export function saveInfo(data) {
    return request({
      url: COS + '/front/company/info/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   企业信息编辑
export function updateInfo(data) {
    return request({
      url: COS + '/front/company/info//update',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }