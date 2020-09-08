import request from 'common/js/request'
import { CLS } from './constants'

// 开始抢答
export const startAnswer = (params) => {
  return request({
    headers: { 'Content-type': 'application/json' },
    url: CLS + '/front/teacher/rob/startuprush',
    method: 'post',
    params
  })
}

// 结束抢答
export const endAnswer = (params) => {
  return request({
    url: CLS + '/front/rush/answer/endscramble',
    method: 'get',
    params
  })
}

// 学生抢答列表
export const answerList = (params) => {
  return request({
    url: CLS + '/front/rush/answer/robstudentlist',
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

// 获取资源列表
export const isAnswer = (params) => {
  return request({
    url: CLS + '/front/teacher/rob/teacherCheck',
    method: 'get',
    params
  })
}
