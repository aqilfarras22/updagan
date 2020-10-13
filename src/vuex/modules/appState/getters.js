export const appStateClientId = state => state.clientId;

// need check if this getters are necessary
export const getLoggedinUser = state => state.loggedinUser;
export const getStudy = state => state.newStudy;
export const getNewQuestion = state => state.newQuestion;
export const getSelectedQuestion = state => state.selectedQuestion;
export const getSurveyDetails = state => state.surveyDetails;
export const getSelectedFeatures = state => state.selectedFeatures;
export const getAddedConsentSection = state => state.addedConsentSection;
export const getAddedConsentQuiz = state => state.addedConsentQuiz;
export const getUpdatedProfileData = state => state.updatedProfileData;
export const getSchedulerObjData = state => state.schedulerObj;
export const getSurveyQuestionsData = state => state.surveyQuestions;
export const getSignatureStatus = state => state.signatureStatus;
export const getSignatureData = state => state.signatureData;
export const getCancelAssociationEditing = state => state.cancelAssociationEditing;
export const getTelehealthVisitObjData = state => state.telehealthVisitObj;
export const getVideoCallStatus = state => state.videoCallStatusValue;
export const getTelehealthAppointmentDuration = state => state.telehealthAppointmentDuration;

export const getStaticUrl = state => state.staticUrl;
export const getIsPublishDisable = state => state.isPublishDisabled;
export const getIsPreviewDisable = state => state.isPreviewDisabled;
export const getPublishTab = state => state.isPublishTab;
