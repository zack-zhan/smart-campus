<template>
  <div class="content">
    <div class="box">
      <a-row class="title">
        <a-col :span="4" class="left">
          <div>当前阶段：{{stageArr.currentStageName}}</div>
          <div>剩余时间：{{time}}</div>
          <div>下一阶段：{{stageArr.nextStageName}}</div>
        </a-col>
        <a-col :span="4" class="left" v-if="step === 2 || step === 3">
          <div>学生总数：{{countArr.studentTotal}}人</div>
          <div>已确认入学：{{countArr.confirmEnrollmentTotal}}人</div>
          <div>拒绝入学：{{countArr.refusalToEnrollTotal}}人</div>
          <div>未确认：{{countArr.notConfirmedTotal}}人</div>
        </a-col>
        <a-col :span="4" class="right">
          <div @click="set">
            <a-icon type="setting" class="icon" />
            <span>入学管理设置</span>
          </div>
        </a-col>
      </a-row>
      <a-modal
        v-model="visible"
        @ok="handleOk"
        okText="确认"
        cancelText="取消"
        width="600px"
      >
        <a-locale-provider :locale="zhCN">
          <div class="pl-2em mtb-13">录入学生阶段：
            <a-range-picker
            v-model="value1"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
            />
          </div>
        </a-locale-provider>
        <a-locale-provider :locale="zhCN">
          <div class="pl-2em mtb-13">家长确认阶段：
            <a-range-picker
            v-model="value2"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
            />
          </div>
        </a-locale-provider>
        <a-locale-provider :locale="zhCN">
          <div class="pl-2em mtb-13">学校确认阶段：
            <a-range-picker
            v-model="value3"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
            />
          </div>
        </a-locale-provider>
        <a-locale-provider :locale="zhCN">
          <div class="mtb-13">班级宿舍调整阶段：
            <a-range-picker
            v-model="value4"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
            />
          </div>
        </a-locale-provider>
      </a-modal>
      <div class="step">
        <a-steps :current="step">
          <a-step title="录入学生" />
          <a-step title="家长确认" />
          <a-step title="学校确认" />
          <a-step title="班级宿舍调整" />
        </a-steps>
      </div>
      <EnteringStudent v-if="step === 1"></EnteringStudent>
      <PatriarchAffirm v-if="step === 2"></PatriarchAffirm>
      <SchoolAffirm v-if="step === 3"></SchoolAffirm>
      <classDormitoryAdjust v-if="step === 4"></classDormitoryAdjust>
    </div>
  </div>
</template>

<script>
import EnteringStudent from './components/entering-student'
import PatriarchAffirm from './components/patriarch-affirm'
import SchoolAffirm from './components/school-affirm'
import classDormitoryAdjust from './components/class-dormitory-adjust'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

import { getentrancestageinfo, countStudentTotal, entrancemanagecreate, getentrancemanage, entrancemanageupdate } from '@/api'
import { getCookie } from '@/utils/cookies'

