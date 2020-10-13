<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-30">
        <b-row class="pb-20 pl-14" v-if="(canSysAdminAccess || canStudyAdminAccess)">
            <b-link :to="{name: 'list-research-site'}"><i class="fa fa-caret-left" aria-hidden="true"></i> All Sites</b-link>
        </b-row>
        <!-- Buttons for edit/add/filter -->
        <b-row class="pb-20 pl-14">
            <b-col cols="2" class="p-0">
                <span class="fs-20"><b>{{siteDetails.name}}</b></span><br>
                <span class="fs-16"><b>Site ID : {{siteDetails.userSiteId}}</b></span>
            </b-col>
            <b-col cols="9" class="text-right" v-if="(canSysAdminAccess || canStudyAdminAccess)">
                <span>Site status:</span>
                <b-form-select class="custom-select fs-12 width-100" v-model="status" @change="updateStatus"
                :class="{ 'text-success': status === 'Active','text-danger': status === 'Inactive','text-warning': status === 'Pending'}">
                    <option class="text-body" value="Pending" disabled>Pending</option>
                    <option class="text-body" value="Active">Active</option>
                    <option class="text-body" value="Inactive">Inactive</option>
                </b-form-select>
                <b-btn class="fs-12 ml-10 mr-10 edit-btn width-100" @click="editSiteDetails()">Edit site info</b-btn>
                <b-btn variant="primary" class="fs-12 bg-4c8ce4" @click="openModal('addMember')">Add new member</b-btn>
                <b-btn variant="primary" class="fs-12 ml-10 bg-4c8ce4" @click="viewSiteDocument()">View Site Documents</b-btn>
            </b-col>
            <b-col cols="9" class="text-right" v-if="canPiAccess">
                <b-btn variant="primary" class="fs-14 width-120 bg-4c8ce4" @click="openModal('addMember')">Add new</b-btn>
            </b-col>
            <b-col cols="1">
            </b-col>
        </b-row>
        <!-- Table to list all the site team members -->        
        <b-row class="p-0">
            <b-col cols="11">
                <!-- Table header for research sites details -->
                <b-row class="pb-10 fs-10">
                    <b-col cols="3" class="header-text">
                        NAME
                    </b-col>
                    <b-col cols="3" class="header-text p-0"> 
                        EMAIL
                    </b-col>
                    <b-col cols="2" class="header-text">
                        PHONE NUMBER
                    </b-col>
                    <b-col cols="2" class="header-text p-0"> 
                        ROLE
                    </b-col>
                    <b-col cols="2" class="header-text">
                        STATUS
                    </b-col>
                </b-row>
                <!-- Site team details row -->
                <b-row class="site-card mb-10 fs-14" align-v="center" v-for="(member,index) in siteDetails.siteTeam" :key="index">
                    <b-col cols="3">
                      <b-row>
                        <b-col cols="2 p-0"><img class="profile-img-size" src="/static/img/profile.png" alt="user-img"/></b-col>
                        <b-col cols="10 pt-5 pl-10" class="name fs-14 word-break"><b> {{member.firstName}} {{member.lastName}} </b></b-col>
                    </b-row>
                    </b-col>
                    <b-col cols="3" class="word-break p-0">
                        {{member.username}}
                    </b-col>
                    <b-col cols="2" class="word-break">
                        {{member.phoneNumber}}
                    </b-col>
                    <b-col cols="2" class="word-break p-0">
                        <span v-if="member.userRole == 'Pi'">Principal Investigator</span>
                        <span v-if="member.userRole == 'SubPi'">Sub-Investigator</span>
                        <span v-if="member.userRole == 'StudyCoordinator'">Study Coordinator</span>
                        <span v-if="member.userRole == 'HomeHealth'">Home Health</span>
                        <span v-if="member.userRole == 'SiteDataLock'">Site - Data Lock</span>
                    </b-col>
                    <b-col cols="2" class="word-break">
                        <span class="text-warning" v-if="member.status == 'Pending'">{{member.status}}</span>
                        <span class="text-success" v-if="member.status == 'Active'">{{member.status}}</span>
                        <span class="text-danger" v-if="member.status == 'Inactive'">{{member.status}}</span>
                        <span class="pull-right">
                            <b-link v-if="member.status == 'Pending' && (canSysAdminAccess || canStudyAdminAccess || canPiAccess)">
                                <i class="fa fa-paper-plane br-1 fs-16 pr-4 icon-color" v-b-modal.invitationModal @click="currentSiteMem(index)" v-b-tooltip.hover title="Resend Invitation"></i>
                            </b-link>
                            <b-link v-if="canSysAdminAccess || canStudyAdminAccess || canPiAccess">
                                <i class="fa fa-pencil pull-right fs-16 icon-color" @click="openModal('editMember', index)" v-b-tooltip.hover title="Edit"></i>
                            </b-link>
                        </span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <!-- Site Edit Modal Component -->
        <b-modal id="editSiteDetailsModal" size="lg" ref="editSiteDetailsModal" @hidden="onCloseEditModal" hide-footer title="Edit site details">
            <b-row class="pb-10 border-style mb-10">
                <b-col cols="8">
                    <span class="header-text">Site name</span>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>
                    <b-form-input type="text" class="required" v-model="details.name" placeholder="Enter name" name="siteName" 
                      v-validate="'required'" v-bind:class="{'input': true, 'is-danger': errors.has('siteName')}">
                    </b-form-input>
                    <span v-if="errors.has('siteName')" class="error-style">Site name is required.</span>
                </b-col>
                <b-col cols="3">
                    <span class="header-text">Site ID</span>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>
                    <b-form-input type="text" class="required" v-model="details.userSiteId" placeholder="Enter ID" name="userSiteId"
                    v-validate="'required'" v-bind:class="{'input': true, 'is-danger': errors.has('userSiteId')}">
                    </b-form-input>
                    <span v-if="errors.has('userSiteId')" class="error-style">Site ID is required.</span>
                </b-col>
                <b-col cols="3" class="pt-20">
                    <span class="header-text">Site type</span>
                    <b-form-select :options="siteTypes" class="modal-custom-select" v-model="details.type">
                    </b-form-select>
                </b-col>
                <b-col cols="3" class="pt-20">
                    <span class="header-text">Site country <span v-b-popover.hover.html="'The <strong>site country</strong> is the country participants will be associated with when enrolled. If the site is associated to multiple countries, they can be added by clicking “Add another country.” When multiple countries are added, participants will choose which country to associate themselves with during enrollment.'" class="fa fa-info-circle ml-7"></span></span>
                    <b-form-select :disabled="siteDetails.status !=='Pending'" :options="primaryCountryOptions"  v-model="primaryRegion.value" class="modal-custom-select" @change.native="selectPrimary($event)"></b-form-select>
                </b-col>
                <b-col v-if="details.type && details.type.toLowerCase()=='virtual'" cols="5" class="pt-50" >
                  <label for="allowPartFromAnyRegion" class="fw-normal">
                    <input type="checkbox" name="allowPartFromAnyRegion" id="allowPartFromAnyRegion" class="checkbox_position" v-model="siteVirtualAddress.isAllowOtherRegionParticipant" />
                    <span><strong>Allow participants from any region</strong></span><span v-b-popover.hover.html="'Site available to all participants from any location'" class="fa fa-info-circle ml-7"></span>
                  </label>
                </b-col>
            </b-row>
            <b-row v-for="(option, index) in countriesSelected" class="pb-20">
              <b-col cols="3">
                <span class="header-text">Additional Country</span>
                <b-form-select @change.native="selectCountry($event, index)" :disabled="siteDetails.status !=='Pending'" :options="filterCountriesOptions[index]"  v-model="option.value" class="modal-custom-select"></b-form-select>
              </b-col>
              <b-col cols="3 mt-25" v-if="siteDetails.status == 'Pending'" ><b-link @click="removeCountry($event, index)" class="link-color pt-10"><b>Remove</b></b-link></b-col>
            </b-row>
            <b-col v-if="siteDetails.status == 'Pending'" cols="12"><b-link @click="addCountry($event)"><b>Add another country</b></b-link></b-col>
            
            <div v-if="details.type && details.type.toLowerCase()=='virtual'" id="virtual-site-container" class="site-address-elements">
              <b-row>
                <b-col cols="4">
                  <b-form-group
                    id="virtual-city-label"
                    label="City"
                    label-for="virtualSiteCity"
                    :invalid-feedback="errors.first('virtualSiteCity')"
                    :state="!errors.has('virtualSiteCity')"
                  >
                    <b-form-input type="text" placeholder="City" v-validate="'alpha_spaces'" id="virtualSiteCity" name="virtualSiteCity" v-model="siteVirtualAddress.city" :state="!errors.has('virtualSiteCity')" key="virtual-city-input">
                    </b-form-input>
                  </b-form-group>    
                </b-col>
                <b-col cols="3">
                  <b-form-group
                    id="virtual-state-label"
                    label="State / Province"
                    label-for="virtualSiteState"
                    :invalid-feedback="errors.first('virtualSiteState')"
                    :state="!errors.has('virtualSiteState')"
                  >
                    <b-form-input type="text" placeholder="State / Province" v-validate="'alpha_spaces'" id="virtualSiteState" name="virtualSiteState" v-model="siteVirtualAddress.state" key="virtual-state-input" :state="!errors.has('virtualSiteState')">
                    </b-form-input>
                  </b-form-group>    
                </b-col>
                <b-col cols="3">
                  <b-form-group
                    id="virtual-country-label"
                    label-for="virtualSiteCountry"
                    :invalid-feedback="errors.first('virtualSiteCountry')"
                    :state="!errors.has('virtualSiteCountry')"
                  >
                    <label class="col-form-label">Address country <span v-b-popover.hover.html="'The <strong>address country</strong> is the country associated to the physical address of the site.'" class="fa fa-info-circle ml-7"></span></label>
                    <b-form-select name="virtualSiteCountry" id="virtualSiteCountry" class="select-arrow" v-validate="'alpha_spaces'" v-model="siteVirtualAddress.country" key="virtual-country-input" :state="!errors.has('virtualSiteCountry')">
                    <option value=''>Select country</option>
                    <option v-for="(countryObj, indexOpt) in primaryCountryOptions" 
                          :key="indexOpt"
                          :value="countryObj.text"
                      >{{ countryObj.text }}</option>
                    </b-form-select>
                  </b-form-group>    
                </b-col>
              </b-row>
            </div><!-- ="details.type && details.type.toLowerCase()=='physical'"-->
            <div v-else id="physical-site-container" class="site-address-elements">
              <b-row>
                <b-col cols="8">
                  <b-form-group
                    id="physical-address-label"
                    label-for="physicalSiteAddress"
                    :invalid-feedback="errors.first('physicalSiteAddress')"
                    :state="!errors.has('physicalSiteAddress')"
                  >
                    <label class="col-form-label">Address</label>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>
                    <b-form-input type="text" placeholder="Address" v-validate="'required'" id="physicalSiteAddress" name="physicalSiteAddress" v-model="sitePhysicalAddress.address" :state="!errors.has('physicalSiteAddress')" key="physical-address-input">
                    </b-form-input>
                  </b-form-group>    
                </b-col>
                <b-col cols="4" class="pl-0">
                  <b-form-group
                    id="physical-city-label"
                    label-for="physicalSiteCity"
                    :invalid-feedback="errors.first('physicalSiteCity')"
                    :state="!errors.has('physicalSiteCity')"
                  >
                    <label class="col-form-label">City</label>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>
                    <b-form-input type="text" placeholder="City" v-validate="'required|alpha_spaces'" id="physicalSiteCity" name="physicalSiteCity" v-model="sitePhysicalAddress.city" :state="!errors.has('physicalSiteCity')" key="physical-city-input">
                    </b-form-input>
                  </b-form-group>    
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="3" class="custom-width">
                  <b-form-group
                    id="physical-zip-label"
                    label-for="physicalSiteZip"
                    :invalid-feedback="errors.first('physicalSiteZip')"
                    :state="!errors.has('physicalSiteZip')"
                  >
                    <label class="col-form-label">Zip / Postal code</label>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>
                    <b-form-input type="text" placeholder="Zip / Postal code" v-validate="'required|alpha_num'" id="physicalSiteZip" name="physicalSiteZip" v-model="sitePhysicalAddress.zipcode" :state="!errors.has('physicalSiteZip')" key="physical-zip-input">
                    </b-form-input>
                  </b-form-group>    
                </b-col>
                <b-col cols="3" class="custom-width">
                  <b-form-group
                    id="physical-state-label"
                    label-for="physicalSiteState"
                    :invalid-feedback="errors.first('physicalSiteState')"
                    :state="!errors.has('physicalSiteState')"
                  >
                    <label class="col-form-label">State / Province</label>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>
                    <b-form-input type="text" placeholder="State / Province" v-validate="'required|alpha_spaces'" id="physicalSiteState" name="physicalSiteState" v-model="sitePhysicalAddress.state" :state="!errors.has('physicalSiteState')" key="physical-state-input">
                    </b-form-input>
                  </b-form-group>    
                </b-col>
                <b-col cols="3" class="custom-width-country">
                  <b-form-group
                    id="physical-country-label"
                    label-for="physicalSiteCountry"
                    :invalid-feedback="errors.first('physicalSiteCountry')"
                    :state="!errors.has('physicalSiteCountry')"
                  >
                    <label class="col-form-label">Address country</label>&nbsp;&nbsp;<span class="fa fa-asterisk" aria-hidden="true"></span>&nbsp;<span v-b-popover.hover.html="'The <strong>address country</strong> is the country associated to the physical address of the site.'" class="fa fa-info-circle ml-7" style="opacity: 0.5"></span>
                    <b-form-select class="select-arrow" v-validate="'required|alpha_spaces'" id="physicalSiteCountry" name="physicalSiteCountry" v-model="sitePhysicalAddress.country" :state="!errors.has('physicalSiteCountry')" key="physical-country-input">
                      <option value=''>Select country</option>
                      <option v-for="(countryObj, indexOpt) in primaryCountryOptions" 
                          :key="indexOpt"
                          :value="countryObj.text"
                      >{{ countryObj.text }}</option>
                    </b-form-select>
                  </b-form-group>    
                </b-col>
                <b-col cols="3" class="custom-width-phone">
                  <b-form-group
                    id="physical-phone-label"
                    label="Phone"
                    :invalid-feedback="siteAddressPhoneError?'Please enter a valid phone number.':''"
                    :state="!siteAddressPhoneError"
                  >
                    <vue-tel-input class="p-0 bg" :preferredCountries="['us', 'ca']" :placeholder="'(      )  '" @onInput="onInputSiteAddressPhone" v-model="sitePhysicalAddress.phoneNumber" v-bind:class="{'input': true, 'is-invalid': siteAddressPhoneError}"></vue-tel-input>
                  </b-form-group>    
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12" class="pt-0">
                  <div class="form-group mb-0">
                    <label class="col-form-label d-block pt-0">Hours of operation</label>
                    <b-row>
                      <b-col cols="4" class="p-0">
                        <div class="btn-group week-days" role="group">
                          <button
                            v-for="(day, index) in weekDays"
                            :value="day.value"
                            :key="index"
                            type="button"
                            class="btn btn-outline-dark btn-sm"
                            :class="siteOperationDays.includes(day.value)?'active':''"
                            @click="addEditOperationDays(day.value)"
                          >{{day.text}}</button>
                        </div>
                      </b-col>
                      <b-col cols="8" class="p-0">
                        <div class="form-group mb-0">
                          <label>START</label>
                          <vueTimepicker
                            format="hh:mm A"
                            :minute-interval="10"
                            v-model="siteOperationStartTime"
                            class="ml-5" 
                            name="ohStartTime"
                          ></vueTimepicker>
                          <label class="ml-20 mr-5">END</label>
                          <vueTimepicker
                            format="hh:mm A"
                            :minute-interval="10"
                            v-model="siteOperationEndTime"
                            name="ohEndTime"
                          ></vueTimepicker>
                          
                        </div>
                      </b-col>
                    </b-row>
                    <b-row v-if="!validateSiteOperationHours"><b-col cols="12" class="p-0 mt-0 invalid-feedback d-block">Please specify valid hours of operation</b-col></b-row>               
                  </div>
                </b-col>
              </b-row>
            </div>
            
            <b-row>
                <b-col cols="4" class="required-disclaimer"><span class="fa fa-asterisk" aria-hidden="true"></span>&nbsp;&nbsp;indicates a required field</b-col>
                <b-col class="pull-right" cols="8">
                    <b-btn variant="success" class="pull-right create-btn fs-14" @click="updateSiteDetails()">Update</b-btn>
                </b-col>
            </b-row>         
            <div class="modal-style">
            </div>
        </b-modal>
        <!-- Site Activation/Deactivation Modal Component -->
        <b-modal id="activateSiteModal" ref="activateSiteModal" @hidden="onCloseActivateModal" hide-footer hide-header>
            <b-row class="pt-20 pb-10 border-style text-center">
                <b-col class="fs-16" cols="12" v-if="status === 'Active'">
                    <b>Activating this requires you to have received all the proper approvals from, but not limited to, your IRB or EC. This will give your PI the ability to start inviting participants.</b><br><br>
                    <b>Are you ready to activate this site?</b>
                </b-col>
                <b-col class="fs-16" cols="12" v-if="status === 'Inactive'">
                    <b>Are you sure you want to deactiviate this site? Site team members will no longer be able to access this study.</b><br><br>
                </b-col>
                <b-col offset="2" cols="8" class="pt-30">
                    <b-btn variant="primary" class="btn-block fs-14 br-25 bg-4c8ce4" @click="statusUpdateSite()">
                        Yes
                    </b-btn>
                </b-col>
                <b-col offset="2" cols="8" class="pt-10">
                    <b-btn variant="primary" class="btn-block fs-14 br-25 bg-4c8ce4" @click="onCloseActivateModal()">
                        No
                    </b-btn>
                </b-col>
            </b-row>
            <div class="modal-style">
            </div>
        </b-modal>
        <!-- Add Team Member Modal Component -->
        <addMemberModal ref="addMemDetailsModal" :siteId='siteID' :studyId='studyId' modalType='add' :activePI='activePI' :memberDetails='selectedMember' title="Add site member" @added="memberAdded"/>
        <!-- Edit Team Member Modal Component -->
        <addMemberModal ref="editMemDetailsModal" :siteId='siteID' :studyId='studyId' modalType='edit' :activePI='activePI' :memberDetails='selectedMember' title="Edit site member details" @updated="memberUpdated"/>
        <!-- Send Invitation Modal Component -->
        <b-modal id="invitationModal" size="lg" ref="invitationModal" @hidden="onCloseInvitationModal" hide-footer hide-header>
            <b-row class="pt-20 pb-10 border-style text-center">
                <b-col class="fs-16" cols="12">
                    <b>Do you want to resend invitation to {{selectedMember.firstName}} {{selectedMember.lastName}}?</b>
                </b-col>
                <b-col offset="3" cols="6" class="pt-30">
                    <b-btn variant="primary" class="btn-block fs-14 br-25 bg-4c8ce4" @click="sendInvitation()">
                        Yes
                    </b-btn>
                </b-col>
                <b-col offset="3" cols="6" class="pt-20" @click="onCloseInvitationModal()">
                    <b-btn class="btn-block fs-14 br-25 cancel-bg">
                        No
                    </b-btn>
                </b-col>
            </b-row>
            <div class="modal-style">
            </div>
        </b-modal>
    </b-container>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import flattenDeep from 'lodash/flattenDeep';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import _ from 'lodash'
