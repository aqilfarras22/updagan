<template>
  <div :class="containerClass">
    <apexchart width="100%" type="line" @dataPointSelection="dataPointSelectionHandler" :options="chartOptions" :series="chartSeries"></apexchart>
  </div>
</template>
<script>

export default {
  props: {
    series: {
      type: Array,
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
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null,
      componentId: "pie-chart-id",
      chartSeries: this.series,
      chartOptions: this.options,
    };
  },
  watch: {
    series() {
      this.chartSeries = this.series;
    },
    options() {
      this.chartOptions = this.options;
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
        data: this.chartData,
        options: this.options
      });
    },
    dataPointSelectionHandler(e, chartContext, config) {
      this.$emit('onDataPointClick', {chartContext, config});
    }
  }
};
</script>

