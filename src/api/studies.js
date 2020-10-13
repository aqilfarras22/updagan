import Vue from 'vue';
import {
  API_ROOT,
  API_ROOT_V2,
  studyManagement,
  surveyManagement,
  feedbackicons,
  appAvailability,
  studies,
  statusKey,
  diseases,
  appicons,
  applogos,
  consenticons,
  uploadicon,
  uploadlogo,
  validate,
  searchstudies,
  study,
  dashboard,
  platforms,
  icons,
  learnmoreicons,
  pagination,
  colors,
  build,
  clients,
  branding,
  onboarding,
  welcomecontent,
  libraryfeatures,
  scheduler,
  participantconfiguration,
  activities,
  overview,
  eligibilityquestions,
  learnmore,
  sections,
  learnmorefeedback,
  questions,
  downloadPrototype,
  feedback,
  validic,
  devices,
  approval,
  downloadIrb,
  generateIrb,
  saveandexit,
  appdescription,
  search,
  marketing,
  sortandfilters,
  featuresState,
  mailIrb,
  healthdataaccessconfiguration,
  epicintegration,
  dataexport,
  exportKey,
  dashboards,
  arrange,
  prototype,
  users,
  customnotification,
  truclinic,
  truclinicPIEndpoint,
  studyDetails,
  multiConsent,
  studyteam,
  toggledfeatures,
  launchStudy,
  summary,
  multifeaturesstate,
  compliancedata,
  surveys,
  emailrecipient,
  specificClient,
  sftpExport,
  execDetails,
  trigger,
  test,
  retry,
  displayOrder,
  validicDevices,
  types,
  exportStudyData,
  languages,
  applanga,
  setting,
  country,
  countrySpecificStudyFeatures,
  templatelogos,
  participants,
  document,
  documents,
  sites,
  download
} from './urls';

const studiesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const deleteStudyResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${statusKey}/`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studyDiseasesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${diseases}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesConsentIconsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${consenticons}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesIconsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${appicons}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesLogosResource = Vue.resource(
  `${API_ROOT}${studyManagement}${applogos}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const surveyTemplateLogosResource = Vue.resource(
  `${API_ROOT}${studyManagement}${templatelogos}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesuploadIconResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${uploadicon}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesuploadLogoResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${uploadlogo}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studyValidityResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${validate}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesSearchResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${searchstudies}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studyDashboardResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${dashboard}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesMetaResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${branding}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesPlatformsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${platforms}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesIconResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${icons}{/type}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesWelcomeScreensResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${welcomecontent}{/screenId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const welcomeScreensArrangeResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${welcomecontent}/${arrange}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesOnboardingResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${onboarding}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesColorsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${colors}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesBuildResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${build}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studyResource = Vue.resource(`${API_ROOT}${studyManagement}${study}`);
const clientsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${clients}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const libraryFeaturesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${libraryfeatures}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const schedulingResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${scheduler}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const registrationResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${participantconfiguration}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studyOverviewResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${overview}`,
);
const activitiesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${activities}{/activityId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const activitiesListResource = Vue.resource(
  `${API_ROOT}${studyManagement}${specificClient}/${activities}`, {});

const dashbboardActivitiesResource = Vue.resource(
  `${API_ROOT}${surveyManagement}${dashboards}/${activities}{/activityId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const eligibilityQuestionsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${eligibilityquestions}{/questionId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const learnMoreResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmore}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const learnMoreSectionsOrderResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmore}/${sections}/${arrange}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const feedbackQuestionsOrderResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmore}/${learnmorefeedback}/${questions}/${arrange}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const learnMoreSectionResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmore}/${sections}{/sectionId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const learnMoreIconLibrary = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmoreicons}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const feedbackIconLibrary = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${feedbackicons}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const learnMoreFeedbackResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmore}/${learnmorefeedback}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const learnMoreFeedbackQuizResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${learnmore}/${learnmorefeedback}/${questions}{/questionId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const downloadPrototypesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${downloadPrototype}{/platform}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const exportParticipantDataResource = Vue.resource(
  `${API_ROOT}${dataexport}/${studies}/${exportKey}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studiesFeedbackResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${feedback}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const validicResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${validic}/${devices}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const validicDeviceTypesResource = Vue.resource(
  `${API_ROOT}${studyManagement}/${validicDevices}/${types}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const studyApprovalResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${approval}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const downloadIrbResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${downloadIrb}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const studyLanguageResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${participants}/${languages}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const studyCustomDocuementResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${document}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const getStudyCustomDocuementResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sites}{/siteId}/${documents}?studyId={studyId}&siteId={siteId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const statusChangeStudyDocuementResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${document}{/documentId}/status`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const studyDocuementDownloadResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${document}{/documentId}/${download}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const generateIRBResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${generateIrb}`,
);
const saveAndExitResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${saveandexit}`,
);
const appDescriptionResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${appdescription}`,
);
const marketingDataResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${marketing}`,
);
const appAvailabilityResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${appAvailability}`,
);
const studiesFilterResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${search}/${sortandfilters}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const validicFilterResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${validic}/${devices}/${search}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const featuresStateResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${featuresState}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const emailIrbResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${mailIrb}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const epicMyChartResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${epicintegration}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const healthDataAccessResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${healthdataaccessconfiguration}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const prototypeResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${prototype}/${users}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const notificationResoure = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${customnotification}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const updateNotificationResoure = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${customnotification}{/notificationId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const getTruClinicDetailsResoure = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${truclinic}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const truClinicURLResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${truclinicPIEndpoint}/`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const studyDetailsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${studyDetails}`, {},
);

const studyDetailsResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${multiConsent}/${studyDetails}`, {},
);

const studyTeamResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${studyteam}`, {},
);

const toggledFeaturesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${toggledfeatures}`, {},
);

const studyLaunchResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${launchStudy}`, {},
);

const studyOverviewResourceV2 = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${summary}`,
);

const featuresStateV2Resource = Vue.resource(
  `${API_ROOT_V2}${studyManagement}${studies}{/studyId}/${multifeaturesstate}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const exportComplianceDataResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${compliancedata}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const getAddEmailForNotification = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}/{surveyId}/${emailrecipient}`, {}, {
    update: {
      method: 'PUT',
    },
  },
);

const getNotificationsEmail = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${emailrecipient}`,
);

const removeNotificationEmail = Vue.resource(
  `${API_ROOT}${surveyManagement}${surveys}{/surveyId}/${emailrecipient}`,
);

const getSftpTransferStatusResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}`,
);

const saveSftpTransferDetailsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}`,{},{
    update: {
      method: 'PUT'
    }
  }
);

const updateSftpTransferDetailsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}{/sftpId}`,{},{
    update: {
      method: 'PUT'
    }
  }
);

const getConnectionDetailsResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}{/sftpId}/${execDetails}`,
);

const modifyTransferResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}{/sftpId}`,
);

const disconnectTransferResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}{/sftpId}`,
);

const transferNowResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}{/sftpId}/${trigger}`,{},{
    update: {
      method: 'PUT'
    }
  }
);

const testSftpStatusResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}/${test}`,{},{
    update: {
      method: 'PUT'
    }
  }
);

const retryConnectionResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${sftpExport}{/sftpId}/${retry}`,{},{
    update: {
      method: 'PUT'
    }
  }
);
const getActivitiesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${scheduler}/${displayOrder}`,
  {},
);

const updateActivitiesResource = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${scheduler}/${displayOrder}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const downloadStudyDataZipFile = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}/${exportStudyData}`, {}
);
const getClientLanguages = Vue.resource(
  `${API_ROOT}${studyManagement}${languages}`, {}, {
    update: {
      method: 'GET',
    },
  }
);

const getCountryList = Vue.resource(
  `${API_ROOT}${studyManagement}${country}`, {}, {
    update: {
      method: 'GET',
    },
  }
);

const uploadSettingFile = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${applanga}/${setting}{/documentId}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const translationApi = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${applanga}/${setting}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

const countrySpecificFeature = Vue.resource(
  `${API_ROOT}${studyManagement}${studies}{/studyId}/${countrySpecificStudyFeatures}`, {}, {
    update: {
      method: 'PUT',
    },
  }
);

