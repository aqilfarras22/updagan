<template>
  <div>
    <b-card-group v-for="section in sections" :key="section.name" class="border-top">
      <b-card no-body class="border-0" :header="section.name">
        <b-list-group v-if="sections" flush>
          <b-list-group-item
            class="item border-0"
            v-for="(field, index) in section.fields"
            :class="{ selected: selectedFieldId === field.fieldId}"
            :key="field.fieldId"
            @click="select(field.fieldId)"
          >
            <span class="changed" v-if="showChanged && field.changed"></span>
            <dl>
              <dt :class="{'query-icon': hasQuery(field.fieldId)}">
                {{ index + 1 }}. {{ field.question || field.title }}
              </dt>
              <dd v-if="field.fragmentType === fieldTypes.DATEPICKER">
                <span v-if="field.response[0] && field.response[0] != 'NaN'">{{ field.response && field.response.length && new Date((field.response[0] * 1000) + 3600000) | queryToolDateFormat }}</span>
              </dd>
              <dd v-else>{{ field.response && field.response.join(', ') }}</dd>
            </dl>
            <button-cmp
              v-if="!doNotOpenQuery"
              class="open-query"
              variant="outline-primary"
              @click.stop="openQuery(field.fieldId)"
            >Open a query</button-cmp>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import ButtonCmp from '@/components/common/button';
import { fieldTypes } from '@/constants/form';

export default {
  name: 'form-fields-list',
  components: { ButtonCmp },
  props: {
    sections: Array,
    doNotOpenQuery: {
      type: Boolean,
      default: false,
    },
    showChanged: {
      type: Boolean,
      default: false,
    },
    fieldsWithQueries: {
      type: Array,
      default: () => [],
    },
    selectedFieldId: String,
  },
  data() {
    return {
      fieldTypes,
    };
  },
  methods: {
    hasQuery(fieldId) {
      return this.fieldsWithQueries.includes(fieldId);
    },
    openQuery(id) {
      this.$emit('openQuery', id);
    },
    select(id) {
      if (this.hasQuery(id)) {
        this.$emit('selected', id);
      }
    },
  },
};
</script>

<style scoped>
.changed {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
  border-radius: 1px;
  background-color: #ffa200;
}
.item {
  font-size: 0.9rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  text-align: left;
  color: #666669;
  padding-left: 30px;
}
dl {
  margin: 0;
}
dt {
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
}
dd {
  font-weight: 700;
  font-style: normal;
  font-stretch: normal;
  margin: 0;
  padding-left: 15px;
  padding-top: 0.5rem;
}
.selected {
  background: #f9f9e0;
  border-color: #d3dfe4;
}
.open-query {
  display: none;
  position: absolute;
  right: 10px;
  top: 10px;
}
.item:hover .open-query {
  display: block;
}
.query-icon::before {
  content: "";
  position: absolute;
  width: 10px;
  left: 10px;
  top: 16px;
  height: 10px;
  border-radius: 5px;
  background-color: #f5a623;
}
</style>
