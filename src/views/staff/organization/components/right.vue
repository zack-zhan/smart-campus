<template>
  <div class="box" ref="elememt">
      <div class="topBox">
        <div class="title">
          <span v-if="selectName !== ''">{{selectName}}</span>
          <el-button type="primary" class="edit_btn" @click="editDialogVisible = true">编辑</el-button>
        </div>
        <a-drawer
          title="编辑部门"
          placement="right"
          :closable="false"
          :visible="editDialogVisible"
          width="600"
        >
          <Edit :id="selectId" :visible="editDialogVisible" @success='success' @close='closeDialog'></Edit>
        </a-drawer>
        <div class="title2">
          <span>下级部门</span>
        </div>
        <div class="titlebar">
            <el-button class="btn" @click="departmentDialogVisible = true">添加子部门</el-button>
            <a-drawer
              title="添加子部门"
              placement="right"
              :closable="false"
              :visible="departmentDialogVisible"
              width="600"
            >
              <SonDepartment :parent-id="selectId" @success='success' @close='closeDialog'></SonDepartment>
            </a-drawer>
        </div>
        <el-scrollbar style="height:200px">
          <ul v-for="(item,index) in selectChildList" :key="index">
            <li><span>{{item.name}}</span><span>({{item.total + "人"}})</span></li>
          </ul>
        </el-scrollbar>
      </div>

      <div class="bottomBox">
        <div class="title2">
          <span>部门人员</span>
        </div>
        <search-box title="查询" :conditions="conditions" :total="total" @conditionChanged="conditionChanged">
          <div slot="condition">
            <a-row :gutter="32" type="flex">
              <a-col :span="6">
                <span>姓名：</span>
                <a-input-search v-model="staffName" @search="(value, event) => search({title: '姓名', name: 'staffName', text: value, value: value}, event)" style="width: 70%" placeholder="请输入姓名"/>
              </a-col>
              <a-col :span="6">
                <span>职位：</span>
                <a-input-search v-model="position" @search="value => search({title: '职位', name: 'position', text: value, value: value})" style="width: 70%" placeholder="请输入职位"/>
              </a-col>
            </a-row>
          </div>
        </search-box>
        <div class="titlebar">
          <el-button class="btn" @click="staffDialogVisible = true">添加员工</el-button>
          <a-drawer
            title="添加员工"
            placement="right"
            :closable="false"
            :visible="staffDialogVisible"
            width="600"
            :zIndex="9999"
          >
            <AddStaff @success='tsSuccess' @close='closeDialog'></AddStaff>
          </a-drawer>
          <el-button class="btn" @click="delBatch">批量删除</el-button>
        </div>
        <a-drawer
          title="员工详情"
          placement="right"
          :closable="false"
          :visible="lookDialogVisible"
          width="600"
          :zIndex="9999"
        >
          <Look :staff-id="staffid" :visible="lookDialogVisible" @success='tsSuccess' @close='closeDialog'></Look>
        </a-drawer>
        <el-table
          :data="tableData"
          @select="select"
          @select-all="select"
          @row-click="look">
          <el-table-column
          type="selection">
          </el-table-column>
          <el-table-column
            prop="name"
            width="100"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="position"
            label="职务">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
            <template slot-scope="scope">
              <span class="email">{{scope.row.email}}</span>
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
              :pageSizeOptions="['4', '10', '20', '30']"
            />
          </a-locale-provider>
        </div>
      </div>
    </div>
</template>

