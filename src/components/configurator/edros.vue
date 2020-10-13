<template>
  <div class="container mb-100">
    <div class="edros">
      <div class="mt-100 container-style">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="pl-20 pr-20 pb-20">
          <div class="pt-10">
            <div v-if="!selectedeDRO">
              <h3>What is an e-DRO ?</h3>
              <p class="m-0 fs-14">
                It stands for Electronic Device Recorded Outcomes. Think of E-DRO like an objective E-PRO. Electronic Patient
                Reported Outcomes (ePRO) are important but subjective. eDROs use the sensors within the mobile phone itself
                (accelerometer, gyroscope, microphone, camera etc.) to generate exploratory data around things like patient
                fitness, dexterity, cognitive skills and even memory. Leveraging Active Tasks from Apple's robust and growing
                ResearchKit community we are able to record new types of remote patient data. eDROs have been implemented
                into many studies but should not be considered a validated instrument.
              </p>
              <h3>Select your Electronic Device Reporting Outcomes (eDRO)</h3>
            </div>
            <div v-if="selectedeDRO">
              <p class="m-0 fs-14">Select eDROs you would like to add to your study.</p>
              <h3>eDRO Library</h3>
            </div>
            <div class="row pb-10">
              <div class="col-lg-6 col-md-5 col-sm-4 col-xs-12 p-0 pr-10">
                <input
                  type="text"
                  class="form-control mb-10 br-25 pl-30 search_input"
                  placeholder="Search..."
                  v-model="searchKey"
                  @keyup.enter="searchEdros(searchKey)"
                />
                <span class="search-icon">
                  <i class="fa fa-search"></i>
                </span>
              </div>
              <div
                class="col-xs-12 col-sm-4 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3 p-0 mb-10 pr-10"
              >
                <!--<select class="form-control br-25 color_959fa4" v-model="filter">
                  <option disabled value="default">Filters</option>
                  <option>Name</option>
                  <option>Acronym</option>
                  <option>Area</option>
                  <option>Languages</option>
                </select>-->
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-0 pr-10" style="float:right;">
                <select
                  class="form-control br-25 color_959fa4"
                  v-model="sort"
                  v-on:change="sortEdros(sort)"
                >
                  <option disabled value="default">Sort</option>
                  <option value="asc">A to Z</option>
                  <option value="desc">Z to A</option>
                </select>
              </div>
            </div>
          </div>
          <div class="item">
            <div>  
              <div class="row equal-height">
                <div v-for="(activity, index) in activities" class="col-xs-12 col-sm-6 col-md-4 col-lg-2 p-0 pr-10 pb-10">
                  <div class="thumbnail pt-10" v-if="!activity.selected">
                    <!--<p class="" v-html="activity.icon"></p>-->
                    <div class="pb-10">
                        <img :src="activity.icon" />
                    </div>
                    <p class="fs-12 fw-bold mb-0">{{activity.title}}</p>
                    <p class="fs-12 fw-normal">{{activity.shortDescription}}</p>
                    <p
                      class="icon-style text-left"
                      v-on:click="openEdro(activity)"
                      v-html="view_icon"
                      v-if="!activity.comingSoon"
                    ></p>
                    <p class="coming_soon" v-if="activity.comingSoon">Coming Soon</p>
                  </div>
                  <div
                    class="thumbnail-selected pt-10"
                    v-if="activity.selected"
                    v-on:click="activityDeselect(activity)"
                  >
                    <p class v-html="selected_icon"></p>
                    <p class="fs-12 fw-bold color-white mb-0">{{activity.title}}</p>
                    <p class="fs-12 color-white">{{activity.shortDescription}}</p>
                    <p
                      class="icon-style-selected text-left"
                      v-on:click="openEdro(activity)"
                      v-html="view_icon"
                    ></p>
                  </div>
                </div>
              </div>
              <div id="edroModal" class="modal fade" role="dialog">
                <div class="modal-dialog modal_custom" v-if="selectedEdro">
                  <div class="modal-content">
                    <div class="close-modal">
                      <button type="button" class="close" v-on:click="closeModal()">&times;</button>
                    </div>
                    <div class="row">
                      <div class="color_blue fs-24">{{selectedEdro.title}}</div>
                      <div class="col-lg-8 colg-md-7 col-xs-12 col-sm-7 p-0 pr-50">
                        <p class="color_blue pt-10 cursor_pointer">
                          <a v-on:click="licenceInfo = false">eDRO details</a>
                          <a
                            v-on:click="licenceInfo = true"
                            v-if="selectedEdro.key !=='PefManeuver' && selectedEdro.key !=='MirSpirometer' && selectedEdro.key !=='VisualAcuityExam' && selectedEdro.key !=='ContrastAcuityExam' && selectedEdro.key !=='FacialVideoAnalysis'"
                          >| License information</a>
                        </p>
                        <div
                          class="fs-12 pb-5"
                          v-if="licenceInfo"
                          v-html="selectedEdro.licenceInfo"
                        ></div>
                        <div v-if="!licenceInfo">
                          <div class="fw-bold fs-14">Category</div>
                          <p class="fs-12 pb-5">{{selectedEdro.category}}</p>
                          <div class="fw-bold fs-14">Description</div>
                          <p class="fs-12 pb-5">{{selectedEdro.description}}</p>
                          <div
                            class="fw-bold fs-14"
                            v-if="selectedEdro.key !== 'FacialVideoAnalysis'"
                          >Default configuration settings</div>
                          <div v-for="setting in selectedEdro.configurationSettings">
                            <p
                              class="fs-12 mt-0 mb-0"
                              v-if="setting.name"
                            >{{setting.name}}: {{setting.details}}</p>
                            <li class="fs-12" v-if="!setting.name">{{setting.details}}</li>
                          </div>
                          <div
                            class="pt-8"
                            v-if="selectedEdro.key !=='VisualAcuityExam' && selectedEdro.key !=='ContrastAcuityExam' && selectedEdro.key !=='FacialVideoAnalysis'"
                          >
                            <span class="btn-style color-white">Custom configuration coming soon!</span>
                          </div>
                          <div
                            class="fw-bold fs-14 pt-20"
                            v-if="selectedEdro.key !== 'FacialVideoAnalysis'"
                          >Data collected</div>
                          <ul class="m-0 list-style pb-10">
                            <li class="fs-12" v-for="data in selectedEdro.dataCollected">{{data}}</li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-5 col-xs-12 col-sm-5 pr-40 pt-20">
                        <div
                          id="edroCarousel"
                          class="text-center carousel-style"
                          :class="{'carousel': selectedEdro.screenshots, 'slide': selectedEdro.screenshots}"
                          data-ride="carousel"
                        >
                          <!-- edited class because i found it in google to solve screenshot problem.  -->
                          <!-- Indicators -->
                          <ol class="carousel-indicators style-indicators pointer_events_none">
                            <!--<li data-target="#edroCarousel" data-slide-to="index" ></li>-->
                            <li
                              data-target="#edroCarousel"
                              :data-slide-to="index"
                              :class="{'active': index == 0}"
                              v-for="(screen,index) in selectedEdro.screenshots"
                            ></li>
                          </ol>
                          <!-- Wrapper for slides -->
                          <div class="carousel-inner" role="listbox">
                            <div
                              class="carousel-item item"
                              v-for="(screen,index) in selectedEdro.screenshots"
                              :class="{'active': index == 0}"
                            >
                              <img :src="screen" />
                            </div>
                          </div>
                          <!-- Left and right controls -->
                        </div>
                        <a
                          class="carousel-control-prev left carousel-control style-left"
                          href="#edroCarousel"
                          role="button"
                          data-slide="prev"
                        >
                          <span class="fa fa-caret-left" aria-hidden="true"></span>
                          <span class="sr-only">Previous</span>
                        </a>
                        <a
                          class="carousel-control-next right carousel-control style-right color_blue"
                          href="#edroCarousel"
                          role="button"
                          data-slide="next"
                        >
                          <span class="fa fa-caret-right" aria-hidden="true"></span>
                          <span class="sr-only">Next</span>
                        </a>
                      </div>
                      <div class="row clearfix p-20 text-center">
                        <div
                          class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-12 col-xs-12"
                        >
                          <button
                            type="button"
                            class="btn btn-md btn-block btn-info br-25 mt-10"
                            v-on:click="addEdros(selectedEdro)"
                          >Add</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-10">
              <span class="back_link" v-on:click="goBack()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
              </span>
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
                <button
                  class="btn br-25 continue-btn mr-10"
                  v-on:click="nextClick()"
                >Save and Continue</button>
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
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "edros",
  data() {
    return {
      study: {
        name: "",
        appName: ""
      },
      sort: "default",
      filter: "default",
      searchKey: "",
      studyId: null,
      selected_icon:
        '<i class="fa fa-check-circle color-white" aria-hidden="true"></i>',
      view_icon: '<i class="fa fa-eye" aria-hidden="true"></i>',
      activities: [],
      selectedeDRO: false,
      modalData: "",
      selectedEdros: [],
      selectedEdro: {},
      studyData: null,
      branding: null,
      licenses: "",
      licenceInfo: false,
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 200;
    }, 1500);
    this.getBrandingDetails();
  },
  methods: {
    generateLicenseInfo() {
      if (this.studyData && this.branding) {
        this.licenses = `This <span id="appName">${
          this.branding.appName
        }</span> ("App") is provided by <span id="clientName">${
          this.studyData.clientName
        }</span> ("Subscriber") under permission granted by the Thread Master Software Agreement ("SaaS") entered into by Subscriber and Thread granting Subscriber the right to use Thread Services (the "Services") to create the App. All Intellectual Property of Thread used in the use and development of the App belongs to Thread and its other providers as indicated in the SaaS. Any rights you obtain in the App are limited to the right to use the App in connection with the Services. You have no rights other that use of the Services in connection with the App and no rights to view or use the underlying source code for the services. <br/><br/> As Thread is not the creator or administrator of the App, Thread provides the App in an "AS IS" condition without warranty. <br/><br/> THREAD MAKES NO, AND HEREBY DISCLAIMS ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, WITH RESPECT TO THE SERVICES PROVIDED, THE APP OR THE AVAILABILITY, FUNCTIONALITY, PERFORMANCE OR RESULTS OF USE OF THE SERVICES. THREAD DISCLAIMS ANY WARRANTY THAT THE SERVICES PROVIDED BY THREAD, OR THE OPERATION THEREOF ARE, OR WILL BE, ACCURATE, ERROR­-FREE OR UNINTERRUPTED. THREAD MAKES NO, AND HEREBY DISCLAIMS ANY, IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION, ANY IMPLIED WARRANTY OF NON-INFRINGEMENT, MERCHANTABILITY, OF FITNESS FOR A PARTICULAR PURPOSE OR ARISING BY USAGE OF TRADE, COURSE OF DEALING OR COURSE OF PERFORMANCE.<br/><br/> THREAD HAS NO LIABILITY WITH RESPECT TO THE SERVICES, OR ITS OTHER OBLIGATIONS UNDER THIS AGREEMENT OR OTHERWISE FOR CONSEQUENTIAL, EXEMPLARY, SPECIAL, INCIDENTAL, OR PUNITIVE DAMAGES (INCLUDING WITHOUT LIMITATION LOSS OF PROFITS AND THE COST OF COVER EVEN IF THREAD HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.<br/><br/> <span id="ios">Copyright (c) 2015 - ${new Date().getFullYear()}, Apple Inc. All rights reserved.<br/><br/> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</span>`;
      }
    },
    getBrandingDetails() {
      this.$api.getBrandingDetailsFact(this.studyId).then(
        response => {
          this.branding = response.body;
          this.getStudyDetails();
        },
        error => {
          toastr.error(error.message);
        }
      );
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
          this.generateLicenseInfo();
          this.getActivitiesList();
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
    getActivitiesList() {
      this.$api.getActivities().then(
        response => {
          let activities = response.body;
          this.activities = _.filter(activities, o => !o.comingSoon);
          _.forEach(this.activities, activity => {
            activity.selected = false; // eslint-disable-line
          });
          this.$api.getSelectedActivitesFact(this.studyId).then(
            response => {
              if (response.body != "") {
                const selectedActivities = response.body;
                this.selectedEdros = response.body;
                if (selectedActivities.length > 0) {
                  _.forEach(selectedActivities, activity => {
                    const index = _.findIndex(this.activities, [
                      "key",
                      activity.key
                    ]);
                    if(index !== -1) {
                    this.activities[index].selected = true;
                    }
                  });
                }
                this.clonedObj = _.cloneDeep(this.activities);
              }
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while getting the selected activities"
              );
            }
          );
        },
        error => {
          toastr.error(
            error.body ? error.body.message : "Error while getting activities"
          );
        }
      );
    },
    sortEdros(sort) {
      if (sort === "asc") {
        this.activities.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        this.activities.sort((a, b) => b.title.localeCompare(a.title));
      }
    },
    goBack() {
      window.history.back();
    },
    openEdro(activity) {
      this.selectedEdro = activity;
      this.licenceInfo = false;
      window.$("#edroModal").modal("show");
      window.$("#edroCarousel").carousel(0);
      window.$("#edroCarousel").carousel({ interval: 1000 });
      this.$forceUpdate();
    },
    closeModal() {
      this.selectedEdro = {};
      window.$("#edroModal").modal("hide");
      this.$forceUpdate();
    },

    searchEdros(searchKey) {
      searchKey = searchKey.toLowerCase(); // eslint-disable-line
      if (searchKey !== "") {
        this.searchActivities = _.filter(
          this.activities,
          o =>
            o.title.toLowerCase().indexOf(searchKey) >= 0 ||
            o.shortDescription.toLowerCase().indexOf(searchKey) >= 0
        ); // eslint-disable-line
        this.activities = this.searchActivities;
      } else {
        this.activities = this.clonedObj;
      }
    },
    activityDeselect(activity) {
      let activityIndex = _.findIndex(this.activities, ["key", activity.key]);
      this.activities[activityIndex].selected = false;
      activityIndex = _.findIndex(this.selectedEdros, ["key", activity.key]);
      this.selectedEdros.splice(activityIndex, 1);
    },
    addEdros(selectedEdro) {
      const activityIndex = _.findIndex(this.activities, [
        "key",
        selectedEdro.key
      ]);
      if (activityIndex >= 0) {
        this.activities[activityIndex].selected = true;
        this.selectedeDRO = true;
      }
      this.selectedEdros.push(selectedEdro);
      this.closeModal();
    },
    nextClick() {
      // const selectedActivities =
      // _.filter(this.activities, (o) => { return (o.selected); });  // eslint-disable-line
      if (this.selectedEdros.length > 0) {
        this.$api
          .postSelectedActivitesFact(this.studyId, {
            activitiesList: this.selectedEdros
          })
          .then(
            () => {
              this.$router.push({
                name: "edit-edro",
                params: { studyId: this.studyId }
              }); // eslint-disable-line
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while sending the selected activities"
              );
            }
          );
      } else {
        toastr.error("Please select activities");
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



<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  margin-bottom: 10px;
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

// Carusel

.carousel-inner {
  width: 100%;
}
.carousel-inner > .item img {
  max-width: 100%;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  z-index: 15;
  width: 60%;
  padding-left: 0;
  margin-left: -30%;
  text-align: center;
  list-style: none;
}
.carousel-indicators li {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 1px;
  text-indent: -999px;
  cursor: pointer;
  background-color: #000 \9;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid #fff;
  border-radius: 10px;
}
.carousel-indicators .active {
  width: 12px;
  height: 12px;
  margin: 0;
  background-color: #fff;
}

.carousel-control {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 15%;
  font-size: 20px;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0);
  filter: alpha(opacity=50);
  opacity: 0.5;
}
.carousel-control.left {
  background-image: -webkit-linear-gradient(
    left,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.0001) 100%
  );
  background-image: -o-linear-gradient(
    left,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.0001) 100%
  );
  background-image: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(0, 0, 0, 0.5)),
    to(rgba(0, 0, 0, 0.0001))
  );
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.0001) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#80000000',
      endColorstr='#00000000',
      GradientType=1
    );
  background-repeat: repeat-x;
}
.carousel-control.right {
  right: 0;
  left: auto;
  background-image: -webkit-linear-gradient(
    left,
    rgba(0, 0, 0, 0.0001) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  background-image: -o-linear-gradient(
    left,
    rgba(0, 0, 0, 0.0001) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  background-image: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(0, 0, 0, 0.0001)),
    to(rgba(0, 0, 0, 0.5))
  );
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.0001) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#00000000',
      endColorstr='#80000000',
      GradientType=1
    );
  background-repeat: repeat-x;
}
.carousel-control:hover,
.carousel-control:focus {
  color: #fff;
  text-decoration: none;
  filter: alpha(opacity=90);
  outline: 0;
  opacity: 0.9;
}
.carousel-control .icon-prev,
.carousel-control .icon-next {
  position: absolute;
  top: 50%;
  z-index: 5;
  display: inline-block;
  margin-top: -10px;
}
.carousel-control .icon-prev {
  left: 50%;
  margin-left: -10px;
}
.carousel-control .icon-next {
  right: 50%;
  margin-right: -10px;
}
.carousel-control .icon-prev,
.carousel-control .icon-next {
  width: 20px;
  height: 20px;
  font-family: serif;
  line-height: 1;
}
.carousel-control .icon-prev:before {
  content: "\2039";
}
.carousel-control .icon-next:before {
  content: "\203a";
}

