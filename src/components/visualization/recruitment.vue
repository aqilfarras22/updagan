<template>
  <div class="recruitment-contents">
    <b-row>
      <b-colxx xxs="12">
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <!-- Study dropdown groups -->
    <b-row>
      <b-colxx xxs="12" class="mb-4">
        <b-row class="mb-4">
          <b-colxx md="12">
            <!-- FPI selector -->
            <b-dropdown
              id="country-select"
              text="Select FPI"
              size="xs"
              variant="outline-secondary"
              class="pl-0 pr-8"
            >
              <b-dropdown-item
                v-for="fpiSel in fpiSelectList"
                :key="fpiSel.value"
                :value="fpiSel.value"
                @click="filter('fpi', fpiSel.value)"
              >{{fpiSel.name}}</b-dropdown-item>
            </b-dropdown>
            <!-- Active selector -->
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
    <!-- Top cards -->
    <b-row v-if="rawData">
      <b-colxx xl="4" lg="6" md="12" class="mb-4">
        <main-card-center>
          <br />
          <i
            :class="'fas fa-map-marker-alt fa-4x mr-2 text-white align-text-bottom d-inline-block heading-2 mb-2 mt-3'"
          />
          <br />
          <p class="text-white card-text-strong">Total Sites with FPI</p>
          <p class="card-text-lead">{{totalFpiSites}}</p>
        </main-card-center>
      </b-colxx>
      <b-colxx xl="4" lg="6" md="12" class="mb-4">
        <main-card-center>
          <br />
          <i
            :class="'fas fa-map-marker-alt fa-4x mr-2 text-white align-text-bottom d-inline-block heading-2 mb-2 mt-3'"
          />
          <br />
          <p class="text-white card-text-strong">Total Sites with First Data In</p>
          <p class="card-text-lead">{{totalFirstDataSites}}</p>
        </main-card-center>
      </b-colxx>
      <b-colxx xl="4" lg="12" md="12" class="pl-0">
        <b-row>
          <b-colxx xxs="12" class="mb-4 pt-4 pb-4 pl-0 pr-0">
            <!-- Fastest FPI -->
            <b-card>
              <table>
                <tr>
                  <td>
                    <i class="fas fa-map-marker-alt fa-2x card-side-icon" />
                  </td>
                  <td>
                    <div class="ml-10">
                      <div class="card-text-title">Site with Fastest FPI</div>
                      <div class="card-text-subtitle">
                        <strong>Active Date:</strong>
                        {{fastestFpiDateBegin}}
                      </div>
                      <div class="card-text-subtitle">
                        <strong>FPI Date:</strong>
                        {{fastestFpiDateEnd}}
                      </div>
                      <div class="card-text-focused">{{fastestFpiSiteCountry}}</div>
                      <strong></strong>
                    </div>
                  </td>
                </tr>
              </table>
            </b-card>
          </b-colxx>
          <b-colxx xxs="12" class="mb-4 pt-4 pb-4 pl-0 pr-0">
            <!-- Fastest First Data -->
            <b-card>
              <table>
                <tr>
                  <td>
                    <i class="fas fa-map-marker-alt fa-2x card-side-icon" />
                  </td>
                  <td>
                    <div class="ml-10">
                      <div class="card-text-title">Site with Fastest First Data</div>
                      <div class="card-text-subtitle">
                        <strong>Active Date:</strong>
                        {{fastestFirstDataDateBegin}}
                      </div>
                      <div class="card-text-subtitle">
                        <strong>First Data Date:</strong>
                        {{fastestFirstDataDateEnd}}
                      </div>
                      <div class="card-text-focused">{{fastestFirstDataSiteCountry}}</div>
                      <strong></strong>
                    </div>
                  </td>
                </tr>
              </table>
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
    <!-- Timeline and another filters -->
    <b-row v-if="rawData" class="pl-0 pr-0 pt-4 pb-4">
      <b-colxx xxl="8" xl="8" lg="12" class="mb-4 pl-0 pr-0 pt-4">
        <b-row>
          <b-col lg="12" class="mb-4">
            <!-- Timeline chart -->
            <timeline-chart-card
              :vis="timelineDataForVis"
            ></timeline-chart-card>
          </b-col>
          <b-col lg="12" class="mb-4">
            <!-- Bar chart -->
            <bar-chart-card :vis="barDataForVis"></bar-chart-card>
          </b-col>
        </b-row>
      </b-colxx>
      <b-colxx xl="4" lg="12" class="mb-4 pl-0 pt-4 sticky-container">
        <radio-button-picker
          class="mb-4"
          :data="countryList"
          :title="$t('enrollment.countryFilter')"
          includeAll
          @onApply="getDataFromRadioButton"
        ></radio-button-picker>
        <checkbox-picker
          :data="allSitesList"
          :title="$t('enrollment.siteFilter')"
          @onApply="getDataFromCheckbox"
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
import RecruitmentTimelineCard from "../containers/recruitment-timeline-card";
import RecruitmentBarChartCard from "../containers/recruitment-bar-card";
import * as EnrollmentService from "../../services/visualization/recruitment";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import BarLoader from '../loader/bar-loader';
Vue.use(Loading);

