import Vue from 'vue';
import { API_ROOT, responsemanagement, activity, survey, queryTool, participant, reporteddata } from './urls';

const baseActivityApiUrl = `${API_ROOT}${responsemanagement}`;

const activityResource = Vue.resource(`${baseActivityApiUrl}${activity}{/activityId}`);
const surveyResource = Vue.resource(`${API_ROOT}${queryTool}/${survey}{/studyId}{/pid}{/surveyId}`);
const surveySubmmitedList = Vue.resource(`${API_ROOT}${queryTool}/${participant}/${reporteddata}{/pid}`);

export function getActivity({ aId }) {
  return activityResource.get({ activityId: aId }).then(res => res.json());
}

export function getSurvey({ studyId, pid, surveyId, responseDate, reportedDataTrackerId }) {
  return surveyResource.get({ studyId, pid, surveyId, responseDate, reportedDataTrackerId })
    .then(res => res.json());
}

export function getSurveyResponsesList({ studyId, pid, id, startDay, endDay, type}) {
  return surveySubmmitedList.get({ studyId, pid, id, startDay, endDay, type })
    .then(res => res.json());
}
