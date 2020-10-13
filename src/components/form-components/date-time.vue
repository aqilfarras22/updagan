<template>
  <div class="primaryBackGround">
    <div class="dateTime form-bg">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-20">
        <span class="sequence-style"><b>{{dateTime.sequence}}. </b></span>
        <!-- Drop down question -->
        <b-row class="pl-15 pr-15 pb-15 pt-0">
          <b-form-input type="text" class="fs-15 form-control ml-10 field-h40" v-model="dateTime.body" placeholder="Enter question or description" size="sm" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText" autocomplete="off">
          </b-form-input>
          <span v-if="validateQuestion" class="error-style ml-10">Question cannot be empty.</span>
        </b-row>
        <!-- Date Format -->
        <b-row class="pt-15 pl-25">
          <b-col class="p-0" v-if="dateTime.collectDate" :class="{'col-lg-5': dateTime.dateField.collect == 'MDY', 'col-lg-4': dateTime.dateField.collect == 'MY', 'col-lg-2': dateTime.dateField.collect == 'Y'}">
            <b-row class="p-0">
              <div v-for="(char, index) in dateTime.dateField.format" :key="index">
                <b-col class="pl-0" v-if="(dateTime.dateField.collect == 'MDY' || dateTime.dateField.collect == 'MY') && char == 'M'">
                  <b-form-select v-model="testSelect" class="fs-15 form-control field-h40 timeZoneText" v-if="(dateTime.dateField.collect == 'MDY' || dateTime.dateField.collect == 'MY') && char == 'M'">
                    <option :value="null">Month</option>
                  </b-form-select>
                </b-col>
                <b-col class="pl-0" v-if="dateTime.dateField.collect == 'MDY' && char == 'D'">
                  <b-form-select v-model="testSelect" class="fs-15 form-control field-h40 timeZoneText" size="sm" v-if="dateTime.dateField.collect == 'MDY' && char == 'D'">
                    <option :value="null">Date</option>
                  </b-form-select>
                </b-col>
                <b-col class="pl-0" v-if="char == 'Y'">
                  <b-form-select v-model="testSelect" class="fs-15 form-control field-h40 timeZoneText" size="sm" v-if="char == 'Y'">
                    <option :value="null">Year</option>
                  </b-form-select>
                </b-col>
              </div>
            </b-row>
          </b-col>
          <b-col cols="12" lg="6" class="p-0" v-if="dateTime.collectTime">
            <b-row class="p-0">
              <b-col cols="12" lg="3" class="pl-0 timeZoneText" v-if="dateTime.timeField.format == 'HH:mm'">
                <vue-timepicker class="color_9b9b9b" format="HH:mm"></vue-timepicker>
              </b-col>
              <b-col cols="12" lg="3" class="pl-0 timeZoneText" v-if="dateTime.timeField.format == 'hh:mm a'">
                <vue-timepicker class="color_9b9b9b" format="hh:mm"></vue-timepicker>
              </b-col>
              <b-col cols="12" lg="3" class="pr-0 pl-10" v-if="dateTime.timeField.format == 'hh:mm a'">
                <b-form-select v-model="testSelect" size="sm" class="fs-15 form-control field-h40 timeZoneText">
                  <option value="null">AM</option>
                  <option value="PM">PM</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="6" class="pr-0 pl-10" v-if="dateTime.timeField">
                <b-form-select v-model="testSelect" size="sm" class="fs-15 form-control field-h40 timeZoneText">
                  <option value="null">Select time zone</option>
                </b-form-select>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-form>
      <!-- data info -->
      <hr class="m-0">
      <b-row class="pl-35 pt-10 fs-15 pb-10">
        <b-form-checkbox @change="dateTime.collectDate = !dateTime.collectDate, addDateInfoSchema()" v-model="dateTime.collectDate" class="pl-0">
          <span class="pl-25 text-align">Collect date Info</span>
        </b-form-checkbox>
      </b-row>
      <!-- date info data -->
      <b-row class="pl-50 pt-10 pb-15 fs-12" v-if="dateTime.collectDate">
        <!-- date collect types -->
        <b-col class="pl-8 p-0" cols="12" lg="3">
          <div class="fs-13" :class="{'bright': dateTime.dateField.collect !== 'Y' }">
            <label class="fw-bold">Collect</label>
            <b-form-radio-group id="collectDateTypeId" name="collectDateTypeName" v-model="dateTime.dateField.collect" v-for="(collect, index) in dateCollectSchema" :key="index">
              <b-form-radio type="radio" v-bind:value="collect.value" class="p-0 mb-10" @change="updateCollect">
                <span class="pl-20 text-align fs-15">{{collect.text}}</span>
              </b-form-radio>
            </b-form-radio-group>
          </div>
        </b-col>
        <!-- date collect formats -->
        <!-- month, date, year -->
        <b-col class="pl-15 p-0" cols="12" lg="3" v-show="dateTime.dateField.collect == 'MDY'">
          <div class="fs-13">
            <label class="fw-bold">Format</label>
            <b-form-radio-group id="collectDateFormatId" name="collectDateFormatName" v-model="dateTime.dateField.format" v-for="(format, index) in monthDateYearformats" :key="index">
              <b-form-radio :value="format.value" class="p-0 mb-10" :checked="'DMY'" @change="upDateFormat">
                <span class="pl-20 text-align fs-15 ml-10">{{format.text}}</span>
              </b-form-radio>
            </b-form-radio-group>
          </div>
        </b-col>
        <!-- month, year -->
        <b-col class="pl-15 p-0" cols="12" lg="3" v-show="dateTime.dateField.collect == 'MY'">
          <div class="fs-13">
            <label class="fw-bold">Format</label>
            <b-form-radio-group id="collectDateFormatId2" name="collectDateFormatName2" v-model="dateTime.dateField.format" v-for="(format, index) in montheYearformats" :key="index">
              <b-form-radio :value="format.value" class="p-0" :checked="'YM'" @change="upDateFormat">
                <span class="pl-20 text-align fs-15 ml-10">{{format.text}}</span>
              </b-form-radio>
            </b-form-radio-group>
          </div>
        </b-col>
        <!-- validations -->
        <b-col cols="12" lg="12" class="pt-20 pl-10">
          <label class="p-0 fw-bold">Validation</label>
        </b-col>
        <!-- Date Format min validation -->
        <b-col class="pl-10 p-0" cols="12" lg="5">
          <switches v-model="dateTime.dateField.validation.minFlag" theme="custom" color="blue" @change="dateTime.dateField.validation.minFlag = !dateTime.dateField.validation.minFlag"></switches>
          <span class="pl-10 fs-15">Earliest date allowed</span><br>
          <b-row class="mt-10" v-if="dateTime.dateField.validation.minFlag">
            <div v-for="(char, index) in dateTime.dateField.format" :key="index">
              <b-col cols="12" lg="12" class="pl-0" v-if="(dateTime.dateField.collect == 'MDY' || dateTime.dateField.collect == 'MY') && char == 'M'">
                <b-form-select v-model="dateTime.dateField.validation.min.conf.month" class="fs-15 form-control field-h40" size="sm" v-if="(dateTime.dateField.collect == 'MDY' || dateTime.dateField.collect == 'MY') && char == 'M'">
                  <option v-for="(month, index) in months" :key="index" :value="month.value">{{month.text}}</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="12" class="pl-0" v-if="dateTime.dateField.collect == 'MDY' && char == 'D'">
                <b-form-select v-model="dateTime.dateField.validation.min.conf.date" class="fs-15 form-control field-h40" size="sm" v-if="dateTime.dateField.collect == 'MDY' && char == 'D'">
                  <!--
                                  new Date(dateTime.dateField.validation.max.conf.year, dateTime.dateField.validation.min.conf.month, 0).getDate()
                                  calculates the num of days in given Month, year
                                -->
                  <option v-for="(date, index) in new Date(dateTime.dateField.validation.min.conf.year, dateTime.dateField.validation.min.conf.month, 0).getDate()" :key="index" :value="date" :text="date">{{date}}</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="12" class="pl-0" v-if="char == 'Y'">
                <b-form-select v-model="dateTime.dateField.validation.min.conf.year" class="fs-15 form-control field-h40" size="sm" v-if="char == 'Y'">
                  <option v-for="(year, index) in years" :key="index">{{year}}</option>
                  <option :value="1900">1900</option>
                </b-form-select>
              </b-col>
            </div>
          </b-row>
        </b-col>
        <!-- Date Format max validation -->
        <b-col class="pl-10 p-0" cols="12" lg="5">
          <switches v-model="dateTime.dateField.validation.maxFlag" theme="custom" color="blue" @change="dateTime.dateField.validation.maxFlag = !dateTime.dateField.validation.maxFlag"></switches>
          <span class="pl-4 fs-15">Latest date allowed</span><br>
          <b-row class="mt-10" v-if="dateTime.dateField.validation.maxFlag">
            <div v-for="(char, index) in dateTime.dateField.format" :key="index">
              <b-col cols="12" lg="12" class="pl-0" v-if="(dateTime.dateField.collect == 'MDY' || dateTime.dateField.collect == 'MY') && char == 'M'">
                <b-form-select v-model="dateTime.dateField.validation.max.conf.month" class="fs-15 form-control field-h40" size="sm" v-if="(dateTime.dateField.collect == 'MDY' || dateTime.dateField.collect == 'MY') && char == 'M'">
                  <option v-for="(month, index) in months" :key="index" :value="month.value">{{month.text}}</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="12" class="pl-0" v-if="dateTime.dateField.collect == 'MDY' && char == 'D'">
                <b-form-select v-model="dateTime.dateField.validation.max.conf.date" class="fs-15 form-control field-h40" size="sm" v-if="dateTime.dateField.collect == 'MDY' && char == 'D'">
                  <!--
                                  new Date(dateTime.dateField.validation.max.conf.year, dateTime.dateField.validation.max.conf.month, 0).getDate()
                                  calculates the num of days in given Month, year
                                -->
                  <option v-for="(date, index) in new Date(dateTime.dateField.validation.max.conf.year, dateTime.dateField.validation.max.conf.month, 0).getDate()" :key="index" :value="date" :text="date">{{date}}</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="12" class="pl-0" v-if="char == 'Y'">
                <b-form-select v-model="dateTime.dateField.validation.max.conf.year" class="fs-15 form-control field-h40" size="sm" v-if="char == 'Y'">
                  <option v-for="(year, index) in years" :key="index">{{year}}</option>
                  <option :value="null">1900</option>
                </b-form-select>
              </b-col>
            </div>
          </b-row>
        </b-col>
        <b-col cols="2"></b-col>
        <b-col cols="12" class="pl-10 p-0 pt-5" v-if="validateFirstLastDatesFlag">
          <label class="error-style">Please select earliest date which is less than the latest date.</label>
        </b-col>
      </b-row>
      <hr class="m-0">
      <!-- collect time info -->
      <b-row class="pl-35 pt-10 pb-10 fs-12">
        <b-form-checkbox @change="dateTime.collectTime = !dateTime.collectTime, addTimeInfoSchema()" v-model="dateTime.collectTime" class="pl-0">
          <span class="pl-25 text-align fs-15">Collect time info</span>
        </b-form-checkbox>
      </b-row>
      <!-- time info data -->
      <b-row class="pl-50 pb-20 fs-12" v-if="dateTime.timeField">
        <!-- time collect formats -->
        <!-- 12 hr, 24 hr formats -->
        <b-col class="pl-15 p-0 bright" cols="12" lg="3">
           <label class="fw-bold">Format</label>
          <b-form-group class="">
            <b-form-radio-group id="collectTimeFormatId" name="collectTimeFormatName" v-model="dateTime.timeField.format" v-for="(format, index) in timeFormats" :key="index">
              <b-form-radio :value="format.value" class="p-0" :checked="'hh'">
                <span class="pl-25 text-align fs-15 ">{{format.text}}</span>
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
        <!-- Time zone information -->
        <b-col class="pl-15 p-0" cols="12" lg="9">
          <label class="fw-bold">Time Zone</label>
          <p class="timeZoneText fs-15">Time zone will automatically be asked for when answering this question.</p>
        </b-col>
        <!-- validations -->
        <b-col cols="12" lg="12">
          <label class="p-0 fw-bold">Validation</label><br>
        </b-col>
        <!-- time Format min validation -->
        <b-col class="pl-15 p-0" cols="12" lg="5">
          <switches v-model="dateTime.timeField.validation.minFlag" theme="custom" color="blue" @change="dateTime.timeField.validation.minFlag = !dateTime.timeField.validation.minFlag"></switches>
          <span class="pl-4 fs-15">Earliest time allowed</span><br>
          <b-row class="p-0 mt-10" v-if="dateTime.timeField.validation.minFlag">
            <b-col cols="12" lg="4" class="pl-0" v-if="dateTime.timeField.format == 'HH:mm'">
              <vue-timepicker format="HH:mm" v-model="dateTime.timeField.validation.min.conf.HHhr"></vue-timepicker>
              <!-- <b-form-input size="sm" class="fs-12" v-model="dateTime.timeField.validation.min.conf" placeholder="0000"></b-form-input> -->
            </b-col>
            <b-col cols="12" lg="5" class="pl-0" v-if="dateTime.timeField.format == 'hh:mm a'">
              <vue-timepicker format="hh:mm" v-model="dateTime.timeField.validation.min.conf.hhhr"></vue-timepicker>
              <!-- <b-form-input size="sm" class="fs-12" v-model="dateTime.timeField.validation.min.conf" placeholder="00:00"></b-form-input> -->
            </b-col>
            <b-col cols="12" lg="4" class="pl-0 fs-15" v-if="dateTime.timeField.format == 'hh:mm a'">
              <b-form-select class="fs-15 form-control field-h40" v-model="dateTime.timeField.validation.min.conf.meridian" size="sm">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </b-form-select>
            </b-col>
          </b-row>
        </b-col>
        <!-- time Format max validation -->
        <b-col class="pl-10 p-0" cols="12" lg="5">
          <switches v-model="dateTime.timeField.validation.maxFlag" theme="custom" color="blue" @change="dateTime.timeField.validation.maxFlag = !dateTime.timeField.validation.maxFlag"></switches>
          <span class="pl-4 fs-15">Latest time allowed</span><br>
          <b-row class="p-0 mt-10" v-if="dateTime.timeField.validation.maxFlag">
            <b-col cols="12" lg="4" class="pl-0" v-if="dateTime.timeField.format == 'HH:mm'">
              <!-- <b-form-input size="sm" class="fs-12" v-model="dateTime.timeField.validation.max.conf" placeholder="0000"></b-form-input> -->
              <vue-timepicker hide-clear-button	 format="HH:mm" v-model="dateTime.timeField.validation.max.conf.HHhr"></vue-timepicker>
            </b-col>
            <b-col cols="12" lg="5" class="pl-0 form-ele" v-if="dateTime.timeField.format == 'hh:mm a'">
              <!-- <b-form-input size="sm" class="fs-12" v-model="dateTime.timeField.validation.max.conf" placeholder="00:00"></b-form-input> -->
              <vue-timepicker format="hh:mm" v-model="dateTime.timeField.validation.max.conf.hhhr"></vue-timepicker>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0 fs-15" v-if="dateTime.timeField.format == 'hh:mm a'">
              <b-form-select class="fs-15 form-control field-h40" v-model="dateTime.timeField.validation.max.conf.meridian" size="sm">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </b-form-select>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="2"></b-col>
        <b-col cols="12" class="pl-15 p-0 pt-5" v-if="validateLastAndFirstTimesFlag">
          <label class="error-style">Please select earliest time which is less than the latest time.</label>
        </b-col>
      </b-row>
      <hr class="m-0">
      <!-- component save, edit and delete buttons -->
      <b-row class="pb-15 pt-15">
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left iconColor cursor_pointer pl-20 pt-5" aria-hidden="true" @click="deleteComponent()"></i>
          <button class="primary-btn br-1 fs-12 pull-right" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(dateTime.order)" v-if="dateTime.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import VueTimepicker from 'vue2-timepicker';

