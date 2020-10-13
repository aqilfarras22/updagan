<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-30">
          <div class="row">
            <div class="fw-bold fs-20 color_666669">Please review your survey</div>
            <div class="survey_details_section pt-15">
              <div class="row pb-10">
                <div class="col-lg-10 fw-500 fs-16 p-0 color_4c8ce4">Survey information</div>
                <div class="text-right color_grey">
                  <button
                    class="btn btn-default color_blue br-2 edit_button"
                    v-on:click="changeRoute('survey-details')"
                  >Edit</button>
                </div>
              </div>
              <div>
                <div class="survey_heading">Title:</div>
                <div class="survey_content mb-17">{{surveyData.title}}</div>
                <div class="survey_heading" v-if="surveyData.nickName">Nickname:</div>
                <div class="survey_content mb-17" v-if="surveyData.nickName">{{surveyData.nickName}}</div>
                <div class="survey_heading">Therapeutic area:</div>
                <div class="survey_content mb-17">{{surveyData.therapeuticArea}}</div>
                <div class="survey_heading">Therapeutic indication:</div>
                <div class="survey_content mb-17">{{surveyData.therapeuticIndication}}</div>
                <div class="survey_heading">Approximate time to complete:</div>
                <div class="survey_content">{{surveyData.timeToComplete}} min</div>
              </div>
            </div>
            <div class="survey_details_section pt-30">
              <div class="col-lg-10 fw-500 fs-16 p-0 color_4c8ce4">Survey settings</div>
              <div class="text-right color_grey">
                <button
                  class="btn btn-default color_blue br-2 edit_button"
                  v-on:click="changeRoute('survey-scheduler')"
                >Edit</button>
              </div>
               <div class="survey_content" v-if="surveyData.prePopulationEnabled">Enabled:</div>
              <div class="survey_content" v-if="!surveyData.prePopulationEnabled">Disabled:</div>
              <div class="fs-14">
                <ul>
                  <li>Show participants their previous survey answers, if applicable. Only applies for this survey.</li>
                </ul>
              </div>
            </div>
            <div class="survey_details_section pt-30">
              <div class="row pb-10 pt-10">
                <div
                  class="col-lg-10 fw-500 fs-16 p-0 color_4c8ce4"
                >{{questionAnswersLength}} screens</div>
                <div class="text-right color_grey">
                  <button
                    class="btn btn-default color_blue br-2 edit_button"
                    v-on:click="changeRoute('survey-questions')"
                  >Edit</button>
                </div>
              </div>
              <reviewQuestions class :questions="questionAnswers"></reviewQuestions>
            </div>
            <div class="scheduler pt-30" v-if="surveyData.scheduler">
              <div class="col-lg-10 fw-500 fs-16 p-0 color_4c8ce4">Schedule</div>
              <div class="text-right color_grey">
                <button
                  class="btn btn-default color_blue br-2 edit_button"
                  v-on:click="changeRoute('survey-scheduler')"
                >Edit</button>
              </div>
              <div class="survey_content">Occurrence:</div>
              <div
                class="survey_heading mb-10"
                v-if="surveyData.scheduler.type === 'milestone'"
              >Study Days {{milestones}}</div>
              <div
                class="survey_heading mb-10"
                v-if="surveyData.scheduler.type === 'custom'"
              >{{surveyData.scheduler.frequency.title}}</div>
              <div class="survey_heading mb-10" v-if="surveyData.scheduler.type === 'custom'">
                <span>Study Days:&nbsp;</span>
                <span v-for="(days,index) in surveyData.scheduler.duration" :key="index">
                  {{days.startDay}}-
                  <span v-if="days.endDay !== null">{{days.endDay}}</span>
                  <span v-if="days.endDay === null">end of study</span>
                  <span v-if="index !== (surveyData.scheduler.duration.length - 1)">,</span>&nbsp;
                </span>
              </div>
              <div class="survey_heading mb-17">
                <input
                  type="checkbox"
                  name="allowMultipleTimes"
                  v-model="surveyData.scheduler.allowMultipleTimes"
                  class="checkbox_position"
                  disabled
                />
                <span > Allow participants to repeat survey each time it is present</span>
              </div>
              <div class="survey_heading mb-17">
                <input
                  type="checkbox"
                  name="showDailySummary"
                  v-model="surveyData.scheduler.showDailySummary"
                  class="checkbox_position"
                  disabled
                />
                <span> Show participants a summary of their daily activity completion at the start of the activity. Available only for repeatable tasks.</span>
              </div>
              <div class="survey_content">Completion window:</div>
              <div class="survey_heading mb-17">{{surveyData.scheduler.completionWindow}} days</div>
              <div class="survey_content" v-if="surveyData.scheduler.reminders">Reminders:</div>
              <div class="survey_heading mb-17" v-if="surveyData.scheduler.reminders">
                <div
                  class="mb-10"
                  v-for="(reminder,index) in surveyData.scheduler.reminders"
                  :key="index"
                >
                  <div>
                    <span class="reminder_heading">Day:&nbsp;</span>
                    <span v-if="reminder.day === 0">Day of</span>
                    <span v-else>+{{reminder.day}} days</span>
                  </div>
                  <div>
                    <span class="reminder_heading">Message:&nbsp;</span>
                    <span>{{reminder.message}}</span>
                  </div>
                  <div>
                    <span class="reminder_heading">Time:&nbsp;</span>
                    <span>{{reminder.time}}</span>
                  </div>
                  <!-- <span v-if="index !== surveyData.scheduler.reminders.length-1">,&nbsp;</span> -->
                </div>
              </div>
              </div>
              <div class="email-div pt-30">
                <div class="col-lg-10 fw-500 fs-16 p-0 color_4c8ce4">Email recipient</div>
                <div class="text-right color_grey">
                  <button class="btn btn-default color_blue br-2 edit_button"
                    v-on:click="changeRoute('survey-scheduler')">Edit</button>
                </div>
                <div class="mb-17">
                  <div class="survey_content">Questions and answers included:</div>
                  <div v-if="questions.length > 0">
                    <div v-for="(question,index) in questions" :key="index">• {{question}}</div>
                  </div>
                  <div v-if="questions.length == 0">• None</div>
                </div>
                <div>
                  <div class="survey_content">Sent to:</div>
                  <div v-if="isRecipientFlagSet">Site Team</div>
                  <div v-if="emails.length > 0">
                    <div class="txt" v-for="(item, index) in emails" :key="index">{{item.email}}</div>
                  </div>
                  <div v-if="emails.length == 0 && !isRecipientFlagSet">N/A</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-20 pl-25">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-caret-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="goToNextPage()">Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import { sortBy } from "lodash";
