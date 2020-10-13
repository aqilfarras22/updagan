<template>
  <div class="createPassword main_bg createPassword-bg">
    <div class="container">
      <div class="card passw-block">
        <div class="card-body">
          <h2 class="card-title">Create a new password</h2>
          <form>
            <div class="form-group">
              <p class="password-text">Password requirements:</p>
              <ul class="validation-list">
                <li>minimum 8 characters
                  <span v-if='show'>
                    <i v-if='minValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!minValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span>
                </li>
                <li>at least 1 uppercase letter <span v-if='show'>
                    <i v-if='upperValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!upperValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span></li>
                <li>at least 1 lowercase character <span v-if='show'>
                    <i v-if='lowerValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!lowerValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span></li>
                <li>at least 1 number <span v-if='show'>
                    <i v-if='numbervalid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!numbervalid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span></li>
                <li>at least 1 symbol (e.g @#$%) <span v-if='show'>
                    <i v-if='specialValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!specialValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span></li>
              </ul>
            </div>

            <div class="form-group">
              <input type="password" class="form-control form-control-lg" v-on:keyup="validPassword(user.password),validateConfirmPassword()" v-model="user.password" placeholder="Enter new password"
                    required>
            </div>
            <div class="form-group">
              <input type="password" class="form-control form-control-lg" v-on:keyup="validateConfirmPassword()" v-model="user.confirmPassword"
                 placeholder="Re-enter password" required>
              <p class="error-style" v-if='showError'> password did not match</p>
              <p class="error-style" v-if="errorMsg">{{this.errorMsg}}</p>
            </div>
            <div class="form-group" v-if="confirmEnable">
              <button type="button" class="btn btn-info btn-lg btn-block br-25" :disabled="confirmEnable">Confirm</button>
            </div>
            <div class="form-group" v-if="!confirmEnable">
              <button type="button" class="btn btn-info btn-lg btn-block br-25" v-on:click.prevent="changePassword">Confirm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CreatePassword',
  data() {
    return {
      show: false,
      minValid: false,
      upperValid: false,
      numbervalid: false,
      lowerValid: false,
      specialValid: false,
      showError: false,
      confirmEnable: true,
      errorMsg: false,
      user: {
        password: '',
        confirmPassword: '',
      },
      formErrors: false,
    };
  },
  computed: mapGetters(['token']),
  mounted() {
    this.mobileNo = this.$route.params.mobile;
    if (this.token) {
      this.userLogout();
    }
  },
  methods: {
    ...mapActions(['userLogout']),
    changePassword() {
      this.$api
        .setNewPasswordFact({ token: this.$route.params.token, newPassword: this.user.password })
        .then(
          response => {
            this.correctOTP = true;
            this.successMsg = response.body.message;
            this.$router.push({ name: 'login' });
          },
          error => {
            this.errorMsg = true;
            this.errorMsg = error.body && error.body.message
              ? error.body.message
              : 'Error while changing the password';
          },
        );
    },
    validateConfirmPassword() {
      this.confirmEnable = true;
      this.showError = false;
      if (
        this.user.password === this.user.confirmPassword
        && this.minValid
        && this.lowerValid
        && this.upperValid
        && this.numbervalid
        && this.specialValid
      ) {
        this.showError = false;
        this.confirmEnable = false;
      } else if (this.user.confirmPassword === '') {
        this.showError = false;
      } else if (this.user.password === this.user.confirmPassword) {
        this.showError = false;
      } else {
        this.showError = true;
      }
    },
    validPassword(password) {
      this.confirmEnable = true;
      this.show = true;
      this.lowerValid = false;
      this.upperValid = false;
      this.valid = false;
      this.specialValid = false;
      this.numbervalid = false;
      const lowerPattern = new RegExp('^(?=.*[a-z]).+$');
      const upperPattern = new RegExp('^(?=.*[A-Z]).+$');
      const numberPattern = new RegExp('^(?=.*[0-9]).+$');
      const specialPattern = new RegExp('^(?=.*[!"@#$%&\'(\)*+,-./:;<=>?\[\\\]^_{|}~]).+$'); // eslint-disable-line
      // empty password check
      if (password === '') {
        this.show = false;
      } else if (password.length >= 8) {
        this.minValid = true;
      } else if (password.length < 8) {
        this.minValid = false;
      }
      // lowercase pattern check
      if (lowerPattern.test(password)) {
        this.lowerValid = true;
      }
      // uppercase pattern check
      if (upperPattern.test(password)) {
        this.upperValid = true;
      }
      if (numberPattern.test(password)) {
        this.numbervalid = true;
      }
      if (specialPattern.test(password)) {
        this.specialValid = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.createPassword-bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  background-color: #34537d;
  background-size: cover;
}

h1,
h2 {
  font-weight: normal;
  color: #34537d;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #34537d;
}

.password-text {
  color: #34537d;
  font-size: 14px;
  margin-bottom: 0;
}

.validation-list {
  margin-left: 5px;
}

ul.validation-list li {
  list-style-type: disc !important;
  padding-top: 5px;
  font-size: 12px;
  color: #08131f;
}

.p-style {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 0;
}

.icon-invalid {
  color: red;
}

.icon-valid {
  color: limegreen;
}

.border-radius20 {
  border-radius: 20px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
}

.btn-disabled {
  color: white;
  background-color: #c6c2c2 !important;
  border: #c6c2c2;
}

.container {
  padding-top: 80px;
}

.passw-block {
  max-width: 360px;
  margin: 0 auto;
}

.card-title {
  margin-bottom: 12px;
  margin-top: 3px;
  margin-right: -9px;
  letter-spacing: -0.5px;
}

.heading {
  text-align: center;
  font-size: 30px;
  max-width: 75%;
  margin: 0 auto 20px;
}

.card-body {
  padding: 15px;
}
</style>
