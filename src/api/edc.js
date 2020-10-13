import Vue from 'vue';
import VueResource from 'vue-resource';

import {
  API_ROOT,
  edc,
  formschedules,
  forms,
  schedule,
  formversions,
  participantschedule,
  formresponse,
  unscheduledpackets,
  unscheduledpacketresponse,
  studies,
  participants,
  responses,
  sourceDocuments,
  preSignedUpload,
  preSignedDownload
} from './urls';

Vue.use(VueResource);

const edcFormScheduleResource = Vue.resource(`${API_ROOT}${edc}/${formschedules}`,
  {},
  { update: { method: 'PUT' } },
);

const edcFormResource = Vue.resource(`${API_ROOT}${edc}/${forms}{/formId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcformversionsResource = Vue.resource(`${API_ROOT}${edc}/${forms}{/formId}/${formversions}`,
  {},
  { update: { method: 'PUT' } },
);

const edcformversionResource = Vue.resource(`${API_ROOT}${edc}/${forms}{/mainFormId}/${formversions}/{formId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcFormMilestoneResource = Vue.resource(`${API_ROOT}${edc}/${schedule}`,
  {},
  { head: { method: 'HEAD' } },
  { update: { method: 'PUT' } },
);

const participantScheduleResource = Vue.resource(`${API_ROOT}${edc}/${participantschedule}{/pId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcFormResponseResource = Vue.resource(`${API_ROOT}${edc}/${forms}{/formId}/${formresponse}`,
  {},
  { update: { method: 'PUT' } },
);

const edcFormResponseFormResource = Vue.resource(`${API_ROOT}${edc}/${forms}{/formId}/${formresponse}/{responseId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcUnscheduleResource = Vue.resource(`${API_ROOT}${edc}/${unscheduledpackets}{/packetId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcUnschedulePacketResponseResource = Vue.resource(`${API_ROOT}${edc}/${unscheduledpackets}{/packetId}/${unscheduledpacketresponse}`,
  {},
  { update: { method: 'PUT' } },
);

const edcUnschedulePacketFormResponseResource = Vue.resource(`${API_ROOT}${edc}/${unscheduledpackets}{/packetId}/${unscheduledpacketresponse}/{packetResponseId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcUnschedulePacketResource = Vue.resource(`${API_ROOT}${edc}/${unscheduledpackets}{/packetId}`,
  {},
  { update: { method: 'PUT' } },
);

const preSignedUrlResource = Vue.resource(`${API_ROOT}${edc}/${studies}{/studyId}/${participants}{/participantId}/${responses}{/responseId}/${sourceDocuments}/${preSignedUpload}`,
  {},
  { update: { method: 'PUT' } },
);

const postUploadResource = Vue.resource(`${API_ROOT}${edc}/${studies}{/studyId}/${participants}{/participantId}/${responses}{/responseId}/${sourceDocuments}`,
  {},
  { update: { method: 'PUT' } },
);

const downloadUrlResource = Vue.resource(`${API_ROOT}${edc}/${studies}{/studyId}/${participants}{/participantId}/${responses}{/responseId}/${sourceDocuments}{/id}/${preSignedDownload}`,
  {},
  { update: { method: 'PUT' } },
);

const deleteDocumentResource = Vue.resource(`${API_ROOT}${edc}/${studies}{/studyId}/${participants}{/participantId}/${responses}{/responseId}/${sourceDocuments}{/id}`,
  {},
  { update: { method: 'PUT' } },
);

const getUnschduledPktsList = Vue.resource(`${API_ROOT}${edc}/${unscheduledpackets}`,
  {},
  { update: { method: 'PUT' } },
);

export function getEDCFormsFact(studyId) {
  return edcFormScheduleResource.get({ studyId });
}

export function getEDCFormDataFact(formId, studyId) {
  return edcFormResource.get({ studyId, formId });
}

export function getEDCformversionsDataFact(formId, studyId) {
  return edcformversionsResource.get({ studyId, formId });
}

export function getEDCformversionDataFact(mainFormId, formId, studyId) {
  return edcformversionResource.get({ studyId, formId, mainFormId });
}

export function postEDCFormFact(studyId, data) {
  return edcFormResource.save({ studyId }, data);
}

export function updateEDCFormDataFact(formId, studyId, isFormChanged, data) {
  return edcFormResource.update({ studyId, formId, isFormChanged }, data);
}

export function getEDCMilestonesFact(studyId) {
  return edcFormMilestoneResource.get({ studyId });
}

export function postEDCMilestonesFact(studyId, data) {
  return edcFormMilestoneResource.save({ studyId }, data);
}

export function updateEDCMilestonesFact(studyId, data) {
  return edcFormMilestoneResource.update({ studyId }, data);
}

export function getParticipantFormsFact(studyId, pId) {
  return participantScheduleResource.get({ studyId, pId });
}

export function getEDCFormResponseFact(formId, studyId, participantId, milestone) {
  return edcFormResponseResource.get({ studyId, formId, participantId, milestone });
}


export function postEDCFormResponseFact(formId, studyId, participantId, data) {
  return edcFormResponseResource.save({ studyId, formId, participantId }, data);
}

export function updateEDCFormResponseFact(formId, studyId, participantId, responseId, data) {
  return edcFormResponseFormResource.update({ studyId, formId, participantId, responseId }, data);
}

export function getEDCFormResponseByResponseIdFact(formId, studyId, participantId, responseId,
  milestone) {
  return edcFormResponseFormResource.get({ studyId, formId, participantId, responseId, milestone });
}

export function getUnscheduledPacketsFact(studyId) {
  return edcUnscheduleResource.get({ studyId });
}

export function getUnscheduledPacketFact(studyId, packetId) {
  return edcUnschedulePacketResource.get({ studyId, packetId });
}

export function postUnscheduledPacketFact(studyId, data) {
  return edcUnscheduleResource.save({ studyId }, data);
}

export function getPacketFact(studyId, packetId) {
  return edcUnscheduleResource.get({ studyId, packetId });
}

export function editPacketNameFact(studyId, packetId, data) {
  return edcUnscheduleResource.update({ studyId, packetId }, data);
}

export function checkEDCMilestonesFact(studyId) {
  return edcFormMilestoneResource.head({ studyId });
}

export function postEDCUnscheduleFormResponseFact(packetId, studyId, participantId, data) {
  return edcUnschedulePacketResponseResource.save({ studyId, packetId, participantId }, data);
}

export function updateEDCUnscheduleFormResponseFact(packetId, studyId, participantId,
  packetResponseId, data) {
  return edcUnschedulePacketFormResponseResource.update(
    { studyId, packetId, participantId, packetResponseId }, data);
}

export function getEDCUnscheduleFormResponseFact(studyId, participantId) {
  return edcUnschedulePacketResponseResource.get({ studyId, participantId });
}

export function getUnscheduleFormResponseFact(studyId, participantId, packetId, packetResponseId) {
  return edcUnschedulePacketFormResponseResource.get(
    { studyId, participantId, packetId, packetResponseId });
}

export function getPreSignedUrlFact(studyId, participantId, responseId, type, siteId) {
  return preSignedUrlResource.get({ studyId, participantId, responseId, type: type, siteId: siteId });
}

export function postUploadFact(studyId, participantId, responseId, data, siteId) {
  return postUploadResource.save({ studyId, participantId, responseId, siteId: siteId }, data);
}

export function getSourceDocumentsFact(studyId, participantId, responseId, siteId) {
  return postUploadResource.get({ studyId, participantId, responseId, siteId: siteId});
}

export function getDownloadUrlFact(studyId, participantId, responseId, id, siteId) {
  return downloadUrlResource.get({ studyId, participantId, responseId, id, siteId: siteId });
}

export function deleteDocumentFact(studyId, participantId, responseId, id, siteId) {
  return deleteDocumentResource.delete({ studyId, participantId, responseId, id, siteId: siteId });
}

export function getUnschduledPkts(studyId) {
  return getUnschduledPktsList.get({ studyId });
}
