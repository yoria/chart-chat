<template>
  <div>
    <div>
      <li
        v-for="(comment, key) in comments"
        :key="key"
        class="my-2 list-unstyled"
      >
        <div :class="{ 'border border-warning': comment.userId === user.id }">
          <div
            class="text-light"
            :class="{
              'font-x-small': isMobile,
            }"
            id="comment-context"
          >
            {{ comment.context }}
          </div>
          <a :href="comment.imgUrl" :data-lightbox="comment.imgUrl">
            <img
              v-if="comment.imgUrl !== ''"
              :src="comment.imgUrl"
              width="80"
            />
          </a>
        </div>

        <div
          v-if="comment.replyMode"
          class="border border-primary text-white"
          :class="{ 'font-x-small': isMobile }"
        >
          {{ comment.replyContext }}
          <img
            v-if="comment.replyImgUrl !== ''"
            :src="comment.replyImgUrl"
            width="80"
          />
        </div>
        <div
          v-if="comment.createdAt"
          class="text-secondary"
          :class="{ 'font-x-small': isMobile }"
        >
          {{ getStrFromMs(comment.createdAt) }}
        </div>
        <div
          class="d-flex justify-content-around"
          :class="{ 'font-x-small': isMobile }"
        >
          <div v-if="comment.context !== ''">
            <a
              v-if="isIphone"
              :href="
                'twitter://post?message=' +
                comment.context +
                '%0A%23Chachat%0A' +
                currentUrl
              "
            >
              <img src="/twitter.png" id="width" width="18" height="18" />
            </a>
            <a
              v-else
              :href="
                'https://twitter.com/intent/tweet?text=' +
                comment.context +
                '%0A%23Chachat%0A' +
                currentUrl
              "
              rel="noopener noreferrer"
            >
              <img src="/twitter.png" width="18" height="18" />
            </a>
          </div>
          <div>
            <i
              class="material-icons text-secondary"
              style="font-size: 2rem"
              @click="setReplyMode(comment.context, comment.imgUrl)"
            >
              reply
            </i>
          </div>

          <div v-if="comment.userId !== user.id">
            <i
              v-if="
                Object.keys(comment).indexOf('likedUsers') === -1 ||
                Object.keys(comment.likedUsers).indexOf(user.id) === -1
              "
              class="material-icons text-secondary"
              @click="like(key, comment.likedCount)"
              style="font-size: 1.5rem"
            >
              thumb_up_alt
            </i>
            <i
              v-else
              class="material-icons text-primary"
              @click="unlike(key, comment.likedCount)"
              style="font-size: 1.5rem"
            >
              thumb_up_alt
            </i>
            <p class="text-white">{{ comment.likedCount }}</p>
          </div>
        </div>
      </li>
    </div>
    <div
      id="reply-comment"
      :style="replyCommentStyle"
      class="my-3 border border-primary"
    >
      <div>
        <div class="text-light">{{ reply.context }}</div>
        <img v-show="reply.imgUrl !== ''" :src="reply.imgUrl" width="80" />
      </div>
      <button
        v-show="reply.mode"
        @click="releaseReplyMode()"
        class="btn btn-outline-primary btn-sm"
      >
        返信しない
      </button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      db: firebase.database(),
      comments: {},
      commentListLimit: 30,
      isIphone: navigator.userAgent.match(/iPhone/),
      currentUrl: encodeURIComponent(location.href),
      widgetTopBarHeight: 50,
      isMobile: navigator.userAgent.match(/iPhone|Android.+Mobile/),
      replyCommentStyle: {
        zIndex: 1600,
        position: "fixed",
        right: "10px",
        top: `${
          document.getElementById("symbol-dropdown").clientHeight + 10
        }px`,
      },
    };
  },
  props: ["stock", "user", "reply"],

  watch: {
    stock: {
      handler: function () {
        Object.assign(this.$data, this.$options.data.call(this));
        this.setInitialCommentList();
      },
    },
  },
  mounted: function () {
    this.setInitialCommentList();
  },
  methods: {
    setInitialCommentList() {
      //console.log(this.stock);
      if (this.stock === "user") {
        this.db
          .ref("comments")
          .orderByChild("userId")
          .startAt(this.user.id)
          .endAt(this.user.id)
          .on("value", (snapshot) => {
            this.comments = snapshot.val();
            console.log(snapshot.val());
          });
      } else {
        this.db
          .ref("comments")
          .orderByChild("stock")
          .startAt(this.stock)
          .endAt(this.stock)
          .limitToLast(this.commentListLimit)
          .on("value", (snapshot) => {
            this.comments = snapshot.val();
            console.log(snapshot.val());
          });
      }
    },
    setReplyMode(context, imgUrl) {
      this.$emit("setReplyMode", context, imgUrl);
    },
    releaseReplyMode() {
      this.$emit("releaseReplyMode");
    },
    like(id, count) {
      console.log(id);
      const updates = {};
      updates[`/comments/${id}/likedCount`] = count + 1;
      updates[`/comments/${id}/likedUsers/${this.user.id}`] = true;
      this.db.ref().update(updates);
    },
    unlike(id, count) {
      const updates = {};
      updates[`/comments/${id}/likedCount`] = count - 1;
      this.db.ref().update(updates);
      this.db.ref(`/comments/${id}/likedUsers/${this.user.id}`).remove();
    },
    scrollBottom() {
      const comments = document.getElementById("comments");
      comments.scrollTop = comments.scrollHeight - comments.clientHeight;
    },
    getStrFromMs(createdAt) {
      const createdAtDate = new Date(createdAt);
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
  },
};
</script>

<style>
.comments-mobile {
  position: fixed;
  top: 50px;
  left: 10px;
  width: 35%;
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
.font-small {
  font-size: small;
}
.font-x-small {
  font-size: x-small;
}
</style>