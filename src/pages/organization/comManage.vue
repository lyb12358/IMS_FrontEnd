<template>
  <q-page padding>
    <div class="row justify-center">
      <div>
        <div class="q-mb-sm">
          <q-btn size="sm"
                 color="primary"
                 @click="selectGoodService"
                 label="选择'信息中心'" />
          <q-btn v-if="selected"
                 size="sm"
                 color="red"
                 @click="unselectNode"
                 label="取消选择" />
        </div>
        <q-tree :nodes="props"
                ref="tree"
                color="primary"
                :selected.sync="selected"
                node-key="id" />

      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    selected: '',
    props: []
    
  }),
  methods: {
    selectGoodService() {
      if (this.selected !== '信息中心') {
        this.selected = '信息中心'
      }
    },
    unselectNode() {
      console.log(this.selected)
      this.selected = ''
    }
  },
  computed: {
    xx() {
      if (null != this.selected) {
        console.log(this.$refs.tree.getNodeByKey(this.selected).label)
        return this.$refs.tree.getNodeByKey(this.selected)
      }
    }
  },
 created() {
     this.$axios
        .get('/api/getOrgList')
        .then(({ data }) => {
          this.props= data;
        })
        .catch(error => {
        })
   }   
}
</script>

<style>

</style>
