<template>
  <div>
    <div class="row">
      <b-col class="p-0" cols="11">
        <span v-if="!editPacketNameInput" class="packetNameEdit" @click="editPacketName()">
              <b class="fs-26 pr-4 headingColor">{{forms.name}}</b>
              <img src="static/img/edit.svg" alt="" class="img-size mb-10">
            </span>
        <div class="pr-0" v-if="editPacketNameInput">
          <b-input-group>
            <b-input-group-text slot="append" class="whiteBackground pl-5 pr-5 pt-0 pb-0" v-bind:class="{'is-danger': packetNameError}">
              <i class="fa fa-times cancelFormNameEditIcon mr-4 fs-20 cursor_pointer" @click="cancelPacketName()" aria-hidden="true"></i>
              <i class="fa fa-check-square primaryColor fs-28 cursor_pointer" @click="savePacketName()" aria-hidden="true"></i>
            </b-input-group-text>
            <b-form-input v-model="packetName" onClick="this.select();" class="formNameInput pt-0 pb-0 pl-4 fs-26" v-bind:class="{'is-danger': packetNameError}">
            </b-form-input>
          </b-input-group>
        </div>
        <div class="pb-20 headingColor" v-if="forms.unscheduledForms">
          This packet includes {{forms.unscheduledForms.length}} forms.
        </div>
        <div class="forms-bg mb-20">
          <div v-for="(formData, index) in formDetails" :key="index" class="form-border">
            <div class="row pl-14">
              <router-link class="form-name" :to="{ name: 'configure-new-form', params: {'studyId': studyId, 'formId': formData.id}}"><b>{{formData.name}}</b></router-link>
            </div>
            <b-col v-for="(form,index) in formData.fields" :key="index" cols="11" class="p-0 pointerEventsNone">
              <DropDownPreview :componentData="form" v-if="form.name == 'formDropdown'" />
              <CheckBoxPreview :componentData="form" v-if="form.name == 'formCheckbox'" />
              <SingleChoicePreview :componentData="form" v-if="form.name == 'formSinglechoice'" />
              <TextNumericPreview :componentData="form" v-if="form.name == 'formTextNumeric'" />
              <FormHeaderPreview :componentData="form" v-if="form.name == 'formHeader'" />
              <FormParagraphPreview :componentData="form" v-if="form.name == 'formParagraph'" />
              <DateTimePreview :componentData="form" v-if="form.name == 'formDateTime'" />
              <ScalePreview :componentData="form" v-if="form.name == 'formScale'" />
              <FormTextAreaPreview :componentData="form" v-if="form.name == 'formTextArea'" />
              <FormTablePreview :componentData="form" v-if="form.name == 'formTable'" />
            </b-col>
          </div>
        </div>
      </b-col>
    </div>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';

import DropDownPreview from './preview-components/drop-down-preview';
import CheckBoxPreview from './preview-components/check-box-preview';
import SingleChoicePreview from './preview-components/single-choice-preview';
import TextNumericPreview from './preview-components/text-numeric-preview';
import FormHeaderPreview from './preview-components/form-header-preview';
import FormParagraphPreview from './preview-components/form-paragraph-preview';
import DateTimePreview from './preview-components/date-time-preview';
import ScalePreview from './preview-components/scale-preview';
import FormTextAreaPreview from './preview-components/form-text-area-preview';
import FormTablePreview from './preview-components/form-table-preview';

export default {
  name: 'unschedule-forms',
  props: [],
  components: {
    DropDownPreview,
    CheckBoxPreview,
    SingleChoicePreview,
    TextNumericPreview,
    FormHeaderPreview,
    FormParagraphPreview,
    DateTimePreview,
    ScalePreview,
    FormTextAreaPreview,
    FormTablePreview,
  },
  data() {
    return {
      formId: this.$route.params.formId,
      studyId: this.$route.params.studyId,
      packetId: this.$route.params.packetId,
      forms: {},
      formDetails: [],
      editPacketNameInput: false,
      packetName: '',
      packetNameError: false,
    };
  },
  mounted() {
    this.getPacketForms();
  },
  methods: {
    getPacketForms() {
      this.$api.getPacketFact(this.studyId, this.packetId).then(response => {
        this.forms = response.body;
        this.getFormDetails();
      });
    },
    getFormDetails() {
      this.forms.unscheduledForms.forEach(form => {
        this.$api.getEDCFormDataFact(form.formId, this.studyId).then(response => {
          let data = response.body
          data.srNo = form.srNo
          this.formDetails.push(data);
          this.formDetails = sortBy(this.formDetails, [o => o.srNo]);
        });
      });
    },
    editPacketName() {
      this.editPacketNameInput = true;
      this.packetNameError = false;
      this.packetName = this.forms.name;
    },
    savePacketName() {
      if (!this.packetName || this.packetName.trim().length === 0) {
        this.packetNameError = true;
        this.$toastr.error("Unscheduled Packet name can't be empty.");
      } else {
        const data = {
          name: this.packetName,
        };
        this.$api.editPacketNameFact(this.studyId, this.packetId, data).then(response => {
          this.forms.name = response.body.name;
        });
        this.editPacketNameInput = false;
      }
    },
    cancelPacketName() {
      this.editPacketNameInput = false;
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.form-border {
  padding: 15px 10px;
  border-bottom: solid 1px #e4e8eb;
}

.forms-bg {
  background-color: #ffffff;
  widows: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.form-name {
  color: #2d3752;
}

.packetNameEdit:hover {
  background-color: #f5f6f7;
  cursor: pointer;
  padding: 6px 10px 2px 0px !important;
}

.img-size {
  width: 14px !important;
  height: 14px !important;
}

.edit_hover_class {
  visibility: hidden;
}

.packetNameEdit:hover .edit_hover_class {
  visibility: visible;
  color: #d4d9e2;
}

.whiteBackground {
  background-color: #ffffff !important;
}

.primaryColor {
  color: #1e8fe1;
}

.cancelFormNameEditIcon {
  border: 0.5px solid;
  padding: 1.5px 3.5px;
  border-radius: 2px;
}

.formNameInput {
  border-right: none;
}

.is-danger {
  border-color: #ff4848;
}
  
.pointerEventsNone {
  pointer-events: none;
}

.headingColor {
  color: #4a4a4a;
}
</style>
