<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class>
            <div class="fw-500 fs-24">Schedule your survey</div>
            <div class="pt-20 clearfix survey_qs">Which method would you like to schedule with?</div>
            <schedulerComponent :options="{validateFor:'survey'}"></schedulerComponent>
          </div>
          <div class="bt-1">
            <div class="row pt-20">
              <div class="fw-500 fs-24">Additional settings</div>
            </div>
            <div class="row pt-20">
              <label class="switch">
                <input type="checkbox" v-model="prePopulationEnabled" v-on:change="changeStatus" />
                <div class="slider round"></div>
              </label>
              <div
                class="pl-10"
              >Show participant's their previous survey answers, if applicable. Only applies for this survey.</div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="email-div">
            <div class="heading">Email recipient</div>
            <div class="email-div1">
              <div class="txt">Questions and answers included:</div>
              <div v-if="questions.length > 0">
                <div class="txt1" v-for="(question,index) in questions" :key="index">• {{question}}</div>
              </div>
              <div class="txt1" v-if="questions.length == 0">• None</div>
            </div>
            <div class="email-div2">
              <div class="heading">Sent to:</div>
              <div> <label class="fw-normal">
          <input @click="notificationRecipient($event)" type="checkbox" v-model="sentToTeam" name="sentToTeam" class="checkbox_position">
          <span class=""> Send notifications to the Site Team.</span>
        </label>
        <span class="fa fa-info-circle info-circle pl-10 pt-10" aria-hidden="true" @click="toggleInfo()" @blur="hideInfo()" tabindex="-1"></span> <div class="info-circle-div site-team" v-show="infoDiv">The notifications will be sent to Site Team which include Principal Investigator, Sub-Investigator, and Study Coordinator, if applicable.</div>
        </div>
              <div class="mt-20">And/or other recipients:</div>
              <div class="input">
                <input
                  type="text"
                  placeholder="Enter email"
                  v-model="surveyNotificationEmail.email"
                  v-on:keyup="validateParticipants"
                  v-validate="'required|email'"
                  :name="`email`"
                  :class="{'is-danger': emailError, 'is-success': !emailError }"
                />
                <button
                  class="add left-margin"
                  v-on:click="addNotificationEmail()"
                  :disabled="!addRecipientBtn"
                  :class="{'recipientBtnDisabled':!addRecipientBtn}"
                >Add recipient</button>
                <span v-show="emailError" class="error-style">Please enter a valid email address.</span>
                <span v-show="alreadyExists" class="error-style">This email address already exists.</span>
              </div>
            </div>
            <div class="email-div3">
              <div class="txt" v-for="(item, index) in emails" :key="index">
                {{item.email}}
                <span class="txt-remove" v-on:click="removeEmail(item.email)">Remove</span>
              </div>
            </div>
          </div>
          <div class="pt-40">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-caret-left" aria-hidden="true"></i> Back
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
import toastr from "toastr";
// import _ from "lodash";
import studyFeatureHeader from "../common/study-features-header";
import schedulerComponent from "../common/scheduler";
import swal from "sweetalert2";

