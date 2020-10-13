<template>
  <div class="row">
    <draggable v-model="surveyQuestions" :options="{ disabled: draggable }" @start="drag=true" @end="drag=false" @change="onDragQuestion()">
      <div class="" v-for='(question, index) in surveyQuestions' v-if="question.type !== 'SurveyCompletion'">
        <div v-if="selectedQuestion.id === question.id">
          <addEditQuestion :options="selectedQuestion" :studyData="studyData"></addEditQuestion>
        </div>
        <div class="card read_only_question cursor_grab" v-if="selectedQuestion.id !== question.id">
          <div class="row">

            <div class="col-md-4 p-0">
              <p class="question_color"><img class="drag_img" src="static/img/drag.svg"/>Screen <span class="">{{ index + 1 }}:</span></p>
            </div>
            <div class="col-md-8 p-0 text-right" v-if="!hideEditBtn" style="white-space:nowrap; float:right;">
              <button class="btn btn-default color_blue br-2 mr-5 edit_button" :disabled="isDisabled" @click="reorderQuestion(index)" >Reorder</button>
              <button class="btn btn-default color_blue br-2 mr-5 edit_button" :disabled="isDisabled" v-on:click="duplicateQuestion(question)">Duplicate</button>
              <button class="btn btn-default color_blue br-2 mr-5 edit_button" :disabled="isDisabled" v-on:click="editQuestion(question, index)">Edit</button>
              <button class="btn btn-default color_blue br-2 mr-5 edit_button" :disabled="isDisabled" v-on:click="addBranchingForQuestion(question, index)"
                v-if="question.type && ((question.type.toLowerCase() === 'multichoice' && !question.multipleSelection) || question.type.toLowerCase() === 'boolean' || question.type.toLowerCase() === 'image' || question.type.toLowerCase() === 'surveyinstruction' )">Branching</button>
            </div>
            <div class="clearfix"></div>
            <div class="col-md-12 p-0">
              <div class="question-section">
                <div v-if="question.type === 'SurveyInstruction' || question.type === 'GPSkin' || question.type === 'ImageCapture'" class="ml-30">
                  <div v-if="!question.templateImageUrl">
                    <div class="instruction_title" v-html="question.formattedTitle"></div>
                    <div class="instruction_info" v-html="question.formattedInformation"></div>
                    <div class="row">
                      <div class="col-sm-6 col-md-6 col-lg-6">
                        <div v-if="question.imageUrl">
                          <img class="img-size" :src="question.imageUrl">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="row">
                      <div class="pl-0 col-md-6 col-lg-6">
                        <div class="instruction_title" v-html="question.formattedTitle"></div>
                        <div class="instruction_info" v-html="question.formattedInformation"></div>
                        <div v-if="question.imageUrl">
                          <img class="img-size" :src="question.imageUrl">
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-6">
                        <div class="instruction_title"><p>Template Image</p></div>
                        <div v-if="question.templateImageUrl">
                          <img class="img-size" :src="question.templateImageUrl">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                <p class="question_body ml-30" v-html="question.formattedBody"></p>
                <div class="" v-if="question.hasBodyImage">
                  <div class="" v-for="img in question.bodyImages">
                    <img :src="img.imageUrl" alt="" class="wid300">
                  </div>
                </div>
              
              <div class="answer-section ml-30">
                <div class="option-section" v-if="question.type.toLowerCase() === 'boolean'">
                  <div class="" v-for='option in question.options'>
                    <p class="radio-option">
                      <input type="radio" name="boolean_type" disabled>
                      <label>{{option.body}}</label>
                    </p>
                  </div>
                </div>
                <div class="option-section pad-top20" v-if="question.type.toLowerCase() === 'numberscale'">
                  <div v-if="!question.verticalScale">
                  <ds-slider ref="slider" v-if="question.partitions !== 0" :value="question.minValue" :piecewise="true" direction="horizontal"
                    class="horizontal-vue-slider pl-20" :min="question.minValue" :max="question.maxValue" :disabled="true"
                    :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" :interval="question.partitions"
                    :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                  <ds-slider ref="slider" v-else :value="question.minValue" direction="horizontal"
                    class="horizontal-vue-slider pl-20" :min="question.minValue" :max="question.maxValue" :disabled="true"
                    :labelActiveStyle="labelActiveStyle"></ds-slider>
                  <div class="pt-10 scaleLabels">
                    <div class="pull-left">{{question.minValueLabel}}</div>
                    <div class="pull-right">{{question.maxValueLabel}}</div>
                  </div>
                  </div>
                  <div  v-if="question.verticalScale">
                  <div class="scaleLabels">{{question.maxValueLabel}}</div>
                  <ds-slider ref="slider" v-if="question.partitions !== 0" :value="question.minValue" :piecewise="true" direction="vertical"
                    class="vertical-vue-slider pl-20" width="2" :min="question.minValue" :max="question.maxValue" :disabled="true"
                    :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" :interval="question.partitions"
                    :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                      <ds-slider ref="slider" v-else :value="question.minValue" direction="vertical"
                    class="vertical-vue-slider pl-20" width="2" :min="question.minValue" :max="question.maxValue" :disabled="true"
                    :labelActiveStyle="labelActiveStyle"></ds-slider>
                  <div class="scaleLabels" v-if="question.verticalScale">
                      {{question.minValueLabel}}
                  </div>
                  </div>
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
                  <div class="col-sm-3" v-if="question.showTime" :class="{'pl-10':(question.showDate)}">
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
                  </div>
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'valuepicker'">
                  <div class="">
                    <input type="number" class="input-text readonly" placeholder="" readonly>
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
                    <input type="checkbox" disabled><span class="display-inline" v-html="option.formattedBody"></span>
                  </label>
                      <div class="" v-if="option.imageUrl">
                        <img :src="option.imageUrl" alt="">
                      </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="question.subType.toLowerCase() === 'single'">
                    <div class="" v-for='option in question.options'>
                      <div v-if="option.enabled">
                      <label>
                    <input type="radio" name="single" disabled><span class="display-inline" v-html="option.formattedBody"></span>
                  </label>
                      <div class="" v-if="option.imageUrl">
                        <img :src="option.imageUrl" alt="" class="">
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="option-section lang-img-options" v-if="question.type.toLowerCase() === 'image'">
                  <div> 
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
    </div>
  </div>
