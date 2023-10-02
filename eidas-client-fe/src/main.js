import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import VModal from 'vue-js-modal'
import JsonExcel from 'vue-json-excel';
import Vuelidate from "vuelidate/src";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VModal);
Vue.use(Vuelidate);
Vue.component('downloadExcel', JsonExcel);
Vue.config.productionTip = false;

require('./assets/styles/main.css');
require('./assets/styles/flag.css');

Vue.use(PrimeVue, {
  locale: {
    firstDayOfWeek: 1,
    dayNames: ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"],
    dayNamesShort: ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"],
    dayNamesMin: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Съ"],
    monthNames: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"],
    monthNamesShort: ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"],
    clear: 'Изчисти',
    today: 'Днес'
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app');
