import request from 'common/js/request'
import { CLS, U_C } from './constants'

// 学生列表
export const studentList = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/student/list',
    method: 'get',
    params
  })
}

// 新增学生
export const studentSave = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

// 导入学生
export const studentImport = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/save/import',
    method: 'post',
    params
  })
}

// 编辑学生
export const studentUpdate = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/update',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

// 移出班级
export const studentDelete = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/del/student',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

// 重置密码 （暂时不用）
// export const passwordReset = (params) => {
//   return request({
//     url: U_C + '/user/pwd/update/bytea',
//     method: 'post',
//     params
//   })
// }

// 批量重置密码
export const passwordAnyReset = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/update/pwds',
    method: 'post',
    params
  })
}

// 强制下线
export const studentLogout = (params) => {
  return request({
    url: CLS + '/front/user/into/class/record/student/getout',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}
