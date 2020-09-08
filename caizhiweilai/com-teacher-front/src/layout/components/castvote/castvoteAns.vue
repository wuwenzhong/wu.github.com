<template>
<div class="draw-lottery">
  <div class="draw-lottery-cont">
    <div @click="closejg" class="gbps">
      <img src="../castvote/images/close.png" alt srcset />
    </div>
    <div class="bgCover">
      <div class="top">
        <div class="low" v-for="(item,index) in rankArr" :key="item.id + index" v-show="index == 1">
          <div class="headimg">
            <img class="tximg" src="./images/default.png" alt v-if="item.photo==''|| !item.photo" />
            <img class="tximg" :src="item.photo" alt v-else />
            <img src="../castvote/images/secound.png" alt />
          </div>
          <span class="people" :title="item?item.name:'暂无'">
            <p>{{item?item.name:'暂无'}}</p>
            （{{item?item.voteNum:'0'}}票）
          </span>
        </div>
        <div class="middle" v-for="(item,index) in rankArr" :key="index" v-show="index == 0">
          <div class="headimg">
            <img class="imgtx" src="./images/default.png" alt v-if="item.photo==''|| !item.photo" />
            <img class="imgtx" :src="item.photo" alt v-else />
            <img src="../castvote/images/first.png" alt />
          </div>
          <span class="people" :title="item?item.name:'暂无'">
            <p>{{item?item.name:'暂无'}}</p>
            （{{item?item.voteNum:'0'}}票）
          </span>
        </div>
        <div class="low" v-for="(item,index) in rankArr" :key="item.name + index" v-show="index ==2">
          <div class="headimg">
            <img class="tximgth" src="./images/default.png" alt v-if="item.photo==''|| !item.photo" />
            <img class="tximgth" :src="item.photo" alt v-else />
            <img src="../castvote/images/third.png" alt />
          </div>
          <span class="people" :title="item?item.name:'暂无'">
            <p>{{item?item.name:'暂无'}}</p>
            （{{item?item.voteNum:'0'}}票）
          </span>
          <div @click="init" class="refer">刷新
          </div>
          <div @click="overjs" class="over">结束
          </div>
          <div @click="lastwq" class="last">往期结果
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="answer-table" v-show="rankArr.length>3">
        <div class="answer-part answer-part-head">
          <div class="part-answer-rank">排名</div>
          <div class="part-answer-student">学生</div>
          <div class="part-answer-time">票数</div>
        </div>
        <ul class="answer-part">
          <li v-for="(item,index) in rankArr" :key="index" v-show="index >= 3 && index <= 7">
            <div class="part-answer-rank">{{index + 1}}</div>
            <div class="part-answer-student">
              <img src="./images/default.png" alt v-if="item.photo==''|| !item.photo" />
              <img :src="item.photo" alt v-else />
              <span :title="item.name">{{item.name}}</span>
            </div>
            <div class="part-answer-time pnumber">{{item.voteNum}}票</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- 查看往期结果 -->
  <el-dialog width="40%" title="往期结果" :visible.sync="innerVisible" :before-close="onClose" append-to-body>
    <div class="outline">
      <div class="titleResult">
        <div class="lx">类型{{total>10}}</div>
        <div class="fist">第一名</div>
        <div class="startTime">发起时间</div>
        <div class="voteRes reslst">投票结果</div>
      </div>
      <div>暂无数据</div>
      <div class="titleResult" v-for="(item,index) in tableData" :key="index">
        <div class="lx">{{item.voteTypeName}}</div>
        <div class="fist">{{item.name}}</div>
        <div class="startTime">{{item.createTime}}</div>
        <div class="voteRes overlook" @mouseenter="handleClicklook(item,'true')" @mouseleave="handleClicklook(item,'false')">
          <span v-show="item.status=='0'" @click="over(item)">结束</span>
          <span class="lookSpan">查看</span>
        </div>
        <ul v-show="grId ==item.id">
          <li>参与项</li>
          <li v-for="(item,index) in item.voteUserDTOList" :key="index">
            <span>{{item.name}}</span>（{{item.voteNum}} 票）
          </li>
        </ul>
      </div>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.size" @pagination="lastwq" v-show="total>10"/>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  currentVote,
  stopVote,
  allVote
} from '@/api/vote'

