import request from 'common/js/request'
import { CLS } from './constants'

// 签到
export const signInSave = (params) => {
  return request({
    url: CLS + '/front/ref/sign/in/item/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

// 首页详情
export const studentData = (params) => {
  return request({
    url: CLS + '/front/classcourse/stu/index/data',
    method: 'get',
    params
  })
}