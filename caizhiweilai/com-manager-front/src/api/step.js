import request from 'common/js/request'
import { COS } from './constants'
// 案列步骤
  export const CaseSteps = (data) => {
    return request({
      url: COS + '/api/manager/caseStep/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // 根据案例id查询所有步骤
export function Allstep(data, params) {
    return request({
      url: '/api/manager/caseStep/list',
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      data,
      params
    })
  }
  // 根据步骤id查询详细信息
export function detailedInfor(data, params) {
    return request({
      url: '/api/manager/caseStep/get',
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      data,
      params
    })
  }
  // 修改案例步骤
export function modifyalStep(data, params) {
    return request({
      url: '/api/manager/caseStep/update',
      headers: {
        'Content-type': 'application/json'
      },
      method: 'post',
      data,
      params
    })
  }
  // 全部有效企业列表
  export const infoAll = (data) => {
    return request({
      url: COS + '/front/company/info/all',
      method: 'post',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      params: data
    })
  }
  // 添加任务步骤
  export const saveStep = (data) => {
    return request({
      url: COS + '/front/case/step/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // 选择节点下拉框列表
  export const nodelist = (data) => {
    return request({
      url: COS + '/front/case/node/query/case/node/list',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // 根据应用ID查询岗位
  export const listByAppId = (data) => {
    return request({
      url: COS + '/front/postion/listByAppId',
      method: 'post',
      params: data
    })
  }
  // 根据caseId获取前置任务名称
  export const bycaseidName = (data) => {
    return request({
      url: COS + '/front/case/node/query/case/node/name/bycaseid',
      method: 'get',
      params: data
    })
  }
  // 查询所有账套资源
  export const listType = (data) => {
    return request({
      url: COS + '/front/rel/pub/res/list/type',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // 根据账套id获取任务步骤
  export const caseidList = (data) => {
    return request({
      url: COS + '/front/case/step/list/caseid',
      method: 'get',
      params: data
    })
  }
  // 根据账套步骤id查询
  export const getStep = (data) => {
    return request({
      url: COS + '/front/case/step/get',
      method: 'get',
      params: data
    })
  }
  // 根据账套id查询账套账期列表
  export const caseidListzq = (data) => {
    return request({
      url: COS + '/front/case/step/zq/list/caseid',
      method: 'get',
      params: data
    })
  }
  // 修改账套任务步骤
  export const updateStep = (data) => {
    return request({
      url: COS + '/front/case/step/update',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // 根据id删除账套步骤
  export const delStep = (data) => {
    return request({
      url: COS + '/front/case/step/del',
      method: 'post',
      params: data
    })
  }