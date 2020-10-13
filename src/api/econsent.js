import Vue from 'vue';
import {
  API_ROOT,
  studyManagement,
  studies,
  consentsections,
  defaultsections,
  consent,
  consentdocument,
  consentprivacy,
  consentlicense,
  consentquiz,
  arrange,
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
const documentSectionResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentdocument}`,
  {},
  { update: { method: 'PUT' } },
);
const privacyResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${consentprivacy}`,
  {},
  { update: { method: 'PUT' } },
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

export function getConsentSectionsFact(studyId) {
  return consentResource.get({ studyId });
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

export function documentSectionFact(studyId) {
  return documentSectionResource.get({ studyId });
}

export function updateConsentSectionFact(studyId, sectionId, section) {
  return consentSectionResource.save({ studyId, sectionId }, section);
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
export function saveConsentDocumentFact(studyId, section) {
  return documentSectionResource.save({ studyId }, section);
}

export function updateConsentDocumentFact(studyId, consentDocId, section) {
  return documentSectionResource.save({ studyId }, section);
}

export function deleteConsentDocumentFact(studyId) {
  return documentSectionResource.delete({ studyId });
}

export function addPrivacyFact(studyId, data) {
  return privacyResource.save({ studyId }, data);
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
