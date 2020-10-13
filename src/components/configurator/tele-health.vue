<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="fw-500 fs-24 pb-6">Your study help line number</div>
          <div
            class="pb-15"
          >In the event that your participants are unable to find a suitable telehealth time slot, or if a study physician cannot be reached, your participant should have the option to call a study help line number.</div>
          <div class="color_666669 pb-5">Enter your study help line number</div>
          <div class="col-6 p-0">
            <vue-tel-input class="p-0" @onInput="onInputTelephone" ref="telephoneNumber"></vue-tel-input>
          </div>
          <div
            class="error-style"
            v-if="telNumber.phone.length > 0 && !validTelNumber"
          >Please enter a valid telephone number</div>
          <div class="pt-20">
            <div class="fw-500 fs-24">Schedule your Telehealth visits</div>
            <div class="pt-20 scheduler-heading">Which method would you like to schedule with?</div>
            <schedulerComponent :options="{validateFor:'telehealth', scheduler: truClinicData}"></schedulerComponent>
          </div>
          <div class="pt-20">
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
                v-on:click="validateScheduler()"
              >Save and Continue</button>
            </div>
            <div class="row" v-if="!isStudySummary">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="validateScheduler()">Save and Continue</button>
            </div>
          </div>
        </div>
        <CancelModal ref="cancelConfirmation" />
      </div>
    </div>
  </div>
</template>


<script>
import _ from "lodash";
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";
import schedulerComponent from "../common/scheduler";
import countriesData from "../../data/countries-data.json";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "scheduler",
  data() {
    return {
      studyId: null,
      surveyId: null,
      truClinicData: null,
      milestones: [],
      frequencies: [
        { type: "daily", title: "Daily", days: 1 },
        { type: "weekly", title: "Weekly", days: 7 },
        { type: "biweekly", title: "Every 2 Weeks", days: 15 },
        { type: "monthly", title: "Monthly", days: 30 },
        { type: "biannually", title: "Bi-annually", days: 180 },
        { type: "annually", title: "Annually", days: 360 }
      ],
      scheduler: {
        type: "milestone",
        milestones: [],
        frequency: {},
        startDay: null,
        endDay: null,
        completionWindow: null,
        reminders: [{}],
        allowMultipleTimes: false,
        allowUntillDuration: false
      },
      countriesData,
      selectedCountryCode: null,
      telNumber: {
        code: "",
        imgUrl: "",
        phone: ""
      },
      validTelNumber: false,
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  components: { studyFeatureHeader, schedulerComponent, CancelModal },
  computed: {
    schedulerObjChanged() {
      return this.$store.getters.getSchedulerObjData;
    }
  },
  watch: {
    schedulerObjChanged: {
      handler(val) {
        if (val.validatedFor === "telehealth") {
          this.addScheduler(val.schedulerObj);
        }
      }
    }
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 500;
    }, 3000);
    this.getTruClinicDetails();
  },
  methods: {
    goBack() {
      window.history.back();
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
    },
    onInputTelephone({ number, isValid, country }) {
      window.console.log(country);
      this.validTelNumber = isValid;
      this.telNumber.phone = number.replace(/\s/g, "");
    },
    validateScheduler() {
      this.$store.dispatch("addSchedule", { validateFor: "telehealth" });
    },
    addScheduler(scheduleObj) {
      const schedulerObj = scheduleObj;
      if (this.telNumber.phone) {
        schedulerObj.phoneNumber = this.telNumber.phone;
        this.$api.postSchedulingFact(this.studyId, schedulerObj).then(
          () => {
            toastr.success("Scheduling completed succesfully");
            this.continue();
          },
          error => {
            toastr.error(
              error.body
                ? error.body.message
                : "Error while the scheduling the survey"
            );
          }
        );
      } else {
        toastr.error("Please fill all the fields");
      }
    },
    continue() {
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
    getTruClinicDetails() {
      this.$api.getTruClinicDetailsFact(this.studyId).then(
        response => {
          if (response.body.phoneNumber) {
            this.$refs.telephoneNumber.phone = response.body.phoneNumber;
            this.telNumber.phone = response.body.phoneNumber;
            this.validTelNumber = true;
          }
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
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

/deep/ .col {
  padding: 0px !important;
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

.bg-green {
  background-color: #2ecc71 !important;
}

.bg-red {
  background-color: #ff7171 !important;
}
.scheduler-heading {
  font-weight: 600;
  color: #666769;
}

.container-style {
  border-radius: 2px;
  background-color: #ffffff;
  color: #666769;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.example {
  margin: 40px 40px 20px 40px;
}
.example-content {
  padding: 20px 40px 20px 40px;
}
.example-header {
  padding: 20px 80px 10px 80px;
  font-weight: bold;
}

.form-control {
  border-radius: 2px;
}
.bg-none {
  background: none !important;
  outline: none !important;
  border: 1px solid #d3dfe4;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.country_image {
  max-width: 25px;
}

.selected_country_image {
  width: 30px;
}

.code_style {
  border-radius: 2px !important;
  border: 1px solid #ced4da;
  min-width: 70px;
  background-color: #ffffff;
}

.color_666669 {
  color: #666669;
}

.dropdown-menu {
  overflow-y: scroll;
  height: 280px;
  z-index: 98;
  width: 500px;
}

.input-width {
  width: 430px;
  padding-left: 10px;
}
</style>
