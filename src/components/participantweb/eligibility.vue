<template>
  <div>
    <div class="Intro-copy">Enter the following content for eligibility.</div>
    <h4 class="header">Eligibility header area</h4>
    <div class="homepage-para">
      Add in the introductory content for the page.
      <span
        v-b-popover.hover="'Enter a page title, headline, and page text. Each field is required. Headline and page copy fields include text formatting.'"
        class="fa fa-info-circle color_grey ml-4"
      ></span>
    </div>
    <div v-if="showEligibilityHeader===true" class="homepahe-Rectangle-41">
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <p class="content">Page title</p>
          <input
            type="text"
            name="study-name"
            v-model="eligibilityScreen.pageTitle"
            class="homepage-box homepage-box-small"
            placeholder="Enter content"
          />
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 p-0">
          <label class="content">Headline</label>
          <quill-editor
            class="bg-white"
            v-model="eligibilityScreen.headline"
            :options="editorOptionForimageCaptureTitleHeadline"
          ></quill-editor>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 additioanal_copy p-0">
          <label class="content">Body copy</label>
          <quill-editor
            name="study-name"
            class="instruction-screen bg-white"
            v-model="eligibilityScreen.bodyCopyContent"
            :options="editorOptionForimageCaptureTitle"
          ></quill-editor>
        </div>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 p-0 text-right">
          <button
            class="btn box-btn-save btn-success save_btn mt-20"
            v-on:click="saveHeaderSection()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    <!-- read only header page -->
    <div v-if="showEligibilityHeader===false" class="homepahe-Rectangle-41">
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <div class="content-edit">
            {{eligibilityScreen.pageTitle}}
          </div>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <div class v-html="eligibilityScreen.headline"></div>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <div class v-html="eligibilityScreen.bodyCopyContent"></div>
        </div>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 p-0 text-right">
          <button
            class="btn read-edit-btn save_btn" 
            v-on:click="editHeaderContent()"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!--default Eligibility questions.-------------- -->

    <h4 class="header pt-30">Eligibility questions</h4>
    <div class="homepage-para-2 mt-10">
      Add your eligibilty screener questions.
      <span
        v-b-popover.hover="'Select either yes/no dropdown and/or single selection multiple choice questions to screen eligibility. Editable fields include text formatting. Each question must be marked as eligible or not eligible. At least one question is required and at least one question must be marked as eligible.'"
        class="fa fa-info-circle color_grey ml-4"
      ></span>
    </div>
    <div v-if=" questionsLength === 0" class="homepahe-Rectangle-41 mt-10">
      <div class="row">
        <div class="col-md-3 p-0">
          <select
            class="form-control Eligibility_questions_select"
            v-model="addQuestion"
            v-on:change="questionTypeChanged(questionTypes)"
          >
            <option
              v-for="questionType in questionTypes"
              :value="questionType.value"
              :disabled="questionType.value === 'Default'"
              :selected="questionType.value === 'Default'"
            >
              {{questionType.label}}
            </option>
          </select>
        </div>
      </div>
      <!--Boolean type question START-->
      <div v-if="addQuestion === selectedBooleanQuestion.questionType" class>
        <div class="row pt-15 ml-5">
          <div class="col-lg-12 p-0">
            <label class="content">Question</label>
            <quill-editor
              class="bg-white questions_section"
              :options="editorOptionForimageCaptureTitleHeadlineQuestion"
              v-model="selectedBooleanQuestion.question"
            ></quill-editor>
          </div>
        </div>
        <div class="row pt-15 ml-5">
          <div class="col-md-1 pt-40">
            {{ansyes}}
          </div>
          <div class="col-md-2 p-0">
            <label class="content">If selected</label>
            <select
              v-model="selectedBooleanQuestion.options[0].eligibile"
              class="form-control Eligibility_if_select"
            >
              <option></option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
        </div>
        <div class="row pt-15 ml-5">
          <div class="col-md-1 pt-40">{{ansno}}</div>
          <div class="col-md-2 p-0">
            <label class="content">If selected</label>
            <select v-model="selectedBooleanQuestion.options[1].eligibile" class="form-control Eligibility_if_select">
              <option></option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
        </div>
        <div class="row upload-web mt-25">
          <div class="col-lg-12 p-0 text-right">
            <button class="btn box-btn-save btn-success save_btn" v-on:click="saveQuestions(addQuestion)">Save</button>
          </div>
        </div>
      </div>
      <!--Boolean type question END-->
      <!--MultiChoice type question START-->
      <div v-if="addQuestion === selectedMultiChoiceQuestion.questionType" class>
        <div class="row pt-15 ml-5">
          <div class="col-lg-12 p-0">
            <label class="content">Question</label>
            <quill-editor
              class="bg-white questions_section"
              :options="editorOptionForimageCaptureTitleHeadlineQuestion"
              v-model="selectedMultiChoiceQuestion.question"
            ></quill-editor>
          </div>
        </div>
        <div v-if="selectedMultiChoiceQuestion.options.length === 2">
        <div class="row pt-15 ml-5">
          <div class="col-lg-9 pl-0">
            <label class="content">Answers</label>
            <quill-editor
              class="bg-white questions_section"
              :options="editorOptionForimageCaptureTitleHeadlineAnswer"
              v-model="selectedMultiChoiceQuestion.options[0].answer"
            ></quill-editor>
          </div>
          <div class="col-md-3 p-0">
            <label class="content">If selected</label>
            <select 
              class="form-control Eligibility_if_select"
              v-model="selectedMultiChoiceQuestion.options[0].eligibile">
              <option></option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
        </div>
        <div class="row pt-15 ml-5">
          <div class="col-lg-9 pl-0">
            <label class="content">Answers</label>
            <quill-editor
              class="bg-white questions_section"
              :options="editorOptionForimageCaptureTitleHeadlineAnswer"
              v-model="selectedMultiChoiceQuestion.options[1].answer"
            ></quill-editor>
          </div>
          <div class="col-md-3 p-0">
            <label class="content">If selected</label>
            <select 
              class="form-control Eligibility_if_select"
              v-model="selectedMultiChoiceQuestion.options[1].eligibile" >
              <option></option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
        </div>
      </div>  
      <div v-if="selectedMultiChoiceQuestion.options.length > 2">
        <div 
          v-for="(option, index) in selectedMultiChoiceQuestion.options"
          :key="index"
        >
          <div class="row pt-15 ml-5">
            <div class="col-lg-9 pl-0">
              <label class="content">Answers</label>
              <quill-editor
                class="bg-white questions_section"
                :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                v-model="selectedMultiChoiceQuestion.options[index].answer"
              ></quill-editor>
            </div>
            <div class="col-md-3 p-0">
              <label class="content">If selected</label>
              <select 
                class="form-control Eligibility_if_select"
                v-model="selectedMultiChoiceQuestion.options[index].eligibile"
              >
                <option></option>
                <option>Eligible</option>
                <option>Not Eligible</option>
              </select>
            </div>
          </div>
          <div class="col-md-12 col-sm-12 p-0">
            <span
              v-if="index>1" 
              class="cursor_pointer remove-color" 
              v-on:click="removeAnswers(index)"
            >
              Remove
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 p-0 mt-5">
          <a 
            class="participant-heading" 
            v-on:click="addAnother()" 
          >
            Add another answer
          </a>
        </div>
      </div>
      <div class="row upload-web mt-25">
          <div class="col-lg-12 p-0 text-right">
            <button
              class="btn box-btn-save btn-success save_btn" 
              v-on:click="saveQuestions(addQuestion)"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loop for Question-->
    <div v-if="questionsLength !== 0">
      <div
        v-for="(question, index) in eligibilityScreen.questions"
        :key="question.index"
      >
        <div
          v-if="(index !== selectedQuestionIndex)"
          class="row homepage-rectangle-footer ml-30 mt-10"
        >
          <div class="col-md-10">
            <div class="row">
              <div class="questions" v-html="question.question"></div>
              <div class="col-md-12 pl-0">
              
              <div
                v-for="(quest,index) in question.options" 
                :key="quest.index" class="answer-label-1"
              >
               <span v-if="quest.eligibile === 'Eligible'" class="fa fa-check-circle color_green"></span>
               <span v-if="quest.eligibile === 'Not Eligible'" class="fa fa-times-circle color_red"></span>
                <label class="ml-5 answer-label" v-html="quest.answer"></label>
              </div>
            </div>
            </div>
          </div>
          <div class="col-md-2 text-right pr-15">
            <button
              data-v-43b989c8 class="btn read-edit-btn mt-40 save_btn"
              v-on:click="editQuestion(index)" 
            >
              Edit
            </button>
          </div>
        </div>
   
        <!-- update sections extra------------------------ -->
        <div 
          v-if="(index === selectedQuestionIndex)" 
          class="homepahe-Rectangle-41 mt-10"
        >
          <div class="row">
            <div class="col-md-3 p-0">
              <select
                class="form-control Eligibility_questions_select"
                v-model="question.questionType"
                v-on:change="questionTypeChanged(questionTypes)"
              >
                <option
                  v-for="questionType in questionTypes"
                  :value="questionType.value"
                  :disabled="questionType.value === 'Default'"
                  :selected="questionType.value === 'Default'"
                >
                  {{questionType.label}}
                </option>
            </select>
          </div>
        </div>
        <!--Boolean type question START-->
        <div v-if="question.questionType === 'BooleanQuestion'" class>
          <div class="row pt-15 ml-5">
            <div class="col-lg-12 p-0">
              <label class="content">Question</label>
              <quill-editor
                class="bg-white questions_section"
                :options="editorOptionForimageCaptureTitleHeadlineQuestion"
                v-model="question.question"
              ></quill-editor>
            </div>
          </div>
          <div class="row pt-15 ml-5">
            <div class="col-md-1 pt-40">{{ansyes}}</div>
            <div class="col-md-2 p-0">
              <label class="content">If selected</label>
              <select
                v-model="question.options[0].eligibile" 
                class="form-control Eligibility_if_select"
              >
                <option></option>
                <option>Eligible</option>
                <option>Not Eligible</option>
              </select>
            </div>
          </div>
          <div class="row pt-15 ml-5">
            <div class="col-md-1 pt-40">{{ansno}}</div>
              <div class="col-md-2 p-0">
                <label class="content">If selected</label>
                <select 
                  v-model="question.options[1].eligibile" 
                  class="form-control Eligibility_if_select"
                >
                <option></option>
                <option>Eligible</option>
                <option>Not Eligible</option>
              </select>
            </div>
          </div>
          <div class="row upload-web mt-25">
            <div class="col-lg-12 p-0 text-right">
              <button
                class="btn box-btn-save btn-success save_btn" 
                v-on:click="updateQuestion(index)"
              >
                Save
              </button>
              <button 
                v-if="questionsLength>1"
                data-v-6b4ae4ba class="btn btn-link color_red btn-remove ml-20"
                v-on:click="deletQuestion(index)"
              >
                <img data-v-6b4ae4ba src="static/img/delete.svg" />
              </button>
            </div>
          </div>
        </div>
        <!--Boolean type question END-->
        <!--MultiChoice type question START-->
        <div v-if="question.questionType === 'MultiChoiceQuestion'" class>
          <div class="row pt-15 ml-5">
            <div class="col-lg-12 p-0">
              <label class="content">Question</label>
              <quill-editor
                class="bg-white questions_section"
                :options="editorOptionForimageCaptureTitleHeadlineQuestion"
                v-model="question.question"
              ></quill-editor>
            </div>
          </div>
          <div v-if="question.options.length === 2">
            <div class="row pt-15 ml-5">
              <div class="col-lg-9 pl-0">
                <label class="content">Answers</label>
                <quill-editor
                  class="bg-white questions_section"
                  :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                  v-model="question.options[0].answer"
                ></quill-editor>
              </div>
              <div class="col-md-3 p-0">
                <label class="content">If selected</label>
                <select
                  class="form-control Eligibility_if_select"
                  v-model="question.options[0].eligibile"
                >
                  <option></option>
                  <option>Eligible</option>
                  <option>Not Eligible</option>
                </select>
              </div>
            </div>
            <div class="row pt-15 ml-5">
              <div class="col-lg-9 pl-0">
                <label class="content">Answers</label>
                <quill-editor
                  class="bg-white questions_section"
                  :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                  v-model="question.options[1].answer"
                ></quill-editor>
              </div>
              <div class="col-md-3 p-0">
                <label class="content">If selected</label>
                <select 
                  class="form-control Eligibility_if_select"
                  v-model="question.options[1].eligibile"
                >
                  <option></option>
                  <option>Eligible</option>
                  <option>Not Eligible</option>
                </select>
              </div>
            </div>
            </div>
            <div v-if="question.options.length > 2">
              <div
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
              >
                <div class="row pt-15 ml-5">
                  <div class="col-lg-9 pl-0">
                    <label class="content">Answers</label>
                    <quill-editor
                      class="bg-white questions_section"
                      :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                      v-model="option.answer"
                    ></quill-editor>
                 </div>
                <div class="col-md-3 p-0">
                  <label class="content">If selected</label>
                  <select
                    class="form-control Eligibility_if_select"
                    v-model="option.eligibile"
                  >
                    <option></option>
                    <option>Eligible</option>
                    <option>Not Eligible</option>
                  </select>
                </div>
                <div class="col-md-12 col-sm-12 p-0">
                  <span 
                    v-if="optionIndex>1" 
                    class="cursor_pointer remove-color" 
                    v-on:click="removeAnswersToUpdate(index, optionIndex)"
                  >
                    Remove
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 p-0 mt-5">
              <a 
                class="participant-heading" 
                v-on:click="addAnotherUpdate(index)"
              >Add another answer</a>
            </div>
          </div>
          <div class="row upload-web mt-25">
            <div class="col-lg-12 p-0 text-right">
              <button 
                class="btn box-btn-save btn-success save_btn" 
                v-on:click="updateQuestion(index)"
              >
                Save
              </button>
              <button 
                v-if="questionsLength>1"
                data-v-6b4ae4ba
                class="btn btn-link color_red btn-remove ml-20"
                v-on:click="deletQuestion(index)"
              >
                <img data-v-6b4ae4ba src="static/img/delete.svg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <!-- Add  Extra Question -->
    <div v-if="showAddAnotherSection" class="homepahe-Rectangle-41 mt-10">
       <div class="row">
        <div class="col-md-3 p-0">
          <select
            class="form-control Eligibility_questions_select"
            v-model="addQuestion"
            v-on:change="questionTypeChanged(questionTypes)"
          >
            <option
              v-for="questionType in questionTypes"
              :value="questionType.value"
              :disabled="questionType.value === 'Default'"
              :selected="questionType.value === 'Default'"
            >{{questionType.label}}</option>
          </select>
        </div>
      </div>
      <!--Boolean type question START-->
      <div v-if="addQuestion === selectedBooleanQuestion.questionType" class>
        <div class="row pt-15 ml-5">
          <div class="col-lg-12 p-0">
            <label class="content">Question</label>
            <quill-editor
              class="bg-white questions_section"
              :options="editorOptionForimageCaptureTitleHeadlineQuestion"
              v-model="selectedBooleanQuestion.question"
            ></quill-editor>
          </div>
        </div>
        <div class="row pt-15 ml-5">
          <div class="col-md-1 pt-40">{{ansyes}}</div>
          <div class="col-md-2 p-0">
            <label class="content">If selected</label>
            <select
              v-model="selectedBooleanQuestion.options[0].eligibile" 
              class="form-control Eligibility_if_select"
            >
              <option></option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
        </div>
        <div class="row pt-15 ml-5">
          <div class="col-md-1 pt-40">{{ansno}}</div>
          <div class="col-md-2 p-0">
            <label class="content">If selected</label>
            <select
              v-model="selectedBooleanQuestion.options[1].eligibile" 
              class="form-control Eligibility_if_select"
            >
              <option></option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
        </div>
        <div class="row upload-web mt-25">
          <div class="col-lg-12 p-0 text-right">
            <button 
              class="btn box-btn-save btn-success save_btn" 
              v-on:click="saveQuestions(addQuestion)"
            >
              Save
            </button>
            <button
              data-v-6b4ae4ba
              class="btn btn-link color_red btn-remove ml-20"
              v-on:click="deletAddAnotherQuestions()">
              <img data-v-6b4ae4ba src="static/img/delete.svg" />
            </button>
          </div>
        </div>
      </div>
      <!--Boolean type question END-->
      <!--MultiChoice type question START-->
      <div v-if="addQuestion === selectedMultiChoiceQuestion.questionType">
        <div class="row pt-15 ml-5">
          <div class="col-lg-12 p-0">
            <label class="content">Question</label>
            <quill-editor
              class="bg-white questions_section"
              :options="editorOptionForimageCaptureTitleHeadlineQuestion"
              v-model="selectedMultiChoiceQuestion.question"
            ></quill-editor>
          </div>
        </div>
        <div v-if="selectedMultiChoiceQuestion.options.length === 2">
          <div class="row pt-15 ml-5">
            <div class="col-lg-9 pl-0">
              <label class="content">Answers</label>
              <quill-editor
                class="bg-white questions_section"
                :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                v-model="selectedMultiChoiceQuestion.options[0].answer"
              ></quill-editor>
            </div>
            <div class="col-md-3 p-0">
              <label class="content">If selected</label>
              <select 
                class="form-control Eligibility_if_select"
                v-model="selectedMultiChoiceQuestion.options[0].eligibile">
                <option></option>
                <option>Eligible</option>
                <option>Not Eligible</option>
              </select>
            </div>
          </div>
          <div class="row pt-15 ml-5">
            <div class="col-lg-9 pl-0">
              <label class="content">Answers</label>
              <quill-editor
                class="bg-white questions_section"
                :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                v-model="selectedMultiChoiceQuestion.options[1].answer"
              ></quill-editor>
            </div>
            <div class="col-md-3 p-0">
              <!-- <p class="content"> </p> -->
              <label class="content">If selected</label>
              <select 
                class="form-control Eligibility_if_select"
                v-model="selectedMultiChoiceQuestion.options[1].eligibile" >
                <option></option>
                <option>Eligible</option>
                <option>Not Eligible</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="selectedMultiChoiceQuestion.options.length > 2">
          <div 
            v-for="(option, index) in selectedMultiChoiceQuestion.options"
            :key="index">
            <div class="row pt-15 ml-5">
              <div class="col-lg-9 pl-0">
                <label class="content">Answers</label>
                <quill-editor
                  class="bg-white questions_section"
                  :options="editorOptionForimageCaptureTitleHeadlineAnswer"
                  v-model="selectedMultiChoiceQuestion.options[index].answer"
                ></quill-editor>
              </div>
              <div class="col-md-3 p-0">
                <label class="content">If selected</label>
                <select 
                  class="form-control Eligibility_if_select"
                  v-model="selectedMultiChoiceQuestion.options[index].eligibile" >
                  <option></option>
                  <option>Eligible</option>
                  <option>Not Eligible</option>
                </select>
              </div>
              <div class="col-md-12 col-sm-12 p-0">
                <span
                  v-if="index>1"
                  class="cursor_pointer remove-color"
                  v-on:click="removeAnswers(index)"
                >
                  Remove
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 p-0 mt-5">
            <a
              class="participant-heading" 
              v-on:click="addAnother()" 
            >
              Add another answer
            </a>
          </div>
        </div>
        <div class="row upload-web mt-25">
          <div class="col-lg-12 p-0 text-right">
            <button
              class="btn box-btn-save btn-success save_btn" 
              v-on:click="saveQuestions(addQuestion)"
            >
              Save
            </button>
            <button
              data-v-6b4ae4ba class="btn btn-link color_red btn-remove ml-20"
              v-on:click="deletAddAnotherQuestions()">
              <img data-v-6b4ae4ba src="static/img/delete.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      v-on:click="addSection(true)" 
      class="add-section-btn"
    >
      Add another section
    </button>

    <!-- edit section body  -->

    <!-- Eligibility failure message page.-------------- -->

    <div class="header-eligibility mt-30 mb-10">
      Eligibility failure message
      <span
        v-b-popover.hover="'Enter the message enrollees will see when they have been determined as ineligible for the study. You can enter a headline and text. Both fields are required and include text formatting.'"
        class="fa fa-info-circle color_grey ml-4"
      ></span>
    </div>
    <div 
      v-if="showFailureSection===true" 
      class="homepage-Rectangle-41"
    >
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <label class="content">Headline</label>
          <quill-editor
            name="study-name"
            class="bg-white"
            v-model="eligibilityScreen.failureHeadline"
            :options="editorOptionForimageCaptureTitleSubHeadline"
          ></quill-editor>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 additioanal_copy p-0">
          <label class="content">Body copy</label>
          <quill-editor
            name="study-name"
            class="bg-white instruction-screen"
            v-model="eligibilityScreen.failureBodyCopy"
            :options="editorOptionForimageCaptureTitleBodyCopy"
          ></quill-editor>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 p-0 mt-20 text-right">
          <button
            class="btn box-btn-save btn-success save_btn"
            v-on:click="saveFailureMessage()"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- edit section starts body content -->
    <div 
      v-if="showFailureSection === false" 
      class="homepage-Rectangle-41"
    >
      <div></div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <p class="bold-style homepage-read-edit-body" v-html="eligibilityScreen.failureHeadline"></p>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <p class="homepage-read-edit-body" v-html="eligibilityScreen.failureBodyCopy"></p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 p-0 mt-20 text-right">
          <button
            class="btn read-edit-btn save_btn"
            v-on:click="editFailureMessageSection()"
          >Edit</button>
        </div>
      </div>
    </div>
    <div class="next-screen-btn-div text-right">
      <button
        class="btn box-btn-next btn-success save_btn mb-40 mt-36"
        v-on:click="screenNext()"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>

