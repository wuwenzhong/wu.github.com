import { constantRoutes } from '@/router'
import Layout from '@/layout/index'

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        const accessedRoutes = []
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
// function filterAsyncRouter(asyncRouterMap) {
//   // const _asyncRouterMap = handleRouterData(asyncRouterMap)
//   return asyncRouterMap.filter(route => {
//     const _route = JSON.parse(JSON.stringify(route))
//     for (var key in route) {
//       delete route[key]
//     }
//     route.name = (_route.url.charAt(0).toUpperCase() + _route.url.slice(1))
//     route.path = (_route.pid === '-1' ? '/' : '') + _route.url
//     route.hidden = !_route.status
//     // route.component = _route.componentPath
//     route.meta = {
//       title: _route.menuName,
//       icon: _route.icon
//     }
//     if (_route.menuType === 0) {
//       route.children = _route.child
//       route.alwaysShow = true
//     }
//     // if (_route.componentPath) {
//     if (_route.pid === '-1') {
//       route.component = Layout
//     } else {
//       route.component = loadView(_route.componentPath)
//     }
//     if (route.children != null && route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children)
//     }
//     return true
//   })
// }

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/pages/${view}`], resolve)
}

export default permission
