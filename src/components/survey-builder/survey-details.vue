<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="new-heading">Survey information</div>
          <form class name="survey_details_form">
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 survey_title">Survey name</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="title"
                    :class="{'input': true, 'is-danger': errors.has('title'), 'is-success': !errors.has('title') }"
                    class="form-control input-md"
                    v-model="survey.title"
                    placeholder="eg. Health Survey, Mood Survey"
                    required
                  />
                  <span
                    v-show="errors.has('title')"
                    class="error-style"
                  >The Survey Name field must be filled.</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10">Nickname (optional)</h4>
                <div class="form-group">
                  <input
                    type="text"
                    name="nickName"
                    :class="{'input': true, 'is-danger': errors.has('nickName'), 'is-success': !errors.has('nickName') }"
                    class="form-control input-md"
                    v-model="survey.nickName"
                    placeholder="eg. HS1, MS2"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 survey_title">Therapeutic area</h4>
                <div class="form-group">
                  <select
                    v-validate="'required|min:2'"
                    name="therapeuticArea"
                    :class="{'input': true, 'is-danger': errors.has('therapeuticArea'), 'is-success': !errors.has('therapeuticArea') }"
                    class="form-control input-md"
                    v-model="survey.therapeuticArea"
                    placeholder="Therapeutic area"
                    required
                  >
                    <option disabled value="defaultOption">Select</option>
                    <option
                      v-for="option in therapeuticAreas"
                      v-bind:value="option.value"
                    >{{ option.name }}</option>
                  </select>
                  <span
                    v-show="errors.has('therapeuticArea')"
                    class="error-style"
                  >Therapeutic area must be selected.</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 survey_title">Therapeutic indication</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="therapeuticIndication"
                    :class="{'input': true, 'is-danger': errors.has('therapeuticIndication'), 'is-success': !errors.has('therapeuticIndication') }"
                    class="form-control input-md input-color"
                    v-model="survey.therapeuticIndication"
                    placeholder="ie. asthma, Alzeimers"
                    required
                  />
                  <span
                    v-show="errors.has('therapeuticIndication')"
                    class="error-style"
                  >The Therapeutic Indication must be filled.</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 survey_title">Approximate time to complete survey</h4>
                <div class="form-group position_relative">
                  <input
                    type="text"
                    v-validate="{ rules: { regex: /^[0-9]{1,3}$/} }"
                    name="time"
                    :class="{'input': true, 'is-danger': errors.has('time'), 'is-success': !errors.has('time') }"
                    class="form-control input-md input-color"
                    v-model="survey.timeToComplete"
                    placeholder="Minutes"
                    required
                  />
                  <span
                    v-show="errors.has('time')"
                    class="error-style"
                  >Approximate time to complete field must an integer with 3 digits max.</span>
                  <span class="mins_text" v-if="survey.timeToComplete">Minutes</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="divider"></div>
            </div>
            <div class="row">
              <div class="new-heading pad22">Survey settings</div>
              <div class="switch-button">
                <div class="switch-option">
                  <label class="switch">
                    <input
                      ref="chkToggleWatch"
                      :disabled="isInvalidQuestion"
                      type="checkbox"
                      v-on:change="toggleForWatch"
                      v-model="survey.watchEnabled"
                    />
                    <div class="slider round"></div>
                  </label>
                  <div class="text">
                    Allow survey to be completed on an Apple Watch. Limited question types if selected.
                    <a
                      class="color_grey cursor_pointer"
                      data-toggle="modal"
                      data-target="#watchAppInfoModal"
                    >
                      <i class="fa fa-info-circle p-1"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div ref="inValidQuestion" class="survey-error"></div>
            </div>
          </form>
          <div class="pt-20">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-caret-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <button
                class="btn br-25 disable-btn mr-10"
                v-on:click="skipForNow()"
                :disabled="disableSkipForNow"
              >Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="createSurvey()">Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="watchAppInfoModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header border-none">
            <a class="cursor_pointer close modal-close" data-dismiss="modal">
              <i class="fa fa-times" aria-hidden="true"></i>
            </a>
          </div>
          <div
            class="modal-body pt-0"
          >Apple Watch app includes support for Yes or No, Date & Time, Text Response, and Multiple Choice with single selection question types only. All other survey features are not currently available for use in the Apple Watch app.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash';
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "survey-details",
  data() {
    return {
      studyId: null,
      surveyId: null,
      isInvalidQuestion: false,
      disableSkipForNow: false,
      survey: {
        title: "",
        nickName: "",
        therapeuticArea: "defaultOption",
        therapeuticIndication: "",
        timeToComplete: "",
        watchEnabled: false,
        questions: []
      },
      therapeuticAreas: [
        {
          name: "Cardiology/Vascular Diseases",
          value: "Cardiology/Vascular Diseases"
        },
        { name: "Dental and Oral Health", value: "Dental and Oral Health" },
        { name: "Dermatology", value: "Dermatology" },
        { name: "Devices", value: "Devices" },
        { name: "Endocrinology", value: "Endocrinology" },
        { name: "Family Medicine", value: "Family Medicine" },
        { name: "Gastroenterology", value: "Gastroenterology" },
        { name: "Genetic Disease", value: "Genetic Disease" },
        { name: "Healthy Volunteers", value: "Healthy Volunteers" },
        { name: "Hematology", value: "Hematology" },
        {
          name: "Hepatology (Liver, Pancreatic, Gall Bladder)",
          value: "Hepatology (Liver, Pancreatic, Gall Bladder)"
        },
        { name: "Immunology", value: "Immunology" },
        {
          name: "Infections and Infectious Diseases",
          value: "Infections and Infectious Diseases"
        },
        { name: "Internal Medicine", value: "Internal Medicine" },
        { name: "Musculoskeletal", value: "Musculoskeletal" },
        { name: "Nephrology", value: "Nephrology" },
        { name: "Neurology", value: "Neurology" },
        {
          name: "Nutrition and Weight Loss",
          value: "Nutrition and Weight Loss"
        },
        {
          name: "Obstetrics/Gynecology (Women’s Health)",
          value: "Obstetrics/Gynecology (Women’s Health)"
        },
        { name: "Oncology", value: "Oncology" },
        { name: "Ophthalmology", value: "Ophthalmology" },
        {
          name: "Orthopedics/Orthopedic Surgery",
          value: "Orthopedics/Orthopedic Surgery"
        },
        {
          name: "Otolaryngology (Ear, Nose, Throat)",
          value: "Otolaryngology (Ear, Nose, Throat)"
        },
        { name: "Pediatrics/Neonatology", value: "Pediatrics/Neonatology" },
        { name: "Pharmacology/Toxicology", value: "Pharmacology/Toxicology" },
        { name: "Podiatry", value: "Podiatry" },
        { name: "Psychiatry/Psychology", value: "Psychiatry/Psychology" },
        {
          name: "Pulmonary/Respiratory Diseases",
          value: "Pulmonary/Respiratory Diseases"
        },
        { name: "Rheumatology", value: "Rheumatology" },
        { name: "Sleep", value: "Sleep" },
        {
          name: "Trauma (Emergency, Injury, Surgery)",
          value: "Trauma (Emergency, Injury, Surgery)"
        },
        { name: "Urology", value: "Urology" },
        { name: "Vaccines", value: "Vaccines" }
      ]
    };
  },
  props: ["sequence"],
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    if (this.$route.name === "survey-template-details" && this.surveyId !== 0) {
      // eslint-disable-line
      this.getSurveyTemplateDetails();
      this.disableSkipForNow = true;
    } else if (this.$route.name === "survey-details" && this.surveyId !== 0) {
      // eslint-disable-line
      this.getSurveyDetails();
    }
    this.disableSkipForNow = this.surveyId == 0 ? true : this.disableSkipForNow; // eslint-disable-line
  },
  methods: {
    toggleForWatch() {
      if (this.survey.watchEnabled) {
        var that = this;
        const itemToRemove = ["CustomScale", "Image", "NumberScale", "Number", "GPSkin"];
        that.survey.questions.forEach(function(item) {
          if (itemToRemove.includes(item.type)) {
            that.isInvalidQuestion = true;
          }
        });
        if (this.isInvalidQuestion) {
          this.$refs.inValidQuestion.innerHTML =
            "This setting is not available because the survey contains questions types that are not supported by the Apple Watch";
          this.survey.watchEnabled = false;
        }               
      }
    },
    goBack() {
      window.history.back();
    },
    getSurveyDetails() {
      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          this.survey = response.body;
          if (this.survey.watchEnabled) {
            var that = this;
            const itemToRemove = [
              "CustomScale",
              "Image",
              "NumberScale",
              "Number"
            ];
            that.survey.questions.forEach(function(item) {
              if (itemToRemove.includes(item.type)) {
                that.isInvalidQuestion = true;
              }
            });
            if (this.isInvalidQuestion) {
              this.$refs.inValidQuestion.innerHTML =
                "This setting is not available because the survey contains questions types that are not supported by the Apple Watch";
              this.survey.watchEnabled = false;
            }
          }
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the survey details"
          );
        }
      );
    },
    getSurveyTemplateDetails() {
      this.$api.getSurveyTemplateDetailsFact(this.surveyId).then(
        response => {
          this.survey = response.body;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the survey details"
          );
        }
      );
    },
    goToSurveyListPage() {
      this.$router.push({
        name: "studies-surveyslist",
        params: { studyId: this.studyId }
      });
    },
    skipForNow() {
      this.$router.replace({
        name: "survey-instructions",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    createSurvey() {
      if (Number(this.sequence)) {
        this.survey.sequence = this.sequence;
      }
      if (
        this.survey.title &&
        this.survey.therapeuticArea !== "defaultOption" &&
        this.survey.therapeuticIndication &&
        this.survey.timeToComplete
      ) {
        // eslint-disable-line
        this.survey.timeToComplete = Number(this.survey.timeToComplete); // eslint-disable-line
        if (this.survey.timeToComplete % 1 !== 0) {
          toastr.error(
            "Approximate time to complete field must an integer with 3 digits max."
          );
        } else {
          this.$api.postNewSurveyInfoFact(this.studyId, this.survey).then(
            response => {
              this.surveyId = response.body.id;
              this.$router.replace({
                name: "survey-questions",
                params: { studyId: this.studyId, surveyId: this.surveyId }
              });
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while creating the survey"
              );
            }
          );
        }
      } else {
        toastr.error("Please fill all the mandatory fields");
      }
    }
  },
  components: { studyFeatureHeader }
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
  margin-top: 10px;
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

.bg-color {
  background-color: #f5f8fa;
  background-size: cover;
  // height: 100%;
  // min-height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.collapse_card {
  border: 1px solid #d3dfe4 !important;
  background-color: #f5f8fa;
  padding-left: 5px;
}
.icon_section {
  width: 28px;
  height: 28px;
  border-radius: 2px;
  background-color: #d3dfe4;
  display: inline-block;
  text-align: center;
  padding-top: 5px;
}
.read_only_card {
  border-left: 6px solid #d3dfe4 !important;
}
.navbar-style {
  background: linear-gradient(to left, #7478e6, #09b9e0);
}

.btn {
  border-radius: 25px;
}

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin: 10px 0px 20px 0px;
}

.cardX {
  margin: 0 auto 2rem;
  box-shadow: 0 0.0625em 0.2em 0 rgba(0, 0, 0, 0.1), 0 0.7em 0 -0.3em #f2f2f2,
    0 0.5em 0.1875em -0.25em rgba(0, 0, 0, 0.2), 0 1em 0 -0.6em #e5e5e5,
    0 1em 0.1875em -0.5em rgba(0, 0, 0, 0.2), 0 1em 0 -0.6em #e5e5e5,
    0 1em 0.1875em -0.5em rgba(0, 0, 0, 0.2) !important;
}

.read_only_screen {
}
.doc_desc {
  display: inline-block;
  word-break: break-all;
}

.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
}
.mins_text {
  position: absolute;
  top: 8px;
  right: 15px;
  color: #959fa4;
  font-size: 14px;
}
.header-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
}
.edit_only_screen {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.add-btn {
  font-size: 14px;
  min-width: 150px;
  border: 1px solid#f06559;
  color: #f06559;
  background: transparent;
}

.save_btn {
  width: 100px;
}
.form-control {
  border-radius: 2px;
  background-color: #f5f8fa;
  height: 40px;
}
.misplaced-card {
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}

.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.radio-style {
  bottom: 2px;
  text-align: center;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.close-style {
  padding: 15px 15px 0px 0px;
}
.back_link {
  color: #666669;
}

.survey_title {
  color: #666669;
  font-size: 14px;
}

.input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.divider {
  margin-top: 30px;
  margin-bottom: 28px;
  border: 1px solid #d3dfe4;
}

.grey1 {
  margin-bottom: 22px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
  float: left;
  margin-right: 10px;
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
.filds_section {
  border-radius: 8px;
  padding: 0 10px 10px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  min-height: 150px;
}

.switch-option {
  float: left;
  width: 100%;
}

.new-heading {
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #666669;
}

.pad22 {
  padding-bottom: 22px;
}

.pt-10 {
  opacity: 0.7;
  /* font-family: Roboto; */
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 5px;
}

.pt-20 {
  margin-top: 100px;
  margin-bottom: 20px;
}

.back_link {
  color: #666669;
}
.survey-error {
  font-size: 14px;
  color: #f06559;
}
.modal-close {
  font-size: inherit;
  color: #000;
}
</style>
