<template>
  <div>
    <b-card-group class="border-top">
      <b-card no-body class="border-0" :header="title">
        <b-list-group v-if="comments" flush>
          <b-list-group-item class="item border-0" v-for="comment in comments" :key="comment.id">
            <b-row>
              <div class="col-5">
                <div class="name-class pb-5">
                  <span v-if="comment.author.name.firstName">{{ comment.author.name.firstName }}</span>
                  <span v-if="comment.author.name.middleName">{{ comment.author.name.middleName }}</span>
                  <span v-if="comment.author.name.lastName">{{ comment.author.name.lastName }}</span>
                </div>
                <div>{{ new Date(comment.postedAt * 1000 ) | formatGMTDate }}</div>
              </div>
              <div class="col-7 div_style">{{ comment.message }}</div>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import ButtonCmp from '@/components/common/button';

export default {
  name: 'form-fields-list',
  components: { ButtonCmp },
  props: {
    comments: Array,
  },
  data() {
    return {
      title: 'Comments',
    };
  },
  methods: {},
};
</script>

<style scoped>
.item {
  font-size: 0.9rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  text-align: left;
  color: #666669;
  padding-left: 30px;
}
.name-class {
  font-weight: 700;
}
.div_style {
  border-left: 1px solid #d4d9e2; 
}
</style>
