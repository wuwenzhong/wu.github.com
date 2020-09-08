import request from 'common/js/request'
import { CLS } from './constants'

// 签到管理列表
export const signList = (params) => {
  return request({
    url: CLS + '/front/sign/in/list',
    method: 'get',
    params
  })
}

// 签到前校验
export const signValid = (params) => {
  return request({
    url: CLS + '/front/sign/in/valid',
    method: 'get',
    params
  })
}

// 发起签到
export const signSave = (params) => {
  return request({
    url: CLS + '/front/sign/in/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

// 结束签到
export const signStop = (params) => {
  return request({
    url: CLS + '/front/sign/in/stop',
    method: 'get',
    params
  })
}

// 删除记录
export const signDel = (params) => {
  return request({
    url: CLS + '/front/sign/in/del',
    method: 'post',
    params
  })
}

// 查看签到详情
export const signItemList = (params) => {
  return request({
    url: CLS + '/front/ref/sign/in/item/list',
    method: 'get',
    params
  })
}

// 导出签到记录
export const signExport = (params) => {
  return request({
    url: CLS + '/front/sign/in/export',
    method: 'post',
    responseType: 'blob',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}
// 考核方案列表查询
export const setProgrammeList = (classId) => {
  return request({
    url: CLS + '/front/assessment/scheme/listByClassId',
    method: 'get',
    params: { classId }
  })
}
// 设置考核方案保存
export const setProgramme = (data) => {
  return request({
    url: CLS + '/front/assessment/scheme/upScore',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params: data
  })
}
// 开始实训前的校验
export const checkTrain = (classId) => {
  return request({
    url: CLS + '/front/assessment/scheme/beginOperationCheck',
    method: 'get',
    params: { classId }
  })
}

// 查询实训状态
export const trainStatus = (trainClassId) => {
  return request({
    url: CLS + '/front/train/class/get',
    method: 'get',
    params: { trainClassId }
  })
}
/**
 *开始实训/结束实训
 * @param {*} classId
 * @param {*1-开始实训  2-结束实训} operationType
 */
export const startAndEndTrain = (classId, operationType) => {
  return request({
    url: CLS + '/front/assessment/scheme/beginEndOperation',
    method: 'get',
    params: { classId, operationType }
  })
}
// 重置实训
export const resetTrain = (classId) => {
  return request({
    url: CLS + '/front/assessment/scheme/resetOperation',
    method: 'get',
    params: { classId }
  })
}
// 开始实训前验证是否建立团队
export const isCreatTeam = (classId) => {
  return request({
    url: CLS + '/front/assessment/scheme/teamcheck',
    method: 'get',
    params: { classId }
  })
}