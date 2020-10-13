<template>
  <b-modal ref="modal" size="lg" hide-footer :no-close-on-esc="true" :no-close-on-backdrop="true">
    <b-form>
      <b-row align-v="center" class="pb-15 pt-10">
        <b-col cols="11" class="p-0">
          <h5 class="modal-title">{{title}}</h5>
        </b-col>
        <b-col cols="1">
          <button
            type="button"
            class="close pull-right"
            data-dismiss="modal"
            aria-label="Close"
            @click="closeModal()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </b-col>
      </b-row>
      <b-row class="pb-10 border-style">
        <b-col cols="4">
          <span class="header-text">First name</span>
          <b-form-input
            type="text"
            class="bg"
            v-model="selectedMember.firstName"
            placeholder="Enter name"
            v-validate="{regex: /^[A-Za-z- ]+$/ }"
            name="firstname"
            v-bind:class="{'input': true, 'is-danger': errors.has('firstname')}"
          ></b-form-input>
          <span v-if="errors.has('firstname')" class="error-style">
             <span v-if="errors.first('firstname') == `The firstname field format is invalid.`">Alphabetic entries only are allowed</span>
          </span>
        </b-col>
        <b-col cols="4">
          <span class="header-text">Last Name</span>
          <b-form-input
            type="text"
            class="bg"
            v-model="selectedMember.lastName"
            placeholder="Enter name"
            v-validate="{regex: /^[A-Za-z- ]+$/ }"
            name="lastName"
            v-bind:class="{'input': true, 'is-danger': errors.has('lastName')}"
          ></b-form-input>
          <span v-if="errors.has('lastName')" class="error-style">
            <span v-if="errors.first('lastName') == `The lastName field format is invalid.`">Alphabetic entries only are allowed</span>
          </span>
        </b-col>
        <b-col cols="4">
          <span class="header-text">Role</span>
          <b-form-select
            class="modal-custom-select"
            v-validate="'required'"
            v-model="selectedMember.userRole"
            name="role"
            v-bind:class="{'input': true, 'is-danger': errors.has('role')}"
            :disabled="selectedMember.userRole === 'Pi' && (activePI || modalType === 'edit')"
          >
            <option value disabled>Select</option>
            <option value="Pi" :disabled="activePI || modalType === 'edit'">Principal Investigator</option>
            <option value="SubPi">Sub-Investigator</option>
            <option value="StudyCoordinator">Study Coordinator</option>
            <option value="HomeHealth">Home Health</option>
            <option value="SiteDataLock">Site - Data Lock</option>
          </b-form-select>
          <span v-if="errors.has('role')" class="error-style">Please select valid role.</span>
        </b-col>
      </b-row>
      <b-row class="pb-10 border-style">
        <b-col cols="4">
          <span class="header-text">Email address</span>
          <b-form-input
            type="email"
            class="required"
            v-model="selectedMember.username"
            placeholder="Enter Email"
            v-validate="'required|email'"
            name="emailID"
            v-bind:class="{'input': true, 'is-danger': errors.has('emailID')}"
            :disabled="selectedMember.status == 'Active' || selectedMember.status == 'Inactive' || (canPiAccess && modalType === 'edit')"
          ></b-form-input>
          <span v-if="errors.has('emailID')" class="error-style">Please enter valid email address.</span>
        </b-col>
        <b-col cols="4">
          <span class="header-text">Phone number</span>
          <!-- <b-form-input type="tel" class="required" v-model="selectedMember.phoneNumber" placeholder="(   )" 
              v-bind:class="{'input': true, 'is-danger': selectedMember.phoneError}" @keyup.native="validatePhone(selectedMember)">
            </b-form-input>
          <span v-if="selectedMember.phoneError" class="error-style">{{selectedMember.phoneError}}</span>-->
          <span>
            <vue-tel-input
              class="p-0 bg"
              @onInput="onInputPhone"
              v-model="selectedMember.phoneNumber"
              :preferredCountries="['us', 'ca']"
              :placeholder="'(      )  '"
              v-bind:class="{'input': true, 'is-danger': selectedMember.phoneError}"
            ></vue-tel-input>
            <span v-if="selectedMember.phoneError" class="error-style">{{selectedMember.phoneError}}</span>
          </span>
        </b-col>
        <b-col
          cols="4"
          v-if="selectedMember.status === 'Active' && user.userRole === 'Pi' && (user.username === selectedMember.username)"
        ></b-col>
        <b-col cols="4" v-else>
          <span class="un-bld-Lbl-Txt">Unblinded</span>
          <label class="switch">
            <input type="checkbox" v-model="selectedMember.blinded" />
            <div class="slider round"></div>
          </label>
          <span class="bld-Lbl-Txt">Blinded</span>
          <span class="info-msg">
            <i
              class="fa fa-info-circle help_icon cursor_pointer"
              aria-hidden="true"
              data-toggle="popover"
              tabindex="0"
              data-trigger="focus"
              data-content="Toggling,the member as <b>Blinded</b> will hide sensitive participant
                       information for this  member.<b>Unblinded</b> will show all participant information allowed 
                       for this role.
                      "
              data-html="true"
            ></i>
          </span>
        </b-col>
      </b-row>
      <b-row
        class="pt-30"
        align-self="center"
        align-v="center"
        align-h="center"
        v-if="modalType === 'add'"
      >
        <b-col class="pull-right">
          <b-btn
            variant="success"
            class="pull-right create-btn fs-14"
            @click="validateAddTeamBeforeSubmit()"
          >Send Invite</b-btn>
          <b-link variant="primary" class="pull-right pt-8 fs-14 pr-20" @click="closeModal()">Cancel</b-link>
        </b-col>
      </b-row>
      <b-row class="pt-30" v-if="modalType === 'edit'">
        <b-col class="pull-left" cols="6" align-self="center">
          <b-link
            class="deactivate-member"
            @click="activateMember('Inactive')"
            v-if="modalType === 'edit' && (selectedMember.status == 'Active' || selectedMember.status == 'Pending')  && ((selectedMember.userRole === 'Pi' && (canSysAdminAccess || canStudyAdminAccess)) || (selectedMember.userRole !== 'Pi'))"
          >Deactivate member</b-link>
          <b-link
            class="deactivate-member"
            @click="activateMember('Active')"
            v-if="modalType === 'edit' && selectedMember.status == 'Inactive'  && ((selectedMember.userRole === 'Pi' && (canSysAdminAccess || canStudyAdminAccess) && !activePI) || (selectedMember.userRole !== 'Pi'))"
          >Activate member</b-link>
        </b-col>
        <b-col class="pull-right" cols="6">
          <b-btn
            variant="success"
            class="pull-right create-btn fs-14"
            @click="updateTeamMemDetail()"
          >Update</b-btn>
        </b-col>
      </b-row>
      <div class="modal-style"></div>
    </b-form>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import swal from "sweetalert2";
