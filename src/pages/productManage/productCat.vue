<template>
  <q-page padding
          class="page-cat">
    <div class="row justify-center ">
      <div style="width: 850px; max-width: 90vw;"
           class="row">
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品类别</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品属性</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品品类</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品规格</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品年份</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品季节</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="mdi-palette" />
            <p class="caption">产品花色</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="mdi-triangle" />
            <p class="caption">产品档次</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="mdi-face" />
            <p class="caption">产品设计师</p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      category: false
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="stylus">
@import '~variables'
.page-cat
  .card
    cursor pointer
    position relative
    padding 16px
    .q-icon
      font-size 60px
    p
      color rgba(0, 0, 0, 0.87)
      margin 15px 0 0 0 !important
    &:before
      content ''
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      border-radius 2px
      opacity 0
      transition opacity 0.2s
      background currentColor
    &:hover:before
      opacity 0.4
</style>
