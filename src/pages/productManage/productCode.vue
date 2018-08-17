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
                 v-model="searchForm.prodCode"
                 float-label="产品编号" />
        <q-input class="q-mt-ml q-mr-sm"
                 v-model="searchForm.prodName"
                 float-label="产品名称" />
        <q-btn icon="mdi-eraser"
               rounded
               class="q-ma-xs"
               color="dark"
               @click="resetSearchForm()">
          <q-tooltip>重置</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-magnify"
               rounded
               class="q-ma-xs"
               color="secondary"
               @click="search()">
          <q-tooltip>搜索</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-new-box"
               v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductCode') > -1"
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
               @click="downloadExcel()">
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
          <q-td key="prodStyle"
                :props="props"
                style="text-align:center">{{ props.row.prodStyle }}</q-td>
          <q-td key="prodFamily"
                :props="props"
                style="text-align:center">{{ props.row.familyName }}</q-td>
          <q-td key="prodType"
                :props="props"
                style="text-align:center">{{ props.row.typeName }}</q-td>
          <q-td key="bigType"
                :props="props"
                style="text-align:center">{{ props.row.bigName }}</q-td>
          <q-td key="middleType"
                :props="props"
                style="text-align:center">{{ props.row.middleName }}</q-td>
          <q-td key="smallType"
                :props="props"
                style="text-align:center">{{ props.row.smallName }}</q-td>
          <q-td key="prodAttr"
                :props="props"
                style="text-align:center">{{ props.row.attrName}}</q-td>
          <q-td key="prodCat"
                :props="props"
                style="text-align:center">{{ props.row.prodCat }}</q-td>
          <q-td key="prodSpe"
                :props="props"
                style="text-align:center">{{ props.row.prodSpe }}</q-td>
          <q-td key="retailPrice"
                :props="props"
                style="text-align:center">{{ props.row.retailPrice}}
          </q-td>
          <q-td key="supplyPrice"
                :props="props"
                style="text-align:center">{{ props.row.supplyPrice }}
          </q-td>
          <q-td key="costPrice"
                :props="props"
                style="text-align:center">{{ props.row.costPrice }}
          </q-td>
          <q-td key="codeIsSync"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.codeIsSync?'mdi-check-circle':'mdi-sync-off'"
                    size="1.5rem"
                    :color="props.row.codeIsSync?'positive':'negative'" /></q-td>
          <q-td key="gmtCreate"
                :props="props"
                style="text-align:center">{{ formatDate(props.row.gmtCreate) }}</q-td>
          <q-td key="gmtModified"
                :props="props"
                style="text-align:center">{{ formatDate(props.row.gmtModified) }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductCode') > -1"
                   icon="mdi-format-list-numbers"
                   rounded
                   color="primary"
                   @click="openMainCodeModal('update',props.row.id,props.row.departId)">
              <q-tooltip>修改该编号产品信息</q-tooltip>
            </q-btn>
            <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductCode') > -1"
                   icon="mdi-playlist-plus"
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
            <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductCode') > -1"
                   icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="deleteProdCode(props.row.id)">
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
              <q-collapsible>
                <template slot="header">
                  <q-item-side :image="thumbnailCheck(product.styleId, productStyle.thumbnail)"
                               color="primary" />
                  <q-item-main :label="productStyle.styleName"
                               sublabel="点击可展开该款式详细内容" />
                </template>
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
              <q-field :error="$v.product.prodCode.$error"
                       error-label="编号必填，且不超过20位">
                <q-input v-model="product.prodCode"
                         :readonly="modalActionName==='修改产品信息'?true:false"
                         class="no-margin"
                         float-label="编号" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.prodName.$error"
                       error-label="名称必填，且不超过15位">
                <q-input v-model="product.prodName"
                         class="no-margin"
                         float-label="名称" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.prodSize.$error"
                       error-label="不超过20位">
                <q-input v-model="product.prodSize"
                         class="no-margin"
                         float-label="规格" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.prodCat.$error"
                       error-label="不超过20位">
                <q-input v-model="product.prodCat"
                         class="no-margin"
                         float-label="品类" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.weight.$error"
                       error-label="请填写有效值">
                <q-input v-model="product.weight"
                         class="no-margin"
                         float-label="克重" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.retailPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="product.retailPrice"
                         class="no-margin"
                         float-label="零售价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.supplyPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="product.supplyPrice"
                         class="no-margin"
                         float-label="供应价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-field :error="$v.product.costPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="product.costPrice"
                         class="no-margin"
                         float-label="成本价" />
              </q-field>
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>

</template>

<script>
import { filter } from 'quasar'
import { date } from 'quasar'
import {
  minLength,
  maxLength,
  minValue,
  maxValue,
  numeric,
  integer,
  decimal,
  required
} from 'vuelidate/lib/validators'
import { getOrgList } from 'src/api/organization'
import {
  getProdList,
  getProdById,
  addProdCode,
  updateProdCode,
  getProdStyleByAny,
  checkProdStyle
} from 'src/api/product'
import { excelDownload, specDownload } from 'src/api/productPlus'

export default {
  data() {
    return {
      api: process.env.API,
      searchForm: {
        page: 0,
        row: 0,
        prodCode: '',
        prodName: ''
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
        { name: 'prodCode', label: '产品编号', field: 'prodCode' },
        { name: 'prodName', label: '产品名称', field: 'prodCode' },
        { name: 'prodStyle', label: '款号', field: 'prodStyle' },
        { name: 'prodFamily', label: '产品归属', field: 'prodFamily' },
        { name: 'prodType', label: '产品类别', field: 'prodType' },
        { name: 'bigType', label: '大类', field: 'bigType' },
        { name: 'middleType', label: '中类', field: 'middleType' },
        { name: 'smallType', label: '小类', field: 'smallType' },
        { name: 'prodAttr', label: '属性', field: 'prodAttr' },
        { name: 'prodCat', label: '品类', field: 'prodCat' },
        { name: 'prodSpe', label: '规格', field: 'prodSpe' },
        { name: 'retailPrice', label: '零售价', field: 'retailPrice' },
        { name: 'supplyPrice', label: '供应价', field: 'supplyPrice' },
        { name: 'costPrice', label: '成本价', field: 'costPrice' },
        { name: 'codeIsSync', label: '是否同步', field: 'codeIsSync' },
        { name: 'gmtCreate', label: '创建时间', field: 'gmtCreate' },
        { name: 'gmtModified', label: '修改时间', field: 'gmtModified' }
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
        status: true,
        thumbnail: ''
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
        status: true,
        styleId: ''
      },
      stockData: [
        {
          Symbol: 'AAPL',
          Company: 'Apple Inc.',
          Price: '132.54'
        },
        {
          Symbol: 'INTC',
          Company: 'Intel Corporation',
          Price: '33.45'
        },
        {
          Symbol: 'GOOG',
          Company: 'Google Inc',
          Price: '554.52'
        }
      ]
    }
  },
  validations: {
    product: {
      prodCode: { required, maxLength: maxLength(20) },
      prodName: { required, maxLength: maxLength(15) },
      prodSize: { maxLength: maxLength(20) },
      prodCat: { maxLength: maxLength(20) },
      weight: { decimal, minValue: minValue(0), maxValue: maxValue(999999) },
      retailPrice: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      supplyPrice: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      costPrice: { decimal, minValue: minValue(0), maxValue: maxValue(999999) }
    }
  },
  computed: {
    myPermissions() {
      return this.$store.getters['user/permissions']
    },
    myDepart() {
      return this.$store.getters['user/userInfo'].departId
    }
  },
  methods: {
    formatDate(timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    resetSearchForm() {
      Object.assign(this.searchForm, this.$options.data.call(this).searchForm)
      this.$nextTick(() => {
        this.search()
      })
    },
    search() {
      this.serverPagination.page = 1
      this.request({
        pagination: this.serverPagination
      })
    },
    printSth() {
      window.print()
    },
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type
      })
    },
    //choose style
    checkStyle(styleChoosed) {
      checkProdStyle(styleChoosed).then(response => {
        Object.assign(this.product, this.$options.data.call(this).product)
        Object.assign(
          this.productStyle,
          this.$options.data.call(this).productStyle
        )
        let productStyle = response.data.data
        let departId = productStyle.departId
        if (
          departId != this.myDepart &&
          this.myPermissions.indexOf('superAdmin') < 0
        ) {
          this.notify('warning', '无权维护非本部门产品')
          return
        }
        this.chooseStyleDialogOpend = false
        Object.assign(this.productStyle, productStyle)
        // this.$nextTick(() => {
        // })
        this.openMainCodeModal('add')
      })
    },
    //check thumbnail
    thumbnailCheck(id, thumbnail) {
      if (!(thumbnail === null)) {
        return this.api + '/image/' + id + '/' + thumbnail
      } else {
        return 'statics/sad.svg'
      }
    },
    //main modal function
    openMainCodeModal(action, id, departId) {
      this.$v.product.$reset()
      if (action === 'add') {
        this.modalActionName = '新增产品信息'
        this.product.styleId = this.productStyle.id
        this.product.departId = this.productStyle.departId
        this.product.prodStyle = this.productStyle.prodStyle
        this.product.prodName = this.productStyle.styleName
        this.mainCodeModalOpened = true
      } else if (action === 'update') {
        if (
          departId != this.myDepart &&
          this.myPermissions.indexOf('superAdmin') < 0
        ) {
          this.notify('warning', '无权维护非本部门产品')
          return
        }
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
            this.product.weight = this.product.weight / 100
            this.product.retailPrice = this.product.retailPrice / 100
            this.product.supplyPrice = this.product.supplyPrice / 100
            this.product.costPrice = this.product.costPrice / 100
            this.mainCodeModalOpened = true
          })
        })
      }
    },
    newProdCode() {
      this.$v.product.$touch()
      if (this.$v.product.$invalid) {
        return
      }
      this.$v.product.$reset()
      this.mainCodeModalOpened = false
      this.product.weight = parseInt(this.product.weight * 100)
      this.product.retailPrice = parseInt(this.product.retailPrice * 100)
      this.product.supplyPrice = parseInt(this.product.supplyPrice * 100)
      this.product.costPrice = parseInt(this.product.costPrice * 100)
      addProdCode(this.product).then(response => {
        let data = response.data
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
      this.$v.product.$touch()
      if (this.$v.product.$invalid) {
        return
      }
      this.$v.product.$reset()
      this.mainCodeModalOpened = false
      this.product.weight = parseInt(this.product.weight * 100)
      this.product.retailPrice = parseInt(this.product.retailPrice * 100)
      this.product.supplyPrice = parseInt(this.product.supplyPrice * 100)
      this.product.costPrice = parseInt(this.product.costPrice * 100)
      updateProdCode(this.product).then(response => {
        let data = response.data
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
      this.$nextTick(() => {
        this.product.styleId = this.productStyle.id
        this.product.departId = this.productStyle.departId
        this.product.prodStyle = this.productStyle.prodStyle
        this.product.prodName = this.productStyle.styleName
        this.$v.product.$reset()
      })
    },
    //download excel
    downloadExcel() {
      excelDownload().then(response => {
        this.fileDownload(response.data, 'sss.xls')
      })
    },
    //download specification
    downloadSpec(id, name) {
      specDownload(id).then(response => {
        this.fileDownload(response.data, name + '产品说明书.pdf')
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
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      // release url object
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    },
    // delete prodCode
    deleteProdCode(departId) {
      if (
        departId != this.myDepart &&
        this.myPermissions.indexOf('superAdmin') < 0
      ) {
        this.notify('warning', '无权维护非本部门产品')
        return
      }
      this.notify(
        'warning',
        '老实说我还没确定好是逻辑删除还是物理删除，所以Beta版本暂不提供删除功能'
      )
    },
    //dataTable request
    request({ pagination }) {
      this.loading = true
      this.searchForm.page = pagination.page
      this.searchForm.row = pagination.rowsPerPage
      getProdList(this.searchForm)
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
