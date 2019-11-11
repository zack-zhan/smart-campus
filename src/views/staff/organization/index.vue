<template>
    <a-layout id="components-layout-demo-top-side" class="content">
    <a-layout-content>
      <a-layout style="margin-bottom:24px;">
        <a-layout-sider width="208" style="background: none">
          <Left></Left>
        </a-layout-sider>
        <a-layout-content style="padding-left: 24px">
          <Right></Right>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Left from './components/left' // 引入左边内容组件
import Right from './components/right' // 引入右边内容组件
export default {
  components: {
    Left,
    Right
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  height: calc(100vh - 65px);
  background: #E9E9E9;
  padding: 24px;
  overflow: auto;
}
</style>

<style scoped>
.content >>> .ant-layout{
  background: none;
}
</style>
