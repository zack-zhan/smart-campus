<template>
  <div class="content">
    <div class="box">
      <div class="title">入学操作指引</div>
      <div class="titlebar">
        <a-button class="btn" @click="add">新增</a-button>
        <a-button class="btn" @click="disabled = false">编辑</a-button>
        <a-button type="primary" @click="handleSubmit" class="btn">保存</a-button>
      </div>
      <div class="form">
        <a-form
          :form="form"
        >
          <a-form-item
            v-for="(item,index) in arr"
            :key="item.processId"
            :label="index+1"
          >
            <a-input
              v-decorator="[
                `${index+1}`,
                {rules: [{ required: true, message: '请输入' },{pattern:'^[\u4e00-\u9fa5_a-zA-Z0-9_，。]+$',message:'不允许输入特殊字符'}], initialValue: item.content}
              ]"
              :disabled="disabled"
            />
            <div class="ts">
              <a-button class="btn" @click="del(item.sort)">删除</a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { processlist, batchinsertprocesslist } from '@/api'
export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      disabled: true,

      arr: [],
      arrLength: null
    }
  },
  methods: {
    initialList () {
      processlist()
        .then(res => {
          if (res.code === 200) {
            this.arr = []
            res.body.map(item => {
              if (item.content) {
                this.arr.push(item)
              }
            })
          } else {
            this.$message.error(res.message)
          }
        })
    },
    list () {
      processlist()
        .then(res => {
          if (res.code === 200) {
            this.arr = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 新增
    add () {
      this.disabled = false
      this.arr.push({content: ''})
      console.log('新增', this.arr)
      this.$message.success('新增成功')
    },
    // 保存
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          let arr = []
          for (let i in values) {
            arr.push(values[i])
          }
          let list = []
          arr.forEach((item, index) => {
            const obj = {}
            obj.content = item
            obj.sort = index + 1
            list.push(obj)
          })
          batchinsertprocesslist(list).then(res => {
            if (res.code === 200) {
              this.list()
              this.disabled = true
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    // 删除
    del (index) {
      console.log(index, 'index')
      console.log(this.arr)

      let lists = [...this.arr].filter(e => e.sort !== index)
      console.log('lists', lists)
      this.arr = lists

      this.arrLength = lists.length
    },
    delMethod () {
      console.log(this.arr, 'arr')
      let list = []
      this.arr.forEach((item, index) => {
        const obj = {}
        obj.content = item.content
        obj.sort = index + 1
        list.push(obj)
      })
      batchinsertprocesslist(list).then(res => {
        if (res.code === 200) {
          this.list()
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  watch: {
    arrLength (val) {
      console.log(val, 'length')
      this.delMethod()
    }
  },
  created () {
    this.initialList()
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  height: calc(100vh - 65px);
  background: #E9E9E9;
  padding: 20px;
  overflow: auto;
  .box{
    width: 100%;
    background: #fff;
    padding-bottom: 100px;
    .title{
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid rgba(233,233,233,1);
      padding-left: 32px;
      font-size:16px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,0,0,0.85);
    }
    .titlebar{
      line-height: 60px;
      padding-left: 32px;
      .btn{
        width: 88px;
        height: 32px;
        line-height: 32px;
        padding: 0;
      }
    }
    .form{
      width: 550px;
      margin: 0 auto;
      margin-bottom: 50px;
    }
    .btn{
      width: 60px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      margin-left: 20px;
    }
    .ts{
      display: inline-block;
    }
  }
}
</style>

<style scoped>
.form >>> .ant-input{
  width: 400px;
}
.form >>> .ant-form-item-label{
  float: left;
}
.form >>> .ant-form-item-control-wrapper{
  float: left;
}
</style>
