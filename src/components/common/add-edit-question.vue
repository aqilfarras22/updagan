<template>
  <div v-if="addEditQuestion" class="add_edit_question_card">
    <div class="p-0">
      <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 p-0">
          <select
            class="form-control type_select"
            v-model="addEditQuestion.type"
            v-on:change="questionTypeChanged(addEditQuestion)"
          >
            <option
              v-for="questionType in questionTypes"
              :value="questionType.value"
              :disabled="questionType.value === 'Default'"
              :selected="questionType.value === 'Default'"
            >{{questionType.label}}</option>
          </select>
        </div>
        <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'gpskin'" class="col-lg-9 col-md-8 col-sm-12 col-xs-12 p-0">
          <div class="example gpskin-example-link mt-8" data-toggle="modal" data-target="#gpSkinScreenExampleModal">gpskin screen example</div>
        </div>
      </div>
      <div class v-if="addEditQuestion.type !== 'Default'">
        <div
          class="options_section"
          v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() !== 'surveyinstruction' && addEditQuestion.type.toLowerCase() !== 'gpskin'"
        >
          <!--MultiChoice type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'multichoice'"
            class="multi_choice_type"
          >
            <div class>
              <label class>
                <input
                  type="checkbox"
                  v-model="addEditQuestion.multipleSelection"
                  name="multipleSelection"
                >
                <span class>Allow users to select more than one answer</span>
              </label>
            </div>
            <div class>
              <label class>
                <input type="checkbox" v-model="addEditQuestion.hasBodyImage" name="hasBodyImage">
                <span class>Include an image in the question</span>
              </label>
            </div>
          </div>
          <!--MultiChoice type question END-->

          <!--Image type question START-->
          <div v-if="addEditQuestion.type === 'Image'" class="multi_choice_type">
            <div class>
              <label class>
                <input
                  type="checkbox"
                  v-model="addEditQuestion.multipleSelection"
                  name="multipleSelection"
                >
                <span class>Allow users to select more than one answer</span>
              </label>
            </div>
          </div>
          <!--Image type question END

          <!--Boolean type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'boolean'"
            class="boolean_choice_type"
          ></div>
          <!--Boolean type question START-->

          <!--Number Scale type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'numberscale'"
            class="scale_choice_type"
          >
            <div class>
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.verticalScale" name="verticalScale"/>
                <span class="">Vertical scale (scale is horizontal by default)</span>
              </label>
            </div>
            <!--<div class="">
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.reportable" name="reportable"/>
                <span class="">Display data as a dashboard for participants </span>
              </label>
            </div>-->
          </div>
          <!--Number Scale type question END-->

          <!--Custom Scale type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'customscale'"
            class="scale_choice_type"
          >
            <div class>
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.verticalScale" name="verticalScale"/>
                <span class="">Vertical scale (scale is horizontal by default)</span>
              </label>
            </div>
            <!--<div class="">
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.reportable" name="reportable"/>
                <span class="">Display data as a dashboard for participants (Due to limited space in dashboards, consider shorter labels names if selected)</span>
              </label>
            </div>-->
          </div>
          <!--Custom Scale type question END-->

          <!--Text type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'text'"
            class="text_choice_type"
          >
            <label class="fw-normal">
              <input
                type="checkbox"
                v-model="addEditQuestion.characterLimited"
                name="characterLimited"
              >
              <span class="position_relative">
                Character limit
                <input
                  type="number"
                  class="form-control form-control-sm input-style limit_text_input"
                  v-model="addEditQuestion.textLimit"
                  placeholder
                  min="1"
                  max="512"
                  :disabled="!addEditQuestion.characterLimited"
                  v-on:input="validateCharacterLimit(addEditQuestion.textLimit)"
                >
              </span>
            </label>
          </div>
          <!--Text type question END-->

          <!--Number type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'number'"
            class="number_choice_type"
          >
            <!--<label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.characterLimited" name="characterLimited"/>
              <span class="position_relative">Character limit <input type="number" class="form-control form-control-sm input-style limit_text_input" v-model="addEditQuestion.textLimit" placeholder="" min="1" max="2048" :disabled="!addEditQuestion.characterLimited"></span>
            </label>-->
            <label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.hasUnits" name="hasUnits">
              <span class="position_relative">
                Answer label
                <input
                  type="text"
                  class="form-control form-control-sm input-style limit_text_input answer_label_text_input"
                  placeholder="ex. mins, lbs, days"
                  v-model="addEditQuestion.units"
                  :disabled="!addEditQuestion.hasUnits"
                >
              </span>
            </label>
            <label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.hasMinMax" name="subType">
              <span class="position_relative">
                Min/max value
                <input
                  type="number"
                  class="form-control form-control-sm input-style limit_text_input min_value_input"
                  v-model="addEditQuestion.minValue"
                  placeholder="min"
                  min="1"
                  max="2048"
                  :disabled="!addEditQuestion.hasMinMax"
                >
                <span class="min_max_to_text">to</span>
                <input
                  type="number"
                  class="form-control form-control-sm input-style limit_text_input max_value_input"
                  v-model="addEditQuestion.maxValue"
                  placeholder="max"
                  min="1"
                  max="2048"
                  :disabled="!addEditQuestion.hasMinMax"
                >
              </span>
            </label>
            <label class="fw-normal display-block">
              <input
                type="checkbox"
                v-model="addEditQuestion.allowDecimals"
                value="Single"
                name="subType"
              >
              <span class="position_relative">Allow decimals</span>
            </label>
          </div>
          <!--Number type question END-->

          <!--DateTime type question START-->
          <div
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'datetime'"
            class="date_time_type"
          >
            <div class="radio radio-style m-0">
              <label class="pl-0">
                <input type="checkbox" v-model="addEditQuestion.showDate">
                <span>Date</span>
              </label>
              <label class>
                <input
                  type="radio"
                  v-model="addEditQuestion.dateFormat"
                  value="mm/dd/yy"
                  :disabled="!addEditQuestion.showDate"
                > mm/dd/yy
              </label>
              <label class>
                <input
                  type="radio"
                  v-model="addEditQuestion.dateFormat"
                  value="dd/mm/yy"
                  :disabled="!addEditQuestion.showDate"
                > dd/mm/yy
              </label>
              <!--<label class=""><input type="radio" v-model="addEditQuestion.dateFormat" value="yy/mm/dd" :disabled="!addEditQuestion.showDate"> yy/mm/dd</label>-->
            </div>
            <div class="radio radio-style m-0">
              <label class="pl-0">
                <input type="checkbox" v-model="addEditQuestion.showTime">
                <span>Time</span>
              </label>
              <label class>
                <input
                  type="radio"
                  v-model="addEditQuestion.timeFormat"
                  value="12"
                  :disabled="!addEditQuestion.showTime"
                > AM/PM
              </label>
              <label class>
                <input
                  type="radio"
                  v-model="addEditQuestion.timeFormat"
                  value="24"
                  :disabled="!addEditQuestion.showTime"
                > 24 HR
              </label>
            </div>
          </div>
          <!--DateTime type question END-->
          <div>
            <label
              class="fw-normal"
              v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'imagecapture'"
            >
              <input type="checkbox" v-model="addEditQuestion.guideParticipant">
              <span class>Guide participant using a template image during photo capture.</span>
            </label>
          </div>
          <label
            class="fw-normal"
            v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() !== 'surveyinstruction'"
          >
            <input type="checkbox" v-model="addEditQuestion.isSkippable">
            <span class>Participant is allowed to skip this question</span>
          </label>
          <div class>
            <label class>
              <input
                type="checkbox"
                v-model="addEditQuestion.isNotifyToEmail"
                v-on:click="toggleNotifyToEmail(addEditQuestion.isNotifyToEmail)"
                class="toggle-checkbox"
              >
              <span
                class="email-label"
              >Flag question and participant answer to be included in recipient email.</span>
            </label>
            <span
              class="fa fa-info-circle info-circle"
              aria-hidden="true"
              @click="toggleInfoDiv()"
              @blur="hidePopup()"
              tabindex="-1"
            ></span>
            <div
              class="info-circle-div"
              v-show="infoDiv"
            >When a participant completes this survey, flagged survey questions and the results will be emailed to one or more recipients.</div>
          </div>

          <!--------------------Checkbox for using english languages images option for other langugaes ----------------- -->
          <div v-if="addEditQuestion.type === 'Image' && studyData.language.length>1" class="use-english-img">
            <label>
              <input
                type="checkbox"
                v-model="addEditQuestion.useEnglishImageAnswer"
                class="toggle-checkbox"
                @change="toggleUseEnglishImageAnswerCheckbox()"
              >
              <span>Use English image answer choices for all languages.</span>
            </label>
            <span
              class="fa fa-info-circle info-circle"
              aria-hidden="true"
              @click="toggleEnglishImageInfoDiv()"
              @blur=" toggleEnglishImageInfoDiv(true)"
              tabindex="-1"
            ></span>
            <div class="info-circle-div " v-show="useEnglishImageInfoDiv" >Leaving this box unchecked will require separate image sets to be uploaded for each additional language.</div>
          </div>
          <!-- -------------------- Languages Images ends here  --------------- -->

        </div>
      </div>
    </div>
    <div
      class="pt-10 pb-10 clearfix"
      v-if="addEditQuestion.type && addEditQuestion.type !== 'Default' && addEditQuestion.type.toLowerCase() !== 'surveyinstruction' && addEditQuestion.type.toLowerCase() !== 'gpskin' && addEditQuestion.type.toLowerCase() !== 'imagecapture'"
    >
      <h5>Question</h5>
      <div>
        <!-- <input type="text" class="form-control" placeholder="Enter your question" v-model="addEditQuestion.body" :disabled="addEditQuestion.type === 'Default'"> -->
        <quill-editor
          class="bg-white"
          v-model="addEditQuestion.formattedBody"
          :disabled="addEditQuestion.type === 'Default'"
          :options="editorOptionForQuestion"
        ></quill-editor>
      </div>
      <div
        v-if="addEditQuestion.hasBodyImage"
        class
        v-for="bodyImageoption in addEditQuestion.bodyImages"
      >
        <div class="col-lg-2 pl-0 pr-20" v-if="addEditQuestion.bodyImages.length==!0">
          <img class="img_size mar-top15" :src="bodyImageoption.imageUrl">
        </div>
        <div class="col-lg-3 col-md-3 file_container">
          <span class="file_container_text upload_btn">Upload</span>
          <input
            type="file"
            :id="'file_upload_' + bodyImageoption.sequence"
            class="form-control-file"
            @change="uploadBodyImage($event, bodyImageoption, 'file_upload_' + bodyImageoption.sequence);return false;"
          >
          <a
            class="color_red cursor_pointer fs-12 pt-10 remove_upload_option"
            v-if="addEditQuestion.bodyImages.length!==0"
            v-on:click="deleteImageBodyQuestion(bodyImageoption)"
          >Remove</a>
          <span
            class
            v-if="addEditQuestion.bodyImages.length==0"
          >Large images will automatically resize to fit the width of the phone</span>
        </div>
      </div>
    </div>

    <!--MultiChoice type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'multichoice'" class>
      <h5>Answers</h5>
      <div class="row form-group" v-for="(option, index) in addEditQuestion.options">
        <div v-if="option.enabled !== false">
        <div class="col-sm-10 p-0">
          <quill-editor
            class="bg-white"
            v-model="option.formattedBody"
            :options="editorOptionForAnswers"
            v-on:input="validateAnswerLimit(option.formattedBody)"
          ></quill-editor>
        </div>
        <div class="col-sm-2 p-0">
          <button
            class="btn btn-link color_red"
            v-on:click="deleteQuestionOptionItem(addEditQuestion.options, index)"
            v-if="index > 1"
          >Remove</button>
        </div>
        </div>
      </div>
      <div class="add_another_answer">
        <a v-on:click="addAnotherAnswer()">Add another answer</a>
      </div>
    </div>
    <!--MultiChoice type question END-->

    <!--Image type question starts-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'image'">
      <div class="row">
        <div class="col-md-6 pl-0 pr-0 mb-25" :class="Math.ceil(loopIndex % 2)==0?'clearfix':''" v-for="(langOptionobj, loopIndex) in addEditQuestion.languageImageOptions" :key="loopIndex">
          <h5>
            <span v-if="loopIndex==0">Answer choices</span>
            <span v-if="languagesString"> ({{languagesString}})</span>
            <span v-else-if="loopIndex==0"> ({{langOptionobj.languageName}})</span>
            <span v-else> {{langOptionobj.languageName}}</span>
          </h5>
          <div class="form-group clearfix" v-for="(option, optionIndex) in langOptionobj.options" ::key="optionIndex">
            <div v-if="option.enabled !== false">
            <div class="col-md-2 pl-0 pr-20" v-if="option.imageUrl">
              <img class="img_size" :src="option.imageUrl">
            </div>
            <div class="col-md-4 file_container">
              <span class="file_container_text">Upload Image</span>
              <input
                type="file"
                class="form-control-file language-img-file"
                :id="'file_upload_' + langOptionobj.languageId + '_' + option.sequence"
                @change="uploadOptionImage(loopIndex, optionIndex);return false;"
              >
              <a
                class="color_red cursor_pointer fs-12 mt-10 d-block"
                v-if="option.imageId"
                v-on:click="deleteImageQuestionOption(loopIndex, optionIndex)"
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </a>
            </div>
            <div class="col-md-6 text-style">Upload a photo answer choice</div>
            </div>
          </div>    
          <div class="add_another_answer">
            <!-- v-if="addAnotherImgAnswerStatus.includes(langOptionobj.languageId) || langOptionobj.languageName.toLowerCase()=='english' "-->
            <a v-on:click="addAnotherImageAnswer(loopIndex)">Add another answer</a>
          </div>
        </div>
      </div>
    </div>
    <!--Image type question END-->

    <!--Boolean type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'boolean'" class>
      <h5>Answer choices</h5>
      <div class="pt-20">
        <div class="form-group p-0">
          <div class>{{addEditQuestion.options[0].body}}</div>
        </div>
        <div class="form-group padding-top">
          <div class="p-0">{{addEditQuestion.options[1].body}}</div>
        </div>
      </div>
    </div>
    <!--Boolean type question END-->

    <!--Number Scale type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'numberscale'">
        <div class="row form-group pt-10">
        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2 pl-0">
        Intervals
        </div>
        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2 p-0">
          <input type="number" class="form-control input-style" min="1" max="13" v-model="addEditQuestion.intervals">
        </div>
        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2 p-0">
          <span class="fa fa-info-circle info-circle pl-10 pt-10" aria-hidden="true" @click="toggleIntervalInfo()" @blur="hideIntervalInfo()" tabindex="-1"></span> <div class="info-circle-div interval-info-div" v-show="intervalInfoDiv">The difference between the maximum value and minimum value should be divisible by the intervals value. If it is not divisible, a non-segmented scale will be used with values increasing by 1.</div>
        </div>
        </div>
        <div class="row form-group">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0">
        <h5>Scale Values</h5>
        <div class="row form-group pt-3">
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-0">
        Minimum
        </div>
        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 p-0">
          <input type="number" class="form-control input-style" placeholder="Enter minimum value" min="-10000" max="10000" v-model="addEditQuestion.minValue">
        </div>
        </div>
        
       <div class="row form-group pt-3">
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-0">
        Maximum
        </div>
        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 p-0">
          <input type="number" class="form-control input-style" placeholder="Enter maximum value" max="10000" v-model="addEditQuestion.maxValue">
        </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <span class="scale-info">Scale Labels</span>
        <span class="fa fa-info-circle info-circle pl-10" aria-hidden="true" @click="toggleScaleInfo()" @blur="hideScaleInfo()" tabindex="-1"></span> <div class="info-circle-div scale-info-div" v-show="scaleInfoDiv">Minimum label displayed left. Maximum label displayed right. If Vertical scale checked Minimum label displayed bottom. Maximum label displayed top.</div>
        <div class="row form-group pt-10">
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-0">
          <span>Label</span>
        </div>
        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 p-0">
          <input type="text" class="form-control input-style" placeholder="Enter minimum label" maxlength="25" v-model="addEditQuestion.minValueLabel">
        </div>
        </div>
        
       <div class="row form-group pt-10">
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pl-0">
          <span>Label</span>
        </div>
        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 p-0">
          <input type="text" class="form-control input-style" placeholder="Enter maximum label" maxlength="25" v-model="addEditQuestion.maxValueLabel">
        </div>
        </div>
      </div>
      </div>
      <div class="clear"></div>
    </div>
    <!--Number Scale type question END-->

    <!--User Scale type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'customscale'">
      <h5>Scale labels</h5>
      <div class="row form-group">
        <div class="col-lg-1 pl-0 pt-5">Intervals</div>
        <div class="col-lg-1 p-0">
          <input
            type="number"
            class="form-control"
            min="2"
            max="8"
            v-model="addEditQuestion.intervals"
            v-on:change="changeLabelsLength(addEditQuestion.intervals)"
          >
        </div>
        <span
          class="col-lg-8 pt-5"
          v-if="addEditQuestion.reportable"
        >Max of 8 intervals can be entered when dashboard graph option is selected.</span>
      </div>
      <div v-if="addEditQuestion.intervals > 0">
        <div class="row form-group" v-for="(value, index) in addEditQuestion.formattedLabels">
          <div v-if="index === 0">
            <div class="col-lg-1 mt-5">
              <span v-if="addEditQuestion.verticalScale">Top</span>
              <span v-if="!addEditQuestion.verticalScale">Right</span>
            </div>
            <div class="col-lg-11 p-0">
              <quill-editor
                class="bg-white"
                v-model="addEditQuestion.formattedLabels[addEditQuestion.formattedLabels.length - index - 1]"
                :options="editorOptionForLabels"
                v-on:blur="validateLabels(addEditQuestion.formattedLabels.length - index - 1)"
              ></quill-editor>
              <span
                v-if="validLabels.includes(addEditQuestion.formattedLabels.length - index - 1)"
                class="error-style"
              >Labels cannot exceed 16 characters in length</span>
            </div>
          </div>
          <div v-else-if="addEditQuestion.formattedLabels && (index === addEditQuestion.formattedLabels.length - 1)">
            <div class="col-lg-1 mt-5">
              <span v-if="addEditQuestion.verticalScale">Bottom</span>
              <span v-if="!addEditQuestion.verticalScale">Left</span>
            </div>
            <div class="col-lg-11 p-0">
              <quill-editor
                class="bg-white"
                :options="editorOptionForLabels"
                v-on:blur="validateLabels(addEditQuestion.formattedLabels.length - index - 1)"
                v-model="addEditQuestion.formattedLabels[addEditQuestion.formattedLabels.length - index - 1]"
              ></quill-editor>
              <span
                v-if="validLabels.includes(addEditQuestion.formattedLabels.length - index - 1)"
                class="error-style"
              >Labels cannot exceed 16 characters in length</span>
            </div>
          </div>
          <div
            v-if="addEditQuestion.formattedLabels && index !== 0 && (index !== addEditQuestion.formattedLabels.length - 1)"
          >
            <div class="col-lg-1"></div>
            <div class="col-lg-11 p-0">
              <quill-editor
                class="bg-white"
                v-model="addEditQuestion.formattedLabels[addEditQuestion.formattedLabels.length - index - 1]"
                :options="editorOptionForLabels"
                v-on:blur="validateLabels(addEditQuestion.formattedLabels.length - index - 1)"
                v-if="!addEditQuestion.reportable"
              ></quill-editor>
              <quill-editor
                class="bg-white"
                v-model="addEditQuestion.formattedLabels[addEditQuestion.formattedLabels.length - index - 1]"
                :options="editorOptionForLabels"
                v-on:blur="validateLabels(addEditQuestion.formattedLabels.length - index - 1)"
                v-if="addEditQuestion.reportable"
              ></quill-editor>
              <span
                v-if="validLabels.includes(addEditQuestion.formattedLabels.length - index - 1)"
                class="error-style"
              >Labels cannot exceed 16 characters in length</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--User Scale type question END-->

    <!--DateTime type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'datetime'"></div>
    <!--DateTime type question END-->

    <!--Instruction START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'surveyinstruction'">
      <div class="pt-20">
        <div class="mb-15">
          <span class="example" @click="openInstructionModal()">Instruction screen example</span>
        </div>
        <div class>Screen title</div>
        <!-- <input type="text" class="form-control input-style br-2" placeholder="Enter title" v-model="addEditQuestion.title"> -->
        <quill-editor
          class="bg-white"
          v-model="addEditQuestion.formattedTitle"
          :options="editorOptionForInstruction"
        ></quill-editor>
      </div>
      <div class="pt-20">
        <div class>Screen content</div>
        <quill-editor
          class="instruction-screen bg-white"
          ref="privacyPolicyEditor"
          v-model="addEditQuestion.formattedInformation"
          :options="editorOption"
        ></quill-editor>
      </div>
      <div class="row pt-20">
        <div class="pb-10">Image:</div>
        <div class="row">
          <div class="col-lg-2 pl-0 pr-20" v-if="addEditQuestion.imageUrl">
            <img class="img_size" :src="addEditQuestion.imageUrl">
          </div>
          <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 p-0">
            <div class="file_container1">
              <span class="file_container_text1">Upload</span>
              <input
                type="file"
                class="form-control-file"
                id="file_upload"
                @change="uploadInstructionImage(false)"
              >
            </div>
          </div>
          <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10 p-0">
            <span class="pt-10 display-block color_898989">Recommended: 390px by 390px</span>
          </div>
        </div>
      </div>
    </div>

    <!--Instruction END-->

    <!--Gp Skin Question Starts here-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'gpskin'">
      <div class="pt-20">
        <div class>Screen title <span class="gp-help-text ml-15">80 character limit</span></div>
        <quill-editor
          class="bg-white"
          v-model="addEditQuestion.formattedTitle"
          :options="editorOptionForQuestion"
          v-on:input="characterLimitValidation(addEditQuestion.formattedTitle, charLimit80)"
        ></quill-editor>
      </div>
      <div class="pt-20">
        <div class>Screen content <span class="gp-help-text ml-15">Recommended character limit is 500. If you go beyond 750 characters, you might experience formatting issues.</span></div>
        <quill-editor
          class="instruction-screen bg-white"
          ref="privacyPolicyEditor"
          v-model="addEditQuestion.formattedInformation"
          :options="editorOption"
        ></quill-editor>
      </div>
      <div class="row pt-20">
        <div class="pb-10">Image:</div>
        <div class="row">
          <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 pl-0 pr-20">
            <img v-if="addEditQuestion.imageUrl" class="img_size" :src="addEditQuestion.imageUrl">
            <span class="text-center img-placeholder" v-else>
              Accepted formats: <br>
              .png
            </span>
          </div>
          <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 p-0">
            <div class="file_container1">
              <span class="file_container_text1">Upload</span>
              <input
                type="file"
                class="form-control-file"
                id="file_upload"
                @change="uploadInstructionImage(false)"
              >
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 p-0">
            <span class="pt-10 display-block color_898989">
              <ul>
                <li>Accepted formats: .png</li>
                <li>max dimensions: 2048px x 2048px</li>
                <li>min dimensions: 1080px x 1080px</li>
                <li>Large images will automatically resize to fit the width of the phone</li>
                <li>Image will automatically center</li>
                <li>Image will be placed below screen content</li>
                <li>Only one image can be uploaded</li>
              </ul>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--Gp Skin Question Ends here -->

    <!--Image capture Question Starts here-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'imagecapture'">
      <div class="link-text pt-10" data-toggle="modal" data-target="#instructionScreenExampleModal">Instruction screen example</div>
      <div class="pt-5">
        <div class>Screen title</div>
        <quill-editor
          class="bg-white"
          v-model="addEditQuestion.formattedTitle"
          :options="editorOptionForimageCaptureTitle"
          v-on:input="characterLimitValidation(addEditQuestion.formattedTitle, charLimit80)"
        ></quill-editor>
      </div>
      <div class="pt-20">
        <div class>Screen content</div>
        <quill-editor
          class="instruction-screen bg-white"
          ref="privacyPolicyEditor"
          v-model="addEditQuestion.formattedInformation"
          :options="editorOptionForimageCaptureScreen"
        ></quill-editor>
      </div>
      <div class="row">
        <div class="col-md-6 col-lg-6">
          <div class="row pt-20">
            <div class="pb-10">Image:</div>
            <div class="row">
              <div v-if="addEditQuestion.imageUrl" class="custom-image-pixels col-xs-12 col-sm-2 col-md-4 col-lg-4 pl-0">
                <img class="img_size" :src="addEditQuestion.imageUrl">
              </div>
              <div class="col-xs-12 col-sm-2 col-md-3 col-lg-3 p-0">
                <div class="file_container1">
                  <span class="file_container_text1">Upload</span>
                  <input
                    type="file"
                    class="form-control-file"
                    id="file_upload"
                    @change="uploadInstructionImage(false)"
                  >
                </div>
              </div>
              <div class="col-xs-12 col-sm-2 col-md-5 col-lg-5 mt-8"><span class="instruction">Recommended: 390px x 390px</span></div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-6" v-show="addEditQuestion.guideParticipant">
          <div class="row pt-20">
            <div class="pb-10">Template image:</div>
            <div class="row">
              <div v-if="addEditQuestion.templateImageUrl" class="custom-image-pixels position-relative col-xs-12 col-sm-2 col-md-4 col-lg-3 pl-0">
                <img class="img_size" :src="addEditQuestion.templateImageUrl">
                <a class="position-absolute color_red cursor_pointer fs-15 mt-10 d-block" v-if="addEditQuestion.templateImageUrl"
                  v-on:click="deleteTemplateImage()">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </a>
              </div>
              <div class="col-xs-12 col-sm-2 col-md-3 col-lg-3 p-0">
                <div class="file_container1">
                  <span class="file_container_text1">Upload</span>
                  <input
                    type="file"
                    class="form-control-file"
                    id="template_file_upload"
                    @change="uploadInstructionImage(true)"
                  >
                </div>
                <div class="link-text" data-toggle="modal" data-target="#imageCpatureExampleModal">Template guide example</div>
              </div>
              <div class="col-md-1 col-lg-1"><div class="mt-10 ml-3">Or</div></div>
              <div class="col-xs-12 col-sm-2 col-md-4 col-lg-4 p-0">
                <div class="file_container1">
                  <button class="selectLibrary" data-toggle="modal" data-target="#myModal" v-on:click="getLogosFromLibrary(1)">
                    <span class="color_grey">Select from a library</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Image Capture Question Ends here -->
    <!-- image capture lbraryr modal-->
    <div id="myModal" class="modal fade" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content modal_custom col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-30 pb-30 pr-30 pl-30">
          <div class="row">
            <a class="cancelImage cursor_pointer" v-on:click="cancelImages"><i class="fa fa-times" aria-hidden="true"></i></a>
          </div>
          <div class="fs-28 text-center modal_header_color fw-200">Template Image Library</div>
          <p class="modal_desc text-center">Choose an image</p>
          <div class="row pt-20">
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0" v-for="(i, index) in logos" v-on:click="selectLogo(i,  index)">
              <div class="library_img_bg" :class="{'selected_icon_logo_image' : i.name === selectedTemplateImageIcon.name}">
                <img class="img-responsive icon" :src="i.preSignedURL">
              </div>
            </div>
          </div>
          <div class="row text-center pt-20" v-if="totalPages > 1">
            <span class="paginate" v-if="currentPage !== 1" v-on:click="getLogosFromLibrary(currentPage - 1)"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
            <span class="paginate" :class="{active: currentPage === pageIndex + 1 }" v-for="(page, pageIndex) in totalPages" v-on:click="getLogosFromLibrary(pageIndex + 1)">{{pageIndex + 1}}</span>
            <span class="paginate" v-if="currentPage !== totalPages" v-on:click="getLogosFromLibrary(currentPage + 1)"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
          </div>
          <div class="row pt-40 pb-10 text-center">
            <button class="btn btn-info btn-block text-center color_ff br-25 library_add_btn" v-on:click="addImage()" :disabled="!selectedTemplateImageIcon || !selectedTemplateImageIcon.preSignedURL">Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
    <div class="row pt-10">
      <div class="col-lg-4 p-0">
        <button
          class="btn btn-link color_red pl-0"
          v-on:click="deleteQuestion(addEditQuestion)"
          :disabled="addEditQuestion.type === 'Default'"
          v-if="addEditQuestion.id"
        >
          <img src="static/img/delete.svg">
        </button>
      </div>
      <div class="col-lg-offset-4 col-lg-4 text-right p-0" style="white-space:nowrap; float:right;">
        <button
          class="btn btn-link br-25"
          v-on:click="cancelQuestion()"
          :disabled="allQuestions && allQuestions.length === 0"
        >Cancel</button>
        <button
          class="btn btn-success save_btn br-25"
          v-on:click="saveQuestion()"
          :disabled="addEditQuestion.type === 'Default'"
        >Save</button>
      </div>
    </div>
    <div id="instructionModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content pt-15 pb-30 pl-30 pr-15">
          <div>
            <i class="fa fa-times cancelImage" aria-hidden="true" @click="closeModal()"></i>
          </div>
          <div class="pr-15 pt-20">
            <img src="static/img/graphic-instruction-example.png">
          </div>
        </div>
      </div>
    </div>
    <div id="gpSkinScreenExampleModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content pt-15 pb-30 pl-30 pr-15">
          <div>
            <i class="fa fa-times cancelImage" aria-hidden="true" data-dismiss="modal" ></i>
          </div>
          <div class="pr-15 pt-20">
            <img src="static/img/skin-health-activity/gpSkinExampleScreen.png">
          </div>
        </div>
      </div>
    </div>
    <div id="imageCpatureExampleModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-sm">
        <!-- Modal content-->
        <div class="modal-content pt-15 pb-30 pl-30 pr-15">
          <div>
            <i class="fa fa-times cancelImage" aria-hidden="true" data-dismiss="modal" ></i>
          </div>
          <div class="pr-15 pt-20">
            <div class="modal-heading-text">This is a sample of an image template used to guide participants.</div>
            <div class="img-border"><img class="img-fluid" src="static/img/template-example.png"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="instructionScreenExampleModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-sm">
        <!-- Modal content-->
        <div class="modal-content pt-15 pb-30 pl-30 pr-15">
          <div>
            <i class="fa fa-times cancelImage" aria-hidden="true" data-dismiss="modal" ></i>
          </div>
          <div class="pr-15 pt-20">
            <div class="img-border"><img class="img-fluid" src="static/img/empty-example.png"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import swal from "sweetalert2";
