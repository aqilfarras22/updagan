<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="pl-20 pr-20">
          <p class="m-0 mt-30 fs-16 fw-500 header_title">
            In addition to the activity notifications you have created, you may create additional notifications to
            remind your participants to perform certain tasks that do not tie to an activity.
          </p>
          <div class="header_title mt-20">Setup Custom Notifications</div>
          <div
            class="color_959fa4"
            v-if="notifications.length === 0"
          >e.g. Remember to charge your medical device, Do not eat after 10:00PM, Remember to take all your medications this week</div>
          <div
            class="row color_slate-grey"
            v-if="notifications.length > 0"
            v-for="(notification, notificationIndex) in notifications"
          >
            <div
              class="row card read_only_card bl_5px"
              v-if="(selectedNotification.index !== notification.index)"
            >
              <div class="col-lg-6 m-0 p-0">
                <div class="color_959fa4 fs-12">Notification Message</div>
                <div class="fs-14">{{notification.message}}</div>
              </div>
              <div class="col-lg-3 m-0 p-0" v-if="notification.scheduler">
                <div class fs-12>
                  <div v-if="notification.scheduler.type === 'milestone'">
                    <div class="color_959fa4">Milestone(s)</div>
                    <div>
                      <span v-for="(item, index) in notification.scheduler.milestones">
                        {{item}}
                        <span
                          v-if="(index + 1) !== notification.scheduler.milestones.length"
                        >,</span>
                      </span>
                    </div>
                  </div>
                  <div v-if="notification.scheduler.type === 'custom'">
                    <div class="color_959fa4">Frequency</div>
                    <div>{{notification.scheduler.frequency.title}}</div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 text-right">
                <button
                  class="edit-btn"
                  v-on:click="editNotification(notification, notificationIndex)"
                  :disabled="editNotificationMode"
                >Edit</button>
              </div>
            </div>
            <div
              class="row card edit-card"
              v-if="editNotificationMode && (selectedNotification.index === notification.index)"
            >
              <div class="row">
                <div class="col-lg-10 p-0">
                  <div class="form-group">
                    <label class="section_heading">Notification message</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="selectedNotification.message"
                      placeholder="ex. Remember to charge your wearable."
                    />
                  </div>
                  <div class="position_relative">
                    <span
                      class="font-style cursor_pointer dropdown-toggle"
                      data-toggle="dropdown"
                    >How long should my notification be?</span>
                    <span class="dropdown-menu custom-popover fs-12">
                      While there is not an exact number of words you should use for notifications, studies have shown that the most effective notification communications are
                      <span class="color_red fw-bold">under 10 words or &lt40 characters.</span>
                      <p class="color_959fa4 fs-10 mt-10">Sources: Localytics, Urban Airship</p>
                    </span>
                  </div>
                </div>
                <div class="col-lg-2">
                  <div class="form-group">
                    <label class="section_heading">Time of day</label>
                    <vue-timepicker format="hh:mm A" :minute-interval="10" v-model="time"></vue-timepicker>
                  </div>
                </div>
              </div>
              <div class="pt-20">
                <div class="pt-20 scheduler-heading">Which method would you like to schedule with?</div>
                <schedulerComponent
                  :options="{validateFor:'notification', scheduler: selectedNotification.scheduler}"
                ></schedulerComponent>
              </div>
              <div class="row mt-30">
                <div class="col-lg-9 col-md-9 col-sm-6 col-xs-2">
                  <button
                    class="btn btn-link pb-15 color_red pl-0"
                    v-on:click="deleteNotification(notification, notificationIndex)"
                  >Delete</button>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-10 text-right">
                  <button
                    class="btn btn-link pb-15 color_aa"
                    v-on:click="cancelNotification(notification, notificationIndex)"
                  >Cancel</button>
                  <button
                    class="btn btn-success save_btn mb-10 br-30"
                    v-on:click="validateScheduler(notification, notificationIndex)"
                  >Save</button>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-md mb-20 add-btn mt-15 br-25"
            v-on:click="addNotification()"
            :disabled="editNotificationMode"
          >Add a custom notification</button>
        </div>
        <div class="row">
          <div class="col-lg-4 col-lg-offset-8">
            <div class="card_section">
              <span class="position_relative">
                <img src="static/img/icn-phone.svg" />
                <span class="notify">23</span>
              </span>
              <span class="pt-25 pl-10 font-style">Don’t overwelm your participants!</span>
              <p class="m-0">
                While notifications are a great way to grab your participant’s attention, avoid overwelming them with too many
                notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footerStyle">
      <div class="container">
        <div class="row" v-if="isStudySummary">
          <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
          <b-btn
            class="btn br-25 disable-btn p-0 pt-5 mr-10"
            :to="{ name: 'study-summary', params: { studyId: studyId } }"
          >Back to study summary</b-btn>
          <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
        </div>
        <div class="row" v-if="!isStudySummary">
          <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
          <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
        </div>
      </div>
    </div>
    <CancelModal ref="cancelConfirmation" />
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import draggable from "vuedraggable";
import VueTimepicker from "vue2-timepicker";
import studyFeatureHeader from "../common/study-features-header";
import schedulerComponent from "../common/scheduler";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "notifications",
  data() {
    return {
      studyId: null,
      editNotificationMode: false,
      frequencies: [
        {
          type: "daily",
          title: "Daily",
          days: 1,
          disabled: false
        },
        {
          type: "weekly",
          title: "Weekly",
          days: 7,
          disabled: false
        },
        {
          type: "biweekly",
          title: "Every 2 Weeks",
          days: 15,
          disabled: false
        },
        {
          type: "monthly",
          title: "Monthly",
          days: 30,
          disabled: false
        },
        {
          type: "biannually",
          title: "Every 6 months",
          days: 180,
          disabled: false
        },
        {
          type: "annually",
          title: "Annually",
          days: 365,
          disabled: false
        }
      ],
      notifications: [],
      selectedNotificationIndex: null,
      selectedNotification: {
        notificationId: "",
        message: "",
        time: null,
        index: null
      },
      time: {
        hh: "",
        mm: "",
        A: ""
      },
      scheduler: {
        type: "custom",
        milestones: [],
        frequency: { type: null, title: null, days: null },
        startDay: null,
        endDay: null,
        completionWindow: null,
        reminders: [],
        allowMultipleTimes: false,
        allowUntillDuration: false,
        duration: [{ startDay: null, endDay: null }]
      },
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  components: {
    studyFeatureHeader,
    draggable,
    schedulerComponent,
    VueTimepicker,
    CancelModal
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.getStudyDetails();
    this.getNotifications();
  },
  computed: {
    schedulerObjChanged() {
      return this.$store.getters.getSchedulerObjData;
    }
  },
  watch: {
    schedulerObjChanged: {
      handler(val) {
        if (val.validatedFor === "notification") {
          this.saveNotification(
            this.selectedNotification,
            this.selectedNotificationIndex,
            val.schedulerObj
          ); // eslint-disable-line
        }
      }
    }
  },
  methods: {
    getNotifications() {
      this.$api.getNotificationsFact(this.studyId).then(
        response => {
          //eslint-disable-line
          if (response.body) {
            this.notifications = response.body;
          }
        },
        error => {
          //eslint-disable-line
          const err =
            error.body && error.body.message
              ? error.body.message
              : "Error while getting notifications";
          toastr.error(err);
        }
      );
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          //eslint-disable-line
          this.studyData = response.body;
          const sd = new Date(this.studyData.firstPatientEnrollDate).valueOf();
          const ed = new Date(this.studyData.firstPatientLastDate).valueOf();
          this.studyDuration = (ed - sd) / 1000 / 86400;
          _.forEach(this.frequencies, val => {
            //eslint-disable-line
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
          //eslint-disable-line
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    validateNotification() {
      if (!this.selectedNotification.message) {
        //eslint-disable-line
        toastr.error("Please enter your notification message.");
        return false;
      }
      if (this.time.A == "" && this.time.hh == "" && this.time.mm == "") {
        toastr.error("Please select your notification time.");
        return false;
      }
      return true;
    },
    validateScheduler(notification, index) {
      this.selectedNotificationIndex = index;
      this.$store.dispatch("addSchedule", { validateFor: "notification" });
    },
    saveNotification(notification, index, scheduler) {
      this.selectedNotification.time =
        this.time.hh + ":" + this.time.mm + " " + this.time.A; //eslint-disable-line
      this.selectedNotification.scheduler = scheduler;
      if (this.validateNotification()) {
        if (!notification.notificationId) {
          this.selectedNotification.index = this.getIndexForNewScreen();
          this.$api
            .saveCustomNotificationFact(this.studyId, this.selectedNotification)
            .then(
              response => {
                //eslint-disable-line
                this.notifications.splice(index, 1, response.body);
                this.selectedNotification = {};
                this.editNotificationMode = false;
                toastr.success("Notification added successfully");
              },
              error => {
                //eslint-disable-line
                const err =
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while saving notification";
                toastr.error(err);
              }
            );
        } else {
          this.$api
            .updateCustomNotificationFact(
              this.studyId,
              notification.notificationId,
              this.selectedNotification
            ) //eslint-disable-line
            .then(
              response => {
                //eslint-disable-line
                this.notifications.splice(index, 1, response.data);
                this.selectedNotification = {};
                this.editNotificationMode = false;
                toastr.success("Notification updated successfully");
              },
              error => {
                //eslint-disable-line
                const err =
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while updating notification";
                toastr.error(err);
              }
            );
        }
      }
    },
    cancelNotification(notification, index) {
      //eslint-disable-line
      if (!notification.notificationId) {
        this.notifications.splice(index, 1);
      }
      this.selectedNotification = {};
      this.editNotificationMode = false;
      this.$forceUpdate();
    },
    getIndexForNewScreen() {
      const highestValObj = _.maxBy(this.notifications, o => o.index); //eslint-disable-line
      return highestValObj && highestValObj.index ? highestValObj.index + 1 : 1;
    },
    deleteNotification(notification, index) {
      if (notification.notificationId) {
        this.$api
          .deleteCustomNotificationFact(
            this.studyId,
            this.selectedNotification.notificationId
          )
          .then(
            //eslint-disable-line
            () => {
              this.notifications.splice(index, 1);
              this.selectedNotification = {};
              this.editNotificationMode = false;
              toastr.success("Notification deleted successfully");
            },
            error => {
              //eslint-disable-line
              const err =
                error.body && error.body.message
                  ? error.body.message
                  : "Error while deleting notification";
              toastr.error(err);
            }
          );
      } else {
        this.cancelNotification(notification, index);
      }
    },
    editNotification(notification) {
      //eslint-disable-line
      this.$forceUpdate();
      this.selectedNotification = _.cloneDeep(notification);
      this.editNotificationMode = true;
      const [hm, a] = this.selectedNotification.time.split(" ");
      const [hh, mm] = hm.split(":");
      this.time.hh = hh;
      this.time.mm = mm;
      this.time.A = a;
      window.console.log(this.time);
    },
    addNotification() {
      this.editNotificationMode = true;
      this.notifications.push(this.selectedNotification);
    },
    nextClick() {
      if (this.editNotificationMode) {
        toastr.error("Please save your notifications before you continue");
      } else {
        this.skipForNow();
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, [
        "route",
        this.$route.name
      ]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    }
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  margin: 20px 0 10px;
}

.h4,
h4 {
  font-size: 18px;
  margin: 10px 0;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2 {
    flex: none;
  }
}

@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
  .col-lg-offset-8 {
    margin-left: 66.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

a:hover,
a:focus,
a:active {
  text-decoration: none !important;
  outline: 0px !important;
}
.custom-popover {
  position: absolute;
  width: 310px;
  border-radius: 3px;
  padding: 16px;
  left: 240px;
  top: 0px;
}
.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
}

.button-blue-1 {
  border: 1px solid#00bae0;
  color: #00bae0;
  background: transparent;
  border-radius: 25px;
}

.add-btn {
  font-size: 14px;
  min-width: 150px;
  border: 1px solid#f06559;
  color: #f06559;
  background: transparent;
}
.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.save_btn {
  width: 100px;
}
.bl_5px {
  border-left: 7px solid #d3dfe4 !important;
}
.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin-top: 10px;
}
.form-control {
  border-radius: 2px;
}
.read_only_card {
  padding: 17px 0px 17px 10px !important;
}
.edit-card {
  padding: 18px 15px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.card_section {
  border-radius: 8px;
  padding: 15px;
  margin: 40px 0px !important;
  border: solid 1px #d3dfe4;
}
.scheduler-heading {
  font-weight: 600;
  color: #666769;
}
.notify {
  font-size: 11px;
  color: #fff;
  padding: 1px 3px;
  position: absolute;
  background-color: red;
  border-radius: 3px;
  left: 7px;
  top: -10px;
  border-radius: 100px;
  background-color: #ff0109;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
}
</style>
