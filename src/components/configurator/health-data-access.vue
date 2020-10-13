<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-30 pr-30">
        <div class="row filds_section mt-40">
          <h5 class="header_text">
            <span class="fa fa-question-circle"></span>
            <span>How does this work?</span>
          </h5>
          <div
            class="fs-12"
          >Both iOS and Android have their respective apps that aggregates health data from users’ wearables or apps. By enabling any of the data points below, you will be able to gain access to data your participant's have provided to the Health App or Google Fit –with your participant's consent only. You will only receive data if your participants have devices or other third-party apps that gather and push data to the Health App or Google Fit.</div>
        </div>
        <div class="row mt-20">
          <h4 class="header_title fs-20">Apple iOS: Health App</h4>
          <div class="header_text">{{dataAccessLength}} data points selected</div>
          <div class="pb-10 pt-5">
            <a
              class="color_blue cursor_pointer"
              v-if="!collapse"
              v-on:click="collapse = true"
            >Collapse</a>
            <a
              class="color_blue cursor_pointer"
              v-if="collapse"
              v-on:click="collapse = false"
            >Expand</a>
          </div>
        </div>
        <div class="row mt-10 mb-10" v-if="!collapse">
          <span v-for="(item, index) in dataAccess" :key="index">
            <div v-if="index === 0">
              <a
                class="color_blue br-1 pr-10 cursor_pointer"
                v-on:click="selectAll(true)"
              >Select all</a>
              <a class="color_blue pl-5 cursor_pointer" v-on:click="selectAll(false)">Deselect all</a>
            </div>
            <div class="section_heading" v-if="index === 0">
              <img src="static/img/Icon_eMR.svg" class="mr-4" />
              Health Records Data <span class="description">Health Records currently have limited institutional support internationally.</span>
            </div>
            <div class="section_heading" v-if="index === 7">
              <i class="fa fa-male fs-28 color_yellow pr-10" aria-hidden="true"></i>Body Measurements
            </div>
            <div class="section_heading" v-if="index === 12">
              <i class="fa fa-stethoscope fs-28 color_grey pr-10" aria-hidden="true"></i>Vital Signs
            </div>
            <div class="section_heading" v-if="index === 16">
              <i class="fa fa-fire fs-28 color_red pr-10" aria-hidden="true"></i>Activity
            </div>
            <div class="section_heading" v-if="index === 30">
              <i class="fa fa-flask fs-28 color_red pr-10" aria-hidden="true"></i>Results
            </div>
            <div class="section_heading" v-if="index === 41">
              <img src="/static/img/icn-nutrition.svg" class="pr-10" />Nutrition
            </div>
            <div class="section_heading" v-if="index === 80">
              <i class="fa fa-moon-o fs-28 color_blue pr-10" aria-hidden="true"></i>Sleep
            </div>
            <div class="section_heading" v-if="index === 81">
              <i class="fa fa-asterisk fs-28 color_blue pr-10" aria-hidden="true"></i>Reproductive Health
            </div>
            <span class="col-lg-3 col-md-3 col-sm-6 col-xs-6 mt-10">
              <span class="col-lg-2 col-md-2 col-sm-4 col-xs-4 pl-0 ml-0 pr-0 ml-0">
                <label class="switch display">
                  <input
                    type="checkbox"
                    v-model="item.isSelected"
                    v-on:change="changeVisibility(item, index)"
                  />
                  <div class="slider round"></div>
                </label>
              </span>
              <span class="col-lg-10 col-md-10 col-sm-10 col-xs-10 ml-0">{{item.title}}</span>
            </span>
          </span>
        </div>
        <div class="row bt-1">
          <h4 class="header_title fs-20 mt-30">Android: Google Fit</h4>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 filds_section mt-15">
            <h5 class="header_text">
              <span class="fa fa-android color_blue"></span>
              <span>Important information regarding Google Fit data</span>
            </h5>
            <div
              class="fs-12"
            >Unlike iOS, Android users do not have the Google Fit app pre-installed on their phones. Android users are required to manually download the app from the Google Play store.</div>
          </div>
        </div>
        <div class="pb-10 mt-20">
          <span class="back_link" v-on:click="goBack()">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
          </span>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="row" v-if="isStudySummary">
            <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
            <b-btn
              class="btn br-25 disable-btn p-0 pt-5 mr-10"
              :to="{ name: 'study-summary', params: { studyId: studyId } }"
            >Back to study summary</b-btn>
            <button class="btn br-25 continue-btn mr-10" v-on:click="nextClick()">Save and Continue</button>
          </div>
          <div class="row" v-if="!isStudySummary">
            <button class="btn br-25 disable-btn mr-10" v-on:click="skipForNow()">Skip for now</button>
            <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
          </div>
        </div>
      </div>
      <CancelModal ref="cancelConfirmation" />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "health-data-access",
  data() {
    return {
      studyId: null,
      collapse: false,
      dataAccess: [
        {
          title: "Height",
          key: "height",
          type: "bodyMeasurements",
          isSelected: false
        },
        {
          title: "Weight",
          key: "weight",
          type: "bodyMeasurements",
          isSelected: false
        },
        {
          title: "Body mass index",
          key: "bodyMassIndex",
          type: "bodyMeasurements",
          isSelected: false
        },
        {
          title: "Body fat percentage",
          key: "bodyFatPercentage",
          type: "bodyMeasurements",
          isSelected: false
        },
        {
          title: "Lean body mass",
          key: "leanBodyMass",
          type: "bodyMeasurements",
          isSelected: false
        },
        {
          title: "Heart rate",
          key: "heartRate",
          type: "vitalSigns",
          isSelected: false
        },
        {
          title: "Body temperature",
          key: "bodyTemperature",
          type: "vitalSigns",
          isSelected: false
        },
        {
          title: "Blood pressure",
          key: "bloodPressure",
          type: "vitalSigns",
          isSelected: false
        },
        {
          title: "Respiratory rate",
          key: "respiratoryRate",
          type: "vitalSigns",
          isSelected: false
        },
        {
          title: "Active energy",
          key: "activeEnergy",
          type: "activity",
          isSelected: false
        },
        {
          title: "Cycling distance",
          key: "cyclingDistance",
          type: "activity",
          isSelected: false
        },
        {
          title: "Exercise minutes",
          key: "exerciseMinutes",
          type: "activity",
          isSelected: false
        },
        {
          title: "Flights climbed",
          key: "flightsClimbed",
          type: "activity",
          isSelected: false
        },
        {
          title: "NikeFuel points",
          key: "nikeFuelPoints",
          type: "activity",
          isSelected: false
        },
        {
          title: "Pushes",
          key: "pushes",
          type: "activity",
          isSelected: false
        },
        {
          title: "Resting energy",
          key: "restingEnergy",
          type: "activity",
          isSelected: false
        },
        {
          title: "Stand hours",
          key: "standHours",
          type: "activity",
          isSelected: false
        },
        {
          title: "Steps",
          key: "steps",
          type: "activity",
          isSelected: false
        },
        {
          title: "Swimming distance",
          key: "swimmingDistance",
          type: "activity",
          isSelected: false
        },
        {
          title: "Swimming strokes",
          key: "swimmingStrokes",
          type: "activity",
          isSelected: false
        },
        {
          title: "Walk/run distance",
          key: "walkRunDistance",
          type: "activity",
          isSelected: false
        },
        {
          title: "Wheelchair distance",
          key: "wheelchairDistance",
          type: "activity",
          isSelected: false
        },
        {
          title: "Workouts",
          key: "workouts",
          type: "activity",
          isSelected: false
        },
        {
          title: "Blood alcohol content",
          key: "bloodAlcoholContent",
          type: "results",
          isSelected: false
        },
        {
          title: "Blood glucose",
          key: "bloodGlucose",
          type: "results",
          isSelected: false
        },
        {
          title: "Electrodermal activity",
          key: "electrodermalActivity",
          type: "results",
          isSelected: false
        },
        {
          title: "Forced expiratoy volume",
          key: "forcedExpiratoyVolume",
          type: "results",
          isSelected: false
        },
        {
          title: "Forced vital capacity",
          key: "forcedVitalCapacity",
          type: "results",
          isSelected: false
        },
        {
          title: "Inhaler usage",
          key: "inhalerUsage",
          type: "results",
          isSelected: false
        },
        {
          title: "Number of times fallen",
          key: "numberOfTimesFallen",
          type: "results",
          isSelected: false
        },
        {
          title: "Oxygen saturation",
          key: "oxygenSaturation",
          type: "results",
          isSelected: false
        },
        {
          title: "Peak expiratory flow rate",
          key: "peakExpiratoryFlowRate",
          type: "results",
          isSelected: false
        },
        {
          title: "Peripheral perfusion index",
          key: "peripheralPerfusionIndex",
          type: "results",
          isSelected: false
        },
        {
          title: "UV index",
          key: "uvIndex",
          type: "results",
          isSelected: false
        },
        {
          title: "Sleep analysis",
          key: "sleepAnalysis",
          type: "sleep",
          isSelected: false
        },
        {
          title: "Basal body temperature",
          key: "basalBodyTemperature",
          type: "reproductiveHealth",
          isSelected: false
        },
        {
          title: "Cervical mucus quality",
          key: "cervicalMucusQuality",
          type: "reproductiveHealth",
          isSelected: false
        },
        {
          title: "Menstruation",
          key: "menstruation",
          type: "reproductiveHealth",
          isSelected: false
        },
        {
          title: "Ovulation test result",
          key: "ovulationTestResult",
          type: "reproductiveHealth",
          isSelected: false
        },
        {
          title: "Sexual activity",
          key: "sexualActivity",
          type: "reproductiveHealth",
          isSelected: false
        },
        {
          title: "Spotting",
          key: "spotting",
          type: "reproductiveHealth",
          isSelected: false
        }  
      ],
      nutritionDataTemp: [
        {
          title: "Biotin",
          key: "dietaryBiotin",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Caffeine",
          key: "dietaryCaffeine",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Calcium",
          key: "dietaryCalcium",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Carbohydrates",
          key: "dietaryCarbohydrates",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Chloride",
          key: "dietaryChloride",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Chromium",
          key: "dietaryChromium",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Copper",
          key: "dietaryCopper",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Dietary cholesterol",
          key: "dietaryCholesterol",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Dietary energy",
          key: "dietaryEnergyConsumed",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Dietary sugar",
          key: "dietarySugar",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Fiber",
          key: "dietaryFiber",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Folate",
          key: "dietaryFolate",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Iodine",
          key: "dietaryIodine",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Iron",
          key: "dietaryIron",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Magnesium",
          key: "dietaryMagnesium",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Manganese",
          key: "dietaryManganese",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Molybdenum",
          key: "dietaryMolybdenum",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Monounsaturated Fat",
          key: "dietaryFatMonounsaturated",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Niacin",
          key: "dietaryNiacin",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "PantothenicAcid",
          key: "dietaryPantothenicAcid",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Phosphorus",
          key: "dietaryPhosphorus",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Polyunsaturated Fat",
          key: "dietaryFatPolyunsaturated",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Potassium",
          key: "dietaryPotassium",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Protein",
          key: "dietaryProtein",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Riboflavin",
          key: "dietaryRiboflavin",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Saturated Fat",
          key: "dietaryFatSaturated",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Selenium",
          key: "dietarySelenium",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Sodium",
          key: "dietarySodium",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Thiamin",
          key: "dietaryThiamin",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Total Fat",
          key: "dietaryFatTotal",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin A",
          key: "dietaryVitaminA",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin B12",
          key: "dietaryVitaminB12",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin B6",
          key: "dietaryVitaminB6",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin C",
          key: "dietaryVitaminC",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin D",
          key: "dietaryVitaminD",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin E",
          key: "dietaryVitaminE",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Vitamin K",
          key: "dietaryVitaminK",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Water",
          key: "dietaryWater",
          type: "nutrition",
          isSelected: false
        },
        {
          title: "Zinc",
          key: "dietaryZinc",
          type: "nutrition",
          isSelected: false
        }
      ],
      healthRecordsData: [
        {
          title: "Allergies",
          key: "allergies",
          type: "healthRecordsData",
          isSelected: false
        },
        {
          title: "Clinical Vitals",
          key: "clinicalVitals",
          type: "healthRecordsData",
          isSelected: false
        },
        {
          title: "Conditions",
          key: "conditions",
          type: "healthRecordsData",
          isSelected: false
        },
        {
          title: "Immunizations",
          key: "immunizations",
          type: "healthRecordsData",
          isSelected: false
        },
        {
          title: "Lab Results",
          key: "labResults",
          type: "healthRecordsData",
          isSelected: false
        },
        {
          title: "Medications",
          key: "medications",
          type: "healthRecordsData",
          isSelected: false
        },
        {
          title: "Procedures",
          key: "procedures",
          type: "healthRecordsData",
          isSelected: false
        }
      ],
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.getHealthData();
    //this.dataAccessValue();
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 240;
    }, 2500);
  },
  computed: {
    dataAccessLength() {
      return _.filter(this.dataAccess, o => o.isSelected).length; //eslint-disable-line
    }
  },
  methods: {
    getHealthData() {
      this.$api.getHealthAccessFact(this.studyId).then(
        response => {
          if (response.body.healthDataAccesses) {
            this.dataAccess = response.body.healthDataAccesses;
            this.addNewHealthData();
          } else {
            this.addNewHealthData();
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting app data points"
          );
        }
      );
    },
    dataAccessValue() {
      this.dataAccess.forEach((item, index) => {
        //eslint-disable-line
        this.dataAccess[index].index = index + 1;
        this.dataAccess[index].position = index + 1;
        this.dataAccess[index].meta = "";
      });      
    },
    addNewHealthData() {
      const nutritionData = _.find(this.dataAccess, ["type", "nutrition"]);
      if (!nutritionData) {
        let nutritionDataIndexStart = 34;
        this.nutritionDataTemp.forEach(element => {
          this.dataAccess.splice(nutritionDataIndexStart, 0, element);
          nutritionDataIndexStart += 1;
        });
      }
      
      const hrdObject = _.find(this.dataAccess, ["type", "healthRecordsData"]);
      if (!hrdObject) {
        let hrdIndexStart = 0;
        this.healthRecordsData.forEach(element => {
          this.dataAccess.splice(hrdIndexStart, 0, element);
          hrdIndexStart += 1;
        });
      }

      /* //Experimental CODE to group the access data points by type along with sort order
      let sortOrder = {
        "healthRecordsData" : 1,
        "bodyMeasurements" : 2,
        "vitalSigns": 3,
        "activity": 4,
        "results": 5,
        "nutrition": 6,
        "sleep": 7,
        "reproductiveHealth" : 8
      }
      let structuredArray = [];
      this.dataAccess.forEach(element => {
        let findTypeIndex = _.findIndex(structuredArray, ['type', element.type]);
        if(findTypeIndex>=0)
        {
          let findKey = _.find(structuredArray[findTypeIndex].items, ['key', element.key])
          if(!findKey)
          {
            structuredArray[findTypeIndex].items.push(element);
          }  
        }else{
          structuredArray.push({
            type: element.type,
            items: [element],
            order: sortOrder[element.type]
          });
        }
      });
      structuredArray = _.sortBy(structuredArray, ['order']);
      console.log('====================', structuredArray);
      //EXPERIMENTAL CODE end */
      this.dataAccessValue();
    },
    goBack() {
      window.history.back();
    },
    changeVisibility(item, index) {
      this.dataAccess[index].isSelected = item.isSelected;
    },
    selectAll(status) {
      this.dataAccess = this.dataAccess.map(item => ({
        ...item,
        isSelected: status
      }));
    },
    nextClick() {
      this.$api
        .saveHealthAccessFact(this.studyId, {
          healthDataAccesses: this.dataAccess
        }) // eslint-disable-line
        .then(
          () => {
            const selectedFeatures = this.$store.getters.getSelectedFeatures;
            const featureIndex = _.findIndex(selectedFeatures, [
              "route",
              this.$route.name
            ]);
            if (featureIndex === selectedFeatures.length - 1) {
              this.$router.push({ name: "features-library-final" });
            } else {
              this.$router.push({
                name: selectedFeatures[featureIndex + 1].route,
                params: { studyId: this.studyId }
              }); // eslint-disable-line
            }
          },
          error => {
            const err =
              error.body && error.body.message
                ? error.body.message
                : "Error while sending the resgistration details";
            toastr.error(err);
          }
        );
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, [
        "route",
        this.$route.name
      ]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    }
  },
  components: { studyFeatureHeader, CancelModal }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
}

