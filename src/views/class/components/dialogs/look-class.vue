<template>
  <div class="dialogBox">
    <div class="line">
      <div class="box">
        <div>班级名称：</div>
        <div>{{arr.className}}</div>
      </div>
      <div class="box">
        <div>班级别名：</div>
        <div>{{arr.aliasName}}</div>
      </div>
      <div class="box">
        <div>所属年级：</div>
        <div>{{arr.gradeName}}</div>
      </div>
    </div>
      <div class="list">
        <div class="title">学生列表</div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="studentCode"
            label="学籍号">
          </el-table-column>
          <el-table-column
            prop="genderStr"
            label="性别">
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
      </div>
  </div>
</template>

<script>
import { classone, studentpage2 } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      zhCN,

      arr: [], // 列表数组
      tableData: [], // 列表数组
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  methods: {
    // 获取详情
    list () {
      classone(this.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.arr = res.body
          } else {
            this.$message.error(res.message)
          }
        })
      const obj = {
        classId: this.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      studentpage2(obj)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.body.records
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
          }
        })
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
  },
  watch: {
    id (val) {
      console.log(val, 'val')
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
  overflow: hidden;
  .box{
    width: 150px;
    float: left;
    margin: 10px;
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
.list{
  margin-top: 30px;
  margin-left: 15px;
  .title{
    font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    margin-bottom: 20px;
  }
}
.paging{
  float: right;
  margin-top: 20px;
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
</style>
