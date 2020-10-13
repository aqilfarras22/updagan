<template>
  <div>
    <mainHeader></mainHeader>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="has-sidemenu has-header">
      <router-view :studyData="studyData" :studyId="studyId" :siteId="siteId"></router-view>
    </div>
  </div>
</template>

<script>
import mainHeader from '@/components/common/main-header';
import sideMenu from '@/components/common/side-menu';

export default {
  name: 'site-team',
  components: {
    mainHeader,
    sideMenu,
  },
  data() {
    return {
      studyData: {},
    };
  },
  computed: {
    studyId() {
      return this.$route.params.studyId;
    },
    siteId() {
      return this.$route.params.siteId;
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

