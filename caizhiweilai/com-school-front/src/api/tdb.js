import request from 'common/js/request'
import { U_C, CLS, COS, CUS } from './constants'

// 教务端首页
export const queryTaaIndex = (params) => {
  return request({
    url: '/cus/front/customer/query/taaIndex',
    method: 'post',
    params
  })
}

// 教师端首页雷达图
export const schoolIndexData = (params) => {
  return request({
    url: CLS + '/front/train/class/school/index/data',
    method: 'get',
    params
  })
}

// 教务端基本信息
export const queryBaseInfo = (params) => {
  return request({
    url: '/cus/front/customer/get',
    method: 'post',
    params
  })
}

// 教务端基本信息修改
export const updateBaseInfo = (params) => {
  return request({
    url: '/cus/front/customer/update',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
  })
}

// 教务端产品列表
export const queryProductList = (params) => {
  return request({
    url: '/cus/front/customer/query/page/info',
    method: 'post',
    params
  })
}

// 教务端教师列表
export const queryTeacherList = (params) => {
  return request({
    url: '/cls/front/relschoolteacher/query/teacher/list',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
  })
}

// 教务端新增教师
export const newaddTeacher = (params) => {
  return request({
    url: '/cls/front/relschoolteacher/save/teacher',
    method: 'post',
    params
  })
}

// 教务端导入教师
export const importTeacher = (params) => {
  return request({
    url: '/cls/front/relschoolteacher/save/teacher/import',
    method: 'post',
    params
  })
}

// 教务端修改密码
export const updatePassword = (params) => {
  return request({
    url: U_C + '/user/update/password',
    method: 'post',
    params
  })
}

// 教务端编辑教师
export const updateTeacherInfo = (params) => {
  return request({
    url: U_C + '/user/update',
    method: 'post',
    params
  })
}

// 教务端重置密码
export const resetPassword = (params) => {
  return request({
    url: U_C + '/user/pwd/update/bytea',
    method: 'post',
    params
  })
}

// 教务端批量重置密码
export const passwordAnyReset = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/update/pwds',
    method: 'post',
    params
  })
}

// 教务端教师账号禁用
export const disableAccunt = (params) => {
  return request({
    url: U_C + '/user/update/status',
    method: 'post',
    params
  })
}

// 教务端教师账号批量禁用
export const anyDisableAccunt = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/update/user/status',
    method: 'post',
    params
  })
}

// 教务端已购账号导入课程
export const exportClass = (params) => {
  return request({
    url: COS + '/front/course/importurl',
    method: 'post',
    params
  })
}

// 教务端已购账号导入课程  -----
export const exportClassResult = (url) => {
  return request({
    url: url,
    method: 'post'
  })
}

// 检查更新
export const checkUpdate = () => {
  return request({
    url: CUS + '/front/customer/query/application/update',
    method: 'get'
  })
}
// 更新
export const updateHandler = (params) => {
  return request({
    url: CUS + '/front/customer/update/application',
    method: 'post',
    params
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
// 获取激活码
export const getActivationCode = (params) => {
  return request({
    url: CUS + '/front/customer/query/cipher',
    method: 'post',
    params
  })
}
// 线上激活
export const onlineActivation = (params) => {
  return request({
    url: CUS + '/front/customer/update/online/cipher',
    method: 'post',
    params
  })
}
// 线下激活
export const offlineActivation = (params) => {
  return request({
    url: CUS + '/front/customer/update/cipher',
    method: 'post',
    params
  })
}
