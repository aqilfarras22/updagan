<template>
  <div>
    <div class="global" v-if="closeCarousel === true"></div>
    <div v-if="closeCarousel === true" class="container-carosel">
      <button v-on:click="closeTutorial(false)" class="btn-close-tutorial">CLOSE X</button>
      <button v-on:click="closeTutorial(false)" class="btn-skip-tutorial">Skip tutorial</button>
      <carousal />
    </div>
    <div class="row">
      <div
        class="Intro-copy"
      >First, setup the global elements for your website by completing the following.</div>
    </div>
    <div class="row">
      <h4 class="header">
        Header elements
        <span
          v-b-popover.hover="'Header Elements are what participants will see at the top of the page. You can customize what they see by adding a title, colors, and your study logo'"
          class="fa fa-info-circle color_grey"
        ></span>
      </h4>
    </div>
    <div v-if="showSaveHeader === true" class="Rectangle-41">
      <div class="row pt-10 ml-5">
        <div class="col-lg-5 pl-0 pr-50">
          <span class="name">Your site title</span>
          <input
            v-on:keyup="validAppName(true)"
            type="text"
            v-model="globalElements.siteTitle"
            name="study-name"
            class="box"
            placeholder="Enter name"
            required
          />
          <br />
          <span
            v-if="validAppNameValue === true && !globalElements.siteTitle"
            class="error-style"
          >*Site title is required.</span>
        </div>

        <div class="col-lg-7 p-0">
          <div class="color-palette p-0">Color palette</div>
          <div class="col-lg-5 p-0 color-palette-pri">
            <label class="choose-a-primary-col">Choose a primary color</label>
            <div class="row">
              <div class="dropdown pl-0">
                <div class="dropdown-toggle darkColorDiv" data-toggle="dropdown">
                  <div class="dropdown-menu color-picker-section" v-on:click.stop.prevent>
                    <sketch-picker v-model="darkColor"></sketch-picker>
                  </div>
                </div>
              </div>
              <div class="col-lg-8 col-md-12 p-0">
                <input
                  type="text"
                  v-on:keyup="verifyPrimaryColor(true)"
                  v-model="globalElements.primaryColor"
                  class="box-color"
                  placeholder="Enter hex value"
                  v-on:blur="changeColor('primary')"
                />
                <br />
                <span
                  v-if="validPrimaryColor === true && !globalElements.primaryColor"
                  class="error-style"
                >*Primary color is required.</span>
              </div>
            </div>
          </div>
          <!-- secondary color -->
          <div class="col-lg-5 p-0 color-palette-pri">
            <label class="choose-a-primary-col">Choose a secondary color</label>
            <div class="row">
              <div class="dropdown pl-0">
                <div class="dropdown-toggle lightColorDiv" data-toggle="dropdown"></div>
                <div class="dropdown-menu color-picker-section" v-on:click.stop.prevent>
                  <sketch-picker v-model="lightColor"></sketch-picker>
                </div>
              </div>
              <div class="col-lg-4 col-md-4 pl-0">
                <input
                  type="text"
                  v-on:keyup="verifySecondaryColor(true)"
                  v-model="globalElements.secondaryColor"
                  class="box-color"
                  placeholder="Enter hex value"
                  v-on:blur="changeColor('secondary')"
                />
                <br />
                <span
                  v-if="validSecondaryColor === true && !globalElements.secondaryColor"
                  class="error-style"
                >*Secondary color is required.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="row upload-web">
        <div class="col-lg-12 col-md-12 p-0">
          <div class="logo-icon mt-30">Study logo</div>
          <div class="col-lg-9 pl-0">
            <div class="row">
              <div class="col-lg-2 p-0">
                <span class="recommended-by">
                  Recommended 600px by 300px
                  Formats: .png, .jpeg, .svg
                </span>
                <div class="background-upload mt-10">
                <div class="rectangle-7">
                  Upload
                  <input
                    type="file"
                    class="file-input"
                    id="logo_upload"
                    accept="image/*"
                    v-on:change="uploadStudyLogo($event);return false;"
                  />
                </div>
              </div>
              </div>
              
              <div class="col-lg-4 rectangle-38 ml-40 text-center">
                <img class="img-responsive rectangle-3 pt-10" :src="studyLogoUrl" />
              </div>
            </div>
          </div>
          <div class="col-lg-3 text-right p-0">
            <button class="btn box-btn-save save_btn mt-65" v-on:click="saveHeader()">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- read only header ---------------- -->

    <div v-if="showSaveHeader === false" class="Rectangle-41">
      <div class="row mt-10">
        <div class="col-lg-4 col-md-4 pl-0">
          <label class="name">{{this.globalElements.siteTitle}}</label>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-lg-4 col-md-4 pl-0">
          <div class="color-palette pl-0">Color palette</div>

          <div class="col-lg-5 pr-12 mt-7 p-0 mr-12 color-palette-pri">
            <div class="row">
              <div class="dropdown pl-0">
                <div class="dropdown-toggle darkColorDiv updated-dark" data-toggle="dropdown">
                 <div class="dropdown-menu color-picker-section" v-on:click.stop.prevent style="visibility: hidden">
                    <!-- <sketch-picker v-model="darkColor"></sketch-picker> -->
                  </div>
                </div>
              </div>
              <!--<div class="col-lg-4 col-md-4 pl-0">
                                <input type="text" v-on:keyup="verifyPrimaryColor(true)"
                                 v-model="globalElements.header.primaryColor" class="box-color1" placeholder="Enter hex value" v-on:blur="changeColor('primary')" readonly>
                                 
              </div>-->
            </div>
          </div>
          <!-- secondary color -->
          <div class="col-lg-5 mt-7 p-0 color-palette-pri">
            <div class="row">
              <div class="dropdown pl-0">
                <div class="dropdown-toggle lightColorDiv updated-light" data-toggle="dropdown"></div>
               <div class="dropdown-menu color-picker-section" v-on:click.stop.prevent style="visibility: hidden">
                  <!-- <sketch-picker v-model="lightColor"></sketch-picker> -->
                </div>
              </div>
              <!--<div class="col-lg-4 col-md-4 pl-0">
                                <input type="text" v-on:keyup="verifySecondaryColor(true)"
                                 v-model="globalElements.header.secondaryColor" class="box-color1" placeholder="Enter hex value" v-on:blur="changeColor('secondary')" readonly>
                                 
              </div>-->
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3 p-0 mt-3">
              <label class="choose-a-primary-col mb-0">Primary</label>
              <label class="choose-a-primary-col">Secondary</label>
            </div>
            <div class="col-lg-2 p-0 mt-3 global-color-fix">
              <label class="choose-a-primary-col mb-0">{{globalElements.primaryColor}}</label>
              <label class="choose-a-primary-col">{{globalElements.secondaryColor}}</label>
            </div>
          </div>
          <!-- Footer Component -->


        </div>
        <div class="col-lg-8 col-md-8 p-0">
          <div class="logo-icon">Study logo</div>
          <div class="col-lg-7 col-md-7 mt-7 pl-0">
            <div class="col-lg-6 col-md-6 rectangle-38 pt-10 text-center">
              <img class="img-responsive rectangle-3 pt-10 text-center" :src="studyLogoUrl" />
            </div>
          </div>
          <div class="col-lg-5 col-md-5 p-0 text-right">
            <button
              class="btn box-btn-save mt-80 read-edit-btn studdy-logo save_btn"
              v-on:click="editHeader()"
            >Edit</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer Component -->

    <h4 class="header pt-30">
      Footer elements
      <span
        v-b-popover.hover="'Footer Elements are what participants will see at the bottom of the page. This is where you can add a sponsor logo (optional), privacy policy, and license agreement.'"
        class="fa fa-info-circle color_grey"
      ></span>
    </h4>
    <div v-if="showSaveFooter===true" class="rectangle-footer mt-33">
      <div class="row upload-web">
        <div class="col-lg-12 col-md-12 p-0">
          <div class="logo-icon">Sponsor logo(s)</div>
          <div v-if="hideUploadOption===true" class="col-lg-7 col-md-7 pl-0">
            <div class="row">
            <div class="col-lg-3 mr-10 pl-0">
              <span class="upload-your-sponsor-logo">Upload your sponsor logo</span>
              <br />
              <span class="recommended-by">
                Recommended 600px by 300px
                Formats: .png, .jpeg, .svg
              </span>
            </div>

            <div class="col-lg-2 pl-12">
              <button class="rectangle-7">
                <input
                  type="file"
                  class="file-input"
                  id="sponsor_logo_upload"
                  accept="image/*"
                  v-on:change="uploadSponsorLogo($event);return false;"
                />
                Upload
              </button>
            </div>
            <div class="col-lg-4 ml-4 pl-0 rectangle-38">
              <img class="img-responsive rectangle-3 pt-10 text-center" :src="sponsorLogo" />
            </div>
            <div class="col-lg-2 mt-70 pl-10">
              <button class="addLogo" v-on:click="addLogo()">Add another logo</button>
            </div>
            </div>
          </div>
          <div v-if="sponsorLogos">
            <div
              v-for="(logo, index) in sponsorLogos"
              :key="logo.image_id"
              class="col-lg-3 pl-0 mt-8"
            >
              <div class="rectangle-33 pt-10 text-center">
                <img class="img-responsive rectangle-3 pt-10 text-center" :src="responseUrl+logo" />
                <button
                  class="btn btn-link color_red pl-0 btn-remove"
                  v-on:click="removeSponsorLogo(index+1)"
                >
                  <img src="static/img/delete.svg" />
                </button>
              </div>
            </div>
            <div class="row upload-web mt-10" v-if="showAddLogo===true">
              <div class="col-lg-7 col-md-7 pl-0 mt-30">
                <div class="col-lg-3 col-md-3 mr-10 pl-0">
                  <span class="upload-your-sponsor-logo">Upload your sponsor logo</span>
                  <br />
                  <span class="recommended-by">
                    Recommended 600px by 300px
                    Formats: .png, .jpeg, .svg
                  </span>
                  <div class="pl-0 mt-7">
                    <button class="rectangle-7">
                      <input
                        type="file"
                        class="another-file-input"
                        id="sponsor_logo_upload"
                        accept="image/*"
                        v-on:change="uploadSponsorLogo($event);return false;"
                      />
                      Upload
                    </button>
                  </div>
                </div>

                <div class="col-lg-4 col-md-4 ml-4 ml-23 rectangle-33 ipadfix pt-10 text-center">
                  <img class="img-responsive rectangle-3 pt-10 text-center" />
                </div>
              </div>
            </div>
            <div class="row pl-10">
              <div v-if="hideUploadOption===false" class="col-lg-1 col-md-1 mt-5">
                <button class="additionLogo" v-on:click="addLogo()">Add another logo</button>
              </div>
            </div>
          </div>
          <!--<div class="col-lg-12 col-md-12 p-0 text-right" v-if="showAddLogo===false">
                              
                                      <button class="btn box-btn-save btn-successsave_btn" v-on:click="saveFooter()">Save</button>
          </div>-->
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12 pl-0 pr-0 mt-20">
          <div class="logo-icon additioanal_copy">
            <span class="edit-mode">Sponsor Information</span>
            <quill-editor
              class="instruction-screen bg-white"
              v-model="globalElements.sponsorInformation"
              :options="editorOptionForsponsorInformation"
            ></quill-editor>
          </div>
          <div class="mt-15 text-right">
            <button class="btn box-btn-save save_btn" v-on:click="saveFooter()">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Read only footer component ---------------- -->

    <div v-if="showSaveFooter===false" class="rectangle-footer mt-33">
      <div class="row upload-web">
        <div class="logo-icon col-md-12 mt-5 p-0">Sponsor logo(s)</div>
        <div class="row Sponsorlogo-sec">
        <div class="col-lg-10 col-md-12 p-0">
          <div v-for="logo in sponsorLogos" :key="logo" class="col-lg-3 col-md-3 pl-0 mt-8">
            <div class="pl-0 rectangle-33 pt-10 text-center">
              <img class="img-responsive rectangle-3 pt-10 text-center" :src="logo" />
            </div>
          </div>
        </div>
       
        </div>
        <div class="row edit-tittle-font pl-0 pb-0">
          <div class="col-md-12 p-0 edit-mode">Sponsor Information</div>
            <div class="col-lg-9 p-0 instruction_title" v-html="globalElements.sponsorInformation"></div>
             <div class="col-lg-3 p-0 text-right">
          <button class="btn box-btn-save read-edit-btn ml-25 save_btn Sponsor_logo_edit" v-on:click="editFooter()">Edit</button>
        </div>
        </div>
        
      </div>
    </div>
    <!-- Content for Privacy policy.-------------- -->

    <div v-if="showSavePrivacy===true" class="info-content">
      <h4 class="info-screen">Content for footer pages</h4>
      <h5 class="add-a-screen-in">
        Add in the content for your privacy policy and terms of use.
        <span
          v-b-popover.hover="'Enter text for your privacy policy and license agreement. Both fields are required and will display as a link in the footer. Text formatting is available, including using URLs, which will display as hyperlinks'"
          class="fa fa-info-circle color_grey ml-4"
        ></span>
      </h5>
      <div class="add-screen-content mt-10">
        <div class="row">
          <div class="col-lg-12 col-md-12 footer-content-box">
            <div class="logo-icon additioanal_copy">
              <span class="edit-mode">Privacy policy</span>

              <quill-editor
                class="instruction-screen bg-white"
                v-model="globalElements.privacyPolicyContent"
                :options="editorOptionForimageCaptureTitleHeadline"
              ></quill-editor>
            </div>
            <div class="mt-15 text-right">
              <button class="btn box-btn-save save_btn" v-on:click="savePrivacyPolicy(true)">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content for read only  Privacy policy.-------------- -->

    <div v-if="showSavePrivacy===false" class="info-content">
      <h4 class="info-screen">Content for footer pages</h4>
      <h5 class="add-a-screen-in">
        Add in the content for your privacy policy and terms of use.
        <span
          v-b-popover.hover="'Enter text for your privacy policy and license agreement. Both fields are required and will display as a link in the footer. Text formatting is available, including using URLs, which will display as hyperlinks'"
          class="fa fa-info-circle color_grey ml-4"
        ></span>
      </h5>
      <div class="add-screen-content mt-10">
        <div class="row">
          <div class="col-lg-12 col-md-12 pl-0 footer-content-box">
            <div class="edit-tittle-font pl-20">
              <span class="edit-mode">Privacy policy</span>
              <br />

              <div class="instruction_title" v-html="globalElements.privacyPolicyContent"></div>
            </div>
            <div class="pl-0 text-right">
              <button
                class="btn box-btn-save read-edit-btn save_btn"
                v-on:click="editPrivacyPolicy()"
              >Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    lisc and agreement save -->

    <div v-if="showSaveLicense===true" class="info-content">
      <div class="add-screen-content mt-10">
        <div class="row">
          <div class="col-lg-12 col-md-12 footer-content-box">
            <div class="logo-icon additioanal_copy">
              <span class="edit-mode">License agreement</span>

              <quill-editor
                class="instruction-screen bg-white"
                v-model="globalElements.licenseAgreementContent"
                :options="editorOptionForimageCaptureTitleLicense"
              ></quill-editor>
            </div>
            <div class="pl-0 mt-15 text-right">
              <button class="btn box-btn-save save_btn" v-on:click="saveLicense()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- License agreement edit only  -->

    <div v-if="showSaveLicense===false" class="info-content">
      <div class="add-screen-content mt-10">
        <div class="row">
          <div class="col-lg-12 col-md-12 pl-0 footer-content-box">
            <div class="edit-tittle-font pl-20">
              <span class="edit-mode">License agreement</span>
              <div class="instruction_title" v-html="globalElements.licenseAgreementContent"></div>
              <!-- <label>{{globalElements.license.licenseAgreement}}</label> -->
            </div>
            <div class="pl-0 text-right">
              <button
                class="btn box-btn-save read-edit-btn save_btn"
                v-on:click="editLicense()"
              >Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ------------  contact information -------------- -->

    <div v-if="showSaveContact===true" class="info-content">
      <div class="contact-info-content pt-10 pl-5 mt-10">
        <div class="row">
          <div class="logo-icon-contact ml-15 mt-10">
            <span class="edit-mode">Contact Information</span>
          </div>
        </div>
        <div class="row ml-20 mt-10">
          <div class="col-lg-6 col-md-6">
            <div class="lable-content">Facility name</div>

            <input
              type="text"
              v-model="globalElements.facilityName"
              class="box-content"
              placeholder="Name of the site or facility to contact"
              required
            />
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="lable-content">Contact name</div>
            <input
              type="text"
              v-model="globalElements.contactName"
              class="box-content"
              placeholder="Name of primary contact"
              required
            />
          </div>
        </div>
        <div class="row ml-20 mt-25">
          <div class="col-lg-6 col-md-6">
            <div class="lable-content">Email</div>
            <input
              type="email"
              v-on:keyup="verifyEnteredEmail()"
              v-model="globalElements.contactEmail"
              class="box-content"
              placeholder="Enter contact email"
              required
            />
            <span v-if="validTestEmail===false" class="error-style">*Invalid email address</span>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="lable-content">Phone number</div>
            <input
              type="text"
              v-model="globalElements.contactPhoneNumber"
              class="box-content"
              placeholder="(     )"
              required
            />
          </div>
        </div>
        <div class="row ml-20 mt-25">
          <div class="col-lg-6 col-md-6">
            <div class="lable-content">Fax number</div>
            <input
              type="text"
              v-model="globalElements.contactFaxNumber"
              class="box-content"
              placeholder="(     )"
              required
            />
          </div>
          <div class="col-lg-6 col-md-6 pl-0 mt-65 text-right">
            <button
              class="btn box-btn-save save_btn mr-5 mb-20"
              v-on:click="saveContactInfo()"
            >Save</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>

    <div v-if="showSaveContact===false" class="info-content">
      <div class="contact-info-content mt-10">
        <div class="row">
          <div class="edit-tittle-font ml-20">
            <span class="edit-mode">Contact Information</span>
          </div>
        </div>
        <div class="row ml-20">
          <div class="col-lg-5 col-md-5 ml-20 pl-0">
            <div class="color-palette">{{globalElements.facilityName}}</div>
          </div>
          <div class="col-lg-5 col-md-5 ml-20 pl-0">
            <div class="color-palette">{{globalElements.contactName}}</div>
          </div>
        </div>
        <div class="row mt-25">
          <div class="col-lg-5 col-md-5 ml-20 pl-0">
            <div class="edit-mode">Email</div>
            <div class="color-palette">{{globalElements.contactEmail}}</div>
          </div>
          <div class="col-lg-5 col-md-5 ml-20 pl-0">
            <div class="edit-mode">Phone Number</div>
            <div class="color-palette">{{globalElements.contactPhoneNumber}}</div>
          </div>
        </div>
        <div class="row ml-20 mt-25">
          <div class="col-lg-6 col-md-6 pl-20">
            <div class="edit-mode">Fax</div>
            <div class="color-palette">{{globalElements.contactFaxNumber}}</div>
          </div>
          <div class="col-lg-6 col-md-6 pr-20 text-right">
            <button
              class="btn box-btn-save read-edit-btn mt-10 save_btn mb-20"
              v-on:click="editContactInfo()"
            >Edit</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
    <div v-if="showSaveFooterCopyright===true" class="info-content">
      <div class="add-screen-content mt-10">
        <div class="row">
          <div class="col-lg-12 col-md-12 footer-content-box">
            <div class="logo-icon additioanal_copy mt-5">
              <span class="edit-mode">Footer Copyright</span>

              <quill-editor
                class="instruction-screen bg-white"
                v-model="globalElements.footerCopyright"
                :options="editorOptionForfooterCopyright"
              ></quill-editor>
            </div>
            <div class="pl-0 mt-15 text-right">
              <button class="btn box-btn-save save_btn" v-on:click="saveFooterCopyright()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSaveFooterCopyright===false" class="info-content">
      <div class="add-screen-content mt-10">
        <div class="row">
          <div class="col-lg-12 col-md-12 pl-0 footer-content-box">
            <div class="edit-tittle-font pl-20">
              <span class="edit-mode">Footer Copyright</span>
              <div class="instruction_title mt-10" v-html="globalElements.footerCopyright"></div>
            </div>
            <div class="pl-0 text-right">
              <button
                class="btn box-btn-save read-edit-btn save_btn"
                v-on:click="editFooterCopyright()"
              >Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pl-0 mt-35 text-right">
      <button class="btn box-btn-next save_btn mb-40" v-on:click="screenNext()">Next</button>
    </div>
  </div>
