<template>
  <div class="recruitment-contents">
    <div v-if="!rawData">
      <no-data-page
        titleProps="Data is not available"
        iconProps="far fa-sad-tear fa-5x"
        messageProps="We can't found any data about Participant Completion for this study"
      />
    </div>
    <div v-else>
      <b-row>
        <b-colxx xxs="12">
          <div class="separator mb-5"></div>
        </b-colxx>
      </b-row>
      <!-- Top cards -->
      <b-row>
        <b-col lg="6" md="6" align-v="stretch">
          <!-- Side pie chart -->
          <donut-card
            v-if="totalParticipantData != null"
            title="Total Participant"
            :data="totalParticipantData"
            style="height: 100%;"
          ></donut-card>
        </b-col>
        <b-col lg="6" md="6" align-v="stretch">
          <!-- Side top 5 sites -->
          <b-card title="Top 5 Site">
            <p>with most complete participant</p>
            <table class="table table-hover">
              <tbody>
                <tr v-for="v in topSiteItems" :key="v.no">
                  <td>
                    <strong>{{v.no}}</strong>
                  </td>
                  <td>{{v.site_name}},{{v.country_name}}</td>
                  <td>
                    <span class="topsite-table-count">{{v.count}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
      </b-row>
      <!-- Timeline and another filters -->
      <b-row class="pl-0 pr-0 pt-4 pb-4">
        <b-colxx xxl="8" xl="8" lg="12" class="mb-4 pl-0 pr-0 pt-4">
          <b-row>
            <b-col lg="12" class="mb-4">
              <!-- Completion matrix -->
              <participant-completion-card :vis="participantCompletionData" :chosenCountry="chosenCountry" :chosenSite="sitesSelected"/>
            </b-col>
          </b-row>
        </b-colxx>
        <b-colxx xl="4" lg="12" class="mb-4 pl-0 pt-4 sticky-container">
          <radio-button-picker
            class="mb-4"
            :data="countryList"
            :title="$t('enrollment.countryFilter')"
            includeAll
            @onApply="getDataFromRadioCountry"
            ref="countryFilterCheckboxes"
          ></radio-button-picker>
          <radio-button-picker
            :data="allSitesList"
            :title="$t('enrollment.siteFilter')"
            @onApply="getDataFromRadioSite"
            ref="siteFilterCheckboxes"
          ></radio-button-picker>
        </b-colxx>
      </b-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import * as d3 from "d3";
import MainCardCenter from "../common/main-card-center";
import DonutCard from "../containers/center-text-doughnut-card";
import SimpleTextCard from "../common/simple-text-card";
import RadioButtonPicker from "../form-components/radio-button-picker.vue";
import ParticipantCompletionChartCard from "../containers/participant-completion-card";
import {ACTIVITY_STATUS} from '../../constants/config'
import NoDataPage from '../common/no-data-page'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import BarLoader from '../loader/bar-loader';
Vue.use(Loading);

const TOP_SITES_LIMIT = 5;

export default {
  components: {
    "participant-completion-card": ParticipantCompletionChartCard,
    MainCardCenter,
    SimpleTextCard,
    RadioButtonPicker,
    DonutCard,
    "custom-chart-loader": BarLoader,
    NoDataPage
  },
  data() {
    return {
      aggregationData: null,
      rawData: null,
      filteredParticipants: null,
      participantCompletionData: [],
      countryList: null,
      allSitesList: [],
      sitesSelected: "",
      countrySelected: "all",
      chosenCountry: null,
      topSiteItems: [],
      totalParticipantData: null,
      mapSiteCountry: null,
      loader: null,
    };
  },
  methods: {
    getDateString(date) {
      const d = new Date(date);
      return d.toDateString();
    },
    getDataFromRadioSite(payload) {
      this.filter("site", payload);
    },
    getDataFromRadioCountry(payload) {
      this.filter("country", payload);
    },
    refreshTotalParticipantVis() {
      // Below is the code to set doughnut chart in card top
      const totalComplete = this.aggregationData.siteInfo.reduce((total, currentValue)=> total + currentValue.totalComplete, 0);
      const inComplete = this.aggregationData.totalParticipant - totalComplete;
      const data = {
        labels: ["Completed", "Incomplete"],
        datasets: [
          {
            label: "",
            borderColor: ["#00c3b3", "#b382fe"],
            backgroundColor: ["#00c3b3", "#b382fe"],
            borderWidth: 2,
            data: [
              totalComplete,
              inComplete,
            ],
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 0,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
        },
      };
      this.totalParticipantData = data;

      //Below code to handle top 5 site
      let topSiteCounter = 0;
      const tempSiteItems = [];
      for (let siteInfo of this.aggregationData.siteInfo) {
        topSiteCounter++;
        if (topSiteCounter > TOP_SITES_LIMIT) {
          break;
        }
        tempSiteItems.push({
          no: topSiteCounter,
          site_name: siteInfo.siteName,
          country_name: siteInfo.countryName,
          count: siteInfo.totalComplete
        })
      }
      this.topSiteItems = tempSiteItems;
    },
    // Hit after mounted only
    refreshSiteFilters() {
      if (this.countrySelected === 'all') {
        const {allSites, mapSiteCountry} = this.getAllSites();
        this.allSitesList = allSites;
      } else {
        this.allSitesList = Object.keys(this.rawData[this.countrySelected]);
      }
    },
    async filter(triggerBy, filterValue) {
      switch (triggerBy) {
        case "country":
          this.countrySelected = filterValue;
          this.refreshSiteFilters();
          break;
        case "site":
          this.sitesSelected = filterValue;
          await this.prepareCompletionData();
          break;
          
      }
    },
    async getVisualizationRawData(countryName = null, siteName = null) {
      let response = null
      let data = null;
      const params = {
        studyId: this.studyId
      }
      if (siteName) {
        params.countryName = countryName;
        params.siteName = siteName;
      }
      data = await this.$api.getParticipantCompletionVisData(params);
      if (data.ok) {
        let result = data.body
        if (result.meta.status !== 200) {
          console.log(result.meta.message)
        }
        if (result.data !== {}) {
          if ('locations' in result.data) {
            response = result.data.locations
            this.aggregationData = {
              siteInfo: result.data.siteInfo,
              totalParticipant: result.data.totalParticipant
            };
            this.chosenCountry = result.data.countrySelected;
            this.sitesSelected = result.data.siteSelected;
          } else if (result.data.meta.status !== 200) {
            return null;
          }
        }
      }
      return response
    },
    getCountryList () {
      if (!this.rawData) return
      const tmpCountries = Object.keys(this.rawData)
      return tmpCountries
    },
    getAllSites () {
      if (!this.rawData) return
      let mapSiteCountry = {};
      let tmpSites = []
      Object.entries(this.rawData).map(element => {
        Object.entries(element[1]).map(elem => {
          tmpSites.push(elem[0])
          mapSiteCountry[elem[0]] = element[0]
        })
      })
      
      return {
        allSites: tmpSites,
        mapSiteCountry
      }
    },
    async prepareCompletionData(){
      this.loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        loader: 'bars',
        opacity: 0.9,
      }, {
        default: this.$createElement('custom-chart-loader'),
      });
      const countrySelected = this.mapSiteCountry[this.sitesSelected];
      this.rawData = await this.getVisualizationRawData(countrySelected, this.sitesSelected);
      this.refreshTotalParticipantVis();
      this.processCompletionData();
      this.loader.hide();
    },
    processCompletionData(){
      const participants = this.rawData[this.chosenCountry][this.sitesSelected];
      const tempParticipantCompletion = [];
      participants.forEach(d => {
        const participantData = {};
        participantData.participant_name = d.participantName;
        participantData.max_activities = d.maxActivities;
        participantData.site_id = this.sitesSelected;
        const completionMatrix = [];
        d.activities.forEach(a=>{
          const activityObj = {};
          activityObj.name = a.activityName;
          activityObj.order = a.activityOrder;
          activityObj.status = a.activityStatus;
          activityObj.completedDate = a.activityCompleteDate;
          activityObj.statusInt = ACTIVITY_STATUS[a.activityStatus];
          completionMatrix.push(activityObj);
        })
        participantData.completion_matrix = completionMatrix;
        tempParticipantCompletion.push(participantData);
      })
      this.participantCompletionData = tempParticipantCompletion;
    }
  },
  computed: {},
  async mounted() {
    this.studyId = this.$route.params.studyId;
    try {
        // Show Loader
      this.loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        loader: 'bars',
        opacity: 0.9,
      }, {
        default: this.$createElement('custom-chart-loader'),
      });
      this.rawData = await this.getVisualizationRawData();
      this.countryList = this.getCountryList();
      const {allSites, mapSiteCountry} = this.getAllSites();
      this.allSitesList = allSites;
      this.mapSiteCountry = mapSiteCountry;
      this.refreshTotalParticipantVis();
      this.refreshSiteFilters();
      this.processCompletionData();
      this.loader.hide();
      this.loader = null;
    } catch (error) {
      this.loader.hide();
      this.loader = null;
    }
  },
};
</script>