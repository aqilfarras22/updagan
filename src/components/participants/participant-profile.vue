<template>
  <div class="main_bg">
    <mainHeader></mainHeader>
    <sideMenu :studyData="{}"></sideMenu>
    <div class="has-sidemenu">
      <div class="container-fluid">
        <div class="participant-header">
          <div class="row studies_list">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pt-20 pb-20">
              <button type="button" class="btn btn-md custom-button" @click="goToAllParticipants">
                <i class="fa fa-angle-left font-size18" aria-hidden="true"></i> All Participants</button>
              <button type="button" class="btn btn-md edit-profile-btn pull-right" @click="goToAllTeams"> Edit profile</button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <p class="invite-strip">
                <span class="">Invitation Date:</span>
                <span class="pr-20">Not yet Invited</span>
                <span class="">Join Date:</span>
                <span class="">Not yet Joined</span>
              </p>
            </div>
          </div>
          <div class="row p-15 pt-0">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 card-container">
              <div class="team-card">
                <div class="row">
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Email</p>
                    <input type="text" v-model="team.email" class="inner-card-value" placeholder="Leslie@company.com">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height col-md-offset-0">
                    <p class="inner-card">Status</p>
                    <select name="status" v-model="team.status" class="form-control input-md inner-card-value width60 float-left select-font" placeholder="Active">
                      <option disabled value="Not invited">Not invited</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Not invited</option>
                      <option value="InActive">InActive</option>
                    </select>
                    <button type="button" class="btn btn-md send-invite" v-if="team.status=='Not invited'" @click="goToAllTeams">
                      <i class="fa fa-location-arrow" aria-hidden="true"></i> send invite</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Name</p>
                    <input type="text" v-model="team.name" class="inner-card-value" placeholder="Leslie Jones">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Date of birth</p>
                    <input type="text" v-model="team.dob" class="inner-card-value" placeholder="12/12/1991">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Gender</p>
                    <input type="text" v-model="team.gender" class="inner-card-value" placeholder="Female">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Mobile Number</p>
                    <input type="text" v-model="team.mobileNumber" class="inner-card-value" placeholder="Concealed">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Address</p>
                    <input type="text" v-model="team.address" class="inner-card-value" placeholder="Concealed">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">City of Province</p>
                    <input type="text" v-model="team.city" class="inner-card-value" placeholder="Concealed">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">State</p>
                    <input type="text" v-model="team.state" class="inner-card-value" placeholder="Concealed">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Country</p>
                    <input type="text" v-model="team.country" class="inner-card-value" placeholder="Concealed">
                  </div>
                  <div class="col-md-4 col-sm-6 card-height">
                    <p class="inner-card">Zip or postal code</p>
                    <input type="text" v-model="team.zip" class="inner-card-value" placeholder="Concealed">

                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 col-sm-12 h-80 text-center">
                    <button type="button" class="btn btn-md cancel-btn"> Cancel</button>
                    <button type="button" class="btn btn-md create-btn btn-info"> Create</button>
                    <button type="button" class="btn btn-md save-btn" @click="saveTeamInfo(team)"> Create and send invite </button>
                    <span class="reset-password" data-toggle="modal" data-target="#reset-password-modal">Reset password</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="row bottom_footer">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <p class="text-center font-size10">Questions or need help ?</p>
              <Copyright />
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mainHeader from '@/components/common/main-header';
import sideMenu from '@/components/common/side-menu';
import Copyright from '@/components/common/copyright';

export default {
  name: 'ParticipantProfile',
  components: { mainHeader, sideMenu, Copyright },
  data() {
    return {
      team: {
        name: '',
        email: '',
        mobileNumber: '',
        gender: '',
        status: 'Not invited',
        dob: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
      },
      options: [{ name: 'Study admin', value: 'Study admin' }, { name: 'Platform Admin', value: 'Platform Admin' }],
    };
  },
  methods: {
    goToAllParticipants() {
      this.$router.push({ name: 'participants' });
    },
    loginUser() {},
    download() {
      this.downloadStarted = true;
    },
    downloadAgain() {
      this.downloadStarted = false;
      this.user.password = null;
      this.errors.clear();
    },
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
}

.h4,
h4 {
  font-size: 18px;
  margin: 10px 0;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: '';
    clear: both;
    display: block;
  }
}

.search-field {
  padding-right: 30px;
  background-image: url('/static/img/icon-search.gif');
  background-repeat: no-repeat;
  background-position: 97% 50%;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2 {
    flex: none;
  }
}

@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.form-control[disabled],
fieldset[disabled] .form-control {
  cursor: not-allowed;
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
  font-size: 16px;
}

.inner-card-value {
  font-size: 24px;
  color: #4a4a4a;
  border: none;
  outline: none;
}

.card-height {
  height: 150px;
}

.edit-profile-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #195877;
}

.edit-profile-btn:hover {
  color: #fff;
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

.reset-password {
  position: absolute;
  bottom: 0px;
  right: 0px;
  text-decoration: underline;
  color: #4a4a4a;
  cursor: pointer;
}

.save-btn {
  width: 170px;
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

.create-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #1f95f2;
  color: #fff;
}

.select-font {
  font-size: 18px;
  color: #888;
}

.send-invite {
  background-color: #2ecc71;
  color: #fff;
}

.invite-strip {
  padding: 10px 15px 10px 15px;
  background-color: #195877;
  margin-bottom: 0px;
}

@media (max-width: 575px) {
  .xs-none {
    display: none;
  }
  .mob-pl0 {
    padding-left: 0px;
  }
  .mob-pt15 {
    padding-top: 15px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .mob-pl0 {
    padding-left: 0px;
  }
  .mob-pt15 {
    padding-top: 15px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) {
  .align-right {
    text-align: right;
  }
}
</style>
