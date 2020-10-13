import Vue from 'vue';
import VueResource from 'vue-resource';

import {
  API_ROOT,
  auth,
  signin,
  forgotPassword,
  sendOtp,
  validateOtp,
  resetPassword,
  studyManagement,
  users,
  refresh,
} from './urls';

Vue.use(VueResource);

const authResource = Vue.resource(`${API_ROOT}${auth}/${signin}`);
const forgotPwdResource = Vue.resource(`${API_ROOT}${auth}/${forgotPassword}`);
const sendOtpResource = Vue.resource(`${API_ROOT}${auth}/${sendOtp}`);
const validateOtpResource = Vue.resource(`${API_ROOT}${auth}/${validateOtp}`);
const setPasswordResource = Vue.resource(`${API_ROOT}${auth}/${resetPassword}`);
const refreshTokenResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}{/userId}/${refresh}`,
);

export function loginUserFact(data) {
  //webPortalLogIn key is added to identify that the sign in API is called from WEB UI OR by Backedn Webservice internally
  data.webPortalLogIn = true;
  return authResource.save(data);
}

export function sendForgotPwdEmailFact(data) {
  return forgotPwdResource.save(data);
}

export function sendOtpToMobileFact(data) {
  return sendOtpResource.save(data);
}

export function verifyOtpFact(data) {
  return validateOtpResource.save(data);
}

export function setNewPasswordFact(data) {
  return setPasswordResource.save(data);
}

export function getRefreshTokenFact(userId, data) {
  return refreshTokenResource.save({ userId }, data);
}