export function getTranslationFile(studyId) {
  return translationApi.get({studyId});
}

export function updateSettingsFile(studyId, fd, documentId) {
  return uploadSettingFile.save({
    studyId,
    documentId
  }, fd);
}

export function getSupportedClientLanguages() {
  return getClientLanguages.get();
}

export function getSupportedCountries() {
  return getCountryList.get();
}

export function getAllStudiesFact() {
  return studiesResource.get();
}

export function deleteStudyFact(studyId, status) {
  return deleteStudyResource.update({
    studyId,
    status
  }, {});
}

export function searchStudiesFact(searchTerm) {
  return studiesSearchResource.get({
    name: searchTerm
  });
}

export function searchFilterFact(searchQuery, sort, filter) {
  // eslint-disable-line
  return studiesFilterResource.get({
    search: searchQuery,
    sort,
    filter
  });
}

export function validicSearchFilterFact(studyId, searchQuery, sort, filter) {
  // eslint-disable-line
  return validicFilterResource.get({
    studyId,
    search: searchQuery,
    sort,
    filter
  });
}
export function getStudyDataFact(studyId) {
  return studiesResource.get({
    studyId},{headers:{'Cache-Control':'no-cache'}});
}

export function checkNewStudyNameValidityFact(data) {
  return studyValidityResource.save({}, data);
}

export function getStudyDiseasesFact() {
  return studyDiseasesResource.get();
}

export function postNewStudyDataFact(data) {
  return studiesResource.save(data);
}

export function postStudyMetaInfoFact(studyId, data) {
  return studiesMetaResource.update({
    studyId
  }, data);
}

export function postStudyDataFact(data) {
  return studyResource.save(data);
}

export function postNewStudyFact(data) {
  return studiesResource.save(data);
}

export function getStudyDashboardDataFact(studyId) {
  return studyDashboardResource.get({
    studyId
  });
}

export function postStudyProductsFact(studyId, data) {
  return studiesPlatformsResource.update({
    studyId
  }, data);
}

export function postStudyLogoFact(studyId, data) {
  return studiesIconResource.save({
    studyId
  }, data);
}

export function postStudyIconFact(studyId, data) {
  return studiesIconResource.save({
    studyId
  }, data);
}

export function deleteStudyLogoFact(studyId, type) {
  return studiesIconResource.delete({
    studyId,
    type
  });
}

export function deleteStudyIconFact(studyId, type) {
  return studiesIconResource.delete({
    studyId,
    type
  });
}

export function postStudyOnboardingFact(studyId, data) {
  return studiesOnboardingResource.update({
    studyId
  }, data);
}

export function postWelcomeScreenFact(studyId, data) {
  return studiesWelcomeScreensResource.save({
    studyId
  }, data);
}

export function updateWelcomeScreenFact(studyId, screenId, data) {
  return studiesWelcomeScreensResource.update({
    studyId,
    screenId
  }, data);
}

export function updateWelcomeScreenOrderFact(studyId, data) {
  return welcomeScreensArrangeResource.update({
    studyId
  }, data);
}

export function deleteWelcomeScreenFact(studyId, screenId) {
  return studiesWelcomeScreensResource.delete({
    studyId,
    screenId
  });
}

export function postStudyColorsFact(studyId, data) {
  return studiesColorsResource.update({
    studyId
  }, data);
}

export function postStudyBuildFact(studyId) {
  return studiesBuildResource.update({
    studyId
  }, {});
}

export function postEligibilityQuestionFact(studyId, data) {
  return eligibilityQuestionsResource.update({
    studyId
  }, data);
}

export function updateEligibilityQuestionFact(studyId, questionId, data) {
  return eligibilityQuestionsResource.update({
    studyId,
    questionId
  }, data);
}

export function deleteEligibilityQuestionFact(studyId, questionId) {
  return eligibilityQuestionsResource.delete({
    studyId,
    questionId
  });
}

export function postLibraryFeaturesFact(studyId, data) {
  return libraryFeaturesResource.update({
    studyId
  }, data);
}

