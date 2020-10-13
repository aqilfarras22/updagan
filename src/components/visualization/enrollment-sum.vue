<template>
  <div>
    <b-row>
      <b-colxx xl="4" lg="6" md="12" class="mb-4">
        <main-card>
          <div class="card-full d-flex align-center justify-center">
            <div>
              <i :class="'fas fa-map-marker-alt fa-5x text-white mb-20'" />
              <p class="lead text-600 text-white mb-20">
                Participant Percent Complete
              </p>
              <p class="text-800 text-xxl text-yellow m-0">43%</p>
            </div>
          </div>
        </main-card>
      </b-colxx>
      <b-colxx xl="4" lg="6" md="12" class="mb-4">
        <b-card class="card-full" title="Top 5 Country" sub-title="Overall Enrollment Participant">
          <ul class="mb-4 card-list--group">
            <li class="card-list">
              <span class="card-list--hash text-600">01</span>
              <p class="card-list--text">Lorem ipsum dolor</p>
              <span class="card-list--addons text-800">45%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">02</span>
              <p class="card-list--text">Sit ametconsectetur </p>
              <span class="card-list--addons text-800">42%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">03</span>
              <p class="card-list--text">Pellentesque semper</p>
              <span class="card-list--addons text-800">39%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">04</span>
              <p class="card-list--text">Maecenas est</p>
              <span class="card-list--addons text-800">25%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">05</span>
              <p class="card-list--text">Sed ultrices leo</p>
              <span class="card-list--addons text-800">17%</span>
            </li>
          </ul>
        </b-card>
      </b-colxx>
      <b-colxx xl="4" lg="12" md="12" class="mb-4">
        <b-card class="card-full" title="Top 5 Site" sub-title="Overall Enrollment Participant">
          <ul class="mb-4 card-list--group">
            <li class="card-list">
              <span class="card-list--hash text-600">01</span>
              <p class="card-list--text">Lorem ipsum dolor</p>
              <span class="card-list--addons text-800">45%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">02</span>
              <p class="card-list--text">Sit ametconsectetur </p>
              <span class="card-list--addons text-800">42%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">03</span>
              <p class="card-list--text">Pellentesque semper</p>
              <span class="card-list--addons text-800">39%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">04</span>
              <p class="card-list--text">Maecenas est</p>
              <span class="card-list--addons text-800">25%</span>
            </li>
            <li class="card-list">
              <span class="card-list--hash text-600">05</span>
              <p class="card-list--text">Sed ultrices leo</p>
              <span class="card-list--addons text-800">17%</span>
            </li>
          </ul>
        </b-card>
      </b-colxx>
    </b-row>
    <!-- START row for visualization and filter -->
    <b-row>
      <b-colxx xl="8" lg="12">
        <b-card class="card-full" title="Overall Enrollment" sub-title="Participant">
          <canvas id="participant-chart"></canvas>
        </b-card>
      </b-colxx>
      <b-colxx xl="4" lg="12" class="mb-4 sticky-container">
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
import MainCardCenter from "../common/main-card-center";
import CheckboxPicker from "../form-components/checkbox-picker";
import RadioButtonPicker from "../form-components/radio-button-picker";
import LineChart from "../charts/line-chart";

const getCountryList = rawData => { /* get all countries */
  if (!rawData || typeof rawData !== 'object') return {}

  const countries = Object.keys(rawData)
  return countries
}

const getAllSites = rawData => { /* Get all sites */
  let tmpSites = []
  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => tmpSites.push(elem[0]))
  })

  const sites = [...new Set(tmpSites)] // using set to best practice remove duplicate key

  return sites
}

const countAllSites = data => {
  let tempSites = []
  for (const [key, value] of Object.entries(data)) {
    tempSites.push(value)
  }
  let total = tempSites.reduce((accumulator, item) => {
    return accumulator + item.overalEnrollment
  }, 0)

  return total
}

const sortObject = obj => {
  return Object.keys(obj)
    .sort().reduce((a, v) => {
    a[v] = obj[v];
    return a; }, {});
}

const getTop5Countries = rawData => {
  let tmpCountries = []
  for (const [key, value] of Object.entries(rawData)) {
    tmpCountries.push({
      [key] : countAllSites(value)
    })
  }

  console.log(sortObject(tmpCountries))

  return tmpCountries
}

const getTop5Sites = rawData => {
  let tmpSites = []
  return tmpSites
}

export default {
  components: {
    "main-card": MainCardCenter,
    CheckboxPicker,
    RadioButtonPicker,
    LineChart
  },
  data() {
    return {
      studyId: null,
      countryList: [],
      allSitesList: [],
      sitesSelected: ["all"],
      countrySelected: "all",
      chartData: {
        type: 'line',
        data: {
          labels: ['27/06', '28/06', '29/06', '30/06', '01/07', '02/07', '03/07', '04/07'],
          datasets: [
            { // one line graph
              label: 'Actual',
              data: [40, 43, 46, 52, 51, 72, 87, 104],
              backgroundColor: 'rgba(54,73,93,0)',
              borderColor: '#00C3B3',
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                padding: 25,
              }
            }]
          }
        }
      }
    };
  },
  methods: {
    async getVisualizationData() {
      const response = await this.$api.getEnrollmentParticipantData(this.studyId);
      return response;
    },

    // Get data from radio
    getDataFromRadioButton(payload) {
      this.filterData("country", payload)
    },

    getDataFromCheckbox(payload) {
      this.filterData("sites", payload.isCheckAll ? ["all"] : payload.checkedDatas);
    },

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

    createChart(chartId) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: this.chartData.type,
        data: this.chartData.data,
        options: this.chartData.options,
      });
    }

  },
  async mounted() {
    this.studyId = this.$route.params.studyId;
    this.rawData = await this.getVisualizationData();
    this.countryList = await getCountryList(this.rawData);
    this.allSitesList = await getAllSites(this.rawData);
    this.top5Countries = getTop5Countries(this.rawData)
    this.top5Sites = getTop5Sites(this.rawData)
    this.createChart('participant-chart');
    console.log(this.rawData);
  }
}
</script>
