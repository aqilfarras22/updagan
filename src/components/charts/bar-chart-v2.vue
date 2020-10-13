
<template>
  <div :class="containerClass" :id="containerId">
    <canvas ref="chart" id="canvas-chart-id"></canvas>
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
    containerId: { type: String, default: 'container-bar-id' },
    containerClass: { type: String, default: 'chart-container' },
    options: { type: Object, default: null },
  },
  data() {
    return {
      componentId: "barchart-area",
      newData: this.data,
      chart: null,
    };
  },
  watch: {
    data() {
      this.newData = this.data;
      this.render();
    },
  },
  methods: {
    render() {
      if (this.chart) { // use this for destroy old data from chart js
        this.chart.destroy();
      }
      const ctx = this.$refs.chart.getContext("2d");
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.newData,
        options: this.options
      });
      
    },
  },
  mounted() {
    this.render();
  },
};
</script>
