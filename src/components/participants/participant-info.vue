<template>
  <div>
    <dl v-if="participantDetails.id">
      <dt>THREAD ID</dt>
      <dd>{{ participantDetails.id }}</dd>
      <dd v-if="participantDetails.studyDaysIndicator">{{ participantDetails.studyDaysIndicator }}</dd>
    </dl>
    <dl v-if="participantDetails.id">
      <dt>Participant ID<span v-if="(canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess) && (participantDetails.status == 'NOTINVITED' || ( (participantDetails.userDefinedParticipantId && participantDetails.userDefinedParticipantId.trim() == '') || !participantDetails.userDefinedParticipantId )) " @click="openEditModal()" class="edit-id">Edit</span></dt>
      <dd>{{ participantDetails.userDefinedParticipantId }}</dd>
    </dl>
    <dl v-if="participantDetails.email && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canSiteDataLockAccess)" ref="email">
      <dt>Email</dt>
      <dd>{{ participantDetails.email }}</dd>
    </dl>
    <dl v-if="participantDetails.firstName && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canSiteDataLockAccess)" ref="firstName">
      <dt>First Name</dt>
      <dd>{{ participantDetails.firstName }}</dd>
    </dl>
    <dl v-if="participantDetails.lastName && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canSiteDataLockAccess)" ref="lastName">
      <dt>Last Name</dt>
      <dd>{{ participantDetails.lastName }}</dd>
    </dl>
    <dl v-if="participantDetails.dob && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canSiteDataLockAccess)" ref="dob">
      <dt>Date of Birth</dt>
      <dd>{{ new Date(participantDetails.dob) | dateFormat }}</dd>
    </dl>
    <dl v-if="participantDetails.dob && canDmAccess" ref="yob">
      <dt>Year of Birth</dt>
      <dd>{{ new Date(participantDetails.dob).getFullYear() }}</dd>
    </dl>
    <dl v-if="participantDetails.gender && (canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess || canSiteDataLockAccess)" ref="gender">
      <dt>Gender</dt>
      <dd>{{ participantDetails.gender }}</dd>
    </dl>
    <dl
      v-if="participantDetails[item]"
      ref="customlabel"
      v-for="(item,index) in customLabels"
      :key="index"
    >
      <dt>{{getLabel(item)}}</dt>
      <dd>{{ participantDetails[item] }}</dd>
    </dl>
    <dl v-if="participantDetails.countryName" ref="country">
      <dt>Country</dt>
      <dd>{{ participantDetails.countryName}}</dd>
    </dl>
    <dl v-if="participantDetails.participantLanguage" ref="language">
      <dt>Language</dt>
      <dd>{{ participantDetails.participantLanguage.display_name }}</dd>
    </dl>
    <dl v-if="surveyLocalResponseDate === ''">
    </dl>
    <dl v-else>
      <dt>Date Completed</dt>
      <dd class="fs-13">{{ surveyLocalResponseDate }} 
      </dd>
    </dl>
    <div v-if="canInitiateTelehealthCall()" class="mb-16">
      <button
        type="button"
        class="btn btn-outline-primary btn-block new-video-call-btn"
        @click="InitateVideoCall"
        :disabled="disableCallBtn()"
      >Invite to video call</button>
    </div>
    <dl v-if="canPiAccess && teleHealthConfigured" ref="dob">
      <dd>
        <b-button
          class="fs-12 encounter_btn"
          variant="outline-primary"
          v-if="teleHealthConfigured && telehealthEnabled"
        >
          <span
            v-if="!visitDetails || !visitDetails.visitId"
            @click="startAnEncounter()"
          >START AN ENCOUNTER</span>
          <span
            v-if="visitDetails && visitDetails.visitId"
            @click="endAnEncounter()"
          >END AN ENCOUNTER</span>
        </b-button>
      </dd>
    </dl>

    <dl ref="dob">
      <dd
        v-if="(canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess) && (participantDetails.status === 'ACTIVE'
      || participantDetails.status === 'VERIFIED' || participantDetails.status === 'INVITED'
      || participantDetails.status === 'NOTINVITED')"
      >
        <b-button
          class="fs-12 encounter_btn"
          variant="outline-danger"
          v-b-modal.disqualifyModal
          :disabled="participantDetails.status === 'DISQUALIFIED'"
        >
          <span>DISQUALIFY</span>
        </b-button>
      </dd>
    </dl>
    <dl ref="dob">
      <dd v-if="(canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess) && participantDetails.status === 'DISQUALIFIED'">
        <b-button
          class="fs-12 encounter_btn"
          variant="outline-danger"
          v-b-modal.disqualifyModal
          :disabled="participantDetails.status === 'DISQUALIFIED'"
        >
          <span>DISQUALIFY</span>
        </b-button>
      </dd>
    </dl>
    <dl ref="dob">
      <dd v-if="((participantDetails.status === 'ACTIVE' || participantDetails.status === 'VERIFIED') && (canPiAccess || canSubPiAccess || canScAccess))" >                  
      <button
        type="button"
        class="btn btn-outline-primary btn-block new-video-call-btn"
        @click="withDrawParticipant"
        :disabled="participantDetails.status === 'WITHDRAWSTUDY'"
       ><span class="fs-11">Withdraw Participant</span></button>
      </dd>
    </dl>
    <!-- Modal Component -->
    <b-modal ref="disqualifyModal" id="disqualifyModal" hide-footer hide-header size="lg">
      <b>
        <p class="fs-16 pl-10 pr-10">
          Disqualify participant:
          <br>
          {{participantId}}?
        </p>
      </b>
      <p class="pl-10 pr-10">For what reason are you disqualifying this participant from this study?</p>
      <div class="pl-10 pr-10">
        <div v-for="(reason, index) in disqualifyReasons" :key="index">
          <b-form-checkbox @change="reason.value =!reason.value" v-model="reason.value">
            <span class="pl-20">{{reason.text}}</span>
          </b-form-checkbox>
          <br>
        </div>
        <div class="pl-40 pr-40 pt-10">
          <b-form-textarea
            v-if="disqualifyReasons[3].value"
            v-model="disqualifyReasons[3].otherOptValue"
            size="sm"
            placeholder="Please Explain"
            :rows="3"
          ></b-form-textarea>
        </div>
      </div>
      <b-col cols="10" offset="1" class="pb-10">
        <b-btn
          class="mt-20 br-30"
          size="md"
          variant="primary"
          block
          @click="disqualifyParticipant()"
        >Submit</b-btn>
      </b-col>
    </b-modal>
    <!--Edit participant id modal-->
    <b-modal
      ref="edit-participant-modal"
      id="edit-participant-modal"
      hide-footer
      hide-header
      size="lg"
    >
      <div class="width-400">
        <div>
          <b>
            <p class="fs-16 pl-10 pr-10">
              Edit participant ID
              <br>
            </p>
          </b>
        </div>
        <div class="pl-10 pr-10">
          <b-col cols="8" class="p-0">
            <input
              type="text"
              class="form-control"
              v-model="userDefinedParticipantId"
              placeholder="Enter new participant ID"
            >
          </b-col>
        </div>
        <b-col cols="12" class="pb-10 pt-40 text-center">
          <b-btn
            class="mt-20 mr-10 br-3 cancel-btn"
            size="md"
            variant="primary"
            @click="cancelEdit()"
          >Cancel</b-btn>
          <b-btn class="mt-20 br-3 save-btn" size="md" variant="primary" @click="updateID()">Save</b-btn>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import findIndex from 'lodash/findIndex';
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';
import { PI, CRA, DM, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH, SITEDATALOCK } from '@/constants/authRoles';
import swal from 'sweetalert2';

