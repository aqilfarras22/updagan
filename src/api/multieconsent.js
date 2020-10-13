/* eslint-disable no-unused-vars */
// eslint-disable
import Vue from 'vue';
import { realpathSync } from 'fs';
import {
  API_ROOT,
  API_ROOT_V2,
  studyManagement,
  studies,
  consentsections,
  defaultsections,
  consent,
  consents,
  multieconsent,
  consentdocument,
  consentprivacy,
  consentlicense,
  consentquiz,
  arrange,
  add,
  cohorts,
  cohort,
  associate,
  associates,
  details,
  study,
  multifeaturesstate,
  launch,
  disclaimer,
  disclaimerUpdate
} from './urls';


const consentResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consent}{/sectionId}`,
  {},
  { update: { method: 'PUT' } },
);
const defaultConsentResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${defaultsections}`,
  {},
  { update: { method: 'PUT' } },
);
const consentSectionResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentsections}{/sectionId}`,
  {},
  { update: { method: 'PUT' } },
);

const consentSectionResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/{consentId}/${consentsections}{/sectionId}`,
  {},
  { update: { method: 'PUT' } },
);

const addConsentSectionResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consentsections}/${add}{/consentId}`,
  {},
  { update: { method: 'POST' } },
);

const sectionArrangeResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}{/consentId}/${consentsections}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);
const updateConsentNameV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consents}/{consentId}`,
  {},
  { update: { method: 'PUT' } },
);

const addConsentNameV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/${add}`,
  {},
  { update: { method: 'POST' } },
);
const quizResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}{/consentId}/${consentquiz}{/questionId}`,
  {},
  { update: { method: 'PUT' } },
);
const documentSectionResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/{consentId}/${consentdocument}`,
  {},
  { update: { method: 'PUT' } },
);

const documentSectionResourceDeleteV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/{consentId}/${consentdocument}/{languageId}`,
  {},
  { update: { method: 'PUT' } },
);

const addPrivacyResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consentprivacy}`,
  {},
  { update: { method: 'POST' } },
);

const updatePrivacyResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consentprivacy}`,
  {},
  { update: { method: 'POST' } },
);

const deletePrivacyResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consentprivacy}`,
  {},
  { update: { method: 'DELETE' } },
);
const licenseResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentlicense}`,
  {},
  { update: { method: 'PUT' } },
);
const quizResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentquiz}{/questionId}`,
  {},
  { update: { method: 'PUT' } },
);
const sectionArrangeResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentsections}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);
const quizArrangeResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentquiz}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);

const quizArrangeResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/{consentId}/${consentquiz}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);

const existingConsents = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consents}`,
  {},
  { update: { method: 'GET' } },
);
const deleteConsent = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consents}{/consentId}`,
  {},
  { update: { method: 'DELETE' } },
);
const addConsent = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/${add}`,
  {},
  { update: { method: 'POST' } },
);

const existingCohorts = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${associates}`,
  {},
  { update: { method: 'GET' } },
);

const addCohort = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}/${add}`,
  {},
  { update: { method: 'POST' } },
);
const deleteCohort = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}`,
  {},
  { update: { method: 'DELETE' } },
);

const editCohort = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}`,
  {},
  { update: { method: 'PUT' } },
);

const addConsenttoCohort = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}/${consent}{/consentId}/${associate}`,
  {},
  { update: { method: '{POST}' } },
);

const removeConsenttoCohort = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}/${consent}{/consentId}/${associate}`,
  {},
  { update: { method: 'DELETE' } },
);

const getAssociatedConsent = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}/${associates}`,
  {},
  { update: { method: 'GET' } },
);

const updateCohortConsenrOrderResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}/${consents}/${arrange}`,
  {},
  { update: { method: 'PUT' } },
);
const getStudyPrivacyPolicy = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consentprivacy}`,
  {},
  { update: { method: 'GET' } },
);

const licenseResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consentlicense}`,
  {},
  { update: { method: 'PUT' } },
);
const getConsent = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consents}/{consentId}`,
  {},
  { update: { method: 'GET' } },
);

const getConsentDetailsV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consents}/{consentId}/${details}`,
  {},
  { update: { method: 'GET' } },
);

