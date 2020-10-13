<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="visit-container">
            <div v-if="!addEditVisit && !onEdit" class="alreadyAddedVisits">
              <div v-if="countrySpecificStudyFeatures" class="mt-26">
                <div class="mb-10 font-weight-bold">Which countries will Telehealth be available in?</div>
                <div class="mb-20 countries-toggle">
                  <div v-for="(country, keyIndex) in countrySpecificStudyFeatures" :key="keyIndex" v-if="country.active">
                    <label class="switch">
                      <input
                        type="checkbox"
                        v-model="country.isTelehealthEnabled"
                      />
                      <div class="slider round"></div>
                      <span class="country-name">{{country.name}}</span>
                    </label>
                  </div>
                </div>
              </div>       
              
              <div class="mb-10 mt-31 font-weight-bold">Create telehealth visits by using milestones or custom frequency.</div>
              <div class="mb-20">
                <button
                  class="btn btn-outline-primary boldBtn"
                  @click="addNewVisit()"
                >Add a telehealth visit</button>
              </div>
              <hr class="mb-20" />
              <div v-if="existingVisits.length > 0">
                <div
                  v-model="existingVisits"
                  v-for="(v, key) in existingVisits"
                  v-bind:key="key"
                  class="mb-21"
                >
                  <div class="row">
                    <div class="col-sm-5 col-lg-5">
                      <strong>{{v.visitName}}</strong>
                    </div>
                    <div class="col-sm-5 col-lg-6">{{v.schedules}}</div>
                    <div class="col-sm-2 col-lg-1 text-right">
                      <span class="link" @click="editVisit(v)">Edit</span>
                      <span class="edit-icon" @click="deleteVisit(v, key)">
                        <img src="static/img/econsent/collapse_consent.svg" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="noVisists">No telehealth visits added</div>
            </div>
            <schedulerComponent
              v-if="addEditVisit || onEdit"
              :options="{validateFor:'telehealthv2', scheduler: telehealthVisit.scheduler, telehealthv2:true, telehealthVisitDTO: telehealthVisit.telehealthVisitDTO, notificationData: notificationData, isDataExist: isNotificationDataExist}"
              class="schedulerSection"
              @exit="addEditDone"
            ></schedulerComponent>
          </div>

          <div class="pt-20">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
            </span>
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
              <button
                class="btn br-25 continue-btn mr-10"
                v-on:click="validateScheduler()"
              >Save and Continue</button>
            </div>
            <div class="row" v-if="!isStudySummary">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="validateScheduler()">Save and Continue</button>
            </div>
          </div>
        </div>
        <CancelModal ref="cancelConfirmation" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";
import schedulerComponent from "../common/telehealth-scheduler";
import CancelModal from "./cancel-modify-modal";
import swal from "sweetalert2";
import { constants } from "fs";
import nprogress from "nprogress";

