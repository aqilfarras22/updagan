<template>
  <div id="withdrawal-content-id">
    <div v-if="!rawData">
      <no-data-page
        titleProps="Data is not available"
        iconProps="far fa-sad-tear fa-5x"
        messageProps="We can't found any data about Withdawal Study"
      />
    </div>
    <div v-else>
      <b-row v-if="studyId">
        <b-colxx xl="4" lg="6" md="12" class="mb-4">
          <main-card>
            <div class="card-full d-flex align-center justify-center">
              <div>
                <i :class="'fas fa-map-marker-alt fa-5x text-white mb-20'" />
                <p
                  class="lead text-600 text-white mb-20"
                >{{ $t('enrollment.withdrawal.titleCardWithdrawParticipant') }}</p>
                <p class="text-800 text-xxl text-yellow m-0">{{ withdrawtotal }}</p>
              </div>
            </div>
          </main-card>
        </b-colxx>
        <b-colxx xl="8" lg="12" md="12" class="mb-4">
          <b-card
            class="card-full"
            :title="$t('enrollment.withdrawal.titleCardTopWithdrawalReason')"
            sub-title="Reason"
          >
            <b-row v-if="topWithdrawReasons && topWithdrawReasons.reasons.length > 0">
              <b-colxx xl="6" lg="6" md="12" class="mb-4 mt-20 pl-0">
                <ul
                  class="mb-4 card-list--group"
                  v-for="(item, index) in topWithdrawReasons.reasons.slice(0, topShowWithdrawParticipant)"
                  :key="index"
                >
                  <li class="card-list">
                    <span class="card-list--hash text-600">{{ index + 1 }}.</span>
                    <p class="card-list--text" v-b-tooltip.hover.top="item.reason">{{ item.reason }}</p>
                    <span class="card-list--addons text-800">{{ parseFloat((item.value / topWithdrawReasons.total) * 100).toFixed(2) }} %</span>
                  </li>
                </ul>
              </b-colxx>
              <b-colxx xl="6" lg="6" md="12" class="mb-4 mt-20 pr-0">
                <ul
                  class="mb-4 card-list--group"
                  v-for="(item, index) in topWithdrawReasons.reasons.slice(topShowWithdrawParticipant, topWithdrawReasons.reasons.length + 1)"
                  :key="index"
                >
                  <li class="card-list">
                    <span
                      class="card-list--hash text-600"
                    >{{ index + (topShowWithdrawParticipant + 1) }}.</span>
                    <p class="card-list--text text-muted">{{ item.reason }}</p>
                    <span class="card-list--addons text-800">{{ parseFloat((item.value / topWithdrawReasons.total) * 100).toFixed(2) }} %</span>
                  </li>
                </ul>
              </b-colxx>
            </b-row>
          </b-card>
        </b-colxx>
      </b-row>

      <b-row v-if="studyId">
        <b-colxx xl="8" lg="12" md="12" class="mb-4">
          <withdraw-main :vis="visData" :title="$t('enrollment.withdrawal.titleMainChart')"></withdraw-main>
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
            :data="allSiteList"
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
import { SHOW_TOP_WITHDRAW_PARTICIPANT } from "../../constants/config";
import WithdawMainChartCard from "../charts/withdraw-main-chart-card";
import MainCardCenter from "../common/main-card-center";
import CheckboxPicker from "../form-components/checkbox-picker";
import RadioButtonPicker from "../form-components/radio-button-picker";
import NoDataPage from '../common/no-data-page'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import BarLoader from '../loader/bar-loader';
Vue.use(Loading);
import { WITHDRAW_STUDY_PREFIX } from '../../constants/config'

function countTotal (arr) { /* Avoid using reduce */
  let value = 0
  for (const item in arr) {
    value += arr[item]
  }

  return value
}

const getCountryList = rawData => { /* get all countries */
  if (!rawData || typeof rawData !== 'object') return {}

  const countries = Object.keys(rawData)
  return countries
}

const getAllSites = rawData => { /* Get all sites */
  if (!rawData || typeof rawData !== 'object') return

  let tmpSites = []
  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => tmpSites.push(elem[0]))
  })

  const sites = [...new Set(tmpSites)] // using set to best practice remove duplicate key

  return sites
}

const getTotalWithdrawStudy = rawData => { /* Get total withdraw */
  if (!rawData || typeof rawData !== 'object') return

  let value = new Set()
  let widthdrawTotal = 0

  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => {
      for (const item in elem[1]) {
        if (item === WITHDRAW_STUDY_PREFIX) {
          value.add(elem[1][item])
        }
      }
    })
  })

  widthdrawTotal = countTotal([...value])

  return widthdrawTotal
}

function getTotalReasons (data) { /* Helpers to count total reasons */
  const totalReasons = countTotal(data.map(d => d.value))
  return totalReasons
}

function generateaObjectReasons (data) { /* Helpers to generate object top reasons */
  const objReasons = Object.keys(data).map((item, index) => {
    let tmp = {}

    tmp['id'] = index + 1
    tmp['reason'] = item
    tmp['value'] = countTotal(data[item])

    return tmp
  })

  const objReasonsAfterSort = objReasons.sort((a, b) => b.value - a.value)

  return objReasonsAfterSort
}

