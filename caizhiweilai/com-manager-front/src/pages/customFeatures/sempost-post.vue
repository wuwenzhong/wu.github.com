<template>
  <div class="posts">
    <div class="system">
      <h3 class="title system-title">应用系统</h3>
      <div class="cont">
        <ul>
          <li
            v-for="(item, index) in system"
            :key="index"
            @click.stop="queryPost((systemItem = item.id))"
            :class="{ active: systemItem == item.id }"
          >
            <!-- 岗位设置——应用系统列表 -->
            <div class="appName">{{ item.systemName }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="post-name">
      <h3 class="title">岗位名称</h3>
      <el-button type="info" size="small" class="btn" @click="postShow = true">添加</el-button>
      <div class="cont">
        <!-- 暂无数据 -->
        <el-tree v-show="post.length === 0" :data="[]"></el-tree>
        <ul>
          <li
            v-for="(item, index) in post"
            :key="index"
            @click.stop="queryPowers((posItem = item.id))"
            :class="{ active: posItem == item.id }"
          >
            <div class='special'>{{ item.posName }}</div>
            <div class="icon-box">
              <i @click.stop="postEdit(item.id)">
                <img src="./images/edit.png" alt />
              </i>
              <i @click.stop="postDel(item.id)">
                <img src="./images/del.png" alt />
              </i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="link-func">
      <h3 class="title">关联功能权限</h3>
      <el-button type="info" size="small" class="btn" @click="confirmRelevance" v-preventReClick>保存</el-button>
      <el-button type="info" size="small" class="btn" @click="AllChoice">全选</el-button>
      <div class="cont">
        <el-tree
          :data="list"
          @check="GainFuncArr"
          show-checkbox
          :class="list.length > 0 ? 'postsTree' : 'nodataTree'"
          ref="DeviceGroupTree"
          accordion
          :props="defaultProps"
          node-key="id"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 添加岗位 -->
    <el-dialog title="添加" width="30%" :visible.sync="postShow" :close-on-click-modal="false" destroy-on-close>
      <el-form
        class="el-form--label-left"
        label-width="120px"
        :model="postForm"
        :rules="rules"
        ref="roleForm"
      >
        <el-form-item label="岗位名称：" prop="posName">
          <el-input
            autocomplete="off"
            placeholder="请输入岗位名称"
            size="small"
            v-model="postForm.posName"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位编码：" prop="posCode">
          <el-input
            autocomplete="off"
            placeholder="请输入岗位编码"
            size="small"
            v-model="postForm.posCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位类型：" prop="posType">
          <el-radio-group v-model="postForm.posType">
            <el-radio label="普通岗"></el-radio>
            <el-radio label="全岗"></el-radio>
          </el-radio-group>
          <!-- <el-radio v-model="postForm.posType" :label="NORMAL">普通岗</el-radio>
          <el-radio v-model="postForm.posType" :label="ALLPOS">全岗</el-radio>-->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="postShow = false" size="small">取 消</el-button>
        <el-button type="info" @click="addListPost" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 岗位修改 -->
    <el-dialog title="编辑" width="30%" :visible.sync="postEditShow" :close-on-click-modal="false" destroy-on-close>
      <el-form
        class="el-form--label-left"
        label-width="120px"
        :rules="rules"
        ref="posForm"
        :model="postEditObj"
      >
        <el-form-item label="岗位名称：" prop="posName">
          <el-input autocomplete="off" size="small" v-model="postEditObj.posName"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码：" prop="posCode">
          <el-input autocomplete="off" size="small" v-model="postEditObj.posCode"></el-input>
        </el-form-item>
        <el-form-item label="岗位类型：" prop="posType">
          <el-radio-group v-model="postEditObj.posType">
            <el-radio label="普通岗"></el-radio>
            <el-radio label="全岗"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="postShowVisible" size="small">取 消</el-button>
        <el-button type="info" @click="editListPost" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import {
  querySystem,
  systemToPost,
  postToPowers,
  assignPowersPost,
  postAdd,
  posDel,
  posEdit,
  systemToFunc,
  posQuery
} from "@/api/sempost.js";
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userId'])
  },
  data() {
    return {
      systemItem: 1,
      posItem: "",
      defaultProps: {
        children: "child",
        label: "funcName"
      },
      powersId: "",
      checkedNodesArr: [],
      checkedNodesStr: "",
      delVisible: false,
      list: [],
      lists: [],
      // 应用 ID
      systemId: "",
      // 岗位
      postEditObj: {},
      system: [],
      post: [],
      postShow: false,
      postEditShow: false,
      // 添加岗位
      postForm: {
        posName: "",
        posCode: "",
        posType: "普通岗"
      },
      // 表单验证
      rules: {
        posName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" }
        ],
        posCode: [
          { required: true, message: "请输入岗位编码", trigger: "blur" }
        ],
        posType: [{ required: true, trigger: "blur" }]
      },
      posFlagId: "",
      postEditOldObj: {}
    };
  },
  methods: {
    // 应用系统
    async querySystem() {
      const res = await querySystem();
      this.system = res.result;
    },

    // 根据应用ID查询岗位
    async queryPost(id) {
      this.systemId = id;
      const res = await systemToPost({ appId: id })
      try {
        if(res.code === '0'){
          this.post = res.result || []
        } else {
          this.$message.warning(res.message)
        }
        this.posItem = res.result[0].id;
        this.queryPowers(res.result[0].id);
      } catch (e) {
        // this.post = res.data.result
      }
      const resFunc = await systemToFunc({ appId: id })
      if(resFunc.code === '0'){
        this.list = resFunc.result || []
      } else {
        this.$message.warning(resFunc.message)
      }
      // resFunc.code !== "0" ? this.$message.warning(resFunc.message) : (this.list = resFunc.result);
    },

    // 添加岗位
    addListPost() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          let type = this.postForm.posType === "普通岗" ? "NORMAL" : "ALLPOS";
          const res = await postAdd({
            posName: this.postForm.posName,
            posCode: this.postForm.posCode,
            posType: type,
            appId: this.systemId,
            creator: this.userId
          });

          if (res.code === "0") {
            this.$message.success(res.message);
            this.postShow = false;
            this.queryPost(this.systemId);

            this.postForm.posName = this.postForm.posCode = "";
            // this.postForm.posType = '普通岗'
          } else {
            this.$message.warning(res.message);
          }
        }
      });
    },

    // 岗位删除
    async postDel(id) {
      this.$confirm("此操作将永久删除该岗位, 是否继续?", "提示", {
        closeOnClickModal: false,
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonClass: "el-button--info",
        type: "warning"
      })
        .then(async () => {
          const res = await posDel({ postionId: id })
          if (res.code === "0") {
            this.$message.success(res.message);
            this.queryPost(this.systemId);
            this.delVisible = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          // this.$message.info('取消删除')
        });
    },

    // 岗位修改
    async postEdit(id) {
      const res = await posQuery({ postionId: id })
      try {
        res.result.posType =
          res.result.posType === "NORMAL" ? "普通岗" : "全岗";
        this.postEditOldObj = this.postEditObj = res.result;
        this.postEditShow = true;
      } catch (e) {
        // this.$message.warning("获取数据失败")
      }
    },
    // 岗位修改取消
    postShowVisible() {
      this.postEditObj = this.postEditOldObj;
      this.postEditShow = false;
    },
    // 岗位修改确定
    async editListPost(id) {
      this.postEditObj.posType =
        this.postEditObj.posType === "普通岗" ? "NORMAL" : "ALLPOS";
      const res = await posEdit({
        posName: this.postEditObj.posName,
        posCode: this.postEditObj.posCode,
        posType: this.postEditObj.posType,
        appId: this.systemId,
        id: this.postEditObj.id,
        modifier: this.userId
      });
      if (res.code === "0") {
        this.$message.success(res.message);
        this.queryPost(this.systemId);
        this.postEditShow = false;
      } else {
        this.$message.warning(res.message);
      }
    },

    // 关联功能权限返回的数组
    async GainFuncArr(node, data) {
        if(data.checkedKeys.length === 0){
            this.checkedNodesStr = ''
        }else {
            this.checkedNodesStr = data.checkedKeys.join(",");
        }
    },

    // 根据岗位ID查询功能
    async queryPowers(id) {
      this.powersId = id;
      this.$refs.DeviceGroupTree.setCheckedKeys([]);
      const res = await postToPowers({ posId: id })
      try {
        if(res.result){
          this.$refs.DeviceGroupTree.setCheckedKeys(res.result);
        }
      } catch (e) {
        
      }
    },
    // 给岗位分配权限
    async confirmRelevance() {
        const res = await assignPowersPost({
            posId: this.powersId,
            funcIds: this.checkedNodesStr.split(',')
        })
        if (res.code === "0") {
          this.$message.success(res.message);
        } else {
          this.$message.warning(res.message);
        }
    },
    // 全选
    AllChoice() {
        let arr = this.list.map(item => item.id)
        // 全部选择
        this.$refs.DeviceGroupTree.setCheckedNodes(this.list);
        this.checkedNodesStr = arr.join()
    }
  },
  mounted() {
    // 应用系统
    this.querySystem();
    this.queryPost(1);
  }
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.posts {
  display: flex;
  & > div {
    margin-right: 31px;
  }
  .title {
    font-size: 16px;
    color: #414d65;
    font-weight: normal;
    margin-bottom: 21px;
    &.system-title {
      margin-bottom: 73px;
    }
  }
  .btn {
    margin-bottom: 20px;
  }
  .cont {
    overflow-x: hidden;
    width: 350px;
    height: 512px;
    border: 1px solid rgba(220, 220, 220, 1);
    // padding-top: 20px;
    // padding-bottom: 20px;
    box-sizing: border-box;
    .postsTree{
      margin-top: 15px;
    }
    .nodataTree{
       margin-top: 0px;
    }
    ul {
      padding: 0;
      li {
        padding-left: 31px;
        padding-right: 31px;
        line-height: 46px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        .icon-box {
          opacity: 0;
          i,
          i + i {
            margin-right: 12px;
            display: inline-block;
            &:last-child {
              margin-right: 0;
            }
          }
          img {
            width: 14px;
            display: inline-block;
          }
        }
        &:hover,
        &.active {
          background-color: #f1f6ff;
        }
        .appName {
          font-size: 16px;
          color: #414d65;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover .icon-box {
          opacity: 1;
        }
      }
    }
  }
  .special{
    width: 235px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang='scss'>
.posts{
  .el-button.el-button--info{
    border: none;
    background-color: #414D65;
  }
}
</style>