// @media all and (transform-3d), (-webkit-transform-3d) {
//   .carousel-inner > .item {
//     -webkit-transition: -webkit-transform 0.6s ease-in-out;
//     -o-transition: -o-transform 0.6s ease-in-out;
//     transition: transform 0.6s ease-in-out;

//     -webkit-backface-visibility: hidden;
//     backface-visibility: hidden;
//     -webkit-perspective: 1000px;
//     perspective: 1000px;
//   }
//   .carousel-inner > .item.next,
//   .carousel-inner > .item.active.right {
//     left: 0;
//     -webkit-transform: translate3d(100%, 0, 0);
//     transform: translate3d(100%, 0, 0);
//   }
//   .carousel-inner > .item.prev,
//   .carousel-inner > .item.active.left {
//     left: 0;
//     -webkit-transform: translate3d(-100%, 0, 0);
//     transform: translate3d(-100%, 0, 0);
//   }
//   .carousel-inner > .item.next.left,
//   .carousel-inner > .item.prev.right,
//   .carousel-inner > .item.active {
//     left: 0;
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//   }
// }
// .carousel-inner > .active,
// .carousel-inner > .next,
// .carousel-inner > .prev {
//   display: block;
// }
// .carousel-inner > .active {
//   left: 0;
// }
// .carousel-inner > .next,
// .carousel-inner > .prev {
//   position: absolute;
//   top: 0;
//   width: 100%;
// }
// .carousel-inner > .next {
//   left: 100%;
// }
// .carousel-inner > .prev {
//   left: -100%;
// }
// .carousel-inner > .next.left,
// .carousel-inner > .prev.right {
//   left: 0;
// }
// .carousel-inner > .active.left {
//   left: -100%;
// }
// .carousel-inner > .active.right {
//   left: 100%;
// }
//
// .carousel-caption {
//   position: absolute;
//   right: 15%;
//   bottom: 20px;
//   left: 15%;
//   z-index: 10;
//   padding-top: 20px;
//   padding-bottom: 20px;
//   color: #fff;
//   text-align: center;
//   text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
// }
// .carousel-caption .btn {
//   text-shadow: none;
// }
@media screen and (min-width: 768px) {
  .carousel-control .icon-prev,
  .carousel-control .icon-next {
    width: 30px;
    height: 30px;
    margin-top: -10px;
    font-size: 30px;
  }
  .carousel-control .icon-prev {
    margin-left: -10px;
  }
  .carousel-control .icon-next {
    margin-right: -10px;
  }
  .carousel-caption {
    right: 20%;
    left: 20%;
    padding-bottom: 30px;
  }
  .carousel-indicators {
    bottom: 20px;
  }
}
// End carusel

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
  .col-lg-offset-3 {
    margin-left: 25%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

button {
  cursor: pointer;
  border: none !important;
  outline: 0px solid !important;
}

button:focus {
  outline: 0px solid transparent;
}

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.disable-arrow {
  color: grey !important;
  pointer-events: none !important;
}

.thumbnail {
  font-size: 40px;
  text-align: center;
  min-height: 200px;
  height: 100%;
  position: relative;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.06);
  border: solid 1px #d3dfe4;
  width: 100%;
  padding: 4px;
  margin: auto;
}

