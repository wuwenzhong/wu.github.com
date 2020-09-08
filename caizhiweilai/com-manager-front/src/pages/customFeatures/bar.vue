<template>
  <div class="bar">
    <ul class='list'>
      <li v-for='(item,index) of listItem'
          :key="index"
          :class='index==choseIndex?"on":""'
          @click.stop='barHandler(index)'>{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'bar',
  data() {
    return {
      listItem: [
        {
          name: '试卷管理',
          component: 'customFeatures'
        },
        {
          name: '实操系统',
          component: 'customFeatures/sem'
        },
        {
          name: '实操系统及岗位设置',
          component: 'sempost'
        },
        {
          name: '任务类型维护',
          component: 'customFeatures/task'
        },
        {
          name: '能力项维护',
          component: 'ability'
        },
        {
          name: '教学资源设置',
          component: 'course'
        },
        {
          name: '企业信息维护',
          component: 'uphold'
        },
        {
          name: '账套管理',
          component: 'accountPublic'
        },
        {
          name: '帮助文档管理',
          component: 'editFile'
        },
        {
          name: '会计科目',
          component: 'accountSubject'
        },
        {
          name: '表单设置',
          component: 'formSet'
        },
        {
          name: '表单甄别',
          component: 'formScreen'
        }
      ],
      // 选中的下标
      choseIndex: 0
    }
  },
  methods: {
    // tab点击
    barHandler(index) {
      const that = this
      that.choseIndex = index
      localStorage.setItem('customedIndex', index)
      this.$emit('barClick', index)
    }
  },
  computed: {
  },
  mounted() {
    const index = localStorage.getItem('customedIndex')
    this.choseIndex = index == undefined ? '0' : index
  }
}
</script>

<style lang="scss" scoped>
.list{
  width: 280px;
  height:auto;
  overflow: hidden;
  padding:0;
  li{
    width: 100%;
    height:45px;
    overflow: hidden;
    color:#414D65;
    cursor: pointer;
    position: relative;
    line-height:45px;
    float:left;
    text-indent: 4em;
    list-style: none;
    &.on{
      background:#414D65;
      color:#fff;
      &:before{
        content:'';
        display: block;
        width:10px;
        height: 10px;
        background: #fff;
        border-radius: 100%;
        float:left;
        position: absolute;
        top:18px;
        left:20px;
      }
    }

  }
}
</style>
