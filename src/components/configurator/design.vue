<template>
  <div class="design bg-color">
    <studyHeader></studyHeader>
    <div class="container m-0 container-style">
      <div class="has-header">
        <transition name="slide-fade">
          <div class="col-lg-2 col-md-2 col-sm-1 col-xs-1 pl-0 pr-40" v-on:click="previousQuestion()">
            <div class="panel panel-default panel-style side-bar" v-if="step !== 0">
              <div class="panel-body">
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2" v-if="step === 0">
            <div class="panel-body panel-body-style col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">We are now going to walk you through a series of questions. Your answers will help us setup your study today
                  and influence improvements we make in the future. </div>
                <div class="question_title pb-20">This process will help us start begin building your:</div>
                <div class="row pb-20">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                    <div>
                      <img src="static/img/graphic-study-app.svg">
                    </div>
                    <div class="pt-5">Mobile Study App</div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 pt-30">
                    <div>
                      <img src="static/img/graphic-cloud.svg">
                    </div>
                    <div class="pt-5">Compliant Cloud</div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div>
                      <img src="static/img/graphic-portal.svg">
                    </div>
                    <div class="pt-5">Research Portal</div>
                  </div>
                </div>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click="nextQuestion()">Begin</button>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2" v-if="step === 1">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">{{questionsList[step].question}}</div>
                <select class="form-control select-style" v-model="questionnaire.clientId" required>
                  <option value="default" disabled>-Select-</option>
                  <option v-for='client in questionsList[step].clients' :value="client.id">{{client.name}}</option>
                </select>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click="nextQuestion()" :class="{ 'disabledbtn' : questionnaire.clientId == 'default'  }" :disabled="questionnaire.clientId == 'default'">Continue</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pt-30">
              <span class="cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 2">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title">{{questionsList[step].question}}</div>
                <div class="question_title fs-12 pt-5 pb-20"> Don't worry! You can change this later.</div>
                <div class="form-group">
                  <input type="text" v-on:keyup="validStudyName(questionnaire.name)" name="study-name" :class="{'input': true, 'is-danger': errors.has('study-name'), 'is-success': !errors.has('study-name') }"
                    class="form-control" v-model="questionnaire.name" placeholder="Enter study name" required>
                  <span v-if="questionnaire.name && questionnaire.name.length > 50" class="error-style">Study name cannot exceed 50 characters in length</span>                  <br>
                  <span v-if="validStudyNameValue" class="error-style">Study name cannot start and/or end with a space.</span>
                </div>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click.prevent="nextQuestion()" :class="{ 'disabledbtn' : !questionnaire.name || errors.any()}"
                    :disabled="validStudyNameValue">Continue</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 3">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">{{questionsList[step].question}}</div>
                <div v-for='option in questionsList[step].options'>
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 mt-10 br-25"
                    v-on:click="buttonSelected(option, step)">{{option}}</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pt-30">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 4">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">We’re happy to help. </div>
                <div class="question_title"> Please give us a call at
                  <span class="color_blue">+1 888-948-4732</span>
                </div>
                <div class="question_title pb-20">or email us at
                  <a href="mailto:support@threadresearch.com"><span class="color_blue" >support@threadresearch.com.</span></a>
                </div>
                <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 mt-10 br-25"
                  v-on:click="nextQuestion()">Continue</button>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pt-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 5">
            <div class="panel-body panel-body-style col-lg-8 set-full-width col-md-10">
              <div class="">
                <div class="question_title">{{questionsList[step].question}}</div>
                <div class="countries-wrap">
                  <b-form-group class="country-group">
                    <b-form-checkbox v-for="option in supportedCountries" v-model="selectedCountries" :key="option.countryId"
                      :value="option" :checked="true" inline :disabled="option.isDisabled" > {{ option.countryName }}
                    </b-form-checkbox>
                  </b-form-group>
                </div>
                <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 mt-10 br-25"
                  v-on:click="nextQuestion()">Continue</button>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pt-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 6">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class>
                <div class="question_title">{{questionsList[step].question}}</div>
                <div class="pt-20">
                  <select class="form-control select-style mt-10" v-on:change="selectedLanguage(selLanguage)" v-model="selLanguage" :disabled="showAlert">
                    <option value="null" disabled>Select a language</option>
                    <option v-for="(lang, index) in questionsList[step].languages" :value="lang" :key="index">{{lang.name}}</option>
                  </select>
                  <div class="clearfix" v-for="(lang, index) in questionnaire.language" :key="index" >
                    <div v-if="lang.active!=false">
                      <div class="selected-lang pt-10">{{lang.display_name}}</div>
                      <div class="remove-selected pt-10" v-if="lang.name != 'English'" @click="showRemoveLanguageModal(lang, index)">Remove</div>
                    </div>
                  </div>
                </div>
                <div class="form-group pt-20">
                  <button
                    type="button"
                    class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    :disabled="isContinueBtnDisabled"
                    v-on:click="nextQuestion()">Continue</button>
                </div>
                <div v-if="showAlert" class="form-group edro-warning text-left">
                  <div class="alert alert-warning">
                    This study has eDros feature configured so you cannot add multiple languages to this study. If you want to do so you can remove eDros <router-link :to="{ name: 'features-library', params: { studyId } }">here</router-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
            <!-- modal box -->
              <b-modal ref="remove-language-modal" hide-footer hide-header>
                <div class="d-block text-center">
                  <div class="title">Are you sure you want to remove this language?</div>
                  <div class="description">Please be advised that this does not remove the language if it is currently in use in the study by a participant. Future participants will not see this language.</div>
                  <div class="btn-grp">
                    <button class="cancel-btn" @click="removeLanguage(false)">Cancel</button>
                    <button class="confirm-btn" @click="removeLanguage(true)">Yes</button>
                  </div>
                </div>
              </b-modal>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 7">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class>
                <div class="question_title" v-if="showUploadFileSection">{{questionsList[step].question0}}</div>
                <div class="question_title" v-if="showUploadReadOnlySection">{{questionsList[step].question1}}</div>
                <div class="upload-file" v-if="showUploadFileSection && questionnaire.language.length > 1">
                  <div class="pt-50">
                    <span class="round">1</span><label class="upload-wrap"> Upload settings file
                      <input type="file" size="60" class="upload-properties" id="upload-file-input" v-on:change="saveUploadFileOnLocal($event)"
                        accept=".applanga">
                    </label>
                  </div>
                  <div class="pt-15 access-token-wrap"><span class="round">2</span><span class="display-inline"><input class="form-control api-input" type="text" v-on:blur="checkForAccessToken()" v-model="applangaAccessToken" name="applangaAccessToken" placeholder="Enter API token"/></span></div>
                  <div class="form-group pt-50">
                    <button disabled="isContinueBtnDisabled"
                      type="button"
                      class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                      v-on:click="nextQuestion()">Continue</button>
                  </div>
                  <div class="ps-note pt-55"><a target="_blank" href="https://thread.zendesk.com/hc/en-us/articles/360031643471">How do I find my settings file and API token?</a></div>
                </div>
                <div class="remove-upload-file" v-if="showUploadReadOnlySection">
                  <div class="pt-70 clearfix">
                    <div class="up-title pb-5">Uploaded</div>
                    <div class="upload">
                      <div class="upload-area">
                        <div><i class="fa fa-file" aria-hidden="true"></i>{{settingFile.currentFile.displayName}}</div>
                      </div>
                      <div class="del-link" @click="showDeletetransaltionModal()">Remove</div>
                    </div>
                  </div>
                  <div class="form-group pt-100">
                    <button
                      type="button"
                      class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                      v-on:click="nextQuestion()">Continue</button>
                  </div>
                  <div class="ps-note pt-25"><a target="_blank" href="https://thread.zendesk.com/hc/en-us/articles/360031643471">How do I download a settings file?</a></div>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
            <b-modal ref="del-transaltion-modal" hide-footer hide-header>
              <div class="d-block text-center">
                <div class="title">Are you sure you want to remove this file?</div>
                <div class="btn-grp">
                  <button class="cancel-btn" @click="delTransaltion(false)">Cancel</button>
                  <button class="confirm-btn" @click="delTransaltion(true)">Yes</button>
                </div>
              </div>
            </b-modal>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 8">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title">{{questionsList[step].question}}</div>
                <div class="pb-20">Enter up to 6.</div>
                <div class="" v-for="answer in questionnaire.targetPatients">
                  <span class="icon-style" v-on:click="removeTargetPatients(answer)">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </span>
                  <span class="form-control select-style mt-10 pl-28 patient_population_readonly" required>{{answer}}</span>
                </div>
                <div class="form-group">
                  <div class="dropdown" v-on:keyup.stop.prevent="navigateDisease($event)" v-show="questionnaire.targetPatients.length < 6">
                    <input
                      class="form-control input-style dropdown-toggle"
                      type="text"
                      id="diseaseDropdown"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      v-if="patiantInput"
                      v-model="selected"
                      placeholder="Describe population"
                    />
                    <ul
                      class="dropdown-menu target-patients"
                      aria-labelledby="diseaseDropdown"
                      v-show="studySearchedDiseases.length !== 0 && selected.length !== 0"
                      :class="{show: studySearchedDiseases.length !== 0 && selected.length !== 0}"
                    >
                      <li v-for="(studyDisease, diseaseIndex) in studySearchedDiseases" :key="diseaseIndex">
                        <a
                          class="text-center cursor_pointer"
                          :class="{'navigate-dropdown': populationIndex === diseaseIndex }"
                          v-on:click.stop.prevent="selectedPatientPopulations(studyDisease)"
                          v-on:mouseover.stop.prevent="populationIndex = diseaseIndex"
                        >
                          <span :class="{'color-white': populationIndex === diseaseIndex }">{{studyDisease}}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="form-group">
                  <div class="link-style" v-if="questionnaire.targetPatients.length < 6">
                    <span class="cursor_pointer" v-on:click="selectedPatientPopulations(selected)" :class="{'disabled_input':errors.has('population')}">Add another participant population</span>
                  </div>
                </div>
                <div class="pt-10" v-if="showAlert">Please enter 6 participant population</div>
                <div class="mt-10 error_msg" v-if="showAlertOther">Please enter another participant population</div>
                <div class="pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25 br-25"
                    v-on:click="nextQuestion()" :class="{ 'disabledbtn' : addOption || questionnaire.targetPatients.length == 0 }">Continue</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 9">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">{{questionsList[step].question}}</div>
                <select class="form-control select-style" v-model="questionnaire.type" required>
                  <option value="default" disabled>-Select-</option>
                  <option v-for='option in questionsList[step].options' :value="option">{{option}}</option>
                </select>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click="nextQuestion()" :class="{ 'disabledbtn' : questionnaire.type === 'default' }" :disabled="questionnaire.type === 'default'">Continue</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pt-30">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 10">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">Will the study participants be invited to enroll in the study (Digital invitation) or can any participant
                  enroll directly by only passing self-reported inclusion/exclusion criteria within the study app (Open enrollment)?</div>
                <div v-for='option in questionsList[step].options'>
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 mt-10 br-25"
                    v-on:click="subTypeSelected(option, step)">{{option}}</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 11">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-20">{{questionsList[step].question}}</div>
                <div class="form-group">
                  <input type="text" v-validate="'required|numeric|max:6'" name="number-of-patients" :class="{'input': true, 'is-danger': errors.has('number-of-patients'), 'is-success': !errors.has('number-of-patients') }"
                    class="form-control input-style" v-model="questionnaire.expectedPatients" placeholder="Enter number" min="1"
                    required>
                  <span v-show="questionnaire.expectedPatients && errors.has('number-of-patients')" class="error-style">Please enter integers from 1 to 999999</span>
                </div>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click.prevent="nextQuestion()" :class="{ 'disabledbtn' : errors.has('number-of-patients') || !(questionnaire.expectedPatients) }">Continue</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pt-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 12">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-30">{{questionsList[step].question}}</div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="text-left">Study start date</div>
                    <div class="form-group">
                      <datepicker class="text-left" :disabledDates="disabledDates" input-class="datepicker-class form-control" placeholder="Select date"
                        v-model="questionnaire.studyStartDate" format="MM/dd/yy" name="studyStartDate" v-on:selected="calculateStartEndDuration(questionnaire)"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                      <span class="icon_style"></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="text-left">Study end date</div>
                    <div class="form-group">
                      <datepicker class="text-left" :disabledDates="disabledDates" input-class="datepicker-class form-control" placeholder="Select date"
                        v-model="questionnaire.studyEndDate" format="MM/dd/yy" name="studyEndDate" v-on:selected="calculateStartEndDuration(questionnaire)"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                      <span class="icon_style"></span>
                      <span class="days_number" v-if="questionnaire.studyStartDate && questionnaire.studyEndDate">
                         <span v-if="questionnaire.startEndDuration">{{questionnaire.startEndDuration}} Days</span>
                       </span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="text-left">First participant enrolled</div>
                    <div class="form-group">
                      <datepicker class="text-left" :disabledDates="disabledDates" input-class="datepicker-class form-control" placeholder="Select date"
                        v-model="questionnaire.firstPatientEnrollDate" v-on:selected="calculateWeeks(questionnaire)" format="MM/dd/yy"
                        name="firstPatientEnrollDate"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                      <span class="icon_style"></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="text-left">First participant's last day in the study</div>
                    <div class="form-group">
                      <datepicker class="text-left" :disabledDates="disabledDates" input-class="datepicker-class form-control" placeholder="Select date"
                        v-model="questionnaire.firstPatientLastDate" v-on:selected="calculateWeeks(questionnaire)" format="MM/dd/yy"
                        name="firstPatientLastDate"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                      <span class="icon_style"></span>
                      <span class="days_number" v-if="questionnaire.firstPatientEnrollDate && questionnaire.firstPatientLastDate">
                        <span v-if="questionnaire.studyDuration">{{questionnaire.studyDuration}} Days</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="row mt-10">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="text-left">Last participant enrolled</div>
                    <div class="form-group">
                      <datepicker class="text-left" :class="{ 'disabled_datepicker' : questionnaire.continuousStudy }" :disabledDates="disabledDates"
                        input-class="datepicker-class form-control" placeholder="Select date" v-model="questionnaire.lastPatientEnrollDate"
                        format="MM/dd/yy" v-on:selected="calculateLatPatientDuration(questionnaire)"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                      <span class="icon_style"></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="text-left">Last participant's last day in the study</div>
                    <div class="form-group">
                      <datepicker class="text-left" :class="{ 'disabled_datepicker' : questionnaire.continuousStudy }" :disabledDates="disabledDates"
                        input-class="datepicker-class form-control" placeholder="Select date" v-model="questionnaire.lastPatientLastDate"
                        format="MM/dd/yy" v-on:selected="calculateLatPatientDuration(questionnaire)"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                      <span class="icon_style"></span>
                      <span class="days_number" v-if="questionnaire.lastPatientEnrollDate && questionnaire.lastPatientLastDate">
                         <span v-if="questionnaire.lastPatientDuration">{{questionnaire.lastPatientDuration}} Days</span>
                       </span>
                    </div>
                  </div>
                </div>
                <div class="row text-left pl-15">
                  <div class="checkbox">
                    <label>
                      <input type="checkbox" v-model="questionnaire.continuousStudy" v-on:change="studyContinuousChanged(questionnaire.continuousStudy)">
                      <span class="pt-5"> Study is continuous</span>
                    </label>
                  </div>
                </div>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click="nextQuestion()" :class="{ 'disabledbtn' : (!questionnaire.continuousStudy && (!questionnaire.studyStartDate || !questionnaire.studyEndDate || !questionnaire.firstPatientEnrollDate || !questionnaire.firstPatientLastDate || !questionnaire.lastPatientEnrollDate || !questionnaire.lastPatientLastDate)) || (questionnaire.continuousStudy && (!questionnaire.studyStartDate || !questionnaire.studyEndDate || !questionnaire.firstPatientEnrollDate || !questionnaire.firstPatientLastDate))}">
                    Continue
                  </button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 13">
            <div class="panel-body panel-body-style col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title pb-10 fs-20">{{questionsList[step].question}}</div>
                <div class="question_title pb-20 fs-14">This is your schedule of events. No matter when a participant enrolls, they will follow the same milestone
                  cadence. You will be able to use these milestones later for scheduling tasks.</div>
                <div class="question_title fs-14">Participant consent occurs on Day 0. To create a milestone on the day of participant consent, please also
                  use Day 0.</div>
                <div class="question_title pb-20 fs-14 pl-20 pr-20">You may choose to name your milestone with a max 18 character length.</div>
                <div class="row">
                  <div class="position col-lg-4 col-md-4 col-sm-4 col-xs-6  pb-20" v-for="(milestone, index) in questionnaire.milestonesList">
                    <div class="p-0 pt-6 fs-14 text-left">Milestone {{index + 1}}</div>
                    <div class="milestone-wrap">
                      <div class="top-wrapper">
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 pr-0 pl-0">
                          <span class="span-block day_text">Name</span>
                        </div>
                        <div class="col-lg-8 col-md-6 col-sm-6 col-xs-6 p-0">
                          <input type="text" class="border-none form-control milestone_number" v-model.trim="questionnaire.milestonesList[index].milestoneName" v-bind:placeholder="'Milestone '+ (index+1)"
                            required>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 pr-0 pl-0">
                        <span class="span-block day_text">Day</span>
                      </div>
                      <div class="col-lg-8 col-md-6 col-sm-6 col-xs-6 p-0">
                        <input type="number" class="border-none form-control milestone_number" v-model.number="questionnaire.milestonesList[index].milestoneDay" placeholder="0"
                          min="0" required>
                      </div>
                    </div>
                    <span class="remove-icon-style" v-on:click="removeMilestone(milestone, index)" v-if="milestone.showRemoveIcon">
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                    <div class="row text-left">
                      <div class="checkbox pl-2 pt-5">
                        <label>
                          <input type="checkbox" class="Box" v-model="milestone.isDoNotShowTimeline">
                        </label>
                      </div>
                        <span class="Do-not-show-on-timeline">Do not show on timeline</span>
                    </div>
                  </div>
                </div>
                <div class="link-style pb-20 another_link">
                  <span class="cursor_pointer" v-on:click="addMilestone()">Add another milestone</span>
                </div>
                <div class="form-group pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-6 col-xs-offset-3 br-25"
                    v-on:click="nextQuestion()" :class="{ 'disabledbtn' : questionnaire.milestonesList.length < 1 }" :disabled="questionnaire.milestonesList.length < 1">Continue</button>
                </div>
                <div class="link-style clearfix">
                  <span class="cursor_pointer" v-on:click="dontSetupMilestones()"> I do not want to set up milestones</span>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 trigger-section" v-if="step === 14">
            <div class="text-align-center question_title pb-20 pt-50 fs-20 text-center">{{questionsList[step].question}}</div>
            <div class="question_title pb-20 text-center fs-14">The Site Team determines when to start the study activities for each participant.</div>
            <div class="fs-14 text-center description">If enabled, all participants in the study will not start their schedule of events/activities until manually triggered by the Site
            Team from the Portal. The participant will also receive a manual start notification  to confirm on their device before viewing
            or beginning any activities. Documents can be sent/signed and on-demand Telehealth Virtual Visits can be initiated by the
            Site Team prior to manually starting study activities.</div>
            <b-form-radio-group class="fs-14 text-center pt-25 pb-30" v-model="questionnaire.isManualStudyStart" :options="participantTriggerOptions"></b-form-radio-group>
            <div class="fs-14 text-center">Day 0 can be used to send instructional or baseline activites to your participants.</div>
            <div class="form-group pt-40 text-center">
              <button type="button" class="btn btn-md btn-info btn-style col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-6 col-xs-offset-3 br-25"
                v-on:click="nextQuestion()">Continue</button>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="panel panel-default panel-style col-lg-8 col-md-8 col-sm-10 col-xs-10 br-2 " v-if="step === 15">
            <div class="panel-body panel-body-style col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <div class="">
                <div class="question_title">{{questionsList[step].question}}</div>
                <div class="pb-20"> Select all that apply.</div>
                <div class="row">
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-0">
                    <div class="panel panel-default no-border" v-on:click="selectApp('ios')">
                      <div v-if="!questionnaire.ios">
                        <div class="panel-body product-card">
                          <span class="icon-size">
                            <i class="fa fa-apple" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                      <div v-if="questionnaire.ios">
                        <div class="panel-body active-card">
                          <span class="active-icon">
                            <i class="fa fa-apple" aria-hidden="true"></i>
                          </span>
                          <span class="icon-top">
                            <i class="fa fa-check-circle fd" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <h5>iOS App</h5>
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <div class="panel panel-default no-border" v-on:click="selectApp('android')">
                      <div v-if="!questionnaire.android">
                        <div class="panel-body product-card">
                          <span class="icon-size">
                            <i class="fa fa-android" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                      <div v-if="questionnaire.android">
                        <div class="panel-body active-card">
                          <span class="active-icon">
                            <i class="fa fa-android" aria-hidden="true"></i>
                          </span>
                          <span class="icon-top">
                            <i class="fa fa-check-circle fd" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <h5>Android App</h5>
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <div class="panel panel-default no-border" v-on:click="selectApp('web')">
                      <div v-if="!questionnaire.web">
                        <div class="panel-body product-card">
                          <span class="icon-size">
                            <img class="web-app-img" src="../../../public/static/img/participant-web-img/web-grey-icon.svg" />
                          </span>
                          <!-- <button type="button" class="btn btn-coming-soon">Coming Soon</button> -->
                        </div>
                      </div>
                      <div v-if="questionnaire.web">
                        <div class="panel-body active-card">
                          <span class="active-icon">
                            <!-- <i class="fa fa-desktop" aria-hidden="true"></i> -->
                            <img class="web-app-img" src="../../../public/static/img/participant-web-img/icn-web-app.png" />
                          </span>
                          <span class="icon-top">
                            <i class="fa fa-check-circle fd" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <h5 class="color_666669">Web App</h5>
                  </div>
                </div>
                <div class="pt-20">
                  <button type="button" class="btn btn-md btn-info btn-style col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 br-25"
                    v-on:click="nextQuestion()" :class="{ 'disabledbtn' : !questionnaire.android && !questionnaire.ios && !questionnaire.web }" :disabled="(!questionnaire.android && !questionnaire.ios && !questionnaire.web) || 
                    disableContinue">Continue</button>
                </div>
              </div>
            </div>
            <div class="clearfix fs-12 color_b8c7ce pb-10">
              <span class=" cursor_pointer back_btn" v-on:click="previousQuestion()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="pl-5 fs-14"> Back</span>
              </span>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="col-lg-2 col-md-2 col-sm-1 col-xs-1 pr-0 pl-40">
            <div class="panel panel-default panel-style side-bar" v-if="step !== 15">
              <div class="panel-body">
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="text-center clearfix pb-20">
        <span v-for="n in questionsList" v-if="n.show">
          <span v-if="n.index < step" class="fs-8 p-5 next-icon">
            <i class="fa fa-circle" aria-hidden="true"></i>
          </span>
        <span v-if="n.index === step" class="fs-10 p-5 pl-5 selected-icon">
            <i class="fa fa-circle" aria-hidden="true"></i>
          </span>
        <span v-if="n.index > step" class="fs-8 p-5 next-icon">
            <i class="fa fa-circle-o" aria-hidden="true"></i>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import 'vue-instant/dist/vue-instant.css';
