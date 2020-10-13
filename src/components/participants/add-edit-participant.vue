<template>
  <div class="participant-bg">
    <mainHeader></mainHeader>
    <sideMenu :studyData="{}"></sideMenu>
    <div class="has-sidemenu">
      <div class="container">
        <div class="has-header">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pt-20 pb-20 pl-0 pr-0">
            <p v-if="this.participantId === 0" class="fs-30">Create a Participant</p>
            <span class="color-red" v-if="this.participantId!== 0" v-on:click="goToAllParticipants">
              <i class="fa fa-angle-left font-size18" aria-hidden="true"></i> All Participants</span>
            <button type="button" class="btn btn-md edit-profile-btn br-25 pull-right" v-if="!editable && this.participantId != 0" v-on:click="goToEditParticipantProfile">Edit profile</button>
          </div>
          <div class="row">
            <p class="invite-strip color_ff">
              <span class="">Invitation Date:</span>
              <span class="pr-20" v-if="this.participantId== 0">Not yet Invited</span>
              <span class="pr-20" v-if="this.participantId!== 0">{{new Date(participant.invitationDate) | dateFormat('MM/DD/YYYY') }}</span>
              <span class="">Join Date:</span>
              <span class="" v-if="this.participantId== 0">Not yet Joined</span>
              <span class="" v-if="this.participantId!== 0">{{new Date(participant.createdTime) | dateFormat('MM/DD/YYYY') }}</span>
            </p>
          </div>
          <div class="pt-0">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 card-container">
              <div class="team-card">
                <div class="row">
                  <div class="col-md-6 col-sm-6 card-height">
                    <p class="inner-card">Email</p>
                    <input type="email" v-validate="'required|email'" name="email" :class="{'input': true, 'is-danger': errors.has('email'), 'is-success': !errors.has('email') }" class="inner-card-value" v-model="participant.email" placeholder="Enter email" required :disabled="!addEnable && !editable || participant.status === getStatuses.INVITED || participant.status === getStatuses.ACTIVE || participant.status === getStatuses.WITHDRAWSTUDY|| participant.status === getStatuses.DISQUALIFIED || participant.status === getStatuses.WITHDRAWCONSENT || participant.status === getStatuses.VERIFIED">
                    <span v-show="errors.has('email')" class="error-style">{{ errors.first('email') }}</span>
                  </div>
                  <div class="col-md-6 col-sm-6 card-height col-md-offset-0">
                    <p class="inner-card">Status</p>
                    <select name="status" v-model="participant.status" v-bind:class="!editable && { color_green: participant.status===getStatuses.ACTIVE, 'color_red': participant.status===getStatuses.WITHDRAWSTUDY || participant.status===getStatuses.DISQUALIFIED || participant.status=== getStatuses.WITHDRAWCONSENT,'color_yellow': participant.status===getStatuses.INVITED|| participant.status=== getStatuses.VERIFIED}" class="form-control input-md inner-card-value width60 float-left select-font" placeholder="Active" :disabled="addEnable|| !editable || participant.status==getStatuses.WITHDRAWSTUDY || participant.status=== getStatuses.WITHDRAWCONSENT||participant.status===getStatuses.INVITED || participant.status=== getStatuses.VERIFIED || participant.status=== getStatuses.NOTINVITED">
                      <option :value="getStatuses.ACTIVE">{{getStatusText({status: getStatuses.ACTIVE})}}</option>
                      <option v-if="participant.status !== getStatuses.ACTIVE && participant.status!== getStatuses.DISQUALIFIED" :value="getStatuses.NOTINVITED">{{getStatusText({status: getStatuses.NOTINVITED})}}</option>
                      <option v-if="participant.status !== getStatuses.ACTIVE && participant.status!== getStatuses.DISQUALIFIED" :value="getStatuses.INVITED">{{getStatusText({status: getStatuses.INVITED})}}</option>
                      <option v-if="participant.status !== getStatuses.ACTIVE && participant.status!== getStatuses.DISQUALIFIED" :value="getStatuses.VERIFIED">{{getStatusText({status: getStatuses.VERIFIED})}}</option>
                      <option v-if="participant.status !== getStatuses.ACTIVE && participant.status!== getStatuses.DISQUALIFIED" :value="getStatuses.WITHDRAWCONSENT">{{getStatusText({status: getStatuses.WITHDRAWCONSENT})}}</option>
                      <option :value="getStatuses.DISQUALIFIED">{{getStatusText({status: getStatuses.DISQUALIFIED})}}</option>
                      <option v-if="participant.status!== getStatuses.ACTIVE && participant.status!== getStatuses.DISQUALIFIED" :value="getStatuses.WITHDRAWSTUDY">{{getStatusText({status: getStatuses.WITHDRAWSTUDY})}}</option>
                    </select>
                    <button type="button" class="btn btn-md send-invite br-30" v-if="participant.status==getStatuses.NOTINVITED || participant.status==getStatuses.INVITED" v-on:click="createUpdateParticipant(participant, true)">
                      <i class="fa fa-location-arrow" aria-hidden="true"></i> send invite</button>
                  </div>
                </div>
                <div class="row clearfix">
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Name</p>
                    <div>
                      <span class="inner-card-name" v-if="editable || addEnable">First Name:</span>
                      <input type="text" v-if="editable || addEnable" v-model="participant.firstName" class=" first-name-value" placeholder="Enter first name">
                    </div>
                    <div>
                      <span class="inner-card-name" v-if="editable || addEnable">Last Name:</span>
                      <input type="text" v-if="editable || addEnable" v-model="participant.lastName" class=" first-name-value" placeholder="Enter last name">
                    </div>
                    <input type="text" v-if="!editable && !addEnable" v-model="fullName" class="inner-card-value form-control" :placeholder="placeholder" disabled>
                  </div>
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Date of birth</p>
                    <datepicker input-class="datepicker-class form-control inner-card-value" placeholder="Enter Date" v-model="participant.dob" name="dob" :class="{'input-class': true, 'is-danger': errors.has('dob'), 'is-success': !errors.has('dob') }"></datepicker>
                  </div>
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Gender</p>
                    <select name="status" v-model="participant.gender" class="form-control input-md inner-card-value width60 float-left select-font" placeholder="Male" :disabled="!editable && !addEnable">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div class="row clearfix">
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Mobile Number</p>
                    <input type="text" name="phoneNumber" v-on:keyup="validMobileNumber(participant.phoneNumber)" :class="{'input': true, 'is-danger': errors.has('phoneNumber'), 'is-success': !errors.has('phoneNumber') }" class="inner-card-value" v-model="participant.phoneNumber" :placeholder="placeholder" :disabled="!editable && !addEnable">
                    <span v-if="validMobile && (editable || addEnable) && participant.phoneNumber" class="error-style">Phone number is invalid</span>
                  </div>
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Address</p>
                    <input type="text" v-model="participant.street" class="inner-card-value" :placeholder="placeholder" :disabled="!editable && !addEnable">
                  </div>
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">City of Province</p>
                    <input type="text" v-model="participant.city" class="inner-card-value" :placeholder="placeholder" :disabled="!editable && !addEnable">
                  </div>
                </div>
                <div class="row clearfix">
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">State</p>
                    <input type="text" v-model="participant.state" class="inner-card-value" :placeholder="placeholder" :disabled="!editable && !addEnable">
                  </div>
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Country</p>
                    <input type="text" v-model="participant.country" class="inner-card-value" :placeholder="placeholder" :disabled="!editable && !addEnable">
                  </div>
                  <div class="col-md-4 col-sm-4 card-height">
                    <p class="inner-card">Zip or postal code</p>
                    <input type="text" v-on:keyup="validZipcode(participant.zipcode)" name="zipcode" :class="{'input': true, 'is-danger': errors.has('zipcode'), 'is-success': !errors.has('zipcode') }" class="inner-card-value" v-model="participant.zipcode" :placeholder="placeholder" :disabled="!editable && !addEnable">
                    <span v-if="validZip && (editable || addEnable) && participant.zipcode" class="error-style">Zip code is invalid</span>
                  </div>
                </div>
                <div class="row buttons_section clearfix" v-if="editable || addEnable">
                  <div class="col-md-12 col-sm-12 text-center p-0 clearfix">
                    <div class="col-lg-2 col-md-3 col-sm-12 text-center" :class="{'col-lg-offset-4': (participant.id && participant.status != getStatuses.NOTINVITED) , 'col-lg-offset-3': !participant.id || (participant.id  && participant.status ==getStatuses.NOTINVITED), 'col-md-offset-3': (participant.id && participant.status != getStatuses.NOTINVITED) , 'col-md-offset-1': !participant.id || (participant.id  && participant.status == getStatuses.NOTINVITED)}">
                      <button type="button" class="btn btn-md btn-block cancel-btn br-25" v-on:click="cancelEditParticipant()"> Cancel</button>
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-12 text-center" v-if="!participant.id">
                      <button type="button" class="btn btn-md btn-block create-btn br-25 btn-info" v-on:click="createUpdateParticipant(participant, false)" :disabled="!participant.email || disableClick">Create</button>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-12 text-center" v-if="!participant.id">
                      <button type="button" class="btn btn-md btn-block save-btn br-25" v-on:click="createUpdateParticipant(participant, true)" :disabled="!participant.email || disableClick">Create and send invite</button>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-12 text-center" v-if="participant.status == getStatuses.NOTINVITED && this.participantId!== 0">
                      <button type="button" class="btn btn-md btn-block save-btn br-25" v-on:click="createUpdateParticipant(participant, true)">Update and send invite</button>
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-12 text-center" v-if="participant.id">
                      <button type="button" class="btn btn-md btn-block save-btn br-25" v-on:click="createUpdateParticipant(participant, false)">Update</button>
                    </div>
                  </div>
                  <!--<div class="text-right p-10 clearfix pb-20 reset-password " data-toggle="modal " data-target="#reset-password-modal " v-if="this.participantId!== 0">
                    Reset password
                  </div>-->
                </div>
              </div>
            </div>
          </div>
          <div class="row bottom_footer pt-40">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
              <p class="text-center font-size10 ">Questions or need help ?</p>
              <Copyright />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import cloneDeep from 'lodash/cloneDeep';
