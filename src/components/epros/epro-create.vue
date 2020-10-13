<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="new-heading">
            ePRO information
            <span class="beta-txt">BETA</span>
          </div>
          <form class="epro_details_form">
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">ePRO name</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="title"
                    :class="{'input': true, 'is-danger': errors.has('title'), 'is-success': !errors.has('title') }"
                    class="form-control input-md"
                    v-model="epro.title"
                    placeholder="eg. Physical Function"
                    required
                  />
                  <span
                    v-show="errors.has('title')"
                    class="error-style"
                  >The ePRO name field must be filled.</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Author(s)</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="authors"
                    v-model="epro.eProInfo.authors"
                    :class="{'input': true, 'is-danger': errors.has('authors'), 'is-success': !errors.has('authors') }"
                    class="form-control input-md"
                    placeholder="eg. Health Organization"
                    required
                  />
                  <span
                    v-show="errors.has('authors')"
                    class="error-style"
                  >The Author(s) field must be filled.</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Objective</h4>
                <div class="form-group">
                  <textarea
                    type="text"
                    v-validate="'required'"
                    name="objective"
                    v-model="epro.objective"
                    :class="{'input': true, 'is-danger': errors.has('objective'), 'is-success': !errors.has('objective') }"
                    class="form-control input-md"
                    placeholder="Description of ePRO/eCOA here"
                    style="height: 129px;"
                    required
                  />
                  <span
                    v-show="errors.has('objective')"
                    class="error-style"
                  >The Objective field must be filled.</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Copyright</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="copyRight"
                    v-model="epro.eProInfo.copyRight"
                    :class="{'input': true, 'is-danger': errors.has('copyRight'), 'is-success': !errors.has('copyRight') }"
                    class="form-control input-md"
                    placeholder="eg. ©2019 Health Orgnization"
                    required
                  />
                  <span
                    v-show="errors.has('copyRight')"
                    class="error-style"
                  >The Copyright field must be filled.</span>
                </div>
                <h4 class="pt-10 epro_title">Therapeutic area</h4>
                <div class="form-group">
                  <select
                    v-validate="'required|min:2'"
                    name="therapeuticArea"
                    v-model="epro.therapeuticArea"
                    :class="{'input': true, 'is-danger': errors.has('therapeuticArea'), 'is-success': !errors.has('therapeuticArea') }"
                    class="form-control input-md"
                    required
                  >
                    <option value="defaultOption">Select</option>
                    <!-- <option disabld value="defaultOption">Select</option> -->
                    <option
                      v-for="option in therapeuticAreas"
                      v-bind:value="option.value"
                    >{{ option.name }}</option>
                  </select>
                  <span
                    v-show="errors.has('therapeuticArea')"
                    class="error-style"
                  >The Therapeutic Area must be selected.</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Approximate time to complete</h4>
                <div class="form-group">
                  <input
                    type="number"
                    v-validate="'required'"
                    name="timeToComplete"
                    v-model="epro.timeToComplete"
                    :class="{'input': true, 'is-danger': errors.has('timeToComplete'), 'is-success': !errors.has('timeToComplete') }"
                    class="form-control input-md"
                    placeholder="eg. 10 minutes"                     
                    min="1" 
                    max="999"
                    maxlength="3"
                  />
                  <span class="mins_text" v-if="epro.timeToComplete">Minutes</span>
                  <span
                    v-show="errors.has('timeToComplete')"
                    class="error-style"
                  >Approximate time to complete field must be an integer with 3 digits max.</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Therapeutic indication</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="therapeuticIndication"
                    v-model="epro.therapeuticIndication"
                    :class="{'input': true, 'is-danger': errors.has('therapeuticIndication'), 'is-success': !errors.has('therapeuticIndication') }"
                    class="form-control input-md"
                    placeholder="eg. Universal"
                    required
                  />
                  <span
                    v-show="errors.has('therapeuticIndication')"
                    class="error-style"
                  >The Therapeutic indication field must be filled.</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Available in the following languages</h4>
                <div class="form-group">
                  <input
                    type="text"
                    v-validate="'required'"
                    name="language"
                    v-model="epro.language"
                    :class="{'input': true, 'is-danger': errors.has('language'), 'is-success': !errors.has('language') }"
                    class="form-control input-md"
                    placeholder="eg. Licence use for English, available in other languages"
                    required
                  />
                  <span
                    v-show="errors.has('language')"
                    class="error-style"
                  >The Available in the following languages field must be filled.</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pl-0">
                <h4 class="pt-10 epro_title">Learn more link</h4>
                <div class="form-group">
                  <input
                    type="url"
                    v-validate="{ rules: { regex: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i } }"
                    name="learnmore"
                    v-model="epro.learnmore"
                    :class="{'input': true, 'is-danger': errors.has('learnmore'), 'is-success': !errors.has('learnmore') }"
                    class="form-control input-md"
                    required
                  />
                  <span v-show="errors.has('learnmore')" class="error-style">Enter valid http(s) link.</span>
                </div>
              </div>
              <br />
              <br />
              <span
                v-b-popover.hover="'Please add a URL to the source of the published ePRO.'"
                class="fa fa-question-circle help_icon fa-lg ml-10"
                data-toggle="popover"
              ></span>
            </div>
            <div class="row">
              <input
                type="checkbox"
                v-model="epro.digitalUse"
                class="custom-check"
                name="digitalUse"
                style="vertical-align: text-top;background-color:white;"
              />
              &nbsp;
              <label class>Approved for digital use</label>
            </div>
          </form>
          <div class="pt-20">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-caret-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <button
                class="btn br-25 disable-btn mr-10"
                v-on:click="skipForNow()"
                :disabled="disableSkipForNow"
              >Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="createEpro()">Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "epro-create",
  data() {
    return {
      studyId: null,
      surveyId: null,
      isInvalidQuestion: false,
      disableSkipForNow: false,
      epro: {
        title: "",
        objective: "",
        therapeuticArea: "defaultOption",
        timeToComplete: "",
        therapeuticIndication: "",
        language: "",
        learnmore: "",
        watchEnabled: false,
        digitalUse: false,
        questions: [],
        eProInfo: {}
      },
      therapeuticAreas: [
        {
          name: "Cardiology/Vascular Diseases",
          value: "Cardiology/Vascular Diseases"
        },
        { name: "Dental and Oral Health", value: "Dental and Oral Health" },
        { name: "Dermatology", value: "Dermatology" },
        { name: "Devices", value: "Devices" },
        { name: "Endocrinology", value: "Endocrinology" },
        { name: "Family Medicine", value: "Family Medicine" },
        { name: "Gastroenterology", value: "Gastroenterology" },
        { name: "Genetic Disease", value: "Genetic Disease" },
        { name: "Healthy Volunteers", value: "Healthy Volunteers" },
        { name: "Hematology", value: "Hematology" },
        {
          name: "Hepatology (Liver, Pancreatic, Gall Bladder)",
          value: "Hepatology (Liver, Pancreatic, Gall Bladder)"
        },
        { name: "Immunology", value: "Immunology" },
        {
          name: "Infections and Infectious Diseases",
          value: "Infections and Infectious Diseases"
        },
        { name: "Internal Medicine", value: "Internal Medicine" },
        { name: "Musculoskeletal", value: "Musculoskeletal" },
        { name: "Nephrology", value: "Nephrology" },
        { name: "Neurology", value: "Neurology" },
        {
          name: "Nutrition and Weight Loss",
          value: "Nutrition and Weight Loss"
        },
        {
          name: "Obstetrics/Gynecology (Women’s Health)",
          value: "Obstetrics/Gynecology (Women’s Health)"
        },
        { name: "Oncology", value: "Oncology" },
        { name: "Ophthalmology", value: "Ophthalmology" },
        {
          name: "Orthopedics/Orthopedic Surgery",
          value: "Orthopedics/Orthopedic Surgery"
        },
        {
          name: "Otolaryngology (Ear, Nose, Throat)",
          value: "Otolaryngology (Ear, Nose, Throat)"
        },
        { name: "Pediatrics/Neonatology", value: "Pediatrics/Neonatology" },
        { name: "Pharmacology/Toxicology", value: "Pharmacology/Toxicology" },
        { name: "Podiatry", value: "Podiatry" },
        { name: "Psychiatry/Psychology", value: "Psychiatry/Psychology" },
        {
          name: "Pulmonary/Respiratory Diseases",
          value: "Pulmonary/Respiratory Diseases"
        },
        { name: "Rheumatology", value: "Rheumatology" },
        { name: "Sleep", value: "Sleep" },
        {
          name: "Trauma (Emergency, Injury, Surgery)",
          value: "Trauma (Emergency, Injury, Surgery)"
        },
        { name: "Urology", value: "Urology" },
        { name: "Vaccines", value: "Vaccines" }
      ]
    };
  },
  props: ["sequence"],
  components: { studyFeatureHeader },
  computed: {
    surveyType() {
      return "EPRO";
    }
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.eproId = this.$route.params.eproId;
    if (this.$route.name === "epro-create" && this.eproId !== 0) {
        this.getEproTemplateDetails();
        this.disableSkipForNow = false;
    }
    this.disableSkipForNow = this.eproId == 0 ? true : this.disableSkipForNow;
  },
  methods: {
    createEpro() {
      if (Number(this.sequence)) {
        this.epro.sequence = this.sequence;
      }
      if (
        this.epro.title &&
        this.epro.eProInfo.authors &&
        this.epro.objective &&
        this.epro.eProInfo.copyRight &&
        this.epro.therapeuticArea !== "defaultOption" &&
        this.epro.therapeuticIndication &&
        this.epro.timeToComplete &&
        this.epro.language
      ) {
        // eslint-disable-line
        this.epro.timeToComplete = Number(this.epro.timeToComplete);
        var val= Number(this.epro.timeToComplete);
         if (val.toString().length > 3) {
          toastr.error(
            "Approximate time to complete field must an integer with 3 digits max."
          );
        }else if (this.epro.timeToComplete % 1 !== 0) {
          toastr.error(
            "Approximate time to complete field must be an integer with 3 digits max."
          );
        } else if (this.errors.has("learnmore")) {
          toastr.error("Enter valid http(s) link.");
        } else {
          this.epro.eProInfo.name = this.epro.title;
          this.epro.eProInfo.objective = this.epro.objective;
          this.epro.eProInfo.therapeuticArea = this.epro.therapeuticArea;
          this.epro.eProInfo.therapeuticIndication = this.epro.therapeuticIndication;          
          if(this.epro.eProInfo.timeToComplete == 'NaN'){
            this.epro.eProInfo.timeToComplete = '';
          }else{
            this.epro.eProInfo.timeToComplete = this.epro.timeToComplete;
          }
          this.epro.languages = this.epro.language.split(",");
          if (this.eproId) {
            this.$api.updateEproDetailsFact(this.eproId, this.epro).then(
              response => {
                toastr.success("ePRO updated successfully");
                this.surveyId = response.body.id;
                this.$router.replace({
                  name: "survey-questions",
                  params: {
                    studyId: this.studyId,
                    surveyId: this.eproId,
                    sequence: this.sequence,
                    surveyType: this.surveyType
                  }
                });
              },
              error => {
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while creating the epro"
                );
              }
            );
          } else {
            this.$api.postNewEproInfoFact(this.epro).then(
              response => {
                toastr.success("ePRO created successfully");
                this.surveyId = response.body.id;
                this.eproId = response.body.id;                
                this.$router.replace({
                  name: "survey-questions",
                  params: {
                    studyId: this.studyId,
                    surveyId: this.eproId,
                    sequence: this.sequence,
                    surveyType: this.surveyType
                  }
                });
              },
              error => {
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while creating the epro"
                );
              }
            );
          }
        }
      } else {
        toastr.error("Please populate required fields");
      }
    },
    getEproTemplateDetails() {
      this.$api.getEproDetailsFactV2(this.eproId).then(
        response => {
          this.epro = response.body;
          if (this.epro && this.epro.languages)
            this.epro.language = this.epro.languages.join(",");
          if (this.epro && this.epro.eProInfo == undefined) {
            this.epro.eProInfo = {};
            this.disableSkipForNow = true;
          }
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting the ePRO details"
          );
        }
      );
    },
    goBack() {
      window.history.back();
    },
    skipForNow() {
      this.$router.replace({
        name: "survey-questions",
        params: {
          studyId: this.studyId,
          surveyId: this.eproId,
          sequence: this.sequence,
          surveyType: this.surveyType
        }
      });
    }
  }
};
</script>
<style lang="scss" src="../../../public/static/fonts.scss"></style>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

