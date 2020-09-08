<template>
<div class="navbar">
  <div class="navbar-max-wrapper">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- 导航栏 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="title"><b>财智未来综合实训平台</b><span>教务端</span></div>

    <user-info></user-info>
    <span class="help-file"
          @click="previewFile"><i class="iconfont">&#xe64a;</i>操作指引</span>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Breadcrumb from '@/components/breadcrumb'
// import Hamburger from '@/components/hamburger'
import UserInfo from './user-info'

export default {
  name: 'navbar',
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 预览编辑文档
    previewFile() {
      window.open('/filePreview', '_blank')
    }
  },
  components: {
    // Hamburger,
    UserInfo
  }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 74px;
    .navbar-max-wrapper {
        height: 74px;
        // max-width: $width-content-max;
        padding-right: 56px;
        .hamburger-container {
            line-height: 66px;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background 0.3s;
            -webkit-tap-highlight-color: transparent;
            &:hover {
                background: rgba(0, 0, 0, .025);
            }
        }
        .breadcrumb-container {
            float: left;
        }
        // title
        /*操作指引*/
        .help-file {
            float: right;
            font-size: 12px;
            line-height: 70px;
            color: #666;
            margin-right: 20px;
            cursor: pointer;
            position: relative;
            padding-left: 30px;
            i {
                font-size: 28px;
                color: $color-theme;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
        .title {
            float: left;
            height: 74px;
            margin-left: 32px;
            display: flex;
            align-items: center;
            &:first-of-type {
                b {
                    font-weight: normal;
                    font-size: 18px;
                    margin-right: 10px;
                }
            }
            &:first-of-type {
                span {
                    border-left: 1px solid #333;
                }
            }
            span {
                display: inline-block;
                height: 22px;
                line-height: 20px;
                font-size: 18px;
                padding-left: 12px;
            }
        }
    }
}
</style>
