<template>
    <div class="container-fluid pl-30 pt-17 pb-30">      
        <nav aria-label="breadcrumb" class="participant-breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link :to="{ name: 'study-participant-messages'}">Messages</router-link>
                </li>
                <li class="breadcrumb-item current-label">
                    <span>Compose Message</span>
                </li>
            </ol>
        </nav>
        <ParticipantComposeMessage :allParticipantsView="true"></ParticipantComposeMessage>     
    </div>
</template>
<script>
import ParticipantComposeMessage from "@/components/common/compose-message";
export default {
  name: "ComposeMessage",
  components: {
    ParticipantComposeMessage
  }
}
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style lang="scss" scoped>
  .participant-breadcrumb {
      width: auto;
      background-color: transparent;
  }
  .breadcrumb {
      padding: 0;
      background-color: transparent;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      list-style: none;
      border-radius: 0.25rem;
  }
  .breadcrumb-item {
      color: #4a4a4a;
      a{
      color: #4c8ce4;
      }
      &.current-label {
          color: #9b9b9b;
          cursor: text;
      }
  }
</style>