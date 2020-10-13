<template>
  <div class="sendOTP main_bg send-otp-bg">
    <div class="container container-style">
      <div>
        <div class="pb-20 text-center fs-30">
          Unauthorized User or Token is not found in the Request
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'expire-link',
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
    },
  };
</script>

<style scoped lang="scss">

  .send-otp-bg {
    background: url('/static/img/bg/about-you.png') no-repeat;
    background-color: #34537D;
    background-size: cover; 
  }
  h1,
  h2 {
    font-weight: normal;
    color: #34537d;
  }
  
  .font-style {
    margin-bottom: 15px;
    margin-top: 10px;
  }
  
  .p-style {
    color: #08131f;
    font-size: 12px;
    margin-bottom: 5px;
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
    color: #00BAF9;
  }
  
  .link-style {
    font-size: 14px;
    text-align: center;
    padding-top: 5px;
  }
  
  p {
    color: #8c8c8c;
    font-size: 18px;
  }
  
  .panel-padding {
    padding: 15px;
  }
  
  .input-style {
    border: 0px solid;
    border-bottom-width: 1px;
    border-radius: 0px;
    box-shadow: none;
    font-size: 24px;
  }
  
  .pl-12 {
    padding-left: 10px;
  }
  
  .pr-12 {
    padding-right: 10px;
  }
  
  .pt-40 {
    clear: both;
    padding-top: 40px;
    margin-bottom: 5px;
  }
  
  .pt-20 {
    clear: both;
    padding-top: 20px;
  }
  
  .btn-disabled {
    color: white;
    background-color: #c6c2c2;
    border: #c6c2c2;
  }
  
  .error-style {
    font-size: 12px;
    color: #FFA500;
    padding-bottom: 15px;
    text-align: center;
  }
  
  .success-msg-style {
    font-size: 12px;
    color: #449d44;
    padding-bottom: 15px;
    text-align: center;
  }

  .container-style {
    padding-top: 120px;
  }
</style>