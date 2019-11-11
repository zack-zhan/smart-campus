<template>
  <div class="content">
    <div class="box">
      <div class="title">发送公告</div>
      <div class="step">
        <a-steps progressDot :current="step">
          <a-step title="编辑公告" />
          <a-step title="选择发送对象" />
          <a-step title="预览" />
          <a-step title="完成" />
        </a-steps>
      </div>
      <OneStep v-if="step === 0" :clear="clear"></OneStep>
      <TwoStep v-if="step === 1"></TwoStep>
      <ThreeStep v-if="step === 2"></ThreeStep>
      <FourStep v-if="step === 3"></FourStep>
    </div>
    <div class="footer">
      <div class="btn" v-if="step === 3"><a-button @click="back">返回</a-button></div>
      <div class="btn" v-if="step !== 3"><a-button @click="cancel">取消</a-button></div>
      <div class="btn" v-if="step !== 3"><a-button type="primary" @click="down">下一步</a-button></div>
      <div class="btn" v-if="step !== 0 && step !== 3"><a-button @click="up">上一步</a-button></div>
      <div v-if="step === 0">
        发送方式：
        <a-select :defaultValue="mode" @change="handleChange">
          <a-select-option value="1">短信</a-select-option>
        </a-select>
      </div>
    </div>
  </div>
</template>

<script>
import OneStep from './components/one-step'
import TwoStep from './components/two-step'
import ThreeStep from './components/three-step'
import FourStep from './components/four-step'
export default {
  data () {
    return {
      step: 0,

      isBlank: false,

      mode: '1',
      clear: false
    }
  },
  components: {
    OneStep,
    TwoStep,
    ThreeStep,
    FourStep
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
      this.mode = value
      this.$store.commit('setNoticeMode', this.mode)
    },

    // 下一步
    down () {
      if (this.step === 0) {
        if (this.$store.state.notice.title === '' || this.$store.state.notice.content === '') {
          this.$message.warning('请输入标题和内容')
          return
        }
        const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
        if (!reg.test(this.$store.state.notice.title) || !reg.test(this.$store.state.notice.content)) {
          this.$message.warning('不允许输入特殊字符')
          return
        }
        this.step = 1
      } else if (this.step === 1) {
        if (this.$store.state.notice.teacher.length === 0 && this.$store.state.notice.group.length === 0 && this.$store.state.notice.patriarch.length === 0) {
          this.$message.warning('请选择发送对象')
          return
        }
        this.step = 2
      } else if (this.step === 2) {
        if (this.$store.state.notice.teacher.length === 0 && this.$store.state.notice.group.length === 0 && this.$store.state.notice.patriarch.length === 0) {
          this.$message.warning('发送对象为0，请重新选择发送对象')
          return
        }
        this.step = 3
      }
    },
    // 上一步
    up () {
      if (this.step === 3) {
        this.step = 2
      } else if (this.step === 2) {
        this.step = 1
      } else if (this.step === 1) {
        this.step = 0
      }
    },
    // 返回
    back () {
      this.step = 0
    },
    cancel () {
      this.$store.commit('setNoticeTitle', '')
      this.$store.commit('setNoticeContent', '')
      this.$store.commit('clearTeacher')
      this.$store.commit('clearNoticeGroup')
      this.$store.commit('clearNoticePatriarch')
      this.step = 0

      this.clear = !this.clear
    }
  },
  created () {
    this.$store.commit('setNoticeTitle', '')
    this.$store.commit('setNoticeContent', '')
    this.$store.commit('clearTeacher')
    this.$store.commit('clearNoticeGroup')
    this.$store.commit('clearNoticePatriarch')
  },
  mounted () {
    this.$store.commit('setNoticeMode', this.mode)
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  height: calc(100vh - 65px);
  background: #E9E9E9;
  padding-top: 20px;
  overflow: hidden;
  .box{
    width: calc(100% - 40px);
    height: calc(100% - 72px);
    background: #fff;
    margin: 0px 20px;
    overflow-y:scroll;
    .title{
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid rgba(233,233,233,1);
      padding-left: 32px;
      font-size:16px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,0,0,0.85);
    }
    .step{
      margin: 36px 20px;
    }
  }
  .footer{
    height:56px;
    line-height: 56px;
    background:rgba(255,255,255,1);
    box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
    margin-top: 20px;
    padding-right: 24px;
    div{
      float: right;
    }
    .btn{
      margin-left: 8px;
    }
  }
}
</style>

<style scoped>
.footer >>> .ant-select{
  margin-top: 12px;
}
</style>
