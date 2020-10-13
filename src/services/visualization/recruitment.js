import * as d3 from "d3";
import * as constant from '../../constants/config'
import moment from 'moment';

// ===================================
// |      Get List All Countries     |
// \=================================|
export function getCountryList (rawData) {
  if (!rawData) return
  const tmpCountries = Object.keys(rawData)
  return tmpCountries
}

// ===============================
// |      Get List All Sites     |
// \=============================|
export function getAllSites (rawData) {
  if (!rawData) return
  let mapSiteCountry = {};
  let tmpSites = []
  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => {
      tmpSites.push(elem[0])
      mapSiteCountry[elem[0]] = element[0]
    })
  })
  
  return {
    allSites: tmpSites,
    mapSiteCountry
  }
}
export const wrangleRecruitmentTimelineData = async (filteredRawData, chosenVar = 'all') => {
  const visDatas = [];
  Object.entries(filteredRawData).forEach(byCountry=> {
    const visData = {};
    visData.group = byCountry[0];
    visData.data = [];
    Object.entries(byCountry[1]).forEach(bySite=>{
      const metricData = {};
      metricData.label = bySite[0]
      metricData.data = [];
      if (chosenVar === 'first_data' || chosenVar === 'all') {
        metricData.data.push({
          timeRange: [bySite[1].active, bySite[1].firstData],
          val: constant.TL_FIRST_DATA_LABEL
        });
      }
      if (chosenVar === 'fpi' || chosenVar === 'all' ) {
        metricData.data.push({
          timeRange: [bySite[1].active, bySite[1].fpi],
          val: constant.TL_FPI_LABEL
        });
      }
      visData.data.push(metricData);
    })
    visDatas.push(visData);
  })
  return {
    data: visDatas,
    fpiSelected: chosenVar
  };
};

export const wrangleRecruitmentBarData = async (filteredRawData, chosenSites = ['all']) => {
  const filteredData = filteredRawData
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
  let totalAvgSum = 0;
  let totalFpiSum = 0;
  let totalFirstDataSum = 0;
  let totalSites = 0;
  let totalValidSites = 0;
  // Fill into each datasets
  Object.entries(filteredData).forEach(byCountry=> {
    Object.entries(byCountry[1]).forEach(bySite=>{
      const siteName = bySite[0];
      const momentActiveDate = moment(bySite[1].active);
      const momentFpiDate = moment(bySite[1].fpi);
      const momentFirstDataDate = moment(bySite[1].firstData);
      const daysFpi = momentFpiDate.diff(momentActiveDate, 'days')
      const daysFirstData = momentFirstDataDate.diff(momentActiveDate, 'days')
      barData.labels.push(siteName);
      barData.datasets[0].data.push(daysFpi);
      barData.datasets[1].data.push(daysFirstData);
      let siteIncluded = false;
      if (!isNaN(daysFpi)) {
        totalAvgSum += daysFpi;
        totalFpiSum += daysFpi
        siteIncluded = true;
      }
      if (!isNaN(daysFirstData)) {
        totalAvgSum += daysFirstData;
        totalFirstDataSum += daysFirstData;
        siteIncluded = true;
      }
      totalValidSites = siteIncluded ? totalValidSites + 1 : totalValidSites + 0;
      totalSites++;
    })
  })
  // Fill total average line
  const totalAvg = Number((totalAvgSum / totalValidSites).toFixed(2));
  const totalAvgFpi = Number((totalFpiSum / totalValidSites).toFixed(2));
  const totalAvgFirstData = Number((totalFirstDataSum / totalValidSites).toFixed(2));
  barData.datasets[2].avg = []
  barData.datasets[2].avg.push(totalAvgFpi);
  barData.datasets[2].avg.push(totalAvgFirstData)
  barData.datasets[2].avg.push(totalAvg)
  barData.datasets[2].totalSites = totalSites;
  for (let i= 0 ; i < totalSites; i++) {
    barData.datasets[2].data.push(totalAvg);
  }
  return {
    data: barData
  };
};

export const calculateRecruitmentStats = async filteredRawData => {
  // Temporary data to get summary stats of recruitment
  var fastestFpiDays = Number.MAX_SAFE_INTEGER;
  var fastestFirstDataDays = Number.MAX_SAFE_INTEGER;
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
  Object.entries(filteredRawData).forEach(byCountry=>{
    const countryName = byCountry[0];
    Object.entries(byCountry[1]).forEach(bySite=>{
      const siteName = bySite[0];
      if (bySite[1].fpi !== null) {
        fpiCounter += 1;
      }
      if (bySite[1].firstData !== null) {
        firstDataCounter += 1;
      }
      const momentActiveDate = moment(bySite[1].active);
      const momentFpiDate = moment(bySite[1].fpi);
      const momentFirstDataDate = moment(bySite[1].firstData);
      const daysFpi = momentFpiDate.diff(momentActiveDate, 'days')
      const daysFirstData = momentFirstDataDate.diff(momentActiveDate, 'days')
      if (!isNaN(daysFpi)) {
        if (daysFpi < fastestFpiDays) {
          fastestFpiDays = daysFpi;
          fastestFpiCountry = countryName;
          fastestFpiDate = momentFpiDate;
          fastestFpiActiveDate = momentActiveDate;
          fastestFpiSite = siteName;
        }
      }
      if (!isNaN(daysFirstData)) {
        if (daysFirstData < fastestFirstDataDays) {
          fastestFirstDataDays = daysFirstData;
          fastestFirstDataCountry = countryName;
          fastestFirstDataDate = momentFpiDate;
          fastestFirstDataActiveDate = momentActiveDate;
          fastestFirstDataSite = siteName;
        }
      }
    })
  })
  
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