export default {
  name: "scheduler",
  data() {
    return {
      addEditVisit: false,
      existingVisits: [],
      studyId: null,
      surveyId: null,
      milestones: [],
      frequencies: [
        { type: "daily", title: "Daily", days: 1 },
        { type: "weekly", title: "Weekly", days: 7 },
        { type: "biweekly", title: "Every 2 Weeks", days: 15 },
        { type: "monthly", title: "Monthly", days: 30 },
        { type: "biannually", title: "Bi-annually", days: 180 },
        { type: "annually", title: "Annually", days: 360 }
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
          callReminders: [],
          allowMultipleTimes: false,
          allowUntillDuration: false,
          duration: [{ startDay: null, endDay: null }]
        },
        telehealthVisitDTO: {
          title: this.visitTitle,
          sequence: 1,
          createdTime: new Date(),
          version: "1.0",
          status: "Initiated",
          useHTML: true
        }
      },
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
      },
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      ),
      onEdit: false,
      isNotificationDataExist: false,
      countrySpecificStudyFeatures: null
    };
  },
  components: { studyFeatureHeader, schedulerComponent, CancelModal },
  computed: {
    telehealthVisitObjChanged() {
      return this.$store.getters.getTelehealthVisitObjData;
    }
  },
  watch: {
    telehealthVisitObjChanged: {
      handler(val) {
        if (val.validatedFor === "telehealthv2") {
          this.addTelehealthVisit(val.telehealthVisitObj);
        }
      }
    }
  },
  mounted() {
    let isSchedulerOpen = window.localStorage.getItem("isSchedulerOpen");
    let visitId = window.localStorage.getItem("visitId");

    // TODO : if visit id avialble; we need to open that visit in Edit mode and remove key from local storge
    if (isSchedulerOpen) {
      this.addNewVisit();
      window.localStorage.removeItem("isSchedulerOpen");
    }

    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 500;
    }, 3000);

    this.getExistingVisits();
    this.getCountrySpecificStudyFeatures();
  },
  methods: {
    addNewVisit() {
      this.addEditVisit = true;
      this.notificationData = [];
      this.telehealthVisit = {
        scheduler: {
          type: "milestone",
          milestones: [],
          frequency: { type: null, title: null, days: null },
          startDay: null,
          endDay: null,
          completionWindow: null,
          reminders: [],
          callReminders: [],
          allowMultipleTimes: false,
          allowUntillDuration: false,
          duration: [{ startDay: null, endDay: null }]
        },
        telehealthVisitDTO: {
          title: this.visitTitle,
          sequence: 1,
          createdTime: new Date(),
          version: "1.0",
          status: "Initiated",
          useHTML: true,
          visitType: 'Telehealth',
          extendAvailability: false,
          extendWindow: ""
        }
      }
      this.isNotificationDataExist = false;
    },
    editVisit(visit) {
      let self = this;
      this.$api.getVisitDetail(this.studyId, visit.visitId).then(
        response => {
          self.telehealthVisit.scheduler = response.body.scheduler;
          if (response.body.scheduler !== null) {
            self.notificationData = self.processNotification(
              self.telehealthVisit.scheduler
            );
          }
          self.telehealthVisit.telehealthVisitDTO =
            response.body.telehealthVisitDTO;
          self.onEdit = true;
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while fetching telehealth visits"
          );
          nprogress.done();
        }
      );
    },
    processNotification(notification) {
      let notificationArr = []; 
      let self = this;
      if(notification.reminders && notification.reminders.length > 0) {
        notificationArr.push({
          eventType: 1, 
          day: notification.reminders, 
          message: notification.reminders[0].message,
          time: self.processTime(notification.reminders[0].time)
        })
        self.isNotificationDataExist = true;
      }

      if(notification.callReminders && notification.callReminders.length > 0) {
        notificationArr.push({
          eventType: 2, 
          day: notification.callReminders, 
          message: notification.callReminders[0].message,
          time: self.processTime(notification.callReminders[0].time)
        })
        self.isNotificationDataExist = true;
      }
      if(!self.isNotificationDataExist) {
        return notificationArr;
      }
      notificationArr = self.processOccurranceStringAndCount(notificationArr);
      return notificationArr;
    },
    processOccurranceStringAndCount(notificationArr) {
      let occurranceList = [];
      let telehealthReminders = [];
      let that = this;
      for(let i = 0; i < notificationArr.length; i++) {
        let list = null;
        switch (notificationArr[i].eventType) {
          case 1:
            occurranceList = [];
            telehealthReminders = [];
            list = notificationArr[i].day;
            for(let i = 0; i < list.length; i++) {
                occurranceList.push({
                  text: this.getOccuranceText(list[i].day),
                  value: list[i].day
                });
                telehealthReminders.push({
                  text: this.getOccuranceText(list[i].day),
                  value: list[i].day
                });
              }
            break;
          case 2:
            occurranceList = [];
            telehealthReminders = [];
            list = notificationArr[i].day;
            for (let i = 0; i < list.length; i++) {
              let v = 0;
              let time = list[i].time;
              const [value, str] = time.split(" ");
              v = list[i].delayType != null ? list[i].delayType == "after" ? "a-" + value : "b-" + value : 0;
              let eventOptions = that.eventOptionTypes[2];
              eventOptions.filter(k => {
                if (v == k.value) {
                  telehealthReminders.push({
                    text: k.text,
                    value: value
                  });

                  occurranceList.push({
                    text: k.text,
                    value: k.value,
                    delayType: k.delayType
                  });
                }
              });
            }
            break;
        }
        notificationArr[i].telehealthReminders = telehealthReminders;
        notificationArr[i].occurranceList = occurranceList;
      }
      return notificationArr;
    },
    getOccuranceText(value) {
      let stringText = "";
      if (value == 0) {
        stringText = "At time of event";
      } else {
        stringText = value + " day(s) after (if not complete)";
      }
      return stringText;
    },
    processTime(time) {
      const [fhm, fa] = time.trim().split(" ");
      const [fhh, fmm] = fhm.split(":");
      return {
        hh: fhh,
        mm: fmm,
        A: fa
      };
    },
    deleteVisit(visit, index) {
      let self = this;
      swal({
        title:
          "Are you sure you want to delete this? \n You cannot undo this action.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        cancelButtonText: "Delete",
        confirmButtonText: "Cancel"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api.deleteTeleHealthVisitFact(this.studyId, visit.visitId).then(
            response => {
              self.existingVisits.splice(index, 1);
              nprogress.done();
              toastr.success(visit.visitName + " visit has been deleted");
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : "Error while deleting telehealth visits"
              );
              nprogress.done();
            }
          );
        }
      });
    },
    getExistingVisits() {
      nprogress.start();
      this.$api.getTeleHealthVisitFact(this.studyId).then(
        response => {
          this.existingVisits = response.body;
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting telehealth visits"
          );
          nprogress.done();
        }
      );
    },
    addEditDone() {
      //This is the custom event handler which will be called from the child component
      this.addEditVisit = false;
      this.onEdit = false;
      this.getExistingVisits();
    },
    goBack() {
      if (!this.addEditVisit) {
        window.history.back();
      } else {
        this.addEditVisit = false;
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
    },
    validateScheduler() {
      if (this.addEditVisit) {
        this.$store.dispatch("telehealthVisitAction", {
          validateFor: "telehealthv2"
        });
      } else {
        
        //Validate that atleast one country must have telehealth feature enabled or not
        if(_.chain(this.countrySpecificStudyFeatures).filter({'isTelehealthEnabled':true}).size().value()==0){
          toastr.error("At least one country must have Telehealth feature enabled.");
          return;
        }
        else{
          //Update the country specific telehealth status
          this.updateCountrySpecificStudyFeatures();
        }

        this.continue();
      }
    },
    addTelehealthVisit(telehealthVisitObj) {
      nprogress.start();
      const schedulerObj = telehealthVisitObj.schedulerObj;
      const telehelathVisitedObj = telehealthVisitObj.telehelathVisitObj;
      const postParam = new Object();
      postParam.telehealthVisitDTO = telehelathVisitedObj;
      postParam.scheduler = schedulerObj;
      postParam.telehealthVisitDTO.version = parseInt(
        postParam.telehealthVisitDTO.version
      ); // handle version for id : TUR-12741
      // BE dont support string
      if (telehealthVisitObj.telehelathVisitObj.id === undefined) {
        this.createVisit(this.studyId, postParam);
      } else {
        this.updateVisit(
          this.studyId,
          postParam.telehealthVisitDTO.id,
          postParam
        );
      }
    },
    updateVisit(studyId, visitId, postParam) {
      this.$api.updateTeleHealthVisitFact(studyId, visitId, postParam).then(
        () => {
          toastr.success("Scheduling completed succesfully");
          this.addEditDone();
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while the scheduling the survey"
          );
          nprogress.done();
        }
      );
    },
    createVisit(studyId, postParam) {
      this.$api.postTeleHealthVisitFact(studyId, postParam).then(
        () => {
          toastr.success("Scheduling completed succesfully");
          this.addEditDone();
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while the scheduling the survey"
          );
          nprogress.done();
        }
      );
    },
    continue() {
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
    getCountrySpecificStudyFeatures() {
      this.$api.getCountrySpecificStudyFeatures(this.studyId).then(
        response => {
          this.countrySpecificStudyFeatures = response.body;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting country specific telehealth status"
          );
        }
      );
    },
    updateCountrySpecificStudyFeatures() {
      this.$api.updateCountrySpecificStudyFeatures(this.studyId, this.countrySpecificStudyFeatures).then(
        response => {},
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while updating country specific telehealth status"
          );
        }
      );
    }
  }
};
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
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
  color: #333;
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
  color: #333;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

