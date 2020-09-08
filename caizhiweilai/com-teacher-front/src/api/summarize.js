import request from 'common/js/request'
import { CLS } from './constants'

// 查看班级学生
export const teacherSummaryusers = (params) => {
  return request({
    url: CLS + '/front/summary/teacher/summaryusers',
    method: 'get',
    params
  })
}

// 团队列表
export const teamList = (params) => {
  return request({
    url: CLS + '/front/summary/team/list',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
  })
}

// 查看团队成员
export const teamInteam = (params) => {
  return request({
    url: CLS + '/front/team/query/team/user/inteam',
    method: 'get',
    params
  })
}

// 导出总结文件
export const teacherExport = (params) => {
  return request({
    url: CLS + '/front/summary/teacher/export',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

// 查看实训总结
export const stuSummaryDetail = (params) => {
  return request({
    url: CLS + '/front/summary/teacher/stusummarydetail',
    method: 'get',
    params
  })
}

// 批量查看实训总结
export const statisticsList = (params) => {
  return request({
    url: CLS + '/front/summary/teacher/statisticslist',
    method: 'get',
    params
  })
}

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

// 下载文件
export const downloadFile = (url) => {
  return request({
    url,
    method: 'get',
    responseType: 'blob'
  })
}
