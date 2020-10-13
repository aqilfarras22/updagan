<template>
  <div class="scheduler_section" :class="options.telehealthv2?'telehealth-v2':''">
    <div v-if="options.telehealthv2">
      <div class="form-group row mb-30">
        <div class="col-sm-6 col-lg-3">
          <div class="scheduler-heading mb-5">Visit name
            <span v-b-popover.hover="'The visit name displays in the study portal.'" class="fa fa-info-circle ml-7"></span>
          </div>
          <input
            type="text"
            name="vistName"
            v-model.trim="telehealthVisit.telehealthVisitDTO.title"
            class="form-control"
            placeholder="Enter a name"
          >
        </div>
      </div>
      <div class="form-group row mb-30">
        <div class="col-sm-6 col-lg-3">
          <div class="scheduler-heading mb-5">Activity name
            <span v-b-popover.hover="'The activity name displays in the app for the participant’s task to schedule the Telehealth visit. Recommended activity name under 36 characters.'" class="fa fa-info-circle ml-7"></span>
          </div>
          <input
            type="text"
            name="activityName"
            v-model.trim="telehealthVisit.telehealthVisitDTO.activityName"
            class="form-control"
            placeholder="i.e. Schedule your visit 1 appointment"
            :maxlength="maxChar"
          >
        </div>
      </div>
    </div>
    
    <div class="visit-types mb-36">
      <div class="scheduler-heading mb-5">What type of visit would you like to schedule?</div>
      <span
        class="type"
        :class="{'active_item': telehealthVisit.telehealthVisitDTO.visitType === 'Telehealth'}"
        @click="telehealthVisit.telehealthVisitDTO.visitType = 'Telehealth'"
      >
        <span class="icon type-telehealth"></span> &nbsp; <span>Telehealth</span>
      </span>
      <span
        class="type"
        :class="{'active_item': telehealthVisit.telehealthVisitDTO.visitType === 'In-person'}"
        @click="telehealthVisit.telehealthVisitDTO.visitType = 'In-person'"
      >
        <span class="icon in-person"></span> &nbsp; <span>In-person visit</span>
      </span>
      <span
        class="type"
        :class="{'active_item': telehealthVisit.telehealthVisitDTO.visitType === 'bothVisitType'}"
        @click="telehealthVisit.telehealthVisitDTO.visitType = 'bothVisitType'"
      >
        <span class="icon both"></span> &nbsp; <span>Both visit types</span>
      </span>
    </div>

    <div class="scheduler_types">
      <div
        v-if="options.telehealthv2"
        class="scheduler-heading mb-5"
      >Which method would you like to schedule with?</div>
      <span
        class="scheduler_type"
        :class="{'active_item': telehealthVisit.scheduler.type === 'milestone'}"
        v-on:click="changeType('milestone')"
      >
        <span class="type_icon_bg">
          <i class="fa fa-flag-o" aria-hidden="true"></i>
        </span> &nbsp; Milestones
      </span>
      <span
        class="scheduler_type"
        :class="{'active_item': telehealthVisit.scheduler.type === 'custom'}"
        v-on:click="changeType('custom')"
      >
        <span class="type_icon_bg">
          <i class="fa fa-sliders" aria-hidden="true"></i>
        </span> &nbsp; Custom frequency
      </span>
    </div>
    <div class="pt-40" v-if="telehealthVisit.scheduler.type === 'milestone'">
      <div v-if="studyData.milestones && studyData.milestones.length > 0">
        <div class="scheduler-heading pb-5">
          Which milestones will your particpants take this survey?
          <span
            class="edit_milestone_link"
            v-on:click="updateMilestones()"
          >Edit milestones</span>
        </div>
        <div
          :class="{'selected_milestone': (telehealthVisit.scheduler.milestones && telehealthVisit.scheduler.milestones.indexOf(milestone) >= 0)}"
          class="milestone_card"
          :key="index"
          v-for="(milestone, index) in studyData.milestones"
          v-on:click="selectUnselectMileStone(milestone)"
        >
          <p class="m-0">Milestone {{index + 1}}</p>
          <p class="m-0 day_text">Day {{milestone}}</p>
          <i
            v-if="telehealthVisit.scheduler.milestones && telehealthVisit.scheduler.milestones.indexOf(milestone) >= 0"
            class="fa fa-check-circle"
            aria-hidden="true"
          ></i>
        </div>
        <div class="row">
          <div class="col-sm-4 p-0">
            <div class="pt-40">
              <div class="scheduler-heading there">
                What is the completion window?
                <a
                  class="color_grey cursor_pointer"
                  data-toggle="modal"
                  data-target="#completionModal"
                >
                  <i class="fa fa-info-circle p-1"></i>
                </a>
              </div>
              <input
                type="number"
                min="1"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="form-control completion_window_days"
                placeholder="Enter"
                v-model="telehealthVisit.scheduler.completionWindow"
                v-on:blur="calculateReminders(telehealthVisit.scheduler.completionWindow, telehealthVisit.scheduler.advanceScheduleDays)"
              > days
            </div>
          </div>
          <div class="col-sm-8 p-0" v-if="options.validateFor === 'telehealthv2'">
            <div class="pt-40">
              <div class="scheduler-heading">
                How far in advance can a participant schedule their Telehealth visit?
                <a
                  class="color_grey cursor_pointer"
                  data-toggle="modal"
                  data-target="#completionModal"
                >
                  <i class="fa fa-info-circle p-1"></i>
                </a>
              </div>
              <input
                type="number"
                min="1"
                max="99"
                class="form-control completion_window_days"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter"
                v-model="telehealthVisit.scheduler.advanceScheduleDays"
                v-on:blur="calculateReminders(telehealthVisit.scheduler.completionWindow, telehealthVisit.scheduler.advanceScheduleDays)"
              > days
            </div>
          </div>
        </div>
      </div>
      <div v-if="!studyData.milestones || studyData.milestones.length == 0">
        <button
          type="button"
          class="btn btn-md btn-block create_milestone_btn br-25"
          v-on:click="updateMilestones()"
        >Create milestones</button>
      </div>
    </div>

    <div class="pt-40" v-if="telehealthVisit.scheduler.type === 'custom'">
      <div class="pb-5 scheduler-heading">What frequency will your partcipants take this survey?</div>
      <div
        :class="{'selected_milestone': (telehealthVisit.scheduler.frequency && telehealthVisit.scheduler.frequency.type && (f.type === telehealthVisit.scheduler.frequency.type)), 'disabled_frequency':f.disabled}"
        class="milestone_card"
        :key="index"
        v-for="(f,index) in frequencies"
        v-on:click="selectUnselectFrequency(f)"
      >
        <p class="m-0 pt-5">{{f.title}}</p>
        <i
          v-if="(telehealthVisit.scheduler.frequency && telehealthVisit.scheduler.frequency.type) && (f.type === telehealthVisit.scheduler.frequency.type)"
          class="fa fa-info-circle p-1"
          aria-hidden="true"
        ></i>
      </div>
      <div class="row">
        <div class="col-sm-4 p-0" v-if="options.validateFor !== 'notification'">
          <div class="pt-40">
            <div class="scheduler-heading here">
              What is the completion window?
              <a
                class="color_grey cursor_pointer"
                data-toggle="modal"
                data-target="#completionModal"
              >
                <i class="fa fa-info-circle p-1"></i>
              </a>
            </div>
            <input
              type="number"
              min="1"
              class="form-control completion_window_days"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              placeholder="Enter"
              v-model="telehealthVisit.scheduler.completionWindow"
              v-on:blur="calculateReminders(telehealthVisit.scheduler.completionWindow)"
            > days
          </div>
        </div>
        <div class="col-sm-8 p-0" v-if="options.validateFor === 'telehealthv2'">
          <div class="pt-40">
            <div class="scheduler-heading">
              How far in advance can a participant schedule their Telehealth visit?
              <a
                class="color_grey cursor_pointer"
                data-toggle="modal"
                data-target="#completionModal"
              >
                <i class="fa fa-info-circle p-1"></i>
              </a>
            </div>
            <input
              type="number"
              min="1"
              max="99"
              class="form-control completion_window_days"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              placeholder="Enter"
              v-model="telehealthVisit.scheduler.advanceScheduleDays"
              v-on:blur="calculateReminders(telehealthVisit.scheduler.completionWindow, telehealthVisit.scheduler.advanceScheduleDays)"
            > days
          </div>
        </div>
      </div>
      <div class="pt-40">
        <div class="scheduler-heading">
          Select time period this survey should appear
          <span
            class="study_duration"
          >Study ends on day {{studyDuration}}</span>
        </div>
        <div class="pb-15" v-for="(item, index) in telehealthVisit.scheduler.duration" :key="index">
          <div class="row fs-12 color_959fa4">
            <div class="col-md-2 pl-0">Start</div>
            <div class="col-md-6 pl-0">End</div>
          </div>
          <div class="row">
            <div class="col-md-1 pl-0 pr-0">
              <span class="day_label">Day</span>
            </div>
            <div class="col-md-1 pl-0">
              <input
                type="number"
                v-validate="'required|min_value:1'"
                name="startDay"
                min="1"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="form-control"
                v-model="item.startDay"
              >
            </div>
            <div class="col-md-1 pl-0 pr-0">
              <span class="day_label">Day</span>
            </div>
            <div class="col-md-1 pl-0">
              <input
                type="number"
                min="1"
                class="form-control"
                v-validate="'required|min_value:1'"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                name="endDay"
                v-model="item.endDay"
                :disabled="telehealthVisit.scheduler.allowUntillDuration && (index + 1) === telehealthVisit.scheduler.duration.length"
              >
            </div>
            <div
              class="col-md-2 pl-0 color_blue cursor_pointer pt-5"
              v-on:click="addAnotherDuration(index)"
              v-if="telehealthVisit.scheduler.duration.length === (index + 1) && !telehealthVisit.scheduler.allowUntillDuration"
            >Add another time period</div>
            <div
              class="col-md-2 pl-0 color_red cursor_pointer pt-5"
              v-on:click="removeDuration(index)"
              v-if="telehealthVisit.scheduler.duration.length !== (index + 1)"
            >Remove</div>
          </div>
        </div>
        <div class="pt-10">
          <label class="fw-normal">
            <input
              type="checkbox"
              name="allowUntillDuration"
              v-model="telehealthVisit.scheduler.allowUntillDuration"
              v-on:change="allowUntilDurationChanges(telehealthVisit.scheduler.allowUntillDuration)"
            >
            <span class>Available until the end of participant's study duration</span>
          </label>
        </div>
      </div>
    </div>

    <div id="extended-availability">
      <div class="scheduler-heading mt-36">
        Allow participant to schedule outside of required completion window?
        <span v-b-popover.hover="'Gives participant more time to schedule a visit. Once checked, you must provide the number of days the participant can extend the scheduling. Please keep any future visits in mind when determining the number of extended days. If a participant books during the extended window, the site team will be notified via confirmation email.'" class="fa fa-info-circle ml-7"></span>
      </div>
      <div class="mt-10">
        <label for="extendedAvailabilityCheck" class="fw-normal">
          <input
            type="checkbox"
            id="extendedAvailabilityCheck"
            name="extendedAvailabilityCheck"
            v-model="telehealthVisit.telehealthVisitDTO.extendAvailability"
          >
          <span>&nbsp;&nbsp;Extend availability</span>
        </label>
      </div>
      <div v-if="telehealthVisit.telehealthVisitDTO.extendAvailability" class="extend-availability-input mt-10">
        <div>
        Extend completion window by
        <input
          type="number"
          min="1"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          class="form-control completion_window_days ml-10 mr-10"
          placeholder="Enter"
          v-model="telehealthVisit.telehealthVisitDTO.extendWindow"
        > days
        </div>
      </div>
    </div>
    

    <hr>
    <!-- NEW CODE ADDED -->
    <notification-edit
      @updateReminder="updateReminder"
      :options="{advanceScheduleDays: (telehealthVisit.scheduler.advanceScheduleDays) ? telehealthVisit.scheduler.advanceScheduleDays : 0, completionWindow:telehealthVisit.scheduler.completionWindow, 
      telehealthVisit: telehealthVisit,
      reminderList: reminderList,
      remindersList: remindersList,
      appNotification: options.notificationData,
      isDataExist: options.isDataExist}"
    /> 
    <div class="row mt-20">
      <div class="col-md-6">
        <span
          class="delete-icon"
          v-on:click="deleteVisit()"
          v-if="options.telehealthvisit != null && options.telehealthvisit != undefined"
        >
          <img src="static/img/econsent/delete.svg">
        </span>
      </div>
      <div class="col-md-6">
        <div class="text-right">
          <button
            type="button"
            class="btn btn-outline-secondary mr-10"
            @click="deleteVisit()"
          >Cancel</button>
          <button v-if ="options.telehealthVisitDTO && options.telehealthVisitDTO.id === undefined" type="button" @click="addVisit()" class="btn btn-primary">Create</button>
          <button v-if ="options.telehealthVisitDTO && options.telehealthVisitDTO.id" type="button" @click="addVisit()" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
    <!-- NEW CODE ENDS-->

    <div id="completionModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div>
            <div class="row text-right">
              <a class="cancelImage cursor_pointer" data-dismiss="modal">
                <i class="fa fa-times" aria-hidden="true"></i>
              </a>
            </div>
            <div class="example">
              <p
                class="example-header"
              >When a task is assigned to the participant, you have the opportunity to set the window of completion the task before it expires.</p>
              <div class="bg-milestone pb-40">
                <p
                  class="example-content text-center"
                >Example: A survey is assigned to a participant at study week 2, which for this participant happens to be a Wednesday, and a 3 day completion window has been set. The survey will be pushed to the participant on Wednesday and will be available through Friday. On Saturday morning, the survey will be removed from participant’s task list and will be reported as a missed task.</p>
                <div class="row milestone">
                  <div
                    class="col-lg-2 ml-0 pl-0 mr-0 pr-0"
                    v-for="(milestone,index) in exampleMileStone"
                    :key="index"
                  >
                    <div class="text-center">{{milestone.day}}</div>
                    <div class="milestone_box" :class="{'white-bg': milestone.day === 'Sat' }">
                      <div
                        class="circle"
                        v-if="milestone.class"
                        :class="{'bg-green': milestone.day === 'Wed', 'bg-red': milestone.day === 'Sat'}"
                      ></div>
                    </div>
                    <div class="text-center">{{milestone.date}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import _ from "lodash";
import VueTimepicker from "vue2-timepicker";
import NotificationEdit from "./notification-edit"; //NEW CODE ADDED
import swal from "sweetalert2"; //NEW CODE ADDED
export default {
  name: "scheduler",
  data() {
    return {
      visitTitle: "",
      studyId: null,
      surveyId: null,
      studyData: {},
      surveyData: {},
      studyDuration: null,
      taskId: null,
      milestones: [],
      frequencies: [
        { type: "daily", title: "Daily", days: 1, disabled: false },
        { type: "weekly", title: "Weekly", days: 7, disabled: false },
        { type: "biweekly", title: "Every 2 Weeks", days: 14, disabled: false },
        { type: "monthly", title: "Monthly", days: 30, disabled: false },
        {
          type: "biannually",
          title: "Bi-annually",
          days: 182,
          disabled: false
        },
        { type: "annually", title: "Annually", days: 365, disabled: false }
      ],
      telehealthVisit: {
        scheduler: {
          type: "milestone",
          milestones: [],
          frequency: { type: null, title: null, days: null },
          startDay: null,
          endDay: null,
          completionWindow: null,
          reminders: [],
          allowMultipleTimes: false,
          allowUntillDuration: false,
          duration: [{ startDay: null, endDay: null }],
        },
        telehealthVisitDTO: {
          title: '',
          activityName: '',
          sequence: 1,
          createdTime: new Date(),
          version: 1,
          status: "Initiated",
          useHTML: true,
          visitType:'telehealth'
        }
      },
      remindersList: [],
      remindersListTeleHealth: [],
      reminderList: [
        {
          day: "default",
          message: null,
          time: {
            hh: "",
            mm: "",
            A: ""
          }
        }
      ],
      exampleMileStone: [
        { date: "Day1", day: "Wed", class: "bg-green" },
        { date: "Day2", day: "Thur", class: "" },
        { date: "Day3", day: "Fri", class: "" },
        { date: "+2", day: "Sat", class: "bg-red" }
      ],
      time: {
        hh: "",
        mm: "",
        A: ""
      },
      maxChar: 36,
    };
  },
  components: {
    VueTimepicker,
    NotificationEdit
  },
  props: ["options"],
  computed: {
    telehealthVisitObjChanged() {
      return this.$store.getters.getTelehealthVisitObjData;
    }
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.notificationData = this.options.notificationData;
    this.telehealthVisit.scheduler = this.options.scheduler;
    this.telehealthVisit.telehealthVisitDTO = this.options.telehealthVisitDTO;
    this.getStudyDetails();
    this.getSchedulerDetails();
  },
  watch: {
    telehealthVisitObjChanged: {
      handler(val) {
        if (val.validateFor) {
          this.checkValidation(
            this.telehealthVisit.scheduler,
            this.telehealthVisit.telehealthVisitDTO
          );
        }
      }
    },
    "telehealthVisit.telehealthVisitDTO.extendAvailability" :{
      handler(isChecked){
        if(!isChecked){
          this.telehealthVisit.telehealthVisitDTO.extendWindow = "";
        }
      }
    }
  },
  methods: {
    updateReminder(reminder) {
      this.remindersListTeleHealth = {callReminders: reminder.notificationList.callReminder, reminders: reminder.notificationList.reminder};
    },
    goBack() {},
    changeType(type) {
      this.telehealthVisit.scheduler.type = type;
      this.reminderList = [
        {
          day: "default",
          message: null,
          time: {
            hh: "",
            mm: "",
            A: ""
          }
        }
      ];
      this.calculateReminders(
        this.telehealthVisit.scheduler.completionWindow,
        null
      );
    },
    getSchedulerDetails() {
      this.getTelehealthDetails();
    },
    getTelehealthDetails() {
      // this.$api.getTruClinicDetailsFact(this.studyId).then(
      //   response => {
      //     if (response.body.taskId) {
      //       this.scheduler = response.body;
      //       if (
      //         !this.scheduler.duration ||
      //         this.scheduler.duration.length === 0
      //       ) {
      //         this.scheduler.duration = [{ startDay: null, endDay: null }];
      //       }
      //       this.taskId = response.body.taskId;
      //       this.reminderList =
      //         this.scheduler.reminders && this.scheduler.reminders.length > 0
      //           ? this.scheduler.reminders
      //           : this.reminderList; // eslint-disable-line
      //       this.reminderList.forEach(val => {
      //         const [hm, a] = val.time.split(" ");
      //         const [hh, mm] = hm.split(":");
      //         val.time = {
      //           // eslint-disable-line
      //           hh: "",
      //           mm: "",
      //           A: ""
      //         };
      //         val.time.hh = hh; // eslint-disable-line
      //         val.time.mm = mm; // eslint-disable-line
      //         val.time.A = a; // eslint-disable-line
      //       });
      //       this.calculateReminders(
      //         this.scheduler.completionWindow,
      //         this.scheduler.advanceScheduleDays
      //       ); // eslint-disable-line
      //     }
      //   },
      //   error => {
      //     toastr.error(
      //       error.body
      //         ? error.body.message
      //         : "Error while getting the study details"
      //     );
      //   }
      // );
    },
    selectUnselectMileStone(milestone) {
      if (!this.telehealthVisit.scheduler.milestones) {
        this.telehealthVisit.scheduler.milestones = [];
      }
      if (
        this.telehealthVisit.scheduler &&
        this.telehealthVisit.scheduler.milestones &&
        this.telehealthVisit.scheduler.milestones.indexOf(milestone) < 0
      ) {
        this.telehealthVisit.scheduler.milestones.push(milestone);
      } else {
        this.telehealthVisit.scheduler.milestones.splice(
          this.telehealthVisit.scheduler.milestones.indexOf(milestone),
          1
        );
      }
      this.$forceUpdate();
    },
    calculateReminders(completionWindow, advanceScheduleDays) {
      //advanceScheduleDays
      completionWindow = Number(completionWindow) === 0 ? 1 : completionWindow; // eslint-disable-line
      if (completionWindow && this.remindersList) { // calcyclate if remider list is not present // 
        this.remindersList.length = Number(completionWindow) - 1;
      }
    },
    updateMilestones() {
      window.localStorage.setItem("isSchedulerOpen", true);
      window.localStorage.setItem("visitId", 0);
      window.localStorage.setItem("designIndex", 11);
      this.$router.push({
        name: "study-design",
        params: { studyId: this.studyId }
      });
    },
    selectUnselectFrequency(frequency) {
      this.telehealthVisit.scheduler.frequency = frequency;
      this.$forceUpdate();
    },
    skipForNow() {
      this.$router.push({
        name: "survey-as-template",
        params: { studyId: this.studyId, surveyId: this.surveyId }
      });
    },
    allowUntilDurationChanges(allowUntillDuration) {
      if (allowUntillDuration) {
        this.telehealthVisit.scheduler.duration[
          this.telehealthVisit.scheduler.duration.length - 1
        ].endDay = null;
      }
    },
    addAnotherDuration() {
      this.telehealthVisit.scheduler.duration.push({
        startDay: null,
        endDay: null
      });
      this.$forceUpdate();
    },
    removeDuration(index) {
      this.telehealthVisit.scheduler.duration.splice(index, 1);
      this.$forceUpdate();
    },
    getExactDayEpoch(day) {
      day = new Date(day); // eslint-disable-line
      return new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        0,
        0,
        0
      ).getTime();
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
          const sd = new Date(this.studyData.firstPatientEnrollDate).valueOf();
          const ed = new Date(this.studyData.firstPatientLastDate).valueOf();
          this.studyDuration = parseInt(
            (this.getExactDayEpoch(ed) - this.getExactDayEpoch(sd)) /
              1000 /
              86400,
            10
          ); // eslint-disable-line
          _.forEach(this.frequencies, val => {
            switch (val.type) {
              case "daily":
                val.disabled = this.studyDuration < 1; // eslint-disable-line
                break;
              case "weekly":
                val.disabled = this.studyDuration < 7; // eslint-disable-line
                break;
              case "biweekly":
                val.disabled = this.studyDuration < 15; // eslint-disable-line
                break;
              case "monthly":
                val.disabled = this.studyDuration < 30; // eslint-disable-line
                break;
              case "biannually":
                val.disabled = this.studyDuration < 180; // eslint-disable-line
                break;
              case "annually":
                val.disabled = this.studyDuration < 365; // eslint-disable-line
                break;
              default:
                break;
            }
          });
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    findMinDiff(s) {
      let m, i, j, v; // eslint-disable-line
      s = eval(s); // eslint-disable-line
      m = Math.abs(s[(i = 0)] - s[(j = 1)]);
      for (; i < s.length; i++) {
        j = i;
        for (++j; j < s.length; ++j) {
          const newV = Math.abs(s[i] - s[j]);
          m = newV < m ? newV : m;
        }
      }
      return m; // eslint-disable-line
    },
    isSorted(arr) {
      const len = arr.length - 1;
      for (let i = 0; i < len; ++i) {
        // eslint-disable-line
        if (arr[i] > arr[i + 1]) {
          return false;
        }
      }
      return true;
    },
    validateCustomType(scheduler, properList) {
      if (
        scheduler.advanceScheduleDays === null ||
        scheduler.advanceScheduleDays === undefined ||
        scheduler.advanceScheduleDays < 0 ||
        scheduler.advanceScheduleDays % 1 !== 0 ||
        scheduler.advanceScheduleDays > 99
      ) {
        toastr.error(
          "Advance scheduling days should be between 0 and 99, and cannot have decimals"
        );
        return false;
      }
      let minDuration = 365;
      for (let i = 0; i < properList.length / 2; i++) {
        if (
          properList[i + i + 2] &&
          properList[i + i + 1] &&
          minDuration > properList[i + i + 2] - properList[i + i + 1]
        ) {
          minDuration = properList[i + i + 2] - properList[i + i + 1] - 1;
        }
      }
      const fcwDiff = scheduler.frequency.days - scheduler.completionWindow;
      minDuration = minDuration > fcwDiff ? fcwDiff : minDuration;
      if (scheduler.advanceScheduleDays > minDuration) {
        if (minDuration !== 0) {
          toastr.error(
            `Number of advanced days can be between 0 and ${minDuration}`
          );
        } else if (minDuration === 0) {
          toastr.error("Number of advanced days can be 0 only");
        }
      }
      return scheduler.advanceScheduleDays <= minDuration;
    },
    validateMilestoneType(possibleVal, valid, scheduler, mArr, milestones) {
      let validScheduler = valid;
      let minDiff = null;
      if (
        possibleVal &&
        validScheduler &&
        (scheduler.advanceScheduleDays === null ||
          scheduler.advanceScheduleDays === undefined ||
          scheduler.advanceScheduleDays < 0 ||
          scheduler.advanceScheduleDays % 1 !== 0)
      ) {
        validScheduler = false;
        toastr.error(
          scheduler.advanceScheduleDays
            ? "Advance days cannot have decimals"
            : "Please enter advance days"
        );
      }
      if (mArr.length !== 0) {
        // when multiple milestones are selected
        const milestoneArr = _.sortBy(mArr);
        const diffArr = [];
        for (let i = 1; i < milestoneArr.length; i++) {
          // eslint-disable-line
          diffArr[i - 1] =
            milestoneArr[i] -
            (milestoneArr[i - 1] + scheduler.completionWindow); // eslint-disable-line
        }
        minDiff = _.min(diffArr);
      } else {
        // when one milestone is selected
        minDiff = milestones[0] !== 0 ? milestones[0] - 1 : 0;
      }
      if (scheduler.milestones.length === 1) {
        minDiff = scheduler.milestones[0]; // eslint-disable-line
      }
      if (scheduler.advanceScheduleDays > minDiff) {
        if (minDiff !== 0) {
          // eslint-disable-line
          toastr.error(
            `Number of advanced days can be between 0 and ${minDiff}`
          );
        } else if (minDiff === 0) {
          // eslint-disable-line
          toastr.error("Number of advanced days can be 0 only");
        }
      }
      return scheduler.advanceScheduleDays <= minDiff && validScheduler;
    },
    checkValidation(originalScheduler, originalTelehealthVisisDTO) {
      const scheduler = { ...originalScheduler };
      const telehelathVisit = { ...originalTelehealthVisisDTO };

      if(this.remindersListTeleHealth.callReminders || this.remindersListTeleHealth.reminders) {
        scheduler.callReminders = this.remindersListTeleHealth.callReminders.length > 0 ? this.remindersListTeleHealth.callReminders : [] ;
        scheduler.reminders = this.remindersListTeleHealth.reminders.length > 0 ? this.remindersListTeleHealth.reminders : [] ;
      }
      
      if (this.telehealthVisit.telehealthVisitDTO.title == undefined || this.telehealthVisit.telehealthVisitDTO.title == "" || this.telehealthVisit.telehealthVisitDTO.title == null) {
        toastr.error("Visit name is required");
      } 
      else if(!this.telehealthVisit.telehealthVisitDTO.activityName || this.telehealthVisit.telehealthVisitDTO.activityName.trim()==""){
        toastr.error("Activity name is required");
      }
      else if(this.telehealthVisit.telehealthVisitDTO.activityName.trim().length>this.maxChar){
        toastr.error(`Activity name must be under ${this.maxChar} characters`);
      }
      else if (this.telehealthVisit.telehealthVisitDTO.visitType == undefined || this.telehealthVisit.telehealthVisitDTO.visitType == "" || this.telehealthVisit.telehealthVisitDTO.visitType == null) {
        toastr.error("Please select a visit type");
      }
      else if(this.telehealthVisit.telehealthVisitDTO.extendAvailability==true && (this.telehealthVisit.telehealthVisitDTO.extendWindow == "" || this.telehealthVisit.telehealthVisitDTO.extendWindow < 0)){
        toastr.error("Please specify the # of extra days");
      } 
      else {
        telehelathVisit.title = this.telehealthVisit.telehealthVisitDTO.title;
        telehelathVisit.activityName = this.telehealthVisit.telehealthVisitDTO.activityName;

        scheduler.taskId = this.surveyId ? this.surveyId : ""; // eslint-disable-line
        scheduler.taskType = this.options.validateFor; // eslint-disable-line
        let milestoneArr = [];
        let minDiff = null;
        let possibleVal = null;
        let validScheduler = true;
        let allDaysList = null;
        let properList = null;
        let durationValues = null;
        scheduler.completionWindow = scheduler.completionWindow
          ? Number(scheduler.completionWindow)
          : null; // eslint-disable-line
        if (this.options.validateFor === "telehealthv2") {
          scheduler.advanceScheduleDays =
            scheduler.advanceScheduleDays || scheduler.advanceScheduleDays === 0
              ? Number(scheduler.advanceScheduleDays)
              : null; // eslint-disable-line
          scheduler.taskId = this.taskId; // eslint-disable-line
        }
        scheduler.taskType = "telehealth"; // eslint-disable-line
        scheduler.taskTitle = this.telehealthVisit.telehealthVisitDTO.activityName;

        switch (scheduler.type) {
          case "milestone":
            if (scheduler.taskType !== "notification") {
              if (!scheduler.milestones || scheduler.milestones.length <= 0) {
                toastr.error("Please select a milestone");
                validScheduler = false;
              } else if (
                !scheduler.completionWindow ||
                scheduler.completionWindow <= 0 ||
                scheduler.completionWindow % 1 !== 0
              ) {
                validScheduler = false;
                toastr.error(
                  "Please specify completion window with value greater than 0"
                );
              } else if (this.studyDuration <= scheduler.completionWindow) {
                validScheduler = false;
                toastr.error(
                  "Specified completion window cannot exceed study duration"
                );
              } else if (scheduler.milestones.length === 1) {
                possibleVal = this.studyDuration - scheduler.milestones[0] - 1;
                possibleVal = possibleVal === 0 ? 1 : possibleVal;
                if (possibleVal < scheduler.completionWindow) {
                  validScheduler = false;
                  toastr.error('Specified completion window overlaps with another milestone');
                } else if (scheduler.taskType === 'truclinic' && scheduler.advanceScheduleDays > 99) {
                  validScheduler = false;
                  toastr.error('Advanced days cannot be more than 99');
                }
              } else if (
                scheduler.taskType === "telehealth" &&
                (scheduler.advanceScheduleDays === null ||
                  scheduler.advanceScheduleDays === undefined)
              ) {
                validScheduler = false;
                toastr.error("Please enter value for advanced days");
              } else {
                milestoneArr = _.map(scheduler.milestones, _.ary(parseInt, 1));
                milestoneArr.sort();
                minDiff = this.findMinDiff(milestoneArr);
                possibleVal = minDiff;
                possibleVal = possibleVal === 0 ? 1 : possibleVal;
                if (possibleVal < scheduler.completionWindow) {
                  validScheduler = false;
                  toastr.error(
                    "Specified completion window overlaps with another milestone"
                  );
                }
              }
            } else if (scheduler.milestones.length <= 0) {
              // for notifications only
              toastr.error("Please select a milestone");
              validScheduler = false;
            }
            if (
              validScheduler &&
              scheduler.taskType === "telehealth" &&
              !this.validateMilestoneType(
                possibleVal,
                validScheduler,
                scheduler,
                milestoneArr,
                scheduler.milestones
              )
            ) {
              validScheduler = false;
            }
            if (validScheduler) {
              const dispatchObj = new Object();
              dispatchObj.schedulerObj = scheduler;
              dispatchObj.telehelathVisitObj = telehelathVisit;
              this.$store.dispatch("telehealthVisitAction", {
                validatedFor: this.options.validateFor,
                telehealthVisitObj: dispatchObj
              });
            }
            break;
          case "custom":
            this.$validator.validateAll().then(valid => {
              scheduler.frequency = scheduler.frequency
                ? scheduler.frequency
                : { type: null, title: null, days: null }; // eslint-disable-line
              durationValues = _.map(scheduler.duration, item => ({
                // eslint-disable-line
                startDay: parseFloat(item.startDay),
                endDay: parseFloat(item.endDay)
              })); // eslint-disable-line
              allDaysList = _.flatten(
                _.map(durationValues, o => [o.startDay, o.endDay])
              ); // eslint-disable-line
              properList = _.compact(allDaysList);
              properList =
                scheduler.allowUntillDuration && properList % 2 === 0
                  ? _.dropRight(properList)
                  : properList; // eslint-disable-line
              if (
                scheduler.taskType !== "notification" &&
                (!scheduler.frequency.type || !scheduler.completionWindow)
              ) {
                toastr.error(
                  !scheduler.frequency.type
                    ? "Please select a frequency"
                    : "Please specify completion window"
                );
              } else if (
                scheduler.taskType === "notification" &&
                !scheduler.frequency.type
              ) {
                toastr.error("Please select a frequency");
              } else if (
                scheduler.taskType !== "notification" &&
                (scheduler.completionWindow <= 0 ||
                  scheduler.completionWindow % 1 !== 0)
              ) {
                toastr.error(
                  "Completion window should be greater than 0 and cannot have decimals"
                );
              } else if (
                scheduler.taskType !== "notification" &&
                scheduler.completionWindow > scheduler.frequency.days
              ) {
                toastr.error(
                  "Completion window cannot exceed the length of the frequency"
                );
              } else if (
                !scheduler.allowUntillDuration &&
                allDaysList.length !== properList.length &&
                (!scheduler.allowUntillDuration &&
                  allDaysList.length !== properList.length - 1)
              ) {
                toastr.error(
                  "Start and End days should be greater than 0 and cannot have decimals"
                );
              } else if (this.errors.any() && !valid) {
                toastr.error(
                  "Start/End day should be greater than 0 and cannot have decimals"
                );
              } else if (!this.isSorted(properList)) {
                toastr.error(
                  "Start and end days should be in increasing order."
                );
              } else if (_.uniq(properList).length !== properList.length) {
                toastr.error(
                  "Scheduled start and end days overlap. Please revise."
                );
              } else if (_.max(properList) > this.studyDuration) {
                toastr.error(
                  "Start and end day should be less than study duration"
                );
              } else if (
                scheduler.taskType === "telehealth" &&
                (scheduler.advanceScheduleDays === null ||
                  scheduler.advanceScheduleDays === undefined)
              ) {
                toastr.error("Please enter value for advance days");
              } else if (
                scheduler.taskType === "telehealth" &&
                !this.validateCustomType(scheduler, properList)
              ) {
                //toastr.error("Invalid values");
              } else {
                const dispatchObj = new Object();
                dispatchObj.schedulerObj = scheduler;
                dispatchObj.telehelathVisitObj = telehelathVisit;
                this.$store.dispatch("telehealthVisitAction", {
                  validatedFor: this.options.validateFor,
                  telehealthVisitObj: dispatchObj
                });
              }
            });
            break;
          default:
            break;
        }
      }
    },
    addVisit() {
      this.$store.dispatch("telehealthVisitAction", {
        validateFor: "telehealthv2"
      });
    },
    deleteVisit(visit) {
      swal({
        title: "Are you sure you want to cancel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          //nprogress.start();
          //TODO save the Visit
          this.$emit("exit");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.bg-green {
  background-color: #2ecc71 !important;
}

.bg-red {
  background-color: #ff7171 !important;
}
.scheduler-heading {
  font-weight: 600;
  color: #666769;
}

.container-style {
  border-radius: 2px;
  background-color: #ffffff;
  color: #666769;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.study_duration {
  display: inline-block;
  color: #4c8ce4;
  background-color: #edf3fc;
  padding: 2px 5px;
  border-radius: 2px;
}
.completion_window_days {
  width: 100px;
  display: inline-block;
}
.example {
  margin: 40px 40px 20px 40px;
}
.example-content {
  padding: 20px 40px 20px 40px;
}
.bg-milestone {
  background-color: #f5f8fa;
}
.example-header {
  padding: 20px 80px 10px 80px;
  font-weight: bold;
}

.milestone_box {
  border: 1px solid #34537d;
  width: 60px;
  height: 10px;
  padding-top: 1px;
  padding-bottom: 9px;
  border-radius: 100px;
  background-color: #34537d;
}
.disabled_frequency {
  pointer-events: none;
  background-color: #ddd !important;
}
.scheduler_types {
  margin-top: 8px;
  .scheduler_type {
    cursor: pointer;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 2px;
    min-height: 52px;
    display: inline-block;
    background-color: #fff;
  }
  .scheduler_type:not(:first-child) {
    margin-left: 10px;
  }
  .type_icon_bg {
    background-color: #ddd;
    width: 28px;
    height: 28px;
    display: inline-block;
    border-radius: 100%;
    padding: 3px;
    text-align: center;
  }
  .active_item {
    border: 1px solid #32557a;
    background-color: #32557a;
    color: #fff;
    .type_icon_bg {
      background-color: #488ee1;
    }
  }
}
.day_label {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #888;
  background-color: #fafafa;
  background-image: none;
  border: 1px solid #ccc;
}
.milestone {
  padding: 0px 12px 0px 120px;
}

.circle {
  width: 7px;
  height: 8px;
  background-color: white;
  border-radius: 100px;
  margin-left: 3px;
}

.milestone_card {
  cursor: pointer;
  min-width: 160px;
  border: solid 1px #d3dfe4;
  background-color: #fff;
  border-radius: 2px;
  display: inline-block;
  padding: 8px 10px;
  margin: 0 10px 10px 0;
  min-height: 52px;
}
.selected_milestone {
  background-color: #32557a;
  border-radius: 4px;
  min-height: 52px;
  color: #fff;
  position: relative;
  .fa {
    position: absolute;
    right: 10px;
    top: 8px;
    font-size: 32px;
    color: #488ee1;
  }
  .day_text {
    color: #ddd;
    font-size: 12px;
  }
}
.day_text {
  color: #999;
  font-size: 12px;
}
.edit_milestone_link {
  font-size: 12px;
  padding-left: 10px;
  position: relative;
  color: #4c8ce3;
  cursor: pointer;
}
.add_another_btn {
  font-size: 12px;
  background-color: transparent;
  border-color: #f06559;
  color: #f06559;
  margin-bottom: 20px;
  max-width: 180px;
}

.create_milestone_btn {
  font-size: 12px;
  background-color: #f06559;
  border-color: #f06559;
  color: #fff;
  margin-bottom: 20px;
  max-width: 180px;
}

.disabled-bg {
  pointer-events: none;
  // background-color: #e7ebef;
  /deep/ input {
    // color: red;
    background-color: #e7ebef;
  }
}
.time-picker input.display-time {
  background-color: #e7ebef;
  border-radius: 2px;
}
.pt-40 {
  padding-top: 40px;
}

.form-control {
  border-radius: 2px;
}

.text-color {
  color: #888;
}

.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 24px;
}

.card {
  padding: 15px;
  color: black;
}
//New css added
.telehealth-v2 {
  .scheduler-heading {
    color: #4a4a4a;
  }
  .scheduler_types .scheduler_type:not(:first-child),  .visit-types .type:not(:first-child){
    margin-left: 0;
    margin-right: 10px;
  }
  .scheduler_types .type_icon_bg {
    vertical-align: middle;
    padding: 6px;
  }
  .scheduler_types .scheduler_type {
    border-radius: 4px;
    padding: 11px 15px;
  }
  button {
    &.btn-primary {
      background-color: #1e8fe1;
      border-color: #1e8fe1;
    }
  }
  .btn {
    min-width: 100px;
    height: 34px;
    line-height: inherit;
  }
  .col-md-4 {
    padding-left: 0;
  }
  .col-sm-6,
  .col-md-6,
  .col-lg-3 {
    padding-left: 0px;
    padding-right: 0px;
  }
  .fa-info-circle{
    color: #B4BBBF;
  }

  .visit-types {
    margin-top: 8px;
    .type {
      cursor: pointer;
      border: 1px solid #ccc;
      padding: 10px 15px;
      border-radius: 4px;
      min-height: 52px;
      display: inline-block;
      background-color: #fff;
      .icon{
        position: relative;
        vertical-align: middle;
        display: inline-block;
      }

      .type-telehealth{
        background: url("/static/img/telehealth/visit-type-telehealth.svg") no-repeat center;
        height: 30px;
        width: 32px;  
      }

      .in-person{
        background: url("/static/img/telehealth/in-person.svg") no-repeat center;
        height: 30px;
        width: 32px;  
      }

      .both{
        background: url("/static/img/telehealth/Config_Both_off.svg") no-repeat center;
        height: 30px;
        width: 59px;  
      }

      &.active_item{
        .type-telehealth{
          background: url("/static/img/telehealth/visit-type-telehealth-active.svg") no-repeat center;
          height: 30px;
          width: 30px;
        }
        .in-person{
          display: inline-block;
          background: url("/static/img/telehealth/in-person-active.svg") no-repeat center;
          height: 30px;
          width: 32px;  
        }
        .both{
          background: url("/static/img/telehealth/Config_Both_on.svg") no-repeat center;
          height: 30px;
          width: 59px;  
        }
      }

    }
    
    /* .type_icon_bg {
      background-color: #ddd;
      width: 28px;
      height: 28px;
      display: inline-block;
      border-radius: 100%;
      padding: 3px;
      text-align: center;
    } */
    .active_item {
      border: 1px solid #32557a;
      background-color: #32557a;
      color: #fff;
      /* .type_icon_bg {
        background-color: #488ee1;
      } */
    }
}

}

.popover{
  font-size:12px !important;
  font-family:'Lato-regular' !important;  
}

.popover-body{
  color:#666666 !important;
}

#extended-availability{
  input[type="checkbox"]{
    vertical-align: middle;
  }
}
</style>