import sampleQuestionObj from "../survey-builder/surveyQuestion.json";
export default {
  name: "add-edit-questions",
  data() {
    return {
      infoDiv: false,
      scaleInfoDiv: false,
      intervalInfoDiv: false,
      surveyDetails: null,
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
      validLabels: [],
      addEditQuestion: this.options,
      allQuestions: null,
      bodyImages: [],
      editorOption: {
        placeholder: "Enter content for this topic",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["link"],
            ["video"]
          ]
        }
      },
      editorOptionForAnswers: {
        placeholder: "Enter answer choice",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForLabels: {
        placeholder: "Enter Value",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForQuestion: {
        placeholder: "Enter question",
        modules: {
          toolbar: [["bold", "italic", "underline"], ["link"]]
        }
      },
      editorOptionForInstruction: {
        placeholder: "Enter screen title",
        modules: {
          toolbar: [["bold", "italic", "underline"], ["link"]]
        }
      },
      editorOptionForimageCaptureTitle: {
        placeholder: "Enter Title",
        modules: {
          toolbar: [["bold", "italic", "underline"], ["link"]]
        }
      },
      editorOptionForimageCaptureScreen: {
        placeholder: "Enter content for this topic",
        modules: {
          toolbar: [["bold", "italic", "underline"], ["link"], ["video"]]
        }
      },
      notValidLimit : false,
      notValidInterval : false,
      notUniqueOptions : false,
      notValidCharLimit : false,
      charLimit80: 80,
      charLimitErrTxt: null,
      toggleFeatures: null,
      useEnglishImageInfoDiv: false,
      languagesString: null,
      //addAnotherImgAnswerStatus: [],
      errorMsg: null,
      modal: '',
      currentPage: null,
      totalPages: null,
      logos: null,
      selectedTemplateImageIconIndex: null,
      selectedTemplateImageIcon: '',
    };
  },
  props: ["options", "studyData"],
  computed: {
    questionSaveUpdateChanged() {
      return this.$store.getters.getNewQuestion;
    },
    surveyDetailsChanged() {
      return this.$store.getters.getSurveyDetails;
    }
  },
  watch: {
    surveyDetailsChanged: {
      handler(val) {
        this.surveyDetails = val;
      }
    },
    toggleFeatures(features){
      let isGpSkinEnabled = _.findIndex(features, { 'featureName': 'GPSkin', 'enabled': true });
      if(isGpSkinEnabled>=0 && !this.surveyDetails.watchEnabled ){
        if (this.surveyType == undefined)
          this.questionTypes.push({ value: "GPSkin", label: "gpskin Barrier device scan" });
      }
    }   
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.surveyType = this.$route.params.surveyType;
    this.surveyDetails = this.$store.getters.getSurveyDetails;
    
    if (this.surveyDetails.watchEnabled) {
      var that = this;
      var localArray = that.questionTypes;
      if (this.surveyType == "EPRO") {
        const itemToRemove = ["CustomScale", "Image", "NumberScale", "Number"];
      } else {
        const itemToRemove = ["CustomScale", "Image", "NumberScale", "Number", "GPSkin"];
      }
      that.questionTypes.forEach(function(item) {
        if (itemToRemove.includes(item.value)) {
          localArray = localArray.filter(val => val.value != item.value);
        }
      });
      that.questionTypes = localArray;
    }

    this.allQuestions =
      this.surveyDetails && this.surveyDetails.questions
        ? this.surveyDetails.questions
        : []; // eslint-disable-line
    // this.allQuestions = _.filter(this.allQuestions, o => o.type !== 'SurveyInstruction'); // eslint-disable-line
    if (this.addEditQuestion && this.addEditQuestion.options) {
      _.forEach(this.addEditQuestion.options, value => {
        if (!value.nextQuestion) {
          value.nextQuestion = null; // eslint-disable-line
        }
      });
    } 
    this.questionTypeChanged(this.addEditQuestion);
    if(this.options){
      this.options.type = this.options.type ? this.options.type : "Default";
    }
    //get the features enabled for this client 
    this.getToggledFeatures();
  },
  methods: {
    deleteTemplateImage() {
      this.addEditQuestion.templateImageUrl = "";
      this.addEditQuestion.templateImageId = "";
      toastr.success("image deleted successfully");
    },
    addImage() {
      this.addEditQuestion.templateImageUrl = this.selectedTemplateImageIcon.preSignedURL;
      this.addEditQuestion.templateImageId = this.selectedTemplateImageIcon.name;
      this.$api.uploadTemplateImageIcon(this.studyId, this.surveyId, this.selectedTemplateImageIcon, this.surveyType).then(response => {
        this.addEditQuestion.templateImageUrl = response.body.templateImageUrl;
        this.addEditQuestion.templateImageId = (response.body.templateImageId).substr(0, response.body.templateImageId.lastIndexOf('.'));
      });
      this.modal = '';
      window.$('#myModal').modal('hide');
    },
    cancelImages() {
      this.modal = '';
      window.$('#myModal').modal('hide');
      this.selectedTemplateImageIcon = {};
    },
    selectLogo(page) {
      this.selectedTemplateImageIcon = {};
      this.selectedTemplateImageIcon = page;
    },
    getLogosFromLibrary(pageNumber) {
      this.modal = 'logo';
      this.currentPage = pageNumber;
      this.$api.getTemplateLogosFact(pageNumber).then(response => {
        this.logos = response.body.icons;
        this.totalPages = response.body.totalPages;
      });
    },
    hidePopup() {
      this.infoDiv = false;
      this.$el.blur();
    },
    showPopup() {
      this.infoDiv = true;
      this.$el.focus();
    },
    toggleInfoDiv() {
      if (this.infoDiv) {
        this.hidePopup();
      } else {
        this.showPopup();
      }
    },
    hideScaleInfo () {
			this.scaleInfoDiv = false;
			this.$el.blur();
		},
		showScaleInfo () {
			this.scaleInfoDiv = true;
			this.$el.focus();
		},
     toggleScaleInfo() {
      if (this.scaleInfoDiv) {
				this.hideScaleInfo();
			} else {
				this.showScaleInfo();
			}
    },
    hideIntervalInfo () {
			this.intervalInfoDiv = false;
			this.$el.blur();
		},
		showIntervalInfo () {
			this.intervalInfoDiv = true;
			this.$el.focus();
		},
     toggleIntervalInfo() {
      if (this.intervalInfoDiv) {
				this.hideIntervalInfo();
			} else {
				this.showIntervalInfo();
			}
    },
    toggleNotifyToEmail(that) { // eslint-disable-line
      that = !that; // eslint-disable-line
    },
    validateLabels(index) {
      let label = this.stripHtml(this.addEditQuestion.formattedLabels[index]);
      if (label && label.length > 16) {
        //eslint-disable-line
        this.validLabels.push(index);
      } else {
        this.validLabels.forEach((item, vindex) => {
          if (item === index) {
            this.validLabels.splice(vindex, 1);
          }
        });
      }
    },
    changeLabelsLength(intervals) {
      if(intervals <= 1 || intervals > 8) {
        toastr.error("Minimum and maximum value of interval should be 2 and 8");
        return
      }
      this.addEditQuestion.formattedLabels.length = intervals;
      this.$forceUpdate();
    },
    deleteQuestionOptionItem(options, index) {
      this.addEditQuestion.options.splice(index, 1);
      // updating the sequence number once the option is deleted
      this.addEditQuestion.options.forEach((option, ind) => {
        this.addEditQuestion.options[ind].sequence = ind + 1;
      });
    },
    questionTypeChanged(addEditQuestion) {
      if (addEditQuestion && addEditQuestion.type) {
        const questionType = addEditQuestion.type.toLowerCase();
        switch (questionType) {
          case "boolean":
            this.addEditQuestion.options[0].body = "Yes";
            this.addEditQuestion.options[1].body = "No";
            this.addEditQuestion.options[0].formattedBody = "Yes";
            this.addEditQuestion.options[1].formattedBody = "No";
            break;
          case "multichoice":
            if (
              !this.addEditQuestion.options ||
              this.addEditQuestion.options.length === 0
            ) {
              this.addEditQuestion.options = [
                { body: null, sequence: 1, nextQuestion: null, imageUrl: null },
                { body: null, sequence: 2, nextQuestion: null, imageUrl: null }
              ];
            }
            this.addEditQuestion.options[0].body =
              this.addEditQuestion.options[0].body || "";
            this.addEditQuestion.options[1].body =
              this.addEditQuestion.options[1].body || "";
            break;
          // case 'numberscale':
          //   this.addEditQuestion.minValue = this.addEditQuestion.minValue
          //   this.addEditQuestion.maxValue = this.addEditQuestion.maxValue
          //   break;
          case 'customscale':
            if (!this.addEditQuestion.formattedLabels) {
              this.addEditQuestion.formattedLabels = [];
            }
            this.addEditQuestion.formattedLabels.length =
              this.addEditQuestion.formattedLabels.length || 5;
            break;
          case "number":
            this.addEditQuestion.minValue = this.addEditQuestion.id
              ? this.addEditQuestion.minValue
              : ""; // eslint-disable-line
            this.addEditQuestion.maxValue = this.addEditQuestion.id
              ? this.addEditQuestion.maxValue
              : ""; // eslint-disable-line
            break;
          case "gpskin":
            if(!this.addEditQuestion.id)
            {
              this.addEditQuestion.formattedInformation = "<p>You will measure your left forearm three times. </p><p><br></p><p>Click the button once to begin first scan. Quickly place the device on your skin in the position shown above.</p>";
            }
            break;
          case "image":
            this.prepareLanguageString();
            this.prepareLanguageImageOptions();
            break; 
          case "imagecapture":
            this.addEditQuestion.formattedInformation = this.addEditQuestion.formattedInformation ? this.addEditQuestion.formattedInformation : null;
            this.addEditQuestion.formattedTitle = this.addEditQuestion.formattedTitle ? this.addEditQuestion.formattedTitle : null;
            break;     
          default:
            this.addEditQuestion.labels = [];
            // this.addEditQuestion.maxValue = 8;
            break;
        }
      }
    },
    setMaxValueForSlider(intervals) {
      this.addEditQuestion.maxValue = intervals;
    },
    addAnotherAnswer() {
      if (!this.addEditQuestion.options) {
        this.addEditQuestion.options = [];
      }
      let maxSequence = Number(
        _.max(_.map(this.addEditQuestion.options, "sequence"))
      );
      if (!maxSequence) {
        maxSequence = this.addEditQuestion.options.length;
      }
      this.addEditQuestion.options.push({
        body: null,
        sequence: maxSequence + 1,
        nextQuestion: null,
        imageUrl: null
      }); // eslint-disable-line
      this.$forceUpdate();
    },
    checkQuestionValidity(question) {
      this.notUniqueOptions = false;
      this.notValidInterval = false;
      this.errorMsg = null;
      let validQuestion = true;
      let scaleLabels = [];
      let numberScaleValidity = false;
      let customScaleValidity = false;
      switch (question.type) {
        case "MultiChoice":
          _.forEach(question.options, value => {
            if (!value.formattedBody) {
              validQuestion = false;
            }
            const uniqueOptionsArr = _.uniqBy(question.options, "formattedBody");
            if (uniqueOptionsArr.length < question.options.length) {
              validQuestion = false;
              this.notUniqueOptions = true;
            }
          });
          if (question.hasBodyImage) {
            _.forEach(question.bodyImages, value => {
              if (!value.imageUrl) {
                validQuestion = false;
              }
            });
          }
          return (
            validQuestion &&
            (question.formattedBody && question.sequence && question.options.length > 1)
          ); // eslint-disable-line
        // break;
        case "Image":
          if ( !question.formattedBody || !question.sequence ) {
            return false;
          }
          
          let langImgOptClone = _.cloneDeep(this.addEditQuestion.languageImageOptions);

          //Minimum no. of options should be 2
          let minOptions = _.map(langImgOptClone, function(lo) {
            return lo.options.length;
          });
          let minOptErr = _.some(minOptions, function(v){
              return v<2;
          });
          if(minOptErr){
            this.errorMsg = "Please upload at least 2 options.";
            return;
          }

          /**
            CODE TO CHECK THAT USER HAS UPLOADED IMAGES OR NOT 
          */
          for (let a = 0; a < langImgOptClone.length; a++) {
            for (let b = 0; b < langImgOptClone[a].options.length; b++) {
              if (!langImgOptClone[a].options[b].imageUrl) {                
                this.errorMsg = "Please upload image(s)";
                a = langImgOptClone.length;//break the loop
                return validQuestion = false;
              }
            }
          }      
          // CODE END

          //check if all language has same no. of images options or not
          let hasSameOpt = _.every(minOptions, function(v, i, a){
              return v === a[0]
          });
          if(!hasSameOpt){
            toastr.warning("Please upload the same number of images for all languages.");
          }

          return true;
        // break;
        case "Boolean":
          _.forEach(question.options, value => {
            if (!value.formattedBody) {
              validQuestion = false;
            }
          });
          return (
            validQuestion &&
            (question.formattedBody &&
              question.sequence &&
              question.options &&
              question.options.length === 2)
          ); // eslint-disable-line
        // break;
        case 'NumberScale':
          
          if(!question.formattedBody || this.stripHtml(question.formattedBody).trim()==""){
            return false;
          }
          
          if(question.intervals === "" || !question.intervals) {
            this.errorMsg = "Please specify # of intervals";
            return false;
          }

          else if(question.intervals < 1 || question.intervals > 13) {
            this.errorMsg = "Interval must be within 1 and 13";
            return false;
          }

          if(question.minValue === "") {
            this.errorMsg = "Please specify the minimum value";
            return false;
          }

          if(question.maxValue === "") {
            this.errorMsg = "Please specify the maximum value";
            return false;
          }

          if(Number(question.maxValue) == Number(question.minValue)) {
            this.errorMsg = "Minimum and maximum values cannot be identical.";
            return false;
          }

          // max values always less than min value
          if(Number(question.minValue) > Number(question.maxValue)) {
            this.errorMsg = "Max value must be greater than Min value.";
            return false;
          }

          // min max should have value in defined range
          if(Number(question.minValue) < -10000 || Number(question.maxValue) > 10000) {
              this.errorMsg = "Min and Max values must be within -10,000 and 10,000 range";
            return false;
          }
          
          return true;
        // break;
        case "CustomScale":
          if(this.addEditQuestion.intervals > 8 || this.addEditQuestion.intervals <= 1) {
            return {message: "Minimum and maximum value of interval should be 2 and 8"};
          }
          if(_.uniq(question.formattedLabels).length !== question.formattedLabels.length) {
            return {message: "Please enter unique interval values."};
          }
          question.intervals = Number(question.intervals); // eslint-disable-line
          scaleLabels = _.without(question.formattedLabels, "", null, undefined);
          customScaleValidity =
            question.formattedBody &&
            question.sequence &&
            (question.intervals > 1 && question.intervals <= 8) &&
            scaleLabels.length > 0 &&
            scaleLabels.length === Number(question.intervals) &&
            this.validLabels.length === 0 &&
            _.uniq(question.formattedLabels).length === question.formattedLabels.length; // eslint-disable-line
          return customScaleValidity;
        // break;
        case "DateTime":
          return (
            question.formattedBody &&
            question.sequence &&
            (question.dateFormat || question.timeFormat) &&
            (question.showDate || question.showTime)
          ); // eslint-disable-line
        // break;
        case "Text":
          if (question.characterLimited && question.textLimit > 512) {
            this.notValidLimit = true;
            return false;
          } else {
            return (
              (question.formattedBody &&
                question.sequence &&
                !question.characterLimited) ||
              (question.formattedBody &&
                question.sequence &&
                question.characterLimited &&
                question.textLimit &&
                question.textLimit > 0)
            ); // eslint-disable-line
            // break;
          }
        case "Number":
          if (!question.formattedBody || !question.sequence) {
            validQuestion = false;
          } else if (question.hasUnits && !question.units) {
            validQuestion = false;
          } else if (
            question.hasMinMax &&
            (question.minValue < 0 || !question.maxValue)
          ) {
            validQuestion = false;
          } else if (
            ((question.minValue != undefined && question.minValue % 1 !== 0) || (question.minValue != undefined && question.maxValue % 1 !== 0)) &&
            !question.allowDecimals
          ) {
            //eslint-disable-line
            validQuestion = false;
          }
          return validQuestion;
        // break;
        // break;
        case "Email":
          return question.formattedBody && question.sequence; // eslint-disable-line
        // break;
        case "Location":
          return question.formattedBody && question.sequence; // eslint-disable-line
        // break;
        case "SurveyInstruction":
          return question.formattedTitle;
        case "GPSkin":
          if(question.formattedTitle && question.formattedInformation){
              
              //Validate Title
              let ftitle = this.stripHtml(question.formattedTitle);
              if (ftitle.length > this.charLimit80) {
                this.notValidCharLimit = true;
                this.charLimitErrTxt = `Screen title cannot exceeds ${this.charLimit80} limit`;
                return false;
              }
              
              this.notValidCharLimit = false;
              this.charLimitErrTxt = null;
              return true;         
          }
          return false;
        case "ImageCapture":
          if(this.addEditQuestion.guideParticipant == true && !this.addEditQuestion.templateImageUrl) {
            return {message: 'Please upload or select an image template'};
          }
          if(question.formattedTitle && question.formattedInformation){
              //Validate Title
              let ftitle = this.stripHtml(question.formattedTitle);
              if (ftitle.length > this.charLimit80) {
                this.notValidCharLimit = true;
                this.charLimitErrTxt = `Screen title cannot exceeds ${this.charLimit80} limit`;
                return false;
              }
              
              this.notValidCharLimit = false;
              this.charLimitErrTxt = null;
              return true;         
          }
          return false
        default:
          return false;
      }
    },
    stripHtml(content) {
      let temporalDivElement = document.createElement("div");
      temporalDivElement.innerHTML = content;
      return temporalDivElement.innerText;
    },
    splitPTagfromContent(text) {
      if(text == null) {
        return;
      }
      return text.replace('<p>', '').replace('</p>', '');
    },
    iterateQuestionForFormattedText(question) {
      if (question.type == "SurveyInstruction" || question.type == "GPSkin" || question.type == "ImageCapture") {
        question.formattedBody = this.splitPTagfromContent(question.formattedTitle);
        question.title = this.stripHtml(question.formattedTitle);
        question.information = question.formattedInformation;
      } else if(question.type == "CustomScale") {
        question.labels = [];
        question.body = this.stripHtml(question.formattedBody);
        question.formattedLabels.map((element, index) => {
          question.formattedLabels[index] = this.splitPTagfromContent(element);
          question.labels.push(this.stripHtml(element));
        });
      } else {
        question.body = this.stripHtml(question.formattedBody);
        if (question.options == undefined || question.options.length == 0) {
          return;
        }
        for (let i = 0; i < question.options.length; i++) {
          question.options[i].body = this.stripHtml(question.options[i].formattedBody);
          question.options[i].formattedBody = this.splitPTagfromContent(question.options[i].formattedBody);
        }
      }
    },
    saveQuestion() {
      if(this.addEditQuestion.type == "CustomScale") {
        this.iterateQuestionForFormattedText(this.addEditQuestion);
      }
      const validQuestion = this.checkQuestionValidity(this.addEditQuestion);
      if(typeof validQuestion === "object") {
        toastr.error(validQuestion.message);
        return;
      }
      if (validQuestion) {
        let parts = '';
        if(this.addEditQuestion.type === 'NumberScale') {
          parts = (this.addEditQuestion.maxValue - this.addEditQuestion.minValue)/this.addEditQuestion.intervals
          if(Number.isInteger(parts)) {
            this.addEditQuestion.partitions = parts
          }
          else {
            this.addEditQuestion.partitions = 1
          }
        } else if(this.addEditQuestion.type === 'Image'){delete this.addEditQuestion.options}
        if(this.addEditQuestion.type == "ImageCapture" && this.addEditQuestion.guideParticipant == false) {
          this.addEditQuestion.templateImageUrl = "";
          this.addEditQuestion.templateImageId = "";
        }
        this.iterateQuestionForFormattedText(this.addEditQuestion);
        this.$store.dispatch('addQuestionAction', this.addEditQuestion);
        this.notValidLimit = false;
        this.notValidInterval = false;
        this.notUniqueOptions = false;
      }
        else {
          if(this.notValidLimit) {
            toastr.error("Character limit cannot exceed 512.");
          }
          if(this.notValidInterval) {
            toastr.error("Intervals must be in the range of 1 to 13.");
          }
          else if(this.notUniqueOptions) {
            toastr.error('Please populate all required fields and make sure answer options are not identical.');
          }
          else if(this.notValidCharLimit) {
            toastr.error(this.charLimitErrTxt);
          }
          else if(this.errorMsg){
            toastr.error(this.errorMsg);
          }
          else {
            toastr.error("Please populate all required fields.");
          }
      }
    },
    validateAnswerLimit(data) {
      data = this.stripHtml(data);
      if (data.length === 512) {
        toastr.error("Character limit reached.");
      }
    },
    validateCharacterLimit(data) {
      this.notValidLimit = false;
      if (data > 512) {
        toastr.error("Character limit cannot exceed 512.");
      }
    },
    //  validateInterval(data) {
    //   this.notValidInterval = false;
    //   if(data > 13) {
    //     toastr.error("Intervals cannot exceed 13.")
    //   }
    // },
    cancelQuestion() {
      this.addEditQuestion = {};
      this.$store.dispatch("selectedQuestionAction", { id: null });
    },
    deleteQuestion() {
      swal({
        title: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$store.dispatch("addQuestionAction", null);
          this.addEditQuestion.opType = "delete";
          this.$store.dispatch("addQuestionAction", this.addEditQuestion);
        }
      });
    },
    deleteImageBodyQuestion(option) {
      this.$api
        .deleteOptionFact(this.studyId, this.surveyId, option, this.surveyType) // eslint-disable-line
        .then(
          response => {
            const optionIndex = _.findIndex(this.addEditQuestion.bodyImages, [
              "sequence",
              option.sequence
            ]);
            this.addEditQuestion.bodyImages.splice(optionIndex, 1, {
              sequence: 1,
              imageUrl: " ",
              imageId: null
            });
            toastr.success("image deleted successfully");
            window.$('#file_upload[type="file"]').val(null);
          },
          error => {
            this.errorMsg = error.body
              ? error.body.message
              : "Error while deleting the option.";
            toastr.error(this.errorMsg);
          }
        );
    },
    uploadBodyImage(e, option, id) {
      const fd = new FormData();
      const input = window.document.getElementById(id);
      fd.append("image", input.files[0]);
      fd.append("sequence", option.sequence);
      const rand = Math.random()
        .toString(36)
        .substr(2, 10);
      fd.append("imageId", option.imageId ? option.imageId : `img_id_${rand}`);
      this.$api.imageQuestionFact(this.studyId, this.surveyId, fd, this.surveyType).then(
        response => {
          // const optionIndex = Number(response.body.sequence) - 1;
          const optionIndex = _.findIndex(this.addEditQuestion.bodyImages, [
            "sequence",
            Number(response.body.sequence)
          ]);
          this.addEditQuestion.bodyImages[0].imageUrl =
            response.body.imageUrl;
          this.addEditQuestion.bodyImages[0].imageId =
            response.body.imageId;
          this.addEditQuestion.bodyImages[0].sequence =
            response.body.sequence; // eslint-disable-line
          toastr.success("Image uploaded successfully");
          window.$('#file_upload[type="file"]').val(null);
        },
        error => {
          this.errorMsg = error.body
            ? error.body.message
            : "Error while uploading the image.";
          toastr.error(this.errorMsg);
        }
      );
    },
    uploadOptionImage( langIndex, optionIndex) {
      let languageId = this.addEditQuestion.languageImageOptions[langIndex].languageId;
      let option = this.addEditQuestion.languageImageOptions[langIndex].options[optionIndex];
      let id = 'file_upload_' + languageId + '_' + option.sequence;
      const fd = new FormData();
      const input = window.document.getElementById(id);
      fd.append("image", input.files[0]);
      fd.append("sequence", option.sequence);
      fd.append("languageId", languageId);
      const rand = Math.random()
        .toString(36)
        .substr(2, 10);
      fd.append("imageId", option.imageId ? option.imageId : `img_id_${rand}`);
      this.$api.imageUploadFact(this.studyId, this.surveyId, this.surveyType, fd).then(
        response => {
          this.addEditQuestion.languageImageOptions[langIndex].options[optionIndex].imageUrl =
            response.body.imageUrl;
          this.addEditQuestion.languageImageOptions[langIndex].options[optionIndex].imageId =
            response.body.imageId;
          this.addEditQuestion.languageImageOptions[langIndex].options[optionIndex].sequence =
            response.body.sequence;
          toastr.success("Image uploaded successfully");
          window.$('#'+id).val(null);
          this.$forceUpdate();
        },
        error => {
          this.errorMsg = error.body
            ? error.body.message
            : "Error while uploading the image.";
          toastr.error(this.errorMsg);
        }
      );
    },
    deleteQuestionOption(option) {
      this.$api.deleteOptionFact(this.studyId, this.surveyId, option, this.surveyType).then(
        response => {
          const optionIndex = _.findIndex(this.addEditQuestion.options, [
            "sequence",
            option.sequence
          ]);
          this.addEditQuestion.options.splice(optionIndex, 1);
          // updating the sequence number once the option is deleted
          this.addEditQuestion.options.forEach((option, ind) => {
            this.addEditQuestion.options[ind].sequence = ind + 1;
          });
          toastr.success("Option deleted successfully");
          window.$('#file_upload[type="file"]').val(null);
        },
        error => {
          this.errorMsg = error.body
            ? error.body.message
            : "Error while deleting the option.";
          toastr.error(this.errorMsg);
        }
      );
    },
    uploadInstructionImage(isInstructionTemplate) {
      let self = this;
      const fd = new FormData(); 
      const input = isInstructionTemplate ? window.document.getElementById("template_file_upload") : window.document.getElementById("file_upload");
      fd.append("image", input.files[0]);
      fd.append("sequence", this.addEditQuestion.sequence);
      if(isInstructionTemplate) {
        fd.append(
          "previousTemplateImageId",
          this.addEditQuestion && this.addEditQuestion.templateImageId
            ? (this.addEditQuestion.templateImageId).substr(0, this.addEditQuestion.templateImageId.lastIndexOf('.'))
            : ""
        );
        fd.append(
          "templateImageId",
          `template_img_id_${Math.random()
            .toString(36)
            .substr(2, 10)}`
        );
      } else {
        fd.append(
          "previousImageId",
          this.addEditQuestion && this.addEditQuestion.imageId
            ? this.addEditQuestion.imageId
            : ""
        );
        fd.append(
          "imageId",
          `img_id_${Math.random()
            .toString(36)
            .substr(2, 10)}`
        );
      }
      this.$api.imageUploadFact(this.studyId, this.surveyId, this.surveyType, fd, isInstructionTemplate).then(
        response => {
          if(response.body.imageUrl) {
            self.addEditQuestion.imageUrl = response.body.imageUrl;
            self.addEditQuestion.imageId = response.body.imageId;
          } else if(response.body.templateImageUrl) {
            self.addEditQuestion.templateImageUrl = response.body.templateImageUrl;
            self.addEditQuestion.templateImageId = response.body.templateImageId;
          }
          toastr.success("Image uploaded successfully");
          if(isInstructionTemplate) {
            window.$('#template_file_upload[type="file"]').val(null);
          } else {
            window.$('#file_upload[type="file"]').val(null);
          }
        },
        error => {
          self.errorMsg = error.body
            ? error.body.message
            : "Error while uploading the image.";
          toastr.error(self.errorMsg);
          if(isInstructionTemplate) {
            self.addEditQuestion.templateImageUrl = "";
            self.addEditQuestion.templateImageId = "";
            window.$('#template_file_upload[type="file"]').val(null);
          } else {
            self.addEditQuestion.imageUrl = "";
            self.addEditQuestion.imageId = ""
            window.$('#file_upload[type="file"]').val(null);
          }
        }
      );
    },
    openInstructionModal() {
      window.$("#instructionModal").modal("show");
    },
    closeModal() {
      window.$("#instructionModal").modal("hide");
    },
    characterLimitValidation(data, maxCount=512) {
      //Strip HTML tags
      data = this.stripHtml(data);
      if (data.length > maxCount) {
        toastr.error(`Character limit cannot exceed ${maxCount}.`);
      }
    },
    getToggledFeatures() {
      var self = this;
      self.$api.getToggleFeaturesFact(self.studyId).then(
        response => {
          if (response.body) {
            self.toggleFeatures = response.body.studyFeatures;
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
        }
      );
    },
    toggleEnglishImageInfoDiv(hide=false){
      this.useEnglishImageInfoDiv = hide ? false : !this.useEnglishImageInfoDiv;
    },
    prepareLanguageImageOptions(){
      var self = this; 
      
      if(self.studyData && self.studyData.language){

        /**
          if the user is converting question to image type from other type then we do not have languageImageOptions key
          so lets add it.
         */
        if(!self.addEditQuestion.languageImageOptions && self.addEditQuestion.id){
          self.addEditQuestion.languageImageOptions =  _.cloneDeep(sampleQuestionObj.languageImageOptions);
          self.addEditQuestion.useEnglishImageAnswer = true;
          //Prepare the default english option
          self.prepareEnglishOption();
          self.prepareLanguageString();
        }

        /** The below code is for new question, Update the language id and name to the default(English) languageImageOptions object */
        if(!self.addEditQuestion.id){
          self.prepareEnglishOption();
        }

        /**Prepare the options for all the languages when the "Use English image answer choices for all languages." checkbox is unchecked */
        if(!self.addEditQuestion.useEnglishImageAnswer){
          /** If its a new question OR languageImageOptions length is less than the configured languages  */
          if((!self.addEditQuestion.id || self.addEditQuestion.languageImageOptions.length<self.studyData.language.length) && self.addEditQuestion.languageImageOptions.length != self.studyData.language.length){
            let clonedLanguagearray = _.cloneDeep(self.studyData.language);
              _.remove(clonedLanguagearray, function(n) {
                //Remove english along with language that are already exists in the question
                return n.name.toLowerCase() == 'english' || _.findIndex(self.addEditQuestion.languageImageOptions, ['languageId', n.language_id])>=0;
              }); 
            let otherLanguOptArr = self.preparelanguagesImageoptionsArray(clonedLanguagearray); 
            self.addEditQuestion.languageImageOptions = self.addEditQuestion.languageImageOptions.concat(otherLanguOptArr);
          }
          
        }
        else{         
          //the below code will keep the english object and reove all other from the main addEditQuestion obj
          _.remove(self.addEditQuestion.languageImageOptions, function(n) {
            return n.languageName.toLowerCase() !== 'english';
          });
        }
        this.toggleAddAnotherImgAnswerLink();
      }
    },
    prepareLanguageString(){
      this.languagesString = null;
      if(this.addEditQuestion.useEnglishImageAnswer){
        this.languagesString = _.chain(this.studyData.language).sortBy('sort_Order').map('name').join(', ').value();    
      }
    },
    toggleUseEnglishImageAnswerCheckbox(){
      this.prepareLanguageString();
      this.prepareLanguageImageOptions();
    },
    preparelanguagesImageoptionsArray(languagesArray){
      var self = this;
      let langImgOptionsArray = [];
        
      _.forEach(_.sortBy(languagesArray, 'sort_Order'), function(langObj, keyIndex) {
        
        langImgOptionsArray[keyIndex] = _.cloneDeep(self.addEditQuestion.languageImageOptions[0]);
        langImgOptionsArray[keyIndex].languageId = langObj.language_id;
        langImgOptionsArray[keyIndex].languageName = langObj.name;
        langImgOptionsArray[keyIndex].languageCulture = langObj.language_culture;
        _.forEach(langImgOptionsArray[keyIndex].options, function(op, i){
          op.body =  null;
          op.formattedBody = null;
          op.nextQuestion = null;
          op.imageUrl = null;
          op.imageId = null;
        });
  
      }); 
      
      return langImgOptionsArray;
    },
    addAnotherImageAnswer(languageIndex) {
      var self = this;
      let maxSequence = Number(
        _.max(_.map(this.addEditQuestion.languageImageOptions[languageIndex].options, "sequence"))
      );

      if (!maxSequence) {
        maxSequence = this.addEditQuestion.languageImageOptions[languageIndex].options.length;
      }

      this.addEditQuestion.languageImageOptions[languageIndex].options.push({
        body: null,
        sequence: maxSequence + 1,
        nextQuestion: null,
        imageUrl: null
      }); // eslint-disable-line
      
      this.toggleAddAnotherImgAnswerLink();
      this.$forceUpdate();
    },
    deleteImageQuestionOption(langIndex, optionIndex) {
      let optionToDelete = this.addEditQuestion.languageImageOptions[langIndex].options[optionIndex];
      optionToDelete.languageId = this.addEditQuestion.languageImageOptions[langIndex].languageId;
      this.$api.deleteOptionFact(this.studyId, this.surveyId, optionToDelete, this.surveyType).then(
        response => {            
          this.addEditQuestion.languageImageOptions[langIndex].options.splice(optionIndex, 1);
          // updating the sequence number once the option is deleted
          this.addEditQuestion.languageImageOptions[langIndex].options.forEach((option, ind) => {
            option.sequence = ind + 1;//Since it is mutating the original object no need to assing back to the options
          });            
          toastr.success("Option deleted successfully");
          window.$('#file_upload[type="file"]').val(null);
          this.toggleAddAnotherImgAnswerLink();            
        },
        error => {
          this.errorMsg = error.body
            ? error.body.message
            : "Error while deleting the option.";
          toastr.error(this.errorMsg);
        }
      );
    },
    toggleAddAnotherImgAnswerLink(){
      var self = this;
      //self.addAnotherImgAnswerStatus = [];

      //check for the other language options length
      let langImgOptClone = _.cloneDeep(self.addEditQuestion.languageImageOptions);

      let engOptObj = _.remove(langImgOptClone, function(n) {
                        return n.languageName.toLowerCase() == 'english';
                      });
      
      /* //Loop thorugh 
      langImgOptClone.forEach(langOptObj => { 
        if(langOptObj.options.length < engOptObj[0].options.length){
          self.addAnotherImgAnswerStatus.push(langOptObj.languageId)
        }     
      }); */
      
    },
    prepareEnglishOption(){
      let elObj = _.find(this.studyData.language, function(o) { return o.name.toLowerCase() === 'english'; });
      this.addEditQuestion.languageImageOptions[0].languageId = elObj.language_id;
      this.addEditQuestion.languageImageOptions[0].languageName = elObj.name;
      this.addEditQuestion.languageImageOptions[0].languageCulture = elObj.language_culture;
    }
  }
};
</script>

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
  color: #333;
}

