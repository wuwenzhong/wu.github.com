<template>
<div>
  <el-popover placement="top-start"
              width="150">
    <div class="user-operation">
      <div class="operation-item"
           v-for="item in operation"
           :key="item.id"
           @click="handleOperation(item.id)">
        <i class="iconfont"
           :class="item.icon"></i>
        <span class="menuText">{{item.name}}</span>
      </div>
    </div>
    <div class="user-info"
         slot="reference">
      <span class="avatar">
        <img :src="avatar"
             alt />
      </span>
      <span class="username">
        {{userName}}
        <i class="iconfont iconsanjiao"></i>
      </span>
    </div>
  </el-popover>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  data() {
    return {
      operation: [
        {
          id: 0,
          name: '退出实训班级',
          icon: 'iconbanji'
        },
        {
          id: 1,
          name: '用户中心',
          icon: 'iconyonghu'
        },
        {
          id: 2,
          name: '退出登录',
          icon: 'icontuichu'
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName', 'userCenterUrl'])
  },
  methods: {
    handleOperation(id) {
      if (id === 2) {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          // 进入班级时清空存储的大纲数据
          localStorage.removeItem('teachIndex')
          localStorage.removeItem('teachLine')
          localStorage.removeItem('iframeUrl')
          // 退出实训班级关闭连接
          this.oncloseWs(1)
          this.Logout()
        }).catch(() => {})
        return
      }
      if (id === 0) {
        this.$confirm('确定退出实训班级吗？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          // 进入班级时清空存储的大纲数据
          localStorage.removeItem('teachIndex')
          localStorage.removeItem('teachLine')
          localStorage.removeItem('iframeUrl')
          // 退出实训班级关闭连接
          this.oncloseWs(1)
          this.$router.push({
            path: '/classListHome'
          })
        }).catch(() => {})
      }
      if (id === 1) {
        this.$confirm('确定返回用户中心吗？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          // 进入班级时清空存储的大纲数据
          localStorage.removeItem('teachIndex')
          localStorage.removeItem('teachLine')
          // 退出实训班级关闭连接
          localStorage.removeItem('iframeUrl')
          this.oncloseWs(1)
          location.href = localStorage.getItem('centerUrl') + '?flag=1'
        }).catch(() => {})
      }
      // const routers = {
      //   1: {
      //     type: 0,
      //     url: this.userCenterUrl
      //   }
      // }
      // const { type, url } = routers[id]
      // if (type === 0) {
      //   location.href = url
      //   return
      // }
      // this.$router.push({
      //   name: url
      // })
    },
    ...mapActions(['Logout'])
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
    background: none !important;
}
.el-dialog,
.el-pager li {
    background: none !important;
}
.votingResults {
    background: url("../../../common/images/tpjg.png") no-repeat;
    background-size: 100% 100%;
    min-height: 723px;
    min-width: 528px;
}
.user-info {
    float: right;
    height: 74px;
    font-size: $font-size-extra-small;
    color: $color-text-ll;
    cursor: pointer;
    display: flex;
    align-items: center;
    .avatar {
        display: inline-block;
        vertical-align: -11px;
        width: 40px;
        height: 40px;
        margin-right: 11px;
        border-radius: 50% !important;
        overflow: hidden;
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
        .username {
            font-size: 14px;
            line-height: 74px;
            .iconfont {
                font-size: 18px;
            }
        }
    }
}
.user-operation {
    padding-left: 10px;
    i {
        margin-right: 10px;
    }
    .operation-item {
        margin: 10px 0;
        font-size: $font-size-medium;
        cursor: pointer;
        &:hover {
            transition: color 0.3s ease;
            color: $color-theme;
        }
        .menuText {
            font-size: 14px;
        }
    }
}
</style>
