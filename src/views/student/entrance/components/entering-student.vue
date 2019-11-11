<template>
  <div class="box">
    <div style="margin-left: 94px;">
      <search-box title="查询" :conditions="conditions" :total="totalCount" @conditionChanged="conditionChanged">
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
              <a-col :span="7">
                <span>身份证号：</span>
                <a-input-search v-model="identityCard" @search="value => search({title: '身份证号', name: 'identityCard', text: value, value: value})" style="width: 70%" placeholder="请输入身份证号"/>
              </a-col>
            </a-row>
          </div>
        </search-box>
    </div>
    <div class="btn-bar">
      <a-button type="primary" @click="oneEnteringDialog = true">单个录入</a-button>
      <a-upload
        :customRequest="customRequest"
        :showUploadList="false"
        :data="dataObj">
        <a-button>批量录入</a-button>
      </a-upload>
      <a-button @click="downloadTemplate">导出</a-button>
      <a-upload
          :customRequest="customRequest2"
          :showUploadList="false">
        <a-button>上传照片</a-button>
      </a-upload>
    </div>
    <a-drawer
      title="学生单个录入"
      placement="right"
      :closable="false"
      :visible="oneEnteringDialog"
      width="600"
    >
      <OneEntering @success='success' @close='closeDialog'></OneEntering>
    </a-drawer>
    <div class="table">
      <a-locale-provider :locale="zhCN">
        <a-table
        :columns="columns"
        :dataSource="data"
        :locale="{emptyText: '暂无数据'}"
        rowKey="originStudentid"
        :pagination="{
          showQuickJumper: true,
          showSizeChanger:true,
          total: totalCount,
          current: currentPage,
          pageSize: pageSize
        }"
        @change="changePage"
        >
          <template slot="operation" slot-scope="text">
            <div class="operation">
              <span @click="look(text)">查看</span>
              <span @click="edit(text)">编辑</span>
              <a-popconfirm title="您确定要删除吗?" @confirm="del(text)" okText="确定" cancelText="取消">
                <a href="#">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-locale-provider>
    </div>
    <a-drawer
      title="入学管理信息编辑"
      placement="right"
      :closable="false"
      :visible="editDialogVisible"
      width="600"
    >
      <Edit :id="id" :visible="editDialogVisible" :entranceStats="1" @success='success' @close='closeDialog'></Edit>
    </a-drawer>
  </div>
</template>

<script>
import OneEntering from './dialogs/one-Entry' // 引入单个录入弹框组件
import Edit from './dialogs/edit'
import { originstudentpage, originstudentdelete, importoriginstudent, exportStudentTemplates, aliOSSSignature, importphotos } from '@/api'
import SearchBox from '@/components/search-box'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import axios from 'axios'
export default {
  data () {
    return {
      zhCN,

      oneEnteringDialog: false,
      dataObj: {},

      columns: [{
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '学籍号',
        dataIndex: 'rollNo'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' }
      }],
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      conditions: [],
      name: '',
      studentNo: '',
      identityCard: '',

      editDialogVisible: false,
      id: '' // 学生id
    }
  },
  components: {
    OneEntering,
    Edit,
    SearchBox
  },
  methods: {
    // 获取列表
    list () {
      const request = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        entrances: 1
      }
      this.conditions.map(x => {
        request[x.name] = x.value
      })
      console.log(request)
      originstudentpage(request)
        .then(res => {
          if (res.code === 200) {
            this.data = res.body.records
            this.totalCount = res.body.total
            if (res.body.total === 0) {
              this.currentPage = 1
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    changePage (page) {
      console.log(page, 'page')
      this.currentPage = page.current
      this.pageSize = page.pageSize
      this.list()
    },

    conditionChanged (conditions) {
      console.log(conditions)
      this.conditions = conditions
      this.currentPage = '1'
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

    // 批量录入
    customRequest (request) {
      const tmpcnt = request.file.name.lastIndexOf('.')
      const ext = request.file.name.substring(tmpcnt + 1)
      if (ext === 'xlsx') {
        aliOSSSignature().then(res => {
          if (res.code === 200) {
            let formData = new FormData()
            formData.append('key', `${request.file.uid}.${ext}`)
            formData.append('OSSAccessKeyId', res.body.accessKeyId)
            formData.append('policy', res.body.policy)
            formData.append('Signature', res.body.signature)
            formData.append('success_action_status', '200')
            formData.append('file', request.file)
            axios.post(res.body.host, formData)
              .then(res => {
                if (res.status === 200) {
                  importoriginstudent(`${request.file.uid}.${ext}`).then(response => {
                    if (response.code === 200) {
                      this.$message.success('录入成功')
                    } else {
                      this.$message.error(response.message)
                    }
                  })
                }
              })
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.warning('文件格式上传错误')
      }
    },
    downloadTemplate () {
      exportStudentTemplates().then(res => {
        if (res.code === 200) {
          const iframe = document.createElement('iframe')
          iframe.src = res.body
          iframe.style.display = 'none'
          document.body.appendChild(iframe)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    customRequest2 (request) {
      const tmpcnt = request.file.name.lastIndexOf('.')
      const ext = request.file.name.substring(tmpcnt + 1)
      if (ext === 'zip') {
        aliOSSSignature().then(res => {
          if (res.code === 200) {
            let formData = new FormData()
            formData.append('key', `${request.file.uid}.${ext}`)
            formData.append('OSSAccessKeyId', res.body.accessKeyId)
            formData.append('policy', res.body.policy)
            formData.append('Signature', res.body.signature)
            formData.append('success_action_status', '200')
            formData.append('file', request.file)
            axios.post(res.body.host, formData)
              .then(res => {
                if (res.status === 200) {
                  importphotos(`${request.file.uid}.${ext}`).then(response => {
                    if (response.code === 200) {
                      this.$message.success('上传成功')
                    } else {
                      this.$message.warning(response.message)
                    }
                  })
                }
              })
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.warning('文件格式上传错误，仅支持.zip格式')
      }
    },
    // 查看
    look (row) {
      this.$router.push({path: '/entranceLook', query: {id: row.originStudentid, entranceStats: 1}})
    },
    // 编辑
    edit (row) {
      this.id = row.originStudentid
      this.editDialogVisible = true
    },
    // 删除
    del (row) {
      originstudentdelete(row.originStudentid)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 成功操作
    success () {
      this.list()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.oneEnteringDialog = false
      this.editDialogVisible = false
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.btn-bar{
  margin: 18px 0 28px 0;
  padding-left: 114px;
}
.table{
  padding-left: 114px;
  padding-right: 91px;
  .operation{
    color: #1890FF;
    span{
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>

<style scoped>
.box >>> .ant-btn{
  margin-right: 23px;
  width:88px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
.box >>> .ant-table-wrapper{
  padding: 0;
}
</style>
