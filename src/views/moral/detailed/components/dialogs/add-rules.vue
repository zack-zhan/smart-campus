<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="细则内容:" prop="ruleName">
        <el-input v-model="ruleForm.ruleName" placeholder="请输入细则内容"></el-input>
      </el-form-item>
      <el-form-item label="德育分:" prop="score" style="width:30%">
        <el-input v-model="ruleForm.score" type="number"></el-input>
      </el-form-item>
      <el-form-item label="细则类型:" prop="groupId">
        <el-select v-model="ruleForm.groupId" placeholder="请选择细则类型">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { groupsAll, rulesCreate } from '@/api'
export default {
  data () {
    return {
      typeList: [], // 类型数组
      // 新增细则表单
      ruleForm: {
        ruleName: '',
        score: '',
        groupId: ''
      },
      // 表单验证
      rules: {
        ruleName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取细则类型列表
    type () {
      groupsAll()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.typeList = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          rulesCreate(this.ruleForm)
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')
                this.ruleForm = {}
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
      this.$emit('close')
    }
  },
  mounted () {
    this.type()
  }
}
</script>

<style lang="scss" scoped>
.footer{
  padding-left: 100px;
}
.btn{
  width:65px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
</style>

<style scoped>
.dialogBox >>> .el-dialog__body{
  padding: 0;
}
.dialogBox >>> .el-form-item{
  margin-bottom: 30px;
}
.dialogBox >>> .el-form-item__label{
  width: 100px !important;
  line-height: 32px;
}
.dialogBox >>> .el-form-item__content{
  width: 400px;
  margin-left: 100px !important;
  height: 32px;
  line-height: 32px;
}
.dialogBox >>> .el-form-item__label{
  line-height: 32px;
}
.dialogBox >>> .el-input__inner{
  height: 32px;
  line-height: 32px;
}
</style>
