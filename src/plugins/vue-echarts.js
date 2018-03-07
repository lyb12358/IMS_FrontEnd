// import something here
import ECharts from 'vue-echarts/components/ECharts'
// import ECharts modules manually to reduce bundle size
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
// leave the export, even if you don't use it
export default ({ Vue }) => {
  // something to do
  Vue.component('chart', ECharts)
}
