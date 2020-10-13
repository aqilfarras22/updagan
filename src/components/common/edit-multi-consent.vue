<template>
  <div>
    <div class="heading-box">
      <div
        class="main-heading"
        v-if="existingConsentData.opType==='toEdit'"
      >Editing "{{existingConsentData.consentName}}"</div>
      <div v-if="existingConsentData.opType==='toAdd'">
        <div class="main-heading">Create a consent or agreement</div>
        <div
          class="sub-heading"
        >A consent or agreement consists of: education, comprehension, and document with signature.</div>
      </div>
    </div>
    <div class="child-container">
      <!--Box 1-->
      <div class="box">
        <div
          class="box-heading"
          @click="innerBoxes.box1=!innerBoxes.box1"
          v-bind:class="{ active: innerBoxes.box1 }"
        >
          <img v-if="innerBoxes.box1" src="/static/img/econsent/collapse.svg">
          <img v-if="!innerBoxes.box1" src="/static/img/econsent/expand.svg">
          <span>Consent Name</span>
        </div>
        <b-collapse v-model="innerBoxes.box1" :id="innerBoxes.id1">
        <div class="inner-box">
          <input
            type="text"
            class="input-field"
            v-if="existingConsentData.opType==='toEdit'"
            v-model.trim="existingConsentData.consentName"
            :disabled="innerBoxes.box2"
            @change="tempChangeConsentName"
          >
          <input
            type="text"
            class="input-field"
            v-if="existingConsentData.opType==='toAdd'"
            v-model.trim="newConsentName"
            :disabled="innerBoxes.box2"
          >

          <!--<button class="continue-btn1" v-bind:class="{ disabled_continue_btn : innerBoxes.box2 }" v-if="existingConsentData.opType==='toEdit'" @click="updateConsent()" :disabled="innerBoxes.box2">Continue</button>-->
          <button
            class="continue-btn1"
            v-bind:class="{ disabled_continue_btn : innerBoxes.box2 }"
            v-if="existingConsentData.opType==='toEdit'"
            :disabled="innerBoxes.box2"
            @click="step2Edit()"
          >Continue</button>

          <button
            class="continue-btn1"
            v-bind:class="{ disabled_continue_btn : innerBoxes.box2 }"
            v-if="existingConsentData.opType==='toAdd'"
            @click="addConsent()"
            :disabled="innerBoxes.box2"
          >Continue</button>
        </div>
        </b-collapse>
      </div>
      <!--Box 1 End-->
      <div class="box-divider"></div>

      <!--Box 2-->
      <div class="box">
        <div class="box-heading" @click="box2toggle()" v-bind:class="{ active: innerBoxes.box2 }">
          <img v-if="innerBoxes.box2" src="/static/img/econsent/collapse.svg">
          <img v-if="!innerBoxes.box2" src="/static/img/econsent/expand.svg">
          <span>Education</span>
        </div>
        <b-collapse v-model="innerBoxes.box2" :id="innerBoxes.id2">
        <div class="inner-box">
          <div
            class="box2-content"
          >These topics will be presented to your participants as a series of screens that your participants will be required to read. You may add, modify, or rearrange as you see fit.</div>
          {{consentSections.consentId}}
          <draggable
            v-if="existingConsentData.opType==='toEdit'"
            v-model="consentSections"
            :options="{ disabled: draggableSection }"
            @start="drag=true"
            @end="drag=false"
            @change="onDragSections(consentId)"
          >
            <div v-for="(section,index) in consentSections" v-bind:key="index">
              <div
                class="box2-draggable-education"
                v-if="selectedConsentSection.sectionId !== section.sectionId"
              >
                <span>
                  <img src="static/img/econsent/scrubber.svg">
                </span>
                <div class="content">
                  <div class="heading">{{section.sectionTitle}}</div>
                  <div class="text">{{section.sectionSummary}}</div>
                </div>
                <div class="btn">
                  <button v-on:click="editConsentSection(section)">Edit</button>
                </div>

                <div class="clearfix"></div>
              </div>

              <div
                class="row mt-20"
                v-if="selectedConsentSection.opType === 'toEdit' && selectedConsentSection.sectionId === section.sectionId"
              >
                <addEditEducation :options="selectedConsentSection"></addEditEducation>
              </div>
            </div>
          </draggable>

          <draggable
            v-if="existingConsentData.opType==='toAdd'"
            v-model="consentSections"
            :options="{ disabled: draggableSection }"
            @start="drag=true"
            @end="drag=false"
            @change="onDragSections(consentId)"
          >
            <div v-for="(section,index) in consentSections" v-bind:key="index">
              <div
                class="box2-draggable-education"
                v-if="selectedConsentSection.sectionId !== section.sectionId"
              >
                <span>
                  <img src="static/img/econsent/scrubber.svg">
                </span>
                <div class="content">
                  <div class="heading">{{section.sectionTitle}}</div>
                  <div class="text">{{section.sectionSummary}}</div>
                </div>
                <div class="btn">
                  <button v-on:click="editConsentSection(section)">Edit</button>
                </div>

                <div class="clearfix"></div>
              </div>
              <div
                class="row mt-20"
                v-if="selectedConsentSection.opType === 'toEdit' && selectedConsentSection.sectionId === section.sectionId"
              >
                <addEditEducation :options="selectedConsentSection"></addEditEducation>
              </div>
            </div>
          </draggable>

          <button
            type="button"
            class="add-another-education-screen-btn"
            v-on:click="addNewEducationScreen()"
          >Add another screen</button>

          <div class="row mt-20" v-if="selectedConsentSection.opType === 'toAdd'">
            <addEditEducation :options="selectedConsentSection"></addEditEducation>
          </div>

          <button class="box2-continue-btn" @click="continue3()">Continue</button>
        </div>
        </b-collapse>
      </div>
      <!--Box 2 End-->
      <div class="box-divider"></div>

      <!--Box 3-->
      <div class="box">
        <div class="box-heading" @click="box3toggle()" v-bind:class="{ active: innerBoxes.box3 }">
          <img v-if="innerBoxes.box3" src="/static/img/econsent/collapse.svg">
          <img v-if="!innerBoxes.box3" src="/static/img/econsent/expand.svg">
          <span>Comprehension</span>
        </div>
        <b-collapse v-model="innerBoxes.box3" :id="innerBoxes.id3">
        <div class="inner-box">
          <div
            class="box3-content"
          >To ensure that your participants fully understand the consent educational materials, a comprehensive quiz will be presented to them. This should be a short quiz with three (3) to five (5) questions.</div>
          <draggable
            v-if="existingConsentData.opType==='toEdit'"
            v-model="quizQuestions"
            :options="{ disabled: draggableQuiz }"
            @start="drag=true"
            @end="drag=false"
            @change="onDragQuiz(consentId)"
          >
            <div
              class="question-panel"
              v-for="(question, index) in quizQuestions"
              :key="question.identifier"
            >
              <div
                class="question-section"
                v-if="addEditQuizQuestion.identifier !== question.identifier"
              >
                <div>
                  <h5 class="heading">{{index + 1}}. {{question.body}}</h5>
                  <div
                    class="description"
                    v-if="question.type=='instruction'"
                  >{{question.description}}</div>
                  <div v-if="question.type!='instruction'">
                    <div class="description" v-for="option in question.options">
                      <input
                        type="radio"
                        :checked="option.sequence==question.expectedAnswer"
                        disabled
                      >
                      &nbsp; {{option.body}}
                    </div>
                  </div>
                </div>
                <button class="edit-btn" v-on:click="editQuizQuestion(question,index)">Edit</button>
              </div>

              <div
                class="row pt-10"
                v-if="addEditQuizQuestion.opType === 'toEdit' && addEditQuizQuestion.identifier === question.identifier"
              >
                <addEditQuiz :options="addEditQuizQuestion"></addEditQuiz>
              </div>
            </div>
          </draggable>

          <draggable
            v-if="existingConsentData.opType==='toAdd'"
            v-model="quizQuestions"
            :options="{ disabled: draggableQuiz }"
            @start="drag=true"
            @end="drag=false"
            @change="onDragQuiz(consentId)"
          >
            <div class="question-panel" v-for="(question, index) in quizQuestions" :key="question.identifier">
              <div
                class="question-panel"
                v-if="addEditQuizQuestion.identifier !== question.identifier"
              >
                <div class="question-section">
                  <h5 class="heading">{{index + 1}}. {{question.body}}</h5>
                  <div
                    class="description"
                    v-if="question.type=='instruction'"
                  >{{question.description}}</div>
                  <div v-if="question.type!='instruction'">
                    <div class="description" v-for="option in question.options">
                      <input
                        type="radio"
                        :checked="option.sequence==question.expectedAnswer"
                        disabled
                      >
                      &nbsp; {{option.body}}
                    </div>
                  </div>
                </div>
                <div>
                  <button class="edit-btn" v-on:click="editQuizQuestion(question,index)">Edit</button>
                </div>
              </div>
              <div
                class="row pt-10"
                v-if="addEditQuizQuestion.opType === 'toEdit' && addEditQuizQuestion.identifier === question.identifier"
              >
                <addEditQuiz :options="addEditQuizQuestion"></addEditQuiz>
              </div>
            </div>
          </draggable>

          <div class="pt-10" v-if="addEditQuizQuestion.opType === 'toAdd'">
            <addEditQuiz :options="addEditQuizQuestion"></addEditQuiz>
          </div>

          <button
            type="button"
            class="add-a-question-btn"
            v-on:click="addNewQuizQuestion()"
          >Add a question</button>
          <button type="button" class="continue-btn3" @click="continue4()">Continue</button>
        </div>
        </b-collapse>
      </div>
      <!--Box 3 End-->
      <div class="box-divider"></div>

      <!--Box 4-->
      <div class="box">
        <div class="box-heading" @click="box4toggle()" v-bind:class="{ active: innerBoxes.box4 }">
          <img v-if="innerBoxes.box4" src="/static/img/econsent/collapse.svg">
          <img v-if="!innerBoxes.box4" src="/static/img/econsent/expand.svg">
          <span>Document & signature</span>
        </div>
        <b-collapse v-model="innerBoxes.box4" :id="innerBoxes.id4">
        <div class="inner-box">
          <div class="document-section" v-if="consentDocReadMode">
            <!--<div class="heading1">Consent name</div>
            <div class="input1"><input type="text" placeholder="Enter the name of this consent"></div>-->
            <div class="heading2">Enter and format the consent</div>
            <!--<div class="input2"><textarea placeholder="Enter consent here" ref="myTextEditor" v-model="consentDocData.htmlDocument"></textarea></div>-->
            <div v-if="consentDocReadMode" class="input2">
              <quill-editor
                class="bg-white"
                ref="myTextEditor"
                v-model="consentDocData.htmlDocument"
                :options="editorOptionsMore"
                @change="onEditorChange($event)"
              ></quill-editor>
            </div>
            <div>
              <div class="heading3" v-if="consentDocReadMode">Upload a copy of the consent document</div>
              <div class="text1">Format accepted: .pdf</div>

              <div class="pt-20 clear-float row" v-for="(doc, index) in consentDocData.documentFiles" :key="index">
                <div class="col-sm-4">
                  <div class="pb-10 lang-text">{{doc.language.display_name}}</div>
                    <div class="fs-14 color_blue pb-5" v-if="doc.pdfName && !doc.pdfLink">
                      <span class="icon_section" v-if="!doc.pdfName">
                        <span class="fa fa-file"></span>
                      </span>
                    </div>
                    <div class="fs-14 color_blue pb-5" v-if="doc.pdfName">
                      <span class="icon_section">
                        <span class="fa fa-file"></span>
                      </span>
                      {{doc.pdfName}}
                    </div>
                    <div class="color_red fs-12 cursor_pointer" v-if="doc.pdfName" v-on:click="removeConsentFile(doc, index)">Remove consent file</div>
                </div>

                <div class="col-sm-6">
                  <div class>
                    <div class="file-upload">
                      <input
                        type="file"
                        class="file-input"
                        id="consent_section_doc"
                        v-on:change="onDocFileSelection($event, index, doc.language)"
                        accept="application/pdf"
                      >
                      <span class="file-input">Upload</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-divider"></div>
            <div class="disclaimer-section">
              <div class="heading3">Add an additional disclaimer</div>
              <div class="text1">If this option is configured, participants will need to acknowledge they read the disclaimer by checking the checkbox before moving to the next section.</div>
              <div v-if="disclaimerList.length>0" class="input-boxes mt-24 pl-16">
                <transition-group name="list" tag="p">
                  <div v-for="(disclaimerObj, dIndex) in disclaimerList" :key="disclaimerObj.disclaimerId?disclaimerObj.disclaimerId:disclaimerObj.dynamicDisclaimerID" class="form-group">
                    <label>Disclaimer {{dIndex+1}}</label>
                    <textarea v-model="disclaimerObj.disclaimer" class="form-control" placeholder="Enter disclaimer content"></textarea>
                    <span @click="removeDisclaimer(dIndex)" class="remove">Remove</span>
                  </div>
                </transition-group>
              </div>
              <button @click="addDisclaimer()" type="button" class="disclaimer-btn">Add a disclaimer</button>
            </div>
            <div class="btns">
              <button class="cancel-btn" v-on:click="cancelScreen()">Cancel</button>
              <button class="save-btn" v-on:click="saveConsentDocumentScreen(consentDocData)">Save</button>
            </div>
          </div>
        </div>
        </b-collapse>
      </div>
      <!--Box 4 End-->
      <div class="bottom-section">
        <div class="left-block">
          <img
            src="/static/img/econsent/delete.svg"
            class="delete-btn"
            v-if="consentId"
            @click="deleteConsent(consentId)"
          >
        </div>

        <!-- <div class="right-block">
                    <button class="save-btn">Save</button>
        </div>-->
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="back-button pt-10">
      <span class="back_link" v-on:click="goBack()">
        <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
      </span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import toastr from 'toastr';
