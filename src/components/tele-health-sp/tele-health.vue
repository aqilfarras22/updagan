<template>
  <div class="main-container">
    <main-header></main-header>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="has-header telehealth-container">
      <router-view :studyData="studyData" :studyId="studyId"></router-view>
    </div>
  </div>
</template>

<script>
import mainHeader from "../../components/common/main-header";
import sideMenu from "../../components/common/side-menu";

export default {
  name: "tele-health-sp",
  components: {
    mainHeader,
    sideMenu
  },
  data() {
    return {
      studyData: {},
      studyId: this.$route.params.studyId
    };
  },
  computed: {},
  methods: {
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
        this.studyData = response.body;
      });
    }
  },
  mounted() {
    this.getStudyDetails();
  }
};
</script>
<style lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">
.main-container {
  display: flex;
  background-color: #f5f6f7 !important;
  height: 100vh;
}

.has-header {
  margin-top: 90px !important;
}

.telehealth-container {
  font-family: Lato-Regular;
  width: 100%;
  padding: 3px 15px;
}
</style>
