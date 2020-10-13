<template>
  <b-container fluid class="study-particip-details-block pt-30">
    <b-row>
      <b-col cols="2">
        <ParticipantInfo :participantDetails="participantInfo" />
      </b-col>
      <b-col cols="8" class="pl-0 pr-0">
        <b-row class="mb-20">
          <div class="primaryBackGround">
            <div v-for="(unscheduleForm, index) in unscheduledForms" :key="index" :class="{'formBorder': index!=unscheduledForms.length - 1}">
              <div class="fs-18 pt-20 pl-30 m-0">
                <b>{{packetName}}</b>
              </div>
              <label class="fs-18 pt-20 pl-30 m-0">
                <b>{{unscheduleForm.form.name}}</b>
              </label>
              <FormPreview :formData="unscheduleForm.form.fields" :formId="unscheduleForm.form.id" :formSubmitted="formSubmitted" />
            </div>
            <div class="pt-40 pl-30">
              <b-btn size="sm" class="fs-12 mr-5" variant="outline-secondary" @click="cancelForm">Cancel, do not save</b-btn>
              <b-btn size="sm" class="fs-12 mr-5" variant="outline-primary" @click="validateDataAndSave('DRAFT')" :disabled="canCraAccess || canDmAccess || canSiteDataLockAccess || buttonClicked">Save as draft</b-btn>
              <b-btn size="sm" class="fs-12 primaryBgColor" variant="primary" @click="validateDataAndSave('SUBMITTED')" :disabled="canCraAccess || canDmAccess || canSiteDataLockAccess || buttonClicked">Save and submit</b-btn>
            </div>
          </div>
        </b-row>
        <b-row>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import pull from 'lodash/pull';
import isEmpty from 'lodash/isEmpty';
import { AclRule } from 'vue-acl';
import { mapActions, mapGetters } from 'vuex';
import { CRA, DM, SITEDATALOCK } from '@/constants/authRoles';

import ParticipantInfo from '@/components/participants/participant-info';
import FormPreview from '../../components/edc-form/form-preview';

