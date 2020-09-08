import request from 'common/js/request'
import { U_C } from './constants'

// 获取token
export function ssoGetToken(data) {
  return request({
    url: U_C + '/sso/get/token',
    method: 'post',
    params: data
  })
}

// 登陆
export function userLogin(phone, pwd) {
  return request({
    url: U_C + '/user/login',
    method: 'post',
    params: {
      phone: phone,
      password: pwd,
      redirectUrl: '',
      remember: 0
    }
  })
}

// 实操系统-新增实操
export function addSem(data) {
  return request({
    url: '/cos/front/operation/save',
    method: 'post',
    params: data,
    headers: { 'Content-type': 'application/json' }
  })
}
// 实操系统-实操列表
export function SemList() {
  return request({
    url: '/cos/front/operation/list',
    method: 'post'
  })
}
// 实操系统-编辑实操
export function editSem(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/operation/update',
    method: 'post',
    params: data
  })
}
// 实操系统-删除实操
export function deleteSem(data) {
  return request({
    url: '/cos/front/operation/del',
    method: 'get',
    params: data
  })
}

// 任务类型维护--新增
export function addTask(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/task/type/save',
    method: 'post',
    params: data
  })
}

// 任务类型维护列表
export function listTask(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/task/type/list',
    method: 'post',
    params: data
  })
}

// 任务类型维护--修改
export function editTask(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/task/type/update',
    method: 'post',
    params: data
  })
}

// 任务类型维护--删除
export function deleteTask(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/task/type/del',
    method: 'get',
    params: data
  })
}

// 能力项--新增
export function addAbility(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/capability/save',
    method: 'post',
    params: data
  })
}

// 能力项--编辑
export function editAbility(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/capability/update',
    method: 'post',
    params: data
  })
}

// 能力项--删除
export function deleteAbility(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/capability/del',
    method: 'get',
    params: data
  })
}

// 能力项列表
export function listAbility(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/capability/listbylevelnum',
    method: 'get',
    params: data
  })
}

// 定制功能-考试列表
export function listExam(data) {
  return request({
    url: '/cos/front/paper/list',
    method: 'get',
    params: data
  })
}

// 定制功能-添加考试
export function addExam(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/paper/save',
    method: 'post',
    params: data
  })
}

// 定制功能-修改考试
export function editExam(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/paper/update',
    method: 'post',
    params: data
  })
}

// 定制功能-修改考试
export function detialExam(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: '/cos/front/ref/paper/item/list',
    method: 'post',
    params: data
  })
}

// 定制功能-查询考试
export function keywrods(data) {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: 'cos/front/question/bank/list/keywrods',
    method: 'post',
    params: data
  })
}

// 定制功能-修改考试
export function deleteExam(data) {
  return request({
    url: '/cos/front/paper/del',
    method: 'post',
    params: data
  })
}
