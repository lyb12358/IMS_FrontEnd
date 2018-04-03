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
             :content-css="{minWidth: '100vw', minHeight: '100vh'}">
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
              <q-input v-model="product.name"
                       class="no-margin"
                       float-label="款号" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="product.name"
                       class="no-margin"
                       float-label="款名" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="product.orgLabel"
                       ref="orgInput"
                       readonly=true
                       class="no-margin"
                       float-label="所属部门"
                       :after="[
                          {
                            icon: 'mdi-plus',
                            handler () {
                              orgOpened=true
                            }
                          }
                        ]" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-select v-model="select"
                        float-label="产品属性"
                        radio
                        :options="selectOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="select"
                        float-label="产品类别"
                        radio
                        :options="selectOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="select"
                        float-label="产品所属"
                        radio
                        :options="selectOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="product.name"
                       class="no-margin"
                       float-label="产品材料" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="select"
                        float-label="产品档次"
                        radio
                        :options="selectOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-toggle v-model="checked"
                        label="是否上架" />
            </div>
            <!-- <div class="col-xs-12  col-sm-6 col-md-3">
              <q-uploader :url="url"
                          auto-expand
                          float-label="上传图片" />
            </div> -->
            <div class="col-xs-12  col-sm-12 col-md-12">
              <q-input v-model="area"
                       clearable
                       type="textarea"
                       float-label="产品描述"
                       :max-height="100" />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal v-model="orgOpened">
      <q-tree :nodes="props"
              ref="orgTree"
              color="primary"
              :selected.sync="selected"
              node-key="id" />
      <q-btn color="primary"
             @click="selectOrg"
             label="确定" />
      <q-btn color="primary"
             @click="orgOpened = false"
             label="取消" />
    </q-modal>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    selected: '',
    props: [],
    checked: true,
    area: '',
    select: '',
    addOpened: false,
    orgOpened: false,
    product: {
      orgLabel: '',
      orgId: '',
      password: '',
      name: ''
    },
    selectOptions: [
      {
        label: 'Google',
        value: 'goog'
      },
      {
        label: 'Facebook',
        value: 'fb'
      }
    ]
  }),
  methods: {
    selectOrg() {
      this.product.orgId = this.$refs.orgTree.getNodeByKey(this.selected).orgId
      this.product.orgLabel = this.$refs.orgTree.getNodeByKey(
        this.selected
      ).label
      this.orgOpened = false
      this.$refs.orgInput.focus()
      this.$refs.orgInput.blur()
    }
  },
  mounted() {
    this.$axios
      .get('/api/getOrgList')
      .then(({ data }) => {
        this.props.push(data[0])
        this.$nextTick(() => {
          this.$refs.orgTree.expandAll()
        })
      })
      .catch(error => {})
  }
}
</script>

<style>

</style>
