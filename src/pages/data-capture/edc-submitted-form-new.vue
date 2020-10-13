<template>
  <div class="component" :class="{'telehealth-call': telehealthCallStatus}">
	<div class="nav-breadcrumb">
    <NavigationBreadcrumb :navigationWidth="navigationWidth" @toggleParticipant="toggleParticipant" :navigationOptions="navigationOptions"></NavigationBreadcrumb>
	</div>
	<div class="clear-float"></div>
  <PiiAndNonPiiInfo class="clear-both" v-if="participantInfo" :participantDetails="participantInfo" @expanded="piInfoExpanded"></PiiAndNonPiiInfo>
	<b-row class="mt-3" id="edcFormDetail">
		<b-col cols="12" class="p-0">
			<ParticipantInfo class="mt-2" @verificationConfirmed="verificationConfirmed" @approvalConfirmed="approvalConfirmed"  v-if="participantInfo && generalInfo" :edcFormInfo="generalInfo" :participantDetails="participantInfo" :areActionsAllowed="{document: false, telehealth: true, edcforms: false, approval: true, verifyBtn: true}"/>
    </b-col>
	</b-row>
    <div v-if="participantInfo">
      <div class="pb-20">
        <b-card no-body class="border-0 shadow study-particip-form-block">
          <b-row v-if="edcFormHistoryVersion" no-gutters>
            <b-col>
              <EdcFormHistoryVersion :edcFormVersionData="edcFormHistoryVersion" @back="historyBack" />
            </b-col>
          </b-row>
          <b-row v-else no-gutters>
            <b-col :class="{'col-12': sourceDocumentsOpen, 'col-8': !sourceDocumentsOpen}">
              <b-tabs v-model="tabIndex">
                <b-tab title="Latest Version" @click="openTab(1)">
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
                  <b-card-group class="pb-15" v-if="!edit" :class="{'border-top': canPiAccess}">
                    <b-card no-body class="border-0" :header="formData.name">
                      <SubmittedFormPreview v-if="answersObj" :formData="answersObj" @openQuery="openQuery" :queryIds="queryIds" @selected="filterByField" :selectedId="newQuery || clickedFieldId"/>
                    </b-card>
                  </b-card-group>
                  <div v-if="edit">
                    <FormPreview v-if="formData && formData.fields" :formSubmitted="formSubmitted" :formData="formData.fields" :queryTool="true" />
                    <b-row class="my-2 pl-30 pb-15 pt-15" align-v="center">
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
                  <EdcFormHistoryList
                    :history="formHistory"
                    @view="viewHistoryForm"
                  />
                </b-tab>
                <b-tab title="Source Documents" v-if="getDocuments && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canCraAccess || canSiteDataLockAccess)" @click="openTab(3)">
                   <EdcFormSourceDocuments :documents="documentsList"
                    :studyId="studyId" :participantId="participantId" :responseId="formResponses.responseId" type="SCHEDULED" @getDocuments="getSourceDocuments" :participantInfo="participantInfo"
                  />
                </b-tab>
              </b-tabs>
            </b-col>
            <b-col cols="5" xl="4" class="tabs-queries" v-if="sourceDocumentsOpen === false">
              <EdcFormQueries v-model="newQuery" :filter="clickedFieldId" @updateQueries="getListOfQueries" :studyId="formStudyId" @updateComment="updateComment" :comments="comments" :queries="queries" :formId="fId" @openQuery="openQuery" @createQuery="createQuery" @createComment="createComment" @resetFilter="resetFilter" @onQueryClosed="onQueryClosed" @onQueryReopened="onQueryReopened" />
            </b-col>
          </b-row>
        </b-card>
      </div>
    </div>
    <FormChangeReasonModal
      v-model="changeReasonModalVisible"
      @confirmed="updateEdcEditedForm"
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
  </div>
</template>

<script>

import ParticipantInfo from '@/components/participants/participant-info-new';
import EdcFormInfo from '@/components/form/edc-form-info';
import EdcFormHistoryList from '@/components/form/edc-form-history-list';
import EdcFormHistoryVersion from '@/components/form/edc-form-history-version';
import EdcFormQueries from '@/components/form/edc-form-queries';
import ButtonCmp from '@/components/common/button';
import FormPreview from '@/components/edc-form/form-preview';
import FormChangeReasonModal from '@/components/modals/form-change-reason-modal';
import SubmittedFormPreview from '@/components/edc-form/submitted-form-preview';
import EdcFormSourceDocuments from '@/components/form/edc-form-source-documents';
import NavigationBreadcrumb from "@/components/common/navigation-breadcrumb";
import { AclRule } from 'vue-acl';
import { mapActions, mapGetters } from 'vuex';
import find from 'lodash/find';
import difference from 'lodash/difference';
import each from 'lodash/each';
import findIndex from 'lodash/findIndex';
import uniq from 'lodash/uniq';
import pull from 'lodash/pull';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import PiiAndNonPiiInfo from "@/components/participants/pii-and-non-pii-info";

