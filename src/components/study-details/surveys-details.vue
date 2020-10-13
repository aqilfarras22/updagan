<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="surveyDetails && surveyCollapse">
          <h6 class="fw-bold">SURVEYS: {{surveyDetails.length}}</h6>
          <div class>
            <b-link size="sm" @click="expandAll" class="p-0 make-link">
              <span>Expand all</span>
            </b-link>
            <!-- <a href="" class="col-1 p-0" @click.prevent="expandAll()">Expand all</a> -->
            <span class="link_style"></span>
            <a href class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-for="(survey, index) in surveyDetails" :key="index">
            <div>
              <b-row>
                <b-col cols="3" class="p-0">
                  <i
                    class="fa fa-plus-circle pr-6"
                    v-if="!surveyCollapse[survey.id]"
                    @click="expandSurvey(survey.id)"
                  ></i>
                  <i
                    class="fa fa-minus-circle pr-6"
                    v-if="surveyCollapse[survey.id]"
                    @click="collapseSurvey(survey.id)"
                  ></i>
                  {{survey.title}}
                </b-col>
                <b-col
                  cols="4"
                  v-if="survey.scheduler && survey.scheduler.milestones && survey.scheduler.milestones.length > 0"
                >
                  Milestones:
                  <span
                    v-for="(milestones, index) in survey.scheduler.milestones"
                    :key="index"
                  >
                    {{milestones}}
                    <span v-if="index + 1 < survey.scheduler.milestones.length">,</span>
                  </span>
                </b-col>
                <b-col
                  cols="4"
                  v-if="survey.scheduler && survey.scheduler.frequency"
                >Frequency: {{survey.scheduler.frequency.title}}</b-col>
              </b-row>
            </div>
            <div v-if="surveyCollapse[survey.id]">
              <div class="card inner-card br-2">
                <div class="pt-10 pl-10 pr-10">
                  <div v-if="survey.therapeuticArea" class="pb-10">
                    <div class="content">Therapeutic area</div>
                    <div class="header">{{survey.therapeuticArea}}</div>
                  </div>
                  <div v-if="survey.therapeuticIndication" class="pb-10">
                    <div class="content">Therapeutic indication</div>
                    <div class="header">{{survey.therapeuticIndication}}</div>
                  </div>
                  <div v-if="survey.timeToComplete" class="pb-10">
                    <div class="content">Approximate time to complete</div>
                    <div class="header">{{survey.timeToComplete}} min</div>
                  </div>
                  <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.milestones">
                    <b-col class="p-0">
                      <div class="content">To be completed at milestones</div>
                      <div class="header">
                        <span
                          v-for="(milestone, index) in survey.scheduler.milestones"
                          :key="index"
                        >
                          {{milestone}}
                          <span v-if="index + 1 < survey.scheduler.milestones.length">,</span>
                        </span>
                      </div>
                    </b-col>
                    <b-col v-if="survey.scheduler.completionWindow">
                      <div class="content">Completion window</div>
                      <div class="header">{{survey.scheduler.completionWindow}}</div>
                    </b-col>
                     <b-col v-if="survey.showDailySummary" class="p-0">
                      <div class="content">Enabled</div>
                      <div class="header">Daily Activity Completion</div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.frequency">
                    <b-col class="p-0">
                      <div class="content">Frequency</div>
                      <div class="header">{{survey.scheduler.frequency.title}}</div>
                    </b-col>
                    <b-col v-if="survey.scheduler.completionWindow" class="p-0">
                      <div class="content">Completion window</div>
                      <div class="header">{{survey.scheduler.completionWindow}} days</div>
                    </b-col>
                    <b-col v-if="survey.showDailySummary" class="p-0">
                      <div class="content">Enabled</div>
                      <div class="header">Daily Activity Completion</div>
                    </b-col>
                  </b-row>
                  <b-row
                    class="content pb-10"
                    v-if="survey.prePopulationEnabled"
                  >Show participant's their previous survey answers, if applicable. Only applies for this survey</b-row>
                  <b-row
                    class="content pb-10"
                    v-if="survey.watchEnabled"
                  >Allow survey to be completed on an Apple Watch. Limited question types if selected.</b-row>
                  <router-link
                    class="link-color"
                    :to="{ name: 'survey-summary', params: { studyId: studyId, surveyId: survey.id } }"
                    target="_blank"
                  >View survey instructions, questions, and notifications</router-link>
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
  name: "survey-details",
  data() {
    return {
      selectedSurvey: {
        id: ""
      },
      studyId: this.$route.params.studyId,
      surveyCollapse: {}
    };
  },
  components: {},
  props: {
    surveyDetails: {
      type: Array
    }
  },
  methods: {
    expandSurvey(id) {
      this.selectedSurvey.id = id;
      this.surveyCollapse[id] = true;
      this.$forceUpdate();
    },
    collapseSurvey(id) {
      // debugger;
      this.selectedSurvey.id = "";
      this.surveyCollapse[id] = false;
      this.$forceUpdate();
    },
    expandAll() {
      this.surveyDetails.forEach(survey => {
        this.surveyCollapse[survey.id] = true;
      });
      this.$forceUpdate();
    },
    collapseAll() {
      this.selectedSurvey.id = "";
      this.surveyDetails.forEach(survey => {
        this.surveyCollapse[survey.id] = false;
      });
      this.$forceUpdate();
    }
  },
  watch: {
    surveyDetails() {
      if (this.surveyDetails && this.surveyDetails.length) {
        this.surveyDetails.forEach(survey => {
          this.surveyCollapse[survey.id] = false;
        });
      }
    }
  }
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
  color: #007bff !important;
}
</style>
