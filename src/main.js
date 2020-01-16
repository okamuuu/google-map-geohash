import Vue from 'vue';
import App from './app.vue';

import ChildMarker from './child-marker'

Vue.component('ChildMarker', ChildMarker);

new Vue({
  el: '#app',
  render:h => h(App)
});
