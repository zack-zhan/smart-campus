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
            {rules: [{ required: true, message: '请输入标题' }],initialValue: l_title}
          ]"
          :disabled="true"
          placeholder="输入名称"
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
            {rules: [{ required: true, message: '请输入内容' }],initialValue: l_content}
          ]"
          :disabled="true"
          placeholder="输入内容" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      l_title: '',
      l_content: ''
    }
  },
  mounted () {
    this.l_title = this.title
    this.l_content = this.content
  },
  watch: {
    title (val) {
      this.l_title = this.$store.state.notice.title
    },
    content (val) {
      this.l_content = this.$store.state.notice.content
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
