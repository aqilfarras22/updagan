<template>
  <div class="login main_bg login_bg">
    <div class="container">
      <div class="card login-block">
        <div class="card-body">
          <h2 class="card-title">Sign in</h2>
          <div v-show="errorMessage">
            <div class="col-md-12 col-sm-12 pl-0 pr-0 error-style">{{errorMessage}}</div>
          </div>
          <form>
            <div class="form-group">
              <input type="email" v-validate="'required|email'" name="email" :class="{'input': true, 'is-danger': errors.has('email'), 'is-success': !errors.has('email') }"
                class="form-control form-control-lg" v-model="userCredentials.username" placeholder="Email address" required>
              <span v-show="errors.has('email')" class="error-style">Your email address may have been entered incorrectly, please enter a valid email</span>
            </div>
            <div class="form-group">
              <input type="password" v-validate="'required|min:8'" name="password" :class="{'input': true, 'is-danger': errors.has('password'), 'is-success': !errors.has('password') }"
                class="form-control form-control-lg" v-model="userCredentials.password" placeholder="Password" required autocomplete="off">
              <span v-show="errors.has('password')" class="error-style">{{ errors.first('password') }}</span>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-info btn-lg btn-block br-25" v-on:click.prevent="loginUser">Sign in</button>
            </div>
          </form>
          <p class="text-center fs-16 m-0">
            <router-link :to="{ name: 'forgotPassword'}">Forgot Password?</router-link>
          </p>
          <Copyright/>
        </div>
      </div>
      <div class="login-footer">
        <p>
          <router-link class="pr-10 color-white" :to="{ name: 'privacy-policy'}" target="_blank">Privacy Policy</router-link>
          <!-- <router-link class="pr-10 color-white" :to="{ name: 'terms-of-use'}" target="_blank">Terms of Service</router-link> -->
        </p>
        <Copyright/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Copyright from '../common/copyright';

export default {
  name: 'login',
  data() {
    return {
      userCredentials: {
        username: '',
        password: '',
      },
      formErrors: false,
      signIndisabled: true,
      pwdError: false,
      emailError: false,
      errorMessage: null,
    };
  },
  computed: {
    ...mapGetters(['user', 'token']),
  },
  components: { Copyright },
  watch: {
    user(user) {
      if (user.id) {
        this.redirect('id');
      }
    },
  },
  methods: {
    ...mapActions(['userLogin', 'userLogout']),
    async loginUser() {
      if (!this.errors.any()) {
        this.formErrors = false;
        try {
          await this.userLogin(this.userCredentials);
        } catch (error) {
          this.$toastr.error(error.message);
        }
      } else if (!this.userCredentials.username && !this.userCredentials.password) {
        this.$toastr.error('Please enter your credentials.');
      } else if (!this.userCredentials.username) {
        this.$toastr.error('Please provide your email, it is required');
      } else if (!this.userCredentials.password) {
        this.$toastr.error('Please provide your password, it is required');
      }
    },
    redirect(id) {
      if (!this.user.onBoarding) {
        if (this.user.profileCompleted === true && this.user.otpVerified) {
          if (this.user.userRole === 'SystemAdmin') {
            this.$router.push({ name: 'invite-admins' });
          }
          else if (this.$route.query.redirectTo) {
            this.redirectTo(this.$route.query.redirectTo);
          } 
          else {
            this.$router.push({ name: 'studies' });
          }
        } else {
          this.$router.push({ name: 'aboutYou', params: { userId: this.user.id } });
        }
      }
      else if (this.$route.query.redirectTo) {
        this.redirectTo(this.$route.query.redirectTo);
      }
      else {
        this.$router.push({ name: 'studies' });
      }
      if(id) {
      this.$toastr.success('Succesfully logged in');
      }
    },
    redirectTo(path){
      let pattern = /^((http|https):\/\/)/;
      if(pattern.test(path)) {
        window.location.href = path
      }
      else {
        this.$router.push(path);
      }
    }
  },
  mounted() {
    if (this.$route.query.error) {
      this.formErrors = { message: this.$route.query.error };
    }
    if (this.token) {
      if (this.token.expires < new Date().getTime()) {
        this.userLogout();
      } else {
        this.redirect();
        // this.$router.push({ name: 'studies' });
      }
    }
  },
};
</script>

<style scoped lang="scss">
.login_bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  background-color: #34537d;
  background-blend-mode: multiply;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
}
h1,
h2 {
  font-weight: normal;
  color: #34537d;
}

.card-title {
  margin-bottom: 17px;
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
  font-size: 1.2em;
}

p {
  color: #ffffff;
  font-size: 12px;
}

.btn-style {
  border: 1px solid #00baf9;
  color: #00baf9;
}

.login-block {
  max-width: 360px;
  margin: 0 auto;
}

.error-style {
  font-size: 12px;
  line-height: 1.2 !important;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}

.btn-disabled {
  color: white;
  background-color: #c6c2c2;
  border: #c6c2c2;
}

.container {
  padding-top: 120px;
}
.login-footer {
  color: #ffffff !important;
  font-size: 12px !important;
  text-align: center;
  padding-top: 15vh;
}
.card-body{
  padding: 15px 15px 25px;
}

</style>
