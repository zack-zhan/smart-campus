<template>
  <div class="right">
      <div class="title">{{typeName}}</div>
      <div class="titlebar">
        <el-button class="btn" style="background:#1890FF;color:#fff;" @click="addDialogVisible = true">新增</el-button>
        <!-- 新增弹框 -->
        <a-drawer
          title="新增细则"
          placement="right"
          :closable="false"
          :visible="addDialogVisible"
          width="600"
        >
          <Add @success='success' @close='closeDialog'></Add>
        </a-drawer>
        <el-button class="btn" @click="delBatch">删除</el-button>
      </div>
      <el-table
        :data="tableData"
        @select="select"
        @select-all="select"
        ref="multipleTable">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="ruleName"
          label="德育细则内容"
          align="center">
        </el-table-column>
        <el-table-column
          prop="score"
          label="德育分"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <a-popconfirm title="您确定要删除吗?" @confirm="del(scope.row)" okText="确定" cancelText="取消">
              <a href="#">删除</a>
            </a-popconfirm>
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
      <!-- 编辑弹框 -->
      <a-drawer
          title="细则编辑"
          placement="right"
          :closable="false"
          :visible="editDialogVisible"
          width="600"
      >
        <Edit :id="editId" :visible="editDialogVisible" @success='success' @close='closeDialog'></Edit>
      </a-drawer>
    </div>
</template>

<script>
import Add from './dialogs/add-rules' // 引入新增细则弹框组件
import Edit from './dialogs/edit-rules' // 引入编辑细则弹框组件
import { rulesPage, rulesDelete, deleteBatch } from '@/api'
import eventBus from './eventBus.js' // 事件车

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      typeId: '', // 选中的细则分类id
      typeName: '', // 选中的细则分类name

      addDialogVisible: false, // 新增细则弹框
      editDialogVisible: false, // 编辑细则弹框
      editId: '', // 编辑细则的id

      num: 0, // 已选择多少项
      selectIds: '', // 批量选择的细则类型id

      tableData: [], // 表格数组
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    Add,
    Edit
  },
  created () {
    this.selectData()
  },
  watch: {
    // 监听细则分类的数据变化
    'typeId' (val) {
      this.tableList(val)
    }
  },
  methods: {
    // 获取选中的数据
    selectData () {
      eventBus.$on('selectData', (selectData) => {
        this.typeId = selectData.selectId
        this.typeName = selectData.selectName
      })
    },
    // 获取细则列表
    tableList (typeId) {
      const obj = {
        groupId: typeId,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      rulesPage(obj)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.body.data
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
            this.tableData = []
          }
        })
    },
    // 细则编辑
    edit (row) {
      console.log(row)
      this.editId = row.ruleId
      this.editDialogVisible = true
    },
    // 删除细则
    del (row) {
      rulesDelete(row.ruleId)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.tableList(this.typeId)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    select (selection) {
      console.log(selection)
      const arr = []
      selection.map(item => {
        console.log(item)
        arr.push(item.ruleId)
      })
      this.selectIds = arr.toString()
    },
    // 批量删除
    delBatch () {
      deleteBatch(this.selectIds)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.tableList(this.typeId)
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 成功操作
    success () {
      this.tableList(this.typeId)
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
      this.tableList(this.typeId)
    },
    changeSize (current, size) {
      console.log(current, 'current')
      console.log(size, 'size')
      this.currentPage = current
      this.pageSize = size
      this.tableList(this.typeId)
    }
  },
  mounted () {
    this.tableList()
  }
}
</script>

<style lang="scss" scoped>
.right{
  width: 100%;
  // height: 100%;
  float: right;
  background: #fff;
  .title{
    height: 55px;
    line-height: 55px;
    padding-left: 32px;
    font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    border-bottom:1px solid rgba(208,206,206,1);
  }
  .titlebar{
    line-height: 60px;
    padding-left: 32px;
    .btn{
      width:88px;
      height:32px;
      line-height: 32px;
      padding: 0;
      margin-right: 5px;
    }
  }
  .paging{
        text-align: right;
        height: 48px;
        margin-top: 16px;
        margin-right: 25px;
    }
}
</style>

<style scoped>
.right >>> .el-table{
  padding: 0 32px;
}
.right >>> .el-table::before{
  height: 0;
}
.right >>> .el-table thead tr th{
  height: 54px;
  background:#FAFAFA;
  border-radius:4px 4px 0px 0px;
}
.right >>> .el-table th{
  font-size:14px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.right >>> .cell{
  padding-left: 20px;
}
.right >>> .el-button--text{
  font-size:14px;
  color: #1890FF;
}

.right >>> .el-dialog {
    width: 600px;
    right: -34.4%;
    min-height: 100%;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
.right >>> .el-dialog__header{
  padding: 0;
  margin: 0;
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid rgba(208,206,206,1);
}
.right >>> .el-dialog__title{
  padding-left: 30px;
  font-size:16px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.right >>> .el-dialog__headerbtn{
  top: 0;
}
</style>
