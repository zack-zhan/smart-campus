<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="身份：" prop="relationship">
        <el-select v-model="ruleForm.relationship" placeholder="请选择">
          <el-option label="父亲" value="0"></el-option>
          <el-option label="母亲" value="1"></el-option>
          <el-option label="祖父" value="3"></el-option>
          <el-option label="祖母" value="2"></el-option>
          <el-option label="兄弟" value="4"></el-option>
          <el-option label="姊妹" value="5"></el-option>
          <el-option label="其他" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入名字"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="ruleForm.address" placeholder="输入地址"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" class="btn" @click="sava('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { studentkeeperone, studentkeeperupdate } from '@/api'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      // 添加监护人表单
      ruleForm: {
        relationship: '',
        name: '',
        phone: '',
        address: ''
      },
      // 表单验证
      rules: {
        relationship: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/, message: '请输入正确的手机号' }
        ],
        address: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ]
      }
    }
  },
  methods: {
    list () {
      studentkeeperone(this.id)
        .then(res => {
          if (res.code === 200) {
            this.ruleForm = res.body
            this.ruleForm.relationship = res.body.relationshipType.toString()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 保存
    sava (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, '---------')
          const obj = {
            id: this.id,
            relationshipType: parseInt(this.ruleForm.relationship),
            name: this.ruleForm.name,
            phone: this.ruleForm.phone,
            address: this.ruleForm.address
          }
          studentkeeperupdate(obj)
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('保存成功')
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
      this.$emit('close')
    }
  },
  mounted () {
    this.list()
  },
  watch: {
    visible (val) {
      console.log(val, 'val')
      if (val) {
        this.list()
      }
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
}
.dialogBox >>> .el-input__icon{
  line-height: 32px;
}
.dialogBox >>> .el-input--suffix{
  width: 400px;
}
</style>
