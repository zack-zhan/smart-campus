<template>
  <div class="content">
    <div class="box">
      <div class="title">学生信息</div>
      <div>
        <a-modal :footer="null" :visible="addSuperiorDialogVisible" :closable="false" :bodyStyle="bodyStyle">
          <addSuperior @onConfirm="onDormitoryConfirm" @close='addSuperiorDialogVisible = false' :visible="addSuperiorDialogVisible"/>
        </a-modal>
        <search-box title="查询" :conditions="conditions" :total="total" @conditionChanged="conditionChanged">
          <div slot="condition">
            <a-row :gutter="32" type="flex">
              <a-col :span="5">
                <span>姓名：</span>
                <a-input-search v-model="name" @search="(value, event) => search({title: '姓名', name: 'name', text: value, value: value}, event)" style="width: 70%" placeholder="请输入姓名"/>
              </a-col>
              <a-col :span="5">
                <span>学号：</span>
                <a-input-search v-model="studentNo" @search="value => search({title: '学号', name: 'studentNo', text: value, value: value})" style="width: 70%" placeholder="请输入学号"/>
              </a-col>
            </a-row>
            <a-row :gutter="32" type="flex" style="margin-top: 20px;">
              <a-col :span="9">
                <span>班级：</span>
                <a-select style="width: 40%" :options="gradeList" v-model="gradeId" placeholder="请选择年级" @change="gradeChanged"/>
                <a-select style="width: 40%" :options="classList" v-model="classId" placeholder="请选择班级" @change="classChanged"/>
              </a-col>
            </a-row>
            <a-row :gutter="32" type="flex" style="margin-top: 20px;">
              <a-col :span="5">
                <span>宿舍：</span>
                <a-button @click="addSuperiorDialogVisible=true">选择宿舍</a-button>
              </a-col>
            </a-row>
          </div>
        </search-box>
      </div>
      <div class="titlebar"><el-button class="btn" @click="addDialogVisible = true">新增学生</el-button></div>
        <a-drawer
          title="添加学生"
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
            label="姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="studentCode"
            label="学号">
          </el-table-column>
          <el-table-column
            prop="schoolDate"
            label="入学日期">
            <template slot-scope="scope" v-if="scope.row.schoolDate !== null">
              <span>{{scope.row.schoolDate.slice(0, 10)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gradeCalss"
            label="所属班级">
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
    </div>
  </div>
</template>

<script>
import Add from './components/dialogs/add-student' // 引入新增学生弹框组件
import SearchBox from '@/components/search-box'
import addSuperior from '@/components/select-dormitory'
import { studentpage, gradelist, classlistbygradeid } from '@/api'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      zhCN,

      tableData: [], // 表格数组

      addDialogVisible: false, // 新增学生弹框
      addSuperiorDialogVisible: false,
      gradeId: '',
      classId: '',
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1, // 当前页数
      conditions: [],
      gradeList: [],
      classList: [],

      bodyStyle: {
        'padding': '24px 0 0 0'
      },

      name: '',
      studentNo: ''
    }
  },
  components: {
    Add,
    SearchBox,
    addSuperior
  },
  methods: {
    // 获取列表
    list () {
      const request = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      this.conditions.map(x => {
        request[x.name] = x.value
      })
      studentpage(request)
        .then(res => {
          console.log(res)
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
      this.$router.push({path: '/listDetail', query: {id: row.id}})
    },

    // 成功操作
    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addDialogVisible = false
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
    },

    search (val) {
      this[val.name] = ''
      if (val.name === 'classId') {
        this.gradeId = ''
      }
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
    onDormitoryConfirm (selectArr) {
      const item = {
        title: '宿舍',
        name: 'dormitoryId',
        text: selectArr.name,
        value: selectArr.id
      }
      this.search(item)
      this.addSuperiorDialogVisible = false
    },
    gradeChanged (value) {
      this.classList = []
      classlistbygradeid(value).then(res => {
        if (res.code === 200) {
          this.classList = res.body.map(x => {
            return {
              key: x.classId,
              title: x.className,
              value: x.classId
            }
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    classChanged (value) {
      const item = this.classList.find(x => x.key === value)
      if (!item) {
        return
      }
      this.search({
        title: '班级',
        name: 'classId',
        text: item.title,
        value: item.key})
    },
    conditionChanged (conditions) {
      this.conditions = conditions
      this.currentPage = '1'
      this.list()
    }
  },
  mounted () {
    this.list()
    gradelist().then(res => {
      if (res.code === 200) {
        this.gradeList = res.body.map(x => {
          return {
            key: x.gradeId,
            title: x.gradeName,
            value: x.gradeId
          }
        })
      } else {
        this.$message.error(res.message)
      }
    })
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

.box >>> .ant-tag{
  margin-left: 16px;
}
.box >>> .ant-modal-body{
  padding: 0;
}
</style>
