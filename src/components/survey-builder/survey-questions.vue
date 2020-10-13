
<template>
  <div class="row">
    <div :class="showPreview==true ? 'col-lg-9 survey_instruction_question' : 'col-lg-12 suvey_question_card'">
      <div class="mt-100 container-style mb-100">
        <studyFeatureHeader></studyFeatureHeader>
        <div class="p-20">
          <div class="row">
            <div
              v-if="surveyType=='EPRO'"
              class="fw-500 fs-24 pb-10 col-lg-8"
            >Create ePRO instructions and questions</div>
            <div
              v-if="surveyType==undefined"
              class="fw-500 fs-24 pb-10 col-lg-8"
            >Create survey instructions and questions</div>
            <!------Preview Button START------>
            <div class="col-lg-4 p-0" v-if="surveyType==undefined">
              <div v-if="showPreview===false" class="float-right mb-18">
                <button
                  type="button"
                  class="button2 btn btn-md btn-block br-25 show-btn-preview"
                  v-on:click="togglePreview()"
                >
                  <span class="show-circle">
                    <img src="static/img/surveyPreview/show.png" class="mb-4"/>
                  </span>
                  <span class="show-txt ml-5">Show Preview</span>
                </button>
              </div>
              <div v-if="showPreview===true" class="float-right mb-18">
                <button
                  type="button"
                  v-on:click="togglePreview()"
                  class="button2 btn btn-md btn-block br-25 btn-preview"
                >
                  <span class="hide-circle">
                    <img src="static/img/surveyPreview/hide.png" class="mb-4"/>
                  </span>
                  <span
                    class="hide-txt ml-5"
                    style="color: #ffffff;"
                  >Hide Preview</span>
                </button>
              </div>
            </div>
          </div>
          <div class="row">
            <!------Preview Button END------>
            <readOnlyQuestions
              class
              :questions="questionAnswers"
              :surveyType="surveyType"
              :studyData="studyData"
              @editedEvent="questionIsEdited"
            ></readOnlyQuestions>
            <div v-if="addQuestion && !isQuestionInEditMode">
              <addEditQuestion
                :options="sampleQuestion"
                :surveyType="surveyType"
                :studyData="studyData"
              ></addEditQuestion>
            </div>
            <!--Phone frame design ---->
            <br />
            <br />
          </div>
          <div class="row pt-10" v-if="questionAnswers.length > 0">
            <div class="col-lg-2 col-md-2 col-sm-3 p-0">
              <button
                type="button"
                class="btn btn-md btn-block add_another_btn br-25 btn-new"
                v-on:click="addNewQuestion()"
              >
                <span class="circle">+</span>
                <span class="txt">Add screen</span>
              </button>
            </div>
          </div>
          <div class="pt-20">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-caret-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
              <button class="btn nextBtn br-25" v-on:click="goToNextPage()">Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPreview===true" class="col-lg-3 pl-3 container-stylee float:right">
      <nav
        class="navbar navbar-expand-sm"
        style="margin-top:65px;padding:20px;border-bottom: 1px solid #eee;display:block;"
      >
        <div class="text-center">
          <div class="btn-group m-b-10 phoneTabletMenu">
            <button
              class="btn btn-default dropdown-toggle phoneBar"
              type="button"
              id="type"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              v-if="showTablet==false"
            >
              <!-- <span class="fa fa-info-circle help_icon  mr-5" style="color:#989898" id="popover-target-1">
              </span>-->
              <img
                class="mr-5"
                id="popover-target-1"
                src="static/img/surveyPreview/previewtoltip.png"
              />
              <b-popover target="popover-target-1" triggers="hover" placement="left">
                <b>Show preview</b> displays all the saved survey content you have made. Navigation at the bottom of the screen enables you to quicky go to certain pages. And options at the top of this section provides a way to switch the preview device, export options for content and record a click-though session.
              </b-popover>Phone
            </button>
            <button
              class="btn btn-default dropdown-toggle phoneBar"
              type="button"
              id="type"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              v-if="showTablet"
            >
              <img
                class="mr-5"
                id="popover-target-1"
                src="static/img/surveyPreview/previewtoltip.png"
              />
              <b-popover target="popover-target-1" triggers="hover" placement="left">
                <b>Show preview</b> displays all the saved survey content you have made. Navigation at the bottom of the screen enables you to quicky go to certain pages. And options at the top of this section provides a way to switch the preview device, export options for content and record a click-though session.
              </b-popover>Tablet
            </button>
            <div class="dropdown-menu phone-tablet-menu" aria-labelledby="dropdownMenuButton">
              <a
                class="dropdown-item"
                vakue
                id="phone-selected"
                v-on:click="toggleTablet('phone')"
                selected
              >
                <img src="static/img/surveyPreview/phone.png" />&nbsp;&nbsp; Phone
              </a>
              <a class="dropdown-item" id="tablet-selected" v-on:click="toggleTablet('tablet')">
                <img src="static/img/surveyPreview/tablet.png" />&nbsp; Tablet
              </a>
            </div>
          </div>

          <div class="btn-group m-b-10 exportBtn">
            <a
              class="btn btn-default dropdown-toggle"
              role="button"
              id="navbarDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Export</a>
            <div class="dropdown-menu exportDropdown" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" v-on:click="exportScreen()">
                <img src="static/img/surveyPreview/exportscreen.png" />&nbsp;Export screen
              </a>
              <a class="dropdown-item" v-on:click="exportSurveyPdf()">
                <img src="static/img/surveyPreview/exportsurvey.png" />&nbsp;Export survey
              </a>
              <a class="dropdown-item" v-on:click="printScreen()">
                <img src="static/img/surveyPreview/print.png" />&nbsp; Print screen
              </a>
              <a class="dropdown-item" v-on:click="printSurvey()">
                <img src="static/img/surveyPreview/print.png" />&nbsp; Print survey
              </a>
            </div>
            <!-- </div> -->
          </div>
          <!-- <div class="btn-group m-b-10">
            <button
              class="btn btn-default"
              style="border: 1px solid rgb(197, 209, 214);padding: 0 5px;margin: 0 0 0 10px;"
            >
              <span class="fa fa-circle" style="color:gray"></span> Rec
            </button>
          </div>-->
        </div>

        <!-- </ul> -->
      </nav>
      <!--Phone frame design START---->
      <div v-if="showPreview && showTablet==false" id="phone-frame">
        <div class="phone-frame1">
          &nbsp;
          <!-- <div style="padding-top: 15px;"> -->
          <div class="phone-inner-part">
            <div class="phone-top-bar">
              <i class="fa fa-wifi wifi-icon" style="float:left"></i>
              <strong style="font-size: 11px;margin-left: 40%;">9:41 AM</strong>
              <i class="fa fa-battery-half" style="float:right" aria-hidden="true"></i>

              <div class="phone-top-bar">
                <i class="fas fa-chevron-left"></i>
                <span class="top-content-name text-center">
                  <b>{{surveyData.title}}</b>
                </span>
                <hr class="hr_content" />

                <div v-if="phoneQuestion" class="phone-question" id="questionbpodyy">
                  <!-- code for different screen type START--->
                  <div v-if="phoneQuestion.type=='SurveyInstruction'">
                    <div class="pl-0 text-center mt-5 pt-5">
                      <div
                        class="instruction_title text-center mt-5 pt-5"
                        v-html="phoneQuestion.formattedTitle"
                      ></div>
                      <div v-if="phoneQuestion.previewImageUrl" class="imageBox">
                        <img class="img-size" :src="phoneQuestion.previewImageUrl" />
                      </div>
                      <div
                        class="instruction_info text-center mt-5 pt-5"
                        v-html="phoneQuestion.formattedInformation"
                        style="max-height:281px;height:281px;"
                      ></div>
                    </div>
                  </div>
                  <div
                    class="option-section pad-top20"
                    v-if="phoneQuestion.type=='CustomScale' && phoneQuestion.direction=='Vertical'"
                  >
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <ds-slider
                              v-if="phoneQuestion.verticalScale"
                              ref="slider"
                              :piecewise="true"
                              width="2"
                              direction="vertical"
                              tooltip="none"
                              class="vertical-vue-slider pl-20"
                              :data="phoneQuestion.formattedLabels"
                              :disabled="false"
                              :piecewiseLabel="true"
                              :piecewiseStyle="piecewiseStyle"
                              :piecewiseActiveStyle="piecewiseActiveStyle"
                              :labelActiveStyle="labelActiveStyle"
                              style="text-align: -webkit-center;"
                            ></ds-slider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="phoneQuestion.type=='CustomScale' && phoneQuestion.direction=='Horizontal'"
                  >
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <ds-slider
                              v-if="!phoneQuestion.verticalScale"
                              ref="slider"
                              :piecewise="true"
                              width="1"
                              direction="horizontal"
                              tooltip="none"
                              class="horizontal-vue-slider pl-20"
                              :data="phoneQuestion.formattedLabels"
                              :disabled="false"
                              :piecewiseLabel="true"
                              :piecewiseStyle="piecewiseStyle"
                              :piecewiseActiveStyle="piecewiseActiveStyle"
                              :labelActiveStyle="labelActiveStyle"
                            ></ds-slider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='DateTime'">
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <input
                              type="text"
                              class="input-text readonly"
                              :placeholder="getplaceholdertext(phoneQuestion)"
                              readonly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='Image'">
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body text-center" style="max-height=256px;height:256px">
                            <div
                              v-for="(languageImageOptions, loopIndex) in phoneQuestion.languageImageOptions"
                              :key="loopIndex"
                            >
                              <div
                                v-for="(option, optionIndex) in languageImageOptions.options"
                                :key="optionIndex"
                              >
                                <input type="radio" class="radio_image_style" disabled />
                                <img
                                  class="imageBox pl-0 text-center img-size"
                                  :src="option.previewImageUrl"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='MultiChoice'">
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <div class v-for="img in phoneQuestion.bodyImages">
                              <img :src="img.previewImageUrl" alt class="img-size" />
                            </div>
                            <div
                              v-for="(option, index) in phoneQuestion.options"
                              :key="index"
                              v-bind:value="option.formattedBody"
                            >
                              <input type="radio" class disabled />
                              <label class="ml-5 pt-10" v-html="option.formattedBody"></label>

                              <!-- <div class="" v-if="option.imageUrl">
                              <img :src="option.imageUrl">
                              </div>-->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='Number'">
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <input
                              type="text"
                              class="input-text readonly"
                              :placeholder="[[this.phoneQuestion.units ]]  + ' ' +'Enter a number ' + [[this.phoneQuestion.minValue ]] + '' + '-' +  [[this.phoneQuestion.maxValue ]] "
                              readonly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="phoneQuestion.type=='NumberScale' && phoneQuestion.direction=='Horizontal'"
                  >
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <!-- <div class="scaleLabels ">{{phoneQuestion.maxValueLabel}}</div> -->
                            <ds-slider
                              ref="slider"
                              v-if="phoneQuestion.partitions !== 0"
                              :value="phoneQuestion.minValue"
                              :piecewise="true"
                              direction="horizontal"
                              tooltip="none"
                              class="horizontal-vue-slider pl-20"
                              :min="phoneQuestion.minValue"
                              :max="phoneQuestion.maxValue"
                              :disabled="false"
                              :piecewiseLabel="true"
                              :piecewiseStyle="piecewiseStyle"
                              :interval="phoneQuestion.partitions"
                              :piecewiseActiveStyle="piecewiseActiveStyle"
                              :labelActiveStyle="labelActiveStyle"
                            ></ds-slider>
                            <ds-slider
                              ref="slider"
                              v-else
                              :value="phoneQuestion.minValue"
                              direction="horizontal"
                              tooltip="none"
                              class="horizontal-vue-slider pl-20"
                              :min="phoneQuestion.minValue"
                              :max="phoneQuestion.maxValue"
                              :disabled="false"
                              :labelActiveStyle="labelActiveStyle"
                            >
                              <!-- <div class="scaleLabels">{{phoneQuestion.minValueLabel}}</div> -->
                            </ds-slider>
                            <div class="pull-left">{{phoneQuestion.minValueLabel}}</div>
                            <div class="pull-right">{{phoneQuestion.maxValueLabel}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="option-section pad-top20"
                    v-if="phoneQuestion.type=='NumberScale' && phoneQuestion.direction=='Vertical'"
                  >
                    <div class="modal bs-example-modal text-center">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body text-center" style="height:300px">
                            <div class="scaleLabels text-center">{{phoneQuestion.maxValueLabel}}</div>
                            <ds-slider
                              ref="slider"
                              v-if="phoneQuestion.partitions !== 0"
                              :value="phoneQuestion.minValue"
                              :piecewise="true"
                              direction="vertical"
                              tooltip="none"
                              class="vertical-vue-slider pl-20"
                              width="1"
                              :min="phoneQuestion.minValue"
                              :max="phoneQuestion.maxValue"
                              :disabled="false"
                              :piecewiseLabel="true"
                              :piecewiseStyle="piecewiseStyle"
                              :interval="phoneQuestion.partitions"
                              :piecewiseActiveStyle="piecewiseActiveStyle"
                              :labelActiveStyle="labelActiveStyle"
                              style="text-align: -webkit-center;"
                            ></ds-slider>
                            <ds-slider
                              ref="slider"
                              v-else
                              :value="phoneQuestion.minValue"
                              direction="vertical"
                              tooltip="none"
                              class="vertical-vue-slider pl-20"
                              width="2"
                              :min="phoneQuestion.minValue"
                              :max="phoneQuestion.maxValue"
                              :disabled="false"
                              :labelActiveStyle="labelActiveStyle"
                            ></ds-slider>
                            <div class="scaleLabels">{{phoneQuestion.minValueLabel}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='Text'">
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <input
                              type="text"
                              class="input-text readonly"
                              placeholder="Answer"
                              readonly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='Boolean'">
                    <div class="modal bs-example-modal">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                          </div>
                          <div class="modal-body">
                            <div
                              v-for="(option, index) in phoneQuestion.options.slice(0, 4)"
                              :key="index"
                              v-bind:value="option.formattedBody"
                            >
                              <input type="radio" class disabled />
                              <label class="ml-5 pt-10" v-html="option.formattedBody"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='ImageCapture'">
                    <div class="pl-0 text-center mt-5 pt-5">
                      <div v-if="phoneQuestion.previewImageUrl" class="imageBox">
                        <img class="img-size" :src="phoneQuestion.previewImageUrl" />
                      </div>
                      <div
                        class="instruction_title text-center mt-5 pt-5"
                        v-html="phoneQuestion.formattedTitle"
                      ></div>
                      <div
                        class="instruction_info text-center mt-5 pt-5"
                        v-html="phoneQuestion.formattedInformation"
                        style="max-height: 212px;height:212px"
                      ></div>
                    </div>
                  </div>
                  <div v-if="phoneQuestion.type=='GPSkin'">
                    <div v-html="phoneQuestion.formattedBody" />
                    <div class="pl-0 text-center mt-5 pt-5">
                      <div v-if="phoneQuestion.previewImageUrl" class="imageBox">
                        <img class="img-size" :src="phoneQuestion.previewImageUrl" />
                      </div>
                      <div
                        class="instruction_title text-center mt-5 pt-5"
                        v-html="phoneQuestion.formattedTitle"
                      ></div>
                      <div
                        class="instruction_info text-center mt-5 pt-5"
                        v-html="phoneQuestion.formattedInformation"
                      ></div>
                      <a
                        href="#"
                        v-if="phoneQuestion.isSkippable=false"
                        class="text-center mt-5 pt-5 disabled-footer"
                        style="display:block"
                      >Skip this question</a>
                    </div>
                  </div>
                  <!-- code for different screen type END--->
                </div>
                <div v-if="phoneQuestion" class="phone-question-footer">
                  <div class="mt-5 pt-3">
                    <a href="#" class="btn next-button disabled-footer">Next</a>
                    <a
                      href="#"
                      v-if="phoneQuestion.isSkippable"
                      class="text-center mt-5 pt-5 disabled-footer"
                      style="display:block"
                    >Skip this question</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <!--Phone frame design END---->

      <!--Tablet frame design ---->
      <div id="tablet-frame" v-if="showPreview && showTablet">
        <div class="tablet-frame1">
          <div>
            &nbsp;
            <div class="tablet-inner-part">
              <div class="phone-top-bar">
                <i class="fa fa-wifi" style="float:left"></i>
                <strong style="font-size: 11px;margin-left: 40%;">9:41 AM</strong>
                <i class="fa fa-battery-half" aria-hidden="true" style="float: right;"></i>
              </div>
              <div class="phone-top-bar">
                <i class="fas fa-chevron-left"></i>
                <span class="top-content-name text-center">
                  <b>{{surveyData.title}}</b>
                </span>
              </div>
              <hr />
              <div v-if="phoneQuestion" class="tablet-question" id="questionbpodyy">
                <!-- code for different screen type START--->
                <div v-if="phoneQuestion.type=='SurveyInstruction'">
                  <div class="pl-0 text-center mt-5 pt-5">
                    <div
                      class="instruction_title text-center mt-5 pt-5"
                      v-html="phoneQuestion.formattedTitle"
                    ></div>
                    <div v-if="phoneQuestion.previewImageUrl" class="imageBox">
                      <img class="img-size" :src="phoneQuestion.previewImageUrl" />
                    </div>
                    <div
                      class="instruction_info text-center mt-5 pt-5"
                      v-html="phoneQuestion.formattedInformation"
                      style="max-height: 175px;"
                    ></div>
                  </div>
                </div>
                <div
                  class="option-section pad-top20"
                  v-if="phoneQuestion.type=='CustomScale' && phoneQuestion.direction=='Vertical'"
                >
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <ds-slider
                            v-if="phoneQuestion.verticalScale"
                            ref="slider"
                            :piecewise="true"
                            width="2"
                            direction="vertical"
                            tooltip="none"
                            class="vertical-vue-slider pl-20"
                            :data="phoneQuestion.formattedLabels"
                            :disabled="false"
                            :piecewiseLabel="true"
                            :piecewiseStyle="piecewiseStyle"
                            :piecewiseActiveStyle="piecewiseActiveStyle"
                            :labelActiveStyle="labelActiveStyle"
                            style="text-align: -webkit-center;"
                          ></ds-slider>
                        </div>
                        <!-- <div v-html="phoneQuestion.scalePoint">
                        </div>-->
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="phoneQuestion.type=='CustomScale' && phoneQuestion.direction=='Horizontal'"
                >
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <ds-slider
                            v-if="!phoneQuestion.verticalScale"
                            ref="slider"
                            :piecewise="true"
                            width="1"
                            direction="horizontal"
                            tooltip="none"
                            class="horizontal-vue-slider pl-20"
                            :data="phoneQuestion.formattedLabels"
                            :disabled="false"
                            :piecewiseLabel="true"
                            :piecewiseStyle="piecewiseStyle"
                            :piecewiseActiveStyle="piecewiseActiveStyle"
                            :labelActiveStyle="labelActiveStyle"
                          ></ds-slider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='DateTime'">
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <input
                            type="text"
                            class="input-text readonly"
                            :placeholder="getplaceholdertext(phoneQuestion)"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='Image'">
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body text-center" style="height:276px;max-height:276px">
                          <div class="row justify-content-start">
                            <div
                              class="col-auto pl-0 pr-0"
                              v-for="(languageImageOptions, loopIndex) in phoneQuestion.languageImageOptions"
                              :key="loopIndex"
                            >
                              <div
                                class="form-group"
                                v-for="(option, optionIndex) in languageImageOptions.options"
                                :key="optionIndex"
                              >
                                <input type="radio" class="radio_image_style" disabled />
                                <img
                                  class="imageBox pl-0 text-center img-size"
                                  :src="option.previewImageUrl"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='MultiChoice'">
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <div class v-for="img in phoneQuestion.bodyImages">
                            <img :src="img.previewImageUrl" alt class="img-size" />
                          </div>
                          <div
                            v-for="(option, index) in phoneQuestion.options"
                            :key="index"
                            v-bind:value="option.formattedBody"
                          >
                            <input type="radio" class disabled />
                            <label class="ml-5 pt-10" v-html="option.formattedBody"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='Number'">
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <input
                            type="text"
                            class="input-text readonly"
                            :placeholder="[[this.phoneQuestion.units ]]  + ' ' +'Enter a number ' + [[this.phoneQuestion.minValue ]] + '' + '-' +  [[this.phoneQuestion.maxValue ]] "
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="phoneQuestion.type=='NumberScale' && phoneQuestion.direction=='Horizontal'"
                >
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <ds-slider
                            ref="slider"
                            v-if="phoneQuestion.partitions !== 0"
                            :value="phoneQuestion.minValue"
                            :piecewise="true"
                            direction="horizontal"
                            tooltip="none"
                            class="horizontal-vue-slider pl-20"
                            :min="phoneQuestion.minValue"
                            :max="phoneQuestion.maxValue"
                            :disabled="false"
                            :piecewiseLabel="true"
                            :piecewiseStyle="piecewiseStyle"
                            :interval="phoneQuestion.partitions"
                            :piecewiseActiveStyle="piecewiseActiveStyle"
                            :labelActiveStyle="labelActiveStyle"
                          ></ds-slider>
                          <ds-slider
                            ref="slider"
                            v-else
                            :value="phoneQuestion.minValue"
                            direction="horizontal"
                            tooltip="none"
                            class="horizontal-vue-slider pl-20"
                            :min="phoneQuestion.minValue"
                            :max="phoneQuestion.maxValue"
                            :disabled="false"
                            :labelActiveStyle="labelActiveStyle"
                          ></ds-slider>
                          <div class="pull-left">{{phoneQuestion.minValueLabel}}</div>
                          <div class="pull-right">{{phoneQuestion.maxValueLabel}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="option-section pad-top20"
                  v-if="phoneQuestion.type=='NumberScale' && phoneQuestion.direction=='Vertical'"
                >
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body text-center" style="height:268px">
                          <div class="scaleLabels">{{phoneQuestion.maxValueLabel}}</div>
                          <ds-slider
                            ref="slider"
                            v-if="phoneQuestion.partitions !== 0"
                            :value="phoneQuestion.minValue"
                            :piecewise="true"
                            direction="vertical"
                            tooltip="none"
                            class="vertical-vue-slider pl-20"
                            width="2"
                            :min="phoneQuestion.minValue"
                            :max="phoneQuestion.maxValue"
                            :disabled="false"
                            :piecewiseLabel="true"
                            :piecewiseStyle="piecewiseStyle"
                            :interval="phoneQuestion.partitions"
                            :piecewiseActiveStyle="piecewiseActiveStyle"
                            :labelActiveStyle="labelActiveStyle"
                            style="text-align: -webkit-center;"
                          ></ds-slider>
                          <ds-slider
                            ref="slider"
                            v-else
                            :value="phoneQuestion.minValue"
                            direction="vertical"
                            tooltip="none"
                            class="vertical-vue-slider pl-20"
                            width="2"
                            :min="phoneQuestion.minValue"
                            :max="phoneQuestion.maxValue"
                            :disabled="false"
                            :labelActiveStyle="labelActiveStyle"
                          ></ds-slider>
                          <div
                            class="scaleLabels"
                            v-if="phoneQuestion.verticalScale"
                          >{{phoneQuestion.minValueLabel}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='Text'">
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <input
                            type="text"
                            class="input-text readonly"
                            placeholder="Answer"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='Boolean'">
                  <div class="modal bs-example-modal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <div class="modal-title" v-html="phoneQuestion.formattedBody" />
                        </div>
                        <div class="modal-body">
                          <div
                            v-for="(option, index) in phoneQuestion.options.slice(0, 4)"
                            :key="index"
                            v-bind:value="option.formattedBody"
                          >
                            <input type="radio" class disabled />
                            <label class="ml-5 pt-10" v-html="option.formattedBody"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='ImageCapture'">
                  <div class="pl-0 text-center mt-5 pt-5">
                    <div v-if="phoneQuestion.previewImageUrl" class="imageBox">
                      <img class="img-size" :src="phoneQuestion.previewImageUrl" />
                    </div>
                    <div
                      class="instruction_title text-center mt-5 pt-5"
                      v-html="phoneQuestion.formattedTitle"
                    ></div>
                    <div
                      class="instruction_info text-center mt-5 pt-5"
                      v-html="phoneQuestion.formattedInformation"
                      style="max-height: 176;height:176px"
                    ></div>
                  </div>
                </div>
                <div v-if="phoneQuestion.type=='GPSkin'">
                  <div v-html="phoneQuestion.formattedBody" />
                  <div class="pl-0 text-center mt-5 pt-5">
                    <div v-if="phoneQuestion.previewImageUrl" class="imageBox">
                      <img class="img-size" :src="phoneQuestion.previewImageUrl" />
                    </div>
                    <div
                      class="instruction_title text-center mt-5 pt-5"
                      v-html="phoneQuestion.formattedTitle"
                    ></div>
                    <div
                      class="instruction_info text-center mt-5 pt-5"
                      v-html="phoneQuestion.formattedInformation"
                    ></div>
                    <a
                      href="#"
                      v-if="phoneQuestion.isSkippable=false"
                      class="text-center mt-5 pt-5 disabled-footer"
                      style="display:block"
                    >Skip this question</a>
                  </div>
                </div>
                <!-- code for different screen type END--->
              </div>
              <div v-if="phoneQuestion" class="tablet-question-footer">
                <div class="mt-5 pt-3">
                  <a href="#" class="btn next-button disabled-footer">Next</a>
                  <a
                    href="#"
                    v-if="phoneQuestion.isSkippable"
                    class="text-center mt-5 pt-5 disabled-footer"
                    style="display:block"
                  >Skip this question</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Tablet frame design END---->
      <!--pagination code-->
      <div v-if="showPreview" class="preview-footer text-center">
        <button
          id="prevButton"
          class="mobile-pagination"
          name="Prev"
          v-on:click="prevMobileQuestion()"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span
          class="m-5"
          v-if="questionAnswers"
        >{{currentIndex + 1}} of {{questionAnswers.length - 1}}</span>
        <button
          id="nextButton"
          class="mobile-pagination"
          name="Next"
          v-on:click="nextMobileQuestion()"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <!--pagination code-->
      <!-- download button start -->
      <div v-if="showDownloadVideoScreen" class="Rectangle">
        <div class="download-video">
          <div class="dwnd">
            <span class="download-contant">Your video is ready for download</span>
          </div>
          <br />
          <!-- 
          <div class="row pt-10 dwnd">
            <div class="p-0" style="margin-left:140px">
              <button
                type="button"
                class="download-btn btn-md btn-block add_another_btn br-25 btn-new"
              >
                <span class="circle">+</span>
                <span class="download-txt">Download video</span>
              </button>
            </div>
          </div>-->

          <div class="download-cancle dwnd" style="margin-left:43%;">
            <a href="Cancel" style="text-decoration-line: none;">Cancel</a>
          </div>
        </div>
      </div>
      <!-- download button end -->
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
//import htmlToImage from "html-to-image";
import _ from "lodash";
import sampleQuestionObj from "../survey-builder/surveyQuestion.json";
import addEditQuestion from "../common/add-edit-question";
import readOnlyQuestions from "../common/read-only-questions";
import studyFeatureHeader from "../common/study-features-header";
import dsSlider from "../../lib/ds-slider-component";
//import VuePaginate from "vue-paginate";

export default {
  name: "surveydetails",
  data() {
    return {
      showTime: null,
      showDate: null,
      units: null,
      minValue: null,
      maxValue: null,
      piecewiseStyle: {
        backgroundColor: "#ccc",
        visibility: "visible",
        width: "12px",
        height: "12px"
      },
      piecewiseActiveStyle: {
        backgroundColor: "#3498db"
      },
      labelActiveStyle: {
        color: "#3498db"
      },
      showPreview: false,
      showTablet: false,
      showDownloadVideoScreen: false,
      id: null,
      studyId: null,
      surveyId: null,
      // scalePhoneInfoDiv: false,
      survey: {},
      surveyData: { title: "", nickName: "", questions: [] },
      surveyType: null,
      addQuestion: false,
      scaleValueInfoDiv: false,
      sequence: 1,
      currentIndex: 0,
      phoneQuestion: null,
      nextQuestion: null,
      questionAnswers: [],
      questionsWithoutCompletion: [],
      introQuestions: [],
      sampleQuestion: null,
      selectedQuestion: { value: "Default", label: "- Select -" },
      questionTypes: [
        { value: "Default", label: "- Select a screen type -" },
        { value: "SurveyInstruction", label: "Instruction screen" },
        { value: "CustomScale", label: "Custom scale" },
        { value: "DateTime", label: "Date / Time" },
        { value: "Image", label: "Image choice" },
        { value: "MultiChoice", label: "Multiple choice" },
        { value: "Number", label: "Number response" },
        { value: "NumberScale", label: "Number scale" },
        { value: "Text", label: "Text response" },
        { value: "Boolean", label: "Yes or No" },
        { value: "ImageCapture", label: "Image Capture" }
        // { value: 'Email', label: 'Email' },
        // { value: 'Location', label: 'Location' },
      ],
      studyData: null,
      isQuestionInEditMode: false
    };
  },
  components: {
    dsSlider,
    readOnlyQuestions,
    studyFeatureHeader,
    addEditQuestion
  },
  computed: {
    questionSaveUpdateChanged() {
      return this.$store.getters.getNewQuestion;
    },
    selectedQuestionChanged() {
      return this.$store.getters.getSelectedQuestion;
    },
    surveyQuestions() {
      return this.$store.getters.getSurveyQuestionsData;
    }
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.surveyType = this.$route.params.surveyType;
    this.getSurveyDetails();
    this.getStudyDetails();
  },
  watch: {
    questionSaveUpdateChanged: {
      handler(val) {
        if (val) {
          const questionObj = val;
          //let branchingIndexArr = [];

          if (val.opType === "delete") {
            this.$api
              .deleteQuestionFact(
                this.studyId,
                this.surveyId,
                val.id,
                this.surveyType
              )
              .then(() => {
                toastr.success("Question deleted successfully");
                const questionIndex = _.findIndex(this.questionAnswers, [
                  "id",
                  val.id
                ]);
                this.questionAnswers.splice(questionIndex, 1);
                _.forEach(this.questionAnswers, (question, index) => {
                  if (question.type !== "SurveyCompletion") {
                    question.sequence = index + 1;
                  }
                });
                this.pushCompletionQuestion();
                this.$api
                  .updateSurveyQuestionOrderFact(
                    this.studyId,
                    this.surveyId,
                    this.questionAnswers
                  )
                  .then(
                    response => {
                      this.$store.dispatch(
                        "surveyQuestionsAction",
                        this.questionAnswers
                      );
                    },
                    error => {
                      this.errorMsg = error.body
                        ? error.body.message
                        : "Error while changing order";
                    }
                  );
                if (this.questionAnswers && this.questionAnswers.length === 0) {
                  this.addQuestion = true;
                  this.sampleQuestion = _.cloneDeep(
                    JSON.parse(JSON.stringify(sampleQuestionObj))
                  ); //eslint-disable-line
                  this.sampleQuestion.sequence = 1;
                } else {
                  this.addQuestion = false;
                  this.isQuestionInEditMode = false;
                }
              });
          } else if (!val.id) {
            // Question with out id === new question
            questionObj.sequence = !val.sequence
              ? Number(
                  _.max(_.map(this.questionsWithoutCompletion, "sequence"))
                ) + 1
              : val.sequence;

            questionObj.branchingConfigured = this.toggleBranchingConfiguration(
              questionObj
            );

            delete questionObj.questionNumber;
            this.$api
              .addQuestionFact(
                this.studyId,
                this.surveyId,
                questionObj,
                this.surveyType
              )
              .then(
                response => {
                  this.getSurveyDetails();
                  this.$store.dispatch("addQuestionAction", null);
                  toastr.success("Question added successfully");
                  this.questionAnswers.push(response.data);
                  this.questionsWithoutCompletion.push(response.data);
                  this.surveyData.questions = this.questionAnswers;
                  this.$store.dispatch(
                    "setSurveyDetailsAction",
                    this.surveyData
                  );
                  this.pushCompletionQuestion();
                  this.$store.dispatch(
                    "surveyQuestionsAction",
                    this.questionAnswers
                  );
                  this.addQuestion = false;
                  this.isQuestionInEditMode = false;
                  this.sequence = this.sequence + 1;
                },
                error => {
                  this.$store.dispatch("addQuestionAction", null);
                  this.errorMsg = error.body
                    ? error.body.message
                    : "Error while adding the question";
                  toastr.error(this.errorMsg);
                }
              );
          } else {
            // Question with id === existing question
            questionObj.branchingConfigured = this.toggleBranchingConfiguration(
              questionObj
            );
            delete questionObj.questionNumber;
            this.$api
              .updateQuestionFact(
                this.studyId,
                this.surveyId,
                questionObj.id,
                questionObj,
                this.surveyType
              )
              .then(
                response => {
                  this.getSurveyDetails();
                  toastr.success("Question updated successfully");
                  const questionIndex = _.findIndex(this.questionAnswers, [
                    "id",
                    response.data.id
                  ]);
                  this.questionAnswers.splice(questionIndex, 1, response.data);
                  const questionIndexComplete = _.findIndex(
                    this.questionsWithoutCompletion,
                    ["id", response.data.id]
                  );
                  this.questionsWithoutCompletion.splice(
                    questionIndexComplete,
                    1,
                    response.data
                  );
                  this.surveyData.questions = this.questionAnswers;
                  this.$store.dispatch(
                    "setSurveyDetailsAction",
                    this.surveyData
                  );
                  this.$store.dispatch("selectedQuestionAction", { id: null });
                  this.pushCompletionQuestion();
                  this.$store.dispatch(
                    "surveyQuestionsAction",
                    this.questionAnswers
                  );
                  this.addQuestion = false;
                  this.isQuestionInEditMode = false;
                },
                error => {
                  this.$store.dispatch("selectedQuestionAction", { id: null });
                  this.errorMsg = error.body
                    ? error.body.message
                    : "Error while updating the question";
                  toastr.error(this.errorMsg);
                }
              );
          }
        }
      }
    },
    selectedQuestionChanged: {
      handler(val) {
        if (val.op === "delete") {
          this.$api
            .deleteQuestionFact(
              this.studyId,
              this.surveyId,
              val.id,
              this.surveyType
            )
            .then(
              () => {
                toastr.success("Question deleted successfully");
                const questionIndex = _.findIndex(this.questionAnswers, [
                  "id",
                  val.id
                ]);
                const questionIndexComplete = _.findIndex(
                  this.questionsWithoutCompletion,
                  ["id", val.id]
                );
                this.questionAnswers.splice(questionIndex, 1);
                this.questionsWithoutCompletion.splice(
                  questionIndexComplete,
                  1
                );

                this.surveyData.questions = this.questionAnswers;
                // this.$store.dispatch('setSurveyDetailsAction', this.surveyData);
                // this.$store.dispatch('selectedQuestionAction', { id: null });
                this.pushCompletionQuestion();
                this.$store.dispatch(
                  "surveyQuestionsAction",
                  this.questionAnswers
                );
                this.addQuestion = false;
                this.isQuestionInEditMode = false;
              },
              error => {
                // this.$store.dispatch('selectedQuestionAction', { id: null });
                this.errorMsg = error.body
                  ? error.body.message
                  : "Erorr while deleting the question";
                toastr.error(this.errorMsg);
              }
            );
        } else {
          this.selectedQuestion = { value: "Default", label: "- Select -" };
          if (val.id) {
            this.addQuestion = true;
          } else {
            this.addQuestion = false;
            this.isQuestionInEditMode = false;
          }
        }
      }
    },
    surveyQuestions: {
      handler(val) {
        this.questionAnswers = val;
      }
    }
  },
  methods: {
    toggleTablet(val) {
      if (val == "phone") this.showTablet = false;
      else {
        this.showTablet = true;
        tablet - selected;
      }
    },
    togglePreview() {
      if (this.showPreview == true) this.showPreview = false;
      else this.showPreview = true;
    },

    //---------------export code START----------
    exportPdf() {
      var doc = new jspdf();
      var filename = "survey_" + this.studyId + ".pdf";
      html2canvas(document.querySelector("#questionbpodyy")).then(canvas => {
        let pdf = new jspdf("p", "mm", "a4");
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 100, 100);
        pdf.save(filename);
      });
    },
    exportSurveyPdf() {
      this.generateSurveyPdf().then(pdf => {
        var filename = "survey_" + this.studyId + ".pdf";
        pdf.save(filename);
      });
    },
    async generateSurveyPdf() {
      let val;
      if (this.showTablet == true) {
        val = "#tablet-frame";
      } else {
        val = "#phone-frame";
      }
      return new Promise(async resolveComplete => {
        var doc = new jspdf();
        let promise = [];
        let pdf = new jspdf("p", "mm", "a4");
        for (let i = 0; i < this.questionAnswers.length - 1; i++) {
          await new Promise(async resolve => {
            this.nextMobileQuestionwithindex(i);
            await this.$nextTick();

            html2canvas(document.querySelector(val), {
              allowTaint: true,
              useCORS: true
            }).then(canvas => {
              if (val == "#phone-frame") {
                pdf.addImage(
                  canvas.toDataURL("image/png"),
                  "PNG",
                  50,
                  50,
                  100,
                  150
                );
              } else {
                pdf.addImage(
                  canvas.toDataURL("image/png"),
                  "PNG",
                  40,
                  50,
                  150,
                  150
                );
              }
              if (i < this.questionAnswers.length - 2) {
                pdf.addPage("a4", "p");
              }
              resolve();
            });
          });
        }
        resolveComplete(pdf);
      });
    },
    nextMobileQuestionwithindex(newIndex) {
      if (newIndex < this.questionAnswers.length - 1) {
        this.currentIndex = newIndex;
        this.phoneQuestion = this.questionAnswers[newIndex];
      }
    },
    //---------------------- export image--------------------------
    exportScreen() {
      let device;
      if (this.showTablet == true) {
        device = "tablet-frame";
      } else {
        device = "phone-frame";
      }
      var studyId = this.studyId;
      var container = document.getElementById(device);
      html2canvas(container, {
        allowTaint: true,
        useCORS: true,
        logging: true
      }).then(function(canvas) {
        element => false;
        // CacheStorage=false;
        var link = document.createElement("a");
        document.body.appendChild(link);
        var filename = "survey_" + studyId + ".png";
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        link.target = "_blank";
        link.click();
      });
    },
    //--------------- print screen------------------
    printScreen() {
      let val;
      if (this.showTablet == true) {
        val = "#tablet-frame";
      } else {
        val = "#phone-frame";
      }
      var container = document.querySelector(val);
      html2canvas(container, { allowTaint: true, useCORS: true }).then(function(
        canvas
      ) {
        element => false;
        var dataURL = canvas.toDataURL();
        var width = canvas.width;
        var printWindow = window.open("");
        $(printWindow.document.body)
          .html(
            "<img id='Image' src=" + dataURL + " style='" + width + "'></img>"
          )
          .ready(function() {
            printWindow.focus();
            printWindow.print();
          });
      });
    },
    async printSurvey() {
      this.generateSurveyPdf().then(pdf => {
        var filename = "survey_" + this.studyId + ".pdf";
        pdf.autoPrint();
        // pdf.output('dataurlnewwindow');
        window.open(pdf.output("bloburl"), "_blank");
      });
    },
    imgLoaded(imgElement) {
      return imgElement.complete && imgElement.naturalHeight !== 0;
    },
    ImagetoPrint(source) {
      return "<img src='" + source + "' />";
    },

    //---------------export code END------------
    goBack() {
      if (this.surveyType == "EPRO") {
        let showList = true;
        this.$router.push({
          name: "epro-create",
          params: { eproId: this.surveyId }
        });
      } else {
        window.history.back();
      }
    },
    skipForNow() {
      if (this.surveyType == "EPRO") {
        let showList = true;
        this.$router.push({
          name: "epros",
          params: { studyId: this.studyId, surveyId: this.surveyId, showList }
        });
      } else {
        this.$router.push({
          name: "survey-scheduler",
          params: { studyId: this.studyId, surveyId: this.surveyId }
        });
      }
    },
    nextMobileQuestion() {
      if (this.currentIndex < this.questionAnswers.length - 2) {
        this.currentIndex++;
        this.phoneQuestion = this.questionAnswers[this.currentIndex];
      }
    },
    prevMobileQuestion() {
      if (this.currentIndex != 0) {
        this.currentIndex--;
        this.phoneQuestion = this.questionAnswers[this.currentIndex];
      }
    },
    goToNextPage() {
      if (this.addQuestion) {
        toastr.error("Please save or cancel your changes to continue.");
      } else {
        if (this.surveyType == "EPRO") {
        let showList = false;
        toastr.success("ePRO saved successfully.");
        this.$router.push({
          name: "epros",
          params: { studyId: this.studyId, surveyId: this.surveyId, showList }
        });
      } else {
          this.$router.push({
            name: "survey-scheduler",
            params: { studyId: this.studyId, surveyId: this.surveyId }
          });
        }
      }
    },
    pushCompletionQuestion() {
      const completionIndex = _.findIndex(
        this.questionAnswers,
        o => o.type === "SurveyCompletion"
      );
      if (completionIndex >= 0) {
        const element = this.questionAnswers[completionIndex];
        this.questionAnswers.splice(completionIndex, 1);
        this.questionAnswers.push(element);
      } else {
        this.questionAnswers.push({
          classType: "CompletionQuestion",
          id: "",
          type: "SurveyCompletion",
          sequence: 100000,
          title:
            this.surveyType == "EPRO" ? "EPRO Complete!" : "Survey Complete!",
          information:
            this.surveyType == "EPRO"
              ? "EPRO completed successfully"
              : "Survey completed successfully"
        });
      }
    },
    processQuestion(question) {
      question.map(function(value, key) {
        if (value.type == "SurveyInstruction") {
          if (value.formattedTitle == "") {
            value.formattedTitle = value.title;
          }
          if (value.formattedInformation == "") {
            value.formattedInformation = value.information;
          }
        } else if (
          value.type == "CustomScale" &&
          value.formattedLabels == undefined
        ) {
          value.formattedLabels = value.labels;
        } else {
          if (value.formattedBody == "") {
            value.formattedBody = value.body;
          }
          if (
            value.options !== undefined &&
            value.options.formattedBody == ""
          ) {
            value.options.formattedBody = value.options.body;
          }
        }
      });
      return question;
    },
    getSurveyDetails() {
      this.$api
        .getSurveyDetailsFact(this.studyId, this.surveyId, this.surveyType)
        .then(
          response => {
            this.surveyData = response.body;
            this.$store.dispatch("setSurveyDetailsAction", response.body);
            if (
              this.surveyData.questions &&
              this.surveyData.questions.length > 0
            ) {
              // this.introQuestions = _.filter(
              //   response.body.questions,
              //   o => o.type && o.type.toLowerCase() === 'surveyinstruction',
              // );
              this.questionAnswers = this.processQuestion(
                response.body.questions
              );
              this.phoneQuestion = this.questionAnswers[this.currentIndex];
              this.questionsWithoutCompletion = _.filter(
                response.body.questions,
                o => o.type && o.type.toLowerCase() !== "surveycompletion"
              );
              this.pushCompletionQuestion();
              this.$store.dispatch(
                "surveyQuestionsAction",
                this.questionAnswers
              );
              const onlyQuestions = _.filter(
                response.body.questions,
                o =>
                  o.type &&
                  o.type.toLowerCase() !== "surveycompletion" &&
                  o.type
              );
              if (this.questionAnswers && onlyQuestions.length > 0) {
                this.addQuestion = false;
              } else if (this.questionAnswers && onlyQuestions.length === 0) {
                this.addQuestion = true;
                this.addNewQuestion("SurveyInstruction");
              }
            }
          },
          error => {
            this.errorMsg = error.body
              ? error.body.message
              : "Error while getting survey details";
            toastr.error(this.errorMsg);
          }
        );
    },
    addNewQuestion(questionType) {
      this.sampleQuestion = _.cloneDeep(
        JSON.parse(JSON.stringify(sampleQuestionObj))
      );
      this.sampleQuestion.sequence = this.questionsWithoutCompletion.length
        ? Number(_.max(_.map(this.questionsWithoutCompletion, "sequence"))) + 1
        : 1;
      this.sampleQuestion.questionNumber = this.questionAnswers.length;
      this.sampleQuestion.type = questionType;
      this.addQuestion = true;
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          if (response.body) {
            this.studyData = response.body;
          }
        },
        error => {
          const err =
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details";
          toastr.error(err);
        }
      );
    },
    toggleBranchingConfiguration(quesObj) {
      if (quesObj.nextQuestionId && quesObj.nextQuestionId !== "default") {
        return true;
      }

      let branchingIndexArr = [];
      if (quesObj.type.toLowerCase() !== "image") {
        branchingIndexArr = _.filter(
          quesObj.options,
          o => o.nextQuestion && o.nextQuestion !== "default"
        );
      } else {
        branchingIndexArr = _.filter(
          quesObj.languageImageOptions[0].options,
          o => o.nextQuestion && o.nextQuestion !== "default"
        );
      }

      return branchingIndexArr.length > 0;
    },
    questionIsEdited() {
      this.isQuestionInEditMode = true;
    },
    questionIsEdited(index) {
      this.isQuestionInEditMode = true;
      this.currentIndex = index;
    },
    getplaceholdertext(phoneQuestion) {
      if (phoneQuestion.showDate && !phoneQuestion.showTime)
        return "Enter a date";
      else if (phoneQuestion.showTime && !phoneQuestion.showDate)
        return "Enter a time";
      else {
        return "Enter a date and a time";
      }
    }
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

@media (min-width: 1800px) and (max-width :2280px){
.survey_instruction_question{
  max-width: 84% !important;
}
}
@media (min-width: 1600px) and (max-width :1780px){
.survey_instruction_question{
  max-width: 79% !important;
}
}
@media (min-width: 992px) and (max-width :1300px){
.survey_instruction_question{
  max-width: 72% !important;
}
}
@media (min-width: 2300px) and (max-width :2560px){
.survey_instruction_question{
  max-width: 92% !important;
}
}

.suvey_question_card{
  max-width: 100%;
}


a.disabled-footer {
  pointer-events: none;
  cursor: default;
}
.top-content-name {
  color: #000000;
  display: inline-block;
  width: 95%;
}
.tablet-dropdown {
  font-family: Roboto;

  font-size: 18px;

  font-weight: bold;

  font-stretch: normal;

  font-style: normal;

  line-height: 1.11;

  letter-spacing: normal;

  color: #666669;
}
.dropdown-toggle {
  cursor: pointer;
  font-family: RobotoBold;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}

.phone-next-button {
  background-color: #576a6e;
  border: none;
  color: white;
  padding: 8px 21px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 15px;
  width: 80%;
  margin-left: 45px;
}

.tablet-next-button {
  background-color: #576a6e;
  border: none;
  color: white;
  padding: 8px 21px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 15px;
  width: 75%;
  margin-left: 60px;
}

.dwnd {
  align-items: center;
  display: flex;
  justify-content: center;
}


.Rectangle {
  width: 425px;
  height: 878px;
  background-color: rgba(196, 196, 196, 0.2);
}
.download-cancle {
  width: 43px;
  height: 20px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #4c8ce4;
}

.hr_content{
  border-top: none !important;
}

.download-btn {
  width: 136px;
  cursor: pointer;
  height: 30px;

  background-color: #4c8ce4;
}
.download-txt {
  width: 99px;
  height: 16px;
  padding: 5px;
  font-family: Roboto;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #ffffff;
}

.download-contant {
  width: 290px;
  margin-top: 308px;
  height: 20px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #000000;
}

.Export {
  width: 41px;
  height: 20px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.Phone {
  width: 52px;
  height: 20px;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.11;
  letter-spacing: normal;
  color: #666669;
  margin-top: 50px;
}

.add_Preview_btn {
  width: 148px;
  height: 36px;
  border-radius: 100px;
  border: solid 2px #4c8ce4;
  background-color: #ffffff;
}
.Content {
  width: 99px;
  height: 20px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #4c8ce4;
}
.Ellipse {
  width: 30px;
  height: 30px;
  background-color: #4c8ce4;
}

.radio_image_style{
  position: relative;
  right: 20px !important;
  top : 5px !important;
}

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
  color: #333;
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
  color: #333;
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
    content: "";
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
  .col-lg-offset-4 {
    margin-left: 33.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

h1,
h2,
h3 {
  font-weight: 200;
}

.phone-frame1 {
  border-radius: 24px;
  width: 308px;
  height: 558px;
  margin: 12% auto 0 auto;
  // margin-top: 12%;
  background-color: rgba(216, 216, 216, 0.4);
}
.phone-inner-part {
  border-radius: 11px;
  width: 294px;
  height: 513px;
  background-color: white;
  margin-left: 7px;
  margin-top: 1px;
  position: relative;
  top: 15px;
}
.phone-top-bar {
  height: 21px;
  padding: 5px;
  // background-color: black;
}
.tablet-frame1 {
  border-radius: 19px;
  width: 385px;
  height: 520.3px;
  margin: 12% auto 0 auto !important;
  background-color: rgba(216, 216, 216, 0.4);
}
.tablet-inner-part {
  border-radius: 8px;
  width: 365px;
  height: 476px;
  background-color: white;
  margin-left: 10px;
  margin-top: 3px;
  position: relative;
  top: 15px;
}

.tablet-inner-part .bs-example-modal .modal-body {
  height: auto;
  overflow: hidden;
}

.question-body {
  width: 355px;
  height: 350px;
}

.form-control {
  border-radius: 2px;
}

.pr-0 {
  padding-right: 0;
}

.pl-0 {
  padding-left: 0;
}

.img-style {
  padding-top: 20px;
  height: 300px;
  width: 500px;
  padding-bottom: 20px;
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

.button-blue-1 {
  background: #00bae0;
  color: #fff;
}

.button-blue-2 {
  background-color: #0197eb;
  color: #fff;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.mar-bot0 {
  margin-bottom: 0px !important;
}

.first_question_selection {
  img {
    width: 100%;
    max-width: 100px;
  }
  .header {
    font-size: 24px;
    font-weight: 200;
    padding: 14px;
  }
  .label_text {
    font-size: 18px;
    padding-bottom: 10px;
    font-weight: 400;
  }
  select {
    margin: auto;
    width: 100%;
    max-width: 300px;
  }
}

.question_count {
  background-color: #34537d;
  color: #fff;
  width: 25px;
  display: inline-block;
  border-radius: 10px;
  text-align: center;
}

.inner-card {
  border: 1px solid #ddd;
  box-shadow: 1px 0px 1px 1px #ddd;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f6fafc;
}

.select-style {
  background: #f9f9f9;
  border-radius: 2px;
}

.radio-style {
  margin-top: 5px !important;
  font-size: 14px;
  color: #555555;
}

.check-style {
  margin-top: 5px !important;
  font-size: 14px;
  color: #555555;
  padding: 0px 20px;
}

.border-left {
  border-left: 1px solid #555555;
}

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.container-stylee {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 29% !important;
  max-width: 29% !important;
  right: 0;
}

.input-style {
  width: 45px;
  margin-left: 10px;
  background: #f9f9f9;
  display: initial;
  padding: 5px;
}

.char-style {
  font-size: 14px;
  color: #555555;
}

.card {
  padding: 15px;
  color: black;
}

.add_another_btn {
  width: 136px;
  border-color: #4c8ce4;
  margin-bottom: 20px;
  background-color: #4c8ce4;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;

  .fa {
    position: relative;
    left: -35px;
    pointer-events: none;
    color: #4c8ce4;
    background-color: #fff;
    border-color: #fff;
  }
}

.preview-btn {
  background-color: #d4f2ff;
  width: 100%; // max-width: 150px;
  padding: 10px 0;
}

.icon-style {
  font-size: 47px;
  position: absolute;
  left: 30px;
  /* bottom: 0px; */
  top: -25px;
}

.pl-25 {
  padding-left: 25px;
}

@media (max-width: 575px) {
  .container-padding {
    padding-left: 20px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) {
}

.back_link {
  color: #666669;
}

.btn-new {
  width: 130px;
  height: 30px;
  background-color: #4c8ce4;
  border: none;
  border-radius: 100px;
}

.btn-preview {
  background-color: #4c8ce4;
  border: none;
  border-radius: 100px;
}

.show-btn-preview {
  background-color: #ffffff;
  border-radius: 100px;
  border: solid 2px #4c8ce4;
  color: #4c8ce4;
}

.circle {
  width: 24px;
  height: 24px;
  background-color: #fff;
  position: relative;
  left: -16px;
  top: -3px;
  color: #4c8ce4;
  font-weight: bold;
  border-radius: 12px;
  font-size: 18px;
  padding: 0px 8px;
}

.show-circle {
  width: 30px;
  height: 30px;
  background-color: #4c8ce4;
  position: relative;
  left: -8px;
  top: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 20px;
  font-size: 18px;
  padding: 5px 10px;
}

.hide-circle {
  width: 30px;
  height: 30px;
  background-color: #fff;
  position: relative;
  left: -8px;
  top: 0px;
  color: #4c8ce4;
  font-weight: bold;
  border-radius: 20px;
  font-size: 18px;
  padding: 5px 10px;
}

.txt {
  position: relative;
  color: #fff;
  left: -5px;
  top: -5px;
  font-size: 12px;
}
.hide-txt{
  position: relative;
  color: #fff;
  left: -5px;
  top: -2px;
  font-size: 14px;
}

.show-txt {
  position: relative;
  color: #4c8ce4;
  left: -5px;
  top: -2px;
  font-size: 14px;
//  font-family: Roboto;
 font-size: 14px;
  line-height: 1.43;
}

.phone-question {
  height: 350px;
  max-height: 350px;
}
.phone-question-footer {
  height: auto;
}
.tablet-question {
  height: 318px;
  max-height: 318px;
}
.tablet-question-footer {
  height: auto;
}
.tablet-question-footer .next-button {
  width: 80%;
  border-radius: 10px;
}
.img-size {
  width: 100%;
  height: auto;
  float: none;
  max-width: 120px;
  max-height: 120px;
  padding-left: 5px;
}
.instruction_title {
  word-break: break-word;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0;
    text-align: justify;
}
.instruction_info {
  word-break: break-word;
  height: auto;
  overflow: hidden;
  max-height: 210px;
}

.option-section {
  &:after {
    content: "";
    clear: both;
    display: block;
  }
  .col-sm-3 {
    float: left;
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

.next-button {
  background-color: #4c6473;
  color: #fff;
  margin: 0 auto;
  display: block;
  width: 80%;
  border-radius: 10px;
}
.mobile-pagination {
  padding: 5px 10px 5px 10px;
  margin-bottom: 20px;
  border: 1px solid #e6e5e5;
  color: #bdbdbd;
}
.preview-footer {
  margin-top: 5%;
}
.bs-example-modal {
  position: relative;
  top: auto;
  right: auto;
  bottom: auto;
  left: auto;
  z-index: 1;
  display: block;
}
.modal-title {
  font-size: 24px !important;
}
.modal-dialog {
  width: 100%;
}
.bs-example-modal .modal-body {
  height: 215px;
  overflow: hidden;
}

.bs-example-modal .modal-header {
  padding: 0rem 1rem;
  border-bottom: 0 none;
}
.bs-example-modal .modal-dialog {
  margin: 0rem auto;
}
.bs-example-modal .modal-body .vertical-vue-slider {
  height: 200px !important;
}
.phoneBar {
  font-family: RobotoBold;
  font-size: 18px;
  font-weight: bold;
  color: #666669;
  background-color: white;
  border: none;
  width: auto;
  padding-right: 10px;
}

.phoneTabletMenu .dropdown-toggle::after {
  margin-left: 5px;
}
.phoneTabletMenu .dropdown-toggle::after {
  margin-left: 5px;
  vertical-align: middle;
}
.exportBtn .dropdown-toggle::after {
  font-size: 18px;
  vertical-align: middle;
}
.phoneBar:focus {
  outline: #eee0 auto 1px;
  box-shadow: none;
}
.exportDropdown .dropdown-item {
  padding: 7px;
  font-family: RobotoRegular;
}
.exportDropdown .dropdown-item .fa,
.exportDropdown .dropdown-item .fas {
  color: #a8b0b4;
  margin-right: 5px;
}
.dropdown-item:hover {
  cursor: pointer;
}
.dropdown-item:ac {
  cursor: pointer;
}
.phone-tablet-menu .fa {
  margin-right: 10px;
}
.dropdown-menu {
  box-shadow: 0 0 0.5rem rgba(108, 118, 134, 0.5);
  min-width: 9rem;
}
.phone-tablet-menu a {
  padding: 5px 10px;
}
.dropdown-item:active {
  color: #fff;
  text-decoration: none;
  background-color: #545b62;
}
.imageBox {
  height: 80px;
  width: 80px;
  margin: 2px auto;
}
</style>