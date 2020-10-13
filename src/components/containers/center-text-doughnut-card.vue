<template>
  <b-card :title="title">
    <div class="doughnut-card">
      <doughnut-chart :data="doughnutChartData" shadow :textLight="textLight" :plugins="plugins" :options="options"/>
    </div>
  </b-card>
</template>
<script>
import DoughnutChart from "../charts/doughnut";
import { doughnutChartOptions } from "../charts/config";
import { centerTextPlugin } from "../charts/utils";

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    title: {
      type: String
    },
    textLight: { type: Boolean, default: false }
  },
  components: {
    "doughnut-chart": DoughnutChart
  },
  data() {
    return {
      doughnutChartData: this.data,
      options: null,
      plugins: centerTextPlugin
    };
  },
  watch: {
    data(){
      this.doughnutChartData = this.data;
      this.processChartData();
    }
  },
  methods: {
    processChartData(){
      doughnutChartOptions.legend.labels.fontFamily = '"Open Sans", sans-serif'
      doughnutChartOptions.legend.labels.boxWidth = 7

      if (this.textLight) {
        doughnutChartOptions.legend.labels.fontColor = '#fff'
      } else {
        doughnutChartOptions.legend.labels.fontColor = '#5d5d5d'
      }

      this.options = doughnutChartOptions;
    }
  },
  mounted() {
    this.doughnutChartData = this.data;
    this.processChartData();
  },
};
</script>
