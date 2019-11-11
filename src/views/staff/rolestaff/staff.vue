<template>
  <a-layout>
    <a-layout-header style="background: #ffffff;">
      <div class="title">分配角色</div>
      <AssignRole :visible="assignRoleVisible"
                  :staff-info="staffInfo"
                  @close="assignRoleVisible=false"/>
    </a-layout-header>
    <a-layout-content>
      <a-locale-provider :locale="zhCN">
        <a-table :columns="columns"
          @change="pagination => changePage(pagination)"
          :pagination="{
          showQuickJumper: true,
          showSizeChanger:true,
          total: total,
          current: current,
          pageSize: size}"
          :dataSource="dataSource"
          :locale="{emptyText: '暂无数据'}"
          rowKey="staffid">
          <span slot="action" slot-scope="text, record">
            <a href="javascript:void(0);" @click="assignRole(text, record)">分配角色</a>
          </span>
        </a-table>
      </a-locale-provider>
    </a-layout-content>
  </a-layout>
</template>
<script>
import { staffpage } from '@/api'
import AssignRole from './assignrole'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  components: { AssignRole },
  props: {
    departmentId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      zhCN,

      columns: [{
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '职位',
        dataIndex: 'position',
        key: 'position',
        filterMultiple: false,
        width: 130,
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
      current: 1,
      size: 10,
      total: 0,
      assignRoleVisible: false,
      staffInfo: {}
    }
  },
  methods: {
    getList () {
      if (this.departmentId) {
        const param = {
          pageIndex: this.current,
          pageSize: this.size,
          departmentid: this.departmentId
        }
        staffpage(param).then(res => {
          if (res.code === 200) {
            this.dataSource = res.body.records
            this.total = res.body.total
          } else {
            this.dataSource = []
            this.$message.error(res.message)
          }
        })
      }
    },
    assignRole (text, record) {
      this.staffInfo = record
      this.assignRoleVisible = true
    },
    changePage (pagination) {
      this.current = pagination.current
      this.size = pagination.pageSize
      this.getList()
    }
  },
  watch: {
    departmentId () {
      if (this.departmentId) {
        this.getList()
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
  }
  .ant-table-wrapper {
    padding: 0 32px;
    background: #ffffff !important;
  }
</style>
