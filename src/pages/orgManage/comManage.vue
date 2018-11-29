<template>
  <q-page padding>
    <div class="row justify-center">
      <div>
        <div class="q-mb-sm">
          <q-btn v-if="$q.platform.is.cordova"
                 color="primary"
                 @click="identifyBarcode"
                 label="识别条码" />
          <q-btn v-if="$q.platform.is.cordova"
                 color="primary"
                 @click="wechatShare"
                 label="识别条码" />
        </div>
        <q-tree :nodes="props"
                ref="orgTree"
                color="primary"
                :selected.sync="selected"
                node-key="id" />

      </div>
    </div>
  </q-page>
</template>

<script>
import { getOrgList } from 'src/api/organization'

export default {
  data: () => ({
    selected: '',
    props: []
  }),
  methods: {
    identifyBarcode() {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.$q.dialog({
            title: '通知',
            message:
              'We got a barcode\n' +
              'Result: ' +
              result.text +
              '\n' +
              'Format: ' +
              result.format +
              '\n' +
              'Cancelled: ' +
              result.cancelled
          })
        },
        error => {
          this.$q.dialog({
            title: '通知',
            message: 'Scanning failed: ' + error
          })
        },
        {
          preferFrontCamera: false, // iOS and Android
          showFlipCameraButton: true, // iOS and Android
          showTorchButton: true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: false, // Android, save scan history (default false)
          prompt: '对得准,才能扫得快:)', // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          disableAnimations: true, // iOS
          disableSuccessBeep: false // iOS and Android
        }
      )
    },
    wechatShare() {
      Wechat.share(
        {
          text: 'This is just a plain string',
          scene: Wechat.Scene.SESSION // share to Timeline
        },
        function() {
          this.$q.dialog({
            title: '通知',
            message: '分享成功!'
          })
        },
        function(reason) {
          this.$q.dialog({
            title: '通知',
            message: '分享失败,原因:' + reason
          })
        }
      )
    }
  },
  computed: {},
  created() {
    getOrgList()
      .then(response => {
        let data = response.data.data
        this.props.push(data[0])
        this.$nextTick(() => {
          this.$refs.orgTree.expandAll()
        })
      })
      .catch(error => {})
  }
}
</script>

<style>
</style>
