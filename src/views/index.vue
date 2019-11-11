<template>
  <div class="box">
    <el-container>
      <el-header height="65px">
        <!-- 头部 -->
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="256px">
          <!-- 左侧导航 -->
          <Nav></Nav>
        </el-aside>
        <el-main>
          <!-- 中间主体内容部分，通过路由挂载组件 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/header' // 引入头部组件
import Nav from '@/components/nav' // 引入左侧导航组件
export default {
  components: {
    Header,
    Nav
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.box >>> .el-header{
  padding: 0;
}
.box >>> .el-container{
  height: 100%;
}
.box >>> .el-main{
  padding: 0;
}
</style>
