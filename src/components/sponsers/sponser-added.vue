<template>
  <div class="client_bg">
    <div class="">
      <mainHeader></mainHeader>
      <div class="container">
        <div>
          <div class="row has-header pt-10">
            <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 col-sm-offset-2 pt-60">
              <div class="green-check"><i class="fa fa-check-circle" aria-hidden="true"></i></div>
              <div class="text_desc">Sponsor added!</div>
              <div class="text_desc">Would you like to add team members to Novartis?</div>
              <div class="create_btn_section">
                <button class="btn rightnow-btn mr-20" v-on:click="goToSponsers()">Not right now</button>
                <button class="btn rightnow-btn mr-20" v-on:click="createNewSponserMember()">Yes</button>
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
    name: 'SponserAdded',
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
      goToSponsers() {
        this.$router.push({ name: 'sponsers' });
      },
      createNewSponserMember() {
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

.text_desc {
  color: #fff;
  text-align: center;
  font-size: 24px;
  font-weight: 100;
  padding: 2px 0;
}
.green-check {
  font-size: 50px;
  color: #51dd75;
  text-align: center;
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

button {
  cursor: pointer;
}

p {
  font-size: 15px;
}

.rightnow-btn {
  border-radius: 40px;
  width: 200px;
  height: 50px;
  background: #f16559;
  color: #ffffff;
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

</style>