.active_tab {
  color: #4c8ce3;
  border-bottom: 2px solid #4c8ce3;
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
  margin-top: 10px;
  margin-bottom: 10px;
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

// .pr-20{
//   margin-top: 0px;
//   margin-bottom: 0px;
//   height: 129px;
//   resize: none;
// }
.objective {
  margin-top: 0px;
  margin-bottom: 0px;
  height: 129px;
  resize: none;
}
.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}

span.beta-txt {
  font-size: 10px;
  font-family: Lato-bold;
  border-radius: 3px;
  // margin-left: 7px;
  margin-top: -1px;
  color: #4c8ce4;
  background: #fff;
  padding: 2px 8px 0px;
  vertical-align: middle;
  display: inline-block;
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
.collapse_card {
  border: 1px solid #d3dfe4 !important;
  background-color: #f5f8fa;
  padding-left: 5px;
}
.icon_section {
  width: 28px;
  height: 28px;
  border-radius: 2px;
  background-color: #d3dfe4;
  display: inline-block;
  text-align: center;
  padding-top: 5px;
}
.read_only_card {
  border-left: 6px solid #d3dfe4 !important;
}
.navbar-style {
  background: linear-gradient(to left, #7478e6, #09b9e0);
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
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin: 10px 0px 20px 0px;
}

.cardX {
  margin: 0 auto 2rem;
  box-shadow: 0 0.0625em 0.2em 0 rgba(0, 0, 0, 0.1), 0 0.7em 0 -0.3em #f2f2f2,
    0 0.5em 0.1875em -0.25em rgba(0, 0, 0, 0.2), 0 1em 0 -0.6em #e5e5e5,
    0 1em 0.1875em -0.5em rgba(0, 0, 0, 0.2), 0 1em 0 -0.6em #e5e5e5,
    0 1em 0.1875em -0.5em rgba(0, 0, 0, 0.2) !important;
}

.read_only_screen {
}
.doc_desc {
  display: inline-block;
  word-break: break-all;
}
.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
  // margin-left:-15px;
}
.ml-10 {
  margin-left: -5px !important;
  margin-top: 10px;
  padding-top: 10px;
}
.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
}
.mins_text {
  position: absolute;
  // top: 8px;
  // right: 15px;
  top: 53px;
  right: 26px;
  color: #959fa4;
  font-size: 14px;
}
.header-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
}
.edit_only_screen {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.add-btn {
  font-size: 14px;
  min-width: 150px;
  border: 1px solid#f06559;
  color: #f06559;
  background: transparent;
}

.save_btn {
  width: 100px;
}
.form-control {
  border-radius: 2px;
  background-color: #f5f8fa;
  height: 40px;
}

::placeholder { 
  color: #a6a6a6;
  opacity: 1; 
}
.misplaced-card {
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}
.custom-check {
  width: 20px;
  height: 25px;
  // margin-top: 8px;
  // margin-left: 10px;
}
.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.radio-style {
  bottom: 2px;
  text-align: center;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.close-style {
  padding: 15px 15px 0px 0px;
}
.back_link {
  color: #666669;
}

.epro_title {
  color: #666669;
  font-size: 14px;
}

.input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.divider {
  margin-top: 30px;
  margin-bottom: 28px;
  border: 1px solid #d3dfe4;
}

.grey1 {
  margin-bottom: 22px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
  float: left;
  margin-right: 10px;
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

.switch-option {
  float: left;
  width: 100%;
}

.new-heading {
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #666669;
}

.pad22 {
  padding-bottom: 22px;
}

.pt-10 {
  opacity: 0.7;
  /* font-family: Roboto; */
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  // color: #666669;
  color: #060606;
  margin-bottom: 5px;
}

.pt-20 {
  margin-top: 50px;
  margin-bottom: 20px;
}

.back_link {
  color: #666669;
}
.survey-error {
  font-size: 14px;
  color: #f06559;
}
.modal-close {
  font-size: inherit;
  color: #000;
}
</style>