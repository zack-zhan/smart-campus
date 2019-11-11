<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="班级名称:" prop="className">
        <el-input v-model="ruleForm.className" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="班级别名:" prop="aliasName">
        <el-input v-model="ruleForm.aliasName" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="所属年级:" prop="gradeId">
        <el-select v-model="ruleForm.gradeId" placeholder="请选择" @focus="grade">
          <el-option
            v-for="item in gradeList"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班主任：" prop="teacherId" class="ts">
        <span class="select" v-if="ruleForm.teacherId.name">{{ruleForm.teacherId.name}}</span>
        <span class="add" @click="addStaff">编辑添加</span>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" type="primary" @click="save('ruleForm')">保存</el-button>
      <el-button class="btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import eventBus from './eventBus.js' // 事件车
import { gradelist, classcreate } from '@/api'
export default {
  data () {
    return {
      gradeList: [], // 年级列表
      // 添加班级表单
      ruleForm: {
        className: '',
        aliasName: '',
        gradeId: '',
        teacherId: ''
      },
      addStaffDialogVisible: false,
      // 表单验证
      rules: {
        className: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        aliasName: [
          { required: true, message: '请输入班级别名', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        gradeId: [
          { required: true, message: '请选择所属年级', trigger: 'blur' }
        ],
        teacherId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
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
            console.log(this.gradeList, '0')
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 添加班主任
    addStaff () {
      this.$emit('addClassStaff')
    },
    // 选中的值
    select (select) {
      eventBus.$on('select', (select) => {
        this.ruleForm.teacherId = select
      })
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            className: this.ruleForm.className,
            aliasName: this.ruleForm.aliasName,
            gradeId: this.ruleForm.gradeId,
            teacherId: this.ruleForm.teacherId.staffid
          }
          classcreate(obj)
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')

                this.ruleForm.className = ''
                this.ruleForm.aliasName = ''
                this.ruleForm.gradeId = ''
                this.ruleForm.teacherId = ''
                this.$store.commit('setAddClassDirector', {})
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
      this.ruleForm.className = ''
      this.ruleForm.aliasName = ''
      this.ruleForm.gradeId = ''
      this.ruleForm.teacherId = ''
      this.$emit('close')

      this.$store.commit('setAddClassDirector', {})
    }
  },
  mounted () {
    this.select()
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
.ts >>> .el-input--suffix{
  width: 197px;
  float: left;
}

.dialogBox >>> .el-dialog {
    width: 474px;
    min-height: 485px;
    padding: 0;
    right: 0;
    top: 100px;
}
.dialogBox >>> .el-dialog__body{
  padding: 0;
}
</style>
