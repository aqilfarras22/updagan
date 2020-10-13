<template>
  <div class="container-fluid">
    <mainHeader></mainHeader>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="content has-header has-sidemenu mt-10">
      <router-view :studyData="studyData" :studyId="studyId"></router-view>
    </div>
  </div>
</template>

<script>
import mainHeader from '@/components/common/main-header';
import sideMenu from '@/components/common/side-menu';

export default {
  components: {
    mainHeader,
    sideMenu,
  },
  data() {
    return {
      studyData: {},
      studyId: this.$route.params.studyId,
    };
  },
  computed: {
    // studyId() {
    //   return this.$route.params.studyId;
    // },
  },
  methods: {
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
      this.studyData = response.body;
      });
    },
  },
  mounted() {
    this.getStudyDetails();
  },
};
</script>
