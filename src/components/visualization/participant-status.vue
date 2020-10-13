<template>
  <div>
    <div v-if="!rawData">
      <no-data-page
        titleProps="Data is not available"
        iconProps="far fa-sad-tear fa-5x"
        messageProps="We can't found any data about Participant Status"
      />
    </div>
    <div v-else>
      <b-row v-if="rawData">
        <!-- <b-colxx xl="4" lg="6" md="12" class="mb-4">
          <most-participant :title="$t('enrollment.totalParticipantStatus')" :data="totalParticipantStatus" legendPosition="right"></most-participant>
        </b-colxx> -->
        <b-colxx xl="8" lg="12" md="12" class="mb-4">
          <top-site-chart-card :data="top3Site" :title="$t('enrollment.top5Site')"></top-site-chart-card>
        </b-colxx>
        <b-colxx xl="4" lg="12" md="12" class="mb-4">
          <b-card class="card-full" :title="$t('enrollment.topStatuses')" v-if="mostParticipantStatus">
            <div v-for="(key, index) in Object.keys(mostParticipantStatus)" :key="index" class="mb-4">
              <p class="mb-2">
                <span :class="`text-small tag-with-text tag-with-text--theme-${index}`">{{ key }}</span> <span class="text-13">{{ mostParticipantStatus[key].site }}</span>
                <span :class="`float-right text-theme-${index} text-13`">{{ mostParticipantStatus[key].value }}</span>
              </p>
            </div>
          </b-card>
        </b-colxx>
      </b-row>
      <!-- START row for visualization and filter -->
      <b-row v-if="rawData">
        <b-colxx xl="8" lg="12">
          <pie-chart-card :vis="visParticipantStatus" :title="$t('enrollment.participantStatus')"></pie-chart-card>
        </b-colxx>
        <b-colxx xl="4" lg="12" class="mb-4 sticky-container">
          <radio-button-picker
            class="mb-4"
            v-if="studyId"
            :data="countryList"
            :title="$t('enrollment.countryFilter')"
            includeAll
            @onApply="getDataFromRadioButton"
          ></radio-button-picker>
          <checkbox-picker
            v-if="studyId"
            :data="allSitesList"
            :title="$t('enrollment.siteFilter')"
            @onApply="getDataFromCheckbox"
          ></checkbox-picker>
        </b-colxx>
      </b-row>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import DonutCard from "../containers/center-text-doughnut-card";
import MostParticipantStatusCard from '../containers/most-participant-status-card'
import MainCardCenter from "../common/main-card-center";
import SimpleTextCard from "../common/simple-text-card";
import NoDataPage from '../common/no-data-page'
import CheckboxPicker from "../form-components/checkbox-picker";
import RadioButtonPicker from "../form-components/radio-button-picker";
import TopSiteChartCard from "../containers/top-site-chart-card";
import PieChartCard from "../containers/participant-status-chart-card";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import BarLoader from '../loader/bar-loader';
Vue.use(Loading);

const count = arrayValue => arrayValue.reduce((a, b) => a + b, 0)

// Get country list
const getCountryList = object =>
  !object || typeof object !== "object" ? [] : Object.keys(object);

// Get all site list
const getAllSite = object => {
  if (!object || typeof object !== 'object') return

  let tmpSiteList = [];
  Object.entries(object).map(element => {
    Object.entries(element[1]).map(elem => {
      tmpSiteList.push(elem[0]);
    });
  });

  tmpSiteList = tmpSiteList.reduce((arr, current) => arr.includes(current) ? arr : [...arr, current], []);

  return tmpSiteList
};

// Get participant status
const getParticipantStatus = (rawData, choosenCountries = 'all', choosenSites = ['all']) => {
  if (!rawData || typeof rawData !== 'object') return

  let result = {}
  let tmpStatus = {}

  if (choosenCountries === 'all') {
    Object.entries(rawData).map(element => {
      Object.entries(element[1]).map(elem => {
        if (choosenSites[0] && choosenSites[0] === 'all') {
          for (const el in elem[1]) {
            tmpStatus[el] = tmpStatus[el] ? [...tmpStatus[el], elem[1][el]] : [elem[1][el]]
          }
        } else {
          if (choosenSites.includes(elem[0])) {
            for (const el in elem[1]) {
              tmpStatus[el] = tmpStatus[el] ? [...tmpStatus[el], elem[1][el]] : [elem[1][el]]
            }
          }
        }
      })
    })
  } else {
    Object.entries(rawData[choosenCountries]).map(element => {
      if (choosenSites[0] && choosenSites[0] === 'all') {
        for (const elem in element[1]) {
          tmpStatus[elem] = tmpStatus[elem] ? [...tmpStatus[elem], element[1][elem]] : [element[1][elem]]
        }
      } else {
        if (choosenSites.includes(element[0])) {
          for (const elem in element[1]) {
            tmpStatus[elem] = tmpStatus[elem] ? [...tmpStatus[elem], element[1][elem]] : [element[1][elem]]
          }
        }
      }
    })
  }

  for (const status in tmpStatus) {
    result[status] = count(tmpStatus[status])
  }

  return result
}

