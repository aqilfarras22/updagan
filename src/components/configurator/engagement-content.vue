<template>
  <div class="container mb-100">
    <div class="edros">
      <div class="mt-100 container-style">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="">
            <div class="fs-14">Learn is where you will be providing your participants with information about you and your study.
              This is also where your participants will have the opportunity to provide app feedback and share the app.</div>
            <h3 class="header_title">Learn</h3>
            <div class="fs-14">These pages will be presented to your participants as individual screens under the “Learn” section. We have a
              few topics recommended for you already. Please edit, modify, or delete as you see fit.</div>
            <h3 class="header_title">Information screens</h3>
            <div class="pb-10 fs-12">{{allScreens && allScreens.length || 0}} screens total</div>
            <div class="color_blue fs-12 cursor_pointer" v-on:click="collapse = false" v-if="collapse">expand</div>
            <div class="color_blue fs-12 cursor_pointer" v-on:click="collapse = true" v-if="!collapse && !addScreen">collapse</div>
            <div class="row card no_data_card mt-15" v-if="allScreens && allScreens.length === 0">
              <h6 class="color_blue">There are no screens to preview</h6>
            </div>
            <div v-if="collapse && allScreens && allScreens.length">
              <div class="card read_only_screen  bl_5px">
                <div class="row">
                  <div class="col-lg-11 col-md-11 col-sm-10 col-xs-10 p-0">
                    <div class="screen_title">{{allScreens[0].sectionTitle}}</div>
                    <div class="pt-5" v-html="allScreens[0].sectionHtmlDetails"></div>
                    <!--<div class="">{{allScreens[0].sectionHtmlDetails}}</div>-->
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 p-0 text-right">
                    <button class="btn btn-default edit_btn" v-on:click="collapse = false">Edit</button>
                  </div>
                </div>
              </div>
              <div class="card stack1">
              </div>
              <div class="card stack2">
              </div>
              <div class="card stack3">
              </div>
              <div class="card stack4" v-if="allScreens.length > 3">
              </div>
            </div>
            <draggable v-model="allScreens" :options="{ disabled: draggable }" @start="drag=true" @end="drag=false" @change="onDragInfoScreen()">
              <div v-for="(screen, index) in allScreens" v-if="!collapse">
                <div class="row card read_only_screen bl_5px cursor_grab" v-if="selectedScreen.index !== screen.index">
                  <div class="col-lg-11 col-md-11 col-sm-10 col-xs-10 p-0">
                    <div class="screen_title">{{screen.sectionTitle}}</div>
                    <div class="pt-5 mb-0" v-html="screen.sectionHtmlDetails"></div>
                    <!--<div class="">{{screen.sectionHtmlDetails}}</div>-->
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 p-0 text-right">
                    <button class="btn btn-default edit_btn" v-on:click="editInformation(screen)">Edit</button>
                  </div>
                </div>
                <div class="card bl_5px" v-if="(selectedScreen.index === screen.index && addScreen)">
                  <div class="row pt-10">
                    <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 p-0">
                      <select class="form-control type_select br-2" v-model="selectedScreen.sectionType" v-on:change="changeSectionType(selectedScreen.sectionType)">
                        <option v-for="sectionType in sectionTypes" :value="sectionType.title">{{sectionType.title}}</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div class="row pt-10">
                    <div class="col-lg-11 col-md-10 col-sm-9 col-xs-8 p-0">
                      <div class="section_heading">Page Title</div>
                      <div class="form-group">
                        <input type="text" class="form-control input-md" v-model="selectedScreen.sectionTitle" :disabled="selectedScreen.sectionType !== 'custom'"
                          placeholder="Enter page title" />
                      </div>
                    </div>
                    <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-0 pl-10">
                      <div class="section_heading">Page Icon</div>
                      <div class="form-group">
                        <div class="image-upload">
                          <label for="info_image">
                          <i class="fa fa-picture-o" aria-hidden="true" v-if="!selectedScreen.sectionIcon"></i>
                          <img :src="selectedScreen.sectionIcon" class="section_image" v-if="selectedScreen.sectionIcon" />
                        </label>
                          <!--<input id="file-input" type="file" />-->
                          <input type="button" class="file-input" id="info_image" data-toggle="modal" data-target="#iconModal" v-on:click="getIconLibrary(1, true)"
                            accept="image/png">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="section_heading">Page Content</div>
                    <quill-editor class="bg-white" @change="onEditorChange($event)" ref="myTextEditor" v-model="selectedScreen.sectionHtmlDetails" :options="editorOption">
                    </quill-editor>
                    <!--<textarea class="form-control" rows="4" cols="126" v-model="selectedScreen.sectionHtmlDetails"></textarea>-->

                    <div class="row pt-10">
                      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-2 text-left pl-0">
                        <button class="btn btn-link color_red" v-on:click="deleteInfoScreen(screen)" v-if="screen.id">Delete</button>
                      </div>
                      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-10 text-right p-0">
                        <button class="btn btn-link color_grey" v-on:click="cancelInfoScreen()">Cancel</button>
                        <button class="btn btn-success br-25 pl-30 pr-30 save_btn" v-on:click="saveInfoScreen(selectedScreen, index)">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>
          <div>
            <button class="btn btn_add_another br-25 mt-20" v-if="!collapse" v-on:click="addInfoScreen()" :disabled="addScreen">Add another screen</button>
          </div>
          <div class="row pt-20">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-6 p-0">
              <h3 class="header_title">Participant feedback</h3>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-6 p-0 mt-20 text-right">
              <label class="switch">
                <input type="checkbox" v-model="giveFeedback" v-on:change="changeFeedBackState(giveFeedback)">
                <div class="slider round"></div>
              </label>
            </div>
          </div>
          <div class="card read_only_screen bl_5px" :class="{inactive:!giveFeedback}" v-if="!editFeedbackMode">
            <div class="row">
              <div class="col-lg-11 col-md-11 col-sm-10 col-xs-8 p-0">
                <div class="screen_title">Give Us Your Feedback</div>
                <div class="pb-15">We would love to hear your feedback. Answer the questions belows to help us better this app.</div>
              </div>
              <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0 text-right">
                <button class="btn btn-default edit_btn" v-on:click="editFeedback()" :disabled="!giveFeedback">Edit</button>
              </div>
            </div>
          </div>
          <div v-if="giveFeedback && editFeedbackMode">
            <div class="card">
              <div class="row pt-10">
                <div class="col-lg-11 col-md-10 col-sm-9 col-xs-8 p-0">
                  <div class="section_heading">Page Title</div>
                  <div class="form-group">
                    <input type="text" class="form-control input-md" v-model="feedback.title" placeholder="Give Us Your Feedback" />
                  </div>
                </div>
                <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-0 pl-10">
                  <div class="section_heading">Page Icon</div>
                  <div class="form-group">
                    <div class="image-upload">
                      <label for="info_image">
                          <i v-if="!feedback.icon" class="fa fa-picture-o" aria-hidden="true"></i>
                          <img v-if="feedback.icon" :src="feedback.icon" class="section_image" />
                        </label>
                      <!--<input id="file-input" type="file" />-->
                      <input type="button" class="file-input" id="info_image" data-toggle="modal" data-target="#iconModal" v-on:click="getIconLibrary(1)">
                    </div>
                  </div>
                </div>
              </div>
              <div class="section_heading">Page Content</div>
              <textarea class="form-control" rows="4" cols="126" v-model="feedback.summary" placeholder="Enter content for this topic (eg. We love to hear feedback from our participants!)"></textarea>
              <div class="row text-right pt-20">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-2 text-left pl-0">
                  <button class="btn btn-link color_red" v-if="deleteFeedbackMode" v-on:click="deleteFeedback()">Delete</button>
                </div>
                <button class="btn btn-link pb-15 color_grey" v-on:click="cancelFeedBack()">Cancel</button>
                <button class="btn btn-success mb-10 br-25 pl-30 pr-30 save_btn" v-on:click="saveFeedBack()">Save</button>
              </div>
            </div>
          </div>
          <draggable v-model="feedbackQuestions" :options="{ disabled: draggable }" @start="drag=true" @end="drag=false" @change="onDragFeedbackQuestion()">
            <div v-for="(feedbackQues,index) in feedbackQuestions">
              <div class="row card bl_5px cursor_grab" v-if="question.index !== feedbackQues.index">
                <div class="col-lg-11 col-md-11 col-sm-10 col-xs-10 p-0">
                  <div class="fs-16 font_bold pb-10">Question {{index + 1}}</div>
                  {{feedbackQues.body}}
                  <div class="pt-30" :class="{ 'pl-20' : feedbackQues.direction.toLowerCase() === 'vertical' }" v-if="feedbackQues.type === 'numberScale'">
                    <vue-slider v-if="feedbackQues.direction.toLowerCase() === 'horizontal'" ref="slider" :value="feedbackQues.minValue" :piecewise="true" direction="horizontal"
                      class="horizontal-vue-slider pl-20 pt-35" :min="feedbackQues.minValue" :max="feedbackQues.maxValue" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" 
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                    <vue-slider v-if="feedbackQues.direction.toLowerCase() === 'vertical'" ref="slider" :value="feedbackQues.minValue" :piecewise="true" direction="vertical"
                      class="vertical-vue-slider pl-20" width="2" :min="feedbackQues.minValue" :max="feedbackQues.maxValue" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" 
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>                          
                  </div>
                  <div class="pt-30" :class="{ 'pl-20' : feedbackQues.direction.toLowerCase() === 'vertical' }" v-if="feedbackQues.type === 'customScale'">
                    <vue-slider v-if="feedbackQues.direction.toLowerCase() === 'horizontal'" ref="slider" :value="1" :piecewise="true" direction="horizontal"
                      class="horizontal-vue-slider pl-20 pt-35" :min="parseInt(feedbackQues.labels[0])" :max="feedbackQues.labels[feedbackQues.labels.length]" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" :data="feedbackQues.labels"
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                    <vue-slider v-if="feedbackQues.direction.toLowerCase() === 'vertical'" ref="slider" :value="1" :piecewise="true" direction="vertical"
                      class="vertical-vue-slider pl-20" width="2" :min="parseInt(feedbackQues.labels[0])" :max="feedbackQues.labels[feedbackQues.labels.length]" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" :data="feedbackQues.labels"
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                  </div>
                  <div class="pt-10" v-if="feedbackQues.type === 'text'">
                    <div class="">
                      <input type="text" class="input-text readonly" placeholder="" readonly>
                    </div>
                  </div>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 p-0 text-right">
                  <button class="btn btn-default edit_btn" v-on:click="editFeedbackQuestion(feedbackQues)">Edit</button>
                </div>
              </div>
              <div class="card" v-if="giveFeedback && addFeedbackQuestion && question.index === feedbackQues.index">
                <div class="row">
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 p-0">
                    <select class="form-control type_select" v-model="question.type" v-on:change="questionType(question)">
                    <option value="text">Text response</option>
                    <option value="numberScale">Number Scale</option>
                    <option value="customScale">Custom Scale</option>
                  </select>
                  </div>
                </div>
                <div v-if="question.type === 'numberScale'">
                  <div class="row pt-20">
                    <div class="card_type">
                      <div>
                        <input type="checkbox" v-model="direction">
                        <span class="pl-10"> Vertical scale (scale is horizonal by default)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="pt-20 pb-10 clearfix">
                    <div class="fs-16 font_bold pb-10">Question {{index + 1}}</div>
                    <div><input type="text" class="form-control" placeholder="Enter your question (eg. How are you enjoying your app experience on a scale of 1-10?) "
                        v-model="question.body"></div>
                  </div>
                  <div class="pt-10 pb-10 clearfix">
                    <div class="fs-16 font_bold pb-10">Scale labels</div>
                    <div class="row">
                      <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="!direction">Left</div>
                      <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="direction">Bottom</div>
                      <div class="col-lg-11 col-md-11 col-sm-10 col-xs-8 p-0">
                        <input type="number" class="form-control mb-10" v-model="question.minValue" min="0" :max="question.defaultValue-1">
                      </div>
                    </div>
                    <!--<div>Center<input type="number" class="form-control mb-10" placeholder="Enter value (optional)" v-model="question.defaultValue"
                        :min="question.minValue+1" :max="question.maxValue-1"></div>-->
                    <div class="row">
                      <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="!direction">Right</div>
                      <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="direction">Top</div>
                      <div class="col-lg-11 col-md-11 col-sm-10 col-xs-8 p-0">
                        <input type="number" class="form-control mb-10" v-model="question.maxValue" :min="question.defaultValue+1 || question.minValue+1">
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0"></div>
                      <div class="col-lg-11 col-md-11 col-sm-10 col-xs-8 p-0">
                        <input type="checkbox" v-model="question.middleValue">
                        <span class="pl-10"> Show Middle Value
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pt-10 pb-10 clearfix" v-if="question.type === 'customScale'">
                  <div class="row pt-20">
                    <div class="card_type">
                      <div>
                        <input type="checkbox" v-model="direction">
                        <span class="pl-10"> Vertical scale (scale is horizonal by default)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="pt-20 pb-10 clearfix">
                    <div class="fs-16 font_bold pb-10">Question {{index + 1}}</div>
                    <div><input type="text" class="form-control" placeholder="Enter your question (eg. How are you enjoying your app experience on a scale of 1-10?) "
                        v-model="question.body"></div>
                  </div>
                  <div class="fs-16 font_bold pb-10">Scale labels</div>
                  <div class="mt-10 mb-10">
                    <span>Number of Intervals</span>
                    <span class="display-inline-block">
                    <select class="form-control ml-10" v-model="question.intervals" v-on:change="changeNumerOfIntervals(question.intervals)">
                      <option v-for="n in 12" :value="n+1">{{n+1}}</option>
                    </select>
                  </span>
                  </div>
                  <div v-if="question.intervals > 0">
                    <div class="row form-group" v-for="(value,key) in question.labels">
                      <div v-if="key === 0">
                        <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="!direction">Left</div>
                        <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="direction">Bottom</div>
                        <div class="col-lg-11 p-0">
                          <input type="text" class="form-control input-style" placeholder="Enter value" v-model="question.labels[key]" maxlength="16">
                        </div>
                      </div>
                      <div v-else-if="key === question.labels.length - 1">
                        <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="!direction">Right</div>
                        <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-0" v-if="direction">Top</div>
                        <div class="col-lg-11 p-0">
                          <input type="text" class="form-control input-style" placeholder="Enter value" v-model="question.labels[key]" maxlength="16">
                        </div>
                      </div>
                      <div v-if="key !== 0 && key !== question.labels.length-1">
                        <div class="col-lg-1"></div>
                        <div class="col-lg-11 p-0">
                          <input type="text" class="form-control input-style" placeholder="Enter value" v-model="question.labels[key]" maxlength="16">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="question.type === 'text'">
                  <div class="row pt-20">
                    <div class="card_type">
                      <div>
                        <input type="checkbox" v-model="textLimit">
                        <span class="pl-10">Character limit</span>
                        <span class="display-inline-block">
                        <input type="number" class="form-control limit-style ml-10" min="1" placeholder="200" v-model="question.limit" :disabled="!textLimit">
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="pt-10 pb-10 clearfix">
                    <div class="fs-16 font_bold pb-10">Question {{index + 1}}</div>
                    <input type="text" class="form-control" placeholder="Enter your question (eg. What would you improve about the app?)" v-model="question.body">
                    <p class="pt-5 color_e4940f fs-12">Please be adviced, a free text response does not restrict a user on what they can or cannot write.</p>
                  </div>
                </div>
                <!--<a class="color_blue" v-on:click="addQuestion()">Add another Question</a>-->
                <div class="row text-right pt-20">
                  <span class="color_red pr-20 cursor_pointer" v-on:click="deleteFeedBackQuestion()">Delete Question</span>
                  <button class="btn btn-success mb-10 br-25 pl-30 pr-30 save_btn" v-on:click="saveFeedBackQuestion()">Save</button>
                </div>
              </div>
            </div>
          </draggable>
          <div id="iconModal" class="modal fade" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
              <!-- Modal content-->
              <div class="modal-content pb-30 pr-30 pt-20 pl-30">
                <div class="row">
                  <div class="fs-28 modal_header_color fw-200">Icon Library</div>
                  <a class="cancelImage cursor_pointer" v-on:click="closeModal()"><i class="fa fa-times" aria-hidden="true"></i></a>
                </div>
                <p>Choose from any of these icons.</p>
                <div class="row">
                  <div class="row pt-20">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0" v-for="(page, pageIndex) in iconLibrary" v-on:click="selectIcon(page)">
                      <div class="library_img_bg" :class="{ selected_icon_logo_image: selectedIcon.name === page.name}">
                        <img class="img-responsive icon" :src="page.preSignedURL">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row text-center pt-20" v-if="totalPages > 1">
                  <span class="paginate" v-on:click="getIconLibrary(currentPage - 1)"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                  <span class="paginate" :class="{active: currentPage === pageIndex + 1 }" v-for="(page, pageIndex) in totalPages" v-on:click="getIconLibrary(pageIndex + 1)">{{pageIndex + 1}}</span>
                  <span class="paginate" v-on:click="getIconLibrary(currentPage + 1)"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
                </div>
                <div class="row text-center pt-20 pb-10">
                  <button class="btn btn-md add_btn" v-on:click="addImage()" :disabled="!selectedIcon || !selectedIcon.name">Add</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="giveFeedback">
            <button class="btn btn_add_another br-25 mt-20" v-on:click="addQuestion()" :disabled="addFeedbackQuestion">Add feedback question</button>
          </div>
          <div class="pt-20">
            <span class="back_link" v-on:click="goBack()"><i class="fa fa-chevron-left" aria-hidden="true"></i> Back</span>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row" v-if="isStudySummary">
              <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
              <b-btn class="btn br-25 disable-btn p-0 pt-5 mr-10" :to="{ name: 'study-summary', params: { studyId: studyId } }">Back to study summary</b-btn>
              <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
            </div>
            <div class="row" v-if="!isStudySummary">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
            </div>
          </div>
        </div>
        <CancelModal
          ref="cancelConfirmation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import toastr from 'toastr';
