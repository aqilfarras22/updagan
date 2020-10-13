<template>
  <div v-if="participantDetails" class="pii-non-pii-wrapper">
    <div class="row">
      <div class="col-md-2 status-width">
        <div class="page header-key">Status</div>
        <div v-if="participantDetails.status" class="value">{{participantStatus}}</div>
      </div>
      <div class="col-md-2 max-width-20">
        <div class="page header-key">Participant ID <span class="pencil-icon" v-if="canEditParticipantId() && isDataLoadingFinish" @click="openEditModal()"><i class="fa fa-pencil" aria-hidden="true"></i></span></div>
        <div v-if="participantDetails.userDefinedParticipantId" class="value">{{truncateUserDefinedParticipantId()}}</div>
      </div>
      <div class="col-md-4 custom-threadid-width p-0">
        <div class="page header-key">THREAD ID</div>
        <div v-if="participantDetails.id" class="value">{{participantDetails.id}}</div>
      </div>
      <div class="col-md-2 name-width p-0" v-if="participantDetails.firstName != undefined">
        <div class="page header-key">First Name</div>
        <div v-if="isSiteTeamMember() && participantDetails.firstName" class="value">{{participantDetails.firstName}}</div>
      </div>
      <div class="col-md-2 name-width p-0" v-if="participantDetails.lastName != undefined">
        <div class="page header-key">Last Name</div>
        <div v-if="isSiteTeamMember() && participantDetails.lastName" class="value">{{participantDetails.lastName}}</div>
      </div>
      <div class="col-md-1">
        <div class="page header-key">Site ID</div>
        <div v-if="participantDetails.userSiteId" class="value">{{participantDetails.userSiteId}}</div>
      </div>
      <div class="col-md-2 gender-width" v-if="participantDetails.gender != undefined">
        <div class="page header-key">Gender</div>
        <div v-if="isSiteTeamMember() && participantDetails.gender" class="value truncate">{{participantDetails.gender}}</div>
      </div>
      <div class="col-md-2 p-0 custom-dob-width" v-if="participantDetails.ageRange != undefined || participantDetails.dob != undefined">
        <div v-if="participantDetails.ageRange != undefined" class="header-key page">Age range</div>
        <div v-if="participantDetails.dob != undefined" class="header-key page">DOB</div>
        <div v-if="isSiteTeamMember() && participantDetails.dob" class="value">{{new Date(participantDetails.dob) | dob}}</div>
        <div v-if="isSiteTeamMember() && participantDetails.ageRange" class="value">{{participantDetails.ageRange}}</div>
      </div>
    </div>
    <div class="toggle-wrapper">
      <div
        v-if="!isExpand"
        @click="expandSection()"
        :class="isExpand ? null : 'collapsed'"
        :aria-expanded="isExpand"
        v-b-toggle.collapse-piiandnon-pii variant="primary"
        class="toggle-text pt-5">Expand<span></span>
      </div>
    </div>
    <b-collapse v-model="isExpand" id="collapse-piiandnon-pii" class="mt-2">
      <b-card>
        <div class="seperator"></div>
        <div class="row pb-20 pt-15" v-if="!isFirstRowCanBeAcessiable">
          <div class="col-md-2 field-padding-left max-width-24">
            <div class="header-key page">Email</div>
            <div v-if="isSiteTeamMember() && participantDetails.email" class="value">{{participantDetails.email}}</div>
          </div>
          <div class="col-md-3 max-width-16" v-if="participantDetails.parentOrCgFirstName != undefined">
            <div class="header-key page">Parent/Caregiver First Name</div>
            <div v-if="isSiteTeamMember() && participantDetails.parentOrCgFirstName" class="value">{{participantDetails.parentOrCgFirstName}}</div>
          </div>
          <div class="col-md-3 max-width-16" v-if="participantDetails.parentOrCgLastName != undefined">
            <div class="header-key page">Parent/Caregiver Last Name</div>
            <div v-if="isSiteTeamMember() && participantDetails.parentOrCgLastName" class="value">{{participantDetails.parentOrCgLastName}}</div>
          </div>
          <div class="col-md-2 max-width-12" v-if="participantDetails.participantLanguage && participantDetails.participantLanguage.display_name != undefined">
            <div class="header-key page">Language</div>
            <div v-if="participantDetails.participantLanguage && participantDetails.participantLanguage.display_name" class="value">{{participantDetails.participantLanguage.display_name}}</div>
          </div>
          <div class="col-md-2 max-width-14" v-if="participantDetails.countryName != undefined">
            <div class="header-key page">Site Country</div>
            <div v-if="participantDetails.countryName" class="value">{{participantDetails.countryName}}</div>
          </div>
          <div class="col-md-2">
            <div class="heading page header-key truncate">Device Usage</div>
            <div class="device-usage inline-ele" v-if="participantDetails.participantUsedDevices" v-for="devices in participantDetails.participantUsedDevices">
              <span v-if="devices.deviceName && devices.deviceName.toLowerCase() == 'android'" aria-hidden="true" class="img-wrapper">
                <img title="android" v-if="!devices.lastUsedDevice" src="static/img/android_grey.png"/>
                <img title="android" v-if="devices.lastUsedDevice" src="static/img/android_black.png"/>
              </span>
              <span v-if="devices.deviceName && devices.deviceName.toLowerCase() == 'ios'" aria-hidden="true" class="img-wrapper">
                <img title="ios" v-if="!devices.lastUsedDevice" src="static/img/apple_grey.png"/>
                <img title="ios" v-if="devices.lastUsedDevice" src="static/img/apple_black.png"/>
              </span>
              <span v-if="devices.deviceName && devices.deviceName.toLowerCase() == 'iwatch'" aria-hidden="true" class="img-wrapper">
                <img title="iwatch" v-if="!devices.lastUsedDevice" src="static/img/watch_grey.png"/>
                <img  title="iwatch" v-if="devices.lastUsedDevice" src="static/img/watch-black.png"/>
              </span>
            </div>
          </div>
        </div>
        <div class="row pb-20" v-if="!isSecondRowCanBeAcessiable">
          <div class="col-md-2 field-padding-left max-width-24" v-if="participantDetails.address != undefined">
            <div class="header-key page">Address</div>
            <div v-if="isSiteTeamMember() && participantDetails.address" class="value">{{participantDetails.address}}</div>
          </div>
          <div class="col-md-3 max-width-16" v-if="participantDetails.city != undefined">
            <div class="header-key page">City</div>
            <div v-if="isSiteTeamMember() && participantDetails.city" class="value">{{participantDetails.city}}</div>
          </div>
          <div class="col-md-3 max-width-16" v-if="participantDetails.state != undefined">
            <div class="header-key page">State/Province</div>
            <div v-if="isSiteTeamMember() && participantDetails.state" class="value">{{participantDetails.state}}</div>
          </div>
          <div class="col-md-2 max-width-12" v-if="participantDetails.country != undefined">
            <div class="header-key page">Address Country</div>
            <div v-if="isSiteTeamMember() && participantDetails.country" class="value">{{participantDetails.country}}</div>
          </div>
          <div class="col-md-2" v-if="participantDetails.zipcode != undefined">
            <div class="header-key page">Zip/Postal code</div>
            <div v-if="isSiteTeamMember() && participantDetails.zipcode" class="value">{{participantDetails.zipcode}}</div>
          </div>
        </div>
        <div class="row pb-20" v-if="!isThirdRowCanBeAcessiable">
          <div class="col-md-2 field-padding-left max-width-24" v-if="participantDetails.phoneNumber != undefined">
            <div class="header-key page">Phone</div>
            <div v-if="isSiteTeamMember() && participantDetails.phoneNumber" class="value">{{formatPhoneNumber(participantDetails.phoneNumber)}}</div>
          </div>
          <div class="col-md-3 max-width-16" v-if="participantDetails.nonMobilePhoneNumber != undefined">
            <div class="header-key page">Non-mobile phone</div>
            <div v-if="isSiteTeamMember() && participantDetails.nonMobilePhoneNumber" class="value">{{formatPhoneNumber(participantDetails.nonMobilePhoneNumber)}}</div>
          </div>
          <div class="col-md-4" v-if="participantDetails.source != undefined">
            <div class="header-key page">Source</div>
            <div v-if="participantDetails.source" class="value">{{participantSourcesText[participantDetails.source]}}</div>
          </div>
          <div class="col-md-5" v-if="participantDetails.howDidYouHear != undefined">
            <div class="header-key page">How did you hear about us?</div>
            <div v-if="isSiteTeamMember() && participantDetails.howDidYouHear" class="value">{{participantDetails.howDidYouHear}}</div>
          </div>
        </div>
        <div class="seperator mb-20"></div>
        <button class="btn btn-default btn-md action-btn ml-18" :disabled="participantDetails.status === 'WITHDRAWSTUDY'" @click="withDrawParticipant()" v-if="((participantDetails.status === 'ACTIVE' || participantDetails.status === 'VERIFIED') && (canPiAccess || canSubPIAccess || canScAccess))">Withdraw Participant</button>
        <button class="btn btn-default btn-md action-btn ml-18" v-b-modal.disqualifyModal v-if="canAccessDisqulifyBtn() && isSiteTeamMember() && !canSiteDataLockAccess">Disqualify Participant</button>
        <div class="toggle-wrapper">
          <div v-if="isExpand" @click="isExpand=!isExpand" v-b-toggle.collapse-piiandnon-pii variant="primary" class="toggle-text colls">Collapse<span class="collapsed"></span></div>
        </div>
      </b-card>
    </b-collapse>
    <!-- Modal Component -->
    <b-modal ref="disqualifyModal" id="disqualifyModal" hide-footer hide-header size="lg">
      <b>
        <p class="fs-16 pl-10 pr-10">
          Disqualify participant:
          <br>
          {{participantDetails.id}}?
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
    <b-modal ref="edit-participant-modal" id="edit-participant-modal" hide-footer hide-header body-class="modal-body-custom">
      <div>
        <div><b><p class="fs-16 pl-10 pr-10">Edit participant ID<br></p></b></div>
        <div class="pl-10 pr-10">
          <b-col cols="8" class="p-0">
            <input type="text" class="form-control" v-model="userDefinedParticipantId" placeholder="Enter new participant ID">
          </b-col>
        </div>
        <b-col cols="12" class="pb-10 pt-40 text-center">
          <b-btn class="mt-20 mr-10 br-3 cancel-btn" size="md" variant="primary" @click="cancelEdit()" >Cancel</b-btn>
          <b-btn class="mt-20 br-3 save-btn" size="md" variant="primary" @click="updateParticipantID()">Save</b-btn>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { AclRule } from "vue-acl";
