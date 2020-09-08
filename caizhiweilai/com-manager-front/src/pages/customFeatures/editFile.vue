<template>
  <div class="edit-file-box">
    <div class="switch-box">
      <div class="search-box" v-if="currentModle!=0">
        按课程筛选：
        <el-select v-model="currentClass" size='small' @change='changeClass' v-if="showEditFile">
          <el-option v-for="item in classList" :label="item.courseName" :key='item.id' :value="item.id"
                     placeholder="请选择课程"></el-option>
        </el-select>
        <el-select v-else v-model="currentClass">
          <el-option value="暂无数据"></el-option>
        </el-select>
      </div>
      <div v-if="showEditFile">
        <button class="switch-port"
                v-for="(item,i) in switchList"
                :class="{active:i==currentModle}"
                :key="i"
                @click="switchShow(i)"
        >{{item}}
        </button>
      </div>
    </div>
    <div class="content-area" v-if="showEditFile">
      <dl class="title-list-box" v-if="fileTitleList.length">
        <dt>目录</dt>
        <dd v-for="(item,index) in fileTitleList" :key="index" :class="'leavel'+item.leavel" :data-id="item.anchorId"
            @click="anchor(item.jumpId)" v-html="item.text"></dd>
      </dl>
      <dl class="title-list-box" v-else>
        <dt>目录</dt>
      </dl>
      <div class="edit-parent">
        <div class="hold-btn">
          <button @click="holdEditFile(currentModle+1, currentClassId)">保存</button>
          <button @click="previewFile">预览</button>
        </div>
        <quill-editor
          class="rich-text"
          v-model="editContent"
          ref="quillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
          @ready="onEditorReady($event)"
        ></quill-editor>
      </div>
      <!-- 图片上传组件辅助 -->
      <el-upload
        class="avatar-uploader quill-img"
        name="file"
        :headers="headers"
        :show-file-list="false"
        :on-error="uploadError"
        :http-request="quillImgBefore"
        accept=".jpg, .jpeg, .png, .gif"
        action="#"
      ></el-upload>
    </div>
    <div v-else style='height: 88%;align-items: center;justify-items: center;display: flex;'>
      <img src="@/common/images/noDataPic.png" alt="" style="display: block;margin: 0 auto;">
    </div>
  </div>
</template>

<script>
import { addQuillTitle } from '@/common/js/utils'
import { allCourse } from './../../api/resource'
import { putObj, saveEditFile, getFile } from '@/api/user'

import { quillEditor, Quill } from 'vue-quill-editor'
// import ImageResize from 'quill-image-resize-module'
// Quill.register('modules/imageResize', ImageResize)
// quill编辑器的字体
const fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif']
const Font = Quill.import('formats/font')
Font.whitelist = fonts // 将字体加入到白名单
Quill.register(Font, true)
const fontSizeStyle = Quill.import('attributors/style/size')
fontSizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '36px', '38px', '40px', '45px', '50px', false]
Quill.register(fontSizeStyle, true)
// 重写标题标签随机生成id用来做锚点
const _Header = Quill.import('formats/header') // 导出标题模块的formats方法
class MyHeader extends _Header { // 继承父类,处理h标签换行报错问题
  static create(value) {
    const node = super.create(value) // 调用父类的方法生成node节点
    const randomStr = 'a' + Math.random().toString(36).substr(2) // 随机生成一个32进制的字符串
    // 设置自定义属性
    node.setAttribute('class', randomStr)
    node.setAttribute('id', randomStr)
    return node
  }
}

Quill.register(MyHeader, true)
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ size: fontSizeStyle.whitelist }], // 字体大小
  [{ header: [1, 2, 3, 4, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ align: [] }], // 对齐方式
  [{ font: fonts }], // 把上面定义的字体数组放进来
  ['clean'], // 清除文本格式
  ['link', 'image'] // 链接、图片、视频
]

