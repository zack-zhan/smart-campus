<template>
  <div class="content">
    <Left></Left>
    <Right></Right>
  </div>
</template>

<script>
import Left from './components/left' // 引入新增细则类型弹框组件
import Right from './components/right' // 引入新增细则类型弹框组件
export default {
  data () {
    return {
    }
  },
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
  padding: 20px;
  overflow: auto;
}
</style>