import toastr from 'toastr';
import { participantStatuses, participantStatusesText } from '@/constants/authRoles';
import mainHeader from '../common/main-header';
import sideMenu from '../common/side-menu';
import Copyright from '../common/copyright';

export default {
  name: 'ParticipantProfile',
  data() {
    return {
      editable: false,
      addEnable: false,
      validMobile: false,
      validZip: true,
      participantId: null,
      studyId: null,
      fullName: null,
      placeholder: null,
      disableClick: false,
      participant: {
        fullName: '',
        email: '',
        phoneNumber: '+1',
        gender: '',
        status: '',
        dob: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
      },
      options: [{ name: 'Study admin', value: 'Study admin' }, { name: 'Platform Admin', value: 'Platform Admin' }],
      participantStatuses,
      participantStatusesText,
    };
  },
  computed: {
    getStatuses() {
      return participantStatuses;
    },
    getStatusesText() {
      return participantStatusesText;
    },
  },
  mounted() {
    this.editable = false;
    this.participantId = this.$route.params.participantId;
    this.studyId = this.$route.params.studyId;
    this.placeholder = 'Enter here';
    if (this.participantId !== 0) {
      this.getParticipantDetails();
      this.placeholder = 'Concealed';
    }
    if (this.participantId === 0) {
      this.editable = false;
      this.addEnable = true;
    }
  },
  methods: {
    validMobileNumber(mobileNumber) {
      const mobPattern = new RegExp('^\\+[0-9]{1,3}[0-9]{10,14}(?:x.+)?$');
      if (mobPattern.test(mobileNumber)) {
        this.validMobile = false;
      } else {
        this.validMobile = true;
      }
    },
    validZipcode(zipCode) {
      const zipPattern = new RegExp('^\\d{5,10}$');
      if (zipPattern.test(zipCode)) {
        this.validZip = false;
      } else {
        this.validZip = true;
      }
    },
    goToAllParticipants() {
      this.$router.push({ name: 'study-participants-list', params: { studyId: this.studyId } });
    },
    goToEditParticipantProfile() {
      this.editable = true;
      this.placeholder = 'Enter here';
    },
    getParticipantDetails() {
      this.$api.getParticipantDataFact(this.studyId, this.participantId).then(
        response => {
          this.participant = response.body;
          if (this.participant.dob) {
            this.participant.dob = new Date(this.participant.dob);
          }
          // this might be useful
          // const firstName = response.body.firstName;
          // const lastName = response.body.lastName;
          // this.fullName = firstName.concat(' ').concat(lastName);
        },
        error => {
          toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participants.');
        },
      );
    },
    createUpdateParticipant(participantObj, invite) {
      const participantData = cloneDeep(participantObj);
      this.disableClick = true;
      participantData.sendInvite = invite;
      if (this.participantId <= 0) {
        this.$api.addNewParticipantInfoFact(this.studyId, participantData).then(
          () => {
            toastr.success('participants added succesfully');
            this.$router.push({ name: 'study-participants-list', params: { studyId: this.studyId } });
          },
          error => {
            this.disableClick = false;
            toastr.error(error.body && error.body.message ? error.body.message : 'Error while adding participants.');
          },
        );
      } else {
        const pData = {
          studyId: this.studyId,
          participantId: this.participantId,
          data: participantData,
        };
        this.$api.updateParticipantInfoFact(pData).then(
          () => {
            toastr.success('participants updated succesfully');
            this.$router.push({ name: 'study-participants-list', params: { studyId: this.studyId } });
          },
          error => {
            toastr.error(error.body && error.body.message ? error.body.message : 'Error while updating participant.');
          },
        );
      }
    },
    cancelEditParticipant() {
      this.$router.push({ name: 'study-participants-list', params: { studyId: this.studyId } });
    },
    getStatusText(participant) {
      return this.participantStatusesText[participant.status];
    },
  },
  components: { mainHeader, sideMenu, datepicker: Datepicker, Copyright },
};
</script>

