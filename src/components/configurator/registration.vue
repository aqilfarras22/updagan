<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20">
        <p
          class="pt-25 m-0 fs-14 color_slate-grey fw-500"
        >Select the fields your participant will provide during the registration process.</p>
        <div class="row">
          <div v-for="(item, index) in participantInfoData">
            <div class="row section_heading" v-if="index === 0">Participant information</div>
            <div class="row section_heading" v-if="index === 10">Contact details</div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0">
              <div class="row field_row">
                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 p-0">
                  <label
                    class="switch"
                    :class="{'inactive': (item.isOptional === 'required' && (item.key === 'email' || item.key === 'password' || item.key === 'nonMobilePhoneNumber'))}"
                  >
                    <input
                      type="checkbox"
                      v-model="item.isVisible"
                      :disabled="item.isOptional === 'required' && (item.index === 3 || item.index === 4)"
                      v-on:change="changeVisibility(item)"
                    />
                    <div class="slider round"></div>
                  </label>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5 pt-2 pl-0 fw-500">
                  {{item.field}}
                  <span v-if="item.key === 'email'">
                    <i
                      class="fa fa-question-circle help_icon cursor_pointer"
                      aria-hidden="true"
                      data-toggle="popover"
                      tabindex="0"
                      data-trigger="focus"
                      data-content="Participants will register or login with their email address."
                      data-html="true"
                    ></i>
                  </span>
                  <span v-if="item.key === 'password'">
                    <i
                      class="fa fa-question-circle help_icon cursor_pointer"
                      aria-hidden="true"
                      data-toggle="popover"
                      tabindex="0"
                      data-trigger="focus"
                      data-content="The participants password will be compliant with security and privacy requirements including the following: <br />
                    1. 	minimum 8 characters <br />
                    2. 	at least 1 upper case letter <br />
                    3. 	at least 1 lower case character <br />
                    4. 	at least 1 number <br />
                    5. 	at least 1 symbol (e.g. @#$%) <br />
                    6. 	Must not have a repetitive string (e.g. abc12abc12…)"
                      data-html="true"
                    ></i>
                  </span>
                </div>
                <div class="col-lg-4 col-md-5 col-sm-5 col-xs-4 p-0">
                  <select
                    class="form-control"
                    v-model="item.isOptional"
                    :disabled="!item.isVisible"
                    v-if="(item.key !== 'email' && item.key !== 'password' && item.key !== 'nonMobilePhoneNumber')"
                  >
                    <option value="default" disabled>Select Requirement</option>
                    <option value="optional">Optional field</option>
                    <option value="required">Required field</option>
                  </select>
                  <div
                    class="optionalField"
                    v-if="( item.key === 'email' || item.key === 'password' || item.key === 'nonMobilePhoneNumber')"
                  >
                    <span class="text-capitalize">{{item.isOptional}}</span> field
                  </div>
                </div>
              </div>
              <div class="row" v-if="item.key === 'gender'">
                <div
                  class="radio col-lg-6 p-0 col-lg-offset-1 col-md-6 col-md-offset-1 col-sm-12 col-xs-12 clearfix"
                >
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      id="gender_standard"
                      value="standard"
                      v-model="item.meta"
                      :disabled="!item.isVisible"
                    />
                    <span class>Standard gender selection list</span>
                  </label>
                  <i
                    class="fa fa-question-circle help_icon cursor_pointer"
                    aria-hidden="true"
                    data-toggle="popover"
                    tabindex="0"
                    data-trigger="focus"
                    data-content="<b> Standard gender selection list </b><br />
                    • 	Male  <br />
                    • 	Female <br />
                    •   Other gender identity <br />&nbsp; &nbsp;(when selected, opens to a free form &nbsp;&nbsp;&nbsp;field)"
                    data-html="true"
                  ></i>
                </div>
                <div
                  class="radio col-lg-6 p-0 col-lg-offset-1 col-md-offset-1 col-md-6 col-sm-12 col-xs-12 clearfix"
                >
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      id="gender_extended"
                      value="extended"
                      v-model="item.meta"
                      :disabled="!item.isVisible"
                    />
                    <span class>Expanded gender selection list</span>
                  </label>
                  <i
                    class="fa fa-question-circle help_icon cursor_pointer"
                    aria-hidden="true"
                    data-toggle="popover"
                    tabindex="1"
                    data-trigger="focus"
                    data-content="<b> Expanded gender selection list </b><br />
                        • 	Man <br />
                        • 	Woman <br />
                        • 	Genderqueer <br />
                        • 	Transgender Man (Female-to-Male) <br />
                        • 	Transgender Woman (Male-to- &nbsp;&nbsp;&nbsp;Female) <br />
                        • 	Another gender identity (when  &nbsp;&nbsp;&nbsp;selected, opens to a free form field)"
                    data-html="true"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row pt-20 pb-20">
          <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 pl-0 pt-10">
            <div class="filds_section">
              <h5 class="header_text">
                <span class="fa fa-envelope"></span>
                <span>Email verification & change</span>
              </h5>
              <div class="fs-12">
                At the end of the onboarding and registration process, a verification email will be sent to the participant
                to verify their identity.
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 pl-0 pt-10">
            <div class="filds_section">
              <h5 class="header_text">
                <span class="fa fa-question"></span>
                <span>Forgot Password</span>
              </h5>
              <div class="fs-12">
                We have an automated system in place if your participant should forget their password. They will simply enter
                an email associcated with that account and a password reset link will be emailed to them.
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 pl-0 pt-10">
            <div class="filds_section">
              <h5 class="header_text">
                <img src="static/img/icn-credentials-off.svg" alt class="passcode_icon" />
                <span>Finger print ID & Passcode</span>
              </h5>
              <div class="fs-12">
                Your participants will be able to quickly and securely access the app with their finger print ID (if their
                device allows) or a 4-digit passcode.
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 pl-0 pt-10">
            <div class="filds_section">
              <h5 class="header_text">
                <span class="fa fa-sign-out"></span>
                <span>Withdrawn or deactivated</span>
              </h5>
              <div class="fs-12">
                If a withdrawn participant attempts to log in, he/she will be presented with an option to reactivate their
                account. If a participant was deactivated by study admin, he/she will be prevented from logging in.
              </div>
            </div>
          </div>
        </div>
        <div class="pb-10">
          <span class="back_link" v-on:click="goBack()">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
          </span>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="row" v-if="isStudySummary">
            <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
            <b-btn
              class="btn br-25 disable-btn p-0 pt-5 mr-10"
              :to="{ name: 'study-summary', params: { studyId: studyId } }"
            >Back to study summary</b-btn>
            <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
          </div>
          <div class="row" v-if="!isStudySummary">
            <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
            <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
          </div>
        </div>
      </div>
      <CancelModal ref="cancelConfirmation" />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "credentials",
  data() {
    return {
      studyId: null,
      careGiver: null,
      participantInfoData: [
        {
          field: "Participant's First Name",
          key: "firstName",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 1,
          position: 1,
          meta: ""
        },
        {
          field: "Participant's Last Name",
          key: "lastName",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 2,
          position: 3,
          meta: ""
        },
        {
          field: "Parent/Caregiver First Name",
          key: "parentOrCgFirstName",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 17,
          position: 5,
          meta: ""
        },
        {
          field: "Parent/Caregiver Last Name",
          key: "parentOrCgLastName",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 18,
          position: 7,
          meta: ""
        },
        {
          field: "Email",
          key: "email",
          isOptional: "required",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 3,
          position: 9,
          meta: ""
        },
        {
          field: "Password",
          key: "password",
          isOptional: "required",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 4,
          position: 10,
          meta: ""
        },
        {
          field: "Birth Date",
          key: "birthDate",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 5,
          position: 2,
          meta: ""
        },
        {
          field: "Age Range",
          key: "ageRange",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 6,
          position: 4,
          meta: ""
        },
        {
          field: "Primary language",
          key: "language",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 7,
          position: 6,
          meta: ""
        },
        {
          field: "Gender",
          key: "gender",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 8,
          position: 8,
          meta: "standard"
        },
        {
          field: "Address",
          key: "address",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 9,
          position: 11,
          meta: ""
        },
        {
          field: "City / Town",
          key: "city",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 10,
          position: 13,
          meta: ""
        },
        {
          field: "State / Province / Region",
          key: "stateProvince",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 11,
          position: 15,
          meta: ""
        },
        {
          field: "Zip / Postal code",
          key: "zipCode",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 12,
          position: 17,
          meta: ""
        },
        {
          field: "Country",
          key: "country",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 13,
          position: 12,
          meta: ""
        },
        {
          field: "Phone number",
          key: "phoneNumber",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 14,
          position: 14,
          meta: ""
        },
        {
          field: "Non-mobile phone number",
          key: "nonMobilePhoneNumber",
          isOptional: "optional",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 15,
          position: 16,
          meta: ""
        },
        {
          field: "How did you hear about this study?",
          key: "howDidYouHear",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 16,
          position: 18,
          meta: ""
        },
      ],
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    window.setTimeout(() => {
      window.$('[data-toggle="popover"]').popover();
    }, 1);
    this.studyId = this.$route.params.studyId;
    this.participantInfoData = _.sortBy(this.participantInfoData, "position");
    this.getRegistration();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    changeVisibility(item) {
      let keyIndex = null;
      if (
        item.key !== "firstName" &&
        item.key !== "lastName" &&
        item.key !== "nonMobilePhoneNumber"
      ) {
        if (!item.isVisible) {
          keyIndex = _.findIndex(this.participantInfoData, ["key", item.key]);
          this.participantInfoData[keyIndex].isOptional = "default";
        }
      }
      if (item.isVisible && item.key === "birthDate") {
        keyIndex = _.findIndex(this.participantInfoData, ["key", "ageRange"]);
        this.participantInfoData[keyIndex].isVisible = false;
        this.participantInfoData[keyIndex].isOptional = "default";
      } else if (item.isVisible && item.key === "ageRange") {
        keyIndex = _.findIndex(this.participantInfoData, ["key", "birthDate"]);
        this.participantInfoData[keyIndex].isVisible = false;
        this.participantInfoData[keyIndex].isOptional = "default";
      }
    },
    getRegistration() {
      let self = this;
      this.$api.getRegistrationFact(this.studyId).then(response => {
        if (response.body.participantRegistrationConfigDetails) {
          self.participantInfoData = response.body.participantRegistrationConfigDetails.filter((info) => {
            if(info.key == "firstName") {
              info.field = "Participant's First Name";
            } else if(info.key == "lastName") {
              info.field = "Participant's Last Name";
            } else if(info.key == "email") {
              info.position = 9;
            } else if(info.key == "password") {
              info.position = 10;
            } else if(info.key == "address" || info.key == "country" || info.key == "city" || info.key == "phoneNumber" || info.key == "stateProvince"|| info.key == "nonMobilePhoneNumber" || info.key == "zipCode" || info.key == "howDidYouHear") {
              info.position = info.position + 2;
            } 
              return info;
          });
          self.careGiver = _.find(self.participantInfoData,{'key':'parentOrCgFirstName'})
            if(!self.careGiver) {
            self.participantInfoData.push({
            field: "Parent/Caregiver First Name",
            key: "parentOrCgFirstName",
            isOptional: "default",
            isVisible: false,
            expectedValues: null,
            type: "personalInfo",
            index: 17,
            position: 5,
            meta: ""
            });
            self.participantInfoData.push({
            field: "Parent/Caregiver Last Name",
            key: "parentOrCgLastName",
            isOptional: "default",
            isVisible: false,
            expectedValues: null,
            type: "personalInfo",
            index: 18,
            position: 7,
            meta: ""
            })
            }
          console.log("PARTICIPANT INFO",self.participantInfoData);
          self.participantInfoData = _.sortBy(
            self.participantInfoData,
            "position"
          );
        }
      });
    },
    nextClick() {
      const isOptionalArray = _.filter(
        this.participantInfoData,
        o => o.isOptional === "default" && o.isVisible
      );

      if (isOptionalArray.length === 0) {
        const regData = _.sortBy(this.participantInfoData, "index");
        this.$api
          .sendRegistrationDetailsFact(this.studyId, {
            participantRegistrationConfigDetails: regData
          }) // eslint-disable-line
          .then(
            () => {
              const selectedFeatures = this.$store.getters.getSelectedFeatures;
              const featureIndex = _.findIndex(selectedFeatures, [
                "route",
                this.$route.name
              ]);
              if (featureIndex === selectedFeatures.length - 1) {
                this.$router.push({ name: "features-library-final" });
              } else {
                this.$router.push({
                  name: selectedFeatures[featureIndex + 1].route,
                  params: { studyId: this.studyId }
                }); // eslint-disable-line
              }
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while sending the resgistration details"
              );
            }
          );
      } else {
        toastr.error(
          "Please select requirements for input fields or hide the ones that would not display."
        );
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, [
        "route",
        this.$route.name
      ]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    }
  },
  components: { studyFeatureHeader, CancelModal }
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

  .col-lg-offset-1 {
    margin-left: 8.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.form-control {
  border: solid 1px #d3dfe4 !important;
  height: 40px !important;
}
button {
  cursor: pointer;
  border: none !important;
  outline: 0px solid !important;
}
.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}
.passcode_icon {
  width: 15px;
  height: 15px;
}
button:focus {
  outline: 0px solid transparent;
}
.section_heading {
  font-size: 24px;
  clear: both;
  font-weight: bold;
  padding: 30px 0px 20px 0;
  color: #666769;
}
.field_row {
  padding: 10px 0px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.inactive {
  opacity: 0.5;
  pointer-events: none;
}
.header_text {
  color: #1d7fee;
  font-weight: bold;
  margin: 10px 0;
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
}
.header_text {
  font-size: 16px;
  color: #1d7fee;
  font-weight: bold;
}
/* Hide default HTML checkbox */
.switch input {
  display: none;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #ccc;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 1px;
  background-color: #ccc;
}
input:checked + .slider {
  border: 2px solid #48bf7a;
}
input:checked + .slider:before {
  content: "";
  background-color: #48bf7a;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  /*content: '✓';*/
  position: absolute;
  color: #2ecc71;
  text-align: center;
  font-size: 20px;
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
.filds_section {
  border-radius: 8px;
  padding: 0 10px 10px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  min-height: 150px;
}
@media (max-width: 575px) {
  .switch {
    width: 50px;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(12px);
    -ms-transform: translateX(12px);
    transform: translateX(12px);
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 25px;
    width: 25px;
    left: 12px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
  }
  .check_icon {
    color: rgb(46, 204, 113);
    position: absolute;
    left: 28px;
    top: 8px;
    font-size: 18px;
    transition: 0.4s;
  }
}

.optionalField {
  height: 40px;
}
</style>
