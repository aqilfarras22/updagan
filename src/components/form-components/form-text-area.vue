<template>
  <div class="primaryBackGround">
    <div class="formTextArea form-bg">
      <b-form class="pt-16 pl-20 pb-20">
        <span class="sequence-style"><b>{{formTextArea.sequence}}. </b></span>
        <b-row class="pl-15 pr-15 pb-15 pt-0">
            <b-form-input id="textAreaQuestion" type="text" class="fs-15 ml-10 field-h40 form-control mb-10" v-model="formTextArea.body" placeholder="Enter question or description" size="sm" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText" autocomplete="off">
            </b-form-input>
            <span v-if="validateQuestion" class="error-style ml-10">Question cannot be empty.</span>
        </b-row>
        <b-row class="pl-25 pr-15 pb-5 pt-10">
            <b-form-textarea class="fs-15 form-control field-h40" :disabled="true" :rows="formTextArea.noOfLines" :placeholder="formTextArea.placeholder" autocomplete="off">
            </b-form-textarea>
        </b-row>
      </b-form>
        <hr class="m-0">
        <b-row class="pt-15 pl-35 fs-13">
            <b-col cols="12" lg="4" class="pt-10 pl-0">
                <div class="bright">
                <div class="pb-10">
                    <b class="fs-13">Allowed Characters</b><br></div>
                <b-row>
                    <b-form-checkbox v-model="formTextArea.constraint.lettersAllowed" id="textAreaLettersAllowed" class="pl-0">
                    </b-form-checkbox>
                    <label for="textAreaLettersAllowed" class="pl-8 fs-15 pt-2 text-align">Letters(abc)</label>
                </b-row>
                <b-row>
                    <b-form-checkbox v-model="formTextArea.constraint.numbersAllowed" id="textAreaNumbersAllowed" class="pl-0">
                    </b-form-checkbox><br>
                    <label for="textAreaNumbersAllowed" class="pl-8 fs-15 pt-2 text-align">Numbers(123)</label>
                </b-row>
                <b-row>
                    <b-form-checkbox v-model="formTextArea.constraint.specialCharactersAllowed" id="textAreaSpecialCharsAllowed" class="pl-0">
                    </b-form-checkbox><br>
                    <label for="textAreaSpecialCharsAllowed" class="pl-8 fs-15 pt-2 text-align">Special characters(!@#)</label>
                </b-row>
                </div>
            </b-col>
            <b-col cols="12" lg="2" class="pt-10 pl-4">
                <div class="bright">
                    <div class="pb-10">
                        <label for="textAreaNoOfLinesSelect" class="font-weight-bold mb-0 fs-13"># of lines to display</label>
                    </div>
                    <b-row class="fs-12">
                        <b-col cols="4" lg="2">
                            <b-form-select v-model="formTextArea.noOfLines" id="textAreaNoOfLinesSelect" class="mb-5 fs-12 field-select" size="sm">
                                <option v-for="(line, index) in noOfLines" :key="index" :value="line">{{line}}
                                </option>
                            </b-form-select>
                        </b-col>
                    </b-row>
                </div>
            </b-col>
          <!-- For text constraints -->
        <b-col cols="12" lg="6" class="pt-10 pl-4" v-if="formTextArea.constraint.lettersAllowed || formTextArea.constraint.specialCharactersAllowed">
          <div class="pb-10 fs-13">
            <b>Character Text</b>
          </div>
          <b-row>
            <b-col cols="12" lg="6" class="pl-0">
              <switches id="scaleMinCharacters" v-model="formTextArea.constraint.minCharsFlag" theme="custom" color="blue" @change="formTextArea.constraint.minCharsFlag = !formTextArea.constraint.minCharsFlag"></switches>
              <span for="scaleMinCharacters" class="pl-8 fs-15">Min characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" min="0" class="fs-15 form-control field-h40 mt-10" placeholder="0" v-model="formTextArea.constraint.minChars" v-if="formTextArea.constraint.minCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMin" v-bind:class="{'input': true, 'is-danger': errors.has('charMin')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="6" class="pl-0">
              <switches id="scaleMaxCharacters" v-model="formTextArea.constraint.maxCharsFlag" theme="custom" color="blue" @change="formTextArea.constraint.maxCharsFlag = !formTextArea.constraint.maxCharsFlag"></switches>
              <span for="scaleMaxCharacters" class="pl-8 fs-15">Max characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40 mt-10" min="0" placeholder="250" v-model="formTextArea.constraint.maxChars" v-if="formTextArea.constraint.maxCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMax" v-bind:class="{'input': true, 'is-danger': errors.has('charMax')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
                <!-- For Numeric constraints -->
        <b-col cols="12" lg="6" class="pt-10 pl-4" v-if="!formTextArea.constraint.lettersAllowed && !formTextArea.constraint.specialCharactersAllowed && formTextArea.constraint.numbersAllowed">
          <div class="pb-10 fs-13">
            <b>Validation</b>
          </div>
          <b-row>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="formTextArea.constraint.minLimitFlag" theme="custom" color="blue" @change="formTextArea.constraint.minLimitFlag = !formTextArea.constraint.minLimitFlag"></switches>
              <span class="pl-8 fa-15">Min value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40 mt-10" placeholder="0" min="0" v-model="formTextArea.constraint.minLimit" v-if="formTextArea.constraint.minLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMin" v-bind:class="{'input': true, 'is-danger': errors.has('numberMin')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="formTextArea.constraint.maxLimitFlag" theme="custom" color="blue" @change="formTextArea.constraint.maxLimitFlag = !formTextArea.constraint.maxLimitFlag"></switches>
              <span class="pl-8 fs-15">Max value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-13 form-control field-h40 mt-10" placeholder="10" min="0" v-model="formTextArea.constraint.maxLimit" v-if="formTextArea.constraint.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="formTextArea.constraint.decimalLimitFlag" theme="custom" color="blue" @change="formTextArea.constraint.decimalLimitFlag  = !formTextArea.constraint.decimalLimitFlag "></switches>
              <span class="pl-8"># of decimal places</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40 mt-10" placeholder="4" min="0" v-model="formTextArea.constraint.decimalLimit" v-if="formTextArea.constraint.decimalLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberDecimals" v-bind:class="{'input': true, 'is-danger': errors.has('numberDecimals')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
        </b-row>
        <b-row class="fs-13 pl-35 pt-15 fw-bold">
          <label for="textAreaAnswerField">Placeholder</label>
        </b-row>
        <b-row class="fs-12 pl-20">
          <b-col cols="8" lg="8">
            <b-form-input v-model="formTextArea.placeholder" id="textAreaAnswerField" type="text" class="fs-15 field-h40 form-control mt-10" placeholder="Enter your answer here" size="sm" autocomplete="off" v-bind:class="{'is-danger': validateAnswer}" v-on:keyup.native="validatePlaceholderText()">
          </b-form-input>
          <span v-if="validateAnswer" class="error-style">Placeholder cannot be empty.</span>
          </b-col>
        </b-row>
        <b-row class="pb-15">
          <b-col cols="12" class="p-0">
            <hr>
          </b-col>
          <b-col cols="12" align-self="center" class="pull-right">
            <i class="fa fa-trash-o fs-18 pull-left pl-20 pt-5 iconColor cursor_pointer" aria-hidden="true" @click="deleteComponent()"></i>
            <button class="primary-btn br-1 fs-12 pull-right" size="sm" @click="validateBeforeSubmit()">Save</button>
            <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(formTextArea.order)" v-if="formTextArea.mode == 'edit'">Cancel</button>
          </b-col>
        </b-row>
    </div>
  </div>
</template>
<script>
// import cloneDeep from 'lodash/cloneDeep';
// import find from 'lodash/find';
// import schemas from '../../data/form-components-json/schemas.json';
import _ from 'lodash';

export default {
  name: 'form-text-area',
  data() {
    return {
      formTextArea: {},
      validateQuestion: false,
      noOfLines: [1, 2, 3],
      validateAnswer: false,
      validateMinMaxOption: false,
    };
  },
  props: ['formTextAreaSchema', 'formData'],
  beforeMount() {
    this.formTextArea = this.formTextAreaSchema;
  },
  computed: {
  },
  methods: {
    // Validation for form table question text
    validateQuestionText() {
      if (
        this.formTextArea
        && this.formTextArea.body
        && this.formTextArea.body.length
      ) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // validate min, max value
    validateMinMax() {
      this.validateMinMaxOption = false;
      // if (this.scale.options[this.scale.options.length - 1].commentField) {
      if (
        !this.formTextArea.constraint.lettersAllowed
        && !this.formTextArea.constraint.specialCharactersAllowed
        && !this.formTextArea.constraint.numbersAllowed
      ) {
        this.validateMinMaxOption = true;
        this.$toastr.error('You have to select atleast any one of the allowed characters.');
        // check for characters in case of letters or special characters and numbers are selected
      } else if (
        this.formTextArea.constraint.lettersAllowed
        || this.formTextArea.constraint.specialCharactersAllowed
      ) {
        if (
          this.formTextArea.constraint.minCharsFlag
          && this.formTextArea.constraint.maxCharsFlag
        ) {
          if (
            parseInt(this.formTextArea.constraint.maxChars, 0) >= 0
            && parseInt(this.formTextArea.constraint.minChars, 0) >= 0
            && parseInt(this.formTextArea.constraint.maxChars, 0)
            <= parseInt(this.formTextArea.constraint.minChars, 0)
          ) {
            this.validateMinMaxOption = true;
            this.$toastr.error('Max value cannot be less than or equal to min value.');
          }
        }
        // check for values in case of only numbers is selected
      } else {
        this.validateMinMaxOption = false;
        if (
          this.formTextArea.constraint.minLimitFlag
          && this.formTextArea.constraint.maxLimitFlag
          && !this.validateMinMaxOption
        ) {
          if (
            parseInt(this.formTextArea.constraint.maxLimit, 0) >= 0
            && parseInt(this.formTextArea.constraint.minLimit, 0) >= 0
            && parseInt(this.formTextArea.constraint.maxLimit, 0)
            <= parseInt(this.formTextArea.constraint.minLimit, 0)
          ) {
            this.validateMinMaxOption = true;
            this.$toastr.error('Max value cannot be less than or equal to min value.');
          }
        }
      }
      // }
    },

    // Validate for formTextArea placeholder text
    validatePlaceholderText() {
      if (this.formTextArea && this.formTextArea.placeholder
        && this.formTextArea.placeholder.length > 0) {
        this.validateAnswer = false;
      } else {
        this.validateAnswer = true;
      }
    },

    validateBeforeSubmit() {
      this.validateQuestionText();
      this.validateMinMax();
      this.validatePlaceholderText();
      this.$validator.validateAll().then(result => {
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || this.validateQuestion
            || this.validateAnswer
            || this.validateMinMaxOption
          ) {
            //   this.$toastr.error('Please fill the error fields.');
          } else {
            this.formTextArea.mode = 'saved';
            this.formTextArea.fieldNameErrorMsg = '';
            this.$emit('save', this.formTextArea);
          }
        } else {
          this.formTextArea.fieldNameErrorMsg = 'Please enter unique field name.';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.formTextArea);
    },

    cancelComponent(sequence) {
      this.$emit('cancelComponent', sequence);
    },
  },
};
</script>
<style scoped lang="scss">
.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.formTextArea {
  position: relative;
  border: 0.5px solid lightgray;
  border-radius: 2px;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.is-danger {
  border-color: #ff4848;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.bright {
  border-right: 0.5px solid lightgrey;
}

.field-select {
  width: 80px;
  margin-left: -12px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue div {
  background-color: #1e8fe1;
  height: 9px;
  width: 33px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue div:after {
  background-color: #ffffff;
  border: 1px solid #1e8fe1;
  height: 15px;
  width: 15px;
  margin-left: -15px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div {
  background-color: #d5d7dc;
  height: 9px;
  width: 33px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div:after {
  background-color: #ffffff;
  border: 1px solid #1e8fe1;
  height: 15px;
  width: 15px;
}

</style>
