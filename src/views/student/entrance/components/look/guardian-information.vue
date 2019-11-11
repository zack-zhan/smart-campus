<template>
  <div class="main">
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="relationship"
          label="身份">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getStudentKeeperList } from '@/api'
export default {
  data () {
    return {
      id: '', // 学生id
      tableData: [] // 表格数组
    }
  },
  methods: {
    list () {
      getStudentKeeperList(this.id)
        .then(res => {
          if (res && res.code === 200) {
            this.tableData = res.body
          } else {
            this.tableData = []
            this.$message.error(res.message)
          }
        })
    }
  },
  mounted () {
    // 获取路由跳转带过来的参数
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  padding: 15px 32px 20px 32px;
  .btn{
    width:88px;
    height:32px;
    line-height: 32px;
    padding: 0;
    margin-bottom: 20px;
    display: block;
  }
}
</style>

<style scoped>
.table >>> .cell{
  padding-left: 20px;
}
.table >>> .el-table thead tr th{
  height: 54px;
  background:#FAFAFA;
  border-radius:4px 4px 0px 0px;
}
.table >>> .el-table th{
  font-size:14px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.table >>> .el-button--text{
  font-size:14px;
  color: #1890FF;
}
</style>
