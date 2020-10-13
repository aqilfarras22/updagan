import Vue from "vue";
import localStorageService from "@/services/localStorage";
import * as types from "./mutation-types";

export const clientIdSuccess = ({ commit }, clientId) => {
  commit(types.CLIENT_ID_SUCCESS, clientId);
  if (Vue.http) {
    Vue.http.headers.common.clientId = `${clientId}`;
  }
  localStorageService.setItem("clientId", clientId);
};

export const clientName = ({ commit }, name) => {
  commit(types.CLIENTNAME, name);
  localStorageService.setItem("clientName", name);
};

// need check if this actions are necessary
export const forgotPasswordSuccessAction = ({ commit }, obj) => {
  commit(types.FORGOT_PASSWORD_SUCCESS, obj);
};
export const forgotPasswordErrorAction = ({ commit }, obj) => {
  commit(types.FORGOT_PASSWORD_ERROR, obj);
};
export const sendOtpSuccessAction = ({ commit }, obj) => {
  commit(types.SEND_OTP_SUCCESS, obj);
};
export const sendOtpErrorAction = ({ commit }, obj) => {
  commit(types.SEND_OTP_ERROR, obj);
};
export const confirmOtpSuccessAction = ({ commit }, obj) => {
  commit(types.CONFIRM_OTP_ERROR, obj);
};
export const confirmOtpErrorAction = ({ commit }, obj) => {
  commit(types.CONFIRM_OTP_SUCCESS, obj);
};
export const addStudyAction = ({ commit }, obj) => {
  commit(types.ADD_STUDY, obj);
};
export const addQuestionAction = ({ commit }, obj) => {
  commit(types.ADD_QUESTION, obj);
};
export const selectedQuestionAction = ({ commit }, obj) => {
  commit(types.SELECTED_QUESTION, obj);
};
export const setSurveyDetailsAction = ({ commit }, obj) => {
  commit(types.SURVEY_DETAILS, obj);
};
export const selectedFeaturesAction = ({ commit }, obj) => {
  commit(types.SELECTED_FEATURES, obj);
};
export const addConsentSectionAction = ({ commit }, obj) => {
  commit(types.ADD_CONSENT_SECTION, obj);
};
export const addConsentQuizAction = ({ commit }, obj) => {
  commit(types.ADD_CONSENT_QUIZ, obj);
};
export const updateProfileDataAction = ({ commit }, obj) => {
  commit(types.UPDATE_PROFILE, obj);
};
export const addSchedule = ({ commit }, obj) => {
  commit(types.ADD_SCHEDULE, obj);
};
export const surveyQuestionsAction = ({ commit }, obj) => {
  commit(types.SURVEY_QUESTIONS, obj);
};
export const setSignatureStatusAction = ({ commit }, obj) => {
  commit(types.SIGNATURE_STATUS, obj);
};
export const setSignatureAction = ({ commit }, obj) => {
  commit(types.SAVE_SIGNATURE, obj);
};
export const telehealthVisitAction = ({ commit }, obj) => {
  commit(types.TELEHEALTH_VISIT, obj);
};
export const setVideoCallStatusAction = ({ commit }, value) => {
  commit(types.VIDEO_CALL_STATUS, value);
};
export const setTelehealthAppointmentDuration = ({ commit }, value) => {
  commit(types.TELEHEALTH_APPOINTMENT_DURATION, value);
};

export const setStaticURL = ({ commit }, value) => {
  commit(types.STATIC_URL, value);
};

export const setIsPublishDisabled = ({ commit }, value) => {
  commit(types.IS_PUBLISH_DISABLED, value);
};

export const setIsPreviewDisabled = ({ commit }, value) => {
  commit(types.IS_PREVIEW_DISABLED, value);
};

 
export const setPublishTab = ({ commit }, value) => {
  commit(types.SET_PUBLISH_TAB, value);
};