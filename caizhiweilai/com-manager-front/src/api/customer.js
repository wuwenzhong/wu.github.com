import request from 'common/js/request'
import { CUS, U_C, COS, CLS } from './constants'
// 新增客户
export const addCustomer = (data) => {
    return request({
        url: CUS + '/front/customer/save',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 查询当前客户信息
export const queryCustomerInfo = (customerId) => {
    return request({
        url: CUS + '/front/customer/get',
        method: 'get',
        params: { customerId }
    })
}
// 修改客户
export const editCustomer = (data) => {
    return request({
        url: CUS + '/front/customer/update',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}

// 客户列表
export const customerList = (data) => {
    return request({
        url: CUS + '/front/customer/list',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 院校列表
export const getSchoolList = (data) => {
    return request({
      url: U_C + '/uschool/list',
      method: 'get',
      params: data
    })
}

// 客户详情列表
export const customerDetailList = (data) => {
    return request({
        url: CUS + '/front/customer/query/page/info',
        method: 'post',
        params: data
    })
}
// 管理员账号列表查询
export const acountList = (data) => {
    return request({
        url: CUS + '/front/customer/college/manager/list',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 新增管理员账号
export const addAcount = (data) => {
    return request({
        url: CUS + '/front/customer/college/manager/save',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}
// 重置密码
// export const restPassWord = (data) => {
//     return request({
//         url: U_C + '/user/pwd/update/bytea',
//         method: 'post',
//         params: data
//     })
// }
export const restPassWord = (params) => {
  return request({
    url: CLS + '/front/rel/user/classes/update/pwds',
    method: 'post',
    params
  })
}
// 查询课程列表
export const queryCouseList = () => {
    return request({
        url: COS + '/front/course/allCourse',
        method: 'get'
    })
}
// 新增课程
export const addCourse = (data) => {
    return request({
        url: CUS + '/front/customer/license/save',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}

// 续费、升级、启用、禁用
export const licenseUpdate = (data) => {
    return request({
        url: CUS + '/front/customer/license/update',
        headers: { 'Content-type': 'application/json' },
        method: 'post',
        params: data
    })
}

// 生成激活码
export const getActivationCode = (data) => {
  return request({
    url: CUS + '/front/customer/query/cipher',
    method: 'post',
    params: {
      content: data
    }
  })
}
