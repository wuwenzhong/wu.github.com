import request from 'common/js/request'
import { CLS } from './constants'

// 学生开始抢答
export const startAnswer = (params) => {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: CLS + '/front/rush/answer/studentrob',
    method: 'post',
    params
  })
}
// 抢答器列表
export const answerList = (params) => {
  return request({
    url: CLS + '/front/rush/answer/robstudentlist',
    method: 'get',
    params
  })
}

// 判断是否可以抢答
export const isAnswer = (params) => {
  return request({
    url: CLS + '/front/teacher/rob/rushdetail',
    method: 'get',
    params
  })
}

// 获取资源列表
export const teachList = (params) => {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: CLS + '/front/resource/query',
    method: 'post',
    params
  })
}

// 学生主动抢答
export const activeAnswer = (params) => {
  return request({
    url: CLS + '/front/rush/answer/checkrob',
    method: 'get',
    params
  })
}
// 获取学生红旗榜数据
export const studentRanking = (data) => {
  return request({
    url: CLS + '/front/redflaglist/student/ranking' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
// 获取团队红旗榜数据
export const teamRanking = (data) => {
  return request({
    url: CLS + '/front/redflaglist/team/ranking' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
