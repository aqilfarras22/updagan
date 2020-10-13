<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="eprosDetails && eproCollapse">
          <h6 class="fw-bold"> ePROS: {{eprosDetails.length}} </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-for="(epro, index) in eprosDetails" :key="index" v-if="epro">
            <div>
              <b-row>
                <b-col cols="3" class="p-0">
                  <i class="fa fa-plus-circle pr-6" v-if="!eproCollapse[epro.id]" @click.prevent="expandEpro(epro.id)"></i>
                  <i class="fa fa-minus-circle pr-6" v-if="eproCollapse[epro.id]" @click.prevent="collapseEpro(epro.id)"></i>
                  {{epro.title}}
                </b-col>
                <b-col cols="4" v-if="epro.scheduler && epro.scheduler.milestones && epro.scheduler.milestones.length > 0">
                  Milestones:
                  <span v-for="(milestones, index) in epro.scheduler.milestones" :key="index">
                    {{milestones}}
                    <span v-if="index + 1 < epro.scheduler.milestones.length">,</span>
                  </span>
                </b-col>
                <b-col cols="4" v-if="epro.scheduler && epro.scheduler.frequency">
                  Frequency: {{epro.scheduler.frequency.title}}
                </b-col>
              </b-row>
            </div>
            <div v-if="eproCollapse[epro.id]">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <div class="pb-10" v-if="epro.therapeuticArea">
                    <div class="content">
                      Therapeutic area
                    </div>
                    <div class="header">
                      {{epro.therapeuticArea}}
                    </div>
                  </div>
                  <div class="pb-10" v-if="epro.therapeuticIndication">
                    <div class="content">
                      Therapeutic indication
                    </div>
                    <div class="header">
                      {{epro.therapeuticIndication}}
                    </div>
                  </div>
                  <div class="pb-10" v-if="epro.eProInfo.timeToComplete">
                    <div class="content">
                      Approximate time to complete
                    </div>
                    <div class="header">
                      {{epro.eProInfo.timeToComplete}} mins
                    </div>
                  </div>
                  <b-row class="pb-10" v-if="epro.scheduler && epro.scheduler.milestones">
                    <b-col v-if="epro.scheduler && epro.scheduler.milestones && epro.scheduler.milestones.length > 0" class="p-0">
                      <div class="content">
                        To be completed at milestones
                      </div>
                      <div class="header">
                        <span v-for="(milestone, index) in epro.scheduler.milestones" :key="index">
                          {{milestone}}
                          <span v-if="index + 1 < epro.scheduler.milestones.length">,</span>
                        </span>
                      </div>
                    </b-col>
                    <b-col v-if="epro.scheduler.completionWindow">
                      <div class="content">
                        Completion window
                      </div>
                      <div class="header">
                        {{epro.scheduler.completionWindow}} days
                      </div>
                    </b-col>
                    <b-col v-if="epro.showDailySummary" class="p-0">
                      <div class="content">Enabled</div>
                      <div class="header">Daily Activity Completion</div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="epro.scheduler && epro.scheduler.frequency">
                    <b-col class="p-0">
                      <div class="content">
                        Frequency
                      </div>
                      <div class="header">
                        {{epro.scheduler.frequency.title}}
                      </div>
                    </b-col>
                    <b-col v-if="epro.scheduler.completionWindow" class="p-0">
                      <div class="content">
                        Completion window
                      </div>
                      <div class="header">
                        {{epro.scheduler.completionWindow}} days
                      </div>
                    </b-col>
                    <b-col v-if="epro.showDailySummary" class="p-0">
                      <div class="content">Enabled</div>
                      <div class="header">Daily Activity Completion</div>
                    </b-col>
                  </b-row>
                  <router-link class="link-color" :to="{ name: 'epros-summary', params: { studyId: studyId, eproId: epro.id } }" target="_blank">
                    View epro instructions, questions, and notifications
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
  name: 'epro-details',
  data() {
    return {
      selectedEpro: {
        id: '',
      },
      studyId: this.$route.params.studyId,
      eproCollapse: {},
    };
  },
  components: {},
  props: {
    eprosDetails: {
      type: Array,
    },
  },
  methods: {
    expandEpro(id) {
      this.selectedEpro.id = id;
      this.eproCollapse[id] = true;
      this.$forceUpdate();
    },
    collapseEpro(id) {
      this.selectedEpro.id = '';
      this.eproCollapse[id] = false;
      this.$forceUpdate();
    },
    expandAll() {
      this.eprosDetails.forEach(epro => {
        this.eproCollapse[epro.id] = true;
      });
      this.$forceUpdate();
    },
    collapseAll() {
      this.selectedEpro.id = '';
      this.eprosDetails.forEach(epro => {
        this.eproCollapse[epro.id] = false;
      });
      this.$forceUpdate();
    },
    gotoEpros() {
      const routeData = this.$router.resolve({ name: 'epros' });
      window.open(routeData.href, '_blank');
    },
  },
  watch: {
    eprosDetails() {
      if (this.eprosDetails && this.eprosDetails.length) {
        this.
        sDetails.forEach(epro => {
          this.eproCollapse[epro.id] = false;
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
