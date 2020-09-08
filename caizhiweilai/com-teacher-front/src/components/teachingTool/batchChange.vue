<template>
<div class="study-dialog">
  <div class="cont">
    <p class="title">批量设置<i class="iconfont" @click="closeChoose">&#xe60e;</i></p>
    <div class="tab-cont">
      <div class="search-box">
        <input type="text" placeholder="请输入您要搜索的内容" v-model="searchText">
        <i class="iconfont">&#xe642;</i>
        <div class="input-change">
          <span :class="{active:currentFunction == 0}" @click="delOrAdd(0)">增加</span>
          <input type="text" placeholder="请输入分数" v-model="changeNum" oninput="value=value.replace(/[^\d]/g, '')">
          <span :class="{active:currentFunction == 1}" @click="delOrAdd(1)">减少</span>
        </div>
        <span class="static">已选择 <em>{{chooseNum}} 个</em></span>
      </div>
      <div class="list-cont" v-if="componentData.currentType == 0">
        <p v-for="item in componentData.data" :key="item.id" :title="item.userName  ">
          <i class="iconfont" v-html="item.isCheck ? '&#xe715;' : '&#xe714;'" @click="clickChoose(item,0)" :class="{active:item.isCheck}"></i>
          <span>{{item.userName}}</span>
        </p>
        <div v-if="componentData.data.length == 0" class="nodata-tips">暂无数据</div>
      </div>
      <div class="list-cont" v-if="componentData.currentType == 1">
        <p v-for="item in componentData.data" :key="item.id" :title="item.teamName">
          <i class="iconfont" v-html="item.isCheck ? '&#xe715;' : '&#xe714;'" @click="clickChoose(item,0)" :class="{active:item.isCheck}"></i>
          <span>{{item.teamName}}</span>
        </p>
        <div v-if="componentData.data == 0" class="nodata-tips">暂无数据</div>
      </div>
      <div class="check-all">
        <i class="iconfont" v-html="isCheckall ? '&#xe715;' : '&#xe714;'" :class="{active:isCheckall}" @click="checkAll"></i>全选
      </div>
      <div class="btn-box">
        <button class="cancel" @click="closeChoose">取消</button>
        <button class="hold" @click="holdChange">确定</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  batchChangeScore
} from '@/api/teamAdmin'
import {
  _debounce
} from '@/common/js/utils'
export default {
  name: 'batchChange',
  data() {
    return {
      isCheckall: false, // 是否全选反选
      searchText: '', // 模糊搜素关键词
      changeNum: '', // 改变的分数
      chooseNum: 0, // 已选择多少条
      currentFunction: 0, // 当前是增加还是减少0增加1时减少
      hasChoosedData: [], // 已经选择的数据
      oldDta: [] // 存储父组件传递过来的数据，后面用来从新赋值
    }
  },
  props: {
    componentData: {
      type: Object
    }
  },
  mounted() {
    this.handleCompontsData(this.componentData.data)
    this.oldDta = JSON.parse(JSON.stringify(this.componentData.data))
  },
  watch: {
    searchText(nice, old) {
      if (nice != '') {
        // 判断当前是按学生还是按团队
        let _text = ''
        if (this.oldDta.length > 0 && this.componentData.currentType == 0) {
          _text = 'userName'
        }
        if (this.oldDta.length > 0 && this.componentData.currentType == 1) {
          _text = 'teamName'
        }
        // 每次搜索从新复制个gridData
        this.componentData.data = JSON.parse(JSON.stringify(this.oldDta))
        this.componentData.data = this.componentData.data.filter(function (product) {
          return product[_text].search(nice.toLowerCase()) > -1
        })
      } else {
        this.componentData.data = JSON.parse(JSON.stringify(this.oldDta))
      }
      this.handleCompontsData(this.componentData.data)
    }
  },
  methods: {
    // 处理父组件传过来的数据
    handleCompontsData(_data) {
      const handleChooseData = this.hasChoosedData.map(item => {
        return item.id
      })
      for (let i = 0, len = _data.length; i < len; i++) {
        if (handleChooseData.includes(_data[i].id)) {
          _data[i].isCheck = true
        } else {
          _data[i].isCheck = false
        }
      }
      this.componentData.data = [..._data]
      if (this.chooseNum == this.componentData.data.length && this.componentData.data.length > 0) {
        this.isCheckall = true
      } else {
        this.isCheckall = false
      }
    },
    // 切换增加或者减少
    delOrAdd(num) {
      this.currentFunction = num
    },
    // 确定修改内容
    holdChange() {
      if (this.changeNum == '') {
        this.$message({
          type: 'warning',
          message: '请选择需要修改的分数'
        })
        return false
      }
      if (this.hasChoosedData.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要修改的学生或者团队'
        })
        return false
      }
      const postData = {}
      const tempPost = []
      for (let i = 0, len = this.hasChoosedData.length; i < len; i++) {
        const tempJson = {}
        tempJson.id = this.hasChoosedData[i].id
        if (this.currentFunction == 0) { // 增加
          tempJson.score = Number(this.hasChoosedData[i].score) + Number(this.changeNum)
        }
        if (this.currentFunction == 1) { // 减少
          const tempNum = Number(this.hasChoosedData[i].score) - Number(this.changeNum)
          tempJson.score = tempNum < 0 ? 0 : tempNum
        }
        tempPost.push(tempJson)
      }
      postData.updateRflDTOList = tempPost
      batchChangeScore(postData).then(res => {
        if (res.code == 0) {
          this.$emit('closeChange', '1')
          this.$message('修改成功')
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 全选反选
    checkAll() {
      const _currentDta = this.componentData.data
      if (this.isCheckall) {
        this.isCheckall = false
        for (let i = 0, size = _currentDta.length; i < size; i++) {
          _currentDta[i].isCheck = false
        }
        this.hasChoosedData = []
      } else {
        this.isCheckall = true
        for (let i = 0, size = _currentDta.length; i < size; i++) {
          _currentDta[i].isCheck = true
        }
        this.hasChoosedData = []
        this.hasChoosedData = _currentDta
      }
      this.chooseNum = this.hasChoosedData.length
      this.componentData.data = JSON.parse(JSON.stringify(_currentDta))
    },
    // 点击选择
    clickChoose(obj, _type) {
      let isOpen = false
      if (obj.isCheck) {
        isOpen = true
      }
      const currentData = this.componentData.data
      for (let i = 0, size = currentData.length; i < size; i++) {
        if (obj.id == currentData[i].id) {
          if (isOpen) {
            currentData[i].isCheck = false
            this.handleData(obj, 'del')
          } else {
            currentData[i].isCheck = true
            this.handleData(obj, 'add')
          }
        }
      }
    },
    // 处理已经选择的
    handleData(str, _type) {
      if (_type == 'del') {
        for (let i = 0, size = this.hasChoosedData.length; i < size; i++) {
          if (str.id == this.hasChoosedData[i].id) {
            this.hasChoosedData.splice(i, 1)
            this.isCheckall = false
            break
          }
        }
      }
      if (_type == 'add') {
        this.hasChoosedData.push(str)
      }
      this.chooseNum = this.hasChoosedData.length
      if (this.chooseNum == this.componentData.data.length) {
        this.isCheckall = true
      } else {
        this.isCheckall = false
      }
    },
    // 关闭选择学生弹窗
    closeChoose() {
      this.$emit('closeChange', '0')
    }
  }
}
</script>

<style scoped lang="scss">
.study-dialog {
    @include maskLayer($z:2000);
    .cont {
        background: #fff;
        width: 870px;
        border-radius: 4px;
        .title {
            font-size: 18px;
            color: #444;
            line-height: 20px;
            position: relative;
            padding: 14px;
            i {
                position: absolute;
                right: 0;
                top: 0;
                padding: 20px;
                cursor: pointer;
                color: #929292;
            }
        }
        .tab-cont {
            margin: 10px 40px 20px;
            .custom-opera {
                .add-btn {
                    width: 100px;
                    height: 32px;
                    display: inline-block;
                    line-height: 32px;
                    text-align: center;
                    font-size: 12px;
                    border-radius: 3px;
                    background: $color-theme;
                    color: #fff;
                    cursor: pointer;
                }
                .add-num {
                    display: inline-block;
                    line-height: 32px;
                    font-size: 14px;
                    margin-left: 12px;
                    em {
                        font-style: normal;
                        color: $color-theme;
                    }
                }
            }
            .search-box {
                height: 32px;
                text-align: right;
                position: relative;
                font-size: 12px;
                color: #666;
                @include setInput;
                input {
                    height: 100%;
                    box-sizing: border-box;
                    border: 1px solid #DCDFE6;
                    border-radius: 3px;
                    width: 170px;
                    padding: 0 26px 0 12px;
                    outline: none;
                }
                i {
                    position: absolute;
                    top: 0;
                    right: 8px;
                    cursor: pointer;
                    height: 100%;
                    line-height: 34px;
                    color: #DCDFE6;
                    font-size: 16px;
                }
                .static {
                    position: absolute;
                    left: 240px;
                    line-height: 32px;
                    font-size: 14px;
                    em {
                        font-style: normal;
                        color: $color-theme;
                    }
                }
                .input-change {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 220px;
                    height: 32px;
                    input {
                        width: 120px;
                        margin: 0 10px;
                        height: 32px;
                        line-height: 32px;
                        padding: 0 10px;
                    }
                    span {
                        cursor: pointer;
                        border: 1px solid #dedede;
                        display: inline-block;
                        width: 40px;
                        height: 32px;
                        border-radius: 3px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 12px;
                        &.active {
                            background: $color-theme;
                            color: #fff;
                            border-color: $color-theme;
                        }
                    }
                }
            }
            .list-cont {
                border: 1px solid #EDEDED;
                margin-top: 20px;
                display: flex;
                flex-wrap: wrap;
                max-height: 400px;
                overflow-y: auto;
                .nodata-tips {
                    line-height: 60px;
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                    width: 100%;
                }
                p {
                    width: 20%;
                    display: flex;
                    line-height: 40px;
                    font-size: 13px;
                    &.active {
                        background: #F8F8F8;
                    }
                    i {
                        margin: 0 20px 0 24px;
                        color: #999;
                        font-size: 14px;
                        cursor: pointer;
                        &.active {
                            color: $color-theme;
                        }
                    }
                    span {
                        flex: 1;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        padding-right: 12px;
                        color: #333333;
                    }
                    em {
                        font-style: normal;
                        color: #999999;
                        font-size: 14px;
                        margin-right: 6px;
                        cursor: pointer;
                    }
                }
            }
            .check-all {
                display: inline-block;
                font-size: 14px;
                color: #666;
                line-height: 32px;
                cursor: pointer;
                i {
                    font-size: 14px;
                    color: #666;
                    margin-right: 6px;
                    &.active {
                        color: $color-theme;
                    }
                }
            }
            .btn-box {
                text-align: center;
                margin-top: 22px;
                &.no-top {
                    margin-top: 0;
                }
                button {
                    width: 120px;
                    height: 36px;
                    border: 1px solid #E8E9ED;
                    border-radius: 3px;
                    font-size: 14px;
                    color: #8993AB;
                    text-align: center;
                    outline: none;
                    background: #fff;
                    cursor: pointer;
                    &.cancel {
                        margin-right: 10px;
                        &:hover {
                            background: #f3f3f3;
                        }
                    }
                    &.hold {
                        background: $color-theme;
                        border: 1px solid $color-theme;
                        color: #fff;
                        &:hover {
                            background: $color-theme-hover;
                            border: 1px solid $color-theme-hover;
                        }
                    }
                }
            }
        }
    }
}
</style>
