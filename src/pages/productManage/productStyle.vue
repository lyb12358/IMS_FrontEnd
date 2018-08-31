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
                 v-model="searchForm.prodStyle"
                 float-label="款号" />
        <q-input class="q-mt-ml q-mr-sm"
                 v-model="searchForm.styleName"
                 float-label="款名" />
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
        <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductStyle') > -1"
               icon="mdi-new-box"
               rounded
               class="q-ma-xs"
               color="primary"
               @click="openMainStyleModal('add',0)">
          <q-tooltip>新建款式</q-tooltip>
        </q-btn>
        <!-- <q-btn icon="mdi-file-excel"
               rounded
               class="q-ma-xs"
               color="tertiary"
               @click="notify('warning','施工中~')">
          <q-tooltip>导出</q-tooltip>
        </q-btn> -->
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
          <q-td key="prodStyle"
                :props="props"
                style="text-align:center">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" /> {{ props.row.prodStyle }}
          </q-td>
          <q-td key="thumbnail"
                :props="props"
                style="text-align:center">
            <img :src="thumbnailCheck(props.row.id,props.row.thumbnail)"
                 style="height: 80px; width: 140px;"></q-td>
          <q-td key="styleName"
                :props="props"
                style="text-align:center">{{ props.row.styleName }}</q-td>
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
          <q-td key="prodMat"
                :props="props"
                style="text-align:center">{{ props.row.prodMat }}</q-td>
          <q-td key="prodYear"
                :props="props"
                style="text-align:center">{{ props.row.yearName}}</q-td>
          <q-td key="prodSeason"
                :props="props"
                style="text-align:center">{{ props.row.seasonName}}</q-td>
          <q-td key="prodUnit"
                :props="props"
                style="text-align:center">{{ props.row.unitName}}</q-td>
          <q-td key="prodLevel"
                :props="props"
                style="text-align:center">{{ props.row.levelName }}</q-td>
          <q-td key="designer"
                :props="props"
                style="text-align:center">{{ props.row.designerName }}</q-td>
          <q-td key="styleIsSync"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.styleIsSync?'mdi-check-circle':'mdi-sync-off'"
                    size="1.5rem"
                    :color="props.row.styleIsSync?'positive':'negative'" /></q-td>
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
            <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductStyle') > -1"
                   icon="mdi-format-list-numbers"
                   rounded
                   color="primary"
                   @click="openMainStyleModal('update',props.row.id)">
              <q-tooltip>修改款式信息</q-tooltip>
            </q-btn>
            <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductStyle') > -1"
                   icon="mdi-image-plus"
                   rounded
                   color="secondary"
                   @click="openImageUpload(props.row.id,props.row.prodStyle,props.row.styleName)">
              <q-tooltip>上传产品图片</q-tooltip>
            </q-btn>
            <a :href="api+'/image/style/'+props.row.id+'/'+props.row.image"
               :download="props.row.styleName">
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
                   @click="downloadSpec(props.row.id,props.row.styleName )">
              <q-tooltip>下载产品说明书</q-tooltip>
            </q-btn>
            <q-btn v-if="myPermissions.indexOf('superAdmin') > -1 | myPermissions.indexOf('modifyProductStyle') > -1"
                   icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="deleteProdStyle(props.row.id)">
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
          {{ props.pagination.page }} / {{ props.pagesNumber }}
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
    <!-- 新建款式modal -->
    <q-modal v-model="mainStyleModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
             no-refocus
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
            <div v-if="modalActionName==='修改产品款式'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     label="确定"
                     @click="modifyProdStyle" />
            </div>
            <div v-if="modalActionName==='新增产品款式'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     label="确定"
                     @click="newProdStyle" />
            </div>
            <div v-if="modalActionName==='新增产品款式'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     label="重置"
                     @click="resetStyleModal" />
            </div>
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row gutter-sm">
            <!-- <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodStyle.$error"
                       error-label="款号必填，且不超过10位">
                <q-input v-model="productStyle.prodStyle"
                         :readonly="modalActionName==='修改产品款式'?true:false"
                         class="no-margin"
                         float-label="款号" />
              </q-field>
            </div> -->
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodStyle.$error"
                       error-label="款号是必填项，且不超过10位">
                <q-input v-model.trim="productStyle.prodStyle"
                         class="no-margin"
                         float-label="款号" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.styleName.$error"
                       error-label="款名是必填项，且不超过15位">
                <q-input v-model.trim="productStyle.styleName"
                         class="no-margin"
                         float-label="款名" />
              </q-field>
            </div>
            <!-- <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.classLabel.$error"
                       error-label="产品类别必填">
                <q-input v-model="productStyle.classLabel"
                         ref="classInput"
                         readonly
                         @focus="openClassDialog()"
                         class="no-margin"
                         float-label="产品类别" />
              </q-field>
            </div> -->
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodFamily.$error"
                       error-label="归属是必填项">
                <q-select v-model="productStyle.prodFamily"
                          float-label="归属"
                          radio
                          :options="prodFamilyOptions" />
              </q-field>
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodType.$error"
                       error-label="类别是必填项">
                <q-select v-model="productStyle.prodType"
                          float-label="类别"
                          radio
                          :options="prodTypeOptions" />
              </q-field>
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.bigType.$error"
                       error-label="大类是必填项">
                <q-select v-model="productStyle.bigType"
                          float-label="大类"
                          radio
                          :options="bigTypeOptions" />
              </q-field>
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.middleType"
                        float-label="中类"
                        radio
                        :options="middleTypeOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.smallType"
                        float-label="小类"
                        radio
                        :options="smallTypeOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodAttr"
                        float-label="属性"
                        radio
                        :options="prodAttrOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodMat.$error"
                       error-label="材质信息是不是太长了？">
                <q-input v-model.trim="productStyle.prodMat"
                         class="no-margin"
                         float-label="材质" />
              </q-field>
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodYear"
                        float-label="年份"
                        radio
                        :options="prodYearOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodSeason"
                        float-label="季节"
                        radio
                        :options="prodSeasonOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodUnit"
                        float-label="单位"
                        filter
                        radio
                        :options="prodUnitOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodLevel"
                        float-label="档次"
                        radio
                        :options="prodLevelOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.designer"
                        float-label="设计师"
                        filter
                        radio
                        :options="designerOptions" />
            </div>
            <div class="col-xs-12  col-sm-12 col-md-12">
              <q-input v-model.trim="productStyle.prodDesc"
                       clearable
                       type="textarea"
                       float-label="产品描述"
                       :max-height="100" />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- select department -->
    <!-- <q-dialog v-model="departOpened"
              prevent-close
              noRefocus>
      <span slot="title">选择部门</span>
      <div slot="body">
        <q-tree :nodes="departProps"
                ref="departTree"
                color="primary"
                :selected.sync="departSelected"
                node-key="id" />
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn color="primary"
               @click="selectDepart"
               label="确定" />
        <q-btn color="primary"
               @click="departOpened = false"
               label="取消" />
      </template>
    </q-dialog> -->
    <!-- upload image -->
    <q-dialog v-model="imageUploadDialog"
              prevent-close>
      <span slot="title">上传产品图片</span>
      <span slot="message">点击"+"，选择清晰度较高的图片，将作为本款式主要图片展示</span>
      <div slot="body">
        <q-uploader ref="imageUpload"
                    :url="api+imageUploadUrl"
                    :additionalFields="[
                      {'name':'id','value':this.expandId},
                      {'name':'prodStyle','value':this.expandStyle},
                      {'name':'styleName','value':this.expandName}]"
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
  getProdStyleList,
  getProdStyleById,
  addProdStyle,
  updateProdStyle
} from 'src/api/product'
import {
  getProdClassOptions,
  getProdClassOptionsByParent,
  getProdParamOptions,
  getProdParamOptionsByParent
} from 'src/api/productParam'
import { specDownload } from 'src/api/productPlus'

