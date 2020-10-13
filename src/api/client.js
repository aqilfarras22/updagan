import Vue from 'vue';
import {
  API_ROOT,
  studyManagement,
  client,
  getclientinfo,
  onboardedclients,
  clientteam,
} from './urls';

const postClientResource = Vue.resource(
  `${API_ROOT}${studyManagement}${client}{/clientId}`,
  {},
  { update: { method: 'PUT' } },
);
const getAllClientsResource = Vue.resource(`${API_ROOT}${studyManagement}${onboardedclients}`);
const getClientIdResource = Vue.resource(
  `${API_ROOT}${studyManagement}${getclientinfo}`,
  {},
  { update: { method: 'PUT' } },
);
const postClientMemberResource = Vue.resource(
  `${API_ROOT}${studyManagement}${clientteam}`,
  {},
  { update: { method: 'PUT' } },
);
const getClientMemberResource = Vue.resource(
  `${API_ROOT}${studyManagement}${clientteam}{/clientMemberId}`,
  {},
  { update: { method: 'PUT' } },
);

export function postClientFact(data) {
  return postClientResource.save(data);
}

export function getClientIdFact() {
  return getClientIdResource.get();
}

export function getClientsListFact() {
  return getAllClientsResource.get();
}

export function getClientDataFact(clientId) {
  return postClientResource.get({ clientId });
}

export function updateClientInfoFact(clientId, data) {
  return postClientResource.update({ clientId }, data);
}

export function addNewClientMemberInfoFact(clientId, data) {
  return postClientMemberResource.save({ clientId }, data);
}

export function getClientMemberDataFact(clientId, clientMemberId) {
  return getClientMemberResource.get({ clientId, clientMemberId });
}

export function updateClientMemberInfoFact(clientId, clientMemberId, data) {
  return getClientMemberResource.update({ clientId, clientMemberId }, data);
}

export function getClientAllMemberDataFact(clientId) {
  return getClientMemberResource.get({ clientId });
}
