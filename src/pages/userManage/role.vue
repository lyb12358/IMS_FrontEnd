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
                 @keyup.enter="search"
                 v-model="searchForm.name"
                 float-label="角色" />
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
               @click="search">
          <q-tooltip>搜索</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-new-box"
               rounded
               class="q-ma-xs"
               color="primary"
               @click="openRoleDialog('add')">
          <q-tooltip>新建</q-tooltip>
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
        <!-- <q-select color="secondary"
                  class="print-hide"
                  v-model="separator"
                  :options="[
          { label: '水平框线', value: 'horizontal' },
          { label: '竖直框线', value: 'vertical' },
          { label: '网格框线', value: 'cell' },
          { label: '无框线', value: 'none' }
        ]"
                  hide-underline /> -->
        <q-btn flat
               rounded
               class="print-hide"
               :icon="props.inFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
               @click="props.toggleFullscreen">
          <q-tooltip>全屏</q-tooltip>
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
          <q-td key="name"
                :props="props"
                style="text-align:left">{{ props.row.name}}</q-td>
          <q-td key="remark"
                :props="props"
                style="text-align:center">{{ props.row.remark }}</q-td>
          <q-td key="status"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.status==1?'mdi-check-circle':'mdi-close-circle'"
                    size="1.5rem"
                    :color="props.row.status==1?'positive':'negative'" /></q-td>
          <q-td key="operation"
                :props="props"
                style="text-align:center">
            <q-btn icon="mdi-settings"
                   rounded
                   color="primary"
                   @click="permissionSetting(props.row.id)">
              <q-tooltip>设置权限</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-format-list-numbers"
                   rounded
                   color="orange"
                   @click="openRoleDialog('update',props.row)">
              <q-tooltip>修改角色</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="deleteRole(props.row.id)">
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
    <!-- role dialog -->
    <q-dialog v-model="roleDialogOpened"
              no-refocus
              prevent-close>
      <span slot="title">输入角色信息</span>
      <div slot="body">
        <q-field icon="mdi-rename-box"
                 label="名称"
                 :label-width="3"
                 :error="$v.role.name.$error"
                 error-label="角色名不为空，且不超过15位">
          <q-input v-model.trim="role.name">
          </q-input>
        </q-field>
        <q-field icon="mdi-rename-box"
                 label="备注"
                 :label-width="3">
          <q-input v-model.trim="role.remark">
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn v-if="roleDialogAction=='add'"
               color="primary"
               :loading="newRoleLoading"
               @click="newRole()"
               label="确定" />
        <q-btn v-if="roleDialogAction=='update'"
               color="primary"
               :loading="modifyRoleLoading"
               @click="modifyRole()"
               label="确定" />
        <q-btn color="primary"
               v-close-overlay
               label="取消" />
      </template>
    </q-dialog>
    <!-- permission manage -->
    <q-modal v-model="mainRoleModalOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             :content-css="{minWidth: '100vw', minHeight: '100vh'}">
      <q-modal-layout footer-class="no-shadow">
        <q-toolbar slot="header">
          <q-btn flat
                 round
                 dense
                 v-close-overlay
                 icon="mdi-arrow-left" />
          <q-toolbar-title>
            角色权限
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer"
                   inverted>
          <div class="col-12 row justify-center ">
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     :loading="modifyPermissionLoading"
                     label="确定"
                     @click="modifyPermission" />
            </div>
            <div style="margin:0 2rem">
              <q-btn color="primary"
                     v-close-overlay
                     label="取消" />
            </div>
          </div>
        </q-toolbar>
        <div class="layout-padding">
          <q-card inline
                  class="q-ma-sm"
                  style="width:100%">
            <q-list separator>
              <q-collapsible icon="mdi-account-multiple"
                             label="用户管理">
                <div class="gutter-sm">
                  <q-checkbox v-model="rolePermission"
                              label="用户"
                              :val=3 />
                  <q-checkbox v-model="rolePermission"
                              label="角色"
                              :val=4 />
                </div>
              </q-collapsible>
              <q-collapsible icon="mdi-domain"
                             label="组织管理">
                <div class="gutter-sm">
                  <q-checkbox v-model="rolePermission"
                              label="公司/部门管理"
                              :val=5 />
                </div>
              </q-collapsible>
              <q-collapsible icon="mdi-layers"
                             label="产品管理">
                <div class="gutter-sm">
                  <q-checkbox v-model="rolePermission"
                              label="产品编号管理"
                              :val=6 />
                  <br>
                  <q-checkbox v-model="rolePermission"
                              label="新增产品编号"
                              color="secondary"
                              :val=12 />
                  <q-checkbox v-model="rolePermission"
                              label="修改产品编号"
                              color="secondary"
                              :val=13 />
                  <q-checkbox v-model="rolePermission"
                              label="上传产品编号图片"
                              color="secondary"
                              :val=14 />
                  <q-checkbox v-model="rolePermission"
                              label="下载产品编号图片"
                              color="secondary"
                              :val=15 />
                  <q-checkbox v-model="rolePermission"
                              label="下载说明书"
                              color="secondary"
                              :val=16 />
                  <q-checkbox v-model="rolePermission"
                              label="删除产品编号"
                              color="secondary"
                              :val=17 />
                  <q-checkbox v-model="rolePermission"
                              label="导出产品编号"
                              color="secondary"
                              :val=18 />
                  <br>
                  <q-checkbox v-model="rolePermission"
                              label="查看产品编号"
                              color="tertiary"
                              :val=44 />
                  <q-checkbox v-model="rolePermission"
                              label="查看编号名称"
                              color="tertiary"
                              :val=45 />
                  <q-checkbox v-model="rolePermission"
                              label="查看品类"
                              color="tertiary"
                              :val=46 />
                  <q-checkbox v-model="rolePermission"
                              label="查看规格"
                              color="tertiary"
                              :val=47 />
                  <q-checkbox v-model="rolePermission"
                              label="查看零售价"
                              color="tertiary"
                              :val=48 />
                  <q-checkbox v-model="rolePermission"
                              label="查看供应价"
                              color="tertiary"
                              :val=49 />
                  <q-checkbox v-model="rolePermission"
                              label="查看成本价"
                              color="tertiary"
                              :val=50 />
                  <q-checkbox v-model="rolePermission"
                              label="查看花色"
                              color="tertiary"
                              :val=51 />
                  <q-checkbox v-model="rolePermission"
                              label="查看件数"
                              color="tertiary"
                              :val=52 />
                  <q-checkbox v-model="rolePermission"
                              label="查看克重"
                              color="tertiary"
                              :val=53 />
                  <q-checkbox v-model="rolePermission"
                              label="查看装箱数"
                              color="tertiary"
                              :val=54 />
                  <q-checkbox v-model="rolePermission"
                              label="查看装箱规格"
                              color="tertiary"
                              :val=55 />
                  <q-checkbox v-model="rolePermission"
                              label="查看装箱体积"
                              color="tertiary"
                              :val=56 />
                  <q-checkbox v-model="rolePermission"
                              label="查看箱重量"
                              color="tertiary"
                              :val=57 />
                  <q-checkbox v-model="rolePermission"
                              label="查看散货预警量"
                              color="tertiary"
                              :val=58 />
                  <q-checkbox v-model="rolePermission"
                              label="查看是否库存提醒"
                              color="tertiary"
                              :val=59 />
                  <q-checkbox v-model="rolePermission"
                              label="查看备注"
                              color="tertiary"
                              :val=60 />
                  <q-checkbox v-model="rolePermission"
                              label="查看是否有防伪码"
                              color="tertiary"
                              :val=61 />
                  <q-checkbox v-model="rolePermission"
                              label="查看是否计算周转率"
                              color="tertiary"
                              :val=62 />
                  <q-checkbox v-model="rolePermission"
                              label="查看生产周期"
                              color="tertiary"
                              :val=63 />
                  <q-checkbox v-model="rolePermission"
                              label="查看三等品零售价"
                              color="tertiary"
                              :val=64 />
                  <q-checkbox v-model="rolePermission"
                              label="查看三等品供应价"
                              color="tertiary"
                              :val=65 />
                  <q-checkbox v-model="rolePermission"
                              label="查看三等品成本价"
                              color="tertiary"
                              :val=66 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品编号缩略图"
                              color="tertiary"
                              :val=68 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品编号是否同步"
                              color="tertiary"
                              :val=71 />
                  <q-checkbox v-model="rolePermission"
                              label="查看添加时间"
                              color="tertiary"
                              :val=72 />
                  <q-checkbox v-model="rolePermission"
                              label="查看修改时间"
                              color="tertiary"
                              :val=73 />
                  <q-checkbox v-model="rolePermission"
                              label="查看款号"
                              color="tertiary"
                              :val=74 />
                  <q-checkbox v-model="rolePermission"
                              label="查看款名"
                              color="tertiary"
                              :val=75 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品属性"
                              color="tertiary"
                              :val=76 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品归属"
                              color="tertiary"
                              :val=77 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品类别"
                              color="tertiary"
                              :val=78 />
                  <q-checkbox v-model="rolePermission"
                              label="查看大类"
                              color="tertiary"
                              :val=79 />
                  <q-checkbox v-model="rolePermission"
                              label="查看中类"
                              color="tertiary"
                              :val=80 />
                  <q-checkbox v-model="rolePermission"
                              label="查看小类"
                              color="tertiary"
                              :val=81 />
                  <q-checkbox v-model="rolePermission"
                              label="查看年份"
                              color="tertiary"
                              :val=82 />
                  <q-checkbox v-model="rolePermission"
                              label="查看季节"
                              color="tertiary"
                              :val=83 />
                  <q-checkbox v-model="rolePermission"
                              label="查看单位"
                              color="tertiary"
                              :val=84 />
                  <q-checkbox v-model="rolePermission"
                              label="查看材质"
                              color="tertiary"
                              :val=85 />
                  <q-checkbox v-model="rolePermission"
                              label="查看档次"
                              color="tertiary"
                              :val=86 />
                  <q-checkbox v-model="rolePermission"
                              label="查看设计师"
                              color="tertiary"
                              :val=87 />
                  <q-checkbox v-model="rolePermission"
                              label="查看描述fab"
                              color="tertiary"
                              :val=88 />
                  <q-checkbox v-model="rolePermission"
                              label="查看款式缩略图"
                              color="tertiary"
                              :val=90 />
                  <hr>
                  <q-checkbox v-model="rolePermission"
                              label="产品款式管理"
                              :val=7 />
                  <br>
                  <q-checkbox v-model="rolePermission"
                              label="新增产品款式"
                              color="secondary"
                              :val=20 />
                  <q-checkbox v-model="rolePermission"
                              label="修改产品款式"
                              color="secondary"
                              :val=21 />
                  <q-checkbox v-model="rolePermission"
                              label="上传产品款式图片"
                              color="secondary"
                              :val=22 />
                  <q-checkbox v-model="rolePermission"
                              label="下载产品款式图片"
                              color="secondary"
                              :val=23 />
                  <q-checkbox v-model="rolePermission"
                              label="删除产品款式"
                              color="secondary"
                              :val=25 />
                  <q-checkbox v-model="rolePermission"
                              label="导出产品款式"
                              color="secondary"
                              :val=26 />
                  <br>
                  <q-checkbox v-model="rolePermission"
                              label="查看款号"
                              color="tertiary"
                              :val=117 />
                  <q-checkbox v-model="rolePermission"
                              label="查看款名"
                              color="tertiary"
                              :val=118 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品属性"
                              color="tertiary"
                              :val=119 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品归属"
                              color="tertiary"
                              :val=120 />
                  <q-checkbox v-model="rolePermission"
                              label="查看产品类别"
                              color="tertiary"
                              :val=121 />
                  <q-checkbox v-model="rolePermission"
                              label="查看大类"
                              color="tertiary"
                              :val=122 />
                  <q-checkbox v-model="rolePermission"
                              label="查看中类"
                              color="tertiary"
                              :val=123 />
                  <q-checkbox v-model="rolePermission"
                              label="查看小类"
                              color="tertiary"
                              :val=124 />
                  <q-checkbox v-model="rolePermission"
                              label="查看年份"
                              color="tertiary"
                              :val=125 />
                  <q-checkbox v-model="rolePermission"
                              label="查看季节"
                              color="tertiary"
                              :val=126 />
                  <q-checkbox v-model="rolePermission"
                              label="查看单位"
                              color="tertiary"
                              :val=127 />
                  <q-checkbox v-model="rolePermission"
                              label="查看材质"
                              color="tertiary"
                              :val=128 />
                  <q-checkbox v-model="rolePermission"
                              label="查看档次"
                              color="tertiary"
                              :val=129 />
                  <q-checkbox v-model="rolePermission"
                              label="查看设计师"
                              color="tertiary"
                              :val=130 />
                  <q-checkbox v-model="rolePermission"
                              label="查看描述fab"
                              color="tertiary"
                              :val=131 />
                  <q-checkbox v-model="rolePermission"
                              label="查看款式缩略图"
                              color="tertiary"
                              :val=132 />
                  <q-checkbox v-model="rolePermission"
                              label="查看款式是否同步"
                              color="tertiary"
                              :val=135 />
                  <q-checkbox v-model="rolePermission"
                              label="查看添加时间"
                              color="tertiary"
                              :val=136 />
                  <q-checkbox v-model="rolePermission"
                              label="查看修改时间"
                              color="tertiary"
                              :val=137 />
                  <hr>
                  <q-checkbox v-model="rolePermission"
                              label="物料及辅料管理"
                              :val=8 />
                  <br>
                  <q-checkbox v-model="rolePermission"
                              label="新增物料辅料"
                              color="secondary"
                              :val=28 />
                  <q-checkbox v-model="rolePermission"
                              label="修改物料辅料"
                              color="secondary"
                              :val=29 />
                  <q-checkbox v-model="rolePermission"
                              label="上传物料辅料图片"
                              color="secondary"
                              :val=30 />
                  <q-checkbox v-model="rolePermission"
                              label="下载物料辅料图片"
                              color="secondary"
                              :val=31 />
                  <q-checkbox v-model="rolePermission"
                              label="删除物料辅料"
                              color="secondary"
                              :val=33 />
                  <q-checkbox v-model="rolePermission"
                              label="导出物料辅料"
                              color="secondary"
                              :val=34 />
                  <hr>
                  <q-checkbox v-model="rolePermission"
                              label="类别管理"
                              :val=9 />
                  <br>
                  <q-checkbox v-model="rolePermission"
                              label="维护类别"
                              color="secondary"
                              :val=35 />
                  <q-checkbox v-model="rolePermission"
                              label="维护属性"
                              color="secondary"
                              :val=36 />
                  <q-checkbox v-model="rolePermission"
                              label="维护品类"
                              color="secondary"
                              :val=37 />
                  <q-checkbox v-model="rolePermission"
                              label="维护规格"
                              color="secondary"
                              :val=38 />
                  <q-checkbox v-model="rolePermission"
                              label="维护年份"
                              color="secondary"
                              :val=39 />
                  <q-checkbox v-model="rolePermission"
                              label="维护季节"
                              color="secondary"
                              :val=40 />
                  <q-checkbox v-model="rolePermission"
                              label="维护花色"
                              color="secondary"
                              :val=41 />
                  <q-checkbox v-model="rolePermission"
                              label="维护档次"
                              color="secondary"
                              :val=42 />
                  <q-checkbox v-model="rolePermission"
                              label="维护设计师"
                              color="secondary"
                              :val=43 />
                  <hr>
                  <q-checkbox v-model="rolePermission"
                              label="维护常规大货"
                              color="warning"
                              :val=153 />
                  <q-checkbox v-model="rolePermission"
                              label="维护品悦家居"
                              color="warning"
                              :val=154 />
                  <q-checkbox v-model="rolePermission"
                              label="维护团购"
                              color="warning"
                              :val=155 />
                  <q-checkbox v-model="rolePermission"
                              label="维护物料"
                              color="warning"
                              :val=156 />
                  <q-checkbox v-model="rolePermission"
                              label="维护定制"
                              color="warning"
                              :val=157 />
                  <q-checkbox v-model="rolePermission"
                              label="维护老产品"
                              color="warning"
                              :val=158 />
                  <q-checkbox v-model="rolePermission"
                              label="维护婴童"
                              color="warning"
                              :val=159 />
                  <q-checkbox v-model="rolePermission"
                              label="维护七星"
                              color="warning"
                              :val=160 />
                  <q-checkbox v-model="rolePermission"
                              label="维护生产辅料"
                              color="warning"
                              :val=161 />
                </div>
              </q-collapsible>
              <q-collapsible icon="mdi-book-open"
                             label="更新日志">
                <div class="gutter-sm">
                  <q-checkbox v-model="rolePermission"
                              label="更新日志"
                              :val=10 />
                </div>
              </q-collapsible>
            </q-list>
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>
</template>

