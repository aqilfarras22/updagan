<template>
  <div class="container">
    <div class>
      <div class="mt-100 bg-white mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="pl-20 pr-20">
          <p class="pt-25 m-0 fs-14 pb-15">
            Medical device integrations allow you to continuously obtain data from your participants' various medical devices.
            Below is our list of supported devices of which you can choose from. This is a simple four-step experience for your participants to connect their device(s).
          </p>
          <!-- <h3 class="pt-25 m-0 pb-10 color-gray fs-30">Select Sensors</h3> -->
          <div class="row pb-10">
            <div class="col-lg-5 col-md-5 col-sm-4 col-xs-12 p-0 pr-10">
              <input
                type="text"
                class="form-control mb-10 br-3 pl-30"
                v-model="searchTerm"
                @keyup.enter="searchValidicDevices()"
                placeholder="Search device name, brand name"
              />
              <span class="search-icon">
                <i class="fa fa-search"></i>
              </span>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-0 pr-10" style="float:right;">
              <select
                class="form-control br-3 color_959fa4 select"
                v-model="selectedShowOption"
                v-on:change="searchValidicDevices()"
              >
                <option
                  v-for="(item,index) in listOptions"
                  :key="index"
                  :value="item.value"
                >{{item.text}}</option>
              </select>
            </div>
            <div
              class="col-xs-12 col-sm-4 col-md-2 col-md-offset-3 col-lg-2 p-0 mb-10 pr-10"
              style="float:right;"
            >
              <div
                class="form-control br-3 color_959fa4 cursor_pointer"
                v-on:click="openFiltersDiv()"
              >
                Filters
                <!-- <i class="fa fa-angle-down filter-icon pull-right" aria-hidden="true"></i> -->
                <img class="pull-right mt-2" src="/static/img/caret.svg" />
              </div>
              <div class="filters-div" v-if="filtersOn">
                <div class="filter-option" v-for="(item,index) in filterOptions" :key="index">
                  <label class="switch">
                    <input
                      type="checkbox"
                      class="custom-check"
                      v-model="item.selected"
                      v-bind:checked="item.selected!==false"
                      v-on:change="filterDevices()"
                    />
                    <span class="slider"></span>
                  </label>
                  <span class="pr-10 pl-10">{{item.name}}</span>
                </div>
                <div class="clear-filters" v-on:click="clearFilters()">Clear filters</div>
              </div>
            </div>
          </div>
          <div class="row pb-10">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
              <div class="panel panel-default">
                <div class>
                  <div class="row row-header p-10 table-bb">
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0">Select</div>
                    <div
                      class="col-sm-1 col-md-1 col-lg-2 col-xs-1 p-0"
                      v-on:click="sortList('deviceName')"
                    >
                      Device name
                      <span class="sortUp">
                        <i
                          class="fa fa-angle-up"
                          aria-hidden="true"
                          :class="[(sortValue === 'deviceName' && sort === 'asc') ? 'link-color':'']"
                        ></i>
                      </span>
                      <span class="sortDown">
                        <i
                          class="fa fa-angle-down"
                          aria-hidden="true"
                          :class="[(sortValue === 'deviceName' && sort === 'desc') ? 'link-color':'']"
                        ></i>
                      </span>
                    </div>
                    <div
                      class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0"
                      v-on:click="sortList('appName')"
                    >
                      Brand
                      <span class="sortUp">
                        <i
                          class="fa fa-angle-up"
                          aria-hidden="true"
                          :class="[(sortValue === 'appName' && sort === 'asc') ? 'link-color':'']"
                        ></i>
                      </span>
                      <span class="sortDown">
                        <i
                          class="fa fa-angle-down"
                          aria-hidden="true"
                          :class="[(sortValue === 'appName' && sort === 'desc') ? 'link-color':'']"
                        ></i>
                      </span>
                    </div>
                    <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">Device types</div>
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">Summaries</div>
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">Workouts</div>
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">Measurements</div>
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">Sleep</div>
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">Nutrition</div>
                    <div class="col-sm-2 col-md-2 col-lg-1 col-xs-2 p-0">FDA status</div>
                  </div>
                  <div
                    v-for="(item,index) in listItems"
                    class="p-10 table-bb"
                    :class="{'bg-gray':item.selected && showEnable}"
                  >
                    <div class="row">
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0">
                        <label class="switch">
                          <input
                            type="checkbox"
                            v-on:change="addItems(item,index)"
                            v-model="item.selected"
                            v-bind:checked="item.selected!==false"
                            class="custom-check"
                          />
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="col-sm-1 col-md-1 col-lg-2 col-xs-1 p-0">
                        <span class>{{item.deviceDisplayName}}</span>
                      </div>
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0">{{item.appDisplayName}}</div>
                      <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">{{item.deviceTypes}}</div>
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">
                        <i
                          v-if="item.supportedDataObjects.indexOf('Summary') >= 0"
                          class="fa fa-check"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">
                        <i
                          v-if="item.supportedDataObjects.indexOf('Workout') >= 0"
                          class="fa fa-check"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">
                        <i
                          v-if="item.supportedDataObjects.indexOf('Measurement') >= 0"
                          class="fa fa-check"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">
                        <i
                          v-if="item.supportedDataObjects.indexOf('Sleep') >= 0"
                          class="fa fa-check"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0 div-content">
                        <i
                          v-if="item.supportedDataObjects.indexOf('Nutrition') >= 0"
                          class="fa fa-check"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="col-sm-2 col-md-2 col-lg-1 col-xs-2 p-0">{{item.fdaStatus}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pb-20 bottom-0" v-if="listItems && listItems.length">
                <div class="row display-inline-flex">
                  <div
                    @click="prevPage"
                    class="arrow-icon cursor_pointer number-color"
                    :class="{ 'disabledPagination': currentPage <= 1}"
                  >
                    <i class="fa fa-angle-left fs-23 pt-3"></i>
                  </div>
                  <div class="pagination pt-3">{{currentPage}}</div>
                  <div class="pagination2 pt-3">of {{totalPages}}</div>
                  <div
                    @click="nextPage"
                    class="arrow-icon pt-3 cursor_pointer number-color"
                    :class="{ 'disabledPagination': currentPage >= totalPages}"
                  >
                    <i class="fa fa-angle-right fs-23"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pb-10">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="row" v-if="isStudySummary">
            <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
            <b-btn
              class="btn br-25 disable-btn p-0 pt-5 mr-10"
              :to="{ name: 'study-summary', params: { studyId: studyId } }"
            >Back to study summary</b-btn>
            <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
          </div>
          <div class="row" v-if="!isStudySummary">
            <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
            <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
          </div>
        </div>
      </div>
      <CancelModal ref="cancelConfirmation" />
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import _ from "lodash";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "medical-devices",
  data() {
    return {
      showEnable: false,
      studyId: null,
      checkAll: null,
      selectedItem: {
        id: null,
        deviceName: null,
        deviceType: null,
        appName: null,
        imageUrl: null,
        fdaStatus: null,
        websiteUrl: null,
        supportedDataObjects: null,
        selected: false
      }, // eslint-disable-line
      listItems: [],
      addDevices: [],
      searchTerm: null,
      filter: "",
      sort: "",
      sortValue: "",
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      ),
      validicDeviceTypes: [],
      currentPage: 1,
      totalPages: 1,
      selectedShowOption: 15,
      listOptions: [
        {
          value: 15,
          text: "Show 15 items"
        },
        {
          value: 50,
          text: "Show 50 items"
        },
        {
          value: 100,
          text: "Show 100 items"
        }
      ],
      filterOptions: [
        {
          value: "summary",
          name: "Summaries",
          selected: false
        },
        {
          value: "workout",
          name: "Workouts",
          selected: false
        },
        {
          value: "measurement",
          name: "Measurements",
          selected: false
        },
        {
          value: "sleep",
          name: "Sleep",
          selected: false
        },
        {
          value: "nutrition",
          name: "Nutrition",
          selected: false
        },
        {
          value: "fdaStatus",
          name: "510k cleared",
          selected: false
        }
      ],
      filtersOn: false,
      getCallDone: false
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 400;
    }, 3000);
    this.studyId = this.$route.params.studyId;
    this.getAllValidicDevices();
  },
  computed: {},
  methods: {
    addItems(item) {
      let deviceObject = {};
      deviceObject.deviceName = item.deviceName;
      deviceObject.selected = item.selected;
      this.$api.postValidicFact(this.studyId, deviceObject).then(
        () => {
          this.getAllValidicDevices();
          toastr.success("Device updated successfully.");
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while updating device."
          );
        }
      );
    },
    getAllValidicDevices() {
      this.$api
        .getAllValidicFact(
          this.studyId,
          this.searchTerm,
          this.sort,
          this.sortValue,
          this.filter,
          this.selectedShowOption,
          this.currentPage
        )
        .then(
          response => {
            if (response.body) {
              this.listItems = response.body.devices;
              this.totalPages = response.body.totalPages;
              this.currentPage = response.body.currentPage;
              _.forEach(this.listItems, item => {
                item.deviceTypes = item.deviceTypes.toString(); // eslint-disable-line
              });
              // this.addDevices = _.filter(this.listItems, o => o.selected);
            }
            this.getCallDone = true;
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting devices."
            );
          }
        );
      this.getCallDone = false;
    },
    // change the previous page number and update the  list
    prevPage() {
      if (this.currentPage <= this.totalPages) {
        if (this.getCallDone) {
          this.currentPage -= 1;
          this.getAllValidicDevices();
        }
      }
    },
    // change the next page number and update the list
    nextPage() {
      if (this.currentPage < this.totalPages) {
        if (this.getCallDone) {
          this.currentPage += 1;
          this.getAllValidicDevices();
        }
      }
    },

    searchValidicDevices() {
      this.currentPage = 1;
      this.getAllValidicDevices();
    },

    filterDevices() {
      let selectedFilters = [];
      _.forEach(this.filterOptions, option => {
        if (option.selected) {
          selectedFilters.push(option.value);
        }
      });
      this.filter = selectedFilters.toString();
      this.currentPage = 1;
      this.getAllValidicDevices();
    },

    openFiltersDiv() {
      this.filtersOn = !this.filtersOn;
    },

    sortList(value) {
      this.sortValue = value;
      if (this.sort === "") {
        this.sort = "asc";
      } else if (this.sort === "asc") {
        this.sort = "desc";
      } else {
        this.sort = "asc";
      }
      this.currentPage = 1;
      this.getAllValidicDevices();
    },

    clearFilters() {
      _.forEach(this.filterOptions, option => {
        option.selected = false; // eslint-disable-line
      });
      this.filter = "";
      this.currentPage = 1;
      this.getAllValidicDevices();
      this.filtersOn = false;
    },

    goBack() {
      window.history.back();
    },

    nextClick() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, [
        "route",
        this.$route.name
      ]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, [
        "route",
        this.$route.name
      ]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    }
  },
  components: { studyFeatureHeader, CancelModal }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
  margin-top: 20px;
}

