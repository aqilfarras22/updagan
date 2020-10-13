<template>
  <div class="studies_bg">
    <mainheader></mainheader>
    <div class="container pt-10">
      <div class="row has-header pb-20">
        <div class="col-xs-6 col-sm-9 col-md-10 col-lg-10">
          <span class="profile color_ff">Profile</span>
        </div>
        <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2 pt-20 text-right">
          <button class="editProfile color_ff" v-if="!editMode" v-on:click="editProfile()">Edit profile</button>
        </div>
      </div>
      <div class="contents white-bg pt-10">
        <div class="row pt-10">
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-height">
            <p>Name</p>
            <input class="editableText pb-50" :disabled="!editMode" v-if="!editMode" :value="`${user.firstName} ${user.lastName}`">
            <div v-if="editMode">
              <span>First name :</span> <input type="text" name="firstName" v-validate="'required'" class="fullName" :class="{'input': true, 'is-danger': errors.has('firstName'), 'is-success': !errors.has('firstName') }"
                v-model="user.firstName">
              <span v-if="!user.firstName" class="error-style display-block">first name is required field</span>
            </div>
            <div v-if="editMode">
              <span>Last name : </span><input type="text" name="lastName" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('lastName'), 'is-success': !errors.has('lastName') }"
                class="fullName" v-model="user.lastName">
              <span v-if="!user.lastName" class="error-style display-block">last name is required field</span>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-height" v-if="user.userRole !== 'Pi'">
            <p>Company</p>
            <input class="editableText pb-50" v-model="user.client.name" disabled v-if="!editMode">
            <input class="editableText pb-50 disableText" v-model="user.client.name" disabled v-if='editMode'>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-height">
            <p>Email</p>
            <input class="editableText pb-50" v-model="user.username" disabled v-if="!editMode">
            <input class="editableText pb-50 disableText" v-model="user.username" disabled v-if='editMode'>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-height">
            <p>Role &nbsp; <i class="fa fa-question-circle help_icon" aria-hidden="true" data-toggle="popover" tabindex="0"
                data-trigger="focus" data-content=" 1.Platform Admin <br> 2.Study admin " data-html="true"></i></span>
            </p>
            <input class="editableText pb-50 " v-model="user.userRoleUI" disabled v-if="!editMode">
            <input class="editableText pb-50 disableText" v-model="user.userRoleUI" disabled v-if='editMode'>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-height">
            <p>Mobile Number</p>
            <span :class="{'input-display': !editMode }">
              <vue-tel-input class="p-0" @onInput="onInputUserPhone" ref="userPhoneNumber"></vue-tel-input>
              <span v-if="user.phoneNumber && user.phoneNumber.length > 0 && !validMobile" class="error-style">Phone number is invalid</span>
            </span>
            <input class="editableText" :disabled="!editMode" v-model="user.phoneNumber" v-if="!editMode">
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <p>Work Number</p>
            <span :class="{'input-display': !editMode }">
              <vue-tel-input class="p-0" @onInput="onInputWorkNumber" ref="userWorkNumber"></vue-tel-input>
              <span v-if="user.workNumber && user.workNumber.length > 0 && !validWork" class="error-style">Work number is invalid</span>
            </span>
            <input class="editableText" type="text" v-if="!editMode" :disabled="!editMode" v-model="user.workNumber">
          </div>
        </div>
        <div class="row pt-10">
          <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12 card-height">
            <p>Profile avatar</p>
            <div class="row">
              <span class="">
                  <img  class="img-responsive img-circle " :src="altImage" alt="profile" width="90px" height="90px" v-if="profileImage === null">
                  <img  class="img-responsive img-circle " :src="profileImage" alt="profile" width="90px" height="90px" v-if="profileImage !== null" >
                </span>
              <span class="pl-30" v-if="editMode">
                  <div class="file-upload" >
                    <input type="file" id="avatarImage" class="file-input" @change="onFileChange($event)"><span class="fs-12">Upload</span>
            </div>
            </span>
            <span class="pl-30" v-if="editMode">
                  <a class="removepic" v-if="removePhotoToggle" v-on:click="removePhoto()">Remove photo</a>
                </span>
          </div>
        </div>
      </div>
      <div class="contents pl-30 pr-30 pt-30 pb-30 white-bg" v-if="editMode">
        <div class="row text-center pad-top20">
          <button type="button" class="btn btn-md cancel-btn mr-10" v-on:click="cancelProfile"> Cancel</button>
          <button type="button" class="btn btn-md save-btn" v-on:click="updateProfileSave(user)"> Save </button>
        </div>
      </div>
      <div class="row text-right pb-10" v-if="!editMode">
        <a class="ml-10 mr-10 pb-10 text-dec" v-on:click="showChangePassword()">Change password</a>
      </div>
      <div class="contents pl-30 pr-30 white-bg bt-1" v-if="changePassword">
        <div class="row pt-20">
          <p class="mb-5 pl-30">Password requirments:</p>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <ul class="validation-list">
              <li>minimum 8 characters
                <span v-if='showIcon'>
                    <i v-if='minValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!minValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span>
              </li>
              <li>at least 1 uppercase letter
                <span v-if='showIcon'>
                    <i v-if='upperValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!upperValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span>
              </li>
              <li>at least 1 lowercase character
                <span v-if='showIcon'>
                    <i v-if='lowerValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!lowerValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span>
              </li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <ul class="validation-list">
              <li>at least 1 number
                <span v-if='showIcon'>
                    <i v-if='numberValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!numberValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span>
              </li>
              <li>at least 1 symbol (e.g @#$%)
                <span v-if='showIcon'>
                    <i v-if='specialValid' class="fa fa-check-circle icon-valid" aria-hidden="true"></i>
                    <i v-if='!specialValid' class="fa fa-times-circle icon-invalid" aria-hidden="true"></i>
                  </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="row pb-20 pt-20">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <input class="form-control" type="password" placeholder="Enter old password" v-model="password.oldPassword">
            <span class="removepic fs-12">{{this.msgOld}}</span>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <input class="form-control" type="password" placeholder="Enter new password" v-model="password.newPassword" v-on:keyup="validNewPassword(password.newPassword)">
            <span class="removepic fs-12" v-if="msgMatch">New passwords do not match</span>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <input class="form-control" type="password" placeholder="Re-Enter new password" :disabled="confirmPasswordInput" v-on:keyup="validConfirmPassword(confirmPassword)"
              v-model="confirmPassword">
          </div>
        </div>
        <div class="row pb-30 pt-30" v-if="changePasswordToggle">
          <div class="text-center pad-top20">
            <button type="button" class="btn btn-md cancel-btn" v-on:click="cancelPassword"> Cancel</button>
            <button type="button" class="btn btn-md save-btn" v-on:click="updatePassword(password)" :disabled="disableChangePassword">Change Password</button>
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
    <div id="avatarUpdate" role="dialog" class="modal fade in" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content p-20 pl-30 pr-30">
          <div class="row text-center pt-30 pb-20">
            <span class="editAvtar">Edit avatar</span>
          </div>
          <div class="row">
            <center>
              <!-- <img class="img-responsive text-center" :src="profileImage" alt="Chania" width="150px" height="150px"> -->
              <vue-cropper ref='cropper' :guides="true" drag-mode="move" :view-mode="3" :minContainerHeight="180" :minContainerWidth="180"
                :minCanvasHeight="180" :minCanvasWidth="180" :img="profileImage" :cropBoxResizable="false" :minCropBoxWidth="150"
                :minCropBoxHeight="150" :zoomable="false" :imgStyle="imgStyle" alt="Source Image" class="vue-cropper">
              </vue-cropper>
            </center>
          </div>
          <div class="row text-center pt-20 pb-10">
            <button type="button" class="btn btn-md save-btn primaryBgColor ml-20" v-on:click="resizeImage(profileImage)"> Save </button>
          </div>
          <div class="row text-center pt-10 pb-20">
            <button type="button" class="btn btn-md cancel-btn ml-20" v-on:click="cancelAvatar"> Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VueCropper from 'vue-cropperjs';
import MainHeader from '../common/main-header';
import Copyright from '../common/copyright';
import swal from 'sweetalert2';

export default {
  name: 'Profile',
  components: {
    VueCropper,
    mainheader: MainHeader,
    Copyright,
  },
  data() {
    return {
      validMobile: false,
      validWork: false,
      removePhotoToggle: true,
      changePasswordToggle: true,
      disableChangePassword: true,
      profileImage: null,
      profileData: {},
      user: {
        firstName: '',
        lastName: '',
        username: '',
        userRole: '',
        userRoleUI: '',
        phoneNumber: '',
        workNumber: '',
        profileImage: null,
        client: {
          name: '',
        },
      },
      altImage: '/static/img/profile.png',
      password: {
        oldPassword: '',
        newPassword: '',
      },
      confirmPassword: '',
      showIcon: false,
      minValid: false,
      upperValid: false,
      numberValid: false,
      lowerValid: false,
      specialValid: false,
      changePassword: false,
      editMode: false,
      msgMatch: false,
      msgOld: '',
      confirmPasswordInput: true,
      changePasswordInput: false,
      imgStyle: {
        width: '180px',
        height: '180px',
      },
    };
  },
  mounted() {
    window.$('[data-toggle="popover"]').popover();
    this.id = this.$route.params.id;
    this.$api.getProfileDetails(this.id).then(
      response => {
        this.user = response.body;
        if (this.user.phoneNumber) {
          this.$refs.userPhoneNumber.phone = this.user.phoneNumber;
          this.validMobile = true;
        }
        if (this.user.workNumber) {
          this.$refs.userWorkNumber.phone = this.user.workNumber;
          this.validWork = true;
        }
        if (!this.user.client) {
          this.user.client = {
            name: '',
          };
        }        
        if (this.user.profileImage) {
          this.profileImage = this.user.profileImage;
        }
        if (this.user.userRole === 'SystemAdmin') {
          this.user.userRoleUI = 'Platform Admin';
        }
        else if(this.user.userRole === 'StudyAdmin') {
          this.user.userRoleUI = 'Study Admin';
        }
        else if(this.user.userRole === 'Cra') {
          this.user.userRoleUI = 'Clinical Research Associate';
        }
        else if(this.user.userRole === 'Dm') {
          this.user.userRoleUI = 'Data Management';
        }
        else if(this.user.userRole === 'Pi') {
          this.user.userRoleUI = 'Principal Investigator';
        }
        else if(this.user.userRole === 'SubPi') {
          this.user.userRoleUI = 'Sub-Investigator';
        }
        else if(this.user.userRole === 'StudyCoordinator') {
          this.user.userRoleUI = 'Study Coordinator';
        }
        else if(this.user.userRole === 'Quality') {
          this.user.userRoleUI = 'Quality';
        }
        else if(this.user.userRole === 'HomeHealth') {
          this.user.userRoleUI = 'Home Health';
        }
        else if(this.user.userRole === 'SiteDataLock') {
          this.user.userRoleUI = 'Site - Data Lock';
        }
      },
      error => {
        this.errorMsg = error.body && error.body.message
          ? error.body.message
          : 'Error while getting the profile details';
        this.$toastr.error(this.errorMsg);
      },
    );
  },
  methods: {
    ...mapActions(['userUpdate']),
    validMobileNumber(mobileNumber) {
      const mobPattern = new RegExp('^\\+[0-9]{1,3}[0-9]{10,14}(?:x.+)?$');
      if (mobPattern.test(mobileNumber)) {
        this.validMobile = false;
      } else {
        this.validMobile = true;
      }
    },
    editProfile() {
      this.editMode = true;
      this.changePassword = false;
    },
    onInputUserPhone({ number, isValid, country }) {
      window.console.log(number, isValid, country);
      this.validMobile = isValid;
      this.user.phoneNumber = number.replace(/\s/g, '');
    },
    onInputWorkNumber({ number, isValid, country }) {
      window.console.log(country);
      this.validWork = isValid;
      this.user.workNumber = number.replace(/\s/g, '');
    },
    validWorkNumber(workNumber) {
      const workPattern = new RegExp('^\\+[0-9]{1,3}[0-9]{10,14}(?:x.+)?$');
      if (workPattern.test(workNumber)) {
        this.validWork = false;
      } else {
        this.validWork = true;
      }
    },
    showChangePassword() {
      this.changePasswordToggle = true;
      this.changePassword = true;
      this.editMode = false;
    },
    removePhoto() {
      this.profileImage = null;
      this.removePhotoToggle = false;
    },
    validNewPassword(password) {
      this.disableChangePassword = true;
      this.confirmPassword = '';
      this.confirmPasswordInput = true;
      this.showIcon = true;
      this.lowerValid = false;
      this.upperValid = false;
      this.valid = false;
      this.specialValid = false;
      this.numberValid = false;
      const lowerPattern = new RegExp('^(?=.*[a-z]).+$');
      const upperPattern = new RegExp('^(?=.*[A-Z]).+$');
      const numberPattern = new RegExp('^(?=.*[0-9]).+$');
      const specialPattern = new RegExp('(?=.*[@#$%!^&+=_W]).+$'); // eslint-disable-line
      // empty password check
      if (password === '') {
        this.showIcon = false;
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
        this.numberValid = true;
      }
      if (specialPattern.test(password)) {
        this.specialValid = true;
      }
      if (
        this.minValid
        && this.lowerValid
        && this.upperValid
        && this.numberValid
        && this.specialValid
      ) {
        this.confirmPasswordInput = false;
      }
    },
    validConfirmPassword(password) {
      this.disableChangePassword = true;
      if (password !== this.password.newPassword) {
        this.msgMatch = true;
      } else {
        this.disableChangePassword = false;
        this.changePasswordInput = true;
        this.msgMatch = false;
      }
    },
    cancelPassword() {
      this.changePasswordToggle = true;
      this.password.oldPassword = '';
      this.password.newPassword = '';
      this.confirmPassword = '';
      this.showIcon = false;
      this.confirmPasswordInput = false;
      this.changePasswordInput = false;
      this.changePassword = true;
      this.msgMatch = false;
      this.msgOld = '';
    },
    updatePassword(password) {
      if (this.changePasswordInput && this.msgMatch === false) {
        this.$api.updatePasswordDetails(this.id, password).then(
          response => {
            if (response.body.success) {
              this.changePassword = false;
              this.password.oldPassword = '';
              this.password.newPassword = '';
              this.confirmPassword = '';
              this.$toastr.success(response.body.message);
            } else {
              this.msgOld = response.body.message;
            }
          },
          error => {
            this.msgOld = error.body && error.body.message
              ? error.body.message
              : 'Error while updating the password';
            this.errorMsg = this.msgOld;
            if (error.body && error.body.status && error.body.status === 401) {
              this.$toastr.error(this.errorMsg);
            }
          },
        );
      } else if (this.password.oldPassword === '') {
        this.changePasswordInput = false;
      } else if (
        this.password.newPassword !== this.confirmPassword
        || this.password.newPassword === ''
        || this.confirmPassword === ''
      ) {
        this.msgMatch = true;
      } else {
        this.msgMatch = false;
        this.msgOld = '';
      }
    },
    cancelProfile() {
      swal({
        title: 'Are you sure you want to cancel?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$api.getProfileDetails(this.id).then(
            response => {
              this.user = response.body;
              if (this.user.profileImage) {
                this.profileImage = this.user.profileImage;
              }
              this.editMode = false;
            },
            error => {
              this.user.firstName = '';
              this.user.lastName = '';
              this.user.phoneNumber = '';
              this.user.workNumber = '';
              this.user.profileImage = null;
              const { message = 'Error while getting the profile details' } = (error && error.body) || {};
              this.errorMsg = message;
              this.$toastr.error(this.errorMsg);
              this.edit = false;
            },
          );
        }
      });
    },
    updateProfileSave() {
      this.user.profileImage = this.profileImage;
      this.$api.editProfileDetails(this.id, this.user).then(
        profile => {
          this.profileData = profile;
          this.userUpdate(profile);
          this.$toastr.success('Profile is updated');
          this.editMode = false;
        },
        error => {
          const { message = 'Error while updating the profile' } = (error && error.body) || {};
          this.errorMsg = message;
          this.$toastr.error(this.errorMsg);
        },
      );
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      window.$('#avatarUpdate').modal('show');
      this.createImage(files[0]);
    },
    createImage(file) {
      this.profileImage = new window.Image();
      const reader = new window.FileReader();
      const vm = this;
      reader.onload = e => {
        vm.profileImage = e.target.result;
        this.$refs.cropper.replace(e.target.result);
      };
      reader.readAsDataURL(file);
      window.document.getElementById('avatarImage').value = null;
    },
    resizeImage() {
      this.removePhotoToggle = true;
      this.profileImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
      window.$('#avatarUpdate').modal('hide');
    },
    cancelAvatar() {
      if (this.user.profileImage) {
        this.profileImage = this.user.profileImage;
      } else {
        this.profileImage = null;
      }
      window.document.getElementById('avatarImage').value = null;
      window.$('#avatarUpdate').modal('hide');
    },
  },
};
</script>

