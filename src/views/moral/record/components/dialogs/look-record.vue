<template>
  <div class="dialogBox">
    <!-- <el-button class="btn" type="primary" @click="cancel">返回</el-button> -->
    <!-- <el-button class="btn" @click="repeal">撤销</el-button> -->
    <div>学生姓名：<span>{{arr.studentName}}</span></div>
    <div>学号：<span>{{arr.studentCode}}</span></div>
    <div>班级：<span>{{arr.gradeName}}</span></div>
    <div>细则分类：<span>{{arr.ruleGroupName}}</span></div>
    <div>细则内容：<span>{{arr.ruleName}}</span></div>
    <div>德育分：<span>{{arr.score}}</span></div>
    <div>问题描述：<span>{{arr.description}}</span></div>
    <div>发生时间：<span>{{arr.occurTime}}</span></div>
    <div>录入时间：<span>{{arr.processingTime}}</span></div>
  </div>
</template>

<script>
import Repeal from './repeal' // 引入撤销弹框组件
import { recordsOne } from '@/api'
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
  components: {
    Repeal
  },
  methods: {
    // 获取详情
    list () {
      recordsOne(this.id)
        .then(res => {
          if (res.code === 200) {
            this.arr = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 点击取消发送关闭方法
    cancel () {
      this.$emit('close')
    }
  },
  mounted () {
    this.list()
  },
  watch: {
    id (val) {
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  padding: 0 10px;
}
.btn{
  width:74px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
div{
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,0.85);
  line-height: 40px;
  span{
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.65);
  }
}
</style>
