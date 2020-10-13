<template>
  <div class="pb-100">
    <h4 class="header-top">Publish your website</h4>
    <div class="homepage-para2">Enter your website’s domain information below to publish your site.</div>

    <h4 class="header">THREAD web address</h4>
    <div class="homepage-para">
      By default, your site is always accessible via a THREAD subdomain based on the site name.
      <span
        v-b-popover.hover="'THREAD’s web address is your study’s unique URL for users to sign into. Click Copy link to copy the URL to your clipboard'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div class="Intro-copy pl-20">
      <b v-if="getUrl">{{getUrl}}</b>
      <b v-if="!getUrl">{{copyData}}</b>
      <button class="add-section-btn copy-link-btn" v-clipboard:copy="copyData">Copy link</button>
    </div>
    <h4 class="header">Custom domain settings</h4>
    <div class="homepage-para1">
      Enter your custom domain website address and then follow the instructions to complete your domain setup.
      <span
        v-b-popover.hover="'Enter your custom website address that potential participants will use to register for your study. This is a free form field that is required'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div class="row">
      <div v-if="showSaveCustomDomain===true" class="homepahe-Rectangle-41 col-md-9">
        <div class="row ml-5">
          <div class="col-lg-12 p-0">
            <label class="content">Enter in your custom domain below.</label>
            <input
              v-model="publishData"
              type="text"
              name="study-name"
              class="homepage-box homepage-box-small"
              placeholder="eg.YourCustomDomain.com"
            />
          </div>
        </div>
        <div class="row upload-web">
          <div class="col-lg-12 col-md-12 p-0">
            <div class="col-lg-12 p-0 text-right">
              <button
                class="btn box-btn-save mt-24 btn-success save_btn"
                v-on:click="saveandpublish"
              >Save</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showSaveCustomDomain===false" class="homepahe-Rectangle-41 col-md-9">
        <div class="row save_publish_content">
          <div class="col-lg-6">
            <label class="publish_content">Custom Domain Name</label>
          </div>
          <div class="col-lg-2 text-center">
            <label class="publish_content">Website Status</label>
          </div>
          <div class="col-lg-2 text-center">
            <label class="publish_content">HTTP Code</label>
          </div>
          <div class="col-lg-2"></div>
        </div>

        <div class="row">
          <div class="col-lg-6 p-0">
            <div class="register_content" v-html="publishData"></div>
          </div>

          <div class="col-lg-2 text-center">
            <img 
              v-if="showIcon"
              src="../../../public/static/img/participant-web-img/ICN - green check large.png"
            />
          </div>

          <div class="col-lg-2 text-center">
            <div class="register_content pl-10">{{showStatusCode}}</div>
          </div>

          <div class="col-lg-2">
            <div class="col-lg-12 p-0 text-right">
              <button class="btn btn-publish_edit" v-on:click="publishEdit()">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-9 copy_instruction_content" v-if="instructionDataActive">
      <h2 class="copy_instruction mb-0">
        <b>{{heading1}}</b>
      </h2>
      <p class="copy_instruction">{{heading2}}</p>
      <p class="copy_instruction mt-20 pl-20">
        <b>Option 1 :</b>
        Create an A record for <b>YourCustomDomain.com</b> pointing to our IP address <b>104.198.14.52</b>
      </p>
      <p class="copy_instruction mt-20 pl-20">
        <b>Option 2 :</b>
        Create an ANAME or ALIAS record, and alias <b>YourCustomDomain.com</b> to <b>StudyName.threadsearch.com</b>
      </p>
      <p class="copy_instruction mt-20">{{heading5}}</p>
      <button
        class="btn btn_instruction_btn"
        v-clipboard:copy="[heading1,heading2,heading3,heading4,heading5]"
      >Copy instructions</button>
    </div>
    <!-- read only header page -->
    <!-- Body Content page.-------------- -->
    <div class="row">
      <h4 class="header-body-content mt-20">Google analytics</h4>
      <div class="homepage-para-body-content">
        To connect your website to your GA account, please enter the Google Analytics ID below.
        <span
          v-b-popover.hover="'Enter your Google Analytics Tracking ID if you would like to view data regarding your study’s participant registration website. To locate your Google Analytics Tracking ID, click Admin > Property Settings from your Google Analytics account. This is an optional field.'"
          class="fa fa-info-circle color_grey"
        ></span>
      </div>
      <div v-if="showSaveGoogleAnalytics===true" class="homepage-Rectangle-41 col-md-9">
        <div class="row ml-5">
          <div class="col-lg-4 p-0">
            <label class="content">Google Analytics ID</label>
            <input
              v-model="googleIDdata"
              type="text"
              name="study-name"
              class="homepage-box homepage-box-small"
              placeholder="eg. UA-0000-0"
            />
          </div>
          <div class="col-lg-8 p-0 mt-30 text-right">
            <button
              class="btn box-btn-save btn-success save_btn"
              v-on:click="saveGoogleAnalytics"
            >Save</button>
          </div>
        </div>
      </div>

      <div v-if="showSaveGoogleAnalytics===false" class="register_part col-md-3">
        <div class="row ml-5">
          <div class="col-lg-8 p-0">
            <label class="google_content">
              <p class="analytic_part">Google Analytics ID</p>
            </label>
            <div class="register_content" v-html="googleIDdata"></div>
          </div>
          <div class="col-lg-4 p-0 mt-30 text-right">
            <button class="btn btn-edit-register" v-on:click="editGoogleAnalyticsID()">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";
