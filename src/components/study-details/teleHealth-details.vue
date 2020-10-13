<template>
  <div class="details" v-if="telehealthVisits.length>0">
    <div class="card br-2">
      <div class="p-10">
        <div>
          <h6 class="fw-bold">TELEHEALTH: {{telehealthVisits.length}}</h6>
          <div>
            <a href class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div v-if="studyDetails && studyDetails.countrySpecificTelehealthFeature" class="mt-6 country-specific-status">
            <div v-if="studyDetails.countrySpecificTelehealthFeature.telehealthEnableCountryList.length>0"><span class="min-width">Enabled in:</span><span>{{studyDetails.countrySpecificTelehealthFeature.telehealthEnableCountryList.join(', ')}}</span></div>
            <div v-if="studyDetails.countrySpecificTelehealthFeature.telehealthDisableCountryList.length>0"><span class="min-width">Disabled in:</span><span>{{studyDetails.countrySpecificTelehealthFeature.telehealthDisableCountryList .join(', ')}}</span></div>
          </div>
          <div class="pt-8" v-for="(visit, index) in telehealthVisits" :key="index">
            <div>
              <b-row>
                <b-col cols="3" class="p-0">
                  <i
                    class="fa fa-plus-circle pr-6"
                    v-if="!visitCollapse[visit.taskId]"
                    @click="expandVisit(visit.taskId)"
                  ></i>
                  <i
                    class="fa fa-minus-circle pr-6"
                    v-if="visitCollapse[visit.taskId]"
                    @click="collapseVisit(visit.taskId)"
                  ></i>
                  {{visit.visitName}}
                </b-col>
                <b-col cols="4" v-if="visit.milestones && visit.milestones.length > 0">
                  Milestones:
                  <span v-for="(milestones, index) in visit.milestones" :key="index">
                    {{milestones}}
                    <span v-if="index + 1 < visit.milestones.length">,</span>
                  </span>
                </b-col>
                <b-col cols="4" v-if="visit.frequency">Frequency: {{visit.frequency.title}}</b-col>
              </b-row>
            </div>
            <div v-if="visitCollapse[visit.taskId]">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row>
                    <b-col
                      class="pl-0 pb-10"
                      v-if="visit.milestones && visit.milestones.length > 0"
                    >
                      <div class="header">To be completed at milestones</div>
                      <div class="content">
                        <span v-for="(milestones, index) in visit.milestones" :key="index">
                          {{milestones}}
                          <span v-if="index + 1 < visit.milestones.length">,</span>
                        </span>
                      </div>
                    </b-col>
                    <b-col class="pl-0 pb-10" v-if="visit.frequency">
                      <div class="header">Frequency</div>
                      <div class="content">{{visit.frequency.title}}</div>
                    </b-col>
                    <b-col class="pl-0 pb-10" v-if="visit.completionWindow">
                      <div class="header">Completion window</div>
                      <div class="content">{{visit.completionWindow}} days</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-0 pb-10">
                      <div
                        class="header"
                      >Days in advance participants can schedule their Telehealth visit</div>
                      <div class="content">{{visit.advanceScheduleDays}}</div>
                    </b-col>
                    <b-col v-if="visit.extendAvailability" class="pl-0 pb-10">
                      <div class="header" >Extended completion window</div>
                      <div class="content">{{visit.extendWindow}} days</div>
                    </b-col>
                  </b-row>
                  <b-row v-if="visit.duration[0].startDay || visit.duration[0].endDay">
                    <b-col class="pl-0 pb-10">
                      <div class="header">Selected time period this survey should appear</div>
                      <div class="content">Start Day: {{visit.duration[0].startDay}}</div>
                      <div
                        class="content"
                        v-if="visit.duration[0].endDay"
                      >End Day: {{visit.duration[0].endDay}}</div>
                      <div
                        class="content"
                        v-else
                      >Available until the end of participant's study duration</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-0 pb-10">
                      <div class="header">Visit Type</div>
                      <div class="content">{{visit.visitType=="bothVisitType"?"Both Visit Types": visit.visitType}}</div>
                    </b-col>
                  </b-row>
                </div>
                <b-row
                  class="pb-10 pl-10"
                  v-if="visit.appNotification && visit.appNotification.length>0"
                >
                  <b-col cols="12" class="header p-0 mb-5">Reminders (Mobile notifications)</b-col>
                  <div
                    v-for="(appNotification, index) in visit.appNotification"
                    :key="index"
                    class="mobile-notifications"
                  >
                    <b-col cols="12" class="p-0 mb-10">
                      <div class="header">Event</div>
                      <div class="content">{{appNotification.eventType}}</div>
                    </b-col>
                    <b-col cols="12" class="p-0 mb-10">
                      <b-row class="p-0">
                        <b-col class="p-0" cols="5" v-if="appNotification.message">
                          <div class="header">Message</div>
                          <div class="content">{{appNotification.message}}</div>
                        </b-col>
                        <b-col class="p-0" cols="3" v-if="appNotification.time">
                          <div class="header">Time</div>
                          <div class="content">{{appNotification.time}}</div>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col cols="12" class="p-0 mb-10">
                      <div class="header">Occurrence: {{appNotification.occuranceLength}}</div>
                      <div class="content">{{appNotification.occurances}}</div>
                    </b-col>
                  </div>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "telehealth-details",
  data() {
    return {
      telehealthVisits: [],
      visitCollapse: {},
      eventTypeoptions: {
        1: "When it's time to schedule the appointment",
        2: "When its time for the appointment"
      }
    };
  },
  components: {},
  props: {
    visits: {
      type: Array
    },
    studyDetails: {
      type: Object,
      required: true
    }
  },
  methods: {
    expandVisit(id) {
      this.visitCollapse[id] = true;
      this.$forceUpdate();
    },
    collapseVisit(id) {
      this.visitCollapse[id] = false;
      this.$forceUpdate();
    },
    expandAll() {
      this.visits.forEach(visit => {
        this.visitCollapse[visit.taskId] = true;
      });
      this.$forceUpdate();
    },
    collapseAll() {
      this.visits.forEach(visit => {
        this.visitCollapse[visit.taskId] = false;
      });
      this.$forceUpdate();
    },
    getOccuranceText(value, eventType, delayType) {
      let stringText = "";
      if (eventType == 2) {
        if (value == 0) {
          stringText = "At time of event";
        } else {
          stringText = value + ` min ${delayType} the appointment time`;
          stringText += delayType=="after"?"(if call has not begun)":'';
        }
      } else {
        if (value == 0) {
          stringText = "At time of event";
        } else {
          stringText = value + " day(s) after (if not complete)";
        }
      }
      return stringText;
    },
    getOccuranceString(reminders, eventType) {
      let stringText = "";
      reminders.forEach(reminderObj => {
        let occuranceTextFor = reminderObj.day;
        if (eventType == 2) {
          let time = reminderObj.time;
          let timeArr = time.split(" ");
          occuranceTextFor = timeArr[0];
        }

        stringText =
          stringText +
          ", " +
          this.getOccuranceText(occuranceTextFor, eventType, reminderObj.delayType);
      });

      stringText = stringText.substr(1);
      return stringText;
    }
  },
  watch: {
    visits() {
      if (this.visits && this.visits.length) {
        this.visits.forEach(visit => {
          this.visitCollapse[visit.taskId] = false;
        });
      }
    }
  },
  mounted() {
    if (this.visits && this.visits.length) {
      this.visits.forEach((visit, index) => {
        let notifications = [];
        if (visit.callReminders) {
          let eventType2Notifications = {};
          eventType2Notifications.eventType = this.eventTypeoptions[2];
          eventType2Notifications.message = visit.callReminders[0].message;
          eventType2Notifications.occuranceLength = visit.callReminders.length;
          eventType2Notifications.occurances = this.getOccuranceString(
            visit.callReminders,
            2
          );
          notifications.push(eventType2Notifications);
        }
        if (visit.reminders) {
          let eventType1Notifications = {};
          eventType1Notifications.eventType = this.eventTypeoptions[1];
          eventType1Notifications.time = visit.reminders[0].time;
          eventType1Notifications.message = visit.reminders[0].message;
          eventType1Notifications.occuranceLength = visit.reminders.length;
          eventType1Notifications.occurances = this.getOccuranceString(
            visit.reminders,
            1
          );
          notifications.push(eventType1Notifications);
        }

        this.telehealthVisits[index] = visit;
        this.telehealthVisits[index].appNotification = notifications;
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.link_style {
  border-right: 1px solid #959fa4;
  margin: 0px 5px 0px 2px !important;
}
.inner-card {
  border: none;
  margin: 5px 20px;
  border-radius: 3px !important;
  background-color: #d3dfe4;
}
.content {
  font-size: 12px;
  color: #666669;
}
.header {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
.mobile-notifications {
  border-bottom: 1px solid #fff;
  margin-bottom: 10px;
  width: 100%;
  margin-right: 10px;
}

.mobile-notifications:last-of-type {
  border: 0;
}

.country-specific-status{
  color: #2d3752
}

.min-width{
  display:inline-block;
  min-width: 100px;
}
.make-link {
  color: #1e8fe1 !important;
}

</style>

