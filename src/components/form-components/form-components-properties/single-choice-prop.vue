<template>
  <b-row>
    <h6 class="pl-12 pt-20 text-color fs-20">
      <b>Single-choice Options</b>
    </h6>
    <b-row class="pt-18 mb-20">
      <b-col cols="12" class="fs-13 mb-10" align-self="center">
        <b>Field Requirement.</b>
      </b-col>
      <b-col class="fs-12" align-self="center">
        <b-form-checkbox @change="singleChoiceData.required = !singleChoiceData.required" v-model="singleChoiceData.required" class="pl-0">
          <span class="pl-25 text-align fs-15">Required</span>
        </b-form-checkbox><br>
        <b-form-checkbox @change="singleChoiceData.colorCodeEnabled = !singleChoiceData.colorCodeEnabled" v-model="singleChoiceData.colorCodeEnabled" class="pl-0">
          <span class="pl-25 text-align fs-15">Add color-coded alerts to answers for the study team</span>
        </b-form-checkbox><br>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <hr>
      </b-col>
      <b-col cols="12" class="pt-20 fs-13">
        <b>Notifications</b>
      </b-col>
      <b-col cols="12" class="pt-10 fs-15">
        Alert individuals on the study team based on an outcome of this question.
      </b-col>
      <b-col cols="12" v-if="notifications.length">
        <div v-for="(notification, index) in notifications" :key="index" v-if="notifications.length" class="pt-10">
          <b-col class="fs-11 notificationBorder" v-if="!notification.mode">
            <b-form-select v-model="notification.selectedIndex" class="mb-5 fs-12" size="sm" :change="findOptionVal(index, notification.selectedIndex)">
              <option :value="null">Select notification choice</option>
              <option v-for="(option, index) in choicesToShow" :key="index" :value="option.value" :name="option.text">{{option.text}}</option>
            </b-form-select>
            <b-row v-if="notification.selectedIndex === 1">
              <b-form-select v-model="notification.selectedOption" class="mb-5 fs-12" size="sm">
                <option :value="null">Select answer choice</option>
                <option v-for="(option, index) in singleChoiceoptions" :key="index" :value="option.index" :name="option.label">{{option.label}}</option>
              </b-form-select>
            </b-row>
            <b-row v-if="notification.showContactsBtn" class="pt-20 pb-20" align-v="center" align-h="between">
              <label class="pt-4">0 people selected</label>
              <b-btn variant="outline-primary" class="fs-12 pull-right" size="sm" @click="notification.showContactsBtn = !notification.showContactsBtn">Select people to notify</b-btn>
            </b-row>
            <span class="error-style" v-if="notification.notificationConditionFlag">Please select an option to trigger notification.</span>
            <b-row v-if="!notification.showContactsBtn">
              <b-col cols="12" class="pl-3 pt-5 pb-5">If selected, notify:</b-col>
              <b-col cols="12" v-for="(contact, contactIndex) in notification.contacts" :key="contactIndex" class="pt-5 pl-3">
                <switches v-model="contact.status" theme="custom" color="blue" :class="!contact.status?'vue-switcher--unchecked':''" @click.native="updateStatus(index, contactIndex)"></switches>
                <label class="pl-5" :class="{'disabled-contact': !contact.status}">{{contact.name}}</label><br>
                <div class="pb-5 pl-20" v-if="contact.status">
                  <b-form-checkbox @change="contact.email = !contact.email" v-if="contact.status" v-model="contact.email" class="pl-0 fs-10">
                    <span class="pl-25 text-align">Email</span>
                  </b-form-checkbox>
                  <b-form-checkbox @change="contact.mobile = !contact.mobile" v-if="contact.status" v-model="contact.mobile" class="pl-0 fs-10">
                    <span class="pl-25 text-align">SMS text message</span>
                  </b-form-checkbox><br>
                </div>
              </b-col>
            </b-row>
            <!-- <b-row>
              <b-col class="p-0">
                <b-btn @click="addContact(index)" variant="link" size="sm" class="fs-12 pl-0">Add new contact</b-btn>
              </b-col>
            </b-row> -->
            <span class="error-style" v-if="notification.notificationContactFlag">Please select a team member to be notified and a notification method.</span>
            <b-row class="pt-20">
              <b-col cols="2" class="p-0">
                <i class="fa fa-trash-o fs-18 pull-left iconColor pt-6 cursor_pointer" aria-hidden="true" @click="removeNotification(index), hideAddNotification = true"></i>
              </b-col>
              <b-col cols="10" class="p-0">
                <b-btn class="btn br-1 fs-12 pull-right" variant="primary" size="sm" @click="saveNotification(index)">Save</b-btn>
              </b-col>
            </b-row>
          </b-col>
          <b-col class="fs-11 notificationBorder" v-if="notification.mode">
            <div class="pb-5">
              <b>Notification {{index + 1}}</b>
              <b-btn class="pull-right fs-12 pt-2 pb-2" variant="outline-primary" size="sm" @click="editNotification(index)" :disabled="!hideAddNotification">Edit</b-btn>
            </div>
            If "
            <b>{{notification.selectedOptionVal}}</b>" is selected:<br>
            <ul v-for="(contact, contactIndex) in notification.contacts" :key="contactIndex" class="pl-15 mb-0">
              <div v-if="contact.status">
                <li>
                  <span v-if="contact.email">Email </span>
                  <span v-if="contact.email && contact.mobile">and</span>
                  <span v-if="contact.mobile"> SMS text message</span>
                  <b>{{contact.name}}</b>
                </li>
              </div>
            </ul>
          </b-col>
        </div>
      </b-col>
      <b-col cols="12" class="pt-10 pb-15">
        <b-btn variant="outline-primary" v-if="hideAddNotification" class="fs-12" size="sm" @click="addNewNotification()" :disabled="disableNotificationAdd">Add notification</b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <hr>
      </b-col>
      <b-col cols="12" class="pt-8 fs-13">
        <b>Field Name</b>
      </b-col>
      <b-col cols="12" class="pt-10 fs-15">
        You may name this field for the purposes of data mapping. It will not be visible to the Site Team(s) or participants.
      </b-col>
      <b-col cols="12 pt-8 mb-30">
        <b-form-input type="text" v-model="singleChoiceData.fieldName" placeholder="Enter field name" class="field-h40 form-control fs-15" size="sm" v-bind:class="{'is-danger': singleChoiceData.fieldNameErrorMsg }" v-on:keyup.native="checkForErrors" autocomplete="off"></b-form-input>
        <span class="error-style" v-if="singleChoiceData.fieldNameErrorMsg">{{singleChoiceData.fieldNameErrorMsg}}</span>
      </b-col>
    </b-row>
  </b-row>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import difference from 'lodash/difference';
