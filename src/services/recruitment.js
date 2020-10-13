import * as d3 from "d3";
import * as constant from '../constants/config'

export const wrangleRecruitmentTimelineData = async (filteredRawData, chosenVar = 'all') => {
  var timelineEntries = d3.nest()
    .key(function (d) {
      return d.study_id;
    })
    .key(function (d) {
      return d.site_id;
    })
    .sortKeys(d3.ascending)
    .rollup(function (v) {
      const earliest_active = d3.min(v, function (d) {
        return d.study_site_active_date
      });
      const earliest_fpi = d3.min(v, function (d) {
        return d.fpi
      });
      const earliest_first_data = d3.min(v, function (d) {
        return d.first_data
      });
      if (chosenVar === 'fpi') {
        return [{
          timeRange: [earliest_active, earliest_fpi],
          val: constant.TL_FPI_LABEL
        }, ]
      } else if (chosenVar === 'first_data') {
        return [{
          timeRange: [earliest_active, earliest_first_data],
          val: constant.TL_FIRST_DATA_LABEL
        }]
      }
      return [{
          timeRange: [earliest_active, earliest_fpi],
          val: constant.TL_FPI_LABEL
        },
        {
          timeRange: [earliest_fpi, earliest_first_data],
          val: constant.TL_FIRST_DATA_LABEL
        }
      ]
    })
    .entries(filteredRawData);
  var filteredData = timelineEntries.map(function (te) {
    te.values = te.values.map(function (lbl) {
      var newLbl = {};
      newLbl['label'] = lbl['key']
      newLbl['data'] = lbl['value']
      return newLbl;
    });
    te['group'] = te['key'];
    te['data'] = te['values'];
    delete te['key'];
    delete te['values'];
    return te;
  });
  return {
    data: filteredData
  };
};

export const wrangleRecruitmentBarData = async (filteredRawData, chosenSites = ['all']) => {
  const filteredData = filteredRawData.filter(function (d) {
    if ((chosenSites === ['all']) || (chosenSites.includes(d.site_id))) {
      return true;
    }
    return false;
  });
  // Get days of the active days and fpi
  var barEntries = d3.nest()
    .key(function (d) {
      return d.site_id;
    })
    .sortKeys(d3.ascending)
    .rollup(function (v) {
      const earliest_active = d3.min(v, function (d) {
        return d.study_site_active_date
      });
      const earliest_fpi = d3.min(v, function (d) {
        return d.fpi
      });
      const earliest_first_data = d3.min(v, function (d) {
        return d.first_data
      });
      // All times converted to numbers, in forms of per miliseconds
      const firstActiveDays = earliest_active !== "" ? Math.ceil(new Date(earliest_active).getTime() / 86400000) : 0;
      const firstFpiDays = earliest_fpi !== "" ? Math.ceil(new Date(earliest_fpi).getTime() / 86400000) : 0;
      const firstDataDays = earliest_first_data !== "" ? Math.ceil(new Date(earliest_first_data).getTime() / 86400000) : 0;
      const daysFpi = firstFpiDays - firstActiveDays;
      const daysFirstData = daysFpi > 0 ? (firstDataDays > 0 ? firstDataDays - firstFpiDays : 0) : firstDataDays - firstActiveDays;
      return {
        daysFpi: daysFpi,
        daysFirstData: daysFirstData,
      }
    })
    .entries(filteredData);
  // Convert into the forms chart.js will understand
  const barData = {
    labels: [],
    datasets: [{
        label: constant.FPI_S,
        backgroundColor: '#00C3B3',
        borderColor: '#00C3B3',
        order: 1,
        data: []
      },
      {
        label: constant.FIRST_DATA_S,
        backgroundColor: '#FBC952',
        borderColor: '#FBC952',
        order: 1,
        data: []
      },
      {
        label: constant.AVERAGE_DAYS_S,
        yAxisID: "no-stack",
        data: [],
        backgroundColor: '#000000',
        borderColor: '#000000',
        order: 0,
        lineTension: 0,
        type: 'line',
        pointStyle: 'line',
        showLine: true,
        fill: false
      },
    ]
  };
  // Fill into each datasets
  var totalAvgSum = 0;
  for (var k in barEntries) {
    const entry = barEntries[k];
    barData.labels.push(entry.key);
    barData.datasets[0].data.push(entry.value.daysFpi);
    barData.datasets[1].data.push(entry.value.daysFirstData);
    totalAvgSum += entry.value.daysFpi + entry.value.daysFirstData;
  }
  // Fill total average line
  const totalAvg = Number((totalAvgSum / barEntries.length).toFixed(2));
  for (var k in barEntries) {
    barData.datasets[2].data.push(totalAvg);
  }
  return {
    data: barData
  };
};

