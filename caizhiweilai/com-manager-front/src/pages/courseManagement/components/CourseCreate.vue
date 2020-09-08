<template>
  <div>
    <el-form :model="courseForm" ref="courseForm" label-width="120px" :rules="rules">
      <el-form-item label="课程编码：" required>
        <el-input autocomplete="off" :placeholder="courseForm.courseCode" size="small" disabled></el-input>
      </el-form-item>
      <el-form-item label="课程名称：" prop="courseName">
        <el-input
          autocomplete="off"
          v-model.trim="courseForm.courseName"
          placeholder="请输入课程名称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程简介：" prop="courseIntroduction">
        <el-input
          type="textarea"
          maxlength="500"
          show-word-limit
          v-model.trim="courseForm.courseIntroduction"
          autocomplete="off"
          rows="8"
          placeholder="请输入课程简介"
          size="small"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程封面：" required prop="coverUrl">
        <el-checkbox-group v-model="courseForm.coverUrl"></el-checkbox-group>
        <el-upload
          ref="upload"
          :before-upload="beforeUpload"
          action="#"
          :on-change="change"
          :on-remove="remove"
          :file-list="courseForm.fileList"
          list-type="picture-card"
          :http-request="PicUpload"
          accept=".png, .jpg, .gif, .jpeg, .PNG, .JPG, .GIF, .JPEG"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="wzgs">图片宽高比为2:1,且大小不超过1M</div>
      </el-form-item>
      <el-form-item label="版本号：" prop="courseVersion">
        <el-input
          autocomplete="off"
          v-model.trim="courseForm.courseVersion"
          placeholder="请输入版本号"
          size="small"
          onkeyup="value=value.replace(/[^\d^\.]+/g,'')"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" style="display:block;text-align: center">
      <el-button class='el-button--small' @click="close">取 消</el-button>
      <el-button class='Determine el-button--small' type="primary" @click="Increase()">保 存</el-button>
    </span>
  </div>
</template>

<script>
/* eslint-disable */
import { coursecode, createcourse } from "./../../../api/course";
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["userId"])
  },
  name: "",
  data() {
    return {
      loading: false,
      isShow: false,
      // 表单所填内容
      courseForm: {
        courseName: "",
        courseIntroduction: "",
        fileList: [],
        courseVersion: "",
        creator: "",
        courseCode: "",
        coverUrl: ""
      },
      // 表单验证
      rules: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        courseIntroduction: [
          { required: true, message: "请输入课程简介", trigger: "blur" }
        ],
        fileList: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        courseVersion: [
          { required: true, message: "请输入版本号", trigger: "blur" }
        ]
      },
      removeArrUrl: [],
      flag: ""
    };
  },
  props: ["create"],
  mounted() {
    this.init();
    // 添加用户id userId到courseForm
    this.courseForm.creator = this.userId;
  },
  methods: {
    init() {
      // 获取课程编码
      coursecode({ entityName: "course", length: "8" }).then(res => {
        this.courseForm.courseCode = res.result;
      });
    },
    //上传的图片做校验
    beforeUpload(file) {
      let FileExt = file.name.replace(/.+\./, "");
      if (
        ["png", "jpg", "jpeg", "PNG", "JPG", "JPEG"].indexOf(
          FileExt.toLowerCase()
        ) === -1
      ) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为jpg,jpeg,png结尾的图片！"
        });
        return false;
      }
      if (file.size > 1024 * 1024) {
        this.$message({
          type: "warning",
          message: "你上传的图片大小超过1M,请重新上传！"
        });
        return false;
      }
      const is1M = file.size / 1024 / 1024 < 1; // 限制小于3M
        if (!is1M) {
            this.$message.error('图片宽高比为2:1,且大小不超过1M');
            return false;
        } else {
            const isSize = new Promise((resolve, reject) => {
                const width = 200;
                const height = 100;
                const _URL = window.URL || window.webkitURL;
                const img = new Image();
                img.onload = () => {
                    const valid = img.width >= width && img.height >= height && (img.width/img.height==2);
                    valid ? resolve() : reject();
                };
                img.src = _URL.createObjectURL(file);
            }).then(
                () => {
                    return file;
                },
                () => {
                    this.$message.error('图片宽高比为2:1,且大小不超过1M');
                    return Promise.reject();
                },
            );
            return isSize;
        }
    },
    change(file, fileList) {
      let houZuiMing = file.name.replace(/.+\./, "");
      if (
        ["png", "jpg", "jpeg", "PNG", "JPG", "JPEG"].indexOf(
          houZuiMing.toLowerCase()
        ) === -1 ||
        file.size > 1024 * 1024
      ) {
        return;
      }
    },
    remove(file) {},
    /* 关闭弹窗 */
    close() {
      let that = this;
      that.$emit("createClose");
    },
    /* 添加课程 */
    Increase() {
      if (this.courseForm.courseName == "") {
        this.$message.warning("课程名称不能为空！");
        return false;
      }
      if (this.courseForm.courseIntroduction == "") {
        this.$message.warning("课程简介不能为空！");
        return false;
      }
      if (this.courseForm.fileList[0] == "") {
        this.$message.warning("课程封面不能为空！");
        return false;
      }
      if (this.courseForm.courseVersion == "") {
        this.$message.warning("版本号不能为空！");
        return false;
      }
      let courseData = {
        courseName: this.courseForm.courseName,
        courseIntroduction: this.courseForm.courseIntroduction,
        coverUrl: this.courseForm.fileList[0].url,
        courseVersion: this.courseForm.courseVersion,
        creator: this.courseForm.creator,
        courseCode: this.courseForm.courseCode
      };
      createcourse(courseData).then(res => {
        if (res.code == 0) {
          this.$emit("createClose");
        } else {
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    // 图片上传
    async PicUpload(e) {
      const res = await this.cos(e);
      if (res) {
        this.$message({
          type: "success",
          message: "上传成功！"
        });
        this.courseForm.fileList[0] = { name: "caizhiweilai", url: res };
      } else {
        this.$message({
          type: "error",
          message: "上传失败！"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wzgs {
  color: #f57474;
}
.Determine{
  background: #414d65;
}
.el-upload--picture-card{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 200px;
    height: 100px;
    line-height: 100px;
    vertical-align: top;
}
</style>
