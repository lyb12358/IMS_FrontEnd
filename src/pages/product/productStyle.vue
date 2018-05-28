<template>
  <q-page padding>
    <!-- 数据表格 -->
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
               @click="openMainModal('add',0)">
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
        <q-th v-for="col in props.cols"
              :key="col.name"
              :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
      <template slot="body"
                slot-scope="props">
        <q-tr :props="props">
          <q-td key="thumbnail"
                :props="props">
            <img :src="thumbnailCheck(props.row.id,props.row.thumbnail)"
                 style="height: 80px; width: 140px;"></q-td>
          <!-- <q-td key="id"
                :props="props">{{ props.row.id }}</q-td> -->
          <q-td key="departId"
                :props="props">{{ props.row.departLabel}}</q-td>
          <q-td key="comId"
                :props="props">{{ props.row.comId }}</q-td>
          <q-td key="prodStyle"
                :props="props">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" /> {{ props.row.prodStyle }}
          </q-td>
          <q-td key="styleName"
                :props="props">{{ props.row.styleName }}</q-td>
          <q-td key="prodFamily"
                :props="props">{{ props.row.familyLabel }}</q-td>
          <q-td key="prodClass"
                :props="props">{{ props.row.classLabel }}</q-td>
          <q-td key="prodProp"
                :props="props">{{ props.row.propLabel }}</q-td>
          <q-td key="prodMat"
                :props="props">{{ props.row.prodMat }}</q-td>
          <q-td key="prodLevel"
                :props="props">{{ props.row.levelLabel }}</q-td>
          <q-td key="prodDesc"
                :props="props">{{ props.row.prodDesc }}</q-td>
          <q-td key="image"
                :props="props">{{ props.row.image }}</q-td>
          <q-td key="status"
                :props="props">{{ props.row.status }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <q-btn icon="mdi-format-list-numbers"
                   rounded
                   color="primary"
                   @click="openMainModal('update',props.row.id)">
              <q-tooltip>修改款式信息</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-image-plus"
                   rounded
                   color="secondary"
                   @click="openImageUpload(props.row.id,props.row.prodStyle,props.row.styleName )">
              <q-tooltip>上传产品图片</q-tooltip>
            </q-btn>
            <a :href="'/image/'+props.row.id+'/'+props.row.image"
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
            <q-btn icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="showExpand(props.row.styleName )">
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
    <q-modal v-model="mainModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
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
            <div v-if="modalActionName==='更新产品款式'"
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
                     @click="resetModal" />
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
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="product.prodStyle"
                       class="no-margin"
                       float-label="款号" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="product.styleName"
                       class="no-margin"
                       float-label="款名" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="product.departLabel"
                       ref="departInput"
                       readonly
                       @focus="departOpened=true"
                       class="no-margin"
                       float-label="所属部门" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="product.prodProp"
                        float-label="产品属性"
                        radio
                        :options="propOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="product.prodFamily"
                        float-label="产品所属"
                        radio
                        :options="familyOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="product.classLabel"
                       ref="classInput"
                       readonly
                       @focus="openClassDialog()"
                       class="no-margin"
                       float-label="产品类别" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="product.prodMat"
                       class="no-margin"
                       float-label="产品材料" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="product.prodLevel"
                        float-label="产品档次"
                        radio
                        :options="levelOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-toggle v-model="product.status"
                        label="是否上架" />
            </div>
            <div class="col-xs-12  col-sm-12 col-md-12">
              <q-input v-model="product.prodDesc"
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
    <q-dialog v-model="departOpened"
              prevent-close>
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
    </q-dialog>
    <!-- select prodClass -->
    <q-dialog v-model="classOpened"
              prevent-close>
      <span slot="title">选择产品类别</span>
      <div slot="body">
        <q-tree :nodes="classProps"
                ref="classTree"
                color="primary"
                :selected.sync="classSelected"
                node-key="id" />
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn color="primary"
               @click="selectClass"
               label="确定" />
        <q-btn color="primary"
               @click="classOpened = false"
               label="取消" />
      </template>
    </q-dialog>
    <!-- upload image -->
    <q-dialog v-model="imageUploadDialog"
              prevent-close>
      <span slot="title">上传产品图片</span>
      <span slot="message">点击"+"，选择清晰度较高的图片，将作为本产品主要图片展示</span>
      <div slot="body">
        <q-uploader ref="imageUpload"
                    :url="imageUploadUrl"
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
import { getOrgList } from 'src/api/organization'
import {
  getProdStyleList,
  getProdStyleById,
  addProdStyle,
  updateProdStyle,
  specDownload,
  getProdFamilyList,
  getProdClassList,
  getProdPropList,
  getProdLevelList
} from 'src/api/product'

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
        'thumbnail',
        'prodStyle',
        'prodFamily',
        'prodClass',
        'prodLevel',
        'styleName',
        'prodProp'
      ],
      separator: 'horizontal',
      serverPagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 5 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        { name: 'thumbnail', align: 'left', label: '简图', field: 'thumbnail' },
        {
          name: 'departId',
          align: 'left',
          label: '所属部门',
          field: 'departId'
        },
        { name: 'comId', align: 'left', label: '所属公司', field: 'comId' },
        { name: 'prodStyle', align: 'left', label: '款号', field: 'prodStyle' },
        {
          name: 'styleName',
          align: 'left',
          label: '产品名称',
          field: 'styleName'
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
          label: '产品类别',
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
        {
          name: 'prodDesc',
          align: 'left',
          label: '产品描述',
          field: 'prodDesc'
        },
        { name: 'status', align: 'left', label: '状态', field: 'status' }
      ],
      //modal
      mainModalOpened: false,
      modalActionName: '',
      //modal content
      departSelected: '',
      departProps: [],
      classSelected: '',
      classProps: [],
      departOpened: false,
      classOpened: false,
      product: {
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
      familyOptions: [],
      propOptions: [],
      levelOptions: [],
      //upload image
      expandId: 0,
      expandStyle: '',
      expandName: '',
      imageUploadDialog: false,
      imageUploadUrl: '/pic/upload'
    }
  },
  watch: {
    //reset prodClass when prodFamily change
    'product.prodFamily': function() {
      this.product.prodClass = ''
      this.product.classLabel = ''
    }
  },
  methods: {
    showExpand(x) {
      console.log(x)
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
    openMainModal(action, id) {
      if (action === 'add') {
        this.modalActionName = '新增产品款式'
        this.mainModalOpened = true
      } else if (action === 'update') {
        this.modalActionName = '更新产品款式'
        getProdStyleById(id)
          .then(response => {
            let product = response.data
            if (product.status == 1) {
              product.status = true
            } else {
              product.status = false
            }
            Object.assign(this.product, product)
            this.$nextTick(() => {
              this.product.classLabel = product.classLabel
              this.product.prodClass = product.prodClass
              this.mainModalOpened = true
            })
          })
      }
    },
    //add product
    selectDepart() {
      this.product.departId = this.$refs.departTree.getNodeByKey(
        this.departSelected
      ).id
      this.product.departLabel = this.$refs.departTree.getNodeByKey(
        this.departSelected
      ).label
      this.departOpened = false
      this.$refs.departInput.blur()
    },
    openClassDialog() {
      if (this.product.prodFamily != '') {
        getProdClassList(this.product.prodFamily).then(response => {
          let data = response.data.data
          this.classProps = data
          this.classOpened = true
        })
      } else {
        this.notify('warning', '请先选择产品所属')
      }
    },
    selectClass() {
      this.product.prodClass = this.$refs.classTree.getNodeByKey(
        this.classSelected
      ).id
      this.product.classLabel = this.$refs.classTree.getNodeByKey(
        this.classSelected
      ).label
      this.classOpened = false
      this.$refs.classInput.blur()
    },
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
      this.notify('positive', '上传成功')
      this.$refs.imageUpload.reset()
      this.imageUploadDialog = false
    },
    // when it has encountered error while uploading
    imageUploadedFail(file, xhr) {
      let response = JSON.parse(xhr.response)
      this.notify('negative', response.info)
    },
    //check thumbnail
    thumbnailCheck(id, thumbnail) {
      if (!(thumbnail === null)) {
        return process.env.API + '/image/' + id + '/' + thumbnail
      } else {
        return 'statics/sad.svg'
      }
    },
    newProdStyle() {
      addProdStyle(this.product).then(response => {
        let data = response.data.data
        this.mainModalOpened = false
        Object.assign(this.product, this.$options.data.call(this).product)
        this.notify('positive', data.msg)
      })
    },
    modifyProdStyle() {
      updateProdStyle(this.product).then(response => {
        let data = response.data.data
        this.mainModalOpened = false
        Object.assign(this.product, this.$options.data.call(this).product)
        this.notify('positive', data.msg)
      })
    },
    resetModal() {
      Object.assign(this.product, this.$options.data.call(this).product)
    },
    //download specification
    downloadSpec(id, name) {
      specDownload().then(response => {
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
    //表格数据请求
    request({ pagination }) {
      this.loading = true
      let page = pagination.page
      let row = pagination.rowsPerPage
      getProdStyleList(page, row)
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
    getOrgList().then(response => {
      let data = response.data.data
      this.departProps.push(data[0])
      this.$nextTick(() => {
        this.$refs.departTree.expandAll()
      })
    })
    getProdFamilyList().then(response => {
      this.familyOptions = response.data.data
    })
    getProdPropList().then(response => {
      this.propOptions = response.data.data
    })
    getProdLevelList().then(response => {
      this.levelOptions = response.data.data
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
