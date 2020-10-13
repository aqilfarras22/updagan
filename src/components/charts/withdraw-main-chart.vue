<template>
  <div id="container-id" :class="containerClass"> <!-- id "container-id" is required to use custom tooltips line indicator -->
    <canvas ref="chart"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'
import { pieChartOptions } from './config'
import { tooltipLineIndicator } from './utils'

const bgColorTemporary = [
  "#B382FE",
  "#FBC952",
  "#00C3B3",
  "#71C200",
  "#00365a",
  "#216491",
  "#245794",
  "#D8D8D8",
];

export default {
  props: {
    data: { type: Object, default: null },
    containerClass: { type: String, default: 'chart-container' },
    shadow: { type: Boolean, default: false },
    legendPostion: { type: String, default: 'right' }
  },
  data() {
    return {
      chart: null,
      baseData: this.data
    }
  },
  watch: {
    data() {
      this.baseData = this.data
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
      const labels = (this.baseData && this.baseData.labels) || []
      const values = (this.baseData && this.baseData.values) || []

      if (this.chart) { /* Destroy old chart if exist */
        this.chart.destroy() /* This line for fixing chartjs from show old data when hover */
      }

      /* Create chart context */
      Chart.Tooltip.positioners.custom1 = function (element, position) {
        return {
          x: position.x,
          y: position.y,
        }
      }

      const context = this.$refs.chart
      this.chart = new Chart(context, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              borderWidth: 2,
              borderColor: bgColorTemporary.map(color => color),
              backgroundColor: bgColorTemporary.map(color => color),
              weight: 0.5,
            }
          ]
        },
        options: {
          ...pieChartOptions,
          tooltips: tooltipLineIndicator
        }
      })
    }
  },
  mounted() {
    this.renderChart()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
</script>
