<template>
  <div :class="containerClass">
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
    plugins: {
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
    },
    textLight: { type: Boolean, default: false }
  },
  data() {
    return {
      chart: null,
      componentId: "doughnut-chart-id",
      newData: this.data,
      newOptions: this.options
    };
  },
  watch: {
    data() {
      this.newData = this.data;
      this.renderChart();
    },
    options() {
      this.newOptions = this.options;
      this.renderChart();
    },
  },
  methods: {
    renderChart() {
      if (this.shadow) {
        Chart.defaults.doughnutWithShadow = Chart.defaults.doughnut;
        Chart.controllers.doughnutWithShadow = Chart.controllers.doughnut.extend({
          draw(ease) {
            Chart.controllers.doughnut.prototype.draw.call(this, ease);
            const chartCtx = this.chart.chart.ctx;
            chartCtx.save();
            chartCtx.shadowColor = "rgba(0,0,0,0.15)";
            chartCtx.shadowBlur = 10;
            chartCtx.shadowOffsetX = 0;
            chartCtx.shadowOffsetY = 10;
            chartCtx.responsive = true;
            Chart.controllers.doughnut.prototype.draw.apply(this, arguments);
            chartCtx.restore();
          }
        });
      }
      const ctx = this.$refs.chart;
      if (this.chart) { // use this for destroy old data from chart js
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: this.shadow ? "doughnutWithShadow" : "doughnut",
        data: this.newData,
        textLight: this.textLight,
        options: this.newOptions,
        plugins: [this.plugins]
      });
    }
  },
  mounted(){
    this.renderChart();
  }
};
</script>

