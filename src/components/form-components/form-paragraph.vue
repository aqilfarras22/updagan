<template>
  <div class="primaryBackGround">
    <div class="formParagraph form-bg">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-10">
        <!-- form header title -->
        <b-row class="pl-0 pr-15 pb-0 pt-0">
          <b-form-textarea type="text" class="fs-15 form-control mb-10" v-model="formParagraph.body" placeholder="Write something here!" size="sm" v-bind:class="{'is-danger': validateParagraph}" v-on:keyup.native="validateParagraphText" autocomplete="off">
          </b-form-textarea>
          <span v-if="validateParagraph" class="error-style">Paragraph cannot be empty.</span>
        </b-row>
      </b-form>
      <hr class="m-0 pb-13 mt-10">
      <b-row class="pb-15">
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left iconColor cursor_pointer pl-10 pt-5" aria-hidden="true" @click="deleteformParagraph()"></i>
          <button class="primary-btn br-1 fs-12 pull-right" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" size="sm" @click="cancelComponent(formParagraph.order)" v-if="formParagraph.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
// import cloneDeep from 'lodash/cloneDeep';
// import filter from 'lodash/filter';

export default {
  name: 'form-paragraph',
  data() {
    return {
      formParagraph: {},
      validateParagraph: false,
    };
  },
  props: ['formParagraphSchema'],
  mounted() {
    this.formParagraph = this.formParagraphSchema;
  },
  methods: {
    validateParagraphText() {
      if (this.formParagraph && this.formParagraph.body
      && this.formParagraph.body.length) {
        this.validateParagraph = false;
      } else {
        this.validateParagraph = true;
      }
      return !this.validateParagraph;
    },
    // Validate and submit the form header to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      if (this.validateParagraphText()) {
        this.formParagraph.mode = 'saved';
        this.$emit('save', this.formParagraph);
      }
    },

    deleteformParagraph() {
      this.$emit('deleteComponent', this.formParagraph);
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

.formParagraph {
  position: relative;
  border: 0.5px solid lightgray;
  border-radius: 2px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.is-danger {
  border-color: #ff4848;
}
</style>
