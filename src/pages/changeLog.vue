<template>
  <q-page no-padding>
    <div class="row justify-center">
      <vue-simple-markdown :source="changeLog"
                           style="min-width:600px"></vue-simple-markdown>
    </div>
  </q-page>
</template>

<script>
import changeLog from 'src/log/changeLog.md'
export default {
  data() {
    return {
      changeLog
    }
  }
  // name: 'PageName',
}
</script>

<style lang="stylus">
.markdown-body
  font-family 'Roboto', 'Microsoft YaHei', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif
</style>
