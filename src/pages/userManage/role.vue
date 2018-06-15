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
               @click="openMainRoleModal('add',0)">
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
          <q-td key="label"
                :props="props"
                style="text-align:left">
            <q-checkbox color="secondary"
                        v-model="props.expand"
                        checked-icon="mdi-minus"
                        unchecked-icon="mdi-plus"
                        class="q-mr-md" />{{ props.row.label}}</q-td>
          <q-td key="remark"
                :props="props"
                style="text-align:center">{{ props.row.remark }}</q-td>
          <q-td key="comId"
                :props="props"
                style="text-align:center">{{ props.row.comLabel }}</q-td>
          <q-td key="status"
                :props="props"
                style="text-align:center">{{ props.row.status==1?'启用':'停用' }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
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
  </q-page>
</template>

<script>
import { getRoleList } from 'src/api/userManage'
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
      visibleColumns: ['label', 'remark', 'comId', 'status'],
      separator: 'horizontal',
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        { name: 'label', label: '角色名称', field: 'label' },
        { name: 'remark', label: '备注', field: 'remark' },
        {
          name: 'comId',
          label: '所属公司',
          field: 'comId'
        },
        {
          name: 'status',
          label: '状态',
          field: 'status'
        }
      ]
    }
  },
  methods: {
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type,
        position: 'top-right'
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
