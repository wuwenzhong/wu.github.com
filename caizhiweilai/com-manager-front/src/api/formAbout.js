import request from 'common/js/request'
import { SCS, COS } from './constants'

// 税率下拉列表
export function screenTaxRate(params) {
	return request({
		url: SCS + '/front/screen/query/taxRate',
    method: 'get',
    params
	})
}

// 表单信息下拉列表
export function screenFormInfo(params) {
	return request({
		url: SCS + '/front/screen/query/form/info',
    method: 'get',
    params
	})
}

// 表单分类列表
export function screenFormType(params) {
	return request({
		url: SCS + '/front/screen/query/form/type',
    method: 'get',
    params
	})
}

// 表单设置列表
export function screenFormList(params) {
	return request({
		url: SCS + '/front/screen/query/form/list',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 设置权重
export function screenSaveWeight(params) {
	return request({
		url: SCS + '/front/screen/save/weight',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 获取权重
export function screenGetWeight(params) {
	return request({
		url: SCS + '/front/screen/query/weight',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 获取默认数据
export function screenGetValue(params) {
	return request({
		url: SCS + '/front/screen/query/default/value',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 设置默认数据
export function screenSaveValue(params) {
	return request({
		url: SCS + '/front/screen/save/default/value',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 设置答案
export function screenSaveAnswer(params) {
	return request({
		url: SCS + '/front/screen/save/answer',
		headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 获取答案
export function screenGetAnswer(params) {
	return request({
		url: SCS + '/front/screen/query/answer',
		headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 会计科目列表
export function accountSubjectList(params) {
	return request({
		url: SCS + '/front/accountsubject/list',
		headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 科目模糊搜索下拉列表
export function getVagueList(params) {
	return request({
		url: SCS + '/front/accountsubject/list/bylike',
    method: 'get',
    params
	})
}

// 会计科目下拉列表
export function accountSubjectListBy(params) {
	return request({
		url: SCS + '/front/accountsubject/list/bycondition',
    method: 'get',
    params
	})
}

// 会计科目新增
export function accountsubjectSave(params) {
	return request({
		url: SCS + '/front/accountsubject/save',
		headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 会计科目修改
export function accountsubjectUpdate(params) {
	return request({
		url: SCS + '/front/accountsubject/update',
		headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}

// 会计科目删除
export function accountsubjectDel(params) {
	return request({
		url: SCS + '/front/accountsubject/del',
    method: 'post',
    params
	})
}

// 课程列表
export const getCourseList = () => {
	return request({
		url: COS + '/front/course/list/byfrom',
		method: 'get'
	})
}

// 任务列表
export function getTaskList(params) {
	return request({
		url: COS + '/front/task/bycourseId',
		headers: { 'Content-type': 'application/json' },
    method: 'post',
    params
	})
}
