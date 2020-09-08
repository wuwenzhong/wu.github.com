<template>
  <div class="account-answer">
    <!-- {{this.AnswerData.companyId}}
    {{this.AnswerData.id}} -->
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="sidebar-menu">
          <div class="header-title">
            <h3 class="title">设置答案</h3>
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
            <div style="float:left">
              <el-button size="medium" @click="goback">返回</el-button>
              <el-button size="medium" @click="setFullScreen()">全屏</el-button>
              <el-button size="medium" @click="print()">打印</el-button>
              <el-button size="medium" @click="exPort()">导出</el-button>
              <el-button type="primary" size="medium" @click="save()">保存</el-button>

            </div>
            <div style="float:right">
              <el-date-picker
                class="picker"
                v-model="datePicker"
                type="month"
                value-format="yyyy-M"
                placeholder="选择月">
              </el-date-picker>
              <el-button type="primary" @click="checkStandard">根据日期一键同步案例标准答案</el-button>
            </div>
          </div>
          <div class="iframe-box">
            <iframe id="iframe" :src="tableUrl" frameborder="0" width="100%"></iframe>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      top="25vh"
      width="500px">
      <div>是否重新获取标准答案?如果重新获取则覆盖原来答案</div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
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
import { getWeightAnswerList, answerSave, allyzfanswerdata } from '@/api/weightAnswer'
export default {
  props: ['AnswerData'],
  data() {
    return {
      activeCurrent: 0,
      refreshToken: '',
      accessToken: '',
      tabList: [],
      tableUrl: '',
      fullScreenIframeUrl: '',
      fullScreenDialog: false,
      dialogVisible: false,
      // year: 2020,
      // month: 6,
      year: new Date().getFullYear() + '',
      month: new Date().getMonth() + 1 + '',
      datePicker: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    }
  },
  watch: {
    datePicker(newval) {
      this.year = newval.split('-')[0]
      this.month = newval.split('-')[1]
      // this.tableUrl = this.tableUrl.split(';').map(item => {
      //   if (item.split('=')[0] === 'kjqj') {
      //     item = item.split('=')[0] + '=' + this.month
      //   } else if (item.split('=')[0] === 'kjnd') {
      //     item = item.split('=')[0] + '=' + this.year
      //   }
      //   return item
      // }).join(';')
      // console.log(this.tableUrl)
    }
  },
  mounted() {
    // console.log('this.AnswerData', this.AnswerData)
    this._getTabList()
  },
  methods: {
    // 获取tab列表
    async _getTabList() {
      // console.log(this.AnswerData.taxLayerType, this.AnswerData.accountingSystem)
      const res = await getWeightAnswerList({ taxLayerType: this.AnswerData.taxLayerType, accountingSystem: this.AnswerData.accountingSystem })
      if (res.code === '0') {
        this.tabList = res.result || []
        this.activeCurrent = 0
        if (res.result.length > 0) {
          const item = res.result[0]
          this.tableUrl = `${item.url};boxId=${item.boxId};random=${Math.random()
            .toString()
            .slice(2, 12)};qyId=edu-answer-${this.AnswerData.id};kjnd=${this.year};kjqj=${this.month};sbszId=${item.sbszId};provinceId=${item.provinceId};cellLockDisabled=1`
        }
      }
    },
    // tab切换
    switchTabs(item, index) {
      // console.log('555', item)
      this.activeCurrent = index
      const url = `${item.url};boxId=${item.boxId};random=${Math.random()
        .toString()
        .slice(2, 12)};qyId=edu-answer-${this.AnswerData.id};kjnd=${this.year};kjqj=${this.month};sbszId=${item.sbszId};provinceId=${item.provinceId};cellLockDisabled=1`
      this.tableUrl = url
    },
    // 一键同步标准答案
    async checkStandard() {
      this.dialogVisible = true
    },
    // 确定一键同步答案
    async handleSubmit() {
      const params = {
        year: this.year || '',
        month: this.month || '',
        caseId: this.AnswerData.id
      }
      let query = ''
      if (params) {
        for (var i in params) {
          query += i + '=' + params[i] + '&'
        }
        query = query.slice(0, -1)
      }
      const res = await allyzfanswerdata(query)
      if (res.code === '0') {
        this.$message.success('答案获取成功')
      } else {
        this.$message.warning(res.message)
      }
      this.dialogVisible = false
    },
    // 保存
    save() {
      const boxId = this.tableUrl.split(';')[1].split('=')[1]
      const params = {
        tempId: boxId || '',
        year: this.year || '',
        month: this.month || '',
        caseId: this.AnswerData.id
      }
      answerSave(params).then(res => {
        if (res.code === '0') {
          this.$message.success('保存成功')
          // 获取url上面的random
          // const getRandom = this.tableUrl.split(';')[2].split('=')[1]
          // document.getElementById('iframe').contentWindow.postMessage(
          //   {
          //     action: 'save',
          //     random: getRandom
          //   }, '*')
        } else {
          this.$message.warning(res.message)
        }
      }).catch(error => { console.log(error) })
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
    },
    setFullScreen() {
      this.fullScreenIframeUrl = this.tableUrl
      this.fullScreenDialog = true
    },
    // 销毁前
    dialogBeforeClose() {
      this.fullScreenDialog = ''
    },
   // 返回账套列表
    goback() {
      this.$emit('goAccountList')
    }
  }
}
</script>
<style lang='scss' scoped>
.account-answer{
  padding: 13px 0;
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
    border-radius: 4px;
    padding: 24px;
    .btn-group {
      margin-bottom: 28px;
      overflow: hidden;
      clear: both;
    }
    .iframe-box {
      width: 100%;
      height: calc(100% - 64px);
      #iframe {
        height: 100%;
      }
    }
  }
</style>
<style lang="scss">
.account-answer {
  .el-input__icon {
    line-height: 36px;
  }
  .picker {
    width: 140px;
    margin-right: 10px;
  }
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