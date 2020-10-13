<template>
  <div class="bg-color">
    <studyHeader></studyHeader>
    <div class="container">
      <div class="has-header has-footer">
        <div class="container-style">
          <div class="row launch_status_section pl-0 pr-0-xs">
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-4">
              <img src="static/img/blast.svg" class="blast-img-style">
              <img class="rocket-img-style" src="static/img/rocket.svg">
            </div>
            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <div class="color_ff fs-24 fw-bold">When is the big day?</div>
              <div
                class="color_ff fs-14"
              >When would you like your study app to be available in the App Store/Play Store?</div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 p-0 pt-10">
              <div class="row">
                <div class="form-group">
                  <datepicker
                    v-model="appAvailabilityDate"
                    :disabledDates="disabledDates"
                    input-class="form-control"
                    placeholder="Select"
                    v-on:selected="saveAppAvailability()"
                  ></datepicker>
                  <span class="cal-icon-style">
                    <i class="fa fa-calendar-o" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="fs-24 fw-bold study-color">Study app description</div>
          </div>
          <div class="card" v-if="editMode && description">
            <div class="row">
              <div class="col-lg-11 col-md-11 col-sm-10 col-xs-8 p-0">
                <div class="pb-15" v-html="description"></div>
              </div>
              <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0 text-right">
                <button
                  class="btn btn-default edit_btn"
                  v-on:click="editMode = false"
                  :disabled="!editMode"
                >Edit</button>
              </div>
            </div>
          </div>
          <div class="card" v-if="!editMode || !description">
            <p class="font_bold">Provide a brief description of the study app for your participants.</p>
            <quill-editor
              class="bg-white"
              ref="myTextEditor"
              :options="editorOption"
              v-model="description"
            ></quill-editor>
            <a
              class="row color_1f95f2 pt-10"
              target="_blank"
              href="https://developer.apple.com/app-store/product-page/"
            >Tips on how to write a great app description</a>
            <div class="row pt-10">
              <div class="text-right">
                <button
                  class="btn btn-link pb-15 color_grey"
                  v-on:click="cancelAppDescription()"
                >Cancel</button>
                <button
                  class="btn btn-success save_btn mb-10 br-25"
                  v-on:click="saveAppDescription(description)"
                >Save</button>
              </div>
            </div>
          </div>
          <div class="row pb-20">
            Both the App Store and the Play Store have their respective categories that allow for grouping of similar apps. We’ve went
            ahead and selected the appropriate categories for your app, as well as keywords that will help in search.
          </div>
          <div class="row pb-10">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 pl-30 pl-0-xs pr-0-xs">
              <div class="box-style">
                <div class="fs-18 font_bold pb-10">
                  <img src="static/img/graphic-app-store.svg" class="img-style"> App Store
                </div>
                <div class>
                  <span class="font_bold">Categories:</span>
                  <li>Medical (primary)</li>
                  <li>Health & Fitness (secondary)</li>
                </div>
                <div class="pt-10">
                  <span class="font_bold">Keywords:</span>
                </div>
                <div class>
                  <span>
                    ResearchKit, Clinical research, Mobile health study, [condition
                    types pulled from study questionnaire]
                  </span>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 pr-30 pl-0-xs pr-0-xs pt-10-xs">
              <div class="box-style">
                <div class="fs-18 font_bold pb-10">
                  <img src="static/img/graphic-play-store.svg" class="img-style"> Play Store
                </div>
                <div class>
                  <span class="font_bold">Categories:</span>
                  <li>Medical (primary)</li>
                  <li>Health & Fitness (secondary)</li>
                </div>
                <div class="pt-10">
                  <span class="font_bold">Keywords:</span>
                </div>
                <div class>
                  <span>
                    ResearchKit, Clinical research, Mobile health study, [condition
                    types pulled from study questionnaire]
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="fs-24 fw-bold pt-20">Legal</div>
          <div
            class
          >Please double check your study app’s copyright, privacy policy, and license information.</div>
          <div v-if="licenses.privacyPolicy">
            <div class="fs-24 fw-bold pt-20">Privacy policy</div>
            <div class="card p-15">
              <div class="row">
                <div
                  class="col-lg-11 col-md-10 col-sm-9 col-xs-8 p-0"
                  v-html="licenses.privacyPolicy"
                ></div>
                <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-0 text-right">
                  <button class="edit-btn ml-10" v-on:click="editPrivacyPolicy()">Edit</button>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-20" v-if="licenses.license">
            <h3 class="fs-24 fw-bold">License Information</h3>
            <!-- <textarea class="form-control" rows="12" v-model="licenses.license" disabled></textarea> -->
            <div class="license_info" v-html="licenses.license"></div>
          </div>
          <div class="pt-20" v-if="licenses.eproLicense != null && licenses.eproLicense.length > 0">
            <h3 class="fs-24 fw-bold">EPRO License Information</h3>
            <div class="card" v-for="epro in licenses.eproLicense" disabled>
              <div class="pb-5 fw-500">{{epro.title}}</div>
              <div class>
                <div class="title_header color_959fa4 pt-5">Author</div>
                <div>{{epro.author}}</div>
              </div>
              <div>
                <div class="title_header color_959fa4 pt-5">Copyright</div>
                <div>{{epro.copyright}}</div>
              </div>
            </div>
          </div>
          <div class="pb-20" v-if="licenses.copyright">
            <h3 class="fs-24 fw-bold pt-20">Copyright</h3>
            <div class="form-control" disabled>&copy; {{currentYear}} {{licenses.copyright}}</div>
          </div>
          <!--<div class="fs-24 fw-bold pt-20"> Marketing </div>
          <div class="">
            Do you have a marketing website for this remote participant research?
          </div>
          <div class="row pt-10 pb-20">
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 p-0">
              <button class="btn btn-style mr-10" v-on:click="changeMarketingWebSiteStatus(true)" :class="{ 'selectedbtn' : (marketingWebsite === true) }">Yes</button>
              <button class="btn btn-style mr-10" v-on:click="changeMarketingWebSiteStatus(false)" :class="{ 'selectedbtn' : (marketingWebsite === false) }">No</button>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-6 col-xs-12 pt-10-xs" v-if="marketingWebsite">
              <form class="form-inline">
                <span>You may enter the website URL (optional):</span>
                <input type="text" class="form-control br-2" v-model="websiteUrl" placeholder="http://">
              </form>
            </div>
          </div>
          <div class="row" v-if="marketingWebsite === false">
            <div class="pb-10">
              Would you like THREAD to contact you about providing a marketing website for your mobile study?
            </div>
            <button class="btn btn-style mr-10" v-on:click="changeThreadContactPreference(true)" :class="{ 'selectedbtn' : (threadSupport === true) }">Yes</button>
            <button class="btn btn-style mr-10" v-on:click="changeThreadContactPreference(false)" :class="{ 'selectedbtn' : (threadSupport === false) }">No</button>
          </div>-->
          <div class="footerStyle">
            <div class="container">
              <div class="row">
                <button class="btn doneBtn br-25 width-230" v-on:click="nextClick()">Submit app for THREAD review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from 'toastr';
