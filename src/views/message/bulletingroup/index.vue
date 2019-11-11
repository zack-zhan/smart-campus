<template>
  <div class="content">
    <div class="box">
      <div class="title">公告组管理</div>
      <div class="titlebar"><el-button class="btn" @click="addDialogVisible = true">添加公告组</el-button></div>
        <a-drawer
          title="新建公告组"
          placement="right"
          :closable="false"
          :visible="addDialogVisible"
          width="600"
        >
          <Add @success='success' @close='closeDialog'></Add>
        </a-drawer>
      <el-table
        :data="tableData">
        <el-table-column
          prop="name"
          label="公告组">
        </el-table-column>
        <el-table-column
          prop="totalCount"
          label="人数">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <a-popconfirm title="您确定要删除吗?" @confirm="del(scope.row)" okText="确定" cancelText="取消">
              <a href="#" style="font-size:14px;">删除</a>
            </a-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <a-drawer
          title="编辑公告组"
          placement="right"
          :closable="false"
          :visible="editDialogVisible"
          width="600"
      >
        <Edit :id="editId" :visible="editDialogVisible" @success='success' @close='closeDialog'></Edit>
      </a-drawer>
      <div class="paging">
        <a-locale-provider :locale="zhCN">
          <a-pagination
            :total="total"
            showSizeChanger
            showQuickJumper
            :current="currentPage"
            :pageSize="pageSize"
            @change="changePage"
            @showSizeChange="changeSize"
          />
          </a-locale-provider>
      </div>
    </div>
  </div>
</template>

<script>
import Add from './components/dialogs/add-bulletingroup' // 引入添加公告组弹框组件
import Edit from './components/dialogs/edit-bulletingroup' // 引入编辑公告组弹框组件
import { noticegrouppage, noticegroupdelete } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      addDialogVisible: false,
      editDialogVisible: false,
      tableData: [],

      editId: '',

      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    Add,
    Edit
  },
  methods: {
    // 获取列表
    list () {
      const obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      noticegrouppage(obj)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.body.records
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 编辑
    edit (row) {
      console.log(row)
      this.editId = row.id
      console.log(this.editId, 'id')
      this.editDialogVisible = true
    },
    // 删除
    del (row) {
      console.log(row)
      noticegroupdelete(row.id)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addDialogVisible = false
      this.editDialogVisible = false
    },

    changePage (page) {
      console.log(page, 'page')
      this.currentPage = page
      this.list()
    },
    changeSize (current, size) {
      console.log(current, 'current')
      console.log(size, 'size')
      this.currentPage = current
      this.pageSize = size
      this.list()
    }
  },
  mounted () {
    this.list()
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
    .paging{
        text-align: right;
        height: 48px;
        margin-top: 16px;
        margin-right: 25px;
    }
  }
}
.red{
  color: #F4726C;
}
</style>

<style scoped>
.box >>> .el-table{
  padding: 0 32px;
}
.box >>> .el-table::before{
  height: 0;
}
.box >>> .el-table thead tr th{
  height: 54px;
  background:#FAFAFA;
  border-radius:4px 4px 0px 0px;
}
.box >>> .el-table th{
  font-size:14px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.box >>> .cell{
  padding-left: 20px;
}
.box >>> .el-button--text{
  font-size:14px;
  color: #1890FF;
}
</style>
