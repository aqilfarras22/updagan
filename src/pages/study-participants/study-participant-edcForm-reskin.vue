<template>
  <div class="study-particip-details-block pt-10" :class="{'telehealth-call': telehealthCallStatus}">
    <div class="nav-breadcrumb">
    <NavigationBreadcrumb :navigationWidth="navigationWidth" @toggleParticipant="toggleParticipant" :navigationOptions="navigationOptions"></NavigationBreadcrumb>
	</div>
	<div class="clear-float"></div>
  <PiiAndNonPiiInfo class="clear-both" v-if="participantInfo" :participantDetails="participantInfo"  @expanded="piInfoExpanded"></PiiAndNonPiiInfo>
	<b-row id="edcFormDetail">
		<b-col cols="12" class="p-0">
			<ParticipantInfo class="mt-3" v-if="participantInfo" :participantDetails="participantInfo" :areActionsAllowed="areActionsAllowed" :hasToHide="true" />
    </b-col>
	</b-row>
    <b-row class="forms-section" v-if="formData && formData.fields">
      <b-col cols="12" class="pl-0 pr-0 shadow">
        <b-row class="mb-20">
          <div class="primaryBackGround">
            <FormPreview v-if="formData && formData.fields" :formSubmitted="formSubmitted" :formName="formData.name" :formData="formData.fields" />
            <div class="pt-20 pl-30">
              <b-btn size="sm" class="fs-12 mr-5 btn-block mt-7" variant="outline-secondary" @click="cancelForm">Cancel, do not save</b-btn>
              <b-btn size="sm" class="fs-12 mr-5 btn-block" variant="outline-primary" @click="validateDataAndSave('DRAFT')" :disabled="canCraAccess || canDmAccess || canSiteDataLockAccess">Save as draft</b-btn>
              <b-btn size="sm" class="fs-12 primaryBgColor btn-block" variant="primary" @click="validateDataAndSave('SUBMITTED')" :disabled="canCraAccess || canDmAccess || canSiteDataLockAccess">Save and submit</b-btn>
            </div>
          </div>
        </b-row>
        <b-row>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import find from 'lodash/find';
import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';
import uniq from 'lodash/uniq';
import pull from 'lodash/pull';
import isEmpty from 'lodash/isEmpty';
import { AclRule } from 'vue-acl';
import { mapActions, mapGetters } from 'vuex';
import { CRA, DM, SITEDATALOCK } from '@/constants/authRoles';
import NavigationBreadcrumb from "@/components/common/navigation-breadcrumb";
import ParticipantInfo from '@/components/participants/participant-info-new';
import FormPreview from '../../components/edc-form/form-preview';
import PiiAndNonPiiInfo from "@/components/participants/pii-and-non-pii-info";

