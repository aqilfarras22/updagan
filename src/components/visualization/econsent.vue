<template>
  <div id="econsent-id">
    <!-- START row for aggregate information (max, min, etc) -->
    <div v-if="!rawData">
      <no-data-page
        titleProps="Data is not available"
        iconProps="far fa-sad-tear fa-5x"
        messageProps="We can't found any data about eConsent"
      />
    </div>
    <div v-else>
      <b-row v-if="studyId">
        <b-colxx xl="4" lg="6" md="12" class="mb-4">
          <main-card-center>
            <div class="card-full d-flex align-center justify-center">
              <div>
                <i :class="'fas fa-paste text-white mb-20 fa-5x'"/>
                <p class="text-lg text-600 text-white m-0">{{ $t('enrollment.totalConsent') }}</p>
                <p class="text-800 text-xxl text-yellow m-0">{{ totalEConcent }}</p>
              </div>
            </div>
          </main-card-center>
        </b-colxx>
        <b-colxx xl="4" lg="6" md="12" class="mb-4">
          <donut-card class="card-full dashboard-sq-banner-auto econsent-blue text-white" textLight title="eConsent vs Uploaded" :data="visEconsentVsUploaded"></donut-card>
        </b-colxx>
        <b-colxx xl="4" lg="12" md="12" class="pl-0 pr-0">
          <b-row v-if="mostParticipant">
            <b-colxx xxs="6">
              <simple-text-card
                class="enrollment-info card-full mb-10"
                :primaryValueProp="mostParticipant.econsentValue ? mostParticipant.econsentValue.value.toString() : '0'"
                titleProp="Most eConsent"
                :secondaryValueProp="`${mostParticipant.econsentValue ? mostParticipant.econsentValue.site : '-'}, ${mostParticipant.econsentValue ? mostParticipant.econsentValue.countries : '-'}`"
              />
            </b-colxx>
            <b-colxx xxs="6" >
              <simple-text-card
                class="enrollment-info card-full mb-10"
                :primaryValueProp="`${mostParticipant.percentageEconsent ? mostParticipant.percentageEconsent.value : '0'} %`"
                titleProp="Most eConsent %"
                :secondaryValueProp="`${mostParticipant.percentageEconsent ? mostParticipant.percentageEconsent.site : '-'}, ${mostParticipant.percentageEconsent ? mostParticipant.percentageEconsent.countries : '-'}`"
              />
            </b-colxx>
          </b-row>
          <b-row v-if="mostParticipant">
            <b-colxx xxs="6" >
              <simple-text-card
                class="enrollment-info card-full mb-10"
                :primaryValueProp="mostParticipant.uploadedValue ? mostParticipant.uploadedValue.value.toString() : '0'"
                titleProp="Most Uploaded"
                :secondaryValueProp="`${mostParticipant.uploadedValue ? mostParticipant.uploadedValue.site : '-'}, ${mostParticipant.uploadedValue ? mostParticipant.uploadedValue.countries : '-'}`"
              />
            </b-colxx>
            <b-colxx xxs="6" >
              <simple-text-card
                class="enrollment-info card-full mb-10"
                :primaryValueProp="`${mostParticipant.percentageUploaded ? mostParticipant.percentageUploaded.value : '0' } %`"
                titleProp="Most Uploaded %"
                :secondaryValueProp="`${mostParticipant.percentageUploaded ? mostParticipant.percentageUploaded.site : '-'}, ${mostParticipant.percentageUploaded ? mostParticipant.percentageUploaded.countries : '-'}`"
              />
            </b-colxx>
          </b-row>
        </b-colxx>
      </b-row>
      <!-- END row for aggregate information (max, min, etc) -->
      <!-- START row for visualization and filter -->
      <b-row v-if="studyId">
        <b-colxx xl="8" lg="12" class="mb-4">
          <b-colxx xs="12" class="mb-20 pl-0 pr-0">
            <consent-chart-card
              :vis="participantStatus"
              class="econsent-card"
              titleChart="Percentage of Participants"
              subtitleChart="That complete eConsent quiz"
              scallabelX="% Incomplete"
              scallabelY="% Completed"
              :annotation="quizAnnotation"
              :tooltipCallbacks="tooltipsParticipantQuizOptions"
            />
          </b-colxx>
          <b-colxx xs="12" class="mb-20 pl-0 pr-0">
            <consent-chart-card
              :vis="consentDataForVis"
              class="econsent-card"
              titleChart="eConsents Vs Uploaded"
              scallabelX="% eConsent"
              scallabelY="% Uploaded"
              :annotation="econsentAnnotation"
              :tooltipCallbacks="tooltipsEconsentOptions"
            />
          </b-colxx>
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
import { mapMutations, mapGetters, mapActions } from "vuex";
import * as d3 from "d3";
import axios from "axios";
import MainCardCenter from "../common/main-card-center";
import DonutCard from "../containers/center-text-doughnut-card";
import SimpleTextCard from "../common/simple-text-card";
import CheckboxPicker from "../form-components/checkbox-picker";
import RadioButtonPicker from "../form-components/radio-button-picker.vue";
import ConsentChartCard from "../containers/consent-chart-card";
import EConsentModeChartCard from "../containers/consent-chart-card";
import NoDataPage from '../common/no-data-page'
import { tooltipEconsent, tooltipsParticipantQuiz } from '../charts/utils'
import * as Econsent from '../../services/visualization/econsent'
import { ThemeColors } from '../charts/utils'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import BarLoader from '../loader/bar-loader';
Vue.use(Loading);
const colors = ThemeColors()

