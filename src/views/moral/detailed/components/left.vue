<template>
  <div class="left">
      <div class="title">
        <span>细则类型</span>
        <i class="add-icon" @click="addType">+</i>
      </div>
      <!-- 新增类型弹框 -->
      <a-drawer
        title="新增细则类型"
        placement="right"
        :closable="false"
        :visible="addTypeDialogVisible"
        width="600"
      >
        <AddType @success='success' @close='closeDialog'></AddType>
      </a-drawer>
      <div class="line" v-for="(item,index) in list" :key="index">
        <span :class="selectIndex === index?'active':''" @click="selectType(item,index)">{{item.name}}</span>
        <i class="icon iconfont icon-gengduo" @click="visible = !visible"></i>
        <div class="box" v-if="selectIndex === index" v-show="visible">
          <div @click="editType(item)">编辑</div>
          <div @click="delType(item)">删除</div>
        </div>
      </div>
      <!-- 编辑类型弹框 -->
      <a-drawer
        title="编辑细则类型"
        placement="right"
        :closable="false"
        :visible="editTypeDialogVisible"
        width="600"
      >
        <EditType :id="editTypeId" :visible="editTypeDialogVisible" @success='success' @close='closeDialog'></EditType>
      </a-drawer>
    </div>
</template>

<script>
import AddType from './dialogs/add-type' // 引入新增细则类型弹框组件
import EditType from './dialogs/edit-type' // 引入编辑细则类型弹框组件
import { groupsAll, groupsDelete } from '@/api'
import eventBus from './eventBus.js' // 事件车
export default {
  data () {
    return {
      visible: false, // 是否显示

      addTypeDialogVisible: false, // 新增细则类型弹框
      list: [], // 细则类型数组
      selectIndex: 0, // 选择的细则类型索引
      selectId: '', // 选择的细则类型id
      selectName: '', // 选择的细则类型name

      editTypeDialogVisible: false, // 编辑细则类型弹框
      editTypeId: '' // 编辑细则类型的id
    }
  },
  components: {
    AddType,
    EditType
  },
  methods: {
    // 获取初始化列表
    initializeList () {
      groupsAll()
        .then(res => {
          if (res.code === 200) {
            this.list = res.body
            const selectData = {
              selectId: this.list[0].id,
              selectName: this.list[0].name
            }
            eventBus.$emit('selectData', selectData)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取细则类型列表
    typeList () {
      groupsAll()
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.list = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 新增细则类型
    addType () {
      this.addTypeDialogVisible = true
    },
    // 选择的细则类型
    selectType (item, index) {
      console.log(item)
      this.selectIndex = index
      const selectData = {
        selectId: item.id,
        selectName: item.name
      }
      eventBus.$emit('selectData', selectData)
    },
    // 编辑细则类型
    editType (item) {
      this.editTypeId = item.id
      this.editTypeDialogVisible = true
    },
    // 删除细则类型
    delType (item) {
      groupsDelete(item.id)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.visible = false
            this.typeList()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 成功操作
    success () {
      this.typeList()
      this.closeDialog()
    },
    // 关闭弹出框
    closeDialog () {
      this.addTypeDialogVisible = false
      this.editTypeDialogVisible = false
    }
  },
  mounted () {
    this.initializeList()
  }
}
</script>

<style lang="scss" scoped>
.left{
  width: 144px;
  height: 100%;
  background: #fff;
  float: left;
  .title{
    font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    height: 55px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    margin-bottom: 20px;
    span{
      margin-top: 19.5px;
      display: inline-block;
      margin-right: 10px;
    }
    .add-icon{
      width:16px;
      height:16px;
      line-height: 16px;
      background:rgba(24,144,255,1);
      font-size: 16px;
      color: #fff;
      display: inline-block;
      cursor:pointer;
    }
  }
  .line{
    width: 100%;
    height: 16px;
    margin-bottom: 20px;
    text-align: center;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    position: relative;
    cursor:pointer;
    span{
      margin:0 20px;
      width: 56px;
      display: inline-block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    .active{
      color:rgba(24,144,255,1);
    }
    .icon-gengduo{
      font-weight: bold;
      color: #000;
      position: relative;
      top: -4px;
    }
    .box{
      width:76px;
      height:60px;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 3px 0px rgba(0,0,0,0.15);
      border-radius:4px;
      text-align: left;
      position: absolute;
      top: 20px;
      right: -50px;
      z-index: 9;
      div{
        width: 100%;
        line-height: 30px;
        padding-left: 10px;
        font-size:10px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.65);
      }
      div:nth-child(1){
        background:rgba(24,144,255,1);
        border-radius:4px 4px 0 0;
        color: #fff;
      }
    }
  }
}
</style>

<style scoped>
.left >>> .el-dialog {
    width: 600px;
    right: -34.4%;
    min-height: 100%;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
.left >>> .el-dialog__header{
  padding: 0;
  margin: 0;
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid rgba(208,206,206,1);
}
.left >>> .el-dialog__title{
  padding-left: 30px;
  font-size:16px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.left >>> .el-dialog__headerbtn{
  top: 0;
}

.left >>> .el-dialog__wrapper {
    z-index: 9999 !important;
}
</style>
