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
    <q-modal v-model="newOpened"
             no-backdrop-dismiss
             no-esc-dismiss
             minimized>
      <div class=" row justify-center items-center ">
        <form id='myForm'
              class='gutter-sm'>
          <div>
            <div class="row gutter-sm">
              <div class="col-12">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-12" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-6 TOP LEFT" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-6 TOP RIGHT" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-6 BOTTOM LEFT" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-xs-12 col-sm-6 BOTTOM RIGHT" />
              </div>
              <div class="col-12">
                <q-input inverted
                         v-model="model"
                         class="no-margin"
                         float-label="col-12" />
              </div>
            </div>
          </div>
          <!-- <q-btn rounded
               @click="resetForm">重置</q-btn>
        <q-btn @click="save">保存</q-btn>
        <q-btn @click="newOpened = false">关闭</q-btn> -->
        </form>

      </div>
    </q-modal>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      newOpened: false,
      user: {
        password: '',
        name: ''
      }
    }
  }
}
</script>

<style>

</style>