import draggable from 'vuedraggable';
import swal from 'sweetalert2';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import addEditEducation from '../common/add-edit-multi-econsent-education';
import addEditQuiz from '../common/add-edit-multi-econsent-quiz';
let dynamicDisclaimerID = 0;
export default {
  name: 'multi-econsent',
  data() {
    return {
      existingConsentList: this.existingConsent,
      quizQuestions: [],
      studyId: null,
      consentId: null,
      newConsentId: null,
      editorOptionsMore: {
        placeholder: 'Enter your study consent',
        readOnly: false,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
      },
      fileSelected: [],
      selectedConsentSection: {
        consentId: '',
        sectionId: '',
        sectionType: 'default',
        sectionNumber: '',
        sectionTitle: '',
        sectionImage: '',
        sectionImageTemp: '',
        sectionSummary: '',
        sectionHtmlContent: '',
        opType: '',
      },
      consentSections: [],
      documentSection: [],
      innerBoxes: {
        box1: true,
        box2: false,
        box3: false,
        box4: false,
        id1: '1',
        id2: '2',
        id3: '3',
        id4: '4',
      },
      addEditQuizQuestion: {
        type: 'default',
        body: '',
        sequence: 1,
        description: '',
        expectedAnswer: '',
        options: [{ body: '', sequence: 1 }, { body: '', sequence: 2 }],
        opType: '',
        consentId: '',
      },
      existingConsentData: this.options,
      newConsentName: '',
      newConsentData: [],
      educationSection: {
        opType: '',
        data: [],
      },
      consentDocReadMode: true,
      appLangaScript: "window.initApplanga = function() {        if(typeof window.ApplangaNative !== 'undefined') {  window.ApplangaNative.loadScript();        } else { setTimeout(window.initApplanga, 180); }    }; window.initApplanga();",
      consentDocData: {
        htmlDocument: null,
        documentFiles: []
      },
      supportedLanguages: null,
      imageTypeError: true,
      disclaimerList: [],
      apiDiscliamerResponse: []
    };
  },
  props: ['options', 'existingConsent'],
  mounted() {
    window.scrollTo(0, 0);
    this.studyId = this.$route.params.studyId;
    this.consentId = this.$route.params.consentId;
    this.setConsentId();
    this.getStudyDetail();
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
      } else if (
        this.selectedConsentSection.opType === 'toAdd' ||
        this.selectedConsentSection.opType === 'toEdit'
      ) {
        return true;
      }
      return false;
    },
    draggableQuiz() {
      if (this.quizQuestions <= 0) {
        return false;
      } else if (
        this.addEditQuizQuestion.opType === 'toAdd' ||
        this.addEditQuizQuestion.opType === 'toEdit'
      ) {
        return true;
      }
      return false;
    },
  },
  watch: {
    addedConsentSection: {
      handler(val) {
        if (val) {
          const sectionObj = val;
          if (val.sectionId && val.opType === 'delete') {
            this.deleteConsentSection(
              this.studyId,
              val.sectionId,
              this.consentId,
            );
          } else if (!val.sectionId && val.opType === 'done') {
            // Section with out sectionId === new section
            const fd = new FormData();
            // fd.append('sectionNumber', this.getIndexForNewScreen());
            fd.append('sectionNumber', 2);
            fd.append('sectionType', sectionObj.sectionType);
            fd.append('sectionTitle', sectionObj.sectionTitle);
            fd.append('sectionImage', sectionObj.sectionImage);
            fd.append('sectionSummary', sectionObj.sectionSummary);
            if (
              sectionObj.sectionHtmlContent &&
              sectionObj.sectionHtmlContent.indexOf('<html><head>') < 0
            ) {
              sectionObj.sectionHtmlContent = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
                sectionObj.sectionHtmlContent
              }</body></html>`;
            }
            fd.append('sectionHtmlContent', sectionObj.sectionHtmlContent);
            nprogress.start();
            this.$api
              .addConsentSectionFactV2(this.studyId, fd, this.consentId)
              .then(
                response => {
                  this.selectedConsentSection = {};
                  this.$store.dispatch(
                    'addConsentSectionAction',
                    this.selectedConsentSection,
                  );
                  this.consentSections.push(response.data);
                  toastr.success('Consent section added successfully.');
                  nprogress.done();
                },
                error => {
                  this.$store.dispatch('addConsentSectionAction', {});
                  toastr.error(
                    error.body
                      ? error.body.message
                      : 'Error while adding the consent section',
                  );
                  nprogress.done();
                },
              );
          } else if (val.sectionId && val.opType === 'done') {
            // Section with sectionId === existing section
            if (
              sectionObj.sectionHtmlContent &&
              sectionObj.sectionHtmlContent.indexOf('<html><head>') < 0
            ) {
              sectionObj.sectionHtmlContent = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
                sectionObj.sectionHtmlContent
              }</body></html>`; // eslint-disable-line
            }
            const fd = new FormData();
            fd.append('sectionId', sectionObj.sectionId);
            fd.append('sectionType', sectionObj.sectionType);
            fd.append('sectionTitle', sectionObj.sectionTitle);
            fd.append('sectionSummary', sectionObj.sectionSummary);
            fd.append('sectionHtmlContent', sectionObj.sectionHtmlContent);
            fd.append('sectionNumber', sectionObj.sectionNumber);
            if (sectionObj.sectionImage) {
              fd.append('sectionImage', sectionObj.sectionImage);
            }
            fd.append('sectionSummary', sectionObj.sectionSummary);
            if (
              sectionObj.sectionHtmlContent &&
              sectionObj.sectionHtmlContent.indexOf('<html><head>') < 0
            ) {
              sectionObj.sectionHtmlContent = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
                sectionObj.sectionHtmlContent
              }</body></html>`;
            }
            fd.append('sectionHtmlContent', sectionObj.sectionHtmlContent);
            nprogress.start();
            this.$api
              .updateConsentSectionFactV2(
                this.studyId,
                sectionObj.sectionId,
                fd,
                this.consentId,
              )
              .then(
                response => {
                  const sectionIndex = _.findIndex(this.consentSections, [
                    'sectionId',
                    response.data.sectionId,
                  ]);
                  this.consentSections.splice(sectionIndex, 1, response.data);
                  this.selectedConsentSection = {};
                  this.$store.dispatch(
                    'addConsentSectionAction',
                    this.selectedConsentSection,
                  );
                  toastr.success('Consent updated successfully');
                  nprogress.done();
                },
                error => {
                  this.$store.dispatch('addConsentSectionAction', {});
                  toastr.error(
                    error.body
                      ? error.body.message
                      : 'Error while updating the consent section',
                  );
                  nprogress.done();
                },
              );
          } else if (val.sectionId && val.opType === 'toEdit') {
            this.selectedConsentSection.opType = val.opType;
          } else if (val.sectionId && val.opType === 'none') {
            const sectionIndex = _.findIndex(this.consentSections, [
              'sectionId',
              this.selectedConsentSection.sectionId,
            ]);
            this.consentSections.splice(
              sectionIndex,
              1,
              this.selectedConsentSection,
            );
            this.selectedConsentSection = {};
          } else {
            this.selectedConsentSection = {
              sectionId: '',
              sectionNumber: '',
              sectionTitle: '',
              sectionImage: '',
              sectionSummary: '',
              sectionHtmlContent: '',
              opType: '',
            };
          }
        }
      },
    },
    addedConsentQuiz: {
      handler(val) {
        if (val) {
          const quizObj = val;
          if (val.identifier && val.opType === 'delete') {
            this.deleteConsentQuiz(
              this.studyId,
              this.consentId,
              val.identifier,
            );
          } else if (!val.identifier && val.opType === 'done') {
            // quiz question with out id === new quiz question
            quizObj.sequence = this.quizQuestions.length + 1;
            nprogress.start();
            this.$api
              .addConsentQuizFactV2(this.studyId, quizObj, quizObj.consentId)
              .then(
                response => {
                  this.addEditQuizQuestion = {};
                  this.$store.dispatch(
                    'addConsentQuizAction',
                    this.addEditQuizQuestion,
                  );
                  toastr.success('Quiz question added successfully');
                  this.quizQuestions.push(response.data);
                  nprogress.done();
                },
                error => {
                  this.$store.dispatch('addConsentQuizAction', {});
                  toastr.error(
                    error.body
                      ? error.body.message
                      : 'Error while adding quiz question',
                  );
                  nprogress.done();
                },
              );
          } else if (val.identifier && val.opType === 'done') {
            // quiz question with id === existing quiz question
            nprogress.start();
            this.$api
              .updateConsentQuizFactV2(this.studyId, quizObj, this.consentId)
              .then(
                response => {
                  toastr.success('Quiz question updated successfully');
                  const sectionIndex = _.findIndex(this.quizQuestions, [
                    'identifier',
                    response.data.identifier,
                  ]);
                  this.quizQuestions.splice(sectionIndex, 1, response.data);
                  this.addEditQuizQuestion = {};
                  this.$store.dispatch(
                    'addConsentQuizAction',
                    this.addEditQuizQuestion,
                  );
                  nprogress.done();
                },
                error => {
                  this.$store.dispatch('addConsentQuizAction', {});
                  toastr.error(
                    error.body
                      ? error.body.message
                      : 'Error while updating quiz question',
                  );
                  nprogress.done();
                },
              );
          } else if (val.identifier && val.opType === 'toEdit') {
            this.addEditQuizQuestion.opType = val.opType;
          } else if (val.identifier && val.opType === 'none') {
            const sectionIndex = _.findIndex(this.quizQuestions, [
              'identifier',
              this.addEditQuizQuestion.identifier,
            ]);
            this.quizQuestions.splice(
              sectionIndex,
              1,
              this.addEditQuizQuestion,
            );
            this.addEditQuizQuestion = {};
          } else {
            this.addEditQuizQuestion = {
              type: 'default',
              body: '',
              sequence: 1,
              description: '',
              expectedAnswer: '',
              options: [{ body: '', sequence: 1 }, { body: '', sequence: 2 }],
              opType: '',
            };
          }
        }
      },
    }
  },
  methods: {
    onEditorChange(event) {
      var elem= document.createElement("div");
      elem.innerHTML = event.html;
      var images = elem.getElementsByTagName("img");
      this.imageTypeError = false;
      for(var i=0; i < images.length; i++){
        const [imageType, baseUrl] = images[i].src.split(';');
        const [str, type] = imageType.split('/');
        if(type.toLowerCase() != 'png') {
          this.imageTypeError = true;
          break;
        }
      }
    },
    box2toggle() {
      if (this.checkConsentId()) {
        toastr.error('Please enter consent name first');
      } else {
        this.innerBoxes.box2 = !this.innerBoxes.box2;
      }
    },
    box3toggle() {
      if (this.checkConsentId()) {
        toastr.error('Please enter consent name first');
      } else {
        this.innerBoxes.box3 = !this.innerBoxes.box3;
      }
    },
    box4toggle() {
      if (this.checkConsentId()) {
        toastr.error('Please enter consent name first');
      } else {
        this.innerBoxes.box4 = !this.innerBoxes.box4;
      }
    },
    checkConsentId() {
      if (this.existingConsentData.opType === 'toAdd') {
        if (this.newConsentId === null || this.newConsentId === '') {
          return true;
        }
        return false;
      }
      return false;
    },
    step2Edit() {
      this.innerBoxes.box2 = true;
      this.innerBoxes.box1 = true;
    },
    goBack() {
      this.existingConsentData = '';
      this.$emit('exit', true);
    },
    tempChangeConsentName() {
      const that = this;

      const cname = that.existingConsentData.consentName;

      if (cname === '' || cname === undefined) {
        toastr.error('Please enter consent name');
      } else if (
        that.existingConsentList != null && // eslint-disable-line
        that.existingConsentList.length > 0
      ) {
        const filterList = that.existingConsentList.filter(
          x => x.consentName == cname // eslint-disable-line
        );
        if (filterList != null && filterList.length > 0) {
          // eslint-disable-line
          toastr.error('A consnet with this name already exists.');
        } else {
          that.updateConsentName();
        }
      } else {
        that.updateConsentName();
      }
    },

    updateConsentName() {
      const that = this;
      nprogress.start();
      that.$api
        .updateConsentName(
          that.studyId,
          that.existingConsentData.consentId,
          that.existingConsentData.consentName,
        )
        .then(
          () => {
            that.innerBoxes.box1 = false;
            that.innerBoxes.box2 = true;
            toastr.success('Consent name updated successfully.');
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while updating consent name.',
            );
            nprogress.done();
          },
        );
    },
    deleteConsent(consentId) {
      swal({
        title: 'Are you sure you want to delete this consent?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          nprogress.start();
          this.$api.deleteConsentData(this.studyId, consentId).then(
            () => {
              toastr.success('Consent deleted successfully.');
              this.$emit('exit', true);
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while getting the study details',
              );
              nprogress.done();
            },
          );
        }
      });
    },
    deleteConsentQuiz(studyId, consentId, questionId) {
      swal({
        title: 'Are you sure you want to delete this consent quiz question?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          nprogress.start();
          this.$api
            .deleteConsentQuizFactV2(studyId, consentId, questionId)
            .then(
              () => {
                const questionIndex = _.findIndex(this.quizQuestions, [
                  'identifier',
                  questionId,
                ]);
                this.quizQuestions.splice(questionIndex, 1);
                this.addEditQuizQuestion = {};
                toastr.success('Quiz question deleted successfully');
                this.$store.dispatch(
                  'addConsentQuizAction',
                  this.addEditQuizQuestion,
                );
                nprogress.done();
              },
              error => {
                toastr.error(
                  error.body
                    ? error.body.message
                    : 'Error while adding the quiz question',
                );
                nprogress.done();
              },
            );
        }
      });
    },
    loadQuestion() {
      if (this.existingConsentData.opType === 'toEdit') {
        this.consentId = this.existingConsentData.consentId;

        if (
          this.existingConsentData.sections != null && // eslint-disable-line
          this.existingConsentData.sections != undefined // eslint-disable-line
        ) {
          this.consentSections = this.existingConsentData.sections;
        }

        if (
          this.existingConsentData.quiz != null && // eslint-disable-line
          this.existingConsentData.quiz != undefined // eslint-disable-line
        ) {
          this.quizQuestions = this.existingConsentData.quiz.questions;
        }

        if (
          this.existingConsentData.documents != null && // eslint-disable-line
          this.existingConsentData.documents != undefined && !Array.isArray(this.existingConsentData.documents)// eslint-disable-line
        ) {
          this.documentSection = this.existingConsentData.documents;
          this.consentDocData.htmlDocument = this.existingConsentData.documents.htmlDocument.replace(this.appLangaScript,'');
          // only support default language / or only for old studies
          this.supportedLanguages.map((lang) => {
            if(lang.name.toLowerCase() == 'english') {
              this.consentDocData.documentFiles.push({
                file: null,
                pdfLink: this.existingConsentData.documents.pdfLink,
                pdfName: this.existingConsentData.documents.pdfName,
                language: this.existingConsentData.documents.language
              });
            } else {
              this.consentDocData.documentFiles.push({
                file: null,
                pdfLink: null,
                pdfName: null,
                language: lang
              });
            }
          })
        } else if(Array.isArray(this.existingConsentData.documents)) {
          this.consentDocData.htmlDocument = this.existingConsentData.documents[0].htmlDocument.replace(this.appLangaScript,'');
          this.supportedLanguages.map((lang) => {
            let document = this.fetchSupportedLanguage(lang);
            if(document.doc) {
              this.consentDocData.documentFiles.push({
                file: null,
                pdfLink: document.doc.pdfLink,
                pdfName: document.doc.pdfName,
                language: document.doc.language
              });
            } else if(document.lang) {
              this.consentDocData.documentFiles.push({
                file: null,
                pdfLink: null,
                pdfName: null,
                language: document.lang
              });
            }
          });
        } else {
          this.supportedLanguages.map((lang) => {
            this.consentDocData.documentFiles.push({file: null, pdfLink: null, pdfName: null, language: lang});
          });
        }
      } else {
        if(this.supportedLanguages && this.supportedLanguages.length > 0) {
          this.supportedLanguages.map((lang, index) => {
            this.consentDocData.documentFiles.push({file: null, pdfLink: null, pdfName: null, language: lang})
          });
        }
      }
    },
    fetchSupportedLanguage(langObj) {
      let languageDoc = this.existingConsentData.documents.filter((doc) => {
        if(doc.language.language_id == langObj.language_id) {
          return {doc: doc, lang: null};
        }
      });

      return (languageDoc.length != 0 ) ? {doc : languageDoc[0], lang: languageDoc[0].language} : {doc : null, lang: langObj};
    },
    continue4() {
      this.innerBoxes.box3 = false;
      this.innerBoxes.box4 = true;
    },
    continue3() {
      this.innerBoxes.box2 = false;
      this.innerBoxes.box3 = true;
    },
    deleteConsentSection(studyId, sectionId, consentId) {
      nprogress.start();
      this.$api.deleteConsentSectionFactV2(studyId, sectionId, consentId).then(
        () => {
          const sectionIndex = _.findIndex(this.consentSections, [
            'sectionId',
            sectionId,
          ]);
          this.consentSections.splice(sectionIndex, 1);
          this.selectedConsentSection = {};
          toastr.success('Consent section deleted successfully');
          this.$store.dispatch(
            'addConsentSectionAction',
            this.selectedConsentSection,
          );
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : 'Error while adding the consent section',
          );
          nprogress.done();
        },
      );
    },
    setConsentId() {
      if (
        this.existingConsentData.consentId != "" && // eslint-disable-line
        this.existingConsentData.opType === "toEdit" // eslint-disable-line
      ) {
        this.consentId = this.existingConsentData.consentId;
        
        //Get disclaimer if any
        this.getDisclaimers();

      }
    },
    removeConsentFile(consentDocData, index) {
      if (consentDocData.pdfLink && consentDocData.pdfName) {
        swal({
          title: 'Are you sure you want to delete?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#b8c7ce',
          cancelButtonColor: '#f16559',
          confirmButtonText: 'Cancel',
          cancelButtonText: 'Delete',
        }).then(({ dismiss }) => {
          if (dismiss === 'cancel') {
            nprogress.start();
            this.$api
              .deleteConsentDocumentFactV2(this.studyId, this.consentId, consentDocData.language.language_id)
              .then(
                () => {
                  this.consentDocData.documentFiles[index].file = '';
                  this.consentDocData.documentFiles[index].pdfLink = '';
                  this.consentDocData.documentFiles[index].pdfName = '';
                  this.consentDocData.documentFiles[index].fileInputRef = null;
                  // window.$('#consent_section_doc[type="file"]').val(null);
                  nprogress.done();
                },
                error => {
                  toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : 'Error while getting the study details',
                  );
                  nprogress.done();
                },
              );
          }
        });
      } else {
        this.consentDocData.documentFiles[index].file = '';
        this.consentDocData.documentFiles[index].pdfLink = '';
        this.consentDocData.documentFiles[index].pdfName = '';
        this.consentDocData.documentFiles[index].fileInputRef = null;
      }
    },
    editConsentDocumentScreen(docData) {
      this.tempDocData = _.cloneDeep(docData);
      this.consentDocReadMode = false;
    },
    formatBytes(size) {
      return size / Math.pow(1024 , 2);
    },
    saveConsentDocumentScreen(originalConsentDoc) {
      const consentDoc = { ...originalConsentDoc };
      let error = false;
      consentDoc.documentFiles.forEach((doc) => {
        if((doc.file == null || doc.file == "") && (doc.pdfName == null || doc.pdfName == "")) {
          error = true;
          return;
        }
      });
      if(error == true || !consentDoc.htmlDocument) {
        toastr.error('Please add consent copy and upload a consent document.');
        return;
      }
      this.onEditorChange({html: consentDoc.htmlDocument})
      if(this.imageTypeError) {
        toastr.error('Uploaded image format not supported. Please upload a PNG file.');
        return;
      }

      //validate Disclaimers
      if(this.disclaimerList.length>0){
        for(let i=0; i < this.disclaimerList.length; i++){
          if(this.disclaimerList[i].disclaimer.trim()=="") {
            toastr.error('Please enter disclaimer content');
            error = true;
            return;
          }
        }
      }


      if (!consentDoc.id) {
        if(consentDoc != null && consentDoc != undefined) {
          consentDoc.documentFiles.forEach((doc) => {
            if(doc.file && !(this.formatBytes(doc.file.size) <= 10)) {
              error = true;
              toastr.error(doc.file.name + ' file size should be less than 10 MB');
            }
          });
        }
        if(error) {
          return;
        }
        // Section with out sectionId === new section
        const fd = new FormData();
        if (
          consentDoc.htmlDocument &&
          consentDoc.htmlDocument.indexOf('<html><head>') < 0
        ) {
          consentDoc.htmlDocument = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
            consentDoc.htmlDocument
          }</body></html>`;
        }
        fd.append('htmlDocument', consentDoc.htmlDocument);
        for(let i = 0; i < this.consentDocData.documentFiles.length; i++) {
          let fileName = this.consentDocData.documentFiles[i].file ? (this.consentDocData.documentFiles[i].pdfName +'=languageId='+ this.consentDocData.documentFiles[i].language.language_id) : null;
          if(fileName) {
            fd.append('file', this.consentDocData.documentFiles[i].file, fileName);
          } else {
            fd.append('file', this.consentDocData.documentFiles[i].file);
          }
        }
        nprogress.start();
        this.$api
          .saveConsentDocumentFactV2(this.studyId, fd, this.consentId)
          .then(
            response => {
              this.consentDocData = response.body;
              this.consentDocReadMode = true;
              toastr.success('Consent document added successfully.');
              // window.$('#consent_section_doc[type="file"]').val(null);
              this.$emit('exit', true);
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : 'Error while adding the consent section',
              );
              nprogress.done();
            },
          );
      } else if (consentDoc.id) {
        // Section with sectionId === existing section
        const fd = new FormData();
        if (
          consentDoc.htmlDocument &&
          consentDoc.htmlDocument.indexOf('<html><head>') < 0
        ) {
          consentDoc.htmlDocument = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
            consentDoc.htmlDocument
          }</body></html>`;
        }
        fd.append('htmlDocument', consentDoc.htmlDocument);
        fd.append('file', this.consentDocData.file);
        nprogress.start();
        this.$api
          .updateConsentDocumentFactV2(
            this.studyId,
            consentDoc.id,
            fd,
            this.consentId,
          )
          .then(
            response => {
              this.consentDocData = response.body;
              this.consentDocReadMode = true;
              toastr.success('Consent document updated successfully.');
              this.$emit('exit', true);
              nprogress.done();
            },
            error => {
              this.$store.dispatch('addConsentSectionAction', {});
              toastr.error(
                error.body
                  ? error.body.message
                  : 'Error while updating the consent section',
              );
              nprogress.done();
            },
          );
        }

        if(!error){
          this.addUpdateDisclaimer();
        }
    },
    cancelScreen() {
      swal({
        title:
          'You have not saved your progress. Are you sure you want to leave? Your changes will not be saved. ',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          if (this.consentDocData.id) {
            this.consentDocReadMode = true;
            this.consentDocData = _.cloneDeep(this.tempDocData);
          } else {
            this.consentDocData = { file: '', htmlDocument: '', pdfLink: '' };
            window.$('#consent_section_doc[type="file"]').val(null);
            this.fileSelected = null;
          }
        }
        this.$emit('exit', true);
      });
    },
    onDocFileSelection(event, index, langObj) {
      if(!(event.srcElement || (event.srcElement.files && event.srcElement.files[0] == null))) {
        return true;
      }
      this.consentDocData.documentFiles[index].file = event.srcElement.files[0];
      this.consentDocData.documentFiles[index].pdfName = event.srcElement.files[0].name;
      this.consentDocData.documentFiles[index].pdfLink = null;
      this.consentDocData.documentFiles[index].language = langObj;
      this.consentDocData.documentFiles[index].fileInputRef = event;
      event.target.value = null;

    },
    updateConsent() {
      nprogress.start();
      this.$api
        .updateConsentName(
          this.studyId,
          this.existingConsentData.consentId,
          this.existingConsentData.consentName,
        )
        .then(
          () => {
            this.innerBoxes.box1 = false;
            this.innerBoxes.box2 = true;
            toastr.success('Consent name updated successfully.');
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while updating consent name.',
            );
            nprogress.done();
          },
        );
    },
    addConsent() {
      const that = this;
      if (
        that.newConsentName === null ||
        that.newConsentName === '' ||
        that.newConsentName === undefined
      ) {
        toastr.error('Please add consent name.');
      } else if (
        that.existingConsentList != null &&
        that.existingConsentList.length > 0
      ) {
        const filterList = that.existingConsentList.filter(
          x => x.consentName == that.newConsentName // eslint-disable-line
        );
        if (filterList != null && filterList.length > 0) {
          toastr.error('A consnet with this name already exists.');
        } else {
          that.addEditConsent();
        }
      } else {
        that.addEditConsent();
      }
    },
    addEditConsent() {
      const that = this;
      if (that.consentId != '' && that.consentId != undefined) { // eslint-disable-line
        nprogress.start();
        that.$api
          .updateConsentName(that.studyId, that.consentId, that.newConsentName)
          .then(
            () => {
              that.innerBoxes.box1 = false;
              that.innerBoxes.box2 = true;
              toastr.success('Consent name updated successfully.');
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while updating consent name.',
              );
              nprogress.done();
            },
          );
      } else {
        nprogress.start();
        that.$api.addConsentName(that.studyId, that.newConsentName).then(
          response => {
            that.newConsentData.push(response.data);
            that.consentId = response.data.consentId;
            that.newConsentId = response.data.consentId;
            const consentId = response.data.consentId; // eslint-disable-line

            if (consentId != '') { // eslint-disable-line
              that.getConsentDetails(consentId);
            }
            // this.existingConsentData.opType = "";
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while adding consent name.',
            );
            nprogress.done();
          },
        );
      }
    },
    getConsentDetails(consentId) {
      nprogress.start();
      let self = this;
      this.$api.getCosentDataApi(this.studyId, consentId).then(
        response => {
          this.newConsentData.push(response.data);

          if (
            response.data.sections != null && // eslint-disable-line
            response.data.sections != undefined // eslint-disable-line
          ) {
            self.consentSections = response.data.sections;
          }

          if (response.data.quiz != null && response.data.quiz != undefined) { // eslint-disable-line
            self.quizQuestions = self.existingConsentData.quiz.questions;
          }
          self.innerBoxes.box1 = false;
          self.innerBoxes.box2 = true;
          toastr.success('Consent name added successfully.');
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while adding consent name.',
          );
          nprogress.done();
        },
      );
    },
    addNewEducationScreen() {
      this.educationSection.opType = 'toAdd';
      this.selectedConsentSection.opType = "toAdd"; // eslint-disable-line
      this.selectedConsentSection.consentId = this.consentId;
    },
    onDragSections(consentId) {
      this.consentSections.forEach((item, index) => {
        //eslint-disable-line
        this.consentSections[index].sectionNumber = index + 1;
      });
      nprogress.start();
      this.$api
        .updateConsentSectionsOrderFactV2(
          this.studyId,
          consentId,
          this.consentSections,
        )
        .then(
          () => {
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while saving the data',
            );
            nprogress.done();
          },
        );
    },
    onDragQuiz(consentId) {
      nprogress.start();
      this.$api
        .updateConsentQuizOrderFactV2(
          this.studyId,
          consentId,
          this.quizQuestions,
        )
        .then(
          () => {
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while saving the data',
            );
            nprogress.done();
          },
        );
    },
    editConsentSection(screen) {
      this.selectedConsentSection = _.cloneDeep(screen);
      this.selectedConsentSection.consentId = this.consentId;
      this.selectedConsentSection.opType = "toEdit"; // eslint-disable-line
      this.educationSection.opType = "toEdit"; // eslint-disable-line
      this.$store.dispatch(
        'addConsentSectionAction',
        this.selectedConsentSection,
      );
    },
    addNewQuizQuestion() {
      this.addEditQuizQuestion.opType = null;
      this.addEditQuizQuestion.opType = 'toAdd';
      this.addEditQuizQuestion.consentId = this.consentId;
    },
    editQuizQuestion(screen) {
      this.addEditQuizQuestion = _.cloneDeep(screen);
      this.addEditQuizQuestion.opType = "toEdit"; // eslint-disable-line
      this.addEditQuizQuestion.consentId = this.consentId;
      this.$store.dispatch('addConsentSectionAction', this.addEditQuizQuestion);
    },
    getStudyDetail() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
        this.supportedLanguages = response.body.language;
        this.loadQuestion();
      }, error => {
        toastr.error(
          error.body && error.body.message
            ? error.body.message
            : 'Error while getting the study details',
        );
      });
    },
    getDisclaimers(){
      this.$api
        .getConsentDisclaimers(this.studyId, this.consentId)
        .then(response => {
            this.apiDiscliamerResponse = response.body;
            this.disclaimerList = _.cloneDeep(this.apiDiscliamerResponse);
          },
          error => {
            toastr.error(
              error.body
                ? error.body.message
                : 'Error while getting the consent disclaimer',
            );
          },
        );
    },
    addDisclaimer() {
      dynamicDisclaimerID++;
      let newDisclaimer = {
        disclaimer: "",
        disclaimerId: null,
        status: true,
        dynamicDisclaimerID: dynamicDisclaimerID
      }; 
      this.disclaimerList.push(newDisclaimer);
    },
    removeDisclaimer(index) {
      swal({
        title:
          'Are you sure you want to remove this disclaimer?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.disclaimerList.splice(index, 1);    
        }
      });
      
    },
    addUpdateDisclaimer(){
      let apiDiscliamerLength = this.apiDiscliamerResponse.length;
      if(apiDiscliamerLength == 0 && this.disclaimerList.length == 0){
        return;
      }

      //Remove the keys that are not need for api request
      _.map(this.disclaimerList, function(dObject) {
          delete dObject.dynamicDisclaimerID;
        });

      let resourceMethod = this.apiDiscliamerResponse.length == 0 ? "addDisclaimers" : "updateDisclaimers";
      this.$api[resourceMethod](this.studyId, this.consentId, this.disclaimerList).then(
          response => {},
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while disclaimer API request."
            );
          }
        );
    }
  },
  components: {
    addEditEducation,
    addEditQuiz,
    draggable,
  },
};
</script>

<style scoped lang="scss">
.apply-float {
  float: left;
}
.lang-text {
  font-family: Lato-Regular;
  font-weight: bold;
  letter-spacing: normal;
  color: #4a4a4a;
}
.clear-float {
  clear: both;
}
.heading-box {
  margin-left: 50px;
  margin-top: 43px;

  .main-heading {
    font-family: Lato-Regular;
    font-size: 22px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.21;
    letter-spacing: normal;
    color: #2d3752;
  }

  .sub-heading {
    font-family: Lato-Regular;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-top: 4px;
  }
}

.child-container {
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
  margin-top: 20px;
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
  padding: 20px 20px;

  .box {
    .box-heading {
      font-family: Lato-Regular;
      font-size: 17px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.4;
      letter-spacing: normal;
      color: #4a4a4a;
      cursor: pointer;

      img {
        margin-right: 10px;
      }
    }
    .active {
      color: #1e8fe1;
    }

    .inner-box {
      margin-left: 35px;
    }

    .input-field {
      width: 250px;
      height: 40px;
      border-radius: 3px;
      border: solid 1px #e4e8eb;
      background-color: #ffffff;
      font-family: Lato-Regular;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #9b9b9b;
      padding-left: 11.5px;
      margin-top: 10px;
    }

    .continue-btn1 {
      width: 100px;
      height: 36px;
      border-radius: 4px;
      border: solid 2px #ffffff;
      display: block;
      margin-top: 15px;
      font-family: Lato-Regular;
      font-size: 15px;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
      background: #1e8fe1;
      cursor: pointer;
    }
  }

  .box-divider {
    width: 1000px;
    height: 1px;
    background-color: #e4e8eb;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .add-another-education-screen-btn {
    width: 150px;
    height: 30px;
    border-radius: 3px;
    background-color: #fff;
    font-family: Lato-Regular;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1e8fe1;
    border: 1px solid #1e8fe1;
    margin-top: 20px;
    cursor: pointer;
  }

  .box2-content {
    font-family: Lato-Regular;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
    margin: 7px 0px;
  }

  .box2-draggable-education {
    width: 970px;
    height: 70%;
    border-radius: 3px;
    border: solid 1px #e4e8eb;
    background-color: #f5f6f7;
    margin-top: 10px;
    margin-right: 20px;

    span {
      display: block;
      float: left;
      width: auto;

      img {
        padding: 25px 10px;
      }
    }

    .content {
      padding: 15px 0px;
      display: inline-block;
      float: left;
      width: 80%;

      .heading {
        font-family: Lato-Regular;
        font-size: 15px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      .text {
        font-family: Lato-Regular;
        font-size: 15px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4a4a4a;
      }
    }

    .btn {
      float: right;
      padding: 20px;

      button {
        width: 70px;
        height: 30px;
        border-radius: 3px;
        background-color: #f5f6f7;
        font-family: Lato-Regular;
        font-size: 13px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #1e8fe1;
        border: solid 1px #1e8fe1;
        cursor: pointer;
      }
    }

    .clearfix {
      clear: both;
    }

    .box3-content {
      font-family: Lato;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #4a4a4a;
      margin-top: 6px;
    }
  }

  .add-a-question-btn {
    width: 150px;
    height: 30px;
    border-radius: 3px;
    background-color: #fff;
    font-family: Lato-Regular;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1e8fe1;
    border: solid 1px #1e8fe1;
    margin-top: 20px;
    cursor: pointer;
  }

  .continue-btn3 {
    width: 100px;
    height: 36px;
    border-radius: 4px;
    border: solid 2px #ffffff;
    display: block;
    margin-top: 15px;
    font-family: Lato-Regular;
    font-size: 15px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    background: #1e8fe1;
    margin-top: 30px;
    cursor: pointer;
  }
}

.document-section {
  .btns {
    float: right;

    .cancel-btn {
      width: 100px;
      height: 36px;
      border-radius: 3px;
      background-color: #fff;
      font-family: Lato-Regular;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      color: #1e8fe1;
      border: 0;
      cursor: pointer;
      margin-right: 10px;
    }

    .save-btn {
      width: 100px;
      height: 36px;
      border-radius: 3px;
      background-color: #1e8fe1;
      font-family: Lato-Regular;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      border: 1px solid #1e8fe1;
      cursor: pointer;
    }
  }

  .heading1 {
    font-family: Lato-Regular;
    font-size: 17px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-top: 6px;
  }

  .heading2 {
    margin-top: 30px;
    font-family: Lato-Regular;
    font-size: 17px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .heading3 {
    margin-top: 30px;
    font-family: Lato-Regular;
    font-size: 17px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .text1 {
    font-family: Lato-Regular;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .upload-btn {
    margin-top: 10px;

    .upload-btn {
      width: 100px;
      height: 30px;
      border-radius: 3px;
      background-color: #fff;
      font-family: Lato-Regular;
      font-size: 13px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #1e8fe1;
      border: solid 1px #1e8fe1;
      cursor: pointer;
    }
  }

  .input1 {
    margin-top: 10px;

    input {
      width: 450px;
      height: 40px;
      border-radius: 3px;
      border: solid 1px #e4e8eb;
      background-color: #ffffff;
      padding-left: 11px;
    }

    input:placeholder {
      font-family: Lato-Regular;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #9b9b9b;
    }
  }

  .input2 {
    margin-top: 10px;

    textarea {
      width: 970px;
      height: 100px;
      border-radius: 3px;
      border: solid 1px #e4e8eb;
      background-color: #ffffff;
      padding-left: 10px;
      padding-top: 10px;
    }

    textarea:placeholder {
      font-family: Lato;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #9b9b9b;
    }
  }
}
.bottom-section {
  margin-top: 50px;

  .left-block {
    clear: both;
    float: left;
  }

  .right-block {
    float: right;

    .save-btn {
      width: 100px;
      height: 36px;
      border-radius: 4px;
      border: solid 2px #1e8fe1;
      font-family: Lato-Regular;
      font-size: 15px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      background: #1e8fe1;
      color: #ffffff;
    }
  }

  .clearfix {
    clear: both;
  }
}

.file-upload {
  position: relative;
  overflow: hidden;
  border: none;
  width: 80px;
  height: 30px;
  border-radius: 3px;
  padding: 5px 10px;
  display: inline;
  background-color: #fff;
  width: 100px;
  height: 36px;
  border-radius: 4px;
  border: solid 1px #1e8fe1;
  font-family: Lato-Regular;
  font-size: 13px;
  /* font-weight: bold; */
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  background: #fff;
  color: #1e8fe1;
}

.question-panel {
  .question-section {
    width: 970px;
    height: auto;
    border-radius: 3px;
    border: solid 1px #e4e8eb;
    background: #e4e8eb;
    padding: 15px;
    margin-top: 10px;
  }

  .heading {
    font-family: Lato-Regular;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .description {
    font-family: Lato-Regular;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .edit-btn {
    width: 150px;
    height: 30px;
    border-radius: 3px;
    background-color: #fff;
    font-family: Lato-Regular;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1e8fe1;
    border: 1px solid #1e8fe1;
    margin-top: 20px;
    cursor: pointer;
  }
}

.box2-continue-btn {
  width: 100px;
  height: 36px;
  border-radius: 4px;
  border: solid 2px #ffffff;
  display: block;
  margin-top: 15px;
  font-family: Lato-Regular;
  font-size: 15px;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  background: #1e8fe1;
  cursor: pointer;
}

.disabled_continue_btn {
  opacity: 0.5;
}

.delete-btn {
  cursor: pointer;
}

.back-button {
  margin: 0;
  padding: 0;
  margin-left: 50px;
  margin-top: -30px;
}

button:hover{
  opacity: 0.5;
}

.disclaimer-section{
  .heading3{
    margin-top: 20px;
  }
  .form-group{
    position: relative;
    label{
      color: #4a4a4a;
      margin-bottom: 0.125rem;
    }
    textarea{
      border-radius: 3px;
      border: solid 1px #e4e8eb;
      width: 91%;
    }
    .remove{
      color: #f66855;
      position: absolute;
      top: 50%;
      left: 93%;
      cursor: pointer;
    }
    &:last-of-type{
      margin-bottom: 0;
    }
  }

  
  .disclaimer-btn { 
    border-radius: 3px;
    background-color: #fff;
    font-family: Lato-Regular;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1e8fe1;
    border: solid 1px #1e8fe1;
    margin-top: 20px;
    cursor: pointer;
    padding: 7px 15px;
  }
  
  .list-enter-active, .list-leave-active {
    transition: opacity .5s;
  }
  .list-enter, .list-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
