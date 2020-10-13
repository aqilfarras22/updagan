<template>
  <b-card :title="title">
    <div class="pie-chart-withdraw">
      <withdraw-main-chart :title="title" :data="dataVisualization"></withdraw-main-chart>
    </div>
  </b-card>
</template>
<script>
import WithdrawMainChart from './withdraw-main-chart'

export default {
  components: {
    'withdraw-main-chart': WithdrawMainChart
  },
  props: {
    vis: { type: Object, default: null } /* Data for visualize chart */,
    title: { type: String, default: '' } /* Chart title */
  },
  data() {
    return {
      dataVisualization: this.vis
    }
  },
  watch: {
    vis() {
      this.dataVisualization = this.vis
    }
  }
}
</script>
