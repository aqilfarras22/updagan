<template>
  <div class="participant-app-notification" v-if="ifPanelDeleted">
    <div v-if="!isNotificationAddEdit">
      <div>
        <div class="notification-container">
          <form>
            <div class="form-group row">
              <div class="col-md-4">
                <label for="event">Event</label>
                <select
                  name="event"
                  class="form-control"
                  id="event"
                  v-on:change="changEventType($event.target);"
                  v-model="appNotification.eventType"
                >
                  <option value="0">Select event</option>
                  <option value="1">When it's time to schedule the appointment</option>
                  <option value="2">When it's time for the appointment</option>
                </select>
              </div>
            </div>
            <div class="form-group" v-if="appNotification.eventType=='1'">
              <label>Time of day (participant local time)</label>
              <vue-timepicker
                v-model="appNotification.time"
                format="hh:mm A"
                :minute-interval="10"
                required
              ></vue-timepicker>
            </div>
            <div class="form-group">
              <label>Notification message</label>
              <textarea
                name="message"
                v-model="appNotification.message"
                class="form-control"
                placeholder="Enter notification message"
              />
              <p class="form-text text-muted text-right">{{msgCharCount}}</p>
            </div>
            <div class="form-group row">
              <div>
                <label for="occurance">Occurrence</label>
                <div
                  class="occurance-row row margin-top"
                  v-for="(reminder, index) in occurranceList"
                  :key="index"
                >
                  <div class="occurance-div" v-if="appNotification.eventType == 1">
                    <select
                      v-on:change="changeOccurance(index,$event.target);"
                      name="day"
                      class="form-control input-md text-color display-day input-color"
                      v-model=reminder.value
                    >
                      <option value=null selected >-Select Occurrence-</option>
                      <option value="0">At time of event</option>
                      <option 
                        :value="typeIndex + 1"
                        v-for="(type, typeIndex) in remindersList"
                        :key="typeIndex"
                      >{{typeIndex + 1}} day(s) after (if not complete)</option>
                    </select>
                  </div>
                  <div class="occurance-div" v-else>
                    <select
                      v-on:change="changeOccurance(index,$event.target);"
                      name="day"
                      class="form-control input-md text-color display-day input-color"
                      v-model=reminder.value
                    >
                      <option value=null selected>-Select Occurrence-</option>
                      <option v-for="option in occuranceOptions" v-bind:value="option.value"
                        :data-text="option.text" :key="option.value">
                        {{(option.text)}}
                      </option>
                    </select>
                  </div>
                  <div class="occurance-remove-div">
                    <img
                      v-on:click="removeOccurance(index)"
                      class="pointer-cursor"
                      v-if="occurranceList.length > 1"
                      src="static/img/collapse.png"
                    >
                  </div>
                </div>
                <a v-if="needToShow" class="link" v-on:click.prevent="addOccurance()">
                  Add another occurrence
                </a>
              </div>
            </div>
            <div class="form-group text-right">
              <span class="delete-icon" v-on:click="deleteNotification()">
                <img src="static/img/econsent/delete.svg">
              </span>
              <button class="btn btn-primary" v-on:click.prevent="saveNotification()">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <div>
        <div class="notification-container">
          <div class="form-group row" >
            <div class="col-md-11 pl-0">
              <label for="event">Event</label>
              <div v-if="appNotification.eventType == 1">When it's time to schedule the appointment</div>
              <div v-if="appNotification.eventType == 2">When its time for the appointment</div>
            </div>
            <div class="col-md-1">
              <span for="event" class="link" @click="onEditNotification">Edit</span>
            </div>
          </div>
          <div class="form-group" v-if="appNotification.eventType == 1">
            <label>Time of day (participant local time)</label>
            <div>{{ appNotification.time.hh }}:{{ appNotification.time.mm }} {{ appNotification.time.A }}</div>
          </div>
          <div class="form-group">
            <label>Notification message</label>
            <div>{{ appNotification.message }}</div>
          </div>
          <div class="form-group row">
            <div class="col-md-4">
              <label for="occurance">Occurrence: {{getOccuranceCount}}</label>
              <div>{{ getOccuranceString }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueTimepicker from "vue2-timepicker";
import swal from "sweetalert2";
import toastr from "toastr";
import { constants } from "fs";
import { endianness } from "os";
import _ from 'lodash';

export default {
  name: "participant-app-notifications",
  data() {
    return {
      isPanelDisplay: false,
      ifPanelDeleted: true,
      isNotificationAddEdit: this.options.appNotification.eventType == 0 ? false : true,
      appNotification: JSON.parse(JSON.stringify(this.options.appNotification)),
      isSaveNotification: false,
      notificationList: [],
      reminderList: this.options.reminderList,
      remindersList: this.options.remindersList,
      completionWindow: this.options.completionWindow,
      advanceScheduleDays: this.options.advanceScheduleDays,
      telehealthReminders: this.options.appNotification.telehealthReminders && this.options.appNotification.telehealthReminders.length > 0 ? this.options.appNotification.telehealthReminders : [],
      occurranceList: this.options.appNotification.occurranceList.length > 0 ? this.options.appNotification.occurranceList : [{text: null, value: null}],
      visitId: null,
      studyId: null,
      tempOccurranceList: null,
      eventOptionTypes: {
        2: [
          { value: 0, text: "At time of event" },
          {
            value: "a-5",
            text: "5 min after the appointment time (if call has not begun)",
            delayType: "after"
          },
          {
            value: "a-10",
            text: "10 min after the appointment time (if call has not begun)",
            delayType: "after"
          },
          {
            value: "a-15",
            text: "15 min after the appointment time (if call has not begun)",
            delayType: "after"
          },
          {
            value: "a-30",
            text: "30 min after the appointment time (if call has not begun)",
            delayType: "after"
          },
          {
            value: "b-5",
            text: "5 min before the appointment time",
            delayType: "before"
          },
          {
            value: "b-10",
            text: "10 min before the appointment time",
            delayType: "before"
          },
          {
            value: "b-15",
            text: "15 min before the appointment time",
            delayType: "before"
          },
          {
            value:"b-30",
            text: "30 min before the appointment time",
            delayType: "before"
          }
        ]
      }
    };
  },
  props: ["options"],
  computed: {
    needToShow: function() {
      if(this.appNotification.eventType == 2) {
        if(this.occurranceList.length == this.eventOptionTypes[this.appNotification.eventType].length) {
          return false;
        } else {
          return true;
        }
      } else if(this.appNotification.eventType == 1) {
        if(this.remindersList.length == 0) {
          return false;
        } else if(this.occurranceList.length >= (this.remindersList.length + 1)) {
          return false;
        } else {
          return true;
        }
        if(this.occurranceList.length == this.reminderList.length) {
          return false;
        } else {
          return true;
        }
      }
    },
    msgCharCount: function() {
      let charCount = (this.appNotification.message && this.appNotification.message.length) ? this.appNotification.message.length : 0 ;
      return charCount === 0 ? "" : `Character count: ${charCount}`;
    },
    occuranceOptions: function(event) {
      return this.eventOptionTypes[this.appNotification.eventType];
    },
    getOccuranceString: function() {
      let stringText = "";
      for (var i = 0; i < this.telehealthReminders.length; i++) {
        stringText = stringText + ", " + this.telehealthReminders[i].text;
      }
      stringText = stringText.substr(1);
      return stringText;
    },
    getOccuranceCount: function() {
      return this.occurranceList.length;
    }
  },
  components: {
    VueTimepicker
  },
  mounted() {
    this.visitId = window.localStorage.getItem("visitId");
    this.studyId = this.$route.params.studyId;
    let self = this;
  },
  watch: {
    options(newValue, oldValue) {
      this.remindersList = [];
      this.reminderList = newValue.reminderList;
      this.remindersList = newValue.remindersList;
      this.completionWindow = newValue.completionWindow;
      this.advanceScheduleDays = newValue.advanceScheduleDays;
      newValue.completionWindow =
        Number(newValue.completionWindow) === 0 ? 1 : newValue.completionWindow; // eslint-disable-line
      if (newValue.completionWindow && this.remindersList) {
        this.remindersList.length = Number(newValue.completionWindow) - 1;
      }
    }
  },
  methods: {
    truncateText: function(text) {
      if (text.length > 40) {
        return text.substring(0, 40) + '...';
      }
      return text;
    },
    onEditNotification() {
      // process telehealth reminders
      this.telehealthReminders = [];
      if(this.options.appNotification.eventType == 1) {
        let list = this.notificationList;
        for(let i = 0; i < list.length; i++) {
          this.telehealthReminders.push({
            text: this.getOccuranceText(list[i].day),
            value: list[i].day
          });
        }
      }
      if(this.options.appNotification.eventType == 2) {
        let self = this;
        let occList = [];
        for(let i = 0; i < this.notificationList.length; i++) {
          let time = this.notificationList[i].time;
          const [value, str] = time.split(" ");
          let eventOptions = this.eventOptionTypes[this.options.appNotification.eventType];
          eventOptions.filter((k) => {
            if(value == k.value) {
              self.telehealthReminders.push({
                text: k.text,
                value: value
              });

              occList.push({
                text: k.text,
                value: value
              })
            }
          });
        }
      }
      this.isNotificationAddEdit = !this.isNotificationAddEdit;
      this.isPanelDisplay = true;
    },
    addNewNotification() {
      this.isPanelDisplay = true;
    },
    editNotification() {
      this.isPanelDisplay = true;
    },
    iterateForNotification(isSpliceHappen = null, self) {
      let that = self;
      that.options.actualNotificationList.forEach((notification, index) => {
          // if occurrance list is present
          for(let i = 0; i < notification.occurranceList.length; i++) {
            if(notification.occurranceList[i].value === null) {
              isSpliceHappen = i;
              continue
            }
            if(notification.eventType == 1) {
              const timeVal = notification.time;
              that.notificationList.reminder.push({
                time: timeVal.hh + ":" + timeVal.mm + " " + timeVal.A,
                message: notification.message,
                day: parseInt(notification.occurranceList[i].value)
              });
            }
            if(notification.eventType == 2) {
              let time = notification.occurranceList[i].value != 0 ? notification.occurranceList[i].value.split("-") : notification.occurranceList[i].value;
              that.notificationList.callReminder.push({
                time: (time != 0 ? time[1] : time) + ' min',
                message: notification.message,
                day: 0,
                delayType: time != 0 ? (time[0] == "a" ? "after" : "before") : null
              });
            }
          }
          if(isSpliceHappen || isSpliceHappen == 0) {
            that.occurranceList.splice(isSpliceHappen, 1);
          }
        })
    },
    deleteNotification() {
      let self = this;
      swal({
        title: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.occurranceList = [{text: null, value: null}];
          this.appNotification.message = '';
          this.appNotification.time = {hh: "", mm: "", A: ""};
          self.ifPanelDeleted = false
          self.options.actualNotificationList.splice(self.options.indexValue, 1);
          self.notificationList = {reminder: [], callReminder: []};
          self.iterateForNotification(null, self)
          self.$emit("updateReminder", {notificationList: self.notificationList, eventType: this.appNotification.eventType, action: "delete", index: this.options.indexValue, actualNotificationList: self.options.actualNotificationList});
        }
      });
    },
    saveNotification() {
      let self = this;
      let isValid = true;
      if (this.appNotification.eventType === 0) {
        isValid = false;
        toastr.error("Notification event is required.");
        return;
      }
      if (
        (this.appNotification.time.hh === "" ||
        this.appNotification.time.mm === "" ||
        this.appNotification.time.A === "") &&
        this.appNotification.eventType == 1
      ) {
        isValid = false;
        toastr.error("Notification time of day is required.");
        return;
      }

      if (this.appNotification.message == "") {
        isValid = false;
        toastr.error("Notification message is required.");
        return;
      }
      if ((this.occurranceList.length === 0) || (this.occurranceList.length == 1 && (this.occurranceList[0].text == null || this.occurranceList[0].value == "null"))) {
        isValid = false;
        toastr.error("Notification Occurrence is required.");
        return;
      }

      if (isValid) {
        this.notificationList = {reminder: [], callReminder: []};
        this.tempOccurranceList = null; // remove local object after save
        let isSpliceHappen = null;

        this.options.actualNotificationList[this.options.indexValue].eventType = this.appNotification.eventType;
        this.options.actualNotificationList[this.options.indexValue].message = this.appNotification.message;
        this.options.actualNotificationList[this.options.indexValue].occurranceList = this.occurranceList;
        this.options.actualNotificationList[this.options.indexValue].time = this.appNotification.time;

        if(this.appNotification.eventType != 0) {
          this.options.actualNotificationList.forEach((notification, index) => {
            if(notification.eventType == self.appNotification.eventType && index != self.options.indexValue) {
              isValid = false;
              toastr.error("This event type is already scheduled. Please select another event.");
              return;
            }
          });
        }
        if(!isValid) {
          return;
        }
        this.iterateForNotification(isSpliceHappen, this);
        this.telehealthReminders = this.occurranceList;
        this.isNotificationAddEdit = true;
        this.$emit("updateReminder", {notificationList: this.notificationList, eventType: this.appNotification.eventType, index: this.options.indexValue, action: "edit", actualNotificationList: this.options.actualNotificationList});
      }
    },
    addOccurance() {
      this.occurranceList.push({
        value: null,
        text: null
      })
    },
    changEventType(element) {
      if(element.value != this.options.appNotification.eventType || this.tempOccurranceList == null) {
        this.tempOccurranceList = this.occurranceList;
        this.occurranceList = [{text: null, value: null}]; // intialized again     
      } else if(element.value == this.options.appNotification.eventType && this.tempOccurranceList != null) {
        this.occurranceList = this.tempOccurranceList;
        this.tempOccurranceList = null;
      }
      if(element.value == 0) {
        this.occurranceList = [{text: null, value: null}];
        this.appNotification.time = { hh: "", mm: "",  A: ""};
      }
      if(element.value == 1 && this.options.appNotification.eventType == 2) {
        this.appNotification.time = { hh: "", mm: "",  A: ""};
      }
      this.appNotification.eventType = element.value;
    },
    removeOccurance(index) {
      let self = this;
      swal({
        title: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          self.occurranceList.splice(index, 1)
          self.remindersList.splice(index, 1);
        } else {
          toastr.warning("occurrence not deleted");
        }
      });
    },
    changeOccurance(index, element) {
      let value = element.value;
      if(element.value == "") {
        return;
      }
      for(let i = 0; i < this.occurranceList.length; i++) {
        if(i != index && this.occurranceList[i].value == value) {
          this.occurranceList[index].value = null;
          this.occurranceList[index].text = null;
          toastr.warning("This is already been selected. Please select another occurrence");
          return;
        }
      }
      let text = this.getOccuranceText(element.value);
      
      this.occurranceList[index].text = this.getOccuranceText(value);
      this.occurranceList[index].value = value;
    },
    getOccuranceText(value) {
      let stringText = "";
      if (this.appNotification.eventType == 2) {
        const eventOptions = this.eventOptionTypes[
          this.appNotification.eventType
        ];
        const optionValueObject = eventOptions.filter(c => c.value == value);
        if (optionValueObject != null && optionValueObject.length > 0) {
          stringText = optionValueObject[0].text;
        }
      } else {
        if (value == 0) {
          stringText = "At time of event";
        } else {
          stringText = value + " day(s) after (if not complete)";
        }
      }
      return stringText;
    }
  }
};
</script>
<style lang="scss" scoped>
.margin-top {
  margin-top: 10px;
}
.col-md-4 {
  padding-left: 0;
}
.participant-app-notification {
  margin-top: 30px;
  .font-size-12 {
    font-size: 12px;
  }

  .notification-container {
    background: #ffffff;
    border-radius: 4px;
    border: solid 1px #e4e8eb;
    padding: 20px 21px;
  }
  .link {
    font-weight: bold;
    color: #1e8fe1;
    cursor: pointer;
    top: 10px;
    position: relative;
  }

  label {
    font-weight: bold;
    display: block;
  }

  .btn {
    min-width: 100px;
    height: 34px;
    line-height: inherit;
  }

  button {
    &.btn-primary {
      background-color: #1e8fe1;
      border-color: #1e8fe1;
    }
  }

  .delete-icon {
    cursor: pointer;
    padding: 0px 20px;
    vertical-align: middle;
  }
  .form-group {
    margin-bottom: 1.25rem;
  }

  .occurance-div {
    width: 385px;
    height: 38px;
  }

  .occurance-row {
    width: 100%;
  }

  .occurance-remove-div {
    left: 10px;
    position: relative;
    top: 10px;
  }
  .pointer-cursor {
    cursor: pointer;
  }
}
</style>

