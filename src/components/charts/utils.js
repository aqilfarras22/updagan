/* eslint-disable no-param-reassign */
// export const ThemeColors = () => {
//   let rootStyle = getComputedStyle(document.body);
//   console.log('this must be');
//   console.log(rootStyle)
//   return {
//     themeColor1: rootStyle.getPropertyValue('$theme-color-1').trim(),
//     themeColor2: rootStyle.getPropertyValue('$theme-color-2').trim(),
//     themeColor3: rootStyle.getPropertyValue('$theme-color-3').trim(),
//     themeColor4: rootStyle.getPropertyValue('$theme-color-4').trim(),
//     themeColor5: rootStyle.getPropertyValue('$theme-color-5').trim(),
//     themeColor6: rootStyle.getPropertyValue('$theme-color-6').trim(),
//     themeColor1_10: rootStyle.getPropertyValue('$theme-color-1-10').trim(),
//     themeColor2_10: rootStyle.getPropertyValue('$theme-color-2-10').trim(),
//     themeColor3_10: rootStyle.getPropertyValue('$theme-color-3-10').trim(),
//     themeColor4_10: rootStyle.getPropertyValue('$theme-color-3-10').trim(),
//     themeColor5_10: rootStyle.getPropertyValue('$theme-color-3-10').trim(),
//     themeColor6_10: rootStyle.getPropertyValue('$theme-color-3-10').trim(),
//     primaryColor: rootStyle.getPropertyValue('$primary-color').trim(),
//     foregroundColor: rootStyle.getPropertyValue('$foreground-color').trim(),
//     separatorColor: rootStyle.getPropertyValue('$separator-color').trim()
//   }
// }
export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body)
  return {
    themeColor1: rootStyle.getPropertyValue('--theme-color-1').trim(),
    themeColor2: rootStyle.getPropertyValue('--theme-color-2').trim(),
    themeColor3: rootStyle.getPropertyValue('--theme-color-3').trim(),
    themeColor4: rootStyle.getPropertyValue('--theme-color-4').trim(),
    themeColor5: rootStyle.getPropertyValue('--theme-color-5').trim(),
    themeColor6: rootStyle.getPropertyValue('--theme-color-6').trim(),
    themeColor1_10: rootStyle.getPropertyValue('--theme-color-1-10').trim(),
    themeColor2_10: rootStyle.getPropertyValue('--theme-color-2-10').trim(),
    themeColor3_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor4_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor5_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor6_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    primaryColor: rootStyle.getPropertyValue('--primary-color').trim(),
    foregroundColor: rootStyle.getPropertyValue('--foreground-color').trim(),
    separatorColor: rootStyle.getPropertyValue('--separator-color').trim()
  }
}
const colors = ThemeColors();

export const chartTooltip = {
  backgroundColor: colors.foregroundColor,
  titleFontColor: colors.primaryColor,
  borderColor: colors.separatorColor,
  borderWidth: 0.5,
  bodyFontColor: colors.primaryColor,
  bodySpacing: 10,
  xPadding: 15,
  yPadding: 15,
  cornerRadius: 0.15
}


export const centerTextPlugin = {
  afterDatasetsUpdate: function (chart) {},
  beforeDraw: function (chart) {
    var width = chart.chartArea.right
    var height = chart.chartArea.bottom
    var ctx = chart.chart.ctx
    let isTextLight = null
    let config = chart.config
    ctx.restore()

    if ('textLight' in config) {
      isTextLight = config.textLight
    }

    var activeLabel = chart.data.labels[0]
    var activeValue = chart.data.datasets[0] ? chart.data.datasets[0].data[0] : {}
    var dataset = chart.data.datasets[0] || null
    var meta = dataset ? dataset._meta[Object.keys(dataset._meta)[0]] : null
    var total = meta ? meta.total : 0

    var activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1))
    activePercentage = (chart.legend.legendItems[0] && chart.legend.legendItems[0].hidden)
      ? 0
      : activePercentage

    if (chart.pointAvailable) {
      activeLabel = chart.data.labels[chart.pointIndex]
      activeValue =
        chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex]

      dataset = chart.data.datasets[chart.pointDataIndex]
      meta = dataset._meta[Object.keys(dataset._meta)[0]]
      total = meta.total
      activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1))
      activePercentage = chart.legend.legendItems[chart.pointIndex].hidden
        ? 0
        : activePercentage
    }

    ctx.font = '30px Open Sans, sans-serif'
    ctx.fillStyle = !isTextLight ? colors.primaryColor : '#ffffff'
    ctx.textBaseline = 'middle'

    var text = activePercentage + '%'
    var textX = Math.round((width - ctx.measureText(text).width) / 2)
    var textY = height / 2
    ctx.fillText(text, textX, textY)

    ctx.font = '14px Open Sans, sans-serif'
    ctx.textBaseline = 'middle'

    var text2 = activeLabel
    var textX2 = Math.round((width - ctx.measureText(text2).width) / 2)
    var textY2 = height / 2 - 30
    ctx.fillText(text2, textX2, textY2)

    ctx.save()
  },
  beforeEvent: function (chart, event, options) {
    var firstPoint = chart.getElementAtEvent(event)[0]

    if (firstPoint) {
      chart.pointIndex = firstPoint._index
      chart.pointDataIndex = firstPoint._datasetIndex
      chart.pointAvailable = true
    }
  }
}