import sampleQuestionObj from "./surveyQuestion.json";
import addEditQuestion from "../common/add-edit-question";
import readOnlyQuestions from "../common/read-only-questions";
import reviewQuestions from "../common/review-questions";
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "surveydetails",
  data() {
    return {
      id: null,
      studyId: null,
      surveyId: null,
      survey: {},
      surveyData: { title: "", nickName: "", questions: [], scheduler: {} },
      addQuestion: false,
      sequence: 1,
      nextQuestion: null,
      questionAnswers: [],
      questionAnswersLength: "",
      introQuestions: [],
      sampleQuestion: null,
      milestones: "",
      selectedQuestion: { value: "Default", label: "- Select -" },
      questionTypes: [
        { value: "Default", label: "- Select -" },
        { value: "MultiChoice", label: "Multiple choice" },
        { value: "Image", label: "Image choice" },
        { value: "Boolean", label: "Yes or No" },
        { value: "NumberScale", label: "Number scale" },
        { value: "CustomScale", label: "Custom scale" },
        { value: "Text", label: "Text response" },
        { value: "Number", label: "Number response" },
        { value: "DateTime", label: "Date / Time" }
        // { value: 'Email', label: 'Email' },
        // { value: 'Location', label: 'Location' },
      ],
      questions: [],
      emails: [],
      isRecipientFlagSet: false
    };
  },
  components: {
    readOnlyQuestions,
    studyFeatureHeader,
    addEditQuestion,
    reviewQuestions
  },
  computed: {},
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.getSurveyDetails();
    this.addNewQuestion("MultiChoice");
    this.getNotificationEmail();
    this.getRecipientFlag();
  },
  methods: {
    getRecipientFlag() {
      this.$api.getRecipientFlag(this.studyId, this.surveyId).then(
      response => {
        this.isRecipientFlagSet = response.body && response.body.isNotificationRecipient ? response.body.isNotificationRecipient : false;
      }, error => {
          toastr.error(
            error.body ? error.body.message : 'Error while getting the study details',
          );
        },
      );
    },
    goBack() {
      window.history.back();
    },
    skipForNow() {
      this.$router.push({
        name: "survey-as-template",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    goToNextPage() {
      this.$router.push({
        name: "survey-as-template",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    changeRoute(route) {
      this.$router.push({
        name: route,
        params: { studyId: this.studyId, surveyId: this.surveyId }
      }); // eslint-disable-line
    },
    getSurveyDetails() {
      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          this.surveyData = response.body;
          if (response.body.scheduler && response.body.scheduler.milestones) {
            let milestonesArray = sortBy(response.body.scheduler.milestones);
            this.milestones = milestonesArray.toString();
          }
          this.$store.dispatch('setSurveyDetailsAction', response.body);
          if (this.surveyData.questions && this.surveyData.questions.length > 0) {
            this.questionAnswers = this.processQuestion(response.body.questions);
            this.questionAnswersLength = this.questionAnswers.length - 1;
            this.$store.dispatch("surveyQuestionsAction", this.questionAnswers);
            this.questions = this.processEmailRecipientQuestions(
              response.body.questions
            );
          }
        },
        error => {
          this.errorMsg = error.body
            ? error.body.message
            : "Error while getting survey details";
          toastr.error(this.errorMsg);
        }
      );
    },
    processQuestion(question) {
      question.map(function(value, key) {
        if(value.type == 'SurveyInstruction') {
          if(value.formattedTitle == "") {
            value.formattedTitle = value.title;
          }
          if(value.formattedInformation == "") {
            value.formattedInformation = value.information;
          }
        } else if (value.type == 'CustomScale' && value.formattedLabels == undefined) {
          value.formattedLabels = value.labels;
        } else {
          if(value.formattedBody == "") {
            value.formattedBody = value.body;
          }
          if(value.options !== undefined && value.options.formattedBody == "") {
            value.options.formattedBody = value.options.body;
          }
        }
      });
      return question;
    },
    processEmailRecipientQuestions(ques) {
      let q = [];
      ques.map(function(value, key) {
        if (value.isNotifyToEmail) {
          q.push(value.body);
        }
      });
      return q;
    },
    getNotificationEmail() {
      this.$api.getNotificationEmails(this.surveyId, this.studyId).then(
        response => {
          this.emails = response.body;
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
    addNewQuestion(questionType) {
      this.sampleQuestion = JSON.parse(JSON.stringify(sampleQuestionObj));
      this.sampleQuestion.sequence = this.questionAnswers.length + 1;
      this.sampleQuestion.type = questionType;
      this.addQuestion = true;
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

.scheduler {
  border-bottom: 2px solid #d3dfe4;
  padding-bottom: 30px;
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

h1,
h2,
h3 {
  font-weight: 200;
}
.form-control {
  border-radius: 2px;
}
.pr-0 {
  padding-right: 0;
}

.pl-0 {
  padding-left: 0;
}

.img-style {
  padding-top: 20px;
  height: 300px;
  width: 500px;
  padding-bottom: 20px;
}

.font-style {
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

.text-style {
  color: #969090;
  text-align: right;
}

.btn-style {
  margin-top: 10px;
  width: 80px;
  height: 29px;
  margin-bottom: 50px;
}

.custom-btn {
  background: #00baf9;
  color: #fff;
  width: 220px;
}

.custom-para {
  padding-bottom: 20px;
  font-size: 20px;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.btn-disabled {
  color: white;
  background-color: #c6c2c2;
  border: #c6c2c2;
}

.text-color {
  color: #888;
}

.read_only_card {
  background-color: #f5f8fa;
  border: 1px solid #d3dfe4;
  border-left: 8px solid #d3dfe4;
  padding: 15px;
  margin-bottom: 16px;
  .instuction_title {
    font-size: 18px;
    font-weight: bold;
  }
}

.survey-name {
  color: #00baf9;
  font-size: 20px;
}

.pad-left50 {
  padding-left: 50px;
}

.button-blue-1 {
  background: #00bae0;
  color: #fff;
}

.button-blue-2 {
  background-color: #0197eb;
  color: #fff;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.mar-bot0 {
  margin-bottom: 0px !important;
}

.first_question_selection {
  img {
    width: 100%;
    max-width: 100px;
  }
  .header {
    font-size: 24px;
    font-weight: 200;
    padding: 14px;
  }
  .label_text {
    font-size: 18px;
    padding-bottom: 10px;
    font-weight: 400;
  }
  select {
    margin: auto;
    width: 100%;
    max-width: 300px;
  }
}
.question_count {
  background-color: #34537d;
  color: #fff;
  width: 25px;
  display: inline-block;
  border-radius: 10px;
  text-align: center;
}
.inner-card {
  border: 1px solid #ddd;
  box-shadow: 1px 0px 1px 1px #ddd;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f6fafc;
}

.select-style {
  background: #f9f9f9;
  border-radius: 2px;
}

.radio-style {
  margin-top: 5px !important;
  font-size: 14px;
  color: #555555;
}
.btn_add {
  border-radius: 25px;
  border: solid 1px #f16559;
  color: #f16559;
  background-color: transparent;
}
.check-style {
  margin-top: 5px !important;
  font-size: 14px;
  color: #555555;
  padding: 0px 20px;
}

.border-left {
  border-left: 1px solid #555555;
}
.container-style {
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.input-style {
  width: 45px;
  margin-left: 10px;
  background: #f9f9f9;
  display: initial;
  padding: 5px;
}

.char-style {
  font-size: 14px;
  color: #555555;
}

.card {
  padding: 15px;
  color: #666769 !important;
}

.add_another_btn {
  font-size: 14px;
  background-color: transparent;
  border-color: #f06559;
  color: #f06559;
  margin-bottom: 20px;
}

.preview-btn {
  background-color: #d4f2ff;
  width: 100%;
  // max-width: 150px;
  padding: 10px 0;
}

.icon-style {
  font-size: 47px;
  position: absolute;
  left: 30px;
  /* bottom: 0px; */
  top: -25px;
}

.pl-25 {
  padding-left: 25px;
}

@media (max-width: 575px) {
  .container-padding {
    padding-left: 20px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) {
}

.survey_details_section {
  border-bottom: 2px solid #d3dfe4;
  padding-bottom: 30px;
}

.edit_button {
  background-color: #ffffff;
  border: 1px solid #d3dfe4;
  font-size: 12px;
}

.survey_heading {
  color: #959fa4;
  font-size: 12px;
}

.survey_content {
  color: #666669;
  font-size: 14px;
  font-weight: bold;
}

.back_link {
  color: #666669;
}

.reminder_heading {
  color: #666669;
}

.checkbox_position {
  position: relative;
  top: 2px;
}

ul {
  margin: 0;
  padding: 0 0 0 15px;
}

</style>
