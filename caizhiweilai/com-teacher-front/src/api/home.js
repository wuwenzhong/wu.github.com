import request from 'common/js/request'
import { CLS } from './constants'

// 签到管理列表
export const getClassAvgScoreRadarMap = (params) => {
  return request({
    url: CLS + '/front/train/class/class/index/data',
    method: 'get',
    params
  })
}