export const addCommas = nStr => {
  nStr += ''
  var x = nStr.split('.')
  var x1 = x[0]
  var x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}

export const chartTooltipWithPercentage = {
  callbacks: {
    label: function (tooltipItem, chart) {
      const sum = array => array.reduce((a,b) => a + b, 0)

      const index = tooltipItem.index
      const labels = chart.labels
      const data = chart.datasets[0].data
      const activeLabel = labels[index]
      const activeValue = data[index]
      const totalValue = sum(data)
      const percentage = parseFloat((activeValue / totalValue) * 100).toFixed(1)

      return `${activeLabel} : ${activeValue} (${percentage} %)`
    }
  }
}

export const tooltipLineIndicator = {
  enabled: false,
  custom: function (tooltip) {
    const _chart = this._chart
    const _data = this._data
    const TOOLTIP_CHART_ID = 'tooltip-custom-chart'
    const chartWidth = _chart.chart.width

    // Configuration
    let metaTotal = 0
    let tooltipElement = document.getElementById(TOOLTIP_CHART_ID) /* Get element tooltip */
    let containerChartElement = document.getElementById('container-id') /* Get element by container id */

    containerChartElement.style.position = 'relative'

    let isChartWidthGtCaretX = (chartWidth / 2) > tooltip.caretX /* Check if chart width is greater than tooltip caret x */

    if (!tooltipElement) {
      tooltipElement = document.createElement('div')
      tooltipElement.id = TOOLTIP_CHART_ID
      tooltipElement.classList.add('tooltip-wrapper')
      tooltipElement.innerHTML = '<div class="tooltip-body"></div>'

      containerChartElement.appendChild(tooltipElement)
    }

    if (tooltip.opacity === 0) {
      tooltipElement.style.opacity = 0
      return
    }

    tooltipElement.classList.remove('above', 'below', 'no-transform')
    if (tooltip.yAlign) {
      tooltipElement.classList.add(tooltip.yAlign)
    } else {
      tooltipElement.classList.add('no-transform')
    }

    /* Get active chart index */
    /* Event trigger by hover */
    if (_chart.active && _chart.active[0]) {
      let tooltipInnerHtml = '<div class="tooltip-content">'
      let classIndicator = (chartWidth / 2) < tooltip.caretX ? 'tooltip-indicator tooltip-indicator--left' : 'tooltip-indicator'
      let tmpPositionX = 0
      let widthLineIndicator = 0

      const chartIndex = _chart.active[0]._index

      const chartMeta = _data.datasets[0]._meta
      const tmpDataValue = _data.datasets[0].data[chartIndex]

      const defineColor = tooltip.labelColors[0].backgroundColor

      /* find the total sum data in chart */
      for (const item in chartMeta) {
        metaTotal = chartMeta[item].total
      }

      const labels = _data.labels[chartIndex] /* Get label from active chart */
      const percentageVal = parseFloat((tmpDataValue / metaTotal) * 100).toFixed(2) /* get the percentage from value */

      tooltipInnerHtml += `
        <span id="tooltip-content-label-id" class="tooltip-content--label">
          ${labels}
        </span>
        <span id="tooltip-indicator-id" class="${classIndicator}"></span>
        <div class="text-lg text-600 mt-12" style="color: ${defineColor};">${tmpDataValue}</div>
        <div class="tooltip-content--value text-xl text-800" style="color: ${defineColor};">${percentageVal} %</div>
      `

      tooltipInnerHtml += '</div>'

      let tooltipElementRoot = document.querySelector('.tooltip-body')
      tooltipElementRoot.innerHTML = tooltipInnerHtml

      let tooltipLabelElement = document.getElementById('tooltip-content-label-id') // for label tooltip
      let tooltipIndicatorElement = document.getElementById('tooltip-indicator-id') // for line indicator

      const tooltipLabelClient = tooltipLabelElement.getBoundingClientRect()

      tooltipIndicatorElement.style.position = 'absolute'
      tooltipIndicatorElement.style.display = 'block'
      tooltipIndicatorElement.style.top = -7 + 'px'
      tooltipIndicatorElement.style.height = tooltip.height + 'px'

      if (!isChartWidthGtCaretX) { /* If chart width < tooltip caret x */
        /* Push to the right */
        tmpPositionX = parseFloat(tooltip.caretX + (tooltipLabelClient.width * 2)).toFixed(2)
        tooltipIndicatorElement.style.transform = "scaleX(-1)"
        widthLineIndicator = tooltipLabelClient.width * 2
      } else {
        /* Push the left */
        widthLineIndicator = tooltipLabelClient.width * 2 + 4
        tmpPositionX = parseFloat(tooltip.caretX - (tooltipLabelClient.width * 3)).toFixed(2)
      }

      tooltipIndicatorElement.style.width = isChartWidthGtCaretX ? widthLineIndicator + 'px' : Math.abs(widthLineIndicator) + 'px'
      tooltipIndicatorElement.style.left = isChartWidthGtCaretX ? tooltipLabelClient.width + 4 + 'px' : -widthLineIndicator + 'px'

      let lineHtml = `
        <svg id="LineIndicator" viewBox="0 0 ${isChartWidthGtCaretX ? widthLineIndicator : Math.abs(widthLineIndicator)} ${tooltip.height}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="${tooltip.height - 9}" r="7" stroke="${defineColor}" stroke-width="2" fill="${defineColor}" fill-opacity="0.5"></circle>
          <line x1="16" y1="${tooltip.height - 10}" x2="${isChartWidthGtCaretX ? widthLineIndicator : tmpPositionX}" y2="2" stroke="${defineColor}" stroke-width="2" />
        </svg>
      `

      tooltipIndicatorElement.innerHTML = lineHtml

      /* Style tooltips elements */
      tooltipElement.style.opacity = 1
      tooltipElement.style.position = 'absolute'
      tooltipElement.style.left = tmpPositionX + 'px'
      tooltipElement.style.top = tooltip.caretY + 'px'
      tooltipElement.style.fontFamily = "'Open Sans', sans-serif"
      tooltipElement.style.padding = tooltip.yPadding + 'px' + tooltip.xPadding + 'px'
      tooltipElement.style.pointerEvents = 'none'

    } else {
      containerChartElement.removeChild(tooltipElement)
    }
  }
}

