<template>
  <div class="container mb-100">
    <div class="edros">
      <div class="mt-100 container-style">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class>
            <div
              class="fs-14 color_666669"
            >Dashboards provide your participants with the ability to see their trends in their eDRO performance, adherence to the tasks, scale-based survey answers, and various health data. Below are the dashboards available for your participants.</div>
            <div
              class="pt-10 fs-14 color_666669"
            >Certain dashboards below will show your participants the results of data they have provided such as eDRO, a survey question response, etc.</div>
            <h3>Your dashboard options</h3>
            <div
              class="card"
              v-for="activity in selectedActivities"
              v-if="selectedActivities && selectedActivities.length > 0"
            >
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0">
                  <img :src="activity.icon" class="activity_icon" />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0 text-right">
                  <label class="switch">
                    <input
                      type="checkbox"
                      v-model="activity.showInDashboard"
                      v-on:change="saveDashboardActivity(activity)"
                    />
                    <div class="slider round"></div>
                  </label>
                </div>
              </div>
              <div class="row pt-10">
                <div class="fs-14 fw-500">{{activity.title}}</div>
                <div class="fs-12 pt-5 color_666669">{{activity.description}}</div>
                <div>
                  <span
                    class="preview_link"
                    v-on:click="showPreview(activity)"
                    :class="{'disabled_activity': (!activity.graphs || activity.graphs.length === 0)}"
                  >
                    <span v-if="selectedActivity.key !== activity.key">Show Preview</span>
                    <span v-if="selectedActivity.key === activity.key">Hide Preview</span>
                  </span>
                </div>
              </div>
              <div
                class="pt-20"
                v-if="activity.graphs && activity.graphs.length > 0 && selectedActivity.key === activity.key"
              >
                <span v-for="graph in activity.graphs">
                  <img :src="graph" alt />
                </span>
              </div>
            </div>
            <div
              v-if="!selectedActivities || selectedActivities.length === 0"
            >No activities selected</div>

            <div class v-for="question in scaleQuestions" v-if="scaleQuestions.length > 0">
              <div class="card" v-if="selectedScaleQuestion.id !== question.id">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0">
                    <img src="static/img/icn-survey.svg" alt class="activity_icon" />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0 text-right">
                    <button
                      class="btn btn-default color_blue br-2 mr-10"
                      v-on:click="editScaleQuestion(question)"
                      v-if="question.showInDashboard"
                    >Edit</button>
                    <label class="switch">
                      <input
                        type="checkbox"
                        v-model="question.showInDashboard"
                        v-on:change="saveDashboardActivity(question)"
                      />
                      <div class="slider round"></div>
                    </label>
                  </div>
                </div>
                <div class="row pt-10">
                  <div class="fs-14 fw-500">
                    {{question.body}}
                    <span v-if="question.surveyName">from {{question.surveyName}}</span>
                  </div>
                  <div
                    class="fs-12 pt-5 color_666669"
                  >This graph displays your particiapnt’s answer to a scale question within a survey.</div>
                  <div>
                    <span
                      class="preview_link"
                      v-on:click="showPreview(question)"
                      :class="{'disabled_activity': (!question.graphs || question.graphs.length === 0)}"
                    >
                      <span v-if="selectedActivity.key !== question.key">Show Preview</span>
                      <span v-if="selectedActivity.key === question.key">Hide Preview</span>
                    </span>
                  </div>
                </div>
                <div
                  class="pt-20"
                  v-if="question.graphs && question.graphs.length > 0 && selectedActivity.key === question.key"
                >
                  <span v-for="graph in question.graphs">
                    <img :src="graph" alt />
                  </span>
                </div>
              </div>
              <div class="card" v-if="selectedScaleQuestion.id === question.id">
                <div>
                  {{selectedScaleQuestion.body}}
                  <span
                    v-if="selectedScaleQuestion.surveyName"
                  >from {{selectedScaleQuestion.surveyName}}</span>
                </div>
                <div class="color_666669 fs-12 pt-5">Dashboard title</div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter title"
                  v-model="selectedScaleQuestion.dashboardTitle"
                />
                <div class="color_666669 fs-12 pt-5">Dashboard details (participant facing)</div>
                <textarea
                  class="form-control"
                  name
                  rows="4"
                  placeholder="Enter additional details"
                  v-model="selectedScaleQuestion.dashboardDetails"
                ></textarea>
                <div class="row pt-20">
                  <div class="col-lg-offset-8 col-lg-4 text-right p-0">
                    <button
                      class="btn btn-link br-25"
                      v-on:click="cancelScaleQuestion(selectedScaleQuestion)"
                    >Cancel</button>
                    <button
                      class="btn btn-success save_btn width_100px br-25"
                      v-on:click="saveDashboardActivity(selectedScaleQuestion, 'scale')"
                    >Save</button>
                  </div>
                </div>
              </div>
            </div>
            <!--<div v-if="scaleQuestions.length === 0">No activities selected</div>-->

            <div class="pt-10">
              <span class="back_link" v-on:click="goBack()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
              </span>
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
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";
import edroData from "../../data/edros.json";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "participant-dashboards",
  data() {
    return {
      studyId: null,
      activities: edroData,
      selectedActivities: [],
      scaleQuestions: [],
      selectedActivity: { key: null },
      selectedScaleQuestion: { id: null },
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
      scrollableSection.scrollLeft += 350;
    }, 3000);
    // this.getSlectedActivities();
    this.getDashboardActivities();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    getDashboardActivities() {
      this.$api.getDashboardActivitiesFact(this.studyId).then(
        response => {
          
          this.selectedActivities = _.filter(response.body.activities, function(a){
            return a.key != "SkinHealthActivity";
          });
          
          this.scaleQuestions = response.body.scaleQuestions;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the dashboard activities"
          );
        }
      );
    },
    getSlectedActivities() {
      this.$api.getSelectedActivitesFact(this.studyId).then(
        response => {
          this.selectedActivities = _.uniqBy(response.body, "key");
          _.forEach(this.selectedActivities, (activity, key) => {
            const index = _.findIndex(edroData, ["key", activity.key]);
            this.selectedActivities[key].icon = edroData[index].icon;
          });
          this.activities = response.body;
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
    showPreview(activity) {
      if (this.selectedActivity.key === activity.key) {
        this.selectedActivity = { key: null };
      } else {
        this.selectedActivity = activity;
      }
    },
    editScaleQuestion(question) {
      this.selectedScaleQuestion = _.cloneDeep(question);
    },
    saveDashboardActivity(question, type) {
      if (
        type === "scale" &&
        (!question.dashboardTitle || !question.dashboardDetails)
      ) {
        toastr.error("Dashboard title and details are required.");
      } else {
        this.$api
          .updateDashboardActivityFact(
            this.studyId,
            question.dashboardId,
            question
          )
          .then(
            () => {
              if (question.dashboardType === "survey") {
                const questionIndex = _.findIndex(this.scaleQuestions, [
                  "id",
                  question.id
                ]);
                this.scaleQuestions.splice(questionIndex, 1, question);
                this.cancelScaleQuestion();
              } else if (question.dashboardType === "survey") {
                this.cancelScaleQuestion();
              }
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while updating the dashboard activities"
              );
            }
          );
      }
    },
    cancelScaleQuestion() {
      this.selectedScaleQuestion = { id: null };
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
  margin: 20px 0 10px;
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
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
  /*height: 100px;*/
  padding: 15px;
  margin: 20px 0;
}

.preview_link {
  padding: 10px 0 0;
  display: inline-block;
  color: #1f95f2;
  font-size: 14px;
  cursor: pointer;
}

.disabled_activity {
  pointer-events: none;
  span {
    color: #aaa;
  }
}
.form-control {
  border-radius: 2px;
}
.activity_icon {
  width: 100%;
  max-width: 30px;
}

.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
  top: 12px;
}

.header_text {
  font-size: 16px;
  color: #1d7fee;
  font-weight: bold;
}

/* Hide default HTML checkbox */

.switch input {
  display: none;
}

/* The slider */

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
  /*content: '✓';*/
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

@media (max-width: 575px) {
  .switch {
    width: 50px;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(12px);
    -ms-transform: translateX(12px);
    transform: translateX(12px);
  }
}
</style>
