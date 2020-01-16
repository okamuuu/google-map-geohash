import Vue from 'vue';
import App from './app.vue';

import ChildMarker from './child-marker'

Vue.component('child-marker', ChildMarker);

new Vue({
  el: '#app',
  render:h => h(App)
});
