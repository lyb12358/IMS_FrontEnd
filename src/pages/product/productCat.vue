<template>
  <q-page padding>
    <div>
      <q-btn icon="mdi-new-box"
             rounded
             class="q-ma-xs"
             color="primary"
             @click="addOpened=true">
        <q-tooltip>新建</q-tooltip>
      </q-btn>
    </div>
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
                     v-close-overlay
                     label="Close" />
            </div>
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="Close" />
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
              <q-input v-model="product.classLabel"
                       ref="classInput"
                       readonly
                       @focus="openClassModal()"
                       class="no-margin"
                       float-label="产品类别" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="product.prodFamily"
                        float-label="产品所属"
                        radio
                        :options="familyOptions" />
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
            <!-- <div class="col-xs-12  col-sm-6 col-md-3">
              <q-uploader :url="url"
                          auto-expand
                          float-label="上传图片" />
            </div> -->
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
  </q-page>
</template>

<script>
export default {
  data: () => ({
    departSelected: '',
    departProps: [],
    classSelected: '',
    classProps: [],
    addOpened: false,
    departOpened: false,
    classOpened: false,
    product: {
      departLabel: '',
      departId: '',
      classLabel: '',
      prodClass: '',
      styleName: '',
      prodStyle: '',
      prodFamily: '',
      prodProp: '',
      prodDesc: '',
      status: true
    },
    familyOptions: [],
    propOptions: [],
    levelOptions: []
  }),
  methods: {
    warning(x) {
      this.$q.notify({
        message: x,
        color: 'warning',
        position: 'bottom-right',
        avatar: 'statics/logo/xiuxian.jpg'
      })
    },
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
    openClassModal() {
      if (this.product.prodFamily != '') {
        this.$axios
          .get('/api/getProdClassList', {
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
        this.warning('请先选择产品所属')
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
    }
  },
  mounted() {
    this.$axios
      .get('/api/getOrgList')
      .then(({ data }) => {
        this.departProps.push(data[0])
        this.$nextTick(() => {
          this.$refs.departTree.expandAll()
        })
      })
      .catch(error => {})
    this.$axios
      .get('/api/getProdFamilyList')
      .then(({ data }) => {
        this.familyOptions = data
      })
      .catch(error => {})
    this.$axios
      .get('/api/getProdPropList')
      .then(({ data }) => {
        this.propOptions = data
      })
      .catch(error => {})
    this.$axios
      .get('/api/getProdLevelList')
      .then(({ data }) => {
        this.levelOptions = data
      })
      .catch(error => {})
  }
}
</script>

<style>

</style>
