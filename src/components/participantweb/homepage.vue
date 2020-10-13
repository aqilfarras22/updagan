<template>
  <div>
    <div class="Intro-copy">Enter the following content to be displayed on the homepage.</div>
    <h4 class="header">Top feature area</h4>
    <div class="homepage-para">
      Add in the introductory content for the page.
      <span
        v-b-popover.hover="'The Top Feature Area will be what participants see first on the page. Enter the main headline with additional copy, button text, and a feature image. All fields are required and include text formatting.'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div v-if="showSaveHeader===true" class="homepahe-Rectangle-41">
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <p class="content">Headline</p>
          <quill-editor
            class="bg-white"
            v-model="homePage.headLine"
            :options="editorOptionForimageCaptureTitleHeadline"
          ></quill-editor>
        </div>
      </div>
      <div class="row pt-10 mt-5">
        <div class="col-lg-12 additioanal_copy p-0">
          <p class="content">Additional copy</p>
          <quill-editor
            name="study-name"
            class="instruction-screen bg-white"
            v-model="homePage.additionalCopyContent"
            :options="editorOptionForimageCaptureTitle"
          ></quill-editor>
        </div>
      </div>
      <div class="row pt-10 mt-5">
        <div class="col-lg-12 p-0">
          <p class="content">Main button text</p>
          <input
            v-model="homePage.buttonText"
            type="text"
            name="study-name"
            class="homepage-box homepage-box-small"
            placeholder="Enter content"
          />
        </div>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 col-md-12 p-0">
          <div class="logo-icon mt-15">Add a feature image</div>
          <div class="row">
          <div class="col-lg-7 pl-0">
            <div class="row">
            <div class="col-lg-4 pl-0">
              <span class="upload-your-study-logo">Upload your main image</span>
              <br />
              <span class="recommended-by">Recommended 800px by 800px Formats: .png, .jpeg</span>
            </div>
            <div class="col-lg-2 pl-11">
              <div class="rectangle-79">
                <input
                  type="file"
                  class="file-input"
                  id="logo_upload"
                  accept="image/*"
                  v-on:change="uploadFeatureImage($event);return false;"
                />
                Upload
              </div>
            </div>
            <div class="col-lg-4 pl-0 rectangle-outer-img">
              <img class="img-responsive rectangle-31 homepage-rectangle-380" :src="homePage.featureImageURL" />
            </div>
            </div>
          </div>
          <div class="col-lg-5 p-0 text-right">
            <button
              class="btn box-btn-save mt-65 btn-success save_btn"
              v-on:click="saveHeaderContent()"
            >Save</button>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- read only header page -->

    <div v-if="showSaveHeader===false" class="homepahe-Rectangle-41">
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <div class="content-edit" v-html="homePage.headLine"></div>
        </div>
      </div>
      <div class="row ml-5">
        <div class="col-lg-12 pl-0">
          <div class="content-body-edit" v-html="homePage.additionalCopyContent"></div>
        </div>
      </div>
      <div class="row ml-5">
        <div class="col-lg-12 pl-0">
          <button class="btn-edit-feature">{{homePage.buttonText}}</button>
        </div>
      </div>
      <div class="row upload-web">
        <div class="col-lg-12 mt-15 p-0">
          <div class="homepage-logo-icon">Feature image</div>
          <div class="row">
          <div class="col-lg-6 pl-0">
            <div class="rectangle-outer-img-edit">
              <img class="img-responsive homepage-rectangle-380" :src="homePage.featureImageURL" />
            </div>
          </div>
          <div class="col-lg-6 p-0 text-right">
            <button
              class="btn read-edit-btn mt-65 save_btn"
              v-on:click="editHeaderContent(); return false"
            >Edit</button>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- three callouts -->

    <h4 class="header pt-10">Three Callouts</h4>
    <div class="homepage-para">
      Enter content for the three callout boxes on your website.
      <span
        v-b-popover.hover="'For each Callout, upload or select an icon image and enter a title with additional copy. All fields are required and are free form.'"
        class="fa fa-info-circle color_grey"
      ></span>
    </div>
    <div v-if="showSaveCallout===true" class="container-fluid homepage-rectangle-footer mt-10">
      <div class="row upload-web">
        <div class="col-lg-4">
          <div class="logo-icon">Callout 1</div>
          <div class="row">
            <div class="col-lg-7 p-0 mt-5">
              <span class="upload-your-study-logo">Add callout icon</span>
              <br />
              <span class="recommended-by">Recommended 600px by 300px Formats: .png, .jpeg</span>
              <br />
              <div class="upload-and-save-btn-box">
                <div class="rectangle-7">
                  <input
                    type="file"
                    class="file-input-callout-1"
                    id="logo_upload1"
                    accept="image/*"
                    v-on:change="uploadCalloutImage1($event);return false;"
                  />
                  Upload
                </div>
                <span>or</span>
                <button
                  class="rectangle-9"
                  data-toggle="modal"
                  data-target="#myModal"
                  v-on:click="getBrandingLogosOfCallout1(1)"
                >
                  <span class="color-grey">Select from library</span>
                </button>
              </div>
            </div>
            <div class="col-lg-4 p-0 rectangle-outer-img2 text-center">
              <img class="rectangle-38 img-responsive" :src="homePage.callout1.iconURL" />
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="logo-icon">Callout 2</div>
          <div class="row">
            <div class="col-lg-7 p-0 mt-5">
              <span class="upload-your-study-logo">Add callout icon</span>
              <br />
              <span class="recommended-by">Recommended 600px by 300px Formats: .png, .jpeg</span>
              <br />
              <div class="upload-and-save-btn-box">
                <div class="rectangle-7">
                  <input
                    type="file"
                    class="file-input-callout-1"
                    id="logo_upload2"
                    accept="image/*"
                    v-on:change="uploadCalloutImage2($event);return false;"
                  />
                  Upload
                </div>
                <span>or</span>
                <button
                  class="rectangle-9"
                  data-toggle="modal"
                  data-target="#myModal"
                  v-on:click="getBrandingLogosOfCallout2(1)"
                >
                  <span class="color-grey">Select from library</span>
                </button>
              </div>
            </div>
            <div class="col-lg-4 p-0 rectangle-outer-img2 text-center">
              <img class="img-responsive rectangle-38" :src="homePage.callout2.iconURL" />
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="logo-icon">Callout 3</div>
          <div class="row">
            <div class="col-lg-7 p-0 mt-5">
              <span class="upload-your-study-logo">Add callout icon</span>
              <br />
              <span class="recommended-by">Recommended 600px by 300px Formats: .png, .jpeg</span>
              <br />
              <div class="upload-and-save-btn-box">
                <div class="rectangle-7">
                  <input
                    type="file"
                    class="file-input-callout-1"
                    id="logo_upload3"
                    accept="image/*"
                    v-on:change="uploadCalloutImage3($event);return false;"
                  />
                  Upload
                </div>
                <span>or</span>
                <button
                  class="rectangle-9"
                  data-toggle="modal"
                  data-target="#myModal"
                  v-on:click="getBrandingLogosOfCallout3(1)"
                >
                  <span class="color-grey">Select from library</span>
                </button>
              </div>
            </div>
            <div class="col-lg-4 p-0 rectangle-outer-img2 text-center">
              <img class="img-responsive rectangle-38" :src="homePage.callout3.iconURL" />
            </div>
          </div>
        </div>
        <div class="row callout-section">
          <div class="col-lg-4 mt-22">
            <div class="callout-title-para">Callout title</div>
            <div>
              <input
                v-model="homePage.callout1.title"
                class="col-lg-12 callout-body-input"
                type="text"
                placeholder="Enter content"
                required
              />
            </div>
          </div>
          <div class="col-lg-4 mt-22">
            <div class="callout-title-para">Callout title</div>
            <div>
              <input
                class="col-lg-12 callout-body-input"
                type="text"
                v-model="homePage.callout2.title"
                placeholder="Enter content"
              />
            </div>
          </div>
          <div class="col-lg-4 mt-22">
            <div class="callout-title-para">Callout title</div>
            <div>
              <input
                class="col-lg-12 callout-body-input"
                type="text"
                v-model="homePage.callout3.title"
                placeholder="Enter content"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row rectangle-footer-callout">
        <div class="col-lg-4 mt-22">
          <div class="callout-title-para">Callout copy</div>
          <div>
            <textarea
              class="p-15 callout-copy-input"
              v-model="homePage.callout1.content"
              type="text"
              placeholder="Enter content"
            />
          </div>
        </div>
        <div class="col-lg-4 mt-22">
          <div class="callout-title-para">Callout copy</div>
          <div>
            <textarea
              class="p-15 callout-copy-input"
              v-model="homePage.callout2.content"
              type="text"
              placeholder="Enter content"
            />
          </div>
        </div>
        <div class="col-lg-4 mt-22">
          <div class="callout-title-para">Callout copy</div>
          <div>
            <textarea
              class="p-15 callout-copy-input"
              v-model="homePage.callout3.content"
              type="text"
              placeholder="Enter content"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 mt-21 text-right">
          <button class="btn box-btn-save btn-success save_btn" v-on:click="saveCallout()">Save</button>
        </div>
      </div>
    </div>

    <!-- edit three callouts -->

    <div v-if="showSaveCallout===false" class="homepage-rectangle-footer">
      <div class="row upload-web">
        <div class="col-lg-4">
          <div class="logo-icon">Callout 1</div>
          <div class="col-lg-12 pl-0">
            <div class="col-lg-6">
              <img class="img-responsive rectangle-38" :src="homePage.callout1.iconURL" />
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="logo-icon">Callout 2</div>
          <div class="col-lg-12 pl-0">
            <div class="col-lg-6">
              <img class="img-responsive rectangle-38" :src="homePage.callout2.iconURL" />
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="logo-icon">Callout 3</div>
          <div class="col-lg-12 pl-0">
            <div class="col-lg-6">
              <img class="img-responsive rectangle-38" :src="homePage.callout3.iconURL" />
            </div>
          </div>
        </div>
        <div class="row callout-section">
          <div class="col-lg-4 mt-22">
            <div class="callout-title-para"></div>
            <div class="logo-icon">{{homePage.callout1.title}}</div>
          </div>
          <div class="col-lg-4 mt-22">
            <div class="callout-title-para"></div>
            <div class="logo-icon">{{homePage.callout2.title}}</div>
          </div>
          <div class="col-lg-4 mt-22">
            <div class="callout-title-para"></div>
            <div class="logo-icon">{{homePage.callout3.title}}</div>
          </div>
        </div>
      </div>
      <div class="row rectangle-footer-callout">
        <div class="col-lg-4 mt-22">
          <div class="callout-title-para-edit">{{homePage.callout1.content}}</div>
        </div>
        <div class="col-lg-4 mt-22">
          <div class="callout-title-para-edit">{{homePage.callout2.content}}</div>
        </div>
        <div class="col-lg-4 mt-22">
          <div class="callout-title-para-edit">{{homePage.callout3.content}}</div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 pl-0 mt-25 text-right">
          <button class="btn read-edit-btn save_btn mb-5" v-on:click="editCallout()">Edit</button>
        </div>
      </div>
    </div>

    <!-- Body Content page.-------------- -->

    <h4 class="header-body-content mt-30">Body content</h4>
    <div
      class="homepage-para-body-content"
    >Add sections to the body of your website and complete the required fields.</div>
    <div v-if="bodySectionsLength === 0" class="homepage-Rectangle-41 mb-20">
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <p class="content">Subheadline</p>
          <quill-editor
            class="bg-white"
            v-model="selectedBodySection.bodySections[0].subHeadline"
            :options="editorOptionForimageCaptureTitleSubHeadline"
          ></quill-editor>
        </div>
      </div>
      <div class="row pt-10 ml-5">
        <div class="col-lg-12 additioanal_copy p-0">
          <p class="content">Body copy</p>
          <quill-editor
            class="bg-white instruction-screen"
            v-model="selectedBodySection.bodySections[0].bodyCopyContent"
            :options="editorOptionForimageCaptureTitleBodyCopy"
          ></quill-editor>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 p-0 mt-20 text-right">
          <button class="btn box-btn-save btn-success save_btn" v-on:click="saveBodySection()">Save</button>
        </div>
      </div>
    </div>

    <!-- loop ------------------- -->

    <div
      v-if="bodySectionsLength !== 0"
      v-for="(eachSection,index) in homePage.bodySections"
      v-bind:key="index"
      class=""
    >
      <div v-if="(index !== selectedBodySectionIndex)">
        <div class="homepage-Rectangle-41 mb-20">
          <div class="row ml-5">
            <div class="col-lg-12 pl-0">
              <div class="sub-headline-style" v-html="eachSection.subHeadline"></div>
            </div>
          </div>
          <div class="row ml-5">
            <div class="col-lg-12 homepage-read-edit-body pl-0">
              <div class v-html="eachSection.bodyCopyContent"></div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 p-0 mt-20 text-right">
              <button class="btn read-edit-btn save_btn" v-on:click="editBodyContent(index)">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Added sections extra------------------------ -->
      <div v-if="(index === selectedBodySectionIndex)" class="homepage-Rectangle-41 mb-20">
        <div class="row ml-5">
          <div class="col-lg-12 p-0">
            <p class="content">Subheadline</p>
            <quill-editor
            class="bg-white"
            v-model="eachSection.subHeadline"
            :options="editorOptionForimageCaptureTitleSubHeadline"
            ></quill-editor>
          </div>
        </div>
        <div class="row pt-20 ml-5">
          <div class="col-lg-12 p-0">
            <p class="content">Body copy</p>
            <quill-editor
              class="bg-white instruction-screen"
              v-model="eachSection.bodyCopyContent"
              :options="editorOptionForimageCaptureTitleBodyCopy"
            ></quill-editor>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 p-0 mt-20 text-right">
            <button
              class="btn box-btn-save btn-success save_btn"
              v-on:click="updateBodyContent(index)"
            >Save</button>
            <button
            v-if="bodySectionsLength>1"
              class="btn btn-link btn-remove ml-20"
              v-on:click="deleteBodyContentSection(index)"
            >
              <img src="static/img/delete.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="addNewbodySection" class="homepage-Rectangle-41 mb-20">
      <div class="row ml-5">
        <div class="col-lg-12 p-0">
          <p class="content">Subheadline</p>
          <quill-editor
            class="bg-white"
            v-model="selectedBodySection.bodySections[0].subHeadline"
            :options="editorOptionForimageCaptureTitleSubHeadline"
          ></quill-editor>
        </div>
      </div>
      <div class="row pt-10 ml-5">
        <div class="col-lg-12 additioanal_copy p-0">
          <p class="content">Body copy</p>
          <quill-editor
            class="bg-white instruction-screen"
            v-model="selectedBodySection.bodySections[0].bodyCopyContent"
            :options="editorOptionForimageCaptureTitleBodyCopy"
          ></quill-editor>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 p-0 mt-20 text-right">
          <button class="btn box-btn-save btn-success save_btn" v-on:click="saveBodySection()">Save</button>
          <button
              class="btn btn-link btn-remove ml-20"
              v-on:click="removeExtraSection()"
            >
              <img src="static/img/delete.svg" />
            </button>       
        </div>
      </div>
    </div>
    <button v-on:click="addSection(true)" class="add-section-btn">Add another section</button>

    <!-- modal for libry ------------------------- -->

    <div id="myModal" class="modal fade" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <!-- callout 1 logo -->
        <div
          class="modal-content modal_custom col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-30 pb-30 pr-30 pl-30"
          v-if="modal === 'callout1Logo'"
        >
          <div class="row">
            <div class="fs-28 modal_header_color fw-200">Logo Library</div>
            <a class="cancelImage cursor_pointer" v-on:click="cancelImages">
              <i class="fa fa-times" aria-hidden="true"></i>
            </a>
          </div>
          <p class="modal_desc">Don't have a logo? Don't worry, we got you covered.</p>
          <div class="row pt-20">
            <div
              class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0"
              v-for="(i, index) in callout1Logos"
              v-on:click="selectCallout1Logo(i,  index)"
            >
              <div
                class="library_img_bg"
                :class="{'selected_icon_logo_image' : i.name === selectedCallout1Logo.name}"
              >
                <img class="img-responsive logo" :src="i.preSignedURL" />
              </div>
            </div>
            <div v-if="!callout1Logos || callout1Logos.length === 0">No logos present</div>
          </div>
          <div class="row text-center pt-20" v-if="totalPages > 1">
            <span
              class="paginate"
              v-if="currentPage !== 1"
              v-on:click="getBrandingLogosOfCallout1(currentPage - 1)"
            >
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </span>
            <span
              class="paginate"
              :class="{active: currentPage === pageIndex + 1 }"
              v-for="(page, pageIndex) in totalPages"
              v-on:click="getBrandingLogosOfCallout1(pageIndex + 1)"
            >{{pageIndex + 1}}</span>
            <span
              class="paginate"
              v-if="currentPage !== totalPages"
              v-on:click="getBrandingLogosOfCallout1(currentPage + 1)"
            >
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </span>
          </div>
          <div class="row pt-40 pb-10 text-center">
            <button
              class="btn btn-info btn-block text-center color_ff br-25 library_add_btn"
              v-on:click="addImage()"
              :disabled="!selectedCallout1Logo || !selectedCallout1Logo.preSignedURL"
            >Add</button>
          </div>
        </div>

        <!-- callout 2 log -->

        <div
          class="modal-content modal_custom col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-30 pb-30 pr-30 pl-30"
          v-if="modal === 'callout2Logo'"
        >
          <div class="row">
            <div class="fs-28 modal_header_color fw-200">Logo Library</div>
            <a class="cancelImage cursor_pointer" v-on:click="cancelImages">
              <i class="fa fa-times" aria-hidden="true"></i>
            </a>
          </div>
          <p class="modal_desc">Don't have a logo? Don't worry, we got you covered.</p>
          <div class="row pt-20">
            <div
              class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0"
              v-for="(i, index) in callout2Logos"
              v-on:click="selectCallout2Logo(i,  index)"
            >
              <div
                class="library_img_bg"
                :class="{'selected_icon_logo_image' : i.name === selectedCallout2Logo.name}"
              >
                <img class="img-responsive logo" :src="i.preSignedURL" />
              </div>
            </div>
            <div v-if="!callout2Logos || callout2Logos.length === 0">No logos present</div>
          </div>
          <div class="row text-center pt-20" v-if="totalPages > 1">
            <span
              class="paginate"
              v-if="currentPage !== 1"
              v-on:click="getBrandingLogosOfCallout2(currentPage - 1)"
            >
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </span>
            <span
              class="paginate"
              :class="{active: currentPage === pageIndex + 1 }"
              v-for="(page, pageIndex) in totalPages"
              v-on:click="getBrandingLogosOfCallout2(pageIndex + 1)"
            >{{pageIndex + 1}}</span>
            <span
              class="paginate"
              v-if="currentPage !== totalPages"
              v-on:click="getBrandingLogosOfCallout2(currentPage + 1)"
            >
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </span>
          </div>
          <div class="row pt-40 pb-10 text-center">
            <button
              class="btn btn-info btn-block text-center color_ff br-25 library_add_btn"
              v-on:click="addImage()"
              :disabled="!selectedCallout2Logo || !selectedCallout2Logo.preSignedURL"
            >Add</button>
          </div>
        </div>

        <!-- callout 3 log -->

        <div
          class="modal-content modal_custom col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-30 pb-30 pr-30 pl-30"
          v-if="modal === 'callout3Logo'"
        >
          <div class="row">
            <div class="fs-28 modal_header_color fw-200">App Icon Library</div>
            <a class="cancelImage cursor_pointer" v-on:click="cancelImages">
              <i class="fa fa-times" aria-hidden="true"></i>
            </a>
          </div>
          <p class="modal_desc">Don't have a Icon? Don't worry, we got you covered.</p>
          <div class="row pt-20">
            <div
              class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0"
              v-if="callout3Logos && callout3Logos.length > 0"
              v-for="(i, index) in callout3Logos"
              v-on:click="selectCallout3Logo(i, index)"
            >
              <div
                class="library_img_bg"
                :class="{'selected_icon_logo_image' 
                      : i.name === selectedCallout3Logo.name}"
              >
                <img class="img-responsive logo" :src="i.preSignedURL" />
              </div>
            </div>
            <div v-if="!callout3Logos || callout3Logos.length === 0">No icons present</div>
          </div>
          <div class="row text-center pt-20" v-if="totalPages > 1">
            <span
              class="paginate"
              v-if="currentPage !== 1"
              v-on:click="getBrandingLogosOfCallout3(currentPage - 1)"
            >
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </span>
            <span
              class="paginate"
              :class="{active: currentPage === pageIndex + 1 }"
              v-for="(page, pageIndex) in totalPages"
              v-on:click="getBrandingLogosOfCallout3(pageIndex + 1)"
            >{{pageIndex + 1}}</span>
            <span
              class="paginate"
              v-if="currentPage !== totalPages"
              v-on:click="getBrandingLogosOfCallout3(currentPage + 1)"
            >
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </span>
          </div>
          <div class="row pt-40 pb-10 text-center">
            <button
              class="btn btn-info btn-block text-center color_ff br-25 library_add_btn"
              v-on:click="addImage()"
              :disabled="!selectedCallout3Logo || !selectedCallout3Logo.preSignedURL"
            >Add</button>
          </div>
        </div>
      </div>
    </div>

    <!-- bottom of page---------------------------------- -->

    <div class="next-screen-btn-div text-right">
      <button
        class="btn box-btn-next btn-success save_btn mt-32 mb-40"
        v-on:click="screenNext()"
      >Next</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import toastr from "toastr";
