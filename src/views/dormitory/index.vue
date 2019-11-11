<template>
  <div class="content">
    <div class="box">
      <div class="title">宿舍管理</div>
      <div class="titlebar">
        <el-button class="btn" @click="addSubareaDialogVisible = true">添加分区</el-button>
        <a-drawer
          title="添加分区"
          placement="right"
          :closable="false"
          :visible="addSubareaDialogVisible"
          width="600"
          :zIndex="9999"
        >
          <AddSubarea @success='success' @close='closeDialog'></AddSubarea>
        </a-drawer>
        <el-button class="btn" @click="addDormitoryDialogVisible = true">添加宿舍</el-button>
        <a-drawer
          title="添加宿舍"
          placement="right"
          :closable="false"
          :visible="addDormitoryDialogVisible"
          width="600"
          :zIndex="9999"
        >
          <AddDormitory @success='success' @close='closeDialog'></AddDormitory>
        </a-drawer>
      </div>
      <a-locale-provider :locale="zhCN">
        <a-table
        :columns="columns"
        :dataSource="data"
        :childrenColumnName="defaultProps"
        :locale="{emptyText: '暂无数据'}"
        rowKey='id'
        :pagination="{
          showQuickJumper: true,
          showSizeChanger:true,
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
        @change="changePage"
        >
          <template slot="operation" slot-scope="text">
            <div class="operation">
              <span v-if="text.isLast === 3" @click="look(text)">查看</span>
              <span @click="edit(text)">编辑</span>
              <a-popconfirm title="您确定要删除吗?" @confirm="del(text)" okText="确定" cancelText="取消">
                <a href="#">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-locale-provider>
      <a-drawer
        title="宿舍详情"
        placement="right"
        :closable="true"
        @close='lookDialogVisible = false'
        :visible="lookDialogVisible"
        width="600"
      >
        <Look :id="lookId"></Look>
      </a-drawer>
      <a-drawer
        title="编辑分区"
        placement="right"
        :closable="false"
        :visible="editSubareaDialogVisible"
        width="600"
        :zIndex="9999"
      >
        <EditSubarea :id="editSubareaId" :visible="editSubareaDialogVisible" @success='success' @close='closeDialog'></EditSubarea>
      </a-drawer>
      <a-drawer
        title="编辑宿舍"
        placement="right"
        :closable="false"
        :visible="editDormitoryDialogVisible"
        width="600"
        :zIndex="9999"
      >
        <EditDormitory :id="editDormitoryId" :visible="editDormitoryDialogVisible" @success='success' @close='closeDialog'></EditDormitory>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import AddSubarea from './components/dialogs/subarea/add-subarea' // 引入添加分区弹框组件
import AddDormitory from './components/dialogs/dormitory/add-dormitory' // 引入添加宿舍弹框组件
import Look from './components/dialogs/dormitory/look-dormitory' // 引入查看宿舍弹框组件
import EditSubarea from './components/dialogs/subarea/edit-subarea' // 引入编辑分区弹框组件
import EditDormitory from './components/dialogs/dormitory/edit-dormitory' // 引入编辑宿舍弹框组件
import { dormitoryPartitionpage, dormitoryPartitiondelete, dormitorydelete } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      columns: [{
        title: '分区/宿舍',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: '25%'
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        width: '25%'
      }, {
        title: '人数',
        dataIndex: 'conut',
        key: 'conut',
        align: 'center',
        width: '25%'
      },
      { title: '操作',
        scopedSlots: { customRender: 'operation' },
        align: 'center',
        width: '25%'
      }], // 列描述数据对象
      data: [], // 表格数组
      defaultProps: 'childList', // 指定树形结构的列名

      addSubareaDialogVisible: false, // 添加分区弹框
      addDormitoryDialogVisible: false, // 添加宿舍弹框

      lookDialogVisible: false, // 查看宿舍详情弹框
      lookId: '', // 查看宿id
      editSubareaDialogVisible: false, // 编辑分区弹框
      editSubareaId: '', // 编辑分区id
      editDormitoryDialogVisible: false, // 编辑宿舍弹框
      editDormitoryId: '', // 编辑宿舍id

      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    AddSubarea,
    AddDormitory,
    Look,
    EditSubarea,
    EditDormitory
  },
  methods: {
    // 获取列表
    list () {
      const obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      dormitoryPartitionpage(obj)
        .then(res => {
          if (res.code === 200) {
            this.data = res.body.records
            this.total = res.body.total
          } else {
            this.data = []
            this.$message.error(res.message)
          }
        })
    },
    // 查看
    look (text) {
      this.lookDialogVisible = true
      this.lookId = text.id
    },
    // 编辑
    edit (text) {
      console.log(text, 'tetx')
      if (text.isLast === 1 || text.isLast === 2) {
        this.editSubareaId = text.id
        this.editSubareaDialogVisible = true
      } else if (text.isLast === 3) {
        this.editDormitoryId = text.id
        this.editDormitoryDialogVisible = true
      }
    },
    // 删除
    del (text) {
      console.log(text, 'tetx')
      if (text.isLast === 1 || text.isLast === 2) {
        dormitoryPartitiondelete(text.id)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.list()
            } else {
              this.$message.error(res.message)
            }
          })
      } else if (text.isLast === 3) {
        dormitorydelete(text.id)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.list()
            } else {
              this.$message.error(res.message)
            }
          })
      }
    },
    // 成功操作
    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addSubareaDialogVisible = false
      this.addDormitoryDialogVisible = false
      this.lookDialogVisible = false
      this.editSubareaDialogVisible = false
      this.editDormitoryDialogVisible = false
    },

    changePage (page) {
      console.log(page, 'page')
      this.currentPage = page.current
      this.pageSize = page.pageSize
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
      line-height: 55px;
      font-size:16px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,0,0,0.85);
      padding-left: 32px;
      border-bottom: 1px solid rgba(233,233,233,1);
    }
    .titlebar{
      height: 70px;
      line-height: 70px;
      padding-left: 32px;
      .btn{
        width:88px;
        height:32px;
        line-height: 32px;
        padding: 0;
        margin-right: 5px;
      }
    }
  }
}
.operation{
  color: #1890FF;
  span{
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>

<style scoped>
.box >>> .el-dialog {
    width: 600px;
    right: -34.4%;
    min-height: 100%;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
.box >>> .el-dialog__header{
  padding: 0;
  margin: 0;
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid rgba(208,206,206,1);
}
.box >>> .el-dialog__title{
  padding-left: 30px;
  font-size:16px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.box >>> .el-dialog__headerbtn{
  top: 0;
}
.box >>> .el-button+.el-button{
  margin-left: 0;
}

.box >>> .ant-table-body{
  margin: 0 30px;
}

.box >>> .ant-table-pagination{
  margin-right: 30px;
}
</style>
