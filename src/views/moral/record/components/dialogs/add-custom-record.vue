<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="德育分:" prop="score">
        <el-select v-model="ruleForm.score">
          <el-option value="1"></el-option>
          <el-option value="2"></el-option>
          <el-option value="3"></el-option>
          <el-option value="4"></el-option>
          <el-option value="5"></el-option>
          <el-option value="6"></el-option>
          <el-option value="7"></el-option>
          <el-option value="8"></el-option>
          <el-option value="9"></el-option>
          <el-option value="10"></el-option>
          <el-option value="-1"></el-option>
          <el-option value="-2"></el-option>
          <el-option value="-3"></el-option>
          <el-option value="-4"></el-option>
          <el-option value="-5"></el-option>
          <el-option value="-6"></el-option>
          <el-option value="-7"></el-option>
          <el-option value="-8"></el-option>
          <el-option value="-9"></el-option>
          <el-option value="-10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述:" prop="description">
        <el-input v-model="ruleForm.description" placeholder="描述说明"></el-input>
      </el-form-item>
      <el-form-item label="被记录人:" prop="studentId">
        <span class="select" v-for="(item,index) in this.$store.state.record.addCustomRecord" :key="index">{{item.name}}</span>
        <span class="add" @click="addRecordStudent">编辑</span>
      </el-form-item>
      <el-form-item label="发生时间:" prop="occurTime">
        <el-date-picker
          v-model="ruleForm.occurTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" class="btn" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { customCreate } from '@/api'
export default {
  data () {
    return {
      // 自定义新增德育记录表单
      ruleForm: {
        score: '',
        description: '',
        studentId: [],
        occurTime: ''
      },
      // 表单验证
      rules: {
        score: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        studentId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        occurTime: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加被记录人
    addRecordStudent () {
      this.$emit('customRecord')
    },
    formatDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = date.getSeconds()
      second = minute < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    // 保存
    save (formName) {
      this.$store.state.record.addCustomRecord.map(item => {
        this.ruleForm.studentId.push(item.id)
      })
      this.ruleForm.studentId = this.ruleForm.studentId.toString()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.occurTime = this.formatDate(this.ruleForm.occurTime)
          console.log(this.ruleForm, '---')
          customCreate(this.ruleForm)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.ruleForm = {}
                this.$store.commit('clearAddCustomRecord')
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
      this.$store.commit('clearAddCustomRecord')
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
  margin-top: 30px;
  padding-left: 100px;
}
.btn{
  width:65px;
  height:32px;
  line-height: 32px;
  padding: 0;
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
.add{
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(24,144,255,1);
  cursor:pointer;
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
.dialogBox >>> .el-input__icon{
  line-height: 32px;
}
.ts >>> .el-input--suffix{
  width: 197px;
  float: left;
}
</style>