import Datepicker from 'vuejs-datepicker';
import toastr from 'toastr';
import studyHeader from '../common/study-header';
import swal from 'sweetalert2';

export default {
  name: 'design',
  data() {
    return {
      swipe: {
        activeIndex: 0,
      },
      isContinueBtnDisabled: true,
      value: null,
      studyNameCopy: null,
      validStudyNameValue: false,
      suggestionAttribute: 'name',
      suggestions: [],
      studyId: null,
      disabledDates: {},
      disableContinue: false,
      selected: '',
      studySearchedDiseases: [],
      populationIndex: -1,
      studyDiseases: [],
      showUploadFileSection: true,
      applangaAccessToken: null,
      showUploadReadOnlySection: false,
      settingFile: {originalFile: {}, currentFile: {}},
      questionnaire: {
        clientId: 'default',
        name: null,
        support: null,
        countryList: [],
        targetPatients: [],
        type: 'default',
        subType: null,
        expectedPatients: null,
        studyStartDate: '',
        studyEndDate: '',
        firstPatientEnrollDate: '',
        firstPatientLastDate: '',
        lastPatientEnrollDate: '',
        lastPatientLastDate: '',
        startEndDuration: null,
        studyDuration: null,
        lastPatientDuration: null,
        continuousStudy: false,
        milestones: [],
        android: false,
        ios: false,
        web: false,
        description: null,
        language: [],
        milestonesList: [],
        isManualStudyStart: false
      },
      supportedCountries: [],
      selectedCountries: [],
      langObjNeedToBeDeleted: {lang: null, index: null},
      selLanguage: null,
      patiantInput: true,
      step: 0,
      questionsList: [
        { index: 0, show: true },
        { index: 1, question: 'Who is the sponsor for this study?', clients: [], show: true },
        { index: 2, question: 'What is the name of the study?', show: true },
        {
          index: 3,
          question: 'Would you like a THREAD expert to guide you through this process?',
          options: ['Sure, that would help', 'No thanks'],
          show: true,
        },
        { index: 4, show: true },
        {
          index: 5,
          question: 'What countries will this study be conducted in?',
          show: true,
        }, {
          index: 6,
          question: 'Would you like to add additional language(s) other than English (US)?',
          languages: [],
          show: true,
        }, {
          index: 7,
          question0: 'Enter the required information below to automatically translate your study content.',
          question1: 'Upload the settings file to automatically translate your study content',
          show: true
        },
        { index: 8, question: 'What is the target participant population(s)?', show: true },
        {
          index: 9,
          question: 'What type of study is this?',
          options: [
            'Phase 1 Clinical Trial',
            'Phase 2 Clinical Trial',
            'Phase 3 Clinical Trial',
            'Phase 4 Interventional Study',
            'Phase 4 Observational Study',
            'Registry',
            'Participant Community',
            'Pilot Project',
          ],
          show: true,
        },
        {
          index: 10,
          question:
            'Will the study participants be invited to enroll in the study (Digital invitation) or can any participant enroll directly by only passing self-reported inclusion/exclusion criteria within the study app (Open enrollment)?',
          type: 'button',
          options: ['Digital invitation', 'Open enrollment'],
          show: true,
        },
        { index: 11, question: 'What is the number of patients you expect to enroll?', show: true },
        { index: 12, question: 'What are your key study dates?', show: true },
        { index: 13, question: 'Identify study milestones.', show: true },
        { index: 14, question: 'Manually Start Study for Participants', show: true },
        { index: 15, question: 'What channels do you need?', show: true },
      ],
      addOption: true,
      showAlert: false,
      showAlertOther: false,
      answer: '',
      activeIcon: '<i class="fa fa-check-circle fd" aria-hidden="true"></i>',
      show: true,
      questionIndices: [],
      feedbackObj: {
        subject: '',
        description: '',
      },
      feedbackSent: false,
      participantTriggerOptions: [
        { text: 'Disable', value: false },
        { text: 'Enable', value: true }
      ],
    };
  },
  computed: {
    filteredStudyDieseases() {
      return this.filterBy(this.studyDiseases, this.selected);
    },
  },
  watch: {
    selected: {
      handler(val) {
        if (val) {
          window.$('.dropdown').addClass('open');
        }
      }
    },
    filteredStudyDieseases: {
      handler(val) {
        if (this.selected) {
          this.studySearchedDiseases = [];
          const arr = this.orderBy(val);
          arr.forEach((item, index) => {
            if (index <= 7) {
              this.studySearchedDiseases.push(item);
            }
          });
        }
      },
    },
    step(currentStep){
      let self = this;
      self.isContinueBtnDisabled = false;
      if(currentStep==5 && self.studyId && self.studyId!=0){
        self.isContinueBtnDisabled = true;
        self.$api.getLibraryFeaturesFact(self.studyId).then(response => {
          self.isContinueBtnDisabled = false;
          if (response.body) {
            let hasEdro = _.find(response.body.studyLibraryFeatures, { 'shortName': 'eDROs' });
            if(hasEdro===undefined){
              self.showAlert = false;
            }else{
              self.showAlert = true;
            }
          }
        });
      }
    },
    'questionnaire.milestonesList': {
      handler(val) {
        if(val == undefined || null) {
          return;
        }
        val.map((rec, index) => {
          if(index == 0) {
            return;
          }
          if(rec.milestoneName || (rec.milestoneDay!=null)) {
            rec.showRemoveIcon = true;
          } else {
            rec.showRemoveIcon = false;
          }
        })
      }, deep: true
    }
  },
  components: { studyHeader, datepicker: Datepicker },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.questionIndices = _.map(_.filter(this.questionsList, o => o.show), 'index'); // eslint-disable-line
    this.getAllClients();
    this.fetchSupportedCountries();
    this.getStudyDiseasesList();
    this.getTranslationFile();
    window.scrollTo(0, 0);
    const d = new Date(this.getExactDayEpoch(new Date()));
    d.setDate(d.getDate() - 1);
    this.disabledDates = { to: d };
    this.step = this.$route.query ?
      (this.$route.query.step != undefined ? Number(this.$route.query.step) : (window.localStorage.getItem('designIndex')) ? Number(window.localStorage.getItem('designIndex')) : this.step) :
      this.step;
    this.fetchSupportedLanguages();
    this.prepareMilestonesList();

  },
  methods: {
    prepareMilestonesList() {
      if(this.questionnaire.milestonesList.length == 0 || this.questionnaire.milestonesList == undefined) {
        this.questionnaire.milestonesList = new Array(6).fill(null).map(() => {
          return { sortOrder: 0, milestoneName: null, milestoneDay: null, displayName: null, showRemoveIcon: false};
        });
      }
    },
    checkForAccessToken() {
      if(this.applangaAccessToken == null || this.applangaAccessToken == "") {
         return;
       }
       if(this.applangaAccessToken.indexOf('!') == -1) {
         toastr.error("Invalid applanga access token");
         return;
       }
      this.questionnaire.language = response.body.language;
      this.showUploadReadOnlySection = (this.applangaAccessToken && this.settingFile.currentFile.file) ? true : false;
      this.showUploadFileSection = (this.applangaAccessToken && this.settingFile.currentFile.file) ? false : true ;
    },
    makeDefaultCountryDisabled(countries) {
      countries.map((c, index) => {
        if(c.isoCode3 == "USA") {
          c.isDisabled = true;
          this.selectedCountries.push(c);
          countries.splice(0, 0, c);
          countries.splice(index + 1, 1);
        } else {
          c.isDisabled = false;
        }
      });
      return countries;
    },
    fetchSupportedCountries() {
      let self = this;
      this.$api.getSupportedCountries().then(response => {
        if(response.body.length == 0) {
          return;
        }
        this.supportedCountries = this.makeDefaultCountryDisabled(response.body);
        this.getStudyDetails();
      }, error => {
         toastr.error("Error occurred while featching Countries.");
      });
    },
    fetchSupportedLanguages() {
      let self = this;
      this.$api.getSupportedClientLanguages().then(response => {
        if(response.body.length == 0) {
          return;
        }
        response.body.forEach((lang) => {
          // predefined index if in any case index change please also update this too.
          self.questionsList[6].languages.push(lang);
          // select english as defulat language
          if(self.studyId == 0) {
            if(lang.name.toLowerCase() == "english") {
              self.questionnaire.language.push(lang);
            }
          }
        });
      }, error => {
         toastr.error("Error occurred while featching languages.");
      });
    },
    getTranslationFile() {
      if(this.studyId == "0") {
        this.showUploadReadOnlySection = true;
        return;
      }
      let self = this;
      this.$api.getTranslationFile(this.studyId).then(response => {
        if(response.body.appPropertiesDocument == null) {
          this.showUploadFileSection = true;
          this.showUploadReadOnlySection = false;
          return;
        }
        self.settingFile.originalFile.name = "applanga_settings.applanga";
        self.settingFile.originalFile.displayName = "applanga_settings.applanga";
        self.settingFile.originalFile.s3Location = response.body.appPropertiesDocument.s3Location;
        self.settingFile.originalFile.documentURL = response.body.appPropertiesDocument.documentURL;
        self.settingFile.originalFile.documentId = response.body.appPropertiesDocument.documentId;
        self.settingFile.currentFile = { ...self.settingFile.originalFile };
        self.showUploadFileSection = false;
        self.showUploadReadOnlySection = true;
      }, error => {
        // no need to show anything
      });
    },
    getExactDayEpoch(day) {
      day = new Date(day); // eslint-disable-line
      return Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
    },
    validStudyName(studyNameVal) {
      const studyPattern = new RegExp(
        '^[a-zA-Z]{1}[ a-zA-Z0-9®!@#$%^&{}*)(+=.?_-]{0,48}[a-zA-Z0-9®!@#$%^&{}*)(+=.?_-]{1}$',
      );
      if (studyPattern.test(studyNameVal)) {
        this.validStudyNameValue = false;
      } else {
        this.validStudyNameValue = true;
      }
    },
    navigateDisease(e) {
      if (this.studySearchedDiseases.length === 0 && e.keyCode === 13) {
        this.selectedPatientPopulations(this.selected);
      } else {
        if (this.populationIndex < this.studySearchedDiseases.length - 1) {
          if (e.keyCode === 38) {
            if (this.populationIndex !== 0) {
              this.populationIndex -= 1;
            } else {
              this.populationIndex = 0;
            }
          } else if (e.keyCode === 40) {
            this.populationIndex += 1;
          }
          if (e.keyCode === 40) {
            this.populationIndex += 1;
          }
        } else if (e.keyCode === 38) {
          this.populationIndex -= 1;
        }
        if (e.keyCode === 13) {
          this.selected = '';
          this.selectedPatientPopulations(this.studySearchedDiseases[this.populationIndex]);
        }
      }
    },
    totalActiveLanguage() {
      let languageList = this.questionnaire.language.filter((lang) => {
        return lang.active == true;
      });
      return languageList.length == 1 ? true : false
    },
    getStudyDetails() {
      if (
        (this.studyId && this.studyId !== '0')
        || this.studyNameCopy !== this.questionnaire.name
      ) {
        // eslint-disable-line
        this.$api.getStudyDataFact(this.studyId).then(
          response => {
            this.questionnaire = response.body;
            this.studyNameCopy = this.questionnaire.name
              ? _.cloneDeep(this.questionnaire.name)
              : null; // eslint-disable-line
            this.addOption = false;
            if (this.questionnaire.studyStartDate) {
              this.questionnaire.studyStartDate = new Date(
                this.questionnaire.studyStartDate,
              ).toUTCString(); // eslint-disable-line
              this.questionnaire.studyEndDate = new Date(
                this.questionnaire.studyEndDate,
              ).toUTCString(); // eslint-disable-line
              this.questionnaire.firstPatientEnrollDate = new Date(
                this.questionnaire.firstPatientEnrollDate,
              ).toUTCString(); // eslint-disable-line
              this.questionnaire.firstPatientLastDate = new Date(
                this.questionnaire.firstPatientLastDate,
              ).toUTCString(); // eslint-disable-line
              this.questionnaire.lastPatientEnrollDate = this.questionnaire.lastPatientEnrollDate
                ? new Date(this.questionnaire.lastPatientEnrollDate).toUTCString()
                : ''; // eslint-disable-line
              this.questionnaire.lastPatientLastDate = this.questionnaire.lastPatientLastDate
                ? new Date(this.questionnaire.lastPatientLastDate).toUTCString()
                : ''; // eslint-disable-line
            }
            this.supportedCountries.map(c => {
              response.body.countryList.map(saveCountry => {
                if(saveCountry.isoCode3 == c.isoCode3 && saveCountry.isoCode3 != 'USA') {
                  this.selectedCountries.push(c);
                }
              });
            });
            this.questionnaire.language = response.body.language;
            this.showUploadReadOnlySection = (this.questionnaire.language && this.questionnaire.language.length > 1) ? true : false;
            let defaultLang = null;
            this.questionnaire.language.map((lang, index) => {
              if(lang.language_culture == 'EN' && index != 0) {
                this.questionnaire.language.splice(index, 1);
                defaultLang = lang;
              }
            });
            this.questionnaire.language = _.orderBy(this.questionnaire.language, 'name');
            if(defaultLang != null) {
              this.questionnaire.language.splice(0, 0, defaultLang);
            }
            this.calculateStartEndDuration(this.questionnaire);
            this.calculateLatPatientDuration(this.questionnaire);
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while getting the study details',
            );
          },
        );
      }
    },
    getStudyDiseasesList() {
      this.$api.getStudyDiseasesFact().then(
        response => {
          response.body.forEach(item => {
            this.studyDiseases.push(item.name);
          });
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the study details',
          );
        },
      );
    },
    studyContinuousChanged(val) {
      this.questionnaire.lastPatientEnrollDate = '';
      this.questionnaire.lastPatientLastDate = '';
      this.questionnaire.continuousStudy = val;
    },
    dontSetupMilestones() {
      this.questionnaire.milestonesList = [];
      this.step = this.step + 1;
    },
    createNewStudy(studyData) {
      const newStudyData = { ...studyData };
      this.disableContinue = true;
      newStudyData.studyStartDate = new Date(
        this.getExactDayEpoch(newStudyData.studyStartDate),
      ).toUTCString(); // eslint-disable-line
      newStudyData.studyEndDate = new Date(
        this.getExactDayEpoch(newStudyData.studyEndDate),
      ).toUTCString(); // eslint-disable-line
      newStudyData.firstPatientEnrollDate = new Date(
        this.getExactDayEpoch(newStudyData.firstPatientEnrollDate),
      ).toUTCString(); // eslint-disable-line
      newStudyData.firstPatientLastDate = new Date(
        this.getExactDayEpoch(newStudyData.firstPatientLastDate),
      ).toUTCString(); // eslint-disable-line
      newStudyData.lastPatientEnrollDate = newStudyData.lastPatientEnrollDate
        ? new Date(this.getExactDayEpoch(newStudyData.lastPatientEnrollDate)).toUTCString()
        : ''; // eslint-disable-line
      newStudyData.lastPatientLastDate = newStudyData.lastPatientLastDate
        ? new Date(this.getExactDayEpoch(newStudyData.lastPatientLastDate)).toUTCString()
        : ''; // eslint-disable-line
      newStudyData.countries = [{name: "United States of America", language: "US English"}];
      newStudyData.milestones = [];
      newStudyData.milestonesList.map((mile, index) => {
        newStudyData.milestones[index] = mile.milestoneDay;
      });
      for(let i = 0; i < this.questionnaire.countryList.length; i++) {
        let flag = true;
        for(let j = 0; j < this.selectedCountries.length; j++) {
          if(this.selectedCountries[j].countryId == this.questionnaire.countryList[i].countryId) {
            flag = false;
            continue;
          }
        }
        if(flag) {
          this.questionnaire.countryList[i].active = false;
          this.selectedCountries.push(this.questionnaire.countryList[i]);
        }
       }
      newStudyData.countryList = this.selectedCountries;
      let self = this;
      this.$api.postNewStudyDataFact(newStudyData).then(
        response => {
          if (response.body.web === true && response.body.android === false && response.body.ios === false) {
            this.$router.push({
              name: "dashboard",
              params: { studyId: response.body.studyId }
            });
            return;
          } 
          else {
          window.localStorage.removeItem('designIndex');
          self.studyId = response.body.studyId;
          if(newStudyData.language.length <= 1 || self.settingFile.currentFile.file == null) {
            this.$router.push({
              name: 'study-build-progress',
              params: { studyId: response.body.studyId },
            });
            return;
          }
          // upload file if needed.
          let fileObj = self.settingFile.currentFile.file ? self.settingFile.currentFile.file : self.settingFile.originalFile.file;
          let documentId = self.settingFile.currentFile.documentId ? self.settingFile.currentFile.documentId : self.settingFile.originalFile.documentId;
          const fd = new FormData();
          fd.append('fileName', fileObj);
          fd.append('applangaAccessToken', self.applangaAccessToken);
          fd.append('isActive', self.totalActiveLanguage() ? false : true);
          this.$api.updateSettingsFile(this.studyId, fd, documentId).then(
            response => {
              this.$router.push({
                name: 'study-build-progress',
                params: { studyId: self.studyId },
              });
            },
            error => {
              toastr.error(
                error.body
                  ? error.body.message
                  : 'Error while uploading the transaltion file',
              );
            },
          );}
          // upload file section done
        },
        error => {
          this.disableContinue = false;
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while creating new study',
          );
        },
          );
    },
    getAllClients() {
      this.$api.getAllClientsFact().then(response => {
        this.questionsList[1].clients = response.body;
      });
    },
    calculateNextOrPrevStep(order) {
      this.settingFile.currentFile.displayName = this.settingFile.currentFile.displayName ? this.settingFile.currentFile.displayName : this.settingFile.currentFile.name;
      this.showUploadFileSection = this.settingFile.currentFile.displayName ? false : true;
      this.showUploadReadOnlySection = this.settingFile.currentFile.displayName ? true : false;
      let step = (order == "increment") ? (this.totalActiveLanguage() == 1 ? this.step + 1 : this.step) : (this.totalActiveLanguage() == 1 ? this.step - 1 : this.step);
      return step;
    },
    nextQuestion() {
      let sd;
      let ed;
      let fpfd;
      let fpld;
      let lpfd;
      let lpld;
      let milestoneArr;
      let invalidValues = false; // eslint-disable-line
      switch (this.step) {
        case 2:
          if (
            !this.studyId
            || this.studyId === '0'
            || this.studyNameCopy !== this.questionnaire.name
          ) {
            this.$api.checkNewStudyNameValidityFact({ studyName: this.questionnaire.name }).then(
              () => {
                this.step = this.getStepNumber(this.step);
              },
              error => {
                toastr.error(
                  error.body ? error.body.message : 'Error while checking the study name validity',
                );
              },
            );
          } else {
            this.step = this.getStepNumber(this.step);
          }
          break;
        case 4:
          if (this.questionnaire.countryList.length > 0) {
            this.addOption = false;
          }
          this.step = this.getStepNumber(this.step);
          break;
        case 6:
          if(this.showAlert){
            //Find the count of the active languages
            let activeLanguages = _.filter(this.questionnaire.language, ['active', true]);
            if(activeLanguages.length>1){
              toastr.error('Pease remove eDros from the study inorder to make this study as multilingual.');
            return;
            }
          }

          if (this.questionnaire.targetPatients.length > 0) {
            this.addOption = false;
          } else {
            this.addOption = true;
          }

          this.step = this.calculateNextOrPrevStep("increment");
          this.step = this.getStepNumber(this.step);

          break;
        case 9:
          if (
            ['Phase 2 Clinical Trial', 'Phase 3 Clinical Trial'].indexOf(this.questionnaire.type)
            >= 0
          ) {
            this.step = this.getStepNumber(this.step);
          }
          this.step = this.getStepNumber(this.step);
          this.selected = '';
          break;
        case 11:
          this.step = this.getStepNumber(this.step);
          break;
        case 12:
          sd = this.getExactDayEpoch(this.questionnaire.studyStartDate);
          ed = this.getExactDayEpoch(this.questionnaire.studyEndDate);
          fpfd = this.getExactDayEpoch(this.questionnaire.firstPatientEnrollDate);
          fpld = this.getExactDayEpoch(this.questionnaire.firstPatientLastDate);
          lpfd = this.getExactDayEpoch(this.questionnaire.lastPatientEnrollDate);
          lpld = this.getExactDayEpoch(this.questionnaire.lastPatientLastDate);
          if (
            (this.questionnaire.continuousStudy && (sd <= fpfd && fpfd < fpld && fpld <= ed))
            || (!this.questionnaire.continuousStudy
              && (sd <= fpfd
                && fpfd < fpld
                && fpld < ed
                && sd < lpfd
                && fpfd < lpfd
                && lpfd < lpld
                && lpld <= ed))
          ) {
            // eslint-disable-line
            this.step = this.getStepNumber(this.step);
            this.addOption = true;
            this.selected = '';
          } else if (!this.questionnaire.continuousStudy) {
            // eslint-disable-line
            if (sd > fpfd) {
              toastr.error('First patient first date cannot be prior to start date.');
            } else if (fpfd > fpld) {
              toastr.error('First patient last day cannot be prior to first patient first day.');
            } else if (fpfd >= lpfd || lpfd >= fpld) {
              toastr.error(
                'Last patient first day should be between first patient first day and first patient last date',
              );
            } else if (sd > fpfd || fpfd > fpld || fpld >= ed || lpld > ed) {
              // eslint-disable-line
              toastr.error(
                'Enrolment and participation in the Study must be scheduled within its duration.',
              );
            } else if (lpfd > lpld) {
              toastr.error('Last patient last day should be greater than last patient first day.');
            } else if (lpfd === lpld) {
              toastr.error('Last patient first day cannot be the same as last patient last day.');
            } else if (fpfd === fpld) {
              toastr.error('First patient first day cannot be the same as first patient last day.');
            }
          } else if (this.questionnaire.continuousStudy) {
            // eslint-disable-line
            if (sd > fpfd) {
              // eslint-disable-line
              toastr.error('First patient first date cannot be prior to start date.');
            } else if (fpfd > fpld) {
              toastr.error('First patient last day cannot be prior to first patient first day.');
            } else if (sd > fpfd || fpfd > fpld || fpld > ed) {
              toastr.error(
                'Enrolment and participation in the Study must be scheduled within its duration.',
              );
            } else if (fpfd === fpld) {
              toastr.error('First patient first day cannot be the same as first patient last day.');
            }
          }
          break;
        case 13:
          milestoneArr = this.questionnaire.milestonesList.filter((milestone, index) => {
            return (milestone.milestoneDay != null && milestone.milestoneDay != "") || milestone.milestoneDay === 0;
          })
          let allFieldsFilled = milestoneArr.filter((milestone, index) => {
            return milestone.milestoneDay == null;
          });
          if(allFieldsFilled.length > 0) {
            toastr.error('Please fill complete milestone details');
            return;
          }
          if(milestoneArr.length > 0) {
            let milestoneDays = _.map(milestoneArr, 'milestoneDay');
            let milestoneName = _.map(milestoneArr, 'milestoneName');
            let hasNegativeValues = milestoneDays.filter((rec, index) => {
              return rec && (rec % 1 !== 0 || rec < 0);
            });
            if(hasNegativeValues.length > 0) {
              toastr.error('Milestones values should start from 0 and cannot have decimals');
              return;
            }
            if(_.uniq(milestoneDays).length !== milestoneArr.length) {
              toastr.error('Milestones cannot have the same value');
              return;
            }

            // milestone name should have max 18 char
            if(milestoneName) {
              let names = milestoneName.filter((name, index) => {
                return (name != null && name != "");
              })
              if(_.uniq(names).length !== names.length) {
                toastr.error('Milestones cannot have the same name');
                return;
              }
              let isExceedMaxChar = names.filter((name) => {
                return name != null && name != "" && name.length > 18;
              });
              if(isExceedMaxChar.length > 0) {
                toastr.error("Milestone name must be no longer than 18 characters.");
                return;
              }
            }
            if(this.questionnaire.studyDuration <= _.max(milestoneDays)) {
              toastr.error("This milestone is outside of study's duration");
              return;
            }
            // refresh the all milestone details
            milestoneArr.map((rec, index) => {
              rec.milestoneName = (rec.milestoneName == null || rec.milestoneName == "") ? "Milestone " + (index+1) : rec.milestoneName;
              rec.sortOrder = index;
              rec.displayName = rec.milestoneName;
            });
            this.questionnaire.milestonesList = milestoneArr;
            this.step = this.getStepNumber(this.step);
          } else {
            toastr.error(
              "Please set up your Study's milestones or click 'I do not want to set up milestones' to continue.",
            );
          }
          break;
        case 15:
          this.createNewStudy(this.questionnaire);
          console.log("questions", this.questionnaire)
          break;
        default:
          this.step = this.getStepNumber(this.step);
          if (!this.studyId) {
            this.addOption = true;
            this.selected = '';
          }
          break;
      }
    },
    previousQuestion() {
      switch (this.step) {
        case 5:
          if (!this.questionnaire.support) {
            this.step = this.step - 1;
          }
          this.step = this.step - 1;
          break;
        case 8:
          this.addOption = false;
          this.step = this.step - 1;
          this.step = this.calculateNextOrPrevStep("decrement");
          break;
        case 9:
          this.addOption = false;
          this.step = this.step - 1;
          break;
        case 11:
          if (
            ['Phase 2 Clinical Trial', 'Phase 3 Clinical Trial'].indexOf(this.questionnaire.type)
            >= 0
          ) {
            this.step = this.step - 1;
          }
          this.step = this.step - 1;
          break;
        default:
          this.step = this.step - 1;
          break;
      }
    },
    getStepNumber(step) {
      let nextStep = step;
      nextStep += 1;
      if (this.questionIndices.indexOf(nextStep) < 0) {
        nextStep += 1;
        if (this.questionIndices.indexOf(nextStep) < 0) {
          nextStep += 1;
        }
      }
      return nextStep;
    },
    addOptions() {
      if (this.step === 8 && this.questionnaire.targetPatients.length <= 7) {
        this.addOption = true;
        this.showAlert = false;
      } else if (this.step !== 9) {
        this.addOption = true;
        this.showAlert = false;
      }
    },
    selectedLanguage(selected) {
      let langPresent = null;
      langPresent = this.questionnaire.language.length > 0 && this.questionnaire.language.filter((lang) => {
        return lang.name.toLowerCase() === selected.name.toLowerCase() && lang.active != false
      })
      if(langPresent == null || langPresent.length == 0) {
        if(selected.active == false) {
          selected.active = true;
          this.selLanguage = null;
          return;
        }
        this.questionnaire.language.push(selected);
        this.selLanguage = null;
        return;
      }
      toastr.error(selected.name + ' is already selected. Please choose another language');
      this.selLanguage = null;
    },
    saveUploadFileOnLocal(event) {
      const input = window.document.getElementById('upload-file-input');
       // eslint-disable-line
      if(input.files[0] == null || input.files[0] == undefined ) {
        toastr.error("Please upload translation file")
        return;
      }
      this.settingFile.currentFile = {
        file: input.files[0],
        name: input.files[0].name,
        displayName: input.files[0].name,
        documentId: this.settingFile.currentFile.documentId ? this.settingFile.currentFile.documentId : null
      };
      event.target.value = null;
      this.showUploadReadOnlySection = (this.settingFile.currentFile.file && this.applangaAccessToken) ? true : false;
      this.showUploadFileSection = (this.settingFile.currentFile.file && this.applangaAccessToken) ? false : true;
    },
    showRemoveLanguageModal(lang, index) {
      this.langObjNeedToBeDeleted.lang = lang;
      this.langObjNeedToBeDeleted.index  = index;
      this.$refs['remove-language-modal'].show()
    },
    removeLanguage(status) {
      if(!status) {
        this.$refs['remove-language-modal'].hide();
        return;
      }
      this.$refs['remove-language-modal'].hide();
      this.questionnaire.language[this.langObjNeedToBeDeleted.index].active = false;
      toastr.success(
        "Language has been removed.",
      );
    },
    showDeletetransaltionModal() {
      this.$refs['del-transaltion-modal'].show();
    },
    delTransaltion(status) {
      this.$refs['del-transaltion-modal'].hide();
      if(!status) {
        return
      }
      this.settingFile.currentFile.displayName = null;
      this.settingFile.currentFile.file = null;
      this.showUploadFileSection = true;
      this.showUploadReadOnlySection = false;
      this.applangaAccessToken = null;
      toastr.success(
        "File has been removed.",
      );
    },
    removeTargetPatients(selectedPatient) {
      const index = this.questionnaire.targetPatients.indexOf(selectedPatient);
      this.questionnaire.targetPatients.splice(index, 1);
      this.showAlert = false;
    },
    selectedPatientPopulations(val) {
      if (val) {
        if (this.questionnaire.targetPatients.indexOf(val) < 0) {
          this.questionnaire.targetPatients.push(val);
          this.selected = '';
          this.studySearchedDiseases = [];
          this.populationIndex = -1;
          this.showAlertOther = false;
          this.addOption = false;
          this.patiantInput = false;
        } else {
          this.showAlertOther = true;
        }
      } else {
        this.addOption = false;
        this.patiantInput = this.questionnaire.targetPatients.length < 6;
      }
      // this.addOptions();
    },
    buttonSelected(value, step) {
      switch (step) {
        case 3:
          if (this.questionnaire.countryList && this.questionnaire.countryList.length > 0) {
            this.addOption = false;
          }
          if (value === 'No thanks') {
            this.step = this.getStepNumber(this.step);
            this.questionnaire.support = false;
          } else {
            this.questionnaire.support = true;
          }
          break;
        case 8:
          this.questionnaire.subType = value;
          break;
        default:
          break;
      }
      this.step = this.getStepNumber(this.step);
    },
    addMilestone() {
      this.questionnaire.milestonesList.push({
        sortOrder: 0,
        milestoneName: null,
        milestoneDay: null,
        displayName: null
      });
    },
    removeMilestone(selected, index) {
      this.questionnaire.milestonesList.splice(index, 1);
      this.$forceUpdate();
    },
    subTypeSelected(val, step) {
      this.questionnaire.subType = val;
      this.step = step + 1;
    },
    calculateStartEndDuration(questionnaire) {
      setTimeout(() => {
        if (questionnaire.studyStartDate && questionnaire.studyEndDate) {
          const sed = +this.getExactDayEpoch(questionnaire.studyEndDate);
          const ssd = +this.getExactDayEpoch(questionnaire.studyStartDate);
          this.questionnaire.startEndDuration = Math.ceil((sed - ssd) / 1000 / 86400); // eslint-disable-line
        }
        this.$forceUpdate();
      }, 10);
    },
    calculateWeeks(questionnaire) {
      setTimeout(() => {
        if (questionnaire.firstPatientEnrollDate && questionnaire.firstPatientLastDate) {
          const fpld = +this.getExactDayEpoch(questionnaire.firstPatientLastDate);
          const fped = +this.getExactDayEpoch(questionnaire.firstPatientEnrollDate);
          this.questionnaire.studyDuration = Math.ceil((fpld - fped) / 1000 / 86400);
        }
        this.$forceUpdate();
      }, 10);
    },
    calculateLatPatientDuration(questionnaire) {
      setTimeout(() => {
        if (questionnaire.lastPatientEnrollDate && questionnaire.lastPatientLastDate) {
          const lpld = +this.getExactDayEpoch(questionnaire.lastPatientLastDate);
          const lped = +this.getExactDayEpoch(questionnaire.lastPatientEnrollDate);
          this.questionnaire.lastPatientDuration = Math.ceil((lpld - lped) / 1000 / 86400);
        }
        this.$forceUpdate();
      }, 10);
    },
    studyDates() {
      if (this.questionnaire.continuousStudy) {
        this.questionnaire.lastPatientEnrollDate = '';
        this.questionnaire.lastPatientLastDate = '';
      }
      this.$forceUpdate();
    },
    selectApp(app) {
      console.log("app data", app);
      if (app === 'ios') {
        this.questionnaire.ios = !this.questionnaire.ios;
      } else if (app === 'android') {
        this.questionnaire.android = !this.questionnaire.android;
      }
      else if (app === 'web') {
        this.questionnaire.web = !this.questionnaire.web;
      }
    },
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

