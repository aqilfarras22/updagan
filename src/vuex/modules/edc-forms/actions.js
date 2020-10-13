import localStorageService from '@/services/localStorage';
import * as types from './mutation-types';

export const saveEDCFormData = async ({ commit }, formData) => {
  commit(types.SAVE_FORM_DATA, formData);
  localStorageService.setItem('edcData', formData);
};

export const toggleEDCFormEditMode = async ({ commit }, formEditMode) => {
  commit(types.SAVE_FORM_MODE, formEditMode);
  localStorageService.setItem('edcFormEditMode', formEditMode);
};

export const saveEDCFormName = async ({ commit }, formName) => {
  commit(types.SAVE_FORM_NAME, formName);
  localStorageService.setItem('edcFormName', formName);
};

export const clearEDCData = async () => {
  localStorageService.removeItem('edcData');
  localStorageService.removeItem('edcFormName');
  localStorageService.removeItem('edcFormEditMode');
};

export const setupLocalStorageEDCData = ({ commit }) => {
  const edcData = localStorageService.getItem('edcData');
  const edcFormName = localStorageService.getItem('edcFormName');

  if (edcData) {
    commit(types.SAVE_FORM_DATA, edcData);
  }
  if (edcFormName) {
    commit(types.SAVE_FORM_NAME, edcFormName);
  }
};
