import Vue from 'vue';
import {
  API_ROOT,
  studyManagement,
  studies,
  sites,
  siteteammembers,
  statusKey,
  resendInvite,
  search,
} from './urls';

const sitesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}{/siteId}`,
  {},
  { update: { method: 'PUT' } },
);

const siteStatusResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}{/siteId}/${statusKey}`,
  {},
  { update: { method: 'PUT' } },
);

const siteTeamResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}{/siteId}/${siteteammembers}`,
  {},
);

const memberSendInviteResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}{/siteId}/${siteteammembers}{/siteTeamMemberId}/${resendInvite}`,
  {},
  { update: { method: 'PUT' } },
);

const searchSitesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}/${search}`,
  {},
  { update: { method: 'PUT' } },
);

const activateResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}{/siteId}/${siteteammembers}{/siteTeamMemberId}/${statusKey}`,
  {},
  { update: { method: 'PUT' } },
);

export function getSitesFact(studyId) {
  return sitesResource.get({ studyId });
}

export function postSiteDetailsFact(studyId, data) {
  return sitesResource.save({ studyId }, data);
}

export function getSiteDetailsFact(studyId, siteId) {
  return sitesResource.get({ studyId, siteId });
}

export function updateSiteDetailsFact(studyId, siteId, data) {
  return sitesResource.update({ studyId, siteId }, data);
}

export function updateSiteStatusFact(studyId, siteId, data) {
  return siteStatusResource.update({ studyId, siteId }, data);
}

export function getSiteTeamFact(studyId, siteId) {
  return siteTeamResource.get({ studyId, siteId });
}

export function postSiteTeamMemberFact(studyId, siteId, data) {
  return siteTeamResource.save({ studyId, siteId }, data);
}

export function sendInviteTeamMemberFact(studyId, siteId, siteTeamMemberId, data) {
  return memberSendInviteResource.update({ studyId, siteId, siteTeamMemberId }, data);
}

export function searchSitesFact(studyId, searchTerm) {
  return searchSitesResource.get({ studyId, searchValue: searchTerm });
}

export function activateTeamMemberFact(studyId, siteId, siteTeamMemberId, data) {
  return activateResource.update({ studyId, siteId, siteTeamMemberId }, data);
}
