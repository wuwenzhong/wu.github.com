<template>
  <div class="privilege">
    <ul class='tab'>
      <li v-for="(item,index) in tabList" :key="index" @click="tabClick(index,cutActive = index)" :class="{ active:cutActive == index }">{{ item.name }}</li>
    </ul>
    <div class="container">
      <component :is="activeName"></component>
    </div>
  </div>
</template>

<script>
import sem from './sempost-sem.vue'
import post from './sempost-post.vue'

export default {
  name: 'Customer',
  components: {
    sem,
    post
  },
  data() {
    return {
      cutActive: '0',
      tabList: [
        { name: '实操系统' },
        { name: '岗位设置' }
      ],
      activeName: 'sem'
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.activeName = 'sem'
          break
        case 1:
          this.activeName = 'post'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.privilege {
  background: white;
  padding-top:20px;
  display: flex;
  ul.tab{
    // width: 200px;
    padding-top: 15px;
    padding-left: 0px;
    li{
      width: 140px;
      list-style: none;
      position: relative;
      cursor: pointer;
      padding: 0 39px;
      line-height: 45px;
      font-size: 14px;
      &.active{
        background-color: #414D65;
        color: #fff;
      }
      &.active::before{
        content: '';
        display: block;
        width: 9px;
        height: 9px;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        top: 18px;
        left: 20px;
      }
    }
  }
  .container{
    box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
    padding: 30px;
    flex: 1;
  }
}
</style>