import VueSlider from 'vue-slider-component';
import draggable from 'vuedraggable';
import swal from 'sweetalert2';
import studyFeatureHeader from '../common/study-features-header';
import CancelModal from './cancel-modify-modal';
export default {
  name: 'engagement-content',
  data() {
    return {
      studyId: null,
      collapse: false,
      totalPages: null,
      currentPage: null,
      deleteFeedbackMode: true,
      iconLibrary: [],
      selectedIcon: '',
      editorOption: {
        placeholder: 'Enter content for your page topic',
        modules: {
          toolbar: [
             ['bold', 'italic', 'underline'],
             // [{ list: 'ordered' }, { list: 'bullet' }],
             // [{ size: ['small', false, 'large', 'huge'] }],
             // [{ header: [1, 2, 3, 4, 5, 6, false] }],
             // [{ color: [] }, { background: [] }],
             // [{ font: [] }],
             // [{ align: [] }],
             ['image', 'video'],
             // [{ font: [] }],                                                                                                                  -            // [{ align: [] }],                                                                                                                 -            ['image', 'video'],                                                                                                                 -            // ['clean'],
           ],
        },
      },
      sectionTypes: [],
      addScreen: false,
      selectedScreen: {
        index: 1,
        sectionTitle: '',
        type: 'overview',
        sectionType: 'default',
        sectionIcon: '',
        sectionHtmlDetails: '',
      },
      allScreens: [],
      screenIndex: null,
      giveFeedback: false,
      editFeedbackMode: false,
      feedback: {},
      feedbackData: {
        title: '',
        icon: '',
        summary: '',
      },
      addFeedbackQuestion: false,
      direction: false,
      textLimit: false,
      feedbackQuestions: [],
      question: {},
      textQuestion: {
        type: 'text',
        body: '',
        limit: '',
        isSkippable: false,
        index: 0,
      },
      numberScale: {
        type: 'numberScale',
        isSkippable: false,
        direction: 'Horizontal',
        body: '',
        minValue: 0,
        maxValue: 10,
        middleValue: true,
        index: 0,
      },
      customScale: {
        type: 'customScale',
        isSkippable: false,
        direction: 'Horizontal',
        body: '',
        intervals: 5,
        labels: [],
        index: 0,
      },
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
      imageTypeError: true,
      isStudySummary: JSON.parse(window.localStorage.getItem('thread-studySummary')),
      appLangaScript: "window.initApplanga = function() {        if(typeof window.ApplangaNative !== 'undefined') {  window.ApplangaNative.loadScript();        } else { setTimeout(window.initApplanga, 180); }    }; window.initApplanga();",
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById('feature_menu_scroll');
      scrollableSection.scrollLeft += 450;
    }, 3000);
    this.getLearnMoreDetails();
    this.getOnboardingScreens(this.studyId);
  },
  methods: {
    onEditorChange(event) {
      var elem= document.createElement("div");
      elem.innerHTML = event.html;
      var images = elem.getElementsByTagName("img");
      this.imageTypeError = false;
      for(var i=0; i < images.length; i++){
        const [imageType, baseUrl] = images[i].src.split(';');
        const [str, type] = imageType.split('/');
        if(type.toLowerCase() != 'png') {
          this.imageTypeError = true;
          break;
        }
      }
    },
    onDragInfoScreen() {
      this.allScreens.forEach((item, index) => {
        //eslint-disable-line
        this.allScreens[index].index = index + 1;
      });
      this.$api.updatelearnMoreSectionsOrderFact(this.studyId, this.allScreens).then(
        () => {},
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while saving the data',
          );
        },
      );
    },
    onDragFeedbackQuestion() {
      this.feedbackQuestions.forEach((item, index) => {
        //eslint-disable-line
        this.feedbackQuestions[index].index = index + 1;
      });
      this.$api.updateFeedbackOrderFact(this.studyId, this.feedbackQuestions).then(
        response => {
          // when we swap scale questions its design is distorted
          // so refreshing the scale to redesign
          response.body.forEach((question, index) => {
            this.$nextTick(() => this.$refs.slider[index].refresh());
          });
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while saving the data',
          );
        },
      );
    },
    getIndexForNewScreen(array) {
      const highestValObj = _.maxBy(array, o => o.index);
      return highestValObj && highestValObj.index ? highestValObj.index + 1 : 1;
    },
    changeFeedBackState(status) {
      if (!status && this.deleteFeedbackMode) {
        swal({
          title:
            'When you toggle off participant feedback, the feedback will be deleted. Are you sure you want to delete?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#b8c7ce',
          cancelButtonColor: '#f16559',
          confirmButtonText: 'Cancel',
          cancelButtonText: 'Delete',
        }).then(({ dismiss }) => {
          if (dismiss === 'cancel') {
            this.deleteCompleteFeedback();
          } else {
            this.giveFeedback = true;
          }
        });
      } else {
        this.giveFeedback = status;
      }
    },
    changeSectionType(type) {
      if (type !== 'default' && type !== 'custom') {
        this.sectionTypes.forEach(item => {
          if (type === item.title) {
            this.selectedScreen.sectionTitle = item.title;
            let content = item.content.replace(this.appLangaScript,'');
            this.selectedScreen.sectionHtmlDetails = content;
            this.$forceUpdate();
          }
        });
      } else {
        this.$forceUpdate();
      }
    },
    getOnboardingScreens(studyId) {
      this.$api.getOnboardingFact(studyId).then(
        response => {
          this.sectionTypes = response.body.screens;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the information screens',
          ); // eslint-disable-line
        },
      );
    },
    deleteCompleteFeedback() {
      this.$api.deleteFeedbackFact(this.studyId).then(
        () => {
          this.giveFeedback = false;
          this.feedback = {};
          this.feedbackData = {};
          this.editFeedbackMode = false;
          this.feedbackQuestions = [];
          this.deleteFeedbackMode = false;
          toastr.success('Feedback deleted successfully');
        },
        error => {
          toastr.error(error.body ? error.body.message : 'Error while adding the feedback');
        },
      );
    },
    deleteFeedback() {
      swal({
        title: 'Are you sure you want to delete?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.deleteCompleteFeedback();
        }
      });
    },
    addImage() {
      if (this.giveFeedback && this.editFeedbackMode) {
        this.feedback.icon = this.selectedIcon.preSignedURL;
      }
      if (this.addScreen) {
        this.selectedScreen.sectionIcon = this.selectedIcon.preSignedURL;
      }
      window.$('#iconModal').modal('hide');
      this.$forceUpdate();
    },
    closeModal() {
      window.$('#iconModal').modal('hide');
    },
    selectIcon(page) {
      this.selectedIcon = {};
      this.selectedIcon = page;
    },
    getIconLibrary(pageNumber) {
      this.currentPage = pageNumber;
      if (pageNumber <= this.totalPages || pageNumber > 0) {
        if (this.addScreen) {
          this.$api.getInfoIconsLibrary(this.studyId, pageNumber).then(
            response => {
              this.iconLibrary = response.body.icons;
              this.totalPages = response.body.totalPages;
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while getting the information screens',
              ); // eslint-disable-line
            },
          );
        } else if (this.giveFeedback && this.editFeedbackMode) {
          this.$api.getFeedbackIconsLibrary(this.studyId, pageNumber).then(
            response => {
              this.iconLibrary = response.body.icons;
              this.totalPages = response.body.totalPages;
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while getting the information screens',
              ); // eslint-disable-line
            },
          );
        }
      }
    },
    goBack() {
      window.history.back();
    },
    getLearnMoreDetails() {
      this.$api.getLearnMoreDetailsFact(this.studyId).then(
        response => {
          this.allScreens = response.body.sections;
          this.selectedScreen = {};
          if (response.body.feedback) {
            this.feedbackData = response.body.feedback;
            if (response.body.feedback.quiz) {
              this.feedbackQuestions = response.body.feedback.quiz;
            }
            this.giveFeedback = true;
          } else {
            this.deleteFeedbackMode = false;
          }
        },
        error => {
          const err = error.body && error.body.message
            ? error.body.message
            : 'Error while getting the information screens';
          toastr.error(err);
        },
      );
    },
    onInfoImageSelection() {
      const input = window.document.getElementById('info_image');
      this.selectedScreen.sectionIcon = input.files[0]; // eslint-disable-line
    },
    showPreview(activity) {
      if (this.selectedActivity.key === activity.key) {
        this.selectedActivity = { key: null };
      } else {
        this.selectedActivity = activity;
      }
    },
    editInformation(screen) {
      this.selectedScreen = _.cloneDeep(screen);
      var content = this.selectedScreen.sectionHtmlDetails;
      content = content.replace(this.appLangaScript,'');
      this.selectedScreen.sectionHtmlDetails = content;
      this.addScreen = true;
    },
    addInfoScreen() {
      this.addScreen = true;
      this.allScreens.push(this.selectedScreen);
    },
    saveInfoScreen(originScreen) {
      const screen = { ...originScreen };
      if (
        !screen.sectionTitle
        || !screen.sectionType
        || !screen.sectionIcon
        || !screen.sectionHtmlDetails
      ) {
        // eslint-disable-line
        toastr.error('Please fill all the fields');
      } else if (!screen.id) {
        // eslint-disable-line
        // Section with out id === new section
        this.onEditorChange({html: screen.sectionHtmlDetails})
        if(this.imageTypeError) {
          toastr.error('Uploaded image format not supported. Please upload a PNG file.');
          return;
        }
        const fd = new FormData();
        fd.append('index', this.getIndexForNewScreen(this.allScreens));
        fd.append('sectionTitle', screen.sectionTitle);
        fd.append('type', 'overview');
        fd.append('sectionType', screen.sectionType);
        fd.append('sectionIcon', this.selectedIcon.name);
        if (screen.sectionHtmlDetails && screen.sectionHtmlDetails.indexOf('<html><head>') < 0) {
          screen.sectionHtmlDetails = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
            screen.sectionHtmlDetails
          }</body></html>`;
        }
        fd.append('sectionHtmlDetails', screen.sectionHtmlDetails);

        this.$api.addInfoScreenFact(this.studyId, fd).then(
          response => {
            toastr.success('Information screen added successfully');
            this.allScreens.splice(this.allScreens.length - 1, 1);
            this.allScreens.push(response.data);
            this.selectedScreen = {};
            this.selectedIcon = {};
            this.addScreen = false;
          },
          error => {
            const err = error.body && error.body.message
              ? error.body.message
              : 'Error while adding the information screen';
            toastr.error(err); // eslint-disable-line
          },
        );
      } else if (screen.id) {
        // Section with id === existing section 
          this.onEditorChange({html: screen.sectionHtmlDetails})
        if(this.imageTypeError) {
          toastr.error('Uploaded image format not supported. Please upload a PNG file.');
          return;
        }
        const fd = new FormData();
        fd.append('index', screen.index);
        fd.append('sectionTitle', screen.sectionTitle);
        fd.append('type', 'overview');
        fd.append('sectionType', screen.sectionType);
        if (this.selectedIcon.name) {
          fd.append('sectionIcon', this.selectedIcon.name);
        } else {
          fd.append('sectionIcon', '');
        }
        if (screen.sectionHtmlDetails && screen.sectionHtmlDetails.indexOf('<html><head>') < 0) {
          screen.sectionHtmlDetails = `<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="editor.css"></head><body class="ql-editor">${
            screen.sectionHtmlDetails
          }</body></html>`;
        }
        fd.append('sectionHtmlDetails', screen.sectionHtmlDetails);

        this.$api.updateInfoScreenFact(this.studyId, screen.id, fd).then(
          response => {
            toastr.success('Information screen updated successfully');
            const sectionIndex = _.findIndex(this.allScreens, ['id', response.data.id]);
            this.allScreens.splice(sectionIndex, 1, response.data);
            this.selectedScreen = {};
            this.selectedIcon = {};
            this.addScreen = false;
          },
          error => {
            this.selectedIcon = {};
            const err = error.body
              ? error.body.message
              : 'Error while updating the information screen';
            toastr.error(err);
          },
        );
      }
    },
    cancelInfoScreen() {
      if (!this.selectedScreen.index) {
        this.allScreens.splice(this.allScreens.length - 1, 1);
      }
      this.selectedScreen = {};
      this.selectedIcon = {};
      this.addScreen = false;
    },
    deleteInfoScreen(screen) {
      swal({
        title: 'Are you sure you want to delete?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$api.deleteInfoScreenFact(this.studyId, screen.id).then(
            () => {
              toastr.success('Information screen deleted successfully');
              const sectionIndex = _.findIndex(this.allScreens, ['id', screen.id]);
              this.allScreens.splice(sectionIndex, 1);
              this.selectedScreen = {};
              this.selectedIcon = {};
              this.addScreen = false;
            },
            error => {
              const err = error.body
                ? error.body.message
                : 'Error while updating the information screen';
              toastr.error(err);
            },
          );
        }
      });
    },
    addQuestion() {
      this.addFeedbackQuestion = true;
      this.question = this.numberScale;
      if (this.feedbackQuestions.length >= 0) {
        this.question.index = this.getIndexForNewScreen(this.feedbackQuestions);
      }
      this.feedbackQuestions.push(this.question);
    },
    questionType(question) {
      if (question.type === 'text') {
        this.question = this.textQuestion;
        this.question.type = 'text';
      } else if (question.type === 'numberScale') {
        this.question = this.numberScale;
        this.question.type = 'numberScale';
      } else if (question.type === 'customScale') {
        this.question = this.customScale;
        this.question.type = 'customScale';
        if (!this.question.labels || this.question.labels.length === 0) {
          this.changeNumerOfIntervals(this.question.intervals);
        }
      }
      this.question.index = question.index;
      if (!question.identifier) {
        this.feedbackQuestions.splice(this.feedbackQuestions.length - 1, 1, this.question); //eslint-disable-line
      } else {
        const quesIndex = _.findIndex(this.feedbackQuestions, ['identifier', question.identifier]);
        this.question.identifier = question.identifier;
        this.feedbackQuestions.splice(quesIndex, 1, this.question);
      }
    },
    removeEmptyFeedBack() {
      const tempScreens = _.cloneDeep(this.feedbackQuestions);
      _.forEach(tempScreens, (s, index) => {
        if (!s.identifier) {
          this.feedbackQuestions.splice(index, 1);
        }
      });
    },
    changeNumerOfIntervals(intervals) {
      this.question.labels = [];
      for (let i = 0; i < intervals; i++) {
        //eslint-disable-line
        this.question.labels.push(null);
      }
    },
    editFeedback() {
      this.editFeedbackMode = true;
      this.feedback = _.cloneDeep(this.feedbackData);
    },
    saveFeedBack() {
      if (this.feedback.title && this.feedback.icon && this.feedback.summary) {
        // eslint-disable-line
        const fd = new FormData();
        fd.append('title', this.feedback.title);
        if (this.selectedIcon.name) {
          fd.append('icon', this.selectedIcon.name);
        } else {
          fd.append('icon', '');
        }
        fd.append('summary', this.feedback.summary);
        this.$api.addFeedbackFact(this.studyId, fd).then(
          response => {
            this.editFeedbackMode = false;
            this.feedbackData = response.body;
            this.selectedIcon = {};
            this.deleteFeedbackMode = true;
            toastr.success('Feedback added successfully');
          },
          error => {
            toastr.error(error.body ? error.body.message : 'Error while adding the feedback');
          },
        );
      } else {
        toastr.error('Please fill all the fields');
      }
    },
    cancelFeedBack() {
      swal({
        title:
          'You have not saved your progress. Are you sure you want to leave? Your changes will not be saved. ',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.feedback = {};
          this.selectedIcon = {};
          this.editFeedbackMode = false;
        }
      });
    },
    checkQuestionValidity(question) {
      switch (question.type) {
        case 'numberScale':
          return (
            question.body
            && question.minValue >= 1
            && question.maxValue >= 1
            && question.maxValue <= 13
            && question.minValue < question.maxValue
          ); // eslint-disable-line
        // break;
        case 'customScale': {
          const quesLength = _.compact(question.labels).length || 0;
          return question.body && question.intervals >= 1 && quesLength == question.intervals; // eslint-disable-line
        }
        case 'text':
          if (this.textLimit) {
            question.limit = Number(question.limit); //eslint-disable-line
            return question.body && question.limit && question.limit % 1 === 0;
          }
          return question.body; // eslint-disable-line
        // break;
        default:
          return false;
      }
    },
    saveFeedBackQuestion() {
      if (this.direction) {
        this.question.direction = 'Vertical';
      } else {
        this.question.direction = 'Horizontal';
      }
      const validQuestion = this.checkQuestionValidity(this.question);
      if (validQuestion) {
        if (!this.question.identifier) {
          if (!this.textLimit) {
             this.question.limit = '';
           }
          if (this.question.limit >= 4097) {
            toastr.error('Character limit cannot exceed 4096');
          } else {
             this.$api.addFeedbackQuizFact(this.studyId, this.question).then(
            response => {
              const quesIndex = _.findIndex(this.feedbackQuestions, [
                'identifier',
                response.body.identifier,
              ]);
              this.feedbackQuestions.splice(quesIndex, 1, response.body);
              this.emptyQuestionType();
              this.addFeedbackQuestion = false;
              this.direction = false;
              toastr.success('Feedback question added successfully');
            },
            error => {
              toastr.error(error.body ? error.body.message : 'Error while adding the feedback');
            },
           );
          }          
        } else if (this.question.identifier) {
          if (!this.textLimit) {
             this.question.limit = '';
          }
          if (this.question.limit >= 4097) {
            toastr.error('Character limit cannot exceed 4096');
          } else {
            this.$api.updateFeedbackQuizFact(this.studyId, this.question.identifier, this.question)
            .then(
              response => {
                const quesIndex = _.findIndex(this.feedbackQuestions, [
                  'identifier',
                  response.body.identifier,
                ]);
                this.feedbackQuestions.splice(quesIndex, 1, response.body);
                this.emptyQuestionType();
                this.addFeedbackQuestion = false;
                this.direction = false;
                toastr.success('Feedback question updated successfully');
              },
              error => {
                toastr.error(error.body ? error.body.message : 'Error while adding the feedback');
              },
            );
          }          
        }
      } else {
        toastr.error('Please fill all the fields');
      }
    },
    editFeedbackQuestion(feedbackQues) {
      this.removeEmptyFeedBack();
      this.question = _.cloneDeep(feedbackQues);
      if (this.question.type === 'text' && this.question.limit) {
        this.textLimit = true;
      }
      if (this.question.direction === 'Vertical') {
        this.direction = true;
      } else {
        this.direction = false;
      }
      this.addFeedbackQuestion = true;
    },
    emptyQuestionType() {
      this.question = {};
      this.textLimit = false;
      this.textQuestion = {
        type: 'text',
        body: '',
        limit: '',
        isSkippable: false,
        index: 0,
      };
      this.numberScale = {
        type: 'numberScale',
        isSkippable: false,
        direction: 'Horizontal',
        body: '',
        minValue: 0,
        maxValue: 10,
        middleValue: true,
        index: 0,
      };
      this.customScale = {
        type: 'customScale',
        isSkippable: false,
        direction: 'Horizontal',
        body: '',
        intervals: 5,
        labels: [],
        index: 0,
      };
    },
    deleteFeedBackQuestion() {
      if (!this.question.identifier) {
        const quesIndex = _.findIndex(this.feedbackQuestions, [
          'identifier',
          this.question.identifier,
        ]);
        this.feedbackQuestions.splice(quesIndex, 1);
        this.emptyQuestionType();
        this.addFeedbackQuestion = false;
      } else {
        swal({
          title: 'Are you sure you want to delete?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#b8c7ce',
          cancelButtonColor: '#f16559',
          confirmButtonText: 'Cancel',
          cancelButtonText: 'Delete',
        }).then(({ dismiss }) => {
          if (dismiss === 'cancel') {
            this.$api.deleteFeedbackQuizFact(this.studyId, this.question.identifier).then(
              () => {
                const quesIndex = _.findIndex(this.feedbackQuestions, [
                  'identifier',
                  this.question.identifier,
                ]);
                this.feedbackQuestions.splice(quesIndex, 1);
                this.emptyQuestionType();
                this.addFeedbackQuestion = false;
                toastr.success('Feedback question deleted successfully');
              },
              error => {
                toastr.error(error.body ? error.body.message : 'Error while adding the feedback');
              },
            );
          }
        });
      }
    },
    nextClick() {
      if (!this.addScreen && this.allScreens.length > 0) {
        // eslint-disable-line
        const selectedFeatures = this.$store.getters.getSelectedFeatures;
        const featureIndex = _.findIndex(selectedFeatures, ['route', this.$route.name]);
        if (featureIndex === selectedFeatures.length - 1) {
          if (this.giveFeedback && this.editFeedbackMode) {
            toastr.error('Please save your feedback before you continue');
          } else if (this.addFeedbackQuestion) {
            toastr.error('Please save your feedback question before you continue');
          } else {
            this.$router.push({ name: 'features-library-final' });
          }
        } else {
          this.$router.push({
            name: selectedFeatures[featureIndex + 1].route,
            params: { studyId: this.studyId },
          }); // eslint-disable-line
        }
      } else if (this.addScreen) {
        toastr.error('Please save your information screen before you continue');
      } else {
        toastr.error('Please add atleast one informational screen');
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, ['route', this.$route.name]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: 'features-library-final' });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId },
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    },
  },
  components: {
    studyFeatureHeader,
    CancelModal,
    vueSlider: VueSlider,
    draggable,
  },
  computed: {
    draggable() {
      return this.addScreen || this.addFeedbackQuestion;
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  margin: 20px 0 10px;
}

.h4,
h4 {
  font-size: 18px;
  margin: 10px 0;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: '';
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2 {
    flex: none;
  }
}

@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.library_img_bg {
  display: -webkit-inline-box;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  max-width: 200px;
  max-height: 80px;
  min-height: 70px;
  width: 98%;
  padding: 10px;
  .icon {
    max-width: 50px;
    max-height: 50px;
    margin: auto;
  }
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
  img {
    -webkit-filter: brightness(0) invert(1);
    filter: brightness(0) invert(1);
  }
}
.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
  /*height: 100px;*/
  padding: 15px;
  margin-top: 10px;
}
.read_only_screen {
  p {
    img {
      max-width: 120px !important;
    }
  }
  padding: 15px 15px 5px 15px !important;
}

.no_data_card {
  padding: 10px 15px !important;
}
.card_type {
  border-radius: 4px;
  background-color: #eaf0f4;
  border: solid 1px #e2e7ea;
  padding: 10px;
  color: #666669;
}
.paginate {
  color: grey;
  font-size: 14px;
  background-color: white;
  margin: 0px 8px 0px 0px;
  padding: 8px 5px 8px 5px;
  display: inline-block;
  cursor: pointer;
}
.active {
  color: #4c8ce4;
  font-size: 14px;
  font-weight: bolder;
}
.section_image {
  width: 100%;
  height: 100%;
  max-width: 28px;
  max-height: 35px;
  padding-top: 2px;
}
.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
}
.bl_5px {
  border-left: 5px solid #d3dfe4;
}
.btn_add_another {
  font-size: 12px;
  padding: 8px 17px 8px 17px;
  color: #f16559;
  border: solid 1px #f16559;
  background-color: transparent;
}
.screen_title {
  color: #1f95f2;
  font-size: 14px;
  font-weight: bold;
}
.edit_btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}
.add_btn {
  color: white;
  border-radius: 100px;
  background-color: #4c8ce4;
  padding: 10px 150px 10px 150px;
}
.modal_header_color {
  color: #1f95f2;
}
.limit-style {
  width: 70px;
}
.disabled_input {
  background-color: #eee;
  opacity: 1 !important;
  height: 100%;
}
.inactive {
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
}
/* Hide default HTML checkbox */
.switch input {
  display: none;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #ccc;
}
.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 1px;
  background-color: #ccc;
}
input:checked + .slider {
  border: 2px solid #48bf7a;
}
input:checked + .slider:before {
  content: '';
  background-color: #48bf7a;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  /*content: '✓';*/
  position: absolute;
  color: #2ecc71;
  text-align: center;
  font-size: 20px;
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
.image-upload {
  width: 100%;
  height: 34px;
  text-align: center;
  padding-top: 0px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 2px;
  label {
    width: 100%;
    height: 100%;
  }
}

.image-upload > input {
  display: none;
}

.image-upload .fa {
  font-size: 22px;
  color: #888;
  padding-top: 5px;
  width: 100%;
  cursor: pointer;
  max-width: 100%;
  height: 32px;
}
.readonly {
  background: #f7f7f7;
}
.input-text {
  width: 100%;
  border-radius: 2px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
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
</style>
