import * as types from './mutation-types';
import initialState from './state';

export default {
  [types.SET_USER](state, user) {
    state.user = user;
  },
  [types.SET_USER_TOKENS](state, { token, refreshToken }) {
    state.token = token;
    state.refreshToken = refreshToken;
  },
  [types.LOGOUT_USER](state) {
    state.user = { ...initialState.user };
  },
};
