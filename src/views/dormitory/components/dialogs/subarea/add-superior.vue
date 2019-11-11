<template>
  <div class="dialogBox">
    <div class="main">
      <div class="title">
        <span v-for="(item,index) in navArr" :key="index" @click="clickNav(index)" :class="index < navArr.length - 1 ? 'preItem':''">
          <span v-if="index !== 0">></span>
            {{item.name}}
        </span>
      </div>
      <div class="box">
        <div class="line">选择</div>
        <div class="input">
          <el-input
            placeholder="请输入搜索内容"
            suffix-icon="el-icon-search"
            v-model="search">
          </el-input>
        </div>
        <div class="tree">
          <el-scrollbar style="height:100%;">
            <div v-for="(item,index) in searchData" :key="index" style="margin-left:16px;">
              <el-checkbox v-model="item.checked" @change="changeCheck(index)" :disabled="item.checked!=true&&chooseIndex!='reset'"></el-checkbox>
              <span @click="clickTree(item)">{{item.name}}</span>
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
import { dormitoryPartitionlist } from '@/api'
export default {
  data () {
    return {
      search: '', // 搜索
      originData: [],
      data: [], // 列表数组
      navArr: [{name: '可选范围'}], // 导航数组

      chooseIndex: 'reset',
      selectArr: [] // 选中的数组
    }
  },
  computed: {
    searchData () {
      const search = this.search
      console.log(search, 'search')

      if (search) {
        return this.data.filter(function (data) {
          return data.name.indexOf(search) > -1
        })
      }

      return this.data
    }
  },
  methods: {
    // 点击节点
    clickTree (item) {
      console.log(item)
      if (item.childList.length > 0) {
        this.data = item.childList
        this.navArr.push(item)
      }
    },
    // 点击导航
    clickNav (index) {
      if (index === this.navArr.length - 1 && index !== 0) return
      const item = this.navArr[index]
      this.navArr.splice(index + 1, this.navArr.length - index - 1)
      const children = index === 0 ? this.originData : item.childList
      this.data = children
      console.log(this.selectArr)
    },
    // 点击勾选
    changeCheck (index) {
      const item = this.searchData[index]
      if (this.chooseIndex === index) {
        this.chooseIndex = 'reset'
        console.log('未选中')
        item.checked = false
        this.selectArr = null
        console.log(this.selectArr)
      } else {
        this.chooseIndex = index
        console.log('选中')
        item.checked = true
        this.selectArr = item
        console.log(this.selectArr)
      }
    },
    // 获取列表
    list () {
      dormitoryPartitionlist()
        .then(res => {
          if (res.code === 200) {
            res.body.map(item => {
              item.checked = false
            })
            this.originData = res.body
            this.clickNav(0)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 确认
    save () {
      eventBus.$emit('selectArr', this.selectArr)
      console.log(this.selectArr, '---')
      this.$emit('close')
    },
    // 点击取消发送关闭方法
    cancel () {
      this.$emit('close')
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  padding: 0;
}
.main{
  height: 345px;
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
    margin: 0 auto;
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
      div{
        .checkBox{
          display: inline-block;
          span:nth-child(1){
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid rgba(0,0,0,0.15);
            box-sizing: border-box;
            border-radius:2px;
            position: relative;
            top: 3px;
          }
          .checked{
            line-height: 16px;
            text-align: center;
            background:rgba(24,144,255,1);
            color: #fff;
            top: 1px !important;
          }
        }
        span{
          cursor: pointer;
        }
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