export function getLibraryFeaturesFact(studyId) {
  return libraryFeaturesResource.get({
    studyId
  });
}

export function postSchedulingFact(studyId, schedulingObj) {
  return schedulingResource.update({
    studyId
  }, schedulingObj);
}

export function sendRegistrationDetailsFact(studyId, registrationObj) {
  return registrationResource.update({
    studyId
  }, registrationObj);
}

export function getStudyOveriviewFact(studyId) {
  return studyOverviewResource.get({
    studyId
  });
}

/* New study creation apis */
export function getAllClientsFact() {
  return clientsResource.get();
}

export function postSelectedActivitesFact(studyId, activitiesObj) {
  return activitiesResource.save({
    studyId
  }, activitiesObj);
}

export function getActivities() {
  return activitiesListResource.get({});
}

export function getSelectedActivitesFact(studyId) {
  return activitiesResource.get({
    studyId
  });
}

export function getDashboardActivitiesFact(studyId) {
  return dashbboardActivitiesResource.get({
    studyId
  });
}

export function updateSelectedActivitesFact(studyId, activityId, activitiesObj) {
  return activitiesResource.update({
    studyId,
    activityId
  }, activitiesObj);
}

export function updateDashboardActivityFact(studyId, activityId, activitiesObj) {
  return dashbboardActivitiesResource.update({
    studyId,
    activityId
  }, activitiesObj);
}

export function deleteSelectedActivitesFact(studyId, activityId) {
  return activitiesResource.delete({
    studyId,
    activityId
  });
}

export function getBrandingDetailsFact(studyId) {
  return studiesMetaResource.get({
    studyId
  });
}

export function getBrandingIconsFact(pageNum) {
  return studiesIconsResource.get({
    pageNum
  });
}

export function getBrandingLogosFact(pageNum) {
  return studiesLogosResource.get({
    pageNum
  });
}
export function getTemplateLogosFact(pageNum) {
  return surveyTemplateLogosResource.get({
    pageNum
  });
}


export function getConsentIconsFact(pageNum) {
  return studiesConsentIconsResource.get({
    pageNum
  });
}

export function uploadIconFromLibraryFact(studyId, data) {
  return studiesuploadIconResource.save({
    studyId
  }, data);
}

export function uploadLogoFromLibraryFact(studyId, data) {
  return studiesuploadLogoResource.save({
    studyId
  }, data);
}

export function getRegistrationFact(studyId) {
  return registrationResource.get({
    studyId
  });
}

export function getOnboardingFact(studyId) {
  return studiesWelcomeScreensResource.get({
    studyId
  });
}

export function getEligibilityFact(studyId) {
  return eligibilityQuestionsResource.get({
    studyId
  });
}

export function getLearnMoreDetailsFact(studyId) {
  return learnMoreResource.get({
    studyId
  }, {});
}

export function updatelearnMoreSectionsOrderFact(studyId, data) {
  return learnMoreSectionsOrderResource.update({
    studyId
  }, data);
}

export function updateFeedbackOrderFact(studyId, data) {
  return feedbackQuestionsOrderResource.update({
    studyId
  }, data);
}

export function addInfoScreenFact(studyId, screen) {
  return learnMoreSectionResource.save({
    studyId
  }, screen);
}

export function getInfoScreensFact(studyId) {
  return learnMoreSectionResource.get({
    studyId
  });
}

export function getInfoIconsLibrary(studyId, pageNum) {
  return learnMoreIconLibrary.get({
    studyId,
    pageNum
  });
}

export function getFeedbackIconsLibrary(studyId, pageNum) {
  return feedbackIconLibrary.get({
    studyId,
    pageNum
  });
}

export function updateInfoScreenFact(studyId, sectionId, screen) {
  return learnMoreSectionResource.save({
    studyId,
    sectionId
  }, screen);
}

export function deleteInfoScreenFact(studyId, sectionId) {
  return learnMoreSectionResource.delete({
    studyId,
    sectionId
  });
}

export function addFeedbackFact(studyId, feedbackData) {
  return learnMoreFeedbackResource.save({
    studyId
  }, feedbackData);
}

