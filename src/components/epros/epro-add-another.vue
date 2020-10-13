<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="pt-20 text-center">
            <i class="fa fa-check-circle check_icon" aria-hidden="true"></i>
            <h3 class="m-0">{{surveyData.title}} Survey added!</h3>
            <div class="color_grey fs-16 pt-20 pb-20">Would you like to add another ePRO?</div>
            <div>
              <button
                type="button"
                class="btn yes_no_buttons"
                v-on:click="addAnotherSurvey(true)"
              >Yes</button>
            </div>
            <div class="pt-10">
              <button
                type="button"
                class="btn yes_no_buttons"
                v-on:click="addAnotherSurvey(false)"
              >No</button>
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
      this.$router.push({
        name: "epros",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    goToNextPage() {
      this.$router.push({
        name: "epros",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    getSurveyDetails() {
      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          this.surveyData = response.body;
        },
        error => {
          toastr.error(
            error.body ? error.body.message : "Error while updating the data"
          );
        }
      );
    },
    addAnotherSurvey() {
      this.goToNextPage();
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
</style>
