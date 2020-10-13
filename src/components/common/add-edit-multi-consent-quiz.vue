<template>
  <div class="add-edit-quiz-card">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
      <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 p-0">
        <select class="form-control type_select" v-model="addEditQuestion.type" v-on:change="questionTypeChanged(addEditQuestion)">
          <option v-for="questionType in questionTypes" :value="questionType.value"
          :disabled="questionType.value === 'default'" :selected="questionType.value === 'default'">{{questionType.label}}</option>
        </select>
      </div>
    </div>
    <div class="pt-10 pb-10 clearfix" v-if="addEditQuestion.type">
      <h4>Question:</h4>
      <div><input type="text" class="form-control" placeholder="Enter your question" v-model="addEditQuestion.body"></div>
    </div>

    <!--SingleChoice type question START-->
    <div v-if="addEditQuestion.type === 'singleChoice'" class="">
      <div class="row">
        <div class="col-lg-9 col-md-9 col-sm-9 col-xs-6 p-0">
          <h4>Answers:</h4>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 text-center">
          <h6>Select Correct Answer:</h6>
        </div>
      </div>
      <div class="row form-group" v-for="option in addEditQuestion.options">
        <div class="col-lg-9 col-md-9 col-sm-9 col-xs-8 p-0">
          <input type="text" class="form-control input-style" placeholder="Enter an answer choice" v-model="option.body">
        </div>
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-4 radio-style text-center">
          <input type="radio" v-model="addEditQuestion.expectedAnswer" :value="option.sequence" />
        </div>
      </div>
      <div class="link-style"><a v-on:click="addAnotherAnswer">Add another answer</a></div>
    </div>
    <!--SingleChoice type question END-->

    <!--Boolean type question START-->
    <div v-if="addEditQuestion.type === 'boolean'" class="">
      <div class="row">
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 p-0">
          <h4>Answers:</h4>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 text-center">
          <h6>Select Correct Answer:</h6>
        </div>
      </div>
      <div class="row form-group p-0">
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 p-0 pr-45">
          {{addEditQuestion.options[0].body}}
        </div>
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 radio-style">
          <input type="radio" v-model="addEditQuestion.expectedAnswer" :value="addEditQuestion.options[0].sequence" />
        </div>
      </div>
      <div class="row form-group padding-top">
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 p-0 pr-45">
          {{addEditQuestion.options[1].body}}
        </div>
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 radio-style">
          <input type="radio" v-model="addEditQuestion.expectedAnswer" :value="addEditQuestion.options[1].sequence" />
        </div>
      </div>
    </div>
    <!--Boolean type question END-->
    <!--Instruction question START-->
    <div v-if="addEditQuestion.type === 'instruction'" class="">
      <h4>Description:</h4>
      <textarea class="form-control" rows="4" cols="126" v-model="addEditQuestion.description"></textarea>
    </div>
    <!--Boolean type question END-->
    <div class="row pt-20">
      <div class="col-lg-9 col-md-9 col-sm-6 col-xs-2 p-0">
        <button class="btn btn-link pb-15 color_red pl-0" v-on:click="deleteQuestion()">Delete</button>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-10 text-right p-0">
        <button class="btn btn-link pb-15 color_aa" v-on:click="cancelQuestion()">Cancel</button>
        <button class="btn btn-success save_btn mb-10 br-30" v-on:click="saveQuestion()">Save</button>
      </div>
    </div>
  </div>
</template>



<script>
import _ from 'lodash';
import toastr from 'toastr';
import swal from 'sweetalert2';

export default {
  name: 'add-edit-questions',
  data() {
    return {
      surveyDetails: null,
      questionTypes: [
        { value: 'default', label: '- Select -' },
        { value: 'singleChoice', label: 'Single Choice' },
        { value: 'boolean', label: 'Yes or No' },
      ],
      addEditQuestion: this.options,
      expectedAnswer: '',
      allQuestions: null,
    };
  },
  props: ['options'],
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.questionTypeChanged(this.addEditQuestion);
  },
  methods: {
    questionTypeChanged(addEditQuestion) {
      const isBooleanType =
        addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'boolean';
      if (this.addEditQuestion.options
        && this.addEditQuestion.options.length > 0
        && isBooleanType) {
        this.addEditQuestion.options[0].body = isBooleanType
          ? 'Yes'
          : this.addEditQuestion.options[0].body || '';
        this.addEditQuestion.options[1].body = isBooleanType
          ? 'No'
          : this.addEditQuestion.options[1].body || '';
      } else if (addEditQuestion.type === 'singleChoice') {
        this.addEditQuestion = this.addEditQuestion;
      } else {
        this.addEditQuestion.options = [{ body: '', sequence: 1 }, { body: '', sequence: 2 }];
      }
    },
    addAnotherAnswer() {
      if (!this.addEditQuestion.options) {
        this.addEditQuestion.options = [];
      }
      this.addEditQuestion.options.push({
        body: null,
        sequence: this.addEditQuestion.options.length + 1,
      });
    },
    checkQuestionValidity(question) {
      let validQuestion = true;
      switch (question.type) {
        case 'singleChoice':
          _.forEach(question.options, value => {
            if (!value.body) {
              validQuestion = false;
            }
          });
          return (
            validQuestion &&
            (question.body && question.expectedAnswer && question.options.length > 1)
          ); // eslint-disable-line
        // break;
        case 'boolean':
          _.forEach(question.options, value => {
            if (!value.body) {
              validQuestion = false;
            }
          });
          return (
            validQuestion &&
            (question.body && question.expectedAnswer && question.options.length === 2)
          ); // eslint-disable-line
        // break;
        default:
          return false;
      }
    },
    deleteQuestion() {
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
          this.$store.dispatch('addConsentQuizAction', null);
          this.addEditQuestion.opType = 'delete';
          this.$store.dispatch('addConsentQuizAction', this.addEditQuestion);
        }
      });
    },
    saveQuestion() {
      const validQuestion = this.checkQuestionValidity(this.addEditQuestion);
      if (validQuestion) {
        this.addEditQuestion.opType = 'done';
        if (this.addEditQuestion.sectionId) {
          this.$store.dispatch('addConsentQuizAction', null);
        }
        this.$store.dispatch('addConsentQuizAction', this.addEditQuestion);
      } else {
        toastr.error('Please configure all required question elements.');
      }
    },
    cancelQuestion() {
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
          this.$store.dispatch('addConsentQuizAction', { opType: 'none' });
        }
      });
    },
  },
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

.add-edit-quiz-card {
  background-color: #f6fafc;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  display: block;
  .type_select {
    border-radius: 0 !important;
  }
  .radio-style {
    top: 5px;
    text-align: center;
  }
  .save_btn {
    width: 100px;
  }
  .form-control,
  .input-text {
    border-radius: 2px !important;
  }
}
input[type='radio'] {
  border: 0px;
  height: 20px;
}

.link-style {
  font-size: 14px;
  color: #1f95f2;
  cursor: pointer;
}

button:hover{
  opacity: 0.5;
}
</style>
