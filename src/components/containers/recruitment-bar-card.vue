<template>
  <b-card title="Recruitment Days Chart">
    <div class=".thread-consent-ct1">
      <div class="recruitment-bar-container">
        <bar-chart :data="data" :options="options"/>
      </div>
    </div>
  </b-card>
</template>
<script>
import Chart from "chart.js";
import RecruitmentBarChart from "../charts/bar-chart-v2.vue";
import {recruitmentBarOptions} from '../charts/config';

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
      options: recruitmentBarOptions,
      data: null,
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
      this.processData();
    },
  },
  components: {
    "bar-chart": RecruitmentBarChart,
  },
  methods: {
    processData() {
      const vis = this.newVis.data;
      // Chart js seems never get it right if there is stacked bar
      // It just weird to have different yAxes ticks for same space
      // To solve this, it must manually get the maximum of yAxis tick,
      // so both stacked and unstacked should be get true representation of graph
      var maxCount = 0;
      for (var i = 0; i < vis.datasets[0].data.length; i++) {
        // FPI + First Data days
        var maxTemp = vis.datasets[0].data[i] + vis.datasets[1].data[i];
        if (maxTemp > maxCount) {
          maxCount = maxTemp;
        }
      }
      if (maxCount === 0) {
        maxCount = 10;
      }
      this.options.scales.yAxes[0].ticks.max = maxCount;
      this.options.scales.yAxes[1].ticks.max = maxCount;
      this.options.legend.onClick = function(e, legendItem) { // This is for recalculate average everytime FPI/FirstData clicked
                                                              // dont use es6 ()=> to get bounded context of this (this.chart)
        var index = legendItem.datasetIndex;
        if (index === 2) { // Refer to bar data index in services/visualization/recruitment line 110, 111, 122
          Chart.defaults.global.legend.onClick.call(this, e, legendItem);
          return;
        }
        const oppositeIndex = index === 0 ? 1 : 0;
        let ci = this.chart;
        const alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;
        const oppositeAlreadyHidden = (ci.getDatasetMeta(oppositeIndex).hidden === null) ? false : ci.getDatasetMeta(oppositeIndex).hidden;
        const totalSites = this.chart.data.datasets[2].totalSites;
        const newAvgDataset = [];
        if (alreadyHidden) {
          if (oppositeAlreadyHidden) {
            for (let i = 0; i < totalSites; i++) {
              newAvgDataset.push(this.chart.data.datasets[2].avg[index]);
            }
            this.chart.data.datasets[2].data = newAvgDataset;
          } else {
            for (let i = 0; i < totalSites; i++) {
              newAvgDataset.push(this.chart.data.datasets[2].avg[2]);
            }
            this.chart.data.datasets[2].data = newAvgDataset;
          }
        } else {
          if (oppositeAlreadyHidden) {
            for (let i = 0; i < totalSites; i++) {
              newAvgDataset.push(0);
            }
            this.chart.data.datasets[2].data = newAvgDataset;
          } else {
            for (let i = 0; i < totalSites; i++) {
              newAvgDataset.push(this.chart.data.datasets[2].avg[oppositeIndex]);
            }
            this.chart.data.datasets[2].data = newAvgDataset;
          }
        }
        this.chart.update();
        Chart.defaults.global.legend.onClick.call(this, e, legendItem)
      };
      this.data = vis;
    },
  }
};
</script>
