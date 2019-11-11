<template>
  <div class="content">
    <div class="box">
      <div class="form">
        <div class="form_item">
          <div>日期：
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="change">
            </el-date-picker>
          </div>
          <div>
            类型：
            <el-select v-model="type" @change="change">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div>
            奖罚：
            <el-select v-model="reward" @change="change">
              <el-option value="1" label="奖"></el-option>
              <el-option value="2" label="罚"></el-option>
            </el-select>
          </div>
        </div>
        <div class="form_item">
          <div>
            班级：
            <el-select v-model="squad" @change="change">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.aliasName"
                :value="item.classId">
              </el-option>
            </el-select>
          </div>
          <!-- <div>
            宿舍：
            <el-select v-model="dormitory">
              <el-option value=""></el-option>
            </el-select>
          </div> -->
        </div>
      </div>
      <div class="line">
        <el-button class="btn" type="primary" @click="addDialogVisible = true">新增</el-button>
        <el-button class="btn">导出</el-button>
        <el-button class="btn">全部导出</el-button>
      </div>
      <!-- 新增弹框 -->
      <a-drawer
        title="新增德育记录"
        placement="right"
        :closable="false"
        :visible="addDialogVisible"
        width="600"
      >
        <Add @success='success' @close='closeDialog' @custom='addCustom' @recordStudent='addRecordStudent'></Add>
      </a-drawer>
      <div class="record">
        <el-dialog title="添加被记录人" :visible.sync="recordStudentDialogVisible">
          <RecordStudent v-if="recordStudentDialogVisible" @close='closeRecordDialog'></RecordStudent>
        </el-dialog>
        <el-dialog title="添加被记录人" :visible.sync="customRecordDialogVisible">
          <CustomRecord v-if="customRecordDialogVisible" @close='closeRecordDialog'></CustomRecord>
        </el-dialog>
      </div>
      <!-- 自定义新增弹框 -->
      <a-drawer
        title="新增自定义德育记录"
        placement="right"
        :closable="false"
        :visible="addCustomDialogVisible"
        width="600"
      >
        <AddCustom @success='success' @close='closeDialog' @customRecord='addCustomRecord'></AddCustom>
      </a-drawer>
      <div class="titlebar">
        <span>已 选 择<span style="color:#1890FF;"> {{num}} </span>项</span><span style="color:#1890FF;margin-left:24px;" @click="toggleSelection()"><a href="javascript:;">清 空</a></span>
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
          prop="studentName"
          label="学生名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="事件描述"
          align="center">
        </el-table-column>
        <el-table-column
          prop="score"
          label="德育分"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.score}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="processingTime"
          label="反馈时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <span @click="repeal(scope.row)" class="tableBtn" :class="scope.row.cancelStatus === 0?'':'huise'">撤销</span>
            <span @click="look(scope.row)" class="tableBtn">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ts">
        <el-dialog title="撤销处理" :visible.sync="repealDialogVisible">
          <Repeal v-if="repealDialogVisible" :id="recordID" :name="studentName" @success='success' @close='closeDialog'></Repeal>
        </el-dialog>
      </div>
      <div class="paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[8, 10, 20, 30]"
          :page-size="pageSize"
          layout="prev, pager, next, sizes, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!-- 查看弹框 -->
      <a-drawer
        title="查看记录"
        placement="right"
        :closable="true"
        @close='lookDialogVisible = false'
        :visible="lookDialogVisible"
        width="600"
      >
        <Look :id="lookId"></Look>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import Add from './components/dialogs/add' // 引入新增弹框组件