export default {
  name: 'Form-view',
  data() {
    return {
      formSubmitted: 1,
      formId: this.$route.params.formId,
      studyId: this.$route.params.studyId,
      milestone: Number(this.$route.params.milestone),
      participantId: this.$route.params.participantId,
      responseId: this.$route.params.responseId,
      formData: [],
      saveType: '',
      formResponses: {},
      participantInfo: {},
      response: [],
      formSaveResponse: {},
      isOldProfileViewEnbaled: false,
      navigationOptions: [
        {name: "Profile", isLink: true, route: 'participant-profile', params: {studyId: this.$route.params.studyId}, displayOrder: 2},
        {name: "Participants", isLink: true, route: 'study-participants-list', params: {studyId: this.$route.params.studyId}, displayOrder: 1},
        {name: "Submit Form Details", isLink: false, route: null, params: null, displayOrder: 3}
      ],
      areActionsAllowed: {document: false, telehealth: true, edcforms: false},
      navigationWidth: "55%",
      telehealthCallStatus: false,
      buttonClicked : false
    };
  },
  components: {
    FormPreview,
    ParticipantInfo,
    NavigationBreadcrumb,
    PiiAndNonPiiInfo
  },
  watch: {
    getVideoCallStatus(isCallInProgress) {
      this.telehealthCallStatus = isCallInProgress;
    },
  },
  methods: {
    ...mapActions(['clearEDCFormErrors']),
    piInfoExpanded(isExpanded) {
      let c = document.getElementById('edcFormDetail');
      if(isExpanded) {
        setTimeout(() => {
          let expandEle = document.getElementById('collapse-piiandnon-pii');
          window.$('#edcFormDetail').animate({
            paddingTop: (expandEle.offsetHeight - 34) + 'px'
          })
        }, 400);
      } else {
        c.style.paddingTop = '0px';
      }
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          if (response.body) {
            this.toggleFeatures = response.body.studyFeatures;
            this.toggleFeatures.forEach(feature => {
              if (feature.featureKey === "OLDPROFILEVIEW") {
                this.isOldProfileViewEnbaled = feature.enabled;
                return;
              }
            });
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting trueclinic features."
          );
        }
      );
    },
    closeModal(ref) {
      this.$refs[ref].hide();
    },

    // get the participant details
    getParticipantDetails() {
      this.$api.getParticipantDataFactV2(this.studyId, this.participantId).then(
        response => {
          this.participantInfo = response.body;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting participant.',
          );
        },
      );
    },

    // get the edc form data
    getEDCFormDetails() {
      // call the form response API if PI already saved the form
      if (this.responseId !== '0') {
        this.$api
          .getEDCFormResponseByResponseIdFact(this.formId, this.studyId, this.participantId,
            this.responseId, this.milestone)
          .then(result => {
            this.milestone = result.body.milestone;
            this.formResponses = result.body.response;
            this.formData = result.body.form;
            // send the saved answers to the corresponding form components
            if (
              this.formResponses
              && this.formResponses.answers
              && this.formResponses.answers.length
            ) {
              // loop through the available answers
              this.formResponses.answers.forEach(answer => {
                // get the field index in the saved formData using answer question ID
                const selectedFieldIndex = findIndex(this.formData.fields, [
                  'id',
                  answer.questionId,
                ]);
                // get the option which is saved as answer using option ID
                const selectedOption = find(this.formData.fields[selectedFieldIndex].options, [
                  'id',
                  answer.optionId,
                ]);
                // get index of the option in options array which is saved as answer using optionnId
                const selectedOptionIndex = findIndex(
                  this.formData.fields[selectedFieldIndex].options,
                  ['id', answer.optionId],
                );
                // In formData attach answer as well as the comment if the comment message is saved
                this.formData.fields[selectedFieldIndex].answer = answer.answerText;
                // for singlechoice the answer which is saved need's to be modified as per preview
                if (
                  this.formData.fields[selectedFieldIndex].name === 'formSinglechoice'
                  || this.formData.fields[selectedFieldIndex].name === 'formDropdown'
                ) {
                  this.formData.fields[selectedFieldIndex].answer = selectedOption.id;
                }
                if (this.formData.fields[selectedFieldIndex].name === 'formScale') {
                  const selectedScaleOption = find(
                    this.formData.fields[selectedFieldIndex].options,
                    ['id', answer.optionId],
                  );
                  if (selectedScaleOption.type === 'NA' || selectedScaleOption.type === 'Other') {
                    this.formData.fields[selectedFieldIndex].nonScaleAnswer = answer.answerText;
                    this.formData.fields[selectedFieldIndex].answer = null;
                  }
                }
                if (
                  selectedOption
                  && selectedOption.type === 'Other'
                  && selectedOption.commentField
                ) {
                  this.formData.fields[selectedFieldIndex].options[
                    selectedOptionIndex
                  ].comment.commentMessage = answer.comment;
                }
                // for checkBox the options array which is saved need's to
                // be modified as per preview
                const tempOptions = [];
                if (this.formData.fields[selectedFieldIndex].name === 'formCheckbox') {
                  this.formData.fields[selectedFieldIndex].options.forEach((option, index) => {
                    const tempOption = option;
                    tempOption.answer = { unSelected: `${index + 1}` };
                    tempOption.value = option.label;
                    tempOption.selectVal = `${index + 1}`;
                    tempOptions.push(option);
                  });
                  answer.multiAnswer.forEach(ans => {
                    tempOptions[ans.index].answer = { selected: tempOptions[ans.index].selectVal };
                    if (
                      tempOptions[ans.index].type === 'Other'
                      && tempOptions[ans.index].commentField
                    ) {
                      tempOptions[ans.index].comment.commentMessage = ans.comment;
                    }
                  });
                  this.formData.fields[selectedFieldIndex].options = tempOptions;
                }
                if (this.formData.fields[selectedFieldIndex].name === 'formDateTime') {
                  if (answer.time) {
                    if (this.formData.fields[selectedFieldIndex].timeField.format === 'hh:mm a') {
                      const timeVals = answer.time.split(' ');
                      const time = timeVals[0].split(':');
                      this.formData.fields[selectedFieldIndex].time = {
                        hh: time[0],
                        mm: time[1],
                      };
                      this.formData.fields[selectedFieldIndex].meridian = timeVals[1] || null;
                    } else if (
                      this.formData.fields[selectedFieldIndex].timeField.format === 'HH:mm'
                    ) {
                      const time = answer.time.split(':');
                      this.formData.fields[selectedFieldIndex].time = {
                        HH: time[0],
                        mm: time[1],
                      };
                    }
                    this.formData.fields[selectedFieldIndex].timezone = answer.timezone;
                  }
                  if (answer.date) {
                    const dateVals = answer.date.split('/');
                    const dateFormat = pull(
                      uniq(this.formData.fields[selectedFieldIndex].dateField.format),
                      '/',
                    );
                    dateFormat.forEach((value, index) => {
                      if (value === 'M') {
                        this.formData.fields[selectedFieldIndex].month = dateVals[index];
                      }
                      if (value === 'D') {
                        this.formData.fields[selectedFieldIndex].date = dateVals[index];
                      }
                      if (value === 'Y') {
                        this.formData.fields[selectedFieldIndex].year = dateVals[index];
                      }
                    });
                  }
                }
                // for table the fields array which is saved need's to be modified as per preview
                const tempTableOptions = [];
                if (this.formData.fields[selectedFieldIndex].name === 'formTable') {
                  // for the available fields add the answer which are configured at form creation
                  if (this.formData.fields[selectedFieldIndex].noOfFields) {
                    for (
                      let ind = 0;
                      ind < this.formData.fields[selectedFieldIndex].noOfFields;
                      ind++
                    ) {
                      tempTableOptions.push({
                        index: ind,
                        type: 'OPTION',
                        label: '',
                      });
                    }
                  }
                  // Add the answer to fields which are not configured
                  // while form creation but added by user
                  const tempTableUserOptions = [];
                  if (
                    answer.multiAnswer.length > this.formData.fields[selectedFieldIndex].noOfFields
                  ) {
                    for (
                      let ind = this.formData.fields[selectedFieldIndex].noOfFields;
                      ind < answer.multiAnswer.length;
                      ind++
                    ) {
                      tempTableUserOptions.push({
                        index: ind,
                        type: 'OPTION',
                        label: '',
                      });
                    }
                  }

                  // attach answers to the generated fields and user added fields
                  answer.multiAnswer.forEach((ans, index) => {
                    if (index < this.formData.fields[selectedFieldIndex].noOfFields) {
                      tempTableOptions[index].label = ans.answerText;
                    }
                    if (index >= this.formData.fields[selectedFieldIndex].noOfFields) {
                      tempTableUserOptions[
                        index - this.formData.fields[selectedFieldIndex].noOfFields
                      ].label = ans.answerText;
                    }
                  });
                  this.formData.fields[selectedFieldIndex].fields = tempTableOptions;
                  this.formData.fields[selectedFieldIndex].addFields = tempTableUserOptions;
                }
              });
            }
            // add the mode for each form component to display as preview
            const formFields = [];
            this.formData.fields.forEach(field => {
              const formField = field;
              formField.mode = 'saved';
              formFields.push(formField);
            });
            this.formData.fields = formFields;
          });
      } else {
        // call the form API if it is the first time PI is filling the form
        this.$api.getEDCFormDataFact(this.formId, this.studyId).then(response => {
          this.formData = response.body;
          const formFields = [];
          this.formData.fields.forEach(field => {
            const formField = field;
            formField.mode = 'saved';
            formFields.push(formField);
          });
          this.formData.fields = formFields;
          this.formResponses = [];
        });
      }
    },

    // cancel the form and goto participant details
    cancelForm() {
      const studyID = this.studyId;
      this.$router.push({
        name: 'participant-profile',
        params: { studyID: this.studyID, participantId: this.participantId },
      });
    },

    // validate data before sending it to backend ans save
    validateDataAndSave(type) {
      this.buttonClicked = true;
      this.saveType = type;
      // Ask for time zone if the dateTime field is answered or present in the form
      const currentEdcFormErrors = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
      let dateError = [];
      let notAnError = [];
      if(find(currentEdcFormErrors, ['time', true]) || find(currentEdcFormErrors, ['date', true])) {
      currentEdcFormErrors.forEach((error, index) => {
        if(error.date === true || error.time === true) {
          dateError.push(error);
        }
      })
      this.formData.fields.forEach(field => {
            if(field.name === "formDateTime") {
              if(!field.date && !field.month && !field.year && (isEmpty(field.time) || !field.time.h || !field.time.m) && !field.meridian && !field.timezone && (field.required === true)) {
                notAnError.push(field);
              }
            }
          });
      }
      if ( this.saveType == "DRAFT" && (find(currentEdcFormErrors, ['time', true]) || find(currentEdcFormErrors, ['date', true])) && (dateError.length !== notAnError.length)) {
        this.formSubmitted = this.formSubmitted + 1;
        this.$toastr.error('Please correct the Date/Time fields error as per the requirement');
        this.buttonClicked = false;
      }
     else if (
        this.saveType == "SUBMITTED" &&
        (find(currentEdcFormErrors, ['comment', true])
        || find(currentEdcFormErrors, ['time', true])
        || find(currentEdcFormErrors, ['date', true]))
      ) {
        this.formSubmitted = this.formSubmitted + 1;
        this.$toastr.error('Please populate the fields per the requirement.');
        this.buttonClicked = false;
      } else {
        this.response = [];
        let answersPreviouslySaved = [];
        if (this.formResponses) {
          answersPreviouslySaved = this.formResponses.answers || [];
        }
        this.formData.fields.forEach(field => {
          this.generateAnswerFormat(field.name, field, answersPreviouslySaved);
        });
        const requiredFieldIds = this.formData.fields
          .filter(field => field.required === true)
          .map(field => field.id);
        // get all the answers filled for each form
        const answersIds = this.response.map(answer => answer.questionId);
        if ((difference(requiredFieldIds, answersIds).length) && type === 'SUBMITTED') {
          this.formSubmitted = this.formSubmitted + 1;
          this.$toastr.error(
            `Please fill all the required fields in the form ${this.formData.name}.`,
          );
          this.buttonClicked = false;
        } else {
          const postData = {
            form: this.formData,
            milestone: this.milestone,
            participantId: this.participantId,
            response: {
              state: this.saveType,
              answers: this.response,
            },
          };
          if (this.formResponses && this.formResponses.responseId) {
            postData.response.responseId = this.formResponses.responseId;
            postData.response.responseVersion = this.formResponses.responseVersion;
            postData.response.responseVersionId = this.formResponses.responseVersionId;
          }
          if (!this.formResponses || (this.formResponses && !this.formResponses.responseId)) {
            this.$api
              .postEDCFormResponseFact(this.formId, this.studyId, this.participantId, postData)
              .then(response => {
                if (response.body.response.responseId) {
                  // clear all the available errorflags from Vue store
                  this.clearEDCFormErrors();
                  const studyID = this.studyId;
                  this.saveType = '';
                  this.$router.push({
                    name: this.isOldProfileViewEnbaled ? 'study-participant-details' : 'participant-profile',
                    params: { studyID, participantId: this.participantId },
                  });
                }
                this.buttonClicked = false;
              }).catch(error => {
                const message = 'Error while saving the form.';
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(error.message || error.body.message || message);
                }
                this.buttonClicked = false;
              });
          } else if (this.formResponses && this.formResponses.responseId) {
            this.$api
              .updateEDCFormResponseFact(
                this.formId,
                this.studyId,
                this.participantId,
                this.formResponses.responseId,
                postData,
              )
              .then(response => {
                if (response.body.response.responseId) {
                  // clear all the available errorflags from Vue store
                  this.clearEDCFormErrors();
                  const studyID = this.studyId;
                  this.saveType = '';
                  this.$router.push({
                    name: this.isOldProfileViewEnbaled ? 'study-participant-details' : 'participant-profile',
                    params: { studyID, participantId: this.participantId },
                  });
                }
                this.buttonClicked = false;
              }).catch(error => {
                const message = 'Error while updating the form.';
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(error.message || error.body.message || message);
                }
                this.buttonClicked = false;
              });
          }
        }
      }
    },

    // get answer format for the field given
    generateAnswerFormat(fieldName, field, answers) {
      switch (fieldName) {
        case 'formDropdown': {
          if (field.answer) {
            const answerSelected = find(field.options, ['id', field.answer]);
            const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
            const dropDownResponse = {
              questionId: field.id,
              questionName: field.name,
              optionId: answerSelected.id,
              answerText: answerSelected.label,
              index: answerSelected.index,
            };
            if (isAnswerAlreadySaved) {
              dropDownResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            if (answerSelected.type === 'Other' && answerSelected.commentField) {
              dropDownResponse.comment = answerSelected.comment.commentMessage;
            }
            this.response.push(dropDownResponse);
          }
          break;
        }
        case 'formCheckbox': {
          const checkBoxResponse = {
            questionId: field.id,
            questionName: field.name,
            multiAnswer: [],
          };
          const areAnswersAlreadySaved = find(answers, ['questionId', field.id]);
          field.options.forEach(option => {
            if (option.answer && option.answer.selected) {
              const tempCheckBoxResponse = {
                optionId: option.id,
                answerText: option.label,
                index: option.index,
              };
              if (option.type === 'Other' && option.commentField) {
                tempCheckBoxResponse.comment = option.comment.commentMessage;
              }
              checkBoxResponse.multiAnswer.push(tempCheckBoxResponse);
            }
          });
          if (areAnswersAlreadySaved) {
            checkBoxResponse.answerId = areAnswersAlreadySaved.answerId;
          }
          if (checkBoxResponse.multiAnswer.length > 0) {
            this.response.push(checkBoxResponse);
          }
          break;
        }
        case 'formTextNumeric': {
          if (field.answer) {
            const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
            const textNumericResponse = {
              questionId: field.id,
              questionName: field.name,
              answerText: field.answer,
            };
            if (isAnswerAlreadySaved) {
              textNumericResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            this.response.push(textNumericResponse);
          }
          break;
        }
        case 'formSinglechoice': {
          if (field.answer) {
            const answerSelected = find(field.options, ['id', field.answer]);
            const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
            const singleChoiceResponse = {
              questionId: field.id,
              questionName: field.name,
              optionId: answerSelected.id,
              answerText: answerSelected.label,
              index: answerSelected.index,
            };
            if (isAnswerAlreadySaved) {
              singleChoiceResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            if (answerSelected.type === 'Other' && answerSelected.commentField) {
              singleChoiceResponse.comment = answerSelected.comment.commentMessage;
            }
            this.response.push(singleChoiceResponse);
          }
          break;
        }
        case 'formScale': {
          if (field.answer && !field.nonScaleAnswer) {
            const answerSelected = find(field.options, ['label', field.answer]);
            const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
            const scaleResponse = {
              questionId: field.id,
              questionName: field.name,
              optionId: answerSelected.id,
              answerText: answerSelected.label,
              weight: answerSelected.weight,
              index: answerSelected.index,
            };
            if (isAnswerAlreadySaved) {
              scaleResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            if (answerSelected.type === 'Other' && answerSelected.commentField) {
              scaleResponse.comment = answerSelected.comment.commentMessage;
            }
            this.response.push(scaleResponse);
          }
          if (field.nonScaleAnswer) {
            const answerSelected = find(field.options, ['label', field.nonScaleAnswer]);
            const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
            const scaleResponse = {
              questionId: field.id,
              questionName: field.name,
              optionId: answerSelected.id,
              answerText: answerSelected.label,
              index: answerSelected.index,
            };
            if (isAnswerAlreadySaved) {
              scaleResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            if (answerSelected.type === 'Other' && answerSelected.commentField) {
              scaleResponse.comment = answerSelected.comment.commentMessage;
            }
            this.response.push(scaleResponse);
          }
          break;
        }
        case 'formDateTime': {
          const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
          const dateTimeResponse = {
            questionId: field.id,
            questionName: field.name,
            timezone: field.timezone,
          };
          if (isAnswerAlreadySaved) {
            dateTimeResponse.answerId = isAnswerAlreadySaved.answerId;
          }
          if (field.collectDate && field.dateField.format) {
            const dateFormat = pull(uniq(field.dateField.format), '/').join('');
            dateTimeResponse.date = '';
            dateFormat.split('').forEach(val => {
              if (val === 'M' && field.month) {
                dateTimeResponse.date += `${field.month}/`;
              }
              if (val === 'Y' && field.year) {
                dateTimeResponse.date += `${field.year}/`;
              }
              if (val === 'D' && field.date) {
                dateTimeResponse.date += `${field.date}/`;
              }
            });
            if (dateTimeResponse.date.length > 0) {
              dateTimeResponse.date = dateTimeResponse.date.slice(0, -1);
            }
          }
          if (field.collectTime && field.timeField.format) {
            if (field.timeField.format === 'hh:mm a' && field.time.hh && field.time.mm) {
              dateTimeResponse.time = `${field.time.hh}:${field.time.mm} ${field.meridian}`;
            }
            if (field.timeField.format === 'HH:mm' && field.time.HH && field.time.mm) {
              dateTimeResponse.time = `${field.time.HH}:${field.time.mm}`;
            }
          }
          if (
            (dateTimeResponse.date && dateTimeResponse.date.length > 0)
            || (dateTimeResponse.time && dateTimeResponse.time.length > 0)
          ) {
            this.response.push(dateTimeResponse);
          }
          break;
        }
        case 'formTable': {
          const tableResponse = {
            questionId: field.id,
            questionName: field.name,
            multiAnswer: [],
          };
          const areAnswersAlreadySaved = find(answers, ['questionId', field.id]);
          field.fields.forEach(option => {
            if (option.label) {
              tableResponse.multiAnswer.push({
                answerText: option.label,
              });
            }
          });
          field.addFields.forEach(option => {
            if (option.label) {
              tableResponse.multiAnswer.push({
                answerText: option.label,
              });
            }
          });
          if (areAnswersAlreadySaved) {
            tableResponse.answerId = areAnswersAlreadySaved.answerId;
          }
          if (tableResponse.multiAnswer.length > 0) {
            this.response.push(tableResponse);
          }
          break;
        }
        case 'formTextArea': {
          if (field.answer) {
            const isAnswerAlreadySaved = find(answers, ['questionId', field.id]);
            const textAreaResponse = {
              questionId: field.id,
              questionName: field.name,
              answerText: field.answer,
            };
            if (isAnswerAlreadySaved) {
              textAreaResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            this.response.push(textAreaResponse);
          }
          break;
        }
        default:
          break;
      }
    },

    // update the flag from the form fields after the form submitted
    formSubmittedFlag(value) {
      this.formSubmitted = value;
    },
    toggleParticipant(participant) {
      let params = {
        studyId: this.studyId,
        formId: this.formId,
        milestone: this.milestone,
        responseId: this.responseId || '0'
      };
      this.$router.push({name: 'study-participant-edc-reskin', params: params});
      this.participantId = participant.id;
      this.clearEDCFormErrors();
      this.getParticipantDetails();
      this.getEDCFormDetails();
      this.getToggledFeatures();
    }
  },
  mounted() {
    // clear all the available errorflags from Vue store
    this.clearEDCFormErrors();

    this.getParticipantDetails();
    this.getEDCFormDetails();
    this.getToggledFeatures();
  },
  computed: {
    ...mapGetters(['user', 'getVideoCallStatus']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check('userAccess');
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';
.study-particip-details-block {
  background-color: #fff;
}
.participant-detail-section {
  background-color: #fff;
}

.primaryBgColor {
  background-color: #1e8fe1;
}

.primaryBackGround {
  background-color: #ffffff !important;
  padding: 0px 0px 20px 0px !important;
  width: 100% !important;
}
.clear-float {
  clear: both;
}

.pointerEventsNone {
  pointer-events: none;
}
.shadow {
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.06);
}
/deep/ .modal.show .modal-dialog {
  width: 400px !important;
}
.btn-block {
  border: solid 1px #e4e8eb;
  padding: 11px;
  font-size: 14px;
  border-radius: 4px;
  width: 130px;
  display: inline-block;
}
.telehealth-call {
  .forms-section {
    font-size: 13px;
  }
}
</style>
