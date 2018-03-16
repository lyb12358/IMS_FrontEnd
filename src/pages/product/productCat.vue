<template>
  <q-page padding>
    <div class="row justify-center">
      <div>
        <div class="q-mb-sm">
          <q-btn size="sm"
                 color="primary"
                 @click="selectGoodService"
                 label="Select 'Good service'" />
          <q-btn v-if="selected"
                 size="sm"
                 color="red"
                 @click="unselectNode"
                 label="Unselect node" />
        </div>
        <q-tree :nodes="props"
                default-expand-all
                ref="tree"
                :selected.sync="selected"
                node-key="label" />

      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    selected: null,
    props: [
      {
        label: 'Satisfied customers',
        children: [
          {
            label: 'Good food',
            children: [
              { label: 'Quality ingredients' },
              { label: 'Good recipe' }
            ]
          },
          {
            label: 'Good service',
            children: [
              { label: 'Prompt attention' },
              { label: 'Professional waiter' }
            ]
          },
          {
            label: 'Pleasant surroundings',
            children: [
              {
                label: 'Happy atmosphere'
              },
              {
                label: 'Good table presentation'
              },
              {
                label: 'Pleasing decor'
              }
            ]
          }
        ]
      }
    ]
  }),
  methods: {
    selectGoodService() {
      if (this.selected !== 'Good service') {
        this.selected = 'Good service'
      }
    },
    unselectNode() {
      this.selected = null
    }
  },
  computed: {
    xx() {
      if (null != this.selected) {
        console.log(this.$refs.tree.getNodeByKey(this.selected).label)
        return this.$refs.tree.getNodeByKey(this.selected)
      }
    }
  }
}
</script>

<style>

</style>
