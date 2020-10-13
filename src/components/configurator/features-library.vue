<template>
  <div class="container">
    <div class="row has-header has-footer" style="display:block; padding-top">
      <div class="text-center">
        <p class="fs-16 color_grey pt-10">Select elements for your mobile study app.</p>
        <h3 class="mt-20 fw-bold">Element Library</h3>
        <div v-for="feature in features">
          <p class="pt-10 fs-14 color_grey" v-if="feature.index == 1">Essentials</p>
          <div v-if="feature.index <= 8">
            <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
              <div class="panel panel-default bg-color no-border">
                <div class="panel-body product-card b-shadow">
                  <!--<span class="active_feature_icon" v-html="feature.icon"></span>-->
                  <img :src="feature.icon" alt class="active_feature_icon" />
                </div>
                <h6>{{feature.name}}</h6>
              </div>
            </div>
          </div>
          <p class="pb-10 fs-14 color_grey clearfix" v-if="feature.index == 8">Optional</p>
          <div v-if="feature.index > 8">
            <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
              <div
                class="panel panel-default bg-color no-border"
                v-on:click="selectFeatures(feature)"
                :disabled="!enableActivityOrder"
              >
                <div v-if="!feature.comingSoon">
                  <div v-if="!feature.active">
                    <div class="panel-body product-card b-shadow">
                      <!--<span class="icon-style" v-html="feature.icon"></span>-->
                      <img :src="feature.icon1" alt class="active_feature_icon" />
                    </div>
                    <h6 class="color_959fa4">{{feature.name}}</h6>
                  </div>
                  <div v-else>
                    <div class="added-text animated fadeInOut">Added</div>
                    <div class="panel-body product-card b-shadow">
                      <!--<span class="active_feature_icon" v-html="feature.icon"></span>-->
                      <img :src="feature.icon" alt class="active_feature_icon" />
                    </div>
                    <h6>{{feature.name}}</h6>
                  </div>
                </div>
                <div v-else>
                  <div class="panel-body product-card b-shadow">
                    <!--<span class="icon-style" v-html="feature.icon"></span>-->
                    <img :src="feature.icon1" alt class="active_feature_icon" />
                    <button type="button" class="btn btn-coming-soon">Coming Soon</button>
                  </div>
                  <h6 class="color_grey">{{feature.name}}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="pr-0 text-center-xs text-center-sm">
            <button
              type="button"
              :disabled="continueBtn"
              class="btn nextBtn br-25"
              v-on:click="nextCustom()"
            >Save and Continue</button>
          </div>
          <!--<img class="img-style" src="static/img/i-c-n-box.png">-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import _ from "lodash";
import services from "../services";