import { mapGetters } from "vuex";
import {
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  CRA,
  DM,
  HOME_HEALTH,
  QUALITY,
  SYSTEM_ADMIN,
  participantStatusesText,
  participantStatuses,
  participantSourcesText,
  SITEDATALOCK
} from "@/constants/authRoles";
import swal from 'sweetalert2';

export default {
  name: 'PiiAndNonPiiInfo',
  props: {
    participantDetails: {
      type: Object
    }
  },
  data() {
    return {
      isExpand: false,
      studyId: this.$route.params.studyId,
      disqualifyReasons: [
        { value: false, text: "Participant is not adhering to the protocol-required remote data collection"},
        { value: false, text: "Participant is not attending the protocol-required teleHealth visits"},
        { value: false, text: "Participant is moving and can no longer participate in the study"},
        { value: false, text: "Other", otherOptValue: "" }
      ],
      userDefinedParticipantId: this.participantDetails.userDefinedParticipantId,
      isDataLoadingFinish: false,
      participantStatusesText,
      participantStatuses,
      participantSourcesText,
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    participantStatus() {
      if(this.participantDetails && this.participantDetails.status == undefined) {
        return
      }
      return this.participantStatusesText[this.participantDetails.status];
    },
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check('userAccess');
    },
    canScAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    isThirdRowCanBeAcessiable() {
      return this.participantDetails.phoneNumber == undefined &&
        this.participantDetails.nonMobilePhoneNumber == undefined &&
        this.participantDetails.source === undefined &&
        this.participantDetails.howDidYouHear == undefined;
    },
    isFirstRowCanBeAcessiable() {
      return this.participantDetails.email == undefined &&
        this.participantDetails.parentOrCgFirstName == undefined &&
        this.participantDetails.parentOrCgLastName == undefined &&
        this.participantDetails.participantLanguage && this.participantDetails.participantLanguage.display_name == undefined &&
        this.participantDetails.countryName == undefined &&
        this.participantDetails.participantUsedDevices == undefined;
    },
    isSecondRowCanBeAcessiable() {
      return this.participantDetails.address == undefined &&
        this.participantDetails.city == undefined &&
        this.participantDetails.state == undefined &&
        this.participantDetails.country == undefined &&
        this.participantDetails.zipcode == undefined;
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  watch: {
    isExpand(v){
      this.$emit("expanded", v)
    },
    participantDetails: {
      handler(val) {
        this.isExpand = false;
        this.isDataLoadingFinish = true;
      }
    }
  },
  methods: {
    expandSection() {
      this.isExpand= !this.isExpand;
    },
    canAccessDisqulifyBtn() {
      return this.participantDetails.status === 'ACTIVE' ||
        this.participantDetails.status === 'VERIFIED' ||
        this.participantDetails.status === 'INVITED' ||
        this.participantDetails.status === 'NOTINVITED';
    },
    disqualifyParticipant() {
      const dataObj = {
        studyId: this.studyId,
        status: "DISQUALIFIED",
        disqualifyReason: "",
        email: this.participantDetails && this.participantDetails.email ? this.participantDetails.email : null,
        id: this.participantDetails && this.participantDetails.id,
        siteId: this.participantDetails.siteId
      };
      if(this.disqualifyReasons.filter(reason => reason.value !== true).length === 4) {
        this.$toastr.error("Please select a reason for disqualifying the participant.");
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
        this.$api.disqualifyFact(dataObj.id, this.studyId, dataObj).then(
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
            this.$toastr.error( error.body && error.body.message ? error.body.message : "Error while disqualifying participant.");
          }
        );
      }
    },
    openEditModal() {
      this.userDefinedParticipantId = this.participantDetails.userDefinedParticipantId;
      window.$("#edit-participant-modal").modal("show");
    },
    cancelEdit() {
      window.$("#edit-participant-modal").modal("hide");
    },
    updateParticipantID() {
      if(!this.userDefinedParticipantId || ( this.userDefinedParticipantId &&this.userDefinedParticipantId.trim() == "")) {
        return;
      }
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantDetails.id,
        data: {userDefinedParticipantId: this.userDefinedParticipantId.trim()}
      };
      this.$api.updateParticipantIdFact(dataObj).then(
        response => {
          this.participantDetails.userDefinedParticipantId = response.body.userDefinedParticipantId;
          this.$root.$emit("updateUserDefinedPaticipantId", {userDefinedParticipantId: response.body.userDefinedParticipantId, participantId: this.participantDetails.id});
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
    isSiteTeamMember() {
      return this.canHomeHealthAccess || this.canPiAccess || this.canStudyCoordinatorAccess || this.canSubPIAccess || this.canSiteDataLockAccess;
    },
    canEditParticipantId() {
      return (this.canPiAccess || this.canSubPIAccess || this.canStudyCoordinatorAccess || this.canHomeHealthAccess) &&
        (this.participantDetails.status == 'NOTINVITED' ||
          ((this.participantDetails.userDefinedParticipantId && this.participantDetails.userDefinedParticipantId.trim() == '') ||
          !this.participantDetails.userDefinedParticipantId ));
    },
    formatPhoneNumber(phoneNumberString) {
      let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
      return null
    },
    truncateUserDefinedParticipantId() {
      let pId = this.participantDetails.userDefinedParticipantId;
      if(pId && pId.trim()) {
        if(pId.length > 24) {
          pId = pId.substring(0, 15) + "..." + pId.substring(pId.length-4, pId.length);
        }
      }
      return pId;
    },
    withDrawParticipant() {
      const dataObj = {
        studyId: this.studyId,
        status: "WITHDRAWSTUDY",
        id: this.participantDetails && this.participantDetails.id,
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
          this.$api.disqualifyFact(dataObj.id, this.studyId, dataObj).then(
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
  },
};
</script>

<style lang="scss" scoped>
  .pii-non-pii-wrapper {
    height: 85px;
    background-color: #f9f9fb;
    padding-top: 10px;
    box-shadow: 0 3px 2px 0 rgba(0,0,0,.06);
    .toggle-wrapper {
      width: 100%;
    }
    .toggle-text {
      text-align: center;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      width: 80px;
      margin: 0 auto;
      height: 40px;
      &.colls {
        width: 80px;
      }
      span {
        background-image: url(/static/img/arrow-down-blue.png) !important;
        height: 20px;
        display: inline-block;
        background-repeat: no-repeat;
        width: 20px;
        vertical-align: text-bottom;
        background-position-y: 1px;
        background-position-x: 1px;
      }
      .collapsed {
        vertical-align: top;
        transform: rotate(180deg);
        background-position-y: -1px;
        background-position-x: -1px;
      }
    }
    .card {
      background: #f9f9fb;
      border-top: none;
      border-left: none;
      border-right: none;
      .card-body {
        padding: 20px 3px 15px 3px;
      }
    }
    .seperator {
      width: 97%;
      border: 0.5px solid #e4e8eb;
      margin: 0 auto;
    }
    .action-btn {
      border: solid 0.5px #e4e8eb;
      background-color: #ffffff;
      color: #4c8ce4;
      transition-duration: 0.6s;
      height: 35px;
      font-size: 14px;
    }
    #collapse-piiandnon-pii {
      position: relative;
      z-index: 10;
    }
    .custom-threadid-width {
      max-width: 27%;
    }
    .status-width {
      max-width: 9.5%;
      padding-left: 20px;
    }
    .name-width {
      max-width: 9%;
    }
    .gender-width {
      max-width: 9%;
    }
    .custom-dob-width {
      max-width: 10%;
    }
    .max-width-24 {
      max-width: 24%;
      min-width: 19%;
    }
    .max-width-16 {
      max-width: 16%;
    }
    .max-width-20 {
      max-width: 20%;
      min-width: 18%;
    }
    .max-width-14 {
      max-width: 14%;
    }
    .max-width-12 {
      max-width: 12%;
    }
    .device-usage {
      .img-wrapper {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-right: 5px;
        img {
          width: 100%;
        }
      }
    }
    .page {
      color: #A8A8A8;
    }
    .value {
      color: #525252;
      font-size: 15px;
    }
    .header-key {
      font-size: 12px;
    }
  }
  .pencil-icon {
    cursor: pointer;
  }
  .truncate {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .field-padding-left {
    padding-left: 17px;
  }
  * {
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
  }
  // when telehalth call started
  .telehealth-call {
    .pii-non-pii-wrapper {
      .header-key {
        font-size: 10px;
      }
      .value {
        font-size: 10px;
      }
      .toggle-text {
        font-size: 11px;
      }
      .action-btn {
        font-size: 11px;
      }
    }
  }
</style>
