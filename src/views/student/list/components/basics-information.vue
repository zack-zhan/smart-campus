<template>
  <div class="main">
    <el-button class="btn" @click="editDialogVisible = true">编辑</el-button>
    <a-drawer
      title="编辑学生"
      placement="right"
      :closable="false"
      :visible="editDialogVisible"
      width="600"
    >
      <Edit :visible="editDialogVisible" @success='success' @close='closeDialog'></Edit>
    </a-drawer>
    <div class="left fl">
      <div>姓名：<span>{{arr.name}}</span></div>
      <div>学号：<span>{{arr.studentCode}}</span></div>
      <div>性别：<span>{{arr.genderStr}}</span></div>
      <div>证件类型：<span>{{arr.certificateTypeStr}}</span></div>
      <div>证件编号：<span>{{arr.certificateNo}}</span></div>
      <div>民族：<span>{{arr.nation}}</span></div>
      <div>出生年月：<span>{{arr.birthday}}</span></div>
      <div>是否寄宿：<span>{{arr.lodgingFlagStr}}</span></div>
      <div>状态：<span>{{arr.statusStr}}</span></div>
      <div>入学时间：<span>{{arr.schoolDate}}</span></div>
      <div>班级：<span>{{arr.gradeClass === 'null null'?'':arr.gradeClass}}</span></div>
      <div>宿舍：<span>{{arr.dormitoryName}}</span></div>
      <div>身高：<span>{{arr.height}}</span></div>
      <div>体重：<span>{{arr.weight}}</span></div>
    </div>
    <div class="right fl">
      <img :src="arr.avatar" alt="">
    </div>
  </div>
</template>

<script>
import Edit from './dialogs/edit-student' // 引入编辑弹框组件
import { studentone } from '@/api'
export default {
  data () {
    return {
      id: '', // 学生id
      editDialogVisible: false, // 编辑弹框

      arr: [] // 列表数组
    }
  },
  components: {
    Edit
  },
  methods: {
    // 获取详情
    list () {
      studentone(this.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.arr = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 成功操作
    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.editDialogVisible = false
    }
  },
  mounted () {
    // 获取路由跳转带过来的参数
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  padding-left: 32px;
  padding-top: 15px;
  overflow: hidden;
  .btn{
    width:88px;
    height:32px;
    line-height: 32px;
    padding: 0;
    margin-bottom: 20px;
    display: block;
  }
  .left{
    width: 40%;
    div{
      margin-bottom: 20px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.85);
      span{
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.65);
      }
    }
  }
  .right{
    width: 60%;
    img{
      width: 128px;
      height: 128px;
    }
  }
}
</style>
