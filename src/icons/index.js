import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component
import AppFooter from '../components/AppFooter.vue';

// register globally
Vue.component('svg-icon', SvgIcon)
Vue.component('AppFooter', AppFooter);

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
