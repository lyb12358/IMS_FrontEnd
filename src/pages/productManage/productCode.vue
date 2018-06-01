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
               @click="chooseStyleDialogOpend=true">
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
              :props="props"
              style="text-align:center">
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
                :props="props"
                style="text-align:center">{{ props.row.id }}</q-td>
          <q-td key="departId"
                :props="props"
                style="text-align:center">{{ props.row.departId }}</q-td>
          <q-td key="comId"
                :props="props"
                style="text-align:center">{{ props.row.comId }}</q-td>
          <q-td key="prodStyle"
                :props="props"
                style="text-align:center">{{ props.row.prodStyle }}</q-td>
          <q-td key="prodCode"
                :props="props"
                style="text-align:center">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" /> {{ props.row.prodCode }}
          </q-td>
          <q-td key="prodName"
                :props="props"
                style="text-align:center">{{ props.row.prodName }}</q-td>
          <q-td key="prodFamily"
                :props="props"
                style="text-align:center">{{ props.row.familyLabel}}</q-td>
          <q-td key="prodClass"
                :props="props"
                style="text-align:center">{{ props.row.classLabel }}</q-td>
          <q-td key="prodProp"
                :props="props"
                style="text-align:center">{{ props.row.propLabel }}</q-td>
          <q-td key="prodLevel"
                :props="props"
                style="text-align:center">{{ props.row.levelLabel }}</q-td>
          <q-td key="prodMat"
                :props="props"
                style="text-align:center">{{ props.row.prodMat }}</q-td>
          <q-td key="prodSize"
                :props="props"
                style="text-align:center">{{ props.row.prodSize }}</q-td>
          <q-td key="prodCat"
                :props="props"
                style="text-align:center">{{ props.row.prodCat }}</q-td>
          <q-td key="weight"
                :props="props"
                style="text-align:center">{{ props.row.weight }}</q-td>
          <q-td key="retailPrice"
                :props="props"
                style="text-align:center">{{ props.row.retailPrice }}
          </q-td>
          <q-td key="supplyPrice"
                :props="props"
                style="text-align:center">{{ props.row.supplyPrice }}
          </q-td>
          <q-td key="costPrice"
                :props="props"
                style="text-align:center">{{ props.row.costPrice }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn icon="mdi-format-list-numbers"
                   rounded
                   color="primary"
                   @click="openMainCodeModal('update',props.row.id)">
              <q-tooltip>修改该编号产品信息</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-playlist-plus"
                   rounded
                   color="secondary"
                   @click="checkStyle(props.row.prodStyle)">
              <q-tooltip>增加同款式产品</q-tooltip>
            </q-btn>
            <a :href="api+'/image/'+props.row.styleId+'/'+props.row.image"
               :download="props.row.prodName">
              <q-btn icon="mdi-image-area-close"
                     v-if="props.row.thumbnail!=null"
                     rounded
                     color="tertiary">
                <q-tooltip>下载原图</q-tooltip>
              </q-btn>
            </a>
            <q-btn icon="mdi-clipboard-arrow-down"
                   rounded
                   color="orange"
                   @click="downloadSpec(props.row.styleId,props.row.prodName )">
              <q-tooltip>下载产品说明书</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="deleteProdCode()">
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
    <!-- choose style -->
    <q-dialog v-model="chooseStyleDialogOpend"
              prevent-close>
      <span slot="title">请输入产品所属款式</span>
      <div slot="body">
        <q-input v-model.trim="styleChoosed"
                 float-label="产品款式"
                 @keyup.enter="checkStyle(styleChoosed)" />
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn color="primary"
               @click="checkStyle(styleChoosed)"
               label="确定" />
        <q-btn color="primary"
               @click="chooseStyleDialogOpend = false"
               label="取消" />
      </template>
    </q-dialog>
    <!-- main modal -->
    <q-modal v-model="mainCodeModalOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header">
          <q-btn flat
                 round
                 dense
                 v-close-overlay
                 icon="mdi-arrow-left" />
          <q-toolbar-title>
            {{modalActionName}}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div v-if="modalActionName==='修改产品信息'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     label="确定"
                     @click="modifyProdCode" />
            </div>
            <div v-if="modalActionName==='新增产品信息'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     label="确定"
                     @click="newProdCode" />
            </div>
            <div v-if="modalActionName==='新增产品信息'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     label="重置"
                     @click="resetCodeModal" />
            </div>
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row">
            <div class="col-md-12">
              <q-collapsible :label="productStyle.styleName"
                             sublabel="点击可展开该款式详细内容">
                <q-card>
                  <q-card-main>
                    <table class="q-table">
                      <tbody>
                        <tr>
                          <td class="text-right">款号：</td>
                          <td class="text-left">{{productStyle.prodStyle}}</td>
                          <td class="text-right">款名：</td>
                          <td class="text-left">{{productStyle.styleName}}</td>
                          <td class="text-right">部门：</td>
                          <td class="text-left">{{productStyle.departLabel}}</td>
                        </tr>
                        <tr>
                          <td class="text-right">属性：</td>
                          <td class="text-left">{{productStyle.propLabel}}</td>
                          <td class="text-right">所属：</td>
                          <td class="text-left">{{productStyle.familyLabel}}</td>
                          <td class="text-right">类别：</td>
                          <td class="text-left">{{productStyle.classLabel}}</td>
                        </tr>
                        <tr>
                          <td class="text-right">面料：</td>
                          <td class="text-left">{{productStyle.prodMat}}</td>
                          <td class="text-right">档次：</td>
                          <td class="text-left">{{productStyle.levelLabel}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </q-card-main>
                </q-card>
              </q-collapsible>
            </div>
          </div>
          <div class="row gutter-sm">
            <div class="col-xs-12  col-sm-6 col-md-4">
              <q-input v-model="product.prodCode"
                       class="no-margin"
                       float-label="编号" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.prodName"
                       class="no-margin"
                       float-label="名称" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.prodSize"
                       class="no-margin"
                       float-label="规格" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.prodCat"
                       class="no-margin"
                       float-label="品类" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.weight"
                       class="no-margin"
                       float-label="克重" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.retailPrice"
                       class="no-margin"
                       float-label="零售价" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.supplyPrice"
                       class="no-margin"
                       float-label="供应价" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-input v-model="product.costPrice"
                       class="no-margin"
                       float-label="成本价" />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>

</template>

<script>
import { getOrgList } from 'src/api/organization'
import {
  getProdList,
  getProdById,
  addProdCode,
  updateProdCode,
  getProdStyleByAny,
  checkProdStyle,
  specDownload
} from 'src/api/product'

export default {
  data() {
    return {
      api: process.env.API,
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
        rowsPerPage: 10,
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
      //choose style dialog
      chooseStyleDialogOpend: false,
      styleChoosed: '',
      //modal
      mainCodeModalOpened: false,
      modalActionName: '',
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
        familyLabel: '',
        prodProp: '',
        propLabel: '',
        prodLevel: '',
        levelLabel: '',
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
      console.log('hi')
    },
    printSth() {
      window.print()
    },
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type,
        position: 'top-right'
      })
    },
    //choose style
    checkStyle(styleChoosed) {
      checkProdStyle(styleChoosed).then(response => {
        let productStyle = response.data.data
        this.chooseStyleDialogOpend = false
        Object.assign(this.productStyle, productStyle)
        // this.$nextTick(() => {
        // })
        this.openMainCodeModal('add')
      })
    },
    //main modal function
    openMainCodeModal(action, id) {
      if (action === 'add') {
        this.modalActionName = '新增产品信息'
        this.product.departId = this.productStyle.departId
        this.product.prodStyle = this.productStyle.prodStyle
        this.product.prodName = this.productStyle.styleName
        this.mainCodeModalOpened = true
      } else if (action === 'update') {
        this.modalActionName = '修改产品信息'
        getProdById(id).then(response => {
          let product = response.data.data
          if (product.status == 1) {
            product.status = true
          } else {
            product.status = false
          }
          Object.assign(this.productStyle, product)
          Object.assign(this.product, product)
          this.$nextTick(() => {
            this.mainCodeModalOpened = true
          })
        })
      }
    },
    newProdCode() {
      addProdCode(this.product).then(response => {
        let data = response.data
        this.mainCodeModalOpened = false
        Object.assign(this.product, this.$options.data.call(this).product)
        Object.assign(
          this.productStyle,
          this.$options.data.call(this).productStyle
        )
        this.notify('positive', data.msg)
        this.request({
          pagination: this.serverPagination
        })
      })
    },
    modifyProdCode() {
      updateProdCode(this.product).then(response => {
        let data = response.data
        this.mainCodeModalOpened = false
        Object.assign(this.product, this.$options.data.call(this).product)
        Object.assign(
          this.productStyle,
          this.$options.data.call(this).productStyle
        )
        this.notify('positive', data.msg)
        this.request({
          pagination: this.serverPagination
        })
      })
    },
    resetCodeModal() {
      Object.assign(this.product, this.$options.data.call(this).product)
    },
    //download specification
    downloadSpec(id, name) {
      specDownload(id).then(response => {
        this.fileDownload(response.data, name)
      })
    },
    // public method to download file
    fileDownload(data, name) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name + '产品说明书.pdf')
      document.body.appendChild(link)
      link.click()
      // release url object
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    },
    // delete prodCode
    deleteProdCode() {
      this.notify(
        'warning',
        '老实说我还没确定好是逻辑删除还是物理删除，所以Beta版本暂不提供删除功能'
      )
    },
    request({ pagination }) {
      this.loading = true
      let page = pagination.page
      let row = pagination.rowsPerPage
      getProdList(page, row)
        .then(response => {
          let data = response.data.data
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
  padding 7px 7px
@media (min-width: 1200px)
  .layout-padding
    padding 1.5rem 1.5rem
</style>
