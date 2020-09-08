<template>
<div class="add-study-dialog">
  <div class="cont">
    <p class="title">添加抽奖对象<i class="iconfont" @click="closeAdd">&#xe60e;</i></p>
    <div class="add-list">
      <span>输入内容</span>
      <input type="text" placeholder="请输入内容" v-model="studyName">
    </div>
    <div class="btn-box">
      <button class="cancel" @click="closeAdd">取消</button>
      <button class="hold" @click="addStudy">确定</button>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'addStudy',
  data() {
    return {
      studyName: ''
    }
  },
  methods: {
    // 关闭添加弹窗
    closeAdd() {
      this.studyName = ''
      this.$emit('closeAdd')
    },
    // 添加
    addStudy() {
      const times = new Date().getTime()
      if (this.studyName == '') {
        this.$message({
          type: 'warning',
          message: '请输入学生姓名！'
        })
        return false
      }
      const addObj = {
        id: times,
        name: this.studyName,
        isCheck: true
      }
      this.$emit('addStudy', addObj)
    }
  }
}
</script>

<style scoped lang="scss">
.add-study-dialog {
    @include maskLayer($z:2001);
    .cont {
        width: 520px;
        height: 340px;
        background: #fff;
        border-radius: 4px;
        position: relative;
        .title {
            font-size: 18px;
            color: #444;
            line-height: 20px;
            position: relative;
            padding: 18px;
            border-bottom: 1px solid #F3F4F5;
            i {
                position: absolute;
                right: 0;
                top: 0;
                padding: 20px;
                cursor: pointer;
                color: #929292;
            }
        }
        .add-list {
            margin: 20px;
            display: flex;
            span {
                font-size: 14px;
                color: #666666;
                margin-right: 10px;
                line-height: 38px;
            }
            input {
                flex: 1;
                height: 36px;
                border-radius: 3px;
                border: 1px solid #DCDFE6;
                outline: none;
                padding-left: 14px;
                font-size: 12px;
            }
        }
        .btn-box {
            text-align: center;
            margin-top: 32px;
            position: absolute;
            bottom: 20px;
            right: 0;
            width: 100%;
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
</style>
