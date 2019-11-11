<template>
  <a-layout>
    <a-layout-header style="background: #ffffff;height: 150px;">
      <div class="title">{{title}}</div>
      <a-button @click="assignAuth">添加权限</a-button>
      <AssignAuth :visible="assignAuthVisible" :origin-keys="originKeys" @ok="assigned" @cancel="assignAuthVisible=false"/>
    </a-layout-header>
    <a-layout-content>
      <a-locale-provider :locale="zhCN">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :locale="{emptyText: '暂无数据'}"
          rowKey="id"
          :pagination="{
            showQuickJumper: true,
            showSizeChanger:true,
          }">
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="您确定要删除吗?" @confirm="deleteItem(text, record)" okText="确定" cancelText="取消">
              <a href="#">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-locale-provider>
    </a-layout-content>
  </a-layout>
</template>
<script>
import { departmentauthlist, adddepartmentauth, deletedepartmentauth, departmentone } from '@/api'
import AssignAuth from './assignauth'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  components: {
    AssignAuth
  },
  props: {
    departmentId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      zhCN,

      originKeys: [],
      columns: [{
        title: '权限名称',
        dataIndex: 'authName',
        key: 'authName',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '编码',
        dataIndex: 'authCode',
        key: 'authCode',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        filterMultiple: false,
        width: 240,
        scopedSlots: {}
      }, {
        title: '操作',
        dataIndex: null,
        key: status,
        filterMultiple: false,
        width: 240,
        scopedSlots: { customRender: 'action' }
      }],
      dataSource: [],
      assignAuthVisible: false,
      title: '',

      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1 // 当前页数
    }
  },
  methods: {
    getlist () {
      if (this.departmentId) {
        console.log(this.departmentId)
        const param = {
          departmentId: this.departmentId
        }
        departmentauthlist(param).then(res => {
          if (res.code === 200) {
            this.dataSource = res.body
            this.total = res.body
          } else {
            this.dataSource = []
            this.total = 0
            this.$message.error(res.message)
          }
        })
      }
    },
    deleteItem (text, record) {
      deletedepartmentauth(record.id).then(res => {
        if (res.code === 200) {
          this.getlist()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    assignAuth () {
      this.originKeys = this.dataSource.map(x => x.authId)
      console.log(this.originKeys, '-=-=')
      this.assignAuthVisible = true
    },
    assigned (selectedKeys) {
      this.assignAuthVisible = false
      if (selectedKeys && selectedKeys.length > 0 && this.departmentId) {
        const param = {
          departmentId: this.departmentId,
          authList: selectedKeys
        }
        adddepartmentauth(param).then(res => {
          if (res.code === 200) {
            this.getlist()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  },
  watch: {
    departmentId () {
      this.getlist()
      if (this.departmentId) {
        departmentone(this.departmentId).then(res => {
          if (res.code === 200) {
            this.title = res.body[0].name
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
  font-size: 20px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
</style>

<style lang="scss">
  .ant-layout-header{
    padding: 0 32px;
    border-radius: 10px 10px 0 0;
  }
  .ant-table-wrapper {
    background: #ffffff !important;
    padding: 0 32px;
    border-radius: 0 0 10px 10px;
  }
  .ant-layout{
    border-radius: 10px;
  }
</style>
