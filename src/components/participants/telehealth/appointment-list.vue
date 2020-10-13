<template>
  <div v-if="appointmentsList.length" class="appointment-list">
    <div class="appointment-card">
      <table-component
        showTotal
        showEmpty
        noGutters
        filterLabelMessage
        noProviderSorting
        showFilter
        :filterOptions="statusFilterOptions"
        :emptyText="responseListMsg"
        :printTotalFormatter="TotalFormatter"
        :items="appointmentsData"
        :fields="telehealthAppointmentTableFields"
      >
        <!-- If in future needs month toggle filter then add this to above table-component 
      :filterOptions="telehealthAppointmentFilterOptions"
      :filter="currentMonth.toString()"
        -->
        <!-- Visit Name -->
        <template slot="name" slot-scope="data">{{ data.row.item.name}}</template>
        <!-- Appointment Date -->
        <template
          slot="appointmentDate"
          slot-scope="data"
        >{{ new Date(data.row.item.appointmentDate) | formatGMTDate }}</template>
        <!-- Appointment Status -->
        <template slot="status" slot-scope="data">
          <span class="status" :class="data.row.item.status">{{data.row.item.status}}</span>
        </template>
      </table-component>
    </div>
  </div>
</template>

<script>
import TableComponent from "@/components/common/table";
import moment from "moment";
import _ from "lodash";
import toastr from "toastr";
import { mapGetters } from "vuex";

export default {
  name: "TelehealthAppointmentList",
  components: { TableComponent },
  computed: { 
    ...mapGetters(["user"]),
    totalAppointments() {
      return this.filteredAppointmentsList ? this.filteredAppointmentsList.length : this.appointmentsList.length;
    }
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      responseListMsg: "No appointments.",
      /* Uncomment this for month toggle filteration
      currentMonth: moment().month(), 
      monthStartDate: null,
      monthEndDate: null,
      telehealthAppointmentFilterOptions: [],*/
      appointmentsList: [],
      filteredAppointmentsList: null,
      telehealthAppointmentTableFields: [
        {
          key: "name",
          label: "Visit Name",
          sortable: true
        },
        {
          key: "appointmentDate",
          label: "Date",
          sortable: true
        },
        {
          key: "status",
          label: "Status",
          sortable: true
        }
      ],
      statuses: { /* complete: "Completed", */ notstarted: "Upcoming" },
      statusFilterOptions: [
        { value: "", text: "All" },
        { value: "complete", text: "Complete" },
        { value: "cancelled", text: "Cancelled" },
        { value: "missed", text: "Missed" },
        { value: "Upcoming", text: "Upcoming" },
      ],
    };
  },
  methods: {
    TotalFormatter() {
      return `Telehealth: ${this.totalAppointments}`;
    },
    getAppointments() {
      let self = this;
      self.responseListMsg = "Loading...";
      //let appointmentsList = [];

      /* 
      Uncomment this for month toggle filteration
      self.getMonthDateRange(filter); */

      let siteId = self.user.siteIds ? self.user.siteIds[0] : null;
      let pId = self.user.id;

      return self.$api
        .getTelehealthAppointmentList({
          siteId: siteId,
          pId: pId,
          studyId: self.studyId,
          participantId: self.participantId
          /* 
          Uncomment this for month toggle filteration
          startDate: self.monthStartDate.valueOf(),
          endDate: self.monthEndDate.valueOf() */
        })
        .then(
          response => {
            self.responseListMsg = "No appointments.";

            if (!response.body.length) {
              return self.appointmentsList;
            }

            response.body.reduce((previous, element) => {
              element.status = element.status.toLowerCase().replace(/ /g, "");

              //Display the appointments of reschedule status as cancelled 
              if (element.status == "reschedule") {
                element.status = "cancelled";
              } else if (element.status == "notstarted") {
                // if the appointment duration(End Time) has passed and the status is still not updated then the status will be missed
                let appointmentEndTimeObj = moment(element.endTime);
                element.status = appointmentEndTimeObj.isBefore(moment())
                  ? "missed"
                  : element.status;
              }

              if (element.type == "Scheduled") {
                element.appointmentDate = element.startTime;
              }

              element.status = self.statuses[element.status]
                ? self.statuses[element.status]
                : element.status;

              element.name = element.visitName
                ? element.visitName
                : "Unscheduled";

              //Finally push the process/modifies element in appointmentList
              self.appointmentsList.push(element);
            }, 0);
            
            return self.appointmentsList;
          },
          error => {
            let errMsg = "Error while getting the appointment list!";
            self.responseListMsg = errMsg;
            toastr.error(
              error.body && error.body.message ? error.body.message : errMsg
            );
          }
        );
    }
    /* 
      Uncomment this for month toggle filteration
    getMonthDateRange(month) {
      let year = moment().format("YYYY");

      var startDate = moment([year, month]);

      var endDate = moment(startDate).endOf("month");

      this.monthStartDate = startDate;
      this.monthEndDate = endDate;
    } */,
    appointmentsData({ filter }){
      if (filter) {
        return this.filteredAppointmentsList = this.appointmentsList.filter(
          appointment => appointment.status == filter
        );
      }
      this.filteredAppointmentsList = null;
      return this.appointmentsList;
    }
  },
  mounted() {
    this.getAppointments();
    /*
    Uncomment this for month toggle filteration
    let self = this;
    let filterOptions = [
      { value: "0", text: "January" },
      { value: "1", text: "February" },
      { value: "2", text: "March" },
      { value: "3", text: "April" },
      { value: "4", text: "May" },
      { value: "5", text: "June" },
      { value: "6", text: "July" },
      { value: "7", text: "August" },
      { value: "8", text: "September" },
      { value: "9", text: "October" },
      { value: "10", text: "November" },
      { value: "11", text: "December" }
    ];

    _.forEach(filterOptions, function(element, i) {
      element.text =
        element.value == self.currentMonth
          ? "This Month - " + element.text
          : element.text;

      self.telehealthAppointmentFilterOptions.push(element);
    }); */
  }
};
</script>

<style scoped lang="scss">
.appointment-list {
  .appointment-card {
    width: 100%;
    background-color: #fff;
    padding: 12px 0 0 0;
    border: 1px solid #d4d9e2;
  }

  .table-column {
    width: 100%;
    background-color: #fff;
    height: 100%;
    padding: 16px;
    color: #4a4a4a;
  }

  .main-heading {
    color: #666669;
    font-size: 18px;
  }
  /deep/ .table th {
    border-top: none !important;
    min-width: 120px !important;
    max-width: 150px !important;
  }

  /deep/ .col {
    padding: 0px;
  }

  .status {
    text-transform: capitalize;
  }
  .status.notstarted {
    color: #f0ad4e;
    text-transform: capitalize;
    padding: 0px 6px;
    border-radius: 2px;
    background-color: #fdf6ed;
  }
}
</style>
