<template>
  <div class="personMaterial">
    <div class="buttontop">
      <button :class="checked === '1' ? 'checked' : ''" @click="clickBaseInfo">基本信息</button>
      <button :class="checked === '2' ? 'checked' : ''" @click="clickChangePassword">修改密码</button>
    </div>
    <BaseInfo v-if="checked === '1'"></BaseInfo>
    <ChangePassword v-if="checked === '2'"></ChangePassword>
  </div>
</template>
<script>
import BaseInfo from './components/BaseInfo'
import ChangePassword from './components/ChangePassword'
export default {
  name: 'index',
  components: {
    BaseInfo,
    ChangePassword
  },
  data() {
    return {
      checked: '1', // checked为1展示基本信息,为2展示修改密码
      form: {
        name: '',
        age: '',
        date: '',
        email: '',
        accunt: '',
        sex: '',
        phone: ''
      }
    }
  },
  methods: {
    // 点击基本信息
    clickBaseInfo() {
      this.checked = '1'
    },
    // 点击修改密码
    clickChangePassword() {
      this.checked = '2'
    }
  }
}
</script>

<style lang='scss' scoped>
.personMaterial {
  padding: 30px 22.5px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  overflow-y: auto;
  button {
    width: 142px;
    height: 41px;
    border-radius: 2px;
    border: 1px solid rgba(54, 206, 169, 1);
    outline: none;
    color: #999;
    font-size: 18px;
    background-color: #fff;
    margin-bottom: 38px;
  }
  button:hover {
    cursor: pointer;
  }
  button.checked {
    background-color: rgba(54, 206, 169, 1);
    color: #fff;
  }
}
</style>
