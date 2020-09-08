<template>
  <div class="AccountPeriod">
    <el-form class="el-form--label-left" ref="form">
      <el-form-item label="账期类型：" label-width="100px">
        <a @click="changeAction('AUTO')" :class="{'active':(active=='自动') }">
          <el-checkbox label="自动" @change="action(0)" v-model="auto"></el-checkbox>
        </a>
        <a @click="changeAction('MANU')" :class="{'active':(active=='手动') }">
          <el-checkbox label="手动" @change="action(1)" v-model="hand"></el-checkbox>
        </a>
      </el-form-item>
      <div v-if="Action=='自动'">
        <el-form-item label="选择年份：" label-width="90px" >
          <el-date-picker v-model="YearTime" :default-time="defaultTtime" type="year" placeholder="选择年份："  @change="selectTime" value-format="yyyy" format="yyyy"></el-date-picker>
        </el-form-item>
        <!-- 修改 -->
        <el-form-item label="已选择月份：" v-if="stepFlag=='2'">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item, index) in checkbox" :key="index" :label="item.MouthNum" @change="checkinlist" :disabled="(parseInt(YearTime + (item.MouthNum<10?'0'+item.MouthNum:item.MouthNum))) <= reviseArr[0]||(parseInt(YearTime + (item.MouthNum<10?'0'+item.MouthNum:item.MouthNum))) >= reviseArr[2]">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 添加步骤 -->
        <el-form-item label="已选择月份：" v-else>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item, index) in checkbox" :key="index" :label="item.MouthNum" @change="checkinlist" :disabled="(parseInt(YearTime + (item.MouthNum<10?'0'+item.MouthNum:item.MouthNum))) <= oldcheckList[oldcheckList.length-1]">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div v-if="Action=='手动'">手动</div>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import SelectResourceFile from './SelectResourceFile';
