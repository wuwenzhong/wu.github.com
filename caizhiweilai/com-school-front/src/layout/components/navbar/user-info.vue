<template>
  <el-popover placement="top-start" width="150">
    <div class="user-operation">
      <div class="operation-item" v-for="item in operation" :key="item.id" @click="handleOperation(item.id)">
        <i class="iconfont" :class="item.icon"></i>{{item.name}}
      </div>
    </div>

    <div class="user-info" slot="reference">
      <span class="avatar">
        <img :src="avatar" alt="">
      </span>
      <span class="username">
        {{userName}}
      </span>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      operation: [
        {
          id: 1,
          name: '用户中心',
          icon: 'iconyhzx1'
        },
        {
          id: 2,
          name: '退出登录',
          icon: 'icontc'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'userName',
      'userCenterUrl'
    ])
  },
  methods: {
    handleOperation(id) {
      if (id === 1) {
        this.$confirm('确定返回用户中心吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.href = localStorage.getItem('centerUrl') + '?flag=1'
        }).catch(() => {})
        return
      }
      if (id === 2) {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Logout()
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
    ...mapActions([
      'Logout'
    ])
  }
}
</script>
<style lang="scss" scoped>
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
    }
    .username {
      font-size: 14px;
      .iconfont {
        font-size: 18px;
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
        transition: color .3s ease;
        // color: $color-theme;
        color: #36CEA9;
      }
      .menuText{
        font-size: 14px;
      }
    }
  }
</style>
