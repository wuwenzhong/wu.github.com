<template>
  <div>
    <el-form :rules="rules" ref="form" class="demo-ruleForm" :label-width="formLabelWidth">
      <el-form-item label="选择节点：" prop="JDvalue">
        <el-select v-model="form.JDvalue" size="medium" @change="Invoice" filterable style="margin-left: -120px;width:380px">
          <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.nodeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联岗位：" prop="CNvalue">
        <el-select v-model="form.CNvalue" size="medium" @change="Cashier" style="margin-left: -120px;width:380px">
          <el-option v-for="item in CNoptions" :key="item.id" :value="item.id" :label="item.posName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择资源文件：">
        <div class="task-file" style="margin-left: -120px;width:380px;position: relative;">
          <p v-for="(item,index) in file" :key="index" style="margin:0px;line-height: 40px;">
            {{item}}
            <span class="wjspan">
              <i class="el-icon-delete" @click="deleteicon(item)"></i>
            </span>
          </p>
          <span class="choice" style="position: absolute;right: 0;top:0px">
            <el-link size="medium" @click="choiceDialog">选择</el-link>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="设置前置任务：">
        <div class="task-file" style="margin-left: -120px;width:380px;position: relative;">
          <p v-for="(item,index) in task" :key="index" style="margin:0px;line-height: 40px;">
            {{item}}
            <span @click="qzrwdeleteicon(item)" class="wjspan">
              <i class="el-icon-delete"></i>
            </span>
          </p>
          <span class="choice" style="position: absolute;right: 0;top:0px;">
            <el-link size="medium" @click="preTaskDialog">选择</el-link>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="详情描述：" prop="desc" size="medium">
        <el-input type="textarea" rows="6" v-model="form.desc" @change="changeinpt" maxlength="200" show-word-limit style="margin-left: -120px;width:380px"></el-input>
      </el-form-item>
    </el-form>
    <!-- 选择资源文件  -->
    <el-dialog title="选择资源文件" width="40%" :visible.sync="show" append-to-body :close-on-click-modal="false">
      <SelectResourceFile :SelectResourceFile="file" @close="closeChoiceFile"></SelectResourceFile>
    </el-dialog>
    <!-- 设置前置任务 -->
    <el-dialog title="设置前置任务" width="40%" :visible.sync="PreTaskShow" append-to-body :close-on-click-modal="false">
      <PreTask :PreTask="'设置前置任务'" @qzrwclose="closePreTask"></PreTask>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { nodelist,listByAppId } from '@/api/step.js'
