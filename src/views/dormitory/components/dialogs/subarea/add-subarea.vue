<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分区名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="上级分区:">
        <span class="select" v-if="ruleForm.superior !== ''">{{ruleForm.superior}}</span>
        <span class="add" @click="addSuperior">编辑添加</span>
        <el-dialog title="添加上级分区" :visible.sync="addSuperiorDialogVisible">
          <AddSuperior v-if="addSuperiorDialogVisible" @close='closeDialog'></AddSuperior>
        </el-dialog>
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model="ruleForm.description" placeholder="输入描述"></el-input>
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
import AddSuperior from './add-superior'
import { dormitoryPartitioncreate } from '@/api'
export default {
  data () {
    return {
      // 表单
      ruleForm: {
        name: '',
        superior: '',
        description: ''
      },
      selectArr: [], // 选中的数组
      addSuperiorDialogVisible: false, // 添加上级分区弹框
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        description: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ]
      }
    }
  },
  components: {
    AddSuperior
  },
  methods: {
    // 添加上级分区
    addSuperior () {
      this.addSuperiorDialogVisible = true
    },
    // 选中的值
    select () {
      eventBus.$on('selectArr', (selectArr) => {
        console.log(selectArr, '---')
        // this.ruleForm.superior = selectArr.length > 0 ? selectArr.name : ''
        this.ruleForm.superior = selectArr.name
        this.selectArr = selectArr
      })
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.selectArr)
          const obj = {
            name: this.ruleForm.name,
            parentId: this.selectArr.id,
            description: this.ruleForm.description
          }
          dormitoryPartitioncreate(obj)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')

                this.ruleForm = {}
                this.ruleForm.superior = ''
                this.selectArr = []
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
    // 关闭弹出框
    closeDialog () {
      this.addSuperiorDialogVisible = false
    },
    // 点击取消发送关闭方法
    cancel () {
      this.ruleForm = {}
      this.ruleForm.superior = ''
      this.selectArr = []
      this.$emit('close')
    }
  },
  mounted () {
    this.select()
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

.dialogBox >>> .el-dialog__body{
  padding: 0;
}
.dialogBox >>> .el-dialog {
    width: 474px;
    min-height: 445px;
    padding: 0;
    right: 0;
    top: 100px;
}
</style>
