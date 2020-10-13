<template>
  <div class="main_bg client_bg">
    <mainHeader></mainHeader>
    <div class="container">
      <div class="row has-header">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <span class="team-member">{{clientObj.name}}</span> <button class="edit-btn" v-on:click="editClient(clientId)">Edit</button>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 padding-left0">
          <div class="form-group has-feedback">
            <input type="text" class="form-control br-30 search-field" placeholder="Search..." v-model="searchTerm" @keyup.enter="searchUsers(searchTerm)">
          </div>
        </div>
        <div class="col-xs-5 col-sm-3 col-md-2 col-lg-2 padding-left0">
          <select class="form-control br-30 select_control input-bg" disabled>
              <option>Sort</option>
              <option>Most recent</option>
              <option>Id ascending</option>
              <option>Id descending</option>
            </select>
        </div>
        <div class="col-xs-5 col-sm-3 col-md-2 col-lg-2 padding-left0">
          <select class="form-control select_control br-30 input-bg" disabled>
              <option>Filters</option>
              <option>Acitve</option>
              <option>Deactivated</option>
              <option>Partcipating</option>
              <option>In other studies</option>
            </select>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2  col-sm-offset-0 col-md-offset-4 col-md-offset-4 col-lg-offset-4">
          <span class="fa-stack fa-lg pull-right cursor_pointer" v-on:click="addClient()">
              <i class="fa fa-circle fa-stack-2x"></i>
              <i class="fa fa-plus fa-stack-1x icon-background-maroon border-radius50 font-size35  line-height40"></i>
            </span>
        </div>
      </div>
      <div class="row p-15">
        <div class="col-md-12 col-sm-12 white-bg">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th class="xs-none">Email</th>
                  <th class="xs-none">Contact type</th>
                  <th class="xs-none">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="clientMember in clientMembers ">
                  <td class="text-wrap col-sm-3 col-lg-3 col-md-3">{{clientMember.firstName}} {{clientMember.lastName}}</td>
                  <td class="xs-none text-wrap col-sm-3 col-lg-3 col-md-3">{{clientMember.username}}</td>
                  <td class="xs-none col-sm-2 col-lg-2 col-md-2">{{clientMember.contactType}}</td>
                  <td class="xs-none col-sm-2 col-lg-2 col-md-2" v-bind:class="{ 'color_green': clientMember.status==='Active','color_red': clientMember.status==='Inactive','color_yellow': clientMember.status==='Pending'}">{{clientMember.status}}</td>
                  <td class="view-color col-sm-2 col-lg-2 col-md-2" v-on:click="viewClient(clientMember.id)">View/Edit</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row bottom_footer">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <p class="text-center font-size10">Questions or need help ?</p>
          <Copyright />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import jwt from 'jwt-decode';
import toastr from 'toastr';
import mainHeader from '../common/main-header';
import Copyright from '../common/copyright';

export default {
  name: 'clientList',
  data() {
    return {
      clientId: null,
      users: {},
      searchTerm: null,
      clientObj: {},
      clientMembers: {},
    };
  },
  mounted() {
    this.clientId = this.$route.params.clientId;
    this.getAllClientMembers();
    this.getClientDetails();
  },
  methods: {
    getClientDetails() {
      this.$api.getClientDataFact(this.clientId).then(
        response => {
          this.clientObj = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while getting clients.',
          );
        },
      );
    },
    getAllClientMembers() {
      this.$api.getClientAllMemberDataFact(this.clientId).then(
        response => {
          this.clientMembers = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while getting clients.',
          );
        },
      );
    },
    editClient(clientId) {
      this.$router.push({ name: 'add-edit-client', params: { clientId } });
    },
    searchClients(searchTerm) {
      searchTerm = searchTerm.trim(); // eslint-disable-line
      this.$api.searchUsersFact(searchTerm).then(
        response => {
          this.users = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while getting clients.',
          );
        },
      );
    },
    viewClient(memberId) {
      this.$router.push({
        name: 'add-edit-client-member',
        params: { clientId: this.clientId, clientMemberId: memberId },
      });
    },
    addClient() {
      this.$router.push({
        name: 'add-new-client-member',
        params: { clientId: this.clientId, clientMemberId: 0 },
      });
    },
  },
  components: { mainHeader, Copyright },
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

.search-field{
  padding-right: 30px;
  background-image: url('/static/img/icon-search.gif');
  background-repeat: no-repeat;
  background-position: 97% 50%;
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
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.client_bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  min-height: 100vh;
  background-color: #34537d;
  background-blend-mode: soft-light;
  height: 100%;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.color_maroon {
  color: #f16559 !important;
}

.border-radius50 {
  border-radius: 50%;
}

.icon-background-maroon {
  background: #f16559 !important;
}

h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
}

h3 {
  padding-bottom: 60px;
  color: black;
}

.panel-body {
  min-height: 200px;
  height: 200px;
}

.heading {
  font-size: 24px;
  font-weight: 200;
}
.edit-btn {
  width: 50px;
  height: 24px;
  border-radius: 4px;
  background-color: #2d3752;
  outline: none;
  border: none;
  color: #fff;
  margin-left: 10px;
}
.header_row {
  padding-bottom: 20px;
}

.fontStyle {
  font-family: sans-serif;
  font-size: 4rem;
  margin-bottom: 50px;
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #fff;
  text-decoration: none;
  font-size: 25px;
}

.date_val {
  color: #aaa;
  font-size: 12px;
}

button {
  cursor: pointer;
}

.outline-active {
  background: none;
  border: 1px solid #01b7fe;
  color: #01b7fe;
}

.outline-inactive {
  background: none;
  border: 1px solid #8c8c8c;
  color: #8c8c8c;
}

p {
  font-size: 15px;
}

.study-card {
  background-color: #f5f8fa;
  border: none !important;
  padding: 10px 10px 10px 10px;
}

.new-card {
  background-color: #01b7fe;
  text-align: center;
  height: 200px;
  padding-top: 80px;
}

.bottom_footer {
  position: relative;
  bottom: 0px;
  width: 100%;
  padding-top: 20px;
  color: #fff;
  clear: both;
}

.header {
  padding-top: 20px;
  padding-bottom: 10px;
}

.user-icon {
  padding-right: 10px;
  color: yellow;
}

.font-size10 {
  font-size: 10px;
  margin: 0px !important;
}

.logout_link {
  line-height: 12px;
  font-size: 14px;
}

.team-member {
  font-size: 30px;
  line-height: 1.87;
}

.search-pad {
  padding: 5px 10px;
}

.select-style {
  background: rgba(22, 59, 78, 0.7);
  color: #fff;
}

.search-color {
  color: #333;
}
.select_control {
  background-color: #d3dfe4;
  color: #707c81;
  padding: 0 10px !important;
  border: none;
}

table {
  color: #4a4a4a;
}

td {
  border: none !important;
}

th {
  color: #959fa4;
}

.view-color {
  color: #00b1ff;
  cursor: pointer;
}
.text-wrap {
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .xs-none {
    display: none;
  }
}
</style>
