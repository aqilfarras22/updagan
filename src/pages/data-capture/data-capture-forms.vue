<template>
  <div class="main-container">
    <main-header></main-header>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="has-header has-sidemenu form-container">
      <router-view :studyData="studyData" :studyId="studyId"></router-view>
    </div>
  </div>
</template>

<script>
import mainHeader from '../../components/common/main-header';
import sideMenu from '../../components/common/side-menu';

export default {
  name: 'data-capture-form',
  components: { mainHeader, sideMenu },
  data() {
    return {
      studyData: {},
      studyId: this.$route.params.studyId,
    };
  },
  computed: {
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

<style scoped lang="scss">
.main-container {
  display: flex;
  background-color: #f5f6f7 !important;
  height: 100vh;
}

.has-header {
  margin-top: 90px !important;
}

.has-sidemenu {
  margin-left: 20px !important;
  padding-top: 0px !important;
}

.form-container {
  width: 100%;
}

</style>
