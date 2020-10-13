<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20 pb-20">
        <div v-if="showList === false">
          <div class="pt-10" v-if="epros && epros.length > 0">
            <button class="btn btn-link pl-0 pr-0 color_b8c7ce" v-on:click="toggleView()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back to my ePROs
            </button>
          </div>
          <div class="pt-15 fw-500">Select from a list of ePROs below.</div>

          <!-- <div class="custom-upload-btn btn btn-info br-30" v-if="accesss == true"> -->
          <div
            v-if="isEproActivated && canSysAdminAccess"
            class="custom-upload-btn btn btn-info br-30"
          >
            Create ePRO
            <span class="beta-txt">BETA</span>
            <input
              v-on:click="createEpro()"
              id="create_epro"
              :to="{ name: 'epro-create', params: { studyId: studyId } }"
              class="cursor_pointer"
            />
          </div>

          <div class="row templates_card">
            <div class="row header_bg">
              <div class="col-md-12 col-sm-12 col-xs-12 pb-10 pl-0 pr-0">
                <div class="col-md-6 col-sm-6 col-xs-12 pl-0">
                  <input
                    type="text"
                    class="form-control mb-10 br-25 search_input"
                    v-model="searchTerm"
                    placeholder="Search"
                    @keyup.enter="eprosSearchFilterSurveys(searchTerm, sort, filter)"
                  />
                  <i class="fa fa-search search_icon" aria-hidden="true"></i>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 mb-10 pr-0 pull-right">
                  <select
                    class="form-control select-style select_control br-25 display-none"
                    v-model="filter"
                    v-on:change="eprosSearchFilterSurveys(searchTerm, sort, filter)"
                    disabled
                  >
                    <option value="default">Filters</option>
                    <option value="default">None</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 pull-right">
                  <select
                    class="form-control select-style select_control br-25"
                    v-model="sort"
                    v-on:change="eprosSearchFilterSurveys(searchTerm, sort, filter)"
                  >
                    <option value="default" disabled>Sort</option>
                    <option value="default">None</option>
                    <option value="Asc">A-Z</option>
                    <option value="Desc">Z-A</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              class="template_card"
              v-for="epro in eproTemplates"
              v-if="eproTemplates && eproTemplates.length > 0"
            >
              <div class="row">
                <div class="col-lg-10 col-md-10 p-0">
                  <div>
                    {{epro.surveyTitle}}
                    &nbsp;
                    <i
                      v-if="isEproActivated && epro.scope == 1"
                      class="fas fa-user-edit"
                      aria-hidden="true"
                      data-toggle="dropdown"
                    ></i>
                  </div>
                  <div class="template-text">{{epro.desc}}</div>
                </div>
                <div class="col-lg-2 col-md-2 text-right">
                  <div class="icon-style cursor_pointer" v-on:click="selectEpo(epro)">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                  </div>
                </div>
                <!-- <div class="col-lg-1 col-md-1 text-right"> -->
                <div v-if="isEproActivated && epro.scope == 1">
                  <!-- code edit/delete ------------------------->
                  <i
                    class="fa fa-caret-down"
                    style="font-size:24px; "
                    aria-hidden="true"
                    data-toggle="dropdown"
                  ></i>
                  <ul class="dropdown-menu custom-dropdown">
                    <li v-on:click="goToEproEdit(epro, 'epro-create')">
                      <a>Edit</a>
                    </li>
                    <li v-on:click="deleteEproV2(epro)">
                      <a
                        class="color_grey fs-16 pt-10"
                        data-toggle="modal"
                        data-target="#deleteModal"
                      >
                        <font color="red">Delete</font>
                      </a>
                    </li>
                  </ul>
                  <!-- code edit/delete ---------------------- -->
                </div>
                <!-- </div>   -->
              </div>
            </div>
            <div
              class="template_card"
              v-if="eproTemplates && eproTemplates.length === 0"
            >No ePro templates avaialble</div>
          </div>
        </div>
        <div v-if="showList">
          <div class="fs-18 fw-500 pt-20 color_666669">Your ePROs</div>
          <div class="epro_data_table" v-if="epros && epros.length > 0">
            <div class="row headings">
              <div class="col-md-2">Name</div>
              <div class="col-md-2">Added</div>
              <div class="col-md-2">Last modified</div>
              <div class="col-md-2">Questions</div>
              <div class="col-md-2">Time to complete</div>
              <div class="col-md-2"></div>
            </div>
            <div class="row details" v-for="epro in epros">
              <div
                class="col-md-2 color_blue cursor_pointer"
                v-on:click="goToEproDetails(epro, 'epro-scheduler')"
              >{{epro.surveyTitle}}</div>
              <div class="col-md-2">{{new Date(epro.createdTime) | dateFormat('MMM DD, YYYY')}}</div>
              <div class="col-md-2">{{new Date(epro.modifiedTime) | dateFormat('MMM DD, YYYY')}}</div>
              <div class="col-md-2">{{epro.questionCount}}</div>
              <div class="col-md-2">{{epro.timeToComplete}}</div>
              <div class="col-md-2">
                <i class="fa fa-caret-down" aria-hidden="true" data-toggle="dropdown"></i>
                <ul class="dropdown-menu custom-dropdown">
                  <li v-on:click="goToEproDetails(epro, 'epro-scheduler')">
                    <a class="color_grey fs-16">
                      <i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Edit
                    </a>
                  </li>
                  <li v-on:click="deleteEpro(epro)">
                    <a
                      class="color_grey fs-16 pt-10"
                      data-toggle="modal"
                      data-target="#deleteModal"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> &nbsp; Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="pt-20" v-if="!epros || epros.length === 0">No ePROs exists.</div>
          <div class="pt-20">
            <button class="btn btn-info create_btn br-30" v-on:click="toggleView()">Add an ePRO</button>
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
import { mapGetters } from "vuex";
import swal from "sweetalert2";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";
import { SYSTEM_ADMIN } from "@/constants/authRoles";
import { AclRule } from "vue-acl";

