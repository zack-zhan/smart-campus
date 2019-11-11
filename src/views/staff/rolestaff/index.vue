<template>
  <a-layout id="components-layout-demo-top-side" class="content">
    <a-layout-content>
      <a-layout style="margin-bottom:24px;">
        <a-layout-sider width="208" style="background: none">
          <Department @selected="departmentSelected"/>
        </a-layout-sider>
        <a-layout-content style="padding-left: 24px">
          <Staff :department-id="departmentId"/>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script>
import Department from './department'
import Staff from './staff'
export default {
  components: {
    Department, Staff
  },
  data () {
    return {
      departmentId: ''
    }
  },
  methods: {
    departmentSelected (data) {
      console.log(data)
      this.departmentId = data.departmentid
    }
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
