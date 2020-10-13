<template>
  <div class="participant-app-notification">
    <div class="mb-10 mt-30 font-weight-bold">Participant app notifications</div>
    <div v-if="isNotificationAddEdit">
      <div  v-for="(items, index) in options.appNotification" :key="items">
        <ParticipantAppNotificationsComponent
        @updateReminder="updateReminder"
        :options="{advanceScheduleDays: (options.telehealthVisit.scheduler.advanceScheduleDays) ? options.telehealthVisit.scheduler.advanceScheduleDays : 0, completionWindow: options.telehealthVisit.scheduler.completionWindow, 
        telehealthVisit: options.telehealthVisit,
        remindersList: options.remindersList,
        appNotification: items,
        actualNotificationList: options.appNotification,
        isDataExist: options.isDataExist,
        indexValue: index}">
        </ParticipantAppNotificationsComponent>
      </div>
    </div>
    <div class="pt-15" v-if="isPanelDisplay">
      <button
        class="btn btn-outline-primary font-weight-bold font-size-12"
        @click="addNewNotification()"
      >Add a notification</button>
    </div>
  </div>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import toastr from "toastr";
import ParticipantAppNotificationsComponent from './participant-app-notifications.vue';
export default {
  name: "edit-notification",
  components: {
    ParticipantAppNotificationsComponent
  },
  data() {
    return {
      completionWindow: this.options.completionWindow,
      isPanelDisplay: this.options.appNotification.length == 2 ? false : true,
      isNotificationAddEdit: this.options.appNotification.length > 0 ? true : false,
      remindersListTeleHealth: [],
      actualNotificationList: this.options.appNotification
    }
  },
  props: ["options"],
  mounted() {},
  watch: {
    options(newValue, oldValue) {
      this.remindersList = [];
      this.remindersList = newValue.remindersList;
      this.completionWindow = newValue.completionWindow;
      this.advanceScheduleDays = newValue.advanceScheduleDays;
      this.actualNotificationList = newValue.actualNotificationList;
      newValue.completionWindow =
        Number(newValue.completionWindow) === 0 ? 1 : newValue.completionWindow; // eslint-disable-line
      if (newValue.completionWindow && this.remindersList) {
        this.remindersList.length = Number(newValue.completionWindow) - 1;
      }
    }
  },
  methods: {
    addNewNotification() {
      if(this.options.appNotification.length == 2) {
        this.isNotificationAddEdit = true;
        this.isPanelDisplay = false;
        this.$forceUpdate();
        return;
      }
      this.options.appNotification.push({
        eventType: 0,
        time: {
          hh: "",
          mm: "",
          A: ""
        },
        message: "",
        day: "default",
        telehealthReminders: [],
        occurranceList: [{text: null, value: null}]
      });
      this.isNotificationAddEdit = true;
      if(this.options.appNotification.length == 2) {
        this.isPanelDisplay = false;
      }
      this.$forceUpdate();
    },
    updateReminder(reminder) {
      console.log(this.options.appNotification);
      if(this.options.appNotification.length !=2) {
        this.isPanelDisplay = true;
        this.$forceUpdate();
      }
      this.$emit("updateReminder", {notificationList: reminder.notificationList, eventType: reminder.eventType, index: reminder.index, action: reminder.action});
    },
  }
};
</script>
<style lang="scss" scoped>

</style>
