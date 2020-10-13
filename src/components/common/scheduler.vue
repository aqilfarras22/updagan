<template>
  <div class="scheduler_section">
    <div class="scheduler_types">
      <span class="scheduler_type" :class="{'active_item': scheduler.type === 'milestone'}" v-on:click="changeType('milestone')">
        <span class="type_icon_bg">
          <i class="fa fa-flag-o" aria-hidden="true"></i>
        </span> &nbsp; Milestones
      </span>
      <span class="scheduler_type" :class="{'active_item': scheduler.type === 'custom'}" v-on:click="changeType('custom')">
        <span class="type_icon_bg">
          <i class="fa fa-sliders" aria-hidden="true"></i>
        </span> &nbsp; Custom frequency
      </span>
    </div>
    <div class="pt-40" v-if="scheduler.type === 'milestone'">
      <div v-if="studyData.milestones && studyData.milestones.length > 0">
        <div class="scheduler-heading  pb-5">Which milestones will your particpants take this survey?
          <span class="edit_milestone_link" v-on:click="updateMilestones()">Edit milestones</span>
        </div>
        <div :class="{'selected_milestone': (scheduler.milestones && scheduler.milestones.indexOf(milestone) >= 0)}" class="milestone_card" :key="index" v-for="(milestone, index) in studyData.milestones" v-on:click="selectUnselectMileStone(milestone)">
          <p class="m-0">Milestone {{index + 1}}</p>
          <p class="m-0 day_text">Day {{milestone}}</p>
          <i v-if="scheduler.milestones && scheduler.milestones.indexOf(milestone) >= 0" class="fa fa-check-circle" aria-hidden="true"></i>
        </div>
        <div class="" v-if="options.validateFor !== 'telehealth' && options.validateFor !== 'notification'">
          <label class="fw-normal">
            <input type="checkbox" name="allowMultipleTimes" v-model="scheduler.allowMultipleTimes" class="checkbox_position" @change="updateShowDailySummary()"/>
            <span class=""> Allow participants to repeat
              <span v-if="options.validateFor === 'survey'">survey</span>
              <span v-else>activity</span> each time it is present</span>
          </label>
          <label class="fw-normal" :class="{'opacity-change':  !scheduler.allowMultipleTimes }">
            <input type="checkbox" name="showDailySummary" v-model="scheduler.showDailySummary" class="checkbox_position" :disabled="!scheduler.allowMultipleTimes"/>
            <span>
              Show participants a summary of their daily activity completion at the start of the activity. Available only for repeatable tasks.</span>
          </label>
          <div class="view-screen" :class="{'opacity-change':  !scheduler.allowMultipleTimes }">
          <span v-if="scheduler.allowMultipleTimes" data-toggle="modal" data-target="#screen-modal" class="cursor_pointer">View Daily Activity Completion Screen</span>
          <span v-else>View Daily Activity Completion Screen</span>
          </div>
        <div id="screen-modal" class="modal fade modal-position" role="dialog">
        <div class="modal-dialog">
          <!-- Modal content-->
          <div class="modal-content"><img src="static/img/repeatable-activity-example.png"/>
          </div>
        </div>
      </div>
        </div>
        <div class="row" v-if="options.validateFor !== 'notification'">
          <div class="col-sm-4 p-0">
            <div class="pt-40">
              <div class="scheduler-heading ">What is the completion window?
                <a class="color_grey cursor_pointer" data-toggle="modal" data-target="#completionModal">
                  <i class="fa fa-info-circle p-1"></i>
                </a>
              </div>
              <input type="number" min="1" class="form-control completion_window_days input-color" placeholder="Enter" v-model="scheduler.completionWindow" v-on:blur="calculateReminders(scheduler.completionWindow, scheduler.advanceScheduleDays)"> days
            </div>
          </div>
          <div class="col-sm-8 p-0" v-if="options.validateFor === 'telehealth'">
            <div class="pt-40">
              <div class="scheduler-heading">How far in advance can a participant schedule their Telehealth visit?
                <a class="color_grey cursor_pointer" data-toggle="modal" data-target="#completionModal">
                  <i class="fa fa-info-circle p-1"></i>
                </a>
              </div>
              <input type="number" min="1" max="99" class="form-control completion_window_days" placeholder="Enter" v-model="scheduler.advanceScheduleDays" v-on:blur="calculateReminders(scheduler.completionWindow, scheduler.advanceScheduleDays)"> days
            </div>
          </div>
        </div>
        <div class="pt-40" v-if="options.validateFor !== 'notification'">
          <div class="scheduler-heading ">Set reminders (mobile notifications)</div>
          <!--<div v-if="options.validateFor === 'telehealth'">
            <div>Reminders (email notifications)</div>
            <div class="fs-12 color_666669">These notificaitons are non-editable.</div>
          </div>-->
          <div class="row pt-5 fs-12 color_959fa4">
            <div class="col-md-2 pl-0">
              <!--<div v-if="options.validateFor !== 'telehealth'">Select day</div>-->
              <div>Select day</div>
            </div>
            <div class="col-md-6 pl-0">
              <!--<div v-if="options.validateFor !== 'telehealth'">Enter message</div>-->
              <div>Enter message</div>
            </div>
            <div class="col-md-2 pl-0">
              <!--<div v-if="options.validateFor !== 'telehealth'">Select time of day</div>-->
              <div>Select time of day</div>
            </div>
            <div class="col-md-2 pl-0 color_red pt-5"></div>
          </div>
          <div class="row" v-for="(reminder, index) in reminderList" :key="index">
            <div class="col-md-2 pl-0">
              <div class="form-group">
                <select name="day" class="form-control input-md text-color display-day input-color" v-model="reminder.day" :disabled="!scheduler.completionWindow">
                  <option :value="-(remindersListTeleHealth.length - typeIndex)" v-for="(type, typeIndex) in remindersListTeleHealth" :key="typeIndex">-{{remindersListTeleHealth.length - typeIndex}} days</option>
                  <option value="default" disabled>-select day-</option>
                  <option value="0">Day of</option>
                  <option :value="typeIndex + 1" v-for="(type, typeIndex) in remindersList" :key="typeIndex">+{{typeIndex + 1}} days</option>
                </select>
              </div>
            </div>
            <div class="col-md-6 pl-0">
              <input type="text" class="form-control input-color" v-model="reminder.message" :disabled="!scheduler.completionWindow">
            </div>
            <div class="col-md-2 pl-0 scheduler">
              <vue-timepicker format="hh:mm A" :minute-interval="10" value="reminder.time" v-model="reminder.time" :class="{'disabled-bg': !scheduler.completionWindow }" :disabled="!scheduler.completionWindow" required></vue-timepicker>
              <span v-show="errors.has('reminderTime')" class="error-style">Select notification time.</span>
            </div>
            <div class="col-md-2 pl-0 color_red pt-5 cursor_pointer" v-on:click="removeReminder(index)">Remove</div>
          </div>
          <div>
            <button type="button" class="btn btn-md btn-block add_another_btn br-4" v-on:click="addReminder()">Add a reminder</button>
          </div>
        </div>
      </div>
      <div v-if="!studyData.milestones || studyData.milestones.length == 0">
        <button type="button" class="btn btn-md btn-block create_milestone_btn br-25" v-on:click="updateMilestones()">Create milestones</button>
      </div>
    </div>

    <div class="pt-40" v-if="scheduler.type === 'custom'">
      <div class="pb-5 scheduler-heading">What frequency will your partcipants take this survey?</div>
      <div :class="{'selected_milestone': (scheduler.frequency && scheduler.frequency.type && (f.type === scheduler.frequency.type)), 'disabled_frequency':f.disabled}" class="milestone_card" :key="index" v-for="(f,index) in frequencies" v-on:click="selectUnselectFrequency(f)">
        <p class="m-0 pt-5">{{f.title}}</p>
        <i v-if="(scheduler.frequency && scheduler.frequency.type) && (f.type === scheduler.frequency.type)" class="fa fa-info-circle p-1" aria-hidden="true"></i>
      </div>
      <div class="" v-if="options.validateFor !== 'telehealth' && options.validateFor !== 'notification'">
        <label class="fw-normal">
          <input type="checkbox" name="allowMultipleTimes" v-model="scheduler.allowMultipleTimes" class="checkbox_position" @change="updateShowDailySummary()"/>
          <span class=""> Allow participants to repeat survey each time it is present</span>
        </label>
        <label class="fw-normal" :class="{'opacity-change':  !scheduler.allowMultipleTimes }">
            <input type="checkbox" name="showDailySummary" v-model="scheduler.showDailySummary" class="checkbox_position" :disabled="!scheduler.allowMultipleTimes"/>
            <span> Show participants a summary of their daily activity completion at the start of the activity. Available only for repeatable tasks.</span>
          </label>
          <div class="view-screen" :class="{'opacity-change':  !scheduler.allowMultipleTimes }">
          <span v-if="scheduler.allowMultipleTimes" data-toggle="modal" data-target="#screen-modal" class="cursor_pointer">View Daily Activity Completion Screen</span>
          <span v-else>View Daily Activity Completion Screen</span>
          </div>
      </div>
        <div id="screen-modal" class="modal fade modal-position" role="dialog">
        <div class="modal-dialog">
          <!-- Modal content-->
          <div class="modal-content"><img src="static/img/repeatable-activity-example.png"/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4 p-0" v-if="options.validateFor !== 'notification'">
          <div class="pt-40">
            <div class="scheduler-heading">What is the completion window?
              <a class="color_grey cursor_pointer" data-toggle="modal" data-target="#completionModal">
                <i class="fa fa-info-circle p-1"></i>
              </a>
            </div>
            <input type="number" min="1" class="form-control completion_window_days input-color" placeholder="Enter" v-model="scheduler.completionWindow" v-on:blur="calculateReminders(scheduler.completionWindow)"> days
          </div>
        </div>
        <div class="col-sm-8 p-0" v-if="options.validateFor === 'telehealth'">
          <div class="pt-40">
            <div class="scheduler-heading">How far in advance can a participant schedule their Telehealth visit?
              <a class="color_grey cursor_pointer" data-toggle="modal" data-target="#completionModal">
                <i class="fa fa-info-circle p-1"></i>
              </a>
            </div>
            <input type="number" min="1" max="99" class="form-control completion_window_days" placeholder="Enter" v-model="scheduler.advanceScheduleDays" v-on:blur="calculateReminders(scheduler.completionWindow, scheduler.advanceScheduleDays)"> days
          </div>
        </div>
      </div>
      <div class="pt-40">
        <div class="scheduler-heading">Select time period this survey should appear
          <span class="study_duration">Study ends on day {{studyDuration}}</span>
        </div>
        <div class="pb-15" v-for="(item, index) in scheduler.duration" :key="index">
          <div class="row fs-12 color_959fa4">
            <div class="col-md-2 pl-0">Start</div>
            <div class="col-md-6 pl-0">End</div>
          </div>
          <div class="row">
            <div class="col-md-1 pl-0 pr-0">
              <span class="day_label">Day</span>
            </div>
            <div class="col-md-1 pl-0">
              <input type="number" v-validate="'required|min_value:1'" name="startDay" min="1" class="form-control" v-model="item.startDay">
            </div>
            <div class="col-md-1 pl-0 pr-0">
              <span class="day_label">Day</span>
            </div>
            <div class="col-md-1 pl-0">
              <input type="number" min="1" class="form-control" v-validate="'required|min_value:1'" name="endDay" v-model="item.endDay" :disabled="scheduler.allowUntillDuration && (index + 1) === scheduler.duration.length">
            </div>
            <div class="col-md-2 pl-0 color_blue cursor_pointer pt-5" v-on:click="addAnotherDuration(index)" v-if="scheduler.duration.length === (index + 1) && !scheduler.allowUntillDuration">Add another time period</div>
            <div class="col-md-2 pl-0 color_red cursor_pointer pt-5" v-on:click="removeDuration(index)" v-if="scheduler.duration.length !== (index + 1)">Remove</div>
          </div>
        </div>
        <div class="pt-10">
          <label class="fw-normal">
            <input type="checkbox" class="checkbox_position" name="allowUntillDuration" v-model="scheduler.allowUntillDuration" v-on:change="allowUntilDurationChanges(scheduler.allowUntillDuration)" />
            <span class=""> Available until the end of participant's study duration</span>
          </label>
        </div>
      </div>
      <div class="pt-40" v-if="options.validateFor !== 'notification'">
        <div class="scheduler-heading" v-if="options.validateFor !== 'telehealth'">Set reminders (mobile notifications)</div>
        <!--<div v-if="options.validateFor === 'telehealth'">
          <div>Reminders (email notifications)</div>
          <div class="fs-12 color_666669">These notificaitons are non-editable.</div>
        </div>-->
        <div class="row pt-5 fs-12 color_959fa4">
          <div class="col-md-2 pl-0">
            <!--<div v-if="options.validateFor !== 'telehealth'">Select day</div>-->
            <div>Select day</div>
          </div>
          <div class="col-md-6 pl-0">
            <!--<div v-if="options.validateFor !== 'telehealth'">Enter message</div>-->
            <div>Enter message</div>
          </div>
          <div class="col-md-2 pl-0">
            <!--<div v-if="options.validateFor !== 'telehealth'">Select time of day</div>-->
            <div>Select time of day</div>
          </div>
          <div class="col-md-2 pl-0 color_red pt-5"></div>
        </div>
        <div class="row" v-for="(reminder, index) in reminderList" :key="index">
          <div class="col-md-2 pl-0">
            <div class="form-group">
              <!--<select name="day" class="form-control input-md text-color" v-model="reminder.day" :disabled="!scheduler.completionWindow">
                <option value="0">Day of</option>
                <option :value="typeIndex + 1" v-for="(type, typeIndex) in remindersList">+{{typeIndex + 1}} days</option>
              </select>-->
              <select name="day" class="form-control input-md text-color display-day  input-color" v-model="reminder.day" :disabled="!scheduler.completionWindow">
                <option :value="-(remindersListTeleHealth.length - typeIndex)" :key="typeIndex" v-for="(type, typeIndex) in remindersListTeleHealth">-{{remindersListTeleHealth.length - typeIndex}} days</option>
                <option value="default" disabled>-select day-</option>
                <option value="0">Day of</option>
                <option :value="typeIndex + 1" v-for="(type, typeIndex) in remindersList" :key="typeIndex">+{{typeIndex + 1}} days</option>
              </select>
            </div>
          </div>
          <div class="col-md-6 pl-0">
            <input type="text" class="form-control input-color" v-model="reminder.message" :disabled="!scheduler.completionWindow">
          </div>
          <div class="col-md-2 pl-0 scheduler">
            <vue-timepicker format="hh:mm A" :minute-interval="10" v-model="reminder.time" :disabled="!scheduler.completionWindow" required></vue-timepicker>
            <span v-show="errors.has('reminderTime')" class="error-style">Select notification time.</span>
          </div>
          <div class="col-md-2 pl-0 color_red pt-5 cursor_pointer" v-on:click="removeReminder(index)">Remove</div>
        </div>
        <div>
          <button type="button" class="btn btn-md btn-block add_another_btn br-4" v-on:click="addReminder()">Add a reminder</button>
        </div>
      </div>
    </div>
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
              <p class="example-header">
                When a task is assigned to the participant, you have the opportunity to set the window of completion the task before it expires.
              </p>
              <div class="bg-milestone pb-40">
                <p class="example-content text-center">
                  Example: A survey is assigned to a participant at study week 2, which for this participant happens to be a Wednesday, and a 3 day completion window has been set. The survey will be pushed to the participant on Wednesday and will be available through Friday. On Saturday morning, the survey will be removed from participant’s task list and will be reported as a missed task.
                </p>
                <div class="row milestone">
                  <div class="col-lg-2 ml-0 pl-0 mr-0 pr-0" v-for="(milestone,index) in exampleMileStone" :key="index">
                    <div class="text-center">{{milestone.day}}</div>
                    <div class="milestone_box" :class="{'white-bg': milestone.day === 'Sat' }">
                      <div class="circle" v-if="milestone.class" :class="{'bg-green': milestone.day === 'Wed', 'bg-red': milestone.day === 'Sat'}">
                      </div>
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
import toastr from 'toastr';
import _ from 'lodash';
import VueTimepicker from 'vue2-timepicker';

