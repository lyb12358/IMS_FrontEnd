<template>
  <q-page padding
          class="page-cat">
    <div class="row justify-center ">
      <div style="width: 850px; max-width: 90vw;"
           class="row">
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="show(category)">
            <q-icon name="settings" />
            <p class="caption">产品类别</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openParamModel(606,'产品属性')">
            <q-icon name="settings" />
            <p class="caption">产品属性</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openCSModel('prodCat')">
            <q-icon name="settings" />
            <p class="caption">产品品类</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openCSModel('prodSpe')">
            <q-icon name="settings" />
            <p class="caption">产品规格</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openParamModel(464,'产品年份')">
            <q-icon name="settings" />
            <p class="caption">产品年份</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openParamModel(465,'产品季节')">
            <q-icon name="settings" />
            <p class="caption">产品季节</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openParamModel(466,'产品花色')">
            <q-icon name="mdi-palette" />
            <p class="caption">产品花色</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openParamModel(486,'产品档次')">
            <q-icon name="mdi-triangle" />
            <p class="caption">产品档次</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4">
          <div class="card text-center text-primary"
               @click="openParamModel(567,'产品设计师')">
            <q-icon name="mdi-face" />
            <p class="caption">产品设计师</p>
          </div>
        </div>
      </div>
    </div>
    <!-- param modal -->
    <q-modal v-model="paramModalOpened"
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
            {{paramModalName}}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <q-table :title="paramModalName"
                   :data="paramData"
                   :filter="paramFilter"
                   :columns="paramColumns"
                   row-key="name">
            <template slot="top-left"
                      slot-scope="props">
              <q-btn icon="mdi-new-box"
                     rounded
                     class="q-ma-xs"
                     color="primary"
                     @click="openParamDialog('add')">
                <q-tooltip>新建</q-tooltip>
              </q-btn>
            </template>
            <template slot="top-right"
                      slot-scope="props">
              <q-search hide-underline
                        clearable
                        v-model="paramFilter" />
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
                <q-td key="name"
                      :props="props"
                      style="text-align:center">{{ props.row.name }}</q-td>
                <q-td key="isSync"
                      :props="props"
                      style="text-align:center">
                  <q-icon :name="props.row.isSync?'mdi-check-circle':'mdi-sync-off'"
                          size="1.5rem"
                          :color="props.row.isSync?'positive':'negative'" /></q-td>
                <q-td key="operation"
                      :props="props"
                      style="text-align:center">
                  <q-btn icon="mdi-format-list-numbers"
                         rounded
                         color="orange"
                         @click="openParamDialog('update',props.row)">
                    <q-tooltip>修改</q-tooltip>
                  </q-btn>
                  <q-btn icon="mdi-delete"
                         rounded
                         color="negative"
                         @click="deleteParam(props.row.name)">
                    <q-tooltip>删除</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- param dialog -->
    <q-dialog v-model="paramDialogOpened"
              no-refocus
              prevent-close>
      <span slot="title">输入名称</span>
      <div slot="body">
        <q-field icon="mdi-rename-box"
                 label="名称"
                 :label-width="3">
          <q-input v-model.trim="productParam.name">
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn v-if="paramDialogAction=='add'"
               color="primary"
               @click="newProdParam(productParam)"
               label="确定" />
        <q-btn v-if="paramDialogAction=='update'"
               color="primary"
               @click="modifyProdParam(productParam)"
               label="确定" />
        <q-btn color="primary"
               v-close-overlay
               label="取消" />
      </template>
    </q-dialog>
    <!-- cat、spe modal -->
    <q-modal v-model="CSModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
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
            {{CSModalName}}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row justify-center">
            <div class="col-xs-12 col-sm-6">
              <q-scroll-area style="width: 600px; height: 600px;">
                <q-tree :nodes="CSTreeData"
                        ref="CSTree"
                        color="primary"
                        :selected.sync="CSSelected"
                        node-key="id" />
              </q-scroll-area>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-table :title="CSModalName"
                       :data="CSData"
                       :filter="CSFilter"
                       :columns="CSColumns"
                       row-key="name">
                <template slot="top-left"
                          slot-scope="props">
                  <q-btn icon="mdi-new-box"
                         rounded
                         class="q-ma-xs"
                         color="primary"
                         @click="openCSDialog('add')">
                    <q-tooltip>新建</q-tooltip>
                  </q-btn>
                </template>
                <template slot="top-right"
                          slot-scope="props">
                  <q-search hide-underline
                            clearable
                            v-model="CSFilter" />
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
                    <q-td key="name"
                          :props="props"
                          style="text-align:center">{{ props.row.name }}</q-td>
                    <q-td key="isSync"
                          :props="props"
                          style="text-align:center">
                      <q-icon :name="props.row.isSync?'mdi-check-circle':'mdi-sync-off'"
                              size="1.5rem"
                              :color="props.row.isSync?'positive':'negative'" /></q-td>
                    <q-td key="operation"
                          :props="props"
                          style="text-align:center">
                      <q-btn icon="mdi-format-list-numbers"
                             rounded
                             color="orange"
                             @click="openCSDialog('update',props.row)">
                        <q-tooltip>修改</q-tooltip>
                      </q-btn>
                      <q-btn icon="mdi-delete"
                             rounded
                             color="negative"
                             @click="deleteCS(props.row.name)">
                        <q-tooltip>删除</q-tooltip>
                      </q-btn>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- cat、spe dialog -->
  </q-page>