export default {
  data() {
    return {
      api: process.env.API,
      searchForm: {
        page: 0,
        row: 0,
        prodStyle: '',
        styleName: ''
      },
      loading: false,
      visibleColumns: [
        'prodStyle',
        //'thumbnail',
        'styleName',
        'prodFamily',
        'prodType',
        'bigType',
        'middleType',
        'smallType',
        'prodAttr',
        'styleIsSync'
      ],
      separator: 'horizontal',
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 5 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        { name: 'prodStyle', label: '款号', field: 'prodStyle' },
        { name: 'thumbnail', label: '简图', field: 'thumbnail' },
        { name: 'styleName', label: '款名', field: 'styleName' },
        { name: 'prodFamily', label: '产品归属', field: 'prodFamily' },
        { name: 'prodType', label: '产品类别', field: 'prodType' },
        { name: 'bigType', label: '大类', field: 'bigType' },
        { name: 'middleType', label: '中类', field: 'middleType' },
        { name: 'smallType', label: '小类', field: 'smallType' },
        { name: 'prodAttr', label: '属性', field: 'prodAttr' },
        { name: 'prodMat', label: '材质', field: 'prodMat' },
        { name: 'prodYear', label: '年份', field: 'prodYear' },
        { name: 'prodSeason', label: '季节', field: 'prodSeason' },
        { name: 'prodUnit', label: '单位', field: 'prodUnit' },
        { name: 'prodLevel', label: '档次', field: 'prodLevel' },
        { name: 'designer', label: '设计师', field: 'designer' },
        { name: 'styleIsSync', label: '是否同步', field: 'styleIsSync' },
        { name: 'gmtCreate', label: '创建时间', field: 'gmtCreate' },
        { name: 'gmtModified', label: '修改时间', field: 'gmtModified' }
      ],
      //modal
      mainStyleModalOpened: false,
      modalActionName: '',
      //modal content
      productStyle: {
        id: 0,
        prodStyle: '',
        styleName: '',
        prodFamily: '',
        //familyName: '',
        prodType: '',
        //typeName: '',
        bigType: '',
        //bigName: '',
        middleType: '',
        //middleName: '',
        smallType: '',
        //smallName: '',
        prodAttr: '',
        //attrName: '',
        prodMat: '',
        prodYear: '',
        //yearName: '',
        prodSeason: '',
        //seasonName: '',
        prodUnit: '',
        //unitName: '',
        prodLevel: '',
        //levelName: '',
        designer: '',
        //designerName: '',
        prodDesc: '',
        isDel: false,
        isSync: false
      },
      classList: [],
      paramList: [],
      prodFamilyOptions: [],
      prodTypeOptions: [],
      bigTypeOptions: [],
      middleTypeOptions: [],
      smallTypeOptions: [],
      prodAttrOptions: [],
      prodYearOptions: [],
      prodSeasonOptions: [],
      prodUnitOptions: [],
      prodLevelOptions: [],
      designerOptions: [],
      //upload image
      expandId: 0,
      expandStyle: '',
      expandName: '',
      imageUploadDialog: false,
      imageUploadUrl: '/image/prodStyle'
    }
  },
  validations: {
    productStyle: {
      prodStyle: { required, maxLength: maxLength(10) },
      styleName: { required, maxLength: maxLength(20) },
      prodFamily: { required },
      prodType: { required },
      bigType: { required },
      prodMat: { maxLength: maxLength(20) }
    }
  },
  computed: {
    myPermissions() {
      return this.$store.getters['user/permissions']
    },
    myDepart() {
      return this.$store.getters['user/userInfo'].departId
    },
    myDepartName() {
      return this.$store.getters['user/userInfo'].departLabel
    }
  },
  watch: {
    //reset the prodClass when its changes
    'productStyle.prodFamily': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.bigTypeOptions = []
        this.middleTypeOptions = []
        this.smallTypesOptions = []
        this.productStyle.prodType = ''
        this.productStyle.bigType = ''
        this.productStyle.middleType = ''
        this.productStyle.smallType = ''
        newVal += ''
        this.prodTypeOptions = filter(newVal, {
          field: 'parentId',
          list: this.classList
        })
      }
    },
    'productStyle.prodType': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.middleTypeOptions = []
        this.smallTypesOptions = []
        this.productStyle.bigType = ''
        this.productStyle.middleType = ''
        this.productStyle.smallType = ''
        newVal += ''
        this.bigTypeOptions = filter(newVal, {
          field: 'parentId',
          list: this.classList
        })
      }
    },
    'productStyle.bigType': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.smallTypesOptions = []
        this.productStyle.middleType = ''
        this.productStyle.smallType = ''
        newVal += ''
        this.middleTypeOptions = filter(newVal, {
          field: 'parentId',
          list: this.classList
        })
      }
    },
    'productStyle.middleType': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.productStyle.smallType = ''
        newVal += ''
        this.smallTypeOptions = filter(newVal, {
          field: 'parentId',
          list: this.classList
        })
      }
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
    //modal input depart permission check
    // checkDepartPermission() {
    //   if (this.myPermissions.indexOf('superAdmin') > -1) {
    //     this.departOpened = true
    //   }
    // },
    //main modal function
    openMainStyleModal(action, id) {
      this.$v.productStyle.$reset()
      if (action === 'add') {
        this.modalActionName = '新增产品款式'
        Object.assign(
          this.productStyle,
          this.$options.data.call(this).productStyle
        )
        this.$nextTick(() => {
          this.mainStyleModalOpened = true
        })
      } else if (action === 'update') {
        // if (
        //   departId != this.myDepart &&
        //   this.myPermissions.indexOf('superAdmin') < 0
        // ) {
        //   this.notify('warning', '无权维护非本部门产品')
        //   return
        // }
        this.modalActionName = '修改产品款式'
        getProdStyleById(id).then(response => {
          let productStyle = response.data.data
          Object.assign(this.productStyle, productStyle)
          // filter util need string parameter
          let prodFamily = productStyle.prodFamily + ''
          let prodType = productStyle.prodType + ''
          let bigType = productStyle.bigType + ''
          let middleType = productStyle.middleType + ''
          this.prodTypeOptions = filter(prodFamily, {
            field: 'parentId',
            list: this.classList
          })
          this.bigTypeOptions = filter(prodType, {
            field: 'parentId',
            list: this.classList
          })
          this.middleTypeOptions = filter(bigType, {
            field: 'parentId',
            list: this.classList
          })
          this.smallTypeOptions = filter(middleType, {
            field: 'parentId',
            list: this.classList
          })
          this.$nextTick(() => {
            this.mainStyleModalOpened = true
          })
        })
      }
    },
    //add product
    // selectDepart() {
    //   if (this.departSelected == '') {
    //     this.notify('warning', '请选择一个部门')
    //     return
    //   }
    //   if (
    //     this.$refs.departTree.getNodeByKey(this.departSelected).isParent == 1
    //   ) {
    //     this.notify('warning', '产品绑定到部门，而非公司')
    //     this.departSelected = ''
    //     return
    //   }
    //   this.productStyle.departId = this.$refs.departTree.getNodeByKey(
    //     this.departSelected
    //   ).id
    //   this.productStyle.departLabel = this.$refs.departTree.getNodeByKey(
    //     this.departSelected
    //   ).label
    //   this.departOpened = false
    // },
    // selectClass() {
    //   if (this.classSelected == '') {
    //     this.notify('warning', '请选择一个类别')
    //     return
    //   }
    //   if (this.$refs.classTree.getNodeByKey(this.classSelected).isParent == 1) {
    //     this.notify('warning', '只能选择子类')
    //     this.classSelected = ''
    //     return
    //   }
    //   this.productStyle.prodClass = this.$refs.classTree.getNodeByKey(
    //     this.classSelected
    //   ).id
    //   this.productStyle.classLabel = this.$refs.classTree.getNodeByKey(
    //     this.classSelected
    //   ).label
    //   this.classOpened = false
    // },

    //upload image
    openImageUpload(id, prodStyle, styleName) {
      this.expandId = id
      this.expandStyle = prodStyle
      this.expandName = styleName
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
    //check thumbnail
    thumbnailCheck(id, thumbnail) {
      if (!(thumbnail === null)) {
        return this.api + '/image/style/' + id + '/' + thumbnail
      } else {
        return 'statics/sad.svg'
      }
    },
    newProdStyle() {
      this.$v.productStyle.$touch()
      if (this.$v.productStyle.$invalid) {
        return
      }
      this.$v.productStyle.$reset()
      this.productStyle.isDel = 0
      this.productStyle.isSync = 0
      addProdStyle(this.productStyle)
        .then(response => {
          let data = response.data
          this.mainStyleModalOpened = false
          Object.assign(
            this.productStyle,
            this.$options.data.call(this).productStyle
          )
          this.notify('positive', data.msg)
          this.request({
            pagination: this.serverPagination
          })
        })
        .catch(error => {})
    },
    modifyProdStyle() {
      this.$v.productStyle.$touch()
      if (this.$v.productStyle.$invalid) {
        return
      }
      this.$v.productStyle.$reset()
      this.productStyle.isSync = 0
      updateProdStyle(this.productStyle)
        .then(response => {
          let data = response.data
          this.mainStyleModalOpened = false
          Object.assign(
            this.productStyle,
            this.$options.data.call(this).productStyle
          )
          this.notify('positive', data.msg)
          this.request({
            pagination: this.serverPagination
          })
        })
        .catch(error => {})
    },
    resetStyleModal() {
      Object.assign(
        this.productStyle,
        this.$options.data.call(this).productStyle
      )
      this.$nextTick(() => {
        this.$v.productStyle.$reset()
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
    // delete prodStyle
    deleteProdStyle(departId) {
      if (
        departId != this.myDepart &&
        this.myPermissions.indexOf('superAdmin') < 0
      ) {
        this.notify('warning', '没有权限维护该产品')
        return
      }
      this.notify('warning', '产品删除了哦')
    },
    //dataTable request
    request({ pagination }) {
      this.loading = true
      this.searchForm.page = pagination.page
      this.searchForm.row = pagination.rowsPerPage
      getProdStyleList(this.searchForm)
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
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination
    })
    //once mounted, fetch some product parameters
    getProdClassOptions().then(response => {
      let data = response.data.data
      this.classList = data
      this.prodFamilyOptions = filter('0', { field: 'parentId', list: data })
    })
    getProdParamOptions().then(response => {
      let data = response.data.data
      this.paramList = data
      this.prodAttrOptions = filter('606', { field: 'parentId', list: data })
      this.prodYearOptions = filter('464', { field: 'parentId', list: data })
      this.prodSeasonOptions = filter('465', {
        field: 'parentId',
        list: data
      })
      this.prodUnitOptions = filter('458', { field: 'parentId', list: data })
      this.prodLevelOptions = filter('486', { field: 'parentId', list: data })
      this.designerOptions = filter('567', { field: 'parentId', list: data })
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