/* 选择资源文件 */
import SelectResourceFile from "./SelectResourceFile.vue";
/* 设置前置任务 */
import PreTask from "./PreTask.vue";
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "AssociatedNode",
  components: {
    SelectResourceFile,
    PreTask
  },
  data() {
    return {
      formLabelWidth:'120px',
      show: false,
      PreTaskShow: false,
      form: {
        JDvalue:'',
        CNvalue:'',
        desc: "",
      },
      file: [],
      task: [],
      newtask: [],
      options: [],
      CNoptions: [],
      CashierFrom: { appId: "6" },
      zywjfile: [],
      qzrwfile: [],
      newfile: [],
      newzywjfile: [],
      // 表单验证
      rules: {
          JDvalue: [
            { required: true, message: "请选择节点", trigger: "blur" }
          ],
          CNvalue: [
            { required: true, message: "请选择关联岗位", trigger: "blur" }
          ],
      }
    };
  },
  created() {},
  mounted() {
    // ============反显内容================
    this.init()
    this.AccountNode();
    // 关联岗位
    this.CashierF();
  },
  //利用计算属性
  computed: {
    ...mapGetters([
      'nodeIdName',
      'posIdName',
      'relResName',
      'preStepIdsName',
      'description',
      'relRes',
      'preStepIds',
      'nodeId',
      'posId'
    ])
  },
  methods: {
    init(){
      if (this.nodeIdName!='') {
        // 选择节点
        let ms = this.description
        this.form.JDvalue = this.nodeId
        // 关联岗位
        this.form.CNvalue = this.posId
        // 选择资源文件
        this.file = this.relResName?this.relResName:[]
        // 选择资源文件ids
        this.zywjfile = this.relRes?this.relRes.split(','):[]
        // 设置前置任务
        this.task = this.preStepIdsName?this.preStepIdsName:[]
        // 设置前置任务ids
        this.qzrwfile = this.preStepIds.split(',')
        // 描述
        this.form.desc = this.description
      }
    },
    // 删除资源文件文件名称
    deleteicon(filename) {
      let that = this;
      that.file.forEach((item,index) => {
        if (item == filename) {
          that.file.splice(index, 1);
          that.zywjfile.splice(index,1)
          this.$store.commit("STEP_relRes", that.zywjfile.join());
        }
      });
    },
    // 删除设置前置任务文件名称
    qzrwdeleteicon(filename) {
      let that = this;
      that.task.forEach((item,index) => {
        if (item == filename) {
          that.task.splice(index, 1);
          that.qzrwfile.splice(index,1)
          // 前置任务 字符串
          this.$store.commit('STEP_preStepIds',that.qzrwfile.join())
        }
      });
    },
    changeinpt: function(val) {
      // store.commit("descriptionMove", val);
    },
    choiceDialog() {
      this.show = true;
    },
    closeChoiceFile(data) {
      let that = this;
      if (data) {
        data.forEach(item => {
          that.file.push(item.resName);
          that.zywjfile.push(item.resId);
        });
        // file数组去重
        that.file.map(train => {
          that.newfile.push(train);
        });
        that.newfile = [...new Set(that.newfile)];
        that.file = that.newfile;
        // zywjfile数组去重 newzywjfile
        that.zywjfile.map(train => {
          that.newzywjfile.push(train);
        });
        that.newzywjfile = [...new Set(that.newzywjfile)];
        that.zywjfile = that.newzywjfile;
        let stringarr = that.zywjfile.join(",");
        // 更新账套资源
        this.$store.commit("STEP_relRes", stringarr);
      }else{
        this.$store.commit("STEP_relRes", '');
      }
      that.show = false;
    },
    // json数组去重
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
    },
    preTaskDialog() {
      this.PreTaskShow = true;
    },
    closePreTask(data) {
      let that = this;
      if (data) {
        data.forEach(item => {
          that.task.push(item.nodeName);
          that.qzrwfile.push(item.id);
        });
        //task数组去重
        that.task.map(train => {
          that.newtask.push(train);
        });
        that.newtask = [...new Set(that.newtask)];
        that.task = that.newtask;
        let preArr = that.qzrwfile.join(",");
        // 前置任务 字符串
        this.$store.commit('STEP_preStepIds',preArr)
      } else {
        // 前置任务 字符串
        this.$store.commit('STEP_preStepIds','')
      }
      this.PreTaskShow = false;
    },
    Invoice(listId) {
      let that = this;
      // 根据id找出 标题和描述
      for (let index = 0; index < this.options.length; index++) {
        if (this.options[index].id == listId) {
          // 选择节点
          that.form.desc = this.options[index].description;
          // 更新节点id
          this.$store.commit('STEP_nodeId',this.options[index].id)
          // 更新描述
          this.$store.commit('STEP_description',this.options[index].description)
        }
      }
    },
    Cashier(gwId) {
      // 关联岗位
      for (let index = 0; index < this.CNoptions.length; index++) {
        if (this.CNoptions[index].id == gwId) {
          // 更新关联岗位id
          this.$store.commit('STEP_posId',this.CNoptions[index].id)
        }
      }
    },
    async AccountNode() {
      let that = this;
      const res = await nodelist({ page: "1", size: "999" });
      if (res.code == 0) {
        that.options = res.result;
      } else {
        that.$message({
          type: "error",
          message: res.data.message
        });
      }
    },
    CashierF() {
      let that = this;
      listByAppId({appId:'1'}).then(res=>{
        if (res.code == '0') {
          that.CNoptions = res.result;
        } else {
          that.$message({
            type: "error",
            message: res.message
          });
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    display: flex;
    margin-bottom: 15px;
    >>> .el-form-item__content {
      margin-left: 10px;
      width: 330px;
      input {
        width: 380px;
      }
      .task-file {
        position: relative;
        p{
          margin: 0;
        }
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
          display: inline-block;
          position: absolute;
          right: -0.278rem;
          top: 0;
        }
        .wjspan:hover {
          cursor: pointer;
        }
      }
    }
    >>> textarea {
      width: 380px;
      resize: none;
    }
  }
}
</style>