.thumbnail-selected {
  font-size: 40px;
  text-align: center;
  min-height: 200px;
  height: 100%;
  position: relative;
  border-radius: 4px;
  background-color: #2ecc71;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.06);
  width: 100%;
  /* max-width: 180px; */
  margin: auto;
  z-index: 99;
  .icon-style-selected {
    pointer-events: none;
  }
}

.icon-style {
  font-size: 14px !important;
  position: absolute;
  bottom: 0px;
  background: #e7eef2 !important;
  border-radius: 50% !important;
  width: 26px !important;
  padding: 2px 6px;
  left: 8px;
  cursor: pointer;
}
.coming_soon {
  font-size: 12px;
  position: absolute;
  bottom: 0px;
  color: #1f95f2;
}

.icon-style-selected {
  font-size: 13px !important;
  position: absolute;
  bottom: 0px;
  background: #1cb05b !important;
  border-radius: 47% !important;
  width: 26px !important;
  padding: 3px 7px;
  left: 10px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 7px;
}

.search_input {
  border: 1px solid #eee !important;
  background-color: #f5f8fa;
  border: none;
  box-shadow: none;
}

.close-modal {
  right: 13px;
  position: absolute;
  top: 4px;
  button {
    font-size: 32px;
  }
}
.modal_title {
  font-size: 24px;
}
.left-arrow {
  left: 5px;
  position: absolute;
  top: 13px;
}
.modal_custom {
  margin-top: 50px auto;
  max-width: inherit;

  .modal-content {
    padding: 20px;
  }
}

