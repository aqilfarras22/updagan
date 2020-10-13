<template>
  <div class="appointment-container mb-20">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12">
        <div class="appointments">
          <div class="list-header pt-22 pb-18">
            <div class="row">
              <div class="col-lg-3">
                <strong>Appointments</strong>
                <span class="ml-10 last-updated">Last updated {{lastUpdateTime}}</span>
              </div>
              <div class="col-lg-4 text-right">
                <div class="weekly-navigation font-weight-bold">
                  <div v-if="!isLoadingAppointment">
                    <span @click="previousWeekList" class="fa fa-chevron-left"></span>

                    <span class="week-date ml-12 mr-12">{{weekDateString}}</span>

                    <span @click="nextWeekList" class="fa fa-chevron-right"></span>
                  </div>
                  <div v-if="isLoadingAppointment">Loading...</div>
                </div>
              </div>
              <div class="col-lg-5 text-right">
                <router-link
                 v-if="!canSiteDataLockAccess"
                  tag="button"
                  class="btn btn-outline-primary btn-sm ml-auto availability-btn"
                  :to="{ name: 'telehealth-availability'}"
                >Availability</router-link>
                <button
                 v-if="!canSiteDataLockAccess"
                  type="button"
                  class="btn btn-success new-video-call-btn ml-12"
                  @click="showParticipantModal"
                  :disabled="getVideoCallStatus"
                >New video call</button>
              </div>
            </div>
          </div>

          <!-- <div class="search-box paddings d-none">
            <div>
              <strong>Appointments</strong>
              <span class="ml-10 last-updated">Last updated {{lastUpdateTime}}</span>
              <router-link
                tag="button"
                class="btn btn-outline-primary btn-sm ml-auto availability-btn float-right"
                :to="{ name: 'telehealth-availability'}"
              >Availability</router-link>
            </div>
            <b-row class="mt-20">
              <b-col cols="12" class="p-0 has-search">
                <span class="fa fa-search form-control-feedback"></span>
                <input
                  type="text"
                  class="form-control input-lg br-3 search-field"
                  placeholder="Search IDs, appointment name"
                  v-model="searchTerm"
                  @input="typing = true"
                >
              </b-col>
            </b-row>
          </div>
          <div class="scroll-up">Scroll up for past appointments</div>-->

          <div class="appointment-lists" v-if="appointmentList.length>0">
            <fieldset v-for="(appointments, index) in appointmentList" :key="index">
              <span
                :id="appointments.date.replace(/ /g, '')"
                class="date-legend"
              >{{checkIsToday(appointments.date)}}{{appointments.date}}</span>
              <div
                class="media appointment-details"
                :class="[appointment.status.toLowerCase(), appointment.type, `${appointment.visitType.toLowerCase()}-visit`]"
                v-for="(appointment, aIndex) in appointments.appointments"
                :key="aIndex"
                :id="appointment.id"
              >
                <span class="align-self-center visit-type-icon" :class="(appointment.status=='NotStarted' && appointment.type =='scheduled' && hasCallTimePassed(appointment)) ? 'call-time-passed':''"></span>
                <span
                  class="align-self-center status-icon mr-4"
                  :class="(getVideoCallStatus && (getInProgressCallId()==appointment.id)) ?'call-in-progress':''"
                ></span>
                <div class="media-body">
                  <div><strong>{{appointment.visitType}}</strong></div>
                  <div
                    v-if="appointment.participantName"
                  >Participant name: {{appointment.participantName}}</div>
                  <div v-if="isEligibleForPPR">
                    THREAD ID:
                    <router-link
                      :to="{ name: 'participant-profile', params: {participantId :appointment.threadID }}"
                    >{{appointment.threadID}}</router-link>
                  </div>
                  <div v-if="!isEligibleForPPR">
                    THREAD ID:
                    <router-link
                      :to="{ name: 'study-participant-details', params: {participantId :appointment.threadID }}"
                    >{{appointment.threadID}}</router-link>
                  </div>
                  <div>
                    Participant ID:
                    <span
                      class="user-definied-pID"
                      v-if="!appointment.participantId"
                    >None</span>
                    <span class="user-definied-pID" else>{{appointment.participantId}}</span>
                  </div>
                  <div class="appointment-name">Appointment name: {{appointment.name}}</div>
                  <div v-if="appointment.isRescheduled" class="appointment-name">Rescheduled: Yes</div>
                  <div
                    v-if="!getVideoCallStatus && appointment.type=='scheduled' && appointment.status=='NotStarted' && showJoinCallBtn(appointment) && appointment.visitType.toLowerCase()=='telehealth'"
                    class="mt-5"
                  >
                    <button
                      @click="startVideoCall(appointment)"
                      type="button"
                      class="btn btn-success join-call"
                    >Join call</button>
                  </div>
                </div>
                <span v-if="canUpdateAppointmentStatus() && appointment.visitType.toLowerCase()=='in-person'" class="inperson-status-dropdown align-self-center mr-20">
                  <select class="form-control" v-model="appointment.status" @change="updateAppointmentStatus(appointment.id, appointment.status)">
                    <option value="NotStarted" disabled>Scheduled</option>
                    <option value="Cancelled" disabled>Cancelled</option>
                    <option value="Complete">Complete</option>
                    <option value="Missed">Missed</option>
                  </select>
                </span>
                <span class="align-self-center ml-12 time">{{appointment.time}}</span>
              </div>
            </fieldset>
          </div>
          <div
            v-else
            class="text-muted align-self-center p-20 text-center response-msg"
          >{{responseListMsg}}</div>
        </div>
      </div>
      <!-- <div class="col-sm-12 col-md-5 col-lg-5">
        <div class="appointments calendar-view">
          <div class="d-flex align-items-center paddings calendar-header">
            <span>
              <strong>17 Feb – 23 Feb 2019</strong>
            </span>
            <router-link
              tag="button"
              class="btn btn-outline-primary btn-sm ml-auto availability-btn"
              :to="{ name: 'telehealth-availability'}"
            >Availability</router-link>
          </div>
          <div class="calendar align-self-center p-20 text-center">
            <strong class="text-muted">CALENDAR</strong>
          </div>
        </div>
      </div>-->
    </div>

    <participantsModal ref="participantsModal"></participantsModal>
  </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import toastr from "toastr";
