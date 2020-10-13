<template>
  <b-card :title="$t('datapoint.compliancePerformance')">
    <div :class="containerClass">
      <line-chart :series="data" :options="options" @onDataPointClick="onDataPointClick"/>
    </div>
  </b-card>
</template>

<script>
import * as d3 from "d3";
import LineChart from "../charts/line-chart-apex";

export default {
  props: {
    vis: { type: Array, default: [] },
    boundaryValue: { type: Object, default: null },
    onDataPointClick: {
      type: Function
    },
    containerClass: { type: String, default: '.thread-consent-ct1' },
  },
  data() {
    return {
      newVis: this.vis,
      series: null,
      options: null,
      brushOptions: null,
      data: []
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
      this.processChartData();
    }
  },
  components: {
    LineChart,
  },
  methods: {
    processChartData(){
      const complianceBubbleRadius = d3.scaleLog().domain([this.boundaryValue.minComplianceValue, this.boundaryValue.maxComplianceValue]).range([5, 30]).base(10);
      const completionBubbleRadius = d3.scaleLog().domain([this.boundaryValue.minCompletionValue, this.boundaryValue.maxCompletionValue]).range([5, 30]).base(10);
      this.options = {
        chart: {
          id: 'compliance-line-1',
          zoom: {
            enabled: true,
            type: 'xy'
          }
        },
        stroke: {
          width: [7,4, 4],
          curve: 'straight',
          dashArray: [8]
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
          // formatter: function(val, opts) {
          //   console.log(val)
          //   console.log(opts)
          //   if (opts.seriesIndex === 0){
          //     return val;
          //   } else {
          //     return null
          //   }
          //   // return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          // }
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          },
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          max: 100
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 8
          }
        },
        tooltip: {
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return value + '%'
            }
          },
        }
      };
      this.data = this.newVis;
    }
  },
  mounted(){
    this.newVis = this.vis;
    this.processChartData();
  }
};
</script>
