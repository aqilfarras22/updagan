import { chartTooltip } from './utils';
import 'chartjs-plugin-annotation';

const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];

const color = index => {
  return COLORS[index % COLORS.length];
}

export const lineChartOptions = {
  legend: {
    display: false
  },
  responsive: true,
  maintainAspectRatio: false,
  tooltips: chartTooltip,
  plugins: {
    datalabels: {
      display: false
    }
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          min: 50,
          max: 70,
          padding: 20
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  }
}
export const recruitmentBarOptions = {
  hover: {
    mode: "nearest",
    intersect: true,
  },
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 50, // Default, will be change before render
        },
      },
      {
        id: "no-stack",
        stacked: false,
        ticks: {
          display: false,
          beginAtZero: true,
          min: 0,
          max: 50, // Default, will be change before render
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
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
  },
  legend: {
    labels: {
      display: true,
      filter: function (item) {
        // Any unlabeled datasets will not have legends
        return item.text !== "";
      },
    }
  },
}
export const polarAreaChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scale: {
    ticks: {
      display: false
    }
  },
  plugins: {
    datalabels: {
      display: false
    }
  },
  tooltips: chartTooltip
}

export const areaChartOptions = {
  legend: {
    display: false
  },
  responsive: true,
  maintainAspectRatio: false,
  tooltips: chartTooltip,
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          min: 50,
          max: 70,
          padding: 20
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  }
}

export const scatterChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          beginAtZero: true,
          stepSize: 20,
          min: -80,
          max: 80,
          padding: 20
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)'
        }
      }
    ]
  },
  tooltips: chartTooltip
}

export const barChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          beginAtZero: true,
          stepSize: 100,
          min: 300,
          max: 800,
          padding: 20
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  },
  tooltips: chartTooltip
}

export const consentBarChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          beginAtZero: true,
          stepSize: 100,
          min: 0,
          max: 100,
          padding: 20
        },
        stacked: true,
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: false
        },
        stacked: true,
      }
    ]
  },
  tooltips: chartTooltip,
  plugins: {
    zoom: {
      zoom: {
        enabled: true,
        drag: {
          animationDuration: 1000
        },
        mode: 'x',
        speed: 0.05
      }
    }
  }
}

function colorize(opaque, context) {
  var value = context.dataset.data[context.dataIndex];
  var x = value.x / 100;
  var y = value.y / 100;
  var r = x < 0 && y < 0 ? 250 : x < 0 ? 150 : y < 0 ? 50 : 0;
  var g = x < 0 && y < 0 ? 0 : x < 0 ? 50 : y < 0 ? 150 : 250;
  var b = x < 0 && y < 0 ? 0 : x > 0 && y > 0 ? 250 : 150;
  var a = opaque ? 1 : (0.5 * value.v) / 1000;

  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

export const consentBubbleChartOptions = {
  aspectRatio: 1,
  legend: null,
  responsive: true,
  maintainAspectRatio: false,
  legendCallback: null,
  layout: {
    padding: {
      left: 40,
      right: 40,
      top: 20,
      bottom: 20
    }
  },
  elements: {
    point: {
      backgroundColor: colorize.bind(null, false),

      borderColor: colorize.bind(null, true),

      borderWidth: function (context) {
        return Math.min(Math.max(1, context.datasetIndex + 1), 8);
      },

      hoverBackgroundColor: "transparent",

      hoverBorderColor: function (context) {
        return color(context.datasetIndex); //TODO change to background color.
      },

      hoverBorderWidth: function (context) {
        var value = context.dataset.data[context.dataIndex]; //TODO change this and below line to add more size from the current width
        return Math.round((8 * value.v) / 1000);
      },

      radius: function (context) {
        var value = context.dataset.data[context.dataIndex];
        var size = context.chart.width;
        var base = Math.abs(value.v) / 1000;
        return (size / 24) * base;
      },
    },
  },
  scales: {
    xAxes: [
      {
        position: 'bottom',
        stack: true,
        ticks: {
          beginAtZero: true,
          max: 100,
          callback: function (value) { return value + '%' }
        },
        scaleLabel: {
          display: false,
          labelString: ''
        }
      }
    ],
    yAxes: [
      {
        position: 'bottom',
        stack: true,
        ticks: {
          beginAtZero: true,
          max: 100,
          callback: function (value) { return value + ' %' }
        },
        scaleLabel: {
          display: false,
          labelString: ''
        },
      }
    ],
  }
}

export const chartAnnotations = {
  annotation: {
    annotations: [
      {
        drawTime: "afterDatasetsDraw",
        type: "line",
        mode: "vertical",
        scaleID: "x-axis-0",
        value: 0,
        borderWidth: 1,
        borderColor: "rgba(93, 93, 93, .65)",
        borderDash: [10],
        borderDashOffset: 10,
        label: {
          content: '',
          enabled: true,
          position: "top",
          fontSize: 12,
          fontStyle: 'normal',
          fontFamily: "Open Sans, sans-serif",
          backgroundColor: "rgba(93, 93, 93, .95)",
          xPadding: 16,
          yPadding: 4
        }
      },
      {
        drawTime: "afterDatasetsDraw",
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        value: 0,
        borderWidth: 1,
        borderColor: "rgba(93, 93, 93, .65)",
        borderDash: [10],
        borderDashOffset: 10,
        label: {
          content: '',
          enabled: true,
          position: "right",
          fontSize: 12,
          fontStyle: 'normal',
          fontFamily: "Open Sans, sans-serif",
          backgroundColor: 'rgba(93, 93, 93, .95)',
          xPadding: 16,
          yPadding: 4
        }
      },
    ]
  },
}

export const radarChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scale: {
    ticks: {
      display: false
    }
  },
  tooltips: chartTooltip
}

export const pieChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12,
      boxWidth: 7
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: false
  },
  layout: {
    padding: {
      bottom: 20
    }
  },
  tooltips: chartTooltip
}

export const doughnutChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: false
  },
  cutoutPercentage: 80,
  layout: {
    padding: {
      bottom: 20
    }
  },
  tooltips: chartTooltip
}

export const smallLineChartOptions = {
  layout: {
    padding: {
      left: 5,
      right: 5,
      top: 10,
      bottom: 10
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        },
        display: false
      }
    ],
    xAxes: [
      {
        display: false
      }
    ]
  }
  // tooltips: {
  //   intersect: false,
  //   enabled: false,
  //   custom: function(tooltipModel) {
  //     if (tooltipModel && tooltipModel.dataPoints) {
  //       var yLabel = tooltipModel.dataPoints[0].yLabel;
  //       var xLabel = tooltipModel.dataPoints[0].xLabel;
  //       var label = tooltipModel.body[0].lines[0].split(":")[0];
  //     //  changeState("$" + addCommas(yLabel), label + "-" + xLabel);
  //     }
  //   }
  // },
  // plugins:{[
  //   {
  //     afterInit: function(chart, options) {
  //       var yLabel = chart.data.datasets[0].data[0];
  //       var xLabel = chart.data.labels[0];
  //       var label = chart.data.datasets[0].label;
  //       changeState("$" + addCommas(yLabel), label + "-" + xLabel);
  //     }
  //   }
  // ]}
}