const addMultipleConsenttoCohort = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}/${associates}`,
  {},
  { update: { method: '{POST}' } },
);
const postStudyMultiConsentResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${multifeaturesstate}`,
  {},
  { update: { method: 'PUT' } },
);

const documentSectionResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentdocument}`,
  {},
  { update: { method: 'PUT' } },
);

const getLaunchPage = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${launch}`,
  {},
  { update: { method: 'GET' } },
);

const getCohortConsent = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${cohort}{/cohortId}/${consent}{/consentId}`,
  {},
  { update: { method: 'GET' } },
);

const disclaimerResource = Vue.resource(`${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}{/consentId}/${disclaimer}`);

const disclaimerAddResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/{consentId}/${disclaimer}/${add}`,
  {},
  { update: { method: 'PUT' } },
);

const disclaimerUpdateResource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${consent}/{consentId}/${disclaimerUpdate}`,
  {},
  { update: { method: 'PUT' } },
);

export function getConsentSectionsFact(studyId) {
  return consentResource.get({ studyId });
}
export function updateConsentQuizOrderFactV2(studyId, consentId, data) {
  return quizArrangeResourceV2.update({ studyId, consentId }, data);
}

export function updateConsentSectionsOrderFact(studyId, data) {
  return sectionArrangeResource.update({ studyId }, data);
}

export function updateConsentQuizOrderFact(studyId, data) {
  return quizArrangeResource.update({ studyId }, data);
}

export function getDefaultConsentSectionsFact() {
  return defaultConsentResource.get();
}

export function getExistingConsentData(studyId) {
  return existingConsents.get({ studyId });
}

export function deleteConsentData(studyId, consentId) {
  return deleteConsent.delete({ studyId, consentId });
}

export function documentSectionFact(studyId) {
  return documentSectionResource.get({ studyId });
}

export function getExistingCohorts(studyId) {
  return existingCohorts.get({ studyId });
}

export function updateConsentSectionFact(studyId, sectionId, section) {
  return consentSectionResource.save({ studyId, sectionId }, section);
}

export function deleteConsentQuizFactV2(studyId, consentId, questionId) {
  return quizResourceV2.delete({ studyId, consentId, questionId });
}
export function addConsentSectionFact(studyId, section) {
  return consentSectionResource.save({ studyId }, section);
}

export function deleteConsentSectionFact(studyId, sectionId) {
  return consentSectionResource.delete({ studyId, sectionId });
}

export function deleteConsentQuizFact(studyId, questionId) {
  return quizResource.delete({ studyId, questionId });
}

export function dragedSections(studyId, sections) {
  return consentSectionResource.update({ studyId }, sections);
}

export function deleteConsentDocumentFactV2(studyId, consentId, languageId) {
  return documentSectionResourceDeleteV2.delete({ studyId, consentId, languageId});
}

export function saveConsentDocumentFact(studyId, section) {
  return documentSectionResource.save({ studyId }, section);
}

export function updateConsentDocumentFact(studyId, consentDocId, section) {
  return documentSectionResource.save({ studyId }, section);
}

export function deleteConsentDocumentFact(studyId) {
  return documentSectionResource.delete({ studyId });
}

export function addPrivacyFactV2(studyId, data) {
  return addPrivacyResource.save({ studyId }, data);
}

export function deletePrivacyFact(studyId, data) {
  return deletePrivacyResource.delete({ studyId }, data);
}

export function updatePrivacyFact(studyId, data) {
  return updatePrivacyResource.update({ studyId }, data);
}


export function addLicenseFact(studyId, data) {
  return licenseResource.save({ studyId }, data);
}

export function addConsentQuizFact(studyId, quizQuestion) {
  return quizResource.save({ studyId }, quizQuestion);
}

export function updateConsentQuizFact(studyId, quizQuestion) {
  return quizResource.update({ studyId, questionId: quizQuestion.identifier }, quizQuestion);
}

export function addNewConsent(studyId, consentName) {
  return addConsent.save({ studyId }, consentName);
}

export function addNewCohort(studyId, cohortName) {
  return addCohort.save({ studyId }, cohortName);
}
export function deleteCohortData(studyId, cohortId) {
  return deleteCohort.delete({ studyId, cohortId });
}
export function editCohortData(studyId, cohortId, cohortName) {
  return editCohort.update({ studyId, cohortId }, cohortName);
}

export function addAssociatedConsentData(studyId, cohortId, consentId) {
  return addConsenttoCohort.save({ studyId, cohortId, consentId }, null);
}

export function deleteAssociatedConsentData(studyId, cohortId, consentId) {
  return removeConsenttoCohort.delete({ studyId, cohortId, consentId });
}

export function getAssociatedConsentData(studyId, cohortId) {
  return getAssociatedConsent.get({ studyId, cohortId });
}


export function updateCohortConsenrOrderfact(studyId, cohortId, data) {
  return updateCohortConsenrOrderResource.update({ studyId, cohortId }, data);
}

export function getStudyPrivacyPolicyFact(studyId) {
  return getStudyPrivacyPolicy.get({ studyId });
}

export function addLicenseV2Fact(studyId, data) {
  return licenseResourceV2.save({ studyId }, data);
}

export function updateConsentSectionsOrderFactV2(studyId, consentId, data) {
  return sectionArrangeResourceV2.update({ studyId, consentId }, data);
}

export function addConsentSectionFactV2(studyId, section, consentId) {
  return addConsentSectionResourceV2.save({ studyId, consentId }, section);
}

export function deleteConsentSectionFactV2(studyId, sectionId, consentId) {
  return consentSectionResourceV2.delete({ studyId, sectionId, consentId });
}

export function saveConsentDocumentFactV2(studyId, section, consentId) {
  return documentSectionResourceV2.save({ studyId, consentId }, section);
}

export function updateConsentDocumentFactV2(studyId, consentDocId, section, consentId) {
  return documentSectionResourceV2.save({ studyId, consentId }, section);
}

export function addConsentQuizFactV2(studyId, quizQuestion, consentId) {
  return quizResourceV2.save({ studyId, consentId }, quizQuestion);
}

export function updateConsentQuizFactV2(studyId, quizQuestion, consentId) {
  return quizResourceV2.update({ studyId,
    questionId: quizQuestion.identifier,
    consentId }, quizQuestion);
}

export function updateConsentName(studyId, consentId, name) {
  return updateConsentNameV2.update({ studyId, consentId }, name);
}

export function addConsentName(studyId, name) {
  return addConsentNameV2.save({ studyId }, name);
}

export function getCosentDataApi(studyId, consentId) {
  return getConsent.get({ studyId, consentId });
}

export function getConsentDetailsByConsentId(studyId, consentId) {
  return getConsentDetailsV2.get({ studyId, consentId });
}

export function updateConsentSectionFactV2(studyId, sectionId, section, consentId) {
  return consentSectionResourceV2.save({ studyId, sectionId, consentId }, section);
}

// eslint-disable-next-line no-shadow
export function addMultipleConsenttoCohortFact(studyId, cohortId, consents) {
  return addMultipleConsenttoCohort.save({ studyId, cohortId }, consents);
}

export function postStudyMultiConsentFact(studyId) {
  return postStudyMultiConsentResource.update({ studyId }, null);
}

export function getLaunchPageFact(studyId) {
  return getLaunchPage.get({ studyId });
}

export function getConsentCohort(studyId, cohortId, consentId) {
  return getCohortConsent.get({ studyId, cohortId, consentId });
}

export function getConsentDisclaimers(studyId, consentId) {
  return disclaimerResource.get({ studyId, consentId });
}

export function addDisclaimers(studyId, consentId, disclaimers) {
  return disclaimerAddResource.save({ studyId, consentId }, disclaimers);
}

export function updateDisclaimers(studyId, consentId, disclaimers) {
  return disclaimerUpdateResource.update({ studyId, consentId }, disclaimers);
}
