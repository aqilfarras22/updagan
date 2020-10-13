import * as types from './mutation-types';

export default {
  [types.SAVE_FORM_ERRORS](state, formErrors) {
    state.formErrors = formErrors;
  },
};