import { AclRule } from 'vue-acl';
import { mapGetters } from "vuex";
import { PI, SUB_PI, STUDY_COORDINATOR, SITEDATALOCK } from '@/constants/authRoles';
import participantsModal from "./participants-modal";

export default {
  name: "tele-health-appointments",
  components: { participantsModal },
  data() {
    return {
      studyId: this.$route.params.studyId,
      appointmentList: [],
      searchTerm: "",
      lastUpdated: moment(),
      lastUpdateTime: "just now",
      lastUpdatedInterval: null,
      appointmentListRefreshInterval: null,
      responseListMsg: "Loading...",
      weekStartDate: moment()
        .utc()
        .startOf("week"),
      WeekEndDate: moment()
        .utc()
        .endOf("week"),
      typing: false,
      isLoadingAppointment: false,
      isCurrentWeek: true,
      appointmentListResponse: null,
      isEligibleForPPR: true
    };
  },
  watch: {
    /* searchTerm: _.debounce(function(v) {
      this.typing = false;
      this.getAppointments();
    }, 3000) */
    /* appointmentList() {
      if (!this.isCurrentWeek) {
        window.setTimeout(() => {
          this.scrollToAppointment();
        }, 2000);
      }
    }, */
    getVideoCallStatus(isCallInProgress) {
      var self = this;
      if (isCallInProgress) {
        if (self.isCurrentWeek) {
          //self.scrollToAppointment();
        } else {
          self.displayCurrentWeek();
        }
      }
    }
  },
  created() {
    this.calculateLastUpdated();

    window.setTimeout(() => {
      this.scrollToDate();
    }, 2000);
  },
  mounted() {
    //Load all the appointments from backend
    this.getAppointments();
    this.getToggledFeatures();

    //Look for the publisher/PI event has started call and reload the appointments
    this.$root.$on("publisherStreamStarted", () => {
      this.getAppointments();
    });

    //Look for the end call event and reload the appointments
    this.$root.$on("videoCallEnded", () => {
      localStorage.removeItem("thread-currentCallId");
      localStorage.removeItem("thread-inProgressCallId");
      this.getAppointments();
    });

    //Reload appointments every 90 seconds
    this.appointmentListRefreshInterval = window.setInterval(() => {
      this.getAppointments();
    }, 90000);
  },
  computed: {
    ...mapGetters(["user", "getVideoCallStatus"]),
    weekDateString() {
      let wsd = this.weekStartDate.format("DD MMM");
      let wed = this.WeekEndDate.format("DD MMM");
      let wy = this.WeekEndDate.format("YYYY");

      return `${wsd} - ${wed}, ${wy}`;
    },
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPiAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canScAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
   },
  },
  beforeDestroy() {
    clearInterval(this.lastUpdatedInterval);
    clearInterval(this.appointmentListRefreshInterval);
  },
  methods: {
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          let toggleFeatures = response.body.studyFeatures;
          toggleFeatures.forEach(feature => {
            if(feature.featureKey === "OLDPROFILEVIEW"){
              this.isEligibleForPPR = !feature.enabled;
            }
          });
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
             : "Error while getting features."
          );
        }
      );
    },
    calculateLastUpdated() {
      this.lastUpdatedInterval = setInterval(() => {
        let currentTime = moment().utc();
        let timeDiffInSec = currentTime.diff(this.lastUpdated, "seconds");
        if (timeDiffInSec <= 0) {
          this.lastUpdateTime = "just now";
        } else if (timeDiffInSec >= 60) {
          this.lastUpdateTime = "a minute ago";
        } else {
          this.lastUpdateTime = timeDiffInSec + " sec ago";
        }
      }, 3000);
    },
    showJoinCallBtn: function(appnt) {
      let now = moment();
      let apdate = moment(appnt.startTime);
      let appointmentEndtime = moment(appnt.endTime);
      //Do not show join call for past dates,compare it with call end duration
      if (appointmentEndtime.isBefore(now)) {
        return false;
      }

      let td = apdate.diff(now, "minutes", true);

      return td <= 5 ? true : false;
    },
    getAppointments() {
      const self = this;

      let siteId = this.user.siteIds ? this.user.siteIds[0] : null;
      let pId = this.user.id;

      let st = this.weekStartDate.format("DD MMM YYYY hh:mm A");
      let ed = this.WeekEndDate.format("DD MMM YYYY hh:mm A");

      var weekFrom = moment(st, "DD MMM YYYY hh:mm A").utc();
      var weekTo = moment(ed, "DD MMM YYYY hh:mm A").utc();

      this.$api
        .getTelehealthAppointmentList({
          siteId: siteId,
          pId: pId,
          startDate: weekFrom.valueOf(),
          endDate: weekTo.valueOf(),
          searchTerm: this.searchTerm,
          studyId: this.studyId
        })
        .then(
          response => {
            self.isLoadingAppointment = false;
            self.appointmentList = [];
            self.lastUpdated = moment();
            let responseObj = response.body;
            if (responseObj.length == 0) {
              self.responseListMsg = "No appointments.";
              return;
            }

            self.appointmentListResponse = responseObj;
            _.forEach(responseObj, function(element, i) {

              let appointmentDateObj = null;
              if (element.type == "Scheduled") {
                appointmentDateObj = moment(element.startTime);
              } else if (element.type == "Unscheduled") {
                appointmentDateObj = moment(element.appointmentDate);
              }
              let appointmentDatestr = appointmentDateObj.format("DD MMM YYYY");
              let threadIDStr = element.participantId;
              let participantIDStr = element.userDefineParticipantId;
              let appointmentNameStr = element.visitName
                ? element.visitName
                : element.type;

              let isRescheduledAppointment = false;
              let appointmentTimeStr = appointmentDateObj.format("hh:mm A");
              let statusStr = element.status;
              statusStr = statusStr.replace(/ /g, "");
              if (statusStr == "NotStarted" && element.visitType.toLowerCase()=="telehealth") {
                // So the list refresh every 90 sec and if the appointment duration(End Time) has passed and the list is not refreshed with latest status then show the missed status from Web UI
                let appointmentEndTimeObj = moment(element.endTime);
                statusStr = appointmentEndTimeObj.isBefore(moment())
                  ? "Missed"
                  : statusStr;
              } else if(statusStr.toLowerCase() == "reschedule"){
                isRescheduledAppointment = true;
                statusStr = "Cancelled";
              }

              let aObjIndex = _.findIndex(self.appointmentList, function(o) {
                return o.date == appointmentDatestr;
              });

              let appointmentDetailObject = {
                  threadID: threadIDStr,
                  participantId: participantIDStr,
                  name: appointmentNameStr,
                  time: appointmentTimeStr,
                  status: statusStr,
                  type: element.type.toLowerCase(),
                  appDateTime: element.appointmentDate,
                  id: element.id,
                  visitId: element.visitId,
                  startTime: element.startTime,
                  endTime: element.endTime,
                  isRescheduled: isRescheduledAppointment,
                  visitType: element.visitType
                };

              if (aObjIndex != -1) {
                self.appointmentList[aObjIndex].appointments.push(appointmentDetailObject);
              } else {
                self.appointmentList.push({
                  date: appointmentDatestr,
                  appointments: [
                    appointmentDetailObject
                  ]
                });
              }
            });

            self.$nextTick(function() {
              // DOM updated
              self.scrollToAppointment();
            });
          },
          error => {
            self.isLoadingAppointment = false;
            let errMsg = "Error while getting the appointment list!";
            self.responseListMsg = errMsg;
            toastr.error(
              error.body && error.body.message ? error.body.message : errMsg
            );
          }
        );
    },
    showParticipantModal() {
      this.$refs.participantsModal.show();
    },
    getParticipantID(threadID, pIndex, cIndex) {
      this.$api
        .getParticipantsListFact(this.studyId, 1, 1, threadID, "", "", "", "")
        .then(
          response => {
            if (response.body.totalParticipants > 0) {
              if (!response.body.participants[0].userDefinedParticipantId) {
                this.appointmentList[pIndex].appointments[
                  cIndex
                ].participantId = "Not Exists!";
              } else {
                this.appointmentList[pIndex].appointments[
                  cIndex
                ].participantId =
                  response.body.participants[0].userDefinedParticipantId;
              }
            }
          },
          error => {
            //this.searching = false;
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting participant ID."
            );
          }
        );
    },
    displayCurrentWeek() {
      this.weekStartDate = moment()
        .utc()
        .startOf("week");
      this.WeekEndDate = moment()
        .utc()
        .endOf("week");
      //Load the Appointments
      this.isCurrentWeek = true;
      this.getAppointments();
    },
    previousWeekList() {
      this.isCurrentWeek = false;
      this.isLoadingAppointment = true;

      let pw = this.weekStartDate.subtract(1, "days");

      this.weekStartDate = moment(pw)
        .utc()
        .startOf("week");
      this.WeekEndDate = moment(pw)
        .utc()
        .endOf("week");

      //Load the appointments
      this.getAppointments();
    },
    nextWeekList() {
      this.isCurrentWeek = false;
      this.isLoadingAppointment = true;

      let nw = this.WeekEndDate.add(1, "days");

      this.weekStartDate = moment(nw)
        .utc()
        .startOf("week");
      this.WeekEndDate = moment(nw)
        .utc()
        .endOf("week");

      //Load the appointments
      this.getAppointments();
    },
    startVideoCall(appointmentObject) {
      appointmentObject.studyId = this.studyId;
      this.$root.$emit("videoCallingInitiated", appointmentObject);
    },
    scrollToDate() {
      //CODE TO SCROLL TODAY
      let todaysDate = moment().format("DD MMM YYYY");
      let todayIndex = _.findIndex(this.appointmentList, function(o) {
        return o.date == todaysDate;
      });
      if (todayIndex != -1) {
        let t = todaysDate.replace(/ /g, "");

        var element = document.getElementById(t);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            inline: "nearest"
          });
        }
      }
    },
    scrollToAppointment() {
      if (this.isCurrentWeek) {
        let ccId = window.localStorage.getItem("thread-currentCallId");
        if (ccId) {
          var element = document.getElementById(ccId);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "nearest"
            });

            //set the Appointment id of the call being in progress in local storage
            localStorage.setItem("thread-inProgressCallId", ccId);

            localStorage.removeItem("thread-currentCallId");
          }
        }
      }
    },
    checkIsToday(date) {
      let todaysDate = moment().format("DD MMM YYYY");
      return moment(date).isSame(todaysDate) ? "Today " : "";
    },
    getInProgressCallId() {
      return localStorage.getItem("thread-inProgressCallId");
    },
    hasCallTimePassed(appnt){
      let now = moment();
      let appointmentEndtime = moment(appnt.endTime);
      //Do not show join call for past dates,compare it with call end duration
      if (appointmentEndtime.isBefore(now)) {
        return true;
      }
      else{
        return false;  
      }
      
    },
    updateAppointmentStatus(appointmentId, status){
      let appointmentObj = _.filter(this.appointmentListResponse, ['id', appointmentId]);
      appointmentObj = appointmentObj[0];
      appointmentObj.status = status;
      this.$api
        .updateTelehealthAppointmentStatus(appointmentObj)
        .then(
          response => {
            console.log(response);
          },
          error => {
            toastr.error(
              error.body && error.body.message ? error.body.message : "Error occurred while updating the status."
            );
          }
        );
    },
    canUpdateAppointmentStatus() {
      return (this.canPiAccess || this.canSubPiAccess || this.canScAccess );
    },
  }
};
</script>

