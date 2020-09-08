<template>
  <div>
    <el-form :model="form">
      <el-form-item label="题号：" :label-width="formLabelWidth">
        <el-input v-model="form.questionNo" autocomplete="off" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="题目类型：" :label-width="formLabelWidth">
        <el-radio-group v-model="form.questionType" @change="topicType">
          <el-radio :label="0">单选题</el-radio>
          <el-radio :label="1">多选题</el-radio>
          <el-radio :label="2">判断题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题干内容：" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          placeholder="请输入题干内容"
          v-model="form.questionContent"
          maxlength="300"
          show-word-limit
          autocomplete="on"
          :autosize="{ minRows: 4}"
        ></el-input>
      </el-form-item>
      <el-form-item label="答案解析：" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          placeholder="请输入答案解析"
          v-model="form.answerAnalysis"
          maxlength="300"
          show-word-limit
          autocomplete="on"
          :autosize="{ minRows: 4}"
        ></el-input>
      </el-form-item>
      <!-- <div class="tjxx" @click="addDomain">添加选项</div> -->
      <el-button type="primary" @click="addDomain" class="tjxx" style="border: 1px solid #3271FF;">添加选项</el-button>
      <el-form-item
        v-for="(domain, index) in form.domains"
        :label="'选项' + String.fromCharCode(64 + parseInt((index + 1)))"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{required: true, message: '选项内容不能为空', trigger: 'blur'}"
        :label-width="formLabelWidth"
      >
        <el-input v-model="domain.value"></el-input>
        <el-button @click.prevent="removeDomain(domain)" class="delxuanx">删除</el-button>
      </el-form-item>
      <!-- 单选 -->
      <el-form-item label="正确答案：" :label-width="formLabelWidth" v-show="this.form.questionType == 0">
        <el-select v-model="form.dxanswerList" placeholder="请选择正确答案" @change="tastType">
          <el-option :label="'选项' + String.fromCharCode(64 + parseInt((index + 1)))" :value="index" v-for="(item,index) in this.form.domains" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!-- 多选 -->
      <el-form-item label="正确答案：" :label-width="formLabelWidth" v-show="this.form.questionType == 1">
        <el-select v-model="form.moreanswerList" placeholder="请选择正确答案" @change="tastType" multiple>
          <el-option :label="'选项' + String.fromCharCode(64 + parseInt((index + 1)))" :value="index" v-for="(item,index) in this.form.domains" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!-- 判断提 -->
      <el-form-item label="正确答案：" :label-width="formLabelWidth" v-show="this.form.questionType == 2">
        <el-select v-model="form.pdanswerList" placeholder="请选择正确答案" @change="tastType">
          <el-option label="正确" value="0" ></el-option>
          <el-option label="错误" value="1" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应能力性：" :label-width="formLabelWidth">
        <div style="display: flex;">
          <el-select v-model="form.firstAbilityId" placeholder="请选择一级能力性" @change="first">
            <el-option :label="item.capabilityName" :value="item.id" v-for="(item,index) in yjnlxArr" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.secondAbilityId" placeholder="请选择二级能力性" @change="second">
            <el-option :label="item.capabilityName" :value="item.id" v-for="(item,index) in ejnlxArr" :key="index"></el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      style="display:block;text-align: center;margin-top:15px"
    >
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="define" style="border: 1px solid #3271FF;">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { topicList, questionBank, AbilityId, topicXztm } from './../../../api/questionBank.js'
export default {
  data() {
    return {
      form: {
        questionNo: '',
        questionType: 0,
        questionContent: '',
        dxanswerList: '',
        moreanswerList: [],
        pdanswerList: '',
        domains: [
          {
            value: ''
          },
          {
            value: ''
          }
        ],
        answerList: '',
        firstAbilityId: '',
        secondAbilityId: ''
      },
      formLabelWidth: '100px',
      yjnlxArr: [],
      ejnlxArr: [],
      optionListArr: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 请求题号
      questionBank({
        entityName: 'question',
        length: '5'
      }).then(res => {
          if (res.code == 0) {
              this.form.questionNo = res.result
             // 一级能力性
             AbilityId({ capabilityId: null }).then(res => {
                 this.yjnlxArr = res.result
             })
          } else {
              this.$message({
                  type: 'warning',
                  message: res.message
              })
          }
      })
    },
    topicType(val) {
      console.log('题目类型' + val)
      this.form.questionType = val
    },
    addDomain() {
      if (this.form.domains.length >= 6) {
        this.$message({
          type: 'warning',
          message: '选项不能大于六个哦~'
        })
      } else {
        this.form.domains.push({
          value: ''
        })
      }
    },
    removeDomain(item) {
      if (this.form.domains.length <= 2) {
        this.$message({
          type: 'warning',
          message: '选项不能少于两个哦~'
        })
        return false
      }
      var index = this.form.domains.indexOf(item)
      if (index !== -1) {
        this.form.domains.splice(index, 1)
      }
    },
    tastType(val) {
      console.log('下拉框选择的是：' + val)
      // 传正确答案的索引
      this.form.answerList = val
    },
    close() {
      // 取消
      this.$emit('xzTopic')
    },
    define() {
      // 确定
      // 选项数组
      for (let index = 0; index < this.form.domains.length; index++) {
        this.optionListArr.push(this.form.domains[index].value)
      }
      const answerListArr = []
      // 根据题目类型来判断正确答案索引
      if (this.form.questionType == 1) {
        for (let index = 0; index < this.form.answerList.length; index++) {
          answerListArr.push(String(this.form.answerList[index]))
        }
      } else {
        answerListArr.push(String(this.form.answerList))
      }
      topicXztm({
        questionNo: this.form.questionNo,
        questionType: this.form.questionType,
        questionContent: this.form.questionContent,
        answerAnalysis: this.form.answerAnalysis,
        optionList: this.optionListArr,
        answerList: answerListArr,
        firstCapabilityId: this.form.firstAbilityId,
        secondCapabilityId: this.form.secondAbilityId
      }).then(res => {
        if (res.code == 0) {
          this.$emit('xzTopic')
          this.$message({
            type: 'success',
            message: res.message
          })
        } else {
          this.optionListArr = []
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    first(val) {
      this.form.secondAbilityId = ''
      this.form.firstAbilityId = val
      // 一级能力性的id 获取二级能力性
      AbilityId({ capabilityId: val }).then(res => {
        this.$nextTick(function() {
          this.ejnlxArr = res.result
        })
      })
    },
    second(val) {
      // 选择的二级能力性
      console.log(val)
      this.form.secondAbilityId = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item__content{
  display: flex;
}
.el-input {
  width: 60%;
}
.el-select{
  margin-right: 15px;
}
.tjxx {
  margin-bottom: 10px;
}
.zcda {
  display: flex;
  align-items: center;
  div {
    width: 80px;
    height: 30px;
    background: rgba(65, 214, 107, 1);
    border-radius: 2px;
    text-align: center;
    line-height: 30px;
    color: white;
  }
  span {
    width: 18px;
    height: 18px;
    background: rgba(180, 197, 230, 1);
    border-radius: 2px;
    line-height: 18px;
    text-align: center;
    margin-left: 20px;
  }
}
.jx {
  display: flex;
  align-items: center;
  margin-top: 15px;
  div {
    width: 80px;
    height: 30px;
    background: rgba(79, 185, 255, 1);
    border-radius: 2px;
    text-align: center;
    line-height: 30px;
    color: white;
  }
  span {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(95, 98, 102, 1);
    line-height: 20px;
  }
}
</style>