<template>
  <q-page padding
          class="card-examples row justify-center">
    <q-card inline
            class="bigger q-ma-sm">
      <q-card-media>
      </q-card-media>
      <q-card-title class="relative-position">
        <q-btn :color="brandColor"
               @click="$router.push('productStyle')"
               round
               icon="mdi-database"
               size="2rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">商品款式数量</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">{{styleNum}}</p>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat
               label="刷新"
               icon="refresh" />
      </q-card-actions>
    </q-card>
    <q-card inline
            class="bigger q-ma-sm">
      <q-card-media>
      </q-card-media>
      <q-card-title class="relative-position">
        <q-btn :color="brandColor"
               @click="$router.push('productCode')"
               round
               icon="mdi-database"
               size="2rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">商品编号数量</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">
          {{codeNum}}
        </p>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat
               label="刷新"
               icon="refresh" />
      </q-card-actions>
    </q-card>
    <q-card inline
            class="bigger q-ma-sm">
      <q-card-media>
      </q-card-media>
      <q-card-title class="relative-position">
        <q-btn :color="brandColor"
               @click="$router.push('material')"
               round
               icon="mdi-database"
               size="2rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">物料辅料数量</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">{{matNum}}</p>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat
               label="刷新"
               icon="refresh" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>


<script>
import { codeCount, styleCount } from 'src/api/product'
import { matCount } from 'src/api/material'
export default {
  data() {
    return {
      codeNum: '',
      styleNum: '',
      matNum: ''
    }
  },
  computed: {
    brandColor() {
      return this.$store.getters['user/brandColor']
    }
  },
  method: {
    onBackKeyDown() {
      this.$q
        .dialog({
          title: '警告',
          message: '确定要退出吗',
          ok: '确定',
          cancel: '我点错了'
        })
        .then(() => {
          navigator.app.exitApp()
        })
        .catch(() => {})
    }
  },
  created() {
    document.addEventListener('backbutton', this.onBackKeyDown, false)
  },
  mounted() {
    codeCount()
      .then(response => {
        this.codeNum = response.data.data
      })
      .catch(error => {})
    styleCount()
      .then(response => {
        this.styleNum = response.data.data
      })
      .catch(error => {})
    matCount()
      .then(response => {
        this.matNum = response.data.data
      })
      .catch(error => {})
  },
  beforeDestroy() {
    //remove the event listener
    document.removeEventListener('backbutton', this.onBackKeyDown, false)
  }
}
</script>

<style scoped lang="stylus">
.card-examples
  .bigger
    width 400px
    max-height 220px
    max-width 90vw
  @media (max-width: $breakpoint-xs-max)
    .q-card
      width 100%
</style>