<style scoped lang="scss">
.participant-bg {
  background: #f5f8fa !important;
  height: 100%;
  min-height: 100vh;
  color: #34537d;
}
.card-container {
  background-color: #fff;
  padding: 10px;
}
.color-red {
  color: #ff7171;
}

.team-card {
  color: #959fa4;
}

.inner-card {
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 5px;
  font-size: 14px;
  box-shadow: none !important;
}

.inner-card-value {
  font-size: 18px;
  color: #4a4a4a;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  width: 100%;
}

.card-height {
  height: 120px;
}
.bottom_footer {
  clear: both;
}
.edit-profile-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #ff7171;
  color: #fff;
}

.edit-profile-btn:hover {
  color: #fff;
}

.custom-button {
  background-color: #195877;
}

.custom-button:hover {
  color: #fff;
}

.reset-password {
  text-decoration: underline;
  color: #4a4a4a;
  cursor: pointer;
}
.buttons_section {
  .btn {
    height: 40px;
  }
}
.save-btn {
  background-color: #51dd75;
  color: #fff;
}

.cancel-btn {
  background-color: #b8c7ce;
  color: #fff;
}

.create-btn {
  background-color: #34537d !important;
  border: #34537d;
  color: #fff;
}

.select-font {
  font-size: 16px;
  color: #888;
}

.send-invite {
  background-color: #f16559;
  color: #fff;
}

.invite-strip {
  padding: 10px 15px 10px 15px;
  background-color: #195877;
  margin-bottom: 0px;
  clear: both;
}

.first-name-value {
  font-size: 16px !important;
  color: #4a4a4a;
  border: none;
  outline: none;
}

input,
select:disabled {
  background-color: #fff !important;
}

.form-control {
  padding: 0 !important;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}

@media (max-width: 575px) {
  .xs-none {
    display: none;
  }
  .mob-pl0 {
    padding-left: 0px;
  }
  .mob-pt15 {
    padding-top: 15px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .mob-pl0 {
    padding-left: 0px;
  }
  .mob-pt15 {
    padding-top: 15px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) {
  .align-right {
    text-align: right;
  }
}
</style>
