<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="部门名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="排序号:" prop="sortNo">
        <el-input v-model="ruleForm.sortNo" placeholder="输入排序号" type="number"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { departmentcreate } from '@/api'
export default {
  props: {
    parentId: {
      type: String,
      required: true
    }
  },
  data () {
    let specialKey = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    let isSpecialKey = (rule, value, callback) => {
      if (!specialKey.test(value)) {
        return callback(new Error('不允许输入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      // 部门信息表单
      ruleForm: {
        name: '',
        sortNo: ''
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { validator: isSpecialKey }
        ]
      }
    }
  },
  methods: {
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const request = {
            ...this.ruleForm
          }
          request.parentid = this.parentId
          request.sortNo = parseInt(request.sortNo)
          departmentcreate(request)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.ruleForm = {}
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
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  padding: 0 30px;
}
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
.dialogBox >>> .ant-input-number {
  width: 400px;
}
</style>
