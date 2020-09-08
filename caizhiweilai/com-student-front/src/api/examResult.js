import request from 'common/js/request'
import { SCS } from './constants'

// 获取当前学生的所有考试列表
export const getStudyResult = (data) => {
  return request({
    url: SCS + '/front/score/query/student/score',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params: data
  })
}
// 获取当前学生的总称成绩
export const getStudyTotalScore = (data) => {
  return request({
    url: SCS + '/front/score/query/my/score',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params: data
  })
}
// 查看当前学员所在团队成员成绩
export const getCurrentTeam = (data) => {
  return request({
    url: SCS + '/front/score/query/student/score/team/list ',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 查看团队成员的成绩详情
export const teamStudyDetail = (data) => {
  return request({
    url: SCS + '/front/score/query/student/score/info',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params: data
  })
}