import { SYSTEM_ADMIN, STUDY_ADMIN, PI } from '@/constants/authRoles';
import addMemberModal from '@/components/research-team/add-team-members';
import { mapGetters } from 'vuex';
import { AclRule } from 'vue-acl';
import toastr from "toastr";
import vueTimepicker from "vue2-timepicker";

const dict = {
  custom: {
    physicalSiteAddress: {
      required: 'Site address is required'
    },
    physicalSiteCity: {
      required: 'Site city is required',
      alpha_spaces: 'Site city may only contain alphabetic characters as well as spaces.'
    },
    physicalSiteZip: {
      required: 'Site zip/postal code is required',
      alpha_num: 'Site zip/postal code may only contain alpha-numeric characters.'
    },
    physicalSiteState: {
      required: 'Site state/province is required',
      alpha_spaces: 'Site state/province may only contain alphabetic characters as well as spaces.'
    },
    physicalSiteCountry: {
      required: 'Site address country is required',
      alpha_spaces: 'Site address country may only contain alphabetic characters as well as spaces.'
    },
    virtualSiteCity: {
      alpha_spaces: 'Site city may only contain alphabetic characters as well as spaces.'
    },
    virtualSiteState: {
      alpha_spaces: 'Site state/province may only contain alphabetic characters as well as spaces.'
    },
    virtualSiteCountry: {
      alpha_spaces: 'Site address country may only contain alphabetic characters as well as spaces.'
    },
  }
};

