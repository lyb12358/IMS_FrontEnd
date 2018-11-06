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
        <q-btn v-show="resetBtnExist"
               icon="mdi-eraser"
               label="重置当前搜索"
               rounded
               color="dark"
               @click="resetSearchFormAndSearch">
        </q-btn>
        <q-btn icon="mdi-magnify"
               label="搜索"
               rounded
               color="secondary"
               @click="searchFormDialogOpened=true">
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
          <q-td key="account"
                :props="props"
                style="text-align:center">{{ props.row.account}}</q-td>
          <q-td key="name"
                :props="props"
                style="text-align:center">{{ props.row.name}}</q-td>
          <q-td key="roleName"
                :props="props"
                :style="{textAlign:'center',maxWidth:'200px',whiteSpace:'normal'}">{{ props.row.roleName}}</q-td>
          <q-td key="status"
                :props="props"
                style="text-align:center">
            <q-icon :name="props.row.status==1?'mdi-check-circle':'mdi-close-circle'"
                    size="1.5rem"
                    :color="props.row.status==1?'positive':'negative'" />
          </q-td>
          <q-td key="operation"
                :props="props"
                style="text-align:center">
            <q-btn icon="mdi-settings"
                   rounded
                   color="primary"
                   @click="openRoleModel(props.row.id)">
              <q-tooltip>角色管理</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-eraser-variant"
                   rounded
                   color="dark"
                   @click="resetPassword(props.row.id,props.row.name)">
              <q-tooltip>重置密码</q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete"
                   rounded
                   color="negative"
                   @click="deleteUser(props.row.id)">
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
export default {
  data() {
    return {
      api: process.env.API,
      searchForm: {
        page: 0,
        row: 0
      },
      loading: false,
      visibleColumns: ['account', 'name', 'roleName', 'status', 'operation'],
      separator: 'horizontal',
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10 // specifying this determines pagination is server-side
      },
      serverData: [],
      columns: [
        // { name: 'account', label: '账号', field: 'account' },
      ]
      //main modal
    }
  },
  computed: {
    brandColor() {
      return this.$store.getters['user/brandColor']
    }
  },
  methods: {
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type
      })
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
      // getUserList(this.searchForm)
      //   .then(response => {
      //     let data = response.data.data
      //     this.serverPagination = pagination
      //     this.serverPagination.rowsNumber = data.total
      //     this.serverData = data.rows
      //     this.loading = false
      //   })
      //   .catch(error => {
      //     this.loading = false
      //   })
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
