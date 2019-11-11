<template>
  <div class="main">
    <div class="left fl">
      <span>姓名：{{arr.name}}</span>
      <span>学号：{{arr.studentNo}}</span>
      <span>考生号：{{arr.examineeNo}}</span>
      <span>身份证号：{{arr.identityCard}}</span>
      <span>毕业学校：{{arr.graduateSchool}}</span>
      <span>性别：{{arr.gender === 0?'女':'男'}}</span>
      <span>民族：{{arr.nation}}</span>
      <span>是否寄宿：{{arr.lodgingFlag === 0?'否':'是'}}</span>
      <span>户籍：{{arr.censusRegister}}</span>
      <span>政治面貌：{{arr.politicalStatus}}</span>
      <span>语文：{{arr.chineseScore}}</span>
      <span>英语：{{arr.englishScore}}</span>
      <span>物理：{{arr.physicalScore}}</span>
      <span>体育：{{arr.sportsScore}}</span>
      <span>总分（不含加分）：{{arr.totalScore}}</span>
      <span>数学：{{arr.mathScore}}</span>
      <span>思想品德：{{arr.politicalScore}}</span>
      <span>化学：{{arr.chemistryScore}}</span>
      <span>学籍号：{{arr.rollNo}}</span>
      <span>出生日期：{{arr.birthday}}</span>
      <span>联系人：{{arr.contact}}</span>
      <span>联系人电话：{{arr.contactNumber}}</span>
      <span>联系人手机：{{arr.contactCellphone}}</span>
      <span>联系人地址：{{arr.contactAddress}}</span>
    </div>
    <div class="right fl">
      <img :src="arr.avatar" alt />
    </div>
  </div>
</template>

<script>
import { originstudentone } from '@/api'
export default {
  data () {
    return {
      id: '', // 学生id
      entranceStats: '',
      arr: []
    }
  },
  methods: {
    // 获取详情
    list () {
      const obj = {
        id: this.id,
        entranceStats: this.entranceStats
      }
      originstudentone(obj).then(res => {
        if (res && res.code === 200) {
          this.arr = res.body
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  mounted () {
    // 获取路由跳转带过来的参数
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.entranceStats = this.$route.query.entranceStats
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding-left: 32px;
  padding-top: 15px;
  overflow: hidden;
  .btn {
    width: 88px;
    height: 32px;
    line-height: 32px;
    padding: 0;
    margin-bottom: 20px;
    display: block;
  }
  .left {
    width: 40%;
    span {
      display: block;
      width: 300px;
      height: 25px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .right {
    width: 60%;
    img {
      width: 128px;
      height: 128px;
    }
  }
}
</style>
