<template>
  <a-row class="fourStep">
    <a-col :span="1"></a-col>
    <a-col :span="11" class="left">
      <div class="template">
        <div class="title">{{title}}</div>
        <div class="content">{{content}}</div>
        <div class="footer">{{schoolName}}</div>
      </div>
      <div class="mode">发送方式：<span>{{mode === '1'?'短信':''}}</span></div>
    </a-col>
    <a-col :span="1"></a-col>
    <a-col :span="11" class="right">
      <div class="title">教师</div>
      <div class="etui" v-for="item in this.$store.state.notice.teacher" :key="item.key">
        <span class="fl">{{item.title}}</span>
        <span class="fr" @click="teacherDel(item)">x</span>
      </div>
      <div class="title">公告组</div>
      <div class="etui" v-for="item in this.$store.state.notice.group" :key="item.key">
        <span class="fl">{{item.title}}</span>
        <span class="fr" @click="groupDel(item)">x</span>
      </div>
      <div class="title">家长</div>
      <div class="etui" v-for="item in this.$store.state.notice.patriarch" :key="item.key">
        <span class="fl">{{item.title}}</span>
        <span class="fr" @click="patriarchDel(item)">x</span>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { getCookie } from '@/utils/cookies'
export default {
  data () {
    return {
      title: '',
      content: '',

      schoolName: '',
      mode: ''
    }
  },
  methods: {
    teacherDel (item) {
      const index = this.$store.state.notice.teacher.findIndex(e => item.title === e.title)
      console.log(index, 'index')
      this.$store.state.notice.teacher.splice(index, 1)
    },
    groupDel (item) {
      const index = this.$store.state.notice.group.findIndex(e => item.title === e.title)
      console.log(index, 'index')
      this.$store.state.notice.group.splice(index, 1)
    },
    patriarchDel (item) {
      const index = this.$store.state.notice.patriarch.findIndex(e => item.title === e.title)
      console.log(index, 'index')
      this.$store.state.notice.patriarch.splice(index, 1)
    }
  },
  mounted () {
    if (this.$store.state.notice.title) {
      this.title = this.$store.state.notice.title
    }
    if (this.$store.state.notice.content) {
      this.content = this.$store.state.notice.content
    }
    if (getCookie('schoolName')) {
      this.schoolName = getCookie('schoolName')
    } else {
      this.schoolName = sessionStorage.setItem('schoolName')
    }

    this.mode = this.$store.state.notice.mode
  }
}
</script>

<style lang="scss" scoped>
.template{
  width: 100%;
  height:234px;
  background:rgba(245,245,245,0.5);
  border-radius:4px;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
  .title{
    width: 98%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .content{
    font-size:16px;
    font-family:PingFang-SC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.65);
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 5;
    overflow: hidden;

    word-wrap:break-word;
  }
  .footer{
    font-size:14px;
    font-family:PingFang-SC-Regular;
    font-weight:400;
    color:rgba(156,156,156,1);
    position: absolute;
    bottom: 20px;
  }
}
.title{
    font-size:18px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:#000000;
    margin-bottom: 16px;
  }
.mode{
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,0.85);
  margin-top: 20px;
  span{
    color:rgba(0,0,0,0.65);
  }
}
.etui{
  display: inline-block;
  width:82px;
  padding: 3px 8px;
  background:rgba(245,245,245,1);
  border-radius:4px;
  border:1px solid rgba(217,217,217,1);
  margin-right: 16px;
  margin-bottom: 12px;
  span{
    display: inline-block;
    height: 16px;
    line-height: 16px;
  }
  span:nth-child(1){
    width: 48px;
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
  }
  span:nth-child(2){
    position: relative;
    bottom: 2px;
    cursor: pointer;
  }
}
</style>