export default {
  name: 'Form-view',
  data() {
    return {
      formSubmitted: 1,
      packetId: this.$route.params.packetId,
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      unscheduledPacketResponseId: this.$route.params.unscheduledPacketResponseId,
      unscheduledForms: [],
      selectedPacket: null,
      formData: [],
      saveType: '',
      formResponses: {},
      participantInfo: {},
      responses: [],
      currentFormResoponse: [],
      alreadySavedUnscheduleForms: [],
      formSaveResponse: {},
      formErrors: [],
      packetName: null,
      buttonClicked: false
    };
  },
  components: {
    FormPreview,
    ParticipantInfo,
  },
  methods: {
    ...mapActions(['clearEDCFormErrors']),

    closeModal(ref) {
      this.$refs[ref].hide();
    },

    // get the participant details
    getParticipantDetails() {
      this.$api.getParticipantDataFact(this.studyId, this.participantId).then(
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

    // get the unscheduled packets details
    getEDCUnscheduledPacketForms() {
      this.$api
        .getUnscheduledPacketFact(this.studyId, this.packetId)
        .then(packetResponse => {
          this.selectedPacket = packetResponse.body;
          if(packetResponse && packetResponse.body && packetResponse.body.name) {
            this.packetName = packetResponse.body.name;
          }
          // !== '0' means existing packet
          if (this.unscheduledPacketResponseId !== '0') {
            this.$api
              .getUnscheduleFormResponseFact(
                this.studyId,
                this.participantId,
                this.packetId,
                this.unscheduledPacketResponseId,
              )
              .then(response => {
                this.alreadySavedUnscheduleForms = response.body;
                this.alreadySavedUnscheduleForms.packetFormResponses.forEach(result => {
                  this.formResponses = result.response;
                  this.formResponses.state = result.response.state;
                  this.formData = result.form;
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
                      const selectedOption = find(
                        this.formData.fields[selectedFieldIndex].options,
                        ['id', answer.optionId],
                      );
                      // get index of the option in options array
                      // which is saved as answer using optionnId
                      const selectedOptionIndex = findIndex(
                        this.formData.fields[selectedFieldIndex].options,
                        ['id', answer.optionId],
                      );
                      // In formData attach answer as well as the comment
                      // if the comment message is saved
                      this.formData.fields[selectedFieldIndex].answer = answer.answerText;
                      // for singlechoice the answer which is saved
                      // need's to be modified as per preview
                      if (this.formData.fields[selectedFieldIndex].name === 'formSinglechoice'
                        || this.formData.fields[selectedFieldIndex].name === 'formDropdown') {
                        this.formData.fields[selectedFieldIndex].answer = answer.optionId;
                      }
                      if (this.formData.fields[selectedFieldIndex].name === 'formScale') {
                        const selectedScaleOption = find(this.formData.fields[selectedFieldIndex]
                          .options, ['id', answer.optionId]);
                        if (selectedScaleOption.type === 'NA' || selectedScaleOption.type === 'Other') {
                          this.formData.fields[selectedFieldIndex].nonScaleAnswer = answer
                            .answerText;
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
                      // for checkBox the options array which is saved
                      // need's to be modified as per preview
                      const tempOptions = [];
                      if (this.formData.fields[selectedFieldIndex].name === 'formCheckbox') {
                        this.formData.fields[selectedFieldIndex].options.forEach(
                          (option, index) => {
                            const tempOption = option;
                            tempOption.answer = { unSelected: `${index + 1}` };
                            tempOption.value = option.label;
                            tempOption.selectVal = `${index + 1}`;
                            tempOptions.push(option);
                          },
                        );
                        answer.multiAnswer.forEach(ans => {
                          tempOptions[ans.index].answer = {
                            selected: tempOptions[ans.index].selectVal,
                          };
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
                          } else if (this.formData.fields[selectedFieldIndex].timeField.format === 'HH:mm') {
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
                      // for table the fields array which is saved need's
                      // to be modified as per preview
                      const tempTableOptions = [];
                      if (this.formData.fields[selectedFieldIndex].name === 'formTable') {
                        // for the available fields add the answer which are configured
                        // at form creation
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
                          answer.multiAnswer.length
                          > this.formData.fields[selectedFieldIndex].noOfFields
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
                  this.unscheduledForms.push({
                    form: this.formData,
                    response: {
                      answers: this.formResponses || [],
                      state: this.formResponses.state,
                    },
                  });
                  this.$nextTick(function () {
                    // DOM updated
                    this.formSubmitted++;
                  });
                });
              });
          } else {
            this.getEDCUnscheduleFormDetails();
          }
        })
        .catch(error => {
          if (error && (error.message || error.body.message)) {
            this.$toastr.error(error.message || error.body.message);
          } else {
            this.$toastr.error('Unable to fetch the unscheduled packets');
          }
        });
    },

    // get the edc form data
    getEDCUnscheduleFormDetails() {
      this.selectedPacket.unscheduledForms.forEach(form => {
        this.$api.getEDCFormDataFact(form.formId, this.studyId).then(result => {
          this.formResponses = result.body.response || [];
          this.formData = result.body;
          this.formData.srNo = form.srNo
          // send the saved answers to the corresponding form components
          if (
            this.formResponses
            && this.formResponses.answers
            && this.formResponses.answers.length
          ) {
            // loop through the available answers
            this.formResponses.answers.forEach(answer => {
              // get the field index in the saved formData using answer question ID
              const selectedFieldIndex = findIndex(this.formData.fields, ['id', answer.questionId]);
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
              // for singlechoice the answer which is saved
              // need's to be modified as per preview
              if (this.formData.fields[selectedFieldIndex].name === 'formSinglechoice'
                || this.formData.fields[selectedFieldIndex].name === 'formDropdown') {
                this.formData.fields[selectedFieldIndex].answer = answer.optionId;
              }
              if (this.formData.fields[selectedFieldIndex].name === 'formScale') {
                const selectedScaleOption = find(this.formData.fields[selectedFieldIndex].options, ['id', answer.optionId]);
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
              // for checkBox the options array which is saved
              // need's to be modified as per preview
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
                  } else if (this.formData.fields[selectedFieldIndex].timeField.format === 'HH:mm') {
                    const time = answer.time.split(':');
                    this.formData.fields[selectedFieldIndex].time = {
                      HH: time[0],
                      mm: time[1],
                    };
                  }
                  this.formData.fields[selectedFieldIndex].timezone = answer.timezone || null;
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
          this.unscheduledForms.push({
            form: this.formData,
            response: { answers: this.formResponses || [] },
          });
          this.unscheduledForms = sortBy(this.unscheduledForms, [o => o.form.srNo]);
        });
      });
    },

    // cancel the form and goto participant details
    cancelForm() {
      this.$router.push({
        name: 'study-participant-details',
      });
    },

    // validate data before sending it to backend ans save
    validateDataAndSave(type) {
      this.buttonClicked = true;
      this.saveType = type;
      const currentEdcFormErrors = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
      let dateError = [];
      let notAnError = [];
      if(find(currentEdcFormErrors, ['time', true]) || find(currentEdcFormErrors, ['date', true])) {
      currentEdcFormErrors.forEach((error, index) => {
        if(error.date === true || error.time === true) {
          dateError.push(error);
        }
      })
      this.unscheduledForms.forEach((unscheduleForm, formIndex) => {
          unscheduleForm.form.fields.forEach(field => {
            if(field.name === "formDateTime" && find(dateError, ['uniqId', unscheduleForm.form.id+'_'+field.id] )) {
              if(!field.date && !field.month && !field.year && (isEmpty(field.time) || !field.time.h || !field.time.m) && !field.meridian && !field.timezone && (field.required === true)) {
                notAnError.push(field);
              }
            }
          });
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
        this.responses = [];
        let answersPreviouslySaved = [];
        // loop over entire forms array and generate the answers for each form
        this.formErrors = [];
        this.unscheduledForms.forEach((unscheduleForm, formIndex) => {
          // intialize answers as empty array if no answers
          if (unscheduleForm.response.answers) {
            answersPreviouslySaved = unscheduleForm.response.answers || [];
          }
          this.currentFormResoponse = [];
          // generate answers array
          unscheduleForm.form.fields.forEach(field => {
            this.unscheduledForms[formIndex].response.state = this.saveType;
            this.unscheduledForms[formIndex].response.answers = [];
            this.generateAnswerFormat(field.name, field, answersPreviouslySaved, formIndex);
          });
          // attach generated answers array to intialized answers array
          if (this.currentFormResoponse.length) {
            this.unscheduledForms[formIndex].response.answers = this.currentFormResoponse;
          }
        });
        // loop over the unschedule forms to check whether the required fields are filled or not
        this.unscheduledForms.forEach(unscheduleForm => {
          // get all required fields for each form
          const requiredFieldIds = unscheduleForm.form.fields
            .filter(field => field.required === true)
            .map(field => field.id);
          // get all the answers filled for each form
          const answersIds = unscheduleForm.response.answers.map(answer => answer.questionId);
          if ((difference(requiredFieldIds, answersIds).length) && type === 'SUBMITTED') {
            this.formSubmitted = this.formSubmitted + 1;
            this.formErrors.push({
              formId: unscheduleForm.form.id,
              formName: unscheduleForm.form.name,
              errorMsg: 'Please fill all the required fields.',
            });
          }
        });
        if (this.formErrors.length) {
          this.$toastr.error(this.formErrors[0].errorMsg);
          this.buttonClicked = false;
        } else {
          const postData = {
            participantId: this.participantId,
            unscheduledPacketId: this.packetId,
            unscheduledPacketVersionId: this.selectedPacket.unscheduledVersionId,
            state: this.saveType,
            packetFormResponses: this.unscheduledForms,
          };
          if (this.unscheduledPacketResponseId !== '0') {
            postData.unscheduledPacketResponseId = this.unscheduledPacketResponseId;
            postData.unscheduledPacketResponseVersionId = this.alreadySavedUnscheduleForms
              .unscheduledPacketResponseVersionId;
            postData.unscheduledPacketVersionId = this.alreadySavedUnscheduleForms
              .unscheduledPacketVersionId;
            this.$api
              .updateEDCUnscheduleFormResponseFact(
                this.packetId,
                this.studyId,
                this.participantId,
                this.unscheduledPacketResponseId,
                postData,
              )
              .then(response => {
                if (response.body.unscheduledPacketResponseId) {
                  // clear all the available errorflags from Vue store
                  this.clearEDCFormErrors();
                  const studyID = this.studyId;
                  this.saveType = '';
                  this.$router.push({
                    name: 'study-participant-details',
                    params: { studyID, participantId: this.participantId },
                  });
                } else {
                  this.$toastr.error('Unable to submit your response, Please try again.');
                }
                this.buttonClicked = false;
              })
              .catch(error => {
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(
                    error.message
                      || error.body.message
                      || 'Unable to submit your response, Please try again.',
                  );
                  this.buttonClicked = false;
                }
              });
          } else {
            this.$api
              .postEDCUnscheduleFormResponseFact(
                this.packetId,
                this.studyId,
                this.participantId,
                postData,
              )
              .then(response => {
                if (response.body.unscheduledPacketResponseId) {
                  // clear all the available errorflags from Vue store
                  this.clearEDCFormErrors();
                  const studyID = this.studyId;
                  this.saveType = '';
                  this.$router.push({
                    name: 'study-participant-details',
                    params: { studyID, participantId: this.participantId },
                  });
                } else {
                  this.$toastr.error('Unable to submit your response, Please try again.');
                }
                this.buttonClicked = false; 
              })
              .catch(error => {
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(
                    error.message
                      || error.body.message
                      || 'Unable to submit your response, Please try again.',
                  );
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
              comment: '',
            };
            if (isAnswerAlreadySaved) {
              dropDownResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            if (answerSelected.type === 'Other' && answerSelected.commentField) {
              dropDownResponse.comment = answerSelected.comment.commentMessage;
            }
            this.currentFormResoponse.push(dropDownResponse);
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
                comment:
                  option.type === 'Other' && option.commentField
                    ? option.comment.commentMessage
                    : '',
              };

              checkBoxResponse.multiAnswer.push(tempCheckBoxResponse);
            }
          });
          if (areAnswersAlreadySaved) {
            checkBoxResponse.answerId = areAnswersAlreadySaved.answerId;
          }
          if (checkBoxResponse.multiAnswer.length > 0) {
            this.currentFormResoponse.push(checkBoxResponse);
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
            this.currentFormResoponse.push(textNumericResponse);
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
              comment: '',
            };
            if (isAnswerAlreadySaved) {
              singleChoiceResponse.answerId = isAnswerAlreadySaved.answerId;
            }
            if (answerSelected.type === 'Other' && answerSelected.commentField) {
              singleChoiceResponse.comment = answerSelected.comment.commentMessage;
            }
            this.currentFormResoponse.push(singleChoiceResponse);
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
            this.currentFormResoponse.push(scaleResponse);
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
            this.currentFormResoponse.push(scaleResponse);
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
            dateTimeResponse.timezone = field.timezone;
            this.currentFormResoponse.push(dateTimeResponse);
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
            this.currentFormResoponse.push(tableResponse);
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
            this.currentFormResoponse.push(textAreaResponse);
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
  },
  mounted() {
    // clear all the available errorflags from Vue store
    this.clearEDCFormErrors();

    this.getParticipantDetails();
    this.getEDCUnscheduledPacketForms();
  },
  computed: {
    ...mapGetters(['user']),
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
  background-color: $color_content_background;
    min-height: 600px;
  }

.primaryBgColor {
  background-color: #1e8fe1;
}

.primaryBackGround {
  background-color: #ffffff !important;
  padding: 0px 0px 20px 0px !important;
  width: 100% !important;
}

.formBorder {
  border-bottom: 1.5px solid #e4e8eb;
  padding-bottom: 20px;
}

.pointerEventsNone {
  pointer-events: none;
}

/deep/ .modal.show .modal-dialog {
  width: 400px !important;
}
</style>

