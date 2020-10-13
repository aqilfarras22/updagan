<template>
  <div class="client_bg">
    <div class="client_bg">
      <mainHeader></mainHeader>
      <div class="container">
        <div class="row has-header">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pt-20">
            <span v-on:click="goToClientList" class="color_ff cursor_pointer"> <i class="fa fa-angle-left fs-18" aria-hidden="true"></i> All contacts</span>
            <button type="button" class="btn btn-md edit-profile-btn pull-right" v-if="editable" v-on:click="goToEditProfile"> Edit profile</button>
          </div>
        </div>
        <div class="row p-15">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 card-container">
            <div class="team-card">
              <div class="row">
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Name</p>
                  <p><span class="inner-card-name" v-if="!editable">First Name:</span>
                    <input type="text" v-validate="'required'" name="firstName" v-if="!editable" v-model="clientMember.firstName" class=" first-name-value"
                      :class="{'input': true, 'is-danger': errors.has('firstName'), 'is-success': !errors.has('firstName') }"
                      placeholder="Enter first name"></p>
                  <span v-show="errors.has('firstName')" class="error-style">first name is required field</span>
                  <p><span class="inner-card-name" v-if="!editable">Last Name:</span>
                    <input type="text" v-validate="'required'" name="lastName" v-if="!editable" v-model="clientMember.lastName" class=" first-name-value"
                      :class="{'input': true, 'is-danger': errors.has('lastName'), 'is-success': !errors.has('lastName') }"
                      placeholder="Enter last name"></p>
                  <span v-show="errors.has('lastName')" class="error-style">last name is required field</span>
                  <input type="text" v-if="editable" v-model="clientMember.firstName" class="form-control inner-card-value" placeholder=""
                    :disabled="editable">
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Email</p>
                  <input type="email" v-validate="'required|email'" name="username" :class="{'input': true, 'is-danger': errors.has('username'), 'is-success': !errors.has('username') }"
                    class="form-control inner-card-value" v-model="clientMember.username" placeholder="Enter email" required
                    :disabled="editable">
                  <span v-show="errors.has('username')" class="error-style">{{ errors.first('username') }}</span>
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Contact type <i class="fa fa-question-circle help_icon" aria-hidden="true" data-toggle="popover" tabindex="0"
                data-trigger="focus" data-content=" 1.Billing <br> 2.Technical <br> 3.Administrative " data-html="true"></i></p>
                  <select name="contactType" v-validate="'required'" v-model="clientMember.contactType" class="form-control input-md inner-card-value select-font"
                    placeholder="Billing" :disabled="editable" :class="{'input': true, 'is-danger': errors.has('contactType'), 'is-success': !errors.has('contactType') }">
                <option v-for="(contactType, index) in contactTypes" :key="index" v-bind:value="contactType.value">{{ contactType.name }}</option>
                </select>
                  <span v-show="errors.has('contactType')" class="error-style">contact Type is mandatory</span>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Mobile Number</p>
                  <input type="text" name="phoneNumber" v-on:keyup="validMobileNumber(clientMember.phoneNumber)" :class="{'input': true, 'is-danger': errors.has('phoneNumber'), 'is-success': !errors.has('phoneNumber') }"
                    class="form-control inner-card-value" v-model="clientMember.phoneNumber" placeholder="Enter mobile number"
                    :disabled="editable">
                  <span v-if="validMobile" class="error-style">Mobile number is invalid</span>
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Work Number</p>
                  <input type="text" v-on:keyup="validWorkNumber(clientMember.workNumber)" name="workNumber" class="form-control inner-card-value"
                    v-model="clientMember.workNumber" placeholder="Enter work number" :disabled="editable">
                  <span v-if="validWork" class="error-style">Work number is invalid</span>
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Status</p>
                  <select name="status" v-model="clientMember.status" class="form-control input-md inner-card-value width60 float-left select-font"
                    placeholder="Active" :disabled="editable">
                <option value="Active">Active</option>
                <option value="Pending" v-if="clientMember.status!=='Inactive'">Pending</option>
                <option value="Inactive">Inactive</option>
                </select>
                  <button type="button" class="btn btn-md resend-invite" v-if="clientMember.status=='Pending'" v-on:click="sendInvite(clientMemberId,clientMember)"> Resend invite</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-8 col-sm-8 card-height">
                  <p class="inner-card">Associated studies</p>
                  <span v-for="(study, index) in clientMember.studies" :key="index">{{study.name}},</span>
                  <select name="study" v-if="allStudies" v-model="selectedStudy" class="form-control input-md inner-card-value select-font mb-20"
                    placeholder="Study managing" v-on:change="studySelected(selectedStudy)" :disabled="editable">
                <option disabled value="Study admin">Study admin</option>
                <option v-for="(study, index) in allStudies" :key="index" v-bind:value="study">{{ study.name }}</option>
                </select>
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Role <i class="fa fa-question-circle help_icon" aria-hidden="true" data-toggle="popover" tabindex="0"
                data-trigger="focus" data-content=" 1.Platform Admin <br> 2.Study admin <br> 3.Sponsor " data-html="true"></i></p>
                  <select name="userRole" v-validate="'required'" v-model="clientMember.userRole" class="form-control input-md inner-card-value select-font"
                    placeholder="Study admin" :disabled="editable" :class="{'input': true, 'is-danger': errors.has('userRole'), 'is-success': !errors.has('userRole') }">
                <option v-for="(userRole, index) in userRoles" v-bind:value="userRole.value" :key="index">{{ userRole.name }}</option>
                </select>
                  <span v-show="errors.has('userRole')" class="error-style">user role is mandatory</span>
                </div>
                <div class="text-center mb-20">
                  <button type="button" class="btn btn-md cancel-btn" v-if="!editable" v-on:click="goToClientList"> Cancel</button>
                  <button type="button" class="btn btn-md save-btn" v-if="!editable" v-on:click="saveClientMemberInfo(clientMember)"> Save </button>
                </div>
                <span class="reset-password" data-toggle="modal" data-target="#reset-password-modal">Reset password</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row bottom_footer">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <p class="text-center foot-style-text">Questions or need help ?</p>
            <Copyright/>
          </div>
        </div>
      </div>
      <div id="reset-password-modal" class="modal fade modal-position" role="dialog">
        <div class="modal-dialog">

          <!-- Modal content-->
          <div class="modal-content">
            <p class="maroon_color modal-text">Password reset</p>
            <div class="modal-body modal-style">
              <p class="modal-instruction">Are you sure you want to reset the <strong>{{clientMember.firstName}}</strong>'s password ?</p>
              <p class="modal-instruction">A password reset link will be sent to {{clientMember.firstName}} 's email</p>
            </div>
            <div class="form-group text-center p-15">
              <button class="btn btn-lg btn-block btn-info-blue mb-10 br-30" data-dismiss="modal" v-on:click="resetPassword(clientMemberId)">Yes</button>
              <button class="btn btn-lg btn-block btn-info-blue br-30" data-dismiss="modal" v-on:click="cancelResetPassword">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import jwt from 'jwt-decode';