</template>

<script>
import carousal from "./carousal-component";
import ImageToBase64 from "image-to-base64";
import Papa from "papaparse";
import FileSaver from "file-saver";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import { AclRule } from "vue-acl";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import { mapGetters } from "vuex";
import moment from "moment";
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
import { Sketch } from "vue-color";
import toastr from "toastr";

let dynamicInputID = 0;
export default {
  name: "Participants",
  components: { carousal, mainHeader, sideMenu, "sketch-picker": Sketch },
  props: {
    studyData: Object
  },
  data() {
    return {
      createMode: true,
      responseUrl: "",
      hideUploadOption: true,
      closeCarousel: false,
      showAddLogo: false,
      fileImage: "",
      validTestEmail: true,
      file: "",
      showSaveFooterCopyright: true,
      showSaveContact: true,
      showSaveHeader: true,
      showSaveFooter: true,
      showSavePrivacy: true,
      showSaveLicense: true,
      validAppNameValue: false,
      validPrimaryColor: false,
      validSecondaryColor: false,
      lightColor: { hex: "#FFFFFF" },
      darkColor: { hex: "#FFFFFF" },
      globalElements: {
        created_by: "",
        created_time: "",
        modified_by: "",
        modified_time: "",
        siteTitle: "",
        primaryColor: "",
        secondaryColor: "",
        sponsorInformation: "",
        privacyPolicyContent: "",
        licenseAgreementContent: "",
        facilityName: "",
        contactName: "",
        contactEmail: "",
        contactPhoneNumber: "",
        contactFaxNumber: "",
        footerCopyright: ""
      },
      imagesData:"",
      sponserStatus : '',
      sponserDeleteImage:'',
      studyLogoUrl: "",
      sponsorLogo: "",
      sponsorLogos: [],
      editorOptionForsponsorInformation: {
        placeholder: "Enter content for your sponsor information",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleHeadline: {
        placeholder: "Enter content for your privacy policy",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleLicense: {
        placeholder: "Enter content for your license agreement",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForfooterCopyright: {
        placeholder: "Enter content for your copyright information",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      }
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    userToken() {
      return this.token;
    },
    studyId() {
      return this.$route.params.studyId;
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
    studyData(newData, oldData) {
      if (newData.countryList) {
        this.studyData.countryList = sortBy(newData.countryList, "sortOrder");
      }
    },
    lightColor: {
      handler(val) {
        this.changeSecondaryColor(val);
      }
    },
    darkColor: {
      handler(val) {
        this.changePrimaryColor(val);
      }
    }
  },
  methods: {
    closeTutorial(val) {
      this.closeCarousel = val;
    },
    verifyEnteredEmail() {
      var ab = this.globalElements.contactEmail;
      var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      this.validTestEmail = emailPattern.test(ab);
    },
    getGlobalElements() {
      this.$api
        .getParticipantWebGlobalElements(this.$route.params.studyId)
        .then(response => {
          if (response && response.data.data) {
            this.createMode = false;
            this.globalElements = response.data.data;
            this.studyLogoUrl = response.data.data.studyLogoUrl;
            this.sponsorLogos = response.data.data.sponsorLogoUrl;
            if (response.data.data.siteTitle) {
              this.showSaveHeader = false;
            }
            if (response.data.data.privacyPolicyContent) {
              this.showSavePrivacy = false;
            }
            if (response.data.data.facilityName) {
              this.showSaveContact = false;
            }
            if (response.data.data.licenseAgreementContent) {
              this.showSaveLicense = false;
            }
            if (response.data.data.sponsorLogoUrl) {
              if(this.sponserStatus == "Success"){
                this.showSaveFooter = false;
              }else{
                if(this.imagesData || this.sponserDeleteImage == "200" ){
                this.showSaveFooter = true;
                this.hideUploadOption = false;
                this.showAddLogo = false;
                }else{
                 this.showSaveFooter = false;
                }
              }
            }
            
            if (response.data.data.footerCopyright) {
              this.showSaveFooterCopyright = false;
            }

            this.darkColor = {};
            this.lightColor = {};
            setTimeout(
              g => {
                this.darkColor.hex = g.primaryColor;
                this.lightColor.hex = g.secondaryColor;
                this.changePrimaryColor(this.darkColor, true);
                this.changeSecondaryColor(this.lightColor, true);
              },
              10,
              this.globalElements
            );
          }
        })
        .catch(err => {
          throw err;
        });
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = e => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(fileObject);
    },
    uploadSponsorLogo(event) {
      this.imagesData = event.target.files[0];
      const selectedImage = event.target.files[0];
      const reader = new FileReader();
      var img = this.image;
      reader.readAsDataURL(selectedImage);
      const input = window.document.getElementById("sponsor_logo_upload");
      if (input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error(
          "Uploaded image format not supported. Please upload a PNG,JPEG,OR SVG file."
        );
        event.target.value = null;
        return;
      }
      reader.onload = e => {
        this.fileImage = {
          fileName: selectedImage.name,
          contentType: selectedImage.type,
          base64Code: e.target.result.split(",")[1]
        };
        if (this.$route.params.studyId) {
          this.$api
            .uploadSponsorLogo(this.$route.params.studyId, this.fileImage)
            .then(response => {
              if (response) {
                this.sponsorLogo = response.data.data;
                toastr.success("Sponsor Logo uploaded successfully");
                this.showSaveFooter = true;
                this.getGlobalElements();
              }
            })
            .catch(err => {
              throw err;
            });
        }
      };
      
    },
    validateImage(image) {
      var isValid = image.name.match(/.(png|jpg|svg)$/i);
      return isValid;
    },
    uploadStudyLogo(event) {
      const selectedImage = event.target.files[0];
      const input = window.document.getElementById("logo_upload");
      if (input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error(
          "Uploaded image format not supported. Please upload a PNG,JPEG,OR SVG file."
        );
        event.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        this.file = {
          fileName: input.files[0].name,
          contentType: input.files[0].type,
          base64Code: e.target.result.split(",")[1]
        };
        if (this.$route.params.studyId) {
          this.$api
            .uploadStudyLogo(this.$route.params.studyId, this.file)
            .then(response => {
              if (response) {
                this.studyLogoUrl = response.data.data;
                toastr.success("Study Logo uploaded successfully");
              }
            })
            .catch(err => {
              throw err;
            });
        }
      };
      var img = this.image;
      reader.readAsDataURL(selectedImage);
    },
    screenNext() {
      this.$router.push({
        name: "homepage",
        params: {
          studyId: this.studyId
        }
      });
    },
    validAppName(appNameVal) {
      this.validAppNameValue = appNameVal;
    },
    verifyPrimaryColor(primaryCol) {
      this.validPrimaryColor = primaryCol;
    },
    verifySecondaryColor(secondaryColor) {
      this.validSecondaryColor = secondaryColor;
    },
    saveHeader() {
      if (!this.globalElements.siteTitle || this.globalElements.siteTitle.trim().length === 0) {
        toastr.error("Site Title is required");
        return;
      }
      if (!this.studyLogoUrl) {
        toastr.error("Study logo is required.");
        return;
      }
      if (!this.globalElements.primaryColor) {
        toastr.error("Primary color is required");
        return;
      }
      if (!/(^#[0-9A-F]{6}$)/i.test(this.globalElements.primaryColor)) {
        toastr.error("Invalid color");
        return;
      }
      if (!this.globalElements.secondaryColor) {
        toastr.error("Secondary color is required");
        return;
      }
      if (!/(^#[0-9A-F]{6}$)/i.test(this.globalElements.secondaryColor)) {
        toastr.error("Invalid color");
        return;
      }
      
      if (this.$route.params.studyId) {
        this.globalElements.primaryColor = this.darkColor.hex;
        this.globalElements.secondaryColor = this.lightColor.hex;
        if (this.createMode === true) {
          this.globalElements.created_by = this.user.id;
          this.globalElements.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.globalElements.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.globalElements.modified_by = this.user.id;
        }
        this.$api
          .createParticipantWebGlobalElements(
            this.$route.params.studyId,
            this.globalElements
          )
          .then(response => {
            if (response) {
              this.getGlobalElements();
              toastr.success("Header saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSaveHeader = false;
      setTimeout(
        g => {
          this.darkColor.hex = g.primaryColor;
          this.lightColor.hex = g.secondaryColor;
          this.changePrimaryColor(this.darkColor);
          this.changeSecondaryColor(this.lightColor);
        },
        10,
        this.globalElements
      );
    },
    editHeader() {
      this.showSaveHeader = true;
      setTimeout(
        g => {
          this.darkColor.hex = g.primaryColor;
          this.lightColor.hex = g.secondaryColor;
          this.changePrimaryColor(this.darkColor);
          this.changeSecondaryColor(this.lightColor);
        },
        10,
        this.globalElements
      );
    },
    removeSponsorLogo(id) {
      if (this.$route.params.studyId) {
        var image_Id = {
          imageId: id
        };
        this.$api
          .deleteSponsorLogo(this.$route.params.studyId, image_Id)
          .then(response => {
            if (response) {
              this.sponserDeleteImage = response.data.statusCode;
              toastr.success("Logo deleted successfully");
              this.showSaveFooter = true;
              this.getGlobalElements();
            }
          })
          .catch(err => {
            this.showSaveFooter = true;
            throw err;
          });
      }
    },
    saveContactInfo() {
       if(this.globalElements.facilityName && this.globalElements.facilityName.length !==0 && this.globalElements.facilityName.trim().length === 0){
        toastr.error("Facility name is required")
        return;
      }else if(this.globalElements.contactName && this.globalElements.contactName.length !==0 && this.globalElements.contactName.trim().length === 0){
        toastr.error("Contact name is required")
        return;
      }else if(this.globalElements.contactEmail && this.globalElements.contactEmail.trim().length === 0){
       toastr.error("Email is required")
        return;
      }else if(this.globalElements.contactPhoneNumber && this.globalElements.contactPhoneNumber.length !==0 && this.globalElements.contactPhoneNumber.trim().length === 0){
        toastr.error("Phone number is required")
         return;
      }else if(this.globalElements.contactFaxNumber &&this.globalElements.contactFaxNumber.length !==0 && this.globalElements.contactFaxNumber.trim().length === 0){
        toastr.error("Fax number is required")
         return;
      }

      if (this.$route.params.studyId && this.globalElements.facilityName) {
        this.globalElements.primaryColor = this.darkColor.hex;
        this.globalElements.secondaryColor = this.lightColor.hex;
        if (this.createMode === true) {
          this.globalElements.created_by = this.user.id;
          this.globalElements.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.globalElements.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.globalElements.modified_by = this.user.id;
        }
        this.$api
          .createParticipantWebGlobalElements(
            this.$route.params.studyId,
            this.globalElements
          )
          .then(response => {
            if (response) {
              this.getGlobalElements();
              toastr.success("Contact information saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      } else {
      }
      this.showSaveContact = false;
    },
    editContactInfo() {
      this.showSaveContact = true;
    },
    addLogo() {
      this.showAddLogo = true;
    },
    saveFooter() {
        if (!this.globalElements.sponsorInformation || this.globalElements.sponsorInformation.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Sponsor Information is required");
        return;
      }
      if (this.$route.params.studyId) {
        this.globalElements.primaryColor = this.darkColor.hex;
        this.globalElements.secondaryColor = this.lightColor.hex;
        if (this.createMode === true) {
          this.globalElements.created_by = this.user.id;
          this.globalElements.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.globalElements.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.globalElements.modified_by = this.user.id;
        }
        this.$api
          .createParticipantWebGlobalElements(
            this.$route.params.studyId,
            this.globalElements
          )
          .then(response => {
            if (response) {
              this.sponserStatus = response.data.status;
              this.getGlobalElements();
              toastr.success("Sponsor information saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSaveFooter = false;
      
    },
    editFooter() {
      this.showSaveFooter = true;
      if (this.sponsorLogos) {
        this.hideUploadOption = false;
      }
    },
    editFooterCopyright() {
      this.showSaveFooterCopyright = true;
    },
    saveFooterCopyright() {
      if (!this.globalElements.footerCopyright || this.globalElements.footerCopyright.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Copyright information is required.");
        return;
      }
      if (this.$route.params.studyId) {
        this.globalElements.primaryColor = this.darkColor.hex;
        this.globalElements.secondaryColor = this.lightColor.hex;
        if (this.createMode === true) {
          this.globalElements.created_by = this.user.id;
          this.globalElements.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.globalElements.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.globalElements.modified_by = this.user.id;
        }
        this.$api
          .createParticipantWebGlobalElements(
            this.$route.params.studyId,
            this.globalElements
          )
          .then(response => {
            if (response) {
              this.getGlobalElements();
              toastr.success("Copyright information saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSaveFooterCopyright = false;
    },
    saveLicense() {
      if (!this.globalElements.licenseAgreementContent || this.globalElements.licenseAgreementContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("License Agreement is required");
        return;
      }
      if (this.$route.params.studyId) {
        this.globalElements.primaryColor = this.darkColor.hex;
        this.globalElements.secondaryColor = this.lightColor.hex;
        if (this.createMode === true) {
          this.globalElements.created_by = this.user.id;
          this.globalElements.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.globalElements.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.globalElements.modified_by = this.user.id;
        }
        this.$api
          .createParticipantWebGlobalElements(
            this.$route.params.studyId,
            this.globalElements
          )
          .then(response => {
            if (response) {
              this.getGlobalElements();
              toastr.success("License agreement saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSaveLicense = false;
    },
    editLicense() {
      this.showSaveLicense = true;
    },
    savePrivacyPolicy(val) {
      if (!this.globalElements.privacyPolicyContent || this.globalElements.privacyPolicyContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Privacy Policy is required");
        return;
      }
      if (this.$route.params.studyId) {
        this.globalElements.primaryColor = this.darkColor.hex;
        this.globalElements.secondaryColor = this.lightColor.hex;
        if (this.createMode === true) {
          this.globalElements.created_by = this.user.id;
          this.globalElements.created_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          this.globalElements.modified_time = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.globalElements.modified_by = this.user.id;
        }
        this.$api
          .createParticipantWebGlobalElements(
            this.$route.params.studyId,
            this.globalElements
          )
          .then(response => {
            if (response) {
              this.getGlobalElements();
              toastr.success("Privacy Policy saved successfully");
            }
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSavePrivacy = false;
    },
    editPrivacyPolicy() {
      this.showSavePrivacy = true;
    },

    changeColor(type) {
      if (type === "primary") {
        if (/(^#[0-9A-F]{6}$)/i.test(this.globalElements.primaryColor)) {
          this.darkColor.hex = this.globalElements.primaryColor;
          window
            .$(".darkColorDiv")
            .css("background-color", this.globalElements.primaryColor);
        } else {
          toastr.error("Invalid color");
          return;
        }
      } else if (type === "secondary") {
        if (/(^#[0-9A-F]{6}$)/i.test(this.globalElements.secondaryColor)) {
          this.lightColor.hex = this.globalElements.secondaryColor;
          window
            .$(".lightColorDiv")
            .css("background-color", this.globalElements.secondaryColor);
        } else {
          toastr.error("Invalid color");
          return;
        }
      }
    },

    changePrimaryColor(val, ignore) {
      this.darkColor = val;
      if (ignore == undefined && val.hex != undefined) {
        this.globalElements.primaryColor = val.hex;
      }
      window.$(".darkColorDiv").css("background-color", this.darkColor.hex);
    },
    changeSecondaryColor(val, ignore) {
      this.lightColor = val;
      if (ignore == undefined && val.hex != undefined) {
        this.globalElements.secondaryColor = val.hex;
      }
      window.$(".lightColorDiv").css("background-color", this.lightColor.hex);
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.getGlobalElements();
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed) Added CSS Hack for EDGE only for big screens above 1200px

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

.row {
  clear: both;
}
.launch_status_section {
  background-color: #2d3752;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 21px;
  margin-bottom: 20px;
  font-size: 18px;
}

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
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 0px 20px 20px;
}
.header {
  height: 32px;
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: normal;
  color: #666669;
  margin-top: 0px;
  margin-bottom: 6px;
}
.Intro-copy {
  width: auto;
  height: 40px !important;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #666669;
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
  height: 12px;
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
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}
.primaryBgColor {
  background-color: #4c8ce4;
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
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}
.box {
  font-size: 14px;
  font-family: RobotoRegular;
  width: 100%;
  height: 40px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  padding: 8px 15px;
  margin-top: 27px;
}
.color-palette {
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
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  color: #666669;
}
.rectangle-4 {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
  background-color: #ffffff;
  margin: 10px;
  margin-top: 4px;
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
  margin-bottom: 5px;
}
.box-color {
  font-size: 14px;
  font-family: RobotoRegular;
  width: 150px;
  height: 40px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  padding: 10px 8px;
}
.box {
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  height: 40px;
}
.logo-icon {
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  color: #666669;
}
.logo-icon-contact {
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #666669;
}

.rectangle-7 {
  width: 80px;
  height: 30px;
  font-family: RobotoRegular;
  border-radius: 3px;
  background-color: #d3dee3;
  border: none;
  color: #aaaab0;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  text-align: center;
line-height: 28px;
float: left;
}
.rectangle-3 {
  width: auto;
  height: 100%;
  max-height: 80px;
}
.rectangle-33 {
  width: 181px;
  height: 102px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
}
.rectangle-38 {
  width: 181px;
  height: 102px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  // opacity: 0;
}
.upload-your-study-logo {
  width: 146px;
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
  margin-bottom: 2px;
}
.upload-your-sponsor-logo {
  width: 162px;
  position: absolute;
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
  margin-bottom: 2px;
}
.recommended-by {
  display: block;
  width: 156px;
  height: 32px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 11px;
  line-height: 1.45;
  letter-spacing: normal;
  color: #666669;
}
.rectangle-footer {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
  padding: 5px 20px 20px;
}
.box-btn-save {
  width: 120px;
  color: white;
  height: 36px;
  background-color: #48bf7a;
  font-family: RobotoRegular;
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
.upload-btn {
  width: 60px;
  display: inline-block;
  height: 16px;
  opacity: 0.6;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #666669;
  /* padding: 21px 7px; */
  /* text-align: center; */
  /* padding-bottom: 16px; */
  margin-bottom: 5px;
}
.add-a-screen-in {
  // width: 366px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #949496;
}
.add-screen-content {
  height: auto;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
}
.contact-info-content {
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  background-color: #f5f8fa;
}
.info-content {
  margin-top: 32px;
}
.box-edit {
  width: 1038px;
  height: 90px;
  border-radius: 3px;
  background-color: #ffffff;
}
.privacy-content {
  width: 1020px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #c5d1d6;
  height: 90px;
  padding-bottom: 60px;
  padding-top: 10px;
  padding-left: 8px;
}

.lable-content {
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
.box-content {
  font-size: 14px;
  font-family: RobotoRegular;
  width: 98%;
  height: 54px;
  border-radius: 3px;
  background-color: #ffffff;
  padding: 15px 13px;
  border-radius: 3px;
  border: solid 1px #d3dee3;
}
.footer-content-box {
  height: auto;
  padding: 5px 20px 20px;
}
//  global element styles
.color-picker-section {
  top: -200px;
}
.dropdown-toggle.darkColorDiv,
.dropdown-toggle.lightColorDiv {
  text-align: center;
  &:after {
    display: none;
  }
}
.darkColorDiv {
  border: 1px solid #c5d0d5;
  background-color: #fff;
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 3px;
  &.updated-dark {
    width: 138px !important;
    height: 50px;
  }
}
.lightColorDiv {
  border: 1px solid #c5d0d5;
  background-color: #fff;
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 3px;
  &.updated-light {
    height: 50px;
    width: 50px;
  }
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
  width: 150px;
  display: inline-block;
}
.color_grey {
  color: #b5bcc0 !important;
  // color: #838e93;
  font-weight: bold;
  font-size: 18px;
}
.color-grey {
  width: 60px;
  font-family: RobotoRegular;
  display: inline-block;
  height: 16px;
  opacity: 0.6;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #666669;
  cursor: pointer;
}
.file-input {
position: absolute;
top: 0px;
right: 0px;
margin: 0;
padding: 0;
font-size: 20px;
cursor: pointer;
opacity: 0;
width: 100%;
height: 30px;
}
.box-btn-next {
  width: 150px;
  height: 36px;
  color: #fff;
  background-color: #4c8ce4 !important;
  border-radius: 25px;
}
.nav .nav-bar {
  border-bottom: none !important;
}

.read-edit-btn {
  background-color: #fff !important;
  border: 2px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  width: 70px;
  height: 30px;
  display: inline-block;
  padding: 0;
}

/deep/ .quill-editor {
  &.bg-white {
    position: relative;
        border-radius: 3px;
        border: solid 2px #d3dfe4;
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
          margin-right: 10px;
          .ql-active {
                      box-shadow: 0 2px 2px 0 rgb(119, 119, 120);
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
      font-size: 14px;
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
        min-height: 0px;
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
.edit-only-policy {
  width: 1037px;
  height: 86px;
}
.instruction_title {
  word-break: break-word;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #000000;
    text-align: justify;
}
.edit-tittle-font {
  width: 100%;
  height: auto;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 2.29;
  color: #666669;
  padding: 10px 0px 20px;
}
.info_contact_title {
  word-break: break-all;
  width: 350px;
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
.lable-content-edit {
  width: 398px;
  height: 20px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #000000;
  margin-bottom: 4px;
}
.btn-remove {
  margin-top: -33px;
  vertical-align: middle;
  padding: 3px;
  border: 1px solid #d3dfe4;
  background: #d3dfe4;
  opacity: 0.6;
  border-radius: 3px;
  margin-left: 182px;
  &.sponsor-del {
    margin-top: 40px;
  }
}
.addLogo {
  font-family: RobotoRegular;
  width: 112px;
  padding: 0px;
  height: 30px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  color: #4c8ce4;
  margin-left: 20px;
  font-size: 12px;
  background-color: white;
}
.box-color1 {
  font-size: 14px;
  font-family: RobotoRegular;
  color: #060606;
  width: 150px;
  height: 40px;
  border-radius: 3px;
  border: solid 1px #c5d1d6;
  padding: 10px 8px;
}
.additionLogo {
  margin-left: -24px;
  margin-top: 5px;
  font-family: RobotoRegular;
  width: 112px;
  padding: 0px;
  height: 30px;
  border-radius: 3px;
  border: solid 2px #d3dfe4;
  color: #4c8ce4;
  font-size: 12px;
  background-color: white;
}
.global {
  // width: 2000px;
  // height: 3100px;
  // background-color: #000000;
  // position: absolute;
  opacity: 0.2;
  // margin-top: -300px;
  // margin-left: -281px;
  // z-index: 1000;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: #000;
}
.container-carosel {
  margin-left: -129px;
  margin-top: -451px !important;
  position: absolute !important;
  top: 555px !important;
}
.btn-close-tutorial {
  position: relative;
  right: -130px;
  border: none;
  background-color: transparent;
  height: 12px;
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
  cursor: pointer;
}
.btn-skip-tutorial {
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
  margin-top: 560px;
  margin-left: 33px;
  position: absolute;
  z-index: 1002;
  margin-bottom: -21px;
  cursor: pointer;
}
.additioanal_copy .quill-editor.bg-white {
  resize: both;
  overflow: auto;
}
.background-upload {
  background-color: transparent !important;
}
.edit-mode {
  opacity: 0.7;
  font-weight: bold;
}
.another-file-input{
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    width: 100%;
    height: 30px;
}
.Sponsorlogo-sec{
  width: 100%;
  min-height: 60px;
}
@media (min-width:1024px) and (max-width:1199px){
    .rectangle-33 {
    width: auto;
}
.rectangle-33.ipadfix {
    margin-left: 80px !important;
}
.read-edit-btn.studdy-logo.save_btn {
    position: relative;
    top: 65px;
}
.Sponsor_logo_edit {
    margin-left: -15px !important;
}
.rectangle-7 {
    position: relative;
    z-index: 10;
}
.global-color-fix{
  margin-left: 30px;
}
.rectangle-38{
  max-width: 100%;
  margin-left: 90px !important;
}
.addLogo{
  margin-left: 0px;
}
.rectangle-3 {
    width: 111px;
}
.btn-remove{
  margin-left: 0px;
}
.file-input-callout-1{
    right: 28px;
    width: 75%;
}
}
</style>