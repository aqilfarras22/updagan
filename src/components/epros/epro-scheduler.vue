<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class>
            <div class="fw-500 fs-24">Select when you would like your participants to take this ePRO</div>
            <div class="pt-20">Schedule by</div>
            <schedulerComponent :options="{validateFor:'epro'}"></schedulerComponent>
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
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="validateScheduler()">Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Datepicker from "vuejs-datepicker";
import toastr from "toastr";
import _ from "lodash";
import studyFeatureHeader from "../common/study-features-header";
import schedulerComponent from "../common/scheduler";

export default {
  name: "scheduler",
  data() {
    return {
      studyId: null,
      surveyId: null,
      studyData: {},
      surveyData: {},
      milestones: [],
      frequencies: [
        { type: "daily", title: "Daily", days: 1 },
        { type: "weekly", title: "Weekly", days: 7 },
        { type: "biweekly", title: "Every 2 Weeks", days: 15 },
        { type: "monthly", title: "Monthly", days: 30 },
        { type: "biannually", title: "Bi-annually", days: 180 },
        { type: "annually", title: "Annually", days: 360 }
      ],
      questionAnswers: [],
      daysOccurrenceArr: [],
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
      }
    };
  },
  components: {
    studyFeatureHeader,
    datepicker: Datepicker,
    schedulerComponent
  },
  computed: {
    schedulerObjChanged() {
      return this.$store.getters.getSchedulerObjData;
    }
  },
  watch: {
    schedulerObjChanged: {
      handler(val) {
        if (val.validatedFor === "epro") {
          this.addScheduler(val.schedulerObj);
        }
      }
    }
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.getStudyDetails();
    this.getSurveyDetails();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, ["route", "epros"]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    getSurveyDetails() {
      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          this.surveyData = response.body;
          this.$store.dispatch("setSurveyDetailsAction", response.body);
          if (
            this.surveyData.questions &&
            this.surveyData.questions.length > 0
          ) {
            this.timeToComplete = this.surveyData.timeToComplete;
            this.introQuestions = _.filter(
              response.body.questions,
              o => o.type && o.type.toLowerCase() === "surveyinstruction"
            ); // eslint-disable-line
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
              : "Error while getting the survey details"
          );
        }
      );
    },
    validateScheduler() {
      this.$store.dispatch("addSchedule", { validateFor: "epro" });
    },
    addScheduler(scheduleObj) {
      this.$api.postSchedulingFact(this.studyId, scheduleObj).then(
        () => {
          toastr.success("Scheduling completed succesfully");
          this.$router.push({
            name: "epros",
            params: { studyId: this.studyId, surveyId: this.surveyId }
          });
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while the scheduling the survey"
          );
        }
      );
    }
  }
};
</script>

<style scoped lang="scss">
.bg-green {
  background-color: #2ecc71 !important;
}

.bg-red {
  background-color: #ff7171 !important;
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
</style>