import toastr from 'toastr';
import mainHeader from '../common/main-header';
import Copyright from '../common/copyright';

export default {
  name: 'add-edit-client',
  data() {
    return {
      editable: true,
      clientMemberId: null,
      allStudies: [],
      validMobile: false,
      validWork: false,
      clientMember: {
        name: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        workNumber: '',
        status: '',
        userRole: '',
        contactType: '',
        studies: [],
      },
      selectedStudy: null,
      managedStudies: '',
      userRoles: [
        { name: 'Study Admin', value: 'StudyAdmin' },
        { name: 'Platform Admin', value: 'SystemAdmin' },
        { name: 'Sponsor', value: 'Sponsor' },
      ],
      contactTypes: [
        { name: 'Billing', value: 'BillingContact' },
        { name: 'Technical', value: 'TechnicalContact' },
        { name: 'Administrative', value: 'SystemAdmin' },
      ],
    };
  },
  mounted() {
    window.$('[data-toggle="popover"]').popover();
    this.getAllStudies();
    this.clientId = this.$route.params.clientId;
    this.clientMemberId = this.$route.params.clientMemberId;
    if (this.clientMemberId !== 0) {
      this.getClientMemberDetails(this.clientId, this.clientMemberId);
    }
    if (this.clientMemberId === 0) {
      this.editable = false;
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
    validWorkNumber(workNumber) {
      const mobPattern = new RegExp('^\\+[0-9]{1,3}[0-9]{10,14}(?:x.+)?$');
      if (mobPattern.test(workNumber)) {
        this.validWork = false;
      } else {
        this.validWork = true;
      }
    },
    studySelected(study) {
      this.clientMember.studies.push(study);
      // if (this.user.studies) {
      //   this.user.studies.push(study);
      // }
    },
    getAllStudies() {
      this.$api.getAllStudiesFact().then(
        response => {
          if (response.body) {
            this.allStudies = response.body;
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while getting studies.',
          );
        },
      );
    },
    getClientMemberDetails(clientId, clientMemberId) {
      this.$api.getClientMemberDataFact(this.clientId, clientMemberId).then(
        response => {
          this.clientMember = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting user details.',
          );
        },
      );
    },
    goToClientList() {
      this.$router.push({ name: 'client-list' });
    },
    goToEditProfile() {
      this.editable = false;
    },
    saveClientMemberInfo(clientMember) {
      this.$api.updateClientMemberInfoFact(this.clientId, this.clientMemberId, clientMember).then(
        () => {
          toastr.success('client member updated succesfully');
          this.$router.push({ name: 'client-list', params: this.clientId });
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while updating users.',
          );
        },
      );
    },
    resetPassword(clientMemberId) {
      this.$api.passwordUserInfoFact(clientMemberId).then(
        () => {
          toastr.success('password link updated succesfully');
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while updating password.',
          );
        },
      );
    },
    cancelResetPassword() {},
    sendInvite(clientId, clientMemberId, clientMember) {
      this.$api.updateClientMemberInfoFact(this.clientId, this.clientMemberId, clientMember).then(
        () => {
          toastr.success('Resent invite succesfully');
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while resending invite.',
          );
        },
      );
    },
  },
  components: { mainHeader, Copyright },
};
</script>

