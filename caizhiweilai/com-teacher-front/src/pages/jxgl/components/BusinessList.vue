<template>
  <div class="business-dialog">
    <div class="cont">
      <p class="title">设置企业 <i class="iconfont" @click="closeBusinessDialog">&#xe60e;</i></p>
      <el-table :data="busniessData" class="busniess-table" border>
        <el-table-column prop="company" label="企业名称" min-width="25%">
        </el-table-column>
        <el-table-column prop="industryName" label="所属行业" min-width="25%">
        </el-table-column>
        <el-table-column prop="taxLayerType" label="纳税人信息" min-width="20%">
          <template slot-scope="scope">
            <span v-html="scope.row.taxLayerType == '001' ? '一般纳税人' : '小规模纳税人'"></span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="启用状态" min-width="15%">
          <template slot-scope="scope">
            <span v-html="scope.row.status == 1 ? '已启用' : '已禁用'"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%">
          <template slot-scope="scope">
            <div class="opera-box">
              <span @click="lookDetail(scope.row)">详情</span>
              <span v-html="scope.row.status == 1 ? '禁用' : '启用'" @click="setStatus(scope.row,scope.$index)"></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <business-detail v-if="showDetailDialog" @closeDetail="closeDetail" :detailData="detailData"></business-detail>
  </div>
</template>

<script>
/* eslint-disable */
import {
  businessDisable
} from '@/api/teamAdmin'
import BusinessDetail from './BusinessDetail'

export default {
  name: 'BusinessList',
  data() {
    return {
      detailData: {}, // 当前企业的详情
      showDetailDialog: false // 显示企业详情
    }
  },
  props: {
    busniessData: {
      type: Array
    }
  },
  components: {
    BusinessDetail
  },
  methods: {
    // 关闭弹窗
    closeBusinessDialog() {
      this.$emit('closeBusinessDialog')
    },
    // 设置企业启用禁用
    setStatus(obj, num) {
      const _this = this
      // 获取已经禁用的状态
      let statusNum = 0
      for (let i = 0, size = this.busniessData.length; i < size; i++) {
        if (this.busniessData[i].status == 1) {
          statusNum++
        }
      }
      let _status = ''
      if (Number(obj.status)) {
        _status = 0
        statusNum--
      } else {
        _status = 1
        statusNum++
      }
      const postData = {
        id: obj.id,
        status: _status
      }
      if (statusNum < 1) {
        this.$message({
          type: 'warning',
          message: '最少必须有一个企业'
        })
        return false
      }
      this.sureText = Number(obj.status) ? '确认禁用当前企业吗？' : '确认启用当前企业吗？'
      this.$confirm(this.sureText, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        const _fromDta = new FormData()
        Object.keys(postData).forEach(key => {
          _fromDta.append(key, postData[key])
        })
        businessDisable(_fromDta).then(res => {
          if (res.code == 0) {
            _this.$emit('updateList', num, _status)
            this.$message.success('设置成功')
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }).catch(() => {
      })
    },
    // 查看详情
    lookDetail(obj) {
      this.showDetailDialog = true
      this.detailData = obj
    },
    // 关闭查看详情
    closeDetail() {
      this.showDetailDialog = false
      this.detailData = {}
    }
  }
}
</script>

<style scoped lang="scss">
  .business-dialog {
    overflow-y: auto;
    @include maskLayer($z: 1002);

    .cont {
      width: 930px;
      min-height: 320px;
      background: #fff;
      padding-bottom: 30px;
      position: relative;
      border-radius: 4px;
      @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));

      .title {
        line-height: 44px;
        border: 1px solid #F3F4F5;
        padding: 0 30px;
        color: #444444;
        font-size: 16px;
        position: relative;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid #dedede;

        i {
          position: absolute;
          right: 20px;
          top: 0;
          padding: 0 10px;
          color: #929292;
          font-size: 18px;
          cursor: pointer;
        }
      }

      .busniess-table {
        width: calc(100% - 60px);
        margin: 20px 30px 0;
        max-height: 520px;
        overflow: auto;

        .opera-box {
          display: flex;
          text-align: center;

          span {
            flex: 1;
            cursor: pointer;
            color: $color-theme;
          }
        }
      }
    }
  }
</style>
