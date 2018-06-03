<template>
  <q-page padding
          class="card-examples row items-start">
    <transition-group enter-active-class="animated bounceInRight"
                      leave-active-class="animated bounceOutRight"
                      appear>
      <q-card v-for="product in products"
              :key="product.id"
              inline
              class="bigger q-ma-sm">
        <q-card-media style="height:200px">
          <img :src="api + '/image/' + product.id + '/' + product.thumbnail">
        </q-card-media>
        <q-card-title class="relative-position">
          <div>{{product.styleName}}</div>
        </q-card-title>
        <q-card-separator />
        <q-card-actions align="end">
          <q-btn color="primary"
                 class="q-mr-md">分享</q-btn>
          <a :href="api+'/image/'+product.id+'/'+product.image"
             :download="product.styleName">
            <q-btn color="primary">下载图片</q-btn>
          </a>
        </q-card-actions>
      </q-card>
    </transition-group>
  </q-page>
</template>

<script>
import { getProdStyleList } from 'src/api/product'
export default {
  data() {
    return {
      api: process.env.API,
      searchForm: {
        page: 1,
        row: 20,
        prodStyle: '',
        styleName: ''
      },
      products: []
    }
  },
  created() {
    getProdStyleList(this.searchForm)
      .then(response => {
        let data = response.data.data
        this.products = data.rows
      })
      .catch(error => {})
  }
}
</script>

<style scoped lang="stylus">
.card-examples
  .q-card
    width 300px
  .bigger
    width 350px
    max-width 90vw
  @media (max-width: $breakpoint-xs-max)
    .q-card
      width 100%
</style>