<style scoped lang="scss">
.appointments {
  font-family: Lato-Regular;
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
  color: #4a4a4a;
  width: 100%;

  & .last-updated {
    font-size: 12px;
  }

  & .search-field {
    border: 1px solid #e4e8eb !important;
    height: 38px;
  }

  /* Bootstrap 4 text input with search icon */

  .has-search .form-control {
    padding-left: 2.375rem;
  }

  .has-search .form-control-feedback {
    position: absolute;
    z-index: 2;
    display: block;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
    text-align: center;
    pointer-events: none;
    color: #aaa;
  }

  .scroll-up {
    font-size: 12px;
    font-weight: bold;
    background-color: #f9f9fb;
    color: #b0bac9;
    padding: 8px 15px;
    border-top: 1px solid #e4e8eb;
    border-bottom: 1px solid #e4e8eb;
  }

  .paddings {
    padding: 20px;
  }

  .appointment-details {
    border-bottom: 1px solid #e4e8eb;
    padding: 15px 15px;
    position: relative;
  }

  /* fieldset .appointment-details:first-of-type {
    padding-top: 30px;
  }
*/
  fieldset .appointment-details:last-of-type {
    padding-bottom: 30px;
  }

  .appointment-details.unscheduled .appointment-name {
    color: #f0ad4e;
  }

  .status-icon {
    min-width: 4.1%;
  }

  .complete .status-icon {
    background: url("/static/img/telehealth/Telehealth_status_complete.png") no-repeat center center;
    min-height: 15px;
    width: 15px;
  }

  .cancelled .status-icon {
    background: url("/static/img/telehealth/Telehealth_status_canceled.png") no-repeat center center;
    min-height: 15px;
    width: 15px;
  }

  .missed .status-icon {
    background: url("/static/img/telehealth/Telehealth_status_missed.png") no-repeat center center;
    min-height: 15px;
    width: 15px;
  }

  .notstarted .status-icon.call-in-progress,
  .inprogress .status-icon.call-in-progress,
  .initiated .status-icon.call-in-progress
   {
    background: url("/static/img/telehealth/call-in-progress.png") no-repeat center;
    min-height: 5vh;
    width: 4%;
  }

  //Visit Type Icon CSS
  .visit-type-icon {
    position: absolute;
    min-width: 4%;
    top: 19px;
  }

  //---------Telehealth Visit type--------
  .telehealth-visit{
    .visit-type-icon {
      top:17px;
    }
  }
  .notstarted.telehealth-visit .visit-type-icon,
  .inprogress.telehealth-visit .visit-type-icon,
  .initiated.telehealth-visit .visit-type-icon
   {
    background: url("/static/img/telehealth/telehealth_comingUp.png") no-repeat center;
    min-height: 25px;
    min-width: 4.1%;
  }

  .complete.telehealth-visit .visit-type-icon {
    background: url("/static/img/telehealth/telehealth_complete.png") no-repeat center;
    min-height: 25px;
    min-width: 4.1%;
  }

  .missed.telehealth-visit .visit-type-icon, .cancelled.telehealth-visit .visit-type-icon {
    background: url("/static/img/telehealth/telehealth_missed.png") no-repeat center;
    min-height: 25px;
    min-width: 4.1%;
  }
  //---------Telehealth Visit type Ends--------

  //---------Inperson Visit type--------
  .notstarted.in-person-visit .visit-type-icon,
  .inprogress.in-person-visit .visit-type-icon,
  .initiated.in-person-visit .visit-type-icon
   {
    background: url("/static/img/telehealth/InPerson_comingUp.png") no-repeat center;
    width: 21px;
    min-height: 21px;
  }

  .complete.in-person-visit .visit-type-icon {
    background: url("/static/img/telehealth/InPerson_complete.png") no-repeat center;
    width: 21px;
    min-height: 21px;
  }

  .missed.in-person-visit .visit-type-icon, .cancelled.in-person-visit .visit-type-icon {
    background: url("/static/img/telehealth/InPerson_missed.png") no-repeat center;
    width: 21px;
    min-height: 21px;
  }

  .notstarted.in-person-visit .visit-type-icon.call-time-passed {
    background: url("/static/img/telehealth/InPerson_warning.png") no-repeat center;
    width: 21px;
    min-height: 21px;
  }

  .inperson-status-dropdown {
    position: relative;
    select {
      background-image: none;
      border-radius: 3px;
      box-shadow: inset 0 1px 2px 0 #e4e8eb;
      border: solid 1px #e4e8eb;
      padding: .5em;
      padding-right: 1.7em;
      position: absolute;
      right: 11%;
      top: -8px;
      width: 105px;
    }
    &:after{
      content: "\F107";
      font: normal normal normal 20px/1 FontAwesome;
      color: #1e8fe1;
      right: 7px;
      top: 0;
      height: 34px;
      padding: 0px 0px 0px 1px;
      position: relative;
      pointer-events: none;  
    }
  }
  //---------Inperson Visit type Ends--------

  .complete .time {
    color: #b0bac9;
  }

  fieldset {
    border: 0;
    border-top: 1px solid #f16559;
  }

  .list-header {
    border-bottom: solid 1px #e4e8eb;
  }
  .appointment-lists {
    z-index: 99;
    //position: fixed;
    //width: calc(100% - 281px);
    height: calc(100vh - 198px);
    background-color: #fff !important;
    //-webkit-transition: all 0.5s ease;
    //transition: all 0.5s ease;
    border-right: 1px solid #e3e8eb;
    /* border-left: 1px solid #e3e8eb; */
    overflow-y: auto;
  }

  /*  .appointment-lists.resize-width {
    // width: 52%;
  } */

  .appointment-lists fieldset:first-child {
    margin-top: 10px;
  }

  .date-legend {
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e4e8eb;
    background-color: #ffffff;
    padding: 1px 5px;
    font-size: 13px;
    font-weight: bold;
    color: #f16559;
    width: auto;
    margin-left: 25px;
    position: relative;
    top: -13px;
  }

  .join-call {
    background-color: #2ecd71;
    height: 34px;
    padding: 0.375rem 1.74rem;
    font-size: inherit;
  }

  .calendar-header {
    border-bottom: 1px solid #e4e8eb;
  }
  .availability-btn {
    padding: 0.29rem 0.97rem;
    font-size: 0.75rem;
    font-weight: bold;
    color: #1e8fe1;
    border-color: #1e8fe1;
  }
  .availability-btn:hover {
    background-color: #1e8fe1;
    color: #fff;
  }
  .user-definied-pID {
    color: #4a4a4a;
  }
  .new-video-call-btn {
    font-size: 14px;
    padding: 0.354rem 0.75rem;
  }
  /* .weekly-navigation {
    border-bottom: 1px solid #e4e8eb;
    padding: 10px 10px;
    font-weight: bold;
  } */
  .weekly-navigation .fa {
    color: #007bff;
    cursor: pointer;
  }
  .response-msg {
    height: -moz-calc(100vh - 198px);
    height: -webkit-calc(100vh - 198px);
    height: calc(100vh - 198px);
  }
}
</style>
