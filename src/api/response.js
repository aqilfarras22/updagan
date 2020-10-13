import Vue from "vue";
import {
  API_ROOT,
  API_ROOT_V2,
  responsemanagement,
  unscheduledAppointment,
  appointmentCancel,
  pi,
  studies,
  participantManagement,
  participants,
  piAppointment,
  telehealth2,
  appointment,
  startvideocall,
  updatecallstarttime,
  setting,
  site,
  availability,
  recurring,
  recurringConfiguration
} from "./urls";

const appointmentResource = Vue.resource(
  `${API_ROOT}${responsemanagement}${unscheduledAppointment}/${pi}`, {}
);

const cancelAppointmentResource = Vue.resource(
  `${API_ROOT}${responsemanagement}${appointmentCancel}/${pi}`, {}
);

const disqualifyParticipantResource = Vue.resource(
  `${API_ROOT}${participantManagement}${studies}/${participants}{/participantId}`, {}, {
    update: {
      method: "PUT"
    }
  }
);

const getAppointmentResource = Vue.resource(
  `${API_ROOT}${responsemanagement}${piAppointment}`, {}
);

const getVideoCallKeys = Vue.resource(
  `${API_ROOT_V2}${responsemanagement}${telehealth2}/${appointment}/${startvideocall}`, {
    update: {
      method: "PUT"
    }
  }
);

const updateCallTime = Vue.resource(
  `${API_ROOT_V2}${responsemanagement}${telehealth2}/${updatecallstarttime}`, {
    update: {
      method: "PUT"
    }
  }
);

const saveAppointmentAvailability = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${site}{/siteID}/${availability}`, {
    update: {
      method: "PUT"
    }
  }
);

const saveRecurringAppointmentAvailability = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${site}{/siteID}/${availability}/${recurring}`, {}, {
    update: {
      method: 'PUT'
    }
  }
);

const deleteAppointmentAvailability = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${site}{/siteID}/${availability}`, {
    update: {
      method: "PUT"
    }
  }
);

const getAppointmentAvailabilityList = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${site}{/siteID}/${availability}`, {}
);


const getAppointmentsForTelehealth = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${appointment}/${pi}`);

const saveTelehealthAppointmentSetting = Vue.resource(
  `${API_ROOT}${responsemanagement}${site}/${setting}`, {}, { update: { method: 'PUT' } },
);

const getTelehealthAppointmentSetting = Vue.resource(
  `${API_ROOT}${responsemanagement}${site}/${setting}`
);


const getRecurringAvailabilityDetail = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${site}{/siteID}/${availability}/${recurringConfiguration}`
);

const deleteRecurringAppointmentAvailability = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${site}{/siteID}/${availability}/${recurring}`
);

const updateTelehealthAppointmentStatusResource = Vue.resource(
  `${API_ROOT}${responsemanagement}${telehealth2}/${appointment}{/appointmentId}`, {}, { update: { method: 'PUT' } },
);

export function appointmentFact(participantId, data) {
  return appointmentResource.save({
    pId: participantId
  }, data);
}

export function cancelAppointmentFact(participantId, data) {
  return cancelAppointmentResource.save({
    pId: participantId
  }, data);
}

export function disqualifyFact(participantId, studyID, data) {
  return disqualifyParticipantResource.update({
    studyId: studyID,
    participantId
  },
    data
  );
}

export function getAppointmentDetailsFact(participantId) {
  return getAppointmentResource.get({
    pId: participantId
  });
}

export function getVideoCallSession(queryParams, data) {
  let queryString = {
    pId: queryParams.pid,
    offset: queryParams.offset,
    appointmentId: queryParams.appointmentId,
    deviceRegistrationStatus: queryParams.deviceRegistrationStatus
  };
  if (queryParams.deviceRegistrationStatus!=undefined){
    queryString.deviceRegistrationStatus = queryParams.deviceRegistrationStatus;
  }
  return getVideoCallKeys.save(queryString,
    data
  );
}

export function updateTelehealthCallStartTime(sessId, callStTime, pId) {
  return updateCallTime.save({
    pId: pId,
    telehealthSessionId: sessId,
    callStartTime: callStTime
  }, {});
}

export function saveTelehealthAvailability(data) {
  let siteID = data.siteId;
  return saveAppointmentAvailability.save({
    siteID,
    pId: data.piId
  }, data);
}

export function saveTelehealthRecurringAvailability(data) {
  let siteID = data.siteId;
  return saveRecurringAppointmentAvailability.save({
    siteID,
    pId: data.piId
  }, data);
}

export function updateTelehealthAvailability(data) {
  let siteID = data.siteId;
  return saveAppointmentAvailability.update({
    siteID,
    id: data.id,
    pId: data.piId
  }, data);
}

export function updateTelehealthRecurringAvailability(data) {
  let siteID = data.siteId;
  return saveRecurringAppointmentAvailability.update({
    siteID,
    id: data.id,
    pId: data.piId
  }, data);
}

export function deleteTelehealthAvailability(data) {
  let siteID = data.siteId;
  return deleteAppointmentAvailability.delete({
    siteID,
    id: data.id,
    pId: data.piId
  });
}

export function getTelehealthAvailabilityList(data) {
  let siteID = data.siteId;
  return getAppointmentAvailabilityList.get({
    siteID,
    pId: data.pId,
    startDate: data.startDate,
    endDate: data.endDate,
    siteId: data.siteId
  });
}

export function getTelehealthAppointmentList(data) {

  let getParams = {
    siteId: data.siteId,
    pId: data.pId,
    studyId: data.studyId
  }

  //Get appointments for particular Participant
  if (data.participantId) {
    getParams.userId = data.participantId;
  } else {
    getParams = { ...getParams, ...{ startDate: data.startDate, endDate: data.endDate } }
  }

  return getAppointmentsForTelehealth.get(getParams);
}

export function saveTelehealthSettings(data) {
  return saveTelehealthAppointmentSetting.save({
    pId: data.piId
  },
    data
  );
}

export function getTelehealthSettings(data) {
  return getTelehealthAppointmentSetting.get({
    pId: data.pId,
    siteId: data.siteId,
  });
}

export function getTelehealthRecurringAvailabilityDetail(data) {
  let siteID = data.siteId;
  return getRecurringAvailabilityDetail.get({
    siteID,
    id: data.id,
    pId: data.piId
  });
}

export function deleteTelehealthRecurringAvailability(data) {
  let siteID = data.siteId;
  return deleteRecurringAppointmentAvailability.delete({
    siteID,
    id: data.id,
    pId: data.piId
  });
}

export function updateTelehealthAppointmentStatus(data) {
  let appointmentId = data.id;
  return updateTelehealthAppointmentStatusResource.update({
    appointmentId
  },
    data
  );
}