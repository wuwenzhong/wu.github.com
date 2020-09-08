import request from 'common/js/request'
import { CLS, RES, COS } from './constants'
// 进入实训中心
export const joinTrain = (data) => {
  return request({
    url: CLS + '/front/classcourse/stu/querybyclassid',
    method: 'get',
    params: data
  })
}
// 根据班级id查询大纲列表
export const classidtask = (data) => {
  return request({
    url: CLS + '/front/classoutline/stu/querybyclassid',
    method: 'get',
    params: data
  })
}
// 根据班级大纲id查询任务列表
export const classoutlineidtask = (data) => {
  return request({
    url: CLS + '/front/classtask/stu/query/classoutlineid',
    method: 'get',
    params: data
  })
}
// 根据班级任务id查询任务及答案
export const querytask = (data) => {
  return request({
    url: CLS + '/front/classtask/querytaskandanswer',
    method: 'get',
    params: data
  })
}
//   上传文件的资源保存
export const wjUp = (data) => {
  return request({
    url: RES + '/pubRes/save',
    method: 'post',
    params: data
  })
}
//   暂存/完成任务（个人/团队）
export const zcgrtd = (data) => {
  return request({
    url: CLS + '/front/taskanswer/savetaskanswer',
    method: 'post',
    params: data
  })
}
// 暂存任务（知识点）
export const zczsd = (data) => {
  return request({
    url: CLS + '/front/userknowledgerecord/saverecord',
    method: 'post',
    params: data
  })
}
// 完成任务（实操/考试/知识点）
export const fnish = (data) => {
  return request({
    url: CLS + '/front/usertaskrecord/finishtask',
    method: 'post',
    params: data
  })
}
// 根据班级任务id查询启用的企业
export const classtaskidList = (data) => {
  return request({
    url: CLS + '/front/classenterprise/stu/list/byclasstaskid',
    method: 'get',
    params: data
  })
}

// 查询一级行业
export function getFirstIndustry() {
  return request({
    url: COS + '/front/national/standard/allnational',
    method: 'get'
  })
}

// 查询二三级行业
export function getOtherIndustry(data) {
  return request({
    url: COS + '/front/national/standard/querybypid?pid=' + data,
    method: 'get'
  })
}

// 创建企业
export function savecompany(data) {
  return request({
    url: CLS + '/front/classenterprise/save/company',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
  })
}

// 获取或者修改学院完成案例时间
export function xycaseTime(data, params) {
  return request({
    url: '/api/ds/studentCaseRecord/getUseTimeOrUpdate',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data,
    params
  })
}

// 执行Python
export function runCode(data) {
  return request({
    url: CLS + '/front/python/history/save',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
  })
}

// Python历史记录
export function getHistoryData(data) {
  return request({
    url: CLS + '/front/python/history/list',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
  })
}

// 获取云账房rpa地址
export function getRpaUrl(data) {
  return request({
    url: CLS + '/front/classenterprise/query/raptoken?type=' + data,
    method: 'get'
  })
}

// 处理下载text问题
export const xiazaifilie = (data) => {
  return request({
    url: data,
    method: 'get',
    responseType: 'blob'
  })
}

// 获取账套数据列表
export function getAccountList(data) {
  return request({
    url: CLS + '/front/account/company/record/student/query/company' + data,
    method: 'get'
  })
}

// 套账新增企业
export function newAddAccount(data) {
  return request({
    url: CLS + '/front/account/company/record/save/company',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
  })
}

// 组长获取套账学员
export function getAccountStudy(data) {
  return request({
    url: CLS + '/front/account/company/record/query/teamuser' + data,
    method: 'get'
  })
}
// 组长分配企业到学员
export function setDistribut(data) {
  return request({
    url: CLS + '/front/account/company/record/update/record',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
  })
}
