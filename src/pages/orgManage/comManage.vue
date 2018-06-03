<template>
  <q-page padding>
    <div class="row justify-center">
      <div>
        <div class="q-mb-sm">
          <!-- <q-btn size="sm"
                 color="primary"
                 @click="selectGoodService"
                 label="选择'信息中心'" />
          <q-btn v-if="selected"
                 size="sm"
                 color="red"
                 @click="unselectNode"
                 label="取消选择" /> -->
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
  methods: {},
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
