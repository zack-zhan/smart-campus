<template>
  <a-modal cancelText="取消"
          okText="确定"
          :centered="true"
          :destroyOnClose="false"
          title="添加角色"
          :visible="visible"
          :closable="false"
          @cancel="onCancelClicked"
          @ok="onOkClicked">
    <a-table :rowSelection="{selectedRowKeys: selectedKeys, onChange: onSelectChange}"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource">>
    </a-table>
  </a-modal>
</template>
<script>
import { rolelist, addstaffrole } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    originTargetKey: {
      type: Array,
      default: function () {
        return []
      }
    },
    staffId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selectedKeys: [],
      selectedIds: [],
      dataSource: [],
      columns: [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        filterMultiple: false,
        width: 200,
        scopedSlots: {}
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        filterMultiple: false,
        width: 240,
        scopedSlots: {}
      }]
    }
  },
  methods: {
    getList () {
      rolelist().then(res => {
        if (res.code === 200) {
          this.dataSource = res.body.filter(x => this.originTargetKey.findIndex(y => x.id === y) === -1)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onCancelClicked () {
      this.$emit('cancel')
    },
    onOkClicked () {
      const param = {
        staffId: this.staffId,
        roleList: this.selectedIds
      }
      addstaffrole(param).then(res => {
        if (res.code === 200) {
          this.$emit('ok')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onSelectChange (selectedKeys, selectedRows) {
      this.selectedIds = selectedRows.map(x => x.id)
      this.selectedKeys = selectedKeys
    }
  },
  watch: {
    visible () {
      if (this.visible) {
        this.selectedIds = []
        this.selectedKeys = []
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">

</style>
