<template>
  <div class="resetPassword main_bg">
    <div class="container container-style">
      <div class="card forgot-block">        
        <div class="card-body">          
            <h2 class="card-title">Reset Password</h2>
            <form v-on:submit.prevent="resetPassword">
              <div class="form-group">
                <input type="password" class="form-control form-control-lg" v-model.lazy="user.password" placeholder="Enter new password" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control form-control-lg" v-model.lazy="user.password" placeholder="Re-enter new password" required>
              </div>
              <div class="form-group">
                <button class="btn btn-info btn-lg btn-block br-25">Submit</button>
              </div>
            </form>
          </div>        
      </div>
    </div>
  </div>
</template>

<script>
  // import toastr from 'toastr';
  
  export default {
    name: 'ResetPassword',
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
        formErrors: false,
      };
    },
    mounted() { },
    methods: {
      resetPassword() {
        this.$router.push({ name: 'login' });
        //   // window.localStorage.setItem('bard_auth_token', response.body.data.token);
        //   this.$http.headers.common.Authorization = response.body.data.token;
        //   this.$router.go({ name: 'profile' });
        // }, (error) => {
        //   const err = error;
        //   return err;
        // });
      },
    },
  };
</script>

<style scoped lang="scss">

h1,
h2 {
  font-weight: normal;
  color: #34537d;
}

.forgot-block {
  max-width: 360px;
  margin: 0 auto;
}

.card-title {
  margin-bottom: 12px;
  margin-top: 3px;
}
  
  .font-style {
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
  
  a,
  p {
    color: #8c8c8c;
    font-size: 18px;
  }
  
  .container {
    padding-top: 100px;
  }
  
  .card-body{
    padding: 15px;
  }
</style>
