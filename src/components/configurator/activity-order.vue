<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>

      <div v-if="schedules.length > 0">
        <div class="pl-20 pr-20 pb-20" v-if="!editOrder">
          <div
            class="mt-30 edit-info"
          >You may configure the order of how activities are displayed in the app if they are scheduled at the same time. Click on Edit to rearrange.</div>
          <div class="mt-15">
            <button class="edit-button" v-on:click="editActivityOrder()">Edit</button>
          </div>
          <div>
            <div
              class="pt-15 pb-15 activity-span"
              v-bind:class="{'activity-div':index !== (schedules.length-1)}"
              v-for="(schedule,index) in schedules"
              :key="index"
            >
              <span>{{schedule.tasks[0].taskTitle}}</span>
              <span>{{schedule.tasks[0].taskType}}</span>
            </div>
          </div>
        </div>
        <div class="pl-20 pr-20 pb-20" v-if="editOrder">
          <div
            class="mt-30 edit-info"
          >You may configure the order of how activities are displayed in the app if they are scheduled at the same time. Drag and drop activities to rearrange.</div>
          <div class="mt-15">
            <button class="cancel-button" v-on:click="cancelEditOrder()">Cancel</button>
            <button class="save-button" v-on:click="saveActivityOrder()">Save</button>
          </div>
          <div class="mt-15">
            <draggable
              v-model="schedules"
              @start="drag=true"
              @end="drag=false"
              @change="onDragActivities()"
            >
              <div
                class="pt-15 pb-15 activity-drag"
                v-for="(schedule,index) in schedules"
                :key="index"
              >
                <img src="static/img/econsent/scrubber.svg" class="ml-10 mr-10" />
                <span>{{schedule.tasks[0].taskTitle}}</span>
                <span>{{schedule.tasks[0].taskType}}</span>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="pl-20 pr-20 pb-20" v-else>
        <div
          class="mt-30 edit-info"
        >You may configure the order of how activities are displayed in the app if they are scheduled at the same time. Click on Edit to rearrange.</div>
        <div class="mt-20">No scheduled activities</div>
      </div>
      <div class="p-20">
        <span class="back_link" v-on:click="goBack()">
          <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
        </span>
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
  </div>
</template>
<script>
import _ from "lodash";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";
import draggable from "vuedraggable";
import swal from "sweetalert2";

export default {
  name: "activity-order",
  data() {
    return {
      studyId: null,
      editOrder: false,
      schedules: [],
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },

  components: { studyFeatureHeader, CancelModal, draggable },

  mounted() {
    this.studyId = this.$route.params.studyId;
    this.getActivityList();
  },

  methods: {
    goBack() {
      window.history.back();
    },
    getActivityList() {
      this.$api.getActivitiesFact(this.studyId).then(
        response => {
          let order = false;
          this.schedule = response.body;
          this.schedules = response.body.schedules;
          this.schedules.forEach((item, index) => {
            if (item.displayOrder === null) {
              order = true;
            }
          });
          if (order === true) {
            this.schedules = _.sortBy(this.schedules, "sequence");
          } else {
            this.schedules = _.sortBy(this.schedules, "displayOrder");
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting activity order."
          );
        }
      );
    },
    saveActivityOrder() {
      this.$api
        .updateActivitiesFact(this.studyId, this.schedule)
        .then(response => {
          this.schedules = _.sortBy(response.body.schedules, "displayOrder");
          this.$toastr.success("Activity order updated successfully");
          this.editOrder = false;
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while updating activity order."
            );
          };
        });
    },
    onDragActivities() {
      this.schedules.forEach((item, index) => {
        this.schedules[index].displayOrder = index + 1;
      });
    },
    editActivityOrder() {
      this.editOrder = true;
    },
    cancelEditOrder() {
      swal({
        title: "Are you sure you want to cancel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#34537d",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.editOrder = false;
          this.getActivityList();
        }
      });
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    },
    nextClick() {
      if (this.editOrder) {
        this.$toastr.error("Please save or cancel your changes to continue.");
      } else {
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
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.edit-button {
  color: #1e8fe1;
  border: 1px solid #1e8fe1;
  background-color: #ffffff;
  border-radius: 3px;
  padding: 6px 35px;
  cursor: pointer;
}

.edit-info {
  font-family: "RobotoBold";
}

.activity-div {
  border-bottom: 1px solid #e4e8eb;
}

.activity-drag {
  border: 1px solid #e4e8eb;
  margin-bottom: 10px;
  border-radius: 4px;
}

.activity-span span {
  display: inline-block;
  width: 40%;
}

.activity-drag span {
  display: inline-block;
  width: 40%;
}

.cancel-button {
  color: #4a4a4a;
  border: 1px solid #4a4a4a;
  background-color: #ffffff;
  border-radius: 3px;
  padding: 6px 35px;
  margin-right: 10px;
  cursor: pointer;
}

.save-button {
  color: #ffffff;
  border: 1px solid #1e8fe1;
  background-color: #1e8fe1;
  border-radius: 3px;
  padding: 6px 35px;
  cursor: pointer;
}

.footerStyle {
  .row {
    display: block;

    &:after {
      content: "";
      clear: both;
      display: block;
    }
  }
}

.btn {
  font-size: 14px;
}
</style>