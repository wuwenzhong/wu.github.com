/* eslint-disable */
import request from 'common/js/request'
import { SCS } from './constants'

// 查询权重列表
export function getWeightAnswerList(data) {
	return request({
		url: SCS + '/front/excel/temp/exceltemp/list',
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: data
	})
}

// 获取权重
export function yzfweightdata(data) {
	return request({
		url: SCS + '/front/report/temp/weight/get/yzfweightdata',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: data
	})
}

// 一键同步答案
export function allyzfanswerdata(data) {
	return request({
		url: SCS + '/front/case/answer/get/allyzfanswerdata',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: data
	})
}

// 保存答案
export function answerSave(data) {
	return request({
		url: SCS + '/front/case/answer/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
	})
}