import cloneDeep from "lodash/cloneDeep";
import { SYSTEM_ADMIN, STUDY_ADMIN, PI, SITEDATALOCK  } from "@/constants/authRoles";
import { AclRule } from "vue-acl";

export default {
  name: "research-site",
  data() {
    return {
      selectedMember: {}
    };
  },
  props: {
    siteId: String,
    studyId: String,
    modalType: String,
    activePI: Boolean,
    memberDetails: Object,
    title: String
  },
  computed: {
    ...mapGetters(["user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check("userAccess");
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check("userAccess");
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
  },
  watch: {
    memberDetails: {
      handler() {
        if (this.modalType === "add") {
          this.selectedMember = {};
          this.errors.clear();
        } else {
          this.errors.clear();
          this.selectedMember = cloneDeep(this.memberDetails);
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    window.setTimeout(() => {
      window.$('[data-toggle="popover"]').popover();
    }, 1);
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    onInputPhone({ number, isValid, country }) {
      this.selectedMember.phoneError = false;
      this.$forceUpdate();
      if (!isValid && number.length > 0) {
        this.selectedMember.phoneError = "Please enter a valid phone number.";
        this.$forceUpdate();
      } else {
        this.selectedMember.phoneError = false;
        this.$forceUpdate();
      }
    },

    validateAddTeamBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.selectedMember.phoneError) {
            this.$toastr.error(this.selectedMember.phoneError);
          } else {
            this.selectedMember.phoneNumber = this.selectedMember.phoneNumber
              ? this.selectedMember.phoneNumber.replace(/\s/g, "")
              : this.selectedMember.phoneNumber;
            this.$api
              .postSiteTeamMemberFact(
                this.studyId,
                this.siteId,
                this.selectedMember
              )
              .then(
                response => {
                  window.console.log(response.body);
                  this.$emit("added");
                  this.errors.clear();
                  this.hide();
                  this.selectedMember = {};
                },
                error => {
                  this.$toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : "Error while getting the site details."
                  );
                }
              );
          }
        }
      });
    },

    updateTeamMemDetail() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.selectedMember.phoneError) {
            this.$toastr.error(this.selectedMember.phoneError);
          } else {
            if(this.selectedMember.phoneNumber) {
            this.selectedMember.phoneNumber = this.selectedMember.phoneNumber.replace(
              /\s/g,
              ""
            );
            }
            this.$api
              .editProfileDetails(this.selectedMember.id, this.selectedMember)
              .then(
                response => {
                  window.console.log(response.body);
                  this.$emit("updated");
                  this.$toastr.success("Team member updated succesfully");
                  this.errors.clear();
                  this.hide();
                  this.selectedMember = {};
                },
                error => {
                  this.$toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : "Error while getting the site details."
                  );
                }
              );
          }
        }
      });
    },

    activateMember(status) {
      const data = {
        status
      };
      swal({
        title: "Are you sure you want to change the status of this member?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4c8ce4",
        cancelButtonColor: "#4c8ce4",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$api
            .activateTeamMemberFact(
              this.studyId,
              this.siteId,
              this.selectedMember.id,
              data
            )
            .then(
              response => {
                window.console.log(response.body);
                if (status === "Inactive") {
                  this.$toastr.success("Team member deactivated succesfully");
                }
                if (status === "Active") {
                  this.$toastr.success("Team member activated succesfully");
                }
                this.$emit("updated");
                this.hide();
              },
              error => {
                this.$toastr.error(
                  error.body && error.body.message
                    ? error.body.message
                    : "Error while getting the site details."
                );
              }
            );
        } else {
          this.hide();
        }
      });
    },

    closeModal() {
      this.$swal({
        title: "Are you sure you want to cancel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4a4a4a",
        cancelButtonColor: "#1e8fe1",
        confirmButtonText: "No",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.hide();
          if (this.modalType === "add") {
            this.selectedMember = {};
          } else {
            this.selectedMember = cloneDeep(this.memberDetails);
          }
          this.errors.clear();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.header-text {
  color: #666669 !important;
  opacity: 0.5;
}

/deep/ .modal-content {
  width: 800px !important;
}

/deep/ .modal-header {
  display: none;
  border-bottom: none !important;
  padding-left: 30px !important;
}

/deep/ .modal-title {
  font-weight: bold !important;
  padding-left: 15px !important;
}

.create-btn {
  border-radius: 100px;
  border: none;
  width: 120px;
  height: 35px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.deactivate-member {
  color: #f16559;
}

.is-danger {
  border-color: #ff4848;
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
  top: 27px;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #ccc;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 1px;
  background-color: #ccc;
}
input:checked + .slider {
  border: 2px solid #48bf7a;
}
input:checked + .slider:before {
  content: "";
  background-color: #48bf7a;
}
input:checked + .slider:before {
  /*content: '✓';*/
  position: absolute;
  color: #2ecc71;
  text-align: center;
  font-size: 20px;
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}

/* Hide default HTML checkbox */
.switch input {
  display: none;
}
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
/* Rounded sliders */
.un-bld-Lbl-Txt {
  color: #666669 !important;
  opacity: 0.5;
  position: relative;
  top: 14px;
  right: 10px;
}
.bld-Lbl-Txt {
  color: #666669 !important;
  opacity: 0.5;
  position: relative;
  top: 14px;
  left: 5px;
}
.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}
.info-msg {
  position: relative;
  left: 15px;
  top: 14px;
}
</style>
