<template>
<div class="lottery-result-dialog">
  <div class="cont" :style="{'margin-top':-contHeight/2+'px'}" ref="resultBox">
    <p class="title">往期结果<i class="iconfont" @click="closeResulte">&#xe60e;</i></p>
    <div class="table-list">
      <table>
        <thead>
          <tr>
            <th width="20%">类型</th>
            <th width="35%">最终结果</th>
            <th width="25%">发起时间</th>
            <th width="20%">参与项</th>
          </tr>
        </thead>
        <tbody v-if="oldLotteryData.data.length">
          <tr v-for="item in oldLotteryData.data" :key="item.id">
            <td v-html="item.carouselType == 1 ? '按学生':(item.carouselType == 2 ? '按团队' : '按自定义')"></td>
            <td v-if="item.carouselType == 1" v-html="item.choiceStudentId != 0 ? item.studentName : '----'" :title="item.studentName" class="over-text"></td>
            <td v-if="item.carouselType == 2" v-html="item.choiceTeamId != 0 ? item.teamName : '----'" :title="item.teamName" class="over-text"></td>
            <td v-if="item.carouselType == 3" v-html="item.choiceStudentId != '' ? item.choiceCustomId : '----'" :title="item.choiceCustomId" class="over-text"></td>
            <td>{{item.createTime}}</td>
            <td>
              <div class="opera-box">
                <span class="text">查看</span>
                <div class="hover-show" v-if="item.carouselType == 1">
                  <p class="hover-title">参与项</p>
                  <div class="scroll-box">
                    <el-scrollbar style="height:100%">
                      <p v-for="(current,i) in item.studentNames" :key="i" class="name-list" :title="current">{{current}}</p>
                    </el-scrollbar>
                  </div>
                </div>
                <div class="hover-show" v-if="item.carouselType == 2">
                  <p class="hover-title">参与项</p>
                  <div class="scroll-box">
                    <el-scrollbar style="height:100%">
                      <p v-for="(current,i) in item.teamNames" :key="i" class="name-list" :title="current">{{current}}</p>
                    </el-scrollbar>
                  </div>
                </div>
                <div class="hover-show" v-if="item.carouselType == 3">
                  <p class="hover-title">参与项</p>
                  <div class="scroll-box">
                    <el-scrollbar style="height:100%" :native="false">
                      <p v-for="(current,i) in item.customNames" :key="i" class="name-list" :title="current">{{current}}</p>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" style="text-align: center;padding:30px 0;">暂无数据~~</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination v-if="total>10" @pagination="monitorPagin" :total="Number(total)" :page.sync="page" :limit.sync="size"></Pagination>
    <!--      <div class="btn-box">-->
    <!--        <button class="cancel" @click="closeResulte">取消</button>-->
    <!--        <button class="hold" @click="closeResulte">确定</button>-->
    <!--      </div>-->
  </div>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import {
  lookOldResult
} from '@/api/teamAdmin'
export default {
  name: 'lotteryResult',
  data() {
    return {
      total: 0,
      page: 1,
      size: 10,
      contHeight: 0 // 弹窗的高度
    }
  },
  mounted() {
    this.total = this.oldLotteryData.total
    this.page = this.oldLotteryData.page
    this.size = this.oldLotteryData.size
    const _this = this
    this.$nextTick(function () {
      _this.contHeight = _this.$refs.resultBox.offsetHeight
    })
    //  设置body超出隐藏
    document.querySelector('body').setAttribute('style', 'overflow:hidden')
  },
  computed: {
    ...mapState([
      'oldLotteryData'
    ])
  },
  methods: {
    // 关闭查看结果
    closeResulte() {
      this.$store.commit('setLookLotteryResult', false)
    },
    // 查看往期结果分页监听
    monitorPagin(obj) {
      this.page = obj.page
      this.size = obj.limit
      this.lookLotteryResult()
    },
    // 查看往期结果
    lookLotteryResult() {
      const _this = this
      const posData = {
        classId: localStorage.getItem('classId'),
        page: this.page,
        size: this.size
      }
      lookOldResult(posData).then(res => {
        if (res) {
          _this.$store.commit('setOldLottery', res.result)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  },
  beforeDestroy() {
    // 组件销毁时清除掉加载body上的样式
    document.querySelector('body').removeAttribute('style')
  }
}
</script>

<style scoped lang="scss">
.lottery-result-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    background: rgba(0,0,0,.2);
    overflow-y: auto;
    .cont {
        background: #fff;
        width: 930px;
        border-radius: 4px;
        padding-bottom: 40px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -465px;
        .title {
            font-size: 18px;
            color: #444;
            line-height: 20px;
            position: relative;
            padding: 20px 30px;
            i {
                position: absolute;
                right: 0;
                top: 0;
                padding: 20px 30px;
                cursor: pointer;
                color: #929292;
            }
        }
        .table-list {
            margin: 20px 30px 0 30px;
            table {
                width: 100%;
                border-collapse: collapse;
                border: 1px solid #EDEDED;
                text-align: left;
                font-size: 13px;
                color: #333333;
                table-layout: fixed;
                tr {
                    line-height: 40px;
                    th {
                        background: #FAFCFE;
                        border-bottom: 1px solid #EDEDED;
                        font-weight: normal;
                    }
                    td,
                    th {
                        padding-left: 30px;
                        position: relative;
                        &.over-text {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                        .opera-box {
                            position: relative;
                            display: inline-block;
                            &:hover {
                                .hover-show {
                                    display: block;
                                }
                            }
                            .hover-show {
                                @include setBoxShadow($w:14px,$r:rgba(12, 64, 52, 0.19));
                                position: absolute;
                                right: -110px;
                                top: 20px;
                                display: none;
                                z-index: 1;
                                width: 132px;
                                background: #fff;
                                .hover-title {
                                    font-size: 14px;
                                    color: #333;
                                    text-align: center;
                                    line-height: 32px;
                                    font-weight: bold;
                                }
                                .scroll-box {
                                    height: 140px;
                                    .name-list {
                                        text-align: center;
                                        line-height: 32px;
                                        font-size: 12px;
                                        color: #595959;
                                        width: 100%;
                                        padding: 0 14px;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        &:hover {
                                            background: rgba(70, 104, 96, 0.07);
                                        }
                                    }
                                }
                            }
                            .text {
                                color: $color-theme;
                                padding: 0 30px 0 0;
                                cursor: pointer;
                            }
                        }
                    }
                }
                tbody {
                    tr {
                        &:nth-child(even) {
                            background: #F8F8F8;
                        }
                    }
                }
            }
        }
        .btn-box {
            text-align: center;
            margin-top: 20px;
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
