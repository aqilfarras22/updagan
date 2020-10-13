<template>
  <div :class="containerClass" :id="containerId">
    <canvas ref="chart" id="canvas-chart-id"></canvas>
    <div :id="floatingLegendId"></div>
  </div>
</template>
<script>
import Chart from "chart.js";

export default {
  props: {
    containerClass: {
      type: String,
      default: "chart-container",
    },
    data: { type: Object, default: null },
    options: { type: Object, default: null },
    containerId: { type: String, default: 'container-bubble-id' },
    floatingLegend: { type: Boolean, default: false },
    floatingLegendId: { type: String, default: 'floating-legend-id' }
  },
  data() {
    return {
      newVis: this.data,
      chart: null,
    };
  },
  watch: {
    data() {
      this.newVis = this.data;
      this.renderCharts()
    }
  },
  methods: {
    renderCharts() {
      if (this.chart) { /* use this for destroy old data from chart js */
        this.chart.destroy()
      }

      const ctx = this.$refs.chart.getContext("2d");
      this.chart = new Chart(ctx, {
        type: 'bubble',
        data: this.newVis,
        options: this.options
      });

      // ============================================================
      // |      Generate custom legend if floating legend true      |
      // ===========================================================|
      if (this.floatingLegend && this.floatingLegendId) {
        let container = document.getElementById(this.containerId)
        const hasLegend = container.querySelector(`#${this.floatingLegendId}`) !== null

        if (hasLegend) {
          const elementLegend = container.querySelector(`#${this.floatingLegendId}`)
          elementLegend.innerHTML = this.chart.generateLegend()
          elementLegend.classList.add('floating-legend--custom')

          elementLegend.addEventListener('mouseenter', function (evt) {
            elementLegend.classList.add('floating-legend--custom--op-1')
          })

          elementLegend.addEventListener('mouseleave', function (evt) {
            elementLegend.classList.remove('floating-legend--custom--op-1')
          })
        }
      }
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
};
</script>

