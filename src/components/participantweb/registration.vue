<template>
  <div>
    <div class="Intro-copy">Complete the following registration information</div>
    <h4 class="header">Registration header</h4>
    <div class="homepage-para">
      Add in the introductory content the page.
      <span
        v-b-popover.hover="'Enter the main registration content for the page. You can enter a title, headline, and body text. All fields are required and headline and body text include text formatting.'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div v-if="showSaveRegistration===true" class="homepahe-Rectangle-41">
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <p class="content">Page title</p>
          <input
            v-model="registration.pageTitle"
            type="text"
            class="homepage-box homepage-box-small"
            placeholder="Enter content"
          />
        </div>
      </div>
      <div class="row pt-10 mt-5">
        <div class="col-lg-12 p-0">
          <p class="content">Headline</p>
          <quill-editor
            class="bg-white"
            v-model="registration.headline"
            :options="editorOptionForimageCaptureTitleHeadline"
          ></quill-editor>
        </div>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 col-md-12 p-0">
          <div class="row pt-10 mt-5">
            <div class="col-lg-12 additioanal_copy p-0">
              <p class="content">Body copy</p>
              <quill-editor
                class="instruction-screen1 bg-white"
                v-model="registration.bodyCopyContent"
                :options="editorOptionForimageCaptureTitle"
              ></quill-editor>
            </div>
          </div>
          <div class="col-lg-12 p-0 text-right">
            <button
              class="btn box-btn-save mt-24 btn-success save_btn"
              v-on:click="saveHeaderRegistrationContent()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- read only header page -->

    <div v-if="showSaveRegistration===false" class="homepahe-Rectangle-41">
      <div class="row ml-5">
        <div class="col-lg-12 pl-0">
          <div class="content-edit">{{registration.pageTitle}}</div>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <div class="content-body-edit" v-html="registration.headline"></div>
        </div>
      </div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <div class="content-body-edit" v-html="registration.bodyCopyContent"></div>
        </div>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 p-0 mt-15 text-right">
          <button
            class="btn read-edit-btn save_btn"
            v-on:click="editHeaderRegistrationContent()"
          >Edit</button>
        </div>
      </div>
    </div>
    <!-- Registration form-------- -->

    <h4 class="header pt-10">Registration form</h4>
    <div v-if="(web===true && (android===true || ios===true))" class="homepage-para">
      Note: Data collected from the web form below will not be collected again in the app. To configure a disabled field it must be enabled on the
      <button
        class="link pl-0" v-on:click="redirectRegistrationForm()"
      >
       Change global registration fields
      </button>
      <span
        v-b-popover.hover="'Choose which registration fields you want registrants to fill out. You also have the ability to make each field required or optional. If you already made these selections within the Configurator, your selections will display here in read-only mode. If you need to make changes, click Change global registration fields.'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div
      v-if="showRegistrationFormSection===true"
      class="container-fluid homepage-rectangle-footer mt-10"
    >
      <div class="row pl-15 registeration_div">
        <div v-for="(item, index) in participantInfoData" :key="item.index">
          <div class="row section_heading" v-if="index === 0">Participant information</div>
          <div class="row section_heading" v-if="index === 10">Contact details</div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0 pr-0">
            <div class="row field_row">
              <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 p-0">
                <label
                  class="switch"
                  :class="{'inactive': (item.isOptional === 'required' && (item.key === 'email' || item.key === 'password' || item.key === 'nonMobilePhoneNumber'))}"
                >
                  <input
                    type="checkbox"
                    v-model="item.isVisible"
                    :disabled="item.isOptional === 'required' && (item.index === 3 || item.index === 4)"
                    v-on:change="changeVisibility(item)"
                  />
                  <div class="slider round"></div>
                </label>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 pt-2 pl-5 fw-500 labelText">
                {{item.field}}
                <span v-if="item.key === 'email'">
                  <span
                    v-b-popover.hover="'Participants will register or login with their email address.'"
                    class="fa fa-info-circle color_grey fs-16 cursor_pointer"
                  ></span>
                </span>
                <span v-if="item.key === 'password'">
                  <i
                    class="fa fa-question-circle help_icon cursor_pointer"
                    aria-hidden="true"
                    data-toggle="popover"
                    tabindex="0"
                    data-trigger="focus"
                    data-content="The participants password will be compliant with security and privacy requirements including the following: <br />
                    1. 	minimum 8 characters <br />
                    2. 	at least 1 upper case letter <br />
                    3. 	at least 1 lower case character <br />
                    4. 	at least 1 number <br />
                    5. 	at least 1 symbol (e.g. @#$%) <br />
                    6. 	Must not have a repetitive string (e.g. abc12abc12…)"
                    data-html="true"
                  ></i>
                </span>
              </div>
              <div class="col-lg-4 col-md-5 col-sm-5 col-xs-4 p-0">
                <select
                  class="form-control"
                  v-model="item.isOptional"
                  :disabled="!item.isVisible"
                  v-if="(item.key !== 'email' && item.key !== 'password' && item.key !== 'nonMobilePhoneNumber')"
                >
                  <option value="default" disabled>Select requirement</option>
                  <option value="optional">Optional field</option>
                  <option value="required">Required field</option>
                </select>
                <div
                  class="optionalField"
                  v-if="( item.key === 'email' || item.key === 'password' || item.key === 'nonMobilePhoneNumber')"
                >
                  <span class="text-capitalize">{{item.isOptional}}</span> field
                </div>
              </div>
            </div>
            <div class="row mt-5 pl-50 registration_gender_ipadfix" v-if="item.key === 'gender'">
              <div class="radio col-sm-12 col-xs-12 clearfix p-0">
                <div class="radio">
                  <input
                    type="radio"
                    name="gender"
                    id="gender_standard"
                    value="standard"
                    v-model="item.meta"
                    :disabled="!item.isVisible"
                  />
                  <label class="radio-label">
                  <span class="Gender-selection">
                    Standard gender selection list
                     <span
                      v-b-popover.hover="{
                        content:'<b> Standard gender selection list </b><br />• 	Male  <br />• 	Female <br />•   Other gender identity <br />&nbsp; &nbsp;(when selected, opens to a free form &nbsp;&nbsp;&nbsp;field)',
                        html: true}"
                      class="fa fa-info-circle color_grey fs-16 cursor_pointer"
                    ></span>
                  </span>
                </label>
                </div>
              </div>
              <div class="radio col-sm-12 col-xs-12 clearfix p-0">
                <div class="radio">
                  <input
                    type="radio"
                    name="gender"
                    id="gender_extended"
                    value="extended"
                    v-model="item.meta"
                    :disabled="!item.isVisible"
                  />
                  <label class="radio-label">
                  <span class="Gender-selection">
                    Expanded gender selection list
                    <span
                      v-b-popover.hover="{
                        content: '<b> Expanded gender selection list </b><br />• 	Man <br />• 	Woman <br />• 	Genderqueer <br />• 	Transgender Man (Female-to-Male) <br />• 	Transgender Woman (Male-to- &nbsp;&nbsp;&nbsp;Female) <br />• 	Another gender identity (when  &nbsp;&nbsp;&nbsp;selected, opens to a free form field)',
                        html: true}"
                      class="fa fa-info-circle color_grey fs-16 cursor_pointer"
                    ></span>
                  </span>
                </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="savebtnhide===true" class="col-lg-12 pr-15 text-right">
          <button
            class="btn box-btn-save mt-24 btn-success save_btn"
            v-on:click="saveRegistrationForm()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showRegistrationFormSection===false"
      class="container-fluid homepage-rectangle-footer mt-10"
    >
      <div class="row pl-15 registeration_div">
        <div v-for="(item, index) in participantInfoData" :key="item.index">
          <div class="row section_heading" v-if="index === 0">Participant information</div>
          <div class="row section_heading" v-if="index === 10">Contact details</div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0 pr-0">
            <div class="row field_row">
              <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 p-0">
                <label
                  class="switch"
                  :class="{'inactive': (item.isOptional === 'required' && (item.key === 'email' || item.key === 'password' || item.key === 'nonMobilePhoneNumber'))}"
                >
                  <input
                    type="checkbox"
                    v-model="item.isVisible"
                    :disabled="item.isOptional === 'required' && (item.index === 3 || item.index === 4)"
                    onclick="return false"
                  />
                  <div class="slider round"></div>
                </label>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 pt-2 pl-5 fw-500 labelText">
                {{item.field}}
                <span v-if="item.key === 'email'">
                  <span
                    v-b-popover.hover="'Participants will register or login with their email address.'"
                    class="fa fa-info-circle color_grey fs-16 cursor_pointer"
                  ></span>
                </span>
                <span v-if="item.key === 'password'">
                  <i
                    class="fa fa-question-circle help_icon cursor_pointer"
                    aria-hidden="true"
                    data-toggle="popover"
                    tabindex="0"
                    data-trigger="focus"
                    data-content="The participants password will be compliant with security and privacy requirements including the following: <br />
                    1. 	minimum 8 characters <br />
                    2. 	at least 1 upper case letter <br />
                    3. 	at least 1 lower case character <br />
                    4. 	at least 1 number <br />
                    5. 	at least 1 symbol (e.g. @#$%) <br />
                    6. 	Must not have a repetitive string (e.g. abc12abc12…)"
                    data-html="true"
                  ></i>
                </span>
              </div>
              <div class="col-lg-4 col-md-5 col-sm-5 col-xs-4 p-0">
                <select
                  class="form-control"
                  v-model="item.isOptional"
                  disabled="disabled"
                  onclick="return false"
                  v-if="(item.key !== 'email' && item.key !== 'password' && item.key !== 'nonMobilePhoneNumber')"
                >
                  <option value="default" disabled>Select requirement</option>
                  <option value="optional" disabled>Optional field</option>
                  <option value="required" disabled>Required field</option>
                </select>
                <div
                  class="optionalField"
                  v-if="( item.key === 'email' || item.key === 'password' || item.key === 'nonMobilePhoneNumber')"
                >
                  <span class="text-capitalize">{{item.isOptional}}</span> field
                </div>
              </div>
            </div>
            <div class="row mt-5 pl-50 registration_gender_ipadfix" v-if="item.key === 'gender'">
              <div class="radio col-sm-12 col-xs-12 clearfix p-0">
                <div class="radio">
                  <input
                    type="radio"
                    name="gender"
                    id="gender_standard"
                    value="standard"
                    v-model="item.meta"
                    disabled
                  />
                  <label class="radio-label">
                  <span class="Gender-selection">
                    Standard gender selection list
                    <span
                      v-b-popover.hover="{
                        content:'<b> Standard gender selection list </b><br />• 	Male  <br />• 	Female <br />•   Other gender identity <br />&nbsp; &nbsp;(when selected, opens to a free form &nbsp;&nbsp;&nbsp;field)',
                        html: true}"
                      class="fa fa-info-circle color_grey fs-16 cursor_pointer"
                    ></span>
                  </span>
                </label>
                </div>
              </div>
              <div class="radio col-sm-12 col-xs-12 clearfix p-0">
                <div class="radio">
                  <input
                    type="radio"
                    name="gender"
                    id="gender_extended"
                    value="extended"
                    v-model="item.meta"
                    disabled
                  />
                  <label class="radio-label">
                  <span class="Gender-selection">
                    Expanded gender selection list
                     <span
                      v-b-popover.hover="{
                        content: '<b> Expanded gender selection list </b><br />• 	Man <br />• 	Woman <br />• 	Genderqueer <br />• 	Transgender Man (Female-to-Male) <br />• 	Transgender Woman (Male-to- &nbsp;&nbsp;&nbsp;Female) <br />• 	Another gender identity (when  &nbsp;&nbsp;&nbsp;selected, opens to a free form field)',
                        html: true}"
                      class="fa fa-info-circle color_grey fs-16 cursor_pointer"
                    ></span>
                  </span>
                </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="savebtnhide===false && showeditReg===true" class="col-lg-12 pr-15 text-right">
          <button
            class="btn read-edit-btn save_btn"
            v-on:click="editRegistrationForm()"
          >Edit</button>
        </div>
      </div>
    </div>
    
    <h4 class="header mt-30">Add study sites</h4>
    <div class="homepage-para">
      Study sites must first be created and activated in the Research team settings. Once created, select the sites below to display to participants on your website.  
       <span
        v-b-popover.hover="'A list of all active sites (both physical and virtual) is displayed. Mark the checkbox next to the site(s) you want registrants to be able to select. At least one site is required to be checked.'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div 
      v-if="showSaveStudySite===true && this.sortedSideIds.length !== 0" 
      class="homepahe-Rectangle-41 Add-study-sec"
    >
      <div class="container ml-0" >
        <p class="content">Select sites to add</p>
        <div class="table-responsive">          
          <table class="table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Facility name</th>
                <th>Site type</th>
                <th>Allow all</th>
                <th>City</th>
                <th>State / Province</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr  v-for="(item, index) in allSideIds" :key="item.id">
                <td class="control control--checkbox">
                  <input
                    type="checkbox" 
                    v-on:change="onChangeAddsite(index)" 
                    :checked="sortedSideIds[index].isCheck"
                    :value="item.id" :id="item.id"
                  />
                  <div class="control__indicator"></div>
                </td>
                <td>{{item.name}}</td>
                <td>{{item.type}}</td>
                <td>{{item.isAllowOtherRegionParticipant === false ? 'No' : item.isAllowOtherRegionParticipant === true ? 'Yes' : ''}}</td>
                <td>{{item.city}}</td>
                <td>{{item.state}}</td>
                <td
                  v-for="country in item.countryList" 
                  :key="country.countryName">
                  {{country.countryName}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <span
          class="col-lg-12 col-md-12  mt-30 pl-0 invitation"
        >
          Participant invitation API 
          <span 
            v-b-popover.hover="'Enabling auto-invitation will automatically send study invitation emails to registrants that successfully pass the prescreening process and are associated to a site. Participant status will then show as Invited within the Portal.'" 
            class="fa fa-info-circle color_grey ml-3 mt-5">
          </span>
        </span>
        <div 
          data-v-11f03b67="" 
          class="pr-10 mt-10" 
          style="display: inline-block;"
        >
          <label class="switch">
            <input type="checkbox" 
              v-on:click="onChangeAutoInvite" 
              id="autoinvite" 
              :checked="addsitesdata.autoInvite"
            />
            <div class="slider round"></div>
          </label>
        </div>
        <span>Auto-invite successfully registered participants into the study.</span>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 p-0 text-right">
          <button 
            class="btn box-btn-save mt-24 btn-success save_btn" 
            v-on:click="saveAddStudySites()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showSaveStudySite===false && this.sortedSideIds.length !== 0" 
      class="homepahe-Rectangle-41 Add-study-sec"
    >
      <div class="container ml-0" >
        <p class="content">Select sites to add</p>
        <div class="table-responsive">          
          <table class="table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Facility name</th>
                <th>Site type</th>
                <th>Allow all</th>
                <th>City</th>
                <th>State / Province</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>                  
              <tr  v-for="(item, index) in allSideIds" :key="item.id">
                <td class="control control--checkbox">
                  <input 
                    type="checkbox" 
                    onclick="return false" 
                    :checked="sortedSideIds[index].isCheck"
                    :value="item.id" 
                    :id="item.id"
                  />
                  <div class="control__indicator"></div>
                </td>
                <td>{{item.name}}</td>
                <td>{{item.type}}</td>
                <td>{{item.isAllowOtherRegionParticipant === false ? 'No' : item.isAllowOtherRegionParticipant === true ? 'Yes' : ''}}</td>
                <td>{{item.city}}</td>
                <td>{{item.state}}</td>
                <td v-for="country in item.countryList" :key="country.countryName">
                  {{country.countryName}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <span 
          class="col-lg-12 col-md-12  mt-30 pl-0 invitation"
        >
          Participant invitation API 
          <span 
            v-b-popover.hover="'Enabling auto-invitation will automatically send study invitation emails to registrants that successfully pass the prescreening process and are associated to a site. Participant status will then show as Invited within the Portal.'" 
            class="fa fa-info-circle color_grey ml-3 mt-5"
          >
          </span>
        </span>
        <div 
          data-v-11f03b67="" 
          class="pr-10 mt-10" 
          style="display: inline-block;"
        >
          <label 
            class="switch"
          >
            <input 
              type="checkbox" 
              onclick="return false" 
              :checked="addsitesdata.autoInvite"
            />
            <div class="slider round"></div>
          </label>
        </div>
        <span>Auto-invite successfully registered participants into the study.</span>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 p-0 text-right">
          <button 
            class="btn read-edit-btn save_btn" 
            v-on:click="editAddStudySites()"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
    <!-- Body Content page.-------------- -->

    <h4 class="header-body-content mt-20">Registration complete message</h4>
    <div class="homepage-para-body-content">
      Add in content to display after the user completes their registration.
      <span
        v-b-popover.hover="'Enter a header and body text to let registrants know they have completed the registration process.'"
        class="fa fa-info-circle color_grey"
      >
      </span>
    </div>
    <div
      v-if="showRegistrationMsgSection===true" 
      class="homepage-Rectangle-41"
    >
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <p class="content">Header</p>
          <quill-editor
            class="bg-white"
            v-model="registration.completeHeader"
            :options="editorOptionForimageCaptureTitleSubHeadline"
          >
          </quill-editor>
        </div>
      </div>
      <div class="row pt-10 ml-5">
        <div class="col-lg-12 additioanal_copy p-0">
          <p class="content">Body copy</p>
          <quill-editor
            class="bg-white instruction-screen"
            v-model="registration.completeBodyCopy"
            :options="editorOptionForimageCaptureTitleBodyCopy"
          >
          </quill-editor>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 p-0 mt-20 text-right">
          <button
            class="btn box-btn-save btn-success save_btn"
            v-on:click="saveRegistrationMsg()"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- edit section starts body content -->

    <div 
      v-if="showRegistrationMsgSection=== false" 
      class="homepage-Rectangle-41"
    >
      <div></div>
      <div class="row pt-20 ml-5">
        <div class="col-lg-12 pl-0">
          <div class="bold-style" v-html="registration.completeHeader"></div>
        </div>
      </div>
      <div class="row ml-5">
        <div class="col-lg-12 homepage-read-edit-body pl-0">
          <div class v-html="registration.completeBodyCopy"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 p-0 mt-20 text-right">
          <button 
            class="btn read-edit-btn save_btn" 
            v-on:click="editRegistrationMsg()"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
    <div v-if="!isNextButton" class="h-60"></div>
    <div class="next-screen-btn-div text-right">
      <button
        v-if="isNextButton"
        class="btn box-btn-next btn-success save_btn mt-50 mb-10"
        v-on:click="screenNext()"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import Papa from "papaparse";
import FileSaver from "file-saver";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import { AclRule } from "vue-acl";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import moment from "moment";
import { mapGetters } from "vuex";
import {
  participantStatuses,
  participantStatusesText,
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  HOME_HEALTH,
  QUALITY,
  CRA,
  DM
} from "@/constants/authRoles";
import mainHeader from "../common/main-header";
import sideMenu from "../common/side-menu";

let dynamicInputID = 0;
export default {
  name: "homep",
  components: { mainHeader, sideMenu },
  props: {
    studyData: Object
  },
  data() {
    return {
      isNextButtonDisplay: false,
      allSideIds: [],
      sortedSideIds: [],
      index:0,
      newSites:[],
      checkedval:'',
      checkedsites:[],
      checkapprears:false,
      editaddsite:false,
      editRegistrationbtn:false,
      checkedCategories:[],
      web:'',
      android:'',
      ios:'',
      registration: {
        created_by: "",
        created_time: "",
        modified_by: "",
        modified_time: "",
        pageTitle: "",
        headline: "",
        bodyCopyContent: "",
        completeHeader: "",
        completeBodyCopy: "",
        
      },
      addsitesdata:{
        autoInvite: '',
        created_by:'',
        created_time:'',
        modified_by: "",
        modified_time: "",
        siteIdArray:'',
        webId:''
      },
      showeditReg:true,
      savebtnhide:true,
      approvalSites : [],
      localData :[],
      getlocalData :[],
      showSaveStudySite:true,
      createMode:true,
      editorOptionForimageCaptureTitle: {
      placeholder: "Enter Content",
      modules: {
      toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleHeadline: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleSubHeadline: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleBodyCopy: {
        placeholder: "Enter Content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      showStudySiteSection: true,
      showSaveRegistration: true,
      showRegistrationMsgSection: true,
      showRegistrationFormSection: true,
      participantInfoData: [
        {
          field: "Participant first name",
          key: "firstName",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 1,
          position: 1,
          meta: ""
        },
        {
          field: "Birth date",
          key: "birthDate",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "personalInfo",
          index: 5,
          position: 2,
          meta: ""
        },
        {
          field: "Participant last name",
          key: "lastName",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 2,
          position: 3,
          meta: ""
        },
        {
          field: "Age range",
          key: "ageRange",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 6,
          position: 4,
          meta: ""
        },
        {
          field: "Parent/Caregiver First Name",
          key: "parentOrCgFirstName",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 17,
          position: 5,
          meta: ""
        },
        {
          field: "Primary language",
          key: "language",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 7,
          position: 6,
          meta: ""
        },
        {
          field: "Parent/Caregiver Last Name",
          key: "parentOrCgLastName",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 18,
          position: 7,
          meta: ""
        },
        {
          field: "Gender",
          key: "gender",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 8,
          position: 8,
          meta: ""
        },
        {
          field: "Email",
          key: "email",
          isOptional: "required",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 3,
          position: 9,
          meta: ""
        },
        {
          field: "Password",
          key: "password",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "personalInfo",
          index: 4,
          position: 10,
          meta: "standard"
        },

        {
          field: "Address",
          key: "address",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 9,
          position: 11,
          meta: ""
        },
        {
          field: "Country",
          key: "country",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 13,
          position: 12,
          meta: ""
        },
        {
          field: "City/Town",
          key: "city",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 10,
          position: 13,
          meta: ""
        },
        {
          field: "Phone number",
          key: "phoneNumber",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 14,
          position: 14,
          meta: ""
        },
        {
          field: "State/Province/ Region",
          key: "stateProvince",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 11,
          position: 15,
          meta: ""
        },
        {
          field: "Non-mobile phone number",
          key: "nonMobile",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 15,
          position: 16,
          meta: ""
        },
        {
          field: "Zip/Postal code",
          key: "zipCode",
          isOptional: "default",
          isVisible: true,
          expectedValues: null,
          type: "contactInfo",
          index: 12,
          position: 17,
          meta: ""
        },
        {
          field: "How did you hear about this study?",
          key: "howDidYouHear",
          isOptional: "default",
          isVisible: false,
          expectedValues: null,
          type: "contactInfo",
          index: 16,
          position: 18,
          meta: ""
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["token", "user", "getPublishTab"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    isNextButton() {
      let conditionalFlag = false;
      if(this.isNextButtonDisplay === true || this.getPublishTab === true) {
        conditionalFlag = true;
      }
      return conditionalFlag;
    },
    userToken() {
      return this.token;
    },
    getStatuses() {
      return participantStatuses;
    },
    getStatusesText() {
      return participantStatusesText;
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
     canView() {
      return this.studyData.truClinicIntegration;
    },
    canTelehealthView() {
      return this.studyData.telehealthIntegration;
    },
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    },
    canDMAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check("userAccess");
    },
    canCRAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check("userAccess");
    }
  },
  watch: {
    isNextButton(newValue, oldValue) {
      let conditionalFlag = false;
      if(this.isNextButtonDisplay === true || newValue === true) {
        conditionalFlag = true;
      }
      return conditionalFlag;
    },
  },
  methods: {
    async getLatestPublishedURL() {
      await this.$api
        .getPublishedURL(this.$route.params.studyId)
        .then((response) => {
          if (response.data) {
            if(response.data.data) {
              if (response.data.data.staticSiteURL) {
                if(response.data.data.staticSiteURL.length> 0) {
                    this.isNextButtonDisplay = true;
                }
              }
            }
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    screenNext(){
      this.$router.push({
        name: "publish",
        params: {
          studyId: this.studyId
        }
      });
    },
    editAddStudySites(){
      this.showSaveStudySite=true;
    },

    async setAllSideIds () {
      let selectedIds = [];
      await this.$api.getParticipantWebAddSites(this.$route.params.studyId).then(
        response => {
          selectedIds = response.body.data;
        },
        error => {
          this.$toastr.error(
          error.body && error.body.message
          ? error.body.message
          : "Error while getting the list of sites"
          );
        }
      );
      this.allSideIds = _.sortBy(this.allSideIds, "name");
      this.sortedSideIds = this.allSideIds.map((e,i)=>{
        let temp = selectedIds.find(element=> element.site_id === e.id)
        let obj= {}
        if(!temp) {
          obj = {id:e.id, isCheck: false};
        } else if(temp) {
          obj = {id:e.id, isCheck: true};
        }
        return obj;
      })
    },

    async getSelectedSideIds(){
      let selectedIds = [];
         await this.$api.getSitesFact(this.$route.params.studyId).then(
        response => {
          response.body.forEach((side) => {
            if(side.status==="Active") {
              this.allSideIds.push(side);
            }
          })
        },
        error => {
          this.$toastr.error(
          error.body && error.body.message
            ? error.body.message
            : "Error while getting the list of sites"
        );
        }
      );
        await this.$api.getParticipantWebAddSites(this.$route.params.studyId).then(
              response => {
                selectedIds = response.body.data;
              },
              error => {
              this.$toastr.error(
              error.body && error.body.message
              ? error.body.message
              : "Error while getting the list of sites"
            );
          }
        );
        this.allSideIds = _.sortBy(this.allSideIds, "name"); 
        this.sortedSideIds = this.allSideIds.map((e,i)=>{
          let temp = selectedIds.find(element=> element.site_id === e.id)
          let obj= {}
          if(!temp) {
            obj = {id:e.id, isCheck: false};
          } else if(temp) {
            obj = {id:e.id, isCheck: true};
          }
        return obj;
      })
      this.showSaveStudySite = false;
    }, 
   
    isInGrupMenu(id,index){
      if(id===this.checkedsites[index])
      return true; 
    },

    editRegistrationForm(){
      this.showRegistrationFormSection=true;
      this.savebtnhide= true;
    },
    saveRegistrationForm(){
      let isError = false;
        this.participantInfoData.forEach((participant) => {
          if(participant.isOptional === "default" &&  participant.isVisible === true && participant.field !== "Email" && participant.field !== "Password") {
            isError = true;
            return;
          }
        })
        if(isError) {
          toastr.error('Please select requirements for input fields or hide the ones that would not display.');
          return;
        }

        const regData = _.sortBy(this.participantInfoData, "index");
        const registrationform = {
          created_by : "mahesh",
          created_time : "2020-06-25 15:01:21",
          participantRegistrationConfigDetails: regData
        }
        this.$api.createParticipantWebRegistrationForm(this.$route.params.studyId, registrationform)
          .then(
            () => {
              this.savebtnhide= false;
              this.showRegistrationFormSection=false;
              toastr.success('Registration form saved successfully');
            },
          );
    },
    onChangeAutoInvite(){
     var checkbox = document.getElementById('autoinvite');
    if (checkbox.checked === true){
        this.addsitesdata.autoInvite= true; 
      }else{
        this.addsitesdata.autoInvite= false;
      }
    },
    onChangeAddsite(index){
      this.sortedSideIds[index].isCheck = !this.sortedSideIds[index].isCheck; 
    },
    getRegWeb(){
       this.savebtnhide= false;
       this.showeditReg=true
      let self = this;
     this.$api.getParticipantWebRegistrationForm(this.$route.params.studyId)
      .then(response => {
       this.showRegistrationFormSection=false;
      if (response.data.data.participantRegistrationConfigDetails) {
        this.checkapprears = true;
        self.participantInfoData = response.data.data.participantRegistrationConfigDetails.filter(
          info => {
            if (info.key == "firstName") {
              info.field = "Participant's First Name";
            } else if (info.key == "lastName") {
              info.field = "Participant's Last Name";
            } else if (info.key == "email") {
              info.position = 9;
            } else if (info.key == "password") {
              info.position = 10;
            } else if (
              info.key == "address" ||
              info.key == "country" ||
              info.key == "city" ||
              info.key == "phoneNumber" ||
              info.key == "stateProvince" ||
              info.key == "nonMobilePhoneNumber" ||
              info.key == "zipCode" ||
              info.key == "howDidYouHear"
            ) {
              info.position = info.position + 2;
            }
            return info;
          }
        );
        self.careGiver = _.find(self.participantInfoData, {
          key: "parentOrCgFirstName"
        });
        if (!self.careGiver) {
          self.participantInfoData.push({
            field: "Parent/Caregiver First Name",
            key: "parentOrCgFirstName",
            isOptional: "default",
            isVisible: false,
            expectedValues: null,
            type: "personalInfo",
            index: 17,
            position: 5,
            meta: ""
          });
          self.participantInfoData.push({
            field: "Parent/Caregiver Last Name",
            key: "parentOrCgLastName",
            isOptional: "default",
            isVisible: false,
            expectedValues: null,
            type: "personalInfo",
            index: 18,
            position: 7,
            meta: ""
          });
        }
        self.participantInfoData = _.sortBy(
          self.participantInfoData,
          "position"
        );
        self.participantInfoData.forEach((participant, index) => {
          if(participant.field === "Gender" && participant.meta === "")  {
            self.participantInfoData[index].meta = "standard";
          }
        })
      }
    });
    },
      getStudyDetail() {
      this.$api.getStudyDataFact(this.$route.params.studyId).then(response => {
        this.web = response.body.web;
        this.android=response.body.android;
        this.ios=response.body.ios;
        if(this.android===true || this.ios===true){
          this.showRegistrationFormSection=false;
        }

    if(this.web===true && (this.android===true || this.ios===true)){
      this.savebtnhide=false;
      this.showeditReg=false;
    let self = this;
    this.$api.getRegistrationFact(this.studyId).then(response => {
      if (response.body.participantRegistrationConfigDetails) {
        this.showRegistrationFormSection=false;
        this.checkapprears=true;
        self.participantInfoData = response.body.participantRegistrationConfigDetails.filter(
          info => {
            if (info.key == "firstName") {
              info.field = "Participant's First Name";
            } else if (info.key == "lastName") {
              info.field = "Participant's Last Name";
            } else if (info.key == "email") {
              info.position = 9;
            } else if (info.key == "password") {
              info.position = 10;
            } else if (
              info.key == "address" ||
              info.key == "country" ||
              info.key == "city" ||
              info.key == "phoneNumber" ||
              info.key == "stateProvince" ||
              info.key == "nonMobilePhoneNumber" ||
              info.key == "zipCode" ||
              info.key == "howDidYouHear"
            ) {
              info.position = info.position + 2;
            }
            return info;
          }
        );
        self.careGiver = _.find(self.participantInfoData, {
          key: "parentOrCgFirstName"
        });
        if (!self.careGiver) {
          self.participantInfoData.push({
            field: "Parent/Caregiver First Name",
            key: "parentOrCgFirstName",
            isOptional: "default",
            isVisible: false,
            expectedValues: null,
            type: "personalInfo",
            index: 17,
            position: 5,
            meta: ""
          });
          self.participantInfoData.push({
            field: "Parent/Caregiver Last Name",
            key: "parentOrCgLastName",
            isOptional: "default",
            isVisible: false,
            expectedValues: null,
            type: "personalInfo",
            index: 18,
            position: 7,
            meta: ""
          });
        }
        self.participantInfoData = _.sortBy(
          self.participantInfoData,
          "position"
        );
      }
    });
    }else{
      this.getRegWeb();
    }
      }, error => {
      
      });
    },
    saveAddStudySites(){
      let isSideSelected = false;
       if (this.$route.params.studyId) {
        if (this.createMode === true) {
          this.addsitesdata.created_by = this.user.id;
          this.addsitesdata.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.addsitesdata.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.addsitesdata.modified_by = this.user.id;
        }
        this.sortedSideIds.forEach((side) => {
           if(side.isCheck === true) {
             isSideSelected = true;
           }
         })
         if(isSideSelected === false) {
           toastr.error("Site is required");
           return;
         }
        let selectedSides = [];
         this.sortedSideIds.forEach((obj) => {
           if(obj.isCheck === true) {
             selectedSides.push(obj.id);
           }
         });
         
        this.addsitesdata.siteIdArray = selectedSides;
        this.$api.createParticipantWebAddSites(this.$route.params.studyId,this.addsitesdata)
          .then(response => {
            if (response) {
              this.addsitesdata.autoInvite = response.data.data.autoInvite;
              this.setAllSideIds();
                toastr.success(
                "Add study sites saved successfully"
              );
              this.showSaveStudySite = false;
            }
          })
          .catch(err => {
            throw err;
          });
      }
    },
    redirectRegistrationForm(){
       this.$router.push({
        name: "registration",
        params: {
          studyId: this.$route.params.studyId
        }
      });
    },
    saveRegistrationMsg() {
      if (!this.registration.completeHeader || this.registration.completeHeader.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Headline title is required.");
        return;
      }
      if (!this.registration.completeBodyCopy || this.registration.completeBodyCopy.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Body copy is required.");
        return;
      }
       if (this.createMode === true) {
          this.registration.created_by = this.user.id;
          this.registration.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.registration.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.registration.modified_by = this.user.id;
        }
      if (this.$route.params.studyId) {
        this.$api
          .createParticipantWebRegistration(
            this.$route.params.studyId,
            this.registration
          )
          .then(response => {
            if (response) {
              this.registration.completeHeader =
                response.data.data.completeHeader;
              this.registration.completeBodyCopy =
                response.data.data.completeBodyCopy;
              toastr.success(
                "Registration complete message saved successfully"
              );
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showRegistrationMsgSection = false;
    },
    editRegistrationMsg() {
      this.showRegistrationMsgSection = true;
    },
    saveHeaderRegistrationContent() {
      if (!this.registration.pageTitle || this.registration.pageTitle.trim().length === 0) {
        toastr.error("Page title is required.");
        return;
      }
      if (!this.registration.headline || this.registration.headline.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Headline is required.");
        return;
      }
      if (!this.registration.bodyCopyContent || this.registration.bodyCopyContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Body copy is required.");
        return;
      }
      if (this.createMode === true) {
          this.registration.created_by = this.user.id;
          this.registration.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.registration.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.registration.modified_by = this.user.id;
        }
      if (this.$route.params.studyId) {
        this.$api
          .createParticipantWebRegistration(
            this.$route.params.studyId,
            this.registration
          )
          .then(response => {
            if (response) {
              this.registration = response.data.data;
              toastr.success("Registration header saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSaveRegistration = false;
    },
    editHeaderRegistrationContent() {
      this.showSaveRegistration = true;
    },
    changeVisibility(item) {
      let keyIndex = null;
      if (
        item.key !== "firstName" &&
        item.key !== "lastName" &&
        item.key !== "nonMobilePhoneNumber"
      ) {
        if (!item.isVisible) {
          keyIndex = _.findIndex(this.participantInfoData, ["key", item.key]);
          this.participantInfoData[keyIndex].isOptional = "default";
        }
      }
      if (item.isVisible && item.key === "birthDate") {
        keyIndex = _.findIndex(this.participantInfoData, ["key", "ageRange"]);
        this.participantInfoData[keyIndex].isVisible = false;
        this.participantInfoData[keyIndex].isOptional = "default";
      } else if (item.isVisible && item.key === "ageRange") {
        keyIndex = _.findIndex(this.participantInfoData, ["key", "birthDate"]);
        this.participantInfoData[keyIndex].isVisible = false;
        this.participantInfoData[keyIndex].isOptional = "default";
      }
    }
  },

  mounted() {
    window.scrollTo(0, 0);
     window.setTimeout(() => {
      window.$('[data-toggle="popover"]').popover();
    }, 1);
    this.studyId = this.$route.params.studyId;
    this.participantInfoData = _.sortBy(this.participantInfoData, "position");
    this.getLatestPublishedURL();
    this.participantInfoData.forEach((participant, index) => {
          if(participant.field === "Gender" && participant.meta === "")  {
            this.participantInfoData[index].meta = "standard";
          }
        })

    this.getStudyDetail();
    this.getSelectedSideIds();

    if (this.$route.params.studyId) {
      this.$api
        .getParticipantWebRegistration(this.$route.params.studyId)
        .then(response => {
          if (response.data.data) {
            this.createMode = false;
            this.registration = response.data.data;
            this.registration.bodyCopyContent = response.data.data.bodyCopyContent;
            this.addsitesdata.autoInvite = response.data.data.autoInvite;
              this.addsitesdata.webId = response.data.data.id;
            if (this.registration.pageTitle) {
              this.showSaveRegistration = false;
            }
            if (this.registration.completeHeader) {
              this.showRegistrationMsgSection = false;
            }
          }
        })
        .catch(err => {
          throw err;
        });
    }
    
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)Added CSS Hack for EDGE only for big screens above 1200px


body,
.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  flex: none;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.bold-style {
  font-size: 18px !important;
  font-weight: 700;
  line-height: 1.78;
  color: #666669;
}
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    flex: none;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
}
@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-12 {
    width: 100%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-6 {
    width: 50%;
  }
  .col-md-4 {
    width: 33.33333333%;
  }
  .col-md-8 {
    width: 66.66666667%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    flex: none;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.row {
  clear: both;
}
.launch_status_section {
  background-color: #2d3752;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  /*background-image: linear-gradient(97deg, #698eff, #15befd 49%, #8efbce);*/
  padding: 21px;
  margin-bottom: 20px;
  font-size: 18px;
}
// .launch-status-section-web {
//   width: 1000px;
//   height: 150px;
//   border-radius: 3px;
//   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
//   background-color: #668bbd;
// }
.draft-status {
  background-color: #48bf7a;
}
.draft-status-web {
  background-color: #668bbd;
}
.mobile-icon {
  position: absolute;
  top: -17px;
  left: 112px;
}
.consent-icon {
  position: absolute;
  top: 33px;
  left: 220px;
  width: 110px;
  height: 88px;
}
.like-icon {
  position: absolute;
  top: 85px;
  left: 69px;
}
.desktop-icon-web {
  position: absolute;
  top: -10px;
  left: 112px;
  width: 131px;
  height: 78px;
  object-fit: contain;
}
.nav-icon-web {
  position: absolute;
  top: 38px;
  left: 261px;
  // width: 110px;
  // height: 88px;
  width: 69px;
  height: 59px;
  object-fit: contain;
}
.globe-icon-web {
  position: absolute;
  top: 60px;
  left: 60px;
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.opacity-1 {
  opacity: 0.75 !important;
}
.provide-btn {
  background-color: #fff;
  color: #48bf7a;
}
.update-btn {
  background-color: #48bf7a;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}
.update-btn-web {
  background-color: #668bbd;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}

.fa-apple,
.fa-android,
.fa-cloud {
  color: #f16559;
  font-size: 24px;
  position: relative;
  top: 4px;
}

.status-strip {
  width: 80%;
  background: #fff;
  padding: 10px 0 10px 10px;
  color: #2d3752;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}
.completed_title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  max-width: 90%;
  cursor: pointer;
}
.status-strip-red {
  width: 80%;
  background: #f16559;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}

.edit-color {
  color: #4c8ce4 !important;
  font-weight: normal;
}

.edit-color-white {
  color: #fff !important;
  font-weight: normal;
}

.contact_btn {
  border-radius: 100px;
  background-color: #34537d;
  color: #ffffff;
}
.export_btn {
  border-radius: 25px;
  background-color: #34537d !important;
  color: #ffffff;
  cursor: pointer;
}
.disable-export {
  background-color: #b8c7ce !important;
}

.download_btn {
  background-color: #4c8ce4;
  color: #ffffff;
  cursor: pointer;
}

.pop-color {
  color: #666669 !important;
}

.close-btn {
  background: #d3dfe4;
  color: #666669;
}

.padding_top_10px {
  padding-top: 10px;
}

.padding_top_20px {
  padding-top: 20px;
}

.donut_graph_panel {
  height: 184px;
}

.dashboard {
  display: flex;
  background-color: #f5f8fa;
}
.graph_val {
  position: relative;
  top: 2px;
}
.remaining_days_text {
  font-size: 12px;
  color: #666769;
}
.reverse {
  transform: rotate(180deg);
}

.remaining_days_graph {
  width: 200px;
  height: 80px;
}
.item_bg_color {
  border-radius: 3px;
  background-color: #eaf0f4;
  color: #707c81;
  padding: 4px 10px;
  font-size: 12px;
  margin: 0 4px 4px 0;
  display: inline-block;
}
.arrow {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 74px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.panel {
  border-radius: 2px;
  margin-bottom: 10px;
}

.panel_height {
  height: 100%;
  min-height: 260px;
  position: relative;
}
.panel_height_half {
  height: 100%;
  min-height: 130px;
  position: relative;
}
.panel-body {
  padding: 16px;
}
.Rectangle-41 {
  width: 1078px;
  height: 291px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  width: 1291px;
  margin-left: 32px;
  background-color: #f5f8fa;
  //   opacity: 0.1;
  margin-left: 32px;
  padding-left: 30px;
}
.header {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  color: #666669;
  margin-top: 22px;
}
.Intro-copy {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #666669;
  margin-top: 26px;
}
.arrow2 {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 17px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.btn-close-tutorial {
  position: relative;
  right: -136px;
  border: none;
  background-color: transparent;
  font-family: RobotoRegular;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-top: -10px;
  color: #fff;
  z-index: 1002;
  margin-left: 919px;
}
.instruction_title {
  word-break: break-word;
  width: 307px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #000000;
    text-align: justify;
}
.participant-heading {
  // width: 130px;
  height: 22px;
  margin-top: 93px !important;
  margin-left: 64px;
  font-family: Lato;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
}
.rectangle {
  width: 1140px;
  height: 1893px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.custom-popover2 {
  position: absolute;
  width: 490px;
  border-radius: 3px;
  padding: 10px;
  left: 27px !important;
  top: -42px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.custom-popover {
  position: absolute;
  width: 669px;
  border-radius: 3px;
  padding: 10px;
  left: 28px !important;
  top: -99px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.compliance_section {
  .adherence {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
    .percentage {
      color: #666669;
      font-size: 28px;
      font-weight: bold;
    }
    .desc {
      color: #666669;
      font-size: 12px;
    }
  }
  .tasks {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
  }
}

.help_icon {
  font-size: 16px !important;
  color: #b5bcc0 !important;
  border: none !important;
  outline: none !important;
}
.primaryBgColor {
  background-color: #4c8ce4;
}
@media (max-width: 575px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .graph_padding {
    padding-top: 0px;
  }
  .graph_legend_padding {
    padding-top: 10px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .graph_padding {
    padding-top: 50px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}

@media (min-width: 1200px) {
  .graph_padding {
    padding-top: 80px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}
.btn-skip-tutorial {
  //  width: 132px;
  height: 28px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #4c8ce3;
  background-color: #fff;
  border: none;
  margin-left: 37px;
  margin-top: 572px;
  position: absolute;
  z-index: 1002;
  margin-bottom: -21px;
}

.data-input-div {
  margin: 0 auto;
}

.input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.cancel-image {
  float: right;
  cursor: pointer;
}
.sftp-header1 {
  font-size: 16px;
  font-family: "RobotoMedium";
  color: "#4a4a4a";
}

.sftp-header2 {
  font-size: 14px;
  font-family: "RobotoRegular";
  color: "#666669";
}

.modal-dialog {
  max-width: 600px !important;
}

.continue-button {
  width: 60%;
  margin: 0 auto !important;
}

.continue-button button {
  width: 48%;
  margin-top: 30px;
  cursor: pointer;
}

.continue-transfer {
  width: 40%;
  margin: 0 auto !important;
}

.continue-transfer button {
  width: 100%;
  margin-top: 50px;
  cursor: pointer;
}
.disconnect {
  color: #f16559 !important;
  font-family: "RobotoRegular" !important;
  cursor: pointer;
}

.modify {
  color: #4c8ce4;
  cursor: pointer;
}

.connection-label {
  font-family: "RobotoBold";
  float: left;
  width: 33%;
}

.connection-content {
  width: 66%;
  float: left;
}

.transfer-on {
  background-color: #48bf7a !important;
}

.cancel_btn {
  background-color: #959fa4;
  color: #ffffff;
}

.text-font {
  font-size: 16px;
  font-family: "RobotoMedium";
}

.details-div ul {
  list-style-type: none;
  padding: 0;
}
.nav-bar .nav-link.active {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
  font-weight: bold;
}
.nav-bar .nav-link {
  margin-left: 35px !important;
  margin-right: 30px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #2d3752 !important;
}
.has-sidemenus {
  margin-left: 0px !important;
  margin-top: 0px !important;
  padding-top: 0px !important;
}
// Css for global element
.name {
  width: 259px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.content {
  width: 350px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 4px;
}
.box {
  width: 350px;
  height: 40px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  padding: 10px 8px;
}
.color-palette {
  width: 259px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.choose-a-primary-col {
  width: 145px;
  height: 15px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.rectangle-4 {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
  background-color: #ffffff;
  margin: 10px;
}
.choose-a-secondary-col {
  width: 162px;
  height: 16px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}

.box-color {
  width: 150px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  padding: 10px 8px;
}
.box {
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  width: 350px;
  height: 40px;
}
.logo-icon {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: 600;
  color: #666669;
  margin-bottom: 5px;
}
.rectangle-7 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  padding-bottom: 29px;
  border: none;
  margin-right: 7px;
}
.rectangle-79 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  border: none;
  // margin-right: 7px;
  margin-left: -40px;
}
.rectangle-9 {
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  padding-bottom: 29px;
  border: none;
  margin-left: 8px;
}
.rectangle-38 {
  width: 140px;
  height: 64px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -15px;
}
.upload-your-study-logo {
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.recommended-by {
  display: block;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 11px;
  color: #666669;
  margin-top: 4px;
}
.homepage-rectangle-footer {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 5px;
}
.box-btn-save {
  width: 120px;
  height: 36px;
  background-color: #48bf7a;
  border-radius: 25px;
}
.info-screen {
  width: 258.5px;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
// .upload-btn {
//   width: 38px;
//   height: 16px;
//   opacity: 0.6;
//   font-family: RobotoRegular;
//   font-size: 12px;
//   font-weight: bold;
//   font-stretch: normal;
//   font-style: normal;
//   line-height: 1.33;
//   letter-spacing: normal;
//   color: #666669;
//   padding: 21px 7px;
// }

.info-content {
  margin-left: 32px;
  margin-top: 32px;
}
.box-edit {
  // width: 1038px;
  // height: 90px;
  // border-radius: 3px;
  // border: solid 2px var(--brand-accent-2);
  width: 1038px;
  height: 90px;
  border-radius: 3px;
  background-color: #ffffff;
}

.lable-content {
  width: 398px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.box-content {
  width: 495.3px;
  height: 54px;
  border-radius: 3px;
  background-color: #ffffff;
}
.footer-content-box {
  height: 217px;
}

// homepage styling

.homepage-box {
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepahe-Rectangle-41 {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 20px 20px;
}
.homepage-content-additional-input {
  width: 1078px;
  border-radius: 3px;
  // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  border: solid 1px #d3dee3;
  width: 100%;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-content-additional {
  width: 100%;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-content-additional-body {
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  background-color: #ffffff;
  padding: 10px 8px;
}
.homepage-para {
  margin-bottom: 10px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #949496;
}
.homepage-para-body-content {
  margin-bottom: 10px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #949496;
}
.homepage-logo-icon {
  margin-top: 5px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  line-height: 2.29;
  color: #666669;
}
.homepage-rectangle-38 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -38px;
}
.homepage-rectangle-380 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
}
.header-body-content {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: 600;
  color: #666669;
}
.callout-section {
  width: 1090px;
}
.callout-title-para {
  width: 307px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
  margin-bottom: 4px;
}
.callout-body-input {
  width: 325px;
  height: 54px;
  border-radius: 3px;
  border: solid 2px #d3dee3;
}
.homepage-Rectangle-41 {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 15px 20px 20px;
}
.callout-copy-input {
  width: 325px;
  height: 90px;
  border-radius: 3px;
  border: solid 2px #d3dee3;
}

// read only section
.homepage-read-edit-body {
  font-size: 14px;
  width: 90%;
  word-break: break-word;
    text-align: justify;
}
.read-edit-btn {
  background-color: #fff !important;
  border: 2px solid #d3dfe4 !important;
  color: #4c8ce4;
  border-radius: 3px;
  width: 70px;
  height: 30px;
  display: inline-block;
  padding: 0;
}
.add-section-btn {
  background-color: #fff !important;
  border: 1px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  // width: 120px;
  height: 30px;
  display: inline-block;
  // padding-bottom: 27px;
  font-family: RobotoRegular;
  font-size: 12px;
  margin-top: 14px;
  margin-left: 28px;
}
// .upload-web {
//   width: 1090px;
// }
// .rectangle-footer-callout {
//   width: 1090px;
// }
.homepage-box-small {
  width: 100%;
}

.content-edit {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: normal;
  color: #666669;
  word-wrap: anywhere;
}
.content-body-edit {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}
.btn-edit-feature {
  width: 206px;
  height: 39px;
  background-color: #959fa4;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
  img {
    -webkit-filter: brightness(0) invert(1);
    filter: brightness(0) invert(1);
  }
}
.selected_icon_logo_image img {
  -webkit-filter: brightness(0) invert(1);
  filter: brightness(0) invert(1);
}
.callout-title-para-edit {
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #000000;
}
.color_grey {
  color: #b5bcc0 !important;
  // color: #838e93;
  font-weight: bold;
  font-size: 18px;
}
.color-grey {
  cursor: pointer;
  opacity: 0.6;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  line-height: 2.33;
  color: #666669;
}
.paginate {
  color: grey;
  font-size: 14px;
  background-color: white;
  margin: 0px 8px 0px 0px;
  padding: 8px 5px 8px 5px;
  display: inline-block;
  cursor: pointer;
}
.box-btn-next {
  width: 150px;
  height: 36px;
  background-color: #4c8ce4 !important;
  border-radius: 25px;
}
/deep/ .quill-editor {
  &.bg-white {
    position: relative;
    border-radius: 3px;
    border: solid 2px #d3dfe4;
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border-bottom: none;
        border-top: none;
        padding: 4px;
        float: right;
        border-left: none;
        z-index: 9;
        position: relative;
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
          margin-top: 8px;
          margin-right: 10px;
          .ql-active{
              -webkit-box-shadow: 0 2px 2px 0 #777778;
              box-shadow: 0 2px 2px 0 #777778;
          }
          button {
            height: 29px;
            padding: 4px 4px;
          }
          button:not(:last-child) {
            border-right: 1px solid #ccc;
          }
        }
        .ql-formats:last-child {
          border-right: 1px solid #ccc;
        }
        .ql-stroke {
          stroke: #ccc;
        }
        .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: #ccc;
        }
      }
    }
    .ql-container {
      font-family: RobotoRegular;
      font-weight: normal;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: auto;
        min-height: 54px;
      }
    }
  }
  &.instruction-screen {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        min-height: 170px;
      }
    }
  }
}
.file-input {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  width: 84%;
  height: 30px;
}
.file-input-callout-1 {
  position: absolute;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  margin-right: 88px;
  width: 100%;
}
.upload-and-save-btn-box {
  width: 250px;
}
.selectLibrary {
  border-radius: 3px;
  background-color: #d3dfe4;
  padding: 5px 10px;
  overflow: hidden;
  border: none;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
  width: 142px;
  display: inline-block;
}
.modal_header_color {
  color: #28406a;
}
.modal_desc {
  color: #535456;
}
.modal_custom {
  border-radius: 4px;
  padding: 16px;
}
.modal_content {
  color: #666769;
  font-weight: 500;
}
.modal_close_icon {
  cursor: pointer;
  font-size: 24px;
}
@media (min-width: 768px) {
  .modal-dialog {
    max-width: 600px;
    margin: 30px auto;
  }
}
.library_img_bg {
  display: -webkit-inline-box;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  max-width: 200px;
  max-height: 80px;
  min-height: 70px;
  width: 98%;
  padding: 10px;
  text-align: -webkit-center;
  .logo {
    width: auto;
    margin: auto;
    height: 45px;
  }
  .icon {
    max-width: 50px;
    max-height: 50px;
    margin: auto;
  }
}
.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: red;
  opacity: 1; /* Firefox */
}
textarea::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.additioanal_copy .quill-editor.bg-white {
  resize: both;
  overflow: auto;
}
/deep/ .quill-editor {
  &.bg-white {
    position: relative;
    border-top: 1px solid #ccc;
    .ql-toolbar {
      &.ql-snow {
        background: transparent;
        border: none;
        padding: 4px;
        float: right;
        border-left: none;
        z-index: 9;
        position: relative;
        .ql-formats {
          margin-right: 0px;
          border: 1px solid #ccc;
          border-radius: 2px;
          margin-top: 8px;
          margin-right: 10px;
          button {
            height: 29px;
            padding: 4px 4px;
          }
          button:not(:last-child) {
            border-right: 1px solid #ccc;
          }
        }
        .ql-formats:last-child {
          border-right: 1px solid #ccc;
        }
        .ql-stroke {
          stroke: #ccc;
        }
        .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: #ccc;
        }
      }
    }
    .ql-container {
      color: #000;
      font-family: RobotoRegular;
      font-weight: normal;
      border: none;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: auto;
        min-height: 54px;
      }
    }
  }
  &.instruction-screen1 {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        height: 170px !important;
      }
    }
  }
  &.instruction-screen {
    .ql-toolbar {
      &.ql-snow {
        .ql-formats {
          margin-top: 5px;
        }
      }
    }
    .ql-container {
      .ql-editor {
        min-height: 110px;
      }
    }
  }
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
}
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
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
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
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
.filds_section {
  border-radius: 8px;
  padding: 0 10px 10px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  min-height: 150px;
}
@media (max-width: 575px) {
  .switch {
    width: 50px;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(12px);
    -ms-transform: translateX(12px);
    transform: translateX(12px);
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 25px;
    width: 25px;
    left: 12px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
  }
  .check_icon {
    color: rgb(46, 204, 113);
    position: absolute;
    left: 28px;
    top: 8px;
    font-size: 18px;
    transition: 0.4s;
  }
}

.optionalField {
  height: 40px;
}
.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}
.form-control {
  border: solid 2px #d3dfe4 !important;
  height: 40px !important;
  color: #c5d1d6;
}
button {
  cursor: pointer;
  border: none !important;
  outline: 0px solid !important;
}

.passcode_icon {
  width: 15px;
  height: 15px;
}
button:focus {
  outline: 0px solid transparent;
}
.section_heading {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.field_row {
  padding: 10px 0px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.inactive {
  opacity: 0.5;
  pointer-events: none;
}
.header_text {
  color: #1d7fee;
  font-weight: bold;
  margin: 10px 0;
}
.labelText {
  width: 130px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.registeration_div div:nth-child(3) .labelText {
    padding-right: 16px;
}
.registeration_div div:nth-child(6) .labelText {
    padding-right: 10px;
}
input[type="checkbox"] {
  opacity: 0;
  box-sizing: border-box;
  padding: 0;
}
.registeration_div
  > div:nth-child(2n)
  .col-lg-6.col-md-6.col-sm-12.col-xs-12.pl-0.pr-0 {
  position: relative;
  right: -70px;
}
.registeration_div > div:nth-child(10) {
  display: none;
}
.registeration_div
  > div:nth-child(9)
  .col-lg-6.col-md-6.col-sm-12.col-xs-12.pl-0.pr-0 {
  margin-top: -50px;
}
.Gender-selection {
  font-weight: 600;
  font-size: 14px;
  margin-left: 5px;
  color: #949496;
  //opacity: 0.7;
}
.table-responsive {
  display: block;
  width: 100%;
  border: solid 1px #d3dee3;
  overflow-x: auto;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.table {
  margin-bottom: 0px;
}
tbody {
  background-color: white;
}
thead {
  background-color: #d3dee3;
}
.homepahe-Rectangle-41 .table th {
  padding: 2px 0.75rem;
  font-size: 14px;
  font-weight: 600;
  border-right: 2px solid #fff !important;
  text-align: center;
  border: none;
}
.Add-study-sec .table th:last-child {
  border-right: none !important;
}

.Add-study-sec .table td {
  padding: 1rem 0.75rem;
  vertical-align: top;
  border-top: none;
  text-align: center;
}
.Add-study-sec .table td:nth-child(2) {
  text-align: left;
}
/*Gender input type radio*/
.radio {
  margin: 0;
  input[type="radio"] {
    position: absolute;
    opacity: 0;
    z-index: 1;
    left: 3px;
    top: 5px;
    + .radio-label {
      &:before {
        content: '';
        background: #f4f4f4;
        border-radius: 100%;
        border: 1px solid darken(#f4f4f4, 25%);
        display: inline-block;
        width: 1.4em;
        height: 1.4em;
        position: relative;
        top: 0.1em;
        vertical-align: top;
        cursor: pointer;
        text-align: center;
        transition: all 250ms ease;
      }
    }
    &:checked {
      + .radio-label {
        &:before {
          background-color: #3197EE;
          box-shadow: inset 0 0 0 4px #f4f4f4;
        }
      }
    }
    &:focus {
      + .radio-label {
        &:before {
          outline: none;
          border-color: #3197EE;
        }
      }
    }
    &:disabled {
      + .radio-label {
        &:before {
          box-shadow: inset 0 0 0 4px #f4f4f4;
          border-color: darken(#f4f4f4, 25%);
          background: darken(#f4f4f4, 25%);
        }
      }
    }
    + .radio-label {
      &:empty {
        &:before {
          margin-right: 0;
        }
      }
    }
  }
}
/*Add site input checkbox*/
.control {
  font-size: 18px;
  position: relative;
  display: block;
  margin-bottom: 15px;
  padding-left: 30px;
}

.control input {
  position: absolute;
  z-index: 2;
  opacity: 0;
  left: 43%;
  top: 20px;
  cursor: pointer;
}

.control__indicator {
  position: absolute;
  top: 16px;
  left: 40%;
  width: 20px;
  height: 20px;
  background: #e6e6e6;
  border-radius: 3px;
}

.control--radio .control__indicator {
  border-radius: 50%;
}

.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  background: #ccc;
}

.control input:checked ~ .control__indicator {
  background: #4c8ce4;
}

.control:hover input:not([disabled]):checked ~ .control__indicator,
.control input:checked:focus ~ .control__indicator {
  background: #4c8ce4;
}

.control input:disabled ~ .control__indicator {
  pointer-events: none;
  opacity: 0.6;
  background: #e6e6e6;
}

.control__indicator:after {
  position: absolute;
  display: none;
  content: "";
}

.control input:checked ~ .control__indicator:after {
  display: block;
}

.control--checkbox .control__indicator:after {
  top: 1px;
  left: 8px;
  width: 6px;
  height: 13px;
  transform: rotate(45deg);
  border: solid #fff;
  border-width: 0 2px 2px 0;
}
.invitation {
  font-size: 14px;
  font-family: RobotoRegular;
  font-weight: bold;
}
.link {
  text-decoration: underline;
  color: #4c8ce4;
  background-color: #fff;
}

@media (min-width: 992px) and (max-width: 1199px){
.homepahe-Rectangle-41.Add-study-sec .container {
    width: auto;
}
.fw-500.labelText {
    padding-left: 20px !important;
    padding-right: 0px;
}
.registration_gender_ipadfix{
  padding-left: 0px !important;
}

}
@media (min-width: 1280px) and (max-width: 1420px) {
  .registeration_div > div:nth-child(2n) .col-lg-6.col-md-6.col-sm-12.col-xs-12.pl-0.pr-0 {
    right: 0px;
}
}
</style>
