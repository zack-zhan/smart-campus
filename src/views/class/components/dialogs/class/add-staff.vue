<template>
  <div class="dialogBox">
    <div class="main">
      <div class="box fl">
        <div class="line">选择</div>
        <div class="input">
          <el-input
            placeholder="请输入搜索内容"
            suffix-icon="el-icon-search"
            v-model="leftSearch">
          </el-input>
        </div>
        <div class="tree">
          <el-scrollbar style="height:100%;">
            <el-tree
            :data="departmentList"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree">
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
      <div class="box fr">
        <div class="line">选择</div>
        <div class="input">
          <el-input
            placeholder="请输入搜索内容"
            suffix-icon="el-icon-search"
            v-model="rightSearch">
          </el-input>
        </div>
        <div class="tree">
          <el-scrollbar style="height:100%;">
            <div v-for="(item,index) in searchData" :key="index">
              <el-checkbox v-model="item.checked"
                          :disabled="$store.state.grade.addClassDirector.staffid && $store.state.grade.addClassDirector.staffid !== item.staffid"
                          @change="clickCheck(index)">
              </el-checkbox>
              <span>{{item.name}}</span>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>
        <el-button class="btn" type="primary" @click="save">保存</el-button>
        <el-button class="btn" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from './eventBus.js' // 事件车
import { departmentlist, listbydepartmentid } from '@/api'
export default {
  data () {
    return {
      leftSearch: '', // 左边搜索
      rightSearch: '', // 右边搜索
      navArr: [{name: '可选范围'}], // 导航数组
      departmentList: [], // 部门列表数组
      defaultProps: {
        children: 'childList',
        label: 'name'
      },

      staffList: [], // 员工列表数组
      chooseIndex: 'reset'
    }
  },
  computed: {
    searchData () {
      const search = this.rightSearch
      console.log(search, 'search')

      if (search) {
        return this.staffList.filter(function (staffList) {
          return staffList.name.indexOf(search) > -1
        })
      }

      return this.staffList
    }
  },
  watch: {
    leftSearch (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    // 获取部门列表
    department () {
      departmentlist()
        .then(res => {
          if (res.code === 200) {
            this.departmentList = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 点击节点的回调
    handleNodeClick (data) {
      console.log(data.departmentid)
      listbydepartmentid(data.departmentid)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            res.body.map(item => {
              item.checked = false
            })
            this.staffList = res.body

            this.staffList.map(item => {
              if (item.staffid === this.$store.state.grade.addClassDirector.staffid) {
                item.checked = true
              }
            })
          } else {
            this.staffList = []
            this.$message.error(res.message)
          }
        })
    },
    // 点击勾选
    clickCheck (index) {
      const item = this.searchData[index]
      if (item.checked) {
        this.$store.commit('setAddClassDirector', item)
      } else {
        this.$store.commit('setAddClassDirector', {})
      }
    },
    // 确认
    save () {
      eventBus.$emit('select', this.$store.state.grade.addClassDirector)
      this.$emit('tsClose')
    },
    // 点击取消发送关闭方法
    cancel () {
      this.$emit('tsClose')
      this.$store.commit('setAddClassDirector', {})
    }
  },
  mounted () {
    this.department()
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  padding: 0;
}
.main{
  height: 345px;
  padding:40px 45px;
  .title{
    width:382px;
    height:32px;
    line-height: 32px;
    background:rgba(250,250,250,1);
    border-radius:4px;
    margin: 20px auto;
    padding-left: 10px;
    span{
      font-size:14px;
      font-family:PingFang-SC-Regular;
      font-weight:400;
      cursor: pointer;
    }
  }
  .box{
    width:176px;
    height:268px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(0,0,0,0.15);
    .line{
      line-height: 40px;
      padding-left: 10px;
      border-bottom: 1px solid rgba(0,0,0,0.09);
    }
    .input{
      text-align: center;
      margin: 5px 0;
    }
    .tree{
      height: 180px;
      >
      div{
        margin-left: 16px;
        line-height: 26px;
      }
    }
  }
}
.preItem{
  color: #4A90E2;
}
.footer{
  height: 55px;
  line-height: 55px;
  width: 100%;
  border-top: 1px solid rgba(233,233,233,1);
  div{
    float: right;
    padding-right: 15px;
  }
}
.btn{
  width:65px;
  height:32px;
  line-height: 32px;
  padding: 0;
}
</style>

<style scoped>
.dialogBox >>> .el-input--suffix{
  width: 168px !important;
}
.dialogBox >>> .el-input__inner{
  width: 168px;
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
}
.dialogBox >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
.dialogBox >>> .el-checkbox {
  margin: 0;
}
</style>
