<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="pl-20 pr-20">
          <p
            class="consent-header color_slate-grey"
          >Setup your consent process with our eConsent element.</p>
          <h3 class="pb-5 header_title fw-bold">Consent education</h3>
          <p>
            These topics will be presented to your participants as a
            <span
              class="color_blue cursor_pointer underline"
              data-toggle="modal"
              data-target="#seriesOfScreensModal"
            >series of screens</span> that your participants will be required to read. You may add, modify, or rearrange as you see fit.
          </p>
          <div v-if="consentSections.length !== 0">
            <h6
              class="pt-10 fw-bold fs-12 color_slate-grey"
            >{{consentSections.length}} screens total</h6>
            <a
              class="color_blue fs-12 cursor_pointer"
              v-if="collapse"
              v-on:click="collapseFunc"
            >Collapse</a>
            <a class="color_blue fs-12 cursor_pointer" v-if="expand" v-on:click="expandFunc">Expand</a>
          </div>
          <div class="row card read_only_card mt-15" v-if="consentSections.length === 0">
            <h6 class="color_blue">There are no screens to preview</h6>
          </div>

          <div v-if="expand">
            <div class="row card read_only_card img-size-welcome mt-15">
              <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 pl-0">
                <h5 class="font-style">{{consentSections[0].sectionTitle}}</h5>
                <div class="pb-10">{{consentSections[0].sectionSummary}}</div>
              </div>
              <div class="col-lg-1 col-md-11 col-sm-11 col-xs-11">
                <button class="edit-btn mt-15 ml-10" v-on:click="expandFunc">Edit</button>
              </div>
            </div>
            <div class="card stack1"></div>
            <div class="card stack2"></div>
            <div class="card stack3"></div>
            <div class="card stack4" v-if="consentSections.length > 3"></div>
          </div>
          <div v-if="consentSections.length > 0 && collapse">
            <draggable
              v-model="consentSections"
              :options="{ disabled: draggableSection }"
              @start="drag=true"
              @end="drag=false"
              @change="onDragSections()"
            >
              <div class="row" v-for="section in consentSections" :key="section.sectionId">
                <div
                  class="row card read_only_card cursor_grab"
                  v-if="selectedConsentSection.sectionId !== section.sectionId"
                >
                  <div class="col-lg-11 col-md-10 col-sm-9 col-xs-8 pl-0">
                    <h5 class="font-style">{{section.sectionTitle}}</h5>
                    <div class="pb-10">{{section.sectionSummary}}</div>
                  </div>
                  <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 text-right">
                    <button
                      class="edit-btn mt-15 ml-10"
                      v-on:click="editConsentSection(section)"
                    >Edit</button>
                  </div>
                </div>
                <div
                  class="row mt-20"
                  v-if="selectedConsentSection.opType === 'toEdit' && selectedConsentSection.sectionId === section.sectionId"
                >
                  <addEditConsent :options="selectedConsentSection"></addEditConsent>
                </div>
              </div>
            </draggable>
          </div>
          <div
            class="row mt-20"
            v-if="selectedConsentSection.opType === 'toAdd' && !selectedConsentSection.sectionId"
          >
            <addEditConsent :options="selectedConsentSection"></addEditConsent>
          </div>
          <button
            type="button"
            class="btn btn-md mb-20 add-btn mt-15 br-25"
            v-if="collapse"
            v-on:click="addNewScreen()"
          >Add another screen</button>
          <h3 class="pt-20 header_title fw-bold">Consent</h3>
          <div class="card read_only_screen" v-if="consentDocReadMode">
            <div class="row">
              <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 p-0">
                <div class="doc_desc" v-html="consentDocData.htmlDocument"></div>
                <div class="fs-14 pb-10 color_blue pt-10" v-if="consentDocData.pdfName">
                  <span class="icon_section">
                    <span class="fa fa-file"></span>
                  </span>
                  {{consentDocData.pdfName}}
                </div>
              </div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 p-0">
                <div class="row text-right">
                  <button
                    class="edit-btn mt-15 ml-10"
                    v-on:click="editConsentDocumentScreen(consentDocData)"
                  >Edit</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-if="!consentDocReadMode">
            <div class="card edit_only_screen pt-20">
              <p>Enter and format your study consent.</p>
              <div v-if="!consentDocReadMode">
                <quill-editor
                  class="bg-white"
                  ref="myTextEditor"
                  v-model="consentDocData.htmlDocument"
                  :options="editorOptionsMore"
                ></quill-editor>
              </div>
              <div class="row mt-20">
                <div class="fs-14 pb-10" v-if="!consentDocReadMode">
                  Upload a PDF or Word Doc of your study consent.
                  <span class="fw-500">
                    Please make sure the consent you have entered above matches this consent
                    PDF or Word Doc. This will be emailed to your participant during registration.
                  </span>
                </div>
                <div class="row pt-10">
                  <div
                    class="col-xs-12 col-sm-4 col-md-4 p-0"
                    v-if="(fileSelected && !consentDocData.pdfLink) || consentDocData.pdfName"
                  >
                    <div
                      class="fs-14 color_blue pb-5"
                      v-if="fileSelected && !consentDocData.pdfLink"
                    >
                      <span class="icon_section">
                        <span class="fa fa-file"></span>
                      </span>
                      {{fileSelected}}
                    </div>
                    <div class="fs-14 color_blue pb-5" v-if="consentDocData.pdfName">
                      <span class="icon_section">
                        <span class="fa fa-file"></span>
                      </span>
                      {{consentDocData.pdfName}}
                    </div>
                    <div
                      class="color_red fs-12 cursor_pointer"
                      v-on:click="removeConsentFile(consentDocData)"
                    >Remove consent file</div>
                  </div>
                  <div class="col-xs-12 col-sm-8 col-md-8 p-0">
                    <div class>
                      <div class="file-upload">
                        <input
                          type="file"
                          class="file-input"
                          id="consent_section_doc"
                          v-on:change="onDocFileSelection($event)"
                          accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        />
                        <span class="fs-12">Upload</span>
                      </div>
                      <span>.pdf, .doc, .docx</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row text-right pt-10">
                <button class="btn btn-link pb-15 color_grey" v-on:click="cancelScreen()">Cancel</button>
                <button
                  class="btn btn-success save_btn mb-10"
                  v-on:click="saveConsentDocumentScreen(consentDocData)"
                >Save</button>
              </div>
            </div>
          </div>
          <div>
            <h3 class="pt-20 header_title fw-bold">Comprehension quiz</h3>
            <p>
              To validate that your participants fully understand the consent educational materials, a comprehensive quiz will
              be presented to them. This should be a short quiz with
              <span class="fw-bold">three (3) to five (5)</span> questions.
            </p>
            <draggable
              v-model="quizQuestions"
              :options="{ disabled: draggableQuiz }"
              @start="drag=true"
              @end="drag=false"
              @change="onDragQuiz()"
            >
              <div
                class="row"
                v-for="(question, index) in quizQuestions"
                :key="question.identifier"
              >
                <div
                  class="row card edit_only_screen"
                  v-if="addEditQuizQuestion.identifier !== question.identifier"
                >
                  <div class="col-lg-11 col-md-10 col-sm-9 col-xs-8 pl-0">
                    <h5 class="font-style">{{index + 1}}. {{question.body}}</h5>
                    <div class="pb-10" v-if="question.type=='instruction'">{{question.description}}</div>
                    <div v-if="question.type!='instruction'">
                      <div class="row form-group" v-for="option in question.options">
                        <input
                          type="radio"
                          :checked="option.sequence==question.expectedAnswer"
                          disabled
                        />
                        &nbsp; {{option.body}}
                      </div>
                    </div>
                    <!--<p>{{question.pageContent}}</p>-->
                  </div>
                  <div>
                    <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <button
                        class="edit-btn mt-15 ml-10"
                        v-on:click="editQuizQuestion(question,index)"
                      >Edit</button>
                    </div>
                  </div>
                </div>
                <div
                  class="row pt-10"
                  v-if="addEditQuizQuestion.identifier === question.identifier && addEditQuizQuestion.opType === 'toEdit'"
                >
                  <addEditQuiz :options="addEditQuizQuestion"></addEditQuiz>
                </div>
              </div>
            </draggable>
            <div
              class="pt-10"
              v-if="addEditQuizQuestion.opType === 'toAdd' && !addEditQuizQuestion.identifier"
            >
              <addEditQuiz :options="addEditQuizQuestion"></addEditQuiz>
            </div>
            <button
              type="button"
              class="btn btn-md mb-20 add-btn mt-15 br-25"
              v-on:click="addNewQuizQuestion()"
            >Add a Question</button>
            <!--<h3>Study data sharing options</h3>
            <p class="pt-10">Your participants will be able to choose one of these levels of sharing options. </p>
            <ul class="pb-50">
              <li>Share my data with the research team and its partners.</li>
              <li>Share my data with the research team and qualified researchers worldwide.</li>
            </ul>-->
          </div>
          <div>
            <h3 class="pt-20 header_title fw-bold">Privacy policy</h3>
            <div class="card p-15" v-if="!privacyReadMode">
              <div class="fw-500">Enter and format your privacy policy.</div>
              <quill-editor
                class="bg-white"
                ref="privacyPolicyEditor"
                v-model="privacyPolicy"
                :options="editorOptionsFew"
              ></quill-editor>
              <div class="row text-right pt-10">
                <button
                  class="btn btn-link color_grey"
                  v-on:click="cancelPrivacyPolicy(privacyPolicy)"
                >Cancel</button>
                <button
                  class="btn btn-success save_btn"
                  v-on:click="savePrivacyPolicy(privacyPolicy)"
                >Save</button>
              </div>
            </div>
            <div class="card p-15" v-if="privacyReadMode">
              <div class="row">
                <div class="col-lg-11 col-md-10 col-sm-9 col-xs-8 p-0" v-html="privacyPolicy"></div>
                <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-0 text-right">
                  <button class="edit-btn ml-10" v-on:click="editPrivacyPolicy()">Edit</button>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-20">
            <h3 class="pt-20 header_title fw-bold">License information</h3>
            <div class="license_info" v-html="licenses"></div>
            <!--<textarea class="form-control" rows="12" v-model="licenses" disabled></textarea>-->
          </div>
          <div class="pb-10">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
        <div id="seriesOfScreensModal" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header border-none p-0">
                <button
                  type="button"
                  class="close cursor_pointer close-style"
                  data-dismiss="modal"
                >&times;</button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
                    <div class="text-center">
                      <img src="static/img/econsent/graphic-econsent.svg" alt />
                    </div>
                  </div>
                  <div
                    class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-left text-center-xs pt-100 pt-10-xs fs-12 pl-0"
                  >
                    <div class="align_justify">
                      The consent education screens help inform your participants on what is expected of them, how their data will be secured,
                      and other details about the study before they provide their consent.
                    </div>
                    <div
                      class="align_justify pt-10"
                    >You may add or remove screens as you see fit. This SHOULD NOT replace your informed consent.</div>
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
              <button
                class="btn br-25 continue-btn mr-10"
                v-on:click="nextClick()"
              >Save and Continue</button>
            </div>
            <div class="row" v-if="!isStudySummary">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
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
import draggable from "vuedraggable";
import swal from "sweetalert2";
import studyFeatureHeader from "../common/study-features-header";
import addEditConsent from "../common/add-edit-consent";
import addEditQuiz from "../common/add-edit-quiz";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "econsent",
  data() {
    return {
      selectedConsentSection: {
        sectionId: "",
        sectionType: "default",
        sectionNumber: "",
        sectionTitle: "",
        sectionImage: "",
        sectionImageTemp: "",
        sectionSummary: "",
        sectionHtmlContent: "",
        opType: ""
      },
      consentSections: [],
      quizQuestions: [],
      consentDocReadMode: true,
      fileSelected: null,
      studyData: {},
      branding: {},
      consentDocData: {
        file: null,
        htmlDocument: null,
        pdfLink: null
      },
      privacyPolicyOriginal: null,
      privacyPolicy: null,
      privacyReadMode: false,
      licenses: null,
      addEditQuizQuestion: {
        type: "default",
        body: "",
        sequence: 1,
        description: "",
        expectedAnswer: "",
        options: [{ body: "", sequence: 1 }, { body: "", sequence: 2 }],
        opType: ""
      },
      consentData: null,
      studyId: null,
      expand: false,
      collapse: true,
      addQuiz: false,
      editQuiz: false,
      tempDocData: null,
      editorOptionsMore: {
        placeholder: "Enter your study consent",
        readOnly: false,
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"]
          ]
        }
      },
      editorOptionsFew: {
        placeholder: "Enter your privacy policy",
        readOnly: false,
        modules: {
          toolbar: [["bold", "italic", "underline"], ["clean"]]
        }
      },
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 100;
    }, 1500);
    this.studyId = this.$route.params.studyId;
    this.getDefaultSections();
    this.getStudyDetails();
    this.getBrandingDetails();
    this.getStudyConsentDetails();
  },
  computed: {
    addedConsentSection() {
      return this.$store.getters.getAddedConsentSection;
    },
    addedConsentQuiz() {
      return this.$store.getters.getAddedConsentQuiz;
    },
    draggableSection() {
      //eslint-disable-line
      if (this.consentSections <= 0) {
        return false;
      }
      if (
        this.selectedConsentSection.opType === "toAdd" ||
        this.selectedConsentSection.opType === "toEdit"
      ) {
        return true;
      }
      return false;
    },
    draggableQuiz() {
      if (this.quizQuestions <= 0) {
        return false;
      }
      if (
        this.addEditQuizQuestion.opType === "toAdd" ||
        this.addEditQuizQuestion.opType === "toEdit"
      ) {
        return true;
      }
      return false;
    }
  },
  watch: {
    addedConsentSection: {
      handler(val) {
        if (val) {
          const sectionObj = val;
          if (val.sectionId && val.opType === "delete") {
            this.deleteConsentSection(this.studyId, val.sectionId);
          } else if (!val.sectionId && val.opType === "done") {
            // Section with out sectionId === new section
            const fd = new FormData();
            fd.append("sectionNumber", this.getIndexForNewScreen());
            fd.append("sectionType", sectionObj.sectionType);
            fd.append("sectionTitle", sectionObj.sectionTitle);
            fd.append("sectionImage", sectionObj.sectionImage);
            fd.append("sectionSummary", sectionObj.sectionSummary);
            if (
              sectionObj.sectionHtmlContent &&
              sectionObj.sectionHtmlContent.indexOf("<html><head>") < 0
            ) {
              sectionObj.sectionHtmlContent = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${sectionObj.sectionHtmlContent}</body></html>`;
            }
            fd.append("sectionHtmlContent", sectionObj.sectionHtmlContent);
            this.$api.addConsentSectionFact(this.studyId, fd).then(
              response => {
                this.selectedConsentSection = {};
                this.$store.dispatch(
                  "addConsentSectionAction",
                  this.selectedConsentSection
                );
                toastr.success("Consent added successfully");
                this.consentSections.push(response.data);
              },
              error => {
                this.$store.dispatch("addConsentSectionAction", {});
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while adding the consent section"
                );
              }
            );
          } else if (val.sectionId && val.opType === "done") {
            // Section with sectionId === existing section
            if (
              sectionObj.sectionHtmlContent &&
              sectionObj.sectionHtmlContent.indexOf("<html><head>") < 0
            ) {
              sectionObj.sectionHtmlContent = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${sectionObj.sectionHtmlContent}</body></html>`; // eslint-disable-line
            }
            const fd = new FormData();
            fd.append("sectionId", sectionObj.sectionId);
            fd.append("sectionType", sectionObj.sectionType);
            fd.append("sectionTitle", sectionObj.sectionTitle);
            fd.append("sectionSummary", sectionObj.sectionSummary);
            fd.append("sectionHtmlContent", sectionObj.sectionHtmlContent);
            fd.append("sectionNumber", sectionObj.sectionNumber);
            if (sectionObj.sectionImage) {
              fd.append("sectionImage", sectionObj.sectionImage);
            }
            fd.append("sectionSummary", sectionObj.sectionSummary);
            if (
              sectionObj.sectionHtmlContent &&
              sectionObj.sectionHtmlContent.indexOf("<html><head>") < 0
            ) {
              sectionObj.sectionHtmlContent = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${sectionObj.sectionHtmlContent}</body></html>`;
            }
            fd.append("sectionHtmlContent", sectionObj.sectionHtmlContent);

            this.$api
              .updateConsentSectionFact(this.studyId, sectionObj.sectionId, fd)
              .then(
                response => {
                  toastr.success("Consent updated successfully");
                  const sectionIndex = _.findIndex(this.consentSections, [
                    "sectionId",
                    response.data.sectionId
                  ]);
                  this.consentSections.splice(sectionIndex, 1, response.data);
                  this.selectedConsentSection = {};
                  this.$store.dispatch(
                    "addConsentSectionAction",
                    this.selectedConsentSection
                  );
                },
                error => {
                  this.$store.dispatch("addConsentSectionAction", {});
                  toastr.error(
                    error.body
                      ? error.body.message
                      : "Error while updating the consent section"
                  );
                }
              );
          } else if (val.sectionId && val.opType === "toEdit") {
            this.selectedConsentSection.opType = val.opType;
          } else if (val.sectionId && val.opType === "none") {
            const sectionIndex = _.findIndex(this.consentSections, [
              "sectionId",
              this.selectedConsentSection.sectionId
            ]);
            this.consentSections.splice(
              sectionIndex,
              1,
              this.selectedConsentSection
            );
            this.selectedConsentSection = {};
          } else {
            this.selectedConsentSection = {
              sectionId: "",
              sectionNumber: "",
              sectionTitle: "",
              sectionImage: "",
              sectionSummary: "",
              sectionHtmlContent: "",
              opType: ""
            };
          }
        }
      }
    },
    addedConsentQuiz: {
      handler(val) {
        if (val) {
          const quizObj = val;
          if (val.identifier && val.opType === "delete") {
            this.deleteConsentQuiz(this.studyId, val.identifier);
          } else if (!val.identifier && val.opType === "done") {
            // quiz question with out id === new quiz question
            quizObj.sequence = this.quizQuestions.length + 1;
            this.$api.addConsentQuizFact(this.studyId, quizObj).then(
              response => {
                this.addEditQuizQuestion = {};
                this.$store.dispatch(
                  "addConsentQuizAction",
                  this.addEditQuizQuestion
                );
                toastr.success("Quiz question added successfully");
                this.quizQuestions.push(response.data);
              },
              error => {
                this.$store.dispatch("addConsentQuizAction", {});
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while adding quiz question"
                );
              }
            );
          } else if (val.identifier && val.opType === "done") {
            // quiz question with id === existing quiz question
            this.$api.updateConsentQuizFact(this.studyId, quizObj).then(
              response => {
                toastr.success("Quiz question updated successfully");
                const sectionIndex = _.findIndex(this.quizQuestions, [
                  "identifier",
                  response.data.identifier
                ]);
                this.quizQuestions.splice(sectionIndex, 1, response.data);
                this.addEditQuizQuestion = {};
                this.$store.dispatch(
                  "addConsentQuizAction",
                  this.addEditQuizQuestion
                );
              },
              error => {
                this.$store.dispatch("addConsentQuizAction", {});
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while updating quiz question"
                );
              }
            );
          } else if (val.identifier && val.opType === "toEdit") {
            this.addEditQuizQuestion.opType = val.opType;
          } else if (val.identifier && val.opType === "none") {
            const sectionIndex = _.findIndex(this.quizQuestions, [
              "identifier",
              this.addEditQuizQuestion.identifier
            ]);
            this.quizQuestions.splice(
              sectionIndex,
              1,
              this.addEditQuizQuestion
            );
            this.addEditQuizQuestion = {};
          } else {
            this.addEditQuizQuestion = {
              type: "default",
              body: "",
              sequence: 1,
              description: "",
              expectedAnswer: "",
              options: [{ body: "", sequence: 1 }, { body: "", sequence: 2 }],
              opType: ""
            };
          }
        }
      }
    }
  },
  methods: {
    goBack() {
      window.history.back();
    },
    getDefaultSections() {
      this.$api.getDefaultConsentSectionsFact().then(
        () => {},
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    generateLicenseInfo() {
      if (this.studyData.clientName || this.branding.appName) {
        this.licenses = `This <span id="appName">${
          this.branding.appName
        }</span> ("App") is provided by <span id="clientName">${
          this.studyData.clientName
        }</span> ("Subscriber") under permission granted by the Thread Master Software Agreement ("SaaS") entered into by Subscriber and Thread granting Subscriber the right to use Thread Services (the "Services") to create the App. All Intellectual Property of Thread used in the use and development of the App belongs to Thread and its other providers as indicated in the SaaS. Any rights you obtain in the App are limited to the right to use the App in connection with the Services. You have no rights other that use of the Services in connection with the App and no rights to view or use the underlying source code for the services. <br/><br/> As Thread is not the creator or administrator of the App, Thread provides the App in an "AS IS" condition without warranty. <br/><br/> THREAD MAKES NO, AND HEREBY DISCLAIMS ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, WITH RESPECT TO THE SERVICES PROVIDED, THE APP OR THE AVAILABILITY, FUNCTIONALITY, PERFORMANCE OR RESULTS OF USE OF THE SERVICES. THREAD DISCLAIMS ANY WARRANTY THAT THE SERVICES PROVIDED BY THREAD, OR THE OPERATION THEREOF ARE, OR WILL BE, ACCURATE, ERROR­-FREE OR UNINTERRUPTED. THREAD MAKES NO, AND HEREBY DISCLAIMS ANY, IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION, ANY IMPLIED WARRANTY OF NON-INFRINGEMENT, MERCHANTABILITY, OF FITNESS FOR A PARTICULAR PURPOSE OR ARISING BY USAGE OF TRADE, COURSE OF DEALING OR COURSE OF PERFORMANCE.<br/><br/> THREAD HAS NO LIABILITY WITH RESPECT TO THE SERVICES, OR ITS OTHER OBLIGATIONS UNDER THIS AGREEMENT OR OTHERWISE FOR CONSEQUENTIAL, EXEMPLARY, SPECIAL, INCIDENTAL, OR PUNITIVE DAMAGES (INCLUDING WITHOUT LIMITATION LOSS OF PROFITS AND THE COST OF COVER EVEN IF THREAD HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.<br/><br/> <span id="ios">Copyright (c) 2015 - ${new Date().getFullYear()}, Apple Inc. All rights reserved.<br/><br/> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</span>`;
      }
    },
    getBrandingDetails() {
      this.$api.getBrandingDetailsFact(this.studyId).then(response => {
        this.branding = response.body;
        this.generateLicenseInfo();
      });
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
          this.generateLicenseInfo();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    removeConsentFile(consentDocData) {
      if (consentDocData.pdfLink && consentDocData.pdfName) {
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
            this.$api.deleteConsentDocumentFact(this.studyId).then(
              () => {
                this.consentDocData.file = "";
                this.consentDocData.pdfLink = "";
                this.consentDocData.pdfName = "";
                this.fileSelected = "";
                window.$('#consent_section_doc[type="file"]').val(null);
                this.fileSelected = null;
              },
              error => {
                toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while getting the study details"
                );
              }
            );
          }
        });
      } else {
        this.consentDocData.file = "";
        this.consentDocData.pdfLink = "";
        window.$('#consent_section_doc[type="file"]').val(null);
        this.fileSelected = null;
      }
    },
    editConsentDocumentScreen(docData) {
      this.tempDocData = _.cloneDeep(docData);
      this.consentDocReadMode = false;
    },
    getIndexForNewScreen() {
      const highestValObj = _.maxBy(this.consentSections, o => o.sectionNumber);
      return highestValObj.index + 1;
    },
    getStudyConsentDetails() {
      this.$api.getConsentSectionsFact(this.studyId).then(
        response => {
          this.consentData = response.body;
          this.consentDocData = response.body.documentProperties
            ? response.body.documentProperties
            : {}; // eslint-disable-line
          this.consentDocReadMode =
            this.consentDocData &&
            this.consentDocData.pdfLink &&
            this.consentDocData.htmlDocument;
          this.consentSections = response.body.sections
            ? response.body.sections
            : [];
          this.quizQuestions =
            response.body.quiz && response.body.quiz.questions
              ? response.body.quiz.questions
              : []; // eslint-disable-line
          if (this.quizQuestions.length === 0) {
            this.addEditQuizQuestion.opType = "toAdd";
          }
          this.privacyPolicyOriginal = response.body.privacyPolicy
            ? response.body.privacyPolicy
            : null; // eslint-disable-line
          this.privacyPolicy = _.cloneDeep(this.privacyPolicyOriginal);
          if (this.privacyPolicy) {
            this.privacyReadMode = true;
          }
          this.licenses = response.body.licenses || this.licenses;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    collapseFunc() {
      this.collapse = false;
      this.expand = true;
    },
    expandFunc() {
      this.collapse = true;
      this.expand = false;
    },
    cancelScreen() {
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
          if (this.consentDocData.id) {
            this.consentDocReadMode = true;
            this.consentDocData = _.cloneDeep(this.tempDocData);
          } else {
            this.consentDocData = { file: "", htmlDocument: "", pdfLink: "" };
            window.$('#consent_section_doc[type="file"]').val(null);
            this.fileSelected = null;
          }
        }
      });
    },
    deleteConsentSection(studyId, sectionId) {
      this.$api.deleteConsentSectionFact(studyId, sectionId).then(
        () => {
          const sectionIndex = _.findIndex(this.consentSections, [
            "sectionId",
            sectionId
          ]);
          this.consentSections.splice(sectionIndex, 1);
          this.selectedConsentSection = {};
          toastr.success("Consent section deleted successfully");
          this.$store.dispatch(
            "addConsentSectionAction",
            this.selectedConsentSection
          );
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while adding the consent section"
          );
        }
      );
    },
    deleteConsentQuiz(studyId, questionId) {
      this.$api.deleteConsentQuizFact(studyId, questionId).then(
        () => {
          const questionIndex = _.findIndex(this.quizQuestions, [
            "identifier",
            questionId
          ]);
          this.quizQuestions.splice(questionIndex, 1);
          this.addEditQuizQuestion = {};
          toastr.success("Quiz question deleted successfully");
          this.$store.dispatch(
            "addConsentQuizAction",
            this.addEditQuizQuestion
          );
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while adding the quiz question"
          );
        }
      );
    },
    savePrivacyPolicy(data) {
      if (data.length > 0) {
        this.$api.addPrivacyFact(this.studyId, { privacyPolicy: data }).then(
          () => {
            this.privacyPolicyOriginal = _.cloneDeep(data);
            this.privacyReadMode = true;
            toastr.success("Privacy policy addded successfully");
          },
          error => {
            toastr.error(
              error.body
                ? error.body.message
                : "Error while adding the privacy policy"
            );
          }
        );
      } else {
        toastr.error("Please enter some privacy policy");
      }
    },
    cancelPrivacyPolicy() {
      this.privacyPolicy = _.cloneDeep(this.privacyPolicyOriginal);
      if (this.privacyPolicyOriginal) {
        this.privacyReadMode = true;
      } else {
        this.privacyPolicy = "";
      }
    },
    editPrivacyPolicy() {
      this.privacyReadMode = false;
    },
    saveLicense() {
      this.$api.addLicenseFact(this.studyId, { licenses: this.licenses }).then(
        () => {
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
        error => {
          this.$store.dispatch("addConsentSectionAction", {});
          toastr.error(
            error.body
              ? error.body.message
              : "Error while updating the consent section"
          );
        }
      );
    },
    addNewScreen() {
      this.selectedConsentSection.opType = null;
      this.selectedConsentSection.opType = "toAdd";
      this.selectedConsentSection.sectionType = "default";
    },
    editConsentSection(screen) {
      this.selectedConsentSection = _.cloneDeep(screen);
      this.selectedConsentSection.opType = "toEdit"; // eslint-disable-line
      this.$store.dispatch(
        "addConsentSectionAction",
        this.selectedConsentSection
      );
    },
    addNewQuizQuestion() {
      this.addEditQuizQuestion.opType = null;
      this.addEditQuizQuestion.opType = "toAdd";
    },
    editQuizQuestion(screen) {
      this.addEditQuizQuestion = _.cloneDeep(screen);
      this.addEditQuizQuestion.opType = "toEdit"; // eslint-disable-line
      this.$store.dispatch("addConsentSectionAction", this.addEditQuizQuestion);
    },
    onDragSections() {
      this.consentSections.forEach((item, index) => {
        //eslint-disable-line
        this.consentSections[index].sectionNumber = index + 1;
      });
      this.$api
        .updateConsentSectionsOrderFact(this.studyId, this.consentSections)
        .then(
          () => {},
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while saving the data"
            );
          }
        );
    },
    onDragQuiz() {
      this.$api
        .updateConsentQuizOrderFact(this.studyId, this.quizQuestions)
        .then(
          () => {},
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while saving the data"
            );
          }
        );
    },
    onDocFileSelection() {
      const input = window.document.getElementById("consent_section_doc");
      this.consentDocData.file = input.files[0]; // eslint-disable-line
      this.fileSelected = input.files[0].name;
    },
    saveConsentDocumentScreen(originalConsentDoc) {
      const consentDoc = { ...originalConsentDoc };
      if (consentDoc.htmlDocument && (consentDoc.file || consentDoc.pdfLink)) {
        // eslint-disable-line
        if (!consentDoc.id) {
          // Section with out sectionId === new section
          const fd = new FormData();
          if (
            consentDoc.htmlDocument &&
            consentDoc.htmlDocument.indexOf("<html><head>") < 0
          ) {
            consentDoc.htmlDocument = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${consentDoc.htmlDocument}</body></html>`;
          }
          fd.append("htmlDocument", consentDoc.htmlDocument);
          fd.append("file", this.consentDocData.file);

          this.$api.saveConsentDocumentFact(this.studyId, fd).then(
            response => {
              this.consentDocData = response.body;
              this.consentDocReadMode = true;
              toastr.success("Consent document data added successfully");
              window.$('#consent_section_doc[type="file"]').val(null);
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while adding the consent section"
              );
            }
          );
        } else if (consentDoc.id) {
          // Section with sectionId === existing section
          const fd = new FormData();
          if (
            consentDoc.htmlDocument &&
            consentDoc.htmlDocument.indexOf("<html><head>") < 0
          ) {
            consentDoc.htmlDocument = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${consentDoc.htmlDocument}</body></html>`;
          }
          fd.append("htmlDocument", consentDoc.htmlDocument);
          fd.append("file", this.consentDocData.file);

          this.$api
            .updateConsentDocumentFact(this.studyId, consentDoc.id, fd)
            .then(
              response => {
                this.consentDocData = response.body;
                this.consentDocReadMode = true;
                toastr.success("Consent document data updated successfully");
              },
              error => {
                this.$store.dispatch("addConsentSectionAction", {});
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while updating the consent section"
                );
              }
            );
        }
      } else {
        toastr.error("Please add consent data and upload consent document.");
      }
    },
    nextClick() {
      const actualQuizQuestions = _.filter(
        this.quizQuestions,
        o => o.type !== "instruction"
      );
      if (this.consentSections.length === 0) {
        toastr.error("Please add consent screens");
      } else if (
        actualQuizQuestions.length === 0 &&
        (this.studyData &&
          this.studyData.onboardingType &&
          this.studyData.onboardingType.toLowerCase() === "openenrollment")
      ) {
        toastr.error(
          "Please set up a Comprehension Quiz for your participants. Besides instruction screens, it should have at least one question."
        );
      } else if (!this.consentDocData.pdfLink) {
        toastr.error("Please add consent document");
      } else {
        this.saveLicense();
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
  components: {
    studyFeatureHeader,
    draggable,
    addEditConsent,
    addEditQuiz,
    CancelModal
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
  margin: 20px 0 10px;
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

.card {
  display: block;
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
.form-control {
  border-radius: 2px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.consent-header {
  margin: 0px;
  padding: 40px 0px 10px 0px;
  font-weight: 500;
  font-size: 16px;
}

.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin-top: 10px;
}
.read_only_screen {
}
.doc_desc {
  display: inline-block;
  word-break: break-all;
}
.license_info {
  background-color: #eee;
  padding: 12px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
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

.close-style {
  padding: 25px 30px 10px 0px !important;
}

.align_justify {
  text-align: justify;
}
</style>
