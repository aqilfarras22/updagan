<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20 pb-20">
        <div v-if="showList === false">
          <div class="pt-10" v-if="surveys && surveys.length > 0">
            <button class="btn btn-link pl-0 pr-0 color_b8c7ce" v-on:click="toggleView()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back to my surveys
            </button>
          </div>
          <div
            class="pt-20 fw-500"
          >Select from a list of survey templates below or create your own survey.</div>
          <div class="pt-20">
            <button
              class="btn btn-info create_btn br-30"
              v-on:click="createSurveys()"
            >Create a new survey</button>
            <div class="custom-upload-btn btn btn-info br-30 ml-20">
							Import JSON file
              <span class="beta-txt">BETA</span>
              <input
                type="file"
                id="survey-json-file"
                class="cursor_pointer"
                accept="application/json, .json"
                v-on:change="onSurveyFileSelection($event)"
              />
						</div>
            <span v-b-popover.hover="'To upload a survey file, export an existing survey JSON file format, modify and import using this tool.'" class="fa fa-question-circle help_icon fa-lg ml-8"></span>
          </div>
          <div class="row templates_card">
            <div class="row header_bg">
              <div class="col-md-12 col-sm-12 col-xs-12 pb-10 pl-0 pr-0">
                <div class="col-md-6 col-sm-6 col-xs-12 pl-0">
                  <input
                    type="text"
                    class="form-control mb-10 br-25 search_input"
                    placeholder="Search"
                    v-model="searchTerm"
                    @keyup.enter="searchFilterSurveys(searchTerm,sort,filter)"
                  />
                  <i class="fa fa-search search_icon" aria-hidden="true"></i>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 mb-10 pr-0 pull-right">
                  <select
                    class="form-control select-style select_control br-25"
                    v-model="sort"
                    v-on:change="searchFilterSurveys(searchTerm,sort,filter)"
                  >
                    <option value="default" disabled>Sort</option>
                    <option value="default">None</option>
                    <option value="Asc">Name/A-Z</option>
                    <option value="Desc">Name/Z-A</option>
                    <option value="dateAsc">Date/Ascending</option>
                    <option value="dateDesc">Date/Descending</option>
                  </select>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 pull-right">
                  <select
                    class="form-control select-style select_control br-25 display-none"
                    v-model="filter"
                    v-on:change="searchFilterSurveys(searchTerm,sort,filter)"
                  >
                    <option value="default" disabled>Filters</option>
                    <option value="All">All</option>
                    <option value="default">None</option>
                    <option value="Community">Community Library</option>
                    <option value="MyCompany" disabled>Company Templates</option>
                    <!--<option value="MyTemplates" disabled>My Templates</option>-->
                  </select>
                </div>
              </div>
              <div class="row text-center">
                <!-- <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 cursor_pointer pb-5" :class="{'active_tab' : activeTab === 'templates'}" v-on:click="typeChanged('templates')">Templates</div> -->
                <div
                  class="col-lg-6 col-md-6 col-sm-6 col-xs-6 cursor_pointer pb-5 active_tab"
                  v-on:click="typeChanged('myTemplates')"
                >My Templates</div>
              </div>
            </div>
            <div
              class="template_card"
              v-for="template in templates"
              v-if="templates && templates.length > 0"
            >
              <div class="row">
                <div class="col-lg-10 col-md-10 p-0">
                  <div>{{template.surveyTitle}}</div>
                  <div class="template-text">{{template.desc}}</div>
                </div>
                <div class="col-lg-2 col-md-2 p-0 text-right">
                  <!--<div class="icon-style mr-10" disabled><i class="fa fa-eye" aria-hidden="true"></i></div>-->
                  <div class="icon-style" v-on:click="selectTemplate(template)">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="template_card"
              v-if="templates && templates.length === 0"
            >No templates available</div>
          </div>
        </div>
        <div v-if="showList">
          <div class="fs-18 fw-500 pt-20 color_666669">
            Draft surveys
            <i
              class="fa fa-question-circle help_icon"
              aria-hidden="true"
              data-toggle="popover"
              tabindex="0"
              data-trigger="focus"
              data-content="Draft surveys are surveys that have not yet been scheduled and will not be included in your study. Set the schedule for a draft survey to include it in your study."
              data-html="true"
            ></i>
          </div>
          <div class="survey_data_table" v-if="draftSurveys && draftSurveys.length > 0">
            <div class="row headings">
              <div class="col-md-2">Name</div>
              <div class="col-md-2">Created</div>
              <div class="col-md-2">Last modified</div>
              <div class="col-md-2">Screens</div>
              <div class="col-md-2">Time to complete</div>
              <div class="col-md-2"></div>
            </div>
            <div class="row details" v-for="(survey, index) in draftSurveys">
              <div
                class="col-md-2 color_blue cursor_pointer word-break"
                v-on:click="goToSurveyDetails(survey, 'survey-review')"
              >{{survey.surveyTitle}}</div>
              <div class="col-md-2">{{new Date(survey.createdTime) | dateFormat('MMM DD, YYYY')}}</div>
              <div class="col-md-2">
                <span
                  v-if="survey.modifiedTime"
                >{{new Date(survey.modifiedTime) | dateFormat('MMM DD, YYYY')}}</span>
                <span v-if="!survey.modifiedTime"></span>
              </div>
              <div class="col-md-2">{{survey.questionCount + survey.instructionCount}}</div>
              <div class="col-md-2">{{survey.timeToComplete}}</div>
              <div class="col-md-2">
                <i class="fa fa-caret-down" aria-hidden="true" data-toggle="dropdown"></i>
                <ul class="dropdown-menu custom-dropdown">
                  <li v-on:click="goToSurveyDetails(survey, 'survey-review')">
                    <a>Edit</a>
                  </li>
                  <li>
                    <a v-on:click="exportSurveyFile(survey)">Export Survey file</a>
                  </li>
                  <li>
                    <a class="delete-link" v-on:click="deleteSurvey(survey, 'draft')">Delete</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            class="pt-20"
            v-if="!draftSurveys || draftSurveys.length === 0"
          >No Draft surveys exists</div>

          <div class="fs-18 fw-500 pt-40 color_666669">Scheduled surveys</div>
          <div class="survey_data_table" v-if="scheduledSurveys && scheduledSurveys.length > 0">
            <div class="row headings">
              <div class="col-md-2">Name</div>
              <div class="col-md-2 p-0">Description</div>
              <div class="col-md-2">Created</div>
              <div class="col-md-2 p-0">Last modified</div>
              <div class="col-md-1">Screens</div>
              <div class="col-md-2 p-0">Time to complete</div>
              <div class="col-md-1"></div>
            </div>
            <draggable
              v-model="scheduledSurveys"
              @start="drag=true"
              @end="drag=false"
              @change="onDragSurvey()"
            >
              <div class="row details" v-for="(survey, index) in scheduledSurveys" :key="index">
                <div
                  class="col-md-2 color_blue cursor_pointer"
                  v-on:click="goToSurveyDetails(survey, 'survey-review')"
                >{{survey.surveyTitle}}</div>
                <div class="col-md-2 p-0">{{survey.description}}</div>
                <div class="col-md-2">{{new Date(survey.createdTime) | dateFormat('MMM DD, YYYY')}}</div>
                <div class="col-md-2 p-0">
                  <span
                    v-if="survey.modifiedTime"
                  >{{new Date(survey.modifiedTime) | dateFormat('MMM DD, YYYY')}}</span>
                  <span v-if="!survey.modifiedTime"></span>
                </div>
                <div class="col-md-1">{{survey.questionCount + survey.instructionCount}}</div>
                <div class="col-md-2 p-0">{{survey.timeToComplete}}</div>
                <div class="col-md-1">
                  <i class="fa fa-caret-down" aria-hidden="true" data-toggle="dropdown"></i>
                  <ul class="dropdown-menu custom-dropdown">
                    <li v-on:click="goToSurveyDetails(survey, 'survey-review')">
                      <a>Edit</a>
                    </li>
                    <li>
                      <a v-on:click="exportSurveyFile(survey)">Export survey file</a>
                    </li>
                    <li>
                      <a class="delete-link" v-on:click="deleteSurvey(survey, 'scheduled')">Delete</a>
                    </li>
                  </ul>
                </div>
              </div>
            </draggable>
          </div>
          <div
            class="pt-20"
            v-if="!scheduledSurveys || scheduledSurveys.length === 0"
          >No surveys exists.</div>
          <div class="pt-20">
            <button class="btn btn-info create_btn br-30" v-on:click="toggleView()">Add survey</button>
          </div>
        </div>
        <div class="pt-20">
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
import swal from "sweetalert2";
import draggable from "vuedraggable";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "Participant-Surveys",
  data() {
    return {
      surveys: null,
      allTemplates: null,
      templates: null,
      searched: false,
      studyId: null,
      buildApiCall: null,
      activeTab: null,
      showList: null,
      filter: "default",
      sort: "default",
      searchTerm: null,
      draftSurveys: null,
      scheduledSurveys: null,
      sequence: 0,
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 100;
      window.$('[data-toggle="popover"]').popover();
    }, 1500);
    this.activeTab = "myTemplates";
    this.studyId = this.$route.params.studyId;
    this.getAllSurveys(this.studyId);
    this.getSurveyTemplates();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    typeChanged(type) {
      this.activeTab = type;
      this.templates = this.allTemplates.clientTemplates;
    },
    searchFilterSurveys(searchTerm, sort, filter) {
      if (searchTerm) {
        searchTerm = searchTerm.trim(); // eslint-disable-line
        this.searched = searchTerm.length > 0;
      }
      sort = _.cloneDeep(sort === "default" ? null : sort); // eslint-disable-line
      filter = _.cloneDeep(filter === "default" ? null : filter); // eslint-disable-line
      this.$api
        .surveySearchFilterFact(this.searchTerm, sort, filter)
        .then(response => {
          if (response.body) {
            this.allTemplates = response.body;
            this.typeChanged(this.activeTab);
          }
        });
    },
    toggleView() {
      this.showList = !this.showList;
    },
    deleteSurvey(survey, type) {
      let surveyIndex = null;

      swal({
        title: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api.deleteSurveyDetailsFact(this.studyId, survey.surveyId).then(
            () => {
              if (type === "draft") {
                surveyIndex = _.findIndex(this.draftSurveys, [
                  "surveyId",
                  survey.surveyId
                ]);
                this.draftSurveys.splice(surveyIndex, 1);
              } else {
                surveyIndex = _.findIndex(this.scheduledSurveys, [
                  "surveyId",
                  survey.surveyId
                ]);
                this.scheduledSurveys.splice(surveyIndex, 1);
              }
              toastr.success("Survey details deleted successfuly");
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while deleting the survey"
              );
            }
          );
        }
      });
    },
    getAllSurveys(studyId) {
      this.$api.getAllSurveysFact(studyId).then(
        response => {
          this.surveys = _.filter(response.body, o => !o.eproSurvey);
          this.sequence = Number(_.max(_.map(this.surveys, "sequence")));
          if (this.surveys.length > 0) {
            this.sequence = this.sequence + 1;
          }
          this.showList = _.cloneDeep(this.surveys && this.surveys.length > 0);
          this.surveys = _.groupBy(this.surveys, "scheduleAdded");
          this.draftSurveys = _.sortBy(this.surveys.false, "sequence");
          this.scheduledSurveys = _.sortBy(this.surveys.true, "sequence");
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the survey templates"
          );
        }
      );
    },
    getSurveyTemplates() {
      this.$api.getSurveyTemplatesFact().then(
        response => {
          this.allTemplates = response.body;
          this.typeChanged("myTemplates");
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the survey templates"
          );
        }
      );
    },
    selectTemplate(template) {
      this.$router.push({
        name: "survey-template-details",
        params: {
          studyId: this.studyId,
          surveyId: template.id,
          sequence: this.sequence
        }
      });
    },
    nextClick() {
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
    },
    createSurveys() {
      this.$router.push({
        name: "survey-details",
        params: { studyId: this.studyId, surveyId: 0, sequence: this.sequence }
      });
    },
    goToSurveyDetails(survey, path) {
      this.$router.push({
        name: path,
        params: { studyId: this.studyId, surveyId: survey.surveyId }
      }); // eslint-disable-line
    },
    onDragSurvey() {
      this.scheduledSurveys.forEach((item, index) => {
        this.scheduledSurveys[index].sequence = index;
      });
      const scheduledSequence =
        Number(_.max(_.map(this.scheduledSurveys, "sequence"))) + 1;
      this.draftSurveys.forEach((item, index) => {
        this.draftSurveys[index].sequence = scheduledSequence + index;
      });
      const allSurveys = _.concat(this.scheduledSurveys, this.draftSurveys);
      this.$api.updateAllSurveysOrderFact(this.studyId, allSurveys).then(
        () => {},
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while saving the data"
          );
        }
      );
    },
    exportSurveyFile(surveyObj){
      toastr.success("Survey file export in progress. Download will begin momentarily.");
      this.$api.getSurveyJsonFile(surveyObj.surveyId, this.studyId).then(response => {
        if (response.status=='200' && response.bodyText && response.bodyText!='') {
          $.getJSON(response.bodyText, function(data) {  
            var fileURL = window.URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
            var fileLink = document.createElement('a');
            fileLink.style = 'display: none';
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Survey.json');
            document.body.appendChild(fileLink);
            fileLink.click();
          });      
        }
      }, 
      error => {
        toastr.error(
          error.body && error.body.message
            ? error.body.message
            : "Error while downloading the survey json file"
        );
      });
    },
    onSurveyFileSelection(){
      var self = this;
      var fileObject = window.document.getElementById("survey-json-file");
      var surveyFile = fileObject.files[0];
      
      //Read the file data and verify that its in proper JSON format
      var fileread = new FileReader();
      fileread.onload = function(e) {
        //Now verify that the content is in proper JSON format or not
        let isJSONFile = self.isJSON(e.target.result);
        if(isJSONFile){
          //Upload JSON file
          self.uploadSurveyJSONFile(surveyFile);
        }else{
          fileObject.value = null;
          toastr.error('Import JSON File Error. No Survey Created. Fix error and re-upload.');
        }l
      };
      
      fileread.readAsText(surveyFile);
      
    },
    isJSON (jsonString){
      try {
          var o = JSON.parse(jsonString);

          // Handle non-exception-throwing cases:
          // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
          // but... JSON.parse(null) returns null, and typeof null === "object", 
          // so we must check for that, too. Thankfully, null is falsey, so this suffices:
          if (o && typeof o === "object") {
            return true;
          }
      }
      catch (e) { return false; }
      return false;
    },
    uploadSurveyJSONFile(jsonFile){
      const fd = new FormData();
      fd.append("survey", jsonFile);

      this.$api.postSurveyJsonFile(this.studyId, fd).then(
        response => {
          toastr.success(response.bodyText);
          window.document.getElementById("survey-json-file").value =null;
          this.getAllSurveys(this.studyId);
          this.showList = true;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while importing the survey json file"
          );
          window.document.getElementById("survey-json-file").value =null;
        }
      );
    }
  },
  components: { studyFeatureHeader, draggable, CancelModal }
};
</script>
<style lang="scss" src="../../../public/static/fonts.scss"></style>
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

