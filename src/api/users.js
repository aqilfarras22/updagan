import Vue from 'vue';
import {
  API_ROOT,
  studyManagement,
  users,
  forgotPassword,
  verify,
  invite,
  profile,
  searchusers,
  sortusers,
  studies,
  associateUser,
  disassociateUser,
  search,
  user,
  signout
} from './urls';

const usersResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/userId}`,
  {},
  { update: { method: 'PUT' } },
);
const usersSearchResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}/${searchusers}`,
  {},
  { update: { method: 'PUT' } },
);
const usersPasswordResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/userId}/${forgotPassword}`,
  {},
  { update: { method: 'PUT' } },
);
const usersVerifyResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}/${verify}`,
  {},
  { update: { method: 'PUT' } },
);
const usersInviteResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}/${invite}`,
  {},
  { update: { method: 'PUT' } },
);
const userDetailsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/userId}/${profile}`,
  {},
  { update: { method: 'PUT' } },
);
const usersFilterResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}/${sortusers}`,
  {},
  { update: { method: 'PUT' } },
);
const studyUsersResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/{studyId}/${users}`,
  {},
  { update: { method: 'PUT' } },
);
const associateResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/{studyId}/${users}/${associateUser}`,
  {},
  { update: { method: 'PUT' } },
);
const disassociateResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/{studyId}/${users}/${disassociateUser}`,
  {},
  { update: { method: 'PUT' } },
);
const searchResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/{studyId}/${users}/${search}`,
  {},
  { update: { method: 'PUT' } },
);
const resendInviteResource = Vue.resource(
  `${API_ROOT}${studyManagement}${user}/${invite}`,
  {},
  { update: { method: 'POST' } },
);

const logUserLogoutResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/userId}/${signout}`
);

export function getAllUsersFact() {
  return usersResource.get();
}

export function userSearchFilterFact(searchterm, sort, filter) {
  // eslint-disable-line
  return usersFilterResource.get({ search: searchterm, sort, filter });
}

export function searchUsersFact(searchTerm) {
  return usersSearchResource.get({ username: searchTerm });
}

export function getUserDataFact(userId) {
  return usersResource.get({ userId });
}

export function addNewUserInfoFact(data) {
  return usersResource.save(data);
}

export function verifyUserInfoFact(data) {
  return usersVerifyResource.save(data);
}

export function inviteUserInfoFact(data) {
  return usersInviteResource.save(data);
}

export function updateUserInfoFact(userId, data) {
  return usersResource.update({ userId }, data);
}

export function passwordUserInfoFact(userId) {
  return usersPasswordResource.update({ userId }, {});
}

export function userDetailsFact(userId, data) {
  return userDetailsResource.update({ userId }, data);
}

export function getStudyUsersFact(studyId, type, associated) {
  return studyUsersResource.get({ studyId, type, associated });
}

export function userAssociateFact(studyId, data) {
  return associateResource.save({ studyId }, data);
}

export function userDisassociateFact(studyId, data) {
  return disassociateResource.delete({ studyId }, data);
}

export function searchUserFact(studyId, type, associated, searchterm) {
  return searchResource.get({ studyId, type, associated, search: searchterm });
}

export function resendInviteFact(id, data) {
  return resendInviteResource.update({ id }, data);
}

export function logUserlogoutFact(userId) {
  return logUserLogoutResource.save({ userId }, {});
}