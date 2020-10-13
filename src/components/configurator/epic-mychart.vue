<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="pl-20 pr-20 pb-15">
          <div class="pt-25 m-0">
            <img src="static/img/epic.png" alt class="epic-img" />
          </div>
          <p class="color-hash">
            This integration allows participants to provide access to their MyChart medical record for the purposes of the
            study. As the research organization, you must already have a registered MyChart account.
            <b>Please note that your participants must have a MyChart account registered with YOUR instance of MyChart. You will NOT be able to connect with MyChart accounts from other healthcare organizations.</b>
          </p>
          <p
            class="color-hash"
          >Are your participants required to connect their MyChart account for this study?</p>
          <select
            v-model="myChart.isOptional"
            v-on:change="changeOptional(myChart.isOptional)"
            class="form-control mychart-select mb-15"
          >
            <option value="default" disabled>Select</option>
            <option value="false">Required</option>
            <option value="true">Not required</option>
          </select>
          <div>
            <p class="color-hash fs-20 pt-25">
              <b>Connect your MyChart account</b>
            </p>
            <p class="color-hash">
              We need your unique MyChart account URLs so that your participants are connecting to the correct account. If
              you are not sure what your URLs are, please consult with your MyChart system administrator.
            </p>
            <button
              type="button"
              class="btn btn-md add_another_btn br-25"
              v-on:click="addMychartAccount"
              v-if="!myChart.hasEpicIntegration && showAddBtn"
            >Connect MyChart account</button>
            <div class="row card mt-15 mb-15" v-if="showOpened && myChart.hasEpicIntegration">
              <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 pl-0">
                <p class="mt-15">
                  <b>MSMC MyChart</b>
                  <span class="pl-5">
                    <i class="fa fa-check-circle color_green" aria-hidden="true"></i>
                  </span>
                </p>
              </div>
              <div class="col-lg-1 col-md-11 col-sm-11 col-xs-11">
                <button class="edit-btn mt-10 ml-10" v-on:click="editMychartAccount">Edit</button>
              </div>
            </div>
            <div class="card mb-15" v-if="!showOpened">
              <div class="section_heading pt-10 pb-5">Your MyChart base URL</div>
              <div class="form-group">
                <input
                  type="text"
                  v-validate="'required|url:require_protocol'"
                  name="baseUrl"
                  :class="{'input': true, 'is-danger': errors.has('baseUrl'), 'is-success': !errors.has('baseUrl') }"
                  v-model="myChart.baseUrl"
                  class="form-control input-md"
                  placeholder="http://www.example.com/asdf"
                  required
                />
                <span
                  v-show="errors.has('baseUrl')"
                  class="error-style"
                >{{ errors.first('baseUrl') }}</span>
              </div>
              <div class="section_heading pb-5">Your "Sign up" page URL</div>
              <div class="form-group">
                <input
                  type="text"
                  v-validate="'required|url:require_protocol'"
                  name="signUpUrl"
                  :class="{'input': true, 'is-danger': errors.has('signUpUrl'), 'is-success': !errors.has('signUpUrl') }"
                  v-model="myChart.signUpUrl"
                  class="form-control input-md"
                  placeholder="http://www.example.com/asdf"
                  required
                />
                <span
                  v-show="errors.has('signUpUrl')"
                  class="error-style"
                >{{ errors.first('signUpUrl') }}</span>
              </div>
              <div class="section_heading pb-5">Your "Forgot password" URL</div>
              <div class="form-group">
                <input
                  type="text"
                  v-validate="'required|url:require_protocol'"
                  name="forgotPasswordUrl"
                  v-model="myChart.forgotPasswordUrl"
                  :class="{'input': true, 'is-danger': errors.has('forgotPasswordUrl'), 'is-success': !errors.has('forgotPasswordUrl') }"
                  class="form-control input-md"
                  placeholder="http://www.example.com/asdf"
                  required
                />
                <span
                  v-show="errors.has('forgotPasswordUrl')"
                  class="error-style"
                >{{ errors.first('forgotPasswordUrl') }}</span>
              </div>
              <div class="section_heading pb-5">Your "Forgot username" URL</div>
              <div class="form-group">
                <input
                  type="text"
                  v-validate="'required|url:require_protocol'"
                  name="forgotUsernameUrl"
                  v-model="myChart.forgotUsernameUrl"
                  :class="{'input': true, 'is-danger': errors.has('forgotUsernameUrl'), 'is-success': !errors.has('forgotUsernameUrl') }"
                  class="form-control input-md"
                  placeholder="http://www.example.com/asdf"
                  required
                />
                <span
                  v-show="errors.has('forgotUsernameUrl')"
                  class="error-style"
                >{{ errors.first('forgotUsernameUrl') }}</span>
              </div>
              <div class="row pt-20">
                <div class="col-lg-9 col-md-9 col-sm-6 col-xs-2 p-0">
                  <button
                    class="btn btn-link pb-15 color_red pl-0"
                    v-on:click="deleteMychartAccount()"
                    v-if="myChart.hasEpicIntegration"
                  >Delete</button>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-10 text-right p-0">
                  <button
                    class="btn btn-link pb-15 color_aa"
                    v-on:click="cancelMychartAccount()"
                  >Cancel</button>
                  <button
                    class="btn btn-success save_btn mb-10 br-30"
                    v-on:click="saveMychartAccount(studyId,myChart)"
                  >Save</button>
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
            <div class="row">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="nextClick(myChart)">Save and Continue</button>
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
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "epic-mychart",
  data() {
    return {
      studyId: null,
      showOpened: true,
      showAddBtn: true,
      myChart: {
        isOptional: "default",
        hasEpicIntegration: false,
        baseUrl: null,
        signUpUrl: null,
        forgotUsernameUrl: null,
        forgotPasswordUrl: null
      }
    };
  },
  mounted() {
    // window.scrollTo(0, 0);
    this.studyId = this.$route.params.studyId;
    this.getEpicMychart();
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 200;
    }, 1500);
  },
  methods: {
    goBack() {
      window.history.back();
    },
    changeOptional(isOptional) {
      this.myChart.isOptional = isOptional === "true";
    },
    getEpicMychart() {
      this.$api.getEpicMychartFact(this.studyId).then(
        response => {
          this.myChart = response.body;
          if (!this.myChart.hasEpicIntegration) {
            this.myChart.isOptional = "default";
          }
          this.tempMyChart = _.cloneDeep(response.body);
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting epic response."
          );
        }
      );
    },
    saveMychartAccount(studyId, myChart) {
      const urls = [
        myChart.baseUrl,
        myChart.signUpUrl,
        myChart.forgotUsernameUrl,
        myChart.forgotPasswordUrl
      ]; // eslint-disable-line
      let isValidUrl = true;
      urls.forEach(url => {
        // eslint-disable-line
        if (
          !/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/.test(
            url
          )
        ) {
          // eslint-disable-line
          isValidUrl = false;
        }
      });
      if (myChart.isOptional === "default") {
        toastr.error(
          "Please select whether the participants required to connect their MyChart account."
        );
      } else if (isValidUrl) {
        myChart.hasEpicIntegration = true; // eslint-disable-line
        this.$api.postEpicMychartFact(this.studyId, myChart).then(
          () => {
            this.showOpened = true;
            toastr.success("MyChart account added");
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while adding myChart."
            );
          }
        );
      } else {
        toastr.error(
          "MyChart account could not be verified. Please double check your URLs."
        );
      }
    },
    addMychartAccount() {
      this.showOpened = false;
      this.showAddBtn = false;
    },
    editMychartAccount() {
      this.showOpened = false;
    },
    cancelMychartAccount() {
      this.showOpened = true;
      this.myChart = this.tempMyChart;
      if (!this.myChart.hasEpicIntegration) {
        this.showAddBtn = true;
      }
      this.getEpicMychart();
    },
    deleteMychartAccount() {
      this.$api.deleteEpicMychartFact(this.studyId).then(
        () => {
          toastr.success("MyChart account deleted");
          this.getEpicMychart();
          this.showOpened = true;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while deleting myChart."
          );
        }
      );
    },
    nextClick(myChart) {
      const urls = [
        this.myChart.baseUrl,
        this.myChart.signUpUrl,
        this.myChart.forgotUsernameUrl,
        this.myChart.forgotPasswordUrl
      ]; // eslint-disable-line
      let isValid = true; // eslint-disable-line
      urls.forEach(url => {
        // eslint-disable-line
        if (
          !/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}\.{0,1}/.test(
            url
          )
        ) {
          // eslint-disable-line
          isValid = false;
        }
      });
      if (myChart.isOptional === "default") {
        toastr.error(
          "Please select whether the participants required to connect their MyChart account."
        );
      } else if (isValid) {
        this.$api.postEpicMychartFact(this.studyId, myChart).then(
          () => {
            this.showOpened = true;
            toastr.success("MyChart account added");
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
                : "Error while adding myChart."
            );
          }
        ); // eslint-disable-line
      } else {
        toastr.error(
          "MyChart account could not be verified. Please double check your URLs."
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
    }
  },
  components: { studyFeatureHeader }
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
  margin: 20px 0 10px;
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
  // height: 100%;
  // min-height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.color-hash {
  color: #666669;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}
