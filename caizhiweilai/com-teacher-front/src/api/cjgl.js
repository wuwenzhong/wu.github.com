import request from 'common/js/request'
import { SCS, CLS } from './constants'

// 教师端个人成绩
export const studentScoreList = params => {
  return request({
    url: SCS + '/front/score/query/student/score/list',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 教师端个人成绩详情
export const studentScoreInfo = params => {
  return request({
    url: SCS + '/front/score/query/student/score/info',
    method: 'post',
    params
  })
}

// 导出学生成绩
export const exportStudentScore = params => {
  return request({
    url: SCS + '/front/score/export/score',
    method: 'post',
    params
  })
}

// 教师端团队成绩
export const teamScoreList = params => {
  return request({
    url: SCS + '/front/score/query/team/score/list',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 教师端团队成绩详情
export const teamtScoreInfo = params => {
  return request({
    url: SCS + '/front/score/query/team/score/info',
    method: 'post',
    params
  })
}

// 教师端评分
export const teacherScoreSave = params => {
  return request({
    url: CLS + '/front/teacher/score/save/score',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}
// 查看班级是否有账套
export const isHaveAccountTack = params => {
  return request({
    url: CLS + '/front/classtask/contains/accounttask',
    method: 'get',
    params
  })
}
// 查看个人成绩账套详情
export const viewAccountTackDetail = params => {
  return request({
    url: SCS + '/front/score/query/person/account/detail',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params
  })
}
// 查看团队成绩账套详情
export const viewTeamAccountTackDetail = params => {
  return request({
    url: SCS + '/front/score/query/team/account/detail',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params
  })
}
