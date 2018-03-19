<template>
  <q-page padding>
    <div>
      <q-btn icon="mdi-new-box"
             rounded
             class="q-ma-xs"
             color="primary"
             @click="newOpened=true">
        <q-tooltip>新建</q-tooltip>
      </q-btn>
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
    <q-modal v-model="newOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             minimized>
      <div class=" row justify-center items-center ">
        <form id='myForm'
              class='gutter-sm'>
          <div>
            <!-- <div class="row gutter-sm">
              <div class="col-xs-12  col-sm-6 col-md-3">
                <q-input v-model="model"
                         class="no-margin"
                         float-label="col-12" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-3 TOP LEFT" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-3 TOP RIGHT" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-3 BOTTOM LEFT" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-3 BOTTOM RIGHT" />
              </div>
              <div class="col-xs-12  col-sm-6 col-md-3">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-12" />
              </div>
            </div> -->
          </div>
          <!-- <q-btn rounded
               @click="resetForm">重置</q-btn>
        <q-btn @click="save">保存</q-btn>
        <q-btn @click="newOpened = false">关闭</q-btn> -->
        </form>

      </div>
    </q-modal>
    <q-modal v-model="opened"
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
                   inverted
                   >
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
              <q-input v-model="model"
                       class="no-margin"
                       float-label="col-12" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input inverted
                       v-model="model"
                       class="no-margin"
                       float-label="col-xs-12 col-sm-3 TOP LEFT" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input inverted
                       v-model="model"
                       class="no-margin"
                       float-label="col-xs-12 col-sm-3 TOP RIGHT" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input inverted
                       v-model="model"
                       class="no-margin"
                       float-label="col-xs-12 col-sm-3 BOTTOM LEFT" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-input inverted
                       v-model="model"
                       class="no-margin"
                       float-label="col-xs-12 col-sm-3 BOTTOM RIGHT" />
            </div>
            <div class="col-xs-12  col-sm-6 col-md-3">
              <q-input inverted
                       v-model="model"
                       class="no-margin"
                       float-label="col-12" />
            </div>
          </div>

        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      newOpened: false,
      opened: false,
      user: {
        password: '',
        name: ''
      }
    }
  }
}
</script>

<style lang='stylus'>
#myForm
  padding 30px
</style>
