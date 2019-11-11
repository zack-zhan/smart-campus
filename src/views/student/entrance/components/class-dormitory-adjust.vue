<template>
  <div class="box">
    <div style="margin-left: 94px;">
        <a-modal :footer="null" :visible="addSuperiorDialogVisible" :closable="false" :bodyStyle="bodyStyle">
          <addSuperior @onConfirm="onDormitoryConfirm" @close='addSuperiorDialogVisible = false' :visible="addSuperiorDialogVisible" />
        </a-modal>
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
              <a-col :span="9">
                <span>班级：</span>
                <a-select style="width: 40%" :options="gradeList" v-model="gradeId" placeholder="请选择年级" @change="gradeChanged"/>
                <a-select v-model="classId" style="width: 40%" :options="classList" placeholder="请选择班级" @change="classChanged"/>
              </a-col>
            </a-row>
            <a-row :gutter="32" type="flex" style="margin-top: 20px;">
              <a-col :span="5">
                <span>宿舍：</span>
                <a-button @click="addSuperiorDialogVisible=true">选择宿舍</a-button>
              </a-col>
              <a-col :span="7">
                <span>身份证号：</span>
                <a-input-search v-model="identityCard" @search="value => search({title: '身份证号', name: 'identityCard', text: value, value: value})" style="width: 70%;" placeholder="请输入身份证号"/>
              </a-col>
            </a-row>
          </div>
        </search-box>
    </div>
    <div class="btn-bar">
      <a-button @click="download">导出名单</a-button>
      <a-upload :customRequest="customRequest"
              :showUploadList="false"
              :data="dataObj">
        <a-button>导入名单</a-button>
      </a-upload>
    </div>
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
              <!-- <span @click="edit(text)">编辑</span> -->
            </div>
          </template>
        </a-table>
      </a-locale-provider>
    </div>
  </div>
</template>

<script>
import { originstudentpage, exportsplitclasses, importsplitclasses, gradelist, classlistbygradeid, aliOSSSignature } from '@/api'
import SearchBox from '@/components/search-box'
import addSuperior from '@/components/select-dormitory'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import axios from 'axios'
export default {
  data () {
    return {
      zhCN,

      columns: [{
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '学籍号',
        dataIndex: 'rollNo'
      }, {
        title: '班级',
        dataIndex: 'belongsClass'
      }, {
        title: '宿舍',
        dataIndex: 'dormitoryName'
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

      addSuperiorDialogVisible: false,
      bodyStyle: {
        padding: '24px 0 0 0'
      },
      gradeList: [],
      classList: [],
      gradeId: '',
      classId: '',

      dataObj: {}
    }
  },
  components: {
    SearchBox,
    addSuperior
  },
  methods: {
    // 获取列表
    list () {
      const request = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        entrances: 4
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
    onDormitoryConfirm (selectArr) {
      console.log(selectArr)
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
        }
      })
    },
    classChanged (value) {
      console.log(value)
      const item = this.classList.find(x => x.key === value)
      console.log(item)
      if (!item) {
        return
      }
      this.search({
        title: '班级',
        name: 'classId',
        text: item.title,
        value: item.key})
    },

    // 查看
    look (row) {
      this.$router.push({path: '/entranceLook', query: {id: row.originStudentid, entranceStats: 4}})
    },

    // 下载
    download () {
      exportsplitclasses().then(res => {
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
                  importsplitclasses(`${request.file.uid}.${ext}`).then(response => {
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
        this.$message.warning('文件格式上传错误')
      }
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
      }
    })
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
