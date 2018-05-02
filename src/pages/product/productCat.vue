<template>
  <q-page padding>
    <div>
      <q-btn icon="mdi-new-box"
             rounded
             class="q-ma-xs"
             color="primary"
             @click="imageUploadModel=true">
        <q-tooltip>新建</q-tooltip>
      </q-btn>
    </div>
    <q-dialog v-model="imageUploadModel"
              prevent-close>
      <span slot="title">上传产品图片</span>
      <span slot="message">点击"+"，选择清晰度较高的图片，将作为本产品主要图片展示</span>
      <div slot="body">
        <q-uploader ref="imageUpload"
                    :url="imageUploadUrl"
                    clearable
                    auto-expand
                    hide-upload-button
                    float-label="上传图片"
                    @uploaded="imageUploaded"
                    @fail="imageUploadedFail"
                    @add="addImageFile" />
      </div>
      <template slot="buttons"
                slot-scope="props">
        <q-btn color="primary"
               label="上传"
               @click="imageUpload" />
        <q-btn color="primary"
               label="取消"
               @click="imageUploadCancel" />
      </template>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    imageUploadModel: false,
    imageUploadUrl: 'api/pic/upload'
  }),
  methods: {
    notify(type, message) {
      this.$q.notify({
        message: message,
        type: type,
        position: 'bottom-right'
      })
    },
    addImageFile(files) {
      if (files[0].size > 5 * 1024 * 1024) {
        this.$refs.imageUpload.reset()
        this.notify('warning', '图片不能大于5MB')
      }
    },
    imageUpload() {
      this.$refs.imageUpload.upload()
      //this.imageUploadModel = false
    },
    imageUploadCancel() {
      this.$refs.imageUpload.reset()
      this.imageUploadModel = false
    },
    // when image has just bean uploaded
    imageUploaded(file, xhr) {
      this.notify('positive', '上传成功')
    },
    // when it has encountered error while uploading
    imageUploadedFail(file, xhr) {
      let response = JSON.parse(xhr.response)
      this.notify('negative', response.info)
    }
  }
}
</script>

<style>

</style>
