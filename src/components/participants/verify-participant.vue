<template>
  <div class="forgotPassword studies_bg">
    <div class="container container-style">
      <div class="row">
        <div class="col-xs-12 col-md-12 col-lg-12 col-sm-12" v-if="showSuccessMsg && verificationMsg">
          <p class="fs-24 text-center color_ff">{{verificationMsg}}</p>
        </div>
        <div class="col-xs-12 col-md-12 col-lg-12 col-sm-12" v-else-if="showErrorMsg">
          <p class="fs-24 text-center color_ff">{{errorMsg}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'verifyParticipantPage',
  data() {
    return {
      showSuccessMsg: false,
      showErrorMsg: false,
      verified: false,
      verificationMsg: null
    };
  },
  computed: {
    ...mapGetters(['token', 'appStateClientId']),
    clientVal() {
      return this.appStateClientId;
    },
  },
  watch: {
    clientVal: {
      handler(val) {
        if (val) {
          this.verifyParticipant();
        }
      },
    },
  },
  methods: {
    ...mapActions(['userLogout']),
    verifyParticipant() {
      if (!this.verified) {
        this.$api
          .verifyParticipantDataFact(this.studyId, this.$route.params.token, this.email)
          .then(
            response => {
              if(response && response.body) {
                this.verificationMsg = response.body;
              }
              this.verified = true;
              this.showSuccessMsg = true;
            },
            error => {
              this.showErrorMsg = true;
              this.errorMsg = error.body.message;
            },
          );
      }
    },
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.email = this.$route.params.email;
    if (this.token) {
      // logout reload the page
      this.userLogout();
    } else if (this.clientVal) {
      this.verifyParticipant();
    }
  },
};
</script>

<style lang="scss">
.studies_bg {
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
h1,
h2 {
  font-weight: normal;
  color: #00baf9;
}

.font-style {
  margin-bottom: 15px;
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
}

.link-style {
  font-size: 16px;
  text-align: center;
}

.p-style {
  color: #8c8c8c;
  font-size: 14px;
  padding-bottom: 30px;
}

.panel-padding {
  padding: 15px 15px 28px 15px;
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
.container-style {
  padding-top: 120px;
}

@media (max-width:1023px) {
    body{
      width: auto;
      min-width: auto;
    }
}
</style>
