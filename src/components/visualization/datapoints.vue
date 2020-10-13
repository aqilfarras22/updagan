<template>
  <div class="data-collection-points">
    <b-row>
      <b-colxx xxs="12">
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <!-- Top cards -->
    <b-row>
      <b-colxx xl="4" lg="4" md="12" class="mb-4 pl-0">
        <main-card-center>
          <br />
          <i
            :class="'fas fa-comment-alt fa-6x mr-2 text-white align-text-bottom d-inline-block heading-2 mb-2 mt-3'"
          />
          <br />
          <p class="text-white card-text-strong">Data Missing</p>
          <p class="card-text-lead">{{totalDataMissing}}</p>
        </main-card-center>
      </b-colxx>

      <b-colxx xl="4" lg="4" md="12" class="mb-4 pl-0">
        <!-- Side top 5 sites -->
        <b-card title="Top 5 Site" class="mb-0">
          <p>Data Point Missing</p>
          <table class="table table-hover">
            <tbody>
              <tr v-for="v in topFiveMissing" :key="v.no">
                <td>
                  <strong>{{v.no}}</strong>
                </td>
                <td>{{v.site}}</td>
                <td style="text-align:right">
                  <span class="topsite-table-count">{{v.percentage}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </b-card>
      </b-colxx>

      <b-colxx xl="4" lg="4" md="12" class="mb-4 pl-0">
        <!-- Side top 5 sites -->
        <b-card title="Top 5 Site">
          <p>Data Point Captured</p>
          <table class="table table-hover">
            <tbody>
              <tr v-for="v in topFiveCaptured" :key="v.no">
                <td>
                  <strong>{{v.no}}</strong>
                </td>
                <td>{{v.site}}</td>
                <td style="text-align:right">
                  <span class="topsite-table-count">{{v.percentage}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </b-card>
      </b-colxx>
    </b-row>

    <!-- Timeline and another filters -->
    <b-row class="pl-0 pr-0 pt-4 pb-4">
      <b-colxx xxl="8" xl="8" lg="12" class="mb-4 pl-0 pr-0 pt-4">
        <b-row>
          <b-col lg="12" class="mb-4 pl-0">
            <!-- Bar chart -->
            <bar-chart-card v-if="barDataForVis" :vis="barDataForVis.data"></bar-chart-card>
          </b-col>
        </b-row>
      </b-colxx>
      <b-colxx xl="4" lg="4" class="mb-4 pl-0 pt-4 sticky-container">
        <checkbox-picker
          :data="countryList"
          :title="$t('datapoint.countryFilter')"
          @onApply="getDataFromCheckboxCountry"
        ></checkbox-picker>
        <checkbox-picker
          :data="siteList"
          :title="$t('datapoint.siteFilter')"
          @onApply="getDataFromCheckboxSite"
        ></checkbox-picker>
      </b-colxx>
    </b-row>

  </div>
</template>


<script>
import Vue from 'vue';
import * as d3 from "d3";
import MainCardCenter from "../common/main-card-center";
import SimpleTextCard from "../common/simple-text-card";
import CheckboxPicker from "../form-components/checkbox-picker";
import RadioButtonPicker from "../form-components/radio-button-picker.vue";
import DataPointBarChartCard from "../containers/data-point-bar-card";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import BarLoader from '../loader/bar-loader';
Vue.use(Loading);


export default {
  components: {
    "bar-chart-card": DataPointBarChartCard,
    CheckboxPicker,
    MainCardCenter,
    SimpleTextCard,
    RadioButtonPicker,
    "custom-chart-loader": BarLoader,
  },
  data() {
    return {
      rawData: null,
      filteredRawData: null,
      filteredDataByCountry: {},
      allData: null,
      allDatabySites: null,
      barDataForVis: null,
      countryList: null,
      siteList: null,
      sitesSelected: ["all"],
      countrySelected: ["all"],
      totalDataMissing: 0,
      topFiveMissing: null,
      topFiveCaptured: null,
      loader: null,
    };
  },
  methods: {
    getDataFromCheckboxCountry(payload) {
      console.log('On Clicked');
      console.log(payload.checkedDatas);
      this.filter("country", payload.checkedDatas);
    },
    getDataFromCheckboxSite(payload) {
      console.log('On Clicked');
      console.log(payload.checkedDatas);
      this.filter("site", payload.checkedDatas);
    },
    async getVisualizationRawData() {
      const response = await this.$api.getCollectionPointData(this.studyId);
      return response;
    },
    async filter(triggerBy, filterValue) {
      switch (triggerBy) {
        case "country":
          this.countrySelected = filterValue;
          this.allData = await this.filterbyCountry(this.rawData, this.countrySelected);
          this.barDataForVis = await this.wrangleDataPoints(this.allData);

          if(Array.isArray(filterValue)){

            console.log('filterValue');
            console.log(filterValue)

            let tempSiteList = [];
            for (var key in filterValue) {
              console.log(key);
              console.log(filterValue[key]);

              let list = Object.keys(this.rawData[filterValue[key]]);
              tempSiteList.push(list);
            }

            this.siteList = tempSiteList.flat();

          } else {
            this.siteList = await this.getAllSite(this.rawData)
          }
          break;
        case "site":
          this.allDatabySites = await this.filterbySite(this.allData, filterValue);
          this.barDataForVis = await this.wrangleDataPoints(this.allDatabySites);
          break;
      }
    },
    async wrangleDataPoints(payload){

      console.log('payload');
      console.log(payload);

      var labels = payload.map(function(o) { return o.site; });
      var dataMissing = payload.map(function(o) { return o.percentMissing; });
      var dataCaptured = payload.map(function(o) { return o.percentCaptured; });
            
      const barData = {
        labels: labels,
        datasets: [
          {
            label: 'Data Missing',
            backgroundColor: '#00C3B3',
            borderColor: '#00C3B3',
            order: 1,
            data: dataMissing
          },
          {
            label: 'Data Captured',
            backgroundColor: '#FBC952',
            borderColor: '#FBC952',
            order: 1,
            data: dataCaptured
          }
        ]
      }

      return {
        data: barData
      };

    },
    getTop5Sites(payload){
      payload.sort( (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))

      let counter = 1;
      payload = payload.map(function(el) {
        var o = Object.assign({}, el);
        o.no = counter;
        counter++;
        return o;
      })

      return payload.slice(0, 5);
    },
    getTotalMissing(payload){
      return payload.reduce((accum,item) => accum + item.total, 0)
    },
    async filterbySite(rawData, choosenSites){

      var filtered = rawData.filter(function(item) {
          var site = item.site.split(', ');
          return choosenSites.indexOf(site[0]) !== -1;
      });

      return filtered;
    },
    async filterbyCountry(rawData, choosenCountries){

      let result;
      
      let dataMissing = [];
      let dataCaptured = [];
      let allData = [];


      if(Array.isArray(choosenCountries)){ // get inside choosen specific countries

        choosenCountries.forEach(function(key, value){

          Object.entries(rawData[key]).forEach(element => {
            let total = element[1][0].data_missing + element[1][0].data_captured;
            let percentMissing = Math.round((element[1][0].data_missing / total) * 100);
            let percentCaptured = Math.round((element[1][0].data_captured / total) * 100);

            dataMissing.push({
              'site' : element[0] + ', ' + key,
              'percentage' : percentMissing + '%',
              'total': element[1][0].data_missing
            })

            dataCaptured.push({
              'site' : element[0] + ', ' + key,
              'percentage' : percentCaptured + '%',
              'total': element[1][0].data_captured
            })

            allData.push({
              'site' : element[0]  + ', ' + key,
              'percentMissing' : percentMissing,
              'percentCaptured' : percentCaptured,
            })
            
          })

        });

      } else { // get inside choosen countries all
        for (var key in rawData) {
          Object.entries(rawData[key]).forEach(element => {
            let total = element[1][0].data_missing + element[1][0].data_captured;
            let percentMissing = Math.round((element[1][0].data_missing / total) * 100);
            let percentCaptured = Math.round((element[1][0].data_captured / total) * 100);

            dataMissing.push({
              'site' : element[0] + ', ' + key,
              'percentage' : percentMissing + '%',
              'total': element[1][0].data_missing
            })

            dataCaptured.push({
              'site' : element[0] + ', ' + key,
              'percentage' : percentCaptured + '%',
              'total': element[1][0].data_captured
            })

            allData.push({
              'site' : element[0]  + ', ' + key,
              'percentMissing' : percentMissing,
              'percentCaptured' : percentCaptured,
            })
            
          })
        }

      }

      this.totalDataMissing = this.getTotalMissing(dataMissing);
      this.topFiveMissing = this.getTop5Sites(dataMissing);
      this.topFiveCaptured = this.getTop5Sites(dataCaptured);
      
      return allData;

    },
    async getAllSite(object){
      let tmpSiteList = [];
      Object.entries(object).map(element => {
        Object.entries(element[1]).map(elem => {
          tmpSiteList.push(elem[0]);
        });
      });

      tmpSiteList = tmpSiteList.reduce((arr, current) => arr.includes(current) ? arr : [...arr, current], []);

      return tmpSiteList
    }
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

    this.rawData = await this.getVisualizationRawData();
    // Get countries
    this.countryList = Object.keys(this.rawData);
    // Get sites
    this.siteList = await this.getAllSite(this.rawData);

    console.log(this.siteList);

    this.filter('country', 'all');

    this.loader.hide();
    this.loader = null;
  },
};
</script>


<style scoped>
.card-title {
  margin-bottom: 0px !important;
}
</style>