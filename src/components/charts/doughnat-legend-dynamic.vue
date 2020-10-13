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
      type: Object
    },
    containerClass: {
      type: String,
      default: "chart-container"
    },
    shadow: {
      type: Boolean,
      default: false
    },
    legendPosition: {
      type: String,
      default: 'right'
    }
  },
  data() {
    return {
      doughnutData: this.data
    }
  },
  watch: {
    data() {
      this.doughnutData = this.data
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
      let chart = null
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

      if (chart) {
        chart.destroy()
      }

      chart = new Chart(ctx, { // eslint-disable-line
        type: this.shadow ? "doughnutWithShadow" : "doughnut",
        data: this.doughnutData,
        options: {
          ...doughnutChartOptions,
          legend: {
            ...doughnutChartOptions.legend,
            position: this.legendPosition,
            align: 'start',
            fullWidth: false,
            labels: {
              ...doughnutChartOptions.legend.labels,
              fontSize: 10,
              boxWidth: 5,
              fontColor: '#666'
            }
          }
        },
        plugins: [centerTextPlugin]
      });
    }
  },
  mounted() {
    this.renderChart()
  }
};
</script>
