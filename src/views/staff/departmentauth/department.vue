<template>
  <div class="box">
    <el-input
      placeholder="搜索"
      suffix-icon="el-icon-search"
      v-model="filterText">
    </el-input>
    <el-scrollbar class="scroll">
      <el-tree
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
      >
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { departmentlist } from '@/api'
export default {
  data () {
    return {
      filterText: '', // 搜索

      data: [], // 树形数组
      firstId: '',
      defaultProps: {
        children: 'childList',
        label: 'name'
      } // 自定义节点
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取列表
    list () {
      departmentlist()
        .then(res => {
          if (res.code === 200) {
            this.data = res.body
            const obj = {
              name: this.data[0].name,
              departmentid: this.data[0].departmentid,
              childList: this.data[0].childList
            }
            this.$emit('selected', obj)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 节点被点击时的回调
    handleNodeClick (data) {
      this.$emit('selected', data)
    },
    // 更新页面
    update () {
      this.$on('update', () => {
        this.list()
      })
    }
  },
  mounted () {
    this.list()
  },
  created () {
    this.update()
  }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 208px;
    height: 100%;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 25px;
    float: left;
    margin-right: 20px;
    .scroll{
      width: 170px;
      height: calc(100% - 50px);
      margin-top: 20px;
    }
  }
</style>

<style scoped>
  .box >>> .el-input__inner{
    width:160px;
    height:32px;
    line-height: 32px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(0,0,0,0.15);
  }
  .box >>> .el-input__suffix{
    top: -4px;
  }
  .box >>> .el-tree-node__content{
    height: 30px;
    line-height: 30px;
  }
  .box >>> .el-tree-node:focus>.el-tree-node__content {
    background-color: #fff;
    color: #1890FF;
  }
  .box >>> .el-tree-node__content:hover {
    background-color: #fff;
  }

  .box >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
