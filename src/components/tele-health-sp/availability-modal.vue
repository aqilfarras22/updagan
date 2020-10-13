<template>
  <b-modal
    id="add-edit-availability-modal"
    hide-footer
    ref="cancelAvailabilityModal"
    @hidden="resetAvailabilityValues"
    @show="setAvailabilityValues"
    size="lg"
    :no-close-on-esc="noCloseOnBackdrop"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :hide-header-close="noCloseOnBackdrop"
  >
    <template slot="modal-title">{{ availabilityData ? "Edit availability" : "New availability"}}</template>
    <div>
      <div class="form-group">
        <label>Set recurrence</label>
        <div
          class="form-check form-check-inline"
          v-for="(option, index) in availabilityTypeOptions"
          :key="index"
        >
          <input
            v-model="availabilityType"
            class="form-check-input"
            type="radio"
            v-bind:value="option.value"
            :id="index"
            :disabled="availabilityData && availabilityType != option.value" @change="changeAvailabilityType()"
          />
          <label class="form-check-label" :for="index">{{option.text}}</label>
        </div>
        <div v-if="showRecurringLimit" class="error-style">Recurring availability can be set for a maximum duration of 60 days</div>
      </div>
      <hr />
      <div class="row">
        <div class="col-lg-5 pl-0">
          <div class="form-group date-input">
            <label>Select date</label>
            <datepicker
              input-class="form-control"
              placeholder="Select date"
              v-model="appointmentAvaDate"
              :disabledDates="disabledDates"
            ></datepicker>
            <span class="fa fa-calendar-o form-control-feedback"></span>
          </div>
        </div>
        <div v-if="availabilityType==recurringTxtString" class="col-lg-1 pl-0 text-center">
          <div class="form-group">
            <label>&nbsp;</label>
            <span class="to">to</span>
          </div>
        </div>
        <div v-if="availabilityType==recurringTxtString" class="col-lg-5 pl-0">
          <div class="form-group date-input end-date">
            <label>&nbsp;</label>
            <datepicker
              v-model="appointmentAvaEndDate"
              :disabledDates="avaEndDateDisabledDates"
              :open-date="endDateOpenMonth" 
              input-class="form-control"
              placeholder="Select date"
            ></datepicker>
            <span class="fa fa-calendar-o form-control-feedback"></span>
          </div>
        </div>
      </div>
      <div v-if="availabilityType==recurringTxtString" class="form-group mb-22">
        <div class="btn-group week-days" role="group">
          <button
            v-for="(day, index) in weekDays"
            :value="day.value"
            :key="index"
            type="button"
            class="btn btn-outline-dark btn-sm"
            :class="appointmentAvailabilityDays.includes(day.value)?'active':''"
            @click="addEditAvailabilityDays(day.value)"
          >{{day.text}}</button>
        </div>
      </div>
      <div v-if="availabilityType==recurringTxtString" class="form-group date-input exclude-date pt-20">
        <label>Exclude dates</label>
        <div class="row">
          <div class="col-lg-4 pl-0">
            <datepicker
              v-model="excludeDate"
              :disabledDates="excludeDateDisabledDates"
              :open-date="excludeDateOpenMonth"
              input-class="form-control"
              placeholder="Select date"
            ></datepicker>
            <span class="fa fa-calendar-o form-control-feedback"></span>
          </div>
          <div class="col-lg-1 align-self-center">
            <button
              @click="addExcludedDate"
              type="button"
              class="btn btn-outline-primary btn-sm pl-20 pr-20"
            >Add</button>
          </div>
        </div>
        <div v-for="(exDate, index) in excludateDatesColl" :key="index" class="mt-21">
          <span class="mr-10">{{exDate}}</span>
          <span @click="removeExcludeDate(index)" class="cursor-pointer fa fa-minus-circle"></span>
        </div>
      </div>
      <hr />
      <div class="form-group">
        <label>Select window</label>
        <vueTimepicker
          format="hh:mm A"
          :minute-interval="getTelehealthAppointmentDuration"
          v-model="startTime"
        ></vueTimepicker>
        <span class="ml-36 mr-26">to</span>
        <vueTimepicker
          format="hh:mm A"
          :minute-interval="getTelehealthAppointmentDuration"
          v-model="endTime"
        ></vueTimepicker>
      </div>
      <div v-if="availabilityData" class="form-group warning-box">
        <div class="alert alert-warning">
          <span class="fa fa-exclamation-triangle"></span>
          Modifying or removing this availability will not affect any appointments scheduled during this window. Reschedule appointments with your participant(s) directly as needed.
        </div>
      </div>
    </div>
    <div class="mod-footer mt-30">
      <div class="d-flex">
        <div class="my-auto">
          <span v-if="availabilityData" class="delete-icon" @click="deleteAvailability">
            <img src="static/img/delete.svg" />
          </span>
          <!-- <span class="cannot-remove">
            Cannot remove availability
            <span
              v-b-popover.hover="'Unable to remove availability due to scheduled appointment(s). Please reschedule this appointment with your participant(s) before modifying availability.'"
              class="fa fa-question-circle"
            ></span>
          </span>-->
        </div>
        <div class="ml-auto">
          <button
            type="button"
            class="btn btn-outline-secondary mr-10"
            @click="cancelChanges"
            :disabled="disablebutton"
          >Cancel</button>
          <button
            @click="addUpdateAvailability"
            type="button"
            class="btn btn-primary"
            :disabled="disablebutton"
          >{{ availabilityData ? "Save" : "Create"}}</button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import datepicker from "vuejs-datepicker";
