<template>
  <b-card :title="titleChart" :sub-title="subtitleChart">
    <div class="thread-bubble-chart">
      <bubble-chart
        :data="data"
        :floatingLegend="floatingLegend"
        :floatingLegendId="floatingLegendId"
        :containerId="containerId"
        :options="options"
      />
    </div>
  </b-card>
</template>
<script>
import BubbleChart from "../charts/bubble";
import { consentBubbleChartOptions, chartAnnotations } from '../charts/config'
import { floatingChartLegend, chartTooltip, tooltipEconsent } from '../charts/utils'

export default {
  props: {
    vis: { type: Object, default: null },
    scallabelX:  { type: String },
    scallabelY: { type: String },
    titleChart: { type: String },
    subtitleChart: { type: String, default: '' },
    annotation: { type: Object },
    containerId: { type: String },
    floatingLegend: { type: Boolean },
    floatingLegendId: { type: String },
    tooltipCallbacks: Object
  },
  data() {
    return {
      newVis: this.vis,
      data: null,
      options: null
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
      this.processData();
    }
  },
  components: {
    BubbleChart,
  },
  methods: {
    processData() {
      if (this.annotation) { /* Create annotation horizontal and vertical */
        chartAnnotations.annotation.annotations[0].value = this.annotation.verticalValue
        chartAnnotations.annotation.annotations[0].label.content = `${this.annotation.verticalContent} - (${this.annotation.verticalValue} %)`

        chartAnnotations.annotation.annotations[1].value = this.annotation.horizontalValue
        chartAnnotations.annotation.annotations[1].label.content = `${this.annotation.horizontalContent} - (${this.annotation.horizontalValue} %)`
      }

      if (this.scallabelX || this.scallabelY) { /* Add scallabel label */
        consentBubbleChartOptions.scales.xAxes[0].scaleLabel.display = true
        consentBubbleChartOptions.scales.xAxes[0].scaleLabel.labelString = this.scallabelX

        consentBubbleChartOptions.scales.yAxes[0].scaleLabel.display = true
        consentBubbleChartOptions.scales.yAxes[0].scaleLabel.labelString = this.scallabelY
      }

      if (this.floatingLegend) { /* Options to using custom floating legend */
        consentBubbleChartOptions.legendCallback = floatingChartLegend
        consentBubbleChartOptions.legend = null
      } else {
        consentBubbleChartOptions.legend = {
          position: 'bottom',
          labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12,
            boxWidth: 9,
            fontFamily: 'Open Sans, sans-serif'
          }
        }
      }

      const mergeOptions = this.annotation /* Merge all options */
        ? Object.assign({},
          consentBubbleChartOptions,
          chartAnnotations, {
            tooltips: {
              ...chartTooltip,
              ...this.tooltipCallbacks
            }
          }
        ) : consentBubbleChartOptions
      this.options = mergeOptions;
      this.data = this.newVis;
    }
  },
  mounted(){
    this.processData();
  }
};
</script>
