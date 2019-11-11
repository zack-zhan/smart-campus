<template>
  <div class="nav">
    <el-menu
      class="el-menu-vertical-demo"
      text-color="#ACB0C7"
      :router="true"
      :unique-opened="true"
      :default-active="onRoutes">

      <el-menu-item :index="menu.url" class="ts" v-for="(menu) in arr" :key="menu.url" v-show="menu.type === 2" :class="num === 4?'bg':''">
        <a-icon :type="menu.icon" />
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>

      <el-submenu :index="index.toString()" v-for="(menu,index) in arr" :key="index" v-show="menu.type === 1">
        <template slot="title">
          <a-icon :type="menu.icon" />
          <span>{{menu.name}}</span>
        </template>
        <el-menu-item-group v-for="(child) in menu.children" :key="child.id">
          <el-menu-item :index="child.url">{{child.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      arr: []
    }
  },
  computed: {
    num () {
      if (this.$route.path.replace('/', '') === 'home') {
        return 4
      }
    },
    onRoutes () {
      if (this.$route.path.replace('/', '') === 'home') {
        return '/home'
      } else if (this.$route.path.replace('/', '') === 'record') {
        return '/record'
      } else if (this.$route.path.replace('/', '') === 'detailed') {
        return '/detailed'
      } else if (this.$route.path.replace('/', '') === 'sendNotice') {
        return '/sendNotice'
      } else if (this.$route.path.replace('/', '') === 'bulletingroup') {
        return '/bulletingroup'
      } else if (this.$route.path.replace('/', '') === 'sendHistory') {
        return '/sendHistory'
      } else if (this.$route.path.replace('/', '') === 'class') {
        return '/class'
      } else if (this.$route.path.replace('/', '') === 'dormitory') {
        return '/dormitory'
      } else if (this.$route.path.replace('/', '') === 'list') {
        return '/list'
      } else if (this.$route.path.replace('/', '') === 'entrance') {
        return '/entrance'
      } else if (this.$route.path.replace('/', '') === 'guide') {
        return '/guide'
      } else if (this.$route.path.replace('/', '') === 'organization') {
        return '/organization'
      } else if (this.$route.path.replace('/', '') === 'jurisdiction') {
        return '/jurisdiction'
      } else if (this.$route.path.replace('/', '') === 'roleassign') {
        return '/roleassign'
      }
    }
  },
  mounted () {
    const menus = localStorage.getItem('menu_list')
    this.arr = JSON.parse(menus)
  }
}
</script>

<style lang="scss" scoped>
.nav{
  width: 256px;
  height: 100%;
}
.el-menu-vertical-demo{
  height: 100%;
  background: #001529;
  padding-top: 20px;
}
.bg{
  background: #1890FF !important;
  span{
    color: #fff !important;
  }
}
</style>

<style scoped>
.nav >>>.el-submenu{
  line-height: 40px;
}
.nav >>>.el-menu-item-group__title{
  display: none;
}
.nav >>> .el-submenu__title:hover{
  background: none;
}
.nav >>> .el-submenu__title{
  height: 45px;
  line-height: 45px;
  font-size:14px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(255,255,255,1);
}
/* .nav >>> .el-menu-item:focus, .el-menu-item:hover {
  background: none;
} */
.nav >>> .el-menu-item{
  height: 45px;
  line-height: 45px;
  background: #00080E;
  font-size:14px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(255,255,255,1);
  padding-left: 47px !important;
}
.nav >>> .el-submenu__title:hover span{
  color: #fff;
}
.nav >>> .el-submenu__title:hover i{
  color: #fff;
}
.nav >>> .el-submenu__title i {
    font-size: 14px;
    margin-right: 7px;
}
.nav >>> .el-submenu__title span {
    color: rgb(172, 176, 199);
}
.nav >>> .el-menu-item.is-active{
  background: #1890FF;
  color: #fff;
}
.show >>>.el-icon-arrow-down{
  display: none;
}
.nav >>>.el-submenu__title * {
  vertical-align: middle;
}
.nav >>>.el-menu-item * {
  vertical-align: middle;
}
.nav >>> .ts{
  padding-left: 20px !important;
  background: #001529;
}
.nav >>> .ts i{
  font-size: 14px;
  font-weight: bold;
  margin-right: 7px;
}
.nav >>> .ts span{
  color: rgb(172, 176, 199);
}
.nav >>> .ts:hover i{
  color: #fff;
}
.nav >>> .ts:hover span{
  color: #fff;
}
</style>
