<template>
  <b-container fluid class="pt-30 mb-5 component">
    <b-row>
      <b-col cols="2">
        <button-cmp variant="link" size="sm" @click="goToPreviousScreen" class="back-button">
          <span>
            <strong>
              <i class="fa fa-caret-left fa-lg" aria-hidden="true"></i>
            </strong>&nbsp; Back</span>
        </button-cmp>
        <EdcFormInfo v-if="generalInfo" v-bind="generalInfo" @verificationConfirmed="verificationConfirmed" @approvalConfirmed="approvalConfirmed" />
        <hr v-if="participantInfo" class="mt-30 mb-30" />
        <ParticipantInfo v-if="participantInfo" :participantDetails="participantInfo" />
      </b-col>
      <b-col cols="10" class="pb-20">
        <b-card no-body class="border-0 shadow study-particip-form-block">
          <b-row v-if="edcFormHistoryVersion" no-gutters>
            <b-col>
              <EdcFormHistoryVersion :edcFormVersionData="edcFormHistoryVersion" @back="historyBack" />
            </b-col>
          </b-row>
          <b-row v-else no-gutters>
              <b-col :class="{'col-12': sourceDocumentsOpen, 'col-8': !sourceDocumentsOpen}">
              <b-tabs v-model="tabIndex">
                <b-tab title="Latest Version"  @click="openTab(1)">
                  <b-row>
                    <b-col>
                      <div v-if="canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess" class="float-right my-1">
                        <button-cmp v-if="!edit" @click="edit = !edit" size="sm" variant="outline-secondary">
                          <span>
                            <i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                        </button-cmp>
                        <strong v-else class="editing">Currently editing</strong>
                      </div>
                    </b-col>
                  </b-row>
                  <b-card-group v-if="!edit" v-for="(unscheduleAnswers, index) in answersObj" :key="index" :class="{'border-top': true, 'pb-15' : index+1 === answersObj.length, 'pb-5' : index+1 !== answersObj.length}">
                    <b-card no-body class="border-0" :header="unscheduleAnswers.formName">
                      <SubmittedFormPreview v-if="unscheduleAnswers.formData" :formData="unscheduleAnswers.formData" @openQuery="openQuery" :queryIds="queryIds" @selected="filterByField" :selectedFieldId="filterFieldId" :selectedId="selectedId"/>
                    </b-card>
                  </b-card-group>
                  <div v-if="edit">
                    <div v-for="(unscheduleForm, index) in unscheduledForms" :key="index" :class="{'formBorder': index!=unscheduledForms.length - 1}">
                      <label class="fs-14 pt-20 pl-30 m-0">
                        <b>{{unscheduleForm.form.name}}</b>
                      </label>
                      <FormPreview :formData="unscheduleForm.form.fields" :formSubmitted="formSubmitted" :queryTool="true" />
                    </div>
                    <b-row class="my-2 pl-30 pt-15 pb-15" align-v="center">
                      <b-col cols="3">
                        <button variant="primary" class="btn btn-block fs-14 btn-primary primaryBgColor pl-0 pr-0" @click="openChangeReasonModal">Save</button>
                      </b-col>
                      <b-col cols="3">
                        <b-link class="fs-14 primary" @click="cancelEdit">Cancel</b-link>
                      </b-col>
                    </b-row>
                  </div>
                </b-tab>
                <b-tab title="History" v-if="formHistory && formHistory.length" @click="checkEditMode">
                  <EdcFormHistoryList :history="formHistory" @view="viewHistoryForm" />
                </b-tab>
                <b-tab title="Source Documents" v-if="getDocuments && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canCraAccess || canSiteDataLockAccess)" @click="openTab(3)">
                   <EdcFormSourceDocuments :documents="documentsList"
                    :studyId="studyId" :participantId="participantId" :responseId="unscheduledPacketResponseId" type="UNSCHEDULED" @getDocuments="getSourceDocuments" :participantInfo="participantInfo"
                  /> 
                </b-tab>
              </b-tabs>
            </b-col>
            <b-col cols="5" xl="4" class="tabs-queries" v-if="sourceDocumentsOpen === false">
              <EdcFormQueries v-model="newQuery" :filter="selectedId" @updateComment="updateComment" @updateQueries="getListOfQueries" :comments="comments" :queries="queries" :formId="fId" @openQuery="openQuery" @createQuery="createQuery" @createComment="createComment" @resetFilter="resetFilter" @onQueryClosed="onQueryClosed" @onQueryReopened="onQueryReopened" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <FormChangeReasonModal
      v-model="changeReasonModalVisible"
      @confirmed="updateUnschedulePacket"
    />
    <!-- Cancel editing form confirmation  Modal Component -->
    <b-modal id="editFormModal" ref="editFormModal" @hidden="closeModal('editFormModal')" hide-footer hide-header :no-close-on-esc="true" :no-close-on-backdrop="true">
      <b-row class="pt-20 width-500 border-style text-center">
        <b-col align-self="center" class="pb-0 pl-0">
          <h2>
            <b>Warning</b>
          </h2>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col align-self="center" class="pb-5 pt-5">
          Are you sure you want to cancel editing this form?
        </b-col>
      </b-row>
      <b-row class="pt-20 pb-40">
        <b-col cols="3"></b-col>
        <b-col cols="3">
          <b-btn class="btn-block fs-14" variant="secondary" @click="cancelAndCloseModal('editFormModal')">
            No
          </b-btn>
        </b-col>
        <b-col cols="3">
          <b-btn class="btn-block fs-14 error-bg primaryBgColor" variant="primary" @click="cancelEdit(),closeModal('editFormModal')">
            Yes
          </b-btn>
        </b-col>
      </b-row>
      <div class="modal-style">
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import ParticipantInfo from '@/components/participants/participant-info';
import EdcFormInfo from '@/components/form/edc-form-info';
import EdcFormHistoryList from '@/components/form/edc-form-history-list';
import EdcFormHistoryVersion from '@/components/form/edc-form-history-version';
import EdcFormQueries from '@/components/form/edc-form-queries';
import ButtonCmp from '@/components/common/button';
import FormPreview from '@/components/edc-form/form-preview';
import FormChangeReasonModal from '@/components/modals/form-change-reason-modal';
import SubmittedFormPreview from '@/components/edc-form/submitted-form-preview';
import EdcFormSourceDocuments from '@/components/form/edc-form-source-documents';

