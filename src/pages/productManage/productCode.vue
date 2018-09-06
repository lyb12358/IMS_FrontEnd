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
               v-if="checkAuth(12)"
               rounded
               class="q-ma-xs"
               color="primary"
               @click="openChooseStyleDialog">
          <q-tooltip>新建</q-tooltip>
        </q-btn>
        <q-btn v-if="checkAuth(18)"
               icon="mdi-file-excel"
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
              v-if="checkCode(col.name)"
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
          <q-td v-if="checkCode('prodCode')"
                key="prodCode"
                :props="props"
                style="text-align:center">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" /> {{ props.row.prodCode }}
          </q-td>
          <q-td v-if="checkCode('thumbnail')"
                key="thumbnail"
                :props="props"
                style="text-align:center">
            <img :src="thumbnailCheck(props.row.id,props.row.styleId,props.row.codeThumbnail,props.row.styleThumbnail)"
                 style="height: 80px; width: 140px;"></q-td>
          <q-td v-if="checkCode('prodName')"
                key="prodName"
                :props="props"
                style="text-align:center">{{ props.row.prodName }}</q-td>
          <q-td v-if="checkCode('prodCat')"
                key="prodCat"
                :props="props"
                style="text-align:center">{{ props.row.catName }}</q-td>
          <q-td v-if="checkCode('prodStyle')"
                key="prodStyle"
                :props="props"
                style="text-align:center">{{ props.row.prodStyle }}</q-td>
          <q-td v-if="checkCode('prodFamily')"
                key="prodFamily"
                :props="props"
                style="text-align:center">{{ props.row.familyName }}</q-td>
          <q-td v-if="checkCode('prodType')"
                key="prodType"
                :props="props"
                style="text-align:center">{{ props.row.typeName }}</q-td>
          <q-td v-if="checkCode('bigType')"
                key="bigType"
                :props="props"
                style="text-align:center">{{ props.row.bigName }}</q-td>
          <q-td v-if="checkCode('middleType')"
                key="middleType"
                :props="props"
                style="text-align:center">{{ props.row.middleName }}</q-td>
          <q-td v-if="checkCode('smallType')"
                key="smallType"
                :props="props"
                style="text-align:center">{{ props.row.smallName }}</q-td>
          <q-td v-if="checkCode('prodAttr')"
                key="prodAttr"
                :props="props"
                style="text-align:center">{{ props.row.attrName}}</q-td>
          <q-td v-if="checkCode('prodSpe')"
                key="prodSpe"
                :props="props"
                style="text-align:center">{{ props.row.speName }}</q-td>
          <q-td v-if="checkCode('prodColor')"
                key="prodColor"
                :props="props"
                style="text-align:center">{{ props.row.colorName }}</q-td>
          <q-td v-if="checkCode('retailPrice')"
                key="retailPrice"
                :props="props"
                style="text-align:center">{{ props.row.retailPrice}}
          </q-td>
          <q-td v-if="checkCode('supplyPrice')"
                key="supplyPrice"
                :props="props"
                style="text-align:center">{{ props.row.supplyPrice }}
          </q-td>
          <q-td v-if="checkCode('costPrice')"
                key="costPrice"
                :props="props"
                style="text-align:center">{{ props.row.costPrice }}
          </q-td>
          <q-td v-if="checkCode('codeIsSync')"
                key="codeIsSync"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.codeIsSync?'mdi-check-circle':'mdi-sync-off'"
                    size="1.5rem"
                    :color="props.row.codeIsSync?'positive':'negative'" /></q-td>
          <q-td v-if="checkCode('gmtCreate')"
                key="gmtCreate"
                :props="props"
                style="text-align:center">{{ formatDate(props.row.gmtCreate) }}</q-td>
          <q-td v-if="checkCode('gmtModified')"
                key="gmtModified"
                :props="props"
                style="text-align:center">{{ formatDate(props.row.gmtModified) }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn v-if="checkAuth(13)"
                   icon="mdi-format-list-numbers"
                   rounded
                   color="orange"
                   @click="openMainCodeModal('update',props.row.id)">
              <q-tooltip>修改该编号产品信息</q-tooltip>
            </q-btn>
            <q-btn v-if="checkAuth(12)"
                   icon="mdi-playlist-plus"
                   rounded
                   color="brown"
                   @click="checkStyle(props.row.styleId)">
              <q-tooltip>增加同款式产品</q-tooltip>
            </q-btn>
            <q-btn v-if="checkAuth(14)"
                   icon="mdi-image-plus"
                   rounded
                   color="secondary"
                   @click="openImageUpload(props.row.id,props.row.prodCode,props.row.prodName)">
              <q-tooltip>上传图片</q-tooltip>
            </q-btn>
            <a v-if="checkAuth(15)"
               :href="props.row.codeThumbnail!=null?api+'/image/code/'+props.row.id+'/'+props.row.codeImage:api+'/image/style/'+props.row.styleId+'/'+props.row.styleImage"
               :download="props.row.prodName">
              <q-btn icon="mdi-image-area-close"
                     v-if="props.row.codeThumbnail!=null|props.row.styleThumbnail!=null"
                     rounded
                     color="tertiary">
                <q-tooltip>下载原图</q-tooltip>
              </q-btn>
            </a>
            <q-btn v-if="checkAuth(16)"
                   icon="mdi-clipboard-arrow-down"
                   rounded
                   color="primary"
                   @click="downloadSpec(props.row.id,props.row.prodName )">
              <q-tooltip>下载产品说明书</q-tooltip>
            </q-btn>
            <q-btn v-if="checkAuth(17)"
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
    <q-dialog v-model="chooseStyleDialogOpened"
              no-refocus
              prevent-close>
      <span slot="title">请选择一个款式</span>
      <div slot="body">
        <q-field icon="mdi-sofa"
                 label="款名"
                 :label-width="3">
          <q-input v-model.trim="prodStyleAutoSearch.styleName">
            <q-autocomplete @search="autoStyleNameSearch"
                            :min-characters="2"
                            @selected="styleSelected"
                            value-field="label" />
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn color="primary"
               @click="checkStyle(prodStyleAutoSearch.id)"
               label="确定" />
        <q-btn color="primary"
               @click="closeChooseStyleDialog"
               label="取消" />
      </template>
    </q-dialog>
    <!-- main modal -->
    <q-modal v-model="mainCodeModalOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             no-refocus
             :content-css="{minWidth: '100vw', minHeight: '100vh'}">
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
                  <q-item-side :image="thumbnailCheck(null,productStyle.id,null,productStyle.thumbnail)"
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
                        </tr>
                        <tr>
                          <td class="text-right">归属：</td>
                          <td class="text-left">{{productStyle.familyName}}</td>
                          <td class="text-right">类别：</td>
                          <td class="text-left">{{productStyle.typeName}}</td>
                          <td class="text-right">属性：</td>
                          <td class="text-left">{{productStyle.attrName}}</td>
                        </tr>
                        <tr>
                          <td class="text-right">大类：</td>
                          <td class="text-left">{{productStyle.bigName}}</td>
                          <td class="text-right">中类：</td>
                          <td class="text-left">{{productStyle.middleName}}</td>
                          <td class="text-right">小类：</td>
                          <td class="text-left">{{productStyle.smallName}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </q-card-main>
                </q-card>
              </q-collapsible>
            </div>
          </div>
          <div class="row gutter-sm">
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productCode.prodCode.$error"
                       error-label="编号必填，且不超过20位">
                <q-input v-model="productCode.prodCode"
                         :readonly="modalActionName==='修改产品信息'?true:false"
                         class="no-margin"
                         float-label="编号" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.prodName.$error"
                       error-label="名称必填，且不超过15位">
                <q-input v-model="productCode.prodName"
                         class="no-margin"
                         float-label="名称" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="productCode.prodCat"
                        float-label="品类"
                        radio
                        :options="prodCatOptions" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="productCode.prodSpe"
                        float-label="规格"
                        radio
                        :options="prodSpeOptions" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.retailPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.retailPrice"
                         class="no-margin"
                         float-label="零售价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.supplyPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.supplyPrice"
                         class="no-margin"
                         float-label="供应价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.costPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.costPrice"
                         class="no-margin"
                         float-label="成本价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="productCode.prodColor"
                        float-label="花色"
                        radio
                        :options="prodColorOptions" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.numModel.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.numModel"
                         class="no-margin"
                         float-label="件数" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.netWeight"
                       class="no-margin"
                       float-label="克重" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.boxNum.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.boxNum"
                         class="no-margin"
                         float-label="装箱数" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.boxModel"
                       class="no-margin"
                       float-label="装箱规格" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.boxVolume"
                       class="no-margin"
                       float-label="装箱体积" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.boxWeight"
                       class="no-margin"
                       float-label="箱重量" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.boxWarn.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.boxWarn"
                         class="no-margin"
                         float-label="散货预警量" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.prodCycle.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.prodCycle"
                         class="no-margin"
                         float-label="生产周期" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.tRetailPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.tRetailPrice"
                         class="no-margin"
                         float-label="三等品零售价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.tSupplyPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.tSupplyPrice"
                         class="no-margin"
                         float-label="三等品供应价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.tCostPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.tCostPrice"
                         class="no-margin"
                         float-label="三等品成本价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-toggle v-model="productCode.isRemind"
                        label="是否库存提醒" />
              <q-toggle v-model="productCode.isSecurity"
                        label="是否有防伪码" />
              <q-toggle v-model="productCode.isRate"
                        label="是否计算周转率" />
            </div>
            <div class="col-xs-12  col-sm-12 col-md-12">
              <q-input v-model.trim="productCode.remark"
                       clearable
                       type="textarea"
                       float-label="备注"
                       :max-height="100" />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- upload image -->
    <q-dialog v-model="imageUploadDialog"
              prevent-close>
      <span slot="title">上传图片</span>
      <span slot="message">点击"+"，选择清晰度较高的图片，将作为主要图片展示</span>
      <div slot="body">
        <q-uploader ref="imageUpload"
                    :url="api+imageUploadUrl"
                    :additionalFields="[
                      {'name':'id','value':this.expandId},
                      {'name':'prodCode','value':this.expandStyle},
                      {'name':'prodName','value':this.expandName}]"
                    clearable
                    auto-expand
                    hide-upload-button
                    float-label="上传图片"
                    @uploaded="imageUploaded"
                    @fail="imageUploadedFail"
                    @add="addImageFile" />
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn color="primary"
               label="上传"
               @click="imageUpload" />
        <q-btn color="primary"
               label="取消"
               @click="imageUploadCancel" />
      </template>
    </q-dialog>
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
  getProdCodeList,
  getProdCodeById,
  addProdCode,
  updateProdCode,
  getProdStyleOptions,
  getProdStyleById
} from 'src/api/product'
import {
  getProdParamOptions,
  getProdCatOptions,
  getProdSpeOptionsByParent
} from 'src/api/productParam'
import { excelDownload, specDownload } from 'src/api/productPlus'
//custom validate
//const validDecimal = value => value.toString().split('.')[1].length <= 2
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
        'prodCode',
        'prodName',
        'prodCat',
        'bigType',
        'middleType',
        'smallType',
        'retailPrice',
        'supplyPrice',
        'costPrice',
        'codeIsSync'
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
        { name: 'thumbnail', label: '简图', field: 'thumbnail' },
        { name: 'prodName', label: '产品名称', field: 'prodName' },
        { name: 'prodCat', label: '品类', field: 'prodCat' },
        { name: 'prodStyle', label: '款号', field: 'prodStyle' },
        { name: 'prodFamily', label: '产品归属', field: 'prodFamily' },
        { name: 'prodType', label: '产品类别', field: 'prodType' },
        { name: 'bigType', label: '大类', field: 'bigType' },
        { name: 'middleType', label: '中类', field: 'middleType' },
        { name: 'smallType', label: '小类', field: 'smallType' },
        { name: 'prodAttr', label: '属性', field: 'prodAttr' },
        { name: 'prodSpe', label: '规格', field: 'prodSpe' },
        { name: 'prodColor', label: '花色', field: 'prodColor' },
        { name: 'retailPrice', label: '零售价', field: 'retailPrice' },
        { name: 'supplyPrice', label: '供应价', field: 'supplyPrice' },
        { name: 'costPrice', label: '成本价', field: 'costPrice' },
        { name: 'codeIsSync', label: '是否同步', field: 'codeIsSync' },
        { name: 'gmtCreate', label: '创建时间', field: 'gmtCreate' },
        { name: 'gmtModified', label: '修改时间', field: 'gmtModified' }
      ],
      //choose style dialog
      chooseStyleDialogOpened: false,
      prodStyleAutoSearch: {
        id: '',
        prodStyle: '',
        styleName: ''
      },
      //modal
      mainCodeModalOpened: false,
      modalActionName: '',
      //modal content
      productStyle: {
        id: 0,
        prodStyle: '',
        styleName: '',
        prodFamily: '',
        familyName: '',
        prodType: '',
        typeName: '',
        bigType: '',
        bigName: '',
        middleType: '',
        middleName: '',
        smallType: '',
        smallName: '',
        prodAttr: '',
        attrName: '',
        prodMat: '',
        prodYear: '',
        yearName: '',
        prodSeason: '',
        seasonName: '',
        prodUnit: '',
        unitName: '',
        prodLevel: '',
        levelName: '',
        designer: '',
        designerName: '',
        prodDesc: '',
        thumbnail: '',
        isDel: false,
        isSync: false
      },
      productCode: {
        id: 0,
        styleId: 0,
        prodCode: '',
        prodName: '',
        prodCat: '',
        prodSpe: '',
        retailPrice: '',
        supplyPrice: '',
        costPrice: '',
        prodColor: '',
        numModel: '',
        netWeight: '',
        boxNum: '',
        boxModel: '',
        boxVolume: '',
        boxWeight: '',
        boxWarn: '',
        isRemind: false,
        remark: '',
        isSecurity: false,
        isRate: false,
        prodCycle: '',
        tRetailPrice: '',
        tSupplyPrice: '',
        tCostPrice: '',
        isDel: false,
        isSync: false
      },
      paramList: [],
      prodColorOptions: [],
      catList: [],
      prodCatOptions: [],
      prodSpeOptions: [],
      //upload image
      expandId: 0,
      expandStyle: '',
      expandName: '',
      imageUploadDialog: false,
      imageUploadUrl: '/image/prodCode'
    }
  },
  validations: {
    productCode: {
      prodCode: { required, maxLength: maxLength(20) },
      prodName: { required, maxLength: maxLength(15) },
      retailPrice: {
        required,
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      supplyPrice: {
        required,
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      costPrice: {
        required,
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      numModel: { integer },
      boxNum: { integer },
      boxWarn: { integer },
      prodCycle: { integer },
      tRetailPrice: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      tSupplyPrice: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      },
      tCostPrice: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999)
      }
    }
  },
  computed: {
    permissions() {
      return this.$store.getters['user/permissions']
    },
    checkCodePermission() {
      return this.$store.getters['user/checkCodePermission']
    },
    maintainProductPermission() {
      return this.$store.getters['user/maintainProductPermission']
    }
  },
  watch: {
    //reset cat and spe when bigType changes
    // 'productCode.bigType': function(newVal, oldVal) {
    //   if (this.mainCodeModalOpened) {
    //     this.productCode.prodCat = ''
    //     this.productCode.prodSpe = ''
    //     getProdSpeOptionsByParent(newVal).then(response => {
    //       let data = response.data.data
    //       this.prodSpeOptions = data
    //     })
    //     newVal += ''
    //     this.prodCatOptions = filter(newVal, {
    //       field: 'classId',
    //       list: this.catList
    //     })
    //   }
    // }
  },
  methods: {
    checkAuth(auth) {
      if (this.permissions.indexOf(1) > -1) {
        return true
      }
      if (this.permissions.indexOf(auth) > -1) {
        return true
      } else {
        return false
      }
    },
    checkCode(auth) {
      if (this.permissions.indexOf(1) > -1) {
        return true
      }
      if (this.checkCodePermission.indexOf(auth) > -1) {
        return true
      } else {
        return false
      }
    },
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
    openChooseStyleDialog() {
      Object.assign(
        this.prodStyleAutoSearch,
        this.$options.data.call(this).prodStyleAutoSearch
      )
      this.chooseStyleDialogOpened = true
    },
    autoProdStyleSearch(terms, done) {
      getProdStyleOptions(this.prodStyleAutoSearch).then(response => {
        let data = response.data.data
        done(data)
      })
    },
    autoStyleNameSearch(terms, done) {
      getProdStyleOptions(this.prodStyleAutoSearch).then(response => {
        let data = response.data.data
        done(data)
      })
    },
    styleSelected(item) {
      this.prodStyleAutoSearch.id = item.value
    },
    closeChooseStyleDialog() {
      Object.assign(
        this.prodStyleAutoSearch,
        this.$options.data.call(this).prodStyleAutoSearch
      )
      this.chooseStyleDialogOpened = false
    },
    checkStyle(id) {
      if (id == '') {
        this.notify('warning', '请先选择一个现有的款式')
        return
      }
      getProdStyleById(id).then(response => {
        Object.assign(
          this.productCode,
          this.$options.data.call(this).productCode
        )
        Object.assign(
          this.productStyle,
          this.$options.data.call(this).productStyle
        )
        let productStyle = response.data.data
        // let departId = productStyle.departId
        // if (
        //   departId != this.myDepart &&
        //   this.myPermissions.indexOf('superAdmin') < 0
        // ) {
        //   this.notify('warning', '无权维护非本部门产品')
        //   return
        // }
        this.chooseStyleDialogOpened = false
        Object.assign(this.productStyle, productStyle)
        Object.assign(
          this.prodStyleAutoSearch,
          this.$options.data.call(this).prodStyleAutoSearch
        )
        // this.$nextTick(() => {
        // })
        this.openMainCodeModal('add')
      })
    },
    //check thumbnail
    thumbnailCheck(id, styleId, codeThumbnail, styleThumbnail) {
      if (!(codeThumbnail === null) && !(codeThumbnail === '')) {
        return this.api + '/image/code/' + id + '/' + codeThumbnail
      } else if (!(styleThumbnail === null) && !(styleThumbnail === '')) {
        return this.api + '/image/style/' + styleId + '/' + styleThumbnail
      } else {
        return 'statics/sad.svg'
      }
    },
    //main modal function
    openMainCodeModal(action, id) {
      this.$v.productCode.$reset()
      if (action === 'add') {
        this.modalActionName = '新增产品信息'
        this.productCode.styleId = this.productStyle.id
        this.productCode.prodStyle = this.productStyle.prodStyle
        this.productCode.prodName = this.productStyle.styleName
        this.mainCodeModalOpened = true
        let bigType = this.productStyle.bigType
        getProdSpeOptionsByParent(bigType).then(response => {
          let data = response.data.data
          this.prodSpeOptions = data
        })
        bigType += ''
        this.prodCatOptions = filter(bigType, {
          field: 'classId',
          list: this.catList
        })
      } else if (action === 'update') {
        // if (
        //   departId != this.myDepart &&
        //   this.myPermissions.indexOf('superAdmin') < 0
        // ) {
        //   this.notify('warning', '无权维护非本部门产品')
        //   return
        // }
        this.modalActionName = '修改产品信息'
        let xx = getProdCodeById(id).then(response => {
          let product = response.data.data
          //check prodType permission
          let pt = product.prodType
          pt += ''
          if (
            this.permissions.indexOf(1) < 0 &&
            this.maintainProductPermission.indexOf(pt) < 0
          ) {
            this.notify('warning', '无权维护该类别产品')
            return false
          }
          Object.assign(this.productStyle, product)
          Object.assign(this.productCode, product)
          this.$nextTick(() => {
            this.productStyle.thumbnail = this.productStyle.styleThumbnail
            this.productStyle.id = this.productStyle.styleId
            this.mainCodeModalOpened = true
          })
        })
        if (xx) {
          return
        }
        let bigType = this.productStyle.bigType
        getProdSpeOptionsByParent(bigType).then(response => {
          let data = response.data.data
          this.prodSpeOptions = data
        })
        bigType += ''
        this.prodCatOptions = filter(bigType, {
          field: 'classId',
          list: this.catList
        })
      }
    },
    newProdCode() {
      //check prodType permission
      let pt = this.productCode.prodType
      pt += ''
      if (
        this.permissions.indexOf(1) < 0 &&
        this.maintainProductPermission.indexOf(pt) < 0
      ) {
        this.notify('warning', '无权维护该类别产品')
        return
      }
      this.$v.productCode.$touch()
      if (this.$v.productCode.$invalid) {
        return
      }
      this.$v.productCode.$reset()
      this.productCode.isDel = 0
      this.productCode.status = 1
      //fix
      this.productCode.isSync = 1
      this.productCode.gmtCreate = Date.now()
      addProdCode(this.productCode).then(response => {
        this.mainCodeModalOpened = false
        let data = response.data
        Object.assign(
          this.productCode,
          this.$options.data.call(this).productCode
        )
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
      this.$v.productCode.$touch()
      if (this.$v.productCode.$invalid) {
        return
      }
      this.$v.productCode.$reset()
      //fix
      this.productCode.isSync = 1
      this.productCode.gmtCreate = ''
      this.productCode.gmtModified = ''
      updateProdCode(this.productCode).then(response => {
        this.mainCodeModalOpened = false
        let data = response.data
        Object.assign(
          this.productCode,
          this.$options.data.call(this).productCode
        )
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
      Object.assign(this.productCode, this.$options.data.call(this).productCode)
      this.$nextTick(() => {
        this.productCode.styleId = this.productStyle.id
        this.productCode.prodStyle = this.productStyle.prodStyle
        this.productCode.prodName = this.productStyle.styleName
        this.$v.productCode.$reset()
      })
    },
    //upload image
    openImageUpload(id, prodCode, prodName) {
      this.expandId = id
      this.expandStyle = prodCode
      this.expandName = prodName
      this.imageUploadDialog = true
    },
    addImageFile(files) {
      if (files[0].size > 5 * 1024 * 1024) {
        this.$refs.imageUpload.reset()
        this.notify('warning', '图片不能大于5MB')
      }
    },
    imageUpload() {
      this.$refs.imageUpload.upload()
    },
    imageUploadCancel() {
      this.$refs.imageUpload.reset()
      this.imageUploadDialog = false
    },
    // when image has just bean uploaded
    imageUploaded(file, xhr) {
      let response = JSON.parse(xhr.response)
      this.notify('positive', response.msg)
      this.$refs.imageUpload.reset()
      this.imageUploadDialog = false
      this.request({
        pagination: this.serverPagination
      })
    },
    // when it has encountered error while uploading
    imageUploadedFail(file, xhr) {
      let response = JSON.parse(xhr.response)
      this.notify('negative', response.data.msg)
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
      this.notify('warning', '删除了哦')
    },
    //dataTable request
    request({ pagination }) {
      this.loading = true
      this.searchForm.page = pagination.page
      this.searchForm.row = pagination.rowsPerPage
      getProdCodeList(this.searchForm)
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
    getProdParamOptions().then(response => {
      let data = response.data.data
      this.paramList = data
      this.prodColorOptions = filter('466', { field: 'parentId', list: data })
    })
    //fetch all the categories
    getProdCatOptions().then(response => {
      let data = response.data.data
      this.catList = data
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
