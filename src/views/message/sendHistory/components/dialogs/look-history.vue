<template>
  <div class="dialogBox">
    <div class="top">
      <div class="line">发送对象：<span>{{arr.sendObjects.join(",")}}</span></div>
      <div class="line">发送方式：<span>{{arr.sendMoedStr}}</span></div>
      <div class="line">发送时间：<span>{{arr.sendTime}}</span></div>
      <div class="line">发送人：<span>{{arr.sender}}</span></div>
    </div>
    <div class="title">公告信息</div>
    <div class="bottom">
      <div class="name">{{arr.title}}</div>
      <div class="text">{{arr.content}} </div>
    </div>
  </div>
</template>

<script>
import { noticehistoryone } from '@/api'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      arr: []
    }
  },
  methods: {
    // 获取详情
    list () {
      noticehistoryone(this.id)
        .then(res => {
          if (res.code === 200) {
            this.arr = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    }
  },
  mounted () {
    this.list()
  },
  watch: {
    id (val) {
      console.log(val, 'val')
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(232,232,232,1);
  .line{
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.85);
    line-height: 30px;
    span{
      color:rgba(0,0,0,0.65);
    }
  }
}
.title{
  line-height: 50px;
  font-size:16px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.bottom{
  width:536px;
  height:234px;
  background:rgba(245,245,245,0.5);
  border-radius:4px;
  padding: 16px;
  position: relative;
  .name{
    font-size:18px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    margin-bottom: 10px;
  }
  .text{
    font-size:16px;
    font-family:PingFang-SC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.65);

    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 7;
    overflow: hidden;
  }
  .foot{
    font-size:14px;
    font-family:PingFang-SC-Regular;
    font-weight:400;
    color:rgba(156,156,156,1);
    position: absolute;
    bottom: 16px;
  }
}
</style>
