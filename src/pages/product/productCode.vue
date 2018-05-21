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
             :rows-per-page-options="[10,15,20]"
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
               @click="openMainModal()">
          <q-tooltip>新建</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-file-excel"
               rounded
               class="q-ma-xs"
               color="tertiary"
               @click="showExpand()">
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
                :props="props">{{ props.row.familyLabel}}</q-td>
          <q-td key="prodClass"
                :props="props">{{ props.row.classLabel }}</q-td>
          <q-td key="prodProp"
                :props="props">{{ props.row.propLabel }}</q-td>
          <q-td key="prodLevel"
                :props="props">{{ props.row.levelLabel }}</q-td>
          <q-td key="prodMat"
                :props="props">{{ props.row.prodMat }}</q-td>
          <q-td key="prodSize"
                :props="props">{{ props.row.prodSize }}</q-td>
          <q-td key="prodCat"
                :props="props">{{ props.row.prodCat }}</q-td>
          <q-td key="weight"
                :props="props">{{ props.row.weight }}</q-td>
          <q-td key="retailPrice"
                :props="props">{{ props.row.retailPrice }}
          </q-td>
          <q-td key="supplyPrice"
                :props="props">{{ props.row.supplyPrice }}
          </q-td>
          <q-td key="costPrice"
                :props="props">{{ props.row.costPrice }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn icon="mdi-format-list-numbers"
                   rounded
                   color="primary"
                   @click="showExpand()">
              <q-tooltip>修改产品信息</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-playlist-plus"
                   rounded
                   color="secondary"
                   @click="showExpand()">
              <q-tooltip>增加同款产品</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-image"
                   rounded
                   color="tertiary"
                   @click="showExpand()">
              <q-tooltip>查看产品图片</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="showExpand()">
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
    <q-modal v-model="openMainModal"
             no-backdrop-dismiss
             no-esc-dismiss>

    </q-modal>
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
        rowsNumber: 10 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        { name: 'id', align: 'left', label: 'id', field: 'id' },
        {
          name: 'departId',
          align: 'left',
          label: '所属部门',
          field: 'departId'
        },
        { name: 'comId', align: 'left', label: '所属公司', field: 'comId' },
        { name: 'prodStyle', align: 'left', label: '款号', field: 'prodStyle' },
        {
          name: 'prodCode',
          align: 'left',
          label: '产品编号',
          field: 'prodCode'
        },
        {
          name: 'prodName',
          align: 'left',
          label: '产品名称',
          field: 'prodName'
        },
        {
          name: 'prodFamily',
          align: 'left',
          label: '产品所属',
          field: 'prodFamily'
        },
        {
          name: 'prodClass',
          align: 'left',
          label: '产品分类',
          field: 'prodClass'
        },
        {
          name: 'prodProp',
          align: 'left',
          label: '产品属性',
          field: 'prodProp'
        },
        {
          name: 'prodLevel',
          align: 'left',
          label: '产品档次',
          field: 'prodLevel'
        },
        { name: 'prodMat', align: 'left', label: '面料', field: 'prodMat' },
        { name: 'prodSize', align: 'left', label: '规格', field: 'prodSize' },
        { name: 'prodCat', align: 'left', label: '品类', field: 'prodSize' },
        { name: 'weight', align: 'left', label: '克重', field: 'prodSize' },
        {
          name: 'retailPrice',
          align: 'left',
          label: '零售价',
          field: 'retailPrice'
        },
        {
          name: 'supplyPrice',
          align: 'left',
          label: '供应价',
          field: 'supplyPrice'
        },
        {
          name: 'costPrice',
          align: 'left',
          label: '成本价',
          field: 'costPrice'
        },
        { name: 'status', align: 'left', label: '状态', field: 'status' }
      ],
      //modal content
      productStyle: {
        id: 0,
        departLabel: '',
        departId: '',
        classLabel: '',
        prodClass: '',
        prodMat: '',
        styleName: '',
        prodStyle: '',
        prodFamily: '',
        prodProp: '',
        prodLevel: '',
        prodDesc: '',
        status: true
      },
      product: {
        id: 0,
        prodCode: '',
        prodName: '',
        prodSize: '',
        prodCat: '',
        retailPrice: 0,
        supplyPrice: 0,
        costPrice: 0,
        weight: 0,
        departLabel: '',
        departId: '',
        classLabel: '',
        prodClass: '',
        prodMat: '',
        prodStyle: '',
        prodFamily: '',
        prodProp: '',
        prodLevel: '',
        prodDesc: '',
        status: true
      }
    }
  },
  methods: {
    showExpand() {
      console.log(this.$q.platform.is.MicroMessenger)
    },
    printSth() {
      window.print()
    },
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type,
        position: 'bottom-right'
      })
    },
    //main modal function
    openMainModal(action, id) {},
    request({ pagination }) {
      this.loading = true
      this.$axios
        .get('/prods', {
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

<style lang="stylus" scoped>
.q-table th
  font-size 13px
.q-table tbody td
  font-size 15px
@media (min-width: 1200px)
  .layout-padding
    padding 1.5rem 1.5rem
</style>
