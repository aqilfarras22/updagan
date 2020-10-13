<template>
  <div :class="containerClass">
    <canvas ref="chart"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js";
import { doughnutChartOptions } from "./config";
import { centerTextPlugin } from "./utils";

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    containerClass: {
      type: String,
      default: "chart-container"
    },
  },
  data() {
    return {
      chart: null,
      componentId: "pie-chart-id",
      newData: this.data
    };
  },
  watch: {
    data() {
      this.newData = this.data;
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      if (this.chart) { // use this for destroy old data from chart js
        this.chart.destroy();
      }

      const ctx = this.$refs.chart;
      this.chart = new Chart(ctx, {
        type: 'scatter',
        data: this.newData,
        options: this.options
      });
    }
  }
};
</script>

