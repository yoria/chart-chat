<template>
  <div>
    <div id="post-comment" :style="style.postComment">
      <textarea
        v-model="commentContext"
        @input="checkValidContext()"
        id="ta"
        :placeholder="textareaPlaceholder"
        class="form-control"
      ></textarea>
      <div class="d-flex justify-content-end">
        <label
          for="post-img"
          class="btn btn-dark text-light btn-sm m-1"
          id="select-img"
        >
          画像
          <input
            type="file"
            accept="image/*"
            ref="file"
            @change="onFileChange($event)"
            id="post-img"
          />
        </label>
        <div
          v-if="isValidContext"
          id="post-comment-button"
          @click="
            postComment(
              db,
              userId,
              stock,
              commentContext,
              replyMode,
              replyContext
            )
          "
          class="material-icons text-primary m-1"
          ref="file"
        >
          send
        </div>
      </div>
    </div>
    <div v-show="imageData !== ''" id="pre-img-items">
      <a :href="imageData" :data-lightbox="imageData">
        <img :src="imageData" id="pre-img" />
      </a>
      <button
        @click="resetFile()"
        id="reset-img"
        class="bg-dark rounded-circle text-white"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["stock", "user", "reply"],
  mounted: function () {
    this.autoResizeTextarea();
  },
  watch: {
    stock: {
      handler: function () {
        Object.assign(this.$data, this.$options.data.call(this));
      },
    },
    "reply.mode": {
      handler: function () {
        this.textareaPlaceholder = !this.reply.mode ? "コメント" : "返信";
      },
    },
  },
  data() {
    return {
      db: firebase.firestore(),
      st: firebase.storage(),
      commentContext: "",
      imageData: "",
      isValidContext: false,
      lineHeight: "15px",
      textareaPlaceholder: !this.reply.mode ? "コメント" : "返信",
      style: {
        postComment: {
          zIndex: 1200,
          position: "fixed",
          right: "10px",
          top: `${document.documentElement.clientHeight / 2}px`,
        },
      },
    };
  },

  methods: {
    postComment() {
      const docId = this.db.collection("comments").doc().id;
      const imgs = document.getElementById("post-img");
      const ta = document.getElementById("ta");
      if (imgs.files.length > 0) {
        for (let file of imgs.files) {
          this.st
            .ref()
            .child(`${docId}.jpg`)
            .put(file)
            .then(() => {
              this.st
                .ref()
                .child(`${docId}.jpg`)
                .getDownloadURL()
                .then((url) => {
                  //console.log(url);
                  this.db.collection("comments").doc(docId).set({
                    userId: this.user.id,
                    stock: this.stock,
                    context: this.commentContext,
                    likedCount: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    replyMode: this.reply.mode,
                    replyContext: this.reply.context,
                    imgUrl: url,
                  });
                  //console.log(imgs.files);
                  this.commentContext = "";
                  this.resetFile();
                  this.$emit("releaseReplyMode");
                  this.initializeTextarea(ta);
                })
                .catch(() => {
                  //console.log(error);
                  //console.log(imgs.files);
                  this.commentContext = "";
                  this.resetFile();
                  this.$emit("releaseReplyMode");
                  this.initializeTextarea(ta);
                });
            });
        }
      } else {
        this.db.collection("comments").doc(docId).set({
          userId: this.user.id,
          stock: this.stock,
          context: this.commentContext,
          likedCount: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          replyMode: this.reply.mode,
          replyContext: this.reply.context,
          imgUrl: null,
        });
        //console.log(imgs.files);
        this.commentContext = "";
        this.resetFile();
        this.$emit("releaseReplyMode");
        this.initializeTextarea(ta);
      }
    },
    autoResizeTextarea() {
      const ta = document.getElementById("ta");
      this.initializeTextarea(ta);
      ta.addEventListener("input", function (evt) {
        if (evt.target.scrollHeight > evt.target.offsetHeight) {
          evt.target.style.height = evt.target.scrollHeight + "px";
        } else {
          var height, lineHeight;
          for (;;) {
            height = Number(evt.target.style.height.split("px")[0]);
            lineHeight = Number(evt.target.style.lineHeight.split("px")[0]);
            evt.target.style.height = height - lineHeight + "px";
            if (evt.target.scrollHeight > evt.target.offsetHeight) {
              evt.target.style.height = evt.target.scrollHeight + "px";
              break;
            }
          }
        }
      });
    },
    initializeTextarea(ta) {
      ta.style.lineHeight = "20px"; //init
      ta.style.height = "30px"; //init
    },
    checkValidContext() {
      const imgs = document.getElementById("post-img");
      this.isValidContext =
        imgs.files.length > 0 || this.commentContext.trim() !== "";
      //console.log(imgs);
      //console.log(imgs.files);
      //console.log(imgs.value);
    },
    onFileChange(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
          //console.log(this.imageData);
        };
        reader.readAsDataURL(file);
      }
      this.checkValidContext();
    },
    resetFile() {
      const imgs = document.getElementById("post-img");
      imgs.value = "";
      this.imageData = "";
      this.checkValidContext();
    },
  },
};
</script>

<style>
#pre-img-items {
  z-index: 1400;
  position: fixed;
  width: 100px;
  height: 100px;
  right: 10px;
  bottom: 10px;
}
#pre-img {
  width: 100%;
  height: 100%;
}
#reset-img {
  position: absolute;
  z-index: 1900;
  top: 0px;
  right: 0px;
  height: 30px;
  width: 30px;
  text-align: center;
  line-height: 30px;
}
#post-img {
  display: none;
}
</style>