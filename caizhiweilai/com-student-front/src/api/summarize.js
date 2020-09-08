import request from 'common/js/request'
import { CLS, RES } from './constants'

// 导出
export const studentExport = (params) => {
  return request({
    url: CLS + '/front/summary/student/export',
    method: 'post',
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
    params
  })
}

// 保存资源库
export const pubResSave = (data) => {
  return request({
    url: RES + '/pubRes/save',
    method: 'post',
    params: data
  })
}

// 保存实训总结文件
export const studentSave = (params) => {
  return request({
    url: CLS + '/front/summary/student/save',
    method: 'post',
    params
  })
}

// 查看实训总结
export const studentSummary = (params) => {
  return request({
    url: CLS + '/front/summary/student/summary',
    method: 'get',
    params
  })
}
