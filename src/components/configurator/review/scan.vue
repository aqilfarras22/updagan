<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <div class="text-center mt-100 mb-100">
        <div v-if="buildStatus === 0">
          <div
            class="page_heading fs-16 pb-40 p-20"
          >Scanning your study now to determine if anything is missing...</div>
          <div class="row text-center">
            <img src="static/img/mobile_scan.gif" class="scan_img">
          </div>
        </div>
        <div v-if="buildStatus === 1">
          <div
            class="page_heading fs-16 p-20"
          >Everything is in order! Give your study one final review before publishing.</div>
          <div class="row text-center">
            <img src="static/img/mobile_scan_success.png" class="scan_img_status">
          </div>
          <div class="pt-20 pb-20">
            <button
              class="btn btn-success br-25 summary_btn"
              v-on:click="viewSummary()"
            >View study summary</button>
          </div>
        </div>
        <div v-if="buildStatus === 2">
          <div
            class="page_heading fs-16 p-20"
          >A few items remain incomplete. View the study summary to identify open items.</div>
          <div class="row text-center">
            <img src="static/img/mobile_scan_error.png" class="scan_img_status">
          </div>
          <div class="pt-20 pb-20">
            <button
              class="btn btn-info br-25 summary_btn"
              v-on:click="viewSummary()"
            >View study element summary</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scan',
  data() {
    return {
      studyId: null,
      buildStatus: 0,
      allowBuild: false,
      isMultipleConsent: true,
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.isMultipleConsentEnabled();
  },
  methods: {
    isMultipleConsentEnabled() {
      const that = this;
      that.$api.getToggleFeaturesFact(that.studyId).then(
        response => {
          that.toggleFeatures = response.body.studyFeatures;
          const isEconsent = that.toggleFeatures.filter(
            x => x.featureKey == 'ECONSENT', // eslint-disable-line
          );
          if ((isEconsent == null || isEconsent == undefined || isEconsent == '') && isEconsent.length == 0) { // eslint-disable-line {
            that.isMultipleConsent = true;
          } else {
            that.isMultipleConsent = false;
          }
          that.getStudyOverview();
        },
        error => {
          that.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting features.',
          );
          that.getStudyOverview();
        },
      );
    },
    getStudyOverview() {
      const that = this;
      if (that.isMultipleConsent) {
        that.$api.getStudyOveriviewV2Fact(that.studyId).then(response => {
          if (response.body) {
            that.allowBuild = response.body.allowBuild;
            if (this.allowBuild) {
              this.buildStatus = 1;
            } else {
              this.buildStatus = 2;
            }
          }
        });
      } else {
        that.$api.getStudyOveriviewFact(that.studyId).then(response => {
          if (response.body) {
            that.allowBuild = response.body.allowBuild;
            if (this.allowBuild) {
              this.buildStatus = 1;
            } else {
              this.buildStatus = 2;
            }
          }
        });
      }
    },
    goToCustomize() {
      this.$router.push({
        name: 'features-library',
        params: { studyId: this.studyId },
      });
    },
    viewSummary() {
      this.$router.push({
        name: 'study-summary',
        params: { studyId: this.studyId },
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.question {
  z-index: 1;
  font-size: 72px;
  color: #f39c12;
  position: absolute;
  top: -32px;
  margin-left: 23px;
}
.scan_img,
.page_heading {
  width: 100%;
  max-width: 400px;
  margin: auto;
}
.scan_img_status {
  width: 100%;
  max-width: 200px;
  margin: auto;
}
.summary_btn {
  padding: 8px 20px;
}
</style>
