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
               @click="addOpened=true">
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
                :props="props">{{ props.row.departId }}</q-td>
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
                :props="props">{{ props.row.prodFamily }}</q-td>
          <q-td key="prodClass"
                :props="props">{{ props.row.prodClass }}</q-td>
          <q-td key="prodProp"
                :props="props">{{ props.row.prodProp }}</q-td>
          <q-td key="prodMat"
                :props="props">{{ props.row.prodMat }}</q-td>
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
                   @click="showExpand(props.row.styleName )">
              <q-tooltip>款式信息</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-image-plus"
                   rounded
                   color="secondary"
                   @click="openImageUpload(props.row.id,props.row.prodStyle,props.row.styleName )">
              <q-tooltip>上传产品图片</q-tooltip>
            </q-btn>
            <a :href="'api/image/'+props.row.id+'/'+props.row.image"
               :download="props.row.styleName">
              <q-btn icon="mdi-image-area-close"
                     v-if="props.row.thumbnail!=null"
                     rounded
                     color="tertiary">
                <q-tooltip>下载原图</q-tooltip>
              </q-btn>
            </a>
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
    <q-modal v-model="addOpened"
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
            新增产品
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     label="确定"
                     @click="addProdStyle" />
            </div>
            <div style="margin:0 2rem">
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
    <q-modal v-model="departOpened">
      <q-tree :nodes="departProps"
              ref="departTree"
              color="primary"
              :selected.sync="departSelected"
              node-key="id" />
      <q-btn color="primary"
             @click="selectDepart"
             label="确定" />
      <q-btn color="primary"
             @click="departOpened = false"
             label="取消" />
    </q-modal>
    <!-- select prodClass -->
    <q-modal v-model="classOpened">
      <q-tree :nodes="classProps"
              ref="classTree"
              color="primary"
              :selected.sync="classSelected"
              node-key="id" />
      <q-btn color="primary"
             @click="selectClass"
             label="确定" />
      <q-btn color="primary"
             @click="classOpened = false"
             label="取消" />
    </q-modal>
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
        'prodCode',
        'styleName',
        'prodSize',
        'status'
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
          name: 'prodDesc',
          align: 'left',
          label: '产品描述',
          field: 'prodDesc'
        },
        { name: 'status', align: 'left', label: '状态', field: 'status' }
      ],
      //modal
      departSelected: '',
      departProps: [],
      classSelected: '',
      classProps: [],
      addOpened: false,
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
      imageUploadUrl: 'api/pic/upload'
    }
  },
  watch:{
    'product.prodFamily':function(){
      this.product.prodClass=''
      this.product.classLabel=''
    }
  },
  methods: {
    showExpand(x) {
      console.log(x)
    },
    showInfo() {
      console.log(this.searchForm)
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
    //产品添加modal
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
        this.$axios
          .get('/api/prodClasses', {
            params: {
              familyId: this.product.prodFamily
            }
          })
          .then(({ data }) => {
            this.classProps = data
            this.classOpened = true
          })
          .catch(error => {})
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
        return 'api/image/' + id + '/' + thumbnail
      } else {
        return 'statics/sad.svg'
      }
    },
    addProdStyle() {
      this.$axios
        .post('/api/prodStyles', this.product)
        .then(({ data }) => {
          if (data.result === 'success') {
            this.addOpened = false
            Object.assign(this.product, this.$options.data.call(this).product)
            this.notify('positive', '产品款式添加成功')
          } else {
            this.notify('negative', result.info)
          }
        })
        .catch(error => {})
    },
    resetModal() {
      Object.assign(this.product, this.$options.data.call(this).product)
    },
    //表格数据请求
    request({ pagination }) {
      this.loading = true
      this.$axios
        .get('/api/prodStyles', {
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
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination
    })
    //产品几个参数的请求
    this.$axios
      .get('/api/orgs')
      .then(({ data }) => {
        this.departProps.push(data[0])
        this.$nextTick(() => {
          this.$refs.departTree.expandAll()
        })
      })
      .catch(error => {})
    this.$axios
      .get('/api/prodFamilys')
      .then(({ data }) => {
        this.familyOptions = data
      })
      .catch(error => {})
    this.$axios
      .get('/api/prodProps')
      .then(({ data }) => {
        this.propOptions = data
      })
      .catch(error => {})
    this.$axios
      .get('/api/prodLevels')
      .then(({ data }) => {
        this.levelOptions = data
      })
      .catch(error => {})
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
