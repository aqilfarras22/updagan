<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="publishModal" role="dialog">
      <div v-if="isNextPublishModal === false" class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-body">
            <p class="publish-heading">Publishing your website</p>
            <p class="content-part">
              Please note, after completing all the steps for publishing,
              your website will be live. Any changes after publishing will be made live.
            </p>
          </div>
          <div class="modal-footer">
            <!-- @click="$router.go(-1)" -->
            <button type="button" class="btn cancel" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn understand"
              :disabled="isUnderstandDisabled"
              v-on:click="understandData()"
            >I understand</button>
          </div>
          <div class="row invite-que-style mt-10 mb-10 p-0">
            <router-link
              class="width-style"
              v-if="failedTab.includes('Globalelement')"
              :to="{ name: 'global'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Global Elements</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Homepage')"
              :to="{ name: 'homepage'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Homepage</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Eligibility')"
              :to="{ name: 'eligibility'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Eligibility</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Agreement')"
              :to="{ name: 'agreement'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Agreement</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Registration')"
              :to="{ name: 'register'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Registration</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Select StudySite') && !failedTab.includes('Registration')"
              :to="{ name: 'register'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Registration</span>
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="isNextPublishModal === true" class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-body">
            <p class="publish-heading">Publishing changes</p>
            <p class="content-part">
             These saved changes will immediately be made live.
            </p>
          </div>
          <div class="modal-footer">
            <!-- @click="$router.go(-1)" -->
            <button type="button" class="btn cancel" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn understand"
              :disabled="isUnderstandDisabled"
              v-on:click="understandData()"
            >Continue</button>
          </div>
          <div class="row invite-que-style mt-10 mb-10 p-0">
            <router-link
              class="width-style"
              v-if="failedTab.includes('Globalelement')"
              :to="{ name: 'global'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Global Elements</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Homepage')"
              :to="{ name: 'homepage'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Homepage</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Eligibility')"
              :to="{ name: 'eligibility'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Eligibility</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Agreement')"
              :to="{ name: 'agreement'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Agreement</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Registration')"
              :to="{ name: 'register'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Registration</span>
            </router-link>
            <router-link
              class="width-style"
              v-if="failedTab.includes('Select StudySite') && !failedTab.includes('Registration')"
              :to="{ name: 'register'}"
              data-dismiss="modal"
            >
              <span v-on:click="resetFailedTab">Registration</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <mainHeader></mainHeader>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="has-sidemenu has-header">
      <ul class="nav-bar nav-test nav participant-nav-sec">
        <li class="nav-item">
          <a
            href="#/studies/18d5aa0b-1d5d-4ed8-958a-9183e5316f33/participants/list"
            class="nav-link active"
            target="_self"
          >Participant List</a>
        </li>
        <li class="nav-item">
          <a
            href="#/studies/18d5aa0b-1d5d-4ed8-958a-9183e5316f33/participants/edc-data-dashboard"
            class="nav-link"
            target="_self"
          >EDC Data Dashboard</a>
        </li>
        <li class="nav-item">
          <a href="#" target="_self" class="nav-link"></a>
          <a data-toggle="dropdown" class="dropdown-toggle color_4c8ce4"></a>
          <div class="dropdown-menu custom-popover fs-12">
            <div class="arrow"></div>
            <div>
              <div class="overflow">
                <div class="row p-5">
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                    <span>Admin</span>
                  </div>
                  <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9"></div>
                </div>
                <div class="row p-5">
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                    <span>Study Team</span>
                  </div>
                  <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9"></div>
                </div>
                <div class="row p-5">
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                    <span>Research Sites</span>
                  </div>
                  <div
                    class="col-lg-9 col-md-9 col-sm-9 col-xs-9"
                  >Sites that conduct your study. Includes all PI, Sub-I, and SC.</div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="container">
        <div class="head">Participant Web</div>
        <div class="viewSIte">
          <button v-on:click="viewTutorialStart()" class="btn-viewStart">View getting started</button>
        </div>
        <div class="global" @click="closeTutorial(false)" v-if="closeCarousel === true"></div>
        <div v-if="closeCarousel === true" class="container-carosel">
          <button v-on:click="closeTutorial(false)" class="btn-close-tutorial">
            CLOSE
            <b>X</b>
          </button>
          <button v-on:click="closeTutorial(false)" class="btn-skip-tutorial">Skip tutorial</button>
          <carousal @cauroselActive="caurosel" />
        </div>
        <div class="clearfix"></div>
        <div class="Rectangle-5">
          <div class="paeticipant-nav">
            <div class="row">
              <div class="col-md-9 p-0">
                <navBar v-if="isDetailPage" :routes="navBarRoutes" />
              </div>
              <div class="col-md-3 p-0 text-right">
                <button v-on:click="openPreviewView()" 
                :disabled="getIsPreviewDisableValue"
                class="preview-btn-web mr-22">
                  <i
                    v-if="getIsPreviewDisableValue===true"
                    class="fa fa-spinner fa-spin"
                    style="color:#4c8ce4"
                    aria-hidden="true"
                  ></i>
                  <span v-if="getIsPreviewDisableValue===false" class="pre-content">Preview</span>
                </button>
                <!-- <router-link to="/studies/:studyId/webpage"> -->
                <button
                  :class="[getIsPublishDisableValue ? 'publish-btn-web' : 'publish-btn-web' ]"
                  data-toggle="modal"
                  data-target="#publishModal"
                  v-on:click="resetFailedTab"
                  :disabled="getIsPublishDisableValue"
                >
                  <i
                    v-if="getIsPublishDisableValue===true"
                    class="fa fa-spinner fa-spin"
                    style="color:#fff"
                    aria-hidden="true"
                  ></i>
                  <span v-if="getIsPublishDisableValue===false" class="pub-content">Publish</span>
                </button>
                <!-- </router-link> -->
              </div>
            </div>
          </div>
          <router-view :studyData="studyData" :studyId="studyId" class="m-32"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import carousal from "../components/participantweb/carousal-component";
