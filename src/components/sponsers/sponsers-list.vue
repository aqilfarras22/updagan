<template>
  <div class="client_bg">
    <mainHeader></mainHeader>
    <div class="container">
      <div class="row has-header">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pb-15 pt-20">
          <span class="fs-24 color_ff">Novarties</span> <button class="edit-btn" v-on:click="editSponser(sponserId)">Edit</button>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 padding-left0">
          <div class="form-group has-feedback">
            <span class="fa fa-search form-control-feedback search-Icon search-color"></span>
            <input type="text" class="form-control br-30 search-pad" placeholder="Search..." v-model="searchTerm" @keyup.enter="searchUsers(searchTerm)">
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
          <span class="fa-stack fa-lg pull-right cursor_pointer" v-on:click="addSponser()">
              <i class="fa fa-circle fa-stack-2x icon-bg1"></i>
              <i class="fa fa-plus fa-stack-1x font-size35 color_ff line-height40 icon-bg1"></i>
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
                <tr v-for="user in users ">
                  <td class="text-wrap col-sm-3 col-lg-3 col-md-3">{{user.firstName}} {{user.lastName}}</td>
                  <td class="xs-none text-wrap col-sm-3 col-lg-3 col-md-3">{{user.username}}</td>
                  <td class="xs-none col-sm-2 col-lg-2 col-md-2">{{user.userRole}}</td>
                  <td class="xs-none col-sm-2 col-lg-2 col-md-2" v-bind:class="{ 'color_green': user.status==='Active','color_red': user.status==='Inactive','color_yellow': user.status==='Pending'}">{{user.status}}</td>
                  <td class="view-color col-sm-2 col-lg-2 col-md-2" v-on:click="viewSponser(sponserId)">View/Edit</td>
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
      sponserId: 0,
      users: {},
      searchTerm: null,
    };
  },
  mounted() {
    this.getAllClients();
  },
  methods: {
    editSponser(sponserId) {
      this.$router.push({ name: 'add-edit-sponser', params: { sponserId } });
    },
    getAllClients() {
      this.$api.getAllUsersFact().then(
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
    viewSponser(sponserId) {
      this.$router.push({ name: 'sponser-member-add-edit', params: { sponserId } });
    },
    addSponser() {
      this.$router.push({ name: 'sponser-member-add-edit', params: { sponserId: 0 } });
    },
  },
  components: { mainHeader, Copyright },
};
</script>

<style scoped lang="scss">
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

.icon-bg1 {
  background: #f16559 !important;
  border-radius: 50%;
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
