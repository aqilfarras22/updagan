import jwtDecode from 'jwt-decode';
import localStorageService from '@/services/localStorage';
import * as types from './mutation-types';
import api from '../../../api';

export const userLogin = async ({ dispatch }, { password, username, electronicSignatureSignIn }) => {
  try {
    const response = await api.loginUserFact({ password, username, electronicSignatureSignIn });
    if (response.body && response.body.result) {
      const { token, refreshToken } = response.body.result;
      if (token) {
        dispatch('userSetTokens', {
          token,
          refreshToken,
        });
        const tokenObj = jwtDecode(token);
        await dispatch('userLoadProfile', tokenObj.id);
      }
    }
  } catch (error) {
    const errorMsg = error.body && error.body.message
      ? error.body.message
      : 'You have entered an invalid username or password';
    throw new Error(errorMsg);
  }
};

export const userLoadProfile = async ({ dispatch }, userId) => {
  try {
    const response = await api.getProfileDetails(userId);
    const user = response.body;
    dispatch('userUpdate', user);
  } catch (error) {
    const errorMsg = error.body && error.body.message
      ? error.body.message
      : 'Error while getting the profile details';
    throw new Error(errorMsg);
  }
};

export const setupLocalStorageUserData = ({ commit, dispatch }) => {
  const user = localStorageService.getItem('userObj');
  const token = localStorageService.getItem('token');
  const refreshToken = localStorageService.getItem('refreshToken');
  const clientId = localStorageService.getItem('clientId');
  const clientName = localStorageService.getItem('clientName');

  if (clientId) {
    dispatch('clientIdSuccess', clientId);
  }
  if (clientName) {
    dispatch('clientName', clientName);
  }
  if (user) {
    commit(types.SET_USER, user);
  }
  if (token && refreshToken) {
    commit(types.SET_USER_TOKENS, { token, refreshToken });
  }
};

export const userUpdate = async ({ commit }, user) => {
  commit(types.SET_USER, user);
  localStorageService.setItem('userObj', user);
};

export const userSetTokens = async ({ commit }, { token, refreshToken }) => {
  commit(types.SET_USER_TOKENS, { token, refreshToken });
  localStorageService.setItem('token', token);
  localStorageService.setItem('refreshToken', refreshToken);
};

export const userLogout = ({ commit, getters }) => { 
  commit(types.LOGOUT_USER);
  const studySummaryStatus = localStorageService.getItem('studySummary');
  localStorageService.removeAll();
  localStorageService.setItem('studySummary', studySummaryStatus);
  localStorageService.setItem('logOut', true);
  if (getters.token) {
    document.location.reload();
  }
};
