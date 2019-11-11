<template>
  <a-layout id="components-layout-demo-top-side" class="content">
    <a-layout-content>
      <a-layout style="margin-bottom:24px;">
        <a-layout-sider width="208" style="background: none">
          <Department @selected="departmentSelected"/>
        </a-layout-sider>
        <a-layout-content style="padding-left: 24px">
          <Auth :department-id="departmentId"/>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script>
import Department from './department'
import Auth from './auth'
export default {
  components: { Department, Auth },
  data () {
    return {
      departmentId: ''
    }
  },
  methods: {
    departmentSelected (department) {
      if (department && department.departmentid) {
        this.departmentId = department.departmentid
      }
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
