<template>
  <q-page padding>
    <q-table ref="table"
             :data="serverData"
             :columns="columns"
             row-key="id"
             :visible-columns="visibleColumns"
             :separator="separator"
             :pagination.sync="serverPagination"
             :loading="loading"
             color="secondary"
             :rows-per-page-options="[5,10,15,20]"
             @request="request">
      <div slot="top-left"
           slot-scope="props"
           class="row print-hide">
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
               rounded
               class="q-ma-xs"
               color="secondary">
          <q-tooltip>搜索</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-new-box"
               rounded
               class="q-ma-xs"
               color="primary"
               @click="newOpened=true">
          <q-tooltip>新建</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-file-excel"
               rounded
               class="q-ma-xs"
               color="tertiary"
               @click="showInfo">
          <q-tooltip>导出</q-tooltip>
        </q-btn>
      </div>
      <template slot="top-right"
                slot-scope="props"
                class="print-hide">
        <q-table-columns color="secondary"
                         class="q-mr-sm print-hide"
                         label="筛选列"
                         v-model="visibleColumns"
                         :columns="columns" />
        <q-select color="secondary"
                  class="print-hide"
                  v-model="separator"
                  :options="[
          { label: '水平框线', value: 'horizontal' },
          { label: '竖直框线', value: 'vertical' },
          { label: '网格框线', value: 'cell' },
          { label: '无框线', value: 'none' }
        ]"
                  hide-underline />
        <q-btn flat
               rounded
               class="print-hide"
               :icon="props.inFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
               @click="props.toggleFullscreen">
          <q-tooltip>全屏</q-tooltip>
        </q-btn>
        <q-btn flat
               rounded
               class="print-hide"
               v-if="props.inFullscreen"
               icon="mdi-printer"
               @click="printSth">
          <q-tooltip>打印</q-tooltip>
        </q-btn>
      </template>
      <q-tr slot="header"
            slot-scope="props">
        <!-- <q-th auto-width>
          <q-checkbox v-if="props.multipleSelect"
                      v-model="props.selected"
                      indeterminate-value="some" />
        </q-th> -->
        <q-th v-for="col in props.cols"
              :key="col.name"
              :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
      <template slot="body"
                slot-scope="props">
        <q-tr :props="props">
          <!-- <q-td auto-width>
            <q-checkbox color="secondary"
                        v-model="props.selected" />
          </q-td> -->
          <q-td key="id"
                :props="props">{{ props.row.id }}</q-td>
          <q-td key="departId"
                :props="props">{{ props.row.departId }}</q-td>
          <q-td key="comId"
                :props="props">{{ props.row.comId }}</q-td>
          <q-td key="prodStyle"
                :props="props">{{ props.row.prodStyle }}</q-td>
          <q-td key="prodCode"
                :props="props">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" /> {{ props.row.prodCode }}
          </q-td>
          <q-td key="prodName"
                :props="props">{{ props.row.prodName }}</q-td>
          <q-td key="prodFamily"
                :props="props">{{ props.row.prodFamily }}</q-td>
          <q-td key="prodClass"
                :props="props">{{ props.row.prodClass }}</q-td>
          <q-td key="prodMat"
                :props="props">{{ props.row.prodMat }}</q-td>
          <q-td key="prodSize"
                :props="props">{{ props.row.prodSize }}</q-td>
          <q-td key="retailPrice"
                :props="props">{{ props.row.retailPrice }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn icon="mdi-format-list-numbers"
                   rounded
                   color="primary"
                   @click="showExpand(props)">
              <q-tooltip>款式信息</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-image"
                   rounded
                   color="tertiary"
                   @click="showExpand(props)">
              <q-tooltip>查看产品图片</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-playlist-plus"
                   rounded
                   color="secondary"
                   @click="showExpand(props)">
              <q-tooltip>增加同款产品</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="showExpand(props)">
              <q-tooltip>删除</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <div slot="pagination"
           slot-scope="props"
           class="row flex-center q-py-sm print-hide">
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
    <q-modal v-model="newOpened"
             no-backdrop-dismiss
             no-esc-dismiss>
      <div class=" row justify-center items-center ">
        <q-card class="no-shadow">
          <q-card-title>Login</q-card-title>
          <q-card-main>
            <form id='myForm'
                  class='gutter-sm'>
              <q-field>
                <q-input v-model="user.name"
                         float-label="E-Mail"
                         required></q-input>
              </q-field>
              <q-field>
                <q-input v-model="user.password"
                         float-label="Password"
                         required></q-input>
              </q-field>
            </form>
          </q-card-main>
          <q-card-separator/>
          <q-card-actions>
            <q-btn rounded
                   @click="resetForm">重置</q-btn>
            <q-btn @click="save">保存</q-btn>
            <q-btn @click="newOpened = false">关闭</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-modal>
  </q-page>

</template>

<script>
export default {
  data() {
    return {
      newOpened: false,
      user: {
        password: '',
        name: ''
      },
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
        rowsPerPage: 5,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        { name: 'id', label: 'id', field: 'id' },
        { name: 'departId', label: '所属部门', field: 'departId' },
        { name: 'comId', label: '所属公司', field: 'comId' },
        { name: 'prodStyle', label: '款号', field: 'prodStyle' },
        { name: 'prodCode', label: '产品编号', field: 'prodCode' },
        { name: 'prodName', label: '产品名称', field: 'prodName' },
        { name: 'prodFamily', label: '产品所属', field: 'prodFamily' },
        { name: 'prodClass', label: '产品分类', field: 'prodClass' },
        { name: 'prodMat', label: '面料', field: 'prodMat' },
        { name: 'prodSize', label: '尺寸', field: 'prodSize' },
        { name: 'retailPrice', label: '零售价', field: 'retailPrice' }
      ]
    }
  },
  methods: {
    save() {
      console.log(this.user)
    },
    resetForm() {
      document.getElementById('myForm').reset()
    },
    showExpand(x) {
      console.log(x)
    },
    showInfo() {
      console.log(this.searchForm)
    },
    printSth() {
      window.print()
    },
    request({ pagination }) {
      this.loading = true
      this.$axios
        .get('/api/prods', {
          params: {
            page: pagination.page,
            row: pagination.rowsPerPage
          }
        })
        .then(({ data }) => {
          this.serverPagination = pagination
          this.serverPagination.rowsNumber = data.total
          this.serverData = data.rows
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.request({
      pagination: this.serverPagination
    })
  }
}
</script>

<style lang="stylus">
</style>