export default {
  name: 'editFile',
  data() {
    return {
      fileTitleList: [], // 文档标题列表
      storageFileData: '', // 存储文档数据用来做离开判断
      switchList: ['教务端', '教师端', '学生端'], // 功能按钮
      currentModle: 0, // 当前编辑的是那个端
      lableData: { h1: '1', h2: '2', h3: '3', h4: '4' }, // 所有的标题标签
      classList: [], // 课程数据
      currentClass: '', // 当前课程
      currentClassId: '', // 当前课程的id
      showEditFile: 0, // 是否显示编辑文档
      editContent: '', // 编辑的内容
      disableEnter: false, // 禁止换行
      quill: null, // 富文本编辑对象
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '请输入内容',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // 劫持图片上传，自定义图片上传
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.quill-img input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    // 加载课程
    this.courseSelect()
    // document.onkeydown = function(e) {
    //   debugger
    //   const el = e || event || window.event
    //   if (el && el.keyCode == 37) {
    //     console.log(e.clipboardData)
    //   }
    // }
  },
  methods: {
    // 锚点跳转
    anchor(str) {
      document.querySelector('#' + str).scrollIntoView({ block: 'start', behavior: 'smooth' })
    },
    // 课程列表
    courseSelect() {
      const _this = this
      allCourse().then(res => {
        if (res.code == '0') {
          if (res.result.length) {
            _this.classList = res.result
            _this.currentClass = _this.classList.length ? _this.classList[0].courseName : ''
            _this.showEditFile = _this.classList.length ? 1 : 0
            _this.currentClassId = _this.classList.length ? _this.classList[0].id : ''
            _this.getFileData()
          } else {
            _this.classList = []
          }
        } else {
          _this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 改变课程
    changeClass(vals) {
      const _this = this
      if (this.currentModle != 0) {
        if (this.storageFileData != this.editContent) {
          this.$confirm('编辑的内容尚未保存，离开前是否要保存？', '提示', {
            closeOnClickModal: false,
            cancelButtonClass: 'btn-custom-cancel',
            confirmButtonClass: 'el-button--info',
            type: 'warning'
          }).then(() => {
            _this.holdEditFile(_this.currentModle + 1, _this.currentClassId)
            _this.currentClassId = vals
            this.getFileData()
          }).catch(() => {
            _this.currentClassId = vals
            this.getFileData()
          })
        } else {
          _this.currentClassId = vals
          this.getFileData()
        }
      }
    },
    // 切换编辑模块
    switchShow(num) {
      const _this = this
      if (this.storageFileData != this.editContent) {
        this.$confirm('编辑的内容尚未保存，离开前是否要保存？', '提示', {
          closeOnClickModal: false,
          cancelButtonClass: 'btn-custom-cancel',
          confirmButtonClass: 'el-button--info',
          type: 'warning'
        }).then(() => {
          _this.holdEditFile(_this.currentModle + 1, _this.currentClassId)
          _this.currentModle = num
          _this.getFileData()
        }).catch(() => {
          _this.currentModle = num
          _this.getFileData()
        })
      } else {
        _this.currentModle = num
        _this.getFileData()
      }
    },
    // 保存编辑的文档
    holdEditFile(_type, _id) {
      const _this = this
      const postData = {
        type: _type,
        navigation: JSON.stringify(this.fileTitleList),
        content: this.editContent,
        courseId: _id
      }
      if (this.currentModle == 0) {
        postData.courseId = 0
      }
      saveEditFile(postData).then(res => {
        if (res.code == 0) {
          _this.$message.success('保存成功')
          _this.storageFileData = _this.editContent
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 获取当前模块的文档数据
    getFileData() {
      const _this = this
      let typeNum = ''
      if (this.currentClassId == '') {
        return false
      }
      if (this.currentModle == 0) {
        typeNum = '?type=' + Number(this.currentModle + 1) + '&courseId=0'
      } else {
        typeNum = '?type=' + Number(this.currentModle + 1) + '&courseId=' + this.currentClassId
      }
      getFile(typeNum).then(res => {
        if (res.code == 0) {
          _this.fileTitleList = JSON.parse(res.result.navigation)
          _this.editContent = res.result.content ? res.result.content : ''
          _this.storageFileData = res.result.content ? res.result.content : ''
          // 加载以后获取富文本编辑的功能栏的高度
          _this.$nextTick(function() {
            const toolBarHeigth = _this.$refs.quillEditor.$el.children[0].clientHeight + 2 // 2是边框
            const editArea = _this.$refs.quillEditor.$el.children[1]
            editArea.style.height = _this.$refs.quillEditor.$el.clientHeight - toolBarHeigth + 'px'
            editArea.style.top = toolBarHeigth + 'px'
            // 加载富文本插件的修改工具栏提示
            addQuillTitle()
            _this.storageFileData = _this.editContent
          })
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    // 预览编辑文档
    previewFile() {
      if (this.fileTitleList.length == 0) {
        this.$message.error('暂无预览内容')
        return false
      }
      let fileData = {
        list: this.fileTitleList,
        content: this.editContent
      }
      fileData = JSON.stringify(fileData)
      localStorage.setItem('fileData', fileData)
      window.open('/filePreview', '_blank')
    },
    // 失去焦点事件
    onEditorBlur(e) {
    },
    // 获得焦点事件
    onEditorFocus(e) {
      const currentLable = e.editor.scroll.children.head.domNode.localName // 当前焦点所在行的标签
      if (this.lableData[currentLable]) {
        this.disableEnter = true
      } else {
        this.disableEnter = false
      }
    },
    // 内容改变事件
    onEditorChange(e) {
      const _this = this
      // 获取当前编辑的内容
      const _html = e.html
      // 创建虚拟dom
      const domEl = document.createElement('html')
      domEl.innerHTML = _html
      // 获取虚拟dom中所有的标签
      const allLable = domEl.children[1].childNodes
      _this.fileTitleList = []
      allLable.forEach((item, index) => {
        const tempJson = {}
        if (_this.lableData[item.localName]) {
          const _nextClass = item.nextSibling ? item.nextSibling.className : '' // 当前元素的下一个元素
          const classLength = _nextClass.length // class名字的长度
          const frontStr = _html.substring(0, _html.indexOf(_nextClass)) // 类名前段的内容
          const lastStr = _html.substring(classLength + _html.indexOf(_nextClass)) // 类名后段的内容
          let currentClass = item.className
          const currentId = item.id
          if (currentClass == _nextClass) {
            currentClass = 'L' + currentClass
            _this.editContent = frontStr + currentClass + lastStr
          }
          if (item.innerText != '') {
            tempJson.leavel = _this.lableData[item.localName]
            tempJson.text = item.innerText
            tempJson.anchorId = currentClass
            tempJson.jumpId = currentId
            _this.fileTitleList.push(tempJson)
          }
        }
      })
    },
    // 富文本加载完
    onEditorReady(e) {
    },
    // 上传前验证
    async quillImgBefore(e) {
      const quill = this.$refs.quillEditor.quill
      const res = await this.cos(e)
      const length = quill.getSelection().index
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(length, 'image', res)
      // 调整光标到最后
      quill.setSelection(length + 1)
      const self = this
    },
    // 富文本图片上传失败
    uploadError() {
      this.$message.error('图片插入失败')
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-file-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    .switch-box {
      background: #fff;
      margin-bottom: 10px;
      border-radius: 3px;
      padding-left: 20px;

      .search-box {
        font-size: 14px;
        color: #333;
        margin-top: 10px;

        input {
          height: 30px;
        }
      }

      button {
        border: 0;
        outline: none;
        cursor: pointer;
        line-height: 28px;
        padding: 0 12px;
        margin: 10px 20px 0 0;
        background: #414d65;
        border: 1px solid #414d65;
        border-radius: 3px;
        color: #fff;

        &:hover {
          background: #2f497d;
          border: 1px solid #2f497d;
          color: #fff;
        }

        &.switch-port {
          border: 1px solid #ededed;
          color: #333333;
          background: #fff;

          &:hover {
            background: #414d65;
            border: 1px solid #414d65;
            color: #fff;
          }

          &.active {
            background: #414d65;
            color: #fff;
            border: 1px solid #414d65;
          }
        }
      }
    }

    .content-area {
      background: #fff;
      display: flex;
      height: calc(100% - 92px);
      overflow: hidden;

      .title-list-box {
        width: 280px;
        border: 1px solid rgba(204, 204, 204, 0.4);
        margin: 0 0 0 0;
        height: 100%;
        overflow-y: auto;

        dt {
          font-size: 20px;
          color: #000;
          text-align: center;
          line-height: 40px;
          font-weight: bold;
          border-bottom: 1px solid rgba(204, 204, 204, 0.4);
        }

        dd {
          font-size: 14px;
          color: #333;
          padding: 0 14px;
          line-height: 30px;
          margin: 0 0 0 0;
          font-size: 12px;
          color: #4c4c4c;
          cursor: pointer;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          &.leavel1 {
            color: #191919;
            font-weight: bold;
            font-size: 14px;
          }

          &.leavel2 {
            text-indent: 10px;
          }

          &.leavel3 {
            text-indent: 16px;
          }

          &.leavel4 {
            text-indent: 22px;
          }

          &:hover {
            background: rgba(0, 0, 0, .07);
          }
        }
      }

      .edit-parent {
        position: relative;
        width: 100%;

        .hold-btn {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;

          button {
            border: 0;
            outline: none;
            cursor: pointer;
            line-height: 26px;
            padding: 0 10px;
            margin: 8px 10px 0 0;
            background: #414d65;
            border: 0;
            border-radius: 3px;
            color: #fff;
          }
        }

        .rich-text {
          flex: 1;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          padding-right: 0;

          .ql-container {
            padding-right: 20px;
          }
        }
      }
    }
  }
</style>
