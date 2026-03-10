import './assets/css/global.styl'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import '@wangeditor/editor/dist/css/style.css' //wang编辑器样式
import "github-markdown-css/github-markdown.css" //md文档样式
import 'animate.css';//动效样式
import 'vant/lib/index.css'; //vant库样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import Vant from 'vant';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
// import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(ElementPlus)
// app.use(Vant)


//注册element全局图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
