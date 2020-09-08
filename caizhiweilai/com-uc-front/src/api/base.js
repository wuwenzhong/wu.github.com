import request from 'common/js/request'
import { U_C } from './constants'

// 获取信息
export const getCommonInfo = (id) => {
  return request({
    url: U_C + '/getcommoninfo',
    method: 'get'
  })
}