export const calculateRecruitmentStats = async filteredRawData => {
  // Temporary data to get summary stats of recruitment
  var fastestFpiDays = -1;
  var fastestFirstDataDays = -1;
  var fastestFpiDate = "";
  var fastestFpiActiveDate = "";
  var fastestFpiSite = "";
  var fastestFpiCountry = "";
  var fastestFirstDataDate = "";
  var fastestFirstDataActiveDate = "";
  var fastestFirstDataSite = "";
  var fastestFirstDataCountry = "";
  var fpiCounter = 0;
  var firstDataCounter = 0;
  filteredRawData.forEach(function (v) {
    // Count if FPI or First Data available
    if (v.fpi !== "") {
      fpiCounter += 1;
    }
    if (v.first_data !== "") {
      firstDataCounter += 1;
    }
    // Get number of days for both FPI or First Data
    const firstActiveDays = v.study_site_active_date !== "" ? Math.ceil(new Date(v.study_site_active_date).getTime() / 86400000) : 0;
    const firstFpiDays = v.fpi !== "" ? Math.ceil(new Date(v.fpi).getTime() / 86400000) : 0;
    const firstDataDays = v.first_data !== "" ? Math.ceil(new Date(v.first_data).getTime() / 86400000) : 0;
    const daysFpi = firstFpiDays - firstActiveDays;
    const daysFirstData = daysFpi > 0 ? (firstDataDays > 0 ? firstDataDays - firstFpiDays : 0) : firstDataDays - firstActiveDays;
    // Now if the smallest of days found, treat as the fastest FPI or First Data
    if ((fastestFpiDays < 0 || daysFpi < fastestFpiDays) && daysFpi >= 0) {
      fastestFpiDays = daysFpi;
      fastestFpiDate = v.fpi;
      fastestFpiActiveDate = v.study_site_active_date;
      fastestFpiSite = v.site_id === "" ? "Unknown Site" : v.site_id;
      fastestFpiCountry = v.country === "" ? "Unknown Country" : v.country;
    }
    // Note that sites probably didn't yet have any first data, so it needed to compare with firstDataDays
    if ((fastestFirstDataDays < 0 || daysFirstData < fastestFirstDataDays) && (daysFirstData > 0) && (firstDataDays > 0)) {
      fastestFirstDataDays = daysFirstData;
      fastestFirstDataDate = v.first_data;
      fastestFirstDataActiveDate = v.study_site_active_date;
      fastestFirstDataSite = v.site_id === "" ? "Unknown Site" : v.site_id;
      fastestFirstDataCountry = v.country === "" ? "Unknown Country" : v.country;
    }
  });
  return {
    totalFpi: fpiCounter,
    totalFirstData: firstDataCounter,
    fastestFpi: {
      days: fastestFpiDays,
      date: fastestFpiDate,
      activeDate: fastestFpiActiveDate,
      site: fastestFpiSite,
      country: fastestFpiCountry
    },
    fastestFirstData: {
      days: fastestFirstDataDays,
      date: fastestFirstDataDate,
      activeDate: fastestFirstDataActiveDate,
      site: fastestFirstDataSite,
      country: fastestFirstDataCountry
    }
  };
}
