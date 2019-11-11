<template>
  <div class="main">
    <el-button class="btn" @click="addDialogVisible = true">新增监护人</el-button>
    <a-drawer
      title="添加监护人"
      placement="right"
      :closable="false"
      :visible="addDialogVisible"
      width="600"
    >
      <AddGuardian :id="id" @success='success' @close='closeDialog'></AddGuardian>
    </a-drawer>
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
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <a-popconfirm title="您确定要删除吗?" @confirm="del(scope.row)" okText="确定" cancelText="取消">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <a-drawer
      title="编辑监护人"
      placement="right"
      :closable="false"
      :visible="editDialogVisible"
      width="600"
    >
      <EditGuardian :id="editId" :visible="editDialogVisible" @success='success' @close='closeDialog'></EditGuardian>
    </a-drawer>
  </div>
</template>

<script>
import AddGuardian from './dialogs/add-guardian' // 引入新增监护人弹框组件
import EditGuardian from './dialogs/edit-guardian' // 引入新增监护人弹框组件
import { studentkeeperlist, studentkeeperdelete } from '@/api'
export default {
  data () {
    return {
      id: '', // 学生id
      addDialogVisible: false, // 新增监护人弹框
      editDialogVisible: false, // 编辑监护人弹框
      editId: '',

      tableData: [] // 表格数组
    }
  },
  components: {
    AddGuardian,
    EditGuardian
  },
  methods: {
    list () {
      studentkeeperlist(this.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.body
          } else {
            this.tableData = []
            this.$message.error(res.message)
          }
        })
    },
    // 编辑
    edit (row) {
      console.log(row, '111')
      this.editId = row.id
      console.log(this.editId, '222')
      this.editDialogVisible = true
    },
    // 删除
    del (row) {
      console.log(row)
      studentkeeperdelete(row.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 成功操作
    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addDialogVisible = false
      this.editDialogVisible = false
    }
  },
  mounted () {
    // 获取路由跳转带过来的参数
    console.log(this.$route.query.id)
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