<style scoped lang="scss">
.studies_bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  /*color: #fff;*/
  background-color: #34537d;
  background-blend-mode: soft-light;
}
.profile {
  font-size: 35px;
  line-height: 1.87;
  // color: #ffffff;
  font-weight: lighter;
  // font-family: Roboto !important;
}
.input-display {
  display: none;
}
/deep/ .col {
  padding: 0px !important;
}
.card-height {
  height: 150px;
}
.editProfile {
  padding: 10px 30px 10px 30px;
  border-radius: 100px;
  border: none;
  background-color: #2d3752;
}
.contents {
  margin-left: 19px;
  margin-right: 19px;
  color: #959fa4;
}
.white-bg {
  background: #fff;
}
.editableText {
  background-color: white;
  border: 0px !important;
  width: 100%;
  word-break: break-all !important;
  border-top: 1px solid #eeeeee !important;
  font-weight: 300;
  font-size: 18px;
  color: #888 !important;
}
.editableText:focus {
  outline: 0px solid transparent;
}
.disableText {
  opacity: 0.5 !important;
}
.emptyText {
  font-size: 18px;
  opacity: 0.8 !important;
}
.fullName {
  background-color: white;
  border: 0px !important;
  color: #888 !important;
  word-break: break-all;
  font-weight: 300;
  font-size: 20px;
}
.fullName:focus {
  outline: 0px solid transparent;
}
.changePassword {
  padding: 8px 30px 8px 30px;
  border-radius: 100px;
  background-color: #51dd75;
  color: white;
  border: none;
}
ul.validation-list li {
  list-style-type: disc !important;
  padding-bottom: 5px;
  font-size: 14px;
  font-weight: normal;
}
.icon-invalid {
  color: red;
}
.icon-valid {
  color: limegreen;
}
.cancel-btn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #959fa4;
  color: #fff;
}
.save-btn {
  padding: 0px 5px 0px 5px;
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #51dd75;
  color: #fff;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}
img {
  display: inline;
}
.removepic {
  border: none;
  color: red;
  font-size: 17px;
}
.editAvtar {
  font-size: 20px;
  color: #1f95f2;
}
.saveAvatar {
  border: none;
  border-radius: 100px;
  padding: 10px 120px 10px 120px;
  background-color: #1f95f2;
}
.cancelAvatar {
  color: #959fa4;
}
.vue-cropper {
  display: inline !important;
  width: 180px !important;
  height: 180px !important;
}
.delete {
  padding-left: 20px;
  border-left: 1px solid;
  color: #4b8bf2;
}
.bottom_footer {
  position: relative;
  bottom: 0px;
  width: 100%;
  padding-top: 20px;
  color: #fff;
  clear: both;
}
.font-size10 {
  font-size: 10px;
  margin: 0px !important;
}
button {
  cursor: pointer;
}
button:focus {
  outline: 0px solid transparent;
}
a {
  cursor: pointer;
}
.text-right {
  text-align: right;
}
.text-dec {
  text-decoration: underline;
  color: #888;
}

@media (min-width: 168px) and (max-width: 991px) {
  .container-width {
    width: 100% !important;
  }
}
.primaryBgColor {
  background-color: #1e8fe1;
}
</style>