.modal {
  .carousel-style {
    border: 1px solid #888;
    border-radius: 2px;
    width: 100%;
    margin: auto;
    max-width: 200px;
  }
  .style-indicators {
    bottom: -40px;
  }
  .style-right {
    background: transparent !important;
    right: 0px;
    opacity: 1;
    color: #1f95f2 !important;
  }
  .style-left {
    background: transparent !important;
    left: -25px;
    opacity: 1;
    color: #1f95f2 !important;
  }
  .selectedtext {
    color: white !important;
  }
  .btncolor {
    background-color: #1f95f2 !important;
  }
  .btn-style {
    background: #7478e6;
    outline: #1f95f2 !important;
    border-radius: 25px;
    font-size: 12px;
    padding: 4px 15px;
    margin-bottom: 15px;
  }
  .btn-bgcolor {
    background-color: #fff;
  }
  .carousel-indicators li {
    border: 1px solid #8fc5dc;
    width: 9px;
    height: 9px;
    margin: 1px 3px;
  }
  .carousel-indicators .active {
    background-color: #1f95f2;
    width: 13px;
    height: 13px;
    position: relative;
    top: -2px;
  }

  .style-gly {
    top: 150px;
  }

  .list-style {
    padding: 0px 15px;
  }
  .get-style {
    background-color: white !important;
    border: 1px solid #01b7fe !important;
    color: #01b7fe !important;
  }
}

@media (max-width: 575px) {
  .modal_custom {
    width: 80%;
  }
}
@media (min-width: 576px) and (max-width: 767px) {
  .modal_custom {
    width: 80%;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .modal_custom {
    width: 80%;
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .modal_custom {
    width: 60%;
  }
}
@media (min-width: 1200px) {
  .modal_custom {
    width: 60%;
  }
}
</style>