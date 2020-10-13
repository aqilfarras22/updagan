import Vue from 'vue';
import {
  API_ROOT,
  surveyManagement,
  studies,
  surveys,
  questions,
  getpresignedurl,
  template,
  epros,
  statusKey,
  search,
  license,
  studyepro,
  templates,
  image,
  arrange,
  studyDetails,
  prepopulation,
  telehealth,
  visits,
  exportSurveyFile,
  importSurveyFile,
  siteteamemailflag,
  templateImage,
  uploadTemplate,
  API_ROOT_V2
} from './urls';
// const API_ROOT = `http://localhost:9000/api/v1/`;
// const API_ROOT_V2 = `http://localhost:9000/api/v2/`;

const surveyResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}`,
  {},
  { update: { method: 'PUT' } },
);
const surveyArrangeResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);
const questionsResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${questions}{/questionId}`,
  {},
  { update: { method: 'PUT' } },
);
const preSignedUrlResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${studies}{/studyId}/${surveys}{/surveyId}/${getpresignedurl}`,
  {},
  { update: { method: 'PUT' } },
);
const imageUploadResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${image}`,
  {},
  { update: { method: 'PUT' } },
);
const templateImageUploadResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${templateImage}`,
  {},
  { update: { method: 'PUT' } },
);
const templateImageUpload = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${uploadTemplate}`,
  {},
  { update: { method: 'PUT' } },
);
const imageQuestionResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${image}`,
  {},
  { update: { method: 'PUT' } },
);
const saveAsTemplateResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${template}`,
  {},
  { update: { method: 'PUT' } },
);

//-------------------------------------------------------------
const eprosResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${epros}{/eproId}`,
  {},
  { update: { method: 'PUT' } },
);
const eproCreate = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}`,
  {},
  { update: { method: 'PUT' } },
);
const eprosV2Resource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/eproId}`,
  {},
  { update: { method: 'PUT' } },
);
const getEproV2Resource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/eproId}`,
  {},
  { update: { method: 'PUT' } },
);
const questionsV2Resource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/surveyId}/${questions}{/questionId}`,
  {},
  { update: { method: 'PUT' } },
);
const questionsV2ScreenOrder = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/surveyId}/${questions}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);
const eproTemplateImageUploadResource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/surveyId}/${uploadTemplate}`,
  {},
  { update: { method: 'PUT' } },
);
const imageEproUploadResource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/surveyId}/${image}`,
  {},
  { update: { method: 'PUT' } },
);
const imageEproQuestionResource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}{/surveyId}/${image}`,
  {},
  { update: { method: 'PUT' } },
);
const isEproActivatedResource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}/${statusKey}`,
);
const eproValidateResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${epros}{/eproId}/${license}`,
  {},
  { update: { method: 'PUT' } },
);
const addEproToStudyResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${epros}{/eproId}/${studyepro}`,
  {},
  { update: { method: 'PUT' } },
);
const surveyTemplatesResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${templates}{/surveyId}`,
  {},
  { update: { method: 'PUT' } },
);
const surveysFilterResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}/${search}`,
  {},
  { update: { method: 'PUT' } },
);
const eprosFilterResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${epros}/${search}`,
  {},
  { update: { method: 'PUT' } },
);
const eprosFilterV2Resource = Vue.resource(
  `${API_ROOT_V2}${surveyManagement}${epros}/${search}`,
  {},
  { update: { method: 'PUT' } },
);
const instructionScreenOrder = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${questions}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);
const questionsScreenOrder = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${questions}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);

const studySurveyDetailsResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}/${studyDetails}`,
  {},
);
const studyePROsDetailsResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${epros}/${studyDetails}`,
  {},
);
const surveyPrepopulation = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${prepopulation}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const postTeleHealthVisit = Vue.resource(
  `${API_ROOT}${telehealth}/${visits}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const updateTeleHealthVisit = Vue.resource(
  `${API_ROOT}${telehealth}/${visits}{/visitId}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const deleteTeleHealthVisit = Vue.resource(
  `${API_ROOT}${telehealth}/${visits}{/visitId}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const fetchTelehealthVisitDetail = Vue.resource(
  `${API_ROOT}${telehealth}/${visits}{/visitId}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const fetchSurveyJsonFile = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${exportSurveyFile}`
);

const uploadSurveyJsonFile = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}/${importSurveyFile}`
);

const saveRecipient = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${siteteamemailflag}`
);

const getRecipient = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${siteteamemailflag}`
);

export function configuredRecipient(surveyId, data) {
  return saveRecipient.save({ surveyId }, data);
}

export function getRecipientFlag(studyId, surveyId) {
  return getRecipient.get({ studyId, surveyId: surveyId });
}

export function updateTeleHealthVisitFact(studyId, visitId, data) {
  return updateTeleHealthVisit.update({studyId: studyId, visitId}, data);
}

export function getVisitDetail(studyId, visitId) {
  return fetchTelehealthVisitDetail.get({ studyId, visitId: visitId});
}

export function postNewSurveyInfoFact(studyId, data) {
  return surveyResource.save({ studyId }, data);
}

export function surveySearchFilterFact(searchQuery, sort, filter) {
  return surveysFilterResource.get({ search: searchQuery, sort, filter });
}

export function eprosSearchFilterFact(searchQuery, sort, filter) {
  return eprosFilterResource.get({ search: searchQuery, sort, filter });
}
//----------------------------------
export function eproCreateAPI(data) {
  return eproCreate.save(data);
}
export function getEproTemplateDetailsFact(surveyId) {
  return eproTemplatesResource.get({ surveyId });
}

export function eprosSearchFilterV2Fact(searchQuery, sort, filter) {
  return eprosFilterV2Resource.get({ search: searchQuery, sort, filter });
}

export function postNewEproInfoFact(epro) {
  return eproCreate.save(epro);
}

export function updateEproDetailsFact(eproId, epro) {
  return eprosV2Resource.update({ eproId }, epro);
}

export function deleteEproDetailsFact(eproId) {
  return eprosV2Resource.delete({ eproId });
}

export function getSurveyDetailsFact(studyId, surveyId, surveyType) {
  if (surveyType == "EPRO")
    return getEproDetailsFactV2(surveyId);
  return surveyResource.get({ studyId, surveyId });
}

export function getSurveyTemplateDetailsFact(surveyId) {
  return surveyTemplatesResource.get({ surveyId });
}

export function updateSurveyDetailsFact(studyId, surveyId, surveyObj) {
  return surveyResource.update({ studyId, surveyId }, surveyObj);
}

export function deleteSurveyDetailsFact(studyId, surveyId) {
  return surveyResource.delete({ studyId, surveyId });
}

export function getAllSurveysFact(studyId) {
  return surveyResource.get({ studyId });
}

export function addQuestionFact(studyId, surveyId, data, surveyType) {
  if (surveyType == "EPRO")
    return questionsV2Resource.save({ surveyId }, data);
  return questionsResource.save({ studyId, surveyId }, data);
}

export function imageUploadFact(studyId, surveyId, surveyType, data, isInstructionTemplate) {  
  if (surveyType == "EPRO") {
    if(isInstructionTemplate) {
      return eproTemplateImageUploadResource.save({ surveyId }, data);
    }
    return imageEproUploadResource.save({ surveyId }, data);  
  }
  if(isInstructionTemplate) {
    return templateImageUploadResource.save({ studyId, surveyId }, data);
  }
  return imageUploadResource.save({ studyId, surveyId }, data);
}

export function uploadTemplateImageIcon(studyId, surveyId, data, surveyType) {
  debugger;
  if (surveyType == "EPRO")
    return eproTemplateImageUploadResource.save({ surveyId }, data);
  return templateImageUpload.save({ studyId, surveyId }, data);
}

