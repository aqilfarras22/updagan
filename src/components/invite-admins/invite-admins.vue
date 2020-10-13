<template>
  <div class="invite-admins invite-admin-bg">
    <div class="container">
      <p class="color_ff fs-24 pb-0">Would you like to add any team members?</p>
      <p class="color_ff fs-24">If not, just press "Continue."</p>
      <div class="card form-block">
        <div class="card-body">
            <h2 class="card-title">Invite</h2>
            <form v-on:submit.prevent="addAdmins(invite)">
              <div class="form-group">
                <input type="email" class="form-control form-control-lg email-width" v-model="invite.email" placeholder="Enter email" required :disabled="editable">
                <span class="icon-style" v-on:click="addAdmins(invite)" v-html="plus_icon"></span>
              </div>
              <div class="row" v-show="formErrors">
                <div class="col-md-12 pl-0 pr-0">
                  <div class="alert alert-warning" role="alert">
                    {{ formErrors }}
                  </div>
                </div>
              </div>
              <div class="row pb-5" v-for="(admin,index) in users" :key="index">
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 p-0">
                  <div class="fa fa-minus-circle table-icon col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0 text-right pr-10" v-if="!inviteSent" v-on:click="removeUser(index)"></div>
                  <div class="fa fa-chevron-circle-down invite-icon col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0" v-if="inviteSent"></div>
                  <div class="table-text-style col-lg-10 col-md-10 col-sm-10 col-xs-10 p-0 text-wrapping">{{admin.email}}</div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 p-0">
                  <select class="form-control select-style" v-if="!inviteSent" v-model="admin.role">
                    <option value="SystemAdmin"> Platform Admin</option>
                    <option value="StudyAdmin"> Study Admin</option>
                    <option value="Sponsor"> Sponsor</option>
                  </select>
                  <span class="invite-text" v-if="inviteSent">Invite sent!</span>
                </div>
              </div>
            </form>
            <button class="btn btn-lg btn-block btn1-style br-25" disabled v-if="addInvite">Send invite</button>
            <button class="btn btn-lg btn-block btn1-active-style br-25" v-if="!addInvite" v-on:click="sendInvite()">Send invite</button>
            <button class="btn btn-info btn-lg btn-block btn2-style br-25" v-on:click="nextPage">Continue</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import _ from 'lodash';
import toastr from 'toastr';

export default {
  name: 'invite-admins',
  data() {
    return {
      editable: false,
      admin: '',
      users: [],
      formErrors: false,
      plus_icon: '<i class="fa fa-plus-circle" aria-hidden="true"></i>',
      addInvite: true,
      inviteSent: false,
      invite: {
        email: '',
        role: '',
      },
      invitations: {},
    };
  },
  methods: {
    removeUser(index) {
      this.users.splice(index, 1);
    },
    sendInvite() {
      const payload = { invitations: this.users };
      this.$api.inviteUserInfoFact(payload).then(
        () => {
          toastr.success('invite sent successfully');
          this.editable = true;
          this.inviteSent = true;
          this.addInvite = true;
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while inviting user.',
          );
        },
      );

      // this.$router.push({ name: 'studies' });
    },
    nextPage() {
      const emptyPayload = { invitations: [] };
      this.$api.inviteUserInfoFact(emptyPayload).then(
        () => {
          toastr.success('invite sent successfully');
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while redirecting to studies.',
          );
        },
      );
      this.$router.push({ name: 'studies' });
    },
    addAdmins(obj) {
      if (/^([A-Za-z0-9+_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(obj.email)) {
        this.formErrors = false;
        const introQuestionIndex = _.findIndex(this.users, ['email', obj.email]);
        if (introQuestionIndex >= 0) {
          toastr.error('user already exists');
        } else {
          this.$api.verifyUserInfoFact(obj).then(
            response => {
              if (response.body.status === true) {
                toastr.error('user already exists');
              } else {
                toastr.success('valid email id');
                this.users.push({ email: obj.email, role: '' });
                this.addInvite = false;
                this.admin = '';
              }
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while verifying user.',
              );
            },
          );
        }
      } else {
        this.formErrors = 'Enter valid email id';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.invite-admin-bg {
  background: url('/static/img/bg/about-you.png') no-repeat;
  background-color: #2a496d;
  background-size: cover;
  min-height: 100vh;
  background-color: #34537d;
  background-blend-mode: multiply;
  height: 100%;
}

.background {
  background: url('/static/img/login-background.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  height: 100%;
}

h1,
h2 {
  font-weight: normal;
  color: #34537d;
  margin-bottom: 20px;
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
  color: #8c8c8c;
  font-size: 18px;
}

p {
  font-size: 18px;
  text-align: center;
  padding-bottom: 20px;
}

.container {
  padding-top: 100px;
}

.card-body {
  padding: 15px 15px 20px 15px;
}

.font-style {
  color: #34537d;
}

.btn1-style {
  //margin-top: 100px;
  margin-top: 31px;
  background-color: #c6c2c2;
  color: white;
}

.btn1-active-style {
  //  margin-top: 100px;
  margin-top: 31px;
  background-color: #2ecc71;
  color: white;
}

.btn2-style {
  margin-top: 10px;
  background-color: #41acf4;
}

.icon-style {
  font-size: 30px;
  color: #ff7171;
  position: absolute;
  top: 71px;
  right: 24px;
}

.borderless td,
.borderless th {
  border: none;
}

.table-icon {
  font-size: 20px;
  color: #8c8c8c;
  top: 17px;
  left: -6px;
  line-height: 0;
  float: left;
  padding-right: 5px !important;
}

.invite-icon {
  font-size: 20px;
  color: #2ecc71;
  width: 27px;
  top: 10px;
  line-height: 0;
}

.invite-text {
  color: #2ecc71;
  padding-left: 20px;
}
.table-text-style {
  color: #8c8c8c;
  font-size: 14px;
}

.select-style {
  color: #8c8c8c;
  font-size: 13px;
  height: 30px;
  padding: 0px 0px 0px 15px;
}

.text-wrapping {
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
  margin-top: 5px;
}

.email-width {
  padding: 10px 41px 10px 10px;
}

.form-block {
  max-width: 360px;
  margin: 0 auto;
}

.form-control.select-style {
  padding: 0px 21px 0px 8px;
}
</style>
