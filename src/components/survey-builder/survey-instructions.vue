<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="fw-bold fs-24" style="color:#333;">Instructions (optional)</div>
          <div class="pb-10">
            Add some instructions for your participants. This is an optional step.
            <span
              class="color_blue"
            >View an example</span> of what it looks like in the app.
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-0">
              <draggable
                v-model="introQuestions"
                :options="{ disabled: draggable }"
                @start="drag=true"
                @end="drag=false"
                @change="onDrag()"
              >
                <div class v-for="question in introQuestions">
                  <div
                    class="card read_only_card cursor_grab"
                    v-if="question.sequence != selectedQuestion.sequence"
                  >
                    <div class="row">
                      <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12 p-0">
                        <div class="instuction_title">{{question.title}}</div>
                        <div class="instruction_info" v-html="question.information"></div>
                      </div>
                      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 p-0 text-right">
                        <button
                          class="btn btn-default color_blue br-2"
                          v-on:click="editQuestion(question)"
                        >Edit</button>
                      </div>
                    </div>
                  </div>
                  <div
                    class="card add_edit_card"
                    v-if="question.sequence == selectedQuestion.sequence"
                  >
                    <div class>
                      <div class>Title:</div>
                      <input
                        type="text"
                        class="form-control input-style br-2"
                        placeholder="Tell us how severe your pain is"
                        v-model="question.title"
                      />
                    </div>
                    <div class="pt-20">
                      <div class>Details:</div>
                      <quill-editor
                        class="bg-white"
                        ref="privacyPolicyEditor"
                        v-model="question.information"
                        :options="editorOption"
                      ></quill-editor>
                    </div>
                    <div class="row pt-20">
                      <div class="pb-10">Image:</div>
                      <div class="row">
                        <div class="col-lg-2 pl-0 pr-20" v-if="question.imageUrl">
                          <img class="img_size" :src="question.imageUrl" />
                        </div>
                        <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 p-0">
                          <div class="file_container">
                            <span class="file_container_text">Upload</span>
                            <input
                              type="file"
                              class="form-control-file"
                              id="file_upload"
                              @change="uploadInstructionImage($event)"
                            />
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10 p-0">
                          <span class="pt-10 display-block color_898989">Recommended: 390px by 390px</span>
                        </div>
                      </div>
                    </div>
                    <div class="row pt-20">
                      <div class="col-lg-2 p-0">
                        <button
                          class="btn btn-link color_red"
                          v-on:click="deleteQuestion(question)"
                          v-if="question.id"
                        >Delete</button>
                      </div>
                      <div class="col-lg-10 p-0 text-right">
                        <button
                          class="btn btn-link br-25 width60"
                          v-on:click="cancelQuestion(question)"
                        >Cancel</button>
                        <button
                          class="btn btn-success save_btn br-25"
                          v-on:click="saveIntroQuestion(question)"
                        >Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </draggable>
              <div class>
                <div class="row">
                  <div
                    class="col-xs-12 col-sm-4 col-sm-offset-0 col-md-3 col-lg-3 p-0 col-md-offset-0 col-lg-offset-0"
                  >
                    <button
                      type="button"
                      class="btn btn-md button_add_new br-25"
                      v-on:click="addNewScreen()"
                    >Add another screen</button>
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
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="goToSurveyQuestions()">Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import _ from "lodash";
import swal from "sweetalert2";
import draggable from "vuedraggable";
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "surveyabout",
  data() {
    return {
      draggable: false,
      questionAnswers: [],
      introQuestions: [],
      questionsWithoutCompletion: [],
      selectedQuestion: {
        createdTime: null,
        id: null,
        information: null,
        title: null,
        type: "SurveyInstruction",
        sequence: 1,
        imageUrl: null,
        imageId: null
      },
      selectedQuestionCopy: {
        createdTime: null,
        id: null,
        information: null,
        title: null,
        type: "SurveyInstruction",
        sequence: 1,
        imageUrl: null,
        imageId: null
      },
      editorOption: {
        placeholder: "Enter your study consent",
        modules: {
          toolbar: [["link"]]
        }
      }
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    if (this.surveyId !== 0) {
      this.getSurveyDetails();
    }
  },
  components: { studyFeatureHeader, draggable },
  methods: {
    goBack() {
      this.$router.replace({
        name: "survey-details",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
      // window.history.back();
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
            this.introQuestions = _.filter(
              response.body.questions,
              o => o.type && o.type.toLowerCase() === "surveyinstruction"
            ); // eslint-disable-line
            this.questionAnswers = _.filter(
              response.body.questions,
              o => o.type && o.type.toLowerCase() !== "surveyinstruction"
            );
            this.questionsWithoutCompletion = _.filter(
              this.surveyData.questions,
              o => o.type && o.type.toLowerCase() !== "surveycompletion"
            );
          }
          if (this.introQuestions.length === 0) {
            this.draggable = true;
            this.selectedQuestion = {
              createdTime: null,
              id: null,
              information: null,
              title: null,
              type: "SurveyInstruction",
              sequence: this.getIndexForNewScreen()
            };
            this.introQuestions.push(this.selectedQuestion);
          } else {
            this.selectedQuestion = {};
          }
        },
        error => {
          this.draggable = true;
          this.errorMsg = error.body ? error.body.message : "Error";
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the survey details"
          );
        }
      );
    },
    uploadInstructionImage() {
      const fd = new FormData();
      const input = window.document.getElementById("file_upload");
      fd.append("image", input.files[0]);
      fd.append("sequence", this.selectedQuestion.sequence);
      fd.append(
        "previousImageId",
        this.selectedQuestion && this.selectedQuestion.imageId
          ? this.selectedQuestion.imageId
          : ""
      );
      fd.append(
        "imageId",
        `img_id_${Math.random()
          .toString(36)
          .substr(2, 10)}`
      );
      this.$api.imageUploadFact(this.studyId, this.surveyId, fd).then(
        response => {
          this.selectedQuestion.imageUrl = response.body.imageUrl;
          this.selectedQuestion.imageId = response.body.imageId;
          // this.selectedQuestion.sequence = response.body.sequence;
          const introScreenIndex = _.findIndex(this.introQuestions, [
            "sequence",
            this.selectedQuestion.sequence
          ]);
          this.selectedQuestion.title = this.introQuestions[
            introScreenIndex
          ].title;
          this.selectedQuestion.information = this.introQuestions[
            introScreenIndex
          ].information;
          this.introQuestions.splice(
            introScreenIndex,
            1,
            this.selectedQuestion
          );
          toastr.success("Image uploaded successfully");
          window.$('#file_upload[type="file"]').val(null);
        },
        error => {
          this.errorMsg = error.body
            ? error.body.message
            : "Error while uploading the image.";
          toastr.error(this.errorMsg);
        }
      );
    },
    saveIntroQuestion(question) {
      if (question.title && question.information) {
        if (!question.id) {
          this.$api.addQuestionFact(this.studyId, this.surveyId, question).then(
            response => {
              const introScreenIndex = _.findIndex(this.introQuestions, [
                "index",
                response.body.index
              ]);
              this.introQuestions.splice(introScreenIndex, 1, response.body);
              const introScreenIndexComplete = _.findIndex(
                this.questionsWithoutCompletion,
                ["index", response.body.index]
              );
              this.questionsWithoutCompletion.splice(
                introScreenIndexComplete,
                1,
                response.body
              );
              this.selectedQuestion = {};
              this.draggable = false;
              toastr.success("Instruction added successfully");
            },
            error => {
              this.errorMsg = error.body ? error.body.message : "Error";
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while adding the introduction screen"
              );
            }
          );
        } else {
          this.$api
            .updateQuestionFact(
              this.studyId,
              this.surveyId,
              question.id,
              question
            )
            .then(
              response => {
                const introScreenIndex = _.findIndex(this.introQuestions, [
                  "id",
                  response.body.id
                ]);
                this.introQuestions.splice(introScreenIndex, 1, response.body);
                const introScreenIndexComplete = _.findIndex(
                  this.questionsWithoutCompletion,
                  ["index", response.body.index]
                );
                this.questionsWithoutCompletion.splice(
                  introScreenIndexComplete,
                  1,
                  response.body
                );
                this.selectedQuestion = {};
                this.draggable = false;
                toastr.success("Instruction updated successfully");
              },
              error => {
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while updating the instruction"
                );
              }
            );
        }
      } else {
        toastr.error("Please fill the required fields");
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
          const selectedQuestion = question;
          this.$api
            .deleteQuestionFact(this.studyId, this.surveyId, question.id)
            .then(
              () => {
                const introScreenIndex = _.findIndex(this.introQuestions, [
                  "id",
                  selectedQuestion.id
                ]);
                this.introQuestions.splice(introScreenIndex, 1);
                const introScreenIndexComplete = _.findIndex(
                  this.questionsWithoutCompletion,
                  ["id", selectedQuestion.id]
                );
                this.questionsWithoutCompletion.splice(
                  introScreenIndexComplete,
                  1
                );
                this.draggable = false;
                if (this.introQuestions.length === 0) {
                  this.selectedQuestion = {
                    createdTime: null,
                    id: null,
                    information: null,
                    title: null,
                    type: "SurveyInstruction",
                    sequence: this.getIndexForNewScreen()
                  }; // eslint-disable-line
                  this.introQuestions.push(this.selectedQuestion);
                  this.draggable = true;
                } else {
                  this.selectedQuestion = {};
                }
                toastr.success("Instruction screen deleted successfully");
              },
              error => {
                toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while deleting the introduction screen"
                );
              }
            );
        }
      });
    },
    editQuestion(question) {
      this.selectedQuestion = _.cloneDeep(question);
      this.draggable = true;
      this.selectedQuestionCopy = _.cloneDeep(question);
    },
    cancelQuestion() {
      swal({
        title:
          "You have not saved your progress. Are you sure you want to leave? Your changes will not be saved. ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#34537d",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.removeEmptyScreen();
          this.draggable = false;
          this.selectedQuestion = {
            createdTime: null,
            id: null,
            information: null,
            title: null,
            type: "SurveyInstruction",
            sequence: this.getIndexForNewScreen()
          }; // eslint-disable-line
          if (
            this.selectedQuestionCopy.imageUrl &&
            this.selectedQuestionCopy.imageId
          ) {
            const editedQuestionIndex = _.findIndex(this.introQuestions, [
              "sequence",
              this.selectedQuestionCopy.sequence
            ]);
            this.introQuestions.splice(
              editedQuestionIndex,
              1,
              this.selectedQuestionCopy
            );
            const editedCompletedIndex = _.findIndex(
              this.questionsWithoutCompletion,
              ["sequence", this.selectedQuestionCopy.sequence]
            ); //eslint-disable-line
            this.questionsWithoutCompletion.splice(
              editedCompletedIndex,
              1,
              this.selectedQuestionCopy
            ); //eslint-disable-line
          }
          if (this.introQuestions.length === 0) {
            this.draggable = true;
            this.introQuestions.push(this.selectedQuestion);
          }
        }
      });
    },
    onDrag() {
      const sortedSequence = _.sortBy(_.map(this.introQuestions, "sequence"));
      this.introQuestions.forEach((item, index) => {
        //eslint-disable-line
        if (item.type !== "SurveyCompletion") {
          this.introQuestions[index].sequence = sortedSequence[index];
        }
      });
      let send = this.introQuestions.concat(this.questionAnswers);
      send = _.sortBy(send, "sequence");
      this.$api
        .updateInstructionScreenOrderFact(this.studyId, this.surveyId, send)
        .then(
          () => {},
          error => {
            toastr.error(error);
          }
        );
    },
    removeEmptyScreen() {
      const tempScreens = _.cloneDeep(this.introQuestions);
      _.forEach(tempScreens, (s, sequence) => {
        if (!s.id) {
          this.introQuestions.splice(sequence, 1);
        }
        if (s.id && s.id === this.selectedQuestion.id) {
          this.introQuestions.splice(sequence, 1, this.selectedQuestion);
        }
      });
    },
    getIndexForNewScreen() {
      const sequence = this.questionsWithoutCompletion.length
        ? Number(_.max(_.map(this.questionsWithoutCompletion, "sequence"))) + 1
        : 1; //eslint-disable-line
      return sequence;
    },
    addNewScreen() {
      this.removeEmptyScreen();
      this.draggable = true;
      this.selectedQuestion = {
        id: null,
        sequence: this.getIndexForNewScreen(),
        title: "",
        type: "SurveyInstruction"
      };
      this.introQuestions.push(this.selectedQuestion);
    },
    goToSurveyQuestions() {
      if (!this.selectedQuestion.title && !this.selectedQuestion.information) {
        if (this.introQuestions.length > 0) {
          this.$router.push({
            name: "survey-questions",
            params: { studyId: this.studyId, surveyId: this.surveyId }
          });
        } else {
          toastr.error("Please add atleast one instruction  screen");
        }
      } else {
        toastr.error("Please save or cancel your changes to continue.");
      }
    },
    skipForNow() {
      this.$router.push({
        name: "survey-questions",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
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
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 16px;
  padding: 16px;
  margin: 16px auto;
  width: 100%;
  /*max-width: 980px;*/
  .label {
    color: #555;
    font-size: 18px;
    padding: 5px;
    display: -webkit-box;
    display: flex;
  }
  .file_container [type="file"] {
    cursor: inherit;
    display: block;
    font-size: 20px;
    filter: alpha(opacity=0);
    width: 100px;
    height: 40px;
    max-height: 50px;
    max-width: 200px;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;
    left: 0;
  }
  .save_btn {
    width: 100px;
  }
  .file_container {
    margin-top: 5px;
    color: #555;
    width: 150px;
  }
  .file_container [type="file"] {
    cursor: pointer;
  }
  .file_container_text {
    background-color: #ddd;
    padding: 5px;
    width: 100%;
    display: block;
    border-radius: 4px;
    text-align: center;
  }
  .text-style {
    padding: 10px;
    font-size: 14px;
    color: #bdbbbb;
  }
}
.form-control-file {
  width: 100% !important;
  max-width: 150px !important;
}
.img_size {
  width: 100%;
  height: 100%;
  max-width: 100px;
  max-height: 100px;
}
.read_only_card {
  background-color: #f5f8fa;
  border: 1px solid #d3dfe4;
  border-left: 8px solid #d3dfe4;
  .instuction_title {
    word-break: break-all;
    font-size: 18px;
    font-weight: bold;
  }
  .instruction_info {
    word-break: break-all;
  }
}
.add_edit_card {
  background-color: #f5f8fa;
  box-shadow: 0px 0px 4px #ddd;
}
.button_add_new {
  color: #f16559;
  border: solid 1px #f16559;
  background-color: transparent;
}
.preview-btn {
  padding: 6px 25px;
  background-color: #d4f2ff;
  position: relative;
}
.icon-style {
  font-size: 47px;
  position: absolute;
  left: 10px;
  top: -26px;
}
.form-control {
  border-radius: 2px;
}
</style>
