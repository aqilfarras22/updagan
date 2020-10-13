import Vue from 'vue';
import dummyCollectionPoint from './data/collection-point'
import dummyEnrollment from './data/enrollment-participant'
import { CLIENT_ID } from '../constants/config'

import {
  API_ROOT_ANALYTICS,
  analytics,
  enrollment,
  econsent,
  participantStatus,
  withdraw,
  dataCollection,
  dataPoints,
  recruitment,
  enrollmentParticipant,
  participant,
  progress,
  compliance,
  complianceDetails,
  overall
} from './urls';

const headers = {
  clientid: CLIENT_ID
}

const econsentResource = Vue.resource(
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${enrollment}/${econsent}`
);

const recruitmentResource = Vue.resource(
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${enrollment}/${recruitment}`
);

const participantStatusResource = Vue.resource( // eslint-disable-line
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${enrollment}/${participantStatus}`
)

const withdrawResource = Vue.resource( // eslint-disable-line
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${enrollment}/${withdraw}`
)

const dataCollectionPointResource = Vue.resource( // eslint-disable-line
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${dataCollection}/${dataPoints}`
)

const enrollmentParticipantData = Vue.resource(
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${enrollment}/${enrollmentParticipant}`
)

const progressResource = Vue.resource(
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${enrollment}/${participant}/${progress}`
);

const complianceResource = Vue.resource(
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${dataCollection}/${participant}/${compliance}`
);

const complianceDetailsResource = Vue.resource(
  `${API_ROOT_ANALYTICS}${analytics}{/studyId}/${dataCollection}/${participant}/${complianceDetails}`
);

export function getEconsentVisData(studyId) {
  return econsentResource.get({ studyId }, headers);
}

export function getRecruitmentVisData(studyId) { // eslint-disable-line
  return recruitmentResource.get({ studyId }, headers);
}

export function getParticipantCompletionVisData (params) { // eslint-disable-line
  return progressResource.get({ ...params }, headers);
}

export function getParticipantComplianceVisData (params) { // eslint-disable-line
  return complianceResource.get({ ...params }, headers);
}

export function getParticipantStatusVisData (studyId) {
  return participantStatusResource.get({ studyId }, headers);
}

export function getWithdrawVisData (studyId) { // eslint-disable-line
  return withdrawResource.get({ studyId }, headers);
}

export function getCollectionPointData (studyId) { // eslint-disable-line
  return new Promise((resolve, reject) => { // eslint-disable-line
    resolve(dummyCollectionPoint)
  })
}

export function getEnrollmentParticipantData(studyId) {
  return new Promise((resolve, reject) => { // eslint-disable-line
    resolve(dummyEnrollment)
  })
}

export function getParticipantComplianceDetailsVisData (params) { // eslint-disable-line
  return complianceDetailsResource.get({ ...params }, headers);
}