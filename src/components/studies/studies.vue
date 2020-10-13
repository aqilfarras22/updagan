<template>
  <div class="studies_bg">
    <mainHeader></mainHeader>
    <div class="container">
      <div class="row has-header" v-if="(studies.length > 0) || (studies.length === 0 && searched)">
        <div class="col-md-12 col-sm-12 col-xs-12 pb-20 pt-30">
          <div class="col-md-10 col-sm-10 col-xs-10 p-0">
            <div class="col-md-4 col-sm-4 col-xs-12 pl-0">
              <input
                type="text"
                class="form-control mb-10 br-25 search-field"
                placeholder="Search..."
                v-model="searchTerm"
                @keyup.enter="searchFilterStudies(searchTerm,sort,filter)"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 mb-10 select_section">
              <select
                class="select_white form-control select-style select_control br-25"
                v-model="sort"
                v-on:change="searchFilterStudies(searchTerm,sort,filter)"
              >
                <!--<option>Most recent</option>-->
                <option value="default" disabled>Sort</option>
                <option value="default">None</option>
                <option value="Asc">A-Z</option>
                <option value="Desc">Z-A</option>
              </select>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 select_section">
              <select
                class="select_white form-control select-style select_control br-25"
                v-model="filter"
                v-on:change="searchFilterStudies(searchTerm,sort,filter)"
              >
                <option value="default" disabled>Filters</option>
                <option value="default">None</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Complete">Complete</option>
                <!--<option value="">In other studies</option>-->
              </select>
            </div>
          </div>
          <div class="col-md-2 col-sm-2 col-xs-2 text-right p-0" v-if="canCreateStudy()">
            <span class="cursor_pointer" v-on:click="createNewStudy()">
              <div class="btn-box">
                <span class="create_button">
                  <span class="plus_icon">+</span>
                </span>
                <span class="text-btn">New study</span>
              </div>
              <!--<i class="fa fa-plus-circle create_button" aria-hidden="true"></i>-->
            </span>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-6 col-md-6 col-lg-3 pl-10 pr-10"
          v-for="study in studies"
          v-if="studies.length > 0"
        >
          <div class="panel panel-default no-border">
            <div class="panel-body study-card cursor_pointer">
              <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 p-0">
                <button
                  type="button"
                  class="btn btn-success status_btn"
                  v-bind:class="{ 'outline-active': (study.status == 'Active'), 'outline-inactive': (study.status == 'Draft'), 'outline-complete': (study.status == 'Complete') }"
                  v-if="study.status"
                >{{study.status | capitalize}}</button>
              </div>
              <div v-if="user && user.userRole !== 'Pi' && user.userRole !== 'SiteDataLock'">
                <div
                  class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-25 pr-0 dropdown"
                  v-if="study.status === 'Draft'"
                  style="text-align:right;"
                >
                  <i class="fa fa-ellipsis-h icon-style" aria-hidden="true" data-toggle="dropdown"></i>
                  <ul class="dropdown-menu custom-dropdown">
                    <li>
                      <a
                        class="color_grey fs-14"
                        data-toggle="modal"
                        data-target="#deleteModal"
                        v-on:click="selectedStudy = study"
                      >
                        <i class="fa fa-trash" aria-hidden="true"></i>&nbsp; Delete
                      </a>
                    </li>
                    <li>
                      <a class="color_grey fs-14" v-on:click="deleteStudy(study, 'Archived')">
                        <i class="fa fa-archive" aria-hidden="true"></i>&nbsp; Archive
                      </a>
                    </li>
                  </ul>
                </div>
                <div
                  class="col-lg-1 col-md-1 col-sm-1 col-xs-1 pl-25 dropdown"
                  v-if="study.status === 'Complete'"
                >
                  <i class="fa fa-ellipsis-h icon-style" aria-hidden="true" data-toggle="dropdown"></i>
                  <ul class="dropdown-menu custom-dropdown">
                    <li>
                      <a class="color_grey fs-14" v-on:click="deleteStudy(study, 'Archived')">
                        <i class="fa fa-archive" aria-hidden="true"></i>&nbsp; Archive
                      </a>
                    </li>
                    <!-- <li>
                    <a class="color_grey fs-14 pt-10" data-toggle="modal" data-target="#deleteModal">
                      <i class="fa fa-trash" aria-hidden="true"></i>&nbsp; Delete
                    </a>
                    </li>-->
                  </ul>
                </div>
              </div>
              <!-- Modal -->
              <div id="deleteModal" class="modal fade" role="dialog" data-backdrop="static">
                <div class="modal-dialog">
                  <!-- Modal content-->
                  <div class="modal-content">
                    <div class="pt-10 pr-20 pl-20">
                      <h4
                        class="modal-title text-center pt-20"
                      >Are you sure you want to delete this draft?</h4>
                    </div>
                    <div class="row pl-50 pr-50 pt-50 pb-40">
                      <button
                        class="btn btn-block btn-lg delete-btn"
                        v-on:click="deleteStudy(selectedStudy, 'Delete')"
                      >Yes, delete</button>
                      <button
                        class="btn btn-block btn-lg cancel-delete-btn"
                        v-on:click="closeModal()"
                      >No, keep draft</button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-on:click="goToStudy(study)">
                <h3 class="study-name">{{study.name}}</h3>
                <div class="os_icons">
                  <span v-if="study.ios">
                    <i class="fa fa-apple color_00 fs-20" aria-hidden="true"></i>
                  </span>
                  <span v-if="study.android" class="pl-10">
                    <i class="fa fa-android color_android fs-20" aria-hidden="true"></i>
                  </span>
                  <span v-if="study.web">
                    <img class="color_00 web-icn fs-20" aria-hidden="true" src="static/img/participant-web-img/web-icon.png" />
                  </span>
                </div>
                <div
                  class="date_val"
                >Created {{new Date(study.createdTime) | dateFormat('MMM DD, YYYY')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- TODO: refactor code for user roles  -->
      <div v-if="(studies.length == 0 && !searched && !studiesAvailable) && canCreateStudy()">
        <div class="row has-header pt-40">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="text_desc">You're ready to create your first study!</div>
            <div class="text_desc">We'll walk to you through each step along the way</div>
            <div class="text_desc pt-40">Go ahead, press the button. We know you want to.</div>
            <div class="create_btn_section">
              <button class="btn create-btn" v-on:click="createNewStudy()">Create</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="studies.length == 0 && searched">
        <div class="row pt-10">
          <div class="col-sm-12 fs-18 color_ff">No studies found with this name</div>
        </div>
      </div>
      <div class="bottom_footer">
        <div class>
          Questions or need help? Go to our
          <a
            href="https://thread.zendesk.com/hc/en-us/restricted?return_to=https%3A%2F%2Fthread.zendesk.com%2Fhc%2Fen-us"
            target="_blank"
            class="fs-14 cursor_pointer"
          >Knowledge Base</a> .
        </div>
        <Copyright />
      </div>
    </div>
  </div>
</template>

<script>
// import jwt from 'jwt-decode';
import { mapGetters } from "vuex";
import toastr from "toastr";
import _ from "lodash";
import mainHeader from "../common/main-header";
import Copyright from "../common/copyright";

export default {
  name: "Studies",
  data() {
    return {
      studies: [],
      studiesAvailable: true,
      searchTerm: null,
      searched: false,
      filter: "default",
      sort: "default"
    };
  },
  mounted() {
    this.getAllStudies();
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    getAllStudies() {
      this.$api.getAllStudiesFact().then(
        response => {
          console.log("response",response)
          if (response.body) {
            this.studies = response.body;
            if (this.studies && this.studies.length === 0) {
              this.studiesAvailable = false;
            }
          }
        },
        () => {
          this.studiesAvailable = false;
        }
      );
    },
    deleteStudy(study, status) {
      this.$api.deleteStudyFact(study.studyId, status).then(
        response => {
          const studyIndex = _.findIndex(this.studies, [
            "studyId",
            study.studyId
          ]);
          if (status === "Delete") {
            this.studies.splice(studyIndex, 1);
          } else {
            this.studies[studyIndex].status = "Archived";
          }
          this.selectedStudy = {};
          toastr.success(response.data.message);
          window.$("#deleteModal").modal("hide");
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while deleting the study details"
          );
        }
      );
    },
    closeModal() {
      this.selectedStudy = {};
      window.$("#deleteModal").modal("hide");
    },
    searchStudies(searchTerm) {
      searchTerm = searchTerm.trim(); // eslint-disable-line
      this.searched = searchTerm.length > 0;
      this.$api.searchStudiesFact(searchTerm).then(response => {
        if (response.body) {
          this.studies = response.body;
        }
      });
    },
    searchFilterStudies(searchTerm, sort, filter) {
      if (searchTerm) {
        searchTerm = searchTerm.trim(); // eslint-disable-line
        this.searched = searchTerm.length > 0;
      }
      sort = _.cloneDeep(sort === "default" ? null : sort); // eslint-disable-line
      filter = _.cloneDeep(filter === "default" ? null : filter); // eslint-disable-line
      this.$api
        .searchFilterFact(this.searchTerm, sort, filter)
        .then(response => {
          if (response.body) {
            this.studies = response.body;
          }
        });
    },
    createNewStudy() {
      if (this.user && this.user.userRole !== "Pi") {
        window.localStorage.setItem("thread-studySummary", false);
        this.$router.push({ name: "study-design", params: { studyId: 0 } });
      } else {
        toastr.warning("Access restricted");
      }
    },
    goToStudy(study) {
      console.log("study ",study)
      if (this.user && this.user.userRole !== "Pi") {
        if (study.routeName) {
          this.$router.push({
            name: study.routeName,
            params: { studyId: study.studyId }
          });
        } /*else if (study.currentUrl) {
          // this.$router.go(study.currentUrl);
          window.location.href = study.currentUrl;
        } else if (study.status === "Draft") {
          this.$router.push({
            name: "features-library",
            params: { studyId: study.studyId }
          });
        }*/ else {
          this.$router.push({
            name: "dashboard",
            params: { studyId: study.studyId }
          });
        }
      } else {
        this.$router.push({
          name: "dashboard",
          params: { studyId: study.studyId }
        });
      }
    },
    canCreateStudy() {
      //User roles that cann create study
      let userRoleCanCreateStudy = ["StudyAdmin", "SystemAdmin"];
      return this.user && _.includes(userRoleCanCreateStudy, this.user.userRole)
        ? true
        : false;
    }
  },
  components: { mainHeader, Copyright }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

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
  flex: none;
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
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.search-field {
  padding-right: 30px;
  background-image: url("/static/img/icon-search.gif");
  background-repeat: no-repeat;
  background-position: 97% 50%;
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
    flex: none;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
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
    flex: none;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
}

h3 {
  padding-bottom: 30px;
  color: #000;
  font-weight: 400;
}
.dropdown-menu > li > a {
  padding: 5px;
}
.btn-box {
  width: 130px;
  height: 36px;
  background-color: #2d3752;
  border-radius: 30px;
  float: right;
}
.text-btn {
  color: #fff;
  font-size: 16px;
  text-align: center;
  float: left;
  padding-top: 6px;
  padding-left: 10px;
}
.studies_bg {
  background: url("/static/img/bg/login_bg.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  /*color: #fff;*/
  background-color: #34537d;
  background-blend-mode: soft-light;
}

.icon-style {
  font-size: 22px;
  color: #c5c5c5;
  position: relative;
  top: -8px;
}
.panel-body {
  min-height: 180px;
  height: 180px;
}

.status_btn {
  font-size: 12px;
  border-radius: 20px;
  line-height: 16px;
}

.select_control {
  background-repeat: no-repeat;
  background-color: #d3dfe4;
  padding: 0 10px !important;
  border: none;
  height: 34px !important;
}

.custom-dropdown {
  min-width: 119px;
  position: absolute;
  //left: -90px;
  left: auto !important;
  right: 40px !important;
  top: 7px !important;
  padding: 5px 0px !important;
  margin: 0px !important;
}

.create_button {
  float: left;
  color: #5989e4;
  margin-top: 3px;
  margin-left: 5px;
  font-size: 32px;
  width: 30px;
  height: 30px;
  background-color: #ff7171;
  display: inline-block;
  border-radius: 50%;
  .plus_icon {
    color: #ffffff;
    position: relative;
    bottom: 11px;
    right: 6px;
  }
}
.mac {
  .create_button {
    .plus_icon {
      bottom: 9px;
    }
  }
}

.text_desc {
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-weight: 100;
  padding: 2px 0;
}

.create_btn_section {
  padding: 20px 0;
  text-align: center;
}

.fontStyle {
  font-family: sans-serif;
  font-size: 4rem;
  margin-bottom: 50px;
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #fff;
  text-decoration: none;
  font-size: 25px;
}

.os_icons {
  position: absolute;
  bottom: 32px;
}

.date_val {
  position: absolute;
  bottom: 12px;
  color: #aaa;
  font-size: 12px;
}

button {
  cursor: pointer;
}

.outline-active {
  background: none;
  /*border: 1px solid #01B7FE;*/
  color: #fff;
}

.outline-inactive {
  background-color: #959fa4 !important;
  border-color: #959fa4 !important;
}

.outline-complete {
  background-color: #34537d !important;
  border-color: #34537d !important;
}

p {
  font-size: 15px;
}

.no-border {
  border: none;
}

.study-card {
  background-color: #f5f8fa;
  padding: 15px;
  position: relative;
}

.new-card {
  background-color: #01b7fe;
  text-align: center;
  height: 200px;
  padding-top: 80px;
}

.create-btn {
  border-radius: 10px;
  width: 120px;
  height: 100px;
  background: linear-gradient(#fff, #d0e8f5);
  color: #51adf4;
  font-size: 24px;
  border: none;
  box-shadow: 0px 5px 5px #4c83cc;
}

.bottom_footer {
  text-align: center;
  bottom: 10px;
  font-size: 14px;
  font-weight: 200;
  width: inherit;
  padding-top: 20px;
  padding-bottom: 20px;
  color: #fff;
  clear: both;
}
.web-icn{
    padding-left: 8px;
    padding-bottom: 4px;
}

.header {
  padding-top: 20px;
  padding-bottom: 10px;
}

.user-icon {
  padding-right: 10px;
  color: yellow;
}

.logout_link {
  line-height: 12px;
  font-size: 14px;
}

.study-name {
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
  color: #4a4a4a;
  width: 100%;
  margin: 20px 0 10px;
  font-size: 24px;
}
.no-border{
  text-align: left !important;
}
.delete-btn {
  display: block !important;
  width: 100% !important;
  color: #ffffff;
  border-radius: 100px;
  background-color: #ff4848 !important;
}
.cancel-delete-btn {
  display: block !important;
  width: 100% !important;
  background-color: #34537d !important;
  color: #ffffff !important;
  border-radius: 100px !important;
}
</style>
