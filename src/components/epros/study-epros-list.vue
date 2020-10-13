<template>
  <div class="surveys">
    <eproHeader></eproHeader>
    <div id="mySidenav" class="sidenav">
      <eprosSideMenu :options="eprosList"></eprosSideMenu>
    </div>
    <div id="main">
      <div v-if="!nav_open">
        <span class="nav-button" id="nav" v-on:click="openNav()"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></span>
      </div>
      <div v-if="nav_open">
        <span class="nav-button" id="nav" v-on:click="closeNav()"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></span>
      </div>
      <div class="container pt-100">
        <div class="pl-10-xs">
          <div class="header_title">ePROs in this study</div>
          <div class="row">
            <div class="col-xs-4 col-sm-2 p-0">
              <img src="static/img/survey_builder_icon.png" alt="" class="survey_icon">
            </div>
            <div class="col-xs-8 col-sm-10">
              <div class="pt-10 pb-10 fs-24">Add ePROs from the library on the right</div>
            </div>
          </div>
        </div>
        <div class="pt-20" v-if="surveysList.length > 0">
          <div class="pl-10-xs">
            <div class="inner-card col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <table class="table table-striped mb-0">
                <thead>
                  <tr>
                    <th class="color_grey text-center fs-12-xs">Name</th>
                    <th class="color_grey text-center fs-12-xs">Created</th>
                    <th class="color_grey text-center fs-12-xs">Last Modified</th>
                    <th class="color_grey text-center display-none-xs">Questions</th>
                    <th class="color_grey text-center display-none-xs">Time to complete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="survey in surveysList" class="survey_table_content" v-if="survey.eproSurvey">
                    <td class="color_blue text-center fs-12-xs">{{survey.surveyTitle}}</td>
                    <td class="text-center fs-12-xs">{{survey.createdTime}}</td>
                    <td class="text-center fs-12-xs">{{survey.createdTime}}</td>
                    <td class="display-none-xs text-center">7</td>
                    <td class="display-none-xs text-center">10 min.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from 'toastr';
import eproHeader from '../common/epro-header';

export default {
  name: 'surveys',
  data() {
    return {
      eprosList: [],
      surveysList: [],
      studyId: null,
      nav_open: false,
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.openNav();
    this.getSurveyList();
    this.getListOfEpros();
  },
  methods: {
    getSurveyList() {
      this.$api.getAllSurveysFact(this.studyId).then(
        response => {
          this.surveysList = response.body.filter(o => o.eproSurvey);
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the surveys list',
          );
        },
      );
    },
    getListOfEpros() {
      this.$api.getAllEprosFact(this.studyId).then(
        response => {
          this.eprosList = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the epros.',
          );
        },
      );
    },
    openNav() {
      this.nav_open = true;
      if (window.outerWidth <= 576) {
        window.document.getElementById('mySidenav').style.width = '250px';
        window.document.getElementById('nav').style.right = '250px';
      } else {
        window.document.getElementById('mySidenav').style.width = '400px';
        window.document.getElementById('nav').style.right = '400px';
      }
    },
    closeNav() {
      this.nav_open = false;
      window.document.getElementById('mySidenav').style.width = '0';
      window.document.getElementById('nav').style.right = '0';
    },
    goToSurveyTypeSelection() {
      this.$router.push({ name: 'study-survey-select-type', params: { studyId: this.studyId } });
    },
  },
  components: { eproHeader /* eprosSideMenu */ },
};
</script>

<style scoped lang="scss">
.background {
  background: #01b7fe;
}

.header_title {
  color: #01b7fe;
  padding: 16px 0;
  font-size: 24px;
}

.survey_icon {
  min-width: 80px;
  max-width: 140px;
  width: 100%;
}

a {
  color: #fff;
  text-decoration: none;
}

.ml-50 {
  margin-left: 50px !important;
}

.pr-5 {
  padding-right: 5px;
}

.nav-bar-bottom {
  border-bottom-color: #d7eef6;
  border-radius: 0px;
}

.survey_table_content {
  td {
    padding: 15px;
  }
}

.custom-btn-bg {
  background: linear-gradient(to left, #5c7be4, #2bd5f1);
  color: #fff;
  padding: 10px 40px;
}

.inner-card {
  border: 1px solid #ddd;
  box-shadow: 1px 0px 1px 1px #ddd;
  padding: 0px;
  /*width: 100%;*/
}

.nav-button {
  position: fixed;
  top: 70px;
  right: 0px;
  transition: 0.5s;
  font-size: 25px;
  cursor: pointer;
  color: #bab5b5;
  background-color: #d2cfcf;
  padding: 0px 5px;
  z-index: 999;
}

.sidenav {
  width: 0;
  position: fixed;
  z-index: 999;
  top: 60px;
  right: 0;
  background-color: #f5f5f5;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 15px;
  height: 93%;
  border-left: 2px solid #ddd;
}

.sidenav a:hover,
.offcanvas a:focus {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

td {
  color: #4a4a4a;
  padding-top: 15px !important;
}

th {
  padding: 15px !important;
}
</style>
