import Vue from 'vue'
import Router from 'vue-router'

// Layout
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
  }
*/

// 路由懒加载 命名驼峰
const redirect = () => import('@/pages/redirect/index') // 重定向
const error404 = () => import('@/pages/error/404') // 404
const error401 = () => import('@/pages/error/401') // 401
const home = () => import('@/pages/home/index') // 首页
const teacherManage = () => import('@/pages/teacherManage/index') // 教师管理页面
const buyCourses = () => import('@/pages/buyCourses/index') // 已购课程页面
const baseInfo = () => import('@/pages/baseInfo/index') // 基本信息页面
const studentManagement = () => import('@/pages/studentManage/index') // 学生管理
const filePreview = () => import('@/pages/previewFile/filePreview') // 学生管理

// 公共路由
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: redirect
    }]
  },
  {
    path: '/404',
    component: error404,
    hidden: true
  },
  {
    path: '/401',
    component: error401,
    hidden: true
  },
  {
    path: '/filePreview',
    component: filePreview,
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [{
      path: 'index',
      component: home,
      name: '首页',
      meta: {
        title: '首页',
        icon: 'iconsy',
        noCache: true,
        affix: true
      }
    }]
  },
  {
    path: '/teacherManage',
    component: Layout,
    children: [{
      path: 'index',
      name: 'TeacherManPage',
      component: teacherManage,
      meta: {
        title: '教师管理',
        icon: 'iconjsgl'
      }
    }]
  },
  {
    path: '/studentManagement',
    component: Layout,
    children: [{
      path: 'index',
      name: 'StudentManPage',
      component: studentManagement,
      meta: {
        title: '学生管理',
        icon: 'iconxueshengguanli'
      }
    }]
  },
  {
    path: '/buyCourses',
    component: Layout,
    children: [{
      path: 'index',
      name: 'BuyCoursesPage',
      component: buyCourses,
      meta: {
        title: '课程管理',
        icon: 'iconygkc'
      }
    }]
  },
  {
    path: '/baseInfo',
    component: Layout,
    children: [{
      path: 'index',
      name: 'BaseInfoPage',
      component: baseInfo,
      meta: {
        title: '基本信息',
        icon: 'iconjbxx'
      }
    }]
  }
]

export default new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'history', // 去掉url中的#
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})
