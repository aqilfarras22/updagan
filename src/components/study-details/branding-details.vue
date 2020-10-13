<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="brandingDetails">
          <h6 class="fw-bold"> BRANDING </h6>
          <div class="">
            <a href="" class="make-link col-1 p-0" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="make-link col-1 p-0" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandStudyName" @click.prevent="expandStudyName = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandStudyName" @click.prevent="expandStudyName = false"></i>
              Study and app name
            </div>
            <div v-if="expandStudyName">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row>
                    <b-col v-if="brandingDetails.name">
                      <div class="header">
                        Study name
                      </div>
                      <div class="content">
                        {{brandingDetails.name}}
                      </div>
                    </b-col>
                    <b-col v-if="brandingDetails.appName">
                      <div class="header">
                        App name
                      </div>
                      <div class="content">
                        {{brandingDetails.appName}}
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandIcon" @click.prevent="expandIcon = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandIcon" @click.prevent="expandIcon = false"></i>
              Logo and app icon
            </div>
            <div v-if="expandIcon">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row>
                    <b-col v-if="brandingDetails.logoUrl">
                      <div class="header pb-5">
                        Logo
                      </div>
                      <div>
                        <img class="content-img" :src="brandingDetails.logoUrl" alt="study-logo" />
                      </div>
                    </b-col>
                    <b-col v-if="brandingDetails.iconUrl">
                      <div class="header">
                        App icon
                      </div>
                      <div>
                        <img class="content-img" :src="brandingDetails.iconUrl" alt="app-icon" />
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8 pb-10">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandColor" @click.prevent="expandColor = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandColor" @click.prevent="expandColor = false"></i>
              Color palette
            </div>
            <div v-if="expandColor">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row>
                    <b-col v-if="brandingDetails.colorPrimary">
                      <div class="header">
                        Primary color
                      </div>
                      <b-row class="content">
                        <b-col cols="1" class="pt-2 pr-0 pl-0 text-left">
                          <span class="card color-card" :style="{ background: brandingDetails.colorPrimary }">
                          </span>
                        </b-col>
                        <b-col cols="11" class="p-2 content-color">
                          {{brandingDetails.colorPrimary}}
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col v-if="brandingDetails.colorSecondary">
                      <div class="header">
                        Secondary color
                      </div>
                      <b-row class="content">
                        <b-col cols="1" class="pt-2 pr-0 pl-0 text-left">
                          <span class="card color-card" :style="{ background: brandingDetails.colorSecondary }">
                          </span>
                        </b-col>
                        <b-col cols="11" class="p-2 content-color">
                          {{brandingDetails.colorSecondary}}
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
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
  name: 'branding-details',
  data() {
    return {
      expandStudyName: false,
      expandIcon: false,
      expandColor: false,
    };
  },
  components: {},
  props: {
    brandingDetails: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    expandAll() {
      this.expandStudyName = true;
      this.expandIcon = true;
      this.expandColor = true;
    },
    collapseAll() {
      this.expandStudyName = false;
      this.expandIcon = false;
      this.expandColor = false;
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
.header {
  font-size: 12px;
  color: #666669;
}
.content {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
.content-img {
  width: auto;
  height: 100%;
  max-height: 80px;
}
.color-card {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}
.content-color {
  line-height: 25px;
}
.make-link {
  color: #007bff !important ;
}
</style>
