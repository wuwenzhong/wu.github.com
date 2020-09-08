import request from 'common/js/request'
import {
  CLS,
  CUS
} from './constants'
// 班级列表首页查询出学生加入或者未加入的班级状态数量
export const stuClassNum = (studentId, customerId) => {
  return request({
    url: CLS + '/front/train/class/statistics',
    meethod: 'get',
    params: {
      studentId,
      customerId
    }
  })
}
// 班级列表
export const classList = (queryType, userId, classStatus, page, size, customerId, keyWord) => {
  return request({
    url: CLS + '/front/train/class/class/list',
    method: 'get',
    params: {
      queryType,
      userId,
      classStatus,
      page,
      size,
      customerId,
      keyWord
    }
  })
}
// 学生进班校验&插入进班记录
export const classCheck = (params) => {
  return request({
    url: CLS + '/front/user/into/class/record/check/intoclass',
    method: 'post',
    params
  })
}
// 删除进班记录
export const delClassRecord = (params) => {
  return request({
    url: CLS + '/front/user/into/class/record/del/into',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    params
  })
}
// 首页展示信息
export const schoolMessage = (data) => {
  return request({
    url: CUS + '/front/customer/get',
    method: 'get',
    params: data
  })
}
