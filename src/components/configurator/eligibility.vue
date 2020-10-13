<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20">
        <p
          class="pt-25 m-0 fs-16"
        >Setup the questions you will ask subjects/patients to confirm they are suitable for your study.</p>

        <h2 class="color_slate-grey">Eligibility screener</h2>
        <div class v-for="(question, index) in questions">
          <div class="card read_only_question" v-if="question.index !== selectedQuestion.index">
            <div class="row">
              <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
                <h5 class="font-style">Question {{index + 1}}</h5>
                <h5 class="header-style">{{question.body}}</h5>
                <div v-for="selectOption in question.options">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-8 p-0">
                    <span class="color_aa fs-12">If {{selectOption.label}}: &nbsp;</span>
                    <span class="fs-14" v-if="selectOption.eligible">Eligible</span>
                    <span class="fs-14" v-if="!selectOption.eligible">Not eligible</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 pr-0">
                <button
                  class="btn btn-block edit-btn mt-30"
                  v-on:click="editQuestion(question)"
                >Edit</button>
              </div>
            </div>
          </div>
          <div class="card edit_only_question" v-if="question.index === selectedQuestion.index">
            <h5 class="font-style">Question {{index + 1}}</h5>
            <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 p-0 pb-15">
              <select
                class="form-control type_select"
                v-model="selectedQuestion.type"
                v-on:change="questionTypeChanged(selectedQuestion)"
              >
                <option
                  v-for="questionType in questionTypes"
                  :value="questionType.value"
                  :disabled="questionType.value === 'Default'"
                  :selected="questionType.value === 'Default'"
                >{{questionType.label}}</option>
              </select>
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="selectedQuestion.body"
                placeholder="Enter your eligibility question"
                :disabled="selectedQuestion.type === 'Default'"
              />
            </div>
            <div
              v-if="selectedQuestion.type && selectedQuestion.type.toLowerCase() === 'boolean'"
              class
            >
              <h4>Answers:</h4>
              <div class="row form-group" v-for="option in selectedQuestion.options">
                <div class="pt-20">
                  <div class="row padding-top">
                    <div class="col-lg-1 col-md-1 p-0">{{option.label}}</div>
                    <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 branch_section">
                      <span>If this answer:</span>
                      <select class="form-control select-style" v-model="option.eligible">
                        <option value="true">Eligible</option>
                        <option value="false">Not Eligible</option>
                      </select>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 branch_section">
                      <span>If this answer, go to:</span>
                      <select
                        class="form-control select-style"
                        v-model="selectedQuestion.options[1].nextQuestion"
                        disabled
                      >
                        <option
                          :value="question.id"
                          v-for="question in questions"
                          v-if="selectedQuestion.id !== question.id && selectedQuestion.sequence < question.sequence"
                        >Question {{question.sequence}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="selectedQuestion.type && selectedQuestion.type.toLowerCase() === 'multichoice'"
              class
            >
              <h4>Answers:</h4>
              <div class="row form-group" v-for="option in selectedQuestion.options">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                  <input
                    type="text"
                    class="form-control input-style"
                    placeholder="Enter an answer choice"
                    v-model="option.label"
                  />
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 branch_section">
                  <span>If this answer:</span>
                  <select class="form-control select-style" v-model="option.eligible">
                    <option value="true">Eligible</option>
                    <option value="false">Not Eligible</option>
                  </select>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 branch_section">
                  <span>If this answer, go to:</span>
                  <select class="form-control select-style" v-model="option.nextQuestion" disabled>
                    <option
                      :value="question.id"
                      v-for="question in questions"
                      v-if="selectedQuestion.id !== question.id && selectedQuestion.sequence < question.sequence"
                    >Question {{question.sequence}}</option>
                  </select>
                </div>
              </div>
              <div class="link-style">
                <a v-on:click="addAnotherAnswer()">Add another answer</a>
              </div>
            </div>
            <div class="row pt-20">
              <div class="col-lg-9 col-md-9 col-sm-6 col-xs-2 p-0">
                <button
                  class="btn btn-link color_red pl-0"
                  v-if="question.id"
                  v-on:click="deleteQuestion(selectedQuestion)"
                >Delete</button>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-xs-10 text-right p-0">
                <button
                  class="btn btn-link color_aa"
                  v-on:click="cancelQuestion(selectedQuestion)"
                >Cancel</button>
                <button
                  class="btn btn-success save_btn br-30"
                  v-on:click="saveQuestion(selectedQuestion)"
                >Save</button>
              </div>
            </div>
          </div>
        </div>
        <div class="row pb-20">
          <div class="col-md-8 col-sm-8 col-xs-12 p-0">
            <button
              type="button"
              class="btn btn-md mb-20 button-blue-1 add-btn br-30"
              v-on:click="addNewQuestion()"
            >Add another screen</button>
          </div>
          <div class="col-md-4 col-sm-4 col-xs-12 p-0">
            <div class="misplaced-card">
              <div class="color_blue">
                <div class="p-10">
                  <span class="pr-10">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </span>If not eligible
                </div>
              </div>
              <div class="pl-10 pr-10 pb-10">
                Individual is presented with a “not eligible”
                <span
                  class="cursor_pointer underline"
                  data-toggle="modal"
                  data-target="#notEligibleModal"
                >screen</span> and prevented from moving forward with registration.
              </div>
            </div>
          </div>
        </div>
        <div class="back_link pb-10">
          <span v-on:click="goBack()">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
          </span>
        </div>
      </div>
    </div>
    <div id="notEligibleModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header border-none p-0">
            <button type="button" class="close close pr-30 pt-25" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 text-right text-center-xs p-0">
                <img src="static/img/graphic-not-eligible.svg" alt class="img-size" />
              </div>
              <div
                class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-justify text-center-xs pt-10-xs pt-80 fs-12"
              >
                <div>
                  The welcome carousel gives you the opportunity to present study or app details before registration or sign
                  in.
                </div>
                <div
                  class="pt-10"
                >Topics could include, “what this study is about,” “how this study works,” or “who is running this study.”</div>
              </div>
            </div>
          </div>
        </div>
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
          <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
        </div>
        <div class="row" v-if="!isStudySummary">
          <button class="btn br-25 disable-btn mr-10 skipBtn" v-on:click="skipForNow()">Skip for now</button>
          <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
        </div>
      </div>
    </div>
    <CancelModal ref="cancelConfirmation" />
    <!--<router-link type="button" class="btn skipBtn br-25" :to="{name:'participant-surveys', params: { studyId: studyId }}" disabled>Skip for now</router-link>-->
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import swal from "sweetalert2";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "eligibility",
  data() {
    return {
      questionTypes: [
        { value: "Default", label: "- Select a question type -" },
        { value: "MultiChoice", label: "Multiple Choice" },
        { value: "Boolean", label: "Yes or No" }
      ],
      questions: [],
      selectedQuestion: {
        id: "",
        index: "",
        type: "Default",
        body: "",
        options: [],
        expectedAnswers: []
      },
      studyId: null,
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.getEligibility();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    questionTypeChanged(selectedQuestion) {
      if (selectedQuestion.type) {
        const questionType = selectedQuestion.type.toLowerCase();
        switch (questionType) {
          case "multichoice":
            this.selectedQuestion.options = [
              { label: "", value: 1, eligible: false, nextQuestion: "" },
              { label: "", value: 2, eligible: false, nextQuestion: "" }
            ];
            break;
          case "boolean":
            this.selectedQuestion.options = [
              { label: "Yes", value: 1, eligible: false, nextQuestion: "" },
              { label: "No", value: 2, eligible: false, nextQuestion: "" }
            ];
            break;
          default:
            break;
        }
      }
    },
    addAnotherAnswer() {
      if (!this.selectedQuestion.options) {
        this.selectedQuestion.options = [];
      }
      this.selectedQuestion.options.push({
        label: "",
        value: this.selectedQuestion.options.length + 1,
        eligible: false,
        nextQuestion: ""
      }); // eslint-disable-line
    },
    getEligibility() {
      this.$api.getEligibilityFact(this.studyId).then(response => {
        this.questions = response.body;
        if (this.questions.length === 0) {
          this.selectedQuestion = {
            index: 1,
            type: "Default",
            body: "",
            expectedAnswers: [],
            options: [
              { label: "", value: 1, eligible: false, nextQuestion: "" },
              { label: "", value: 2, eligible: false, nextQuestion: "" }
            ]
          };
          this.questions.push(this.selectedQuestion);
        } else {
          this.selectedQuestion = {};
        }
      });
    },
    addNewOrEditQuestionToList(question) {
      const currentQuestion = question;
      currentQuestion.options = [
        { option: "Yes", eligible: true, nextQuestion: "" },
        { option: "No", eligible: false, nextQuestion: "" }
      ];
      const questionIndex = _.findIndex(this.questions, [
        "index",
        currentQuestion.index
      ]);
      this.questions.splice(questionIndex, 1, currentQuestion);
      this.selectedQuestion = {};
    },
    checkValidity() {},
    saveQuestion(question) {
      question.expectedAnswers = []; //eslint-disable-line
      if (question.body) {
        const eligibleQuestions = _.filter(
          question.options,
          o => o.eligible === true || o.eligible === "true"
        );
        // const notEligibleQuestions = _.filter(
        //   question.options,
        //   o => o.eligible === false || o.eligible === 'false',
        // );
        if (eligibleQuestions.length > 0) {
          question.options.forEach((o, index) => {
            if (o.eligible === true || o.eligible === "true") {
              question.expectedAnswers.push(index + 1);
            }
          });
          if (!question.id) {
            this.$api.postEligibilityQuestionFact(this.studyId, question).then(
              response => {
                const questionIndex = _.findIndex(this.questions, [
                  "index",
                  response.body.index
                ]);
                this.questions.splice(questionIndex, 1, response.body);
                this.selectedQuestion = {};
                toastr.success("Eligibility question added succesfully");
              },
              error => {
                toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while sending the data to server"
                );
              }
            );
          } else {
            this.$api
              .updateEligibilityQuestionFact(
                this.studyId,
                question.id,
                question
              )
              .then(
                response => {
                  const questionIndex = _.findIndex(this.questions, [
                    "id",
                    response.body.id
                  ]);
                  this.questions.splice(questionIndex, 1, response.body);
                  this.selectedQuestion = {};
                  toastr.success("Eligibility question updated succesfully");
                },
                error => {
                  toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : "Error while sending the data to server"
                  );
                }
              );
          }
        } else {
          toastr.error("At least one answer must be set as eligible.");
        }
      } else {
        toastr.error("Please add question body");
      }
    },
    deleteQuestion(question) {
      swal({
        title: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api
            .deleteEligibilityQuestionFact(this.studyId, question.id)
            .then(
              () => {
                const questionIndex = _.findIndex(this.questions, [
                  "id",
                  question.id
                ]);
                this.questions.splice(questionIndex, 1);
                this.selectedQuestion = {};
                toastr.success("Eligibility question deleted succesfully");
              },
              error => {
                toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while deleting the eligibility question"
                );
              }
            );
        }
      });
    },
    getIndexForNewScreen() {
      const highestValObj = _.maxBy(this.questions, o => o.index);
      return highestValObj && highestValObj.index ? highestValObj.index + 1 : 1;
    },
    addNewQuestion() {
      this.removeEmptyQuestion();
      this.selectedQuestion = {
        index: this.getIndexForNewScreen(),
        type: "Default",
        body: "",
        expectedAnswers: [],
        options: [
          { label: "Yes", value: 1, eligible: false, nextQuestion: "" },
          { label: "No", value: 2, eligible: false, nextQuestion: "" }
        ]
      };
      this.questions.push(this.selectedQuestion);
    },
    cancelQuestion() {
      this.removeEmptyQuestion();
      this.selectedQuestion = {
        index: this.getIndexForNewScreen(),
        type: "Default",
        body: "",
        expectedAnswers: [],
        options: [
          { label: "", value: 1, eligible: false, nextQuestion: "" },
          { label: "", value: 2, eligible: false, nextQuestion: "" }
        ]
      };
      if (this.questions.length === 0) {
        this.questions.push(this.selectedQuestion);
      }
    },
    removeEmptyQuestion() {
      const tempQuestions = _.cloneDeep(this.questions);
      _.forEach(tempQuestions, (s, index) => {
        if (!s.id) {
          this.questions.splice(index, 1);
        }
      });
    },
    editQuestion(question) {
      this.removeEmptyQuestion();
      this.selectedQuestion = _.cloneDeep(question);
    },
    goToNextPage() {
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
    nextClick() {
      if (!this.selectedQuestion.body) {
        let notEligible = false;
        this.questions.forEach(item => {
          item.options.forEach(option => {
            if (!option.eligible) {
              notEligible = true;
            }
          });
        });
        this.removeEmptyQuestion();
        if (this.questions.length <= 0) {
          this.addNewQuestion();
          toastr.error("Please add eligibility questions");
        } else if (!notEligible) {
          toastr.error(
            "At least one answer must be set as not eligible among questions."
          );
        } else {
          this.goToNextPage();
        }
      } else {
        toastr.error("Please save or cancel your changes to continue.");
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

.color_aa {
  color: #aaa;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.read_only_question {
  border-left: 8px solid #d3dfe4 !important;
}
.edit_only_question {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.misplaced-card {
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}
.button-blue-1 {
  border: 1px solid#1f95f2;
  color: #1f95f2;
  background: transparent;
}
.add-btn {
  border: 1px solid#f06559;
  color: #f06559;
  font-size: 14px;
  min-width: 150px;
}
.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 5px 20px 10px 20px;
  margin: 10px 0px 20px 0px;
}
.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
}
.form-control {
  border-radius: 2px;
}
.header-style {
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: 0.2px;
  color: #666769;
  word-break: break-all;
}
.branch_section {
  position: relative;
  top: -20px;
}
.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.save_btn {
  width: 100px;
}
.img-size {
  height: 320px;
  width: 185px;
}
.text-justify {
  text-align: justify !important;
}
</style>
