import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
//导入全局样式表
import './assets/css/global.css';
// 导入树形表格插件
import TreeTable from 'vue-table-with-tree-grid';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use((config) => {
  //   console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须return config
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
// 注册为全局可用组件
Vue.component('tree-table', TreeTable);
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor);

// 时间过滤器
Vue.filter('dateFormate', (originVal) => {
  const dt = new Date(originVal);
  // 得到年份
  const y = dt.getFullYear();
  // 得到月份，不足两位自动补0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  // 日期
  const d = (dt.getDate() + '').padStart(2, '0');
  // 小时
  const hh = (dt.getHours() + '').padStart(2, '0');
  // 分钟
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  // 秒
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
