<template>
  <b-card title="Recruitment Days Timeline">
    <div class=".thread-consent-ct1">
      <timeline-bar :data="data" :options="options" />
    </div>
  </b-card>
</template>
<script>
import * as d3 from "d3";
import RecruitmentTimelineChart from "../charts/timeline-chart";
import * as constant from "../../constants/config";

export default {
  props: {
    vis: { type: Object, default: null }
  },
  data() {
    return {
      data: null,
      newVis: this.vis,
      options: null
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
      this.processChartData();
    }
  },
  components: {
    "timeline-bar": RecruitmentTimelineChart
  },
  methods: {
    processChartData(){
      const currentFilterFpi = this.newVis.fpiSelected;

      // Workaround for filter label, sometimes you would like to filter to only one FPI or first data
      // But you must select the one you really want to display
      var colorScaleOrd = [];
      var colorDomain = [];
      switch (currentFilterFpi) {
        case "all":
          colorScaleOrd = ["rgba(0, 195, 179, 1)", "#FBC952"];
          colorDomain = [constant.TL_FPI_LABEL, constant.TL_FIRST_DATA_LABEL];
          break;
        case "fpi":
          colorScaleOrd = ["rgba(0, 195, 179, 1)"];
          colorDomain = [constant.TL_FPI_LABEL];
          break;
        case "first_data":
          colorScaleOrd = ["#FBC952"];
          colorDomain = [constant.TL_FIRST_DATA_LABEL];
          break;
      }
      this.options = {}
      this.options.colorProperty = d3.scaleOrdinal(colorScaleOrd).domain(colorDomain);
      
      this.data = this.newVis.data;
    }
  },
  mounted(){
    this.processChartData();
  }
};
</script>
