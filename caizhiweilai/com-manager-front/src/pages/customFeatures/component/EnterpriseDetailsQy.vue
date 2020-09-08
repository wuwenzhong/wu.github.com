<template>
  <el-form :model="form" class="el-form--label-left" label-width="120px" :rules="rules">
    <el-form-item label="企业名称：" prop="orgName">
      <el-select v-model="form.orgName" filterable placeholder="请选择企业名称" @change="corporate">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { infoAll, caseidListzq } from '@/api/step.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'EnterpriseDetails',
  data() {
    return {
      options: [],
      form: {
        orgName: ''
      },
      // 表单验证
      rules: {
        orgName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ]
      },
      kjoptions: []
    }
  },
  created() {

  },
  computed: {
    ...mapGetters([
      'companyId'
    ])
  },
  mounted() {
    const that = this
    // 企业信息
    infoAll().then(res => {
      if (res.code == '0') {
        this.options = res.result
        // 企业信息反显
        caseidListzq({
            caseId: localStorage.getItem('caseId'),
            caseStepId: localStorage.getItem('bzIdFrour')
          }).then(res => {
            if (res.code == '0') {
              if (res.result.companyId == '') {
                this.form.orgName = this.options[0].id
                // 默认企业id
                this.$store.commit('STEP_companyId', this.options[0].id)
              } else {
                this.form.orgName = res.result.companyId
              }
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        this.$nextTick(function() {
          this.form.orgName = this.companyId
        })
      } else {
        this.$message({
          type: 'warning',
          message: res.message
        })
      }
    })
  },
  methods: {
    corporate(val) {
      // 企业id
      this.$store.commit('STEP_companyId', val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
