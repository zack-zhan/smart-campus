<template>
  <div class="dialogBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="宿舍名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="所属区域:" prop="area">
        <span class="select" v-if="ruleForm.area !== ''">{{ruleForm.area}}</span>
        <span class="add" @click="addSuperior">编辑添加</span>
        <el-dialog title="添加所属区域" :visible.sync="addSuperiorDialogVisible">
          <AddSuperior v-if="addSuperiorDialogVisible" @close='closeDialog'></AddSuperior>
        </el-dialog>
      </el-form-item>
      <el-form-item label="宿舍类型:" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio label="1">全宿</el-radio>
          <el-radio label="2">午休</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="床位数量:" prop="num">
        <el-input v-model="ruleForm.num" placeholder="输入数量"></el-input>
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
import { dormitorycreate } from '@/api'
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        area: '',
        type: '',
        num: ''
      },
      selectArr: [], // 选中的数组
      addSuperiorDialogVisible: false, // 添加上级分区弹框
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '不允许输入特殊字符' }
        ],
        area: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([1-9]\d*)(\.\d*[1-9])?$/, message: '宿舍床位不能为0或者负数' }
        ]
      }
    }
  },
  components: {
    AddSuperior
  },
  methods: {
    // 添加所属区域
    addSuperior () {
      this.addSuperiorDialogVisible = true
    },
    // 选中的值
    select () {
      eventBus.$on('selectArr', (selectArr) => {
        console.log(selectArr)
        // this.ruleForm.area = selectArr.length > 0 ? selectArr.name : ''
        this.ruleForm.area = selectArr.name
        this.selectArr = selectArr
      })
    },
    // 保存
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            dormitoryName: this.ruleForm.name,
            type: this.ruleForm.type,
            bund: this.ruleForm.num,
            parentId: this.selectArr.id
          }
          dormitorycreate(obj)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')

                this.ruleForm = {}
                this.ruleForm.area = ''
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
      this.ruleForm.area = ''
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
.dialogBox >>> .el-input--suffix{
  width: 400px;
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
