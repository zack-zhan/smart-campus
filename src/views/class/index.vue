<template>
  <div class="content">
    <div class="box">
      <div class="title"><span>班级管理</span></div>
      <div class="titlebar">
        <el-button class="btn" @click="addGradeDialogVisible = true">添加年级</el-button>
        <a-drawer
          title="添加年级"
          placement="right"
          :closable="false"
          :visible="addGradeDialogVisible"
          width="600"
        >
          <AddGrade @success='success' @close='closeDialog' @addGradeStaff='addGradeStaffDialog'>
          </AddGrade>
        </a-drawer>
        <el-button class="btn" @click="addClass">添加班级</el-button>
        <a-drawer
          title="添加班级"
          placement="right"
          :closable="false"
          :visible="addClassDialogVisible"
          width="600"
        >
          <AddClass @success='success' @close='closeDialog' @addClassStaff='addClassStaffDialog'></AddClass>
        </a-drawer>
        <el-button class="btn" type="primary" @click="upgrade">升级</el-button>
      </div>
      <div class="tsDialog">
        <el-dialog title="添加人员" :visible.sync="addGradeStaffDialogVisible">
          <AddGradeStaff v-if="addGradeStaffDialogVisible" @tsClose='tsCloseDialog'></AddGradeStaff>
        </el-dialog>
        <el-dialog title="编辑人员" :visible.sync="editGradeStaffDialogVisible">
          <EditGradeStaff v-if="editGradeStaffDialogVisible" @tsClose='tsCloseDialog'></EditGradeStaff>
        </el-dialog>
        <el-dialog title="添加人员" :visible.sync="addClassStaffDialogVisible">
          <AddClassStaff v-if="addClassStaffDialogVisible" @tsClose='tsCloseDialog'></AddClassStaff>
        </el-dialog>
        <el-dialog title="编辑人员" :visible.sync="editClassStaffDialogVisible">
          <EditClassStaff v-if="editClassStaffDialogVisible" @tsClose='tsCloseDialog'></EditClassStaff>
        </el-dialog>
      </div>

      <el-table
        :data="tableData"
        :row-class-name="getRowClass">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-for="(item,index) in props.row.classDtoList" :key="index" class="ts">
              <span>
                <el-checkbox v-model="item.select"></el-checkbox>
                {{ item.className }}
              </span>
              <span>{{ item.aliasName }}</span>
              <span>{{ item.studentTotal }}</span>
              <span>
                <el-button type="text" @click="look(item)">查看</el-button>
                <el-button type="text" @click="editClass(item)">编辑</el-button>
                <a-popconfirm title="您确定要删除吗?" @confirm="delClass(item)" okText="确定" cancelText="取消">
                  <a href="#" style="font-size:14px;">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          label="年级 (班级)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="aliasName"
          label="别名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="studentTotal"
          label="人数"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="editGrade(scope.row)" type="text">编辑</el-button>
            <a-popconfirm title="您确定要删除吗?" @confirm="delGrade(scope.row)" okText="确定" cancelText="取消">
              <a href="#" style="font-size:14px;">删除</a>
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

      <a-drawer
        title="编辑年级"
        placement="right"
        :closable="false"
        :visible="editGradeDialogVisible"
        width="600"
      >
        <EditGrade :id="gradeId" :visible="editGradeDialogVisible" @success='success' @close='closeDialog' @editGradeStaff='editGradeStaffDialog'></EditGrade>
      </a-drawer>
      <a-drawer
        title="班级详情"
        placement="right"
        :closable="true"
        @close='lookDialogVisible = false'
        :visible="lookDialogVisible"
        width="600"
      >
        <Look :id="classId" @success='success' @close='closeDialog'></Look>
      </a-drawer>
      <a-drawer
        title="编辑班级"
        placement="right"
        :closable="false"
        :visible="editClassDialogVisible"
        width="600"
      >
        <EditClass :id="classId" :visible="editClassDialogVisible" @success='success' @close='closeDialog' @editClassStaff='editClassStaffDialog'></EditClass>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import AddGrade from './components/dialogs/grade/add-grade' // 引入添加年级弹框组件