export default {
  name: "participant-info",
  props: {
    participantDetails: {
      type: Object,
      default: () => {}
    },
    surveyLocalResponseDate: {
      type: String,
      default: () => ''
    },
    surveyLocalResponseOffset: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      customLabelsList: [],
      customLabels: [],
      visitDetails: {
        visitId: ""
      },
      teleHealthConfigured: false,
      studyData: {},
      disqualifyReasons: [
        {
          value: false,
          text:
            "Participant is not adhering to the protocol-required remote data collection"
        },
        {
          value: false,
          text:
            "Participant is not attending the protocol-required teleHealth visits"
        },
        {
          value: false,
          text:
            "Participant is moving and can no longer participate in the study"
        },
        { value: false, text: "Other", otherOptValue: "" }
      ],
      toggleFeatures: [],
      telehealthEnabled: false,
      userDefinedParticipantId: "",
      isTelehealthV2Enabled: false,
      isCallBtnDisabled: false
    };
  },
  watch: {
    getVideoCallStatus(isCallInProgress) {
      this.isCallBtnDisabled = isCallInProgress;
    }
  },
  computed: {
    ...mapGetters(["token", "user", "getVideoCallStatus"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPiAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canScAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check("userAccess");
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  methods: {
    getLabel(item) {
      const index = findIndex(this.customLabelsList, ["key", item]);
      return this.customLabelsList[index].value;
    },
    getCustomLabels() {
      this.$api.getLabelsFact(this.studyId).then(
        response => {
          this.customLabelsList = sortBy(response.body, "keyReference");
          this.customLabels = this.customLabelsList.map(q => q.key);
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while adding label."
          );
        }
      );
    },
    openEditModal() {
      this.userDefinedParticipantId = this.participantDetails.userDefinedParticipantId;
      window.$("#edit-participant-modal").modal("show");
    },
    cancelEdit() {
      window.$("#edit-participant-modal").modal("hide");
    },
    /**
     * Update the user defined participant id
     */
    updateID() {
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        data: {
          userDefinedParticipantId: this.userDefinedParticipantId.trim()
        }
      };
      this.$api.updateParticipantIdFact(dataObj).then(
        response => {
          this.participantDetails.userDefinedParticipantId =
            response.body.userDefinedParticipantId;
          this.$forceUpdate();
          this.$toastr.success("Participant ID updated successfully.");
          window.$("#edit-participant-modal").modal("hide");
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while updating the participant id."
          );
        }
      );
    },

    startAnEncounter() {
      const dataObj = {
        startTime: new Date().getTime() / 1000,
        studyId: this.studyId
      };
      this.$api.appointmentFact(this.participantId, dataObj).then(
        response => {
          this.visitDetails = response.body;
          this.$toastr.success("Manual encounter initiated");
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting encounter status."
          );
        }
      );
    },
    endAnEncounter() {
      const dataObj = {
        studyId: this.studyId,
        visitId: this.visitDetails.visitId
      };
      this.$api.cancelAppointmentFact(this.participantId, dataObj).then(
        response => {
          if (response.body.warning) {
            this.$toastr.warning(response.body.warning);
          } else {
            this.$toastr.success(response.body.message);
          }
          this.visitDetails = {};
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting encounter status."
          );
        }
      );
    },
    disqualifyParticipant() {
      const dataObj = {
        studyId: this.studyId,
        status: "DISQUALIFIED",
        disqualifyReason: "",
        email: this.participantDetails.email,
        id: this.participantId,
        siteId: this.participantDetails.siteId
      };
      if (
        this.disqualifyReasons.filter(reason => reason.value !== true)
          .length === 4
      ) {
        this.$toastr.error(
          "Please select a reason for disqualifying the participant."
        );
      } else {
        this.disqualifyReasons.forEach(reason => {
          if (reason.value === true) {
            if (reason.text === "Other") {
              dataObj.disqualifyReason += `${reason.otherOptValue},`;
            } else {
              dataObj.disqualifyReason += `${reason.text},`;
            }
          }
        });
        dataObj.disqualifyReason = dataObj.disqualifyReason.slice(0, -1);
        this.$api
          .disqualifyFact(this.participantId, this.studyId, dataObj)
          .then(
            response => {
              if (response.body.warning) {
                this.$toastr.warning(response.body.warning);
              } else {
                this.$refs.disqualifyModal.hide();
                this.$toastr.success(
                  response.body.message ||
                    "Participant disqualified successfully."
                );
                this.$router.push({
                  name: "study-participants-list",
                  params: { studyId: this.studyId }
                });
              }
              this.visitDetails = {};
            },
            error => {
              this.$toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while disqualifying participant."
              );
            }
          );
      }
    },
    getAppointmentDetails() {
      this.$api.getAppointmentDetailsFact(this.participantId).then(
        response => {
          this.visitDetails = response.body;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting encounter status."
          );
        }
      );
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          if (response.body) {
            this.studyData = response.body;
            this.teleHealthConfigured = response.body.truClinicIntegration;
            this.getToggledFeatures();
            if (this.teleHealthConfigured && this.canPiAccess) {
              this.getAppointmentDetails();
            }
          }
        },
        error => {
          const err =
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details";
          this.$toastr.error(err);
        }
      );
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          if (response.body) {
            this.toggleFeatures = response.body.studyFeatures;
            this.toggleFeatures.forEach(feature => {
              if (feature.featureKey === "TruClinic") {
                this.telehealthEnabled = feature.enabled;
              } else if (feature.featureKey === "TELEHEALTH") {
                this.isTelehealthV2Enabled = feature.enabled;
              }
            });
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting trueclinic features."
          );
        }
      );
    },
    canInitiateTelehealthCall() {
      //Call cannot be initiated for these statuses
      let statusArray = ["INVITED", "NOTINVITED", "REGISTERED", "DISQUALIFIED", "WITHDRAWSTUDY"]
      if(statusArray.includes(this.participantDetails.status)){
        return false;
      }
      
      if (
        this.studyData.telehealthIntegration &&
        this.isTelehealthV2Enabled &&
        (this.canPiAccess || this.canSubPiAccess || this.canScAccess || this.canHomeHealthAccess) &&
        this.user.countries && _.chain(this.user.countries).filter({'isTelehealthEnabled': true, 'country_id': this.participantDetails.countryId}).size().value()>0
      ) {
        return true;
      }

      return false;
    },
    InitateVideoCall() {
      this.isCallBtnDisabled = true;
      //Emit an event to show/start the video call component
      this.$root.$emit("videoCallingInitiated", {
        participantId: this.participantDetails.id,
        studyId: this.studyId,
        deviceRegistrationStatus: this.participantDetails.deviceRegistrationStatus
      });
    },
    disableCallBtn() {
      return this.getVideoCallStatus || this.isCallBtnDisabled ? true : false;
    },
    withDrawParticipant() {
      const dataObj = {
        studyId: this.studyId,
        status: "WITHDRAWSTUDY",
        id: this.participantId,
        siteId: this.participantDetails.siteId
      };    
      swal({
        title: "Are you sure you want to withdraw this participant? This action cannot be undone.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4c8ce4",
        cancelButtonColor: "#4c8ce4",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api
          .disqualifyFact(this.participantId, this.studyId, dataObj)
          .then(
            response => {
              if (response.body.warning) {
                this.$toastr.warning(response.body.warning);
              } else {                
                this.$toastr.success(
                  response.body.message ||
                    "Participant withdrawal successful."
                );
                this.$router.push({
                  name: "study-participants-list",
                  params: { studyId: this.studyId }
                });
              }
              this.visitDetails = {};
            },
            error => {
              this.$toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while WithDrawing participant."
              );
            }
          );          
        }
      });        
    }
  },
  mounted() {
    this.getStudyDetails();
    this.getCustomLabels();
    //Look for the end call event
    this.$root.$on("videoCallEnded", () => {
      this.isCallBtnDisabled = false;
    });
  }
};
</script>

