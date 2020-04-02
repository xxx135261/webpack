import './index.scss';
import App from './App.vue';
import element from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';
Vue.use(element);
Vue.use(VueRouter);
Vue.use(Vuex);

new Vue({
	el: '#app',
	render: h => h(App)
})