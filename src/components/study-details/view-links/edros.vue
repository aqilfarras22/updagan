<template>
  <div>
    <b-row class="details p-10 pt-20">
      <b-col cols="1"></b-col>
      <b-col cols="10" v-if="edroDetails && edroDetails.length > 0">
        <div class="pt-15 card inner-card br-2" v-for="(edro, index) in edroDetails" :key="index" v-if="edro.identifier === selectedEdro.id">
          <div class="pl-10 pb-15">
            <b-row>
              <b-col cols="3" class="p-0">
                {{edro.title}}
              </b-col>
              <b-col cols="4" v-if="edro.scheduler && edro.scheduler.milestones && edro.scheduler.milestones.length > 0">
                Milestones:
                <span v-for="(milestones, index) in edro.scheduler.milestones" :key="index">
                  {{milestones}}
                  <span v-if="index + 1 < edro.scheduler.milestones.length">,</span>
                </span>
              </b-col>
            </b-row>
          </div>
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
                  Instruction Details
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
              <b-row class="pb-10" v-if="edro.scheduler && edro.scheduler.allowMultipleTimes">
                <b-col class="p-0">
                  <div class="content">
                    Allow participants to repeat activity each time it is present
                  </div>
                  <div class="header">
                    Yes
                  </div>
                </b-col>
              </b-row>
              <b-row class="pb-10" v-if="edro.scheduler && edro.scheduler.duration">
                  <b-col class="p-0" cols="4" v-for="(item, index) in edro.scheduler.duration" :key="index">
                    <b-col cols="12" class="content p-0" v-if="index === 0 && (item.startDay || item.endDay)">
                      Scheduled as follows
                    </b-col>
                    <b-row class="p-0">
                      <b-col class="p-0" cols="3" v-if="item.startDay">
                        <div class="content">
                          Start Day
                        </div>
                        <div class="header">
                          {{item.startDay}}
                        </div>
                      </b-col>
                      <b-col class="p-0" cols="3" v-if="item.endDay">
                        <div class="content">
                          End Day
                        </div>
                        <div class="header">
                          {{item.endDay}}
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
              </b-row>
              <b-row class="pb-10" v-if="edro.scheduler && !(edro.scheduler.milestones && edro.scheduler.milestones.length > 0)">
                <b-col class="p-0"  v-if="edro.scheduler.allowUntillDuration">
                  <div class="content">
                    Available until the end of participant's study duration
                  </div>
                  <div class="header">
                    Yes
                  </div>
                </b-col>
              </b-row>
            <b-row class="pb-10" v-if="edro.scheduler && edro.scheduler.reminders && edro.scheduler.reminders.length">
              <b-col cols="12" class="content p-0">
                Reminders (Mobile notifications)
              </b-col>
              <b-col class="p-0" cols="4" v-for="(item, index) in edro.scheduler.reminders" :key="index">
                <b-row class="p-0">
                  <b-col class="p-0" cols="1">
                    <div class="content">
                      Day
                    </div>
                    <div class="header">
                      {{item.day}}
                    </div>
                  </b-col>
                  <b-col class="p-0" cols="5" v-if="item.message">
                    <div class="content">
                      Message
                    </div>
                    <div class="header">
                      {{item.message}}
                    </div>
                  </b-col>
                  <b-col class="p-0" cols="3" v-if="item.time">
                    <div class="content">
                      Time
                    </div>
                    <div class="header">
                      {{item.time}}
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
    
<script>
export default {
  name: 'edro-details',
  data() {
    return {
      edroDetails: [],
      selectedEdro: {},
      studyId: this.$route.params.studyId,
      edroId: this.$route.params.edroId,
    };
  },
  methods: {
    async getEdroDetails() {
      try {
        const selectedActivities = await this.$api.getSelectedActivitesFact(this.studyId);
        this.edroDetails = selectedActivities.body;
      } catch (error) {
        this.$toastr.error(error.message || 'Unable to fetch the instructions and notifications.');
      }
    },
  },
  mounted() {
    this.getEdroDetails();
    this.selectedEdro.id = this.edroId;
  },
};
</script>
    
<style scoped>

.details {
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
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

.card {
  padding: 15px;
  margin-bottom: 16px;
}
</style>
    