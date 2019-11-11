<template>
  <div class="content">
    <div class="box">
      <div class="title">发送历史</div>
      <el-table
        :data="tableData">
        <el-table-column
          prop="title"
          label="公告标题">
        </el-table-column>
        <el-table-column
          prop="content"
          label="公告内容">
        </el-table-column>
        <el-table-column
          prop="sendCount"
          label="发送人数">
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发送时间">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
          </template>
          </el-table-column>
      </el-table>
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
      <a-drawer
        title="公告详情"
        placement="right"
        :closable="true"
        :visible="lookDialogVisible"
        width="600"
        @close="lookDialogVisible = false"
      >
        <Look :id="lookId"></Look>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import Look from './components/dialogs/look-history' // 引入查看弹框组件
import { noticehistorypage } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      lookDialogVisible: false, // 查看弹框
      tableData: [], // 表格数组

      lookId: '', // 查看id

      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    Look
  },
  methods: {
    // 获取列表
    list () {
      const obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      noticehistorypage(obj)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.body.records
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 点击查看
    look (row) {
      console.log(row)
      this.lookId = row.id
      this.lookDialogVisible = true
    },
    // 关闭弹出框
    closeDialog () {
      this.lookDialogVisible = false
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
      margin-bottom: 24px;
    }
    .paging{
        text-align: right;
        height: 48px;
        margin-top: 16px;
        margin-right: 25px;
    }
  }
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
  max-width: 256px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.box >>> .el-button--text{
  font-size:14px;
  color: #1890FF;
}
</style>
