import Vue from 'vue';
import { API_ROOT, queryTool, openEDCQuery,
  edc,
  responses,
  events,
  versions,
  formresponse,
  dashboardMetrics,
  unscheduledpacketresponse } from './urls';

const baseQueryToolApiUrl = `${API_ROOT}${queryTool}`;
const baseEDCQueryToolApiUrl = `${API_ROOT}${openEDCQuery}`;

const createQueryResource = Vue.resource(`${baseEDCQueryToolApiUrl}?studyId={studyId}`);
const getAllCommentsResource = Vue.resource(`${baseEDCQueryToolApiUrl}/{queryId}?studyId={studyId}`);
const getListOfQueriesResource = Vue.resource(`${baseEDCQueryToolApiUrl}?studyId={studyId}&responseId={responseId}`);
const createNewCommentResource = Vue.resource(`${baseEDCQueryToolApiUrl}/{queryId}/comments?studyId={studyId}`);
const updateQueryStatusResource = Vue.resource(`${baseEDCQueryToolApiUrl}/{queryId}?studyId={studyId}`);
const getAllQueryCommentsResource = Vue.resource(`${baseEDCQueryToolApiUrl}/{queryId}?studyId={studyId}`);
// edc data dashboard
const dashboadMetaDataResource = Vue.resource(`${API_ROOT}${edc}/{studyId}/responsemetrics`);
const edcQueryToolStatisticResource = Vue.resource(`${API_ROOT}${edc}/{studyId}/${dashboardMetrics}{?*}`);

const getUserNamesResource = Vue.resource(`${API_ROOT}studymanagement/studies/{studyId}/studysiteteam`);

// form field queries
const queryToolResource = Vue.resource(`${baseQueryToolApiUrl}`);
const queryToolFormQueryStatusResource = Vue.resource(
  `${baseQueryToolApiUrl}/query{/qId}{/patchId}`,
);
const queryToolFormQueryCommentsResource = Vue.resource(`${baseQueryToolApiUrl}{/qId}/comment`);

// main statistic
const queryToolStatisticResource = Vue.resource(`${baseQueryToolApiUrl}{/sId}/statistic{?*}`);

// participant
// TODO: Refactor later
const queryToolStudyParticipantResource = Vue.resource(
  `${baseQueryToolApiUrl}/participant{/pId}{/sId}`,
);

// form
const queryToolStudyFormResource = Vue.resource(`${baseQueryToolApiUrl}/form{/fId}{/patchId}`);
const queryToolStudyFormHistoryResource = Vue.resource(
  `${baseQueryToolApiUrl}/form{/fId}{/method}{/vId}`,
);
const queryToolStudyFormReasonResource = Vue.resource(`${baseQueryToolApiUrl}/form/reason`);

const edcQueryFormVersionsHistoryResource = Vue.resource(`${API_ROOT}${edc}/${responses}/{responseId}/${events}`,
  {},
  { update: { method: 'PUT' } },
);

const edcFormResponseVersionsResource = Vue.resource(`${API_ROOT}${edc}/${formresponse}/{responseId}/${versions}/{versionId}`,
  {},
  { update: { method: 'PUT' } },
);

const edcUnscheduleFormResponseVersionsResource = Vue.resource(`${API_ROOT}${edc}/${unscheduledpacketresponse}/{responseId}/${versions}/{versionId}`,
  {},
  { update: { method: 'PUT' } },
);

export function addQueryToolFieldQuery(data) {
  return queryToolResource.save(data);
}

export function addQueryToolFormQueryComment(data) {
  return queryToolFormQueryCommentsResource.save(
    {
      qId: data.queryId,
    },
    data,
  );
}

export function setQueryToolFormQueryStatus({ qId, patchId }, data = {}) {
  return queryToolFormQueryStatusResource.save({ qId, patchId }, data);
}

export function getQueryToolStatistic({ sId, params }) {
  return queryToolStatisticResource.get({ sId, ...params }).then(res => res.json());
}

export function getQueryToolStudyParticipant({ sId, pId }) {
  return queryToolStudyParticipantResource.get({ sId, pId }).then(res => res.json());
}

export function getQueryToolStudyForm({ fId }) {
  return queryToolStudyFormResource.get({ fId }).then(res => res.json());
}

export function getQueryToolStudyFormHistory({ fId }) {
  return queryToolStudyFormHistoryResource.get({ fId, method: 'history' }).then(res => res.json());
}

export function getQueryToolStudyFormHistoryVersion({ fId, vId }) {
  return queryToolStudyFormHistoryResource
    .get({ fId, vId, method: 'version' })
    .then(res => res.json());
}

export function saveQueryToolStudyForm({ fId }, data) {
  return queryToolStudyFormResource.save({ fId }, data);
}

export function setQueryToolStudyFormStatus({ fId, patchId }, data = {}) {
  return queryToolStudyFormResource.save({ fId, patchId }, { ...data });
}

export function getFormReasonForChangeList() {
  return queryToolStudyFormReasonResource.get();
}

// EDC Query tool
export function openNewQuery(data, formStudyId) {
  return createQueryResource.save(
    {
      studyId: formStudyId,
    },
    data,
  );
}

export function getAllEdcComments(qId, formStudyId) {
  return getAllCommentsResource.get({
    queryId: qId,
    studyId: formStudyId,
  });
}

export function getAllListOfQueries(respId, formStudyId) {
  return getListOfQueriesResource.get({
    studyId: formStudyId,
    responseId: respId,
  });
}

export function addNewComment(qId, formStudyId, data) {
  return createNewCommentResource.save(
    {
      queryId: qId,
      studyId: formStudyId,
    },
    data,
  );
}

export function getAllQueryComments(qId, formStudyId) {
  return getAllQueryCommentsResource.get(
    {
      queryId: qId,
      studyId: formStudyId,
    },
  );
}


export function updateQueryStatus(qId, formStudyId, queryStatus) {
  return updateQueryStatusResource.update(
    {
      queryId: qId,
      studyId: formStudyId,
    },
    {
      status: queryStatus,
    },
  );
}

export function getEdcQueryFormVersionsHistoryStatus(formId, responseId, studyId, responseType) {
  return edcQueryFormVersionsHistoryResource.get({ formId, responseId, studyId, responseType });
}

export function getedcFormResponseVersionsResource(responseId, versionId, studyId) {
  return edcFormResponseVersionsResource.get({ responseId, versionId, studyId });
}

export function updateEdcFormResponseVersionsResource(responseId, versionId, studyId,
  data) {
  return edcFormResponseVersionsResource.update({ responseId, versionId, studyId }, data);
}

export function getedcUnscheduleFormResponseVersionsResource(responseId, versionId, studyId) {
  return edcUnscheduleFormResponseVersionsResource.get({ responseId, versionId, studyId });
}

export function updateEdcUnscheduleFormResponseVersionsResource(responseId, versionId,
  studyId, data) {
  return edcUnscheduleFormResponseVersionsResource.update({ responseId, versionId, studyId },
    data);
}

// EDC data dashboard

export function dashboadMetaData(formStudyId) {
  return dashboadMetaDataResource.get({
    studyId: formStudyId,
  });
}

export function dashboadTableData({ studyId, params }) {
  return edcQueryToolStatisticResource.get({ studyId, ...params }).then(res => res.json());
}

export function getUserNames(formStudyId) {
  return getUserNamesResource.get(
    {
      studyId: formStudyId,
    },
  );
}