import Papa from "papaparse";
import FileSaver from "file-saver";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import { AclRule } from "vue-acl";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import moment from "moment";
import filter from "lodash/filter";
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

export default {
  name: "homep",
  components: { mainHeader, sideMenu },
  props: {
    studyData: Object
  },
  data() {
    return {
      createMode: true,
      homePage: {
        callout1: {
          title: "",
          content: ""
        },
        callout2: {
          title: "",
          content: ""
        },
        callout3: {
          title: "",
          content: ""
        },
        bodySections: [],
        additionalCopyContent: "",
        headLine: "",
        buttonText: "",
        featureImageURL: "",
        featureImage: ""
      },
      selectedBodySection: {
        bodySections: [
          {
            subHeadline: "",
            bodyCopyContent: ""
          }
        ]
      },
      selectedBodySectionIndex: null,
      bodySectionsLength: 0,
      studyDetails: {},
      addNewbodySection: false,
      modal: "",
      totalPages: 1,
      currentPage: 1,
      callout3Logos: [],
      callout1Logos: [],
      callout2Logos: [],
      selectedCallout1Logo: "",
      selectedCallout2Logo: "",
      selectedCallout3Logo: "",
      editorOptionForimageCaptureTitle: {
        placeholder: "Enter content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleHeadline: {
        placeholder: "Enter content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleSubHeadline: {
        placeholder: "Enter content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      editorOptionForimageCaptureTitleBodyCopy: {
        placeholder: "Enter content",
        modules: {
          toolbar: [["bold", "italic", "underline"]]
        }
      },
      showSaveHeader: true,
      showSaveCallout: true,
      showSaveBody: true
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
    }
  },
  methods: {
    getParticipantWebHomePageDetails() {
      if (this.$route.params.studyId) {
        this.$api
          .getParticipantWebHomePage(this.$route.params.studyId)
          .then(response => {
            if (response.data.data) {
              this.createMode = false;
              this.homePage = response.data.data;
              this.bodySectionsLength = response.data.data.bodySections.length;
              if (this.homePage.bodySections.length !== 0) {
                this.selectedBodySectionIndex = null;
              }
              if (this.homePage.headLine) {
                this.showSaveHeader = false;
              }
              if (this.homePage.callout1.title) {
                this.showSaveCallout = false;
              }
            }
          })
          .catch(err => {
            (this.closeCarousel = true), console.log("err", err.statusCode);
            throw err;
          });
      }
    },
     getHeaderContent() {
      if (this.$route.params.studyId) {
        this.$api
          .getParticipantWebHomePage(this.$route.params.studyId)
          .then(response => {
            if (response.data.data) {
              this.createMode = false;
              this.homePage = response.data.data;
              this.bodySectionsLength = response.data.data.bodySections.length;
            }
          })
          .catch(err => {
            (this.closeCarousel = true), console.log("err", err.statusCode);
            throw err;
          });
      }
    },
    addSection(val) {
      if (
        this.selectedBodySectionIndex === null &&
        this.bodySectionsLength !== 0
      ) {
        this.addNewbodySection = val;
      }
    },
    removeExtraSection() {
      this.addNewbodySection = false;
      this.selectedBodySection = {
        bodySections: [
          {
            subHeadline: "",
            bodyCopyContent: "",
          }
        ]
      };
    },
    saveBodySection() {
      if (!this.selectedBodySection.bodySections[0].subHeadline || this.selectedBodySection.bodySections[0].subHeadline.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Subheadline is required.");
        return;
      }
      if (!this.selectedBodySection.bodySections[0].bodyCopyContent || this.selectedBodySection.bodySections[0].bodyCopyContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Body copy is required.");
        return;
      }
      if (this.$route.params.studyId) {
        this.$api
          .postParticipantWebHomePageBodySection(
            this.$route.params.studyId,
            this.selectedBodySection
          )
          .then(response => {
            if (response) {
              if (this.addNewbodySection) {
                this.homePage.bodySections[this.bodySectionsLength] = {
                  ...this.homePage.bodySections[this.bodySectionsLength],
                  subHeadline: response.data.data.bodySections[0].subHeadline,
                  bodyCopyContent:
                    response.data.data.bodySections[0].bodyCopyContent
                };
                this.bodySectionsLength = this.homePage.bodySections.length;
              } else if (!this.addNewbodySection) {
                this.homePage.bodySections = response.data.data.bodySections;
                this.bodySectionsLength =
                  response.data.data.bodySections.length;
              }
              this.selectedBodySection = {
                bodySections: [
                  {
                    subHeadline: "",
                    bodyCopyContent: ""
                  }
                ],
              };
              this.getHeaderContent();
              toastr.success("Body section added successfully");
            }
            if (response.data.data.bodySections[0].subHeadline) {
              this.selectedBodySectionIndex = null;
            }
            this.addNewbodySection = false;
          })
          .catch(err => {
            throw err;
          });
      }
      this.showSaveBody = false;
    },
    updateBodyContent(index) {
      let updatedBodySection = {
        bodySections: [
          {
            subHeadline: "",
            bodyCopyContent: ""
          }
        ]
      };
      updatedBodySection.bodySections[0].subHeadline = this.homePage.bodySections[
        index
      ].subHeadline;
      updatedBodySection.bodySections[0].bodyCopyContent = this.homePage.bodySections[
        index
      ].bodyCopyContent;
      if (!updatedBodySection.bodySections[0].subHeadline || updatedBodySection.bodySections[0].subHeadline.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Subheadline is required.");
        return;
      }
      if (!updatedBodySection.bodySections[0].bodyCopyContent || updatedBodySection.bodySections[0].bodyCopyContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Body copy is required.");
        return;
      }
      if (this.$route.params.studyId) {
        this.$api
          .updateParticipantWebHomePageBodySection(
            this.$route.params.studyId,
            index + 1,
            updatedBodySection
          )
          .then(response => {
            if (response) {
              this.homePage.bodySections[index] = {
                ...this.homePage.bodySections[index],
                subHeadline: response.data.data.bodySections[0].subHeadline,
                bodyCopyContent:
                  response.data.data.bodySections[0].bodyCopyContent
              };
              this.bodySectionsLength = this.homePage.bodySections.length;
            }
            if (response.data.data.bodySections[0].subHeadline) {
              this.selectedBodySectionIndex = null;
            }
            this.getHeaderContent();
            toastr.success("Body section uploaded successfully");
          })
          .catch(err => {
            throw err;
          });
      }

      this.showSaveBody = false;
      this.addNewbodySection = false;
    },
    deleteBodyContentSection(index) {
      let deleteBodySection = {
        bodySections: [
          {
            subHeadline: "",
            bodyCopyContent: ""
          }
        ]
      };
      deleteBodySection.bodySections[0].subHeadline = this.homePage.bodySections[
        index
      ].subHeadline;
      deleteBodySection.bodySections[0].bodyCopyContent = this.homePage.bodySections[
        index
      ].bodyCopyContent;
      if (this.$route.params.studyId) {
        this.$api
          .deleteParticipantWebHomePageBodySection(
            this.$route.params.studyId,
            index + 1,
            deleteBodySection
          )
          .then(response => {
            if (response) {
               this.getHeaderContent();
              this.bodySectionsLength = response.data.data.bodySections.length;
            }
            this.selectedBodySection = {
              bodySections: [
                {
                  subHeadline: "",
                  bodyCopyContent: ""
                }
              ]
            };
            this.selectedBodySectionIndex = null;  
            toastr.success("Body section deleted successfully");
          })
          .catch(err => {
            throw err;
          });
      }

      this.showSaveBody = false;
      this.addNewbodySection = false;
    },

    saveCallout() {
       if(!this.homePage.callout1.iconURL) {
        toastr.error("Callout icon is required.");
        return;
      } else if (!this.homePage.callout1.title || this.homePage.callout1.title.trim().length === 0) {
        toastr.error("Callout title is required.");
        return;
      } else if(!this.homePage.callout1.content || this.homePage.callout1.content.trim().length === 0) {
        toastr.error("Callout copy is required.");
        return;
      } else if(!this.homePage.callout2.iconURL) {
        toastr.error("Callout icon is required.");
        return;
      } else if (!this.homePage.callout2.title || this.homePage.callout2.title.trim().length === 0) {
        toastr.error("Callout title is required.");
        return;
      } else if(!this.homePage.callout2.content || this.homePage.callout2.content.trim().length === 0) {
        toastr.error("Callout copy is required.");
        return;
      } else if(!this.homePage.callout3.iconURL) {
        toastr.error("Callout icon is required.");
        return;
      } else if (!this.homePage.callout3.title || this.homePage.callout3.title.trim().length === 0) {
        toastr.error("Callout title is required.");
        return;
      } else if(!this.homePage.callout3.content || this.homePage.callout3.content.trim().length === 0) {
        toastr.error("Callout copy is required.");
        return;
      }
      
      if (this.createMode === true) {
        this.homePage.created_by = this.user.id;
        this.homePage.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.homePage.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        this.homePage.modified_by = this.user.id;
      }

      if (this.$route.params.studyId) {
        this.$api
          .createParticipantWebHomePage(
            this.$route.params.studyId,
            this.homePage
          )
          .then(response => {
            if (response.data.data) {
              if (response.data.data.callout1) {
                this.homePage.callout1 = {
                  ...this.homePage.callout1,
                  ...response.data.data.callout1
                };
              }
              if (response.data.data.callout2) {
                this.homePage.callout2 = {
                  ...this.homePage.callout2,
                  ...response.data.data.callout2
                };
              }
              if (response.data.data.callout3) {
                this.homePage.callout3 = {
                  ...this.homePage.callout3,
                  ...response.data.data.callout3
                };
              }
              toastr.success("Callouts save successfully");
              this.showSaveCallout = false;
            }
          })
          .catch(err => {
            throw err;
          });
      }
    },
    uploadCalloutImage3(event) {
      const selectedImage3 = event.target.files[0];
      const input = window.document.getElementById("logo_upload3");
      if (input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error(
          "Uploaded image format not supported. Please upload a PNG, JPEG, OR SVG file."
        );
        event.target.value = null;
        return;
      }
      const render = new FileReader();
      render.onload = e => {
        this.file = {
          fileName: input.files[0].name,
          contentType: input.files[0].type,
          base64Code: e.target.result.split(",")[1]
        };
        if (this.$route.params.studyId) {
          this.$api
            .uploadCalloutImage(this.$route.params.studyId, 2, this.file)
            .then(response => {
              if (response.data.data) {
                this.homePage.callout3 = {
                  ...this.homePage.callout3,
                  iconURL: response.data.data.callout3.iconURL,
                  iconPath: response.data.data.callout3.iconPath
                };
              }
              toastr.success("Callout Image uploaded successfully");
            })
            .catch(err => {
              throw err;
            });
        }
      };
      var img = this.image;
      render.readAsDataURL(selectedImage3);
    },
    uploadCalloutImage2(event) {
      const selectedImage2 = event.target.files[0];
      const input = window.document.getElementById("logo_upload2");
      if (input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error(
          "Uploaded image format not supported. Please upload a PNG, JPEG, OR SVG file."
        );
        event.target.value = null;
        return;
      }
      const render = new FileReader();
      render.onload = e => {
        this.file = {
          fileName: input.files[0].name,
          contentType: input.files[0].type,
          base64Code: e.target.result.split(",")[1]
        };
        if (this.$route.params.studyId) {
          this.$api
            .uploadCalloutImage(this.$route.params.studyId, 1, this.file)
            .then(response => {
              if (response.data.data) {
                this.homePage.callout2 = {
                  ...this.homePage.callout2,
                  iconURL: response.data.data.callout2.iconURL,
                  iconPath: response.data.data.callout2.iconPath
                };
              }
              toastr.success("Callout Image uploaded successfully");
            })
            .catch(err => {
              throw err;
            });
        }
      };
      var img = this.image;
      render.readAsDataURL(selectedImage2);
    },
    uploadCalloutImage1(event) {
      const selectedImage1 = event.target.files[0];
      const input = window.document.getElementById("logo_upload1");
      if (input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error(
          "Uploaded image format not supported. Please upload a PNG, JPEG, OR SVG file."
        );
        event.target.value = null;
        return;
      }
      const render = new FileReader();
      render.onload = e => {
        this.file = {
          fileName: input.files[0].name,
          contentType: input.files[0].type,
          base64Code: e.target.result.split(",")[1]
        };
        if (this.$route.params.studyId) {
          this.$api
            .uploadCalloutImage(this.$route.params.studyId, 0, this.file)
            .then(response => {
              toastr.success("Callout Image uploaded successfully");
              if (response.data.data) {
                this.homePage.callout1 = {
                  ...this.homePage.callout1,
                  iconURL: response.data.data.callout1.iconURL,
                  iconPath: response.data.data.callout1.iconPath
                };
              }
            })
            .catch(err => {
              throw err;
            });
        }
      };
      var img = this.image;
      render.readAsDataURL(selectedImage1);
    },
    editHeaderContent() {
      this.showSaveHeader = true;
    },
    editCallout() {
      this.showSaveCallout = true;
    },
    validateImage(image) {
      var isValid = image.name.match(/.(png|jpg|svg)$/i);
      return isValid;
    },
    uploadFeatureImage(event) {
      const selectedImage = event.target.files[0];
      const input = window.document.getElementById("logo_upload");
      if (input.files[0] && this.validateImage(input.files[0]) == null) {
        toastr.error(
          "Uploaded image format not supported. Please upload a PNG, JPEG, OR SVG file."
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
            .uploadFeatureImage(this.$route.params.studyId, this.file)
            .then(response => {
              if (response.data.data) {
                this.homePage.featureImageURL = response.data.data.imageSignedUrl;
                this.homePage.featureImage = response.data.data.featureImage;
                toastr.success("Feature Image uploaded successfully");  
              }
            })
            .catch(err => {
              (this.closeCarousel = true), console.log("err", err.statusCode);
              throw err;
            });
        }
      };
      var img = this.image;
      reader.readAsDataURL(selectedImage);
    },
    saveHeaderContent() {
      if (!this.homePage.headLine || this.homePage.headLine.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
       toastr.error("Headline is required.");
        return;
      } else if (!this.homePage.additionalCopyContent || this.homePage.additionalCopyContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toastr.error("Additional copy is required.");
        return;
      } else if (!this.homePage.buttonText || this.homePage.buttonText.trim().length === 0) {
        toastr.error("Main button text is required.");
        return;
      } else if (this.homePage.buttonText.length>100) {
        toastr.error("Main button 100 character limit exceeded");
        return;
      }else if (!this.homePage.featureImage) {
        toastr.error("Feature image is required.");
        return;
      }
      if (this.createMode === true) {
        this.homePage.created_by = this.user.id;
        this.homePage.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.homePage.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        this.homePage.modified_by = this.user.id;
      }

      if (this.$route.params.studyId) {
        this.$api
          .createParticipantWebHomePage(
            this.$route.params.studyId,
            this.homePage
          )
          .then(response => {
            if (response.data.data) {
              this.getHeaderContent();
              toastr.success("Header content updated successfully");
              this.showSaveHeader = false;
            }
          })
          .catch(err => {
            throw err;
          });
      }
    },
    //  --------------------- methods for select from libry
    getBrandingLogosOfCallout1(pageNumber) {
      this.modal = "callout1Logo";
      this.currentPage = pageNumber;
      this.$api.getBrandingLogosFact(pageNumber).then(response => {
        this.callout1Logos = response.body.icons;
        this.totalPages = response.body.totalPages;
         console.log('response.body', response.body);
      });
     
    },
    getBrandingLogosOfCallout3(pageNumber) {
      this.modal = "callout3Logo";
      this.currentPage = pageNumber;
      this.$api.getBrandingLogosFact(pageNumber).then(response => {
        this.callout3Logos = response.body.icons;
        this.totalPages = response.body.totalPages;
      });
    },
    getBrandingLogosOfCallout2(pageNumber) {
      this.modal = "callout2Logo";
      this.currentPage = pageNumber;
      this.$api.getBrandingLogosFact(pageNumber).then(response => {
        this.callout2Logos = response.body.icons;
        this.totalPages = response.body.totalPages;
      });
    },

    selectCallout2Logo(page) {
      this.selectedCallout2Logo = {};
      this.selectedCallout2Logo = page;
    },
    selectCallout1Logo(page) {
      console.log('page', page);
      this.selectedCallout1Logo = {};
      this.selectedCallout1Logo = page;
    },
    selectCallout3Logo(page) {
      this.selectedCallout3Logo = {};
      this.selectedCallout3Logo = page;
    },
    addImage() {
      let file = {
          fileName : "",
          created_by : this.homePage.created_by,
          created_time : this.homePage.created_time,
          modified_by : this.homePage.modified_by,
          modified_time : this.homePage.modified_time
      };
      if (this.createMode === true) {
        file.created_by = this.user.id;
        file.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
      } else {
        file.modified_time = moment().format("YYYY-MM-DD HH:mm:ss");
        file.modified_by = this.user.id;
      }

      if (this.modal === "callout1Logo") {
        if (this.$route.params.studyId) {
          this.homePage.callout1.iconURL = this.selectedCallout1Logo.preSignedURL;
           file.fileName = this.selectedCallout1Logo.name; 
          this.selectedCallout1Logo = {};
          if (this.$route.params.studyId) {
          this.$api
            .uploadCalloutIcon(this.$route.params.studyId, 0, file)
            .then(response => {
              toastr.success("Callout Image uploaded successfully")
              if (response.data.data) {
                this.homePage.callout1 = {
                  ...this.homePage.callout1,
                  iconURL: response.data.data.callout1.iconURL,
                  iconPath: response.data.data.callout1.iconPath
                };
              }
            })
            .catch(err => {
              throw err;
            });
          }
        }
      } else if (this.modal == "callout2Logo") {
        if (this.$route.params.studyId) {
          this.homePage.callout2.iconURL = this.selectedCallout2Logo.preSignedURL;
          file.fileName = this.selectedCallout2Logo.name       
          this.selectedCallout2Logo = {};
          if (this.$route.params.studyId) {
          this.$api
            .uploadCalloutIcon(this.$route.params.studyId, 1, file)
            .then(response => {
              toastr.success("Callout Image uploaded successfully")
              if (response.data.data) {
                this.homePage.callout2 = {
                  ...this.homePage.callout2,
                  iconURL: response.data.data.callout2.iconURL,
                  iconPath: response.data.data.callout2.iconPath
                };
              }
            })
            .catch(err => {
              throw err;
            });
          }
        }
      } else if (this.modal === "callout3Logo") {
        if (this.$route.params.studyId) {
          this.homePage.callout3.iconURL = this.selectedCallout3Logo.preSignedURL;
          file.fileName = this.selectedCallout3Logo.name;
          this.selectedCallout3Logo = {};
          if (this.$route.params.studyId) {
          this.$api
            .uploadCalloutIcon(this.$route.params.studyId, 2, file)
            .then(response => {
              toastr.success("Callout Image uploaded successfully")
              if (response.data.data) {
                this.homePage.callout3 = {
                  ...this.homePage.callout3,
                  iconURL: response.data.data.callout3.iconURL,
                  iconPath: response.data.data.callout3.iconPath
                };
              }
            })
            .catch(err => {
              throw err;
            });
          }
        }
      }
      this.modal = "";
      window.$("#myModal").modal("hide");
      this.selectedCallout3Logo = "";
      this.selectedCallout2Logo = "";
      this.selectedCallout1Logo = "";
    },
    cancelImages() {
      this.modal = "";
      window.$("#myModal").modal("hide");
      this.selectedCallout3Logo = {};
      this.selectedCallout2Logo = {};
      this.selectedCallout1Logo = {};
    },
    editBodyContent(index) {
      if(this.addNewbodySection !== true) {
        this.selectedBodySectionIndex = index;
      }
    },
    screenNext() {
      this.$router.push({
        name: "eligibility",
        params: {
          studyId: this.studyId
        }
      });
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.getParticipantWebHomePageDetails();
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

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.sub-headline-style {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.78;
    color: #666669;
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
  width: 1078px;
  height: 291px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dee3;
  width: 1291px;
  margin-left: 32px;
  background-color: #f5f8fa;
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
  color: #b8c7ce;
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
.rectangle-outer-img {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -28px;
}
.rectangle-outer-img2 {
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -28px;
  width: 128px;
  height: 64px;
}
.rectangle-31 {
  width: auto;
  height: 100%;
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
  border: none;
  margin-right: 7px;
  color: #aaaab0;
font-size: 12px;
font-weight: bold;
text-align: center;
line-height: 28px;
float: left;
}
.rectangle-79 {
  width: 80px;
  height: 30px;
  border-radius: 3px;
  background-color: #d3dee3;
  border: none;
  margin-left: -35px;
  color: #aaaab0;
font-size: 12px;
font-weight: bold;
text-align: center;
line-height: 28px;
float: left;
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
  width: auto;
  height: 100%;
  max-height: 80px;
  max-width: 100px;
}
.uploaded {
  width: 100%;
  height: 100%;
  max-height: 80px;
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

.info-content {
  margin-left: 32px;
  margin-top: 32px;
}
.box-edit {
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
  padding: 10px 15px;
  font: RobotoRegular;
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
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #949496;
  margin-top: 15px;
}
.homepage-para-body-content {
  margin-bottom: 5px;
  opacity: 0.7;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.homepage-logo-icon {
  margin-top: 5px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: bold;
  color: #666669;
}
.homepage-rectangle-38 {
  width: 97px;
  height: 96px;
  border: solid 1px #c5d1d6;
  background-color: #ffffff;
  margin-left: -38px;
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
  font-family: RobotoRegular;
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
  font-family: RobotoRegular;
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
  border: 1px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  width: 70px;
  height: 30px;
  display: inline-block;
  padding: 0;

}
.add-section-btn {
  background-color: #fff !important;
  border: 2px solid #d3dfe4;
  color: #4c8ce4;
  border-radius: 3px;
  height: 30px;
  display: inline-block;
  font-family: RobotoRegular;
  font-size: 12px;
}
.homepage-box-small {
  width: 721px;
}
.content-edit{
  word-wrap: anywhere;
}
.content-edit p {
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: normal;
  color: #666669;
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
  height: 39px;
  background-color: #959fa4;
  color: #fff;
  border: none;
  font-weight: bold;
  padding: 5px 50px;
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
  font-weight: bold;
  font-size: 18px;
  margin-left: 4px;
}
.color-grey {
  cursor: pointer;
  opacity: 0.6;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  line-height: 2.33;
  color: #7e7e82;
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
          margin-right: 10px;
          margin-top: 5px;
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
      font-family: RobotoRegular;
      font-weight: normal;
      border-radius: 3px;
      color: #000;
      border: solid 2px #d3dfe4;
      background-color: #ffffff;
      .ql-editor.ql-blank::before {
        font-style: normal;
        color: #c5d1d6;
        font-weight: normal;
      }
      .ql-editor {
        height: 50px;
        min-height: 0px;
        span{
          color: #000 !important;
        }
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

.file-input {
  position: absolute;
  top: 0;
  right: 40px;
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
  right: 107px;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
 width: 44%;
bottom: 1px;
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
.btn-remove {
    border: 1px solid #d3dfe4;
    background: #d3dfe4;
    padding: 4px;
    opacity: 0.6;
}
.homepage-rectangle-380{
    height: 96px;
    max-width: 95px;
    max-height: 93px;
}
.rectangle-outer-img-edit {
    width: 97px;
    height: 96px;
    border: solid 1px #c5d1d6;
    background-color: #ffffff;
}
@media (min-width:1024px) and (max-width:1199px){
    .homepage-box-small{
    width: 100%;
}
.rectangle-outer-img {
    margin-left: 0px;
}
.rectangle-outer-img2 {
    margin-left: 0px;
}
.callout-copy-input {
    width: 100%;
}
.rectangle-7{
  font-size: 10px;
}
.color-grey{
  font-size: 10px;
}
}
</style>