export function deleteOptionFact(studyId, surveyId, data, surveyType) {
  if (surveyType == "EPRO")
    return imageEproUploadResource.delete({ surveyId }, data);
  return imageUploadResource.delete({ studyId, surveyId }, data);
}

export function imageQuestionFact(studyId, surveyId, data, surveyType) {
  if (surveyType == "EPRO")
    return imageEproQuestionResource.save({ surveyId }, data);
  return imageQuestionResource.save({ studyId, surveyId }, data);
}

export function updateQuestionFact(studyId, surveyId, questionId, question, surveyType) {
  if (surveyType == "EPRO")
    return questionsV2Resource.update({ surveyId, questionId }, question);
  return questionsResource.update({ studyId, surveyId, questionId }, question);
}

export function deleteQuestionFact(studyId, surveyId, questionId, surveyType) {
  if (surveyType == "EPRO")
    return questionsV2Resource.delete({ surveyId, questionId }); 
  return questionsResource.delete({ studyId, surveyId, questionId });
}

export function getPresignedUrlFact(studyId, surveyId, fileNameObj) {
  return preSignedUrlResource.save({ studyId, surveyId }, fileNameObj);
}

export function saveAsTemplateFact(studyId, surveyId, obj) {
  return saveAsTemplateResource.update({ studyId, surveyId }, obj);
}

export function getAllEprosFact() {
  return eprosResource.get();
}

export function getAllEprosV2Fact() {
  return eprosV2Resource.get();
}

export function getEproDetailsFactV2(eproId) {
  return getEproV2Resource.get({ eproId });
}

export function getEproDetailsFact(eproId) {
  return eprosResource.get({ eproId });
}

export function validateEproFact(eproId, obj) {
  return eproValidateResource.save({ eproId }, obj);
}

export function addEproToStudyFact(studyId, eproId) {
  return addEproToStudyResource.update({ studyId, eproId }, {});
}

export function scheduleEproFact(eproId, scheduleObj) {
  return eprosResource.save({ eproId }, scheduleObj);
}

export function getSurveyTemplatesFact() {
  return surveyTemplatesResource.get();
}

export function updateInstructionScreenOrderFact(studyId, surveyId, data) {
  return instructionScreenOrder.update({ studyId, surveyId }, data);
}

export function updateSurveyQuestionOrderFact(studyId, surveyId, data, surveyType) {
  if (surveyType == "EPRO")
    return questionsV2ScreenOrder.update({ surveyId }, data);
  return questionsScreenOrder.update({ studyId, surveyId }, data);
}

export function getStudyeprosDetailsFact(studyId) {
  return studyePROsDetailsResource.get({ studyId });
}

export function getStudySurveyDetailsFact(studyId) {
  return studySurveyDetailsResource.get({ studyId });
}

export function updateAllSurveysOrderFact(studyId, data) {
  return surveyArrangeResource.update({ studyId }, data);
}

export function updateSurveyPrepopulationFact(surveyId, studyId, data) {
  return surveyPrepopulation.update({surveyId, studyId}, data);
}

export function postTeleHealthVisitFact(studyId, telehealthVisitDTOWrapper) {
  return postTeleHealthVisit.save({
    studyId
  }, telehealthVisitDTOWrapper);
}

export function getTeleHealthVisitFact(studyId, telehealthVisitDTOWrapper) {
  return postTeleHealthVisit.get({
    studyId
  }, telehealthVisitDTOWrapper);
}

export function deleteTeleHealthVisitFact(studyId, visitId) {
  return deleteTeleHealthVisit.delete({
    studyId,
    visitId
  });
}

export function getSurveyJsonFile(surveyId, studyId) {
  return fetchSurveyJsonFile.get({ surveyId, studyId });
}

export function postSurveyJsonFile(studyId, fileData) {
  return uploadSurveyJsonFile.save({
    studyId
  }, fileData);
}

export function isEproActivated() {
  return isEproActivatedResource.get();
}