export default {
  name: 'scheduler',
  data() {
    return {
      studyId: null,
      surveyId: null,
      studyData: {},
      surveyData: {},
      studyDuration: null,
      taskId: null,
      milestones: [],
      frequencies: [
        { type: 'daily', title: 'Daily', days: 1, disabled: false },
        { type: 'weekly', title: 'Weekly', days: 7, disabled: false },
        { type: 'biweekly', title: 'Every 2 Weeks', days: 14, disabled: false },
        { type: 'monthly', title: 'Monthly', days: 30, disabled: false },
        { type: 'biannually', title: 'Bi-annually', days: 182, disabled: false },
        { type: 'annually', title: 'Annually', days: 365, disabled: false },
      ],
      scheduler: {
        type: 'milestone',
        milestones: [],
        frequency: { type: null, title: null, days: null },
        startDay: null,
        endDay: null,
        completionWindow: null,
        reminders: [],
        allowMultipleTimes: false,
        allowUntillDuration: false,
        showDailySummary: false,
        duration: [{ startDay: null, endDay: null }],
      },
      remindersList: [],
      remindersListTeleHealth: [],
      reminderList: [
        {
          day: 'default',
          message: null,
          time: {
            hh: '',
            mm: '',
            A: '',
          },
        },
      ],
      exampleMileStone: [{ date: 'Day1', day: 'Wed', class: 'bg-green' }, { date: 'Day2', day: 'Thur', class: '' }, { date: 'Day3', day: 'Fri', class: '' }, { date: '+2', day: 'Sat', class: 'bg-red' }],
      time: {
        hh: '',
        mm: '',
        A: '',
      },
    };
  },
  components: {
    VueTimepicker,
  },
  props: ['options'],
  computed: {
    schedulerObjChanged() {
      return this.$store.getters.getSchedulerObjData;
    },
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.getStudyDetails();
    this.getSchedulerDetails();
  },
  watch: {
    schedulerObjChanged: {
      handler(val) {
        if (val.validateFor) {
          this.checkValidation(this.scheduler);
        }
      },
    },
  },
  methods: {
    goBack() {
      window.history.back();
    },
    changeType(type) {
      this.scheduler.type = type;
      this.reminderList = [
        {
          day: 'default',
          message: null,
          time: {
            hh: '',
            mm: '',
            A: '',
          },
        },
      ];
      this.calculateReminders(this.scheduler.completionWindow, null) ;
    },
    getSchedulerDetails() {
      switch (this.options.validateFor) {
        case 'survey':
          this.getSurveyDetails();
          break;
        case 'epro':
          this.getSurveyDetails();
          break;
        case 'edro':
          this.scheduler = this.options && this.options.scheduler ? this.options.scheduler : this.scheduler; // eslint-disable-line
          this.reminderList = this.scheduler.reminders && this.scheduler.reminders.length > 0 ? this.scheduler.reminders : this.reminderList; // eslint-disable-line
          this.reminderList.forEach(val => {
            const timeVal = val.time;
            const [hm, a] = timeVal.split(' ');
            const [hh, mm] = hm.split(':');
            val.time = { // eslint-disable-line
              hh: '',
              mm: '',
              A: '',
            };
            val.time.hh = hh; // eslint-disable-line
            val.time.mm = mm; // eslint-disable-line
            val.time.A = a; // eslint-disable-line
          });
          this.calculateReminders(this.scheduler.completionWindow, null);
          break;
        case 'notification':
          if (this.options.scheduler) {
            this.scheduler = this.options.scheduler;
          }
          break;
        case 'telehealth':
          this.getTruClinicDetails();
          break;
        default:
      }
    },
    getTruClinicDetails() {
      this.$api.getTruClinicDetailsFact(this.studyId).then(
        response => {
          if (response.body.taskId) {
            this.scheduler = response.body;
            if (!this.scheduler.duration || this.scheduler.duration.length === 0) {
              this.scheduler.duration = [{ startDay: null, endDay: null }];
            }
            this.taskId = response.body.taskId;
            this.reminderList = this.scheduler.reminders && this.scheduler.reminders.length > 0 ? this.scheduler.reminders : this.reminderList; // eslint-disable-line
            this.reminderList.forEach(val => {
              const [hm, a] = val.time.split(' ');
              const [hh, mm] = hm.split(':');
              val.time = { // eslint-disable-line
                hh: '',
                mm: '',
                A: '',
              };
              val.time.hh = hh; // eslint-disable-line
              val.time.mm = mm; // eslint-disable-line
              val.time.A = a; // eslint-disable-line
            });
            this.calculateReminders(this.scheduler.completionWindow, this.scheduler.advanceScheduleDays); // eslint-disable-line
          }
        },
        error => {
          toastr.error(error.body ? error.body.message : 'Error while getting the study details');
        },
      );
    },
    selectUnselectMileStone(milestone) {
      if (!this.scheduler.milestones) {
        this.scheduler.milestones = [];
      }
      if (this.scheduler
        && this.scheduler.milestones
        && this.scheduler.milestones.indexOf(milestone) < 0) {
        this.scheduler.milestones.push(milestone);
      } else {
        this.scheduler.milestones.splice(this.scheduler.milestones.indexOf(milestone), 1);
      }
      this.$forceUpdate();
    },
    calculateReminders(completionWindow, advanceScheduleDays) {
      completionWindow = Number(completionWindow) === 0 ? 1 : completionWindow; // eslint-disable-line
      if (completionWindow) {
        this.remindersList.length = Number(completionWindow) - 1;
      }
      if (advanceScheduleDays && parseInt(advanceScheduleDays, 10) > 99) {
        toastr.error('Advanced days cannot be more than 99');
      } else {
        advanceScheduleDays = Number(advanceScheduleDays) ? advanceScheduleDays : 0; // eslint-disable-line
        if (advanceScheduleDays) {
          this.remindersListTeleHealth.length = Number(advanceScheduleDays);
        }
      }
      this.$forceUpdate();
    },
    updateMilestones() {
      window.localStorage.setItem('designIndex', 12);
      this.$router.push({ name: 'study-design', params: { studyId: this.studyId } });
    },
    selectUnselectFrequency(frequency) {
      this.scheduler.frequency = frequency;
      this.$forceUpdate();
    },
    addReminder() {
      this.reminderList.push({
        day: 'default',
        message: null,
        time: {
          hh: '',
          mm: '',
          A: '',
        },
      });
    },
    removeReminder(index) {
      this.reminderList.splice(index, 1);
      if (this.reminderList.length === 0) {
        this.addReminder();
      }
    },
    skipForNow() {
      this.$router.push({
        name: 'survey-as-template',
        params: { studyId: this.studyId, surveyId: this.surveyId },
      });
    },
    allowUntilDurationChanges(allowUntillDuration) {
      if (allowUntillDuration) {
        this.scheduler.duration[this.scheduler.duration.length - 1].endDay = null;
      }
    },
    addAnotherDuration() {
      this.scheduler.duration.push({ startDay: null, endDay: null });
      this.$forceUpdate();
    },
    removeDuration(index) {
      this.scheduler.duration.splice(index, 1);
      this.$forceUpdate();
    },
    getSurveyDetails() {
      let self = this;
      this.$api.getSurveyDetailsFact(this.studyId, this.surveyId).then(
        response => {
          self.surveyData = response.body;
          self.scheduler = response.body.scheduler ? response.body.scheduler : self.scheduler;
          if (!self.scheduler.duration || self.scheduler.duration.length === 0) {
            self.scheduler.duration = [{ startDay: null, endDay: null }];
          }
          self.reminderList = self.scheduler.reminders && self.scheduler.reminders.length > 0 ? self.scheduler.reminders : self.reminderList; // eslint-disable-line
          this.reminderList.forEach(val => {
           const [hm, a] = val.time.split(' ');
           const [hh, mm] = hm.split(':');
            val.time = { // eslint-disable-line
              hh: '',
              mm: '',
              A: '',
            };
            val.time.hh = hh; // eslint-disable-line
            val.time.mm = mm; // eslint-disable-line
            val.time.A = a; // eslint-disable-line
          });
          self.calculateReminders(self.scheduler.completionWindow, null);
          self.$store.dispatch('setSurveyDetailsAction', response.body);
        },
        error => {
          toastr.error(error.body ? error.body.message : 'Error while getting the survey details');
        },
      );
    },
    getExactDayEpoch(day) {
      day = new Date(day); // eslint-disable-line
      return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0).getTime();
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
          const sd = new Date(this.studyData.firstPatientEnrollDate).valueOf();
          const ed = new Date(this.studyData.firstPatientLastDate).valueOf();
          this.studyDuration = parseInt((this.getExactDayEpoch(ed) - this.getExactDayEpoch(sd)) / 1000 / 86400, 10); // eslint-disable-line
          _.forEach(this.frequencies, val => {
            switch (val.type) {
              case 'daily':
                val.disabled = this.studyDuration < 1; // eslint-disable-line
                break;
              case 'weekly':
                val.disabled = this.studyDuration < 7; // eslint-disable-line
                break;
              case 'biweekly':
                val.disabled = this.studyDuration < 15; // eslint-disable-line
                break;
              case 'monthly':
                val.disabled = this.studyDuration < 30; // eslint-disable-line
                break;
              case 'biannually':
                val.disabled = this.studyDuration < 180; // eslint-disable-line
                break;
              case 'annually':
                val.disabled = this.studyDuration < 365; // eslint-disable-line
                break;
              default:
                break;
            }
          });
        },
        error => {
          toastr.error(error.body ? error.body.message : 'Error while getting the study details');
        },
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
      if (scheduler.advanceScheduleDays === null
        || scheduler.advanceScheduleDays === undefined
        || scheduler.advanceScheduleDays < 0
        || scheduler.advanceScheduleDays % 1 !== 0
        || scheduler.advanceScheduleDays > 99) {
        toastr.error('Advance scheduling days should be between 0 and 99, and cannot have decimals');
        return false;
      }
      let minDuration = 365;
      for (let i = 0; i < properList.length / 2; i++) {
        if (properList[i + i + 2]
          && properList[i + i + 1]
          && minDuration > properList[i + i + 2] - properList[i + i + 1]) {
          minDuration = properList[i + i + 2] - properList[i + i + 1] - 1;
        }
      }
      const fcwDiff = scheduler.frequency.days - scheduler.completionWindow;
      minDuration = minDuration > fcwDiff ? fcwDiff : minDuration;
      if (scheduler.advanceScheduleDays > minDuration) {
        if (minDuration !== 0) {
          toastr.error(`Number of advanced days can be between 0 and ${minDuration}`);
        } else if (minDuration === 0) {
          toastr.error('Number of advanced days can be 0 only');
        }
      }
      return scheduler.advanceScheduleDays <= minDuration;
    },
    validateMilestoneType(possibleVal, valid, scheduler, mArr, milestones) {
      let validScheduler = valid;
      let minDiff = null;
      if (possibleVal && validScheduler
        && (scheduler.advanceScheduleDays === null
        || scheduler.advanceScheduleDays === undefined
        || scheduler.advanceScheduleDays < 0
        || scheduler.advanceScheduleDays % 1 !== 0)) {
        validScheduler = false;
        toastr.error(scheduler.advanceScheduleDays ? 'Advance days cannot have decimals' : 'Please enter advance days');
      }
      if (mArr.length !== 0) {
        // when multiple milestones are selected
        const milestoneArr = _.sortBy(mArr);
        const diffArr = [];
        for (let i = 1; i < milestoneArr.length; i++) {
          // eslint-disable-line
          diffArr[i - 1] = milestoneArr[i] - (milestoneArr[i - 1] + scheduler.completionWindow); // eslint-disable-line
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
          toastr.error(`Number of advanced days can be between 0 and ${minDiff}`);
        } else if (minDiff === 0) {
          // eslint-disable-line
          toastr.error('Number of advanced days can be 0 only');
        }
      }
      return scheduler.advanceScheduleDays <= minDiff && validScheduler;
    },
    checkValidation(originalScheduler) {
      const scheduler = { ...originalScheduler };
      scheduler.taskId = this.surveyId ? this.surveyId : ''; // eslint-disable-line
      scheduler.taskType = this.options.validateFor; // eslint-disable-line
      let milestoneArr = [];
      let minDiff = null;
      let validTime = true;
      let validMsg = true;
      let possibleVal = null;
      let validScheduler = true;
      let duplicated = null;
      let allDaysList = null;
      let properList = null;
      let durationValues = null;
      scheduler.completionWindow = scheduler.completionWindow ? Number(scheduler.completionWindow) : null; // eslint-disable-line
      if (this.options.validateFor === 'telehealth') {
        scheduler.advanceScheduleDays = scheduler.advanceScheduleDays || scheduler.advanceScheduleDays === 0 ? Number(scheduler.advanceScheduleDays) : null; // eslint-disable-line
        scheduler.taskId = this.taskId; // eslint-disable-line
      }
      const remindersActual = _.filter(this.reminderList, o => o.day !== 'default');
      _.forEach(remindersActual, val => {
        if (!val.time.hh || !val.time.mm || !val.time.A) {
          validTime = false;
        }
        if (!val.message) {
          validMsg = false;
        }
      });
      const tempReminder = _.cloneDeep(remindersActual);
      tempReminder.forEach(val => {
        val.time = val.time.hh + ':' + val.time.mm + ' ' + val.time.A; //eslint-disable-line
      });
      const remindersWithOutMsg = _.map(remindersActual, object => _.pick(object, ['time', 'day']));
      duplicated = _.uniqWith(remindersWithOutMsg, _.isEqual);
      if (duplicated.length < remindersActual.length) {
        toastr.error('One of the notification is configured on the same day and same time');
      } else if (!validMsg) {
        toastr.error('Enter notification message');
      } else if (!validTime) {
        toastr.error('Select notification time');
      } else {
        scheduler.reminders = _.filter(tempReminder, o => o.day !== 'default'); // eslint-disable-line
        scheduler.taskType = this.options.validateFor === 'telehealth' ? 'truclinic' : scheduler.taskType; // eslint-disable-line
        if (this.options.validateFor === 'telehealth') {
          scheduler.taskTitle = 'Schedule Your Video Call with the Study Doctor';
        }
        switch (scheduler.type) {
          case 'milestone':
            if (scheduler.taskType !== 'notification') {
              if (!scheduler.milestones || scheduler.milestones.length <= 0) {
                toastr.error('Please select a milestone');
                validScheduler = false;
              } else if (!scheduler.completionWindow
                || scheduler.completionWindow <= 0
                || scheduler.completionWindow % 1 !== 0) {
                validScheduler = false;
                toastr.error('Please specify completion window with value greater than 0');
              } else if (this.studyDuration <= scheduler.completionWindow) {
                validScheduler = false;
                toastr.error('Specified completion window cannot exceed study duration');
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
              } else if (scheduler.taskType === 'truclinic' && (scheduler.advanceScheduleDays === null || scheduler.advanceScheduleDays === undefined)) {
                validScheduler = false;
                toastr.error('Please enter value for advanced days');
              } else {
                milestoneArr = _.map(scheduler.milestones, _.ary(parseInt, 1));
                milestoneArr.sort();
                minDiff = this.findMinDiff(milestoneArr);
                possibleVal = minDiff;
                possibleVal = possibleVal === 0 ? 1 : possibleVal;

                if (possibleVal < scheduler.completionWindow) {
                  validScheduler = false;
                  toastr.error('Specified completion window overlaps with another milestone');
                }
              }
            } else if (scheduler.milestones.length <= 0) {
              // for notifications only
              toastr.error('Please select a milestone');
              validScheduler = false;
            }
            if (validScheduler && scheduler.taskType === 'truclinic' && !this.validateMilestoneType(possibleVal, validScheduler, scheduler, milestoneArr, scheduler.milestones)) {
              validScheduler = false;
            }
            if (validScheduler) {
              this.$store.dispatch('addSchedule', {
                validatedFor: this.options.validateFor,
                schedulerObj: scheduler,
              });
            }
            break;
          case 'custom':
            this.$validator.validateAll().then(valid => {
              scheduler.frequency = scheduler.frequency ? scheduler.frequency : { type: null, title: null, days: null }; // eslint-disable-line
              durationValues = _.map(scheduler.duration, item => ({
                // eslint-disable-line
                startDay: parseFloat(item.startDay),
                endDay: parseFloat(item.endDay),
              })); // eslint-disable-line
              allDaysList = _.flatten(_.map(durationValues, o => [o.startDay, o.endDay])); // eslint-disable-line
              properList = _.compact(allDaysList);
              properList = scheduler.allowUntillDuration && properList % 2 === 0 ? _.dropRight(properList) : properList; // eslint-disable-line
              if (scheduler.taskType !== 'notification' && (!scheduler.frequency.type || !scheduler.completionWindow)) {
                toastr.error(!scheduler.frequency.type ? 'Please select a frequency' : 'Please specify completion window');
              } else if (scheduler.taskType === 'notification' && !scheduler.frequency.type) {
                toastr.error('Please select a frequency');
              } else if (scheduler.taskType !== 'notification' && (scheduler.completionWindow <= 0 || scheduler.completionWindow % 1 !== 0)) {
                toastr.error('Completion window should be greater than 0 and cannot have decimals');
              } else if (scheduler.taskType !== 'notification' && scheduler.completionWindow > scheduler.frequency.days) {
                toastr.error('Completion window cannot exceed the length of the frequency');
              } else if (!scheduler.allowUntillDuration
                && allDaysList.length !== properList.length
                && (!scheduler.allowUntillDuration
                && allDaysList.length !== properList.length - 1)) {
                toastr.error('Start and End days should be greater than 0 and cannot have decimals');
              } else if (this.errors.any() && !valid) {
                toastr.error('Start/End day should be greater than 0 and cannot have decimals');
              } else if (!this.isSorted(properList)) {
                toastr.error('Start and end days should be in increasing order.');
              } else if (_.uniq(properList).length !== properList.length) {
                toastr.error('Scheduled start and end days overlap. Please revise.');
              } else if (_.max(properList) > this.studyDuration) {
                toastr.error('Start and end day should be less than study duration');
              } else if (scheduler.taskType === 'truclinic' && (scheduler.advanceScheduleDays === null || scheduler.advanceScheduleDays === undefined)) {
                toastr.error('Please enter value for advance days');
              } else if (scheduler.taskType === 'truclinic' && !this.validateCustomType(scheduler, properList)) {
                toastr.error('Invalid values');
              } else {
                this.$store.dispatch('addSchedule', {
                  validatedFor: this.options.validateFor,
                  schedulerObj: scheduler,
                });
              }
            });
            break;
          default:
            break;
        }
      }
    },
  updateShowDailySummary() {
    if(!this.scheduler.allowMultipleTimes) {
      this.scheduler.showDailySummary = false;
    }
  }
  
  },
};
</script>

<style scoped lang="scss">
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
    background-color: #1e8fe1;
    border-color: #1e8fe1;
    color: #ffffff;
    margin-bottom: 20px;
    max-width: 120px;
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

.display-day {
  height: 35px!important;
}

 .input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.checkbox_position {
  position: relative;
  top: 2px;
}

.view-screen {
  font-size: 10px;
  color: #4c8ce4;
  padding-left: 16px;
}

.opacity-change {
  opacity: 0.5;
}

.modal-dialog {  
  max-width: 1000px!important;
}
</style>
