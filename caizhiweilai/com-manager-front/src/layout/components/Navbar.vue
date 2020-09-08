<template>
  <div class="navbar">
    <div class="title">
      <div>
        <img :src="require('../../common/images/logo.png')" alt="" srcset="">
      </div>
      <span>财智未来后台管理系统 v1.0.0</span>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('../../common/images/default-avatar.png')" class="user-avatar" v-hasImage="avatar" v-if="avatar">
          <span class="user-name">{{userName}}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="_userCentr">
            <i class="iconfont iconyhzx1"></i>
            <span>用户中心</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="_logout">
            <i class="iconfont icontc"></i>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userCenterUrl',
      'userName'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleOpetation(id) {
      const routers = {
        1: {
          type: 0,
          url: this.userCenterUrl
        }
      }
      const { type, url } = routers[id]
      if (type === 0) {
        location.href = url
        return
      }
      this.$router.push({
        name: url
      })
    },
    async _logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Logout()
      })
    },
    async _userCentr() {
      this.$confirm('确定返回用户中心吗？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          location.href = localStorage.getItem('centerUrl') + '?flag=1'
        })
    },
    ...mapActions([
      'Logout'
    ])
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  overflow: hidden;
  position: relative;
  height: 60px;
  background:rgba(65,77,101,1);
  box-shadow:0px 2px 10px 0px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  // title
  .title {
    line-height: 60px;
    margin-left: 20px;
    color: white;
    display: flex;
    div{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      img{
        width: 200px;
      }
    }
    span {
      display: inline-block;
      padding-left: 25px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    color: white;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 23px;

      .avatar-wrapper {
        // width: 40px;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }
        .user-name {
          font-size: 14px;
          vertical-align: 10px;
          color: white;
          margin-left: 5px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
