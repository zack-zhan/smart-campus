<template>
  <a-modal :visible="visible"
           cancelText="取消"
           okText="确认"
           :centered="true"
           title="分配权限"
           :closable="false"
           :width="800"
           @cancel="onCancelClicked"
           @ok="onOkClicked">
    <a-table :rowSelection="{selectedRowKeys: selectedKeys, onChange: onSelectChange}"
             rowKey="id"
             :columns="columns"
             :dataSource="dataSource">

    </a-table>
  </a-modal>
</template>
<script>
import { authlist } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    originKeys: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      selectedKeys: [],
      selectedIds: [],
      columns: [{
        title: '权限名称',
        dataIndex: 'name',
        key: 'name',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }, {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
        filterMultiple: false,
        width: 130,
        scopedSlots: {}
      }],
      dataSource: [],
      current: 1,
      size: 10,
      total: 0
    }
  },
  methods: {
    getlist () {
      if (this.visible) {
        // const param = {
        //   pageIndex: this.current,
        //   pageSize: this.pageSize
        // }
        authlist().then(res => {
          if (res.code === 200) {
            this.dataSource = res.body
            if (this.originKeys) {
              console.log(this.originKeys)
              this.dataSource = this.dataSource.filter(x => this.originKeys.findIndex(y => y === x.id) === -1)
            }
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    onCancelClicked () {
      this.$emit('cancel')
    },
    onOkClicked () {
      this.$emit('ok', this.selectedIds)
    },
    onSelectChange (selectedKeys, selectedRows) {
      this.selectedIds = selectedRows.map(x => x.id)
      this.selectedKeys = selectedKeys
    }
  },
  watch: {
    visible () {
      this.getlist()
      this.selectedIds = []
      this.selectedKeys = []
    }
  }
}
</script>
<style>

</style>