export default {
  name: "features-library",
  data() {
    return {
      studyData: null,
      byInvitation: null,
      studyId: null,
      continueBtn: true, // to disable continueBtn until features api is successful
      enableActivityOrder: true,
      features: [
        {
          active: true,
          comingSoon: false,
          name: "Branding",
          shortName: "Branding",
          key: "branding",
          index: 1,
          route: "branding",
          icon: "static/img/features/branding.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "Registration",
          shortName: "Registration",
          key: "registration",
          index: 2,
          route: "registration",
          icon: "static/img/features/registration.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "Onboarding",
          shortName: "Onboarding",
          key: "onboarding",
          index: 3,
          route: "onboarding",
          icon: "static/img/features/onboarding.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "Eligibility",
          shortName: "Eligibility",
          key: "eligibility",
          index: 4,
          route: "eligibility",
          icon: "static/img/features/eligibility.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "eConsent",
          shortName: "eConsent",
          key: "eConsent",
          index: 5,
          route: "econsent",
          icon: "static/img/features/econsent.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "eConsents",
          shortName: "eConsents",
          key: "multiConsent",
          index: 6,
          route: "multieconsent",
          icon: "static/img/features/econsent.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "Dashboard",
          shortName: "Dashboard",
          key: "dashboards",
          index: 7,
          route: "dashboards",
          icon: "static/img/features/patient_dashboards.svg",
          icon1: "static/img/features/patient_dashboards_1.svg"
        },
        {
          active: true,
          comingSoon: false,
          name: "Learn",
          shortName: "Learn",
          key: "engagementContent",
          index: 8,
          route: "engagement-content",
          icon: "static/img/features/engagement_content.svg",
          icon1: "static/img/features/engagement_content_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Surveys",
          shortName: "Surveys",
          key: "surveys",
          index: 9,
          route: "surveys",
          icon: "static/img/features/patient_surveys.svg",
          icon1: "static/img/features/patient_surveys_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Electronic Patient Reported Outcomes (ePROs)",
          shortName: "ePROs",
          key: "ePros",
          index: 10,
          route: "epros",
          icon: "static/img/features/epros.svg",
          icon1: "static/img/features/epros_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Electronic Device Reported Outcomes (eDROs)",
          shortName: "eDROs",
          key: "eDros",
          index: 11,
          route: "edros",
          icon: "static/img/features/edros.svg",
          icon1: "static/img/features/edros_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Mobile Health Data Access",
          shortName: "Mobile Health Data Access",
          key: "mobileHealthDataAccess",
          index: 12,
          route: "health-data-access",
          icon: "static/img/features/engagement_content.svg",
          icon1: "static/img/features/engagement_content_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Sensors",
          shortName: "Sensors",
          key: "medicalDevicesAndWearables",
          index: 13,
          route: "medical-devices",
          icon: "static/img/features/med-device-wearable.svg",
          icon1: "static/img/features/med-device-wearable_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Custom Notifications",
          shortName: "Custom Notifications",
          key: "notifications",
          index: 14,
          route: "notifications",
          icon: "static/img/features/notifications.svg",
          icon1: "static/img/features/notifications_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Telehealth",
          shortName: "Telehealth",
          key: "teleHealth2",
          index: 15,
          route: "tele-health-v2",
          icon: "static/img/features/tele_health.svg",
          icon1: "static/img/features/tele_health_1.svg"
        },
        {
          active: false,
          comingSoon: false,
          name: "Activity Order",
          shortName: "Activity Order",
          key: "activityOrder",
          index: 16,
          route: "activity-order",
          icon: "static/img/features/task-order-active.svg",
          icon1: "static/img/features/task-order.svg"
        }
      ],
      studyLibraryFeatures: []
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.getToggleFeatures();
    this.getStudyDetails();
    this.checkForActivityFeatureStatus();
  },
  methods: {
    checkForActivityFeatureStatus() {
      if(!(this.features[7].active || this.features[8].active || this.features[9].active || this.features[13].active)) {
        this.features[14].active = false;
      }
    },
    getToggleFeatures() {
      const that = this;
      that.$api.getToggleFeaturesFact(that.studyId).then(
        response => {
          that.toggleFeatures = response.body.studyFeatures;

          // For Telehealth 2.0 Feature
          const isTelehealth = that.toggleFeatures.filter(
            x => x.featureKey == "TELEHEALTH" && x.enabled == true
          ); // eslint-disable-linedisable-line
          if (
            (isTelehealth == null ||
              isTelehealth == undefined ||
              isTelehealth == "") &&
            isTelehealth.length == 0
          ) {
            // eslint-disable-line
            try {
              that.features.splice(14, 1);
            } catch {}
          }

          // For Multiple Conset feature
          const isEconsent = that.toggleFeatures.filter(
            x => x.featureKey == "ECONSENT"
          ); // eslint-disable-line
          if (
            (isEconsent == null ||
              isEconsent == undefined ||
              isEconsent == "") &&
            isEconsent.length == 0
          ) {
            // eslint-disable-line
            that.features.splice(4, 1);
          } else {
            that.features.splice(5, 1);
          }

          that.getFeatures();
        },
        error => {
          that.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
          that.getFeatures();
        }
      );
    },
    getStudyDetails() {
      var self = this;
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
          this.byInvitation =
            this.studyData.onboardingType.toLowerCase() === "byinvitation";
          if (this.byInvitation) {
            this.features.splice(3, 1);
          }
                  
          //Remove EDROS when the study is multilingual
          if(self.studyData.language && self.studyData.language.length>1){
            self.features = _.filter(self.features, function(o) { return o.key!="eDros"; });  
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    getFeatures() {
      this.$api.getLibraryFeaturesFact(this.studyId).then(response => {
        if (response.body) {
          const selectedFeatures = response.body.studyLibraryFeatures;
          const selectedFeaturesIndices = _.map(selectedFeatures, "index");
          this.getLibraryFeatures = response.body.studyLibraryFeatures ? (response.body.studyLibraryFeatures) : ([]);
          this.continueBtn = false;
          this.features = this.features.map(feature => {
            if (feature.index > 8) {
              const newFeature = {
                ...feature,
                active: selectedFeaturesIndices.indexOf(feature.index) >= 0
              };
              return newFeature;
            }
            return feature;
          });
        }
      });
    },
    nextCustom() {
      const selectedFeatures = _.filter(
        this.features,
        o => o.active && !o.comingSoon
      );
      this.studyLibraryFeatures = _.map(selectedFeatures, elm =>
        _.pick(elm, "index", "name", "icon", "route", "shortName", "key")
      ); // eslint-disable-line
      this.studyLibraryFeatures = _.sortBy(this.studyLibraryFeatures, "index");
      const payload = { studyLibraryFeatures: this.studyLibraryFeatures };
      this.$api.postLibraryFeaturesFact(this.studyId, payload).then(
        response => {
          services.saveSelectedFeatures(response.body.studyLibraryFeatures);
          this.$router.push({
            name: "branding",
            params: { studyId: this.studyId }
          });
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while sending the selected features to server"
          );
        }
      );
    },
    selectFeatures(feature) {
      this.enableActivityOrder = true;
      if (feature.name === "Activity Order" && feature.active === false) {
        _.forEach(this.features, value => {
          if (
            (value.shortName === "Surveys" ||
              value.shortName === "ePROs" ||
              value.shortName === "eDROs" ||
              value.shortName === "Telehealth") &&
            value.active === true
          ) {
            this.enableActivityOrder = false;
          }
        });
        if (this.enableActivityOrder) {
          toastr.error(
            "Activity Order module can be enabled only if there are activities in the study."
          );
        } else {
          const index = this.features.indexOf(feature);
          const { active } = this.features[index];
          if (index >= 0) {
            this.features[index].active = !active;
          }
        }
      } else {
        const index = this.features.indexOf(feature);
        const { active } = this.features[index];
        if (index >= 0) {
          this.features[index].active = !active;
        }
      }
      this.checkForActivityFeatureStatus();
    }
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
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

.row:after {
  content: "";
  clear: both;
  display: block;
}

.color_959fa4 {
  color: #959fa4 !important;
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
    //flex: none;
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
  .navbar-toggler {
    display: none;
  }
  .navbar-right {
    float: right !important;

    .navbar-nav {
      flex-direction: row;
    }

    li {
      float: left;
    }
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
  .col-md-12 {
    width: 100%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-2 {
    width: 16.66666667%;
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
    //flex: none;
    display: block;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.bg-color {
  background-color: #f5f8fa;
  background-size: cover;
  //height: 100%;
  /*min-height: 100vh;*/
}

.btn {
  border-radius: 25px;
}

.panel {
  height: 150px;
}

.product-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 10px;
  border: solid 1px #d3dfe4;
  width: 80px;
  height: 80px;
  margin: auto;
}

.icon-style {
  font-size: 35px;
  color: #959fa4;
}

.b-shadow {
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
}

.active_feature_icon {
  max-width: 30px;
  max-height: 30px;
  display: inline-block;
  height: 100%;
  width: auto;
  vertical-align: middle;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.no-border {
  border: none;
  box-shadow: none;
  text-align: center;
}

.btn-coming-soon {
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: 10px;
  padding: 2px 7px !important;
  background-color: #7478e6;
  color: #ffffff;
  cursor: default;
}

.btn:hover,
.btn:focus,
.btn.focus {
  color: #fff;
  text-decoration: none;
}

.img-style {
  position: relative;
  height: 95px;
  top: -40px;
}

.added-text {
  position: absolute;
  left: 82px;
  top: -20px;
  color: #2ecc71;
  font-size: 12px;
}

.animated {
  -webkit-animation-duration: 4s;
  animation-duration: 4s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
    -webkit-transform: translateY(20px);
  }
  50% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
    -webkit-transform: translateY(20px);
  }
  50% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}

.fadeInOut {
  -webkit-animation-name: fadeInOut;
  animation-name: fadeInOut;
}
</style>
