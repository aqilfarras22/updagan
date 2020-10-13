<template>
  <div class="has-header has-footer">
    <div class=" text-center">
      <p class="pt-40 pb-20 fs-18 color_grey">Element Progress Summary</p>
      <div class="row pt-10">
        <div v-for="feature in features">
          <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2" v-if="feature.active">
            <div class="panel panel-default bg-color no-border col-lg-10">
              <div class="panel-body product-card">
                <span :class="{'half_grey' : (feature.status === 'started'), 'full_grey' : (feature.status === 'notStarted')}"></span>
                <!--<span class="active_feature_icon" v-html="feature.icon"></span>-->
                <img :src="feature.icon" alt="" class="active_feature_icon" :class="{'gray_img' : (feature.status === 'notStarted')}">
                <img src="static/img/icn-checkmark.svg" alt="" class="check_icon" v-if="feature.status === 'completed'">
                <span class="started_text" v-if="feature.status === 'started'">Started</span>
                <!--<i class="fa fa-times-circle not_started_icon" aria-hidden="true" v-if="feature.status === 'notStarted'"></i>-->
              </div>
              <h6 class="color_grey">{{feature.name}}</h6>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2 pt-20">
          <div class="panel-body cursor_pointer" data-toggle="modal" data-target="#add-features-modal">
              <div class="btn-box"><span class="create_button"><span class="plus_icon">+</span></span><span class="text-btn">Add a New Element</span></div>
          </div>
        </div>
      </div>
    </div>
    <div id="add-features-modal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content pr-10 pb-20">
          <div class="modal-header border-none p-0">
            <button type="button" class="close cursor_pointer close-style" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-text pl-20">Custom features library</div>
          <h6 class="pl-20">Select features to add. Features already in your study will not be shown.</h6>
          <div class="modal-body pb-0">
            <div v-for="(feature,index) in nonSelectedFeatures" :key="index">
              <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 pl-0">
                <div class="panel panel-default no-border mb-30">
                  <div v-if="!feature.comingSoon" v-on:click="addFeatures(feature)">
                    <div v-if="!feature.active">
                      <div class="panel-body product-card feature-card">
                        <img :src="feature.icon1" alt="" class="active_feature_icon">
                      </div>
                      <h6>{{feature.name}}</h6>
                    </div>
                    <div v-if="feature.active">
                      <div class="panel-body product-card">
                        <img :src="feature.icon" alt="" class="active_feature_icon">
                      </div>
                      <h6>{{feature.name}}</h6>
                    </div>
                  </div>
                  <div v-if="feature.comingSoon">
                    <div class="panel-body product-card feature-card">
                      <img :src="feature.icon1" alt="" class="active_feature_icon">
                      <button type="button" class="btn btn-coming-soon">Coming Soon</button>
                    </div>
                    <h6>{{feature.name}}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer footer-style clearfix">
            <button type="submit" data-dismiss="modal" class="btn btn-md btn-style" v-on:click="addSelectedFeatures()" :disabled="!enableAddBtn">Add</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footerStyle">
      <div class="container">
        <div class="btn-hold col-lg-offset-6 col-lg-2 col-md-offset-6 col-md-3 col-sm-6 col-xs-6 pl-0 text-center-xs text-center-sm">
          <button type="button" class="btn btn-info-blue br-25 continue_btn" v-on:click="nextClick()" :class="{'disabled-btn': !gotData}">I’m done customizing!</button>
        </div>
        <div class="col-lg-4 col-md-3 col-sm-6 col-xs-6 pr-0 text-center-xs text-center-sm">
          <button class="btn btn-block saveBtn br-25 continue_btn" disabled>Continue where I left off</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import toastr from 'toastr';
import services from '../services';

