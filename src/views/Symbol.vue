<template>
  <div class="container">
    <Chart :stock="stock"></Chart>
    <div
      :class="{ 'comments-mobile': isSmartPhone, 'comments-pc': !isSmartPhone }"
    >
      <Comments
        :stock="stock"
        :user="user"
        @setReplyMode="setReplyMode"
        @releaseReplyMode="releaseReplyMode"
        :reply="reply"
      ></Comments>
    </div>
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
import firebase from "firebase";

export default {
  components: {
    Comments,
    Chart,
    Form,
  },
  data() {
    return {
      db: firebase.firestore(),
      auth: firebase.auth(),
      user: {
        id: this.$userId,
        name: "",
      },
      stock: this.$route.params.symbol,
      isSmartPhone: false,
      reply: {
        mode: false,
        context: "",
        imgUrl: "",
      },
    };
  },
  watch: {
    $route(to) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.stock = to.params.symbol;
      //console.log(this.stock);
      this.main();
    },
  },
  mounted: function () {
    this.main();
  },
  methods: {
    main() {
      this.isSmartPhone = this.checkIsSmartPhone();
    },
    setReplyMode(context, imgUrl) {
      this.$set(this.reply, "mode", true);
      this.$set(this.reply, "context", context);
      this.$set(this.reply, "imgUrl", imgUrl);
    },
    releaseReplyMode() {
      this.$set(this.reply, "mode", false);
      this.$set(this.reply, "context", "");
      this.$set(this.reply, "imgUrl", "");
    },
    checkIsSmartPhone() {
      if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style type=" text/css">
.FlexTextarea {
  position: relative;
  /*border: 10px solid #b6c3c6;*/
}

.FlexTextarea__dummy {
  /*height: auto;*/
  box-sizing: border-box;
  overflow: hidden;
  visibility: hidden;
  /* 意図的改行 */
  white-space: pre-wrap;
  /* 自動改行 */
  word-wrap: break-word;
  /* 自動改行 */
  overflow-wrap: break-word;
  font-size: 16px;
  transform: scale(0.75);
}

.FlexTextarea__textarea {
  position: absolute;
  display: block;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: transparent;
  letter-spacing: inherit;
  font-size: 16px;
  resize: none;
  transform: scale(0.75);
}

.form-control {
  padding: 0.1rem;
}
#affiliate-link-img {
  z-index: 2000;
  position: fixed;
}
.comments-mobile {
  position: fixed;
  top: 50px;
  left: 10px;
  width: 30%;
  height: 90%;
  overflow-y: scroll;
  word-wrap: break-word;
  z-index: 1100;
}
.comments-pc {
  position: fixed;
  top: 50px;
  left: 10px;
  width: 20%;
  height: 90%;
  overflow-y: scroll;
  word-wrap: break-word;
  z-index: 1100;
}
</style>