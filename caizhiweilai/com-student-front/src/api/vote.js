import request from 'common/js/request'
import { CLS } from './constants'

// 学生端校验当前用户是否存在投票记录
export const resultVote = (params) => {
  return request({
    url: CLS + '/front/vote/result/check/vote/result',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}
// 学生端查询投票参与者列表
export const listVote = (params) => {
    return request({
      url: CLS + '/front/vote/result/list/vote',
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      params
    })
  }
//   学生端确定投票接口
export const saveresultVote = (params) => {
    return request({
      url: CLS + '/front/vote/result/save/vote/result',
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      params
    })
  }
//   教师端或者学生端(查看投票结果)
export const currentVote = (params) => {
    return request({
      url: CLS + '/front/vote/list/vote/current',
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      params
    })
  }