<style scoped lang="scss">
dt {
  font-size: 10px;
  line-height: 1.6;
  text-transform: uppercase;
  color: #adaeb1;
}
.edit-id {
  font-size: 12px;
  line-height: 1.6;
  color: #4c8ce4;
  padding-left: 10px;
  text-transform: none;
  cursor: pointer;
  font-weight: normal;
}
dd {
  font-size: 14px;
  font-weight: 500;
  color: #666669;
  word-break: break-all;
}

.btn-outline-primary,
.btn-outline-primary:not(:disabled):not(.disabled):active {
  color: #4c8ce4;
  background-color: #ffffff;
  background-image: none;
  border: solid 1px #d3dfe4;
}

.encounter_btn {
  padding-left: 6px;
  padding-right: 6px;
  width: 100%;
}

.width-400 {
  width: 400px !important;
  min-width: 400px !important;
}

.cancel-btn {
  color: #fff !important;
  background-color: #4a4a4a !important;
  border-color: #4a4a4a !important;
  width: 100px !important;
}

.save-btn {
  color: #fff !important;
  background-color: #1e8fe1 !important;
  border-color: #1e8fe1 !important;
  width: 100px !important;
}
.new-video-call-btn {
  font-size: 12px;
  padding: 0.375rem 0.5rem;
  text-transform: uppercase;
}

.new-video-call-btn.btn-outline-primary:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
</style>
