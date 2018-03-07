<template>
  <q-page class="flex">
    <div>
      <chart :options="polar"></chart>
    </div>
  </q-page>
</template>


<script>
export default {
  data: function () {
     return {
      polar: {
        title: {
          text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
          axisLabel: {show: true}
        },
        series: [{
          name: '销量',
          data: [5, 20, 36, 10, 10, 20],
          type: 'bar'
        }]
      }
    }
  }
}
</script>

<style lang="stylus">
  .echarts
    width: 1500px
</style>