import { caseidListzq } from '@/api/step.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name:'AccountPeriod',
  components:{
    SelectResourceFile
  },
  computed: {
    ...mapGetters([
      'stepFlag'
    ])
  },
  created() {
    let that =this;
  },
  mounted(){
    let that =this;
    this.HasSetMonth();
  },
  data() {
    return {
      auto: true,
      hand: false,
      active:'自动',
      Action: '自动',
      show: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      checkList: [],
      oldcheckList: [],
      reviseArr:['000000','','999999'],
      checkbox: [
        {
          title: '1月',
          MouthNum:1,
          isMe:'0'
        },
        {
          title: '2月',
          MouthNum:2,
          isMe:'0'
        },
        {
          title: '3月',
          MouthNum:3,
          isMe:'0'
        },
        {
          title: '4月',
          MouthNum:4,
          isMe:'0'
        },
        {
          title: '5月',
          MouthNum:5,
          isMe:'0'
        },
        {
          title: '6月',
          MouthNum:6,
          isMe:'0'
        },
        {
          title: '7月',
          MouthNum:7,
          isMe:'0'
        },
        {
          title: '8月',
          MouthNum:8,
          isMe:'0'
        },
        {
          title: '9月',
          MouthNum:9,
          isMe:'0'
        },
        {
          title: '10月',
          MouthNum:10,
          isMe:'0'
        },
        {
          title: '11月',
          MouthNum:11,
          isMe:'0'
        },
        {
          title: '12月',
          MouthNum:12,
          isMe:'0'
        }
      ],
      file: '1.xls',
      MouthcaseId:{
        caseId:""
      },
      bjNewArr:[],
      YearTime:"",
      defaultTtime:"",
      mouthFlag:"",
      hqsy:0
    };
  },
  methods: {
    choice () {
      let _this = this
      _this.show = true
    },
    closeChoiceFile () {
      let _this = this
      _this.show = false
    },
    changeAction (val) {
      let that =this;
      this.$store.commit('STEP_tallyMonthType',val)
    },
    selectTime(val){
      // 显示年份 
      let that =this;
      // 清空月份选择
      that.checkList = []
      that.oldcheckList = []
      this.mouthFlag = ''
      // 根据年份 显示对应的月份
      that.bjNewArr.forEach(item=>{
        if (item.year == that.YearTime) {
          that.checkList.push(parseInt(item.month))
          that.oldcheckList.push(parseInt(item.year + item.month))
        }
      })
      that.YearTime = val;
      // 更新年份
      this.$store.commit('STEP_tallyYear',val)
      // 如果所选年份跟修改年份不一致 清空月份 反之月份保持一致
      if (this.reviseArr[1].toString().substring(0,4) == this.YearTime) {
        // 更新月份为当前修改月份
        this.$store.commit('STEP_tallyMonth',this.reviseArr[1].toString().substring(4,6))
      } else {
        // 月份清空
        this.$store.commit('STEP_tallyMonth','')
      }
    },
    action (type) {
      if (type === 0) {
        this.hand = false
      } else {
        this.auto = false
      }
    },
    checkinlist(){
      let that = this;
      if (!this.YearTime) {
        that.$message({
          type:"warning",
          message:"请选择年份！"
        })
        that.checkList = []
        return false
      }
      if (this.stepFlag=='2') {
        // 修改步骤
        let mouthTwo = parseInt(that.checkList[this.checkList.length-1])<10?('0'+that.checkList[this.checkList.length-1]):that.checkList[this.checkList.length-1];
        let arrindex = parseInt(this.reviseArr[1].toString().substring(4,6))
        if (that.reviseArr[0]=='000000') {
          // 只有一个月份的时候
          that.checkList[0]=that.checkList[1]?that.checkList[1]:that.checkList[0]
          that.checkList.splice(1,1)
        }else{
          if (this.mouthFlag != 1) {
            let checkIndex = that.checkList.indexOf(arrindex)
            if (checkIndex == '-1') {
              // 数组添加
              that.hqsy = that.checkList.length-1
            } else {
              // 获取索引并保存
              that.hqsy = checkIndex
              that.checkList[checkIndex] = that.checkList[this.checkList.length-1]
              that.checkList.splice(that.checkList.length-1,1)
            }
          }else{
            that.checkList[that.hqsy] = that.checkList[this.checkList.length-1]
            that.checkList.splice(that.checkList.length-1,1)
          }
        }
        // 更新  月份
        this.$store.commit('STEP_tallyMonth',mouthTwo)
      } else {
        // 添加步骤
        if (this.checkList.length == 1) {
          let mouthOne = parseInt(that.checkList[this.oldcheckList.length])<10?('0'+that.checkList[this.oldcheckList.length]):that.checkList[this.oldcheckList.length];
          // 更新  月份
          this.$store.commit('STEP_tallyMonth',mouthOne)
        } else {
          let mouthTwo = parseInt(that.checkList[this.checkList.length -1])<10?('0'+that.checkList[this.checkList.length-1]):that.checkList[this.checkList.length-1];
          that.checkList[this.checkList.length-2] = that.checkList[this.checkList.length-1]
          that.checkList.splice(this.checkList.length-1,1)
          // 更新  月份
          this.$store.commit('STEP_tallyMonth',mouthTwo)
        }
      }
      // 进入之后只能选择一个月份标识
      this.mouthFlag = 1
    },
    async HasSetMonth(){
      let that = this;
      let bzID = this.stepFlag=='2'?localStorage.getItem('bzIdFrour'):''
      caseidListzq({
        caseId:localStorage.getItem('caseId'),
        caseStepId:bzID
      }).then(res=>{
        if (res.code=='0') {
            // 显示年份
            that.YearTime = res.result.year?res.result.year:'2020'
            // 更新年份
            this.$store.commit('STEP_tallyYear',that.YearTime)
            // 显示做过账目的月份
            let isMouth = {}
            // 新建一个对比数组
            that.bjNewArr = res.result.monthList
            res.result.monthList.forEach(item=>{
              if (item.year == that.YearTime) {
                that.checkList.push(parseInt(item.month))
              }
              that.oldcheckList.push(parseInt(item.year + item.month))
              if (item.isMe == 1) {
                isMouth = item
              }
            })
            // 日期对比数据
            let xgDataIndex = that.oldcheckList.indexOf(parseInt(isMouth.year + isMouth.month))
            that.reviseArr[0] = that.oldcheckList[xgDataIndex-1]?that.oldcheckList[xgDataIndex-1]:'000000'
            that.reviseArr[1] = that.oldcheckList[xgDataIndex]?that.oldcheckList[xgDataIndex]:''
            that.reviseArr[2] = that.oldcheckList[xgDataIndex+1]?that.oldcheckList[xgDataIndex+1]:'999999'
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.AccountPeriod {
  .el-form-item a{
    margin-right: 27px;
  }
  .el-checkbox-group {
    padding-left: 85px;
    .el-checkbox {
      margin-right: 27px;
    }
  }
  .task-file {
    a {
      color: #67c3d1;
      &:hover {
        color: #4b9098;
      }
      &:hover:after {
        content: none;
      }
    }
    .choice {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .show {
    display: block;
  }
}
</style>
