import request from 'common/js/request'
import { CUS, U_C } from './constants'

// 获取信息
export const getCommonInfo = (id) => {
  return request({
    url: U_C + '/getcommoninfo',
    method: 'get'
  })
}

// 验证当前学校是否激活
export const testActivation = (params) => {
  return request({
    url: CUS + '/front/customer/get',
    method: 'get',
    params
  })
}