.h5,
h5 {
  opacity: 0.7;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
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
.img-border {
  border: 1px solid #000000;
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
.modal-heading-text {
  width: 270px;
  padding-bottom: 20px;
}
.position-relative {
  position: relative;
};
.custom-image-pixels {
  width: 168px !important;
  height: 128px !important;
}
.position-absolute {
  position: absolute;
  top: 100px;
  right: -10px;
}

.add_edit_question_card {
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #d3dfe4;
  padding: 16px;
}

.remove_upload_option{
  position: relative;
  top: 4px;
}

.instruction {
  color: #959fa4;
  font-size: 12px;
  margin-top: 10px;
  ul {
    padding-left: 14px;
  }
}
.link-text {
  width: 175px;
  display: inline-block;
  margin-top: 5px;
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
}

.upload_btn {
  width: 80px !important;
  height: 30px !important;
  position: relative;
  top: 4px;
}
.mar-top15 {
  margin-top: 15px !important;
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


/deep/ .quill-editor {
  &.bg-white {
    position: relative;
    border-top: 1px solid #ccc;
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border-bottom: none;
        border-top: none;
        padding: 4px;
        float: right;
        border-left: none;
        z-index: 9;
        position: relative;
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
          margin-right: 10px;
          .ql-active {
                      box-shadow: 0 2px 2px 0 rgb(119, 119, 120);
                    }
          button {
            height: 29px;
            padding: 4px 4px;
          }
          button:not(:last-child) {
            border-right: 1px solid #ccc;
          }
        }
        .ql-formats:last-child {
          border-right: 1px solid #ccc;
        }
        .ql-stroke {
          stroke: #ccc;
        }
        .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: #ccc;
        }
      }
    }
    .ql-container {
      .ql-editor {
        height: auto;
        min-height: 0px;
      }
    }
  }
  &.instruction-screen {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        min-height: 100px;
      }
    }
  }
}


