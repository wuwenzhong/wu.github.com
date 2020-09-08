import request from 'common/js/request'
import { CLS, RES } from './constants'
// 判断是否是组长
export const teamidandisleader = (data) => {
  return request({
    url: CLS + '/front/team/query/teamidandisleader',
    method: 'post',
    params: data
  })
}
// 修改团队名称
export const modifyTeamName = (data) => {
  return request({
    url: CLS + '/front/team/update/team',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 获取团队中的学员列表
export const teamList = (data) => {
  return request({
    url: CLS + '/front/team/query/team/user',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 保存团队资源关联表
export const saveTeamRes = (data) => {
  return request({
    url: CLS + '/front/team/save/team/res',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 团队空间资源列表
export const teamResList = (data) => {
  return request({
    url: CLS + '/front/team/query/team/res/list',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}

// 文件上传
export const wjUp = (data) => {
  return request({
    url: RES + '/pubRes/save',
    method: 'post',
    params: data
  })
}

// 删除团队空间资源关联表
export const deleteTeamRes = (data) => {
  return request({
    url: CLS + '/front/team/delete/team/res',
    method: 'post',
    params: data
  })
}

// 查看任务进入
export const queryprogress = (data) => {
  return request({
    url: CLS + '/front/classoutline/queryprogress',
    method: 'get',
    params: data
  })
}

// 下载文件
export const xzfilie = (data) => {
  return request({
    url: data,
    method: 'get',
    responseType: 'blob'
  })
}

//   下载文件
export const xzfilieNum = (data) => {
  return request({
    url: RES + '/pubRes/download',
    method: 'post',
    params: data
  })
}
//   预览文件
export const ylfilieNum = (data) => {
  return request({
    url: RES + '/pubRes/pre',
    method: 'post',
    params: data
  })
}

// 学生端组长获取申请加入团队的人员信息
export const queryTeamApply = (data) => {
  return request({
    url: CLS + '/front/team/query/team/apply',
    method: 'post',
    params: data
  })
}

// 学生未进入团队时进入学生端查询班级中的团队组长相关信息
export const queryClassTeamLeader = (data) => {
  return request({
    url: CLS + '/front/team/query/class/team/leader',
    method: 'post',
    params: data
  })
}

// 学生申请加入团队
export const studentRelteamapply = (data) => {
  return request({
    url: CLS + '/front/relteamapply/save/relteamapply',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}

// 组长同意申请
export const leaderAgree = (data) => {
  return request({
    url: CLS + '/front/relteamapply/agree/apply',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}

// 组长拒绝申请
export const leaderRefuse = (data) => {
  return request({
    url: CLS + '/front/relteamapply/refuse/apply',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}

// 判断用户是否需要建立长连接到服务器
export const longConnection = (data) => {
  return request({
    url: CLS + '/front/relteamapply/check/apply',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: data
  })
}
