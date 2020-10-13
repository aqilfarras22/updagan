<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyReviewHeader></studyReviewHeader>
      <div class="pl-20 pr-20">
        <div class="row text-center">
          <div class="mt-80 mb-100">
            <img src="/static/img/g-r-a-p-h-i-c-preview.png" class="">
            <div class="pt-10 fs-18 fw-500">Are you ready to give approval for your mobile study app?</div>
            <div class="pt-20">
              <button class="btn br-25 btn_yes mr-10" v-on:click="approveStudy(true)">Yes</button>
            </div>
            <div class="pt-10">
              <button class="btn br-25 btn_not_yet mr-10" v-on:click="approveStudy(false)">Not yet</button>
            </div>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <!--<div class="row">
                  <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()" v-if="!preview">Skip</button>
                  <button type="button" class="btn nextBtn br-25" v-if="!preview" v-on:click="generate()">Generate Prototype</button>
                  <button type="button" class="btn saveBtn br-25" v-if="preview" v-on:click="saveAndExit()">Save and exit</button>
                  <button type="button" class="btn nextBtn br-25" v-if="preview" v-on:click="nextClick()">Continue</button>
                </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import studyReviewHeader from '../../common/study-review-header';

export default {
  name: 'generate',
  data() {
    return {
      studyId: null,
    };
  },
  components: { studyReviewHeader },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
  },
  methods: {
    approveStudy(val) {
      if (val) {
        this.$router.push({ name: 'documentation', params: { studyId: this.studyId } });
      } else {
        this.$router.push({ name: 'features-library', params: { studyId: this.studyId } });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.generate-btn {
  border: solid 1px #d3dfe4;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 25px;
  background-color: #ffffff;
  color: #666769;
}

.font-style {
  cursor: pointer;
  color: #1f95f2;
}

.active {
  border-radius: 100px !important;
  color: #ffffff !important;
  background-color: #2d3752 !important;
}

.add-style {
  padding: 20px;
  color: #f06559;
  cursor: pointer;
}

.box-style {
  position: relative;
  border-radius: 8px;
  background-color: #d3dfe4;
  padding: 15px;
  height: 140px;
  max-width: 270px;
  width: 100%;
}

.btn_yes {
  width: 200px;
  border-radius: 100px;
  background-color: #2ecc71;
  color: #fff;
}

.btn_not_yet {
  width: 200px;
  border-radius: 100px;
  background-color: #34537d;
  color: #fff;
}
</style>