moment.locale('zh-cn')
export default {
  data () {
    return {
      step: 0,

      visible: false,

      zhCN,

      value1: [],
      value2: [],
      value3: [],
      value4: [],

      corpId: '',
      userId: '',
      id: '',

      stageArr: [],
      time: '',
      remaining: '',

      actiontime: '',

      countArr: []
    }
  },
  components: {
    EnteringStudent,
    PatriarchAffirm,
    SchoolAffirm,
    classDormitoryAdjust
  },
  methods: {
    // 获取阶段详情
    stage () {
      getentrancestageinfo(this.corpId)
        .then(res => {
          if (res.code === 200) {
            this.stageArr = res.body
            this.remaining = new Date(this.stageArr.currentStageEndDate).getTime() - new Date().getTime()
            this.remaining = this.remaining + 86400000
            this.step = res.body.currentStage

            // const start = '2019-08-01 00:00:00'
            // const end = '2019-08-01 00:00:10'
            // this.remaining = new Date(end).getTime() - new Date(start).getTime()

            const myact = setInterval(this.remainingTime, 1000)
            this.actiontime = myact

            console.log(this.step, '---------')

            if (this.step === 2 || this.step === 3) {
              this.headcount()
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取剩余时间
    remainingTime () {
      this.remaining = this.remaining - 1000
      if (this.remaining >= 0) {
        let d = Math.floor(this.remaining / 1000 / 60 / 60 / 24)
        let h = Math.floor(this.remaining / 1000 / 60 / 60 % 24)
        let m = Math.floor(this.remaining / 1000 / 60 % 60)
        let s = Math.floor(this.remaining / 1000 % 60)
        d = d < 10 ? ('0' + d) : d
        h = h < 10 ? ('0' + h) : h
        m = m < 10 ? ('0' + m) : m
        s = s < 10 ? ('0' + s) : s
        this.time = d + '天' + h + '小时' + m + '分' + s + '秒'
      }
    },

    // 获取学生相关总人数
    headcount () {
      countStudentTotal(this.step)
        .then(res => {
          if (res.code === 200) {
            this.countArr = res.body
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 获取设置详情
    set () {
      this.visible = true
      getentrancemanage(this.corpId)
        .then(res => {
          if (res.code === 200) {
            const value1 = []
            value1.push(moment(new Date(res.body.studententranceStarttime)))
            value1.push(moment(new Date(res.body.studententranceEndtime)))
            this.value1 = value1

            const value2 = []
            value2.push(moment(new Date(res.body.keeperconfirmStarttime)))
            value2.push(moment(new Date(res.body.keeperconfirmEndtime)))
            this.value2 = value2

            const value3 = []
            value3.push(moment(new Date(res.body.schoolconfirmStarttime)))
            value3.push(moment(new Date(res.body.schoolconfirmEndtime)))
            this.value3 = value3

            const value4 = []
            value4.push(moment(new Date(res.body.classdormitoryadjustStarttime)))
            value4.push(moment(new Date(res.body.classdormitoryadjustEndtime)))
            this.value4 = value4

            this.id = res.body.id
          } else {
            this.value1 = []
            this.value2 = []
            this.value3 = []
            this.value4 = []
            this.$message.error(res.message)
          }
        })
    },
    // 日期转成字符串方法
    formatDate (date) {
      const Y = date.getFullYear() // 年
      let M = date.getMonth() + 1 // 月
      M = M < 10 ? ('0' + M) : M
      let D = date.getDate() // 日
      D = D < 10 ? ('0' + D) : D
      return Y + '-' + M + '-' + D
    },
    // 确认
    handleOk (e) {
      this.visible = false
      const obj = {
        corpId: this.corpId,
        userId: this.userId,
        id: this.id,
        studententranceStarttime: this.formatDate(new Date(Date.parse(this.value1[0]))),
        studententranceEndtime: this.formatDate(new Date(Date.parse(this.value1[1]))),
        keeperconfirmStarttime: this.formatDate(new Date(Date.parse(this.value2[0]))),
        keeperconfirmEndtime: this.formatDate(new Date(Date.parse(this.value2[1]))),
        schoolconfirmStarttime: this.formatDate(new Date(Date.parse(this.value3[0]))),
        schoolconfirmEndtime: this.formatDate(new Date(Date.parse(this.value3[1]))),
        classdormitoryadjustStarttime: this.formatDate(new Date(Date.parse(this.value4[0]))),
        classdormitoryadjustEndtime: this.formatDate(new Date(Date.parse(this.value4[1])))
      }
      console.log(obj, '---')
      if (!this.id) {
        entrancemanagecreate(obj)
          .then(res => {
            if (res.code === 200) {
              this.stage()
              this.headcount()
              clearInterval(this.actiontime)
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.message)
            }
          })
      } else {
        entrancemanageupdate(obj)
          .then(res => {
            if (res.code === 200) {
              this.stage()
              this.headcount()
              clearInterval(this.actiontime)
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.message)
            }
          })
      }
    }
  },
  mounted () {
    this.corpId = getCookie('corpId')
    this.userId = getCookie('id')

    this.stage()
  },
  watch: {
    remaining (val) {
      if (this.step === 1 && val === 0) {
        this.step = 2
        this.stage()
        clearInterval(this.actiontime)
      } else if (this.step === 2 && val === 0) {
        this.step = 3
        clearInterval(this.actiontime)
      } else if (this.step === 3 && val === 0) {
        this.step = 4
        this.stage()
        clearInterval(this.actiontime)
      }
    }
  },
  beforeDestroy () {
    if (this.actiontime) {
      clearInterval(this.actiontime)
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  height: calc(100vh - 65px);
  background: #E9E9E9;
  padding: 20px;
  overflow: auto;
  .box{
    width: 100%;
    background: #fff;
    .title{
      padding: 16px 0 22px 94px;
      font-size: 14px;
      .left{
        float: left;
        div{
          line-height: 25px;
        }
      }
      .right{
        float: right;
        padding-top: 11px;
        .icon{
          font-size: 24px;
          float: left;
          margin-right: 7px;
        }
        div{
          cursor: pointer;
          display: inline-block;
        }
      }
    }
    .step{
      margin-left: 50px;
      margin-right: 55px;
      height: 54px;
      background: #F5F7FA;
      padding: 11px 25px 0 80px;
    }
  }
}
.pl-2em{
  padding-left: 2em;
}
.mtb-13{
  margin: 13px 0;
}
</style>

<style scoped>
.box >>> .ant-steps-item-icon{
  width: 24px;
  height: 24px;
  line-height: 24px;
  margin-top: 4px;
}
</style>
