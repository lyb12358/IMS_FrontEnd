<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               dense
               round
               @click="leftDrawerOpen = !leftDrawerOpen">
          <q-icon name="mdi-menu" />
        </q-btn>

        <q-toolbar-title style="font-weight:bold">
          博洋家纺信息中心
          <div slot="subtitle">coded by Lyb</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <!-- <q-layout-footer>
      <q-toolbar color="primary">
      </q-toolbar>
    </q-layout-footer> -->

    <q-layout-drawer v-model="leftDrawerOpen">
      <q-scroll-area style="width: 100%; height: 100%;">
        <q-list no-border
                link
                inset-delimiter
                style="padding:0">
          <q-card class="no-shadow">
            <div class="row flex-center"
                 style="height: 100px">
              <!-- <img src="~assets/logo.png"
                   style="height: 75px; width 75px;"> -->
              <div class="text-italic force-color"
                   style="font-weight:800;font-size:50px;">
                IMS
              </div>
              <div class="caption q-ml-lg">
                v0.1.0
              </div>
            </div>
            <q-item-separator />
            <q-item>
              <q-item-side :avatar="avatarLcation" />
              <q-item-main>
                <q-item-tile label>{{userName}}</q-item-tile>
                <q-item-tile sublabel>{{comName}} {{departName}}</q-item-tile>
              </q-item-main>
              <!-- <q-item-main>
              <q-item-tile label>角色：管理员</q-item-tile>
            </q-item-main> -->
              <q-btn flat
                     color="primary"
                     icon="mdi-logout"
                     @click="logout()">
                <q-tooltip>登出</q-tooltip>
              </q-btn>
              <!-- <q-item-side icon="mdi-logout"
                       color="primary" /> -->
            </q-item>
          </q-card>
          <q-item @click.native="$router.push('/')">
            <q-item-side icon="mdi-home"
                         color="primary" />
            <q-item-main label="主页" />
          </q-item>
          <q-collapsible>
            <template slot="header">
              <q-item-side icon="mdi-account-multiple"
                           color="primary" />
              <q-item-main label="用户管理" />
            </template>
            <q-item link
                    @click.native="notify('warning','都跟你说了是摆设，你点也没用~')"
                    class="q-ml-xl">
              <q-item-main label="用户" />
            </q-item>
            <q-item link
                    @click.native="notify('warning','都跟你说了是摆设，你点也没用~')"
                    class="q-ml-xl">
              <q-item-main label="角色" />
            </q-item>
          </q-collapsible>
          <q-collapsible>
            <template slot="header">
              <q-item-side icon="mdi-domain"
                           color="primary" />
              <q-item-main label="组织管理" />
            </template>
            <q-item link
                    @click.native="$router.push('comManage')"
                    class="q-ml-xl">
              <q-item-main label="公司/部门管理" />
            </q-item>
          </q-collapsible>
          <q-collapsible>
            <template slot="header">
              <q-item-side icon="mdi-layers"
                           color="primary" />
              <q-item-main label="产品管理" />
            </template>
            <q-item link
                    @click.native="$router.push('productCode')"
                    class="q-ml-xl">
              <q-item-main label="产品编号管理" />
            </q-item>
            <q-item link
                    @click.native="$router.push('productStyle')"
                    class="q-ml-xl">
              <q-item-main label="产品款式管理" />
            </q-item>
            <q-item link
                    @click.native="$router.push('productCat')"
                    class="q-ml-xl">
              <q-item-main label="产品类别管理" />
            </q-item>
          </q-collapsible>
          <q-item @click.native="$router.push('changeLog')">
            <q-item-side icon="mdi-book-open"
                         color="primary" />
            <q-item-main label="更新日志" />
          </q-item>
          <q-item-separator />
          <q-list-header>外部链接</q-list-header>
          <q-item @click.native="openURL('http://hao.china-beyond.com/')">
            <q-item-side icon="mdi-compass"
                         color="primary" />
            <q-item-main label="导航" />
          </q-item>
          <q-item @click.native="openURL('http://beyond-oa.com/')">
            <q-item-side icon="mdi-briefcase"
                         color="primary" />
            <q-item-main label="OA" />
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-layout-drawer>

    <q-page-container>
      <transition enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                  mode="out-in"
                  :duration="300"
                  @leave="resetScroll">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'dashboard',
  data() {
    return {
      leftDrawerOpen: true
    }
  },
  computed:{
    permissions(){
      return this.$store.getters['user/permissions']
    },
    userName(){
      return this.$store.getters['user/userInfo'].name
    },
    departName(){
      return this.$store.getters['user/userInfo'].departLabel
    },
    comName(){
      return this.$store.getters['user/userInfo'].comLabel
    },
    avatarLcation(){
      if(this.permissions.indexOf('superAdmin') > -1){
        return 'statics/logo/personal_logo.jpg'
      } else{
        return  'statics/sad.svg'
      }
    }
  },
  methods: {
    openURL,
    logout(){
      this.$q.dialog({ 
        title: '退出登录',
        message: '你确定要退出登录吗？',
        ok: '确定',
        cancel: '取消'
      })
      .then(() => {
        this.$store.dispatch('user/FedLogout')
        .then(() => {
          this.$router.push('/auth/login')
          this.notify('positive','已登出')
        })
      })
    },
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type,
        position: 'bottom-right'
      })
    },
    resetScroll(el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    }
  },
  mounted() {
  }
}
</script>

<style lang="stylus">
@import '~variables'
.force-color
  color $primary
</style>
