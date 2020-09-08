<template>
  <div class="operate">
    <div class="system">
      <h3 class="title system-title">应用系统</h3>
      <div class="cont">
        <ul class="first">
          <li
            v-for="(item, index) in system"
            :key="index"
            @click="queryMenu(item.id, (systemItem = item.id))"
            :class="{ active: systemItem == item.id }"
          >
           <!-- 实操系统—应用系统列表 -->
            <div class="first-content">
              <div class="appName">{{ item.systemName }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="menu">
      <h3 class="title">菜单级</h3>
      <el-button type="info" size="small" class="btn" @click="menuShow = true"
        >添加</el-button
      >
      <div class="cont">
        <!-- 暂无数据 -->
        <el-tree v-show="menuFirst.length === 0" :data="[]"></el-tree>
        <!-- 一级菜单 -->
        <ul class="first" v-show="menuFirst.length > 0">
          <li
            v-for="(itemFirst, index) in menuFirst"
            :key="index"
            class="first-item"
          >
            <div
              class="first-content"
              @click="slideToggle(index, itemFirst.id, item, (menuItem = itemFirst.id))"
              :class="{ active: menuItem == itemFirst.id }"
            >
              <div class='parentRriangle'>
                <span
                  class="triangle"
                  :ref="'rotate' + index"
                  v-show="itemFirst.child"
                ></span>
              </div>
              <div class="appName special">{{ itemFirst.menuName }}</div>
              <div class="icon-box">
                <i @click.stop="editMenu(itemFirst)">
                  <img src="./images/edit.png" alt />
                </i>
                <i @click.stop="linkShowVisible(itemFirst.id)">
                  <img src="./images/link.png" alt />
                </i>
                <i @click.stop="delMenu(itemFirst.id, itemFirst.child)">
                  <img src="./images/del.png" alt />
                </i>
                <i @click.stop="plusMenu(itemFirst.id)">
                  <img src="./images/plus.png" alt />
                </i>
              </div>
            </div>
            <!-- 二级菜单 -->
            <ul class="secondLevel" :ref="'secondLevel' + index">
              <li v-for="item in itemFirst.child" :key="item.id">
                <div
                  class="second-content"
                  @click.stop="queryFunc(item.id)"
                  ref="func"
                  :class="{ active: itemSecondId == item.id }"
                >
                  <div>{{ item.menuName }}</div>
                  <div class="icon-box">
                    <i @click.stop="editSecoundMenu(itemFirst.id, item)">
                      <img src="./images/edit.png" alt />
                    </i>
                    <i @click.stop="linkShowSecond(item.id)">
                      <img src="./images/link.png" alt />
                    </i>
                    <i @click.stop="delSecoundMenu(item.id)">
                      <img src="./images/del.png" alt />
                    </i>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="func">
      <h3 class="title">功能级</h3>
      <el-button type="info" size="small" class="btn" @click="funcShow = true"
        >添加</el-button
      >
      <div class="cont">
        <ul class="funcList" v-show="funcLists.length > 0">
          <li v-for="(item, index) in funcLists"  :key="index">
            <div class="funcList-content">
              <div class='special'>{{ item.funcName }}</div>
              <div class="icon-box">
                <i @click="editFuncMenu(item.id)">
                  <img src="./images/edit.png" alt />
                </i>
                <i @click="delFuncMenu(item.id)">
                  <img src="./images/del.png" alt />
                </i>
              </div>
            </div>
          </li>
        </ul>
        <!-- 暂无数据 -->
        <el-tree v-show="funcLists.length === 0" :data="[]"></el-tree>
      </div>
    </div>

    <!-- 菜单添加 -->
    <el-dialog
      title="添加"
      width="30%"
      :visible.sync="menuShow"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        class="el-form--label-left"
        label-width="120px"
        :model="menuForm"
        :rules="rules"
        ref="menuFirst"
      >
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input
            autocomplete="off"
            placeholder="请输入菜单名称"
            size="small"
            v-model="menuForm.menuName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="menuShow = false" size="small">取 消</el-button>
        <el-button type="info" @click="addListMenu" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 菜单修改 -->
    <el-dialog
      title="编辑"
      width="30%"
      :visible.sync="editShow"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="editMenu"
        class="el-form--label-left"
        label-width="120px"
        :rules="rules"
        :model="Menu"
      >
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input
            autocomplete="off"
            size="small"
            v-model="Menu.menuName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="editShow = false" size="small">取 消</el-button>
        <el-button type="info" @click="editMenuList" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 二级菜单添加 -->
    <el-dialog
      title="添加"
      width="30%"
      :visible.sync="secondMenuShow"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        class="el-form--label-left"
        label-width="120px"
        :model="secondMenuForm"
        :rules="rules"
        ref="menuSecond"
      >
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input
            autocomplete="off"
            placeholder="请输入菜单名称"
            size="small"
            v-model="secondMenuForm.menuName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="secondMenuShow = false" size="small">取 消</el-button>
        <el-button type="info" @click="addListSecondMenu" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 二级菜单修改 -->
    <el-dialog
      title="编辑"
      width="30%"
      :visible.sync="secondMenuEdit"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="editSecMenu"
        class="el-form--label-left"
        label-width="120px"
        :rules="rules"
        :model="secondMenuEditObj"
      >
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input
            autocomplete="off"
            size="small"
            v-model="secondMenuEditObj.menuName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="secondMenuEdit = false" size="small">取 消</el-button>
        <el-button type="info" @click="editSecoundMenuList" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 关联操作 -->
    <el-dialog
      title="关联操作说明"
      width="40%"
      :visible.sync="linkShow"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div v-if="linkShow">
        <linkDialog
          :firstMenuId="this.firstMenuId"
          :menuId="this.menuId"
          :courseNote.sync="this.courseNote"
          :courseResData="this.courseResData"
          :fileList.sync="this.fileList"
          @Close="closeDialogShow"
        ></linkDialog>
      </div>
    </el-dialog>

    <!-- 功能添加 -->
    <el-dialog
      title="添加"
      width="30%"
      :visible.sync="funcShow"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        class="el-form--label-left"
        label-width="120px"
        :model="addFuncForm"
        :rules="funcRules"
        ref="functionAdd"
      >
        <el-form-item label="功能名称：" prop="funcName">
          <el-input
            autocomplete="off"
            placeholder="请输入功能名称"
            size="small"
            v-model="addFuncForm.funcName"
          ></el-input>
        </el-form-item>
        <el-form-item label="功能编码：" prop="funcCode">
          <el-input
            autocomplete="off"
            placeholder="请输入功能编码"
            size="small"
            v-model="addFuncForm.funcCode"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="funcShow = false" size="small">取 消</el-button>
        <el-button type="info" @click="addFuncList" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 功能修改 -->
    <el-dialog
      title="修改"
      width="30%"
      :visible.sync="funcEditShow"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="editFunc"
        class="el-form--label-left"
        label-width="120px"
        :rules="funcRules"
        :model="FuncForm"
      >
        <el-form-item label="功能名称：" prop="funcName">
          <el-input
            autocomplete="off"
            placeholder="请输入功能名称"
            size="small"
            v-model="FuncForm.funcName"
          ></el-input>
        </el-form-item>
        <el-form-item label="功能编码：" prop="funcCode">
          <el-input
            autocomplete="off"
            placeholder="请输入功能编码"
            size="small"
            v-model="FuncForm.funcCode"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:block;textAlign:center">
        <el-button @click="funcEditShow = false" size="small">取 消</el-button>
        <el-button type="info" @click="editFuncList" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import linkDialog from "./LinkDialog.vue";
// 应用
import { querySystem, systemToMenu } from "@/api/sempost.js";
// 菜单
import {
  menuAdd,
  menuEdit,
  menuDel,
  menuToFunc,
  conserveMenuResource,
  queryResource
} from "@/api/sempost.js";
// 功能
import {
  funcAdd,
  funcDel,
  funcEdit,
  systemToFunc,
  funcQuery
} from "@/api/sempost.js";

export default {
  name: "OperateFunc",
  components: {
    linkDialog
  },
  watch: {
    linkShow(newVal, oldVal) {
      // console.log(newVal)
    }
  },
  data() {
    return {
      isShowSecond: false, // 菜单列表里面的二级选项是否显示
      // 应用
      systemItem: 1,
      systemId: "",
      system: [],
      // 菜单
      menuItem: "",
      menuId: "",
      uploadMenuId: "",
      item: {},
      Menu: {},
      parentId: "",
      secondMenuId: "",
      secondMenuEditObj: {},
      delFirstLevelVisible: false,
      delSecondLevelVisible: false,
      menuShow: false,
      linkShow: false,
      editShow: false,
      menuForm: {
        menuName: ""
      },
      itemFirstId: "",
      menuFirst: [],
      secondMenuShow: false,
      secondMenuEdit: false,
      secondMenuForm: {
        menuName: ""
      },
      // 功能
      funcId: "",
      itemSecondId: "",
      funcShow: false,
      funcEditShow: false,
      delFuncVisible: false,
      funcLists: [],
      addFuncForm: {
        funcName: "",
        funcCode: ""
      },
      FuncForm: {},
      funcRules: {
        funcName: [
          { required: true, message: "请输入功能名称", trigger: "blur" }
        ],
        funcCode: [
          { required: true, message: "请输入功能编码", trigger: "blur" }
        ]
      },
      rules: {
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ]
      },
      firstMenuId: "",
      courseResData: {},
      courseNote: "",
      fileList: [],
    };
  },
  mounted() {
    // 应用系统
    this.querySystem();
    this.queryMenu(1,true);
  },
  methods: {
    // 点击展示按钮
    // showSecondMenu(index, menuId, item){
    // },
    // 菜单列表
    slideToggle(index, menuId, item) {
      for(let i in this.$refs) {
        if(i.includes('rotate') && this.$refs[i].length !== 0 && (!i.includes(index + ''))){
          this.$refs[i][0].className = 'triangle'
        } else if (i.includes('secondLevel') && this.$refs[i].length !== 0 && (!i.includes(index + ''))){
          this.$refs[i][0].className = 'secondLevel'
        }
      }
      this.$refs['secondLevel' + index][0].className = this.$refs['secondLevel' + index][0].className === 'secondLevel' ?  'secondLevel secondLevelBlock' : 'secondLevel'
      this.$refs['rotate' + index][0].className = this.$refs['rotate' + index][0].className === 'triangle' ? 'triangle rotate' : 'triangle'
      this.itemFirstId = menuId;
      this.item = item;
      this.queryFunc(menuId);
    },
    closeLink() {
      this.linkShow = false;
    },

    // 应用系统（第一列列表）
    async querySystem() {
      const res = await querySystem();
      this.system = res.result;
    },

    // 根据应用ID查询菜单列表（第二列列表）
    async queryMenu(id, bool) {
      let that = this;
      that.funcLists = [];
      that.systemId = id;
      const res = await systemToMenu({ appId: id });
      try {
        res.code === "101"
          ? that.$message.warning(res.message)
          : (that.menuFirst = res.result);
        that.menuItem = res.result[0].id;
        if(bool){
          this.queryFunc(that.menuItem);
        }
      } catch (e) {
        // that.$message.warning(res.data.message)
      }
    },

    // 根据菜单查询功能
    async queryFunc(id, istrue) {
      if(istrue || this.itemSecondId !== id){
        this.itemSecondId = id;
        const res = await menuToFunc({ menuId: id });
        this.funcLists = res.result;
      }
    },

    // 菜单添加
    async addListMenu() {
      this.$refs.menuFirst.validate(async valid => {
        if (valid) {
          const res = await menuAdd({
            menuName: this.menuForm.menuName,
            appId: this.systemId,
            pid: "-1"
          });
          if (res.code === "0") {
            this.$message.success(res.message);
            this.menuForm.menuName = "";
            this.queryMenu(this.systemId);
            this.menuShow = false;
          } else {
            this.$message.warning(res.message);
          }
        }
      });
    },

    // 菜单删除
    delMenu(id, child) {
      if(child){
        this.$message.warning('请先删除二级菜单项')
        return
      }
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        closeOnClickModal: false,
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonClass: "el-button--info",
        type: "warning"
      })
        .then(async () => {
          const res = await menuDel({menuId: id});
          if (res.code === "0") {
            this.$message.success(res.message);
            this.queryMenu(this.systemId);
            // this.querySystem();
            // this.queryMenu(1,true);
            this.delFirstLevelVisible = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(arr => {
          // this.$message.info('取消删除')
        });
    },

    // 菜单修改
    async editMenu(item) {
      this.Menu = JSON.parse(JSON.stringify(item));
      this.editShow = true;
    },
    editMenuList() {
      this.$refs.editMenu.validate(async valid => {
        if (!valid) {
          return;
        }
        const res = await menuEdit({
          menuName: this.Menu.menuName,
          appId: this.systemId,
          pid: "-1",
          id: this.Menu.id
        });
        if (res.code === "0") {
          this.$message.success(res.message);
          this.queryMenu(this.systemId);
          this.editShow = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    closeDialogShow(val) {
      this.linkShow = val;
    },
    // 添加上传
    linkShowVisible(id) {
      if (id) {
        this.firstMenuId = id;
        this.menuId = "";
        this.queryResource(id);
        this.fileList = [];
      }
    },
    linkShowSecond(id) {
      this.menuId = id;
      this.queryResource(id);
      this.fileList = [];
    },
    async queryResource(id) {
      const res = await queryResource({ menuId: id });
      this.linkShow = true;
      if (res.code === '0') {
        if (res.result) {
          if (res.result.pubResDTO) {
            this.fileList.push({
              name: res.result.pubResDTO.resName,
              url: res.result.pubResDTO.downloadUrl
            });
          }
          this.courseNote = res.result.note;
          this.courseResData = res.result.pubResDTO
        } else {
          this.courseNote = "";
        }
      } else {
        this.$message.warning(res.message);
      }
    },

    // 二级菜单添加
    async plusMenu(id) {
      this.secondMenuId = id;
      this.secondMenuShow = true;
    },
    async addListSecondMenu() {
      this.$refs.menuSecond.validate(async valid => {
        if (valid) {
          const res = await menuAdd({
            menuName: this.secondMenuForm.menuName,
            appId: this.systemId,
            pid: this.secondMenuId
          });
          if (res.code === "0") {
            this.$message.success(res.message);
            this.secondMenuForm.menuName = "";
            this.queryMenu(this.systemId);
            this.secondMenuShow = false;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        }
      });
    },

    // 二级菜单修改
    async editSecoundMenu(parentId, item) {
      this.parentId = parentId;
      this.secondMenuEditObj = JSON.parse(JSON.stringify(item));
      this.secondMenuEdit = true;
    },
    // 保存修改
    async editSecoundMenuList() {
      // console.log('2222')
      console.log(this.secondMenuEditObj)
      this.$refs.editSecMenu.validate(async valid => {
        if (!valid) {
          return;
        }
        const res = await menuEdit({
          menuName: this.secondMenuEditObj.menuName,
          appId: this.secondMenuEditObj.appId,
          pid: this.secondMenuEditObj.pid,
          id: this.secondMenuEditObj.id
        });
        if (res.code === "0") {
          this.$message.success(res.message);
          this.queryMenu(this.systemId);
          this.secondMenuEdit = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },

    // 二级菜单删除
    async delSecoundMenu(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        closeOnClickModal: false,
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonClass: "el-button--info",
        type: "warning"
      })
        .then(async () => {
          const res = await menuDel({ menuId: id });
          if (res.code === "0") {
            this.$message.success(res.message);
            this.delSecondLevelVisible = false;
            this.queryMenu(this.systemId);
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(arr => {});
    },

    // 功能添加
    async addFuncList() {
      this.$refs.functionAdd.validate(async valid => {
        if (valid) {
          let id = "";
          if (this.item.pid == "-1" || this.item.pid == this.itemFirstId) {
            id = this.itemFirstId;
          } else {
            id = this.itemSecondId;
          }
          const res = await funcAdd({
            funcName: this.addFuncForm.funcName,
            funcCode: this.addFuncForm.funcCode,
            appId: this.systemId,
            menuId: id
          });
          if (res.code === "0") {
            this.$message.success(res.message);
            this.addFuncForm.funcName = this.addFuncForm.funcCode = "";
            this.funcShow = false;
            this.queryFunc(id, true);
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        }
      });
    },
    // 功能删除
    async delFuncMenu(id) {
      this.$confirm("此操作将永久删除该功能, 是否继续?", "提示", {
        closeOnClickModal: false,
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonClass: "el-button--info",
        type: "warning"
      })
        .then(async () => {
          const res = await funcDel({ funcId: id });
          if (res.code === "0") {
            this.$message.success(res.message);
            this.queryFunc(this.itemSecondId, true);
            this.delFuncVisible = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(arr => {});
    },
    // 功能修改
    async editFuncMenu(id) {
      const res = await funcQuery({ funcId: id });
      this.FuncForm = res.result;
      this.funcEditShow = true;
    },
    async editFuncList() {
      this.$refs.editFunc.validate(async valid => {
        if(!valid){
            return;
        }
        const res = await funcEdit({
          funcName: this.FuncForm.funcName,
          funcCode: this.FuncForm.funcCode,
          appId: this.FuncForm.appId,
          menuId: this.FuncForm.menuId,
          id: this.FuncForm.id
        });
        if (res.code === "0") {
          this.$message.success(res.message);
          this.queryFunc(this.itemSecondId, true);
          this.funcEditShow = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.operate {
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
    overflow-y: hidden;
    width: 350px;
    height: 512px;
    border: 1px solid rgba(220, 220, 220, 1);
    // padding-top: 10px;
    // padding-bottom: 20px;
    box-sizing: border-box;

    ul.first {
      padding: 0;
      margin: 0;
      li {
        list-style: none;
        line-height: 46px;
        cursor: pointer;
        &.active {
          background-color: #f1f6ff;
        }
        .first-content {
          padding-left: 31px;
          padding-right: 31px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          position: relative;
          &:hover {
            background-color: #f1f6ff;
          }
          &:hover .icon-box {
            opacity: 1;
          }
          &.active {
            background-color: #f1f6ff;
          }
          .parentRriangle{
            width:15px;
            height: 20px;
            position: absolute;
            left:10px;
            top:13px;
            // background-color: red;
            .triangle{
              position: absolute;
              border: 6px solid transparent;
              border-left-color:#414D65;
              left:5px;
              top:5px

            }
            .rotate{
              transform: rotate(90deg);
              transform-origin: 20%;
            }
          }
          
        }
        .appName {
          font-size: 16px;
          color: #414d65;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .special{
          width: 190px;
        }
        .secondLevel {
          display: none;
          // transition: all 0.3s linear;
          padding: 0;
          li {
            padding-right: 0;
            &:hover {
              background-color: #f1f6ff;
            }
            &:hover .icon-box {
              opacity: 1;
            }
            .second-content {
              padding-left: 60px;
              padding-right: 31px;
              font-size: 14px;
              display: flex;
              justify-content: space-between;
              &:hover {
                background-color: #f1f6ff;
              }
              &.active {
                background-color: #f1f6ff;
              }
            }
          }
        }
        .secondLevelBlock{
          display: block;
          // transition: all 0.3s linear;
        }
      }
    }
    ul.funcList {
      padding: 0;
      li {
        line-height: 36px;
        padding-left: 50px;
        padding-right: 20px;
        font-size: 14px;
        list-style: none;
        cursor: pointer;
        &:hover {
          background-color: #f1f6ff;
        }
        &:hover .icon-box {
          opacity: 1;
        }
        .funcList-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
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
      display: block;
    }
  }
}
.isSlideShow {
  display: none;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  &:hover .icon-box {
    opacity: 1;
  }
}
.special{
  width: 235px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang='scss'>
.operate{
  .el-button.el-button--info{
    border: none;
    background-color: #414D65;
  }
}
</style>
