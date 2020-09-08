<template>
<div class="customFeaturesBox clearfloat">
  <div class="customFeatures-title">
    <h5>{{barList[comName]["name"]}}</h5>
  </div>
  <div class='customFeatures clearfloat'>
    <div class="custom-bar clearfloat">
      <bar @barClick='barHandler' />
    </div>
    <div class="custom-main clearfloat">
      <div class="" :is='barList[comName]["component"]'></div>
      <!-- <router-view/> -->
    </div>
  </div>
</div>
</template>
<script>
// 加载公共样式
import './css/index.css'
// 接口文件
import * as API from '@/api/auth.js'
const path = require('path')
const files = require.context('./', false, /\.vue$/)
const modules = {}
const arr = ['addStep', 'caseStep', 'index', 'LinkDialog', 'sempost-post', 'sempost-sem']
files.keys().forEach(key => {
  const name = path.basename(key, '.vue')
  if (arr.indexOf(name) < 0) {
    modules[name] = files(key).default || files(key)
  }
})
export default {
  name: 'customFeatures',
  components: modules,
  data() {
    return {
      comName: 0,
      barList: [
        {
          name: '试卷管理',
          component: 'exam'
        },
        {
          name: '实操系统',
          component: 'sem'
        },
        {
          name: '实操系统及岗位设置',
          component: 'sempost'
        },
        {
          name: '任务类型维护',
          component: 'task'
        },
        {
          name: '能力项维护',
          component: 'ability'
        },
        {
          name: '教学资源设置',
          component: 'course'
        },
        {
          name: '企业信息维护',
          component: 'uphold'
        },
        {
          name: '账套管理',
          component: 'accountPublic'
        },
        {
          name: '编辑文档',
          component: 'editFile'
        },
        {
          name: '会计科目',
          component: 'accountSubject'
        },
        {
          name: '表单设置',
          component: 'formSet'
        },
        {
          name: '表单甄别',
          component: 'formScreen'
        }
      ]
    }
  },
  methods: {
    barHandler(i) {
      this.comName = i
    }
  },
  created() {
    const index = localStorage.getItem('customedIndex')
    this.comName = index == undefined ? '0' : index
  }
}
</script>

<style lang="scss">
.customFeaturesBox {
  background: #fff;
  padding: 20px 20px 0;
  height: 100%;
  .customFeatures-title {
    color: #414D65;
    font-size: 14px;
    h5 {
      margin: 0 0 20px;
      line-height: 26px;
    }
  }
  .customFeatures {
    box-sizing: border-box;
    display: flex;

    .custom-bar {
      float: left;
      width: 280px;
      box-sizing: border-box;
      padding-right: 17px;
      height: 680px;
      overflow-y: auto;
    }
    .custom-main {
      border: 1px solid #ebeef5;
      border-radius: 3px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      height: calc(100vh - 240px);
      overflow: auto;
      flex: 1;
      float: left;
      background: #fff;
      box-sizing: border-box;
      padding: 0 15px;
      position: relative;
    }
  }
  // 模块分页修改
  .pagination-container {
    padding: 16px 0;
  }

  .el-table{
    th {
      background:#E5EAF4;
    }
  }
}
</style>