<style scoped lang="scss">

.btn{
  font-size: 14px;
}

.form-control[disabled], fieldset[disabled] .form-control {
    cursor: not-allowed;
}

.client_bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  min-height: 100vh;
  background-color: #34537d;
  background-blend-mode: soft-light;
  height: 100%;
  background-size: cover;
   -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.maroon_color {
  color: #ff7171 !important;
}

h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
}

h3 {
  padding-bottom: 60px;
  color: black;
}

.panel-body {
  min-height: 200px;
  height: 200px;
}

.studies_list {
  max-width: 1200px;
  margin: auto;
}

.heading {
  font-size: 24px;
  font-weight: 200;
}

.header_row {
  padding-bottom: 20px;
}

.fontStyle {
  font-family: sans-serif;
  font-size: 4rem;
  margin-bottom: 50px;
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #fff;
  text-decoration: none;
  font-size: 25px;
}

.date_val {
  color: #aaa;
  font-size: 12px;
}

button {
  cursor: pointer;
}

.outline-active {
  background: none;
  border: 1px solid #01b7fe;
  color: #01b7fe;
}

.outline-inactive {
  background: none;
  border: 1px solid #8c8c8c;
  color: #8c8c8c;
}

p {
  font-size: 15px;
}

.study-card {
  background-color: #f5f8fa;
  border: none !important;
  padding: 10px 10px 10px 10px;
}

.new-card {
  background-color: #01b7fe;
  text-align: center;
  height: 200px;
  padding-top: 80px;
}

.bottom_footer {
  position: relative;
  bottom: 0px;
  width: 100%;
  padding-top: 20px;
  color: #fff;
}

.header {
  padding-top: 20px;
  padding-bottom: 10px;
}

.user-icon {
  padding-right: 10px;
  color: yellow;
}

.logout_link {
  line-height: 12px;
  font-size: 14px;
}

.team-member {
  font-size: 30px;
  line-height: 1.87;
}

.search-pad {
  padding: 6px 40px;
}

.select-style {
  background: rgba(22, 59, 78, 0.7);
  color: #fff;
}

.search-color {
  color: #333;
}

table {
  color: #4a4a4a;
}

td {
  border: none;
}

th {
  color: #959fa4;
}

.view-color {
  color: #00b1ff;
  cursor: pointer;
}

.custom-button {
  width: 160px;
  height: 40px;
  border-radius: 100px;
  background-color: #195877;
}

.custom-button:hover {
  color: #fff;
}

.card-container {
  background-color: #fff;
  padding: 10px;
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
  font-size: 20px;
  color: #4a4a4a;
  border: none;
  outline: none;
  box-shadow: none !important;
}

.card-height {
  height: 150px;
}

.edit-profile-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #f16559;
  color: #fff;
}
.edit-profile-btn:hover {
  color: #fff;
}

.full-width {
  width: 100%;
}

.reset-password {
  position: absolute;
  bottom: 5px;
  right: 5px;
  text-decoration: underline;
  color: #4a4a4a;
  cursor: pointer;
}

.save-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #51dd75;
  color: #fff;
}

.cancel-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #959fa4;
  color: #fff;
}

.resend-invite {
  width: 110px;
  height: 26px;
  border-radius: 100px;
  background-color: #f16559;
  color: #fff;
  font-size: 12px;
  line-height: 10px;
  float: right;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}

.width60 {
  width: 60%;
}

.close-style {
  padding-top: 22px !important;
  outline: none !important;
}

.modal-text {
  font-size: 26px;
  padding-top: 10px;
  padding-left: 15px;
}

.modal-instruction {
  color: #959fa4;
  padding-bottom: 10px;
}

.yes-btn {
  background-color: #1f95f2;
  margin: auto;
}

.yes-btn:hover {
  color: #fff;
}

.modal-position {
  top: 150px !important;
  right: 100px;
}

.select-font {
  font-size: 16px;
  color: #888;
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

@media (max-width: 767px) {
  .modal-position {
    top: 0 !important;
    right: 0 !important;
  }
}
</style>