import vueTimepicker from "vue2-timepicker";
import swal from "sweetalert2";
import toastr from "toastr";
import moment from "moment";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import { mapGetters } from "vuex";
export default {
  name: "availability-modal",
  props: ["availabilityData"],
  data() {
    const todayDate = new Date(Date.now() - 8640000);
    const SINGLE = "single";
    const RECURRING = "recurring";
    return {
      recurringAvailabilityID: null,
      singleTxtString: SINGLE,
      recurringTxtString: RECURRING,
      noCloseOnBackdrop: true,
      studyId: this.$route.params.studyId,
      availabilityTypeOptions: [
        {
          value: SINGLE,
          text: "Single occurrence"
        },
        {
          value: RECURRING,
          text: "Recurring availability"
        }
      ],
      availabilityType: "single",
      appointmentAvaDate: null,
      appointmentAvaEndDate: null,
      startTime: {
        hh: "",
        mm: "",
        A: ""
      },
      endTime: {
        hh: "",
        mm: "",
        A: ""
      },
      disabledDates: { to: todayDate },
      avaEndDateDisabledDates: null,
      excludeDateDisabledDates: {
        to: todayDate,
        from: todayDate
      },
      endDateOpenMonth: todayDate, // this is to set the active month for the end date
      weekDays: [
        { value: "1", text: "S" },
        { value: "2", text: "M" },
        { value: "3", text: "T" },
        { value: "4", text: "W" },
        { value: "5", text: "T" },
        { value: "6", text: "F" },
        { value: "7", text: "S" }
      ],
      appointmentAvailabilityDays: [],
      excludeDate: null,
      excludeDateOpenMonth: todayDate, // this is to set the active month for the exclude date
      excludateDatesColl: [],
      disablebutton: false,
      showRecurringLimit: false
    };
  },
  components: {
    datepicker,
    vueTimepicker
  },
  computed: { ...mapGetters(["user", "getTelehealthAppointmentDuration"]) },
  watch: {
    availabilityType(type) {
      if (type == this.recurringTxtString) {
        this.setUnsetRecurringFields();
      }
    },
    availabilityData(avaDataObj) {
      this.setAvailabilityValues();
    },
    appointmentAvaDate() {
      if (this.availabilityType == this.recurringTxtString) {
        this.setUnsetRecurringFields();
      }
    },
    appointmentAvaEndDate() {
      if (this.appointmentAvaDate != null && this.appointmentAvaDate != null) {
        this.setExcludeDateRange();
      } else {
        this.unSetExcludeDateRange();
      }
    }
  },
  methods: {
    show() {
      this.$refs.cancelAvailabilityModal.show();
    },
    hide() {
      this.$refs.cancelAvailabilityModal.hide();
    },
    cancelChanges() {
      var self = this;
      swal({
        title: "Are you sure you want to cancel the changes?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "No",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          self.$refs["cancelAvailabilityModal"].hide();
        }
      });
    },
    deleteAvailability() {
      var self = this;
      swal({
        title: self.availabilityData.isSlotBooked?"There are appointments scheduled in this availability slot that need to be rescheduled. Are you sure you want to delete this slot?":"Are you sure you want to delete this slot?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "No",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          self.$refs["cancelAvailabilityModal"].hide();

          let postParam = {
            piId: self.user.id,
            id: self.availabilityData.id,
            siteId: self.user.siteIds ? self.user.siteIds[0] : null
          };

          let resourceMethod =
            self.availabilityType == self.recurringTxtString
              ? "deleteTelehealthRecurringAvailability"
              : "deleteTelehealthAvailability";

          nprogress.start();
          self.$api[resourceMethod](postParam).then(
            response => {
              nprogress.done();
              if (response.status == "208") {
                toastr.error(response.bodyText);
              } else {
                toastr.success("Availability slot deleted succesfully");
                self.$emit("refreshList");
              }
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while deleting this availability slot!"
              );
              nprogress.done();
            }
          );
        }
      });
    },
    async setAvailabilityValues() {
      this.showRecurringLimit = false;
      var self = this;
      if (self.availabilityData) {

        self.availabilityType = self.availabilityData.type;
        var [fromTime, toTime] = self.availabilityData.time.split("-");
        
        //Get the recurring availability data from the server to prepopluate the values
        if (self.availabilityData.type == self.recurringTxtString) {
          let recurringObject = await self.getRecurringAvailabilityDetails();
          if (recurringObject != null) {
            //this recurringAvailabilityID is need for the recurring availability update API
            self.recurringAvailabilityID = recurringObject.configurationId;
            
            //Need to process Start & End Date, Exclude date and Week Days
            //Availabiliy Start Date
            self.appointmentAvaDate = self
              .prepareDate(
                recurringObject.availabilityStartDate,
                recurringObject.fromTime
              )
              .format();

            //Availability End Date
            self.appointmentAvaEndDate = self
              .prepareDate(
                recurringObject.availabilityEndDate,
                recurringObject.fromTime
              )
              .format();

            //Availability Days
            self.appointmentAvailabilityDays =
              recurringObject.excludeDays &&
              recurringObject.excludeDays.length > 0
                ? recurringObject.excludeDays
                : [];
            
            //Availability Exclude Dates
            if ( recurringObject.excludeDates && recurringObject.excludeDates.length > 0 ) {
              recurringObject.excludeDates.forEach(excludeDate => {
                // let exdDateStrUTC = self.prepareDate(excludeDate, recurringObject.fromTime);
                // let exdDateStrLocal = exdDateStrUTC.local().format("DD MMM YYYY");
                let excludedDate = moment(new Date(excludeDate))
                let formattedExcludedDate = excludedDate.format("DD MMM YYYY");
                self.excludateDatesColl.push(formattedExcludedDate);
              });
            }

            //Recurring availability from time
            fromTime = self.utcToLocalTime(recurringObject.fromTime, "HH:mm:ss").format("hh:mm A");
            //Recurring availability to time
            toTime = self.utcToLocalTime(recurringObject.toTime, "HH:mm:ss").format("hh:mm A");

          }
        } else {
          self.appointmentAvaDate = this.availabilityData.startDate;
        }

        //From Time
        const [fhm, fa] = fromTime.trim().split(" ");
        const [fhh, fmm] = fhm.split(":");
        this.startTime = {
          hh: fhh,
          mm: fmm,
          A: fa
        };
        //End Time
        const [thm, ta] = toTime.trim().split(" ");
        const [thh, tmm] = thm.split(":");
        this.endTime = {
          hh: thh,
          mm: tmm,
          A: ta
        };
      }
    },
    resetAvailabilityValues() {
      this.$emit("resetAvailabilityData");

      this.availabilityType = "single";
      this.appointmentAvaDate = null;
      this.appointmentAvaEndDate = null;
      this.appointmentAvailabilityDays = [];

      this.startTime = {
        hh: "",
        mm: "",
        A: ""
      };
      this.endTime = {
        hh: "",
        mm: "",
        A: ""
      };
      
      //Reset exludate dates data
      this.unSetExcludeDateRange();

      //Reset availability disabled date range
      this.unSetAvaEndDateRange();
    },
    addUpdateAvailability() {
      var self = this;
      self.disablebutton = true;

      //Dates error msg based on availabiltiy type
      let availabilityFDErrormsg = "Availability date is required.";
      if (self.availabilityType == self.recurringTxtString) {
        availabilityFDErrormsg = "Availability start date is required.";
      }

      if (self.appointmentAvaDate == null) {
        toastr.error(availabilityFDErrormsg);
        self.disablebutton = false;
        return;
      }

      if (self.availabilityType == self.recurringTxtString) {
        if (self.appointmentAvaEndDate == null) {
          toastr.error("Availability end date is required.");
          self.disablebutton = false;
          return;
        }

        let avafromDate = moment(self.appointmentAvaDate).format("YYYY-MM-DD");
        let avaToDate = moment(self.appointmentAvaEndDate).format("YYYY-MM-DD");
        if (moment(avaToDate).isSameOrBefore(moment(avafromDate))) {
          toastr.error("Please select end date greater than start date.");
          self.disablebutton = false;
          return;
        }
      }

      const slotStartTime = self.startTime;
      const slotEndTime = self.endTime;
      if (
        slotStartTime.hh === "" ||
        slotStartTime.mm === "" ||
        slotStartTime.A === ""
      ) {
        toastr.error("Start time is required.");
        self.disablebutton = false;
        return;
      }

      if (
        slotEndTime.hh === "" ||
        slotEndTime.mm === "" ||
        slotEndTime.A === ""
      ) {
        toastr.error("End time is required.");
        self.disablebutton = false;
        return;
      }

      let availabilityDateStr = moment(self.appointmentAvaDate).format(
        "YYYY-MM-DD"
      );

      var fromTime = self.prepareUTCMomentFromDate(
        availabilityDateStr,
        slotStartTime,
        "YYYY-MM-DD hh:mm A"
      );
      var toTime = self.prepareUTCMomentFromDate(
        availabilityDateStr,
        slotEndTime,
        "YYYY-MM-DD hh:mm A"
      );

      let currentTime = moment.utc();
      if (fromTime.isSameOrBefore(currentTime)) {
        toastr.error("Availability cannot be set for past time.");
        self.disablebutton = false;
        return;
      }

      if (toTime.isSameOrBefore(fromTime)) {
        toastr.error("Please select end time greater than start time.");
        self.disablebutton = false;
        return;
      }

      const postParam = new Object();
      postParam.id = null;
      postParam.studyId = self.studyId;
      postParam.siteId = self.user.siteIds ? self.user.siteIds[0] : null;
      postParam.piId = self.user.id;

      postParam.fromTime = fromTime.format("HH:mm:ss");
      postParam.toTime = toTime.format("HH:mm:ss");

      let resourceMethod = "";
      if (self.availabilityType == self.recurringTxtString) {
        let availabilityEndDateStr = moment(self.appointmentAvaEndDate).format(
          "YYYY-MM-DD"
        );
        
        let endTimeMoment = self.prepareUTCMomentFromDate(
          availabilityEndDateStr,
          slotStartTime,
          "YYYY-MM-DD hh:mm A"
        );

        postParam.availabilityStartDate = fromTime.format("YYYY-MM-DD");
        postParam.availabilityEndDate = endTimeMoment.format("YYYY-MM-DD");

        //Send week day only when a day is selected
        if (self.appointmentAvailabilityDays.length > 0) {
          postParam.excludeDays = self.appointmentAvailabilityDays;
          //Now the exclude days are selected get the date on these days within the selected range
          let daysDateArr = self.prepareDatesForDays(
            availabilityDateStr,
            availabilityEndDateStr
          );
          if (daysDateArr.length > 0) {
            //Convert the dates in UTC format
            let daysDateArray = [];
            daysDateArr.forEach(dayDateStr => {
              let dayDateUTC = self
                .prepareUTCMomentFromDate(
                  dayDateStr,
                  slotStartTime,
                  "YYYY-MM-DD hh:mm A"
                )
                .format("YYYY-MM-DD");

              daysDateArray.push(dayDateUTC);
            });
            postParam.excludeDaysDates = daysDateArray;
          }
        }

        //Send exlude dates only when selected, make sure the date format is same as used while saving in the excludateDatesColl
        if (self.excludateDatesColl.length > 0) {
          let excludeDatesArray = [];
          self.excludateDatesColl.forEach(excludeDate => {
            
            let exdUTC = self
              .prepareUTCMomentFromDate(
                excludeDate,
                slotStartTime,
                "DD MMM YYYY hh:mm A"
              )
              .format("YYYY-MM-DD");

            excludeDatesArray.push(exdUTC);
          });
          postParam.excludeDates = excludeDatesArray;
        }

        resourceMethod = "saveTelehealthRecurringAvailability"; //Add/Create New recurring availability

        if (self.availabilityData) {
          postParam.id = self.availabilityData.id;
          postParam.configurationId = self.recurringAvailabilityID;
          resourceMethod = "updateTelehealthRecurringAvailability"; //Update existing recurring availability
        }
      } else {
        resourceMethod = "saveTelehealthAvailability"; //Add/Create New single availability
        postParam.availabilityDate = fromTime.format("YYYY-MM-DD");

        if (self.availabilityData) {
          postParam.id = self.availabilityData.id;
          resourceMethod = "updateTelehealthAvailability"; //Update existing single availability
        }
      }

      //Warning pop in case of EDIT
      if(self.availabilityData){
        swal({
          title: self.availabilityData.isSlotBooked?"There are appointments scheduled in this availability slot that need to be rescheduled. Are you sure you want to edit this slot?":"Are you sure you want to edit this slot?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#b8c7ce",
          cancelButtonColor: "#f16559",
          confirmButtonText: "No",
          cancelButtonText: "Yes"
        }).then(({ dismiss }) => {
          if (dismiss === "cancel") {
            self.saveUpdateAvailability(resourceMethod, postParam);            
          }
          else{
            self.disablebutton = false;
          }
        });
      }else{
        //Its new availbility case
        self.saveUpdateAvailability(resourceMethod, postParam);            
      }   
      //Warning pop ends      
    },
    saveUpdateAvailability(resourceMethod, postParam){
      let self = this;
      nprogress.start();
      self.$api[resourceMethod](postParam).then(
        response => {
          nprogress.done();
          self.hide();
          self.$emit("refreshList", self.appointmentAvaDate);
          if (response.status == "207") {
            toastr.success("Availability saved");
            toastr.warning("This slot overlaps with another one");
          }
          else if (response.status == "208") {
            toastr.error(response.bodyText);
          } else {
            toastr.success("Availability saved");
          }
          self.disablebutton = false;
        },
        error => {
          self.disablebutton = false;
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while saving the availability!"
          );
          nprogress.done();
        }
      );
    },
    getExactDayEpoch(day) {
      day = new Date(day);
      return Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
    },
    addEditAvailabilityDays(day) {
      let findDayIndex = _.findIndex(this.appointmentAvailabilityDays, function(d) {
        return d == day;
      });

      if (findDayIndex == -1) {
        this.appointmentAvailabilityDays.push(day);
      } else {
        this.$delete(this.appointmentAvailabilityDays, findDayIndex);
      }
    },
    addExcludedDate() {
      if (
        this.appointmentAvaDate == null ||
        this.appointmentAvaEndDate == null
      ) {
        toastr.error("Please select the date range first.");
        //Reset the input
        this.excludeDate = null;
        return;
      }

      if (this.excludeDate == null) {
        toastr.error("Please select the exclude date");
        //Reset the input
        this.excludeDate = null;
        return;
      }

      let exludeDateMoment = moment(this.excludeDate);
      if (
        exludeDateMoment.isBetween(
          this.appointmentAvaDate,
          this.appointmentAvaEndDate
        )
      ) {
        let exd = exludeDateMoment.format("DD MMM YYYY");
        if (!this.excludateDatesColl.includes(exd)) {
          this.excludateDatesColl.push(exd);
        }
      } else {
        toastr.error("Exclude date not belongs to the specified date range.");
      }

      //Reset the input
      this.excludeDate = null;
    },
    removeExcludeDate(index) {
      this.$delete(this.excludateDatesColl, index);
    },
    async getSettings() {
      var self = this;
      let getSettingParam = {
        pId: this.user.id,
        siteId: this.user.siteIds ? this.user.siteIds[0] : null
      };
      let duration = null;
      await this.$api.getTelehealthSettings(getSettingParam).then(
        response => {
          duration = response.body.duration;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the site duration!"
          );
        }
      );

      return duration;
    },
    setExcludeDateRange() {
      var self = this;
      //both the dates are set, now set the available date range for exclude date

      let exToDate = new Date(self.appointmentAvaDate);
      exToDate.setDate(exToDate.getDate() + 1);

      let exFromDate = new Date(self.appointmentAvaEndDate);
      exFromDate.setDate(exFromDate.getDate() - 1);

      self.excludeDateDisabledDates = {
        to: exToDate,
        from: new Date(exFromDate.getTime() + 8640000)
      };

      self.excludeDateOpenMonth = exToDate; // this is to set the active month for the exclude date

      if (self.excludateDatesColl.length > 0) {
        self.excludateDatesColl = _.filter(self.excludateDatesColl, function(
          exDate
        ) {
          let exludeDateMoment = moment(exDate, "DD MMM YYYY");
          return exludeDateMoment.isBetween(
            self.appointmentAvaDate,
            self.appointmentAvaEndDate
          );
        });
      }
    },
    unSetExcludeDateRange() {
      let todaysDate = new Date(Date.now() - 8640000);
      this.excludeDateOpenMonth = todaysDate; // this is to set the active month for the exclude date
      this.excludeDate = null;
      this.excludateDatesColl = [];
      this.excludeDateDisabledDates = {
        to: todaysDate,
        from: todaysDate
      };
    },
    unSetAvaEndDateRange() {
      this.avaEndDateDisabledDates = {
        to: new Date(Date.now() - 8640000),
        from: new Date(Date.now() - 8640000)
      };
    },
    setUnsetRecurringFields() {
      if (this.appointmentAvaDate != null) {
        let toDate = new Date(this.appointmentAvaDate);
        toDate.setDate(toDate.getDate() + 1);

        let toDisabledDate = new Date(toDate.getTime() - 8640000);
        let fromDisabledDate = null;

        if(this.appointmentAvaEndDate) {
          let endDate = new Date(this.appointmentAvaEndDate);
          endDate.setDate(endDate.getDate());
          let endDisabledDate = new Date(endDate.getTime());
          let difference = Math.round(endDisabledDate-toDisabledDate)/86400000;
        if(difference > 60) {
          if(toDate < new Date()) {
          fromDisabledDate = endDisabledDate;
          }
          else {
            fromDisabledDate = new Date(toDate.getTime() + 5.0976e9);
            this.appointmentAvaEndDate = null;
          }
        }
        else {
          fromDisabledDate = new Date(toDate.getTime() + 5.0976e9);
        }
        }
        else {
        fromDisabledDate = new Date(toDate.getTime() + 5.0976e9);
        }

        this.endDateOpenMonth = toDisabledDate; // this is to set the active month for the end date based on the start date
        this.avaEndDateDisabledDates = {
          to: toDisabledDate,
          from: fromDisabledDate
        };

        //Either to set the end date to null or not
        if (this.appointmentAvaEndDate != null) {
          let avafromDate = moment(this.appointmentAvaDate).format(
            "YYYY-MM-DD"
          );
          let avaToDate = moment(this.appointmentAvaEndDate).format(
            "YYYY-MM-DD"
          );
          if (moment(avaToDate).isSameOrBefore(moment(avafromDate))) {
            this.appointmentAvaEndDate = null;
            this.unSetExcludeDateRange();
          } else {
            this.setExcludeDateRange();
          }
        }
      }
    },
    async getRecurringAvailabilityDetails() {
      try {
        var self = this;
        let getParam = {
          piId: this.user.id,
          siteId: this.user.siteIds ? this.user.siteIds[0] : null,
          id: self.availabilityData.id
        };
        let recurringDetails = null;
        await this.$api.getTelehealthRecurringAvailabilityDetail(getParam).then(
          response => {
            recurringDetails = response.body;
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting the recurring availability details!"
            );
          }
        );

        return recurringDetails;
      } catch (error) {
        toastr.error(
          "There is some error occurred while fetching the recurring details"
        );
      }
    },
    prepareDate(dateString, timeString) {
      let dateTimeString = dateString + " " + timeString;
      return moment.utc(dateTimeString);
    },
    prepareUTCMomentFromDate(dateString, timeObj, dateFormat) {
      let dateTimeString =
        dateString + " " + timeObj.hh + ":" + timeObj.mm + " " + timeObj.A;

      return moment(dateTimeString, dateFormat).utc();
    },
    prepareDatesForDays(startDate, endDate) {
      var fromDate = moment(startDate);
      var toDate = moment(endDate);
      var daysDate = [];
      for (
        var m = moment(fromDate);
        m.diff(toDate, "days") <= 0;
        m.add(1, "days")
      ) {
        let day = m.day() + 1; //adding 1 because we have started week collection with sunday having 1 value
        day = day.toString();
        
        if (this.appointmentAvailabilityDays.includes(day)) {
          daysDate.push(m.format("YYYY-MM-DD"));
        }
      }
      return daysDate;
    },
    utcToLocalTime(timeString, format){
      let timeUTC = moment.utc(timeString,format);
      return timeUTC.local();      
    },
    changeAvailabilityType() {
      if(this.availabilityType === "recurring"){
        this.showRecurringLimit = true;
      }
      else {
        this.showRecurringLimit = false;
      }
    }
  },
  mounted() {
    var self = this;

    //Set disbaled date range for Availability end date
    self.unSetAvaEndDateRange();

    //Get the appointment duration from vuex store if set any other wise get from the backend
    let apppointmentDuration = this.getTelehealthAppointmentDuration;

    if (!apppointmentDuration) {
      //Get the duration from backend
      this.getSettings().then(function(duration) {
        duration = duration ? duration : 30;
        self.$store.dispatch("setTelehealthAppointmentDuration", duration);
      });
    }
  }
};
</script>