// Get top 3 site
const getTop3Site = (rawData, choosenCountries = 'all', key = 'active') => {
  if (!rawData || typeof rawData !== 'object') return

  let result = {}
  let tmpStatus = {}
  let siteStatusTotal = []
  let tmpKey = key.toUpperCase()

  if (choosenCountries === 'all') {
    Object.entries(rawData).map(element => {
      Object.entries(element[1]).map(elem => {
        if (tmpKey in elem[1]) {
          siteStatusTotal.push(elem[1][tmpKey])
          tmpStatus[elem[0]] = tmpStatus[elem[0]]
            ? [...tmpStatus[elem[0]], elem[1][tmpKey]]
            : [elem[1][tmpKey]]
        }
      })
    })
  } else {
    Object.entries(rawData[choosenCountries]).map(element => {
      if (tmpKey in element[1]) {
        siteStatusTotal.push(element[1][tmpKey])
        tmpStatus[element[0]] = tmpStatus[element[0]]
          ? [...tmpStatus[element[0]], element[1][tmpKey]]
          : [element[1][tmpKey]]
      }
    })
  }

  // Get total sites
  siteStatusTotal = count(siteStatusTotal)

  // Count total status by key
  tmpStatus = Object.entries(tmpStatus).map(element => {
    let tmpData = {}

    tmpData['site'] = element[0]
    tmpData[tmpKey.toLowerCase()] = count(element[1])

    return tmpData
  }).sort((a, b) => b[key] - a[key]).slice(0, 5)

  result['sites'] = tmpStatus
  result['total'] = siteStatusTotal

  return result
}

// Helpers to group participant status by site
const groupParticipantStatusBySite = rawData => {
  if (!rawData || typeof rawData !== 'object') return

  // Next change from backend
  const statusKey = { ACTIVE: 'Active', DISQUALIFIED: 'Disqualified', INVITED: 'Invited', NOTINVITED: 'Not Invited', 'Pending Invitation': 'Pending Invitation', VERIFIED: 'Verified', REGISTERED: 'Registered', WITHDRAWSTUDY: 'Withdraw Study' }

  let tmpSiteGroup = {}
  let countStatusSite = {}

  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => {
      Object.keys(elem[1]).map(keyStatus => {

        if ((elem[0] in tmpSiteGroup)) {
          if (!(keyStatus in tmpSiteGroup[elem[0]])) {
            tmpSiteGroup[elem[0]] = {
              ...tmpSiteGroup[elem[0]],
              [statusKey[keyStatus]]: [elem[1][keyStatus]]
            }
          } else {
            tmpSiteGroup[elem[0]] = {
              ...tmpSiteGroup[elem[0]],
              [statusKey[keyStatus]]: [...tmpSiteGroup[elem[0]][keyStatus], elem[1][keyStatus]]
            }
          }
        } else {
          tmpSiteGroup[elem[0]] = {
            ...tmpSiteGroup[elem[0]],
            [statusKey[keyStatus]]: [elem[1][keyStatus]]
          }
        }
      })
    })
  })

  Object.entries(tmpSiteGroup).map(element => {
    Object.entries(element[1]).map(elem => {
      if (!(elem[0] in countStatusSite)) {
        countStatusSite[elem[0]] = { [element[0]]: count(elem[1]) }
      } else {
        countStatusSite[elem[0]] = { ...countStatusSite[elem[0]], [element[0]]: count(elem[1]) }
      }
    })
  })

  return countStatusSite
}

// Get maximum participant status after grouping by site
const getMaximumStatusAfterGrouping = rawData => {
  if (!rawData || typeof rawData !== 'object') return
  let maximumStatusSite = {}

  Object.entries(rawData).map(element => {
    let arr = Object.values(element[1])
    let max = Math.max(...arr)

    for (const elem in element[1]) {
      if (element[1][elem] === max) {
        maximumStatusSite[element[0]] = { site: elem, value: max }
      }
    }
  })

  return maximumStatusSite
}

