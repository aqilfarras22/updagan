<template>
  <div class="fs-12">
    <b-row>
      <h6 class="pl-12 pt-30 fs-20 title-color">
        <b>Drop Down Options</b>
      </h6>
    </b-row>
    <b-row class="fw-bold pl-12 pt-15 fs-13 text-color">
      Field Requirement.
    </b-row>
    <!-- <b-row class="p-0">
      <b-form-checkbox id="dropdownRequired" @change="dropDownData.required = !dropDownData.required" v-model="dropDownData.required" class="pl-12 mr-10">
      </b-form-checkbox>
      <span class="text-align">Required</span>
    </b-row> -->
    <b-row class="p-0">
      <form class="form-inline pl-12">
        <div class="custom-control custom-checkbox mr-sm-2 pl-0">
          <b-form-checkbox @change="dropDownData.required = !dropDownData.required" v-model="dropDownData.required" class="pl-0">
            <span class="pl-25 text-align fs-15 text-color">Required</span>
          </b-form-checkbox><br>
        </div>
      </form>
    </b-row>
    <!-- <b-row>
      <b-col cols="12">
        <hr>
      </b-col>
      <b-col cols="12" class="fw-bold">
        Notifications
      </b-col>
      <b-col cols="12" class="pt-10">
        Alert individuals on the study team based on an outcome of this question.
      </b-col>
      <b-col cols="12">
        <div v-for="(notification, index) in notifications" :key="index" v-if="notifications && notifications.length" class="pt-10">
          <b-col class="fs-11 notificationBorder" v-if="!notification.mode">
            <b-form-select v-model="notification.triggerCondition.selectedOptionIndex" :options="choicesToShow" class="mb-5 fs-12" size="sm" :change="findOptionVal(index, notification.triggerCondition.selectedOptionIndex)">
            </b-form-select>
            <span class="error-style" v-if="notification.notificationConditionFlag">Please select an option to trigger notification.</span>
            <br> If selected, notify:<br>
            <div v-for="(contact, contactIndex) in notification.contacts" :key="contactIndex" class="pt-5 pl-3">
              <switches v-model="contact.status" theme="custom" color="blue" @change="contact.status = !contact.status"></switches>
              <label class="pl-4">{{contact.name}}</label><br>
              <div class="pb-5 pl-20" v-if="contact.status">
                <b-form-checkbox @change="contact.email = !contact.email" v-if="contact.status" v-model="contact.email" class="pl-0 fs-10">
                  <span class="pl-23 text-align">Email</span>
                </b-form-checkbox>
                <b-form-checkbox @change="contact.sms = !contact.sms" v-if="contact.status" v-model="contact.sms" class="pl-0 fs-10">
                  <span class="pl-23 text-align">SMS text message</span>
                </b-form-checkbox><br>
              </div>
            </div>
            <b-row>
              <b-col class="p-0">
                <b-btn @click="addContact(index)" variant="link" size="sm" class=" pl-0">Add new contact</b-btn>
              </b-col>
            </b-row>
            <span class="error-style" v-if="notification.notificationContactFlag">Please select a contact and mode of communication notification.</span>
            <b-row>
              <b-col cols="2" class="p-0">
                <i class="fa fa-trash-o fs-18 pull-left iconColor pt-6 cursor_pointer" aria-hidden="true" @click="removeNotification(index), hideAddNotification = true"></i>
              </b-col>
              <b-col cols="10" class="p-0">
                <b-btn class="btn br-1 fs-14 pull-right" variant="primary" size="sm" @click="saveNotification(index)">Save</b-btn>
              </b-col>
            </b-row>
          </b-col>
          <b-col class="fs-11 notificationBorder" v-if="notification.mode">
            <div class="pb-5">Notification {{index + 1}}
              <b-btn class="pull-right  pt-2 pb-2" variant="outline-primary" size="sm" @click="notification.mode = !notification.mode, hideAddNotification = !hideAddNotification">Edit</b-btn>
            </div>
            If "{{notification.triggerCondition.selectedOptionVal}}" is selected:<br>
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
      <b-col cols="12" class="pt-5">
        <b-btn variant="outline-primary" v-if="hideAddNotification && (notifications.length < choicesGiven.length || notifications.length == 0)" class="fs-12" size="sm" @click="addNewNotification()">Add notification</b-btn>
      </b-col>
    </b-row> -->
    <b-row class="pb-12">
      <b-col cols="12">
        <hr>
      </b-col>
      <b-col cols="12" class="fw-bold">
        Field Name
      </b-col>
      <b-col cols="12" class="pt-10 fs-15">
        You may name this field for the purposes of data mapping. It will not be visible to the Site Team(s) or participants.
      </b-col>
      <b-col cols="12 pt-12">
        <b-form-input type="text" v-model="dropDownData.fieldName" placeholder="Enter field name" class="form-control fs-15 field-h40" size="sm" v-bind:class="{'is-danger': dropDownData.fieldNameErrorMsg }" v-on:keyup.native="checkForErrors" autocomplete="off"></b-form-input>
        <span class="error-style ml-5" v-if="dropDownData.fieldNameErrorMsg">{{dropDownData.fieldNameErrorMsg}}</span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import find from 'lodash/find';

