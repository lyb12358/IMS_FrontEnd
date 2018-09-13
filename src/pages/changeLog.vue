<template>
  <q-page no-padding>
    <div class="row justify-center">
      <vue-simple-markdown style="max-width:600px"
                           :source="changeLog"></vue-simple-markdown>
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
.markdown-body ul
  margin-bottom 0px
.markdown-body h2
  margin-top 0px
  margin-bottom 0px
</style>
