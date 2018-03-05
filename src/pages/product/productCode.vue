<template>
  <q-page padding>
    <!-- content -->
    <q-table ref="table"
             :data="serverData"
             :columns="columns"
             row-key="id"
             :visible-columns="visibleColumns"
             :separator="separator"
             :pagination.sync="serverPagination"
             :loading="loading"
             color="secondary"
             @request="request">
      <div slot="top-left"
           slot-scope="props"
           class="row">
        <q-input class="q-mt-ml q-mr-sm"
                 v-model="searchForm.style"
                 float-label="款号" />
        <q-input class="q-mt-ml q-mr-sm"
                 v-model="searchForm.code"
                 float-label="产品编号" />
        <q-input class="q-mt-ml q-mr-sm"
                 v-model="searchForm.name"
                 float-label="产品名称" />
        <q-btn icon="mdi-magnify"
               label="搜索"
               rounded
               color="secondary"
               @click="showInfo" />
      </div>
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
          { label: '水平框线', value: 'horizontal' },
          { label: '竖直框线', value: 'vertical' },
          { label: '网格框线', value: 'cell' },
          { label: '无框线', value: 'none' }
        ]"
                  hide-underline />
        <q-btn flat
               round
               dense
               :icon="props.inFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
               @click="props.toggleFullscreen">
          <q-tooltip>点下试试，可以全屏展现表格哦！</q-tooltip>
        </q-btn>
      </template>
      <div slot="pagination"
           slot-scope="props"
           class="row flex-center q-py-sm">
        <q-btn round
               dense
               size="sm"
               icon="mdi-undo"
               color="secondary"
               class="q-mr-sm"
               :disable="props.isFirstPage"
               @click="props.prevPage" />
        <div class="q-mr-sm"
             style="font-size: small">
          页 {{ props.pagination.page }} / {{ props.pagesNumber }}
        </div>
        <q-btn round
               dense
               size="sm"
               icon="mdi-redo"
               color="secondary"
               :disable="props.isLastPage"
               @click="props.nextPage" />
      </div>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        style: '',
        code: '',
        name: ''
      },
      loading: false,
      dark: true,
      selected: [],
      visibleColumns: [
        'prodStyle',
        'prodFamily',
        'prodClass',
        'prodMat',
        'prodCode',
        'prodName',
        'prodSize',
        'retailPrice'
      ],
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
        { name: 'prodCode', label: '产品编号', field: 'prodCode' },
        { name: 'prodName', label: '产品名称id', field: 'prodName' },
        { name: 'prodFamily', label: '产品所属', field: 'prodFamily' },
        { name: 'prodClass', label: '产品分类', field: 'prodClass' },
        { name: 'prodMat', label: '面料', field: 'prodMat' },
        { name: 'prodSize', label: '尺寸', field: 'prodSize' },
        { name: 'retailPrice', label: '零售价', field: 'retailPrice' }
      ]
    }
  },
  methods: {
    showInfo() {
      console.log(this.searchForm)
    },
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