import toastr from "toastr";
import Papa from "papaparse";
import FileSaver from "file-saver";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import { AclRule } from "vue-acl";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import { mapGetters } from "vuex";
import {
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  HOME_HEALTH,
  QUALITY,
  CRA,
  DM
} from "@/constants/authRoles";
import mainHeader from "../common/main-header";
import sideMenu from "../common/side-menu";
import moment from "moment";

let dynamicInputID = 0;
export default {
  name: "homep",
  components: { mainHeader, sideMenu },
  props: {
    studyData: Object
  },
  data() {
    return {
      createMode: true,
      eligibilityScreen: {
        pageTitle: "",
        headline: "",
        failureHeadline: "",
        failureBodyCopy: "",
        bodyCopy: "",
        questions: [],
        bodyCopyContent: "",
      },
      selectedMultiChoiceQuestion: { 
        questionType: "MultiChoiceQuestion",
        question: "",
        options: [
          {
            answer: "",
            eligibile: ""
          },
          {
            answer: "",
            eligibile: ""
          },
        ]      
      },
      selectedBooleanQuestion: { 
        questionType: "BooleanQuestion",
        question: "",
        options: [
          {
            answer: "Yes",
            eligibile: ""
          },
          {
            answer: "No",
            eligibile: ""
          }
        ]      
      },
      showAddAnotherSection: false,
      questionsLength: 0,
      selectedQuestionIndex: null,
      studyDetails:{},

      selected: "",
      selecte: "",
      ansno: "No",
      ansyes: "Yes",
      addQuestion: "BooleanQuestion",
      questionTypes: [
        { value: "Default", label: "- Select a question type -" },
        { value: "BooleanQuestion", label: "Yes or No" },
        { value: "MultiChoiceQuestion", label: "Multiple Choice" }
      ],

      editorOptionForimageCaptureTitle: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }]]
        }
      },
      editorOptionForimageCaptureTitleHeadline: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleHeadlineQuestion: {
        placeholder: "Enter question",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleHeadlineAnswer: {
        placeholder: "Enter answer choice",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleSubHeadline: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleBodyCopy: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      showFailureSection: true,
      showEligibilityHeader: true,
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    userToken() {
      return this.token;
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    },
    canDMAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check("userAccess");
    },
    canCRAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check("userAccess");
    }
  },
  watch: {},
  
  methods: {
     getStudyDetails() {
      this.$api.getStudyDataFact(this.$route.params.studyId).then(response => {
      this.studyDetails = response.body;
      this.clientId = this.studyDetails.clientId;
      this.getAllEligibilityDetails();
      });
    },
    getAllEligibilityDetails() {
      if (this.$route.params.studyId) {
      this.$api
        .getParticipantWebEligibility(this.$route.params.studyId)
        .then(response => {
          if (response.data.data) {
            this.createMode = false;
            this.eligibilityScreen = {
              ...this.eligibilityScreen,
              pageTitle: response.data.data.pageTitle,
              headline: response.data.data.headline,
              failureHeadline: response.data.data.failureHeadline,
              failureBodyCopy: response.data.data.failureBodyCopy,
              bodyCopy: response.data.data.bodyCopy,
              questions: response.data.data.questions,
              bodyCopyContent: response.data.data.bodyCopyContent,
            };
            if(response.data.data.questions) {
            this.questionsLength = response.data.data.questions.length;
            }
            if (this.eligibilityScreen.pageTitle.length) {
              this.showEligibilityHeader = false;
            }
            if (this.eligibilityScreen.failureHeadline) {
              this.showFailureSection = false;
            }
          }
        })
        .catch(err => {
          throw err;
        });
      }
    },
    
    addAnotherUpdate(index) {
      this.eligibilityScreen.questions[index].options.push({
        answer: "",
        eligibile: ""
      })
    },

    addAnother() {
      this.selectedMultiChoiceQuestion.options.push({
        answer: "",
        eligibile: ""
      })  
    },

    removeAnswers(index) {
      this.selectedMultiChoiceQuestion.options.splice(index, 1);
    },

    removeAnswersToUpdate(index, optionIndex) {
      this.eligibilityScreen.questions[index].options.splice(optionIndex, 1);
    },

    addSection(value) {
      if (this.selectedQuestionIndex === null) {
        this.showAddAnotherSection = value;
      }
    },

    editQuestion(index) {
      if(this.showAddAnotherSection !== true) {
      this.selectedQuestionIndex = index;
      }
    },

    saveQuestions(addQuestion) {
      let answerErrorCheck = false;
      let eligibileErrorCheck = false;
      let isNotEligibleCheck = true;
      let addNewQuestion = {
        questions: {}
      };
      if(addQuestion === 'MultiChoiceQuestion') {
        addNewQuestion.questions = this.selectedMultiChoiceQuestion;

      }else if(addQuestion === 'BooleanQuestion') {
        addNewQuestion.questions = this.selectedBooleanQuestion;
      }
      if(!addNewQuestion.questions.question || addNewQuestion.questions.question.replace(/<(.|\n)*?>/g, '').trim().length === 0){
        toastr.error("Question is required");
        return;
      }
      addNewQuestion.questions.options.forEach((option) => {
        if(!option.answer || option.answer.replace(/<(.|\n)*?>/g, '').trim().length === 0){
          toastr.error("Answer is required");
          answerErrorCheck = true;
          return;
        }
      })  
      if(answerErrorCheck) return;

      addNewQuestion.questions.options.forEach((option) => {
        if(option.eligibile === ''){
          toastr.error("Eligibility setting is required.");
          eligibileErrorCheck = true;
          return;
        }
      })
      if(eligibileErrorCheck) return;
       addNewQuestion.questions.options.forEach((option) => {
        if(option.eligibile === 'Eligible'){
          isNotEligibleCheck = false;
          return;
        }
      })
      if(isNotEligibleCheck){
         toastr.error("At least one answer must be set as eligible.");
         return;
      } 
        addNewQuestion.created_by = this.user.id;
        addNewQuestion.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      if (this.$route.params.studyId) {
        this.$api.addParticipantWebEligibilityQuestion(this.$route.params.studyId, addNewQuestion)
        .then(response => {
          if (response) {
            this.eligibilityScreen.questions.push(response.data.data.questions);
            this.questionsLength = this.eligibilityScreen.questions.length;
            toastr.success("Eligibility question saved successfully");
            this.selectedMultiChoiceQuestion = { 
              questionType: "MultiChoiceQuestion",
              question: "",
              options: [
                {
                  answer: "",
                  eligibile: ""
                },
                {
                  answer: "",
                  eligibile: ""
                },
              ]      
            };
            this.selectedBooleanQuestion = { 
              questionType: "BooleanQuestion",
              question: "",
              options: [
                {
                  answer: "Yes",
                  eligibile: ""
                },
                {
                  answer: "No",
                  eligibile: ""
                }
              ]      
            };
            this.showAddAnotherSection = false;
            this.selectedQuestionIndex = null;
          }
        })
        .catch(err => {
          throw err;
        });
      }
    },

    updateQuestion(index) {
      let answerErrorCheck = false;
      let eligibileErrorCheck = false;
       let isNotEligibleCheck = true;
      let updatededQuestion = {
        questionIndexId: "",
        questions: {
		      questionType: "",
		      question: "",
		      options :[
           {
              answer: "Yes",
              eligibile: ""
            },
            {
              answer: "No",
              eligibile: ""
            }
          ],
	      }
      };
      if(this.eligibilityScreen.questions[index].questionType === 'BooleanQuestion') {
        updatededQuestion.questions.options[0].eligibile = this.eligibilityScreen.questions[index].options[0].eligibile;
        updatededQuestion.questions.options[1].eligibile = this.eligibilityScreen.questions[index].options[1].eligibile;
      }else if(this.eligibilityScreen.questions[index].questionType === 'MultiChoiceQuestion') {
        updatededQuestion.questions.options = this.eligibilityScreen.questions[index].options;
      }
      updatededQuestion.questionIndexId = index+1;
      updatededQuestion.questions.questionType = this.eligibilityScreen.questions[index].questionType;
      updatededQuestion.questions.question = this.eligibilityScreen.questions[index].question;
     
      if(!updatededQuestion.questions.question || updatededQuestion.questions.question.replace(/<(.|\n)*?>/g, '').trim().length === 0){
        toastr.error("Question is required");
        return;
      }

      updatededQuestion.questions.options.forEach((option) => {
        if(!option.answer || option.answer.replace(/<(.|\n)*?>/g, '').trim().length === 0){
          toastr.error("Answer is required");
          answerErrorCheck = true;
          return;
        }
      })
      if(answerErrorCheck) return;

      updatededQuestion.questions.options.forEach((option) => {
        if(option.eligibile === ''){
          toastr.error("Eligibility setting is required.");
          eligibileErrorCheck = true;
          return;
        }
      })
      if(eligibileErrorCheck) return;
      if(eligibileErrorCheck) return;
       updatededQuestion.questions.options.forEach((option) => {
        if(option.eligibile === 'Eligible'){
          isNotEligibleCheck = false;
          return;
        }
      })
      if(isNotEligibleCheck){
         toastr.error("At least one answer must be set as eligible.");
         return;
      } 
        updatededQuestion.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        updatededQuestion.modified_by = this.user.id;
      if (this.$route.params.studyId) {
        this.$api.updateParticipantWebEligibilityQuestion(this.$route.params.studyId, updatededQuestion)
        .then(response => {
          if (response.data.data) {
            this.createMode = false;
            this.eligibilityScreen.questions[index].questionIndexId = response.data.data.questionIndexId;
            this.eligibilityScreen.questions[index].questionType = response.data.data.questions.questionType
            this.eligibilityScreen.questions[index].question = response.data.data.questions.question;
            this.eligibilityScreen.questions[index].options = response.data.data.questions.options;
            this.questionsLength = this.eligibilityScreen.questions.length;
            toastr.success("Eligibility question updated successfully");
            if (this.eligibilityScreen.pageTitle) {
              this.showEligibilityHeader = false;
            }
            if (this.eligibilityScreen.failureHeadline) {
              this.showFailureSection = false;
            }
            updatededQuestion = {
              questionIndexId: "",
              questions: {
		            questionType: "",
		            question: "",
		            options :[],
	            }
            };
            this.selectedQuestionIndex = null;
          }
        })
        .catch(err => {
          throw err;
        });
      }
    },

    deletAddAnotherQuestions() {
      this.showAddAnotherSection = false;
      this.selectedMultiChoiceQuestion = { 
        questionType: "MultiChoiceQuestion",
        question: "",
        options: [
          {
             answer: "",
             eligibile: ""
          },
          {
             answer: "",
             eligibile: ""
          },
        ]      
      };
      this.selectedBooleanQuestion = { 
        questionType: "BooleanQuestion",
        question: "",
        options: [
          {
            answer: "Yes",
            eligibile: ""
          },
          {
            answer: "No",
            eligibile: ""
          }
        ]      
      };
    },

    deletQuestion(index) {
      let detetedQuestion = {
        questionIndexId: index+1,
      }
      if (this.createMode === true) {
        detetedQuestion.created_by = this.user.id;
        detetedQuestion.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      } else {
        detetedQuestion.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        detetedQuestion.modified_by = this.user.id;
      }
      if (this.$route.params.studyId) {
      this.$api.deleteParticipantWebEligibilityQuestion(this.$route.params.studyId, detetedQuestion)
        .then(response => {
          if (response.data.data) {
            this.createMode = false;
            this.eligibilityScreen.questions.splice(index, 1); 
            toastr.success("Eligibility question deleted successfully");
            if(this.eligibilityScreen.questions.length === 0) {
              this.questionsLength = null;
            }else {
            this.questionsLength = this.eligibilityScreen.questions.length;
            }
            if (this.eligibilityScreen.pageTitle) {
              this.showEligibilityHeader = false;
            }
            this.selectedMultiChoiceQuestion = { 
                questionType: "MultiChoiceQuestion",
                question: "",
                options: [
                  {
                    answer: "",
                    eligibile: ""
                  },
                  {
                    answer: "",
                    eligibile: ""
                  },
                ]      
              };
              this.selectedBooleanQuestion = { 
                questionType: "BooleanQuestion",
                question: "",
                options: [
                  {
                    answer: "Yes",
                    eligibile: ""
                  },
                  {
                    answer: "No",
                    eligibile: ""
                  }
                ]      
              };
              this.showAddAnotherSection = false;
              this.selectedQuestionIndex = null;
          }
        })
        .catch(err => {
          throw err;
        });
      }
    },
    editHeaderContent() {
      this.showEligibilityHeader = true;
    },
    saveHeaderSection() {
      if (!this.eligibilityScreen.pageTitle || this.eligibilityScreen.pageTitle.trim().length === 0) {
        toastr.error("Page title is required.");
        return;
      }
      if (!this.eligibilityScreen.headline || this.eligibilityScreen.headline.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Headline is required.");
        return;
      }
      if (!this.eligibilityScreen.bodyCopyContent || this.eligibilityScreen.bodyCopyContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Page copy is required.");
        return;
      }
      if (this.createMode === true) {
        this.eligibilityScreen.created_by = this.user.id;
        this.eligibilityScreen.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.eligibilityScreen.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        this.eligibilityScreen.modified_by = this.user.id;
      }

      if (this.$route.params.studyId) {
        this.$api
          .createParticipantWebEligibility(
            this.$route.params.studyId,
            this.eligibilityScreen
          )
          .then(response => {
            if (response) {
              this.eligibilityScreen = response.data.data;
              toastr.success("Eligibility header saved successfully");
            }
            if (this.eligibilityScreen.pageTitle) {
              this.showEligibilityHeader = false;
            }
          })
          .catch(err => {
            throw err;
          });
      }
    },
    saveFailureMessage() {
      if (!this.eligibilityScreen.failureHeadline || this.eligibilityScreen.failureHeadline.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Headline is required.");
        return;
      }
      if (!this.eligibilityScreen.failureBodyCopy || this.eligibilityScreen.failureBodyCopy.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Body copy is required.");
        return;
      }
      if (this.createMode === true) {
        this.eligibilityScreen.created_by = this.user.id;
        this.eligibilityScreen.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.eligibilityScreen.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        this.eligibilityScreen.modified_by = this.user.id;
      }

      if (this.$route.params.studyId) {
        this.$api
          .createParticipantWebEligibility(
            this.$route.params.studyId,
            this.eligibilityScreen
          )
          .then(response => {
            if (response) {
              this.eligibilityScreen = response.data.data;
              toastr.success("Eligibility failure message saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showFailureSection = false;
    },
    editFailureMessageSection() {
      this.showFailureSection = true;
    },
    questionTypeChanged(addEditQuestion) {
      if (addEditQuestion && addEditQuestion.type) {
        const questionType = addEditQuestion.type.toLowerCase();
        switch (questionType) {
          case "BooleanQuestion":
            this.addEditQuestion.options[0].body = "Yes";
            this.addEditQuestion.options[1].body = "No";
            this.addEditQuestion.options[0].formattedBody = "Yes";
            this.addEditQuestion.options[1].formattedBody = "No";

            break;
          case "MultiChoiceQuestion":
            this.addEditQuestion.options[0].body =
              this.addEditQuestion.options[0].body || "";
            this.addEditQuestion.options[1].body =
              this.addEditQuestion.options[1].body || "";

            break;
          default:
            this.addEditQuestion.labels = [];
            break;
        }
      }
    },
    screenNext() {
      this.$router.push({
        name: "agreement",
        params: {
          studyId: this.studyId
        }
      });
    }
  },

  mounted() {
    window.scrollTo(0, 0);
    this.getStudyDetails();
    this.studyId = this.$route.params.studyId;
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body,
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
  flex: none;
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

.bold-style {
  font-size: 18px !important;
  font-weight: 700;
  line-height: 1.78;
  color: #666669;
}
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
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
    flex: none;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
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
  .col-md-6 {
    width: 50%;
  }
  .col-md-4 {
    width: 33.33333333%;
  }
  .col-md-8 {
    width: 66.66666667%;
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
    flex: none;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.row {
  clear: both;
}
.launch_status_section {
  background-color: #2d3752;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  padding: 21px;
  margin-bottom: 20px;
  font-size: 18px;
}
.draft-status {
  background-color: #48bf7a;
}
.draft-status-web {
  background-color: #668bbd;
}
.mobile-icon {
  position: absolute;
  top: -17px;
  left: 112px;
}
.consent-icon {
  position: absolute;
  top: 33px;
  left: 220px;
  width: 110px;
  height: 88px;
}
.like-icon {
  position: absolute;
  top: 85px;
  left: 69px;
}
.desktop-icon-web {
  position: absolute;
  top: -10px;
  left: 112px;
  width: 131px;
  height: 78px;
  object-fit: contain;
}
.nav-icon-web {
  position: absolute;
  top: 38px;
  left: 261px;
  width: 69px;
  height: 59px;
  object-fit: contain;
}
.globe-icon-web {
  position: absolute;
  top: 60px;
  left: 60px;
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.opacity-1 {
  opacity: 0.75 !important;
}
.provide-btn {
  background-color: #fff;
  color: #48bf7a;
}
.update-btn {
  background-color: #48bf7a;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}
.update-btn-web {
  background-color: #668bbd;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}

.fa-apple,
.fa-android,
.fa-cloud {
  color: #f16559;
  font-size: 24px;
  position: relative;
  top: 4px;
}

.status-strip {
  width: 80%;
  background: #fff;
  padding: 10px 0 10px 10px;
  color: #2d3752;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}
.completed_title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  max-width: 90%;
  cursor: pointer;
}
.status-strip-red {
  width: 80%;
  background: #f16559;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}

.color_green {
  color: #2ecc71;
}

.edit-color {
  color: #4c8ce4 !important;
  font-weight: normal;
}

.edit-color-white {
  color: #fff !important;
  font-weight: normal;
}

.contact_btn {
  border-radius: 100px;
  background-color: #34537d;
  color: #ffffff;
}
.export_btn {
  border-radius: 25px;
  background-color: #34537d !important;
  color: #ffffff;
  cursor: pointer;
}
.disable-export {
  background-color: #b8c7ce !important;
}

.download_btn {
  background-color: #4c8ce4;
  color: #ffffff;
  cursor: pointer;
}
.remove-color {
  color: #ff4848;
  font-weight: normal;
  font-size: 12px;
}
.pop-color {
  color: #666669 !important;
}

.close-btn {
  background: #d3dfe4;
  color: #666669;
}

.padding_top_10px {
  padding-top: 10px;
}

.padding_top_20px {
  padding-top: 20px;
}

.donut_graph_panel {
  height: 184px;
}

.dashboard {
  display: flex;
  background-color: #f5f8fa;
}
.graph_val {
  position: relative;
  top: 2px;
}
.remaining_days_text {
  font-size: 12px;
  color: #666769;
}
.reverse {
  transform: rotate(180deg);
}

.remaining_days_graph {
  width: 200px;
  height: 80px;
}
.item_bg_color {
  border-radius: 3px;
  background-color: #eaf0f4;
  color: #707c81;
  padding: 4px 10px;
  font-size: 12px;
  margin: 0 4px 4px 0;
  display: inline-block;
}
.arrow {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 74px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.panel {
  border-radius: 2px;
  margin-bottom: 10px;
}

.panel_height {
  height: 100%;
  min-height: 260px;
  position: relative;
}
.panel_height_half {
  height: 100%;
  min-height: 130px;
  position: relative;
}
.panel-body {
  padding: 16px;
}
.Rectangle-41 {
  width: 1078px;
  height: 291px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  width: 1291px;
  margin-left: 32px;
  background-color: #f5f8fa;
  margin-left: 32px;
  padding-left: 30px;
}
.header {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  color: #666669;
  margin-top: 22px;
}
.header-eligibility {
  font-family: RobotoBold;
  font-size: 14px;
  font-weight: 500;
  color: #666669;
  margin-top: 12px;
}
.Intro-copy {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #666669;
  margin-top: 26px;
  margin-bottom: 16px;
}
.arrow2 {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 17px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.questions {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
.btn-close-tutorial {
  position: relative;
  right: -136px;
  border: none;
  background-color: transparent;
  font-family: RobotoRegular;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-top: -10px;
  color: #fff;
  z-index: 1002;
  margin-left: 919px;
}
.instruction_title {
  word-break: break-word;
  width: 307px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #000000;
    text-align: justify;
}
.participant-heading {
  font-family: RobotoRegular;
  color: #4c8ce4 !important;
  font-size: 12px !important;
  text-decoration: none;
  cursor: pointer;
}
.rectangle {
  width: 1140px;
  height: 1893px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.custom-popover2 {
  position: absolute;
  width: 490px;
  border-radius: 3px;
  padding: 10px;
  left: 27px !important;
  top: -42px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.custom-popover {
  position: absolute;
  width: 669px;
  border-radius: 3px;
  padding: 10px;
  left: 28px !important;
  top: -99px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.compliance_section {
  .adherence {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
    .percentage {
      color: #666669;
      font-size: 28px;
      font-weight: bold;
    }
    .desc {
      color: #666669;
      font-size: 12px;
    }
  }
  .tasks {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
  }
}

.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}
.primaryBgColor {
  background-color: #4c8ce4;
}
@media (max-width: 575px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .graph_padding {
    padding-top: 0px;
  }
  .graph_legend_padding {
    padding-top: 10px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .graph_padding {
    padding-top: 50px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}

@media (min-width: 1200px) {
  .graph_padding {
    padding-top: 80px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}
.btn-skip-tutorial {
  height: 28px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #4c8ce3;
  background-color: #fff;
  border: none;
  margin-left: 37px;
  margin-top: 572px;
  position: absolute;
  z-index: 1002;
  margin-bottom: -21px;
}

.data-input-div {
  margin: 0 auto;
}

.input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.cancel-image {
  float: right;
  cursor: pointer;
}
.sftp-header1 {
  font-size: 16px;
  font-family: "RobotoMedium";
  color: "#4a4a4a";
}

.sftp-header2 {
  font-size: 14px;
  font-family: "RobotoRegular";
  color: "#666669";
}

.modal-dialog {
  max-width: 600px !important;
}

.continue-button {
  width: 60%;
  margin: 0 auto !important;
}

.continue-button button {
  width: 48%;
  margin-top: 30px;
  cursor: pointer;
}

.continue-transfer {
  width: 40%;
  margin: 0 auto !important;
}

.continue-transfer button {
  width: 100%;
  margin-top: 50px;
  cursor: pointer;
}
.disconnect {
  color: #f16559 !important;
  font-family: "RobotoRegular" !important;
  cursor: pointer;
}

.modify {
  color: #4c8ce4;
  cursor: pointer;
}

.connection-label {
  font-family: "RobotoBold";
  float: left;
  width: 33%;
}

.connection-content {
  width: 66%;
  float: left;
}

.transfer-on {
  background-color: #48bf7a !important;
}

.cancel_btn {
  background-color: #959fa4;
  color: #ffffff;
}

.text-font {
  font-size: 16px;
  font-family: "RobotoMedium";
}

.details-div ul {
  list-style-type: none;
  padding: 0;
}
.nav-bar .nav-link.active {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
  font-weight: bold;
}
.nav-bar .nav-link {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
}
.has-sidemenus {
  margin-left: 0px !important;
  margin-top: 0px !important;
  padding-top: 0px !important;
}

// Css for global element
.name {
  width: 259px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.content {
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 4px;
}
.box {
  width: 350px;
  height: 40px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  padding: 10px 8px;
}
.color-palette {
  width: 259px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.choose-a-primary-col {
  width: 145px;
  height: 15px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.rectangle-4 {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
  background-color: #ffffff;
  margin: 10px;
}
.choose-a-secondary-col {
  width: 162px;
  height: 16px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}

.box-color {
  width: 150px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  padding: 10px 8px;
}
.box {
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  width: 350px;
  height: 40px;
}
.logo-icon {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: 600;
  color: #666669;
  margin-bottom: 5px;
}
.rectangle-7 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  padding-bottom: 29px;
  border: none;
  margin-right: 7px;
}
.rectangle-79 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  border: none;
  margin-left: -40px;
}
.rectangle-9 {
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  padding-bottom: 29px;
  border: none;
  margin-left: 8px;
}
.rectangle-38 {
  width: 140px;
  height: 64px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -15px;
}
.upload-your-study-logo {
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.recommended-by {
  display: block;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 11px;
  color: #666669;
  margin-top: 4px;
}
.homepage-rectangle-footer {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  margin-left: 29px;
  padding: 15px 5px;
}
.box-btn-save {
  width: 120px;
  height: 36px;
  background-color: #48bf7a;
  border-radius: 25px;
}
.info-screen {
  width: 258.5px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}

.info-content {
  margin-left: 32px;
  margin-top: 32px;
}
.box-edit {
  width: 1038px;
  height: 90px;
  border-radius: 3px;
  background-color: #ffffff;
}

.lable-content {
  width: 398px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.box-content {
  width: 495.3px;
  height: 54px;
  border-radius: 3px;
  background-color: #ffffff;
}
.footer-content-box {
  height: 217px;
}

// homepage styling

.homepage-box {
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepahe-Rectangle-41 {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 20px 20px;
}
.homepage-content-additional-input {
  width: 1078px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
  width: 100%;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-content-additional {
  width: 100%;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-content-additional-body {
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-para {
  margin-bottom: 10px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #949496;
}
.homepage-para-2 {
  margin-bottom: 10px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.homepage-para-body-content {
  margin-left: 32px;
  margin-bottom: 10px;
  margin-left: 32px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.homepage-logo-icon {
  margin-top: 5px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  line-height: 2.29;
  color: #666669;
}
.homepage-rectangle-38 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -38px;
}
.homepage-rectangle-380 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
}
.header-body-content {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: 600;
  color: #666669;
  margin-left: 32px;
}
.callout-section {
  width: 1090px;
}
.callout-title-para {
  width: 307px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 4px;
}
.callout-body-input {
  width: 325px;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dee3;
}
.homepage-Rectangle-41 {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 20px 20px;
}
.callout-copy-input {
  width: 325px;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dee3;
}

// read only section
.homepage-read-edit-body {
  font-size: 14px;
  width: 90%;
  word-break: break-word;
    text-align: justify;
}
.read-edit-btn {
  background-color: #fff !important;
  border: 2px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  width: 70px;
  height: 30px;
  display: inline-block;
  padding: 0;
}
.add-section-btn {
  background-color: #fff !important;
  border: 1px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  height: 30px;
  display: inline-block;
  font-family: RobotoRegular;
  font-size: 12px;
  margin-top: 14px;
}

.content-edit {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: normal;
  color: #666669;
  word-wrap: anywhere;
}
.content-body-edit {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}
.btn-edit-feature {
  width: 206px;
  height: 39px;
  background-color: #959fa4;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
  img {
    -webkit-filter: brightness(0) invert(1);
    filter: brightness(0) invert(1);
  }
}
.selected_icon_logo_image img {
  -webkit-filter: brightness(0) invert(1);
  filter: brightness(0) invert(1);
}
.callout-title-para-edit {
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #000000;
}
.color_grey {
  font-weight: bold;
  color: #b5bcc0 !important;
  font-size: 18px;
}
.color-grey {
  cursor: pointer;
  opacity: 0.6;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  line-height: 2.33;
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
.box-btn-next {
  width: 150px;
  height: 36px;
  background-color: #4c8ce4 !important;
  border-radius: 25px;
}

/deep/ .quill-editor {
  &.bg-white {
    position: relative;
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border-bottom: none;
        border-top: none;
        padding: 4px;
        float: right;
        border: none;
        z-index: 9;
        position: relative;
        margin-top: 10px;
        margin-right: 10px;
        .ql-formats:first-child {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          border-right: none;
        }
        .ql-formats:last-child {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
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
      color: #000;
      font-family: RobotoRegular;
      font-weight: normal;
      border: solid 2px #d3dfe4;
      border-radius: 4px;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: 54px;
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
        min-height: 110px;
      }
    }
  }
}

/deep/ .quill-editor {
  &.questions_section {
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border-bottom: none;
        border-top: none;
        padding: 4px;
        float: right;
        border: none;
        z-index: 9;
        position: relative;
        margin-top: 7px;
        margin-right: 10px;
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }
      }
    }
    .ql-container {
      font-family: RobotoRegular;
      font-weight: normal;
      border: solid 2px #d3dfe4;
      border-radius: 3px;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: 48px;
        min-height: 0px;
      }
    }
  }
}

.file-input {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  width: 84%;
  height: 30px;
}
.file-input-callout-1 {
  position: absolute;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  margin-right: 88px;
  width: 100%;
}
.upload-and-save-btn-box {
  width: 250px;
}
.selectLibrary {
  border-radius: 3px;
  background-color: #d3dfe4;
  padding: 5px 10px;
  overflow: hidden;
  border: none;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
  width: 142px;
  display: inline-block;
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
.modal_content {
  color: #666769;
  font-weight: 500;
}
.modal_close_icon {
  cursor: pointer;
  font-size: 24px;
}
@media (min-width: 768px) {
  .modal-dialog {
    max-width: 600px;
    margin: 30px auto;
  }
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
.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: red;
  opacity: 1; /* Firefox */
}
textarea::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.additioanal_copy .quill-editor.bg-white {
  resize: both;
  overflow: auto;
}
.form-control.Eligibility_questions_select {
  height: 40px !important;
  width: 200px;
  border: solid 2px #d3dfe4;
}
.Eligibility_if_select {
  height: 50px !important;
  border: solid 2px #d3dfe4;
  border-radius: 4px;
}
.btn-remove {
  margin-top: 0;
  vertical-align: middle;
  padding: 5px;
  border: 1px solid #d3dfe4;
  background: #d3dfe4;
  opacity: 0.6;
  border-radius: 4px;
  &.sponsor-del {
    margin-top: 40px;
  }
}
.form-control {
  font-family: RobotoRegular !important;
}
.answer-label p {
    margin-bottom: 0;
}
.answer-label-1 {
    float: left;
    width: auto;
    margin-right: 20px;
}
</style>