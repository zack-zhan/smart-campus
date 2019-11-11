<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="公告组名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="描述说明"></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model="ruleForm.description" placeholder="描述说明"></el-input>
      </el-form-item>
      <el-form-item label="选择公告组成员:" prop="member">
        <span class="select" v-show="ruleForm.member !== []" v-for="(item,index) in ruleForm.member " :key="index">{{item.title}}</span>
        <span class="add" @click="visible = true">编辑添加</span>
      </el-form-item>
    </el-form>
    <a-modal
      title="添加公告组成员"
      v-model="visible"
      @ok="handleOk"
      cancelText="取消"
      okText="确定"
    >
      <AddMember :visible="visible"></AddMember>
    </a-modal>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import AddMember from './add-member'
import { noticegroupcreate } from '@/api'
export default {
  data () {
    return {
      visible: false,
      // 添加年级表单
      ruleForm: {
        name: '',
        description: '',
        member: []
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        description: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        member: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    AddMember
  },
  methods: {
    handleOk (e) {
      console.log(e)
      console.log(this.$store.state.bulletingroup.teacher, '9090')
      this.ruleForm.member = this.$store.state.bulletingroup.teacher
      this.visible = false
    },

    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const listIds = []
          this.ruleForm.member.map(item => {
            listIds.push(item.key)
          })
          const obj = {
            name: this.ruleForm.name,
            description: this.ruleForm.description,
            listIds: listIds
          }
          console.log(obj, '123')
          noticegroupcreate(obj)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.ruleForm = {}
                this.$store.commit('clearBulletingTeacher')
                this.$emit('success')
              } else {
                this.$message.error(res.message)
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击取消发送关闭方法
    cancel () {
      this.ruleForm = {}
      this.$store.commit('clearBulletingTeacher')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer{
  padding-left: 130px;
}
.btn{
  width:65px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
.add{
  display: inline-block;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(24,144,255,1);
  cursor:pointer;
}
.select{
  display: inline-block;
  padding: 0 5px;
  height:22px;
  line-height: 22px;
  margin-right: 5px;
  background:rgba(245,245,245,1);
  border-radius:4px;
  border:1px solid rgba(217,217,217,1);
}
</style>

<style scoped>
.dialogBox >>> .el-form-item__content{
  width: 400px;
  line-height: 32px;
}
.dialogBox >>> .el-form-item{
  margin-bottom: 30px;
}
.dialogBox >>> .el-form-item__label{
  line-height: 32px;
}
.dialogBox >>> .el-input__inner{
  height: 32px;
  line-height: 32px;
}
.dialogBox >>> .el-input__icon{
  line-height: 32px;
}
.dialogBox >>> .el-input--suffix{
  width: 400px;
}
</style>