.h4,
h4 {
  margin-top: 10px;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

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
  //flex: none;
  display: block;
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
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
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
  .col-md-2 {
    flex: none;
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
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
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
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)
x .form-control {
  border: solid 1px #d3dfe4 !important;
  height: 40px !important;
}
button {
  cursor: pointer;
  border: none !important;
  outline: 0px solid !important;
}
.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}
.passcode_icon {
  width: 15px;
  height: 15px;
}
button:focus {
  outline: 0px solid transparent;
}
.section_heading {
  font-size: 14px;
  clear: both;
  font-weight: bold;
  padding: 15px 0;
  color: #666769;
  .description {
    display: inline-block;
    margin-left: 22px;
    color: #666669;
    opacity: 0.7;
    line-height: 1.33;
    font-size: 13px;
    font-family: Roboto;
  }
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
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 23px;
}
.header_text {
  font-size: 16px;
  color: #1d7fee;
  font-weight: bold;
}

/* Hide default HTML checkbox */
.switch input {
  display: none;
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
.cross_icon {
  color: #ccc;
  position: absolute;
  right: 41px;
  top: 4px;
  font-size: 16px;
}

.filds_section {
  border-radius: 8px;
  padding: 15px 0px 10px 20px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
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
.bg-grey {
  background-color: #ccc;
}
</style>
