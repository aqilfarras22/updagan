<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyReviewHeader></studyReviewHeader>
      <div class="p-20">
        <div class="row fs-24 fw-bold" style="color:#333;"> Your study summary</div>
        <div class="fs-14 pt-10 pb-20">Please review your study elements summary to make sure that all elements are accounted for. If an item has a green
          check <i class="fa fa-check-circle color_green" aria-hidden="true"></i> next to it, it has been fully configured.
          If an item has a red cross <i class="fa fa-times-circle color_red" aria-hidden="true"></i> next to it, configuration
          has not been completed for the item. You may then go to that item and finish configurating.</div>
        <div class="card pt-15 pb-20">
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-3 p-0">
              <span class="image_width"><img :src="multilingualIcon" alt=""></span>
              <span class="fs-16 pl-14 fw-bold">Countries</span>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-6 col-xs-6 p-0">
              <span class="fs-16 pl-19 fw-bold">Languages</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('study-design', '5')">View</button>
            </div>
            <div class="pl-40">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-3 p-0" style="clear:both;">
                  <div class="side-rows p-0" v-for="(items, index) in supportedCountry" :key="index">
                    <div class="row" v-for="(rec, i) in items" :key="i">
                      <div class="fs-12">{{rec.country}}</div>
                    </div>
                  </div>
                  <!-- <div class="fs-12" v-for="(items, index) in supportedLanguagesAndCountries" :key="index">{{items.country}}</div> -->
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 p-0">
                  <div class="side-rows p-0" v-for="(items, index) in supportLanguages" :key="index">
                    <div class="row" v-for="(rec, i) in items" :key="i">
                      <div v-if="rec != null && rec.display_name != null" class="fs-12">{{rec.display_name}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.branding">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="branding_icon"></span>-->
              <span class="image_width"><img :src="branding_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold">Branding</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('branding')">View</button>
            </div>
            <div class="pl-40 pt-5">
              <div class="row pt-30">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.branding.appName && selectedFeatures.branding.condensedAppName"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!(selectedFeatures.branding.appName && selectedFeatures.branding.condensedAppName)"></span>
                  <span class="fs-12 pl-5">Study and app name</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!(selectedFeatures.branding.appName && selectedFeatures.branding.condensedAppName)"
                    v-on:click="changeRoute('branding')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.branding.appLogo && selectedFeatures.branding.appIcon"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!(selectedFeatures.branding.appLogo && selectedFeatures.branding.appIcon)"></span>
                  <span class="fs-12 pl-5">Logo and app icon</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!(selectedFeatures.branding.appLogo && selectedFeatures.branding.appIcon)" v-on:click="changeRoute('branding')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.branding.colorPalette"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.branding.colorPalette"></span>
                  <span class="fs-12 pl-5">Color palette</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.branding.colorPalette" v-on:click="changeRoute('branding')">Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.registration">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="registration_icon"></span>-->
              <span class="image_width"><img :src="registration_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold">Registration</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('registration')">View</button>
            </div>
            <div class="pl-40 pt-5">
              <div class="row pt-30">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.registration.participantInformation"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.registration.participantInformation"></span>
                  <span class="fs-12 pl-5">Participate information</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.registration.participantInformation" v-on:click="changeRoute('registration')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.registration.contactInformation"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.registration.contactInformation"></span>
                  <span class="fs-12 pl-5">Contact information</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.registration.contactInformation" v-on:click="changeRoute('registration')">Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.onBoarding">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="onboarding_icon"></span>-->
              <span class="image_width"><img :src="onboarding_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold">Onboarding</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('onboarding')">View</button>
            </div>
            <div class="pl-40 pt-5">
              <div class="row pt-30">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.onBoarding.studyDescription"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.onBoarding.studyDescription"></span>
                  <span class="fs-12 pl-5">Study description</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.onBoarding.studyDescription" v-on:click="changeRoute('onboarding')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.onBoarding.informationScreens"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.onBoarding.informationScreens"></span>
                  <span class="fs-12 pl-5">Information screens</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                  <span class="fs-12" v-if="selectedFeatures.onBoarding.informationScreensCount">{{selectedFeatures.onBoarding.informationScreensCount}} screens</span>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.onBoarding.informationScreens" v-on:click="changeRoute('onboarding')">Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.eligibility">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="eligibility_icon"></span>-->
              <span class="image_width"><img :src="eligibility_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold">Eligibility</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('eligibility')">View</button>
            </div>
            <div class="pl-40 pt-5">
              <div class="row pt-30">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.eligibility.eligibilityScreener"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.eligibility.eligibilityScreener"></span>
                  <span class="fs-12 pl-5">Eligibility screener</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                  <span class="fs-12" v-if="selectedFeatures.eligibility.questionCount">{{selectedFeatures.eligibility.questionCount}} questions</span>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.eligibility.eligibilityScreener" v-on:click="changeRoute('eligibility')">Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.eConsentAndLegal && isMultipleConsent == false">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="eConsent_icon"></span>-->
              <span class="image_width"><img :src="eConsent_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold">eConsent</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('econsent')">View</button>
            </div>
            <div class="pl-40 pt-5">
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.eConsentAndLegal.educationScreensCount"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.eConsentAndLegal.educationScreensCount"></span>
                  <span class="fs-12 pl-5">Education screens</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                  <span class="fs-12" v-if="selectedFeatures.eConsentAndLegal.educationScreensCount">{{selectedFeatures.eConsentAndLegal.educationScreensCount}} screens</span>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.eConsentAndLegal.educationScreensCount" v-on:click="changeRoute('econsent')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.eConsentAndLegal.consentDocLink"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.eConsentAndLegal.consentDocLink"></span>
                  <span class="fs-12 pl-5">Consent doc</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                  <span class="fs-12 color_blue"></span>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.eConsentAndLegal.consentDocLink" v-on:click="changeRoute('econsent')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.eConsentAndLegal.comprehensionQuizCount"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.eConsentAndLegal.comprehensionQuizCount"></span>
                  <span class="fs-12 pl-5">Comprehension quiz</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                  <span class="fs-12" v-if="selectedFeatures.eConsentAndLegal.comprehensionQuizCount">{{selectedFeatures.eConsentAndLegal.comprehensionQuizCount}} questions</span>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.eConsentAndLegal.comprehensionQuizCount" v-on:click="changeRoute('econsent')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.eConsentAndLegal.privacyPolicy"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.eConsentAndLegal.privacyPolicy"></span>
                  <span class="fs-12 pl-5">Privacy policy</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.eConsentAndLegal.privacyPolicy" v-on:click="changeRoute('econsent')">Review</span>
                </div>
              </div>              
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.eConsentAndLegal.licenses"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.eConsentAndLegal.licenses"></span>
                  <span class="fs-12 pl-5">Licenses</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.eConsentAndLegal.licenses" v-on:click="changeRoute('econsent')">Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card pt-15 pb-20" v-if="selectedFeatures.multiEConsentAndLegal && isMultipleConsent == true">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">              
              <span class="image_width"><img :src="eConsent_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold">eConsents</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('multieconsent')">View</button>
            </div>


            <div class="pl-40 pt-5">
              <div v-for="consent in selectedFeatures.multiEConsentAndLegal.consents" :key="consent.consentId">
                <div class="row">
                  <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">                                
                    <span class=" fs-14 color_green" v-html="check_icon" v-if="consent.educationScreensCount && consent.valid && consent.comprehensionQuizCount"></span>
                    <span class=" fs-14 color_red" v-html="times_icon" v-else></span>
                    <span class="fs-14 fw-bold ml-5">{{consent.consentName}}</span>
                  </div>
                </div>
                <div class="ml-20">
                <div class="row">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                    <span class=" fs-14 color_green" v-html="check_icon" v-if="consent.educationScreensCount"></span>
                    <span class=" fs-14 color_red" v-html="times_icon" v-if="!consent.educationScreensCount"></span>
                    <span class="fs-12 pl-5">Education screens</span>
                  </div>
                  <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                    <span class="fs-12" v-if="consent.educationScreensCount">{{consent.educationScreensCount}} screens</span>
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                    <span class="fs-12 review_link" v-if="!consent.educationScreensCount" v-on:click="changeRoute('multieconsent')">Review</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                    <span class=" fs-14 color_green" v-html="check_icon" v-if="consent.valid"></span>
                    <span class=" fs-14 color_red" v-html="times_icon" v-if="!consent.valid"></span>
                    <span class="fs-12 pl-5">Consent doc</span>
                    <div class="fs-12 pl-20" v-for="record in consent.listOfdocumentProperties">
                      <span class=" fs-14 color_green" v-html="check_icon" v-if="record.valid"></span>
                      <span class=" fs-14 color_red" v-html="times_icon" v-if="!record.valid"></span>
                      <span v-if="record != null && record.language != null && record.language.display_name != null" class="ml-5">{{record.language.display_name}}</span>
                    </div>
                    <div class="fs-12 pl-20" v-for="(disclaimerObj, dIndex) in consent.listOfDisclaimer" :key="disclaimerObj.disclaimerId">
                      <span class=" fs-14 color_green" v-html="check_icon" v-if="disclaimerObj.disclaimer.trim()!=''"></span>
                      <span class=" fs-14 color_red" v-html="times_icon" v-else></span>
                      <span class="ml-5">Disclaimer {{dIndex+1}}</span>
                    </div>
                  </div>
                  <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                    <span class="fs-12 color_blue"></span>
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                    <span class="fs-12 review_link" v-if="!consent.valid" v-on:click="changeRoute('multieconsent')">Review</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                    <span class=" fs-14 color_green" v-html="check_icon" v-if="consent.comprehensionQuizCount"></span>
                    <span class=" fs-14 color_red" v-html="times_icon" v-if="!consent.comprehensionQuizCount"></span>
                    <span class="fs-12 pl-5">Comprehension quiz</span>
                  </div>
                  <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                    <span class="fs-12" v-if="consent.comprehensionQuizCount">{{consent.comprehensionQuizCount}} questions</span>
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                    <span class="fs-12 review_link" v-if="!consent.comprehensionQuizCount" v-on:click="changeRoute('multieconsent')">Review</span>
                  </div>
                </div>
                </div>
              </div>

              <div class="row pt-30">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.multiEConsentAndLegal.privacyPolicy"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.multiEConsentAndLegal.privacyPolicy"></span>
                  <span class="fs-12 pl-5">Privacy policy</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.multiEConsentAndLegal.privacyPolicy" v-on:click="changeRoute('multieconsent')">Review</span>
                </div>
              </div>              
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.multiEConsentAndLegal.licenses"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.multiEConsentAndLegal.licenses"></span>
                  <span class="fs-12 pl-5">Licenses</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.multiEConsentAndLegal.licenses" v-on:click="changeRoute('multieconsent')">Review</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="selectedFeatures.multiEConsentAndLegal.isCohort"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!selectedFeatures.multiEConsentAndLegal.isCohort"></span>
                  <span class="fs-12 pl-5">Cohort</span>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                </div>
                <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                  <span class="fs-12 review_link" v-if="!selectedFeatures.multiEConsentAndLegal.isCohort" v-on:click="changeRoute('multieconsent')">Review</span>
                </div>
              </div>    
            </div>
          </div>
        </div>

        <div class="card pt-15 pb-20" v-if="selectedFeatures.surveys">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="surveys_icon"></span>-->
              <span class="image_width"><img :src="surveys_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Surveys:</span><span class="fs-16 color_blue fw-bold ">{{selectedFeatures.surveys.length}}</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('surveys')">View</button>
            </div>
            <div class="pl-40 pt-35">
              <div v-if="selectedFeatures.surveys.length > 0">
                <div class="row" v-for="survey in selectedFeatures.surveys">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                    <span class=" fs-14 color_green" v-html="check_icon" v-if="survey.status"></span>
                    <span class=" fs-14 color_red" v-html="times_icon" v-if="!survey.status"></span>
                    <span class="fs-12 pl-5">{{survey.name}}</span>
                  </div>
                  <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                    <span class="fs-12" v-if="survey.questionCount">{{survey.questionCount}} screens</span>
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                    <span class="fs-12 review_link" v-if="!survey.status" v-on:click="changeRoute('surveys')">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.ePROs">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="ePROs_icon"></span>-->
              <span class="image_width"><img :src="ePROs_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">ePROs:</span><span class="fs-16 color_blue fw-bold ">{{selectedFeatures.ePROs.length}}</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('epros')">View</button>
            </div>
            <div class="pl-40 pt-35">
              <div v-if="selectedFeatures.ePROs.length > 0">
                <div class="row" v-for="ePRO in selectedFeatures.ePROs">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                    <span class=" fs-14 color_green" v-html="check_icon" v-if="ePRO.status"></span>
                    <span class=" fs-14 color_red" v-html="times_icon" v-if="!ePRO.status"></span>
                    <span class="fs-12 pl-5">{{ePRO.name}}</span>
                  </div>
                  <div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
                    <span class="fs-12" v-if="ePRO.questionCount">{{ePRO.questionCount}} questions</span>
                  </div>
                  <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 text-center" style="float:right;">
                    <span class="fs-12 review_link" v-if="!ePRO.status" v-on:click="changeRoute('epros')">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.eDROs">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="eDROs_icon"></span>-->
              <span class="image_width"><img :src="eDROs_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">eDROs:</span><span class="fs-16 color_blue fw-bold ">{{selectedFeatures.eDROs.length}}</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('edros')">View</button>
            </div>
            <div class="pl-40 pt-35" v-if="selectedFeatures.eDROs.length > 0">
              <div class="row" v-for="eDRO in selectedFeatures.eDROs">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon" v-if="eDRO.status"></span>
                  <span class=" fs-14 color_red" v-html="times_icon" v-if="!eDRO.status"></span>
                  <span class="fs-12 pl-5">{{eDRO.name}}</span>
                </div>
                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 text-right pr-30">
                  <span class="fs-12 review_link" v-if="!eDRO.status" v-on:click="changeRoute('edros')">Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.epic">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="engagementContent_icon"></span>-->
              <span class="image_width"><img :src="engagementContent_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Epic MyChart</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('epic-mychart')">View</button>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.dashboards">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="dashboard_icon"></span>-->
              <span class="image_width"><img :src="dashboard_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Dashboard:</span><span class="fs-16 color_blue fw-bold ">{{selectedFeatures.dashboards.length}}</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('dashboards')">View</button>
            </div>

            <div class="pl-40 pt-5" v-if="selectedFeatures.dashboards.length > 0">
              <div class="fs-12 color_959fa4">Dashboard selected:</div>
              <div class="row" v-for="dashboard in selectedFeatures.dashboards">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 p-0">
                  <span class=" fs-14 color_green" v-html="check_icon"></span>
                  <span class="fs-12 pl-5">{{dashboard}}</span>
                </div>
              </div>
            </div>
            <div class="pl-40 pt-5" v-if="!selectedFeatures.dashboardValid">
              <div class="fs-12"> <span class=" fs-14 color_red" v-html="times_icon"></span> <span class="pl-5">No dashboard(s) enabled.</span></div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.medicalDevicesAndWearables">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="medicalDevicesAndWearables_icon"></span>-->
              <span class="image_width"><img :src="medicalDevicesAndWearables_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Sensors</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('medical-devices')">View</button>
            </div>
            <div class="pl-40 pt-5" v-if="selectedFeatures.medicalDevicesAndWearables.length > 0">
              <div class="fs-12 color_959fa4 pb-10">Selected Sensors:</div>
              <div class="row fs-12">
                <div v-for="(medicalDevice,index) in selectedFeatures.medicalDevicesAndWearables">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0" v-if="index < 6">
                    <li>{{medicalDevice}}</li>
                    <!--<span class="fs-12 pl-5">{{medicalDevice}}</span>-->
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0" v-if="index >= 6 && showMore">
                    <li>{{medicalDevice}}</li>
                    <!--<span class="fs-12 pl-5">{{medicalDevice}}</span>-->
                  </div>
                </div>
              </div>
              <div class="row pt-10">
                <span class="fs-12 color_1f95f2 cursor_pointer" v-on:click="showMore=true" v-if="!showMore && selectedFeatures.medicalDevicesAndWearables.length >= 6">Show more</span>
                <span class="fs-12 color_1f95f2 cursor_pointer" v-on:click="showMore=false" v-if="showMore">Show less</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card row pb-20" v-if="selectedFeatures.customNotifications">
          <div class="row mt-20">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="medicalDevicesAndWearables_icon"></span>-->
              <span class="image_width"><img :src="customNotification_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Notifications: {{selectedFeatures.customNotifications.length}}</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('notifications')">View</button>
            </div>
          </div>
          <div class="row fs-12 pl-40 pt-10 " v-if="selectedFeatures.customNotifications.length > 0">
            <div v-for="(notification,index) in selectedFeatures.customNotifications">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6 p-0">
                <span class=" fs-14 color_green" v-html="check_icon"></span> {{notification}}
              </div>
            </div>
          </div>
        </div>
        <div class="card pt-15 pb-20" v-if="selectedFeatures.engagementContent">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="engagementContent_icon"></span>-->
              <span class="image_width"><img :src="engagementContent_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Learn</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('engagement-content')">View</button>
            </div>
            <div class="pl-40 pt-5" v-if="!selectedFeatures.learnValid">
              <div class="fs-12"> <span class=" fs-14 color_red" v-html="times_icon"></span> <span class="pl-5">No screen(s)/feedback configured.</span></div>
            </div>
          </div>
        </div>
        <!-- <div class="card pt-15 pb-20" v-if="selectedFeatures.teleHealth == true || selectedFeatures.teleHealth == false">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <span class="image_width"><img :src="teleHealth_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Telehealth</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('tele-health')">View</button>
            </div>
          </div>
          <div class="fs-12 pl-40 pt-10pl-40">
            <span class=" fs-14 color_green" v-if="selectedFeatures.teleHealth" v-html="check_icon"></span>
            <span class=" fs-14 color_red" v-if="!selectedFeatures.teleHealth" v-html="times_icon"></span> Enabled
          </div>
        </div> -->
        <div class="card pt-15 pb-20" v-if="selectedFeatures.teleHealthV2 == true || selectedFeatures.teleHealthV2 == false">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <span class="image_width"><img :src="teleHealth_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Telehealth</span>
              <span v-if="!selectedFeatures.teleHealthV2" class=" fs-14 color_red" v-html="times_icon"></span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('tele-health-v2')">View</button>
            </div>
          </div>
          <div v-if="countrySpecificStudyFeatures"  class="fs-12 pl-40">
            <div class="row" v-for="(country, keyIndex) in countrySpecificStudyFeatures" :key="keyIndex">
              <div class="col-lg-3 pl-0">
                <span class="fs-14 color_green" v-if="country.isTelehealthEnabled" v-html="check_icon"></span>    
                <span v-if="country.isTelehealthEnabled" class="pl-5">Enabled</span>
                <span v-else class="pl-17">Not enabled</span>
              </div> 
              <div class="col-lg-8">
                {{country.name}}
              </div> 
            </div>
          </div>
        </div>

        <div class="card pt-15 pb-20" v-if="selectedFeatures.healthData">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <!--<span class="color_blue fs-20" v-html="engagementContent_icon"></span>-->
              <span class="image_width"><img :src="engagementContent_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Mobile Health Data Access: {{selectedFeatures.healthData.length}}</span>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" v-if="selectedFeatures.healthData.length>0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('health-data-access')">View</button>
            </div>
            <ul class="mobile-health row color_grey pl-50">
              <li class="col-lg-3 col-md-3 col-sm-4 col-xs-6 fs-12 pl-0 pr-0" v-for="data in selectedFeatures.healthData">
                {{data}}
              </li>
            </ul>
            <div class="pl-20" v-if="selectedFeatures.healthData.length===0">
              <div class="col-md-7 pt-10">
                Hm, we see that you don’t have any health apps selected. Do you want to remove this element?
              </div>
              <div class="col-md-5">
                <button class="btn rmBtn" v-on:click="nextCustom()">Remove</button>
                <button class="btn hdBtn ml-10" v-on:click="changeRoute('health-data-access')">Add health apps</button>
              </div>
            </div>
          </div>
        </div>
         <div class="card pt-15 pb-20" v-if="selectedFeatures.activityOrderInfos &&  selectedFeatures.activityOrderInfos.length > 0">
          <div class="row">
            <div class="col-lg-11 col-md-11 col-sm-10 col-xs-9 p-0">
              <span class="image_width"><img :src="activityOrder_icon" alt=""></span>
              <span class="fs-16 p-10 fw-bold pr-5">Activity Order</span>
            <div class="pl-20">
              <ul class="activity-ul fs-12">
                <li v-for="(activity,index) in selectedFeatures.activityOrderInfos" :key='index'>
                  <div class="col-lg-11 col-md-11 col-sm-10">{{activity.activityName}}</div>
                </li>
              </ul>
            </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3 p-0" style="float:right;">
              <button class="btn btn-block view-btn" v-on:click="changeRoute('activity-order')">View</button>
            </div>
          </div>
          <div class="fs-12 pl-40 pt-10pl-40">
          </div>
        </div>
        <div class="card pt-15 pb-20">
          <div class="row">
            <!-- <router-link :to="{ name: 'features-library', params: { studyId }}"> -->
              <div class="btn-box cursor_pointer" v-on:click="changeRoute('features-library')"><span class="create_button"><span class="plus_icon">+</span></span><span class="text-btn">Add new element</span></div>
            <!-- </router-link> -->
          </div>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="row">
            <button type="button" class="btn nextBtn float-left br-25" v-if="isStudySummary" v-b-modal.cancelModifyingModal :disabled="!selectedFeatures.allowBuild">Cancel modifying</button>
            <button type="button" class="btn saveBtn br-25" v-on:click="nextClick()" :disabled="!selectedFeatures.allowBuild">Save and Continue</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit form confirmation  Modal Component -->
    <b-modal id="cancelModifyingModal" ref="cancelModifyingModal" @hidden="closeModal('cancelModifyingModal')" hide-footer hide-header>
      <b-row class="pt-20 border-style text-center">
        <b-col align-self="center" class="pb-0">
        </b-col>
      </b-row>
      <b-row class="text-center plr-60">
        Your changes will not be saved.<br>
        Are you sure you want to cancel modifying this study?
      </b-row>
      <b-row class="pt-20 pb-40 text-center">
        <b-col cols="12" class="pb-10">
          <button type="button" class="btn modifyBtn pl-10 pr-10 br-25" @click="cancelModifying()">
            Yes, cancel modifying study
          </button>
        </b-col>
        <b-col cols="12">
          <button type="button" class="btn cancelModifyBtn br-25" @click="closeModal('cancelModifyingModal')">
            No, do not cancel modifying study
          </button>
        </b-col>
      </b-row>
      <div class="modal-style">
      </div>
    </b-modal>
  </div>
</template>

<script>
import toastr from 'toastr';
import _ from 'lodash';
import studyReviewHeader from '../../common/study-review-header';
import services from '../../services';

export default {
  name: 'study-summary',
  data() {
    return {
      studyId: null,
      completed: true,
      check_icon: '<i class="fa fa-check-circle" aria-hidden="true"></i>',
      times_icon: '<i class="fa fa-times-circle" aria-hidden="true"></i>',
      branding_icon: 'static/img/features/branding.svg',
      registration_icon: 'static/img/features/registration.svg',
      onboarding_icon: 'static/img/features/onboarding.svg',
      eligibility_icon: 'static/img/features/eligibility.svg',
      eConsent_icon: 'static/img/features/econsent.svg',
      surveys_icon: 'static/img/features/patient_surveys.svg',
      eDROs_icon: 'static/img/features/edros.svg',
      dashboard_icon: 'static/img/features/patient_dashboards.svg',
      ePROs_icon: 'static/img/features/epros.svg',
      medicalDevicesAndWearables_icon: 'static/img/features/med-device-wearable.svg',
      engagementContent_icon: 'static/img/features/engagement_content.svg',
      customNotification_icon: 'static/img/features/notifications.svg',
      teleHealth_icon: 'static/img/features/tele_health.svg',
      activityOrder_icon: 'static/img/features/task-order-active.svg',
      multilingualIcon: 'static/img/features/globe.png',
      selectedFeatures: {},
      showMore: false,
      isStudySummary: JSON.parse(window.localStorage.getItem('thread-studySummary')),
      isMultipleConsent: true,
      supportedLanguages: null,
      supportedLanguagesAndCountries: [],
      defaultLanguage: null,
      countrySpecificStudyFeatures: null,
      supportLanguages: [],
      supportedCountry: []
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    this.getStudyDetail();
    this.isMultipleConsentEnabled();
    this.getCountrySpecificStudyFeatures();
  },
  methods: {
    getStudyDetail() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
        // by default it is USA
        this.supportLanguages = response.body.language;
        // sort language
        let defaultLang = null;
        this.supportLanguages.map((lang, index) => {
          if(lang.language_culture == 'EN' && index != 0) {
            this.supportLanguages.splice(index, 1);
            defaultLang = lang;
          }
        });
        this.supportLanguages = _.orderBy(this.supportLanguages, 'name');
        this.supportLanguages.splice(0, 0, defaultLang);

        let lGroup = this.calculateMinNoOfrows(this.supportLanguages, 3, 4); 
        let i = 0, languagesArr = [];
        do {
          languagesArr[i] = [];
          languagesArr[i] = this.supportLanguages.splice(0, lGroup);
          i++;
        }
        while (this.supportLanguages.length != 0);
        this.supportLanguages = languagesArr;

        this.supportedCountry = this.supportedLanguagesAndCountries;
        response.body.countryList.map(c => {
          if(c.isoCode3 == "USA") {
            if(this.supportedCountry.length > 0) {
              let cObj = {country: c.countryName};
              this.supportedCountry.splice(0, 0, cObj);
            } else {
              this.supportedCountry.push({country: c.countryName});
            }
          } else {
            this.supportedCountry.push({country: c.countryName});
          }
        });
        let cGroup = this.calculateMinNoOfrows(this.supportedCountry, 4, 4); 
        let k = 0, countriesArr = [];
        do {
          countriesArr[k] = [];
          countriesArr[k] = this.supportedCountry.splice(0, cGroup);
          k++;
        }
        while (this.supportedCountry.length != 0);
        this.supportedCountry = countriesArr;
        this.supportedLanguages = response.body.language;
      }, error => {
        toastr.error(
          error.body && error.body.message
            ? error.body.message
            : 'Error while getting the study details',
        );
      });
    },
    calculateMinNoOfrows(items, defaultRowSize, rowLength) {
      let rows = parseInt(items.length / defaultRowSize);
       if(rows > rowLength && items.length % defaultRowSize == 0) {
        return rows;
      } else if(rows > rowLength) {
        return rows + 1;
      }
      return rowLength;
    },
    closeModal(ref) {
      this.$refs[ref].hide();
    },
    cancelModifying() {
      this.$router.push({ name: 'dashboard', params: { studyId: this.studyId } });
    },
    isMultipleConsentEnabled() {
      const that = this;
      that.$api.getToggleFeaturesFact(that.studyId).then(
        response => {
          that.toggleFeatures = response.body.studyFeatures;

          // For Telehealth 2.0 Feature
          const isTelehealth = that.toggleFeatures.filter(x => x.featureKey == 'TELEHEALTH' && x.enabled == true); // eslint-disable-linedisable-line
          if ((isTelehealth == null || isTelehealth == undefined || isTelehealth == '') && isTelehealth.length == 0) { // eslint-disable-line
            try{
              that.features.splice(14, 1);
            }catch{
            }
          }

          const isEconsent = that.toggleFeatures.filter(x => x.featureKey == 'ECONSENT'); // eslint-disable-line
           if ((isEconsent == null || isEconsent == undefined || isEconsent == '') && isEconsent.length == 0) { // eslint-disable-line
            that.isMultipleConsent = true;
          } else {
            that.isMultipleConsent = false;
          }
          that.getStudyOverview();
        },
        error => {
          that.getStudyOverview();
          that.$toastr.error(error.body && error.body.message ?
            error.body.message : 'Error while getting features.');
        },
      );
    },
    nextClick() {
      this.$router.push({ name: 'generate-prototype' });
    },
    changeRoute(path, queryparam) {
      this.$router.push({ name: path, params: { studyId: this.studyId }, query: {step: queryparam} });
    },
    getStudyOverview() {
      const that = this;

      if (!that.isMultipleConsent) {
        that.$api.getStudyOveriviewFact(that.studyId).then(response => {
          if (response.body) {
            let order = false;
            that.selectedFeatures = response.body;
            if(response.body.activityOrderInfos) {
              response.body.activityOrderInfos.forEach((item, index) => {
            if(item.displayOrder === null) {
            order = true;
            }
       });
       if(order === true) {
        this.selectedFeatures.activityOrderInfos = _.sortBy(response.body.activityOrderInfos, 'sequence');
       }
       else {
        this.selectedFeatures.activityOrderInfos = _.sortBy(response.body.activityOrderInfos, 'displayOrder');
       }
            }
          }
        });
      } else {
        that.$api.getStudyOveriviewV2Fact(that.studyId).then(response => {
             if (response.body) {
            let order = false;
            that.selectedFeatures = response.body;
            this.processMultipleEConsent();
            if(response.body.activityOrderInfos) {
            response.body.activityOrderInfos.forEach((item, index) => {
            if(item.displayOrder === null) {
            order = true;
            }
       });
       if(order === true) {
        this.selectedFeatures.activityOrderInfos = _.sortBy(response.body.activityOrderInfos, 'sequence');
       }
       else {
        this.selectedFeatures.activityOrderInfos = _.sortBy(response.body.activityOrderInfos, 'displayOrder');
       }
            }
          }
        });
      }
    },
    processMultipleEConsent() {
      if(this.selectedFeatures.multiEConsentAndLegal.consents.length == 0) {
        return;
      }
       
      this.selectedFeatures.multiEConsentAndLegal.consents.forEach((consent) => {
        if(consent.consentDocLink == null && consent.listOfdocumentProperties && consent.listOfdocumentProperties.length > 0) {
          consent.listOfdocumentProperties.map((consentObj) => {
            if(consentObj.pdfLink == null) {
              consentObj.valid = false;
              consent.valid = false;
              return;
            }
            consentObj.valid = true;
            consent.valid = true;
          });
          this.checkForAllSupportedlanguage(consent);
        } else if(consent.consentDocLink == null) {
          consent.valid = false;
          consent.listOfdocumentProperties = [];
          this.checkForAllSupportedlanguage(consent);
        } else if(consent.consentDocLink != null) {
          consent.valid = true;
          let defaultLanguage = this.supportedLanguages.filter(lang => {
            if((lang.name).toLowerCase() == "english") {
              return lang;
            }
          });
          consent.listOfdocumentProperties = [];
          consent.listOfdocumentProperties.push({language:  defaultLanguage[0], valid: true});
          this.checkForAllSupportedlanguage(consent);
        }

        if(consent.listOfDisclaimer && consent.listOfDisclaimer.length>0){
          consent.listOfDisclaimer = _.filter(consent.listOfDisclaimer, 'status');
        }

      });
    },
    fetchSupportedLanguage(langObj, consent) {
      let languageDoc = consent.listOfdocumentProperties.filter((doc) => {
        if(doc.language.language_id == langObj.language_id) {
          return {doc: doc};
        }
      });

      return (languageDoc.length != 0 ) ? {doc : languageDoc[0]} : {doc : null};
    },
    checkForAllSupportedlanguage(consent) {
      let docArr = [];
      let flag = true;
      this.supportedLanguages.map((lang) => {
        let document = this.fetchSupportedLanguage(lang, consent);
        if(document.doc) {
          docArr.push({
            language: document.doc.language,
            valid: true
          })
        } else if(document.doc == null) {
          docArr.push({
            language: lang,
            valid: false
          })
          flag = false;
        }
      });
      consent.valid = flag;
      consent.listOfdocumentProperties = docArr;
    },
    nextCustom() {
      let studyLibraryFeatures = this.$store.getters.getSelectedFeatures; //eslint-disable-line
      const sectionIndex = _.findIndex(studyLibraryFeatures, ['index', 12]);
      studyLibraryFeatures.splice(sectionIndex, 1);
      const payload = { studyLibraryFeatures };
      this.$api.postLibraryFeaturesFact(this.studyId, payload).then(
        response => {
          services.saveSelectedFeatures(response.body.studyLibraryFeatures);
          this.getStudyOverview();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while sending the selected features to server',
          );
        },
      );
    },
    getCountrySpecificStudyFeatures() {
      this.$api.getCountrySpecificStudyFeatures(this.studyId).then(
        response => {
          this.countrySpecificStudyFeatures = response.body;
        },
        error => {
          toastr.error(
            error.body
              ? error.body.message
              : "Error while getting country specific telehealth status"
          );
        }
      );
    }
  },
  components: {
    studyReviewHeader,
  },
};
</script>

