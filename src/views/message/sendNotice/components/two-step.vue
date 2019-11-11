<template>
  <div>
    <div class="transfer">
      <div class="transfer-list">
        <div class="transfer-title">
          <span :class="tabIndex === 1?'active':''" @click="select(1)">教师</span>
          <span :class="tabIndex === 2?'active':''" @click="select(2)">公告组</span>
          <span :class="tabIndex === 3?'active':''" @click="select(3)">家长</span>
        </div>
        <a-input-search
          placeholder="请输入搜索内容"
          v-model="keyWord"
          style="width: 228px;margin: 3px;"
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
import { noticegrouplist, studentkeeperall, getdepartmentandstafflist } from '@/api'
export default {
  data () {
    return {
      keyWord: '',
      tabIndex: 1,
      originDepartmentList: [],
      originNoticeList: [],
      originGurardianList: [],
      originNoticeGroupKeys: [],
      originGurardianKeys: [],
      dataSource: [],
      leftSelectedKeys: [],
      selectedDataSource: [],
      rightSelectedKeys: [],
      rightDataKeys: []
    }
  },
  methods: {
    select (index) {
      this.tabIndex = index
      this.keyWord = ''
      this.leftSelectedKeys = []
      this.rightSelectedKeys = []
      switch (this.tabIndex) {
        case 1: {
          this.rightDataKeys = this.$store.state.notice.teacher.map(x => x.key)
          this.getDepartmentList()
          break
        }
        case 2: {
          this.rightDataKeys = this.$store.state.notice.group.map(x => x.key)
          if (this.originNoticeList.length === 0) {
            noticegrouplist().then(res => {
              if (res.code === 200) {
                this.originNoticeList = res.body
                this.getNoticeGroupList()
              } else {
                this.dataSource = []
                this.$message.error(res.message)
              }
            })
          } else {
            this.getNoticeGroupList()
          }
          break
        }
        case 3: {
          this.rightDataKeys = this.$store.state.notice.patriarch.map(x => x.key)
          if (this.originGurardianList.length === 0) {
            studentkeeperall().then(res => {
              if (res.code === 200) {
                this.originGurardianList = res.body
                this.getGurardianList()
              } else {
                this.dataSource = []
                this.$message.error(res.message)
              }
            })
          } else {
            this.getGurardianList()
          }
          break
        }
      }
    },
    add () {
      this.rightDataKeys.push(...this.leftSelectedKeys)
      this.leftSelectedKeys = []
      switch (this.tabIndex) {
        case 1: {
          this.$store.commit('clearTeacher')
          this.getDepartmentList()
          break
        }
        case 2: {
          this.getNoticeGroupList()
          break
        }
        case 3: {
          this.getGurardianList()
          break
        }
      }
    },
    del () {
      this.rightDataKeys = this.rightDataKeys.filter(x => this.rightSelectedKeys.findIndex(y => x === y) === -1)
      console.log(this.rightDataKeys)
      this.rightSelectedKeys = []
      switch (this.tabIndex) {
        case 1: {
          this.$store.commit('clearTeacher')
          this.getDepartmentList()
          break
        }
        case 2: {
          this.getNoticeGroupList()
          break
        }
        case 3: {
          this.getGurardianList()
          break
        }
      }
    },
    onSearch () {
      switch (this.tabIndex) {
        case 1: {
          this.getDepartmentList()
          break
        }
        case 2: {
          this.getNoticeGroupList()
          break
        }
        case 3: {
          this.getGurardianList()
          break
        }
      }
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
            this.$store.commit('setNoticeTeacher', staff)
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
    },
    getNoticeGroupList () {
      this.$store.commit('clearNoticeGroup')
      this.dataSource = []
      this.originNoticeList.map(x => {
        const group = {
          key: x.id,
          title: x.name
        }
        if (this.rightDataKeys.findIndex(y => y === x.id) > -1) {
          this.$store.commit('setNoticeGroup', group)
        } else {
          if (x.name.indexOf(this.keyWord) > -1) {
            this.dataSource.push(group)
          }
        }
      })
    },
    getGurardianList () {
      this.$store.commit('clearNoticePatriarch')
      this.dataSource = []
      // this.originGurardianList.filter(x => x.name.indexOf(this.keyWord) > -1).map(x => {
      //   const group = {
      //     key: x.id,
      //     title: x.name
      //   }
      //   if (this.rightDataKeys.findIndex(y => y === x.id) > -1) {
      //     this.$store.commit('setNoticePatriarch', group)
      //   } else {
      //     this.dataSource.push(group)
      //   }
      // })
      this.originGurardianList.map(x => {
        const group = {
          key: x.id,
          title: x.name
        }
        if (this.rightDataKeys.findIndex(y => y === x.id) > -1) {
          this.$store.commit('setNoticePatriarch', group)
        } else {
          if (x.name.indexOf(this.keyWord) > -1) {
            this.dataSource.push(group)
          }
        }
      })
    }
  },
  mounted () {
    this.rightDataKeys = this.$store.state.notice.teacher.map(x => x.key)
    getdepartmentandstafflist().then(res => {
      if (res.code === 200) {
        this.originDepartmentList = res.body
        this.getDepartmentList()
      } else {
        this.dataSource = []
        this.$message.error(res.message)
      }
    })
  },
  computed: {
    rightDataSource () {
      switch (this.tabIndex) {
        default:
        case 1: {
          return this.$store.state.notice.teacher
        }
        case 2: {
          return this.$store.state.notice.group
        }
        case 3: {
          return this.$store.state.notice.patriarch
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer{
  width: 528px;
  height: 268px;
  margin:0 auto;
}
.transfer-list{
  width:236px;
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