// Get most participant status
const getMostStatus = rawData => {
  let statusGrouped = groupParticipantStatusBySite(rawData)
  let maxValuesAfterGrouping = getMaximumStatusAfterGrouping(statusGrouped)

  return maxValuesAfterGrouping
}

// Format data for chart
const formatForChart = data => {
  if (!data || typeof data !== 'object') return

  let labels = Object.keys(data)
  let values = Object.values(data)

  let result = { labels, values }

  return result
}

const bgColorTemporary = ['#B382FE', '#FBC952', '#00C3B3', '#71C200', '#00365a', '#216491', '#245794', '#D8D8D8']

export default {
  components: {
    DonutCard,
    SimpleTextCard,
    MainCardCenter,
    CheckboxPicker,
    RadioButtonPicker,
    TopSiteChartCard,
    PieChartCard,
    NoDataPage,
    'most-participant': MostParticipantStatusCard,
    "custom-chart-loader": BarLoader
  },
  data() {
    return {
      studyId: null,
      dummyParticipantStatus: null, // TODO: Change to real data from API later
      rawData: null,
      countryList: [],
      allSitesList: [],
      sitesSelected: ["all"],
      countrySelected: "all",
      visParticipantStatus: null,
      top3Site: null,
      totalParticipantStatus: null,
      mostParticipantStatus: null,
      loader: null,
      isLoading: true
    };
  },
  methods: {
    // Fetch raw data from API
    async getVisualizationData() {
      this.isLoading = true
      let response = null
      const data = await this.$api.getParticipantStatusVisData(this.studyId);

      if (data.ok) {
        let result = data.body

        if (result.data !== {}) {
          if ('locations' in result.data) {
            response = result.data.locations
          }
        }
      }
      this.isLoading = false
      return response;
    },
    // Get data from radio
    getDataFromRadioButton(payload) {
      this.filterData("country", payload)
    },
    getDataFromCheckbox(payload) {
      this.filterData("sites", payload.isCheckAll ? ["all"] : payload.checkedDatas);
    },
    // Filter data by country and site
    async filterData(triggerBy, value) {
      switch (triggerBy) {
        case "country": {
          if (this.sitesSelected[0] && this.sitesSelected[0] !== 'all') {
            this.sitesSelected = ['all']
          }

          this.countrySelected = value;
          this.top3Site = getTop3Site(this.rawData, value)
          this.allSitesList = value === 'all'
            ? await getAllSite(this.rawData)
            : Object.keys(this.rawData[value]);

          break
        }
        case "sites": {
          this.sitesSelected = Array.isArray(value) && value.length < 1 ? ['all'] : value
          break
        }
        default:
          break
      }
      const participanStatus = getParticipantStatus(this.rawData, this.countrySelected, this.sitesSelected)
      this.visParticipantStatus = formatForChart(participanStatus)
    },
  },
  computed: {},
  async mounted() {
    // Show Loader
    this.loader = this.$loading.show({
      // Optional parameters
      container: this.fullPage ? null : this.$refs.formContainer,
      loader: 'bars',
      opacity: 0.9,
    }, {
      default: this.$createElement('custom-chart-loader'),
    });

    this.studyId = this.$route.params.studyId; // get study id from route parameter
    this.rawData = await this.getVisualizationData();
    this.countryList = await getCountryList(this.rawData);
    this.allSitesList = await getAllSite(this.rawData);
    this.top3Site = getTop3Site(this.rawData, this.countrySelected) // get 3 top site data when mount
    this.mostParticipantStatus = getMostStatus(this.rawData)

    console.log('[This Top 3 Site]', this.top3Site)

    const participantStatus = getParticipantStatus(this.rawData, this.countrySelected, this.sitesSelected)
    this.visParticipantStatus = formatForChart(participantStatus)

    this.totalParticipantStatus = {
      labels: this.visParticipantStatus ? this.visParticipantStatus.labels : [] ,
      datasets: [
        {
          borderColor: bgColorTemporary.map(color => color),
          backgroundColor: bgColorTemporary.map(color => color),
          borderWidth: 2,
          data: this.visParticipantStatus ? this.visParticipantStatus.values : [],
        },
      ],
    };

    if (!this.isLoading) { this.loader.hide(); }
  },
};
</script>
