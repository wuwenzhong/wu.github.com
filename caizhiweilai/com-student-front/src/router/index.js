import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Layout
// import Layout from '@/layout'
const Layout = () => import('@/layout/index')
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
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 路由懒加载 命名驼峰
const error404 = () => import('@/pages/error/404') // 404
const error401 = () => import('@/pages/error/401') // 401
const home = () => import('@/pages/home/index') // 首页
const training = () => import('@/pages/training/index') // 实训页面
const exam = () => import('@/pages/training/exam/exam') // 考试页面
const analysis = () => import('@/pages/training/exam/result') // 考试结果页面
const entrance = () => import('@/pages/training/exam/enter') // 进入考试页面
const team = () => import('@/pages/team/index') // 团队页面
const result = () => import('@/pages/result/index') // 成绩页面
const summarize = () => import('@/pages/summarize/index') // 实训总结
const trainLevel = () => import('@/pages/training/SecondLevel/taskShow') // 实操个人，团队，知识点等进去二级页面
const toExercise = () => import('@/pages/toExercise') // 实操任务进入南京云帐房
const accountExercise = () => import('@/pages/accountExercise') // 实操任务进入南京云帐房
const previewFile = () => import('@/pages/previewFile/filePreview') // 预览编辑文档
const applicatAdmin = () => import('@/pages/enterApplication/index') // RPA管理端进入南京云帐房
const user = () => import('@/layout/components/ClassList')

// 公共路由
export const constantRoutes = [
  {
    path: '/index',
    component: user,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: '/index',
        name: 'index',
        meta: { title: 'index' }
      },
      {
        path: '/home',
        component: home,
        name: 'home',
        meta: { title: 'home' }
      },
      {
        path: '/training',
        component: training,
        name: 'training',
        meta: { title: 'training' }
      },
      {
        path: '/trainLevel',
        component: trainLevel,
        name: 'trainLevel',
        meta: { title: 'trainLevel' }
      },
      {
        path: '/training/exam',
        component: exam,
        name: 'exam',
        meta: { title: 'exam' }
      },
      {
        path: '/training/analysis',
        component: analysis,
        name: 'analysis',
        meta: { title: 'analysis' }
      },
      {
        path: '/team',
        component: team,
        name: 'team',
        meta: { title: 'team' }
      },
      {
        path: '/entrance',
        component: entrance,
        hidden: true
      },
      {
        path: '/result',
        component: result,
        name: 'result',
        meta: { title: 'result' }
      },
      {
        path: '/summarize',
        component: summarize,
        name: 'summarize',
        meta: { title: 'summarize' }
      },
      {
        path: '/toExercise',
        name: 'toExercise',
        component: toExercise
      },
      {
        path: '/accountExercise', // 不需要连接socket
        name: 'accountExercise',
        component: accountExercise
      },
      {
        path: '/applicatAdmin', // 不需要连接socket
        component: applicatAdmin,
        hidden: true
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
  }
]
export default new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
