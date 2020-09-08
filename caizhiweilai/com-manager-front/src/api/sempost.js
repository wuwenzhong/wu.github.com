/* eslint-disable */
import request from 'common/js/request'
import { COS } from './constants'

/* --------------------------------------------- */
/* -------------------权限管理------------------- */
/* --------------------------------------------- */
// 查询系统应用列表
export function querySystem() {
	return request({
		url: COS + '/front/operation/list',
		method: 'get',
	})
}

// 根据应用id查询菜单列表（第二列列表）
export function systemToMenu(data) {
	return request({
		url: COS + '/front/menu/listByAppId',
    method: 'get',
		headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: data
	})
}

// 根据菜单查询功能
export function menuToFunc(params) {
	return request({
		url: COS + '/front/func/listByMenuId',
		method: 'get',
		params
	})
}

// 根据应用ID查询岗位
export function systemToPost(params) {
	return request({
		url: COS + '/front/postion/listByAppId',
		method: 'get',
		params
	})
}

// 根据应用ID查询功能列表
export function systemToFunc(params) {
	return request({
		url: COS +  '/front/func/listByAppId',
		method: 'get',
		params
	})
}

// 根据岗位ID查询功能
export function postToPowers(params) {
	return request({
		url: COS + '/front/postion/listByPosId',
		method: 'get',
		params
	})
}

// 给岗位分配权限
export function assignPowersPost(params) {
	return request({
		url: COS + '/front/postion/assign',
    method: 'post',
    headers: {
			'Content-type': 'application/json'
		},
		params
	})
}


/* -------------------------------------------------------- */
/* -----------------------菜单----------------------------- */
/* -------------------------------------------------------- */

// 新增菜单 
export function menuAdd(params) {
	return request({
		url: COS + '/front/menu/save',
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		params
	})
}
// 删除菜单
export function menuDel(params) {
	return request({
		url: COS + '/front/menu/del',
		method: 'get',
		params
	})
}
// 编辑菜单 
export function menuEdit(params) {
	return request({
		url: COS + '/front/menu/update',
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		params
	})
}

// // 公共资源---保存
// export function commonPreserve(data, params) {
// 	return request({
// 		url: '/api/res/pubRes/save',
// 		method: 'post',
// 		headers: {
// 			'Content-type': 'application/json'
// 		},
// 		data,
// 		params
// 	})
// }
// // 公共资源---删除
// export function commonDelete(data, params) {
// 	return request({
// 		url: '/api/res/pubRes/del',
// 		method: 'post',
// 		data,
// 		params
// 	})
// }

// 保存菜单资源
export function conserveMenuResource(params) {
	return request({
		url: COS + '/front/rel/menu/res/save',
		method: 'get',
		params
	})
}
// 查询菜单关联的资源
export function queryResource(params) {
	return request({
		url: COS + '/front/rel/menu/res/pubRes',
		method: 'get',
		params
	})
}
// 删除菜单资源关联关系
// export function DeleteMenuResource(data, params) {
// 	return request({
// 		url: '/api/uc/menu/res.del',
// 		method: 'post',
// 		data,
// 		params
// 	})
// }


/* -------------------------------------------------------- */
/* -----------------------功能----------------------------- */
/* -------------------------------------------------------- */
// 根据id查询
export function funcQuery(params) {
	return request({
		url: COS + '/front/func/get',
		method: 'get',
		params
	})
}
// 新增
export function funcAdd(params) {
	return request({
		url: COS + '/front/func/save',
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		params
	})
}
// 删除
export function funcDel(params) {
	return request({
		url: COS + '/front/func/del',
		method: 'get',
		params
	})
}
// 更新
export function funcEdit(params) {
	return request({
		url: COS + '/front/func/update',
    method: 'post',
    headers: {
			'Content-type': 'application/json'
		},
		params
	})
}
/* -------------------------------------------------------- */
/* -----------------------岗位----------------------------- */
/* -------------------------------------------------------- */
// 新增
export function postAdd(params) {
	return request({
		url: COS + '/front/postion/save',
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		params
	})
}
// 删除
export function posDel(params) {
	return request({
		url: COS + '/front/postion/del',
		method: 'get',
		params
	})
}
// 修改
export function posEdit(params) {
	return request({
		url: COS + '/front/postion/update',
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		params
	})
}

// 根据岗位id查询
export function posQuery(params) {
	return request({
		url: COS + '/front/postion/get',
		method: 'get',
		params
	})
}