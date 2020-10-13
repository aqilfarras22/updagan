<template>
  <div class="pt-10 pb-15 component-div">
    <b-row>
      <b-col cols="12" class="pl-14" v-if="dateTimeData">
        <b>{{sequence}}. {{dateTimeData.body}}</b>
        <div class="pull-right icons-div">
        <div v-if="hideShowCopyAction" class="icon-div" @click="copyData()">
          <img src="static/img/duplicate.svg" />
        </div>
        </div>
        <span class="error-style" v-if="componentData.required">*</span>
      </b-col>
      <!-- For all previews except query tool edit -->
      <b-col cols="12" lg="12" class="pt-10" v-if="!queryTool" :class="{'pointerEventsNull': disableField}">
        <b-row class="pl-15">
          <b-col cols="12" class="p-0" v-if="dateTimeData.collectDate" :class="{'col-lg-5': dateCollect == 'MDY', 'col-lg-4': dateCollect == 'MY', 'col-lg-3': dateCollect == 'Y'}">
            <b-row class="p-0">
              <div v-for="(char, index) in dateFormat" :key="index">
                <b-col cols="12" lg="12" class="pl-0" v-if="(dateCollect == 'MDY' || dateCollect == 'MY') && char == 'M'">
                  <b-form-select v-model="dateTimeData.month" :disabled="disableField" class="field-h40 fs-15 form-control" size="sm" v-if="(dateCollect == 'MDY' || dateCollect == 'MY') && char == 'M'" :class="{'is-danger': dateErrorFlag}" @change="getUserMonth">
                    <option key="" value="">&nbsp;</option>
                    <option :disabled="disableField" v-for="(month, index) in months" :key="index" :value="month.value">{{month.text}}</option>                    
                  </b-form-select>
                </b-col>
                <b-col cols="12" lg="12" class="pl-0" v-if="dateCollect == 'MDY' && char == 'D'">
                  <b-form-select v-model="dateTimeData.date" :disabled="disableField" class="field-h40 fs-15 form-control" size="sm" v-if="dateCollect == 'MDY' && char == 'D'" :class="{'is-danger': dateErrorFlag}" @change="getUserDate">
                    <option key="" value="">&nbsp;</option>
                    <option :disabled="disableField" v-for="(date, index) in datesList" :key="index" :value="date" :text="date">{{date}}</option>
                  </b-form-select>
                </b-col>
                <b-col cols="12" lg="12" class="pl-0" v-if="char == 'Y'">
                  <b-form-select v-model="dateTimeData.year" :disabled="disableField" class="field-h40 fs-15 form-control" size="sm" v-if="char == 'Y'" :class="{'is-danger': dateErrorFlag}" @change="getUserYear">
                    <option key="" value="">&nbsp;</option>
                    <option :disabled="disableField" v-for="(year, index) in years" :key="index" :value="year">{{year}}</option>
                  </b-form-select>
                </b-col>
              </div>
            </b-row>
          </b-col>
          <b-col cols="12" lg="6" class="p-0" v-if="dateTimeData.collectTime">
            <b-row class="p-0">
              <b-col cols="12" lg="3" class="field-h40 pl-0 pr-0" v-if="dateTimeData.timeField.format == 'HH:mm'">
                <vue-timepicker :disabled="disableField" format="HH:mm" v-model="dateTimeData.time" name="24hrFormat" :class="{'error': format24hrerrorFlag}" @change="getUser24HrTime"></vue-timepicker>
                <!-- <b-form-input size="sm" type="number" v-model="dateTimeData.time" class="fs-12" placeholder="HHMM" name="24hrFormat" :class="{'input': true, 'is-danger': errors.has('24hrFormat') || format24hrerrorFlag}" v-on:keyup.native="check24hrFormat"></b-form-input> -->
              </b-col>
              <b-col cols="12" lg="3" class="field-h40 pl-0 pr-0" v-if="dateTimeData.timeField.format == 'hh:mm a'">
                <vue-timepicker :disabled="disableField" format="hh:mm" v-model="dateTimeData.time" name="12hrFormat" :class="{'error': format12hrerrorFlag}" @change="getUser12HrTime"></vue-timepicker>
                <!-- <b-form-input size="sm" class="fs-12" type="number" v-model="dateTimeData.time" placeholder="hhmm" name="12hrFormat" v-validate="timeValidationConstraints" :class="{'input': true, 'is-danger': errors.has('12hrFormat') || format12hrerrorFlag}" v-on:keyup.native="check12hrFormat"></b-form-input> -->
              </b-col>
              <b-col cols="12" lg="3" class="pr-0 pl-10" v-if="dateTimeData.timeField.format == 'hh:mm a'">
                <b-form-select v-model="dateTimeData.meridian" :disabled="disableField" size="sm" class="field-h40 fs-15 form-control" name="12hrFormatMeridian" :class="{'is-danger': format12hrerrorFlag}" @change="getUserMeridian">
                  <option value="">&nbsp;</option>
                  <option :disabled="disableField" value="AM">AM</option>
                  <option :disabled="disableField" value="PM">PM</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="6" class="pr-0 pl-10" v-if="dateTimeData.timeField">
                <b-form-select v-model="dateTimeData.timezone" :disabled="disableField" @change="getUserTimeZone" :class="{'is-danger': format12hrerrorFlag || format24hrerrorFlag}">
                  <option value="">&nbsp;</option>
                  <option :disabled="disableField" v-for="(timezone, index) in timezones" :key="index" :value="`${timezone.abbr} - ${timezone.text}`">
                    {{timezone.abbr}} - {{timezone.text}}</option>
                </b-form-select>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="pl-15">
          <b-col cols="12" class="p-0 error-style fs-12" :class="{'col-lg-5': dateCollect == 'MDY', 'col-lg-4': dateCollect == 'MY', 'col-lg-3': dateCollect == 'Y'}"><span v-if="dateErrorMsg">{{dateErrorMsg}}</span></b-col>
          <b-col cols="12" lg="4" class="p-0 error-style fs-12" v-if="timeErrorMsg">{{timeErrorMsg}}</b-col>
        </b-row>
      </b-col>
      <!-- For query tool edit -->
      <b-col cols="12" lg="12" class="pt-10" v-if="queryTool">
        <b-row class="pl-15">
          <b-col class="p-0" v-if="dateTimeData.collectDate" :class="{'col-lg-12 pb-11': dateCollect == 'MDY', 'col-lg-12 pb-10': dateCollect == 'MY', 'col-lg-3': dateCollect == 'Y'}">
            <b-row class="p-0">
              <div v-for="(char, index) in dateFormat" :key="index">
                <b-col cols="12" lg="12" class="pl-0" v-if="(dateCollect == 'MDY' || dateCollect == 'MY') && char == 'M'">
                  <b-form-select v-model="dateTimeData.month" class="field-h40 fs-15 form-control" size="sm" v-if="(dateCollect == 'MDY' || dateCollect == 'MY') && char == 'M'" :class="{'is-danger': dateErrorFlag}" @change="getUserMonth">
                    <option key="" value="">&nbsp;</option>
                    <option v-for="(month, index) in months" :key="index" :value="month.value">{{month.text}}</option>                    
                  </b-form-select>
                </b-col>
                <b-col cols="12" lg="12" class="pl-0" v-if="dateCollect == 'MDY' && char == 'D'">
                  <b-form-select v-model="dateTimeData.date" class="field-h40 fs-15 form-control" size="sm" v-if="dateCollect == 'MDY' && char == 'D'" :class="{'is-danger': dateErrorFlag}" @change="getUserDate">
                    <option key="" value="">&nbsp;</option>
                    <option v-for="(date, index) in datesList" :key="index" :value="date" :text="date">{{date}}</option>
                  </b-form-select>
                </b-col>
                <b-col cols="12" lg="12" class="pl-0" v-if="char == 'Y'">
                  <b-form-select v-model="dateTimeData.year" class="field-h40 fs-15 form-control" size="sm" v-if="char == 'Y'" :class="{'is-danger': dateErrorFlag}" @change="getUserYear">
                    <option key="" value="">&nbsp;</option>
                    <option v-for="(year, index) in years" :key="index" :value="year">{{year}}</option>
                  </b-form-select>
                </b-col>
              </div>
            </b-row>
          </b-col>
          <b-col class="p-0" v-if="dateTimeData.collectTime" :class="{'col-lg-8': !dateTimeData.collectDate, 'col-lg-12': dateCollect == 'MDY',  'col-lg-8 pt-0': dateCollect == 'MY',  'col-lg-8 pt-1': dateCollect == 'Y'}">
            <b-row class="p-0">
              <b-col cols="12" lg="3" class="field-h40 pl-0" v-if="dateTimeData.timeField.format == 'HH:mm'">
                <vue-timepicker format="HH:mm" v-model="dateTimeData.time" name="24hrFormat" :class="{'error': format24hrerrorFlag}" @change="getUser24HrTime"></vue-timepicker>
                <!-- <b-form-input size="sm" type="number" v-model="dateTimeData.time" class="fs-12" placeholder="HHMM" name="24hrFormat" :class="{'input': true, 'is-danger': errors.has('24hrFormat') || format24hrerrorFlag}" v-on:keyup.native="check24hrFormat"></b-form-input> -->
              </b-col>
              <b-col cols="12" lg="3" class="field-h40 pl-0" v-if="dateTimeData.timeField.format == 'hh:mm a'">
                <vue-timepicker format="hh:mm" v-model="dateTimeData.time" name="12hrFormat" :class="{'error': format12hrerrorFlag}" @change="getUser12HrTime"></vue-timepicker>
                <!-- <b-form-input size="sm" class="fs-12" type="number" v-model="dateTimeData.time" placeholder="hhmm" name="12hrFormat" v-validate="timeValidationConstraints" :class="{'input': true, 'is-danger': errors.has('12hrFormat') || format12hrerrorFlag}" v-on:keyup.native="check12hrFormat"></b-form-input> -->
              </b-col>
              <b-col cols="12" lg="3" class="pr-0 pl-10" :class="{'ml-n35': dateTimeData.timeField.format == 'hh:mm a' && (!dateTimeData.collectDate || dateCollect == 'MDY')}" v-if="dateTimeData.timeField.format == 'hh:mm a'">
                <b-form-select v-model="dateTimeData.meridian" size="sm" class="field-h40 fs-15 form-control" name="12hrFormatMeridian" :class="{'is-danger': format12hrerrorFlag}" @change="getUserMeridian">
                  <option value="">&nbsp;</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </b-form-select>
              </b-col>
              <b-col cols="12" lg="6" class="pr-0 pl-10" :class="{'ml-n35': dateTimeData.timeField.format == 'HH:mm' && (!dateTimeData.collectDate || dateCollect == 'MDY')}" v-if="dateTimeData.timeField">
                <b-form-select v-model="dateTimeData.timezone" @change="getUserTimeZone" :class="{'is-danger': format12hrerrorFlag || format24hrerrorFlag}">
                  <!-- <option>Select time zone</option> -->
                  <option value="">&nbsp;</option>
                  <option v-for="(timezone, index) in timezones" :key="index" :value="`${timezone.abbr} - ${timezone.text}`">
                    {{timezone.abbr}} - {{timezone.text}}</option>
                </b-form-select>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="pl-15">
          <b-col cols="12" class="p-0 error-style fs-12" :class="{'col-lg-5': dateCollect == 'MDY', 'col-lg-4': dateCollect == 'MY', 'col-lg-3': dateCollect == 'Y'}"><span v-if="dateErrorMsg">{{dateErrorMsg}}</span></b-col>
          <b-col cols="12" lg="4" class="p-0 error-style fs-12" v-if="timeErrorMsg">{{timeErrorMsg}}</b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import findIndex from 'lodash/findIndex';
  import find from 'lodash/find';
  import uniq from 'lodash/uniq';
  import pull from 'lodash/pull';
  import sortBy from 'lodash/sortBy';
  import includes from 'lodash/includes';
  import VueTimepicker from 'vue2-timepicker';
  
  import schemas from '../../../data/form-components-json/schemas.json';
  import timezones from '../../../data/timezones.json';
  
  
  export default {
    name: 'date-time-preview',
    props: {
      componentData: {
        type: Object,
      },
      queryTool: {
        type: Boolean,
        default: false,
      },
      formSubmitted: {
        type: Number,
      },
      disableField: {
        type: Boolean,
        default: false,
      },
      hideShowCopyAction: {
        type: Boolean,
      },
      formId: {
        type: String
      }
    },
    components: {
      VueTimepicker,
    },
    data() {
      return {
        dateFormatMapping: {
          'MM/DD/YYYY': 'MDY',
          'DD/MM/YYYY': 'DMY',
          'YYYY/MM/DD': 'YMD',
          'MM/YYYY': 'MY',
          'YYYY/MM': 'YM',
          YYYY: 'Y',
        },
        dateCollectMapping: {
          'Month, date, year': 'MDY',
          'Month, year': 'MY',
          Year: 'Y',
        },
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
        dateTimeData: {},
        years: [],
        datesList: 31,
        dateCollect: '',
        dateFormat: '',
        earliestDate: null,
        latestDate: null,
        earliestTime: null,
        latestTime: null,
        dateValidationConstraints: {},
        dateErrorFlag: false,
        format12hrerrorFlag: false,
        format24hrerrorFlag: false,
        dateFieldsEmpty: false,
        timeErrorMsg: null,
        dateErrorMsg: null,
        months: find(schemas, ['fieldType', 'DateTime']).schemas.months,
        responseSchema: find(schemas, ['fieldType', 'DateTime']).schemas.responseSchema,
        timezones: sortBy(timezones, 'abbr'),
      };
    },
    mounted() {
      this.dateTimeData = this.componentData;
      this.initMethod();
    },
    methods: {
      ...mapActions(['saveEDCFormErrors']),

      copyData() {
      event.stopPropagation();
      this.$emit('copyComponent', this.componentData);
    },
      // mounted call
      initMethod() {
        // changing the formats and collect values to the usage of the code written
        // which is based on the format and collect values
        if (this.dateTimeData.collectDate) {
          const collect = [];
          this.dateTimeData.dateField.collect.split(',').forEach(element => {
            collect.push(element.trim()[0].toUpperCase());
          });
          this.dateCollect = collect.join('');
          // this.dateTimeData.dateField.collect = this.dateCollectMapping[
          //   this.dateTimeData.dateField.collect
          // ];
  
          this.dateFormat = pull(uniq(this.dateTimeData.dateField.format), '/').join('');
          // this.dateTimeData.dateField.format = this.dateFormatMapping[
          //   this.dateTimeData.dateField.format
          // ];
        }
        this.getYearsList();
  
        // create constraints for date feature which is configured while creating form
        if (this.dateTimeData && this.dateTimeData.collectDate) {
          if (this.dateTimeData.dateField.validation.minFlag) {
            this.earliestDate = this.getRangeDate(this.dateTimeData.dateField
              .validation.min.conf.month,
            this.dateTimeData.dateField.validation.min.conf.date,
            this.dateTimeData.dateField.validation.min.conf.year,
            true);
          }
          if (this.dateTimeData.dateField.validation.maxFlag) {
            this.latestDate = this.getRangeDate(this.dateTimeData.dateField.validation.max.conf.month,
              this.dateTimeData.dateField.validation.max.conf.date,
              this.dateTimeData.dateField.validation.max.conf.year,
              true);
          }
        }
  
        // create constraints for time feature which is configured while creating form
        if (this.dateTimeData && this.dateTimeData.collectTime) {
          if (this.dateTimeData.timeField.format === 'hh:mm a') {
            if (!this.dateTimeData.time) {
              this.dateTimeData.time = {
                // hh: '',
                // mm: '',
              };
            }
            if (!this.dateTimeData.meridian) {
              this.dateTimeData.meridian = '';
            }
            // this.dateTimeData.timezone = null;
            if (this.dateTimeData.timeField.validation.minFlag) {
              this.earliestTime = Date.parse(
                `1 Jan 1970 ${this.dateTimeData.timeField.validation.min.value}`,
              );
            }
            if (this.dateTimeData.timeField.validation.maxFlag) {
              this.latestTime = Date.parse(
                `1 Jan 1970 ${this.dateTimeData.timeField.validation.max.value}`,
              );
            }
          } else {
            if (!this.dateTimeData.time) {
              this.dateTimeData.time = {
                // HH: '',
                // mm: '',
              };
            }
            if (this.dateTimeData.timeField.validation.minFlag) {
              this.earliestTime = Date.parse(
                `1 Jan 1970 ${this.dateTimeData.timeField.validation.min.value}`,
              );
            }
            if (this.dateTimeData.timeField.validation.maxFlag) {
              this.latestTime = Date.parse(
                `1 Jan 1970 ${this.dateTimeData.timeField.validation.max.value}`,
              );
            }
          }
        }
        this.updateVueStore('time', false);
      },
      // get years list ( maintain 1900 as min year, current year + 50 as max year)
      getYearsList() {
        this.years = [];
        let minYear = 1900;
        let maxYear = new Date().getFullYear() + 50;
        // add min year into years list if configured
        if (this.dateTimeData.dateField && this.dateTimeData.dateField.validation.minFlag) {
          minYear = this.dateTimeData.dateField.validation.min.conf.year;
        }
        // add max year into years list if configured
        if (this.dateTimeData.dateField && this.dateTimeData.dateField.validation.maxFlag) {
          maxYear = this.dateTimeData.dateField.validation.max.conf.year;
          maxYear = parseInt(maxYear);
        }
        for (let index = maxYear; index >= minYear; index--) {
          this.years.push(index);
        }
      },
  
      // get user month and validate
      getUserMonth(month) {
        this.dateTimeData.month = month;
        this.validateData();
      },
      // get user date and validate
      getUserDate(date) {
        this.dateTimeData.date = date;
        this.validateData();
      },
      // get user year and validate
      getUserYear(year) {
        this.dateTimeData.year = year;
        this.validateData();
      },
  
      getUser24HrTime(time) {
        this.dateTimeData.time = time.data;
        // if (this.dateTimeData.time.HH && this.dateTimeData.time.mm) {
          this.validateData();
        // }
      },
  
      getUser12HrTime(time) {
        this.dateTimeData.time = time.data;
        // if (this.dateTimeData.time.hh && this.dateTimeData.time.mm) {
        this.validateData();
        // }
      },
  
      getUserMeridian(meridian) {
        this.dateTimeData.meridian = meridian;
        this.validateData();
      },
  
      getUserTimeZone(timezone) {
        this.dateTimeData.timezone = timezone;
        this.validateData();
      },
  
      validateData() {
        if (this.dateTimeData.collectDate) {
          this.validateDate();
        }
        if (this.dateTimeData.collectTime) {
          this.validateTime();
        }
      },
  
      validateDate() {
        this.dateFieldsEmpty = false;
        if (this.dateCollect === 'MDY') {
          if((!this.dateTimeData.month || this.dateTimeData.month === "") && (!this.dateTimeData.date || this.dateTimeData.date === "") && (!this.dateTimeData.year || this.dateTimeData.year === "") && !this.componentData.required) {
            if(this.dateTimeData.collectTime) {
            this.dateErrorFlag = true;
            this.dateFieldsEmpty = true;
            }
            else {
            this.dateErrorFlag = false;
            }
          }
          else if (this.dateTimeData.month && this.verifySelectedMonth() && this.dateTimeData.date && this.verifySelectedDate() && this.dateTimeData.year && this.verifySelectedYear()) {
            if (this.validateDateRange()) {
              this.dateErrorFlag = true;
            } else {
              this.dateErrorFlag = false;
            }
          } else {
            this.dateErrorFlag = true;
          }
        } else if (this.dateCollect === 'MY') {
          if(((!this.dateTimeData.month || this.dateTimeData.month === "") && (!this.dateTimeData.year || this.dateTimeData.year === "")) && !this.componentData.required) {
            if(this.dateTimeData.collectTime) {
            this.dateErrorFlag = true;
            this.dateFieldsEmpty = true;
            }
            else {
            this.dateErrorFlag = false;
            }
          }
          else if (this.dateTimeData.month && this.verifySelectedMonth() && this.dateTimeData.year && this.verifySelectedYear()) {
            if (this.validateDateRange()) {
              this.dateErrorFlag = true;
            } else {
              this.dateErrorFlag = false;
            }
          } else {
            this.dateErrorFlag = true;
          }
        } else if (this.dateCollect === 'Y') {
          if((!this.dateTimeData.year || this.dateTimeData.year === "") && !this.componentData.required) {
            if(this.dateTimeData.collectTime) {
            this.dateErrorFlag = true;
            this.dateFieldsEmpty = true;
            }
            else {
            this.dateErrorFlag = false;
            }
          }
          else if (this.dateTimeData.year && this.verifySelectedYear()) {
            this.dateErrorFlag = false;
          } 
          else {
            this.dateErrorFlag = true;
          }
        }
        this.updateVueStore('date', this.dateErrorFlag);
      },
  
      validateTime() {
        if (this.dateTimeData.timeField.format === 'hh:mm a') {
          this.check12hrFormat();
        } else if (this.dateTimeData.timeField.format === 'HH:mm') {
          this.check24hrFormat();
        }
      },
  
      check12hrFormat() {
        if (this.dateTimeData.time.hh
          && this.dateTimeData.time.mm
          && this.dateTimeData.meridian
          && this.dateTimeData.timezone) {
          const timeEntered = Date.parse(
            `1 Jan 1970 ${this.dateTimeData.time.hh}:${this.dateTimeData.time.mm} ${
              this.dateTimeData.meridian
            }`,
          );
          if (this.validateTimeRange(timeEntered)) {
            this.format12hrerrorFlag = true;
          } else {
            this.format12hrerrorFlag = false;
          }
        } 
        else if((!this.dateTimeData.time.hh || this.dateTimeData.time.hh === "")
          && (!this.dateTimeData.time.mm || this.dateTimeData.time.mm === "")
          && (!this.dateTimeData.meridian || this.dateTimeData.meridian === "")
          && (!this.dateTimeData.timezone || this.dateTimeData.timezone === "")
          && (this.dateFieldsEmpty || !this.dateTimeData.collectDate) && !this.componentData.required) {
            this.format12hrerrorFlag = false;
            this.dateErrorFlag = false;
          }
        else {
          this.format12hrerrorFlag = true;
        }
        this.updateVueStore('time', this.format12hrerrorFlag);
        this.updateVueStore('date', this.dateErrorFlag);
      },
  
      check24hrFormat() {
        if (this.dateTimeData.time.HH && this.dateTimeData.time.mm && this.dateTimeData.timezone) {
          const timeEntered = Date.parse(
            `1 Jan 1970 ${this.dateTimeData.time.HH}:${this.dateTimeData.time.mm}`,
          );
          if (this.validateTimeRange(timeEntered)) {
            this.format24hrerrorFlag = true;
          } else {
            this.format24hrerrorFlag = false;
          }
        }
        else if((!this.dateTimeData.time.hh || this.dateTimeData.time.hh === "")
          && (!this.dateTimeData.time.mm || this.dateTimeData.time.mm === "")
          && (!this.dateTimeData.meridian || this.dateTimeData.meridian === "")
          && (!this.dateTimeData.timezone || this.dateTimeData.timezone === "")
          && (this.dateFieldsEmpty || !this.dateTimeData.collectDate) && !this.componentData.required) {
            this.format24hrerrorFlag = false;
            this.dateErrorFlag = false;
          }
        else {
          this.format24hrerrorFlag = true;
        }
        this.updateVueStore('time', this.format24hrerrorFlag);
        this.updateVueStore('date', this.dateErrorFlag);
      },
  
      // return true for error condition
      validateDateRange() {
        const dateEntered = this.getFormattedDateForDateEntered();
        if(this.dateTimeData.month && this.dateTimeData.date && this.dateTimeData.year) {
        const maxDate = new Date(this.dateTimeData.year, this.dateTimeData.month, 0).getDate()
        if(this.dateTimeData.date > maxDate) {
          this.dateErrorMsg = 'Invalid date'
         return true;
        }
        }
        if (this.earliestDate && dateEntered < this.earliestDate) {
          if(this.dateTimeData.dateField.validation.min.value.includes('/')) {
          this.dateErrorMsg = `Date can't be less than ${this.formatValidationMessage(this.dateTimeData.dateField.format, 'min')}.`;
          }
          else {
          this.dateErrorMsg = `Date can't be less than ${this.dateTimeData.dateField.validation.min.value}.`;
          }
          return true;
         } 
        if (this.latestDate && dateEntered > this.latestDate) {
          if(this.dateTimeData.dateField.validation.max.value.includes('/')) {
          this.dateErrorMsg = `Date can't be greater than ${this.formatValidationMessage(this.dateTimeData.dateField.format, 'max')}.`;
          }
          else{
          this.dateErrorMsg = `Date can't be greater than ${this.dateTimeData.dateField.validation.max.value}.`;
          }
          return true;
        }
        this.dateErrorMsg = null;
        return false;
      },

      formatValidationMessage(format , type) {
        let validationValue = "";
        switch (format) {
        case 'MM/DD/YYYY':
          validationValue = `${
            this.monthsList[Number(this.dateTimeData.dateField.validation[type].conf.month)-1]
          } ${this.dateTimeData.dateField.validation[type].conf.date} ${
            this.dateTimeData.dateField.validation[type].conf.year
          }`;
          break;
        case 'DD/MM/YYYY':
          validationValue = `${
            this.dateTimeData.dateField.validation[type].conf.date
          } ${this.monthsList[Number(this.dateTimeData.dateField.validation[type].conf.month)-1]} ${
            this.dateTimeData.dateField.validation[type].conf.year
          }`;
          break;
        case 'YYYY/MM/DD':
          validationValue= `${
            this.dateTimeData.dateField.validation[type].conf.year
          } ${this.monthsList[Number(this.dateTimeData.dateField.validation[type].conf.month)-1]} ${
            this.dateTimeData.dateField.validation[type].conf.date
          }`;
          break;
        case 'MM/YYYY':
          validationValue = `${
            this.monthsList[Number(this.dateTimeData.dateField.validation[type].conf.month)-1]
          } ${this.dateTimeData.dateField.validation[type].conf.year}`;
          break;
        case 'YYYY/MM':
          validationValue = `${
            this.dateTimeData.dateField.validation[type].conf.year
          } ${this.monthsList[Number(this.dateTimeData.dateField.validation[type].conf.month)-1]}`;
          break;
        default:
          break;
      }
      return validationValue;
      },
      getRangeDate(month, date = 0, year, earliest) {
        let rangeDate = '';
        if (this.dateCollect === 'MDY') {
          rangeDate = `${month}/${date}/${year}`;
        } else if (this.dateCollect === 'MY') {
          if (earliest) {
            rangeDate = `${month}/01/${year}`; // first day of the month
          } else {
            rangeDate = `${month}/${new Date(year, month, 0).getDate()}/${year}`; // last day of the month
          }
        }
        return new Date(rangeDate).getTime();
      },
  
      getFormattedDateForDateEntered() {
        let formattedDateEntered = '';
        if (this.dateCollect === 'MDY') {
          formattedDateEntered = `${this.dateTimeData.month}/${this.dateTimeData.date}/${this.dateTimeData.year}`;
        } else if (this.dateCollect === 'MY') {
          formattedDateEntered = `${this.dateTimeData.month}/01/${this.dateTimeData.year}`; // first day of the month
        }
        return new Date(formattedDateEntered).getTime();
      },

      validateTimeRange(timeEntered) {
        if (this.earliestTime && timeEntered < this.earliestTime) {
          this.timeErrorMsg = `Time can't be less than
          ${this.dateTimeData.timeField.validation.min.value}.`;
          return true;
        } if (this.latestTime && timeEntered > this.latestTime) {
          this.timeErrorMsg = `Time can't be more than
          ${this.dateTimeData.timeField.validation.max.value}.`;
          return true;
        }
        this.timeErrorMsg = null;
        return false;
      },
  
      // update the VueStore for the component errorFlag
      updateVueStore(type, errorStatus) {
        // get the available edcFormErrors from localstorage set by VueStore
        const currentEdcFormErrors = window.localStorage.getItem('thread-edcFormErrors') || [];
        const currentEdcFormErrorsJson = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
        // update the component error status if already exists
        if (currentEdcFormErrors.includes(this.componentData.id)) {
          const compInd = findIndex(currentEdcFormErrorsJson, ['id', this.componentData.id]);
          currentEdcFormErrorsJson[compInd][type] = errorStatus;
          currentEdcFormErrorsJson[compInd].uniqId = this.formId + '_' + this.componentData.id
        } else {
          // add the component error status if it doesn't exist
          currentEdcFormErrorsJson.push({
            id: this.componentData.id,
            name: this.componentData.name,
            [type]: errorStatus,
            uniqId: this.formId + '_' + this.componentData.id
          });
        }
        // save the form component error for using it in the PI form filling
        this.saveEDCFormErrors(currentEdcFormErrorsJson);
      },
      verifySelectedDate() {
        return this.dateTimeData.date >=1 && this.dateTimeData.date <= this.datesList ? true : false;
      },
      verifySelectedMonth() {       
        let monthIndex = findIndex(this.months, { 'value': this.dateTimeData.month});
        return monthIndex >=0 ? true : false;
      },
      verifySelectedYear() {
        return includes(this.years, parseInt(this.dateTimeData.year));
      }
    },
    computed: {
      sequence() {
        return this.componentData.sequence;
      },
    },
    watch: {
      componentData: {
        handler() {
          this.dateTimeData = this.componentData;
          this.initMethod();
        },
      },
      formSubmitted: {
        handler() {
          if (this.formSubmitted) {
            if (this.componentData.required) {
              this.validateData();
            }
          }
        },
        deep: true,
      },
    },
  };
</script>

<style scoped lang="scss">
  .selectBoxCustom {
    height: 27px !important;
    padding-top: 3px;
  }

  .pointerEventsNull:active {
    pointer-events: none;
  }
  
  .error-style {
    color: #ff4848;
  }
  
  .ml-n35 {
    margin-left: -35px;
  }
  
  .is-danger {
    border-color: #ff4848 !important;
  }
  
  /deep/ .time-picker input.display-time {
    border-radius: 4px;
    height: 27px;
    width: 80px;  
  }

  .error {
    /deep/ input.display-time {
      border: 2px solid #ff4848 !important;
    }
  }
  
  /deep/ input.display-time.error {
    border-color: #ff4848 !important;
  }
  
  /deep/ .time-picker .clear-btn {
    right: 43px!important;
    color: #000000!important;
  }
  
  /deep/ .time-picker .dropdown ul li.active,
  .time-picker .dropdown ul li.active:hover {
    background-color: #007bff !important;
  }

  .iconColor{
  color: #ced4da;
}

.icon-div {
  border: 1px solid #ced4da;
  border-radius: 3px;
  padding: 7px 22px;
}

.icons-div {
  display: none;
}
 
.component-div:hover .icons-div {
  display: block;
}
</style>
