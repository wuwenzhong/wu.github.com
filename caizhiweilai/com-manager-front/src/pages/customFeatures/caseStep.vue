<template>
  <div class="stepWraper">
    <div class="goAccountList" @click="goAccountList">
      <i class="el-icon-caret-left"></i>
      <span>返回账套列表</span>
      <span class="casetitle">（案例名称：{{caseName}}）</span>
    </div>
    <div class="content">
      <el-button type="info" size="small" @click="AddTo" class="addstep" style="background-color: #414d65;border-color: #414d65;margin-top: 20px;">添加步骤</el-button>
      <div class="Allsteps">
        <div class="step" v-for="(item,index) in stepshows" :key="index">
          <div v-if="item.stepType==1" class="everystep">
            <div @mouseover="mouseover(item,1)" @mouseleave="mouseleave(1)">
              <input type="button" value="开始" />
              <div v-show="revisedel1" class="revdel">
                <div @click="delid(item)" v-show="item.createTime==delsteplasttime">删除</div>
              </div>
            </div>
            <img src="./images/dashes.png" alt class />
          </div>
          <div v-if="item.stepType==2" class="everystep">
            <div @mouseover="mouseover(item,2)" @mouseleave="mouseleave(2)">
              <input type="button" value="企业信息" />
              <div v-show="revisedel2" class="revdel">
                <div @click="revise">修改</div>
                <div @click="delid(item)" v-show="item.createTime==delsteplasttime">删除</div>
              </div>
            </div>
            <img src="./images/dashes.png" alt class />
          </div>
          <div v-if="item.stepType==3" class="everystep">
            <div @mouseover="mouseover(item,3)" @mouseleave="mouseleave(3)">
              <input type="button" :value="'账期：'+item.clue" />
              <div v-show="revisedel3==item.id" class="revdel">
                <div @click="revise">修改</div>
                <div @click="delid(item)" v-show="item.createTime==delsteplasttime">删除</div>
              </div>
            </div>
            <img src="./images/dashes.png" alt class />
          </div>
          <div v-if="item.stepType==4" class="everystep">
            <div @mouseover="mouseover(item,4)" @mouseleave="mouseleave(4)">
              <input type="button" :value="item.clue" />
              <div v-show="revisedel4==item.id" class="revdel">
                <div @click="revise">修改</div>
                <div @click="delid(item)" v-show="item.createTime==delsteplasttime">删除</div>
              </div>
            </div>
            <img src="./images/dashes.png" alt class />
          </div>
          <div v-if="item.stepType==5" class="everystep">
            <div @mouseover="mouseover(item,5)" @mouseleave="mouseleave(5)">
              <input type="button" value="结束" />
              <div v-show="revisedel5" class="revdel">
                <div @click="delid(item)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加步骤  -->
    <el-dialog :title="stepname?'添加步骤':'修改步骤'" width="40%" :visible.sync="closeAddStepshow" :close-on-click-modal="false">
      <addStep :AddStep="'添加步骤'"  @close="closeAddStep" v-if="closeAddStepshow" ref="productImage"></addStep>
    </el-dialog>
  </div>
