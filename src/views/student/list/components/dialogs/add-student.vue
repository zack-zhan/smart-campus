<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="学号：" prop="studentCode">
        <el-input v-model="ruleForm.studentCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="证件类型：" prop="certificateType">
        <el-select v-model="ruleForm.certificateType" placeholder="请选择">
          <el-option label="居民身份证" value="0"></el-option>
          <el-option label="护照" value="1"></el-option>
          <el-option label="回乡证" value="2"></el-option>
          <el-option label="台胞证" value="3"></el-option>
          <el-option label="其他" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件编号：" prop="certificateNo">
        <el-input v-model="ruleForm.certificateNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="民族：" prop="nation">
        <el-input v-model="ruleForm.nation" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="出生年月：" prop="birthday">
        <el-date-picker
          v-model="ruleForm.birthday"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否寄宿：" prop="lodgingFlag">
        <el-radio-group v-model="ruleForm.lodgingFlag">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择">
          <el-option label="待入学" value="0"></el-option>
          <el-option label="已入学" value="1"></el-option>
          <el-option label="已离校" value="2"></el-option>
          <el-option label="休学" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入学时间：" prop="schoolDate">
        <el-date-picker
          v-model="ruleForm.schoolDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="班级：" prop="classId" class="ts">
        <el-select v-model="gradeId" placeholder="请选择">
          <el-option
            v-for="item in gradeList"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
          </el-option>
        </el-select>
        <el-select v-model="ruleForm.classId" placeholder="请选择">
          <el-option
            v-for="item in classList"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宿舍：" v-if="dormitoryShow">
        <span class="select" v-if="ruleForm.dormitoryId.name">{{ruleForm.dormitoryId.name}}</span>
        <span class="add" @click="addSuperiorDialogVisible = true">编辑添加</span>
        <a-modal :footer="null" :visible="addSuperiorDialogVisible" :closable="false" :bodyStyle="bodyStyle">
          <addSuperior @onConfirm="onDormitoryConfirm" @close='addSuperiorDialogVisible = false' :reset="reset"/>
        </a-modal>
      </el-form-item>
      <el-form-item label="身高：" prop="height">
        <el-input v-model="ruleForm.height" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="体重：" prop="weight">
        <el-input v-model="ruleForm.weight" placeholder="请输入" type="number"></el-input>
      </el-form-item>
      <el-form-item label="学生照片：" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" class="btn" @click="sava('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { gradelist, classlistbygradeid, studentcreate, aliOSSSignature } from '@/api'
import addSuperior from './add-dormitory'

import axios from 'axios'
export default {
  data () {
    return {
      gradeList: [], // 年级列表
      gradeId: '', // 选择的年级
      classList: [], // 班级列表
      // 编辑表单
      ruleForm: {
        name: '',
        studentCode: '',
        gender: '',
        certificateType: '',
        certificateNo: '',
        nation: '',
        birthday: '',
        lodgingFlag: '',
        status: '',
        schoolDate: '',
        classId: '',
        dormitoryId: {},
        height: '',
        weight: '',
        avatar: ''
      },
      addSuperiorDialogVisible: false,
      bodyStyle: {
        'padding': '24px 0 0 0'
      },
      reset: false,

      dormitoryShow: true,
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        studentCode: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只允许输入数字' }
        ],
        gender: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        certificateType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        certificateNo: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '请输入正确的证件编号' }
        ],
        nation: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        birthday: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        lodgingFlag: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        schoolDate: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        height: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([1-9]\d*)(\.\d*[1-9])?$/, message: '身高不能为0或者负数' }
        ],
        weight: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([1-9]\d*)(\.\d*[1-9])?$/, message: '体重不能为0或者负数' }
        ],
        avatar: [
          { required: true, message: '请上传', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    addSuperior
  },
  watch: {
    // 监听细则分类的数据变化
    'gradeId' (val) {
      this.ruleForm.classId = ''
      if (val) {
        classlistbygradeid(val)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.classList = res.body
            } else {
              this.$message.error(res.message)
            }
          })
      }
    },
    'ruleForm.lodgingFlag' (val) {
      console.log(val, '------')
      if (val === '0') {
        this.dormitoryShow = false
      } else {
        this.dormitoryShow = true
      }
    }
  },
  methods: {
    // 获取年级列表
    grade () {
      gradelist()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.gradeList = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    onDormitoryConfirm (selectArr) {
      this.ruleForm.dormitoryId = selectArr
      console.log(selectArr, '0-0-')
      this.addSuperiorDialogVisible = false
    },
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
    sava (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.birthday = this.formatDate(new Date(Date.parse(this.ruleForm.birthday)))
          this.ruleForm.schoolDate = this.formatDate(new Date(Date.parse(this.ruleForm.schoolDate)))
          const dormitory = this.ruleForm.dormitoryId

          this.ruleForm.dormitoryId = this.ruleForm.dormitoryId.id
          console.log(this.ruleForm)
          studentcreate(this.ruleForm)
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')

                this.ruleForm = {}
                this.ruleForm.dormitoryId = {}
                this.gradeId = ''

                this.reset = true
              } else {
                this.$message.error(res.message)
                this.ruleForm.dormitoryId = dormitory
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
      this.ruleForm.dormitoryId = {}
      this.gradeId = ''
      this.$emit('close')
      this.reset = true
    },
    beforeAvatarUpload (file) {
      console.log(file, '--------')
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if ((isJPG || isPNG) && isLt2M) {
        const tmpcnt = file.name.lastIndexOf('.')
        const ext = file.name.substring(tmpcnt + 1)
        aliOSSSignature().then(res => {
          if (res.code === 200) {
            let formData = new FormData()
            formData.append('key', `${file.uid}.${ext}`)
            formData.append('OSSAccessKeyId', res.body.accessKeyId)
            formData.append('policy', res.body.policy)
            formData.append('Signature', res.body.signature)
            formData.append('success_action_status', '200')
            formData.append('file', file)
            axios.post(res.body.host, formData)
              .then(response => {
                if (response.status === 200) {
                  this.ruleForm.avatar = `${res.body.host}/${file.uid}.${ext}`
                }
              })
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  },
  mounted () {
    this.grade()
    console.log(this.ruleForm.dormitory, '--')
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
.avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 104px;
    height: 104px;
    line-height: 104px;
    text-align: center;
  }
  .avatar {
    width: 104px;
    height: 104px;
    display: block;
  }

.dialogBox >>> .el-form-item__content{
  width: 400px;
  line-height: 24px;
}
.dialogBox >>> .el-form-item__label{
  line-height: 24px;
}
.dialogBox >>> .el-input__inner{
  height: 24px;
  line-height: 24px;
}
.dialogBox >>> .el-input__icon{
  line-height: 24px;
}
.dialogBox >>> .el-input--suffix{
  width: 400px;
}
.ts >>> .el-input--suffix{
  width: 197px;
  float: left;
}
</style>
