<template>
  <div class="main_bg client_bg">
    <mainHeader></mainHeader>
    <div class="container">
      <div class="row has-header" v-if="clients && clients.length > 0">
        <div class="col-md-12 col-sm-12 col-xs-12 heading">Your Clients</div>
        <div class="col-md-12 col-sm-12 col-xs-12 pb-20">
          <div class="col-md-10 col-sm-10 col-xs-10 p-0">
            <div class="col-md-4 col-sm-4 col-xs-12 pl-0">
              <input type="text" class="form-control mb-10 br-25 search-field" placeholder="Search..." v-model="searchTerm" @keyup.enter="searchStudies(searchTerm)">
            </div>
            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0 mb-10">
              <select class="form-control select-style select_control br-25" disabled>
                <option>Sort</option>
                <option>Most recent</option>
                <option>Id ascending</option>
                <option>Id descending</option>
              </select>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 pl-0">
              <select class="form-control select-style select_control br-25" disabled>
                <option>Filters</option>
                <option>Acitve</option>
                <option>Deactivated</option>
                <option>Partcipating</option>
                <option>In other studies</option>
              </select>
            </div>
          </div>
          <div class="col-md-2 col-sm-2 col-xs-2 text-right p-0">
            <span class="fa-stack fa-lg pull-right cursor_pointer" v-on:click="createNewClient()">
              <i class="fa fa-circle fa-stack-2x icon-background1"></i>
              <i class="fa fa-plus fa-stack-1x color_ff font-size35 icon-background-maroon border-radius50 line-height40"></i>
            </span>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4" v-for="client in clients">
          <div class="panel panel-default no-border">
            <router-link :to="{ name: 'client-list', params: {clientId :client.id }}">
              <div class="panel-body study-card">
                <img :src="client.logo" alt="" class="client-logo">
                <h3 class="client-name">{{client.name}}</h3>
                <div class="members">{{client.membersCount}} contacts</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="clients && clients.length == 0">
        <div class="row has-header pt-10">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="text_desc pt-30 fs-30">Your Clients</div>
            <div class="text_desc pt-40 fs-28 text-center">No clients listed. </div>
            <div class="create_btn_section">
              <button class="btn create-btn" v-on:click="createNewClient()">Create</button>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_footer">
        <div class="">Questions or need help ?</div>
        <Copyright />
      </div>
    </div>
  </div>
</template>

<script>
// import jwt from 'jwt-decode';
import mainHeader from '../common/main-header';
import Copyright from '../common/copyright';

export default {
  name: 'Clients',
  data() {
    return {
      clientId: null,
      clients: [],
      searchTerm: null,
    };
  },
  mounted() {
    this.getAllClients();
  },
  methods: {
    getAllClients() {
      this.$api.getClientsListFact().then(response => {
        if (response.body) {
          this.clients = response.body;
        }
      });
    },
    // searchStudies(searchTerm) {
    //   searchTerm = searchTerm.trim(); // eslint-disable-line
    //   searchStudiesFact(searchTerm)
    //     .then((response) => {
    //       if (response.body) {
    //         this.studies = response.body;
    //       }
    //     });
    // },
    createNewClient() {
      this.$router.push({ name: 'add-edit-client', params: { clientId: 0 } });
    },
  },
  components: { mainHeader, Copyright },
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
  font-size: 18px;
  margin: 10px 0;
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
    content: '';
    clear: both;
    display: block;
  }
}

.search-field {
  padding-right: 30px;
  background-image: url('/static/img/icon-search.gif');
  background-repeat: no-repeat;
  background-position: 97% 50%;
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

h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
}

.icon-background-maroon {
  background: #f16559 !important;
}

.border-radius50 {
  border-radius: 50%;
}

h3 {
  padding-bottom: 30px;
  color: #000;
  font-weight: 400;
}

.panel-body {
  min-height: 200px;
  height: 200px;
}

.select_control {
  background-color: rgba(25, 88, 119, 0.75);
  color: #fff;
  padding: 0 10px !important;
  border: none;
}

.heading {
  color: #fff;
  font-size: 24px;
  font-weight: 200;
  padding-bottom: 20px;
}
.client-logo {
  height: auto;
  max-height: 60px;
}
.members {
  position: absolute;
  bottom: 12px;
  font-size: 16px;
  line-height: 1.44;
  color: #959fa4;
}

.create_button {
  color: #fff;
  font-size: 32px;
}

.text_desc {
  color: #fff;
  font-size: 20px;
  font-weight: 100;
  padding: 2px 0;
}

.create_btn_section {
  padding: 20px 0;
  text-align: center;
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

.os_icons {
  position: absolute;
  bottom: 32px;
}

.date_val {
  position: absolute;
  bottom: 12px;
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

.no-border {
  border: none;
}

.study-card {
  background-color: #f5f8fa;
  padding: 10px;
  position: relative;
}

.new-card {
  background-color: #01b7fe;
  text-align: center;
  height: 200px;
  padding-top: 80px;
}

.create-btn {
  border-radius: 100px;
  width: 250px;
  height: 50px;
  background: #f16559;
  color: #fff;
  font-size: 24px;
  border: none;
}

.bottom_footer {
  text-align: center;
  bottom: 10px;
  font-size: 14px;
  font-weight: 200;
  width: inherit;
  padding-top: 20px;
  padding-bottom: 20px;
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

.logout_link {
  line-height: 12px;
  font-size: 14px;
}

.client-name {
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
  color: #4a4a4a;
  width: 100%;
}
</style>