export default {
  components: {
    CheckboxPicker,
    "econsentMode-chart-card": EConsentModeChartCard,
    ConsentChartCard,
    MainCardCenter,
    DonutCard,
    SimpleTextCard,
    RadioButtonPicker,
    NoDataPage,
    "custom-chart-loader": BarLoader
  },
  data() {
    return {
      rawData: null,
      totalEConcent: 0,
      visEconsentVsUploaded: null,
      participantStatus: null,
      mostParticipant: null,
      econsentAnnotation: null,
      quizAnnotation: null,
      filteredRawData: null, /* Unused */
      filteredDataByStudy: {}, /* Unused */
      consentDataForVis: null,
      eConsentDataForVis: null,
      quizDataForVis: null,
      studyList: null,
      countryList: null,
      allSitesList: [],
      sitesSelected: ["all"],
      studyId: null,
      countrySelected: "all",
      siteScale: null,
      tooltipsEconsentOptions: null,
      tooltipsParticipantQuizOptions: null,
      loader: null,
      isLoading: true
    };
  },
  methods: {
    async getVisualizationRawData() {
      this.isLoading = true
      let response = null
      const data = await this.$api.getEconsentVisData(this.studyId);


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
    wrangleEconsentData(rawData, choosenCountries = 'all', choosenSites = ['all']) {
      if (!rawData) return
      const datasets = []
      const innerDatasets = {}

      // Get color for each countries
      const defineCountries = Object.keys(rawData)
      const setColor = d3.scaleOrdinal()
        .domain(defineCountries)
        .range(['#31415B', '#00C3B3', '#FBC952', '#B382FE', '#71C200', '#D8D8D8'])

      if (choosenCountries === 'all') {
        Object.entries(rawData).map(countries => {
          // Set opacity for background color
          const c = d3.color(setColor(countries[0]))
          c.opacity = 0.45

          innerDatasets['label'] = countries[0]
          innerDatasets['backgroundColor'] = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`
          innerDatasets['borderColor'] = setColor(countries[0])
          innerDatasets['data'] = []
          innerDatasets['order'] = 1

          Object.entries(countries[1]).map(sites => {
            let data = {}
            if (choosenSites[0] && choosenSites[0] !== 'all') {
              if (choosenSites.includes(sites[0])) {
                data = {
                  site: sites[0],
                  x: parseFloat((sites[1].econsent / sites[1].total) * 100).toFixed(2), /* Convert econsent value to percentage */
                  y: parseFloat((sites[1].uploaded / sites[1].total) * 100).toFixed(2), /* Convert uploaded value to percentage */
                  v: this.siteScale(sites[1].total),
                  self: sites[1].self,
                  dual: sites[1].dual,
                  uploadedRemark: sites[1].uploadedRemark,
                  xAmount: sites[1].econsent,
                  yAmount: sites[1].uploaded,
                  total: sites[1].total
                }
              }
            } else {
              data = {
                site: sites[0],
                x: parseFloat((sites[1].econsent / sites[1].total) * 100).toFixed(2), /* Convert econsent value to percentage */
                y: parseFloat((sites[1].uploaded / sites[1].total) * 100).toFixed(2), /* Convert uploaded value to percentage */
                v: this.siteScale(sites[1].total),
                self: sites[1].self,
                dual: sites[1].dual,
                uploadedRemark: sites[1].uploadedRemark,
                xAmount: sites[1].econsent,
                yAmount: sites[1].uploaded,
                total: sites[1].total
              }
            }

            innerDatasets.data.push({...data})
          })

          datasets.push({...innerDatasets})
        })
      } else {
        // Set opacity for background color
        const c = d3.color(setColor(choosenCountries))
        c.opacity = 0.45

        innerDatasets['label'] = choosenCountries
        innerDatasets['backgroundColor'] = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`
        innerDatasets['borderColor'] = setColor(choosenCountries)
        innerDatasets['data'] = []
        innerDatasets['order'] = 1

        Object.entries(rawData[choosenCountries]).map(sites => {
          let data = {}
          if (choosenSites[0] && choosenSites[0] !== 'all') {
            if (choosenSites.includes(sites[0])) {
              data = {
                site: sites[0],
                x: parseFloat((sites[1].econsent / sites[1].total) * 100).toFixed(2), /* Convert econsent value to percentage */
                y: parseFloat((sites[1].uploaded / sites[1].total) * 100).toFixed(2), /* Convert uploaded value to percentage */
                v: this.siteScale(sites[1].total),
                self: sites[1].self,
                dual: sites[1].dual,
                uploadedRemark: sites[1].uploadedRemark,
                xAmount: sites[1].econsent,
                yAmount: sites[1].uploaded,
                total: sites[1].total,
              }
            }
          } else {
            data = {
              site: sites[0],
              x: parseFloat((sites[1].econsent / sites[1].total) * 100).toFixed(2), /* Convert econsent value to percentage */
              y: parseFloat((sites[1].uploaded / sites[1].total) * 100).toFixed(2), /* Convert uploaded value to percentage */
              v: this.siteScale(sites[1].total),
              self: sites[1].self,
              dual: sites[1].dual,
              uploadedRemark: sites[1].uploadedRemark,
              xAmount: sites[1].econsent,
              yAmount: sites[1].uploaded,
              total: sites[1].total
            }
          }

          innerDatasets.data.push({...data})
        })

        datasets.push(innerDatasets)
      }

      const response = { labels: defineCountries, datasets }

      return response;
    },
    wrangleParticipant (rawData, choosenCountries = 'all', choosenSites = ['all']) {
      if (!rawData) return
      const datasets = []
      const innerDatasets = {}

      // Define colors for each countries
      const defineCountries = Object.keys(rawData)
      const setColors = d3.scaleOrdinal()
        .domain(defineCountries)
        .range(['#31415B', '#00C3B3', '#FBC952', '#B382FE', '#71C200', '#D8D8D8'])

      if (choosenCountries === 'all') {
        Object.entries(rawData).map(countries => {
          const c = d3.color(setColors(countries[0]))
          c.opacity = 0.45

          innerDatasets['label'] = countries[0]
          innerDatasets['backgroundColor'] = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`
          innerDatasets['borderColor'] = setColors(countries[0])
          innerDatasets['data'] = []
          innerDatasets['order'] = 1

          Object.entries(countries[1]).map(sites => {
            let data = {}
            if (choosenSites[0] && choosenSites[0] !== 'all') {
              if (choosenSites.includes(sites[0])) {
                data = {
                  site: sites[0],
                  x: Number((sites[1].quizQompletion / sites[1].quizAttempts * 100).toFixed(2)),
                  y: Number((sites[1].quizIncomplete / sites[1].quizAttempts * 100).toFixed(2)),
                  v: this.siteScale(sites[1].quizAttempts),
                  xAmount: sites[1].quizQompletion,
                  yAmount: sites[1].quizIncomplete,
                  total: sites[1].quizAttempts
                }
              }
            } else {
              data = {
                site: sites[0],
                x: Number((sites[1].quizQompletion / sites[1].quizAttempts * 100).toFixed(2)),
                y: Number((sites[1].quizIncomplete / sites[1].quizAttempts * 100).toFixed(2)),
                v: this.siteScale(sites[1].quizAttempts),
                xAmount: sites[1].quizQompletion,
                yAmount: sites[1].quizIncomplete,
                total: sites[1].quizAttempts
              }
            }

            innerDatasets.data.push({ ...data })
          })

          datasets.push({ ...innerDatasets })
        })
      } else {
        const c = d3.color(setColors(choosenCountries))
        c.opacity = 0.45

        innerDatasets['label'] = choosenCountries
        innerDatasets['backgroundColor'] = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`
        innerDatasets['borderColor'] = setColors(choosenCountries)
        innerDatasets['data'] = []
        innerDatasets['order'] = 1

        Object.entries(rawData[choosenCountries]).map(sites => {
          let data = {}
          if (choosenSites[0] && choosenSites[0] !== 'all') {
            if (choosenSites.includes(sites[0])) {
              data = {
                site: sites[0],
                x: parseFloat((sites[1].quizQompletion / sites[1].quizAttempts) * 100).toFixed(2), /* Convert econsent value to percentage */
                y: parseFloat((sites[1].quizIncomplete / sites[1].quizAttempts) * 100).toFixed(2), /* Convert uploaded value to percentage */
                v: this.siteScale(sites[1].quizAttempts),
                xAmount: sites[1].quizQompletion,
                yAmount: sites[1].quizIncomplete,
                total: sites[1].quizAttempts
              }
            }
          } else {
            data = {
              site: sites[0],
              x: parseFloat((sites[1].quizQompletion / sites[1].quizAttempts) * 100).toFixed(2), /* Convert econsent value to percentage */
              y: parseFloat((sites[1].quizIncomplete / sites[1].quizAttempts) * 100).toFixed(2), /* Convert uploaded value to percentage */
              v: this.siteScale(sites[1].quizAttempts),
              xAmount: sites[1].quizQompletion,
              yAmount: sites[1].quizIncomplete,
              total: sites[1].quizAttempts
            }
          }

          innerDatasets.data.push({...data})
        })

        datasets.push({...innerDatasets})
      }

      const response = { labels: defineCountries, datasets }

      return response
    },
    setScaleTotalData(){
      if (!this.rawData) return

      let min = 999999;
      let max = 0;
      Object.values(this.rawData).forEach(byCountry=>{
        Object.values(byCountry).forEach(bySite=>{
          if (bySite.total >= max) {
            max = bySite.total;
          }
          if (bySite.total <= min) {
            min = bySite.total;
          }
        })
      })
      var siteScale = d3.scaleLinear()
      .domain([min, max])
      .range([500, 1000]); // 500 and 1000 define radius size for the bubble
      this.siteScale = siteScale;
    },
    getDataFromRadioButton(payload) {
      this.filter("country", payload);
    },
    getDataFromCheckbox(payload) {
      this.filter("site", payload.isCheckAll ? ["all"] : payload.checkedDatas);
    },
    async filter(triggerBy, filterValue) {
      switch (triggerBy) {
        case 'country': {
          if (this.sitesSelected[0] && this.sitesSelected[0] !== 'all') {
            this.sitesSelected = ['all']
          }

          this.countrySelected = filterValue
          this.allSitesList = filterValue === 'all'
            ? Econsent.getAllSites(this.rawData)
            : Object.keys(this.rawData[filterValue])

          break
        }
        case 'site': {
          const siteSelected = Array.isArray(filterValue) && filterValue.length < 1 ? ['all'] : filterValue
          this.sitesSelected = siteSelected

          break
        }
        default:
          break
      }

      this.consentDataForVis = this.wrangleEconsentData(this.rawData, this.countrySelected, this.sitesSelected)
      this.participantStatus = this.wrangleParticipant(this.rawData, this.countrySelected, this.sitesSelected)
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

    this.studyId = this.$route.params.studyId;
    this.rawData = await this.getVisualizationRawData();
    this.countryList = Econsent.getCountryList(this.rawData);
    this.allSitesList = Econsent.getAllSites(this.rawData);
    this.totalEConcent = Econsent.getTotalEconsent(this.rawData);

    const avgEconsent = Econsent.getAverage(this.rawData, 'econsent')
    const avgUploaded = Econsent.getAverage(this.rawData, 'uploaded')

    const quizCompleted = Econsent.getAverageParticipantStatus(this.rawData, 'quizQompletion')
    const quizIncomplete = Econsent.getAverageParticipantStatus(this.rawData, 'quizIncomplete')

    console.log('[Average]', {
      avgEconsent,
      avgUploaded,
      quizCompleted,
      quizIncomplete
    })

    this.econsentAnnotation = {
      verticalValue: avgEconsent,
      verticalContent: 'Average eConsent',
      horizontalValue: avgUploaded,
      horizontalContent: 'Average Uploaded'
    }

    this.quizAnnotation = {
      verticalValue: quizIncomplete,
      verticalContent: 'Average Incomplete Quiz',
      horizontalValue: quizCompleted,
      horizontalContent: 'Average Completed Quiz'
    }

    // ================================
    // |  Get data Econsent vs Upload |
    // \=============================|
    const tmpEconsentVsUploaded = Econsent.getEconsentVsUploaded(this.rawData)
    this.visEconsentVsUploaded = {
      labels: tmpEconsentVsUploaded ? Object.keys(tmpEconsentVsUploaded) : [],
      datasets: [
        {
          label: '',
          data: tmpEconsentVsUploaded ? Object.values(tmpEconsentVsUploaded) : [],
          borderColor: ['#FBC952', '#00C3B3'],
          backgroundColor: ['#FBC952', '#00C3B3'],
          borderWidth: 2,
        }
      ]
    }

    this.setScaleTotalData();
    this.consentDataForVis = this.wrangleEconsentData(this.rawData); /* get visual for main chart */
    this.participantStatus = this.wrangleParticipant(this.rawData)
    this.mostParticipant = Econsent.getMostEconsent(this.rawData)

    this.tooltipsEconsentOptions = tooltipEconsent /* Set options for tooltips callback */
    this.tooltipsParticipantQuizOptions = tooltipsParticipantQuiz /* Set options for tooltips callback */

    if (!this.isLoading) { this.loader.hide(); }
  },
};
</script>
<style scoped>
.topEconsentRow {
  height: 220px;
}
</style>
