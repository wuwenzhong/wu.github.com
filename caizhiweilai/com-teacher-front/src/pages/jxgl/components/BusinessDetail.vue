<template>
  <div class="busniess-detail">
    <div class="cont">
      <p class="title">企业信息</p>
      <ul class="detail">
        <li>
          <span class="list-name">企业<i class="text1"></i>名称：</span>
          <div class="list-cont">{{detailData.company}}</div>
        </li>
        <li>
          <span class="list-name">税<i class="text2"></i>号：</span>
          <div class="list-cont">{{detailData.taxLayerNo}}</div>
        </li>
        <li>
          <span class="list-name">纳税人资格：</span>
          <div class="list-cont">
            <el-radio class='m0' disabled v-model="detailData.taxLayerType" label='001' >一般纳税人</el-radio>
            <el-radio class='m0' disabled v-model="detailData.taxLayerType" label='101' >小规模纳税人</el-radio>
          </div>
        </li>
        <li>
          <span class="list-name">地<i class="text2"></i>区：</span>
          <div class="list-cont area">
            <el-select v-for="(item,i) in areaData" :key="i" :value="item" disabled placeholder="请选择"></el-select>
          </div>
        </li>
        <li>
          <span class="list-name">详细<i class="text1"></i>地址：</span>
          <div class="list-cont">{{detailData.addressDetail}}</div>
        </li>
        <li>
          <span class="list-name">所属<i class="text1"></i>行业：</span>
          <div class="list-cont">{{detailData.industryName}}</div>
        </li>
        <li>
          <span class="list-name">会计<i class="text1"></i>制度：</span>
          <div class="list-cont" v-html="detailData.taxpayer == 1 ? '企业会计准则2017版' : '小企业会计准则2013版'"></div>
        </li>
      </ul>
      <div class="btn-box">
        <button @click="closeDetail">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import areaJs from '../../../common/js/select_area.js'
export default {
  name: 'BusinessDetail',
  data() {
    return {
      areaData: [] // 地域数据
    }
  },
  props: {
    detailData: {
      type: Object
    }
  },
  mounted() {
    this.filterArea()
  },
  methods: {
    // 关闭查看详情
    closeDetail() {
      this.$emit('closeDetail')
    },
    // 对比出地域
    filterArea() {
      this.areaData = JSON.parse(JSON.stringify(this.detailData.finalAddress))
      const tempArr = []
      let secondData = []
      let threeData = []
      for (let i = 0, len = areaJs.length; i < len; i++) {
        if (areaJs[i].value == this.areaData[0]) {
          tempArr.push(areaJs[i].label)
          secondData = areaJs[i].children
          break
        }
      }
      for (let j = 0, size = secondData.length; j < size; j++) {
        if (secondData[j].value == this.areaData[1]) {
          tempArr.push(secondData[j].label)
          threeData = secondData[j].children
          break
        }
      }
      for (let k = 0, num = threeData.length; k < num; k++) {
        if (threeData[k].value == this.areaData[2]) {
          tempArr.push(threeData[k].label)
          break
        }
      }
      this.areaData = tempArr
    }
  }
}
</script>

<style scoped lang="scss">
.busniess-detail {
  overflow-y: auto;
  @include maskLayer($z: 1002);

  .cont {
    width: 520px;
    background: #fff;
    padding-bottom: 20px;
    position: relative;
    border-radius: 4px;
    @include setBoxShadow($w: 12px, $r: rgba(68, 91, 129, 0.45));

    .title {
      line-height: 44px;
      border: 1px solid #F3F4F5;
      padding: 0 30px;
      color: #444444;
      font-size: 16px;
      font-weight: bold;
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
    .detail{
      padding: 0 30px;
      li{
        display: flex;
        line-height: 32px;
        margin-top:20px;
        .list-name{
          width:100px;
          text-align: left;
          .text1{
            margin:0 8px;
          }
          .text2{
            margin:0 24px;
          }
        }
        .list-cont{
          flex:1;
          color:#C0C4CC;
          &.area{
            display: flex;
            .el-select{
              margin-right: 10px;
              .el-input__inner{
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }
    }
    .btn-box{
      button{
        width: 80px;
        height: 30px;
        font-size: 12px;
        color: #fff;
        background: $color-theme;
        border:0;
        outline: none;
        display: block;
        margin:20px auto 0;
        border-radius:3px;
      }
    }
  }
}
</style>
