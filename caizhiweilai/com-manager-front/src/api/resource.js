import request from 'common/js/request'
import {
  COS,
  RES
} from './constants'
// 资源文件列表
export const resourceList = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
// 课程选择资源库列表
export const resourceListt = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/list/filter',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
//   新增列表
export const newResource = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/save',
    method: 'post',
    params: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//   上传文件的资源保存
export const wjUp = (data) => {
  return request({
    url: RES + '/pubRes/save',
    method: 'post',
    params: data
  })
}
//   上传文件的资源修改
export const editwjUp = (data) => {
  return request({
    url: RES + '/pubRes/update',
    method: 'post',
    params: data
  })
}
//   替换资源文件
export const thfilie = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
//   删除文件
export const delfilie = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/del/ids',
    method: 'post',
    params: data
  })
}
//   下载文件
export const xzfilie = (data) => {
  return request({
    url: RES + '/pubRes/download',
    method: 'post',
    params: data
  })
}
//   预览文件
export const ylfilie = (data) => {
  return request({
    url: RES + '/pubRes/pre',
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
// 课程资源新增
export const saveres = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
// 课程资源批量新增选择资源库（管理端）
export const savebatch = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/save/batch',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
// 课程资源列表
export const courseidList = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/list/courseid',
    method: 'post',
    params: data
  })
}
// 课程资源批量删除
export const delIds = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/del/ids',
    method: 'post',
    params: data
  })
}
// 课程资源禁用
export const statusEnable = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update/enable/status',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
// 课程资源预览
export const preRes = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update/pre',
    method: 'post',
    params: data
  })
}
// 课程资源替换
export const updateRes = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}

export const allCourse = (data) => {
  return request({
    url: COS + '/front/course/allCourse',
    method: 'get',
    params: data
  })
}

export const allSetBook = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/list/case',
    method: 'get',
    params: data
  })
}
