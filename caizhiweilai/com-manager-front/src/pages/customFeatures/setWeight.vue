<template>
  <div class="data-type">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="sidebar-menu">
          <div class="header-title">
            <h3 class="title">设置权重</h3>
          </div>
          <ul class="menu-container">
            <li
              class="menu-list"
              :class="[activeCurrent === index ? 'active': '']"
              :title="item.name"
              @click="switchTabs(item, index)"
              v-for="(item, index) in tabList"
              :key="index"
            >{{item.name}}</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <div class="btn-group">
            <el-button size="medium" @click="goback">返回</el-button>
            <el-button type="primary" size="medium" @click="save()">保存</el-button>
            <el-button size="medium" @click="exPort()">导出</el-button>
            <el-button size="medium" @click="print()">打印</el-button>
            <el-button size="medium" @click="setFullScreen()">全屏</el-button>
          </div>
          <iframe id="iframe" :src="tableUrl" frameborder="0" width="100%"></iframe>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="fullScreenDialog"
      :close-on-click-modal="false"
      :fullscreen="true"
      width="100%"
      :show-close="false"
      custom-class="iframe-dialog"
      :before-close="dialogBeforeClose">
      <div class="dialog-title" slot="title">
        <el-button type="primary" @click="fullScreenDialog = false">关闭</el-button>
      </div>
      <div class="dialog-iframe-content">
        <iframe id="fullIframe" :src="fullScreenIframeUrl" frameborder="0" width="100%"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWeightAnswerList } from '@/api/weightAnswer'
export default {
  props: ['WeightData'],
  data() {
    return {
      activeCurrent: 0,
      tabList: [],
      tableUrl: '',
      fullScreenIframeUrl: '',
      fullScreenDialog: false
    }
  },
  mounted() {
    this._getTabList()
  },
  methods: {
    async _getTabList() {
      const res = await getWeightAnswerList({ taxLayerType: this.WeightData.taxLayerType, accountingSystem: this.WeightData.accountingSystem })
      if (res.code === '0') {
        this.tabList = res.result || []
        this.activeCurrent = 0
        if (res.result.length > 0) {
          const item = res.result[0]
          this.tableUrl = `${item.url};boxId=${item.boxId};random=${Math.random()
            .toString()
            .slice(2, 12)};qyId=${item.qyid};kjnd=2020;kjqj=1;sbszId=${item.sbszId};provinceId=${item.provinceId};cellLockDisabled=1`
        }
      }
    },
    // 全屏
    setFullScreen() {
      this.fullScreenIframeUrl = this.tableUrl
      this.fullScreenDialog = true
    },
    // 销毁前
    dialogBeforeClose() {
      this.fullScreenIframeUrl = ''
    },
    switchTabs(item, index) {
      this.activeCurrent = index
      const url = `${item.url};boxId=${item.boxId};random=${Math.random()
        .toString()
        .slice(2, 12)};qyId=${item.qyid};kjnd=2020;kjqj=1;sbszId=${item.sbszId};provinceId=${item.provinceId};cellLockDisabled=1`
      this.tableUrl = url
    },
    // 返回账套列表
    goback() {
      this.$emit('goAccountList')
    },
    // 保存
    save() {
      const getRandom = this.tableUrl.split(';')[2].split('=')[1]
      document.getElementById('iframe').contentWindow.postMessage(
      {
        action: 'save',
        random: getRandom
      }, '*')
      // console.log('接口没好')
      // return
      // getYZFWeight({ taxpayerType: this.taxpayerType, accSysKey: this.accSysKey }).then(res => {
      //   if (res.code === '0') {
      //     // 获取url上面的random
      //   } else {
      //     this.$message.warning(res.message)
      //   }
      // })
    },
    // 打印
    print() {
      // 获取url上面的random
      const getRandom = this.tableUrl.split(';')[2].split('=')[1]
      document.getElementById('iframe').contentWindow.postMessage(
        {
          action: 'print',
          random: getRandom
        }, '*')
    },
    // 输出
    exPort() {
      // 获取url上面的random
      const getRandom = this.tableUrl.split(';')[2].split('=')[1]
      document.getElementById('iframe').contentWindow.postMessage(
        {
          action: 'export',
          random: getRandom
        }, '*')
    }
  }
}
</script>
<style lang='scss' scoped>
.data-type {
  width: 100%;
  background-color: #ffffff;
  padding: 13px 0;
  .select-types {
    margin-bottom: 24px;
    ::v-deep {
      .el-select {
        width: 100%;
      }
    }
  }
  .sidebar-menu {
    width: 100%;
    min-height: calc(100vh - 270px);
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    .header-title {
      width: 100%;
      height: 48px;
      background-color: #e0e6ed;
      font-size: 14px;
      font-weight: 600px;
      color: #303133;
      padding: 17px 10px 17px 35px;
      .title {
        line-height: 20px;
        padding-left: 16px;
        border-left: 3px solid #3271ff;
        margin-left: -16px;
      }
    }
    .menu-container {
      width: 100%;
      padding: 10px 10px 10px 35px;
      .menu-list {
        font-size: 13px;
        list-style: none;
        color: #303133;
        line-height: 40px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
      .menu-list.active {
        color: #3271ff;
      }
    }
  }
  .content {
    width: 100%;
    height: calc(100vh - 270px);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(68, 91, 129, 0.15);
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    padding: 24px;
    #iframe {
      height: calc(100% - 64px);
    }
    .btn-group {
      margin-bottom: 28px;
      overflow: hidden;
      clear: both;
      ::v-deep {
        .el-button {
          width: 120px;
          float: right;
          &:nth-child(1) {
            float: left;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.data-type {
  .iframe-dialog {
    border-radius: 0;
    .el-dialog__header {
      border: 0;
      padding: 20px 30px 0;
    }
    .el-dialog__body {
      padding: 20px 30px;
    }
    .dialog-title {
      overflow: hidden;
      .el-button {
        float: right;
      }
    }
    .dialog-iframe-content {
      width: 100%;
      height: calc(100vh - 96px);
      #fullIframe {
        height: 100%;
      }
    }
  }
}
</style>