</draggable>
    <div id="branchingModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content" v-if="selectedQuestionForBranching.type">
          <div class="modal-header border-none">
            <span>Screen {{selectedQuestionForBranching.index + 1}}</span>
            <button type="button" class="close modal_close_icon" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body pt-0 pb-0">
            <div class="branching_section">
              <div class="row pb-10 color_666669">
                <div class="col-md-4 fs-12 p-0" v-if="selectedQuestionForBranching.type !== 'SurveyInstruction'">If the answer is:</div>
                <div class="col-md-6 fs-12 p-0">Skip to:</div>
              </div>
              <div class="row pb-10" v-for="option in (selectedQuestionForBranching.type.toLowerCase() == 'image'?selectedQuestionForBranching.languageImageOptions[0].options : selectedQuestionForBranching.options )" v-if="selectedQuestionForBranching.type !== 'SurveyInstruction'">
                <div class="col-md-4 p-0">
                    <div v-if="selectedQuestionForBranching.type.toLowerCase() !== 'image'" v-html="option.formattedBody"></div>
                    <div v-else><img class="branching_image" :src="option.imageUrl" alt=""></div>
                </div>
                <div class="col-md-6 p-0">
                  <select class="form-control type_select" v-model="option.nextQuestion">
                    <option value="default" disabled>Select screen</option>
                    <option v-for="(question, index) in surveyQuestions" :value="question.id" v-if="question.id != selectedQuestionForBranching.id">
                      <span v-if="question.type !== 'SurveyCompletion'">{{index + 1}}</span>
                      <span v-if="question.type === 'SurveyCompletion'">End survey</span>
                    </option>
                  </select>
                </div>
                <div class="col-md-2 p-0">
                  <button class="btn btn-link br-25 fs-12" v-on:click="option.nextQuestion = 'default'">Clear</button>
                </div>
              </div>
              <div v-if="selectedQuestionForBranching.type === 'SurveyInstruction'">
              <div class="row pb-10">
               <div class="col-md-6 p-0">
                  <select class="form-control type_select" v-model="selectedQuestionForBranching.nextQuestionId">
                    <option value="default" disabled>Select screen</option>
                    <option v-for="(question, index) in surveyQuestions" :value="question.id" v-if="question.id != selectedQuestionForBranching.id">
                      <span v-if="question.type !== 'SurveyCompletion'">{{index + 1}}</span>
                      <span v-if="question.type === 'SurveyCompletion'">End survey</span>
                    </option>
                    <!-- <option :value="completedQuestion.id">Completion screen</option> -->
                  </select>
                </div>
                <div class="col-md-2 p-0">
                  <button class="btn btn-link br-25 fs-12" v-on:click="selectedQuestionForBranching.nextQuestionId = 'default'">Clear</button>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-link br-25" data-dismiss="modal">Cancel</button>
            <button class="btn btn-success save_btn br-25 width_100px" v-on:click="saveBranchingForQuestion(selectedQuestionForBranching)">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!--Reorder Modal -->
    <b-modal
      id="reorderingModal"
      hide-header
      hide-footer
      ref="reorderingModal"
      @hidden="resetReorderObj"
      :no-close-on-esc="noCloseOnBackdrop"
      :no-close-on-backdrop="noCloseOnBackdrop"
    >
      <template v-slot:modal-header>
        <div class="mb-20">
          <span class="modal-title">Question {{reorderQuestionIndex+1}}</span>
          <button type="button" class="close ml-30" @click="closeReorderModal()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </template>

      <div class="modal-body-cntr">
        <strong>Move to position</strong> <input type="text" v-model="reorderQuestionTo" class="form-control d-inline w-50 ml-10" />
        <div v-if="reorderError!==false && reorderError!==true" class="invalid-feedback">{{reorderError}}</div>
      </div>
      <div class="modal-footer justify-content-center pb-3">
            <button class="btn btn-primary move-btn" :disabled="reorderError || reorderError!=''" @click="checkBranching">Move</button>
      </div>    
    </b-modal>
    <!-- Reorder modal ends -->
  </div>
