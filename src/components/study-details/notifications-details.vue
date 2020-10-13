<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="notificationDetails && notificationCollapse">
          <h6 class="fw-bold"> NOTIFICATIONS </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-for="(notification, index) in notificationDetails" :key="index">
            <div>
              <b-row>
                <b-col cols="3" class="p-0">
                  <i class="fa fa-plus-circle pr-6" v-if="!notificationCollapse[notification.notificationId]" @click.prevent="expandNotification(notification.notificationId)"></i>
                  <i class="fa fa-minus-circle pr-6" v-if="notificationCollapse[notification.notificationId]" @click.prevent="collapseNotification(notification.notificationId)"></i>
                  {{notification.message}}
                </b-col>
                <b-col cols="4" v-if="notification.scheduler && notification.scheduler.milestones && notification.scheduler.milestones.length > 0">
                  Milestones:
                  <span v-for="(milestones, index) in notification.scheduler.milestones" :key="index">
                    {{milestones}}
                    <span v-if="index + 1 < notification.scheduler.milestones.length">,</span>
                  </span>
                </b-col>
                <b-col cols="4" v-if="notification.scheduler && notification.scheduler.frequency">
                  Frequency: {{notification.scheduler.frequency.type}}
                </b-col>
              </b-row>
            </div>
            <div v-if="notificationCollapse[notification.notificationId]">
              <div class="card inner-card br-2">
                <div class="pt-10 pl-10 pr-10">
                  <b-row>
                    <b-col v-if="notification.message" class="pb-10 p-0" cols="5">
                      <div class="content">
                        Message
                      </div>
                      <div class="header">
                        {{notification.message}}
                      </div>
                    </b-col>
                    <b-col v-if="notification.time" class="pb-10 p-0" cols="4">
                      <div class="content">
                        Time of the day
                      </div>
                      <div class="header">
                        {{notification.time}}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="notification.scheduler && notification.scheduler.milestones">
                    <b-col class="p-0">
                      <div class="content">
                        To be completed at milestones
                      </div>
                      <div class="header">
                        <span v-for="(milestone, index) in notification.scheduler.milestones" :key="index">
                          {{milestone}}
                          <span v-if="index + 1 < notification.scheduler.milestones.length">,</span>
                        </span>
                      </div>
                    </b-col>
                    <b-col v-if="notification.advanceScheduleDays">
                      <div class="content">
                        Completion window
                      </div>
                      <div class="header">
                        {{notification.advanceScheduleDays}}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="notification.scheduler && notification.scheduler.frequency">
                    <b-col class="p-0">
                      <div class="content">
                        Frequency
                      </div>
                      <div class="header">
                        {{notification.scheduler.frequency.type}}
                      </div>
                    </b-col>
                    <b-col v-if="notification.advanceScheduleDays" class="p-0">
                      <div class="content">
                        Completion window
                      </div>
                      <div class="header">
                        {{notification.advanceScheduleDays}} days
                      </div>
                    </b-col>
                  </b-row>
                  <div class="pb-10" v-if="notification.timeToComplete">
                    <div class="content">
                      Approximate time to complete
                    </div>
                    <div class="header">
                      {{notification.timeToComplete}} mins
                    </div>
                  </div>
                  <b-row class="pb-10" v-if="notification.scheduler && notification.scheduler.allowMultipleTimes">
                    <b-col class="p-0">
                      <div class="content">
                        Allow participants to repeat notifications each time it is present
                      </div>
                      <div class="header">
                        Yes
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="notification.scheduler && notification.scheduler.duration && notification.scheduler.frequency">
                    <!-- <div v-for="(item, index) in notification.scheduler.duration" :key="index"> -->
                      <b-col cols="12" class="content p-0">
                        Scheduled as follows
                      </b-col>
                      <b-col class="p-0" cols="4" v-for="(item, index) in notification.scheduler.duration" :key="index">
                        <b-row class="p-0">
                          <b-col class="p-0" cols="3" v-if="item.startDay">
                            <div class="content">
                              Start Day
                            </div>
                            <div class="header">
                              {{item.startDay}}
                            </div>
                          </b-col>
                          <b-col class="p-0" cols="3" v-if="item.endDay">
                            <div class="content">
                              End Day
                            </div>
                            <div class="header">
                              {{item.endDay}}
                            </div>
                          </b-col>
                        </b-row>
                      </b-col>
                    <!-- </div> -->
                  </b-row>
                  <b-row class="pb-10" v-if="notification.scheduler && !(notification.scheduler.milestones && notification.scheduler.milestones.length > 0)">
                    <b-col class="p-0">
                      <div class="content">
                        Available until the end of participant's study duration
                      </div>
                      <div class="header" v-if="notification.scheduler.allowUntillDuration">
                        Yes
                      </div>
                      <div class="header" v-if="!notification.scheduler.allowUntillDuration">
                        No
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="notification.scheduler && notification.scheduler.reminders">
                    <b-col cols="12" class="content p-0">
                      Reminders (Mobile notifications)
                    </b-col>
                    <b-col class="p-0" cols="4" v-for="(item, index) in notification.scheduler.reminders" :key="index">
                      <b-row class="p-0">
                        <b-col class="p-0" cols="1">
                          <div class="content">
                            Day
                          </div>
                          <div class="header">
                            {{item.day}}
                          </div>
                        </b-col>
                        <b-col class="p-0" cols="5" v-if="item.message">
                          <div class="content">
                            Message
                          </div>
                          <div class="header">
                            {{item.message}}
                          </div>
                        </b-col>
                        <b-col class="p-0" cols="3" v-if="item.time">
                          <div class="content">
                            Time
                          </div>
                          <div class="header">
                            {{item.time}}
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
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
export default {
  name: 'notifications-details',
  data() {
    return {
      selectedNotification: {
        notificationId: '',
      },
      notificationCollapse: {},
    };
  },
  components: {},
  props: {
    notificationDetails: {
      type: Array,
      default: () => {},
    },
  },
  methods: {
    expandNotification(id) {
      this.selectedNotification.notificationId = id;
      this.notificationCollapse[id] = true;
      this.$forceUpdate();
    },
    collapseNotification(id) {
      // debugger;
      this.selectedNotification.notificationId = '';
      this.notificationCollapse[id] = false;
      this.$forceUpdate();
    },
    expandAll() {
      this.notificationDetails.forEach(notification => {
        this.notificationCollapse[notification.notificationId] = true;
      });
      this.$forceUpdate();
    },
    collapseAll() {
      this.selectedNotification.notificationId = '';
      this.notificationDetails.forEach(notification => {
        this.notificationCollapse[notification.notificationId] = false;
      });
      this.$forceUpdate();
    },
  },
  watch: {
    notificationDetails() {
      if (this.notificationDetails && this.notificationDetails.length) {
        this.notificationDetails.forEach(notification => {
          this.notificationCollapse[notification.notificationId] = false;
        });
      }
    },
  },
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
.make-link {
  color: #1e8fe1 !important;
}
</style>
