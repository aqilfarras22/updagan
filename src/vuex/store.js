import Vue from 'vue';
import Vuex from 'vuex';

// modules
import user from './modules/user';

// TODO: need to refactoring
import appState from './modules/appState';

import edc from './modules/edc-forms';
import edcFormErrors from './modules/edc-form-errors';

Vue.use(Vuex);

const createStore = () => new Vuex.Store({
  modules: {
    user,
    appState,
    edc,
    edcFormErrors,
  },
});

export default createStore();