export default {
  components: {
    "timeline-chart-card": RecruitmentTimelineCard,
    "bar-chart-card": RecruitmentBarChartCard,
    CheckboxPicker,
    MainCardCenter,
    SimpleTextCard,
    RadioButtonPicker,
    "custom-chart-loader": BarLoader,
  },
  data() {
    return {
      rawData: null,
      studyId: null,
      filteredRawData: null,
      filteredDataByStudy: {},
      timelineDataForVis: null,
      barDataForVis: null,
      countryList: null,
      mapSiteCountry: null,
      fpiSelectList: [
        { name: "All", value: "all" },
        { name: "First Participant In", value: "fpi" },
        { name: "First Data Received", value: "first_data" },
      ],
      allSitesList: [],
      sitesSelected: ["all"],
      studySelected: null,
      fpiSelected: "all",
      countrySelected: "all",
      totalFpiSites: 0,
      totalFirstDataSites: 0,
      fastestFpiDateBegin: "",
      fastestFpiDateEnd: "",
      fastestFirstDataDateBegin: "",
      fastestFirstDataDateEnd: "",
      fastestFpiSiteCountry: "",
      fastestFirstDataSiteCountry: "",
    };
  },
  methods: {
    getDateString(date) {
      const d = new Date(date);
      return d.toDateString();
    },
    getDataFromRadioButton(payload) {
      this.filter("country", payload);
    },
    getDataFromCheckbox(payload) {
      this.filter("site", payload.isCheckAll ? 'all' : payload.checkedDatas);
    },
    async filter(triggerBy, filterValue) {
      this.filteredRawData = this.rawData;
      switch (triggerBy) {
        case "country":
          this.countrySelected = filterValue;
          this.sitesSelected = ['all']
          if (filterValue === 'all'){
            const {allSites} = EnrollmentService.getAllSites(this.rawData);
            this.allSitesList = allSites;
            this.filteredRawData = JSON.parse(JSON.stringify(this.rawData)) //deep clone
          } else {
            this.filteredRawData = {};
            this.allSitesList = Object.keys(this.rawData[filterValue]);
            this.filteredRawData[filterValue] = this.rawData[filterValue];
          }
          break;
        case "site":
          this.filteredRawData = {};
          if (filterValue === 'all') {
            if (this.countrySelected === 'all'){
              this.filteredRawData = this.rawData
            } else {
              this.filteredRawData[this.countrySelected] = this.rawData[this.countrySelected]
            }
          } else {
            filterValue.forEach(siteName=> {
              const countryName = this.mapSiteCountry[siteName];
              if (!this.filteredRawData[countryName]) {
                this.filteredRawData[countryName] = {};
              }
              this.filteredRawData[countryName][siteName]=this.rawData[countryName][siteName];
            });
          }
          
          this.sitesSelected = filterValue;
          break;
        case "fpi":
          this.fpiSelected = filterValue;
          break;
      }
      
      // Display only if study is really selected
      if (this.rawData != null) {
        // Do 1st pass filter
        const chosenCountry = this.countrySelected;

        // Then update for both timeline and barchart components
        this.timelineDataForVis = await EnrollmentService.wrangleRecruitmentTimelineData(
          this.filteredRawData,
          this.fpiSelected
        );
        console.log(this.timelineDataForVis)
        this.barDataForVis = await EnrollmentService.wrangleRecruitmentBarData(
          this.filteredRawData,
          this.sitesSelected
        );
        console.log(this.barDataForVis);
        // Update summary cards
        const stats = await EnrollmentService.calculateRecruitmentStats(
          this.filteredRawData
        );
        this.fastestFpiDateBegin = this.getDateString(
          stats.fastestFpi.activeDate
        );
        this.fastestFpiDateEnd = this.getDateString(stats.fastestFpi.date);
        this.fastestFpiSiteCountry = `${stats.fastestFpi.site}, ${stats.fastestFpi.country}`;
        this.fastestFirstDataDateBegin = this.getDateString(stats.fastestFirstData.activeDate);
        this.fastestFirstDataDateEnd = this.getDateString(stats.fastestFirstData.date);
        this.fastestFirstDataSiteCountry = `${stats.fastestFirstData.site}, ${stats.fastestFirstData.country}`;
        this.totalFpiSites = stats.totalFpi;
        this.totalFirstDataSites = stats.totalFirstData;
      } else {
        this.timelineDataForVis = null;
        this.barDataForVis = null;
      }
    },
    async getVisualizationRawData() {
      let response = null
      const data = await this.$api.getRecruitmentVisData(this.studyId);


      if (data.ok) {
        let result = data.body

        if (result.data !== {}) {
          if ('locations' in result.data) {
            response = result.data.locations
          }
        }
      }

      return response
    }
  },
  computed: {},
  async mounted() {
    try {
      this.studyId = this.$route.params.studyId;
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
      this.countryList = EnrollmentService.getCountryList(this.rawData);
      const {allSites, mapSiteCountry} = EnrollmentService.getAllSites(this.rawData);
      this.allSitesList = allSites;
      this.mapSiteCountry = mapSiteCountry;
      await this.filter("study", this.studySelected);
      this.loader.hide();
      this.loader = null;
    } catch (error) {
      this.loader.hide();
      this.loader = null;
    }
  },
};
</script>