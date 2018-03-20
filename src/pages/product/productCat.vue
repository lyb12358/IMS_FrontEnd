<template>
  <q-page padding>
    <div class="row justify-center">
      <div>
        <div class="q-mb-sm">
          <q-btn size="sm"
                 color="primary"
                 @click="selectGoodService"
                 label="Select 'Good service'" />
          <q-btn v-if="selected"
                 size="sm"
                 color="red"
                 @click="unselectNode"
                 label="Unselect node" />
        </div>
        <q-tree :nodes="props"
                default-expand-all
                ref="tree"
                :selected.sync="selected"
                node-key="label" />

      </div>
    </div>
    <div>
      <q-btn icon="mdi-new-box"
             rounded
             class="q-ma-xs"
             color="primary"
             @click="opened=true">
        <q-tooltip>新建2</q-tooltip>
      </q-btn>
    </div>
    <q-modal v-model="opened"
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
                   transparent
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
              <q-input v-model="user.name"
                       class="no-margin"
                       float-label="款号" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="user.name"
                       class="no-margin"
                       float-label="款名" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="select"
                        float-label="公司"
                        radio
                        :options="selectOptions" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-select v-model="select"
                        float-label="部门"
                        radio
                        :options="selectOptions" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input v-model="user.name"
                       class="no-margin"
                       float-label="产品所属" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="user.name"
                       class="no-margin"
                       float-label="产品类别" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="user.name"
                       class="no-margin"
                       float-label="产品属性" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input v-model="user.name"
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
              <q-input v-model="select"
                       class="no-margin"
                       float-label="产品描述" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-toggle v-model="checked"
                        label="是否上架" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-uploader :url="url"
                          auto-expand
                          float-label="上传图片" />
            </div>
            <div class="col-xs-12  col-sm-12 col-md-6">
              <q-input v-model="area"
                       clearable
                       type="textarea"
                       float-label="Textarea"
                       :max-height="100" />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    checked: true,
    area: '',
    multipleSelect: '',
    select: '',
    selectOptions: [
      {
        label: 'Google',
        value: 'goog'
      },
      {
        label: 'Facebook',
        value: 'fb'
      }
    ],
    selected: null,
    props: [
      {
        label: 'Satisfied customers',
        children: [
          {
            label: 'Good food',
            children: [
              { label: 'Quality ingredients' },
              { label: 'Good recipe' }
            ]
          },
          {
            label: 'Good service',
            children: [
              { label: 'Prompt attention' },
              { label: 'Professional waiter' }
            ]
          },
          {
            label: 'Pleasant surroundings',
            children: [
              {
                label: 'Happy atmosphere'
              },
              {
                label: 'Good table presentation'
              },
              {
                label: 'Pleasing decor'
              }
            ]
          }
        ]
      }
    ],
    opened: false,
    user: {
      password: '',
      name: ''
    }
  }),
  methods: {
    selectGoodService() {
      if (this.selected !== 'Good service') {
        this.selected = 'Good service'
      }
    },
    unselectNode() {
      this.selected = null
    }
  },
  computed: {
    xx() {
      if (null != this.selected) {
        console.log(this.$refs.tree.getNodeByKey(this.selected).label)
        return this.$refs.tree.getNodeByKey(this.selected)
      }
    }
  }
}
</script>

<style>

</style>
