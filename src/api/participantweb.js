import Vue from 'vue';
import {
  // API_ROOT,
  API_PARTICIPANT_WEB_ROOT,
  studies,
  participantweb,
  homepage,
  bodysection,
  calloutimage,
  setCalloutImage,
  featureimage,
  globalelements,
  sponsorlogo,
  studylogo,
  agreement,
  eligibility,
  question,
  registration,
  registrationform,
  studysite,
  participantWeb,
  publishsettings,
  validate,
  eligibilityAnswers,
  updateStatus,
  participant,
  publish,
  preview,
  publishstatus,
  publishurl,
  statusCount,
  version
} from './urls';

//const API_PARTICIPANT_WEB_ROOT = "https://us-east-1-dev-web.styx.threadresearch.com/api/v1/"

const getParticipantWebGlobalElementsResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${globalelements}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebHomePageResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${homepage}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebHomePageBodyResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${homepage}/${bodysection}{/index}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const addParticipantWebHomePageBodyResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${homepage}/${bodysection}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebAgreementResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${agreement}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebEligibilityResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${eligibility}`, {}, {
  update: {
    method: 'PUT'
  }
},
);


const addParticipantWebEligibilityQuestionResourece = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${eligibility}/${question}`, {}, {
  update: {
    method: 'PUT'    
  }
},
);

const updateParticipantWebEligibilityQuestionResourece = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${eligibility}/${question}`, {}, {
  update: {
    method: 'PUT'    
  }
},
);

const deleteParticipantWebEligibilityQuestionResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${eligibility}/${question}`, {}, {
  update: {
    method: 'PUT'    
  }
},
);

const getParticipantWebRegistrationResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${registration}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebRegistrationFormResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${registrationform}`, {}, {
  update: {
    method: 'PUT'
  }
},
);


const createParticipantWebRegistrationFormResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${registrationform}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebAddSitesResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${registration}/${studysite}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const createParticipantWebAddSitesResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${registration}/${studysite}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const uploadCalloutImageResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${calloutimage}{/index}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const uploadCalloutIconResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${setCalloutImage}{/index}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const uploadFeatureImageResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${featureimage}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const uploadSponsorLogoResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${sponsorlogo}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getSponsorLogoResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${sponsorlogo}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getStudyLogoResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${studylogo}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const uploadStudyLogoResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${studylogo}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const createParticipantWebCustomDomainResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${publishsettings}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebCustomDomainResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${publishsettings}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebcheckConfiguratorResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${validate}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebeligibilityAnswersResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participant}/{participantId}${eligibilityAnswers}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const postUpatedScreeningStatusResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${updateStatus}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const postPublishTheSiteResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${publish}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const postPreviewTheSiteResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${preview}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getParticipantWebPublishStatusResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}{/version}{/createdBy}/${participantweb}/${publishstatus}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getPublishedURLResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}{/version}/${participantweb}/${publishurl}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getStatusCountResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${statusCount}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getPublishVersionResource = Vue.resource(
  `${API_PARTICIPANT_WEB_ROOT}${participantWeb}${studies}{/studyId}/${participantweb}/${version}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

export function getParticipantWebHomePage(studyId) {
  return getParticipantWebHomePageResource.get({
    studyId
  });
}

export function createParticipantWebHomePage(studyId, data) {
  return getParticipantWebHomePageResource.update({
    studyId
  }, data);
}

export function postParticipantWebHomePageBodySection(studyId, data) {
  return addParticipantWebHomePageBodyResource.save({
    studyId,
  }, data);
}

export function updateParticipantWebHomePageBodySection(studyId, index, data) {
  return getParticipantWebHomePageBodyResource.update({
    studyId, index
  }, data);
}

export function deleteParticipantWebHomePageBodySection(studyId, index, data) {
  return getParticipantWebHomePageBodyResource.delete({
    studyId, index
  }, data);
}

export function uploadCalloutImage(studyId, index, data) {
  return uploadCalloutImageResource.save({
    studyId, index
  }, data);
}

export function uploadCalloutIcon(studyId, index, data) {
  return uploadCalloutIconResource.save({
    studyId, index
  }, data);
}

