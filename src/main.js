import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 自定义全局css
import "assets/css/global.css"

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'

// 引入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入vue-quill-editor所需样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


Vue.use(ElementUI);

Vue.component('tree-table', ZkTable);

Vue.use(VueQuillEditor);

// 过滤器：时间格式化
Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
