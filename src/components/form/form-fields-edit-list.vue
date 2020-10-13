<template>
  <b-form @submit.prevent="openChangeReasonModal">
    <b-card-group deck v-for="section in sectionsModel" :key="section.name">
      <b-card no-body :header="section.name" class="border-0">
        <b-list-group v-if="sectionsModel" flush>
          <b-list-group-item v-for="(field, index) in section.fields" :key="field.id" class="item border-0">
            <label :for="field.id"><strong>{{ index + 1 }}. {{ field.question || field.title }}</strong></label>
            <div v-if="field.fragmentType === fieldTypes.INPUT">
              <b-form-input
                :id="field.id"
                :name="field.id"
                v-model.trim="field.response"
              ></b-form-input>
            </div>
            <div v-else-if="field.fragmentType === fieldTypes.POLAR_QUESTION">
              <b-form-radio-group
                v-model="field.response"
                :options="field.answers.map(a => a.name)"
              ></b-form-radio-group>
            </div>
            <div v-else-if="field.fragmentType === fieldTypes.DROPDOWN">
              <b-form-select
                :multiple="field.multipleChoice"
                v-model="field.response"
                :options="field.answers"
              />
            </div>
            <div v-else-if="field.fragmentType === fieldTypes.DATEPICKER">
              <datepicker
                input-class="form-control"
                placeholder="Enter Date"
                format="MM/dd/yyyy"
                v-model="field.response"
              />
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-card-group>
    <b-row class="my-2">
      <b-col>
        <button-cmp type="submit" variant="primary" class="w-100">Save</button-cmp>
      </b-col>
      <b-col>
        <button-cmp variant="link" @click="cancel">Cancel</button-cmp>
      </b-col>
      <b-col col md="auto"></b-col>
    </b-row>
    <FormChangeReasonModal
      v-model="changeReasonModalVisible"
      @confirmed="submit"
    />
  </b-form>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import ButtonCmp from '@/components/common/button';
import FormChangeReasonModal from '@/components/modals/form-change-reason-modal';
import { fieldTypes } from '@/constants/form';

export default {
  name: 'form-fields-edit-list',
  components: {
    ButtonCmp,
    FormChangeReasonModal,
    Datepicker,
  },
  props: {
    sections: Array,
  },
  data() {
    return {
      fieldTypes,
      sectionsModel: cloneDeep(
        this.sections.map(s => ({
          ...s,
          fields: s.fields.map(field => {
            const newField = {
              ...field,
              changed: false,
              oldResponse: field.response,
            };
            if (field.fragmentType === fieldTypes.DATEPICKER) {
              return {
                ...newField,
                response: field.response[0] * 1000,
              };
            }
            if (
              (field.fragmentType === fieldTypes.DROPDOWN && !field.multipleChoice)
              || field.fragmentType === fieldTypes.POLAR_QUESTION
            ) {
              return {
                ...newField,
                response: field.response[0],
              };
            }
            return newField;
          }),
        })),
      ),
      changeReasonModalVisible: false,
    };
  },
  methods: {
    submit(primaryReason) {
      const sectionToSave = this.sectionsModel.map(s => ({
        ...s,
        fields: s.fields.map(field => {
          let response = field.fragmentType === fieldTypes.DATEPICKER
            ? (new Date(field.response).valueOf() / 1000).toFixed()
            : field.response;
          response = Array.isArray(response) ? response : [response];

          // check if changed
          let changed = false;
          if (Array.isArray(field.oldResponse) && Array.isArray(response)) {
            changed = !isEqual(field.oldResponse.sort(), response.sort());
          } else if (field.oldResponse && response && response !== field.oldResponse) {
            return true;
          }

          return {
            ...field,
            changed,
            response,
          };
        }),
      }));

      this.$emit('save', { sections: sectionToSave, primaryReason });
    },
    openChangeReasonModal() {
      this.changeReasonModalVisible = true;
    },
    cancel() {
      this.$emit('cancelEdit');
    },
  },
};
</script>
