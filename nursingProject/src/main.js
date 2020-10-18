// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import 'lib-flexible/flexible'
import Debounce from './utils/api';

Vue.component('Debounce',Debounce)
Vue.config.productionTip = false
Vue.use(Vant);
/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
export default vue
