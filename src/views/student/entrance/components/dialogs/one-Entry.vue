<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="学号:" prop="studentNo">
        <el-input v-model="ruleForm.studentNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="考生号:" prop="examineeNo">
        <el-input v-model="ruleForm.examineeNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="身份证号:" prop="identityCard">
        <el-input v-model="ruleForm.identityCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="毕业学校" prop="graduateSchool">
        <el-input v-model="ruleForm.graduateSchool" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="民族:" prop="nation">
        <el-input v-model="ruleForm.nation" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="是否寄宿:" prop="lodgingFlag">
        <el-radio-group v-model="ruleForm.lodgingFlag">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="户籍:" prop="censusRegister">
        <el-input v-model="ruleForm.censusRegister" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌:" prop="politicalStatus">
        <el-input v-model="ruleForm.politicalStatus" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="语文:" prop="chineseScore">
        <el-input v-model="ruleForm.chineseScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="数学:" prop="mathScore">
        <el-input v-model="ruleForm.mathScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="英语:" prop="englishScore">
        <el-input v-model="ruleForm.englishScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="思想品德:" prop="politicalScore">
        <el-input v-model="ruleForm.politicalScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="化学:" prop="chemistryScore">
        <el-input v-model="ruleForm.chemistryScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="物理:" prop="physicalScore">
        <el-input v-model="ruleForm.physicalScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="体育:" prop="sportsScore">
        <el-input v-model="ruleForm.sportsScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="总分:" prop="totalScore">
        <el-input v-model="ruleForm.totalScore" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="学籍号:" prop="rollNo">
        <el-input v-model="ruleForm.rollNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="出生日期:" prop="birthday">
        <el-date-picker
          v-model="ruleForm.birthday"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="联系人:" prop="contact">
        <el-input v-model="ruleForm.contact" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话:" prop="contactNumber">
        <el-input v-model="ruleForm.contactNumber" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机:" prop="contactCellphone">
        <el-input v-model="ruleForm.contactCellphone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系人地址:" prop="contactAddress">
        <el-input v-model="ruleForm.contactAddress" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" class="btn" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { originstudentcreate } from '@/api'
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        studentNo: '',
        examineeNo: '',
        identityCard: '',
        graduateSchool: '',
        gender: '',
        nation: '',
        lodgingFlag: '',
        censusRegister: '',
        politicalStatus: '',
        chineseScore: '',
        mathScore: '',
        englishScore: '',
        politicalScore: '',
        chemistryScore: '',
        physicalScore: '',
        sportsScore: '',
        totalScore: '',
        rollNo: '',
        birthday: '',
        contact: '',
        contactNumber: '',
        contactCellphone: '',
        contactAddress: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z_.]+$/, message: '只允许输入中文或英文' }
        ],
        studentNo: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只允许输入数字' }
        ],
        examineeNo: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只允许输入数字' }
        ],
        identityCard: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' },
          { pattern: /^(\d{18}|\d{17}X)$/, message: '请输入正确的身份证号' }

        ],
        graduateSchool: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        gender: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        nation: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        lodgingFlag: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        censusRegister: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        politicalStatus: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        chineseScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        mathScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        englishScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        politicalScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        chemistryScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        physicalScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        sportsScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        totalScore: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]\d*)(\.\d*[0-9])?$/, message: '成绩不能为负数' }
        ],
        rollNo: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只允许输入数字' }
        ],
        birthday: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        contactNumber: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '请输入正确的电话号码' }
        ],
        contactCellphone: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/, message: '请输入正确的手机号' }
        ],
        contactAddress: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ]
      }
    }
  },
  methods: {
    // 日期时间转成字符串方法
    formatDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.birthday = this.formatDate(new Date(Date.parse(this.ruleForm.birthday)))
          originstudentcreate(this.ruleForm)
            .then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.footer{
  margin-top: 30px;
  padding-left: 130px;
}
.btn{
  width:65px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
</style>

<style scoped>
.dialogBox >>> .el-form {
  padding-left: 30px;
}
.dialogBox >>> .el-form-item__content{
  width: 400px;
  line-height: 24px;
}
.dialogBox >>> .el-form-item{
  margin-bottom: 20px;
}
.dialogBox >>> .el-form-item__label{
  line-height: 24px;
}
.dialogBox >>> .el-input__inner{
  height: 24px;
}
.dialogBox >>> .el-input__icon{
  line-height: 24px;
}
</style>
