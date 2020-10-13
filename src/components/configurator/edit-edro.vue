<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20">
        <p class="pt-15 m-0 fs-20">Your eDROs</p>
        <p class="pt-10 m-0 fs-14">
          Now that you have selected your eDROs, please confirm or update the initial instruction screen provided with each eDRO. You
          will also need to set the frequency of each eDRO throughout the lifecycle of the study.
        </p>
        <div class="row card" v-for="activity in activities">
          <div v-if="selectedActivity.key != activity.key">
            <div class="col-lg-11 col-md-10 col-sm-9 col-xs-9 pl-0">
              <div class="col-lg-1 col-md-2 col-sm-2 col-xs-6 p-0">
                <img :src="activity.icon" class="edro_image_readonly" />
              </div>
              <div class="col-lg-11 col-md-10 col-sm-10 col-xs-6 p-5">
                <div class="fs-16 fw-500">
                  {{activity.title}}
                  <!--<span class="icon-style text-left ml-5" data-toggle="modal" data-target="#myModal" v-on:click="modalData = activity.title"
                  v-html="view_icon" v-if="!activity.comingSoon"></span>-->
                </div>
                <div class="fs-14 pt-5">{{activity.description}}</div>
              </div>
            </div>
            <div class="col-lg-1 col-md-2 col-sm-3 col-xs-3 text-right p-10">
              <button class="edit-btn" v-on:click="editActivity(activity)">Edit</button>
            </div>
          </div>
          <div class v-if="selectedActivity.key == activity.key">
            <div class="row">
              <img :src="activity.icon" class="edro_image" />
              <span class="fs-16 pl-10">
                <span>{{activity.title}}</span>
                <!--<span class="icon-style text-left ml-5" data-toggle="modal" data-target="#myModal" v-on:click="modalData = activity.title" v-html="view_icon"
                v-if="!activity.comingSoon"></span>-->
              </span>
            </div>
            <div class="row pt-10">
              <div class="section_heading">Instruction title</div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control input-md"
                  v-model="selectedActivity.title"
                  placeholder="Enter page title"
                />
              </div>
            </div>
            <div class="pt-20">
              <div class="section_heading">Instruction Details</div>
              <textarea
                class="form-control"
                rows="4"
                cols="126"
                v-model="selectedActivity.description"
              ></textarea>
            </div>
            <div class="pt-20">
              <div class="section_heading">Which method would you like to schedule with?</div>
              <schedulerComponent
                :options="{validateFor:'edro', scheduler: selectedActivity.scheduler}"
              ></schedulerComponent>
            </div>
            <div class="row pt-20">
              <div class="col-lg-9 col-md-9 col-sm-6 col-xs-2 p-0">
                <button
                  class="btn btn-link pb-15 color_red pl-0"
                  v-on:click="deleteEDRO()"
                >Delete eDRO</button>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-xs-10 text-right p-0">
                <button class="btn btn-link pb-15 color_aa" v-on:click="cancelEDRO()">Cancel</button>
                <button
                  class="btn btn-success save_btn mb-10 br-30"
                  v-on:click="validateScheduler()"
                >Save</button>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-20">
          <router-link
            type="button"
            class="btn btn-md mb-20 add-btn br-25"
            :to="{ name: 'edros', params: { studyId: this.studyId } }"
          >Add another eDRO</router-link>
        </div>
        <div class="pb-10">
          <span class="back_link" v-on:click="goBack()">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
          </span>
        </div>
      </div>
    </div>

    <div id="myModal" class="modal fade" role="dialog">
      <div
        class="modal-dialog modal_custom"
        v-for="select in activitiesJson"
        v-if="modalData === select.title"
      >
        <div class="modal-content">
          <div class="close-modal">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="row">
            <div class="color_blue fs-24">{{select.title}}</div>
            <div class="col-lg-8 colg-md-7 col-xs-12 col-sm-7 p-0 pr-50">
              <p class="color_blue pt-10">eDRO details | License information</p>
              <div class="fw-bold fs-14">Category</div>
              <p class="fs-12 pb-5">{{select.category}}</p>
              <div class="fw-bold fs-14">Description</div>
              <p class="fs-12 pb-5">{{select.description}}</p>
              <div class="fw-bold fs-14">Default configuration settings</div>
              <div v-for="setting in select.configurationSettings">
                <p class="fs-12 m-0">{{setting.name}}: {{setting.details}}</p>
              </div>
              <button class="btn-style color-white">Custom configuration coming soon!</button>
              <div class="fw-bold fs-14">Data collected</div>
              <ul class="m-0 list-style pb-10">
                <li class="fs-12" v-for="data in select.dataCollected">{{data}}</li>
              </ul>
            </div>
            <div class="col-lg-4 col-md-5 col-xs-12 col-sm-5 pr-40 pt-20">
              <div
                id="myCarousel"
                class="carousel slide text-center carousel-style"
                data-ride="carousel"
              >
                <!-- Indicators -->
                <ol class="carousel-indicators style-indicators">
                  <!--<li data-target="#myCarousel" data-slide-to="index" ></li>-->
                  <li
                    data-target="#myCarousel"
                    data-slide-to="index"
                    :class="{'active': index==0}"
                    v-for="(screen,index) in select.screenshots"
                  ></li>
                </ol>
                <!-- Wrapper for slides -->
                <div class="carousel-inner" role="listbox">
                  <div
                    class="item"
                    v-for="(screen,index) in select.screenshots"
                    :class="{'active': index==0}"
                  >
                    <img :src="screen" />
                  </div>
                </div>
                <!-- Left and right controls -->
              </div>
              <a
                class="left carousel-control style-left"
                href="#myCarousel"
                role="button"
                data-slide="prev"
              >
                <span class="fa fa-caret-left" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a
                class="right carousel-control style-right color_blue"
                href="#myCarousel"
                role="button"
                data-slide="next"
              >
                <span class="fa fa-caret-right" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
            <div class="row clearfix p-20 text-center">
              <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
                <button
                  type="button"
                  class="btn btn-md btn-block btn-info br-25"
                  v-on:click="addEdros(select)"
                  data-dismiss="modal"
                >Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footerStyle">
      <div class="container">
        <div class="row">
          <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
          <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import Datepicker from "vuejs-datepicker";
