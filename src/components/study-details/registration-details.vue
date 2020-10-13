<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div>
          <h6 class="fw-bold"> REGISTRATION </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandParticipantInfo" @click.prevent="expandParticipantInfo = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandParticipantInfo" @click.prevent="expandParticipantInfo = false"></i>
              Participant information collected
            </div>
            <div v-if="expandParticipantInfo">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row class="pb-10" v-if="participantRequiredInfo.length > 0">
                    <b-col>
                      <div class="header">
                        Required
                      </div>
                      <div class="content">
                        <span v-for="(info, index) in participantRequiredInfo" :key="index">
                          {{info}}
                          <span v-if="index + 1 < participantRequiredInfo.length">,</span>
                        </span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="participantOptionalInfo.length > 0">
                    <b-col>
                      <div class="header">
                        Optional
                      </div>
                      <div class="content">
                        <span v-for="(info, index) in participantOptionalInfo" :key="index">
                          {{info}}
                          <span v-if="index + 1 < participantOptionalInfo.length">,</span>
                        </span>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandContactInfo" @click.prevent="expandContactInfo = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandContactInfo" @click.prevent="expandContactInfo = false"></i>
              Contact information collected
            </div>
            <div v-if="expandContactInfo">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row class="pb-10" v-if="contactRequiredInfo.length > 0">
                    <b-col>
                      <div class="header">
                        Required
                      </div>
                      <div class="content">
                        <span v-for="(info, index) in contactRequiredInfo" :key="index">
                          {{info}}
                          <span v-if="index+1 < contactRequiredInfo.length">,</span>
                        </span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="pb-10" v-if="contactOptionalInfo.length > 0">
                    <b-col>
                      <div class="header">
                        Optional
                      </div>
                      <div class="content">
                        <span v-for="(info, index) in contactOptionalInfo" :key="index">
                          {{info}}
                          <span v-if="index + 1 < contactOptionalInfo.length">,</span>
                        </span>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { map, filter } from 'lodash';

export default {
  name: 'registration-details',
  data() {
    return {
      expandParticipantInfo: false,
      expandContactInfo: false,
    };
  },
  components: {},
  props: {
    registrationDetails: {
      type: Array,
    },
  },
  computed: {
    participantRequiredInfo() {
      return map(filter(this.registrationDetails, o => o.type === 'personalInfo' && o.isOptional === 'required' && o.isVisible === true), 'field');
    },
    participantOptionalInfo() {
      return map(filter(this.registrationDetails, o => o.type === 'personalInfo' && o.isOptional === 'optional'), 'field');
    },
    contactRequiredInfo() {
      return map(filter(this.registrationDetails, o => o.type === 'contactInfo' && o.isOptional === 'required'), 'field');
    },
    contactOptionalInfo() {
      return map(filter(this.registrationDetails, o => o.type === 'contactInfo' && o.isOptional === 'optional' && o.isVisible === true), 'field');
    },
  },
  methods: {
    expandAll() {
      this.expandParticipantInfo = true;
      this.expandContactInfo = true;
    },
    collapseAll() {
      this.expandParticipantInfo = false;
      this.expandContactInfo = false;
    },
  },
};
</script>

<style scoped>
.link_style {
  border-right: 1px solid #959fa4;
  margin: 0px 5px 0px 2px !important;
}
.inner-card {
  border: none;
  margin: 5px 20px;
  border-radius: 3px !important;
  background-color: #d3dfe4;
}
.header {
  font-size: 12px;
  color: #666669;
}
.content {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
.make-link {
  color: #007bff !important;
}
</style>
