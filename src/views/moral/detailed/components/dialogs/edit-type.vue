<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="类型名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item label="类型描述:" prop="description">
        <el-input v-model="ruleForm.description" placeholder="描述说明"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { groupsOne, groupsUpdate } from '@/api'
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
      // 编辑细则类型表单
      ruleForm: {
        name: '',
        description: ''
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      groupsOne(this.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.ruleForm = res.body
            console.log(this.ruleForm)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          groupsUpdate(this.ruleForm)
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
