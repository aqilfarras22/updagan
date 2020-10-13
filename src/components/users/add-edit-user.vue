<template>
  <div class="users-bg">
    <mainHeader></mainHeader>
    <div class="container">
      <div class="row has-header">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pt-20">
          <span v-on:click="goToAllTeams" class="color_ff cursor_pointer"> <i class="fa fa-angle-left fs-18" aria-hidden="true"></i> All Team members</span>
          <button type="button" class="btn btn-md edit-profile-btn pull-right" v-if="showEditBtn" v-on:click="goToEditProfile"> Edit profile</button>
        </div>
      </div>
      <div class="row p-15">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 card-container">
          <div class="team-card">
            <div class="row">
              <div class="col-md-4 col-sm-4 card-height">
                <p class="inner-card">Name</p>
                <p :class="{'mb-0': errors.has('firstName')}"><span class="inner-card-name" v-if="editable || addEnable">First Name:</span>
                  <input type="text" v-validate="'required'" name="firstName" v-if="editable || addEnable" v-model="userDetails.firstName" class=" first-name-value"
                    :class="{'input': true, 'is-danger': errors.has('firstName'), 'is-success': !errors.has('firstName') }"
                    placeholder="Enter first name"></p>
                <span v-show="errors.has('firstName')" class="error-style" v-if="editable || addEnable">First name is required</span>
                <p :class="{'mb-0': errors.has('lastName')}"><span class="inner-card-name" v-if="editable || addEnable">Last Name:</span>
                  <input type="text" v-validate="'required'" name="lastName" v-if="editable || addEnable" v-model="userDetails.lastName" class=" first-name-value"
                    :class="{'input': true, 'is-danger': errors.has('lastName'), 'is-success': !errors.has('lastName') }"
                    placeholder="Enter last name"></p>
                <span v-show="errors.has('lastName')" class="error-style" v-if="editable || addEnable">Last name is required</span>
                <input type="text" v-if="!editable && !addEnable" v-model="userDetails.firstName" class="form-control inner-card-value" placeholder=""
                  :disabled="!editable">
              </div>
              <div class="col-md-4 col-sm-4 card-height">
                <p class="inner-card">Email</p>
                <input type="email" v-validate="'required|email'" name="email" :class="{'input': true, 'is-danger': errors.has('email'), 'is-success': !errors.has('email') }"
                  class="form-control inner-card-value" v-model="userDetails.username" placeholder="Enter email" required :disabled="!addEnable">
                <span v-show="errors.has('email')" class="error-style" v-if="editable || addEnable">{{ errors.first('email') }}</span>
              </div>
              <div class="col-md-4 col-sm-4 card-height">
                <p class="inner-card">Role <i class="fa fa-question-circle help_icon" aria-hidden="true" data-toggle="popover" tabindex="0"
                data-trigger="focus" data-content=" 1.Platform Admin <br> 2.Study admin <br> 3.Clinical Research Associate <br> 4.Data Management <br> 5.Quality" data-html="true"></i></p>
                <select name="userRole" v-validate="'required'" v-model="userDetails.userRole" class="form-control input-md inner-card-value select-font"
                  placeholder="Study admin" :disabled="!editable && !addEnable" :class="{'input': true, 'is-danger': errors.has('userRole'), 'is-success': !errors.has('userRole') }">
                  <option value="SystemAdmin" v-if="canSysAdminAccess">Platform Admin</option>
                  <option v-for="role in roles" v-bind:value="role.value" :key="role.value">{{ role.name }}</option>
                </select>
                <span v-show="errors.has('userRole')" class="error-style" v-if="!editable">User role is mandatory</span>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-height">
                <p>Mobile Number</p>
                <span :class="{'input-display': !editable && !addEnable }">
                  <vue-tel-input class="p-0" @onInput="onInputUserPhone" ref="userPhoneNumber"></vue-tel-input>
                  <span v-if="userDetails.phoneNumber && userDetails.phoneNumber.length > 0  && !validMobile" class="error-style">Phone number is invalid</span>
                </span>
                <input class="inner-card-value" :disabled="!editable && !addEnable" v-model="userDetails.phoneNumber" v-if="!editable && !addEnable">
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <p>Work Number</p>
                <span :class="{'input-display': !editable && !addEnable }">
                  <vue-tel-input class="p-0" @onInput="onInputWorkNumber" ref="userWorkNumber"></vue-tel-input>
                  <span v-if="userDetails.workNumber && userDetails.workNumber.length > 0 && !validWork" class="error-style">Work number is invalid</span>
                </span>
                <input class="inner-card-value" type="text" v-if="!editable && !addEnable" :disabled="!editable && !addEnable" v-model="userDetails.workNumber">
              </div>
              <div class="col-md-4 col-sm-4 card-height">
                <p class="inner-card">Status</p>
                <select name="status" v-model="userDetails.status" class="form-control input-md inner-card-value width100 float-left select-font"
                  placeholder="Active" :disabled="addEnable || (userDetails.status==='Pending'|| userDetails.status==='Inactive') || !editable">
                <option value="Active">Active</option>
                <option value="Pending" v-if="userDetails.status!=='Active'">Pending</option>
                <option value="Inactive" v-if="userDetails.status==='Active'||userDetails.status==='Inactive'">Inactive</option>
                </select>
                <button type="button" class="btn btn-md resend-invite" v-if="userDetails.status=='Pending'" v-on:click="sendInvite(userId,userDetails)"> Resend invite</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 card-height">
                <p class="inner-card">Studies managing</p>
                <span v-for="study in userDetails.studies">{{study.name}},</span>
                <select name="userRole" v-if="allStudies" v-model="selectedStudy" class="form-control input-md inner-card-value select-font mb-20"
                  placeholder="Study managing" v-on:change="studySelected(selectedStudy)" :disabled="!editable && !addEnable">
                <option disabled value="Study admin">Study admin</option>
                <option v-for="study in allStudies" v-bind:value="study">{{ study.name }}</option>
                </select>
              </div>
              <div class="text-center mb-20" style="margin:0 auto;">
                <button type="button" class="btn btn-md cancel-btn mr-5" v-if="editable || addEnable" v-on:click="goToAllTeams"> Cancel</button>
                <button type="button" class="btn btn-md save-btn" v-if="editable || addEnable" v-on:click="saveUserInfo(userId,userDetails)"> Save </button>
              </div>
              <span class="reset-password" data-toggle="modal" data-target="#reset-password-modal">Reset password</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row bottom_footer">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <p class="text-center foot-style-text">Questions or need help ?</p>
          <Copyright />
        </div>
      </div>
    </div>
    <div id="reset-password-modal" class="modal fade modal-position" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <p class="maroon_color modal-text">Password reset</p>
          <div class="modal-body modal-style">
            <p class="modal-instruction">Are you sure you want to reset the <b>{{userDetails.firstName}}</b>'s password ?</p>
            <p class="modal-instruction">A password reset link will be sent to {{userDetails.firstName}} 's email</p>
          </div>
          <div class="form-group text-center p-15">
            <button class="btn btn-lg btn-block yes-btn btn-info-blue mb-10 br-30" data-dismiss="modal" v-on:click="resetPassword(userId)">Yes</button>
            <button class="btn btn-lg btn-block yes-btn btn-info-blue br-30" data-dismiss="modal" v-on:click="cancelResetPassword">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import jwt from 'jwt-decode';
