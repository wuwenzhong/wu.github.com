import request from 'common/js/request'
import {
  U_C
} from './constants'

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

// 考试--是否可以进入考试
export function isEnter(data) {
  return request({
    url: '/cls/front/exam/student/query/progress',
    method: 'get',
    params: data,
    headers: { 'Content-type': 'application/json' }
  })
}

// 考试--进入考试
export function enterExam(data) {
  return request({
    url: '/cls/front/exam/student/save',
    method: 'get',
    params: data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

// 考试--答题
export function answerHandler(data) {
  return request({
    url: '/cls/front/exam/student/submit',
    method: 'post',
    params: data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

// 考试--提交整个试卷
export function submitText(data) {
  return request({
    url: '/cls/front/exam/student/submitAll',
    method: 'post',
    params: data
  })
}

// 考试--提交整个试卷
export function examResult(data) {
  return request({
    url: '/cls/front/exam/student/query/exam/answer',
    method: 'get',
    params: data
  })
}
