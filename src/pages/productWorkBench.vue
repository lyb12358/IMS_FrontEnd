<template>
  <q-page padding>
    <!-- content -->
    <q-table ref="table"
             :data="serverData"
             :columns="columns"
             row-key="id"
             selection="multiple"
             :selected.sync="selected"
             :visible-columns="visibleColumns"
             :separator="separator"
             :pagination.sync="serverPagination"
             :loading="loading"
             color="secondary"
             @request="request">
      <template slot="top-right"
                slot-scope="props">
        <q-table-columns color="secondary"
                         class="q-mr-sm"
                         label="可以看见的列"
                         v-model="visibleColumns"
                         :columns="columns" />
        <q-select color="secondary"
                  v-model="separator"
                  :options="[
          { label: '水平', value: 'horizontal' },
          { label: '竖直', value: 'vertical' },
          { label: '网格', value: 'cell' },
          { label: '无', value: 'none' }
        ]"
                  hide-underline />
        <q-btn flat
               round
               dense
               :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
               @click="props.toggleFullscreen" />
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      selected: [],
      visibleColumns: ['departId','comId','prodStyle','prodFamily','prodClass','prodMat','prodCode','prodName','prodSize','retailPrice'],
      separator: 'horizontal',
      serverPagination: {
        page: 1,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        { name: 'id', label: 'id', field: 'id' },
        { name: 'departId', label: '所属部门', field: 'departId' },
        { name: 'comId', label: '所属公司', field: 'comId' },
        { name: 'prodStyle', label: '款号', field: 'prodStyle' },
        { name: 'prodFamily', label: '产品所属', field: 'prodFamily' },
        { name: 'prodClass', label: '产品分类', field: 'prodClass' },
        { name: 'prodMat', label: '面料', field: 'prodMat' },
        { name: 'prodCode', label: '产品编号', field: 'prodCode' },
        { name: 'prodName', label: '产品名称id', field: 'prodName' },
        { name: 'prodSize', label: '尺寸', field: 'prodSize' },
        { name: 'retailPrice', label: '零售价', field: 'retailPrice' }
      ]
    }
  },
  methods: {
    request({ pagination }) {
      // we set QTable to "loading" state
      this.loading = true

      // we do the server data fetch, based on pagination and filter received
      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      this.$axios
        .get('/api/getProdList')
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.serverPagination = pagination

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = 20

          // then we update the rows with the fetched ones
          this.serverData = data.data

          // finally we tell QTable to exit the "loading" state
          this.loading = false
        })
        .catch(error => {
          // there's an error... do SOMETHING

          // we tell QTable to exit the "loading" state
          this.loading = false
        })
    }
  },
  mounted() {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination
    })
  }
}
</script>

<style>

</style>
