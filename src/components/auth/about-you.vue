<template>
  <div class="about-you main_bg about-you-bg">
    <div class="container pt-40">
      <div class="card form-block">
          <div class="card-body">
              <h2 class="card-title fs-24">Tell us about yourself</h2>
              <form>
                <div class="form-group">
                  <input type="text" v-validate="'required'" name="firstName" :class="{'input': true, 'is-danger': errors.has('firstName'), 'is-success': !errors.has('firstName') }"
                    class="form-control input-md" v-model="user.firstName" placeholder="First Name" required>
                  <span v-show="errors.has('firstName')" class="error-style">First name is required.</span>
                </div>
                <div class="form-group">
                  <input type="text" v-validate="'required'" name="lastName" :class="{'input': true, 'is-danger': errors.has('lastName'), 'is-success': !errors.has('lastName') }"
                    class="form-control input-md" v-model="user.lastName" placeholder="Last Name" required>
                  <span v-show="errors.has('lastName')" class="error-style">Last name is required.</span>
                </div>
                <div class="form-group">
                  <!-- <input type="tel" v-validate="'min:10|max:15'" name="phoneNumber" :class="{'input': true, 'is-danger': errors.has('phoneNumber'), 'is-success': !errors.has('phoneNumber') }"
                    class="form-control input-md mb-5" v-model="user.phoneNumber" placeholder="Mobile Number"> -->
                  <vue-tel-input class="p-0" :preferredCountries="['us', 'ca']" @onInput="onInputTelephone" v-model="user.phoneNumber" :placeholder="'(      )  '"></vue-tel-input>

                  <span class="fs-12 display-block color_grey">A mobile number is needed for SMS identity verification</span>
                  <span v-show="phoneError" class="error-style">Please enter a valid phone number.</span>
                </div>
                <div class="form-group">
                  <vue-tel-input class="p-0"  :preferredCountries="['us', 'ca']" @onInput="onInputTelephoneWork" v-model="user.workNumber" placeholder="Work Number (optional)"></vue-tel-input>
                  <!-- <input type="tel" name="workNumber" class="form-control input-md" v-model="user.workNumber" placeholder="Work Number (optional)"> -->
                  <span v-show="workNumberError" class="error-style">Please enter a valid phone number.</span>
                </div>
                <div class="form-group">
                  <div v-if="errors.any()">
                    <button class="btn btn-lg btn-block btn-disabled br-25" :disabled="errors.any()">Continue</button>
                  </div>
                  <div v-if="!errors.any()">
                    <button type="submit" class="btn btn-info btn-lg btn-block br-25" v-on:click.prevent="addUserDetails">Continue</button>
                  </div>
                </div>
              </form>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const jwtDecode = require('jwt-decode');

export default {
  name: 'AboutYou',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        workNumber: '',
      },
      formErrors: false,
      signIndisabled: true,
      pwdError: false,
      emailError: false,
      phoneError: false,
      workNumberError: false
    };
  },
  mounted() {
    this.user = jwtDecode(window.localStorage.getItem('thread-token'));
    this.userId = this.$route.params.userId;
  },
  methods: {
    ...mapActions(['userUpdate']),
    getUserProfileDetails(userId, token) {
      this.$api.getProfileDetails(userId).then(
        result => {
          const user = result.body;
          this.userUpdate(user);
          this.$http.headers.common.Authorization = token;
          this.$router.push({
            name: 'forgot-password-otp',
            params: { token, mobile: user.phoneNumber },
          });
          // toastr.success('Succesfully logged in');
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the profile details',
          );
        },
      );
    },
    addUserDetails() {
      if(!this.phoneError && !this.workNumberError) {
      this.formErrors = false;
      if(this.user.phoneNumber) {
      this.user.phoneNumber = this.user.phoneNumber.replace(/\s/g, "");
      }
      if(this.user.workNumber) {
      this.user.workNumber = this.user.workNumber.replace(/\s/g, "");
      }
      this.$api.userDetailsFact(this.userId, this.user).then(
        response => {
          if (response.body.token) {
            if (response.body.token) {
              this.$toastr.success('User details added successfully');
              this.getUserProfileDetails(this.userId, response.body.token);
            }
          }
        },
        error => {
          this.formErrors = error.body;
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Failed while updating user details',
          );
        },
      );
    }
    },
    onInputTelephone({ number, isValid, country }) {
      if (number && !isValid) {
        this.phoneError = true;
      } else {
        this.phoneError = false;
      }
    },
    onInputTelephoneWork({ number, isValid, country }) {
      if (number && !isValid) {
        this.workNumberError = true;
      } else {
        this.workNumberError = false;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.about-you-bg {
  background: url('/static/img/bg/about-you.png') no-repeat;
  background-color: #34537d;
  background-blend-mode: multiply;
  height: 100%;
  min-height: 100vh;
  background-size: cover;
}
h1,
h2 {
  font-weight: normal;
  color: #34537d;
}

.card-title {
  margin-bottom: 20px;
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
  color: #00baf9;
  font-size: 16px;
}

p {
  color: #00baf9;
  font-size: 16px;
}

.container{
  padding-top: 40px;
}

.btn-style {
  border: 1px solid #00baf9;
  color: #00baf9;
}

.panel-padding {
  padding: 15px 15px 30px 15px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.btn-disabled {
  color: white;
  background-color: #c6c2c2;
  border: #c6c2c2;
}
.color-text {
  color: #08131f !important;
}

.welcome-text {
  font-size: 20px;
  color: #fff;
  text-align: center;
}

.form-block{
  max-width: 360px;
  margin: 0 auto;
}
</style>