<style>
@media (min-width: 992px) {
  .modal-dialog {
    min-width: 600px;
  }
}

.modal {
  color: #4a4a4a;
}

.btn-primary {
  background-color: #1e8fe1;
  border-color: #1e8fe1;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0069d9;
}

.btn-primary:hover {
  background-color: #1e8fe1;
  color: #fff;
}

.btn-primary {
  padding: 0.25rem 1.6rem;
}

.btn-outline-secondary {
  border-color: #b0bac9;
  padding: 0.25rem 1.6rem;
  color: #4a4a4a;
}

.week-days button {
  padding: 0.375rem 0.6875rem;
}

.btn-outline-secondary:hover {
  color: #ffffff;
}

#add-edit-availability-modal label {
  display: block;
  font-weight: bold;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
}

.form-group label {
  margin-bottom: 0.625rem;
}

.date-input .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
  right: 14px;
  top: 30px;
}

/* .end-date .vdp-datepicker {
  float: right;
} */

.to {
  position: relative;
  top: 7px;
  margin-left: 5px;
}

.btn-outline-dark {
  border-color: #e4e8eb;
}

.btn-outline-dark:hover,
.btn-outline-dark:not(:disabled):not(.disabled):active,
.show > .btn-outline-dark.dropdown-toggle {
  color: inherit;
  background: #e4e8eb;
  border-color: #e4e8eb;
}
.btn-outline-dark.active {
  border-color: #ffffff;
}
.btn-outline-dark:not(:disabled):not(.disabled):active:focus,
.btn-outline-dark:not(:disabled):not(.disabled).active:focus,
.show > .btn-outline-dark.dropdown-toggle:focus,
.btn-outline-dark:focus {
  box-shadow: none;
}
.btn-outline-dark:not(:disabled):not(.disabled).active {
  background-color: #1e8fe1;
  border-color: #1e8fe1;
  color: #fff;
}

.exclude-date {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.exclude-date .form-control-feedback {
  top: -1px;
}

.form-check-inline .form-check-label {
  font-weight: normal !important;
  margin-bottom: 0;
}
.delete-icon,
.cursor-pointer {
  cursor: pointer;
}
.cannot-remove {
  color: #b0bac9;
}
.warning-box .alert {
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  background-color: rgba(240, 173, 78, 0.1);
  color: #f0ad4e;
  font-weight: bold;
}

.error-style {
  color: #ff4848;
}
</style>
