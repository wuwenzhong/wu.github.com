export const avatar = state => state.user.avatar
export const userName = state => state.user.userName
export const birthday = state => state.user.birthday
export const email = state => state.user.email
export const age = state => state.user.age
export const gender = state => state.user.gender
export const phone = state => state.user.phone
export const photo = state => state.user.photo
export const userCenterUrl = state => state.user.userCenterUrl
export const userId = state => state.user.userId
export const permissionRoutes = state => state.permission.routes
export const sidebar = state => state.app.sidebar
export const visitedViews = state => state.tagsView.visitedViews
export const cachedViews = state => state.tagsView.cachedViews
// 步骤还是修改标识
export const stepFlag = state => state.user.stepFlag
// 第几步
export const stepType = state => state.user.stepType
// 步骤id标识
export const stepIdFlag = state => state.user.stepIdFlag
// 企业ID
export const companyId = state => state.user.companyId
// 节点ID
export const nodeId = state => state.user.nodeId
// 节点ID 名称
export const nodeIdName = state => state.user.nodeIdName
// 岗位ID
export const posId = state => state.user.posId
// 岗位ID名称
export const posIdName = state => state.user.posIdName
// 描述
export const description = state => state.user.description
// 前置任务步骤ID
export const preStepIds = state => state.user.preStepIds
// 前置任务步骤ID
export const preStepIdsName = state => state.user.preStepIdsName
// 资源IDs
export const relRes = state => state.user.relRes
// 资源IDs名称
export const relResName = state => state.user.relResName
// 账期 年份
export const tallyYear = state => state.user.tallyYear
// 账期 月份
export const tallyMonth = state => state.user.tallyMonth
// 账期类型
export const tallyMonthType = state => state.user.tallyMonthType