<template>
  <div class="container">
    <Chart :stock="stock"></Chart>
    <Comments
      :stock="stock"
      :comments="comments"
      :createdAtStr="createdAtStr"
      :user="user"
      @setReplyMode="setReplyMode"
      @releaseReplyMode="releaseReplyMode"
      :reply="reply"
      ref="commentsCpn"
    ></Comments>
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
        id: "",
        name: "",
      },
      stock: this.$route.params.symbol,
      isSmartPhone: false,
      reply: {
        mode: false,
        context: "",
      },
    };
  },
  watch: {
    $route(to) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.stock = to.params.symbol;
      console.log(this.stock);
      this.main();
    },
  },
  mounted: function () {
    this.main();
  },
  methods: {
    main() {
      this.auth.signInAnonymously().catch((error) => {
        this.error = `[error] Can not signin anonymouse (${error.code}:${error.message})`;
      });
      this.auth.onAuthStateChanged((user0) => {
        if (user0) {
          this.user.id = user0.uid;
          console.log(this.user.id);
          this.db
            .collection("users")
            .doc(this.user.id)
            .get()
            .then((data) => {
              if (!data.exists) {
                this.createNewUser(this.db, this.user.id);
              }
              this.user.name = data.data().name;
            });
          this.$refs.commentsCpn.setInitialCommentList();
        }
      });
      this.isSmartPhone = this.checkIsSmartPhone();
      this.setAffiliateLinkImg();
    },
    scrollBottom() {
      const comments = document.getElementById("comments");
      comments.scrollTop = comments.scrollHeight - comments.clientHeight;
    },
    setReplyMode(context) {
      this.$set(this.reply, "mode", true);
      this.$set(this.reply, "context", context);
    },
    releaseReplyMode() {
      this.$set(this.reply, "mode", false);
      this.$set(this.reply, "context", "");
    },
    createNewUser(db, userId) {
      db.collection("users").doc(userId).set({
        name: "名無し",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    },

    async likeComment(db, commentId, userId) {
      console.log("likeComment");
      const batch = db.batch();
      batch.set(
        db
          .collection("comments")
          .doc(commentId)
          .collection("likedUsers")
          .doc(userId),
        { createdAt: firebase.firestore.FieldValue.serverTimestamp() }
      );
      batch.set(
        db
          .collection("users")
          .doc(userId)
          .collection("likeComments")
          .doc(commentId),
        { createdAt: firebase.firestore.FieldValue.serverTimestamp() }
      );
      batch.update(db.collection("comments").doc(commentId), {
        likedCount: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await batch.commit();
    },
    async unlikeComment(db, commentId, userId) {
      console.log("unlikeComment");
      const batch = db.batch();
      batch.delete(
        db
          .collection("comments")
          .doc(commentId)
          .collection("likedUsers")
          .doc(userId)
      );
      batch.delete(
        db
          .collection("users")
          .doc(userId)
          .collection("likeComments")
          .doc(commentId)
      );
      batch.update(db.collection("comments").doc(commentId), {
        likedCount: firebase.firestore.FieldValue.increment(-1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await batch.commit();
    },
    checkIsSmartPhone() {
      if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        return true;
      } else {
        return false;
      }
    },
    createdAtStr(createdAtDate) {
      return (
        ("0" + (createdAtDate.getMonth() + 1)).slice(-2) +
        "/" +
        createdAtDate.getDate() +
        " " +
        createdAtDate.getHours() +
        ":" +
        ("0" + createdAtDate.getMinutes()).slice(-2)
      );
    },
    setAffiliateLinkImg() {
      const width = document.documentElement.clientWidth;
      console.log(width);
      const widgetBottom = document.getElementById("widget-bottom");
      console.log(widgetBottom);
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
</style>