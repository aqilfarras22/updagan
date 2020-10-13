import Vue from 'vue';
import { API_ROOT, studyManagement, users, updatepassword } from './urls';

const profileDetails = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/id}`,
  {},
  { update: { method: 'PUT' } },
);
const editPassword = Vue.resource(
  `${API_ROOT}${studyManagement}${users}/${updatepassword}`,
  {},
  { update: { method: 'PUT' } },
);
const editProfile = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/id}`,
  {},
  { update: { method: 'PUT' } },
);

export function getProfileDetails(id) {
  return profileDetails.get({ id });
}
export function editProfileDetails(id, profile) {
  return editProfile.update({ id }, profile).then(res => res.json());
}

export function updatePasswordDetails(id, password) {
  return editPassword.update({ id }, password);
}
