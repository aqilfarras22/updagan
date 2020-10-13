<template>
  <div class="details">
    <b-row class="p-10 pt-20">
      <b-col cols="1"></b-col>
      <b-col cols="10" v-if="surveyDetails && surveyDetails.length > 0">
        <div class="pt-15 card inner-card br-2" v-for="(survey, index) in surveyDetails" :key="index" v-if="survey.id === selectedSurvey.id">
          <div class="pl-20 pb-15">
            <b-row>
              <b-col cols="3" class="p-0">
                {{survey.title}}
              </b-col>
              <b-col cols="4" v-if="survey.scheduler && survey.scheduler.milestones && survey.scheduler.milestones.length > 0">
                Milestones:
                <span v-for="(milestones, index) in survey.scheduler.milestones" :key="index">
                  {{milestones}}
                  <span v-if="index + 1 < survey.scheduler.milestones.length">,</span>
                </span>
              </b-col>
            </b-row>
          </div>
          <div class="pl-20 pb-15">
            <div v-if="survey.therapeuticArea">
              <div class="content">
              Description
              </div>
              <div class="header">
                {{survey.nickName}}
              </div>
            </div>
          </div>
          <div class="pl-20 pb-15">
            <div class="pb-10" v-if="survey.therapeuticArea">
              <div class="content">
                Therapeutic area
              </div>
              <div class="header">
                {{survey.therapeuticArea}}
              </div>
            </div>
            <div class="pb-10" v-if="survey.therapeuticIndication">
              <div class="content">
                Therapeutic indication
              </div>
              <div class="header">
                {{survey.therapeuticIndication}}
              </div>
            </div>
            <div class="pb-10" v-if="survey.timeToComplete">
              <div class="content">
                Approximate time to complete
              </div>
              <div class="header">
                {{survey.timeToComplete}} mins
              </div>
            </div>
            <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.milestones">
              <b-col v-if="survey.scheduler && survey.scheduler.milestones && survey.scheduler.milestones.length > 0" class="p-0">
                <div class="content">
                  To be completed at milestones
                </div>
                <div class="header">
                  <span v-for="(milestone, index) in survey.scheduler.milestones" :key="index">
                    {{milestone}}
                    <span v-if="index + 1 < survey.scheduler.milestones.length">,</span>
                  </span>
                </div>
              </b-col>
              <b-col v-if="survey.scheduler.completionWindow">
                <div class="content">
                  Completion window
                </div>
                <div class="header">
                  {{survey.scheduler.completionWindow}} days
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.frequency">
              <b-col class="p-0">
                <div class="content">
                  Frequency
                </div>
                <div class="header">
                  {{survey.scheduler.frequency.title}}
                </div>
              </b-col>
              <b-col v-if="survey.scheduler.completionWindow" class="p-0">
                <div class="content">
                  Completion window
                </div>
                <div class="header">
                  {{survey.scheduler.completionWindow}} days
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.allowMultipleTimes">
              <b-col class="p-0">
                <div class="content">
                  Allow participants to repeat survey each time it is present
                </div>
                <div class="header">
                  Yes
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="survey.scheduler && !(survey.scheduler && survey.scheduler.milestones && survey.scheduler.milestones.length > 0)">
              <b-col class="p-0">
                <div class="content">
                  Available until the end of participant's study duration
                </div>
                <div class="header" v-if="survey.scheduler.allowUntillDuration">
                  Yes
                </div>
                <div class="header" v-if="!survey.scheduler.allowUntillDuration">
                  No
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="survey.watchEnabled">
              <b-col class="p-0">
                <div class="content">
                  Allow survey to be completed on an Apple Watch. Limited question types if selected.
                </div>
                <div class="header">
                  Yes
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10">
              <b-col cols="12" class="content p-0"> Email Recipient </b-col>
                <div class="content">
                  <div class="header">Questions and answers included: </div>
                  <div v-if="questions.length > 0">
                    <div class="header" v-for="(question,index) in questions" :key="index">• {{question}}</div>
                  </div>
                  <div class="header" v-if="questions.length == 0">• None</div>
                </div>
            </b-row>
            
            <div class="pb-10">
              <div class="content">Sent to: </div>
              <div class="content" v-if="isRecipientFlagSet"><b>Site Team</b></div>
              <div v-if="emails.length > 0">
                <div class="header" v-for="(item, index) in emails" :key="index">{{item.email}}</div>
              </div>
              <div v-if="emails.length == 0 && !isRecipientFlagSet">N/A</div>
            </div>
            <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.duration">
              <b-col cols="12" class="content p-0">
                Scheduled as follows
              </b-col>
              <b-col class="p-0" cols="4" v-for="(item, index) in survey.scheduler.duration" :key="index">
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
             <b-row class="pb-10" v-if="survey.scheduler && !(survey.scheduler && survey.scheduler.milestones && survey.scheduler.milestones.length > 0)">
              <b-col class="p-0"  v-if="survey.scheduler.allowUntillDuration">
                <div class="content">
                  Available until the end of participant's study duration
                </div>
                <div class="header">
                  Yes
                </div>
              </b-col>
            </b-row>
            <b-row class="pb-10" v-if="survey.scheduler && survey.scheduler.reminders">
              <b-col cols="12" class="content p-0">
                Reminders (Mobile notifications)
              </b-col>
              <b-col class="p-0" cols="4" v-for="(item, index) in survey.scheduler.reminders" :key="index">
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
            <b-row class="content pb-10" v-if="survey.prePopulationEnabled">
              Show participant's their previous survey answers, if applicable. Only applies for this survey
            </b-row>
          </div>
          <div class="pl-10 pb-15" v-if="survey.questions.length > 0">
            <div class="" v-for='(question, index) in survey.questions'>
              <div class="card read_only_question">
                <div class="row">
                  <div class="col-12 p-0 pointer_events_none">
                    <div v-if="question.type === 'SurveyInstruction' || question.type === 'SurveyCompletion' || question.type === 'GPSkin' || question.type === 'ImageCapture'">
                      <div v-if="question.templateImageUrl">
                        <div class="row">
                          <div class="col-lg-6 col-md-6">
                            <h5 class="instructionTitle fs-14" v-html="question.formattedTitle"></h5>
                            <p class="question_body fs-12" v-html="question.information"></p>
                            <div class="row">
                              <div class="col-lg-6 col-md-6 pl-0 pr-20" v-if="question.imageUrl">
                                <img class="img_size" :src="question.imageUrl" />
                              </div>
                            </div>
                          </div>
                          <div class="col-lg-6 col-md-6">
                            <h5 class="instructionTitle fs-14">Template Image</h5>
                            <div class="row">
                              <div class="col-lg-6 col-md-6 pl-0 pr-20" v-if="question.templateImageUrl">
                                <img class="img_size" :src="question.templateImageUrl" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <h5 class="instructionTitle fs-14" v-html="question.formattedTitle"></h5>
                        <p class="question_body fs-12" v-html="question.information"></p>
                        <div class="row">
                          <div class="col-lg-6 col-md-6 pl-0 pr-20" v-if="question.imageUrl">
                            <img class="img_size" :src="question.imageUrl" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="question.type !== 'SurveyInstruction' && question.type !== 'SurveyCompletion' && question.type !== 'GPSkin' && question.type !== 'ImageCapture'">
                      <div class="question-section">
                        <h5 class="font-style fs-16">Screen {{question.questionNum}}</h5>
                        <p class="question_body">
                          <span v-html="question.formattedBody"></span>
                          <span v-if="question.characterLimited">(Limit - {{question.textLimit}})</span>
                        </p>
                        <div class="" v-if="question.hasBodyImage">
                          <div class="" v-for="img in question.bodyImages">
                            <img :src="img.imageUrl" alt="" class="wid300">
                          </div>
                        </div>
                         <label class="fw-normal display-block mb-15">
                                <span class="position_relative">Allow skipping: {{question.isSkippable}}</span>
                              </label> 
                      </div>
                      <div class="answer-section">
                        <div class="option-section" v-if="question.type.toLowerCase() === 'boolean'">
                          <div class="" v-for='option in question.options'>
                            <p class="radio-option">
                              <input type="radio" name="boolean_type" disabled>
                              <label>{{option.formattedBody}}</label>
                            </p>
                            <div v-if="questionIds[option.nextQuestion]">
                              <label class="pl-5">If this option is selected, skips to screen <b>{{questionIds[option.nextQuestion]}}</b></label>
                            </div>
                          </div>
                        </div>
                        <div class="option-section pad-top20" v-if="question.type.toLowerCase() === 'numberscale'">
                          <ds-slider v-if="!question.verticalScale" ref="slider" :value="question.minValue" :piecewise="true" direction="horizontal"
                            class="horizontal-vue-slider pl-20" :min="question.minValue" :max="question.maxValue" :disabled="true"
                            :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" 
                            :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                          <ds-slider v-if="question.verticalScale" ref="slider" :value="question.minValue" :piecewise="true" direction="vertical"
                            class="vertical-vue-slider pl-20" width="2" :min="question.minValue" :max="question.maxValue" :disabled="true"
                            :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" 
                            :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                        </div>
                        <div class="option-section pad-top20" v-if="question.type.toLowerCase() === 'customscale'">
                          <ds-slider v-if="!question.verticalScale" ref="slider" :value="question.formattedLabels[0]" :piecewise="true" width="1" direction="horizontal"
                            class="horizontal-vue-slider pl-20" :data="question.formattedLabels" :disabled="true"
                            :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" 
                            :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                          <ds-slider v-if="question.verticalScale" ref="slider" :value="question.formattedLabels[0]" :piecewise="true" width="2" direction="vertical"
                            class="vertical-vue-slider pl-20" :data="question.formattedLabels" :disabled="true"
                            :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" 
                            :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'text'">
                          <input type="text" class="input-text readonly" placeholder="" readonly />
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'datetime'">
                          <div class="col-sm-3 p-0" v-if="question.showDate">
                            <input type="text" class="input-text readonly" placeholder="" v-model="question.dateFormat" readonly>
                          </div>
                          <div class="col-sm-3 pt-3 pl-0" v-if="question.showTime">
                            <span v-if="question.timeFormat == '12'">
                            <input type="text" class="input-text readonly" placeholder="" value="--:-- AM" readonly>
                          </span>
                            <span v-if="question.timeFormat == '24'">
                            <input type="text" class="input-text readonly" placeholder="" value="--:--" readonly >
                          </span>
                          </div>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'number'">
                          <div class="">
                            <input type="text" class="input-text readonly" placeholder="" readonly>
                            <div>
                              <label class="fw-normal display-block pt-10" v-if="question.hasUnits">
                                <span class="position_relative">Answer label: {{question.units}}</span>
                              </label>
                              <label class="fw-normal display-block" v-if="question.hasMinMax">
                                <span class="position_relative">Min/max value
                                  <span class="position_relative">{{question.minValue}}</span>
                                  <span class="position_relative"> to {{question.maxValue}}</span>
                                </span>
                              </label>
                              <label class="fw-normal display-block" v-if="question.allowDecimals">
                                <span class="position_relative">Allow decimals: {{question.allowDecimals}}</span>
                              </label>  
                            </div>
                          </div>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'valuepicker'">
                          <div class="">
                            <input type="number" class="input-text readonly" placeholder="" readonly>
                          </div>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'imagechoice'">
                          <div class="">

                          </div>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'email'">
                          <div class="">
                            <input type="email" class="input-text readonly" placeholder="" readonly>
                          </div>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'location'">
                          <div class="">
                            <input type="text" class="input-text readonly" placeholder="" readonly>
                          </div>
                        </div>
                        <div class="option-section" v-if="question.type.toLowerCase() === 'multichoice'">
                          <div v-if="question.subType.toLowerCase() === 'multi'">
                            <div class="" v-for='option in question.options'>
                              <div v-if="option.enabled">
                              <label>
                                <input type="checkbox" disabled><span v-html="splitPTagfromContent(option.formattedBody)"></span>
                              </label>
                              <div class="" v-if="option.imageUrl">
                                <img :src="option.imageUrl" alt="">
                              </div>
                              <div v-if="questionIds[option.nextQuestion]">
                                <label class="pl-5">If this option is selected, skips to screen <b>{{questionIds[option.nextQuestion]}}</b></label>
                              </div>
                              </div>
                            </div>
                          </div>
                          <div v-if="question.subType.toLowerCase() === 'single'">
                            <div class="" v-for='option in question.options'>
                             <div v-if="option.enabled"> 
                              <label>
                                <input type="checkbox" disabled><span v-html="splitPTagfromContent(option.formattedBody)"></span>
                              </label>
                              <div class="" v-if="option.imageUrl">
                                <img :src="option.imageUrl" alt="" class="">
                              </div>
                              <div v-if="questionIds[option.nextQuestion]">
                                <label class="pl-5">If this option is selected, skips to screen <b>{{questionIds[option.nextQuestion]}}</b></label>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                        <div class="option-section lang-img-options" v-if="question.type.toLowerCase() === 'image'">
                          <div class="row justify-content-start">
                            <div class="col-auto pl-0 pr-0" v-for="(langOptionobj, loopIndex) in question.languageImageOptions" :key="loopIndex">
                              <div class="language-name">{{langOptionobj.languageName}}</div>
                              <div class="form-group clearfix" v-for="(option, optionIndex) in langOptionobj.options" ::key="optionIndex">
                                <div v-if="option.enabled">
                                <span v-if="question.subType.toLowerCase() === 'multi'">
                                  <input type="checkbox" id="checkbox" disabled>
                                </span>
                                <span v-else>
                                  <input type="radio" id="radio" disabled>
                                </span>
                                <img class="col-lg-2 img-size" :src="option.imageUrl">
                              </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-for="(question, index) in survey.questions" :key="index" class="pt-5">
              <b-row v-if="question.classType === 'Instruction' || question.classType === 'CompletionQuestion'">
                <label class="content">{{question.information}}</label>
              </b-row>
              <b-row v-if="question.classType === 'CustomScaleQuestion'">
                <label class="content">{{question.body}}</label><br>
                <vue-slider v-if="!question.verticalScale" ref="slider" :value="question.labels[0]" :piecewise="true" :piecewiseStyle="piecewiseStyle" :piecewiseActiveStyle="piecewiseActiveStyle"
                  :labelActiveStyle="labelActiveStyle" :piecewiseLabel="true" width="1" direction="horizontal" class="horizontal-vue-slider pt-35 pb-15 pl-20 pr-25"
                  :data="question.labels" :disabled="true"></vue-slider>
                <vue-slider v-if="question.verticalScale" ref="slider" :value="question.labels[0]" :piecewise="true" :piecewiseStyle="piecewiseStyle" :piecewiseActiveStyle="piecewiseActiveStyle"
                  :labelActiveStyle="labelActiveStyle" :piecewiseLabel="true" width="5" direction="vertical" class="vertical-vue-slider pt-20 pb-20" :data="question.labels" :disabled="true"></vue-slider>
              </b-row>
              <b-row class="content" v-if="question.classType !== 'Instruction'">
                {{question.body}}
                <b-form-radio-group class="col-12 pl-0" :id="question.identifier" stacked v-model="question.sequence" :name="question.identifier" v-for="(choice, index) in question.options" :key="index" :disabled="true">
                  <b-col align-self="center" class="pl-0">
                    <b-form-radio type="radio" class="pl-0">
                      <span class="pl-20 text-align">{{choice.body}}</span>
                    </b-form-radio>
                  </b-col>
                </b-form-radio-group>
              </b-row>
            </div> -->
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
    
