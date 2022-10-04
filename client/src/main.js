import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import VueEllipseProgress from 'vue-ellipse-progress';
import VueClipboard from 'vue-clipboard2'
// import Vconsole from 'vconsole';
// let vConsole = new Vconsole();
// export default vConsole;

router.beforeEach((to, from, next) => {
  nprogress.start();
  next();
})

router.afterEach(() => {
  nprogress.done();
})
Vue.use(ElementUI)
Vue.use(VueEllipseProgress);
Vue.use(VueClipboard)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
