import request from 'common/js/request'
import { CLS, COS } from './constants'

// 学生端课程资源列表
export const signInSave = (params) => {
  return request({
    url: COS + '/front/ref/course/pub/res/list/stu/condition',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}
// 学生端课程资源下载
export const downloadres = (params) => {
    return request({
      url: COS + '/front/ref/course/pub/res/update/download',
      method: 'post',
      params
    })
  }
  // 课程资源预览（管理端，教师端，学生端公用）
export const preupdate = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update/pre',
    method: 'post',
    params: data
  })
}
// 下载文件
export const xiazaifilie = (data) => {
  return request({
    url: data,
    method: 'get',
    responseType: 'blob'
  })
}