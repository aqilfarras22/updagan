<template>
  <div class="createPassword main_bg forgotPassword-bg">
    <div class="container">
      <div class="row">
        <div class="card passw-block"  v-if="!showSuccessMsg">
          <div v-if="keys && Object.keys(keys).length > 0" class="card-body">
            <h2 class="card-title" >{{keys.RESET_NEW_PASSWORD}}</h2>
            <form>
              <div class="form-group">
                <p class="password-text">{{keys.RESET_PASSWORD_REQUIRE}}</p>
                <ul class="validation-list">
                  <li>{{keys.RESET_MIN_CHAR}}
                    <span v-if='show'>
                      <i v-if='minValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                      <i v-if='!minValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                    </span>
                  </li>
                  <li>{{keys.RESET_UPPERCASE}} <span v-if='show'>
                      <i v-if='upperValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                      <i v-if='!upperValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                    </span></li>
                  <li>{{keys.RESET_LOWERCASE}} <span v-if='show'>
                      <i v-if='lowerValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                      <i v-if='!lowerValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                    </span></li>
                  <li>{{keys.RESET_NUMBER}} <span v-if='show'>
                      <i v-if='numbervalid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                      <i v-if='!numbervalid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                    </span></li>
                  <li>{{keys.RESET_SYMBOL}} <span v-if='show'>
                      <i v-if='specialValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                      <i v-if='!specialValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                    </span></li>
                </ul>
              </div>
              <div class="form-group">
                <input type="password" class="form-control form-control-lg" v-on:keyup="validPassword(user.password)" v-model="user.password" :placeholder="[[ keys.RESET_PLACEHOLDER_PASSWORD ]]"
                  required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control form-control-lg" v-on:keyup="validateConfirmPassword()" v-model="user.confirmPassword"
                  :placeholder="[[ keys.RESET_PLACEHOLDER_CONFIRM_PWD ]]" required>
                <p class="error-style" v-if='showError'>{{keys.RESET_PASSWORD_NOT_MATCH}}</p>
                <p class="error-style" v-if="errorMsg">{{this.errorMsg}}</p>
              </div>
              <div class="form-group" v-if="confirmEnable">
                <button type="button" class="btn btn-lg btn-block border-radius20 btn-disabled br-25" :disabled="confirmEnable">{{keys.RESET_CONTINUE}}</button>
              </div>
              <div class="form-group" v-if="!confirmEnable">
                <button type="button" class="btn btn-lg btn-info btn-block border-radius20 br-25" v-on:click.prevent="changePassword">{{keys.RESET_CONTINUE}}</button>
              </div>
            </form>
          </div>
        </div>
        <div v-else class="text-center col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <h4>{{keys.RESET_PASSWORD_SUCCESSFUL}}</h4>
        </div>
      </div>
    </div>
    <p class="special-error" v-if="specialError">{{specialError}}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import toastr from 'toastr';

export default {
  name: 'ParticiapntResetPassword',
  data() {
    return {
      showSuccessMsg: false,
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
      keys: null,
      languageId: this.$route.params.languageId ? this.$route.params.languageId : null,
      specialError: null
    };
  },
  computed: {
    ...mapGetters(['token']),
  },
  mounted() {
    if (this.token) {
      this.userLogout();
    }
    this.getKeys();
  },
  methods: {
    ...mapActions(['userLogout']),
    changePassword() {
      this.$api.participantForgotPasswordFact({
        token: this.$route.params.token,
        newPassword: this.user.password,
      }).then(
        () => {
          this.correctOTP = true;
          this.showSuccessMsg = true;
        },
        error => {
          this.errorMsg = true;
          this.errorMsg = error.body && error.body.message
            ? error.body.message
            : keys.RESET_PROCESS_ERROR;
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
      const specialPattern = new RegExp('^(?=.*[!"#@$%&\'()*+,-./:;<=>?[\\]^_{|}~]).+$');
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
    getKeys() {
      this.$api.resetPasswordKey(this.languageId, this.$route.params.token,).then((response) => {
        this.keys = response && response.body;
      }, error => {
          this.specialError = (error.body && error.body.message) ? error.body.message : (error.body && error.body.message_key) ? error.body.message_key : 'Something while wrong while loading the page';
      })
    },
  },
};
</script>

<style scoped lang="scss">
h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
  color: #34537d;
}

.forgotPassword-bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  /*color: #fff;*/
  background-color: #34537d;
  background-blend-mode: soft-light;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #8c8c8c;
  font-size: 18px;
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
  color: #555;
}
.special-error {
  text-align: center;
  font-size: 21px;
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
  background-color: #c6c2c2;
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