import { AclRule } from 'vue-acl';
import { mapActions, mapGetters } from 'vuex';
import find from 'lodash/find';
import each from 'lodash/each';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import cloneDeep from 'lodash/cloneDeep';
import pull from 'lodash/pull';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';

import { PI, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH, CRA, SITEDATALOCK  } from '@/constants/authRoles';
import { formFieldQueryStatus } from '@/constants/form';

export default {
  name: 'study-participant-form',
  components: {
    ParticipantInfo,
    EdcFormInfo,
    EdcFormHistoryList,
    EdcFormHistoryVersion,
    EdcFormQueries,
    ButtonCmp,
    FormPreview,
    SubmittedFormPreview,
    FormChangeReasonModal,
    EdcFormSourceDocuments
  },
  props: {
    studyId: {
      type: String,
    },
    studyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formSubmitted: 1,
      tabIndex: 0,
      participantInfo: null,
      formHistory: null,
      isLoading: true,
      newQuery: null,
      selectedId: null,
      edit: false,
      filterFieldId: null,
      generalInfo: null,
      participant: null,
      sections: [],
      queries: [],
      comments: [],
      formStudyId: this.$route.params.studyId,
      milestone: this.$route.params.milestone,
      participantId: this.$route.params.participantId,
      unscheduledPacketResponseId: this.$route.params.unscheduledPacketResponseId,
      packetId: this.$route.params.packetId,
      formData: [],
      formResponses: {},
      unscheduledAnswers: [],
      alreadySavedUnscheduleForms: [],
      unscheduledForms: [],
      answersObj: [],
      historyAnswersObj: [],
      formErrors: [],
      modifiedUnscheduledForms: [],
      diffResp: [],
      unscheduledFormsHistory: [],
      edcFormHistoryVersion: null,
      queryIds: [],
      changeReasonModalVisible: false,
      siteTeam: {},
      unschedulePackets: null,
      sourceDocumentsOpen: false,
      documentsList: [],
      siteTeamDetails: [],
      getDocuments: false
    };
  },
  computed: {
    fId() {
      return this.$route.params.packetId;
    },
    fieldsWithQueries() {
      if (this.queries) {
        return this.queries.filter(q => q.status === formFieldQueryStatus.OPEN).map(q => q.fieldId);
      }
      return [];
    },
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
    canSubPiAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check('userAccess');
    },
    canScAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check('userAccess');
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check('userAccess');
    },
      canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  methods: {
    ...mapActions(['clearEDCFormErrors']),
    closeModal(ref) {
      this.$refs[ref].hide();
    },

    cancelAndCloseModal(ref) {
      this.tabIndex = 0;
      this.$refs[ref].hide();
    },

    showModal(ref) {
      this.$refs[ref].show();
    },

    checkEditMode() {
      this.openTab(2)
      if (this.edit) {
        this.showModal('editFormModal');
      }
    },

    openChangeReasonModal() {
      this.changeReasonModalVisible = true;
    },

    // API integration to send Verify / Unverify form
    verificationConfirmed(status) {
      if (this.generalInfo.verificationStatus !== status) {
        const updateData = {
          action: status,
          verifyAction: true,
        };
        this.$api.updateEdcUnscheduleFormResponseVersionsResource(
          this.alreadySavedUnscheduleForms.unscheduledPacketResponseId,
          this.alreadySavedUnscheduleForms.unscheduledPacketResponseVersionId,
          this.studyId, updateData)
          .then(() => {
            /* this.generalInfo.verificationStatus = status;
            this.getListOfQueries();
            // get the form history versions
            this.getEDCFormHistoryList(); */
            this.getEDCUnscheduledPacketForms();
            this.$toastr.success(`${status === 'NOT_VERIFIED' ? 'Unverification' : 'Verification'} confirmed`);
          }).catch(error => {
            const { message = 'Error while saving verification status' } = (error && error.body) || {};
            this.$toastr.error(message);
          });
      }
    },

    // API integration to send approve / unapprove
    approvalConfirmed(status) {
      if (this.generalInfo.approvalStatus !== status) {
        const updateData = {
          action: status,
          approveAction: true,
        };
        this.$api.updateEdcUnscheduleFormResponseVersionsResource(
          this.alreadySavedUnscheduleForms.unscheduledPacketResponseId,
          this.alreadySavedUnscheduleForms.unscheduledPacketResponseVersionId,
          this.studyId, updateData)
          .then(() => {
            /* this.generalInfo.approvalStatus = status;
            this.getListOfQueries();
            // get the form history versions
            this.getEDCFormHistoryList(); */
            this.getEDCUnscheduledPacketForms();
            this.$toastr.success(`${status === 'APPROVED' ? 'Approval confirmed' : 'Unapproval confirmed'}`);
          })
          .catch(error => {
            const { message = 'Error while saving approval status' } = (error && error.body) || {};
            this.$toastr.error(message);
          });
      }
    },

    cancelEdit() {
      this.clearEDCFormErrors();
      this.edit = false;
      this.getEDCUnscheduledPacketForms();
    },
    openQuery(fieldId) {
      this.newQuery = fieldId;
      this.selectedId = fieldId;
    },
    createQuery(query) {
      const reqObj = {
        responseId: this.formResponses.responseId,
        fieldId: query.fieldId,
        responseType: 'UNSCHEDULED',
        comment: {
          cText: query.comment,
        },
      };
      this.$api
        .openNewQuery(reqObj, this.formStudyId)
        .then(() => {
          this.$toastr.success('Query created');
          this.getListOfQueries();
          this.selectedId = null;
        })
        .catch(error => {
          const { message = 'Error while creating field query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    createComment(commentData) {
      const obj = {
        cText: commentData.comment,
      };
      this.$api
        .addNewComment(commentData.queryId, this.formStudyId, obj)
        .then(() => {
          this.$api
            .getAllQueryComments(commentData.queryId, this.formStudyId)
            .then(response => {
              this.comments = response.body.comments;
            });
        })
        .catch(error => {
          const { message = 'Error while creating comment' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },

    // API to fetch the saved form in history
    viewHistoryForm(versionForm) {
      //Prepare a reason for change string to display on the view history form.
      let createdDate = this.$options.filters.formatGMTDate(new Date(versionForm.createdAt));
      let reasonForChange = versionForm.primaryReason ? versionForm.primaryReason : 'N/A';
      reasonForChange += ` ${createdDate} by ${versionForm.createdBy}`;
      this.$api
        .getedcUnscheduleFormResponseVersionsResource(versionForm.responseId,
          versionForm.responseVerionId, this.studyId,
        )
        .then(response => {
          this.unscheduledFormsHistory = [];
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
                const selectedOption = find(this.formData.fields[selectedFieldIndex].options, [
                  'id',
                  answer.optionId,
                ]);
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
                if (
                  this.formData.fields[selectedFieldIndex].name === 'formSinglechoice'
                  || this.formData.fields[selectedFieldIndex].name === 'formDropdown'
                ) {
                  this.formData.fields[selectedFieldIndex].answer = answer.optionId;
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
                // for form scale we can have scale label or non scale labels as answer
                if (this.formData.fields[selectedFieldIndex].name === 'formScale') {
                  const selectedScaleOption = find(this.formData.fields[selectedFieldIndex].options, ['id', answer.optionId]);
                  if (selectedScaleOption.type === 'NA' || selectedScaleOption.type === 'Other') {
                    this.formData.fields[selectedFieldIndex].nonScaleAnswer = answer.answerText;
                    this.formData.fields[selectedFieldIndex].answer = null;
                  }
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
            this.unscheduledFormsHistory.push({
              form: this.formData,
              response: this.formResponses || [],
              editedFields: result.editedFields || [],
            });
          });
          this.historyAnswersObj = [];
          this.modifiedUnscheduledForms = cloneDeep(this.unscheduledFormsHistory);
          // questions and answers object for display
          this.unscheduledFormsHistory.forEach(unscheduleform => {
            const answerObj = [];
            each(unscheduleform.form.fields, question => {
              const newObj = {};
              newObj.question = question.body;
              newObj.name = question.name;
              newObj.id = question.id;
              if (question.name !== 'formHeader' && question.name !== 'formParagraph') {
                newObj.sequence = question.sequence;
              }
              const resObj = find(
                unscheduleform.response.answers,
                answer => answer.questionId === question.id,
              );
              if (resObj) {
                if (
                  resObj.questionName === 'formCheckbox'
                  || resObj.questionName === 'formTable'
                ) {
                  newObj.answerText = resObj.multiAnswer;
                  if (resObj.comment && resObj.comment !== 'this is not valid') {
                    newObj.answerText = `${resObj.answerText} - ${resObj.comment}`;
                  }
                  //Implemented this code for Previous values
                  newObj.previousAnswerText = resObj.previousMultiAnswer;

                  if(resObj.previousComment && resObj.previousComment !== 'this is not valid'){
                    newObj.previousAnswerText = `${resObj.previousMultiAnswer} - ${resObj.previousComment}`;
                  }
                  //New Code End
                } else if (resObj.questionName === 'formDateTime') {
                  newObj.answerText = `${resObj.date || ''} ${resObj.time || ''} ${resObj.timezone || ''}`;
                  newObj.previousAnswerText = `${resObj.previousDate || ''} ${resObj.previousTime || ''} ${resObj.previousTimezone || ''}`;
                } else {
                  newObj.answerText = resObj.answerText;
                  if (resObj.comment && resObj.comment !== 'this is not valid') {
                    newObj.answerText = `${resObj.answerText} - ${resObj.comment}`;
                  }
                  newObj.previousAnswerText = resObj.previousAnswerText;
                  if(resObj.previousComment && resObj.previousComment !== 'this is not valid'){
                    newObj.previousAnswerText = `${resObj.previousAnswerText} - ${resObj.previousComment}`;
                  }
                }
              } else {
                newObj.answerText = '';
              }
              newObj.isEditedVersion = unscheduleform.editedFields
                && unscheduleform.editedFields.includes(question.id);
              answerObj.push(newObj);
            });
            this.historyAnswersObj.push({
              formName: unscheduleform.form.name,
              formData: answerObj,
            });
          });
          this.edcFormHistoryVersion = {
            fields: this.historyAnswersObj,
            isUnSchedule: true,
            primaryReason: reasonForChange
          };
        })
        .catch(error => {
          const { message = 'Error while getting form version' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },

    historyBack() {
      this.edcFormHistoryVersion = null;
    },
    filterByField(id) {
      this.selectedId = id;
    },
    resetFilter() {
      this.filterFieldId = null;
      this.selectedId = null;
    },
    onQueryClosed(query) {
      this.$api
        .updateQueryStatus(query.queryId, this.formStudyId, 'CLOSE')
        .then(() => {
          this.$toastr.success('Query closed');
          this.getListOfQueries();
          this.selectedId = null;
        })
        .catch(error => {
          const { message = 'Error while closing query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    onQueryReopened(query) {
      this.$api
        .updateQueryStatus(query.queryId, this.formStudyId, 'OPEN')
        .then(() => {
          this.$toastr.success('Query reopened');
          this.getListOfQueries();
          this.selectedId = null;
        })
        .catch(error => {
          const { message = 'Error while reopening query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },

    // get list of queries mapped to the current form
    getListOfQueries() {
      this.$api.getAllListOfQueries(this.alreadySavedUnscheduleForms.unscheduledPacketResponseId,
        this.formStudyId)
        .then(response => {
          this.queries = response.body;
          this.queryIds = map(response.body.filter(resp => resp.status === 'OPEN'), 'fieldId');
          this.queries.forEach((query, queryIndex) => {
            query.comments.forEach((comment, commentIndex) => {
              const tempComment = comment;
              tempComment.createdBy = this.siteTeam[comment.createdBy];
              this.queries[queryIndex].comments[commentIndex] = tempComment;
            });
          });
        });
    },

    // get site team members
    async getSiteTeam() {
      const type="studyteam"
      const associated = "true"
      const studyTeamData = await this.$api.getStudyUsersFact(this.$route.params.studyId, type, associated);
      const siteTeamData = await this.$api.getUserNames(this.$route.params.studyId);
      studyTeamData.body.forEach(team => {
        this.siteTeam[team.id] = `${team.firstName} ${team.lastName}`;
         const siteTeamObj = {}
          siteTeamObj['id'] = team.id
          siteTeamObj['name'] = `${team.firstName} ${team.lastName}`
          siteTeamObj['userRole'] = team.userRole
          this.siteTeamDetails.push(siteTeamObj)
      });
      siteTeamData.body.forEach(team => {
        this.siteTeam[team.id] = `${team.firstName} ${team.lastName}`;
         const siteTeamObj = {}
          siteTeamObj['id'] = team.id
          siteTeamObj['name'] = `${team.firstName} ${team.lastName}`
          siteTeamObj['userRole'] = team.userRole
          this.siteTeamDetails.push(siteTeamObj)
      });
      await this.getParticipantDetails();
      await this.getUnschduledPacketInfo();
    },

    // get the participant details
    async getParticipantDetails() {
      await this.$api.getParticipantDataFact(this.formStudyId, this.participantId).then(
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

    // get edc form history list
    getEDCFormHistoryList() {
      this.$api.getEdcQueryFormVersionsHistoryStatus(this.formId, this.alreadySavedUnscheduleForms
        .unscheduledPacketResponseId, this.studyId, 'UNSCHEDULED')
        .then(result => {
          this.formHistory = orderBy(result.body, ['createdAt'], ['desc']);
          this.formHistory.forEach((form, formIndex) => {
            this.formHistory[formIndex].createdBy = this.siteTeam[form.createdBy];
          });
          this.getDocuments = true
        }).catch(error => {
          this.formHistory = [];
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Unable to fetch the form versions history.',
          );
        });
    },
    getUnschduledPacketInfo() {
      let self = this;
      this.$api.getEDCUnscheduleFormResponseFact(
          this.studyId,
          this.$route.params.participantId
        )
        .then(
          response => {
            if (response.body && response.body.length > 0) {  
              self.unschedulePackets = response.body.filter(packet => {
                return packet.unscheduledPacketId == this.packetId;
              });
            }
            self.getEDCUnscheduledPacketForms();
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting Unscheduled Packet information."
            );
          }
        );
    },

    // get the unscheduled packets details
    getEDCUnscheduledPacketForms() {
      this.$api
        .getUnscheduleFormResponseFact(
          this.studyId,
          this.participantId,
          this.packetId,
          this.unscheduledPacketResponseId,
        )
        .then(response => {
          this.unscheduledForms = [];
          this.alreadySavedUnscheduleForms = response.body;
          // get the form history versions
          this.getEDCFormHistoryList();
          // get the list of queries mapped to the current form
          this.getListOfQueries();
          this.getSourceDocuments();
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
                const selectedOption = find(this.formData.fields[selectedFieldIndex].options, [
                  'id',
                  answer.optionId,
                ]);
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
                if (
                  this.formData.fields[selectedFieldIndex].name === 'formSinglechoice'
                  || this.formData.fields[selectedFieldIndex].name === 'formDropdown'
                ) {
                  this.formData.fields[selectedFieldIndex].answer = answer.optionId;
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
                // for form scale we can have scale label or non scale labels as answer
                if (this.formData.fields[selectedFieldIndex].name === 'formScale') {
                  const selectedScaleOption = find(this.formData.fields[selectedFieldIndex].options, ['id', answer.optionId]);
                  if (selectedScaleOption.type === 'NA' || selectedScaleOption.type === 'Other') {
                    this.formData.fields[selectedFieldIndex].nonScaleAnswer = answer.answerText;
                    this.formData.fields[selectedFieldIndex].answer = null;
                  }
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
              response: this.formResponses || [],
            });
          });
          this.modifiedUnscheduledForms = cloneDeep(this.unscheduledForms);
          // questions and answers object for display
          this.answersObj = [];
          this.unscheduledForms.forEach(unscheduleform => {
            const answerObj = [];
            each(unscheduleform.form.fields, question => {
              const newObj = {};
              newObj.question = question.body;
              newObj.name = question.name;
              newObj.id = question.id;
              if (question.name !== 'formHeader' && question.name !== 'formParagraph') {
                newObj.sequence = question.sequence;
              }
              const resObj = find(
                unscheduleform.response.answers,
                answer => answer.questionId === question.id,
              );
              if (resObj) {
                if (
                  resObj.questionName === 'formCheckbox'
                  || resObj.questionName === 'formTable'
                ) {
                  if(resObj.questionName === 'formCheckbox') {
                    resObj.multiAnswer.forEach(answer => {
                    question.options.forEach(option => {
                      if(answer.optionId === option.id) {
                        if(option.colorCoding)
                        answer.colorCoding = option.colorCoding;
                      }
                    })
                  })
                  newObj.noOfColumns = question.noOfColumns;
                  }
                  newObj.answerText = resObj.multiAnswer;
                  if (resObj.comment && resObj.comment !== 'this is not valid') {
                    newObj.answerText = `${resObj.answerText} - ${resObj.comment}`;
                  }
                } else if (resObj.questionName === 'formDateTime') {
                  newObj.answerText = `${resObj.date || ''} ${resObj.time || ''} ${resObj.timezone || ''}`;
                } else {
                  if(resObj.questionName === 'formSinglechoice') {
                    const optionObj = find(question.options, option => resObj.optionId === option.id);
                    if(optionObj.colorCoding)
                    newObj.colorCoding = optionObj.colorCoding;
                  }
                  newObj.answerText = resObj.answerText;
                  if (resObj.comment && resObj.comment !== 'this is not valid') {
                    newObj.answerText = `${resObj.answerText} - ${resObj.comment}`;
                  }
                }
              } else {
                newObj.answerText = '';
              }
              answerObj.push(newObj);
            });
            this.answersObj.push({
              formName: unscheduleform.form.name,
              formData: answerObj,
            });
          });
          this.generalInfo = {
            formId: this.formData.id,
            formName: this.unschedulePackets && this.unschedulePackets.length > 0 ? this.unschedulePackets[0].packetName : this.formData.name,
            approvalStatus: this.alreadySavedUnscheduleForms.approvalStatus,
            verificationStatus: this.alreadySavedUnscheduleForms.verificationStatus,
            numberOfOpenQueries: null,
            numberOfClosedQueries: null,
            verifiedOn: 0,
            approvedOn: 0,
            submittedOn: null,
            comments: null,
          };
        })
        .catch(error => {
          if (error && (error.message || error.body.message)) {
            this.$toastr.error(error.message || error.body.message);
          } else {
            this.$toastr.error('Unable to fetch the unscheduled packets');
          }
        });
    },

    // save the edited forms in the packet
    updateUnschedulePacket(changeReason) {
      const currentEdcFormErrors = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
      if (
        find(currentEdcFormErrors, ['comment', true])
        || find(currentEdcFormErrors, ['time', true])
        || find(currentEdcFormErrors, ['date', true])
      ) {
        this.formSubmitted = this.formSubmitted + 1;
        this.$toastr.error('Please populate required fields.');
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
            this.unscheduledForms[formIndex].response.state = 'SUBMITTED';
            this.unscheduledForms[formIndex].response.answers = [];
            this.generateAnswerFormat(field.name, field, answersPreviouslySaved, formIndex);
          });
          // attach generated answers array to intialized answers array
          if (this.currentFormResoponse.length) {
            this.unscheduledForms[formIndex].response.answers = this.currentFormResoponse;
          }
        });
        // loop over the unschedule forms to check whether the required fields are filled or not
        this.unscheduledForms.forEach((unscheduleForm, formIndex) => {
          // get all required fields for each form
          const requiredFieldIds = unscheduleForm.form.fields
            .filter(field => field.required === true)
            .map(field => field.id);
          // get all the answers filled for each form
          const answersIds = unscheduleForm.response.answers.map(answer => answer.questionId);
          if (difference(requiredFieldIds, answersIds).length && answersIds.length) {
            this.formSubmitted = this.formSubmitted + 1;
            this.formErrors.push({
              formId: unscheduleForm.form.id,
              formName: unscheduleForm.form.name,
              errorMsg: `Please fill all the required fields in the form ${
                unscheduleForm.form.name
              }.`,
            });
          }

          this.diffResp = [];
          unscheduleForm.form.fields.forEach(field => {
            // get the old and new answers given by user
            const oldAnsField = find(this.modifiedUnscheduledForms[formIndex].response.answers, [
              'questionId',
              field.id,
            ]);
            const newAnsField = find(unscheduleForm.response.answers, ['questionId', field.id]);
            // Update the diffResp array if any of the answer ( old or new ) is not present
            if (oldAnsField && !newAnsField) {
              this.diffResp.push(field.id);
            } else if (!oldAnsField && newAnsField) {
              this.diffResp.push(field.id);
            } else if (oldAnsField && newAnsField) {
              // Check optionId's of old new new answers
              if (oldAnsField.optionId !== newAnsField.optionId) {
                this.diffResp.push(field.id);
              } else if (field.name === 'formDateTime') {
                // Check answer date and time and update the flag if changed
                if (
                  oldAnsField.date !== newAnsField.date
                  || oldAnsField.time !== newAnsField.time
                  || oldAnsField.timezone !== newAnsField.timezone
                ) {
                  this.diffResp.push(field.id);
                }
              } else if (field.name === 'formCheckbox') {
                // Check for answers length update the flag if lengths are different
                if (
                  oldAnsField.multiAnswer.length !== newAnsField.multiAnswer.length
                  || (!newAnsField.multiAnswer.length && oldAnsField.multiAnswer.length > 0)
                  || (newAnsField.multiAnswer.length && !oldAnsField.multiAnswer.length)
                ) {
                  this.diffResp.push(field.id);
                } else if (oldAnsField.multiAnswer.length === newAnsField.multiAnswer.length) {
                  // If answers length are equal check for the option Id's
                  // if changed and update the status
                  const existingAns = oldAnsField.multiAnswer.map(multiAns => multiAns.optionId);
                  const newAns = newAnsField.multiAnswer.map(multiAns => multiAns.optionId);
                  if (
                    difference(newAns, existingAns).length > 0
                    || difference(existingAns, newAns).length > 0
                  ) {
                    this.diffResp.push(field.id);
                  }
                  // If answers length and options ID's are equal check for the comments
                  // if changed and update the status
                  const existingCommentsAns = oldAnsField.multiAnswer
                    .map(multiAns => multiAns.comment);
                  const newCommentsAns = newAnsField.multiAnswer.map(multiAns => multiAns.comment);
                  if (
                    difference(newCommentsAns, existingCommentsAns).length > 0
                    || difference(existingCommentsAns, newCommentsAns).length > 0
                  ) {
                    this.diffResp.push(field.id);
                  }
                }
              } else if (field.name === 'formTable') {
                // Check for answers length update the flag if lengths are different
                if (
                  oldAnsField.multiAnswer.length !== newAnsField.multiAnswer.length
                  || (!newAnsField.multiAnswer.length && oldAnsField.multiAnswer.length > 0)
                  || (newAnsField.multiAnswer.length && !oldAnsField.multiAnswer.length)
                ) {
                  this.diffResp.push(field.id);
                } else if (oldAnsField.multiAnswer.length === newAnsField.multiAnswer.length) {
                  // If answers length are equal check for the answerTexts
                  // if changed and update the status
                  const existingAns = oldAnsField.multiAnswer.map(multiAns => multiAns.answerText);
                  const newAns = newAnsField.multiAnswer.map(multiAns => multiAns.answerText);
                  if (
                    difference(newAns, existingAns).length > 0
                    || difference(existingAns, newAns).length > 0
                  ) {
                    this.diffResp.push(field.id);
                  }
                }
              } else if (field.name === 'formTextArea' || field.name === 'formScale'
                || field.name === 'formTextNumeric') {
                // Check answer text of old new new answers
                if (oldAnsField.answerText !== newAnsField.answerText) {
                  this.diffResp.push(field.id);
                }
                // Check answer's comment of old new new answers if present
                if (oldAnsField.comment && newAnsField.comment) {
                  if (oldAnsField.comment !== newAnsField.comment) {
                    this.diffResp.push(field.id);
                  }
                } else if ((!newAnsField.comment && oldAnsField.comment)
                  || (newAnsField.comment && !oldAnsField.comment)) {
                  this.diffResp.push(field.id);
                }
              } else if (field.name === 'formDropdown' || field.name === 'formSinglechoice') {
                // Check answer text of old new new answers
                if (oldAnsField.comment && newAnsField.comment
                  && oldAnsField.comment !== newAnsField.comment) {
                  this.diffResp.push(field.id);
                }
              }
            }
          });
          this.unscheduledForms[formIndex].editedFields = this.diffResp;
        });
        if (this.formErrors.length) {
          this.$toastr.error(this.formErrors[0].errorMsg);
        } else {
          const areFieldsEdited = uniq(map(this.unscheduledForms, form => form
            .editedFields.length > 0));
          const fieldsEditedFlag = areFieldsEdited[1]
            ? areFieldsEdited[0] || areFieldsEdited[1] : areFieldsEdited[0];
          if (!fieldsEditedFlag) {
            this.$toastr.error('No new changes were made to the packet.');
          } else {
            const updateData = {
              participantId: this.participantId,
              unscheduledPacketId: this.packetId,
              unscheduledPacketVersionId: this.alreadySavedUnscheduleForms.unscheduledVersionId,
              state: 'SUBMITTED',
              packetFormResponses: this.unscheduledForms,
              primaryReason: changeReason,
            };
            updateData.unscheduledPacketResponseId = this.unscheduledPacketResponseId;
            updateData.unscheduledPacketResponseVersionId = this.alreadySavedUnscheduleForms
              .unscheduledPacketResponseVersionId;
            updateData.unscheduledPacketVersionId = this.alreadySavedUnscheduleForms
              .unscheduledPacketVersionId;
            this.$api
              .updateEDCUnscheduleFormResponseFact(
                this.packetId,
                this.studyId,
                this.participantId,
                this.unscheduledPacketResponseId,
                updateData,
              )
              .then(response => {
                if (response.body.unscheduledPacketResponseId) {
                  // clear all the available errorflags from Vue store
                  this.clearEDCFormErrors();
                  this.edit = false;
                  this.getEDCUnscheduledPacketForms();
                  // get the form history versions
                  this.getEDCFormHistoryList();
                } else {
                  this.$toastr.error('Unable to submit your response, Please try again.');
                }
              })
              .catch(error => {
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(
                    error.message
                      || error.body.message
                      || 'Unable to submit your response, Please try again.',
                  );
                }
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
              weight: answerSelected.weight,
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

    goToPreviousScreen() {
      const studyID = this.studyId;
      this.$router.push({
        name: 'study-participant-details',
        params: { studyID, participantId: this.participantId },
      });
    },

    updateComment(queryId, fieldId) {
      this.selectedId = fieldId;
      this.$api
        .getAllQueryComments(queryId, this.formStudyId)
        .then(response => {
          this.comments = response.body.comments;
        });
    },

    // update the flag from the form fields after the form submitted
    formSubmittedFlag(value) {
      this.formSubmitted = value;
    },
   openTab(tabNumber) {
      switch(tabNumber) {
      case 1: 
      this.sourceDocumentsOpen = false;
      break;
      case 2: 
      this.sourceDocumentsOpen = false;
      break;
      case 3: 
      this.sourceDocumentsOpen = true;
      break;
      }
    },
    getSourceDocuments() {
      this.$api.getSourceDocumentsFact(this.studyId, this.participantId, this.unscheduledPacketResponseId, this.participantInfo.siteId)
        .then(response => {
          this.documentsList = orderBy(response.body,'name')
          this.documentsList.forEach(document => {
            const documentIndex = findIndex(this.siteTeamDetails, ["id", document.createdBy])
            document.createdByName = this.siteTeamDetails[documentIndex].name
            let createdByRole = this.siteTeamDetails[documentIndex].userRole
             if(createdByRole === 'Cra') {
              document.createdByUserRole = 'CRA'
            } 
            else if(createdByRole === 'Pi') {
              document.createdByUserRole = 'PI';
            }
            else if(createdByRole === 'SubPi') {
              document.createdByUserRole = 'Sub-I';
            }
            else if(createdByRole === 'StudyCoordinator') {
              document.createdByUserRole = 'SC';
            }
            else if(createdByRole === 'HomeHealth') {
              document.createdByUserRole = 'Home Health';
            }
            const fileSize = (document.size/1024).toFixed(2) 
            if(fileSize < 1024) {
             document.fileSize = fileSize + ' KB'
            }
            else {
              document.fileSize = (fileSize/1024).toFixed(2) + ' MB'
            }
        });
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting source documents',
          );
        })  
  }
  },

  mounted() {
    this.getSiteTeam();
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';

.component {
  background-color: $color_content_background;
}

.back-button {
  font-size: 14px;
  padding-top: 0px;
  padding-left: 0px;
  margin-bottom: 20px;
}

.editing {
  text-transform: uppercase;
  font-size: 12px;
  color: #7478e6;
}
</style>
<style lang="scss">
.study-particip-form-block {
  .nav-tabs {
    border-bottom-color: #d3dfe4;
    .nav-item {
      margin: 0 25px;
    }

    .nav-link {
      font-size: 14px;
      line-height: 1.43;
      color: #2d3752;
      padding: 0.9rem 0 0.45rem !important;
      border: none;
      border-bottom: 4px solid transparent;

      &:focus,
      &:hover {
        border: none;
        border-bottom: 4px solid transparent;
      }

      &:hover {
        border-bottom: 4px solid #4c8ce4;
      }

      &.active {
        font-weight: bold;
        border-bottom: 4px solid #4c8ce4;
      }
    }
  }

  .tabs-queries {
    border-left: 1px solid #d3dfe4;

    .nav-tabs {
      margin-left: -1px;
      border-left: 1px solid #fff;
      flex-wrap: inherit;
    }
  }
}

@media (max-width: 1400px) {
  .study-particip-form-block {
    .nav-tabs {
      .nav-item {
        margin: 0 10px;
      }
    }
  }
}

.primaryBgColor {
  background-color: #1e8fe1;
}
.reason {
  font-family: "RobotoBold" !important;
  color: #666669;
  padding-left: 30px;
  padding-top: 19px;
}
</style>
