<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="宿舍名称:" prop="dormitoryName">
        <el-input v-model="ruleForm.dormitoryName" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="宿舍类型:" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio label="1">全宿</el-radio>
          <el-radio label="2">午休</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="床位数量:" prop="bund">
        <el-input v-model="ruleForm.bund" placeholder="输入数量" type="number"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { dormitoryone, dormitoryupdate } from '@/api'
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
      ruleForm: {
        id: this.id,
        dormitoryName: '',
        type: '',
        bund: ''
      },
      rules: {
        dormitoryName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        bund: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      dormitoryone(this.id)
        .then(res => {
          if (res.code === 200) {
            this.ruleForm.dormitoryName = res.body.dormitoryName
            this.ruleForm.type = res.body.type.toString()
            this.ruleForm.bund = res.body.bund
          } else {
            this.$message.error(res.message)
          }
        })
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            id: this.id,
            dormitoryName: this.ruleForm.dormitoryName,
            type: parseInt(this.ruleForm.type),
            bund: this.ruleForm.bund
          }
          dormitoryupdate(obj)
            .then(res => {
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
.dialogBox >>> .el-input__icon{
  line-height: 32px;
}
.dialogBox >>> .el-input--suffix{
  width: 197px;
}
</style>