</template>

<script>
import toastr from 'toastr';
import _ from 'lodash';
import draggable from 'vuedraggable';
import swal from 'sweetalert2';
import dsSlider from '../../lib/ds-slider-component';
import addEditQuestion from './add-edit-question';
import sampleQuestionObj from "../survey-builder/surveyQuestion.json";
export default {
  name: 'qaCard',
  data() {
    return {
      selectedQuestion: { id: null },
      selectedQuestionForBranching: { id: null },
      studyId: null,
      surveyId: null,
      hideEditBtn: false,
      surveyQuestions: [],
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
      isDisabled: false,
      reorderQuestionIndex: null,
      reorderQuestionTo: null,
      noCloseOnBackdrop: true,
      reorderError: true
    };
  },
  props: ["studyData"],
  components: {dsSlider, addEditQuestion, draggable },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.surveyType = this.$route.params.surveyType;    
    this.hideEditBtn = this.$router.currentRoute.name === 'survey-review';
  },
  computed: {
    selectedQuestionChange() {
      return this.$store.getters.getSelectedQuestion;
    },
    questions() {
      return this.$store.getters.getSurveyQuestionsData;
    },
    draggable() {
      let drag = false;
      this.surveyQuestions.forEach(item => {
        if (item.id === this.selectedQuestion.id) {
          drag = true;
        }
      });
      return drag;
    },
    duplicateQuestionSaved() {
      return this.$store.getters.getNewQuestion;
    }    
  },
  watch: {
    selectedQuestionChange: {
      handler(val) {
        this.selectedQuestion = val;
      },
    },
    questions: {
      handler(val) {
        this.surveyQuestions = val;
        // when any change happens on the page bcoz of either by drag drop / deleting question or etc, scale que. design gets disturbed
        // so the below code refreshed the scale question designs.
        this.$nextTick(function () {
          if(this.$refs.slider){
            this.$refs.slider.forEach((slide,i) => {
              this.$refs.slider[i].refresh();
            });  
          }
        })
      },
    },
    duplicateQuestionSaved(val){
      if(!val){
        const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
        if (supportsNativeSmoothScroll) {
          //Lets scroll to the bottom as the new duplicate question is saved.
          window.scrollTo({
            top: document.body.scrollHeight+50,
            left: 0,
            behavior: 'smooth'
          });
        }else{
          this.smoothScrollTo(document.body.scrollHeight+50, 600);
        }
        //Enable all the buttons
        this.isDisabled = false;
      }
    },
    reorderQuestionTo(newVal) {
      let re = /[^0-9]/;
      let sanitizedValue = newVal.replace(re, '');
      this.$set(this, 'reorderQuestionTo', sanitizedValue);

      if (sanitizedValue != ""){
        let reorderQuestionNo = parseInt(this.reorderQuestionIndex) + 1;
        if (newVal == 0 || newVal > this.surveyQuestions.length-1 || newVal == reorderQuestionNo) {
          this.reorderError = "Please enter a valid position number";
        }else{
          this.reorderError = false;
        }  
      }
      else{
        this.reorderError = true;
      }  
    } 
  },
  methods: {
    editQuestion(question, index) {
      this.selectedQuestion = _.cloneDeep(question);
      if (this.selectedQuestion.type === 'MultiChoice' && !this.selectedQuestion.bodyImages) {
        this.selectedQuestion.bodyImages = [
          {
            sequence: 1,
            imageUrl: null,
            imageId: null,
          },
        ];
      }
      this.$store.dispatch('selectedQuestionAction', _.cloneDeep(this.selectedQuestion));
      this.$emit("editedEvent",index);
    },
    addBranchingForQuestion(question, index) {
      if(question.type.toLowerCase()!=='image'){
        _.forEach(question.options, value => {
          value.nextQuestion = value.nextQuestion ? value.nextQuestion : 'default'; // eslint-disable-line
        });
      }else{
        _.forEach(question.languageImageOptions[0].options, value => {
          value.nextQuestion = value.nextQuestion ? value.nextQuestion : 'default'; // eslint-disable-line
        });
      }
      
      question.nextQuestionId = question.nextQuestionId ? question.nextQuestionId : 'default'; // eslint-disable-line
      question.index = index; // eslint-disable-line
      this.selectedQuestionForBranching = _.cloneDeep(question);
      window.$('#branchingModal').modal('show');
    },
    saveBranchingForQuestion(option) {
      this.$store.dispatch('addQuestionAction', this.selectedQuestionForBranching);
      window.$('#branchingModal').modal('hide');
    },
    deleteQuestion(question) {
      this.$api.deleteQuestionFact(this.studyId, this.surveyId, question.id, this.surveyType).then(
        response => {
          toastr.success('Question deleted successfully');
          const questionIndex = _.findIndex(this.surveyQuestions, ['id', question.id]);
          this.surveyQuestions.splice(questionIndex, 1);
        },
        error => {
          this.errorMsg = error.body ? error.body.message : 'Error while deleting the question';
          toastr.error(this.errorMsg);
        },
      );
    },
    onDrag() {
      const sortedSequence = _.sortBy(_.map(this.surveyQuestions, 'sequence'));
      
      this.surveyQuestions.forEach((item, index) => {
        //eslint-disable-line
        if (item.type !== 'SurveyCompletion') {
          this.surveyQuestions[index].sequence = sortedSequence[index];
        } else if (item.type === 'SurveyCompletion' && item.id === '') {
          this.surveyQuestions.splice(index, 1);
        }
      });
      let send = this.surveyQuestions;
      send = _.sortBy(send, 'sequence');
      this.updateQuestionsSequence(send);
    },
    onDragQuestion() {
      const questionStatus = _.filter(this.surveyQuestions, o => o.branchingConfigured);
      if (questionStatus.length > 0) {
        swal({
          title:
            'Please be advised that some questions have a branching logic set up. We suggest you review and revise it as needed. Would you like to continue?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#b8c7ce',
          cancelButtonColor: '#34537d',
          confirmButtonText: 'Cancel',
          cancelButtonText: 'Yes',
        }).then(({ dismiss }) => {
          if (dismiss === 'cancel') {
            this.onDrag();
          } else {
            this.surveyQuestions = this.questions;
          }
        });
      } else {
        this.onDrag();
      }
    },
    duplicateQuestion(questionObj){
      //Lets disbale the Duplicate/Edit/Branching button
      this.isDisabled = true;

      //First of all create a sample question object 
      let questionSample = _.cloneDeep(
        JSON.parse(JSON.stringify(sampleQuestionObj))
      );

      //Remove the keys that we do not want to override/keep
      questionObj = _.omit(questionObj, ['id', 'branchingConfigured']);
      
      //Since omit does not support deep remove, we have to delete the nextQueston key from the options because nextQueston is used for branching
      _.map(questionObj.options, function(option){
        delete option.nextQuestion;
      });

      //If the question type is "IMAGE" then we need to use languageImageOptions
      if(questionObj.type.toLowerCase()==='image' && questionObj.languageImageOptions){
        //Since English languague will alwats be at 0 index that's why 
        _.map(questionObj.languageImageOptions[0].options, function(option){
          delete option.nextQuestion;
        });
        
      }

      //Create our duplicate question object.
      let duplicateQuestion = Object.assign({}, questionSample, questionObj);
      //Add a new key to this duplicate object which will let backend know that its a duplicate question
      duplicateQuestion.isDuplicate = true;
      
      let totalExistingQuestions = this.surveyQuestions.length;
      duplicateQuestion.questionNumber = totalExistingQuestions;
      
      let questionsWithoutcompletion = _.filter(this.surveyQuestions, function(o) { return o.type!="SurveyCompletion"; });
      duplicateQuestion.sequence = Number(
                  _.max(_.map(questionsWithoutcompletion, "sequence"))
                ) + 1;
             
      //Finally save the nw duplicated question.
      this.$store.dispatch('addQuestionAction', duplicateQuestion);
      
    },
    reorderQuestion(questionIndex){
      this.reorderError = true;
      this.reorderQuestionIndex = questionIndex;
      this.$refs.reorderingModal.show();
    },
    checkBranching(){
      const questionStatus = _.filter(this.surveyQuestions, o => o.branchingConfigured);
      if (questionStatus.length > 0) {
        swal({
          title:
            'Please be advised that this survey has a branching logic set up. We suggest you review and revise it as needed. Would you like to continue without reviewing?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#b8c7ce',
          cancelButtonColor: '#34537d',
          confirmButtonText: 'Cancel',
          cancelButtonText: 'Yes',
        }).then(({ dismiss }) => {
          if (dismiss === 'cancel') {
            this.reOrderQuestionPosition();
          } else {
            this.surveyQuestions = this.questions;
          }
        });
      } else {
        this.reOrderQuestionPosition();
      }
    },
    reOrderQuestionPosition(){

      let reorderQuestionNo = parseInt(this.reorderQuestionIndex) + 1;
      let seqUpdatedQuesObj = _.cloneDeep(this.surveyQuestions);
      seqUpdatedQuesObj[this.reorderQuestionIndex].sequence = seqUpdatedQuesObj[parseInt(this.reorderQuestionTo)-1].sequence ;
      if(reorderQuestionNo < this.reorderQuestionTo){
        //top->bottom
        for(let i = reorderQuestionNo; i < seqUpdatedQuesObj.length; i++){
          if (seqUpdatedQuesObj[i].type !== 'SurveyCompletion') {
          seqUpdatedQuesObj[i].sequence = parseInt(seqUpdatedQuesObj[i].sequence)-1;
          }
        }
      }else{
        //bottom->top
        for(let i = parseInt(this.reorderQuestionTo)-1; i < seqUpdatedQuesObj.length; i++){
          if(this.reorderQuestionIndex==i){continue;}
          if (seqUpdatedQuesObj[i].type !== 'SurveyCompletion') {
          seqUpdatedQuesObj[i].sequence = parseInt(seqUpdatedQuesObj[i].sequence) + 1;
          }
        }
      }
            
      seqUpdatedQuesObj = _.sortBy(seqUpdatedQuesObj, 'sequence');
      seqUpdatedQuesObj.forEach((item, index) => {
        if (item.type !== 'SurveyCompletion') {
          seqUpdatedQuesObj[index].sequence = parseInt(index)+1;
        }
      });
      
      this.updateQuestionsSequence(seqUpdatedQuesObj);
      this.$refs.reorderingModal.hide();
      
    },
    resetReorderObj(){
      this.reorderQuestionIndex = null;
      this.reorderQuestionTo = null;
    },
    updateQuestionsSequence(seqUpdatedQuesObj){
    this.$api.updateSurveyQuestionOrderFact(this.studyId, this.surveyId, seqUpdatedQuesObj, this.surveyType).then(
      response => {
        const questionAnswers = response.body;
        this.$store.dispatch('surveyQuestionsAction', questionAnswers);
        // when we swap scale questions its design is distorted so
        // refreshing the scale to redesign
        this.$nextTick(() => {
          if(this.$refs.slider){
            this.$refs.slider.forEach((slide,i) => {
              this.$refs.slider[i].refresh();
            });
          }
        });
        toastr.success('Your questions order has been successfully updated');
        
      },
      error => {
        
        this.surveyQuestions = this.questions;
        this.errorMsg = error.body ? error.body.message : 'Error while changing order';
      },
    );
    },
    closeReorderModal(){
      this.$refs.reorderingModal.hide();
    },
    // polyfilled smooth scrolling for IE, Edge & Safari
    smoothScrollTo(to, duration){
      const element = document.scrollingElement || document.documentElement,
          start = element.scrollTop,
          change = to - start,
          startDate = +new Date();

      // t = current time
      // b = start value
      // c = change in value
      // d = duration
      const easeInOutQuad = (t, b, c, d) => {
          t /= d/2;
          if (t < 1) return c/2*t*t + b;
          t--;
          return -c/2 * (t*(t-2) - 1) + b;
      };

      const animateScroll = _ => {
          const currentDate = +new Date();
          const currentTime = currentDate - startDate;
          element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
          if(currentTime < duration) {
              requestAnimationFrame(animateScroll);
          }
          else {
              element.scrollTop = to;
          }
      };
      animateScroll();
    }
  },
};
</script>