export default {
  name: "scheduler",
  data() {
    return {
      infoDiv: false,
      addRecipientBtn: false,
      alreadyExists: false,
      emailError: false,
      surveyNotificationEmail: {
        email: "",
        studyId: ""
      },
      emails: [],
      questions: [],
      notifyToEmail: false,
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
      exampleMileStone: [
        { date: "Day1", day: "Wed", class: "bg-green" },
        { date: "Day2", day: "Thur", class: "" },
        { date: "Day3", day: "Fri", class: "" },
        { date: "+2", day: "Sat", class: "bg-red" }
      ],
      prePopulationEnabled: false,
      sentToTeam: null
    };
  },
  components: { studyFeatureHeader, schedulerComponent },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.getStudyDetails();
    this.getSurveyDetails();
    this.getNotificationEmail();
    this.isQuestionEmail();
    this.getRecipientFlag();
  },
  computed: {
    schedulerObjChanged() {
      return this.$store.getters.getSchedulerObjData;
    }
  },
  watch: {
    schedulerObjChanged: {
      handler(val) {
        if (val.validatedFor === "survey") {
          this.addScheduler(val.schedulerObj);
        }
      }
    }
  },
  methods: {
    getRecipientFlag() {
      this.$api.getRecipientFlag(this.studyId, this.surveyId).then(
      response => {
        this.sentToTeam = response.body && response.body.isNotificationRecipient ? response.body.isNotificationRecipient : false;
      }, error => {
          toastr.error(
            error.body ? error.body.message : 'Error while getting the study details',
          );
        },
      );
    },
    notificationRecipient(ele) {
      this.sentToTeam = ele.target.checked;
      this.$api.configuredRecipient(this.surveyId, {studyId: this.studyId, surveyId: this.surveyId, isNotificationRecipient: ele.target.checked}).then((response) => {
        this.sentToTeam = response.body && response.body.isNotificationRecipient ? response.body.isNotificationRecipient : false;
      }, (error) => {
        toastr.error(
          error.body
            ? error.body.message
            : "Error while configuring recipient"
        );
      })
    },
    validateParticipants() {
      if (
        this.surveyNotificationEmail.email === "" ||
        this.surveyNotificationEmail.email === null
      ) {
        this.emailError = false;
        this.alreadyExists = false;
        this.addRecipientBtn = false;
      } else if (
        this.validateEmail(this.surveyNotificationEmail.email) === false
      ) {
        this.emailError = true;
        this.alreadyExists = false;
        this.addRecipientBtn = false;
      } else if (
        this.isEmailExists(this.surveyNotificationEmail.email) === true
      ) {
        this.emailError = false;
        this.alreadyExists = true;
        this.addRecipientBtn = false;
      } else {
        this.emailError = false;
        this.alreadyExists = false;
        this.addRecipientBtn = true;
      }
    },
    removeEmail(email) {
      swal({
        title: "Are you sure you want to remove?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Remove"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.surveyNotificationEmail.studyId = this.studyId;
          this.surveyNotificationEmail.email = email;
          this.$api
            .removeEmail(this.surveyId, this.surveyNotificationEmail)
            .then(
              response => {
                this.emails = response.body;
                this.surveyNotificationEmail.email = "";
                this.emailError = false;
                this.alreadyExists = false;
                this.addRecipientBtn = false;
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
      });
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
    addNotificationEmail() {
      if (
        this.surveyNotificationEmail.email === "" ||
        this.surveyNotificationEmail.email === null
      ) {
        this.emailError = false;
        this.alreadyExists = false;
        this.addRecipientBtn = false;
      } else if (
        this.validateEmail(this.surveyNotificationEmail.email) === false
      ) {
        this.emailError = true;
        this.alreadyExists = false;
        this.addRecipientBtn = false;
      } else if (
        this.isEmailExists(this.surveyNotificationEmail.email) === true
      ) {
        this.emailError = false;
        this.alreadyExists = true;
        this.addRecipientBtn = false;
      } else {
        this.emailError = false;
        this.alreadyExists = false;
        this.addRecipientBtn = true;
        this.surveyNotificationEmail.studyId = this.studyId;
        this.$api
          .addEmailForNotification(this.surveyId, this.surveyNotificationEmail)
          .then(
            response => {
              this.emails = response.body;
              this.surveyNotificationEmail.email = "";
              this.addRecipientBtn = false;
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
    },
    isEmailExists(email) {
      const e = this.emails;
      let result = false;
      for (let i = 0; i < e.length; i++) {
        if (e[i].email === email) {
          result = true;
        }
      }
      return result;
    },
    validateEmail(email) {
      const re = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; // eslint-disable-line
      return re.test(email);
    },
    isQuestionEmail() {
      let temp = this.notifyToEmail;
      let q = this.questions;

      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          // questions = response.body.questions;
          response.body.questions.map(function(value, key) {
            // eslint-disable-line
            if (value.isNotifyToEmail) {
              temp = true;
              q.push(value.body);
            }
          });
          this.notifyToEmail = temp;
          this.questions = q;
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
    goBack() {
      window.history.back();
    },
    skipForNow() {
      this.$router.push({
        name: "survey-review",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    validateScheduler() {
      if (this.notifyToEmail) {
        if (this.emails.length != 0 || this.sentToTeam) {
          this.$store.dispatch("addSchedule", { validateFor: "survey" });
        } else {
          toastr.error("Please enter at least one email recipient.");
        }
      } else {
        this.$store.dispatch("addSchedule", { validateFor: "survey" });
      }
    },
    getSurveyDetails() {
      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          this.surveyData = response.body;
          this.prePopulationEnabled = response.body.prePopulationEnabled;
          this.scheduler = response.body.scheduler
            ? response.body.scheduler
            : this.scheduler;
          this.$store.dispatch("setSurveyDetailsAction", response.body);
          if (
            this.surveyData.questions &&
            this.surveyData.questions.length > 0
          ) {
            this.timeToComplete = this.surveyData.timeToComplete;
            this.questionAnswers = response.body.questions;
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
    addScheduler(scheduleObj) {
      this.$api.postSchedulingFact(this.studyId, scheduleObj).then(
        () => {
          toastr.success("Scheduling completed succesfully");
          this.$router.push({
            name: "survey-review",
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
    },
    changeStatus() {
      let data = {};
      data.prePopulationEnabled = this.prePopulationEnabled;
      this.$api
        .updateSurveyPrepopulationFact(this.surveyId, this.studyId, data)
        .then(
          response => {
            this.prePopulationEnabled = response.body.prePopulationEnabled;
          },
          error => {
            toastr.error(
              error.body
                ? error.body.message
                : "Error while updating the survey details"
            );
          }
        );
    },
    hideInfo () {
			this.infoDiv = false;
			this.$el.blur();
		},
		showInfo () {
			this.infoDiv = true;
			this.$el.focus();
		},
     toggleInfo() {
      if (this.infoDiv) {
				this.hideInfo();
			} else {
				this.showInfo();
			}
    }
  }
};
</script>

<style scoped lang="scss">
.bg-green {
  background-color: #2ecc71 !important;
}

.bt-1 {
  border-top: 1px solid #d3dfe4;
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

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
}
/* Hide default HTML checkbox */
.switch input {
  display: none;
}

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

.back_link {
  color: #6d6d88 !important;
}

.survey_qs {
  font-weight: 600;
  color: #666769;
}

.add {
  width: 120px;
  height: 30px;
  border-radius: 4px;
  background-color: #1e8fe1;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  border: none;
}

.left-margin {
  margin-left: 20px;
}

.divider {
  width: 1080px;
  height: 1px;
  background-color: #d3dfe4;
  margin-top: 30px;
}

.email-div {
  margin-top: 30px;
  margin-bottom: 50px;

  .heading {
    font-size: 20px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #666669;
  }

  .email-div1 {
    margin-top: 20px;

    .txt {
      font-size: 16px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #666669;
    }

    .txt1 {
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #666669;
    }
  }

  .email-div2 {
    margin-top: 30px;

    .heading {
      font-size: 16px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #666669;
    }

    input[type="text"] {
      width: 300px;
      height: 40px;
      border-radius: 3px;
      border: 1px solid #d3dfe4;
      padding: 10px 8px;
    }

    input[type="text"]::placeholder {
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #c5d1d6;
    }
  }

  .email-div3 {
    margin-top: 20px;

    .txt {
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #666669;
    }

    .txt-remove {
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #f16559;
      padding-left: 20px;
      cursor: pointer;
    }
  }
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
  display: block;
}

.is-danger {
  border-width: 2px;
  border-radius: 5px;
  border-color: #f16559 !important;
}

.recipientBtnDisabled {
  opacity: 0.5;
}

.checkbox_position {
  position: relative;
  top: 2px;
}

.info-circle-div {
  width: 330px;
  background-color: #ffffff;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #666669;
  padding: 15px 18px;
  position: absolute;
  border-radius: 3px;
  margin-left: 270px;
  margin-top: -70px;
  border: 1px solid #dbe5e9;
}
.site-team {
  width: 390px;
  margin-top: -63px;
}

.info-circle {
  padding: 0 15px;
}

</style>
