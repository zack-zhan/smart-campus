<template>
  <div class="dialogBox">
    <div class="main">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输搜索内容"
        :titles="['选择','已选']"
        v-model="value"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :data="data">
      </el-transfer>
    </div>
    <div class="footer">
      <div>
        <el-button class="btn" type="primary" @click="save">保存</el-button>
        <el-button class="btn" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { studentlist } from '@/api'
export default {
  data () {
    return {
      data: [], // 穿梭框数组
      value: [], // 已选择数组
      filterMethod (query, item) {
        return item.name.indexOf(query) > -1
      } // 自定义搜索方法
    }
  },
  methods: {
    // 获取列表
    list () {
      studentlist()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.data = res.body

            const data = this.$store.state.record.addRecord
            if (data.length > 0) {
              data.map(item => {
                this.value.push(item.id)
              })
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 保存
    save () {
      this.$store.commit('clearAddRecord')
      const data = this.data.filter(x => this.value.findIndex(m => m === x.id) > -1)
      console.log(data, '---')
      data.map(item => {
        this.$store.commit('setAddRecord', item)
      })
      this.$emit('close')
    },
    // 点击取消发送关闭方法
    cancel () {
      this.$emit('close')
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  padding: 0;
}
.main{
  height: 260px;
  margin: 32px;
}
.footer{
  height: 55px;
  line-height: 55px;
  width: 100%;
  border-top: 1px solid rgba(233,233,233,1);
  div{
    float: right;
    padding-right: 15px;
  }
}
.btn{
  width:65px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
</style>

<style scoped>
.dialogBox >>> .el-transfer-panel{
  width: 176px;
}
.dialogBox >>> .el-transfer__buttons{
  padding: 0 10px;
}
.dialogBox >>> .el-transfer-panel__body {
    height: 200px;
}
.dialogBox >>> .el-transfer-panel__list.is-filterable {
    height: 150px;
}
.dialogBox >>> .el-transfer-panel__item {
  display: block !important;
}
</style>