import AddGradeStaff from './components/dialogs/grade/add-staff' // 引入添加年级主任弹框组件
import AddClass from './components/dialogs/class/add-class' // 引入添加班级弹框组件
import AddClassStaff from './components/dialogs/class/add-staff' // 引入添加年级主任弹框组件
import Look from './components/dialogs/look-class' // 引入查看弹框组件
import EditGrade from './components/dialogs/grade/edit-grade' // 引入编辑年级弹框组件
import EditGradeStaff from './components/dialogs/grade/edit-staff' // 引入编辑年级弹框组件
import EditClass from './components/dialogs/class/edit-class' // 引入编辑班级弹框组件
import EditClassStaff from './components/dialogs/class/edit-staff' // 引入添加年级主任弹框组件
import { gradepage, gradedelete, classdelete, upgradeGrade } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      addGradeDialogVisible: false, // 添加年级弹框
      addGradeStaffDialogVisible: false, // 添加年级主任弹框
      addClassDialogVisible: false, // 添加班级弹框
      addClassStaffDialogVisible: false, // 添加班级主任弹框

      lookDialogVisible: false, // 查看弹框

      editGradeDialogVisible: false, // 编辑年级弹框
      gradeId: '', // 年级id
      editGradeStaffDialogVisible: false, // 编辑年级主任弹框
      editClassDialogVisible: false, // 编辑班级弹框
      classId: '', // 班级id
      editClassStaffDialogVisible: false, // 编辑班级主任弹框

      tableData: [], // 表格数组

      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  components: {
    AddGrade,
    AddGradeStaff,
    AddClass,
    AddClassStaff,
    Look,
    EditGrade,
    EditGradeStaff,
    EditClass,
    EditClassStaff
  },
  methods: {
    // 升级
    upgrade () {
      console.log('123')
      upgradeGrade()
        .then(res => {
          if (res.code === 200) {
            this.gradeList()
            this.$message.success('升级成功')
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 获取年级列表
    gradeList () {
      const obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      gradepage(obj)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.body.records
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 判断当前行是否有子数据，没有就不显示展开图标
    getRowClass (row, rowIndex) {
      if (row.row.classDtoList.length === 0) {
        return 'row-expand-cover'
      }
    },

    addClass () {
      this.addClassDialogVisible = true
    },

    // 添加年级主任
    addGradeStaffDialog () {
      this.addGradeStaffDialogVisible = true
    },
    // 添加班级主任
    addClassStaffDialog () {
      this.addClassStaffDialogVisible = true
    },
    // 编辑添加年级主任
    editGradeStaffDialog () {
      this.editGradeStaffDialogVisible = true
    },
    // 编辑添加班级主任
    editClassStaffDialog () {
      this.editClassStaffDialogVisible = true
    },
    // 编辑年级
    editGrade (row) {
      console.log(row)
      this.gradeId = row.gradeId
      this.editGradeDialogVisible = true
    },
    // 删除年级
    delGrade (row) {
      console.log(row, '000')
      gradedelete(row.gradeId)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.gradeList()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 查看班级
    look (row) {
      console.log(row)
      this.classId = row.classId
      this.lookDialogVisible = true
    },
    // 编辑班级
    editClass (row) {
      console.log(row)
      this.classId = row.classId
      this.editClassDialogVisible = true
    },
    // 删除班级
    delClass (row) {
      console.log(row)
      classdelete(row.classId)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.gradeList()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 成功操作
    success () {
      this.gradeList()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addGradeDialogVisible = false
      this.addClassDialogVisible = false
      this.lookDialogVisible = false
      this.editGradeDialogVisible = false
      this.editClassDialogVisible = false
    },
    tsCloseDialog () {
      this.addGradeStaffDialogVisible = false
      this.editGradeStaffDialogVisible = false
      this.addClassStaffDialogVisible = false
      this.editClassStaffDialogVisible = false
    },

    changePage (page) {
      this.currentPage = page
      this.gradeList()
    },
    changeSize (current, size) {
      console.log(current, 'current')
      console.log(size, 'size')
      this.currentPage = current
      this.pageSize = size
      this.gradeList()
    }
  },
  mounted () {
    this.gradeList()
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
      span{
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        padding-left: 32px;
      }
    }
    .titlebar{
      padding: 20px 0;
      margin-left: 30px;
      .btn{
        width:88px;
        height:32px;
        line-height: 32px;
        padding: 0;
        margin-left: 5px;
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
.ts{
  width: 100%;
  border-bottom: 1px solid #EBEEF5;
  height: 57px;
  line-height: 57px;
  padding-left: 48px;
  display: flex;
  span{
    flex: 1;
    text-align: center;
  }
  span:nth-child(3){
    flex: none;
    width: 100px;
  }
}
.ts:last-child{
  border-bottom: none;
}
</style>

<style>
.row-expand-cover td .el-icon-arrow-right{visibility: hidden;}
</style>

<style scoped>
.box >>> .el-table{
  padding: 0 32px;
}
.box >>> .el-table::before{
  display: none;
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
.box >>> .el-table__expanded-cell{
  padding: 0;
}
.box >>> .el-button+.el-button{
  margin-left: 0;
}

.box >>> .el-button--text{
  color: #1890ff;
}

.tsDialog >>> .el-dialog {
  width: 474px;
  min-height: 455px;
  padding: 0;
  right: 0;
  top: 100px;
}
.tsDialog >>> .el-dialog__body{
  padding: 0;
}
</style>
