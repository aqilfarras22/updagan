<template>
  <div class="container">
    <div class>
      <div class="mt-100 bg-white mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="pl-20 pr-20">
          <p class="pt-25 m-0 fs-14">
            Lets turn those everyday fitness trackers into valuable data. From Jawbone™ to Withings™, we’ve got you covered.
            Below is a list of supported wearable of which you can choose from.
          </p>
          <!--<h3 class="pt-10">How does this work?</h3>
          <p class="fs-14">Validic, a third-party integration service, offers validated integrations for numerous FDA-listed medical devices,
            consumer wearable devices, and health apps. For you, it’s a simple flip of a switch. For your participants, a
            <span class="color_blue"><u>simple four-step experience</u>.</span>
          </p>-->
          <h3 class="pt-25 m-0 pb-10">Select wearables for your study</h3>
          <div class="row pb-10">
            <div class="col-lg-5 col-md-5 col-sm-4 col-xs-12 p-0 pr-10">
              <input
                type="text"
                class="form-control mb-10 br-25 pl-30 search-bg-color"
                placeholder="Search..."
                disabled
              />
              <span class="search-icon">
                <i class="fa fa-search"></i>
              </span>
            </div>
            <div
              class="col-xs-12 col-sm-4 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3 p-0 mb-10 pr-10"
            >
              <select class="form-control br-25 color_959fa4" disabled>
                <option>Sort</option>
                <option>Most recent</option>
                <option>Id ascending</option>
                <option>Id descending</option>
              </select>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-0 pr-10">
              <select class="form-control br-25 color_959fa4" disabled>
                <option>Filters</option>
                <option>Acitve</option>
                <option>Deactivated</option>
                <option>Partcipating</option>
                <option>In other studies</option>
              </select>
            </div>
          </div>
          <div class="row pb-10">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
              <div class="panel panel-default">
                <div class>
                  <div class="row color_blue p-10 table-bb">
                    <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0">
                      <input type="checkbox" class="custom-check" />
                    </div>
                    <div class="col-sm-3 col-md-3 col-lg-3 col-xs-3 p-0">
                      <span class>
                        Device name
                        <i class="fa fa-sort-desc" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">
                      Device type
                      <i class="fa fa-sort-desc" aria-hidden="true"></i>
                    </div>
                    <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">
                      Brand
                      <i class="fa fa-sort-desc" aria-hidden="true"></i>
                    </div>
                    <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">&nbsp;</div>
                    <div class="col-sm-2 col-md-2 col-lg-2 col-xs-12 p-0">&nbsp;</div>
                  </div>
                  <div v-for="item in listItems" class="p-10 table-bb">
                    <div class="row">
                      <div class="col-sm-1 col-md-1 col-lg-1 col-xs-1 p-0">
                        <input type="checkbox" class="custom-check" />
                      </div>
                      <div class="col-sm-3 col-md-3 col-lg-3 col-xs-3 p-0">
                        <span class>{{item.DeviceName}}</span>
                      </div>
                      <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">{{item.DeviceType}}</div>
                      <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0">{{item.DeviceBrand}}</div>
                      <div
                        class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0 color-show cursor_pointer"
                        v-if="selectedItem.id !== item.id"
                        v-on:click="showDeviceDetails(item)"
                      >Show details</div>
                      <div
                        class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0 color-show cursor_pointer"
                        v-if="selectedItem.id === item.id"
                        v-on:click="showDeviceDetails(item)"
                      >Hide details</div>
                      <div
                        class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0"
                        v-if="selectedItem.id !== item.id"
                      >
                        <img :src="item.DeviceUrl" alt class="grid-img" />
                      </div>
                    </div>
                    <div class="row pt-25" v-if="selectedItem.id === item.id">
                      <div
                        class="col-lg-6 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-md-6 col-sm-6 col-xs-12 p-0"
                      >
                        <p class="font_bold">Data collected</p>
                        <div class="mt-10 row">
                          <div class="p-0 col-lg-6 col-md-6 col-sm-6 col-xs-6 display-inline-block">
                            <div class="row table-header">
                              <span
                                class="col-md-3 col-sm-3 col-lg-3 col-xs-3 bg-bio color_ff"
                              >Routine</span>
                              <span
                                class="col-md-3 col-sm-3 col-lg-3 col-xs-3 bg-bio color_ff"
                              >Fitness</span>
                              <span class="col-md-3 col-sm-3 col-lg-3 col-xs-3">Nutrition</span>
                              <span class="col-md-3 col-sm-3 col-lg-3 col-xs-3">Weight</span>
                            </div>
                            <div class="row table-body">
                              <span class="col-md-3 col-sm-3 col-lg-3 col-xs-3">
                                <i class="fa fa-check color_green" aria-hidden="true"></i>
                              </span>
                              <span class="col-md-3 col-sm-3 col-lg-3 col-xs-3">
                                <i class="fa fa-check color_green" aria-hidden="true"></i>
                              </span>
                              <span class="col-md-3 col-sm-3 col-lg-3 col-xs-3">&nbsp;</span>
                              <span class="col-md-3 col-sm-3 col-lg-3 col-xs-3">&nbsp;</span>
                            </div>
                          </div>
                          <div class="p-0 col-lg-6 col-md-6 col-sm-6 col-xs-6 display-inline-block">
                            <div class="row table-header">
                              <span class="col-md-4 col-sm-4 col-lg-4 col-xs-4">Sleep</span>
                              <span class="col-md-4 col-sm-4 col-lg-4 col-xs-4">Diabetes</span>
                              <span class="col-md-4 col-sm-4 col-lg-4 col-xs-4">Biometrics</span>
                            </div>
                            <div class="row table-body">
                              <span class="col-md-4 col-sm-4 col-lg-4 col-xs-4">&nbsp;</span>
                              <span class="col-md-4 col-sm-4 col-lg-4 col-xs-4">&nbsp;</span>
                              <span class="text-center col-md-4 col-sm-4 col-lg-4 col-xs-4">&nbsp;</span>
                            </div>
                          </div>
                        </div>
                        <p class="color_blue pt-10 cursor_pointer">
                          <u>View product’s website</u>
                        </p>
                      </div>
                      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4">
                        <p class>&nbsp;</p>
                        <div class="table-header row">
                          <div class>
                            <span
                              class="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-header"
                            >FDA Status</span>
                          </div>
                        </div>
                        <div class="bg-card col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <span class>&nbsp;</span>
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                        <img :src="selectedItem.DeviceUrl" alt class="tab-img" />
                      </div>
                    </div>
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
          <div class="row">
            <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
            <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "wearables",
  data() {
    return {
      studyId: null,
      selectedItem: {
        id: null,
        DeviceName: null,
        DeviceType: null,
        DeviceBrand: null,
        DeviceUrl: null
      }, // eslint-disable-line
      listItems: [
        {
          id: 1,
          DeviceName: "Fitbit Aria Scale",
          DeviceType: "Activity tracker",
          DeviceBrand: "Fitbit",
          DeviceUrl: "/static/img/wearables/fitbit2.jpg"
        },
        {
          id: 2,
          DeviceName: "Fitbit Flex",
          DeviceType: "Activity tracker",
          DeviceBrand: "Fitbit",
          DeviceUrl: "/static/img/wearables/fitbit3.png"
        },
        {
          id: 3,
          DeviceName: "Fitbit Charge",
          DeviceType: "Activity tracker",
          DeviceBrand: "Fitbit",
          DeviceUrl: "/static/img/wearables/fitbit4.jpg"
        },
        {
          id: 4,
          DeviceName: "Fitbit One",
          DeviceType: "Activity tracker",
          DeviceBrand: "Fitbit",
          DeviceUrl: "/static/img/wearables/fitbit6.jpg"
        },
        {
          id: 5,
          DeviceName: "Fitbit Force",
          DeviceType: "Activity tracker",
          DeviceBrand: "Fitbit",
          DeviceUrl: "/static/img/wearables/fitbit5.jpg"
        },
        {
          id: 6,
          DeviceName: "adidas Heart Rate Monitor",
          DeviceType: "Heart rate monitor",
          DeviceBrand: "adidas",
          DeviceUrl: "/static/img/wearables/heart1.jpg"
        },
        {
          id: 7,
          DeviceName: "adidas Smart Run Watch",
          DeviceType: "Activity tracker",
          DeviceBrand: "adidas",
          DeviceUrl: "/static/img/wearables/adi2.jpg"
        },
        {
          id: 8,
          DeviceName: "adidas Speed Cell",
          DeviceType: "Activity tracker",
          DeviceBrand: "adidas",
          DeviceUrl: "/static/img/wearables/speedcell.jpg"
        },
        {
          id: 9,
          DeviceName: "adidas X-Cell",
          DeviceType: "Heart rate monitor",
          DeviceBrand: "adidas",
          DeviceUrl: "/static/img/wearables/xcell.png"
        },
        {
          id: 10,
          DeviceName: "adidas FitSmart",
          DeviceType: "Activity tracker",
          DeviceBrand: "adidas",
          DeviceUrl: "/static/img/wearables/adidastracker.jpg"
        },
        {
          id: 11,
          DeviceName: "AsthmaMD",
          DeviceType: "Heart rate monitor",
          DeviceBrand: "AsthmaMD",
          DeviceUrl: "/static/img/wearables/asthmamd.png"
        }
      ]
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 350;
    }, 1500);
    this.studyId = this.$route.params.studyId;
  },
  computed: {},
  methods: {
    goBack() {
      window.history.back();
    },
    showDeviceDetails(item) {
      if (this.selectedItem.id === item.id) {
        this.selectedItem = {};
      } else {
        this.selectedItem = item;
      }
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
    }
  },
  components: { studyFeatureHeader }
};
</script>

<style scoped lang="scss">
.search-icon {
  position: absolute;
  left: 10px;
  top: 7px;
}

.search-bg-color {
  background-color: #f5f8fa;
}
.table-header {
  border-right: none !important;
  border-left: none !important;
  background-color: #e3e9ed;
  font-size: 12px;
}
.table-header span {
  padding: 5px 10px 5px 10px;
  background-color: #e3e9ed;
  color: #959fa4;
}
.table-body {
  background-color: #f5f8fa;
}
.table-body span {
  padding: 5px 10px 5px 10px;
  background-color: #f5f8fa;
}
.bg-card {
  background-color: #f5f8fa;
  padding: 5px 10px 5px 10px;
}

.custom-check {
  width: 20px;
  height: 20px;
  margin-top: 8px;
}
.bg-bio {
  background-color: #1f95f2 !important;
}
.grid-img {
  height: 40px;
  width: 50px;
}
.tab-img {
  height: 150px;
  width: 130px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.table-bb {
  border-bottom: 1px solid #d3dfe4;
  line-height: 38px;
}
.color-show {
  color: #00bae0;
}
</style>