import Papa from "papaparse";
import FileSaver from "file-saver";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import { AclRule } from "vue-acl";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import { mapGetters } from "vuex";
import {
  participantStatuses,
  participantStatusesText,
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  HOME_HEALTH,
  QUALITY,
  CRA,
  DM,
} from "@/constants/authRoles";
import mainHeader from "../common/main-header";
import sideMenu from "../common/side-menu";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

let dynamicInputID = 0;
export default {
  name: "pulish",
  components: { mainHeader, sideMenu },
  props: {
  },
  data() {
    return {
      publishData: "",
      googleIDdata: "",
      copyData: "StudyName.threadresearch.com",
      heading1: "Setting up your domain",
      heading2:
        "Sign into your DNS provider and use one of the following options to set up your vanity domain.Note: DNS changes can take up to 24 hours to update.",
      heading3:
        "Create an A record for YourCustomDomain.com pointing to our IP address 104.198.14.52.",
      heading4:
        "Create an ANAME or ALIAS record ,and alias YourCustomDomain.com to StudyName.threadresearch.com",
      heading5:
        "If your are not the technical contact for your website, you can copy these instructions and email them to the right person",
      showSaveCustomDomain: true,
      showSaveGoogleAnalytics: true,
      instructionDataActive: false,
      showIcon: false,
      showStatusCode: ''
    };
  },
  
  computed: {
    ...mapGetters(["token", "user", "getStaticUrl"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    getUrl() {
      this.copyData = this.getStaticUrl
      return this.getStaticUrl;
    },
    userToken() {
      return this.token;
    },
    studyId() {
      return this.$route.params.studyId;
    },
    getStatuses() {
      return participantStatuses;
    },
    getStatusesText() {
      return participantStatusesText;
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    },
    canDMAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check("userAccess");
    },
    canCRAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check("userAccess");
    },
  },
  watch: {
    validateImage(image) {
      var isValid = image.name.match(/.(png)$/i);
      return isValid;
    }
  },
  methods: {
    getCustomDomainAndGoogleAnalytics() {
      this.$api
        .getParticipantWebCustomDomain(this.$route.params.studyId)
        .then((response) => {
          if (response.data.data) {
            this.googleIDdata = response.data.data[0].google_analytics_id;
            this.publishData = response.data.data[0].custom_domain;
            this.showIcon = response.data.data[0].custom_domain ? true : false;
            this.showStatusCode = response.data.data[0].custom_domain ? '200' : '';
            if (response.data.data[0].google_analytics_id) {
              this.showSaveGoogleAnalytics = false;
            }
            if (response.data.data[0].custom_domain) {
              this.showSaveCustomDomain = false;
            }
          }
        })
        .catch((err) => {
          (this.closeCarousel = true), console.log("err", err.statusCode);
          throw err;
        });
    },
    async getLatestPublishedURL() {
      await this.$api
        .getPublishedURL(this.$route.params.studyId)
        .then((response) => {
          if (response.data.data) {
            this.copyData = response.data.data.staticSiteURL;
          }
        })
        .catch((err) => {
          throw err;
        });
    },

    saveGoogleAnalytics() {
      if (!this.googleIDdata) {
        toastr.error("Google analytics ID is required.");
        return;
      } else {
        this.showSaveGoogleAnalytics = false;
      }
      let customDomain = this.publishData ? this.publishData : null;
      let googleAnalyticId = this.googleIDdata ? this.googleIDdata : null;
      const saveGoogleAnalytic = {
        customDomain: customDomain,
        googleAnalyticId: googleAnalyticId,
      };
      this.$api
        .createParticipantWebCustomDomain(
          this.$route.params.studyId,
          saveGoogleAnalytic
        )
        .then(() => {
          toastr.success("Google analytic ID saved successfully");
          this.$api
            .getParticipantWebCustomDomain(this.$route.params.studyId)
            .then((response) => {
              if (response.data.data) {
                this.googleIDdata = response.data.data[0].google_analytics_id;
              }
            })
            .catch((err) => {
              (this.closeCarousel = true), console.log("err", err.statusCode);
              throw err;
            });
        });
    },
    editGoogleAnalyticsID() {
      this.showSaveGoogleAnalytics = true;
    },
    saveandpublish() {
      if (!this.publishData) {
        toastr.error("Custom domain is required.");
        return;
      } else {
        this.showSaveCustomDomain = false;
      }
      let customDomain = this.publishData ? this.publishData : null;
      let googleAnalyticId = this.googleIDdata ? this.googleIDdata : null;
      const saveGoogleAnalytic = {
        customDomain: customDomain,
        googleAnalyticId: googleAnalyticId,
      };
      this.$api
        .createParticipantWebCustomDomain(
          this.$route.params.studyId,
          saveGoogleAnalytic
        )
        .then(() => {
          toastr.success("Custom domain saved successfully");
          this.$api
            .getParticipantWebCustomDomain(this.$route.params.studyId)
            .then((response) => {
              if (response.data.data) {
                this.publishData = response.data.data[0].custom_domain;
                this.instructionDataActive = true;
                this.showIcon = response.data.status === 'Success' ? true : false;
                this.showStatusCode = response.data.statusCode ? response.data.statusCode : '';
              }
            })
            .catch((err) => {
              (this.closeCarousel = true), console.log("err", err.statusCode);
              throw err;
            });
        });
    },
    publishEdit() {
      this.showSaveCustomDomain = true;
    },
  },

  mounted() {
    window.scrollTo(0, 0);
    if (this.$route.params.url) {
      this.copyData = this.$route.params.url;
    }
    this.getCustomDomainAndGoogleAnalytics();
    this.getLatestPublishedURL();
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

.copy_instruction_content {
  padding: 35px;
  position: relative !important;
  right: 14px;
}
.copy_instruction {
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #000;
}
.btn_instruction_btn {
  background-color: #fff !important;
border: 2px solid #d3dfe4;
color: #4c8ce4;
border-radius: 3px;
height: 30px;
display: inline-block;
padding: 0 15px;
}
// google analytic pop up

.register_part {
  width: 257px;
  height: 87px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
}

.google_content {
  width: 255px;
  position: relative;
  right: 15px;
  height: 28px;
  font-size: 12px;
  line-height: 2.67;
  color: #000000;
  background: #d3dee3;
  font-family: RobotoBold;
}
.analytic_part {
  position: relative;
  left: 18px;
  opacity: 0.7;
  color: #000;
}
.btn-edit-register {
  background-color: #fff !important;
border: 2px solid #d3dfe4;
color: #4c8ce4;
border-radius: 3px;
width: 70px;
height: 30px;
display: inline-block;
padding: 0;
position: relative;
top: 10px;
}
.register_content {
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.publish_content {
    font-family: RobotoBold;
    font-size: 12px;
    line-height: 2.5;
    color: #000000;
    margin-bottom: 0;
    opacity: 0.7;
}
// save & publish

.btn-publish_edit {
  background-color: #fff !important;
  border: 2px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  width: 70px;
  height: 30px;
  display: inline-block;
  padding: 0;
}
.save_publish_content {
  width: 806px;
  position: relative;
  bottom: 15px;
  right: 20px;
  height: 30px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
  background-color: #d3dee3;
}

body,
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
  flex: none;
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
  float: left;
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
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
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
    flex: none;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
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
  .col-md-6 {
    width: 50%;
  }
  .col-md-4 {
    width: 33.33333333%;
  }
  .col-md-8 {
    width: 66.66666667%;
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
    flex: none;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.row {
  clear: both;
}
.launch_status_section {
  background-color: #2d3752;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  /*background-image: linear-gradient(97deg, #698eff, #15befd 49%, #8efbce);*/
  padding: 21px;
  margin-bottom: 20px;
  font-size: 18px;
}
// .launch-status-section-web {
//   width: 1000px;
//   height: 150px;
//   border-radius: 3px;
//   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
//   background-color: #668bbd;
// }
.draft-status {
  background-color: #48bf7a;
}
.draft-status-web {
  background-color: #668bbd;
}
.mobile-icon {
  position: absolute;
  top: -17px;
  left: 112px;
}
.consent-icon {
  position: absolute;
  top: 33px;
  left: 220px;
  width: 110px;
  height: 88px;
}
.like-icon {
  position: absolute;
  top: 85px;
  left: 69px;
}
.desktop-icon-web {
  position: absolute;
  top: -10px;
  left: 112px;
  width: 131px;
  height: 78px;
  object-fit: contain;
}
.nav-icon-web {
  position: absolute;
  top: 38px;
  left: 261px;
  // width: 110px;
  // height: 88px;
  width: 69px;
  height: 59px;
  object-fit: contain;
}
.globe-icon-web {
  position: absolute;
  top: 60px;
  left: 60px;
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.opacity-1 {
  opacity: 0.75 !important;
}
.provide-btn {
  background-color: #fff;
  color: #48bf7a;
}
.update-btn {
  background-color: #48bf7a;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}
.update-btn-web {
  background-color: #668bbd;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}

.fa-apple,
.fa-android,
.fa-cloud {
  color: #f16559;
  font-size: 24px;
  position: relative;
  top: 4px;
}

.status-strip {
  width: 80%;
  background: #fff;
  padding: 10px 0 10px 10px;
  color: #2d3752;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}
.completed_title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  max-width: 90%;
  cursor: pointer;
}
.status-strip-red {
  width: 80%;
  background: #f16559;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}

.edit-color {
  color: #4c8ce4 !important;
  font-weight: normal;
}

.edit-color-white {
  color: #fff !important;
  font-weight: normal;
}

.contact_btn {
  border-radius: 100px;
  background-color: #34537d;
  color: #ffffff;
}
.export_btn {
  border-radius: 25px;
  background-color: #34537d !important;
  color: #ffffff;
  cursor: pointer;
}
.disable-export {
  background-color: #b8c7ce !important;
}

.download_btn {
  background-color: #4c8ce4;
  color: #ffffff;
  cursor: pointer;
}

.pop-color {
  color: #666669 !important;
}

.close-btn {
  background: #d3dfe4;
  color: #666669;
}

.padding_top_10px {
  padding-top: 10px;
}

.padding_top_20px {
  padding-top: 20px;
}

.donut_graph_panel {
  height: 184px;
}

.dashboard {
  display: flex;
  background-color: #f5f8fa;
}
.graph_val {
  position: relative;
  top: 2px;
}
.remaining_days_text {
  font-size: 12px;
  color: #666769;
}
.reverse {
  transform: rotate(180deg);
}

.remaining_days_graph {
  width: 200px;
  height: 80px;
}
.item_bg_color {
  border-radius: 3px;
  background-color: #eaf0f4;
  color: #707c81;
  padding: 4px 10px;
  font-size: 12px;
  margin: 0 4px 4px 0;
  display: inline-block;
}
.arrow {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 74px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.panel {
  border-radius: 2px;
  margin-bottom: 10px;
}

.panel_height {
  height: 100%;
  min-height: 260px;
  position: relative;
}
.panel_height_half {
  height: 100%;
  min-height: 130px;
  position: relative;
}
.panel-body {
  padding: 16px;
}
.Rectangle-41 {
  width: 1078px;
  height: 291px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  width: 1291px;
  margin-left: 32px;
  background-color: #f5f8fa;
  //   opacity: 0.1;
  margin-left: 32px;
  padding-left: 30px;
}
.arrow2 {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 17px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.btn-close-tutorial {
  position: relative;
  right: -136px;
  border: none;
  background-color: transparent;
  font-family: RobotoRegular;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-top: -10px;
  color: #fff;
  z-index: 1002;
  margin-left: 919px;
}
.instruction_title {
  word-break: break-word;
  width: 307px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #000000;
  text-align: justify;
}
.participant-heading {
  // width: 130px;
  height: 22px;
  margin-top: 93px !important;
  margin-left: 64px;
  font-family: Lato;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
}
.rectangle {
  width: 1140px;
  height: 1893px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.custom-popover2 {
  position: absolute;
  width: 490px;
  border-radius: 3px;
  padding: 10px;
  left: 27px !important;
  top: -42px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.custom-popover {
  position: absolute;
  width: 669px;
  border-radius: 3px;
  padding: 10px;
  left: 28px !important;
  top: -99px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.compliance_section {
  .adherence {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
    .percentage {
      color: #666669;
      font-size: 28px;
      font-weight: bold;
    }
    .desc {
      color: #666669;
      font-size: 12px;
    }
  }
  .tasks {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
  }
}

.help_icon {
  font-size: 16px !important;
  color: #b5bcc0 !important;
  border: none !important;
  outline: none !important;
}
.primaryBgColor {
  background-color: #4c8ce4;
}
@media (max-width: 575px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .graph_padding {
    padding-top: 0px;
  }
  .graph_legend_padding {
    padding-top: 10px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .graph_padding {
    padding-top: 50px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}

@media (min-width: 1200px) {
  .graph_padding {
    padding-top: 80px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}
.btn-skip-tutorial {
  //  width: 132px;
  height: 28px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #4c8ce3;
  background-color: #fff;
  border: none;
  margin-left: 37px;
  margin-top: 572px;
  position: absolute;
  z-index: 1002;
  margin-bottom: -21px;
}

.data-input-div {
  margin: 0 auto;
}

.input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.cancel-image {
  float: right;
  cursor: pointer;
}
.sftp-header1 {
  font-size: 16px;
  font-family: "RobotoMedium";
  color: "#4a4a4a";
}

.sftp-header2 {
  font-size: 14px;
  font-family: "RobotoRegular";
  color: "#666669";
}

.modal-dialog {
  max-width: 600px !important;
}

.continue-button {
  width: 60%;
  margin: 0 auto !important;
}

.continue-button button {
  width: 48%;
  margin-top: 30px;
  cursor: pointer;
}

.continue-transfer {
  width: 40%;
  margin: 0 auto !important;
}

.continue-transfer button {
  width: 100%;
  margin-top: 50px;
  cursor: pointer;
}
.disconnect {
  color: #f16559 !important;
  font-family: "RobotoRegular" !important;
  cursor: pointer;
}

.modify {
  color: #4c8ce4;
  cursor: pointer;
}

.connection-label {
  font-family: "RobotoBold";
  float: left;
  width: 33%;
}

.connection-content {
  width: 66%;
  float: left;
}

.transfer-on {
  background-color: #48bf7a !important;
}

.cancel_btn {
  background-color: #959fa4;
  color: #ffffff;
}

.text-font {
  font-size: 16px;
  font-family: "RobotoMedium";
}

.details-div ul {
  list-style-type: none;
  padding: 0;
}
.nav-bar .nav-link.active {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
  font-weight: bold;
}
.nav-bar .nav-link {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
}
.has-sidemenus {
  margin-left: 0px !important;
  margin-top: 0px !important;
  padding-top: 0px !important;
}
// Css for global element
.name {
  width: 259px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.content {
  width: 350px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 4px;
}
.box {
  width: 350px;
  height: 40px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  padding: 10px 8px;
}
.color-palette {
  width: 259px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.choose-a-primary-col {
  width: 145px;
  height: 15px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.rectangle-4 {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
  background-color: #ffffff;
  margin: 10px;
}
.choose-a-secondary-col {
  width: 162px;
  height: 16px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}

.box-color {
  width: 150px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  padding: 10px 8px;
}
.box {
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  width: 350px;
  height: 40px;
}
.logo-icon {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: 600;
  color: #666669;
  margin-bottom: 5px;
}
.rectangle-7 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  padding-bottom: 29px;
  border: none;
  margin-right: 7px;
}
.rectangle-79 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  border: none;
  // margin-right: 7px;
  margin-left: -40px;
}
.rectangle-9 {
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  padding-bottom: 29px;
  border: none;
  margin-left: 8px;
}
.rectangle-38 {
  width: 140px;
  height: 64px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -15px;
}
.upload-your-study-logo {
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.recommended-by {
  display: block;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 11px;
  color: #666669;
  margin-top: 4px;
}
.homepage-rectangle-footer {
  width: 1078px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  margin-left: 29px;
  padding: 15px 5px;
}
.box-btn-save {
  width: 120px;
  height: 36px;
  background-color: #48bf7a;
  border-radius: 25px;
}
.info-screen {
  width: 258.5px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
// .upload-btn {
//   width: 38px;
//   height: 16px;
//   opacity: 0.6;
//   font-family: RobotoRegular;
//   font-size: 12px;
//   font-weight: bold;
//   font-stretch: normal;
//   font-style: normal;
//   line-height: 1.33;
//   letter-spacing: normal;
//   color: #666669;
//   padding: 21px 7px;
// }

.info-content {
  margin-left: 32px;
  margin-top: 32px;
}
.box-edit {
  // width: 1038px;
  // height: 90px;
  // border-radius: 3px;
  // border: solid 2px var(--brand-accent-2);
  width: 1038px;
  height: 90px;
  border-radius: 3px;
  background-color: #ffffff;
}

.lable-content {
  width: 398px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.box-content {
  width: 495.3px;
  height: 54px;
  border-radius: 3px;
  background-color: #ffffff;
}
.footer-content-box {
  height: 217px;
}

// homepage styling

.homepage-box {
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepahe-Rectangle-41 {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 20px 20px;
}
.homepage-content-additional-input {
  border-radius: 3px;
  // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  border: solid 1px #d3dee3;
  width: 100%;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-content-additional {
  width: 100%;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-content-additional-body {
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-para2 {
  margin-bottom: 10px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.homepage-para {
  margin-bottom: 10px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #949496;
}
.homepage-para1 {
  margin-bottom: 10px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #000;
  opacity: 0.7;
}
.homepage-para-body-content {
  margin-bottom: 10px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #000;
  opacity: 0.7;
}
.homepage-logo-icon {
  margin-top: 5px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  line-height: 2.29;
  color: #666669;
}
.homepage-rectangle-38 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -38px;
}
.homepage-rectangle-380 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
}
.header-body-content {
  font-family: RobotoRegular;
  font-size: 20px;
  font-weight: 600;
  color: #666669;
}
.callout-section {
  width: 1090px;
}
.callout-title-para {
  width: 307px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 4px;
}
.callout-body-input {
  width: 325px;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dee3;
}
.homepage-Rectangle-41 {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 20px 20px;
}
.callout-copy-input {
  width: 325px;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dee3;
}

// read only section
.homepage-read-edit-body {
  font-size: 14px;
  width: 90%;
  word-break: break-word;
  text-align: justify;
}
.read-edit-btn {
  background-color: #fff !important;
  border: 2px solid #d3dfe4 !important;
  color: #4c8ce4;
  border-radius: 3px;
  width: 70px;
  height: 30px;
  display: inline-block;
  padding-bottom: 27px;
}
.add-section-btn {
  background-color: #fff !important;
  border: 1px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  // width: 120px;
  height: 30px;
  display: inline-block;
  // padding-bottom: 27px;
  font-family: RobotoRegular;
  font-size: 12px;
  margin-top: 14px;
  margin-left: 28px;
}
// .upload-web {
//   width: 1090px;
// }
// .rectangle-footer-callout {
//   width: 1090px;
// }
.homepage-box-small {
  width: 1038px;
}

.content-edit {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: normal;
  color: #666669;
}
.content-body-edit {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}
.btn-edit-feature {
  width: 206px;
  height: 39px;
  background-color: #959fa4;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
  img {
    -webkit-filter: brightness(0) invert(1);
    filter: brightness(0) invert(1);
  }
}
.selected_icon_logo_image img {
  -webkit-filter: brightness(0) invert(1);
  filter: brightness(0) invert(1);
}
.callout-title-para-edit {
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #000000;
}
.color_grey {
  color: #b5bcc0 !important;
  // color: #838e93;
  font-weight: bold;
  font-size: 18px;
}
.color-grey {
  cursor: pointer;
  opacity: 0.6;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  line-height: 2.33;
  color: #666669;
}
.paginate {
  color: grey;
  font-size: 14px;
  background-color: white;
  margin: 0px 8px 0px 0px;
  padding: 8px 5px 8px 5px;
  display: inline-block;
  cursor: pointer;
}
.box-btn-next {
  width: 150px;
  height: 36px;
  background-color: #4c8ce4 !important;
  border-radius: 25px;
}
.next-screen-btn-div {
  margin-left: 960px;
}
/deep/ .quill-editor {
  &.bg-white {
    position: relative;
    border-top: 1px solid #ccc;
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border-bottom: none;
        border-top: none;
        padding: 4px;
        float: right;
        border-left: none;
        z-index: 9;
        position: relative;
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
          margin-top: 8px;
          margin-right: 10px;
          .ql-active {
            box-shadow: 0 2px 2px 0 rgb(119, 119, 120);
          }
          button {
            height: 29px;
            padding: 4px 4px;
          }
          button:not(:last-child) {
            border-right: 1px solid #ccc;
          }
        }
        .ql-formats:last-child {
          border-right: 1px solid #ccc;
        }
        .ql-stroke {
          stroke: #ccc;
        }
        .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: #ccc;
        }
      }
    }
    .ql-container {
      font-family: RobotoRegular;
      font-weight: normal;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: auto;
        min-height: 54px;
      }
    }
  }
  &.instruction-screen {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        min-height: 170px;
      }
    }
  }
}
// .ql-container.ql-snow {
//     border: none;
// }
.quill-editor.bg-white {
  border: none;
}

.file-input {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
}
.file-input-callout-1 {
  position: absolute;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  margin-right: 88px;
  width: 100%;
}
.upload-and-save-btn-box {
  width: 250px;
}
.selectLibrary {
  border-radius: 3px;
  background-color: #d3dfe4;
  padding: 5px 10px;
  overflow: hidden;
  border: none;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
  width: 142px;
  display: inline-block;
}
.modal_header_color {
  color: #28406a;
}
.modal_desc {
  color: #535456;
}
.modal_custom {
  border-radius: 4px;
  padding: 16px;
}
.modal_content {
  color: #666769;
  font-weight: 500;
}
.modal_close_icon {
  cursor: pointer;
  font-size: 24px;
}
@media (min-width: 768px) {
  .modal-dialog {
    max-width: 600px;
    margin: 30px auto;
  }
}
.library_img_bg {
  display: -webkit-inline-box;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  max-width: 200px;
  max-height: 80px;
  min-height: 70px;
  width: 98%;
  padding: 10px;
  text-align: -webkit-center;
  .logo {
    width: auto;
    margin: auto;
    height: 45px;
  }
  .icon {
    max-width: 50px;
    max-height: 50px;
    margin: auto;
  }
}
.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: red;
  opacity: 1; /* Firefox */
}
textarea::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.additioanal_copy .quill-editor.bg-white {
  resize: both;
  overflow: auto;
}
/deep/ .quill-editor {
  &.bg-white {
    position: relative;
    border-top: 1px solid #ccc;
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border-bottom: none;
        border-top: none;
        padding: 4px;
        float: right;
        border-left: none;
        z-index: 9;
        position: relative;
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
          margin-top: 8px;
          margin-right: 10px;
          .ql-active {
            box-shadow: 0 2px 2px 0 rgb(119, 119, 120);
          }
          button {
            height: 29px;
            padding: 4px 4px;
          }
          button:not(:last-child) {
            border-right: 1px solid #ccc;
          }
        }
        .ql-formats:last-child {
          border-right: 1px solid #ccc;
        }
        .ql-stroke {
          stroke: #ccc;
        }
        .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: #ccc;
        }
      }
    }
    .ql-container {
      color: #000;
      font-family: RobotoRegular;
      font-weight: normal;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: auto;
        min-height: 54px;
      }
    }
  }
  &.instruction-screen1 {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        height: 170px !important;
      }
    }
  }
  &.instruction-screen {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        min-height: 110px;
      }
    }
  }
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #ccc;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 1px;
  background-color: #ccc;
}
input:checked + .slider {
  border: 2px solid #48bf7a;
}
input:checked + .slider:before {
  content: "";
  background-color: #48bf7a;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  /*content: '?';*/
  position: absolute;
  color: #2ecc71;
  text-align: center;
  font-size: 20px;
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
.filds_section {
  border-radius: 8px;
  padding: 0 10px 10px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  min-height: 150px;
}
@media (max-width: 575px) {
  .switch {
    width: 50px;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(12px);
    -ms-transform: translateX(12px);
    transform: translateX(12px);
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 25px;
    width: 25px;
    left: 12px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
  }
  .check_icon {
    color: rgb(46, 204, 113);
    position: absolute;
    left: 28px;
    top: 8px;
    font-size: 18px;
    transition: 0.4s;
  }
}

.optionalField {
  height: 40px;
}
.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}
.form-control {
  border: solid 2px #d3dfe4 !important;
  height: 40px !important;
  color: #c5d1d6;
}
button {
  cursor: pointer;
  outline: 0px solid !important;
}

.passcode_icon {
  width: 15px;
  height: 15px;
}
button:focus {
  outline: 0px solid transparent;
}
.section_heading {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.field_row {
  padding: 10px 0px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.inactive {
  opacity: 0.5;
  pointer-events: none;
}
.header_text {
  color: #1d7fee;
  font-weight: bold;
  margin: 10px 0;
}
.labelText {
  width: 130px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
input[type="checkbox"] {
  opacity: 0;
  box-sizing: border-box;
  padding: 0;
}

.registeration_div > div:nth-child(10) {
  display: none;
}
.registeration_div
  > div:nth-child(9)
  .col-lg-6.col-md-6.col-sm-12.col-xs-12.pl-0.pr-0 {
  margin-top: -50px;
}
.Gender-selection {
  font-weight: 600;
  font-size: 14px;
  margin-left: 5px;
  color: #949496;
  //opacity: 0.7;
}
.table-responsive {
  display: block;
  width: 100%;
  border: solid 1px #d3dee3;
  overflow-x: auto;
  width: 1037px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.table {
  margin-bottom: 0px;
}
tbody {
  background-color: white;
}
thead {
  background-color: #d3dee3;
}
.homepahe-Rectangle-41 .table th {
  padding: 2px 0.75rem;
  font-size: 14px;
  font-weight: 600;
  border-right: 2px solid #fff !important;
  text-align: center;
  border: none;
}
.Add-study-sec .table th:last-child {
  border-right: none !important;
}

.Add-study-sec .table td {
  padding: 1rem 0.75rem;
  vertical-align: top;
  border-top: none;
  text-align: center;
}
.Add-study-sec .table td:nth-child(2) {
  text-align: left;
}
.control {
  font-size: 18px;
  position: relative;
  display: block;
  margin-bottom: 15px;
  padding-left: 30px;
  cursor: pointer;
}

.control input {
  position: absolute;
  z-index: 2;
  opacity: 0;
  left: 43%;
  top: 20px;
}

.control__indicator {
  position: absolute;
  top: 16px;
  left: 40%;
  width: 20px;
  height: 20px;
  background: #e6e6e6;
  border-radius: 3px;
}

.control--radio .control__indicator {
  border-radius: 50%;
}

.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  background: #ccc;
}

.control input:checked ~ .control__indicator {
  background: #4c8ce4;
}

.control:hover input:not([disabled]):checked ~ .control__indicator,
.control input:checked:focus ~ .control__indicator {
  background: #4c8ce4;
}

.control input:disabled ~ .control__indicator {
  pointer-events: none;
  opacity: 0.6;
  background: #e6e6e6;
}

.control__indicator:after {
  position: absolute;
  display: none;
  content: "";
}

.control input:checked ~ .control__indicator:after {
  display: block;
}

.control--checkbox .control__indicator:after {
  top: 1px;
  left: 8px;
  width: 6px;
  height: 13px;
  transform: rotate(45deg);
  border: solid #fff;
  border-width: 0 2px 2px 0;
}
.invitation {
  font-size: 14px;
  font-family: RobotoRegular;
  font-weight: bold;
}
.link {
  text-decoration: underline;
  color: #4c8ce4;
}

/*new CSS*/

.header-top {
  font-family: RobotoRegular;
  font-size: 24px;
  font-weight: bold;
  color: #666669;
  margin-top: 16px;
}
.header {
  font-family: RobotoRegular;
  font-size: 20px;
  font-weight: bold;
  color: #666669;
  margin-top: 25px;
}
.add-section-btn {
  background-color: #fff !important;
  border: 2px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  height: 30px;
  display: inline-block;
  font-family: RobotoRegular;
  font-size: 12px;
  margin-top: 0px;
  margin-left: 28px;
}
.Intro-copy {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #666669;
  margin-top: 0px;
}
button.add-section-btn.copy-link-btn:hover {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.homepage-box {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 0px 8px;
}
</style>
