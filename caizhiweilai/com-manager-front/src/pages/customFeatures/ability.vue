<template>
<div class="abilityBox clearfloat">
  <!-- 一级能力项 -->
  <div class="ability fl">
    <h6>一级能力项</h6>
    <div class="add-ability">
      <span class='btn'
            @click.stop='addAbility(1)'>添加</span>
    </div>
    <ul class='ability-list'>
      <li v-for='(item,index) of onePart'
          :key='index'
          :class="item.id==choseOnePart?'on':''"
          @click.stop='abilityHandler(item.id,1,index)'>
        <input type="text"
               name=""
               v-model.trim="item.capabilityName"
               @blur='savePartOne(index,1)'
               v-if='item.input'
               placeholder='请输入一级能力项'>
        <div v-if='item.edit'>
          <span class="list-text fl"
                :title="item.capabilityName">{{item.capabilityName}}</span>
          <i class='iconfont fr'
             @click.stop='deleteOne(item.id,index)'>&#xe667;</i>
          <i class='iconfont fr'
             @click.stop='editOne(item.id,index,0)'>&#xe677;</i>
        </div>
      </li>
    </ul>
  </div>
  <div class="ability fl">
    <h6>二级能力项</h6>
    <div class="add-ability">
      <span class='btn'
            @click.stop='addAbility(2)'>添加</span>
    </div>
    <ul class='ability-list'
        v-show='twoPart.length'>
      <li v-for='(item,index) of twoPart'
          :key='index'>
        <input type="text"
               name=""
               v-model.trim="item.capabilityName"
               v-if='item.input'
               @blur='savePartOne(index,2)'>
        <div v-if='item.edit'>
          <span class="list-text fl"
                :title="item.capabilityName">{{item.capabilityName}}</span>
          <i class='iconfont fr'
             @click.stop='deleteOne(item.id,index)'>&#xe667;</i>
          <i class='iconfont fr'
             @click.stop='editOne(item.id,index,1)'>&#xe677;</i>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
// 接口文件
import {
  addAbility,
  editAbility,
  deleteAbility,
  listAbility
} from '@/api/auth.js'
import './css/index.css'

