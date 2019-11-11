<template>
  <div class="content">
    <div class="box">
      <div class="title">学生详情</div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">基础信息</el-menu-item>
        <el-menu-item index="2">监护人信息</el-menu-item>
        <el-menu-item index="3">德育信息</el-menu-item>
      </el-menu>
      <div class="basics" v-if="activeIndex === '1'">
        <Basics></Basics>
      </div>
      <div class="guardian" v-if="activeIndex === '2'">
        <Guardian></Guardian>
      </div>
      <div class="moral" v-if="activeIndex === '3'">
        <Moral></Moral>
      </div>
    </div>
  </div>
</template>

<script>
import Basics from './components/basics-information' // 引入基础信息组件
import Guardian from './components/guardian-information' // 引入监护人信息组件
import Moral from './components/moral-information' // 引入德育信息组件

export default {
  data () {
    return {
      activeIndex: '1' // 选择的索引
    }
  },
  components: {
    Basics,
    Guardian,
    Moral
  },
  methods: {
    // 获取当前激活菜单的 index
    handleSelect (key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  height: calc(100vh - 65px);
  background: #E9E9E9;
  padding: 20px;
  overflow: auto;
  .box{
    width: 100%;
    background: #fff;
    .title{
      height:60px;
      line-height: 60px;
      font-size:20px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,0,0,0.85);
      padding-left: 32px;
    }
  }
}
</style>

<style scoped>
.box >>> .el-menu-item{
  font-size: 16px;
  margin-left: 20px;
}
.box >>> .is-active{
  color: #1890FF !important;
  border-bottom: 2px solid #1890FF;
}
.box >>> .el-dialog__headerbtn{
  top: 0;
}
</style>
