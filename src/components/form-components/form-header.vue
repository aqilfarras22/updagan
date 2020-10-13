<template>
  <div class="primaryBackGround">
    <div class="formHeader form-bg">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-10">
        <!-- form header title -->
        <b-row class="pl-0 pr-15 pb-0 pt-0">
          <b-form-input type="text" class="fs-15 form-control field-h40 mb-10" v-model="formHeader.body" placeholder="Write your title here!" size="sm" v-bind:class="{'is-danger': validateHeader}" v-on:keyup.native="validateHeaderText" autocomplete="off">
          </b-form-input>
          <span v-if="validateHeader" class="error-style">Header cannot be empty.</span>
        </b-row>
      </b-form>
      <hr class="m-0 pb-13 mt-10">
      <b-row class="pb-15">
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left iconColor cursor_pointer pl-10 pt-5" aria-hidden="true" @click="deleteFormHeader()"></i>
          <button class="primary-btn br-1 fs-12 pull-right" size="sm" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(formHeader.order)" v-if="formHeader.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
// import cloneDeep from 'lodash/cloneDeep';
// import filter from 'lodash/filter';

export default {
  name: 'form-header',
  data() {
    return {
      formHeader: {},
      validateHeader: false,
    };
  },
  props: ['formHeaderSchema'],
  mounted() {
    this.formHeader = this.formHeaderSchema;
  },
  methods: {
    validateHeaderText() {
      if (this.formHeader && this.formHeader.body && this.formHeader.body.length) {
        this.validateHeader = false;
      } else {
        this.validateHeader = true;
      }
      return !this.validateHeader;
    },
    // Validate and submit the form header to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      if (this.validateHeaderText()) {
        this.formHeader.mode = 'saved';
        this.$emit('save', this.formHeader);
      }
    },

    deleteFormHeader() {
      this.$emit('deleteComponent', this.formHeader);
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

.formHeader {
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
