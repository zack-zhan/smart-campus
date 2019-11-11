<template>
  <div class="dialogBox">
    <div class="box">
      <div class="fl">
        <span>宿舍楼栋</span>
        <span>{{arr.dormitoryGroup}}</span>
      </div>
      <div class="fl">
        <span>宿舍号</span>
        <span>{{arr.dormitoryName}}</span>
      </div>
    </div>
    <div class="bunk">
      <div class="title">宿舍床位</div>
      <div v-for="(item,index) in arr.listDto" :key="index">
          <span v-if="item.bunkName">{{item.bunkName}}：</span><span>{{item.studentName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { dormitoryone } from '@/api'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      arr: [] // 列表数组
    }
  },
  methods: {
    // 获取列表
    list () {
      dormitoryone(this.id)
        .then(res => {
          if (res.code === 200) {
            this.arr = res.body
            console.log(this.arr.listDto)
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
.dialogBox{
  padding: 0 11px;
  .box{
    overflow: hidden;
    div{
      width: 200px;
      span{
        display: block;
      }
      span:nth-child(1){
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.45);
      }
      span:nth-child(2){
        font-size:24px;
        font-family:HelveticaNeue;
        color:rgba(0,0,0,0.85)
      }
    }
  }
  .bunk{
    margin-top: 50px;
    div{
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.85);
      margin-bottom: 15px;
      span:nth-child(2){
        color:rgba(0,0,0,0.65);
      }
    }
    .title{
      font-size:16px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,0,0,0.85);
      margin-bottom: 20px;
    }
  }
}
</style>