import { PI, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH, CRA, SITEDATALOCK } from '@/constants/authRoles';
import { formFieldQueryStatus } from '@/constants/form';
export default {
  name: 'study-participant-form',
  components: {
    ParticipantInfo,
    EdcFormHistoryList,
    EdcFormHistoryVersion,
    EdcFormQueries,
    FormPreview,
    ButtonCmp,
    SubmittedFormPreview,
    FormChangeReasonModal,
    EdcFormSourceDocuments,
    NavigationBreadcrumb,
    EdcFormInfo,
    PiiAndNonPiiInfo,
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
	  areActionsAllowed: {showDocument: false, telehealthCall: true, edcforms: false, canDisqualifyParticipant: true},
      formSubmitted: 1,
      tabIndex: 0,
      participantInfo: null,
      formHistory: [],
      isLoading: true,
      newQuery: null,
      formHistoryVersion: null,
      edit: false,
      filterFieldId: null,
      generalInfo: null,
      participant: null,
      sections: [],
      queries: [],
      comments: [],
      formId: this.$route.params.formId,
      formStudyId: this.$route.params.studyId,
      milestone: this.$route.params.milestone,
      participantId: this.$route.params.participantId,
      responseId: this.$route.params.responseId,
      formData: [],
      versionFormData: [],
      formResponses: {},
      answersObj: [],
      response: [],
      editedFields: [],
      diffResp: [],
      edcFormHistoryVersion: null,
      queryIds: [],
      changeReasonModalVisible: false,
      siteTeam: {},
      clickedFieldId: null,
      sourceDocumentsOpen: false,
      documentsList: [],
      siteTeamDetails: [],
      getDocuments: false,
      latestVersionData: {},
      navigationOptions: [
        {name: "Profile", isLink: true, route: 'participant-profile', params: {studyId: this.$route.params.studyId}, displayOrder: 2},
        {name: "Participants", isLink: true, route: 'study-participants-list', params: {studyId: this.$route.params.studyId}, displayOrder: 1},
        {name: "Form Packet Details", isLink: false, route: null, params: null, displayOrder: 3}
      ],
      navigationWidth: "55%",
      telehealthCallStatus: false,
    };
  },
  computed: {
    ...mapGetters(["user", "getVideoCallStatus"]),
    fId() {
      return this.$route.params.formId;
    },
    fieldsWithQueries() {
      if (this.queries) {
        return this.queries.filter(q => q.status === formFieldQueryStatus.OPEN).map(q => q.fieldId);
      }
      return [];
    },
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
    },
  },
  watch: {
    getVideoCallStatus(isCallInProgress) {
      this.telehealthCallStatus = isCallInProgress;
    },
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
        this.$api.updateEdcFormResponseVersionsResource(this.formResponses.responseId,
          this.latestVersionData.responseVersionId, this.studyId, updateData)
          .then(() => {
            /* this.generalInfo.verificationStatus = status;
            this.getListOfQueries();
            // get the form history versions
            this.getEDCFormHistoryList(); */
            this.getEDCFormDetails();
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
        this.$api.updateEdcFormResponseVersionsResource(this.formResponses.responseId,
          this.latestVersionData.responseVersionId, this.studyId, updateData)
          .then(() => {
            /* this.generalInfo.approvalStatus = status;
            this.getListOfQueries();
            // get the form history versions
            this.getEDCFormHistoryList(); */
            this.getEDCFormDetails();
            this.$toastr.success(`${status === 'APPROVED' ? 'Approval confirmed' : 'Unapproval confirmed'}`);
          })
          .catch(error => {
            const { message = 'Error while saving approval status' } = (error && error.body) || {};
            this.$toastr.error(message);
          });
      }
    },
    cancelEdit() {
      this.edit = false;
      this.getEDCFormDetails();
    },
    openQuery(fieldId) {
      this.newQuery = fieldId;
      this.clickedFieldId = fieldId;
    },
    createQuery(query) {
      const reqObj = {
        responseId: this.formResponses.responseId,
        fieldId: query.fieldId,
        responseType: 'SCHEDULED',
        comment: {
          cText: query.comment,
        },
      };
      this.$api
        .openNewQuery(reqObj, this.formStudyId)
        .then(() => {
          this.$toastr.success('Query created');
          this.getListOfQueries();
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
    updateComment(queryId, fieldId) {
      this.clickedFieldId = fieldId;
      this.$api
        .getAllQueryComments(queryId, this.formStudyId)
        .then(response => {
          this.comments = response.body.comments;
        });
    },

    // API to fetch the saved form in history
    viewHistoryForm(versionForm) {
      //Prepare a reason for change string to display on the view history form.
      let createdDate = this.$options.filters.formatGMTDate(new Date(versionForm.createdAt));
      let reasonForChange = versionForm.primaryReason ? versionForm.primaryReason : 'N/A';
      reasonForChange += ' '+ createdDate + ' by ' + versionForm.createdBy;
      this.$api
        .getedcFormResponseVersionsResource(versionForm.responseId, versionForm.responseVerionId,
          this.formStudyId)
        .then(result => {
          this.formResponses = result.body.response;
          this.versionFormData = result.body.form;
          this.editedFields = result.body.editedFields;
          const formQuestions = this.versionFormData.fields;
          const answersList = this.formResponses.answers;
          // questions and answers object for display
          const answersObj = [];
          each(formQuestions, question => {
            const newObj = {};
            newObj.question = question.body;
            newObj.name = question.name;
            newObj.id = question.id;
            if (question.name !== 'formHeader' && question.name !== 'formParagraph') {
              newObj.sequence = question.sequence;
            }
            const resObj = find(answersList, answer => answer.questionId === question.id);
            if (resObj) {
              if (resObj.questionName === 'formCheckbox' || resObj.questionName === 'formTable') {
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
                newObj.previousAnswerText = resObj.previousAnswerText;
                if(resObj.previousComment && resObj.previousComment !== 'this is not valid'){
                  newObj.previousAnswerText = `${resObj.previousAnswerText} - ${resObj.previousComment}`;
                }
                if (resObj.comment && resObj.comment !== 'this is not valid') {
                  newObj.answerText = `${resObj.answerText} - ${resObj.comment}`;
                }
              }
            } else {
              newObj.answerText = '';
            }
            newObj.isEditedVersion = (this.editedFields
              && this.editedFields.includes(question.id));
            answersObj.push(newObj);
          });
          this.edcFormHistoryVersion = {
            fields: answersObj,
            primaryReason: reasonForChange,
            name: this.versionFormData.name,
            isUnSchedule: false,
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
      this.clickedFieldId = id;
      this.newQuery = null;
    },
    resetFilter() {
      this.newQuery = null;
      this.clickedFieldId = null;
    },
    onQueryClosed(query) {
      this.$api
        .updateQueryStatus(query.queryId, this.formStudyId, 'CLOSE')
        .then(() => {
          this.$toastr.success('Query closed');
          this.getListOfQueries();
          this.clickedFieldId = null;
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
          this.clickedFieldId = null;
        })
        .catch(error => {
          const { message = 'Error while reopening query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },

    // get list of all the queries asociated to the form
    getListOfQueries() {
      this.$api.getAllListOfQueries(this.formResponses.responseId, this.formStudyId)
        .then(response => {
          this.queryIds = map(response.body.filter(resp => resp.status === 'OPEN'), 'fieldId');
          this.queries = response.body;
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
      try{
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
        await this.getEDCFormDetails();
      }catch(err) {

        // catches errors both in fetch and response.json
        this.$toastr.error(err.bodyText);
      }
    },

    // get the participant details
    async getParticipantDetails() {
      await this.$api.getParticipantDataFactV2(this.formStudyId, this.participantId).then(
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
      this.$api.getEdcQueryFormVersionsHistoryStatus(this.formId, this.formResponses.responseId, this.studyId, 'SCHEDULED')
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

    // get the edc form data
    async getEDCFormDetails() {
      await this.$api
        .getEDCFormResponseByResponseIdFact(this.formId, this.formStudyId, this.participantId,
          this.responseId, this.milestone)
        .then(result => {
          this.milestone = result.body.milestone;
          this.formResponses = result.body.response;
          this.latestVersionData = result.body.response;
          this.formData = result.body.form;
          const formQuestions = this.formData.fields;
          const answersList = this.formResponses.answers;
          // get the form history versions
          this.getEDCFormHistoryList();
          // get list of queries mapped to this form
          this.getListOfQueries();
          this.getSourceDocuments();
          // questions and answers object for display
          const answersObj = [];
          each(formQuestions, question => {
            const newObj = {};
            newObj.question = question.body;
            newObj.name = question.name;
            newObj.id = question.id;
            if (question.name !== 'formHeader' && question.name !== 'formParagraph') {
              newObj.sequence = question.sequence;
            }
            const resObj = find(answersList, answer => answer.questionId === question.id);
            if (resObj) {
              if (resObj.questionName === 'formCheckbox' || resObj.questionName === 'formTable') {
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
            answersObj.push(newObj);
          });
          this.answersObj = answersObj;
          this.generalInfo = {
            formId: this.formData.id,
            formName: this.formData.name,
            approvalStatus: result.body.approvalStatus,
            verificationStatus: result.body.verificationStatus,
            numberOfOpenQueries: null,
            numberOfClosedQueries: null,
            verifiedOn: 0,
            approvedOn: 0,
            submittedOn: null,
            comments: null,
          };
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
              // for checkBox the options array which is saved need's to be modified as per preview
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
          this.isLoading = false;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting details."
          );
        });
    },

    // save the edc form edited data
    updateEdcEditedForm(changeReason) {
      const currentEdcFormErrors = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
      if (
        find(currentEdcFormErrors, ['comment', true])
        || find(currentEdcFormErrors, ['time', true])
        || find(currentEdcFormErrors, ['date', true])
      ) {
        this.formSubmitted = this.formSubmitted + 1;
        this.$toastr.error('Please populate required fields.');
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
        if (difference(requiredFieldIds, answersIds).length) {
          this.formSubmitted = this.formSubmitted + 1;
          this.$toastr.error(
            `Please fill all the required fields in the form ${this.formData.name}.`,
          );
        } else {
          this.diffResp = [];
          this.formData.fields.forEach(field => {
            // get the old and new answers given by user
            const oldAnsField = find(this.formResponses.answers, ['questionId', field.id]);
            const newAnsField = find(this.response, ['questionId', field.id]);
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
                if (oldAnsField.date !== newAnsField.date
                  || oldAnsField.time !== newAnsField.time
                  || oldAnsField.timezone !== newAnsField.timezone) {
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
                  const existingCommentsAns = oldAnsField
                    .multiAnswer.map(multiAns => multiAns.comment);
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
          if (this.diffResp.length <= 0) {
            this.$toastr.error('No new changes were made in the form.');
          } else {
            const updateData = {
              form: this.formData,
              milestone: this.milestone,
              participantId: this.participantId,
              response: {
                state: 'SUBMITTED',
                answers: this.response,
              },
              editedFields: this.diffResp,
              primaryReason: changeReason,
            };
            if (this.formResponses) {
              updateData.response.responseId = this.formResponses.responseId;
              updateData.response.responseVersion = this.formResponses.responseVersion;
              updateData.response.responseVersionId = this.formResponses.responseVersionId;
            }
            this.$api
              .updateEDCFormResponseFact(
                this.formId,
                this.studyId,
                this.participantId,
                this.formResponses.responseId,
                updateData,
              )
              .then(response => {
                if (response.body.response.responseId) {
                  // clear all the available errorflags from Vue store
                  this.clearEDCFormErrors();
                  this.edit = false;
                  this.getEDCFormDetails();
                  // get the form history versions
                  this.getEDCFormHistoryList();
                }
              }).catch(error => {
                const { message = 'Error while updating the form' } = (error && error.body) || {};
                this.$toastr.error(message);
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
              weight: answerSelected.weight,
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

    goToPreviousScreen() {
      const studyID = this.studyId;
      this.$router.push({
        name: 'study-participant-details',
        params: { studyID, participantId: this.participantId },
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
      this.$api.getSourceDocumentsFact(this.studyId, this.participantId, this.formResponses.responseId, this.participantInfo.siteId)
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
    },
    toggleParticipant(participant) {
      let params = {
          studyId: this.studyId,
          formId: this.formId,
          milestone: this.milestone,
          responseId: this.responseId || '0'
        };
      this.$router.push({name: 'submitted-form-new', params: params});
      this.participantId = participant.id;
      this.getSiteTeam();
    }
  },
  mounted() {
    this.getSiteTeam();
  },
};
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style lang="scss">
	@import '~@/assets/variables.scss';
	.primaryBgColor {
		background-color: #1e8fe1;
		border-color: #1e8fe1;
	}
	.primaryBgColor {
		background-color: #1e8fe1;
	}

	.width-500 {
		width: 500px !important;
	}
	.component {
		font-family: Roboto-Regular;
		background-color: #fff;
		font-size: 14px;
    min-height: 900px;
		.nav-breadcrumb {
			display: block;
			padding: 10px 4px;
		}
	}
	.pi-info-bars {
		background: #fff;
	}
	.clear-float {
		clear: both;
	}
	.study-particip-form-block {
		.nav-tabs {
			border-bottom-color: #d3dfe4;
			.nav-item {
				margin: 0 17px;
			}

			.nav-link {
				line-height: 1.43;
				color: #2d3752;
				padding: 0.9rem 0 0.45rem !important;
				border: none;
				border-bottom: 5px solid transparent;

				&:focus, &:hover {
					border: none;
					border-bottom: 5px solid transparent;
				}

				&:hover {
					border-bottom: 5px solid #4c8ce4;
				}

				&.active {
					font-weight: bold;
					border-bottom: 5px solid #4c8ce4;
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
  .telehealth-call {
  .study-particip-form-block .nav-tabs .nav-link {
    font-size: 12px;
  }
}
</style>