<style scoped lang="scss">
h1,
h2,
h3 {
  font-weight: 200;
}
.wid300 {
  max-width: 300px !important;
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
  border-left: 1px solid #d3dfe4 !important;
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
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

// Style for quick fixes bootstrap after migration (before redesign should be removed)

.option-section {
  &:after {
    content: '';
    clear: both;
    display: block;
  }
  .col-sm-3 {
    float: left;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

h1,
h2,
h3 {
  font-weight: 200;
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
  border-left: 1px solid #d3dfe4 !important;
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
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
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

.text-color {
  color: #888;
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
  .branching_image {
    max-width: 120px;
    max-height: 120px;
    width: 100%;
    border: 1px solid #ccc;
  }
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
  label {
    padding-left: 5px;
  }
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
  max-width: 120px;
  max-height: 120px;
  padding-left: 5px;
}

label {
  font-weight: normal !important;
  word-break: break-word;
  color: #959fa4;
}

.modal-dialog {
  width: 500px !important;
}

.instruction_title {
    word-break: break-word;
    text-align: justify;
    font-size: 18px;
    font-weight: bold;
  }
  .instruction_info {
    word-break: break-word;
  }

.edit_button {
  background-color: #ffffff;
  border: 1px solid #d3dfe4;
  font-size : 12px;
}

.drag_img {
  position: relative;
  bottom: 1px;
  margin-right: 6px;
}

.scaleLabels {
   font-size:12px;
   color:#666669;
}
.display-inline {
  display: inline-block;
  padding-left: 5px;
}
/deep/ .vue-slider-component .vue-slider-tooltip {
  display: none;
}
input[type=radio] {
  vertical-align: middle;
}

#reorderingModal{
  .move-btn{
    background-color: #4c8ce4;
    border-color: #4c8ce4;
    border-radius:20px;
    padding: 5px 30px;
  }
  button.close{
    margin-top: -2px;
  }
  .modal-title{
    font-size: 15px;
    font-weight: bold;
  }
  .invalid-feedback{
    display:block;
    font-size:13px;
    max-width:165px;
  }
}

.lang-img-options .col-auto{
  margin-right:126px !important;
}

.lang-img-options .col-auto:last-of-type{
  margin-right:0 !important;
}

.language-name{
  color:#959fa4;
}
</style>