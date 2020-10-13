<template>
  <div class="sendOTP main_bg send-otp-bg">
    <div class="container">
        <div class="card passw-block">
          <div class="card-body">
            <h2 class="card-title">Verify your identity</h2>
            <p class="p-style">We've sent a six-digit confirmation code to {{mobileNo}} and your email address on file. Enter it below</p>
          <form class="otp_form">
            <div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-12 pr-12">
              <input type="text" v-validate="'required|digits:1'" name="otp_1" :class="{'input': true, 'is-danger': errors.has('otp_1'), 'is-success': !errors.has('otp_1') }"
                class="inputs form-control form-control-sm input-style " v-model="otp_1" maxlength="1" id="1" v-on:keyup="validatePassKey(1)"
                required tabindex="-1">
              <span v-show="errors.has('otp_1')" class="error-style"></span>
            </div>
            <div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-12 pr-12">
              <input type="text" v-validate="'required|digits:1'" name="otp_2" :class="{'input': true, 'is-danger': errors.has('otp_2'), 'is-success': !errors.has('otp_2') }"
                class="form-control form-control-sm input-style inputs" v-model="otp_2" maxlength="1" id="2" v-on:keyup="validatePassKey(2)"
                required>
            </div>
            <div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-12 pr-12">
              <input type="text" v-validate="'required|digits:1'" name="otp_3" :class="{'input': true, 'is-danger': errors.has('otp_3'), 'is-success': !errors.has('otp_3') }"
                class="form-control form-control-sm  input-style inputs" v-model="otp_3" maxlength="1" id="3" v-on:keyup="validatePassKey(3)"
                required>
            </div>
            <div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-12 pr-12">
              <input type="text" v-validate="'required|digits:1'" name="otp_4" :class="{'input': true, 'is-danger': errors.has('otp_4'), 'is-success': !errors.has('otp_4') }"
                class="form-control form-control-sm input-style inputs" v-model="otp_4" maxlength="1" id="4" v-on:keyup="validatePassKey(4)"
                required>
            </div>
            <div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-12 pr-12">
              <input type="text" v-validate="'required|digits:1'" name="otp_5" :class="{'input': true, 'is-danger': errors.has('otp_5'), 'is-success': !errors.has('otp_5') }"
                class="form-control form-control-sm input-style inputs" v-model="otp_5" maxlength="1" id="5" v-on:keyup="validatePassKey(5)"
                required>
            </div>
            <div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-12 pr-12">
              <input type="text" v-validate="'required|digits:1'" name="otp_6" :class="{'input': true, 'is-danger': errors.has('otp_6'), 'is-success': !errors.has('otp_6') }"
                class="form-control form-control-sm input-style inputs" v-model="otp_6" maxlength="1" id="6" v-on:keyup="validatePassKey(6)"
                required>
            </div>
            <div>
              <div class="form-group" v-if="otp_1 == '' && errorMsg == ''">
                <div class="link-style"> <a v-on:click="incorrectNumber">Incorrect mobile number?</a></div>
              </div>
            </div>
            <div class="form-group pt-40">
              <div class="success-msg-style" v-if="successMsg">{{successMsg}}</div>
              <div class="error-style" v-if="errorMsg">{{errorMsg}}</div>
              <div v-if="errors.any()">
                <button class="btn btn-lg btn-block br-25" :disabled="!correctOTP">Continue</button>
              </div>
              <div v-if="!errors.any()">
                <button type="submit" class="btn btn-info btn-lg btn-block br-25" v-on:click.prevent="confirmOTP">Continue</button>
              </div>
            </div>
            <div class="link-style"> <a v-on:click="resendOTP" class="primaryColor cursor_pointer">Resend code</a></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'sendOTP',
  data() {
    return {
      otp_1: '',
      otp_2: '',
      otp_3: '',
      otp_4: '',
      otp_5: '',
      otp_6: '',
      otp: '',
      formErrors: false,
      correctOTP: false,
      successMsg: null,
      errorMsg: null,
      mobileNo: null,
      token: null,
    };
  },
  computed: {
    ...mapGetters(['appStateClientId']),
  },
  mounted() {
    this.mobileNo = this.$route.params.mobile? this.$route.params.mobile : '[no phone # on file]';
    this.token = this.$route.params.token;
    if (this.appStateClientId) {
      this.sendOtpToMobile();
    }
  },
  methods: {
    sendOtpToMobile() {
      this.$api.sendOtpToMobileFact({ token: this.token }).then(
        () => {
          this.errorMsg = null;
        },
        error => {
          this.successMsg = null;
          this.errorMsg = error.body && error.body.message
            ? error.body.message
            : 'Error while sending OTP to mobile';
        },
      );
    },
    incorrectNumber() {},
    confirmOTP() {
      this.otp = this.otp_1 + this.otp_2 + this.otp_3 + this.otp_4 + this.otp_5 + this.otp_6;
      this.$api.verifyOtpFact({ token: this.token, otp: this.otp }).then(
        response => {
          this.correctOTP = true;
          this.errorMsg = null;
          this.successMsg = response.body.message;
          this.$router.push({ name: 'createPassword' });
        },
        error => {
          if (error.status === 409) {
            this.$router.push({ name: 'expire-link' });
          }
          this.$store.dispatch('confirmOtpErrorAction', { token: this.token, otp: this.otp });
          this.successMsg = null;
          this.errorMsg = error.body && error.body.message
            ? error.body.message
            : 'Error while confirming the OTP';
        },
      );
    },
    validatePassKey(id) {
      if (window.event.keyCode !== 8 && window.event.keyCode !== 46 && id !== 6) {
        window.document.getElementById(id + 1).focus();
      } else if ((window.event.keyCode === 8 || window.event.keyCode === 46) && id !== 1) {
        window.document.getElementById(id - 1).focus();
      }
    },
    resendOTP() {
      this.errorMsg = null;
      this.successMsg = null;
      this.successMsg = 'Code resent';
      this.$api.sendOtpToMobileFact({ token: this.token }).then(
        () => {},
        error => {
          this.errorMsg = error.body && error.body.message ? error.body.message : 'Error while resending the OTP';
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
.send-otp-bg {
  background: url('/static/img/bg/about-you.png') no-repeat;
  background-color: #34537d;
  //background-position: -615px -93px;
  background-blend-mode: multiply;
  background-size: cover;
}

h1,
h2 {
  font-weight: normal;
  color: #34537d;
}

.card-body{
  padding: 15px;
}

.otp_form {
  overflow: hidden;
  clear: both;

  > .form-group.col-lg-2{
    float: left;
  }

  input {
    padding: 5px;
    text-align: center;
  }
}

.p-style {
  color: #08131f;
  font-size: 12px;
  margin-bottom: 5px;
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
}

.link-style {
  font-size: 14px;
  text-align: center;
  padding-top: 5px;
}

p {
  color: #8c8c8c;
  font-size: 18px;
}

.input-style {
  border: 0px solid;
  border-bottom-width: 1px;
  border-radius: 0px;
  box-shadow: none;
  font-size: 24px;
}

.pl-12 {
  padding-left: 10px;
}

.pr-12 {
  padding-right: 10px;
}

.pt-40 {
  clear: both;
  padding-top: 40px;
  margin-bottom: 5px;
}

.pt-20 {
  clear: both;
  padding-top: 20px;
}

.btn-disabled {
  color: white !important;
  background-color: #c6c2c2 !important;
  border: #c6c2c2 !important;
  outline: none  !important;
}

.btn-disabled:focus{
  border: none !important;
  box-shadow: none !important;
}

.error-style {
  font-size: 12px;
  color: #ffa500;
  padding-bottom: 15px;
  text-align: center;
}

.success-msg-style {
  font-size: 12px;
  color: #449d44;
  padding-bottom: 15px;
  text-align: center;
}

.card-title {
  margin-bottom: 12px;
  margin-top: 3px;
}

.heading {
  text-align: center;
  font-size: 30px;
  max-width: 75%;
  margin: 0 auto 20px;
}

.container{
  padding-top: 120px;
}

.passw-block {
  max-width: 360px;
  margin: 0 auto;
}

.primaryColor {
  color: #1e8fe1 !important;
}
</style>