export function floatingChartLegend (chart) {
  let legendElement = []

  const config = chart.config
  const data = config.data

  legendElement.push(`<div class="chart-${chart.id}-legend">`)

  for (let element = 0; element < data.datasets.length; element++) {
    legendElement.push('<div class="legend-item">')
    if (data.datasets[element]) {
      let itemLegendList = `
        <span class="legend-item--indicator" style="background-color: ${data.datasets[element].backgroundColor}; border: '1px solid ${data.datasets[element].borderColor}'" onclick="updateDatasets(evt, ${element})"></span>
        <span class="legend-item--text">${data.datasets[element].label}</span>
      `

      legendElement.push(itemLegendList)
    }

    legendElement.push('</div>')
  }

  legendElement.push('</div>')

  return legendElement.join('')
}

export const tooltipEconsent = {
  titleFontSize: 14,
  titleSpacing: 7,
  titleMarginBottom: 12,
  bodyFontFamily: 'Open Sans, sans-serif',
  callbacks: {
    title: function (tooltipItem, data) {
      let tooltipTitle = []
      for (let i = 0; i < tooltipItem.length; i++) {
        tooltipTitle.push(data.datasets[tooltipItem[i].datasetIndex].label)
      }

      return tooltipTitle.join(' | ')
    },
    label: function (tooltipItem, data) {
      let tooltipLabel = 'Site : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].site || ''
      return tooltipLabel
    },
    afterLabel: function (tooltipItem, data) {
      let econsentAmount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].xAmount
      let uploadedAmount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].yAmount

      let econsentPercentage = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x
      let uploadedPercentage = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y

      let econsentSelfMode = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].self
      let econsentDualMode = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].dual

      let econsentUploaded = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].uploadedRemark


      let tooltipAfterLabel =
        'eConsent : ' + econsentPercentage + '% (' + econsentAmount + ')' + '\n'
        + 'Uploaded : ' + uploadedPercentage + '% (' + uploadedAmount + ')' + '\n'
        + 'eConsent Self Mode : ' + econsentSelfMode + '\n'
        + 'eConsent Dual Mode : ' + econsentDualMode + '\n'
        + 'eConsent Uploaded : ' + (econsentUploaded || '0')

      return tooltipAfterLabel
    }
  }
}

export const tooltipsParticipantQuiz = {
  titleFontSize: 14,
  titleSpacing: 7,
  titleMarginBottom: 12,
  bodyFontFamily: 'Open Sans, sans-serif',
  callbacks: {
    title: function (tooltipItem, data) {
      let tooltipTitle = []
      for (let i = 0; i < tooltipItem.length; i++) {
        tooltipTitle.push(data.datasets[tooltipItem[i].datasetIndex].label)
      }

      return tooltipTitle.join(' | ')
    },
    label: function (tooltipItem, data) {
      let tooltipLabel = 'Site : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].site || ''
      return tooltipLabel
    },
    afterLabel: function (tooltipItem, data) {
      let quizCompleted = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].xAmount
      let quizIncomplete = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].yAmount

      let quizCompletedPercentage = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x
      let quizIncompletePercentage = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y


      let tooltipAfterLabel =
        'Completed : ' + quizCompletedPercentage + '% (' + quizCompleted + ')' + '\n'
        + 'Incomplete : ' + quizIncompletePercentage + '% (' + quizIncomplete + ')'

      return tooltipAfterLabel
    }
  }
}
