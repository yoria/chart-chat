import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import './registerServiceWorker'

const firebaseConfig = {
  apiKey: "AIzaSyCCZa_oNaqW8MmFHTQKZ23Ra2tRQ4W4ihk",
  authDomain: "chart-chat.firebaseapp.com",
  databaseURL: "https://chart-chat.firebaseio.com",
  projectId: "chart-chat",
  storageBucket: "chart-chat.appspot.com",
  messagingSenderId: "751816137882",
  appId: "1:751816137882:web:f545e2215c484bc9341323",
  measurementId: "G-3YXR5WJQCY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
Vue.config.productionTip = false

firebase
  .auth()
  .signInAnonymously()
  .catch((error) => {
    this.error = `[error] Can not signin anonymouse (${error.code}:${error.message})`;
  });
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    Vue.prototype.$userId = user.uid;
    new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
});