<template>
  <div class="edit-code-box">
    <div class="left">
      <p class="title">编辑代码：
        <button @click="runInput">提交运行</button>
        <button @click="runingPython">提取文件</button>
      </p>
      <div class="ace-container">
        <div class="ace-editor" ref="ace"></div>
      </div>
    </div>
    <div class="right">
      <p class="title">运行结果：</p>
      <div class="result-box" v-html="runResult"></div>
    </div>
    <div class="record-text">
      <p class="title">历史记录</p>
      <div class="record-list">
        <dl>
          <dd v-for="item in historyData" :key="item.id">
            <span>{{item.createTime}}</span>
            <div v-html="item.pythonStr"></div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { runCode, getHistoryData } from '@/api/trainingCenter'
import { formatDate } from '@/common/js/utils'
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-monokai' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-python' // 默认设置的语言模式
import 'ace-builds/src-noconflict/ext-language_tools' // 代码提示
import 'ace-builds/src-noconflict/mode-less' // 代码补全
// import 'ace-builds/src-noconflict/language_tools' // 代码补全

export default {
  name: 'index',
  data () {
    return {
      aceEditor: null,
      runResult: '', // 运行结果
      codeValue: '', // 编辑的代码
      historyData: [], // 编辑的历史代码
      grammarSet: '#coding=utf-8\n', // 运行语法环境
      themePath: 'ace/theme/monokai', // 不导入 webpack-resolver，该模块路径会报错
      modePath: 'ace/mode/javascript', // 同
      openSrc: '' // 点击提取文件时打开的地址
    }
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: 25, // 最大行数，超过会自动出现滚动条
      minLines: 25, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      readOnly: false,
      wrap: true,
      highlightActiveLine: true,
      value: this.codeValue
    })
    // 激活自动提示
    this.aceEditor.setOptions({
      enableSnippets: false,
      enableLiveAutocompletion: false,
      enableBasicAutocompletion: false
    })
    this.aceEditor.getSession().on('change', this.getInputCode)
    this.aceEditor.getSession().setUseWorker(false)
    // 获取历史记录
    this.getRecord()
  },
  methods: {
    // 提交运行
    runInput() {
      const _this = this
      if (this.codeValue == '') {
        this.$message.warning('请输入运行代码')
        return false
      }
      const postData = {
        classTaskId: this.$route.query.classTaskId,
        classId: localStorage.getItem('classId'),
        pythonStr: this.grammarSet + this.codeValue
      }
      runCode(postData).then(res => {
        if (res.code == 0) {
          _this.runResult = res.result.replace(/\n/gm, '<br/>')
        } else {
          _this.runResult = res.message
        }
        const _id = Math.random().toString(36).substr(2) // 生成一个随机字符串
        const tempJson = {
          id: _id,
          pythonStr: _this.codeValue,
          createTime: formatDate(new Date())
        }
        if (res.code != 101) { // 等于101时运行的代码是错误的不记录到历史记录中
          if (_this.historyData.length >= 5) {
            _this.historyData.pop()
          }
          _this.historyData.unshift(tempJson)
        }
      })
    },
    // 运行Python文件
    runingPython() {
      if (this.openSrc != '') {
        window.open(this.openSrc)
      } else {
        this.message.error('没有运行地址')
      }
    },
    // 获取运行的历史记录
    getRecord() {
      const _this = this
      const postData = {
        classTaskId: this.$route.query.classTaskId,
        classId: localStorage.getItem('classId')
      }
      getHistoryData(postData).then(res => {
        if (res.code == 0) {
          for (let i = 0, size = res.result.length; i < size; i++) {
            res.result[i].pythonStr = res.result[i].pythonStr.substring(res.result[i].pythonStr.indexOf('\n') + 1)
            res.result[i].pythonStr = res.result[i].pythonStr.replace(/\n/gm, '<br/>')
          }
          _this.historyData = res.result.list
          _this.openSrc = res.result.downloadUrl
        } else {
          _this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 时时存储编辑的内容
    getInputCode() {
      this.codeValue = this.aceEditor.getSession().getValue()
    }
  }
}
</script>

<style scoped lang="scss">
  .edit-code-box{
    margin:20px 0;
    display: flex;
    border-radius: 8px;
    border-bottom:1px solid #ECECEC;
    max-height: 468px;
    .title {
      line-height: 40px;
      position: relative;
      font-size: 14px;
      color: #fff;
      padding-left:20px;
      @include setLinearGradient(#73D766,#3DD471);
    }
    .left{
      flex: 1;
      border-radius: 0 0 0 8px ;
      .title{
        border-radius: 8px 0 0 0 ;
        clear: both;
        overflow: hidden;
        padding-right: 20px;
        button{
          border:0;
          height: 28px;
          width: 84px;
          font-size:14px;
          color:$color-theme;
          outline: none;
          border-radius: 20px;
          margin:6px 0 0 10px;
          float: right;
          cursor: pointer;
          background: #fff;
        }
      }
      .ace-container {
        position: relative;
        display: flex;
        .ace-editor{
          flex: 1;
          border-radius: 0 0 0 8px;
        }
      }
    }
    .right{
      border-left:1px solid #ECECEC;
      width: 30%;
      .title{
        border-left: 0;
        border-right: 0;
      }
      .result-box{
        height: 424px;
        padding:20px;
        font-size: 14px;
        line-height: 30px;
        word-break: break-all;
        overflow-y: auto;
      }
    }
    .record-text{
      border-left:1px solid #ECECEC;
      border-right:1px solid #ECECEC;
      border-bottom: 0;
      width: 240px;
      height: 100%;
      border-radius:0 8px 8px 0 ;
      word-break: break-all;
      overflow-y: auto;
      p{
        border-radius:0 8px 0 0 ;
        line-height: 40px;
        text-align: center;
        border-bottom:1px solid #ECECEC;
      }
      .record-list{
        height: 424px;
        overflow-y: auto;
        dl{
          height: 100%;
          dd{
            padding:10px;
            span{
              display: block;
              font-size: 12px;
              line-height:18px;
            }
            div{
              padding-left: 14px;
              line-height: 26px;
            }
          }
        }
      }
    }
  }
</style>