export default {
  name: 'ability',
  data() {
    return {
      onePart: [],
      twoPart: [],
      taskType: 0, // 新增-0 编辑 -1,
      // 选中一级id
      choseOnePart: '',
      // 添加一二级能力项
      addPart: {
        one: false,
        two: false
      },
      activeIndex: 0,
      // 一二级能力项值
      partVal: {
        one: '',
        two: ''
      },
      partIndex: 0,
      saveAbility: {
        one: []
      }
    }
  },
  methods: {
    abilityHandler(row, num, index) {
      this.partIndex = index
      if (row == undefined) {
        return false
      }
      if (num == 1) {
        if (this.onePart[0].id == undefined) {
          this.onePart.splice(0, 1)
        }
        this.choseOnePart = row
        this.onePartHandler(row)
        this.activeIndex = num
      }
    },
    // 获取用户信息
    getUser(obj) {
      const user = JSON.parse(localStorage.getItem('userMsg'))
      const keys = user[obj]
      return keys
    },
    // 删除一级能力项
    deleteOne(id, index) {
      const that = this
      if (this.onePart[0].capabilityName == undefined) {
        this.onePart.splice(0, 1)
      }
      this.$confirm('是否删除该能力项?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAbility({
          capabilityId: id
        }).then((res) => {
          if (res.code == 0) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.abilityListOne(true)
          } else {
            this.$message.error(res.message)
          }
        })
        // that
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加能力项
    addAbility(num) {
      // 所有的一级能力项处于查看状态
      for (const i in this.onePart) {
        if (!this.onePart[i].edit) {
          this.onePart[i].edit = true
          this.onePart[i].input = false
        }
      }
      // 若增加的一级能力项存在
      if (this.onePart.length != 0) {
        if (this.onePart[0].id == undefined) {
          this.onePart[0].edit = false
          this.onePart[0].input = true
          this.$message({
            message: '请先填写一级能力项',
            type: 'warning'
          })
          return false
        }
      } else {
        this.onePart.unshift({
          name: '',
          input: true,
          edit: false,
          delete: false,
          add: true
        })
      }
      switch (num) {
      case 1:
        // 若添加的是一级能力项
        this.choseOnePart = undefined
        if (this.onePart[0].id == undefined) {
          this.onePart[0].edit = false
          this.onePart[0].input = true
          return false
        }
        this.twoPart = []
        this.onePart.unshift({
          name: '',
          input: true,
          edit: false,
          delete: false,
          add: true
        })
        break
      default:
        if (this.choseOnePart == undefined) {
          this.$message.error('请先选择一级能力项')
          return false
        }
        if (this.onePart[0].id == undefined) {
          if (this.choseOnePart == undefined) {
            this.$message({
              message: '请填写一级能力项名称',
              type: 'success'
            })
            this.onePart[0].name = ''
            this.onePart[0].edit = false
            this.onePart[0].input = true
            return false
          } else {
            this.onePart[0].edit = true
            this.onePart[0].input = false
          }
        }
        if (this.twoPart.length != 0) {
          if (this.twoPart[0].id == undefined) {
            if (this.onePart[0].id == undefined) {
              this.twoPart[0].edit = false
              this.twoPart[0].input = true
              this.onePart[0].edit = false
              this.onePart[0].input = true
              this.$message({
                message: '请填写',
                type: 'warning'
              })
            }
            return false
          }
        }
        if (this.twoPart == undefined) {
          this.twoPart = [{
            name: '',
            input: true,
            edit: false,
            delete: false
            }]
        } else {
          this.twoPart.unshift({
            name: '',
            input: true,
            edit: false,
            delete: false,
            add: true
          })
        }
      }
    },
    // 编辑一级能力项
    editOne(id, index, type) {
      const arr = ['onePart', 'twoPart']
      //  修改一个其他编辑状态关闭
      if (type == 0) {
        for (const i in this.onePart) {
          this.onePart[i].input = false
          this.onePart[i].edit = true
        }
        if (this.onePart[0].capabilityName == undefined) {
          this.onePart.splice(0, 1)
        }
      } else if (type == 1) {
        for (const i in this.twoPart) {
          this.twoPart[i].input = false
          this.twoPart[i].edit = true
        }
      }
      this[arr[type]][index].input = true
      this[arr[type]][index].edit = false
    },
    // 保存一級能力項 num 新增-1 编辑-2
    savePartOne(index, num) {
      const that = this
      const data = {
        levelNum: num,
        creator: this.getUser('id')
      }
      //  新增1 编辑2
      let now = 0
      if (num == 1) {
        if (this.onePart[index].capabilityName == '' || this.onePart[index].capabilityName == undefined) {
          this.$confirm('一级能力项名称不能为空', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.onePart[index].input = true
            this.onePart[index].edit = false
            return false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          return false
        }
        Object.assign(data, {
          capabilityName: this.onePart[index].capabilityName,
          parentId: ''
        })
        if (this.onePart[index].add) {
          now = 1
        } else {
          now = 2
        }
      } else {
        Object.assign(data, {
          capabilityName: this.twoPart[index].capabilityName,
          parentId: this.choseOnePart
        })
        if (this.twoPart[index].add) {
          now = 1
        } else {
          now = 2
        }
      }
      if (now == 1) {
        // now 是新增
        const id = ''
        if (num == 1) {
          Object.assign(data, {
            id: this.onePart[index].id
          })
        } else {
          Object.assign(data, {
            id: this.twoPart[index].id
          })
        }
        addAbility(data).then((res) => {
          if (res.code == 0) {
            this.choseOnePart = []
            this.abilityListOne()
            if (this.onePart.length != 0) {
              delete this.onePart[index].add
            }
          } else {
            this.$message.error(res.message)
            this.abilityListOne(true)
          }
        })
      } else {
        if (num == 1) {
          Object.assign(data, {
            id: this.onePart[index].id
          })
        } else {
          Object.assign(data, {
            id: this.twoPart[index].id
          })
        }
        editAbility(data).then((res) => {
          if (res.code == 0) {
            this.choseOnePart = []
            this.abilityListOne()
          } else {
            this.$message.error(res.message)
            // 刷新列表
            this.abilityListOne(true)
          }
        })
      }
    },
    // 一级选项列表
    async abilityListOne() {
      await listAbility({
        capabilityId: ''
      }).then((res) => {
        if (res.code == 0) {
          for (const i in res.result) {
            res.result[i].input = false
            Object.assign(res.result[i], {
              input: false,
              edit: true,
              icon: false,
              editing: true
            })
          }
          this.onePart = res.result
          this.saveAbility.one = this.onePart
          if (this.choseOnePart == '') {
            if (this.onePart.length == 0) {
              return false
            } else {
              this.choseOnePart = this.onePart[this.partIndex].id
            }
          } else if (this.choseOnePart == undefined) {
            this.choseOnePart = this.onePart[this.partIndex].id
          }
          this.onePartHandler(true)
        }
      })
    },
    onePartHandler(row) {
      const data = {
        capabilityId: ''
      }
      if (row == undefined) {
        data.capabilityId = row
      } else if (this.choseOnePart != '') {
        data.capabilityId = this.choseOnePart
      }
      listAbility(data).then((res) => {
        for (const i in res.result) {
          res.result[i].input = false
          Object.assign(res.result[i], {
            input: false,
            edit: true,
            icon: false
          })
        }
        this.twoPart = res.result
      })
    }
  },
  created() {
    // 刷新列表
    this.abilityListOne(true)
  },
  mounted() {
    document.addEventListener('click', event => {
      if (this.onePart.length != 0) {
        if (this.onePart[0].id == undefined) {
          this.onePart.splice(0, 1)
        }
        for (const i in this.onePart) {
          if (!this.onePart[i].edit) {
            this.onePart[i].edit = true
            this.onePart[i].input = false
          }
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.abilityBox {
    padding: 30px 0;
    height: calc(100vh - 247px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.ability {
    width: 300px;
    margin-right: 20px;

    h6 {
        font-weight: normal;
        font-size: 16px;
        color: #414D65;
        margin: 0 0 20px;
    }

    .add-ability {
        .btn {
            width: 88px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #fff;
            background: #414D65;
            display: block;
            border-radius: 3px;
            cursor: pointer;
        }
    }

    .ability-list {
        border: 1px solid #DCDCDC;
        border-radius: 3px;
        padding: 0;
        height: calc(100vh - 400px);
        overflow: auto;

        li {
            list-style: none;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
            input {
                line-height: 0;
                width: 100%;
                height: 34px;
                border-radius: 3px;
                border: 1px solid #ccc;
                text-indent: 1.5em;
                outline: none;
            }

            .list-text {
                margin-left: 10px;
                width: 190px;
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .iconfont {
                margin-right: 10px;
                color: #414D65;
                display: none;
            }

            &.on {
                background: #F1F6FF;
            }

            &:hover {
                background: #F1F6FF;
                cursor: pointer;

                .iconfont {
                    display: block;
                }
            }
        }
    }
}
</style>
