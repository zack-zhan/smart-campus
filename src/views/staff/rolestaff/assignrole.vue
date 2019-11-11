<template>
  <a-drawer :closable="true"
            @close="onClose"
            :destroyOnClose="true"
            title="分配角色"
            :visible="visible"
            width="600">
  <div class="box">
    <AddRole :staff-id="staffId" :visible="addRoleVisible" :origin-target-key="targetKey" @ok="onOk" @cancel="addRoleVisible=false"/>
    <div class="text">
      <div><span>名称：</span>{{staffInfo.name}}</div>
      <div><span>职位：</span>{{staffInfo.position}}</div>
    </div>
    <div class="func-container">
      <a href="javascript:void(0);" @click="showAddRole">添加角色</a>
    </div>
    <a-table :columns="columns"
        :dataSource="dataSource"
        rowKey="id">
        <span slot="action" slot-scope="text, record">
          <a href="javascript:void(0);" @click="deleteItem(text, record)">删除</a>
        </span>
    </a-table>
  </div>
  </a-drawer>
</template>
<script>
import { staffrolelist, rolelist, deletestaffrole } from '@/api'
import AddRole from './addrole'
export default {
  components: { AddRole },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    staffInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      columns: [{
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
      originList: [],
      targetKey: [],
      addRoleVisible: false
    }
  },
  methods: {
    getList () {
      if (this.staffInfo && this.staffInfo.staffid) {
        const param = {
          staffid: this.staffInfo.staffid
        }
        staffrolelist(param).then(res => {
          if (res.code === 200) {
            this.dataSource = res.body
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    onClose () {
      this.$emit('close')
    },
    deleteItem (text, record) {
      console.log(text, 'text')
      console.log(record, 'record')
      // this.dataSource = this.dataSource.filter(x => x.id !== record.id)
      deletestaffrole(record.id)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    onOk () {
      this.getList()
      this.addRoleVisible = false
    },
    showAddRole () {
      this.targetKey = this.dataSource.map(x => x.roleId)
      this.addRoleVisible = true
    }
  },
  mounted () {
    rolelist().then(res => {
      if (res.code === 200) {
        this.originList = res.body
      } else {
        this.$message.error(res.message)
      }
    })
  },
  watch: {
    visible () {
      if (this.visible) {
        this.getList()
      }
    }
  },
  computed: {
    staffId () {
      if (this.staffInfo) {
        return this.staffInfo.staffid
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
  .box {
    padding: 0;
    margin: 0;
    .text{
      div{
        margin-bottom: 15px;
        span{
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(0,0,0,0.85);
        }
      }
    }
    .func-container{
      height: 40px;
    }
    .drawer-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #E9E9E9;
      padding: 10px 16px;
      background: #fff ;
      text-align: right;
    }
  }
</style>
