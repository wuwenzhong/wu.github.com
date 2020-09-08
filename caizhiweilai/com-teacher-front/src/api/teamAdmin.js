import request from 'common/js/request'
import { CLS, COS, RES } from './constants'
// 团队空间资源列表
export const teamResList = (data) => {
  return request({
    url: CLS + '/front/team/query/team/res/list',
    headers: { 'Content-Type': 'application/json' },
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
// 下载文件
export const xzfilie = (data) => {
  return request({
    url: data,
    method: 'get',
    responseType: 'blob'
  })
}
// 下载文件
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
// 团队列表
export const teamList = (data) => {
  return request({
    url: CLS + '/front/team/query/team/list',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 班级未分组成员
export const ungroupList = (data) => {
  return request({
    url: CLS + '/front/team/query/team/user/notinteam',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params: data
  })
}
// 手动创建团队
export const creatManually = (data) => {
  return request({
    url: CLS + '/front/team/save/team',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 自动生成团队
export const creatAuto = (data) => {
  return request({
    url: CLS + '/front/team/autogenerateteam',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 解散团队
export const dismissTeam = (data) => {
  return request({
    url: CLS + '/front/team/delete/team/byids',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 编辑团队名称
export const reviseTeamName = (data) => {
  return request({
    url: CLS + '/front/team/update/team',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 查看团队成员--带分页
export const getMember = (data) => {
  return request({
    url: CLS + '/front/team/query/team/user',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 移除组员
export const delMember = (data) => {
  return request({
    url: CLS + '/front/team/delete/team/user',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 任命组长
export const appointLeader = (data) => {
  return request({
    url: CLS + '/front/team/update/team/user/isleader',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 向团队添加成员
export const addMemberTeam = (data) => {
  return request({
    url: CLS + '/front/team/save/team/user',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 查看当前团队成员无分页
export const getTeamMember = (data) => {
  return request({
    url: CLS + '/front/team/query/team/user/inteam',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 教师端实训首页
export const teachAdminTrain = (data) => {
  return request({
    url: CLS + '/front/classcourse/querybyclassid' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
// 获取实训大纲列表
export const getOutlineList = (data) => {
  return request({
    url: CLS + '/front/classoutline/tea/querybyclassid' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
// 根据大纲列表id获取当前任务状态
export const getTaskState = (data) => {
  return request({
    url: CLS + '/front/classtask/tea/query/classoutlineid' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
// 解锁任务
export const unlockTask = (data) => {
  return request({
    url: CLS + '/front/classtask/unlocktask' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'post'
  })
}
// 开始考试
export const setBeginExam = (data) => {
  return request({
    url: CLS + '/front/exam/info/save',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 开放答案
export const openAnswer = (data) => {
  return request({
    url: CLS + '/front/exam/info/open',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 获取试卷信息
export const getPaperMessage = (data) => {
  return request({
    url: COS + '/front/paper/get',
    headers: { 'Content-type': 'application/json' },
    method: 'get',
    params: data
  })
}
// 查询任务详情（个人任务，团队任务，知识点，实操任务）
export const getTaskDetail = (data) => {
  return request({
    url: CLS + '/front/classtask/get' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
// 查看学生考试详情
export const lookExamDetail = (data) => {
  return request({
    url: COS + '/front/paper/query/detail',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 获取考试的学员列表
export const getExamStudy = (data) => {
  return request({
    url: CLS + '/front/exam/student/info/list',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 查询学员成绩结果
export const queryStudyResult = (data) => {
  return request({
    url: CLS + '/front/exam/student/query/exam/answer',
    headers: { 'Content-type': 'application/json' },
    method: 'get',
    params: data
  })
}
// 根据任务id查询回答任务的学员
export const taskStudy = (data) => {
	return request({
		url: CLS + '/front/usertaskrecord/querylistbytaskid' + data,
		headers: { 'Content-type': 'application/json' },
		method: 'get'
	})
}
// 根据学生的id查询当前学生提交的记录
export const queryCurrentStudy = (data) => {
  return request({
    url: CLS + '/front/taskanswer/querybyrecordid' + data,
    headers: { 'Content-type': 'application/json' },
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
// 查询要抽奖的学生
export const getLotteryStudy = (data) => {
  return request({
    url: CLS + '/front/carousel/showusers',
    headers: { 'Content-type': 'application/json' },
    method: 'get',
    params: data
  })
}
// 开始抽奖
export const beginLottery = (data) => {
  return request({
    url: CLS + '/front/carousel/carouseup',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 查看往期结果
export const lookOldResult = (data) => {
  return request({
    url: CLS + '/front/carousel/previousresults',
    headers: { 'Content-type': 'application/json' },
    method: 'get',
    params: data
  })
}
// 发送抽奖结果
export const sendLotteryResult = (data) => {
  return request({
    url: CLS + '/front/carousel/selectup',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 获取学生红旗榜数据
export const studentRanking = (data) => {
	return request({
		url: CLS + '/front/redflaglist/student/ranking' + data,
		headers: { 'Content-type': 'application/json' },
		method: 'get'
	})
}
// 获取团队红旗榜数据
export const teamRanking = (data) => {
	return request({
		url: CLS + '/front/redflaglist/team/ranking' + data,
		headers: { 'Content-type': 'application/json' },
		method: 'get'
	})
}
// 单独修改学生或者团队的分数
export const alonChangeScore = (data) => {
  return request({
    url: CLS + '/front/redflaglist/update/ranking',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 批量修改学生或者团队
export const batchChangeScore = (data) => {
  return request({
    url: CLS + '/front/redflaglist/update/list/ranking',
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    params: data
  })
}
// 实操任务根据实操的id查询当前实操的企业信息
export const getBusinessList = (data) => {
  return request({
    url: CLS + '/front/classenterprise/tea/list/byclasstaskid' + data,
    headers: { 'Content-type': 'application/json' },
    method: 'get'
  })
}
// 同步班级课程
export const lessonCourseSync = (params) => {
  return request({
    url: CLS + '/front/lesson/course/sync/class/course',
    method: 'post',
    params
  })
}
// 启用禁用企业
export const businessDisable = (data) => {
  return request({
    url: CLS + '/front/classenterprise/updatestatus',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    method: 'post',
    params: data
  })
}
// 查询教学管理个性化资源
export const getManResources = (params) => {
  return request({
    url: CLS + '/front/classtask/tea/list/personfile',
    method: 'get',
    params
  })
}
// 查询我的教案个性化资源
export const getTeaResources = (params) => {
  return request({
    url: CLS + '/front/lesson/task/query/perfile',
    method: 'get',
    params
  })
}
//   上传文件的资源保存
export const uploadFile = (data) => {
  return request({
    url: RES + '/pubRes/save',
    method: 'post',
    params: data
  })
}
//   新增列表
export const newResource = (data) => {
  return request({
    url: COS + '/front/rel/pub/res/save',
    method: 'post',
    params: data
  })
}
// 教师端课程资源列表
export const conditionteach = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/list/teacher/condition',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
// 教师端课程资源下发
export const sendUpdate = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update/send',
    method: 'post',
    params: data
  })
}
// 教师端课程资源收回
export const receiveUpdate = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update/receive',
    method: 'post',
    params: data
  })
}
// 课程资源预览（管理端，教师端，学生端公用）
export const preupdate = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/update/pre',
    method: 'post',
    params: data
  })
}
// 课程资源批量删除
export const delIds = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/del/ids',
    method: 'post',
    params: data
  })
}
// 课程资源新增
export const saveres = (data) => {
  return request({
    url: COS + '/front/ref/course/pub/res/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params: data
  })
}
// 教师端-教学管理：新增个性化资源
export const adddFile = (data) => {
  return request({
    url: CLS + '/front/classtask/tea/personfile/add',
    method: 'post',
    params: data
  })
}
// 教师端-我的教案：新增个性化资源
export const lessonTaskUpdateFile = (params) => {
  return request({
    url: CLS + '/front/lesson/task/update/perfile',
    method: 'post',
    params
  })
}
// 教师端-我的教案：替换个性化资源
export const lessonTaskReplaceFile = (params) => {
  return request({
    url: CLS + '/front/lesson/task/replace/perfile',
    method: 'post',
    params
  })
}
// 上传文件的资源保存
export const wjUp = (data) => {
  return request({
    url: RES + '/pubRes/save',
    method: 'post',
    params: data
  })
}
//   上传文件的资源修改
export const editwjUp = (data) => {
  return request({
    url: RES + '/pubRes/update',
    method: 'post',
    params: data
  })
}
// 教师端-教学管理：删除个性化资源
export const delpersonfile = (data) => {
  return request({
    url: CLS + '/front/classtask/tea/personfile/del',
    method: 'post',
    params: data
  })
}
// 教师端-我的教案：删除个性化资源
export const lessonTaskDelFile = (data) => {
  return request({
    url: CLS + '/front/lesson/task/del/perfile',
    method: 'post',
    params: data
  })
}
// 教学管理：启用/禁用个性化资源
export const teafile = (data) => {
  return request({
    url: CLS + '/front/classtask/tea/personfile/update',
    method: 'post',
    params: data
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
// 获取任务下的套账企业列表
export function getAccountBusiness(data) {
  return request({
    url: CLS + '/front/account/company/record/teacher/query/company' + data,
    method: 'get'
  })
}
// 修改开放那个企业模式
export function setBusinessModel(data) {
  return request({
    url: CLS + '/front/account/company/record/update/account/model',
    headers: {
      'Content-type': 'application/json'
    },
    method: 'post',
    params: data
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
// 根据账套任务获取账套数据
export function getAccountList(data) {
  return request({
    url: CLS + '/front/account/company/record/list/byclasstaskid' + data,
    method: 'get'
  })
}
