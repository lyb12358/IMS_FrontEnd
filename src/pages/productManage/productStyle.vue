<template>
  <q-page padding>
    <q-table ref="table"
             :data="serverData"
             :columns="columnsComputed"
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
        <q-btn v-show="resetBtnExist"
               icon="mdi-eraser"
               label="重置当前搜索"
               rounded
               color="dark"
               @click="resetSearchFormAndSearch">
        </q-btn>
        <q-btn icon="mdi-magnify"
               label="搜索"
               rounded
               color="secondary"
               @click="searchFormDialogOpened=true">
        </q-btn>
        <q-btn v-if="checkAuth(20)"
               label="新建"
               icon="mdi-new-box"
               rounded
               color="primary"
               @click="openMainStyleModal('add',0)">
        </q-btn>
      </div>
      <template slot="top-right"
                slot-scope="props"
                class="print-hide">
        <q-table-columns color="secondary"
                         class="q-mr-sm print-hide"
                         label="筛选列"
                         v-model="visibleColumns"
                         :columns="columnsComputed" />
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
              v-if="checkStyle(col.name)"
              :key="col.name"
              :props="props"
              style="text-align:center">
          {{ col.label }}
        </q-th>
      </q-tr>
      <template slot="body"
                slot-scope="props">
        <q-tr :props="props">
          <q-td v-if="checkStyle('prodStyle')"
                key="prodStyle"
                :props="props"
                style="text-align:center">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" /> {{ props.row.prodStyle }}
          </q-td>
          <q-td v-if="checkStyle('thumbnail')"
                key="thumbnail"
                :props="props"
                style="text-align:center">
            <img :src="thumbnailCheck(props.row.id,props.row.thumbnail)"
                 style="height: 80px; width: 80px;"></q-td>
          <q-td v-if="checkStyle('styleName')"
                key="styleName"
                :props="props"
                :style="{textAlign:'center',maxWidth:'100px',whiteSpace:'normal'}">{{ props.row.styleName }}</q-td>
          <q-td v-if="checkStyle('familyName')"
                key="familyName"
                :props="props"
                style="text-align:center">{{ props.row.familyName }}</q-td>
          <q-td v-if="checkStyle('typeName')"
                key="typeName"
                :props="props"
                style="text-align:center">{{ props.row.typeName }}</q-td>
          <q-td v-if="checkStyle('bigName')"
                key="bigName"
                :props="props"
                style="text-align:center">{{ props.row.bigName }}</q-td>
          <q-td v-if="checkStyle('middleName')"
                key="middleName"
                :props="props"
                style="text-align:center">{{ props.row.middleName }}</q-td>
          <q-td v-if="checkStyle('smallName')"
                key="smallName"
                :props="props"
                style="text-align:center">{{ props.row.smallName }}</q-td>
          <q-td v-if="checkStyle('attrName')"
                key="attrName"
                :props="props"
                style="text-align:center">{{ props.row.attrName}}</q-td>
          <q-td v-if="checkStyle('prodMat')"
                key="prodMat"
                :props="props"
                :style="{textAlign:'center',maxWidth:'100px',whiteSpace:'normal'}">{{ props.row.prodMat }}</q-td>
          <q-td v-if="checkStyle('yearName')"
                key="yearName"
                :props="props"
                style="text-align:center">{{ props.row.yearName}}</q-td>
          <q-td v-if="checkStyle('seasonName')"
                key="seasonName"
                :props="props"
                style="text-align:center">{{ props.row.seasonName}}</q-td>
          <q-td v-if="checkStyle('unitName')"
                key="unitName"
                :props="props"
                style="text-align:center">{{ props.row.unitName}}</q-td>
          <q-td v-if="checkStyle('levelName')"
                key="levelName"
                :props="props"
                style="text-align:center">{{ props.row.levelName }}</q-td>
          <q-td v-if="checkStyle('designerName')"
                key="designerName"
                :props="props"
                style="text-align:center">{{ props.row.designerName }}</q-td>
          <q-td v-if="checkStyle('styleIsSync')"
                key="styleIsSync"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.styleIsSync?'mdi-check-circle':'mdi-sync-off'"
                    size="1.5rem"
                    :color="props.row.styleIsSync?'positive':'negative'" />
          </q-td>
          <q-td v-if="checkStyle('gmtCreate')"
                key="gmtCreate"
                :props="props"
                style="text-align:center">{{ formatDate(props.row.gmtCreate) }}</q-td>
          <q-td v-if="checkStyle('gmtModified')"
                key="gmtModified"
                :props="props"
                style="text-align:center">{{ formatDate(props.row.gmtModified) }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn v-if="checkAuth(21)"
                   icon="mdi-format-list-numbers"
                   rounded
                   color="orange"
                   @click="openMainStyleModal('update',props.row.id)">
              <q-tooltip>修改款式信息</q-tooltip>
            </q-btn>
            <q-btn v-if="checkAuth(22)"
                   icon="mdi-image-plus"
                   rounded
                   color="secondary"
                   @click="openImageUpload(props.row.id,props.row.prodStyle,props.row.styleName,props.row.prodType)">
              <q-tooltip>上传产品图片</q-tooltip>
            </q-btn>
            <a v-if="checkAuth(23)"
               :href="api+'/image/style/'+props.row.id+'/'+props.row.image"
               :download="props.row.styleName">
              <q-btn icon="mdi-image-area-close"
                     v-if="props.row.thumbnail!=null"
                     rounded
                     color="tertiary">
                <q-tooltip>下载原图</q-tooltip>
              </q-btn>
            </a>
            <!-- <q-btn icon="mdi-clipboard-arrow-down"
                   rounded
                   color="primary"
                   @click="downloadSpec(props.row.id,props.row.styleName )">
              <q-tooltip>下载产品说明书</q-tooltip>
            </q-btn> -->
            <q-btn v-if="checkAuth(164)"
                   icon="mdi-pencil-box"
                   rounded
                   color="info"
                   @click="openProdLogModal(1,props.row.id)">
              <q-tooltip>查看日志</q-tooltip>
            </q-btn>
            <q-btn v-if="checkAuth(25)"
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
    <!-- search modal -->
    <q-modal v-model="searchFormDialogOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             no-refocus
             :content-css="{maxWidth: '50vw', minHeight: '60vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header"
                   :color="brandColor">
          <q-btn flat
                 round
                 dense
                 v-close-overlay
                 icon="mdi-arrow-left" />
          <q-toolbar-title>
            搜索项
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div style="margin:0 1rem">
              <q-btn v-show="searchBtnExist"
                     color="primary"
                     label="确定"
                     @click="search" />
            </div>
            <div style="margin:0 1rem">
              <q-btn color="primary"
                     label="重置"
                     @click="resetSearchForm" />
            </div>
            <div style="margin:0 1rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row gutter-sm">
            <div class="col-xs-12  col-sm-6 ">
              <q-input v-model.trim="searchForm.prodStyle"
                       class="no-margin"
                       float-label="款号" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-input v-model.trim="searchForm.styleName"
                       class="no-margin"
                       float-label="款名" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-input v-model.trim="searchForm.typeName"
                       class="no-margin"
                       float-label="类别" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-input v-model.trim="searchForm.attrName"
                       class="no-margin"
                       float-label="属性" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-input v-model.trim="searchForm.bigName"
                       class="no-margin"
                       float-label="大类" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-input v-model.trim="searchForm.middleName"
                       class="no-margin"
                       float-label="中类" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-datetime v-model="searchForm.gmtCreateStart"
                          ref="gmtCreateStart"
                          float-label="添加时间大于等于"
                          clearable
                          type="date" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-datetime v-model="searchForm.gmtCreateEnd"
                          ref="gmtCreateEnd"
                          float-label="添加时间小于等于"
                          clearable
                          type="date" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-datetime v-model="searchForm.gmtModifiedStart"
                          ref="gmtModifiedStart"
                          float-label="修改时间大于等于"
                          clearable
                          type="date" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-datetime v-model="searchForm.gmtModifiedEnd"
                          ref="gmtModifiedEnd"
                          float-label="修改时间小于等于"
                          clearable
                          type="date" />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- 新建款式modal -->
    <q-modal v-model="mainStyleModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
             no-refocus
             :content-css="{minWidth: '100vw', minHeight: '100vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header"
                   :color="brandColor">
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
                     :loading="modifyLoading"
                     label="确定"
                     @click="modifyProdStyle" />
            </div>
            <div v-if="modalActionName==='新增产品款式'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     :loading="newLoading"
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
            <div v-show="checkStyleModified(138)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodStyle.$error"
                       error-label="款号是必填项，且不超过10位">
                <q-input v-model.trim="productStyle.prodStyle"
                         class="no-margin"
                         float-label="款号" />
              </q-field>
            </div>
            <div v-show="checkStyleModified(139)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.styleName.$error"
                       error-label="款名是必填项，且不超过30位">
                <q-input v-model.trim="productStyle.styleName"
                         class="no-margin"
                         float-label="款名" />
              </q-field>
            </div>
            <div v-show="checkStyleModified(141)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodFamily.$error"
                       error-label="归属是必填项">
                <q-select v-model="productStyle.prodFamily"
                          float-label="归属"
                          radio
                          :options="prodFamilyOptions" />
              </q-field>
            </div>
            <div v-show="checkStyleModified(142)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodType.$error"
                       error-label="类别是必填项">
                <q-select v-model="productStyle.prodType"
                          float-label="类别"
                          radio
                          :options="prodTypeOptions" />
              </q-field>
            </div>
            <div v-show="checkStyleModified(143)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.bigType.$error"
                       error-label="大类是必填项">
                <q-select v-model="productStyle.bigType"
                          float-label="大类"
                          filter
                          radio
                          :options="bigTypeOptions" />
              </q-field>
            </div>
            <div v-show="checkStyleModified(144)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.middleType"
                        float-label="中类"
                        filter
                        radio
                        :options="middleTypeOptions" />
            </div>
            <div v-show="checkStyleModified(145)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.smallType"
                        float-label="小类"
                        filter
                        radio
                        :options="smallTypeOptions" />
            </div>
            <div v-show="checkStyleModified(140)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodAttr"
                        float-label="属性"
                        filter
                        radio
                        :options="prodAttrOptions" />
            </div>
            <div v-show="checkStyleModified(149)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productStyle.prodMat.$error"
                       error-label="材质信息是不是太长了？">
                <q-input v-model.trim="productStyle.prodMat"
                         class="no-margin"
                         float-label="材质" />
              </q-field>
            </div>
            <div v-show="checkStyleModified(146)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodYear"
                        float-label="年份"
                        filter
                        radio
                        :options="prodYearOptions" />
            </div>
            <div v-show="checkStyleModified(147)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodSeason"
                        float-label="季节"
                        radio
                        :options="prodSeasonOptions" />
            </div>
            <div v-show="checkStyleModified(148)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodUnit"
                        float-label="单位"
                        filter
                        radio
                        :options="prodUnitOptions" />
            </div>
            <div v-show="checkStyleModified(150)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.prodLevel"
                        float-label="档次"
                        radio
                        :options="prodLevelOptions" />
            </div>
            <div v-show="checkStyleModified(151)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="productStyle.designer"
                        float-label="设计师"
                        filter
                        radio
                        :options="designerOptions" />
            </div>
            <div v-show="checkStyleModified(152)"
                 class="col-xs-12  col-sm-12 col-md-12">
              <q-input v-model.trim="productStyle.prodDesc"
                       clearable
                       type="textarea"
                       float-label="产品描述(FAB)"
                       :max-height="300" />
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
    <!-- prodLog -->
    <q-modal v-model="prodLogModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
             no-refocus
             :content-css="{minWidth: '50vw', minHeight: '50vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header"
                   :color="brandColor">
          <q-btn flat
                 round
                 dense
                 v-close-overlay
                 icon="mdi-arrow-left" />
          <q-toolbar-title>
            产品日志
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <q-btn color="primary"
                   v-close-overlay
                   label="取消" />
          </div>
        </q-toolbar>
        <div class="layout-padding"
             style="max-width: 800px">
          <q-timeline style="padding: 0 24px;">
            <q-timeline-entry v-for="log in timelineBeanList"
                              :key="log.id"
                              :title="log.title"
                              :color="log.color"
                              :subtitle="log.subtitle">
              <q-collapsible v-if="checkAuth(165)"
                             indent
                             icon="mdi-camera"
                             label="产品快照">
                <div>{{log.detail}}</div>
              </q-collapsible>
            </q-timeline-entry>
          </q-timeline>
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
import { getProdLogList } from 'src/api/log'

export default {
  data() {
    return {
      api: process.env.API,
      resetBtnExist: false,
      searchBtnExist: false,
      searchFormDialogOpened: false,
      searchForm: {
        page: 0,
        row: 0,
        prodStyle: '',
        styleName: '',
        typeName: '',
        attrName: '',
        bigName: '',
        middleName: '',
        gmtCreateStart: null,
        gmtCreateEnd: null,
        gmtModifiedStart: null,
        gmtModifiedEnd: null
      },
      loading: false,
      modifyLoading: false,
      newLoading: false,
      visibleColumns: [
        'prodStyle',
        'thumbnail',
        'styleName',
        'familyName',
        'typeName',
        'bigName',
        'middleName',
        'smallName',
        'attrName',
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
        { name: 'familyName', label: '产品归属', field: 'familyName' },
        { name: 'typeName', label: '产品类别', field: 'typeName' },
        { name: 'bigName', label: '大类', field: 'bigName' },
        { name: 'middleName', label: '中类', field: 'middleName' },
        { name: 'smallName', label: '小类', field: 'smallName' },
        { name: 'attrName', label: '属性', field: 'attrName' },
        { name: 'prodMat', label: '材质', field: 'prodMat' },
        { name: 'yearName', label: '年份', field: 'yearName' },
        { name: 'seasonName', label: '季节', field: 'seasonName' },
        { name: 'unitName', label: '单位', field: 'unitName' },
        { name: 'levelName', label: '档次', field: 'levelName' },
        { name: 'designerName', label: '设计师', field: 'designerName' },
        { name: 'styleIsSync', label: '是否同步', field: 'styleIsSync' },
        { name: 'gmtCreate', label: '创建时间', field: 'gmtCreate' },
        { name: 'gmtModified', label: '修改时间', field: 'gmtModified' }
      ],
      //main modal
      mainStyleModalOpened: false,
      modalActionName: '',
      //main modal content
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
      imageUploadUrl: '/imageUpload/prodStyle',
      //prodLog
      prodLogModalOpened: false,
      timelineBeanList: []
    }
  },
  validations: {
    productStyle: {
      prodStyle: { required, maxLength: maxLength(10) },
      styleName: { required, maxLength: maxLength(30) },
      prodFamily: { required },
      prodType: { required },
      bigType: { required },
      prodMat: { maxLength: maxLength(20) }
    }
  },
  computed: {
    permissions() {
      return this.$store.getters['user/permissions']
    },
    checkStylePermission() {
      return this.$store.getters['user/checkStylePermission']
    },
    maintainProductPermission() {
      return this.$store.getters['user/maintainProductPermission']
    },
    columnsComputed() {
      let columnsComputed = []
      if (this.permissions.indexOf(1) > -1) {
        columnsComputed = this.columns
      } else {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.checkStylePermission.indexOf(this.columns[i].name) >= 0) {
            columnsComputed.push(this.columns[i])
          }
        }
      }
      return columnsComputed
    },
    brandColor() {
      return this.$store.getters['user/brandColor']
    }
  },
  watch: {
    //control v-show of reset btn
    searchForm: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (
          (newVal.prodStyle != '') |
          (newVal.styleName != '') |
          (newVal.typeName != '') |
          (newVal.attrName != '') |
          (newVal.bigName != '') |
          (newVal.middleName != '') |
          (newVal.gmtCreateStart != null) |
          (newVal.gmtCreateEnd != null) |
          (newVal.gmtModifiedStart != null) |
          (newVal.gmtModifiedEnd != null)
        ) {
          this.searchBtnExist = true
        } else {
          this.searchBtnExist = false
        }
      }
    },
    //reset the prodClass when it changes
    'productStyle.prodFamily': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.bigTypeOptions = []
        this.middleTypeOptions = []
        this.smallTypeOptions = []
        this.productStyle.prodType = ''
        this.productStyle.bigType = ''
        this.productStyle.middleType = ''
        this.productStyle.smallType = ''
        this.prodTypeOptions = this.classList.filter(
          item => item.parentId == newVal
        )
      }
    },
    'productStyle.prodType': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.middleTypeOptions = []
        this.smallTypeOptions = []
        this.productStyle.bigType = ''
        this.productStyle.middleType = ''
        this.productStyle.smallType = ''
        this.bigTypeOptions = this.classList.filter(
          item => item.parentId == newVal
        )
      }
    },
    'productStyle.bigType': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.smallTypeOptions = []
        this.productStyle.middleType = ''
        this.productStyle.smallType = ''
        newVal += ''
        this.middleTypeOptions = this.classList.filter(
          item => item.parentId == newVal
        )
      }
    },
    'productStyle.middleType': function(newVal, oldVal) {
      if (this.mainStyleModalOpened && newVal != '') {
        this.productStyle.smallType = ''
        newVal += ''
        this.smallTypeOptions = this.classList.filter(
          item => item.parentId == newVal
        )
      }
    }
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
    checkStyle(auth) {
      if (this.permissions.indexOf(1) > -1) {
        return true
      }
      if (this.checkStylePermission.indexOf(auth) > -1) {
        return true
      } else {
        return false
      }
    },
    //check if user have right to modify specific element
    checkStyleModified(auth) {
      if (this.permissions.indexOf(1) > -1) {
        return true
      }
      if (
        (this.modalActionName === '新增产品款式') |
        (this.permissions.indexOf(auth) > -1)
      ) {
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
    },
    resetSearchFormAndSearch() {
      this.resetSearchForm()
      this.$nextTick(() => {
        this.search()
        this.resetBtnExist = false
      })
    },
    search() {
      this.searchFormDialogOpened = false
      this.serverPagination.page = 1
      this.request({
        pagination: this.serverPagination
      })
      this.resetBtnExist = true
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
          //check prodType permission
          let pt = productStyle.prodType
          pt += ''
          if (
            this.permissions.indexOf(1) < 0 &&
            this.maintainProductPermission.indexOf(pt) < 0
          ) {
            this.notify('warning', '无权维护该类别产品')
            return
          }
          Object.assign(this.productStyle, productStyle)
          // filter util need string parameter
          let prodFamily = productStyle.prodFamily
          let prodType = productStyle.prodType
          let bigType = productStyle.bigType
          let middleType = productStyle.middleType
          this.prodTypeOptions = this.classList.filter(
            item => item.parentId == prodFamily
          )
          this.bigTypeOptions = this.classList.filter(
            item => item.parentId == prodType
          )
          this.middleTypeOptions = this.classList.filter(
            item => item.parentId == bigType
          )
          this.smallTypeOptions = this.classList.filter(
            item => item.parentId == middleType
          )
          this.$nextTick(() => {
            this.mainStyleModalOpened = true
          })
        })
      }
    },
    //upload image
    openImageUpload(id, prodStyle, styleName, prodType) {
      //check prodType permission
      let pt = prodType
      pt += ''
      if (
        this.permissions.indexOf(1) < 0 &&
        this.maintainProductPermission.indexOf(pt) < 0
      ) {
        this.notify('warning', '无权维护该类别产品')
        return
      }
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
      //check prodType permission
      let pt = this.productStyle.prodType
      pt += ''
      if (
        this.permissions.indexOf(1) < 0 &&
        this.maintainProductPermission.indexOf(pt) < 0
      ) {
        this.notify('warning', '无权维护该类别产品')
        return
      }
      this.$v.productStyle.$touch()
      if (this.$v.productStyle.$invalid) {
        return
      }
      this.$v.productStyle.$reset()
      this.newLoading = true
      this.productStyle.isDel = 0
      //fix
      this.productStyle.isSync = 1
      this.productStyle.status = 1
      this.productStyle.gmtCreate = Date.now()
      addProdStyle(this.productStyle)
        .then(response => {
          let data = response.data
          this.mainStyleModalOpened = false
          this.newLoading = false
          Object.assign(
            this.productStyle,
            this.$options.data.call(this).productStyle
          )
          this.notify('positive', data.msg)
          this.request({
            pagination: this.serverPagination
          })
        })
        .catch(error => {
          this.newLoading = false
        })
    },
    modifyProdStyle() {
      this.$v.productStyle.$touch()
      if (this.$v.productStyle.$invalid) {
        return
      }
      this.$v.productStyle.$reset()
      this.modifyLoading = true
      //fix
      this.productStyle.isSync = 1
      this.productStyle.status = 1
      this.productStyle.gmtCreate = ''
      this.productStyle.gmtModified = ''
      updateProdStyle(this.productStyle)
        .then(response => {
          let data = response.data
          this.mainStyleModalOpened = false
          this.modifyLoading = false
          Object.assign(
            this.productStyle,
            this.$options.data.call(this).productStyle
          )
          this.notify('positive', data.msg)
          this.request({
            pagination: this.serverPagination
          })
        })
        .catch(error => {
          this.modifyLoading = false
        })
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
    // prodLog
    openProdLogModal(type, id) {
      getProdLogList(type, id)
        .then(response => {
          let data = response.data.data
          this.timelineBeanList = data
          this.prodLogModalOpened = true
        })
        .catch(error => {})
    },
    // delete prodStyle
    deleteProdStyle() {
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
      let list = data.filter(item => item.parentId == 0)
      // abandon mat
      for (let i = 0; i < list.length; i++) {
        let id = list[i].value
        if ((id != 267) & (id != 697)) {
          this.prodFamilyOptions.push(list[i])
        }
      }
    })
    getProdParamOptions().then(response => {
      let data = response.data.data
      this.paramList = data
      this.prodAttrOptions = data.filter(item => item.parentId == 606)
      this.prodYearOptions = data.filter(item => item.parentId == 464)
      this.prodSeasonOptions = data.filter(item => item.parentId == 465)
      this.prodUnitOptions = data.filter(item => item.parentId == 458)
      this.prodLevelOptions = data.filter(item => item.parentId == 486)
      this.designerOptions = data.filter(item => item.parentId == 567)
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
