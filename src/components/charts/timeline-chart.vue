<template>
  <div :class="containerClass" :id="componentId" ref="timelineContainer" class="pl-0"></div>
</template>

<script>
// check following url for usage https://github.com/vasturiano/timelines-chart
import TimelinesChart from "timelines-chart";

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    containerClass: {
      type: String,
      default: "thread-chart",
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timelineChart: null,
      componentId: "timeline-area",
      componentWidth: 0,
      newComponentWidth: 0,
      newData: this.data
    };
  },
  watch: {
    data() {
      this.newData = this.data;
      this.render();
    },
  },
  methods: {
    refreshComponentClientWidth() {
      // Refresh timeline width so it would efficiently occupied
      this.componentWidth = this.$refs.timelineContainer.clientWidth;
      if (this.timelineChart != null) {
        this.timelineChart.width(this.componentWidth).refresh();
      }
    },
    componentWidthMonitor() {
      // Detect timeline width
      this.newComponentWidth =
        typeof this.newComponentWidth != "undefined"
          ? this.$refs.timelineContainer.clientWidth
          : this.componentWidth;
      if (this.newComponentWidth != this.componentWidth) {
        this.refreshComponentClientWidth();
      }
      setTimeout(this.componentWidthMonitor, 1500);
    },
    render() {
      const div = document.querySelector(`#${this.componentId}`);
      [].slice.call(div.children).forEach(function(child) {div.removeChild(child)})
      // Always delete component and recreate to avoid color bug and duplication chart
      this.timelineChart = TimelinesChart()(`#${this.componentId}`);
      setTimeout(this.componentWidthMonitor, 1500);

      const {colorProperty} = this.options;
      this.timelineChart
        .data(this.newData)
        .zQualitative(true)
        .zColorScale(colorProperty)
        .width(this.componentWidth )
        .maxLineHeight(24)
        .leftMargin(130)
        .rightMargin(130)
        .refresh();
    },
  },
  async mounted() {
    this.refreshComponentClientWidth();
    this.render();
  },
};
</script>