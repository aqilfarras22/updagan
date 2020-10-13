<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyReviewHeader></studyReviewHeader>
      <div class="pl-20 pr-20">
        <div class="row pb-100" v-if="!preview">
          <h2 class="pt-10">Generate a prototype of the study for your mobile device</h2>
          <p class="pt-10 m-0">Experience the study app as your participants will.</p>
          <p
            class="m-0"
          >Select your mobile phone operating system below to receive an email and text message with your installation link.</p>
          <p class="m-0">Any Apple Watch configurations are included in the iOS prototype.</p>
          <div class="row mt-20 mb-10">
            <button
              class="btn generate-btn pl-20 pr-20 mr-10"
              :disabled="studyData && !studyData.ios"
              v-bind:class="{ active: ios }"
              v-on:click="toggleIos()"
            >
              <img src="static/img/generate-prototype/apple-logo.svg" class="pr-10" v-if="!ios" />
              <img src="static/img/generate-prototype/apple-logo-red.svg" class="pr-10" v-if="ios" />
              Generate iOS prototype
            </button>
            <button
              class="btn generate-btn"
              :disabled="studyData && !studyData.android"
              v-bind:class="{ active: android  }"
              v-on:click="toggleAndroid()"
            >
              <img
                src="static/img/generate-prototype/android-logo.svg"
                class="pr-10"
                v-if="!android"
              />
              <img
                src="static/img/generate-prototype/android-logo-red.svg"
                class="pr-10"
                v-if="android"
              />
              Generate Android prototype
            </button>
          </div>
          <p
            class="pt-10 m-0"
          >To send this participant app prototype to others in your organization, simply add their mobile number below.</p>
          <div class="ml-0-xs" v-if="ios || android">
            <div class="row pt-20" v-for="(idevice, index) in iosDevices">
              <div
                class="pl-15 pb-6"
              >Enter the phone number using +, then country code, then phone number with no spaces/symbols</div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 pl-0-xs">
                <input
                  type="tel"
                  class="form-control"
                  v-model="idevice.phoneNumber"
                  v-on:blur="validatePhoneNumber(idevice.phoneNumber, index)"
                  placeholder="(123) 456 - 7890"
                />
                <!-- <span v-show="errors.has('phone'+index)" class="error-style">The phone number field is required.</span> -->
                <span
                  v-if="validPhone.includes(index)"
                  class="error-style"
                >Please enter a valid phone number.</span>
              </div>
              <!--<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 pl-0-xs">
                <span class="fw-bold">Enter iPhone or iTouch Unique Device Identifier (UDID)</span>
                <span class="font-style pl-90" data-toggle="modal" data-target="#uuidModal" v-if="index === 0">How do I find my UDID?</span>
                <input type="text" class="form-control" v-model="idevice.uniqueDeviceIdentifier" v-on:blur="validateUdid(idevice.uniqueDeviceIdentifier, index)"
                  placeholder="40 digit UDID" />
                 <span v-if="validUdid.includes(index)" class="error-style">Please enter a valid UDID.</span>
              </div>-->
              <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 pl-0">
                <div class="close mt-5" v-on:click="deleteRow(index)">
                  <span>&times;</span>
                </div>
              </div>
            </div>
            <div class="add-style" v-if="iosDevices.length > 0">
              <a v-on:click="addRow()" class="add-style">
                <i class="fa fa-plus-circle fs-20" aria-hidden="true"></i>
                <span class="ml-5">Add another device</span>
              </a>
            </div>
          </div>
          <!--<div class="ml-30 ml-0-xs" v-if="android">
            <div class="row pt-10" v-for="(adevice, index) in androidDevices">
              <div class="col-lg-7 col-lg-offset-4 col-md-7 col-md-offset-4 col-sm-7 col-sm-offset-4 col-xs-11 pl-0-xs ">
                <span class="fw-bold pr-120">Enter Google Account username</span>
                <a href="https://accounts.google.com/SignUp?hl=en" target="_blank" class="font-style pl-100" v-if="index === 0">Create a Google Account</a>
                <input type="email" v-on:blur="validateEmail(adevice.userName, index)" class="form-control" v-model="adevice.userName" placeholder="example@gmail.com">
                <span v-if="validEmail.includes(index)" class="error-style">Please enter a valid email address.</span>
              </div>
              <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 pl-0-xs">
                <div class="mt-30 close" v-on:click="deleteRow('android', index)"><span>&times;</span></div>
              </div>
            </div>
            <div class="add-style" v-if="androidDevices.length > 0">
              <a class="add-style" v-on:click="addRow('android')"><i class="fa fa-plus-circle fs-20" aria-hidden="true"></i>
                <span class="ml-5">Add another device </span>
              </a>
            </div>
          </div>-->
          <div v-if="studyData" class="row multilingual-rectangle mt-30 pt-30">
            <div class="heading">Additional Languages</div>
            <div>
              <div>List of languages enabled for the study :</div>
              <ul class="pl-16">
                <li v-for="lang in studyData.language">{{lang.display_name}}</li>
              </ul>
              <div class="pb-20">
                <div class="title">Sending your study for translation</div>
                <div class="desc">In order to send your content to the translation vendor, you will need to generate a prototype, install it on your mobile device and launch the study app.</div>
              </div>
              <div>
                <div class="title">If there are changes to your study</div>
                <div class="desc">When the study is in <strong>Draft</strong> status, any changes in study configuration will be sent to the translation vendor. Once the study is in <strong>Active</strong> status, no new content/study configuration changes will be sent to the translation vendor. The translation vendor can send updated translations to the app in near real time.</div>
              </div>
            </div>
          </div>
        </div>
        <div id="uuidModal" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <div class="modal-content">
              <button type="button" class="close p-10" data-dismiss="modal">&times;</button>
              <div class="p-30">
                <div class="row">
                  <div class="fs-28 color_blue fw-200">Locating your iPhone or iTouch UDID</div>
                </div>
                <div class="row pt-10">
                  <div class="fw-bold fs-14">What is a UDID?</div>
                  <p>A Unique Device Identifier is a sequence of 40 letters and numbers that is specific to your device.</p>
                </div>
                <div class="row pt-10">
                  <div class="fw-bold fs-14">How to find my UDID?</div>
                  <p>
                    There are many free services that help you locate your UDID. We like this one:
                    <a
                      href="http://get.udid.io/"
                      target="_blank"
                      class
                    >http://get.udid.io/</a>. Access the website on your mobile device and it will
                    guide you through obtaining your UDID.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row text-center" v-if="preview">
          <div class="mt-100 mb-100">
            <img src="/static/img/generate-prototype/graphic-preview.svg" />
            <h2 class="pt-10">Your prototype is generating now.</h2>
            <p class="pt-10 m-0">
              This process takes no more than
              <b>10 minutes</b>. You will receive an email and SMS text message with an installation
              link.
            </p>
            <div class="font-style pt-20 fw-bold">What should I do with my prototype?</div>
            <div class="row pt-20">
              <div class="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
                <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 pb-45">
                  <div class="box-style">
                    <div class="fw-bold">Share it with colleagues</div>
                    <div
                      class="pt-5"
                    >Gain feedback from internal stakeholders and influencers to enhance the app for your studies' participants.</div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 pb-45">
                  <div class="box-style">
                    <div class="fw-bold">Share it with potential users</div>
                    <div class="pt-5">
                      Gather participant insights and conduct user testing to ensure the study app meets the studies' goals
                      and provides value to the participants.
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 pb-45">
                  <div class="box-style">
                    <div class="fw-bold">Conduct internal review</div>
                    <div
                      class="pt-5"
                    >If required by your organizations SOPs, conduct any required quality reviews and testing.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <button
                class="btn br-25 disable-btn mr-10"
                v-if="!preview"
                v-on:click="skipForNow()"
                disable
              >Skip</button>
              <button
                type="button"
                class="btn nextBtn br-25"
                v-if="!preview"
                v-on:click="generate()"
              >Generate Prototype</button>
              <button
                type="button"
                class="btn saveBtn br-25 pl-10"
                v-if="preview"
                v-on:click="goToDashboard()"
              >Go to Study Dashboard</button>
              <button
                type="button"
                class="btn saveBtn br-25 ml-10"
                v-if="preview"
                v-on:click="nextClick()"
              >Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import studyReviewHeader from "../../common/study-review-header";

