import request from 'common/js/request'
import { U_C } from './constants'

// 获取信息
export const getCommonInfo = () => {
  return request({
    url: U_C + '/getcommoninfo',
    method: 'get'
  })
}

// 查询该用户所有的应用
export const application = (params) => {
  return request({
    url: U_C + '/reluserrole/list/roleandappurl',
    method: 'post',
    params
  })
}