<template>
  <div class="client_bg">
    <div class="client_bg">
      <mainHeader></mainHeader>
      <div class="container">
        <div class="row has-header">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pt-20">
            <span class="color_ff fs-28"> New Novarties Contact</span>
          </div>
        </div>
        <div class="row p-15">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 card-container">
            <div class="team-card">
              <div class="row" v-for="(sponserMember,index) in sponserMembers">
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Name</p>
                  <p><span class="inner-card-name">First Name:</span>
                    <input type="text" v-validate="'required'" name="firstName" v-model="sponserMember.firstName" class=" first-name-value" :class="{'input': true, 'is-danger': errors.has('firstName'), 'is-success': !errors.has('firstName') }"
                      placeholder="Enter first name"></p>
                  <span v-show="errors.has('firstName')" class="error-style">first name is required field</span>
                  <p><span class="inner-card-name">Last Name:</span>
                    <input type="text" v-validate="'required'" name="lastName" v-model="sponserMember.lastName" class=" first-name-value" :class="{'input': true, 'is-danger': errors.has('lastName'), 'is-success': !errors.has('lastName') }"
                      placeholder="Enter last name"></p>
                  <span v-show="errors.has('lastName')" class="error-style">last name is required field</span>
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Email</p>
                  <input type="email" v-validate="'required|email'" name="email" :class="{'input': true, 'is-danger': errors.has('email'), 'is-success': !errors.has('email') }"
                    class="form-control inner-card-value" v-model="sponserMember.email" placeholder="Enter email" required>
                  <span v-show="errors.has('email')" class="error-style">{{ errors.first('name') }}</span>
                </div>
                <div class="col-md-4 col-sm-4 card-height">
                  <p class="inner-card">Contact type <i class="fa fa-question-circle" aria-hidden="true"></i></p>
                  <select name="contactType" v-validate="'required'" v-model="sponserMember.contactType" class="form-control input-md inner-card-value select-font"
                    placeholder="Billing" :class="{'input': true, 'is-danger': errors.has('contactType'), 'is-success': !errors.has('contactType') }">
                <option v-for="contactType in contactTypes" v-bind:value="contactType.value">{{ contactType.name }}</option>
                </select>
                  <span v-show="errors.has('contactType')" class="error-style">contact Type is mandatory</span>
                </div>
                <div class="col-md-12 col-sm-12 pb-20">
                  <span v-if="sponserMembers.length>1" class="cursor_pointer remove-color" v-on:click="removeContact(index)">Remove</span>
                </div>
              </div>
              <div class="row">
                <div class="pt-20">
                  <div class="col-md-4">
                    <button type="button" class="btn btn-md add-screen text-left" v-on:click="addAnotherContact()"> Add another contact</button>
                  </div>
                  <div class="col-md-8 text-right">
                    <button type="button" class="btn btn-md cancel-btn text-right" v-on:click="goToSponserList"> Cancel</button>
                    <button type="button" class="btn btn-md save-btn text-right" v-on:click="saveUserInfo(sponserMemberId,sponserMembers)"> Invite </button>
                  </div>
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
// import jwt from 'jwt-decode';
import toastr from 'toastr';
import mainHeader from '../common/main-header';

export default {
  name: 'add-new-sponser-member',
  data() {
    return {
      sponserMemberId: null,
      validMobile: false,
      validWork: false,
      sponserMembers: [
        {
          firstName: '',
          lastName: '',
          email: '',
          contactType: '',
        },
      ],
      contactTypes: [
        { name: 'Billing', value: 'BillingContact' },
        { name: 'Technical', value: 'TechnicalContact' },
        { name: 'Administrative', value: 'AdministrativeContact' },
      ],
    };
  },
  mounted() {
    this.sponserMemberId = this.$route.params.sponserMemberId;
  },
  methods: {
    addAnotherContact() {
      this.sponserMembers.push({
        firstName: '',
        lastName: '',
        email: '',
        contactType: '',
      });
    },
    removeContact(index) {
      this.sponserMembers.splice(index, 1);
    },
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
    goToSponserList() {
      this.$router.push({ name: 'sponsers-list' });
    },
    saveUserInfo(clientMemberId, membersObj) {
      this.$api.addNewUserInfoFact(membersObj).then(
        () => {
          toastr.success('user added succesfully');
          this.$router.push({ name: 'users' });
        },
        error => {
          const err = error.body && error.body.message ? error.body.message : 'Error while adding user.';
          toastr.error(err);
        },
      );
    },
  },
  components: { mainHeader },
};
</script>

<style scoped lang="scss">
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
.add-screen {
  color: #f06559;
  border: 1px solid #f06559;
  background: none;
  border-radius: 50px;
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

.remove-color {
  color: #ff4848;
  font-weight: bold;
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
  height: 110px;
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
