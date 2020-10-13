<template>
  <div class=" client_bg">
    <div class=" client_bg">
      <mainHeader></mainHeader>
      <div class="container">
        <div class="row has-header">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pt-20">
            <p class="fs-24 color_ff">New Sponser</p>
          </div>
        </div>
        <div class="row p-15">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 card-container">
            <div class="team-card">
              <div class="row">
                <div class="col-md-12 col-sm-12 card-height">
                  <p class="inner-card">Company Name</p>
                  <input type="text" v-model="sponser.companyName" class="form-control inner-card-value" placeholder="">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-sm-6 card-height">
                  <p class="inner-card">Logo</p>
                  <div class="file-upload pl-30 pr-30">
                    <input type="file" class="file-input" @change="onFileChange($event)"><span class="fs-10">Upload</span>
              </div>
                </div>
                <div class="col-md-6 col-sm-6 card-height">
                  <p class="inner-card">Status</p>
                  <select name="status" v-model="sponser.status" class="form-control input-md inner-card-value width60 float-left select-font"
                    placeholder="Active">
                <option value="Active">Active</option>
                <option value="Pending" v-if="sponser.status!=='Inactive'">Pending Invitation</option>
                <option value="Inactive">Inactive</option>
                </select>
                  <button type="button" class="btn btn-md resend-invite" v-if="sponser.status=='Pending'" v-on:click="sendInvite(sponserId,sponser)"> Resend invite</button>
                </div>
              </div>
              <div class="row">
                <div class="text-center mb-20" style="margin:0 auto;">
                  <button type="button" class="btn btn-md cancel-btn" v-on:click="goToAllSponsers"> Cancel</button>
                  <button type="button" class="btn btn-md save-btn" v-on:click="saveSponserInfo(sponserId,sponser)"> Save </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row bottom_footer">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <p class="text-center foot-style-text">Questions or need help ?</p>
            <Copyright />
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
import Copyright from '../common/copyright';

export default {
  name: 'sponser-member-add-edit',
  data() {
    return {
      sponserId: null,
      allStudies: [],
      sponser: {
        companyName: '',
        status: '',
        logo: null,
      },
      selectedStudy: null,
      managedStudies: '',
      roles: [
        { name: 'Study Admin', value: 'StudyAdmin' },
        { name: 'Platform Admin', value: 'SystemAdmin' },
        { name: 'Sponsor', value: 'Sponsor' },
      ],
    };
  },
  mounted() {
    this.sponserId = this.$route.params.sponserId;
    if (this.sponserId !== 0) {
      this.getSponserDetails(this.sponserId);
    }
  },
  methods: {
    studySelected(study) {
      this.user.studies.push(study);
      // if (this.user.studies) {
      //   this.user.studies.push(study);
      // }
    },
    goToAllSponsers() {
      this.$router.push({ name: 'sponsers' });
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      this.sponser.logo = new window.Image();
      const reader = new window.FileReader();
      const vm = this;
      reader.onload = e => {
        vm.sponser.logo = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    getSponserDetails(sponserId) {
      this.$api.getUserDataFact(sponserId).then(
        response => {
          this.sponser = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting sponser details.',
          );
        },
      );
    },
    saveSponserInfo(sponserId, sponserObj) {
      if (this.sponserId === 0) {
        this.$api.addNewUserInfoFact(sponserObj).then(
          () => {
            toastr.success('sponser added succesfully');
            this.$router.push({ name: 'sponser-added' });
          },
          error => {
            toastr.error(
              error.body && error.body.message ? error.body.message : 'Error while adding sponser.',
            );
          },
        );
      } else {
        this.$api.updateUserInfoFact(sponserId, sponserObj).then(
          () => {
            toastr.success('sponser updated succesfully');
            this.$router.push({ name: 'sponsers' });
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while updating sponser.',
            );
          },
        );
      }
    },

    sendInvite(sponserId, sponserObj) {
      this.$api.updateUserInfoFact(sponserId, sponserObj).then(
        () => {
          toastr.success('Resent invite succesfully');
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while resending invite.',
          );
        },
      );
    },
  },
  components: { mainHeader, Copyright },
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
h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
}

h3 {
  padding-bottom: 60px;
  color: black;
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
  background-color: #00bae0;
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