.btn {
  font-size: 14px;
}
/deep/ .custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  background-image: url(/static/img/right.png);
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
.access-token-wrap {
  width: 50%;
  margin: 0 auto;
}
.countries-wrap {
  padding-top: 27px;
  padding-bottom: 35px;
}
.set-full-width {
  min-width: 75%;
}
.country-group {
  text-align: left;
  width: 630px;
  margin: 0 auto;
}
.round {
  display: inline-block;
  width: 22px;
  background-color: #1e8fe1;
  height: 22px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 12px;
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 2px;
}
.display-inline {
  display: inline-block;
}
.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.col-lg-offset-2 {
  margin-left: 16.66666667%;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.selected-lang {
  text-align: left;
  float: left;
}
.remove-selected {
  text-align: right;
  cursor: pointer;
  color: #f16a5e;
}
.ps-note {
  font-size: 12px;
  color: #1e8fe1;
  cursor: pointer;
  a {
    color: #1e8fe1 !important;
  }
}
.remove-upload-file {
  padding: 0px 20px;
}
.up-title {
  text-align: left;
}
.upload-wrap {
  padding: 3px;
  border: 1px solid #1e8fe1;
  display: table;
  color: #1e8fe1;
  border-radius: 5px;
  width: 180px;
  text-align: center;
  display: inline-block;
  margin: 0px;
  height: 29px;
  font-size: 13px;
}
.api-input {
  height: 29px;
  width: 180px;
}

.api-input::placeholder { /* Firefox, Chrome, Opera */ 
  color: #495057 !important; 
} 

.api-input:-ms-input-placeholder { /* Internet Explorer 10-11 */ 
  color: #495057 !important; 
} 

.api-input::-ms-input-placeholder { /* Microsoft Edge */ 
  color: #495057 !important; 
} 


.upload-properties {
  display: none;
}
.upload-area {
  float: left;
  text-align: left;
}
.del-link {
  float: right;
  font-size: 12px;
  color: #f16a5e;
  cursor: pointer;
}
.fa {
  padding-right: 5px;
}
.fa-file:before {
  color: #4c8ce4;
}
.modal-body {
  .title {
    padding: 15px 15px 20px;
    font-weight: 600;
    &.no-padding {
      padding-bottom: 0px;
    }
  }
  .description {
    padding: 0px 22px 20px;
  }
  .btn-grp {
    padding-bottom: 20px;
    button {
      padding: 5px 25px;
      border-radius: 5px;
      margin-right: 15px;
    }
    .confirm-btn {
      background-color: #1e8fe1;
      border: 1px solid #1e8fe1;
      color: #ffffff;
      padding: 5px 35px;
    }
    .cancel-btn {
      background: transparent;
      border: 1px solid #b0bac9;
    }
  }
}
/deep/.custom-checkbox .custom-control-label::before {
  width: 17px;
  height: 17px;
  border-radius: 2px;
}
/deep/ .custom-control-inline {
  min-width: 135px;
  margin-right: 20px;
}
/deep/ .custom-control-label {
  padding-top: 1.8px
}
/deep/ .custom-control-label::after {
  position: absolute;
  top: 0.25rem;
  left: 0px;
  display: block;
  width: 1rem;
  height: 1rem;
  content: "";
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 72% 72%;
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
    //flex: none;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .navbar-toggler {
    display: none;
  }
  .navbar-right {
    float: right !important;

    .navbar-nav {
      flex-direction: row;
    }

    li {
      float: left;
    }
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
  .col-md-12 {
    width: 100%;
  }
  .col-md-10 {
    width: 83.33333333%;
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
    //flex: none;
    display: block;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.has-header {
  margin-top: 53px;
  padding-top: 100px;
}

.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
  color: grey;
  background-color: #fff;
}

.dropdown-menu > li > a {
  color: grey !important;
  padding: 5px 0px 5px 0px;
}

.target-patients {
  width: 100%;
}
.target-patients a {
  display: block;
}

.navigate-dropdown {
  background-color: #34537d !important;
  color: #fff !important;
}

.feedbackStyle {
  z-index: 99;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px 0px;
  text-align: right;
  height: 60px;
}

.oval {
  padding: 18px 14px;
  background-color: #ffffff;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 25px;
}

.day_text {
  background-color: #f5f8fa;
}
.milestone-wrap {
  border: 1px solid #d3dee3;
  overflow: hidden;
  .top-wrapper {
    border-bottom: 1px solid #d3dee3;
    overflow: hidden;
  }
  .border-none {
    border-top: none;
    border-bottom: none;
    border-left: 1px solid #ced4da;
    border-right: 1px solid #ced4da;
  }
  .border-none:focus {
    box-shadow: none;
  }
}
.span-block {
  display: inline-block;
  width: 100%;
  padding: 6px;
  border-right: 1px solid #d3dee3;
}
.milestone_number {
  border-radius: 0px;
}
.img-size {
  width: 25px;
  height: 25px;
}

.patient_population_readonly {
  word-break: break-all;
  height: inherit;
  margin-bottom: 10px;
}

.container-style {
  width: 100%;
  max-width: inherit;
}

.btn {
  height: 37px;
}

.bg-color {
  background-color: #f5f8fa;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
}

.panel-style {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.error_msg {
  background-color: #f5f8fa;
  padding: 10px;
}

.active-background {
  background-color: #195877 !important;
}

.btn-style {
  background-color: #4c8ce4 !important;
  display: inline-block;
  float: none;
  margin: 0;
}
.another_link {
  text-align: left !important;
  padding-left: 16px;
}
.disabledbtn {
  background-color: #d3dfe4 !important;
  pointer-events: none;
  border: #d3dfe4 !important;
}

.form-control {
  overflow: hidden;
}

.icon_style {
  position: absolute;
  height: 33px;
  display: inline-block;
  border-left: 1px solid #ddd;
  top: 21px;
  right: 16px;
  background-color: rgba(85, 85, 85, 0.05);
  width: 35px;
  pointer-events: none;
}

.panel-body-style {
  float: none;
  padding: 50px 0px;
  text-align: center;
  margin: 0 auto;
}

.back_btn {
  position: absolute;
  bottom: 12px;
}

.link-style {
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  color: #1f95f2;
}

.icon-style {
  position: absolute;
  left: 12px;
  padding-top: 6px;
}

.cal-icon-style {
  position: absolute;
  top: 26px;
  right: 26px;
  cursor: pointer;
  color: #d3dfe4;
  pointer-events: none;
}
.position {
  position: relative;
}

.remove-icon-style {
  position: absolute;
  color: #b8c7ce;
  display: block;
  top: 50px;
  right: -10px;
  cursor: pointer;
}

.days_number {
  position: absolute;
  right: -50px;
  top: 25px;
  font-size: 12px;
  padding: 2px 4px;
  font-weight: 500;
  border-radius: 2px;
  background-color: #68666b;
  border-color: dfe8f5;
  color: #fff;
}

.no-border {
  border: none;
  box-shadow: none;
  text-align: center;
}

.product-card {
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 20px 0px;
  border-radius: 8px;
  max-width: 115px;
  margin: auto;
  width: 100%;
}

.icon-size {
  font-size: 50px;
  color: #959fa4;
}

.active-card {
  background-color: #4c8ce4;
  border: 1px solid #4c8ce4;
  padding: 20px 0px;
  border-radius: 8px;
  max-width: 115px;
  margin: auto;
  width: 100%;
  position: relative;
}

.active-icon {
  font-size: 50px;
  color: #f5f8fa;
}

.icon-top {
  font-size: 35px;
  color: #71e991;
  position: absolute;
  top: -20px;
  right: -12px;
  background-color: white;
  border-radius: 50%;
  height: 38px;
}

.question_title {
  font-size: 16px;
  color: #666769;
  /*padding-bottom: 10px;*/
}

.cov-datepicker {
  width: 100%;
}

/* Enter and leave animations can use different */

/* durations and timing functions.              */

.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-leave-active {
  transition: none;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.side-bar {
  height: 300px;
  opacity: 0.8;
  border-radius: 4px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: none !important;
}

.next-icon {
  color: #d3dfe4;
}

.selected-icon {
  color: #4c8ce4;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}

.btn-coming-soon {
  position: absolute;
  top: -7px;
  right: 0px;
  font-size: 10px;
  padding: 0px;
  height: 22px;
  width: 85px;
  background-color: #7478e6;
  color: #ffffff;
  cursor: default;
  border-radius: 25px;
}

.disabled_datepicker {
  pointer-events: none;
  opacity: 0.5;
  .datepicker-class {
    background-color: #eee !important;
  }
}

.disabled_input {
  color: #838e93;
  pointer-events: none;
}

.milestone_number {
  text-align: center;
}

.patient_text {
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 12px !important;
}
.hidden {
  display: none !important;
}

@media (max-width: 575px) {
}

@media (min-width: 576px) and (max-width: 767px) {
}

@media (min-width: 768px) and (max-width: 991px) {
  .container-width {
    width: 700px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .container-width {
    width: 890px;
  }
}

@media (min-width: 1200px) {
  .container-width {
    width: 1090px;
  }
}

.edro-warning a{
  color: inherit !important;
  font-weight: bold;
}
</style>
<style scoped lang="scss" src="@/assets/design-screen.scss"></style>
