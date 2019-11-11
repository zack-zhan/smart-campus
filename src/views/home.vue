<template>
  <div>
    <a-modal
      title="请选择企业"
      v-model="visible"
      :footer="null"
      :closable="false"
      :maskClosable="false"
    >
      <div v-for="(item,index) in schoolList" :key="index" class="box" @click="select(item)" :title="item.name">{{item.name}}</div>
    </a-modal>
  </div>
</template>

<script>
import { corporationlist } from '@/api'
import { getCookie, setCookie } from '@/utils/cookies'
export default {
  data () {
    return {
      visible: false,
      schoolList: []
    }
  },
  mounted () {
    let corpId = ''
    if (getCookie('corpId')) {
      corpId = getCookie('corpId')
    } else {
      corpId = sessionStorage.getItem('corpId')
    }
    if (corpId === 'null') {
      corporationlist().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.schoolList = res.body
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    } else {
      corporationlist().then(res => {
        console.log(res)
        if (res.code === 200) {
          res.body.map(item => {
            if (item.id === corpId) {
              this.$store.commit('setSchoolName', item.name)
            }
          })
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  methods: {
    select (item) {
      console.log(item, '---')
      if (getCookie('corpId')) {
        setCookie('corpId', item.id)
      } else {
        sessionStorage.setItem('corpId', item.id)
      }
      this.$store.commit('setSchoolName', item.name)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 150px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #999;
  text-align: center;
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 7px;
  cursor: pointer;

  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.box:nth-child(3n+3){
  margin-right: 0;
}
</style>
