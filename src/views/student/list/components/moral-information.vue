<template>
  <div class="main">
    <div class="collect">
      <div class="box">
        <div>汇总</div>
        <div>{{collectList.recordCount}}</div>
      </div>
      <div class="box">
        <div>德育总分</div>
        <div>{{collectList.totalScore}}</div>
      </div>
    </div>
    <div class="titlebar">
      <div>德育记录</div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="score"
          label="德育分">
        </el-table-column>
        <el-table-column
          prop="processingTime"
          label="操作时间">
        </el-table-column>
        <el-table-column
            prop="operation"
            label="操作">
            <template slot-scope="scope">
              <span @click="repeal(scope.row)" class="btn" :class="scope.row.cancelStatus === 0?'':'huise'">撤销</span>
            </template>
          </el-table-column>
      </el-table>
      <el-dialog title="撤销处理" :visible.sync="repealDialogVisible">
        <Repeal v-if="repealDialogVisible" :id="recordId" :name="collectList.studentName" @success='success' @close='closeDialog'></Repeal>
      </el-dialog>
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
import Repeal from './dialogs/repeal' // 引入撤销弹框组件
import { getSummaryRecordByStudentId, getRecordListPage } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      id: '', // 学生id
      collectList: [], // 汇总列表

      recordId: '', // 撤销id
      repealDialogVisible: false, // 撤销弹框

      tableData: [],
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    Repeal
  },
  methods: {
    // 获取德育汇总
    collect () {
      getSummaryRecordByStudentId(this.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.collectList = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取列表
    list () {
      const obj = {
        'pageIndex': this.currentPage,
        'pageSize': this.pageSize,
        'studentId': this.id
      }
      getRecordListPage(obj)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.body.data
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 撤销
    repeal (row) {
      console.log(row, '---')
      if (row.cancelStatus === 0) {
        this.repealDialogVisible = true
      }
      this.recordId = row.recordId
    },
    // 成功操作
    success () {
      this.collect()
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.repealDialogVisible = false
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
    // 获取路由跳转带过来的参数
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.collect()
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.collect{
  overflow: hidden;
  .box{
    width: 200px;
    float: left;
    margin: 35px;
    div:nth-child(1){
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.45);
    }
    div:nth-child(2){
      margin-top: 10px;
      font-size:24px;
      font-family:HelveticaNeue;
      color:rgba(0,0,0,0.85);
    }
  }
}
.titlebar{
  border-bottom: 1px solid rgba(233,233,233,1);
  div{
    line-height: 50px;
    padding-left: 32px;
    font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(0,0,0,0.85);
  }
}
.table{
  padding: 30px 30px 0 30px;
}
.paging{
    text-align: right;
    height: 48px;
    margin-top: 16px;
    margin-right: 25px;
  }
.btn{
  color:#1890FF;
  cursor:pointer;
}
.huise{
  color:rgba(0,0,0,0.25);
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

.main >>> .el-dialog {
    width: 483px;
    height: 272px;
}
.main >>> .el-dialog__header{
  padding: 0;
  margin: 0;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid rgba(208,206,206,1);
}
.main >>> .el-dialog__title{
  padding-left: 24px;
  font-size:16px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.main >>> .el-dialog__body{
  height: 217px;
  padding: 0;
}
</style>
