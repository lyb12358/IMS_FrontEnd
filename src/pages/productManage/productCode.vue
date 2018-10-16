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
        <q-btn v-if="checkAuth(18)"
               :loading="excelLoading"
               label="导出"
               rounded
               icon="mdi-file-excel"
               color="tertiary"
               @click="downloadExcel">
        </q-btn>
        <q-btn icon="mdi-new-box"
               v-if="checkAuth(12)"
               label="新建"
               rounded
               color="primary"
               @click="openChooseStyleDialog">
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
          <q-td v-if="checkCode('codeThumbnail')"
                key="codeThumbnail"
                :props="props"
                style="text-align:center">
            <img :src="thumbnailCheck(props.row.id,props.row.styleId,props.row.codeThumbnail,props.row.styleThumbnail)"
                 style="height: 80px; width: 140px;"></q-td>
          <q-td v-if="checkCode('prodName')"
                key="prodName"
                :props="props"
                style="text-align:center">{{ props.row.prodName }}</q-td>
          <q-td v-if="checkCode('catName')"
                key="catName"
                :props="props"
                style="text-align:center">{{ props.row.catName }}</q-td>
          <q-td v-if="checkCode('prodStyle')"
                key="prodStyle"
                :props="props"
                style="text-align:center">{{ props.row.prodStyle }}</q-td>
          <q-td v-if="checkCode('familyName')"
                key="familyName"
                :props="props"
                style="text-align:center">{{ props.row.familyName }}</q-td>
          <q-td v-if="checkCode('typeName')"
                key="typeName"
                :props="props"
                style="text-align:center">{{ props.row.typeName }}</q-td>
          <q-td v-if="checkCode('bigName')"
                key="bigName"
                :props="props"
                style="text-align:center">{{ props.row.bigName }}</q-td>
          <q-td v-if="checkCode('middleName')"
                key="middleName"
                :props="props"
                style="text-align:center">{{ props.row.middleName }}</q-td>
          <q-td v-if="checkCode('smallName')"
                key="smallName"
                :props="props"
                style="text-align:center">{{ props.row.smallName }}</q-td>
          <q-td v-if="checkCode('attrName')"
                key="attrName"
                :props="props"
                style="text-align:center">{{ props.row.attrName}}</q-td>
          <q-td v-if="checkCode('speName')"
                key="speName"
                :props="props"
                style="text-align:center">{{ props.row.speName }}</q-td>
          <q-td v-if="checkCode('colorName')"
                key="colorName"
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
          <q-td v-if="checkCode('numModel')"
                key="numModel"
                :props="props"
                style="text-align:center">{{ props.row.numModel }}
          </q-td>
          <q-td v-if="checkCode('netWeight')"
                key="netWeight"
                :props="props"
                style="text-align:center">{{ props.row.netWeight }}
          </q-td>
          <q-td v-if="checkCode('boxNum')"
                key="boxNum"
                :props="props"
                style="text-align:center">{{ props.row.boxNum }}
          </q-td>
          <q-td v-if="checkCode('boxModel')"
                key="boxModel"
                :props="props"
                style="text-align:center">{{ props.row.boxModel }}
          </q-td>
          <q-td v-if="checkCode('boxVolume')"
                key="boxVolume"
                :props="props"
                style="text-align:center">{{ props.row.boxVolume }}
          </q-td>
          <q-td v-if="checkCode('boxWeight')"
                key="boxWeight"
                :props="props"
                style="text-align:center">{{ props.row.boxWeight }}
          </q-td>
          <q-td v-if="checkCode('boxWarn')"
                key="boxWarn"
                :props="props"
                style="text-align:center">{{ props.row.boxWarn }}
          </q-td>
          <q-td v-if="checkCode('isRemind')"
                key="isRemind"
                :props="props"
                style="text-align:center">{{ props.row.isRemind?'是':'否' }}
          </q-td>
          <q-td v-if="checkCode('isSecurity')"
                key="isSecurity"
                :props="props"
                style="text-align:center">{{ props.row.isSecurity?'是':'否' }}
          </q-td>
          <q-td v-if="checkCode('isRate')"
                key="isRate"
                :props="props"
                style="text-align:center">{{ props.row.isRate?'是':'否' }}
          </q-td>
          <q-td v-if="checkCode('prodCycle')"
                key="prodCycle"
                :props="props"
                style="text-align:center">{{ props.row.prodCycle }}
          </q-td>
          <q-td v-if="checkCode('tRetailPrice')"
                key="tRetailPrice"
                :props="props"
                style="text-align:center">{{ props.row.tRetailPrice }}
          </q-td>
          <q-td v-if="checkCode('tSupplyPrice')"
                key="tSupplyPrice"
                :props="props"
                style="text-align:center">{{ props.row.tSupplyPrice }}
          </q-td>
          <q-td v-if="checkCode('tCostPrice')"
                key="tCostPrice"
                :props="props"
                style="text-align:center">{{ props.row.tCostPrice }}
          </q-td>
          <q-td v-if="checkCode('yearName')"
                key="yearName"
                :props="props"
                style="text-align:center">{{ props.row.yearName }}
          </q-td>
          <q-td v-if="checkCode('seasonName')"
                key="seasonName"
                :props="props"
                style="text-align:center">{{ props.row.seasonName }}
          </q-td>
          <q-td v-if="checkCode('unitName')"
                key="unitName"
                :props="props"
                style="text-align:center">{{ props.row.unitName }}
          </q-td>
          <q-td v-if="checkCode('prodMat')"
                key="prodMat"
                :props="props"
                style="text-align:center">{{ props.row.prodMat }}
          </q-td>
          <q-td v-if="checkCode('levelName')"
                key="levelName"
                :props="props"
                style="text-align:center">{{ props.row.levelName }}
          </q-td>
          <q-td v-if="checkCode('designerName')"
                key="designerName"
                :props="props"
                style="text-align:center">{{ props.row.designerName }}
          </q-td>

          <q-td v-if="checkCode('codeIsSync')"
                key="codeIsSync"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.codeIsSync?'mdi-check-circle':'mdi-sync-off'"
                    size="1.5rem"
                    :color="props.row.codeIsSync?'positive':'negative'" />
          </q-td>
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
                   @click="openImageUpload(props.row.id,props.row.prodCode,props.row.prodName,props.row.prodType)">
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
            <q-btn v-if="checkAuth(162)"
                   icon="mdi-pencil-box"
                   rounded
                   color="info"
                   @click="openProdLogModal(2,props.row.id)">
              <q-tooltip>查看日志</q-tooltip>
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
    <!-- search modal -->
    <q-modal v-model="searchFormDialogOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             no-refocus
             :content-css="{maxWidth: '50vw', minHeight: '60vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header" :color="brandColor">
          <q-btn flat
                 round
                 dense
                 v-close-overlay
                 icon="mdi-arrow-left" />
          <q-toolbar-title>
            搜索项（请注意，搜索项的值同样会对导出生效）
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
              <q-input v-model.trim="searchForm.prodCode"
                       class="no-margin"
                       float-label="编号" />
            </div>
            <div class="col-xs-12 col-sm-6 ">
              <q-input v-model.trim="searchForm.prodName"
                       class="no-margin"
                       float-label="名称" />
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
        <q-toolbar slot="header" :color="brandColor">
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
                     :loading="modifyLoading"
                     label="确定"
                     @click="modifyProdCode" />
            </div>
            <div v-if="modalActionName==='新增产品信息'"
                 style="margin:0 2rem">
              <q-btn color="primary"
                     :loading="newLoading"
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
            <div v-show="checkCodeModified(94)"
                 class="col-xs-12  col-sm-6 col-md-3">
              <q-field :error="$v.productCode.prodCode.$error"
                       error-label="编号必填，且不超过20位">
                <q-input v-model="productCode.prodCode"
                         :readonly="modalActionName==='修改产品信息'?true:false"
                         class="no-margin"
                         float-label="编号" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(95)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.prodName.$error"
                       error-label="名称必填，且不超过30位">
                <q-input v-model="productCode.prodName"
                         class="no-margin"
                         float-label="名称" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(96)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="productCode.prodCat"
                        float-label="品类"
                        filter
                        radio
                        :options="prodCatOptions" />
            </div>
            <div v-show="checkCodeModified(97)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="productCode.prodSpe"
                        float-label="规格"
                        filter
                        radio
                        :options="prodSpeOptions" />
            </div>
            <div v-show="checkCodeModified(98)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.retailPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.retailPrice"
                         class="no-margin"
                         float-label="零售价" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(99)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.supplyPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.supplyPrice"
                         class="no-margin"
                         float-label="供应价" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(100)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.costPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.costPrice"
                         class="no-margin"
                         float-label="成本价" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(101)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="productCode.prodColor"
                        float-label="花色"
                        filter
                        radio
                        :options="prodColorOptions" />
            </div>
            <div v-show="checkCodeModified(102)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.numModel.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.numModel"
                         class="no-margin"
                         float-label="件数" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(103)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.netWeight"
                       class="no-margin"
                       float-label="克重" />
            </div>
            <div v-show="checkCodeModified(104)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.boxNum.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.boxNum"
                         class="no-margin"
                         float-label="装箱数" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(105)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.boxModel"
                       class="no-margin"
                       float-label="装箱规格" />
            </div>
            <div v-show="checkCodeModified(106)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.boxVolume"
                       class="no-margin"
                       float-label="装箱体积" />
            </div>
            <div v-show="checkCodeModified(107)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="productCode.boxWeight"
                       class="no-margin"
                       float-label="箱重量" />
            </div>
            <div v-show="checkCodeModified(108)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.boxWarn.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.boxWarn"
                         class="no-margin"
                         float-label="散货预警量" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(113)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.prodCycle.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.prodCycle"
                         class="no-margin"
                         float-label="生产周期" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(114)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.tRetailPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.tRetailPrice"
                         class="no-margin"
                         float-label="三等品零售价" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(115)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.tSupplyPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.tSupplyPrice"
                         class="no-margin"
                         float-label="三等品供应价" />
              </q-field>
            </div>
            <div v-show="checkCodeModified(116)"
                 class="col-xs-12 col-sm-6 col-md-3">
              <q-field :error="$v.productCode.tCostPrice.$error"
                       error-label="请填写有效值">
                <q-input v-model="productCode.tCostPrice"
                         class="no-margin"
                         float-label="三等品成本价" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-toggle v-show="checkCodeModified(109)"
                        v-model="productCode.isRemind"
                        label="是否库存提醒" />
              <q-toggle v-show="checkCodeModified(111)"
                        v-model="productCode.isSecurity"
                        label="是否有防伪码" />
              <q-toggle v-show="checkCodeModified(112)"
                        v-model="productCode.isRate"
                        label="是否计算周转率" />
            </div>
            <div v-show="checkCodeModified(110)"
                 class="col-xs-12  col-sm-12 col-md-12">
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
    <!-- prodLog -->
    <q-modal v-model="prodLogModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
             no-refocus
             :content-css="{minWidth: '50vw', minHeight: '50vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header" :color="brandColor">
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
              <q-collapsible v-if="checkAuth(163)"
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
import { specDownload, codeExport } from 'src/api/productPlus'
import { getProdLogList } from 'src/api/log'
//custom validate
//const validDecimal = value => value.toString().split('.')[1].length <= 2
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
        prodCode: '',
        prodName: '',
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
      excelLoading: false,
      modifyLoading: false,
      newLoading: false,
      visibleColumns: [
        'prodCode',
        'codeThumbnail',
        'prodName',
        'catName',
        'speName',
        'typeName',
        'middleName',
        'smallName',
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
        { name: 'codeThumbnail', label: '简图', field: 'codeThumbnail' },
        { name: 'prodName', label: '产品名称', field: 'prodName' },
        { name: 'catName', label: '品类', field: 'catName' },
        { name: 'prodStyle', label: '款号', field: 'prodStyle' },
        { name: 'familyName', label: '产品归属', field: 'familyName' },
        { name: 'typeName', label: '产品类别', field: 'typeName' },
        { name: 'bigName', label: '大类', field: 'bigName' },
        { name: 'middleName', label: '中类', field: 'middleName' },
        { name: 'smallName', label: '小类', field: 'smallName' },
        { name: 'attrName', label: '属性', field: 'attrName' },
        { name: 'speName', label: '规格', field: 'speName' },
        { name: 'colorName', label: '花色', field: 'colorName' },
        { name: 'retailPrice', label: '零售价', field: 'retailPrice' },
        { name: 'supplyPrice', label: '供应价', field: 'supplyPrice' },
        { name: 'costPrice', label: '成本价', field: 'costPrice' },
        { name: 'numModel', label: '件数', field: 'numModel' },
        { name: 'boxNum', label: '装箱数', field: 'boxNum' },
        { name: 'boxModel', label: '装箱规格', field: 'boxModel' },
        { name: 'boxVolume', label: '装箱体积', field: 'boxVolume' },
        { name: 'boxWeight', label: '箱重量', field: 'boxWeight' },
        { name: 'boxWarn', label: '散货预警量', field: 'boxWarn' },
        { name: 'isRemind', label: '库存提醒', field: 'isRemind' },
        { name: 'isSecurity', label: '是否防伪码', field: 'isSecurity' },
        { name: 'isRate', label: '计算周转率', field: 'isRate' },
        { name: 'prodCycle', label: '生产周期(天)', field: 'prodCycle' },
        { name: 'tRetailPrice', label: '三等品零售价', field: 'tRetailPrice' },
        { name: 'tSupplyPrice', label: '三等品供应价', field: 'tSupplyPrice' },
        { name: 'tCostPrice', label: '三等品成本价', field: 'tCostPrice' },
        { name: 'yearName', label: '年份', field: 'yearName' },
        { name: 'seasonName', label: '季节', field: 'seasonName' },
        { name: 'unitName', label: '单位', field: 'unitName' },
        { name: 'prodMat', label: '材质', field: 'prodMat' },
        { name: 'levelName', label: '档次', field: 'levelName' },
        { name: 'designerName', label: '设计师', field: 'designerName' },
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
      imageUploadUrl: '/imageUpload/prodCode',
      //prodLog
      prodLogModalOpened: false,
      timelineBeanList: []
    }
  },
  validations: {
    productCode: {
      prodCode: { required, maxLength: maxLength(20) },
      prodName: { required, maxLength: maxLength(30) },
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
    },
    columnsComputed() {
      let columnsComputed = []
      if (this.permissions.indexOf(1) > -1) {
        columnsComputed = this.columns
      } else {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.checkCodePermission.indexOf(this.columns[i].name) >= 0) {
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
          (newVal.prodCode != '') |
          (newVal.prodName != '') |
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
    //check if user have right to modify specific element
    checkCodeModified(auth) {
      if (this.permissions.indexOf(1) > -1) {
        return true
      }
      if (
        (this.modalActionName === '新增产品信息') |
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
        let productStyle = response.data.data
        //check prodType permission
        let pt = productStyle.prodType
        pt += ''
        if (
          this.permissions.indexOf(1) < 0 &&
          this.maintainProductPermission.indexOf(pt) < 0
        ) {
          this.notify('warning', '无权维护该类别产品')
          return false
        }
        Object.assign(
          this.productCode,
          this.$options.data.call(this).productCode
        )
        Object.assign(
          this.productStyle,
          this.$options.data.call(this).productStyle
        )
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
      let pt = this.productStyle.prodType
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
      this.newLoading = true
      this.productCode.isDel = 0
      this.productCode.status = 1
      //fix
      this.productCode.isSync = 1
      this.productCode.gmtCreate = Date.now()
      addProdCode(this.productCode)
        .then(response => {
          this.mainCodeModalOpened = false
          this.newLoading = false
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
        .catch(error => {
          this.newLoading = false
        })
    },
    modifyProdCode() {
      this.$v.productCode.$touch()
      if (this.$v.productCode.$invalid) {
        return
      }
      this.$v.productCode.$reset()
      this.modifyLoading = true
      //fix
      this.productCode.isSync = 1
      this.productCode.status = 1
      this.productCode.gmtCreate = ''
      this.productCode.gmtModified = ''
      updateProdCode(this.productCode)
        .then(response => {
          this.mainCodeModalOpened = false
          this.modifyLoading = false
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
        .catch(error => {
          this.modifyLoading = false
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
    openImageUpload(id, prodCode, prodName, prodType) {
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
      if (!this.searchBtnExist) {
        this.notify('warning', '搜索项没有输入，不允许导出操作！')
        return
      }
      this.excelLoading = true
      codeExport(this.searchForm)
        .then(response => {
          this.fileDownload(
            response.data,
            '产品编号导出' + this.formatDate(Date.now()) + '.xls'
          )
          this.excelLoading = false
        })
        .catch(error => {
          this.excelLoading = false
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
