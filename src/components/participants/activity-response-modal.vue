<template>
  <b-modal
    id="activity-response-modal"
    scrollable
    ref="activityResponseModal"
    size="lg"
    :no-close-on-esc="noCloseOnBackdrop"
    :no-close-on-backdrop="noCloseOnBackdrop"
    hide-footer
    hide-header
    @hidden="resetModalValues"
  >
    <div v-if="responseActivityDetail">
      <div class="top-header">
        <div v-if="multipleResponseSubmittedDates && allDone===true" class="other-responses-list">

         <div @click="toggleDatesDropDown" class="selectedResponse" ref="responsesDatesDropDown">
            {{selectedResponse}}
            <span class="dropdown-icon">
              <img src="static/img/arrow-down.png"/>
            </span>
          </div>

          <div v-show="showResponseDropdown" class="autocomplete-items" :style="{'max-height': `${responseDateHeight}px`}" ref="otherResponsesDropdown">
            <div
              v-for="(submittedRes, rindex) in multipleResponseSubmittedDates"
              :key="rindex"
              class="item-detail" :class="{active: rindex == selectedResponseIndex}"
              v-on="selectedResponseIndex!=rindex ? { click: () => {changeResponse(submittedRes);selectedResponseIndex = rindex;showResponseDropdown=false;} } : {}"
            >
              <div>
                <span class="day mr-8">Day {{submittedRes.completedDay}}</span>
                <span class="mr-10">{{submittedRes.status}}</span>
                {{new Date(submittedRes.completedOn) | formatUTCDate}}
                <span v-if="rindex==0" class="day ml-10">Latest</span>
              </div>
            </div>
          </div>

        </div><!-- End other response list -->

        <div class="other-responses-list" v-if="otherSubmittedResponse.length == 1">
          <span>{{otherSubmittedResponse[0].status}}</span>{{new Date(otherSubmittedResponse[0].completedOn) | formatUTCDate}}
        </div>
        <b-form-select v-model="responseLanguage" size="sm" :options="responseLanguageOptions" class="language-dropdown" ></b-form-select>

        <button class="close-icon" @click="hide()"><span class="fa fa-times"></span></button>

      </div>

      <div class="heading">

        <div v-if="multipleResponseSubmittedDates" v-on="!oldestResponse ? { click: () => navigateResponse(-1) } : {}" class="left-arrow" :disabled="oldestResponse" :class="{'arrow-disabled': oldestResponse}">
          <span class="fa fa-long-arrow-left"></span>
        </div>

        <div class="activity-name">{{responseActivityDetail.name}}</div>

        <div v-if="multipleResponseSubmittedDates" v-on="!latestResponse ? { click: () => navigateResponse(1) } : {}" class="right-arrow" :disabled="latestResponse" :class="{'arrow-disabled': latestResponse}">
          <span class="fa fa-long-arrow-right"></span>
        </div>

      </div>

      <div id="response-container" class="response-container">
        <div v-if="displayingResponse && displayingResponse.length>0 && allDone===true">
          <div class="row que-ans-heading">
            <div class="col-md-6"><strong>QUESTION</strong></div>
            <div class="col-md-6 pl-25"><strong>ANSWER</strong></div>
          </div>
          <div class="answers">
            <div v-for="(ques, index) in displayingResponse" :key ="index" class="row response">
              <div class="col-md-6">
                <span class="index-no">{{index+1}}.</span>
                <div class="ml-20">
                  <div>{{ques.questionBody}}</div>
                  <div v-if="ques.questionType == 'ImageCapture'">
                    <div v-html="ques.questionInformation" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 answer-text">

                <div v-if="ques.questionType == 'Image'">
                  <div v-for="(imgURL, imgIndex) in ques.imageUrls" :key="imgIndex" class="mb-15 mr-15 d-inline-block">
                    <img v-if="imgURL" class="img-response" :src="imgURL" alt="image response">
                    <div class="d-flex w-90 h-100 img-thumbnail" v-else>
                      <div class="row justify-content-center align-self-center p-28">
                        N/A
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="ques.questionType == 'ImageCapture'" class="image-capture">
                  <div>
                    <img v-if="ques.answerText" class="img-response d-block" :src="ques.answerText" alt="image response">
                  </div>
                </div>
                <div v-else-if="ques.questionType == 'GPSkin'" class="gpskin">
                  <div v-for="(ans, gi) in ques.answerText" :key="gi" class="row">
                    <div class="col-md-4 p-0">{{ans.attribute}}</div><div class="col-md-8">{{ans.value}} {{ans.unit}}</div>
                  </div>
                </div>
                <div v-else class="break-word" v-html="ques.answerText"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activityResponsePayload && allDone===true">
          <JsonTree :treeOpen="true" :json="activityResponsePayload" />
        </div>
        <div v-else class="snippet" data-title=".dot-stretching">
          <div class="stage">
            <div class="dot-stretching"></div>
          </div>
        </div>
        <div class="mod-footer text-center">
          <div class="footer-text">End of Participant Reported Data</div>
          <div v-show="showScrollUp" class="scroll-top" @click="scrollUp()">scroll to top</div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import JsonTree from '@/components/common/json-tree';