<script>
import {
  getRoleList,
  addRole,
  updateRole,
  getRolePermission,
  updateRolePermission
} from 'src/api/userManage'
import { maxLength, required } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      api: process.env.API,
      searchForm: {
        page: 0,
        row: 0,
        name: ''
      },
      loading: false,
      newRoleLoading: false,
      modifyRoleLoading: false,
      modifyPermissionLoading: false,
      visibleColumns: ['name', 'remark', 'status', 'operation'],
      separator: 'horizontal',
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      serverData: [],
      columns: [
        { name: 'name', label: '角色名称', field: 'name' },
        { name: 'remark', label: '备注', field: 'remark' },
        {
          name: 'status',
          label: '状态',
          field: 'status'
        },
        { name: 'operation', label: '操作', field: 'operation' }
      ],
      //role dialog
      roleDialogOpened: false,
      roleDialogAction: '',
      role: {
        name: '',
        remark: ''
      },
      //permission manage
      mainRoleModalOpened: false,
      roleId: '',
      rolePermission: []
    }
  },
  validations: {
    role: {
      name: { required, maxLength: maxLength(15) }
    }
  },
  methods: {
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type
      })
    },
    deleteRole(id) {
      this.notify('warning', 'Ok,Ok~')
    },
    resetSearchForm() {
      Object.assign(this.searchForm, this.$options.data.call(this).searchForm)
      this.$nextTick(() => {
        this.serverPagination.page = 1
        this.request({
          pagination: this.serverPagination
        })
      })
    },
    search() {
      this.serverPagination.page = 1
      this.request({
        pagination: this.serverPagination
      })
    },
    //dataTable request
    request({ pagination }) {
      this.loading = true
      this.searchForm.page = pagination.page
      this.searchForm.row = pagination.rowsPerPage
      getRoleList(this.searchForm)
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
    },
    //role manage
    openRoleDialog(action, role) {
      if (action == 'add') {
        this.$v.role.$reset()
        this.roleDialogAction = 'add'
        Object.assign(this.role, this.$options.data.call(this).role)
        this.roleDialogOpened = true
      } else if (action == 'update') {
        if (role.id == 1) {
          this.notify('warning', '你又调皮了~')
          return
        }
        this.roleDialogAction = 'update'
        Object.assign(this.role, role)
        this.roleDialogOpened = true
      }
    },
    newRole() {
      this.$v.role.$touch()
      if (this.$v.role.$invalid) {
        return
      }
      this.$v.role.$reset()
      this.newRoleLoading = true
      //fix
      this.role.status = 1
      addRole(this.role)
        .then(response => {
          let data = response.data
          this.roleDialogOpened = false
          this.newRoleLoading = false
          Object.assign(this.role, this.$options.data.call(this).role)
          this.notify('positive', data.msg)
          this.request({
            pagination: this.serverPagination
          })
        })
        .catch(error => {
          this.newRoleLoading = false
        })
    },
    modifyRole() {
      this.$v.role.$touch()
      if (this.$v.role.$invalid) {
        return
      }
      this.$v.role.$reset()
      this.modifyRoleLoading = true
      updateRole(this.role)
        .then(response => {
          let data = response.data
          this.roleDialogOpened = false
          this.modifyRoleLoading = false
          Object.assign(this.role, this.$options.data.call(this).role)
          this.notify('positive', data.msg)
          this.request({
            pagination: this.serverPagination
          })
        })
        .catch(error => {
          this.modifyRoleLoading = false
        })
    },
    //permission manage
    permissionSetting(id) {
      if (id == 1) {
        this.notify('warning', '系统管理员天下第一！')
        return
      }
      this.rolePermission = []
      getRolePermission(id)
        .then(response => {
          this.roleId = id
          let data = response.data.data
          this.rolePermission = data
          this.mainRoleModalOpened = true
        })
        .catch(error => {})
    },
    modifyPermission() {
      this.modifyPermissionLoading = true
      updateRolePermission(this.roleId, this.rolePermission)
        .then(response => {
          let data = response.data
          this.notify('positive', data.msg)
          this.roleId = ''
          this.rolePermission = []
          this.mainRoleModalOpened = false
          this.modifyPermissionLoading = false
        })
        .catch(error => {
          this.modifyPermissionLoading = false
        })
    }
  },
  mounted() {
    this.request({
      pagination: this.serverPagination
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
