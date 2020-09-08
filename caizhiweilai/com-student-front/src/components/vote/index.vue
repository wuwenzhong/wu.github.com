<template>
  <div class="voteContent">
    <div class="voteTitle">
      {{teachVoteTitle}}
    </div>
    <div class="checkps">
      <div
        v-for="(item,index) in votenumberArr"
        :key="index"
        @click="voteclick(item)"
        @mouseenter="changeState(index)"
        @mouseleave="leaveState(item)"
      >
        <img :src="item.photo" alt srcset v-if="item.photo" />
        <img src="../../common/images/toux.png" alt srcset v-else />
        <div v-if="item.id==investedArr[0] ||item.id==investedArr[1] ||item.id==investedArr[2]">已投</div>
        <div v-else>{{enterVote==index?'投他一票':item.name}}</div>
      </div>
    </div>
    <div class="limite">
      <p>每人限投{{xtNumber}}票</p>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
      style="display:block;text-align: center;margin-top: 20px"
    >
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click.native="surevote">确 定</el-button>
    </span>
    <!-- 投票结果 -->
    <voteAnswer v-show="votejg" @voteresult="voteresult" v-if="votejg" :voteRes="voteRes"></voteAnswer>
  </div>
</template>

<script>
import { listVote, saveresultVote } from '@/api/vote'
import { mapGetters, mapActions } from 'vuex'
import voteAnswer from '../vote/castvoteAns'

export default {
  props: ['voteStartData'],
  data() {
    return {
      votejg: false,
      votenumberArr: this.voteStartData.voteItemList,
      enterVote: '-1',
      investedArr: [],
      xtNumber: this.voteStartData.voteNum,
      voteRes: '',
      teachVoteTitle: ''
    }
  },
  components: {
    voteAnswer
  },
  mounted() {
    //   this.init()
    document.documentElement.style.overflowY = 'hidden'
    // 投票标题
    this.teachVoteTitle = this.voteStartData.title ? this.voteStartData.title : localStorage.getItem('voteTitle')
  },
  methods: {
    //   init() {
    //       listVote({
    //           classId: localStorage.getItem('classId')
    //       }).then(res => {
    //           console.log(res)
    //       })
    //   },
    changeState(index) {
      this.enterVote = index
    },
    leaveState(item) {
      this.enterVote = '-1'
    },
    voteclick(item) {
      if (this.investedArr.indexOf(item.id) > -1) {
        this.investedArr.splice(this.investedArr.indexOf(item.id), 1)
      } else {
        if (this.investedArr.length >= this.xtNumber) {
          this.$message({
            type: 'warning',
            message: '每人限投' + this.xtNumber + '票'
          })
        } else {
          this.investedArr.push(item.id)
        }
      }
    },
    surevote() {
      this.$confirm('确定投票吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          saveresultVote({
            voteId: this.voteStartData.id,
            creator: localStorage.getItem('userId'),
            ids: this.investedArr
          }).then(res => {
            if (res.code == 0) {
              this.votejg = true
              // 关闭投票页
              this.$emit('votehidden', '2')
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(() => {
        })
    },
    voteresult() {
      this.votejg = false
    },
    cancel() {
      this.$emit('votehidden', '1')
    }
  }
}
</script>

<style lang="scss" scoped>
  .voteContent{
    padding: 0 15px;
  }
  .limite {
    margin-bottom: 15px;
    p{
      float: right;
    }
  }
  .voteTitle{
    font-weight: 600;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
  }
  .checkps {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    text-align: center;
    max-height: 380px;
    overflow-y: auto;
    div {
      width: 16%;
      position: relative;
      border-radius: 5px;
      cursor: pointer;
      margin: 0 1%;
      img {
        width: 100%;
      }
      div {
        position: absolute;
        bottom: 12px;
        width: 98%;
        height: 30px;
        line-height: 30px;
        background: #e0e4e3;
      }
    }
    div:hover {
      div {
        background: rgb(54, 204, 169);
        color: white;
      }
    }
  }
</style>