import schemas from '../../data/form-components-json/schemas.json';

export default {
  name: 'date-time',
  components: {
    VueTimepicker,
  },
  data() {
    return {
      dateTime: {},
      collectDate: {},
      testSelect: null,
      validateQuestion: false,
      validateFirstLastDatesFlag: false,
      validateLastAndFirstTimesFlag: false,
      monthsList: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      years: [],
      timeFormats: [
        {
          text: '12 hr (8:00 AM)',
          value: 'hh:mm a',
        },
        {
          text: '24 hr (0800)',
          value: 'HH:mm',
        },
      ],
      dateFormatMapping: {
        MDY: 'MM/DD/YYYY',
        DMY: 'DD/MM/YYYY',
        YMD: 'YYYY/MM/DD',
        MY: 'MM/YYYY',
        YM: 'YYYY/MM',
        Y: 'YYYY',
      },
      dateCollectMapping: {
        MDY: 'Month, date, year',
        MY: 'Month, year',
        Y: 'Year',
      },
      dateReverseFormatMapping: {
        'MM/DD/YYYY': 'MDY',
        'DD/MM/YYYY': 'DMY',
        'YYYY/MM/DD': 'YMD',
        'MM/YYYY': 'MY',
        'YYYY/MM': 'YM',
        YYYY: 'Y',
      },
      dateReverseCollectMapping: {
        'Month, date, year': 'MDY',
        'Month, year': 'MY',
        Year: 'Y',
      },

      dateInfoDataSchema: cloneDeep(
        find(schemas, ['fieldType', 'DateTime']).schemas.dateInfoDataSchema,
      ),
      dateCollectSchema: cloneDeep(
        find(schemas, ['fieldType', 'DateTime']).schemas.dateCollectSchema,
      ),
      monthDateYearformats: cloneDeep(
        find(schemas, ['fieldType', 'DateTime']).schemas.monthDateYearformats,
      ),
      montheYearformats: cloneDeep(
        find(schemas, ['fieldType', 'DateTime']).schemas.montheYearformats,
      ),
      timeInfoDataSchema: cloneDeep(
        find(schemas, ['fieldType', 'DateTime']).schemas.timeInfoDataSchema,
      ),
      yearformats: cloneDeep(find(schemas, ['fieldType', 'DateTime']).schemas.yearformats),
      months: cloneDeep(find(schemas, ['fieldType', 'DateTime']).schemas.months),
    };
  },
  props: ['dateTimeSchema', 'formData'],
  mounted() {
    this.dateTime = this.dateTimeSchema;
    // changing the formats and collect values to the usage of the code written
    // which is based on the format and collect values
    if (this.dateTime.mode === 'edit' && this.dateTime.collectDate) {
      this.dateTime.dateField.collect = this.dateReverseCollectMapping[
        this.dateTime.dateField.collect
      ];
      this.dateTime.dateField.format = this.dateReverseFormatMapping[
        this.dateTime.dateField.format
      ];
    }
    this.getYearsList();
  },
  methods: {
    updateCollect(val) {
      if (this.collectDate[val]) {
        this.dateTime.dateField.format = this.collectDate[val];
      } else this.dateTime.dateField.format = val;
    },
    upDateFormat(val) {
      this.collectDate[this.dateTime.dateField.collect] = val;
    },
    // get years list ( maintain 1900 as min year, current year + 50 as max year)
    getYearsList() {
      const minYear = 1900;
      const maxYear = new Date().getFullYear() + 50;
      for (let index = maxYear; index > minYear; index--) {
        this.years.push(index);
      }
    },

    // Validate for dateTime question text
    validateQuestionText() {
      if (this.dateTime && this.dateTime.body && this.dateTime.body.length) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // add date info schema when date info checkbox is ticked
    addDateInfoSchema() {
      if (this.dateTime.collectDate) {
        this.dateTime.dateField = this.dateInfoDataSchema;
        this.dateTime.dateField.collect = 'MDY';
        this.dateTime.dateField.format = 'MDY';
      } else {
        delete this.dateTime.dateField;
      }
    },

    // add time info schema when time info checkbox is ticked
    addTimeInfoSchema() {
      if (this.dateTime.collectTime) {
        this.dateTime.timeField = this.timeInfoDataSchema;
      } else {
        delete this.dateTime.timeField;
      }
    },

    // join the min and max validations to single string for Storing as single key value pair
    formatDateTimeValidations(format, type, field) {
      switch (format) {
        case 'MDY':
          this.dateTime[field].validation[type].value = `${
            this.monthsList[Number(this.dateTime[field].validation[type].conf.month)-1]
          } ${this.dateTime[field].validation[type].conf.date} ${
            this.dateTime[field].validation[type].conf.year
          }`;
          break;
        case 'DMY':
          this.dateTime[field].validation[type].value = `${
            this.dateTime[field].validation[type].conf.date
          } ${this.monthsList[Number(this.dateTime[field].validation[type].conf.month)-1]} ${
            this.dateTime[field].validation[type].conf.year
          }`;
          break;
        case 'YMD':
          this.dateTime[field].validation[type].value = `${
            this.dateTime[field].validation[type].conf.year
          } ${this.monthsList[Number(this.dateTime[field].validation[type].conf.month)-1]} ${
            this.dateTime[field].validation[type].conf.date
          }`;
          break;
        case 'MY':
          this.dateTime[field].validation[type].value = `${
            this.monthsList[Number(this.dateTime[field].validation[type].conf.month)-1]
          } ${this.dateTime[field].validation[type].conf.year}`;
          break;
        case 'YM':
          this.dateTime[field].validation[type].value = `${
            this.dateTime[field].validation[type].conf.year
          } ${this.monthsList[Number(this.dateTime[field].validation[type].conf.month)-1]}`;
          break;
        case 'Y':
          this.dateTime[field].validation[type].value = `${
            this.dateTime[field].validation[type].conf.year
          }`;
          break;
        case 'hh:mm a':
          this.dateTime[field].validation[type].value = `${
            this.dateTime[field].validation[type].conf.hhhr.hh
          }:${this.dateTime[field].validation[type].conf.hhhr.mm} ${
            this.dateTime[field].validation[type].conf.meridian
          }`;
          break;
        case 'HH:mm':
          this.dateTime[field].validation[type].value = `${
            this.dateTime[field].validation[type].conf.HHhr.HH
          }:${this.dateTime[field].validation[type].conf.HHhr.mm}`;
          break;
        default:
          break;
      }
    },

    // validate the earliest and latest dates
    validateLastAndFirstDates() {
      this.validateFirstLastDatesFlag = false;
      if (
        this.dateTime.collectDate
        && this.dateTime.dateField.validation.minFlag
        && this.dateTime.dateField.validation.maxFlag
      ) {
        this.formatDateTimeValidations(this.dateTime.dateField.format, 'min', 'dateField');
        this.formatDateTimeValidations(this.dateTime.dateField.format, 'max', 'dateField');
        const earliestDate = new Date(this.dateTime.dateField.validation.min.value).getTime();
        const latestDate = new Date(this.dateTime.dateField.validation.max.value).getTime();
        if (earliestDate >= latestDate) {
          this.validateFirstLastDatesFlag = true;
        }
      }
    },

    // validate the earliest and latest times
    validateLastAndFirstTimes() {
      this.validateLastAndFirstTimesFlag = false;
      if (
        this.dateTime.collectTime
        && this.dateTime.timeField.validation.minFlag
        && this.dateTime.timeField.validation.maxFlag
      ) {
        if (this.dateTime.timeField.format === 'hh:mm a') {
          this.formatDateTimeValidations(this.dateTime.timeField.format, 'min', 'timeField');
          this.formatDateTimeValidations(this.dateTime.timeField.format, 'max', 'timeField');
          const earliestTime = Date.parse(
            `20 Aug 2000 ${this.dateTime.timeField.validation.min.value}`,
          );
          const latestTime = Date.parse(
            `20 Aug 2000 ${this.dateTime.timeField.validation.max.value}`,
          );
          if (earliestTime >= latestTime) {
            this.validateLastAndFirstTimesFlag = true;
          }
        } else {
          this.formatDateTimeValidations(this.dateTime.timeField.format, 'min', 'timeField');
          this.formatDateTimeValidations(this.dateTime.timeField.format, 'max', 'timeField');
          const earliestTime = Date.parse(
            `20 Aug 2000 ${this.dateTime.timeField.validation.min.value}`,
          );
          const latestTime = Date.parse(
            `20 Aug 2000 ${this.dateTime.timeField.validation.max.value}`,
          );
          if (earliestTime >= latestTime) {
            this.validateLastAndFirstTimesFlag = true;
          }
        }
      }
    },

    // Validate and submit the drop down to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      this.validateQuestionText();
      this.validateLastAndFirstDates();
      this.validateLastAndFirstTimes();

      this.$validator.validateAll().then(result => {
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || this.validateQuestion
            || this.validateFirstLastDatesFlag
            || this.validateLastAndFirstTimesFlag
          ) {
            //   this.$toastr.error('Please fill the error fields.');
          } else if (!this.dateTime.collectDate && !this.dateTime.collectTime) {
            this.$toastr.error('Please specify date and/or time settings.');
          } else {
            this.dateTime.mode = 'saved';
            if (this.dateTime.dateField) {
              if (this.dateTime.dateField.validation.minFlag) {
                this.formatDateTimeValidations(this.dateTime.dateField.format, 'min', 'dateField');
              }
              if (this.dateTime.dateField.validation.maxFlag) {
                this.formatDateTimeValidations(this.dateTime.dateField.format, 'max', 'dateField');
              }
              if (this.dateTime.dateField.collect === 'Y') {
                this.dateTime.dateField.format = this.dateTime.dateField.collect;
              }
              this.dateTime.dateField.collect = this.dateCollectMapping[
                this.dateTime.dateField.collect
              ];
              this.dateTime.dateField.format = this.dateFormatMapping[this.dateTime.dateField.format]; // eslint-disable-line
            }
            if (this.dateTime.timeField) {
              if (this.dateTime.timeField.validation.minFlag) {
                this.formatDateTimeValidations(this.dateTime.timeField.format, 'min', 'timeField');
              }
              if (this.dateTime.timeField.validation.minFlag) {
                this.formatDateTimeValidations(this.dateTime.timeField.format, 'max', 'timeField');
              }
            }
            this.collectDate = {};
            this.dateTime.fieldNameErrorMsg = '';
            this.$emit('save', this.dateTime);
          }
        } else {
          this.dateTime.fieldNameErrorMsg = 'Please enter unique field name.';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.dateTime);
    },

    cancelComponent(sequence) {
      if (this.dateTime.dateField) {
        if (this.dateTime.dateField.validation.minFlag) {
          this.formatDateTimeValidations(this.dateTime.dateField.format, 'min', 'dateField');
        }
        if (this.dateTime.dateField.validation.maxFlag) {
          this.formatDateTimeValidations(this.dateTime.dateField.format, 'max', 'dateField');
        }
        if (this.dateTime.dateField.collect === 'Y') {
          this.dateTime.dateField.format = this.dateTime.dateField.collect;
        }
        this.dateTime.dateField.collect = this.dateCollectMapping[this.dateTime.dateField.collect];
        this.dateTime.dateField.format = this.dateFormatMapping[this.dateTime.dateField.format];
      }
      if (this.dateTime.timeField) {
        if (this.dateTime.timeField.validation.minFlag) {
          this.formatDateTimeValidations(this.dateTime.timeField.format, 'min', 'timeField');
        }
        if (this.dateTime.timeField.validation.minFlag) {
          this.formatDateTimeValidations(this.dateTime.timeField.format, 'max', 'timeField');
        }
      }
      this.$emit('cancelComponent', sequence);
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.dateTime {
  position: relative;
  border: 0.5px solid lightgray;
  border-radius: 2px;
}

.drop-down {
  background-color: #ffffff !important;
}

.bright {
  border-right: 0.5px solid lightgrey;
}

.text-align {
  line-height: 23px !important;
}

.vue-switcher-theme--bootstrap.vue-switcher-color--primary div:after {
  background-color: #1e8fe1 !important;
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

.pl-56 {
  padding-left: 56px !important;
}

.timeZoneText {
  color: #9b9b9b !important;
}

.selectBoxCustom {
  height: 27px !important;
  padding-top: 3px;
}

/deep/ .time-picker input.display-time {
  border-radius: 4px;
  height: 27px;
  width: 90px !important;
  // color: #9b9b9b !important;
}

.color_9b9b9b {
  /deep/ input.display-time {
    color: #9b9b9b !important; 
  }
}
/deep/ .time-picker .clear-btn {
  display: none;
}

/deep/ .time-picker .dropdown ul li.active,
.time-picker .dropdown ul li.active:hover {
  background-color: #007bff !important;
}
.display-time{
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.iconColor{
  color: #ced4da;
}
</style>