<style scoped lang="scss">

// Style for quick fixes bootstrap after migration (before redesign should be removed)

body{
  color: #333;
}

.h2, h2 {
    font-size: 30px;
    margin: 20px 0 10px;
}

.h3, h3{
  font-size:24px;
  color: #333;
}

.h4, h4 {
    font-size: 18px;
    margin: 10px 0;
}

.h5, h5 {
    font-size: 14px;
    margin: 10px 0;
}

.h6, h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn{
  font-size: 14px;
}

.p-20 {
    padding: 20px!important;
}

.plr-60 {
  padding-left: 60px;
  padding-right: 60px;
}

.col-xs-12 {
    width: 100%;
}

.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
    float: left;
    //flex: none;
    display: block;
}

.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
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
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}

.row{
  display: block;

  &:after{
  content: '';
    clear: both;
    display: block;
  }
}

.color_959fa4{
  color: #959fa4 !important;
}
.mobile-health {
  &.row {
    display: inline-block;
  }
}
@media (min-width: 768px){
  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
      float: left;
      display: block;
  }
  .col-sm-12 {
      width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2{
    flex: none;
  }
}


@media (min-width: 992px){
  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
      float: left;
      flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
      width: 100%;
  }
  .col-md-offset-6 {
    margin-left: 50%;
  }
}

