<template>
  <div :class="containerClass" id="container-id"> <!-- id "container-id" is required to use custom tooltips line indicator -->
    <canvas ref="chart"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js";

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
    shadow: {
      type: Boolean,
      default: false
    }
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

      this.chart = new Chart(this.$refs.chart, {
        type: "pie",
        data: this.newData,
        options: this.options
      });
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>