</template>
<script>
/* 添加步骤 */
import addStep from './addStep.vue'
import { caseidList, delStep } from '@/api/step.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    addStep
  },
  computed: {
    ...mapGetters([
      'stepType'
    ])
  },
  data() {
    return {
      closeAddStepshow: false,
      stepname: '',
      stepshows: [],
      revisedel1: false,
      revisedel2: false,
      revisedel3: '',
      revisedel4: '',
      revisedel5: false,
      delsteplasttime: '',
      isstepfive: '',
      caseName: ''
    }
  },
  mounted() {
    // 点击案例步骤
    this.caseName = localStorage.getItem('caseName')
    this.init()
  },
  methods: {
    init() {
      caseidList({
        caseId: localStorage.getItem('caseId')
      }).then(res => {
        if (res.code == '0') {
          this.stepshows = res.result
          // 判断是否有结束节点
          res.result.forEach(item => {
            if (item.stepType == 5) {
              this.isstepfive = 1
            } else {
              this.isstepfive = ''
            }
          })
          if (res.result.length != 0) {
            this.delsteplasttime = res.result[res.result.length - 1].createTime
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    goAccountList() {
      this.$emit('goAccountList')
    },
    closeAddStep(val) {
      if (val == 'lastone') {
        this.init()
        this.closeAddStepshow = false
      } else if (val == '更新步骤') {
        this.init()
      } else {
        this.closeAddStepshow = false
      }
    },
    AddTo() {
      if (this.isstepfive == 1) {
        this.$message({
          type: 'warning',
          message: '已存在结束节点！'
        })
      } else {
        // 更改步骤标识
        this.$store.commit('STEP_stepFlag', '1')
        // 步骤id置空
        this.$store.commit('STEP_stepIdFlag', '')
        // 第四步内容全部置空
        this.$store.commit('STEP_nodeId', '')
        this.$store.commit('STEP_nodeIdName', '')
        this.$store.commit('STEP_posId', '')
        this.$store.commit('STEP_posIdName', '')
        this.$store.commit('STEP_preStepIds', '')
        this.$store.commit('STEP_preStepIdsName', '')
        this.$store.commit('STEP_relRes', '')
        this.$store.commit('STEP_relResName', '')
        this.$store.commit('STEP_description', '')
        this.closeAddStepshow = true
      }
    },
    mouseover: function(stepid, clicknumber) {
      const that = this
      if (clicknumber == 1) {
        that.revisedel1 = true
      } else if (clicknumber == 2) {
        that.revisedel2 = stepid.id
      } else if (clicknumber == 3) {
        that.revisedel3 = stepid.id
      } else if (clicknumber == 4) {
        that.revisedel4 = stepid.id
      } else if (clicknumber == 5) {
        that.revisedel5 = true
      }
      that.certainid = stepid.id
      that.clicknumber = clicknumber
    },
    mouseleave: function(clicknumber) {
      const that = this
      if (clicknumber == 1) {
        that.revisedel1 = false
      } else if (clicknumber == 2) {
        that.revisedel2 = false
      } else if (clicknumber == 3) {
        that.revisedel3 = ''
      } else if (clicknumber == 4) {
        that.revisedel4 = ''
      } else if (clicknumber == 5) {
        that.revisedel5 = false
      }
    },
    revise: function() {
      // 更改步骤标识
      this.$store.commit('STEP_stepFlag', '2')
      // 修改
      const that = this
      that.stepname = false
      that.closeAddStepshow = true
      that.$nextTick(() => {
        that.$refs.productImage.getSrcList(that.certainid, that.clicknumber)
        // 更新步骤id
        this.$store.commit('STEP_stepIdFlag', that.certainid)
      })
    },
    delid: function(itemid) {
      // 设置从后往前删除设定
      const that = this
      if (itemid.createTime != that.delsteplasttime) {
        that.$message({
          type: 'warning',
          message: '此节点不允许删除！'
        })
        return false
      }
      this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
       delStep({
        id: itemid.id
       }).then(res => {
         if (res.code == '0') {
           this.$message({
             type: 'success',
             message: '删除成功！'
           })
          //  刷新
          this.init()
         } else {
           this.$message({
             type: 'warning',
             message: res.message
           })
         }
       })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.goAccountList {
  margin-top: 20px;
  cursor: pointer;
  .casetitle{
    margin-left: 10px;
  }
}
.Allsteps{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.step{
  margin: 15px 0;
}
.everystep{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    .revdel{
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: 80px;
    }
    input{
      border: 1px dashed #cdcdcd;
      background: #fff;
      padding: 10px;
      color: #a6b0bc;
      font-size: 16px;
      cursor: pointer;
    }
}
</style>