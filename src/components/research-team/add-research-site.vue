<template>
  <div class="component">
    <b-container fluid class="pb-30 pt-30">
      <b-row>
        <b-col cols="10">
          <b-row class="fs-20">
            <b>New Site</b>
          </b-row>
          <b-form @submit.prevent="validateBeforeSubmit">
            <!-- Institution -->
            <b-row class="form-card mt-15">
              <b-col cols="12" class="sec_text fs-16 pb-10">
                <b>Institution</b>
              </b-col>
              <b-col cols="6">
                <span class="header-text">Site Name</span>
                <b-form-input
                  type="text"
                  class="required"
                  v-model="newSite.name"
                  placeholder="Enter name"
                  name="siteName"
                  v-validate="'required'"
                  v-bind:class="{'input': true, 'is-danger': errors.has('siteName')}"
                ></b-form-input>
                <span v-if="errors.has('siteName')" class="error-style">Site name is required.</span>
              </b-col>
              <b-col cols="3">
                <span class="header-text">Site ID</span>
                <b-form-input
                  type="text"
                  class="required"
                  v-model="newSite.userSiteId"
                  placeholder="Enter ID"
                  name="userSiteId"
                  v-validate="'required'"
                  v-bind:class="{'input': true, 'is-danger': errors.has('userSiteId')}"
                ></b-form-input>
                <span v-if="errors.has('userSiteId')" class="error-style">Site ID is required.</span>
              </b-col>
              <b-col cols="3">
                <span class="header-text">Site Type</span>
                <b-form-select
                  :options="siteTypes"
                  class="select-arrow"
                  v-validate="'required'"
                  v-model="newSite.type"
                  name="type"
                  v-bind:class="{'input': true, 'is-danger': errors.has('type')}"
                ></b-form-select>
                <span v-if="errors.has('type')" class="error-style">Site type is required.</span>
              </b-col>
              <b-col cols="3 pt-15">
                <span class="header-text">Site country <span v-b-popover.hover.html="'The <strong>site country</strong> is the country participants will be associated with when enrolled. If the site is associated to multiple countries, they can be added by clicking “Add another country.” When multiple countries are added, participants will choose which country to associate themselves with during enrollment.'" class="fa fa-info-circle ml-7"></span></span>
                <b-form-select @change.native="selectPrimary($event)" v-validate="'required'" :options="primaryCountryOptions" class="select-arrow" v-model="newSite.primaryCountry"
                name="country"></b-form-select>
              </b-col>
              <b-col
                cols="3 pt-15"
                v-show="filterCountriesOptions.length > 0"
                v-for="(item, index) in newSite.countryList"
                :key="index"
              >
                <span class="header-text">Additional Country</span>
                <b-form-select
                  @change.native="selectCountry($event, index)"
                  :options="filterCountriesOptions[index]"
                  class="select-arrow2"
                  v-model="item.id"
                  name="country"
                ></b-form-select>
              </b-col>
              <b-col cols="1" :class="{'mt-43' : newSite.countryList.length < 3, 'mt-44' : newSite.countryList.length > 3, 'mt-16' : newSite.countryList.length==3 }" v-if="newSite.countryList.length >= 1"><b-link @click="removeCountry()" class="link-color pt-10"><b>Remove</b></b-link></b-col>
              
              <b-col v-if="newSite.type && newSite.type.toLowerCase()=='virtual'" cols="4" :class="{'mt-43' : newSite.countryList.length < 2, 'mt-16' : newSite.countryList.length>=2 }" class="pr-0" >
                <label for="allowPartFromAnyRegion" class="fw-normal">
                <input type="checkbox" name="allowPartFromAnyRegion" id="allowPartFromAnyRegion" class="checkbox_position" v-model="siteVirtualAddress.isAllowOtherRegionParticipant" />
                <span><strong>Allow participants from any region</strong></span><span v-b-popover.hover.html="'Site available to all participants from any location'" class="fa fa-info-circle ml-7"></span>
              </label>
              </b-col>
              <b-col cols="12 pt-16"><b-link @click="addCountry()" class="pt-10"><b>Add another country</b></b-link></b-col>
              
              <b-col cols="12" class="p-0">
                <!-- VIRTUAL ADDRESS CONTAINER STARTS HERE -->
                <div v-if="newSite.type && newSite.type.toLowerCase()=='virtual'" id="virtual-site-container" class="site-address-elements">
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
                        <b-form-select name="virtualSiteCountry" id="virtualSiteCountry" v-validate="'alpha_spaces'" v-model="siteVirtualAddress.country" key="virtual-country-input" :state="!errors.has('virtualSiteCountry')">
                        <option value=''>Select country</option>
                        <option v-for="(countryObj, indexOpt) in primaryCountryOptions" 
                              :key="indexOpt"
                              :value="countryObj.text"
                          >{{ countryObj.text }}</option>
                        </b-form-select>
                      </b-form-group>    
                    </b-col>
                  </b-row>
                </div>
                <!-- VIRTUAL ADDRESS CONTAINER ENDS HERE -->
                <!-- PHYSICAL ADDRESS CONTAINER STARTS HERE -->
                <div v-else-if="newSite.type && newSite.type.toLowerCase()=='physical'" id="physical-site-container" class="site-address-elements">
                  <b-row>
                    <b-col cols="8">
                      <b-form-group
                        id="physical-address-label"
                        label="Address"
                        label-for="physicalSiteAddress"
                        :invalid-feedback="errors.first('physicalSiteAddress')"
                        :state="!errors.has('physicalSiteAddress')"
                      >
                        <b-form-input type="text" placeholder="Address" v-validate="'required'" id="physicalSiteAddress" name="physicalSiteAddress" v-model="sitePhysicalAddress.address" :state="!errors.has('physicalSiteAddress')" class="required" key="physical-address-input">
                        </b-form-input>
                      </b-form-group>    
                    </b-col>
                    <b-col cols="4" class="pl-0">
                      <b-form-group
                        id="physical-city-label"
                        label="City"
                        label-for="physicalSiteCity"
                        :invalid-feedback="errors.first('physicalSiteCity')"
                        :state="!errors.has('physicalSiteCity')"
                      >
                        <b-form-input type="text" placeholder="City" v-validate="'required|alpha_spaces'" id="physicalSiteCity" name="physicalSiteCity" v-model="sitePhysicalAddress.city" :state="!errors.has('physicalSiteCity')" class="required" key="physical-city-input">
                        </b-form-input>
                      </b-form-group>    
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="3" class="custom-width">
                      <b-form-group
                        id="physical-zip-label"
                        label="Zip / Postal code"
                        label-for="physicalSiteZip"
                        :invalid-feedback="errors.first('physicalSiteZip')"
                        :state="!errors.has('physicalSiteZip')"
                      >
                        <b-form-input type="text" placeholder="Zip / Postal code" v-validate="'required|alpha_num'" id="physicalSiteZip" name="physicalSiteZip" v-model="sitePhysicalAddress.zipcode" :state="!errors.has('physicalSiteZip')" class="required" key="physical-zip-input">
                        </b-form-input>
                      </b-form-group>    
                    </b-col>
                    <b-col cols="3" class="custom-width">
                      <b-form-group
                        id="physical-state-label"
                        label="State / Province"
                        label-for="physicalSiteState"
                        :invalid-feedback="errors.first('physicalSiteState')"
                        :state="!errors.has('physicalSiteState')"
                      >
                        <b-form-input type="text" placeholder="State / Province" v-validate="'required|alpha_spaces'" id="physicalSiteState" name="physicalSiteState" v-model="sitePhysicalAddress.state" :state="!errors.has('physicalSiteState')" class="required" key="physical-state-input">
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
                        <label class="col-form-label">Address country <span v-b-popover.hover.html="'The <strong>address country</strong> is the country associated to the physical address of the site.'" class="fa fa-info-circle ml-7"></span></label>
                        <b-form-select class="select-arrow" v-validate="'required|alpha_spaces'" id="physicalSiteCountry" name="physicalSiteCountry" v-model="sitePhysicalAddress.country" :state="!errors.has('physicalSiteCountry')" key="physical-country-input">
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
                        <vue-tel-input class="p-0 bg" :preferredCountries="['us', 'ca']" :placeholder="'(      )  '" @onInput="onInputPhone" v-model="sitePhysicalAddress.phoneNumber" v-bind:class="{'input': true, 'is-invalid': siteAddressPhoneError}"></vue-tel-input>
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
                              ></vueTimepicker>
                              <label class="ml-20 mr-5">END</label>
                              <vueTimepicker
                                format="hh:mm A"
                                :minute-interval="10"
                                v-model="siteOperationEndTime"
                              ></vueTimepicker>
                            </div>
                          </b-col>
                        </b-row>  
                        <b-row v-if="!validateSiteOperationHours"><b-col cols="12" class="p-0 mt-0 invalid-feedback d-block">Please specify valid hours of operation</b-col></b-row>             
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <!-- PHYSICAL ADDRESS CONTAINER ENDS HERE -->
              </b-col>
            </b-row>

            <!-- Principal Investigator -->
            <b-row class="form-card mt-15">
              <b-col cols="12" class="sec_text fs-16 pb-10">
                <b>Principal Investigator</b>
              </b-col>
              <b-col cols="3">
                <span class="header-text">First name</span>
                <b-form-input
                  type="text"
                  class="required"
                  v-model="newSite.sitePI.firstName"
                  placeholder="Enter name"
                  v-validate="{ required: true, regex: /^[A-Za-z- ]+$/ }"
                  name="firstName"
                  v-bind:class="{'input': true, 'is-danger': errors.has('firstName')}"
                ></b-form-input>
                <span v-if="errors.has('firstName')" class="error-style">
                   <span
                    v-if="errors.first('firstName') == 'The firstName field is required.'"
                  >First name is required</span>
                   <span
                    v-if="errors.first('firstName') == 'The firstName field format is invalid.'"
                  >Alphabetic entries only are allowed</span>
                </span>
              </b-col>
              <b-col cols="3">
                <span class="header-text">Last name</span>
                <b-form-input
                  type="text"
                  class="required"
                  v-model="newSite.sitePI.lastName"
                  placeholder="Enter name"
                  v-validate="{ required: true, regex: /^[A-Za-z- ]+$/ }"
                  name="lastName"
                  v-bind:class="{'input': true, 'is-danger': errors.has('lastName')}"
                ></b-form-input>
                <span v-if="errors.has('lastName')" class="error-style">
                  <span
                    v-if="errors.first('lastName') == 'The lastName field is required.'"
                  >Last name is required</span>
                  <span
                    v-if="errors.first('lastName') == 'The lastName field format is invalid.'"
                  >Alphabetic entries only are allowed</span>
                </span>
              </b-col>
              <b-col cols="3">
                <span class="header-text">Email address</span>
                <b-form-input
                  type="email"
                  class="required"
                  v-model="newSite.sitePI.username"
                  placeholder="Enter email"
                  v-bind:class="{'input': true, 'is-danger': newSite.sitePI.emailError}"
                  @keyup.native="validateEmail(newSite.sitePI)"
                ></b-form-input>
                <span
                  v-if="newSite.sitePI.emailError"
                  class="error-style"
                >{{newSite.sitePI.emailError}}</span>
              </b-col>
              <b-col cols="3">
                <span class="header-text">Phone number</span>
                <span>
                  <vue-tel-input
                    class="p-0 bg"
                    @onInput="onInputPIPhone"
                    v-model="newSite.sitePI.phoneNumber"
                    :preferredCountries="['us', 'ca']"
                    :placeholder="'(      )  '"
                    v-bind:class="{'input': true, 'is-danger': newSite.sitePI.phoneError}"
                  ></vue-tel-input>
                  <span
                    v-if="newSite.sitePI.phoneError"
                    class="error-style"
                  >{{newSite.sitePI.phoneError}}</span>
                </span>
              </b-col>
              <b-col>
                <div class="site-pi-add">
                  <span class="un-bld-Lbl-Txt">Unblinded</span>
                    <label class="switch">
                      <input type="checkbox" v-model="newSite.sitePI.blinded"/>
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
                </div>
              </b-col>
            </b-row>
            <!-- Site Team -->
            <b-row class="form-card mt-15">              
              <b-col cols="12" class="sec_text fs-16 pb-10">
                <b>Site Team</b>                
              </b-col>
              <b-row
                class="mt-15"
                v-if="newSite.siteTeam && newSite.siteTeam.length > 0"
                v-for="(team, index) in newSite.siteTeam"
                :key="team.dynamicInputID"
              >
                <b-col cols="3">
                  <span class="header-text">First name</span>                  
                  <b-form-input
                    type="text"
                    class="bg"
                    v-model="team.firstName"
                    placeholder="Enter name"
                    v-validate="{ regex: /^[A-Za-z- ]+$/ }"
                    :name="`firstname${team.dynamicInputID}`"
                    v-bind:class="{'input': true, 'is-danger': errors.has(`firstname${team.dynamicInputID}`)}"
                  ></b-form-input>
                  <span v-if="errors.has(`firstname${team.dynamicInputID}`)" class="error-style">
                    <span
                      v-if="errors.first(`firstname${team.dynamicInputID}`) == `The firstname${team.dynamicInputID} field format is invalid.`"
                    >Alphabetic entries only are allowed</span>
                  </span>                  
                </b-col>
                <b-col cols="3">
                  <span class="header-text">Last name</span>
                  <b-form-input
                    type="text"
                    class="bg"
                    v-model="team.lastName"
                    placeholder="Enter name"
                    v-validate="{ regex: /^[A-Za-z- ]+$/ }"
                    :name="`lastname${team.dynamicInputID}`"
                    v-bind:class="{'input': true, 'is-danger': errors.has(`lastname${team.dynamicInputID}`)}"
                  ></b-form-input>
                  <span v-if="errors.has(`lastname${team.dynamicInputID}`)" class="error-style">
                    <span
                      v-if="errors.first(`lastname${team.dynamicInputID}`) == `The lastname${team.dynamicInputID} field format is invalid.`"
                    >Alphabetic entries only are allowed</span>
                  </span>
                </b-col>
                <b-col cols="3">
                  <span class="header-text">Email address</span>
                  <b-form-input
                    type="email"
                    class="required"
                    v-model="team.username"
                    placeholder="Enter email"
                    v-bind:class="{'input': true, 'is-danger': team.emailError }"
                    @keyup.native="validateEmail(team)"
                    :name="`username${team.dynamicInputID}`"
                  ></b-form-input>
                  <span v-if="team.emailError" class="error-style">{{team.emailError}}</span>
                </b-col>
                <b-col cols="3">
                  <span class="header-text">Phone number</span>
                  <span>
                    <vue-tel-input
                      class="p-0 bg"
                      v-model="team.phoneNumber"
                      @onInput="onInputPhone"
                      @input="checkIndex(index)"
                      :placeholder="'(      )  '"
                      v-bind:class="{'input': true, 'is-danger': team.phoneError}"
                    ></vue-tel-input>
                    <span v-if="team.phoneError" class="error-style">{{team.phoneError}}</span>
                  </span>
                </b-col>
                <b-col cols="3" class="pt-10">
                  <span class="header-text">Role</span>
                  <b-form-select
                    :options="teamRoles"
                    class="select-arrow"
                    v-validate="'required'"
                    v-model="team.userRole"
                    :name="`userRole${team.dynamicInputID}`"
                    v-bind:class="{'input': true, 'is-danger': errors.has(`userRole${team.dynamicInputID}`)}"
                  ></b-form-select>
                  <span
                    v-if="errors.has(`userRole${team.dynamicInputID}`)"
                    class="error-style"
                  >Role is required.</span>
                </b-col>
                <b-col cols="3" class="pt-25" align-self="center">
                  <span class="site-mem-add">
                    <span class="un-bld-Lbl-Txt">Unblinded</span>
                    <label class="switch">
                      <input type="checkbox" v-model="team.blinded"/>
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
                  </span>
                </b-col>
                <b-col cols="3" class="pt-25" align-self="center"></b-col>
                <b-col cols="3" class="pt-25" align-self="center">
                  <span style="float:right;">
                    <b-link @click="removeTeamMember(index)" class="danger">Remove</b-link>
                  </span>
                </b-col>
                <b-col cols="12">
                  <hr class="my-4" />
                </b-col>
              </b-row>
              <b-link @click="addTeam()" class="pt-10 pl-15">
                <b>Add a Site Team member</b>
              </b-link>
            </b-row>
            <b-row class="pt-50">
              <b-btn
                class="btn br-1 fs-14"
                variant="outline-primary"
                @click="researchSiteLoad()"
              >Cancel</b-btn>
              <b-btn
                class="btn btn-primary create-btn fs-14 ml-10"
                type="submit"
              >Create site and invite investigators</b-btn>
            </b-row>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import findIndex from "lodash/findIndex";
