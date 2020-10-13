import * as types from "./mutation-types";

export default {
  // is required
  [types.CLIENT_ID_SUCCESS](state, clientId) {
    state.clientId = clientId;
  },
  [types.CLIENTNAME](state, clientName) {
    state.clientName = clientName;
  },
  // need check if this mutations are necessary
  [types.ADD_STUDY](state, obj) {
    state.newStudy = obj.body;
    // window.localStorage.setItem('new_study', JSON.stringify(obj.body));
  },
  [types.ADD_QUESTION](state, obj) {
    state.newQuestion = obj;
  },
  [types.UPDATE_PROFILE](state, obj) {
    state.updatedProfileData = obj;
  },
  [types.SELECTED_QUESTION](state, obj) {
    state.selectedQuestion = obj;
  },
  [types.FORGOT_PASSWORD_ERROR](state, obj) {
    state.forgotPassword = { name: obj.username };
  },
  [types.FORGOT_PASSWORD_SUCCESS](state, obj) {
    state.forgotPassword = { name: obj.username };
  },
  [types.SEND_OTP_SUCCESS](state, obj) {
    state.sendOtp = { name: obj.token };
  },
  [types.SEND_OTP_ERROR](state, obj) {
    state.sendOtp = { name: obj.token };
  },
  [types.CONFIRM_OTP_SUCCESS](state, obj) {
    state.sendOtp = { token: obj.token, otp: obj.otp };
  },
  [types.CONFIRM_OTP_ERROR](state, obj) {
    state.sendOtp = { token: obj.token, otp: obj.otp };
  },
  [types.SURVEY_DETAILS](state, obj) {
    state.surveyDetails = obj;
  },
  [types.SELECTED_FEATURES](state, obj) {
    state.selectedFeatures = obj;
  },
  [types.ADD_CONSENT_SECTION](state, obj) {
    state.addedConsentSection = obj;
  },
  [types.ADD_CONSENT_QUIZ](state, obj) {
    state.addedConsentQuiz = obj;
  },
  [types.ADD_SCHEDULE](state, obj) {
    state.schedulerObj = obj;
  },
  [types.SURVEY_QUESTIONS](state, obj) {
    state.surveyQuestions = obj;
  },
  [types.SIGNATURE_STATUS](state, obj) {
    state.signatureStatus = obj;
  },
  [types.SAVE_SIGNATURE](state, obj) {
    state.signatureData = obj;
  },
  [types.CANCLE_COHORT_EDITING](state, obj) {
    state.cancelAssociationEditing = obj;
  },
  [types.TELEHEALTH_VISIT](state, obj) {
    state.telehealthVisitObj = obj;
  },
  [types.VIDEO_CALL_STATUS](state, value) {
    state.videoCallStatusValue = value;
  },
  [types.TELEHEALTH_APPOINTMENT_DURATION](state, value) {
    state.telehealthAppointmentDuration = value;
  },
  [types.STATIC_URL](state, value) {
    state.staticUrl = value;
  },
  [types.IS_PUBLISH_DISABLED](state, value) {
    state.isPublishDisabled = value;
  },
  [types.IS_PREVIEW_DISABLED](state, value) {
    state.isPreviewDisabled = value;
  },
  [types.SET_PUBLISH_TAB](state, value) {
    state.isPublishTab = value;
  }
};
