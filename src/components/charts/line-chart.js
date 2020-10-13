import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: {
    data: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    notResponsive: {
      type: Boolean,
      default: false,
    },
    sortByValue: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const yPadding = !this.notResponsive ? 15 : this.height / 10;
    const xPadding = !this.notResponsive ? 15 : this.width / 10;
    return {
      colors: ['#48bf7a', 'green'],
      opts: {
        rotation: -0.65 * Math.PI,
        borderWidth: 1,
        responsive: !this.notResponsive,
        cutoutPercentage: 85,
        showAllTooltips: true,
        ...this.options,
        tooltips: {
          backgroundColor: 'rgba(0,0,0,0)',
          displayColors: false,
          bodyFontSize: 14,
          yPadding,
          xPadding,
          callbacks: {
            label: (tooltip, d) => d.datasets[tooltip.datasetIndex].data[tooltip.index],
            labelTextColor: (tooltip, chart) => chart.config.data.datasets[tooltip.datasetIndex]
              .backgroundColor[tooltip.index],
          },
          ...this.options.tooltips,
        },
        legend: {
          display: false,
          ...this.options.legend,
        },
      },
    };
  },
  watch: {
    data() {
      this.renderLineChart();
    },
  },
  methods: {
    renderLineChart() {
      let { data } = this;
      if (this.sortByValue) {
        data = data.sort((a, b) => a.value - b.value);
      }
      const prepearedData = {
        labels: data.map(item => item.label),
        datasets: [
          {
            backgroundColor: data[0].color ? data.map(item => item.color) : this.colors,
            data: data.map(item => item.value),
          },
        ],
      };

      this.renderChart(prepearedData, this.opts);
    },
  },
  mounted() {
    this.renderLineChart();
  },
};
