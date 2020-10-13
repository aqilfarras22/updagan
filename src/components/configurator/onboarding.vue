<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20">
        <div class="pt-25 m-0 fs-16 color_slate-grey fw-500">
          This will be some of the first bits of messaging your participants will see prior to registering or logging in.
          <p>
            This quickly gives them some critical pieces of information about the study and the app.</p>
          </p>
        </div>

        <h2 class="header_title pt-5">Study Description</h2>
        <p>Give a one
          <span class="color_blue cursor_pointer" data-toggle="modal" data-target="#descriptionModal">line description</span>          for your study.</p>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="ex. An Asthma Research Study, Brought to you by Company." v-model="study.description">
        </div>
        <h2 class="header_title pt-30">Informational screens</h2>
        <p class="fs-14 m-0">Add a screen in the
          <span class="color_blue cursor_pointer" data-toggle="modal" data-target="#welcomeCarouselModal">welcome carousel</span>          to provide some information about the study or app.</p>
        <p class="fs-12 color_grey"> Min. 1 screen, max. 4 screens.</p>
        <draggable v-model="screens" :options="{ disabled: draggable }" @start="drag=true" @end="drag=false" @change="onDrag()">
          <div class="" v-for="(screen, count) in screens">
            <div class="card read_only_screen" v-if="screen.index !== selectedScreen.index">
              <div class="row">
                <div class="col-lg-11 col-md-11 col-sm-10 col-xs-10 p-0">
                  <h5 class="font-style" v-if="count === 0">First Screen</h5>
                  <h5 class="font-style" v-if="count === 1">Second Screen</h5>
                  <h5 class="font-style" v-if="count === 2">Third Screen</h5>
                  <h5 class="font-style" v-if="count === 3">Fourth Screen</h5>
                  <h5 class="header-style">{{screen.title}}</h5>
                  <span v-html="screen.content"></span>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 pr-0" style="float:right;">
                  <button class="btn btn-block edit-btn mt-30" v-on:click="editScreen(screen)">Edit</button>
                </div>
              </div>
            </div>
            <div class="card edit_only_screen" v-if="screen.index === selectedScreen.index">
              <h5 class="font-style" v-if="count === 0">First Screen</h5>
              <h5 class="font-style" v-if="count === 1">Second Screen</h5>
              <h5 class="font-style" v-if="count === 2">Third Screen</h5>
              <h5 class="font-style" v-if="count === 3">Fourth Screen</h5>
              <p class="font_bold">Screen Title</p>
              <div class="form-group">
                <input type="text" class="form-control" v-model="selectedScreen.title" placeholder="ex. About This Study, Who is Running This Study, How This Study Works"
                />
              </div>
              <p class="font_bold">Screen Content</p>
              <div>
                <quill-editor @change="onEditorChange($event)" class="bg-white" ref="myTextEditor" v-model="selectedScreen.content" :options="editorOption">
                </quill-editor>
              </div>
              <div class="row pt-20">
                <div class="col-sm-6 p-0">
                  <button class="btn btn-link pb-15 color_red pl-0 pr-0" v-if="selectedScreen.id" v-on:click="deleteScreen(screen)">Delete</button>
                </div>
                <div class="col-sm-6 p-0 text-right">
                  <button class="btn btn-link pb-15 color_grey" v-on:click="cancelScreen()">Cancel</button>
                  <button class="btn btn-success save_btn mb-10" :disabled= "saveScreenDisabled" v-on:click="saveScreen(selectedScreen)">Save</button>
                </div>
              </div>
            </div>
          </div>
        </draggable>
        <button type="button" class="btn btn-md mb-20 button-blue-1 add-btn" v-on:click="addNewScreen()" v-if="(screens.length < 4)"
          :class="{'disabled-btn': selectedScreen.index}">Add another screen</button>
        <div class="row" v-if="showActivation">
          <div class="col-md-8 col-sm-8 col-xs-12 p-0">
            <h2>Activation code</h2>
            <div class="pr-10">Your participants will be asked for the activation code that was sent to their email along with the invitation.</div>
          </div>
          <div class="col-md-4 col-sm-4 col-xs-12 p-0">
            <div class="misplaced-card">
              <div class="color_blue">
                <div class="p-10">
                  <span class="pr-10">
                    <i class="fa fa-key" aria-hidden="true"></i>
                  </span>Misplaced activation code</div>
              </div>
              <div class="p-10">If your participant misplaces or loses his/her code, a study admin will have to re-invite the participant and
                they will receive a new activation code.</div>
            </div>
          </div>
        </div>
        <div class="pb-10">
          <span class="back_link" v-on:click="goBack()">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back</span>
        </div>
      </div>
    </div>
    <div id="descriptionModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header border-none p-0">
            <button type="button" class="close close pr-24 pt-20" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 text-right text-center-xs p-0">
                <img src="static/img/onboarding/graphic-one-line-descript.svg" alt="" class="img-size-line">
              </div>
              <div class="col-lg-7 col-md-7 col-sm-7 col-xs-12 text-justify text-center-xs pt-10-xs pt-120 fs-12 color_slate-grey fw-500">
                <div>This is where you would give a short one line description of your study. Typically, this tells your participants
                  what type of study you are conducting and the institution conducting the study. </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="welcomeCarouselModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header border-none p-0">
            <button type="button" class="close close pr-24 pt-20" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 text-right text-center-xs p-0">
                <img src="static/img/onboarding/graphic-carousel.svg" alt="" class="img-size-welcome">
              </div>
              <div class="col-lg-7 col-md-7 col-sm-7 col-xs-12 text-justify text-center-xs pt-10-xs pt-80 fs-12 color_slate-grey fw-500">
                <div>The welcome carousel gives you the opportunity to present study or app details before registration or sign
                  in. </div>
                <div class="pt-10"> Topics could include, “what this study is about,” “how this study works,” or “who is running this study.”</div>
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
          <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
        </div>
      </div>
    </div>
    <CancelModal
      ref="cancelConfirmation"
    />
  </div>