import { SYSTEM_ADMIN } from '@/constants/authRoles';
import toastr from 'toastr';
import mainHeader from '../common/main-header';
import Copyright from '../common/copyright';
import { mapGetters } from 'vuex';
import { AclRule } from 'vue-acl';

export default {
  name: 'add-edit-user',
  data() {
    return {
      userId: null,
      editable: false,
      addEnable: false,
      showEditBtn: false,
      allStudies: [],
      validMobile: false,
      validWork: false,
      userDetails: {
        name: '',
        firstName: '',
        username: '',
        phoneNumber: '',
        workNumber: '',
        status: '',
        userRole: '',
        studies: [],
      },
      selectedStudy: null,
      managedStudies: '',
      roles: [
        { name: 'Study Admin', value: 'StudyAdmin' },
        { name: 'Clinical Research Associate', value: 'Cra' },
        { name: 'Data Management', value: 'Dm' },
        { name: 'Quality', value: 'Quality' }
      ],
    };
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
  },
  mounted() {
    window.$('[data-toggle="popover"]').popover();
    this.getAllStudies();
    this.userId = this.$route.params.userId;
    if (this.userId == '0') {
      this.addEnable = true;
      this.showEditBtn = false;
    } else {
      this.showEditBtn = true;
      this.editable = false;
      this.addEnable = false;
      this.getUserDetails(this.userId);
    }
  },
  methods: {
    onInputUserPhone({ number, isValid, country }) {
      window.console.log(country);
      this.validMobile = isValid;
      this.userDetails.phoneNumber = number.replace(/\s/g, '');
    },
    onInputWorkNumber({ number, isValid, country }) {
      window.console.log(country);
      this.validWork = isValid;
      this.userDetails.workNumber = number.replace(/\s/g, '');
    },
    studySelected(study) {
      this.userDetails.studies.push(study);
      // if (this.userDetails.studies) {
      //   this.userDetails.studies.push(study);
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
    getUserDetails(userId) {
      this.$api.getUserDataFact(userId).then(
        response => {
          this.userDetails = response.body;
          if (this.userDetails.phoneNumber) {
            this.$refs.userPhoneNumber.phone = this.userDetails.phoneNumber;
            this.validMobile = true;
          }
          if (this.userDetails.workNumber) {
            this.$refs.userWorkNumber.phone = this.userDetails.workNumber;
            this.validWork = true;
          }
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
    goToAllTeams() {
      this.$router.push({ name: 'users' });
    },
    goToEditProfile() {
      this.editable = true;
      this.showEditBtn = false;
    },
    saveUserInfo(userId, teamObj) {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.userId == '0') {
            this.$api.addNewUserInfoFact(teamObj).then(
              () => {
                toastr.success('User added succesfully');
                this.$router.push({ name: 'users' });
              },
              error => {
                toastr.error(
                  error.body && error.body.message ? error.body.message : 'Error while adding user.',
                );
              },
            );
          } else {
            this.$api.updateUserInfoFact(userId, teamObj).then(
              () => {
                toastr.success('users updated succesfully');
                this.$router.push({ name: 'users' });
              },
              error => {
                toastr.error(
                  error.body && error.body.message ? error.body.message : 'Error while updating users.',
                );
              },
            );
          }
        } else {
          toastr.error('Please fill all the required fields.');
        }
      });
    },
    resetPassword(userId) {
      this.$api.passwordUserInfoFact(userId).then(
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
    sendInvite(userId, teamObj) {
      this.$api.resendInviteFact(userId, teamObj).then(
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

.users-bg {
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

.input-display {
  display: none;
}

/deep/ .col {
  padding: 0px !important;
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
.width100 {
  width: 100px !important;
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
  background-color: #ff7171;
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
  background-color: #b8c7ce;
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
