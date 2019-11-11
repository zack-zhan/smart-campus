<template>
  <div class="form">
    <a-form
      :form="form"
    >
      <a-form-item
        label="标题"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
            'title',
            {rules: [{ required: true, message: '请输入标题' },{pattern:'^[\u4e00-\u9fa5_a-zA-Z0-9]+$',message:'不允许输入特殊字符'}],initialValue: title}
          ]"
          placeholder="输入名称"
          @change="titleChange"
        />
      </a-form-item>
      <a-form-item
        label="内容"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        class="textarea"
      >
        <a-textarea
          v-decorator="[
            'content',
            {rules: [{ required: true, message: '请输入内容' },{pattern:'^[\u4e00-\u9fa5_a-zA-Z0-9_，。]+$',message:'不允许输入特殊字符'}],initialValue: content}
          ]"
          placeholder="输入内容"
          @change="contentChange" />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12, offset: 4 }"
      >
        <a-button @click="look">预览</a-button>
      </a-form-item>
    </a-form>
    <a-drawer
      title="公告预览"
      placement="right"
      :closable="true"
      @close="lookDialogVisible = false"
      :visible="lookDialogVisible"
      width="600"
    >
      <Look :title="title" :content="content" :visible="lookDialogVisible"></Look>
    </a-drawer>
  </div>
</template>

<script>
import Look from './dialogs/look-notice'
export default {
  props: {
    clear: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      lookDialogVisible: false,

      title: '',
      content: ''
    }
  },
  components: {
    Look
  },
  methods: {
    titleChange (e) {
      this.title = e.target.value
      this.$store.commit('setNoticeTitle', this.title)
    },
    contentChange (e) {
      this.content = e.target.value
      this.$store.commit('setNoticeContent', this.content)
    },

    // 预览
    look () {
      this.lookDialogVisible = true
    }
  },
  mounted () {
    if (this.$store.state.notice.title) {
      this.title = this.$store.state.notice.title
    }
    if (this.$store.state.notice.content) {
      this.content = this.$store.state.notice.content
    }
  },
  watch: {
    clear (val) {
      this.title = ''
      this.content = ''
      this.form = this.$form.createForm(this)
    }
  }
}
</script>

<style lang="scss" scoped>
.form{
  width: 500px;
  margin: 0 auto;
}
</style>

<style scoped>
.form >>> .ant-input{
  width: 400px;
}
.textarea >>> .ant-input{
  height: 200px;
}
.form >>> .ant-form-item{
  margin-bottom: 16px;
}
</style>