.dropdown-menu > li > a {
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: 400;
  line-height: 1.42857143;
  color: #333;
  white-space: nowrap;
}

.dropdown-menu > li > a:focus,
.dropdown-menu > li > a:hover {
  color: #262626;
  text-decoration: none;
  background-color: #f5f5f5;
}

.footerStyle {
  .row {
    display: block;

    &:after {
      content: "";
      clear: both;
      display: block;
    }
  }
}

// End style for quick fixes bootstrap after migration (before redesign should be removed)

.templates_card {
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.06);
  margin-top: 20px;
  border-radius: 4px;
  border: solid 1px #d3dfe4;
}
.header_bg {
  background-color: #f5f8fa;
  padding: 10px 10px 0 10px;
}
.template_card {
  padding: 10px;
  border-bottom: solid 1px #d3dfe4;
}
.active_tab {
  color: #4c8ce3;
  border-bottom: 2px solid #4c8ce3;
}
.desc {
  color: #fff;
  font-size: 24px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.create_btn {
  width: 180px;
}
.search_input {
  padding-left: 30px;
}
.search_icon {
  position: absolute;
  top: 9px;
  left: 10px;
  color: #b2b2b2;
}
.delete-btn {
  color: #ffffff;
  border-radius: 100px;
  background-color: #ff4848;
}

.noThanks-btn {
  margin-top: 10px;
  color: #ffffff;
  border-radius: 100px;
  background-color: #34537d;
}
.survey_data_table {
  border: solid 1px #d3dfe4;
  border-radius: 2px;
  margin-top: 5px;
  .headings {
    padding: 10px 0;
    border-bottom: solid 1px #d3dfe4;
    div {
      color: #838e93;
    }
  }
  .details {
    padding: 16px 0;
    border-bottom: solid 1px #d3dfe4;
    div {
      color: #4a4a4a;
    }
  }
}
.icon-style {
  border: 1px solid #eee;
  background-color: #f5f8fa;
  padding-right: 7px;
  padding-top: 3px;
  width: 28px;
  height: 28px;
  display: inline-block;
  border-radius: 20px;
}
.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}

div.custom-upload-btn {
  position: relative;
  overflow: hidden;
  padding: 0.375rem 1rem;
}

div.custom-upload-btn input {
  position: absolute;
  font-size: 50px;
  opacity: 0;
  right: 0;
  top: 0;
}

div.custom-upload-btn span.beta-txt{
  font-size: 10px;
  font-family: Lato-bold;
  border-radius: 3px;
  margin-left: 7px;
  margin-top: -1px;
  color: #4c8ce4;
  background: #fff;
  padding: 2px 8px 0px;
  vertical-align: middle;
  display: inline-block;
}

ul.dropdown-menu.custom-dropdown {
  padding-top:0;
  padding-bottom:0;
  li:last-of-type{
    border-bottom: 0;
  }
  li {
    border-bottom: 1px solid #d3dfe4;
    
    a {
      color: #666669;
      font-size: 14px;
      line-height: 1.43;
      font-weight: normal;
      padding: 12px 20px;
      cursor: pointer;
    }

    a.delete-link{
      color: #f16559
    }
  }
  
}

</style>