export default {
  name: 'turntable',
  data() {
    return {
      rushIng: false,
      rankArr: [],
      innerVisible: false,
      tableData: [],
      grId: '',
      queryParams: {
        page: 1,
        size: 10
      },
      total: 0,
      count: 0
    }
  },
  created() {
    this.init()
    clearTimeout(this.firstTime)
    this.firstTime = setTimeout(() => {
      this.init()
      clearTimeout(this.firstTime)
      this.timer = setInterval(() => {
        if (this.count < 1) {
          this.init()
        }
      }, 10000)
    }, 5000)
  },
  mounted() {
    const _this = this
    document.documentElement.style.overflowY = 'hidden'
  },
  methods: {
    onClose() {
      this.innerVisible = false
      this.init()
    },
    init() {
      const _this = this
      currentVote({
        classId: localStorage.getItem('classId'),
        teacherId: localStorage.getItem('userId')
      }).then(res => {
        if (res.code == 0) {
          _this.rankArr = res.result
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    closejg() {
      clearInterval(this.timer)
      clearTimeout(this.firstTime)
      this.$emit('voteresult', '0')
    },
    handleClicklook(rowid, buer) {
      if (buer == 'true') {
        this.grId = rowid.id
      } else {
        this.grId = ''
      }
    },
    over(item) {
      const _this = this
      this.$confirm('此操作将结束投票, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        // 需要结束投票的id
        localStorage.setItem('overtp', item.id)
        stopVote({
          id: item.id
        }).then(res => {
          if (res.code == '0' || res.code == 0) {
            // 刷新往期结果
            this.lastwq()
            this.$message({
              type: 'success',
              message: res.message
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消结束投票'
        })
      })
    },
    overjs() {
      const _this = this
      this.$confirm('此操作将结束投票, 是否继续?', '提示', {
          confirmButtonText: '确定',
        closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 关闭定时器
          clearInterval(this.timer)
          clearTimeout(this.firstTime)
          // 结束
          stopVote({
            id: this.rankArr[0].id
          }).then(res => {
            if (res.code == '0' || res.code == 0) {
              // 刷新往期结果
              this.$message({
                type: 'success',
                message: res.message
              })
              // 成功之后关闭弹框
              this.$emit('voteresult', '3')
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消结束投票'
          })
        })
    },
    lastwq() {
      // 关闭定时器
      clearInterval(this.timer)
      clearTimeout(this.firstTime)
      // 往期结果
      // this.$emit('voteresult', '1')
      this.innerVisible = true
      allVote({
        classId: localStorage.getItem('classId'),
        teacherId: localStorage.getItem('userId'),
        page: this.queryParams.page,
        size: this.queryParams.size
      }).then(res => {
        if (res.code == '0' || res.code == 0) {
          this.innerVisible = true
          this.tableData = res.result.data
          this.total = Number(res.result.total)
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.outline {
    border: 1px solid #c7c7c7;
    border-bottom: none;
    margin-top: 20px;
    height: 420px;
    overflow-y: scroll;
}

.titleResult {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #c7c7c7;

    div {
        padding: 5px;
        text-align: left;
        cursor: pointer;
        border-right: 1px solid #c7c7c7;
        height: 30px;
    }

    .lx {
        width: 100px;
    }

    .fist {
        width: 100px;
    }

    .startTime {
        width: 180px;
    }

    .voteRes {
        width: 100px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .reslst {
        border-right: none;
    }

    .overlook {
        position: relative;
        border-right: none;

        .lookSpan:hover {
            color: #36CEA9;
        }
    }

    ul {
        position: absolute;
        background: white;
        z-index: 999;
        top: 81px;
        right: -150px;
        padding: 10px;
        box-shadow: 0 2px 8px 0 rgba(224, 226, 232, 1);

        li {
            padding: 5px;
            text-align: center;
            width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            span {
                display: inline-block;
                width: 60px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}

.draw-lottery {
    @include maskLayer($num: 0.3, $z: 1500);
    overflow-y: auto;

    .draw-lottery-cont {
        width: 540px;
        height: 800px;
        background: url("images/cjjg.png") no-repeat center/100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -350px;
        margin-left: -270px;

        .gbps {
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
        }

        .bgCover {
            width: 100%;
            height: 802px;
            box-sizing: border-box;
            padding-left: 12px;
            padding-right: 2px;

            .top {
                margin-top: 365px;
                display: flex;
                justify-content: space-around;
                flex-direction: row;

                div {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    span {
                        color: #fc950d;
                    }

                    img {
                        width: 73px;
                        height: 89px;
                    }

                    span {
                        margin-top: 10px;
                    }
                }

                .low {
                    margin-top: 40px;
                    position: relative;

                    .headimg {
                        position: relative;

                        .tximg {
                            position: absolute;
                            border-radius: 50%;
                            width: 36px;
                            height: 36px;
                            bottom: 7px;
                            right: 7px;
                        }

                        .tximgth {
                            position: absolute;
                            border-radius: 50%;
                            width: 37px;
                            height: 37px;
                            bottom: 7px;
                            right: 7px;
                        }

                        img {
                            width: 51px;
                            height: 63px;
                        }
                    }

                    .refer {
                        position: absolute;
                        right: -20px;
                        top: -66px;
                        width: 74px;
                        height: 26px;
                        background: rgba(252, 149, 13, 1);
                        border-radius: 2px;
                        text-align: center;
                        line-height: 26px;
                        color: white;
                        cursor: pointer;
                    }

                    .over {
                        position: absolute;
                        right: 70px;
                        top: -66px;
                        width: 74px;
                        height: 26px;
                        background: rgba(252, 149, 13, 1);
                        border-radius: 2px;
                        text-align: center;
                        line-height: 26px;
                        color: white;
                        cursor: pointer;
                    }

                    .last {
                        position: absolute;
                        right: 160px;
                        top: -66px;
                        width: 74px;
                        height: 26px;
                        background: rgba(252, 149, 13, 1);
                        border-radius: 2px;
                        text-align: center;
                        line-height: 26px;
                        color: white;
                        cursor: pointer;
                    }
                }

                .middle {
                    position: relative;

                    .headimg {
                        position: relative;

                        .imgtx {
                            position: absolute;
                            width: 53px;
                            height: 53px;
                            border-radius: 50%;
                            bottom: 11px;
                            right: 11px;
                        }
                    }
                }
            }
        }

        .answer-table {
            width: 100%;
            height: auto;
            overflow: hidden;
            margin-top: 20px;
            line-height: 1;
            box-sizing: border-box;
            padding: 0 25px;

            .answer-part {
                width: 100%;
                height: auto;
                overflow: hidden;
                font-size: 12px;

                .pnumber {
                    color: #fc950d !important;
                }

                &.answer-part-head {
                    color: #bda498;
                    height: 40px;
                    line-height: 40px;
                }

                .part-answer-rank {
                    width: 120px;
                    box-sizing: border-box;
                    margin-left: 20px;
                    float: left;

                    img {
                        display: block;
                        margin-top: 5px;
                    }
                }

                .part-answer-student {
                    width: 220px;
                    box-sizing: border-box;
                    float: left;

                    img {
                        width: 32px;
                        height: 32px;
                        display: block;
                        border-radius: 100%;
                        float: left;
                        margin-top: 6px;
                        margin-right: 10px;
                        border: 1px solid #fcab75;
                    }

                    span {
                        width: 60px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: inline-block;
                    }
                }

                .part-answer-time {
                    width: 100px;
                    box-sizing: border-box;
                    float: left;
                    .refresh {
                        padding: 5px 10px;
                        background: #fc950d;
                        color: #fff;
                        float: right;
                        line-height: 1;
                        margin-top: 10px;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }

                li {
                    height: 35px;
                    line-height: 35px;
                    // border-bottom: 1px solid #f5f5f5;
                }
            }
        }
    }
}

.people {
    display: flex;

    p {
        display: inline-block;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
    }
}
</style>