import find from 'lodash/find';
import swal from 'sweetalert2';

import schemas from '../../../data/form-components-json/schemas.json';

export default {
  name: 'single-choice-prop',
  data() {
    return {
      singleChoiceData: [],
      choicesGiven: [],
      hideAddNotification: true,
      notifications: [],
      notificationSchema: find(schemas, 'fieldType', 'SingleChoice').schemas.notificationSchema,
      studyId: this.$route.params.studyId,
      contacts: [],
      selectedOption: null,
      singleChoiceoptions: [],
      disableNotificationAdd: true,
    };
  },
  props: ['singleChoiceSchema'],
  mounted() {
    this.singleChoiceData = this.singleChoiceSchema;
    this.notifications = [];
    if (this.singleChoiceData.notifications && this.singleChoiceData.notifications.length) {
      this.singleChoiceData.notifications.forEach(notify => {
        const tempNotify = notify;
        tempNotify.mode = true;
        tempNotify.notificationConditionFlag = false;
        tempNotify.notificationContactFlag = false;
        tempNotify.showContactsBtn = false;
        if (notify.selectedOptionIndex >= 0) {
          tempNotify.selectedIndex = 1;
          tempNotify.selectedOption = notify.selectedOptionIndex;
          tempNotify.selectedOptionVal = this.singleChoiceData.options[
            notify.selectedOptionIndex
          ].label;
        }
        if (notify.selectedOptionIndexAny) {
          tempNotify.selectedIndex = 0;
          tempNotify.selectedOptionVal = 'If any answer is provided';
        }
        const tempContacts = [];
        tempNotify.contacts.forEach(contact => {
          const tempContact = contact;
          if (contact.email || contact.mobile) {
            tempContact.status = true;
          } else {
            tempContact.status = false;
            tempContact.email = false;
            tempContact.mobile = false;
          }
          tempContacts.push(tempContact);
        });
        tempNotify.contacts = tempContacts;
        this.notifications.push(tempNotify);
      });
    }
    this.getStudyTeam();
  },
  computed: {
    choicesToShow() {
      this.choicesGiven = [
        {
          index: 0,
          value: 0,
          text: 'If any answer is provided',
        },
        {
          index: 1,
          value: 1,
          text: 'If a specific answer is provided.',
        },
      ];
      return this.choicesGiven;
    },
    singleChoiceOptions() {
      return this.singleChoiceData.options;
    },
  },
  methods: {
    updateStatus(notificationIndex, index) {
      this.notifications[notificationIndex].contacts[index].status = !this.notifications[
        notificationIndex
      ].contacts[index].status;
      this.$forceUpdate();
    },

    addNewNotification() {
      const notificationSchema = cloneDeep(this.notificationSchema);
      notificationSchema.notificationConditionFlag = false;
      notificationSchema.notificationContactFlag = false;
      notificationSchema.contacts = cloneDeep(this.contacts);
      notificationSchema.showContactsBtn = true;
      this.notifications.push(notificationSchema);
      this.hideAddNotification = !this.hideAddNotification;
    },

    editNotification(notifyIndex) {
      this.notifications[notifyIndex].mode = !this.notifications[notifyIndex].mode;
      this.hideAddNotification = !this.hideAddNotification;
      if (this.contacts.length) {
        if (this.notifications.length) {
          this.notifications.forEach((notify, index) => {
            const tempNotify = notify;
            const notificationContactsIds = tempNotify.contacts.map(field => field.id);
            const allContactsIds = this.contacts.map(field => field.id);
            const unAddedContacts = difference(allContactsIds, notificationContactsIds);
            if (unAddedContacts) {
              const contacts = cloneDeep(this.contacts);
              unAddedContacts.forEach(contactId => {
                const currentContact = contacts.filter(cont => cont.id === contactId);
                tempNotify.contacts.push(currentContact[0]);
              });
            }
            this.notifications[index] = tempNotify;
          });
        }
      }
    },

    saveNotification(index) {
      this.notifications[index].notificationContactFlag = false;
      this.notifications[index].notificationConditionFlag = false;
      const selectedContactsList = filter(this.notifications[index].contacts, 'status', true);
      let modeOfNotificationErroCount = 0;
      // get notifications where contact is selected but no mode of notification ( sms or email)
      selectedContactsList.forEach(contact => {
        if (!contact.mobile && !contact.email) {
          modeOfNotificationErroCount += 1;
        }
      });
      // check for the notification trigger condition ( check for the option whether selected )
      if (
        !this.notifications[index].selectedOptionVal
        || (this.notifications[index].selectedIndex === 1
          && (this.notifications[index].selectedOption < 0
            || this.notifications[index].selectedOption === undefined
            || this.notifications[index].selectedOption === null))
      ) {
        this.notifications[index].notificationConditionFlag = true;
      } else if (filter(this.notifications[index].contacts, 'status', true).length <= 0) {
        // check if any contact is selected ot not for notification
        this.notifications[index].notificationContactFlag = true;
      } else if (modeOfNotificationErroCount > 0) {
        const selectedContacts = filter(this.notifications[index].contacts, 'status', true);
        // check notifications where contact is selected but no mode of notification ( sms or email)
        selectedContacts.forEach(contact => {
          if (!contact.mobile && !contact.email) {
            this.notifications[index].notificationContactFlag = true;
          }
        });
        this.$forceUpdate();
      } else {
        this.notifications[index].mode = !this.notifications[index].mode;
        this.hideAddNotification = !this.hideAddNotification;
        // this.choicesGiven[index].disabled = true;
        this.notifications.showContactsBtn = false;
        if (this.notifications && this.notifications.length) {
          this.notifications.forEach((notification, notificationIndex) => {
            const tempContacts = notification.contacts.filter(contact => contact.status === true);
            this.notifications[notificationIndex].contacts = tempContacts;
          });
        }
        this.singleChoiceData.notifications = this.notifications;
        const selectesOpts = [];
        if (this.singleChoiceData.notifications[index].selectedIndex === 0) {
          this.singleChoiceData.options.forEach(opt => {
            selectesOpts.push(opt.index);
          });
          this.singleChoiceData.notifications[index].selectedOptionIndexAny = selectesOpts;
        } else {
          this.singleChoiceData.notifications[
            index
          ].selectedOptionIndex = this.singleChoiceData.notifications[index].selectedOption;
          this.singleChoiceData.notifications[
            index
          ].selectedOptionVal = this.singleChoiceData.options[
            this.singleChoiceData.notifications[index].selectedOption
          ].label;
        }
        this.selectedOption = null;
      }
    },

    removeNotification(index) {
      swal({
        title: `Are you sure you want to delete Notification ${index + 1} ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then(({ dismiss }) => {
        if (dismiss !== 'cancel') {
          this.notifications.splice(index, 1);
          const tempNotifications = this.notifications;
          this.notifications = [];
          tempNotifications.forEach(notification => {
            const tempNotification = notification;
            this.notifications.push(tempNotification);
          });
          this.singleChoiceData.notifications = this.notifications;
        }
      });
    },

    addContact(index) {
      this.notifications[index].contacts.push({
        status: true,
        name: 'Sari Patel(PhV)',
        email: false,
        mobile: false,
      });
    },

    findOptionVal(index, optIndex) {
      // find choice selected from available choice
      // then store that choice value in notification data
      if (!this.choicesGiven[findIndex(this.choicesGiven, ['index', optIndex])]) {
        if (this.notifications[index]) {
          this.notifications[index].selectedOptionVal = '';
        }
      } else {
        this.notifications[index].selectedOptionVal = this.choicesGiven[
          findIndex(this.singleChoiceData.options, ['index', optIndex])
        ].text;
      }
    },

    getStudyTeam() {
      const type="studyteam"
      const associated = "true"
      this.$api.getStudyUsersFact(this.$route.params.studyId, type, associated).then(response => {
        const contactsData = response.body;
        contactsData.forEach(contact => {
          this.contacts.push({
            id: contact.id,
            name: `${contact.firstName} ${contact.lastName} (${contact.userRole})`,
            email: false,
            mobile: false,
          });
        });
        if (this.contacts.length) {
          if (this.singleChoiceData.notifications.length) {
            this.singleChoiceData.notifications.forEach((notify, index) => {
              const tempNotify = notify;
              const notificationContactsIds = tempNotify.contacts.map(field => field.id);
              const allContactsIds = this.contacts.map(field => field.id);
              const unAddedContacts = difference(allContactsIds, notificationContactsIds);
              if (unAddedContacts) {
                const contacts = cloneDeep(this.contacts);
                unAddedContacts.forEach(contactId => {
                  const currentContact = contacts.filter(cont => cont.id === contactId);
                  tempNotify.contacts.push(currentContact[0]);
                });
              }
              this.singleChoiceData.notifications[index] = tempNotify;
            });
          }
        }
      });
    },

    checkForErrors() {
      if (this.singleChoiceData.fieldName && this.singleChoiceData.fieldName.trimEnd().length > 0) {
        this.singleChoiceData.fieldNameErrorMsg = '';
      }
    }
  },
  watch: {
    singleChoiceData: {
      handler() {
        this.singleChoiceoptions = this.singleChoiceData.options;
      },
      immediate: true,
      deep: true,
    },
    singleChoiceoptions: {
      handler() {
        if (this.singleChoiceoptions) {
          const fieldsData = this.singleChoiceoptions.filter(o => o.label && o.label.length);
          if (fieldsData.length === this.singleChoiceOptions.length) {
            this.disableNotificationAdd = false;
          } else {
            this.disableNotificationAdd = true;
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.notificationBorder {
  border-radius: 3px;
  border: 0.5px solid #e4e8eb;
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

.disabled-contact {
  color: #a9a9a9;
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
  border: 1px solid #f5f6f7;
  height: 15px;
  width: 15px;
}
</style>
