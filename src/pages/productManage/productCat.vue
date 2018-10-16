<template>
  <q-page padding
          class="page-cat">
    <div class="row justify-center ">
      <div style="width: 850px; max-width: 90vw;"
           class="row">
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(35)">
          <div class="card text-center"
               @click="openClassModel()">
            <q-icon name="settings"
                    :color="brandColor" />
            <p class="caption">产品类别</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(36)">
          <div class="card text-center "
               @click="openParamModel(606,'产品属性')">
            <q-icon name="settings"
                    :color="brandColor" />
            <p class="caption">产品属性</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(37)">
          <div class="card text-center "
               @click="openCSModel('prodCat')">
            <q-icon name="settings"
                    :color="brandColor" />
            <p class="caption">产品品类</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(38)">
          <div class="card text-center"
               @click="openCSModel('prodSpe')">
            <q-icon name="settings"
                    :color="brandColor" />
            <p class="caption">产品规格</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(39)">
          <div class="card text-center "
               @click="openParamModel(464,'产品年份')">
            <q-icon name="settings"
                    :color="brandColor" />
            <p class="caption">产品年份</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(40)">
          <div class="card text-center "
               @click="openParamModel(465,'产品季节')">
            <q-icon name="settings"
                    :color="brandColor" />
            <p class="caption">产品季节</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(41)">
          <div class="card text-center "
               @click="openParamModel(466,'产品花色')">
            <q-icon name="mdi-palette"
                    :color="brandColor" />
            <p class="caption">产品花色</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(42)">
          <div class="card text-center "
               @click="openParamModel(486,'产品档次')">
            <q-icon name="mdi-triangle"
                    :color="brandColor" />
            <p class="caption">产品档次</p>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4"
             v-if="checkAuth(43)">
          <div class="card text-center "
               @click="openParamModel(567,'产品设计师')">
            <q-icon name="mdi-face"
                    :color="brandColor" />
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
        <q-toolbar slot="header" :color="brandColor">
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
                 :label-width="3"
                 :error="$v.productParam.name.$error"
                 error-label="参数名不为空，且不超过15位">
          <q-input v-model.trim="productParam.name">
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn v-if="paramDialogAction=='add'"
               color="primary"
               :loading="newParamLoading"
               @click="newProdParam()"
               label="确定" />
        <q-btn v-if="paramDialogAction=='update'"
               color="primary"
               :loading="modifyParamLoading"
               @click="modifyProdParam()"
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
        <q-toolbar slot="header" :color="brandColor">
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
                        node-key="id">
                  <div slot="default-header"
                       slot-scope="prop"
                       class="row items-center">
                    <q-chip class="q-mr-sm"
                            :color="checkColor(prop.node.depth)"
                            small>{{checkClassType(prop.node.depth)}}</q-chip>
                    <div class="text-weight-bold">{{ prop.node.label }}</div>
                  </div>
                </q-tree>
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
    <q-dialog v-model="CSDialogOpened"
              no-refocus
              prevent-close>
      <span slot="title">输入名称</span>
      <div slot="body">
        <q-field icon="mdi-rename-box"
                 label="名称"
                 :label-width="3"
                 :error="$v.productCS.name.$error"
                 error-label="名称不为空，且不超过15位">
          <q-input v-model.trim="productCS.name">
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn v-if="CSDialogAction=='add'"
               color="primary"
               :loading="newCSLoading"
               @click="newProdCS()"
               label="确定" />
        <q-btn v-if="CSDialogAction=='update'"
               color="primary"
               :loading="modifyCSLoading"
               @click="modifyProdCS()"
               label="确定" />
        <q-btn color="primary"
               v-close-overlay
               label="取消" />
      </template>
    </q-dialog>
    <!-- class modal -->
    <q-modal v-model="classModalOpened"
             no-esc-dismiss
             no-backdrop-dismiss
             no-refocus
             :content-css="{minWidth: '25vw', minHeight: '50vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header" :color="brandColor">
          <q-btn flat
                 round
                 dense
                 v-close-overlay
                 icon="mdi-arrow-left" />
          <q-toolbar-title>
            产品类别
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div style="margin:0 0.5rem"
                 v-if="classSelected!=null&&classSelected!=''">
              <q-btn-dropdown color="primary"
                              label="操作">
                <q-list link>
                  <q-item v-close-overlay
                          @click.native="openClassDialog('add')">
                    <q-item-side icon="mdi-plus-box"
                                 color="primary" />
                    <q-item-main>
                      <q-item-tile label>增加{{classNode.label}}同级类别</q-item-tile>
                    </q-item-main>
                  </q-item>
                  <q-item v-close-overlay
                          v-if="classNode.depth<5"
                          @click.native="openClassDialog('expand')">
                    <q-item-side icon="mdi-library-plus"
                                 color="secondary" />
                    <q-item-main>
                      <q-item-tile label>增加{{classNode.label}}子类别</q-item-tile>
                    </q-item-main>
                  </q-item>
                  <q-item v-close-overlay
                          @click.native="openClassDialog('update')">
                    <q-item-side icon="mdi-format-list-numbers"
                                 color="orange" />
                    <q-item-main>
                      <q-item-tile label>修改{{classNode.label}}</q-item-tile>
                    </q-item-main>
                  </q-item>
                  <q-item v-close-overlay
                          @click.native="deleteProdClass(classNode.label)">
                    <q-item-side icon="mdi-delete"
                                 color="negative" />
                    <q-item-main>
                      <q-item-tile label>删除{{classNode.label}}</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div style="margin:0 0.5rem">
              <q-btn color="primary"
                     @click="$refs.classTree.expandAll()"
                     label="全部展开" />
            </div>
            <div style="margin:0 0.5rem">
              <q-btn color="primary"
                     @click="$refs.classTree.collapseAll()"
                     label="全部收缩" />
            </div>
            <div style="margin:0 0.5rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row justify-center">
            <q-tree :nodes="classTreeData"
                    ref="classTree"
                    :selected.sync="classSelected"
                    node-key="id">
              <div slot="default-header"
                   slot-scope="prop"
                   class="row items-center">
                <q-chip class="q-mr-sm"
                        :color="checkColor(prop.node.depth)"
                        small>{{checkClassType(prop.node.depth)}}</q-chip>
                <div class="text-weight-bold">{{ prop.node.label }}</div>
              </div>
            </q-tree>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- prodClass dialog -->
    <q-dialog v-model="classDialogOpened"
              no-refocus
              prevent-close>
      <span slot="title">输入名称</span>
      <div slot="body">
        <q-field icon="mdi-rename-box"
                 label="名称"
                 :label-width="3"
                 :error="$v.productClass.name.$error"
                 error-label="类别名称不为空，且不超过15位">
          <q-input v-model.trim="productClass.name">
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn v-if="classDialogAction=='add'|classDialogAction=='expand'"
               color="primary"
               :loading="newClassLoading"
               @click="newProdClass()"
               label="确定" />
        <q-btn v-if="classDialogAction=='update'"
               color="primary"
               :loading="modifyClassLoading"
               @click="modifyProdClass()"
               label="确定" />
        <q-btn color="primary"
               v-close-overlay
               label="取消" />
      </template>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  getProdCatListByParent,
  addProdCat,
  updateProdCat,
  getProdClassTree,
  getProdClassTreeOnBigType,
  addProdClass,
  updateProdClass,
  getProdParamListByParent,
  addProdParam,
  updateProdParam,
  getProdSpeListByParent,
  addProdSpe,
  updateProdSpe
} from 'src/api/productParam'
import { maxLength, required } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      //dialog loading
      newParamLoading: false,
      modifyParamLoading: false,
      newCSLoading: false,
      modifyCSLoading: false,
      newClassLoading: false,
      modifyClassLoading: false,
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
      ],
      productCS: {
        id: 0,
        classId: 0,
        name: ''
      },
      //prodClass
      classTreeData: [],
      classSelected: '',
      classModalOpened: false,
      classDialogOpened: false,
      classDialogAction: '',
      productClass: {
        id: 0,
        parentId: '',
        name: '',
        depth: ''
      }
    }
  },
  validations: {
    productParam: {
      name: { required, maxLength: maxLength(15) }
    },
    productCS: {
      name: { required, maxLength: maxLength(15) }
    },
    productClass: {
      name: { required, maxLength: maxLength(15) }
    }
  },
  computed: {
    permissions() {
      return this.$store.getters['user/permissions']
    },
    classNode: function() {
      return this.$refs.classTree.getNodeByKey(this.classSelected) == null
        ? { label: 1 }
        : this.$refs.classTree.getNodeByKey(this.classSelected)
    },
    brandColor() {
      return this.$store.getters['user/brandColor']
    }
  },
  watch: {
    CSSelected: function(newVal, oldVal) {
      if (this.CSModalOpened && newVal != '' && newVal != null) {
        this.fetchCSData()
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
      this.paramData=[]
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
      this.$v.productParam.$reset()
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
      this.$v.productParam.$touch()
      if (this.$v.productParam.$invalid) {
        return
      }
      this.$v.productParam.$reset()
      this.newParamLoading = true
      this.productParam.isSync = 1
      this.productParam.status = 1
      this.productParam.isDel = 0
      this.productParam.orderId = 0
      addProdParam(this.productParam)
        .then(response => {
          let data = response.data
          this.paramDialogOpened = false
          this.newParamLoading = false
          Object.assign(
            this.productParam,
            this.$options.data.call(this).productParam
          )
          this.notify('positive', data.msg)
          this.fetchParamData()
        })
        .catch(error => {
          this.newParamLoading = false
        })
    },
    modifyProdParam() {
      this.$v.productParam.$touch()
      if (this.$v.productParam.$invalid) {
        return
      }
      this.$v.productParam.$reset()
      this.modifyParamLoading = true
      updateProdParam(this.productParam)
        .then(response => {
          let data = response.data
          this.paramDialogOpened = false
          this.modifyParamLoading = false
          Object.assign(
            this.productParam,
            this.$options.data.call(this).productParam
          )
          this.notify('positive', data.msg)
          this.fetchParamData()
        })
        .catch(error => {
          this.modifyParamLoading = false
        })
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
    },
    openCSDialog(action, productCS) {
      this.$v.productCS.$reset()
      if (action == 'add') {
        this.CSDialogAction = 'add'
        Object.assign(this.productCS, this.$options.data.call(this).productCS)
        this.productCS.classId = this.CSSelected
        this.CSDialogOpened = true
      } else if (action == 'update') {
        this.CSDialogAction = 'update'
        Object.assign(this.productCS, productCS)
        this.CSDialogOpened = true
      }
    },
    newProdCS() {
      this.$v.productCS.$touch()
      if (this.$v.productCS.$invalid) {
        return
      }
      this.$v.productCS.$reset()
      this.newCSLoading = true
      this.productCS.isSync = 1
      this.productCS.status = 1
      this.productCS.isDel = 0
      this.productCS.orderId = 0
      if (this.CSModalName == '产品品类') {
        addProdCat(this.productCS)
          .then(response => {
            let data = response.data
            this.CSDialogOpened = false
            this.newCSLoading = false
            Object.assign(
              this.productCS,
              this.$options.data.call(this).productCS
            )
            this.notify('positive', data.msg)
            this.fetchCSData()
          })
          .catch(error => {
            this.newCSLoading = false
          })
      } else {
        addProdSpe(this.productCS)
          .then(response => {
            let data = response.data
            this.CSDialogOpened = false
            this.newCSLoading = false
            Object.assign(
              this.productCS,
              this.$options.data.call(this).productCS
            )
            this.notify('positive', data.msg)
            this.fetchCSData()
          })
          .catch(error => {
            this.newCSLoading = false
          })
      }
    },
    modifyProdCS() {
      this.$v.productCS.$touch()
      if (this.$v.productCS.$invalid) {
        return
      }
      this.$v.productCS.$reset()
      this.modifyCSLoading = true
      if (this.CSModalName == '产品品类') {
        updateProdCat(this.productCS)
          .then(response => {
            let data = response.data
            this.CSDialogOpened = false
            this.modifyCSLoading = false
            Object.assign(
              this.productCS,
              this.$options.data.call(this).productCS
            )
            this.notify('positive', data.msg)
            this.fetchCSData()
          })
          .catch(error => {
            this.modifyCSLoading = false
          })
      } else {
        updateProdSpe(this.productCS)
          .then(response => {
            let data = response.data
            this.CSDialogOpened = false
            this.modifyCSLoading = false
            Object.assign(
              this.productCS,
              this.$options.data.call(this).productCS
            )
            this.notify('positive', data.msg)
            this.fetchCSData()
          })
          .catch(error => {
            this.modifyCSLoading = false
          })
      }
    },
    //prodClass
    openClassModel() {
      this.classModalOpened = true
      this.classTreeData = []
      getProdClassTree()
        .then(response => {
          let data = response.data.data
          for (let i = 0; i < data.length; i++) {
            this.classTreeData.push(data[i])
          }
        })
        .catch(error => {})
      this.$nextTick(() => {
        this.$refs.classTree.collapseAll()
      })
    },
    checkColor(depth) {
      if (depth == 1) {
        return 'primary'
      } else if (depth == 2) {
        return 'secondary'
      } else if (depth == 3) {
        return 'tertiary'
      } else if (depth == 4) {
        return 'info'
      } else {
        return 'warning'
      }
    },
    checkClassType(depth) {
      if (depth == 1) {
        return '归属'
      } else if (depth == 2) {
        return '类别'
      } else if (depth == 3) {
        return '大类'
      } else if (depth == 4) {
        return '中类'
      } else {
        return '小类'
      }
    },
    deleteProdClass(name) {
      this.notify('warning', '删除了' + name)
    },
    openClassDialog(action) {
      this.$v.productClass.$reset()
      if (action == 'add') {
        this.classDialogAction = 'add'
        Object.assign(
          this.productClass,
          this.$options.data.call(this).productClass
        )
        this.productClass.parentId = this.classNode.parentId
        this.productClass.depth = this.classNode.depth
        this.classDialogOpened = true
      } else if (action == 'expand') {
        this.classDialogAction = 'expand'
        Object.assign(
          this.productClass,
          this.$options.data.call(this).productClass
        )
        this.productClass.parentId = this.classNode.id
        this.productClass.depth = this.classNode.depth + 1
        this.classDialogOpened = true
      } else {
        this.classDialogAction = 'update'
        Object.assign(this.productClass, this.classNode)
        this.productClass.name = this.classNode.label
        this.classDialogOpened = true
      }
    },
    newProdClass() {
      this.$v.productClass.$touch()
      if (this.$v.productClass.$invalid) {
        return
      }
      this.$v.productClass.$reset()
      this.newClassLoading = true
      this.productClass.isSync = 1
      this.productClass.status = 1
      this.productClass.isDel = 0
      this.productClass.orderId = 0
      addProdClass(this.productClass)
        .then(response => {
          let data = response.data
          this.classDialogOpened = false
          this.newClassLoading = false
          Object.assign(
            this.productClass,
            this.$options.data.call(this).productClass
          )
          this.notify('positive', data.msg)
          this.classTreeData = []
          getProdClassTree().then(response => {
            let data = response.data.data
            for (let i = 0; i < data.length; i++) {
              this.classTreeData.push(data[i])
            }
          })
        })
        .catch(error => {
          this.newClassLoading = false
        })
    },
    modifyProdClass() {
      this.$v.productClass.$touch()
      if (this.$v.productClass.$invalid) {
        return
      }
      this.$v.productClass.$reset()
      this.modifyClassLoading = true
      updateProdClass(this.productClass)
        .then(response => {
          let data = response.data
          this.classDialogOpened = false
          this.modifyClassLoading = false
          Object.assign(
            this.productClass,
            this.$options.data.call(this).productClass
          )
          this.notify('positive', data.msg)
          this.classTreeData = []
          getProdClassTree().then(response => {
            let data = response.data.data
            for (let i = 0; i < data.length; i++) {
              this.classTreeData.push(data[i])
            }
          })
        })
        .catch(error => {
          this.modifyClassLoading = false
        })
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
      opacity 0.2
</style>
