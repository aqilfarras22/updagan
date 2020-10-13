<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="onboardingDetails">
          <h6 class="fw-bold"> ONBOARDING </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-if="onboardingDetails.description">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandStudyDesc" @click.prevent="expandStudyDesc = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandStudyDesc" @click.prevent="expandStudyDesc = false"></i>
              Study description
            </div>
            <div v-if="expandStudyDesc">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row>
                    <div class="header">
                      {{onboardingDetails.description}}
                    </div>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8 pb-10" v-if="onboardingDetails.screens">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandScreens" @click.prevent="expandScreens = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandScreens" @click.prevent="expandScreens = false"></i>
              Information screens
            </div>
            <div v-if="expandScreens">
              <div class="card inner-card br-2">
                <div class="p-10" v-for="(screen, index) in onboardingDetails.screens" :key="index">
                  <b-row class="content">
                    Screen {{screen.index}}
                  </b-row>
                  <div class="header">
                    {{screen.title}}
                  </div>
                  <div class="content">
                    <span v-html="screen.content"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'onboarding-details',
  data() {
    return {
      expandStudyDesc: false,
      expandScreens: false,
    };
  },
  components: {},
  props: {
    onboardingDetails: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    expandAll() {
      this.expandStudyDesc = true;
      this.expandScreens = true;
    },
    collapseAll() {
      this.expandStudyDesc = false;
      this.expandScreens = false;
    },
  },
};
</script>

<style scoped>
.link_style {
  border-right: 1px solid #959fa4;
  margin: 0px 5px 0px 2px !important;
}
.inner-card {
  border: none;
  margin: 5px 20px;
  border-radius: 3px !important;
  background-color: #d3dfe4;
}
.content {
  font-size: 12px;
  color: #666669;
  /* display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  flex-wrap: nowrap;
  max-width: 90%;
  margin: 0px !important; */
}
.header {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
  /* display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  flex-wrap: nowrap;
  max-width: 90%;
  margin: 0px !important; */
}
/deep/ p {
  margin-top: 0;
  margin-bottom: 0 !important;
}
.make-link {
  color: #007bff !important;
}
</style>
