<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20">
        <div class="pt-30">
          <p class="m-0 fs-16 fw-500 header_title">Please setup your study branding preferences. This branding will apply to all participant-facing applications.
          </p>
          <!--<p class="m-0 fs-14">Remember, you’ll always be able to tap on the lower left corner icon to preview your study.</p>-->
        </div>
        <div class="row pt-20">
          <div class="col-lg-5 col-md-5 pl-0">
            <div class="header_title">Name</div>
            <p class="pt-15">What is your study name?</p>
            <input type="text" v-on:keyup="validStudyName(study.name)" name="study-name" :class="{'input': true, 'is-danger': errors.has('study-name'), 'is-success': !errors.has('study-name') }"
              class="form-control" v-model="study.name" placeholder="Enter study name" required>
            <span v-if="validStudyNameValue" class="error-style">Study name cannot start and/or end with a space.</span>
            <span v-if="study.name && study.name.length > 50" class="error-style">Study name cannot exceed 50 characters in length</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-5 col-md-5 pl-0">
            <p class="pt-15">What is the name of your app?
              <span class="color_blue cursor_pointer" data-toggle="modal" data-target="#appNameModal"><i class="fa fa-info-circle color_grey" aria-hidden="true"></i></span>
            </p>
            <input type="text" v-on:keyup="validAppName(study.appName)" name="app-name" :class="{'input': true, 'is-danger': errors.has('app-name'), 'is-success': !errors.has('app-name') }"
              class="form-control" v-model="study.appName" placeholder="Enter your app name" required>
            <div v-if="validAppNameValue" class="error-style">App Name cannot include special characters and exceed 30 characters in length</div>
            <div class="error-style" v-if="(study.appName && study.appName.length > 12) && (study.appName && study.appName.length < 30)">Your app name might be cut short on phone screen due to it's length. Please consider keeping it short, preferably
              under 12 characters</div>
          </div>
          <!--<div class="col-lg-1 col-md-1"></div>
          <div class="col-lg-5 col-md-5 pl-0">
            <p class="pt-15">Choose a condensed app name for <span class="color_blue cursor-pointer" data-toggle="modal" data-target="#appNameModal">phone home screens</span></p>
            <input type="text" v-validate="{ rules: { regex: /^[a-zA-Z]{1}[a-zA-Z0-9 _]{0,10}[a-zA-Z0-9]{1}$/} }" name="condensedAppName"
              :class="{'input': true, 'is-danger': errors.has('condensedAppName'), 'is-success': !errors.has('condensedAppName') }"
              class="form-control" v-model="study.condensedAppName" placeholder="Enter a condensed app name" required>
            <span v-show="errors.has('condensedAppName')" class="error-style">Condensed App Name should not have more than 12 characters, cannot have special character and should start with an alphabet</span>
          </div>-->
        </div>

        <div class="header_title pt-40">Logo and icon</div>
        <div class="row">
          <div class="col-lg-6 col-md-5 pl-0">
            <p class="pt-15 fs-16 mb-5">Upload your study logo</p>
            <div v-if="study.logoUrl">
              <img class="img-responsive study_logo" :src="study.logoUrl">
              <div class="color_red pt-10 cursor_pointer" v-on:click="removeLogo()">Remove</div>
            </div>
            <div class="file-upload">
              <input type="file" class="file-input" id="logo_upload" accept="image/*" v-on:change="onFileLogo($event);return false;">
              <span class="fs-12 color_grey">Upload</span>
            </div>
            <span class="pr-10 pl-10">or</span>
            
            <button class="selectLibrary" data-toggle="modal" data-target="#myModal" v-on:click="getBrandingLogos(1)"><span class="fs-12 color_grey">Select from a library</span></button>

            <div class="recommend fw-500">Recommended 870px by 345px
              <div>Formats: .png</div>
            </div>
          </div>
          <div class="col-lg-5 col-md-5 pl-0">
            <p class="pt-15 fs-16 mb-5">Upload an image to use as your study app icon <span class="color_blue cursor_pointer" data-toggle="modal" data-target="#appIconModal"><i class="fa fa-info-circle color_grey" aria-hidden="true"></i> </span></p>
            <div v-if="study.iconUrl">
              <img class="img-responsive study_logo" :src="study.iconUrl">
              <div class="color_red pt-10 cursor_pointer" v-on:click="removeIcon()">Remove</div>
            </div>
            <div class="file-upload">
              <input type="file" class="file-input" id="icon_upload" accept="image/*" v-on:change="onFileIcon($event);return false;">
              <span class="fs-12 color_grey">Upload</span>
            </div>
            <span class="pr-10 pl-10">or</span>
            <button class="selectLibrary" data-toggle="modal" data-target="#myModal" v-on:click="getBrandingIcons(1)"><span class="fs-12 color_grey">Select from a library</span></button>
            <div class="recommend fw-500">Recommended 1024px by 1024px
              <div>Formats: .png</div>
            </div>
          </div>
        </div>

        <div class="header_title pt-40">Color palette</div>
        <div class="row pb-50">
          <div class="col-lg-6 col-md-5 col-sm-10 col-xs-10 pl-0">
            <div class="pt-15">Choose a primary color for your app</div>
            <div class="fs-12 color_grey">We recommend a darker color</div>
            <div class="row pt-10">
              <div class="col-lg-1 col-md-1 col-xs-2 col-sm-1 dropdown pl-0">
                <div class="dropdown-toggle darkColorDiv" data-toggle="dropdown">
                </div>
                <div class="dropdown-menu color-picker-section" v-on:click.stop.prevent="">
                  <sketch-picker v-model="darkColor"></sketch-picker>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-xs-8 col-sm-7 pl-0">
                <input type="text" v-model="primaryColor" class="form-control" placeholder="Enter hex value" v-on:blur="changeColor('primary')">
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-5 col-sm-10 col-xs-10 pl-0">
            <div class="pt-15">Choose a secondary color for your app</div>
            <div class="fs-12 color_grey">We recommend a lighter color</div>
            <div class="row pt-10">
              <div class="col-lg-1 col-md-1 col-xs-2 col-sm-1 dropdown pl-0">
                <div class="dropdown-toggle lightColorDiv" data-toggle="dropdown">
                </div>
                <div class="dropdown-menu color-picker-section" v-on:click.stop.prevent="">
                  <sketch-picker v-model="lightColor"></sketch-picker>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-xs-8 col-sm-7 pl-0">
                <input type="text" v-model="secondaryColor" class="form-control" placeholder="Enter hex value" v-on:blur="changeColor('secondary')">
              </div>
            </div>
          </div>
        </div>
        <div id="myModal" class="modal fade" role="dialog" data-backdrop="static">
          <div class="modal-dialog">
            <div class="modal-content modal_custom col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-30 pb-30 pr-30 pl-30" v-if="modal === 'logo'">
              <div class="row">
                <div class="fs-28 modal_header_color fw-200">Logo Library</div>
                <a class="cancelImage cursor_pointer" v-on:click="cancelImages"><i class="fa fa-times" aria-hidden="true"></i></a>
              </div>
              <p class="modal_desc">Don’t have a logo? Don’t worry, we got you covered.</p>
              <div class="row pt-20">
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0" v-for="(i, index) in logos" v-on:click="selectLogo(i,  index)">
                  <div class="library_img_bg" :class="{'selected_icon_logo_image' : i.name === selectedLogo.name}">
                    <img class="img-responsive logo" :src="i.preSignedURL">
                  </div>
                </div>
                <div v-if="!logos || logos.length === 0">No logos present</div>
              </div>
              <div class="row text-center pt-20" v-if="totalPages > 1">
                <span class="paginate" v-if="currentPage !== 1" v-on:click="getBrandingLogos(currentPage - 1)"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                <span class="paginate" :class="{active: currentPage === pageIndex + 1 }" v-for="(page, pageIndex) in totalPages" v-on:click="getBrandingLogos(pageIndex + 1)">{{pageIndex + 1}}</span>
                <span class="paginate" v-if="currentPage !== totalPages" v-on:click="getBrandingLogos(currentPage + 1)"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
              </div>
              <div class="row pt-40 pb-10 text-center">
                <button class="btn btn-info btn-block text-center color_ff br-25 library_add_btn" v-on:click="addImage()" :disabled="!selectedLogo || !selectedLogo.preSignedURL">Add</button>
              </div>
              <!--<div class="row text-center pt-10">
                <a class="cancelImage cursor-pointer" v-on:click="cancelImages">Close</a>
              </div>-->
            </div>
            <div class="modal-content modal_custom col-lg-12 col-md-12 col-sm-12 col-xs-12  pt-30 pb-30 pr-30 pl-30" v-if="modal === 'icon'">
              <div class="row">
                <div class="fs-28 modal_header_color fw-200">App Icon Library</div>
                <a class="cancelImage cursor_pointer" v-on:click="cancelImages"><i class="fa fa-times" aria-hidden="true"></i></a>
              </div>
              <p class="modal_desc">Don’t have a Icon? Don’t worry, we got you covered.</p>
              <div class="row pt-20">
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0" v-if="icons && icons.length > 0" v-for="(i, index) in icons" v-on:click="selectIcon(i, index)">
                  <div class="library_img_bg" :class="{'selected_icon_logo_image' : i.name === selectedIcon.name}">
                    <img class="img-responsive logo" :src="i.preSignedURL">
                  </div>
                </div>
                <div v-if="!icons || icons.length === 0">No icons present</div>
              </div>
              <div class="row text-center pt-20" v-if="totalPages > 1">
                <span class="paginate" v-if="currentPage !== 1" v-on:click="getBrandingIcons(currentPage - 1)"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                <span class="paginate" :class="{active: currentPage === pageIndex + 1 }" v-for="(page, pageIndex) in totalPages" v-on:click="getBrandingIcons(pageIndex + 1)">{{pageIndex + 1}}</span>
                <span class="paginate" v-if="currentPage !== totalPages" v-on:click="getBrandingIcons(currentPage + 1)"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
              </div>
              <div class="row pt-40 pb-10 text-center">
                <button class="btn btn-info btn-block text-center color_ff br-25 library_add_btn" v-on:click="addImage()" :disabled="!selectedIcon || !selectedIcon.preSignedURL">Add</button>
              </div>
              <!--<div class="row text-center pt-10">
                <a class="cancelImage cursor-pointer" v-on:click="cancelImages">Close</a>
              </div>-->
            </div>
          </div>
        </div>
        <div id="appNameModal" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header border-none">
                <button type="button" class="close modal_close_icon" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 p-0 ml-30 mb-30">
                    <div class="text-center">
                      <img src="static/img/branding/graphic-app-name.svg" alt="" class="img_size_app">
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-left text-center-xs pl-0 pr-0 pt-60 pt-10-xs fs-12 fw-500">
                    <div class="modal_content">Your app name needs to be condensed so it can fit under the app icon on the device home screen. </div>
                    <div class="modal_content pt-10"> Depending on which characters you use, the limit is between 10 and 12 characters, including spaces.</div>
                    <div class="modal_content">
                      <div class="mt-10">
                        Character limit:
                      </div>
                      30 characters
                    </diV>
                    <div class="modal_content">
                      <div class="mt-10">
                        Characters that are not accepted:
                      </div>
                      ! ¡ “ # $ % ‘ ( ) * + , \ - . / : ;
                      <=> ¿ ? @ [ \ ] ^ _ ` { | }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="appIconModal" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header border-none">
                <button type="button" class="close modal_close_icon" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 p-0 ml-30 mb-30">
                    <div class="text-center">
                      <img src="static/img/branding/graphic-app-icon.svg" alt="" class="img_size_icon">
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-left text-center-xs pt-60 pt-10-xs fs-14">
                    <div class="modal_content">The app icon is needed to identify your application on the home screen of the device.This is usually
                      a simple graphical icon that may be a condensed version of your logo. </div>
                    <div class="modal_content pt-10"> We recommend not trying to fit your study and/or app name into the icon, because it will be displayed
                      below the app icon.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row" v-if="isStudySummary">
              <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
              <b-btn class="btn br-25 disable-btn p-0 pt-5 mr-10" :to="{ name: 'study-summary', params: { studyId: studyId } }">Back to study summary</b-btn>
              <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
            </div>
            <div class="row" v-if="!isStudySummary">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" :disabled="validAppNameValue || validStudyNameValue" v-on:click="nextClick()">Save and Continue</button>
            </div>
          </div>
        </div>
        <CancelModal
          ref="cancelConfirmation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import toastr from 'toastr';
import { Sketch } from 'vue-color';
import studyFeatureHeader from '../common/study-features-header';
import CancelModal from './cancel-modify-modal';

export default {
  name: 'branding',
  data() {
    return {
      study: {
        name: '',
        appName: '',
        condensedAppName: '',
        colorPrimary: '',
        colorSecondary: '',
        iconUrl: '',
        logoUrl: '',
      },
      validAppNameValue: false,
      validStudyNameValue: false,
      primaryColor: '',
      secondaryColor: '',
      selectedFeatures: [],
      studyId: null,
      darkColor: { hex: '#FFFFFF' },
      lightColor: { hex: '#FFFFFF' },
      images: [],
      modal: '',
      totalPages: 1,
      currentPage: 1,
      icons: [],
      logos: [],
      selectedIconIndex: null,
      selectedLogoIndex: null,
      selectedLogo: '',
      selectedIcon: '',
      isStudySummary: JSON.parse(window.localStorage.getItem('thread-studySummary')),
    };
  },
  computed: {},
  watch: {
    lightColor: {
      handler(val) {
        this.changeSecondaryColor(val);
      },
    },
    darkColor: {
      handler(val) {
        this.changePrimaryColor(val);
      },
    },
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.getBrandingDetails();
    this.getBrandingIcons(1);
    this.getBrandingLogos(1);
  },
  methods: {
    getBrandingDetails() {
      this.$api.getBrandingDetailsFact(this.studyId).then(response => {
        this.study = response.body;
        this.darkColor.hex = this.study.colorPrimary || '#FFFFFF';
        this.lightColor.hex = this.study.colorSecondary || '#000000';
        this.changePrimaryColor(this.darkColor);
        this.changeSecondaryColor(this.lightColor);
      });
    },
    validAppName(appNameVal) {
      const appPattern = new RegExp('^[a-zA-Z]{1}[a-zA-Z0-9 ]{0,28}[a-zA-Z0-9]{1}$');
      if (appPattern.test(appNameVal)) {
        this.validAppNameValue = false;
      } else {
        this.validAppNameValue = true;
      }
    },
    validStudyName(studyNameVal) {
      const studyPattern = new RegExp(
        '^[a-zA-Z]{1}[ a-zA-Z0-9®!@#$%^&{}*)(+=.?_-]{0,48}[a-zA-Z0-9®!@#$%^&{}*)(+=.?_-]{1}$',
      );
      if (studyPattern.test(studyNameVal)) {
        this.validStudyNameValue = false;
      } else {
        this.validStudyNameValue = true;
      }
    },
    getBrandingIcons(pageNumber) {
      this.modal = 'icon';
      this.currentPage = pageNumber;
      this.$api.getBrandingIconsFact(pageNumber).then(response => {
        this.icons = response.body.icons;
        this.totalPages = response.body.totalPages;
      });
    },
    getBrandingLogos(pageNumber) {
      this.modal = 'logo';
      this.currentPage = pageNumber;
      this.$api.getBrandingLogosFact(pageNumber).then(response => {
        this.logos = response.body.icons;
        this.totalPages = response.body.totalPages;
      });
    },
    changeColor(type) {
      if (type === 'primary') {
        if (/(^#[0-9A-F]{6}$)/i.test(this.primaryColor)) {
          this.darkColor.hex = this.primaryColor;
          window.$('.darkColorDiv').css('background-color', this.primaryColor);
        } else {
          toastr.error('Please enter a valid hash code for color');
        }
      } else if (type === 'secondary') {
        if (/(^#[0-9A-F]{6}$)/i.test(this.secondaryColor)) {
          this.lightColor.hex = this.secondaryColor;
          window.$('.lightColorDiv').css('background-color', this.secondaryColor);
        } else {
          toastr.error('Please enter a valid hash code for color');
        }
      }
    },
    changePrimaryColor(val) {
      this.darkColor = val;
      this.primaryColor = val.hex;
      window.$('.darkColorDiv').css('background-color', this.darkColor.hex);
    },
    changeSecondaryColor(val) {
      this.lightColor = val;
      this.secondaryColor = val.hex;
      window.$('.lightColorDiv').css('background-color', this.lightColor.hex);
    },
    validateImage(image) {
      var isValid = image.name.match(/.(png)$/i)
      return isValid;
    },
    onFileLogo(event) {
      const fd = new FormData();
      const input = window.document.getElementById('logo_upload');
      if(input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error('Uploaded image format not supported. Please upload a PNG file.');
        event.target.value = null;
        return;
      }
      fd.append('file', input.files[0]);
      fd.append('type', 'logo');
      this.$api.postStudyLogoFact(this.studyId, fd).then(
        response => {
          this.study.logoUrl = response.body;
          toastr.success('Logo uploaded succesfully');
          window.$('#logo_upload[type="file"]').val(null);
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while uploading the logo',
          );
        },
      );
    },
    onFileIcon() {
      const fd = new FormData();
      const input = window.document.getElementById('icon_upload');
      if(input.files[0] && !this.validateImage(input.files[0])) {
        toastr.error('Uploaded image format not supported. Please upload a PNG file.');
        return;
      }
      fd.append('file', input.files[0]);
      fd.append('type', 'icon');
      this.$api.postStudyIconFact(this.studyId, fd).then(
        response => {
          this.study.iconUrl = response.body;
          toastr.success('Icon uploaded succesfully');
          window.$('#icon_upload[type="file"]').val(null);
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while uploading the icon',
          );
        },
      );
    },
    removeLogo() {
      if (!this.selectedLogoIndex) {
        this.$api.deleteStudyLogoFact(this.studyId, 'logo').then(
          () => {
            this.study.logoUrl = '';
            toastr.success('Logo deleted succesfully');
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while deleting the logo',
            );
          },
        );
      } else {
        this.selectedLogoIndex = null;
        this.study.logoUrl = null;
      }
    },
    removeIcon() {
      if (!this.selectedIconIndex) {
        this.$api.deleteStudyIconFact(this.studyId, 'icon').then(
          () => {
            this.study.iconUrl = '';
            toastr.success('Icon deleted succesfully');
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while deleting the icon',
            );
          },
        );
      } else {
        this.selectedIconIndex = null;
        this.study.iconUrl = null;
      }
    },
    selectLogo(page) {
      this.selectedLogo = {};
      this.selectedLogo = page;
    },
    selectIcon(page) {
      this.selectedIcon = {};
      this.selectedIcon = page;
    },
    addImage() {
      if (this.modal === 'icon') {
        this.$api.uploadIconFromLibraryFact(this.studyId, this.selectedIcon).then(
          response => {
            this.study.iconUrl = response.body;
            this.selectedIcon = {};
            toastr.success('Icon added succesfully');
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while deleting the icon',
            );
          },
        );
      } else {
        this.$api.uploadLogoFromLibraryFact(this.studyId, this.selectedLogo).then(
          response => {
            this.study.logoUrl = response.body;
            this.selectedLogo = {};
            toastr.success('Logo added succesfully');
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while deleting the icon',
            );
          },
        );
      }
      this.modal = '';
      window.$('#myModal').modal('hide');
      // this.selectedIconIndex = null;
      // this.selectedLogoIndex = null;
      // this.selectedIcon = '';
      // this.selectedLogo = '';
    },
    cancelImages() {
      this.modal = '';
      window.$('#myModal').modal('hide');
      this.selectedIcon = {};
      this.selectedLogo = {};
    },
    nextClick() {
      if (
        this.study.name
        && this.study.name.length <= 50
        && this.study.appName
        && this.study.appName.length <= 30
      ) {
        // eslint-disable-line
        if (this.study.logoUrl && this.study.iconUrl) {
          this.study.colorPrimary = this.darkColor.hex;
          this.study.colorSecondary = this.lightColor.hex;
          if (
            this.study.colorPrimary
            && this.study.colorSecondary
            && this.study.name
            && this.study.appName
          ) {
            // eslint-disable-line
            if (
              /(^#[0-9A-F]{6}$)/i.test(this.primaryColor)
              && /(^#[0-9A-F]{6}$)/i.test(this.secondaryColor)
            ) {
              // eslint-disable-line
              this.$api.postStudyMetaInfoFact(this.studyId, this.study).then(
                response => {
                  const selectedFeatures = this.$store.getters.getSelectedFeatures;
                  const featureIndex = _.findIndex(selectedFeatures, ['route', this.$route.name]);
                  if (response.body.warning) {
                    toastr.warning(response.body.warning).attr('style', 'max-width: 800px !important');
                  }
                  if (featureIndex === selectedFeatures.length - 1) {
                    this.$router.push({ name: 'features-library-final' });
                  } else {
                    this.$router.push({
                      name: selectedFeatures[featureIndex + 1].route,
                      params: { studyId: this.studyId },
                    }); // eslint-disable-line
                  }
                },
                error => {
                  toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : 'Error while sending the information',
                  );
                },
              );
            } else {
              toastr.error('Please select/enter valid colors');
            }
          } else {
            toastr.error('Please fill all the fields, along with proper colors');
          }
        } else if (!this.study.logoUrl || this.study.logoUrl == "") {
          // eslint-disable-line
          toastr.error('Study logo is required');
        } else if (!this.study.iconUrl) {
          toastr.error('Study icon is required');
        }
      } else if (!this.study.name || !this.study.appName) {
        toastr.error('Study name and app name cannot be empty');
      } else if (this.study.name.length > 30 || this.study.appName.length > 30) {
        toastr.error('Study name, app name cannot be have more than 30 characters');
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, ['route', this.$route.name]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: 'features-library-final' });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId },
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    },
  },
  components: { 'sketch-picker': Sketch, studyFeatureHeader, CancelModal },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

// Style for quick fixes bootstrap after migration (before redesign should be removed)

body{
  color: #333;
}

.h2, h2 {
    font-size: 30px;
    margin: 20px 0 10px;
}

.h3, h3{
  font-size:24px;
  color: #333;
}

.h4, h4 {
    font-size: 18px;
    margin: 10px 0;
}

.h5, h5 {
    font-size: 14px;
    margin: 10px 0;
}

.h6, h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn{
  font-size: 14px;
}

.col-xs-12 {
    width: 100%;
}

.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
    float: left;
    display: block;
}

.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
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
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}

.row{
  display: block;

  &:after{
  content: '';
    clear: both;
    display: block;
  }
}

.color_959fa4{
  color: #959fa4 !important;
}

@media (min-width: 768px){
  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
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
  .col-md-2{
    flex: none;
  }
}


@media (min-width: 992px){
  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
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

@media (min-width: 1200px){
  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {
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

.dropdown-toggle.darkColorDiv,
.dropdown-toggle.lightColorDiv{
  text-align: center;
  &:after{
    display: none;
  }
}

@media (min-width: 768px){
  .modal-dialog {
      max-width: 600px;
      margin: 30px auto;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.modal_content {
  color: #666769;
  font-weight: 500;
}
.modal_close_icon {
  cursor: pointer;
  font-size: 24px;
}
.color_grey {
  color: #838e93;
}
.form-control {
  border-radius: 2px !important;
  height: 38px;
}
.study_logo {
  width: auto;
  height: 100%;
  max-height: 80px;
}
.paginate {
  color: grey;
  font-size: 14px;
  background-color: white;
  margin: 0px 8px 0px 0px;
  padding: 8px 5px 8px 5px;
  display: inline-block;
  cursor: pointer;
}
.active {
  color: #4c8ce4;
  font-size: 14px;
  font-weight: bolder;
}
.library_img_bg {
  display: -webkit-inline-box;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  max-width: 200px;
  max-height: 80px;
  min-height: 70px;
  width: 98%;
  padding: 10px;
  text-align: -webkit-center;
  .logo {
    width: auto;
    margin: auto;
    height: 45px;
  }
  .icon {
    max-width: 50px;
    max-height: 50px;
    margin: auto;
  }
}
.recommend {
  color: #959fa4;
  padding-top: 10px;
  font-size: 12px;
}
.modal_header_color {
  color: #28406a;
}
.modal_desc {
  color: #535456;
}
.modal_custom {
  border-radius: 4px;
  padding: 16px;
}
.color-picker-section {
  top: -200px;
}
.lightColorDiv {
  border: 1px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  width: 40px;
  height: 38px;
  margin-right: 5px;
}
.darkColorDiv {
  border: 1px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  width: 40px;
  height: 38px;
}
.selectLibrary {
  border-radius: 3px;
  background-color: #d3dfe4;
  padding: 5px 10px;
  overflow: hidden;
  border: none;
}
.library_add_btn {
  max-width: 300px;
  margin: auto;
  height: 38px;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
  img {
    -webkit-filter: brightness(0) invert(1);
    filter: brightness(0) invert(1);
  }
}
.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
}
button {
  cursor: pointer;
  border: none !important;
  outline: 0px solid !important;
}
button:focus {
  outline: 0px solid transparent;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}
.img_size_app {
  height: 320px;
  width: auto;
  max-width: 200px;
}
.img_size_icon {
  height: 280px;
  width: 100%;
  max-width: 400px;
}

</style>
