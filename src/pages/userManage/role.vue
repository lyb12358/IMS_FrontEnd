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
                 v-model="searchForm.label"
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
               @click="search()">
          <q-tooltip>搜索</q-tooltip>
        </q-btn>
        <q-btn icon="mdi-new-box"
               rounded
               class="q-ma-xs"
               color="primary"
               @click="openRoleDialog">
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
                style="text-align:center">{{ props.row.status }}</q-td>
          <q-td key="operation"
                :props="props"
                style="text-align:center">
            <q-btn icon="mdi-settings"
                   rounded
                   color="primary"
                   @click="roleSetting(props.row.id)">
              <q-tooltip>设置</q-tooltip>
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
      <span slot="title">输入角色名称</span>
      <div slot="body">
        <q-field icon="mdi-rename-box"
                 label="名称"
                 :label-width="3"
                 :error="$v.role.name.$error"
                 error-label="角色名不为空，且不超过15位">
          <q-input v-model.trim="role.name">
          </q-input>
        </q-field>
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn v-if="roleDialogAction=='add'"
               color="primary"
               @click="newRole()"
               label="确定" />
        <q-btn v-if="roleDialogAction=='update'"
               color="primary"
               @click="modifyRole()"
               label="确定" />
        <q-btn color="primary"
               v-close-overlay
               label="取消" />
      </template>
    </q-dialog>
  </q-page>
</template>

<script>
import { getRoleList } from 'src/api/userManage'
import { maxLength, required } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      api: process.env.API,
      searchForm: {
        page: 0,
        row: 0,
        label: ''
      },
      loading: false,
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
      //role manage
      roleDialogOpened: false,
      role: {
        name: '',
        remark: ''
      }
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
    //permission manage
    openRoleDialog() {},
    roleSetting(id) {}
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
