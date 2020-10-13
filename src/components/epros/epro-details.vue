<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20 pb-20">
        <div class="pt-20 fw-500 fs-24">ePRO details</div>
        <div class="epro_details_card">
          <div class="details_section">
            <div class>
              <div class="intro_card">
                <div class="pt-5 fw-18 fw-500">{{eproDetails.title}}</div>
                <div class="title_header pt-10 color_959fa4">Objective</div>
                <div class="pt-5">{{eproDetails.objective}}</div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="title_header pt-20 color_959fa4">Author(s)</div>
                    <div>{{eproDetails.eProInfo.authors}}</div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="title_header pt-20 color_959fa4">Copyright</div>
                    <div>{{eproDetails.eProInfo.copyRight}}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="title_header pt-20 color_959fa4">Therapeutic Area</div>
                    <div>{{eproDetails.therapeuticArea}}</div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="title_header pt-20 color_959fa4">Therapeutic Indication</div>
                    <div>{{eproDetails.therapeuticIndication}}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="title_header pt-20 color_959fa4">Approximate time to complete</div>
                    <div>{{eproDetails.timeToComplete}} minutes</div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0"></div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div
                      class="title_header pt-20 color_959fa4"
                    >Available in the following languages</div>
                    <div>
                      <span v-for="(lang, index) in eproDetails.languages">
                        {{lang}}
                        <span vif="index !== (eproDetails.languages - 1)">,</span>
                      </span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0"></div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="title_header pt-20 color_959fa4">Approved for digital use</div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="text-right">
                      <a
                        class="btn btn_learn_more br-25"
                        :href="eproDetails.learnmore"
                        target="_blank"
                      >Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-20">
          <span class="back_link" v-on:click="goBack()">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
          </span>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="row">
            <button
              class="btn br-25 disable-btn mr-10"
              v-on:click="skipForNow()"
              disabled
            >Skip for now</button>
            <button class="btn nextBtn br-25" v-on:click="addEproToStudy()">Save and Continue</button>
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

export default {
  name: "Participant-Surveys",
  data() {
    return {
      eproDetails: {
        title: null,
        objective: null,
        therapeuticArea: null,
        therapeuticIndication: null,
        questions: [],
        scheduler: null,
        eProInfo: {},
        learnmore: ""
      },
      scheduler: {},
      studyId: null,
      surveyId: null,
      surveyData: {},
      introQuestions: [],
      questionAnswers: [],
      scheduled: false,
      weekNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };
  },
  components: { studyFeatureHeader },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.eproId = this.$route.params.eproId;
    this.scheduled = window.localStorage.getItem("eproScheduled");
    this.getEproDetails();
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 150;
    }, 1500);
  },
  methods: {
    goBack() {
      window.history.back();
    },
    getEproDetails() {
      this.$api.getEproDetailsFact(this.eproId).then(
        response => {
          this.eproDetails = response.body;
          if (this.eproDetails.scheduler) {
            this.scheduler = response.body.scheduler;
          }
          if (
            this.eproDetails.questions &&
            this.eproDetails.questions.length > 0
          ) {
            this.introQuestions = _.filter(
              response.body.questions,
              o => o.type && o.type.toLowerCase() === "surveyinstruction"
            );
            this.questionAnswers = _.filter(
              response.body.questions,
              o => o.type && o.type.toLowerCase() !== "surveyinstruction"
            );
          }
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the epro details"
          );
        }
      );
    },
    continueToScheduler() {
      if (!this.eproDetails.scheduler) {
        this.addEproToStudy();
      }
    },
    addEproToStudy() {
      this.$api.addEproToStudyFact(this.studyId, this.eproId).then(
        () => {
          if (this.eproDetails.isPaidSurvey) {
            this.$router.push({
              name: "epro-validate",
              params: { studyId: this.studyId, eproId: this.eproId }
            });
          } else {
            this.$router.push({
              name: "epro-scheduler",
              params: { studyId: this.studyId, surveyId: this.eproId }
            });
          }
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while adding the epro to study"
          );
        }
      );
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
  }
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

.btn_learn_more {
  background-color: #ff7171;
  color: #fff;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.epro_details_card {
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  border-left: solid 6px #d3dfe4;
  padding: 15px;
}
</style>
