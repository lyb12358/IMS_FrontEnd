<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               dense
               round
               @click="leftDrawerOpen = !leftDrawerOpen">
          <q-icon name="menu" />
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

    <q-layout-drawer v-model="leftDrawerOpen"
                     content-class="bg-grey-2">
      <q-list no-border
              link
              inset-delimiter>
        <q-item @click.native="$router.push('/')">
          <q-item-main label="主页" />
        </q-item>
        <q-item @click.native="$router.push('productWorkBench')">
          <q-item-main label="产品管理" />
        </q-item>
        <q-list-header>Essential Links</q-list-header>
        <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs"
                       sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click.native="openURL('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum"
                       sublabel="forum.quasar-framework.org" />
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
      leftDrawerOpen: false
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>

</style>
