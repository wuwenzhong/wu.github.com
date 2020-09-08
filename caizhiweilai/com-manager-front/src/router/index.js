import Vue from 'vue'
import Router from 'vue-router'

// Layout
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']     // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'                // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'              // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false             // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 路由懒加载 命名驼峰
const redirect = () => import('@/pages/redirect/index') // 重定向
const error404 = () => import('@/pages/error/404') // 404
const error401 = () => import('@/pages/error/401') // 401
const courseManagement = () => import('@/pages/courseManagement/index') // 课程管理
const outlineManagement = () => import('@/pages/courseManagement/outlineManagement/index') // 大纲管理
const customerManagement = () => import('@/pages/customerManagement/index') // 客户管理
const customerDetail = () => import('@/pages/customerManagement/customerDetail') // 客户管理详情
const customFeatures = () => import('@/pages/customFeatures/index') // 定制功能
const questionBank = () => import('@/pages/questionBank/index') // 题库
const resourceBase = () => import('@/pages/resourceBase/index') // 资源库
const previewFile = () => import('@/pages/previewFile/filePreview') // 预览编辑文档

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: redirect
      }
    ]
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
    component: previewFile,
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'courseManagement',
    children: [
      {
        path: 'courseManagement',
        component: courseManagement,
        name: 'courseManagement'
      },
      {
        path: 'outlineManagement',
        name: 'outlineManagement',
        component: outlineManagement
      },
      {
        path: 'customerManagement',
        name: 'customerManagement',
        component: customerManagement
      },
      {
        path: 'customerDetail',
        name: 'customerDetail',
        component: customerDetail
      },
      {
        path: 'customFeatures',
        name: 'customFeatures',
        component: customFeatures
      },
      {
        path: 'questionBank',
        name: 'questionBank',
        component: questionBank
      },
      {
        path: 'resourceBase',
        name: 'resourceBase',
        component: resourceBase
      }
    ]
  }
]

export default new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})