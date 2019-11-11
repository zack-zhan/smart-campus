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
            v-model="keyWord">
          </el-input>
        </div>
        <div class="tree">
          <el-scrollbar style="height:100%;">
            <div v-for="(item,index) in data" :key="index" style="margin-left:16px;">
              <div class="checkBox" @click="clickCheck(index)">
                <span class="checked" v-if="item.checked">✓</span>
                <span v-else></span>
              </div>
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
import { departmentlist } from '@/api'
export default {
  props: {
    selectList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      keyWord: '',
      originList: [],
      originData: [],
      data: [], // 列表数组
      navArr: [{name: '可选范围'}], // 导航数组

      selectArr: [] // 选中的数组
    }
  },
  methods: {
    // 点击节点
    clickTree (item) {
      console.log(this.selectArr)
      if (item.childList.length > 0) {
        item.childList.map(x => {
          x.checked = this.selectArr.findIndex(y => y.departmentid === x.departmentid) > -1
        })
        this.data = item.childList
        this.originData = [
          ...item.childList
        ]
        this.navArr.push(item)
      }
    },
    // 点击导航
    clickNav (index) {
      this.keyWord = ''
      if (index === this.navArr.length - 1 && index !== 0) return
      const item = this.navArr[index]
      this.navArr.splice(index + 1, this.navArr.length - index - 1)
      const children = index === 0 ? this.originList : item.childList
      this.selectList.map((item, index) => {
        const originIndex = children.findIndex(x => x.departmentid === item.departmentid)
        if (originIndex === -1) return
        const [ originItem ] = children.splice(originIndex, 1)
        originItem.checked = true
        children.splice(originIndex, 0, originItem)
      })
      this.data = children
      this.originData = [
        ...children
      ]
      console.log(this.data, '123')
    },
    // 点击勾选
    clickCheck (index) {
      console.log(this.selectArr, 'origin')
      const [ item ] = this.data.splice(index, 1)
      item.checked = !item.checked
      this.data.splice(index, 0, item)
      if (item.checked) {
        this.selectArr.push(item)
        console.log(this.selectArr, 'add')
      } else {
        const removeIndex = this.selectArr.findIndex(x => x.departmentid === item.departmentid)
        this.selectArr.splice(removeIndex, 1)
        console.log(this.selectArr, 'remove')
      }
    },
    // 获取列表
    list () {
      departmentlist()
        .then(res => {
          if (res.code === 200) {
            res.body.map(item => {
              item.checked = false
            })
            this.originList = res.body
            this.originData = res.body
            this.data = [
              ...res.body
            ]
            this.selectArr = [ ...this.selectList ]
            this.clickNav(0)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 确认
    save () {
      this.selectList.splice(0, this.selectList.length)
      this.selectArr.map(x => this.selectList.push(x))
      this.$emit('close')
    },
    // 点击取消发送关闭方法
    cancel () {
      this.$emit('close')
    }
  },
  watch: {
    keyWord (value) {
      console.log(value)
      console.log(this.originData)
      this.data = this.originData.filter(x => x.name.indexOf(value) > -1)
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
.dialogBox >>> .el-input__suffix {
    top: -3px;
}
</style>