import swal from "sweetalert2";
import toastr from "toastr";
import _ from "lodash";
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
let dynamicInputID = 0;
export default {
  name: 'add-research-site',
  props: ['addSite'],
  components: {
    vueTimepicker
  },
  computed: {
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
  data() {
    return {
      studyId: this.$route.params.studyId,
      siteTypes: [
        { text: "Select", value: null, disabled: true },
        { text: "Virtual", value: "Virtual" },
        { text: "Physical", value: "Physical" }
      ],
      teamRoles: [
        { text: "Select", value: null, disabled: true },
        { text: "Sub-Investigator", value: "SubPi" },
        { text: "Study Coordinator", value: "StudyCoordinator" },
        { text: "Home Health", value: "HomeHealth" },
        { text: "Site - Data Lock", value: "SiteDataLock" }
      ],
      newSite: {
        name: "",
        userSiteId: "",
        type: null,
        sitePI: {
          firstName: "",
          lastName: "",
          username: "",
          phoneNumber: "",
          userRole: "Pi",
          blinded: false,
        },
        siteTeam: [],
        countryList: [],
        primaryCountry: null
      },
      actualCountriesObj: [],
      primaryCountryOptions: [],
      filterCountriesOptions: [],
      selectedIndex: -1,
      phoneNumber: "",
      actualOptions: [],
      oldValuePrimary: null,
      primaryCountryType: null,
      primaryCountryGroupId: null,
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
  mounted() {
    this.$validator.localize('en', dict);
    this.getStudyDetails();
  },
  methods: {
    selectPrimary(event) {
      //PRIMARY COUNTRY TYPE & GROUP ID
      this.primaryCountryGroupId = this.getCountryGroupId(event.target.value);
      this.primaryCountryType = this.getCountryType(event.target.value);
      this.oldValuePrimary = event.target.value;
      //PREPARE ADDITIONAL COUNTRY DROPDOWN OPTIONS (SELECTED COUNTRIES WILL NOT BE SHOWN IN ADDITIONAL OPTIONS)
      let additionalCountryOptions = this.additionCountryOptions(
        event.target.value
      );
      if (additionalCountryOptions.length > 0) {
        this.filterCountriesOptions[0] = additionalCountryOptions;
      }
      //Remove additional drop-downs if any
      this.newSite.countryList = [];
    },
    selectCountry(element, index) {
      //CHECK THE data sovereignty/privacy/storage restriction
      if (
        this.getCountryGroupId(element.target.value) !=
        this.primaryCountryGroupId
      ) {
        //CHECK THE DATA RESTRICTION (Only type 2 and 3 has data restriction)
        let additionalCountryType = this.getCountryType(element.target.value);

        if (
          (this.primaryCountryType == 2 || this.primaryCountryType == 3) &&
          additionalCountryType != this.primaryCountryType
        ) {
          toastr.error(
            "This country follows different data storage and/or privacy rules than the one that has already been selected. Please create a separate site for this country."
          );
        } /* if(this.primaryCountryType==1 && (additionalCountryType == 2 || additionalCountryType == 3)) */ else {
          toastr.error(
            "This country has data storage and/or privacy restrictions. Please create a separate site for this country."
          );
        }
        this.$nextTick(function() {
          // DOM updated
          this.newSite.countryList[index].id = this.newSite.countryList[
            index
          ].previousValue;
        });
        return;
      }
      this.newSite.countryList[index].previousValue = element.target.value;
      //UPDATE THE OTHER ADDITIONAL COUNTRY OPTIONS BY REMOVING THE ALREADY SELECTED COUNTRIES
      for (let i = 0; i < this.filterCountriesOptions.length; i++) {
        const newRow = _.cloneDeep(this.filterCountriesOptions[i]);
        for (let k = 0; k < newRow.length; k++) {
          if (index != i && element.target.value == newRow[k].value) {
            newRow.splice(k, 1);
          }
        }
        this.$set(this.filterCountriesOptions, i, newRow);
      }
    },
    checkForNullIds() {
      for (let i = 0; i < this.newSite.countryList.length; i++) {
        if (this.newSite.countryList[i].id == null) {
          this.newSite.countryList.splice(i, 1);
        }
      }
    },
    additionCountryOptions(primaryCountry) {
      let self = this;
      return this.primaryCountryOptions.filter(c => {
        return (
          c.value !== primaryCountry &&
          !_.includes(_.map(self.newSite.countryList, "id"), c.value)
        );
      });
    },
    processCountries(countries) {
      let listOfCountries = [];
      countries.map(c => {
        listOfCountries.push({ text: c.countryName, value: c.countryId });
      });
      return listOfCountries;
    },
    sortCountries(countries) {
      countries.map((c, index) => {
        if (c && (c.text == "US" || c.text == "United States")) {
          countries.splice(0, 0, c);
          countries.splice(index + 1, 1);
        }
      });
      return countries;
    },
    getStudyDetails() {
      let self = this;
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          this.actualCountriesObj = response.body.countryList;

          //PRIMARY COUNTRY DROPDOWN OPTIONS
          this.primaryCountryOptions = this.processCountries(
            this.actualCountriesObj
          );
          this.primaryCountryOptions = this.sortCountries(
            this.primaryCountryOptions
          );

          //SET THE DEFAULT COUNTRY TO USA IN PRIMARY COUNTRY DROPDOWN
          this.actualCountriesObj.forEach(c => {
            if (c.isoCode3 === "USA") {
              this.newSite.primaryCountry = c.countryId;
              this.oldValuePrimary = c.countryId;
              //PRIMARY COUNTRY TYPE & GROUP ID
              this.primaryCountryGroupId = this.getCountryGroupId(c.countryId);
              this.primaryCountryType = this.getCountryType(c.countryId);
            }
          });

          //PREPARE ADDITIONAL COUNTRY DROPDOWN OPTIONS (SELECTED COUNTRIES WILL NOT BE SHOWN IN ADDITIONAL OPTIONS)
          let additionalCountryOptions = this.additionCountryOptions(
            this.newSite.primaryCountry
          );
          if (additionalCountryOptions.length > 0) {
            this.filterCountriesOptions[0] = additionalCountryOptions;
          }
        },
        error => {
          toastr.error("Error occurred while featching Countries.");
        }
      );
    },
    processCountriesForSites(data) {
      this.actualCountriesObj.forEach((c, index) => {
        data.countryList.forEach((item, i) => {
          if (c.countryId == item.id) {
            data.countryList[i] = this.actualCountriesObj[index];
          }
        });
      });
      return data;
    },
    validateCountries() {
      if (this.newSite.countryList.length == 0) {
        return;
      }
      let nullValues = this.newSite.countryList.filter(c => {
        return c.id == null;
      });
      return nullValues.length > 0;
    },
    validateBeforeSubmit() {
      this.validateEmail(this.newSite.sitePI);
      if (this.newSite.siteTeam && this.newSite.siteTeam.length > 0) {
        this.newSite.siteTeam.forEach(member => {
          this.validateEmail(member);
        });
      }

      if(this.newSite.type && this.newSite.type.toLowerCase()=="physical" && (this.siteAddressPhoneError || !this.validateSiteOperationHours)){
        return;
      }

      this.$validator.validateAll().then(result => {
        if (result) {
          if (
            this.newSite.sitePI.emailError ||
            this.newSite.sitePI.phoneError
          ) {
            this.$toastr.error(
              this.newSite.sitePI.emailError || this.newSite.sitePI.phoneError
            );
          } else if (this.validateSiteTeam()) {
          } else {
            this.newSite.sitePI.phoneNumber = this.newSite.sitePI.phoneNumber.replace(
              /\s/g,
              ""
            );
            if (this.validateCountries()) {
              toastr.error(
                "Please select country from additional dropdown or remove it."
              );
              return;
            }
            let data = JSON.parse(JSON.stringify(this.newSite));
            data.countryList.push({ id: this.newSite.primaryCountry });
            data = this.processCountriesForSites(data);

            //Add Address Details
            if(this.newSite.type.toLowerCase()=="physical"){
              data = {...data, ...this.sitePhysicalAddress, 
              operationHours: this.siteOperationDays.join(',') + ' - ' + this.getTimeString(this.siteOperationStartTime) + ' - ' + this.getTimeString(this.siteOperationEndTime)}
            }else{
              data = {...data, ...this.siteVirtualAddress};
            }

            this.$api.postSiteDetailsFact(this.studyId, data).then(
              response => {
                this.$toastr.success("New Research Site created successfully");
                this.$router.push({ name: "list-research-site" });
              },
              error => {
                if (error.body.message !== "failed") {
                  this.$toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : "Error while creating site"
                  );
                } else {
                  const duplicateEmails = error.body.duplicateTeamMemberEmails;
                  this.$toastr.error(
                    "Email id of site team member already exists"
                  );
                  duplicateEmails.forEach(email => {
                    const duplicateIndex = findIndex(this.newSite.siteTeam, [
                      "username",
                      email
                    ]);
                    this.newSite.siteTeam[duplicateIndex].emailError =
                      "Email already exists.";
                    this.$forceUpdate();
                  });
                }
              }
            );
          }
        }
      });
    },
    validateSiteTeam() {
      if (this.newSite.siteTeam && this.newSite.siteTeam.length > 0) {
        for (let i = 0; i < this.newSite.siteTeam.length; i++) {
          this.newSite.siteTeam[i].phoneNumber = this.newSite.siteTeam[
            i
          ].phoneNumber.replace(/\s/g, "");
          if (
            this.newSite.siteTeam[i].emailError ||
            this.newSite.siteTeam[i].phoneError
          ) {
            this.$toastr.error(
              this.newSite.siteTeam[i].emailError ||
                this.newSite.siteTeam[i].phoneError
            );
            return true;
          }
        }
      } else {
        return false;
      }
    },

    validateEmail(teamMember) {
      const member = teamMember;
      const email = member.username ? member.username.trim() : null;
      const emailPattern = new RegExp(
        "^[_\\+A-Za-z0-9-\\+]+(\\.[_\\+A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
      );
      if (!email) {
        member.emailError = "Email is required";
        this.$forceUpdate();
      } else if (email && !emailPattern.test(email)) {
        member.emailError = "Please enter a valid email address.";
        this.$forceUpdate();
      } else {
        member.emailError = false;
        this.$forceUpdate();
      }
    },

    onInputPIPhone({ number, isValid, country }) {
      this.newSite.sitePI.phoneError = false;
      this.$forceUpdate();
      if (!isValid && number.length > 0) {
        this.newSite.sitePI.phoneError = "Please enter a valid phone number.";
        this.$forceUpdate();
      } else {
        this.newSite.sitePI.phoneError = false;
        this.$forceUpdate();
      }
    },

    onInputPhone({ number, isValid, country }) {
      if(this.newSite.siteTeam[this.selectedIndex]){
        this.newSite.siteTeam[this.selectedIndex].phoneError = false;
      }
      
      this.$forceUpdate();
      if (!isValid && number.length > 0) {
        this.newSite.siteTeam[this.selectedIndex].phoneError =
          "Please enter a valid phone number.";
        this.$forceUpdate();
      } else {
        this.newSite.siteTeam[this.selectedIndex].phoneError = false;
        this.$forceUpdate();
      }
    },

    checkIndex(index) {
      this.selectedIndex = index;
      this.$forceUpdate();
    },

    addTeam() {
      dynamicInputID++;
      const siteMember = {
        firstName: "",
        lastName: "",
        username: "",
        phoneNumber: "",
        userRole: null,
        sequence: this.newSite.siteTeam.length,
        dynamicInputID: dynamicInputID,
        blinded: false,
      };
      this.newSite.siteTeam.push(siteMember);
      window.setTimeout(() => {
      window.$('[data-toggle="popover"]').popover();
    }, 1);
    },
    addCountry() {
      let ifNUllEntryExists = this.newSite.countryList.filter(c => {
        return c.id == null;
      });
      if (ifNUllEntryExists.length != 0) {
        toastr.error("Please select additional country.");
        return;
      }
      this.filterCountriesOptions[
        this.newSite.countryList.length
      ] = this.additionCountryOptions(this.newSite.primaryCountry);
      this.newSite.countryList.push({ id: null, previousValue: null });
    },
    removeCountry() {
      let removedCountry = this.newSite.countryList.pop();

      //GET THE REMOVED COUNTRY OBJECT FROM THE PRIMARY TO PUSH AGAIN IN THE ADDITIONAL COUNTRIES
      removedCountry = _.chain(this.primaryCountryOptions)
        .filter({ value: removedCountry.id })
        .value()[0];
      if (removedCountry) {
        //We have taken filterCountriesOptions length - 1 bcoz the DOM has not yet updated
        for (let i = 0; i < this.filterCountriesOptions.length - 1; i++) {
          this.filterCountriesOptions[i].push(removedCountry);
          this.filterCountriesOptions[i] = _.orderBy(
            this.filterCountriesOptions[i],
            "text"
          );
          //Make US/United States as the first option
          this.filterCountriesOptions[i] = this.sortCountries(
            this.filterCountriesOptions[i]
          );
        }
      }
    },
    removeTeamMember(index) {
      swal({
        title: "Are you sure you want to remove?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Remove"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.newSite.siteTeam.splice(index, 1);
        }
      });
    },
    researchSiteLoad() {
      swal({
        title: "Are you sure you want to cancel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#34537d",
        confirmButtonText: "Cancel",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.$router.push({ name: "list-research-site" });
        }
      });
    },
    getCountryType(countryId) {
      return _.result(
        _.find(this.actualCountriesObj, function(c) {
          return c.countryId === countryId;
        }),
        "countryType"
      );
    },
    getCountryGroupId(countryId){
      return _.result(_.find(this.actualCountriesObj, function(c) {
        return c.countryId === countryId;
      }),
      'countryGroupId');
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/variables.scss";

.link-color {
  color: #f16559;
  font-weight: 300;
}

.component {
  background-color: $color_content_background;
}
.set-color {
  color: lightgrey !important;
}

.form-card {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 0px;
}

.danger {
  color: #f16559;
}
.sec_text {
  color: #666669;
}

::placeholder {
  color: #c5d1d6 !important;
}

.bg {
  background: #f5f8fa !important;
}

.header-text {
  color: #666669 !important;
  opacity: 0.5;
  font-size: 14px;
}

.required {
  background: url("/static/img/required.svg") no-repeat right #f5f8fa !important;
}

.tel-required {
  position: absolute;
  top: 26px;
  right: 15px;
}
.select-arrow2 {
  background: url("/static/img/arrow-down.png") no-repeat bottom 6px right 18px
    #f5f8fa !important;
}

.select-arrow {
  background: url("/static/img/required.svg") no-repeat right,
    url("/static/img/arrow-down.png") no-repeat bottom 6px right 18px #f5f8fa !important;
}

.br-1 {
  border-radius: 100px;
}

.create-btn {
  border-radius: 100px;
  border: none;
  height: 40px;
  background-color: #4c8ce4;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.is-danger {
  border-color: #ff4848 !important;
  border-width: 1px !important;
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
  left: 10px;
  top: 14px;
}
.site-mem-add {
  position: relative;
  bottom: 20px;
  right: 10px;
}
.site-pi-add {
  position: relative;
  bottom: 5px; 
  left: 8px;
  height: 50px;
}
</style>
<style lang="scss">
#allowPartFromAnyRegion{
  vertical-align: middle;
  margin-right: 6px;
}
.site-address-elements {
  margin-top: 20px;
  .form-group {
    .form-control{
      &.is-valid{
        border-color: #d3dfe4;
        &:focus{
          border-color: #d3dfe4;
          box-shadow: inherit;
        }
      }
    }

    label, label.col-form-label, legend.col-form-label {
      color: #666669 !important;
      opacity: 0.5;
      padding-bottom: inherit;
      padding-top: 0;
    }
  
    .vue-tel-input{
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
      padding: 0.375rem 0.75rem;
      height: inherit;
      
      &#virtualSiteCountry {
        background: #fff url(/static/img/arrow-down.png) no-repeat center;
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
</style>