export default {
  name: 'research-site',
  data() {
    return {
      studyId: this.$route.params.studyId,
      siteID: this.$route.params.siteId,
      statusFilters: [{ text: 'Pending', value: 'Pending', disabled: true },
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' }],
      siteTypes: [{ text: 'Select', value: null, disabled: true },
        { text: 'Virtual', value: 'Virtual' },
        { text: 'Physical', value: 'Physical' }],
      siteDetails: {},
      selectedMember: {},
      details: {},
      status: '',
      activePI: false,
      countriesSelected: [],
      actualCountriesObj: [],
      primaryRegion: [],
      filterCountriesOptions: [],
      actualOptions: [],
      primaryCountryOptions: [],
      isEditMode: false,
      oldValuePrimary: null,
      primaryCountryType: null,
      sitePhysicalAddress: {
        'address': '',
        'city': '',
        'zipcode': '',
        'state': '',
        'country': '',
        'phoneNumber': '',
      },
      siteVirtualAddress: {
        'city': '',
        'state': '',
        'country': '',
        'isAllowOtherRegionParticipant': false
      },
      siteAddressPhoneError: false,
      weekDays: [
        { value: "1", text: "S" },
        { value: "2", text: "M" },
        { value: "3", text: "T" },
        { value: "4", text: "W" },
        { value: "5", text: "T" },
        { value: "6", text: "F" },
        { value: "7", text: "S" }
      ],
      siteOperationDays: [],
      siteOperationStartTime: {
        hh: "",
        mm: "",
        A: ""
      },
      siteOperationEndTime: {
        hh: "",
        mm: "",
        A: ""
      },
    };
  },
  components: {
    addMemberModal,
    vueTimepicker
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
    cloneCountries: function(){
       return JSON.parse(JSON.stringify(this.primaryRegion))
    },
    validateSiteOperationHours(){
      let sod = this.siteOperationDays.length;
      let isValid = false;
      if (
        sod == 0 &&
        this.siteOperationStartTime.hh === "" &&
        this.siteOperationStartTime.mm === "" &&
        this.siteOperationStartTime.A === "" &&
        this.siteOperationEndTime.hh === "" &&
        this.siteOperationEndTime.mm === "" &&
        this.siteOperationEndTime.A === ""
      ) {
        isValid = true;
      }
      else if (
        sod > 0 &&
        this.siteOperationStartTime.hh !== "" &&
        this.siteOperationStartTime.mm !== "" &&
        this.siteOperationStartTime.A !== "" &&
        this.siteOperationEndTime.hh !== "" &&
        this.siteOperationEndTime.mm !== "" &&
        this.siteOperationEndTime.A !== ""
      ) {
        isValid = true;
      }else{
        isValid = false;
      }
       return isValid;
    }
  },
  mounted() {
    this.$validator.localize('en', dict);
    this.getStudyDetails();
  },
  methods: {
    sortCountries(countries) {
      countries.map((c, index) => {
        if(c.text == "US") {
          countries.splice(0, 0, c);
          countries.splice(index + 1, 1);
        }
      });
      return countries;
    },
    getCountryType(countryId){
      return _.result(_.find(this.actualCountriesObj, function(c) {
        return c.countryId === countryId;
      }),'countryType');
    },
    getCountryGroupId(countryId){
      return _.result(_.find(this.actualCountriesObj, function(c) {
        return c.countryId === countryId;
      }),
      'countryGroupId');
    },
    selectPrimary (event) {
      if(event && event.target && event.target.value) {
        if(_.includes(_.map(this.countriesSelected, 'value'), event.target.value)) {
          toastr.error("This country has already been selected");
          this.$nextTick(function () {
            // DOM updated
            this.primaryRegion.value = this.oldValuePrimary;
          });
          return;
        }
      }
      this.filterCountriesOptions = [];
      this.countriesSelected = [];
      this.oldValuePrimary = event.target.value;
    },
    selectCountry(element, index) {
      if(element.target.value == this.primaryRegion.value) {
        toastr.error("This country has already been selected");
        this.$nextTick(function () {
            // DOM updated
            this.countriesSelected[index].value = this.countriesSelected[index].previousValue;
          });
        return;
      }
      let primaryCountryGroupId = this.getCountryGroupId(this.primaryRegion.value);
      this.primaryCountryType = this.getCountryType(this.primaryRegion.value);
      let additionalCountryType = this.getCountryType(element.target.value);
      //CHECK THE data sovereignty/privacy/storage restriction
      if(this.getCountryGroupId(element.target.value) != primaryCountryGroupId) {
        //CHECK THE DATA RESTRICTION (Only type 2 and 3 has data restriction)
        let additionalCountryType = this.getCountryType(element.target.value);
        
        if((this.primaryCountryType == 2 || this.primaryCountryType == 3) && additionalCountryType!=this.primaryCountryType ){
          toastr.error("This country follows different data storage and/or privacy rules than the one that has already been selected. Please create a separate site for this country.");
           this.$nextTick(function () {
            // DOM updated
            this.countriesSelected[index].value = this.countriesSelected[index].previousValue;
          });
          return;       
        }
        else {
          toastr.error("This country has data storage and/or privacy restrictions. Please create a separate site for this country.");
          this.$nextTick(function () {
            // DOM updated
            this.countriesSelected[index].value = this.countriesSelected[index].previousValue;
          });
          return;
        }
      }
      let self = this;
      this.countriesSelected[index].value = element.target.value;
      this.countriesSelected[index].previousValue = element.target.value;
      this.countriesSelected.filter((country, idx) => {
        this.filterCountriesOptions[idx] = this.primaryCountryOptions.filter(function (e, i) {
          return e.value != self.primaryRegion.value
        });
      });
      for(let i=0; i<this.countriesSelected.length; i++) {
        for(let k=0; k<this.filterCountriesOptions.length; k++) {
          if(i!=k) {
            for(let j=0; j < this.filterCountriesOptions[k].length; j++) {
              if(this.filterCountriesOptions[k][j].value == this.countriesSelected[i].value)
              this.filterCountriesOptions[k].splice(j, 1);
            }
          }
        }
      }
    },
    setOptions(value, options, index) {
      let ids = _.map(this.countriesSelected, 'value');
      for(let i = 0; i < options.length; i++) {
        const newRow = _.cloneDeep(options[i]);
        for(let k = 0; k < newRow.length; k++) {
          if(index != i && value == newRow[k].value) {
            newRow.splice(k, 1);
          }
        }
        this.$set(options, i, newRow)
      }
    },
    fetchGroupID(gID, cID) {
      let countries = this.actualCountriesObj.filter(c => {
        //Filter the countries that belongs to the primary country group
        return c.countryGroupId === gID; // Country id condition removed because we are displaying the primary country itself in the additional drop downs
      });
      let filterOptions = this.processCountries(countries);
      this.actualOptions = JSON.parse(JSON.stringify(filterOptions));
      this.filterCountriesOptions.length = filterOptions.length;
      for(let i = 0; i < this.filterCountriesOptions.length; i++) {
        this.filterCountriesOptions[i] = filterOptions;
      }
      if((this.filterCountriesOptions.length == 0) || (this.filterCountriesOptions.length < this.countriesSelected.length)) {
        this.countriesSelected.length = 0;
      }
      if(!this.isEditMode) {
        this.countriesSelected.length = 0;
        return;
      }
      this.isEditMode = false;
      for(let i = 0; i < this.countriesSelected.length; i++) {
        this.setOptions(this.countriesSelected[i].value, this.filterCountriesOptions, i);
      }
    },
    removeCountry(evt, index) {
      let self = this;
      evt.preventDefault();
      this.countriesSelected.splice(index, 1);
      this.countriesSelected.filter((country, idx) => {
        this.filterCountriesOptions[idx] = this.primaryCountryOptions.filter(function (e, i) {
          return e.value != self.primaryRegion.value
        });
      });
      // FILTER OUT COUNTRIES THOSE ARE SELECTED
      for(let i=0; i<this.countriesSelected.length; i++) {
        for(let k=0; k<this.filterCountriesOptions.length; k++) {
          if(i!=k) {
            for(let j=0; j < this.filterCountriesOptions[k].length; j++) {
              if(this.filterCountriesOptions[k][j].value == this.countriesSelected[i].value)
              this.filterCountriesOptions[k].splice(j, 1);
            }
          }
        }
      }
    },
    addCountry(evt) {
      evt.preventDefault();
      let ifNUllEntryExists = this.countriesSelected.filter(c=> {
        return c.value == null;
      })
      if(ifNUllEntryExists.length != 0) {
        toastr.error("Please select additional country.");
        return;
      }
      let self = this;
      this.countriesSelected.push({text: null, value: null, previousValue: null});
      this.countriesSelected.filter((country, idx) => {
        this.filterCountriesOptions[idx] = this.primaryCountryOptions.filter(function (e, i) {
          return e.value != self.primaryRegion.value
        });
      });
      for(let i=0; i<this.countriesSelected.length; i++) {
        for(let k=0; k<this.filterCountriesOptions.length; k++) {
          if(i!=k) {
            for(let j=0; j < this.filterCountriesOptions[k].length; j++) {
              if(this.filterCountriesOptions[k][j].value == this.countriesSelected[i].value)
              this.filterCountriesOptions[k].splice(j, 1);
            }
          }
        }
      }
    },
    processCountries(countries, isPrimary) {
      let listOfCountries = [];
      countries.map((c, index)=> {
        if(isPrimary && index == 0) {
          this.isEditMode = true;
          this.primaryRegion = {value: c.countryId};
          this.oldValuePrimary = c.countryId;
        } else {
          listOfCountries.push({text: c.countryName, value: c.countryId, previousValue:c.countryId});
        }
      });
      return listOfCountries;
    },
    getStudyDetails() {
      let self = this;
      this.$api.getStudyDataFact(this.studyId).then(response => {
        this.actualCountriesObj = response.body.countryList;
        //PRIMARY COUNTRY DROPDOWN OPTIONS
        this.primaryCountryOptions = this.processCountries(this.actualCountriesObj, false);
        this.primaryCountryOptions = this.sortCountries(this.primaryCountryOptions);
        this.getSiteDetails();
      }, error => {
         toastr.error("Error occurred while fetching countries.");
      });
    },
    async getSiteDetails() {
      let self = this;
      await this.$api.getSiteDetailsFact(this.studyId, this.siteID).then(
        response => {
          this.siteDetails = response.body;
          let list = this.siteDetails.countryList;
          //Already selected countries that is used to prepare drop-down
          this.countriesSelected = this.processCountries(list, true);
          // PREPARE ADDITIONAL COUNTRY DROPDOWN OPTIONS (SELECTED COUNTRIES WILL NOT BE SHOWN IN ADDITIONAL OPTIONS)
          // FILTER OUT ONLY PRIMARY REGION
          this.countriesSelected.filter((country, idx) => {
            this.filterCountriesOptions[idx] = this.primaryCountryOptions.filter(function (e, i) {
              return e.value != self.primaryRegion.value
            });
          });
          // FILTER OUT COUNTRIES THOSE ARE SELECTED
          for(let i=0; i<this.countriesSelected.length; i++) {
            for(let k=0; k<this.filterCountriesOptions.length; k++) {
              if(i!=k) {
                for(let j=0; j < this.filterCountriesOptions[k].length; j++) {
                  if(this.filterCountriesOptions[k][j].value == this.countriesSelected[i].value)
                  this.filterCountriesOptions[k].splice(j, 1);
                }
              }
            }
          }
          this.status = this.siteDetails.status;
          this.getTeamMembers();
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the site details.',
          );
        });
    },

    getTeamMembers() {
      this.$api.getSiteTeamFact(this.studyId, this.siteID).then(
        response => {
          this.siteDetails.siteTeam = [];
          let team = response.body;
          team.forEach((member, index) => {
            if (member.userRole === 'Pi' && member.status === 'Active') {
              this.siteDetails.siteTeam.push(member);
              team.splice(index, 1);
            }
          });
          team = sortBy(team, 'firstName');
          this.siteDetails.siteTeam.push(team);
          this.siteDetails.siteTeam = flattenDeep(this.siteDetails.siteTeam);
          this.$forceUpdate();
          const pis = filter(this.siteDetails.siteTeam, o => o.userRole === 'Pi' && (o.status === 'Active' || o.status === 'Pending'));
          if (pis.length > 0) {
            this.activePI = true;
          } else {
            this.activePI = false;
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the site team details.',
          );
        });
    },
    viewSiteDocument() {
      this.$router.push({
        name: "add-research-site-documents",
        params: { siteId: this.siteID }
      });
    },

    openModal(name, index) {
      if (name === 'addMember') {
        this.selectedMember = {};
        this.$refs.addMemDetailsModal.show();
      }
      if (name === 'editMember') {
        this.selectedMember = this.siteDetails.siteTeam[index];        
        this.$refs.editMemDetailsModal.show();
      }
    },
    async editSiteDetails() {
      this.details = {};
      await this.getSiteDetails();
      //setTimeout(()=>{
        
        this.details = cloneDeep(this.siteDetails);
    
        this.setAddressFields();// Set database values to fields
        this.$validator.reset();//Reset Form Errors 
        this.siteAddressPhoneError= false; //Remove phone error
        
        this.$refs.editSiteDetailsModal.show();
      //}, 300)
    },
    onCloseEditModal() {
      this.$refs.editSiteDetailsModal.hide();
    },
    onCloseActivateModal() {
      this.status = this.siteDetails.status;
      this.$refs.activateSiteModal.hide();
    },
    processCountriesForSites() {
      let countryList = [];
      this.actualCountriesObj.forEach((c, index) => {
        this.countriesSelected.forEach((item, i) => {
          if(c.countryId == item.value) {
            countryList.push(this.actualCountriesObj[index]);
          }
        });
        if(c.countryId == this.primaryRegion.value) {
          countryList.push(c);
        }
      });
      return countryList;
    },
    updateSiteDetails() {
      // check for null values
      let nullyC = this.countriesSelected.filter(c => {
        return c.value == null;
      });
      if(nullyC.length > 0) {
        toastr.error("Please select country.");
          return
      }
      
      if(this.details.type.toLowerCase()=="physical" && (this.siteAddressPhoneError || !this.validateSiteOperationHours)){
        return;
      }
      
      let data = {
        name: this.details.name,
        userSiteId: this.details.userSiteId,
        type: this.details.type,
        countryList: this.processCountriesForSites()  
      };
      
      if(this.details.type.toLowerCase()=="physical"){
        data = {...data, ...this.sitePhysicalAddress, 
        operationHours: this.siteOperationDays.join(',') + ' - ' + this.getTimeString(this.siteOperationStartTime) + ' - ' + this.getTimeString(this.siteOperationEndTime)}
      }else{
        data = {...data, ...this.siteVirtualAddress};
      }

      this.$validator.validateAll().then(result => {
        if (result) {
          this.$api.updateSiteDetailsFact(this.studyId, this.siteID, data).then(
            response => {
              const detailsResponse = response.body;
              this.siteDetails.name = detailsResponse.name;
              this.siteDetails.userSiteId = detailsResponse.userSiteId;
              this.siteDetails.type = detailsResponse.type;
              this.$toastr.success('Site details updated succesfully');
              this.$refs.editSiteDetailsModal.hide();
              this.resetAddressDataProperties();
            },
            error => {
              this.$toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while getting the site details.',
              );
            });
        }
      });
    },

    updateStatus() {
      this.$refs.activateSiteModal.show();
    },
    statusUpdateSite() {
      const data = {
        status: this.status,
      };
      this.$api.updateSiteStatusFact(this.studyId, this.siteID, data).then(
        response => {
          
          this.siteDetails.status = this.status;
          if (this.status === 'Active') {
            this.$toastr.success('Site activated succesfully');
          }
          if (this.status === 'Inactive') {
            this.$toastr.success('Site deactivated succesfully');
          }
          this.$refs.activateSiteModal.hide();
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the site details.',
          );
        });
    },
    onCloseInvitationModal() {
      this.$refs.invitationModal.hide();
    },
    currentSiteMem(index) {
      this.selectedMember = this.siteDetails.siteTeam[index];
    },
    sendInvitation() {
      this.$api.sendInviteTeamMemberFact(this.studyId,
        this.siteID, this.selectedMember.id, null).then(
        response => {
          
          this.$toastr.success('Team member invitation sent succesfully');
          this.$refs.invitationModal.hide();
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the site details.',
          );
        });
    },
    memberAdded() {
      this.selectedMember = {};
      this.$toastr.success('Team member added succesfully');
      this.getTeamMembers();
    },
    memberUpdated() {
      this.selectedMember = {};
      this.getTeamMembers();
    },
    additionCountryOptions(primaryCountry){
      let self = this;
      return this.primaryCountryOptions.filter(c => {
          return c.value !== primaryCountry && (!_.includes(_.map(self.countriesSelected, 'value'), c.value));
      });
    },
    onInputSiteAddressPhone({ number, isValid, country }) {
      if (!isValid && number.length>0) {
        this.siteAddressPhoneError = true;
      } else {
        this.siteAddressPhoneError = false;
      }
    },
    addEditOperationDays(day) {
      let findDayIndex = _.findIndex(this.siteOperationDays, function(d) {
        return d == day;
      });

      if (findDayIndex == -1) {
        this.siteOperationDays.push(day);
      } else {
        this.$delete(this.siteOperationDays, findDayIndex);
      }
    },
    getTimeString(timeObj){
      return `${timeObj.hh}:${timeObj.mm} ${timeObj.A}`;
    },
    setAddressFields(){
      if(this.details.type.toLowerCase()=='physical'){
        let physicalAddressKeys = _.keys(this.sitePhysicalAddress);
        physicalAddressKeys.forEach((field, index) => {
          this.sitePhysicalAddress[field] = this.details[field]?this.details[field]:'';      
        });
        
        if(this.details.operationHours && this.details.operationHours.length>0){
          let splitOh = this.details.operationHours.split(' - ');
          this.siteOperationDays = splitOh[0].length > 0 ? splitOh[0].split(',') : [];
          this.siteOperationStartTime = this.getTimeObject(splitOh[1]);
          this.siteOperationEndTime = this.getTimeObject(splitOh[2]);
        }
      }else{
        let virtualAddressKeys = _.keys(this.siteVirtualAddress);
        virtualAddressKeys.forEach((field, index) => {
          this.siteVirtualAddress[field] = this.details[field]?this.details[field]:'';      
        });
      }     
    },
    getTimeObject(timeString){
      let str1 = timeString.split(' ');
      let timeStr = str1[0].split(':');
      return { hh: timeStr[0], mm: timeStr[1], A: str1[1] };
    },
    resetAddressDataProperties(){
      this.sitePhysicalAddress = {
        'address': '',
        'city': '',
        'zipcode': '',
        'state': '',
        'country': '',
        'phoneNumber': '',
      };
      this.siteVirtualAddress = {
        'city': '',
        'state': '',
        'country': '',
        'isAllowOtherRegionParticipant': false
      };
      this.siteAddressPhoneError = false;
      
      this.siteOperationDays = [];
      this.siteOperationStartTime = {
        hh: "",
        mm: "",
        A: ""
      };
      this.siteOperationEndTime = {
        hh: "",
        mm: "",
        A: ""
      };
    }
  },
};
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">
@import '~@/assets/variables.scss';
.custom-select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-position: right 50% !important;
  background-repeat: no-repeat;
  background-image: url(/static/img/arrow-down.png);
  padding: .5em;
}
.component {
  background-color: $color_content_background;
  .fa-asterisk {
    color: #ff3e49;
    font-size: 9px;
  }
}
.link-color {
  color: #f16559;
  font-weight: 300;
}
.custom-select {
  height: auto !important;
  border-radius: 3px;
  border: solid 1px #d3dfe4;
}