</template>

<script>
import toastr from 'toastr';
import _ from 'lodash';
import swal from 'sweetalert2';
import draggable from 'vuedraggable';
import studyFeatureHeader from '../common/study-features-header';
import CancelModal from './cancel-modify-modal';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default {
  name: 'onboarding',
  data() {
    return {
      study: { description: '' },
      studyData: null,
      studyId: null,
      draggable: false,
      isMulticonsent: true,
      screens: [
        {
          id: '',
          index: 1,
          type: 'informationScreen',
          title: '',
          content: '',
        },
      ],
      selectedScreen: {
        id: '',
        index: 1,
        type: 'informationScreen',
        title: '',
        content: '',
      },
      typeListActive: [
        'Phase 1 clinical trail',
        'Phase 2 clinical trail',
        'Phase 3 clinical trail',
      ],
      typeListNotActive: [
        'Phase 4 observation study',
        'Registry',
        'Patient community',
        'Pilot project',
      ],
      showActivation: null,
      editorOption: {
        placeholder: 'Enter content for your screen topic',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
      },
      imageTypeError: true,
      isStudySummary: JSON.parse(window.localStorage.getItem('thread-studySummary')),
      appLangaScript: "window.initApplanga = function() {        if(typeof window.ApplangaNative !== 'undefined') {  window.ApplangaNative.loadScript();        } else { setTimeout(window.initApplanga, 180); }    }; window.initApplanga();",
      saveScreenDisabled: false,
    };
  },
  components: {
    studyFeatureHeader,
    draggable,
    CancelModal,
  },
  mounted() {
    window.scrollTo(0, 0);
    this.studyId = this.$route.params.studyId;
    this.getStudyDetails();
    this.getOnboardingDetails();
    this.isMultipleConsentEnabled();
  },
  methods: {
    onEditorChange(event) {
      var elem= document.createElement("div");
      elem.innerHTML = event.html;
      var images = elem.getElementsByTagName("img");
      this.imageTypeError = false;
      for(var i=0; i < images.length; i++){
        const [imageType, baseUrl] = images[i].src.split(';');
        const [str, type] = imageType.split('/');
        if(type.toLowerCase() != 'png') {
          this.imageTypeError = true;
          break;
        }
      }
    },
    isMultipleConsentEnabled() {
      // console.log('inside isMultipleConsentEnabled');

      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          this.toggleFeatures = response.body.studyFeatures;
          this.toggleFeatures.forEach(feature => {
            if (feature.featureKey === 'ECONSENT' && feature.enabled === true) {
              this.isMulticonsent = false;
            }
          });
        },
        error => {
          this.$toastr.error(error.body && error.body.message ?
            error.body.message : 'Error while getting features.');
        },
      );
    },
    goBack() {
      window.history.back();
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
          this.showActivation = this.studyData.onboardingType.toLowerCase() === 'byinvitation';
        },
        error => {
          const err = error.body && error.body.message
            ? error.body.message
            : 'Error while getting the study details';
          toastr.error(err);
        },
      );
    },
    getOnboardingDetails() {
      this.$api.getOnboardingFact(this.studyId).then(
        response => {
          if (response.body) {
            this.study.description = response.body.description || '';
            if (response.body.screens.length !== 0) {
              this.screens = response.body.screens;
              this.selectedScreen = {};
              this.draggable = false;
            } else {
              this.draggable = true;
            }
          }
        },
        () => {
          this.draggable = true;
        },
      );
    },
    saveScreen(originalScreen) {
      const screen = { ...originalScreen };
      nprogress.start();
      this.saveScreenDisabled = true;
      if (screen.title && screen.title.trim() && screen.content && screen.content.trim()) {
        this.onEditorChange({html: screen.content})
        if(this.imageTypeError) {
          toastr.error('Uploaded image format not supported. Please upload a PNG file.');
          this.saveScreenDisabled = false;
          nprogress.done();
          return;
        }
        if (!screen.id) {
          screen.type = 'informationScreen'; // eslint-disable-line
          screen.content = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
            screen.content
          }</body></html>`;          
          this.$api.postWelcomeScreenFact(this.studyId, screen).then(
            response => {
              const introScreenIndex = _.findIndex(this.screens, ['index', response.body.index]);
              this.screens.splice(introScreenIndex, 1, response.body);
              this.selectedScreen = {};
              this.draggable = false;
              toastr.success('Welcome screen added succesfully');
              nprogress.done();
              this.saveScreenDisabled = false;
            },
            error => {
              const err = error.body && error.body.message
                ? error.body.message
                : 'Error while saving the data';
              toastr.error(err);
              nprogress.done();
              this.saveScreenDisabled = false;
            },
          );
        } else {
          if (screen.content.indexOf('<html><head>') < 0) {
            screen.content = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">
              ${screen.content}</body></html>`;
          }
          this.$api.updateWelcomeScreenFact(this.studyId, screen.id, screen).then(
            response => {
              const introScreenIndex = _.findIndex(this.screens, ['index', response.body.index]);
              this.screens.splice(introScreenIndex, 1, response.body);
              this.selectedScreen = {};
              this.draggable = false;
              toastr.success('Welcome screen updated succesfully');
              nprogress.done();
              this.saveScreenDisabled = false;
            },
            error => {
              const err = error.body && error.body.message
                ? error.body.message
                : 'Error while saving the data';
              toastr.error(err);
              nprogress.done();
              this.saveScreenDisabled = false;
            },
          );
        }
      } else {
        toastr.error('Please fill all the fields');
        nprogress.done();
        this.saveScreenDisabled = false;
      }
    },
    onDrag() {
      this.screens.forEach((item, index) => {
        //eslint-disable-line
        this.screens[index].index = index + 1;
      });
      this.$api.updateWelcomeScreenOrderFact(this.studyId, this.screens).then(
        () => {},
        error => {
          const err = error.body && error.body.message ? error.body.message : 'Error while saving the data';
          toastr.error(err);
        },
      );
    },
    getIndexForNewScreen() {
      const highestValObj = _.maxBy(this.screens, o => o.index);
      return highestValObj && highestValObj.index ? highestValObj.index + 1 : 1;
    },
    addNewScreen() {
      this.removeEmptyScreen();
      this.selectedScreen = {
        id: '',
        index: this.getIndexForNewScreen(),
        title: '',
        content: '',
      };
      this.screens.push(this.selectedScreen);
      this.draggable = true;
    },
    deleteScreen(screen) {
      swal({
        title: 'Are you sure you want to delete?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$api.deleteWelcomeScreenFact(this.studyId, screen.id).then(
            () => {
              const introScreenIndex = _.findIndex(this.screens, ['id', screen.id]);
              this.screens.splice(introScreenIndex, 1);
              this.selectedScreen = {};
              this.draggable = false;
              toastr.success('Welcome screen deleted succesfully');
            },
            error => {
              const err = error.body && error.body.message
                ? error.body.message
                : 'Error while deleting the welcome screen';
              toastr.error(err);
            },
          );
        }
      });
    },
    cancelScreen() {
      this.removeEmptyScreen();
      if (this.selectedScreen.id) {
        const introScreenIndex = _.findIndex(this.screens, ['index', this.selectedScreen.index]);
        this.screens.splice(introScreenIndex, 1, this.screens[introScreenIndex]);
      }
      this.selectedScreen = {};
      this.draggable = false;
    },
    removeEmptyScreen() {
      const tempScreens = _.cloneDeep(this.screens);
      _.forEach(tempScreens, (s, index) => {
        if (s.id === '') {
          this.screens.splice(index, 1);
        }
      });
    },
    editScreen(screen) {
      this.draggable = true;
      this.removeEmptyScreen();
      this.selectedScreen = _.cloneDeep(screen);
      this.selectedScreen.content = this.selectedScreen.content.replace(this.appLangaScript,'');
    },
    nextClick() {
      if (this.selectedScreen.id || this.selectedScreen.title) {
        toastr.error('Please save or cancel your changes to continue.');
      } else if (
        this.study.description
        && this.study.description.trim()
        && this.screens.length > 0
      ) {
        let screensIsValid = true;
        this.screens.forEach(({ title }) => {
          if (!(title && title.trim())) screensIsValid = false;
        });
        if (screensIsValid) {
          this.$api.postStudyOnboardingFact(this.studyId, this.study).then(
            () => {
              toastr.success('Data saved succesfully');
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
            error => {
              const err = error.body && error.body.message
                ? error.body.message
                : 'Error while saving the data';
              toastr.error(err);
            },
          );
        } else {
          toastr.error('Please add informational screens');
        }
      } else {
        toastr.error('Please add study description and informational screens');
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
    convertdigitToString(num) {
      let a = ['','First ','Second ','Third ','Fourth ', 'Fifth ','Sixth ','Seventh ','Eight ','Ninth ','Tenth ','Eleventh ','Twelveth ','Thirteenth ','Fourteenth ','Fifteenth ','Sixteenth ','Seventeenth ','Eighteenth ','Nineteenth '];
      let b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
      if ((num = num.toString()).length > 9) return 'overflow';
       let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Screen ' : '';        
        if (num === '8') {
          return 'Eighth Screen'
        } else if (num === '20') {          
          return 'Twentieth Screen'
        } else if (num === '30') {
          return 'Thirtieth Screen'
        } else if (num === '40') {
          return 'Fortieth Screen'
        } else if (num === '50') {
          return 'Fiftieth Screen'
        } else if (num === '60') {
          return 'Sixtieth Screen'
        } else if (num === '70') {
          return 'Seventieth Screen'
        } else if (num === '80') {
          return 'Eightieth Screen'
        } else if (num === '90') {
          return 'Ninetieth Screen'
        } else if (num === '100') {
          return 'Hundredth Screen'
        } else {
          return str;
        }        
    },
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
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

.color_959fa4 {
  color: #959fa4 !important;
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
  .col-md-12 {
    width: 100%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-2 {
    width: 16.66666667%;
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
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.swal2-confirm {
  display: inline !important;
  width: 90px !important;
}

.swal2-cancel {
  display: block !important;
  width: 90px !important;
}

.bg-color {
  background-color: #f5f8fa;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.read_only_screen {
  border-left: 8px solid #d3dfe4 !important;
  p {
    img {
      max-width: 120px !important;
    }
  }
}
.disabled-btn {
  pointer-events: none;
  opacity: 0.5;
}
.edit_only_screen {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.navbar-style {
  background: linear-gradient(to left, #7478e6, #09b9e0);
}


.form-control {
  border-radius: 2px !important;
}
p {
  word-break: break-all;
}
.btn {
  border-radius: 25px;
}

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin: 10px 0px 20px 0px;
}

.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
  font-size: 14px;
}

.header-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
}

.button-blue-1 {
  border: 1px solid#1f95f2;
  color: #1f95f2;
  background: transparent;
}

.add-btn {
  border: 1px solid#f06559;
  color: #f06559;
  font-size: 14px;
  min-width: 150px;
}

.save_btn {
  width: 100px;
}

.misplaced-card {
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}

.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}

.img-size-line {
  height: 320px;
  width: 200px;
}

.img-size-welcome {
  height: 320px;
  width: 175px;
}

.text-justify{
  text-align: justify;
}
</style>
