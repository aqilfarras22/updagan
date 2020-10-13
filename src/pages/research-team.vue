<template>
  <div>
    <mainHeader></mainHeader>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="has-sidemenu has-header">
      <navBar v-if="isDetailPage" :routes="navBarRoutes" />
      <router-view :studyData="studyData" :studyId="studyId"></router-view>
    </div>
  </div>
</template>

<script>
import mainHeader from '@/components/common/main-header';
import sideMenu from '@/components/common/side-menu';
import navBar from '@/components/common/nav-bar';

export default {
  name: 'research-team',
  components: {
    mainHeader,
    sideMenu,
    navBar,
  },
  data() {
    return {
      studyData: {},
    };
  },
  computed: {
    studyId() {
      return this.$route.params.studyId;
            console.log("this route", this.$route.params.studyId)

    },
    isDetailPage() {
      const noTabPages = [
        "study-admins",
        "study-team",
        "research-site",
        "list-research-site",
        "add-research-site",
        "research-site-details",
        "add-research-site-documents"
      ];
      return noTabPages.includes(this.$route.name);
    },
    navBarRoutes() {
      return [
        {
          label: 'Admin',
          to: {
            name: 'study-admins',
            params: { studyId: this.studyId },
          },
        },
        {
          label: 'Study Team',
          to: {
            name: 'study-team',
            params: { studyId: this.studyId },
          },
        },
        {
          label: 'Research Sites',
          to: {
            name: 'list-research-site',
            params: { studyId: this.studyId },
          },
        },
        {
          message: 'What do these mean?',
        },
      ];
    },
  },
  mounted() {
    this.$api
      .getStudyDataFact(this.studyId)
      .then(response => {
        this.studyData = response.body;
      })
      .catch(error => {
        const { message = 'Error while getting study data' } = (error && error.body) || {};
        this.$toastr.error(message);
      });
  },
};
</script>

<style scoped>
.nav-bar .nav-link.active {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
  font-weight: bold;
}

.nav-bar .nav-link {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px!important;
  padding-right: 2px !important;
  color: #2d3752 !important;
}
</style>

