import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
// 登录验证拦截器
import '@/loginIntercepter'
import i18n from './lang'
// 弹窗拖拽
import dialogDrag from '@/utils/dialogDrag'
// 按钮级权限验证
import permission from '@/utils/permission'
import permissionConfig from '@/global/permissionConfig'

Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$permission_config = permissionConfig

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  dialogDrag,
  permission,
  template: '<App/>',
  components: { App }
})