export function uploadFeatureImage(studyId, data) {
  return uploadFeatureImageResource.save({
    studyId
  }, data);
}

export function getParticipantWebGlobalElements(studyId) {
  return getParticipantWebGlobalElementsResource.get({
    studyId
  });
}

export function createParticipantWebGlobalElements(studyId, data) {
  return getParticipantWebGlobalElementsResource.update({
    studyId
  }, data);
}

export function uploadSponsorLogo(studyId, data) {
  return uploadSponsorLogoResource.save({
    studyId
  }, data);
}

export function uploadStudyLogo(studyId, data) {
  return uploadStudyLogoResource.save({
    studyId
  }, data);
}

export function deleteSponsorLogo(studyId, data) {
  return getSponsorLogoResource.delete({
    studyId,
  }, data);
}

export function getParticipantWebAgreement(studyId) {
  return getParticipantWebAgreementResource.get({
    studyId
  });
}

export function createParticipantWebAgreement(studyId, data) {
  return getParticipantWebAgreementResource.update({
    studyId
  }, data);
}

export function getParticipantWebEligibility(studyId) {
  return getParticipantWebEligibilityResource.get({
    studyId
  });
}

export function createParticipantWebEligibility(studyId, data) {
  return getParticipantWebEligibilityResource.update({
    studyId
  }, data);
}

export function getParticipantWebRegistration(studyId) {
  return getParticipantWebRegistrationResource.get({
    studyId
  });
}

export function createParticipantWebRegistration(studyId, data) {
  return getParticipantWebRegistrationResource.update({
    studyId
  }, data);
}

export function getParticipantWebAddSites(studyId) {
  return getParticipantWebAddSitesResource.get({
    studyId
  });
}

export function createParticipantWebAddSites(studyId,data) {
  return createParticipantWebAddSitesResource.save({
    studyId
  },data);
}

export function addParticipantWebEligibilityQuestion(studyId, data) {
  return addParticipantWebEligibilityQuestionResourece.save({
    studyId
  }, data);
}

export function getParticipantWebRegistrationForm(studyId) {
  return getParticipantWebRegistrationFormResource.get({
    studyId
  });
}

export function createParticipantWebRegistrationForm(studyId,data) {
  return createParticipantWebRegistrationFormResource.save({
    studyId
  },data);
}

export function updateParticipantWebEligibilityQuestion(studyId, data) {
  return updateParticipantWebEligibilityQuestionResourece.update({
    studyId
  }, data);
}

export function deleteParticipantWebEligibilityQuestion(studyId, data) {
  return deleteParticipantWebEligibilityQuestionResource.delete({
    studyId
  }, data);
}

export function createParticipantWebCustomDomain(studyId, data) {
  return createParticipantWebCustomDomainResource.save({
    studyId
  }, data);
}

export function getParticipantWebCustomDomain(studyId) {
  return getParticipantWebCustomDomainResource.get({
    studyId
  });
}

export function getParticipantWebcheckConfigurator(studyId) {
  return getParticipantWebcheckConfiguratorResource.get({
    studyId
  });
}

export function getParticipantWebeligibilityAnswers(studyId, participantId) {
  return getParticipantWebeligibilityAnswersResource.get({
    studyId, participantId
  });
}

export function postUpatedScreeningStatus(studyId, data) {
  return postUpatedScreeningStatusResource.save({
    studyId
  }, data);
}

export function postPublishTheSite(studyId, data) {
  return postPublishTheSiteResource.save({
    studyId
  }, data);
}

export function postPreviewTheSite(studyId, data) {
  return postPreviewTheSiteResource.save({
    studyId
  }, data);
}

export function getParticipantWebPublishStatus(studyId, version, createdBy ) {
  return getParticipantWebPublishStatusResource.get({
    studyId,
    version,
    createdBy
  });
}


export function getPublishedURL(studyId,version) {
  return getPublishedURLResource.get({
    studyId,version
  });
}

export function getStatusCount(studyId) {
  return getStatusCountResource.get({
    studyId
  })
}

export function getPublishVerson(studyId) {
  return getPublishVersionResource.get({
    studyId
  })
}