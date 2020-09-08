import Vue from 'vue'
import Router from 'vue-router'

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
// const usercenter = () => import('@/pages/userCenter/homePage/index') // 用户中心
const applicationCenter = () => import('@/pages/userCenter/applicationCenter/index') // 应用超市
const personMaterial = () => import('@/pages/userCenter/personMaterial/index') // 个人资料

// 公共路由
export const constantRoutes = [
  {
    path: '*',
    redirect: '/applicationCenter',
    hidden: true
  },
  {
    path: '/applicationCenter',
    name: 'ApplicationCenter',
    component: applicationCenter
  },
  {
    path: '/personMaterial',
    name: 'PersonMaterial',
    component: personMaterial
  }
]

export default new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})