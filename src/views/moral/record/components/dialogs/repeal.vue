<template>
  <div class="dialogBox">
    <div class="content">
      <div class="line">
        <div>撤销原因：</div>
        <div><el-input v-model="cause" placeholder="输入撤销原因"></el-input></div>
      </div>
      <div class="line">
        <div>被处理人： {{name}}</div>
      </div>
    </div>
    <div class="footer">
      <el-button class="btn" @click="cancel">取消</el-button>
      <el-button class="btn" type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>

<script>
import { revoke } from '@/api'
export default {
  // props: ['id', 'name'],
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cause: ''
    }
  },
  methods: {
    // 确认
    confirm () {
      const obj = {
        'recordid': this.id,
        'cancelReason': this.cause
      }
      revoke(obj)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('撤销成功')
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 点击取消发送关闭方法
    cancel () {
      this.cause = ''
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  .content{
    height: 162px;
    padding: 20px 59px;
    .line{
      width: 100%;
      height: 32px;
      line-height: 32px;
      margin-bottom: 30px;
      div:nth-child(1){
        float: left;
      }
      div:nth-child(2){
        float: right;
      }
    }
  }
  .footer{
    text-align: right;
    padding-right: 16px;
    height: 55px;
    line-height: 55px;
    border-top: 1px solid rgba(208,206,206,1);
    .btn{
      width:65px;
      height:32px;
      line-height: 32px;
      padding: 0;
    }
  }
}
</style>

<style scoped>
.content >>> .el-input{
  width: 294px;
}
.content >>> .el-input__inner{
  width: 294px;
  height: 32px;
}
</style>
