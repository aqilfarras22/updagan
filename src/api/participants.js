import Vue from 'vue';
import {
  API_ROOT,
  API_ROOT_V2,
  participantManagement,
  participants,
  importcsv,
  exportcsv,
  downloadtemplate,
  invite,
  search,
  verify,
  studies,
  resetPassword,
  sortparticipants,
  customlabels,
  customlabel,
  documents,
  requestsignature,
  eventhistory,
  piesignature,
  maildocument,
  userdefinedParticipantId,
  pagination,
  notInvited,
  multi,
  pushnotification,
  resetPasswordContent,
  responsemanagement,
  edc,
  studyManagement,
  users,
  blinded,
  resendVerify,
  site,
  team,
  participant,
  queryTool,
  tasks,
  study,
  milestones,
  milestone,
  completed,
  start,
  sites,
  document,
  notifications,
  notification,
  send,
  sent,
  participantlist
} from './urls';

const participantsResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const participantsResourceV2 = Vue.resource(
  `${API_ROOT_V2}${participantManagement}${studies}/${participants}{/participantId}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const userDefinedparticipantResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${userdefinedParticipantId}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantsSearchResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${search}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantImportResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${importcsv}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantExportResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${exportcsv}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantDownloadTemplateResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${downloadtemplate}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantsBatchInviteResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${invite}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantsVerifyResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${verify}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const participantForgotPasswordResource = Vue.resource(
  `${API_ROOT}${participantManagement}${participants}/${resetPassword}`,
);
const participantFilterResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${sortparticipants}`, {}, {
  update: {
    method: 'PUT'
  }
},
);
const customlabelsResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${customlabels}`, {},
);
const customlabelResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${customlabel}{/customId}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const documentsResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${documents}`,
);

const documentDetailsResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${documents}{/documentId}`,
);

const requestSignatureResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${documents}{/docId}/${requestsignature}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const documentHistoryResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${documents}{/docId}/${eventhistory}`,
);

const requestPISignatureResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${documents}{/docId}/${piesignature}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const sendMailResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}/${documents}{/docId}/${maildocument}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const participantsVerifyV2Resource = Vue.resource(
  `${API_ROOT_V2}${participantManagement}${studies}/${participants}/${verify}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const participantsPaginationResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${pagination}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const notInvitedParticipantsResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${notInvited}`, {},
);

const addParticipantListResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${multi}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const notifyParticipantTeleCall = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${pushnotification}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const getResetPasswordKeys = Vue.resource(
  `${API_ROOT}${participantManagement}${participants}/${resetPasswordContent}{/languageId}{/token}`, {}, {
  update: {
    method: 'PUT'
  }
},
);

const milestoneDetail = Vue.resource(
  `${API_ROOT}${responsemanagement}${participant}/${milestone}/${completed}`, {}, {
  update: {
    method: 'PUT'
    }
  },
);

const participantDetail = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}{/studyId}/${participant}{/participantId}/${milestones}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);
const setDayZeroForParticipant = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}{/studyId}/${participants}{/participantId}/${start}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const getParticipantTaskInPagination = Vue.resource(
  `${API_ROOT}${queryTool}/${participant}{/pId}/${tasks}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const verificationResource = Vue.resource(
  `${API_ROOT_V2}${participantManagement}${studies}/${participants}{/participantId}/${resendVerify}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const getSiteTeamTaskInPagination = Vue.resource(
  `${API_ROOT}${edc}/${participant}{/pId}/${study}{/studyId}/${site}/${team}/${tasks}/${pagination}`, {}, {
    update: {
      method: 'PUT'
    }
  },
);

const blindedVerifyResource = Vue.resource(
  `${API_ROOT}${studyManagement}${users}/${blinded}`,
);

const studyParticipantDocuementResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}{/studyId}/${sites}{/siteId}/${participant}{/participantId}/${document}`, {}, {
    update: {
      method: 'PUT'
    }
  }
);

const sentMessagesResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${notifications}/${study}{/studyId}/${site}{/siteId}`, {}
);

const postMessagesResource = Vue.resource(`${API_ROOT}${participantManagement}${studies}/${participants}/${send}/${notification}`, {});

const notificationRecipientResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}/${notification}/${sent}/${participantlist}{/notificationId}`, {}
);

export function participantTaks(studyId, pId, data, status, viewAllTask, isTelehealthEnabled) {
  let obj = {
    studyId: studyId,
    participantCurrentDay: data.participantCurrentDay,
    pId: pId,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize,
    totalRecords: data.totalRecords,
    totalPage: data.totalPage,
    type: data.type,
    status: status,
    startDay: data.startDay,
    endDay: data.endDay,
    milestoneId: data.milestoneId,
    telehealth: isTelehealthEnabled
  };
  // if study is having milestone or no milestone it willr efelct the same query param.
  if(viewAllTask) {
    obj.startDay = undefined;
    obj.endDay = undefined;
    obj.milestoneId = undefined;
  }
  return getParticipantTaskInPagination.get(obj);
}

export function getUnschedulePktsInfo(participantId, startDate, endDate, studyId) {
  return getUnschedulePkts.get({startDate: startDate, endDate: endDate,  participantId: participantId, studyId: studyId});
}

export function participantsMilestonsDetail(studyId, participantId, milestoneList, participantCurrentDay, status, isTelehealthEnabled) {
  return milestoneDetail.save(
    {studyId, participantId, participantCurrentDay, status, telehealth: isTelehealthEnabled},
    {participantMileStoneList: milestoneList.participantMileStoneList}
  );
}

export function participantEDCFormData(pId, startDay, endDay, studyId, data, status, viewAllTask) {
  let obj = {
    studyId: studyId,
    participantCurrentDay: data.participantCurrentDay,
    pId: pId,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize,
    totalRecords: data.totalRecords,
    totalPage: data.totalPage,
    status: status,
    startDay: startDay,
    endDay: endDay,
    milestoneId: data.milestoneId
  };
  if(viewAllTask) {
    obj.startDay = 0;
    obj.milestoneId = undefined;
    if(status == 'WITHDRAWSTUDY' || status == 'DISQUALIFIED') {
      obj.startDay = undefined;
      obj.endDay = data.maxDay;
      obj.milestoneId = undefined
    }
  }
  return getSiteTeamTaskInPagination.get(obj);
}
export function participantFullDetail(studyId, participantId, isTelehealthEnabled) {
  return participantDetail.get({studyId: studyId, participantId: participantId, telehealth: isTelehealthEnabled});
}

export function triggerParticipantDayZero(data) {
  return setDayZeroForParticipant.save(
    {participantId: data.participantId, studyId: data.studyId},
    {participantId: data.participantId, studyId: data.studyId, triggeredBy: data.triggeredBy}
  );
}
export function resetPasswordKey(languageId, token) {
  return getResetPasswordKeys.get({ languageId, token });
}

export function getAllParticipantsFact(studyId) {
  return participantsResource.get({
    studyId
  });
}

export function participantSearchFilterFact(studyId, searchQuery, sort, filter) {
  return participantFilterResource.get({
    studyId,
    search: searchQuery,
    sort,
    filter
  });
}

export function getParticipantDataFact(studyId, participantId) {
  return participantsResource.get({
    studyId,
    participantId
  });
}

export function getParticipantDataFactV2(studyId, participantId) {
  return participantsResourceV2.get({
    studyId,
    participantId
  });
}

export function importParticipantDataFact(studyId, data) {
  return participantImportResource.save({
    studyId
  }, data);
}

export function exportParticipantDataFact(studyId) {
  return participantExportResource.get({
    studyId
  });
}
export function downloadTemplateParticipantDataFact(studyId) {
  return participantDownloadTemplateResource.get({
    studyId
  });
}

export function addNewParticipantInfoFact(studyId, data) {
  return participantsResource.save({
    studyId
  }, data);
}
export function updateParticipantInfoFact({
  studyId,
  participantId,
  data
}) {
  return participantsResource.update({
    studyId,
    participantId
  }, data);
}
export function updateParticipantIdFact({
  studyId,
  participantId,
  data
}) {
  return userDefinedparticipantResource.update({
    participantId,
    studyId
  }, data);
}

export function batchInviteInfoFact(studyId, data) {
  return participantsBatchInviteResource.update({
    studyId
  }, data);
}

export function verifyParticipantDataFact(studyId, token, email) {
  return participantsVerifyResource.get({
    studyId,
    token,
    email
  });
}

export function verifyParticipantV2DataFact(studyId, token, email) {
  return participantsVerifyV2Resource.get({
    studyId,
    token,
    email
  });
}

export function searchParticipantsFact(studyId, searchTerm) {
  return participantsSearchResource.get({
    studyId,
    email: searchTerm
  });
}

export function participantForgotPasswordFact(data) {
  return participantForgotPasswordResource.save(data);
}

export function getLabelsFact(studyId) {
  return customlabelsResource.get({
    studyId
  });
}

export function addNewLabelFact(studyId, data) {
  return customlabelsResource.save({
    studyId
  }, data);
}

export function updateNewLabelFact(studyId, labelId, data) {
  return customlabelResource.update({
    studyId,
    customId: labelId
  }, data);
}

export function deleteNewLabelFact(studyId, labelId) {
  return customlabelResource.delete({
    studyId,
    customId: labelId
  });
}

export function addNewLabelValueFact({
  studyId,
  participantId,
  data
}) {
  return participantsResource.update({
    studyId,
    participantId
  }, data);
}

export function documentsListFact({
  studyId,
  participantId
}) {
  return documentsResource.get({
    studyId,
    participantId
  });
}

export function getDocumentDetailsFact({
  studyId,
  participantId,
  documentId
}) {
  return documentDetailsResource.get({
    studyId,
    participantId,
    documentId
  });
}

export function requestSignatureFact({
  studyId,
  participantId,
  docId,
  reqSignDate
}) {
  return requestSignatureResource.save({
    studyId,
    participantId,
    docId,
    reqSignDate
  }, {});
}

export function documentHistoryFact({
  studyId,
  participantId,
  docId
}) {
  return documentHistoryResource.get({
    studyId,
    participantId,
    docId
  });
}

export function requestPISignatureFact({
  studyId,
  participantId,
  docId,
  data
}) {
  return requestPISignatureResource.save({
    studyId,
    participantId,
    docId
  }, data);
}

export function sendMailFact({
  studyId,
  participantId,
  docId,
  data
}) {
  return sendMailResource.save({
    studyId,
    participantId,
    docId
  }, data);
}

export function getParticipantsListFact(studyId, pageSize, pageNum, search, filter, sortValue, sortOrder, customKey, sourcefilter, withdrawnOrFailedFilter, includeVerified = false, isTelehealthSearch = false) {
  return participantsPaginationResource.get({
    studyId,
    pageSize,
    pageNum,
    search,
    filter,
    sortValue,
    sortOrder,
    customKey,
    sourcefilter,
    withdrawnOrFailedFilter,
    includeVerified,
    isTelehealthSearch
  });
}

export function getNotInvitedParticipantsFact(studyId) {
  return notInvitedParticipantsResource.get({
    studyId
  });
}

export function addParticipantListFact(studyId, sendInvite, data) {
  return addParticipantListResource.save({
    studyId,
    sendInvite
  }, data);
}

export function notifyParticipantForTelehealthCall(data) {
  return notifyParticipantTeleCall.save({
    studyId: data.studyId,
    participantId: data.participantId,
    appointmentId: data.appointmentId,
    message: data.message
  }, {});
}

export function getBlindedRole() {
  return blindedVerifyResource.get();
}
export function resendVerificationFact({
  studyId,
  participantId,

}) {
  return verificationResource.update({
    studyId,
    participantId
  },{});
}

export function saveStudyParticipantDocuement(studyId, siteId, participantId, formData) {
  return studyParticipantDocuementResource.save({ studyId, siteId, participantId }, formData);
}

export function getSentMessagesList(pathParams, queryParams) {
  return sentMessagesResource.get({ ...pathParams, ...queryParams });
}

export function sendMessagesToParticipants(queryParams, postData) {
  return postMessagesResource.save(queryParams, postData);
}

export function getNotificationRecipientList(pathParams, queryParams) {
  return notificationRecipientResource.get({ ...pathParams, ...queryParams });
}