.modal-custom-select {
  height: 36px !important;
}

.icon-color {
  color: #d3dfe4;
}

.delete-icon {
  color: #666669;
}

.br-1 {
  border-right: 1px solid #d3dfe4;
}

.header-text {
  color: #666669 !important;
  opacity: 0.5;
}

.profile-img-size {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.width-180 {
  width: 180px !important;    
}

.width-100 {
  width: 100px !important;    
}

.text-body{
  color: #666669;
}

.bg-4c8ce4 {
  background-color: #4c8ce4 !important;
  border: #4c8ce4 !important;
}

.edit-btn {
  background-color: #ffffff !important;
  border-radius: 3px;
  border: solid 1px #d3dfe4 !important;
  color: #4c8ce4 !important;
}

.width-120 {
  width: 120px !important; 
}

.site-card {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 0px;
}

.create-btn {
  border-radius: 100px;
  border: none;
  width: 120px;
  height: 35px;
}

.modal-delete {
  border-radius: 3px;
  background-color: #d3dfe4;
  width: 35px;
  height: 35px;
  text-align: center;
}

.error-bg {
  background-color: #f16559;
  border: #f16559
}

.cancel-bg {
  background-color: #d3dfe4;
  border: #d3dfe4;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

/deep/ .modal-header {
  border-bottom: none !important;
  padding-left: 30px !important;
}

/deep/ .modal-title {
  font-weight: bold !important;
}

</style>
<style lang="scss">
@media (min-width: 992px) { 
  #editSiteDetailsModal{
    .col-3{
      &.custom-width{
        max-width: 20% !important;
        padding-right: 0;
      }
      &.custom-width-country{
        max-width: 21% !important;
        padding-right: 0;
      }
      &.custom-width-phone{
        flex: 0 0 33%;
        max-width: 33%;
        padding-right: 0;
        .vue-tel-input{
          border-color: #d3dfe4;
          .dropdown{
            padding: 8px;
          }
        }
      }
    }
  }
    
}
#editSiteDetailsModal{
  .site-address-elements {
    margin-top: 20px;
    margin-bottom: 20px;
    .form-group {
      .form-control{
        &.is-valid{
          border-color: #d3dfe4;
          background-image: none;
          &:focus{
            border-color: #d3dfe4;
            box-shadow: inherit;
          }
        }
      }
      label, label.col-form-label, legend.col-form-label {
        color: #666669;
        opacity: 0.5;
        padding-bottom: inherit;
        padding-top: 0;
        margin-bottom:0;
      }
    
      .vue-tel-input, select.custom-select{
        &.is-invalid{
          border-color: #dc3545;

        }  
      }

      .time-picker {
        width: 6em;
        .clear-btn{
          right: -8px;
        }
        input {
          &.display-time{
            border: 1px solid #d3dfe4;
            height: 33px !important;
            width: 6em;
          }
        }
      }

      select.custom-select {
        padding: 0.375rem 1.75rem 0.375rem 0.75rem;
        &.is-valid{
          background-image: url("/static/img/arrow-down.png") no-repeat;
          background: url("/static/img/arrow-down.png") no-repeat;
        }
      }
    }
    .week-days {
      button {
        padding: 4px 10px;
      }
      .btn-outline-dark {
        border-color: #e4e8eb;
      }

      .btn-outline-dark:hover,
      .btn-outline-dark:not(:disabled):not(.disabled):active,
      .show > .btn-outline-dark.dropdown-toggle {
        color: inherit;
        background: #e4e8eb;
        border-color: #e4e8eb;
      }
      .btn-outline-dark.active {
        border-color: #ffffff;
      }
      .btn-outline-dark:not(:disabled):not(.disabled):active:focus,
      .btn-outline-dark:not(:disabled):not(.disabled).active:focus,
      .show > .btn-outline-dark.dropdown-toggle:focus,
      .btn-outline-dark:focus {
        box-shadow: none;
      }
      .btn-outline-dark:not(:disabled):not(.disabled).active {
        background-color: #1e8fe1;
        border-color: #1e8fe1;
        color: #fff;
      }
    }
  }
  #allowPartFromAnyRegion{
    vertical-align: middle;
    margin-right: 6px;
  }
  .required-disclaimer{
    font-family: Lato-Semibold;
    font-size: 10px;
    padding-top: 12px;
    color: #4a4a4a;
    .fa-asterisk{
      font-size:6px;
      vertical-align: 1px;
    }  
  }
}
</style>