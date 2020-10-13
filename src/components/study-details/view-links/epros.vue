<template>
  <div class="details">
    <b-row class="p-10 pt-20">
      <b-col cols="1"></b-col>
      <b-col cols="10" v-if="eprosDetails && eprosDetails.length > 0">
        <div class="pt-15 card inner-card br-2" v-for="(epro, index) in eprosDetails" :key="index" v-if="epro.id === selectedEpro.id">
          <div class="pl-20 pb-15">
            <b-row>
              <b-col cols="3" class="p-0">
                {{epro.title}}
              </b-col>
              <b-col cols="4" v-if="epro.scheduler && epro.scheduler.milestones && epro.scheduler.milestones.length > 0">
                Milestones:
                <span v-for="(milestones, index) in epro.scheduler.milestones" :key="index">
                  {{milestones}}
                  <span v-if="index + 1 < epro.scheduler.milestones.length">,</span>
                </span>
              </b-col>
            </b-row>
          </div>            
          <div class="pl-20 pb-15">
            <div class="pb-10" v-if="epro.objective">
              <div class="content">
                Objective
              </div>
              <div class="header">
                {{epro.objective}}                
              </div>
            </div>
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
            </b-row>
            <b-row class="pb-10" v-if="epro.scheduler && epro.scheduler.allowMultipleTimes">
              <b-col class="p-0">
                <div class="content">
                  Allow participants to repeat activity each time it is present
                </div>
                <div class="header">
                  Yes
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="epro.scheduler && epro.scheduler.duration">
              <!-- <div v-for="(item, index) in epro.scheduler.duration" :key="index"> -->
                <b-col cols="12" class="content p-0">
                  Scheduled as follows
                </b-col>
                <b-col class="p-0" cols="4" v-for="(item, index) in epro.scheduler.duration" :key="index">
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
              <!-- </div> -->
            </b-row>
             <b-row class="pb-10" v-if="epro.scheduler && !(epro.scheduler.milestones && epro.scheduler.milestones.length > 0)">
              <b-col class="p-0"  v-if="epro.scheduler.allowUntillDuration">
                <div class="content">
                  Available until the end of participant's study duration
                </div>
                <div class="header">
                  Yes
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="epro.scheduler && epro.scheduler.reminders">
              <b-col cols="12" class="content p-0">
                Reminders (Mobile notifications)
              </b-col>
              <b-col class="p-0" cols="4" v-for="(item, index) in epro.scheduler.reminders" :key="index">
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
          <div class="pl-20 pb-15 pr-20" v-if="epro.questions.length > 0">
            <div v-for="(question, index) in epro.questions" :key="index" class="pt-5">
              <div class="card read_only_question p-12">
                <b-row v-if="question.classType === 'Instruction'  || question.type === 'SurveyCompletion'">
                  <b-col class="p-0">
                    <h5 class="instructionTitle fs-14" v-html="question.title"></h5>                 
                    <p class="question_body fs-12" v-html="question.information"></p>
                  </b-col>
                </b-row>
                <b-row class="content" v-if="question.classType !== 'Instruction' && question.type !== 'SurveyCompletion'">
                  <b-col class="p-0">
                    <h5 class="font-style fs-16">Question {{question.questionNum}}</h5>
                    <p class="question_body" v-html="question.body"></p>
                    <b-form-radio-group class="col-12 pl-0" :id="question.identifier" stacked v-model="question.sequence" :name="question.identifier" v-for="(choice, index) in question.options" :key="index" :disabled="true">
                      <b-col align-self="center" class="pl-0">
                        <b-form-radio type="radio" class="pl-0">
                          <span class="pl-20 text-align">{{choice.body}}</span>
                        </b-form-radio>
                      </b-col>
                    </b-form-radio-group>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
    
<script>
export default {
  name: 'epro-details',
  data() {
    return {
      eprosDetails: [],
      selectedEpro: {},
      studyId: this.$route.params.studyId,
      eproId: this.$route.params.eproId,
    };
  },
  components: {},
  methods: {
    async geteprosDetails() {
      try {
        const geteprosDetails = await this.$api.getStudyeprosDetailsFact(this.studyId);
        this.eprosDetails = geteprosDetails.body;
        await this.eprosDetails.forEach((epro, eproIndex) => {
          if (epro.id === this.selectedEpro.id) {
            let questionCount = 1;
            epro.questions.forEach((question, questionIndex) => {
              if (question.classType !== 'Instruction') {
                this.eprosDetails[eproIndex].questions[questionIndex].questionNum =
                  questionCount;
                questionCount += 1;
              }
            });
          }
        });
      } catch (error) {
        this.$toastr.error(error.message || 'Unable to fetch the instructions, questions and notifications.');
      }
    },
  },
  mounted() {
    this.geteprosDetails();
    this.selectedEpro.id = this.eproId;
  },
};
</script>
    
<style scoped>

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
.read_only_question {
  background-color: #f5f8fa;
}
.question_color,
input {
  color: #666769;
  font-size: 14px;
}
.question_body {
  word-break: break-all;
  color: #959fa4;
}

.font-style {
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #3498db;
}

.instructionTitle {
  color: #959fa4;
}
</style>
    