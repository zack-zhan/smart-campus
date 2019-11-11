<template>
  <div></div>
</template>

<script>
import { token } from '@/api'
import { clientId, clientSecret } from '@/utils/config'
import { setCookie } from '@/utils/cookies'
export default {
  methods: {
    login () {
      if (!this.$route.query.auth_code && !this.$route.query.access_token) {
        return
      }
      const request = {}
      request.client_id = clientId
      request.client_secret = clientSecret
      if (this.$route.query.auth_code) {
        request.granted_type = 'authorizationcode'
        request.code = this.$route.query.auth_code
      }
      if (this.$route.query.access_token) {
        request.granted_type = 'accesstoken'
        request.access_token = this.$route.query.access_token
      }
      token(request)
        .then(res => {
          if (res.code === 200) {
            const token = res.body
            if (this.$route.query.corpId) {
              token.user_info.corpId = this.$route.query.corpId
            }
            console.log(this.$route.query.autoLogin, '-------')
            if (this.$route.query.autoLogin === 'true') {
              setCookie('token', token.access_token)
              setCookie('corpId', token.user_info.corpId)
              setCookie('name', token.user_info.username)
              setCookie('id', token.user_info.id)
            } else {
              sessionStorage.setItem('token', token.access_token)
              sessionStorage.setItem('corpId', token.user_info.corpId)
              sessionStorage.setItem('name', token.user_info.username)
              sessionStorage.setItem('id', token.user_info.id)
            }
            localStorage.setItem('menu_list', JSON.stringify(token.user_info.menu_list))
            this.$router.push('/home')
          } else {
            this.$message.error(res.message)
          }
        })
    }
  },
  mounted () {
    this.login()
  }
}
</script>