<script>
import eventBus from './eventBus.js' // 事件车
import Edit from './dialogs/edit' // 引入编辑弹框组件
import SonDepartment from './dialogs/add-son-department' // 引入添加子部门弹框组件
import AddStaff from './dialogs/add-staff' // 引入添加员工弹框组件
import Look from './dialogs/look-staff' // 引入查看弹框组件
import SearchBox from '@/components/search-box'
import { staffpage, staffbatchdelete } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      selectName: '', // 选择的name
      selectId: '', // 选择的id
      selectChildList: [], // 选择的树形子数组

      editDialogVisible: false, // 编辑弹框
      departmentDialogVisible: false, // 添加子部门弹框
      staffDialogVisible: false, // 添加员工弹框
      selectIds: {
        staffids: ''
      }, // 批量选择的员工id
      lookDialogVisible: false, // 查看弹框
      staffid: '', // 员工id
      departmentId: '',
      tableData: [], // 表格数组
      total: 0, // 总条数
      pageSize: 4, // 当前页条数
      currentPage: 1, // 当前页数
      conditions: [],

      staffName: '',
      position: ''
    }
  },
  components: {
    Edit,
    SonDepartment,
    AddStaff,
    Look,
    SearchBox
  },
  methods: {
    // 选择的值
    selectValue () {
      eventBus.$on('data', (data) => {
        console.log(data, 'aaa')
        this.selectName = data.name
        this.selectId = data.departmentid
        this.selectChildList = data.childList
        this.list(data.departmentid)
      })
    },
    // 获取列表
    list (id) {
      if (id) {
        this.departmentId = id
      }
      const request = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        departmentid: this.departmentId
      }
      this.conditions.map(x => {
        request[x.name] = x.value
      })
      staffpage(request)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.body.records
            this.total = res.body.total
          } else {
            this.tableData = []
            this.total = res.total
            this.$message.error(res.message)
          }
        })
    },
    // 选择
    select (selection) {
      console.log(selection)
      const arr = []
      selection.map(item => {
        arr.push(item.staffid)
      })
      this.selectIds.staffids = arr
    },
    // 批量删除
    delBatch () {
      console.log(this.selectIds.staffids, '--')
      if (this.selectIds.staffids) {
        staffbatchdelete(this.selectIds)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.selectIds = []
              this.list(this.selectId)
            } else {
              this.$message.error(res.message)
            }
          })
      } else {
        this.$message.error('请勾选需要删除的员工')
      }
    },
    // 查看员工
    look (row) {
      this.staffid = row.staffid
      this.lookDialogVisible = true
    },

    // 成功操作
    success () {
      eventBus.$emit('update')
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.editDialogVisible = false
      this.departmentDialogVisible = false
      this.staffDialogVisible = false
      this.lookDialogVisible = false
    },
    tsSuccess () {
      this.list(this.selectId)
      this.closeDialog()
    },

    changePage (page) {
      console.log(page, 'page')
      this.currentPage = page
      this.list(this.selectId)
    },
    changeSize (current, size) {
      console.log(current, 'current')
      console.log(size, 'size')
      this.currentPage = current
      this.pageSize = size
      this.list(this.selectId)
    },

    search (val) {
      this[val.name] = ''
      if (val && val.value && val.value !== '') {
        const index = this.conditions.findIndex(x => x.name === val.name)
        if (index > -1) {
          this.conditions.splice(index, 1)
        }
        this.conditions.push(val)
        this.currentPage = '1'
        this.list()
      }
    },
    conditionChanged (conditions) {
      this.conditions = conditions
      this.currentPage = '1'
      this.list()
    }
  },
  created () {
    this.selectValue()

    // let height = this.$refs.elememt.offsetHeight
    // console.log(height, '0000000000')
  }
}
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    background: #fff;
    border-radius: 10px;
    float: right;
    .topBox{
      // height: 40%;
      .title{
        margin: 32px;
        font-size:20px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        span{
          margin-right: 20px;
        }
        .edit_btn{
          width:74px;
          height:32px;
          line-height: 32px;
          padding: 0;
        }
      }
      ul{
        height: 46px;
        line-height: 46px;
        margin: 0 32px;
        li{
          border-bottom:1px solid rgba(202,202,202,1);
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(0,0,0,0.85);
          i{
            padding-left: 12px;
          }
          span{
            padding-left: 12px;
          }
        }
      }
    }
    .title2{
        padding-bottom: 20px;
        border-bottom:1px solid rgba(233,233,233,1);
        span{
          margin-left: 32px;
        }
    }
    .titlebar{
        padding: 20px 0;
        margin-left: 30px;
    }
    .bottomBox{
      // height: 60%;
      .paging{
          text-align: right;
          height: 48px;
          margin-top: 16px;
          margin-right: 25px;
      }
    }
}
.btn{
  width:88px;
  height:32px;
  line-height: 32px;
  padding: 0;
  margin-left: 5px;
}

.email{
  display: inline-block;
  width: 6em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

<style scoped>
.box >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
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

.box >>> .ant-tag{
  margin-left: 16px;
}
</style>
