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
        <b-col lg="4" md="4" align-v="stretch">
          <!-- Side pie chart -->
          <donut-card
            v-if="totalParticipantData != null"
            title="Compliance Average in Study"
            :data="totalParticipantData"
            style="height: 100%;"
          ></donut-card>
        </b-col>
        <b-col lg="4" md="4" align-v="stretch" >
          <!-- Side top 5 sites -->
          <checkbox-picker
            :data="countryList"
            :title="$t('enrollment.countryFilter')"
            includeAll
            @onApply="getDataFromCheckboxCountry"
            style="height: 100%;"
            ref="countryFilterCheckboxes" />
        </b-col>
        <b-col lg="4" md="4" align-v="stretch" class="pl-0">
          <!-- Side top 5 sites -->
          <checkbox-picker
            :data="allSitesList"
            :title="$t('enrollment.siteFilter')"
            @onApply="getDataFromCheckboxSite"
            style="height: 100%;"
            ref="siteFilterCheckboxes" />
        </b-col>
      </b-row>
      <!-- Timeline and another filters -->
      <b-row class="pl-0 pr-0 pt-4 pb-4">
        <b-colxx xxl="8" xl="8" lg="12" class="mb-4 pl-10 pr-10 pt-4">
          <b-tabs class='toggle-compliance-chart'>
            <b-tab class='compliance-chart' :title="$t('enrollment.completionChartTitle')">
              <!-- Completion matrix -->
              <participant-completion-card 
                :vis="participantCompletionData" 
                :boundaryValue="boundaryValue"
                :onDataPointClick="getParticipantDetails"
                 />
            </b-tab>
            <b-tab class='compliance-line' :title="$t('datapoint.compliancePerformance')" active>
              <compliance-overview-card 
                :vis="complianceOverviewData" 
                :boundaryValue="boundaryValue"
                :onDataPointClick="getParticipantDetails"
                 />
              <!-- <pie-chart-card :vis="visParticipantStatus" :title="$t('enrollment.participantStatus')"></pie-chart-card> -->
            </b-tab>
          </b-tabs>

        </b-colxx>
        <b-colxx xl="4" lg="12" class="mb-4 pl-0 pt-4 sticky-container">
          <date-slider-picker
            class="mb-4"
            :minDateTime="minDate"
            :maxDateTime="maxDate"
            :title="$t('enrollment.completionDateTitle')"
            @onDragEnd="getDataFromDateSlider"
          />

          <b-card :title="$t('enrollment.participantListCompliance')">
            <p class="font-italic">{{$t('datapoint.clickInformation')}}</p>
            <vue-perfect-scrollbar
              class="scroll common-container"
              :settings="{ suppressScrollX: true, wheelPropagation: false }"
            >
              <b-table class='compliance-detail-table' :sticky-header="true" striped hover :items="highlightParticipants" :small="true"></b-table>
            </vue-perfect-scrollbar>
          </b-card>
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
import CheckboxPicker from "../form-components/checkbox-picker";
import DateSliderPicker from "../form-components/date-picker-slider";
import ParticipantCompletionChartCard from "../containers/participant-compliance-card";
import ComplianceOverviewCard from "../containers/compliance-overview-card";
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
    ComplianceOverviewCard,
    MainCardCenter,
    SimpleTextCard,
    RadioButtonPicker,
    CheckboxPicker,
    DonutCard,
    "custom-chart-loader": BarLoader,
    NoDataPage,
    DateSliderPicker
  },
  data() {
    return {
      aggregationData: null,
      rawData: null,
      filteredParticipants: null,
      participantCompletionData: [],
      complianceOverviewData: [],
      countryList: [],
      allSitesList: [],
      sitesSelected: ["all"],
      countrySelected: ["all"],
      topSiteItems: [],
      totalParticipantData: null,
      mapSiteCountry: {},
      loader: null,
      highlightParticipants: [],
      boundaryValue: null,
      participantDetails: null,
      minDate: null,
      maxDate: null,
      filterDateMin: null,
      filterDateMax: null,
      filterTriggerBy: null,
    };
  },
  methods: {
    getDateString(date) {
      const d = new Date(date);
      return d.toDateString();
    },
    getDataFromCheckboxSite(payload) {
      this.filterTriggerBy = 'site'
      const {isCheckAll, checkedDatas} = payload;
      if (isCheckAll) {
        payload = ["all"]
      } else {
        payload = checkedDatas
      }
      this.filter("site", payload);
    },
    getDataFromCheckboxCountry(payload) {
      this.filterTriggerBy = 'country'
      const {isCheckAll, checkedDatas} = payload;
      if (isCheckAll) {
        payload = ["all"]
      } else {
        payload = checkedDatas
      }
      this.filter("country", payload);
    },
    getDataFromDateSlider(payload) {
      const {chosenRange} = payload;
      this.filter("date", chosenRange);
    },
    refreshTotalParticipantVis(totalComplete = 0, inComplete = 0) {
      // Below is the code to set doughnut chart in card top
      // const totalComplete = this.aggregationData.siteInfo.reduce((total, currentValue)=> total + currentValue.totalComplete, 0);
      // const inComplete = this.aggregationData.totalParticipant - totalComplete;
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
          this.sitesSelected = ["all"];
          this.processCompletionData();
          break;
        case "site":
          this.sitesSelected = filterValue;
          await this.processCompletionData();
          break;
        case "date":
          const fromDate = filterValue[0];
          const toDate = filterValue[1];
          this.filterDateMin = fromDate;
          this.filterDateMax = toDate;
          if (this.filterDateMin === this.minDate && this.filterDateMax === this.maxDate) {
            this.filterDateMin = null;
            this.filterDateMax = null; //if both range same as min/max, no need to use filter
          }
          await this.processCompletionData();
          break;
      }
    },
    async getVisualizationRawData(countryName = null, siteName = null) {
      let response = null
      let data = null;
      const params = {
        studyId: this.studyId
      }
      data = await this.$api.getParticipantComplianceVisData(params);
      
      if (data.ok) {
        try {
        response = d3.csvParse(data.body);
        this.minDate = new Date(response[0].date).getTime();
        this.maxDate = new Date(response[response.length- 1].date).getTime();
        response = d3.nest()
        .key(d => d.date).sortKeys(d3.ascending)
        .key(d => d.countryName).sortKeys(d3.ascending)
        .key(d => d.siteName).sortKeys(d3.ascending)
        .entries(response);
        } catch (error) {
          console.error(error)
          return null;
        }
      }
      return response
    },
    async getVisualizationDetailRawData(date) {
      let response = null
      let data = null;
      const params = {
        studyId: this.studyId
      }
      if (date) {
        params.date = date;
      } else {
        console.error('Missing mandatory variable: date')
        return;
      }
      data = await this.$api.getParticipantComplianceDetailsVisData(params);
      
      if (data.ok) {
        try {
          let result = data.body
          if (result.meta.status !== 200) {
            console.log(result.meta.message)
            return;
          }
          if (result.data) {
            this.participantDetails = result.data;
            console.log(`This detailDate: ${this.participantDetails.date}`)
          }
        } catch (error) {
          console.error(error)
          return null;
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
    async getParticipantDetails(payload){
      const chosenData  = 
        this.participantCompletionData[payload.config.seriesIndex].data[payload.config.dataPointIndex]; //seriesIndex 0 = Compliance Rate. seriesIndex 1 = Completion Rate
      const [chosenTime] = chosenData; // chosenData index 0 shows x Axis, index 1 shows y Axis, index 2 shows radius
      const dateString = new Date(chosenTime).toISOString().substring(0, 10);
      console.log(chosenData)
      console.log(dateString)
      if (this.participantDetails && this.participantDetails.date === dateString) {
        this.showParticipantDetails(payload.config.seriesIndex, chosenData[1]); // no need hit backend if user want to show data in the same date
        return;
      }
      this.loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        loader: 'bars',
        opacity: 0.9,
      }, {
        default: this.$createElement('custom-chart-loader'),
      });
      await this.getVisualizationDetailRawData(dateString);
      this.showParticipantDetails(payload.config.seriesIndex, chosenData[1]);
      this.loader.hide();
    },
    showParticipantDetails(seriesIndex, chosenRange){
      const details = [];
      const minRange = chosenRange - 5;
      const maxRange = chosenRange + 5;
      let chosenMetrics = null;
      if (seriesIndex === 0){
        chosenMetrics = 'complianceRate'
      } else if (seriesIndex === 1){
        chosenMetrics = 'completionRate'
      }
      
      for (const country in this.participantDetails.details) {
        if (this.countrySelected[0] !== 'all' && !this.countrySelected.includes(country)) {
          continue;
        }
        for (const site in this.participantDetails.details[country]){
          if (this.sitesSelected[0] !== 'all' && !this.sitesSelected.includes(site)) {
            continue;
          }
          for (const detail of this.participantDetails.details[country][site]) {
            const filteredDetail = {
              Id: detail.participantId,
              Name: detail.participantName,
            }
            if (seriesIndex === 0){
              filteredDetail.completed = detail.completed;
              filteredDetail.Incomplete = detail.incompleted;
            } else if (seriesIndex === 1){
              filteredDetail.completedToDate = detail.completedToDate;
              filteredDetail.maxActivities = detail.maxActivities;
            }
            filteredDetail.site = site;
            if (chosenRange === 100 && detail[chosenMetrics] === 100) {
              details.push(filteredDetail);
            } else if (chosenRange === 0 && detail[chosenMetrics] === 0) {
              details.push(filteredDetail)
            } else if (minRange <= detail[chosenMetrics] && maxRange >= detail[chosenMetrics] ){
              details.push(filteredDetail)
            }
          }
        }
      }
      this.highlightParticipants = details;
    },
    processCompletionData(){
      const complianceAverage = [
        {
          name: this.$t('datapoint.complianceAverage'),
          data: this.sitesSelected[0] !== 'all' ? this.complianceOverviewData[0].data : []
        }
      ];
      const complianceData = [
        {
          name: this.$t('datapoint.complianceRateLegend'),
          data: []
        },
        {
          name: this.$t('datapoint.completionRateLegend'),
          data: []
        }
      ]
      let maxComplianceValue = 0;
      let maxCompletionValue = 0;
      let minComplianceValue = Number.MAX_SAFE_INTEGER;
      let minCompletionValue = Number.MAX_SAFE_INTEGER;
      let completedActivityCounter = 0;
      let incompleteActivityCounter = 0;
      for (var dateData of this.rawData) {
        let allComplianceValue = 0;
        let allParticipants = 0;
        const dateTime = new Date(dateData.key).getTime();
        if (this.filterDateMin && this.filterDateMin >= dateTime) {
          continue;
        }
        if (this.filterDateMax && this.filterDateMax <= dateTime) {
          continue;
        }
        let complianceMap = new Map();
        let completionMap = new Map();
        for (var countryData of dateData.values) {
          if (this.countrySelected[0] !== 'all' && !this.countrySelected.includes(countryData.key)) {
            continue;
          }
          for (var siteData of countryData.values) {
            if (this.sitesSelected[0] !== 'all' && !this.sitesSelected.includes(siteData.key)) {
              continue;
            }
            let siteComplianceOverviewValues = 0; // these 2 variables to calculate site compliance average
            let siteComplianceOverviewParticipants = 0;
            const complianceGroups = siteData.values[0].complianceColumnList.split(';');
            const complianceValues = siteData.values[0].complianceValueList.split(';');
            for (let index = 0; index < complianceGroups.length; index++) {
              const g = complianceGroups[index];
              const complianceValue = this.getYValueFromGroup(g);
              const numOfParticipants = complianceValues[index];
              if (numOfParticipants > maxComplianceValue){
                maxComplianceValue = numOfParticipants;
              };
              if (numOfParticipants < minComplianceValue){
                minComplianceValue = numOfParticipants;
              };
              if (complianceMap.has(complianceValue)){
                complianceMap.set(complianceValue, Number(complianceMap.get(complianceValue)) + Number(numOfParticipants));
              } else {
                complianceMap.set(complianceValue, Number(numOfParticipants));
              }
              siteComplianceOverviewValues = complianceValue * numOfParticipants;
              siteComplianceOverviewParticipants += numOfParticipants;
            }

            //begin site average calculation
            if (this.filterTriggerBy === 'site') {
              const siteComplianceAverage = (siteComplianceOverviewValues / siteComplianceOverviewParticipants).toFixed(2);
              let siteComplianceAvgObj = null;
              siteComplianceAvgObj = complianceAverage.find(c=> c.name === `Compliance Average for ${siteData.key}`);
              if (siteComplianceAvgObj) {
                siteComplianceAvgObj.data.push([dateTime, siteComplianceAverage])
              } else {
                siteComplianceAvgObj = {
                  name: `Compliance Average for ${siteData.key}`,
                  data: [[dateTime, siteComplianceAverage]]
                };
                complianceAverage.push(siteComplianceAvgObj);
              }
            }
            //end
            const completionGroups = siteData.values[0].completionColumnList.split(';');
            const completionValues = siteData.values[0].completionValueList.split(';');
            for (let index = 0; index < completionGroups.length; index++) {
              const g = completionGroups[index];
              const complianceValue = this.getYValueFromGroup(g);
              const numOfParticipants = completionValues[index];
              if (numOfParticipants > maxCompletionValue){
                maxCompletionValue = numOfParticipants;
              }
              if (numOfParticipants < minCompletionValue){
                minCompletionValue = numOfParticipants;
              };
              if (completionMap.has(complianceValue)){
                completionMap.set(complianceValue, Number(completionMap.get(complianceValue)) + Number(numOfParticipants));
              } else {
                completionMap.set(complianceValue, Number(numOfParticipants));
              }
            }
          }
        };
        for (let [key, value] of complianceMap) {
          const complianceVal = key * value;
          allComplianceValue += complianceVal;
          allParticipants += value;
          if (key === 100) {
            completedActivityCounter += value;
          } else {
            incompleteActivityCounter += value;
          }
          complianceData[0].data.push([dateTime, Number(key), Number(value)]); //complianceData[0] = compliance
        }
        if (this.sitesSelected[0] === 'all') { //complianceAverage will only be filled if the trigger is changing the country filter
          const complianceVal = (allComplianceValue / allParticipants).toFixed(2)
          const complianceComponentValue = [dateTime, complianceVal];
          complianceAverage[0].data.push(complianceComponentValue)
        }
        
        for (let [key, value] of completionMap) {
          complianceData[1].data.push([dateTime, Number(key), Number(value)]); //complianceData[1] = completion
        }
      }

      // process scaling Z val. Below lines will set the radius of bubble using log scale
      const complianceBubbleRadius = d3.scaleLog().domain([minComplianceValue, maxComplianceValue]).range([10, 30]).base(10);
      const completionBubbleRadius = d3.scaleLog().domain([minCompletionValue, maxCompletionValue]).range([10, 30]).base(10);
      // console.log(typeof complianceBubbleRadius)
      for (let index = 0; index < complianceData[0].data.length; index++) {
        const seriesElement = complianceData[0].data[index];
        seriesElement[2] = complianceBubbleRadius(seriesElement[2])
      }
      for (let index = 0; index < complianceData[1].data.length; index++) {
        const seriesElement = complianceData[1].data[index];
        seriesElement[2] = completionBubbleRadius(seriesElement[2])
      }
      this.refreshTotalParticipantVis(completedActivityCounter, incompleteActivityCounter)
      this.boundaryValue = {
        minComplianceValue,
        maxComplianceValue,
        minCompletionValue,
        maxCompletionValue
      }
      console.log(complianceAverage)
      this.complianceOverviewData = complianceAverage
      this.participantCompletionData = complianceData;
    },
    getYValueFromRate(rate){
      switch (rate) {
        case rate === 0:
          return 0;
        case rate > 0 && rate <= 5:
          return 5;
        case '10-20':
          return 15;
        case '20-30':
          return 25;
        case '30-40':
          return 35;
        case '40-50':
          return 45;
        case '50-60':
          return 55;
        case '60-70':
          return 65;
        case '70-80':
          return 75;
        case '80-90':
          return 85;
        case '90-99':
          return 95;
        case '100':
          return 100;
      }
    },
    getYValueFromGroup(group){
      let groupValues = null;
      if (group.includes('compliance')){
        groupValues = group.split('compliance-').pop();
      } else if (group.includes('completion')) {
        groupValues = group.split('completion-').pop();
      }
      switch (groupValues) {
        case '0':
          return 0;
        case '1-10':
          return 5;
        case '10-20':
          return 15;
        case '20-30':
          return 25;
        case '30-40':
          return 35;
        case '40-50':
          return 45;
        case '50-60':
          return 55;
        case '60-70':
          return 65;
        case '70-80':
          return 75;
        case '80-90':
          return 85;
        case '90-99':
          return 95;
        case '100':
          return 100;
      }
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
      let countrySet = new Set()
      let siteSet = new Set()
      this.rawData.forEach(d=>{
        d.values.forEach(c=>{
          countrySet.add(c.key)
          c.values.forEach(s=>{
            siteSet.add(s.key)
          })
        })
      })
      this.countryList = Array.from(countrySet);
      // const {allSites, mapSiteCountry} = this.getAllSites();
      this.allSitesList = Array.from(siteSet);
      // this.mapSiteCountry = mapSiteCountry;
      // this.allSitesList = ['Default Site'];
      // this.mapSiteCountry['Default Site'] = 'United States'
      this.refreshTotalParticipantVis();
      // this.refreshSiteFilters();
      this.processCompletionData();
      this.loader.hide();
      this.loader = null;
    } catch (error) {
      console.error(error)
      this.loader.hide();
      this.loader = null;
    }
  },
};
</script>

<style>
.toggle-compliance-chart .nav-link{
  border-radius: 20px;
  color: #D1D4D5;
}
.toggle-compliance-chart .nav-link.active{
  background: white;
  border: 1px solid gray;
  color: #495057;
}
.toggle-compliance-chart .nav-tabs{
  position: absolute;
  top: 10px;
  right: 18px;
  z-index: 3;
  border-bottom: none;
}
.toggle-compliance-chart .nav-tabs .nav-item{
  margin-right: 10px;
}
</style>