.modal_header_color {
  color: #28406a;
}
.modal_desc {
  color: #535456;
}
.modal_custom {
  border-radius: 4px;
  padding: 16px;
}
.selectLibrary {
  border-radius: 3px;
  background-color: #ddd;
  padding: 5px;
  overflow: hidden;
  border: none;
  font-weight: 500;
  font-size: 14px;
  margin-left: 12px;
  color: #555;
  width: 152px !important;
}
.selectLibrary:focus {
    outline: none;
}
.library_add_btn {
  max-width: 300px;
  margin: auto;
  height: 38px;
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
.library_img_bg {
  display: -webkit-inline-box;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  max-width: 200px;
  max-height: 80px;
  min-height: 70px;
  width: 98%;
  padding: 10px;
  text-align: -webkit-center;
  .logo {
    width: auto;
    margin: auto;
    height: 45px;
  }
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
    width: 100%;
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
  .col-lg-offset-4 {
    margin-left: 33.33333333%;
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

.add_edit_question_card {
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #d3dfe4;
  padding: 16px;
  margin-bottom: 20px;
  display: block;
  .type_select {
    border-radius: 0 !important;
    width: 200px;
  }
  .options_section {
    background-color: #eaf0f4;
    border: solid 1px #e2e7ea;
    display: inline-block;
    width: 100%;
    border-radius: 2px;
    padding: 5px;
    margin: 10px 0 0;
  }
  .limit_text_input {
    position: absolute;
    top: -5px;
    left: 135px;
    width: 50px;
    height: 28px;
  }
  .answer_label_text_input {
    width: 150px;
  }
  .min_value_input {
  }
  .max_value_input {
    left: 210px;
    width: 60px;
  }
  .min_max_to_text {
    position: absolute;
    top: 0px;
    left: 190px;
  }
  .add_another_answer {
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    a {
      color: #4c8ce4;
      cursor: pointer;
    }
  }
  label {
    font-weight: normal;
    margin-bottom: 10px;
    // margin-left: 88px;
  }
  .multi_choice_type {
    padding-top: 5px;
  }
  .boolean_choice_type {
  }
  .scale_choice_type {
    padding-top: 5px;
    .radio-style {
      margin: 0;
    }
  }
  .text_choice_type {
    padding-top: 5px;
  }
  .number_choice_type {
    padding-top: 5px;
  }
  .date_time_type {
    padding-top: 5px;
    label {
      min-width: 120px;
    }
  }
  .save_btn {
    width: 100px;
  }
  .branch_section {
    position: relative;
    top: -20px;
  }
  .form-control,
  .input-text {
    border-radius: 2px !important;
  }
  .file_container [type="file"] {
    cursor: inherit;
    display: block;
    font-size: 20px;
    filter: alpha(opacity=0);
    width: 200px;
    height: 40px;
    max-height: 50px;
    max-width: 300px;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 15px;
    left: 0px;
  }
  .file_container [type="file"].language-img-file {
    cursor: inherit;
    display: block;
    filter: alpha(opacity=0);
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
    height: auto;
    border: 1px solid red;
    font-size: initial;
  }
  .file_container {
    padding: 0px 10px 0 0;
    color: grey;
  }
  .file_container [type="file"] {
    cursor: pointer;
  }
  .file_container_text {
    background-color: #d3dfe4;
    padding: 5px;
    width: 100%;
    display: block;
    border-radius: 4px;
    text-align: center;
    color: #959fa4;
  }
  .error-style {
    font-size: 12px;
    color: #ff4848;
    padding-bottom: 5px;
    padding-left: 0;
  }
  .text-style {
    padding: 9px 0px 0 0;
    font-size: 12px;
    color: #959fa4;
  }
  .img_size {
    width: 100%;
    height: 100%;
    border: 1px solid #d3dfe4;
  }
  @media (max-width: 575px) {
    .col-sm-12 {
      padding: 0px;
    }
    .branch_section {
      padding-top: 25px;
    }
  }
  @media (min-width: 576px) and (max-width: 767px) {
    .col-sm-12 {
      padding: 0px;
    }
    .branch_section {
      padding-top: 25px;
    }
    .text-style {
      padding: 0 0 20px 0;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    .col-sm-12 {
      padding: 0px;
    }
    .branch_section {
      padding-top: 25px;
    }
    .text-style {
      padding: 0 0 20px 0;
    }
    
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    .branch_section {
      padding-right: 0;
    }
    
  }
  @media (min-width: 1200px) {
    .branch_section {
      padding-right: 0;
    }
    .gpskin-example-link {
      margin-left:-35px;
    }
  }
}

//for instruction type
.file_container1 [type="file"] {
  cursor: inherit;
  display: block;
  font-size: 20px;
  filter: alpha(opacity=0);
  width: 100px;
  height: 40px;
  max-height: 50px;
  max-width: 200px;
  opacity: 0;
  position: absolute;
  right: 0;
  text-align: right;
  top: 0;
  left: 0;
}
.file_container1 {
  margin-top: 5px;
  color: #555;
}
.file_container1 [type="file"] {
  cursor: pointer;
}
.file_container_text1 {
  background-color: #ddd;
  padding: 5px;
  width: 100%;
  display: block;
  border-radius: 4px;
  text-align: center;
}
.info-circle {
  padding-left: 15px;
}

.info-circle-div {
  width: 280px;
  height: 80px;
  background-color: #ffffff;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #666669;
  padding: 13px 16px 19px 13px;
  position: absolute;
  border-radius: 3px;
  margin-left: 510px;
  margin-top: -35px;
  box-shadow: 1px 1px #d3deef;
}

.color_red {
  padding-top: 0px;

  img {
    vertical-align: middle;
    /* border-style: none; */
    padding: 8px;
    border: 1px solid #d3dfe4;
    background: #d3dfe4;
    opacity: 0.6;
    border-radius: 3px;
  }
}

.col-sm-10 {
  max-width: 100%;
}

.form-group {
  margin-bottom: 10px;
}

.form-control::placeholder {
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #c5d1d6;
}

.btn-success {
  height: 36px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
}

/*checkbox data*/
input[type="checkbox"] + span {
  display: block;
}

input[type="checkbox"] {
  display: none;
  height: 26px;
  width: 26px;
}
input[type="checkbox"] + span:before {
  content: "\2714";
  border: 0.1em solid #d3dfe4;
  border-radius: 3px;
  width: 26px;
  display: inline-block;
  height: 26px;
  padding-left: 5px;
  margin-right: 7px;
  vertical-align: middle;
  color: transparent;
  background-color: #fff;
}

input[type="checkbox"]:checked + span:before {
  background-color: #4c8ce4;
  border: 0.1em solid #4c8ce4;
  color: #fff;
  font-size: 16px;
  padding-bottom: 5px;
}

.example {
  color: #4c8ce4;
  cursor: pointer;
}

.cancelImage {
  color: #959fa4;
  float: right;
  font-size: 18px;
  cursor: pointer;
}

.scale-info {
  opacity: 0.7;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}

.scale-info-div {
  margin-left: 105px!important;
  bottom: 104px!important;
  width: 360px!important;
}

.interval-info-div {
  margin-left: 30px!important;
  width: 330px!important;
}

.gp-help-text{
  font-size: 12px;
  color: #666669;
  opacity: 0.67;
}

.img-placeholder{
    background: #fff;
    border: 2px dashed #d3dee3;
    display: block;
    padding: 20px 5px;
    color: 666669;
    opacity:0.7;
    font-size:12px;
    border-radius: 3px;
}
.use-english-img{
  .info-circle-div{
    margin-left: 400px;
  }
}
@media (max-width: 1301px){
  .selectLibrary {
  border-radius: 3px;
  background-color: #ddd;
  padding: 5px;
  overflow: hidden;
  border: none;
  font-weight: 500;
  font-size: 14px;
  margin-left: 12px;
  color: #555;
  width: 140px !important;
}
}
</style>
