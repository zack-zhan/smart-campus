<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="年级名称:" prop="gradeName">
        <el-input v-model="ruleForm.gradeName"></el-input>
      </el-form-item>
      <el-form-item label="年级别名:" prop="aliasName">
        <el-input v-model="ruleForm.aliasName"></el-input>
      </el-form-item>
      <el-form-item label="年级主任:" prop="leaderCode" class="ts">
        <span class="select" v-if="ruleForm.leaderCode">{{ruleForm.leaderCode}}</span>
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
import { gradeone, gradeupdate } from '@/api'
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
      // 编辑年级表单
      ruleForm: {
        gradeName: '',
        aliasName: '',
        leaderCode: ''
      },
      value: [
        {staffid: ''}
      ], // 选中的
      // 表单验证
      rules: {
        gradeName: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        aliasName: [
          { required: true, message: '请输入班级别名', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        leaderCode: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      gradeone(this.id)
        .then(res => {
          if (res.code === 200) {
            this.ruleForm = res.body
            this.value.staffid = this.ruleForm.leaderCode
            this.ruleForm.leaderCode = res.body.leaderName
            const select = {
              name: this.ruleForm.leaderCode,
              staffid: this.value.staffid
            }
            this.$store.commit('setEditGradeDirector', select)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 添加班主任
    addStaff () {
      this.$emit('editGradeStaff')
    },
    // 选中的值
    select (select) {
      eventBus.$on('select', (select) => {
        this.ruleForm.leaderCode = select.name
        if (select) {
          this.value = select
        }
      })
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            gradeId: this.id,
            gradeName: this.ruleForm.gradeName,
            aliasName: this.ruleForm.aliasName,
            leaderCode: this.value.staffid
          }
          gradeupdate(obj)
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
    this.select()
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
    min-height: 455px;
    padding: 0;
    right: 0;
    top: 100px;
}
.dialogBox >>> .el-dialog__body{
  padding: 0;
}
</style>
