<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="别名:" prop="aliasName">
        <el-input v-model="ruleForm.aliasName" placeholder="输入别名"></el-input>
      </el-form-item>
      <el-form-item label="证件号码:" prop="cardNo">
        <el-input v-model="ruleForm.cardNo" placeholder="输入证件号码"></el-input>
      </el-form-item>
      <el-form-item label="手机:" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="部门:" prop="departmentList">
        <span class="select" v-for="(item,index) in selectList" :key="index">{{item.name}}</span>
        <span class="add" @click="addDepartment">编辑添加</span>
        <el-dialog title="添加部门" :visible.sync="departmentDialogVisible">
          <AddDepartment v-if="departmentDialogVisible" :select-list="selectList" @close='closeDialog'></AddDepartment>
        </el-dialog>
      </el-form-item>
      <el-form-item label="职位:" prop="position">
        <el-input v-model="ruleForm.position" placeholder="输入职位名称"></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="ruleForm.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="员工照片:" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注:" prop="remarks">
        <el-input v-model="ruleForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import AddDepartment from './add-department' // 引入添加部门弹框组件
import { staffcreate, aliOSSSignature } from '@/api'

import axios from 'axios'
export default {
  data () {
    let email = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    let isEmail = (rule, value, callback) => {
      if (!email.test(value)) {
        return callback(new Error('请输入有效的邮箱'))
      } else {
        callback()
      }
    }
    return {
      // 基础信息表单
      ruleForm: {
        name: '',
        aliasName: '',
        cardNo: '',
        mobile: '',
        departmentList: [],
        position: '',
        gender: '',
        email: '',
        avatar: '',
        remarks: ''
      },
      departmentDialogVisible: false, // 添加部门弹框
      selectList: [], // 选中的部门列表
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只允许输入中文' }
        ],
        aliasName: [
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        cardNo: [
          { required: true, message: '请输入证件号码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '请输入正确的证件号码' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/, message: '请输入正确的手机号' }
        ],
        departmentList: [
          { required: true, message: '请添加部门', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职位', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        gender: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: isEmail}
        ],
        avatar: [
          { required: true, message: '请上传照片', trigger: 'blur' }
        ],
        remarks: [
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ]
      }
    }
  },
  components: {
    AddDepartment
  },
  methods: {
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          staffcreate(this.ruleForm)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')

                this.ruleForm.name = ''
                this.ruleForm.aliasName = ''
                this.ruleForm.cardNo = ''
                this.ruleForm.mobile = ''
                this.ruleForm.departmentList = []
                this.ruleForm.position = ''
                this.ruleForm.gender = ''
                this.ruleForm.email = ''
                this.ruleForm.avatar = ''
                this.ruleForm.remarks = ''
                this.selectList = ''
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
    // 发送关闭事件
    cancel () {
      this.ruleForm.name = ''
      this.ruleForm.aliasName = ''
      this.ruleForm.cardNo = ''
      this.ruleForm.mobile = ''
      this.ruleForm.departmentList = []
      this.ruleForm.position = ''
      this.ruleForm.gender = ''
      this.ruleForm.email = ''
      this.ruleForm.avatar = ''
      this.ruleForm.remarks = ''
      this.selectList = ''
      this.$emit('close')
    },
    // 添加部门
    addDepartment () {
      this.departmentDialogVisible = true
      this.selectList = this.ruleForm.departmentList
    },

    // 关闭弹出框
    closeDialog () {
      this.departmentDialogVisible = false
    },

    beforeAvatarUpload (file) {
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

.dialogBox >>> .el-dialog__body{
  padding: 0;
}
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
.dialogBox >>> .el-dialog {
    width: 474px;
    min-height: 445px;
    padding: 0;
    right: 0;
    top: 100px;
}
</style>