import mainHeader from "@/components/common/main-header";
import sideMenu from "@/components/common/side-menu";
import navBar from "@/components/common/nav-bar";
import axios from "axios";
import pulish from "../components/participantweb/publish-page";
import { version } from 'moment';
export default {
  name: "web-wrapper",
  components: {
    mainHeader,
    sideMenu,
    navBar,
    carousal,
    pulish,
  },
  data() {
    return {
      previewURL:"",
      previewVersion:0,
      previewStatus:"",
      isNextPublishModal: false,
      isUnderstandDisabled: false,
      closeCarousel: false,
      globalElements: "",
      studyData: {},
      failedTab: [],
      status: "",
      version: "",
      isEnabledPublish: false,
    };
  },

  computed: {
    ...mapGetters(["token", "user", "getIsPublishDisable","getIsPreviewDisable", "getPublishTab"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    userToken() {
      return this.token;
    },
    getIsPublishDisableValue() {
      return this.getIsPublishDisable;
    },
    getIsPreviewDisableValue() {
      return this.getIsPreviewDisable;
    },
    studyId() {
      return this.$route.params.studyId;
    },
    isDetailPage() {
      const noTabPages = [
        "global",
        "homepage",
        "eligibility",
        "agreement",
        "register",
        "publish",
      ];
      return noTabPages.includes(this.$route.name);
    },
    navBarRoutes() {
      const routes = [
        {
          label: "Global Elements",
          to: {
            name: "global",
            params: { studyId: this.studyId },
          },
        },
        {
          label: "Homepage",
          to: {
            name: "homepage",
            params: { studyId: this.studyId },
          },
        },
        {
          label: "Eligibility Screening",
          to: {
            name: "eligibility",
            params: { studyId: this.studyId },
          },
        },
        {
          label: "Agreement",
          to: {
            name: "agreement",
            params: { studyId: this.studyId },
          },
        },
        {
          label: "Registration",
          to: {
            name: "register",
            params: { studyId: this.studyId },
          },
        },
      ];
      if (this.isEnabledPublish || this.getPublishTab) {
        routes.push({
          label: "Publish Settings",
          to: {
            name: "publish",
            params: { studyId: this.studyId },
          },
        });
      }
      return routes;
    },
  },
  watch: {
    getIsPublishDisableValue(newValue, oldValue) {
      return newValue;
    },
    navBarRoutes(newValue, oldValue) {
      return newValue;
    },
  },
  mounted() {
    this.$store.dispatch("setIsPublishDisabled", false);
    this.$store.dispatch("setIsPreviewDisabled", false);
    this.getCarousel();
    this.$api
      .getStudyDataFact(this.studyId)
      .then((response) => {
        this.studyData = response.body;
        this.teleHealthConfigured = response.body.truClinicIntegration;
      })
      .catch((error) => {
        const { message = "Error while getting study data" } =
          (error && error.body) || {};
        this.$toastr.error(message);
      });
    this.getToggledFeatures();
    this.getLatestPublishedURL();
    this.getPublishVersion();
    this.getPreviewVersion();
  },
  methods: {
    async getPublishVersion() {
      await this.$api
        .getPublishVerson(this.$route.params.studyId)
        .then((response) => {
            this.version = response.data.data === "" ? 1 : response.data.data;
            this.$api
              .getParticipantWebPublishStatus(
                this.$route.params.studyId,
                this.version,
                this.user.id
              )
              .then((response) => {
                if (response.data) {
                  if (response.data.data.status) {
                    this.status = response.data.data.status;
                    if (
                      this.status === "In-Progress" ||
                      this.status === "IN-PROGRESS"
                    ) {
              
                        this.$store.dispatch("setIsPublishDisabled", true);
                        this.callCheckStatusApi();
                      
                    }
                  }
                }
              })
              .catch((error) => {
                console.error("error", error);
              });
        })
        .catch((err) => {
          (this.closeCarousel = true), console.log("err", err.statusCode);
          throw err;
        });
    },
     async getPreviewVersion() {
      await this.$api
              .getParticipantWebPublishStatus(
                this.$route.params.studyId,
                this.previewVersion,
                this.user.id
              )
              .then((response) => {
                if (response.data) {
                  if (response.data.data.status) {
                    this.status = response.data.data.status;
                    if (
                      this.status === "In-Progress" ||
                      this.status === "IN-PROGRESS"
                    ) {

                        this.$store.dispatch("setIsPreviewDisabled", true);
                        this.callCheckPreviewStatusApi();
                      
                    }
                  }
                }
              })
              .catch((error) => {
                console.error("error", error);
              });

    },
    
    resetFailedTab() {
      this.failedTab = [];
      this.isUnderstandDisabled = false;
    },

    async getLatestPublishedURL() {
      await this.$api
        .getPublishedURL(this.$route.params.studyId)
        .then((response) => {
          if (response.data) {
            if(response.data.data) {
              if (response.data.data.staticSiteURL) {
                if(response.data.data.staticSiteURL.length> 0) {
                  this.isEnabledPublish = true;
                  this.isNextPublishModal = true;
                }
              }
            }
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    timer(ms) {
      return new Promise((res) => setTimeout(res, ms));
    },
    async checkStatus() {
      await this.timer(10000);
      await this.$api
        .getParticipantWebPublishStatus(
          this.$route.params.studyId,
          this.version,
          this.user.id
        )
        .then((response) => {
          if (response.data) {
            if (response.data.data.status) {
              this.status = response.data.data.status;
              this.isUnderstandDisabled = true;
            }
            if (this.status === "SUCCESS") {
              this.$toastr.success("Your site is successfully published");
              this.status = "";
              this.isUnderstandDisabled = false;
              this.$store.dispatch(
                "setStaticURL",
                response.data.data.staticSiteURL
              );
              this.$store.dispatch("setIsPublishDisabled", false);
              this.$store.dispatch("setPublishTab", true);
              this.isNextPublishModal = true;
              this.$router.push({
                name: "publish",
                params: { url: response.data.data.staticSiteURL },
              });
              return;
            }
            if (this.status === "FAILED") {
              this.status = "";
              this.isUnderstandDisabled = false;
              this.$store.dispatch("setIsPublishDisabled", false);
              this.$toastr.error("Your site publishing failed");
            }
            if (this.status === "TIME-OUT") {
              this.status = "";
              this.isUnderstandDisabled = false;
              this.$store.dispatch("setIsPublishDisabled", false);
              this.$toastr.error("Timed out while publishing the site");
            }
          }
        })
        .catch((error) => {
          console.error("error", error);
        });
    },

    async callCheckStatusApi() {
      while (this.status === "In-Progress" || this.status === "IN-PROGRESS") {
        await this.checkStatus();
      }
    },



    async publishSite() {
      let data = {
        created_by: this.user.id,
         site_status : "publish"
      };
      await this.$api
        .postPublishTheSite(this.$route.params.studyId, data)
        .then((response) => {
          if (response.data) {
            if (response.data.status === "Error") {
              this.isUnderstandDisabled = false;
              this.$store.dispatch("setIsPublishDisabled", false);
              this.failedTab = response.data.data;
              this.$toastr.error(
                response.data && response.data.message
                  ? response.data && response.data.message
                  : "Not all required elements are set up yet. Please revise the following."
              );
            } else {
              if (response.data.message === "In-Progress") {
                this.$store.dispatch("setIsPublishDisabled", true);
                this.status = response.data.message;
                this.version = response.data.data.toString();
              }
              $("#publishModal").modal("hide");
              this.failedTab = [];
            }
          }
        })
        .catch((error) => {
          this.isUnderstandDisabled = false;
          this.$store.dispatch("setIsPublishDisabled", false);
          this.failedTab = error.data.data;
          this.$toastr.error(
            error.body && error.body.message
              ? error.body && error.body.message
              : "Note all required elements are set up yet. Please revise the following"
          );
        });
      await this.callCheckStatusApi();
    },
    
    getCarousel() {
      this.closeCarousel = this.$route.params.isCarousel;
    },
    viewTutorialStart() {
      this.closeCarousel = true;
    },
    understandData() {
      this.isUnderstandDisabled = true;
      this.publishSite();
    },
    async previewSite(){
          
      let data = {
        created_by: this.user.id,
        site_status : "preview"
      };
      await this.$api
        .postPreviewTheSite(this.$route.params.studyId, data)
        .then((response) => {
          if (response.data) {

              if (response.data.message === "In-Progress") {
                this.$store.dispatch("setIsPreviewDisabled", true);
                this.previewStatus = response.data.message;
              }

          }
        })
        .catch((error) => {
          this.$store.dispatch("setIsPreviewDisabled", false);
          this.$toastr.error(
            error.body && error.body.message
              ? error.body && error.body.message
              : "Preview Failed"
          );
        });
      await this.callCheckPreviewStatusApi();
    },
    async callCheckPreviewStatusApi(){
      while (this.previewStatus === "In-Progress" || this.previewStatus === "IN-PROGRESS") {
        await this.checkPreviewStatus();
      }
    },
    async checkPreviewStatus() {
      await this.timer(10000);
      await this.$api
        .getParticipantWebPublishStatus(
          this.$route.params.studyId,
          this.previewVersion,
          this.user.id
        )
        .then((response) => {
          if (response.data) {
            if (response.data.data.status) {
              this.previewStatus = response.data.data.status;
            }
            if (this.previewStatus === "SUCCESS") {
              this.$toastr.success("Preview is successfull");
              this.previewStatus = "";
              this.previewURL = response.data.data.staticSiteURL;  
              this.$store.dispatch("setIsPreviewDisabled", false);
              window.open(this.previewURL, '_blank');
              //let routeOpen= 'http://test1-public.styx.threadresearch.com'
              return;
            }
            if (this.previewStatus === "FAILED") {
              this.previewStatus = "";
              this.$store.dispatch("setIsPreviewDisabled", false);
              this.$toastr.error("Your site preview failed");
            }
            if (this.previewStatus === "TIME-OUT") {
              this.previewStatus = "";
              this.$store.dispatch("setIsPreviewDisabled", false);
              this.$toastr.error("Timed out while preview");
            }
          }
        })
        .catch((error) => {
          console.error("error", error);
        });
    },
    openPreviewView() {
      this.previewSite();
    },
    caurosel: function (data) {
      this.closeCarousel = data;
    },
    closeTutorial(val) {
      this.closeCarousel = val;
      this.$route.params.isCarousel = false;
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        (response) => {
          if (response.body) {
            this.toggleFeatures = response.body.studyFeatures;
            this.toggleFeatures.forEach((feature) => {
              if (feature.featureKey === "EDC") {
                this.edcEnabled = feature.enabled;
              }
              if (feature.featureKey === "TruClinic") {
                this.telehealthEnabled = feature.enabled;
              }
            });
          }
        },
        (error) => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
        }
      );
    },
  },
};
</script>
<style scoped lang="scss">
// Pop up start
.width-style {
  width: 100%;
  text-align: center;
  padding: 2px;
  line-height: 24px;
  font-size: 12px;
  color: #007bff !important;
}
.modal-dialog {
  width: 562px;
  height: 260px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.publish-heading {
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #666669;
  padding: 16px;
  text-align: center;
}
.modal-content {
  box-shadow: unset !important;
}
.content-part {
  width: 437px;
  position: relative;
  left: 10px;
  line-height: 1.28;
  text-align: center;
  font-size: 16px;
  letter-spacing: normal;
  color: #666669;
}
.understand {
  width: 150px;
  height: 36px;
  font-size: 14px;
  background-color: #4c8ce4;
  color: white;
  border-radius: 25px;
}
.cancel {
  width: 150px;
  font-size: 14px;
  height: 36px;
  background-color: #e0e0e0;
  color: #000;
  border-radius: 25px;
}
.modal-footer {
  position: relative;
  right: 86px;
  bottom: 18px;
}

// pop up end

.nav-test {
  color: #a5b2bb;
}

.nav-bar .nav-link.active {
  border-bottom: none !important;
}

.nav-link.active {
  color: #a5b2bb !important;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: none !important;
}
.head {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
  float: left;
  display: inline-block;
}
.participant-heading {
  height: 22px;
  margin-top: 31px !important;
  margin-left: 64px;
  font-family: RobotoRegular;
  font-size: 14px;
  letter-spacing: normal;
  position: absolute;
}
.Rectangle-5 {
  padding-top: 0px;
  width: auto;
  height: auto;
  margin-top: 10px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.paeticipant-nav {
  border-bottom: 1px solid #d4dfe4;
}
.publish-btn-web {
  margin-top: 20px;
  margin-right: 22px;
  width: 77px;
  height: 30px;
  border-radius: 3px;
  border: solid 2px #4c8ce4;
  background-color: #4c8ce4;
  margin-top: 20px;
  cursor: pointer;
}

.publish-btn-web-disabled {
  margin-top: 20px;
  margin-right: 22px;
  width: 77px;
  height: 30px;
  border-radius: 3px;
  border: solid 2px #4c8ce4;
  background-color: #4c8ce4;
  margin-top: 20px;
  opacity: 0.4;
  cursor: not-allowed;
}

.pub-content {
  width: 77px;
  height: 16px;
  display: block;
  margin-left: -7px;
  font-family: RobotoRegular;
  font-size: 12px;
  line-height: 1.33;
  color: white;
}
.pre-content {
  width: 75px;
  height: 16px;
  display: block;
  margin-left: -7px;
  font-family: RobotoRegular;
  font-size: 12px;
  line-height: 1.33;
  color: #4c8ce4;
}
.preview-btn-web {
  cursor: pointer;
  width: 75px;
  height: 30px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 2px #d3dfe4;
  margin-top: 20px;
}
.viewSIte {
  float: right;
  margin-top: 8px;
  color: #4c8ce4;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: 500;
}
.btn-viewStart {
  background-color: transparent;
  color: #4c8ce4;
  font-family: RobotoRegular;
  font-size: 12px;
  padding-right: 0px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
.global {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0.2;
  left: 0;
  z-index: 1000;
  background-color: #000;
}
.container-carosel {
  margin-left: -129px;
  margin-top: -451px !important;
  position: absolute !important;
  top: 555px !important;
}
.btn-close-tutorial {
  position: relative;
  right: -130px;
  border: none;
  background-color: transparent;
  height: 12px;
  font-family: RobotoRegular;
  font-size: 10px;
  font-weight: bold;
  margin-top: -10px;
  color: #fff;
  z-index: 1002;
  margin-left: 919px;
  cursor: pointer;
}
.btn-close-tutorial b {
  font-size: 10px;
  margin-left: 1px;
  font-family: RobotoBold;
}
.btn-skip-tutorial {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  color: #4c8ce3;
  background-color: transparent;
  border: none;
  margin-top: 568px;
  position: absolute;
  z-index: 1002;
  cursor: pointer;
  width: 105px;
}
.participant-nav-sec {
  visibility: hidden;
}
@media (min-width: 1024px) and (max-width: 1200px) {
  .container-carosel {
    margin-left: -362px;
    margin-top: -477px !important;
    position: absolute !important;
    top: 548px !important;
  }
}
</style>