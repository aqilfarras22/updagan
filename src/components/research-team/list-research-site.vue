<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-30">
        <!-- Display create site option if no sites created -->
        <!-- <div v-if="!researchSites.length">
          <b-row align-h="center">
            <b-col cols="2"></b-col>
            <b-col cols="8" align-self="center" class="text_desc pt-100 fs-30">
              <b-row>
                <img src="static/img/icn-site@2x.png" width="155" height="155">
                <div class="pl-40">
                  <div class="text_desc pt-30 fs-20"><b>You don’t have any sites for this study yet.</b></div>
                  <div class="sec_text fs-14">Why don’t you create one.</div>
                  <div class="pt-10">
                    <button class="btn btn-primary create-btn fs-14" @click="createSiteForm()">Create a site</button>
                  </div>
                </div>
              </b-row>
            </b-col>
            <b-col cols="2"></b-col>
          </b-row>
        </div> -->
        <!-- Display all the avilable sites and other options -->
        <div>
          <!-- Research sites search box and create option -->
          <b-row class="pb-20 pl-14">
            <b-col cols="3" class="p-0">
              <input type="text" class="form-control input-lg mb-10 br-3 search-field" placeholder='Search' v-model="searchTerm" @keyup.enter="searchSite(searchTerm)">
            </b-col>
            <b-col cols="7" class="text-right">
              <b-btn variant="primary" class="create-btn2 fs-12" @click="createSiteForm()" v-if="studyType === 'byinvitation' && user.userRole !== 'Quality'">Create a site</b-btn>
            </b-col>
            <b-col cols="2">
            </b-col>
          </b-row>
          <!-- Table for all research sites details -->
          <b-row class="p-0">
            <b-col cols="10">
              <b-row class="pb-20">
                <b-col cols="3" class="header-text">
                  PI NAME
                </b-col>
                <b-col cols="1" class="header-text"> 
                  SITE ID
                </b-col>
                <b-col cols="4" class="header-text">
                  SITE NAME
                </b-col>
                <b-col cols="2" class="header-text"> 
                  SITE STATUS
                </b-col>
                <b-col cols="2" class="header-text">
                  PI STATUS
                </b-col>
              </b-row>
              <!-- Each site detail row -->
              <b-row class="site-card mb-10" align-v="center" v-for="(site,index) in researchSites" :key="index">
                <b-col cols="3">
                  <span v-if="site.sitePI">
                    <img class="profile-img-size" src="/static/img/profile.png" alt="user-img"/>
                    <span class="name fs-14 pt-3"><b> {{site.sitePI.firstName}} {{site.sitePI.lastName}} </b></span>
                  </span>
                </b-col>
                <b-col cols="1">
                  <span class="word-break">{{site.userSiteId}}</span>
                </b-col>
                <b-col cols="4">
                  <span class="word-break">{{site.name}}</span>
                </b-col>
                <b-col cols="2">
                  <span class="text-warning" v-if="site.status == 'Pending'">{{site.status}}</span>
                  <span class="text-success" v-if="site.status == 'Active'">{{site.status}}</span>
                  <span class="text-danger" v-if="site.status == 'Inactive'">{{site.status}}</span>
                </b-col>
                <b-col cols="1">
                  <span v-if="site.sitePI">
                    <span class="text-warning" v-if="site.sitePI.status == 'Pending'">{{site.sitePI.status}}</span>
                    <span class="text-success" v-if="site.sitePI.status == 'Active'">{{site.sitePI.status}}</span>
                    <span class="text-danger" v-if="site.sitePI.status == 'Inactive'">{{site.sitePI.status}}</span>
                  </span>
                </b-col>
                <b-col cols="1">
                  <b-link @click="viewSiteDetails(site)">
                    <i class="fa fa-caret-right pull-right fs-24 icon-color" aria-hidden="true" v-b-tooltip.hover title="Go to Site details"></i>
                  </b-link>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
    </b-container>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import sortBy from 'lodash/sortBy';

export default {
  name: 'research-site',
  data() {
    return {
      studyId: this.$route.params.studyId,
      searchTerm: '',
      researchSites: [],
      studyData: {},
      studyType: '',
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.getStudyData();
    this.getSiteDetails();
  },
  methods: {
    getStudyData() {
      this.$api
        .getStudyDataFact(this.studyId)
        .then(response => {
          this.studyData = response.body;
          this.studyType = this.studyData.onboardingType.toLowerCase();
        })
        .catch(error => {
          const { message = 'Error while getting study data' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },

    getSiteDetails() {
      this.$api.getSitesFact(this.studyId).then(
        response => {
          this.researchSites = sortBy(response.body, 'createdTime');
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the list of sites',
          );
        });
    },

    searchSite(searchTerm) {
      window.console.log(searchTerm);
      if (searchTerm.trim().length > 0) {
        this.$api.searchSitesFact(this.studyId, searchTerm).then(
          response => {
            this.researchSites = sortBy(response.body, 'createdTime');
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while getting the list of sites',
            );
          });
      } else {
        this.getSiteDetails();
      }
    },

    createSiteForm() {
      this.$router.push({ name: 'add-research-site' });
    },

    viewSiteDetails(site) {
      this.$router.push({ name: 'research-site-details', params: { siteId: site.id } });
    },
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';

.component {
  background-color: $color_content_background;
}

.icon-color {
  color: #d3dfe4;
}

.sec_text{
  color: #666669;
}

.create-btn {
  border-radius: 100px;
  border: none;
  width: 150px;
  height: 40px;
  background-color: #4c8ce4;
}

.search-field{
  padding: 10px !important;
  background-image: url('/static/img/search.svg');
  background-repeat: no-repeat;
  background-position: 97% 50%;
}

.create-btn2{
  background-color: #4c8ce4;
}

.header-text {
  font-weight: bold;
  color: #666669 !important;
  opacity: 0.5;
  font-size: 12px;
}

.profile-img-size {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.site-card {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 0px;
}
</style>
