import request from 'common/js/request'
import { COS } from './constants'
// 题库查询题目列表(支持条件搜索)
export const topicList = (data) => {
    return request({
      url: COS + '/front/question/bank/list/keywrods',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   题库新增题目
export const topicXztm = (data) => {
    return request({
      url: COS + '/front/question/bank/save/question/bank',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   题库删除题目
export const delQuestion = (data) => {
  return request({
    url: COS + '/front/question/bank/del',
    method: 'post',
    params: data
  })
}
// 题库修改题目
export const editQuestion = (data) => {
  return request({
    url: COS + '/front/question/bank/update/question/bank',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    params: data
  })
}
//   题库查询题目编号
export const questionBank = (data) => {
    return request({
      url: COS + '/front/pub/code/get/questioncode',
      method: 'get',
      params: data
    })
  }
//   获取能力项列表(一级能力列表或二级能力列表)
export const AbilityId = (data) => {
    return request({
      url: COS + '/front/capability/listbylevelnum',
      method: 'get',
      params: data
    })
  }

  //   获取能力项列表(一级能力列表或二级能力列表)
  export const exportFile = (data) => {
      return request({
        url: COS + '/front/question/bank/save/questionbank/import',
        method: 'post',
        params: data
      })
    }