import studyFeatureHeader from "../common/study-features-header";
import schedulerComponent from "../common/scheduler";
import edroData from "../../data/edros.json";

export default {
  name: "selectEdros",
  data() {
    return {
      studyId: null,
      activities: null,
      activitiesJson: edroData,
      selectedActivity: "",
      selectedActivities: [],
      daysOccurrenceArr: [],
      view_icon: '<i class="fa fa-eye" aria-hidden="true"></i>',
      modalData: "",
      editMode: false,
      surveyData: {},
      milestones: [],
      frequencies: [
        { type: "daily", title: "Daily", days: 1 },
        { type: "weekly", title: "Weekly", days: 7 },
        { type: "biweekly", title: "Every 2 Weeks", days: 15 },
        { type: "monthly", title: "Monthly", days: 30 },
        { type: "biannually", title: "Bi-annually", days: 180 },
        { type: "annually", title: "Annually", days: 360 }
      ],
      scheduler: {
        type: "milestone",
        milestones: [],
        frequency: {},
        startDay: null,
        endDay: null,
        completionWindow: null,
        reminders: [{}],
        allowMultipleTimes: false,
        allowUntillDuration: false
      }
    };
  },
  components: {
    studyFeatureHeader,
    datepicker: Datepicker,
    schedulerComponent
  },
  computed: {
    schedulerObjChanged() {
      return this.$store.getters.getSchedulerObjData;
    }
  },
  watch: {
    schedulerObjChanged: {
      handler(val) {
        if (val.validatedFor === "edro") {
          this.scheduler = val.schedulerObj;
          this.updateEdroData();
        }
      }
    }
  },

  mounted() {
    window.scrollTo(0, 0);
    this.studyId = this.$route.params.studyId;
    this.getSelectedActivities();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    getSelectedActivities() {
      this.$api.getSelectedActivitesFact(this.studyId).then(
        response => {
          this.selectedActivities = _.uniqBy(response.body, "key");
          this.activities = response.body;
          _.forEach(this.activities, obj => {
            if (obj.scheduler && !obj.scheduler.weeksList) {
              obj.scheduler.weeksList = []; // eslint-disable-line
            }
          });
          this.selectedActivity = _.cloneDeep(this.activities[0]);
          if (this.selectedActivity.scheduler) {
            this.scheduler = this.selectedActivity.scheduler;
          } else {
            this.schedulerChange();
            this.scheduler.scheduleType = "milestone";
          }
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the selected activities"
          );
        }
      );
    },
    editActivity(activity) {
      this.editMode = true;
      this.selectedActivity = _.cloneDeep(activity);
      if (this.selectedActivity.scheduler) {
        this.scheduler = this.selectedActivity.scheduler;
      } else {
        this.schedulerChange();
        this.scheduler.scheduleType = "milestone";
      }
    },
    schedulerChange() {
      this.scheduler = {
        type: "milestone",
        milestones: [],
        frequency: {},
        startDay: null,
        endDay: null,
        completionWindow: null,
        reminders: [{}],
        allowMultipleTimes: false,
        allowUntillDuration: false
      };
    },
    validateScheduler() {
      this.$store.dispatch("addSchedule", { validateFor: "edro" });
    },
    updateEdroData() {
      this.scheduler.taskType = "activity";
      this.scheduler.taskId = this.selectedActivity.identifier;
      this.selectedActivity.scheduler = this.scheduler;
      this.$api
        .updateSelectedActivitesFact(
          this.studyId,
          this.selectedActivity.identifier,
          this.selectedActivity
        ) // eslint-disable-line
        .then(
          response => {
            const sectionIndex = _.findIndex(this.activities, [
              "identifier",
              response.body.identifier
            ]);
            if (this.activities.length - 1 > sectionIndex && !this.editMode) {
              this.activities.splice(sectionIndex, 1, response.body);
              this.selectedActivity = _.cloneDeep(
                this.activities[sectionIndex + 1]
              );
              if (this.selectedActivity.scheduler) {
                this.scheduler = this.selectedActivity.scheduler;
              } else {
                this.schedulerChange();
                this.scheduler.scheduleType = "milestone";
              }
            } else {
              this.activities.splice(sectionIndex, 1, response.body);
              this.selectedActivity = {};
            }
            toastr.success("Activity updated successfully");
          },
          error => {
            toastr.error(
              error.body
                ? error.body.message
                : "Error while getting the selected activities"
            );
          }
        );
    },
    deleteEDRO() {
      this.$api
        .deleteSelectedActivitesFact(
          this.studyId,
          this.selectedActivity.identifier
        ) // eslint-disable-line
        .then(
          () => {
            const sectionIndex = _.findIndex(this.activities, [
              "identifier",
              this.selectedActivity.identifier
            ]);
            this.activities.splice(sectionIndex, 1);
            this.selectedActivity = {};
            toastr.success("Activity deleted successfully");
          },
          error => {
            toastr.error(
              error.body
                ? error.body.message
                : "Error while getting the selected activities"
            );
          }
        );
    },
    cancelEDRO() {
      this.selectedActivity = "";
    },
    nextClick() {
      let schedulerCount = 0;
      _.forEach(this.activities, value => {
        if (value.scheduler) {
          schedulerCount += 1;
        } // eslint-disable-line
      });
      if (this.activities.length !== schedulerCount) {
        toastr.error("Please add scheduler for all the selected activities");
      } else {
        const selectedFeatures = this.$store.getters.getSelectedFeatures;
        const featureIndex = _.findIndex(selectedFeatures, ["route", "edros"]);
        if (featureIndex === selectedFeatures.length - 1) {
          this.$router.push({ name: "features-library-final" });
        } else {
          this.$router.push({
            name: selectedFeatures[featureIndex + 1].route,
            params: { studyId: this.studyId }
          });
        }
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, ["route", "edros"]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
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
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
  /*height: 100px;*/
  padding: 16px 12px;
  margin: 20px;
}

.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.milestone {
  padding: 0px 12px 0px 120px;
}

.edro_image_readonly {
  width: 100%;
  max-width: 60px;
  padding: 0 5px;
}
.edro_image {
  width: 100%;
  max-width: 40px;
}
.form-control {
  border-radius: 2px;
}
.add-btn {
  font-size: 14px;
  min-width: 150px;
  border: 1px solid #1f95f2;
  color: #1f95f2;
  background: transparent;
}
.section_heading {
  font-weight: bold;
  font-size: 14px;
  color: #1f95f2;
}
.save_btn {
  width: 100px;
}
.icon-style {
  font-size: 14px !important;
  background: #e7eef2 !important;
  border-radius: 50% !important;
  width: 26px !important;
  padding: 2px 6px;
  left: 8px;
  cursor: pointer;
}

.close-modal {
  right: -5px;
  position: relative;
  top: -5px;
  button {
    font-size: 32px;
  }
}

.modal_custom {
  margin-top: 50px auto;
  max-width: inherit;

  .modal-content {
    padding: 20px;
  }
}

.modal {
  .carousel-style {
    border: 1px solid #888;
    border-radius: 2px;
    width: 100%;
    margin: auto;
    max-width: 200px;
  }
  .style-indicators {
    bottom: -35px;
  }
  .style-right {
    background: transparent !important;
    right: 0px;
    color: #1f95f2 !important;
  }
  .style-left {
    background: transparent !important;
    left: -25px;
    color: #1f95f2 !important;
  }
  .selectedtext {
    color: white !important;
  }
  .btncolor {
    background-color: #1f95f2 !important;
  }
  .btn-style {
    background: #7478e6;
    outline: #1f95f2 !important;
    border-radius: 25px;
    font-size: 12px;
    padding: 4px 15px;
    margin-bottom: 15px;
  }
  .btn-bgcolor {
    background-color: #fff;
  }
  .carousel-indicators li {
    border: 1px solid #8fc5dc;
  }
  .carousel-indicators .active {
    background-color: #1f95f2;
  }
  .style-gly {
    top: 150px;
  }

  .list-style {
    padding: 0px 15px;
  }
}
</style>
