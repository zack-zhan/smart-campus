<template>
  <div class="box">
    <div class="transfer">
      <div class="transfer-list">
        <div class="transfer-title">
          <span>选择</span>
        </div>
        <a-input-search
          placeholder="请输入搜索内容"
          v-model="keyWord"
          style="width: 168px;margin: 3px;"
          @search="onSearch"
        />
        <div class="content">
          <a-tree :treeData="dataSource"
          v-model="leftSelectedKeys"
            checkable/>
        </div>
      </div>
      <div class="transfer-operation">
        <div :class="leftSelectedKeys.length > 0?'select':''" @click="add"><a-icon type="right" /></div>
        <div :class="rightSelectedKeys.length > 0?'select':''" @click="del"><a-icon type="left" /></div>
      </div>
      <div class="transfer-list">
        <div class="transfer-title2">
          <span>已选</span>
          <div class="content2">
            <a-tree :treeData="rightDataSource"
            v-model="rightSelectedKeys"
              checkable
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getdepartmentandstafflist } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      keyWord: '',
      originDepartmentList: [],
      dataSource: [],
      leftSelectedKeys: [],
      rightSelectedKeys: [],
      rightDataKeys: []
    }
  },
  methods: {
    add () {
      this.rightDataKeys.push(...this.leftSelectedKeys)
      this.leftSelectedKeys = []

      this.$store.commit('clearBulletingTeacher')
      this.getDepartmentList()
    },
    del () {
      this.rightDataKeys = this.rightDataKeys.filter(x => this.rightSelectedKeys.findIndex(y => x === y) === -1)
      this.rightSelectedKeys = []

      this.$store.commit('clearBulletingTeacher')
      this.getDepartmentList()
    },

    onSearch () {
      this.$store.commit('clearBulletingTeacher')
      this.getDepartmentList()
    },

    getDepartmentList () {
      this.dataSource = this.originDepartmentList.map(x => {
        const target = {
          key: x.departmentid,
          title: x.name,
          children: []
        }
        return this.getDepartmentChildren(x, target)
      })
    },
    getDepartmentChildren (parent, node) {
      if (parent.childList && parent.childList.length > 0) {
        const departmentNodes = parent.childList.map(x => {
          const department = {
            key: x.departmentid,
            title: x.name,
            children: []
          }
          return this.getDepartmentChildren(x, department)
        })
        node.children.push(...departmentNodes)
      }
      if (parent.staffList && parent.staffList.length > 0) {
        parent.staffList.map(x => {
          const staff = {
            key: x.staffId,
            title: x.staffName,
            isLeaf: true
          }
          if (this.rightDataKeys.findIndex(y => x.staffId === y) > -1) {
            this.$store.commit('setBulletingroupTeacher', staff)
          } else {
            if (staff.title.indexOf(this.keyWord) > -1) {
              node.children.push(staff)
            }
          }
        })
      }
      if (node.children.filter(x => x.isLeaf || !x.style || (x.style && x.style.display !== 'none')).length === 0) {
        node.style = {
          'display': 'none'
        }
      }
      return node
    }
  },
  watch: {
    visible (val) {
      if (val) {
        console.log(this.rightSelectedKeys, '11')
        getdepartmentandstafflist().then(res => {
          if (res.code === 200) {
            this.originDepartmentList = res.body
            this.getDepartmentList()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  },
  mounted () {
    this.rightDataKeys = this.$store.state.bulletingroup.teacher.map(x => x.key)
    console.log(this.rightSelectedKeys, '22')
    getdepartmentandstafflist().then(res => {
      if (res.code === 200) {
        this.originDepartmentList = res.body
        this.getDepartmentList()
      } else {
        this.$message.error(res.message)
      }
    })
  },
  computed: {
    rightDataSource () {
      return this.$store.state.bulletingroup.teacher
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer{
  width: 408px;
  height: 268px;
  margin:0 auto;
}
.transfer-list{
  width:176px;
  height:268px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  border:1px solid rgba(0,0,0,0.15);
  float: left;
  .transfer-title{
    height: 40px;
    border-bottom: 1px solid rgba(0,0,0,0.09);
    display: flex;
    span{
      flex:1;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
    .active{
      color: #1890FF;
      border-bottom: 2px solid #1890FF;
    }
  }
  .content{
    height: 185px;
    overflow-y:scroll
  }
  .content2{
    margin-top: 3px;
    height: 220px;
    overflow-y:scroll
  }
  .transfer-title2{
    height: 40px;
    border-bottom: 1px solid rgba(0,0,0,0.09);
    span{
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      margin-left: 12px;
    }
  }
  .line{
    margin-top: 10px;
    padding-left: 12px;
    div{
      margin-bottom: 10px;
    }
  }
}
.transfer-operation{
  width: 56px;
  height: 268px;
  float: left;
  div{
    width:24px;
    height:24px;
    line-height: 24px;
    text-align: center;
    // background:rgba(24,144,255,1);
    background:rgba(0,0,0,0.04);
    border:1px solid rgba(0,0,0,0.15);
    box-sizing: border-box;
    border-radius:4px;
    color: #ccc;
    margin-left: 16px;
    cursor: pointer;
  }
  div:nth-child(1){
    margin-top: 100px;
  }
  div:nth-child(2){
    margin-top: 4px;
  }
  .select{
    background:rgba(24,144,255,1);
    color:#fff;
  }
}
</style>
