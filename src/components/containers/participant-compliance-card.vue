<template>
  <b-card :title="$t('enrollment.completionChartTitle')">
    <p class="font-italic">{{$t('datapoint.hoverInformation')}}</p>
    <div class=".thread-consent-ct1">
      <scatter-chart :series="data" :options="options" @onDataPointClick="onDataPointClick"/>
    </div>
  </b-card>
</template>

<script>
import * as d3 from "d3";
import ScatterChart from "../charts/scatter-plot-apex";

export default {
  props: {
    vis: { type: Array, default: [] },
    boundaryValue: { type: Object, default: null },
    onDataPointClick: {
      type: Function
    }
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
    ScatterChart,
  },
  methods: {
    processChartData(){
      const complianceBubbleRadius = d3.scaleLog().domain([this.boundaryValue.minComplianceValue, this.boundaryValue.maxComplianceValue]).range([5, 30]).base(10);
      const completionBubbleRadius = d3.scaleLog().domain([this.boundaryValue.minCompletionValue, this.boundaryValue.maxCompletionValue]).range([5, 30]).base(10);
      this.options = {
        chart: {
          id: 'compliance-bubble-1',
          zoom: {
            enabled: true,
            type: 'xy'
          }
        },
        dataLabels: {
          enabled: false
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
          max: 110,
          min:-10,
          // forceNiceScale:true,
          tickAmount:12,
        },
        tooltip: {
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              if (value !== 0 && value !== 100){
                const minVal = value - 5;
                const maxVal = value + 5;
                return `${minVal}% - ${maxVal}%`
              }
              return value + '%'
            }
          },
          z: {
            formatter: (val, config, abc)=> {
              return `${Math.round(complianceBubbleRadius.invert(val))} (Click for more details)`;
            },
            title: 'Number of participants'
          }
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
