<template>
  <div>
    <div
      class="list-unstyled"
      id="comments"
      :class="{ 'comments-mobile': isMobile, 'comments-pc': !isMobile }"
    >
      <li v-for="comment in comments" :key="comment.index" class="my-2">
        <div
          class="text-light"
          id="comment-context"
          :class="{ 'font-x-small': isMobile }"
        >
          {{ comment.context }}
        </div>
        <div
          v-if="comment.replyMode"
          class="text-warning"
          :class="{ 'font-x-small': isMobile }"
        >
          {{ comment.replyContext }}
        </div>

        <a :href="comment.imgUrl" :data-lightbox="comment.imgUrl">
          <img
            v-if="comment.imgUrl !== null && comment.imgUrl !== undefined"
            :src="comment.imgUrl"
            class="col-6"
          />
        </a>
        <div
          class="d-flex justify-content-around"
          :class="{ 'font-x-small': isMobile }"
        >
          <div v-if="comment.createdAt" class="text-secondary">
            {{ createdAtStr(comment.createdAt) }}
          </div>
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
              v-if="comment.context !== ''"
              class="material-icons text-secondary"
              @click="setReplyMode(comment.context)"
            >
              reply
            </i>
          </div>
        </div>
      </li>
    </div>
    <div id="reply-comment" :style="replyCommentStyle" class="my-3 bg-dark">
      <div v-if="reply.mode" class="text-light">
        {{ reply.context }}
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
      db: firebase.firestore(),
      comments: [],
      commentListLimit: 50,
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
  props: ["stock", "createdAtStr", "user", "reply"],

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
      this.db
        .collection("comments")
        .where("stock", "==", this.stock)
        .orderBy("createdAt", "desc")
        .limit(this.commentListLimit)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().sort(this.createdAtDescSort);
          //console.log("snapshot", snapshot);
          snapshot.docChanges().forEach((change) => {
            switch (change.type) {
              case "added":
                //console.log(change.type, change.doc.id, change.doc.data());
                this.addComments(change);
                break;
              case "modified":
                //console.log(change.type, change.doc.id, change.doc.data());
                this.modifyComments(change);
                break;
              case "removed":
                //console.log(change.type, change.doc.id, change.doc.data());
                this.comments.shift();
                break;
              default:
              //console.log("error");
            }
          });
        });
    },
    addComments(change) {
      //console.log(this.user.id);
      this.db
        .collection("users")
        .doc(this.user.id)
        .collection("likeComments")
        .doc(change.doc.id)
        .get()
        .then((data) => {
          const createdAtInt = change.doc.data().createdAt;
          this.comments.push({
            id: change.doc.id,
            context: change.doc.data().context,
            likedCount: change.doc.data().likedCount,
            like: data.exists,
            createdAt:
              createdAtInt !== null ? createdAtInt.toDate() : createdAtInt,
            userId: change.doc.data().userId,
            imgUrl: change.doc.data().imgUrl,
            replyMode: change.doc.data().replyMode,
            replyContext: change.doc.data().replyContext,
          });
        });
    },
    modifyComments(change) {
      const index = this.comments.findIndex(
        (item) => item.id === change.doc.id
      );
      if (index !== -1) {
        this.db
          .collection("users")
          .doc(this.user.id)
          .collection("likeComments")
          .doc(change.doc.id)
          .get()
          .then((data) => {
            const createdAtInt = change.doc.data().createdAt;
            this.comments.splice(index, 1, {
              id: change.doc.id,
              context: change.doc.data().context,
              likedCount: change.doc.data().likedCount,
              like: data.exists,
              createdAt:
                createdAtInt !== null ? createdAtInt.toDate() : createdAtInt,
              userId: change.doc.data().userId,
              imgUrl: change.doc.data().imgUrl,
              replyMode: change.doc.data().replyMode,
              replyContext: change.doc.data().replyContext,
            });
          });
      }
    },
    createdAtDescSort(a, b) {
      if (a.doc.data().createdAt < b.doc.data().createdAt) {
        return -1;
      } else {
        return 1;
      }
    },
    setReplyMode(context) {
      this.$emit("setReplyMode", context);
    },
    releaseReplyMode() {
      this.$emit("releaseReplyMode");
    },
  },
};
</script>

<style>
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
.font-small {
  font-size: small;
}
.font-x-small {
  font-size: x-small;
}
</style>