/deep/ .col {
  padding: 0px !important;
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
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

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

.example {
  margin: 40px 40px 20px 40px;
}
.example-content {
  padding: 20px 40px 20px 40px;
}
.example-header {
  padding: 20px 80px 10px 80px;
  font-weight: bold;
}

.form-control {
  border-radius: 2px;
}
.bg-none {
  background: none !important;
  outline: none !important;
  border: 1px solid #d3dfe4;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.country_image {
  max-width: 25px;
}

.selected_country_image {
  width: 30px;
}

.code_style {
  border-radius: 2px !important;
  border: 1px solid #ced4da;
  min-width: 70px;
  background-color: #ffffff;
}

.color_666669 {
  color: #666669;
}

.dropdown-menu {
  overflow-y: scroll;
  height: 280px;
  z-index: 98;
  width: 500px;
}

.input-width {
  width: 430px;
  padding-left: 10px;
}

// New CSS
.visit-container {
  font-family: Lato-Regular;
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;

  .noVisists {
    color: #b0bac9;
    font-weight: bold;
  }

  .edit-icon {
    margin-left: 20px;
    cursor: pointer;
  }

  .schedulerSection {
    background: #ffffff;
    border-radius: 4px;
    border: solid 1px #e4e8eb;
    padding: 20px 21px;
  }

  button {
    &.btn-outline-primary {
      border-color: #1e8fe1;
      color: #1e8fe1;
      &:hover {
        color: #ffffff;
        background-color: #1e8fe1;
      }
    }
  }

  .boldBtn {
    font-weight: bold;
  }
  .col-sm-5,
  .col-sm-2,
  .col-lg-5,
  .col-lg-6,
  .col-lg-1 {
    padding-left: 0px;
    padding-right: 0px;
  }
}
.link {
  font-weight: bold;
  text-align: right;
  color: #1e8fe1;
  cursor: pointer;
}

.countries-toggle{
  
  label{
    margin-bottom: 0.5625rem;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 20px;
    
    input {
      display: none;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: -2px;
      bottom: 0;
      border: 2px solid #ccc;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      left: 2px;
      bottom: 2px;
      background-color: #ccc;
    }

    input:checked + .slider {
      border: 2px solid #48bf7a;
    }

    input:checked + .slider:before {
      content: "";
      background-color: #48bf7a;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
      /*content: '✓';*/
      position: absolute;
      color: #2ecc71;
      text-align: center;
      font-size: 20px;
      -webkit-transform: translateX(14px);
      -ms-transform: translateX(14px);
      transform: translateX(14px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 32px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    .country-name{
      margin-left:48px;
      font-size: 16px;
      font-weight: bold;
      color: #666669;
      cursor:pointer;
      position:absolute;
      padding-top:3px;
      white-space: nowrap;
    }
    
  }
}

body.ie .countries-toggle .switch .country-name{
  padding-top:4px;
}


</style>
