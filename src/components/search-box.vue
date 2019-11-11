<template>
    <div style="margin-left: 20px;margin-top: 20px;">
      <slot name="condition"></slot>
      <a-row :gutter="32" type="flex" style="margin-top: 20px;">
        <a-tag v-for="(item, index) in conditions" :key="index" v-model="visible" :closable="true" @close="onClose(item)">
          {{(`${item.title}:${item.text}`)}}
        </a-tag>
        <a v-if="resetVisible" href="javascript:void(0)" @click="resetCondition">
          重置
        </a>
        <span v-if="resetVisible" style="margin-left: 20px;">筛选出{{total}}条记录</span>
      </a-row>
    </div>
</template>
<script>
export default {
  props: ['conditions', 'title', 'total'],
  data () {
    return {
      visible: true
    }
  },
  methods: {
    onClose (item) {
      const conditions = this.conditions.filter(x => x.name !== item.name)
      console.log(conditions)
      this.$emit('conditionChanged', conditions)
    },
    resetCondition () {
      this.$emit('conditionChanged', [])
    }
  },
  computed: {
    resetVisible () {
      console.log(this.conditions)
      return this.conditions && this.conditions.length > 0
    }
  },
  watch: {
    visible (value) {
      if (!value) {
        this.visible = true
      }
    }
  }
}
</script>
<style lang="scss">

</style>
