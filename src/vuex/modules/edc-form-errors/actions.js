import localStorageService from '@/services/localStorage';
import * as types from './mutation-types';

export const saveEDCFormErrors = async ({ commit }, formErrors) => {
  commit(types.SAVE_FORM_ERRORS, formErrors);
  localStorageService.setItem('edcFormErrors', formErrors);
};

export const clearEDCFormErrors = async () => {
  localStorageService.removeItem('edcFormErrors');
};

export const setupLocalStorageEDCData = ({ commit }) => {
  const edcFormErrors = localStorageService.getItem('edcFormErrors');

  if (edcFormErrors) {
    commit(types.SAVE_FORM_ERRORS, edcFormErrors);
  }
};
