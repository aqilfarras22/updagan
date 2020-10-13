<template>
  <b-card :title="title" class="card-full">
    <div class="most-participant-status-chart">
      <doughnut-legend-dynamic :data="doughnutChartData" :legendPosition="legendPosition" shadow />
    </div>
  </b-card>
</template>
<script>
import DoughnatLegendDynamic from '../charts/doughnat-legend-dynamic';

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    title: {
      type: String
    },
    legendPosition: {
      type: String,
      default: 'right'
    }
  },
  components: {
    "doughnut-legend-dynamic": DoughnatLegendDynamic
  },
  data() {
    return {
      doughnutChartData: this.data
    };
  },
  watch: {
    data(){
      this.doughnutChartData = this.data
    }
  }
};
</script>