const getTopReasons = rawData => { /* Get top 10 reasons */
  if (!rawData || typeof rawData !== 'object') return

  let tmpReasons = {}

  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => {
      for (const el in elem[1]) {
        if (el !== WITHDRAW_STUDY_PREFIX) {
          tmpReasons[el] = tmpReasons[el]
            ? [...tmpReasons[el], elem[1][el]]
            : [elem[1][el]]
        }
      }
    })
  })

  const reasons = generateaObjectReasons(tmpReasons)
  const total = getTotalReasons(reasons)

  return { reasons, total }
}

const getVisualData = (rawData, countries = 'all', choosenSites = ['all']) => { /* Get visual data for chart */
  if (!rawData || typeof rawData !== 'object') return

  let tmpReasons = {}
  let reasons = {}

  if (countries === 'all') {
    Object.entries(rawData).map(element => {
      Object.entries(element[1]).map(elem => {
        if (choosenSites[0] && choosenSites[0] === 'all') {
          for (const el in elem[1]) {
            if (el !== WITHDRAW_STUDY_PREFIX) {
              tmpReasons[el] = tmpReasons[el]
                ? [...tmpReasons[el], elem[1][el]]
                : [elem[1][el]]
            }
          }
        } else {
          if (choosenSites.includes(elem[0])) {
            for (const el in elem[1]) {
              if (el !== WITHDRAW_STUDY_PREFIX) {
                tmpReasons[el] = tmpReasons[el]
                  ? [...tmpReasons[el], elem[1][el]]
                  : [elem[1][el]]
              }
            }
          }
        }
      })
    })
  } else {
    Object.entries(rawData[countries]).map(element => {
      if (choosenSites[0] && choosenSites[0] === 'all') {
        for (const elem in element[1]) {
          if (elem !== WITHDRAW_STUDY_PREFIX) {
            tmpReasons[elem] = tmpReasons[elem]
              ? [...tmpReasons[elem], element[1][elem]]
              : [element[1][elem]]
          }
        }
      } else {
        if (choosenSites.includes(element[0])) {
          for (const elem in element[1]) {
            if (elem !== WITHDRAW_STUDY_PREFIX) {
              tmpReasons[elem] = tmpReasons[elem]
                ? [...tmpReasons[elem], element[1][elem]]
                : [element[1][elem]]
            }
          }
        }
      }
    })
  }

  for (const reason in tmpReasons) {
    reasons[reason] = countTotal(tmpReasons[reason])
  }

  return reasons
}

function formatDataForChart (data) { /* Format data for chart */
  if (!data || typeof data !== 'object') return

  const labels = Object.keys(data)
  const values = Object.values(data)

  return { labels, values }
}

export default {
  components: {
    "withdraw-main": WithdawMainChartCard,
    "main-card": MainCardCenter,
    CheckboxPicker,
    RadioButtonPicker,
    NoDataPage,
    "custom-chart-loader": BarLoader,
  },
  data() {
    return {
      studyId: null,
      rawData: null,
      withdrawtotal: 0,
      allSiteList: [],
      countryList: [],
      choosenSites: ["all"],
      choosenCountry: "all",
      topWithdrawReasons: null,
      topShowWithdrawParticipant: 0,
      visData: null,
      loader: null,
      isLoading: true
    };
  },
  methods: {
    getDataFromRadioButton(payload) {
      this.filterData('countries', payload)
    },
    getDataFromCheckbox(payload) {
      this.filterData('sites', payload.isCheckAll ? ['all'] : payload.checkedDatas)
    },
    async getVisualizationData() { /* Get data from api */
      this.isLoading = true
      let response = null
      const data = await this.$api.getWithdrawVisData(this.studyId);
      if (data.ok) {
        let result = data.body
        if (result.data !== {}) {
          if ('locations' in result.data) {
            response = result.data.locations
          }
        }
      }

      this.isLoading = false
      return response
    },
    async filterData (triggerBy, payload) { /* Filtering data by country and site */
      switch (triggerBy) {
        case 'countries': {
          if (this.choosenSites[0] && this.choosenSites[0] !== 'all') {
            this.choosenSites = ['all']
          }

          this.choosenCountry = payload
          this.allSiteList = payload === 'all'
            ? getAllSites(this.rawData)
            : Object.keys(this.rawData[payload])

          break
        }
        case 'sites': {
          this.choosenSites = Array.isArray(payload) && payload.length < 1 ? ['all'] : payload
          break
        }
        default:
          break
      }

      const tmpVisData = await getVisualData(this.rawData, this.choosenCountry, this.choosenSites);
      this.visData = formatDataForChart(tmpVisData);
    }
  },
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

    this.studyId = this.$route.params.studyId;
    this.rawData = await this.getVisualizationData()
    this.countryList = await getCountryList(this.rawData);
    this.allSiteList = await getAllSites(this.rawData);
    this.withdrawtotal = await getTotalWithdrawStudy(this.rawData);

    this.topShowWithdrawParticipant = Math.round(
      SHOW_TOP_WITHDRAW_PARTICIPANT / 2
    );
    this.topWithdrawReasons = await getTopReasons(this.rawData);

    const tmpVisData = getVisualData(this.rawData);
    this.visData = formatDataForChart(tmpVisData);

    if (!this.isLoading) { this.loader.hide(); }
  },
};
</script>
<style lang="scss" scoped>
.card-subtitle {
  font-size: 13px;
}

.card-list--text {
  overflow: hidden;
  width: 45%;

  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
