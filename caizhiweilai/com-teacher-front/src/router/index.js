import Vue from 'vue'
import Router from 'vue-router'
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
const classListHome = () => import('@/pages/classListIndex1') // 班级列表首页
const home = () => import('@/pages/home/index') // 后台首页
const xsgl = () => import('@/pages/xsgl/index') // 学生管理
const tdgl = () => import('@/pages/tdgl/index') // 团队管理
const jxgl = () => import('@/pages/jxgl/index') // 教学管理
const sxgk = () => import('@/pages/sxgk/index') // 实训管控
const qdgl = () => import('@/pages/sxgk/qdgl/index') // 签到管理
const cjgl = () => import('@/pages/cjgl/index') // 成绩管理
const summarize = () => import('@/pages/summarize/index') // 实训总结
const teachplan = () => import('@/pages/teachplan/index') // 我的教案
const TaskDetail = () => import('@/pages/jxgl/secondlevel/TaskDetail') // 查看个人考试的各种类型
const ResultDetail = () => import('@/pages/jxgl/secondlevel/ResultDetail') // 查看考试详情
const PaperDetail = () => import('@/pages/jxgl/secondlevel/PaperList') // 查看试卷详情
const TrainIframe = () => import('@/pages/toExercise') // 实训页面
const accountExercise = () => import('@/pages/accountExercise') // 实操任务进入南京云帐房
const filePreview = () => import('@/pages/previewFile/filePreview') // 预览文档
const applicatAdmin = () => import('@/pages/enterApplication/index') // RPA管理端

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
    path: '/TrainIframe',
    component: TrainIframe,
    hidden: true
  },
  {
    path: '/accountExercise', // 不需要连接websocket
    name: 'accountExercise',
    component: accountExercise
  },
  {
    path: '/applicatAdmin', // 不需要连接websocket
    component: applicatAdmin,
    hidden: true
  },
  {
    path: '*',
    redirect: '/classListHome',
    hidden: true
  },
  {
    path: '/classListHome',
    name: '班级列表首页',
    component: classListHome,
    hidden: true
  },
  {
    path: '/home',
    component: Layout,
    redirect: 'index',
    children: [{
      path: 'index',
      component: home,
      name: 'HomePage',
      meta: {
        title: '首页',
        icon: 'iconshouye',
        noCache: true,
        affix: true
      }
    }]
  },
  {
    path: '/xsgl',
    component: Layout,
    children: [{
      path: 'index',
      name: 'StudentManPage',
      component: xsgl,
      meta: {
        title: '学生管理',
        icon: 'iconxueshengguanli',
        noCache: true
      }
    }]
  },
  {
    path: '/tdgl',
    component: Layout,
    children: [{
      path: 'index',
      name: 'TeamManPage',
      component: tdgl,
      meta: {
        title: '团队管理',
        icon: 'icontuanduiguanli',
        noCache: true
      }
    }]
  },
  {
    path: '/jxgl',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TeachManPage',
        component: jxgl,
        meta: {
          title: '教学管理',
          icon: 'iconanlizhongxin',
          noCache: true
        }
      },
      {
        path: 'TaskDetail',
        name: 'TaskDetail',
        component: TaskDetail,
        meta: {
          title: '任务详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'PaperDetail',
        name: 'PaperDetailPage',
        component: PaperDetail,
        meta: {
          title: '试卷详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'ResultDetail',
        name: 'ResultDetailPage',
        component: ResultDetail,
        meta: {
          title: '考试详情',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/sxgk',
    component: Layout,
    children: [{
      path: 'index',
      name: 'TrainConPage',
      component: sxgk,
      meta: {
        title: '实训管控',
        icon: 'iconshixunguanli'
      }
    }, {
      path: 'qdgl',
      name: 'SignInManPage',
      component: qdgl,
      meta: {
        title: '签到管理',
        noCache: true
      },
      hidden: true
    }]
  },
  {
    path: '/cjgl',
    component: Layout,
    children: [{
      path: 'index',
      name: 'ScoreManPage',
      component: cjgl,
      meta: {
        title: '成绩管理',
        icon: 'iconchengjiguanli',
        noCache: true
      }
    }]
  },
  {
    path: '/summarize',
    component: Layout,
    children: [{
      path: 'index',
      name: 'SummarizePage',
      component: summarize,
      meta: {
        title: '实训总结',
        icon: 'iconzongjie'
      }
    }]
  },
  {
    path: '/teachplan',
    component: Layout,
    children: [{
      path: 'index',
      name: 'TeachplanPage',
      component: teachplan,
      meta: {
        title: '我的教案',
        icon: 'iconbeikejiaoan'
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
