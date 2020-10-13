<template>
  <b-row class="fs-12">
    <h6 class="pl-12 pt-20 fs-20 title-color">
      <b>Text and Numeric options</b>
    </h6>
    <b-row class="pt-18 mb-20">
      <b-col cols="12" class="fw-bold fs-13 mb-10" align-self="center">
        Field Requirement.
      </b-col>
      <b-col align-self="center fs-15">
        <b-form-checkbox @change="alphaNumData.required = !alphaNumData.required" v-model="alphaNumData.required" class="pl-0">
          <span class="pl-25 text-align">Required</span>
        </b-form-checkbox><br>
      </b-col>
    </b-row>
    <!-- <b-row>
      <b-col cols="12">
        <hr>
      </b-col>
      <b-col cols="12" class="fw-bold">
        Notifications
      </b-col>
      <b-col cols="12" class="pt-10">
        Alert individuals on the study team based on an outcome of this question
      </b-col>
      <b-col cols="12">
        <div v-for="(notification, index) in notifications" :key="index" v-if="notifications.length > 0" class="pt-10">
          <b-col class="fs-11 notificationBorder" v-if="!notification.mode">
            <b-form-select v-model="notification.choiceSelected" :value="notification.choiceSelected" :options="choicesToShow" class="mb-5 fs-12" size="sm" :change="showThreshold(notification)">
            </b-form-select>
            <b-row class="pb-10 lh-3" v-if="notification.thresholdFalg">
              <div class="pt-4 lh-1">Set notification threshold:</div>
              <b-col cols="12" class="p-0">
                <switches v-model="notification.threshold.minLimitFlag" theme="custom" color="blue" @change="notification.threshold.minLimitFlag = !notification.threshold.minLimitFlag"></switches><span class="pl-8">Min value</span>
                <b-col cols="12" class="p-0">
                  <b-form-input type="number" class="fs-12" min="0" v-model="notification.threshold.minValue" v-if="notification.threshold.minLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMin" v-bind:class="{'input': true, 'is-danger': errors.has('numberMin')}">
                  </b-form-input>
                </b-col>
              </b-col>
              <b-col cols="12" class="p-0">
                <switches v-model="notification.threshold.maxLimitFlag" theme="custom" color="blue" @change="notification.threshold.maxLimitFlag = !notification.threshold.maxLimitFlag"></switches><span class="pl-8">Max value</span>
                <b-col cols="12" class="p-0">
                  <b-form-input type="number" min="0" class="fs-12" v-model="notification.threshold.maxValue" v-if="notification.threshold.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}">
                  </b-form-input>
                </b-col>
              </b-col>
            </b-row>
            <b-row class="pb-10 lh-3">
              <b-col cols="5" class="p-0">
                <b>{{notification.contacts.length}} people selected</b>
              </b-col>
              <b-col cols="7" class="p-0">
                <b-btn class="btn br-1 fs-12 pull-right pl-2 pr-2" variant="outline-primary" disabled>Select people to notify</b-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="2" class="p-0">
                <i class="fa fa-trash-o fs-18 pull-left iconColor pt-6 cursor_pointer" aria-hidden="true" @click="removeNotification(index, notification.choiceSelected), hideAddNotification = true"></i>
              </b-col>
              <b-col cols="10" class="p-0">
                <b-btn class="btn br-1 fs-14 pull-right" variant="primary" size="sm" @click="saveNotification(notification.choiceSelected), notification.mode = !notification.mode, hideAddNotification = !hideAddNotification">Save</b-btn>
              </b-col>
            </b-row>
          </b-col>
          <b-col class="fs-11 notificationBorder" v-if="notification.mode">
            <div class="pb-5">{{notification.name}}
              <b-btn class="pull-right  pt-2 pb-2" variant="outline-primary" size="sm" @click="notification.mode = !notification.mode, hideAddNotification = !hideAddNotification">Edit</b-btn>
            </div>
            {{notification.choiceSelected}}:<br>
            <b class="pt-5">{{notification.contacts.length}} people selected</b>
            <ul v-for="(contact, contactIndex) in notification.contacts" :key="contactIndex" class="pl-15 mb-0">
                      <div v-if="contact.status">
                        <li>
                          <span v-if="contact.email">Email </span>
                          <span v-if="contact.email && contact.sms">and</span>
                          <span v-if="contact.sms"> SMS text message</span>
                        </li>
                        <b>{{contact.name}}</b>
                      </div>
                    </ul>
          </b-col>
        </div>
      </b-col>
      <b-col cols="12" class="pt-10">
        <b-btn variant="outline-primary" v-if="hideAddNotification" class="fs-12" size="sm" @click="addNewNotification()">Add notification</b-btn>
      </b-col>
    </b-row> -->
    <b-row class="pb-10">
      <b-col cols="12 mb-20">
        <hr>
      </b-col>
      <b-col cols="12" class="fw-bold">
        Field Name
      </b-col>
      <b-col cols="12" class="pt-10 fs-15">
        You may name this field for the purposes of data mapping. It will not be visible to the Site Team(s) or participants.
      </b-col>
      <b-col cols="12 pt-12">
        <b-form-input type="text" v-model="alphaNumData.fieldName" placeholder="Enter field name" class="field-h40 form-control fs-15" size="sm" v-bind:class="{'is-danger': alphaNumData.fieldNameErrorMsg }" v-on:keyup.native="checkForErrors" autocomplete="off"></b-form-input>
        <span class="error-style" v-if="alphaNumData.fieldNameErrorMsg">{{alphaNumData.fieldNameErrorMsg}}</span>
      </b-col>
    </b-row>
  </b-row>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'text-numeric-prop',
  components: {},
  data() {
    return {
      alphaNumData: [],
      choicesGiven: [],
      hideAddNotification: true,
      notifications: [],
      notificationSchema: {
        name: 'Notification',
        mode: false,
        choiceSelected: '',
        contacts: [],
        thresholdFalg: false,
        threshold: {
          minLimitFlag: true,
          minValue: 0,
          maxLimitFlag: true,
          maxValue: 250,
        },
      },
      choicesToShow: ['If an answer is provided', 'If answer violates a set threshold'],
    };
  },
  props: ['alphaNumericSchema'],
  mounted() {
    this.alphaNumData = this.alphaNumericSchema;
    this.notifications = this.alphaNumData.notifications;
  },
  computed: {},
  methods: {
    addNewNotification() {
      const notificationSchema = _.cloneDeep(this.notificationSchema);
      notificationSchema.name = `${notificationSchema.name} ${this.alphaNumData.notifications
        .length + 1}`;
      this.notifications.push(notificationSchema);
      this.hideAddNotification = !this.hideAddNotification;
    },

    saveNotification(selectedChoice) {
      window.console.log(selectedChoice);
      // const choiceIndex = this.choicesToShow.indexOf(selectedChoice);
      // this.choicesToShow.splice(choiceIndex, 1);
      this.alphaNumData.notifications = this.notifications;
    },

    removeNotification(index, selectedChoice) {
      window.console.log(selectedChoice);
      // this.choicesToShow.push(selectedChoice);
      this.alphaNumData.notifications.splice(index, 1);
    },

    showThreshold(notification) {
      const data = notification;
      if (notification.choiceSelected === 'If answer violates a set threshold') {
        data.thresholdFalg = true;
      } else {
        data.thresholdFalg = false;
      }
    },

    checkForErrors() {
      if (this.alphaNumData.fieldName && this.alphaNumData.fieldName.trimEnd().length > 0) {
        this.alphaNumData.fieldNameErrorMsg = '';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.notificationBorder {
  border-radius: 3px;
  border: 0.5px solid lightgrey;
  padding: 8px;
}

.text-align {
  line-height: 23px !important;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.is-danger {
  border-color: #ff4848;
}

.lh-3 {
  line-height: 3 !important;
}

.lh-1 {
  line-height: 1 !important;
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
