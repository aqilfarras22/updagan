import { Doughnut } from 'vue-chartjs';
import Chart from 'chart.js';

export default {
  extends: Doughnut,
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
      this.renderDonutChart();
    },
  },
  methods: {
    renderDonutChart() {
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
    this.addPlugin({
      id: 'custom-tooltips',
      beforeRender(chart) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = []; // eslint-disable-line
          chart.config.data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach(sector => {
              chart.pluginTooltips.push(
                new Chart.Tooltip(
                  {
                    _chart: chart.chart,
                    _chartInstance: chart,
                    _data: chart.data,
                    _options: chart.options.tooltips,
                    _active: [sector],
                  },
                  chart,
                ),
              );
            });
          });

          // turn off normal tooltips
          chart.options.tooltips.enabled = false; // eslint-disable-line
        }
      },
      afterDraw(chart, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate,
          // so don't do anything till the animation runs atleast once
          // if (!chart.allTooltipsOnce) {
          //   if (easing !== 1) return;
          //   chart.allTooltipsOnce = true; // eslint-disable-line
          // }

          // turn on tooltips
          chart.options.tooltips.enabled = true; // eslint-disable-line
          Chart.helpers.each(chart.pluginTooltips, tooltip => {
            tooltip.initialize();
            tooltip.update();
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false; // eslint-disable-line
        }
      },
    });
    this.renderDonutChart();
  },
};
