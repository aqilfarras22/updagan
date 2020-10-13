<template>
  <b-container fluid class="study-particip-survey-page pt-30">
    <b-row>
      <b-col cols="2">
        <dl>
          <dt>Task Name</dt>
          <dd>{{ surveyName }}</dd>
        </dl>
        <hr class="mt-30 mb-30" />
        <ParticipantInfo :participantDetails="participantInfo" :surveyLocalResponseDate="surveyLocalResponseDate" :surveyLocalResponseOffset="surveyLocalResponseOffset"/>
      </b-col>
      <b-col cols="8">
        <div class="docs-card mb-30">
          <div class="wrapper">
            <b-tabs content-class="mt-3">
              <b-tab :title="item.language"  v-for="(item, index) in questions" :key="index">
                <b-list-group v-if="questions" flush class="pt-24">
                  <b-list-group-item class="item border-0 pt-0 pb-0" v-for="(ques, qIndex) in item.question" :key="qIndex">
                    <dl class="question">
                      {{ qIndex+1 }}. {{ stripHTML(ques.questionBody) }}
                      <div class="answer">
                        <div v-if="ques.questionType == 'Image'">
                          <div v-for="(imgURL, imgIndex) in ques.imageUrls" :key="imgIndex" class="mb-15">
                            <img v-if="imgURL" class="img_response d-block" :src="imgURL" alt="image response">
                            <div class="d-flex w-150 h-100 img-thumbnail" v-else>                           
                              <div class="row justify-content-center align-self-center p-52">
                                N/A
                              </div> 
                            </div>
                          </div>
                        </div>
                        <div v-else-if="ques.questionType == 'ImageCapture'">
                          <div class="questionInfo" v-html="ques.questionInformation">
                          </div>
                          <div class="mb-15">
                            <img v-if="ques.answerText" class="img_response d-block" :src="ques.answerText" alt="image response">
                          </div>
                        </div>
                        <span v-else-if="ques.questionType == 'GPSkin'"><JsonTree readableKeys :json="JSON.parse(ques.answerText)" /></span>
                        <span v-else v-html="ques.answerText"></span>
                      </div>
                    </dl>
                  </b-list-group-item>
                </b-list-group>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import sortBy from 'lodash/sortBy';
import JsonTree from '@/components/common/json-tree';
import ParticipantInfo from '@/components/participants/participant-info';
import moment from 'moment';

export default {
  name: 'study-participant-survey',
  components: {
    ParticipantInfo,
    JsonTree,
  },
  data() {
    return {
      participantInfo: {},
      surveyName: '',
      questions: [],
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      surveyDate: this.$route.params.surveyDate,
      trakerId: this.$route.params.trakerId,
      surveyLocalResponseDate: '',
      surveyLocalResponseOffset: '',
    };
  },
  computed: {
    surveyId() {
      return this.$route.params.surveyId;
    },
  },
  methods: {
    stripHTML(data) {
      if(data == null) {
        return;
      }
      let regex = /(<([^>]+)>)/ig;
      return data.replace(regex, "");
    },
    prepareQuestions() {
      var quesCollection = [];
      
      quesCollection.push({language: "English", question: this.questions});
      _.map(quesCollection[0].question,  function(q) {
        if(q.questionType.toLowerCase() == 'image' && q.languageImageUrls){
          let imgUrls = _.filter(q.languageImageUrls, {languageCulture: 'EN'} );
          q.imageUrls = imgUrls[0].imageUrls
          return q;
        }
      });
      if(this.participantInfo && this.participantInfo.participantLanguage){
        let participantLang = this.participantInfo.participantLanguage.language_culture;
        if(!(participantLang == "EN")){
          var spanishQues = _.cloneDeep(this.questions);    
          _.map(spanishQues,  function(q) {
            q.questionBody = q.displayQuestionText;
            q.answerText =  q.displayAnswerText;
            if(q.questionType.toLowerCase() == 'image'  && q.languageImageUrls){
              let imgUrls = _.filter(q.languageImageUrls, {languageCulture: q.displayLanguage} );
              if(imgUrls.length)
              {
                q.imageUrls = imgUrls[0].imageUrls
              }
            }
            return q;
          });
          quesCollection.push({language: this.participantInfo.participantLanguage.display_name, question: spanishQues});
        }
      }
      
      this.questions = quesCollection;
    },
    getDetails() {
      const getReq = {
        studyId: this.$route.params.studyId,
        pid: this.$route.params.participantId,
        surveyId: this.surveyId,
        responseDate: this.surveyDate,
      };
      if (this.trakerId) {
        getReq.reportedDataTrackerId = this.trakerId;
      }
      this.$api
        .getSurvey(getReq)
        .then(data => {
          this.questions = sortBy(data.responses, 'sequence');
          this.prepareQuestions();
          this.surveyName = data.surveyName;
          if (data.surveyLocalResponseDate && data.surveyLocalResponseOffset) {
            let d = moment(data.surveyLocalResponseDate).utcOffset(data.surveyLocalResponseOffset);
            this.surveyLocalResponseDate = moment(d).format('DD MMMM YYYY hh:mm A');
            this.surveyLocalResponseOffset = data.surveyLocalResponseOffset ? (data.surveyLocalResponseOffset): ('');
          }
        }, error => {
          const { message = 'Error while survey request' } = (error && error.body) || {};
          this.$toastr.error(message);
        })
    },
    getParticipantDetails() {
      this.$api.getParticipantDataFact(this.studyId, this.participantId).then(
        response => {
          this.participantInfo = response.body;
          this.getDetails();
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participant.');
        },
      );
    },
  },
  mounted() {
    this.getParticipantDetails();
  },
};
</script>

<style lang="scss">
@import '~@/assets/variables.scss';
.study-particip-survey-page {
  background-color: $color_content_background;

  .docs-card {
    width: 100%;
    background-color: #fff;
    border: 1px solid #d4d9e2;
    min-height: 50px;
  }
}
dt {
  font-size: 10px;
  line-height: 1.6;
  text-transform: uppercase;
  color: #adaeb1;
}
dd {
  color: #666669;
  font-size: 14px;
  font-weight: 500;
}
.question {
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
}
.answer {
  font-weight: 700;
  font-style: normal;
  font-stretch: normal;
  margin: 0;
  padding-left: 20px;
  padding-top: 0.5rem;
}
.item {
  line-height: 15px;
}
.img_response {
  width: 150px;
  height: 100px;
}
.nav-tabs {
  padding: 0px 15px;
}
.nav-tabs .nav-item {
  margin-bottom: 0px;
}
.nav-tabs .nav-link.active {
  border-color: #ffffff;
}
[tabindex="-1"]:focus {
  outline: none;
}
a {
  color: #495057;
}
a:hover {
  color: #495057;
}
.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
  border: none;
}
.nav-item {
  .nav-link {
    &.active {
      border-bottom: 2px solid #4c8ce4;
      font-weight: 700;
    }
  }
}

.questionInfo {
  margin: 10px 0;
  font-weight: normal!important;
}
</style>
