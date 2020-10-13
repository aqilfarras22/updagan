<template>
  <div>
    <div class="row mb-20">
      <div class="col-sm-12 col-md-12 col-lg-12">
        <div class="th-breadcrumb">
          <strong>
            <router-link tag="a" class :to="{ name: 'telehealth-appointments'}">Telehealth</router-link>&nbsp;/ Availability
          </strong>
          <div class="status-legends pull-right d-none">
            <span class="mr-15">
              <span class="badge badge-success mr-3">&nbsp;</span> Completed
            </span>
            <span class="mr-15">
              <span class="badge badge-danger mr-3">&nbsp;</span> Missed
            </span>
            <span>
              <span class="badge badge-primary mr-3">&nbsp;</span> Scheduled
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="availability-container">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 pr-0">
          <!--col-sm-12 col-md-3 col-lg-4 pr-0 -->
          <div class="availability">
            <div class="pt-22 pb-18 ava-title">
              <div class="row">
                <div class="col-sm-1 col-md-1 col-lg-2 pl-23">
                  <strong>Availability</strong>
                </div>
                <div class="col-sm-9 col-md-9 col-lg-8 weekly-navigation text-center">
                  <div v-if="isLoadingAvailability">Loading...</div>
                  <div v-if="!isLoadingAvailability">
                    <span @click="previousWeekList" class="fa fa-chevron-left"></span>

                    <span class="week-date ml-12 mr-12">{{weekDateString}}</span>

                    <span @click="nextWeekList" class="fa fa-chevron-right"></span>
                  </div>
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2 text-right">
                  <button
                    class="btn btn-outline-primary btn-sm today-btn"
                    @click="displayCurrentWeek"
                  >Today</button>
                </div>
              </div>
            </div>
            <div class="availability-lists">
              <div class="btn-box">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm pull-left-"
                  @click="showAvailabilityModal"
                >
                  New
                  Availability
                </button>
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm setting-btn pull-right- ml-10"
                  @click="showSettingModal"
                >Settings</button>
              </div>
              <div class="clearfix"></div>
              <div v-if="availabilityList.length>0" class="ava-list-container">
                <div
                  class="availability-details"
                  :class="{disabled: availability.isDisabled}"
                  v-for="availability in availabilityList"
                  :key="availability.id"
                  v-on="!availability.isDisabled ? { click: () => editAvailability(availability) } : {}"
                >
                  <div>
                    <strong>{{availability.title}}</strong>
                  </div>
                  <div>{{availability.days}}</div>
                  <div>{{availability.time}}</div>
                  <div class="mt-5" v-if="availability.exclude">Exclude: {{availability.exclude}}</div>
                </div>
              </div>
              <div v-else class="response-msg">
                <div class="text-muted p-20 text-center align-middle">{{availabilityListRecordMsg}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="col-sm-12 col-md-9 col-lg-8 pl-0 d-none">
          <div class="availability calendar-view">
            <div class="p-16 calendar-header d-flex">
              <div class="row">
                <div class="col-md-10">
                  <div class="weekly-navigation pt-6 text-center">
                    <div v-if="isLoadingAvailability">Loading...</div>
                    <div v-if="!isLoadingAvailability">
                      <span @click="previousWeekList" class="fa fa-chevron-left"></span>

                      <span class="week-date ml-12 mr-12">{{weekDateString}}</span>

                      <span @click="nextWeekList" class="fa fa-chevron-right"></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <button
                    class="btn btn-outline-primary btn-sm ml-auto mr-auto today-btn"
                    @click="displayCurrentWeek"
                  >Today</button>
                </div>
              </div>
            </div>
            <div class="calendar align-self-center p-20 text-center">
              <strong class="text-muted">CALENDAR</strong>
            </div>
          </div>
        </div>-->
      </div>
    </div>
    <!--Add/Edit availability modal-->
    <availabilityModal
      ref="availabilityModal"
      @refreshList="refreshAvailabiliies"
      @resetAvailabilityData="resetAvailabilityDataObject"
      :availabilityData="editAvailabilityObj"
    />
    <settingsModal ref="settingModalPopup"></settingsModal>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import moment from "moment";
import { mapGetters } from "vuex";

import availabilityModal from "./availability-modal";
import settingsModal from "./settings-modal";

export default {
  name: "tele-health-availability",
  data() {
    return {
      studyId: this.$route.params.studyId,
      availabilityList: [],
      editAvailabilityObj: null,
      settingsDataObj: null,
      availabilityListRecordMsg: "Loading...",
      weekStartDate: moment()
        .utc()
        .startOf("week"),
      WeekEndDate: moment()
        .utc()
        .endOf("week"),
      isLoadingAvailability: false
    };
  },
  components: {
    availabilityModal,
    settingsModal
  },
  mounted() {
    //Load all the appointments from backend
    this.getAvailabilities();
  },
  computed: {
    ...mapGetters(["user"]),
    weekDateString() {
      let wsd = this.weekStartDate.format("DD MMM");
      let wed = this.WeekEndDate.format("DD MMM");
      let wy = this.WeekEndDate.format("YYYY");

      return `${wsd} - ${wed}, ${wy}`;
    }
  },
  methods: {
    getAvailabilities() {
      var self = this;
      self.isLoadingAvailability = true;

      let st = this.weekStartDate.format("DD MMM YYYY hh:mm A");
      let ed = this.WeekEndDate.format("DD MMM YYYY hh:mm A");

      var weekFrom = moment(st, "DD MMM YYYY hh:mm A").utc();
      var weekTo = moment(ed, "DD MMM YYYY hh:mm A").utc();

      let getParams = {
        pId: this.user.id,
        startDate: weekFrom.valueOf(),
        endDate: weekTo.valueOf(),
        siteId: this.user.siteIds ? this.user.siteIds[0] : null
      };
      this.$api.getTelehealthAvailabilityList(getParams).then(
        response => {
          self.isLoadingAvailability = false;
          self.availabilityList = []; //Reset to empty other wise on refreshList event, records will get duplicate
          let availabilityResponse = response.body;
          if (availabilityResponse.length == 0) {
            self.availabilityListRecordMsg =
              "Please set up your site's availability.";
            return;
          }

          _.forEach(availabilityResponse, function(availabilityObject, i) {
            let appointmentDateTimeString =
              availabilityObject.availabilityDate +
              " " +
              availabilityObject.fromTime;

            let availabilityDateUTC = moment.utc(appointmentDateTimeString);

            let availabilityDateLocal = availabilityDateUTC.local();

            let avaiTitle = availabilityDateLocal.format("DD MMM YYYY");

            let avaiDays = availabilityDateLocal.format("ddd");

            let avaiFromTimeUTC = moment.utc(
              availabilityObject.fromTime,
              "HH:mm:ss"
            );
            let avaiFromTimeLocal = avaiFromTimeUTC.local();
            let avaiFromTime = avaiFromTimeLocal.format("hh:mm A");

            //let avaiToTime = moment(availabilityObject.toTime,"HH:mm:ss").format("h:mm A");
            let avaiToTimeUTC = moment.utc(
              availabilityObject.toTime,
              "HH:mm:ss"
            );
            let avaiToTimeLocal = avaiToTimeUTC.local();
            let avaiToTime = avaiToTimeLocal.format("hh:mm A");

            self.availabilityList.push({
              id: availabilityObject.id,
              title: avaiTitle,
              days: avaiDays,
              time: `${avaiFromTime} - ${avaiToTime}`,
              startDate: availabilityDateUTC.format(),
              type: availabilityObject.availabilityType?availabilityObject.availabilityType:'single',
              isDisabled: availabilityDateLocal.isBefore(
                moment().format("DD MMM YYYY")
              ),
              isSlotBooked: availabilityObject.isSlotBooked
            });
          });
        },
        error => {
          self.isLoadingAvailability = false;
          let errMsg = "Error while getting the availability list!";
          self.availabilityListRecordMsg = errMsg;
          toastr.error(
            error.body && error.body.message ? error.body.message : errMsg
          );
        }
      );
    },
    showAvailabilityModal() {
      this.editAvailabilityObj = null;
      this.$refs.availabilityModal.show();
    },
    showSettingModal() {
      this.$refs.settingModalPopup.show();
    },
    editAvailability(availabilityObj) {
      this.editAvailabilityObj = availabilityObj;
      this.$refs.availabilityModal.show();
    },
    refreshAvailabiliies(jumpDate) {
      if (jumpDate) {
        this.weekStartDate = moment(jumpDate)
          .utc()
          .startOf("week");
        this.WeekEndDate = moment(jumpDate)
          .utc()
          .endOf("week");
      }
      //Re Load all the availabilities list/calendar as the new/update action is performed
      this.getAvailabilities();
    },
    displayCurrentWeek() {
      this.weekStartDate = moment()
        .utc()
        .startOf("week");
      this.WeekEndDate = moment()
        .utc()
        .endOf("week");
      //Load the Availabilities
      this.getAvailabilities();
    },
    previousWeekList() {
      let pw = this.weekStartDate.subtract(1, "days");

      this.weekStartDate = moment(pw)
        .utc()
        .startOf("week");
      this.WeekEndDate = moment(pw)
        .utc()
        .endOf("week");
      //Load the Availabilities
      this.getAvailabilities();
    },
    nextWeekList() {
      let nw = this.WeekEndDate.add(1, "days");

      this.weekStartDate = moment(nw)
        .utc()
        .startOf("week");
      this.WeekEndDate = moment(nw)
        .utc()
        .endOf("week");
      //Load the Availabilities
      this.getAvailabilities();
    },
    resetAvailabilityDataObject() {
      this.editAvailabilityObj = null;
    }
  }
};
</script>
<style scoped lang="scss">
.paddings {
  padding: 20px;
}

.availability {
  font-family: Lato-Regular;
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  /* border-right: 0; Removed when calendar implemented*/
  background-color: #ffffff;
  color: #4a4a4a;
}

/* .th-breadcrumb {
  color: #1e8fe1;
} */

.status-legends {
  font-size: 12px;
  color: #4a4a4a;

  & .badge {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    vertical-align: text-top;
  }

  .badge-success {
    background-color: #2ecd71;
  }

  .badge-danger {
    background-color: #e74c3c;
  }

  .badge-primary {
    background-color: #34537d;
  }
}

.ava-title {
  border-bottom: solid 1px #e4e8eb;
}

.btn-box {
  padding: 17px 20px;
  overflow: hidden;
}

.ava-list-container {
  height: -moz-calc(100vh - 296px);
  height: -webkit-calc(100vh - 296px);
  height: calc(100vh - 296px);
  overflow-y: auto;
}

.availability-details {
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  margin: 20px;
  padding: 10px 11px;
  transition: all 250ms cubic-bezier(0.02, 0.01, 0.47, 1);
}

.availability-details:first-of-type {
  margin-top: 5px;
}

.availability-details.disabled {
  opacity: 0.7;
  background: #e4e8eb;
}

.availability-details:not(.disabled):hover {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transform: translate(0, -5px);
  transition-delay: 0s !important;
}

.btn-box button {
  padding: 0.25rem 0.97rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.btn-box .setting-btn {
  padding: 0.25rem 1.875rem;
}

.calendar-view {
  border-right: 1px solid #e4e8eb;
  border-left: 0;
}

.calendar-view .calendar {
  min-height: 583px;
  border-top: 1px solid #e4e8eb;
}

.btn-outline-primary {
  color: #1e8fe1;
  border-color: #1e8fe1;
}

.btn-outline-primary:hover {
  background-color: #1e8fe1;
  color: #fff;
}

.calendar-header .today-btn {
  padding: 0.25rem 1.7rem;
  font-size: 0.75rem;
  font-weight: bold;
}
.calendar-header .row {
  width: 100%;
}
.weekly-navigation {
  font-weight: bold;
}
.weekly-navigation .fa {
  color: #007bff;
  cursor: pointer;
}

.response-msg {
  /* min-height: 519px;
  width: 100%; */
  height: -moz-calc(100vh - 296px);
  height: -webkit-calc(100vh - 296px);
  height: calc(100vh - 296px);
}
</style>
