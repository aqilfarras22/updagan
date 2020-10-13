<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="edroDetails && edroCollapse">
          <h6 class="fw-bold"> eDROs: {{edroDetails.length}} </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-for="(edro, index) in edroDetails" :key="index" v-if="edro">
            <div>
              <b-row>
                <b-col cols="3" class="p-0">
                  <i class="fa fa-plus-circle pr-6" v-if="!edroCollapse[edro.identifier]" @click.prevent="expandEdro(edro.identifier)"></i>
                  <i class="fa fa-minus-circle pr-6" v-if="edroCollapse[edro.identifier]" @click.prevent="collapseEdro(edro.identifier)"></i>
                  {{edro.title}}
                </b-col>
                <b-col cols="4" v-if="edro.scheduler && edro.scheduler.milestones && edro.scheduler.milestones.length > 0">
                  Milestones:
                  <span v-for="(milestone, index) in edro.scheduler.milestones" :key="index">
                    {{milestone}}
                    <span v-if="index + 1 < edro.scheduler.milestones.length">,</span>
                  </span>
                </b-col>
                <b-col cols="4" v-if="edro.scheduler && edro.scheduler.frequency">
                  Frequency: {{edro.scheduler.frequency.title}}
                </b-col>
              </b-row>
            </div>
            <div v-if="edroCollapse[edro.identifier]">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <div class="pb-10" v-if="edro.category">
                    <div class="content">
                      Category
                    </div>
                    <div class="header">
                      {{edro.category}}
                    </div>
                  </div>
                  <div class="pb-10" v-if="edro.description">
                    <div class="content">
                      Description
                    </div>
                    <div class="header">
                      {{edro.description}}
                    </div>
                  </div>
                  <div class="pb-10" v-if="edro.configurationSettings">
                    <div class="content">
                      Default configuration settings
                    </div>
                    <div class="header" v-for="(setting,index) in edro.configurationSettings" :key="index">
                      {{setting.name}}: {{setting.details}}
                    </div>
                  </div>
                  <div class="pb-10" v-if="edro.dataCollected">
                    <div class="content">
                      Data collected
                    </div>
                    <div class="header" v-for="(data, index) in edro.dataCollected" :key="index">
                      <li>{{data}}</li>
                    </div>
                  </div>
                  <b-row class="pb-10" v-if="edro.scheduler.milestones">
                    <b-col class="p-0">
                      <div class="content">
                        To be completed at milestones
                      </div>
                      <div class="header">
                        <span v-for="(milestone, index) in edro.scheduler.milestones" :key="index">
                          {{milestone}}
                          <span v-if="index + 1 < edro.scheduler.milestones.length">,</span>
                        </span>
                      </div>
                    </b-col>
                    <b-col v-if="edro.scheduler.completionWindow" class="p-0">
                      <div class="content">
                        Completion window
                      </div>
                      <div class="header">
                        {{edro.scheduler.completionWindow}} days
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="edro.scheduler && edro.scheduler.frequency">
                    <b-col class="p-0">
                      <div class="content">
                        Frequency
                      </div>
                      <div class="header">
                        {{edro.scheduler.frequency.title}}
                      </div>
                    </b-col>
                    <b-col v-if="edro.scheduler.completionWindow" class="p-0">
                      <div class="content">
                        Completion window
                      </div>
                      <div class="header">
                        {{edro.scheduler.completionWindow}} days
                      </div>
                    </b-col>
                  </b-row>
                  <router-link class="link-color" :to="{ name: 'edros-summary', params: { studyId: studyId, edroId: edro.identifier } }" target="_blank">
                    View instructions and notifications
                  </router-link>
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
  name: 'edro-details',
  data() {
    return {
      studyId: this.$route.params.studyId,
      selectedEdro: {
        identifier: '',
      },
      edroCollapse: {},
    };
  },
  components: {},
  props: {
    edroDetails: {
      type: Array,
    },
  },
  methods: {
    expandEdro(identifier) {
      this.selectedEdro.identifier = identifier;
      this.edroCollapse[identifier] = true;
      this.$forceUpdate();
    },
    collapseEdro(identifier) {
      this.selectedEdro.identifier = '';
      this.edroCollapse[identifier] = false;
      this.$forceUpdate();
    },
    expandAll() {
      this.edroDetails.forEach(edro => {
        this.edroCollapse[edro.identifier] = true;
      });
      this.$forceUpdate();
    },
    collapseAll() {
      this.selectedEdro.identifier = '';
      this.edroDetails.forEach(edro => {
        this.edroCollapse[edro.identifier] = false;
      });
      this.$forceUpdate();
    },
  },
  watch: {
    edroDetails() {
      if (this.edroDetails && this.edroDetails.length) {
        this.edroDetails.forEach(edro => {
          this.edroCollapse[edro.identifier] = false;
        });
      }
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
}
.header {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
.link-color {
  font-size: 12px;
  color: #4c8ce4;
}
.make-link {
  color: #007bff !important
}
</style>
