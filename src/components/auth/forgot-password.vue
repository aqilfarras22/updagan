<template>
  <div class="forgotPassword main_bg forgotPassword-bg">
    <div class="container">
      <div class="card forgot-block" v-if="!resetLinkSent">
        <div class="card-body">
          <h2 class="card-title">Forgot password</h2>
          <p class="p-style">Please enter your email address and we will send you a password reset link.</p>
          <form>
            <div class="form-group">
              <input type="email" v-validate="'required|email'" name="email" :class="{'input': true, 'is-danger': errors.has('email'), 'is-success': !errors.has('email') }"
                class="form-control form-control-lg" v-model="user.username" placeholder="Email address" required>
              <span v-show="errors.has('email')" class="error-style">{{ errors.first('email') }}</span>
            </div>
            <p class="error-style" v-if="errorMsg">{{errorMsg}}</p>
            <div class="form-group">
              <div v-if="errors.any()">
                <button class="btn btn-lg btn-block disabled br-25" :disabled="errors.any()">Get reset link</button>
              </div>
              <div v-if="!errors.any()">
                <button type="submit" class="btn btn-info btn-lg btn-block br-25" v-on:click.prevent="requestPassword">Get reset link</button>
              </div>
            </div>
          </form>
          <div class="link-style">
            <router-link :to="{ name: 'login'}">Sign in</router-link>
          </div>
        </div>
      </div>
      <div class="card forgot-block" v-if="resetLinkSent">
        <div class="card-body">
          <h2 class="card-title">Check your email</h2>
          <p class="p-style">We've sent you a password reset link.<br/> See you back here soon!</p>
          <div>
            <button type="submit" class="btn btn-info btn-lg btn-block br-25" v-on:click.prevent="goToLoginPage">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'forgotPassword',
  data() {
    return {
      user: {
        username: '',
      },
      formErrors: false,
      resetLinkSent: false,
      errorMsg: null,
    };
  },
  mounted() {
    this.userLogout();
  },
  methods: {
    ...mapActions(['userLogout']),
    requestPassword() {
      this.$api.sendForgotPwdEmailFact({ userName: this.user.username })
        // this.$http.post('auth/forgot-password', { userName: this.user.username })
        .then(
          () => {
            this.resetLinkSent = true;
            this.$toastr.success('Email has been sent to your mail box');
            this.$store.dispatch('forgotPasswordSuccessAction', this.user);
          },
          error => {
            this.errorMsg = error.body && error.body.message
              ? error.body.message
              : 'Error while requesting to change the password';
            this.$store.dispatch('forgotPasswordErrorAction', this.user);
          },
        );
    },
    goToLoginPage() {
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style scoped lang="scss">
.forgotPassword-bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  background-color: #34537d;
  background-size: cover;
}

h1,
h2 {
  font-weight: normal;
  color: #34537d;
}

.forgot-block {
  max-width: 360px;
  margin: 0 auto;
}

.card-title {
  margin-bottom: 12px;
  margin-top: 3px;
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
  color: #34537d;
}

.link-style {
  font-size: 16px;
  text-align: center;
  padding: 0 0 7px;
}

.p-style {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 18px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
}

.btn.disabled {
  color: white;
  background-color: #c6c2c2 !important;
  border: #c6c2c2;
}

.container {
  padding-top: 13%;
}

.card-body{
  padding: 15px 15px 25px;
}
</style>
