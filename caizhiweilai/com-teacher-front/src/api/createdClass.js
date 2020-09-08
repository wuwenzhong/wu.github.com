// eslint-disable-next-line import/no-duplicates
import request from 'common/js/request'
import {
  CLS,
  CUS
} from './constants'
// 查询班级数量
export const classNum = (teacherId, customerId) => {
  return request({
    url: CLS + '/front/train/class/statistics',
    method: 'get',
    params: {
      teacherId,
      customerId
    }
  })
}
// 查询已购买的课程
export const buyCourse = (customerId) => {
  return request({
    url: CUS + '/front/customer/license/query/customer/course',
    method: 'get',
    params: {
      customerId
    }
  })
}
// 创建班级
export const addClass = (data) => {
  return request({
    url: CLS + '/front/train/class/save',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
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
// 修改班级
export const editClass = (data) => {
  return request({
    url: CLS + '/front/train/class/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
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
// 首页删除班级
export const deleteClass = (data) => {
  return request({
    url: CLS + '/front/train/class/del',
    method: 'post',
    params: data
  })
}
