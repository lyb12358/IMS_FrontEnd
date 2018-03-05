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

      <q-list no-border
              link
              inset-delimiter
              style="padding:0">
        <q-card class="no-shadow">
          <q-item>
            <q-item-side avatar="/assets/personal_logo.jpg" />
            <q-item-main >
              <q-item-tile label>罗亚冰</q-item-tile>
              <q-item-tile sublabel>信息中心</q-item-tile>
            </q-item-main>
            <!-- <q-item-main>
              <q-item-tile label>角色：管理员</q-item-tile>
            </q-item-main> -->
            <q-btn flat color="primary" icon="mdi-logout" @click="excuse('用户')" />
            <!-- <q-item-side icon="mdi-logout"
                       color="primary" /> -->
          </q-item>
        </q-card>
        <q-item @click.native="$router.push('/')">
          <q-item-side icon="mdi-home"
                       color="primary" />
          <q-item-main label="主页"
                       color="primary" />
        </q-item>
        <q-item @click.native="$router.push('productWorkBench')">
          <q-item-side icon="mdi-layers"
                       color="primary" />
          <q-item-main label="产品管理"
                       color="primary" />
        </q-item>
        <q-item-separator />
        <q-list-header>外部链接</q-list-header>
        <q-item @click.native="openURL('http://hao.china-beyond.com/')">
          <q-item-side icon="mdi-navigation"
                       color="primary" />
          <q-item-main label="导航"
                       color="primary" />
        </q-item>
        <q-item @click.native="openURL('http://beyond-oa.com/')">
          <q-item-side icon="mdi-briefcase"
                       color="primary" />
          <q-item-main label="OA"
                       color="primary" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data() {
    return {
      leftDrawerOpen: true
    }
  },
  methods: {
    openURL,
    excuse(x){
      this.$q.notify({
        message:x+'功能尚在施工中,别点了~~~',
        type:'warning',
        icon:'mdi-emoticon-cool',
        position:'bottom-right',
        avatar: 'assets/xiuxian.jpg'
      })
    }
  }
}
</script>

<style>

</style>