import Datepicker from 'vuejs-datepicker';
import studyHeader from '../../common/study-header';

export default {
  name: 'launch',
  data() {
    return {
      studyId: null,
      description: '',
      disabledDates: {},
      appAvailabilityDate: null,
      licenses: {
        privacyPolicy: '',
        license: '',
        copyright: '',
        eproLicense: [
          {
            title: '',
            author: '',
            copyright: '',
          },
        ],
      },
      marketingWebsite: null,
      threadSupport: null,
      websiteUrl: null,
      descriptionOrginal: '',
      editMode: false,
      editorOption: {
        placeholder: 'Enter text here.',
        modules: { toolbar: [['bold', 'italic', 'underline']] },
      },
      isMultipleConsent: true,
    };
  },
  components: {
    studyHeader,
    datepicker: Datepicker,
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.isMultipleConsentEnabled();
  },
  watch: {},
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    isMultipleConsentEnabled() {
      const that = this;
      that.$api.getToggleFeaturesFact(that.studyId).then(
        response => {
          that.toggleFeatures = response.body.studyFeatures;
          const isEconsent = that.toggleFeatures.filter(
            x => x.featureKey == 'ECONSENT', // eslint-disable-line
          );
          if ((isEconsent == null || isEconsent == undefined || isEconsent == '') && isEconsent.length == 0) { // eslint-disable-line {
            that.isMultipleConsent = true;
          } else {
            that.isMultipleConsent = false;
          }
          that.getAllDetailsForLaunch();
        },
        error => {
          that.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting features.', // eslint-disable-line
          );
          that.getAllDetailsForLaunch();
        },
      );
    },
    getAllDetailsForLaunch() {
      const that = this;
      that.getDescription(that.studyId);
      that.getDocumentSection(that.studyId);
      that.getAppAvailability(that.studyId);
      const d = new Date();
      d.setDate(d.getDate() - 1);
      that.disabledDates = { to: d };
    },
    saveAppAvailability() {
      setTimeout(() => {
        const obj = new Date(this.appAvailabilityDate).toUTCString();
        this.$api
          .saveAppAvailabilityFact(this.studyId, { availabilityDate: obj })
          .then(
            () => {
              this.availabilityDateOrginal = this.appAvailabilityDate;
              toastr.success('App Availability Date added successfully');
            },
            error => {
              this.appAvailabilityDate = this.availabilityDateOrginal;
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while adding app description', // eslint-disable-line
              );
            },
          );
      }, 10);
    },
    editPrivacyPolicy() {
      if (this.isMultipleConsent) {
        this.$router.push({
          name: 'multieconsent',
          params: { studyId: this.studyId },
        }); // eslint-disable-line
      } else {
        this.$router.push({
          name: 'econsent',
          params: { studyId: this.studyId },
        }); // eslint-disable-line
      }
    },
    getMarketingData(studyId) {
      this.$api.getMarketingDataFact(studyId).then(
        response => {
          this.marketingWebsite = response.body.marketingWebsite;
          this.threadSupport = response.body.threadSupport;
          this.websiteUrl = response.body.websiteUrl;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while adding app description', // eslint-disable-line
          );
        },
      );
    },
    getDescription(studyId) {
      this.$api.getAppDescriptionFact(studyId).then(
        response => {
          this.description = response.body.description;
          if (this.description) {
            this.descriptionOrginal = this.description;
            this.editMode = true;
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while adding app description', // eslint-disable-line
          );
        },
      );
    },
    getAppAvailability(studyId) {
      this.$api.getAppAvailabilityFact(studyId).then(
        response => {
          if (response.body.availabilityDate) {
            this.appAvailabilityDate = response.body.availabilityDate;
            this.availabilityDateOrginal = this.appAvailabilityDate;
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while adding app description', // eslint-disable-line
          );
        },
      );
    },
    getDocumentSection(studyId) {
      if (!this.isMultipleConsent) {
        this.$api.documentSectionFact(studyId).then(
          response => {
            this.licenses = response.body;
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while adding app description', // eslint-disable-line
            );
          },
        );
      } else {
        this.$api.getLaunchPageFact(studyId).then(
          response => {
            this.licenses = response.body;
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while adding app description', // eslint-disable-line
            );
          },
        );
      }
    },
    cancelAppDescription() {
      if (this.descriptionOrginal) {
        this.description = this.descriptionOrginal;
        this.editMode = true;
      } else {
        this.description = '';
      }
    },
    changeMarketingWebSiteStatus(val) {
      this.marketingWebsite = val;
    },
    changeThreadContactPreference(val) {
      this.threadSupport = val;
    },
    saveAppDescription(description) {
      if (description) {
        this.$api.saveAppDescriptionFact(this.studyId, { description }).then(
          () => {
            this.descriptionOrginal = description;
            this.editMode = true;
            toastr.success('App description added succesfully');
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while adding app description', // eslint-disable-line
            );
          },
        );
      } else {
        toastr.error("Please enter your study app's description."); //eslint-disable-line
      }
    },
    saveMarketingData() {
      const obj = {
        marketingWebsite: this.marketingWebsite,
        websiteUrl: this.websiteUrl,
        threadSupport: this.threadSupport,
      }; // eslint-disable-line

      this.$api.saveMarketingDataFact(this.studyId, obj).then(
        () => {
          this.$router.push({
            name: 'manage',
            params: { studyId: this.studyId },
          }); // eslint-disable-line
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while sending data to server', // eslint-disable-line
          );
        },
      );
    },
    nextClick() {
      if (!this.description) {
        toastr.error('Please enter your study apps description.');
      } else if (!this.appAvailabilityDate) {
        toastr.error('Please select your app availability date.');
      } else {
        const data = { expectedLaunchDate: this.appAvailabilityDate };
        // call api to lauch the study once the app settings are done
        this.$api.postStudyLaunchFact(this.studyId, data).then(
          () => {
            this.$router.push({ name: 'manage', params: { studyId: this.studyId } });
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while sending lauch request.',
            );
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)
.width-230 {
  width: 230px !important;
  max-width: 230px !important;
}

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
    content: "";
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

.bg-color {
  background-color: #f5f8fa;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
}
.study-color {
  color: #666769 !important;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  padding: 40px 20px 20px 20px;
}
.launch_status_section {
  background-color: #2d3752;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  /*background-image: linear-gradient(97deg, #698eff, #15befd 49%, #8efbce);*/
  padding: 28px;
  margin-bottom: 20px;
  border-radius: 3px;
}
.rocket-img-style {
  width: 50px;
  position: absolute;
  top: -48px;
  left: 19px;
}
.blast-img-style {
  width: 100px;
  position: absolute;
  bottom: -86px;
  left: 0px;
}
.cal-icon-style {
  position: absolute;
  top: 16px;
  right: 15px;
  cursor: pointer;
  color: #959fa4;
  pointer-events: none;
}
.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 20px;
  margin: 10px 0px 20px 0px;
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  box-shadow: none;
}
.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.save_btn {
  width: 100px;
}
.box-style {
  border-radius: 3px;
  border: solid 1px #d3dfe4;
  padding: 15px 20px;
}
.img-style {
  width: 30px;
}
.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
}
.btn-style {
  border-radius: 100px;
  border: solid 1px #f16559;
  width: 100px;
  background-color: #ffffff !important;
  color: #f16559;
}
.selectedbtn {
  background-color: #f16559 !important;
  color: #ffffff;
}
.edit_btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.license_info {
  background-color: #eee;
  padding: 12px;
  border-radius: 2px;
  border: 1px solid #ccc;
}
</style>
