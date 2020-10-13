<template>
  <b-card title="Number of Data Points">
    <p>by site</p>
    <div class=".thread-consent-ct1">
      <div :class="containerClass">
        <bar-chart :data="vis" :options="options" />
      </div>
    </div>
  </b-card>
</template>
<script>
import DataPointBarChart from "../charts/bar-chart-v2.vue";

export default {
  props: {
    vis: { type: Object, default: null },
    containerClass: {
      type: String,
      default: "thread-chart",
    },
  },
  data() {
    return {
      newVis: this.vis,
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
      this.processData();
    },
  },
  components: {
    "bar-chart": DataPointBarChart,
  },
  methods: {
    processData() {
      this.options = {
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          yAxes: [
            {
              stacked: false,
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 100, // Default, will be change before render
              },
            },
            {
              id: "no-stack",
              stacked: false,
              ticks: {
                display: false,
                beginAtZero: true,
                min: 0,
                max: 100, // Default, will be change before render
              },
              scaleLabel: {
                display: true,
                labelString: 'Proportion in %'
              }
            },
          ],
          xAxes: [
            {
              stacked: false,
              ticks: {
                beginAtZero: true,
                callback: function(value, index, values) {
                  var title = value.split(', ');
                  return title[0];
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Site'
              }
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          mode: "index",
          filter: function (item) {
            // Any datasets beyond FPI, First data and average will not have tooltips
            return item.datasetIndex <= 2;
          },
          callbacks: {
            title: function(tooltipItem){
                return this._data.labels[tooltipItem[0].index];
            }
          }
        },
        legend: {
          labels: {
            display: true,
            filter: function (item) {
              // Any unlabeled datasets will not have legends
              return item.text !== "";
            },
          },
        }
      }
      const vis = this.newVis;
      // Chart js seems never get it right if there is stacked bar
      // It just weird to have different yAxes ticks for same space
      // To solve this, it must manually get the maximum of yAxis tick,
      // so both stacked and unstacked should be get true representation of graph
      let maxCount = 0;
      for (let i = 0; i < vis.datasets[0].data.length; i++) {
        // FPI + First Data days
        let maxTemp = vis.datasets[0].data[i] + vis.datasets[1].data[i];
        if (maxTemp > maxCount) {
          maxCount = maxTemp;
        }
      }
      if (maxCount === 0) {
        maxCount = 10;
      }
      this.options.scales.yAxes[0].ticks.max = maxCount;
      this.options.scales.yAxes[1].ticks.max = maxCount;
      this.data = this.newVis;
    }
  }
}
</script>

<style scoped>
.card-title {
  margin-bottom: 0px !important;
}
</style>
