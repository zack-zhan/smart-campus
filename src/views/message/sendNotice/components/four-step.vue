<template>
  <div class="fiveStep">
    <div class="correct">
      <span class="icon iconfont icon-zhengque"></span>
    </div>
    <div class="accomplish">完成</div>
    <div class="text">公告发送中，您可以在<span class="ts" @click="jump">发送历史</span>中查看本次发送详情</div>
  </div>
</template>

<script>
import { noticehistorycreate } from '@/api'
export default {
  methods: {
    send () {
      const ids = []
      this.$store.state.notice.teacher.map(item => {
        ids.push(item.key)
      })
      this.$store.state.notice.group.map(item => {
        ids.push(item.key)
      })
      this.$store.state.notice.patriarch.map(item => {
        ids.push(item.key)
      })
      const obj = {
        ids: ids,
        mode: parseInt(this.$store.state.notice.mode),
        template: this.$store.state.notice.content,
        templateName: this.$store.state.notice.title
      }
      console.log(obj, 'obj')
      noticehistorycreate(obj)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('发送成功')

            this.$store.commit('setNoticeTitle', '')
            this.$store.commit('setNoticeContent', '')
            this.$store.commit('clearTeacher')
            this.$store.commit('clearNoticeGroup')
            this.$store.commit('clearNoticePatriarch')
          } else {
            this.$message.error(res.message)
          }
        })
    },

    jump () {
      this.$router.push('/sendHistory')
    }
  },
  mounted () {
    this.send()
  }
}
</script>

<style lang="scss" scoped>
.fiveStep{
  width: 500px;
  margin: 100px auto;
  text-align: center;
}
.correct{
  width:72px;
  height:72px;
  background:rgba(54,198,38,1);
  border-radius: 50%;
  line-height: 72px;
  text-align: center;
  margin: 0 auto;
  span{
    font-size: 50px;
    color: #fff;
  }
}
.accomplish{
  font-size:24px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
  margin: 20px 0;
}
.text{
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,0.45);
}

.ts{
  color:#1890FF;
  cursor: pointer;
}
</style>
