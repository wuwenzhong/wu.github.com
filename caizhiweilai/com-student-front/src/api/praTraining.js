import request from 'common/js/request'
import { CLS, RES } from './constants'
// 下载文件
export const xiazaifilie = (data) => {
    return request({
      url: data,
      method: 'get',
      responseType: 'blob'
    })
  }
// 【学生端】获取学生任务记录
export const tastrw = (data) => {
    return request({
      url: CLS + '/front/student/task/record/get/case/task',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      params: data
    })
  }
// 【学生端】学生任务下一步
export const nexttast = (data) => {
    return request({
        url: CLS + '/front/student/task/record/update/case/task/next',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        params: data
    })
}

// 【学生端】学生任务下一步
export const returnTask = (data) => {
    return request({
        url: CLS + '/front/student/task/record/return/case/task',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        params: data
    })
}

// 【学生端】学生完成任务
export const finishTask = (data) => {
    return request({
        url: CLS + '/front/student/task/record/finish/case/task',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        params: data
    })
}

// 【学生端】学生查看资源
export const getTaskRes = (data) => {
    return request({
        url: CLS + '/front/student/task/record/get/case/task/res',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        params: data
    })
}
// 获取当前账套的任务时间
export const getAccountTime = (data) => {
  return request({
    url: CLS + '/front/account/company/record/query/usetime',
    method: 'get',
    headers: { 'Content-type': 'application/json' },
    params: data
  })
}
// 保存当前账套任务的时间
export const holdAccountTime = (data) => {
  return request({
    url: CLS + '/front/account/company/record/update/usetime',
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    params: data
  })
}