<script>
import dsSlider from '../../../lib/ds-slider-component';
import toastr from 'toastr';

export default {
  name: 'survey-details',
  data() {
    return {
      surveyDetails: [],
      selectedSurvey: {},
      studyId: this.$route.params.studyId,
      surveyId: this.$route.params.surveyId,
      piecewiseActiveStyle: {
        backgroundColor: '#3498db',
      },
      labelActiveStyle: {
        color: '#3498db',
      },
      piecewiseStyle: {
        backgroundColor: '#ccc',
        visibility: 'visible',
        width: '12px',
        height: '12px',
      },
      questionIds: {},
      questions: [],
      emails: [],
      isRecipientFlagSet: false
    };
  },
  components: { dsSlider },
  methods: {
    splitPTagfromContent(text) {
      if(text == null) {
        return;
      }
      return text.replace('<p>', '').replace('</p>', '');
    },
    async getSurveyDetails() {
      try {
        const getSurveyDetails = await this.$api.getStudySurveyDetailsFact(this.studyId);
        this.surveyDetails = getSurveyDetails.body;
        await this.surveyDetails.forEach((survey, surveyIndex) => {
          if (survey.id === this.selectedSurvey.id) {
            let questionCount = 1;
            survey.questions.forEach((question, questionIndex) => {
              this.questionIds[question.id] = (question.sequence === 100000) ? 'End survey' : question.sequence;
              if(question.type == 'CustomScale') {
                if(question.formattedLabels == undefined) {
                  question.formattedLabels = question.labels;
                } else {
                  question.formattedLabels.forEach((element, index) => {
                    question.formattedLabels[index] = this.splitPTagfromContent(element);
                  });
                }
              }
              if (question.type !== 'SurveyCompletion') {
                this.surveyDetails[surveyIndex].questions[questionIndex].questionNum =
                  questionCount;
                questionCount += 1;
              }
            });
            if (survey.questions && survey.questions.length > 0) {
              this.questions = this.processEmailRecipientQuestions(survey.questions);
            }
          }
        });
      } catch (error) {
        this.$toastr.error(error.message || 'Unable to fetch the instructions, questions and notifications.');
      }
    },
    processEmailRecipientQuestions(ques) {
      let q = [];
      ques.map(function(value) {
        if(value.isNotifyToEmail) {
          q.push(value.body);
        }
      });
      return q;
    },
    getNotificationEmail() {
      this.$api.getNotificationEmails(this.surveyId, this.studyId).then(
      response => {
        this.emails = response.body;
      }, error => {
          toastr.error(
            error.body ? error.body.message : 'Error while getting the study details',
          );
        },
      );
    },
    getRecipientFlag() {
      this.$api.getRecipientFlag(this.studyId, this.surveyId).then(
      response => {
        this.isRecipientFlagSet = response.body && response.body.isNotificationRecipient ? response.body.isNotificationRecipient : false;
      }, error => {
          toastr.error(
            error.body ? error.body.message : 'Error while getting the study details',
          );
        },
      );
    },
  },
  mounted() {
    this.getSurveyDetails();
    this.selectedSurvey.id = this.surveyId;
    this.getNotificationEmail();
    this.getRecipientFlag();
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

.img-style {
  padding-top: 20px;
  height: 300px;
  width: 500px;
  padding-bottom: 20px;
}

.question_body {
  word-break: break-all;
  color: #959fa4;
}

.read_only_question {
  border-left: 8px solid #d3dfe4 !important;
  background-color: #f5f8fa;
}

.icon-style {
  color: #57dd7a;
  font-size: 25px;
  padding-top: 20px;
  background-color: #d6f0de;
  padding: 7px;
  padding-bottom: 3px;
  border-radius: 25px;
}

.font-style {
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #3498db;
}

.text-style {
  color: #969090;
  text-align: right;
}

.btn-style {
  margin-top: 10px;
  width: 80px;
  height: 29px;
  margin-bottom: 50px;
}

.custom-btn {
  background: #00baf9;
  color: #fff;
  width: 220px;
}

.pad-top50 {
  padding-top: 50px;
}

.form-control {
  border-radius: 2px;
}

.custom-para {
  padding-bottom: 20px;
  font-size: 20px;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.readonly {
  background: #f7f7f7;
}
.btn-disabled {
  color: white;
  background-color: #c6c2c2;
  border: #c6c2c2;
}

.instructionTitle {
  color: #959fa4;
}

.survey-name {
  color: #00baf9;
  font-size: 20px;
}

.pad-left50 {
  padding-left: 50px;
}
.branching_section {
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 5px 10px;
  
}
.branching_image {
  max-width: 120px;
  max-height: 120px;
  width: 100%;
  border: 1px solid #ccc;
}
.custom-btn-bg {
  background: linear-gradient(to left, #4b6fe6, #00baf9);
  color: #fff;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.pad-left100 {
  padding-left: 100px;
}

.mar-bot0 {
  margin-bottom: 0px !important;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 15px;
  margin-bottom: 16px;
}

.question_color,
input {
  color: #666769;
  font-size: 14px;
}

.radio-option {
  margin: 0px;
}

.input-text {
  width: 100%;
  border-radius: 2px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
}

.date-input {
  border-radius: 20px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
}

.pad-top20 {
  padding-top: 20px;
}

.vertical-vue-slider {
  height: 300px !important;
  width: 4px;
  padding: 11px;
  margin-left: 30px;
}

.horizontal-vue-slider {
  height: 8px;
  width: 100%;
}

.img-size {
  width: 100%;
  height: auto;
  float: none;
  padding: 10px 0 0;
  max-width: 120px;
  max-height: 120px;
}

label {
  font-weight: normal !important;
  word-break: break-all;
  color: #959fa4;
}
.wid300 {
  max-width: 300px !important;
}

.img_size {
  width: 100%;
  height: 100%;
  max-width: 100px;
  max-height: 100px;
}

.lang-img-options .col-auto{
  margin-right:66px !important;
}

.lang-img-options .col-auto:last-of-type{
  margin-right:0 !important;
}

.language-name{
  color:#959fa4;
}
</style>