import request from 'common/js/request'
import { CLS } from './constants'
// 教师端开启投票校验
export const checkvote = (params) => {
    return request({
      url: CLS + '/front/vote/check/query',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      params
    })
  }
//   选择抽取目标集合/投票按学生/按团队查询数据
export const showusers = (params) => {
  return request({
    url: CLS + '/front/carousel/showusers',
    method: 'get',
    params
  })
}
  // 教师端开启投票新增
  export const sureVote = (params) => {
    return request({
      url: CLS + '/front/vote/save/vote',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      params
    })
  }
  // 教师端或者学生端(查看投票结果)
  export const currentVote = (params) => {
    return request({
      url: CLS + '/front/vote/list/vote/current',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      params
    })
  }
  // 教师端查询往期投票结果列表
  export const allVote = (params) => {
    return request({
      url: CLS + '/front/vote/list/vote/all',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      params
    })
  }
  // 教师端查询单个往期参与项
  export const singVote = (params) => {
    return request({
      url: CLS + '/front/vote/list/vote/user/byid',
      method: 'post',
      params
    })
  }
  // 教师端停止投票
  export const stopVote = (params) => {
    return request({
      url: CLS + '/front/vote/stop/vote',
      method: 'post',
      params
    })
  }