.create_button {
  color: #5989e4;
  font-size: 32px;
  width: 30px;
  height: 30px;
  background-color: #fff;
  display: inline-block;
  border-radius: 50%;
  margin-top: 4px;
  margin-left: 10px;
  float: left;
  .plus_icon {
    color: #4c8ce4;
    position: relative;
    bottom: 10px;
    right: -5px;
  }
}
.mac {
  .create_button {
    .plus_icon {
      bottom: 9px;
    }
  }
}
.add_another_btn {
  font-size: 14px;
  background-color: transparent;
  border-color: #f06559;
  color: #f06559;
  margin-bottom: 20px;
}
.btn-text {
  display: inline-block;
  margin-top: 10px;
  margin-left: 15px;
}
.mychart-select {
  width: 200px;
  height: 40px;
  border-radius: 3px;
}
.section_heading {
  font-weight: 500;
  font-size: 14px;
  color: #666669;
}
.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}

.btn {
  border-radius: 25px;
}
.form-control {
  border-radius: 2px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.epic-img {
  width: 160px;
  height: 60px;
  margin-bottom: 10px;
}
.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin-top: 10px;
}

.save_btn {
  width: 100px;
}
.mychart-btn {
  width: 250px;
  height: 40px;
  background-color: #4c8ce4;
  color: #fff;
  border-radius: 100px;
  border: 1px solid #4c8ce4;
}
</style>