export default {
  name: 'features-library',
  data() {
    return {
      studyData: null,
      byInvitation: null,
      studyId: null,
      enableAddBtn: false,
      isMultipleConsent: true,
      features: [
        {
          active: false,
          comingSoon: false,
          name: 'Branding',
          shortName: 'Branding',
          index: 1,
          route: 'branding',
          status: '',
          icon: 'static/img/features-final/branding.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Registration',
          shortName: 'Registration',
          index: 2,
          route: 'registration',
          status: '',
          icon: 'static/img/features-final/registration.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Onboarding',
          shortName: 'Onboarding',
          index: 3,
          route: 'onboarding',
          status: '',
          icon: 'static/img/features-final/onboarding.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Eligibility',
          shortName: 'Eligibility',
          index: 4,
          route: 'eligibility',
          status: '',
          icon: 'static/img/features-final/eligiblity.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'eConsent',
          shortName: 'eConsent',
          index: 5,
          route: 'econsent',
          status: '',
          icon: 'static/img/features-final/econsent.svg',
        },
        {
          active: true,
          comingSoon: false,
          name: 'eConsents',
          shortName: 'eConsents',
          key: 'multiConsent',
          index: 6,
          route: 'multieconsent',
          icon: 'static/img/features-final/econsent.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Dashboard',
          shortName: 'Dashboard',
          index: 7,
          route: 'dashboards',
          status: '',
          icon: 'static/img/features-final/dashboards.svg',
          icon1: 'static/img/features/patient_dashboards.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Learn',
          shortName: 'Learn',
          index: 8,
          route: 'engagement-content',
          status: '',
          icon: 'static/img/features-final/engagement_content.svg',
          icon1: 'static/img/features/engagement_content.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Surveys',
          shortName: 'Surveys',
          index: 9,
          route: 'surveys',
          status: '',
          icon: 'static/img/features-final/surveys.svg',
          icon1: 'static/img/features/patient_surveys_1.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Electronic Patient Reported Outcomes (ePROs)',
          shortName: 'ePROs',
          index: 10,
          route: 'epros',
          status: '',
          icon: 'static/img/features-final/epros.svg',
          icon1: 'static/img/features/epros.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Electronic Device Reported Outcomes (eDROs)',
          shortName: 'eDROs',
          index: 11,
          route: 'edros',
          status: '',
          icon: 'static/img/features-final/edros.svg',
          icon1: 'static/img/features/edros.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Mobile Health Data Access',
          shortName: 'Mobile Health Data Access',
          index: 12,
          route: 'health-data-access',
          icon: 'static/img/features-final/engagement_content.svg',
          icon1: 'static/img/features/engagement_content_1.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Sensors',
          shortName: 'Sensors',
          index: 13,
          status: '',
          route: 'medical-devices',
          icon: 'static/img/features-final/icn-med-device-wearable-3.svg',
          icon1: 'static/img/features/med-device-wearable.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Custom Notifications',
          shortName: 'Custom Notifications',
          key: 'notifications',
          index: 14,
          route: 'notifications',
          icon: 'static/img/features-final/notifications.svg',
          icon1: 'static/img/features/notifications_1.svg',
        },
        {
          active: false,
          comingSoon: false,
          name: 'Telehealth',
          shortName: 'Telehealth',
          key: 'teleHealth2',
          index: 15,
          route: 'tele-health-v2',
          icon: 'static/img/features-final/tele_health.svg',
          icon1: 'static/img/features/tele_health_1.svg',
        },
         {
          active: false,
          comingSoon: false,
          name: 'Activity Order',
          shortName: 'Activity Order',
          key: 'activityOrder',
          index: 16,
          route: 'activity-order',
          icon: 'static/img/features/task-order-summary.svg',
          icon1: 'static/img/features/task-order.svg',
        },
      ],
      add_icon: '<i class="fa fa-plus-circle" aria-hidden="true"></i>',
      nonSelectedFeatures: [],
      gotData: false,
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.getStudyDetails();
    this.getToggleFeatures();
    this.getFeatures();
  },
  methods: {
    getToggleFeatures() {
      const that = this;
      that.$api.getToggleFeaturesFact(that.studyId).then(
        response => {
          that.toggleFeatures = response.body.studyFeatures;

          // For Telehealth 2.0 Feature
          const isTelehealth = that.toggleFeatures.filter(x => x.featureKey == 'TELEHEALTH' && x.enabled == true); // eslint-disable-linedisable-line
          if ((isTelehealth == null || isTelehealth == undefined || isTelehealth == '') && isTelehealth.length == 0) { // eslint-disable-line
            try{
              that.features.splice(14, 1);
            }catch{
            }
          }

          // For Multiple Conset feature
          const isEconsent = that.toggleFeatures.filter(x => x.featureKey == 'ECONSENT'); // eslint-disable-line

         if ((isEconsent == null || isEconsent == undefined || isEconsent == '') && isEconsent.length == 0) { // eslint-disable-line
            that.features.splice(4, 1);
          } else {
            that.isMultipleConsent = false;
            that.features.splice(5, 1);
          }
          that.getFeaturesStatus();
        },
        error => {
          that.getFeaturesStatus();
          that.$toastr.error(error.body && error.body.message ?
            error.body.message : 'Error while getting features.');
        },
      );
    },
    getFeatures() {
      this.$api.getLibraryFeaturesFact(this.studyId).then(response => {
        if (response.body) {
          this.selectedFeatures = response.body.studyLibraryFeatures;
        }
      });
    },
    getFeaturesStatus() {
      const that = this;

      if (that.isMultipleConsent) {
        that.$api.getFeaturesStateV2Fact(that.studyId).then(
          response => {
            if (response.body) {
              that.selectedFeaturesStatus = response.body.studyLibraryFeatures;
              _.forEach(that.selectedFeaturesStatus, feature => {
                const selectedIndex = _.findIndex(that.features, ['index', feature.index]);
                that.features[selectedIndex].active = true;
                that.features[selectedIndex].status = feature.status;
              });
              that.nonSelectedFeatures = _.cloneDeep(
                _.filter(that.features, o => !o.active && o.index > 5),
              ); // eslint-disable-line
              that.gotData = true;
            }
          },
          error => {
            toastr.error(error.message);
          },
        );
      } else {
        that.$api.getFeaturesStateFact(that.studyId).then(
          response => {
            if (response.body) {
              that.selectedFeaturesStatus = response.body.studyLibraryFeatures;
              _.forEach(that.selectedFeaturesStatus, feature => {
                const selectedIndex = _.findIndex(that.features, ['index', feature.index]);
                that.features[selectedIndex].active = true;
                that.features[selectedIndex].status = feature.status;
              });
              that.nonSelectedFeatures = _.cloneDeep(
                _.filter(that.features, o => !o.active && o.index > 5),
              ); // eslint-disable-line
              that.gotData = true;
            }
          },
          error => {
            toastr.error(error.message);
          },
        );
      }
    },
    addFeatures(feature) {
      const index = this.nonSelectedFeatures.indexOf(feature);
      const { active } = this.nonSelectedFeatures[index];
      if (index >= 0) {
        this.nonSelectedFeatures[index].active = !active;
      }
      const featureIndex = _.findIndex(this.nonSelectedFeatures, ['active', true]);
      this.enableAddBtn = featureIndex >= 0;
    },
    addSelectedFeatures() {
      const selectedFeatures = _.filter(this.nonSelectedFeatures, o => o.active);
      this.features = _.unionBy(this.features, selectedFeatures);
      this.features = _.sortBy(this.features, 'index');
      this.nonSelectedFeatures = _.filter(this.nonSelectedFeatures, o => !o.active);
    },
    nextClick() {
      const selectedFeatures = _.filter(this.features, o => o.active && !o.comingSoon);
      this.studyLibraryFeatures = _.map(selectedFeatures, elm => _.pick(elm, 'index',
        'name', 'icon', 'route', 'shortName'),
      );
      this.studyLibraryFeatures = _.sortBy(this.studyLibraryFeatures, 'index');
      const payload = { studyLibraryFeatures: this.studyLibraryFeatures };
      this.$api.postLibraryFeaturesFact(this.studyId, payload).then(
        response => {
          services.saveSelectedFeatures(response.body.studyLibraryFeatures);
          this.$router.push({ name: 'scan', params: { studyId: this.studyId } });
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while sending the selected features to server',
          );
        },
      );
    },
    getStudyDetails() {
      var self = this;
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          self.studyData = response.body;
          //Remove EDROS when the study is multilingual
          if(self.studyData.language && self.studyData.language.length>1){
            self.features = _.filter(self.features, function(o) { return o.shortName.toLowerCase()!="edros"; });  
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
  },
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
    content: '';
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
}

.footerStyle {
  .container {
    text-align: right;
    .btn-hold {
      text-align: center;
      float: none !important;
      display: inline-block;
      max-width: inherit;
      width: auto !important;

      .btn {
        min-width: 200px;
      }
    }
  }
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
  .col-md-3 {
    width: 25%;
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
  /*margin-bottom: 40px;*/
}

.product-card {
  position: relative;
  padding: 13px 0px;
  border-radius: 14px;
  background-color: #34537d;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
  width: 80px;
  height: 80px;
  margin: auto;
}
.feature-card {
  background-color: #ffffff;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
  border: solid 1px #d3dfe4;
}
.check_icon {
  position: absolute;
  top: -12px;
  right: -8px;
  width: 40px;
}
.grey_status {
  display: inline-block;
  width: 100%;
  background-color: #b8c7ce;
  position: relative;
  top: -14px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}
.half_grey {
  @extend .grey_status;
  height: 40px;
}
.full_grey {
  @extend .grey_status;
  border-radius: 14px;
  height: 84px;
}
.gray_img {
  filter: brightness(45%);
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

.full_grey {
  .active_feature_icon {
    -webkit-filter: invert(45%);
    filter: invert(45%);
  }
}

.create_button {
  float: left;
  color: #5989e4;
  margin-top: 3px;
  margin-left: 5px;
  font-size: 32px;
  width: 30px;
  height: 30px;
  background-color: #ff7171;
  display: inline-block;
  border-radius: 50%;
  .plus_icon {
    color: #ffffff;
    position: relative;
    bottom: 11px;
    right: 0px;
  }
}
.mac {
  .create_button {
    .plus_icon {
      bottom: 9px;
    }
  }
}
.started_text {
  border-radius: 100px;
  background-color: #f16559;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 2px 11px;
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 12px;
}

.not_started_icon {
  color: #f16559;
  position: absolute;
  top: -15px;
  right: -11px;
  font-size: 28px;
  background: #fff;
  border-radius: 50%;
  height: 25px;
  width: 25px;
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

.modal-text {
  color: #1f95f2;
  font-size: 24px;
}

.clear-both {
  clear: both;
  padding-bottom: 15px;
}

.close-style {
  padding-right: 15px;
  padding-top: 20px;
}

.overflow {
  overflow-y: scroll;
}

.footer-style {
  text-align: center;
  border-top: none;
  padding-top: 0px;
  display: block;
}

.btn:hover,
.btn:focus,
.btn.focus {
  color: #fff;
  text-decoration: none;
}

.btn-style {
  width: 300px;
  background-color: #4c8ce4;
  color: #ffffff;
}

.img-style {
  position: relative;
  height: 95px;
  top: -40px;
}

.continue_btn {
  //width: 100%;
  max-width: 200px !important;
  margin: 0;
  white-space: nowrap;
}
.disabled-btn {
  pointer-events: none;
  opacity: 0.5;
}
.add-icon {
  font-size: 35px;
  color: #1f95f2;
  left: 145px;
  top: 25px;
  position: absolute;
}

.btn-box {
  width: 200px;
  height: 36px;
  background-color: #2d3752;
  border-radius: 30px;
  float: right;
}

.text-btn {
  color: #fff;
  font-size: 16px;
  text-align: center;
  float: left;
  padding-top: 6px;
  padding-left: 10px;
}
</style>