export default {
  name: "participant-response-modal",
  props: ["responseActivityDetail", "responseLanguageOptions", "generalParticipantInfo"],
  data() {
    return {
      noCloseOnBackdrop: true,
      selectedResponse: null,
      //selectedResponseId: null,
      selectedResponseIndex: null,
      responseLanguage: "EN",
      multipleResponseSubmittedDates: null,
      questionAnswers: [],
      quesCollection: [],
      displayingResponse: null,
      showScrollUp: false,
      responseDateHeight: 200,
      showResponseDropdown: false,
      activityResponsePayload: null,
      otherSubmittedResponse: null
    };
  },
  computed: {
    latestResponse(){
      if(!this.multipleResponseSubmittedDates) return;
      return this.selectedResponseIndex == 0 ;
    },
    oldestResponse(){
      if(!this.multipleResponseSubmittedDates) return;
      return this.selectedResponseIndex == this.multipleResponseSubmittedDates.length-1 ;
    },
    allDone(){
      if(this.responseActivityDetail != null){
        if( this.responseActivityDetail.type.toLowerCase()=='survey' && this.displayingResponse!=null && this.displayingResponse.length>0 && this.otherSubmittedResponse != null){
          return true;
        }
        else if( this.responseActivityDetail.type.toLowerCase()=='activity' && this.activityResponsePayload !=null && this.otherSubmittedResponse != null){
            return true;
        }
      }
      else{
        return false;
      }
    }
  },
  watch: {
    responseLanguage(v){
      let responseToDisplay =  _.filter(this.quesCollection, ['language', v]);
      this.displayingResponse = responseToDisplay[0].question;
    },
    responseActivityDetail(v){
      if(v!=null){
        this.changeResponse(this.responseActivityDetail, 'id');
        this.getActivitySubmmitedList();
      }
    },
    selectedResponseIndex(indx){
      //Prepare the selected response date string and set the selected response id whenever the value gets changes from the dates dropdown or from the navigation arrows;
      if(indx!=null)
      {
        this.prepareSelectedResponseDateString();
      }
    }
  },
  methods: {
    show() {
      this.$refs.activityResponseModal.show();
    },
    hide() {
      this.responseLanguage = "EN";
      this.$refs.activityResponseModal.hide();
    },
    changeResponse(responseObj, which=null){
      this.showScrollUp = false;
      let responseType = responseObj.type.toLowerCase();
      if(responseType.toLowerCase() == "survey"){
        this.getSurveyResponseDetails(
          {
            surveyId: responseObj.id,
            completedOn: responseObj.completedOn,
            reportedDataTrackerId: responseObj.reportedDataTrackerId,
          }
        );
      }
      else{
        if(which != null) {
          this.getActivityResponseDetails(responseObj.reportedDataTrackerId);
          return;
        }
        this.getActivityResponseDetails(responseObj.id);
      }

    },
    getSurveyResponseDetails({surveyId, completedOn, reportedDataTrackerId}) {

      this.questionAnswers = [];
      this.displayingResponse = [];
      this.quesCollection = [];

      if(this.responseActivityDetail){
        const getReq = {
          studyId: this.$route.params.studyId,
          pid: this.$route.params.participantId,
          surveyId: surveyId,
          responseDate: completedOn,
        };
        if (reportedDataTrackerId) {
          getReq.reportedDataTrackerId = reportedDataTrackerId;
        }
        nprogress.start();
        this.$api
          .getSurvey(getReq)
          .then(data => {
            nprogress.done();
            this.questionAnswers = _.sortBy(data.responses, 'sequence');
            this.prepareQuestions();
          }, error => {
            nprogress.done();
            const { message = 'Error while survey request' } = (error && error.body) || {};
            this.$toastr.error(message);
          });
      }
    },
    getActivityResponseDetails(activityId){
      this.activityResponsePayload = null;
      this.$api
        .getActivity({
          aId: activityId,
        })
        .then(data => {
          this.activityResponsePayload = JSON.parse(data.payload);
        })
        .catch(error => {
          const { message = 'Error while activity response request' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    prepareQuestions() {
      let self = this;
      self.quesCollection = [{language: "EN", question: self.questionAnswers}];

      _.map(self.quesCollection[0].question,  function(q) {

        let questionType = q.questionType.toLowerCase();
        q.questionBody = self.$options.filters.stripTags(q.questionBody);

        if(questionType == 'image' && q.languageImageUrls){
          let imgUrls = _.filter(q.languageImageUrls, {languageCulture: 'EN'} );
          q.imageUrls = imgUrls[0].imageUrls
        }
        else if(questionType == 'gpskin'){
          let answerText = JSON.parse(q.answerText);
          q.answerText = answerText.gpskin.result;
        }

      });//Map Ends

      if(this.responseLanguageOptions.length>1){


        let otherLang = _.cloneDeep(this.questionAnswers);

        _.map(otherLang,  function(q) {

          let questionType = q.questionType.toLowerCase();

          q.questionBody = self.$options.filters.stripTags(q.displayQuestionText);
          q.answerText =  q.displayAnswerText;

          if(questionType == 'image'  && q.languageImageUrls){
            let imgUrls = _.filter(q.languageImageUrls, {languageCulture: q.displayLanguage} );
            if(imgUrls.length)
            {
              q.imageUrls = imgUrls[0].imageUrls
            }
          }
          else if(questionType == 'gpskin'){
            let answerText = JSON.parse(q.answerText);
            q.answerText = answerText.gpskin.result;
          }

        });//Map ends

        self.quesCollection.push({language: self.responseLanguageOptions[1].value, question: otherLang});

      }//End if

      let responseToDisplay =  _.filter(self.quesCollection, ['language', self.responseLanguage]);
      this.displayingResponse = responseToDisplay[0].question;
    },
    getActivitySubmmitedList() {
      //Get all the submitted response for the survey being shown
      if(this.responseActivityDetail){
        let getReq = {
          studyId: this.$route.params.studyId,
          pid: this.$route.params.participantId,
          id: this.responseActivityDetail.id,
          startDay: this.generalParticipantInfo.startDay,
          endDay: this.generalParticipantInfo.endDay,
          type: this.responseActivityDetail.type,
        };

        this.$api
        .getSurveyResponsesList(getReq)
        .then(data => {
          this.otherSubmittedResponse = data;
          if(data.length>1){
            let sortDataAsc = _.sortBy(data, ['completedOn']);
            this.multipleResponseSubmittedDates = _.reverse(sortDataAsc);//Order by date so that latest comes first

            //Find the index of the response being displayed
            let responseType = this.responseActivityDetail.type.toLowerCase();
            if(responseType == "survey"){
              this.selectedResponseIndex = _.findIndex(this.multipleResponseSubmittedDates, ['reportedDataTrackerId', this.responseActivityDetail.reportedDataTrackerId]);
            }else{
              this.selectedResponseIndex = _.findIndex(this.multipleResponseSubmittedDates, ['id', this.responseActivityDetail.reportedDataTrackerId]);
            }

          }
        }, error => {

          const { message = 'Error while all submitted response' } = (error && error.body) || {};
          this.$toastr.error(message);
        })
      }
    },
    toggleDatesDropDown(){
      this.showResponseDropdown = !this.showResponseDropdown;
      //this.$nextTick(() => {
        if(this.showResponseDropdown){
          this.$refs.otherResponsesDropdown.focus();
        }
      //});
    },
    navigateResponse(move){
      this.showResponseDropdown = false;
      if(move==1){
        this.selectedResponseIndex = this.selectedResponseIndex - 1 ;
      }else{
        this.selectedResponseIndex = this.selectedResponseIndex + 1 ;
      }
      this.changeResponse(this.multipleResponseSubmittedDates[this.selectedResponseIndex]);

    },
    prepareSelectedResponseDateString(){
      let displayedResponseObj = this.multipleResponseSubmittedDates[this.selectedResponseIndex];
      let formatResponseDate = this.$options.filters.formatUTCDate(displayedResponseObj.completedOn);
      this.selectedResponse = `${displayedResponseObj.status} ${formatResponseDate}`;

      //this.selectedResponseId = displayedResponseObj.reportedDataTrackerId;
    },
    scrollUp(){
      window.$('.response-container').animate({
        scrollTop: 0
      }, 100);
    },
    resetModalValues(){
      this.$emit("resetActivityResponse");
      this.selectedResponse = null;
      //this.selectedResponseId = null;
      this.selectedResponseIndex = null;
      this.responseLanguage = "EN";
      this.multipleResponseSubmittedDates = null;
      this.questionAnswers = [];
      this.quesCollection = [];
      this.displayingResponse = null;
      this.showScrollUp = false;
      this.responseDateHeight = 200;
      this.showResponseDropdown = false;
      this.activityResponsePayload = null;
      this.otherSubmittedResponse = null;

    }
  },
  updated() {
    this.$nextTick(() => {
      let responseContainer = document.getElementById('response-container');
      if(responseContainer){
        this.showScrollUp = responseContainer.scrollHeight > responseContainer.clientHeight;
      }
      let modalBody = document.getElementById('activity-response-modal___BV_modal_body_');
      this.responseDateHeight = modalBody.clientHeight - 100;
    })
  }
};
</script>

<style lang="scss">

@media (min-width: 992px) {
  #activity-response-modal{
    .modal-dialog {
      min-width: 800px !important;
      vertical-align: top;
      max-height: calc(100% - 1rem);
      margin: 3.125rem auto;
    }
  }
}
#activity-response-modal{
  .top-header{
    text-align: center;
    padding: 10px;
    position: relative;
    min-height: 40px;
    .response-dates{
      border: 0;
      width: auto;
      background: #F1F4F8 url(/static/img/arrow-down.png) no-repeat;
    }
    .language-dropdown{
      background: #F1F4F8 url(/static/img/arrow-down.png) no-repeat;
      border: 0;
      width: 100px;
      position: absolute;
      right: 48px;
      top: 4px;
    }
    .close-icon{
      background: transparent;
      border: 0;
      opacity: .6;
      cursor: pointer;
      color: #000000;
      margin-right: 3px;
      float: right;
    }
  }
  .heading{
    text-align: center;
    color: #000000;
    font-size: 15px;
    padding: 12px 20px;
    background-color: #FFFFFF;
    .activity-name{
      display: inline-block;
    }
    .left-arrow{
      color: #4a90e2;
      float: left;
      display: inline-block;
      cursor: pointer;
      &.arrow-disabled{
        color: #DEE3E9;
        cursor: inherit;
      }
    }
    .right-arrow{
      color: #4a90e2;
      float: right;
      display: inline-block;
      cursor: pointer;
      &.arrow-disabled{
        color: #DEE3E9;
        cursor: inherit;
      }
    }
  }
  .modal-content{
    background-color: #F1F4F8;
    max-height: calc(100vh - 3.5rem);
  }
  .modal-body{
    padding: 0;
    overflow-y: hidden;
  }
  .response-container{
    scroll-behavior: smooth;
    max-height: calc(100vh - 12.063rem);
    overflow-y: auto;
    margin-top: 5px;
    background-color: #FFFFFF;
    padding: 20px 40px 0px 40px;
    color: #4a4a4a;

    //Scrollbar CSS for Mozilla
    scrollbar-color: #4a4a4a white; /* thumb and track color */
    scrollbar-width: thin;

    //Below is the scrollbar css for Chrome

    &::-webkit-scrollbar {
        width: 6px;
        background-color: #FFFFFF;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #4a4a4a;
        border-radius: 2px;
    }
    &::-webkit-scrollbar-track {
      //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      background-color: #FFFFFF;
    }
    .que-ans-heading{
      font-size: 10px;
      border-bottom: 1px solid #F1F4F8;
      padding-bottom: 5px;
    }
    .answers{
      font-size: 13px;
      .response{
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #F1F4F8;
        .index-no{
          float: left;
        }
        .answer-text{
          padding-left:25px;
          .img-thumbnail{
            color: #4a4a4a;
            border: 1px solid #4a4a4a;
            opacity: 0.5;
          }
          .img-response{
            width: auto;
            height: 100px;
            max-width: 100%;
          }
          .break-word {
            word-break: break-word;
          }
        }
      }

    }
    .mod-footer{
      color: #4a4a4a;
      font-size: 12px;
      margin-bottom: 10px;
      margin-top: 10px;
      position: relative;
      .footer-text{
        opacity: 0.4;
      }
      .scroll-top{
        color: #4a90e2;
        opacity: 1;
        right: 30px;
        top: 0;
        position: absolute;
        cursor: pointer;
      }
    }
  }
  .stage {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 2rem 0;
    margin: 0 -5%;
    overflow: hidden;
  }

  //-----------------------
  /*Dates responses dropdown*/
  .other-responses-list {
    position: relative;
    display: inline-block;
    /* width: 100%; */
    .selectedResponse{
      cursor: context-menu;
      .dropdown-icon{
        margin-top: -2px;
        position: absolute;
      }
    }

  }

  .autocomplete-items {
    position: absolute;
    border: 1px solid #F1F4F8;
    border-top: none;
    z-index: 99;
    /*position the autocomplete items to be the same width as the container:*/
    top: 27px;
    left: -35px;
    right: 0;
    overflow-y: auto;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.31);
    width: max-content;
    outline: none;

    //Scrollbar CSS for Mozilla
    scrollbar-color: #4a4a4a white; /* thumb and track color */
    scrollbar-width: thin;

    //Below is the scrollbar css for Chrome

      &::-webkit-scrollbar {
          width: 6px;
          background-color: #FFFFFF;
      }
      &::-webkit-scrollbar-thumb {
          background-color: #4a4a4a;
          border-radius: 2px;
      }
      &::-webkit-scrollbar-track {
        //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #FFFFFF;
      }

    .day{
      opacity: 0.3;
    }
  }
  .autocomplete-items .item-detail {
    padding: 7px;
    cursor: pointer;
    background-color: #fff;
    border-bottom: solid 0.5px #F1F4F8;
    font-size: 12px;
    color: #4a4a4a;
    text-align: left;
    &.active{
      background-color: #F1F4F8;
    }
  }
  .autocomplete-items .item-detail:hover {
    background-color: #F1F4F8;
  }

}
/**
 * ==============================================
 * Dot Stretching
 * ==============================================
 */
.dot-stretching {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #4C8CE4;
  color: #4C8CE4;
  transform: scale(1.25, 1.25);
  animation: dot-stretching 2s infinite ease-in;
}

.dot-stretching::before, .dot-stretching::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-stretching::before {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #4C8CE4;
  color: #4C8CE4;
  animation: dot-stretching-before 2s infinite ease-in;
}

.dot-stretching::after {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #4C8CE4;
  color: #4C8CE4;
  animation: dot-stretching-after 2s infinite ease-in;
}

@keyframes dot-stretching {
  0% {
    transform: scale(1.25, 1.25);
  }
  50%,
  60% {
    transform: scale(0.8, 0.8);
  }
  100% {
    transform: scale(1.25, 1.25);
  }
}

@keyframes dot-stretching-before {
  0% {
    transform: translate(0) scale(0.7, 0.7);
  }
  50%,
  60% {
    transform: translate(-20px) scale(1, 1);
  }
  100% {
    transform: translate(0) scale(0.7, 0.7);
  }
}

@keyframes dot-stretching-after {
  0% {
    transform: translate(0) scale(0.7, 0.7);
  }
  50%,
  60% {
    transform: translate(20px) scale(1, 1);
  }
  100% {
    transform: translate(0) scale(0.7, 0.7);
  }
}
</style>
