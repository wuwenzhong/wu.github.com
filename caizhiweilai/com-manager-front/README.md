# com-teacher-front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build

npm run build:prod
```

### config.js 加入不提交队列
```
git update-index --assume-unchanged src/api/config.js
```

### config.js 取消不提交队列
```
git update-index --no-assume-unchanged src/api/config.js
```

### 目录结构描述
```
├── dist                                        // 打包项目文件，服务器访问
├── node_modules                                // 项目依赖包
├── config                                      // 基本配置
│   ├── model                                   // 环境切换配置
│   │   ├── template.xlsx                       // 前端模板文件
│   ├── favicon.ico                             // 图标
│   ├── index.html                              // 入口html文件
├── src                                         // 源码目录
│   ├── api                                     // 接口集合
│   │   ├── config.js                           // 本地开发配置登录
│   │   ├── constants.js                        // 接口微服务名配置
│   ├── common                                  // 静态资源
│   │   │   ├── element-rewrite.scss            // 用于覆盖element-ui默认样式
│   │   │   ├── public.css                      // 通用css样式布局处理
│   │   ├── fonts                               // icon图标管理
│   │   ├── images                              // 图片资源
│   │   ├── js                                  // 公用js封装
│   │   │   ├── cos.js                          // 资源上传腾讯云
│   │   │   ├── request.js                      // Axios封装
│   │   │   ├── setMessage.js                   // message重复出现处理
│   │   │   ├── utils.js                        // 自定义函数封装
│   ├── components                              // 公共组件
│   │   ├── breadcrumb                          // 面包屑组件
│   │   ├── hamburger                           // 菜单栏展开收缩
│   │   ├── pagination                          // 分页组件
│   ├── layout                                  // 公共组件
│   │   ├── components                          // 组件
│   │   │   ├── app-main                        // 主页内容
│   │   │   ├── navbar                          // 标题 路由定位
│   │   │   ├── sidebar                         // 主页菜单栏
│   │   │   ├── tags-view                       // 头部快捷入口
│   │   ├── index                               // 引入组件，包含路由
│   ├── pages                                   // vue页面
│   ├── router                                  // 路由
│   │   ├── router.js                           // 路由配置
│   ├── store                                   // vuex的状态管理
│   │   ├── modules                             // store模块
│   │   ├── action.js                           // 配置actions
│   │   ├── getters.js                          // 配置getters
│   │   ├── index.js                            // 引用vuex，创建store
│   │   ├── mutation-types.js                   // 定义常量muations名
│   │   ├── mutations.js                        // 配置mutations
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
│   ├── permission.js                           // 配置文件，路由拦截
├── .env.development                            // 开发环境配置
├── .env.production                             // 生产环境配置
├── vue.config.js                               // webpack配置文件

```