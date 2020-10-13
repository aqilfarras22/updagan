import * as types from './mutation-types';

export default {
  [types.SAVE_FORM_DATA](state, formData) {
    state.formData = formData;
  },
  [types.SAVE_FORM_NAME](state, formName) {
    state.formName = formName;
  },
  [types.SAVE_FORM_MODE](state, formEditMode) {
    state.formEditMode = formEditMode;
  },
};