import RecordStudent from './components/dialogs/recordStudent' // 引入添加部门弹框组件
import AddCustom from './components/dialogs/addCustom' // 引入自定义新增弹框组件
import CustomRecord from './components/dialogs/customRecord' // 引入添加部门弹框组件
import Look from './components/dialogs/look' // 引入查看弹框组件
import Repeal from './components/dialogs/repeal' // 引入撤销弹框组件
import { getRecordListPage, groupsAll, classlist } from '@/api'
export default {
  data () {
    return {
      date: '', // 日期
      type: '', // 类型
      typeList: [], // 类型数组
      reward: '', // 奖罚
      squad: '', // 班级
      classList: [], // 班级数组
      dormitory: '', // 宿舍
      addDialogVisible: false, // 新增弹出框
      recordStudentDialogVisible: false, // 被记录人弹框
      addCustomDialogVisible: false, // 自定义新增弹出框
      customRecordDialogVisible: false, // 自定义被记录人弹框

      num: 0, // 已选择多少项

      lookDialogVisible: false, // 查看弹出框
      repealDialogVisible: false, // 撤销弹框
      recordID: '', // 撤销id
      studentName: '', // 撤销学生
      lookId: '', // 查看德育记录id

      tableData: [], // 表格数组
      total: 0, // 总条数
      pageSize: 8, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    Add,
    RecordStudent,
    AddCustom,
    CustomRecord,
    Look,
    Repeal
  },
  methods: {
    // 格式化日期
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    // 获取德育记录
    list () {
      console.log(this.date)
      var searchStartDate = ''
      var searchEndDate = ''
      if (this.date !== '') {
        searchStartDate = this.formatDate(this.date[0])
        searchEndDate = this.formatDate(this.date[1])
      }
      var obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        searchStartDate: searchStartDate,
        searchEndDate: searchEndDate,
        ruleGroupID: this.type,
        reward: parseInt(this.reward),
        classID: this.squad
      }
      getRecordListPage(obj)
        .then(res => {
          console.log(res)
          if (res.errCode === 200) {
            this.tableData = res.body.data
            this.total = res.body.total
          }
        })
    },
    // 获取类型列表
    getType () {
      groupsAll()
        .then(res => {
          console.log(res)
          if (res.errCode === 200) {
            this.typeList = res.body
          }
        })
    },
    // 获取班级列表
    getClass () {
      classlist()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.classList = res.body
          }
        })
    },
    // 筛选
    change () {
      this.list()
    },
    // 添加被记录人
    addRecordStudent () {
      this.recordStudentDialogVisible = true
    },
    // 新增自定义记录历史
    addCustom () {
      this.addCustomDialogVisible = true
    },
    // 添加被记录人
    addCustomRecord () {
      this.customRecordDialogVisible = true
    },
    // 已选择多少项
    select (selection) {
      console.log(selection)
      this.num = selection.length
    },
    // 清空
    toggleSelection (rows) {
      this.num = 0
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 点击撤销
    repeal (row) {
      console.log(row)
      if (row.cancelStatus === 0) {
        this.repealDialogVisible = true
      }
      this.recordID = row.recordID
      this.studentName = row.studentName
    },
    // 点击查看
    look (row) {
      console.log(row)
      this.lookId = row.recordID
      this.lookDialogVisible = true
    },

    // 成功操作
    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addDialogVisible = false
      this.addCustomDialogVisible = false
      this.repealDialogVisible = false
      this.lookDialogVisible = false
    },
    // 关闭弹出框
    closeRecordDialog () {
      this.recordStudentDialogVisible = false
      this.customRecordDialogVisible = false
    },

    // 每页条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.list()
    },
    // 当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.list()
    }
  },
  mounted () {
    this.list()
    this.getType()
    this.getClass()
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
    padding: 40px 40px 0 40px;
    .form{
      overflow: hidden;
      .form_item{
        width: 100%;
        margin-bottom: 35px;
        div{
          display: inline-block;
          margin-right: 100px;
        }
      }
    }
    .line{
      margin-bottom: 20px;
      .btn{
        width:88px;
        height:32px;
        line-height: 32px;
        padding: 0;
      }
    }
    .titlebar{
      width: 100%;
      height:40px;
      line-height: 40px;
      background:rgba(230,247,255,1);
      border-radius:4px;
      border:1px solid rgba(186,231,255,1);
      margin-bottom: 20px;
      padding-left: 16px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.65);
    }
    .paging{
        text-align: right;
        height: 48px;
        margin-top: 16px;
        margin-right: 25px;
    }
  }
}
.tableBtn{
  color:#1890FF;
  cursor:pointer;
}
.huise{
  color:rgba(0,0,0,0.25);
}
</style>

<style scoped>
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
.box >>> .el-date-editor .el-range-separator{
  padding: 0;width: 10%;
}
.box >>> .el-dialog__headerbtn{
  top: 0;
}

.ts >>> .el-dialog {
    width: 483px;
    right: 0;
    top: 100px;
    min-height: 272px;
}
.ts >>> .el-dialog__header{
  padding: 0;
  margin: 0;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid rgba(208,206,206,1);
}
.ts >>> .el-dialog__title{
  padding-left: 24px;
  font-size:16px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.ts >>> .el-dialog__body{
  height: 217px;
  padding: 0;
}

.record >>> .el-dialog__body{
  padding: 0;
}
.record >>> .el-dialog {
    width: 474px;
    min-height: 445px;
    padding: 0;
    right: 0;
    top: 100px;
}

.form_item >>> .el-select{
  width: 224px;
  line-height: 32px;
}
.form_item >>> .el-form-item__label{
  height: 32px;
  line-height: 32px;
}
.form_item >>> .el-input__inner{
  height: 32px;
}
.form_item >>> .el-input__icon{
  line-height: 32px;
}
.form_item >>> .el-date-editor{
  padding: 0;
  padding-left: 10px;
  width: 224px;
  line-height: 28px;
}
.form_item >>> .el-range-input{
  height: 28px;
}
</style>