.h4,
h4 {
  font-size: 18px;
  margin: 10px 0;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
}

.form-control {
  height: 34px !important;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2 {
    flex: none;
  }
}

@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
  }
  .col-lg-offset-3 {
    margin-left: 25%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
  .col-lg-offset-1 {
    margin-left: 8.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.tbr-1 {
  border-right: 1px solid #d3dfe4;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 7px;
  color: #e4e8eb;
}

.search-bg-color {
  background-color: #f5f8fa;
}
.color-gray {
  color: #666669 !important;
}
.table-header {
  border-right: none !important;
  border-left: none !important;
  font-size: 12px;
}
.table-header span {
  padding: 5px;
  background-color: #e3e9ed;
}
.bg-gray {
  background-color: #f5f8fa;
}
.br-left5 {
  border-radius: 0px 0px 0px 5px;
}
.br-top5 {
  border-radius: 5px 0px 0px 0px;
}
.br-right5 {
  border-radius: 0px 5px 0px 0px;
}
.br-bot5 {
  border-radius: 0px 0px 5px 0px;
}
.br-topbot5 {
  border-radius: 0px 0px 5px 5px;
}
.br-leftright5 {
  border-radius: 5px 5px 0px 0px;
}
.table-body span {
  padding: 5px;
  background-color: #f5f8fa;
}
.bg-card {
  background-color: #f5f8fa;
  padding: 5px 10px 5px 10px;
}

.custom-check {
  width: 40px;
  height: 25px;
  margin-top: 8px;
  margin-left: 10px;
}
.bg-bio {
  background-color: #1f95f2 !important;
  color: #fff !important;
}
.grid-img {
  height: 100%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  max-width: 50px;
}
.dropdown_icon {
  position: relative;
  bottom: 2px;
  left: 4px;
}
.tab-img {
  height: 100%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  max-width: 100px;
}
.table-bb {
  border-bottom: 1px solid #d3dfe4;
  // line-height: 38px;
}

.table-bb div {
  // word-break: break-all;
  padding-right: 10px !important;
}

.color-show {
  color: #00bae0;
}
.switch {
  position: relative;
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
}
/* Hide default HTML checkbox */
.switch input {
  display: none;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  margin-top: 7px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 24px;
  width: 24px;
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px #d3dfe4;
}
input:checked + .slider:before {
  position: absolute;
  font-family: FontAwesome;
  content: "\f00c";
  // top: -8px;
  left: 3px;
  right: 0px;
  bottom: 0;
  color: #fff;
  font-size: 16px;
}
input:checked + .slider {
  background-color: #2ecc71;
  width: 24px;
  height: 24px;
}
.row-header {
  font-size: 12px;
  color: #b0bac9;
}
.div-content {
  text-align: center;
}
.filters-div {
  border: 1px solid #e4e8eb;
  position: absolute;
  z-index: 100;
  background-color: #ffffff;
  margin-top: 5px;
  width: 168%;
  padding: 10px;
}
.arrow-icon {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 23px;
  line-height: 10px !important;
  color: #e4e8eb;
}
.pagination {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 11px !important;
}

.pagination2 {
  width: 40px;
  height: 32px;
  background-color: #ffffff;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 6px !important;
}
.disabledPagination {
  pointer-events: none;
  color: #e4e8eb !important;
}

.display-inline-flex {
  display: inline-flex !important;
}

.position-absolute {
  position: absolute;
}

.position-relative {
  position: relative;
}

.bottom-0 {
  bottom: 0px;
}

.cursor_pointer {
  cursor: pointer;
}

.sortDown {
  position: absolute;
  padding-left: 4px;
  padding-top: 3px;
}

.sortUp {
  position: absolute;
  margin-top: -3px;
  padding-left: 4px;
}

.link-color {
  color: #1d7fee !important;
}

.filter-icon {
  font-size: 23px;
  color: #1d7fee;
}

.number-color {
  color: #1d7fee;
}

.select {
  background-image: url(/static/img/caret.svg) !important;
  background-position: 95% !important;
}

.clear-filters {
  text-decoration: underline;
  padding-top: 15px;
  font-size: 13px;
  cursor: pointer;
  float: left;
}

.filter-option {
  width: 49%;
  float: left;
}
</style>

