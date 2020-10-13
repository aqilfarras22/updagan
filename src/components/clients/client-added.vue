<template>
  <div class="cro_bg client_bg ">
    <div class="client_bg ">
      <mainHeader></mainHeader>
      <div class="container">
        <div>
          <div class="row has-header pt-10">
            <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 col-sm-offset-2 pt-60">
              <div class="green-check fs-50"><i class="fa fa-check-circle" aria-hidden="true"></i></div>
              <div class="text_desc">Client added!</div>
              <div class="text_desc">Would you like to add contact to {{clientName}}?</div>
              <div class="create_btn_section">
                <button class="btn rightnow-btn mr-20" v-on:click="goToClients()">Not right now</button>
                <button class="btn rightnow-btn mr-20" v-on:click="createNewClientMember()">Yes</button>
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
        clientName: null,
      };
    },
    mounted() {
      this.clientName = window.localStorage.getItem('client-name');
    },
    methods: {
      goToClients() {
        this.$router.push({ name: 'clients' });
      },
      createNewClientMember() {
        this.$router.push({ name: 'add-new-client-member', params: { clientId: 0 } });
      },
    },
    components: { mainHeader, Copyright },
  };
</script>

<style scoped lang="scss">

.client_bg {
  background: url('/static/img/bg/client.png') no-repeat center center fixed;
  background-color: #2A496D;
  background-blend-mode: multiply;
  height: 100%;
  min-height: 100vh;
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
  color: #fff;;
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