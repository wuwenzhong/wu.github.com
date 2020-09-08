<template>
  <div>
    <el-form :model="form">
      <el-form-item label="题号：" :label-width="formLabelWidth">
        <el-input v-model="form.questionNo" autocomplete="off" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="题目类型：" :label-width="formLabelWidth">
        <el-radio-group v-model="form.questionType" @change="topicType">
          <el-radio :label="0" :disabled="flagTm">单选题</el-radio>
          <el-radio :label="1" :disabled="flagTm">多选题</el-radio>
          <el-radio :label="2" :disabled="flagTm">判断题</el-radio>
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
      <el-button :type="flagTm?'info':'primary'" @click="addDomain" :disabled="flagTm" class="tjxx">添加选项</el-button>
      <el-form-item
        v-for="(domain, index) in form.domains"
        :label="'选项' + String.fromCharCode(64 + parseInt((index + 1)))"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{required: true, message: '选项内容不能为空', trigger: 'blur'}"
        :label-width="formLabelWidth"
      >
        <el-input v-model="domain.value.optionContent"></el-input>
        <!-- <el-button @click.prevent="removeDomain(domain)" class="delxuanx">删除</el-button> -->
      </el-form-item>
      <!-- 单选 -->
      <el-form-item label="正确答案：" :label-width="formLabelWidth" v-show="this.form.questionType == 0">
        <el-select v-model="form.dxanswerList" placeholder="请选择正确答案" @change="tastType" :disabled="flagTm">
          <el-option :label="'选项' + String.fromCharCode(64 + parseInt((index + 1)))" :value="index" v-for="(item,index) in this.form.zqDomains" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!-- 多选 -->
      <el-form-item label="正确答案：" :label-width="formLabelWidth" v-show="this.form.questionType == 1">
        <el-select v-model="form.moreanswerList" placeholder="请选择正确答案" @change="tastType" multiple :disabled="flagTm">
          <el-option :label="'选项' + String.fromCharCode(64 + parseInt((index + 1)))" :value="index" v-for="(item,index) in this.form.zqDomains" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!-- 判断提 -->
      <el-form-item label="正确答案：" :label-width="formLabelWidth" v-show="this.form.questionType == 2">
        <el-select v-model="form.pdanswerList" placeholder="请选择正确答案" @change="tastType" :disabled="flagTm">
          <el-option label="正确" value="0" ></el-option>
          <el-option label="错误" value="1" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应能力性：" :label-width="formLabelWidth">
        <div style="display: flex;">
          <el-select v-model="form.firstAbilityId" placeholder="请选择一级能力项" @change="first" :disabled="flagTm">
            <el-option :label="item.capabilityName" :value="item.id" v-for="(item,index) in yjnlxArr" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.secondAbilityId" placeholder="请选择二级能力项" @change="second" :disabled="flagTm">
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
import { topicList, AbilityId, topicXztm, editQuestion } from './../../../api/questionBank.js'
export default {
  props: ['bjObject'],
  data() {
    return {
      form: {
        questionNo: '',
        questionType: 0,
        questionContent: '',
        dxanswerList: '',
        moreanswerList: [],
        pdanswerList: '',
        domains: [],
        zqDomains: [],
        answerList: '',
        firstAbilityId: '',
        secondAbilityId: '',
        answerAnalysis: ''
      },
      formLabelWidth: '100px',
      yjnlxArr: [],
      ejnlxArr: [],
      optionListArr: [],
      biaoshi: '',
      zqdabs: '',
      daArr: [],
      flagTm: false
    }
  },
  mounted() {
    this.init()
    // =========回显数据=====
    console.log(this.bjObject)
    // 判断该题是否被绑定
    this.flagTm = this.bjObject.flag
    console.log(this.flagTm)
    this.form.questionNo = this.bjObject.questionNo
    this.form.questionType = this.bjObject.questionType
    this.form.questionContent = this.bjObject.questionContent
    this.form.answerAnalysis = this.bjObject.answerAnalysis
    // 正确答案
    console.log(this.bjObject.answerList)
    for (let index = 0; index < this.bjObject.questionOptionDTOList.length; index++) {
      this.form.zqDomains.push({ value: this.bjObject.answerList[index] })
    }
    // 所有选项
    for (let index = 0; index < this.bjObject.questionOptionDTOList.length; index++) {
      this.form.domains.push({ value: this.bjObject.questionOptionDTOList[index] })
    }
    if (this.form.questionType == 0) {
      this.form.dxanswerList = '选项' + this.bjObject.answer
    } else if (this.form.questionType == 1) {
      // 正确答案数组
      // console.log(zqdaArr)
      for (let index = 0; index < this.bjObject.answerIndexList.length; index++) {
        this.form.moreanswerList.push(parseInt(this.bjObject.answerIndexList[index]))
      }
    } else {
      this.form.pdanswerList = this.bjObject.answer == 'A' ? '正确' : '错误'
    }
    // 答案
    this.daArr = this.bjObject.answerIndexList
  },
  methods: {
    init() {
      // 一级能力性
      AbilityId({ capabilityId: null }).then(res => {
          this.yjnlxArr = res.result
          // 一级能力性
          this.form.firstAbilityId = this.bjObject.firstCapabilityId
          // 获取二级能力性列表
          this.first(this.bjObject.firstCapabilityId, 1)
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
    // removeDomain(item) {
    //   if (this.form.domains.length <= 2) {
    //     this.$message({
    //       type: 'warning',
    //       message: '选项不能少于两个哦~'
    //     })
    //     return false
    //   }
    //   var index = this.form.domains.indexOf(item)
    //   if (index !== -1) {
    //     this.form.domains.splice(index, 1)
    //   }
    // },
    tastType(val) {
      console.log('下拉框选择的是：' + val)
      // 正确答案标识
      this.zqdabs = 2
      // 传正确答案的索引
      this.form.answerList = val
    },
    close() {
      // 取消
      this.$emit('bjTopic')
    },
    define() {
      // 选项数组
      this.optionListArr = []
      for (let index = 0; index < this.form.domains.length; index++) {
        this.optionListArr.push(this.form.domains[index].value.optionContent)
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
      editQuestion({
        questionNo: String(this.form.questionNo),
        questionType: String(this.form.questionType),
        questionContent: this.form.questionContent,
        answerAnalysis: this.form.answerAnalysis,
        optionList: this.optionListArr,
        answerList: this.zqdabs == 2 ? answerListArr : this.daArr,
        firstCapabilityId: (this.biaoshi == 2) ? this.form.firstAbilityId : this.bjObject.firstCapabilityId,
        secondCapabilityId: (this.biaoshi == 2) ? this.form.secondAbilityId : this.bjObject.secondCapabilityId,
        id: this.bjObject.id
      }).then(res => {
        if (res.code == 0) {
          this.$emit('bjTopic')
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    first(val, number) {
      this.form.firstAbilityId = val
      this.biaoshi = 2
      // 一级能力性的id 获取二级能力性
      AbilityId({ capabilityId: val }).then(res => {
        // console.log(res)
        this.ejnlxArr = res.result
        if (number == 1) {
          this.form.secondAbilityId = this.bjObject.secondCapabilityId
        } else {
          this.form.secondAbilityId = ''
        }
      })
    },
    second(val) {
      // 选择的二级能力性
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