</template>

<script>
import {
  getProdCatListByParent,
  addProdCat,
  updateProdCat,
  getProdClassTreeOnBigType,
  getProdParamListByParent,
  addProdParam,
  updateProdParam,
  getProdSpeListByParent,
  addProdSpe,
  updateProdSpe
} from 'src/api/productParam'
export default {
  data() {
    return {
      //prodParam
      paramModalOpened: false,
      paramFilter: '',
      paramId: 0,
      paramModalName: '',
      paramDialogOpened: false,
      paramDialogAction: '',
      paramData: [],
      paramColumns: [
        { name: 'name', label: '名称', field: 'name' },
        { name: 'isSync', label: '是否同步', field: 'isSync' },
        { name: 'operation', label: '操作', field: 'operation' }
      ],
      productParam: {
        id: 0,
        parentId: 0,
        name: ''
      },
      //prodCat、prodSpe
      CSTreeData: [],
      CSSelected: '',
      CSModalOpened: false,
      CSFilter: '',
      CSId: 0,
      CSModalName: '',
      CSDialogOpened: false,
      CSDialogAction: '',
      CSData: [],
      CSColumns: [
        { name: 'name', label: '名称', field: 'name' },
        { name: 'isSync', label: '是否同步', field: 'isSync' },
        { name: 'operation', label: '操作', field: 'operation' }
      ]
    }
  },
  computed: {},
  watch: {
    CSSelected: function(newVal, oldVal) {
      if (this.CSModalOpened && newVal != '' && newVal != null) {
        this.fetchCSData()
      }
    }
  },
  methods: {
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type
      })
    },
    //prodParam
    openParamModel(id, name) {
      this.paramFilter = ''
      this.paramId = id
      this.paramModalName = name
      this.fetchParamData()
      this.paramModalOpened = true
    },
    fetchParamData() {
      getProdParamListByParent(this.paramId).then(response => {
        let data = response.data.data
        this.paramData = data
      })
    },
    deleteParam(name) {
      this.notify('warning', '删除了' + name)
    },
    openParamDialog(action, productParam) {
      if (action == 'add') {
        this.paramDialogAction = 'add'
        Object.assign(
          this.productParam,
          this.$options.data.call(this).productParam
        )
        this.productParam.parentId = this.paramId
        this.paramDialogOpened = true
      } else if (action == 'update') {
        this.paramDialogAction = 'update'
        Object.assign(this.productParam, productParam)
        this.paramDialogOpened = true
      }
    },
    newProdParam() {
      this.productParam.isSync = 1
      this.productParam.status = 1
      this.productParam.isDel = 0
      this.productParam.orderId = 0
      addProdParam(this.productParam)
        .then(response => {
          let data = response.data
          this.paramDialogOpened = false
          Object.assign(
            this.productParam,
            this.$options.data.call(this).productParam
          )
          this.notify('positive', data.msg)
          this.fetchParamData()
        })
        .catch(error => {})
    },
    modifyProdParam() {
      updateProdParam(this.productParam)
        .then(response => {
          let data = response.data
          this.paramDialogOpened = false
          Object.assign(
            this.productParam,
            this.$options.data.call(this).productParam
          )
          this.notify('positive', data.msg)
          this.fetchParamData()
        })
        .catch(error => {})
    },
    //prodCat、prodSpe
    openCSModel(type) {
      this.CSFilter = ''
      this.CSSelected = ''
      this.CSTreeData = []
      this.CSData = []
      if (type == 'prodCat') {
        this.CSModalName = '产品品类'
      } else {
        this.CSModalName = '产品规格'
      }
      this.CSModalOpened = true
      getProdClassTreeOnBigType()
        .then(response => {
          let data = response.data.data
          for (let i = 0; i < data.length; i++) {
            this.CSTreeData.push(data[i])
          }
          this.$nextTick(() => {
            this.$refs.CSTree.collapseAll()
          })
        })
        .catch(error => {})
    },
    fetchCSData() {
      if (this.CSModalName == '产品品类') {
        getProdCatListByParent(this.CSSelected).then(response => {
          let data = response.data.data
          this.CSData = data
        })
      } else {
        getProdSpeListByParent(this.CSSelected).then(response => {
          let data = response.data.data
          this.CSData = data
        })
      }
    },
    deleteCS(name) {
      this.notify('warning', '删除了' + name)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
.page-cat
  .card
    cursor pointer
    position relative
    padding 16px
    .q-icon
      font-size 60px
    p
      color rgba(0, 0, 0, 0.87)
      margin 15px 0 0 0 !important
    &:before
      content ''
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      border-radius 2px
      opacity 0
      transition opacity 0.2s
      background currentColor
    &:hover:before
      opacity 0.4
</style>
