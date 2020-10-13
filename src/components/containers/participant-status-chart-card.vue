<template>
  <b-card :title="title">
    <div class="pie-chart-participant">
      <pie-chart :data="data" :options="options"></pie-chart>
    </div>
  </b-card>
</template>
<script>
import PieChart from '../charts/pie-chart';
import { pieChartOptions } from '../charts/config'
import { tooltipLineIndicator } from '../charts/utils'

const bgColorTemporary = ['#B382FE', '#FBC952', '#00C3B3', '#71C200', '#00365a', '#216491', '#245794', '#D8D8D8']
const capitalize = string => string.toLowerCase().replace(/(^\w|\s\w)/g, char => char.toUpperCase())

export default {
  components: {
    PieChart
  },
  props: {
    vis: { type: Object, default: null },
    title: { type: String, default: '' }
  },
  data() {
    return {
      data: null,
      newVis: this.vis,
      options: null
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
      this.processChartData();
    }
  },
  methods: {
    processChartData(){
      const chartDataValues = (this.newVis && this.newVis.values) || [];
      const statusKey = { ACTIVE: 'Active', DISQUALIFIED: 'Disqualified', INVITED: 'Invited', NOTINVITED: 'Not Invited', 'Pending Invitation': 'Pending Invitation', VERIFIED: 'Verified', REGISTERED: 'Registered', WITHDRAWSTUDY: 'Withdraw Study' }

      this.data = {
        labels: (this.newVis && this.newVis.labels.map(item => statusKey[item])) || [],
        datasets: [
          {
            data: chartDataValues,
            borderColor: bgColorTemporary.map(color => color),
            backgroundColor: bgColorTemporary.map(color => color),
            borderWidth: 2
          }
        ]
      };
      this.options = {
        ...pieChartOptions,
        tooltips: tooltipLineIndicator
      }
    }
  }
};
</script>