@media (min-width: 1200px){
  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
  .col-lg-offset-8 {
    margin-left: 66.66666667%;
  }
  .col-lg-8 {
    width: 66.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.image_width {
  position: relative;
  top: -4px;
  width: 25px;
  text-align: center;
  display: inline-block;
}
.card:last-child {
  border-bottom: none;
}
.side-rows {
  width: 25%;
  float: left;
}

.card {
  border: none;
  border-bottom: 1px solid #d3dfe4;
}
.view-btn {
  border-radius: 100px;
  background-color: #f5f8fa !important;
  border: solid 1px #d3dfe4 !important;
  color: #1f95f2;
}
img {
  width: auto;
  height: 20px;
}
.review_link {
  color: #f39c12;
  cursor: pointer;
  text-decoration: underline;
  margin-right: -8px;
}
.rmBtn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #ff4848;
  color: #fff;
}
.hdBtn {
  width: 130px;
  height: 40px;
  border-radius: 100px;
  background-color: #1f95f2;
  color: #fff;
}
.modifyBtn {
  width: 300px;
  height: 40px;
  background-color: #1f95f2;
  color: #fff;
}
.cancelModifyBtn {
  width: 300px;
  height: 40px;
  opacity: 0.7;
  background-color: #959fa4;
  color: #ffffff
}
.btn-box {
  width: 200px;
  height: 36px;
  background-color: #2d3752;
  border-radius: 30px;
}
.text-btn {
  color: #fff;
  font-size: 16px;
  text-align: center;
  float: left;
  padding-top: 6px;
  padding-left: 10px;
}
.create_button {
  float: left;
  color: #5989e4;
  margin-top: 3px;
  margin-left: 5px;
  font-size: 32px;
  width: 30px;
  height: 30px;
  background-color: #ff7171;
  display: inline-block;
  border-radius: 50%;
  .plus_icon {
    color: #ffffff;
    position: relative;
    bottom: 11px;
    right: -5px;
  }
}
.mac {
  .create_button {
    .plus_icon {
      bottom: 9px;
    }
  }
}

</style>
