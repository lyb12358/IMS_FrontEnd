<template>
  <q-page class="flex flex-center">
    <q-card inline
            class="login-card q-mt-lg relative-position"
            color="grey-3">
      <q-card-title class="bg-primary text-white">
        欢迎，请先登录！
      </q-card-title>
      <q-card-main>
        <q-field icon="mdi-account"
                 class="q-mt-lg"
                 :error="$v.user.account.$error"
                 error-label="没用户名你还想登录？">
          <q-input v-model.trim="user.account"
                   float-label="用户名"
                   ref="account" />
        </q-field>
        <q-field icon="mdi-textbox-password"
                 class="q-mt-lg"
                 :error="$v.user.password.$error"
                 error-label="密码至少6位">
          <q-input v-model="user.password"
                   float-label="密码"
                   type="password"
                   ref="password"
                   @keyup.enter="login" />
        </q-field>
      </q-card-main>
      <q-card-actions align="end">
        <!-- <q-btn label="Register"
               flat
               color="secondary"
               @click="$router.push({ name: 'register' })" /> -->
        <q-btn label="注册"
               flat
               color="secondary"
               @click="notify('warning','暂未开放注册~')" />
        <q-btn label="登录"
               color="primary"
               icon="mdi-login"
               @click="login" />
      </q-card-actions>
      <q-inner-loading :visible="loading">
        <q-spinner-gears size="75px"
                         color="primary"></q-spinner-gears>
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import { minLength, required } from 'vuelidate/lib/validators'
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      user: {
        account: '',
        password: ''
      }
    }
  },
  validations: {
    user: {
      account: { required },
      password: { required, minLength: minLength(6) }
    }
  },
  methods: {
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type,
        position: 'bottom-right'
      })
    },
    login() {
      this.$v.user.$touch()
      if (this.$v.user.$invalid) {
        return
      }
      this.loading = true
      this.$store
        .dispatch('user/Login', this.user)
        .then(response => {
          let data = response.data
          this.loading = false
          this.$router.push('/index')
          this.$q.notify({
            type: 'positive',
            position: 'bottom-right',
            message: data.msg
          })
        })
        .catch(error => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.$refs.account.focus()
  }
}
</script>

<style lang="stylus" scoped>
.login-card
  width 320px
</style>