import schemas from '../../../data/form-components-json/schemas.json';

export default {
  name: 'drop-down-prop',
  components: {},
  data() {
    return {
      dropDownData: [],
      choicesGiven: [],
      hideAddNotification: true,
      notifications: [],
      notificationSchema: find(schemas, 'fieldType', 'DropDown').schemas.notificationSchema,
    };
  },
  props: ['dropdownSchema'],
  mounted() {
    this.dropDownData = this.dropdownSchema;
    this.notifications = this.dropDownData.notifications || [];
  },
  computed: {
    choicesToShow() {
      this.choicesGiven = [];
      this.dropDownData.options.forEach(element => {
        this.choicesGiven.push({
          value: element.index,
          text: element.label,
          disabled: false,
        });
      });
      return this.choicesGiven;
    },
  },
  methods: {
    addNewNotification() {
      const notificationSchema = cloneDeep(this.notificationSchema);
      notificationSchema.notificationConditionFlag = false;
      notificationSchema.notificationContactFlag = false;
      this.notifications.push(notificationSchema);
      this.hideAddNotification = !this.hideAddNotification;
    },

    saveNotification(index) {
      this.notifications[index].notificationContactFlag = false;
      this.notifications[index].notificationConditionFlag = false;
      const selectedContactsList = filter(this.notifications[index].contacts, 'status', true);
      let modeOfNotificationErroCount = 0;
      // get notifications where contact is selected but no mode of notification ( sms or email)
      selectedContactsList.forEach(contact => {
        if (!contact.sms && !contact.email) {
          modeOfNotificationErroCount += 1;
        }
      });
      // check for the notification trigger condition ( check for the option whether selected )
      if (!this.notifications[index].triggerCondition.selectedOptionVal) {
        this.notifications[index].notificationConditionFlag = true;
      } else if (filter(this.notifications[index].contacts, 'status', true).length <= 0) {
        // check if any contact is selected ot not for notification
        this.notifications[index].notificationContactFlag = true;
      } else if (modeOfNotificationErroCount > 0) {
        // check notifications where contact is selected but no mode of notification ( sms or email)
        const selectedContacts = filter(this.notifications[index].contacts, 'status', true);
        selectedContacts.forEach(contact => {
          if (!contact.sms && !contact.email) {
            this.notifications[index].notificationContactFlag = true;
          }
        });
      } else {
        this.notifications[index].mode = !this.notifications[index].mode;
        this.hideAddNotification = !this.hideAddNotification;
        this.choicesGiven[index].disabled = true;
        this.dropDownData.notifications = this.notifications;
        this.dropDownData.notifications[index].name = `${
          this.dropDownData.notifications[index].name
        } ${index + 1}`;
      }
    },

    removeNotification(index) {
      this.choicesGiven[index].disabled = false;
      this.notifications.splice(index, 1);
      const tempNotifications = this.notifications;
      this.notifications = [];
      tempNotifications.forEach((notification, ind) => {
        const tempNotification = notification;
        tempNotification.name = `Notification ${ind + 1}`;
        this.notifications.push(tempNotification);
      });
      this.dropDownData.notifications = this.notifications;
    },

    addContact(index) {
      this.notifications[index].contacts.push({
        status: true,
        name: 'Sari Patel(PhV)',
        email: false,
        sms: false,
      });
    },

    findOptionVal(index, optIndex) {
      // find choice selected from available choice
      // then store that choice value in notification data
      if (!this.dropDownData.options[findIndex(this.dropDownData.options, ['index', optIndex])]) {
        this.notifications[index].triggerCondition.selectedOptionVal = '';
      } else {
        this.notifications[index].triggerCondition.selectedOptionVal = this.dropDownData.options[
          findIndex(this.dropDownData.options, ['index', optIndex])
        ].label;
      }
    },

    checkForErrors() {
      if (this.dropDownData.fieldName && this.dropDownData.fieldName.trimEnd().length > 0) {
        this.dropDownData.fieldNameErrorMsg = '';
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
