<template>
  <div class="cro_bg client_bg">
    <div class="client_bg">
      <mainHeader></mainHeader>
      <div class="container">
        <div class="row has-header" v-if="studies && studies.length > 0">
          <div class="col-md-12 col-sm-12 col-xs-12 heading">Your Sponsers</div>
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
              <router-link :to="{ name: 'study-design', params: { studyId: 0 }}">
                <!--<span class="create_button"><span class="plus_icon">+</span></span>-->
                <i class="fa fa-plus-circle create_button" aria-hidden="true"></i>
              </router-link>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4" v-for="study in studies">
            <div class="panel panel-default no-border">
              <router-link :to="{ name: 'sponsers-list', params: {sponserId : 1}}">
                <div class="panel-body study-card">
                  <img src="static/img/logo.png" alt="" class="client-logo">
                  <h3 class="client-name">Novarties</h3>
                  <div class="members">8 members</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="studies && studies.length == 0">
          <div class="row has-header pt-10">
            <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 col-sm-offset-2 pt-60">
              <div class="text_desc">We’re excited to get you started in creating your first mobile study. Before doing so, do you have any sponsors you would like to add? We recommend doing this first.</div>
              <div class="text_desc pt-40 fs-18">We recommend doing this first.</div>
              <div class="create_btn_section">
                <button class="btn rightnow-btn mr-20" v-on:click="GoToSponsers()">Not right now</button>
                <button class="btn rightnow-btn mr-20" v-on:click="createNewSponser()">Yes</button>
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
  </div>
</template>

<script>
// import jwt from 'jwt-decode';
import mainHeader from '../common/main-header';
import Copyright from '../common/copyright';

export default {
  name: 'Sponsers',
  data() {
    return {
      studies: [],
      searchTerm: null,
    };
  },
  mounted() {
    this.getAllStudies();
  },
  methods: {
    GoToSponsers() {
      this.$router.push({ name: 'sponsers' });
    },
    getAllStudies() {
      this.$api.getAllStudiesFact().then(response => {
        if (response.body) {
          this.studies = [];
        }
      });
    },
    searchStudies(searchTerm) {
      searchTerm = searchTerm.trim(); // eslint-disable-line
      this.$api.searchStudiesFact(searchTerm).then(response => {
        if (response.body) {
          this.studies = response.body;
        }
      });
    },
    createNewSponser() {
      this.$router.push({ name: 'add-edit-sponser', params: { sponserId: 0 } });
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

h1,
h2 {
  font-weight: 0px;
  font-family: Helvetica;
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
  height: 24px;
  width: 140px;
  margin-top: 20px;
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
  text-align: center;
  font-size: 24px;
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

.rightnow-btn {
  border-radius: 40px;
  width: 200px;
  height: 50px;
  background: #f16559;
  color: #fff;
  font-size: 22px;
  border: none;
  margin-bottom: 20px;
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