export function deleteFeedbackFact(studyId) {
  return learnMoreFeedbackResource.delete({
    studyId
  });
}

export function addFeedbackQuizFact(studyId, feedbackQuestions) {
  return learnMoreFeedbackQuizResource.save({
    studyId
  }, feedbackQuestions);
}

export function updateFeedbackQuizFact(studyId, questionId, feedbackQuestions) {
  return learnMoreFeedbackQuizResource.update({
    studyId,
    questionId
  }, feedbackQuestions);
}

export function deleteFeedbackQuizFact(studyId, questionId) {
  return learnMoreFeedbackQuizResource.delete({
    studyId,
    questionId
  });
}

export function downloadPrototypesFact(studyId, platform) {
  return downloadPrototypesResource.get({
    studyId,
    platform
  }, {});
}

export function exportParticipantDashboardFact(studyId, platform) {
  return exportParticipantDataResource.get({
    studyId,
    platform
  }, {});
}

export function postFeedbackDataFact(data) {
  return studiesFeedbackResource.save(data);
}

export function getAllValidicFact(studyId, search, sortOrder, sortValue, filter, pageSize, pageNum) {
  return validicResource.get({
    studyId, search, sortOrder, sortValue, filter, pageSize, pageNum
  }, {});
}

export function getValidicDeviceTypes(studyId) {
  return validicDeviceTypesResource.get({
    studyId
  }, {});
}

export function postValidicFact(studyId, data) {
  return validicResource.save({
    studyId
  }, data);
}

export function studyApprovalFact(studyId, isInternalOrganizationalApproved, isIrbEcApproved) {
  return studyApprovalResource.save({
    studyId,
    isInternalOrganizationalApproved,
    isIrbEcApproved
  }, {}, ); //eslint-disable-line
}

export function downloadIrbFact(studyId) {
  return downloadIrbResource.get({
    studyId
  }, {}); //eslint-disable-line
}

export function generateIRBFact(studyId) {
  return generateIRBResource.get({
    studyId
  });
}

export function saveAndExitStudyFact(studyId, data) {
  return saveAndExitResource.update({
    studyId
  }, data);
}

export function saveAppDescriptionFact(studyId, data) {
  return appDescriptionResource.save({
    studyId
  }, data);
}

export function saveAppAvailabilityFact(studyId, data) {
  return appAvailabilityResource.save({
    studyId
  }, data);
}

export function getAppAvailabilityFact(studyId) {
  return appAvailabilityResource.get({
    studyId
  });
}

export function getAppDescriptionFact(studyId) {
  return appDescriptionResource.get({
    studyId
  });
}

export function saveMarketingDataFact(studyId, data) {
  return marketingDataResource.save({
    studyId
  }, data);
}

export function getMarketingDataFact(studyId) {
  return marketingDataResource.get({
    studyId
  });
}

export function getFeaturesStateFact(studyId) {
  return featuresStateResource.get({
    studyId
  });
}

export function emailIrbFact(studyId) {
  return emailIrbResource.get({
    studyId
  });
}

export function postEpicMychartFact(studyId, data) {
  return epicMyChartResource.save({
    studyId
  }, data);
}

export function getEpicMychartFact(studyId) {
  return epicMyChartResource.get({
    studyId
  });
}

export function deleteEpicMychartFact(studyId) {
  return epicMyChartResource.delete({
    studyId
  });
}

export function saveHealthAccessFact(studyId, data) {
  return healthDataAccessResource.update({
    studyId
  }, data);
}

export function getHealthAccessFact(studyId) {
  return healthDataAccessResource.get({
    studyId
  });
}

export function getPrototypeFact(studyId) {
  return prototypeResource.get({
    studyId
  });
}

export function savePrototypeFact(studyId, data) {
  return prototypeResource.update({
    studyId
  }, data);
}

export function getNotificationsFact(studyId) {
  return notificationResoure.get({
    studyId
  });
}

export function saveCustomNotificationFact(studyId, data) {
  return notificationResoure.save({
    studyId
  }, data);
}

export function updateCustomNotificationFact(studyId, notificationId, data) {
  return updateNotificationResoure.update({
    studyId,
    notificationId
  }, data);
}

