<template>
  <div class="container">
    <Form
      :stock="stock"
      :user="user"
      :reply="reply"
      @releaseReplyMode="releaseReplyMode"
    ></Form>
  </div>
</template>

<script>
import Comments from "../components/Comments.vue";
import Chart from "../components/Chart.vue";
import Form from "../components/Form.vue";

export default {
  components: {
    Comments,
    Chart,
    Form,
  },
};
