<template>
  <div style="width: 100%; background-color: #2a2a2a">
    <div class="container">
      <h4>あなたのユーザー識別ID</h4>
      <p>{{ $userId }}</p>
      <Comments
        :stock="stock"
        :user="user"
        @setReplyMode="setReplyMode"
        @releaseReplyMode="releaseReplyMode"
        :reply="reply"
      ></Comments>
    </div>
  </div>
</template>
<script>
import Comments from "../components/Comments.vue";

export default {
  components: {
    Comments,
  },
  mounted: function () {
    console.log(this.$route.name);
  },
  data() {
    return {
      user: {
        id: this.$userId,
        name: "",
      },
      stock: "user",
      reply: {
        mode: false,
        context: "",
      },
    };
  },
  methods: {
    setReplyMode(context) {
      this.$set(this.reply, "mode", true);
      this.$set(this.reply, "context", context);
    },
    releaseReplyMode() {
      this.$set(this.reply, "mode", false);
      this.$set(this.reply, "context", "");
    },
  },
};
</script>