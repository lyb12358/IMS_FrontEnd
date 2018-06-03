<template>
  <q-page padding
          class="card-examples row items-start">
    <q-card inline
            class="bigger q-ma-sm">
      <q-card-media>
      </q-card-media>
      <q-card-title class="relative-position">
        <q-btn color="primary"
               round
               icon="mdi-database"
               size="2.5rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">产品款式数量</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">10</p>
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
        <q-btn color="primary"
               round
               icon="mdi-database"
               size="2.5rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">产品编号数量</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">20</p>
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
        <q-btn color="primary"
               round
               icon="mdi-power-socket"
               size="2.5rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">内部系统接口使用次数</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">9999</p>
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
        <q-btn color="primary"
               round
               icon="mdi-power-socket"
               size="2.5rem"
               class="absolute"
               style="top: 0; right: 8px; transform: translateY(-20%);" />
        <div class="text-faded">外部系统接口调用次数</div>
      </q-card-title>
      <q-card-main style="margin-left:50px;">
        <p style="margin-left:50px;font-weight:500;font-size:4em;">9999</p>
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
export default {
  data() {
    return {}
  }
}
</script>

<style scoped lang="stylus">
.card-examples
  .q-card
    width 300px
  .bigger
    width 450px
    max-width 90vw
  @media (max-width: $breakpoint-xs-max)
    .q-card
      width 100%
</style>

