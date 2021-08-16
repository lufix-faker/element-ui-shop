import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 自定义全局css
import "assets/css/global.css"

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

// 引入vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'


Vue.use(ElementUI);

Vue.component('tree-table', ZkTable);



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
