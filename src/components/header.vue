<template>
  <div class="header">
    <div class="h_left">
      <div>智 慧 校 园 管 理 平 台</div>
    </div>
    <div class="h_user">

    </div>
    <div class="h_right">
      <div class="quit" @click="quit">
        <span><i class="icon iconfont icon-tuichu1"></i> 退出</span>
      </div>
      <div class="name">{{schoolName}}</div>
      <div class="name">{{name}}</div>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie, removeCookie } from '@/utils/cookies'
export default {
  data () {
    return {
      name: ''
    }
  },
  computed: {
    schoolName () {
      if (this.$store.state.schoolName) {
        setCookie('schoolName', this.$store.state.schoolName)
        return this.$store.state.schoolName
      } else {
        return getCookie('schoolName')
      }
    }
  },
  methods: {
    // 点击退出回到登录页
    quit () {
      removeCookie('token')
      removeCookie('corpId')
      removeCookie('name')
      removeCookie('id')
      removeCookie('schoolName')
      localStorage.removeItem('munu_list')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('corpId')
      sessionStorage.removeItem('name')
      sessionStorage.removeItem('id')
      sessionStorage.removeItem('schoolName')
      this.$router.push('/login')
    }
  },
  mounted () {
    if (getCookie('name')) {
      this.name = getCookie('name')
    } else {
      this.name = sessionStorage.getItem('name')
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  width:100%;
  height:65px;
  background:rgba(255,255,255,1);
  .h_left{
    width:255px;
    height:65px;
    line-height: 65px;
    background: #001529;
    float: left;
    div{
      width:208px;
      height:32px;
      line-height: 32px;
      text-align: center;
      background:rgba(217,217,217,0.2);
      border-radius:2px;
      margin: 0 auto;
      font-size:18px;
      font-family:PingFang-SC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin-top: 16.5px;
    }
  }
  .h_right{
    width: calc(100% - 318px);
    height: 65px;
    line-height: 65px;
    float: right;
    .name{
      float: right;
      padding-right: 24px;
    }
    .quit{
      float: right;
      padding-right: 24px;
      cursor:pointer;
      span{
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        line-height:65px;
        .icon-tuichu1{
          font-size: 16px;
        }
      }
    }
  }
}
</style>