export default {
  name: "Participant-Surveys",
  data() {
    return {
      eproTemplates: [],
      epros: [],
      isEproActivated: false,
      studyId: null,
      nav_open: false,
      showList: null,
      filter: "default",
      sort: "default",
      searchTerm: null,
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  components: { studyFeatureHeader, CancelModal },
  computed: {
    ...mapGetters(["user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check("userAccess");
    }
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    if (this.$route.params.hasOwnProperty("showList"))
      this.showList = this.$route.params.showList;
    this.getEprosList();

    this.getAllSurveys(this.studyId, this.showList);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 150;
    }, 1500);
  },
  methods: {
    goBack() {
      window.history.back();
    },
    createEpro() {
      this.$router.push({
        name: "epro-create",
        params: { studyId: this.studyId, eproId: 0, sequence: this.sequence }
      });
    },
    goToEproEdit(epro, path) {
      this.$router.push({
        name: path,
        params: { eproId: epro.surveyId }
      });
    },
    goToEproEdit(epro, path) {
      this.$router.push({
        name: path,
        params: { eproId: epro.surveyId }
      });
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
    goToEproDetails(epro, path) {
      this.$router.push({
        name: path,
        params: { studyId: this.studyId, surveyId: epro.surveyId }
      }); // eslint-disable-line
    },
    eprosSearchFilterSurveys(searchTerm, sort, filter) {
      if (searchTerm) {
        searchTerm = searchTerm.trim(); // eslint-disable-line
        this.searched = searchTerm.length > 0;
      }
      sort = _.cloneDeep(sort === "default" ? null : sort); // eslint-disable-line
      filter = _.cloneDeep(filter === "default" ? null : filter); // eslint-disable-line
      let userRoleCanCreateEpro = ["SystemAdmin"];
      if (
        this.user &&
        this.isEproActivated &&
        _.includes(userRoleCanCreateEpro, this.user.userRole)
      ) {
        this.$api
          .eprosSearchFilterV2Fact(this.searchTerm, sort, filter)
          .then(response => {
            if (response.body) {
              this.eproTemplates = response.body;
            }
          });
      } else {
        this.$api
          .eprosSearchFilterFact(this.searchTerm, sort, filter)
          .then(response => {
            if (response.body) {
              this.eproTemplates = response.body;
            }
          });
      }
    },
    toggleView() {
      this.showList = !this.showList;
      console.log(this.showList, "show list");
    },
    getAllSurveys(studyId, showList) {
      this.$api.getAllSurveysFact(studyId).then(
        response => {
          this.epros = _.filter(response.body, o => o.eproSurvey);
          if (this.showList == false) {
            this.showList = false;
          } else {
            this.showList = this.epros.length > 0;
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the epro templates"
          );
        }
      );
    },
    selectEpo(epro) {
      this.$router.push({
        name: "epro-details",
        params: { studyId: this.studyId, eproId: epro.surveyId }
      });
    },
    getEprosList() {
      this.$api.isEproActivated().then(
        response => {
          this.isEproActivated = response.body;
          let userRoleCanCreateEpro = ["SystemAdmin"];
          if (
            this.user &&
            this.isEproActivated &&
            _.includes(userRoleCanCreateEpro, this.user.userRole)
          ) {
            this.$api.getAllEprosV2Fact().then(
              response => {
                this.eproTemplates = response.body;
              },
              error => {
                toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while getting the epros."
                );
              }
            );
          } else {
            this.$api.getAllEprosFact(this.studyId).then(
              response => {
                this.eproTemplates = response.body;
              },
              error => {
                toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while getting the epros."
                );
              }
            );
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the epros activation status."
          );
        }
      );
    },
    deleteEpro(epro) {
      const surveyIndex = _.findIndex(this.epros, ["surveyId", epro.surveyId]);
      swal({
        title: "Are you sure you want to delete this ePRO?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api.deleteSurveyDetailsFact(this.studyId, epro.surveyId).then(
            () => {
              this.epros.splice(surveyIndex, 1);
              toastr.success("ePRO details deleted successfuly");
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while deleting the ePRO"
              );
            }
          );
        }
      });
    },
    deleteEproV2(epro) {
      const surveyIndex = _.findIndex(this.epros, ["surveyId", epro.surveyId]);
      swal({
        title: "Are you sure you want to delete this ePRO?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api.deleteEproDetailsFact(epro.surveyId).then(
            () => {
              this.epros.splice(surveyIndex, 1);
              toastr.success("ePRO deleted successfuly");
              this.getEprosList();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while deleting the ePRO"
              );
            }
          );
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
    }
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

div.custom-upload-btn {
  position: relative;
  overflow: hidden;
  padding: 0.375rem 1rem;
  width: 180px;
  margin: 10px 10px 0 0;
}

div.custom-upload-btn input {
  position: absolute;
  font-size: 50px;
  opacity: 0;
  right: 0;
  top: 0;
}

div.custom-upload-btn span.beta-txt {
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
// .custom-dropdown {
//   z-index: 90;
//   cursor: pointer;
// }

ul.dropdown-menu.custom-dropdown {
  z-index: 90;
  padding-top: 0;
  padding-bottom: 0;
  li:last-of-type {
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
    a.delete-link {
      color: #f16559;
    }
  }
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

select.form-control {
  height: 34px !important;
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
  .col-md-99 {
    max-width: 3.33%;
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
    width: 14.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
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
.search_input {
  padding-left: 30px;
}
.search_icon {
  position: absolute;
  top: 9px;
  left: 10px;
  color: #b2b2b2;
}
.create_btn {
  width: 180px;
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
  color: #333;
}
.epro_data_table {
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
</style>