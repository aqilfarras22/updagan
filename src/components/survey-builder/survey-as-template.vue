<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="pt-20 text-center">
            <i class="fa fa-check-circle check_icon" aria-hidden="true"></i>
            <h3 class="m-0">{{surveyData.title}} Survey added!</h3>
            <div
              class="color_grey fs-16 pt-20 pb-20"
            >Would you like to add this survey to your templates?</div>
            <div>
              <button type="button" class="btn yes_no_buttons" v-on:click="markAsTemplate(true)">Yes</button>
            </div>
            <div class="pt-10">
              <button type="button" class="btn yes_no_buttons" v-on:click="markAsTemplate(false)">No</button>
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
                disabled
                v-on:click="skipForNow()"
              >Skip for now</button>
              <button
                class="btn nextBtn br-25"
                disabled
                v-on:click="goToNextPage()"
              >Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";

const jwtDecode = require("jwt-decode");

export default {
  name: "mark-survey-template",
  data() {
    return {
      studyId: null,
      surveyId: null,
      surveyData: {},
      questionAnswers: [],
      introQuestions: []
    };
  },
  components: { studyFeatureHeader },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.getSurveyDetails();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    skipForNow() {
      // 'survey-add-another'
      this.$router.push({
        name: "surveys",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
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
            this.introQuestions = response.body.questions.filter(
              o => o.type && o.type.toLowerCase() === "surveyinstruction"
            );
            this.questionAnswers = response.body.questions.filter(
              o => o.type && o.type.toLowerCase() !== "surveyinstruction"
            );
          }
        },
        error => {
          toastr.error(
            error.body ? error.body.message : "Error while updating the data"
          );
        }
      );
    },
    markAsTemplate(val) {
      if (val) {
        const userObj = jwtDecode(window.localStorage.getItem("thread-token"));
        this.$api
          .saveAsTemplateFact(this.studyId, this.surveyId, {
            createdBy: userObj.id
          })
          .then(
            () => {
              toastr.success("Survey saved as template succesfully");
              this.skipForNow();
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while updating the data"
              );
            }
          );
      } else {
        this.skipForNow();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container-style {
  border-radius: 2px;
  background-color: #ffffff;
  color: #666769;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.check_icon {
  font-size: 42px;
  color: #51dd75;
  padding-bottom: 20px;
}
.yes_no_buttons {
  width: 200px;
  border-radius: 100px;
  color: #fff;
  background-color: #34537d;
}
.footerStyle {
  .row {
    display: block;

    &:after {
      content: "";
      clear: both;
      display: block;
    }
  }
}
</style>
