import request from 'common/js/request'
import {
  U_C,
  CLS
} from './constants'

// 教务端首页
export const studentList = (data) => {
  return request({
    headers: {
      'Content-type': 'application/json'
    },
    url: CLS + '/front/rel/user/classes/com/student/list',
    method: 'post',
    params: data
  })
}

// 教务端 学生管理 启用禁用
export const disableAccunt = (data) => {
  return request({
    url: U_C + '/user/update/status',
    method: 'post',
    params: data
  })
}

// 教务端 学生管理 重置密码
export const resetPassword = (data) => {
  return request({
    url: CLS + '/front/rel/user/classes/update/pwds',
    method: 'post',
    params: data
  })
}

// 教务端 学生管理 强制下线
export const forceOff = (data) => {
  return request({
    headers: {
      'Content-type': 'application/json'
    },
    url: CLS + '/front/user/into/class/record/student/getout',
    method: 'post',
    params: data
  })
}

// 教务端 学生管理 强制启用
export const banch = (data) => {
  return request({
    url: CLS + '/front/rel/user/classes/update/user/status',
    method: 'post',
    params: data
  })
}