export function deleteCustomNotificationFact(studyId, notificationId) {
  return updateNotificationResoure.delete({
    studyId,
    notificationId
  });
}

export function getTruClinicDetailsFact(studyId) {
  return getTruClinicDetailsResoure.get({
    studyId
  });
}

export function getTruClinicURLFact(studyId) {
  return truClinicURLResource.get({
    studyId
  });
}

export function getStudyDetailsFact(studyId) {
  return studyDetailsResource.get({
    studyId
  });
}

export function getStudyDetailsFactV2(studyId) {
  return studyDetailsResourceV2.get({
    studyId,
  });
}

export function getStudyTeamFact(studyId) {
  return studyTeamResource.get({
    studyId
  });
}

export function getToggleFeaturesFact(studyId) {
  return toggledFeaturesResource.get({
    studyId
  });
}

export function postStudyLaunchFact(studyId, data) {
  return studyLaunchResource.save({
    studyId
  }, data);
}

export function getStudyOveriviewV2Fact(studyId) {
  return studyOverviewResourceV2.get({
    studyId
  });
}

export function getFeaturesStateV2Fact(studyId) {
  return featuresStateV2Resource.get({
    studyId
  });
}

export function exportComplianceData(studyId) {
  return exportComplianceDataResource.get({
    studyId
  }, {});
}

export function getNotificationEmails(surveyId, studyId) {
  return getNotificationsEmail.get({
    surveyId,
    studyId
  });
}

export function addEmailForNotification(surveyId, data) {
  return getAddEmailForNotification.save({
    surveyId,
  }, data);
}

export function removeEmail(surveyId, data) {
  return removeNotificationEmail.delete({ surveyId}, data);
}

export function getSftpTransferStatus(studyId) {
  return getSftpTransferStatusResource.get({
    studyId
  });
}

export function saveSftpTransferDetails(studyId, data) {
  return saveSftpTransferDetailsResource.save({studyId}, data);
}

export function updateSftpTransferDetails(studyId,sftpId,data) {
  return updateSftpTransferDetailsResource.update({studyId,sftpId}, data);
} 

export function getConnectionDetails(studyId,sftpId) {
  return getConnectionDetailsResource.get({
    studyId, sftpId
  });
}

export function modifyTransfer(studyId,sftpId) {
  return modifyTransferResource.get({
    studyId, sftpId
  });
}

export function disconnectTransfer(studyId,sftpId) {
  return disconnectTransferResource.delete({
    studyId, sftpId
  });
}

export function transferNow(studyId,sftpId) {
  return transferNowResource.save({
    studyId, sftpId
  },{});
}

export function testSftpStatus(studyId,data) {
  return testSftpStatusResource.save({studyId},data);
}

export function retryConnection(studyId,sftpId) {
  return retryConnectionResource.update({
    studyId, sftpId
  },{});
}


export function getActivitiesFact(studyId) {
  return getActivitiesResource.get({studyId});
}

export function updateActivitiesFact(studyId,data) {
  return updateActivitiesResource.update({studyId}, data);
}

export function downloadStudyDataZip(token) {
  return downloadStudyDataZipFile.get({ token }, {});
}

export function getCountrySpecificStudyFeatures(studyId) {
  return countrySpecificFeature.get({ studyId });
}

export function updateCountrySpecificStudyFeatures(studyId, data) {
  return countrySpecificFeature.update({ studyId }, data);
}

export function getStudyLanguages(studyId) {
  return studyLanguageResource.get({ studyId });
}

export function saveStudyCustomDocuement(studyId, formData) {
  return studyCustomDocuementResource.save({ studyId }, formData);
}

export function getStudyCustomDocuements(studyId, siteId, pageNum, pageSize, sortValue, sortOrder) {
  return getStudyCustomDocuementResource.get({ studyId, siteId, pageNum, pageSize, sortValue, sortOrder });
}

export function statusChangeStudyCustomDocuement(studyId, documentId, document) {
  return statusChangeStudyDocuementResource.update({ studyId, documentId }, document);
}

export function getStudyDocuementDownload(studyId, documentId) {
  return studyDocuementDownloadResource.get({ studyId, documentId });
}