import request from 'common/js/request'
import { CLS } from './constants'

// 查询教案列表 /front/lesson/course/query/lc/list
// over
export const lessonCourseList = (params) => {
  return request({
    url: CLS + '/front/lesson/course/query/lc/list',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 个性教案复制 /front/lesson/course/copy
// over
export const lessonCourseCopy = (params) => {
  return request({
    url: CLS + '/front/lesson/course/copy',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 选择班级课程 /front/lesson/course/save/class/course
export const lessonCourseSave = (params) => {
  return request({
    url: CLS + '/front/lesson/course/save/class/course',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 获取随机的教案编码 /front/lesson/course/query/random/code
// over
export const lessonCourseRandom = (params) => {
  return request({
    url: CLS + '/front/lesson/course/query/random/code',
    headers: { 'Content-Type': 'application/json' },
    method: 'get',
    params
  })
}

// 同步管理端课程 /front/lesson/course/sync/mana/course
// over
export const lessonCourseMana = (params) => {
  return request({
    url: CLS + '/front/lesson/course/sync/mana/course',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 同步班级课程 /front/lesson/course/sync/class/course
export const lessonCourseClass = (params) => {
  return request({
    url: CLS + '/front/lesson/course/sync/class/course',
    method: 'post',
    params
  })
}

// 修改是否删除的状态 /front/lesson/outline/update/del/status
// over
export const lessonOutlineStatus = (params) => {
  return request({
    url: CLS + '/front/lesson/outline/update/del/status',
    method: 'post',
    params
  })
}

// 修改大纲顺序 /front/lesson/outline/sort
// over
export const lessonOutlineSort = (params) => {
  return request({
    url: CLS + '/front/lesson/outline/sort',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 新增和修改任务大纲 /front/lesson/outline/update/outline
// over
export const lessonOutlineUpdate = (params) => {
  return request({
    url: CLS + '/front/lesson/outline/update/outline',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 根据教案课程id查询大纲列表 /front/lesson/outline/query/list/bylcid
// over
export const lessonOutlineList = (params) => {
  return request({
    url: CLS + '/front/lesson/outline/query/list/bylcid',
    method: 'get',
    params
  })
}

// 根据id修改是否删除的状态 /front/lesson/task/update/del/status
// over
export const lessonTaskStatus = (params) => {
  return request({
    url: CLS + '/front/lesson/task/update/del/status',
    method: 'post',
    params
  })
}

// 修改任务顺序 /front/lesson/task/sort
// over
export const lessonTaskSort = (params) => {
  return request({
    url: CLS + '/front/lesson/task/sort',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 新增/修改教案任务 /front/lesson/task/update/task
// over
export const lessonTaskUpdate = (params) => {
  return request({
    url: CLS + '/front/lesson/task/update/task',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params
  })
}

// 根据大纲id查询教案任务列表 /front/lesson/task/query/list/byloid
// over
export const lessonTaskList = (params) => {
  return request({
    url: CLS + '/front/lesson/task/query/list/byloid',
    method: 'get',
    params
  })
}

// 根据教案任务id查询教案任务详情 /front/lesson/task/query/byid
// over
export const lessonTaskDetail = (params) => {
  return request({
    url: CLS + '/front/lesson/task/query/byid',
    method: 'get',
    params
  })
}

// 校验教案密码 /front/lesson/course/check/lesson/pwd
export const lessonCheckPwd = (params) => {
  return request({
    url: CLS + '/front/lesson/course/check/lesson/pwd',
    method: 'post',
    params
  })
}
