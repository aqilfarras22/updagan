<template>
  <div class="primaryBackGround">
    <div class="alphaNum">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20">
        <span class="sequence-style"><b>{{alphaNum.sequence}}. </b></span>
        <!-- Text/Numeric question -->
        <b-row class="pt-0 pl-25 pr-15 pb-10">
          <b-form-input type="text" class="fs-15 form-control mb-10 field-h40" v-model="alphaNum.body" placeholder="Enter question or description" size="sm" name="alphaNumQues" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText" autocomplete="off">
          </b-form-input>
          <span v-if="validateQuestion" class="error-style">Question cannot be empty.</span>
        </b-row>
        <b-row class="pt-20 pl-25 pr-15 pb-20">
          <b-form-input type="text" class="fs-15 form-control field-h40" :placeholder="alphaNum.placeholder" size="sm" disabled>
          </b-form-input>
        </b-row>
      </b-form>
      <hr class="m-0">
      <!-- Constraints for the answer field -->
      <b-row class="pl-40" v-if="alphaNum.constraint">
        <b-col cols="12" lg="4" class="pt-20 pl-0 fs-12">
          <div class="bright">
            <div class="pb-10 fs-13">
              <b>Allowed Characters</b><br></div>
            <b-row class="mb-10">
              <b-form-checkbox @change="alphaNum.constraint.lettersAllowed = !alphaNum.constraint.lettersAllowed" v-model="alphaNum.constraint.lettersAllowed" class="pl-0">
              </b-form-checkbox>
              <div class="pl-8 fs-15 text-align">Letters(abc)</div>
            </b-row>
            <b-row class="mb-10">
              <b-form-checkbox @change="alphaNum.constraint.numbersAllowed = !alphaNum.constraint.numbersAllowed" v-model="alphaNum.constraint.numbersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <div class="pl-8 fs-15 text-align">Numbers(123)</div>
            </b-row>
            <b-row class="mb-10">
              <b-form-checkbox @change="alphaNum.constraint.specialCharactersAllowed = !alphaNum.constraint.specialCharactersAllowed" v-model="alphaNum.constraint.specialCharactersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <div class="pl-8 fs-15 text-align">Special characters(!@#)</div>
            </b-row>
          </div>
        </b-col>
        <b-col cols="12" lg="8" class="pt-20 pl-4 fs-12" v-if="(alphaNum.constraint.lettersAllowed || alphaNum.constraint.specialCharactersAllowed)">
          <div class="pb-10 fs-13">
            <b>Character Text</b>
          </div>
          <b-row>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="alphaNum.constraint.minCharsFlag" theme="custom" color="blue" @change="alphaNum.constraint.minCharsFlag = !alphaNum.constraint.minCharsFlag"></switches>
              <span class="pl-8 fs-15">Min Characters</span>
              <b-col cols="12" lg="10" class="pull-right pr-0">
                <b-form-input type="number" class="fs-15 form-control mt-10 field-h40" min="0" v-model="alphaNum.constraint.minChars" v-if="alphaNum.constraint.minCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMin" v-bind:class="{'input': true, 'is-danger': errors.has('charMin')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="alphaNum.constraint.maxCharsFlag" theme="custom" color="blue" @change="alphaNum.constraint.maxCharsFlag = !alphaNum.constraint.maxCharsFlag"></switches>
              <span class="pl-8 fs-15">Max Characters</span>
              <b-col cols="12" lg="10" class="pull-right pr-0">
                <b-form-input type="number" min="0" class="fs-15 form-control mt-10 field-h40" v-model="alphaNum.constraint.maxChars" v-if="alphaNum.constraint.maxCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMax" v-bind:class="{'input': true, 'is-danger': errors.has('charMax')}">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" lg="8" class="pt-10 pl-4 fs-12" v-if="!alphaNum.constraint.lettersAllowed && !alphaNum.constraint.specialCharactersAllowed && alphaNum.constraint.numbersAllowed">
          <div class="pb-10 fs-13">
            <b>Validation</b>
          </div>
          <b-row>
            <b-col cols="12" lg="3" class="pl-0">
              <switches v-model="alphaNum.constraint.minLimitFlag" theme="custom" color="blue" @change="alphaNum.constraint.minLimitFlag = !alphaNum.constraint.minLimitFlag"></switches>
              <span class="fs-15">Min value</span>
              <b-col cols="12" lg="10" class="pull-right pr-0">
                <b-form-input type="number" min="0" class="fs-15 form-control field-h40" v-model="alphaNum.constraint.minLimit" v-if="alphaNum.constraint.minLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMin" v-bind:class="{'input': true, 'is-danger': errors.has('numberMin')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="alphaNum.constraint.maxLimitFlag" theme="custom" color="blue" @change="alphaNum.constraint.maxLimitFlag = !alphaNum.constraint.maxLimitFlag"></switches>
              <span class="pl-5 fs-15">Max value</span>
              <b-col cols="12" lg="10" class="pull-right pr-0">
                <b-form-input type="number" min="0" class="fs-15 form-control field-h40" v-model="alphaNum.constraint.maxLimit" v-if="alphaNum.constraint.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="alphaNum.constraint.decimalLimitFlag" theme="custom" color="blue" @change="alphaNum.constraint.decimalLimitFlag = !alphaNum.constraint.decimalLimitFlag"></switches>
              <span class="pl-5 fs-15"># of decimal places</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" min="0" class="fs-15 form-control field-h40" v-model="alphaNum.constraint.decimalLimit" v-if="alphaNum.constraint.decimalLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberDecimals" v-bind:class="{'input': true, 'is-danger': errors.has('numberDecimals')}">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pl-40 pt-20 pb-10 fs-12">
        <b-col cols="12" lg="8" class="p-0">
          <b-row class="pb-6 fs-13">
            <b>Placeholder</b>
          </b-row>
          <b-form-input type="text" class="fs-15 form-control field-h40" v-model="alphaNum.placeholder" placeholder="Enter your answer here" size="sm" name="alphaNumQues" v-bind:class="{'is-danger': validateAnswer}" v-on:keyup.native="validatePlaceholderText()" autocomplete="off">
          </b-form-input>
          <span v-if="validateAnswer" class="error-style">Placeholder cannot be empty.</span>
        </b-col>
      </b-row>
      <hr>
      <b-row class="pb-15">
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left iconColor cursor_pointer pl-25 pt-5" aria-hidden="true" @click="deleteComponent()"></i>
          <button class="primary-btn br-1 fs-12 pull-right" size="sm" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(alphaNum.order)" v-if="alphaNum.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'text-numeric',
  components: {},
  data() {
    return {
      alphaNum: {},
      validateQuestion: false,
      validateAnswer: false,
      validateOption: false,
      errorOptionsCount: 0,
    };
  },
  props: ['alphaNumericSchema', 'formData'],
  mounted() {
    this.alphaNum = this.alphaNumericSchema;
  },
  methods: {
    // Validate for alphaNum question text
    validateQuestionText() {
      if (this.alphaNum && this.alphaNum.body && this.alphaNum.body.length > 0) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // Validate for alphaNum placeholder text
    validatePlaceholderText() {
      if (this.alphaNum && this.alphaNum.placeholder && this.alphaNum.placeholder.length > 0) {
        this.validateAnswer = false;
      } else {
        this.validateAnswer = true;
      }
    },

    // validate other options
    validateOptions() {
      this.validateOption = false;
      if (
        !this.alphaNum.constraint.lettersAllowed
        && !this.alphaNum.constraint.specialCharactersAllowed
        && !this.alphaNum.constraint.numbersAllowed
      ) {
        this.validateOption = true;
        this.$toastr.error('You have to select atleast any one of the allowed characters.');
        // check for characters in case of letters or special characters and numbers are selected
      } else if (
        this.alphaNum.constraint.lettersAllowed
        || this.alphaNum.constraint.specialCharactersAllowed
      ) {
        if (this.alphaNum.constraint.minCharsFlag && this.alphaNum.constraint.maxCharsFlag) {
          if (
            parseInt(this.alphaNum.constraint.maxChars, 0) >= 0
            && parseInt(this.alphaNum.constraint.minChars, 0) >= 0
            && parseInt(this.alphaNum.constraint.maxChars, 0)
              <= parseInt(this.alphaNum.constraint.minChars, 0)
          ) {
            this.validateOption = true;
            this.$toastr.error('Max value cannot be less than or equal to min value.');
          }
        }
        // check for values in case of only numbers is selected
      } else {
        this.validateOption = false;
        if (
          this.alphaNum.constraint.minLimitFlag
          || this.alphaNum.constraint.maxLimitFlag
          && !this.validateOption
        ) {
           if (
             parseInt(this.alphaNum.constraint.minLimit, 0) >= 0
             && parseInt(this.alphaNum.constraint.minLimit, 0) > 9999999999
          ) {
            this.validateOption = true;
            this.$toastr.error('Min value cannot exceed 9999999999.');
          }
          else if (
            parseInt(this.alphaNum.constraint.maxLimit, 0) >= 0
            && parseInt(this.alphaNum.constraint.maxLimit, 0) > 9999999999
          ) {
            this.validateOption = true;
            this.$toastr.error('Max value cannot exceed 9999999999.');
          }
          else if (
            parseInt(this.alphaNum.constraint.maxLimit
            , 0) >= 0
            && parseInt(this.alphaNum.constraint.minLimit, 0) >= 0
            && parseInt(this.alphaNum.constraint.maxLimit, 0)
              <= parseInt(this.alphaNum.constraint.minLimit, 0)
          ) {
            this.validateOption = true;
            this.$toastr.error('Max value cannot be less than or equal to min value.');
          }
        }
      }
    },

    // Validate and submit the drop down to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      this.validateQuestionText();
      this.validatePlaceholderText();
      this.validateOptions();
      this.$validator.validateAll().then(result => {
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || this.errorOptionsCount
            || this.validateQuestion
            || this.validateAnswer
            || this.validateOption
          ) {
            //   this.$toastr.error('Please fill the error fields.');
          } else {
            this.alphaNum.mode = 'saved';
            this.alphaNum.fieldNameErrorMsg = '';
            this.$emit('save', this.alphaNum);
          }
        } else {
          this.alphaNum.fieldNameErrorMsg = 'Please enter unique field name.';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.alphaNum);
    },

    cancelComponent(sequence) {
      this.$emit('cancelComponent', sequence);
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.alphaNum {
  position: relative;
  background-color: #f5f6f7;
  border: 0.5px solid #e4e8eb;
  border-radius: 2px;
}
.drop-down {
  background-color: #ffffff !important;
}

.mood-capture {
  min-height: 450px;
}

.formOptions {
  border-right: 0.5px solid lightgrey;
  border-top: 0.5px solid lightgrey;
  border-bottom: 0.5px solid lightgrey;
}

.bright {
  border-right: 0.5px solid lightgrey;
}

.text-align {
  line-height: 23px !important;
}

.vue-switcher-theme--bootstrap.vue-switcher-color--primary div:after {
  background-color: #1e8fe1 !important;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.is-danger {
  border-color: #ff4848;
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

.pl-56 {
  padding-left: 56px !important;
}

.iconColor{
  color: #ced4da;
}
</style>