export default {
  name: "generate",
  data() {
    return {
      studyId: null,
      studyData: null,
      iosDevices: [],
      androidDevices: [],
      addIosDevice: { phoneNumber: "+1", uniqueDeviceIdentifier: "" },
      addAndroidDevice: { userName: "" },
      ios: false,
      android: false,
      preview: false,
      validEmail: [],
      validPhone: [],
      validUdid: []
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.getStudyDetails();
    this.getPrototypeDetails();
    window.scrollTo(0, 0);
  },
  methods: {
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.studyData = response.body;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    toggleAndroid() {
      this.android = !this.android;
      if (this.android) {
        if (this.iosDevices.length === 0) {
          this.addIosDevice = { phoneNumber: "+1", uniqueDeviceIdentifier: "" };
          this.iosDevices.push(this.addIosDevice);
        }
        this.androidDevices = [];
        this.iosDevices.forEach((item, index) => {
          this.validatePhoneNumber(item.phoneNumber, index);
          this.androidDevices.push({
            phoneNumber: item.phoneNumber,
            userName: ""
          });
        });
      }
      if (!this.android && !this.ios) {
        this.iosDevices = [];
        this.addIosDevice = { phoneNumber: "+1", uniqueDeviceIdentifier: "" };
        this.iosDevices.push(this.addIosDevice);
      }
    },
    toggleIos() {
      this.ios = !this.ios;
      if (this.iosDevices.length === 0) {
        this.addIosDevice = { phoneNumber: "+1", uniqueDeviceIdentifier: "" };
        this.iosDevices.push(this.addIosDevice);
      }
      if (!this.android && !this.ios) {
        this.iosDevices = [];
        this.addIosDevice = { phoneNumber: "+1", uniqueDeviceIdentifier: "" };
        this.iosDevices.push(this.addIosDevice);
      }
    },
    validatePhoneNumber(phoneNumber, index) {
      phoneNumber = phoneNumber ? phoneNumber.trim() : null; //eslint-disable-line
      const mobPattern = new RegExp("^\\+[0-9]{1,3}[0-9]{10,14}(?:x.+)?$");
      if (
        phoneNumber &&
        phoneNumber.length > 2 &&
        !mobPattern.test(phoneNumber)
      ) {
        this.validPhone.push(index);
      } else {
        this.validPhone.forEach((item, vindex) => {
          if (item === index) {
            this.validPhone.splice(vindex, 1);
          }
        });
      }
    },
    validateEmail(email, index) {
      email = email ? email.trim() : null; //eslint-disable-line
      const emailPattern = new RegExp(
        "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
      ); // eslint-disable-line
      if (email && !emailPattern.test(email)) {
        this.validEmail.push(index);
      } else {
        this.validEmail.forEach((item, vindex) => {
          if (item === index) {
            this.validEmail.splice(vindex, 1);
          }
        });
      }
    },
    validateUdid(udid, index) {
      udid = udid ? udid.trim() : null; //eslint-disable-line
      if (udid && udid.length !== 40) {
        this.validUdid.push(index);
      } else {
        this.validUdid.forEach((item, vindex) => {
          if (item === index) {
            this.validUdid.splice(vindex, 1);
          }
        });
      }
    },
    validateDevices() {
      let valid = true;
      if (this.ios) {
        this.iosDevices.forEach((item, index) => {
          this.validatePhoneNumber(item.phoneNumber, index);
          this.validateUdid(item.uniqueDeviceIdentifier, index);
        });
        if (this.validUdid.length !== 0) {
          valid = false;
          toastr.error("Please enter a valid UDID.");
        }
        if (this.validPhone.length !== 0) {
          valid = false;
          toastr.error("Please enter a valid phone number.");
        }
      }
      if (this.android) {
        this.androidDevices.forEach((item, index) => {
          this.validateEmail(item.userName, index);
        });
        this.iosDevices.forEach((item, index) => {
          this.validatePhoneNumber(item.phoneNumber, index);
          this.androidDevices[index].phoneNumber = item.phoneNumber;
        });
        if (this.validEmail.length !== 0) {
          valid = false;
          toastr.error("Please enter a valid email address.");
        }
      }
      return valid;
    },
    getPrototypeDetails() {
      this.$api.getPrototypeFact(this.studyId).then(
        response => {
          if (
            response.body.iosPrototypeUsers &&
            response.body.iosPrototypeUsers.length > 0
          ) {
            this.ios = true;
            this.iosDevices = response.body.iosPrototypeUsers;
            _.forEach(this.iosDevices, value => {
              //eslint-disable-line
              if (!value.phoneNumber) {
                value.phoneNumber = "+1"; //eslint-disable-line
              }
            });
          } else {
            this.iosDevices.push(this.addIosDevice);
          }
          if (
            response.body.androidPrototypeusers &&
            response.body.androidPrototypeusers.length > 0
          ) {
            //eslint-disable-line
            this.android = true;
            this.androidDevices = response.body.androidPrototypeusers;
          } else {
            this.androidDevices.push(this.addIosDevice);
          }
          if (this.android && !this.ios) {
            this.iosDevices = [];
            this.androidDevices.forEach(item => {
              this.iosDevices.push({
                phoneNumber: item.phoneNumber,
                uniqueDeviceIdentifier: ""
              });
            });
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting app data points"
          );
        }
      );
    },
    updatePrototypeDetails() {
      if (!this.ios) {
        this.iosDevices = null;
      }
      if (!this.android) {
        this.androidDevices = null;
      }
      _.forEach(this.iosDevices, value => {
        //eslint-disable-line
        if (value.phoneNumber === "+1") {
          value.phoneNumber = null; // eslint-disable-line
        }
      });
      const devices = {
        androidPrototypeusers: this.androidDevices,
        iosPrototypeUsers: this.iosDevices
      }; //eslint-disable-line
      this.$api.savePrototypeFact(this.studyId, devices).then(
        response => {
          if (
            response.body.iosPrototypeUsers &&
            response.body.iosPrototypeUsers.length > 0
          ) {
            this.ios = true;
            this.iosDevices = response.body.iosPrototypeUsers;
          }
          if (
            response.body.androidPrototypeusers &&
            response.body.androidPrototypeusers.length > 0
          ) {
            //eslint-disable-line
            this.android = true;
            this.androidDevices = response.body.androidPrototypeusers;
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting app data points"
          );
        }
      );
    },
    addRow() {
      if (this.ios || this.android) {
        this.addIosDevice = { phoneNumber: "+1", uniqueDeviceIdentifier: "" };
        this.iosDevices.push(this.addIosDevice);
        this.androidDevices = [];
        this.iosDevices.forEach((item, index) => {
          this.validatePhoneNumber(item.phoneNumber, index);
          this.androidDevices.push({
            phoneNumber: item.phoneNumber,
            userName: ""
          });
        });
      }
    },
    deleteRow(index) {
      if (this.android || this.ios) {
        this.androidDevices.splice(index, 1);
        if (this.androidDevices.length <= 0 || !this.androidDevices) {
          this.android = false;
        }
        this.iosDevices.splice(index, 1);
        if (this.iosDevices.length <= 0 || !this.iosDevices) {
          this.ios = false;
        }
      }
    },
    addMore() {
      this.preview = false;
    },
    generate() {
      if (this.validateDevices()) {
        this.preview = true;
        toastr.warning("Build triggered succesfully");
        this.updatePrototypeDetails();
        this.$api.postStudyBuildFact(this.studyId).then(
          () => {
            toastr.success("Build completed succesfully");
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while building the study"
            );
          }
        );
      }
    },
    saveAndExit() {
      const obj = { currentURL: null, routeName: "study-approval-confirm" };
      this.$api.saveAndExitStudyFact(this.studyId, obj).then(() => {
        this.$router.push({ name: "studies" });
      });
    },
    skipForNow() {
      this.$router.push({ name: "studies" });
    },
    nextClick() {
      this.$router.push({
        name: "documentation",
        params: { studyId: this.studyId }
      });
    },
    goToDashboard() {
      this.$router.push({
        name: "dashboard",
        params: { studyId: this.studyId }
      });
    }
  },
  components: {
    studyReviewHeader
  }
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
  color: #333;
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

.close {
  float: left;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  margin-top: 26px !important;
}
.multilingual-rectangle {
  border-top: solid 1px #d3dfe4;
  .heading {
    font-size: 20px;
    font-weight: 600;
    height: 35px;
  }
  .title {
    font-weight: 600;
    height: 20px;
  }
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
  .col-lg-offset-1 {
    margin-left: 8.33333333%;
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

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.generate-btn {
  border: solid 1px #d3dfe4;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 25px;
  background-color: #ffffff;
  color: #666769;
}
.font-style {
  cursor: pointer;
  color: #1f95f2;
}
.active {
  border-radius: 100px !important;
  color: #ffffff !important;
  background-color: #2d3752 !important;
}
.add-style {
  padding: 20px 7px;
  color: #f06559;
  cursor: pointer;
  text-decoration: none !important;
}
.box-style {
  position: relative;
  border-radius: 8px;
  background-color: #d3dfe4;
  padding: 12px 15px 15px;
  height: 155px;
  max-width: 270px;
  width: 100%;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}

.dashboard-btn {
  background: #f16559;
}
.mt-5 {
  margin-top: 5px !important;
}
</style>
