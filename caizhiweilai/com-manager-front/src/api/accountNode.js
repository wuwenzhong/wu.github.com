import request from 'common/js/request'
import { COS } from './constants'
// 账套节点列表
export const accountNodeList = (data) => {
    return request({
        url: COS + '/front/case/node/list',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 新增账套节点
export const addAccountNode = (data) => {
    return request({
        url: COS + '/front/case/node/save',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 修改账套节点
export const editAccountNode = (data) => {
    return request({
        url: COS + '/front/case/node/update',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 单独删除节点
export const delAccountNode = (data) => {
    return request({
        url: COS + '/front/case/node/delete/id',
        method: 'post',
        params: data
    })
}
// 批量删除
export const batchDel = (data) => {
    return request({
        url: COS + '/front/case/node/delete/ids',
        // headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}

// 账套列表
export const accountList = (data) => {
    return request({
        url: COS + '/front/case/list',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 添加账套
export const addAccount = (data) => {
    return request({
        url: COS + '/front/case/save',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 修改账套
export const editAccount = (data) => {
    return request({
        url: COS + '/front/case/update',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}

// 删除账套
export const deleteAccount = (data) => {
  return request({
      url: COS + '/front/case/delete/ids',
      // headers: { 'Content-type': 'application/json' },
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      method: 'post',
      params: data
  })
}
